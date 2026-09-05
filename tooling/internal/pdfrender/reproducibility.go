package pdfrender

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

const reproducibilityBuildCount = 2

// ReproducibilityOptions selects one non-publishing renderer acceptance run.
type ReproducibilityOptions struct {
	RepositoryRoot string
	SourceRef      string
	SourceRevision string
	ReceiptPath    string
}

// VerifyReproducibility rebuilds and executes the final renderer authority in
// two fresh, cache-free BuildKit builders and records the exact comparison.
func VerifyReproducibility(ctx context.Context, options ReproducibilityOptions) (_ ReproducibilityReceipt, returnError error) {
	configuration, err := Check(options.RepositoryRoot)
	if err != nil {
		return ReproducibilityReceipt{}, err
	}
	if err := verifySourceRevision(
		ctx,
		configuration.RepositoryRoot,
		options.SourceRef,
		options.SourceRevision,
	); err != nil {
		return ReproducibilityReceipt{}, err
	}
	return verifyReproducibilityWithDependencies(
		ctx,
		configuration,
		options.SourceRef,
		options.SourceRevision,
		options.ReceiptPath,
		remoteBuildContextPreparer{},
		localCommandExecutor{},
	)
}

func verifyReproducibilityWithDependencies(
	ctx context.Context,
	configuration Configuration,
	sourceRef, sourceRevision, receiptRelativePath string,
	preparer buildContextPreparer,
	executor commandExecutor,
) (_ ReproducibilityReceipt, returnError error) {
	if err := ValidateSourceRevision(sourceRef, sourceRevision); err != nil {
		return ReproducibilityReceipt{}, err
	}
	configuration, err := bindInstalledDependencies(ctx, configuration)
	if err != nil {
		return ReproducibilityReceipt{}, err
	}
	receiptPath, err := prepareReproducibilityReceiptPath(configuration.RepositoryRoot, receiptRelativePath)
	if err != nil {
		return ReproducibilityReceipt{}, err
	}
	retainedMismatchRoot := ""
	mismatchEvidenceCommitted := false
	defer func() {
		if retainedMismatchRoot == "" || mismatchEvidenceCommitted {
			return
		}
		if removeError := os.RemoveAll(retainedMismatchRoot); removeError != nil {
			returnError = errors.Join(
				returnError,
				fmt.Errorf("remove uncommitted PDF reproducibility mismatch evidence: %w", removeError),
			)
		}
	}()
	if err := prepareWritableRenderPaths(configuration.RepositoryRoot); err != nil {
		return ReproducibilityReceipt{}, err
	}
	publication, err := acquirePublicationLock(configuration.RepositoryRoot)
	if err != nil {
		return ReproducibilityReceipt{}, err
	}
	defer func() {
		if releaseError := publication.release(); releaseError != nil {
			returnError = errors.Join(returnError, releaseError)
		}
	}()

	totalDuration := 2*time.Duration(configuration.Lock.Limits.BuildSeconds)*time.Second +
		2*time.Duration(configuration.Lock.Limits.RenderSeconds)*time.Second + 5*time.Minute
	acceptanceContext, cancel := context.WithTimeout(ctx, totalDuration)
	defer cancel()
	temporaryRoot, err := os.MkdirTemp("", "20w-pdf-reproducibility-")
	if err != nil {
		return ReproducibilityReceipt{}, fmt.Errorf("create PDF reproducibility staging root: %w", err)
	}
	defer func() {
		if removeError := os.RemoveAll(temporaryRoot); removeError != nil {
			returnError = errors.Join(returnError, fmt.Errorf("remove PDF reproducibility staging root: %w", removeError))
		}
	}()

	contextRoot := filepath.Join(temporaryRoot, "context")
	if err := os.Mkdir(contextRoot, 0o755); err != nil {
		return ReproducibilityReceipt{}, fmt.Errorf("create PDF reproducibility build context: %w", err)
	}
	if err := verifyBuildxIdentity(acceptanceContext, configuration, executor); err != nil {
		return ReproducibilityReceipt{}, err
	}
	if err := preparer.prepare(acceptanceContext, configuration, contextRoot); err != nil {
		return ReproducibilityReceipt{}, fmt.Errorf("prepare PDF reproducibility build context: %w", err)
	}
	contextIdentity, err := inspectNormalizedBuildContext(
		acceptanceContext, contextRoot, configuration.Lock.SourceDateEpoch,
	)
	if err != nil {
		return ReproducibilityReceipt{}, err
	}
	runIdentity, err := randomIdentity(8)
	if err != nil {
		return ReproducibilityReceipt{}, err
	}

	ownedImageTags := make(map[string]struct{}, reproducibilityBuildCount)
	cleanedImages := false
	defer func() {
		if !cleanedImages {
			returnError = errors.Join(
				returnError,
				removeOwnedImages(configuration, executor, ownedImageTags),
			)
		}
	}()
	builds := make([]ReproducibilityBuild, 0, reproducibilityBuildCount)
	for index := 0; index < reproducibilityBuildCount; index++ {
		imageTag := fmt.Sprintf("20w-pdf-reproducibility:%s-%d", runIdentity, index+1)
		ownedImageTags[imageTag] = struct{}{}
		build, buildError := reproducibilityBuild(
			acceptanceContext, configuration, executor, contextRoot, temporaryRoot, sourceRef, sourceRevision, imageTag, index,
		)
		if buildError != nil {
			return ReproducibilityReceipt{}, buildError
		}
		builds = append(builds, build)
	}
	comparison := compareReproducibilityBuilds(builds[0], builds[1])
	receipt := newReproducibilityReceipt(
		configuration, sourceRef, sourceRevision, contextIdentity, builds, comparison,
	)
	if receipt.Status != "pass" {
		evidence, err := retainReproducibilityMismatch(
			configuration.RepositoryRoot, receiptPath, builds, os.RemoveAll,
		)
		if err != nil {
			return receipt, err
		}
		receipt.MismatchEvidence = evidence
		retainedMismatchRoot = filepath.Join(
			configuration.RepositoryRoot, filepath.FromSlash(evidence.Root),
		)
	}
	if err := checkAuthorityUnchanged(ctx, configuration); err != nil {
		return ReproducibilityReceipt{}, err
	}
	if err := writeReproducibilityReceipt(receiptPath, receipt); err != nil {
		return ReproducibilityReceipt{}, err
	}
	mismatchEvidenceCommitted = true
	var comparisonError error
	if receipt.Status != "pass" {
		comparisonError = fmt.Errorf(
			"PDF renderer reproducibility comparison failed; inspect the retained receipt and %s",
			receipt.MismatchEvidence.Root,
		)
	}
	cleanupError := removeOwnedImages(configuration, executor, ownedImageTags)
	if cleanupError == nil {
		cleanedImages = true
	}
	return receipt, errors.Join(comparisonError, cleanupError)
}

func reproducibilityBuild(
	ctx context.Context,
	configuration Configuration,
	executor commandExecutor,
	contextRoot, temporaryRoot, sourceRef, sourceRevision, imageTag string,
	index int,
) (result ReproducibilityBuild, returnError error) {
	label := fmt.Sprintf("build-%d", index+1)
	builderName, err := createLockedBuilder(ctx, configuration, executor)
	if err != nil {
		return result, err
	}
	builderActive := true
	defer func() {
		if builderActive {
			returnError = errors.Join(returnError, removeBuilder(executor, builderName, configuration.Lock.Limits.OutputBytes))
		}
	}()
	iidPath := filepath.Join(temporaryRoot, label+".iid")
	metadataPath := filepath.Join(temporaryRoot, label+".metadata.json")
	output, err := executor.run(ctx, commandRequest{
		operation:  "build reproducibility PDF renderer image " + label,
		directory:  configuration.RepositoryRoot,
		timeout:    time.Duration(configuration.Lock.Limits.BuildSeconds) * time.Second,
		outputSize: configuration.Lock.Limits.OutputBytes,
		arguments: reproducibilityBuildArguments(
			configuration, builderName, contextRoot, iidPath, metadataPath, imageTag,
		),
	})
	if err != nil {
		return result, err
	}
	if err := rejectTimestampRewriteWarnings(output); err != nil {
		return result, err
	}
	imageID, err := readImageID(iidPath)
	if err != nil {
		return result, err
	}
	result.ImageID = imageID
	result.Sequence = index + 1
	metadata, err := readReproducibilityBuildMetadata(temporaryRoot, metadataPath)
	if err != nil {
		return result, err
	}
	configDigest, err := inspectLoadedImageConfig(ctx, configuration, executor, imageTag, imageID)
	if err != nil {
		return result, err
	}
	if err := removeBuilder(executor, builderName, configuration.Lock.Limits.OutputBytes); err != nil {
		return result, err
	}
	builderActive = false
	if err := checkAuthorityUnchanged(ctx, configuration); err != nil {
		return result, err
	}

	outputDirectory := filepath.Join(temporaryRoot, label, "downloads")
	workspaceDirectory := filepath.Join(temporaryRoot, label, "workspace-tmp")
	for _, directory := range []string{outputDirectory, workspaceDirectory} {
		if err := os.MkdirAll(directory, 0o755); err != nil {
			return result, fmt.Errorf("create isolated PDF reproducibility directory: %w", err)
		}
	}
	if err := runRendererOnce(ctx, configuration, executor, imageID, sourceRef, sourceRevision, outputDirectory, workspaceDirectory); err != nil {
		return result, err
	}
	pair, err := inspectReproducibilityPair(outputDirectory)
	if err != nil {
		return result, err
	}
	result.ManifestDigest = metadata.ManifestDigest
	result.ConfigDigest = configDigest
	result.Pair = pair
	return result, checkAuthorityUnchanged(ctx, configuration)
}

func reproducibilityBuildArguments(
	configuration Configuration,
	builderName, contextRoot, iidPath, metadataPath, imageTag string,
) []string {
	base := buildArguments(configuration, builderName, contextRoot, iidPath)
	arguments := make([]string, 0, len(base)+5)
	arguments = append(arguments, base[:len(base)-1]...)
	arguments = append(
		arguments,
		"--no-cache",
		"--metadata-file", metadataPath,
		"--progress", "plain",
		"--tag", imageTag,
	)
	return append(arguments, base[len(base)-1])
}

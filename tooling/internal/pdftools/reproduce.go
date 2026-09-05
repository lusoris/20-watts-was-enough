package pdftools

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"time"
)

// ReproductionOptions selects one local, non-publishing final-image
// reproduction. ReceiptPath is a new repository-relative JSON file.
type ReproductionOptions struct {
	RepositoryRoot string
	ReceiptPath    string
	Candidate      *CandidateOutputOptions
}

// ReproduceFinalImage builds and compares two complete local PDF-tools images.
// When three explicit candidate paths are supplied, it also retains one exact
// final archive, the byte-identical canonical apko SPDX output, and a checksum-closed
// source bundle. It never pushes, publishes, or grants scientific or release
// authority.
func ReproduceFinalImage(
	ctx context.Context,
	options ReproductionOptions,
) (_ ReproductionReceipt, returnError error) {
	authority, err := checkAuthority(options.RepositoryRoot)
	if err != nil {
		return ReproductionReceipt{}, err
	}
	receiptPath, err := prepareReproductionReceiptPath(authority.root, options.ReceiptPath)
	if err != nil {
		return ReproductionReceipt{}, err
	}
	candidatePlan, err := prepareCandidateOutputPlan(authority, options.Candidate, options.ReceiptPath)
	if err != nil {
		return ReproductionReceipt{}, err
	}
	totalDuration := 6*time.Duration(authority.contract.Limits.BuildSeconds)*time.Second +
		6*time.Duration(authority.contract.Limits.RuntimeSeconds)*time.Second + 5*time.Minute
	reproductionContext, cancel := context.WithTimeout(ctx, totalDuration)
	defer cancel()
	temporaryRoot, err := os.MkdirTemp("", "20w-pdf-tools-reproduction-")
	if err != nil {
		return ReproductionReceipt{}, fmt.Errorf("create PDF-tools reproduction staging root: %w", err)
	}
	defer func() {
		if removeError := os.RemoveAll(temporaryRoot); removeError != nil {
			returnError = errors.Join(returnError, fmt.Errorf("remove PDF-tools reproduction staging root: %w", removeError))
		}
	}()
	executor := localDockerExecutor{}
	comparator, err := currentComparatorIdentity(authority.root)
	if err != nil {
		return ReproductionReceipt{}, err
	}
	if err := verifyLocalDockerEndpoint(reproductionContext, executor, authority); err != nil {
		return ReproductionReceipt{}, err
	}
	if err := verifyBuildxIdentity(reproductionContext, executor, authority); err != nil {
		return ReproductionReceipt{}, err
	}
	apkoBuilder, err := inspectApkoBuilderIdentity(reproductionContext, executor, authority)
	if err != nil {
		return ReproductionReceipt{}, err
	}

	bases := make([]baseBuild, 0, reproductionBuildCount)
	for sequence := 1; sequence <= reproductionBuildCount; sequence++ {
		build, err := runApkoBuild(reproductionContext, executor, authority, temporaryRoot, sequence)
		if err != nil {
			return ReproductionReceipt{}, err
		}
		if err := ensureAuthorityUnchanged(authority); err != nil {
			return ReproductionReceipt{}, err
		}
		bases = append(bases, build)
	}
	baseArchiveEqual, err := equalRegularFiles(
		bases[0].Archive, bases[1].Archive, authority.contract.Limits.BaseArchiveBytes,
	)
	if err != nil {
		return ReproductionReceipt{}, err
	}

	contextRoot := filepath.Join(temporaryRoot, "notice-context")
	if err := os.Mkdir(contextRoot, 0o700); err != nil {
		return ReproductionReceipt{}, fmt.Errorf("create PDF-tools final-image context: %w", err)
	}
	contextIdentity, err := prepareNoticeContext(reproductionContext, contextRoot, authority)
	if err != nil {
		return ReproductionReceipt{}, err
	}
	finals := make([]finalBuild, 0, reproductionBuildCount)
	inspections := make([]layerInspection, 0, reproductionBuildCount)
	contextStable := true
	for sequence := 1; sequence <= reproductionBuildCount; sequence++ {
		build, err := runFinalBuild(
			reproductionContext, executor, authority, bases[sequence-1], contextRoot, temporaryRoot, sequence,
		)
		if err != nil {
			return ReproductionReceipt{}, err
		}
		currentContext, err := inspectNoticeContext(reproductionContext, contextRoot, authority.contract)
		if err != nil {
			return ReproductionReceipt{}, err
		}
		contextStable = contextStable && currentContext == contextIdentity
		inspection, err := inspectFinalLayers(reproductionContext, build.Image, authority.contract)
		if err != nil {
			return ReproductionReceipt{}, err
		}
		finals = append(finals, build)
		inspections = append(inspections, inspection)
	}
	finalArchiveEqual, err := equalRegularFiles(
		finals[0].Archive, finals[1].Archive, authority.contract.Limits.FinalArchiveBytes,
	)
	if err != nil {
		return ReproductionReceipt{}, err
	}
	comparison := compareReproduction(
		bases, finals, inspections, baseArchiveEqual, finalArchiveEqual, contextStable,
	)
	receipt := newReproductionReceipt(authority, apkoBuilder, comparator, contextIdentity, bases, finals, inspections[0], comparison, nil)
	if !comparison.ConstructionMatch {
		if err := ensureReproductionInputsUnchanged(authority, comparator); err != nil {
			return ReproductionReceipt{}, err
		}
		if err := writeReproductionReceipt(authority.root, receiptPath, receipt, authority.contract.Limits.ReceiptBytes); err != nil {
			return ReproductionReceipt{}, err
		}
		return receipt, errors.New("PDF-tools final-image reproduction mismatch; inspect the retained NO_RESULT receipt")
	}
	runtimeObservation, err := inspectFinalRuntime(reproductionContext, executor, authority, finals[0])
	if err != nil {
		return ReproductionReceipt{}, err
	}
	comparison.Runtime = true
	comparison.AllMatch = comparison.ConstructionMatch && comparison.Runtime
	return finishSuccessfulReproduction(
		reproductionContext, authority, receiptPath, candidatePlan, apkoBuilder, comparator,
		contextIdentity, bases, finals, inspections[0], comparison, runtimeObservation,
	)
}

func finishSuccessfulReproduction(
	ctx context.Context,
	authority checkedAuthority,
	receiptPath string,
	plan *candidateOutputPlan,
	apkoBuilder apkoBuilderIdentity,
	comparator ReproductionComparator,
	contextIdentity noticeContextIdentity,
	bases []baseBuild,
	finals []finalBuild,
	inspection layerInspection,
	comparison ReproductionComparison,
	runtimeObservation RuntimeObservation,
) (_ ReproductionReceipt, returnError error) {
	if err := ensureReproductionInputsUnchanged(authority, comparator); err != nil {
		return ReproductionReceipt{}, err
	}
	if plan == nil {
		receipt := newReproductionReceipt(
			authority, apkoBuilder, comparator, contextIdentity, bases, finals, inspection, comparison, nil,
		)
		receipt.Runtime = &runtimeObservation
		if err := writeReproductionReceipt(authority.root, receiptPath, receipt, authority.contract.Limits.ReceiptBytes); err != nil {
			return ReproductionReceipt{}, err
		}
		return receipt, nil
	}
	downloader, err := newCandidateDownloader(time.Duration(authority.contract.Limits.BuildSeconds) * time.Second)
	if err != nil {
		return ReproductionReceipt{}, err
	}
	defer downloader.close()
	staged, err := stageCandidateOutputs(ctx, authority, plan, bases, finals, downloader.fetch)
	if err != nil {
		return ReproductionReceipt{}, err
	}
	defer func() { returnError = errors.Join(returnError, staged.cleanup()) }()
	if err := ensureReproductionInputsUnchanged(authority, comparator); err != nil {
		return ReproductionReceipt{}, err
	}
	receipt := newReproductionReceipt(
		authority, apkoBuilder, comparator, contextIdentity, bases, finals, inspection, comparison, staged.receipt(authority),
	)
	receipt.Runtime = &runtimeObservation
	if err := staged.install(authority.root); err != nil {
		return ReproductionReceipt{}, err
	}
	installed := true
	defer func() {
		if returnError != nil && installed {
			returnError = errors.Join(returnError, removeInstalledCandidateArtifacts(staged.artifacts))
		}
	}()
	if err := ensureReproductionInputsUnchanged(authority, comparator); err != nil {
		return ReproductionReceipt{}, err
	}
	if err := writeReproductionReceiptChecked(
		authority.root,
		receiptPath,
		receipt,
		authority.contract.Limits.ReceiptBytes,
		func() error { return staged.verifyInstalled(authority.root, receipt.Candidate) },
	); err != nil {
		return ReproductionReceipt{}, err
	}
	installed = false
	return receipt, nil
}

func ensureReproductionInputsUnchanged(authority checkedAuthority, comparator ReproductionComparator) error {
	if err := ensureAuthorityUnchanged(authority); err != nil {
		return err
	}
	current, err := currentComparatorIdentity(authority.root)
	if err != nil || current != comparator {
		return errors.New("PDF-tools comparator identity changed during local reproduction")
	}
	return nil
}

func compareReproduction(
	bases []baseBuild,
	finals []finalBuild,
	inspections []layerInspection,
	baseArchiveEqual, finalArchiveEqual, contextStable bool,
) ReproductionComparison {
	comparison := ReproductionComparison{
		BaseArchiveBytes:     baseArchiveEqual,
		BaseManifest:         bases[0].Image.ManifestDigest == bases[1].Image.ManifestDigest,
		BaseConfig:           bases[0].Image.ConfigDigest == bases[1].Image.ConfigDigest,
		BaseLayers:           slices.Equal(bases[0].Image.LayerDigests, bases[1].Image.LayerDigests),
		BaseDiffIDs:          slices.Equal(bases[0].Image.LayerDiffIDs, bases[1].Image.LayerDiffIDs),
		SPDXCanonicalBytes:   bytes.Equal(bases[0].SPDX.canonical, bases[1].SPDX.canonical),
		SPDXIndexCanonical:   bytes.Equal(bases[0].SPDXIndex.canonical, bases[1].SPDXIndex.canonical),
		NoticeContextStable:  contextStable,
		FinalArchiveBytes:    finalArchiveEqual,
		FinalManifest:        finals[0].Image.Identity.ManifestDigest == finals[1].Image.Identity.ManifestDigest,
		FinalConfig:          finals[0].Image.Identity.ConfigDigest == finals[1].Image.Identity.ConfigDigest,
		FinalLayers:          slices.Equal(finals[0].Image.Identity.LayerDigests, finals[1].Image.Identity.LayerDigests),
		FinalDiffIDs:         slices.Equal(finals[0].Image.Identity.LayerDiffIDs, finals[1].Image.Identity.LayerDiffIDs),
		NoticeFiles:          slices.Equal(inspections[0].Notices, inspections[1].Notices),
		ManPages:             slices.Equal(inspections[0].ManPages, inspections[1].ManPages),
		ForbiddenPathsAbsent: len(inspections[0].ForbiddenPaths) == 0 && len(inspections[1].ForbiddenPaths) == 0,
	}
	comparison.ConstructionMatch = comparison.BaseArchiveBytes && comparison.BaseManifest && comparison.BaseConfig &&
		comparison.BaseLayers && comparison.BaseDiffIDs && comparison.SPDXCanonicalBytes &&
		comparison.SPDXIndexCanonical && comparison.NoticeContextStable && comparison.FinalArchiveBytes &&
		comparison.FinalManifest && comparison.FinalConfig && comparison.FinalLayers && comparison.FinalDiffIDs &&
		comparison.NoticeFiles && comparison.ManPages && comparison.ForbiddenPathsAbsent
	return comparison
}

package pdftools

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strings"
)

// CandidateOutputOptions selects three new, repository-relative local release
// inputs. The set is all-or-none and never performs a remote publication.
type CandidateOutputOptions struct {
	FinalArchivePath string
	SPDXPath         string
	SourceBundlePath string
}

type candidateOutputPath struct {
	relative string
	absolute string
}

type candidateOutputPlan struct {
	finalArchive candidateOutputPath
	spdx         candidateOutputPath
	sourceBundle candidateOutputPath
}

type stagedCandidateArtifact struct {
	parentRoot           *os.Root
	parentPath           string
	parentInformation    os.FileInfo
	temporaryName        string
	temporaryInformation os.FileInfo
	destination          candidateOutputPath
	destinationName      string
	identity             ReproductionArtifact
	publishedInformation os.FileInfo
}

type stagedCandidate struct {
	artifacts     []*stagedCandidateArtifact
	bundle        sourceBundleIdentity
	retainedAPKs  int
	retainedBytes int64
}

func prepareCandidateOutputPlan(
	authority checkedAuthority,
	options *CandidateOutputOptions,
	receiptPath string,
) (*candidateOutputPlan, error) {
	if options == nil {
		return nil, nil
	}
	values := []string{options.FinalArchivePath, options.SPDXPath, options.SourceBundlePath}
	if slices.Contains(values, "") {
		return nil, errors.New("PDF-tools candidate output paths are an all-or-none set")
	}
	finalArchive, err := prepareCandidateOutputPath(authority.root, options.FinalArchivePath, ".tar", "final OCI archive")
	if err != nil {
		return nil, err
	}
	spdx, err := prepareCandidateOutputPath(authority.root, options.SPDXPath, ".spdx.json", "apko SPDX")
	if err != nil {
		return nil, err
	}
	bundle, err := prepareCandidateOutputPath(authority.root, options.SourceBundlePath, ".tar.gz", "source bundle")
	if err != nil {
		return nil, err
	}
	if filepath.Base(bundle.relative) != authority.contract.SourceDelivery.CandidateBundle {
		return nil, errors.New("PDF-tools source-bundle filename differs from contract.json")
	}
	paths := []string{filepath.Clean(receiptPath), finalArchive.relative, spdx.relative, bundle.relative}
	for left, value := range paths {
		for right := left + 1; right < len(paths); right++ {
			if outputPathsConflict(value, paths[right]) {
				return nil, errors.New("PDF-tools receipt and candidate output paths must be distinct non-ancestor paths")
			}
		}
	}
	outputs := []candidateOutputPath{finalArchive, spdx, bundle}
	for _, output := range outputs {
		if err := prepareCandidateOutputDirectory(authority.root, output); err != nil {
			return nil, err
		}
	}
	return &candidateOutputPlan{
		finalArchive: finalArchive, spdx: spdx, sourceBundle: bundle,
	}, nil
}

func outputPathsConflict(left, right string) bool {
	left = filepath.Clean(left)
	right = filepath.Clean(right)
	separator := string(filepath.Separator)
	return left == right || strings.HasPrefix(left, right+separator) || strings.HasPrefix(right, left+separator)
}

func prepareCandidateOutputPath(root, relative, suffix, label string) (candidateOutputPath, error) {
	normalized := filepath.ToSlash(relative)
	if strings.Contains(relative, "\\") || containsConfusingPathControl(relative) ||
		!validRelativePath(normalized) || !strings.HasSuffix(normalized, suffix) ||
		!allowedReproductionOutputPath(normalized) {
		return candidateOutputPath{}, fmt.Errorf("PDF-tools %s must be a safe repository-relative %s path under publication or release evidence", label, suffix)
	}
	clean := filepath.Clean(relative)
	destination := filepath.Join(root, clean)
	return candidateOutputPath{relative: filepath.ToSlash(clean), absolute: destination}, nil
}

func prepareCandidateOutputDirectory(root string, output candidateOutputPath) error {
	if err := requireReproductionDirectory(root, filepath.Dir(output.relative)); err != nil {
		return err
	}
	destination := output.absolute
	if _, err := os.Lstat(destination); err == nil {
		return fmt.Errorf("PDF-tools candidate output %s already exists", output.relative)
	} else if !errors.Is(err, os.ErrNotExist) {
		return fmt.Errorf("inspect PDF-tools candidate output %s: %w", output.relative, err)
	}
	return nil
}

func allowedReproductionOutputPath(relative string) bool {
	return slices.ContainsFunc([]string{
		".workingdir2/evidence/publication/",
		"build/evidence/",
		"build/release-inputs/",
	}, func(prefix string) bool { return strings.HasPrefix(relative, prefix) })
}

func stageCandidateOutputs(
	ctx context.Context,
	authority checkedAuthority,
	plan *candidateOutputPlan,
	bases []baseBuild,
	finals []finalBuild,
	fetch sourceFetcher,
) (_ *stagedCandidate, returnError error) {
	if plan == nil || len(bases) != reproductionBuildCount || len(finals) != reproductionBuildCount {
		return nil, errors.New("candidate staging requires one complete two-build comparison")
	}
	if !slices.Equal(bases[0].SPDX.canonical, bases[1].SPDX.canonical) {
		return nil, errors.New("candidate preparation requires byte-identical canonical apko SPDX outputs")
	}
	entries, err := candidateSourceEntries(ctx, authority, bases[0].SPDX, fetch)
	if err != nil {
		return nil, err
	}
	staged := &stagedCandidate{
		artifacts:    make([]*stagedCandidateArtifact, 0, 3),
		retainedAPKs: len(authority.retention.Packages), retainedBytes: authority.retention.TotalBytes,
	}
	defer func() {
		if returnError != nil {
			returnError = errors.Join(returnError, staged.cleanup())
		}
	}()
	finalArtifact, err := stageCandidateRegular(
		authority.root, finals[0].Archive, plan.finalArchive, authority.contract.Limits.FinalArchiveBytes,
		finals[0].Image.Identity.ArchiveSHA256,
	)
	if err != nil {
		return nil, err
	}
	staged.artifacts = append(staged.artifacts, finalArtifact)
	spdxArtifact, err := stageCandidateBytes(
		authority.root, bases[0].SPDX.canonical, plan.spdx, authority.contract.Limits.SPDXBytes,
		bases[0].SPDX.CanonicalSHA256,
	)
	if err != nil {
		return nil, err
	}
	staged.artifacts = append(staged.artifacts, spdxArtifact)
	bundleArtifact, bundle, err := stageCandidateBundle(authority, plan.sourceBundle, entries)
	if err != nil {
		return nil, err
	}
	staged.artifacts = append(staged.artifacts, bundleArtifact)
	staged.bundle = bundle
	return staged, nil
}

func stageCandidateRegular(
	root string,
	source string,
	destination candidateOutputPath,
	maximum int64,
	expectedSHA256 string,
) (_ *stagedCandidateArtifact, returnError error) {
	input, err := openBoundedRegular(source, maximum, "retained final OCI archive")
	if err != nil {
		return nil, err
	}
	defer input.Close()
	staged, output, err := newStagedCandidateArtifact(root, destination)
	if err != nil {
		return nil, err
	}
	defer func() {
		if returnError != nil {
			_ = output.Close()
			returnError = errors.Join(returnError, staged.cleanup())
		}
	}()
	hasher := sha256.New()
	written, err := io.Copy(io.MultiWriter(output, hasher), io.LimitReader(input, maximum+1))
	if err != nil || written <= 0 || written > maximum || hex.EncodeToString(hasher.Sum(nil)) != expectedSHA256 {
		return nil, errors.New("retained final OCI archive differs from the reproduced identity")
	}
	if err := verifyOpenedRegular(source, input, written, "retained final OCI archive"); err != nil {
		return nil, err
	}
	if err := finishStagedCandidateArtifact(staged, output, written, expectedSHA256); err != nil {
		return nil, err
	}
	return staged, nil
}

func stageCandidateBytes(
	root string,
	body []byte,
	destination candidateOutputPath,
	maximum int64,
	expectedSHA256 string,
) (_ *stagedCandidateArtifact, returnError error) {
	if len(body) == 0 || int64(len(body)) > maximum || digestRaw(body) != expectedSHA256 {
		return nil, errors.New("retained candidate bytes differ from their authority")
	}
	staged, output, err := newStagedCandidateArtifact(root, destination)
	if err != nil {
		return nil, err
	}
	defer func() {
		if returnError != nil {
			_ = output.Close()
			returnError = errors.Join(returnError, staged.cleanup())
		}
	}()
	if _, err := output.Write(body); err != nil {
		return nil, fmt.Errorf("write retained candidate bytes: %w", err)
	}
	if err := finishStagedCandidateArtifact(staged, output, int64(len(body)), expectedSHA256); err != nil {
		return nil, err
	}
	return staged, nil
}

func stageCandidateBundle(
	authority checkedAuthority,
	destination candidateOutputPath,
	entries []sourceBundleEntry,
) (_ *stagedCandidateArtifact, _ sourceBundleIdentity, returnError error) {
	staged, output, err := newStagedCandidateArtifact(authority.root, destination)
	if err != nil {
		return nil, sourceBundleIdentity{}, err
	}
	defer func() {
		if returnError != nil {
			_ = output.Close()
			returnError = errors.Join(returnError, staged.cleanup())
		}
	}()
	contract := authority.contract
	identity, err := writeDeterministicSourceBundle(
		output, entries, contract.SourceDelivery.BundleLayout,
		contract.SourceDateEpoch, contract.Limits.SourceBundleBytes,
	)
	if err != nil {
		return nil, sourceBundleIdentity{}, err
	}
	second, err := writeDeterministicSourceBundle(
		io.Discard, entries, contract.SourceDelivery.BundleLayout,
		contract.SourceDateEpoch, contract.Limits.SourceBundleBytes,
	)
	if err != nil || identity != second {
		return nil, sourceBundleIdentity{}, errors.New("source bundle did not reproduce deterministically")
	}
	if err := finishStagedCandidateArtifact(staged, output, identity.Bytes, identity.SHA256); err != nil {
		return nil, sourceBundleIdentity{}, err
	}
	return staged, identity, nil
}

const candidateStagingAttempts = 8

func newStagedCandidateArtifact(
	root string,
	destination candidateOutputPath,
) (_ *stagedCandidateArtifact, _ *os.File, returnError error) {
	parentPath := filepath.Dir(destination.absolute)
	if err := rejectLinkedPath(root, parentPath, "candidate output directory"); err != nil {
		return nil, nil, err
	}
	namedParentInformation, err := os.Lstat(parentPath)
	if err != nil || !namedParentInformation.IsDir() || namedParentInformation.Mode()&os.ModeSymlink != 0 {
		return nil, nil, errors.New("candidate output directory must be a real directory")
	}
	parentRoot, err := os.OpenRoot(parentPath)
	if err != nil {
		return nil, nil, fmt.Errorf("open candidate output directory: %w", err)
	}
	defer func() {
		if returnError != nil {
			returnError = errors.Join(returnError, parentRoot.Close())
		}
	}()
	parentInformation, err := parentRoot.Stat(".")
	if err != nil || !parentInformation.IsDir() || !os.SameFile(namedParentInformation, parentInformation) {
		return nil, nil, errors.New("candidate output directory changed while it was opened")
	}
	destinationName := filepath.Base(destination.absolute)
	if destinationName == "." || destinationName == string(filepath.Separator) ||
		filepath.Base(destination.relative) != destinationName {
		return nil, nil, errors.New("candidate output filename is invalid")
	}
	if _, err := parentRoot.Lstat(destinationName); err == nil {
		return nil, nil, errors.New("candidate output appeared before staging")
	} else if !errors.Is(err, os.ErrNotExist) {
		return nil, nil, fmt.Errorf("inspect candidate output before staging: %w", err)
	}
	for attempt := 0; attempt < candidateStagingAttempts; attempt++ {
		token := make([]byte, 16)
		if _, err := rand.Read(token); err != nil {
			return nil, nil, fmt.Errorf("generate candidate output staging name: %w", err)
		}
		temporaryName := ".20w-pdf-tools-candidate-" + hex.EncodeToString(token) + ".tmp"
		file, err := parentRoot.OpenFile(temporaryName, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o600)
		if errors.Is(err, os.ErrExist) {
			continue
		}
		if err != nil {
			return nil, nil, fmt.Errorf("create candidate output staging file: %w", err)
		}
		information, err := file.Stat()
		if err != nil || !information.Mode().IsRegular() || information.Mode()&os.ModeSymlink != 0 {
			_ = file.Close()
			if information != nil {
				_ = removeOwnedCandidateFile(parentRoot, temporaryName, information)
			}
			return nil, nil, errors.New("candidate output staging file is not a regular file")
		}
		return &stagedCandidateArtifact{
			parentRoot: parentRoot, parentPath: parentPath, parentInformation: parentInformation,
			temporaryName: temporaryName, temporaryInformation: information,
			destination: destination, destinationName: destinationName,
		}, file, nil
	}
	return nil, nil, errors.New("candidate output staging-name attempts were exhausted")
}

func finishStagedCandidateArtifact(
	staged *stagedCandidateArtifact,
	file *os.File,
	size int64,
	sha256 string,
) error {
	if staged == nil || staged.parentRoot == nil || staged.temporaryName == "" ||
		size <= 0 || !rawDigestPattern.MatchString(sha256) {
		return errors.New("candidate output identity is invalid")
	}
	if err := file.Chmod(0o644); err != nil {
		return fmt.Errorf("normalise candidate output mode: %w", err)
	}
	if err := file.Sync(); err != nil {
		return fmt.Errorf("sync candidate output staging file: %w", err)
	}
	if err := file.Close(); err != nil {
		return fmt.Errorf("close candidate output staging file: %w", err)
	}
	information, err := staged.parentRoot.Lstat(staged.temporaryName)
	if err != nil || !information.Mode().IsRegular() || information.Mode()&os.ModeSymlink != 0 ||
		!os.SameFile(staged.temporaryInformation, information) || information.Size() != size {
		return errors.New("candidate output staging file changed before local placement")
	}
	staged.identity = ReproductionArtifact{Path: staged.destination.relative, SHA256: sha256, Bytes: size}
	return nil
}

func (staged *stagedCandidate) install(root string) (returnError error) {
	installed := make([]*stagedCandidateArtifact, 0, len(staged.artifacts))
	defer func() {
		if returnError != nil {
			returnError = errors.Join(returnError, removeInstalledCandidateArtifacts(installed))
		}
	}()
	for _, artifact := range staged.artifacts {
		if err := verifyCandidateOutputParent(root, artifact); err != nil {
			return err
		}
		if _, err := artifact.parentRoot.Lstat(artifact.destinationName); !errors.Is(err, os.ErrNotExist) {
			return errors.New("candidate output appeared before atomic placement")
		}
		if err := artifact.parentRoot.Link(artifact.temporaryName, artifact.destinationName); err != nil {
			return fmt.Errorf("atomically place candidate output: %w", err)
		}
		installed = append(installed, artifact)
		temporaryInfo, temporaryError := artifact.parentRoot.Lstat(artifact.temporaryName)
		finalInfo, finalError := artifact.parentRoot.Lstat(artifact.destinationName)
		if temporaryError != nil || finalError != nil || !finalInfo.Mode().IsRegular() ||
			finalInfo.Mode()&os.ModeSymlink != 0 || !os.SameFile(artifact.temporaryInformation, temporaryInfo) ||
			!os.SameFile(temporaryInfo, finalInfo) ||
			finalInfo.Size() != artifact.identity.Bytes {
			return errors.New("candidate output changed during atomic placement")
		}
		artifact.publishedInformation = finalInfo
	}
	for _, artifact := range staged.artifacts {
		if err := removeOwnedCandidateFile(
			artifact.parentRoot, artifact.temporaryName, artifact.temporaryInformation,
		); err != nil {
			return fmt.Errorf("remove candidate output staging link: %w", err)
		}
		artifact.temporaryName = ""
	}
	if err := syncCandidateOutputDirectories(staged.artifacts); err != nil {
		return err
	}
	return nil
}

func (staged *stagedCandidate) verifyInstalled(root string, receipt *ReproductionCandidate) error {
	if staged == nil || receipt == nil || len(staged.artifacts) != 3 {
		return errors.New("candidate receipt requires exactly three installed outputs")
	}
	expected := []ReproductionArtifact{
		receipt.FinalArchive,
		receipt.CanonicalSPDX,
		receipt.SourceBundle.ReproductionArtifact,
	}
	for index, artifact := range staged.artifacts {
		if artifact == nil || artifact.identity != expected[index] ||
			artifact.identity.Path != artifact.destination.relative ||
			!validRelativePath(artifact.identity.Path) || containsConfusingPathControl(artifact.identity.Path) ||
			filepath.Clean(artifact.destination.absolute) != filepath.Join(root, filepath.FromSlash(artifact.identity.Path)) {
			return errors.New("installed candidate output identity differs from the receipt")
		}
		if err := verifyInstalledCandidateArtifact(root, artifact); err != nil {
			return err
		}
	}
	for _, artifact := range staged.artifacts {
		label := "installed PDF-tools candidate output " + artifact.identity.Path
		if err := verifyCandidateOutputParent(root, artifact); err != nil {
			return err
		}
		current, err := artifact.parentRoot.Lstat(artifact.destinationName)
		if err != nil || !sameCandidatePublication(current, artifact.publishedInformation, artifact.identity.Bytes) {
			return fmt.Errorf("%s changed before receipt publication", label)
		}
	}
	return nil
}

func verifyInstalledCandidateArtifact(root string, artifact *stagedCandidateArtifact) error {
	label := "installed PDF-tools candidate output " + artifact.identity.Path
	if artifact.parentRoot == nil || artifact.destinationName == "" || artifact.publishedInformation == nil ||
		artifact.identity.Bytes <= 0 ||
		!rawDigestPattern.MatchString(artifact.identity.SHA256) {
		return fmt.Errorf("%s has no stable publication identity", label)
	}
	if err := verifyCandidateOutputParent(root, artifact); err != nil {
		return err
	}
	current, err := artifact.parentRoot.Lstat(artifact.destinationName)
	if err != nil || !sameCandidatePublication(current, artifact.publishedInformation, artifact.identity.Bytes) {
		return fmt.Errorf("%s changed after atomic placement", label)
	}
	file, err := artifact.parentRoot.Open(artifact.destinationName)
	if err != nil {
		return fmt.Errorf("open %s for receipt verification: %w", label, err)
	}
	opened, err := file.Stat()
	if err != nil || !sameCandidatePublication(opened, artifact.publishedInformation, artifact.identity.Bytes) ||
		!os.SameFile(opened, current) {
		_ = file.Close()
		return fmt.Errorf("%s changed while it was reopened", label)
	}
	hasher := sha256.New()
	written, copyError := io.Copy(hasher, io.LimitReader(file, artifact.identity.Bytes+1))
	digest := hex.EncodeToString(hasher.Sum(nil))
	if copyError != nil || written != artifact.identity.Bytes || digest != artifact.identity.SHA256 {
		_ = file.Close()
		return fmt.Errorf("%s bytes differ from the receipt identity", label)
	}
	openedAfterRead, err := file.Stat()
	if err != nil || !sameCandidatePublication(openedAfterRead, artifact.publishedInformation, written) ||
		!os.SameFile(opened, openedAfterRead) {
		_ = file.Close()
		return fmt.Errorf("%s changed while it was read", label)
	}
	current, err = artifact.parentRoot.Lstat(artifact.destinationName)
	if err != nil || !sameCandidatePublication(current, artifact.publishedInformation, artifact.identity.Bytes) ||
		!os.SameFile(opened, current) {
		_ = file.Close()
		return fmt.Errorf("%s changed during receipt verification", label)
	}
	if err := file.Close(); err != nil {
		return fmt.Errorf("close %s after receipt verification: %w", label, err)
	}
	if err := verifyCandidateOutputParent(root, artifact); err != nil {
		return err
	}
	return nil
}

func sameCandidatePublication(current, published os.FileInfo, size int64) bool {
	return current != nil && published != nil && current.Mode().IsRegular() &&
		current.Mode()&os.ModeSymlink == 0 && os.SameFile(current, published) &&
		current.Mode() == published.Mode() && current.Size() == size && published.Size() == size &&
		current.ModTime().Equal(published.ModTime())
}

func (staged *stagedCandidate) cleanup() error {
	var result error
	for _, artifact := range staged.artifacts {
		result = errors.Join(result, artifact.cleanup())
	}
	return result
}

func (artifact *stagedCandidateArtifact) cleanup() error {
	if artifact == nil {
		return nil
	}
	var result error
	if artifact.temporaryName != "" {
		result = errors.Join(result, removeOwnedCandidateFile(
			artifact.parentRoot, artifact.temporaryName, artifact.temporaryInformation,
		))
		artifact.temporaryName = ""
	}
	if artifact.parentRoot != nil {
		result = errors.Join(result, artifact.parentRoot.Close())
		artifact.parentRoot = nil
	}
	return result
}

func (staged *stagedCandidate) receipt(authority checkedAuthority) *ReproductionCandidate {
	return &ReproductionCandidate{
		State:                    "prepared-not-published",
		SPDXCanonicalBuildsMatch: true,
		FinalArchive:             staged.artifacts[0].identity,
		CanonicalSPDX:            staged.artifacts[1].identity,
		SourceBundle: ReproductionBundleArtifact{
			ReproductionArtifact: staged.artifacts[2].identity,
			Root:                 authority.contract.SourceDelivery.BundleLayout.Root,
			ChecksumManifest:     authority.contract.SourceDelivery.BundleLayout.ChecksumManifest,
			ChecksumSHA256:       staged.bundle.ChecksumSHA256, ChecksumBytes: staged.bundle.ChecksumBytes,
			PayloadFiles: staged.bundle.PayloadFiles, ArchiveFiles: staged.bundle.ArchiveFiles,
			UncompressedFileBytes: staged.bundle.UncompressedFileBytes, Deterministic: true,
		},
		RetainedAPKs: staged.retainedAPKs, RetainedBytes: staged.retainedBytes,
	}
}

func removeInstalledCandidateArtifacts(artifacts []*stagedCandidateArtifact) error {
	var result error
	for _, artifact := range artifacts {
		if artifact == nil || artifact.parentRoot == nil {
			result = errors.Join(result, errors.New("cannot safely remove candidate output without its pinned parent"))
			continue
		}
		current, err := artifact.parentRoot.Lstat(artifact.destinationName)
		if errors.Is(err, os.ErrNotExist) {
			continue
		}
		if err != nil || artifact.publishedInformation == nil || !current.Mode().IsRegular() ||
			!os.SameFile(current, artifact.publishedInformation) {
			result = errors.Join(result, errors.New("cannot safely remove changed candidate output"))
			continue
		}
		if err := artifact.parentRoot.Remove(artifact.destinationName); err != nil {
			result = errors.Join(result, err)
		}
	}
	return result
}

func syncCandidateOutputDirectories(artifacts []*stagedCandidateArtifact) error {
	if runtime.GOOS == "windows" {
		return nil
	}
	for _, artifact := range artifacts {
		if artifact == nil || artifact.parentRoot == nil {
			return errors.New("candidate output has no pinned directory for sync")
		}
		directory, err := artifact.parentRoot.Open(".")
		if err != nil {
			return fmt.Errorf("open candidate output directory for sync: %w", err)
		}
		information, informationError := directory.Stat()
		if informationError != nil || !os.SameFile(artifact.parentInformation, information) {
			_ = directory.Close()
			return errors.New("candidate output directory changed before sync")
		}
		if err := directory.Sync(); err != nil {
			_ = directory.Close()
			return fmt.Errorf("sync candidate output directory: %w", err)
		}
		if err := directory.Close(); err != nil {
			return fmt.Errorf("close candidate output directory: %w", err)
		}
	}
	return nil
}

func verifyCandidateOutputParent(repositoryRoot string, artifact *stagedCandidateArtifact) error {
	if artifact == nil || artifact.parentRoot == nil || artifact.parentInformation == nil ||
		artifact.parentPath == "" || filepath.Dir(artifact.destination.absolute) != artifact.parentPath {
		return errors.New("candidate output has no stable pinned directory")
	}
	if err := rejectLinkedPath(repositoryRoot, artifact.parentPath, "candidate output directory"); err != nil {
		return err
	}
	named, err := os.Lstat(artifact.parentPath)
	if err != nil || !named.IsDir() || named.Mode()&os.ModeSymlink != 0 ||
		!os.SameFile(artifact.parentInformation, named) {
		return errors.New("candidate output directory changed after it was pinned")
	}
	pinned, err := artifact.parentRoot.Stat(".")
	if err != nil || !pinned.IsDir() || !os.SameFile(artifact.parentInformation, pinned) ||
		!os.SameFile(named, pinned) {
		return errors.New("pinned candidate output directory changed")
	}
	return nil
}

func removeOwnedCandidateFile(root *os.Root, name string, information os.FileInfo) error {
	if root == nil || name == "" || filepath.Base(name) != name || information == nil {
		return errors.New("candidate output cleanup has no stable owned file")
	}
	current, err := root.Lstat(name)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return err
	}
	if !current.Mode().IsRegular() || current.Mode()&os.ModeSymlink != 0 ||
		!os.SameFile(information, current) {
		return errors.New("candidate output path no longer refers to the owned file")
	}
	return root.Remove(name)
}

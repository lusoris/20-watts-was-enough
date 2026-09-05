package pdftools

import (
	"context"
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
	"time"
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
	temporary            string
	destination          candidateOutputPath
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
		finals[0].Archive, plan.finalArchive, authority.contract.Limits.FinalArchiveBytes,
		finals[0].Image.Identity.ArchiveSHA256, authority.contract.SourceDateEpoch,
	)
	if err != nil {
		return nil, err
	}
	staged.artifacts = append(staged.artifacts, finalArtifact)
	spdxArtifact, err := stageCandidateBytes(
		bases[0].SPDX.canonical, plan.spdx, authority.contract.Limits.SPDXBytes,
		bases[0].SPDX.CanonicalSHA256, authority.contract.SourceDateEpoch,
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
	source string,
	destination candidateOutputPath,
	maximum int64,
	expectedSHA256 string,
	epoch int64,
) (_ *stagedCandidateArtifact, returnError error) {
	input, err := openBoundedRegular(source, maximum, "retained final OCI archive")
	if err != nil {
		return nil, err
	}
	defer input.Close()
	staged, output, err := newStagedCandidateArtifact(destination)
	if err != nil {
		return nil, err
	}
	defer func() {
		if returnError != nil {
			_ = output.Close()
			_ = os.Remove(staged.temporary)
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
	if err := finishStagedCandidateArtifact(staged, output, written, expectedSHA256, epoch); err != nil {
		return nil, err
	}
	return staged, nil
}

func stageCandidateBytes(
	body []byte,
	destination candidateOutputPath,
	maximum int64,
	expectedSHA256 string,
	epoch int64,
) (_ *stagedCandidateArtifact, returnError error) {
	if len(body) == 0 || int64(len(body)) > maximum || digestRaw(body) != expectedSHA256 {
		return nil, errors.New("retained candidate bytes differ from their authority")
	}
	staged, output, err := newStagedCandidateArtifact(destination)
	if err != nil {
		return nil, err
	}
	defer func() {
		if returnError != nil {
			_ = output.Close()
			_ = os.Remove(staged.temporary)
		}
	}()
	if _, err := output.Write(body); err != nil {
		return nil, fmt.Errorf("write retained candidate bytes: %w", err)
	}
	if err := finishStagedCandidateArtifact(staged, output, int64(len(body)), expectedSHA256, epoch); err != nil {
		return nil, err
	}
	return staged, nil
}

func stageCandidateBundle(
	authority checkedAuthority,
	destination candidateOutputPath,
	entries []sourceBundleEntry,
) (_ *stagedCandidateArtifact, _ sourceBundleIdentity, returnError error) {
	staged, output, err := newStagedCandidateArtifact(destination)
	if err != nil {
		return nil, sourceBundleIdentity{}, err
	}
	defer func() {
		if returnError != nil {
			_ = output.Close()
			_ = os.Remove(staged.temporary)
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
	if err := finishStagedCandidateArtifact(staged, output, identity.Bytes, identity.SHA256, contract.SourceDateEpoch); err != nil {
		return nil, sourceBundleIdentity{}, err
	}
	return staged, identity, nil
}

func newStagedCandidateArtifact(destination candidateOutputPath) (*stagedCandidateArtifact, *os.File, error) {
	if _, err := os.Lstat(destination.absolute); err == nil {
		return nil, nil, errors.New("candidate output appeared before staging")
	} else if !errors.Is(err, os.ErrNotExist) {
		return nil, nil, fmt.Errorf("inspect candidate output before staging: %w", err)
	}
	file, err := os.CreateTemp(filepath.Dir(destination.absolute), ".20w-pdf-tools-candidate-*.tmp")
	if err != nil {
		return nil, nil, fmt.Errorf("create candidate output staging file: %w", err)
	}
	return &stagedCandidateArtifact{temporary: file.Name(), destination: destination}, file, nil
}

func finishStagedCandidateArtifact(
	staged *stagedCandidateArtifact,
	file *os.File,
	size int64,
	sha256 string,
	epoch int64,
) error {
	if size <= 0 || !rawDigestPattern.MatchString(sha256) {
		return errors.New("candidate output identity is invalid")
	}
	if err := file.Chmod(0o644); err != nil {
		return fmt.Errorf("normalise candidate output mode: %w", err)
	}
	instant := time.Unix(epoch, 0)
	if err := os.Chtimes(staged.temporary, instant, instant); err != nil {
		return fmt.Errorf("normalise candidate output timestamp: %w", err)
	}
	if err := file.Sync(); err != nil {
		return fmt.Errorf("sync candidate output staging file: %w", err)
	}
	if err := file.Close(); err != nil {
		return fmt.Errorf("close candidate output staging file: %w", err)
	}
	information, err := os.Lstat(staged.temporary)
	if err != nil || !information.Mode().IsRegular() || information.Mode()&os.ModeSymlink != 0 || information.Size() != size {
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
		if err := rejectLinkedPath(root, filepath.Dir(artifact.destination.absolute), "candidate output directory"); err != nil {
			return err
		}
		if _, err := os.Lstat(artifact.destination.absolute); !errors.Is(err, os.ErrNotExist) {
			return errors.New("candidate output appeared before atomic placement")
		}
		if err := os.Link(artifact.temporary, artifact.destination.absolute); err != nil {
			return fmt.Errorf("atomically place candidate output: %w", err)
		}
		installed = append(installed, artifact)
		temporaryInfo, temporaryError := os.Lstat(artifact.temporary)
		finalInfo, finalError := os.Lstat(artifact.destination.absolute)
		if temporaryError != nil || finalError != nil || !finalInfo.Mode().IsRegular() ||
			finalInfo.Mode()&os.ModeSymlink != 0 || !os.SameFile(temporaryInfo, finalInfo) ||
			finalInfo.Size() != artifact.identity.Bytes {
			return errors.New("candidate output changed during atomic placement")
		}
		artifact.publishedInformation = finalInfo
	}
	for _, artifact := range staged.artifacts {
		if err := os.Remove(artifact.temporary); err != nil {
			return fmt.Errorf("remove candidate output staging link: %w", err)
		}
		artifact.temporary = ""
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
		if err := rejectLinkedPath(root, artifact.destination.absolute, label); err != nil {
			return err
		}
		current, err := os.Lstat(artifact.destination.absolute)
		if err != nil || !sameCandidatePublication(current, artifact.publishedInformation, artifact.identity.Bytes) {
			return fmt.Errorf("%s changed before receipt publication", label)
		}
	}
	return nil
}

func verifyInstalledCandidateArtifact(root string, artifact *stagedCandidateArtifact) error {
	label := "installed PDF-tools candidate output " + artifact.identity.Path
	if artifact.publishedInformation == nil || artifact.identity.Bytes <= 0 ||
		!rawDigestPattern.MatchString(artifact.identity.SHA256) {
		return fmt.Errorf("%s has no stable publication identity", label)
	}
	if err := rejectLinkedPath(root, artifact.destination.absolute, label); err != nil {
		return err
	}
	current, err := os.Lstat(artifact.destination.absolute)
	if err != nil || !sameCandidatePublication(current, artifact.publishedInformation, artifact.identity.Bytes) {
		return fmt.Errorf("%s changed after atomic placement", label)
	}
	file, err := os.Open(artifact.destination.absolute)
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
	if err := verifyOpenedRegular(artifact.destination.absolute, file, written, label); err != nil {
		_ = file.Close()
		return err
	}
	current, err = os.Lstat(artifact.destination.absolute)
	if err != nil || !sameCandidatePublication(current, artifact.publishedInformation, artifact.identity.Bytes) ||
		!os.SameFile(opened, current) {
		_ = file.Close()
		return fmt.Errorf("%s changed during receipt verification", label)
	}
	if err := file.Close(); err != nil {
		return fmt.Errorf("close %s after receipt verification: %w", label, err)
	}
	if err := rejectLinkedPath(root, artifact.destination.absolute, label); err != nil {
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
		if artifact.temporary != "" {
			if err := os.Remove(artifact.temporary); err != nil && !errors.Is(err, os.ErrNotExist) {
				result = errors.Join(result, err)
			}
		}
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
		current, err := os.Lstat(artifact.destination.absolute)
		if errors.Is(err, os.ErrNotExist) {
			continue
		}
		if err != nil || artifact.publishedInformation == nil || !current.Mode().IsRegular() ||
			!os.SameFile(current, artifact.publishedInformation) {
			result = errors.Join(result, errors.New("cannot safely remove changed candidate output"))
			continue
		}
		if err := os.Remove(artifact.destination.absolute); err != nil {
			result = errors.Join(result, err)
		}
	}
	return result
}

func syncCandidateOutputDirectories(artifacts []*stagedCandidateArtifact) error {
	if runtime.GOOS == "windows" {
		return nil
	}
	directories := make(map[string]struct{}, len(artifacts))
	for _, artifact := range artifacts {
		directories[filepath.Dir(artifact.destination.absolute)] = struct{}{}
	}
	for directoryPath := range directories {
		directory, err := os.Open(directoryPath)
		if err != nil {
			return fmt.Errorf("open candidate output directory for sync: %w", err)
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

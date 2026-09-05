//go:build linux && amd64

package pdftools

import (
	"bytes"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestCandidatePublicationBundleIsDeterministicAndRehashesEveryMember(t *testing.T) {
	t.Parallel()
	authority, plan, staged, receipt := candidatePublicationBundleFixture(t)
	first, err := stageCandidatePublicationBundle(authority, plan, staged, receipt)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = first.cleanup() })
	firstBytes := readStagedCandidateBytes(t, first)
	if len(firstBytes) == 0 || digestRaw(firstBytes) != first.identity.SHA256 {
		t.Fatal("staged publication bundle does not match its identity")
	}

	secondPlan := *plan
	secondPlan.publicationBundle = candidateOutputPath{
		relative: "build/release-inputs/candidate-second.tar",
		absolute: filepath.Join(authority.root, "build", "release-inputs", "candidate-second.tar"),
	}
	second, err := stageCandidatePublicationBundle(authority, &secondPlan, staged, receipt)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = second.cleanup() })
	secondBytes := readStagedCandidateBytes(t, second)
	if !bytes.Equal(firstBytes, secondBytes) || first.identity.SHA256 != second.identity.SHA256 {
		t.Fatal("candidate publication bundle bytes depend on the destination path")
	}
	entries, err := os.ReadDir(filepath.Dir(plan.publicationBundle.absolute))
	if err != nil || len(entries) != 0 {
		t.Fatalf("unnamed candidate staging created path entries: %v, %v", entries, err)
	}

	bundle := &stagedCandidate{artifacts: []*stagedCandidateArtifact{first}}
	if err := bundle.install(authority.root); err != nil {
		t.Fatal(err)
	}
	verification, err := verifyPublishedCandidatePublicationBundle(authority, first)
	if err != nil {
		t.Fatal(err)
	}
	if verification.SHA256 != first.identity.SHA256 || verification.Bytes != first.identity.Bytes ||
		verification.Receipt.Candidate == nil ||
		verification.Receipt.Candidate.FinalArchive.Path != candidateBundleFinalArchiveMember ||
		verification.Receipt.Candidate.CanonicalSPDX.Path != candidateBundleSPDXMember ||
		verification.Receipt.Candidate.SourceBundle.Path != candidateBundleSourceBundleMember {
		t.Fatalf("verified candidate publication bundle = %#v", verification)
	}
}

func TestCandidatePublicationBundleClosesReceiptSetInterleaving(t *testing.T) {
	t.Parallel()
	authority, plan, staged, receipt := candidatePublicationBundleFixture(t)
	publication, err := stageCandidatePublicationBundle(authority, plan, staged, receipt)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = publication.cleanup() })
	if err := staged.install(authority.root); err != nil {
		t.Fatal(err)
	}

	// This is the exact former gap: candidate A changes after all three named
	// copies have been verified but before the receipt/publication name appears.
	// The authoritative bundle was already built from the unnamed checked
	// streams, so it cannot name the changed convenience copy.
	changed := bytes.Repeat([]byte{'x'}, int(staged.artifacts[0].identity.Bytes))
	if digestRaw(changed) == staged.artifacts[0].identity.SHA256 {
		t.Fatal("interleaving fixture did not change candidate A")
	}
	if err := os.WriteFile(staged.artifacts[0].destination.absolute, changed, 0o644); err != nil {
		t.Fatal(err)
	}
	bundle := &stagedCandidate{artifacts: []*stagedCandidateArtifact{publication}}
	if err := bundle.install(authority.root); err != nil {
		t.Fatal(err)
	}
	verification, err := verifyPublishedCandidatePublicationBundle(authority, publication)
	if err != nil {
		t.Fatal(err)
	}
	if verification.Receipt.Candidate.FinalArchive.SHA256 != staged.artifacts[0].identity.SHA256 {
		t.Fatal("embedded receipt lost the original candidate-A identity")
	}
	receiptPath := filepath.Join(authority.root, "build", "evidence", "receipt.json")
	if _, err := os.Lstat(receiptPath); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("successful candidate publication left a standalone success receipt: %v", err)
	}
}

func TestCandidatePublicationBundleConsumerRejectsMemberDriftEvenWithNewOuterDigest(t *testing.T) {
	t.Parallel()
	authority, plan, staged, receipt := candidatePublicationBundleFixture(t)
	publication, err := stageCandidatePublicationBundle(authority, plan, staged, receipt)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = publication.cleanup() })
	body := readStagedCandidateBytes(t, publication)
	offset := bytes.Index(body, []byte("final archive"))
	if offset < 0 {
		t.Fatal("could not locate final-archive payload in bundle fixture")
	}
	body[offset] ^= 0x01
	_, err = verifyCandidatePublicationBundleStream(
		bytes.NewReader(body), int64(len(body)), digestRaw(body), authority,
	)
	if err == nil || !strings.Contains(err.Error(), "differs from its receipt identity") {
		t.Fatalf("consumer accepted content drift with a recomputed outer digest: %v", err)
	}
}

func TestCandidatePublicationBundleRejectsReceiptMetadataDriftBeforeStaging(t *testing.T) {
	t.Parallel()
	authority, plan, staged, receipt := candidatePublicationBundleFixture(t)
	changedCandidate := *receipt.Candidate
	changedCandidate.SourceBundle.ChecksumSHA256 = strings.Repeat("c", 64)
	receipt.Candidate = &changedCandidate
	if _, err := stageCandidatePublicationBundle(authority, plan, staged, receipt); err == nil ||
		!strings.Contains(err.Error(), "differs from the staged source authority") {
		t.Fatalf("candidate publication accepted receipt metadata drift: %v", err)
	}
	entries, err := os.ReadDir(filepath.Dir(plan.publicationBundle.absolute))
	if err != nil || len(entries) != 0 {
		t.Fatalf("rejected receipt metadata left staged names: %v, %v", entries, err)
	}
}

func TestCandidatePublicationBundleAtomicLinkNeverOverwrites(t *testing.T) {
	t.Parallel()
	authority, plan, staged, receipt := candidatePublicationBundleFixture(t)
	publication, err := stageCandidatePublicationBundle(authority, plan, staged, receipt)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = publication.cleanup() })
	foreign := []byte("competing invocation")
	bundle := &stagedCandidate{artifacts: []*stagedCandidateArtifact{publication}}
	err = bundle.installWithPublicationHooks(
		authority.root,
		func(*stagedCandidateArtifact) error {
			return os.WriteFile(plan.publicationBundle.absolute, foreign, 0o640)
		},
		nil,
	)
	if err == nil {
		t.Fatal("candidate publication bundle replaced a competing destination")
	}
	retained, readError := os.ReadFile(plan.publicationBundle.absolute)
	if readError != nil || !bytes.Equal(retained, foreign) {
		t.Fatalf("competing destination changed: %q, %v", retained, readError)
	}
}

func TestCandidatePublicationBundleFailureRetainsConveniencePrefixWithoutSuccessReceipt(t *testing.T) {
	t.Parallel()
	authority, plan, staged, receipt := candidatePublicationBundleFixture(t)
	publication, err := stageCandidatePublicationBundle(authority, plan, staged, receipt)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = publication.cleanup() })
	if err := staged.install(authority.root); err != nil {
		t.Fatal(err)
	}
	foreign := []byte("competing bundle")
	if err := os.WriteFile(plan.publicationBundle.absolute, foreign, 0o640); err != nil {
		t.Fatal(err)
	}
	bundle := &stagedCandidate{artifacts: []*stagedCandidateArtifact{publication}}
	if err := bundle.install(authority.root); err == nil {
		t.Fatal("candidate publication replaced an existing bundle")
	}
	for _, artifact := range staged.artifacts {
		body, err := os.ReadFile(artifact.destination.absolute)
		if err != nil || digestRaw(body) != artifact.identity.SHA256 {
			t.Fatalf("exact convenience output %s was not retained: %v", artifact.destination.relative, err)
		}
	}
	retained, err := os.ReadFile(plan.publicationBundle.absolute)
	if err != nil || !bytes.Equal(retained, foreign) {
		t.Fatalf("competing bundle changed: %q, %v", retained, err)
	}
	receiptPath := filepath.Join(authority.root, "build", "evidence", "receipt.json")
	if _, err := os.Lstat(receiptPath); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("failed candidate publication left a success receipt: %v", err)
	}
}

func TestCandidatePublicationBundleMovedParentRetainsPinnedOutputOutsideProducerBoundary(t *testing.T) {
	t.Parallel()
	authority, plan, staged, receipt := candidatePublicationBundleFixture(t)
	publication, err := stageCandidatePublicationBundle(authority, plan, staged, receipt)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = publication.cleanup() })
	parent := filepath.Dir(plan.publicationBundle.absolute)
	outside := t.TempDir()
	parked := filepath.Join(outside, "moved-release-inputs")
	sentinel := filepath.Join(outside, "sentinel")
	if err := os.WriteFile(sentinel, []byte("outside-owned"), 0o600); err != nil {
		t.Fatal(err)
	}
	bundle := &stagedCandidate{artifacts: []*stagedCandidateArtifact{publication}}
	err = bundle.installWithPublicationHooks(
		authority.root,
		func(*stagedCandidateArtifact) error {
			if err := os.Rename(parent, parked); err != nil {
				return err
			}
			return os.Symlink(outside, parent)
		},
		nil,
	)
	if err == nil {
		t.Fatal("candidate publication accepted a same-UID parent rename")
	}
	if _, err := os.Lstat(filepath.Join(outside, publication.destinationName)); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("candidate publication followed the replacement symlink: %v", err)
	}
	retained, err := os.ReadFile(filepath.Join(parked, publication.destinationName))
	if err != nil || digestRaw(retained) != publication.identity.SHA256 {
		t.Fatalf("exact pinned output was not retained in the moved directory: %v", err)
	}
	outsideBody, err := os.ReadFile(sentinel)
	if err != nil || string(outsideBody) != "outside-owned" {
		t.Fatalf("outside sentinel changed: %q, %v", outsideBody, err)
	}
}

func candidatePublicationBundleFixture(
	t *testing.T,
) (checkedAuthority, *candidateOutputPlan, *stagedCandidate, ReproductionReceipt) {
	t.Helper()
	authority, staged, receipt, bodies := candidateBundleLogicalFixture(t)
	repository := publicationRootIdentity{path: authority.root, information: authority.rootInformation}
	options := CandidateOutputOptions{
		PublicationBundlePath: "build/release-inputs/candidate.tar",
		FinalArchivePath:      "build/release-inputs/final.tar",
		SPDXPath:              "build/release-inputs/final.spdx.json",
		SourceBundlePath:      "build/release-inputs/sources.tar.gz",
	}
	plan, err := prepareCandidateOutputPlan(authority, &options, "build/evidence/receipt.json")
	if err != nil {
		t.Fatal(err)
	}
	destinations := []candidateOutputPath{plan.finalArchive, plan.spdx, plan.sourceBundle}
	staged.artifacts = make([]*stagedCandidateArtifact, 0, len(destinations))
	t.Cleanup(func() { _ = staged.cleanup() })
	for index, destination := range destinations {
		artifact, err := stageCandidateBytes(repository, bodies[index], destination, 4096, digestRaw(bodies[index]))
		if err != nil {
			t.Fatal(err)
		}
		staged.artifacts = append(staged.artifacts, artifact)
	}
	return authority, plan, staged, receipt
}

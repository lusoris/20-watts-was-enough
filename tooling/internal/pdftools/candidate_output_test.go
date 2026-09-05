package pdftools

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestStageCandidateOutputsRetainsCanonicalSPDXAcrossRelationshipOrder(t *testing.T) {
	requireAtomicPublicationTestPlatform(t)
	t.Parallel()
	first, err := canonicalizeSPDX(testSPDXDocument(t, false), 64*1024, 8, 8)
	if err != nil {
		t.Fatal(err)
	}
	second, err := canonicalizeSPDX(testSPDXDocument(t, true), 64*1024, 8, 8)
	if err != nil {
		t.Fatal(err)
	}
	if first.RawSHA256 == second.RawSHA256 || !bytes.Equal(first.canonical, second.canonical) {
		t.Fatal("relationship-order fixture does not isolate raw and canonical identities")
	}
	firstReceipt := reproductionSPDXReceipt(first)
	secondReceipt := reproductionSPDXReceipt(second)
	if firstReceipt.RawSHA256 == secondReceipt.RawSHA256 ||
		firstReceipt.CanonicalSHA256 != secondReceipt.CanonicalSHA256 {
		t.Fatal("build receipts did not preserve distinct raw and common canonical SPDX identities")
	}

	fixture := newCandidateSourceFixture(t)
	fixture.authority.contract.BaseImage.SPDXCanonicalSHA256 = first.CanonicalSHA256
	fixture.authority.contract.BaseImage.SPDXCanonicalSize = first.CanonicalSize
	fixture.authority.contract.Limits.SPDXBytes = 64 * 1024
	fixture.authority.contract.Limits.FinalArchiveBytes = 1024
	fixture.authority.contract.SourceDateEpoch = 1_785_757_696
	fixture.authority.contract.SourceDelivery.CandidateBundle = "sources.tar.gz"
	fixture.authority.contract.SourceDelivery.BundleLayout.Root = "candidate-sources"
	fixture.authority.contract.SourceDelivery.BundleLayout.ChecksumManifest = "SHA256SUMS"
	plan, err := prepareCandidateOutputPlan(fixture.authority, &CandidateOutputOptions{
		PublicationBundlePath: "build/release-inputs/candidate.tar",
		FinalArchivePath:      "build/release-inputs/final.tar",
		SPDXPath:              "build/release-inputs/canonical.spdx.json",
		SourceBundlePath:      "build/release-inputs/sources.tar.gz",
	}, "build/evidence/receipt.json")
	if err != nil {
		t.Fatal(err)
	}
	archive := filepath.Join(fixture.authority.root, "reproduced-final.tar")
	archiveBytes := []byte("final OCI archive")
	if err := os.WriteFile(archive, archiveBytes, 0o600); err != nil {
		t.Fatal(err)
	}
	final := finalBuild{Archive: archive, Image: inspectedFinalImage{Identity: imageIdentity{
		ArchiveSHA256: digestRaw(archiveBytes), ArchiveSize: int64(len(archiveBytes)),
	}}}
	staged, err := stageCandidateOutputs(
		context.Background(), fixture.authority, plan,
		[]baseBuild{{SPDX: first}, {SPDX: second}}, []finalBuild{final, final}, fixture.fetch,
	)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = staged.cleanup() })
	retainedSPDX := readStagedCandidateBytes(t, staged.artifacts[1])
	if !bytes.Equal(retainedSPDX, first.canonical) || bytes.Equal(retainedSPDX, first.raw) {
		t.Fatal("retained SPDX is not the common canonical document")
	}
	bundleBytes := readStagedCandidateBytes(t, staged.artifacts[2])
	files, _ := readSourceBundle(t, bundleBytes)
	bundledSPDX := files["candidate-sources/"+fixture.authority.contract.SourceDelivery.BundleLayout.SPDX]
	if !bytes.Equal(bundledSPDX, retainedSPDX) {
		t.Fatal("source bundle and standalone candidate retained different canonical SPDX bytes")
	}
	candidate := staged.receipt(fixture.authority)
	if !candidate.SPDXCanonicalBuildsMatch || candidate.CanonicalSPDX.SHA256 != first.CanonicalSHA256 {
		t.Fatalf("candidate canonical SPDX identity = %#v", candidate)
	}
	receiptBytes, err := json.Marshal(candidate)
	if err != nil || !bytes.Contains(receiptBytes, []byte(`"spdx_canonical_builds_match":true`)) ||
		!bytes.Contains(receiptBytes, []byte(`"canonical_apko_spdx"`)) ||
		bytes.Contains(receiptBytes, []byte(`"spdx_builds_match"`)) {
		t.Fatalf("candidate receipt does not distinguish canonical SPDX identity: %s, %v", receiptBytes, err)
	}
}

func TestStageCandidateOutputsRejectsCanonicalSPDXGraphOrContentDrift(t *testing.T) {
	t.Parallel()
	baselineBody := string(testSPDXDocument(t, false))
	baseline, err := canonicalizeSPDX([]byte(baselineBody), 64*1024, 8, 8)
	if err != nil {
		t.Fatal(err)
	}
	mutations := map[string]string{
		"graph":   strings.Replace(baselineBody, `"relationshipType":"CONTAINS"`, `"relationshipType":"VARIANT_OF"`, 1),
		"content": strings.Replace(baselineBody, `"name":"test"`, `"name":"changed"`, 1),
	}
	for name, body := range mutations {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			changed, err := canonicalizeSPDX([]byte(body), 64*1024, 8, 8)
			if err != nil {
				t.Fatal(err)
			}
			_, err = stageCandidateOutputs(
				context.Background(), checkedAuthority{}, &candidateOutputPlan{},
				[]baseBuild{{SPDX: baseline}, {SPDX: changed}}, make([]finalBuild, reproductionBuildCount),
				func(context.Context, exactSource) ([]byte, error) {
					t.Fatal("source fetch ran before canonical SPDX equality check")
					return nil, nil
				},
			)
			if err == nil || !strings.Contains(err.Error(), "byte-identical canonical apko SPDX") {
				t.Fatalf("stageCandidateOutputs() drift error = %v", err)
			}
		})
	}
}

func TestPrepareCandidateOutputPlanRequiresExplicitNewSafePaths(t *testing.T) {
	requireAtomicPublicationTestPlatform(t)
	t.Parallel()
	newAuthority := func(t *testing.T) checkedAuthority {
		t.Helper()
		return checkedAuthority{
			root: t.TempDir(),
			contract: Contract{SourceDelivery: SourceDelivery{
				CandidateBundle: "20w-pdf-tools-26.08.0-r0-linux-amd64-sources.tar.gz",
			}},
		}
	}
	valid := CandidateOutputOptions{
		PublicationBundlePath: "build/release-inputs/candidate.tar",
		FinalArchivePath:      "build/release-inputs/final.tar",
		SPDXPath:              "build/release-inputs/final.spdx.json",
		SourceBundlePath:      "build/release-inputs/20w-pdf-tools-26.08.0-r0-linux-amd64-sources.tar.gz",
	}
	authority := newAuthority(t)
	plan, err := prepareCandidateOutputPlan(authority, &valid, "build/evidence/receipt.json")
	if err != nil || plan.finalArchive.relative != valid.FinalArchivePath {
		t.Fatalf("prepareCandidateOutputPlan() = %#v, %v", plan, err)
	}

	tests := map[string]func(checkedAuthority) *CandidateOutputOptions{
		"incomplete": func(_ checkedAuthority) *CandidateOutputOptions {
			value := valid
			value.SPDXPath = ""
			return &value
		},
		"escape": func(_ checkedAuthority) *CandidateOutputOptions {
			value := valid
			value.FinalArchivePath = "../final.tar"
			return &value
		},
		"wrong bundle name": func(_ checkedAuthority) *CandidateOutputOptions {
			value := valid
			value.SourceBundlePath = "build/release-inputs/wrong.tar.gz"
			return &value
		},
		"receipt collision": func(_ checkedAuthority) *CandidateOutputOptions {
			value := valid
			value.SPDXPath = "build/evidence/receipt.spdx.json"
			return &value
		},
		"ancestor collision": func(_ checkedAuthority) *CandidateOutputOptions {
			value := valid
			value.FinalArchivePath = "build/release-inputs/parent.tar"
			value.SPDXPath = "build/release-inputs/parent.tar/child.spdx.json"
			return &value
		},
		"newline in final basename": func(_ checkedAuthority) *CandidateOutputOptions {
			value := valid
			value.FinalArchivePath = "build/release-inputs/final\nname.tar"
			return &value
		},
		"carriage return in SPDX basename": func(_ checkedAuthority) *CandidateOutputOptions {
			value := valid
			value.SPDXPath = "build/release-inputs/final\r.spdx.json"
			return &value
		},
		"tab in final basename": func(_ checkedAuthority) *CandidateOutputOptions {
			value := valid
			value.FinalArchivePath = "build/release-inputs/final\tname.tar"
			return &value
		},
		"bidi override in SPDX basename": func(_ checkedAuthority) *CandidateOutputOptions {
			value := valid
			value.SPDXPath = "build/release-inputs/final\u202e.spdx.json"
			return &value
		},
	}
	for name, makeOptions := range tests {
		name, makeOptions := name, makeOptions
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			authority := newAuthority(t)
			options := makeOptions(authority)
			receipt := "build/evidence/receipt.json"
			if name == "receipt collision" {
				receipt = options.SPDXPath
			}
			if _, err := prepareCandidateOutputPlan(authority, options, receipt); err == nil {
				t.Fatalf("prepareCandidateOutputPlan() accepted %s", name)
			}
		})
	}
}

func TestPrepareCandidateOutputPlanRejectsSymlinkAndExistingOutput(t *testing.T) {
	requireAtomicPublicationTestPlatform(t)
	t.Parallel()
	authority := checkedAuthority{
		root: t.TempDir(),
		contract: Contract{SourceDelivery: SourceDelivery{
			CandidateBundle: "20w-pdf-tools-26.08.0-r0-linux-amd64-sources.tar.gz",
		}},
	}
	outside := t.TempDir()
	if err := os.Symlink(outside, filepath.Join(authority.root, "build")); err != nil {
		t.Skipf("create symlink fixture: %v", err)
	}
	options := CandidateOutputOptions{
		PublicationBundlePath: "build/release-inputs/candidate.tar",
		FinalArchivePath:      "build/release-inputs/final.tar",
		SPDXPath:              "build/release-inputs/final.spdx.json",
		SourceBundlePath:      "build/release-inputs/20w-pdf-tools-26.08.0-r0-linux-amd64-sources.tar.gz",
	}
	if _, err := prepareCandidateOutputPlan(authority, &options, "build/evidence/receipt.json"); err == nil {
		t.Fatal("prepareCandidateOutputPlan() accepted a symlink parent")
	}

	authority.root = t.TempDir()
	existing := filepath.Join(authority.root, "build", "release-inputs", "final.tar")
	if err := os.MkdirAll(filepath.Dir(existing), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(existing, []byte("existing"), 0o644); err != nil {
		t.Fatal(err)
	}
	if _, err := prepareCandidateOutputPlan(authority, &options, "build/evidence/receipt.json"); err == nil {
		t.Fatal("prepareCandidateOutputPlan() accepted an existing output")
	}
}

func TestCandidateOutputPinnedParentRejectsReplacementWithoutOutsideWrite(t *testing.T) {
	requireAtomicPublicationTestPlatform(t)
	t.Parallel()
	root := t.TempDir()
	parent := filepath.Join(root, "build", "release-inputs")
	if err := os.MkdirAll(parent, 0o755); err != nil {
		t.Fatal(err)
	}
	destination := candidateOutputPath{
		relative: "build/release-inputs/final.spdx.json",
		absolute: filepath.Join(parent, "final.spdx.json"),
	}
	repository := testPublicationRoot(t, root)
	artifact, output, err := newStagedCandidateArtifact(repository, destination)
	if err != nil {
		t.Fatal(err)
	}
	cleaned := false
	t.Cleanup(func() {
		if !cleaned {
			_ = output.Close()
			_ = artifact.cleanup()
		}
	})
	body := []byte("candidate")
	if _, err := output.Write(body); err != nil {
		t.Fatal(err)
	}
	entries, err := os.ReadDir(parent)
	if err != nil || len(entries) != 0 {
		t.Fatalf("unnamed candidate staging created a pathname: %v, %v", entries, err)
	}

	parked := parent + ".parked"
	outside := t.TempDir()
	if err := os.Rename(parent, parked); err != nil {
		t.Skipf("rename candidate parent fixture: %v", err)
	}
	if err := os.Symlink(outside, parent); err != nil {
		t.Skipf("replace candidate parent with symlink fixture: %v", err)
	}
	sentinel := filepath.Join(outside, "sentinel")
	outsideBody := []byte("unrelated outside file")
	if err := os.WriteFile(sentinel, outsideBody, 0o640); err != nil {
		t.Fatal(err)
	}
	outsideInstant := time.Unix(946_684_800, 0)
	if err := os.Chtimes(sentinel, outsideInstant, outsideInstant); err != nil {
		t.Fatal(err)
	}
	outsideBefore, err := os.Lstat(sentinel)
	if err != nil {
		t.Fatal(err)
	}

	if err := finishStagedCandidateArtifact(artifact, output, int64(len(body)), digestRaw(body)); err != nil {
		t.Fatalf("finish through pinned parent: %v", err)
	}
	staged := &stagedCandidate{artifacts: []*stagedCandidateArtifact{artifact}}
	if err := staged.install(root); err == nil {
		t.Fatal("candidate install accepted a replaced named parent")
	}
	if _, err := os.Lstat(filepath.Join(outside, artifact.destinationName)); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("candidate install wrote through the outside parent: %v", err)
	}
	outsideAfter, err := os.Lstat(sentinel)
	if err != nil || !os.SameFile(outsideBefore, outsideAfter) ||
		outsideAfter.Mode() != outsideBefore.Mode() || !outsideAfter.ModTime().Equal(outsideBefore.ModTime()) {
		t.Fatalf("candidate staging mutated the outside file: %#v, %v", outsideAfter, err)
	}
	retainedOutside, err := os.ReadFile(sentinel)
	if err != nil || !bytes.Equal(retainedOutside, outsideBody) {
		t.Fatalf("outside staging-name file changed: %q, %v", retainedOutside, err)
	}
	if err := artifact.cleanup(); err != nil {
		t.Fatal(err)
	}
	cleaned = true
	entries, err = os.ReadDir(parked)
	if err != nil || len(entries) != 0 {
		t.Fatalf("unnamed staging left a pathname in the pinned directory: %v, %v", entries, err)
	}
	retainedOutside, err = os.ReadFile(sentinel)
	if err != nil || !bytes.Equal(retainedOutside, outsideBody) {
		t.Fatalf("cleanup removed or changed the outside file: %q, %v", retainedOutside, err)
	}
}

func TestCandidateOutputInstallRetainsPublishedPrefixAndNeverReplaces(t *testing.T) {
	requireAtomicPublicationTestPlatform(t)
	t.Parallel()
	root := t.TempDir()
	receiptPath, err := prepareReproductionReceiptPath(root, "build/evidence/receipt.json")
	if err != nil {
		t.Fatal(err)
	}
	parent := filepath.Join(root, "build", "release-inputs")
	if err := os.MkdirAll(parent, 0o755); err != nil {
		t.Fatal(err)
	}
	paths := []candidateOutputPath{
		{relative: "build/release-inputs/one", absolute: filepath.Join(parent, "one")},
		{relative: "build/release-inputs/two", absolute: filepath.Join(parent, "two")},
		{relative: "build/release-inputs/three", absolute: filepath.Join(parent, "three")},
	}
	staged := &stagedCandidate{artifacts: make([]*stagedCandidateArtifact, 0, len(paths))}
	defer staged.cleanup()
	repository := testPublicationRoot(t, root)
	for index, path := range paths {
		body := []byte{byte('a' + index)}
		artifact, err := stageCandidateBytes(repository, body, path, 16, digestRaw(body))
		if err != nil {
			t.Fatal(err)
		}
		staged.artifacts = append(staged.artifacts, artifact)
	}
	if err := os.WriteFile(paths[1].absolute, []byte("unowned"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := staged.install(root); err == nil {
		t.Fatal("candidate install replaced an existing output")
	}
	first, err := os.ReadFile(paths[0].absolute)
	if err != nil || string(first) != "a" {
		t.Fatalf("first exact output was not retained: %q, %v", first, err)
	}
	body, err := os.ReadFile(paths[1].absolute)
	if err != nil || string(body) != "unowned" {
		t.Fatalf("unowned output changed: %q, %v", body, err)
	}
	if _, err := os.Lstat(paths[2].absolute); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("third output unexpectedly exists: %v", err)
	}
	if _, err := os.Lstat(receiptPath); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("partial candidate installation left a receipt: %v", err)
	}
}

func TestCandidateOutputAtomicLinkDoesNotOverwriteConcurrentDestination(t *testing.T) {
	requireAtomicPublicationTestPlatform(t)
	t.Parallel()
	root := t.TempDir()
	parent := filepath.Join(root, "build", "release-inputs")
	if err := os.MkdirAll(parent, 0o755); err != nil {
		t.Fatal(err)
	}
	path := candidateOutputPath{
		relative: "build/release-inputs/final",
		absolute: filepath.Join(parent, "final"),
	}
	body := []byte("candidate")
	artifact, err := stageCandidateBytes(
		testPublicationRoot(t, root), body, path, 64, digestRaw(body),
	)
	if err != nil {
		t.Fatal(err)
	}
	staged := &stagedCandidate{artifacts: []*stagedCandidateArtifact{artifact}}
	t.Cleanup(func() { _ = staged.cleanup() })
	foreign := []byte("concurrent destination")
	err = staged.installWithPublicationHooks(
		root,
		func(*stagedCandidateArtifact) error {
			return os.WriteFile(path.absolute, foreign, 0o640)
		},
		nil,
	)
	if err == nil {
		t.Fatal("atomic candidate placement overwrote a concurrent destination")
	}
	retained, readError := os.ReadFile(path.absolute)
	if readError != nil || !bytes.Equal(retained, foreign) {
		t.Fatalf("concurrent candidate destination changed: %q, %v", retained, readError)
	}
}

func TestCandidateOutputInstallRetainsPublishedPathAfterPostLinkFailure(t *testing.T) {
	requireAtomicPublicationTestPlatform(t)
	t.Parallel()
	tests := map[string]struct {
		afterLink func(*stagedCandidateArtifact) error
		wantBody  string
	}{
		"owned link": {
			afterLink: func(*stagedCandidateArtifact) error {
				return errors.New("injected post-link failure")
			},
			wantBody: "candidate",
		},
		"unowned replacement": {
			afterLink: func(artifact *stagedCandidateArtifact) error {
				if err := artifact.parent.root.Remove(artifact.destinationName); err != nil {
					return err
				}
				return artifact.parent.root.WriteFile(artifact.destinationName, []byte("unowned"), 0o640)
			},
			wantBody: "unowned",
		},
	}
	for name, test := range tests {
		name, test := name, test
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			root := t.TempDir()
			parent := filepath.Join(root, "build", "release-inputs")
			if err := os.MkdirAll(parent, 0o755); err != nil {
				t.Fatal(err)
			}
			path := candidateOutputPath{
				relative: "build/release-inputs/final",
				absolute: filepath.Join(parent, "final"),
			}
			body := []byte("candidate")
			artifact, err := stageCandidateBytes(testPublicationRoot(t, root), body, path, 64, digestRaw(body))
			if err != nil {
				t.Fatal(err)
			}
			staged := &stagedCandidate{artifacts: []*stagedCandidateArtifact{artifact}}
			t.Cleanup(func() { _ = staged.cleanup() })

			if err := staged.installWithPostLinkHook(root, test.afterLink); err == nil {
				t.Fatal("candidate install accepted post-link validation drift")
			}
			retained, err := os.ReadFile(path.absolute)
			if err != nil || string(retained) != test.wantBody {
				t.Fatalf("published path changed after failure: %q, %v", retained, err)
			}
		})
	}
}

func readStagedCandidateBytes(t *testing.T, artifact *stagedCandidateArtifact) []byte {
	t.Helper()
	if artifact == nil || artifact.unnamed == nil || artifact.identity.Bytes <= 0 {
		t.Fatal("candidate artifact has no readable unnamed staging file")
	}
	body := make([]byte, artifact.identity.Bytes)
	if _, err := artifact.unnamed.ReadAt(body, 0); err != nil {
		t.Fatalf("read unnamed candidate staging bytes: %v", err)
	}
	return body
}

func testPublicationRoot(t *testing.T, root string) publicationRootIdentity {
	t.Helper()
	repository, err := publicationRoot(root, nil)
	if err != nil {
		t.Fatal(err)
	}
	return repository
}

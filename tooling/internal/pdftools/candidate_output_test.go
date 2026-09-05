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
		FinalArchivePath: "build/release-inputs/final.tar",
		SPDXPath:         "build/release-inputs/canonical.spdx.json",
		SourceBundlePath: "build/release-inputs/sources.tar.gz",
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
	retainedSPDX, err := staged.artifacts[1].parentRoot.ReadFile(staged.artifacts[1].temporaryName)
	if err != nil || !bytes.Equal(retainedSPDX, first.canonical) || bytes.Equal(retainedSPDX, first.raw) {
		t.Fatalf("retained SPDX is not the common canonical document: %v", err)
	}
	bundleBytes, err := staged.artifacts[2].parentRoot.ReadFile(staged.artifacts[2].temporaryName)
	if err != nil {
		t.Fatal(err)
	}
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
		FinalArchivePath: "build/release-inputs/final.tar",
		SPDXPath:         "build/release-inputs/final.spdx.json",
		SourceBundlePath: "build/release-inputs/20w-pdf-tools-26.08.0-r0-linux-amd64-sources.tar.gz",
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

func TestCandidateReceiptPublicationRejectsChangedInstalledOutput(t *testing.T) {
	t.Parallel()
	inPlaceMutation := func(index int) func(*testing.T, *stagedCandidate) {
		return func(t *testing.T, staged *stagedCandidate) {
			artifact := staged.artifacts[index]
			body := make([]byte, artifact.identity.Bytes)
			for byteIndex := range body {
				body[byteIndex] = 'x'
			}
			if digestRaw(body) == artifact.identity.SHA256 {
				t.Fatal("mutation fixture did not change the receipt-bound bytes")
			}
			if err := os.WriteFile(artifact.destination.absolute, body, 0o644); err != nil {
				t.Fatal(err)
			}
			instant := artifact.publishedInformation.ModTime()
			if err := os.Chtimes(artifact.destination.absolute, instant, instant); err != nil {
				t.Fatal(err)
			}
			current, err := os.Lstat(artifact.destination.absolute)
			if err != nil || !os.SameFile(current, artifact.publishedInformation) {
				t.Fatalf("in-place fixture replaced the output: %v", err)
			}
		}
	}
	pathnameReplacement := func(index int) func(*testing.T, *stagedCandidate) {
		return func(t *testing.T, staged *stagedCandidate) {
			artifact := staged.artifacts[index]
			replacement := artifact.destination.absolute + ".replacement"
			body, err := os.ReadFile(artifact.destination.absolute)
			if err != nil {
				t.Fatal(err)
			}
			if err := os.WriteFile(replacement, body, 0o644); err != nil {
				t.Fatal(err)
			}
			instant := artifact.publishedInformation.ModTime()
			if err := os.Chtimes(replacement, instant, instant); err != nil {
				t.Fatal(err)
			}
			if err := os.Remove(artifact.destination.absolute); err != nil {
				t.Fatal(err)
			}
			if err := os.Rename(replacement, artifact.destination.absolute); err != nil {
				t.Fatal(err)
			}
			current, err := os.Lstat(artifact.destination.absolute)
			if err != nil || os.SameFile(current, artifact.publishedInformation) {
				t.Fatalf("replacement fixture retained the output identity: %v", err)
			}
		}
	}
	tests := map[string]func(*testing.T, *stagedCandidate){
		"in-place final archive mutation": inPlaceMutation(0),
		"in-place SPDX mutation":          inPlaceMutation(1),
		"in-place source bundle mutation": inPlaceMutation(2),
		"final archive replacement":       pathnameReplacement(0),
		"SPDX replacement":                pathnameReplacement(1),
		"source bundle replacement":       pathnameReplacement(2),
	}
	for name, mutate := range tests {
		name, mutate := name, mutate
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			root, receiptPath, staged, receipt := installedCandidateFixture(t)
			err := writeReproductionReceiptChecked(root, receiptPath, receipt, 1<<20, func() error {
				mutate(t, staged)
				return staged.verifyInstalled(root, receipt.Candidate)
			})
			if err == nil {
				t.Fatal("writeReproductionReceiptChecked() published after the candidate changed")
			}
			if _, err := os.Lstat(receiptPath); !errors.Is(err, os.ErrNotExist) {
				t.Fatalf("failed candidate verification left a success receipt: %v", err)
			}
		})
	}
}

func TestCandidateReceiptPublicationVerifiesStableInstalledOutputs(t *testing.T) {
	t.Parallel()
	root, receiptPath, staged, receipt := installedCandidateFixture(t)
	if err := writeReproductionReceiptChecked(root, receiptPath, receipt, 1<<20, func() error {
		return staged.verifyInstalled(root, receipt.Candidate)
	}); err != nil {
		t.Fatal(err)
	}
	if information, err := os.Lstat(receiptPath); err != nil || !information.Mode().IsRegular() {
		t.Fatalf("verified candidate receipt was not published: %v", err)
	}
}

func installedCandidateFixture(t *testing.T) (string, string, *stagedCandidate, ReproductionReceipt) {
	t.Helper()
	root := t.TempDir()
	outputDirectory := filepath.Join(root, "build", "release-inputs")
	receiptDirectory := filepath.Join(root, "build", "evidence")
	for _, directory := range []string{outputDirectory, receiptDirectory} {
		if err := os.MkdirAll(directory, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	paths := []candidateOutputPath{
		{relative: "build/release-inputs/final.tar", absolute: filepath.Join(outputDirectory, "final.tar")},
		{relative: "build/release-inputs/final.spdx.json", absolute: filepath.Join(outputDirectory, "final.spdx.json")},
		{relative: "build/release-inputs/sources.tar.gz", absolute: filepath.Join(outputDirectory, "sources.tar.gz")},
	}
	bodies := [][]byte{[]byte("archive"), []byte("spdx"), []byte("bundle")}
	staged := &stagedCandidate{artifacts: make([]*stagedCandidateArtifact, 0, len(paths))}
	t.Cleanup(func() { _ = staged.cleanup() })
	for index, path := range paths {
		artifact, err := stageCandidateBytes(root, bodies[index], path, 64, digestRaw(bodies[index]))
		if err != nil {
			t.Fatal(err)
		}
		staged.artifacts = append(staged.artifacts, artifact)
	}
	if err := staged.install(root); err != nil {
		t.Fatal(err)
	}
	candidate := &ReproductionCandidate{
		FinalArchive:  staged.artifacts[0].identity,
		CanonicalSPDX: staged.artifacts[1].identity,
		SourceBundle:  ReproductionBundleArtifact{ReproductionArtifact: staged.artifacts[2].identity},
	}
	return root, filepath.Join(receiptDirectory, "receipt.json"), staged, ReproductionReceipt{Candidate: candidate}
}

func TestPrepareCandidateOutputPlanRejectsSymlinkAndExistingOutput(t *testing.T) {
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
		FinalArchivePath: "build/release-inputs/final.tar",
		SPDXPath:         "build/release-inputs/final.spdx.json",
		SourceBundlePath: "build/release-inputs/20w-pdf-tools-26.08.0-r0-linux-amd64-sources.tar.gz",
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
	artifact, output, err := newStagedCandidateArtifact(root, destination)
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

	parked := parent + ".parked"
	outside := t.TempDir()
	if err := os.Rename(parent, parked); err != nil {
		t.Skipf("rename candidate parent fixture: %v", err)
	}
	if err := os.Symlink(outside, parent); err != nil {
		t.Skipf("replace candidate parent with symlink fixture: %v", err)
	}
	outsideTemporary := filepath.Join(outside, artifact.temporaryName)
	outsideBody := []byte("unrelated outside file")
	if err := os.WriteFile(outsideTemporary, outsideBody, 0o640); err != nil {
		t.Fatal(err)
	}
	outsideInstant := time.Unix(946_684_800, 0)
	if err := os.Chtimes(outsideTemporary, outsideInstant, outsideInstant); err != nil {
		t.Fatal(err)
	}
	outsideBefore, err := os.Lstat(outsideTemporary)
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
	outsideAfter, err := os.Lstat(outsideTemporary)
	if err != nil || !os.SameFile(outsideBefore, outsideAfter) ||
		outsideAfter.Mode() != outsideBefore.Mode() || !outsideAfter.ModTime().Equal(outsideBefore.ModTime()) {
		t.Fatalf("candidate staging mutated the outside file: %#v, %v", outsideAfter, err)
	}
	retainedOutside, err := os.ReadFile(outsideTemporary)
	if err != nil || !bytes.Equal(retainedOutside, outsideBody) {
		t.Fatalf("outside staging-name file changed: %q, %v", retainedOutside, err)
	}
	temporaryName := artifact.temporaryName
	if err := artifact.cleanup(); err != nil {
		t.Fatal(err)
	}
	cleaned = true
	if _, err := os.Lstat(filepath.Join(parked, temporaryName)); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("owned staging file remained in the pinned directory: %v", err)
	}
	retainedOutside, err = os.ReadFile(outsideTemporary)
	if err != nil || !bytes.Equal(retainedOutside, outsideBody) {
		t.Fatalf("cleanup removed or changed the outside file: %q, %v", retainedOutside, err)
	}
}

func TestCandidateOutputInstallRollsBackOnlyOwnedFiles(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
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
	for index, path := range paths {
		body := []byte{byte('a' + index)}
		artifact, err := stageCandidateBytes(root, body, path, 16, digestRaw(body))
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
	if _, err := os.Lstat(paths[0].absolute); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("first installed output was not rolled back: %v", err)
	}
	body, err := os.ReadFile(paths[1].absolute)
	if err != nil || string(body) != "unowned" {
		t.Fatalf("unowned output changed: %q, %v", body, err)
	}
	if _, err := os.Lstat(paths[2].absolute); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("third output unexpectedly exists: %v", err)
	}
}

func TestCandidateOutputInstallRollsBackPostLinkValidationFailure(t *testing.T) {
	t.Parallel()
	tests := map[string]struct {
		afterLink func(*stagedCandidateArtifact) error
		wantBody  string
	}{
		"owned link": {
			afterLink: func(artifact *stagedCandidateArtifact) error {
				return artifact.parentRoot.Remove(artifact.temporaryName)
			},
		},
		"unowned replacement": {
			afterLink: func(artifact *stagedCandidateArtifact) error {
				if err := artifact.parentRoot.Remove(artifact.destinationName); err != nil {
					return err
				}
				return artifact.parentRoot.WriteFile(artifact.destinationName, []byte("unowned"), 0o640)
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
			artifact, err := stageCandidateBytes(root, body, path, 64, digestRaw(body))
			if err != nil {
				t.Fatal(err)
			}
			staged := &stagedCandidate{artifacts: []*stagedCandidateArtifact{artifact}}
			t.Cleanup(func() { _ = staged.cleanup() })

			if err := staged.installWithPostLinkHook(root, test.afterLink); err == nil {
				t.Fatal("candidate install accepted post-link validation drift")
			}
			retained, err := os.ReadFile(path.absolute)
			if test.wantBody == "" {
				if !errors.Is(err, os.ErrNotExist) {
					t.Fatalf("owned candidate output was not rolled back: %v", err)
				}
				return
			}
			if err != nil || string(retained) != test.wantBody {
				t.Fatalf("unowned replacement changed: %q, %v", retained, err)
			}
		})
	}
}

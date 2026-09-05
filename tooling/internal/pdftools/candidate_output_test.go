package pdftools

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"testing"
)

func TestStageCandidateOutputsRequiresByteIdenticalSPDX(t *testing.T) {
	t.Parallel()
	bases := []baseBuild{{SPDX: spdxIdentity{raw: []byte("first")}}, {SPDX: spdxIdentity{raw: []byte("second")}}}
	finals := make([]finalBuild, reproductionBuildCount)
	_, err := stageCandidateOutputs(
		context.Background(), checkedAuthority{}, &candidateOutputPlan{}, bases, finals,
		func(context.Context, exactSource) ([]byte, error) {
			t.Fatal("source fetch ran before SPDX equality check")
			return nil, nil
		},
	)
	if err == nil {
		t.Fatal("stageCandidateOutputs() accepted differing exact SPDX bytes")
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
		artifact, err := stageCandidateBytes(bodies[index], path, 64, digestRaw(bodies[index]), 1)
		if err != nil {
			t.Fatal(err)
		}
		staged.artifacts = append(staged.artifacts, artifact)
	}
	if err := staged.install(root); err != nil {
		t.Fatal(err)
	}
	candidate := &ReproductionCandidate{
		FinalArchive: staged.artifacts[0].identity,
		SPDX:         staged.artifacts[1].identity,
		SourceBundle: ReproductionBundleArtifact{ReproductionArtifact: staged.artifacts[2].identity},
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
		artifact, err := stageCandidateBytes(body, path, 16, digestRaw(body), 1)
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

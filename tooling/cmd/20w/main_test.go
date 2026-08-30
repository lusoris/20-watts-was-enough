package main

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/releaseimage"
)

func TestRunRejectsUnknown20WCommand(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer

	if exitCode := run([]string{"unknown"}, &stdout, &stderr); exitCode != 2 {
		t.Fatalf("run() exit code = %d, want 2", exitCode)
	}
	if stderr.Len() == 0 {
		t.Fatal("run() wrote no diagnostic")
	}
}

func TestRunVersionReturnsBuildIdentity(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	if exitCode := run([]string{"version", "--json"}, &stdout, &stderr); exitCode != 0 {
		t.Fatalf("run() exit code = %d, stderr = %s", exitCode, stderr.String())
	}
	if stdout.Len() == 0 {
		t.Fatal("run() wrote no version identity")
	}
}

func TestRunPackageNodeImageRequiresClosedArguments(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	if exitCode := run([]string{"experiment", "package-node-image", "--artifact", "fixture-007"}, &stdout, &stderr); exitCode != 2 {
		t.Fatalf("run() exit code = %d, want 2", exitCode)
	}
	if !strings.Contains(stderr.String(), "requires --artifact and --output") {
		t.Fatalf("stderr = %q, want missing argument diagnostic", stderr.String())
	}
}

func TestRunPackageNodeImageRejectsUnsupportedArtifact(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	root := t.TempDir()
	output := filepath.Join(t.TempDir(), "context")
	if exitCode := run([]string{
		"experiment", "package-node-image",
		"--root", root,
		"--artifact", "fixture-029",
		"--output", output,
	}, &stdout, &stderr); exitCode != 1 {
		t.Fatalf("run() exit code = %d, stderr = %s, want 1", exitCode, stderr.String())
	}
	if !strings.Contains(stderr.String(), "not supported") {
		t.Fatalf("stderr = %q, want unsupported artifact diagnostic", stderr.String())
	}
	if _, err := os.Lstat(output); !os.IsNotExist(err) {
		t.Fatalf("unsupported artifact created output: %v", err)
	}
}

func TestRunExperimentValidateFailsClosedWithoutManifestAuthority(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	exitCode := run([]string{"experiment", "validate", "--root", t.TempDir()}, &stdout, &stderr)
	if exitCode != 1 || !strings.Contains(stderr.String(), "Validate experiment catalogue") {
		t.Fatalf("run() exit/stderr = %d/%q, want closed catalogue failure", exitCode, stderr.String())
	}
}

func TestRunGitHubSyncLabelsCheckUsesLocalManifestOnly(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, ".github"), 0o755); err != nil {
		t.Fatal(err)
	}
	manifest := `{"schema":1,"labels":[{"name":"area:test","color":"0e8a16","description":"Test label"}]}`
	if err := os.WriteFile(filepath.Join(root, ".github", "labels.json"), []byte(manifest), 0o644); err != nil {
		t.Fatal(err)
	}
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	exitCode := run([]string{"github", "sync-labels", "--root", root, "--check"}, &stdout, &stderr)
	if exitCode != 0 || !strings.Contains(stdout.String(), "1 managed labels") {
		t.Fatalf("run() exit/stdout/stderr = %d/%q/%q", exitCode, stdout.String(), stderr.String())
	}
}

func TestRunReleaseInspectImageRejectsAmbiguousMachineOutput(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	exitCode := run([]string{
		"release", "inspect-image",
		"--json",
		"--github-output-prefix", "image",
		"--expected-label", "org.opencontainers.image.revision=0123456789abcdef0123456789abcdef01234567",
	}, &stdout, &stderr)
	if exitCode != 2 || !strings.Contains(stderr.String(), "invalid") {
		t.Fatalf("run() exit/stderr = %d/%q, want invalid output-mode rejection", exitCode, stderr.String())
	}
}

func TestRunReleaseInspectImageRequiresOneExactReference(t *testing.T) {
	t.Parallel()
	for _, references := range [][]string{
		{},
		{"--tag", "v1.2.3", "--digest", "sha256:" + strings.Repeat("a", 64)},
	} {
		var stdout bytes.Buffer
		var stderr bytes.Buffer
		arguments := append([]string{"release", "inspect-image"}, references...)
		if exitCode := run(arguments, &stdout, &stderr); exitCode != 2 || !strings.Contains(stderr.String(), "invalid reference") {
			t.Fatalf("run(%v) exit/stderr = %d/%q, want exact-reference rejection", arguments, exitCode, stderr.String())
		}
	}
}

func TestGitHubOutputPrefixProducesIdentifierSafeKeys(t *testing.T) {
	t.Parallel()
	if !githubOutputPrefixPattern.MatchString("fixture007") || !githubOutputPrefixPattern.MatchString("final_fixture007") {
		t.Fatal("githubOutputPrefixPattern rejected an identifier-safe prefix")
	}
	if githubOutputPrefixPattern.MatchString("fixture-007") {
		t.Fatal("githubOutputPrefixPattern accepted a prefix that would create hyphenated output keys")
	}
}

func TestWriteGitHubImageOutputsUsesIdentifierSafeNames(t *testing.T) {
	t.Parallel()
	var output bytes.Buffer
	writeGitHubImageOutputs(&output, "fixture007", releaseimage.Result{
		Status: "existing",
		Digest: "sha256:" + strings.Repeat("a", 64),
	})
	want := "fixture007_status=existing\nfixture007_publish=false\nfixture007_digest=sha256:" + strings.Repeat("a", 64) + "\n"
	if output.String() != want {
		t.Fatalf("writeGitHubImageOutputs() = %q, want %q", output.String(), want)
	}
}

func TestExpectedLabelsRejectsDuplicateIdentity(t *testing.T) {
	t.Parallel()
	_, err := expectedLabels([]string{"a=left", "a=right"})
	if err == nil || !strings.Contains(err.Error(), "repeated") {
		t.Fatalf("expectedLabels() error = %v, want duplicate rejection", err)
	}
}

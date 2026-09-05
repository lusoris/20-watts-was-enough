package experimentcli

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRunPackageNodeImageRequiresClosedArguments(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	if exitCode := runCommand(t, []string{"package-node-image", "--artifact", "fixture-007"}, &stdout, &stderr); exitCode != 2 {
		t.Fatalf("run() exit code = %d, want 2", exitCode)
	}
	if !strings.Contains(stderr.String(), "requires --artifact and --output") {
		t.Fatalf("stderr = %q, want missing argument diagnostic", stderr.String())
	}
}

func TestRunCLRSWheelhouseCommandsAreVisibleAndRequireClosedArguments(t *testing.T) {
	t.Parallel()
	var help bytes.Buffer
	Usage(&help)
	for _, command := range []string{
		"experiment render-clrs-wheelhouse-manifest",
		"experiment verify-clrs-wheelhouse",
	} {
		if !strings.Contains(help.String(), command) {
			t.Fatalf("help omits %q", command)
		}
	}

	for name, arguments := range map[string][]string{
		"render without wheelhouse": {"render-clrs-wheelhouse-manifest", "--output", "candidate.json"},
		"render without output":     {"render-clrs-wheelhouse-manifest", "--wheelhouse", "wheels"},
		"verify without wheelhouse": {"verify-clrs-wheelhouse"},
	} {
		name, arguments := name, arguments
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			var stdout bytes.Buffer
			var stderr bytes.Buffer
			if exitCode := runCommand(t, arguments, &stdout, &stderr); exitCode != 2 || !strings.Contains(stderr.String(), "requires") {
				t.Fatalf("run() exit/stdout/stderr = %d/%q/%q, want usage failure", exitCode, stdout.String(), stderr.String())
			}
		})
	}
}

func TestRunPackageNodeImageRejectsUnsupportedArtifact(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	root := t.TempDir()
	output := filepath.Join(t.TempDir(), "context")
	if exitCode := runCommand(t, []string{
		"package-node-image",
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
	exitCode := runCommand(t, []string{"validate", "--root", t.TempDir()}, &stdout, &stderr)
	if exitCode != 1 || !strings.Contains(stderr.String(), "Validate experiment catalogue") {
		t.Fatalf("run() exit/stderr = %d/%q, want closed catalogue failure", exitCode, stderr.String())
	}
}

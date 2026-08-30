package releasebuild

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestPrepareReleasePathsRejectsOutputEscape(t *testing.T) {
	t.Parallel()
	repository, moduleRoot := newReleasePathFixture(t)
	_, err := prepareReleasePaths(validPathOptions(moduleRoot, filepath.Join(repository, "..", "escaped-output")))
	if err == nil || !strings.Contains(err.Error(), "escapes") {
		t.Fatalf("prepareReleasePaths() error = %v, want escape rejection", err)
	}
}

func TestPrepareReleasePathsRejectsSymlinkedModuleRoot(t *testing.T) {
	t.Parallel()
	repository, moduleRoot := newReleasePathFixture(t)
	link := filepath.Join(repository, "tooling-link")
	if err := os.Symlink(moduleRoot, link); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	_, err := prepareReleasePaths(validPathOptions(link, filepath.Join(repository, "build", "release")))
	if err == nil || !strings.Contains(err.Error(), "symlink") {
		t.Fatalf("prepareReleasePaths() error = %v, want module symlink rejection", err)
	}
}

func TestPrepareReleasePathsRejectsSymlinkedOutputParent(t *testing.T) {
	t.Parallel()
	repository, moduleRoot := newReleasePathFixture(t)
	outside := t.TempDir()
	link := filepath.Join(repository, "build")
	if err := os.Symlink(outside, link); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	_, err := prepareReleasePaths(validPathOptions(moduleRoot, filepath.Join(link, "release")))
	if err == nil || !strings.Contains(err.Error(), "symlink") {
		t.Fatalf("prepareReleasePaths() error = %v, want output-parent symlink rejection", err)
	}
}

func TestPrepareReleasePathsRejectsSymlinkedGoMod(t *testing.T) {
	t.Parallel()
	repository := t.TempDir()
	moduleRoot := filepath.Join(repository, "tooling")
	if err := os.Mkdir(moduleRoot, 0o755); err != nil {
		t.Fatal(err)
	}
	target := filepath.Join(repository, "real.mod")
	if err := os.WriteFile(target, []byte("module example.invalid/test\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(target, filepath.Join(moduleRoot, "go.mod")); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	_, err := prepareReleasePaths(validPathOptions(moduleRoot, filepath.Join(repository, "build", "release")))
	if err == nil || !strings.Contains(err.Error(), "non-symlinked go.mod") {
		t.Fatalf("prepareReleasePaths() error = %v, want go.mod symlink rejection", err)
	}
}

func TestPrepareReleasePathsCreatesOnlyContainedParent(t *testing.T) {
	t.Parallel()
	repository, moduleRoot := newReleasePathFixture(t)
	output := filepath.Join(repository, "build", "nested", "release")
	paths, err := prepareReleasePaths(validPathOptions(moduleRoot, output))
	if err != nil {
		t.Fatalf("prepareReleasePaths() error = %v", err)
	}
	if paths.outputRoot != output || paths.repository != repository {
		t.Fatalf("prepareReleasePaths() = %+v, want contained canonical paths", paths)
	}
	information, err := os.Lstat(filepath.Dir(output))
	if err != nil || !information.IsDir() || information.Mode()&os.ModeSymlink != 0 {
		t.Fatalf("output parent = %v, %v", information, err)
	}
}

func newReleasePathFixture(t *testing.T) (string, string) {
	t.Helper()
	repository := t.TempDir()
	moduleRoot := filepath.Join(repository, "tooling")
	if err := os.Mkdir(moduleRoot, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(moduleRoot, "go.mod"), []byte("module example.invalid/test\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	return repository, moduleRoot
}

func validPathOptions(moduleRoot, outputRoot string) Options {
	return Options{
		ModuleRoot: moduleRoot,
		OutputRoot: outputRoot,
		Version:    "v1.2.3",
		Revision:   "0123456789abcdef0123456789abcdef01234567",
		BuiltAt:    "2026-08-29T12:30:00+02:00",
	}
}

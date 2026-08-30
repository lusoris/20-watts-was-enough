//go:build linux || darwin || dragonfly || freebsd || netbsd || openbsd || solaris

package nodeimage

import (
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"syscall"
	"testing"
)

const (
	umaskHelperModeKey     = "NODEIMAGE_TEST_UMASK"
	umaskHelperRootKey     = "NODEIMAGE_TEST_ROOT"
	umaskHelperSnapshotKey = "NODEIMAGE_TEST_SNAPSHOT"
)

func TestPackageIgnoresCallerUmask(t *testing.T) {
	t.Parallel()
	left := packageInUmaskSubprocess(t, "022")
	right := packageInUmaskSubprocess(t, "077")
	if left != right {
		t.Fatalf("complete context snapshots differ by caller umask:\n022:\n%s\n077:\n%s", left, right)
	}
}

func TestPackageUmaskSubprocess(t *testing.T) {
	maskText := os.Getenv(umaskHelperModeKey)
	if maskText == "" {
		t.Skip("subprocess helper")
	}
	mask, err := strconv.ParseUint(maskText, 8, 32)
	if err != nil {
		t.Fatalf("parse helper umask: %v", err)
	}
	previous := syscall.Umask(int(mask))
	defer syscall.Umask(previous)

	helperRoot := os.Getenv(umaskHelperRootKey)
	snapshotPath := os.Getenv(umaskHelperSnapshotKey)
	if helperRoot == "" || snapshotPath == "" {
		t.Fatal("umask helper paths are required")
	}
	repositoryRoot := filepath.Join(helperRoot, "repository")
	if err := os.MkdirAll(repositoryRoot, 0o755); err != nil {
		t.Fatalf("create helper repository: %v", err)
	}
	writeDescriptorFiles(t, repositoryRoot)
	outputRoot := filepath.Join(helperRoot, "context")
	if err := Package(Options{
		RepositoryRoot: repositoryRoot,
		OutputRoot:     outputRoot,
		Artifact:       "fixture-007",
	}); err != nil {
		t.Fatalf("package under umask %s: %v", maskText, err)
	}
	assertContextModes(t, outputRoot)
	if err := os.WriteFile(snapshotPath, []byte(snapshotContext(t, outputRoot)), 0o644); err != nil {
		t.Fatalf("write helper snapshot: %v", err)
	}
}

func packageInUmaskSubprocess(t *testing.T, mask string) string {
	t.Helper()
	helperRoot := filepath.Join(t.TempDir(), "helper")
	snapshotPath := filepath.Join(t.TempDir(), "snapshot.txt")
	command := exec.Command(os.Args[0], "-test.run=^TestPackageUmaskSubprocess$")
	command.Env = append(os.Environ(),
		umaskHelperModeKey+"="+mask,
		umaskHelperRootKey+"="+helperRoot,
		umaskHelperSnapshotKey+"="+snapshotPath,
	)
	if output, err := command.CombinedOutput(); err != nil {
		t.Fatalf("package subprocess under umask %s: %v\n%s", mask, err, output)
	}
	snapshot, err := os.ReadFile(snapshotPath)
	if err != nil {
		t.Fatalf("read umask %s snapshot: %v", mask, err)
	}
	return string(snapshot)
}

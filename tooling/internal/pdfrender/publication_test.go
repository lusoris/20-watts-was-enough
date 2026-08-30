package pdfrender

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestPublicationBackupCleanupCoversPreflightFailure(t *testing.T) {
	t.Parallel()
	directory := t.TempDir()
	staged := []string{filepath.Join(directory, "first.stage"), filepath.Join(directory, "second.stage")}
	destinations := []string{filepath.Join(directory, "first.out"), filepath.Join(directory, "second.out")}
	for _, file := range staged {
		if err := os.WriteFile(file, []byte("new"), 0o600); err != nil {
			t.Fatal(err)
		}
	}
	if err := os.WriteFile(destinations[0], []byte("old"), 0o600); err != nil {
		t.Fatal(err)
	}
	target := filepath.Join(directory, "target")
	if err := os.WriteFile(target, []byte("target"), 0o600); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(target, destinations[1]); err != nil {
		t.Fatal(err)
	}

	err := replacePublishedPair(staged, destinations)
	if err == nil || !strings.Contains(err.Error(), "regular non-symlink") {
		t.Fatalf("replacePublishedPair() error = %v", err)
	}
	backups, err := filepath.Glob(filepath.Join(directory, "*.backup-*"))
	if err != nil {
		t.Fatal(err)
	}
	if len(backups) != 0 {
		t.Fatalf("preflight failure retained backups: %v", backups)
	}
	observed, err := os.ReadFile(destinations[0])
	if err != nil {
		t.Fatal(err)
	}
	if string(observed) != "old" {
		t.Fatalf("first destination changed to %q", observed)
	}
}

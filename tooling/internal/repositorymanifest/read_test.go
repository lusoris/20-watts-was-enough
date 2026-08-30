package repositorymanifest

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func writeTestManifest(t *testing.T, root, name, body string) string {
	t.Helper()
	directory := filepath.Join(root, ".github")
	if err := os.MkdirAll(directory, 0o755); err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(directory, name)
	if err := os.WriteFile(path, []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
	return path
}

func TestReadAcceptsStableManifest(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	writeTestManifest(t, root, "labels.json", "stable")
	body, err := Read(root, ".github/labels.json", 64)
	if err != nil {
		t.Fatal(err)
	}
	if string(body) != "stable" {
		t.Fatalf("Read() = %q", body)
	}
}

func TestReadRejectsPathEscapeAndInvalidBounds(t *testing.T) {
	t.Parallel()
	for _, path := range []string{"labels.json", ".github/../labels.json", ".github/nested/labels.json", "/.github/labels.json"} {
		if _, err := Read(t.TempDir(), path, 64); err == nil {
			t.Fatalf("Read() accepted path %q", path)
		}
	}
	if _, err := Read(t.TempDir(), ".github/labels.json", 0); err == nil {
		t.Fatal("Read() accepted a zero byte bound")
	}
}

func TestReadRejectsManifestSymlink(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	target := filepath.Join(t.TempDir(), "labels.json")
	if err := os.WriteFile(target, []byte("linked"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(filepath.Join(root, ".github"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(target, filepath.Join(root, ".github", "labels.json")); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	if _, err := Read(root, ".github/labels.json", 64); err == nil || !strings.Contains(err.Error(), "regular file") {
		t.Fatalf("Read() error = %v, want regular-file refusal", err)
	}
}

func TestReadRejectsLinkedGitHubDirectory(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	target := t.TempDir()
	if err := os.WriteFile(filepath.Join(target, "labels.json"), []byte("linked"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(target, filepath.Join(root, ".github")); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	if _, err := Read(root, ".github/labels.json", 64); err == nil || !strings.Contains(err.Error(), "real directory") {
		t.Fatalf("Read() error = %v, want linked-directory refusal", err)
	}
}

func TestReadStableRegularFileRejectsSameInodeMutation(t *testing.T) {
	t.Parallel()
	path := filepath.Join(t.TempDir(), "manifest.json")
	original := []byte("original")
	replacement := []byte("mutated!")
	if err := os.WriteFile(path, original, 0o644); err != nil {
		t.Fatal(err)
	}
	initial, err := os.Stat(path)
	if err != nil {
		t.Fatal(err)
	}

	_, err = readStableRegularFile(path, 64, func() error {
		writer, openErr := os.OpenFile(path, os.O_WRONLY, 0)
		if openErr != nil {
			return openErr
		}
		if _, writeErr := writer.WriteAt(replacement, 0); writeErr != nil {
			_ = writer.Close()
			return writeErr
		}
		if syncErr := writer.Sync(); syncErr != nil {
			_ = writer.Close()
			return syncErr
		}
		if closeErr := writer.Close(); closeErr != nil {
			return closeErr
		}
		return os.Chtimes(path, initial.ModTime(), initial.ModTime())
	})
	if err == nil || !strings.Contains(err.Error(), "changed while it was read") {
		t.Fatalf("readStableRegularFile() error = %v, want stable-read refusal", err)
	}
}

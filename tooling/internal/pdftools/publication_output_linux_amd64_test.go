//go:build linux && amd64

package pdftools

import (
	"bytes"
	"os"
	"testing"
)

func TestUnnamedPublicationProcFallbackLinksOnlyToPinnedParent(t *testing.T) {
	t.Parallel()
	repository := testPublicationRoot(t, t.TempDir())
	parent, err := openPinnedPublicationDirectory(repository, ".", false, nil)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = parent.close() })
	file, _, err := createUnnamedPublicationFile(parent, "fallback test")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = file.Close() })
	body := []byte("fallback")
	if _, err := file.Write(body); err != nil {
		t.Fatal(err)
	}
	if err := file.Sync(); err != nil {
		t.Fatal(err)
	}
	if err := linkUnnamedPublicationFileThroughProc(file, parent.descriptor, "fallback"); err != nil {
		t.Fatal(err)
	}
	retained, err := parent.root.ReadFile("fallback")
	if err != nil || !bytes.Equal(retained, body) {
		t.Fatalf("proc fallback output = %q, %v", retained, err)
	}
	entries, err := os.ReadDir(repository.path)
	if err != nil || len(entries) != 1 || entries[0].Name() != "fallback" {
		t.Fatalf("proc fallback exposed unexpected names: %v, %v", entries, err)
	}
}

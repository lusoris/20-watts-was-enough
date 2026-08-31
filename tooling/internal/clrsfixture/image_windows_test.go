package clrsfixture

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"unicode"
)

func TestCleanGeneratorRootAcceptsWindowsDriveCaseVariant(t *testing.T) {
	root := t.TempDir()
	volume := filepath.VolumeName(root)
	if len(volume) != 2 || volume[1] != ':' {
		t.Skipf("temporary root %q has no drive-letter volume", root)
	}
	drive := rune(volume[0])
	if unicode.IsUpper(drive) {
		drive = unicode.ToLower(drive)
	} else {
		drive = unicode.ToUpper(drive)
	}
	variant := string(drive) + strings.TrimPrefix(root, volume[0:1])
	cleaned, err := cleanGeneratorRoot(variant)
	if err != nil {
		t.Fatalf("cleanGeneratorRoot(%q): %v", variant, err)
	}
	want, err := os.Stat(root)
	if err != nil {
		t.Fatal(err)
	}
	got, err := os.Stat(cleaned)
	if err != nil {
		t.Fatal(err)
	}
	if !os.SameFile(want, got) {
		t.Fatalf("cleaned root %q does not identify %q", cleaned, root)
	}
}

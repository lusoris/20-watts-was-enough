//go:build !linux || !amd64

package pdftools

import (
	"errors"
	"strings"
	"testing"
)

func requireAtomicPublicationTestPlatform(t *testing.T) {
	t.Helper()
	t.Skip("atomic PDF-tools publication executes only on Linux amd64")
}

func TestUnsupportedAtomicPublicationRemainsNORESULT(t *testing.T) {
	for _, operation := range []func() error{
		func() error {
			_, err := openPinnedPublicationDirectory(publicationRootIdentity{}, ".", false, nil)
			return err
		},
		func() error { _, _, err := createUnnamedPublicationFile(nil, "candidate.tar"); return err },
		func() error { return linkUnnamedPublicationFile(nil, nil, "candidate.tar") },
	} {
		err := operation()
		if !errors.Is(err, errUnsupportedAtomicPublication) || !strings.Contains(err.Error(), "NO_RESULT") ||
			strings.Contains(err.Error(), "claim-eligible") || !strings.Contains(err.Error(), "/proc/self/fd") {
			t.Fatalf("unsupported publication did not fail at the declared NO_RESULT boundary: %v", err)
		}
	}
}

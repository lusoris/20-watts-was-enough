//go:build !linux || !amd64

package pdftools

import (
	"errors"
	"os"
)

var errUnsupportedAtomicPublication = errors.New(
	"PDF-tools candidate publication and NO_RESULT receipt output require Linux amd64 O_TMPFILE, linkat and /proc/self/fd",
)

func openPinnedPublicationDirectory(
	publicationRootIdentity,
	string,
	bool,
	func(string) error,
) (*pinnedPublicationDirectory, error) {
	return nil, errUnsupportedAtomicPublication
}

func createUnnamedPublicationFile(*pinnedPublicationDirectory, string) (*os.File, os.FileInfo, error) {
	return nil, nil, errUnsupportedAtomicPublication
}

func linkUnnamedPublicationFile(*os.File, *os.File, string) error {
	return errUnsupportedAtomicPublication
}

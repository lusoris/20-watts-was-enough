package pdftools

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type publicationRootIdentity struct {
	path        string
	information os.FileInfo
}

type pinnedPublicationDirectory struct {
	repository  publicationRootIdentity
	relative    string
	descriptor  *os.File
	root        *os.Root
	information os.FileInfo
}

func publicationRoot(root string, information os.FileInfo) (publicationRootIdentity, error) {
	if information == nil {
		cleaned, captured, err := cleanRoot(root)
		if err != nil {
			return publicationRootIdentity{}, err
		}
		return publicationRootIdentity{path: cleaned, information: captured}, nil
	}
	cleaned, err := filepath.Abs(root)
	if err != nil {
		return publicationRootIdentity{}, fmt.Errorf("resolve publication repository root: %w", err)
	}
	return publicationRootIdentity{path: filepath.Clean(cleaned), information: information}, nil
}

func cleanPublicationDirectory(relative string) (string, error) {
	if relative == "" || filepath.IsAbs(relative) || strings.Contains(relative, "\\") ||
		containsConfusingPathControl(relative) {
		return "", errors.New("publication directory must be a clean repository-relative path")
	}
	cleaned := filepath.Clean(filepath.FromSlash(relative))
	if cleaned == ".." || strings.HasPrefix(cleaned, ".."+string(filepath.Separator)) {
		return "", errors.New("publication directory escapes the repository root")
	}
	if filepath.ToSlash(cleaned) != filepath.ToSlash(relative) {
		return "", errors.New("publication directory must already be canonical")
	}
	return cleaned, nil
}

func (directory *pinnedPublicationDirectory) close() error {
	if directory == nil {
		return nil
	}
	var result error
	if directory.root != nil {
		result = errors.Join(result, directory.root.Close())
		directory.root = nil
	}
	if directory.descriptor != nil {
		result = errors.Join(result, directory.descriptor.Close())
		directory.descriptor = nil
	}
	return result
}

func (directory *pinnedPublicationDirectory) verify() error {
	if directory == nil || directory.descriptor == nil || directory.root == nil ||
		directory.information == nil || directory.repository.information == nil {
		return errors.New("publication directory has no pinned identity")
	}
	descriptorInformation, err := directory.descriptor.Stat()
	if err != nil || !descriptorInformation.IsDir() ||
		!os.SameFile(directory.information, descriptorInformation) {
		return errors.New("pinned publication directory descriptor changed")
	}
	rootInformation, err := directory.root.Stat(".")
	if err != nil || !rootInformation.IsDir() ||
		!os.SameFile(directory.information, rootInformation) {
		return errors.New("pinned publication directory root changed")
	}
	current, err := openPinnedPublicationDirectory(directory.repository, directory.relative, false, nil)
	if err != nil {
		return errors.New("publication directory changed after it was pinned")
	}
	defer current.close()
	if !os.SameFile(directory.information, current.information) {
		return errors.New("publication directory changed after it was pinned")
	}
	return nil
}

func (directory *pinnedPublicationDirectory) sync() error {
	if directory == nil || directory.descriptor == nil || directory.information == nil {
		return errors.New("publication directory has no pinned descriptor to sync")
	}
	information, err := directory.descriptor.Stat()
	if err != nil || !os.SameFile(directory.information, information) {
		return errors.New("pinned publication directory changed before sync")
	}
	if err := directory.descriptor.Sync(); err != nil {
		return fmt.Errorf("sync publication directory: %w", err)
	}
	return directory.verify()
}

func publicationFilename(path string) (string, error) {
	name := filepath.Base(path)
	if name == "." || name == string(filepath.Separator) || name == "" ||
		filepath.Clean(name) != name || strings.ContainsAny(name, `/\\`) ||
		containsConfusingPathControl(name) {
		return "", errors.New("publication filename is invalid")
	}
	return name, nil
}

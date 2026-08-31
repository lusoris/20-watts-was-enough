package pdftools

import (
	"bytes"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"net/url"
	"regexp"
	"strconv"
	"strings"
)

var byteRangePattern = regexp.MustCompile(`^bytes=([0-9]+)-([0-9]+)$`)

type apkoLock struct {
	Version  string       `json:"version"`
	Config   lockConfig   `json:"config"`
	Contents lockContents `json:"contents"`
}

type lockConfig struct {
	Name     string `json:"name,omitempty"`
	Checksum string `json:"checksum,omitempty"`
}

type lockContents struct {
	Keyring             []lockKeyring `json:"keyring"`
	BuildRepositories   []lockRepo    `json:"build_repositories"`
	RuntimeRepositories []lockRepo    `json:"runtime_repositories"`
	Repositories        []lockRepo    `json:"repositories"`
	Packages            []lockPackage `json:"packages"`
}

type lockKeyring struct {
	Name    string `json:"name"`
	URL     string `json:"url"`
	Content string `json:"content,omitempty"`
}

type lockRepo struct {
	Name         string `json:"name"`
	URL          string `json:"url"`
	Architecture string `json:"architecture"`
}

type lockPackage struct {
	Name         string        `json:"name"`
	URL          string        `json:"url"`
	Version      string        `json:"version"`
	Architecture string        `json:"architecture"`
	Signature    rangeChecksum `json:"signature"`
	Control      rangeChecksum `json:"control"`
	Data         rangeChecksum `json:"data"`
	Checksum     string        `json:"checksum"`
}

type rangeChecksum struct {
	Range    string `json:"range"`
	Checksum string `json:"checksum"`
}

func loadLock(root string, contract Contract, configBody []byte) (map[string]lockPackage, error) {
	relative := "tooling/pdf-tools/" + contract.Apko.Lock
	body, err := readRelative(root, relative, "PDF-tools apko lock", contract.Limits.LockBytes)
	if err != nil {
		return nil, err
	}
	if rawDigest(body) != contract.Apko.LockSHA256 {
		return nil, errors.New("PDF-tools apko lock digest does not match contract.json")
	}
	lock, err := decodeCanonical[apkoLock](body, 8, "PDF-tools apko lock")
	if err != nil {
		return nil, err
	}
	return validateLock(lock, contract, configBody)
}

func validateLock(lock apkoLock, contract Contract, configBody []byte) (map[string]lockPackage, error) {
	if lock.Version != "v1" || lock.Config.Name != contract.Apko.Config {
		return nil, errors.New("apko lock version or config name is invalid")
	}
	configDigest := sha256.Sum256(configBody)
	wantChecksum := "sha256-" + base64.StdEncoding.EncodeToString(configDigest[:])
	if lock.Config.Checksum != wantChecksum {
		return nil, errors.New("apko lock config checksum does not match apko.yaml")
	}
	if err := validateLockRepositories(lock.Contents, contract.Apko); err != nil {
		return nil, err
	}
	if len(lock.Contents.Packages) != contract.Apko.LockedPackageCount || len(lock.Contents.Packages) > contract.Limits.Packages {
		return nil, errors.New("apko lock package count is invalid")
	}
	packages := make(map[string]lockPackage, len(lock.Contents.Packages))
	for _, pkg := range lock.Contents.Packages {
		if err := validateLockedPackage(pkg, contract.Apko.Repository); err != nil {
			return nil, err
		}
		if _, exists := packages[pkg.Name]; exists {
			return nil, fmt.Errorf("apko lock repeats package %s", pkg.Name)
		}
		packages[pkg.Name] = pkg
	}
	for _, identity := range contract.Apko.DirectPackages {
		name, version, _ := strings.Cut(identity, "=")
		if pkg, exists := packages[name]; !exists || pkg.Version != version {
			return nil, fmt.Errorf("apko lock omits direct package %s", identity)
		}
	}
	return packages, nil
}

func validateLockRepositories(contents lockContents, apko Apko) error {
	if len(contents.BuildRepositories) != 0 || len(contents.RuntimeRepositories) != 0 || len(contents.Keyring) != 1 || len(contents.Repositories) != 1 {
		return errors.New("apko lock must use one keyring, one repository, and no build or runtime repository")
	}
	key := contents.Keyring[0]
	if key.URL != apko.Keyring || key.Name != "packages.wolfi.dev/os/wolfi-signing.rsa.pub" ||
		!strings.HasPrefix(key.Content, "-----BEGIN PUBLIC KEY-----\n") || !strings.HasSuffix(key.Content, "-----END PUBLIC KEY-----\n") || len(key.Content) > 16*1024 {
		return errors.New("apko lock keyring identity or content is invalid")
	}
	repository := contents.Repositories[0]
	if repository.Name != "packages.wolfi.dev/os/x86_64" || repository.URL != apko.Repository+"/x86_64/APKINDEX.tar.gz" || repository.Architecture != "x86_64" {
		return errors.New("apko lock repository identity is invalid")
	}
	return nil
}

func validateLockedPackage(pkg lockPackage, repository string) error {
	if !packagePattern.MatchString(pkg.Name+"="+pkg.Version) || pkg.Architecture != "x86_64" {
		return fmt.Errorf("locked package %q has an invalid identity", pkg.Name)
	}
	parsed, err := url.Parse(pkg.URL)
	wantSuffix := "/x86_64/" + pkg.Name + "-" + pkg.Version + ".apk"
	if err != nil || parsed.Scheme != "https" || parsed.Host != "packages.wolfi.dev" || parsed.User != nil ||
		parsed.RawPath != "" || parsed.RawQuery != "" || parsed.Fragment != "" || parsed.Path != "/os"+wantSuffix ||
		!strings.HasPrefix(pkg.URL, repository+"/") {
		return fmt.Errorf("locked package %s URL is invalid", pkg.Name)
	}
	signatureEnd := int64(-1)
	if pkg.Signature.Range != "" || pkg.Signature.Checksum != "" {
		signatureStart, end, err := validateRange(pkg.Signature, "sha1", 20)
		if err != nil || signatureStart != 0 {
			return fmt.Errorf("locked package %s signature is invalid", pkg.Name)
		}
		signatureEnd = end
	}
	controlStart, controlEnd, err := validateRange(pkg.Control, "sha1", 20)
	if err != nil || controlStart != signatureEnd+1 {
		return fmt.Errorf("locked package %s control stream is invalid", pkg.Name)
	}
	dataStart, _, err := validateRange(pkg.Data, "sha256", 32)
	if err != nil || dataStart != controlEnd+1 {
		return fmt.Errorf("locked package %s data stream is invalid", pkg.Name)
	}
	checksum, err := base64.StdEncoding.DecodeString(strings.TrimPrefix(pkg.Checksum, "Q1"))
	if err != nil || !strings.HasPrefix(pkg.Checksum, "Q1") || len(checksum) != 20 {
		return fmt.Errorf("locked package %s APK checksum is invalid", pkg.Name)
	}
	controlChecksum, err := base64.StdEncoding.DecodeString(strings.TrimPrefix(pkg.Control.Checksum, "sha1-"))
	if err != nil || !bytes.Equal(checksum, controlChecksum) {
		return fmt.Errorf("locked package %s APK checksum does not match its control stream", pkg.Name)
	}
	return nil
}

func validateRange(value rangeChecksum, algorithm string, digestBytes int) (int64, int64, error) {
	match := byteRangePattern.FindStringSubmatch(value.Range)
	if len(match) != 3 || !strings.HasPrefix(value.Checksum, algorithm+"-") {
		return 0, 0, errors.New("range or checksum prefix is invalid")
	}
	start, startError := strconv.ParseInt(match[1], 10, 64)
	end, endError := strconv.ParseInt(match[2], 10, 64)
	digest, digestError := base64.StdEncoding.DecodeString(strings.TrimPrefix(value.Checksum, algorithm+"-"))
	if startError != nil || endError != nil || digestError != nil || start < 0 || end < start || len(digest) != digestBytes {
		return 0, 0, errors.New("range or checksum payload is invalid")
	}
	return start, end, nil
}

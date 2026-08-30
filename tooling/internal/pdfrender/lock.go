// Package pdfrender validates and runs the repository's pinned PDF renderer.
package pdfrender

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/strictjson"
)

const (
	lockRelativePath = "tooling/pdf-renderer/lock.json"
	maximumLockBytes = 16 * 1024
)

var (
	rawSHA256Pattern   = regexp.MustCompile(`^[0-9a-f]{64}$`)
	gitRevisionPattern = regexp.MustCompile(`^[0-9a-f]{40}$`)
	imagePattern       = regexp.MustCompile(`^[a-z0-9][a-z0-9./_-]*:[A-Za-z0-9][A-Za-z0-9._-]*@sha256:[0-9a-f]{64}$`)
	versionPattern     = regexp.MustCompile(`^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:\.(0|[1-9][0-9]*))?$`)
	revisionPattern    = regexp.MustCompile(`^r[1-9][0-9]*$`)
	digitsPattern      = regexp.MustCompile(`^[1-9][0-9]*$`)
)

// Lock is the single checked-in identity and resource contract for PDF rendering.
type Lock struct {
	Schema             int              `json:"schema"`
	Platform           string           `json:"platform"`
	SourceDateEpoch    int64            `json:"source_date_epoch"`
	Builder            Builder          `json:"builder"`
	Exporter           Exporter         `json:"exporter"`
	Node               RuntimeImage     `json:"node"`
	BrowserEnvironment RuntimeImage     `json:"browser_environment"`
	ChromeForTesting   ChromeForTesting `json:"chrome_for_testing"`
	Limits             Limits           `json:"limits"`
}

// Builder binds the Buildx client and BuildKit daemon used to derive the
// renderer image instead of trusting the caller's ambient builder.
type Builder struct {
	BuildxVersion   string `json:"buildx_version"`
	BuildxRevision  string `json:"buildx_revision"`
	BuildKitVersion string `json:"buildkit_version"`
	BuildKitImage   string `json:"buildkit_image"`
}

// Exporter binds digest-affecting image assembly choices. CompatibilityVersion
// records the reviewed BuildKit default; it is not passed as an exporter option.
type Exporter struct {
	RewriteTimestamp     bool `json:"rewrite_timestamp"`
	CompatibilityVersion int  `json:"compatibility_version"`
}

// RuntimeImage binds a named runtime version to one immutable OCI image index.
type RuntimeImage struct {
	Version string `json:"version"`
	Image   string `json:"image"`
}

// ChromeForTesting binds the browser bytes staged into the renderer image to
// Google's generation-addressed archive.
type ChromeForTesting struct {
	Version           string `json:"version"`
	Revision          string `json:"revision"`
	ArchiveURL        string `json:"archive_url"`
	ArchiveGeneration string `json:"archive_generation"`
	ArchiveSizeBytes  int64  `json:"archive_size_bytes"`
	ArchiveSHA256     string `json:"archive_sha256"`
	ExecutablePath    string `json:"executable_path"`
	ExecutableSHA256  string `json:"executable_sha256"`
}

// Limits closes every material local subprocess and container resource boundary.
type Limits struct {
	BuildSeconds   int   `json:"build_seconds"`
	RenderSeconds  int   `json:"render_seconds"`
	OutputBytes    int   `json:"output_bytes"`
	MemoryBytes    int64 `json:"memory_bytes"`
	PIDs           int   `json:"pids"`
	TemporaryBytes int64 `json:"temporary_bytes"`
}

// Configuration is one validated renderer lock resolved beneath a repository.
type Configuration struct {
	RepositoryRoot string
	LockPath       string
	LockSHA256     string
	Lock           Lock
}

// Check validates the local renderer authority without invoking Docker or the network.
func Check(repositoryRoot string) (Configuration, error) {
	root, err := cleanRepositoryRoot(repositoryRoot)
	if err != nil {
		return Configuration{}, err
	}
	lockPath := filepath.Join(root, filepath.FromSlash(lockRelativePath))
	body, err := readRegularBounded(root, lockPath, maximumLockBytes, "PDF renderer lock")
	if err != nil {
		return Configuration{}, err
	}
	if err := strictjson.Validate(body, 8); err != nil {
		return Configuration{}, fmt.Errorf("validate PDF renderer lock JSON: %w", err)
	}
	decoder := json.NewDecoder(bytes.NewReader(body))
	decoder.DisallowUnknownFields()
	var lock Lock
	if err := decoder.Decode(&lock); err != nil {
		return Configuration{}, fmt.Errorf("decode PDF renderer lock: %w", err)
	}
	if err := validateLock(lock); err != nil {
		return Configuration{}, fmt.Errorf("validate PDF renderer lock: %w", err)
	}
	lockDigest := sha256.Sum256(body)
	return Configuration{
		RepositoryRoot: root,
		LockPath:       lockPath,
		LockSHA256:     hex.EncodeToString(lockDigest[:]),
		Lock:           lock,
	}, nil
}

func validateLock(lock Lock) error {
	if lock.Schema != 3 || lock.Platform != "linux/amd64" {
		return errors.New("schema must be 3 and platform must be linux/amd64")
	}
	if lock.SourceDateEpoch < 946_684_800 || lock.SourceDateEpoch > 4_102_444_800 {
		return errors.New("source_date_epoch must be a Unix time between 2000 and 2100")
	}
	if err := validateBuilder(lock.Builder); err != nil {
		return err
	}
	if !lock.Exporter.RewriteTimestamp || lock.Exporter.CompatibilityVersion != 30 {
		return errors.New("exporter must enable rewrite_timestamp and record compatibility_version 30")
	}
	if err := validateRuntimeImage(lock.Node, "node", "-bookworm-slim"); err != nil {
		return err
	}
	if err := validateRuntimeImage(lock.BrowserEnvironment, "browser environment", ""); err != nil {
		return err
	}
	if err := validateChrome(lock.ChromeForTesting); err != nil {
		return err
	}
	return validateLimits(lock.Limits)
}

func validateBuilder(builder Builder) error {
	if !versionPattern.MatchString(builder.BuildxVersion) ||
		!gitRevisionPattern.MatchString(builder.BuildxRevision) ||
		!versionPattern.MatchString(builder.BuildKitVersion) ||
		!imagePattern.MatchString(builder.BuildKitImage) {
		return errors.New("builder versions, revision, or immutable image are invalid")
	}
	wanted := "moby/buildkit:v" + builder.BuildKitVersion + "@sha256:"
	if !strings.Contains(builder.BuildKitImage, wanted) {
		return errors.New("BuildKit image tag does not match its version")
	}
	return nil
}

func validateRuntimeImage(runtimeImage RuntimeImage, label, requiredTagSuffix string) error {
	if !versionPattern.MatchString(runtimeImage.Version) || !imagePattern.MatchString(runtimeImage.Image) {
		return fmt.Errorf("%s version or immutable image is invalid", label)
	}
	separator := ":" + runtimeImage.Version + requiredTagSuffix + "@sha256:"
	if !strings.Contains(runtimeImage.Image, separator) {
		return fmt.Errorf("%s image tag does not match its version", label)
	}
	return nil
}

func validateChrome(chrome ChromeForTesting) error {
	if !versionPattern.MatchString(chrome.Version) || !revisionPattern.MatchString(chrome.Revision) {
		return errors.New("Chrome for Testing version or revision is invalid")
	}
	if !digitsPattern.MatchString(chrome.ArchiveGeneration) || chrome.ArchiveSizeBytes < 10_000_000 || chrome.ArchiveSizeBytes > 1_000_000_000 {
		return errors.New("Chrome for Testing archive generation or size is invalid")
	}
	if !rawSHA256Pattern.MatchString(chrome.ArchiveSHA256) || !rawSHA256Pattern.MatchString(chrome.ExecutableSHA256) {
		return errors.New("Chrome for Testing digests must be lowercase SHA-256 values")
	}
	parsed, err := url.Parse(chrome.ArchiveURL)
	if err != nil || parsed.Scheme != "https" || parsed.Host != "storage.googleapis.com" || parsed.User != nil || parsed.Fragment != "" {
		return errors.New("Chrome for Testing archive URL must be an HTTPS storage.googleapis.com URL")
	}
	query := parsed.Query()
	if len(query) != 2 || len(query["alt"]) != 1 || query.Get("alt") != "media" ||
		len(query["generation"]) != 1 || query.Get("generation") != chrome.ArchiveGeneration {
		return errors.New("Chrome for Testing archive URL must bind media and one exact generation")
	}
	wantedSuffix := "/" + chrome.Version + "/linux64/chrome-linux64.zip"
	if !strings.HasPrefix(parsed.Path, "/download/storage/v1/b/chrome-for-testing-public/o/") ||
		!strings.HasSuffix(parsed.Path, wantedSuffix) {
		return errors.New("Chrome for Testing archive URL does not match its version and platform")
	}
	if chrome.ExecutablePath != "/opt/chrome/chrome-linux64/chrome" {
		return errors.New("Chrome for Testing executable path does not match its version")
	}
	return nil
}

func validateLimits(limits Limits) error {
	checks := []struct {
		value, minimum, maximum int64
		name                    string
	}{
		{int64(limits.BuildSeconds), 30, 3600, "build_seconds"},
		{int64(limits.RenderSeconds), 30, 1800, "render_seconds"},
		{int64(limits.OutputBytes), 1024, 64 * 1024 * 1024, "output_bytes"},
		{limits.MemoryBytes, 512 * 1024 * 1024, 16 * 1024 * 1024 * 1024, "memory_bytes"},
		{int64(limits.PIDs), 32, 4096, "pids"},
		{limits.TemporaryBytes, 128 * 1024 * 1024, 8 * 1024 * 1024 * 1024, "temporary_bytes"},
	}
	for _, check := range checks {
		if check.value < check.minimum || check.value > check.maximum {
			return fmt.Errorf("%s must be between %d and %d", check.name, check.minimum, check.maximum)
		}
	}
	return nil
}

func cleanRepositoryRoot(repositoryRoot string) (string, error) {
	if repositoryRoot == "" {
		return "", errors.New("repository root is required")
	}
	root, err := filepath.Abs(repositoryRoot)
	if err != nil {
		return "", fmt.Errorf("resolve repository root: %w", err)
	}
	root = filepath.Clean(root)
	information, err := os.Lstat(root)
	if err != nil {
		return "", fmt.Errorf("inspect repository root: %w", err)
	}
	if !information.IsDir() || information.Mode()&os.ModeSymlink != 0 {
		return "", errors.New("repository root must be a non-symlink directory")
	}
	if strings.ContainsAny(root, ",\n\r\x00") {
		return "", errors.New("repository root contains a character unsupported by Docker bind mounts")
	}
	return root, nil
}

func readRegularBounded(root, file string, maximumBytes int64, label string) ([]byte, error) {
	relative, err := filepath.Rel(root, file)
	if err != nil || relative == ".." || strings.HasPrefix(relative, ".."+string(filepath.Separator)) {
		return nil, fmt.Errorf("%s escapes the repository root", label)
	}
	current := root
	for _, component := range strings.Split(relative, string(filepath.Separator)) {
		current = filepath.Join(current, component)
		information, componentError := os.Lstat(current)
		if componentError != nil {
			return nil, fmt.Errorf("inspect %s: %w", label, componentError)
		}
		if information.Mode()&os.ModeSymlink != 0 {
			return nil, fmt.Errorf("%s path contains a symlink", label)
		}
	}
	information, err := os.Lstat(file)
	if err != nil {
		return nil, fmt.Errorf("inspect %s: %w", label, err)
	}
	if !information.Mode().IsRegular() || information.Mode()&os.ModeSymlink != 0 {
		return nil, fmt.Errorf("%s must be a regular non-symlink file", label)
	}
	if information.Size() <= 0 || information.Size() > maximumBytes {
		return nil, fmt.Errorf("%s size must be between 1 and %d bytes", label, maximumBytes)
	}
	opened, err := os.Open(file)
	if err != nil {
		return nil, fmt.Errorf("open %s: %w", label, err)
	}
	defer opened.Close()
	body, err := io.ReadAll(io.LimitReader(opened, maximumBytes+1))
	if err != nil {
		return nil, fmt.Errorf("read %s: %w", label, err)
	}
	if int64(len(body)) > maximumBytes {
		return nil, fmt.Errorf("%s exceeds %d bytes", label, maximumBytes)
	}
	finalInformation, err := opened.Stat()
	if err != nil || !os.SameFile(information, finalInformation) || finalInformation.Size() != int64(len(body)) {
		return nil, fmt.Errorf("%s changed while it was read", label)
	}
	return body, nil
}

func decimal(value int64) string { return strconv.FormatInt(value, 10) }

package pdfrender

import (
	"archive/zip"
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"hash"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strconv"
	"sync/atomic"
	"testing"
	"time"
)

func TestExtractedBuildContextMetadataIsDeterministic(t *testing.T) {
	t.Parallel()
	archive := syntheticChromeArchive(t)
	archivePath := filepath.Join(t.TempDir(), "chrome.zip")
	if err := os.WriteFile(archivePath, archive, 0o600); err != nil {
		t.Fatal(err)
	}
	epoch := int64(1_787_612_224)
	digests := make([]string, 0, 2)
	for index := 0; index < 2; index++ {
		root := t.TempDir()
		if err := os.WriteFile(filepath.Join(root, "Dockerfile"), []byte("FROM scratch\n"), 0o600); err != nil {
			t.Fatal(err)
		}
		if err := extractChromeArchive(archivePath, root); err != nil {
			t.Fatal(err)
		}
		differentTime := time.Unix(epoch+int64(index+1)*1000, 0)
		if err := os.Chtimes(filepath.Join(root, "Dockerfile"), differentTime, differentTime); err != nil {
			t.Fatal(err)
		}
		if err := normalizeBuildContext(root, epoch); err != nil {
			t.Fatal(err)
		}
		digests = append(digests, contextMetadataDigest(t, root, epoch))
	}
	if digests[0] != digests[1] {
		t.Fatalf("normalized context digests differ: %s != %s", digests[0], digests[1])
	}
}

func TestExtractChromeArchiveRejectsTraversalAndSymlinks(t *testing.T) {
	t.Parallel()
	for name, entry := range map[string]zipEntry{
		"traversal":         {name: "chrome-linux64/../outside", body: "bad", mode: 0o644},
		"dot-dot substring": {name: "chrome-linux64/resource..pak", body: "bad", mode: 0o644},
		"symlink":           {name: "chrome-linux64/link", body: "target", mode: os.ModeSymlink | 0o777},
	} {
		name, entry := name, entry
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			archivePath := filepath.Join(t.TempDir(), "bad.zip")
			if err := os.WriteFile(archivePath, zipBytes(t, []zipEntry{entry}), 0o600); err != nil {
				t.Fatal(err)
			}
			if err := extractChromeArchive(archivePath, t.TempDir()); err == nil {
				t.Fatal("extractChromeArchive() accepted unsafe input")
			}
		})
	}
}

func TestCopyVerifiedArchiveStagesOnlyLockedBytes(t *testing.T) {
	t.Parallel()
	archive := syntheticChromeArchive(t)
	digest := sha256.Sum256(archive)
	chrome := ChromeForTesting{
		ArchiveSizeBytes: int64(len(archive)),
		ArchiveSHA256:    hex.EncodeToString(digest[:]),
	}
	root := t.TempDir()
	source := filepath.Join(root, "source.zip")
	destination := filepath.Join(root, "staged.zip")
	if err := os.WriteFile(source, archive, 0o600); err != nil {
		t.Fatal(err)
	}
	if err := copyVerifiedArchive(source, destination, chrome); err != nil {
		t.Fatalf("copyVerifiedArchive() error = %v", err)
	}
	staged, err := os.ReadFile(destination)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(staged, archive) {
		t.Fatal("copyVerifiedArchive() changed the locked archive bytes")
	}

	archive[0] ^= 0xff
	if err := os.WriteFile(source, archive, 0o600); err != nil {
		t.Fatal(err)
	}
	rejectedDestination := filepath.Join(root, "rejected.zip")
	if err := copyVerifiedArchive(source, rejectedDestination, chrome); err == nil {
		t.Fatal("copyVerifiedArchive() accepted same-size bytes with the wrong digest")
	}
	if _, err := os.Stat(rejectedDestination); !os.IsNotExist(err) {
		t.Fatalf("rejected staged archive remains on disk: %v", err)
	}
}

func TestCachedChromeArchiveReusesVerifiedBytesWithoutNetwork(t *testing.T) {
	t.Parallel()
	archive := syntheticChromeArchive(t)
	configuration := cacheConfiguration(t, archive, "http://127.0.0.1:1/unreachable")
	cachePath := expectedCachePath(configuration)
	if err := os.MkdirAll(filepath.Dir(cachePath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(cachePath, archive, 0o600); err != nil {
		t.Fatal(err)
	}
	observed, err := cachedChromeArchive(context.Background(), configuration)
	if err != nil || observed != cachePath {
		t.Fatalf("cachedChromeArchive() = %q, %v", observed, err)
	}
}

func TestCachedChromeArchiveReplacesCorruptionWithOneDownload(t *testing.T) {
	t.Parallel()
	archive := syntheticChromeArchive(t)
	var requests atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(response http.ResponseWriter, _ *http.Request) {
		requests.Add(1)
		response.Header().Set("X-Goog-Generation", "1234567890")
		response.Header().Set("Content-Length", strconv.Itoa(len(archive)))
		_, _ = response.Write(archive)
	}))
	defer server.Close()
	configuration := cacheConfiguration(t, archive, server.URL+"/chrome.zip")
	cachePath := expectedCachePath(configuration)
	if err := os.MkdirAll(filepath.Dir(cachePath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(cachePath, []byte("corrupt"), 0o600); err != nil {
		t.Fatal(err)
	}
	observed, err := cachedChromeArchive(context.Background(), configuration)
	if err != nil {
		t.Fatalf("cachedChromeArchive() error = %v", err)
	}
	if observed != cachePath || requests.Load() != 1 {
		t.Fatalf("cachedChromeArchive() = %q with %d requests", observed, requests.Load())
	}
	if err := validArchiveFile(cachePath, configuration.Lock.ChromeForTesting); err != nil {
		t.Fatalf("published cache is invalid: %v", err)
	}
}

type zipEntry struct {
	name string
	body string
	mode os.FileMode
}

func syntheticChromeArchive(t *testing.T) []byte {
	t.Helper()
	return zipBytes(t, []zipEntry{
		{name: "chrome-linux64/chrome", body: "verified executable bytes", mode: 0o755},
		{name: "chrome-linux64/resources.pak", body: "resource bytes", mode: 0o644},
	})
}

func zipBytes(t *testing.T, entries []zipEntry) []byte {
	t.Helper()
	var body bytes.Buffer
	writer := zip.NewWriter(&body)
	for _, entry := range entries {
		header := &zip.FileHeader{Name: entry.name, Method: zip.Deflate}
		header.SetMode(entry.mode)
		file, err := writer.CreateHeader(header)
		if err != nil {
			t.Fatal(err)
		}
		if _, err := io.WriteString(file, entry.body); err != nil {
			t.Fatal(err)
		}
	}
	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	return body.Bytes()
}

func cacheConfiguration(t *testing.T, archive []byte, archiveURL string) Configuration {
	t.Helper()
	digest := sha256.Sum256(archive)
	return Configuration{
		RepositoryRoot: t.TempDir(),
		Lock: Lock{
			SourceDateEpoch: 1_787_612_224,
			ChromeForTesting: ChromeForTesting{
				Version: "152.0.7977.64", ArchiveGeneration: "1234567890",
				ArchiveURL: archiveURL, ArchiveSizeBytes: int64(len(archive)),
				ArchiveSHA256: hex.EncodeToString(digest[:]),
			},
		},
	}
}

func expectedCachePath(configuration Configuration) string {
	chrome := configuration.Lock.ChromeForTesting
	return filepath.Join(
		configuration.RepositoryRoot,
		"tmp", "pdf-renderer-cache",
		"chrome-linux64-"+chrome.Version+"-generation-"+chrome.ArchiveGeneration+".zip",
	)
}

func contextMetadataDigest(t *testing.T, root string, epoch int64) string {
	t.Helper()
	digest := sha256.New()
	if err := filepath.WalkDir(root, func(file string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		information, err := entry.Info()
		if err != nil {
			return err
		}
		if information.ModTime().Unix() != epoch {
			return fmt.Errorf("%s mtime = %d", file, information.ModTime().Unix())
		}
		relative, _ := filepath.Rel(root, file)
		writeDigestField(digest, filepath.ToSlash(relative))
		writeDigestField(digest, information.Mode().String())
		if information.Mode().IsRegular() {
			body, err := os.ReadFile(file)
			if err != nil {
				return err
			}
			_, _ = digest.Write(body)
		}
		return nil
	}); err != nil {
		t.Fatal(err)
	}
	return hex.EncodeToString(digest.Sum(nil))
}

func writeDigestField(digest hash.Hash, value string) {
	_, _ = digest.Write([]byte(value))
	_, _ = digest.Write([]byte{0})
}

package pdftools

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
	"time"
)

type testDockerArchiveEntry struct {
	name     string
	body     []byte
	typeflag byte
	mode     int64
	uid      int
	gid      int
	linkname string
}

func TestProjectBaseArchiveValidatesAndProjectsExactClosedImage(t *testing.T) {
	t.Parallel()
	authority, archive := writeBaseArchiveFixture(t, nil)
	layout := filepath.Join(t.TempDir(), "new-layout")
	identity, err := projectBaseArchive(context.Background(), archive, layout, authority)
	if err != nil {
		t.Fatal(err)
	}
	if identity.ArchiveSHA256 != authority.contract.BaseImage.ArchiveSHA256 ||
		identity.ManifestDigest != authority.contract.BaseImage.ManifestDigest ||
		!slices.Equal(identity.LayerDigests, []string{authority.contract.BaseImage.LayerDigest}) {
		t.Fatalf("projected identity = %#v", identity)
	}
	for _, path := range []string{
		"oci-layout", "index.json",
		"blobs/sha256/" + strings.TrimPrefix(identity.ManifestDigest, "sha256:"),
		"blobs/sha256/" + strings.TrimPrefix(identity.ConfigDigest, "sha256:"),
		"blobs/sha256/" + strings.TrimPrefix(identity.LayerDigests[0], "sha256:"),
	} {
		if information, err := os.Lstat(filepath.Join(layout, filepath.FromSlash(path))); err != nil ||
			!information.Mode().IsRegular() {
			t.Fatalf("projected path %s: info=%v error=%v", path, information, err)
		}
	}
}

func TestProjectBaseArchiveRejectsArchiveMutationsPastOuterDigest(t *testing.T) {
	t.Parallel()
	tests := map[string]func(*[]testDockerArchiveEntry){
		"extra": func(entries *[]testDockerArchiveEntry) {
			*entries = append(*entries, testDockerArchiveEntry{name: "extra", body: []byte("x"), typeflag: tar.TypeReg, mode: 0o644})
		},
		"traversal": func(entries *[]testDockerArchiveEntry) {
			(*entries)[0].name = "../manifest.json"
		},
		"duplicate": func(entries *[]testDockerArchiveEntry) {
			*entries = append(*entries, (*entries)[0])
		},
		"symlink": func(entries *[]testDockerArchiveEntry) {
			(*entries)[0].typeflag = tar.TypeSymlink
			(*entries)[0].body = nil
			(*entries)[0].linkname = "outside"
		},
		"setuid": func(entries *[]testDockerArchiveEntry) {
			(*entries)[0].mode = 0o4644
		},
		"named config mismatch": func(entries *[]testDockerArchiveEntry) {
			for index := range *entries {
				if strings.HasPrefix((*entries)[index].name, "sha256:") && bytes.Contains((*entries)[index].body, []byte(`"architecture"`)) {
					(*entries)[index].body = bytes.Replace((*entries)[index].body, []byte(`"amd64"`), []byte(`"arm64"`), 1)
				}
			}
		},
	}
	for name, mutate := range tests {
		name, mutate := name, mutate
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			authority, archive := writeBaseArchiveFixture(t, mutate)
			if _, err := projectBaseArchive(context.Background(), archive, filepath.Join(t.TempDir(), "layout"), authority); err == nil {
				t.Fatalf("projectBaseArchive() accepted %s", name)
			}
		})
	}
}

func TestProjectBaseArchiveRejectsPreexistingProjectionRoot(t *testing.T) {
	t.Parallel()
	authority, archive := writeBaseArchiveFixture(t, nil)
	root := t.TempDir()
	outside := t.TempDir()
	layout := filepath.Join(root, "layout")
	if err := os.Symlink(outside, layout); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	if _, err := projectBaseArchive(context.Background(), archive, layout, authority); err == nil {
		t.Fatal("projectBaseArchive() accepted a preexisting symlink projection root")
	}
	if entries, err := os.ReadDir(outside); err != nil || len(entries) != 0 {
		t.Fatalf("outside projection entries = %v, error = %v", entries, err)
	}
}

func writeBaseArchiveFixture(
	t *testing.T,
	mutate func(*[]testDockerArchiveEntry),
) (checkedAuthority, string) {
	t.Helper()
	contract := Contract{
		Image: "ghcr.io/lusoris/20-watts-was-enough-pdf-tools", Platform: "linux/amd64", ResultAuthority: "NO_RESULT",
		SourceDateEpoch: 1_785_757_696,
		Runtime:         Runtime{UID: 65532, GID: 65532, RequiredTools: []Tool{{Name: "pdfinfo", Version: "26.08.0"}}},
		Limits:          Limits{BaseArchiveBytes: 8 * 1024 * 1024},
	}
	var expanded bytes.Buffer
	tarWriter := tar.NewWriter(&expanded)
	body := []byte("base\n")
	if err := tarWriter.WriteHeader(&tar.Header{
		Name: "usr/share/test", Typeflag: tar.TypeReg, Mode: 0o644, Size: int64(len(body)),
		ModTime: time.Unix(contract.SourceDateEpoch, 0),
	}); err != nil {
		t.Fatal(err)
	}
	if _, err := tarWriter.Write(body); err != nil {
		t.Fatal(err)
	}
	if err := tarWriter.Close(); err != nil {
		t.Fatal(err)
	}
	var compressed bytes.Buffer
	gzipWriter := gzip.NewWriter(&compressed)
	gzipWriter.Header.ModTime = time.Unix(0, 0)
	if _, err := gzipWriter.Write(expanded.Bytes()); err != nil {
		t.Fatal(err)
	}
	if err := gzipWriter.Close(); err != nil {
		t.Fatal(err)
	}
	layerDigest := sha256.Sum256(compressed.Bytes())
	diffID := sha256.Sum256(expanded.Bytes())
	contract.BaseImage.LayerDigest = "sha256:" + hex.EncodeToString(layerDigest[:])
	contract.BaseImage.LayerDiffID = "sha256:" + hex.EncodeToString(diffID[:])
	created := time.Unix(contract.SourceDateEpoch, 0).UTC().Format(time.RFC3339)
	configBody := mustJSON(t, map[string]any{
		"architecture": "amd64",
		"author":       "github.com/chainguard-dev/apko",
		"created":      created,
		"history": []map[string]any{{
			"author": "apko", "created": created, "created_by": "apko", "comment": "This is an apko single-layer image",
		}},
		"os":     "linux",
		"rootfs": map[string]any{"type": "layers", "diff_ids": []string{contract.BaseImage.LayerDiffID}},
		"config": map[string]any{
			"Env":    []string{"PATH=/usr/bin", "SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt"},
			"Labels": expectedImageAnnotations(contract), "User": "65532",
		},
	})
	configDigest := sha256.Sum256(configBody)
	contract.BaseImage.ConfigDigest = "sha256:" + hex.EncodeToString(configDigest[:])
	manifest := ociManifest{
		SchemaVersion: 2, MediaType: ociManifestMediaType,
		Config:      ociDescriptor{MediaType: ociConfigMediaType, Digest: contract.BaseImage.ConfigDigest, Size: int64(len(configBody))},
		Layers:      []ociDescriptor{{MediaType: ociLayerMediaType, Digest: contract.BaseImage.LayerDigest, Size: int64(compressed.Len())}},
		Annotations: expectedImageAnnotations(contract),
	}
	manifestBody := mustJSON(t, manifest)
	manifestDigest := sha256.Sum256(manifestBody)
	contract.BaseImage.ManifestDigest = "sha256:" + hex.EncodeToString(manifestDigest[:])
	platform := ociPlatform{Architecture: "amd64", OS: "linux"}
	indexBody := mustJSON(t, ociIndex{
		SchemaVersion: 2, MediaType: ociIndexMediaType,
		Manifests: []ociDescriptor{{
			MediaType: ociManifestMediaType, Digest: contract.BaseImage.ManifestDigest, Size: int64(len(manifestBody)),
			Platform: &platform, ArtifactType: ociConfigMediaType,
		}},
		Annotations: expectedImageAnnotations(contract),
	})
	dockerBody := mustJSON(t, []dockerArchiveEntry{{
		Config:   contract.BaseImage.ConfigDigest,
		RepoTags: []string{"index.docker.io/library/pdf-tools:26.08.0-r0-amd64"},
		Layers:   []string{strings.TrimPrefix(contract.BaseImage.LayerDigest, "sha256:") + ".tar.gz"},
	}})
	entries := []testDockerArchiveEntry{
		{name: "manifest.json", body: dockerBody, typeflag: tar.TypeReg, mode: 0o644},
		{name: "index.json", body: indexBody, typeflag: tar.TypeReg, mode: 0o644},
		{name: contract.BaseImage.ManifestDigest, body: manifestBody, typeflag: tar.TypeReg, mode: 0o644},
		{name: contract.BaseImage.ConfigDigest, body: configBody, typeflag: tar.TypeReg, mode: 0o644},
		{name: strings.TrimPrefix(contract.BaseImage.LayerDigest, "sha256:") + ".tar.gz", body: compressed.Bytes(), typeflag: tar.TypeReg, mode: 0o644},
	}
	if mutate != nil {
		mutate(&entries)
	}
	var archive bytes.Buffer
	archiveWriter := tar.NewWriter(&archive)
	for _, entry := range entries {
		if err := archiveWriter.WriteHeader(&tar.Header{
			Name: entry.name, Typeflag: entry.typeflag, Mode: entry.mode,
			Uid: entry.uid, Gid: entry.gid, Size: int64(len(entry.body)), Linkname: entry.linkname,
		}); err != nil {
			t.Fatal(err)
		}
		if entry.typeflag == tar.TypeReg {
			if _, err := archiveWriter.Write(entry.body); err != nil {
				t.Fatal(err)
			}
		}
	}
	if err := archiveWriter.Close(); err != nil {
		t.Fatal(err)
	}
	archiveDigest := sha256.Sum256(archive.Bytes())
	contract.BaseImage.ArchiveSHA256 = hex.EncodeToString(archiveDigest[:])
	contract.BaseImage.ArchiveSize = int64(archive.Len())
	path := filepath.Join(t.TempDir(), "base.tar")
	if err := os.WriteFile(path, archive.Bytes(), 0o644); err != nil {
		t.Fatal(err)
	}
	return checkedAuthority{contract: contract}, path
}

func mustJSON(t *testing.T, value any) []byte {
	t.Helper()
	body, err := json.Marshal(value)
	if err != nil {
		t.Fatal(err)
	}
	return body
}

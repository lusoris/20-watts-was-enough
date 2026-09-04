package pdftools

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

type noticeLayerMutation func(*[]tar.Header, map[string][]byte)

func TestInspectNoticeLayerRequiresExactClosedInventory(t *testing.T) {
	t.Parallel()
	contract, descriptor, diffID, layout := writeNoticeLayerFixture(t, nil, nil)
	observed, err := inspectNoticeLayer(context.Background(), layout, descriptor, diffID, contract)
	if err != nil {
		t.Fatal(err)
	}
	if len(observed) != 2 || observed[0].Path != contract.NoticeLayer.Entries[0].Destination ||
		observed[1].SHA256 != contract.NoticeLayer.Entries[1].SHA256 {
		t.Fatalf("notice observations = %#v", observed)
	}
}

func TestInspectNoticeLayerRejectsMetadataAndPayloadMutations(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name     string
		mutation noticeLayerMutation
		trailing []byte
	}{
		{name: "repeated directory", mutation: func(headers *[]tar.Header, _ map[string][]byte) {
			*headers = append((*headers)[:1], append([]tar.Header{(*headers)[0]}, (*headers)[1:]...)...)
		}},
		{name: "setuid notice", mutation: func(headers *[]tar.Header, _ map[string][]byte) {
			(*headers)[4].Mode = 0o4644
		}},
		{name: "wrong timestamp", mutation: func(headers *[]tar.Header, _ map[string][]byte) {
			(*headers)[4].ModTime = time.Unix(1_785_757_697, 0)
		}},
		{name: "user name metadata", mutation: func(headers *[]tar.Header, _ map[string][]byte) {
			(*headers)[4].Uname = "root"
		}},
		{name: "extended metadata", mutation: func(headers *[]tar.Header, _ map[string][]byte) {
			(*headers)[4].PAXRecords = map[string]string{"comment": "unexpected"}
		}},
		{name: "linked notice", mutation: func(headers *[]tar.Header, _ map[string][]byte) {
			(*headers)[4].Typeflag = tar.TypeSymlink
			(*headers)[4].Linkname = "../../outside"
			(*headers)[4].Size = 0
		}},
		{name: "unrelated file", mutation: func(headers *[]tar.Header, bodies map[string][]byte) {
			name := "usr/share/licenses/poppler/EXTRA"
			*headers = append(*headers, tar.Header{Name: name, Typeflag: tar.TypeReg, Mode: 0o644, Size: 1})
			bodies[name] = []byte("x")
		}},
		{name: "second gzip member", trailing: gzipMember(t, []byte("hidden"))},
	}
	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			contract, descriptor, diffID, layout := writeNoticeLayerFixture(t, test.mutation, test.trailing)
			if _, err := inspectNoticeLayer(context.Background(), layout, descriptor, diffID, contract); err == nil {
				t.Fatalf("inspectNoticeLayer() accepted %s", test.name)
			}
		})
	}
}

func TestLayerPathExistsResolvesAncestorLinks(t *testing.T) {
	t.Parallel()
	filesystem := map[string]layerFilesystemEntry{
		"bin":     {typeflag: tar.TypeSymlink, linkname: "usr/bin"},
		"sbin":    {typeflag: tar.TypeSymlink, linkname: "usr/bin"},
		"usr":     {typeflag: tar.TypeDir},
		"usr/bin": {typeflag: tar.TypeDir},
	}
	directories := map[string]struct{}{"usr": {}, "usr/bin": {}}
	for _, target := range []string{"bin/sh", "sbin/apk"} {
		exists, err := layerPathExists(filesystem, directories, target)
		if err != nil || exists {
			t.Fatalf("missing linked target %s = %t, %v", target, exists, err)
		}
	}
	filesystem["usr/bin/sh"] = layerFilesystemEntry{typeflag: tar.TypeReg}
	filesystem["usr/bin/apk"] = layerFilesystemEntry{typeflag: tar.TypeReg}
	for _, target := range []string{"bin/sh", "sbin/apk"} {
		exists, err := layerPathExists(filesystem, directories, target)
		if err != nil || !exists {
			t.Fatalf("present linked target %s = %t, %v", target, exists, err)
		}
	}
}

func TestLayerPathExistsRejectsLinkCycles(t *testing.T) {
	t.Parallel()
	filesystem := map[string]layerFilesystemEntry{
		"bin": {typeflag: tar.TypeSymlink, linkname: "bin"},
	}
	if _, err := layerPathExists(filesystem, map[string]struct{}{}, "bin/sh"); err == nil {
		t.Fatal("cyclic ancestor link was accepted")
	}
}

func TestScanCompressedLayerHardBoundsExpandedBytes(t *testing.T) {
	t.Parallel()
	expanded := bytes.Repeat([]byte{0}, 64*1024)
	compressed := gzipMember(t, expanded)
	compressedDigest := sha256.Sum256(compressed)
	expandedDigest := sha256.Sum256(expanded)
	descriptor := ociDescriptor{
		MediaType: ociLayerMediaType,
		Digest:    "sha256:" + hex.EncodeToString(compressedDigest[:]),
		Size:      int64(len(compressed)),
	}
	layout := t.TempDir()
	blobRoot := filepath.Join(layout, "blobs", "sha256")
	if err := os.MkdirAll(blobRoot, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(blobRoot, strings.TrimPrefix(descriptor.Digest, "sha256:")), compressed, 0o644); err != nil {
		t.Fatal(err)
	}
	contract := Contract{Limits: Limits{FinalArchiveBytes: 4 * 1024}}
	expandedBytes, err := scanCompressedLayer(
		context.Background(), layout, descriptor,
		"sha256:"+hex.EncodeToString(expandedDigest[:]), contract,
		func(*tar.Header, io.Reader) error { return nil },
	)
	if err == nil || !strings.Contains(err.Error(), "byte boundary") || expandedBytes > 8*contract.Limits.FinalArchiveBytes+1 {
		t.Fatalf("expanded gzip boundary = %d bytes, %v", expandedBytes, err)
	}
}

func writeNoticeLayerFixture(
	t *testing.T,
	mutate noticeLayerMutation,
	trailing []byte,
) (Contract, ociDescriptor, string, string) {
	t.Helper()
	noticeBodies := map[string][]byte{
		"usr/share/licenses/poppler/AUTHORS": []byte("authors\n"),
		"usr/share/licenses/poppler/COPYING": []byte("licence\n"),
	}
	headers := []tar.Header{
		{Name: "usr", Typeflag: tar.TypeDir, Mode: 0o755},
		{Name: "usr/share", Typeflag: tar.TypeDir, Mode: 0o755},
		{Name: "usr/share/licenses", Typeflag: tar.TypeDir, Mode: 0o755},
		{Name: "usr/share/licenses/poppler", Typeflag: tar.TypeDir, Mode: 0o755},
		{Name: "usr/share/licenses/poppler/AUTHORS", Typeflag: tar.TypeReg, Mode: 0o644, Size: int64(len(noticeBodies["usr/share/licenses/poppler/AUTHORS"]))},
		{Name: "usr/share/licenses/poppler/COPYING", Typeflag: tar.TypeReg, Mode: 0o644, Size: int64(len(noticeBodies["usr/share/licenses/poppler/COPYING"]))},
	}
	for index := range headers {
		headers[index].Uid = 0
		headers[index].Gid = 0
		headers[index].ModTime = time.Unix(1_785_757_696, 0)
	}
	if mutate != nil {
		mutate(&headers, noticeBodies)
	}
	var expanded bytes.Buffer
	tarWriter := tar.NewWriter(&expanded)
	for index := range headers {
		header := headers[index]
		if err := tarWriter.WriteHeader(&header); err != nil {
			t.Fatal(err)
		}
		if header.Typeflag == tar.TypeReg {
			if _, err := tarWriter.Write(noticeBodies[header.Name]); err != nil {
				t.Fatal(err)
			}
		}
	}
	if err := tarWriter.Close(); err != nil {
		t.Fatal(err)
	}
	var compressed bytes.Buffer
	gzipWriter, err := gzip.NewWriterLevel(&compressed, gzip.BestCompression)
	if err != nil {
		t.Fatal(err)
	}
	gzipWriter.Header.ModTime = time.Unix(0, 0)
	if _, err := gzipWriter.Write(expanded.Bytes()); err != nil {
		t.Fatal(err)
	}
	if err := gzipWriter.Close(); err != nil {
		t.Fatal(err)
	}
	compressed.Write(trailing)
	compressedDigest := sha256.Sum256(compressed.Bytes())
	expandedDigest := sha256.Sum256(expanded.Bytes())
	descriptor := ociDescriptor{
		MediaType: ociLayerMediaType,
		Digest:    "sha256:" + hex.EncodeToString(compressedDigest[:]),
		Size:      int64(compressed.Len()),
	}
	diffID := "sha256:" + hex.EncodeToString(expandedDigest[:])
	layout := t.TempDir()
	blobRoot := filepath.Join(layout, "blobs", "sha256")
	if err := os.MkdirAll(blobRoot, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(blobRoot, strings.TrimPrefix(descriptor.Digest, "sha256:")), compressed.Bytes(), 0o644); err != nil {
		t.Fatal(err)
	}
	entries := make([]NoticeEntry, 0, 2)
	for _, name := range []string{"AUTHORS", "COPYING"} {
		body := noticeBodies["usr/share/licenses/poppler/"+name]
		digest := sha256.Sum256(body)
		entries = append(entries, NoticeEntry{
			Source:      "notices/" + name,
			Destination: "/usr/share/licenses/poppler/" + name,
			SHA256:      hex.EncodeToString(digest[:]),
			Size:        int64(len(body)),
		})
	}
	contract := Contract{
		SourceDateEpoch: 1_785_757_696,
		NoticeLayer:     NoticeLayer{Entries: entries},
		Limits:          Limits{FinalArchiveBytes: 8 * 1024 * 1024, NoticeBytes: 1024 * 1024},
	}
	return contract, descriptor, diffID, layout
}

func gzipMember(t *testing.T, body []byte) []byte {
	t.Helper()
	var buffer bytes.Buffer
	writer := gzip.NewWriter(&buffer)
	if _, err := writer.Write(body); err != nil {
		t.Fatal(err)
	}
	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	return buffer.Bytes()
}

package pdfrender

import (
	"archive/tar"
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"math"
	"strings"
	"testing"
)

type imageProofTarFixture struct {
	header tar.Header
	body   []byte
}

func imageProofBlobFixture(body []byte) imageProofTarFixture {
	return imageProofTarFixture{
		header: tar.Header{
			Name: "blobs/sha256/" + strings.TrimPrefix(digestBytes(body), "sha256:"),
			Size: int64(len(body)), Typeflag: tar.TypeReg, Mode: 0o444,
		},
		body: body,
	}
}

func imageProofTarFixtureBytes(t *testing.T, fixtures ...imageProofTarFixture) []byte {
	t.Helper()
	var buffer bytes.Buffer
	writer := tar.NewWriter(&buffer)
	for _, fixture := range fixtures {
		if err := writer.WriteHeader(&fixture.header); err != nil {
			t.Fatal(err)
		}
		if _, err := writer.Write(fixture.body); err != nil {
			t.Fatal(err)
		}
	}
	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	return buffer.Bytes()
}

func imageProofPhysicalHeader(t *testing.T, size int64) []byte {
	t.Helper()
	var buffer bytes.Buffer
	writer := tar.NewWriter(&buffer)
	err := writer.WriteHeader(&tar.Header{Name: "index.json", Size: size, Typeflag: tar.TypeReg, Mode: 0o444, Format: tar.FormatGNU})
	if err != nil {
		t.Fatal(err)
	}
	return bytes.Clone(buffer.Bytes()[:imageProofTarBlockBytes])
}

func imageProofRepairChecksum(block []byte) {
	copy(block[148:156], "        ")
	var checksum int
	for _, value := range block {
		checksum += int(value)
	}
	copy(block[148:156], fmt.Sprintf("%06o\x00 ", checksum))
}

func TestImageProofArchiveRetainsOnlySmallBlobsAndCountsPhysicalBytes(t *testing.T) {
	t.Parallel()
	small := imageProofBlobFixture([]byte("{\"schemaVersion\":2}"))
	large := imageProofBlobFixture(bytes.Repeat([]byte{'x'}, int(maximumImageProofBlobBytes)+1))
	fixtures := []imageProofTarFixture{
		{header: tar.Header{Name: "blobs/", Typeflag: tar.TypeDir, Mode: 0o755}},
		{header: tar.Header{Name: "blobs/sha256/", Typeflag: tar.TypeDir, Mode: 0o755}},
		large,
		{header: tar.Header{Name: "oci-layout", Typeflag: tar.TypeReg, Size: 2}, body: []byte("{}")},
		small,
	}
	input := imageProofTarFixtureBytes(t, fixtures...)
	input = append(input, make([]byte, imageProofTarBlockBytes)...)
	archive, err := readImageProofArchive(context.Background(), bytes.NewReader(input))
	if err != nil || archive.streamBytes != int64(len(input)) || len(archive.sizes) != 3 || len(archive.small) != 2 {
		t.Fatalf("archive sizes or physical bytes = %+v, error %v", archive, err)
	}
	if !bytes.Equal(archive.small[small.header.Name], small.body) || archive.sizes[large.header.Name] != large.header.Size {
		t.Fatal("archive lost exact small bytes or large-blob size")
	}
	if _, retained := archive.small[large.header.Name]; retained {
		t.Fatal("large layer payload was retained")
	}
}

func TestImageProofArchiveRejectsPhysicalExtensionHeadersBeforeTheirBodies(t *testing.T) {
	t.Parallel()
	for _, flag := range []byte{tar.TypeXHeader, tar.TypeXGlobalHeader, tar.TypeGNULongName, tar.TypeGNULongLink, tar.TypeGNUSparse, tar.TypeSymlink, tar.TypeLink, tar.TypeChar, tar.TypeBlock, tar.TypeFifo} {
		t.Run(fmt.Sprintf("flag-%d", flag), func(t *testing.T) {
			block := imageProofPhysicalHeader(t, maximumImageProofArchiveBytes)
			block[156] = flag
			imageProofRepairChecksum(block)
			archive, err := readImageProofArchive(context.Background(), bytes.NewReader(block))
			if err == nil || !strings.Contains(err.Error(), "physical header type") || archive.streamBytes != imageProofTarBlockBytes {
				t.Fatalf("extension header consumed body or passed: bytes %d, error %v", archive.streamBytes, err)
			}
		})
	}
}

func TestImageProofArchiveRejectsUnsafeHeadersAndFraming(t *testing.T) {
	t.Parallel()
	fixture := imageProofBlobFixture([]byte("{}"))
	valid := imageProofTarFixtureBytes(t, fixture)
	wrongHash := imageProofBlobFixture([]byte("[]"))
	wrongHash.header.Name = fixture.header.Name
	badPadding := bytes.Clone(valid)
	badPadding[imageProofTarBlockBytes+len(fixture.body)] = 1
	badChecksum := bytes.Clone(valid)
	badChecksum[0] ^= 1
	nonzeroSecondEnd := bytes.Clone(valid)
	nonzeroSecondEnd[len(valid)-imageProofTarBlockBytes] = 1
	negative := imageProofPhysicalHeader(t, 0)
	for index := 124; index < 136; index++ {
		negative[index] = 0xff
	}
	imageProofRepairChecksum(negative)
	large := imageProofBlobFixture(bytes.Repeat([]byte{'x'}, int(maximumImageProofBlobBytes)+1))
	largeInput := imageProofTarFixtureBytes(t, large)
	inputs := map[string][]byte{
		"duplicate":            imageProofTarFixtureBytes(t, fixture, fixture),
		"wrong named hash":     imageProofTarFixtureBytes(t, wrongHash),
		"checksum":             badChecksum,
		"nonzero padding":      badPadding,
		"negative size":        negative,
		"oversized member":     imageProofPhysicalHeader(t, maximumImageProofArchiveBytes+1),
		"overflowing size":     imageProofPhysicalHeader(t, math.MaxInt64),
		"truncated header":     valid[:imageProofTarBlockBytes-1],
		"truncated body":       valid[:imageProofTarBlockBytes+1],
		"truncated large body": largeInput[:imageProofTarBlockBytes+int(maximumImageProofBlobBytes)],
		"truncated padding":    valid[:imageProofTarBlockBytes+3],
		"missing terminators":  valid[:len(valid)-2*imageProofTarBlockBytes],
		"single terminator":    valid[:len(valid)-imageProofTarBlockBytes],
		"nonzero second end":   nonzeroSecondEnd,
		"partial zero trailer": append(bytes.Clone(valid), 0),
		"nonzero full trailer": append(bytes.Clone(valid), bytes.Repeat([]byte{1}, imageProofTarBlockBytes)...),
	}
	for _, name := range []string{"../index.json", "/index.json", "blobs/sha256/" + strings.Repeat("A", 64), "blobs/sha256/" + strings.Repeat("a", 63), "index.json/", "blobs/sha256/../index.json"} {
		bad := bytes.Clone(valid)
		clear(bad[:100])
		copy(bad[:100], name)
		imageProofRepairChecksum(bad[:imageProofTarBlockBytes])
		inputs["path "+name] = bad
	}
	inputs["unknown directory"] = imageProofTarFixtureBytes(t, imageProofTarFixture{header: tar.Header{Name: "other/", Typeflag: tar.TypeDir}})
	linked := fixture
	linked.header.Linkname = "elsewhere"
	inputs["regular with link target"] = imageProofTarFixtureBytes(t, linked)
	for name, input := range inputs {
		t.Run(name, func(t *testing.T) {
			if _, err := readImageProofArchive(context.Background(), bytes.NewReader(input)); err == nil {
				t.Fatal("accepted malformed archive")
			}
		})
	}
}

func TestImageProofArchiveCountsDirectoriesAndRejectsHeader129(t *testing.T) {
	t.Parallel()
	fixtures := []imageProofTarFixture{
		{header: tar.Header{Name: "blobs/", Typeflag: tar.TypeDir}},
		{header: tar.Header{Name: "blobs/sha256/", Typeflag: tar.TypeDir}},
	}
	for index := 0; index < maximumImageProofEntries-2; index++ {
		fixtures = append(fixtures, imageProofBlobFixture([]byte(fmt.Sprintf("{\"index\":%d}", index))))
	}
	archive, err := readImageProofArchive(context.Background(), bytes.NewReader(imageProofTarFixtureBytes(t, fixtures...)))
	if err != nil || len(archive.sizes) != maximumImageProofEntries-2 {
		t.Fatalf("128 physical headers failed: %d regular entries, error %v", len(archive.sizes), err)
	}
	fixtures = append(fixtures, imageProofBlobFixture([]byte("{\"overflow\":true}")))
	if _, err := readImageProofArchive(context.Background(), bytes.NewReader(imageProofTarFixtureBytes(t, fixtures...))); err == nil || !strings.Contains(err.Error(), "128 physical headers") {
		t.Fatalf("129th physical header error = %v", err)
	}
}

func TestImageProofArchiveBoundsAggregateSmallBlobRetention(t *testing.T) {
	t.Parallel()
	fixtures := make([]imageProofTarFixture, 0, maximumImageProofSmallBytes/maximumImageProofBlobBytes+1)
	for index := int64(0); index < maximumImageProofSmallBytes/maximumImageProofBlobBytes; index++ {
		body := bytes.Repeat([]byte{byte(index)}, int(maximumImageProofBlobBytes))
		fixtures = append(fixtures, imageProofBlobFixture(body))
	}
	archive, err := readImageProofArchive(context.Background(), bytes.NewReader(imageProofTarFixtureBytes(t, fixtures...)))
	if err != nil || len(archive.small) != len(fixtures) {
		t.Fatalf("exact 1 MiB small-blob boundary: entries %d, error %v", len(archive.small), err)
	}
	fixtures = append(fixtures, imageProofBlobFixture([]byte("overflow")))
	if _, err := readImageProofArchive(context.Background(), bytes.NewReader(imageProofTarFixtureBytes(t, fixtures...))); err == nil || !strings.Contains(err.Error(), "1 MiB") {
		t.Fatalf("retained small-byte overflow error = %v", err)
	}
}

func TestImageProofStreamEnforcesExactByteBoundary(t *testing.T) {
	t.Parallel()
	for _, test := range []struct {
		name  string
		bytes int
		limit int64
		pass  bool
	}{{"exact", 1024, 1024, true}, {"one byte over", 1025, 1024, false}, {"far over", 4096, 1024, false}} {
		t.Run(test.name, func(t *testing.T) {
			stream := &imageProofStream{ctx: context.Background(), source: bytes.NewReader(make([]byte, test.bytes)), remaining: test.limit}
			_, err := io.Copy(io.Discard, stream)
			if (err == nil) != test.pass || stream.readBytes > test.limit+1 {
				t.Fatalf("bounded stream read %d bytes, error %v", stream.readBytes, err)
			}
			if test.pass && stream.readBytes != test.limit {
				t.Fatal("exact bound did not consume the complete stream")
			}
		})
	}
	stream := &imageProofStream{ctx: context.Background(), source: bytes.NewReader(make([]byte, 2*imageProofTarBlockBytes)), remaining: imageProofTarBlockBytes}
	if err := finishImageProofArchive(stream); err == nil || !strings.Contains(err.Error(), "byte bound") {
		t.Fatalf("trailing padding bypassed total byte bound: %v", err)
	}
}

type imageProofCancelReader struct {
	reader io.Reader
	cancel context.CancelFunc
}

func (reader imageProofCancelReader) Read(body []byte) (int, error) {
	count, err := reader.reader.Read(body)
	reader.cancel()
	return count, err
}

type imageProofNoProgressReader struct{}

func (imageProofNoProgressReader) Read([]byte) (int, error) { return 0, nil }

func TestImageProofArchiveRejectsCancellationAndNoProgress(t *testing.T) {
	t.Parallel()
	valid := imageProofTarFixtureBytes(t, imageProofBlobFixture([]byte("{}")))
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	archive, err := readImageProofArchive(ctx, bytes.NewReader(valid))
	if !errors.Is(err, context.Canceled) || archive.streamBytes != 0 {
		t.Fatalf("pre-cancelled archive read %d bytes, error %v", archive.streamBytes, err)
	}
	ctx, cancel = context.WithCancel(context.Background())
	defer cancel()
	archive, err = readImageProofArchive(ctx, imageProofCancelReader{reader: bytes.NewReader(valid), cancel: cancel})
	if !errors.Is(err, context.Canceled) || archive.streamBytes != imageProofTarBlockBytes {
		t.Fatalf("mid-read cancellation consumed %d bytes, error %v", archive.streamBytes, err)
	}
	if _, err := readImageProofArchive(context.Background(), imageProofNoProgressReader{}); !errors.Is(err, io.ErrNoProgress) {
		t.Fatalf("non-progressing source error = %v", err)
	}
}

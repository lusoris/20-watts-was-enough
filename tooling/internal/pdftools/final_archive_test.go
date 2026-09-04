package pdftools

import (
	"archive/tar"
	"bytes"
	"context"
	"testing"
	"time"
)

func TestExtractFinalOCITarRequiresCanonicalOuterMetadata(t *testing.T) {
	t.Parallel()
	const epoch = int64(1_785_757_696)
	mutations := map[string]func(*tar.Header){
		"wrong mode": func(header *tar.Header) {
			header.Mode = 0o644
		},
		"wrong timestamp": func(header *tar.Header) {
			header.ModTime = time.Unix(epoch+1, 0)
		},
		"user name": func(header *tar.Header) {
			header.Uname = "root"
		},
		"PAX record": func(header *tar.Header) {
			header.PAXRecords = map[string]string{"comment": "unexpected"}
		},
	}

	exact := finalOuterTarFixture(t, 0, nil)
	if _, err := extractFinalOCITar(
		context.Background(), tar.NewReader(bytes.NewReader(exact)), t.TempDir(), int64(len(exact)),
	); err != nil {
		t.Fatalf("exact outer metadata rejected: %v", err)
	}
	for name, mutate := range mutations {
		name, mutate := name, mutate
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			body := finalOuterTarFixture(t, 0, mutate)
			if _, err := extractFinalOCITar(
				context.Background(), tar.NewReader(bytes.NewReader(body)), t.TempDir(), int64(len(body)),
			); err == nil {
				t.Fatalf("outer OCI tar accepted %s mutation", name)
			}
		})
	}
}

func TestFinalIndexRequiresExactPinnedExporterAnnotation(t *testing.T) {
	t.Parallel()
	contract := Contract{SourceDateEpoch: 1_785_757_696}
	created := time.Unix(contract.SourceDateEpoch, 0).UTC().Format(time.RFC3339)
	if !validFinalIndexAnnotations(map[string]string{"org.opencontainers.image.created": created}, contract) {
		t.Fatal("exact pinned exporter annotation was rejected")
	}
	for _, annotations := range []map[string]string{
		nil,
		{},
		{"org.opencontainers.image.created": created, "unexpected": "value"},
	} {
		if validFinalIndexAnnotations(annotations, contract) {
			t.Fatalf("non-exact exporter annotations were accepted: %#v", annotations)
		}
	}
}

func finalOuterTarFixture(t *testing.T, epoch int64, mutate func(*tar.Header)) []byte {
	t.Helper()
	body := []byte("{\"imageLayoutVersion\":\"1.0.0\"}\n")
	header := tar.Header{
		Name: "oci-layout", Typeflag: tar.TypeReg, Mode: 0o444,
		Uid: 0, Gid: 0, Size: int64(len(body)), ModTime: time.Unix(epoch, 0),
	}
	if mutate != nil {
		mutate(&header)
	}
	var archive bytes.Buffer
	writer := tar.NewWriter(&archive)
	if err := writer.WriteHeader(&header); err != nil {
		t.Fatal(err)
	}
	if _, err := writer.Write(body); err != nil {
		t.Fatal(err)
	}
	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	return archive.Bytes()
}

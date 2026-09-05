package clrsfixture

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

func TestGeneratorOCIRejectsOuterTarReinterpretation(t *testing.T) {
	options, members, _, _, _ := ociTestFixture(t, true, 1)
	for _, test := range []struct {
		name string
		edit func([]ociTestMember) []ociTestMember
	}{
		{"duplicate", func(m []ociTestMember) []ociTestMember { return append(m, m[0]) }},
		{"traversal", func(m []ociTestMember) []ociTestMember { m[0].header.Name = "../oci-layout"; return m }},
		{"absolute", func(m []ociTestMember) []ociTestMember { m[0].header.Name = "/oci-layout"; return m }},
		{"backslash", func(m []ociTestMember) []ociTestMember { m[0].header.Name = `blobs\sha256\bad`; return m }},
		{"symlink", func(m []ociTestMember) []ociTestMember {
			m[0].header.Typeflag, m[0].header.Linkname, m[0].body = tar.TypeSymlink, "index.json", nil
			return m
		}},
		{"hardlink", func(m []ociTestMember) []ociTestMember {
			m[0].header.Typeflag, m[0].header.Linkname, m[0].body = tar.TypeLink, "index.json", nil
			return m
		}},
		{"pax", func(m []ociTestMember) []ociTestMember {
			m[0].header.Format, m[0].header.PAXRecords = tar.FormatPAX, map[string]string{"comment": "extension"}
			return m
		}},
		{"unknown-file", func(m []ociTestMember) []ociTestMember { m[0].header.Name = "manifest.json"; return m }},
		{"missing-blob", func(m []ociTestMember) []ociTestMember { return m[:len(m)-1] }},
		{"blob-name-hash", func(m []ociTestMember) []ociTestMember { m[4].body = []byte("different bytes"); return m }},
		{"unreferenced-blob", func(m []ociTestMember) []ociTestMember {
			body := []byte("unreferenced")
			return append(m, ociTestMember{tar.Header{Name: "blobs/sha256/" + rawSHA256(body), Mode: 0o644, Typeflag: tar.TypeReg}, body})
		}},
		{"duplicate-json", func(m []ociTestMember) []ociTestMember {
			m[0].body = []byte(`{"imageLayoutVersion":"1.0.0","imageLayoutVersion":"1.0.0"}`)
			return m
		}},
		{"aliased-json", func(m []ociTestMember) []ociTestMember {
			m[0].body = []byte(`{"ImageLayoutVersion":"1.0.0"}`)
			return m
		}},
		{"trailing-json", func(m []ociTestMember) []ociTestMember {
			m[0].body = []byte(`{"imageLayoutVersion":"1.0.0"} {}`)
			return m
		}},
	} {
		t.Run(test.name, func(t *testing.T) {
			changed := test.edit(slices.Clone(members))
			candidate := ociTestWrite(t, options, ociTestTar(t, changed))
			report, err := InspectGeneratorOCIArchive(context.Background(), candidate)
			assertOCIFailure(t, report, err)
		})
	}
	valid := ociTestTar(t, members)
	for _, body := range [][]byte{valid[:len(valid)-1024], valid[:len(valid)-512], append(bytes.Clone(valid), bytes.Repeat([]byte{1}, 512)...), ociTestHeaderType(valid, tar.TypeGNUSparse)} {
		candidate := ociTestWrite(t, options, body)
		report, err := InspectGeneratorOCIArchive(context.Background(), candidate)
		assertOCIFailure(t, report, err)
	}
	// Zero padding is allowed; it must not bypass exact member closure.
	withPadding := append(bytes.Clone(valid), make([]byte, 10240)...)
	candidate := ociTestWrite(t, options, withPadding)
	if _, err := InspectGeneratorOCIArchive(context.Background(), candidate); err != nil {
		t.Fatalf("bounded zero framing was rejected: %v", err)
	}
}

func ociTestHeaderType(body []byte, flag byte) []byte {
	changed := bytes.Clone(body)
	changed[156] = flag
	copy(changed[148:156], "        ")
	var sum int
	for _, value := range changed[:512] {
		sum += int(value)
	}
	copy(changed[148:156], fmt.Sprintf("%06o\x00 ", sum))
	return changed
}

func TestGeneratorOCIClosedDescriptorProfile(t *testing.T) {
	valid := map[string]any{"mediaType": generatorOCIManifestType, "digest": "sha256:" + strings.Repeat("1", 64), "size": 1}
	for _, edit := range []func(map[string]any){
		func(o map[string]any) { o["urls"] = []string{"https://example.invalid"} },
		func(o map[string]any) { o["data"] = "e30=" },
		func(o map[string]any) { o["artifactType"] = "application/example" },
		func(o map[string]any) { o["size"] = 0 },
		func(o map[string]any) { o["size"] = 65 << 10 },
		func(o map[string]any) { o["size"] = 1.5 },
		func(o map[string]any) { o["digest"] = "sha256:" + strings.Repeat("A", 64) },
		func(o map[string]any) { o["Digest"] = o["digest"] },
		func(o map[string]any) { o["annotations"] = map[string]any{"invalid": nil} },
		func(o map[string]any) { o["annotations"] = map[string]any{"invalid": 2} },
		func(o map[string]any) { o["annotations"] = map[string]any{"long": strings.Repeat("a", 4097)} },
		func(o map[string]any) { o["platform"] = map[string]string{"os": "linux", "architecture": "arm64"} },
		func(o map[string]any) {
			o["platform"] = map[string]string{"os": "linux", "architecture": "amd64", "variant": "v3"}
		},
	} {
		copy := make(map[string]any)
		for k, v := range valid {
			copy[k] = v
		}
		edit(copy)
		if _, err := parseGeneratorOCIDescriptor(generationImageJSON(t, copy), true, 64<<10); err == nil {
			t.Fatalf("invalid descriptor accepted: %#v", copy)
		}
	}
	valid["annotations"] = map[string]string{"example": "original value"}
	valid["platform"] = map[string]string{"os": "linux", "architecture": "amd64", "variant": "v1"}
	if _, err := parseGeneratorOCIDescriptor(generationImageJSON(t, valid), true, 64<<10); err != nil {
		t.Fatal(err)
	}
	if _, err := parseGeneratorOCIDescriptor(generationImageJSON(t, valid), false, 64<<10); err == nil {
		t.Fatal("platform metadata accepted on a config/layer descriptor")
	}
	deep := `{"imageLayoutVersion":"1.0.0","x":` + strings.Repeat("[", 14) + "0" + strings.Repeat("]", 14) + "}"
	if _, err := generationImageObject([]byte(deep), "imageLayoutVersion", "x"); err == nil {
		t.Fatal("over-depth JSON accepted")
	}
}

func TestGeneratorOCIRejectsManifestAndLayerSubstitution(t *testing.T) {
	options, members, manifest, _, _ := ociTestFixture(t, true, 1)
	for _, edit := range []func(map[string]any){
		func(o map[string]any) { o["subject"] = map[string]any{} },
		func(o map[string]any) { o["schemaVersion"] = 1 },
		func(o map[string]any) { o["mediaType"] = "application/vnd.docker.distribution.manifest.v2+json" },
		func(o map[string]any) { o["layers"] = []any{} },
		func(o map[string]any) {
			o["layers"].([]any)[0].(map[string]any)["mediaType"] = generatorOCITarType + "+zstd"
		},
		func(o map[string]any) {
			o["config"].(map[string]any)["mediaType"] = "application/vnd.oci.empty.v1+json"
		},
	} {
		var object map[string]any
		if err := json.Unmarshal(manifest, &object); err != nil {
			t.Fatal(err)
		}
		edit(object)
		if _, _, err := generatorOCIManifest(generationImageJSON(t, object), generatorOCILimits()); err == nil {
			t.Fatalf("invalid manifest accepted: %#v", object)
		}
	}
	options = ociTestWrite(t, options, ociTestTar(t, members))
	file, err := os.Open(options.ArchivePath)
	if err != nil {
		t.Fatal(err)
	}
	defer file.Close()
	inventory, err := scanGeneratorOCI(context.Background(), file, options.ExpectedArchiveBytes, generatorOCILimits())
	if err != nil {
		t.Fatal(err)
	}
	_, layers, err := generatorOCIManifest(manifest, generatorOCILimits())
	if err != nil {
		t.Fatal(err)
	}
	descriptor := layers[0]
	item := inventory["blobs/sha256/"+strings.TrimPrefix(descriptor.Digest, "sha256:")]
	if _, err := inspectGeneratorOCILayer(context.Background(), file, item, descriptor, "sha256:"+strings.Repeat("0", 64), 4<<30); err == nil {
		t.Fatal("wrong ordered diff ID accepted")
	}
	broken := descriptor
	broken.Bytes++
	if _, err := locateGeneratorOCI(inventory, map[string]GeneratorOCIDescriptor{}, broken); err == nil {
		t.Fatal("wrong descriptor size accepted")
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if _, err := inspectGeneratorOCILayer(ctx, file, item, descriptor, "ignored", 4<<30); !errors.Is(err, context.Canceled) {
		t.Fatalf("layer cancellation cause missing: %v", err)
	}
	// Corrupt gzip bytes but bind their new raw digest: decoding itself must fail.
	bad := bytes.Clone(members[4].body)
	bad[len(bad)-8] ^= 1
	if err := os.WriteFile(options.ArchivePath+".bad", bad, 0o600); err != nil {
		t.Fatal(err)
	}
	badFile, err := os.Open(options.ArchivePath + ".bad")
	if err != nil {
		t.Fatal(err)
	}
	defer badFile.Close()
	descriptor.Digest, descriptor.Bytes = "sha256:"+rawSHA256(bad), int64(len(bad))
	if _, err := inspectGeneratorOCILayer(context.Background(), badFile, generatorOCIMember{size: int64(len(bad))}, descriptor, "ignored", 4<<30); err == nil {
		t.Fatal("gzip checksum corruption accepted")
	}
}

func TestGeneratorOCIConfigPlatformAndRuntimeProfile(t *testing.T) {
	for _, variant := range []any{"v3", "", nil, 1} {
		_, config, runtime := generationImageFixture(t)
		config["variant"] = variant
		if _, err := generatorOCIConfigInspection(generationImageJSON(t, config), runtime); err == nil {
			t.Fatalf("unsupported config variant accepted: %#v", variant)
		}
	}
	_, config, runtime := generationImageFixture(t)
	config["variant"] = "v1"
	if _, err := generatorOCIConfigInspection(generationImageJSON(t, config), runtime); err != nil {
		t.Fatal(err)
	}
	config["config"].(map[string]any)["User"] = "0:0"
	if _, err := generatorOCIConfigInspection(generationImageJSON(t, config), runtime); err == nil {
		t.Fatal("runtime authority mismatch accepted")
	}
}

func TestGeneratorOCIGzipMembersAndTrailingBytes(t *testing.T) {
	var encoded bytes.Buffer
	decoded := []byte("one complete decoded byte stream")
	for _, body := range [][]byte{decoded[:10], decoded[10:]} {
		writer := gzip.NewWriter(&encoded)
		if _, err := writer.Write(body); err != nil {
			t.Fatal(err)
		}
		if err := writer.Close(); err != nil {
			t.Fatal(err)
		}
	}
	for _, suffix := range [][]byte{nil, {1}, {0, 0}, []byte("non-gzip")} {
		body := append(bytes.Clone(encoded.Bytes()), suffix...)
		filename := filepath.Join(t.TempDir(), "blob")
		if err := os.WriteFile(filename, body, 0o600); err != nil {
			t.Fatal(err)
		}
		file, err := os.Open(filename)
		if err != nil {
			t.Fatal(err)
		}
		descriptor := GeneratorOCIDescriptor{generatorOCITarType + "+gzip", "sha256:" + rawSHA256(body), int64(len(body))}
		result, readErr := inspectGeneratorOCILayer(context.Background(), file, generatorOCIMember{size: int64(len(body))}, descriptor, "sha256:"+rawSHA256(decoded), int64(len(decoded)))
		if err := file.Close(); err != nil {
			t.Fatal(err)
		}
		if len(suffix) == 0 && (readErr != nil || result.ExpandedBytes != int64(len(decoded))) {
			t.Fatalf("concatenated gzip failed its complete decoded identity: %v", readErr)
		}
		if len(suffix) != 0 && readErr == nil {
			t.Fatal("gzip decoder accepted unparsed trailing bytes")
		}
	}
}

package clrsfixture

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
)

type ociTestMember struct {
	header tar.Header
	body   []byte
}

func ociTestTar(t *testing.T, members []ociTestMember) []byte {
	t.Helper()
	var buffer bytes.Buffer
	writer := tar.NewWriter(&buffer)
	for _, member := range members {
		member.header.Size = int64(len(member.body))
		if err := writer.WriteHeader(&member.header); err != nil {
			t.Fatal(err)
		}
		if _, err := writer.Write(member.body); err != nil {
			t.Fatal(err)
		}
	}
	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	return buffer.Bytes()
}

func ociTestFixture(t *testing.T, compressed bool, copies int) (GeneratorOCIOptions, []ociTestMember, []byte, []byte, int64) {
	t.Helper()
	repository, err := filepath.Abs("../../..")
	if err != nil {
		t.Fatal(err)
	}
	authority, err := loadInvocationInputs(context.Background(), repository)
	if err != nil {
		t.Fatal(err)
	}
	layer := ociTestTar(t, []ociTestMember{{tar.Header{Name: "example", Mode: 0o644, Typeflag: tar.TypeReg, Format: tar.FormatUSTAR}, []byte("fixed example\n")}})
	layerBlob, media := bytes.Clone(layer), generatorOCITarType
	if compressed {
		var buffer bytes.Buffer
		writer := gzip.NewWriter(&buffer)
		if _, err := writer.Write(layer); err != nil {
			t.Fatal(err)
		}
		if err := writer.Close(); err != nil {
			t.Fatal(err)
		}
		layerBlob, media = buffer.Bytes(), generatorOCITarType+"+gzip"
	}
	layers, diffIDs := make([]any, copies), make([]string, copies)
	for index := range layers {
		layers[index] = map[string]any{"mediaType": media, "digest": "sha256:" + rawSHA256(layerBlob), "size": len(layerBlob)}
		diffIDs[index] = "sha256:" + rawSHA256(layer)
	}
	_, config, _ := generationImageFixture(t)
	config["config"].(map[string]any)["Env"] = authority.image.Runtime.Environment
	config["rootfs"].(map[string]any)["diff_ids"] = diffIDs
	configRaw, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		t.Fatal(err)
	}
	configRaw = append(configRaw, '\n')
	manifestRaw := generationImageJSON(t, map[string]any{"schemaVersion": 2, "mediaType": generatorOCIManifestType,
		"config": map[string]any{"mediaType": generatorOCIConfigType, "digest": "sha256:" + rawSHA256(configRaw), "size": len(configRaw)}, "layers": layers})
	indexRaw := generationImageJSON(t, map[string]any{"schemaVersion": 2, "manifests": []any{map[string]any{
		"mediaType": generatorOCIManifestType, "digest": "sha256:" + rawSHA256(manifestRaw), "size": len(manifestRaw),
		"platform": map[string]string{"os": "linux", "architecture": "amd64"}}}})
	members := []ociTestMember{}
	for _, value := range []struct {
		name string
		body []byte
	}{{"oci-layout", []byte(`{"imageLayoutVersion":"1.0.0"}`)}, {"index.json", indexRaw},
		{"blobs/sha256/" + rawSHA256(manifestRaw), manifestRaw}, {"blobs/sha256/" + rawSHA256(configRaw), configRaw}, {"blobs/sha256/" + rawSHA256(layerBlob), layerBlob}} {
		members = append(members, ociTestMember{tar.Header{Name: value.name, Typeflag: tar.TypeReg, Mode: 0o644, Format: tar.FormatUSTAR}, value.body})
	}
	options := GeneratorOCIOptions{RepositoryRoot: repository, ArchivePath: filepath.Join(t.TempDir(), "candidate.tar")}
	return options, members, manifestRaw, configRaw, int64(len(layer) * copies)
}

func ociTestWrite(t *testing.T, options GeneratorOCIOptions, body []byte) GeneratorOCIOptions {
	t.Helper()
	if err := os.WriteFile(options.ArchivePath, body, 0o600); err != nil {
		t.Fatal(err)
	}
	options.ExpectedArchiveSHA256, options.ExpectedArchiveBytes = rawSHA256(body), int64(len(body))
	return options
}

func TestGeneratorOCIRealTarIdentityAndMetadataRoundtrip(t *testing.T) {
	for _, compressed := range []bool{false, true} {
		options, members, manifest, config, expanded := ociTestFixture(t, compressed, 2)
		options = ociTestWrite(t, options, ociTestTar(t, members))
		before, _ := os.Stat(options.ArchivePath)
		got, err := InspectGeneratorOCIArchive(context.Background(), options)
		if err != nil || got.State != "archive-consistent-unadmitted" || got.Authority != "NO_RESULT" || got.ImageAdmitted || len(got.Layers) != 2 || got.ExpandedBytes != expanded {
			t.Fatalf("compressed=%v report=%#v error=%v", compressed, got, err)
		}
		if !bytes.Equal(got.ManifestBytes, manifest) || !bytes.Equal(got.ConfigBytes, config) || got.Manifest.Digest != "sha256:"+rawSHA256(manifest) || got.Config.Digest != "sha256:"+rawSHA256(config) || got.Layers[0] != got.Layers[1] {
			t.Fatal("original metadata or repeated descriptor identity was lost")
		}
		body, err := MarshalGeneratorOCIReport(got)
		if err != nil || len(body) > generatorOCIReportBytes {
			t.Fatalf("marshal: %v", err)
		}
		var roundtrip GeneratorOCIReport
		if json.Unmarshal(body, &roundtrip) != nil || !reflect.DeepEqual(roundtrip, got) {
			t.Fatal("base64 metadata roundtrip changed bytes")
		}
		again, err := InspectGeneratorOCIArchive(context.Background(), options)
		if err != nil || !reflect.DeepEqual(again, got) {
			t.Fatal("fixed input changed the deterministic report")
		}
		after, _ := os.Stat(options.ArchivePath)
		if !unchangedGeneratorFile(before, after) {
			t.Fatal("inspection changed the archive")
		}
		entries, _ := os.ReadDir(filepath.Dir(options.ArchivePath))
		if len(entries) != 1 || entries[0].Name() != "candidate.tar" {
			t.Fatal("inspection wrote output files")
		}
	}
}

func TestGeneratorOCIRejectsIdentityAndInputLimits(t *testing.T) {
	options, members, _, _, _ := ociTestFixture(t, true, 2)
	options = ociTestWrite(t, options, ociTestTar(t, members))
	for _, change := range []func(*GeneratorOCIOptions){
		func(o *GeneratorOCIOptions) { o.ExpectedArchiveSHA256 = strings.Repeat("0", 64) },
		func(o *GeneratorOCIOptions) { o.ExpectedArchiveSHA256 = strings.Repeat("A", 64) },
		func(o *GeneratorOCIOptions) { o.ExpectedArchiveBytes-- },
		func(o *GeneratorOCIOptions) { o.ExpectedArchiveBytes = 2<<30 + 1 },
		func(o *GeneratorOCIOptions) { o.ArchivePath = filepath.Dir(o.ArchivePath) },
		func(o *GeneratorOCIOptions) { o.RepositoryRoot = t.TempDir() },
	} {
		changed := options
		change(&changed)
		report, err := InspectGeneratorOCIArchive(context.Background(), changed)
		assertOCIFailure(t, report, err)
	}
	for _, change := range []func(*GeneratorOCILimits){
		func(l *GeneratorOCILimits) { l.ArchiveBytes = options.ExpectedArchiveBytes - 1 },
		func(l *GeneratorOCILimits) { l.ExpandedBytes = 2048 },
		func(l *GeneratorOCILimits) { l.JSONBytes = 32 },
		func(l *GeneratorOCILimits) { l.Members = 4 },
		func(l *GeneratorOCILimits) { l.Layers = 1 },
	} {
		limits := generatorOCILimits()
		change(&limits)
		report, err := inspectGeneratorOCIArchive(context.Background(), options, limits, nil)
		assertOCIFailure(t, report, err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	report, err := InspectGeneratorOCIArchive(ctx, options)
	assertOCIFailure(t, report, err)
	if !errors.Is(err, context.Canceled) {
		t.Fatal("cancellation cause was lost")
	}
	report, err = InspectGeneratorOCIArchive(nil, options)
	assertOCIFailure(t, report, err)
}

func assertOCIFailure(t *testing.T, report GeneratorOCIReport, err error) {
	t.Helper()
	if err == nil || report.State != "incomplete" || report.Authority != "NO_RESULT" || report.Error == "" || report.Manifest != nil || report.Config != nil || len(report.Layers)+len(report.ManifestBytes)+len(report.ConfigBytes) != 0 || report.ArchiveSHA256 != "" {
		t.Fatalf("failure retained success fields: %#v error=%v", report, err)
	}
}

func TestGeneratorOCIRejectsChangedAndLinkedPaths(t *testing.T) {
	for _, mode := range []string{"cancel", "replace", "modify", "mode", "parent-link"} {
		t.Run(mode, func(t *testing.T) {
			options, members, _, _, _ := ociTestFixture(t, false, 1)
			original := ociTestTar(t, members)
			options = ociTestWrite(t, options, original)
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			report, err := inspectGeneratorOCIArchive(ctx, options, generatorOCILimits(), func() error {
				switch mode {
				case "cancel":
					cancel()
				case "replace":
					if err := os.Rename(options.ArchivePath, options.ArchivePath+".old"); err != nil {
						return err
					}
					return os.WriteFile(options.ArchivePath, original, 0o600)
				case "modify":
					changed := bytes.Clone(original)
					changed[len(changed)-1] = 1
					return os.WriteFile(options.ArchivePath, changed, 0o600)
				case "mode":
					return os.Chmod(options.ArchivePath, 0o400)
				case "parent-link":
					parent := filepath.Dir(options.ArchivePath)
					if err := os.Rename(parent, parent+"-moved"); err != nil {
						return err
					}
					t.Cleanup(func() { _ = os.Remove(parent); _ = os.Rename(parent+"-moved", parent) })
					return os.Symlink(parent+"-moved", parent)
				}
				return nil
			})
			assertOCIFailure(t, report, err)
		})
	}
	options, members, _, _, _ := ociTestFixture(t, false, 1)
	options = ociTestWrite(t, options, ociTestTar(t, members))
	linked := options
	linked.ArchivePath += ".link"
	if err := os.Symlink(options.ArchivePath, linked.ArchivePath); err != nil {
		t.Fatal(err)
	}
	report, err := InspectGeneratorOCIArchive(context.Background(), linked)
	assertOCIFailure(t, report, err)
	// Report serialization is separately bounded, even for caller-created data.
	report = newGeneratorOCIReport(generatorOCILimits())
	report.ConfigBytes = make([]byte, (64<<10)+1)
	if _, err := MarshalGeneratorOCIReport(report); err == nil {
		t.Fatal("oversized raw metadata was serialized")
	}
}

func TestGeneratorOCIRechecksAuthorityAndBoundsFailureReport(t *testing.T) {
	for _, mode := range []string{"authority", "long-error"} {
		options, members, _, _, _ := ociTestFixture(t, false, 1)
		options.RepositoryRoot = copyGeneratorFoundation(t)
		options.ArchivePath = filepath.Join(options.RepositoryRoot, "candidate.tar")
		options = ociTestWrite(t, options, ociTestTar(t, members))
		// Relative archives resolve against the declared repository, not process cwd.
		options.ArchivePath = "candidate.tar"
		if _, err := InspectGeneratorOCIArchive(context.Background(), options); err != nil {
			t.Fatal(err)
		}
		cause := errors.New(strings.Repeat("bounded diagnostic ä ", 1000))
		report, err := inspectGeneratorOCIArchive(context.Background(), options, generatorOCILimits(), func() error {
			if mode == "long-error" {
				return cause
			}
			filename := filepath.Join(options.RepositoryRoot, trackedGenerationPath)
			body, err := os.ReadFile(filename)
			if err != nil {
				return err
			}
			return os.WriteFile(filename, append(body, '\n'), 0o600)
		})
		assertOCIFailure(t, report, err)
		if mode == "long-error" && !errors.Is(err, cause) {
			t.Fatal("wrapped failure cause was lost")
		}
		if body, err := MarshalGeneratorOCIReport(report); err != nil || len(body) > generatorOCIReportBytes || len(report.Error) > 4096 {
			t.Fatalf("failure report exceeded its boundary: %v", err)
		}
	}
}

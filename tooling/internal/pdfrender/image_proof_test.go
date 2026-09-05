package pdfrender

import (
	"archive/tar"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"slices"
	"strings"
	"testing"
)

const testProofConfig = `{"architecture":"amd64","os":"linux","config":{"User":"65532"},"rootfs":{"type":"layers","diff_ids":[]}}`

var testProofConfigDigest = digestBytes([]byte(testProofConfig))
var testManifestDigest = digestBytes(testImageProofManifest())

func testImageProofManifest() []byte {
	return []byte(fmt.Sprintf(`{"schemaVersion":2,"mediaType":%q,"config":{"mediaType":%q,"digest":%q,"size":%d},"layers":[{"mediaType":"application/vnd.oci.image.layer.v1.tar+gzip","digest":%q,"size":5}]}`,
		imageManifestMediaType, imageConfigMediaType, testProofConfigDigest, len(testProofConfig), digestBytes([]byte("layer"))))
}

func testImageProofFiles(original bool) map[string][]byte {
	manifest := testImageProofManifest()
	files := map[string][]byte{
		imageProofBlobPath(testProofConfigDigest):        []byte(testProofConfig),
		imageProofBlobPath(digestBytes([]byte("layer"))): []byte("layer"),
		"oci-layout":    []byte(`{"imageLayoutVersion":"1.0.0"}`),
		"manifest.json": []byte(fmt.Sprintf(`[{"Config":%q,"RepoTags":null,"Layers":[%q]}]`, imageProofBlobPath(testProofConfigDigest), imageProofBlobPath(digestBytes([]byte("layer"))))),
		"index.json":    []byte(fmt.Sprintf(`{"schemaVersion":2,"mediaType":"application/vnd.oci.image.index.v1+json","manifests":[{"mediaType":%q,"digest":%q,"size":%d}]}`, imageManifestMediaType, testManifestDigest, len(manifest))),
	}
	if original {
		files[imageProofBlobPath(testManifestDigest)] = manifest
	}
	return files
}

func testImageProofTar(files map[string][]byte) []byte {
	var result bytes.Buffer
	writer := tar.NewWriter(&result)
	names := make([]string, 0, len(files))
	for name := range files {
		names = append(names, name)
	}
	slices.Sort(names)
	for _, name := range names {
		if err := writer.WriteHeader(&tar.Header{Name: name, Mode: 0o444, Size: int64(len(files[name])), Typeflag: tar.TypeReg, Format: tar.FormatUSTAR}); err != nil {
			panic(err)
		}
		if _, err := writer.Write(files[name]); err != nil {
			panic(err)
		}
	}
	if err := writer.Close(); err != nil {
		panic(err)
	}
	return result.Bytes()
}

func (executor *reproducibilityExecutor) inspectImageArchive(ctx context.Context, _ Configuration, imageID, manifestDigest string) (ImageConfigProof, error) {
	return inspectImageProof(ctx, bytes.NewReader(testImageProofTar(testImageProofFiles(!executor.classicArchive))), imageID, manifestDigest)
}

func TestClassicReproducibilityReceiptRetainsDirectConfigProof(t *testing.T) {
	t.Parallel()
	configuration := renderConfiguration(t)
	executor := &reproducibilityExecutor{
		imageIDs:        []string{testProofConfigDigest, testProofConfigDigest},
		manifestDigests: []string{testManifestDigest, testManifestDigest},
		classicArchive:  true,
	}
	receipt, err := verifyReproducibilityWithDependencies(context.Background(), configuration, "main", "", "build/evidence/classic.json", reproducibilityFixturePreparer{}, executor)
	if err != nil || receipt.Schema != 4 || !receipt.Comparison.AllMatch {
		t.Fatalf("classic receipt: %+v %v", receipt, err)
	}
	for _, build := range receipt.Builds {
		if build.ConfigProof.Method != "docker-save-execution-config-id-v1" || len(build.ConfigProof.Manifest) != 0 ||
			build.ImageID != digestBytes(build.ConfigProof.Config) || build.ConfigDigest != testProofConfigDigest ||
			build.ManifestDigest != testManifestDigest {
			t.Fatalf("classic receipt misstates its proof: %+v", build)
		}
	}
}

func TestImageConfigProofDistinguishesManifestAndConfigExecutionIDs(t *testing.T) {
	t.Parallel()
	for _, example := range []struct {
		name, id, method string
		original         bool
	}{
		{"containerd", testManifestDigest, "docker-save-original-manifest-config-v1", true},
		{"classic config with original bytes", testProofConfigDigest, "docker-save-original-manifest-config-v1", true},
		{"classic direct config bytes", testProofConfigDigest, "docker-save-execution-config-id-v1", false},
	} {
		t.Run(example.name, func(t *testing.T) {
			t.Parallel()
			proof, err := inspectImageProof(context.Background(), bytes.NewReader(testImageProofTar(testImageProofFiles(example.original))), example.id, testManifestDigest)
			if err != nil || proof.Method != example.method || !bytes.Equal(proof.Config, []byte(testProofConfig)) ||
				digestBytes(proof.Config) != testProofConfigDigest || testProofConfigDigest == testManifestDigest {
				t.Fatalf("config proof = %+v, error=%v", proof, err)
			}
			if example.original != (len(proof.Manifest) > 0) {
				t.Fatal("proof misrepresents original manifest availability")
			}
			body, err := json.Marshal(proof)
			var restored ImageConfigProof
			if err != nil || json.Unmarshal(body, &restored) != nil || !bytes.Equal(restored.Config, proof.Config) || !bytes.Equal(restored.Manifest, proof.Manifest) {
				t.Fatal("receipt JSON did not preserve exact original byte identities")
			}
		})
	}
}

func TestImageConfigProofRejectsMissingAndMisboundArtifacts(t *testing.T) {
	t.Parallel()
	for name, mutate := range map[string]func(map[string][]byte){
		"missing config":            func(files map[string][]byte) { delete(files, imageProofBlobPath(testProofConfigDigest)) },
		"wrong config bytes":        func(files map[string][]byte) { files[imageProofBlobPath(testProofConfigDigest)] = []byte("{}") },
		"missing original manifest": func(files map[string][]byte) { delete(files, imageProofBlobPath(testManifestDigest)) },
		"wrong index descriptor": func(files map[string][]byte) {
			files["index.json"] = []byte(strings.ReplaceAll(string(files["index.json"]), testManifestDigest, testProofConfigDigest))
		},
		"unknown index field": func(files map[string][]byte) {
			files["index.json"] = []byte(strings.Replace(string(files["index.json"]), "{", `{"unknown":1,`, 1))
		},
		"duplicate layout key": func(files map[string][]byte) {
			files["oci-layout"] = []byte(`{"imageLayoutVersion":"1.0.0","imageLayoutVersion":"1.0.0"}`)
		},
		"trailing layout JSON": func(files map[string][]byte) { files["oci-layout"] = append(files["oci-layout"], []byte("{}")...) },
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			files := testImageProofFiles(true)
			mutate(files)
			if _, err := inspectImageProof(context.Background(), bytes.NewReader(testImageProofTar(files)), testManifestDigest, testManifestDigest); err == nil {
				t.Fatal("accepted invalid proof")
			}
		})
	}
}

func TestDirectConfigProofRejectsWrongIdentityAndSelection(t *testing.T) {
	t.Parallel()
	for _, mutate := range []func(map[string][]byte){
		func(files map[string][]byte) { files["manifest.json"] = []byte("[]") },
		func(files map[string][]byte) {
			files["manifest.json"] = []byte(strings.ReplaceAll(string(files["manifest.json"]), testProofConfigDigest[7:], testManifestDigest[7:]))
		},
		func(files map[string][]byte) { delete(files, imageProofBlobPath(testProofConfigDigest)) },
		func(files map[string][]byte) {
			files["manifest.json"] = append(files["manifest.json"], []byte("{}")...)
		},
	} {
		files := testImageProofFiles(false)
		mutate(files)
		if _, err := inspectImageProof(context.Background(), bytes.NewReader(testImageProofTar(files)), testProofConfigDigest, testManifestDigest); err == nil {
			t.Fatal("accepted invalid direct-config proof")
		}
	}
	files := testImageProofFiles(false)
	if _, err := inspectImageProof(context.Background(), bytes.NewReader(testImageProofTar(files)), testSecondImageID, testManifestDigest); err == nil {
		t.Fatal("accepted unrelated execution ID")
	}
}

func TestImageConfigShapeAndDescriptorValidation(t *testing.T) {
	t.Parallel()
	for _, body := range []string{
		strings.Replace(testProofConfig, "amd64", "arm64", 1),
		strings.Replace(testProofConfig, `{"User":"65532"}`, "null", 1),
		strings.Replace(testProofConfig, `{"type":"layers","diff_ids":[]}`, "null", 1),
		strings.Replace(testProofConfig, "{", `{"unexpected":true,`, 1),
		strings.Replace(testProofConfig, "{", `{"os":"linux",`, 1),
	} {
		if err := validateImageProofConfig([]byte(body)); err == nil {
			t.Fatalf("accepted config %s", body)
		}
	}
	var manifest imageProofManifest
	if err := json.Unmarshal(testImageProofManifest(), &manifest); err != nil {
		t.Fatal(err)
	}
	manifest.Config.Size = maximumImageProofBlobBytes + 1
	if err := validateImageProofManifest(manifest); err == nil {
		t.Fatal("accepted oversized config descriptor")
	}
}

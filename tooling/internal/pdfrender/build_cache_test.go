package pdfrender

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

type cacheFixtureExecutor struct {
	*reproducibilityExecutor
}

func (executor *cacheFixtureExecutor) run(ctx context.Context, request commandRequest) ([]byte, error) {
	result, err := executor.reproducibilityExecutor.run(ctx, request)
	if err != nil {
		return result, err
	}
	if target := argumentAfterValue(request.arguments, "--cache-to"); target != "" {
		directory := strings.Split(strings.TrimPrefix(target, "type=local,dest="), ",")[0]
		return result, writeFixtureBuildCache(directory)
	}
	return result, nil
}

func newCacheFixtureExecutor() *cacheFixtureExecutor {
	return &cacheFixtureExecutor{&reproducibilityExecutor{
		imageIDs: []string{testManifestDigest, testManifestDigest}, manifestDigests: []string{testManifestDigest, testManifestDigest},
	}}
}

func verifyCacheFixture(configuration Configuration, executor *cacheFixtureExecutor, receipt string, pair bool) (ReproducibilityReceipt, error) {
	return verifyCachedProofWithDependencies(context.Background(), configuration, "main", "", "build/evidence/"+receipt+".json", reproducibilityFixturePreparer{}, executor, pair, RendererCacheDirectory)
}

func TestRendererCacheColdWarmAndIndependentBuildProof(t *testing.T) {
	t.Parallel()
	configuration := renderConfiguration(t)
	coldExecutor := newCacheFixtureExecutor()
	cold, err := verifyCacheFixture(configuration, coldExecutor, "cold", true)
	if err != nil {
		t.Fatal(err)
	}
	if cold.Schema != 6 || cold.BuildCache == nil || cold.BuildCache.Imported || cold.BuildCache.BlobCount != 3 || cold.BuildCache.BlobBytes <= 0 || !cold.Renderer.NoCache || cold.Renderer.FreshBuilderCount != 1 {
		t.Fatalf("invalid cold observation: %+v", cold)
	}
	coldBuilds := requestsWithPrefix(coldExecutor.requests, "buildx", "build")
	if len(coldBuilds) != 1 || !slices.Contains(coldBuilds[0].arguments, "--no-cache") || argumentAfterValue(coldBuilds[0].arguments, "--cache-to") == "" || argumentAfterValue(coldBuilds[0].arguments, "--cache-from") != "" || coldExecutor.renderCount != 2 {
		t.Fatalf("cold proof did not build once and render twice: %+v", coldBuilds)
	}
	identityPath := filepath.Join(configuration.RepositoryRoot, RendererCacheDirectory, "identity.json")
	before, err := os.ReadFile(identityPath)
	if err != nil {
		t.Fatal(err)
	}
	for _, pair := range []bool{true, false} {
		executor := newCacheFixtureExecutor()
		name := "warm"
		if !pair {
			name = "independent"
		}
		receipt, err := verifyCacheFixture(configuration, executor, name, pair)
		if err != nil {
			t.Fatal(err)
		}
		if receipt.BuildCache.Imported != pair || receipt.Renderer.NoCache == pair || receipt.Status != "pass" || receipt.ScientificResult || executor.renderCount != 2 || receipt.BuildCache.ManifestDigest != cold.BuildCache.ManifestDigest {
			t.Fatalf("misleading %s observation: %+v", name, receipt)
		}
		builds := requestsWithPrefix(executor.requests, "buildx", "build")
		wantBuilds := 2
		if pair {
			wantBuilds = 1
		}
		if len(builds) != wantBuilds || receipt.Renderer.FreshBuilderCount != wantBuilds || len(receipt.Builds) != wantBuilds {
			t.Fatalf("%s build counts differ", name)
		}
		for _, build := range builds {
			if slices.Contains(build.arguments, "--no-cache") == pair || (argumentAfterValue(build.arguments, "--cache-from") != "") != pair || argumentAfterValue(build.arguments, "--cache-to") != "" {
				t.Fatalf("%s violated cache arguments: %v", name, build.arguments)
			}
			if pair && !strings.HasSuffix(argumentAfterValue(build.arguments, "--cache-from"), ",digest="+cold.BuildCache.ManifestDigest) {
				t.Fatal("cache import did not pin the inspected manifest")
			}
		}
	}
	after, err := os.ReadFile(identityPath)
	if err != nil || !bytes.Equal(before, after) {
		t.Fatal("existing cache was overwritten")
	}
}

func TestRendererCacheFailureNeverPromotesSeed(t *testing.T) {
	t.Parallel()
	for _, failCleanup := range []bool{false, true} {
		configuration := renderConfiguration(t)
		executor := newCacheFixtureExecutor()
		executor.failImageCleanup = failCleanup
		executor.differentSecondManifest = !failCleanup
		receipt, err := verifyCacheFixture(configuration, executor, "failed", true)
		if err == nil {
			t.Fatal("injected failure passed")
		}
		if _, err := os.Lstat(filepath.Join(configuration.RepositoryRoot, RendererCacheDirectory)); !errors.Is(err, os.ErrNotExist) {
			t.Fatalf("failed proof promoted cache: %v", err)
		}
		staging, err := filepath.Glob(filepath.Join(configuration.RepositoryRoot, "build/cache/.pdf-renderer-cache-*"))
		if err != nil || len(staging) != 0 {
			t.Fatalf("failed proof leaked owned staging: %v %v", staging, err)
		}
		if !failCleanup && (receipt.Schema != 6 || receipt.Status != "mismatch" || receipt.MismatchEvidence == nil || len(receipt.MismatchEvidence.Builds) != 2 || !receipt.Renderer.NoCache) {
			t.Fatalf("mismatch evidence lost: %+v", receipt)
		}
	}
}

func TestRendererWarmCacheMismatchRetainsTruthfulReceipt(t *testing.T) {
	t.Parallel()
	configuration := renderConfiguration(t)
	if _, err := verifyCacheFixture(configuration, newCacheFixtureExecutor(), "seed", true); err != nil {
		t.Fatal(err)
	}
	executor := newCacheFixtureExecutor()
	executor.differentSecondManifest, executor.failImageCleanup = true, true
	receipt, err := verifyCacheFixture(configuration, executor, "mismatch", true)
	if err == nil || !strings.Contains(err.Error(), "comparison failed") || !strings.Contains(err.Error(), "cleanup failure") || receipt.Schema != 6 || receipt.BuildCache == nil || !receipt.BuildCache.Imported || receipt.Renderer.NoCache || receipt.MismatchEvidence == nil {
		t.Fatalf("misleading mismatch receipt: %+v error=%v", receipt, err)
	}
	for _, pair := range receipt.MismatchEvidence.Builds {
		for _, relative := range []string{pair.PDF, pair.Manifest} {
			if _, err := os.Stat(filepath.Join(configuration.RepositoryRoot, relative)); err != nil {
				t.Fatal(err)
			}
		}
	}
}

func TestRendererCacheRejectsWrongSeedImageBeforeRendering(t *testing.T) {
	t.Parallel()
	configuration := renderConfiguration(t)
	if _, err := verifyCacheFixture(configuration, newCacheFixtureExecutor(), "seed", true); err != nil {
		t.Fatal(err)
	}
	identityPath := filepath.Join(configuration.RepositoryRoot, RendererCacheDirectory, "identity.json")
	body, err := os.ReadFile(identityPath)
	if err != nil {
		t.Fatal(err)
	}
	var identity rendererCacheIdentity
	if err := json.Unmarshal(body, &identity); err != nil {
		t.Fatal(err)
	}
	identity.ConfigDigest = testSecondImageID
	body, err = json.Marshal(identity)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(identityPath, body, 0o600); err != nil {
		t.Fatal(err)
	}
	executor := newCacheFixtureExecutor()
	_, err = verifyCacheFixture(configuration, executor, "wrong-image", true)
	if err == nil || !strings.Contains(err.Error(), "cache seed") || executor.renderCount != 0 || len(requestsWithPrefix(executor.requests, "image", "rm", "--force")) != 1 {
		t.Fatalf("wrong seed rendered or leaked its image: %v", err)
	}
}

func TestRendererCacheReusesImageAcrossDockerStores(t *testing.T) {
	t.Parallel()
	for _, classicSeed := range []bool{true, false} {
		configuration := renderConfiguration(t)
		seedExecutor := newCacheFixtureExecutor()
		seedExecutor.classicArchive = classicSeed
		if classicSeed {
			seedExecutor.imageIDs = []string{testProofConfigDigest}
		}
		seed, err := verifyCacheFixture(configuration, seedExecutor, "seed", true)
		if err != nil {
			t.Fatal(err)
		}
		warmExecutor := newCacheFixtureExecutor()
		warmExecutor.classicArchive = !classicSeed
		if !classicSeed {
			warmExecutor.imageIDs = []string{testProofConfigDigest}
		}
		warm, err := verifyCacheFixture(configuration, warmExecutor, "warm", true)
		if err != nil {
			t.Fatal(err)
		}
		if seed.Builds[0].ImageID == warm.Builds[0].ImageID || seed.Builds[0].ManifestDigest != warm.Builds[0].ManifestDigest || seed.Builds[0].ConfigDigest != warm.Builds[0].ConfigDigest || !warm.BuildCache.Imported || warmExecutor.renderCount != 2 {
			t.Fatalf("cache did not retain image identity across stores: seed=%+v warm=%+v", seed.Builds, warm.Builds)
		}
	}
}

func writeFixtureBuildCache(root string) error {
	if err := os.MkdirAll(filepath.Join(root, "blobs/sha256"), 0o755); err != nil {
		return err
	}
	config := []byte(`{"layers":[],"records":[]}`)
	layer := []byte("fixture-layer-bytes")
	manifest := imageProofManifest{
		SchemaVersion: 2, MediaType: imageManifestMediaType,
		Config: imageProofDescriptor{MediaType: "application/vnd.buildkit.cacheconfig.v0", Digest: digestBytes(config), Size: int64(len(config))},
		Layers: []imageProofDescriptor{{MediaType: "application/vnd.oci.image.layer.v1.tar+gzip", Digest: digestBytes(layer), Size: int64(len(layer))}},
	}
	manifestBytes, err := json.Marshal(manifest)
	if err != nil {
		return err
	}
	index, err := json.Marshal(map[string]any{"schemaVersion": 2, "mediaType": "application/vnd.oci.image.index.v1+json", "manifests": []imageProofDescriptor{{MediaType: imageManifestMediaType, Digest: digestBytes(manifestBytes), Size: int64(len(manifestBytes))}}})
	if err != nil {
		return err
	}
	files := map[string][]byte{"index.json": index, "oci-layout": []byte(`{"imageLayoutVersion":"1.0.0"}`)}
	for _, body := range [][]byte{config, layer, manifestBytes} {
		files[imageProofBlobPath(digestBytes(body))] = body
	}
	for relative, body := range files {
		if err := os.WriteFile(filepath.Join(root, relative), body, 0o600); err != nil {
			return err
		}
	}
	return nil
}

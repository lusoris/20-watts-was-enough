package pdfrender

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
)

// RendererCacheDirectory is an opt-in, disposable CI cache, never a release input.
const RendererCacheDirectory = "build/cache/pdf-renderer"

// ReproducibilityCache describes cache input integrity, not its provenance or
// a cache hit inside BuildKit. Fresh builders and actual renders remain counted.
type ReproducibilityCache struct {
	Imported       bool   `json:"imported"`
	ManifestDigest string `json:"manifest_digest,omitempty"`
	BlobCount      int    `json:"blob_count,omitempty"`
	BlobBytes      int64  `json:"blob_bytes,omitempty"`
}

type rendererCacheIdentity struct {
	Schema         int                  `json:"schema"`
	LockSHA256     string               `json:"lock_sha256"`
	ContextSHA256  string               `json:"context_sha256"`
	ImageID        string               `json:"image_id"`
	ManifestDigest string               `json:"image_manifest_digest"`
	ConfigDigest   string               `json:"image_config_digest"`
	Cache          ReproducibilityCache `json:"cache"`
}

type rendererBuildCache struct {
	destination string
	staging     string
	importRoot  string
	exportRoot  string
	identity    rendererCacheIdentity
}

func prepareRendererBuildCache(ctx context.Context, configuration Configuration, identity ReproducibilityContext, relative string, renderPairOnly bool) (*rendererBuildCache, error) {
	if relative == "" {
		return nil, nil
	}
	if relative != RendererCacheDirectory {
		return nil, errors.New("PDF renderer cache must be build/cache/pdf-renderer")
	}
	if err := requireContainedDirectory(configuration.RepositoryRoot, "build/cache", true); err != nil {
		return nil, err
	}
	cache := &rendererBuildCache{
		destination: filepath.Join(configuration.RepositoryRoot, relative),
		identity:    rendererCacheIdentity{Schema: 1, LockSHA256: "sha256:" + configuration.LockSHA256, ContextSHA256: identity.SHA256},
	}
	if _, err := os.Lstat(cache.destination); err == nil {
		if err := cache.restore(ctx, configuration.RepositoryRoot, renderPairOnly); err != nil {
			return nil, err
		}
		return cache, nil
	} else if !errors.Is(err, os.ErrNotExist) {
		return nil, fmt.Errorf("inspect PDF renderer cache destination: %w", err)
	}
	staging, err := os.MkdirTemp(filepath.Dir(cache.destination), ".pdf-renderer-cache-")
	if err != nil {
		return nil, fmt.Errorf("create PDF renderer cache staging directory: %w", err)
	}
	cache.staging = staging
	cache.exportRoot = filepath.Join(staging, "oci")
	return cache, nil
}

func (cache *rendererBuildCache) restore(ctx context.Context, repositoryRoot string, renderPairOnly bool) error {
	if err := requireContainedDirectory(repositoryRoot, RendererCacheDirectory, false); err != nil {
		return err
	}
	if err := exactCacheDirectory(cache.destination, map[string]bool{"identity.json": false, "oci": true}); err != nil {
		return err
	}
	body, err := readRegularBounded(repositoryRoot, filepath.Join(cache.destination, "identity.json"), 16*1024, "PDF renderer cache identity")
	if err != nil {
		return err
	}
	var stored rendererCacheIdentity
	if err := decodeImageProofJSON(body, &stored, "cache identity"); err != nil {
		return err
	}
	if stored.Schema != 1 || stored.LockSHA256 != cache.identity.LockSHA256 || stored.ContextSHA256 != cache.identity.ContextSHA256 ||
		!imageIDPattern.MatchString(stored.ImageID) || !imageIDPattern.MatchString(stored.ManifestDigest) || !imageIDPattern.MatchString(stored.ConfigDigest) ||
		(stored.ImageID != stored.ManifestDigest && stored.ImageID != stored.ConfigDigest) || stored.Cache.Imported {
		return errors.New("PDF renderer cache identity does not match the locked build context")
	}
	ociRoot := filepath.Join(cache.destination, "oci")
	observed, err := inspectRendererCache(ctx, ociRoot)
	if err != nil {
		return err
	}
	if observed != stored.Cache {
		return errors.New("PDF renderer cache inventory does not match its retained identity")
	}
	cache.identity = stored
	if renderPairOnly {
		cache.importRoot = ociRoot
	}
	return nil
}

func (cache *rendererBuildCache) buildArguments(arguments []string, index int) []string {
	if cache == nil || index != 0 {
		return arguments
	}
	result := make([]string, 0, len(arguments)+2)
	for _, argument := range arguments[:len(arguments)-1] {
		if argument != "--no-cache" || cache.importRoot == "" {
			result = append(result, argument)
		}
	}
	if cache.importRoot != "" {
		result = append(result, "--cache-from", "type=local,src="+cache.importRoot+",digest="+cache.identity.Cache.ManifestDigest)
	}
	if cache.exportRoot != "" {
		result = append(result, "--cache-to", "type=local,dest="+cache.exportRoot+",mode=min,oci-mediatypes=true,image-manifest=true")
	}
	return append(result, arguments[len(arguments)-1])
}

func (cache *rendererBuildCache) verifyImage(build ReproducibilityBuild) error {
	if cache == nil || cache.identity.ImageID == "" {
		return nil
	}
	// Docker stores may use the original manifest or its config as execution ID.
	// inspectLoadedImageProof verifies that link for this build; compare the
	// storage-independent image identities rather than the seed's store choice.
	if build.ManifestDigest != cache.identity.ManifestDigest || build.ConfigDigest != cache.identity.ConfigDigest {
		return errors.New("PDF renderer image does not match the cache seed's image and config identities")
	}
	return nil
}

func (cache *rendererBuildCache) observe(ctx context.Context, receipt *ReproducibilityReceipt) error {
	if cache == nil {
		return nil
	}
	observation := cache.identity.Cache
	if cache.exportRoot != "" {
		var err error
		observation, err = inspectRendererCache(ctx, cache.exportRoot)
		if err != nil {
			return err
		}
		build := receipt.Builds[0]
		cache.identity.ImageID, cache.identity.ManifestDigest, cache.identity.ConfigDigest = build.ImageID, build.ManifestDigest, build.ConfigDigest
		cache.identity.Cache = observation
	}
	if cache.importRoot != "" {
		current, err := inspectRendererCache(ctx, cache.importRoot)
		if err != nil {
			return err
		}
		if current != observation {
			return errors.New("PDF renderer input cache changed during the proof")
		}
	}
	cache.describe(receipt)
	return nil
}

func (cache *rendererBuildCache) describe(receipt *ReproducibilityReceipt) {
	if cache == nil {
		return
	}
	observation := cache.identity.Cache
	observation.Imported = cache.importRoot != ""
	receipt.Schema = 6
	receipt.BuildCache = &observation
	receipt.Renderer.NoCache = !observation.Imported
}

func (cache *rendererBuildCache) promote(ctx context.Context) error {
	if err := ctx.Err(); err != nil {
		return fmt.Errorf("promote PDF renderer cache: %w", err)
	}
	if cache == nil || cache.staging == "" {
		return nil
	}
	if err := writeRendererCacheIdentity(filepath.Join(cache.staging, "identity.json"), cache.identity); err != nil {
		return err
	}
	// Never replace restored or concurrently created cache bytes. The caller
	// holds the publication lock; the staging root is on the same filesystem.
	if _, err := os.Lstat(cache.destination); !errors.Is(err, os.ErrNotExist) {
		return errors.New("PDF renderer cache destination appeared before promotion")
	}
	if err := ctx.Err(); err != nil {
		return fmt.Errorf("promote PDF renderer cache: %w", err)
	}
	if err := os.Rename(cache.staging, cache.destination); err != nil {
		return fmt.Errorf("promote PDF renderer cache: %w", err)
	}
	cache.staging = ""
	return nil
}

func (cache *rendererBuildCache) close() error {
	if cache == nil || cache.staging == "" {
		return nil
	}
	if err := os.RemoveAll(cache.staging); err != nil {
		return fmt.Errorf("remove owned PDF renderer cache staging directory: %w", err)
	}
	return nil
}

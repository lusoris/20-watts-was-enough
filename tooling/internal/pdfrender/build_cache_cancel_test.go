package pdfrender

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"testing"
)

func TestRendererCachePromotionRejectsCancelledContextBeforeWriting(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	staging, err := os.MkdirTemp(root, ".pdf-renderer-cache-")
	if err != nil {
		t.Fatal(err)
	}
	cache := &rendererBuildCache{staging: staging, destination: filepath.Join(root, "pdf-renderer")}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if err := cache.promote(ctx); !errors.Is(err, context.Canceled) {
		t.Fatalf("cancelled promotion returned %v", err)
	}
	for _, path := range []string{cache.destination, filepath.Join(staging, "identity.json")} {
		if _, err := os.Lstat(path); !errors.Is(err, os.ErrNotExist) {
			t.Fatalf("cancelled promotion wrote %s: %v", path, err)
		}
	}
	if cache.staging != staging {
		t.Fatal("cancelled promotion lost ownership of staging")
	}
	if err := cache.close(); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Lstat(staging); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("cancelled promotion staging survived cleanup: %v", err)
	}
}

func TestRendererCacheCancellationDuringCleanupDoesNotPromoteSeed(t *testing.T) {
	t.Parallel()
	for _, pair := range []bool{false, true} {
		name := "image-build"
		if pair {
			name = "render-pair"
		}
		t.Run(name, func(t *testing.T) {
			configuration := renderConfiguration(t)
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			executor := &cancellingCacheCleanupExecutor{cacheFixtureExecutor: newCacheFixtureExecutor(), cancel: cancel}
			receiptPath := "build/evidence/cancelled.json"
			receipt, err := verifyCachedProofWithDependencies(ctx, configuration, "main", "", receiptPath, reproducibilityFixturePreparer{}, executor, pair, RendererCacheDirectory)
			if !errors.Is(err, context.Canceled) || receipt.Schema != 6 || receipt.Status != "pass" || receipt.BuildCache == nil || receipt.BuildCache.Imported {
				t.Fatalf("cancelled proof lost its comparison or passed: receipt=%+v error=%v", receipt, err)
			}
			wantBuilds := 2
			if pair {
				wantBuilds = 1
			}
			if executor.cleanupCount != wantBuilds || executor.cancelledCleanupContext || len(executor.loadedTags) != 0 || executor.renderCount != 2 {
				t.Fatalf("cleanup did not finish independently: count=%d cancelled=%t tags=%v renders=%d", executor.cleanupCount, executor.cancelledCleanupContext, executor.loadedTags, executor.renderCount)
			}
			body, err := os.ReadFile(filepath.Join(configuration.RepositoryRoot, receiptPath))
			if err != nil {
				t.Fatal(err)
			}
			var retained ReproducibilityReceipt
			if err := json.Unmarshal(body, &retained); err != nil || retained.Status != "pass" || retained.Schema != 6 || retained.BuildCache == nil || retained.BuildCache.ManifestDigest != receipt.BuildCache.ManifestDigest {
				t.Fatalf("completed comparison receipt was not preserved: %+v error=%v", retained, err)
			}
			if _, err := os.Lstat(filepath.Join(configuration.RepositoryRoot, RendererCacheDirectory)); !errors.Is(err, os.ErrNotExist) {
				t.Fatalf("cancelled proof promoted cache: %v", err)
			}
			staging, err := filepath.Glob(filepath.Join(configuration.RepositoryRoot, "build/cache/.pdf-renderer-cache-*"))
			if err != nil || len(staging) != 0 {
				t.Fatalf("cancelled proof leaked owned staging: %v %v", staging, err)
			}
		})
	}
}

type cancellingCacheCleanupExecutor struct {
	*cacheFixtureExecutor
	cancel                  context.CancelFunc
	cleanupCount            int
	cancelledCleanupContext bool
}

func (executor *cancellingCacheCleanupExecutor) run(ctx context.Context, request commandRequest) ([]byte, error) {
	if request.operation == "remove owned PDF reproducibility image" {
		executor.cancel()
		executor.cleanupCount++
		executor.cancelledCleanupContext = executor.cancelledCleanupContext || ctx.Err() != nil
	}
	return executor.cacheFixtureExecutor.run(ctx, request)
}

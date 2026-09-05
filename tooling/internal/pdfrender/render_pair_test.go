package pdfrender

import (
	"bytes"
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRenderPairUsesOneProvenImageAndTwoIsolatedRenders(t *testing.T) {
	t.Parallel()
	configuration := renderConfiguration(t)
	executor := &reproducibilityExecutor{imageIDs: []string{testManifestDigest}, manifestDigests: []string{testManifestDigest}}
	receipt, err := verifyProofWithDependencies(context.Background(), configuration, "main", "", "build/evidence/pair.json", reproducibilityFixturePreparer{}, executor, true)
	if err != nil {
		t.Fatal(err)
	}
	if receipt.Schema != 5 || receipt.Scope != "pdf-render-pair-reproducibility" || receipt.Status != "pass" || receipt.ScientificResult ||
		receipt.Renderer.FreshBuilderCount != 1 || !receipt.Renderer.NoCache || len(receipt.Builds) != 1 || len(receipt.Renders) != 2 || !receipt.Comparison.AllMatch {
		t.Fatalf("misleading or incomplete receipt: %+v", receipt)
	}
	if receipt.Builds[0].ConfigProof.Method != "docker-save-original-manifest-config-v1" || !bytes.Equal(receipt.Builds[0].ConfigProof.Config, []byte(testProofConfig)) {
		t.Fatal("missing original execution config proof")
	}
	for _, prefix := range [][]string{{"buildx", "create"}, {"buildx", "build"}, {"buildx", "rm"}, {"image", "rm", "--force"}} {
		if count := len(requestsWithPrefix(executor.requests, prefix...)); count != 1 {
			t.Fatalf("%v count=%d", prefix, count)
		}
	}
	runs := requestsWithPrefix(executor.requests, "run")
	if len(runs) != 2 {
		t.Fatalf("renders=%d", len(runs))
	}
	for _, target := range []string{"/workspace/public/downloads", "/workspace/tmp"} {
		first, second := mountSource(runs[0].arguments, target), mountSource(runs[1].arguments, target)
		if first == "" || first == second {
			t.Fatalf("render isolation lost at %s: %q / %q", target, first, second)
		}
	}
	if _, err := os.Stat(filepath.Join(configuration.RepositoryRoot, "public", "downloads", bookPDFName)); !os.IsNotExist(err) {
		t.Fatalf("non-publishing proof changed the publication: %v", err)
	}
	_, err = verifyProofWithDependencies(context.Background(), configuration, "main", "", "build/evidence/pair.json", reproducibilityFixturePreparer{}, executor, true)
	if err == nil || executor.buildCount != 1 {
		t.Fatalf("receipt overwrite not rejected before image work: %v", err)
	}
}

func TestRenderPairMismatchRetainsBothPairsEvenWhenCleanupFails(t *testing.T) {
	t.Parallel()
	for _, failCleanup := range []bool{false, true} {
		configuration := renderConfiguration(t)
		executor := &reproducibilityExecutor{imageIDs: []string{testManifestDigest}, manifestDigests: []string{testManifestDigest}, differentSecondManifest: true, failImageCleanup: failCleanup}
		receipt, err := verifyProofWithDependencies(context.Background(), configuration, "main", "", "build/evidence/pair.json", reproducibilityFixturePreparer{}, executor, true)
		if err == nil || !strings.Contains(err.Error(), "comparison failed") || receipt.Status != "mismatch" || receipt.MismatchEvidence == nil || len(receipt.MismatchEvidence.Builds) != 2 {
			t.Fatalf("receipt=%+v error=%v", receipt, err)
		}
		if failCleanup && !strings.Contains(err.Error(), "cleanup failure") {
			t.Fatalf("cleanup error lost: %v", err)
		}
		for _, pair := range receipt.MismatchEvidence.Builds {
			for _, file := range []string{pair.PDF, pair.Manifest} {
				if _, err := os.Stat(filepath.Join(configuration.RepositoryRoot, filepath.FromSlash(file))); err != nil {
					t.Fatal(err)
				}
			}
		}
	}
}

func TestRenderPairCannotReplaceReleaseProof(t *testing.T) {
	t.Parallel()
	_, err := VerifyReproducibility(context.Background(), ReproducibilityOptions{SourceRef: "v1.2.3", SourceRevision: strings.Repeat("a", 40), RenderPairOnly: true})
	if err == nil || !strings.Contains(err.Error(), "releases require independent image builds") {
		t.Fatalf("error=%v", err)
	}
}

package ciplan

import (
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
)

func TestRepositoryImpactMappingIsClosedAndRoutesRepresentativeChanges(t *testing.T) {
	t.Parallel()
	root := filepath.Clean(filepath.Join("..", "..", ".."))
	mapping, err := loadMapping(root)
	if err != nil {
		t.Fatalf("loadMapping(repository) error = %v", err)
	}
	if len(mapping.Rules) < 20 {
		t.Fatalf("mapping has %d rules, want the declared repository surfaces", len(mapping.Rules))
	}
	options := testOptions(root)
	tests := []struct {
		path   string
		mode   string
		lanes  []string
		reason string
	}{
		{path: "app/App.tsx", mode: "impact", lanes: []string{"site"}},
		{path: "app/globals.css", mode: "impact", lanes: []string{"renderer", "site"}},
		{path: ".github/ISSUE_TEMPLATE/site-documentation-problem.yml", mode: "impact", lanes: []string{"common"}},
		{path: ".github/issue-milestones.json", mode: "impact", lanes: []string{"go"}},
		{path: ".github/labels.json", mode: "impact", lanes: []string{"go"}},
		{path: ".github/public-transport.json", mode: "impact", lanes: []string{"go", "site"}},
		{path: "renovate.json", mode: "impact", lanes: []string{"dependency"}},
		{path: "package-lock.json", mode: "full", lanes: []string{"full", "renderer"}, reason: "full-authority-changed"},
		{path: "scripts/book-pdf-semantic-baseline.json", mode: "impact", lanes: []string{"release"}},
		{path: "scripts/lib/book-pdf-semantic-audit.mjs", mode: "impact", lanes: []string{"release"}},
		{path: "scripts/lib/chromium-cdp.test.mjs", mode: "impact", lanes: []string{"release"}},
		{path: "scripts/lib/pdf-metadata.test.mjs", mode: "impact", lanes: []string{"release"}},
		{path: "scripts/lib/pdf-metadata.mjs", mode: "full", lanes: []string{"full", "renderer"}, reason: "full-authority-changed"},
		{path: "scripts/audit-book-pdf-semantics.mjs", mode: "full", lanes: []string{"full", "renderer"}, reason: "unmapped-path:scripts/audit-book-pdf-semantics.mjs"},
		{path: "scripts/generate-book-pdf.mjs", mode: "full", lanes: []string{"full", "renderer"}, reason: "full-authority-changed"},
		{path: "scripts/audit-prose-style.mjs", mode: "full", lanes: []string{"full"}, reason: "full-authority-changed"},
		{path: "scripts/book-edition-surface.test.mjs", mode: "impact", lanes: []string{"site"}},
		{path: "scripts/mermaid-browser.test.mjs", mode: "impact", lanes: []string{"site"}},
		{path: "scripts/research-object-header-browser.test.mjs", mode: "impact", lanes: []string{"site"}},
		{path: "scripts/unclassified-future-check.mjs", mode: "full", lanes: []string{"full", "renderer"}, reason: "unmapped-path:scripts/unclassified-future-check.mjs"},
		{path: "experiments/workstation/fixture-026/runner.mjs", mode: "impact", lanes: []string{"workstation-fixture-026"}},
		{path: "experiments/workstation/fixture-007/runner.mjs", mode: "impact", lanes: []string{"container", "workstation-fixture-007"}},
		{path: "tooling/internal/buildinfo/buildinfo.go", mode: "impact", lanes: []string{"container", "go", "release"}},
		{path: "tooling/internal/pdfrender/render.go", mode: "impact", lanes: []string{"container", "go", "release", "renderer", "site"}},
		{path: "tooling/internal/pdfrenderlock/lock.go", mode: "impact", lanes: []string{"container", "go", "release", "renderer", "site"}},
		{path: "tooling/internal/workstationrunner/runner.go", mode: "full", lanes: []string{"full"}, reason: "full-authority-changed"},
		{path: "tooling/pdf-tools/apko.yaml", mode: "impact", lanes: []string{"go", "release"}},
		{path: "tooling/clrs-specialist/Dockerfile", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/cmd/clrs-specialist/main.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrsrunner/run.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrsfixture/import.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrsfixture/compare.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrsfixture/compare_test.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/cmd/20w/clrs_compare.go", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: "tooling/cmd/20w/clrs_compare_test.go", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: "tooling/internal/clrsfixture/sbom.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrsfixture/sbom_test.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/cmd/20w/clrs_sbom.go", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: "tooling/cmd/20w/clrs_sbom_test.go", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: "tooling/internal/clrsfixture/invocation.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrsfixture/invocation_test.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/cmd/20w/clrs_invocation.go", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: "tooling/cmd/20w/clrs_invocation_test.go", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: "tooling/internal/clrscontext/context.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrscontext/source_test.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrscontext-unrelated/example.go", mode: "full", lanes: []string{"full", "renderer"}, reason: "unmapped-path:tooling/internal/clrscontext-unrelated/example.go"},
		{path: "tooling/cmd/20w/clrs_context.go", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: "tooling/cmd/20w/clrs_context_test.go", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: "tooling/internal/ciplan/mapping_test.go", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: "scripts/book-source.mjs", mode: "full", lanes: []string{"full", "renderer"}, reason: "full-authority-changed"},
		{path: ".github/ci-impact.json", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: "tooling/internal/clrsinsertion/adapter.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrsbinary/adapter.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrsmatrixchain/adapter.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrsbellmanford/adapter.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrsbfs/bfs.go", mode: "impact", lanes: []string{"go"}},
		{path: "tooling/internal/clrskmp/adapter.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "tooling/internal/clrssegments/adapter.go", mode: "impact", lanes: []string{"container", "go"}},
		{path: "experiments/workstation/lib/execution-receipt.mjs", mode: "full", lanes: []string{"full"}, reason: "full-authority-changed"},
		{path: ".github/workflows/ci.yml", mode: "full", lanes: []string{"full", "renderer"}, reason: "selector-authority-changed"},
		{path: ".github/unowned-metadata.yml", mode: "full", lanes: []string{"full", "renderer"}, reason: "unmapped-path:.github/unowned-metadata.yml"},
	}
	for _, test := range tests {
		plan := selectTestPaths(t, root, options, []string{test.path})
		if plan.Mode != test.mode || !reflect.DeepEqual(plan.Lanes, test.lanes) ||
			(test.reason != "" && plan.Reason != test.reason) {
			t.Fatalf("path %s produced %#v, want %s/%v", test.path, plan, test.mode, test.lanes)
		}
	}
}

func TestPdfSemanticSentinelDiffSelectsOnlyItsPublicationConsumers(t *testing.T) {
	t.Parallel()
	root := filepath.Clean(filepath.Join("..", "..", ".."))
	plan := selectTestPaths(t, root, testOptions(root), []string{
		"CHANGELOG.md",
		"scripts/book-pdf-semantic-baseline.json",
		"scripts/lib/pdf-metadata.test.mjs",
	})
	want := []string{"release", "research", "site"}
	if plan.Mode != "impact" || plan.Reason != "mapped-change-set" ||
		!reflect.DeepEqual(plan.Lanes, want) {
		t.Fatalf("PDF semantic sentinel plan = %#v, want impact/%v", plan, want)
	}
}

func TestReaderLikeDiffSelectsOnlyItsPublicationConsumers(t *testing.T) {
	t.Parallel()
	root := filepath.Clean(filepath.Join("..", "..", ".."))
	plan := selectTestPaths(t, root, testOptions(root), []string{
		"CHANGELOG.md",
		"app/globals.css",
		"scripts/book-edition-surface.test.mjs",
		"scripts/mermaid-browser.test.mjs",
	})
	want := []string{"release", "renderer", "research", "site"}
	if plan.Mode != "impact" || plan.Reason != "mapped-change-set" ||
		!reflect.DeepEqual(plan.Lanes, want) {
		t.Fatalf("reader-like plan = %#v, want impact/%v", plan, want)
	}
}

func TestEverySiteLaneEntrypointIsMappedToTheSiteLane(t *testing.T) {
	t.Parallel()
	root := filepath.Clean(filepath.Join("..", "..", ".."))
	mapping, err := loadMapping(root)
	if err != nil {
		t.Fatalf("loadMapping(repository) error = %v", err)
	}
	paths := []string{
		"scripts/book-edition-surface.test.mjs",
		"scripts/book-fragment-browser.test.mjs",
		"scripts/book-route.test.mjs",
		"scripts/css-authority.test.mjs",
		"scripts/github-pages.test.mjs",
		"scripts/language-access.test.mjs",
		"scripts/mermaid-browser.test.mjs",
		"scripts/pages-base.test.mjs",
		"scripts/pages-seo.test.mjs",
		"scripts/prepare-reader-artifacts.mjs",
		"scripts/prepare-reader-artifacts.test.mjs",
		"scripts/publication-unification.test.mjs",
		"scripts/research-object-header-browser.test.mjs",
		"scripts/research-object-header.test.mjs",
		"scripts/translation-manifest.test.mjs",
		"scripts/translation-pages.test.mjs",
		"scripts/translation-vite-build.test.mjs",
		"scripts/validate-css-authority.mjs",
		"scripts/validate-github-pages-build.mjs",
		"scripts/validate-translations.mjs",
	}
	for _, path := range paths {
		plan := selectChangedPaths(mapping, testOptions(root), []string{path})
		if plan.Mode != "impact" || plan.Reason != "mapped-change-set" ||
			!reflect.DeepEqual(plan.Lanes, []string{"site"}) {
			t.Fatalf("site entrypoint %s produced %#v, want mapped site impact plan", path, plan)
		}
	}
}

func TestBrowserValidationLeavesSelectOnlyTheirExecutableConsumers(t *testing.T) {
	t.Parallel()
	root := filepath.Clean(filepath.Join("..", "..", ".."))
	plan := selectTestPaths(t, root, testOptions(root), []string{
		"scripts/css-authority.test.mjs",
		"scripts/lib/chromium-cdp.test.mjs",
		"scripts/research-object-header-browser.test.mjs",
		"scripts/research-object-header.test.mjs",
		"scripts/validate-css-authority.mjs",
	})
	want := []string{"release", "site"}
	if plan.Mode != "impact" || plan.Reason != "mapped-change-set" ||
		!reflect.DeepEqual(plan.Lanes, want) {
		t.Fatalf("browser validation leaf plan = %#v, want impact/%v", plan, want)
	}
}

func TestEveryWorkstationManifestSelectsItsArtifactAndReadinessConsumers(t *testing.T) {
	t.Parallel()
	root := filepath.Clean(filepath.Join("..", "..", ".."))
	mapping, err := loadMapping(root)
	if err != nil {
		t.Fatalf("loadMapping(repository) error = %v", err)
	}
	options := testOptions(root)
	entries, err := os.ReadDir(filepath.Join(root, "experiments", "workstation", "manifests"))
	if err != nil {
		t.Fatalf("read workstation manifests: %v", err)
	}
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".json") {
			t.Fatalf("unexpected workstation manifest entry %q", entry.Name())
		}
		artifact := strings.TrimSuffix(entry.Name(), ".json")
		t.Run(artifact, func(t *testing.T) {
			lanes := []string{"research", "site", "workstation-" + artifact}
			if artifact == "fixture-007" || artifact == "fixture-019" {
				lanes = append([]string{"container"}, lanes...)
			}
			plan := selectChangedPaths(
				mapping,
				options,
				[]string{"experiments/workstation/manifests/" + artifact + ".json"},
			)
			if plan.Mode != "impact" || !reflect.DeepEqual(plan.Lanes, lanes) {
				t.Fatalf("manifest plan = %#v, want impact/%v", plan, lanes)
			}
		})
	}
}

func TestValidatePathPatternRejectsRecursiveCatchAllTampering(t *testing.T) {
	t.Parallel()
	for _, pattern := range []string{"**", "**/runner.mjs", "experiments/**/runner.mjs", "../**"} {
		if err := validatePathPattern(pattern); err == nil {
			t.Fatalf("validatePathPattern(%q) accepted an unsafe recursive pattern", pattern)
		}
	}
}

func TestValidateMappingRejectsAnUnimplementedLane(t *testing.T) {
	t.Parallel()
	mapping := Mapping{
		Schema: 1,
		Rules: []Rule{{
			ID:    "site",
			Paths: []string{"app/**"},
			Lanes: []string{"sitee"},
		}},
	}
	if err := validateMapping(mapping); err == nil {
		t.Fatal("validateMapping() accepted an unimplemented lane")
	}
}

func TestReadStableMappingRejectsAnOversizedBodyWithAStableDiagnostic(t *testing.T) {
	t.Parallel()
	filename := filepath.Join(t.TempDir(), "ci-impact.json")
	if err := os.WriteFile(filename, []byte(strings.Repeat("x", maximumMappingBytes+1)), 0o600); err != nil {
		t.Fatal(err)
	}
	_, err := readStableMapping(filename)
	if err == nil || !strings.Contains(err.Error(), "exceeds the 65536-byte limit") ||
		strings.Contains(err.Error(), "%!w") {
		t.Fatalf("readStableMapping() error = %q, want stable oversized-body diagnostic", err)
	}
}

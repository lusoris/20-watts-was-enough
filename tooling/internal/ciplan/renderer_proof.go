package ciplan

// rendererProof narrows only a fully recognised presentation change set. The
// renderer lane itself remains selected; an unknown companion path, full plan
// or changed proof/toolchain owner always retains the independent-build proof.
func rendererProof(plan Plan) string {
	if !planSelectsLane(plan, "renderer") {
		return "none"
	}
	if plan.Mode != "impact" || plan.Reason != "mapped-change-set" || len(plan.ChangedPaths) == 0 {
		return "image-build"
	}
	presentation := false
	for _, changedPath := range plan.ChangedPaths {
		if isRendererPresentation(changedPath) {
			presentation = true
			continue
		}
		switch changedPath {
		case "CHANGELOG.md",
			"public/downloads/20-watts-was-enough-full-concept-book.pdf",
			"public/downloads/book-manifest.json",
			"scripts/book-pdf-semantic-baseline.json",
			"scripts/book-edition-surface.test.mjs",
			"scripts/lib/pdf-metadata.test.mjs":
			// Exact output, semantic-binding and regression-test companions.
			// Executable renderer and validator changes remain image-build.
		default:
			return "image-build"
		}
	}
	if presentation {
		return "render-pair"
	}
	return "image-build"
}

func isRendererPresentation(changedPath string) bool {
	switch changedPath {
	case "app/book-content.ts",
		"app/components/book-edition.tsx",
		"app/components/language-access.tsx",
		"app/components/markdown-document.tsx",
		"app/components/mermaid-diagram.tsx",
		"app/components/overflow-region.tsx",
		"app/components/readiness-overview.tsx",
		"app/globals.css",
		"app/lib/book-release-identity.mjs",
		"app/lib/eu-languages.mjs",
		"app/lib/language-access.mjs",
		"app/lib/publication.mjs",
		"app/lib/readiness.ts",
		"app/lib/repository-artifacts.ts",
		"app/project-metadata.ts",
		"app/research-document.ts",
		"experiments/test-readiness-summary.json",
		"github-pages/book.tsx",
		"github-pages/book/index.html":
		return true
	}
	return false
}

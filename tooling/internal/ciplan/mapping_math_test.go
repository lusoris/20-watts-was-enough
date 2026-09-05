package ciplan

import (
	"path/filepath"
	"reflect"
	"testing"
)

func TestMathScriptOwnershipIsExactAndRetainsProtectedFallbacks(t *testing.T) {
	t.Parallel()
	root := filepath.Clean(filepath.Join("..", "..", ".."))
	for _, file := range []string{
		"scripts/validate-math.mjs", "scripts/normalize-math-delimiters.mjs",
		"scripts/lib/math-markdown.mjs", "scripts/lib/math-normalization.mjs",
		"scripts/lib/math-validation.mjs", "scripts/math-validation.test.mjs",
	} {
		t.Run(file, func(t *testing.T) {
			plan := selectTestPaths(t, root, testOptions(root), []string{file})
			if plan.Mode != "impact" || plan.Reason != "mapped-change-set" || !reflect.DeepEqual(plan.Lanes, []string{"research", "site"}) {
				t.Fatalf("math owner %s produced %#v", file, plan)
			}
		})
	}
	for _, test := range []struct {
		path, mode, reason string
		lanes              []string
	}{
		{"scripts/lib/math-validation.mjs.old", "full", "unmapped-path:scripts/lib/math-validation.mjs.old", []string{"full", "renderer"}},
		{"scripts/lib/math-future.mjs", "full", "unmapped-path:scripts/lib/math-future.mjs", []string{"full", "renderer"}},
		{"scripts/math-validation.test.mjs.old", "full", "unmapped-path:scripts/math-validation.test.mjs.old", []string{"full", "renderer"}},
		{"scripts/lib/opened-file.mjs", "full", "full-authority-changed", []string{"full", "renderer"}},
		{"package.json", "full", "full-authority-changed", []string{"full", "renderer"}},
		{".github/ci-impact.json", "full", "selector-authority-changed", []string{"full", "renderer"}},
		{"tooling/internal/ciplan/mapping_math_test.go", "full", "selector-authority-changed", []string{"full", "renderer"}},
		{"scripts/book-support-sources.json", "impact", "mapped-change-set", []string{"release", "research", "site"}},
	} {
		t.Run(test.path, func(t *testing.T) {
			plan := selectTestPaths(t, root, testOptions(root), []string{"scripts/lib/math-markdown.mjs", test.path})
			if plan.Mode != test.mode || plan.Reason != test.reason || !reflect.DeepEqual(plan.Lanes, test.lanes) {
				t.Fatalf("math scope with %s produced %#v, want %s/%v/%s", test.path, plan, test.mode, test.lanes, test.reason)
			}
		})
	}
}

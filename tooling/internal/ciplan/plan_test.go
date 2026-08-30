package ciplan

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
)

const (
	testBaseRevision = "1111111111111111111111111111111111111111"
	testHeadRevision = "2222222222222222222222222222222222222222"
	testMapping      = `{
  "schema": 1,
  "rules": [
    {"id":"global","paths":["experiments/workstation/lib/**"],"lanes":["full"]},
    {"id":"research","paths":["research/**"],"lanes":["research","site"]},
    {"id":"site","paths":["app/**"],"lanes":["site"]},
    {"id":"workstation","paths":["experiments/workstation/fixture-026/**"],"lanes":["workstation-fixture-026"]}
  ]
}`
)

func TestPlanChangedPathsSelectsOnlyMappedImpactLanes(t *testing.T) {
	t.Parallel()
	root := writePlanRepository(t, testMapping)
	options := testOptions(root)
	tests := []struct {
		name  string
		paths []string
		lanes []string
	}{
		{name: "site", paths: []string{"app/main.tsx"}, lanes: []string{"site"}},
		{name: "research", paths: []string{"research/claims.md"}, lanes: []string{"research", "site"}},
		{name: "artifact", paths: []string{"experiments/workstation/fixture-026/runner.mjs"}, lanes: []string{"workstation-fixture-026"}},
		{name: "union", paths: []string{"research/claims.md", "app/main.tsx"}, lanes: []string{"research", "site"}},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			plan := selectTestPaths(t, root, options, test.paths)
			if plan.Mode != "impact" || plan.Reason != "mapped-change-set" ||
				!reflect.DeepEqual(plan.Lanes, test.lanes) {
				t.Fatalf("planChangedPaths() = %#v, want impact lanes %v", plan, test.lanes)
			}
		})
	}
}

func TestBuildFullPlansStillValidateAuthorityAndEncodeClosedEmptyArrays(t *testing.T) {
	t.Parallel()
	root := writePlanRepository(t, testMapping)
	for name, options := range map[string]Options{
		"explicit": {RepositoryRoot: root, ForceFull: true},
		"missing revision": {
			RepositoryRoot: root,
			HeadRevision:   testHeadRevision,
		},
	} {
		t.Run(name, func(t *testing.T) {
			plan, err := Build(context.Background(), options)
			if err != nil {
				t.Fatal(err)
			}
			if plan.Mode != "full" || len(plan.ChangedPaths) != 0 || plan.ChangedPaths == nil {
				t.Fatalf("Build() = %#v, want closed full plan", plan)
			}
			body, err := json.Marshal(plan)
			if err != nil {
				t.Fatal(err)
			}
			if !strings.Contains(string(body), `"changed_paths":[]`) {
				t.Fatalf("JSON = %s, want non-null changed_paths", body)
			}
		})
	}
}

func TestPlanChangedPathsFallsBackToFullAtEveryAmbiguousBoundary(t *testing.T) {
	t.Parallel()
	root := writePlanRepository(t, testMapping)
	options := testOptions(root)
	tests := []struct {
		name   string
		paths  []string
		reason string
	}{
		{name: "shared library", paths: []string{"experiments/workstation/lib/checkpoint-ledger.mjs"}, reason: "full-authority-changed"},
		{name: "unknown", paths: []string{"new-root/tool.mjs"}, reason: "unmapped-path:new-root/tool.mjs"},
		{name: "mapping", paths: []string{mappingRelativePath}, reason: "selector-authority-changed"},
		{name: "selector", paths: []string{"tooling/internal/ciplan/plan.go"}, reason: "selector-authority-changed"},
		{name: "workflow", paths: []string{".github/workflows/ci.yml"}, reason: "selector-authority-changed"},
		{name: "empty", paths: nil, reason: "empty-change-set"},
		{name: "unsafe", paths: []string{"../escape"}, reason: "invalid-or-excessive-change-set"},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			plan := selectTestPaths(t, root, options, test.paths)
			if plan.Mode != "full" || plan.Reason != test.reason ||
				!reflect.DeepEqual(plan.Lanes, []string{"full"}) {
				t.Fatalf("planChangedPaths() = %#v, want full/%s", plan, test.reason)
			}
		})
	}
}

func TestPlanChangedPathsBoundsAndSortsTheChangeSet(t *testing.T) {
	t.Parallel()
	root := writePlanRepository(t, testMapping)
	options := testOptions(root)
	plan := selectTestPaths(t, root, options, []string{"app/z.tsx", "app/a.tsx", "app/a.tsx"})
	if !reflect.DeepEqual(plan.ChangedPaths, []string{"app/a.tsx", "app/z.tsx"}) {
		t.Fatalf("ChangedPaths = %v, want sorted unique paths", plan.ChangedPaths)
	}
	excessive := make([]string, maximumChanges+1)
	for index := range excessive {
		excessive[index] = "app/" + strings.Repeat("a", 10) + string(rune(0x1000+index))
	}
	plan = selectTestPaths(t, root, options, excessive)
	if plan.Mode != "full" || plan.Reason != "invalid-or-excessive-change-set" {
		t.Fatalf("excessive plan = %#v, want full fallback", plan)
	}
}

func TestPlanChangedPathsFallsBackWhenTheMappingIsInvalid(t *testing.T) {
	t.Parallel()
	for name, body := range map[string]string{
		"malformed":      `{"schema":1`,
		"duplicate name": `{"schema":1,"schema":1,"rules":[]}`,
		"unknown field":  `{"schema":1,"rules":[],"extra":true}`,
	} {
		t.Run(name, func(t *testing.T) {
			root := writePlanRepository(t, body)
			if _, err := loadMapping(root); err == nil {
				t.Fatal("loadMapping() accepted an invalid mapping")
			}
			if _, err := Build(context.Background(), Options{RepositoryRoot: root, ForceFull: true}); err == nil {
				t.Fatal("Build(--full) skipped invalid selector authority")
			}
		})
	}
}

func TestPlanChangedPathsRejectsASymlinkedMapping(t *testing.T) {
	t.Parallel()
	root := writePlanRepository(t, testMapping)
	mappingPath := filepath.Join(root, filepath.FromSlash(mappingRelativePath))
	if err := os.Remove(mappingPath); err != nil {
		t.Fatal(err)
	}
	outside := filepath.Join(t.TempDir(), "mapping.json")
	if err := os.WriteFile(outside, []byte(testMapping), 0o600); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(outside, mappingPath); err != nil {
		t.Skipf("symbolic links unavailable: %v", err)
	}
	if _, err := Build(context.Background(), Options{RepositoryRoot: root, ForceFull: true}); err == nil {
		t.Fatal("Build(--full) accepted a symlinked mapping")
	}
}

func selectTestPaths(t *testing.T, root string, options Options, paths []string) Plan {
	t.Helper()
	mapping, err := loadMapping(root)
	if err != nil {
		t.Fatal(err)
	}
	return selectChangedPaths(mapping, options, paths)
}

func testOptions(root string) Options {
	return Options{
		RepositoryRoot: root,
		BaseRevision:   testBaseRevision,
		HeadRevision:   testHeadRevision,
	}
}

func writePlanRepository(t *testing.T, mapping string) string {
	t.Helper()
	root := t.TempDir()
	for _, directory := range []string{".git", ".github"} {
		if err := os.MkdirAll(filepath.Join(root, directory), 0o755); err != nil {
			t.Fatal(err)
		}
	}
	if err := os.WriteFile(
		filepath.Join(root, filepath.FromSlash(mappingRelativePath)),
		[]byte(mapping),
		0o600,
	); err != nil {
		t.Fatal(err)
	}
	return root
}

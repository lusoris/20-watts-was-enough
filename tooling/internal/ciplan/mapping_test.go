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
		{path: "experiments/workstation/fixture-026/runner.mjs", mode: "impact", lanes: []string{"workstation-fixture-026"}},
		{path: "experiments/workstation/fixture-007/runner.mjs", mode: "impact", lanes: []string{"container", "workstation-fixture-007"}},
		{path: "experiments/workstation/lib/execution-receipt.mjs", mode: "full", lanes: []string{"full"}, reason: "full-authority-changed"},
	}
	for _, test := range tests {
		plan := selectTestPaths(t, root, options, []string{test.path})
		if plan.Mode != test.mode || !reflect.DeepEqual(plan.Lanes, test.lanes) ||
			(test.reason != "" && plan.Reason != test.reason) {
			t.Fatalf("path %s produced %#v, want %s/%v", test.path, plan, test.mode, test.lanes)
		}
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

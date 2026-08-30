package ciplan

import (
	"bytes"
	"encoding/json"
	"reflect"
	"strings"
	"testing"
)

func TestProjectEmitsClosedFullSemantics(t *testing.T) {
	t.Parallel()
	projection, err := Project(Plan{
		Schema:       planSchema,
		Mode:         "full",
		Reason:       "explicit-full",
		ChangedPaths: []string{},
		Lanes:        []string{"full"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if projection.Container || projection.Go || projection.Release || projection.Research ||
		projection.Site || projection.WorkstationAny || projection.WorkstationMatrix != "[]" {
		t.Fatalf("Project(full) = %#v, want false semantics and an empty matrix", projection)
	}
	var output bytes.Buffer
	if err := WriteGitHubOutputs(&output, projection); err != nil {
		t.Fatal(err)
	}
	for _, expected := range []string{
		"container=false\n", "go=false\n", "release=false\n", "research=false\n",
		"site=false\n", "workstation_any=false\n", "workstation_matrix=[]\n",
	} {
		if !strings.Contains(output.String(), expected) {
			t.Fatalf("full GitHub outputs = %q, missing %q", output.String(), expected)
		}
	}
}

func TestProjectDerivesOnlyFixedAllowlistedOutputs(t *testing.T) {
	t.Parallel()
	projection, err := Project(Plan{
		Schema:       planSchema,
		Mode:         "impact",
		Reason:       "mapped-change-set",
		BaseRevision: testBaseRevision,
		HeadRevision: testHeadRevision,
		ChangedPaths: []string{"experiments/workstation/fixture-019/runner.mjs", "research/claims.md"},
		Lanes:        []string{"container", "research", "site", "workstation-candidate-010", "workstation-fixture-019"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if !projection.Container || projection.Go || projection.Release || !projection.Research ||
		!projection.Site || !projection.WorkstationAny {
		t.Fatalf("Project(impact) = %#v, want exact lane booleans", projection)
	}
	var artifacts []string
	if err := json.Unmarshal([]byte(projection.WorkstationMatrix), &artifacts); err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(artifacts, []string{"candidate-010", "fixture-019"}) {
		t.Fatalf("matrix = %v, want allowlisted artifacts", artifacts)
	}

	var output bytes.Buffer
	if err := WriteGitHubOutputs(&output, projection); err != nil {
		t.Fatal(err)
	}
	want := "mode=impact\nreason=mapped-change-set\ncontainer=true\ngo=false\n" +
		"release=false\nresearch=true\nsite=true\nworkstation_any=true\n" +
		"workstation_matrix=[\"candidate-010\",\"fixture-019\"]\n"
	if output.String() != want {
		t.Fatalf("GitHub outputs = %q, want %q", output.String(), want)
	}
}

func TestProjectRejectsMalformedPlanCombinations(t *testing.T) {
	t.Parallel()
	base := Plan{
		Schema:       planSchema,
		Mode:         "impact",
		Reason:       "mapped-change-set",
		BaseRevision: testBaseRevision,
		HeadRevision: testHeadRevision,
		ChangedPaths: []string{"app/main.tsx"},
		Lanes:        []string{"site"},
	}
	tests := map[string]func(*Plan){
		"unknown lane":   func(plan *Plan) { plan.Lanes = []string{"sitee"} },
		"full in impact": func(plan *Plan) { plan.Lanes = []string{"full"} },
		"full mixed impact": func(plan *Plan) {
			plan.Lanes = []string{"container", "full"}
		},
		"missing revision": func(plan *Plan) { plan.HeadRevision = "" },
		"unsorted paths":   func(plan *Plan) { plan.ChangedPaths = []string{"app/z.tsx", "app/a.tsx"} },
		"duplicate lanes":  func(plan *Plan) { plan.Lanes = []string{"site", "site"} },
		"full mixed lanes": func(plan *Plan) {
			plan.Mode = "full"
			plan.Reason = "explicit-full"
			plan.Lanes = []string{"full", "site"}
		},
	}
	for name, mutate := range tests {
		t.Run(name, func(t *testing.T) {
			plan := base
			plan.ChangedPaths = append([]string{}, base.ChangedPaths...)
			plan.Lanes = append([]string{}, base.Lanes...)
			mutate(&plan)
			if _, err := Project(plan); err == nil {
				t.Fatalf("Project(%#v) accepted malformed plan", plan)
			}
		})
	}
}

func TestReadProjectionRejectsAmbiguousAndUnknownJSON(t *testing.T) {
	t.Parallel()
	for name, body := range map[string]string{
		"duplicate": `{"schema":1,"schema":1}`,
		"unknown":   `{"schema":1,"mode":"full","reason":"explicit-full","changed_paths":[],"lanes":["full"],"extra":true}`,
		"oversized": strings.Repeat(" ", maximumPlanBytes+1),
	} {
		t.Run(name, func(t *testing.T) {
			if _, err := ReadProjection(strings.NewReader(body)); err == nil {
				t.Fatal("ReadProjection() accepted malformed input")
			}
		})
	}
}

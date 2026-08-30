package ciplan

import (
	"bytes"
	"encoding/json"
	"reflect"
	"strings"
	"testing"
)

func TestProjectEmitsClosedFullSemanticsAndEveryWorkstationJob(t *testing.T) {
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
	if projection.Container || projection.Dependency || projection.Go || projection.Release || projection.Renderer || projection.Research ||
		projection.Site || !projection.WorkstationAny {
		t.Fatalf("Project(full) = %#v, want false lane semantics and workstation jobs", projection)
	}
	var jobs []string
	if err := json.Unmarshal([]byte(projection.WorkstationMatrix), &jobs); err != nil {
		t.Fatal(err)
	}
	wantJobs := []string{
		"candidate-010",
		"fixture-007",
		"fixture-012",
		"fixture-019",
		"fixture-022",
		"fixture-023",
		"fixture-024",
		"fixture-025",
		"fixture-026-shard-1",
		"fixture-026-shard-2",
		"fixture-026-shard-3",
		"fixture-026-shard-4",
		"fixture-026-shard-5",
		"fixture-026-shard-6",
		"fixture-026-shard-7",
		"fixture-027",
		"fixture-029-shard-1",
		"fixture-029-shard-2",
	}
	if !reflect.DeepEqual(jobs, wantJobs) {
		t.Fatalf("full workstation matrix = %v, want %v", jobs, wantJobs)
	}
	var output bytes.Buffer
	if err := WriteGitHubOutputs(&output, projection); err != nil {
		t.Fatal(err)
	}
	for _, expected := range []string{
		"container=false\n", "dependency=false\n", "go=false\n", "release=false\n", "renderer=false\n", "research=false\n",
		"site=false\n", "workstation_any=true\n",
		"workstation_matrix=[\"candidate-010\",\"fixture-007\"",
	} {
		if !strings.Contains(output.String(), expected) {
			t.Fatalf("full GitHub outputs = %q, missing %q", output.String(), expected)
		}
	}
}

func TestProjectPreservesRendererSignalInAFullPlan(t *testing.T) {
	t.Parallel()
	projection, err := Project(Plan{
		Schema:       planSchema,
		Mode:         "full",
		Reason:       "explicit-full",
		ChangedPaths: []string{"tooling/internal/pdfrender/render.go"},
		Lanes:        []string{"full", "renderer"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if !projection.Renderer || projection.Release || !projection.WorkstationAny {
		t.Fatalf("Project(full renderer) = %#v", projection)
	}
}

func TestProjectExpandsOnlySelectedShardedArtifacts(t *testing.T) {
	t.Parallel()
	projection, err := Project(Plan{
		Schema:       planSchema,
		Mode:         "impact",
		Reason:       "mapped-change-set",
		BaseRevision: testBaseRevision,
		HeadRevision: testHeadRevision,
		ChangedPaths: []string{
			"experiments/workstation/fixture-026/runner.mjs",
			"experiments/workstation/fixture-029/suite-runner.mjs",
		},
		Lanes: []string{"workstation-fixture-026", "workstation-fixture-029"},
	})
	if err != nil {
		t.Fatal(err)
	}
	var jobs []string
	if err := json.Unmarshal([]byte(projection.WorkstationMatrix), &jobs); err != nil {
		t.Fatal(err)
	}
	want := []string{
		"fixture-026-shard-1",
		"fixture-026-shard-2",
		"fixture-026-shard-3",
		"fixture-026-shard-4",
		"fixture-026-shard-5",
		"fixture-026-shard-6",
		"fixture-026-shard-7",
		"fixture-029-shard-1",
		"fixture-029-shard-2",
	}
	if !projection.WorkstationAny || !reflect.DeepEqual(jobs, want) {
		t.Fatalf("sharded projection = %#v / %v, want %v", projection, jobs, want)
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
		Lanes:        []string{"common", "container", "dependency", "renderer", "research", "site", "workstation-candidate-010", "workstation-fixture-019"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if !projection.Container || !projection.Dependency || projection.Go || projection.Release || !projection.Renderer || !projection.Research ||
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
	want := "mode=impact\nreason=mapped-change-set\ncontainer=true\ndependency=true\ngo=false\n" +
		"release=false\nrenderer=true\nresearch=true\nsite=true\nworkstation_any=true\n" +
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

func TestProjectWorkstationJobsRejectsDuplicateAndExcessiveMatrices(t *testing.T) {
	t.Parallel()
	for name, jobs := range map[string][]string{
		"duplicate": {"fixture-026-shard-1", "fixture-026-shard-1"},
		"excessive": make([]string, maximumWorkstationJobs+1),
	} {
		t.Run(name, func(t *testing.T) {
			if _, err := projectWorkstationJobs(Projection{}, jobs); err == nil {
				t.Fatalf("projectWorkstationJobs(%q) accepted an invalid matrix", name)
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

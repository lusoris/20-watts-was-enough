package ciplan

import (
	"bytes"
	"encoding/json"
	"path/filepath"
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
	var jobs []workstationMatrixEntry
	if err := json.Unmarshal([]byte(projection.WorkstationMatrix), &jobs); err != nil {
		t.Fatal(err)
	}
	wantJobs := []workstationMatrixEntry{
		{Artifact: "fixture-026-shard-6", Script: "test:workstation:fixture-026:shard-6"},
		{Artifact: "fixture-026-shard-2", Script: "test:workstation:fixture-026:shard-2"},
		{Artifact: "fixture-026-shard-4", Script: "test:workstation:fixture-026:shard-4"},
		{Artifact: "fixture-026-shard-1", Script: "test:workstation:fixture-026:shard-1"},
		{Artifact: "fixture-026-shard-3", Script: "test:workstation:fixture-026:shard-3"},
		{Artifact: "fixture-026-shard-5", Script: "test:workstation:fixture-026:shard-5"},
		{Artifact: "fixture-029-shard-2", Script: "test:workstation:fixture-029:shard-2"},
		{Artifact: "fixture-029-shard-1", Script: "test:workstation:fixture-029:shard-1"},
		{Artifact: "fixture-026-shard-8", Script: "test:workstation:fixture-026:shard-8"},
		{Artifact: "candidate-010", Script: "test:workstation:candidate-010"},
		{Artifact: "fixture-026-shard-7", Script: "test:workstation:fixture-026:shard-7"},
		{Artifact: "fixture-019", Script: "test:workstation:fixture-019"},
		{Artifact: "fixture-024", Script: "test:workstation:fixture-024"},
		{Artifact: "fixture-012", Script: "test:workstation:fixture-012"},
		{Artifact: "fixture-022", Script: "test:workstation:fixture-022"},
		{Artifact: "fixture-027", Script: "test:workstation:fixture-027"},
		{Artifact: "fixture-023", Script: "test:workstation:fixture-023"},
		{Artifact: "fixture-007", Script: "test:workstation:fixture-007"},
		{Artifact: "fixture-025", Script: "test:workstation:fixture-025"},
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
		"workstation_matrix=[{\"artifact\":\"fixture-026-shard-6\",\"script\":\"test:workstation:fixture-026:shard-6\"}",
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
	var jobs []workstationMatrixEntry
	if err := json.Unmarshal([]byte(projection.WorkstationMatrix), &jobs); err != nil {
		t.Fatal(err)
	}
	want := []workstationMatrixEntry{
		{Artifact: "fixture-026-shard-6", Script: "test:workstation:fixture-026:shard-6"},
		{Artifact: "fixture-026-shard-2", Script: "test:workstation:fixture-026:shard-2"},
		{Artifact: "fixture-026-shard-4", Script: "test:workstation:fixture-026:shard-4"},
		{Artifact: "fixture-026-shard-1", Script: "test:workstation:fixture-026:shard-1"},
		{Artifact: "fixture-026-shard-3", Script: "test:workstation:fixture-026:shard-3"},
		{Artifact: "fixture-026-shard-5", Script: "test:workstation:fixture-026:shard-5"},
		{Artifact: "fixture-029-shard-2", Script: "test:workstation:fixture-029:shard-2"},
		{Artifact: "fixture-029-shard-1", Script: "test:workstation:fixture-029:shard-1"},
		{Artifact: "fixture-026-shard-8", Script: "test:workstation:fixture-026:shard-8"},
		{Artifact: "fixture-026-shard-7", Script: "test:workstation:fixture-026:shard-7"},
	}
	if !projection.WorkstationAny || !reflect.DeepEqual(jobs, want) {
		t.Fatalf("sharded projection = %#v / %v, want %v", projection, jobs, want)
	}
}

func TestWorkstationJavaScriptChangeActivatesTheCodeQLSelector(t *testing.T) {
	t.Parallel()
	root := filepath.Clean(filepath.Join("..", "..", ".."))
	plan := selectTestPaths(t, root, testOptions(root), []string{
		"experiments/workstation/fixture-026/runner.mjs",
	})
	projection, err := Project(plan)
	if err != nil {
		t.Fatal(err)
	}
	if projection.Site || !projection.WorkstationAny {
		t.Fatalf("Project(workstation JavaScript) = %#v, want workstation_any without site", projection)
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
	var artifacts []workstationMatrixEntry
	if err := json.Unmarshal([]byte(projection.WorkstationMatrix), &artifacts); err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(artifacts, []workstationMatrixEntry{
		{Artifact: "candidate-010", Script: "test:workstation:candidate-010"},
		{Artifact: "fixture-019", Script: "test:workstation:fixture-019"},
	}) {
		t.Fatalf("matrix = %v, want allowlisted artifacts", artifacts)
	}

	var output bytes.Buffer
	if err := WriteGitHubOutputs(&output, projection); err != nil {
		t.Fatal(err)
	}
	want := "mode=impact\nreason=mapped-change-set\ncontainer=true\ndependency=true\ngo=false\n" +
		"release=false\nrenderer=true\nresearch=true\nsite=true\nworkstation_any=true\n" +
		"workstation_matrix=[{\"artifact\":\"candidate-010\",\"script\":\"test:workstation:candidate-010\"},{\"artifact\":\"fixture-019\",\"script\":\"test:workstation:fixture-019\"}]\n"
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
		"previous schema": func(plan *Plan) { plan.Schema = 1 },
		"unknown lane":    func(plan *Plan) { plan.Lanes = []string{"sitee"} },
		"full in impact":  func(plan *Plan) { plan.Lanes = []string{"full"} },
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

func TestWorkstationJobsReturnsAnIsolatedCompleteCatalogue(t *testing.T) {
	t.Parallel()
	first, err := WorkstationJobs()
	if err != nil {
		t.Fatal(err)
	}
	coreScript, catalogueJobs, err := WorkstationCatalogue()
	if err != nil {
		t.Fatal(err)
	}
	if len(first) != 19 || coreScript != "test:workstation:core" || !reflect.DeepEqual(first, catalogueJobs) {
		t.Fatalf("workstation catalogue has %d artifacts and core %q", len(first), coreScript)
	}
	for index, job := range first {
		if job.CreationRank != index+1 {
			t.Fatalf("workstation job %d has creation rank %d", index, job.CreationRank)
		}
	}
	first[0] = WorkstationJob{}
	second, err := WorkstationJobs()
	if err != nil {
		t.Fatal(err)
	}
	if second[0].Artifact != "fixture-026-shard-6" || second[0].Script != "test:workstation:fixture-026:shard-6" {
		t.Fatalf("WorkstationJobs() exposed mutable catalogue state: %#v", second[0])
	}
}

func TestProjectWorkstationJobsRejectsInvalidMatrices(t *testing.T) {
	t.Parallel()
	for name, jobs := range map[string][]WorkstationJob{
		"duplicate name": {
			{Artifact: "fixture-026-shard-1", Script: "test:workstation:fixture-026:shard-1", CreationRank: 1},
			{Artifact: "fixture-026-shard-1", Script: "test:workstation:fixture-026:shard-2", CreationRank: 2},
		},
		"duplicate script": {
			{Artifact: "fixture-026-shard-1", Script: "test:workstation:fixture-026:shard-1", CreationRank: 1},
			{Artifact: "fixture-026-shard-2", Script: "test:workstation:fixture-026:shard-1", CreationRank: 2},
		},
		"duplicate creation rank": {
			{Artifact: "fixture-026-shard-1", Script: "test:workstation:fixture-026:shard-1", CreationRank: 1},
			{Artifact: "fixture-026-shard-2", Script: "test:workstation:fixture-026:shard-2", CreationRank: 1},
		},
		"invalid creation rank": {
			{Artifact: "fixture-026-shard-1", Script: "test:workstation:fixture-026:shard-1", CreationRank: 0},
		},
		"negative creation rank": {
			{Artifact: "fixture-026-shard-1", Script: "test:workstation:fixture-026:shard-1", CreationRank: -1},
		},
		"excessive creation rank": {
			{Artifact: "fixture-026-shard-1", Script: "test:workstation:fixture-026:shard-1", CreationRank: maximumWorkstationJobs + 1},
		},
		"malformed name": {
			{Artifact: "fixture/026", Script: "test:workstation:fixture-026", CreationRank: 1},
		},
		"malformed script": {
			{Artifact: "fixture-026", Script: "preinstall", CreationRank: 1},
		},
		"excessive": make([]WorkstationJob, maximumWorkstationJobs+1),
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
		"duplicate": `{"schema":2,"schema":2}`,
		"unknown":   `{"schema":2,"mode":"full","reason":"explicit-full","changed_paths":[],"lanes":["full"],"extra":true}`,
		"oversized": strings.Repeat(" ", maximumPlanBytes+1),
	} {
		t.Run(name, func(t *testing.T) {
			if _, err := ReadProjection(strings.NewReader(body)); err == nil {
				t.Fatal("ReadProjection() accepted malformed input")
			}
		})
	}
}

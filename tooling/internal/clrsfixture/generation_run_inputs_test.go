package clrsfixture

import (
	"encoding/json"
	"testing"
)

func TestGenerationProcedureBindsCurrentExperimentCLI(t *testing.T) {
	_, inputs, _ := generationRunFixture(t)
	var procedure generationProcedure
	if err := json.Unmarshal(inputs.files["procedure.json"], &procedure); err != nil {
		t.Fatal(err)
	}
	seen := map[string]bool{}
	for _, source := range procedure.Sources {
		if seen[source.Path] {
			t.Fatalf("duplicate procedure source %s", source.Path)
		}
		seen[source.Path] = true
	}
	for _, path := range []string{
		"tooling/internal/experimentcli/cli.go",
		"tooling/internal/experimentcli/clrs_generation.go",
		"tooling/internal/experimentcli/clrs_promise.go",
		"tooling/internal/clrsfixture/generation_run_publish.go",
		"tooling/cmd/20w/main.go",
	} {
		if !seen[path] {
			t.Fatalf("current procedure omitted invoked source %s", path)
		}
	}
	if seen["tooling/cmd/20w/clrs_promise.go"] {
		t.Fatal("current generation procedure retained the removed legacy CLI source")
	}
}

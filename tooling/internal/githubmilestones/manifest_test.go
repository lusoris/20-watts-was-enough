package githubmilestones

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func writeMilestoneManifest(t *testing.T, root, body string) {
	t.Helper()
	directory := filepath.Join(root, ".github")
	if err := os.MkdirAll(directory, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(directory, "milestones.json"), []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
}

func TestLoadAcceptsClosedManifest(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	writeMilestoneManifest(t, root, `{
  "schema": 1,
  "milestones": [{
    "id": "M0",
    "title": "M0 — Evidence contracts",
    "state": "open",
    "roadmap": "concept/90-research-roadmap.md#stage-0--evidence-synthesis-and-contracts",
    "summary": "Make one evidence boundary inspectable before execution begins."
  }]
}`)
	manifest, err := Load(root)
	if err != nil {
		t.Fatal(err)
	}
	if len(manifest.Milestones) != 1 || manifest.Milestones[0].ID != "M0" {
		t.Fatalf("Load() = %#v", manifest)
	}
}

func TestLoadRejectsAmbiguousAndOpenManifests(t *testing.T) {
	t.Parallel()
	validMilestone := `{"id":"M0","title":"M0 — Evidence contracts","state":"open","roadmap":"concept/90-research-roadmap.md#stage-0--evidence-synthesis-and-contracts","summary":"Make one evidence boundary inspectable before execution begins."}`
	tests := map[string]string{
		"duplicate key": `{"schema":1,"schema":1,"milestones":[` + validMilestone + `]}`,
		"unknown key":   `{"schema":1,"extra":true,"milestones":[` + validMilestone + `]}`,
		"trailing":      `{"schema":1,"milestones":[` + validMilestone + `]} {}`,
		"wrong order":   `{"schema":1,"milestones":[` + strings.Replace(validMilestone, `"M0"`, `"M1"`, 1) + `]}`,
		"wrong stage":   `{"schema":1,"milestones":[` + strings.Replace(validMilestone, "#stage-0--", "#stage-1--", 1) + `]}`,
		"multiline":     `{"schema":1,"milestones":[` + strings.Replace(validMilestone, "before execution", `before\nexecution`, 1) + `]}`,
	}
	for name, body := range tests {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			root := t.TempDir()
			writeMilestoneManifest(t, root, body)
			if _, err := Load(root); err == nil {
				t.Fatalf("Load() accepted %s", name)
			}
		})
	}
}

func TestManagedDescriptionBindsIdentityAndScientificBoundary(t *testing.T) {
	t.Parallel()
	milestone := Milestone{
		ID: "M0", Title: "M0 — Evidence contracts", State: "open",
		Roadmap: "concept/90-research-roadmap.md#stage-0--evidence-synthesis-and-contracts",
		Summary: "Make one evidence boundary inspectable before execution begins.",
	}
	description := managedDescription("owner/repository", milestone)
	for _, expected := range []string{
		"<!-- 20w-roadmap-id:M0 -->",
		"https://github.com/owner/repository/blob/main/concept/90-research-roadmap.md#stage-0--evidence-synthesis-and-contracts",
		"does not promote a claim",
	} {
		if !strings.Contains(description, expected) {
			t.Fatalf("managedDescription() missing %q: %s", expected, description)
		}
	}
}

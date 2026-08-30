package githubissuemilestones

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func writeManifest(t *testing.T, root, body string) {
	t.Helper()
	directory := filepath.Join(root, ".github")
	if err := os.MkdirAll(directory, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(directory, "issue-milestones.json"), []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
}

func TestLoadAcceptsRepositoryBoundClosedManifest(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	writeManifest(t, root, `{"schema":1,"repository":"owner/repository","assignments":[{"issue":7,"milestone":"M0"},{"issue":12,"milestone":"M1"}]}`)
	manifest, err := Load(root)
	if err != nil {
		t.Fatal(err)
	}
	if manifest.Repository != "owner/repository" || len(manifest.Assignments) != 2 {
		t.Fatalf("Load() = %#v", manifest)
	}
}

func TestLoadRejectsAmbiguousOpenOrUnorderedAssignments(t *testing.T) {
	t.Parallel()
	valid := `{"schema":1,"repository":"owner/repository","assignments":[{"issue":7,"milestone":"M0"}]}`
	for name, body := range map[string]string{
		"duplicate field": strings.Replace(valid, `"schema":1`, `"schema":1,"schema":1`, 1),
		"unknown field":   strings.Replace(valid, `"issue":7`, `"issue":7,"title":"mutable"`, 1),
		"repository":      strings.Replace(valid, "owner/repository", "repository", 1),
		"duplicate issue": `{"schema":1,"repository":"owner/repository","assignments":[{"issue":7,"milestone":"M0"},{"issue":7,"milestone":"M1"}]}`,
		"unordered":       `{"schema":1,"repository":"owner/repository","assignments":[{"issue":12,"milestone":"M1"},{"issue":7,"milestone":"M0"}]}`,
		"bad milestone":   strings.Replace(valid, "M0", "Stage 0", 1),
	} {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			root := t.TempDir()
			writeManifest(t, root, body)
			if _, err := Load(root); err == nil {
				t.Fatalf("Load() accepted %s", name)
			}
		})
	}
}

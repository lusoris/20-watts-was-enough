package ciplan

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
)

func TestParseNameStatusPreservesRenameAndDeletionPaths(t *testing.T) {
	t.Parallel()
	body := []byte("M\x00app/main.tsx\x00D\x00research/old.md\x00R100\x00app/old.tsx\x00app/new.tsx\x00")
	paths, nonAdditive, err := parseNameStatus(body)
	if err != nil {
		t.Fatal(err)
	}
	if !nonAdditive {
		t.Fatal("parseNameStatus() did not force full for deletion and rename")
	}
	want := []string{"app/main.tsx", "app/new.tsx", "app/old.tsx", "research/old.md"}
	if !reflect.DeepEqual(paths, want) {
		t.Fatalf("parseNameStatus() = %v, want %v", paths, want)
	}
}

func TestParseNameStatusRejectsMalformedOrUnrepresentableOutput(t *testing.T) {
	t.Parallel()
	for name, body := range map[string][]byte{
		"truncated":           []byte("M\x00app/main.tsx"),
		"missing rename path": []byte("R100\x00app/old.tsx\x00"),
		"unsupported status":  []byte("U\x00app/main.tsx\x00"),
		"invalid score":       []byte("R101\x00app/old.tsx\x00app/new.tsx\x00"),
		"unsafe path":         []byte("M\x00../outside\x00"),
		"invalid utf8":        {'M', 0, 0xff, 0},
	} {
		t.Run(name, func(t *testing.T) {
			if _, _, err := parseNameStatus(body); err == nil {
				t.Fatalf("parseNameStatus(%q) succeeded", body)
			}
		})
	}
}

func TestReadGitChangedPathsUsesTheExactThreeDotRenameDiff(t *testing.T) {
	t.Parallel()
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("Git is unavailable")
	}
	root := initializeGitPlanRepository(t)
	oldPath := filepath.Join(root, "app", "old.tsx")
	if err := os.MkdirAll(filepath.Dir(oldPath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(oldPath, []byte("export const value = 1;\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	base := commitGitPlanRepository(t, root, "base")
	newPath := filepath.Join(root, "app", "new.tsx")
	if err := os.Rename(oldPath, newPath); err != nil {
		t.Fatal(err)
	}
	head := commitGitPlanRepository(t, root, "rename")
	paths, nonAdditive, err := readGitChangedPaths(context.Background(), root, base, head)
	if err != nil {
		t.Fatal(err)
	}
	if !nonAdditive {
		t.Fatal("readGitChangedPaths() did not mark a rename as full-only")
	}
	if !reflect.DeepEqual(paths, []string{"app/new.tsx", "app/old.tsx"}) {
		t.Fatalf("readGitChangedPaths() = %v, want both rename paths", paths)
	}
	plan, err := Build(context.Background(), Options{
		RepositoryRoot: root,
		BaseRevision:   base,
		HeadRevision:   head,
	})
	if err != nil {
		t.Fatal(err)
	}
	if plan.Mode != "full" || plan.Reason != "rename-delete-copy-or-type-change" {
		t.Fatalf("Build(rename) = %#v, want non-additive full fallback", plan)
	}
}

func TestBuildSelectsMappedImpactLaneFromExactDiff(t *testing.T) {
	t.Parallel()
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("Git is unavailable")
	}
	root := initializeGitPlanRepository(t)
	appPath := filepath.Join(root, "app", "main.tsx")
	if err := os.MkdirAll(filepath.Dir(appPath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(appPath, []byte("export const value = 1;\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	base := commitGitPlanRepository(t, root, "base")
	if err := os.WriteFile(appPath, []byte("export const value = 2;\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	head := commitGitPlanRepository(t, root, "site change")
	plan, err := Build(context.Background(), Options{
		RepositoryRoot: root,
		BaseRevision:   base,
		HeadRevision:   head,
	})
	if err != nil {
		t.Fatal(err)
	}
	if plan.Mode != "impact" || plan.Reason != "mapped-change-set" ||
		!reflect.DeepEqual(plan.ChangedPaths, []string{"app/main.tsx"}) ||
		!reflect.DeepEqual(plan.Lanes, []string{"site"}) {
		t.Fatalf("Build(site change) = %#v, want mapped site impact plan", plan)
	}
}

func initializeGitPlanRepository(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	runGit(t, root, "init", "--quiet")
	runGit(t, root, "config", "user.email", "ci@example.invalid")
	runGit(t, root, "config", "user.name", "CI Test")
	if err := os.MkdirAll(filepath.Join(root, ".github"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(
		filepath.Join(root, filepath.FromSlash(mappingRelativePath)),
		[]byte(testMapping),
		0o600,
	); err != nil {
		t.Fatal(err)
	}
	return root
}

func commitGitPlanRepository(t *testing.T, root, message string) string {
	t.Helper()
	runGit(t, root, "add", "--all")
	runGit(t, root, "commit", "--quiet", "-m", message)
	return strings.TrimSpace(runGit(t, root, "rev-parse", "HEAD"))
}

func runGit(t *testing.T, root string, arguments ...string) string {
	t.Helper()
	command := exec.Command("git", append([]string{"-C", root}, arguments...)...)
	command.Env = append(os.Environ(), "GIT_CONFIG_NOSYSTEM=1", "GIT_CONFIG_GLOBAL="+os.DevNull)
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("git %v: %v: %s", arguments, err, output)
	}
	return string(output)
}

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

func TestParseRawDiffPreservesRenameAndDeletionPaths(t *testing.T) {
	t.Parallel()
	body := append(rawRecord("100644", "100644", "M", "app/main.tsx"),
		rawRecord("100644", "000000", "D", "research/old.md")...)
	body = append(body, rawRecord("100644", "100644", "R100", "app/old.tsx", "app/new.tsx")...)
	paths, requiresFull, err := parseRawDiff(body)
	if err != nil {
		t.Fatal(err)
	}
	if !requiresFull {
		t.Fatal("parseRawDiff() did not force full for rename")
	}
	want := []string{"app/main.tsx", "app/new.tsx", "app/old.tsx", "research/old.md"}
	if !reflect.DeepEqual(paths, want) {
		t.Fatalf("parseRawDiff() = %v, want %v", paths, want)
	}
}

func TestParseRawDiffRequiresFullForNonRegularAndIdentityChanges(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name         string
		oldMode      string
		newMode      string
		status       string
		paths        []string
		requiresFull bool
	}{
		{name: "regular add", oldMode: "000000", newMode: "100644", status: "A", paths: []string{"app/new.tsx"}},
		{name: "regular modify", oldMode: "100644", newMode: "100755", status: "M", paths: []string{"app/tool"}},
		{name: "regular delete", oldMode: "100644", newMode: "000000", status: "D", paths: []string{"app/old.tsx"}},
		{name: "symlink add", oldMode: "000000", newMode: "120000", status: "A", paths: []string{"app/link"}, requiresFull: true},
		{name: "symlink delete", oldMode: "120000", newMode: "000000", status: "D", paths: []string{"app/link"}, requiresFull: true},
		{name: "gitlink delete", oldMode: "160000", newMode: "000000", status: "D", paths: []string{"app/submodule"}, requiresFull: true},
		{name: "type change", oldMode: "100644", newMode: "120000", status: "T", paths: []string{"app/value"}, requiresFull: true},
		{name: "rename", oldMode: "100644", newMode: "100644", status: "R100", paths: []string{"app/old.tsx", "app/new.tsx"}, requiresFull: true},
		{name: "copy", oldMode: "100644", newMode: "100644", status: "C100", paths: []string{"app/source.tsx", "app/copy.tsx"}, requiresFull: true},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			paths, requiresFull, err := parseRawDiff(rawRecord(test.oldMode, test.newMode, test.status, test.paths...))
			if err != nil {
				t.Fatal(err)
			}
			if requiresFull != test.requiresFull {
				t.Fatalf("parseRawDiff(%s) requiresFull = %t, want %t; paths = %v", test.status, requiresFull, test.requiresFull, paths)
			}
		})
	}
}

func TestParseRawDiffMapsIndependentRegularDeletionAndAddition(t *testing.T) {
	t.Parallel()
	body := append(rawRecord("100644", "000000", "D", "app/old.tsx"),
		rawRecord("000000", "100644", "A", "app/new.tsx")...)
	paths, requiresFull, err := parseRawDiff(body)
	if err != nil {
		t.Fatal(err)
	}
	if requiresFull || !reflect.DeepEqual(paths, []string{"app/new.tsx", "app/old.tsx"}) {
		t.Fatalf("parseRawDiff(delete+add) = %v/full=%t, want both mapped paths without identity inference", paths, requiresFull)
	}
}

func TestParseRawDiffRejectsMalformedOrUnrepresentableOutput(t *testing.T) {
	t.Parallel()
	truncated := rawRecord("100644", "100644", "M", "app/main.tsx")
	invalidUTF8 := append([]byte(rawHeader("100644", "100644", "M")+"\x00"), 0xff, 0)
	nonzeroObject := strings.Repeat("a", 40)
	otherObject := strings.Repeat("b", 40)
	zeroObject := strings.Repeat("0", 40)
	for name, body := range map[string][]byte{
		"truncated":           truncated[:len(truncated)-1],
		"missing rename path": rawRecord("100644", "100644", "R100", "app/old.tsx"),
		"unsupported status":  rawRecord("100644", "100644", "U", "app/main.tsx"),
		"invalid score":       rawRecord("100644", "100644", "R101", "app/old.tsx", "app/new.tsx"),
		"unsafe path":         rawRecord("100644", "100644", "M", "../outside"),
		"invalid utf8":        invalidUTF8,
		"invalid mode":        []byte(":10064 100644 " + strings.Repeat("a", 40) + " " + strings.Repeat("b", 40) + " M\x00app/main.tsx\x00"),
		"invalid object id":   []byte(":100644 100644 short " + strings.Repeat("b", 40) + " M\x00app/main.tsx\x00"),
		"add with nonzero old object": []byte(
			":000000 100644 " + nonzeroObject + " " + otherObject + " A\x00app/new.tsx\x00",
		),
		"delete with nonzero new object": []byte(
			":100644 000000 " + nonzeroObject + " " + otherObject + " D\x00app/old.tsx\x00",
		),
		"modify with zero old object": []byte(
			":100644 100644 " + zeroObject + " " + otherObject + " M\x00app/main.tsx\x00",
		),
		"modify with zero new object": []byte(
			":100644 100644 " + nonzeroObject + " " + zeroObject + " M\x00app/main.tsx\x00",
		),
	} {
		t.Run(name, func(t *testing.T) {
			if _, _, err := parseRawDiff(body); err == nil {
				t.Fatalf("parseRawDiff(%q) succeeded", body)
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
	paths, requiresFull, err := readGitChangedPaths(context.Background(), root, base, head)
	if err != nil {
		t.Fatal(err)
	}
	if !requiresFull {
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
	if plan.Mode != "full" || plan.Reason != "unsafe-change-shape" ||
		!reflect.DeepEqual(plan.Lanes, []string{"full"}) {
		t.Fatalf("Build(rename) = %#v, want unsafe-shape full fallback", plan)
	}
}

func TestBuildClassifiedCopyAndSymlinkDeletionRequireFull(t *testing.T) {
	t.Parallel()
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("Git is unavailable")
	}
	t.Run("copy", func(t *testing.T) {
		root := initializeGitPlanRepository(t)
		source := filepath.Join(root, "app", "source.tsx")
		if err := os.MkdirAll(filepath.Dir(source), 0o755); err != nil {
			t.Fatal(err)
		}
		body := []byte("export const copied = true;\n")
		if err := os.WriteFile(source, body, 0o600); err != nil {
			t.Fatal(err)
		}
		base := commitGitPlanRepository(t, root, "base")
		if err := os.WriteFile(filepath.Join(root, "app", "copy.tsx"), body, 0o600); err != nil {
			t.Fatal(err)
		}
		head := commitGitPlanRepository(t, root, "copy")
		assertUnsafeShapePlan(t, root, base, head)
	})
	t.Run("symlink deletion", func(t *testing.T) {
		root := initializeGitPlanRepository(t)
		link := filepath.Join(root, "app", "link")
		if err := os.MkdirAll(filepath.Dir(link), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.Symlink("target", link); err != nil {
			t.Skipf("symbolic links unavailable: %v", err)
		}
		base := commitGitPlanRepository(t, root, "base")
		if err := os.Remove(link); err != nil {
			t.Fatal(err)
		}
		head := commitGitPlanRepository(t, root, "delete symlink")
		assertUnsafeShapePlan(t, root, base, head)
	})
}

func TestBuildMapsADeletionToItsOwningImpactLane(t *testing.T) {
	t.Parallel()
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("Git is unavailable")
	}
	root := initializeGitPlanRepository(t)
	deletedPath := filepath.Join(root, "app", "retired.tsx")
	if err := os.MkdirAll(filepath.Dir(deletedPath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(deletedPath, []byte("export const retired = true;\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	base := commitGitPlanRepository(t, root, "base")
	if err := os.Remove(deletedPath); err != nil {
		t.Fatal(err)
	}
	head := commitGitPlanRepository(t, root, "delete mapped site file")
	plan, err := Build(context.Background(), Options{
		RepositoryRoot: root,
		BaseRevision:   base,
		HeadRevision:   head,
	})
	if err != nil {
		t.Fatal(err)
	}
	if plan.Mode != "impact" || plan.Reason != "mapped-change-set" ||
		!reflect.DeepEqual(plan.ChangedPaths, []string{"app/retired.tsx"}) ||
		!reflect.DeepEqual(plan.Lanes, []string{"site"}) {
		t.Fatalf("Build(deletion) = %#v, want mapped site impact plan", plan)
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

func TestBuildFullPlanPreservesOnlyTheOrthogonalRendererSignal(t *testing.T) {
	t.Parallel()
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("Git is unavailable")
	}
	for name, change := range map[string]struct {
		path         string
		wantRenderer bool
	}{
		"unrelated site": {
			path: "app/main.tsx",
		},
		"renderer authority": {
			path:         "tooling/internal/pdfrender/render.go",
			wantRenderer: true,
		},
		"book renderer authority": {
			path:         "app/globals.css",
			wantRenderer: true,
		},
	} {
		t.Run(name, func(t *testing.T) {
			root := initializeGitPlanRepository(t)
			file := filepath.Join(root, filepath.FromSlash(change.path))
			if err := os.MkdirAll(filepath.Dir(file), 0o755); err != nil {
				t.Fatal(err)
			}
			if err := os.WriteFile(file, []byte("first\n"), 0o600); err != nil {
				t.Fatal(err)
			}
			base := commitGitPlanRepository(t, root, "base")
			if err := os.WriteFile(file, []byte("second\n"), 0o600); err != nil {
				t.Fatal(err)
			}
			head := commitGitPlanRepository(t, root, "change")
			plan, err := Build(context.Background(), Options{
				RepositoryRoot: root,
				BaseRevision:   base,
				HeadRevision:   head,
				ForceFull:      true,
			})
			if err != nil {
				t.Fatal(err)
			}
			wantLanes := []string{"full"}
			if change.wantRenderer {
				wantLanes = append(wantLanes, "renderer")
			}
			if plan.Mode != "full" || plan.Reason != "explicit-full" ||
				!reflect.DeepEqual(plan.ChangedPaths, []string{change.path}) ||
				!reflect.DeepEqual(plan.Lanes, wantLanes) {
				t.Fatalf("Build(force full) = %#v, want %v", plan, wantLanes)
			}
		})
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

func rawHeader(oldMode, newMode, status string) string {
	oldObject := strings.Repeat("a", 40)
	newObject := strings.Repeat("b", 40)
	if oldMode == "000000" {
		oldObject = strings.Repeat("0", 40)
	}
	if newMode == "000000" {
		newObject = strings.Repeat("0", 40)
	}
	return ":" + oldMode + " " + newMode + " " + oldObject + " " + newObject + " " + status
}

func rawRecord(oldMode, newMode, status string, paths ...string) []byte {
	body := []byte(rawHeader(oldMode, newMode, status))
	for _, changedPath := range paths {
		body = append(body, 0)
		body = append(body, changedPath...)
	}
	return append(body, 0)
}

func assertUnsafeShapePlan(t *testing.T, root, base, head string) {
	t.Helper()
	plan, err := Build(context.Background(), Options{
		RepositoryRoot: root,
		BaseRevision:   base,
		HeadRevision:   head,
	})
	if err != nil {
		t.Fatal(err)
	}
	if plan.Mode != "full" || plan.Reason != "unsafe-change-shape" ||
		!reflect.DeepEqual(plan.Lanes, []string{"full"}) {
		t.Fatalf("Build(unsafe change shape) = %#v, want full fallback", plan)
	}
}

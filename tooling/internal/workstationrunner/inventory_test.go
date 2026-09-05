package workstationrunner

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestRepositoryWorkstationInventoryCoversEveryTestExactlyOnce(t *testing.T) {
	t.Parallel()
	root, err := resolveRepositoryRoot(filepath.Clean(filepath.Join("..", "..", "..")))
	if err != nil {
		t.Fatal(err)
	}
	jobs, err := productionJobs()
	if err != nil {
		t.Fatal(err)
	}
	if _, err := freezeWorkstationInventory(root, jobs); err != nil {
		t.Fatal(err)
	}
}

func TestValidateWorkstationInventoryRejectsCoverageAndManifestDrift(t *testing.T) {
	t.Parallel()
	for name, mutate := range map[string]func(*testing.T, string){
		"missing discovered test": func(t *testing.T, root string) {
			writeInventoryPackage(t, root, "node --test --experimental-test-isolation=none experiments/workstation/core.test.mjs", fixtureCommand)
		},
		"duplicate discovered test": func(t *testing.T, root string) {
			writeInventoryPackage(t, root, coreCommand, fixtureCommand+" experiments/workstation/core.test.mjs")
		},
		"empty pattern": func(t *testing.T, root string) {
			writeInventoryPackage(t, root, coreCommand, "node --test --experimental-test-isolation=none experiments/workstation/fixture-007/missing.test.mjs")
		},
		"missing full_tests path": func(t *testing.T, root string) {
			writeInventoryManifest(t, root, []string{"experiments/workstation/fixture-007/missing.test.mjs"})
		},
		"foreign full_tests path": func(t *testing.T, root string) {
			writeInventoryManifest(t, root, []string{"experiments/workstation/core.test.mjs"})
		},
		"aggregate bypass": func(t *testing.T, root string) {
			writeInventoryPackage(t, root, coreCommand, fixtureCommand)
			body, err := os.ReadFile(filepath.Join(root, "package.json"))
			if err != nil {
				t.Fatal(err)
			}
			body = []byte(strings.ReplaceAll(string(body), workstationAggregateCommand, "npm run test:workstation:core"))
			if err := os.WriteFile(filepath.Join(root, "package.json"), body, 0o600); err != nil {
				t.Fatal(err)
			}
		},
		"missing artifact manifest": func(t *testing.T, root string) {
			if err := os.Remove(filepath.Join(root, "experiments", "workstation", "manifests", "fixture-007.json")); err != nil {
				t.Fatal(err)
			}
		},
		"ambiguous package json": func(t *testing.T, root string) {
			body := `{"scripts":{"test:workstation":"` + workstationAggregateCommand +
				`","test:workstation":"` + workstationAggregateCommand + `"}}`
			if err := os.WriteFile(filepath.Join(root, "package.json"), []byte(body), 0o600); err != nil {
				t.Fatal(err)
			}
		},
	} {
		name, mutate := name, mutate
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			root, jobs := workstationInventoryFixture(t)
			mutate(t, root)
			if _, err := freezeWorkstationInventory(root, jobs); err == nil {
				t.Fatal("freezeWorkstationInventory accepted drift")
			}
		})
	}
}

func TestParseWorkstationCommandRequiresClosedNodeTestPaths(t *testing.T) {
	t.Parallel()
	valid, err := parseWorkstationCommand(
		"node --test --experimental-test-isolation=none --test-concurrency=1 " +
			"experiments/workstation/fixture-007/*.test.mjs",
	)
	if err != nil || len(valid.patterns) != 1 || len(valid.arguments) != 4 {
		t.Fatalf("parseWorkstationCommand(valid) = %q/%v", valid, err)
	}
	for _, command := range []string{
		"node --test experiments/workstation/fixture-007/*.test.mjs",
		"node --test --experimental-test-isolation=none",
		"node --test --experimental-test-isolation=none experiments/workstation/**/*.test.mjs",
		"node --test --experimental-test-isolation=none experiments/workstation/fixture-007/*.test.mjs && true",
		"node --test --experimental-test-isolation=none ../outside.test.mjs",
	} {
		if _, err := parseWorkstationCommand(command); err == nil {
			t.Fatalf("parseWorkstationCommand(%q) accepted an open command", command)
		}
	}
}

func TestFrozenArgumentsSurvivePackageRewriteAndExcludeLifecycleHooks(t *testing.T) {
	root, jobs, originalPackage := frozenMutationFixture(t)
	frozen, err := freezeWorkstationInventory(root, jobs)
	if err != nil {
		t.Fatal(err)
	}
	wantSafeArgument := "experiments/workstation/fixture-007/safe-later.test.mjs"
	if len(frozen) != 2 || frozen[1].arguments[len(frozen[1].arguments)-1] != wantSafeArgument {
		t.Fatalf("frozen jobs = %#v, want exact safe-later argv", frozen)
	}

	options := helperOptions(t, 2)
	var summary bytes.Buffer
	if err := runSuite(t.Context(), root, frozen, options, &summary); err != nil {
		t.Fatalf("runSuite() error/summary = %v/%q", err, summary.String())
	}
	currentPackage, err := os.ReadFile(filepath.Join(root, "package.json"))
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(currentPackage, originalPackage) {
		t.Fatal("mutation helper did not restore package.json byte for byte")
	}
	safeArguments, err := os.ReadFile(filepath.Join(root, "safe-later.ran"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(safeArguments), wantSafeArgument) || strings.Contains(string(safeArguments), "hostile") {
		t.Fatalf("later job arguments = %q, want only frozen safe path", safeArguments)
	}
	for _, forbidden := range []string{"hostile-later.ran", "pre-hook.ran", "post-hook.ran"} {
		if _, err := os.Lstat(filepath.Join(root, forbidden)); !os.IsNotExist(err) {
			t.Fatalf("unvalidated package script executed via %s: %v", forbidden, err)
		}
	}
}

const (
	coreCommand = "node --test --experimental-test-isolation=none --test-concurrency=1 " +
		"experiments/workstation/*.test.mjs experiments/workstation/lib/*.test.mjs"
	fixtureCommand = "node --test --experimental-test-isolation=none " +
		"experiments/workstation/fixture-007/*.test.mjs"
)

func workstationInventoryFixture(t *testing.T) (string, []job) {
	t.Helper()
	root := t.TempDir()
	for _, directory := range []string{
		filepath.Join(root, "experiments", "workstation", "lib"),
		filepath.Join(root, "experiments", "workstation", "fixture-007"),
		filepath.Join(root, "experiments", "workstation", "manifests"),
	} {
		if err := os.MkdirAll(directory, 0o700); err != nil {
			t.Fatal(err)
		}
	}
	for _, relative := range []string{
		"experiments/workstation/core.test.mjs",
		"experiments/workstation/lib/helper.test.mjs",
		"experiments/workstation/fixture-007/runner.test.mjs",
	} {
		if err := os.WriteFile(filepath.Join(root, filepath.FromSlash(relative)), []byte("export {};\n"), 0o600); err != nil {
			t.Fatal(err)
		}
	}
	writeInventoryPackage(t, root, coreCommand, fixtureCommand)
	writeInventoryManifest(t, root, []string{"experiments/workstation/fixture-007/runner.test.mjs"})
	return root, []job{
		{artifact: "core", script: "test:workstation:core"},
		{artifact: "fixture-007", script: "test:workstation:fixture-007"},
	}
}

func frozenMutationFixture(t *testing.T) (string, []job, []byte) {
	t.Helper()
	root := t.TempDir()
	for _, directory := range []string{
		filepath.Join(root, "experiments", "workstation", "fixture-007"),
		filepath.Join(root, "experiments", "workstation", "manifests"),
	} {
		if err := os.MkdirAll(directory, 0o700); err != nil {
			t.Fatal(err)
		}
	}
	for _, relative := range []string{
		"experiments/workstation/mutation-gate.test.mjs",
		"experiments/workstation/fixture-007/safe-later.test.mjs",
	} {
		if err := os.WriteFile(filepath.Join(root, filepath.FromSlash(relative)), []byte("export {};\n"), 0o600); err != nil {
			t.Fatal(err)
		}
	}
	document := map[string]any{"scripts": map[string]string{
		"test:workstation":                 workstationAggregateCommand,
		"test:workstation:core":            "node --test --experimental-test-isolation=none experiments/workstation/mutation-gate.test.mjs",
		"test:workstation:fixture-007":     "node --test --experimental-test-isolation=none experiments/workstation/fixture-007/safe-later.test.mjs",
		"pretest:workstation:fixture-007":  "node experiments/workstation/pre-hook.mjs",
		"posttest:workstation:fixture-007": "node experiments/workstation/post-hook.mjs",
	}}
	writeInventoryJSON(t, filepath.Join(root, "package.json"), document)
	writeInventoryManifest(t, root, []string{"experiments/workstation/fixture-007/safe-later.test.mjs"})
	original, err := os.ReadFile(filepath.Join(root, "package.json"))
	if err != nil {
		t.Fatal(err)
	}
	return root, []job{
		{artifact: "core", script: "test:workstation:core"},
		{artifact: "fixture-007", script: "test:workstation:fixture-007"},
	}, original
}

func runFrozenNodeHelper(arguments []string) error {
	joined := strings.Join(arguments, " ")
	switch {
	case strings.Contains(joined, "mutation-gate.test.mjs"):
		return mutatePackageDuringFrozenRun()
	case strings.Contains(joined, "safe-later.test.mjs"):
		if err := waitForHelperFile("package.mutated"); err != nil {
			return err
		}
		body, err := os.ReadFile("package.json")
		if err != nil {
			return err
		}
		if !strings.Contains(string(body), "hostile-later.test.mjs") {
			return errors.New("later job did not overlap the hostile package mutation")
		}
		return os.WriteFile("safe-later.ran", []byte(joined+"\n"), 0o600)
	case strings.Contains(joined, "hostile-later.test.mjs"):
		return os.WriteFile("hostile-later.ran", []byte("executed\n"), 0o600)
	case strings.Contains(joined, "pre-hook.mjs"):
		return os.WriteFile("pre-hook.ran", []byte("executed\n"), 0o600)
	case strings.Contains(joined, "post-hook.mjs"):
		return os.WriteFile("post-hook.ran", []byte("executed\n"), 0o600)
	default:
		return fmt.Errorf("unexpected frozen Node helper arguments: %q", arguments)
	}
}

func mutatePackageDuringFrozenRun() error {
	original, err := os.ReadFile("package.json")
	if err != nil {
		return err
	}
	hostile := []byte(`{"scripts":{"test:workstation:fixture-007":"node --test --experimental-test-isolation=none experiments/workstation/fixture-007/hostile-later.test.mjs","pretest:workstation:fixture-007":"node experiments/workstation/pre-hook.mjs","posttest:workstation:fixture-007":"node experiments/workstation/post-hook.mjs"}}` + "\n")
	if err := os.WriteFile("package.json", hostile, 0o600); err != nil {
		return err
	}
	if err := os.WriteFile("package.mutated", []byte("ready\n"), 0o600); err != nil {
		return errors.Join(err, os.WriteFile("package.json", original, 0o600))
	}
	waitErr := waitForHelperFile("safe-later.ran")
	restoreErr := os.WriteFile("package.json", original, 0o600)
	return errors.Join(waitErr, restoreErr)
}

func waitForHelperFile(filename string) error {
	deadline := time.Now().Add(5 * time.Second)
	for time.Now().Before(deadline) {
		if _, err := os.Lstat(filename); err == nil {
			return nil
		} else if !os.IsNotExist(err) {
			return err
		}
		time.Sleep(5 * time.Millisecond)
	}
	return fmt.Errorf("timed out waiting for %s", filename)
}

func writeInventoryPackage(t *testing.T, root, core, fixture string) {
	t.Helper()
	document := map[string]any{"scripts": map[string]string{
		"test":                         "npm run validate:workstation && npm run test:workstation",
		"test:workstation":             workstationAggregateCommand,
		"test:workstation:core":        core,
		"test:workstation:fixture-007": fixture,
	}}
	writeInventoryJSON(t, filepath.Join(root, "package.json"), document)
}

func writeInventoryManifest(t *testing.T, root string, fullTests []string) {
	t.Helper()
	document := map[string]any{
		"artifact":       "fixture-007",
		"implementation": map[string]any{"full_tests": fullTests},
	}
	writeInventoryJSON(
		t,
		filepath.Join(root, "experiments", "workstation", "manifests", "fixture-007.json"),
		document,
	)
}

func writeInventoryJSON(t *testing.T, filename string, document any) {
	t.Helper()
	body, err := json.Marshal(document)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filename, append(body, '\n'), 0o600); err != nil {
		t.Fatal(err)
	}
}

func TestWorkstationPatternCoversOnlyOneDirectoryLevel(t *testing.T) {
	t.Parallel()
	pattern := "experiments/workstation/fixture-007/*.test.mjs"
	if !workstationPatternCovers(pattern, "experiments/workstation/fixture-007/runner.test.mjs") {
		t.Fatal("direct test did not match")
	}
	for _, testPath := range []string{
		"experiments/workstation/fixture-007/nested/runner.test.mjs",
		"experiments/workstation/fixture-007/runner.mjs",
		strings.TrimSuffix(pattern, "*.test.mjs"),
	} {
		if workstationPatternCovers(pattern, testPath) {
			t.Fatalf("pattern unexpectedly covered %q", testPath)
		}
	}
}

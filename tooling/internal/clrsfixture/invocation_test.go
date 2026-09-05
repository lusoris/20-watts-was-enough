package clrsfixture

import (
	"bytes"
	"context"
	"errors"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
)

func TestPrepareGeneratorInvocationTrackedDeterministic(t *testing.T) {
	root := copyGeneratorFoundation(t)
	before := invocationAuthoritySnapshot(t, root)
	first, err := PrepareGeneratorInvocation(context.Background(), root)
	if err != nil {
		t.Fatal(err)
	}
	second, err := PrepareGeneratorInvocation(context.Background(), root)
	if err != nil || !reflect.DeepEqual(first, second) {
		t.Fatalf("non-deterministic invocation: %v", err)
	}
	if first.Authority != ResultAuthority || first.SourceID.String() != contractSourceIdentity(t) || first.ContractID.String() != expectedContractIdentity ||
		first.PythonExecutable != "/opt/venv/bin/python" || first.OutputDirectory != "/output/dataset" || first.ExpectedExamples != 48 ||
		first.Program == "" || len(first.Program) > maximumInvocationProgramBytes || first.ProgramSHA256 != rawSHA256([]byte(first.Program)) {
		t.Fatalf("wrong prepared invocation: %+v", first)
	}
	expected := []string{"shakedown/bellman_ford.json", "shakedown/binary_search.json", "shakedown/insertion_sort.json", "shakedown/kmp_matcher.json", "shakedown/matrix_chain_order.json", "shakedown/segments_intersect.json"}
	if !reflect.DeepEqual(first.ExpectedPaths, expected) || !reflect.DeepEqual(first.PythonArguments(), []string{"-B", "-c", first.Program}) {
		t.Fatal("wrong expected output paths or Python arguments")
	}
	arguments := first.PythonArguments()
	arguments[0], arguments[2] = "changed", "changed"
	first.ExpectedPaths[0] = "changed"
	third, err := PrepareGeneratorInvocation(context.Background(), root)
	if err != nil || !reflect.DeepEqual(second, third) || !reflect.DeepEqual(first.PythonArguments(), second.PythonArguments()) {
		t.Fatalf("caller mutation escaped prepared result: %v", err)
	}
	if !reflect.DeepEqual(before, invocationAuthoritySnapshot(t, root)) {
		t.Fatal("preparation changed an authority file")
	}
	t.Logf("program SHA256=%s bytes=%d", second.ProgramSHA256, len(second.Program))
}

func TestPrepareGeneratorInvocationPreservesTestedWrapperFlow(t *testing.T) {
	value, err := PrepareGeneratorInvocation(context.Background(), trackedRepositoryRoot(t))
	if err != nil {
		t.Fatal(err)
	}
	program := value.Program
	ordered := []string{
		"check_source()\nfrom absl import app, flags",
		"from ml_collections import config_dict",
		"from clrs._src.clrs_text import generate_clrs_text as generator",
		"mapping = {\n",
		` "insertion_sort": [10, 8, 32],`,
		` "binary_search": [10, 8, 32],`,
		` "matrix_chain_order": [10, 8, 11],`,
		` "bellman_ford": [10, 8, 32],`,
		` "kmp_matcher": [10, 8, 32],`,
		` "segments_intersect": [4],`,
		"flags.FLAGS.set_default('algos_and_lengths', config_dict.ConfigDict(mapping, sort_keys=False))",
		"def checked_main(argv):",
		" assert len(argv) == 1",
		" assert flags.FLAGS.algos_and_lengths.to_dict() == mapping",
		" assert list(flags.FLAGS.algos_and_lengths) == list(mapping)",
		` assert flags.FLAGS.split_name == "shakedown"`,
		" assert flags.FLAGS.number_of_samples == 1",
		` assert flags.FLAGS.path_to_save == "/output/dataset"`,
		` assert flags.FLAGS.seeds == ["3", "14", "35"]`,
		" assert flags.FLAGS.use_hints is False",
		" assert flags.FLAGS.num_decimals_in_float == 6",
		` assert not os.path.lexists("/output/dataset")`,
		" generator.main(argv)\n check_source()\n print('CLRS_FIXED_GENERATION_COMPLETE_NO_RESULT')",
		`app.run(checked_main, argv=["clrs-bounded-shakedown", "--split_name=shakedown", "--number_of_samples=1", "--path_to_save=/output/dataset", "--seeds=3,14,35", "--use_hints=false", "--num_decimals_in_float=6"])`,
	}
	previous := 0
	for _, part := range ordered {
		position := strings.Index(program[previous:], part)
		if position < 0 {
			t.Fatalf("missing/out-of-order tested statement %q", part)
		}
		previous += position + len(part)
	}
	for _, guard := range []string{
		"if sys.flags.optimize:\n raise RuntimeError(", "sys.version_info[:3] == (3, 13, 15)",
		`os.getuid() == 65532 and os.getgid() == 65532 and os.getcwd() == "/work"`,
		`source = pathlib.Path("/opt/clrs/clrs/_src/clrs_text/generate_clrs_text.py")`,
		"assert str(source.resolve(strict=True)) == str(source)", "body = stream.read(65537)",
		`assert 0 < len(body) <= 65536 and hashlib.sha256(body).hexdigest() == "` + expectedGeneratorSHA256 + `"`,
		"assert pathlib.Path(generator.__file__).resolve(strict=True) == source",
	} {
		if !strings.Contains(program, guard) {
			t.Fatalf("missing source/runtime guard %q", guard)
		}
	}
	for _, forbidden := range []string{"14422", "14423", "TF_ENABLE_ONEDNN_OPTS", "shutil.rmtree", "subprocess", "os.system", "--path_to_save=/output\"", "--algos_and_lengths="} {
		if strings.Contains(program, forbidden) {
			t.Fatalf("unexpected wrapper behaviour %q", forbidden)
		}
	}
}

func TestPrepareGeneratorInvocationRejectsAuthorityDrift(t *testing.T) {
	for name, test := range map[string]struct{ file, before, after string }{
		"source hash":       {trackedSourcePath, expectedGeneratorSHA256, strings.Repeat("a", 64)},
		"source injection":  {trackedSourcePath, upstreamGeneratorPath, "clrs/_src/generator;bad.py"},
		"source traversal":  {trackedSourcePath, upstreamGeneratorPath, "../generate.py"},
		"hints":             {trackedGenerationPath, `"use_hints": false`, `"use_hints": true`},
		"seed":              {trackedGenerationPath, "[3, 14, 35]", "[3, 14, 36]"},
		"size":              {trackedGenerationPath, `"requested_length": 32`, `"requested_length": 33`},
		"split":             {trackedGenerationPath, `"shakedown"`, `"train"`},
		"samples":           {trackedGenerationPath, `"samples_per_cell": 1`, `"samples_per_cell": 2`},
		"precision":         {trackedGenerationPath, `"num_decimals_in_float": 6`, `"num_decimals_in_float": 5`},
		"task injection":    {trackedGenerationPath, `"insertion_sort"`, `"insertion_sort\nexit()"`},
		"output bound":      {trackedGenerationPath, `"expected_examples": 48`, `"expected_examples": 49`},
		"mount root":        {trackedImageContractPath, `"output_root": "/output"`, `"output_root": "/"`},
		"workdir injection": {trackedImageContractPath, `"working_directory": "/work"`, `"working_directory": "/work\";exit()"`},
		"entrypoint":        {trackedImageContractPath, `"/opt/venv/bin/python"`, `"/bin/sh"`},
		"Python":            {trackedLockInputPath, `"version": "3.13.15"`, `"version": "3.14.7"`},
	} {
		t.Run(name, func(t *testing.T) {
			root := copyGeneratorFoundation(t)
			file := filepath.Join(root, test.file)
			body, err := os.ReadFile(file)
			if err != nil {
				t.Fatal(err)
			}
			if !bytes.Contains(body, []byte(test.before)) {
				t.Fatalf("test mutation missing %q", test.before)
			}
			body = bytes.Replace(body, []byte(test.before), []byte(test.after), 1)
			if err := os.WriteFile(file, body, 0o600); err != nil {
				t.Fatal(err)
			}
			value, err := PrepareGeneratorInvocation(context.Background(), root)
			assertInvocationFailure(t, value, err)
		})
	}
}

func TestPrepareGeneratorInvocationPathsBoundsAndRecheck(t *testing.T) {
	for _, mode := range []string{"symlink", "symlink-root", "missing", "oversized", "extra-json", "duplicate", "late-whitespace-drift", "cancel", "callback-error"} {
		t.Run(mode, func(t *testing.T) {
			root := copyGeneratorFoundation(t)
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			file := filepath.Join(root, trackedGenerationPath)
			body, err := os.ReadFile(file)
			if err != nil {
				t.Fatal(err)
			}
			var interlock func() error
			switch mode {
			case "symlink", "missing":
				if err := os.Remove(file); err != nil {
					t.Fatal(err)
				}
				if mode == "symlink" {
					if err := os.Symlink(filepath.Join(trackedRepositoryRoot(t), trackedGenerationPath), file); err != nil {
						t.Fatal(err)
					}
				}
			case "symlink-root":
				link := filepath.Join(t.TempDir(), "root")
				if err := os.Symlink(root, link); err != nil {
					t.Fatal(err)
				}
				root = link
			case "oversized":
				body = bytes.Repeat([]byte{' '}, maximumGenerationContractBytes+1)
			case "extra-json":
				body = append(body, []byte("{}")...)
			case "duplicate":
				body = bytes.Replace(body, []byte(`"schema_version": 1`), []byte(`"schema_version": 1, "schema_version": 1`), 1)
			case "late-whitespace-drift":
				interlock = func() error { return os.WriteFile(file, append(body, '\n'), 0o600) }
			case "cancel":
				interlock = func() error { cancel(); return nil }
			case "callback-error":
				interlock = func() error { return errors.New("test interlock failure") }
			}
			if mode == "oversized" || mode == "extra-json" || mode == "duplicate" {
				if err := os.WriteFile(file, body, 0o600); err != nil {
					t.Fatal(err)
				}
			}
			value, err := prepareGeneratorInvocation(ctx, root, interlock)
			assertInvocationFailure(t, value, err)
			if mode == "cancel" && !errors.Is(err, context.Canceled) {
				t.Fatalf("lost cancellation cause: %v", err)
			}
		})
	}
	value, err := PrepareGeneratorInvocation(nil, trackedRepositoryRoot(t))
	assertInvocationFailure(t, value, err)
	value, err = PrepareGeneratorInvocation(context.Background(), "")
	assertInvocationFailure(t, value, err)
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	value, err = PrepareGeneratorInvocation(ctx, trackedRepositoryRoot(t))
	assertInvocationFailure(t, value, err)
	if !errors.Is(err, context.Canceled) {
		t.Fatalf("lost early cancellation: %v", err)
	}
}

func TestInvocationRenderingIdentifierQuoteAndPlanBounds(t *testing.T) {
	for _, value := range []string{"clrs._src.clrs_text.generate_clrs_text", "a._b.c1"} {
		if !invocationPythonModule(value) {
			t.Fatalf("rejected module %q", value)
		}
	}
	for _, value := range []string{"", ".clrs", "clrs.", "clrs..test", "clrs/../test", "clrs.2test", "clrs.test;exit()", "clrs.tést", "clrs.test\n", strings.Repeat("a", 257)} {
		if invocationPythonModule(value) {
			t.Fatalf("accepted module injection %q", value)
		}
	}
	for input, expected := range map[string]string{"plain": `"plain"`, "a\"\\\n": `"a\"\\\n"`, "é": `"\u00e9"`, "\x00": `"\x00"`, "');exit()#": `"');exit()#"`} {
		if got := invocationPythonString(input); got != expected {
			t.Fatalf("quote(%q)=%q, want %q", input, got, expected)
		}
	}
	for _, value := range []string{"3.13", "3.13.15.0", "3.13.015", "3.13.-1", "3.13.1000", "3.13.15;exit()", "3.13.15\n"} {
		if _, err := invocationPythonVersion(value); err == nil {
			t.Fatalf("accepted version %q", value)
		}
	}
	if value, err := invocationPythonVersion("3.13.15"); err != nil || value != "3, 13, 15" {
		t.Fatalf("version tuple: %q, %v", value, err)
	}
	inputs, err := loadInvocationInputs(context.Background(), trackedRepositoryRoot(t))
	if err != nil {
		t.Fatal(err)
	}
	inputs.plan.Seeds[0] = 99
	if _, err := renderGeneratorProgram(inputs); err == nil {
		t.Fatal("accepted caller-mutated plan")
	}
	inputs, err = loadInvocationInputs(context.Background(), trackedRepositoryRoot(t))
	if err != nil {
		t.Fatal(err)
	}
	inputs.image.Runtime.WorkingDirectory = strings.Repeat("a", maximumInvocationProgramBytes)
	if _, err := renderGeneratorProgram(inputs); err == nil {
		t.Fatal("accepted oversized rendered program")
	}
	if invocationPythonBool(true) != "True" || invocationPythonBool(false) != "False" {
		t.Fatal("Python bool spelling")
	}
}

func invocationAuthoritySnapshot(t *testing.T, root string) map[string]string {
	t.Helper()
	result := make(map[string]string)
	for _, name := range []string{trackedSourcePath, trackedGenerationPath, trackedLockInputPath, trackedImageContractPath,
		trackedGeneratorProjectPath, trackedGeneratorDependencyLockPath, trackedGeneratorWheelhousePath, promiseLicensePath, "tooling/pdf-renderer/lock.json"} {
		body, err := os.ReadFile(filepath.Join(root, name))
		if err != nil {
			t.Fatal(err)
		}
		result[name] = rawSHA256(body)
	}
	return result
}

func assertInvocationFailure(t *testing.T, value GeneratorInvocation, err error) {
	t.Helper()
	if err == nil || !reflect.DeepEqual(value, GeneratorInvocation{}) {
		t.Fatalf("accepted failure or retained prepared output: %+v / %v", value, err)
	}
}

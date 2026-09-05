package clrsfixture

import (
	"archive/tar"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestGenerationRunCancellationKeepsReservedOwnedCleanup(t *testing.T) {
	options, inputs, archive := generationRunFixture(t)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	fake := &generationFake{t: t, inputs: inputs, tar: archive}
	fake.interlock = func(index int, _ []string, _ *generationCommandEvidence) {
		if index == 9 {
			cancel()
		}
	}
	report, err := runGeneratorFixtures(ctx, options, fake.execute)
	if !errors.Is(err, context.Canceled) || report.State != "failed" || !report.CleanupVerified || fake.exists {
		t.Fatalf("cancellation lost cleanup: %#v %v", report, err)
	}
	runner := &generationRunner{execute: fake.execute, name: fake.name, id: fake.id, inputs: inputs, attempted: true, workCalls: 17}
	fake.exists, fake.running = true, true
	if _, err := runner.control(context.Background(), false, "version"); err == nil {
		t.Fatal("work budget was not enforced")
	}
	if err := runner.cleanup(); err != nil || fake.exists || runner.cleanupCalls != 6 {
		t.Fatalf("work exhaustion consumed reserved cleanup: %v", err)
	}
	if _, err := runner.control(context.Background(), true, "version"); err != nil {
		t.Fatal(err)
	}
	if _, err := runner.control(context.Background(), true, "version"); err == nil {
		t.Fatal("cleanup budget was not enforced")
	}
}

func TestGenerationRunNeverRemovesForeignOwner(t *testing.T) {
	options, inputs, archive := generationRunFixture(t)
	fake := &generationFake{t: t, inputs: inputs, tar: archive}
	fake.interlock = func(_ int, args []string, record *generationCommandEvidence) {
		if len(args) > 1 && args[0] == "container" && args[1] == "inspect" {
			var value map[string]any
			if err := json.Unmarshal(record.Stdout, &value); err != nil {
				t.Fatal(err)
			}
			value["Config"].(map[string]any)["Labels"].(map[string]any)[generationOwnerLabel] = "foreign"
			record.Stdout = generationImageJSON(t, value)
		}
	}
	report, err := runGeneratorFixtures(context.Background(), options, fake.execute)
	if err == nil || report.CleanupVerified || !fake.exists {
		t.Fatalf("foreign owner not preserved: %#v %v", report, err)
	}
	for _, args := range fake.calls {
		if len(args) > 1 && (args[1] == "stop" || args[1] == "rm") {
			t.Fatal("foreign container mutated")
		}
	}
}

func TestGenerationRunRejectsInvalidOrSymlinkedOutputBeforeCommands(t *testing.T) {
	options, inputs, archive := generationRunFixture(t)
	fake := &generationFake{t: t, inputs: inputs, tar: archive}
	parent := filepath.Dir(options.OutputDirectory)
	if err := os.Symlink(parent, filepath.Join(parent, "alias")); err != nil {
		t.Fatal(err)
	}
	options.OutputDirectory = filepath.Join(parent, "alias", "run")
	if _, err := runGeneratorFixtures(context.Background(), options, fake.execute); err == nil || len(fake.calls) != 0 {
		t.Fatal("symlink output parent accepted")
	}
	options.OutputDirectory = options.RepositoryRoot
	if _, err := runGeneratorFixtures(context.Background(), options, fake.execute); err == nil || len(fake.calls) != 0 {
		t.Fatal("source overwrite accepted")
	}
}

func TestGenerationInspectionRejectsClaimedNullsAliasesAndRuntimeDrift(t *testing.T) {
	_, inputs, archive := generationRunFixture(t)
	fake := &generationFake{t: t, inputs: inputs, tar: archive, name: "clrs20w-generation-abcdefghijklmnop", id: strings.Repeat("a", 64), running: true}
	mutations := map[string]func(map[string]any){
		"running-null":      func(v map[string]any) { v["State"].(map[string]any)["Running"] = nil },
		"running-missing":   func(v map[string]any) { delete(v["State"].(map[string]any), "Running") },
		"state-alias":       func(v map[string]any) { v["state"] = v["State"] },
		"host-alias":        func(v map[string]any) { v["hostconfig"] = v["HostConfig"] },
		"privileged-null":   func(v map[string]any) { v["HostConfig"].(map[string]any)["Privileged"] = nil },
		"privileged":        func(v map[string]any) { v["HostConfig"].(map[string]any)["Privileged"] = true },
		"writable":          func(v map[string]any) { v["HostConfig"].(map[string]any)["ReadonlyRootfs"] = false },
		"swap":              func(v map[string]any) { v["HostConfig"].(map[string]any)["MemorySwap"] = 8589934592 },
		"cpu":               func(v map[string]any) { v["HostConfig"].(map[string]any)["NanoCpus"] = 2000000000 },
		"pids":              func(v map[string]any) { v["HostConfig"].(map[string]any)["PidsLimit"] = 512 },
		"network":           func(v map[string]any) { v["HostConfig"].(map[string]any)["NetworkMode"] = "host" },
		"runtime":           func(v map[string]any) { v["HostConfig"].(map[string]any)["Runtime"] = "nvidia" },
		"mount":             func(v map[string]any) { v["Mounts"] = []any{map[string]any{"Source": "/var/run/docker.sock"}} },
		"gpu":               func(v map[string]any) { v["HostConfig"].(map[string]any)["DeviceRequests"] = []any{map[string]any{}} },
		"cap-add":           func(v map[string]any) { v["HostConfig"].(map[string]any)["CapAdd"] = []string{"SYS_ADMIN"} },
		"stop-timeout-null": func(v map[string]any) { v["Config"].(map[string]any)["StopTimeout"] = nil },
		"user":              func(v map[string]any) { v["Config"].(map[string]any)["User"] = "0:0" },
		"command":           func(v map[string]any) { v["Config"].(map[string]any)["Cmd"] = []string{"-c", "pass"} },
		"environment":       func(v map[string]any) { v["Config"].(map[string]any)["Env"] = []string{"TF_ENABLE_ONEDNN_OPTS=0"} },
		"healthcheck": func(v map[string]any) {
			v["Config"].(map[string]any)["Healthcheck"] = map[string]any{"Test": []string{"NONE"}}
		},
	}
	for name, mutate := range mutations {
		t.Run(name, func(t *testing.T) {
			var value map[string]any
			if err := json.Unmarshal(generationDockerTestJSON(t, fake.inspection()), &value); err != nil {
				t.Fatal(err)
			}
			mutate(value)
			parsed, err := parseGenerationContainerInspection(generationImageJSON(t, value), true)
			if err == nil {
				err = validateGenerationContainer(parsed, inputs, fake.name, true)
			}
			if err == nil {
				t.Fatal("tampered runtime accepted")
			}
		})
	}
}

func TestGenerationTarRejectsUnsafeMembersAndFraming(t *testing.T) {
	_, inputs, valid := generationRunFixture(t)
	for name, change := range map[string]func(*tar.Header, *[]byte){
		"path": func(h *tar.Header, _ *[]byte) { h.Name = "../escape" },
		"mode": func(h *tar.Header, _ *[]byte) { h.Mode = 0o777 },
		"uid":  func(h *tar.Header, _ *[]byte) { h.Uid = 0 },
		"gid":  func(h *tar.Header, _ *[]byte) { h.Gid = 0 },
		"time": func(h *tar.Header, _ *[]byte) { h.ModTime = h.ModTime.Add(time.Second) },
		"symlink": func(h *tar.Header, b *[]byte) {
			h.Typeflag = tar.TypeSymlink
			h.Linkname = "/etc/passwd"
			h.Size = 0
			*b = nil
		},
		"empty": func(h *tar.Header, b *[]byte) { h.Size = 0; *b = nil },
		"oversize": func(h *tar.Header, b *[]byte) {
			*b = make([]byte, inputs.authority.plan.Output.MaxDatasetBytes+1)
			h.Size = int64(len(*b))
		},
	} {
		t.Run(name, func(t *testing.T) {
			body := generationTestTar(t, inputs, change)
			if err := visitGenerationTar(context.Background(), body, inputs, func(string, []byte) error { return nil }); err == nil {
				t.Fatal("unsafe tar accepted")
			}
		})
	}
	for name, body := range map[string][]byte{
		"no-endblocks": valid[:len(valid)-1024], "one-endblock": valid[:len(valid)-512], "unaligned": valid[:len(valid)-1],
		"nonzero-tail": append(bytes.Clone(valid), bytes.Repeat([]byte{1}, 512)...), "excess-padding": append(bytes.Clone(valid), make([]byte, 10752)...),
	} {
		t.Run(name, func(t *testing.T) {
			if err := visitGenerationTar(context.Background(), body, inputs, func(string, []byte) error { return nil }); err == nil {
				t.Fatal("malformed tar framing accepted")
			}
		})
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if err := visitGenerationTar(ctx, valid, inputs, func(string, []byte) error { return nil }); !errors.Is(err, context.Canceled) {
		t.Fatal(err)
	}
}

func TestGenerationRunExactMarkerAndStreamFailures(t *testing.T) {
	for _, kind := range []string{"extra-marker", "reader-stderr", "stream-captured", "changed-tar"} {
		t.Run(kind, func(t *testing.T) {
			options, inputs, archive := generationRunFixture(t)
			fake := &generationFake{t: t, inputs: inputs, tar: archive}
			fake.interlock = func(index int, _ []string, record *generationCommandEvidence) {
				switch {
				case kind == "extra-marker" && index == 9:
					record.Stdout = append(record.Stdout, '\n')
				case kind == "reader-stderr" && index == 12:
					record.Stderr = []byte("warning")
				case kind == "stream-captured" && index == 12:
					record.Stdout = []byte("unexpected")
				case kind == "changed-tar" && index == 13:
					file, err := os.OpenFile(filepath.Join(options.OutputDirectory, "output.tar"), os.O_WRONLY, 0)
					if err != nil {
						t.Fatal(err)
					}
					_, err = file.WriteAt([]byte("!"), 0)
					if err != nil {
						t.Fatal(err)
					}
					if err = file.Close(); err != nil {
						t.Fatal(err)
					}
				}
			}
			report, err := runGeneratorFixtures(context.Background(), options, fake.execute)
			if err == nil || report.State != "failed" || !report.CleanupVerified || fake.exists {
				t.Fatalf("invalid output accepted or cleanup lost: %v", err)
			}
		})
	}
}

func TestGenerationDockerInfoUsesExactObservedDockerKeys(t *testing.T) {
	// Docker 29.7.2 emits CpuCfsPeriod/CpuCfsQuota, not the old Go field spelling.
	valid := map[string]any{"OSType": "linux", "CgroupVersion": "2", "MemoryLimit": true, "SwapLimit": true,
		"CpuCfsPeriod": true, "CpuCfsQuota": true, "PidsLimit": true, "Runtimes": map[string]any{"runc": map[string]any{}}}
	if err := validateGenerationDockerInfo(generationImageJSON(t, valid)); err != nil {
		t.Fatal(err)
	}
	for _, value := range []any{nil, false, "true"} {
		valid["CpuCfsPeriod"] = value
		if err := validateGenerationDockerInfo(generationImageJSON(t, valid)); err == nil {
			t.Fatal("invalid capability accepted")
		}
	}
	valid["CpuCfsPeriod"], valid["CPUCfsPeriod"] = true, true
	if err := validateGenerationDockerInfo(generationImageJSON(t, valid)); err == nil {
		t.Fatal("case-aliased capability accepted")
	}
	delete(valid, "CpuCfsPeriod")
	if err := validateGenerationDockerInfo(generationImageJSON(t, valid)); err == nil {
		t.Fatal("wrong exact key accepted")
	}
}

func TestGenerationRunRejectsRetainedFileMutationDuringCleanup(t *testing.T) {
	for _, target := range []string{"dataset/shakedown/bellman_ford.json", "output.tar", "inputs/generation.py", "run-start.json"} {
		t.Run(target, func(t *testing.T) {
			options, inputs, archive := generationRunFixture(t)
			fake := &generationFake{t: t, inputs: inputs, tar: archive}
			fake.interlock = func(_ int, args []string, _ *generationCommandEvidence) {
				if len(args) > 1 && args[1] == "stop" {
					if err := os.WriteFile(filepath.Join(options.OutputDirectory, target), []byte("changed during cleanup"), 0o600); err != nil {
						t.Fatal(err)
					}
				}
			}
			report, err := runGeneratorFixtures(context.Background(), options, fake.execute)
			if err == nil || report.State != "failed" || !report.CleanupVerified || fake.exists {
				t.Fatalf("retained cleanup mutation was published as success: state=%s cleanup=%v error=%v", report.State, report.CleanupVerified, err != nil)
			}
		})
	}
}

func TestGenerationRunLongErrorStillPersistsSerializableFailure(t *testing.T) {
	options, _, _ := generationRunFixture(t)
	execute := func(context.Context, []string, io.Writer, int64) (generationCommandEvidence, error) {
		return generationCommandEvidence{ExitCode: -1}, errors.New(strings.Repeat("failure", 1000))
	}
	report, err := runGeneratorFixtures(context.Background(), options, execute)
	if err == nil || report.State != "failed" || len(report.Error) > 4096 {
		t.Fatalf("long error broke bounded report: %d bytes, state=%s", len(report.Error), report.State)
	}
	if _, err := MarshalGeneratorFixtureRun(report); err != nil {
		t.Fatal(err)
	}
	body, err := os.ReadFile(filepath.Join(options.OutputDirectory, "receipt.json"))
	if err != nil {
		t.Fatal(err)
	}
	var retained GeneratorFixtureRun
	if err := decodeCanonicalGeneratorJSON(body, 20, &retained); err != nil || retained.State != "failed" {
		t.Fatalf("long-error failure receipt missing: %v", err)
	}
}

func TestGenerationReceiptCancellationAfterPendingWriteCannotPublishSuccess(t *testing.T) {
	options, _, report := generationSuccessfulTestBundle(t)
	root, err := os.OpenRoot(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	defer root.Close()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	failed, err := publishGenerationReceipt(ctx, root, report, cancel)
	if !errors.Is(err, context.Canceled) || failed.State != "failed" {
		t.Fatalf("pending write cancellation returned %s, cancelled=%v", failed.State, errors.Is(err, context.Canceled))
	}
	body, err := os.ReadFile(filepath.Join(root.Name(), "receipt.json"))
	if err != nil {
		t.Fatal(err)
	}
	var retained GeneratorFixtureRun
	if err := decodeCanonicalGeneratorJSON(body, 20, &retained); err != nil || retained.State != "failed" {
		t.Fatalf("cancelled pending receipt was published as success: %v", err)
	}
	if _, err := root.Lstat("receipt.pending.json"); err != nil {
		t.Fatal("failed publication lost its owned partial receipt")
	}
	if _, err := CheckGeneratorFixtureRun(context.Background(), options); err != nil {
		t.Fatal("independent successful test bundle changed")
	}
}

package clrsfixture

import (
	"bytes"
	"context"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/buildinfo"
)

func promiseReceiptFixture(t *testing.T) (promiseInputs, promiseReceipt) {
	t.Helper()
	inputs := promiseLifecycleInputs(t)
	procedure, err := currentPromiseProcedure(trackedRepositoryRoot(t), inputs)
	if err != nil {
		t.Fatal(err)
	}
	inputs.procedure = procedure
	receipt := promiseReceipt{
		SchemaVersion: 1, Authority: ResultAuthority, State: "two-build-byte-match", GeneratorImageState: "blocked",
		WheelhouseSHA256: inputs.manifestSHA256, ImageContractSHA256: inputs.imageContractSHA256, Procedure: procedure,
		Producer: promiseProducer{buildinfo.Current(), strings.Repeat("a", 64), 1024},
	}
	for index, digit := range []string{"1", "2"} {
		prefix := "run-" + digit + "/"
		receipt.Runs = append(receipt.Runs, promiseRunReceipt{
			Index: index + 1, Name: "20w-promise-" + strings.Repeat(digit, 32), ContainerID: strings.Repeat(digit, 64),
			ImageID: "sha256:" + strings.Repeat("a", 64), SourceTarSHA256: promiseCanonicalTarSHA256, SourceTarSizeBytes: promiseCanonicalTarSize,
			CleanupVerified: true, StagingRemoved: true, Wheel: promiseFileIdentity{prefix + promiseWheelFilename, promiseWheelSHA256, promiseWheelSize},
			LicenseSHA256: promiseLicenseSHA256, Log: promiseFileIdentity{prefix + "commands.json", strings.Repeat("a", 64), 100},
		})
	}
	return inputs, receipt
}

func TestPromiseReceiptRejectsAuthorityAndCoverageChanges(t *testing.T) {
	inputs, valid := promiseReceiptFixture(t)
	if err := validatePromiseReceipt(valid, inputs, inputs.procedure); err != nil {
		t.Fatal(err)
	}
	for name, mutate := range map[string]func(*promiseReceipt){
		"version":         func(r *promiseReceipt) { r.SchemaVersion++ },
		"authority":       func(r *promiseReceipt) { r.Authority = "RESULT" },
		"admission":       func(r *promiseReceipt) { r.GeneratorImageState = "admitted" },
		"wheelhouse":      func(r *promiseReceipt) { r.WheelhouseSHA256 = strings.Repeat("0", 64) },
		"procedure":       func(r *promiseReceipt) { r.Procedure.Version = "other" },
		"missing run":     func(r *promiseReceipt) { r.Runs = r.Runs[:1] },
		"same container":  func(r *promiseReceipt) { r.Runs[1].ContainerID = r.Runs[0].ContainerID },
		"same name":       func(r *promiseReceipt) { r.Runs[1].Name = r.Runs[0].Name },
		"cleanup":         func(r *promiseReceipt) { r.Runs[0].CleanupVerified = false },
		"staging":         func(r *promiseReceipt) { r.Runs[0].StagingRemoved = false },
		"source transfer": func(r *promiseReceipt) { r.Runs[0].SourceTarSHA256 = strings.Repeat("0", 64) },
		"license":         func(r *promiseReceipt) { r.Runs[0].LicenseSHA256 = strings.Repeat("0", 64) },
		"wheel":           func(r *promiseReceipt) { r.Runs[0].Wheel.SizeBytes++ },
		"producer":        func(r *promiseReceipt) { r.Producer.ExecutableSHA256 = "" },
	} {
		t.Run(name, func(t *testing.T) {
			candidate := valid
			candidate.Runs = slices.Clone(valid.Runs)
			mutate(&candidate)
			if err := validatePromiseReceipt(candidate, inputs, inputs.procedure); err == nil {
				t.Fatal("accepted changed receipt")
			}
		})
	}
}

func TestPromiseReceiptRejectsMalformedJSONBeforeFiles(t *testing.T) {
	_, receipt := promiseReceiptFixture(t)
	valid, err := marshalPromiseJSON(receipt)
	if err != nil {
		t.Fatal(err)
	}
	for name, body := range map[string][]byte{
		"duplicate":    bytes.Replace(valid, []byte("  \"schema_version\": 1,"), []byte("  \"schema_version\": 1,\n  \"schema_version\": 1,"), 1),
		"unknown":      bytes.Replace(valid, []byte("{\n"), []byte("{\n  \"unknown\": true,\n"), 1),
		"trailing":     append(bytes.Clone(valid), []byte("{}")...),
		"noncanonical": bytes.Replace(valid, []byte("  \"schema_version\""), []byte(" \"schema_version\""), 1),
	} {
		t.Run(name, func(t *testing.T) {
			bundle := t.TempDir()
			if err := os.WriteFile(filepath.Join(bundle, "receipt.json"), body, 0o600); err != nil {
				t.Fatal(err)
			}
			if err := CheckPromiseWheelReproduction(trackedRepositoryRoot(t), bundle); err == nil || !strings.Contains(err.Error(), "parse Promise") {
				t.Fatalf("malformed receipt: %v", err)
			}
		})
	}
}

func TestPromiseReceiptDetectsInvokedHelperSourceDrift(t *testing.T) {
	inputs, receipt := promiseReceiptFixture(t)
	root := copyGeneratorFoundation(t)
	for _, identity := range receipt.Procedure.Sources {
		body, err := os.ReadFile(filepath.Join(trackedRepositoryRoot(t), identity.Path))
		if err != nil {
			t.Fatal(err)
		}
		target := filepath.Join(root, identity.Path)
		if err := os.MkdirAll(filepath.Dir(target), 0o700); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(target, body, 0o600); err != nil {
			t.Fatal(err)
		}
	}
	if err := recheckPromiseAuthority(root, inputs); err != nil {
		t.Fatal(err)
	}
	target := filepath.Join(root, "tooling/internal/clrsfixture/image_files.go")
	file, err := os.OpenFile(target, os.O_APPEND|os.O_WRONLY, 0)
	if err != nil {
		t.Fatal(err)
	}
	_, writeErr := file.WriteString("\n// test source drift\n")
	closeErr := file.Close()
	if writeErr != nil || closeErr != nil {
		t.Fatal(writeErr, closeErr)
	}
	if err := recheckPromiseAuthority(root, inputs); err == nil {
		t.Fatal("accepted helper changed during reproduction")
	}
}

func promiseLogFixture(t *testing.T, inputs promiseInputs, run promiseRunReceipt) []promiseCommandEvidence {
	t.Helper()
	wheels := "/retained/evidence/" + run.Name + "/wheelhouse"
	names := []string{"verify-endpoint", "verify-image", "create", "start", "copy-source", "bootstrap", "install", "build", "read-wheel", "find-owned", "inspect-owner", "remove", "verify-absence"}
	entries := make([]promiseCommandEvidence, 0, len(names))
	for _, name := range names {
		entry := promiseCommandEvidence{Operation: name, StdinSHA256: rawSHA256(nil)}
		if name == "create" {
			entry.Arguments = promiseContainerArguments(inputs, run.Name, wheels)
		}
		arguments, err := expectedPromiseArguments(entry, run, inputs.procedure)
		if err != nil {
			t.Fatal(err)
		}
		entry.Arguments = arguments
		if name == "copy-source" {
			entry.StdinSHA256 = run.SourceTarSHA256
			entry.StdinSizeBytes = run.SourceTarSizeBytes
		}
		entries = append(entries, entry)
	}
	return entries
}

func TestPromiseReceiptRejectsChangedRequestedArguments(t *testing.T) {
	inputs, receipt := promiseReceiptFixture(t)
	for _, operation := range []string{"verify-endpoint", "verify-image", "create", "start", "copy-source", "bootstrap", "install", "build", "read-wheel", "find-owned", "inspect-owner", "remove", "verify-absence"} {
		t.Run(operation, func(t *testing.T) {
			entries := promiseLogFixture(t, inputs, receipt.Runs[0])
			for index := range entries {
				if entries[index].Operation == operation {
					entries[index].Arguments = append(slices.Clone(entries[index].Arguments), "--network=host")
				}
			}
			body, err := marshalPromiseJSON(entries)
			if err != nil {
				t.Fatal(err)
			}
			if err := validatePromiseCommandLog(body, receipt.Runs[0], inputs.procedure); err == nil || !strings.Contains(err.Error(), "argv differs") {
				t.Fatalf("changed %s accepted or wrong error: %v", operation, err)
			}
		})
	}
}

func TestPromiseRetainedInputsExerciseCompleteFakeConsumer(t *testing.T) {
	directory := os.Getenv("CLRS_PROMISE_TEST_INPUTS")
	wheelPath := os.Getenv("CLRS_PROMISE_TEST_WHEEL")
	if directory == "" || wheelPath == "" {
		t.Skip("explicit retained artifact paths not supplied")
	}
	inputs, err := readPromiseInputs(trackedRepositoryRoot(t), directory)
	if err != nil {
		t.Fatal(err)
	}
	wheel, err := os.ReadFile(wheelPath)
	if err != nil {
		t.Fatal(err)
	}
	if err := verifyPromiseWheel(wheel); err != nil {
		t.Fatal(err)
	}
	output := promiseTestTar(t, []promiseTestTarMember{promiseTestFile(promiseWheelFilename, wheel)})
	fake := &promiseFakeDocker{inputs: inputs, output: output}
	bundle := filepath.Join(t.TempDir(), "new-evidence")
	if err := reproducePromiseWheel(context.Background(), trackedRepositoryRoot(t), directory, bundle, fake); err != nil {
		t.Fatal(err)
	}
	if err := CheckPromiseWheelReproduction(trackedRepositoryRoot(t), bundle); err != nil {
		t.Fatal(err)
	}
	if fake.created != 2 || fake.present {
		t.Fatalf("runs=%d present=%v", fake.created, fake.present)
	}
	target := filepath.Join(bundle, "run-2", promiseWheelFilename)
	if err := os.Chmod(target, 0o600); err != nil {
		t.Fatal(err)
	}
	wheel[0] ^= 1
	if err := os.WriteFile(target, wheel, 0o600); err != nil {
		t.Fatal(err)
	}
	if err := CheckPromiseWheelReproduction(trackedRepositoryRoot(t), bundle); err == nil {
		t.Fatal("accepted tampered reproduced wheel")
	}
}

func TestPromiseRetainedFourInputsFailBeforeEffectsWhenTampered(t *testing.T) {
	directory := os.Getenv("CLRS_PROMISE_TEST_INPUTS")
	if directory == "" {
		t.Skip("explicit retained artifact path not supplied")
	}
	inputs := promiseLifecycleInputs(t)
	paths := []string{"source-build-inputs/promise-2.3.tar.gz"}
	for _, wheel := range inputs.manifest.SourceBuild.BuildRequirements {
		paths = append(paths, "build-tools/"+wheel.Filename)
	}
	copyRoot := t.TempDir()
	for _, path := range paths {
		body, err := readGeneratorFile(directory, path, 1<<20)
		if err != nil {
			t.Fatal(err)
		}
		target := filepath.Join(copyRoot, path)
		if err := os.MkdirAll(filepath.Dir(target), 0o700); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(target, body, 0o600); err != nil {
			t.Fatal(err)
		}
	}
	for _, path := range paths {
		t.Run(path, func(t *testing.T) {
			target := filepath.Join(copyRoot, path)
			original, err := os.ReadFile(target)
			if err != nil {
				t.Fatal(err)
			}
			tampered := bytes.Clone(original)
			tampered[0] ^= 1
			if err := os.WriteFile(target, tampered, 0o600); err != nil {
				t.Fatal(err)
			}
			t.Cleanup(func() {
				if err := os.WriteFile(target, original, 0o600); err != nil {
					t.Error(err)
				}
			})
			fake := &promiseFakeDocker{}
			output := filepath.Join(t.TempDir(), "new")
			if err := reproducePromiseWheel(context.Background(), trackedRepositoryRoot(t), copyRoot, output, fake); err == nil {
				t.Fatal("accepted tampered input")
			}
			if len(fake.calls) != 0 {
				t.Fatal("Docker called before complete input verification")
			}
			if _, err := os.Stat(output); !os.IsNotExist(err) {
				t.Fatalf("output created before preflight: %v", err)
			}
		})
	}
}

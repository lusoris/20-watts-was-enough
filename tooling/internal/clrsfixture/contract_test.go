package clrsfixture

import (
	"bytes"
	"os"
	"path/filepath"
	"reflect"
	"runtime"
	"strings"
	"testing"
)

const expectedContractIdentity = "sha256:cc14fce405e8fa7d4719f1fc906e28d5e4b73235085c8f0722795efded2891a8"

func TestTrackedGenerationContractBindsClosedShakedown(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	contract := trackedGenerationContract(t, source)
	identity, err := contract.Identity(source)
	if err != nil {
		t.Fatal(err)
	}
	if identity.String() != expectedContractIdentity {
		t.Fatalf("generation identity = %s, want %s", identity, expectedContractIdentity)
	}
	if contract.Authority != ResultAuthority || contract.Output.ExpectedFiles != 6 || contract.Output.ExpectedExamples != 48 {
		t.Fatalf("generation authority/counts = %q/%d/%d", contract.Authority, contract.Output.ExpectedFiles, contract.Output.ExpectedExamples)
	}
	if got := ShakedownTasks(); !reflect.DeepEqual(got, []TaskKind{
		TaskInsertionSort,
		TaskBinarySearch,
		TaskMatrixChainOrder,
		TaskBellmanFord,
		TaskKMPMatcher,
		TaskSegmentsIntersect,
	}) {
		t.Fatalf("shakedown tasks = %v", got)
	}
}

func TestGenerationPlanIsDeterministicAndDefensive(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	contract := trackedGenerationContract(t, source)
	first, err := contract.Plan(source)
	if err != nil {
		t.Fatal(err)
	}
	second, err := contract.Plan(source)
	if err != nil || !reflect.DeepEqual(first, second) {
		t.Fatalf("same generation contract produced different plans: %v", err)
	}
	if first.Authority != ResultAuthority || first.ContractID.String() != expectedContractIdentity || len(first.Tasks) != 6 {
		t.Fatalf("plan identity = %#v", first)
	}
	if first.GenerationState != generationState {
		t.Fatalf("generation state = %q, want %q", first.GenerationState, generationState)
	}
	expectedExamples := []int{9, 9, 9, 9, 9, 3}
	for index, task := range first.Tasks {
		if task.ExpectedExamples != expectedExamples[index] || task.OutputRelativePath != generationSplit+"/"+string(task.Task)+".json" {
			t.Fatalf("task plan %d = %#v", index, task)
		}
	}
	first.Seeds[0] = 99
	first.Tasks[0].Sizes[0].Role = SizeFixedGeometryControl
	first.Tasks[0].Sizes[0].RequestedLength = 99
	third, err := contract.Plan(source)
	if err != nil || third.Seeds[0] != 3 || third.Tasks[0].Sizes[0] != (SizeSelection{Role: SizePublishedTrain, RequestedLength: 10}) {
		t.Fatalf("caller mutation escaped plan copy: %#v, %v", third, err)
	}
}

func TestParseGenerationContractRejectsScopeDrift(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	valid := string(trackedGenerationContractBytes(t))
	tests := map[string]string{
		"duplicate":            strings.Replace(valid, `"authority": "NO_RESULT"`, `"authority": "NO_RESULT", "authority": "NO_RESULT"`, 1),
		"unknown":              strings.Replace(valid, `"schema_version": 1`, `"schema_version": 1, "extra": true`, 1),
		"trailing":             valid + `{}`,
		"wrong authority":      strings.Replace(valid, `"NO_RESULT"`, `"RESULT"`, 1),
		"wrong source":         strings.Replace(valid, contractSourceIdentity(t), "sha256:"+strings.Repeat("a", 64), 1),
		"unblocked generation": strings.Replace(valid, generationState, "ready", 1),
		"wrong purpose":        strings.Replace(valid, generationPurpose, "benchmark", 1),
		"wrong issue":          strings.Replace(valid, "/issues/12", "/issues/13", 1),
		"wrong split":          strings.Replace(valid, generationSplit, "train", 1),
		"hints enabled":        strings.Replace(valid, `"use_hints": false`, `"use_hints": true`, 1),
		"float drift":          strings.Replace(valid, `"num_decimals_in_float": 6`, `"num_decimals_in_float": 5`, 1),
		"seed drift":           strings.Replace(valid, `[3, 14, 35]`, `[3, 14, 36]`, 1),
		"task order drift":     strings.Replace(valid, `"task": "insertion_sort"`, `"task": "binary_search"`, 1),
		"family drift":         strings.Replace(valid, `"family": "sequence"`, `"family": "graph"`, 1),
		"semantics drift":      strings.Replace(valid, `"length_semantics": "fixed_four_endpoints"`, `"length_semantics": "declared_length"`, 1),
		"size role drift":      strings.Replace(valid, `"published_training_size"`, `"fixed_geometry_control"`, 1),
		"size value drift":     strings.Replace(valid, `"requested_length": 32`, `"requested_length": 31`, 1),
		"example count drift":  strings.Replace(valid, `"expected_examples": 48`, `"expected_examples": 47`, 1),
		"byte bound drift":     strings.Replace(valid, `"max_total_bytes": 25165824`, `"max_total_bytes": 1`, 1),
	}
	for name, body := range tests {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			if _, err := ParseGenerationContract([]byte(body), source); err == nil {
				t.Fatalf("ParseGenerationContract accepted %s", name)
			}
		})
	}
	changedSource := source
	changedSource.InspectedOn = "2026-08-31"
	if _, err := ParseGenerationContract([]byte(valid), changedSource); err == nil {
		t.Fatal("ParseGenerationContract accepted a different valid source identity")
	}
}

func TestReadGenerationContractEnforcesReaderBound(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	oversized := bytes.NewReader(bytes.Repeat([]byte{' '}, maximumGenerationContractBytes+1))
	if _, err := ReadGenerationContract(oversized, source); err == nil || !strings.Contains(err.Error(), "exceeds") {
		t.Fatalf("ReadGenerationContract oversized error = %v", err)
	}
	if _, err := ReadGenerationContract(nil, source); err == nil || !strings.Contains(err.Error(), "nil") {
		t.Fatalf("ReadGenerationContract nil error = %v", err)
	}
	if _, err := ParseGenerationContract([]byte{0xff, '{', '}'}, source); err == nil {
		t.Fatal("ParseGenerationContract accepted invalid UTF-8")
	}
}

func trackedGenerationContract(t *testing.T, source SourceRecord) GenerationContract {
	t.Helper()
	contract, err := ParseGenerationContract(trackedGenerationContractBytes(t), source)
	if err != nil {
		t.Fatalf("parse tracked generation contract: %v", err)
	}
	return contract
}

func trackedGenerationContractBytes(t *testing.T) []byte {
	t.Helper()
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("locate generation contract test")
	}
	body, err := os.ReadFile(filepath.Join(filepath.Dir(filename), "..", "..", "clrs-generator", "contract.json"))
	if err != nil {
		t.Fatalf("read tracked generation contract: %v", err)
	}
	return body
}

func contractSourceIdentity(t *testing.T) string {
	t.Helper()
	id, err := trackedSourceRecord(t).Identity()
	if err != nil {
		t.Fatal(err)
	}
	return id.String()
}

func FuzzParseGenerationContract(f *testing.F) {
	f.Add([]byte(`{"schema_version":1}`))
	f.Add([]byte(`{"authority":"NO_RESULT","authority":"RESULT"}`))
	f.Fuzz(func(t *testing.T, body []byte) {
		if len(body) > maximumGenerationContractBytes+1 {
			return
		}
		_, _ = ParseGenerationContract(body, trackedSourceRecord(t))
	})
}

package clrsfixture

import (
	"bytes"
	"fmt"
	"reflect"
	"strings"
	"testing"
)

func TestImportDatasetSeparatesCandidateFromVerifier(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	left := oneExampleDataset("future_task", "input", "answer-left", 7, 3, false)
	right := oneExampleDataset("future_task", "input", "answer-right", 7, 3, false)
	leftCandidates, leftVerifiers, err := ImportDataset(strings.NewReader(left), source, LengthDeclaredInput, testImportLimits())
	if err != nil {
		t.Fatal(err)
	}
	rightCandidates, rightVerifiers, err := ImportDataset(strings.NewReader(right), source, LengthDeclaredInput, testImportLimits())
	if err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(leftCandidates, rightCandidates) {
		t.Fatal("candidate-visible records changed when only the reference changed")
	}
	if reflect.DeepEqual(leftVerifiers, rightVerifiers) || leftVerifiers.Examples[0].ID == rightVerifiers.Examples[0].ID {
		t.Fatal("verifier-only record did not bind the changed reference")
	}
	changedInput := oneExampleDataset("future_task", "different-input", "answer-left", 7, 3, false)
	changedCandidates, _, err := ImportDataset(strings.NewReader(changedInput), source, LengthDeclaredInput, testImportLimits())
	if err != nil {
		t.Fatal(err)
	}
	if changedCandidates.Examples[0].ID == leftCandidates.Examples[0].ID {
		t.Fatal("candidate identity did not bind candidate-visible input")
	}
	candidateType := reflect.TypeOf(CandidateExample{})
	for index := 0; index < candidateType.NumField(); index++ {
		name := strings.ToLower(candidateType.Field(index).Name)
		if strings.Contains(name, "answer") || strings.Contains(name, "reference") {
			t.Fatalf("candidate-visible type exposes verifier field %q", name)
		}
	}
}

func TestImportDatasetModelsBothLengthSemanticsWithoutTaskRegistry(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	body := oneExampleDataset("unregistered_geometry_probe", "points", "false", 31, 94, true)
	declared, _, err := ImportDataset(strings.NewReader(body), source, LengthDeclaredInput, testImportLimits())
	if err != nil {
		t.Fatal(err)
	}
	fixed, _, err := ImportDataset(strings.NewReader(body), source, LengthFixedFourEndpoints, testImportLimits())
	if err != nil {
		t.Fatal(err)
	}
	if declared.Task != "unregistered_geometry_probe" || declared.Examples[0].EffectiveInputSize != 31 {
		t.Fatalf("declared-length record = %#v", declared.Examples[0])
	}
	if fixed.Examples[0].RequestedLength != 31 || fixed.Examples[0].EffectiveInputSize != 4 {
		t.Fatalf("fixed-endpoint record = %#v", fixed.Examples[0])
	}
	if fixed.Examples[0].LengthSemantics != LengthFixedFourEndpoints || fixed.Authority != ResultAuthority {
		t.Fatalf("fixed-endpoint metadata = %#v", fixed)
	}
	if declared.Examples[0].ID == fixed.Examples[0].ID {
		t.Fatal("candidate identity did not bind length semantics")
	}
}

func TestImportDatasetUsesOrdinalToDistinguishDuplicateSamples(t *testing.T) {
	t.Parallel()
	example := `{"prompt":"task:\ninput","references":["answer"],"auxiliary":{"length":7,"seed":3,"use_hints":false}}`
	body := fmt.Sprintf(`{"name":"clrs_text_task","examples":[%s,%s]}`, example, example)
	candidates, verifiers, err := ImportDataset(
		strings.NewReader(body),
		trackedSourceRecord(t),
		LengthDeclaredInput,
		testImportLimits(),
	)
	if err != nil {
		t.Fatal(err)
	}
	if candidates.Examples[0].Ordinal != 0 || candidates.Examples[1].Ordinal != 1 {
		t.Fatalf("ordinals = %d/%d, want 0/1", candidates.Examples[0].Ordinal, candidates.Examples[1].Ordinal)
	}
	if candidates.Examples[0].ID == candidates.Examples[1].ID || verifiers.Examples[0].ID == verifiers.Examples[1].ID {
		t.Fatal("duplicate samples did not receive distinct deterministic identities")
	}
}

func TestCandidateIdentityBindsVisibleMetadata(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	base := oneExampleDataset("task", "input", "answer", 7, 3, false)
	baseCandidates, _, err := ImportDataset(strings.NewReader(base), source, LengthDeclaredInput, testImportLimits())
	if err != nil {
		t.Fatal(err)
	}
	variations := []string{
		oneExampleDataset("task", "input", "answer", 8, 3, false),
		oneExampleDataset("task", "input", "answer", 7, 4, false),
		oneExampleDataset("task", "input", "answer", 7, 3, true),
	}
	for _, body := range variations {
		candidates, _, importErr := ImportDataset(strings.NewReader(body), source, LengthDeclaredInput, testImportLimits())
		if importErr != nil {
			t.Fatal(importErr)
		}
		if candidates.Examples[0].ID == baseCandidates.Examples[0].ID {
			t.Fatal("candidate identity did not bind visible length, seed, or hints metadata")
		}
	}
}

func TestImportDatasetIsDeterministicAndPreservesExactBytes(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	body := oneExampleDataset("binary_search", "key: [1 2]\nreturn:\n", "1\n\n", 5, -7, false)
	firstCandidates, firstVerifiers, err := ImportDataset(strings.NewReader(body), source, LengthDeclaredInput, testImportLimits())
	if err != nil {
		t.Fatal(err)
	}
	secondCandidates, secondVerifiers, err := ImportDataset(strings.NewReader(body), source, LengthDeclaredInput, testImportLimits())
	if err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(firstCandidates, secondCandidates) || !reflect.DeepEqual(firstVerifiers, secondVerifiers) {
		t.Fatal("same source bytes produced different imports")
	}
	if firstCandidates.Examples[0].Prompt != "binary_search:\nkey: [1 2]\nreturn:\n" || firstVerifiers.Examples[0].Reference != "1\n\n" {
		t.Fatalf("exact text changed: %#v / %#v", firstCandidates.Examples[0], firstVerifiers.Examples[0])
	}
	if firstVerifiers.Examples[0].CandidateID != firstCandidates.Examples[0].ID {
		t.Fatal("verifier does not bind candidate identity")
	}
	if len(firstCandidates.Examples[0].ID.String()) != len("sha256:")+64 || len(firstVerifiers.Examples[0].ID.String()) != len("sha256:")+64 {
		t.Fatal("deterministic identity is not a SHA-256 identity")
	}
}

func TestImportDatasetRejectsMalformedExamples(t *testing.T) {
	t.Parallel()
	valid := oneExampleDataset("task", "input", "answer", 7, 3, false)
	example := `{"prompt":"task:\ninput","references":["answer"],"auxiliary":{"length":7,"seed":3,"use_hints":false}}`
	tests := map[string]string{
		"unknown top level":   strings.Replace(valid, `"name":`, `"unknown":true,"name":`, 1),
		"duplicate field":     strings.Replace(valid, `"name":"clrs_text_task"`, `"name":"clrs_text_task","name":"clrs_text_task"`, 1),
		"trailing":            valid + `{}`,
		"bad name prefix":     strings.Replace(valid, "clrs_text_task", "task", 1),
		"bad task shape":      strings.Replace(valid, "clrs_text_task", "clrs_text_Task", 1),
		"prompt mismatch":     strings.Replace(valid, `task:\ninput`, `other:\ninput`, 1),
		"empty examples":      `{"name":"clrs_text_task","examples":[]}`,
		"missing reference":   strings.Replace(valid, `"references":["answer"]`, `"references":[]`, 1),
		"multiple references": strings.Replace(valid, `"references":["answer"]`, `"references":["answer","other"]`, 1),
		"empty prompt":        strings.Replace(valid, `task:\ninput`, "", 1),
		"NUL prompt":          strings.Replace(valid, `task:\ninput`, `task:\n\u0000`, 1),
		"zero length":         strings.Replace(valid, `"length":7`, `"length":0`, 1),
		"large length":        strings.Replace(valid, `"length":7`, `"length":101`, 1),
		"large seed":          strings.Replace(valid, `"seed":3`, `"seed":2147483648`, 1),
		"fractional seed":     strings.Replace(valid, `"seed":3`, `"seed":3.5`, 1),
		"missing length":      strings.Replace(valid, `"length":7,`, "", 1),
		"missing seed":        strings.Replace(valid, `,"seed":3`, "", 1),
		"missing hints":       strings.Replace(valid, `,"use_hints":false`, "", 1),
		"unknown auxiliary":   strings.Replace(valid, `"use_hints":false`, `"use_hints":false,"extra":true`, 1),
		"too many examples":   fmt.Sprintf(`{"name":"clrs_text_task","examples":[%s,%s]}`, example, example),
	}
	for name, body := range tests {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			limits := testImportLimits()
			limits.MaxExamples = 1
			if _, _, err := ImportDataset(strings.NewReader(body), trackedSourceRecord(t), LengthDeclaredInput, limits); err == nil {
				t.Fatalf("ImportDataset accepted %s", name)
			}
		})
	}
}

func TestImportDatasetRejectsBoundaryViolations(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	limits := testImportLimits()
	limits.MaxDatasetBytes = 8
	if _, _, err := ImportDataset(strings.NewReader(oneExampleDataset("task", "input", "answer", 7, 3, false)), source, LengthDeclaredInput, limits); err == nil {
		t.Fatal("ImportDataset accepted oversized dataset")
	}
	limits = testImportLimits()
	limits.MaxPromptBytes = len("task:\ninput") - 1
	if _, _, err := ImportDataset(strings.NewReader(oneExampleDataset("task", "input", "answer", 7, 3, false)), source, LengthDeclaredInput, limits); err == nil {
		t.Fatal("ImportDataset accepted oversized prompt")
	}
	limits = testImportLimits()
	limits.MaxReferenceBytes = len("answer") - 1
	if _, _, err := ImportDataset(strings.NewReader(oneExampleDataset("task", "input", "answer", 7, 3, false)), source, LengthDeclaredInput, limits); err == nil {
		t.Fatal("ImportDataset accepted oversized reference")
	}
	if _, _, err := ImportDataset(nil, source, LengthDeclaredInput, testImportLimits()); err == nil {
		t.Fatal("ImportDataset accepted nil reader")
	}
	if _, _, err := ImportDataset(bytes.NewReader([]byte{0xff, '{', '}'}), source, LengthDeclaredInput, testImportLimits()); err == nil {
		t.Fatal("ImportDataset accepted invalid UTF-8")
	}
}

func TestImportDatasetRejectsInvalidPolicyInputs(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	body := oneExampleDataset("task", "input", "answer", 7, 3, false)
	if _, _, err := ImportDataset(strings.NewReader(body), source, LengthSemantics("unknown"), testImportLimits()); err == nil {
		t.Fatal("ImportDataset accepted unknown length semantics")
	}
	badSource := source
	badSource.Authority = "RESULT"
	if _, _, err := ImportDataset(strings.NewReader(body), badSource, LengthDeclaredInput, testImportLimits()); err == nil {
		t.Fatal("ImportDataset accepted invalid source record")
	}
	badLimits := testImportLimits()
	badLimits.MaxExamples = 0
	if _, _, err := ImportDataset(strings.NewReader(body), source, LengthDeclaredInput, badLimits); err == nil {
		t.Fatal("ImportDataset accepted unbounded example count")
	}
}

func oneExampleDataset(task, input, reference string, length, seed int64, useHints bool) string {
	prompt := task + ":\n" + input
	return fmt.Sprintf(
		`{"name":%q,"examples":[{"prompt":%q,"references":[%q],"auxiliary":{"length":%d,"seed":%d,"use_hints":%t}}]}`,
		"clrs_text_"+task,
		prompt,
		reference,
		length,
		seed,
		useHints,
	)
}

func testImportLimits() ImportLimits {
	return ImportLimits{
		MaxDatasetBytes:   16 << 10,
		MaxExamples:       4,
		MaxPromptBytes:    1024,
		MaxReferenceBytes: 1024,
		MaxDeclaredLength: 100,
	}
}

func FuzzImportDataset(f *testing.F) {
	f.Add(oneExampleDataset("task", "input", "answer", 7, 3, false))
	f.Add(`{"name":"clrs_text_task","examples":[]}`)
	f.Fuzz(func(t *testing.T, body string) {
		if len(body) > 16<<10 {
			return
		}
		_, _, _ = ImportDataset(strings.NewReader(body), trackedSourceRecord(t), LengthDeclaredInput, testImportLimits())
	})
}

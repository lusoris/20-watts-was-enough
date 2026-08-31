package clrsfixture

import (
	"bytes"
	"encoding/json"
	"fmt"
	"reflect"
	"strings"
	"testing"
)

func TestImportDatasetSeparatesCandidateFromVerifier(t *testing.T) {
	t.Parallel()
	fixture := newImportFixture(t, TaskInsertionSort)
	left := completeDataset(fixture)
	right := completeDataset(fixture)
	right.Examples[0].References[0] = "changed verifier-only answer"

	leftCandidates, leftVerifiers := importFixtureDataset(t, fixture, left, testImportLimits())
	rightCandidates, rightVerifiers := importFixtureDataset(t, fixture, right, testImportLimits())
	if !reflect.DeepEqual(leftCandidates, rightCandidates) {
		t.Fatal("candidate-visible records changed when only a reference changed")
	}
	if reflect.DeepEqual(leftVerifiers, rightVerifiers) ||
		leftVerifiers.Examples[0].ID == rightVerifiers.Examples[0].ID {
		t.Fatal("verifier-only records did not bind the changed reference")
	}
	changedInput := completeDataset(fixture)
	changedInput.Examples[0].Prompt += " changed candidate input"
	changedCandidates, _ := importFixtureDataset(t, fixture, changedInput, testImportLimits())
	if changedCandidates.Examples[0].ID == leftCandidates.Examples[0].ID {
		t.Fatal("candidate identity did not bind the changed prompt")
	}

	pairs, err := PairExamples(
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		leftCandidates,
		leftVerifiers,
	)
	if err != nil {
		t.Fatal(err)
	}
	if len(pairs) != fixture.task.ExpectedExamples ||
		pairs[0].Candidate.ID != pairs[0].Verifier.CandidateID {
		t.Fatalf("validated pairs = %#v", pairs)
	}
	sourceID, err := fixture.source.Identity()
	if err != nil {
		t.Fatal(err)
	}
	contractID, err := fixture.contract.Identity(fixture.source)
	if err != nil {
		t.Fatal(err)
	}
	if leftCandidates.Authority != ResultAuthority || leftVerifiers.Authority != ResultAuthority ||
		leftCandidates.Source != sourceID || leftVerifiers.Source != sourceID ||
		leftCandidates.Contract != contractID || leftVerifiers.Contract != contractID {
		t.Fatalf("set bindings = %#v / %#v", leftCandidates, leftVerifiers)
	}
	for index := range leftCandidates.Examples {
		candidate := leftCandidates.Examples[index]
		verifier := leftVerifiers.Examples[index]
		if candidate.Authority != ResultAuthority || verifier.Authority != ResultAuthority ||
			candidate.Source != sourceID || verifier.Source != sourceID ||
			candidate.Contract != contractID || verifier.Contract != contractID {
			t.Fatalf("example %d bindings = %#v / %#v", index, candidate, verifier)
		}
	}
	candidateType := reflect.TypeOf(CandidateExample{})
	for index := 0; index < candidateType.NumField(); index++ {
		name := strings.ToLower(candidateType.Field(index).Name)
		if strings.Contains(name, "answer") || strings.Contains(name, "reference") {
			t.Fatalf("candidate-visible type exposes verifier field %q", name)
		}
	}
}

func TestImportDatasetDerivesTaskPathAndLengthSemanticsFromContract(t *testing.T) {
	t.Parallel()
	insertion := newImportFixture(t, TaskInsertionSort)
	insertionCandidates, _ := importFixtureDataset(
		t,
		insertion,
		completeDataset(insertion),
		testImportLimits(),
	)
	first := insertionCandidates.Examples[0]
	if insertionCandidates.Task != TaskInsertionSort ||
		insertionCandidates.OutputRelativePath != insertion.task.OutputRelativePath ||
		insertionCandidates.LengthSemantics != LengthDeclaredInput ||
		first.EffectiveInputSize != first.RequestedLength {
		t.Fatalf("insertion contract projection = %#v / %#v", insertionCandidates, first)
	}

	segments := newImportFixture(t, TaskSegmentsIntersect)
	segmentCandidates, _ := importFixtureDataset(
		t,
		segments,
		completeDataset(segments),
		testImportLimits(),
	)
	if len(segmentCandidates.Examples) != 3 {
		t.Fatalf("segment example count = %d, want 3", len(segmentCandidates.Examples))
	}
	for _, candidate := range segmentCandidates.Examples {
		if candidate.RequestedLength != 4 || candidate.EffectiveInputSize != 4 ||
			candidate.LengthSemantics != LengthFixedFourEndpoints {
			t.Fatalf("fixed geometry candidate = %#v", candidate)
		}
	}

	body := marshalDataset(t, completeDataset(insertion))
	for _, outputPath := range []string{
		"",
		"./" + insertion.task.OutputRelativePath,
		"insertion_sort.json",
		generationSplit + "/not_selected.json",
	} {
		if _, _, err := ImportDataset(
			bytes.NewReader(body),
			insertion.source,
			insertion.contract,
			outputPath,
			testImportLimits(),
		); err == nil {
			t.Fatalf("ImportDataset accepted unselected output path %q", outputPath)
		}
	}
	wrongName := completeDataset(insertion)
	wrongName.Name = datasetName(TaskBinarySearch)
	if _, _, err := ImportDataset(
		bytes.NewReader(marshalDataset(t, wrongName)),
		insertion.source,
		insertion.contract,
		insertion.task.OutputRelativePath,
		testImportLimits(),
	); err == nil {
		t.Fatal("ImportDataset accepted a foreign task name at the selected path")
	}
}

func TestImportDatasetAcceptsEachExactContractTaskFile(t *testing.T) {
	t.Parallel()
	for _, task := range ShakedownTasks() {
		task := task
		t.Run(string(task), func(t *testing.T) {
			t.Parallel()
			fixture := newImportFixture(t, task)
			candidates, verifiers := importFixtureDataset(
				t,
				fixture,
				completeDataset(fixture),
				testImportLimits(),
			)
			if len(candidates.Examples) != fixture.task.ExpectedExamples ||
				len(verifiers.Examples) != fixture.task.ExpectedExamples ||
				candidates.OutputRelativePath != fixture.task.OutputRelativePath ||
				candidates.DatasetName != datasetName(task) {
				t.Fatalf("contract task import = %#v / %#v", candidates, verifiers)
			}
		})
	}
}

func TestImportDatasetRequiresExactContractCells(t *testing.T) {
	t.Parallel()
	fixture := newImportFixture(t, TaskInsertionSort)
	valid := completeDataset(fixture)
	importFixtureDataset(t, fixture, valid, testImportLimits())

	tests := []struct {
		name   string
		mutate func(*upstreamDataset)
	}{
		{
			name: "missing example",
			mutate: func(dataset *upstreamDataset) {
				dataset.Examples = dataset.Examples[:len(dataset.Examples)-1]
			},
		},
		{
			name: "extra example",
			mutate: func(dataset *upstreamDataset) {
				dataset.Examples = append(dataset.Examples, dataset.Examples[0])
			},
		},
		{
			name: "duplicate cell",
			mutate: func(dataset *upstreamDataset) {
				dataset.Examples[len(dataset.Examples)-1] = dataset.Examples[0]
			},
		},
		{
			name: "unselected length",
			mutate: func(dataset *upstreamDataset) {
				dataset.Examples[0].Auxiliary.Length = int64Pointer(9)
			},
		},
		{
			name: "unselected seed",
			mutate: func(dataset *upstreamDataset) {
				dataset.Examples[0].Auxiliary.Seed = int64Pointer(4)
			},
		},
		{
			name: "hints drift",
			mutate: func(dataset *upstreamDataset) {
				dataset.Examples[0].Auxiliary.UseHints = boolPointer(true)
			},
		},
		{
			name: "prompt task drift",
			mutate: func(dataset *upstreamDataset) {
				dataset.Examples[0].Prompt = string(TaskBinarySearch) + ":\nforeign"
			},
		},
	}
	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			dataset := completeDataset(fixture)
			test.mutate(&dataset)
			if _, _, err := ImportDataset(
				bytes.NewReader(marshalDataset(t, dataset)),
				fixture.source,
				fixture.contract,
				fixture.task.OutputRelativePath,
				testImportLimits(),
			); err == nil {
				t.Fatalf("ImportDataset accepted %s", test.name)
			}
		})
	}
}

func TestImportDatasetEnforcesContractAndCallerBounds(t *testing.T) {
	t.Parallel()
	fixture := newImportFixture(t, TaskInsertionSort)
	dataset := completeDataset(fixture)
	body := marshalDataset(t, dataset)

	tests := []struct {
		name   string
		reader *bytes.Reader
		limits ImportLimits
	}{
		{
			name:   "caller dataset bytes",
			reader: bytes.NewReader(body),
			limits: withImportLimits(func(limits *ImportLimits) { limits.MaxDatasetBytes = int64(len(body) - 1) }),
		},
		{
			name:   "caller example count",
			reader: bytes.NewReader(body),
			limits: withImportLimits(func(limits *ImportLimits) { limits.MaxExamples = fixture.task.ExpectedExamples - 1 }),
		},
		{
			name:   "caller prompt bytes",
			reader: bytes.NewReader(body),
			limits: withImportLimits(func(limits *ImportLimits) { limits.MaxPromptBytes = len(dataset.Examples[0].Prompt) - 1 }),
		},
		{
			name:   "caller reference bytes",
			reader: bytes.NewReader(body),
			limits: withImportLimits(func(limits *ImportLimits) { limits.MaxReferenceBytes = len(dataset.Examples[0].References[0]) - 1 }),
		},
		{
			name:   "caller declared length",
			reader: bytes.NewReader(body),
			limits: withImportLimits(func(limits *ImportLimits) { limits.MaxDeclaredLength = 31 }),
		},
	}
	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			if _, _, err := ImportDataset(
				test.reader,
				fixture.source,
				fixture.contract,
				fixture.task.OutputRelativePath,
				test.limits,
			); err == nil {
				t.Fatalf("ImportDataset accepted %s", test.name)
			}
		})
	}

	contractOversize := append([]byte(nil), body...)
	contractOversize = append(
		contractOversize,
		bytes.Repeat([]byte{' '}, int(fixture.plan.Output.MaxDatasetBytes)+1-len(contractOversize))...,
	)
	wideDatasetLimit := testImportLimits()
	wideDatasetLimit.MaxDatasetBytes = maximumDatasetBytesCeiling
	if _, _, err := ImportDataset(
		bytes.NewReader(contractOversize),
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		wideDatasetLimit,
	); err == nil {
		t.Fatal("ImportDataset accepted bytes beyond the contract dataset cap")
	}

	largePrompt := completeDataset(fixture)
	largePrompt.Examples[0].Prompt = string(fixture.task.Task) + ":\n" +
		strings.Repeat("p", fixture.plan.Output.MaxPromptBytes)
	if _, _, err := ImportDataset(
		bytes.NewReader(marshalDataset(t, largePrompt)),
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		testImportLimits(),
	); err == nil {
		t.Fatal("ImportDataset accepted a prompt beyond the contract cap")
	}
	largeReference := completeDataset(fixture)
	largeReference.Examples[0].References[0] = strings.Repeat(
		"r",
		fixture.plan.Output.MaxReferenceBytes+1,
	)
	if _, _, err := ImportDataset(
		bytes.NewReader(marshalDataset(t, largeReference)),
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		testImportLimits(),
	); err == nil {
		t.Fatal("ImportDataset accepted a reference beyond the contract cap")
	}
	if _, _, err := ImportDataset(
		nil,
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		testImportLimits(),
	); err == nil {
		t.Fatal("ImportDataset accepted a nil reader")
	}
	if _, _, err := ImportDataset(
		bytes.NewReader([]byte{0xff, '{', '}'}),
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		testImportLimits(),
	); err == nil {
		t.Fatal("ImportDataset accepted invalid UTF-8")
	}

	badLimits := testImportLimits()
	badLimits.MaxExamples = 0
	if _, _, err := ImportDataset(
		bytes.NewReader(body),
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		badLimits,
	); err == nil {
		t.Fatal("ImportDataset accepted an invalid caller limit")
	}
	badSource := fixture.source
	badSource.Authority = "RESULT"
	if _, _, err := ImportDataset(
		bytes.NewReader(body),
		badSource,
		fixture.contract,
		fixture.task.OutputRelativePath,
		testImportLimits(),
	); err == nil {
		t.Fatal("ImportDataset accepted a foreign source")
	}
	badContract := fixture.contract
	badContract.UseHints = true
	if _, _, err := ImportDataset(
		bytes.NewReader(body),
		fixture.source,
		badContract,
		fixture.task.OutputRelativePath,
		testImportLimits(),
	); err == nil {
		t.Fatal("ImportDataset accepted an invalid generation contract")
	}
}

func TestImportDatasetIdentitiesAreDeterministicAndDomainBound(t *testing.T) {
	t.Parallel()
	fixture := newImportFixture(t, TaskInsertionSort)
	dataset := completeDataset(fixture)
	firstCandidates, firstVerifiers := importFixtureDataset(t, fixture, dataset, testImportLimits())
	secondCandidates, secondVerifiers := importFixtureDataset(t, fixture, dataset, testImportLimits())
	if !reflect.DeepEqual(firstCandidates, secondCandidates) ||
		!reflect.DeepEqual(firstVerifiers, secondVerifiers) {
		t.Fatal("same contract-bound source bytes produced different records")
	}
	const (
		expectedCandidate = "sha256:c1f6a32dd519964047131461dba2e4254b278361dcb4baf6f291d1a0ae64bf2a"
		expectedVerifier  = "sha256:dd26ea47469278245a1c5cecb1a53fe07dd88b9cc6f2fd64abca328aefe492c0"
	)
	if got := firstCandidates.Examples[0].ID.String(); got != expectedCandidate {
		t.Fatalf("first candidate identity = %s, want %s", got, expectedCandidate)
	}
	if got := firstVerifiers.Examples[0].ID.String(); got != expectedVerifier {
		t.Fatalf("first verifier identity = %s, want %s", got, expectedVerifier)
	}

	scope, err := newContractScope(fixture.source, fixture.contract, fixture.task.OutputRelativePath)
	if err != nil {
		t.Fatal(err)
	}
	candidate := firstCandidates.Examples[0]
	checked := checkedExample{
		requestedLength: candidate.RequestedLength,
		effectiveSize:   candidate.EffectiveInputSize,
		seed:            candidate.Seed,
		prompt:          candidate.Prompt,
		useHints:        candidate.UseHints,
	}
	baseCandidate := makeCandidate(scope, firstCandidates.DatasetName, candidate.Ordinal, checked)
	changedSource := scope
	changedSource.sourceID[0] ^= 1
	if makeCandidate(changedSource, firstCandidates.DatasetName, candidate.Ordinal, checked).ID == baseCandidate.ID {
		t.Fatal("candidate identity does not bind SourceID")
	}
	changedContract := scope
	changedContract.contractID[0] ^= 1
	if makeCandidate(changedContract, firstCandidates.DatasetName, candidate.Ordinal, checked).ID == baseCandidate.ID {
		t.Fatal("candidate identity does not bind ContractID")
	}
	baseVerifier := makeVerifier(scope, baseCandidate.ID, firstVerifiers.Examples[0].Reference)
	if makeVerifier(changedSource, baseCandidate.ID, firstVerifiers.Examples[0].Reference).ID == baseVerifier.ID {
		t.Fatal("verifier identity does not bind SourceID")
	}
	if makeVerifier(changedContract, baseCandidate.ID, firstVerifiers.Examples[0].Reference).ID == baseVerifier.ID {
		t.Fatal("verifier identity does not bind ContractID")
	}
}

func TestPairExamplesRejectsMutatedOrForeignRecords(t *testing.T) {
	t.Parallel()
	fixture := newImportFixture(t, TaskInsertionSort)
	candidates, verifiers := importFixtureDataset(
		t,
		fixture,
		completeDataset(fixture),
		testImportLimits(),
	)
	reordered := cloneVerifierSet(verifiers)
	for left, right := 0, len(reordered.Examples)-1; left < right; left, right = left+1, right-1 {
		reordered.Examples[left], reordered.Examples[right] = reordered.Examples[right], reordered.Examples[left]
	}
	pairs, err := PairExamples(
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		candidates,
		reordered,
	)
	if err != nil {
		t.Fatalf("PairExamples rejected order-independent verifier records: %v", err)
	}
	for index, pair := range pairs {
		if pair.Candidate.ID != candidates.Examples[index].ID ||
			pair.Verifier.CandidateID != pair.Candidate.ID {
			t.Fatalf("pair %d = %#v", index, pair)
		}
	}
	binary := newImportFixture(t, TaskBinarySearch)
	binaryCandidates, binaryVerifiers := importFixtureDataset(
		t,
		binary,
		completeDataset(binary),
		testImportLimits(),
	)
	if _, err := PairExamples(
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		binaryCandidates,
		binaryVerifiers,
	); err == nil {
		t.Fatal("PairExamples accepted another contract-selected task at the caller's expected path")
	}

	scope, err := newContractScope(fixture.source, fixture.contract, fixture.task.OutputRelativePath)
	if err != nil {
		t.Fatal(err)
	}
	tests := []struct {
		name   string
		mutate func(*CandidateSet, *VerifierSet)
	}{
		{"candidate set authority", func(c *CandidateSet, _ *VerifierSet) { c.Authority = "RESULT" }},
		{"candidate set source", func(c *CandidateSet, _ *VerifierSet) { c.Source[0] ^= 1 }},
		{"candidate set contract", func(c *CandidateSet, _ *VerifierSet) { c.Contract[0] ^= 1 }},
		{"candidate set path", func(c *CandidateSet, _ *VerifierSet) { c.OutputRelativePath = "./" + c.OutputRelativePath }},
		{"candidate set name", func(c *CandidateSet, _ *VerifierSet) { c.DatasetName = datasetName(TaskBinarySearch) }},
		{"candidate set task", func(c *CandidateSet, _ *VerifierSet) { c.Task = TaskBinarySearch }},
		{"candidate set semantics", func(c *CandidateSet, _ *VerifierSet) { c.LengthSemantics = LengthFixedFourEndpoints }},
		{"verifier set authority", func(_ *CandidateSet, v *VerifierSet) { v.Authority = "RESULT" }},
		{"verifier set source", func(_ *CandidateSet, v *VerifierSet) { v.Source[0] ^= 1 }},
		{"verifier set contract", func(_ *CandidateSet, v *VerifierSet) { v.Contract[0] ^= 1 }},
		{"verifier set path", func(_ *CandidateSet, v *VerifierSet) { v.OutputRelativePath = "./" + v.OutputRelativePath }},
		{"verifier set name", func(_ *CandidateSet, v *VerifierSet) { v.DatasetName = datasetName(TaskBinarySearch) }},
		{"verifier set task", func(_ *CandidateSet, v *VerifierSet) { v.Task = TaskBinarySearch }},
		{"verifier set semantics", func(_ *CandidateSet, v *VerifierSet) { v.LengthSemantics = LengthFixedFourEndpoints }},
		{"candidate ID", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].ID[0] ^= 1 }},
		{"candidate authority", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].Authority = "RESULT" }},
		{"candidate source", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].Source[0] ^= 1 }},
		{"candidate contract", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].Contract[0] ^= 1 }},
		{"candidate path", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].OutputRelativePath = "foreign" }},
		{"candidate task", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].Task = TaskBinarySearch }},
		{"candidate ordinal", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].Ordinal++ }},
		{"candidate prompt", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].Prompt += " mutation" }},
		{"candidate semantics", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].LengthSemantics = LengthFixedFourEndpoints }},
		{"candidate requested length", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].RequestedLength = 8 }},
		{"candidate effective size", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].EffectiveInputSize++ }},
		{"candidate seed", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].Seed = 14 }},
		{"candidate hints", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0].UseHints = true }},
		{"verifier ID", func(_ *CandidateSet, v *VerifierSet) { v.Examples[0].ID[0] ^= 1 }},
		{"verifier authority", func(_ *CandidateSet, v *VerifierSet) { v.Examples[0].Authority = "RESULT" }},
		{"verifier source", func(_ *CandidateSet, v *VerifierSet) { v.Examples[0].Source[0] ^= 1 }},
		{"verifier contract", func(_ *CandidateSet, v *VerifierSet) { v.Examples[0].Contract[0] ^= 1 }},
		{"verifier candidate", func(_ *CandidateSet, v *VerifierSet) { v.Examples[0].CandidateID[0] ^= 1 }},
		{"verifier reference", func(_ *CandidateSet, v *VerifierSet) { v.Examples[0].Reference += " mutation" }},
		{"missing candidate", func(c *CandidateSet, _ *VerifierSet) { c.Examples = c.Examples[:len(c.Examples)-1] }},
		{"extra candidate", func(c *CandidateSet, _ *VerifierSet) { c.Examples = append(c.Examples, c.Examples[0]) }},
		{"duplicate candidate", func(c *CandidateSet, _ *VerifierSet) { c.Examples[len(c.Examples)-1] = c.Examples[0] }},
		{"reordered candidate", func(c *CandidateSet, _ *VerifierSet) { c.Examples[0], c.Examples[1] = c.Examples[1], c.Examples[0] }},
		{"missing verifier", func(_ *CandidateSet, v *VerifierSet) { v.Examples = v.Examples[:len(v.Examples)-1] }},
		{"extra verifier", func(_ *CandidateSet, v *VerifierSet) { v.Examples = append(v.Examples, v.Examples[0]) }},
		{"duplicate verifier", func(_ *CandidateSet, v *VerifierSet) { v.Examples[len(v.Examples)-1] = v.Examples[0] }},
		{
			"valid foreign verifier",
			func(_ *CandidateSet, v *VerifierSet) {
				v.Examples[len(v.Examples)-1] = makeVerifier(scope, CandidateID{1}, "foreign")
			},
		},
	}
	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			mutatedCandidates := cloneCandidateSet(candidates)
			mutatedVerifiers := cloneVerifierSet(verifiers)
			test.mutate(&mutatedCandidates, &mutatedVerifiers)
			if _, err := PairExamples(
				fixture.source,
				fixture.contract,
				fixture.task.OutputRelativePath,
				mutatedCandidates,
				mutatedVerifiers,
			); err == nil {
				t.Fatalf("PairExamples accepted %s", test.name)
			}
		})
	}
}

func TestImportDatasetRejectsAmbiguousOrMalformedJSON(t *testing.T) {
	t.Parallel()
	fixture := newImportFixture(t, TaskInsertionSort)
	dataset := completeDataset(fixture)
	valid := string(marshalDataset(t, dataset))
	firstLength := fmt.Sprintf(`"length":%d,`, fixture.task.Sizes[0].RequestedLength)
	tests := map[string][]byte{
		"unknown top level": []byte(strings.Replace(valid, `{"name":`, `{"unknown":true,"name":`, 1)),
		"duplicate field":   []byte(strings.Replace(valid, `{"name":`, `{"name":"duplicate","name":`, 1)),
		"trailing value":    []byte(valid + `{}`),
		"missing length":    []byte(strings.Replace(valid, firstLength, "", 1)),
		"fractional seed":   []byte(strings.Replace(valid, `"seed":3`, `"seed":3.5`, 1)),
		"unknown auxiliary": []byte(strings.Replace(valid, `"use_hints":false`, `"use_hints":false,"extra":true`, 1)),
		"multiple refs":     []byte(strings.Replace(valid, `"references":[`, `"references":["extra",`, 1)),
		"empty refs":        []byte(strings.Replace(valid, dataset.Examples[0].References[0], "", 1)),
		"invalid UTF-8":     {0xff, '{', '}'},
	}
	for name, body := range tests {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			if _, _, err := ImportDataset(
				bytes.NewReader(body),
				fixture.source,
				fixture.contract,
				fixture.task.OutputRelativePath,
				testImportLimits(),
			); err == nil {
				t.Fatalf("ImportDataset accepted %s", name)
			}
		})
	}
	nulPrompt := completeDataset(fixture)
	nulPrompt.Examples[0].Prompt = string(fixture.task.Task) + ":\n\x00"
	if _, _, err := ImportDataset(
		bytes.NewReader(marshalDataset(t, nulPrompt)),
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		testImportLimits(),
	); err == nil {
		t.Fatal("ImportDataset accepted a NUL prompt")
	}
}

type importFixture struct {
	source   SourceRecord
	contract GenerationContract
	plan     GenerationPlan
	task     TaskPlan
}

func newImportFixture(t *testing.T, task TaskKind) importFixture {
	t.Helper()
	source := trackedSourceRecord(t)
	contract := trackedGenerationContract(t, source)
	plan, err := contract.Plan(source)
	if err != nil {
		t.Fatal(err)
	}
	for _, candidate := range plan.Tasks {
		if candidate.Task == task {
			return importFixture{
				source:   source,
				contract: contract,
				plan:     plan,
				task:     candidate,
			}
		}
	}
	t.Fatalf("task %q is not selected", task)
	return importFixture{}
}

func completeDataset(fixture importFixture) upstreamDataset {
	examples := make([]upstreamExample, 0, fixture.task.ExpectedExamples)
	for _, size := range fixture.task.Sizes {
		for _, seed := range fixture.plan.Seeds {
			for sample := 0; sample < fixture.plan.SamplesPerCell; sample++ {
				examples = append(examples, upstreamExample{
					Prompt: fmt.Sprintf(
						"%s:\ninput length=%d seed=%d sample=%d",
						fixture.task.Task,
						size.RequestedLength,
						seed,
						sample,
					),
					References: []string{fmt.Sprintf(
						"reference length=%d seed=%d sample=%d",
						size.RequestedLength,
						seed,
						sample,
					)},
					Auxiliary: upstreamAuxiliary{
						Length:   int64Pointer(size.RequestedLength),
						Seed:     int64Pointer(seed),
						UseHints: boolPointer(fixture.plan.UseHints),
					},
				})
			}
		}
	}
	return upstreamDataset{
		Name:     datasetName(fixture.task.Task),
		Examples: examples,
	}
}

func importFixtureDataset(
	t *testing.T,
	fixture importFixture,
	dataset upstreamDataset,
	limits ImportLimits,
) (CandidateSet, VerifierSet) {
	t.Helper()
	candidates, verifiers, err := ImportDataset(
		bytes.NewReader(marshalDataset(t, dataset)),
		fixture.source,
		fixture.contract,
		fixture.task.OutputRelativePath,
		limits,
	)
	if err != nil {
		t.Fatal(err)
	}
	return candidates, verifiers
}

func marshalDataset(t *testing.T, dataset upstreamDataset) []byte {
	t.Helper()
	body, err := json.Marshal(dataset)
	if err != nil {
		t.Fatal(err)
	}
	return body
}

func int64Pointer(value int64) *int64 {
	return &value
}

func boolPointer(value bool) *bool {
	return &value
}

func testImportLimits() ImportLimits {
	return ImportLimits{
		MaxDatasetBytes:   8 << 20,
		MaxExamples:       16,
		MaxPromptBytes:    1 << 20,
		MaxReferenceBytes: 1 << 20,
		MaxDeclaredLength: 32,
	}
}

func withImportLimits(change func(*ImportLimits)) ImportLimits {
	limits := testImportLimits()
	change(&limits)
	return limits
}

func cloneCandidateSet(set CandidateSet) CandidateSet {
	set.Examples = append([]CandidateExample(nil), set.Examples...)
	return set
}

func cloneVerifierSet(set VerifierSet) VerifierSet {
	set.Examples = append([]VerifierExample(nil), set.Examples...)
	return set
}

func FuzzImportDataset(f *testing.F) {
	f.Add([]byte(`{"name":"clrs_text_insertion_sort","examples":[{"prompt":"insertion_sort:\ninput","references":["reference"],"auxiliary":{"length":10,"seed":3,"use_hints":false}}]}`))
	f.Add([]byte(`{"name":"clrs_text_insertion_sort","examples":[]}`))
	f.Fuzz(func(t *testing.T, body []byte) {
		if len(body) > 64<<10 {
			return
		}
		fixture := newImportFixture(t, TaskInsertionSort)
		_, _, _ = ImportDataset(
			bytes.NewReader(body),
			fixture.source,
			fixture.contract,
			fixture.task.OutputRelativePath,
			testImportLimits(),
		)
	})
}

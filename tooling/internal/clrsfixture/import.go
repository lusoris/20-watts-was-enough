package clrsfixture

import (
	"errors"
	"fmt"
	"io"
	"math"
	"strings"
)

const (
	maximumDatasetBytesCeiling   = 64 << 20
	maximumExamplesCeiling       = 100_000
	maximumExampleBytesCeiling   = 1 << 20
	maximumDeclaredLengthCeiling = 1 << 20
)

// LengthSemantics distinguishes an effective input length from the CLRS
// segment sampler's ignored length argument and fixed four endpoints.
type LengthSemantics string

const (
	LengthDeclaredInput      LengthSemantics = "declared_length"
	LengthFixedFourEndpoints LengthSemantics = "fixed_four_endpoints"
)

// ImportLimits are safety caps, not selected experiment sizes or sample counts.
type ImportLimits struct {
	MaxDatasetBytes   int64
	MaxExamples       int
	MaxPromptBytes    int
	MaxReferenceBytes int
	MaxDeclaredLength int64
}

// CandidateExample is the complete candidate-visible record. It contains no
// reference answer or answer-derived digest.
type CandidateExample struct {
	ID                 CandidateID
	Authority          string
	Source             SourceID
	Task               string
	Ordinal            uint64
	Prompt             string
	LengthSemantics    LengthSemantics
	RequestedLength    int64
	EffectiveInputSize int64
	Seed               int64
	UseHints           bool
}

// VerifierExample is held outside the candidate-visible record.
type VerifierExample struct {
	ID          VerifierID
	Authority   string
	Source      SourceID
	CandidateID CandidateID
	Reference   string
}

// CandidateSet contains only values safe to send across a candidate seam.
type CandidateSet struct {
	Authority       string
	Source          SourceID
	DatasetName     string
	Task            string
	LengthSemantics LengthSemantics
	Examples        []CandidateExample
}

// VerifierSet contains the exact answers for a separate verifier boundary.
type VerifierSet struct {
	Authority   string
	Source      SourceID
	DatasetName string
	Examples    []VerifierExample
}

type upstreamDataset struct {
	Name     string            `json:"name"`
	Examples []upstreamExample `json:"examples"`
}

type upstreamExample struct {
	Prompt     string            `json:"prompt"`
	References []string          `json:"references"`
	Auxiliary  upstreamAuxiliary `json:"auxiliary"`
}

type upstreamAuxiliary struct {
	Length   *int64 `json:"length"`
	Seed     *int64 `json:"seed"`
	UseHints *bool  `json:"use_hints"`
}

type checkedExample struct {
	requestedLength int64
	effectiveSize   int64
	seed            int64
	prompt          string
	reference       string
	useHints        bool
}

// ImportDataset splits one exact upstream JSON file into candidate and verifier
// views. It does not select tasks, lengths, seeds, splits, or sample counts.
func ImportDataset(
	reader io.Reader,
	source SourceRecord,
	semantics LengthSemantics,
	limits ImportLimits,
) (CandidateSet, VerifierSet, error) {
	if err := limits.Validate(); err != nil {
		return CandidateSet{}, VerifierSet{}, err
	}
	sourceID, err := source.Identity()
	if err != nil {
		return CandidateSet{}, VerifierSet{}, fmt.Errorf("validate CLRS import source: %w", err)
	}
	if !validLengthSemantics(semantics) {
		return CandidateSet{}, VerifierSet{}, fmt.Errorf("unsupported CLRS length semantics %q", semantics)
	}
	body, err := readBounded(reader, limits.MaxDatasetBytes)
	if err != nil {
		return CandidateSet{}, VerifierSet{}, fmt.Errorf("read CLRS dataset: %w", err)
	}
	var dataset upstreamDataset
	if err := decodeStrict(body, 5, &dataset); err != nil {
		return CandidateSet{}, VerifierSet{}, fmt.Errorf("parse CLRS dataset: %w", err)
	}
	task, err := validateDatasetName(dataset.Name)
	if err != nil {
		return CandidateSet{}, VerifierSet{}, err
	}
	if len(dataset.Examples) == 0 || len(dataset.Examples) > limits.MaxExamples {
		return CandidateSet{}, VerifierSet{}, fmt.Errorf("CLRS example count = %d, want 1..%d", len(dataset.Examples), limits.MaxExamples)
	}
	candidates := newCandidateSet(sourceID, dataset.Name, task, semantics, len(dataset.Examples))
	verifiers := newVerifierSet(sourceID, dataset.Name, len(dataset.Examples))
	for index, raw := range dataset.Examples {
		checked, checkErr := checkExample(raw, task, semantics, limits)
		if checkErr != nil {
			return CandidateSet{}, VerifierSet{}, fmt.Errorf("validate CLRS example %d: %w", index, checkErr)
		}
		candidate := makeCandidate(sourceID, dataset.Name, task, semantics, uint64(index), checked)
		verifier := makeVerifier(sourceID, candidate.ID, checked.reference)
		candidates.Examples = append(candidates.Examples, candidate)
		verifiers.Examples = append(verifiers.Examples, verifier)
	}
	return candidates, verifiers, nil
}

// Validate rejects limits that are non-positive or too large to remain useful
// parser bounds.
func (limits ImportLimits) Validate() error {
	if limits.MaxDatasetBytes <= 0 || limits.MaxDatasetBytes > maximumDatasetBytesCeiling {
		return fmt.Errorf("CLRS dataset byte limit must be between 1 and %d", maximumDatasetBytesCeiling)
	}
	if limits.MaxExamples <= 0 || limits.MaxExamples > maximumExamplesCeiling {
		return fmt.Errorf("CLRS example limit must be between 1 and %d", maximumExamplesCeiling)
	}
	if limits.MaxPromptBytes <= 0 || limits.MaxPromptBytes > maximumExampleBytesCeiling ||
		limits.MaxReferenceBytes <= 0 || limits.MaxReferenceBytes > maximumExampleBytesCeiling {
		return fmt.Errorf("CLRS prompt and reference limits must be between 1 and %d", maximumExampleBytesCeiling)
	}
	if limits.MaxDeclaredLength <= 0 || limits.MaxDeclaredLength > maximumDeclaredLengthCeiling {
		return fmt.Errorf("CLRS declared-length limit must be between 1 and %d", maximumDeclaredLengthCeiling)
	}
	return nil
}

func checkExample(raw upstreamExample, task string, semantics LengthSemantics, limits ImportLimits) (checkedExample, error) {
	if raw.Prompt == "" || len(raw.Prompt) > limits.MaxPromptBytes || strings.IndexByte(raw.Prompt, 0) >= 0 {
		return checkedExample{}, fmt.Errorf("prompt must contain 1..%d non-NUL bytes", limits.MaxPromptBytes)
	}
	if !strings.HasPrefix(raw.Prompt, task+":\n") {
		return checkedExample{}, fmt.Errorf("prompt does not bind dataset task %q", task)
	}
	if len(raw.References) != 1 {
		return checkedExample{}, fmt.Errorf("reference count = %d, want exactly 1", len(raw.References))
	}
	reference := raw.References[0]
	if reference == "" || len(reference) > limits.MaxReferenceBytes || strings.IndexByte(reference, 0) >= 0 {
		return checkedExample{}, fmt.Errorf("reference must contain 1..%d non-NUL bytes", limits.MaxReferenceBytes)
	}
	if raw.Auxiliary.Length == nil || raw.Auxiliary.Seed == nil || raw.Auxiliary.UseHints == nil {
		return checkedExample{}, errors.New("auxiliary length, seed, and use_hints are all required")
	}
	if *raw.Auxiliary.Length <= 0 || *raw.Auxiliary.Length > limits.MaxDeclaredLength {
		return checkedExample{}, fmt.Errorf("declared length = %d, want 1..%d", *raw.Auxiliary.Length, limits.MaxDeclaredLength)
	}
	if *raw.Auxiliary.Seed < math.MinInt32 || *raw.Auxiliary.Seed > math.MaxInt32 {
		return checkedExample{}, errors.New("seed is outside the upstream signed 32-bit range")
	}
	effectiveSize := *raw.Auxiliary.Length
	if semantics == LengthFixedFourEndpoints {
		effectiveSize = 4
	}
	return checkedExample{
		requestedLength: *raw.Auxiliary.Length,
		effectiveSize:   effectiveSize,
		seed:            *raw.Auxiliary.Seed,
		prompt:          raw.Prompt,
		reference:       reference,
		useHints:        *raw.Auxiliary.UseHints,
	}, nil
}

func validateDatasetName(name string) (string, error) {
	const prefix = "clrs_text_"
	if !strings.HasPrefix(name, prefix) {
		return "", fmt.Errorf("CLRS dataset name %q lacks %q prefix", name, prefix)
	}
	task := strings.TrimPrefix(name, prefix)
	if len(task) == 0 || len(task) > 64 {
		return "", fmt.Errorf("CLRS task name length = %d, want 1..64", len(task))
	}
	previousUnderscore := false
	for index, character := range []byte(task) {
		letter := character >= 'a' && character <= 'z'
		digit := character >= '0' && character <= '9'
		underscore := character == '_'
		if !letter && !(index > 0 && digit) && !(index > 0 && underscore && !previousUnderscore && index < len(task)-1) {
			return "", fmt.Errorf("CLRS task name %q is not lowercase snake case", task)
		}
		previousUnderscore = underscore
	}
	return task, nil
}

func validLengthSemantics(semantics LengthSemantics) bool {
	return semantics == LengthDeclaredInput || semantics == LengthFixedFourEndpoints
}

func newCandidateSet(source SourceID, datasetName, task string, semantics LengthSemantics, capacity int) CandidateSet {
	return CandidateSet{
		Authority:       ResultAuthority,
		Source:          source,
		DatasetName:     datasetName,
		Task:            task,
		LengthSemantics: semantics,
		Examples:        make([]CandidateExample, 0, capacity),
	}
}

func newVerifierSet(source SourceID, datasetName string, capacity int) VerifierSet {
	return VerifierSet{
		Authority:   ResultAuthority,
		Source:      source,
		DatasetName: datasetName,
		Examples:    make([]VerifierExample, 0, capacity),
	}
}

func makeCandidate(
	source SourceID,
	datasetName string,
	task string,
	semantics LengthSemantics,
	ordinal uint64,
	example checkedExample,
) CandidateExample {
	builder := newIdentityBuilder("20w/clrs-candidate/v1")
	builder.addBytes(source[:])
	builder.addString(datasetName)
	builder.addString(task)
	builder.addString(string(semantics))
	builder.addUint64(ordinal)
	builder.addInt64(example.requestedLength)
	builder.addInt64(example.effectiveSize)
	builder.addInt64(example.seed)
	builder.addBool(example.useHints)
	builder.addString(example.prompt)
	return CandidateExample{
		ID:                 CandidateID(builder.sum()),
		Authority:          ResultAuthority,
		Source:             source,
		Task:               task,
		Ordinal:            ordinal,
		Prompt:             example.prompt,
		LengthSemantics:    semantics,
		RequestedLength:    example.requestedLength,
		EffectiveInputSize: example.effectiveSize,
		Seed:               example.seed,
		UseHints:           example.useHints,
	}
}

func makeVerifier(source SourceID, candidateID CandidateID, reference string) VerifierExample {
	builder := newIdentityBuilder("20w/clrs-verifier/v1")
	builder.addBytes(source[:])
	builder.addBytes(candidateID[:])
	builder.addString(reference)
	return VerifierExample{
		ID:          VerifierID(builder.sum()),
		Authority:   ResultAuthority,
		Source:      source,
		CandidateID: candidateID,
		Reference:   reference,
	}
}

package clrsfixture

import (
	"bytes"
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"sort"
)

// FixtureTreeOptions pins a supplied development tree independently of its files.
type FixtureTreeOptions struct {
	RepositoryRoot, DatasetDirectory, ExpectedTreeSHA256 string
}

type FixtureTreeFile struct {
	Path      string `json:"path"`
	SHA256    string `json:"sha256"`
	SizeBytes int64  `json:"size_bytes"`
}

// FixtureDataset keeps candidate and held-reference views explicitly separate.
type FixtureDataset struct {
	Candidates CandidateSet
	Verifiers  VerifierSet
}

// FixtureTree is a validated NO_RESULT input snapshot, not generator admission.
// Recheck uses private snapshots rather than caller-mutable exported records.
type FixtureTree struct {
	Source                                   SourceRecord
	Contract                                 GenerationContract
	Plan                                     GenerationPlan
	RepositoryRoot, DatasetDirectory         string
	TreeSHA256, SourceSHA256, ContractSHA256 string
	Files                                    []FixtureTreeFile
	Datasets                                 []FixtureDataset
	inputs                                   comparisonInputs
	snapshot                                 *comparisonSnapshot
}

// LoadFixtureTree reuses the comparator's inventory, stable reads and exact tree
// hash framing. It never generates data or invokes a subprocess.
func LoadFixtureTree(ctx context.Context, options FixtureTreeOptions) (FixtureTree, error) {
	var result FixtureTree
	if ctx == nil || !validFixtureTreeSHA256(options.ExpectedTreeSHA256) {
		return result, errors.New("fixture tree requires a context and an explicit 64-character lowercase SHA-256")
	}
	ctx, cancel := context.WithTimeout(ctx, comparisonTimeout)
	defer cancel()
	inputs, err := loadComparisonInputs(ctx, FixtureComparisonOptions{options.RepositoryRoot, options.DatasetDirectory, options.DatasetDirectory})
	if err != nil {
		return result, err
	}
	directories, err := comparisonInventory(ctx, inputs.first, inputs.plan)
	if err != nil {
		return result, err
	}
	snapshot := &comparisonSnapshot{root: inputs.first, directories: directories, tree: newComparisonTree()}
	result.inputs, result.snapshot = inputs, snapshot
	result.Source = inputs.source
	// Parsing again keeps exported task/seed slices separate from the private
	// recheck authority. Plan also returns its own defensive slice copies.
	result.Contract, err = ParseGenerationContract(inputs.contractBody, result.Source)
	if err != nil {
		return FixtureTree{}, err
	}
	result.Plan, err = result.Contract.Plan(result.Source)
	if err != nil {
		return FixtureTree{}, err
	}
	result.RepositoryRoot, result.DatasetDirectory = inputs.root, inputs.first
	result.SourceSHA256, result.ContractSHA256 = rawSHA256(inputs.sourceBody), rawSHA256(inputs.contractBody)
	paths := make([]string, 0, len(inputs.plan.Tasks))
	for _, task := range inputs.plan.Tasks {
		paths = append(paths, task.OutputRelativePath)
	}
	sort.Strings(paths)
	for _, path := range paths {
		if err := result.importFile(ctx, path); err != nil {
			return FixtureTree{}, err
		}
	}
	result.TreeSHA256 = hex.EncodeToString(snapshot.tree.Sum(nil))
	if result.TreeSHA256 != options.ExpectedTreeSHA256 {
		return FixtureTree{}, errors.New("fixture tree differs from the independently supplied SHA-256")
	}
	if err := result.Recheck(ctx); err != nil {
		return FixtureTree{}, err
	}
	return result, nil
}

func (tree *FixtureTree) importFile(ctx context.Context, path string) error {
	inputs, snapshot := tree.inputs, tree.snapshot
	body, entry, err := readComparisonFile(ctx, snapshot.root, path, inputs.plan.Output.MaxDatasetBytes)
	if err != nil {
		return err
	}
	snapshot.totalBytes += int64(len(body))
	if snapshot.totalBytes > inputs.plan.Output.MaxTotalBytes {
		return errors.New("fixture tree exceeds its total byte boundary")
	}
	out := inputs.plan.Output
	candidates, verifiers, err := ImportDataset(bytes.NewReader(body), inputs.source, inputs.contract, path,
		ImportLimits{out.MaxDatasetBytes, out.ExpectedExamples, out.MaxPromptBytes, out.MaxReferenceBytes, out.MaxRequestedLength})
	if err != nil {
		return fmt.Errorf("import fixture %s: %w", path, err)
	}
	snapshot.files = append(snapshot.files, entry)
	addComparisonTreeFile(snapshot.tree, path, body)
	tree.Files = append(tree.Files, FixtureTreeFile{path, entry.sha256, int64(len(body))})
	tree.Datasets = append(tree.Datasets, FixtureDataset{candidates, verifiers})
	return ctx.Err()
}

// Recheck rejects changed source authorities, inventory, file identities or bytes.
func (tree FixtureTree) Recheck(ctx context.Context) error {
	if ctx == nil || tree.snapshot == nil {
		return errors.New("fixture tree recheck requires a context and a loaded snapshot")
	}
	ctx, cancel := context.WithTimeout(ctx, comparisonTimeout)
	defer cancel()
	if err := recheckFixtureSnapshot(ctx, tree.inputs.plan, tree.snapshot); err != nil {
		return err
	}
	return recheckFixtureAuthorities(ctx, tree.inputs)
}

func validFixtureTreeSHA256(value string) bool {
	if len(value) != 64 {
		return false
	}
	decoded, err := hex.DecodeString(value)
	return err == nil && hex.EncodeToString(decoded) == value
}

package clrsfixture

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
)

func TestLoadFixtureTreeReusesComparisonIdentityAndSeparatedImports(t *testing.T) {
	t.Parallel()
	options := comparisonFixture(t)
	comparison, err := CompareFixtures(context.Background(), options)
	if err != nil {
		t.Fatal(err)
	}
	before := comparisonTestInventory(t, options.RepositoryRoot)
	tree, err := LoadFixtureTree(context.Background(), FixtureTreeOptions{options.RepositoryRoot, options.FirstDirectory, comparison.FirstTreeSHA256})
	if err != nil {
		t.Fatal(err)
	}
	if tree.TreeSHA256 != comparison.FirstTreeSHA256 || len(tree.Files) != 6 || len(tree.Datasets) != 6 || tree.Plan.Output.ExpectedExamples != 48 {
		t.Fatalf("unexpected tree: %+v", tree)
	}
	count := 0
	for _, dataset := range tree.Datasets {
		pairs, err := PairExamples(tree.Source, tree.Contract, dataset.Candidates.OutputRelativePath, dataset.Candidates, dataset.Verifiers)
		if err != nil {
			t.Fatal(err)
		}
		count += len(pairs)
	}
	if count != 48 {
		t.Fatalf("examples=%d", count)
	}
	if err := tree.Recheck(context.Background()); err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(before, comparisonTestInventory(t, options.RepositoryRoot)) {
		t.Fatal("loader or recheck changed input files")
	}
	path := filepath.Join(tree.DatasetDirectory, tree.Files[0].Path)
	body, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, append(body, '\n'), 0o600); err != nil {
		t.Fatal(err)
	}
	if err := tree.Recheck(context.Background()); err == nil {
		t.Fatal("changed dataset passed recheck")
	}
}

func TestFixtureTreeRecheckKeepsPrivateAuthorityAfterExportedMutations(t *testing.T) {
	t.Parallel()
	options := comparisonFixture(t)
	comparison, err := CompareFixtures(context.Background(), options)
	if err != nil {
		t.Fatal(err)
	}
	tree, err := LoadFixtureTree(context.Background(), FixtureTreeOptions{options.RepositoryRoot, options.FirstDirectory, comparison.FirstTreeSHA256})
	if err != nil {
		t.Fatal(err)
	}
	firstPath := tree.Files[0].Path
	tree.Source.Authority = "mutated"
	tree.Contract.Seeds[0] = -1
	tree.Contract.Tasks[0].Sizes[0].RequestedLength = -1
	tree.Contract.Tasks[0].Task = "mutated"
	tree.Plan.Seeds[0] = -2
	tree.Plan.Tasks[0].Sizes[0].RequestedLength = -2
	tree.Plan.Tasks[0].Task = "mutated"
	tree.Plan.Tasks[0].OutputRelativePath = "changed"
	tree.Files[0].Path = "changed"
	tree.RepositoryRoot, tree.DatasetDirectory = "changed", "changed"
	if err := tree.Recheck(context.Background()); err != nil {
		t.Fatalf("mutable exported slices reached recheck authority: %v", err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if err := tree.Recheck(ctx); !errors.Is(err, context.Canceled) {
		t.Fatalf("cancelled recheck lost cancellation: %v", err)
	}
	path := filepath.Join(options.FirstDirectory, firstPath)
	if !filepath.IsAbs(path) {
		path = filepath.Join(options.RepositoryRoot, path)
	}
	if err := os.Rename(path, path+".changed"); err != nil {
		t.Fatal(err)
	}
	if err := tree.Recheck(context.Background()); err == nil {
		t.Fatal("exported mutation bypassed changed private inventory")
	}
}

func TestLoadFixtureTreeRejectsUnpinnedAndCancelledInputs(t *testing.T) {
	t.Parallel()
	options := comparisonFixture(t)
	for _, hash := range []string{"", "abc", strings.Repeat("A", 64), strings.Repeat("0", 64)} {
		if _, err := LoadFixtureTree(context.Background(), FixtureTreeOptions{options.RepositoryRoot, options.FirstDirectory, hash}); err == nil {
			t.Fatalf("accepted hash %q", hash)
		}
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if _, err := LoadFixtureTree(ctx, FixtureTreeOptions{options.RepositoryRoot, options.FirstDirectory, strings.Repeat("1", 64)}); err == nil {
		t.Fatal("cancelled import passed")
	}
}

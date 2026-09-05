package clrsfixture

import (
	"bytes"
	"context"
	"errors"
	"slices"
	"testing"
)

func TestGenerationTarSeparateTerminatorBoundary(t *testing.T) {
	_, inputs, valid := generationRunFixture(t)
	paths := inputs.invocation.ExpectedPaths
	short := inputs
	short.invocation.ExpectedPaths = paths[:len(paths)-1]
	extra := inputs
	extra.invocation.ExpectedPaths = append(slices.Clone(paths), paths[len(paths)-1])
	cases := []struct {
		name       string
		body       []byte
		wantVisits int
		wantError  bool
	}{
		{"exact-members", valid, len(paths), false},
		{"early-terminator", generationTestTar(t, short, nil), len(paths) - 1, true},
		{"extra-member", generationTestTar(t, extra, nil), len(paths), true},
		{"no-endblocks", valid[:len(valid)-1024], len(paths), true},
		{"one-endblock", valid[:len(valid)-512], len(paths), true},
		{"nonzero-tail", append(bytes.Clone(valid), bytes.Repeat([]byte{1}, 512)...), len(paths), true},
	}
	for _, testCase := range cases {
		t.Run(testCase.name, func(t *testing.T) {
			var visited []string
			err := visitGenerationTar(context.Background(), testCase.body, inputs, func(name string, content []byte) error {
				if len(content) == 0 {
					t.Fatal("empty member reached visitor")
				}
				visited = append(visited, name)
				return nil
			})
			if (err != nil) != testCase.wantError {
				t.Fatalf("unexpected framing outcome: %v", err)
			}
			if len(visited) != testCase.wantVisits || !slices.Equal(visited, paths[:testCase.wantVisits]) {
				t.Fatalf("unexpected visited members: %v", visited)
			}
		})
	}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	visits := 0
	err := visitGenerationTar(ctx, valid, inputs, func(string, []byte) error {
		visits++
		if visits == len(paths) {
			cancel()
		}
		return nil
	})
	if !errors.Is(err, context.Canceled) || visits != len(paths) {
		t.Fatalf("cancellation before terminator was lost: visits=%d err=%v", visits, err)
	}
}

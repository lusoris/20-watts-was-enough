package main

import (
	"bytes"
	"strings"
	"testing"
)

func TestPromiseCommandCLIUsage(t *testing.T) {
	for _, arguments := range [][]string{
		{}, {"--output", "x"}, {"--inputs", "x"}, {"--check"},
		{"--check", "--output", "x", "--inputs", "y"}, {"--output", "x", "positional"}, {"--unknown"},
	} {
		var stdout, stderr bytes.Buffer
		full := append([]string{"experiment", "reproduce-clrs-promise-wheel"}, arguments...)
		if code := run(full, &stdout, &stderr); code != 2 || stdout.Len() != 0 {
			t.Fatalf("%v: code=%d stdout=%s stderr=%s", arguments, code, &stdout, &stderr)
		}
	}
}

func TestPromiseCommandCheckDoesNotRequireDocker(t *testing.T) {
	var stdout, stderr bytes.Buffer
	code := run([]string{"experiment", "reproduce-clrs-promise-wheel", "--check", "--output", t.TempDir(), "--root", t.TempDir()}, &stdout, &stderr)
	if code != 1 || stdout.Len() != 0 || strings.Contains(stderr.String(), "Docker CLI") {
		t.Fatalf("code=%d stdout=%s stderr=%s", code, &stdout, &stderr)
	}
}

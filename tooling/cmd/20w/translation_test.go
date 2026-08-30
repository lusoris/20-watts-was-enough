package main

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRunTranslationCandidateCommandsRequireClosedArguments(t *testing.T) {
	t.Parallel()
	for _, arguments := range [][]string{
		{"translation", "export-candidate", "--language", "de"},
		{"translation", "import-candidate", "--input", "candidate.json"},
	} {
		var stdout bytes.Buffer
		var stderr bytes.Buffer
		if exitCode := run(arguments, &stdout, &stderr); exitCode != 2 || !strings.Contains(stderr.String(), "requires") {
			t.Fatalf("run(%v) exit/stderr = %d/%q, want usage refusal", arguments, exitCode, stderr.String())
		}
	}
}

func TestRunTranslationExportCandidateCreatesNoAuthorityFile(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	source := filepath.Join(root, "concept", "00-test.md")
	if err := os.MkdirAll(filepath.Dir(source), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(source, []byte("# Source\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	registry := filepath.Join(root, "translations", "eu-languages.json")
	if err := os.MkdirAll(filepath.Dir(registry), 0o755); err != nil {
		t.Fatal(err)
	}
	registryBody, err := os.ReadFile(filepath.Join("..", "..", "..", "translations", "eu-languages.json"))
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(registry, registryBody, 0o644); err != nil {
		t.Fatal(err)
	}
	output := filepath.Join(t.TempDir(), "candidate.json")
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	exitCode := run([]string{
		"translation", "export-candidate",
		"--root", root,
		"--source", "concept/00-test.md",
		"--language", "de",
		"--output", output,
	}, &stdout, &stderr)
	if exitCode != 0 || !strings.Contains(stdout.String(), "undisclosed/unreviewed") {
		t.Fatalf("run() exit/stdout/stderr = %d/%q/%q", exitCode, stdout.String(), stderr.String())
	}
	if _, err := os.Stat(output); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Lstat(filepath.Join(root, "translations", "manifest.json")); !os.IsNotExist(err) {
		t.Fatalf("export command touched translation authority: %v", err)
	}
}

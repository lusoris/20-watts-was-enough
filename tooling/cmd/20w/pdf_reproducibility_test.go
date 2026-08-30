package main

import (
	"bytes"
	"strings"
	"testing"
)

func TestRunPublicationVerifyPDFReproducibilityRequiresAReceipt(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	if exitCode := run(
		[]string{"publication", "verify-pdf-reproducibility", "--ref", "main"},
		&stdout,
		&stderr,
	); exitCode != 2 {
		t.Fatalf("run() exit = %d, stderr = %q", exitCode, stderr.String())
	}
}

func TestRunPublicationVerifyPDFReproducibilityRejectsAMutableRefBeforeDocker(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	if exitCode := run([]string{
		"publication", "verify-pdf-reproducibility",
		"--receipt", "build/evidence/test.json",
		"--ref", "release/latest",
	}, &stdout, &stderr); exitCode != 2 {
		t.Fatalf("run() exit = %d, stderr = %q", exitCode, stderr.String())
	}
	if !strings.Contains(stderr.String(), "source ref must be main or vMAJOR.MINOR.PATCH") {
		t.Fatalf("run() stderr = %q", stderr.String())
	}
}

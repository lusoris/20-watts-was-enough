package main

import (
	"bytes"
	"path/filepath"
	"strings"
	"testing"
)

func TestRunPublicationVerifyPDFToolsIsOfflineAndReportsClosure(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	root := filepath.Clean(filepath.Join("..", "..", ".."))
	exit := run([]string{"publication", "verify-pdf-tools", "--root", root}, &stdout, &stderr)
	if exit != 0 || !strings.Contains(stdout.String(), "45 locked APKs") ||
		!strings.Contains(stdout.String(), "5 Poppler notices") ||
		!strings.Contains(stdout.String(), "33667496 declared APK bytes") {
		t.Fatalf("run() exit/stdout/stderr = %d/%q/%q", exit, stdout.String(), stderr.String())
	}
}

func TestRunPublicationVerifyPDFToolsRejectsUnexpectedArguments(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	if exit := run([]string{"publication", "verify-pdf-tools", "unexpected"}, &stdout, &stderr); exit != 2 {
		t.Fatalf("run() exit = %d, want 2", exit)
	}
}

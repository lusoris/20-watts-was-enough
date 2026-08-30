package main

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

const validPublicTransportManifest = `{
  "schema": 1,
  "http_url": "http://www.cordana.dev/",
  "https_url": "https://www.cordana.dev/",
  "http_status": 301,
  "https_status": 200,
  "redirect_location": "https://www.cordana.dev/",
  "server": "cloudflare",
  "required_header": "CF-Ray",
  "timeout_seconds": 15,
  "minimum_certificate_remaining_days": 14
}`

func TestRunPublicationVerifyPublicTransportCheckIsOffline(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, ".github"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(
		filepath.Join(root, ".github", "public-transport.json"),
		[]byte(validPublicTransportManifest),
		0o644,
	); err != nil {
		t.Fatal(err)
	}
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	exitCode := run([]string{
		"publication", "verify-public-transport", "--root", root, "--check",
	}, &stdout, &stderr)
	if exitCode != 0 || !strings.Contains(stdout.String(), "manifest passed") || stderr.Len() != 0 {
		t.Fatalf("run() exit/stdout/stderr = %d/%q/%q", exitCode, stdout.String(), stderr.String())
	}
}

func TestRunPublicationVerifyPublicTransportRejectsBadUse(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	if exitCode := run([]string{
		"publication", "verify-public-transport", "--check", "extra",
	}, &stdout, &stderr); exitCode != 2 {
		t.Fatalf("run() exit code = %d, want 2", exitCode)
	}
}

func TestRunPublicationVerifyPublicTransportRejectsMissingManifest(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	exitCode := run([]string{
		"publication", "verify-public-transport", "--root", t.TempDir(), "--check",
	}, &stdout, &stderr)
	if exitCode != 1 || !strings.Contains(stderr.String(), "Validate public-transport manifest") {
		t.Fatalf("run() exit/stderr = %d/%q", exitCode, stderr.String())
	}
}

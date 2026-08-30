package pdfrender

import (
	"bytes"
	"slices"
	"strings"
	"testing"
)

func TestGeneratedDockerfileUsesOnlyTheLockedBaseImages(t *testing.T) {
	t.Parallel()
	configuration, err := Check(projectRoot(t))
	if err != nil {
		t.Fatal(err)
	}
	first, err := generateDockerfile(configuration.Lock)
	if err != nil {
		t.Fatalf("generateDockerfile() error = %v", err)
	}
	second, err := generateDockerfile(configuration.Lock)
	if err != nil {
		t.Fatalf("generateDockerfile() second error = %v", err)
	}
	if !bytes.Equal(first, second) {
		t.Fatal("generateDockerfile() is not deterministic")
	}

	fromLines := []string{}
	for line := range strings.Lines(string(first)) {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "FROM ") {
			fromLines = append(fromLines, line)
		}
	}
	want := []string{
		"FROM " + configuration.Lock.Node.Image + " AS node-runtime",
		"FROM " + configuration.Lock.BrowserEnvironment.Image,
	}
	if !slices.Equal(fromLines, want) {
		t.Fatalf("generated FROM instructions = %q, want %q", fromLines, want)
	}
	for _, forbidden := range []string{"FROM ${", "ARG NODE_IMAGE", "ARG PUPPETEER_IMAGE"} {
		if strings.Contains(string(first), forbidden) {
			t.Fatalf("generated Dockerfile contains %q", forbidden)
		}
	}
	if strings.Contains(dockerfileTemplate, "docker.io/") || strings.Contains(dockerfileTemplate, "ghcr.io/") {
		t.Fatal("Dockerfile template contains an external image identity")
	}
}

func TestGeneratedDockerfileRejectsAMutableBaseImage(t *testing.T) {
	t.Parallel()
	configuration, err := Check(projectRoot(t))
	if err != nil {
		t.Fatal(err)
	}
	configuration.Lock.Node.Image = "docker.io/library/node:latest"
	if _, err := generateDockerfile(configuration.Lock); err == nil || !strings.Contains(err.Error(), "immutable image") {
		t.Fatalf("generateDockerfile() error = %v", err)
	}
}

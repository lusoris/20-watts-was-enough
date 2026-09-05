//go:build linux

package pdfrender

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"
	"testing"
	"time"
)

func TestImageProofSubprocessBoundaries(t *testing.T) {
	t.Parallel()
	for _, mode := range []string{"valid", "nonzero", "stderr-overflow", "malformed", "held-pipe"} {
		t.Run(mode, func(t *testing.T) {
			t.Parallel()
			command := exec.Command(os.Args[0], "-test.run=^TestImageProofProcessHelper$")
			command.Env = append(os.Environ(), "PDF_PROOF_HELPER="+mode)
			markerRoot := t.TempDir()
			command.Env = append(command.Env, "PDF_PROOF_MARKER_ROOT="+markerRoot)
			deadline := 2 * time.Second
			if mode == "held-pipe" {
				deadline = 200 * time.Millisecond
			}
			started := time.Now()
			proof, err := inspectImageProofCommand(context.Background(), command, testManifestDigest, testManifestDigest, deadline)
			if mode == "valid" {
				if err != nil || digestBytes(proof.Config) != testProofConfigDigest {
					t.Fatalf("valid subprocess: %+v %v", proof, err)
				}
			} else if err == nil || len(proof.Config) != 0 || len(proof.Manifest) != 0 {
				t.Fatalf("failed subprocess emitted successful proof: %+v %v", proof, err)
			}
			if time.Since(started) > 4*time.Second {
				t.Fatal("subprocess exceeded bounded cancellation margin")
			}
			if mode == "held-pipe" {
				if _, err := os.Stat(filepath.Join(markerRoot, "ready")); err != nil {
					t.Fatal("child did not confirm it was running before timeout")
				}
				// The child writes this marker after 800 ms if it survived. A
				// pipe-close-only cancellation therefore fails this assertion.
				time.Sleep(time.Second)
				if _, err := os.Stat(filepath.Join(markerRoot, "survived")); !os.IsNotExist(err) {
					t.Fatal("owned descendant survived process-group cancellation")
				}
			}
		})
	}
}

func TestImageProofCancelledBeforeStart(t *testing.T) {
	t.Parallel()
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	command := exec.Command("/not/a/command")
	if _, err := inspectImageProofCommand(ctx, command, testManifestDigest, testManifestDigest, time.Second); err == nil || command.Process != nil {
		t.Fatal("cancelled proof started subprocess")
	}
}

func TestImageProofProcessHelper(t *testing.T) {
	mode := os.Getenv("PDF_PROOF_HELPER")
	if mode == "" {
		return
	}
	switch mode {
	case "child":
		root := os.Getenv("PDF_PROOF_MARKER_ROOT")
		if err := os.WriteFile(filepath.Join(root, "ready"), []byte("ready"), 0o600); err != nil {
			os.Exit(10)
		}
		time.Sleep(800 * time.Millisecond)
		if err := os.WriteFile(filepath.Join(root, "survived"), []byte("survived"), 0o600); err != nil {
			os.Exit(11)
		}
		os.Exit(0)
	case "held-pipe":
		command := exec.Command(os.Args[0], "-test.run=^TestImageProofProcessHelper$")
		command.Env = append(os.Environ(), "PDF_PROOF_HELPER=child")
		command.Stdout, command.Stderr = os.Stdout, os.Stderr
		if err := command.Start(); err != nil {
			os.Exit(8)
		}
		for attempt := 0; attempt < 100; attempt++ {
			if _, err := os.Stat(filepath.Join(os.Getenv("PDF_PROOF_MARKER_ROOT"), "ready")); err == nil {
				os.Exit(0)
			}
			time.Sleep(5 * time.Millisecond)
		}
		os.Exit(12)
	case "malformed":
		_, _ = os.Stdout.Write([]byte(strings.Repeat("!", 512)))
		time.Sleep(3 * time.Second)
		os.Exit(0)
	case "stderr-overflow":
		_, _ = os.Stderr.Write([]byte(strings.Repeat("!", maximumDiagnosticBytes+1)))
	case "valid", "nonzero":
	default:
		os.Exit(9)
	}
	_, _ = os.Stdout.Write(testImageProofTar(testImageProofFiles(true)))
	if mode == "nonzero" {
		os.Exit(7)
	}
	os.Exit(0)
}

func TestReproducibilityDockerRoutingIsPinnedAndSanitised(t *testing.T) {
	for _, name := range []string{"DOCKER_HOST", "DOCKER_CONTEXT", "DOCKER_CONFIG", "BUILDX_BUILDER", "BUILDKIT_HOST", "DOCKER_TLS_VERIFY"} {
		t.Setenv(name, "must-not-reach-command")
	}
	environment := reproducibilityDockerEnvironment()
	for _, value := range environment {
		if strings.Contains(value, "must-not-reach-command") {
			t.Fatalf("retained routing override %q", value)
		}
	}
	arguments := []string{"image", "save", "image"}
	pinned := pinnedReproducibilityArguments(arguments)
	if !slices.Equal(pinned, []string{"--host", reproducibilityDockerEndpoint, "image", "save", "image"}) || len(arguments) != 3 {
		t.Fatalf("pinned arguments=%v original=%v", pinned, arguments)
	}
}

func TestImageProofFailedStartAndTimeoutValidation(t *testing.T) {
	t.Parallel()
	command := exec.Command(filepath.Join(t.TempDir(), "missing-command"))
	if _, err := inspectImageProofCommand(context.Background(), command, testManifestDigest, testManifestDigest, time.Second); err == nil {
		t.Fatal("accepted failed start")
	}
	for _, timeout := range []time.Duration{0, -1, 121 * time.Second} {
		t.Run(fmt.Sprint(timeout), func(t *testing.T) {
			command := exec.Command("/not/a/command")
			if _, err := inspectImageProofCommand(context.Background(), command, testManifestDigest, testManifestDigest, timeout); err == nil || command.Process != nil {
				t.Fatal("accepted invalid timeout")
			}
		})
	}
}

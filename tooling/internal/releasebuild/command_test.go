package releasebuild

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strings"
	"testing"
	"time"
)

const helperModeEnvironment = "RELEASEBUILD_TEST_HELPER_MODE"

func TestBoundedOutputRetainsOnlyItsLimit(t *testing.T) {
	t.Parallel()
	output := newBoundedOutput(8)
	if written, err := output.Write([]byte("123456789012")); err != nil || written != 12 {
		t.Fatalf("boundedOutput.Write() = %d, %v; want 12, nil", written, err)
	}
	result := output.result()
	if string(result.output) != "12345678" || !result.exceeded {
		t.Fatalf("bounded output = %q/%t, want first eight bytes and exceeded", result.output, result.exceeded)
	}
}

func TestRunBoundedCommandRejectsOutputFlood(t *testing.T) {
	t.Parallel()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	result, err := runBoundedCommand(
		ctx,
		"",
		append(os.Environ(), helperModeEnvironment+"=flood"),
		os.Args[0],
		"-test.run=^TestReleaseBuildCommandHelper$",
	)
	if err == nil || !strings.Contains(err.Error(), "output exceeds") {
		t.Fatalf("runBoundedCommand() error = %v, want output-limit rejection", err)
	}
	if len(result.output) != maximumCommandOutputBytes || !result.exceeded {
		t.Fatalf("runBoundedCommand() retained %d bytes/exceeded=%t", len(result.output), result.exceeded)
	}
}

func TestRunBoundedCommandHonoursContextDeadline(t *testing.T) {
	t.Parallel()
	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()
	_, err := runBoundedCommand(
		ctx,
		"",
		append(os.Environ(), helperModeEnvironment+"=block"),
		os.Args[0],
		"-test.run=^TestReleaseBuildCommandHelper$",
	)
	if !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("runBoundedCommand() error = %v, want context deadline", err)
	}
}

func TestReleaseBuildCommandHelper(t *testing.T) {
	switch os.Getenv(helperModeEnvironment) {
	case "":
		return
	case "flood":
		fmt.Print(strings.Repeat("x", maximumCommandOutputBytes+1))
	case "block":
		time.Sleep(time.Hour)
	default:
		os.Exit(93)
	}
}

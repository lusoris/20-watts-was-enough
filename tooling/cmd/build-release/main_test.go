package main

import (
	"bytes"
	"context"
	"strings"
	"testing"
)

func TestRunRejectsUnboundedTimeouts(t *testing.T) {
	t.Parallel()
	for _, timeout := range []string{"0", "999h"} {
		var stdout bytes.Buffer
		var stderr bytes.Buffer
		exitCode := run(context.Background(), []string{"--timeout", timeout}, &stdout, &stderr)
		if exitCode != 2 || !strings.Contains(stderr.String(), "timeout must be between") {
			t.Fatalf("run(--timeout %s) = %d, %q; want bounded-use rejection", timeout, exitCode, stderr.String())
		}
	}
}

func TestRunRejectsPositionalArguments(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	exitCode := run(context.Background(), []string{"unexpected"}, &stdout, &stderr)
	if exitCode != 2 || !strings.Contains(stderr.String(), "only named arguments") {
		t.Fatalf("run(positional) = %d, %q; want usage rejection", exitCode, stderr.String())
	}
}

func TestRunRejectsMalformedDuration(t *testing.T) {
	t.Parallel()
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	exitCode := run(context.Background(), []string{"--timeout", "later"}, &stdout, &stderr)
	if exitCode != 2 || stderr.Len() == 0 {
		t.Fatalf("run(malformed timeout) = %d, %q; want flag rejection", exitCode, stderr.String())
	}
}

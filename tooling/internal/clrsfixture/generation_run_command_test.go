package clrsfixture

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"runtime"
	"strconv"
	"strings"
	"testing"
	"time"
)

func generationTestCommand(t *testing.T, mode string, sink io.Writer, limit int64) (generationCommandEvidence, error) {
	t.Helper()
	if runtime.GOOS != "linux" {
		t.Skip("generation process execution is Linux-only")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return executeGenerationCommand(ctx, os.Args[0], []string{"-test.run=^TestGenerationCommandHelper$"},
		[]string{"GENERATION_COMMAND_HELPER=" + mode}, sink, limit)
}

func TestGenerationCommandSuccessStreamingAndExitStatus(t *testing.T) {
	record, err := generationTestCommand(t, "success", nil, 64<<10)
	if err != nil || record.ExitCode != 0 || record.Error != "" || string(record.Stdout) != "hello" || string(record.Stderr) != "warning" ||
		!reflect.DeepEqual(record.Arguments, []string{os.Args[0], "-test.run=^TestGenerationCommandHelper$"}) {
		t.Fatalf("success: %#v %v", record, err)
	}
	var stream bytes.Buffer
	record, err = generationTestCommand(t, "success", &stream, generationRunMaximumTar)
	if err != nil || record.ExitCode != 0 || len(record.Stdout) != 0 || stream.String() != "hello" || string(record.Stderr) != "warning" {
		t.Fatalf("stream: %#v %v, %q", record, err, stream.String())
	}
	record, err = generationTestCommand(t, "exit", nil, 64<<10)
	if err == nil || record.ExitCode != 7 || record.Error == "" {
		t.Fatalf("exit failure: %#v %v", record, err)
	}
}

func TestGenerationCommandOutputBounds(t *testing.T) {
	for _, mode := range []string{"stdout", "stderr", "combined"} {
		t.Run(mode, func(t *testing.T) {
			record, err := generationTestCommand(t, mode, nil, 64<<10)
			if err == nil || !strings.Contains(err.Error(), "byte bound") || record.Error == "" ||
				len(record.Stdout) > 64<<10 || len(record.Stderr) > 1<<20 || len(record.Stdout)+len(record.Stderr) > 1<<20 {
				t.Fatalf("%s bounds: stdout=%d stderr=%d err=%v", mode, len(record.Stdout), len(record.Stderr), err)
			}
		})
	}
	var stream bytes.Buffer
	record, err := generationTestCommand(t, "stdout", &stream, 1024)
	if err == nil || stream.Len() != 1024 || len(record.Stdout) != 0 || record.Error == "" {
		t.Fatalf("stream bound: retained=%d record=%#v err=%v", stream.Len(), record, err)
	}
}

type generationCountWriter int64

func (writer *generationCountWriter) Write(body []byte) (int, error) {
	*writer += generationCountWriter(len(body))
	return len(body), nil
}

func TestGenerationCommandStreamsWholeTarBudgetWithoutCapture(t *testing.T) {
	for _, mode := range []string{"stream-exact", "stream-excess"} {
		var sink generationCountWriter
		record, err := generationTestCommand(t, mode, &sink, generationRunMaximumTar)
		if int64(sink) != generationRunMaximumTar || len(record.Stdout) != 0 || len(record.Stderr) != 0 {
			t.Fatalf("%s: bytes=%d record=%#v", mode, sink, record)
		}
		if (err != nil) != (mode == "stream-excess") || (err == nil && record.ExitCode != 0) {
			t.Fatalf("%s: code=%d error=%v", mode, record.ExitCode, err)
		}
	}
}

func TestGenerationCommandRejectsMissingBoundsBeforeStart(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	for _, test := range []struct {
		ctx   context.Context
		limit int64
		sink  io.Writer
	}{
		{nil, 1024, nil}, {context.Background(), 1024, nil},
		{ctx, 0, nil}, {ctx, (64 << 10) + 1, nil},
		{ctx, generationRunMaximumTar + 1, io.Discard},
	} {
		record, err := executeGenerationCommand(test.ctx, "/unused", nil, nil, test.sink, test.limit)
		if err == nil || record.ExitCode != -1 || record.Error == "" || len(record.Stdout)+len(record.Stderr) != 0 {
			t.Fatalf("preflight: %#v, %v", record, err)
		}
	}
	record, err := executeGenerationCommand(ctx, filepath.Join(t.TempDir(), "absent"), nil, nil, nil, 1024)
	if err == nil || record.ExitCode != -1 || record.Error == "" {
		t.Fatalf("start failure: %#v, %v", record, err)
	}
	cancel()
	record, err = executeGenerationCommand(ctx, "/unused", nil, nil, nil, 1024)
	if !errors.Is(err, context.Canceled) || record.ExitCode != -1 {
		t.Fatalf("pre-cancelled: %#v, %v", record, err)
	}
}

type generationBadWriter struct{ err error }

func (writer generationBadWriter) Write([]byte) (int, error) { return 0, writer.err }

func TestGenerationCommandSinkFailuresCancel(t *testing.T) {
	want := errors.New("owned sink failed")
	for _, sinkErr := range []error{nil, want} {
		record, err := generationTestCommand(t, "success", generationBadWriter{sinkErr}, 1024)
		cause := want
		if sinkErr == nil {
			cause = io.ErrShortWrite
		}
		if !errors.Is(err, cause) || record.Error == "" || len(record.Stdout) != 0 {
			t.Fatalf("sink failure: %#v %v", record, err)
		}
	}
}

func TestGenerationCommandWriterSharedExactBudget(t *testing.T) {
	ctx, cancel := context.WithCancelCause(context.Background())
	defer cancel(nil)
	budget := &generationCommandBudget{remaining: 3}
	var first, second bytes.Buffer
	a := generationCommandWriter{destination: &first, remaining: 3, shared: budget, cancel: cancel}
	b := generationCommandWriter{destination: &second, remaining: 3, shared: budget, cancel: cancel}
	if n, err := a.Write([]byte("ab")); n != 2 || err != nil {
		t.Fatalf("first write: %d %v", n, err)
	}
	if n, err := b.Write([]byte("c")); n != 1 || err != nil || budget.remaining != 0 {
		t.Fatalf("exact combined cap: %d %v remaining=%d", n, err, budget.remaining)
	}
	if n, err := b.Write([]byte("d")); n != 0 || err == nil || context.Cause(ctx) == nil || first.String()+second.String() != "abc" {
		t.Fatalf("combined excess: %d %v", n, err)
	}
}

func TestGenerationCommandDeadlineKillsOwnedDescendant(t *testing.T) {
	if runtime.GOOS != "linux" {
		t.Skip("generation process execution is Linux-only")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()
	started := time.Now()
	record, err := executeGenerationCommand(ctx, os.Args[0], []string{"-test.run=^TestGenerationCommandHelper$"},
		[]string{"GENERATION_COMMAND_HELPER=parent"}, nil, 1024)
	if !errors.Is(err, context.DeadlineExceeded) || record.Error == "" || time.Since(started) > 4*time.Second {
		t.Fatalf("deadline: %#v %v", record, err)
	}
	pid, err := strconv.Atoi(strings.TrimSpace(string(record.Stdout)))
	if err != nil || pid < 1 {
		t.Fatalf("missing owned-child handshake: %q", record.Stdout)
	}
	assertGenerationChildTerminated(t, pid)
}

func assertGenerationChildTerminated(t *testing.T, pid int) {
	t.Helper()
	for attempt := 0; attempt < 20; attempt++ {
		body, err := os.ReadFile(fmt.Sprintf("/proc/%d/stat", pid))
		if os.IsNotExist(err) {
			return
		}
		_, state, found := strings.Cut(string(body), ") ")
		if err == nil && found && strings.HasPrefix(state, "Z ") {
			return
		}
		time.Sleep(10 * time.Millisecond)
	}
	// A regression must not leave its known helper running. Confirm its unique
	// test role before killing only this observed PID; never kill by name.
	environment, err := os.ReadFile(fmt.Sprintf("/proc/%d/environ", pid))
	if err == nil && bytes.Contains(environment, []byte("GENERATION_COMMAND_HELPER=child\x00")) {
		process, findErr := os.FindProcess(pid)
		if findErr == nil {
			_ = process.Kill()
		}
	}
	t.Fatal("owned child survived generator process-group cancellation")
}

func TestGenerationCommandHostEnvironmentExcludesDockerOverrides(t *testing.T) {
	t.Setenv("DOCKER_HOST", "tcp://invalid")
	t.Setenv("DOCKER_CONTEXT", "unreviewed")
	t.Setenv("DOCKER_CONFIG", "/unreviewed")
	t.Setenv("DOCKER_TLS_VERIFY", "1")
	allowed := map[string]bool{"LANG": true, "LC_ALL": true, "TZ": true, "HOME": true, "PATH": true, "XDG_RUNTIME_DIR": true}
	for _, entry := range promiseHostEnvironment() {
		key, _, _ := strings.Cut(entry, "=")
		if !allowed[key] {
			t.Fatalf("unexpected environment key %s", key)
		}
	}
}

func TestGenerationCommandHelper(t *testing.T) {
	switch os.Getenv("GENERATION_COMMAND_HELPER") {
	case "success":
		_, _ = io.WriteString(os.Stdout, "hello")
		_, _ = io.WriteString(os.Stderr, "warning")
	case "exit":
		os.Exit(7)
	case "stdout":
		_, _ = io.WriteString(os.Stdout, strings.Repeat("x", (64<<10)+1))
	case "stderr":
		_, _ = io.WriteString(os.Stderr, strings.Repeat("x", (1<<20)+1))
	case "combined":
		_, _ = io.WriteString(os.Stdout, strings.Repeat("x", 64<<10))
		_, _ = io.WriteString(os.Stderr, strings.Repeat("x", 1<<20))
	case "stream-exact", "stream-excess":
		remaining := int64(generationRunMaximumTar)
		if os.Getenv("GENERATION_COMMAND_HELPER") == "stream-excess" {
			remaining++
		}
		chunk := strings.Repeat("x", 4096)
		for remaining > 0 {
			n, err := io.WriteString(os.Stdout, chunk[:min(int64(len(chunk)), remaining)])
			if err != nil {
				os.Exit(3)
			}
			remaining -= int64(n)
		}
	case "parent":
		child := exec.Command(os.Args[0], "-test.run=^TestGenerationCommandHelper$")
		child.Env = []string{"GENERATION_COMMAND_HELPER=child"}
		child.Stdout, child.Stderr = os.Stdout, os.Stderr
		if err := child.Start(); err != nil {
			os.Exit(2)
		}
		_, _ = fmt.Fprintln(os.Stdout, child.Process.Pid)
		time.Sleep(10 * time.Second)
	case "child":
		time.Sleep(10 * time.Second)
	default:
		return
	}
	os.Exit(0)
}

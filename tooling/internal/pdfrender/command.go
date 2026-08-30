package pdfrender

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"os/exec"
	"strings"
	"sync"
	"time"
)

const (
	maximumDiagnosticBytes = 8 * 1024
	maximumWaitDelay       = 5 * time.Second
)

type commandRequest struct {
	operation  string
	directory  string
	timeout    time.Duration
	outputSize int
	arguments  []string
}

type commandExecutor interface {
	run(context.Context, commandRequest) ([]byte, error)
}

type localCommandExecutor struct{}

type boundedOutput struct {
	mutex    sync.Mutex
	buffer   bytes.Buffer
	limit    int
	exceeded bool
}

func (output *boundedOutput) Write(body []byte) (int, error) {
	output.mutex.Lock()
	defer output.mutex.Unlock()
	available := output.limit - output.buffer.Len()
	if available > len(body) {
		available = len(body)
	}
	if available > 0 {
		_, _ = output.buffer.Write(body[:available])
	}
	if available < len(body) {
		output.exceeded = true
	}
	return len(body), nil
}

func (output *boundedOutput) result() ([]byte, bool) {
	output.mutex.Lock()
	defer output.mutex.Unlock()
	return bytes.Clone(output.buffer.Bytes()), output.exceeded
}

func (localCommandExecutor) run(ctx context.Context, request commandRequest) ([]byte, error) {
	if request.timeout <= 0 || request.outputSize <= 0 || len(request.arguments) == 0 {
		return nil, errors.New("invalid bounded subprocess request")
	}
	commandContext, cancel := context.WithTimeout(ctx, request.timeout)
	defer cancel()
	output := &boundedOutput{limit: request.outputSize}
	command := exec.CommandContext(commandContext, "docker", request.arguments...)
	command.Dir = request.directory
	command.Stdout = output
	command.Stderr = output
	command.WaitDelay = maximumWaitDelay
	err := command.Run()
	result, exceeded := output.result()
	if commandContext.Err() != nil {
		return result, fmt.Errorf("%s: %w", request.operation, commandContext.Err())
	}
	if exceeded {
		return result, fmt.Errorf("%s: subprocess output exceeds %d bytes", request.operation, request.outputSize)
	}
	if err != nil {
		return result, commandFailure(request.operation, err, result)
	}
	return result, nil
}

func commandFailure(operation string, err error, output []byte) error {
	diagnostic := strings.TrimSpace(string(output))
	if len(diagnostic) > maximumDiagnosticBytes {
		diagnostic = diagnostic[:maximumDiagnosticBytes] + "..."
	}
	if diagnostic == "" {
		return fmt.Errorf("%s: %w", operation, err)
	}
	return fmt.Errorf("%s: %w: %s", operation, err, diagnostic)
}

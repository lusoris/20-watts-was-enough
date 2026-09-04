package pdfrender

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"sync"
	"time"
)

const (
	maximumDiagnosticBytes = 8 * 1024
	maximumWaitDelay       = 5 * time.Second
	sourceRevisionTimeout  = 15 * time.Second
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

// verifySourceRevision rejects a revision-bound render unless the checked-out
// repository HEAD is the exact commit already verified by release preflight.
func verifySourceRevision(ctx context.Context, root, sourceRef, expected string) error {
	if err := ValidateSourceRevision(sourceRef, expected); err != nil {
		return err
	}
	if expected == "" {
		return nil
	}
	gitExecutable, err := exec.LookPath("git")
	if err != nil {
		return errors.New("locate Git executable for PDF source revision")
	}
	commandContext, cancel := context.WithTimeout(ctx, sourceRevisionTimeout)
	defer cancel()
	standardOutput := &boundedOutput{limit: 128}
	standardError := &boundedOutput{limit: maximumDiagnosticBytes}
	command := exec.CommandContext(
		commandContext,
		gitExecutable,
		"-C", root,
		"rev-parse", "--verify", "HEAD^{commit}",
	)
	command.Env = boundedGitEnvironment()
	command.Stdout = standardOutput
	command.Stderr = standardError
	command.WaitDelay = maximumWaitDelay
	runError := command.Run()
	resolvedBytes, outputExceeded := standardOutput.result()
	diagnostic, diagnosticExceeded := standardError.result()
	if commandContext.Err() != nil {
		return fmt.Errorf("resolve PDF source revision: %w", commandContext.Err())
	}
	if outputExceeded || diagnosticExceeded {
		return errors.New("resolve PDF source revision: subprocess output exceeded its bound")
	}
	if runError != nil {
		return commandFailure("resolve PDF source revision", runError, diagnostic)
	}
	resolved := strings.TrimSpace(string(resolvedBytes))
	if !gitRevisionPattern.MatchString(resolved) {
		return errors.New("resolved PDF source revision is not a lowercase 40-character Git identity")
	}
	if resolved != expected {
		return fmt.Errorf("PDF source revision is %s, not verified commit %s", resolved, expected)
	}
	return nil
}

func boundedGitEnvironment() []string {
	environment := []string{
		"GIT_CONFIG_GLOBAL=" + os.DevNull,
		"GIT_CONFIG_NOSYSTEM=1",
		"GIT_OPTIONAL_LOCKS=0",
		"LANG=C",
		"LC_ALL=C",
	}
	for _, name := range []string{"PATH", "PATHEXT", "SYSTEMROOT", "TEMP", "TMP", "TMPDIR", "WINDIR"} {
		if value, present := os.LookupEnv(name); present {
			environment = append(environment, name+"="+value)
		}
	}
	return environment
}

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

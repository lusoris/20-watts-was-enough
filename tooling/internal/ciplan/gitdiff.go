package ciplan

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"time"
)

const (
	gitDiffTimeout       = 15 * time.Second
	maximumGitDiffBytes  = 1 << 20
	maximumGitErrorBytes = 64 << 10
)

var (
	revisionPattern = regexp.MustCompile(`^[0-9a-f]{40}$`)
	scorePattern    = regexp.MustCompile(`^[RC][0-9]{1,3}$`)
)

func readGitChangedPaths(
	ctx context.Context,
	root, baseRevision, headRevision string,
) ([]string, bool, error) {
	gitExecutable, err := exec.LookPath("git")
	if err != nil {
		return nil, false, errors.New("locate Git executable")
	}
	diffContext, cancel := context.WithTimeout(ctx, gitDiffTimeout)
	defer cancel()
	standardOutput := newBoundedBuffer(maximumGitDiffBytes)
	standardError := newBoundedBuffer(maximumGitErrorBytes)
	command := exec.CommandContext(
		diffContext,
		gitExecutable,
		"-C", root,
		"diff", "--no-ext-diff", "--no-textconv", "--find-renames",
		"--name-status", "-z", baseRevision+"..."+headRevision, "--",
	)
	command.Env = boundedGitEnvironment()
	command.Stdout = standardOutput
	command.Stderr = standardError
	command.WaitDelay = time.Second
	if err := command.Run(); err != nil {
		return nil, false, fmt.Errorf("run bounded Git diff: %w", err)
	}
	return parseNameStatus(standardOutput.Bytes())
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

func parseNameStatus(body []byte) ([]string, bool, error) {
	if len(body) == 0 {
		return []string{}, false, nil
	}
	if body[len(body)-1] != 0 {
		return nil, false, errors.New("Git name-status output is truncated")
	}
	tokens := bytes.Split(body[:len(body)-1], []byte{0})
	paths := make(map[string]struct{})
	requiresFull := false
	for index := 0; index < len(tokens); {
		status := string(tokens[index])
		index++
		pathCount, nonAdditive, err := statusPathCount(status)
		if err != nil || index+pathCount > len(tokens) {
			return nil, false, errors.New("Git name-status output is malformed")
		}
		requiresFull = requiresFull || nonAdditive
		for offset := 0; offset < pathCount; offset++ {
			changedPath := string(tokens[index+offset])
			if !validChangedPath(changedPath) {
				return nil, false, errors.New("Git diff contains an unsafe path")
			}
			paths[changedPath] = struct{}{}
			if len(paths) > maximumChanges {
				return nil, false, errors.New("Git diff exceeds the changed-path limit")
			}
		}
		index += pathCount
	}
	result := sortedKeys(paths)
	return result, requiresFull, nil
}

func statusPathCount(status string) (int, bool, error) {
	if status == "A" || status == "M" {
		return 1, false, nil
	}
	if status == "D" || status == "T" {
		return 1, true, nil
	}
	if scorePattern.MatchString(status) {
		score, err := strconv.Atoi(status[1:])
		if err != nil || score > 100 {
			return 0, false, fmt.Errorf("unsupported Git status %q", status)
		}
		return 2, true, nil
	}
	return 0, false, fmt.Errorf("unsupported Git status %q", status)
}

type boundedBuffer struct {
	buffer bytes.Buffer
	limit  int
}

func newBoundedBuffer(limit int) *boundedBuffer {
	return &boundedBuffer{limit: limit}
}

func (buffer *boundedBuffer) Write(body []byte) (int, error) {
	remaining := buffer.limit - buffer.buffer.Len()
	if remaining <= 0 {
		return 0, errors.New("subprocess output limit exceeded")
	}
	if len(body) > remaining {
		written, _ := buffer.buffer.Write(body[:remaining])
		return written, io.ErrShortWrite
	}
	return buffer.buffer.Write(body)
}

func (buffer *boundedBuffer) Bytes() []byte {
	return buffer.buffer.Bytes()
}

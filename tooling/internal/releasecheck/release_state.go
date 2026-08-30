package releasecheck

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os/exec"
	"strconv"
	"strings"
)

// ReleaseState is the exact GitHub Release state associated with one tag.
type ReleaseState struct {
	Present    bool   `json:"present"`
	ID         int64  `json:"id"`
	Tag        string `json:"tag"`
	Draft      bool   `json:"draft"`
	Prerelease bool   `json:"prerelease"`
	Immutable  bool   `json:"immutable"`
}

// ReleaseStateResolver performs the one remote read needed to resolve a tag.
type ReleaseStateResolver interface {
	ResolveReleaseState(context.Context, string, string) (ReleaseState, error)
}

// GHReleaseStateResolver resolves releases through the authenticated gh CLI.
type GHReleaseStateResolver struct{}

// LookupReleaseState validates both the requested identity and the returned
// release object. A missing tag is an explicit non-error state.
func LookupReleaseState(
	ctx context.Context,
	repository, tag string,
	resolver ReleaseStateResolver,
) (ReleaseState, error) {
	if ctx == nil {
		return ReleaseState{}, errors.New("release state context is required")
	}
	if !repositoryPattern.MatchString(repository) {
		return ReleaseState{}, errors.New("GitHub repository must be an owner/name pair")
	}
	if !releaseTagPattern.MatchString(tag) {
		return ReleaseState{}, errors.New("release tag must be vMAJOR.MINOR.PATCH")
	}
	if resolver == nil {
		return ReleaseState{}, errors.New("GitHub Release state resolver is required")
	}
	state, err := resolver.ResolveReleaseState(ctx, repository, tag)
	if err != nil {
		return ReleaseState{}, fmt.Errorf("resolve GitHub Release state: %w", err)
	}
	if !state.Present {
		if state.ID != 0 || state.Tag != "" || state.Draft || state.Prerelease || state.Immutable {
			return ReleaseState{}, errors.New("absent GitHub Release state contains present-release fields")
		}
		return state, nil
	}
	if state.ID <= 0 {
		return ReleaseState{}, errors.New("GitHub Release state has a nonpositive ID")
	}
	if state.Tag != tag {
		return ReleaseState{}, fmt.Errorf("GitHub Release resolves tag %s, expected %s", valueOrMissing(state.Tag), tag)
	}
	return state, nil
}

func (GHReleaseStateResolver) ResolveReleaseState(
	ctx context.Context,
	repository, tag string,
) (ReleaseState, error) {
	requestContext, cancel := context.WithTimeout(ctx, githubAPIRequestTimeout)
	defer cancel()
	stdout := &boundedBuffer{limit: maximumGHOutputBytes}
	stderr := &boundedBuffer{limit: maximumGHOutputBytes}
	command := exec.CommandContext(
		requestContext,
		"gh",
		"api",
		fmt.Sprintf("repos/%s/releases/tags/%s", repository, tag),
		"-H", githubAPIAcceptHeader,
		"-H", githubAPIVersionHeader,
		"--include",
		"--jq", "{id, tag_name, draft, prerelease, immutable}",
	)
	command.Stdout = stdout
	command.Stderr = stderr
	command.WaitDelay = githubAPICommandWaitDelay
	commandError := command.Run()
	if requestContext.Err() != nil {
		return ReleaseState{}, fmt.Errorf("GitHub API request: %w", requestContext.Err())
	}
	if stdout.Exceeded() || stderr.Exceeded() {
		return ReleaseState{}, errors.New("GitHub Release state response exceeds its bounded output size")
	}
	status, body, err := parseIncludedGitHubResponse(stdout.Bytes())
	if err != nil {
		return ReleaseState{}, err
	}
	switch status {
	case 404:
		if err := validateSingleJSONValue(body); err != nil {
			return ReleaseState{}, fmt.Errorf("validate absent GitHub Release response: %w", err)
		}
		return ReleaseState{}, nil
	case 200:
		if commandError != nil {
			return ReleaseState{}, fmt.Errorf(
				"GitHub Release lookup failed: %w: %s",
				commandError,
				boundedDiagnostic(stderr.String()),
			)
		}
		return decodePresentReleaseState(body)
	default:
		if commandError == nil {
			commandError = errors.New("unexpected successful gh exit status")
		}
		return ReleaseState{}, fmt.Errorf(
			"GitHub Release lookup returned HTTP %d: %w: %s",
			status,
			commandError,
			boundedDiagnostic(stderr.String()),
		)
	}
}

func parseIncludedGitHubResponse(response []byte) (int, []byte, error) {
	separator := []byte("\n\n")
	separatorIndex := bytes.Index(response, separator)
	if crlfIndex := bytes.Index(response, []byte("\r\n\r\n")); crlfIndex >= 0 &&
		(separatorIndex < 0 || crlfIndex < separatorIndex) {
		separator = []byte("\r\n\r\n")
		separatorIndex = crlfIndex
	}
	if separatorIndex < 0 {
		return 0, nil, errors.New("GitHub Release response is missing its included HTTP header block")
	}
	header := string(response[:separatorIndex])
	header = strings.ReplaceAll(header, "\r\n", "\n")
	if strings.ContainsRune(header, '\r') {
		return 0, nil, errors.New("GitHub Release response contains malformed header line endings")
	}
	lines := strings.Split(header, "\n")
	if len(lines) == 0 {
		return 0, nil, errors.New("GitHub Release response has an empty HTTP header block")
	}
	for _, line := range lines[1:] {
		if strings.HasPrefix(line, "HTTP/") {
			return 0, nil, errors.New("GitHub Release response contains multiple HTTP status blocks")
		}
	}
	fields := strings.Fields(lines[0])
	if len(fields) < 2 || !strings.HasPrefix(fields[0], "HTTP/") || len(fields[1]) != 3 {
		return 0, nil, errors.New("GitHub Release response has a malformed HTTP status line")
	}
	status, err := strconv.Atoi(fields[1])
	if err != nil || status < 100 || status > 599 {
		return 0, nil, errors.New("GitHub Release response has a malformed HTTP status code")
	}
	body := bytes.Clone(response[separatorIndex+len(separator):])
	if len(bytes.TrimSpace(body)) == 0 {
		return 0, nil, errors.New("GitHub Release response has an empty JSON body")
	}
	return status, body, nil
}

func validateSingleJSONValue(body []byte) error {
	decoder := json.NewDecoder(bytes.NewReader(body))
	var value any
	if err := decoder.Decode(&value); err != nil {
		return fmt.Errorf("decode JSON: %w", err)
	}
	if err := decoder.Decode(&struct{}{}); !errors.Is(err, io.EOF) {
		return errors.New("response contains trailing data or another response block")
	}
	return nil
}

func decodePresentReleaseState(body []byte) (ReleaseState, error) {
	decoder := json.NewDecoder(bytes.NewReader(body))
	decoder.DisallowUnknownFields()
	var raw struct {
		ID         *int64  `json:"id"`
		Tag        *string `json:"tag_name"`
		Draft      *bool   `json:"draft"`
		Prerelease *bool   `json:"prerelease"`
		Immutable  *bool   `json:"immutable"`
	}
	if err := decoder.Decode(&raw); err != nil {
		return ReleaseState{}, fmt.Errorf("decode GitHub Release state: %w", err)
	}
	if err := decoder.Decode(&struct{}{}); !errors.Is(err, io.EOF) {
		return ReleaseState{}, errors.New("GitHub Release state contains trailing data or another response block")
	}
	if raw.ID == nil || raw.Tag == nil || raw.Draft == nil || raw.Prerelease == nil || raw.Immutable == nil {
		return ReleaseState{}, errors.New("GitHub Release state is missing an exact required field")
	}
	return ReleaseState{
		Present:    true,
		ID:         *raw.ID,
		Tag:        *raw.Tag,
		Draft:      *raw.Draft,
		Prerelease: *raw.Prerelease,
		Immutable:  *raw.Immutable,
	}, nil
}

func boundedDiagnostic(diagnostic string) string {
	diagnostic = strings.TrimSpace(diagnostic)
	const maximumDiagnosticBytes = 4096
	if len(diagnostic) > maximumDiagnosticBytes {
		return diagnostic[:maximumDiagnosticBytes] + "..."
	}
	return diagnostic
}

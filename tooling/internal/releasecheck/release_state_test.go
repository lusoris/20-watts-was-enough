package releasecheck

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"testing"
)

func TestReleaseStateJSONAlwaysUsesTheClosedSixFieldSchema(t *testing.T) {
	t.Parallel()
	for _, test := range []struct {
		name  string
		state ReleaseState
		want  string
	}{
		{
			name: "absent",
			want: `{"present":false,"id":0,"tag":"","draft":false,"prerelease":false,"immutable":false}`,
		},
		{
			name: "present",
			state: ReleaseState{
				Present: true,
				ID:      7,
				Tag:     testReleaseTag,
				Draft:   true,
			},
			want: `{"present":true,"id":7,"tag":"v1.2.3","draft":true,"prerelease":false,"immutable":false}`,
		},
	} {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			body, err := json.Marshal(test.state)
			if err != nil || string(body) != test.want {
				t.Fatalf("json.Marshal(ReleaseState) = %q, %v; want %q", body, err, test.want)
			}
		})
	}
}

type fakeReleaseStateResolver struct {
	state ReleaseState
	err   error
	calls int
}

func (resolver *fakeReleaseStateResolver) ResolveReleaseState(
	_ context.Context,
	_, _ string,
) (ReleaseState, error) {
	resolver.calls++
	return resolver.state, resolver.err
}

func TestParseIncludedGitHubResponseAcceptsStrictCRLFAnd404JSON(t *testing.T) {
	t.Parallel()
	response := []byte("HTTP/2 404 Not Found\r\ncontent-type: application/json\r\n\r\n{\"message\":\"Not Found\"}\r\n")
	status, body, err := parseIncludedGitHubResponse(response)
	if err != nil {
		t.Fatalf("parseIncludedGitHubResponse() error = %v", err)
	}
	if status != 404 {
		t.Fatalf("status = %d, want 404", status)
	}
	if err := validateSingleJSONValue(body); err != nil {
		t.Fatalf("validateSingleJSONValue() error = %v", err)
	}
}

func TestParseIncludedGitHubResponseRejectsMalformedOrMultipleBlocks(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name     string
		response string
		want     string
	}{
		{
			name:     "missing included headers",
			response: `{}`,
			want:     "missing its included HTTP header block",
		},
		{
			name:     "malformed status",
			response: "HTTP/2 nope\n\n{}",
			want:     "malformed HTTP status line",
		},
		{
			name:     "mixed line endings",
			response: "HTTP/2 200 OK\r\ncontent-type: application/json\r\nstray\rline\r\n\r\n{}",
			want:     "malformed header line endings",
		},
		{
			name:     "multiple status blocks in headers",
			response: "HTTP/2 200 OK\nHTTP/2 404 Not Found\n\n{}",
			want:     "multiple HTTP status blocks",
		},
		{
			name:     "empty body",
			response: "HTTP/2 200 OK\n\n \n",
			want:     "empty JSON body",
		},
	}
	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			_, _, err := parseIncludedGitHubResponse([]byte(test.response))
			if err == nil || !strings.Contains(err.Error(), test.want) {
				t.Fatalf("parseIncludedGitHubResponse() error = %v, want %q", err, test.want)
			}
		})
	}
}

func TestReleaseStateJSONRejectsTrailingResponseBlocksAndNonExactObjects(t *testing.T) {
	t.Parallel()
	valid := `{"id":7,"tag_name":"v1.2.3","draft":true,"prerelease":false,"immutable":false}`
	tests := []struct {
		name string
		body string
		want string
	}{
		{
			name: "trailing JSON",
			body: valid + ` {}`,
			want: "trailing data or another response block",
		},
		{
			name: "trailing HTTP block",
			body: valid + "\nHTTP/2 200 OK\n\n{}",
			want: "trailing data or another response block",
		},
		{
			name: "unknown field",
			body: strings.TrimSuffix(valid, "}") + `,"extra":true}`,
			want: "unknown field",
		},
		{
			name: "missing field",
			body: `{"id":7,"tag_name":"v1.2.3","draft":true,"prerelease":false}`,
			want: "missing an exact required field",
		},
	}
	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			_, err := decodePresentReleaseState([]byte(test.body))
			if err == nil || !strings.Contains(err.Error(), test.want) {
				t.Fatalf("decodePresentReleaseState() error = %v, want %q", err, test.want)
			}
		})
	}

	for _, body := range []string{
		`{"message":"Not Found"} {}`,
		"{\"message\":\"Not Found\"}\nHTTP/2 404 Not Found\n\n{}",
	} {
		if err := validateSingleJSONValue([]byte(body)); err == nil || !strings.Contains(err.Error(), "trailing data or another response block") {
			t.Fatalf("validateSingleJSONValue(%q) error = %v, want trailing block rejection", body, err)
		}
	}
}

func TestLookupReleaseStateValidatesRequestBeforeResolving(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name       string
		ctx        context.Context
		repository string
		tag        string
		resolver   ReleaseStateResolver
		want       string
	}{
		{
			name:       "nil context",
			ctx:        nil,
			repository: testReleaseRepository,
			tag:        testReleaseTag,
			resolver:   &fakeReleaseStateResolver{},
			want:       "context is required",
		},
		{
			name:       "unsafe repository",
			ctx:        context.Background(),
			repository: "../project",
			tag:        testReleaseTag,
			resolver:   &fakeReleaseStateResolver{},
			want:       "owner/name pair",
		},
		{
			name:       "invalid tag",
			ctx:        context.Background(),
			repository: testReleaseRepository,
			tag:        "latest",
			resolver:   &fakeReleaseStateResolver{},
			want:       "vMAJOR.MINOR.PATCH",
		},
		{
			name:       "nil resolver",
			ctx:        context.Background(),
			repository: testReleaseRepository,
			tag:        testReleaseTag,
			resolver:   nil,
			want:       "resolver is required",
		},
	}
	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			_, err := LookupReleaseState(test.ctx, test.repository, test.tag, test.resolver)
			if err == nil || !strings.Contains(err.Error(), test.want) {
				t.Fatalf("LookupReleaseState() error = %v, want %q", err, test.want)
			}
			if resolver, ok := test.resolver.(*fakeReleaseStateResolver); ok && resolver.calls != 0 {
				t.Fatalf("resolver calls = %d, want none", resolver.calls)
			}
		})
	}
}

func TestLookupReleaseStateValidatesResolvedState(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name  string
		state ReleaseState
		err   error
		want  string
	}{
		{
			name: "resolver error",
			err:  errors.New("offline"),
			want: "resolve GitHub Release state: offline",
		},
		{
			name:  "dirty absent state",
			state: ReleaseState{ID: 7},
			want:  "absent GitHub Release state contains present-release fields",
		},
		{
			name:  "nonpositive present ID",
			state: ReleaseState{Present: true, Tag: testReleaseTag},
			want:  "nonpositive ID",
		},
		{
			name:  "wrong tag",
			state: ReleaseState{Present: true, ID: 7, Tag: "v1.2.4"},
			want:  "resolves tag v1.2.4, expected v1.2.3",
		},
	}
	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			resolver := &fakeReleaseStateResolver{state: test.state, err: test.err}
			_, err := LookupReleaseState(context.Background(), testReleaseRepository, testReleaseTag, resolver)
			if err == nil || !strings.Contains(err.Error(), test.want) {
				t.Fatalf("LookupReleaseState() error = %v, want %q", err, test.want)
			}
			if resolver.calls != 1 {
				t.Fatalf("resolver calls = %d, want 1", resolver.calls)
			}
		})
	}
}

func TestLookupReleaseStateAcceptsAbsentAndExactPresentStates(t *testing.T) {
	t.Parallel()
	states := []ReleaseState{
		{},
		{Present: true, ID: 7, Tag: testReleaseTag, Draft: true, Immutable: false},
	}
	for _, want := range states {
		resolver := &fakeReleaseStateResolver{state: want}
		got, err := LookupReleaseState(context.Background(), testReleaseRepository, testReleaseTag, resolver)
		if err != nil {
			t.Fatalf("LookupReleaseState(%+v) error = %v", want, err)
		}
		if got != want {
			t.Fatalf("LookupReleaseState() = %+v, want %+v", got, want)
		}
	}
}

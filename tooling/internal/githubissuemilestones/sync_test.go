package githubissuemilestones

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
)

type testMilestones map[string]int

func (milestones testMilestones) Includes(id string) bool {
	_, ok := milestones[id]
	return ok
}

func (milestones testMilestones) Number(id string) (int, bool) {
	number, ok := milestones[id]
	return number, ok
}

func testMapping() Manifest {
	return Manifest{
		Schema: 1, Repository: "owner/repository",
		Assignments: []Assignment{{Issue: 7, Milestone: "M0"}, {Issue: 8, Milestone: "M1"}},
	}
}

func writeIssue(t *testing.T, writer http.ResponseWriter, issue remoteIssue, status int) {
	t.Helper()
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	if err := json.NewEncoder(writer).Encode(issue); err != nil {
		t.Fatal(err)
	}
}

func TestIssueAssignmentsPreflightApplyVerifyAndRetryIdempotently(t *testing.T) {
	t.Parallel()
	milestones := testMilestones{"M0": 101, "M1": 102}
	remote := map[int]remoteIssue{
		7: {Number: 7, NodeID: "ISSUE_7", State: "open", Milestone: &remoteMilestone{Number: 101}},
		8: {Number: 8, NodeID: "ISSUE_8", State: "open"},
	}
	var mutex sync.Mutex
	patches := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		mutex.Lock()
		defer mutex.Unlock()
		if request.Header.Get("Authorization") != "Bearer token" || request.Header.Get("X-GitHub-Api-Version") != apiVersion {
			http.Error(writer, "missing identity", http.StatusUnauthorized)
			return
		}
		var number int
		if _, err := fmt.Sscanf(request.URL.Path, "/repos/owner/repository/issues/%d", &number); err != nil {
			http.Error(writer, "bad path", http.StatusBadRequest)
			return
		}
		issue, ok := remote[number]
		if !ok {
			http.NotFound(writer, request)
			return
		}
		switch request.Method {
		case http.MethodGet:
			writeIssue(t, writer, issue, http.StatusOK)
		case http.MethodPatch:
			var payload issuePayload
			if err := json.NewDecoder(request.Body).Decode(&payload); err != nil {
				http.Error(writer, "bad body", http.StatusBadRequest)
				return
			}
			patches++
			issue.Milestone = &remoteMilestone{Number: payload.Milestone}
			remote[number] = issue
			writeIssue(t, writer, issue, http.StatusOK)
		default:
			http.Error(writer, "bad method", http.StatusMethodNotAllowed)
		}
	}))
	defer server.Close()
	options := Options{APIBase: server.URL, Repository: "owner/repository", Token: "token"}

	plan, err := Preflight(context.Background(), server.Client(), testMapping(), options, milestones)
	if err != nil {
		t.Fatal(err)
	}
	result, err := plan.Apply(context.Background(), server.Client(), options, milestones)
	if err != nil {
		t.Fatal(err)
	}
	if result != (Result{Updated: 1, Unchanged: 1}) {
		t.Fatalf("Apply() = %#v", result)
	}
	if err := plan.Verify(context.Background(), server.Client(), options, milestones); err != nil {
		t.Fatal(err)
	}

	second, err := Preflight(context.Background(), server.Client(), testMapping(), options, milestones)
	if err != nil {
		t.Fatal(err)
	}
	result, err = second.Apply(context.Background(), server.Client(), options, milestones)
	if err != nil || result != (Result{Unchanged: 2}) {
		t.Fatalf("idempotent Apply() = %#v, %v", result, err)
	}
	if err := second.Verify(context.Background(), server.Client(), options, milestones); err != nil {
		t.Fatal(err)
	}
	if patches != 1 {
		t.Fatalf("PATCH count = %d, want one exact repair", patches)
	}
}

func TestIssueAssignmentsRecoverFromBoundedPartialFailure(t *testing.T) {
	t.Parallel()
	milestones := testMilestones{"M0": 101, "M1": 102}
	remote := map[int]remoteIssue{
		7: {Number: 7, NodeID: "ISSUE_7", State: "open"},
		8: {Number: 8, NodeID: "ISSUE_8", State: "open"},
	}
	failSecondOnce := true
	patches := map[int]int{}
	var mutex sync.Mutex
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		mutex.Lock()
		defer mutex.Unlock()
		var number int
		_, _ = fmt.Sscanf(request.URL.Path, "/repos/owner/repository/issues/%d", &number)
		issue := remote[number]
		if request.Method == http.MethodGet {
			writeIssue(t, writer, issue, http.StatusOK)
			return
		}
		patches[number]++
		if number == 8 && failSecondOnce {
			failSecondOnce = false
			http.Error(writer, "transient", http.StatusServiceUnavailable)
			return
		}
		var payload issuePayload
		_ = json.NewDecoder(request.Body).Decode(&payload)
		issue.Milestone = &remoteMilestone{Number: payload.Milestone}
		remote[number] = issue
		writeIssue(t, writer, issue, http.StatusOK)
	}))
	defer server.Close()
	options := Options{APIBase: server.URL, Repository: "owner/repository", Token: "token"}

	first, err := Preflight(context.Background(), server.Client(), testMapping(), options, milestones)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := first.Apply(context.Background(), server.Client(), options, milestones); err == nil {
		t.Fatal("Apply() accepted the injected partial failure")
	}
	second, err := Preflight(context.Background(), server.Client(), testMapping(), options, milestones)
	if err != nil {
		t.Fatal(err)
	}
	result, err := second.Apply(context.Background(), server.Client(), options, milestones)
	if err != nil || result != (Result{Updated: 1, Unchanged: 1}) {
		t.Fatalf("retry Apply() = %#v, %v", result, err)
	}
	if err := second.Verify(context.Background(), server.Client(), options, milestones); err != nil {
		t.Fatal(err)
	}
	if patches[7] != 1 || patches[8] != 2 {
		t.Fatalf("PATCH counts = %#v, already-applied issue was not preserved", patches)
	}
}

func TestApplyRejectsIssueDriftBeforeFirstAssignmentWrite(t *testing.T) {
	t.Parallel()
	gets := 0
	patches := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.Method == http.MethodPatch {
			patches++
			http.Error(writer, "write should not occur", http.StatusInternalServerError)
			return
		}
		gets++
		issue := remoteIssue{Number: 7, NodeID: "ISSUE_7", State: "open"}
		if gets > 1 {
			issue.Milestone = &remoteMilestone{Number: 999}
		}
		writeIssue(t, writer, issue, http.StatusOK)
	}))
	defer server.Close()
	manifest := testMapping()
	manifest.Assignments = manifest.Assignments[:1]
	milestones := testMilestones{"M0": 101}
	options := Options{APIBase: server.URL, Repository: manifest.Repository, Token: "token"}
	plan, err := Preflight(context.Background(), server.Client(), manifest, options, milestones)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := plan.Apply(context.Background(), server.Client(), options, milestones); err == nil ||
		!strings.Contains(err.Error(), "changed after") || patches != 0 {
		t.Fatalf("Apply() error/PATCH count = %v/%d, want zero-write drift refusal", err, patches)
	}
}

func TestPreflightRejectsRepositoryDriftPullRequestsAndUnknownMilestones(t *testing.T) {
	t.Parallel()
	manifest := testMapping()
	options := Options{Repository: "other/repository", Token: "token"}
	if _, err := Preflight(context.Background(), http.DefaultClient, manifest, options, testMilestones{"M0": 1, "M1": 2}); err == nil {
		t.Fatal("Preflight() accepted repository drift")
	}
	options.Repository = manifest.Repository
	if _, err := Preflight(context.Background(), http.DefaultClient, manifest, options, testMilestones{"M0": 1}); err == nil ||
		!strings.Contains(err.Error(), "unknown milestone") {
		t.Fatalf("Preflight() unknown-milestone error = %v", err)
	}

	pullRequest := json.RawMessage(`{"url":"https://api.github.test/pulls/7"}`)
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, _ *http.Request) {
		writeIssue(t, writer, remoteIssue{
			Number: 7, NodeID: "PR_7", State: "open", PullRequest: &pullRequest,
		}, http.StatusOK)
	}))
	defer server.Close()
	manifest.Assignments = manifest.Assignments[:1]
	options.APIBase = server.URL
	if _, err := Preflight(context.Background(), server.Client(), manifest, options, testMilestones{"M0": 1}); err == nil ||
		!strings.Contains(err.Error(), "pull-request") {
		t.Fatalf("Preflight() pull-request error = %v", err)
	}
}

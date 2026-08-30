package main

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/githubissuemilestones"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/githublabels"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/githubmilestones"
)

func testMetadataManifests() githubMetadataManifests {
	return githubMetadataManifests{
		labels: githublabels.Manifest{Schema: 1, Labels: []githublabels.Label{{
			Name: "area:test", Color: "0e8a16", Description: "Test label",
		}}},
		milestones: githubmilestones.Manifest{Schema: 1, Milestones: []githubmilestones.Milestone{{
			ID: "M0", Title: "M0 — Evidence contracts", State: "open",
			Roadmap: "concept/90-research-roadmap.md#stage-0--evidence-synthesis-and-contracts",
			Summary: "Make one evidence boundary inspectable before execution begins.",
		}}},
		issues: githubissuemilestones.Manifest{
			Schema: 1, Repository: "owner/repository",
			Assignments: []githubissuemilestones.Assignment{{Issue: 7, Milestone: "M0"}},
		},
	}
}

func TestMetadataPreflightsEveryRemoteAuthorityBeforeMutation(t *testing.T) {
	t.Parallel()
	writes := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodGet {
			writes++
			http.Error(writer, "write should not occur", http.StatusInternalServerError)
			return
		}
		switch {
		case strings.HasSuffix(request.URL.Path, "/labels"):
			_ = json.NewEncoder(writer).Encode([]githublabels.Label{})
		case strings.HasSuffix(request.URL.Path, "/milestones"):
			_ = json.NewEncoder(writer).Encode([]map[string]any{{
				"number": 4, "state": "open", "title": "M0 — Evidence contracts",
				"description": "unmarked title collision",
			}})
		default:
			t.Fatal("issue inventory was reached after invalid milestone preflight")
		}
	}))
	defer server.Close()
	_, err := syncGitHubMetadata(
		context.Background(), server.Client(), testMetadataManifests(),
		githubMetadataOptions{APIBase: server.URL, Repository: "owner/repository", Token: "token"},
	)
	if err == nil || !strings.Contains(err.Error(), "unmarked") || writes != 0 {
		t.Fatalf("syncGitHubMetadata() error/writes = %v/%d, want zero-write complete preflight refusal", err, writes)
	}
}

type testRemoteMilestone struct {
	Number      int     `json:"number"`
	State       string  `json:"state"`
	Title       string  `json:"title"`
	Description *string `json:"description"`
	DueOn       *string `json:"due_on"`
}

func TestMetadataRetryConvergesAfterBoundedIssueFailure(t *testing.T) {
	t.Parallel()
	var mutex sync.Mutex
	var label *githublabels.Label
	var milestone *testRemoteMilestone
	issueMilestone := 0
	failIssueOnce := true
	labelPosts := 0
	milestonePosts := 0
	issuePatches := 0

	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		mutex.Lock()
		defer mutex.Unlock()
		switch {
		case request.URL.Path == "/repos/owner/repository/labels" && request.Method == http.MethodGet:
			remote := []githublabels.Label{}
			if label != nil {
				remote = append(remote, *label)
			}
			_ = json.NewEncoder(writer).Encode(remote)
		case request.URL.Path == "/repos/owner/repository/labels" && request.Method == http.MethodPost:
			labelPosts++
			created := githublabels.Label{Name: "area:test", Color: "0e8a16", Description: "Test label"}
			label = &created
			writer.WriteHeader(http.StatusCreated)
			_ = json.NewEncoder(writer).Encode(created)
		case request.URL.Path == "/repos/owner/repository/milestones" && request.Method == http.MethodGet:
			remote := []testRemoteMilestone{}
			if milestone != nil {
				remote = append(remote, *milestone)
			}
			_ = json.NewEncoder(writer).Encode(remote)
		case request.URL.Path == "/repos/owner/repository/milestones" && request.Method == http.MethodPost:
			milestonePosts++
			var payload struct {
				Title       string `json:"title"`
				State       string `json:"state"`
				Description string `json:"description"`
			}
			_ = json.NewDecoder(request.Body).Decode(&payload)
			created := testRemoteMilestone{
				Number: 11, State: payload.State, Title: payload.Title, Description: &payload.Description,
			}
			milestone = &created
			writer.WriteHeader(http.StatusCreated)
			_ = json.NewEncoder(writer).Encode(created)
		case request.URL.Path == "/repos/owner/repository/issues/7" && request.Method == http.MethodGet:
			body := map[string]any{"number": 7, "node_id": "ISSUE_7", "state": "open", "milestone": nil}
			if issueMilestone != 0 {
				body["milestone"] = map[string]any{"number": issueMilestone}
			}
			_ = json.NewEncoder(writer).Encode(body)
		case request.URL.Path == "/repos/owner/repository/issues/7" && request.Method == http.MethodPatch:
			issuePatches++
			if failIssueOnce {
				failIssueOnce = false
				http.Error(writer, "transient", http.StatusServiceUnavailable)
				return
			}
			var payload struct {
				Milestone int `json:"milestone"`
			}
			_ = json.NewDecoder(request.Body).Decode(&payload)
			issueMilestone = payload.Milestone
			_ = json.NewEncoder(writer).Encode(map[string]any{
				"number": 7, "node_id": "ISSUE_7", "state": "open",
				"milestone": map[string]any{"number": issueMilestone},
			})
		default:
			http.Error(writer, "unexpected request", http.StatusBadRequest)
		}
	}))
	defer server.Close()
	options := githubMetadataOptions{
		APIBase: server.URL, Repository: "owner/repository", Token: "token",
	}

	if _, err := syncGitHubMetadata(context.Background(), server.Client(), testMetadataManifests(), options); err == nil ||
		!strings.Contains(err.Error(), "apply GitHub issue assignments") {
		t.Fatalf("first sync error = %v, want injected issue failure", err)
	}
	result, err := syncGitHubMetadata(context.Background(), server.Client(), testMetadataManifests(), options)
	if err != nil {
		t.Fatal(err)
	}
	if result.labels != (githublabels.Result{Unchanged: 1}) ||
		result.milestones != (githubmilestones.Result{Unchanged: 1}) ||
		result.issues != (githubissuemilestones.Result{Updated: 1}) {
		t.Fatalf("retry result = %#v", result)
	}
	if labelPosts != 1 || milestonePosts != 1 || issuePatches != 2 || issueMilestone != 11 {
		t.Fatalf(
			"mutation counts/final milestone = %d/%d/%d/%d, retry repeated a completed repair",
			labelPosts, milestonePosts, issuePatches, issueMilestone,
		)
	}
}

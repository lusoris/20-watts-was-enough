package githubprmetadata

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"reflect"
	"slices"
	"sort"
	"strings"
	"sync"
	"testing"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/githubissuemilestones"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/githublabels"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/githubmilestones"
)

type testInventory map[string]int

func (inventory testInventory) Number(id string) (int, bool) {
	number, ok := inventory[id]
	return number, ok
}

func testAuthorities() Authorities {
	names := []string{
		"type:feat", "type:fix", "type:docs", "type:chore", "type:refactor", "type:test", "type:perf", "type:ci", "type:build", "type:revert",
		"severity:p1", "severity:p2", "status:blocked", "status:in-progress", "area:research", "area:experiment",
		"dependencies",
	}
	labels := make([]githublabels.Label, 0, len(names))
	for _, name := range names {
		labels = append(labels, githublabels.Label{Name: name, Color: "0e8a16", Description: "Managed test label"})
	}
	return Authorities{
		Labels: githublabels.Manifest{Schema: 1, Labels: labels},
		Milestones: githubmilestones.Manifest{Schema: 1, Milestones: []githubmilestones.Milestone{{
			ID: "M1", Title: "M1 — Isolated mechanism experiments", State: "open",
			Roadmap: "concept/90-research-roadmap.md#stage-1--isolated-mechanism-experiments",
			Summary: "Run isolated mechanism experiments against explicit controls and budgets.",
		}}},
		Issues: githubissuemilestones.Manifest{
			Schema: 1, Repository: "owner/repository",
			Assignments: []githubissuemilestones.Assignment{{Issue: 12, Milestone: "M1"}, {Issue: 13, Milestone: "M1"}},
		},
	}
}

func TestDesiredMetadataUsesTheManifestManagedTitleTypes(t *testing.T) {
	t.Parallel()
	index, err := indexAuthorities(testAuthorities())
	if err != nil {
		t.Fatal(err)
	}
	issue := remoteItem{
		State: "open",
		Labels: []remoteLabel{
			{Name: "type:feat"},
			{Name: "severity:p2"},
			{Name: "status:in-progress"},
			{Name: "area:research"},
		},
		Milestone: &remoteMilestone{Number: 9},
	}
	for _, kind := range []string{"perf", "revert"} {
		labels, _, err := desiredMetadata(
			remoteItem{Title: kind + ": bounded change"},
			issue,
			12,
			index,
			testInventory{"M1": 9},
		)
		if err != nil {
			t.Fatalf("desiredMetadata(%s) error = %v", kind, err)
		}
		if !slices.Contains(labels, "type:"+kind) {
			t.Fatalf("desiredMetadata(%s) labels = %v", kind, labels)
		}
	}
	_, _, err = desiredMetadata(
		remoteItem{Title: "unsupported: bounded change"},
		issue,
		12,
		index,
		testInventory{"M1": 9},
	)
	if err == nil || !strings.Contains(err.Error(), "has no managed label") {
		t.Fatalf("desiredMetadata(unsupported) error = %v", err)
	}
}

func testItem(number int, pull bool, title, body string, labels []string, milestone int) map[string]any {
	item := map[string]any{
		"number": number, "node_id": "ITEM_" + title, "state": "open", "title": title,
		"body": body, "labels": labelObjects(labels), "milestone": nil,
	}
	if milestone != 0 {
		item["milestone"] = map[string]any{"number": milestone}
	}
	if pull {
		item["pull_request"] = map[string]any{"url": "https://example.invalid/pull"}
	}
	return item
}

func labelObjects(names []string) []map[string]string {
	labels := make([]map[string]string, 0, len(names))
	for _, name := range names {
		labels = append(labels, map[string]string{"name": name})
	}
	return labels
}

func addTestLabels(labels []string, additions ...string) []string {
	result := append([]string(nil), labels...)
	for _, addition := range additions {
		found := false
		for _, label := range result {
			if strings.EqualFold(label, addition) {
				found = true
				break
			}
		}
		if !found {
			result = append(result, addition)
		}
	}
	return result
}

func removeTestLabel(labels []string, removed string) []string {
	result := make([]string, 0, len(labels))
	for _, label := range labels {
		if !strings.EqualFold(label, removed) {
			result = append(result, label)
		}
	}
	return result
}

func deletedTestLabel(t *testing.T, request *http.Request) string {
	t.Helper()
	escaped := strings.TrimPrefix(request.URL.EscapedPath(), "/repos/owner/repository/issues/40/labels/")
	label, err := url.PathUnescape(escaped)
	if err != nil {
		t.Fatal(err)
	}
	return label
}

func displayTestLabels(labels []string) []string {
	result := append([]string(nil), labels...)
	sort.Strings(result)
	return result
}

func TestSyncConvergesAndRetryIsIdempotent(t *testing.T) {
	t.Parallel()
	var mutex sync.Mutex
	pullLabels := []string{
		"type:fix", "severity:p1", "status:blocked", "area:experiment",
		"area:unmanaged", "severity:unmanaged", "dependencies", "external",
	}
	pullMilestone := 0
	writes := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		mutex.Lock()
		defer mutex.Unlock()
		if request.Header.Get("Authorization") != "Bearer token" || request.Header.Get("X-GitHub-Api-Version") != apiVersion {
			http.Error(writer, "missing bounded auth headers", http.StatusBadRequest)
			return
		}
		switch {
		case request.URL.Path == "/repos/owner/repository/issues/40" && request.Method == http.MethodGet:
			_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat(experiment): add specialist", "Tracks #12", pullLabels, pullMilestone))
		case request.URL.Path == "/repos/owner/repository/issues/12" && request.Method == http.MethodGet:
			_ = json.NewEncoder(writer).Encode(testItem(12, false, "Managed issue", "", []string{
				"type:feat", "severity:p2", "status:in-progress", "area:research",
			}, 9))
		case request.URL.Path == "/repos/owner/repository/issues/40/labels" && request.Method == http.MethodPost:
			writes++
			var payload labelsPayload
			if err := json.NewDecoder(request.Body).Decode(&payload); err != nil {
				t.Fatal(err)
			}
			want := []string{"area:research", "severity:p2", "status:in-progress", "type:feat"}
			if !reflect.DeepEqual(payload.Labels, want) {
				t.Fatalf("added labels = %#v, want %#v", payload.Labels, want)
			}
			pullLabels = addTestLabels(pullLabels, payload.Labels...)
			_ = json.NewEncoder(writer).Encode(labelObjects(pullLabels))
		case strings.HasPrefix(request.URL.Path, "/repos/owner/repository/issues/40/labels/") && request.Method == http.MethodDelete:
			writes++
			escaped := strings.TrimPrefix(request.URL.EscapedPath(), "/repos/owner/repository/issues/40/labels/")
			label, err := url.PathUnescape(escaped)
			if err != nil {
				t.Fatal(err)
			}
			pullLabels = removeTestLabel(pullLabels, label)
			_ = json.NewEncoder(writer).Encode(labelObjects(pullLabels))
		case request.URL.Path == "/repos/owner/repository/issues/40" && request.Method == http.MethodPatch:
			writes++
			var payload map[string]json.RawMessage
			if err := json.NewDecoder(request.Body).Decode(&payload); err != nil {
				t.Fatal(err)
			}
			if len(payload) != 1 || payload["milestone"] == nil {
				t.Fatalf("milestone PATCH payload = %#v", payload)
			}
			if err := json.Unmarshal(payload["milestone"], &pullMilestone); err != nil {
				t.Fatal(err)
			}
			_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat(experiment): add specialist", "Tracks #12", pullLabels, pullMilestone))
		default:
			http.Error(writer, "unexpected request", http.StatusBadRequest)
		}
	}))
	defer server.Close()
	options := Options{APIBase: server.URL, Repository: "owner/repository", Token: "token", PullRequest: 40}
	wantLabels := []string{
		"area:experiment", "area:research", "dependencies", "external", "severity:p2", "status:in-progress", "type:feat",
	}

	result, err := Sync(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, options)
	if err != nil {
		t.Fatal(err)
	}
	if !result.Updated || result.Skipped || result.Issue != 12 || result.Milestone != 9 || !reflect.DeepEqual(result.Labels, wantLabels) {
		t.Fatalf("first result = %#v", result)
	}
	retry, err := Sync(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, options)
	if err != nil {
		t.Fatal(err)
	}
	if retry.Updated || retry.Skipped || writes != 7 || !reflect.DeepEqual(retry.Labels, wantLabels) {
		t.Fatalf("retry result/writes = %#v/%d", retry, writes)
	}
}

func TestSyncPreservesConcurrentUnrelatedLabelAddition(t *testing.T) {
	t.Parallel()
	var mutex sync.Mutex
	pullLabels := []string{"type:fix", "severity:p2", "status:in-progress", "area:research", "external"}
	issueReads := 0
	writes := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		mutex.Lock()
		defer mutex.Unlock()
		switch {
		case request.URL.Path == "/repos/owner/repository/issues/40" && request.Method == http.MethodGet:
			_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat: bounded change", "Tracks #12", pullLabels, 9))
		case request.URL.Path == "/repos/owner/repository/issues/12" && request.Method == http.MethodGet:
			issueReads++
			_ = json.NewEncoder(writer).Encode(testItem(12, false, "Managed issue", "", []string{
				"type:feat", "severity:p2", "status:in-progress", "area:research",
			}, 9))
		case request.URL.Path == "/repos/owner/repository/issues/40/labels" && request.Method == http.MethodPost:
			writes++
			var payload labelsPayload
			if err := json.NewDecoder(request.Body).Decode(&payload); err != nil {
				t.Fatal(err)
			}
			pullLabels = addTestLabels(pullLabels, "human-review")
			pullLabels = addTestLabels(pullLabels, payload.Labels...)
			_ = json.NewEncoder(writer).Encode(labelObjects(pullLabels))
		case strings.HasPrefix(request.URL.Path, "/repos/owner/repository/issues/40/labels/") && request.Method == http.MethodDelete:
			writes++
			pullLabels = removeTestLabel(pullLabels, deletedTestLabel(t, request))
			_ = json.NewEncoder(writer).Encode(labelObjects(pullLabels))
		default:
			http.Error(writer, "unexpected request", http.StatusBadRequest)
		}
	}))
	defer server.Close()

	result, err := Sync(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, Options{
		APIBase: server.URL, Repository: "owner/repository", Token: "token", PullRequest: 40,
	})
	if err != nil {
		t.Fatal(err)
	}
	want := []string{"area:research", "external", "human-review", "severity:p2", "status:in-progress", "type:feat"}
	if !result.Updated || !reflect.DeepEqual(result.Labels, want) {
		t.Fatalf("Sync() result = %#v, want labels %#v", result, want)
	}
	mutex.Lock()
	defer mutex.Unlock()
	if !reflect.DeepEqual(displayTestLabels(pullLabels), want) || issueReads != 3 || writes != 2 {
		t.Fatalf("final labels/issue reads/writes = %#v/%d/%d", pullLabels, issueReads, writes)
	}
}

func TestSyncReconcilesSourceIssueChangeAfterMutation(t *testing.T) {
	t.Parallel()
	var mutex sync.Mutex
	pullLabels := []string{"type:feat", "severity:p2", "status:in-progress", "area:research", "external"}
	pullMilestone := 0
	issueStatus := "status:in-progress"
	issueReads := 0
	writes := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		mutex.Lock()
		defer mutex.Unlock()
		switch {
		case request.URL.Path == "/repos/owner/repository/issues/40" && request.Method == http.MethodGet:
			_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat: bounded change", "Tracks #12", pullLabels, pullMilestone))
		case request.URL.Path == "/repos/owner/repository/issues/12" && request.Method == http.MethodGet:
			issueReads++
			_ = json.NewEncoder(writer).Encode(testItem(12, false, "Managed issue", "", []string{
				"type:feat", "severity:p2", issueStatus, "area:research",
			}, 9))
		case request.URL.Path == "/repos/owner/repository/issues/40" && request.Method == http.MethodPatch:
			writes++
			pullMilestone = 9
			issueStatus = "status:blocked"
			_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat: bounded change", "Tracks #12", pullLabels, pullMilestone))
		case request.URL.Path == "/repos/owner/repository/issues/40/labels" && request.Method == http.MethodPost:
			writes++
			var payload labelsPayload
			if err := json.NewDecoder(request.Body).Decode(&payload); err != nil {
				t.Fatal(err)
			}
			pullLabels = addTestLabels(pullLabels, payload.Labels...)
			_ = json.NewEncoder(writer).Encode(labelObjects(pullLabels))
		case strings.HasPrefix(request.URL.Path, "/repos/owner/repository/issues/40/labels/") && request.Method == http.MethodDelete:
			writes++
			pullLabels = removeTestLabel(pullLabels, deletedTestLabel(t, request))
			_ = json.NewEncoder(writer).Encode(labelObjects(pullLabels))
		default:
			http.Error(writer, "unexpected request", http.StatusBadRequest)
		}
	}))
	defer server.Close()

	result, err := Sync(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, Options{
		APIBase: server.URL, Repository: "owner/repository", Token: "token", PullRequest: 40,
	})
	if err != nil {
		t.Fatal(err)
	}
	want := []string{"area:research", "external", "severity:p2", "status:blocked", "type:feat"}
	if !result.Updated || !reflect.DeepEqual(result.Labels, want) {
		t.Fatalf("Sync() result = %#v, want labels %#v", result, want)
	}
	mutex.Lock()
	defer mutex.Unlock()
	if issueReads != 6 || writes != 3 || pullMilestone != 9 || !reflect.DeepEqual(displayTestLabels(pullLabels), want) {
		t.Fatalf("issue reads/writes/milestone/labels = %d/%d/%d/%#v", issueReads, writes, pullMilestone, pullLabels)
	}
}

func TestSyncRecoversFromAppliedLabelWriteWithFailedResponse(t *testing.T) {
	t.Parallel()
	var mutex sync.Mutex
	pullLabels := []string{"type:fix", "severity:p2", "status:in-progress", "area:research", "external"}
	addCalls := 0
	deleteCalls := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		mutex.Lock()
		defer mutex.Unlock()
		switch {
		case request.URL.Path == "/repos/owner/repository/issues/40" && request.Method == http.MethodGet:
			_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat: bounded change", "Tracks #12", pullLabels, 9))
		case request.URL.Path == "/repos/owner/repository/issues/12" && request.Method == http.MethodGet:
			_ = json.NewEncoder(writer).Encode(testItem(12, false, "Managed issue", "", []string{
				"type:feat", "severity:p2", "status:in-progress", "area:research",
			}, 9))
		case request.URL.Path == "/repos/owner/repository/issues/40/labels" && request.Method == http.MethodPost:
			addCalls++
			var payload labelsPayload
			if err := json.NewDecoder(request.Body).Decode(&payload); err != nil {
				t.Fatal(err)
			}
			pullLabels = addTestLabels(pullLabels, payload.Labels...)
			http.Error(writer, "response failed after apply", http.StatusInternalServerError)
		case strings.HasPrefix(request.URL.Path, "/repos/owner/repository/issues/40/labels/") && request.Method == http.MethodDelete:
			deleteCalls++
			pullLabels = removeTestLabel(pullLabels, deletedTestLabel(t, request))
			_ = json.NewEncoder(writer).Encode(labelObjects(pullLabels))
		default:
			http.Error(writer, "unexpected request", http.StatusBadRequest)
		}
	}))
	defer server.Close()

	result, err := Sync(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, Options{
		APIBase: server.URL, Repository: "owner/repository", Token: "token", PullRequest: 40,
	})
	if err != nil {
		t.Fatal(err)
	}
	want := []string{"area:research", "external", "severity:p2", "status:in-progress", "type:feat"}
	if !result.Updated || !reflect.DeepEqual(result.Labels, want) {
		t.Fatalf("Sync() result = %#v, want labels %#v", result, want)
	}
	mutex.Lock()
	defer mutex.Unlock()
	if addCalls != 1 || deleteCalls != 1 || !reflect.DeepEqual(displayTestLabels(pullLabels), want) {
		t.Fatalf("add/delete calls and labels = %d/%d/%#v", addCalls, deleteCalls, pullLabels)
	}
}

func TestSyncSkipsWithoutOneManagedReferenceAndNeverWrites(t *testing.T) {
	t.Parallel()
	for _, test := range []struct {
		name   string
		body   string
		reason string
	}{
		{name: "missing", body: "No issue link", reason: "no explicit managed issue reference"},
		{name: "unmanaged", body: "Tracks #99", reason: "no explicit managed issue reference"},
		{name: "ambiguous", body: "Tracks #12\n\nRefs #13", reason: "multiple explicit managed issue references"},
	} {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			writes := 0
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				if request.Method != http.MethodGet {
					writes++
				}
				_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat: bounded change", test.body, nil, 0))
			}))
			defer server.Close()
			result, err := Sync(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, Options{
				APIBase: server.URL, Repository: "owner/repository", Token: "token", PullRequest: 40,
			})
			if err != nil || !result.Skipped || result.Reason != test.reason || writes != 0 {
				t.Fatalf("Sync() result/error/writes = %#v/%v/%d", result, err, writes)
			}
		})
	}
}

func TestSyncRejectsIncompleteOrInconsistentManagedIssueBeforeWrite(t *testing.T) {
	t.Parallel()
	for _, test := range []struct {
		name      string
		labels    []string
		milestone int
		want      string
	}{
		{name: "missing-area", labels: []string{"type:feat", "severity:p2", "status:in-progress"}, milestone: 9, want: "at least one managed area"},
		{name: "duplicate-severity", labels: []string{"type:feat", "severity:p1", "severity:p2", "status:in-progress", "area:research"}, milestone: 9, want: "exactly one managed"},
		{name: "wrong-milestone", labels: []string{"type:feat", "severity:p2", "status:in-progress", "area:research"}, milestone: 8, want: "does not carry milestone M1"},
	} {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			writes := 0
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				if request.Method != http.MethodGet {
					writes++
				}
				if strings.HasSuffix(request.URL.Path, "/40") {
					_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat: bounded change", "Tracks #12", nil, 0))
					return
				}
				_ = json.NewEncoder(writer).Encode(testItem(12, false, "Managed issue", "", test.labels, test.milestone))
			}))
			defer server.Close()
			_, err := Sync(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, Options{
				APIBase: server.URL, Repository: "owner/repository", Token: "token", PullRequest: 40,
			})
			if err == nil || !strings.Contains(err.Error(), test.want) || writes != 0 {
				t.Fatalf("Sync() error/writes = %v/%d", err, writes)
			}
		})
	}
}

func TestSyncRejectsSnapshotRaceBeforeWrite(t *testing.T) {
	t.Parallel()
	pullReads := 0
	writes := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodGet {
			writes++
		}
		if strings.HasSuffix(request.URL.Path, "/40") {
			pullReads++
			body := "Tracks #12"
			if pullReads%2 == 0 {
				body = "Tracks #12\n\nConcurrent edit"
			}
			_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat: bounded change", body, nil, 0))
			return
		}
		_ = json.NewEncoder(writer).Encode(testItem(12, false, "Managed issue", "", []string{
			"type:feat", "severity:p2", "status:in-progress", "area:research",
		}, 9))
	}))
	defer server.Close()
	_, err := Sync(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, Options{
		APIBase: server.URL, Repository: "owner/repository", Token: "token", PullRequest: 40,
	})
	if err == nil || !strings.Contains(err.Error(), "did not converge after 3 attempts") ||
		!strings.Contains(err.Error(), "changed after metadata preflight") || writes != 0 || pullReads != 6 {
		t.Fatalf("Sync() error/writes = %v/%d", err, writes)
	}
}

func TestSyncRejectsTamperedMilestoneMutationResponse(t *testing.T) {
	t.Parallel()
	patches := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		switch {
		case request.URL.Path == "/repos/owner/repository/issues/40" && request.Method == http.MethodPatch:
			patches++
			_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat: tampered identity", "Tracks #12", []string{
				"type:feat", "severity:p2", "status:in-progress", "area:research",
			}, 9))
		case request.URL.Path == "/repos/owner/repository/issues/40":
			_ = json.NewEncoder(writer).Encode(testItem(40, true, "feat: bounded change", "Tracks #12", []string{
				"type:feat", "severity:p2", "status:in-progress", "area:research",
			}, 0))
		default:
			_ = json.NewEncoder(writer).Encode(testItem(12, false, "Managed issue", "", []string{
				"type:feat", "severity:p2", "status:in-progress", "area:research",
			}, 9))
		}
	}))
	defer server.Close()
	_, err := Sync(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, Options{
		APIBase: server.URL, Repository: "owner/repository", Token: "token", PullRequest: 40,
	})
	if err == nil || !strings.Contains(err.Error(), "did not converge after 3 attempts") ||
		!strings.Contains(err.Error(), "response identity changed") || patches != 3 {
		t.Fatalf("Sync() error/patches = %v/%d", err, patches)
	}
}

func TestReferenceParserAcceptsOneRepeatedExplicitReference(t *testing.T) {
	t.Parallel()
	number, reason := referencedManagedIssue("Tracks #12\n\nCloses #12.\n\nSee #13 inline", map[int]string{12: "M1", 13: "M1"})
	if number != 12 || reason != "" {
		t.Fatalf("referencedManagedIssue() = %d/%q", number, reason)
	}
}

func TestReferenceParserRejectsAReferenceSplitAcrossLines(t *testing.T) {
	t.Parallel()
	for _, body := range []string{
		"Tracks\n#12",
		"Tracks\r\n#12",
		"Tracks\f#12",
	} {
		number, reason := referencedManagedIssue(body, map[int]string{12: "M1"})
		if number != 0 || reason != "no explicit managed issue reference" {
			t.Fatalf("referencedManagedIssue(%q) = %d/%q", body, number, reason)
		}
	}
}

func TestNewRequestEscapesLabelAsOnePathSegment(t *testing.T) {
	t.Parallel()
	base, err := url.Parse("https://api.example.invalid/base")
	if err != nil {
		t.Fatal(err)
	}
	request, err := newRequest(context.Background(), base, Options{
		Repository: "owner/repository", Token: "token", PullRequest: 40,
	}, http.MethodDelete, 40, nil, "labels", "area:human review/core")
	if err != nil {
		t.Fatal(err)
	}
	want := "/base/repos/owner/repository/issues/40/labels/area:human%20review%2Fcore"
	if request.URL.EscapedPath() != want {
		t.Fatalf("escaped label path = %q, want %q", request.URL.EscapedPath(), want)
	}
}

func TestValidateAuthoritiesRejectsIncompleteClassificationAndUnknownStage(t *testing.T) {
	t.Parallel()
	incomplete := testAuthorities()
	filtered := make([]githublabels.Label, 0, len(incomplete.Labels.Labels))
	for _, label := range incomplete.Labels.Labels {
		if !strings.HasPrefix(label.Name, "status:") {
			filtered = append(filtered, label)
		}
	}
	incomplete.Labels.Labels = filtered
	if err := ValidateAuthorities(incomplete); err == nil || !strings.Contains(err.Error(), "no status:") {
		t.Fatalf("ValidateAuthorities() incomplete error = %v", err)
	}

	unknown := testAuthorities()
	unknown.Issues.Assignments[0].Milestone = "M2"
	if err := ValidateAuthorities(unknown); err == nil || !strings.Contains(err.Error(), "unknown milestone M2") {
		t.Fatalf("ValidateAuthorities() unknown-stage error = %v", err)
	}
}

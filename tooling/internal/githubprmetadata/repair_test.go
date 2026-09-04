package githubprmetadata

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"reflect"
	"sort"
	"strconv"
	"strings"
	"sync"
	"testing"
)

func TestPreflightRepairPaginatesEveryManagedStatusAndDeduplicatesCandidates(t *testing.T) {
	t.Parallel()
	requests := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		requests++
		query := request.URL.Query()
		if request.Method != http.MethodGet ||
			query.Get("sort") != "created" || query.Get("direction") != "asc" ||
			query.Get("per_page") != "100" || request.Header.Get("Authorization") != "Bearer token" ||
			request.Header.Get("X-GitHub-Api-Version") != apiVersion {
			http.Error(writer, "unexpected discovery request", http.StatusBadRequest)
			return
		}
		if request.URL.Path == "/repos/owner/repository/pulls" {
			if query.Get("state") != "open" || query.Get("labels") != "" || query.Get("page") != "1" {
				http.Error(writer, "unexpected open pull-request discovery request", http.StatusBadRequest)
				return
			}
			_ = json.NewEncoder(writer).Encode([]map[string]any{
				testItemState(40, true, "open", "fix: open", "Tracks #12", []string{"status:blocked"}, 9),
			})
			return
		}
		if request.URL.Path != "/repos/owner/repository/issues" || query.Get("state") != "all" {
			http.Error(writer, "unexpected managed-status discovery request", http.StatusBadRequest)
			return
		}
		status := query.Get("labels")
		page := query.Get("page")
		switch {
		case status == "status:blocked" && page == "1":
			writer.Header().Set("Link", `<https://api.github.com/repositories/1/issues?page=2>; rel="next"`)
			_ = json.NewEncoder(writer).Encode([]map[string]any{
				testItemState(40, true, "open", "fix: open", "Tracks #12", []string{status}, 9),
				testItemState(12, false, "open", "issue", "", []string{status}, 9),
			})
		case status == "status:blocked" && page == "2":
			_ = json.NewEncoder(writer).Encode([]map[string]any{
				testItemState(41, true, "closed", "fix: closed", "Tracks #12", []string{status}, 9),
			})
		default:
			_ = json.NewEncoder(writer).Encode([]map[string]any{})
		}
	}))
	defer server.Close()

	plan, err := PreflightRepair(context.Background(), server.Client(), testAuthorities(), RepairOptions{
		APIBase: server.URL, Repository: "owner/repository", Token: "token",
	})
	if err != nil {
		t.Fatal(err)
	}
	want := []repairCandidate{{number: 40, state: "open"}, {number: 41, state: "closed"}}
	if !reflect.DeepEqual(plan.candidates, want) || requests != 7 {
		t.Fatalf("PreflightRepair() candidates/requests = %#v/%d, want %#v/7", plan.candidates, requests, want)
	}
}

func TestPreflightRepairFailsClosedOnHostileDiscovery(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name    string
		handler func(*testing.T, http.ResponseWriter, *http.Request)
		want    string
	}{
		{
			name: "candidate bound",
			handler: func(t *testing.T, writer http.ResponseWriter, request *http.Request) {
				t.Helper()
				status := request.URL.Query().Get("labels")
				items := make([]map[string]any, 0, maximumRepairCandidates+1)
				for number := 1; number <= maximumRepairCandidates+1; number++ {
					items = append(items, testItemState(number, true, "open", fmt.Sprintf("fix: %d", number), "Tracks #12", []string{status}, 9))
				}
				_ = json.NewEncoder(writer).Encode(items)
			},
			want: "exceeds 64 candidates",
		},
		{
			name: "page item bound",
			handler: func(t *testing.T, writer http.ResponseWriter, request *http.Request) {
				t.Helper()
				status := request.URL.Query().Get("labels")
				items := make([]map[string]any, 0, repairPageSize+1)
				for number := 1; number <= repairPageSize+1; number++ {
					items = append(items, testItemState(number, false, "open", fmt.Sprintf("issue %d", number), "", []string{status}, 9))
				}
				_ = json.NewEncoder(writer).Encode(items)
			},
			want: "malformed response",
		},
		{
			name: "page bound",
			handler: func(t *testing.T, writer http.ResponseWriter, request *http.Request) {
				t.Helper()
				status := request.URL.Query().Get("labels")
				writer.Header().Set("Link", `<https://api.github.com/repositories/1/issues?page=2>; rel="next"`)
				_ = json.NewEncoder(writer).Encode([]map[string]any{
					testItemState(40, true, "open", "fix: candidate", "Tracks #12", []string{status}, 9),
				})
			},
			want: "exceeds 4 pages",
		},
		{
			name: "malformed pagination",
			handler: func(t *testing.T, writer http.ResponseWriter, request *http.Request) {
				t.Helper()
				status := request.URL.Query().Get("labels")
				writer.Header().Set("Link", "not-a-link")
				_ = json.NewEncoder(writer).Encode([]map[string]any{
					testItemState(40, true, "open", "fix: candidate", "Tracks #12", []string{status}, 9),
				})
			},
			want: "malformed pagination Link header",
		},
		{
			name: "unmatched query result",
			handler: func(t *testing.T, writer http.ResponseWriter, request *http.Request) {
				t.Helper()
				_ = json.NewEncoder(writer).Encode([]map[string]any{
					testItemState(40, true, "open", "fix: candidate", "Tracks #12", []string{"status:wontfix"}, 9),
				})
			},
			want: "lacks the queried status",
		},
	}

	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			writes := 0
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				if request.Method != http.MethodGet {
					writes++
					http.Error(writer, "write refused", http.StatusInternalServerError)
					return
				}
				test.handler(t, writer, request)
			}))
			defer server.Close()
			_, err := PreflightRepair(context.Background(), server.Client(), testAuthorities(), RepairOptions{
				APIBase: server.URL, Repository: "owner/repository", Token: "token",
			})
			if err == nil || !strings.Contains(err.Error(), test.want) || writes != 0 {
				t.Fatalf("PreflightRepair() error/writes = %v/%d, want %q and zero writes", err, writes, test.want)
			}
		})
	}
}

func TestPreflightRepairFailsClosedOnOpenPullRequestPageBound(t *testing.T) {
	t.Parallel()
	writes := 0
	openPages := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodGet {
			writes++
			http.Error(writer, "write refused", http.StatusInternalServerError)
			return
		}
		if request.URL.Path == "/repos/owner/repository/issues" {
			_ = json.NewEncoder(writer).Encode([]map[string]any{})
			return
		}
		if request.URL.Path != "/repos/owner/repository/pulls" {
			http.Error(writer, "unexpected request", http.StatusBadRequest)
			return
		}
		openPages++
		writer.Header().Set("Link", `<https://api.github.com/repositories/1/pulls?page=2>; rel="next"`)
		_ = json.NewEncoder(writer).Encode([]map[string]any{
			testItemState(40, true, "open", "fix: candidate", "Tracks #12", []string{"type:fix"}, 9),
		})
	}))
	defer server.Close()

	_, err := PreflightRepair(context.Background(), server.Client(), testAuthorities(), RepairOptions{
		APIBase: server.URL, Repository: "owner/repository", Token: "token",
	})
	if err == nil || !strings.Contains(err.Error(), "open pull-request repair discovery exceeds 4 pages") ||
		openPages != 4 || writes != 0 {
		t.Fatalf(
			"PreflightRepair() error/open pages/writes = %v/%d/%d, want bounded open-scan refusal after four pages and zero writes",
			err,
			openPages,
			writes,
		)
	}
}

func TestPreflightRepairFailsClosedOnHostileOpenPullRequestDiscovery(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name  string
		pulls func() []map[string]any
		want  string
	}{
		{
			name: "candidate bound",
			pulls: func() []map[string]any {
				items := make([]map[string]any, 0, maximumRepairCandidates+1)
				for number := 1; number <= maximumRepairCandidates+1; number++ {
					items = append(items, testItemState(
						number, true, "open", fmt.Sprintf("fix: %d", number), "Tracks #12", []string{"type:fix"}, 9,
					))
				}
				return items
			},
			want: "exceeds 64 candidates",
		},
		{
			name: "page item bound before filtering",
			pulls: func() []map[string]any {
				items := make([]map[string]any, 0, repairPageSize+1)
				for number := 1; number <= repairPageSize+1; number++ {
					items = append(items, testItemState(
						number, true, "open", fmt.Sprintf("fix: %d", number), "", []string{"type:fix"}, 9,
					))
				}
				return items
			},
			want: "malformed response",
		},
		{
			name: "body bound",
			pulls: func() []map[string]any {
				return []map[string]any{testItemState(
					40, true, "open", "fix: candidate", strings.Repeat("x", maximumBodyBytes+1), []string{"type:fix"}, 9,
				)}
			},
			want: "malformed item",
		},
		{
			name: "state mismatch",
			pulls: func() []map[string]any {
				return []map[string]any{testItemState(
					40, true, "closed", "fix: candidate", "Tracks #12", []string{"type:fix"}, 9,
				)}
			},
			want: "malformed item",
		},
	}

	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			writes := 0
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				if request.Method != http.MethodGet {
					writes++
					http.Error(writer, "write refused", http.StatusInternalServerError)
					return
				}
				if request.URL.Path == "/repos/owner/repository/issues" {
					_ = json.NewEncoder(writer).Encode([]map[string]any{})
					return
				}
				if request.URL.Path != "/repos/owner/repository/pulls" {
					http.Error(writer, "unexpected request", http.StatusBadRequest)
					return
				}
				_ = json.NewEncoder(writer).Encode(test.pulls())
			}))
			defer server.Close()

			_, err := PreflightRepair(context.Background(), server.Client(), testAuthorities(), RepairOptions{
				APIBase: server.URL, Repository: "owner/repository", Token: "token",
			})
			if err == nil || !strings.Contains(err.Error(), test.want) || writes != 0 {
				t.Fatalf("PreflightRepair() error/writes = %v/%d, want %q and zero writes", err, writes, test.want)
			}
		})
	}
}

func TestPreflightRepairRejectsConflictingCandidateState(t *testing.T) {
	t.Parallel()
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		status := request.URL.Query().Get("labels")
		state := "open"
		if status == "status:in-progress" {
			state = "closed"
		}
		if status == "status:blocked" || status == "status:in-progress" {
			_ = json.NewEncoder(writer).Encode([]map[string]any{
				testItemState(40, true, state, "fix: candidate", "Tracks #12", []string{status}, 9),
			})
			return
		}
		_ = json.NewEncoder(writer).Encode([]map[string]any{})
	}))
	defer server.Close()
	_, err := PreflightRepair(context.Background(), server.Client(), testAuthorities(), RepairOptions{
		APIBase: server.URL, Repository: "owner/repository", Token: "token",
	})
	if err == nil || !strings.Contains(err.Error(), "changed state during repair discovery") {
		t.Fatalf("PreflightRepair() error = %v, want conflicting-state refusal", err)
	}
}

func TestRepairPlanRejectsAuthorityDriftBeforeCandidateWork(t *testing.T) {
	t.Parallel()
	requests := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, _ *http.Request) {
		requests++
		_ = json.NewEncoder(writer).Encode([]map[string]any{})
	}))
	defer server.Close()
	options := RepairOptions{APIBase: server.URL, Repository: "owner/repository", Token: "token"}
	plan, err := PreflightRepair(context.Background(), server.Client(), testAuthorities(), options)
	if err != nil {
		t.Fatal(err)
	}
	beforeApply := requests
	drifted := testAuthorities()
	drifted.Labels.Labels[0].Description = "changed after preflight"
	_, err = plan.Apply(context.Background(), server.Client(), drifted, testInventory{"M1": 9}, options)
	if err == nil || !strings.Contains(err.Error(), "authorities") || requests != beforeApply {
		t.Fatalf("RepairPlan.Apply() error/requests = %v/%d, want zero-request authority refusal", err, requests-beforeApply)
	}
}

type repairTestPull struct {
	state     string
	title     string
	body      string
	labels    []string
	milestone int
	merged    bool
}

func TestRepairPlanReconcilesClosedMergedAndZeroStatusReopenDrift(t *testing.T) {
	t.Parallel()
	var mutex sync.Mutex
	pulls := map[int]*repairTestPull{
		40: {
			state: "closed", title: "fix: merged", body: "Tracks #12", merged: true, milestone: 9,
			labels: []string{"type:fix", "severity:p2", "status:in-progress", "area:research", "external"},
		},
		41: {
			state: "open", title: "feat: reopened", body: "Tracks #12", milestone: 9,
			labels: []string{"type:feat", "severity:p2", "area:research", "external"},
		},
		42: {
			state: "closed", title: "fix: ambiguous", body: "Tracks #12\nTracks #13", milestone: 7,
			labels: []string{"type:fix", "severity:p1", "status:blocked", "area:experiment", "external"},
		},
	}
	writes := 0
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		mutex.Lock()
		defer mutex.Unlock()
		switch {
		case request.URL.Path == "/repos/owner/repository/issues" && request.Method == http.MethodGet:
			status := request.URL.Query().Get("labels")
			items := []map[string]any{}
			for number, pull := range pulls {
				if slicesContainFold(pull.labels, status) {
					items = append(items, testItemState(number, true, pull.state, pull.title, pull.body, pull.labels, pull.milestone))
				}
			}
			if status == "status:in-progress" {
				items = append(items, testItemState(12, false, "open", "Managed issue", "", []string{
					"type:feat", "severity:p2", "status:in-progress", "area:research",
				}, 9))
			}
			sort.Slice(items, func(left, right int) bool {
				return items[left]["number"].(int) < items[right]["number"].(int)
			})
			_ = json.NewEncoder(writer).Encode(items)
		case request.URL.Path == "/repos/owner/repository/pulls" && request.Method == http.MethodGet:
			items := []map[string]any{}
			for number, pull := range pulls {
				if pull.state == "open" {
					items = append(items, testItemState(number, true, pull.state, pull.title, pull.body, pull.labels, pull.milestone))
				}
			}
			sort.Slice(items, func(left, right int) bool {
				return items[left]["number"].(int) < items[right]["number"].(int)
			})
			_ = json.NewEncoder(writer).Encode(items)
		case request.URL.Path == "/repos/owner/repository/issues/12" && request.Method == http.MethodGet:
			_ = json.NewEncoder(writer).Encode(testItem(12, false, "Managed issue", "", []string{
				"type:feat", "severity:p2", "status:in-progress", "area:research",
			}, 9))
		case strings.HasPrefix(request.URL.Path, "/repos/owner/repository/issues/") && request.Method == http.MethodGet:
			number, parseErr := strconv.Atoi(strings.TrimPrefix(request.URL.Path, "/repos/owner/repository/issues/"))
			if parseErr != nil || pulls[number] == nil {
				http.Error(writer, "unknown item", http.StatusNotFound)
				return
			}
			pull := pulls[number]
			_ = json.NewEncoder(writer).Encode(testItemState(number, true, pull.state, pull.title, pull.body, pull.labels, pull.milestone))
		case strings.HasPrefix(request.URL.Path, "/repos/owner/repository/pulls/") && strings.HasSuffix(request.URL.Path, "/merge"):
			trimmed := strings.TrimSuffix(strings.TrimPrefix(request.URL.Path, "/repos/owner/repository/pulls/"), "/merge")
			number, _ := strconv.Atoi(trimmed)
			if pulls[number] != nil && pulls[number].merged {
				writer.WriteHeader(http.StatusNoContent)
				return
			}
			http.Error(writer, "not merged", http.StatusNotFound)
		case strings.Contains(request.URL.Path, "/labels/") && request.Method == http.MethodDelete:
			parts := strings.Split(strings.TrimPrefix(request.URL.EscapedPath(), "/repos/owner/repository/issues/"), "/labels/")
			number, parseErr := strconv.Atoi(parts[0])
			label, unescapeErr := url.PathUnescape(parts[1])
			if parseErr != nil || unescapeErr != nil || pulls[number] == nil {
				http.Error(writer, "bad label removal", http.StatusBadRequest)
				return
			}
			writes++
			pulls[number].labels = removeTestLabel(pulls[number].labels, label)
			_ = json.NewEncoder(writer).Encode(labelObjects(pulls[number].labels))
		case strings.HasSuffix(request.URL.Path, "/labels") && request.Method == http.MethodPost:
			trimmed := strings.TrimSuffix(strings.TrimPrefix(request.URL.Path, "/repos/owner/repository/issues/"), "/labels")
			number, parseErr := strconv.Atoi(trimmed)
			var payload labelsPayload
			decodeErr := json.NewDecoder(request.Body).Decode(&payload)
			if parseErr != nil || decodeErr != nil || pulls[number] == nil {
				http.Error(writer, "bad label addition", http.StatusBadRequest)
				return
			}
			writes++
			pulls[number].labels = addTestLabels(pulls[number].labels, payload.Labels...)
			_ = json.NewEncoder(writer).Encode(labelObjects(pulls[number].labels))
		default:
			http.Error(writer, "unexpected request", http.StatusBadRequest)
		}
	}))
	defer server.Close()
	options := RepairOptions{APIBase: server.URL, Repository: "owner/repository", Token: "token"}

	plan, err := PreflightRepair(context.Background(), server.Client(), testAuthorities(), options)
	if err != nil {
		t.Fatal(err)
	}
	result, err := plan.Apply(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, options)
	if err != nil {
		t.Fatal(err)
	}
	if result != (RepairResult{Candidates: 3, Updated: 2, Skipped: 1}) || writes != 2 {
		t.Fatalf("first repair result/writes = %#v/%d", result, writes)
	}
	if !reflect.DeepEqual(displayTestLabels(pulls[40].labels), []string{"area:research", "external", "severity:p2", "type:fix"}) ||
		!reflect.DeepEqual(displayTestLabels(pulls[41].labels), []string{"area:research", "external", "severity:p2", "status:in-progress", "type:feat"}) ||
		!slicesContainFold(pulls[42].labels, "status:blocked") || pulls[40].milestone != 9 || pulls[41].milestone != 9 {
		t.Fatalf("repaired pull requests = %#v", pulls)
	}

	retryPlan, err := PreflightRepair(context.Background(), server.Client(), testAuthorities(), options)
	if err != nil {
		t.Fatal(err)
	}
	retry, err := retryPlan.Apply(context.Background(), server.Client(), testAuthorities(), testInventory{"M1": 9}, options)
	if err != nil {
		t.Fatal(err)
	}
	if retry != (RepairResult{Candidates: 2, Unchanged: 1, Skipped: 1}) || writes != 2 {
		t.Fatalf("retry result/writes = %#v/%d", retry, writes)
	}
}

func slicesContainFold(values []string, wanted string) bool {
	for _, value := range values {
		if strings.EqualFold(value, wanted) {
			return true
		}
	}
	return false
}

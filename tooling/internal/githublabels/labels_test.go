package githublabels

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
)

func writeManifest(t *testing.T, root, body string) {
	t.Helper()
	directory := filepath.Join(root, ".github")
	if err := os.MkdirAll(directory, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(directory, "labels.json"), []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
}

func TestLoadAcceptsClosedManifest(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	writeManifest(t, root, `{"schema":1,"labels":[{"name":"area:test","color":"0e8a16","description":"Test label"}]}`)
	manifest, err := Load(root)
	if err != nil {
		t.Fatal(err)
	}
	if len(manifest.Labels) != 1 || manifest.Labels[0].Name != "area:test" {
		t.Fatalf("Load() = %#v", manifest)
	}
}

func TestLoadRejectsAmbiguityAndUnknownFields(t *testing.T) {
	t.Parallel()
	for name, body := range map[string]string{
		"duplicate": `{"schema":1,"schema":1,"labels":[{"name":"area:test","color":"0e8a16","description":"Test"}]}`,
		"unknown":   `{"schema":1,"labels":[{"name":"area:test","color":"0e8a16","description":"Test","extra":true}]}`,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			root := t.TempDir()
			writeManifest(t, root, body)
			if _, err := Load(root); err == nil {
				t.Fatal("Load() accepted an ambiguous or open manifest")
			}
		})
	}
}

func TestLoadRejectsManifestSymlink(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	target := filepath.Join(t.TempDir(), "labels.json")
	if err := os.WriteFile(target, []byte(`{"schema":1,"labels":[]}`), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(filepath.Join(root, ".github"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(target, filepath.Join(root, ".github", "labels.json")); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	if _, err := Load(root); err == nil || !strings.Contains(err.Error(), "regular file") {
		t.Fatalf("Load() error = %v, want regular-file refusal", err)
	}
}

func TestLoadRejectsLinkedGitHubDirectory(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	target := t.TempDir()
	if err := os.WriteFile(filepath.Join(target, "labels.json"), []byte(`{"schema":1,"labels":[]}`), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(target, filepath.Join(root, ".github")); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	if _, err := Load(root); err == nil || !strings.Contains(err.Error(), "real directory") {
		t.Fatalf("Load() error = %v, want linked-directory refusal", err)
	}
}

func TestSyncCreatesUpdatesAndPreservesCurrentLabels(t *testing.T) {
	t.Parallel()
	var mutex sync.Mutex
	requests := make([]string, 0, 6)
	remote := map[string]Label{
		"area:current": {Name: "area:current", Color: "0e8a16", Description: "Current"},
		"area:update":  {Name: "area:update", Color: "ffffff", Description: "Old"},
		"human":        {Name: "human", Color: "123456", Description: "Unmanaged"},
	}
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		mutex.Lock()
		defer mutex.Unlock()
		requests = append(requests, request.Method+" "+request.URL.EscapedPath())
		if request.Header.Get("Authorization") != "Bearer test-token" || request.Header.Get("X-GitHub-Api-Version") != apiVersion {
			http.Error(writer, "missing identity headers", http.StatusUnauthorized)
			return
		}
		switch request.Method + " " + request.URL.Path {
		case "GET /repos/owner/repository/labels":
			if request.URL.Query().Get("page") != "1" || request.URL.Query().Get("per_page") != "100" {
				http.Error(writer, "bad pagination", http.StatusBadRequest)
				return
			}
			ordered := make([]Label, 0, len(remote))
			for _, name := range []string{"area:current", "area:update", "area:create", "human"} {
				if label, ok := remote[name]; ok {
					ordered = append(ordered, label)
				}
			}
			_ = json.NewEncoder(writer).Encode(ordered)
		case "PATCH /repos/owner/repository/labels/area:update":
			remote["area:update"] = Label{Name: "area:update", Color: "d73a4a", Description: "Updated"}
			writer.WriteHeader(http.StatusOK)
			_ = json.NewEncoder(writer).Encode(remote["area:update"])
		case "POST /repos/owner/repository/labels":
			remote["area:create"] = Label{Name: "area:create", Color: "0366d6", Description: "Created"}
			writer.WriteHeader(http.StatusCreated)
			_ = json.NewEncoder(writer).Encode(remote["area:create"])
		default:
			http.Error(writer, "unexpected request", http.StatusBadRequest)
		}
	}))
	defer server.Close()

	manifest := Manifest{Schema: 1, Labels: []Label{
		{Name: "area:current", Color: "0e8a16", Description: "Current"},
		{Name: "area:update", Color: "d73a4a", Description: "Updated"},
		{Name: "area:create", Color: "0366d6", Description: "Created"},
	}}
	result, err := Sync(context.Background(), server.Client(), manifest, Options{
		APIBase:    server.URL,
		Repository: "owner/repository",
		Token:      "test-token",
	})
	if err != nil {
		t.Fatal(err)
	}
	if result != (Result{Created: 1, Updated: 1, Unchanged: 1}) {
		t.Fatalf("Sync() = %#v", result)
	}
	second, err := Sync(context.Background(), server.Client(), manifest, Options{
		APIBase: server.URL, Repository: "owner/repository", Token: "test-token",
	})
	if err != nil || second != (Result{Unchanged: 3}) {
		t.Fatalf("idempotent Sync() = %#v, %v", second, err)
	}
	if remote["human"].Description != "Unmanaged" || len(requests) != 6 {
		t.Fatalf("requests = %#v", requests)
	}
}

func TestApplyRejectsMutationResponseDrift(t *testing.T) {
	t.Parallel()
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.Method == http.MethodGet {
			_ = json.NewEncoder(writer).Encode([]Label{})
			return
		}
		writer.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(writer).Encode(Label{Name: "wrong", Color: "0e8a16", Description: "Test"})
	}))
	defer server.Close()
	manifest := Manifest{Schema: 1, Labels: []Label{{Name: "area:test", Color: "0e8a16", Description: "Test"}}}
	options := Options{APIBase: server.URL, Repository: "owner/repository", Token: "token"}
	plan, err := Preflight(context.Background(), server.Client(), manifest, options)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := plan.Apply(context.Background(), server.Client(), options); err == nil ||
		!strings.Contains(err.Error(), "response identity") {
		t.Fatalf("Apply() error = %v, want response drift refusal", err)
	}
}

func TestPreflightRejectsRemoteInventoryBeyondBound(t *testing.T) {
	t.Parallel()
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		page := request.URL.Query().Get("page")
		labels := make([]Label, remoteLabelsPerPage)
		for index := range labels {
			labels[index] = Label{
				Name: fmt.Sprintf("unmanaged-%s-%03d", page, index), Color: "123456", Description: "Unmanaged",
			}
		}
		_ = json.NewEncoder(writer).Encode(labels)
	}))
	defer server.Close()
	manifest := Manifest{Schema: 1, Labels: []Label{{Name: "area:test", Color: "0e8a16", Description: "Test"}}}
	_, err := Preflight(context.Background(), server.Client(), manifest, Options{
		APIBase: server.URL, Repository: "owner/repository", Token: "token",
	})
	if err == nil || !strings.Contains(err.Error(), "exceeds") {
		t.Fatalf("Preflight() error = %v, want bounded-inventory refusal", err)
	}
}

func TestSyncRejectsMissingAuthority(t *testing.T) {
	t.Parallel()
	manifest := Manifest{Schema: 1, Labels: []Label{{
		Name: "area:test", Color: "0e8a16", Description: "Test",
	}}}
	if _, err := Sync(context.Background(), http.DefaultClient, manifest, Options{}); err == nil {
		t.Fatal("Sync() accepted missing repository and token authority")
	}
}

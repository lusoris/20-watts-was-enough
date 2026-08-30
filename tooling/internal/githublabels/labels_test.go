package githublabels

import (
	"context"
	"encoding/json"
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
	requests := make([]string, 0, 5)
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		mutex.Lock()
		requests = append(requests, request.Method+" "+request.URL.EscapedPath())
		mutex.Unlock()
		if request.Header.Get("Authorization") != "Bearer test-token" || request.Header.Get("X-GitHub-Api-Version") != apiVersion {
			http.Error(writer, "missing identity headers", http.StatusUnauthorized)
			return
		}
		switch request.Method + " " + request.URL.Path {
		case "GET /repos/owner/repository/labels/area:current":
			_ = json.NewEncoder(writer).Encode(Label{Name: "area:current", Color: "0e8a16", Description: "Current"})
		case "GET /repos/owner/repository/labels/area:update":
			_ = json.NewEncoder(writer).Encode(Label{Name: "area:update", Color: "ffffff", Description: "Old"})
		case "PATCH /repos/owner/repository/labels/area:update":
			writer.WriteHeader(http.StatusOK)
		case "GET /repos/owner/repository/labels/area:create":
			writer.WriteHeader(http.StatusNotFound)
		case "POST /repos/owner/repository/labels":
			writer.WriteHeader(http.StatusCreated)
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
	if len(requests) != 5 {
		t.Fatalf("requests = %#v", requests)
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

package pdftools

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"
	"net/url"
	"strings"
	"testing"
)

type sourceRoundTripFunc func(*http.Request) (*http.Response, error)

func (function sourceRoundTripFunc) RoundTrip(request *http.Request) (*http.Response, error) {
	return function(request)
}

func TestDownloadExactSourceAdmitsOnlyExactBoundedBytes(t *testing.T) {
	t.Parallel()
	body := []byte("exact source bytes")
	digest := sha256.Sum256(body)
	source := exactSource{
		Name: "fixture", URL: "https://packages.wolfi.dev/os/x86_64/fixture.apk",
		Size: int64(len(body)), SHA256: hex.EncodeToString(digest[:]),
	}
	client := sourceTestClient(t, body, func(request *http.Request, response *http.Response) {
		if request.Header.Get("Accept-Encoding") != "identity" || request.Header.Get("User-Agent") != "20w-pdf-tools-candidate/1" {
			t.Fatalf("request headers = %#v", request.Header)
		}
	})
	got, err := downloadExactSource(context.Background(), client, source)
	if err != nil || string(got) != string(body) {
		t.Fatalf("downloadExactSource() = %q, %v", got, err)
	}

	tests := map[string]func(*http.Response){
		"status":         func(response *http.Response) { response.StatusCode = http.StatusNotFound },
		"content length": func(response *http.Response) { response.ContentLength++ },
		"encoded":        func(response *http.Response) { response.Header.Set("Content-Encoding", "gzip") },
		"changed URL": func(response *http.Response) {
			response.Request.URL, _ = url.Parse("https://attacker.invalid/fixture.apk")
		},
	}
	for name, mutate := range tests {
		name, mutate := name, mutate
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			client := sourceTestClient(t, body, func(_ *http.Request, response *http.Response) {
				mutate(response)
			})
			if _, err := downloadExactSource(context.Background(), client, source); err == nil {
				t.Fatalf("downloadExactSource() accepted %s mutation", name)
			}
		})
	}
	for name, mutated := range map[string]exactSource{
		"digest": {Name: source.Name, URL: source.URL, Size: source.Size, SHA256: strings.Repeat("0", 64)},
		"size":   {Name: source.Name, URL: source.URL, Size: source.Size - 1, SHA256: source.SHA256},
	} {
		if _, err := downloadExactSource(context.Background(), sourceTestClient(t, body, nil), mutated); err == nil {
			t.Fatalf("downloadExactSource() accepted %s mutation", name)
		}
	}
}

func TestDownloadExactSourceRejectsInvalidIdentityAndTrailingBytes(t *testing.T) {
	t.Parallel()
	body := []byte("body")
	digest := sha256.Sum256(body)
	valid := exactSource{Name: "fixture", URL: "https://example.invalid/source", Size: 4, SHA256: hex.EncodeToString(digest[:])}
	for name, source := range map[string]exactSource{
		"http":        {Name: valid.Name, URL: "http://example.invalid/source", Size: valid.Size, SHA256: valid.SHA256},
		"credentials": {Name: valid.Name, URL: "https://user@example.invalid/source", Size: valid.Size, SHA256: valid.SHA256},
		"query":       {Name: valid.Name, URL: valid.URL + "?mutable=1", Size: valid.Size, SHA256: valid.SHA256},
		"zero size":   {Name: valid.Name, URL: valid.URL, SHA256: valid.SHA256},
		"bad digest":  {Name: valid.Name, URL: valid.URL, Size: valid.Size, SHA256: "short"},
	} {
		name, source := name, source
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			if _, err := downloadExactSource(context.Background(), sourceTestClient(t, body, nil), source); err == nil {
				t.Fatalf("downloadExactSource() accepted %s", name)
			}
		})
	}
	client := sourceTestClient(t, append(body, '!'), func(_ *http.Request, response *http.Response) {
		response.ContentLength = -1
	})
	if _, err := downloadExactSource(context.Background(), client, valid); err == nil {
		t.Fatal("downloadExactSource() accepted trailing bytes")
	}
}

func sourceTestClient(
	t *testing.T,
	body []byte,
	mutate func(*http.Request, *http.Response),
) *http.Client {
	t.Helper()
	return &http.Client{Transport: sourceRoundTripFunc(func(request *http.Request) (*http.Response, error) {
		response := &http.Response{
			StatusCode:    http.StatusOK,
			Header:        http.Header{},
			Body:          io.NopCloser(strings.NewReader(string(body))),
			ContentLength: int64(len(body)),
			Request:       request,
		}
		if mutate != nil {
			mutate(request, response)
		}
		return response, nil
	})}
}

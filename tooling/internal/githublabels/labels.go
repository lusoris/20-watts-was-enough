// Package githublabels validates and synchronizes the repository label manifest.
package githublabels

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/repositorymanifest"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/strictjson"
)

const (
	manifestRelativePath = ".github/labels.json"
	maximumManifestBytes = 64 << 10
	maximumLabels        = 128
	maximumResponseBytes = 1 << 20
	defaultAPIBase       = "https://api.github.com"
	apiVersion           = "2026-03-10"
)

var (
	colorPattern      = regexp.MustCompile(`^[0-9a-f]{6}$`)
	labelNamePattern  = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9 .:_-]{0,49}$`)
	repositoryPattern = regexp.MustCompile(`^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$`)
)

// Label is one exact managed GitHub label identity.
type Label struct {
	Name        string `json:"name"`
	Color       string `json:"color"`
	Description string `json:"description"`
}

// Manifest is the closed Git authority for managed repository labels.
type Manifest struct {
	Schema int     `json:"schema"`
	Labels []Label `json:"labels"`
}

// Result reports only the bounded mutations made by a synchronization.
type Result struct {
	Created   int
	Updated   int
	Unchanged int
}

// Options binds one synchronization to a repository and authenticated API.
type Options struct {
	APIBase    string
	Repository string
	Token      string
}

// HTTPClient is the smallest client surface required by Sync.
type HTTPClient interface {
	Do(*http.Request) (*http.Response, error)
}

// Load reads and validates the one canonical label manifest beneath root.
func Load(root string) (Manifest, error) {
	body, err := repositorymanifest.Read(root, manifestRelativePath, maximumManifestBytes)
	if err != nil {
		return Manifest{}, fmt.Errorf("read %s: %w", manifestRelativePath, err)
	}
	if err := strictjson.Validate(body, 8); err != nil {
		return Manifest{}, fmt.Errorf("validate unambiguous label JSON: %w", err)
	}
	decoder := json.NewDecoder(bytes.NewReader(body))
	decoder.DisallowUnknownFields()
	var manifest Manifest
	if err := decoder.Decode(&manifest); err != nil {
		return Manifest{}, fmt.Errorf("decode label manifest: %w", err)
	}
	if decoder.Decode(&struct{}{}) != io.EOF {
		return Manifest{}, errors.New("label manifest contains trailing data")
	}
	if err := validateManifest(manifest); err != nil {
		return Manifest{}, err
	}
	return manifest, nil
}

func validateManifest(manifest Manifest) error {
	if manifest.Schema != 1 {
		return errors.New("label manifest schema must be 1")
	}
	if len(manifest.Labels) == 0 || len(manifest.Labels) > maximumLabels {
		return fmt.Errorf("label manifest must contain between 1 and %d labels", maximumLabels)
	}
	seen := make(map[string]struct{}, len(manifest.Labels))
	for index, label := range manifest.Labels {
		if !labelNamePattern.MatchString(label.Name) {
			return fmt.Errorf("label %d has an invalid name", index)
		}
		if !colorPattern.MatchString(label.Color) {
			return fmt.Errorf("label %q needs a lowercase six-digit color", label.Name)
		}
		if len(label.Description) == 0 || len(label.Description) > 100 {
			return fmt.Errorf("label %q description must contain 1-100 bytes", label.Name)
		}
		if _, duplicate := seen[label.Name]; duplicate {
			return fmt.Errorf("label %q is repeated", label.Name)
		}
		seen[label.Name] = struct{}{}
	}
	return nil
}

// Sync creates missing managed labels and repairs changed color or description.
// Labels not named by the manifest are deliberately left untouched.
func Sync(ctx context.Context, client HTTPClient, manifest Manifest, options Options) (Result, error) {
	if err := validateManifest(manifest); err != nil {
		return Result{}, err
	}
	if client == nil || !repositoryPattern.MatchString(options.Repository) || options.Token == "" {
		return Result{}, errors.New("label synchronization requires a client, owner/repository, and token")
	}
	apiBase := strings.TrimSuffix(options.APIBase, "/")
	if apiBase == "" {
		apiBase = defaultAPIBase
	}
	parsedBase, err := url.Parse(apiBase)
	if err != nil || parsedBase.Scheme == "" || parsedBase.Host == "" || parsedBase.RawQuery != "" || parsedBase.Fragment != "" {
		return Result{}, errors.New("label synchronization API base is invalid")
	}

	var result Result
	for _, label := range manifest.Labels {
		state, err := inspectLabel(ctx, client, parsedBase, options, label.Name)
		if err != nil {
			return Result{}, err
		}
		switch {
		case state == nil:
			if err := mutateLabel(ctx, client, parsedBase, options, http.MethodPost, "", label, http.StatusCreated); err != nil {
				return Result{}, err
			}
			result.Created++
		case strings.EqualFold(state.Color, label.Color) && state.Description == label.Description:
			result.Unchanged++
		default:
			if err := mutateLabel(ctx, client, parsedBase, options, http.MethodPatch, label.Name, label, http.StatusOK); err != nil {
				return Result{}, err
			}
			result.Updated++
		}
	}
	return result, nil
}

func inspectLabel(ctx context.Context, client HTTPClient, base *url.URL, options Options, name string) (*Label, error) {
	request, err := newRequest(ctx, base, options, http.MethodGet, name, nil)
	if err != nil {
		return nil, err
	}
	response, err := client.Do(request)
	if err != nil {
		return nil, fmt.Errorf("inspect GitHub label %q: %w", name, err)
	}
	defer response.Body.Close()
	if response.StatusCode == http.StatusNotFound {
		return nil, drainBounded(response.Body)
	}
	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("inspect GitHub label %q: unexpected HTTP status %d", name, response.StatusCode)
	}
	body, err := io.ReadAll(io.LimitReader(response.Body, maximumResponseBytes+1))
	if err != nil || len(body) > maximumResponseBytes {
		return nil, fmt.Errorf("inspect GitHub label %q: response exceeds its bounded readable form", name)
	}
	var state Label
	if err := json.Unmarshal(body, &state); err != nil {
		return nil, fmt.Errorf("inspect GitHub label %q: decode response: %w", name, err)
	}
	if state.Name != name {
		return nil, fmt.Errorf("inspect GitHub label %q: response names %q", name, state.Name)
	}
	return &state, nil
}

func mutateLabel(ctx context.Context, client HTTPClient, base *url.URL, options Options, method, name string, label Label, expectedStatus int) error {
	payload := map[string]string{
		"color":       label.Color,
		"description": label.Description,
		"name":        label.Name,
	}
	if method == http.MethodPatch {
		delete(payload, "name")
		payload["new_name"] = label.Name
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("encode GitHub label %q: %w", label.Name, err)
	}
	request, err := newRequest(ctx, base, options, method, name, body)
	if err != nil {
		return err
	}
	response, err := client.Do(request)
	if err != nil {
		return fmt.Errorf("synchronize GitHub label %q: %w", label.Name, err)
	}
	defer response.Body.Close()
	if response.StatusCode != expectedStatus {
		return fmt.Errorf("synchronize GitHub label %q: unexpected HTTP status %d", label.Name, response.StatusCode)
	}
	return drainBounded(response.Body)
}

func newRequest(ctx context.Context, base *url.URL, options Options, method, name string, body []byte) (*http.Request, error) {
	endpoint := strings.TrimSuffix(base.String(), "/") + "/repos/" + options.Repository + "/labels"
	if name != "" {
		endpoint += "/" + url.PathEscape(name)
	}
	var reader io.Reader
	if body != nil {
		reader = bytes.NewReader(body)
	}
	request, err := http.NewRequestWithContext(ctx, method, endpoint, reader)
	if err != nil {
		return nil, fmt.Errorf("construct GitHub label request: %w", err)
	}
	request.Header.Set("Accept", "application/vnd.github+json")
	request.Header.Set("Authorization", "Bearer "+options.Token)
	request.Header.Set("User-Agent", "20w-label-sync")
	request.Header.Set("X-GitHub-Api-Version", apiVersion)
	if body != nil {
		request.Header.Set("Content-Type", "application/json")
	}
	return request, nil
}

func drainBounded(reader io.Reader) error {
	written, err := io.Copy(io.Discard, io.LimitReader(reader, maximumResponseBytes+1))
	if err != nil {
		return err
	}
	if written > maximumResponseBytes {
		return errors.New("GitHub response exceeds its byte limit")
	}
	return nil
}

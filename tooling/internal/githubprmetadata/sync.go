// Package githubprmetadata projects one explicitly referenced managed issue
// onto pull-request labels and its roadmap milestone.
package githubprmetadata

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
	"sort"
	"strconv"
	"strings"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/githubissuemilestones"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/githublabels"
	"github.com/lusoris/20-watts-was-enough/tooling/internal/githubmilestones"
)

const (
	defaultAPIBase       = "https://api.github.com"
	apiVersion           = "2026-03-10"
	maximumResponseBytes = 1 << 20
	maximumBodyBytes     = 128 << 10
	maximumLabels        = 128
	maximumNumber        = 1_000_000_000
	maximumSyncAttempts  = 3
)

var (
	repositoryPattern = regexp.MustCompile(`^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$`)
	referencePattern  = regexp.MustCompile(`(?im)^[\t ]*(?:refs|tracks|closes|fixes|resolves)[\t ]+#([1-9][0-9]{0,9})\.?[\t ]*\r?$`)
	titlePattern      = regexp.MustCompile(`^([a-z][a-z0-9-]{0,31})(?:\([^()\r\n]{1,64}\))?!?:\s+\S`)
)

// Authorities are the committed repository metadata manifests used by the
// projection. They remain independent of pull-request input.
type Authorities struct {
	Labels     githublabels.Manifest
	Milestones githubmilestones.Manifest
	Issues     githubissuemilestones.Manifest
}

// MilestoneInventory resolves a stable roadmap identity only after the remote
// milestone inventory has been checked against Git authority.
type MilestoneInventory interface {
	Number(string) (int, bool)
}

// HTTPClient is the smallest transport surface required by Sync.
type HTTPClient interface {
	Do(*http.Request) (*http.Response, error)
}

// Options binds one synchronization to one repository pull request.
type Options struct {
	APIBase     string
	Repository  string
	Token       string
	PullRequest int
}

// Result reports either one converged pull request or a typed no-write skip.
type Result struct {
	Updated   bool
	Skipped   bool
	Reason    string
	Issue     int
	Milestone int
	Labels    []string
}

type remoteMilestone struct {
	Number int `json:"number"`
}

type remoteLabel struct {
	Name string `json:"name"`
}

type remoteItem struct {
	Number      int              `json:"number"`
	NodeID      string           `json:"node_id"`
	State       string           `json:"state"`
	Title       string           `json:"title"`
	Body        *string          `json:"body"`
	Labels      []remoteLabel    `json:"labels"`
	Milestone   *remoteMilestone `json:"milestone"`
	PullRequest *json.RawMessage `json:"pull_request"`
}

type observation struct {
	nodeID    string
	state     string
	title     string
	body      string
	milestone int
	labels    string
}

type labelsPayload struct {
	Labels []string `json:"labels"`
}

type milestonePayload struct {
	Milestone int `json:"milestone"`
}

type authorityIndex struct {
	managed     map[string]string
	assignments map[int]string
}

// ValidateAuthorities checks that every issue assignment resolves to a
// committed milestone and that all managed label classes needed by the
// projection exist.
func ValidateAuthorities(authorities Authorities) error {
	_, err := indexAuthorities(authorities)
	return err
}

// Sync reads one pull request and its one unambiguous managed issue reference,
// confirms both snapshots, then converges only the owned classification labels
// and milestone. It retries a bounded number of times so a partial remote write
// or concurrent source edit either converges from fresh state or fails visibly.
// Missing or ambiguous managed references are successful no-write skips.
func Sync(
	ctx context.Context,
	client HTTPClient,
	authorities Authorities,
	milestones MilestoneInventory,
	options Options,
) (Result, error) {
	index, err := indexAuthorities(authorities)
	if err != nil {
		return Result{}, err
	}
	base, err := validateOptions(client, options, authorities.Issues.Repository)
	if err != nil {
		return Result{}, err
	}
	if milestones == nil {
		return Result{}, errors.New("pull-request metadata requires a verified milestone inventory")
	}

	updated := false
	var lastErr error
	for attempt := 1; attempt <= maximumSyncAttempts; attempt++ {
		result, attempted, retry, err := syncAttempt(ctx, client, base, options, index, milestones)
		updated = updated || attempted
		if err == nil {
			if result.Skipped && updated {
				return Result{}, errors.New("pull-request metadata became unowned after a remote mutation attempt")
			}
			result.Updated = updated
			return result, nil
		}
		if !retry || ctx.Err() != nil {
			return Result{}, err
		}
		lastErr = err
	}
	return Result{}, fmt.Errorf("pull-request metadata did not converge after %d attempts: %w", maximumSyncAttempts, lastErr)
}

func syncAttempt(
	ctx context.Context,
	client HTTPClient,
	base *url.URL,
	options Options,
	index authorityIndex,
	milestones MilestoneInventory,
) (Result, bool, bool, error) {
	pull, err := inspectItem(ctx, client, base, options, options.PullRequest, true)
	if err != nil {
		return Result{}, false, true, err
	}
	issueNumber, reason := referencedManagedIssue(bodyText(pull), index.assignments)
	if issueNumber == 0 {
		return confirmSkipped(ctx, client, base, options, pull, reason)
	}
	issue, err := inspectItem(ctx, client, base, options, issueNumber, false)
	if err != nil {
		return Result{}, false, true, err
	}
	confirmedPull, err := inspectItem(ctx, client, base, options, options.PullRequest, true)
	if err != nil {
		return Result{}, false, true, err
	}
	confirmedIssue, err := inspectItem(ctx, client, base, options, issueNumber, false)
	if err != nil {
		return Result{}, false, true, err
	}
	if observe(confirmedPull) != observe(pull) || observe(confirmedIssue) != observe(issue) {
		return Result{}, false, true, errors.New("pull request or referenced issue changed after metadata preflight")
	}
	desired, milestone, err := desiredMetadata(confirmedPull, confirmedIssue, issueNumber, index, milestones)
	if err != nil {
		return Result{}, false, false, err
	}
	result := Result{Issue: issueNumber, Milestone: milestone, Labels: displayLabels(confirmedPull.Labels)}
	if equalOwnedMetadata(confirmedPull, desired, milestone) {
		return result, false, false, nil
	}
	attempted, err := convergePull(ctx, client, base, options, confirmedPull, desired, milestone)
	if err != nil {
		return Result{}, attempted, true, err
	}
	readbackPull, err := inspectItem(ctx, client, base, options, options.PullRequest, true)
	if err != nil {
		return Result{}, attempted, true, err
	}
	readbackIssue, err := inspectItem(ctx, client, base, options, issueNumber, false)
	if err != nil {
		return Result{}, attempted, true, err
	}
	if observeIdentity(readbackPull) != observeIdentity(confirmedPull) || observe(readbackIssue) != observe(confirmedIssue) {
		return Result{}, attempted, true, errors.New("pull request or referenced issue changed during metadata synchronization")
	}
	if !equalOwnedMetadata(readbackPull, desired, milestone) {
		return Result{}, attempted, true, errors.New("owned pull-request metadata does not match the requested state after synchronization")
	}
	result.Labels = displayLabels(readbackPull.Labels)
	return result, attempted, false, nil
}

func confirmSkipped(
	ctx context.Context,
	client HTTPClient,
	base *url.URL,
	options Options,
	pull remoteItem,
	reason string,
) (Result, bool, bool, error) {
	confirmed, err := inspectItem(ctx, client, base, options, options.PullRequest, true)
	if err != nil {
		return Result{}, false, true, err
	}
	if observe(confirmed) != observe(pull) {
		return Result{}, false, true, errors.New("pull request changed while confirming the metadata no-write decision")
	}
	return Result{Skipped: true, Reason: reason}, false, false, nil
}

func indexAuthorities(authorities Authorities) (authorityIndex, error) {
	if authorities.Labels.Schema != 1 || authorities.Milestones.Schema != 1 || authorities.Issues.Schema != 1 {
		return authorityIndex{}, errors.New("pull-request metadata authorities require schema 1")
	}
	managed := make(map[string]string, len(authorities.Labels.Labels))
	classes := map[string]int{"type:": 0, "severity:": 0, "status:": 0, "area:": 0}
	for _, label := range authorities.Labels.Labels {
		name := strings.ToLower(label.Name)
		if _, duplicate := managed[name]; duplicate || strings.TrimSpace(label.Name) != label.Name {
			return authorityIndex{}, fmt.Errorf("managed label identity %q is invalid or repeated", label.Name)
		}
		managed[name] = label.Name
		for prefix := range classes {
			if strings.HasPrefix(name, prefix) {
				classes[prefix]++
			}
		}
	}
	for _, prefix := range []string{"type:", "severity:", "status:", "area:"} {
		if classes[prefix] == 0 {
			return authorityIndex{}, fmt.Errorf("managed label manifest has no %s classification", prefix)
		}
	}
	milestoneIDs := make(map[string]struct{}, len(authorities.Milestones.Milestones))
	for _, milestone := range authorities.Milestones.Milestones {
		if milestone.ID == "" {
			return authorityIndex{}, errors.New("managed milestone identity is empty")
		}
		milestoneIDs[milestone.ID] = struct{}{}
	}
	if !repositoryPattern.MatchString(authorities.Issues.Repository) {
		return authorityIndex{}, errors.New("issue assignments require an explicit owner/repository identity")
	}
	assignments := make(map[int]string, len(authorities.Issues.Assignments))
	for _, assignment := range authorities.Issues.Assignments {
		if assignment.Issue < 1 || assignment.Issue > maximumNumber {
			return authorityIndex{}, fmt.Errorf("managed issue number %d is invalid", assignment.Issue)
		}
		if _, exists := assignments[assignment.Issue]; exists {
			return authorityIndex{}, fmt.Errorf("managed issue %d is repeated", assignment.Issue)
		}
		if _, exists := milestoneIDs[assignment.Milestone]; !exists {
			return authorityIndex{}, fmt.Errorf("managed issue %d maps to unknown milestone %s", assignment.Issue, assignment.Milestone)
		}
		assignments[assignment.Issue] = assignment.Milestone
	}
	if len(assignments) == 0 {
		return authorityIndex{}, errors.New("issue assignment authority is empty")
	}
	return authorityIndex{managed: managed, assignments: assignments}, nil
}

func referencedManagedIssue(body string, assignments map[int]string) (int, string) {
	matches := referencePattern.FindAllStringSubmatch(body, -1)
	managed := make(map[int]struct{})
	for _, match := range matches {
		number, err := strconv.Atoi(match[1])
		if err == nil && number <= maximumNumber {
			if _, exists := assignments[number]; exists {
				managed[number] = struct{}{}
			}
		}
	}
	if len(managed) == 0 {
		return 0, "no explicit managed issue reference"
	}
	if len(managed) != 1 {
		return 0, "multiple explicit managed issue references"
	}
	for number := range managed {
		return number, ""
	}
	panic("unreachable")
}

func desiredMetadata(
	pull remoteItem,
	issue remoteItem,
	issueNumber int,
	index authorityIndex,
	milestones MilestoneInventory,
) ([]string, int, error) {
	if issue.State != "open" {
		return nil, 0, fmt.Errorf("referenced managed issue %d is not open", issueNumber)
	}
	title := titlePattern.FindStringSubmatch(pull.Title)
	if title == nil {
		return nil, 0, errors.New("pull-request title must begin with a supported Conventional Commit type")
	}
	typeLabel := "type:" + title[1]
	managedType, exists := index.managed[typeLabel]
	if !exists {
		return nil, 0, fmt.Errorf("pull-request title type %q has no managed label", title[1])
	}
	issueClasses, err := classify(issue.Labels, index.managed)
	if err != nil {
		return nil, 0, fmt.Errorf("referenced managed issue %d: %w", issueNumber, err)
	}
	milestoneID := index.assignments[issueNumber]
	milestone, ok := milestones.Number(milestoneID)
	if !ok || milestone < 1 {
		return nil, 0, fmt.Errorf("managed milestone %s lacks a verified numeric identity", milestoneID)
	}
	if issue.Milestone == nil || issue.Milestone.Number != milestone {
		return nil, 0, fmt.Errorf("referenced managed issue %d does not carry milestone %s", issueNumber, milestoneID)
	}

	desired := make(map[string]string)
	for _, label := range pull.Labels {
		name := strings.ToLower(label.Name)
		managedName, isManaged := index.managed[name]
		if isManaged && strings.HasPrefix(name, "area:") {
			desired[name] = managedName
		}
	}
	desired[typeLabel] = managedType
	desired[strings.ToLower(issueClasses.severity)] = issueClasses.severity
	desired[strings.ToLower(issueClasses.status)] = issueClasses.status
	for _, area := range issueClasses.areas {
		desired[strings.ToLower(area)] = area
	}
	labels := make([]string, 0, len(desired))
	for _, label := range desired {
		labels = append(labels, label)
	}
	sort.Strings(labels)
	if len(labels) > maximumLabels {
		return nil, 0, fmt.Errorf("projected pull-request labels exceed %d entries", maximumLabels)
	}
	return labels, milestone, nil
}

func isClassification(name string) bool {
	return strings.HasPrefix(name, "type:") || strings.HasPrefix(name, "severity:") ||
		strings.HasPrefix(name, "status:") || strings.HasPrefix(name, "area:")
}

type classifications struct {
	severity string
	status   string
	areas    []string
}

func classify(labels []remoteLabel, managed map[string]string) (classifications, error) {
	counts := map[string]int{"type:": 0, "severity:": 0, "status:": 0, "area:": 0}
	result := classifications{}
	seen := make(map[string]struct{}, len(labels))
	for _, label := range labels {
		name := strings.ToLower(label.Name)
		canonical, isManaged := managed[name]
		if _, duplicate := seen[name]; duplicate || strings.TrimSpace(label.Name) != label.Name {
			return classifications{}, fmt.Errorf("label %q is invalid or repeated", label.Name)
		}
		seen[name] = struct{}{}
		if !isManaged {
			continue
		}
		for prefix := range counts {
			if strings.HasPrefix(name, prefix) {
				counts[prefix]++
				switch prefix {
				case "severity:":
					result.severity = canonical
				case "status:":
					result.status = canonical
				case "area:":
					result.areas = append(result.areas, canonical)
				}
			}
		}
	}
	if counts["type:"] != 1 || counts["severity:"] != 1 || counts["status:"] != 1 || counts["area:"] < 1 {
		return classifications{}, errors.New("requires exactly one managed type, severity, and status label plus at least one managed area")
	}
	return result, nil
}

func validateOptions(client HTTPClient, options Options, repository string) (*url.URL, error) {
	if client == nil || options.Token == "" || !repositoryPattern.MatchString(options.Repository) ||
		options.Repository != repository || options.PullRequest < 1 || options.PullRequest > maximumNumber {
		return nil, errors.New("pull-request metadata requires a client, matching owner/repository, token, and pull-request number")
	}
	apiBase := strings.TrimSuffix(options.APIBase, "/")
	if apiBase == "" {
		apiBase = defaultAPIBase
	}
	base, err := url.Parse(apiBase)
	if err != nil || base.Scheme == "" || base.Host == "" || base.User != nil || base.RawQuery != "" || base.Fragment != "" {
		return nil, errors.New("pull-request metadata API base is invalid")
	}
	return base, nil
}

func inspectItem(
	ctx context.Context,
	client HTTPClient,
	base *url.URL,
	options Options,
	number int,
	wantPull bool,
) (remoteItem, error) {
	request, err := newRequest(ctx, base, options, http.MethodGet, number, nil)
	if err != nil {
		return remoteItem{}, err
	}
	response, err := client.Do(request)
	if err != nil {
		return remoteItem{}, fmt.Errorf("inspect GitHub item %d: %w", number, err)
	}
	return decodeItem(response, number, wantPull, "inspect")
}

func convergePull(
	ctx context.Context,
	client HTTPClient,
	base *url.URL,
	options Options,
	current remoteItem,
	desired []string,
	milestone int,
) (bool, error) {
	add, remove := classificationDelta(current.Labels, desired)
	attempted := false
	if len(add) > 0 {
		attempted = true
		if err := addLabels(ctx, client, base, options, add); err != nil {
			return attempted, err
		}
	}
	for _, label := range remove {
		attempted = true
		if err := removeLabel(ctx, client, base, options, label); err != nil {
			return attempted, err
		}
	}
	if milestoneNumber(current) != milestone {
		attempted = true
		if err := updateMilestone(ctx, client, base, options, milestone, observeIdentity(current)); err != nil {
			return attempted, err
		}
	}
	return attempted, nil
}

func classificationDelta(current []remoteLabel, desired []string) ([]string, []string) {
	desiredSet := make(map[string]string, len(desired))
	for _, label := range desired {
		desiredSet[strings.ToLower(label)] = label
	}
	currentSet := make(map[string]string, len(current))
	for _, label := range current {
		name := strings.ToLower(label.Name)
		if isClassification(name) {
			currentSet[name] = label.Name
		}
	}
	add := make([]string, 0, len(desiredSet))
	for name, label := range desiredSet {
		if _, exists := currentSet[name]; !exists {
			add = append(add, label)
		}
	}
	remove := make([]string, 0, len(currentSet))
	for name, label := range currentSet {
		if _, exists := desiredSet[name]; !exists {
			remove = append(remove, label)
		}
	}
	sort.Strings(add)
	sort.Strings(remove)
	return add, remove
}

func addLabels(
	ctx context.Context,
	client HTTPClient,
	base *url.URL,
	options Options,
	labels []string,
) error {
	body, err := json.Marshal(labelsPayload{Labels: labels})
	if err != nil {
		return fmt.Errorf("encode pull-request label additions: %w", err)
	}
	request, err := newRequest(ctx, base, options, http.MethodPost, options.PullRequest, body, "labels")
	if err != nil {
		return err
	}
	response, err := client.Do(request)
	if err != nil {
		return fmt.Errorf("add GitHub pull-request labels: %w", err)
	}
	return decodeLabelMutation(response, options.PullRequest, "add")
}

func removeLabel(
	ctx context.Context,
	client HTTPClient,
	base *url.URL,
	options Options,
	label string,
) error {
	request, err := newRequest(ctx, base, options, http.MethodDelete, options.PullRequest, nil, "labels", label)
	if err != nil {
		return err
	}
	response, err := client.Do(request)
	if err != nil {
		return fmt.Errorf("remove GitHub pull-request label %q: %w", label, err)
	}
	return decodeLabelMutation(response, options.PullRequest, "remove")
}

func updateMilestone(
	ctx context.Context,
	client HTTPClient,
	base *url.URL,
	options Options,
	milestone int,
	expected itemIdentity,
) error {
	body, err := json.Marshal(milestonePayload{Milestone: milestone})
	if err != nil {
		return fmt.Errorf("encode pull-request milestone: %w", err)
	}
	request, err := newRequest(ctx, base, options, http.MethodPatch, options.PullRequest, body)
	if err != nil {
		return err
	}
	response, err := client.Do(request)
	if err != nil {
		return fmt.Errorf("update GitHub pull-request milestone: %w", err)
	}
	item, err := decodeItem(response, options.PullRequest, true, "update milestone on")
	if err != nil {
		return err
	}
	if observeIdentity(item) != expected {
		return errors.New("update GitHub pull-request milestone: response identity changed")
	}
	return nil
}

func newRequest(
	ctx context.Context,
	base *url.URL,
	options Options,
	method string,
	number int,
	body []byte,
	suffix ...string,
) (*http.Request, error) {
	target := *base
	prefix := strings.TrimSuffix(base.Path, "/") + "/repos/" + options.Repository + "/issues/" + strconv.Itoa(number)
	target.Path = prefix
	target.RawPath = ""
	if len(suffix) > 0 {
		target.RawPath = escapedPath(prefix)
		for _, segment := range suffix {
			target.Path += "/" + segment
			target.RawPath += "/" + url.PathEscape(segment)
		}
	}
	request, err := http.NewRequestWithContext(ctx, method, target.String(), bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("create GitHub metadata request: %w", err)
	}
	request.Header.Set("Accept", "application/vnd.github+json")
	request.Header.Set("Authorization", "Bearer "+options.Token)
	request.Header.Set("X-GitHub-Api-Version", apiVersion)
	request.Header.Set("User-Agent", "20w-github-pr-metadata")
	if body != nil {
		request.Header.Set("Content-Type", "application/json")
	}
	return request, nil
}

func escapedPath(path string) string {
	segments := strings.Split(path, "/")
	for index, segment := range segments {
		segments[index] = url.PathEscape(segment)
	}
	return strings.Join(segments, "/")
}

func decodeLabelMutation(response *http.Response, number int, operation string) error {
	if response == nil || response.Body == nil {
		return fmt.Errorf("%s GitHub pull-request labels %d: empty HTTP response", operation, number)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		_, err := io.Copy(io.Discard, io.LimitReader(response.Body, maximumResponseBytes+1))
		if err != nil {
			return fmt.Errorf("%s GitHub pull-request labels %d: drain response: %w", operation, number, err)
		}
		return fmt.Errorf("%s GitHub pull-request labels %d: unexpected HTTP status %d", operation, number, response.StatusCode)
	}
	body, err := io.ReadAll(io.LimitReader(response.Body, maximumResponseBytes+1))
	if err != nil || len(body) > maximumResponseBytes {
		return fmt.Errorf("%s GitHub pull-request labels %d: response exceeds its bounded readable form", operation, number)
	}
	var labels []remoteLabel
	if err := json.Unmarshal(body, &labels); err != nil || len(labels) > maximumLabels {
		return fmt.Errorf("%s GitHub pull-request labels %d: malformed response", operation, number)
	}
	if _, err := normalizedLabels(labels); err != nil {
		return fmt.Errorf("%s GitHub pull-request labels %d: %w", operation, number, err)
	}
	return nil
}

func decodeItem(response *http.Response, number int, wantPull bool, operation string) (remoteItem, error) {
	if response == nil || response.Body == nil {
		return remoteItem{}, fmt.Errorf("%s GitHub item %d: empty HTTP response", operation, number)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		_, err := io.Copy(io.Discard, io.LimitReader(response.Body, maximumResponseBytes+1))
		if err != nil {
			return remoteItem{}, fmt.Errorf("%s GitHub item %d: drain response: %w", operation, number, err)
		}
		return remoteItem{}, fmt.Errorf("%s GitHub item %d: unexpected HTTP status %d", operation, number, response.StatusCode)
	}
	body, err := io.ReadAll(io.LimitReader(response.Body, maximumResponseBytes+1))
	if err != nil || len(body) > maximumResponseBytes {
		return remoteItem{}, fmt.Errorf("%s GitHub item %d: response exceeds its bounded readable form", operation, number)
	}
	var item remoteItem
	if err := json.Unmarshal(body, &item); err != nil {
		return remoteItem{}, fmt.Errorf("%s GitHub item %d: decode response: %w", operation, number, err)
	}
	bodyLength := len(bodyText(item))
	if item.Number != number || item.NodeID == "" || item.State != "open" || item.Title == "" ||
		bodyLength > maximumBodyBytes || len(item.Labels) > maximumLabels ||
		(item.Milestone != nil && item.Milestone.Number < 1) || (item.PullRequest != nil) != wantPull {
		return remoteItem{}, fmt.Errorf("%s GitHub item %d: malformed, closed, or wrong item kind", operation, number)
	}
	if _, err := normalizedLabels(item.Labels); err != nil {
		return remoteItem{}, fmt.Errorf("%s GitHub item %d: %w", operation, number, err)
	}
	return item, nil
}

func bodyText(item remoteItem) string {
	if item.Body == nil {
		return ""
	}
	return *item.Body
}

func observe(item remoteItem) observation {
	milestone := 0
	if item.Milestone != nil {
		milestone = item.Milestone.Number
	}
	labels, _ := normalizedLabels(item.Labels)
	return observation{
		nodeID: item.NodeID, state: item.State, title: item.Title, body: bodyText(item),
		milestone: milestone, labels: strings.Join(labels, "\x00"),
	}
}

func normalizedLabels(labels []remoteLabel) ([]string, error) {
	names := make([]string, 0, len(labels))
	seen := make(map[string]struct{}, len(labels))
	for _, label := range labels {
		name := strings.ToLower(label.Name)
		if name == "" || strings.TrimSpace(label.Name) != label.Name {
			return nil, fmt.Errorf("label %q is invalid", label.Name)
		}
		if _, duplicate := seen[name]; duplicate {
			return nil, fmt.Errorf("label %q is repeated", label.Name)
		}
		seen[name] = struct{}{}
		names = append(names, name)
	}
	sort.Strings(names)
	return names, nil
}

func equalOwnedMetadata(item remoteItem, labels []string, milestone int) bool {
	current := make([]string, 0, len(item.Labels))
	for _, label := range item.Labels {
		name := strings.ToLower(label.Name)
		if isClassification(name) {
			current = append(current, name)
		}
	}
	desired := make([]string, len(labels))
	for index, label := range labels {
		desired[index] = strings.ToLower(label)
	}
	sort.Strings(current)
	sort.Strings(desired)
	return milestoneNumber(item) == milestone && strings.Join(current, "\x00") == strings.Join(desired, "\x00")
}

func milestoneNumber(item remoteItem) int {
	if item.Milestone == nil {
		return 0
	}
	return item.Milestone.Number
}

func displayLabels(labels []remoteLabel) []string {
	names := make([]string, len(labels))
	for index, label := range labels {
		names[index] = label.Name
	}
	sort.Slice(names, func(left, right int) bool {
		return strings.ToLower(names[left]) < strings.ToLower(names[right])
	})
	return names
}

type itemIdentity struct {
	nodeID string
	state  string
	title  string
	body   string
}

func observeIdentity(item remoteItem) itemIdentity {
	return itemIdentity{nodeID: item.NodeID, state: item.State, title: item.Title, body: bodyText(item)}
}

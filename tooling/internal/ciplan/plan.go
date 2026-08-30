// Package ciplan selects bounded CI lanes from one exact Git change set.
package ciplan

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strings"
	"unicode/utf8"
)

const (
	planSchema       = 1
	fullLane         = "full"
	maximumPathBytes = 1024
	maximumChanges   = 4096
)

// Options binds a plan to one repository and exact Git revisions.
type Options struct {
	RepositoryRoot string
	BaseRevision   string
	HeadRevision   string
	ForceFull      bool
}

// Plan is the stable machine-readable CI selection contract.
type Plan struct {
	Schema       int      `json:"schema"`
	Mode         string   `json:"mode"`
	Reason       string   `json:"reason"`
	BaseRevision string   `json:"base_revision,omitempty"`
	HeadRevision string   `json:"head_revision,omitempty"`
	ChangedPaths []string `json:"changed_paths"`
	Lanes        []string `json:"lanes"`
}

// Build reads one bounded Git diff and returns either an impact or full plan.
func Build(ctx context.Context, options Options) (Plan, error) {
	root, err := resolveRepositoryRoot(options.RepositoryRoot)
	if err != nil {
		return Plan{}, err
	}
	mapping, err := loadMapping(root)
	if err != nil {
		return Plan{}, fmt.Errorf("validate CI impact authority: %w", err)
	}
	if options.ForceFull {
		return newFullPlan(options, "explicit-full", nil), nil
	}
	if !revisionPattern.MatchString(options.BaseRevision) ||
		!revisionPattern.MatchString(options.HeadRevision) {
		return newFullPlan(options, "missing-or-invalid-revision", nil), nil
	}
	changedPaths, nonAdditive, err := readGitChangedPaths(
		ctx,
		root,
		options.BaseRevision,
		options.HeadRevision,
	)
	if err != nil {
		return newFullPlan(options, "git-diff-unavailable", nil), nil
	}
	if nonAdditive {
		return newFullPlan(options, "rename-delete-copy-or-type-change", changedPaths), nil
	}
	return selectChangedPaths(mapping, options, changedPaths), nil
}

func selectChangedPaths(mapping Mapping, options Options, changedPaths []string) Plan {
	paths, valid := normalizeChangedPaths(changedPaths)
	if !valid {
		return newFullPlan(options, "invalid-or-excessive-change-set", nil)
	}
	if len(paths) == 0 {
		return newFullPlan(options, "empty-change-set", paths)
	}
	for _, changedPath := range paths {
		if isSelectorAuthority(changedPath) {
			return newFullPlan(options, "selector-authority-changed", paths)
		}
	}
	lanes := make(map[string]struct{})
	for _, changedPath := range paths {
		matched := false
		for _, rule := range mapping.Rules {
			if !ruleMatches(rule, changedPath) {
				continue
			}
			matched = true
			for _, lane := range rule.Lanes {
				lanes[lane] = struct{}{}
			}
		}
		if !matched {
			return newFullPlan(options, "unmapped-path:"+changedPath, paths)
		}
	}
	if _, requiresFull := lanes[fullLane]; requiresFull {
		return newFullPlan(options, "full-authority-changed", paths)
	}
	selected := sortedKeys(lanes)
	if len(selected) == 0 {
		return newFullPlan(options, "empty-lane-selection", paths)
	}
	return Plan{
		Schema:       planSchema,
		Mode:         "impact",
		Reason:       "mapped-change-set",
		BaseRevision: options.BaseRevision,
		HeadRevision: options.HeadRevision,
		ChangedPaths: paths,
		Lanes:        selected,
	}
}

func newFullPlan(options Options, reason string, changedPaths []string) Plan {
	return Plan{
		Schema:       planSchema,
		Mode:         "full",
		Reason:       reason,
		BaseRevision: options.BaseRevision,
		HeadRevision: options.HeadRevision,
		ChangedPaths: append([]string{}, changedPaths...),
		Lanes:        []string{fullLane},
	}
}

func normalizeChangedPaths(values []string) ([]string, bool) {
	if len(values) > maximumChanges {
		return nil, false
	}
	unique := make(map[string]struct{}, len(values))
	for _, value := range values {
		if !validChangedPath(value) {
			return nil, false
		}
		unique[value] = struct{}{}
	}
	return sortedKeys(unique), true
}

func validChangedPath(value string) bool {
	if value == "" || !utf8.ValidString(value) || len(value) > maximumPathBytes || strings.Contains(value, "\\") ||
		strings.HasPrefix(value, "/") || path.Clean(value) != value || value == "." ||
		strings.HasPrefix(value, "../") {
		return false
	}
	for _, character := range value {
		if character < 0x20 || character == 0x7f {
			return false
		}
	}
	return true
}

func isSelectorAuthority(changedPath string) bool {
	return changedPath == mappingRelativePath ||
		changedPath == ".github/workflows/ci.yml" ||
		changedPath == "tooling/go.mod" ||
		changedPath == "tooling/go.sum" ||
		strings.HasPrefix(changedPath, "tooling/cmd/20w/") ||
		strings.HasPrefix(changedPath, "tooling/internal/ciplan/") ||
		strings.HasPrefix(changedPath, "tooling/internal/strictjson/")
}

func ruleMatches(rule Rule, changedPath string) bool {
	for _, pattern := range rule.Paths {
		if strings.HasSuffix(pattern, "/**") {
			prefix := strings.TrimSuffix(pattern, "**")
			if strings.HasPrefix(changedPath, prefix) {
				return true
			}
			continue
		}
		matched, err := path.Match(pattern, changedPath)
		if err == nil && matched {
			return true
		}
	}
	return false
}

func sortedKeys(values map[string]struct{}) []string {
	keys := make([]string, 0, len(values))
	for key := range values {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}

func resolveRepositoryRoot(root string) (string, error) {
	if root == "" {
		return "", errors.New("repository root is empty")
	}
	absolute, err := filepath.Abs(root)
	if err != nil {
		return "", fmt.Errorf("resolve repository root: %w", err)
	}
	absolute = filepath.Clean(absolute)
	rootInformation, err := os.Lstat(absolute)
	if err != nil || !rootInformation.IsDir() || rootInformation.Mode()&os.ModeSymlink != 0 {
		return "", errors.New("repository root must be a real directory")
	}
	resolved, err := filepath.EvalSymlinks(absolute)
	if err != nil {
		return "", fmt.Errorf("resolve repository root links: %w", err)
	}
	if filepath.Clean(resolved) != absolute {
		return "", errors.New("repository root must not contain symlinks")
	}
	gitAuthority, err := os.Lstat(filepath.Join(absolute, ".git"))
	if err != nil || gitAuthority.Mode()&os.ModeSymlink != 0 ||
		(!gitAuthority.Mode().IsRegular() && !gitAuthority.IsDir()) {
		return "", errors.New("repository root has no Git authority")
	}
	return absolute, nil
}

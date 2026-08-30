package translationbundle

import (
	"encoding/json"
	"fmt"
	"sort"
)

func validateJSONShape(body []byte) error {
	root, err := exactJSONObject(body, "candidate bundle", []string{
		"schema", "kind", "source", "target", "glossary", "drafting", "review",
	})
	if err != nil {
		return err
	}
	if _, err := exactJSONObject(root["source"], "candidate source", []string{
		"language", "path", "sha256", "markdown",
	}); err != nil {
		return err
	}
	if _, err := exactJSONObject(root["target"], "candidate target", []string{
		"language", "markdown",
	}); err != nil {
		return err
	}
	if err := exactJSONArrayObjects(root["glossary"], "glossary entry", []string{
		"source", "target", "status", "note",
	}); err != nil {
		return err
	}
	drafting, err := exactJSONObject(root["drafting"], "drafting disclosure", []string{
		"mode", "tools", "notes",
	})
	if err != nil {
		return err
	}
	if err := exactJSONArrayObjects(drafting["tools"], "drafting tool", []string{
		"name", "version", "purpose",
	}); err != nil {
		return err
	}
	review, err := exactJSONObject(root["review"], "candidate review", []string{
		"status", "reviewers", "notes",
	})
	if err != nil {
		return err
	}
	return exactJSONArrayObjects(review["reviewers"], "candidate reviewer", []string{
		"identity", "languageCompetence", "domainScope",
	})
}

func exactJSONObject(body []byte, label string, expected []string) (map[string]json.RawMessage, error) {
	var object map[string]json.RawMessage
	if err := json.Unmarshal(body, &object); err != nil || object == nil {
		return nil, fmt.Errorf("%s must be an object", label)
	}
	wanted := make(map[string]struct{}, len(expected))
	for _, field := range expected {
		wanted[field] = struct{}{}
	}
	unknown := make([]string, 0)
	for field := range object {
		if _, exists := wanted[field]; !exists {
			unknown = append(unknown, field)
		}
	}
	missing := make([]string, 0)
	for _, field := range expected {
		if _, exists := object[field]; !exists {
			missing = append(missing, field)
		}
	}
	if len(unknown) > 0 || len(missing) > 0 {
		sort.Strings(unknown)
		return nil, fmt.Errorf("%s fields are not closed: unknown=%v missing=%v", label, unknown, missing)
	}
	return object, nil
}

func exactJSONArrayObjects(body []byte, label string, expected []string) error {
	var entries []json.RawMessage
	if err := json.Unmarshal(body, &entries); err != nil || entries == nil {
		return fmt.Errorf("%s collection must be an array", label)
	}
	for index, entry := range entries {
		if _, err := exactJSONObject(entry, fmt.Sprintf("%s %d", label, index), expected); err != nil {
			return err
		}
	}
	return nil
}

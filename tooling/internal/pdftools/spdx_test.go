package pdftools

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestCanonicalizeSPDXAdmitsOnlyRelationshipOrdering(t *testing.T) {
	t.Parallel()
	first := testSPDXDocument(t, false)
	second := testSPDXDocument(t, true)
	left, err := canonicalizeSPDX(first, 64*1024, 8, 8)
	if err != nil {
		t.Fatal(err)
	}
	right, err := canonicalizeSPDX(second, 64*1024, 8, 8)
	if err != nil {
		t.Fatal(err)
	}
	if left.RawSHA256 == right.RawSHA256 || left.CanonicalSHA256 != right.CanonicalSHA256 ||
		string(left.raw) != string(first) || string(right.raw) != string(second) ||
		string(left.canonical) != string(right.canonical) || left.Packages != 3 || left.Relationships != 2 {
		t.Fatalf("canonical identities = %#v / %#v", left, right)
	}
	base := BaseImage{
		SPDXSize: len64(first), SPDXCanonicalSHA256: left.CanonicalSHA256,
		SPDXCanonicalSize: left.CanonicalSize, SPDXPackages: left.Packages, SPDXRelationships: left.Relationships,
	}
	if err := validatePlatformSPDXIdentity(right, base); err != nil {
		t.Fatalf("relationship permutation rejected: %v", err)
	}
	mutated := strings.Replace(string(first), `"relationshipType":"CONTAINS"`, `"relationshipType":"VARIANT_OF"`, 1)
	changed, err := canonicalizeSPDX([]byte(mutated), 64*1024, 8, 8)
	if err != nil {
		t.Fatal(err)
	}
	if err := validatePlatformSPDXIdentity(changed, base); err == nil {
		t.Fatal("semantic relationship mutation retained the committed graph identity")
	}
}

func TestCanonicalizeSPDXRejectsGraphAndJSONMutations(t *testing.T) {
	t.Parallel()
	valid := string(testSPDXDocument(t, false))
	tests := map[string]string{
		"duplicate edge":       strings.Replace(valid, `"relationships":[`, `"relationships":[{"relatedSpdxElement":"SPDXRef-A","relationshipType":"CONTAINS","spdxElementId":"SPDXRef-Root"},`, 1),
		"dangling endpoint":    strings.Replace(valid, `"SPDXRef-A"`, `"SPDXRef-Missing"`, 1),
		"unknown relationship": strings.Replace(valid, `"CONTAINS"`, `"COPY_OF"`, 1),
		"unknown top level":    strings.Replace(valid, `{"SPDXID"`, `{"extra":true,"SPDXID"`, 1),
		"duplicate JSON key":   strings.Replace(valid, `"spdxVersion":"SPDX-2.3"`, `"spdxVersion":"SPDX-2.3","spdxVersion":"SPDX-2.3"`, 1),
	}
	for name, body := range tests {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			if _, err := canonicalizeSPDX([]byte(body), 64*1024, 8, 8); err == nil {
				t.Fatalf("canonicalizeSPDX() accepted %s", name)
			}
		})
	}
	if _, err := canonicalizeSPDX(testSPDXDocument(t, false), 32, 8, 8); err == nil {
		t.Fatal("canonicalizeSPDX() accepted an oversized document")
	}
	if _, err := canonicalizeSPDX(testSPDXDocument(t, false), 64*1024, 2, 8); err == nil {
		t.Fatal("canonicalizeSPDX() accepted too many packages")
	}
}

func testSPDXDocument(t *testing.T, reverse bool) []byte {
	t.Helper()
	relationships := []map[string]any{
		{"spdxElementId": "SPDXRef-Root", "relationshipType": "CONTAINS", "relatedSpdxElement": "SPDXRef-A"},
		{"spdxElementId": "SPDXRef-Root", "relationshipType": "CONTAINS", "relatedSpdxElement": "SPDXRef-B"},
	}
	if reverse {
		relationships[0], relationships[1] = relationships[1], relationships[0]
	}
	document := map[string]any{
		"SPDXID":            "SPDXRef-DOCUMENT",
		"creationInfo":      map[string]any{"created": "2026-08-03T11:48:16Z", "creators": []string{"Tool: test"}},
		"dataLicense":       "CC0-1.0",
		"documentDescribes": []string{"SPDXRef-Root"},
		"documentNamespace": "https://example.invalid/spdx/test",
		"name":              "test",
		"packages": []map[string]any{
			{"SPDXID": "SPDXRef-Root", "name": "root"},
			{"SPDXID": "SPDXRef-A", "name": "a"},
			{"SPDXID": "SPDXRef-B", "name": "b"},
		},
		"relationships": relationships,
		"spdxVersion":   "SPDX-2.3",
	}
	body, err := json.Marshal(document)
	if err != nil {
		t.Fatal(err)
	}
	return body
}

func len64(body []byte) int64 { return int64(len(body)) }

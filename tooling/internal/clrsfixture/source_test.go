package clrsfixture

import (
	"bytes"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

const (
	expectedCommitSHA1       = "d33c3cfc765a18950194205a1ddb92a0981a355e"
	expectedTreeSHA1         = "b196ea83bd13516054dff405aa738dcd58d8c0c6"
	expectedLicenseSHA256    = "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30"
	expectedGeneratorSHA256  = "07f1134c0682d3102fa6e39a5e439276b39b5719a2dc197ffdc697c09c4f6e1c"
	expectedRequirementsHash = "aa0eb5e95b8c0b51541b9aa15543b71270ffbada619c00ed4988a94e49e27276"
)

func TestTrackedSourceRecordBindsReviewedUpstream(t *testing.T) {
	t.Parallel()
	record := trackedSourceRecord(t)
	if record.Commit != expectedCommitSHA1 || record.Tree != expectedTreeSHA1 {
		t.Fatalf("Git identity = %s/%s, want reviewed commit/tree", record.Commit, record.Tree)
	}
	if record.License.SPDX != "Apache-2.0" || record.License.SHA256 != expectedLicenseSHA256 {
		t.Fatalf("licence identity = %#v, want reviewed Apache-2.0 file", record.License)
	}
	if record.Generator.SHA256 != expectedGeneratorSHA256 || record.Requirements.SHA256 != expectedRequirementsHash {
		t.Fatalf("source hashes = %s/%s, want reviewed generator/requirements", record.Generator.SHA256, record.Requirements.SHA256)
	}
	first, err := record.Identity()
	if err != nil {
		t.Fatal(err)
	}
	second, err := record.Identity()
	if err != nil || first != second || len(first.String()) != len("sha256:")+64 {
		t.Fatalf("source identity is not stable: %s/%s, error %v", first, second, err)
	}
}

func TestParseSourceRecordRejectsAmbiguousOrWrongIdentity(t *testing.T) {
	t.Parallel()
	valid := string(trackedSourceRecordBytes(t))
	tests := map[string][]byte{
		"empty":            nil,
		"duplicate":        []byte(strings.Replace(valid, `"authority": "NO_RESULT"`, `"authority": "NO_RESULT", "authority": "NO_RESULT"`, 1)),
		"unknown":          []byte(strings.Replace(valid, `"schema_version": 1`, `"schema_version": 1, "extra": true`, 1)),
		"trailing":         []byte(valid + `{}`),
		"bad UTF-8":        {0xff, '{', '}'},
		"wrong authority":  []byte(strings.Replace(valid, `"NO_RESULT"`, `"RESULT"`, 1)),
		"wrong repository": []byte(strings.Replace(valid, officialRepository, "https://example.invalid/clrs", 1)),
		"uppercase commit": []byte(strings.Replace(valid, expectedCommitSHA1, strings.ToUpper(expectedCommitSHA1), 1)),
		"zero tree":        []byte(strings.Replace(valid, expectedTreeSHA1, strings.Repeat("0", 40), 1)),
		"wrong licence":    []byte(strings.Replace(valid, `"Apache-2.0"`, `"MIT"`, 1)),
		"wrong path":       []byte(strings.Replace(valid, upstreamGeneratorPath, "generate.py", 1)),
		"bad digest":       []byte(strings.Replace(valid, expectedGeneratorSHA256, strings.Repeat("a", 63), 1)),
		"bad date":         []byte(strings.Replace(valid, `"2026-08-30"`, `"30-08-2026"`, 1)),
		"oversized":        bytes.Repeat([]byte{' '}, maximumSourceRecordBytes+1),
	}
	for name, body := range tests {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			if _, err := ParseSourceRecord(body); err == nil {
				t.Fatalf("ParseSourceRecord accepted %s", name)
			}
		})
	}
}

func TestReadSourceRecordEnforcesReaderBound(t *testing.T) {
	t.Parallel()
	oversized := bytes.NewReader(bytes.Repeat([]byte{' '}, maximumSourceRecordBytes+1))
	if _, err := ReadSourceRecord(oversized); err == nil || !strings.Contains(err.Error(), "exceeds") {
		t.Fatalf("ReadSourceRecord oversized error = %v", err)
	}
	if _, err := ReadSourceRecord(nil); err == nil || !strings.Contains(err.Error(), "nil") {
		t.Fatalf("ReadSourceRecord nil error = %v", err)
	}
}

func trackedSourceRecord(t *testing.T) SourceRecord {
	t.Helper()
	body := trackedSourceRecordBytes(t)
	record, err := ParseSourceRecord(body)
	if err != nil {
		t.Fatalf("parse tracked source record: %v", err)
	}
	return record
}

func trackedSourceRecordBytes(t *testing.T) []byte {
	t.Helper()
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("locate source test")
	}
	path := filepath.Join(filepath.Dir(filename), "..", "..", "clrs-generator", "upstream.json")
	body, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read tracked source record: %v", err)
	}
	return body
}

func FuzzParseSourceRecord(f *testing.F) {
	f.Add([]byte(`{"schema_version":1}`))
	f.Add([]byte(`{"authority":"NO_RESULT","authority":"RESULT"}`))
	f.Add([]byte{0x00, 0xff, '{', '}'})
	f.Fuzz(func(t *testing.T, body []byte) {
		if len(body) > maximumSourceRecordBytes+1 {
			return
		}
		_, _ = ParseSourceRecord(body)
	})
}

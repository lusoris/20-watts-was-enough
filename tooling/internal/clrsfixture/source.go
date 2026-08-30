// Package clrsfixture imports source-bound CLRS-Text construction fixtures.
// It does not generate data or grant scientific result authority.
package clrsfixture

import (
	"errors"
	"fmt"
	"io"
	"strings"
	"time"
)

const (
	// ResultAuthority labels every value produced by this construction package.
	ResultAuthority = "NO_RESULT"

	sourceSchemaVersion      = 1
	maximumSourceRecordBytes = 16 << 10
	officialRepository       = "https://github.com/google-deepmind/clrs"
	upstreamGeneratorPath    = "clrs/_src/clrs_text/generate_clrs_text.py"
	upstreamRequirementsPath = "requirements/requirements.txt"
)

// FileIdentity binds one upstream path to its byte-level SHA-256 digest.
type FileIdentity struct {
	Path   string `json:"path"`
	SHA256 string `json:"sha256"`
}

// LicenseIdentity records the reviewed upstream licence file and SPDX identity.
type LicenseIdentity struct {
	SPDX   string `json:"spdx"`
	Path   string `json:"path"`
	SHA256 string `json:"sha256"`
}

// SourceRecord pins the inspected upstream repository state. It deliberately
// carries no task, size, seed, split, or generator-image selection.
type SourceRecord struct {
	SchemaVersion int             `json:"schema_version"`
	Authority     string          `json:"authority"`
	Repository    string          `json:"repository"`
	Commit        string          `json:"commit"`
	Tree          string          `json:"tree"`
	InspectedOn   string          `json:"inspected_on"`
	License       LicenseIdentity `json:"license"`
	Generator     FileIdentity    `json:"generator"`
	Requirements  FileIdentity    `json:"requirements"`
}

// ReadSourceRecord reads and validates one bounded, closed source record.
func ReadSourceRecord(reader io.Reader) (SourceRecord, error) {
	body, err := readBounded(reader, maximumSourceRecordBytes)
	if err != nil {
		return SourceRecord{}, fmt.Errorf("read CLRS source record: %w", err)
	}
	return ParseSourceRecord(body)
}

// ParseSourceRecord validates one complete source record without network use.
func ParseSourceRecord(body []byte) (SourceRecord, error) {
	if len(body) == 0 || len(body) > maximumSourceRecordBytes {
		return SourceRecord{}, fmt.Errorf("CLRS source record size = %d, want 1..%d", len(body), maximumSourceRecordBytes)
	}
	var record SourceRecord
	if err := decodeStrict(body, 4, &record); err != nil {
		return SourceRecord{}, fmt.Errorf("parse CLRS source record: %w", err)
	}
	if err := record.Validate(); err != nil {
		return SourceRecord{}, err
	}
	return record, nil
}

// Validate rejects incomplete or differently scoped source identities.
func (record SourceRecord) Validate() error {
	if record.SchemaVersion != sourceSchemaVersion {
		return fmt.Errorf("CLRS source schema = %d, want %d", record.SchemaVersion, sourceSchemaVersion)
	}
	if record.Authority != ResultAuthority {
		return fmt.Errorf("CLRS source authority = %q, want %q", record.Authority, ResultAuthority)
	}
	if record.Repository != officialRepository {
		return fmt.Errorf("CLRS source repository = %q, want official repository", record.Repository)
	}
	if !lowerHex(record.Commit, 40) || !lowerHex(record.Tree, 40) {
		return errors.New("CLRS source commit and tree must be lowercase 40-digit Git object IDs")
	}
	date, err := time.Parse(time.DateOnly, record.InspectedOn)
	if err != nil || date.Format(time.DateOnly) != record.InspectedOn {
		return fmt.Errorf("CLRS source inspection date %q is not canonical YYYY-MM-DD", record.InspectedOn)
	}
	if record.License.SPDX != "Apache-2.0" || record.License.Path != "LICENSE" || !lowerHex(record.License.SHA256, 64) {
		return errors.New("CLRS source licence must bind Apache-2.0 and LICENSE by SHA-256")
	}
	if err := validateFileIdentity("generator", record.Generator, upstreamGeneratorPath); err != nil {
		return err
	}
	return validateFileIdentity("requirements", record.Requirements, upstreamRequirementsPath)
}

// Identity returns the deterministic identity of the validated source record.
func (record SourceRecord) Identity() (SourceID, error) {
	if err := record.Validate(); err != nil {
		return SourceID{}, err
	}
	builder := newIdentityBuilder("20w/clrs-source/v1")
	for _, field := range []string{
		record.Authority,
		record.Repository,
		record.Commit,
		record.Tree,
		record.InspectedOn,
		record.License.SPDX,
		record.License.Path,
		record.License.SHA256,
		record.Generator.Path,
		record.Generator.SHA256,
		record.Requirements.Path,
		record.Requirements.SHA256,
	} {
		builder.addString(field)
	}
	return SourceID(builder.sum()), nil
}

func validateFileIdentity(role string, identity FileIdentity, expectedPath string) error {
	if identity.Path != expectedPath || !lowerHex(identity.SHA256, 64) {
		return fmt.Errorf("CLRS %s must bind %s by SHA-256", role, expectedPath)
	}
	return nil
}

func lowerHex(value string, length int) bool {
	if len(value) != length || strings.Trim(value, "0") == "" {
		return false
	}
	for _, character := range []byte(value) {
		if character < '0' || (character > '9' && character < 'a') || character > 'f' {
			return false
		}
	}
	return true
}

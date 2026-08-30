package ciplan

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"sort"
	"strconv"
	"strings"
	"unicode/utf8"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/strictjson"
)

const (
	maximumPlanBytes   = 8 << 20
	maximumReasonBytes = maximumPathBytes + 64
)

// Projection is the fixed workflow-facing view of one validated plan.
type Projection struct {
	Mode              string
	Reason            string
	Container         bool
	Go                bool
	Release           bool
	Research          bool
	Site              bool
	WorkstationAny    bool
	WorkstationMatrix string
}

// ReadProjection decodes one bounded plan and projects only allowlisted outputs.
func ReadProjection(reader io.Reader) (Projection, error) {
	body, err := io.ReadAll(io.LimitReader(reader, maximumPlanBytes+1))
	if err != nil {
		return Projection{}, fmt.Errorf("read bounded CI plan: %w", err)
	}
	if len(body) > maximumPlanBytes {
		return Projection{}, fmt.Errorf("CI plan exceeds the %d-byte limit", maximumPlanBytes)
	}
	if err := strictjson.Validate(body, 4); err != nil {
		return Projection{}, fmt.Errorf("validate unambiguous CI plan JSON: %w", err)
	}
	decoder := json.NewDecoder(bytes.NewReader(body))
	decoder.DisallowUnknownFields()
	var plan Plan
	if err := decoder.Decode(&plan); err != nil {
		return Projection{}, fmt.Errorf("decode CI plan: %w", err)
	}
	if decoder.Decode(&struct{}{}) != io.EOF {
		return Projection{}, errors.New("CI plan contains trailing data")
	}
	return Project(plan)
}

// Project validates a plan before deriving fixed semantic lane outputs.
func Project(plan Plan) (Projection, error) {
	if err := validatePlan(plan); err != nil {
		return Projection{}, err
	}
	projection := Projection{
		Mode:              plan.Mode,
		Reason:            plan.Reason,
		WorkstationMatrix: "[]",
	}
	if plan.Mode == "full" {
		return projection, nil
	}
	artifacts := make([]string, 0)
	for _, lane := range plan.Lanes {
		switch lane {
		case "container":
			projection.Container = true
		case "go":
			projection.Go = true
		case "release":
			projection.Release = true
		case "research":
			projection.Research = true
		case "site":
			projection.Site = true
		default:
			definition, present := allowedLanes[lane]
			if !present || definition.WorkstationArtifact == "" {
				return Projection{}, fmt.Errorf("CI plan contains an unprojected lane %q", lane)
			}
			artifacts = append(artifacts, definition.WorkstationArtifact)
		}
	}
	projection.WorkstationAny = len(artifacts) > 0
	matrix, err := json.Marshal(artifacts)
	if err != nil {
		return Projection{}, fmt.Errorf("encode workstation matrix: %w", err)
	}
	projection.WorkstationMatrix = string(matrix)
	return projection, nil
}

// WriteGitHubOutputs emits the complete fixed set of GitHub job outputs.
func WriteGitHubOutputs(writer io.Writer, projection Projection) error {
	values := []struct {
		name  string
		value string
	}{
		{name: "mode", value: projection.Mode},
		{name: "reason", value: projection.Reason},
		{name: "container", value: strconv.FormatBool(projection.Container)},
		{name: "go", value: strconv.FormatBool(projection.Go)},
		{name: "release", value: strconv.FormatBool(projection.Release)},
		{name: "research", value: strconv.FormatBool(projection.Research)},
		{name: "site", value: strconv.FormatBool(projection.Site)},
		{name: "workstation_any", value: strconv.FormatBool(projection.WorkstationAny)},
		{name: "workstation_matrix", value: projection.WorkstationMatrix},
	}
	for _, value := range values {
		if _, err := fmt.Fprintf(writer, "%s=%s\n", value.name, value.value); err != nil {
			return fmt.Errorf("write GitHub output %s: %w", value.name, err)
		}
	}
	return nil
}

func validatePlan(plan Plan) error {
	if plan.Schema != planSchema {
		return fmt.Errorf("CI plan schema is %d, want %d", plan.Schema, planSchema)
	}
	if !validPlanReason(plan.Reason) {
		return errors.New("CI plan reason is invalid")
	}
	if plan.ChangedPaths == nil || plan.Lanes == nil {
		return errors.New("CI plan arrays must not be null")
	}
	paths, valid := normalizeChangedPaths(plan.ChangedPaths)
	if !valid || len(paths) != len(plan.ChangedPaths) {
		return errors.New("CI plan changed paths are invalid or repeated")
	}
	for index := range paths {
		if paths[index] != plan.ChangedPaths[index] {
			return errors.New("CI plan changed paths must be sorted")
		}
	}
	if !sort.StringsAreSorted(plan.Lanes) {
		return errors.New("CI plan lanes must be sorted")
	}
	for index, lane := range plan.Lanes {
		if _, present := allowedLanes[lane]; !present ||
			(index > 0 && lane == plan.Lanes[index-1]) {
			return fmt.Errorf("CI plan lane is unknown or repeated: %q", lane)
		}
	}
	if plan.Mode == "full" {
		if plan.Reason == "mapped-change-set" || len(plan.Lanes) != 1 || plan.Lanes[0] != fullLane {
			return errors.New("full CI plan must select only the full lane")
		}
		if err := validateFullReasonPaths(plan.Reason, plan.ChangedPaths); err != nil {
			return err
		}
		return nil
	}
	if plan.Mode != "impact" {
		return fmt.Errorf("CI plan mode is invalid: %q", plan.Mode)
	}
	if plan.Reason != "mapped-change-set" || len(plan.ChangedPaths) == 0 ||
		len(plan.Lanes) == 0 || !revisionPattern.MatchString(plan.BaseRevision) ||
		!revisionPattern.MatchString(plan.HeadRevision) {
		return errors.New("impact CI plan has an invalid revision, reason, path, or lane set")
	}
	fullIndex := sort.SearchStrings(plan.Lanes, fullLane)
	if fullIndex < len(plan.Lanes) && plan.Lanes[fullIndex] == fullLane {
		return errors.New("impact CI plan must not select the full lane")
	}
	return nil
}

func validateFullReasonPaths(reason string, changedPaths []string) error {
	switch reason {
	case "empty-change-set":
		if len(changedPaths) != 0 {
			return errors.New("empty-change-set plan must have no changed paths")
		}
	case "rename-delete-copy-or-type-change", "selector-authority-changed", "full-authority-changed":
		if len(changedPaths) == 0 {
			return fmt.Errorf("%s plan must identify changed paths", reason)
		}
	default:
		if strings.HasPrefix(reason, "unmapped-path:") {
			unmapped := strings.TrimPrefix(reason, "unmapped-path:")
			index := sort.SearchStrings(changedPaths, unmapped)
			if index >= len(changedPaths) || changedPaths[index] != unmapped {
				return errors.New("unmapped-path reason is absent from changed paths")
			}
		}
	}
	return nil
}

func validPlanReason(reason string) bool {
	if reason == "" || len(reason) > maximumReasonBytes || !utf8.ValidString(reason) {
		return false
	}
	for _, character := range reason {
		if character < 0x20 || character == 0x7f {
			return false
		}
	}
	if strings.HasPrefix(reason, "unmapped-path:") {
		return validChangedPath(strings.TrimPrefix(reason, "unmapped-path:"))
	}
	switch reason {
	case "explicit-full", "missing-or-invalid-revision", "git-diff-unavailable",
		"rename-delete-copy-or-type-change", "invalid-or-excessive-change-set",
		"selector-authority-changed", "empty-change-set", "full-authority-changed",
		"empty-lane-selection", "mapped-change-set":
		return true
	default:
		return false
	}
}

package clrsfixture

import (
	"context"
	"encoding/json"
	"errors"
	"path/filepath"
	"reflect"
	"strings"
	"time"
)

const generatorOCITimeout = 180 * time.Second
const generatorOCIReportBytes = 256 << 10

// GeneratorOCIOptions pins supplied archive bytes, not a trusted builder or registry.
type GeneratorOCIOptions struct {
	RepositoryRoot, ArchivePath string
	ExpectedArchiveSHA256       string
	ExpectedArchiveBytes        int64
}

type GeneratorOCIDescriptor struct {
	MediaType string `json:"media_type"`
	Digest    string `json:"digest"`
	Bytes     int64  `json:"bytes"`
}

type GeneratorOCILayer struct {
	Descriptor    GeneratorOCIDescriptor `json:"descriptor"`
	DiffID        string                 `json:"diff_id"`
	ExpandedBytes int64                  `json:"decoded_tar_bytes"`
}

type GeneratorOCILimits struct {
	ArchiveBytes  int64 `json:"archive_bytes"`
	ExpandedBytes int64 `json:"decoded_tar_bytes"`
	JSONBytes     int64 `json:"json_bytes"`
	Members       int   `json:"archive_members"`
	Layers        int   `json:"layers"`
}

// GeneratorOCIReport preserves original metadata as base64 byte slices in JSON.
// It is a CLRS candidate byte check, not general OCI conformance or admission.
type GeneratorOCIReport struct {
	Schema              int                     `json:"schema"`
	Authority           string                  `json:"authority"`
	State               string                  `json:"state"`
	SourceID            string                  `json:"source_id,omitempty"`
	ContractID          string                  `json:"contract_id,omitempty"`
	ImageContractSHA256 string                  `json:"image_contract_sha256,omitempty"`
	ArchiveSHA256       string                  `json:"archive_sha256,omitempty"`
	ArchiveBytes        int64                   `json:"archive_bytes,omitempty"`
	Manifest            *GeneratorOCIDescriptor `json:"manifest,omitempty"`
	Config              *GeneratorOCIDescriptor `json:"config,omitempty"`
	ManifestBytes       []byte                  `json:"manifest_base64,omitempty"`
	ConfigBytes         []byte                  `json:"config_base64,omitempty"`
	Layers              []GeneratorOCILayer     `json:"layers,omitempty"`
	ExpandedBytes       int64                   `json:"decoded_layer_tar_bytes,omitempty"`
	Limits              GeneratorOCILimits      `json:"limits"`
	TimeoutSeconds      int                     `json:"timeout_seconds"`
	ImageAdmitted       bool                    `json:"image_admitted"`
	Limitations         []string                `json:"limitations"`
	Error               string                  `json:"error,omitempty"`
}

func generatorOCILimits() GeneratorOCILimits {
	return GeneratorOCILimits{2 << 30, 4 << 30, 64 << 10, 2048, 64}
}

func newGeneratorOCIReport(limits GeneratorOCILimits) GeneratorOCIReport {
	return GeneratorOCIReport{Schema: 1, Authority: ResultAuthority, State: "incomplete", Limits: limits, TimeoutSeconds: 180,
		Limitations: []string{
			"Supplied archive, descriptor and decoded layer byte identities only; no builder, registry, loaded-image or execution authentication.",
			"This closed single-image CLRS profile rejects layouts and encodings allowed by the broader OCI specification.",
			"Decoded tar bytes are not extracted filesystem size. Layer members, sparse allocation, whiteouts, installed files and licences are not interpreted.",
			"No extraction, image load, Docker invocation, network access, image admission or scientific result.",
			"Operator-owned filesystem, not hostile same-UID isolation; the deadline is cooperative between bounded reads, hashing and decoding.",
		}}
}

// InspectGeneratorOCIArchive performs no writes or subprocesses. Expected identity
// must be supplied independently; all successful fields are cleared on failure.
func InspectGeneratorOCIArchive(ctx context.Context, options GeneratorOCIOptions) (GeneratorOCIReport, error) {
	return inspectGeneratorOCIArchive(ctx, options, generatorOCILimits(), nil)
}

func inspectGeneratorOCIArchive(ctx context.Context, options GeneratorOCIOptions, limits GeneratorOCILimits, beforeRecheck func() error) (report GeneratorOCIReport, err error) {
	report = newGeneratorOCIReport(limits)
	defer func() {
		if err != nil {
			report = newGeneratorOCIReport(limits)
			report.Error = boundedGenerationError(err)
		}
	}()
	if ctx == nil || !lowerHex(options.ExpectedArchiveSHA256, 64) || options.ExpectedArchiveBytes < 1 || options.ExpectedArchiveBytes > limits.ArchiveBytes ||
		options.ArchivePath == "" || len(options.ArchivePath) > 4096 || strings.ContainsAny(options.ArchivePath, "\x00\r\n") {
		return report, errors.New("OCI inspection needs a context, explicit archive path, lowercase SHA-256 and bounded exact byte count")
	}
	ctx, cancel := context.WithTimeout(ctx, generatorOCITimeout)
	defer cancel()
	inputs, err := loadInvocationInputs(ctx, options.RepositoryRoot)
	if err != nil {
		return report, err
	}
	if !filepath.IsAbs(options.ArchivePath) {
		options.ArchivePath = filepath.Join(inputs.root, options.ArchivePath)
	}
	archive, err := openGeneratorOCIArchive(options.ArchivePath, options.ExpectedArchiveBytes)
	if err != nil {
		return report, err
	}
	defer func() { err = errors.Join(err, archive.file.Close(), archive.root.Close(), ctx.Err()) }()
	if err = archive.check(ctx, options); err != nil {
		return report, err
	}
	members, err := scanGeneratorOCI(ctx, archive.file, options.ExpectedArchiveBytes, limits)
	if err != nil {
		return report, err
	}
	report, err = inspectGeneratorOCIMetadata(ctx, archive.file, members, inputs.image.Runtime, limits)
	if err != nil {
		return report, err
	}
	if beforeRecheck != nil {
		if err = beforeRecheck(); err != nil {
			return report, err
		}
	}
	if err = archive.check(ctx, options); err != nil {
		return report, err
	}
	current, err := loadInvocationInputs(ctx, inputs.root)
	if err != nil || !reflect.DeepEqual(inputs, current) {
		return report, errors.Join(err, errors.New("OCI repository authority changed during inspection"))
	}
	report.State = "archive-consistent-unadmitted"
	report.SourceID, report.ContractID = inputs.plan.SourceID.String(), inputs.plan.ContractID.String()
	report.ImageContractSHA256 = inputs.foundation.ImageContractSHA256
	report.ArchiveSHA256, report.ArchiveBytes = options.ExpectedArchiveSHA256, options.ExpectedArchiveBytes
	_, err = MarshalGeneratorOCIReport(report)
	return report, errors.Join(err, ctx.Err())
}

func MarshalGeneratorOCIReport(report GeneratorOCIReport) ([]byte, error) {
	if len(report.ManifestBytes) > 64<<10 || len(report.ConfigBytes) > 64<<10 || len(report.Layers) > 64 || len(report.Error) > 4096 {
		return nil, errors.New("OCI report metadata exceeds its byte or layer boundary")
	}
	body, err := json.MarshalIndent(report, "", "  ")
	if err != nil {
		return nil, err
	}
	if len(body)+1 > generatorOCIReportBytes {
		return nil, errors.New("OCI report exceeds 256 KiB")
	}
	return append(body, '\n'), nil
}

// Package pdftools validates the closed Poppler image authority.
package pdftools

// Contract binds the builder, package graph, runtime and source-delivery boundary.
type Contract struct {
	Schema          int            `json:"schema"`
	Contract        string         `json:"contract"`
	Image           string         `json:"image"`
	Platform        string         `json:"platform"`
	ResultAuthority string         `json:"result_authority"`
	Builder         Builder        `json:"builder"`
	SourceDateEpoch int64          `json:"source_date_epoch"`
	Apko            Apko           `json:"apko"`
	BaseImage       BaseImage      `json:"base_image"`
	Runtime         Runtime        `json:"runtime"`
	Upstream        Upstream       `json:"upstream"`
	NoticeLayer     NoticeLayer    `json:"notice_layer"`
	SourceDelivery  SourceDelivery `json:"source_delivery"`
	Limits          Limits         `json:"limits"`
}

type Builder struct {
	Image     string `json:"image"`
	Version   string `json:"version"`
	Revision  string `json:"revision"`
	GoVersion string `json:"go_version"`
}

type Apko struct {
	Config             string   `json:"config"`
	ConfigSHA256       string   `json:"config_sha256"`
	Lock               string   `json:"lock"`
	LockSHA256         string   `json:"lock_sha256"`
	OutputTag          string   `json:"output_tag"`
	Repository         string   `json:"repository"`
	Keyring            string   `json:"keyring"`
	DirectPackages     []string `json:"direct_packages"`
	LockedPackageCount int      `json:"locked_package_count"`
}

type BaseImage struct {
	ArchiveSHA256            string `json:"archive_sha256"`
	ArchiveSize              int64  `json:"archive_size_bytes"`
	ManifestDigest           string `json:"manifest_digest"`
	ConfigDigest             string `json:"config_digest"`
	LayerDigest              string `json:"layer_digest"`
	LayerDiffID              string `json:"layer_diff_id"`
	SPDXSize                 int64  `json:"spdx_size_bytes"`
	SPDXCanonicalSHA256      string `json:"spdx_canonical_sha256"`
	SPDXCanonicalSize        int64  `json:"spdx_canonical_size_bytes"`
	SPDXPackages             int    `json:"spdx_packages"`
	SPDXRelationships        int    `json:"spdx_relationships"`
	SPDXIndexCanonicalSHA256 string `json:"spdx_index_canonical_sha256"`
	SPDXIndexCanonicalSize   int64  `json:"spdx_index_canonical_size_bytes"`
}

type Runtime struct {
	UID             int      `json:"uid"`
	GID             int      `json:"gid"`
	Path            string   `json:"path"`
	Network         string   `json:"network"`
	ReadOnlyRoot    bool     `json:"read_only_root"`
	Capabilities    string   `json:"capabilities"`
	NoNewPrivileges bool     `json:"no_new_privileges"`
	RequiredTools   []Tool   `json:"required_tools"`
	ForbiddenPaths  []string `json:"forbidden_paths"`
	ManPages        []string `json:"man_pages"`
}

type Tool struct {
	Name          string `json:"name"`
	Version       string `json:"version"`
	VersionStream string `json:"version_stream"`
}

type Upstream struct {
	PopplerArchive UpstreamArchive `json:"poppler_archive"`
	WolfiRecipe    UpstreamRecipe  `json:"wolfi_recipe"`
}

type UpstreamArchive struct {
	URL    string `json:"url"`
	SHA256 string `json:"sha256"`
	Size   int64  `json:"size_bytes"`
	Root   string `json:"root"`
}

type UpstreamRecipe struct {
	URL      string          `json:"url"`
	Revision string          `json:"revision"`
	SHA256   string          `json:"sha256"`
	Size     int64           `json:"size_bytes"`
	Snapshot string          `json:"snapshot"`
	License  UpstreamLicense `json:"license"`
}

type UpstreamLicense struct {
	SPDX     string `json:"spdx"`
	URL      string `json:"url"`
	Revision string `json:"revision"`
	SHA256   string `json:"sha256"`
	Size     int64  `json:"size_bytes"`
	Snapshot string `json:"snapshot"`
}

type NoticeLayer struct {
	Assembly                string        `json:"assembly"`
	BuildKitLock            string        `json:"buildkit_lock"`
	BuildKitAuthoritySHA256 string        `json:"buildkit_authority_sha256"`
	Entries                 []NoticeEntry `json:"entries"`
}

type NoticeEntry struct {
	Source      string `json:"source"`
	ArchivePath string `json:"archive_path"`
	Destination string `json:"destination"`
	SHA256      string `json:"sha256"`
	Size        int64  `json:"size_bytes"`
}

type SourceDelivery struct {
	APKManifest            string   `json:"apk_manifest"`
	APKManifestSHA256      string   `json:"apk_manifest_sha256"`
	APKCount               int      `json:"apk_count"`
	CandidateBundle        string   `json:"candidate_bundle"`
	CandidateRetentionDays int      `json:"candidate_retention_days"`
	ReleaseRoute           string   `json:"release_route"`
	Contents               []string `json:"contents"`
}

type Limits struct {
	LockBytes             int64 `json:"lock_bytes"`
	Packages              int   `json:"packages"`
	NoticeBytes           int64 `json:"notice_bytes"`
	BaseArchiveBytes      int64 `json:"base_archive_bytes"`
	FinalArchiveBytes     int64 `json:"final_archive_bytes"`
	SourceBundleBytes     int64 `json:"source_bundle_bytes"`
	SPDXBytes             int64 `json:"spdx_bytes"`
	SPDXPackages          int   `json:"spdx_packages"`
	SPDXRelationships     int   `json:"spdx_relationships"`
	APKControlBytes       int64 `json:"apk_control_bytes"`
	APKDataBytes          int64 `json:"apk_data_bytes"`
	APKIndexBytes         int64 `json:"apk_index_bytes"`
	HTTPResponseBytes     int64 `json:"http_response_bytes"`
	LockSeconds           int   `json:"lock_seconds"`
	BuildSeconds          int   `json:"build_seconds"`
	RuntimeSeconds        int   `json:"runtime_seconds"`
	CapturedOutputBytes   int64 `json:"captured_output_bytes"`
	ReceiptBytes          int64 `json:"receipt_bytes"`
	ApkoMemoryBytes       int64 `json:"apko_memory_bytes"`
	ApkoPIDs              int   `json:"apko_pids"`
	ApkoTemporaryBytes    int64 `json:"apko_temporary_bytes"`
	BuildKitMemoryBytes   int64 `json:"buildkit_memory_bytes"`
	BuildKitPIDs          int   `json:"buildkit_pids"`
	BuildKitCPUPeriod     int64 `json:"buildkit_cpu_period"`
	BuildKitCPUQuota      int64 `json:"buildkit_cpu_quota"`
	RuntimeMemoryBytes    int64 `json:"runtime_memory_bytes"`
	RuntimePIDs           int   `json:"runtime_pids"`
	RuntimeTemporaryBytes int64 `json:"runtime_temporary_bytes"`
}

// Result is the bounded offline observation returned by Check.
type Result struct {
	ContractSHA256 string
	LockSHA256     string
	Packages       int
	Notices        int
	RetainedBytes  int64
}

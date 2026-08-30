package pdfrender

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"hash"
	"io"
	"os"
	"path/filepath"
	"slices"
	"sort"
	"strings"
	"time"

	"github.com/lusoris/20-watts-was-enough/tooling/internal/strictjson"
)

const (
	reproducibilityReceiptSchema       = 1
	maximumBuildMetadataBytes    int64 = 2 * 1024 * 1024
)

// ReproducibilityReceipt is the retained, deterministic evidence from one
// non-scientific renderer build acceptance run.
type ReproducibilityReceipt struct {
	Schema           int                            `json:"schema"`
	Status           string                         `json:"status"`
	Scope            string                         `json:"scope"`
	Authority        string                         `json:"authority"`
	ScientificResult bool                           `json:"scientific_result"`
	SourceRef        string                         `json:"source_ref"`
	Renderer         ReproducibilityRenderer        `json:"renderer"`
	Context          ReproducibilityContext         `json:"normalized_build_context"`
	PublicationPair  ReproducibilityPublicationPair `json:"publication_pair"`
	Builds           []ReproducibilityBuild         `json:"builds"`
	Comparison       ReproducibilityComparison      `json:"comparison"`
}

// ReproducibilityRenderer records the exact checked-in schema-3 build
// authority whose independent outputs were compared.
type ReproducibilityRenderer struct {
	LockSchema                   int    `json:"lock_schema"`
	LockSHA256                   string `json:"lock_sha256"`
	Platform                     string `json:"platform"`
	BuildxVersion                string `json:"buildx_version"`
	BuildxRevision               string `json:"buildx_revision"`
	BuildKitVersion              string `json:"buildkit_version"`
	BuildKitImage                string `json:"buildkit_image"`
	RewriteTimestamp             bool   `json:"rewrite_timestamp"`
	ExporterCompatibilityVersion int    `json:"exporter_compatibility_version"`
	NoCache                      bool   `json:"no_cache"`
	FreshBuilderCount            int    `json:"fresh_builder_count"`
}

// ReproducibilityContext identifies every normalized byte and filesystem
// property sent to both builders.
type ReproducibilityContext struct {
	SHA256          string `json:"sha256"`
	EntryCount      int    `json:"entry_count"`
	RegularBytes    int64  `json:"regular_bytes"`
	SourceDateEpoch int64  `json:"source_date_epoch"`
}

// ReproducibilityPublicationPair names the complete final output pair.
type ReproducibilityPublicationPair struct {
	PDF      string `json:"pdf"`
	Manifest string `json:"manifest"`
}

// ReproducibilityBuild records one independent builder and renderer result.
type ReproducibilityBuild struct {
	Sequence       int                 `json:"sequence"`
	ImageID        string              `json:"image_id"`
	ManifestDigest string              `json:"image_manifest_digest"`
	ConfigDigest   string              `json:"image_config_digest"`
	Pair           ReproducibilityPair `json:"generated_pair"`
}

// ReproducibilityPair records full-file digests and sizes. The in-memory
// artifacts are also byte-compared before this receipt can pass.
type ReproducibilityPair struct {
	PDFSHA256      string `json:"pdf_sha256"`
	PDFBytes       int64  `json:"pdf_bytes"`
	ManifestSHA256 string `json:"manifest_sha256"`
	ManifestBytes  int64  `json:"manifest_bytes"`
	PairSHA256     string `json:"pair_sha256"`
	artifacts      []renderedArtifact
}

// ReproducibilityComparison states each independent equality rather than
// collapsing the acceptance result into one opaque status.
type ReproducibilityComparison struct {
	ImageID        bool `json:"image_id"`
	ManifestDigest bool `json:"image_manifest_digest"`
	ConfigDigest   bool `json:"image_config_digest"`
	PDFBytes       bool `json:"pdf_bytes"`
	ManifestBytes  bool `json:"manifest_bytes"`
	CompletePair   bool `json:"complete_generated_pair"`
	AllMatch       bool `json:"all_match"`
}

type reproducibilityBuildMetadata struct {
	ManifestDigest string
}

func prepareReproducibilityReceiptPath(root, relative string) (string, error) {
	if relative == "" || filepath.IsAbs(relative) || strings.ContainsAny(relative, "\\\n\r\x00") {
		return "", errors.New("PDF reproducibility receipt must be a safe repository-relative JSON path")
	}
	clean := filepath.Clean(relative)
	if clean == "." || clean == ".." || strings.HasPrefix(clean, ".."+string(filepath.Separator)) ||
		filepath.Ext(clean) != ".json" {
		return "", errors.New("PDF reproducibility receipt must be a safe repository-relative JSON path")
	}
	slash := filepath.ToSlash(clean)
	allowed := slices.ContainsFunc([]string{
		".workingdir2/evidence/publication/",
		"build/evidence/",
		"build/release-inputs/",
	}, func(prefix string) bool { return strings.HasPrefix(slash, prefix) })
	if !allowed {
		return "", errors.New("PDF reproducibility receipt must be under publication or release evidence")
	}
	parent := filepath.Dir(clean)
	if err := requireContainedDirectory(root, parent, true); err != nil {
		return "", err
	}
	destination := filepath.Join(root, clean)
	if _, err := os.Lstat(destination); err == nil {
		return "", errors.New("PDF reproducibility receipt already exists")
	} else if !errors.Is(err, os.ErrNotExist) {
		return "", fmt.Errorf("inspect PDF reproducibility receipt: %w", err)
	}
	return destination, nil
}

func inspectNormalizedBuildContext(
	ctx context.Context, root string, sourceDateEpoch int64,
) (ReproducibilityContext, error) {
	digest := sha256.New()
	fixedTime := time.Unix(sourceDateEpoch, 0).UTC()
	identity := ReproducibilityContext{SourceDateEpoch: sourceDateEpoch}
	err := filepath.WalkDir(root, func(file string, entry os.DirEntry, walkError error) error {
		if walkError != nil {
			return walkError
		}
		if err := ctx.Err(); err != nil {
			return err
		}
		information, err := entry.Info()
		if err != nil {
			return err
		}
		if information.Mode()&os.ModeSymlink != 0 || !information.ModTime().Equal(fixedTime) {
			return fmt.Errorf("PDF renderer build context entry %s is not normalized", file)
		}
		relative, err := filepath.Rel(root, file)
		if err != nil {
			return err
		}
		relative = filepath.ToSlash(relative)
		kind := byte('f')
		if entry.IsDir() {
			kind = 'd'
		} else if !information.Mode().IsRegular() {
			return fmt.Errorf("PDF renderer build context contains unsupported entry %s", relative)
		}
		identity.EntryCount++
		writeReproducibilityDigestField(digest, []byte(relative))
		writeReproducibilityDigestField(digest, []byte{kind})
		writeReproducibilityDigestField(digest, []byte(information.Mode().Perm().String()))
		if err := binary.Write(digest, binary.BigEndian, information.Size()); err != nil {
			return err
		}
		if entry.IsDir() {
			return nil
		}
		identity.RegularBytes += information.Size()
		return hashContextFile(ctx, digest, file, information)
	})
	if err != nil {
		return ReproducibilityContext{}, fmt.Errorf("inspect normalized PDF renderer build context: %w", err)
	}
	identity.SHA256 = "sha256:" + hex.EncodeToString(digest.Sum(nil))
	return identity, nil
}

func hashContextFile(ctx context.Context, digest hash.Hash, file string, initial os.FileInfo) error {
	opened, err := os.Open(file)
	if err != nil {
		return err
	}
	defer opened.Close()
	buffer := make([]byte, 128*1024)
	var written int64
	for {
		if err := ctx.Err(); err != nil {
			return err
		}
		count, readError := opened.Read(buffer)
		if count > 0 {
			written += int64(count)
			if _, err := digest.Write(buffer[:count]); err != nil {
				return err
			}
		}
		if errors.Is(readError, io.EOF) {
			break
		}
		if readError != nil {
			return readError
		}
	}
	final, err := opened.Stat()
	if err != nil || !os.SameFile(initial, final) || written != initial.Size() {
		return errors.New("PDF renderer build context file changed while it was hashed")
	}
	return nil
}

func writeReproducibilityDigestField(digest hash.Hash, body []byte) {
	_ = binary.Write(digest, binary.BigEndian, uint64(len(body)))
	_, _ = digest.Write(body)
}

func readReproducibilityBuildMetadata(root, file string) (reproducibilityBuildMetadata, error) {
	body, err := readRegularBounded(root, file, maximumBuildMetadataBytes, "PDF renderer Buildx metadata")
	if err != nil {
		return reproducibilityBuildMetadata{}, err
	}
	if err := strictjson.Validate(body, 32); err != nil {
		return reproducibilityBuildMetadata{}, fmt.Errorf("validate PDF renderer Buildx metadata: %w", err)
	}
	var values map[string]json.RawMessage
	if err := json.Unmarshal(body, &values); err != nil {
		return reproducibilityBuildMetadata{}, fmt.Errorf("decode PDF renderer Buildx metadata: %w", err)
	}
	manifest, err := exactDigestMetadataValue(values, "containerimage.digest")
	if err != nil {
		return reproducibilityBuildMetadata{}, err
	}
	return reproducibilityBuildMetadata{ManifestDigest: manifest}, nil
}

func exactDigestMetadataValue(values map[string]json.RawMessage, name string) (string, error) {
	var value string
	body, present := values[name]
	if !present || json.Unmarshal(body, &value) != nil || !imageIDPattern.MatchString(value) {
		return "", fmt.Errorf("PDF renderer Buildx metadata %s is not an exact sha256 digest", name)
	}
	return value, nil
}

func inspectLoadedImageConfig(
	ctx context.Context,
	configuration Configuration,
	executor commandExecutor,
	imageTag, imageID string,
) (string, error) {
	output, err := executor.run(ctx, commandRequest{
		operation:  "inspect loaded PDF reproducibility image config",
		directory:  configuration.RepositoryRoot,
		timeout:    30 * time.Second,
		outputSize: configuration.Lock.Limits.OutputBytes,
		arguments:  []string{"image", "inspect", "--format", "{{.Id}}", imageTag},
	})
	if err != nil {
		return "", err
	}
	configDigest := strings.TrimSpace(string(output))
	if strings.Contains(configDigest, "\n") || !imageIDPattern.MatchString(configDigest) {
		return "", errors.New("loaded PDF reproducibility image config is not an exact sha256 digest")
	}
	if configDigest != imageID {
		return "", errors.New("PDF reproducibility IID file and loaded image config digest disagree")
	}
	return configDigest, nil
}

func inspectReproducibilityPair(directory string) (ReproducibilityPair, error) {
	artifacts, err := readRenderPair(directory)
	if err != nil {
		return ReproducibilityPair{}, fmt.Errorf("read PDF reproducibility output: %w", err)
	}
	pairDigest := sha256.New()
	for _, artifact := range artifacts {
		writeReproducibilityDigestField(pairDigest, []byte(artifact.name))
		writeReproducibilityDigestField(pairDigest, artifact.body)
	}
	return ReproducibilityPair{
		PDFSHA256:      digestBytes(artifacts[0].body),
		PDFBytes:       int64(len(artifacts[0].body)),
		ManifestSHA256: digestBytes(artifacts[1].body),
		ManifestBytes:  int64(len(artifacts[1].body)),
		PairSHA256:     "sha256:" + hex.EncodeToString(pairDigest.Sum(nil)),
		artifacts:      artifacts,
	}, nil
}

func digestBytes(body []byte) string {
	digest := sha256.Sum256(body)
	return "sha256:" + hex.EncodeToString(digest[:])
}

func compareReproducibilityBuilds(first, second ReproducibilityBuild) ReproducibilityComparison {
	pdfEqual := artifactEqual(first.Pair.artifacts, second.Pair.artifacts, bookPDFName)
	manifestEqual := artifactEqual(first.Pair.artifacts, second.Pair.artifacts, bookManifestName)
	comparison := ReproducibilityComparison{
		ImageID:        first.ImageID == second.ImageID,
		ManifestDigest: first.ManifestDigest == second.ManifestDigest,
		ConfigDigest:   first.ConfigDigest == second.ConfigDigest,
		PDFBytes:       pdfEqual,
		ManifestBytes:  manifestEqual,
		CompletePair:   pdfEqual && manifestEqual && first.Pair.PairSHA256 == second.Pair.PairSHA256,
	}
	comparison.AllMatch = comparison.ImageID && comparison.ManifestDigest && comparison.ConfigDigest &&
		comparison.PDFBytes && comparison.ManifestBytes && comparison.CompletePair
	return comparison
}

func artifactEqual(first, second []renderedArtifact, name string) bool {
	for _, firstArtifact := range first {
		if firstArtifact.name != name {
			continue
		}
		for _, secondArtifact := range second {
			if secondArtifact.name == name {
				return bytes.Equal(firstArtifact.body, secondArtifact.body)
			}
		}
	}
	return false
}

func newReproducibilityReceipt(
	configuration Configuration,
	sourceRef string,
	contextIdentity ReproducibilityContext,
	builds []ReproducibilityBuild,
	comparison ReproducibilityComparison,
) ReproducibilityReceipt {
	status := "mismatch"
	if comparison.AllMatch {
		status = "pass"
	}
	return ReproducibilityReceipt{
		Schema:           reproducibilityReceiptSchema,
		Status:           status,
		Scope:            "pdf-renderer-build-reproducibility",
		Authority:        "release/publication engineering acceptance",
		ScientificResult: false,
		SourceRef:        sourceRef,
		Renderer: ReproducibilityRenderer{
			LockSchema:                   configuration.Lock.Schema,
			LockSHA256:                   "sha256:" + configuration.LockSHA256,
			Platform:                     configuration.Lock.Platform,
			BuildxVersion:                configuration.Lock.Builder.BuildxVersion,
			BuildxRevision:               configuration.Lock.Builder.BuildxRevision,
			BuildKitVersion:              configuration.Lock.Builder.BuildKitVersion,
			BuildKitImage:                configuration.Lock.Builder.BuildKitImage,
			RewriteTimestamp:             configuration.Lock.Exporter.RewriteTimestamp,
			ExporterCompatibilityVersion: configuration.Lock.Exporter.CompatibilityVersion,
			NoCache:                      true,
			FreshBuilderCount:            reproducibilityBuildCount,
		},
		Context: contextIdentity,
		PublicationPair: ReproducibilityPublicationPair{
			PDF:      bookPDFName,
			Manifest: bookManifestName,
		},
		Builds:     builds,
		Comparison: comparison,
	}
}

func removeOwnedImages(
	configuration Configuration, executor commandExecutor, ownedTags map[string]struct{},
) error {
	if len(ownedTags) == 0 {
		return nil
	}
	tags := make([]string, 0, len(ownedTags))
	for tag := range ownedTags {
		tags = append(tags, tag)
	}
	sort.Strings(tags)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()
	for _, tag := range tags {
		output, err := executor.run(ctx, commandRequest{
			operation:  "inspect owned PDF reproducibility image",
			timeout:    30 * time.Second,
			outputSize: configuration.Lock.Limits.OutputBytes,
			arguments: []string{
				"image", "ls", "--all", "--no-trunc", "--quiet", "--filter", "reference=" + tag,
			},
		})
		if err != nil {
			return err
		}
		identity := strings.TrimSpace(string(output))
		if identity == "" {
			continue
		}
		if strings.Contains(identity, "\n") || !imageIDPattern.MatchString(identity) {
			return errors.New("owned PDF reproducibility image lookup returned an ambiguous identity")
		}
		if _, err := executor.run(ctx, commandRequest{
			operation:  "remove owned PDF reproducibility image",
			timeout:    30 * time.Second,
			outputSize: configuration.Lock.Limits.OutputBytes,
			arguments:  []string{"image", "rm", "--force", tag},
		}); err != nil {
			return err
		}
	}
	return nil
}

func writeReproducibilityReceipt(file string, receipt ReproducibilityReceipt) (returnError error) {
	body, err := json.MarshalIndent(receipt, "", "  ")
	if err != nil {
		return fmt.Errorf("encode PDF reproducibility receipt: %w", err)
	}
	body = append(body, '\n')
	opened, err := os.OpenFile(file, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o644)
	if err != nil {
		return fmt.Errorf("create PDF reproducibility receipt: %w", err)
	}
	defer func() {
		if closeError := opened.Close(); returnError == nil && closeError != nil {
			returnError = fmt.Errorf("close PDF reproducibility receipt: %w", closeError)
		}
		if returnError != nil {
			_ = os.Remove(file)
		}
	}()
	if _, err := opened.Write(body); err != nil {
		return fmt.Errorf("write PDF reproducibility receipt: %w", err)
	}
	if err := opened.Sync(); err != nil {
		return fmt.Errorf("sync PDF reproducibility receipt: %w", err)
	}
	return nil
}

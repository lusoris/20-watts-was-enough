package pdftools

import (
	"archive/tar"
	"bytes"
	"encoding/json"
	"math"
	"strings"
	"testing"
	"time"
)

func TestCandidateBundleStreamRejectsMalformedArchives(t *testing.T) {
	t.Parallel()
	authority, staged, receipt, bodies := candidateBundleLogicalFixture(t)
	valid := encodeCandidateBundleFixture(t, authority, receipt, bodies, nil)
	verification, err := verifyCandidatePublicationBundleStream(bytes.NewReader(valid), int64(len(valid)), digestRaw(valid), authority)
	if err != nil || verification.Receipt.Candidate.FinalArchive.SHA256 != staged.artifacts[0].identity.SHA256 {
		t.Fatalf("valid portable bundle fixture failed verification: %v", err)
	}
	if _, err := verifyCandidatePublicationBundleStream(bytes.NewReader(valid), int64(len(valid)), strings.Repeat("f", 64), authority); err == nil {
		t.Fatal("accepted a bundle without the independently recorded digest")
	}
	padding := bytes.Clone(valid)
	padding[512+len(bodies[1])] = 1
	tests := map[string][]byte{
		"nonzero member padding": padding,
		"truncated trailer":      valid[:len(valid)-512],
		"extra trailer":          append(bytes.Clone(valid), make([]byte, 512)...),
		"extra data":             append(bytes.Clone(valid), 'x'),
	}
	headers := map[string]func(*tar.Header){
		"duplicate identity": func(header *tar.Header) { header.Name = candidateBundleFinalArchiveMember },
		"path escape":        func(header *tar.Header) { header.Name = "../outside" },
		"symlink": func(header *tar.Header) {
			header.Typeflag, header.Linkname, header.Size = tar.TypeSymlink, "outside", 0
		},
		"wrong mode":  func(header *tar.Header) { header.Mode = 0o755 },
		"wrong epoch": func(header *tar.Header) { header.ModTime = header.ModTime.Add(time.Second) },
		"wrong owner": func(header *tar.Header) { header.Uid = 1 },
	}
	for name, mutate := range headers {
		tests[name] = encodeCandidateBundleFixture(t, authority, receipt, bodies, mutate)
	}
	for name, body := range tests {
		t.Run(name, func(t *testing.T) {
			if _, err := verifyCandidatePublicationBundleStream(bytes.NewReader(body), int64(len(body)), digestRaw(body), authority); err == nil {
				t.Fatal("accepted malformed archive with a matching outer digest")
			}
		})
	}
}

func TestCandidateBundleStreamRejectsReceiptDrift(t *testing.T) {
	t.Parallel()
	authority, _, receipt, bodies := candidateBundleLogicalFixture(t)
	tests := map[string]func(*ReproductionReceipt){
		"promoted authority": func(receipt *ReproductionReceipt) { receipt.Authority = "RESULT" },
		"scientific result":  func(receipt *ReproductionReceipt) { receipt.ScientificResult = true },
		"different contract": func(receipt *ReproductionReceipt) { receipt.Contract.SHA256 = strings.Repeat("c", 64) },
		"missing runtime":    func(receipt *ReproductionReceipt) { receipt.Runtime = nil },
		"failed comparison":  func(receipt *ReproductionReceipt) { receipt.Comparison.AllMatch = false },
		"admitted release":   func(receipt *ReproductionReceipt) { receipt.BlockState.DigestAdmission = "admitted" },
		"changed member":     func(receipt *ReproductionReceipt) { receipt.Candidate.FinalArchive.SHA256 = strings.Repeat("c", 64) },
		"changed size":       func(receipt *ReproductionReceipt) { receipt.Candidate.SourceBundle.Bytes++ },
		"external path":      func(receipt *ReproductionReceipt) { receipt.Candidate.CanonicalSPDX.Path = "outside.spdx.json" },
	}
	for name, mutate := range tests {
		t.Run(name, func(t *testing.T) {
			changed := receipt
			candidate := *receipt.Candidate
			changed.Candidate = &candidate
			mutate(&changed)
			body := encodeCandidateBundleFixture(t, authority, changed, bodies, nil)
			if _, err := verifyCandidatePublicationBundleStream(bytes.NewReader(body), int64(len(body)), digestRaw(body), authority); err == nil {
				t.Fatal("accepted receipt drift with a matching outer digest")
			}
		})
	}
}

func TestCandidateBundleBoundariesRejectOverflowAndShortWrites(t *testing.T) {
	t.Parallel()
	for _, sizes := range [][]int64{{0}, {-1}, {math.MaxInt64}, {math.MaxInt64 - 511, 1}} {
		if _, err := candidateTarArchiveSize(sizes); err == nil {
			t.Fatalf("accepted invalid size boundary %v", sizes)
		}
	}
	var output bytes.Buffer
	writer := candidateBundleMaximumWriter{destination: &output, maximum: 4}
	if n, err := writer.Write([]byte("1234")); err != nil || n != 4 {
		t.Fatalf("exact boundary failed: %d, %v", n, err)
	}
	if n, err := writer.Write([]byte("5")); err == nil || n != 0 || output.String() != "1234" {
		t.Fatalf("overflow changed prior bytes: %d, %v, %q", n, err, output.String())
	}
}

func encodeCandidateBundleFixture(
	t *testing.T,
	authority checkedAuthority,
	receipt ReproductionReceipt,
	bodies [][]byte,
	mutateFirst func(*tar.Header),
) []byte {
	t.Helper()
	receiptBody, err := json.MarshalIndent(receipt, "", "  ")
	if err != nil {
		t.Fatal(err)
	}
	memberBodies := [][]byte{bodies[1], bodies[0], bodies[2], append(receiptBody, '\n')}
	var output bytes.Buffer
	writer := tar.NewWriter(&output)
	for index, name := range candidateBundleMemberOrder {
		header := &tar.Header{
			Name: name, Mode: 0o644, Size: int64(len(memberBodies[index])),
			ModTime:  time.Unix(authority.contract.SourceDateEpoch, 0).UTC(),
			Typeflag: tar.TypeReg, Format: tar.FormatUSTAR,
		}
		if index == 0 && mutateFirst != nil {
			mutateFirst(header)
		}
		if err := writer.WriteHeader(header); err != nil {
			t.Fatal(err)
		}
		if header.Size != 0 {
			if _, err := writer.Write(memberBodies[index]); err != nil {
				t.Fatal(err)
			}
		}
	}
	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	return output.Bytes()
}

func candidateBundleLogicalFixture(t *testing.T) (checkedAuthority, *stagedCandidate, ReproductionReceipt, [][]byte) {
	t.Helper()
	root := t.TempDir()
	repository := testPublicationRoot(t, root)
	authority := checkedAuthority{
		root: root, rootInformation: repository.information, contractSHA256: strings.Repeat("a", 64),
		contract: Contract{
			Platform: "linux/amd64", ResultAuthority: "NO_RESULT", SourceDateEpoch: 1_785_757_696,
			SourceDelivery: SourceDelivery{
				APKCount: 3, CandidateBundle: "sources.tar.gz",
				BundleLayout: BundleLayout{Root: "candidate-sources", ChecksumManifest: "SHA256SUMS"},
			},
			Limits: Limits{SPDXBytes: 4096, FinalArchiveBytes: 4096, SourceBundleBytes: 4096, ReceiptBytes: 64 * 1024},
		},
		retention: retentionManifest{TotalBytes: 123},
	}
	bodies := [][]byte{[]byte("final archive"), []byte("canonical SPDX"), []byte("source bundle")}
	staged := &stagedCandidate{
		artifacts: make([]*stagedCandidateArtifact, 0, len(bodies)),
		bundle: sourceBundleIdentity{
			ChecksumSHA256: strings.Repeat("b", 64), ChecksumBytes: 72,
			PayloadFiles: 3, ArchiveFiles: 4, UncompressedFileBytes: 456,
		},
		retainedAPKs: 3, retainedBytes: 123,
	}
	for _, body := range bodies {
		staged.artifacts = append(staged.artifacts, &stagedCandidateArtifact{
			identity: ReproductionArtifact{SHA256: digestRaw(body), Bytes: int64(len(body))},
		})
	}
	receipt := ReproductionReceipt{
		Schema: reproductionReceiptSchema, Status: "local-candidate-preparation-pass",
		Scope: "local-pdf-tools-candidate-preparation", Authority: "NO_RESULT",
		BlockState: ReproductionBlockState{
			RemotePublication: "blocked", DigestAdmission: "blocked", SourceBundle: "candidate-prepared",
			ScientificUse: "blocked", LegalConclusion: "not-made",
		},
		Contract: ReproductionContract{
			SHA256: authority.contractSHA256, ResultAuthority: authority.contract.ResultAuthority,
			Platform: authority.contract.Platform,
		},
		BaseBuilds: []ReproductionBuild{}, FinalBuilds: []ReproductionBuild{},
		Notices: []NoticeObservation{}, ManPages: []string{}, Runtime: &RuntimeObservation{},
		Candidate: staged.receipt(authority), Comparison: ReproductionComparison{ConstructionMatch: true, Runtime: true, AllMatch: true},
	}
	return authority, staged, receipt, bodies
}

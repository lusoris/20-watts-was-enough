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
	expectedGeneratorLockInputSHA256 = "d7ff2963aa2f11e3cf001fc095520780539c85e4923448939c9ef9ede41eb827"
	expectedGeneratorImageSHA256     = "a0da021036c924a8528ddda232bb0fab8ec7545b0819d5ad8b0bd0fc7467d197"
)

func TestTrackedGeneratorImageFoundationIsClosedAndBlocked(t *testing.T) {
	t.Parallel()
	foundation, err := CheckGeneratorImageFoundation(trackedRepositoryRoot(t))
	if err != nil {
		t.Fatal(err)
	}
	if foundation.Authority != ResultAuthority || foundation.State != "blocked" {
		t.Fatalf("foundation authority/state = %q/%q", foundation.Authority, foundation.State)
	}
	if foundation.SourceID.String() != contractSourceIdentity(t) ||
		foundation.GenerationContract.String() != expectedContractIdentity {
		t.Fatalf("foundation source/contract = %s/%s", foundation.SourceID, foundation.GenerationContract)
	}
	if foundation.LockInputSHA256 != expectedGeneratorLockInputSHA256 ||
		foundation.ImageContractSHA256 != expectedGeneratorImageSHA256 {
		t.Fatalf("foundation lock/image hashes = %s/%s", foundation.LockInputSHA256, foundation.ImageContractSHA256)
	}
}

func TestParseGeneratorLockInputRejectsCandidateOrSourceDrift(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	valid := string(trackedGeneratorFile(t, "lock-input.json"))
	tests := map[string]string{
		"duplicate":          strings.Replace(valid, `"authority": "NO_RESULT"`, `"authority": "NO_RESULT", "authority": "NO_RESULT"`, 1),
		"unknown":            strings.Replace(valid, `"schema_version": 1`, `"schema_version": 1, "extra": true`, 1),
		"trailing":           valid + `{}`,
		"noncanonical":       strings.Replace(valid, "  \"authority\"", "    \"authority\"", 1),
		"wrong authority":    strings.Replace(valid, `"NO_RESULT"`, `"RESULT"`, 1),
		"ready state":        strings.Replace(valid, `"candidate_only"`, `"locked"`, 1),
		"wrong platform":     strings.Replace(valid, `"linux/amd64"`, `"linux/arm64"`, 1),
		"mutable index":      strings.Replace(valid, `https://pypi.org/simple`, `https://example.invalid/simple`, 1),
		"source archive":     strings.Replace(valid, lockedSourceArchiveSHA256, strings.Repeat("a", 64), 1),
		"archive size":       strings.Replace(valid, `"archive_size_bytes": 5347008`, `"archive_size_bytes": 1`, 1),
		"newer Python":       strings.Replace(valid, `"version": "3.13.15"`, `"version": "3.14.7"`, 1),
		"mutable base":       strings.Replace(valid, `@sha256:c45a22ea000adfd9cda29364bbe7edd23001ce5cc2ad15857cfbf7766943b9ca`, ``, 1),
		"resolver drift":     strings.Replace(valid, `"version": "0.12.7"`, `"version": "0.12.8"`, 1),
		"constraint drift":   strings.Replace(valid, `jax>=0.4.31`, `jax>=0.4.30`, 1),
		"candidate drift":    strings.Replace(valid, `"requirement": "jax==0.11.1"`, `"requirement": "jax==0.11.0"`, 1),
		"wheel digest":       strings.Replace(valid, lockedWheelCandidates[0].SHA256, strings.Repeat("b", 64), 1),
		"wheel URL":          strings.Replace(valid, `https://files.pythonhosted.org/`, `https://example.invalid/`, 1),
		"supplement missing": strings.Replace(valid, `tqdm==4.70.0`, `tqdm>=4`, 1),
	}
	for name, body := range tests {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			if _, err := ParseGeneratorLockInput([]byte(body), source); err == nil {
				t.Fatalf("ParseGeneratorLockInput accepted %s", name)
			}
		})
	}
	if _, err := ParseGeneratorLockInput(bytes.Repeat([]byte{' '}, maximumGeneratorLockInputBytes+1), source); err == nil {
		t.Fatal("ParseGeneratorLockInput accepted oversized input")
	}
}

func TestParseGeneratorImageContractRejectsPretendedAcceptance(t *testing.T) {
	t.Parallel()
	source := trackedSourceRecord(t)
	generation := trackedGenerationContract(t, source)
	lockBody := trackedGeneratorFile(t, "lock-input.json")
	valid := string(trackedGeneratorFile(t, "image-contract.json"))
	tests := map[string]string{
		"duplicate":            strings.Replace(valid, `"state": "blocked"`, `"state": "blocked", "state": "blocked"`, 1),
		"unknown":              strings.Replace(valid, `"schema_version": 1`, `"schema_version": 1, "extra": true`, 1),
		"trailing":             valid + `{}`,
		"ready header":         strings.Replace(valid, `"state": "blocked"`, `"state": "ready"`, 1),
		"result authority":     strings.Replace(valid, `"NO_RESULT"`, `"RESULT"`, 1),
		"wrong source":         strings.Replace(valid, contractSourceIdentity(t), "sha256:"+strings.Repeat("a", 64), 1),
		"wrong contract":       strings.Replace(valid, expectedContractIdentity, "sha256:"+strings.Repeat("b", 64), 1),
		"wrong lock digest":    strings.Replace(valid, expectedGeneratorLockInputSHA256, strings.Repeat("c", 64), 1),
		"dependency admitted":  strings.Replace(valid, `"state": "missing"`, `"state": "locked"`, 1),
		"networked install":    strings.Replace(valid, `"install_network": "none"`, `"install_network": "default"`, 1),
		"licence SPDX":         strings.Replace(valid, `"spdx": "Apache-2.0"`, `"spdx": "MIT"`, 1),
		"licence digest":       strings.Replace(valid, `"source_sha256": "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30"`, `"source_sha256": "`+strings.Repeat("d", 64)+`"`, 1),
		"licence size":         strings.Replace(valid, `"source_size_bytes": 11358`, `"source_size_bytes": 1`, 1),
		"licence destination":  strings.Replace(valid, `"destination_path": "/usr/share/licenses/clrs/LICENSE"`, `"destination_path": "/tmp/LICENSE"`, 1),
		"licence admitted":     strings.Replace(valid, `"license_material": {`+"\n"+`    "state": "missing"`, `"license_material": {`+"\n"+`    "state": "ready"`, 1),
		"licence pretence":     strings.Replace(valid, `"image_digest": ""`, `"image_digest": "sha256:`+strings.Repeat("e", 64)+`"`, 1),
		"licence receipt path": strings.Replace(valid, `"receipt_path": "build/evidence/clrs-generator/license-material-receipt.json"`, `"receipt_path": "receipt.json"`, 1),
		"licence receipt size": strings.Replace(valid, `"receipt_size_bytes": 0`, `"receipt_size_bytes": 1`, 1),
		"build pretence":       strings.Replace(valid, `"observed_builds": 0`, `"observed_builds": 2`, 1),
		"null layer digests":   strings.Replace(valid, `"layer_digests": []`, `"layer_digests": null`, 1),
		"SBOM pretence":        strings.Replace(valid, `"format": "spdx-json"`, `"format": "cyclonedx"`, 1),
		"SBOM path":            strings.Replace(valid, `"path": "build/evidence/clrs-generator/image.spdx.json"`, `"path": "image.spdx.json"`, 1),
		"SBOM receipt path":    strings.Replace(valid, `"receipt_path": "build/evidence/clrs-generator/sbom-receipt.json"`, `"receipt_path": "receipt.json"`, 1),
		"lock byte cap":        strings.Replace(valid, `"dependency_lock_bytes": 16777216`, `"dependency_lock_bytes": 0`, 1),
		"manifest byte cap":    strings.Replace(valid, `"wheelhouse_manifest_bytes": 16777216`, `"wheelhouse_manifest_bytes": 0`, 1),
		"package count cap":    strings.Replace(valid, `"dependency_package_count": 1024`, `"dependency_package_count": 0`, 1),
		"artifact count cap":   strings.Replace(valid, `"dependency_artifact_count": 2048`, `"dependency_artifact_count": 0`, 1),
		"SBOM byte cap":        strings.Replace(valid, `"sbom_bytes": 67108864`, `"sbom_bytes": 0`, 1),
		"SBOM package cap":     strings.Replace(valid, `"sbom_package_count": 10000`, `"sbom_package_count": 0`, 1),
		"receipt byte cap":     strings.Replace(valid, `"acceptance_receipt_bytes": 4194304`, `"acceptance_receipt_bytes": 0`, 1),
		"root user":            strings.Replace(valid, `"uid": 65532`, `"uid": 0`, 1),
		"runtime network":      strings.Replace(valid, `"network": "none"`, `"network": "default"`, 1),
		"writable root":        strings.Replace(valid, `"read_only_root": true`, `"read_only_root": false`, 1),
		"unbounded memory":     strings.Replace(valid, `"memory_bytes": 4294967296`, `"memory_bytes": 0`, 1),
		"environment drift":    strings.Replace(valid, `"OMP_NUM_THREADS=1"`, `"OMP_NUM_THREADS=8"`, 1),
		"smoke pretence":       strings.Replace(valid, `"require_source_import": true`, `"require_source_import": false`, 1),
		"one fixture run":      strings.Replace(valid, `"required_runs": 2`, `"required_runs": 1`, 1),
		"ready acceptance":     strings.Replace(valid, `"source_context": "locked"`, `"source_context": "ready"`, 1),
		"dropped blocker":      strings.Replace(valid, `"pinned_source_import_smoke",`, ``, 1),
		"dropped licence gate": strings.Replace(valid, `"pinned_upstream_license_material",`, ``, 1),
	}
	for name, body := range tests {
		name, body := name, body
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			if _, err := ParseGeneratorImageContract([]byte(body), lockBody, source, generation); err == nil {
				t.Fatalf("ParseGeneratorImageContract accepted %s", name)
			}
		})
	}
	if _, err := ParseGeneratorImageContract([]byte(valid), append(lockBody, '\n'), source, generation); err == nil {
		t.Fatal("ParseGeneratorImageContract accepted different lock-input bytes")
	}
}

func TestGeneratorImageFoundationRejectsSymlinkAndPrematureLock(t *testing.T) {
	t.Parallel()
	root := copyGeneratorFoundation(t)
	lockPath := filepath.Join(root, filepath.FromSlash(trackedLockInputPath))
	target := filepath.Join(t.TempDir(), "lock-input.json")
	body := trackedGeneratorFile(t, "lock-input.json")
	if err := os.WriteFile(target, body, 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Remove(lockPath); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(target, lockPath); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	if _, err := CheckGeneratorImageFoundation(root); err == nil || !strings.Contains(err.Error(), "symlink") {
		t.Fatalf("CheckGeneratorImageFoundation symlink error = %v", err)
	}

	root = copyGeneratorFoundation(t)
	uvLock := filepath.Join(root, "tooling", "clrs-generator", "uv.lock")
	if err := os.WriteFile(uvLock, []byte("premature"), 0o644); err != nil {
		t.Fatal(err)
	}
	if _, err := CheckGeneratorImageFoundation(root); err == nil || !strings.Contains(err.Error(), "exists while its state is missing") {
		t.Fatalf("CheckGeneratorImageFoundation premature-lock error = %v", err)
	}
}

func TestReadGeneratorFileRejectsPathReplacementAfterRead(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	relative := "tooling/clrs-generator/input.json"
	path := filepath.Join(root, filepath.FromSlash(relative))
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte("stable"), 0o644); err != nil {
		t.Fatal(err)
	}
	parked := filepath.Join(filepath.Dir(path), "parked.json")
	_, err := readGeneratorFileWithInterlock(root, relative, 64, func() error {
		if renameErr := os.Rename(path, parked); renameErr != nil {
			return renameErr
		}
		return os.WriteFile(path, []byte("mutate"), 0o644)
	})
	if err == nil || (runtime.GOOS != "windows" && !strings.Contains(err.Error(), "changed while it was read")) {
		t.Fatalf("readGeneratorFileWithInterlock() error = %v, want pathname-replacement refusal", err)
	}
}

func TestMissingGeneratorFileRejectsSymlinkedAncestor(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	target := t.TempDir()
	if err := os.Symlink(target, filepath.Join(root, "tooling")); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	err := requireMissingGeneratorFile(root, "tooling/clrs-generator/uv.lock")
	if err == nil || !strings.Contains(err.Error(), "symlink") {
		t.Fatalf("requireMissingGeneratorFile() error = %v, want linked-ancestor refusal", err)
	}
}

func TestCleanGeneratorRootRejectsSymlinkedAncestor(t *testing.T) {
	t.Parallel()
	parent := t.TempDir()
	realParent := filepath.Join(parent, "real")
	root := filepath.Join(realParent, "repository")
	if err := os.MkdirAll(root, 0o755); err != nil {
		t.Fatal(err)
	}
	linkedParent := filepath.Join(parent, "linked")
	if err := os.Symlink(realParent, linkedParent); err != nil {
		t.Skipf("symlinks unavailable: %v", err)
	}
	if _, err := cleanGeneratorRoot(filepath.Join(linkedParent, "repository")); err == nil ||
		!strings.Contains(err.Error(), "real directories") {
		t.Fatalf("cleanGeneratorRoot() error = %v, want linked-ancestor refusal", err)
	}
}

func trackedGeneratorFile(t *testing.T, name string) []byte {
	t.Helper()
	body, err := os.ReadFile(filepath.Join(trackedRepositoryRoot(t), "tooling", "clrs-generator", name))
	if err != nil {
		t.Fatalf("read tracked generator file %s: %v", name, err)
	}
	return body
}

func trackedRepositoryRoot(t *testing.T) string {
	t.Helper()
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("locate generator image test")
	}
	return filepath.Clean(filepath.Join(filepath.Dir(filename), "..", "..", ".."))
}

func copyGeneratorFoundation(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	paths := []string{
		trackedSourcePath,
		trackedGenerationPath,
		trackedLockInputPath,
		trackedImageContractPath,
		"tooling/pdf-renderer/lock.json",
	}
	for _, relative := range paths {
		destination := filepath.Join(root, filepath.FromSlash(relative))
		if err := os.MkdirAll(filepath.Dir(destination), 0o755); err != nil {
			t.Fatal(err)
		}
		body, err := os.ReadFile(filepath.Join(trackedRepositoryRoot(t), filepath.FromSlash(relative)))
		if err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(destination, body, 0o644); err != nil {
			t.Fatal(err)
		}
	}
	return root
}

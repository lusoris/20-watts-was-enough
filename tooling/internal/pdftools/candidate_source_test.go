package pdftools

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"slices"
	"testing"
)

func TestCandidateSourceEntriesContainTheDeclaredClosure(t *testing.T) {
	t.Parallel()
	fixture := newCandidateSourceFixture(t)
	entries, err := candidateSourceEntries(
		context.Background(), fixture.authority, fixture.spdx, fixture.fetch,
	)
	if err != nil {
		t.Fatal(err)
	}
	paths := make([]string, len(entries))
	for index, entry := range entries {
		paths[index] = entry.Path
	}
	slices.Sort(paths)
	want := []string{
		"apk-retention.json", "apko.lock.json", "apko.yaml", "contract.json", "notices/COPYING",
		"packages/a.apk", "packages/b.apk", "sbom/apko.spdx.json", "upstream/LICENSE",
		"upstream/poppler.tar.xz", "upstream/recipe.yaml",
	}
	if !slices.Equal(paths, want) {
		t.Fatalf("candidate paths = %v, want %v", paths, want)
	}
}

func TestCandidateSourceEntriesRejectMaintainedSourceReadRestoreRace(t *testing.T) {
	t.Parallel()
	for _, relative := range []string{
		"apko.yaml",
		"apko.lock.json",
		"apk-retention.json",
		"contract.json",
		"notices/COPYING",
		"upstream/recipe.yaml",
		"upstream/LICENSE",
	} {
		relative := relative
		t.Run(relative, func(t *testing.T) {
			t.Parallel()
			fixture := newCandidateSourceFixture(t)
			maintainedPath := filepath.Join(fixture.authority.root, "tooling", "pdf-tools", filepath.FromSlash(relative))
			original, err := os.ReadFile(maintainedPath)
			if err != nil {
				t.Fatal(err)
			}
			mutated := slices.Clone(original)
			mutated[0] ^= 1
			if err := os.WriteFile(maintainedPath, mutated, 0o644); err != nil {
				t.Fatal(err)
			}
			_, candidateError := candidateSourceEntries(
				context.Background(), fixture.authority, fixture.spdx, fixture.fetch,
			)
			if err := os.WriteFile(maintainedPath, original, 0o644); err != nil {
				t.Fatal(err)
			}
			if candidateError == nil {
				t.Fatalf("candidateSourceEntries() accepted a transient mutation of %s", relative)
			}
			if _, err := candidateSourceEntries(
				context.Background(), fixture.authority, fixture.spdx, fixture.fetch,
			); err != nil {
				t.Fatalf("candidateSourceEntries() rejected restored %s: %v", relative, err)
			}
		})
	}
}

type candidateSourceFixture struct {
	authority checkedAuthority
	downloads map[string][]byte
	spdx      spdxIdentity
}

func newCandidateSourceFixture(t *testing.T) candidateSourceFixture {
	t.Helper()
	root := t.TempDir()
	maintained := map[string][]byte{
		"apko.yaml":            []byte("config\n"),
		"apko.lock.json":       []byte("lock\n"),
		"apk-retention.json":   []byte("retention\n"),
		"contract.json":        []byte("contract\n"),
		"notices/COPYING":      []byte("notice\n"),
		"upstream/recipe.yaml": []byte("recipe\n"),
		"upstream/LICENSE":     []byte("licence\n"),
	}
	for relative, body := range maintained {
		path := filepath.Join(root, "tooling", "pdf-tools", filepath.FromSlash(relative))
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(path, body, 0o644); err != nil {
			t.Fatal(err)
		}
	}
	packages := []retainedPackage{
		{Name: "a", URL: "https://packages.wolfi.dev/a.apk", Filename: "a.apk", Size: 1, SHA256: digestRaw([]byte("a"))},
		{Name: "b", URL: "https://packages.wolfi.dev/b.apk", Filename: "b.apk", Size: 1, SHA256: digestRaw([]byte("b"))},
	}
	spdx := []byte("spdx\n")
	poppler := []byte("poppler\n")
	authority := checkedAuthority{
		root: root,
		contract: Contract{
			Apko: Apko{
				Config: "apko.yaml", ConfigSHA256: digestRaw(maintained["apko.yaml"]),
				Lock: "apko.lock.json", LockSHA256: digestRaw(maintained["apko.lock.json"]),
			},
			BaseImage: BaseImage{SPDXCanonicalSize: int64(len(spdx)), SPDXCanonicalSHA256: digestRaw(spdx)},
			Upstream: Upstream{
				PopplerArchive: UpstreamArchive{URL: "https://poppler.freedesktop.org/poppler.tar.xz", Size: int64(len(poppler)), SHA256: digestRaw(poppler)},
				WolfiRecipe: UpstreamRecipe{
					Snapshot: "upstream/recipe.yaml", Size: int64(len(maintained["upstream/recipe.yaml"])), SHA256: digestRaw(maintained["upstream/recipe.yaml"]),
					License: UpstreamLicense{Snapshot: "upstream/LICENSE", Size: int64(len(maintained["upstream/LICENSE"])), SHA256: digestRaw(maintained["upstream/LICENSE"])},
				},
			},
			NoticeLayer: NoticeLayer{Entries: []NoticeEntry{{
				Source: "notices/COPYING", Size: int64(len(maintained["notices/COPYING"])), SHA256: digestRaw(maintained["notices/COPYING"]),
			}}},
			SourceDelivery: SourceDelivery{
				APKManifest: "apk-retention.json", APKManifestSHA256: digestRaw(maintained["apk-retention.json"]), APKCount: len(packages),
				BundleLayout: BundleLayout{APKDirectory: "packages", PopplerArchive: "upstream/poppler.tar.xz", SPDX: "sbom/apko.spdx.json"},
			},
			Limits: Limits{LockBytes: 1024, SourceBundleBytes: 1024 * 1024},
		},
		contractSHA256: digestRaw(maintained["contract.json"]),
		retention:      retentionManifest{Packages: packages, TotalBytes: 2},
	}
	downloads := map[string][]byte{
		packages[0].URL: []byte("a"),
		packages[1].URL: []byte("b"),
		authority.contract.Upstream.PopplerArchive.URL: poppler,
	}
	spdxIdentity := spdxIdentity{
		RawSHA256: digestRaw(spdx), RawSize: int64(len(spdx)),
		CanonicalSHA256: digestRaw(spdx), CanonicalSize: int64(len(spdx)), raw: spdx,
	}
	return candidateSourceFixture{authority: authority, downloads: downloads, spdx: spdxIdentity}
}

func (fixture candidateSourceFixture) fetch(_ context.Context, source exactSource) ([]byte, error) {
	body, exists := fixture.downloads[source.URL]
	if !exists {
		return nil, errors.New("unexpected source")
	}
	return slices.Clone(body), nil
}

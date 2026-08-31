# Locked PDF-tools image authority

This directory fixes the inputs for the planned Linux `amd64` PDF-tools
image. It does not publish an image and it does not make a scientific,
PDF/UA, WCAG, or legal-compliance claim.

## Maintained inputs

- `apko.yaml` selects Wolfi and the exact Poppler `26.08.0-r0` packages.
- `apko.lock.json` closes the 45-package transitive graph for `x86_64`.
- `contract.json` binds the apko builder digest, timestamp, base-image
  observations, runtime checks, source inputs, notice destinations and
  resource limits.
- `apk-retention.json` records the exact URL, size, SHA-256 digest and declared
  licence for every locked APK. Licence declarations are package metadata, not
  a project legal conclusion.
- `notices/` contains byte-checked files from the official Poppler 26.08.0
  archive. The planned final image layer places them beneath
  `/usr/share/licenses/poppler/`.
- `upstream/wolfi-poppler.yaml` is the byte-checked Wolfi recipe snapshot named
  by the contract.
- `upstream/wolfi-LICENSE` is the byte-checked root `LICENSE` from that same
  Wolfi revision. It identifies the build recipes as Apache-2.0 and explicitly
  leaves each underlying package under its own terms.

The `poppler-doc` package supplies the 13 recorded command man pages. The
notices are separate because the inspected APK graph did not contain those
five upstream files.

## Offline check

Run the standard-library Go validator from the repository root:

```bash
go -C tooling run ./cmd/20w publication verify-pdf-tools --root ..
```

The command performs no network or container operation. It rejects ambiguous
JSON, symlinks, changed files, lock/config drift, missing packages, unbounded
records, incomplete APK byte ranges and a missing notice or recipe snapshot.
It also checks the pinned recipe licence and the existing BuildKit lock selected
for deterministic final-layer assembly.

## Reproduction boundary

The pinned apko image is the only admitted package assembler. Set
`SOURCE_DATE_EPOCH=1785757696`, pass `apko.lock.json` with `--lockfile`, and
build only `linux/amd64` under the contract's local output tag. The recorded
comparison used apko 1.2.41 from the contract digest. Two runs produced the
same base archive SHA-256,
`53355e7620c02fa9bd71f72f1f078a1debc31fd07fbbe881c4d668ac18cc98d1`,
and the same base manifest, config and layer identities in `contract.json`.
Runtime probes observed Poppler 26.08.0, UID/GID 65532 and no `/bin/sh` or
`/sbin/apk` while using no network, a read-only root, dropped capabilities and
`no-new-privileges`.

Those observations cover the apko base only. The deterministic notice layer,
two-build final-image comparison, publication, anonymous digest pull and CI
consumer lock remain required before the image is admitted.

## Notice and source route

Before any candidate is pushed, its bounded source bundle must contain the 45
exact APK files, apko config, lock, contract, APK-retention manifest, official
Poppler archive, pinned Wolfi recipe, its root Apache-2.0 recipe licence, five
notices and apko's SPDX SBOM. The candidate bundle is retained for 30 days; an
accepted release carries the same inventory as a checksum-bound GitHub Release
asset.

The SPDX SBOM records the build-recipe and upstream-source locators emitted for
the complete APK graph. The committed contract independently binds the Poppler
source archive and the Wolfi root recipe-licence bytes. That Wolfi licence does
not license the underlying packages or an assembled image. Dependency source
locators, package licence metadata and the proposed bundle therefore remain
subject to maintainer notice/source review. The route preserves review evidence;
it does not certify that every distribution obligation has been met.

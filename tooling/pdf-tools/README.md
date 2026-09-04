# Locked PDF-tools image authority

This directory fixes the inputs for the Linux `amd64` PDF-tools image and its
local construction check. It does not publish an image and it does not make a
scientific, PDF/UA, WCAG, or legal-compliance claim.

## Maintained inputs

- `apko.yaml` selects Wolfi and the exact Poppler `26.08.0-r0` packages.
- `apko.lock.json` closes the 45-package transitive graph for `x86_64`.
- `contract.json` binds the apko builder digest, timestamp, base-image
  observations, canonical SPDX graph identities, runtime checks, source
  inputs, notice destinations and resource limits.
- `apk-retention.json` records the exact URL, size, SHA-256 digest and declared
  licence for every locked APK. Licence declarations are package metadata, not
  a project legal conclusion.
- `notices/` contains byte-checked files from the official Poppler 26.08.0
  archive. The final image layer places them beneath
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

## Local final-image reproduction

The Go command can reproduce the complete image twice through the local Docker
daemon:

```bash
go -C tooling run ./cmd/20w publication reproduce-pdf-tools-image \
  --root .. \
  --receipt build/evidence/pdf-tools-candidate.json \
  --final-archive build/release-inputs/pdf-tools-final-linux-amd64.tar \
  --spdx build/release-inputs/pdf-tools-apko-linux-amd64.spdx.json \
  --source-bundle build/release-inputs/20w-pdf-tools-26.08.0-r0-linux-amd64-sources.tar.gz
```

The receipt path must be a new repository-relative JSON file in an admitted
evidence directory. The command runs the exact apko image twice under bounded
resources after a bounded probe verifies its declared version, revision and Go
version. The receipt labels the apko network and containment as requested
settings because the short-lived build containers are not treated as observed
runtime state. The command admits only the committed base image and canonical SPDX graphs, and
projects each Docker archive into a private OCI layout without a host image
converter. It then uses two fresh instances of the locked BuildKit 0.32.2 image
to build the notice layer. Each local daemon has no Docker network, fixed
memory, PID and CPU limits, and one worker; each final build also uses no cache,
no build network and no requested entitlement. The pinned Buildx
Docker-container driver admits `network.host` at the daemon gate, but the
network-disabled daemon namespace and unentitled build cannot exercise it. The
driver necessarily runs these temporary BuildKit daemons as privileged
containers. The check
compares both complete final OCI archives, manifests, configs, layers and diff
IDs before it inspects the notices, man pages, forbidden paths, Poppler
versions, configured UID/GID and runtime containment.

The three candidate-output flags are optional as a set. When present, the
command downloads each of the 45 APKs and the Poppler archive from the exact
URL in the authority, refuses redirects or transformed response bytes, and
checks every size and SHA-256 digest. It retains one reproduced final OCI
archive, the exact apko SPDX document after requiring both build outputs to
match byte for byte, and the source bundle. The bundle contains that same SPDX
document and the maintained config, lock, contract,
retention manifest, notices, Wolfi recipe and recipe licence alongside those
downloaded bytes. Its sorted `SHA256SUMS` covers every other bundle file; the
receipt binds the checksum file and complete compressed archive.

Success places only the explicitly named new files and writes an atomic
`authority: NO_RESULT` receipt. Existing paths, symlinked parents, path escape,
partial candidate sets, and output races fail closed. The command does not
create a tag, push, release, digest-admission record, or legal conclusion. It
removes the builders, containers, state volumes and temporary image alias that
it owns. Docker may retain the untagged, content-addressed image data in its
local content store; the command does not claim exclusive ownership of shared
digest content or delete it underneath a concurrent local reproduction.

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

The local command checks the deterministic notice layer and two-build final
image as construction evidence. With explicit output paths, it can also prepare
the bounded candidate files for maintainer review. Publication, anonymous
digest pull, release acceptance and the exact-digest CI consumer lock remain
separate admission gates.

## Notice and source route

Before any candidate is pushed, its bounded source bundle must contain the 45
exact APK files, apko config, lock, contract, APK-retention manifest, official
Poppler archive, pinned Wolfi recipe, its root Apache-2.0 recipe licence, five
notices, apko's SPDX graph and the internal checksum inventory. The candidate
bundle is retained for 30 days; an accepted release carries the same inventory
as a checksum-bound GitHub Release asset.

The SPDX SBOM records the build-recipe and upstream-source locators emitted for
the complete APK graph. The committed contract independently binds the Poppler
source archive and the Wolfi root recipe-licence bytes. That Wolfi licence does
not license the underlying packages or an assembled image. Dependency source
locators, package licence metadata and the proposed bundle therefore remain
subject to maintainer notice/source review. The route preserves review evidence;
it does not certify that every distribution obligation has been met.

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
  --candidate-bundle build/release-inputs/pdf-tools-candidate-linux-amd64.tar \
  --final-archive build/release-inputs/pdf-tools-final-linux-amd64.tar \
  --spdx build/release-inputs/pdf-tools-canonical-apko-linux-amd64.spdx.json \
  --source-bundle build/release-inputs/20w-pdf-tools-26.08.0-r0-linux-amd64-sources.tar.gz
```

The receipt path must be a new repository-relative JSON file in an admitted
evidence directory. Without candidate flags, it receives the successful
construction receipt. With candidate flags, it is reserved for mismatch
evidence; a successful candidate receipt exists only inside the publication
bundle. The command runs the exact apko image twice under bounded
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

The four candidate-output flags are optional as a set. When present, the
command downloads each of the 45 APKs and the Poppler archive from the exact
URL in the authority, refuses redirects or transformed response bytes, and
checks every size and SHA-256 digest. It retains one reproduced final OCI
archive, one canonical apko SPDX document after requiring both validated
canonical documents to match byte for byte, and the source bundle. SPDX
canonicalisation preserves every field value and every array order except the
validated `relationships` array, which it sorts; deterministic JSON encoding
also fixes object-member order and whitespace. The receipt retains each
build's separate raw SPDX size and SHA-256 for audit instead of claiming those
raw documents matched. The compressed source archive contains the retained
canonical document and the maintained config, lock, contract, retention
manifest, notices, Wolfi
recipe and recipe licence alongside the downloaded bytes. Its sorted
`SHA256SUMS` covers every other source-archive file; the receipt binds the
checksum file and complete compressed archive.

The candidate publication bundle is a deterministic USTAR containing the
receipt, final archive, canonical SPDX document and compressed source archive
under fixed member names. The three separately named candidate files are
non-authoritative convenience copies. The publication bundle is the only
complete candidate and consumer authority. It is built twice from the unnamed
staged descriptors and both builds must have the same size and SHA-256 before
one completed bundle inode is linked to its final name. A successful candidate
run leaves no standalone receipt.

Existing paths, symlinked parents, path escape, partial flag sets and output-
name competition fail closed. On Linux `amd64`, the command reaches each output
directory through no-follow descriptor traversal, stages bytes in unnamed
`O_TMPFILE` inodes, and links each completed inode to an absent name through
its pinned parent. This route requires `O_TMPFILE`, `linkat`, and
`/proc/self/fd`; an unavailable primitive stops candidate publication and
`NO_RESULT` receipt output. Cleanup closes descriptors and never unlinks a
published name. If a later check fails, any file already linked is retained
for inspection, and a rerun still rejects every existing output path. The
command does not create a tag, push, release, digest-admission record, or legal
conclusion. It
removes the builders, containers, state volumes and temporary image alias that
it owns. Docker may retain the untagged, content-addressed image data in its
local content store; the command does not claim exclusive ownership of shared
digest content or delete it underneath a concurrent local reproduction.

The no-replace guarantee covers cooperating invocations competing for the same
new name. Another process with the same user identity can mutate a file after
the command returns, and can rename a pinned output directory during the
command. Detected drift fails the run, but an exact linked file can remain in
that moved directory; the replacement symlink is not followed. Consumers must
therefore obtain the reported outer SHA-256 independently and recheck the
bundle immediately before use:

```bash
go -C tooling run ./cmd/20w publication verify-pdf-tools-candidate-bundle \
  --root .. \
  --bundle build/release-inputs/pdf-tools-candidate-linux-amd64.tar \
  --sha256 <reported-bundle-sha256>
```

The Linux `amd64` verifier checks the outer digest and the exact canonical tar
encoding, including padding, then rehashes every embedded stream against the
receipt. Passing remains
`NO_RESULT`; it does not admit a release or scientific result.

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
the bounded candidate bundle for maintainer review. Publication, anonymous
digest pull, release acceptance and the exact-digest CI consumer lock remain
separate admission gates.

## Notice and source route

Before any candidate is pushed, its bounded source bundle must contain the 45
exact APK files, apko config, lock, contract, APK-retention manifest, official
Poppler archive, pinned Wolfi recipe, its root Apache-2.0 recipe licence, five
notices, apko's SPDX graph and the internal checksum inventory. The
corresponding-source archive is retained for 30 days; an accepted release
carries the same inventory as a checksum-bound GitHub Release asset.

The SPDX SBOM records the build-recipe and upstream-source locators emitted for
the complete APK graph. The committed contract independently binds the Poppler
source archive and the Wolfi root recipe-licence bytes. That Wolfi licence does
not license the underlying packages or an assembled image. Dependency source
locators, package licence metadata and the proposed bundle therefore remain
subject to maintainer notice/source review. The route preserves review evidence;
it does not certify that every distribution obligation has been met.

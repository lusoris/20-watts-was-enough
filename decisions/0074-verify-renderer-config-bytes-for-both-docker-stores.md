# 0074 — Verify renderer config bytes for both Docker stores

- **Status:** accepted
- **Date:** 2026-09-05
- **Extends:** [0045](0045-rewrite-renderer-layer-timestamps-before-recording-image-identity.md)
- **Related:** [issue #97](https://github.com/lusoris/20-watts-was-enough/issues/97)

## Context

Schema-3 reproducibility receipts labelled Docker's loaded image ID as the
image config digest. That is correct for classic-store identity semantics,
but not for the observed containerd-backed Docker 29.7.2 daemon: its loaded
ID is the original OCI manifest digest. The old config comparison then
duplicated the manifest comparison. The retained manifest and complete
PDF/manifest byte comparisons are separate observations and remain valid.

A read-only export of the existing renderer recovered the original 4,267-byte
manifest and its 14,570-byte config. Their SHA-256 identities are respectively
`421c7709116ed7d604392668971b711bc65e146636a6df518eeca31df509da9b`
and `151fb1a3a6c146ea645bb4a96698826af5c67ceca32ff8927541b010abbeeea9`.
The stream took 5.850 seconds on the maintainer's workstation. This measured
one existing-image export, not two new builds or a release acceptance run.

The actual GitHub acceptance used Docker 28.0.4 with the classic `overlay2`
store and recorded the latter config identity as its loaded ID. Its
[export implementation](https://github.com/moby/moby/blob/v28.0.4/image/tarexport/save.go)
writes the stored config bytes but constructs another OCI manifest. Requiring
that reconstruction to equal the original Buildx manifest would reject this
supported path.

## Decision

1. Schema 4 keeps the loaded execution ID, original Buildx manifest digest and
   actual config digest distinct. Its proof records exact bytes in base64 so
   JSON formatting cannot change their identities.
2. The manifest-ID method requires original manifest bytes whose SHA-256
   matches the recorded build manifest. Its config descriptor must match the
   size and SHA-256 of the exported config bytes.
3. The direct config-ID method requires one Docker archive manifest to select
   the loaded config ID and requires the original config bytes to hash to that
   ID. It records no original-manifest byte proof. The Buildx manifest digest
   remains a separate exporter-metadata observation.
4. Never derive config identity by serialising Docker's projected inspection
   object. Do not require the Buildx config metadata key: the pinned client
   removes it on the observed containerd import path.
5. Every acceptance Docker operation uses the local Linux
   `unix:///var/run/docker.sock` endpoint with inherited Docker and Buildx
   routing overrides removed. The ordinary rendering command is unchanged.
6. Bound each read-only archive stream to 120 seconds and 4 GiB. The locked
   image's unique layers contain 2,622,233,088 uncompressed tar bytes; a 2-GiB
   cap rejected the classic Docker export. The 4-GiB cap leaves room for those
   bytes and the separately bounded archive metadata and framing. Count at most
   128 physical tar headers, reject extension headers before their hidden
   processing, and retain at most 1 MiB of small blobs, each at most 64 KiB.
   Require complete framing, unique admitted paths and strict JSON. No layers
   are extracted; no independent layer-byte audit is claimed.
7. Keep the two fresh builders, no-cache builds, loaded-ID check, complete
   generated-pair comparison and owned-resource cleanup. A failed config
   proof cannot produce a passing receipt.

## Historical evidence and verification

Do not rewrite old schema-3 receipts. Their named config fields alone do not
establish that actual config bytes were inspected. In the affected local
containerd observation the field was the manifest ID; the GitHub classic-store
field used config-ID semantics. Neither receipt becomes a schema-4 proof by
renaming a field.

The patch needs focused parser, proof-method, cancellation and failure tests
before its existing two-builder integration gate. Its targeted tests are
engineering checks, not a scientific result or independent human review.
Codex, Go, ordinary read-only Docker commands and pinned upstream source
inspection materially contributed to this correction.

Supersede this decision if the renderer exporter or daemon identity contract
changes, or a reviewed smaller content API can provide equivalent exact-byte
proof without an image archive stream.

# 0045 — Rewrite renderer layer timestamps before recording image identity

- **Status:** accepted
- **Date:** 2026-08-30
- **Partly supersedes:** [0040](0040-bind-publications-to-reproducible-and-public-artifacts.md), clauses 1 and 4 for renderer-image assembly
- **Implements:** [issue 11](https://github.com/lusoris/20-watts-was-enough/issues/11)

## Context

Decision 0040 made the local PDF-renderer image ID part of publication
identity. Rebuilding its exact locked inputs nevertheless produced different
image IDs while the PDFs and normalized renderer files remained identical.
Only the two generated rootfs layers changed. Their file bytes and paths
matched; parent-directory timestamps did not.

BuildKit 0.32.2 consumes `SOURCE_DATE_EPOCH` for image configuration and
history timestamps, but file timestamps inside image layers require the image
exporter's [`rewrite-timestamp=true`](https://github.com/moby/buildkit/blob/v0.32.2/docs/build-repro.md#source_date_epoch)
option. The same pinned documentation identifies compatibility version `30` as
the current digest-affecting assembly path. Layer-conversion failures are not
always fatal: this BuildKit version can [warn and continue](https://github.com/moby/buildkit/blob/v0.32.2/exporter/containerimage/writer.go#L439-L483).

A bounded reproduction used the retained context prepared by the Go renderer,
two separate fresh builders pinned to the locked BuildKit digest, `--no-cache`,
and `--output type=docker,rewrite-timestamp=true`. Both builds produced image
and config digest
`sha256:245bdc27adc5e320f623aaa476afeb73913321cf1c9bb349079155bf70e91f23`
and the same 19 rootfs diff IDs. Neither emitted a timestamp-rewrite warning.
This is build-boundary evidence, not a scientific result or a cross-platform
reproducibility claim.

That retained reproduction established the decision input, but it was not a
repeatable regression boundary. The earlier Go test injected one image ID and
therefore could not prove that two real builders would derive it again.

## Decision

1. Renderer-lock schema 3 adds one exporter contract:
   `rewrite_timestamp` must be `true`, and `compatibility_version` must record
   the reviewed BuildKit 0.32.2 default `30`.
2. Build the local renderer with the explicit Docker exporter
   `type=docker,rewrite-timestamp=true`. Do not use the `--load` shorthand,
   because it cannot express the timestamp rule in the reviewed command.
3. Keep compatibility version `30` as lock metadata rather than passing a
   `compatibility-version` exporter attribute. The lock already pins BuildKit;
   a future BuildKit change must recheck its default, repeat the isolated-build
   comparison and revise the lock before the renderer is admitted.
4. Reject a successful BuildKit exit when its bounded output says that no
   source-date epoch was found or that any layer failed timestamp rewriting.
   Such a build cannot supply the renderer image identity.
5. Retain the exact local image ID in the book manifest. It is claimable only
   inside the complete lock boundary: buildx revision, BuildKit image,
   exporter policy, platform, normalized context, runtime images, browser
   bytes and `SOURCE_DATE_EPOCH`. The PDF digest remains a separate output
   identity.
6. Make the two-builder comparison executable through
   `20w publication verify-pdf-reproducibility`. One run prepares and hashes
   the exact normalized context, creates two distinct pinned builders, disables
   their build caches, records each image, config and manifest digest, renders
   each image once, and byte-compares the complete PDF and book-manifest pair.
   Renderer-selected CI and every tagged release run this acceptance. Ready
   pull requests and main pushes still use a full plan, but preserve their
   exact diff so unrelated changes do not select the renderer gate. Manual,
   unavailable, invalid, unmapped and selector-authority diffs select it
   fail-closed. Non-additive diffs inspect both retained paths.
   CI retains the deterministic JSON receipt; a tagged release includes the
   receipt in its checksum-bound assets.

## Alternatives considered

- **Remove image ID from the public manifest.** This remains the fallback if
  layer rewriting stops producing one identity. It is unnecessary while the
  locked two-builder comparison and fail-closed command preserve the stronger
  boundary.
- **Pass `compatibility-version=30` to the Docker exporter.** Rejected because
  the pinned documentation defines that option for the image and OCI exporters,
  while this command needs Docker-engine loading. Recording the reviewed
  default avoids relying on an unreviewed Docker-exporter attribute.
- **Normalize only the staged context timestamps.** Rejected because the
  observed drift arose in exported layer metadata after the context had
  already passed Go's normalization boundary.

## Consequences

- An identical build inside the locked Linux `amd64` boundary now has a stable
  image/config identity in addition to stable renderer content and PDF bytes.
- The renderer lock digest and generated book manifest change once for schema
  3. PDF bytes may remain identical; their manifest must still be regenerated
  and validated as one pair.
- BuildKit upgrades are not mechanical version bumps. They require a reviewed
  compatibility default and the same two-fresh-builder falsification test.
- The recurring acceptance owns only its uniquely named builders and image
  tags, bounds every Docker call and total run time, and removes those resources
  after success or failure. Its receipt is engineering evidence, not a
  scientific result or a claim beyond the locked Linux `amd64` boundary.
- Decision 0040 continues to control container execution, two-render PDF
  comparison, immutable release assembly and anonymous release-image access.

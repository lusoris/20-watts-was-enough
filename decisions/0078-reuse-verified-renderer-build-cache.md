# 0078 — Reuse verified renderer build cache

- **Status:** accepted
- **Date:** 2026-09-05
- **Extends:** [0077](0077-separate-render-pair-and-image-build-proofs.md)
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7)

## Context

The render-pair proof still constructs an unchanged renderer on each hosted
runner. Its image contains the locked Node and Chrome runtimes; book components
and styles are mounted at render time. Reusing those image layers can remove
repeated construction without skipping either PDF render.

## Decision

Extend the existing Go proof command with optional
`--cache-dir build/cache/pdf-renderer`, restricted to `--ref main`. The cache
contains a BuildKit local OCI export and a small identity record, not a
published renderer image or release input. No registry permission is added.

An `image-build` proof never imports cache. Both fresh builders retain
`--no-cache`; the first may export a seed. A cold `render-pair` proof builds
once without cache and exports a seed. A warm render-pair proof creates a new
locked builder, imports one inspected cache manifest by digest, and verifies
the resulting image, original manifest and config identities against the seed
before rendering. Both modes still perform two isolated renders. Default
invocations and releases do not enable the cache.

The identity record binds the renderer lock, normalised context, produced image
and cache descriptor closure. The Go boundary rejects malformed JSON, unknown
authority fields, wrong identities, path escapes, symlinks, extra files and
digest or size disagreement. It admits at most 128 gzip layer descriptors and
4 GiB of compressed blobs, hashes each blob without unpacking it, and bounds
directory reads. The pinned BuildKit parser interprets cacheconfig semantics.
Checksums establish byte integrity, not who produced those bytes.

Exports use a fresh staging directory, so old blobs cannot accumulate. Only a
passing comparison, retained receipt and successful owned-image cleanup permit
atomic cache placement; cancellation prevents placement. Existing cache bytes
are not replaced. Failed or mismatching proofs retain their existing evidence
contract and remove only their own staging resources.

Cache-enabled receipts use schema 6. They retain the selected proof scope,
actual fresh-builder and render counts, cache manifest and bounded inventory,
and whether cache import was enabled. `no_cache` remains truthful on mismatch
receipts too. An imported cache does not prove that every BuildKit step hit it,
nor does one cached build establish independent image-build agreement.

## Hosted trust and failure boundary

CI uses pinned `actions/cache` restore and save actions. The exact key binds
the renderer lock, Go build/proof/cache owners, their internal dependencies,
CLI driver and Go module graph. It contains no book source or CSS, so eligible
presentation changes can share a seed. There are no fallback keys. A non-empty
partial match is rejected before Go consumes it; a missing cache takes the
cold path.

Only successful `main` push proofs save caches. Pull requests may restore but
do not save through this workflow. GitHub's branch isolation and trusted main
writers supply provenance; the co-located identity record is not a signature.
Cache contents are readable by fork pull requests and must contain no secrets.
The restore action performs download and extraction before Go validation, so
that initial step trusts the pinned action and ephemeral hosted runner, not
the Go inventory bounds. Restore and save each have a ten-minute deadline;
download segments have a two-minute deadline. Docker work keeps its locked
build, render and output limits. Invalid cache state fails closed rather than
silently changing the proof.

Caches are disposable under GitHub's eviction policy. Their loss costs a cold
build, not evidence. The existing CI receipt and mismatch artifacts retain
their 30-day policy. Local proof evidence stays under the declared ignored
publication evidence root. Issue #7 remains the failure and performance route;
this decision does not close the patch release or establish a power saving.

## Verification and retirement

Cover cold, warm and cache-free two-builder paths; changed lock/context and
seed image; malformed, oversized, extra and tampered cache bytes; exact-key
selection; release rejection; cancellation; and mismatch plus cleanup failure.
Run real cold and warm Docker proofs and retain timings with their machine and
cache-transfer limits. Hosted cache acquisition remains unverified until the
main seed and a later exact restore are observed.

Remove this cache if measured transfer and inspection costs outweigh repeated
construction, or when an admitted digest-bound renderer acquisition path
replaces it. Codex implemented and reviewed this engineering change with
bounded coding-agent assistance; those reviews are not independent scientific
review.

## Source basis

- [Docker local cache documentation](https://docs.docker.com/build/cache/backends/local/),
  checked 2026-09-05 against Buildx 0.36.1: OCI layout, digest import, fresh
  export and cache mode.
- [GitHub dependency-caching reference](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching),
  checked 2026-09-05: primary-key prefix matching, immutable entries, branch
  access and eviction.
- [`actions/cache` v6.1.0](https://github.com/actions/cache/tree/55cc8345863c7cc4c66a329aec7e433d2d1c52a9):
  pinned restore/save inputs, outputs and execution boundary.

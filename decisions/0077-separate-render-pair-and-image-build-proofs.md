# 0077 — Separate render-pair and image-build proofs

- **Status:** accepted
- **Date:** 2026-09-05
- **Extends:** [0074](0074-verify-renderer-config-bytes-for-both-docker-stores.md), [0075](0075-isolate-ci-driver-dependency-closures.md)
- **Partly supersedes:** [0069](0069-map-ci-deletions-through-their-owning-lanes.md), for deleted presentation authority
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7)

## Context

PR #111 changed print positioning without changing the renderer image inputs.
Its CI job nevertheless built the same locked image twice. CSS and book
components are mounted into the render containers; the generated Dockerfile
contains the pinned Node executable and Chrome distribution, not those sources.
The maintainer approved separating image construction from render comparison.

## Decision

Keep the existing renderer lane and its required success check. The Go plan
projection selects `render-pair` only for a recognised presentation-only impact
change set. Its exact allowlist includes the accompanying changelog, generated
pair, semantic baseline and the two regression-test files in PR #111. Any
other companion path selects `image-build`; executable metadata and semantic
audit owners are not those test files.
Full plans, unavailable comparisons, selector and toolchain changes retain the
independent-image proof. Deleting a presentation-authority file expands to full;
rename, copy and non-regular transition handling remains unchanged.

The shared Go proof command accepts `--proof render-pair` only with `--ref main`.
It builds one image from the locked, normalised context without cache, verifies
the actual execution config, then runs two network-isolated render containers
with separate writable output and temporary directories. It compares both PDF
and manifest bytes without publishing either pair. A schema-5 receipt records
the render-pair scope, one actual build and both render observations. This is
not evidence that two independently built images match.

The default `image-build` mode remains the two-fresh-builder, no-cache proof and
retains schema 4. Tagged releases cannot select the lighter mode. Both modes
keep source and dependency checks, resource limits, exclusive new receipt
placement, owned-resource cleanup, and both retained pairs on a mismatch.
CI uploads the evidence for 30 days and fails on a comparison or cleanup error.
Missing or unknown proof selections fail before image work. No extra workflow,
registry credentials, action dependency or public image is introduced.

## Verification and remaining work

Test selection and mixed changes, full and deleted-authority fallback, CLI
rejection, one-build/two-render isolation, original-config proof, mismatch
retention, cleanup failure and receipt-overwrite refusal. Keep the existing
two-builder tests and release policy checks. Validate the integration with a
real Docker render-pair run and the aggregate repository gate.

This first step removes one image build from eligible jobs. It does not yet
eliminate cold image construction or establish a wall-time or energy saving.
Cross-run reuse still needs a verified acquisition path and its distribution
boundary; a locally available image is not sufficient for a fresh hosted runner.
Issue #7 stays open. Supersede this step when admitted, digest-bound acquisition
can replace the cold build without changing the two-render acceptance contract.

Codex implemented this engineering change; automated tests and retained command
receipts describe the exercised boundaries, not independent scientific review.

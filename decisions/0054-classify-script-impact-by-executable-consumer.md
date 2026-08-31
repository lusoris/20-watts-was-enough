# 0054 — Classify script impact by executable consumer

- **Status:** accepted
- **Date:** 2026-08-31
- **Extends:** [0043](0043-impact-scope-pull-request-ci.md) and
  [0052](0052-impact-scope-every-pull-request.md)
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7)

## Context

The impact map assigned every path under `scripts/` to the full gate. That was
safe while script dependencies were unclassified, but it also meant a focused
reader regression test ran every workstation shard. Directory ownership was
standing in for the executable consumer.

The current browser reader regression's only project-local import is the
shared Chromium CDP helper, and the test runs in `test:site`. The checked PDF
semantic baseline is read by the release test suite, which verifies its closed
shape and exact PDF, manifest and book-source identities. The standalone
Poppler capture remains a separate review tool until the locked PDF-tools image
owns that environment.

## Decision

1. Remove the recursive `scripts/**` full-gate mapping. Map a script narrowly
   only when its complete current CI consumer is known.
2. Select `site` for `scripts/mermaid-browser.test.mjs` and `release` for
   `scripts/book-pdf-semantic-baseline.json`.
3. Keep shared policy, runtime, workstation, renderer and trust-boundary
   scripts as explicit full-gate paths. Renderer-affecting paths retain the
   independent renderer-reproducibility signal.
4. Do not add a fallback script rule. A script omitted from the explicit map
   is an unmapped path and therefore expands to full CI. New files cannot
   acquire a narrow lane merely by matching a directory prefix.
5. Keep mapping, planner, strict-JSON and CI-workflow changes inside the
   selector-authority boundary, so this decision's own pull request runs the
   full gate.

## Consequences

- A reader-only change to the browser regression runs the common checks and
  site lane instead of unrelated workstation shards.
- A semantic-baseline-only change runs the release tests that parse the
  baseline and bind it to the tracked publication artifacts. It does not claim
  that a fresh Poppler audit or PDF/UA conformance check ran.
- Unknown and newly added scripts remain safe by costing full CI. Further lane
  reductions require another exact dependency and consumer audit plus an
  executable representative mapping test.
- `main`, manual and tagged-release validation remain complete. Issue #7 stays
  open for its separate full-gate wall-time target.

## Supersession

Supersede this record if CI derives script dependencies mechanically from one
validated authority, if a merge queue replaces path-scoped pull-request
validation, or if the fail-closed rule for unmapped paths changes.

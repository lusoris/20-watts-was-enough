# 0043 — Impact-scope pull-request CI

- **Status:** accepted
- **Date:** 2026-08-30
- **Partly supersedes:** the CI aggregate-gate sentence in [0036](0036-use-one-source-to-publication-and-feedback-graph.md); tagged release verification is unchanged

## Context

The aggregate repository gate remains the release and `main` floor, but its
workstation suite dominates pull-request feedback. Running every unrelated
fixture for an app, prose or isolated tooling edit delays falsification without
adding evidence about the changed boundary.

Selective CI can also hide a dependency when its path map is incomplete. The
selector and its mapping therefore become authority-bearing code: ambiguity
must expand to the full gate, not silently omit work. This phase does not
provide a full ready-pull-request gate or the planned workstation sharding.

## Decision

1. For pull requests, derive one bounded plan from the exact base and head
   commits in Go. Project only fixed, allowlisted lane identities into workflow
   outputs.
2. Run the common policy, runtime, code-shape, prose, type and lint gate for
   every impact plan, then run the mapped Go, release, research, site,
   container and per-artifact workstation lanes.
3. Fall back to `npm run check` for selector or mapping changes, shared
   authority, unknown or invalid paths, missing revisions, empty or excessive
   change sets, unavailable Git diffs, and every rename, deletion or type
   change.
4. Keep workstation artifact commands allowlisted and cap their matrix at four
   concurrent jobs. A validated `CI success` job must reject a selected lane
   that did not succeed and an unselected lane that did not skip.
5. Pushes to `main` and manual CI runs continue to execute the aggregate
   repository gate. Tagged release verification keeps its separate full
   exact-tag gate. Impact CI is not evidence that the aggregate gate passed.
6. Keep `npm run check` as the authoritative local merge floor. Do not close
   issue #7 until the remaining Fixture 026/029 sharding, ready-PR/full-gate
   decision and measured full-gate wall-time target are resolved.

## Consequences

- Ordinary pull-request updates pay for the boundaries they can affect, while
  ambiguous changes expand to the complete gate.
- Mapping omissions cost time by forcing full CI; they cannot produce a
  narrower successful plan.
- The selector's own pull request runs full, so a mapping change cannot
  validate itself through its new reduced plan.
- `main` still receives complete post-merge validation. Until a full ready-PR
  gate is adopted, maintainers must not treat selective GitHub checks as a
  substitute for the required aggregate pre-merge run.
- Issue #7 remains open: this decision adopts impact planning, not the
  unfinished sharding or 3–5 minute full-gate target.

## Supersession

Supersede this record if pull requests return to an unconditional aggregate
gate, a merge queue or ready-PR stage takes ownership of the full pre-merge
gate, or the path-to-lane authority and fail-closed rules change materially.

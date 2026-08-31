# 0052 — Impact-scope every pull request

- **Status:** accepted
- **Date:** 2026-08-31
- **Partly supersedes:** [0048](0048-gate-ready-pull-requests-with-the-full-ci-matrix.md),
  where pull-request readiness forced the full matrix
- **Extends:** [0043](0043-impact-scope-pull-request-ci.md)
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7)

## Context

The ready-pull-request matrix preserved the complete pre-merge gate, but
[run 33339407471](https://github.com/lusoris/20-watts-was-enough/actions/runs/33339407471)
took 9 minutes 16 seconds and
[run 33342736733](https://github.com/lusoris/20-watts-was-enough/actions/runs/33342736733)
took 8 minutes 26 seconds. Every mapped prose, site or isolated experiment
change paid for unrelated workstation artifacts merely because the pull
request was ready.

The Go planner already classifies exact base-to-head changes and expands every
unknown, non-additive or authority-changing diff to the full gate. The missing
step is to use that result for every pull-request code update. Pushes to
`main`, manual dispatches and exact-tag releases retain their complete gates.

## Decision

1. Every opened, synchronised or reopened pull request derives its plan from
   the exact base and head commits, regardless of draft state. Readiness-only
   transitions do not rerun an identical plan.
2. Keep the existing fail-closed expansion for selector and mapping changes,
   shared authority, unknown or invalid paths, missing revisions, empty or
   excessive change sets, unavailable Git diffs, renames, deletions, copies
   and type changes.
3. Pushes to `main` and manual dispatches remain full. The release workflow
   keeps its separate complete exact-tag validation before it publishes fresh
   evidence.
4. The required `CI success` job may accept impact mode only for a pull
   request. It must still reject every skipped selected lane, every executed
   unselected lane and every malformed selector.
5. Changes to the impact map, CI workflow, Go planner or strict JSON boundary
   select the full gate. This policy change therefore cannot validate itself
   through its narrower pull-request rule.
6. `npm run check` remains the local merge floor. Impact CI proves only that
   the mapped boundaries passed; it does not claim that the aggregate gate ran.

## Consequences

- A mapped site, prose or isolated fixture change no longer executes unrelated
  workstation shards before merge.
- Pull-request draft state no longer changes validation authority, so two
  state-only workflow triggers are removed.
- An incomplete path map costs time when a path is unknown and forces full CI.
  Logical dependency omissions remain a review risk, which is why shared
  sources and selector authorities stay full and representative mappings stay
  executable policy.
- Complete automated validation for an ordinary mapped change occurs after
  merge on `main`, unless a maintainer runs the manual full workflow first.
  Branch protection therefore does not by itself prove that the aggregate
  pre-merge gate ran.
- Issue #7 remains open for measured full-gate wall time; this decision changes
  when that gate runs, not its assertions, shards or authority.

## Supersession

Supersede this record if a merge queue restores a complete pre-merge integration
stage, pull requests return to an unconditional full gate, or the path-to-lane
authority and its fail-closed rules change materially.

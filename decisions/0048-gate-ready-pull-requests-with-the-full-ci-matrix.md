# 0048 — Gate ready pull requests with the full CI matrix

- **Status:** accepted
- **Date:** 2026-08-30
- **Partly supersedes:** [0043](0043-impact-scope-pull-request-ci.md), for pull-request promotion and GitHub-path classification
- **Extends:** [0044](0044-shard-workstation-ci-without-splitting-test-authority.md)

## Context

Impact planning shortens draft feedback, but it cannot be the final merge gate.
GitHub does not provide a merge queue for this repository, so pull-request
readiness must mark the point where the complete sharded matrix runs. Checking
only the `ready_for_review` action is insufficient: every later update to an
already-ready pull request must remain full.

The first impact map also grouped every `.github/` path into the full gate and
treated workstation manifests only as test selectors. The first rule made
routine issue-form maintenance unnecessarily expensive. The second omitted the
coverage, readiness and reader consumers that interpret manifest fields.

## Decision

1. A draft pull request derives an impact plan from its exact base and head
   commits. An opened or updated non-draft pull request forces the full plan.
   Moving a pull request between draft and ready states triggers a new run.
2. Pushes to `main` and manual CI dispatches remain full. Release tags retain
   the separate exact-tag workflow, which runs `npm run check` before creating
   fresh release evidence.
3. Every workstation manifest selects its artifact tests plus the research and
   site lanes that check coverage and readiness derivatives. Fixture 007 and
   Fixture 019 manifests also retain their container lane.
4. Dependency review runs on a pull request only when the plan is full or the
   dependency selector is set. Shared runtime and lock changes still force full;
   a bounded dependency-maintenance input may select the dependency lane during
   draft iteration.
5. `.github/` paths are explicit. Workflow, review-policy and selector
   authorities force full; issue forms and presentation metadata use the common
   gate; operational manifests select their owning lanes. An unlisted path
   remains unmapped and therefore falls back to full.
6. The required `CI success` job rejects a ready pull request without the full
   matrix, a selected dependency review that skipped, an unselected job that
   ran, and impact mode on a non-pull-request event.

## Consequences

- An app-only draft update can return without executing workstation fixtures.
  Marking that pull request ready exchanges the shorter loop for the complete
  pre-merge matrix.
- Manifest edits cannot change execution readiness or claim scope without the
  coverage and reader checks that consume those fields.
- Routine issue metadata no longer causes workstation execution merely because
  it lives under `.github/`; unknown automation remains fail-closed.
- The matrix wall-time remains an observation to record from GitHub runners,
  not a result established by this decision.

## Supersession

Supersede this record if a merge queue takes ownership of the full pre-merge
gate, pull-request readiness no longer marks integration intent, or a different
closed dependency and metadata selector replaces the current plan.

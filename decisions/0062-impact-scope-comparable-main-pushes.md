# 0062 — Impact-scope comparable main pushes

- **Status:** accepted
- **Date:** 2026-09-04
- **Partly supersedes:** [0043](0043-impact-scope-pull-request-ci.md),
  [0048](0048-gate-ready-pull-requests-with-the-full-ci-matrix.md) and
  [0052](0052-impact-scope-every-pull-request.md), for ordinary `main`-push
  planning and acceptance of impact mode outside pull requests
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7),
  [pull request #34](https://github.com/lusoris/20-watts-was-enough/pull/34)

## Context

The first impact-planning decisions kept every push to `main` on the complete
aggregate gate. That repeated unrelated workstation and publication work after
a mapped pull request had already passed its selected boundaries. Pull request
#34 changed the workflow and its policy tests so a push with an exact,
comparable before-and-after revision can use the same fail-closed plan.

This change does not meet issue #7's remaining wall-time target. The complete
[pull-request run 33888059128](https://github.com/lusoris/20-watts-was-enough/actions/runs/33888059128)
took 8 minutes 21 seconds; the PDF renderer and slowest Fixture 026 shard each
ran for more than 7 minutes. Reclassifying those jobs would hide the cost, not
reduce it.

## Decision

1. An opened, synchronised or reopened pull request derives its plan from its
   exact base and head commits. A push to `main` derives its plan from the event
   `before` and current commits only when both commits exist and `before` is an
   ancestor of the current commit.
2. Comparable `main` pushes use the same bounded Go planner, explicit path map
   and fail-closed expansion as pull requests. Unknown, non-additive, shared or
   selector-authority changes still select the full plan.
3. Missing, zero, invalid or non-ancestral push comparisons select the full
   plan. Manual dispatches remain full, and the separate exact-tag release
   workflow retains its complete validation and fresh-evidence boundary.
4. The required `CI success` job may accept impact mode only for pull requests
   and pushes. It still rejects every skipped selected lane, every executed
   unselected lane, malformed selectors and dependency review on a `main`
   push.
5. `npm run check` remains the local merge floor. A successful impact plan on a
   pull request or `main` does not claim that the aggregate gate ran and is not
   release or scientific evidence.

## Consequences

- Mapped changes do not repeat unrelated workstation shards after merge.
- A `main` push still expands to the complete gate when its comparison or path
  authority is uncertain; reducing required checks or remapping slow jobs is
  not an optimisation path.
- Issue #7's checked ready-pull-request and unconditional-`main` full-gate
  statements describe superseded scheduling. The genuinely incomplete item is
  the measured 3–5 minute full-gate target, which requires physical isolation
  or setup and renderer improvements without removing assertions.

## Supersession

Supersede this record if a merge queue restores a complete pre-merge
integration stage, ordinary `main` pushes return to the aggregate gate, or a
different comparison authority replaces the exact before-to-current plan.

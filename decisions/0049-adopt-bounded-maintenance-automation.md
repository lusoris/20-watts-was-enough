# 0049 — Adopt bounded maintenance automation

- **Status:** accepted
- **Date:** 2026-08-30
- **Related:** [0036](0036-use-one-source-to-publication-and-feedback-graph.md), [0046](0046-project-the-research-roadmap-into-github-milestones.md), [0048](0048-gate-ready-pull-requests-with-the-full-ci-matrix.md)

## Context

Dependency updates, CI selection, generated publications, GitHub metadata,
security drift and translation freshness recur. Handling them through unrelated
scripts or manual repair would duplicate authority and consume time needed for
research. One broad maintenance service would create a different problem: it
could hide permissions, partial failures and decisions that still require a
named reviewer.

The repository already has narrow authorities: committed manifests, Go
packages, validators, Renovate, pinned workflows and research ledgers. The
project also audited bounded patterns from pinned versions of
`obra/superpowers`, K-Dense AI's `scientific-agent-skills`, OpenAI skills,
Renovate and GitHub documentation. Those patterns are useful as design input;
their runtime machinery is not a repository dependency.

## Decision

1. Adopt the project-local
   [`maintenance-automation`](../.agents/skills/maintenance-automation/SKILL.md)
   contract for recurring dependency, CI, release, generation, GitHub-metadata,
   security-drift and translation-freshness work.
2. Admit automation only when the work recurs or has a deterministic freshness
   invariant, one committed source can own the desired state, success is
   machine-checkable, execution can be bounded and idempotent, and the saved
   work exceeds the added maintenance burden.
3. Reuse an existing authority before creating another command or workflow.
   Prefer a read-only check, then a deterministic plan, then the smallest
   explicit repair. Portable repository operations belong in bounded
   standard-library Go packages where practical; workflows schedule and
   authenticate them but do not reimplement them.
4. A remote repair must separate complete preflight, admitted mutation and
   readback; use least privilege; preserve unmanaged state; fail visibly on
   ambiguous partial state; and be safe to retry. Privileged code runs only
   from trusted `main` unless another accepted decision defines a narrower
   immutable source.
5. Maintenance automation may not judge or promote scientific claims, decide
   whether evidence supports an assertion, publish machine translation as
   reviewed, silence security or integrity findings, or make consequential
   external changes without their existing authority and maintainer approval.
6. Do not add PowerShell, host-specific wrappers, mutable skill imports or a
   general task runner around existing commands. External skill revisions are
   reviewed and pinned as prior art rather than fetched at runtime.
7. Every admitted automation records its trigger, bounds, permissions,
   evidence, failure route and removal condition. Focused changed-path checks
   precede the named integration or release boundary; a slow check is not made
   more frequent merely because it is slow.

## Consequences

- Repeated upkeep can become cheaper without creating a parallel source of
  truth or an automation path that can silently change research meaning.
- A new scheduled job, manifest or remote writer carries an explicit burden of
  proof; a painful one-off remains an issue until recurrence and ownership are
  clear.
- The skill is mandatory repository policy, so changes to its authority require
  a superseding decision and the ordinary policy, focused-test and aggregate
  verification gates.

## Supersession

Supersede this record if maintenance ownership moves to another declared
system, or if experience shows that its admission, permission or scientific
boundaries are too broad or too narrow.

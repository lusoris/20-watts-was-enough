# 0070 — Default the local workstation aggregate to four commands

- **Status:** accepted
- **Date:** 2026-09-05
- **Partly supersedes:** [0068](0068-run-workstation-tests-through-the-bounded-go-catalogue.md),
  clause 2's eight-command local default only
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7)

## Context

Decision 0068 made eight commands both the production default and the hard
validation ceiling for the local Go workstation aggregate. Its first scheduling
wave can place several process-heavy Fixture 026 shards beside one another. An
eight-way aggregate failed two exact shards at policy boundaries; both shards
passed unchanged when run alone. The failures exposed one deterministic
preflight-order defect as well as local resource contention. Increasing the
frozen policy VM deadlines or loosening the expected error would hide those
boundaries rather than repair the scheduler.

GitHub does not use the local Go scheduler for its workstation jobs. It runs the
same catalogue as separate matrix jobs, where the existing eight-job cap bounds
remote scheduling.

## Decision

1. Run `20w ci run-workstation` with four active commands by default. Retain
   eight as the hard validation ceiling; the public command exposes no
   concurrency override.
2. Keep the GitHub workstation matrix at eight concurrent jobs. This decision
   changes no workflow, catalogue entry, package script, test partition, seed,
   horizon or assertion.
3. Keep every isolated-policy regex and frozen VM deadline unchanged. The
   Fixture 026 runner instead rejects a missing arm commitment beside any
   evaluator-bearing raw, checkpoint, run or analysis state before invoking the
   policy bank.
4. Treat every aggregate and shard outcome as development validation with
   `NO_RESULT`. Issue 7 remains open until a complete live workflow meets its
   wall-time acceptance.

## Consequences

- Local validation leaves capacity for each bounded child process while still
  executing the complete core-plus-artifact catalogue.
- The local aggregate may take longer than an ideal eight-way schedule. A full
  four-way run remains required at the integration boundary; this decision does
  not claim its eventual duration.
- A one-millisecond hostile timeout now proves that evaluator state wins the
  failure order before policy execution can abstain. It creates neither a
  replacement commitment nor an abstention artifact.
- Remote CI retains its current eight-job scheduling behaviour.

## Supersession

Supersede this record if measured local runs justify a different default, the
hard ceiling changes, or a containerised runner replaces direct local execution
while preserving the closed test authority and `NO_RESULT` boundary.

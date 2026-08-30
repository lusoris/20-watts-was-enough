# 0044 — Shard workstation CI without splitting test authority

- **Status:** accepted
- **Date:** 2026-08-30
- **Partly supersedes:** [0043](0043-impact-scope-pull-request-ci.md), for the workstation matrix and full-plan execution shape only

## Context

The aggregate workstation command runs every test file in one Node process with
test concurrency fixed at one. Two Fixture 026 runner cases dominate the serial
wall time, while the remaining Fixture 026 and Fixture 029 tests form many
independent file-level contracts. Keeping all of them behind one serial command
makes CI wall time follow their sum even when the runner has capacity for
independent jobs.

Parallel execution can become a coverage bug if it selects test names, relies
on globs that change silently, or lets a full plan omit a shard. The split must
therefore preserve every existing assertion, seed, work horizon and authority
label. It changes scheduling only. The local aggregate remains the merge floor.

## Decision

1. Split the Fixture 026 RSD-T02 runner tests by file-level boundary: complete
   smoke, resume, ledger format and frozen inputs, ledger semantics, and
   pre-evaluator/output/lease boundaries. Split the Fixture 029 suite tests
   between execution/resume and integrity hostiles. Shared test support owns
   temporary-file and shared test mechanics; it does not select, weaken or
   replace assertions.
2. Register all split test files in each workstation manifest's `tests` and
   `full_tests` inventories. Keep `npm run check` and
   `npm run test:workstation` as the complete local serial gate.
3. Define six exact Fixture 026 shard scripts and two exact Fixture 029 shard
   scripts. Each names its files literally, disables test isolation and fixes
   in-job test concurrency at one. Repository policy rejects a missing,
   reordered or substituted shard command.
4. For full plans, run the non-workstation quality gate, workstation core, and
   all unchanged artifact jobs plus the eight shards. An impact plan for
   Fixture 026 expands to its six shards; Fixture 029 expands to its two;
   unrelated workstation artifacts retain one job each.
5. Cap the workstation matrix at eight concurrent jobs. The Go projection owns
   the closed matrix, and `CI success` rejects an absent full matrix, a skipped
   selected job, an unexpected job, or a malformed selector.
6. Treat five to seven minutes as the initial workstation-matrix planning
   expectation when eight runners are available. It is not a measured CI
   result or service-level guarantee. Queueing, cold dependency installation,
   runner contention and slower hardware can exceed it; the first merged runs
   must record the observed wall time before issue #7 can claim resolution.

## Consequences

- The longest Fixture 026 cases can run beside one another instead of adding
  their durations, while local aggregate validation still exercises the same
  test inventory in one command.
- Full CI no longer runs workstation tests inside `quality-full`; workstation
  core and the closed matrix carry that coverage as separately required jobs.
- Fixture 029 creates one clean suite base per test file. This repeats bounded
  setup work but prevents mutable temporary state crossing a shard boundary.
- A selector, workflow, package-script or policy change still expands its own
  pull request to full CI under decision 0043.
- The timing expectation remains unverified until GitHub records a complete
  run under the new matrix.

## Supersession

Supersede this record if workstation tests return to one serial CI process, a
different runner topology owns the full matrix, or measured runtimes require a
new shard inventory or concurrency bound.

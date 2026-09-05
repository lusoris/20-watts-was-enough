# 0068 — Run workstation tests through the bounded Go catalogue

- **Status:** accepted
- **Date:** 2026-09-05
- **Partly supersedes:** [0044](0044-shard-workstation-ci-without-splitting-test-authority.md),
  for the serial local aggregate in clause 2 only
- **Extends:** [0066](0066-create-longer-workstation-matrix-jobs-first.md)
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7)

## Context

The workstation test inventory has two execution descriptions. The Go impact
planner owns nineteen artifact identities and their creation order, while the
CI workflow repeats the identity-to-package-script mapping in a nineteen-arm
shell case. The complete local `test:workstation` command instead starts every
test file in one serial Node process. Adding or moving a shard therefore
requires coordinated edits to several command lists, and the local aggregate
cannot use the same bounded parallelism as CI.

The individual package scripts already preserve the file partitions,
`--test-concurrency` settings, assertions, seeds and horizons. Scheduling those
commands concurrently does not require another partition or a change to test
semantics. It does require explicit limits: a failed job must not hide later
failures, subprocess output cannot grow without bound, and cancellation must
stop active work rather than merely suppressing the final status.

## Decision

1. Store the core script and each artifact's lane, exact package-script identity
   and creation rank in one embedded, machine-readable Go catalogue. The
   projection emits validated `{artifact, script}` objects. CI consumes those
   objects through `matrix.include` and invokes the projected script as the
   quoted script argument to `npm run`; it does not maintain a second dispatch
   table.
2. Make `20w ci run-workstation` the complete local aggregate. It runs the core
   script and all nineteen creation-ordered artifact scripts with at most eight
   commands active. `package.json` remains the owner of each script body. One
   strict preflight read freezes every admitted script as its exact Node
   argument vector; execution does not reread mutable package metadata or run
   npm lifecycle hooks.
3. Invoke every command directly with `exec.CommandContext` and isolate its
   process tree through one absolute Node executable. Cancellation and
   post-wait cleanup kill the process group on Unix. On Windows, start the
   process suspended, attach it to a kill-on-close Job Object, then resume it;
   fail closed if the lifetime container cannot be established. Give each job
   at most 30 minutes, retain at most 2 MiB of its combined standard output and
   error, and allow at most two seconds for inherited pipes to close after the
   command ends or is cancelled. Crossing the output limit cancels and fails
   that job. Cleanup runs after every started job, including when the parent
   exits before a pipe-inheriting descendant.
4. Pass only a fixed set of runtime, path, locale, temporary-directory and
   colour variables. Reject duplicate retained names, values above 8 KiB, more
   than 32 retained entries or more than 64 KiB in total. Do not forward
   arbitrary npm, Node, GitHub or experiment variables from the caller.
5. Continue after ordinary job failures and report every result in catalogue
   order. Caller cancellation reaches active command contexts and marks work
   that has not started as cancelled; it does not start replacement jobs.
6. Keep `validate:workstation` immediately before the aggregate in the full
   package gate. Before starting a subprocess, the Go aggregate preflight
   strictly reads the catalogue, package scripts and workstation manifests. It
   proves that every discovered workstation test is covered exactly once and
   that every declared `full_tests` path is covered exactly once by its own
   artifact jobs. The scheduler changes execution mechanics only. A passing
   aggregate remains validation evidence, not a scientific result.

## Consequences

- CI and the local aggregate now share one closed artifact-to-script catalogue.
  Adding a job without a unique artifact, script and creation rank fails before
  execution.
- The aggregate no longer treats its package commands as an opaque proof. A
  catalogue, manifest or package-script omission, duplicate, empty pattern or
  stale path fails the exact preflight coverage check before tests start.
- Later package-file mutation cannot replace a frozen command, and npm
  `pretest:*` or `posttest:*` hooks are outside the admitted execution path.
- Local and tagged-release validation retain the complete core-plus-artifact
  inventory but no longer require one serial Node process. Concurrent access to
  a shared checkout can expose hidden test coupling; such a failure remains a
  failure to repair rather than a reason to drop coverage.
- A single failed shard no longer ends diagnosis at the first error. The final
  summary lists passes, failures and cancellations in a stable order and prints
  bounded captured output for incomplete jobs.
- Issue 7 remains open until a complete live workflow meets its wall-time
  acceptance. This scheduling change does not establish that result.

## Supersession

Supersede this record if the workstation inventory stops using package scripts,
measured resource contention requires another concurrency ceiling, or a
containerised runner replaces direct local execution while preserving the same
closed test authority.

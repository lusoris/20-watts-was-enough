# 0051 — Add a seventh Fixture 026 shard after live timing

- **Status:** accepted
- **Date:** 2026-08-31
- **Partly supersedes:** [0044](0044-shard-workstation-ci-without-splitting-test-authority.md), clauses 3 and 4 where they fix Fixture 026 at six shards
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7), [ready-PR run 33339407471](https://github.com/lusoris/20-watts-was-enough/actions/runs/33339407471)

## Context

The first complete ready-pull-request run under decision 0044 finished in 9
minutes 16 seconds. Fixture 026 shard 5 was the merge-path bottleneck at 8
minutes 4 seconds, including 7 minutes 32 seconds in its test step. The other
Fixture 026 jobs completed in 3 minutes 56 seconds to 5 minutes 11 seconds.
The six-shard layout therefore preserved authority but did not meet either the
initial three-to-five-minute issue target or the later five-to-seven-minute
planning range.

The shard-5 log separates one 221.725-second file from five files totalling
229.643 seconds. Moving only that file into another job is the smallest
file-level rebalance. Seven payload projections derived from the measured
per-file durations are 223.567, 285.597, 212.297, 278.164, 229.643, 275.289
and 221.725 seconds. The 285.597-second `rsd-t02-runner.test.mjs` file is
indivisible under the current file-level authority, so reassignment alone
cannot reduce the maximum payload below that duration.

## Decision

1. Define a seventh exact Fixture 026 shard containing only
   `rsd-t02-fixed-instance-isolated-durable-runner.test.mjs`. Remove that file
   from shard 5 and leave shard 5's other five files together.
2. Preserve every test file, assertion, seed, work horizon, manifest entry,
   result boundary, and in-job `--test-concurrency=1` setting. This decision
   changes scheduling only.
3. Expand full and Fixture 026 impact plans to all seven Fixture 026 shards.
   Extend the workflow's closed dispatch from seventeen to eighteen artifact
   scripts while retaining the eight-concurrent-job bound.
4. Treat the projected shard-5 and shard-7 job durations of about 4 minutes 22
   seconds and 4 minutes 14 seconds as planning estimates based on the observed
   setup and post-job overhead. Only a complete live run may establish the new
   wall time.
5. Keep issue #7 open after implementation. A strict five-minute total-job
   boundary still requires setup reduction or a physical split around the
   indivisible 285.597-second file, followed by another live measurement.

## Consequences

- The previous shard-5 test-step sum is replaced by two similarly sized jobs.
- Package scripts, workflow dispatch, Go projection and executable policy keep
  one exact shared inventory; an omitted, duplicated or substituted file fails
  validation.
- Workstation manifests and the complete local serial gate do not change.
- The matrix can contain nine shard scripts while running at most eight jobs at
  once; the concurrency bound describes capacity, not the number of artifacts.
- No scientific or benchmark result follows from this scheduling change.

## Supersession

Supersede this record if Fixture 026 changes its file authority, a physical
test split replaces the isolated file boundaries, or measured runner behaviour
requires another inventory or concurrency bound.

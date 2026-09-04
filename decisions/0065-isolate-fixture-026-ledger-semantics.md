# 0065 — Isolate Fixture 026 ledger semantics from shard 5

- **Status:** accepted
- **Date:** 2026-09-04
- **Partly supersedes:** [0051](0051-add-a-seventh-fixture-026-shard-after-live-timing.md), for the seven-shard inventory and shard-5 composition
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7), [full-plan run 33898396172](https://github.com/lusoris/20-watts-was-enough/actions/runs/33898396172), [full-plan run 33905667678](https://github.com/lusoris/20-watts-was-enough/actions/runs/33905667678), [first eight-shard run 33917765053](https://github.com/lusoris/20-watts-was-enough/actions/runs/33917765053)

## Context

Fixture 026 shard 5 remains a full-gate bottleneck. Its test step took 377.291
seconds in run 33898396172 and 404.686 seconds in run 33905667678. In those
same logs, the three tests in
`rsd-t02-runner-ledger-semantics.test.mjs` accounted for 162.455 and 171.663
seconds. The other four files accounted for 214.836 and 233.023 seconds.

Those files already define independent test authority. Moving the ledger
semantics file to its own static job reduces the observed payload of both jobs
below four minutes without changing a test body, assertion, seed, work horizon,
serial execution rule or result label. Runner setup and queueing still vary, so
these measurements predict the payload split rather than a future job duration.

The same full-plan runs also measured the separate PDF-renderer rebuild at more
than six minutes. This scheduling change therefore advances issue 7 but cannot
establish its repository-wide three-to-five-minute acceptance by itself.

The first eight-shard run completed shard 8 successfully, then exposed a
separate bound error in the full-quality lane. Its serial Mermaid browser test
reached the 150-second outer timeout after the preceding full-book browser
probe had taken 79 seconds. The test's tighter phase deadlines can consume more
than 150 seconds in aggregate on a cold runner, leaving no budget for navigation
and cleanup even though every phase remains bounded.

## Decision

1. Define `fixture-026-shard-8` as the exact
   `rsd-t02-runner-ledger-semantics.test.mjs` file. Remove that file from shard
   5 and retain shard 5's other four files in their existing order.
2. Expand full and Fixture 026 impact plans to all eight Fixture 026 shards.
   Extend the workflow's closed dispatch to nineteen artifact scripts while
   retaining the eight-concurrent-job bound.
3. Keep each shard at `--test-concurrency=1`. Keep the workstation manifests,
   complete local serial gate, test bodies, assertions, seeds, horizons and
   `NO_RESULT` authority unchanged. Executable policy continues to require
   every registered Fixture 026 and Fixture 029 test in exactly one shard.
4. Treat 162–172 seconds for shard 8 and 215–233 seconds for shard 5 as observed
   payload ranges, not a CI service-level guarantee. Only a complete live run
   can measure the new job and workflow durations.
5. Keep issue 7 open until a live full plan meets its acceptance. Investigate
   the PDF renderer and full-quality lanes separately rather than weakening or
   reclassifying them.
6. Give the Mermaid browser test a 240-second outer process budget. Retain its
   90-second initial-render deadline, 20-second navigation deadlines, 5-second
   reflow deadlines and deterministic browser cleanup. The larger outer bound
   fixes the contradiction between those existing phase bounds; it does not
   relax a content, accessibility or rendering assertion.

## Consequences

- Shard 5 no longer serialises two long independent file contracts.
- One extra ephemeral job repeats the bounded checkout and locked Node setup.
  The static allowlist, maximum matrix size and eight-job concurrency cap bound
  that cost.
- A missing, duplicated, reordered or substituted shard file still fails the
  deterministic package and workflow policy checks.
- A slow browser phase still fails at its own tighter deadline. The outer test
  can now report that failure and clean up instead of being cancelled first.
- No scientific or benchmark result follows from the scheduling change.

## Supersession

Supersede this record if Fixture 026 changes its file authority, measured live
runs show that the split does not reduce the merge-path bottleneck, or a new
runner topology replaces the bounded matrix.

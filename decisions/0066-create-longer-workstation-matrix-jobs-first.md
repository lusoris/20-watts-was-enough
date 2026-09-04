# 0066 — Create longer workstation matrix jobs first

- **Status:** accepted
- **Date:** 2026-09-04
- **Extends:** [0044](0044-shard-workstation-ci-without-splitting-test-authority.md),
  [0051](0051-add-a-seventh-fixture-026-shard-after-live-timing.md) and
  [0065](0065-isolate-fixture-026-ledger-semantics.md)
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7),
  [full-plan run 33919786157](https://github.com/lusoris/20-watts-was-enough/actions/runs/33919786157),
  [main full-plan run 33920538142](https://github.com/lusoris/20-watts-was-enough/actions/runs/33920538142),
  [GitHub matrix strategy](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstrategymatrix)

## Context

The Go CI projection emits nineteen workstation jobs into one GitHub Actions
matrix with `max-parallel: 8`. It previously sorted the job identities
alphabetically. That made eight short or medium jobs the first matrix entries
and delayed most of the longer Fixture 026 and Fixture 029 jobs until a slot
became available.

In completed full-plan run 33919786157, the first eight alphabetically ordered
jobs started at 21:10:35–21:10:36 UTC. Fixture 029 shard 2 started 261 seconds
later and completed last. The subsequent main full-plan run 33920538142
repeated the pattern: its first eight jobs started at 21:19:43–21:19:45, while
Fixture 029 shard 2 started 280 seconds after the first one and again completed
last. The creation ranks use the mean of these complete job wall times,
including checkout and locked setup:

| Creation rank | Job | PR run (seconds) | Main run (seconds) | Mean (seconds) |
| ---: | --- | ---: | ---: | ---: |
| 1 | Fixture 026 shard 6 | 313 | 308 | 310.5 |
| 2 | Fixture 026 shard 2 | 292 | 323 | 307.5 |
| 3 | Fixture 026 shard 4 | 291 | 313 | 302.0 |
| 4 | Fixture 026 shard 1 | 251 | 322 | 286.5 |
| 5 | Fixture 026 shard 3 | 226 | 311 | 268.5 |
| 6 | Fixture 026 shard 5 | 257 | 242 | 249.5 |
| 7 | Fixture 029 shard 2 | 235 | 231 | 233.0 |
| 8 | Fixture 029 shard 1 | 220 | 228 | 224.0 |
| 9 | Fixture 026 shard 8 | 189 | 205 | 197.0 |
| 10 | Candidate 010 | 153 | 170 | 161.5 |
| 11 | Fixture 026 shard 7 | 69 | 60 | 64.5 |
| 12 | Fixture 019 | 37 | 37 | 37.0 |
| 13 | Fixture 024 | 31 | 37 | 34.0 |
| 14 | Fixture 012 | 37 | 30 | 33.5 |
| 15 | Fixture 022 | 38 | 25 | 31.5 |
| 16 | Fixture 027 | 32 | 31 | 31.5 |
| 17 | Fixture 023 | 33 | 29 | 31.0 |
| 18 | Fixture 007 | 27 | 30 | 28.5 |
| 19 | Fixture 025 | 27 | 27 | 27.0 |

GitHub documents that matrix variable order determines job creation order, but
runner availability and execution duration remain external state. Assigning
the longer observed jobs first is therefore a bounded scheduling hint, not a
service-level guarantee.

Replaying the two runs' unchanged wall times through an ideal eight-slot
longest-first projection gives matrix makespans of 409 and 433 seconds. Their
observed spans from first matrix start to last completion were 496 and 511
seconds. The corresponding 87- and 78-second differences are projections only;
runner availability, changed test duration, the PDF renderer and the full-quality
lane can still determine the complete workflow time.

## Decision

1. Store one unique creation rank beside each workstation job in the existing
   Go lane definition. The lane definition remains the single owner of the job
   identity and its scheduling hint.
2. Emit selected workstation jobs in ascending creation rank. Reject invalid or
   repeated ranks, repeated or malformed job identities, and matrices above the
   existing 32-entry safety bound.
3. Preserve the exact nineteen job identities, their static package commands,
   the complete local workstation aggregate, fail-closed plan expansion and the
   workflow's eight-concurrent-job ceiling.
4. Treat the ranks as provisional operational data from the two named complete
   runs. A new job needs an explicit unique rank; repeated live measurements may
   justify a later reorder.
5. Keep issue 7 open. Only a complete live run of the revised projection can
   measure its effect, and no ordering change by itself establishes the
   remaining three-to-five-minute full-gate target.

## Consequences

- A full plan and a multi-artifact impact plan list their selected longer jobs
  first without adding runners, commands, tests or workflow privileges.
- Map iteration and input lane order cannot change the emitted matrix order.
- Every test, assertion, seed, horizon and result-authority boundary remains
  unchanged. This scheduling change produces no scientific result.
- A stale rank can reduce the scheduling benefit but cannot omit or bypass a
  job; the exact inventory and final success gate remain authoritative.

## Supersession

Supersede this record when repeated live timings justify another fixed order,
the workstation job inventory changes, or a different runner topology replaces
the bounded matrix.

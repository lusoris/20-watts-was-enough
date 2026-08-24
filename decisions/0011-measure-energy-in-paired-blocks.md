# Decision 0011 — Measure energy in paired blocks

**Status:** accepted
**Date:** 2026-08-24

## Context

Candidate 010's first external-energy contract attached one calibrated reading
to every opportunity–arm record. The nominal confirmation matrix contains 24
scenarios, seven arms, 10,000 opportunities per seed, and at least two seeds:

\[
24 \times 7 \times 10{,}000 \times 2 = 3{,}360{,}000
\]

work units. Treating every millisecond-scale work unit as a separately metered
interval would require millions of readings and review artifacts while asking
an ordinary wall or rail meter to resolve boundaries below its useful sampling,
clock, calibration, and quantization limits. Such records could be formally
well-shaped and still fail to measure the claimed quantity.

The initial confirmatory analyzer also grouped estimates by scenario and seed.
Scenarios and repeated meter blocks improve measurement precision, but they do
not create new independently randomized seeds. Counting them as independent
replicates would understate uncertainty.

## Decision

External energy for Candidate 010 will be acquired in deterministic,
counterbalanced measurement blocks rather than assigned to individual work
units.

1. Every arm in a paired block receives the same frozen ordered input batch.
2. Arm order is determined only from frozen identities and is rotated and
   reversed across repetitions; outcomes never select the order or stopping
   point.
3. Warm-up and before/after idle observations are recorded separately. Gross
   arm energy is the primary observation; background subtraction is never
   automatic.
4. Each block binds its ordered-input hash, arm, position, seed, scenario,
   source, runtime, hardware, meter, calibration, clock, and raw-log range.
5. A failed block invalidates its complete paired arm set under a frozen retry
   policy. Selective reruns after inspecting results are forbidden.
6. Meter acceptance thresholds are instrument-qualified inputs: sample count,
   duration relative to clock uncertainty, energy relative to resolution and
   expanded uncertainty, gaps, overlap, reset, rollover, and calibration
   validity are checked before analysis.
7. Gross energy and correct commits are summed across repetitions and scenarios
   inside each seed-arm; energy-per-correct-commit is then formed as that ratio
   of sums. Candidate–baseline contrasts are paired by seed. Statistical
   inference is across independent seeds; blocks and scenarios do not increase
   inferential degrees of freedom.
8. Final seed count comes from a frozen pilot-derived variance estimate,
   minimum relevant effect or noninferiority margin, familywise error rate, and
   power target. Two seeds are not a generic confirmatory sample size.
9. A resource preflight must refuse the run before reveal if projected records,
   blocks, bytes, files, wall time, meter capacity, or free-disk reserve exceed
   frozen limits.
10. Real confirmation and held-out seeds are not generated or revealed until
    the block analyzer, power plan, resource preflight, and meter workflow are
    frozen and have passed claim-ineligible development rehearsals.

Per-work-unit timing, byte, decision, and safety records remain available for
diagnostics. They may reference a measurement block, but they may not claim
individually measured joules.

## Consequences

- The current 6/9 structural readiness state does not advance merely because a
  block scheduler or seed escrow exists.
- Existing per-work-unit energy plumbing remains an implementation fixture and
  cannot support the resource-superiority gate for a real run.
- Development pilots determine feasible block duration and seed-level variance;
  they cannot be relabeled as confirmation.
- Repeated blocks improve the precision of a seed estimate but never inflate
  its sample size.
- Meter, hardware, thermal, power-plan, clock, and calibration identities become
  frozen experimental inputs rather than prose notes.
- Confirmation must be restarted with a new documented seed release if the
  analyzer, design, meter contract, or power plan changes after unblinding.

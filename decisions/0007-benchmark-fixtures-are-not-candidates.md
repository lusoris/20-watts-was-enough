# Decision 0007 — Benchmark fixtures are not architecture candidates

**Status:** accepted
**Date:** 2026-08-05

## Context

Some domain audits leave no distinct mechanism after deduplication but expose a
valuable combined failure regime. Forcing that residue into the candidate list
inflates the architecture; discarding it loses a test capable of rejecting
several existing candidates at once.

Music cognition provides the first concrete case. Shared-clock-free partner and
phrase co-adaptation combines local timing estimation, multiscale context,
repairable conventions, and capability transfer. Every component already has
an owner, yet their interaction under delay, role switching, novel motifs, and
partner turnover is a useful benchmark.

## Decision

Maintain cross-candidate benchmark fixtures under `experiments/fixtures/` with
stable `F-` identifiers.

A fixture:

1. owns a task generator, information boundary, strongest conventional
   baselines, equal-budget contract, measurements, perturbations, ablations,
   and rejection rules;
2. names the existing candidates or held states whose composition it tests;
3. introduces no architecture mechanism and receives no principle or candidate
   status from a positive result alone;
4. retains negative results so the same composition is not repeatedly proposed
   under new domain vocabulary; and
5. may be reused by multiple candidates without allowing them to count the same
   avoided work or performance gain more than once.

A mechanism discovered inside a fixture must enter the ordinary candidate
admission process with its own state transition, nulls, budget, and ablation.
The fixture ID is not promotion evidence.

## Consequences

- Domain-specific stress regimes remain usable after mechanism deduplication.
- Candidate count tracks architectural alternatives rather than every useful
  benchmark.
- Cross-candidate interactions receive explicit tests and shared telemetry.
- A passing fixture result can support a composition claim only within its
  measured boundary.
- Fixture retirement does not invalidate the source-domain evidence or the
  independently owned components.

# 0014 — Coarse state needs a closure contract

- **Status:** accepted
- **Date:** 2026-08-25

## Decision

Any reduced, aggregated, compressed, or low-dimensional state used for
prediction or control must state why it is sufficient for the requested
horizon and intervention. A representation is not treated as Markovian merely
because the implementation exposes no older state.

The contract records, as applicable:

1. the full state and the exact projection, compression, or restriction;
2. unresolved initial-condition, memory, noise, and model-form terms;
3. the support on which a slow or coarse evolution is valid;
4. lifting or reconstruction choices and sensitivity to those choices;
5. the healing, micro-simulation, averaging, synchronization, and escalation
   work needed to obtain a coarse update; and
6. the detector and fallback used when closure or timescale separation fails.

## Consequences

- Finite history, latent state, recurrence, augmented coordinates, local
  micro-solves, and full-resolution fallback are competing closure mechanisms;
  none is free.
- Fast/slow labels require a measured dynamical validity region. Update cadence
  or naming does not establish a slow manifold.
- A coarse runtime comparison charges microsteps, rejected solves, lifting,
  restriction, traffic, synchronization, and fallback as well as macro steps.
- Persistent dependence on hidden initial state or on the chosen lift is a
  failed closure test, not noise to average away.
- A successful synthetic closure test supports only its declared observables,
  horizon, interventions, and transfer envelope.

## Alternatives rejected

- treating every exposed state vector as automatically sufficient;
- selecting a memory horizon from confirmation outcomes;
- calling a model efficient after counting only coarse steps; and
- applying a reduced model through a detected validity-boundary failure.

# Decision 0015 — Qualify modules after interconnection

- **Status:** accepted
- **Date:** 2026-08-25

## Context

The repository already prefers bounded modules and typed interfaces. Those
properties constrain communication and authority, but they do not establish
that a component retains its isolated dynamics after a downstream client is
attached. Biochemical retroactivity provides several direct counterexamples;
ordinary digital systems add different causes such as slot pinning,
backpressure, shared mutable state, gradient paths, and shared-resource
contention.

## Decision

Treat interconnection as an experimental intervention. For every composition
claim that depends on reusable module behavior:

1. run the producer with identical input, initialization and random seed in an
   isolated and connected condition;
2. cross connection state independently from shared-resource load;
3. retain an immutable or otherwise nondestructive read as a negative control;
4. measure producer deviation and useful downstream service separately;
5. compare ordinary buffers, immutable messages, backpressure, admission,
   resource isolation, explicit control, stop-gradient paths and replication;
6. insert insulation only when material back-action survives those nulls; and
7. charge copying, buffering, staleness, latency, monitoring, reserve,
   maintenance and recovery before any efficiency conclusion.

Intentional feedback and useful connection-induced temporal shaping remain
eligible behaviors. An always-insulate policy is not the default.

## Consequences

- [Fixture F-027](../experiments/fixtures/027-interface-qualified-retroactivity-insulation.md)
  owns the paired causal and lifecycle test.
- [P-008](../research/principle-registry.md#p-008--compartmentalized-interaction)
  is refined; no new P-series principle or architecture candidate is created.
- A mature systems null that ties or wins retires the biomimetic translation
  while preserving the source claims and negative result.
- Operation counts and bytes can explain a result but cannot substitute for
  calibrated joules.

## Supersession

Supersede this record only if later evidence shows that connection
qualification is redundant with an existing repository contract across all
protected module states, services and physical boundaries.

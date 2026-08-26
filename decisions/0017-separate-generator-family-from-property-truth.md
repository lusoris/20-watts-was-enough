# Decision 0017 — Separate generator family from property truth

- **Status:** accepted
- **Date:** 2026-08-26

## Context

Synthetic generators are often organized into named families so a test grid is
easy to enumerate. Those names are not automatically mutually exclusive
scientific properties. In RSD-T01, for example, a static ratio map is also
exactly scale-symmetric, endpoint return can coexist with equal peak, and exact
trajectory symmetry does not identify whether a causal memory exists. Treating
the family name as one exclusive ground-truth class would reward recognition of
generator construction and obscure the properties the protocol is meant to
test.

A second circularity appears when an arm receives every value needed to
calculate an evaluator metric exactly. Accuracy on that metric can still test
implementation conformance and resource cost, but it cannot by itself show
that a representation learned or predicted the underlying property.

## Decision

For synthetic experiments whose generator families have overlapping
properties:

1. retain `generator_family` as provenance and, where useful, a secondary
   diagnostic rather than exclusive scientific truth;
2. define a separately evaluated, cross-cutting property vector with
   operational criteria that can be asserted after generation without
   consulting the family label; logical dependencies between coordinates must
   remain explicit;
3. distinguish system-level properties from per-cell predicates: freeze the
   complete aggregation grid and reducer, retain per-cell matrices, and never
   replace a worst-cell rule or abstention with an unstated mean;
4. report every property component and protected support state separately;
5. keep generator identity, parameters and property truth evaluator-only until
   all applicable arm responses are committed;
6. give comparable actionable arms the same raw causal observation packet and
   charge arm-internal feature construction;
7. label every directly computable exposed trace property as an
   algorithmic-conformance and cost endpoint. Any learned-prediction claim
   requires a separately registered information-withholding intervention; and
8. separate generator-side support membership from an arm's support-detection
   decision, which depends on the declared observation interface.

Structural properties such as causal memory are evaluator truth only when a
machine-readable equation, state contract, or identifying intervention supports
them. A finite trace alone may leave them unidentifiable, in which case the
property is `unassessed` or the arm must abstain.

Abstention remains visible in the primary denominator and is reported with
coverage. An evaluator oracle is not an actionable comparator and cannot enter
resource rankings.

## Consequences

- [RSD-T01](../experiments/fixtures/026-interface-qualified-relative-sensing.md#rsd-t01--full-trajectory-symmetry-versus-weaker-lookalikes)
  uses five balanced generator families but separately evaluates cross-cutting
  properties; five-way family identification is secondary.
- The F-026 public generator may validate grid construction and event plumbing,
  but its current two unequal-information diagnostics remain `NO_RESULT` and
  cannot establish arm superiority.
- Future fixtures must audit class exclusivity before registering a single-label
  endpoint.
- No new evidence claim or architecture principle is created by this decision.

## Supersession

Supersede this record only when a later protocol either proves its target
classes disjoint by construction and independent assertion, or registers a
different estimand whose interpretation does not depend on class exclusivity.

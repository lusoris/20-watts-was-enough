# 0021 — Bind population inference to system lineages and instances

- **Status:** accepted
- **Date:** 2026-08-27

## Context

Decision 0020 separates a procedural information cut from replication, but it
does not define the population to which an RSD-T02 comparison could apply. The
current five recipes are fixed public constructions. Their 64 seeds select only
opaque state-handle permutations, and the 35-projection packet combines O0
executions at three time constants with O1 executions at one time constant.
Neither a recipe, seed, episode nor row is therefore an independently sampled
fixed-parameter system instance.

The next design also needs an outer family boundary. Splitting individual
parameter draws while related equations, derivations or code siblings remain
on both sides would test interpolation within a known lineage and present it as
transfer to an unseen mechanism family.

## Decision

RSD-T02 uses this prospective hierarchy:

1. structural lineage or leakage group;
2. system family: one frozen equation template and declared parameter
   distribution;
3. independently drawn system instance: one accepted parameter vector;
4. fixed-parameter observation packet;
5. episode; and
6. optional noise or solver realization.

The system instance is the unit for a fixed-family estimand. A procedural seed
is only a domain-separated replay key. Rows, episodes, properties, solver
refinements and repeated realizations are nested measurements and cannot raise
the effective system-instance sample size.

Its machine identity is the canonical digest of family ID and version,
structural lineage, the complete parameter-vector digest, fixed time constant,
nuisance-vector digest and property-certificate-set digest. Partition,
procedural seed, packet, episode, realization and replay details are excluded.
Effective-unit accounting accepts only records bound to a validated manifest;
caller-authored aliases cannot manufacture another independent instance.

Every instance packet binds one complete parameter vector, including one time
constant, across every episode. The current mixed-time-constant packet remains
a construction-conformance artifact and cannot validate as a population
instance packet.

The first comparison-capable claim mode is a **fixed finite family panel**.
Structural lineages—not individual recipe names or parameter draws—are assigned
to visible development, sealed outer confirmation or separately sealed outer
transfer. Full-panel-equivalent and code-sibling families share the same
lineage partition. Equal-family weights are primary, so additional instances
inside one family do not make that family dominate. Results apply only to the
prospectively frozen panel. A superpopulation claim requires a later frozen
probabilistic family grammar and family- or lineage-level power.

The four fixed endpoint-by-comparator hypotheses share one experiment-level
Holm procedure at $\alpha=0.05$. Causal memory is not primary-scorable until
both truth values have prospective coverage from multiple structural lineages.
Outer templates, parameters and truth remain encrypted or evaluator-custodied
until the model, calibration, thresholds, analyzer, resource caps and power
plan are frozen.

## Consequences

- Population manifests must reject `seed` as an instance identifier.
- Reordering a family registry, changing a lineage assignment, mutating a
  parameter distribution or mixing parameters within one packet changes the
  bound identity and fails closed.
- Arm comparisons are paired on byte-identical packets from the same instance.
- Coordinates and repeated measurements aggregate inside an instance before
  instance contrasts aggregate to family means.
- Pre-response generation rejection is allowed only for frozen objective
  support and numerical-validity gates, is capped and logged, and cannot occur
  after arm output exists.
- A small public hash commits an outer family payload but does not hide a
  guessable family catalogue; secrecy requires authenticated encryption or
  independent evaluator custody.
- The current Stage-3 split remains an information-control artifact and is not
  reinterpreted as population evidence.

## Supersession

Supersede this record only prospectively, before affected responses, with a
population design that declares its target population, independent unit,
leakage groups, assignment, power, multiplicity, custody and replacement rules
at least as explicitly.

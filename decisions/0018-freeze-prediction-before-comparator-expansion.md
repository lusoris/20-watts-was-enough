# Decision 0018 — Freeze prediction before comparator expansion

- **Status:** accepted
- **Date:** 2026-08-26

## Context

RSD-T01 currently exposes complete trajectories from which its registered
symmetry discrepancies can be calculated directly. Those endpoints can test
algorithmic conformance, numerical behavior and resource cost. They cannot,
without a precommitted restriction on available information, support a claim
that an arm predicted an unobserved property or generalized beyond the exposed
trace.

Expanding the comparator set before freezing that information boundary would
make later choices about withheld observations, scales or interventions depend
on observed arm behavior. It would also leave important system-level details
underspecified: one initialization currently need not encounter multiple scale
cells; family labels can be mistaken for property truth; and malformed packet
sentinels can be confused with scientifically valid hostile worlds.

## Decision

Before any RSD-T01 predictive comparison is implemented or interpreted:

1. register a prospective information cut that states exactly which prefix,
   scale cell, intervention or other observation is available to each arm and
   which target information remains evaluator-only;
2. retain the current fully exposed RSD-T01 endpoint only as a conformance and
   resource-cost endpoint;
3. give each registered initialization multiple scale cells, with development
   and prospective roles fixed before comparator outcomes are inspected;
4. evaluate system-level symmetry by the registered worst-cell reducer across
   the complete history-by-scale grid for one bound initialization, while
   retaining the cell matrix; the v1 foundation freezes dimensionless exact
   tolerance $10^{-12}$ and approximate ceiling $0.06$ rather than accepting
   thresholds from the caller;
5. represent scientifically valid hostile worlds as valid cases with explicit
   support membership across input-domain, transformation, instrument,
   initialization, causal-observation, and evaluation-window axes plus expected
   behavior, separately from malformed sentinels that test parser or contract
   rejection;
6. treat `generator_family` and its recipe as provenance only, never as an
   exclusive property label or a shortcut to evaluator truth; and
7. keep missing, rejected and abstained cells visible rather than silently
   dropping them from the reducer or denominator.

The frozen actionable-arm registry contains exactly eight arms:

1. `A-RAW`;
2. `B-STATIC-DIV`;
3. `B-STREAM`;
4. `B-LOG-RATIO`;
5. `B-DIFFERENCE`;
6. `B-STATE-SPACE`;
7. `B-RECURRENT`; and
8. `C-DUAL`.

`O-STATISTIC` is evaluator-only. It may check scoring and attainable
statistics, but it is not an actionable arm and must not enter parity claims,
comparative rankings or resource rankings.

All v1 scale roles remain machine-labelled `public-development`; the
prospective cell is an `unregistered-candidate`, not a private partition or an
active information cut. Until the cut and comparator implementations exist,
all eight actionable roles have current parity and ranking eligibility set to
false.

This record freezes a protocol boundary and registry only. The generator and
its recipes retain provenance authority but have no result authority. Neither
this decision nor a generator-only run creates evidence for predictive
superiority, architecture benefit or energy advantage.

## Consequences

- Comparator implementations remain blocked until the prospective information
  cut and its evaluator contract are registered.
- The scientific-grid contract must distinguish valid hostile cases from
  malformed inputs and must expose multiple scale cells per initialization.
- Primary system classification uses the registered worst-cell aggregate;
  means and selected-cell summaries can be diagnostics only. Mixed
  initialization IDs, missing cells, rejected cells, explicit cell abstentions,
  or duplicate cells force a system abstention.
- Documentation and manifests must describe the registry as eight actionable
  arms plus one evaluator-only oracle, never as a seven-arm or nine-arm
  comparison.
- Existing public-development generator runs remain useful for construction,
  determinism and conformance checks, but remain `NO_RESULT` for scientific
  comparison.
- No evidence claim or architecture principle is created by this decision.

## Supersession

Supersede this record only with a prospective protocol amendment that defines
the replacement information cut, grid reducer, arm registry and oracle role
before any affected comparator output is inspected.

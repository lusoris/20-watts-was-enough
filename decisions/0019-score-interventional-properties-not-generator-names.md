# 0019 — Score interventional properties, not generator names

- **Status:** accepted
- **Date:** 2026-08-26

## Context

RSD-T02 asks whether causal mechanisms that have been tuned to similar step
responses can be separated by richer interventions. Its original endpoint was
phrased as mechanism-family identification. That wording is unsafe as a test
contract: two equation families can share the same relevant causal property,
and two different parameterizations of one family can cease to be
distinguishable through the registered observation interface. A generator label
therefore records how a synthetic world was made; it does not by itself define
what an actionable arm can identify.

The same problem already occurred in RSD-T01, where overlapping generator
families could not serve as exclusive scale-symmetry classes. RSD-T02 adds a
second complication: identifiability changes when the observation map,
initialization, input history or intervention menu changes. A correct answer can
therefore be a singleton property assignment, a non-singleton equivalence set,
or abstention.

## Decision

RSD-T02 must evaluate separately certified structural and interventional
properties. Generator-family identity remains evaluator-side provenance and may
be reported only as a secondary synthetic diagnostic.

For every initialized world and registered intervention panel, the evaluator
must expose after response freeze:

1. a property vector whose coordinates have explicit equation- or
   intervention-based truth certificates;
2. the observational equivalence set induced by the frozen input histories,
   intervention ports, observation map, sampling grid and numerical tolerance;
3. whether each property is identifiable, nonidentifiable or unresolved under
   that interface;
4. the provenance of every certificate and any numerical approximation used to
   construct it; and
5. the complete intervention-acquisition vector rather than an invented scalar
   cost.

An actionable arm predicts each registered property and may abstain. It is not
penalized for refusing to choose between worlds that the evaluator certifies as
observationally equivalent. It is penalized for guessing a hidden generator
label, for claiming a singleton where the registered interface leaves a
non-singleton equivalence set, or for abstaining when the frozen evidence
identifies the property inside the acceptance margin.

The graph/equation oracle is evaluator-only. It receives no parity, tuning,
promotion, resource-ranking or comparison role. All actionable arms receive
the same causal observation and intervention transcript; family labels,
equations, hidden states, future samples, evaluator properties and equivalence
certificates remain behind the firewall until responses freeze.

The fast/slow approximation question is a separate numerical estimand. Its
truth comes from the declared full and approximate equations on a finite frozen
grid. A generator name, visually collapsing traces, or extrapolation from a few
ratios cannot establish a nonzero limiting floor.

The first machine-readable RSD-T02 tranche is a public-development contract
foundation only. It must retain `NO_RESULT`, disable comparison authority and
leave every actionable arm ineligible until equations, parameter domains,
matched-step certificates, intervention panels, observation cuts, algorithms,
resource parity, confirmation material and statistics are implemented.

## Consequences

- The fixture text must replace family classification as the primary
  scientific endpoint with property decisions plus calibrated abstention.
- A secondary provenance-equivalence score may test synthetic bookkeeping, but
  it cannot support a natural-mechanism claim.
- Identifiability is always qualified by initialization, input, intervention,
  observation and evaluation window; it is not a permanent label attached to a
  model name.
- Intervention panels must be nested and their acquisition dimensions retained
  separately so later work can find the smallest sufficient panel without
  hiding trade-offs in one weighted score.
- Missing, duplicate, rejected or mixed-initialization transcripts force
  abstention and stay in the denominator.
- Any later active-experiment selector needs its own prospective information
  cut and cannot choose interventions after seeing evaluator-only outputs.

## Supersession

Supersede this record only with a prospective amendment that defines a
replacement property ontology, equivalence relation, oracle boundary,
abstention rule and intervention-cost representation before affected comparator
outputs are inspected.

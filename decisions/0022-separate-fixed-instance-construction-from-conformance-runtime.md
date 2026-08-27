# 0022 — Separate fixed-instance construction from the conformance runtime

- **Status:** accepted
- **Date:** 2026-08-27

## Context

Decision 0021 defines a system instance as one accepted complete parameter
vector held fixed across its observation packet. The existing RSD-T02 runtime
cannot satisfy that definition: its nine `O0-MATCHED-STEP` projections cross
$\tau_*=0.5,1,2\,\mathrm s$, while its 26 `O1-FULL-PANEL` projections use
$\tau_*=1\,\mathrm s$. Its policies, packet hashes, row counts and resource
declarations are all bound to that 35-projection construction layout.

Relabelling those projections as one population instance would mix three
systems. Replacing the packet in place would silently change the already
validated construction-conformance protocol and every policy cost contract.

The current `B-STATE-SPACE` and `B-RECURRENT` executables also remain fixed
construction references. Their names describe intended future comparator
families; they are not trained state-space and GRU estimators and they emit no
calibrated probabilities.

## Decision

Add a separate public-development fixed-instance construction layer:

1. the registry names exactly the five current public equation families,
   their structural lineages, full-panel equivalence groups, complete equation
   certificates, hashed equation templates, exact fixed parameters and one
   declared parameter distribution;
2. the generator samples only an integer time constant in microseconds using
   domain-separated HMAC-SHA-256 and rejection-before-modulo;
3. the complete parameter vector stores exact rational values and enters the
   canonical system-instance identity;
4. one metadata packet lists the 26 unique full-panel episodes with the same
   parameter digest and time constant on every episode, while a protocol hash
   binds every schedule plus horizon, integration step, output rate, input
   bounds, units and interpreter semantics;
5. draw indices and HMAC attempts are replay metadata, not inferential units;
6. coverage counts distinct structural lineages after full-panel equivalence
   collapse; and
7. the scientific family-registry projection excludes coverage, custody,
   packet and authority metadata, while the full registry, population design
   and model source remain separate provenance bindings;
8. generated instance and panel structures have one closed JSON Schema; and
9. no generated packet is sent to the current policy bank until a new
   parameterized transcript, policy and resource contract exists.

The public plan freezes four conformance draw indices per family. Its 20
artifacts validate generation and identity only; they are not a sample-size or
power decision.

Generic-null maturity uses six explicit states from fixed conformance reference
through confirmation evaluation. Only a level-5
`confirmation-frozen-mature-null` satisfies the population gate. Both current
generic references remain level 1.

## Consequences

- The old 35-projection runtime remains reproducible and retains its narrow
  construction-conformance authority.
- The new 26-episode packets are metadata-only until a parameterized runner
  exists.
- Any registry mutation changes its canonical provenance digest. Only mutation
  of the ordered scientific family projection changes its scientific registry
  digest, parameter document and instance identity.
- Episode-protocol mutation changes the packet identity without changing the
  fixed system identity.
- Two draws with identical scientific content collapse to the same canonical
  instance identity and effective increment zero.
- Additional parameter draws cannot repair a missing structural lineage.
- The current registry fails the floor for log-fold, feedback-present,
  channel-local-present and memory-negative values.
- Affected null fitting cannot start until primary lineage coverage is complete,
  outer-family templates are assigned and sealed, the parameterized transcript/
  policy/resource runner is validated, and an instance-level fit/calibration/
  development-evaluation split exists.
- Current conformance operation counts cannot be reused as training, elapsed-
  time, memory or energy measurements.

## Supersession

Supersede this record only with a versioned packet and runner migration that
keeps one complete parameter vector per system instance, preserves the old
construction protocol's provenance, validates every arm and resource counter
against the replacement packet, and freezes outer-family custody before any
affected fitting response.

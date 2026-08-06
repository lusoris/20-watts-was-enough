# Test coverage

This report is generated from the central claim ledger and the experiment
documents. It distinguishes a written protocol from runnable software. Re-run
`npm run audit:tests` after changing claim links or experiment contracts.

## Current answer

The four rows below are mutually exclusive highest-reached tiers.

| Highest coverage tier | Claims | Share of 1202 | Meaning |
| --- | ---: | ---: | --- |
| ledger-only | 128 | 10.6% | no exact direct relation to a numbered experiment artifact |
| linked test description | 546 | 45.4% | related experiment prose exists, but at least one required protocol facet is absent |
| protocol-complete test contract | 528 | 43.9% | at least one linked artifact contains all eight required facets |
| workstation-executable | 0 | 0.0% | checked execution manifest and runnable scientific harness exist |

The short answer is therefore **528 claims have a complete
test description, but 0 are executable on the workstation**.
Across both description tiers, 1074 claims have an exact direct
relation to at least one experiment artifact. These are aggregate candidate
tests: they evaluate engineering translations supported by several claims; they
do not independently reproduce every source paper.

## What “complete test description” means

A protocol passes only when the document contains all of the following:

- question or hypothesis;
- system, scenario, or task family;
- arms, baselines, or strongest nulls;
- matched budget and cost boundary;
- measurements and units;
- ablations;
- analysis or statistical plan;
- rejection, kill, or retirement rule;

The gate scans explicit H2/H3 sections. Cost reporting alone does not satisfy
resource parity, and a statistical null is not a confirmatory analysis plan.
This is a structural completeness gate, not proof that the design is correct.
A workstation-ready test additionally needs a machine-readable manifest naming
the command, environment, hardware assumptions, seeds, data, and outputs.

## Traceability method

A relation exists when either side states it exactly:

1. a claim block links a numbered candidate or fixture; or
2. an artifact links an exact claim label to the matching claim anchor.

Inclusive ranges are expanded only when both endpoints have exact matching
links. Prose numbers and indirect adoption-matrix associations do not count.
The union yields 1074 linked claims: 867
appear on the claim side, 590 on the document side, and
309 have at least one reciprocal same-artifact relation.

## Artifact coverage

There are 31 experiment artifacts: 15
pass the written-protocol gate, and 0 pass the
execution gate.

| Artifact | Directly related claims | Protocol status | Execution status |
| --- | ---: | --- | --- |
| [candidate-001](candidates/001-adaptive-topology.md) | 66 | complete description | not executable |
| [candidate-002](candidates/002-multiscale-context-broadcast.md) | 89 | complete description | not executable |
| [candidate-003](candidates/003-recovery-dynamics-fragility.md) | 40 | complete description | not executable |
| [candidate-004](candidates/004-closed-endogenous-curriculum.md) | 98 | complete description | not executable |
| [candidate-005](candidates/005-severity-ordered-containment.md) | 107 | incomplete: analysis | not executable |
| [candidate-006](candidates/006-reversible-physical-skill.md) | 147 | incomplete: comparators, budget, analysis | not executable |
| [candidate-007](candidates/007-endogenous-observation-surveillance.md) | 106 | incomplete: analysis | not executable |
| [candidate-008](candidates/008-contestable-modular-allocation.md) | 18 | incomplete: budget, analysis | not executable |
| [candidate-009](candidates/009-graded-assurance-envelopes.md) | 208 | incomplete: budget, measurements, analysis | not executable |
| [candidate-010](candidates/010-reset-coupled-staged-verification.md) | 73 | incomplete: analysis | not executable |
| [candidate-011](candidates/011-dual-loop-operational-assurance.md) | 100 | incomplete: analysis | not executable |
| [candidate-012](candidates/012-latency-qualified-authority.md) | 198 | incomplete: analysis | not executable |
| [candidate-013](candidates/013-deficit-capability-routing.md) | 73 | incomplete: analysis | not executable |
| [candidate-014](candidates/014-versioned-observation-contract.md) | 450 | incomplete: analysis | not executable |
| [candidate-015](candidates/015-versioned-repairable-conventions.md) | 55 | incomplete: measurements, analysis | not executable |
| [candidate-016](candidates/016-conflict-bounded-unit-transition.md) | 28 | incomplete: budget, measurements, analysis | not executable |
| [candidate-017](candidates/017-contract-preserving-semantic-compaction.md) | 78 | incomplete: budget, measurements, analysis | not executable |
| [candidate-018](candidates/018-value-reconstructability-aware-tiering.md) | 83 | incomplete: budget, measurements, analysis | not executable |
| [candidate-019](candidates/019-audited-cumulative-inheritance.md) | 110 | incomplete: budget, measurements, analysis | not executable |
| [candidate-020](candidates/020-constitutional-control-plane.md) | 85 | incomplete: budget, analysis | not executable |
| [fixture-001](fixtures/001-shared-clock-free-coadaptation.md) | 1 | complete description | not executable |
| [fixture-002](fixtures/002-versioned-reconstructive-design.md) | 19 | complete description | not executable |
| [fixture-003](fixtures/003-opportunity-history-qualified-action.md) | 0 | complete description | not executable |
| [fixture-004](fixtures/004-versioned-proof-discovery.md) | 20 | complete description | not executable |
| [fixture-005](fixtures/005-regime-qualified-flow-inference-control.md) | 45 | complete description | not executable |
| [fixture-006](fixtures/006-representative-adaptive-performance.md) | 44 | complete description | not executable |
| [fixture-007](fixtures/007-operator-qualified-optical-inference.md) | 32 | complete description | not executable |
| [fixture-008](fixtures/008-mission-profile-qualified-device-reliability.md) | 52 | complete description | not executable |
| [fixture-009](fixtures/009-operator-qualified-active-acoustic-inference.md) | 46 | complete description | not executable |
| [fixture-010](fixtures/010-boundary-qualified-physical-computation.md) | 52 | complete description | not executable |
| [fixture-011](fixtures/011-operator-qualified-active-chemical-sensing.md) | 52 | complete description | not executable |

## Immediate gaps

- 128 claims remain ledger-only. The machine report retains their
  exact IDs and evidence status.
- 546 claims reach only a partial description.
  The missing facets are concentrated in `candidate-005` (analysis), `candidate-006` (comparators, budget, analysis), `candidate-007` (analysis), `candidate-008` (budget, analysis), `candidate-009` (budget, measurements, analysis), `candidate-010` (analysis), `candidate-011` (analysis), `candidate-012` (analysis), `candidate-013` (analysis), `candidate-014` (analysis), `candidate-015` (measurements, analysis), `candidate-016` (budget, measurements, analysis), `candidate-017` (budget, measurements, analysis), `candidate-018` (budget, measurements, analysis), `candidate-019` (budget, measurements, analysis), `candidate-020` (budget, analysis).
- No execution manifests, runners, frozen environments, seed packs, or raw-output
  schemas exist yet. The [workstation contract](workstation/README.md) defines
  the next layer without pretending that prose is runnable.

## Machine-readable report

[`test-coverage.json`](test-coverage.json) contains every claim-to-artifact
mapping, the per-artifact facet result, and execution readiness.

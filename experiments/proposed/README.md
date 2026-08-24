# Experiment-family provenance

These entries preserve the design provenance of experiment families that began
as unresolved engineering hypotheses. Every family on this page has now been
promoted to a numbered fixture and no longer counts as a disposition backlog
item. Promotion records a complete written falsification contract, not an
empirical result or execution-ready implementation. Generator, hardware,
release, metering, and independent-reproduction gates remain those stated by
each fixture.

## `proposed:sensorimotor-grounding-transfer`

- **Promotion state:** promoted on 2026-08-24 to
  [Fixture F-015](../fixtures/015-sensorimotor-grounding-transfer.md). This entry
  remains as design provenance and is no longer an unnumbered backlog item.
- **Claims:** [C-007](../../research/claims.md#c-007).
- **Unresolved question:** Does temporally aligned perception, action, and
  outcome training improve intervention-sensitive physical transfer beyond
  comparable text-centric and passive multimodal training?
- **Why current artifacts are insufficient:** [Fixture F-003](../fixtures/003-opportunity-history-qualified-action.md)
  controls sensing, action opportunity, body, and history after a system
  exists. [Candidate 004](../candidates/004-closed-endogenous-curriculum.md)
  tests proposal and intervention selection. Neither isolates the training-data
  contrast asserted by C-007.
- **Minimum decisive design:** Compare aligned sensorimotor training with
  text-centric training, passive multimodal training, time-shuffled alignment,
  action-shuffled alignment, and outcome-shuffled alignment. Equalize model
  capacity, source-information budget, training tokens or events, optimization
  updates, tuning, interaction access, memory, wall time, and lifecycle energy.
  Report held-out intervention and counterfactual transfer, prediction and task
  quality, calibration, negative transfer, protected failures, adaptation
  events, latency, bytes, and joules across changed objects, dynamics, bodies,
  and environments.
- **Original promotion condition:** Draft a numbered protocol only after two materially
  different task families and a frozen generator can distinguish temporal
  alignment from extra data or interaction. The aligned arm must improve a
  preregistered transfer--risk--cost frontier over the strongest passive arm,
  and the targeted shuffles must remove the claimed gain.

## `proposed:continual-memory-lifecycle`

- **Promotion state:** promoted on 2026-08-24 to
  [Fixture F-014](../fixtures/014-continual-memory-lifecycle.md). This entry
  remains as design provenance and is no longer an unnumbered backlog item.
- **Claims:** [C-008](../../research/claims.md#c-008) and
  [C-010](../../research/claims.md#c-010).
- **Unresolved question:** Does rapid episodic acquisition followed by slow,
  validated integration reduce destructive interference, and does selective
  offline replay improve that lifecycle after retention, privacy, and compute
  costs are charged?
- **Why current artifacts are insufficient:** [Candidate 004](../candidates/004-closed-endogenous-curriculum.md)
  and [Candidate 019](../candidates/019-audited-cumulative-inheritance.md) use
  memory and replay inside larger loops or as nulls. They do not isolate a
  fast/slow memory boundary, promotion gate, or replay scheduler on one
  continual stream.
- **Minimum decisive design:** Compare a single plastic store, parameter
  regularization, adapters, retrieval-only memory, uniform replay, strong
  loss/recency/interference-prioritized replay, a two-tier memory without
  replay, and the complete two-tier selective-replay system. Equalize stream
  order, examples, parameters, writable and external bytes, updates, replay
  events, optimizer trials, evaluator access, wall time, privacy exposure
  budget, and lifecycle energy. Report immediate acquisition, delayed
  retention, forward and backward transfer, rare and safety-critical memory,
  calibration, duplicate or stale replay, privacy leakage, interference,
  recovery, bytes, latency, and joules.
- **Original promotion condition:** A numbered contract requires at least two continual
  streams with different recurrence and interference structure, frozen
  protected slices, and independent retention horizons. The complete system
  must improve the retention--adaptation--risk--energy frontier over the best
  regularization, retrieval, and replay nulls; fast/slow separation and replay
  selection must each earn causal credit in ablations.

## `proposed:low-bit-model-hardware-crossover`

- **Promotion state:** promoted on 2026-08-24 to
  [Fixture F-017](../fixtures/017-low-bit-model-hardware-crossover.md). This
  entry remains as design provenance. Native kernels, sealed confirmation
  bundles, calibrated meter data, and independent reproduction remain required
  before any performance or energy result exists.
- **Claims:** [C-013](../../research/claims.md#c-013).
- **Unresolved question:** Can a ternary-weight model preserve task quality at
  matched model size and training data while reducing end-to-end inference cost
  on hardware with a real low-bit execution path?
- **Why current artifacts are insufficient:** [Fixture F-010](../fixtures/010-boundary-qualified-physical-computation.md)
  supplies physical-boundary, precision, data-movement, and lifecycle rules,
  but it does not specify a trained ternary language-model reproduction or
  native-kernel comparison on project workloads.
- **Minimum decisive design:** Compare matched architectures trained in
  BF16/FP16, optimized INT8 and lower-bit dense modes, ternary weights with
  optimized native kernels, and ternary emulation as a diagnostic non-promotion
  arm. Equalize training corpus and tokens, parameter count, optimizer-search
  budget, checkpoint rule, activation and accumulator disclosure, quality
  target, hardware boundary, batch/latency contract, compiler effort, and
  amortization horizon. Report task and worst-slice quality, calibration,
  training stability, wall energy, power, p50/p99 latency, throughput, peak
  memory, data movement, conversion, compilation, training, and retraining
  cost.
- **Original promotion condition:** Number the work only when native kernels and frozen
  workloads exist on at least two relevant hardware classes. Ternary execution
  must occupy a better matched-quality latency--memory--energy frontier than
  the strongest supported low-bit baseline after training and engineering
  costs; emulation-only savings cannot promote it.

## `proposed:immune-state-lifecycle-evaluation`

- **Promotion state:** promoted on 2026-08-24 to
  [Fixture F-013](../fixtures/013-immune-state-lifecycle-evaluation.md). This
  entry remains as design provenance and is no longer an unnumbered backlog
  item; F-013 separates source-domain reproduction from the AI-system test.
- **Claims:** [C-746](../../research/claims.md#c-746) and
  [C-747](../../research/claims.md#c-747).
- **Unresolved question:** Does keeping recognition, authorization, activation,
  suppression, deletion, exhaustion, contraction, memory, and recovery states
  operationally distinct reduce unsafe reactivation and false deletion beyond
  a mature modular-service control stack?
- **Why current artifacts are insufficient:** Candidates
  [005](../candidates/005-severity-ordered-containment.md),
  [009](../candidates/009-graded-assurance-envelopes.md), and
  [012](../candidates/012-latency-qualified-authority.md) test containment,
  assurance, and authority components separately. None tests whether the full
  typed lifecycle adds a consequential state transformation rather than a
  larger label set.
- **Minimum decisive design:** Compare a conventional anomaly detector plus
  IAM and recovery workflow, a calibrated state machine, resource-aware
  supervisory control with replay and placement, a typed lifecycle with states
  collapsed in targeted ablations, and the complete composition. Equalize
  observations, labels, interventions, authority, reserve, fallback, human
  review, compute, storage, time, and lifecycle energy. Report false deletion,
  unsafe reactivation, unauthorized activation, missed harm, abstention,
  availability, recovery and recurrence, retained capability, calibration,
  state-transition errors, reserve use, operator time, latency, bytes, and
  joules.
- **Original promotion condition:** Before numbering, the state contract must predict
  distinct errors in two materially different service families. The complete
  composition must beat the strongest ordinary stack on protected
  outcome--cost frontiers, and merging each claimed state distinction must
  selectively recreate its preregistered failure without relying on
  immune-derived names.

## `proposed:versioned-evidence-retrieval-feedback`

- **Promotion state:** promoted on 2026-08-24 to
  [Fixture F-016](../fixtures/016-versioned-evidence-retrieval-feedback.md).
  This entry remains as design provenance and is no longer an unnumbered
  backlog item.
- **Claims:** [C-797](../../research/claims.md#c-797) and
  [C-798](../../research/claims.md#c-798).
- **Unresolved question:** Can adaptive evidence routing and a versioned,
  rollback-capable query model improve supported answers beyond mature sparse,
  dense, and hybrid retrieval without treating relevance or exposure-dependent
  feedback as truth?
- **Why current artifacts are insufficient:** Candidates
  [009](../candidates/009-graded-assurance-envelopes.md),
  [014](../candidates/014-versioned-observation-contract.md),
  [017](../candidates/017-contract-preserving-semantic-compaction.md), and
  [018](../candidates/018-value-reconstructability-aware-tiering.md) preserve
  evidence, versions, and artifacts. None isolates adaptive retrieval against
  strong retrieval nulls while mistaken or poisoned feedback changes only a
  reversible query/task model.
- **Minimum decisive design:** Compare tuned sparse, dense, hybrid, and
  reranked retrieval; static and pseudo-relevance feedback; online unversioned
  feedback; and versioned feedback with exploration, challenge, rollback, and
  an immutable evidence-base control. Equalize corpus and cutoff, index and
  working bytes, training data, query interactions, labels and reviewer time,
  downstream token budget, reranker/evaluator calls, latency, compute, and
  energy. Report task loss, retrieval recall, citation support and entailment,
  calibration, evidence diversity, tail and protected-query performance,
  mistaken/poisoned-feedback damage, recovery after rollback, evidence-base
  integrity, reviewer effort, bytes, latency, and joules.
- **Original promotion condition:** A numbered protocol requires frozen benign,
  mistaken, delayed, exposure-biased, and poisoned feedback generators across
  at least two corpora or task families. The versioned arm must improve the
  supported-answer--risk--cost frontier over the best hybrid baseline, preserve
  the evidence base, and show selective benefit from exploration and rollback
  ablations.

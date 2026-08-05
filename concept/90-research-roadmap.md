# Research roadmap

> A publication checkpoint records progress. Completion is earned by closing a
> gate, retiring a hypothesis, or producing a reproducible result.

## Scope

This roadmap converts an open-world research ambition into bounded iterations.
Breadth remains unlimited: any scientific field may contain a transferable
operation. Work remains finite because each iteration must change a canonical
claim, principle, chapter, equation, diagram, decision, or experiment—or record
that the new evidence changes none of them.

The stages are dependency gates rather than dates. Evidence discovery,
architecture writing, null-model comparison, and measurement design continue
in parallel, but an integrated system does not inherit a mechanism merely
because its audit is interesting.

## Biological observation

Development, adaptation, and maintenance operate on different timescales.
Variation precedes selection; temporary states can precede durable change;
stable organization remains repairable; and recurring behavior can migrate
into structure. Relevant observations are separated across
[P-003](../research/principle-registry.md#p-003--temporary-trace-before-commitment),
[P-004](../research/principle-registry.md#p-004--diversity-selection-and-protection),
[P-009](../research/principle-registry.md#p-009--maintenance-plane), and
[P-010](../research/principle-registry.md#p-010--structural-offloading-and-co-design).

The engineering consequence is progressive commitment. Cheap reversible work
comes first; expensive structural or hardware commitments require stronger
evidence and longer reuse horizons.

## Proposed AI translation

### One research iteration

```mermaid
flowchart LR
    discover["Discover across fields"] --> scope["Scope evidence + boundary"]
    scope --> dedupe["Deduplicate into P-principle"]
    dedupe --> null["Name strongest null model"]
    null --> contract["Write decisive contract"]
    contract --> result{"Result"}
    result -->|"supports"| promote["Promote scoped mechanism"]
    result -->|"ties"| merge["Merge into conventional primitive"]
    result -->|"fails"| retire["Retire translation; keep evidence"]
    promote --> update["Update claim · chapter · math · diagram"]
    merge --> update
    retire --> update
    update --> discover
```

Editable source:
[`../assets/diagrams/research-iteration-loop.mmd`](../assets/diagrams/research-iteration-loop.mmd).

An iteration has three independently reviewable outputs:

| Output | Minimum durable artifact | Meaningful completion |
| --- | --- | --- |
| evidence delta | dated audit, primary reference, scoped `C-` claim proposal | the observation and its boundary can be checked without the architecture prose |
| synthesis delta | merge into a `P-` principle or a written discriminating reason to keep it separate | another field name does not create another mechanism by default |
| decision delta | experiment contract, rejection, or explicit no-change record | the result changes what the project would build or test |

### Parallel workstreams

Four workstreams move continuously, with different exit conditions:

1. **Discovery and evidence.** Sample under-covered fields by constrained
   problem, audit primary sources, extract causal operations, and preserve
   boundary conditions.
2. **Principle synthesis.** Deduplicate observations using the mechanism tuple
   in [chapter 07](07-cross-domain-convergence.md), then update the shared
   primitive rather than accumulating themed components.
3. **Concept closure.** Turn retained principles into readable data contracts,
   control paths, state ownership, equations, null models, failure signatures,
   graphics, and measurable predictions.
4. **Decisive testing.** Compare one operation at a time against the strongest
   conventional method at equal interface, budget, hardware, and quality–risk
   envelope.

### Stage 0 — Evidence, synthesis, and contracts

Stage 0 is complete for a mechanism only when:

- its observation has at least one scoped claim and primary source;
- its nearest existing AI and engineering analogues are recorded;
- its normalized operation maps to a `P-` principle or a held candidate;
- the affected chapter exposes state, information flow, timescale, physical
  boundary, and failure behavior;
- every equation defines symbols and units;
- a conventional null, ablation, measurement envelope, and rejection condition
  exist; and
- imported discussions remain provenance rather than evidence.

The repository structure satisfies this workflow. Individual mechanisms remain
at different positions inside it; the
[domain inventory](../research/domain-inventory.md) and
[adoption matrix](../research/adoption-matrix.md) expose those differences.

### Stage 1 — Isolated mechanism experiments

The first tests isolate control operations before composing them.

| Contract | Candidate operation | Strong null classes | Gate |
| --- | --- | --- | --- |
| [001 adaptive topology](../experiments/candidates/001-adaptive-topology.md) | reversible birth, routing, merge, and retirement | fixed sparse routing, periodic/global reoptimization, oracle bounds | structural changes improve a declared frontier after controller and migration cost |
| [002 context broadcast](../experiments/candidates/002-multiscale-context-broadcast.md) | rate-limited context decoded by receiver-local temporal filters | FiLM, recurrent gates, global tokens, low-rank hypernetworks, gain scheduling | extra temporal decoding value survives an equal bit-rate and state interface |
| [003 transition-class-aware recovery dynamics](../experiments/candidates/003-recovery-dynamics-fragility.md) | bounded probes estimate hidden restoring margin and reject inapplicable transition classes | SLO/headroom, change detection, state-space ID, observability analysis, mechanism-specific indicators | useful warning survives probe and false-action cost while noise, rate, boundary, hidden-mode, and jump cases receive calibrated abstention |
| [004 endogenous curriculum](../experiments/candidates/004-closed-endogenous-curriculum.md) | generate, intervene, evaluate, and retain structured proposals | imitation, matched stochastic sampling, active learning, model-based planning, evolutionary search | compositional or causal gain survives equal proposal, interaction, evaluation, memory, and energy budgets |
| [005 severity-ordered containment](../experiments/candidates/005-severity-ordered-containment.md) | contain spread, choose the least destructive qualified response, verify, escalate, and replenish | circuit breakers, static isolation, checkpoints, replicas, microrestart, scrubbing, rejuvenation, Bayesian repair/replace | collateral-loss and availability gains survive sensing, reserve, copying, replacement, and verification cost |
| [006 reversible physical skill](../experiments/candidates/006-reversible-physical-skill.md) | compile a mature physical mapping into a rewritable local substrate with health probes and digital fallback | passive mechanics, analog control, FPGA/ASIC, fixed physical and matched digital reservoirs | a measured conversion, transport, recurrence, or command path is removed and lifecycle break-even precedes qualified retirement |
| [007 endogenous-observation surveillance](../experiments/candidates/007-endogenous-observation-surveillance.md) | jointly estimate hidden state and action-altered observation while preserving sensing/action provenance | residual CUSUM/GLR, nowcasting, maximum coverage, value-of-information sampling, delay-aware POMDP/MPC | decisions improve on true data vintages without mistaking policy-induced telemetry suppression for recovery |
| [008 contestable modular allocation](../experiments/candidates/008-contestable-modular-allocation.md) | withheld audits, protected entrants, real opportunity consequences, and replayable commitments under measured strategic private information | calibrated routers, constrained/primal–dual control, contextual bandits, randomized evaluation, applicable matching/scoring mechanisms | tie or lose under cooperative direct observability; improve protected outcomes under gaming, identity, collusion, and allocator threats at equal cost |
| [009 graded assurance envelopes](../experiments/candidates/009-graded-assurance-envelopes.md) | bind distinct proof, effect, authority, evaluation, monitor, provenance, update, and recovery claims to a module version and invalidation graph | typed APIs, sandbox/IAM, CI/static analysis, runtime policy monitoring, lineage, canaries, transactions, schema/build invalidation | reduce unsafe admission, stale assurance, collateral rollback, and attribution time beyond the complete composed null at equal lifecycle budget |
| [010 reset-coupled staged verification](../experiments/candidates/010-reset-coupled-staged-verification.md) | create a reversible trace, invoke conditionally informative verification under commitment risk, then commit or reset with provenance | conditioned SPRT, calibrated cascade, abstention, retry plus rollback, redundant verifier, error-detecting code | improve false-commit, false-reject, latency, rollback, and energy frontiers only where later evidence is genuinely new and reset is cheaper than error |
| [011 dual-loop operational assurance](../experiments/candidates/011-dual-loop-operational-assurance.md) | connect bounded live command, containment, escalation, and restoration to dependency-linked verified learning, retrieval, and retirement | mature telemetry/tracing, SRE roles, IAM/interlocks, canaries, chaos drills, postmortems, action tracking, searchable runbooks | reduce tail containment and recurrence at equal authority, interruption, reviewer, storage, compute, human-time, and energy budgets |
| [012 latency-qualified authority](../experiments/candidates/012-latency-qualified-authority.md) | derive admissible local action from evidence age, integrity, mode, headroom, and coordination, then abstain, fall back, or hand off | adaptive protection, gain scheduling, supervisory/constrained/robust control, barrier functions, runtime assurance | improve service and risk without self-certification, unsafe envelope transitions, extra authority, privileged state, or uncharged reserve |
| [013 deficit–capability routing](../experiments/candidates/013-deficit-capability-routing.md) | send compressed unmet demand upward, return rate-limited scarcity context, and allocate or grow only where local capability is present | delayed centralized optimizer, backpressure, primal–dual allocation, learned routing, ordinary feasibility gates | improve fulfilled demand, tail starvation, regret, messages, oscillation, and energy without strategic capture or stale structural growth |
| [014 versioned observation contracts](../experiments/candidates/014-versioned-observation-contract.md) | preserve response, exposure, spatial/temporal support, preservation, intervention, selection, association, uncertainty, vintage, supersession, and follow-up dependencies with each inferred claim | typed/event-time evidence schema, state-space and Gaussian-process models, calibrated likelihood, selection function, lineage, multiplicity control, predictive checks, simulation calibration, surveillance schema, graded assurance | reduce overconfidence, invalid mixed-clock fusion, stale claims, and wasted follow-up beyond the complete composed null at equal lifecycle cost |
| [015 versioned repairable conventions](../experiments/candidates/015-versioned-repairable-conventions.md) | adapt local message forms while preserving typed literal meaning, uptake, repair lineage, protected meanings, compatibility, and rollback | typed protocol/DSL, schema registry, acknowledgement/retry, calibrated inference, replicated logs, standard coding, explicit migration and canary rollback | improve heterogeneous cross-play and drift adaptation without silent semantic failure or hidden decoder, repair, migration, and review cost |
| [016 conflict-bounded unit transition](../experiments/candidates/016-conflict-bounded-unit-transition.md) | define reproducible collective descendants, partition member and collective selection, and retain only conflict control with a net joint gain | ordinary modularity, typed interfaces, permissions/tests, clean versioning, external evaluation, routed experts, ensemble and population selection | demonstrate heritable collective capability and positive cost-adjusted between-collective selection under shortcuts, turnover, founder risk, and common-mode failure |
| [017 contract-preserving semantic compaction](../experiments/candidates/017-contract-preserving-semantic-compaction.md) | shrink histories under registered query, evidence, uncertainty, rollback, invalidation, deletion, and corruption-degradation obligations | indexed history, snapshot plus suffix, views, key compaction, lossless compression, cold archive, extractive evidence summary, Candidate 014 | pass frozen hidden future-query and invalidation suites across workloads and hardware after complete physical and maintenance cost |
| [018 value-aware artifact tiering](../experiments/candidates/018-value-reconstructability-aware-tiering.md) | place artifacts using access/recompute forecast, task/evidence loss, invalidation value, and reconstructability under correlated failure | LRU/LFU, ARC, W-TinyLFU, size/miss-cost caching, static/economic tiering, coded fault-domain placement | improve leakage-free out-of-sample placement under shift after metadata, migration, tail, privacy, and failure costs |
| [019 audited cumulative inheritance](../experiments/candidates/019-audited-cumulative-inheritance.md) | preserve and recombine validated capability across learner turnover through separately versioned generation, transmission, evaluation, lineage, external state, and governance | centralized continual learning, replay/distillation, version control, retrieval, repositories, workflow engines, quality-diversity search, fixed governance | improve protected capability, recombination, compatibility, and newcomer learning at equal cumulative work after coordination and lifecycle cost |
| grounding loop | action-conditioned multimodal prediction and acquisition | passive multimodal learning, text-centric pretraining, standard world models | intervention and composition gains survive shortcut and missing-modality controls |
| memory lifecycle | capture, replay, externalize, weaken, or delete | reservoirs, prioritized replay, databases, caches, continual-learning regularizers | retention–adaptation improvement survives storage, maintenance, and deletion risk |
| mature hardening | compile, quantize, retrieve, or keep plastic through separate gates | compiler/autotuning, standard quantization, RAG, caching, distillation | each target produces a physical saving without freshness or recovery regression |

**Stage-1 exit gate:** at least one isolated operation changes the measured
quality–risk–latency–energy frontier relative to its strongest null. A tie
merges the biological translation into the conventional primitive; a loss
retires the translation while preserving the source evidence.

### Stage 2 — Runtime plus adaptation

Combine the event controller from [chapter 30](30-sparse-predictive-compute.md)
with attributable episodic capture from
[chapter 40](40-memory-and-consolidation.md). Keep slow structural state
protected while a branch adapts.

Required composed ablations:

- runtime only;
- adaptation only;
- runtime plus adaptation without maintenance pricing;
- full two-loop system with storage, replay, rollback, and controller cost; and
- dense or monolithic continual-learning baselines at the same capacity and
  observation stream.

**Stage-2 exit gate:** sequential adaptation improves a declared task stream
without a retention, calibration, rare-event, rollback, or lifecycle-energy
regression hidden by the average score.

### Stage 3 — Grounded developmental curriculum

Introduce temporally aligned perception, action, outcome, and language. Compare
passive observation, action-conditioned prediction, targeted acquisition, and
text-centric learning at matched capacity and interaction budget.

The environment must expose interventions, counterfactual structure, missing
modalities, sensor noise, delayed outcomes, and distribution shifts. Language
may describe, query, or compress the learned state; it cannot be the only path
by which every evaluation variable enters the model.

**Stage-3 exit gate:** held-out intervention, temporal prediction, transfer,
and composition gains survive leakage, memorization, simulator-state, and
language-shortcut controls.

### Stage 4 — Structural maturation

Apply the reversible maturity cycle from [chapter 50](50-grokking-and-pruning.md)
and the separated hardening targets from
[chapter 60](60-hardening-and-factual-memory.md). Candidate operations include
structured pruning, module fusion, compilation, placement, quantization,
retrieval externalization, write protection, and local reopening.

Every operation receives its own invalidation and recovery test. Parameter
count is diagnostic; resident bytes, transferred bytes, wall energy, tail
latency, maintenance, and rollback determine the system result.

**Stage-4 exit gate:** benefits remain positive after discovery, validation,
migration, shadow traffic, failed promotions, recovery, and the observed reuse
horizon are included.

### Stage 5 — Substrate co-design

Compare accepted mechanisms on optimized conventional hardware and on
event-driven, near-memory, neuromorphic, or other appropriate substrates.
[C-015](../research/claims.md#c-015) establishes feasibility for a scoped class
of event-driven systems; it does not select a winner for this workload.

Algorithm, precision, memory layout, interconnect, batching, cooling boundary,
and hardware control policy become joint experimental variables. The same
qualified event and quality–risk envelope apply to every substrate.

**Stage-5 exit gate:** an independently reproducible end-to-end lifecycle
advantage transfers beyond the workload or hardware used to tune it.

### Breadth-wave decisions and next queue

The latest completed audits already changed the architecture rather than merely
adding citations:

| Field cluster | Decision now recorded |
| --- | --- |
| endocrine and circadian control | most pulse decoding maps to P-002/P-006/P-011; persistent receiver-local phase remains held against clocks, timers, PLLs, and schedules in Candidate 002 |
| proteostasis and organelle quality control | sensing, containment, triage, repair, extraction, removal, replacement, and verification are separated; their ordered composition is Candidate 005 |
| fault tolerance and reconstruction | exact restore, coding, replication, detectors, scrubbing, and self-stabilization are mandatory nulls; only underdetermined functional repair remains speculative |
| Earth-system transition signals | Candidate 003 is narrowed to gradual observable stability loss and now includes noise, rate, flickering, hysteresis, spatial, hidden-mode, boundary, jump, and benign-slowing controls |
| adaptive materials and self-assembly | demonstrated physical computation, memory, patterning, assembly, and healing map to P-006/P-009/P-010; reversible physical skill compilation becomes Candidate 006 |
| epidemiology and surveillance control | placement, delay, ascertainment, pooled proxies, and intervention feedback map to P-001/P-007/P-009/P-013; endogenous observation becomes Candidate 007 |
| economics, market design, and incentives | prices, auctions, matching, scoring, bandits, sanctions, and ledgers map to existing bundles; contestable allocation becomes Candidate 008 only for persistent strategic private information |
| programming languages and verification | proof, monitored behavior, authority, rollback, provenance, and empirical evidence remain distinct assurance classes; their versioned binding and invalidation becomes Candidate 009 |
| chemistry and reaction networks | recognition, proofreading, nonequilibrium drive, autocatalysis, compartments, reaction–diffusion, transient assembly, molecular compute, oscillators, and integral control map to existing bundles; reset-coupled staged verification becomes Candidate 010 only where later evidence is conditionally new |
| high-reliability organizations and incident learning | field observations and doctrines do not transfer effect sizes; report denominators, topology, bounded escalation, incident command, and memory-in-use matter; the live/learning interface becomes Candidate 011 |
| power grids and protection | local protection, adaptive settings, estimation, synchronization, reserve, islanding, cascade, and black-start restoration become mature nulls; evidence- and headroom-qualified authority becomes Candidate 012 |
| plant distributed control | wound alarms, hydraulic/chemical drought response, patch foraging, tropisms, branching, source–sink flow, and mycorrhizal exchange map to existing bundles; organism, symbiosis, and community scales stay separate; deficit–capability routing becomes Candidate 013 |
| astronomy and planetary remote inference | the latent-to-measurement-to-selection-to-association chain becomes explicit; non-detection, trials, model support, predictive checks, computation calibration, and causal identification remain distinct; Candidate 014 tests dependency-bearing observation contracts |
| geology and geomorphology | efficient-looking fracture and drainage networks become passive-physics nulls; connectivity is not conductance, erosion implies relocation, topology change can destroy service, and mixed supports extend Candidate 014 rather than creating a new principle |
| security and cryptography | authentication, authorization, information flow, detection, containment, and clean recovery remain separate; adversary, epoch, revocation, independence, compromise-horizon, and clean-root fields refine Candidates 009 and 012 rather than creating a new principle |
| linguistics and communication | formal composition, pragmatic inference, common ground, repair, turn timing, coding, iterated learning, grounding, and convention formation remain separate; Candidate 015 tests their versioned lifecycle composition against mature protocol engineering |
| paleobiology and major transitions | demographic and reproductive bottlenecks, extinction and recovery, acquisition and integration, aggregation and individuality, exaptation, constraint, and fossil observation remain distinct; Candidate 016 retains only reproducible collective heredity plus costed conflict control |
| pathology and rehabilitation | local selection can oppose host goals; sampled response is not eradication; tolerance is layered; output can hide compensation or depleted reserve; plasticity and dose have no monotonic sign; compensation-aware recovery becomes a cross-candidate evaluation method rather than a new principle |
| databases and storage | transactions, isolation, real-time ordering, replication, access paths, caches, compaction, reclamation, replay, temporal coordinates, coded repair, and tiering remain distinct; Candidates 017 and 018 retain only finite semantic preservation and task/evidence value beyond mature storage nulls |
| cultural evolution and archaeology | generation, transmission, evaluation, retention, governance, accessible model diversity, path dependence, and archaeological formation remain distinct; Candidate 019 tests only the residual population-level inheritance advantage across turnover |

The active and next breadth queue is selected by expected ability to split,
merge, reject, or re-baseline a current mechanism:

| Field cluster | Mechanism question | Expected decision |
| --- | --- | --- |
| human–computer interaction and human factors | which mixed-initiative, interruption, mode-awareness, trust, shared-control, interface, error-recovery, and accessibility mechanisms alter authority and recovery contracts? | test P-002/P-003/P-006/P-007/P-009/P-011/P-013 and Candidates 009/011/012/015 against mature interface and control practice |

This queue is revised whenever an audit changes a principle, null model, or
experiment. Breadth alone does not close a row.

## Efficiency mechanism

Stage gates reduce the cost of compounding weak mechanisms. Shared principle
bundles reuse telemetry, baselines, and test regimes; isolated rejection avoids
paying for full-system integration; exact provenance prevents repeated searches;
and negative results retire duplicated work.

For stage $k$, let $E_{k,\mathrm{research}}$ and $E_{k,\mathrm{integration}}$
be joules spent within declared research and compute boundaries. Let
$p_{k,\mathrm{survive}}$ be the empirically estimated fraction of candidates
that pass the isolated gate. The expected integration energy avoided by testing
first is

$$
E_{k,\mathrm{avoided}}
= (1-p_{k,\mathrm{survive}})E_{k,\mathrm{integration}}
- E_{k,\mathrm{research}}.
$$

This quantity is reported only when both energy boundaries are actually
measured; its purpose is to expose the cost of evaluation, not to assume that
research automatically saves energy.

## Evidence status

- The ordering and gates are project decisions.
- Mechanism-specific evidence remains in the
  [claims ledger](../research/claims.md); roadmap placement does not promote a
  claim.
- The three existing experiment contracts are specified but not executed.
- The five-stage composition and its lifecycle benefit remain speculative until
  the gates produce measured results.
- Sensorimotor transfer remains speculative under
  [C-007](../research/claims.md#c-007).

## Speculative extensions

- Maintain a machine-readable experiment ledger linked to commits, hardware
  records, raw telemetry, derived figures, and claim-status changes.
- Use active literature search to select the next field by expected impact on
  an unresolved principle, not by publication volume.
- Allocate compute to experiments by expected decision value and uncertainty
  reduction once the proxy is calibrated against actual outcomes.
- Run adversarial review agents whose only task is to find conventional
  explanations, hidden costs, or domain evidence that breaks a principle.
- Publish negative results and retired translations as reusable research
  outputs rather than silently deleting them.

## Failure modes

- **Perpetual breadth:** new fields accumulate without changing principles or
  experiments.
- **Premature composition:** several plausible mechanisms are integrated before
  any one survives its null model.
- **Gate drift:** thresholds or comparison boundaries change after results are
  visible.
- **Mechanism creep:** a component enters the system without a claim, principle,
  ablation, or owner.
- **Proxy capture:** FLOPs, parameter count, or average accuracy substitutes for
  measured physical cost and qualified behavior.
- **Negative-result loss:** a failed translation disappears and later returns
  under another domain name.
- **Benchmark enclosure:** the roadmap optimizes a convenient task family that
  no longer tests the intended operation.
- **Documentation lag:** equations, diagrams, or claim status stop matching the
  executed artifact.
- **Hardware lock-in:** a mechanism is tuned to one substrate before its
  functional interface is stable.
- **Narrative immunity:** biological appeal preserves a mechanism after its
  measurable predictions fail.

## Measurable predictions

1. Each breadth wave changes at least one principle boundary, null model,
   experiment regime, or explicit no-change decision; otherwise the sampling
   policy is revised.
2. The ratio of scoped claims to deduplicated principles increases as coverage
   grows, while duplicate organism-themed components decline.
3. At least one Stage-1 candidate ties a conventional baseline and is merged,
   and at least one loses and is retired; a roadmap in which every mechanism
   wins is not discriminating.
4. Shared telemetry and null-model infrastructure reduce the incremental cost
   of testing later principles relative to the first isolated contracts.
5. Mechanisms that pass isolated gates still sometimes fail composition,
   producing explicit interaction terms rather than post-hoc stories.
6. Lifecycle accounting reverses at least one apparent saving based on FLOPs,
   parameter count, or inference-only energy.
7. Every completed stage leaves reproducible baselines, scoped claim changes,
   negative results, and a smaller set of unresolved integration decisions.

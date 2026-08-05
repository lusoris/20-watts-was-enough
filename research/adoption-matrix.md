# Biological-principle adoption matrix

**Snapshot date:** 2026-08-05

This is a working research map, not a bibliometric proof that an idea is
“present” or “absent.” The useful question is whether a principle has already
been demonstrated at the scale and task boundary this project needs.

## Reading the matrix

- **Use now:** established engineering method with relevant implementations.
- **Experiment:** credible result exists, but the project needs an isolated
  test before adopting it.
- **Explore:** biological observation is credible while the proposed AI
  abstraction remains weakly tested.
- **Watch:** promising analogy whose mechanism or benefit is not yet precise
  enough for an experiment.

An “explore” label does not claim nobody has published a related model. It says
that no evidence in this ledger yet validates the translation at the intended
system boundary.

## Working matrix

| Candidate | Biological or scientific principle | Current disposition | What already exists | Missing test for this project | Claim |
| --- | --- | --- | --- | --- | --- |
| Conditional experts | Large capacity need not be simultaneously active | **Use now** | Sparse mixture-of-experts systems | Wall-energy benefit after routing and communication | [C-003](claims.md#c-003) |
| Adaptive depth | Easy events can leave a computation early | **Use now** | Early-exit language models | Calibration and tail risk under shift | [C-004](claims.md#c-004) |
| Retrieval | Mutable knowledge can live outside slow parametric memory | **Use now** | Retrieval-augmented generation | Provenance, conflicts, and lifecycle energy | [C-014](claims.md#c-014) |
| Quantization | Stable computations can use cheaper representations | **Experiment** | Low-bit and ternary-weight models | End-to-end energy at matched quality | [C-013](claims.md#c-013) |
| Replay and protected consolidation | Acquisition and integration can run on different timescales | **Experiment** | Replay and continual-learning regularizers | Same stream, storage budget, and retention test | [C-008](claims.md#c-008)–[C-010](claims.md#c-010) |
| Predictive residual compute | Spend work on mismatch rather than reconstructing all input | **Experiment** | Predictive coding models and joint-embedding prediction | Residual-controlled routing on action-conditioned sequences | [C-005](claims.md#c-005), [C-006](claims.md#c-006) |
| Event-driven substrate | Inactive state need not switch on every step | **Experiment** | Spiking systems and neuromorphic processors | Fair comparison with optimized dense accelerators | [C-015](claims.md#c-015) |
| Local plastic connections | A network can learn how its own connections should adapt online | **Experiment** | Differentiable plasticity and neuromodulated plastic networks | Continual multimodal task with bounded drift | [C-019](claims.md#c-019) |
| Homeostatic control | Stabilize activity while preserving relative learned structure | **Explore** | Narrow homeostatic neural-network studies | Per-module rate/activation controller under non-stationarity | [C-018](claims.md#c-018) |
| Nonlinear dendritic compartments | One cell can perform branch-local coincidence and nonlinear integration | **Explore** | Multi-compartment and dendritic models in small NeuroAI/SNN niches | Same capacity and energy versus MLP/expert baselines | [C-017](claims.md#c-017) |
| Inhibition of inhibition | Context or reinforcement can selectively release a local computation | **Explore** | Gating is common; cell-type-like opponent control is not a standard design | Router with explicit excite, suppress, and disinhibit roles | [C-020](claims.md#c-020) |
| Glial maintenance plane | Non-neuronal processes regulate connectivity, plasticity, and consolidation | **Explore** | A small neuron–astrocyte modeling niche | Separate slow controller for pruning, resource allocation, and replay | [C-021](claims.md#c-021) |
| Active sensing | Actions shape which evidence reaches the learner | **Experiment** | Active perception and robotics; limited use in general foundation training | Matched passive versus intervention-seeking curriculum | [C-022](claims.md#c-022) |
| Phase- or clock-gated binding | Transient temporal alignment may select which modules exchange state | **Watch** | Oscillatory and phase-coupled neural models | Show a benefit beyond an ordinary learned gate or scheduler | [C-030](claims.md#c-030) |
| Peripheral autonomy | Local controllers solve most limb/sensor events; a center handles goals and exceptions | **Explore** | Distributed robotics and emerging cephalopod-inspired control | Local reflex policy plus sparse global override | [C-024](claims.md#c-024) |
| Expand–sparsify–associate | Random/diverse expansion plus feedback inhibition decorrelates similar inputs | **Experiment** | Random features, sparse associative memories, insect-inspired classifiers | Continual few-shot discrimination at fixed memory and energy | [C-025](claims.md#c-025) |
| Stress priming | A reversible latent state changes response speed after repeated stress | **Explore** | Meta-learning and adaptive optimizers are analogous, not equivalent | Event-triggered temporary plasticity without permanent drift | [C-026](claims.md#c-026) |
| Flow-reinforced topology | Strengthen useful routes and decay unused ones under distributed feedback | **Experiment** | Adaptive network design and routing heuristics | Dynamic expert/interconnect topology with failure recovery | [C-027](claims.md#c-027) |
| Clonal search | Diversify candidates, select locally, expand winners, protect mature lineages | **Explore** | Evolutionary algorithms and artificial immune systems | Novelty response without unconstrained weight mutation | [C-028](claims.md#c-028) |
| Body–controller co-design | Physical structure can simplify or stabilize the control problem | **Experiment** | Evolutionary and soft robotics | Joint morphology/controller search with lifecycle energy | [C-029](claims.md#c-029) |
| Externalized shared state | Agents coordinate by leaving information in a common environment | **Experiment** | Blackboards, tuple spaces, logs, and ant-colony methods | Decaying workspace versus pairwise and central scheduling | [C-031](claims.md#c-031) |
| Bet-hedging reserve | Preserve diverse states when the next regime is not predictable | **Explore** | Ensembles and population-based methods | Uncertainty-controlled diversity at fixed lifecycle cost | [C-032](claims.md#c-032) |
| Constraint-guided repair | Reconstruct missing structure from target invariants and local context | **Explore** | Checkpoints, redundancy, program repair | Module regeneration versus restore and retrain | [C-033](claims.md#c-033) |
| Frontier–backbone growth | Cheap exploration expands ahead of a stable transport network | **Explore** | Dynamic architecture search and elastic systems | Growth/fusion policy under full communication cost | [C-034](claims.md#c-034) |
| Congestion-triggered reserve paths | Local inhibition opens capacity before throughput collapses | **Experiment** | Queueing and adaptive load balancing | Tail-latency-aware expert routing | [C-035](claims.md#c-035) |
| Selective memory lifecycle | Replay, merge, externalize, weaken, or delete memories under explicit budgets | **Experiment** | Prioritized replay, caches, databases, compaction, and forgetting regularizers | Joint retention–adaptation–energy frontier with protected rare/safety state | [C-036](claims.md#c-036)–[C-042](claims.md#c-042) |
| Reversible mature plasticity | Stable structure can be locally protected and reopened for validated change | **Explore** | Freezing, adapters, rollback, optimizer schedules, and continual-learning regularizers | Reopen–test–reconsolidate cycle versus ordinary fine-tuning | [C-044](claims.md#c-044), [C-045](claims.md#c-045) |
| Multiscale context broadcast | A few rate-limited signals are decoded with receiver-specific gains and temporal filters | **Experiment** | FiLM, recurrent gates, global tokens, low-rank hypernetworks, gain-scheduled control | [Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md) | [C-046](claims.md#c-046)–[C-048](claims.md#c-048) |
| Local physical resource response | Demand is sensed near work and an adjacent layer changes supply or placement | **Explore** | DVFS, schedulers, locality optimization, NUMA placement, accelerators | Joint quality–tail-latency–joule test including controller and migration cost | [C-049](claims.md#c-049)–[C-051](claims.md#c-051) |
| Thresholded collective commitment | Nonlinear support, opposition, and abstention gate group commitment | **Watch** | Robust aggregation, calibrated voting, confidence clipping, sequential tests | Quorum versus conventional aggregation under independent and correlated errors | [C-052](claims.md#c-052), [C-053](claims.md#c-053) |
| Capability-gap repair | Admit the smallest complementary set that closes measured missing functions | **Explore** | Coverage optimization, architecture search, mixture growth, set cover | Function-guided repair versus random and global retraining | [C-056](claims.md#c-056), [C-057](claims.md#c-057) |
| Recovery-based fragility sensing | Infer hidden loss of restoring margin from bounded perturbations and return dynamics | **Experiment** | SLO dashboards, CUSUM, Page–Hinkley, AR/VAR, RLS and subspace system identification | [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md) | [C-058](claims.md#c-058), [C-059](claims.md#c-059) |
| Vector resilience accounting | Stability, acute resistance, recovery, adaptability, and admission can oppose each other | **Use now** | Multi-objective reliability and control metrics | Report raw axes before any aggregate score | [C-057](claims.md#c-057), [C-060](claims.md#c-060) |
| Closed endogenous curriculum | Generate structured hypotheses, intervene selectively, evaluate, and retain validated changes | **Explore** | Active learning, model-based RL, planning, novelty search, self-play | Compositional novelty beyond imitation and stochastic policy sampling at equal interaction cost | [C-061](claims.md#c-061)–[C-066](claims.md#c-066) |

## Near-term priority

The first comparative experiments are specified as versioned contracts:

1. [adaptive logical topology](../experiments/candidates/001-adaptive-topology.md):
   graph mutation versus fixed-topology routing and reoptimization;
2. [multiscale context broadcast](../experiments/candidates/002-multiscale-context-broadcast.md):
   a rate-limited context bus versus established gates and control baselines;
3. [recovery dynamics](../experiments/candidates/003-recovery-dynamics-fragility.md):
   latent fragility sensing versus standard telemetry, change detection, and
   active system identification; and
4. a smaller closed-endogenous-curriculum contract separating imitation,
   stochastic generation, targeted intervention, and evaluation.

Each experiment needs a conventional baseline, an ablation of the proposed
principle, a declared system boundary, and quality–risk–energy measurements.

## Research boundary

The matrix currently samples representative primary literature and known
engineering exemplars. It is not yet a systematic review, patent search, or
claim of novelty. Before publication or implementation of a named mechanism,
perform a focused literature review and update its claim entry.

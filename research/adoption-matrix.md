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

## Near-term priority

The first comparative experiments should test mechanisms that are both
measurable and composable:

1. **homeostatic conditional routing:** can a slow controller prevent expert
   collapse and suppress chronically idle or overactive capacity?
2. **three-factor local adaptation:** can activity plus a delayed outcome signal
   update only the responsible modules without full-model backpropagation?
3. **maintenance plane:** can a separate slow process improve replay selection,
   pruning, and resource allocation without becoming an opaque second model?
4. **peripheral autonomy:** can sensor-local policies handle predictable events
   while a global model receives only novelty, conflict, or uncertainty?

Each experiment needs a conventional baseline, an ablation of the proposed
principle, a declared system boundary, and quality–risk–energy measurements.

## Research boundary

The matrix currently samples representative primary literature and known
engineering exemplars. It is not yet a systematic review, patent search, or
claim of novelty. Before publication or implementation of a named mechanism,
perform a focused literature review and update its claim entry.

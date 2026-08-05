# Domain inventory

“Collect everything” is an ongoing research program, not a claim that one
search pass is exhaustive. This inventory makes coverage and gaps explicit. A
domain stays here even when all of its useful observations deduplicate into an
existing principle.

## Audit states

- **audited:** at least one relevant primary result has a scoped `C-` claim and
  a `P-` mapping;
- **partial:** an initial result is captured, but major subfields or competing
  interpretations remain unaudited; and
- **queued:** a concrete search question exists, but no result is promoted to
  the ledger yet.

## Biological and behavioral sciences

| Domain | Problem patterns to collect | Current bundles | State | Next pass |
| --- | --- | --- | --- | --- |
| Neural energy and sparse coding | allocation under metabolic and communication limits | [P-001](principle-registry.md#p-001--selective-allocation), [P-007](principle-registry.md#p-007--prediction-error-allocation) | partial | whole-brain budgets, local energy sensing, neurovascular allocation |
| Dendrites and subcellular computation | local integration and credit assignment | [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation), [P-008](principle-registry.md#p-008--compartmentalized-interaction) | partial | branch-specific learning, backpropagating spikes, human-neuron differences |
| Synaptic plasticity and metaplasticity | delayed credit, changing learning rules, stability | [P-003](principle-registry.md#p-003--temporary-trace-before-commitment), [P-006](principle-registry.md#p-006--homeostatic-negative-feedback) | partial | behavioral-timescale plasticity, volatility-sensitive metaplasticity |
| Inhibitory circuit diversity | contextual gain, vetoes, disinhibition | [P-001](principle-registry.md#p-001--selective-allocation), [P-008](principle-registry.md#p-008--compartmentalized-interaction) | partial | interneuron roles across layers, modalities, and learning states |
| Glia and neuroimmune maintenance | pruning, repair, memory coordination, resource support | [P-005](principle-registry.md#p-005--use-dependent-topology), [P-009](principle-registry.md#p-009--maintenance-plane) | partial | microglia, oligodendrocytes, metabolic coupling, causal AI translations |
| Oscillations and neural timing | transient coalitions and multiplexed communication | [P-011](principle-registry.md#p-011--transient-communication-coalitions) | partial | causal perturbation, cross-frequency coupling, delay compensation |
| Active perception and sensorimotor control | information-seeking action and local reflex | [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation), [P-007](principle-registry.md#p-007--prediction-error-allocation) | partial | efference copy, saccades, echolocation, electric sensing |
| Memory, sleep, and replay | multiple timescales and offline consolidation | [P-003](principle-registry.md#p-003--temporary-trace-before-commitment), [P-009](principle-registry.md#p-009--maintenance-plane), [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime) | partial | targeted forgetting, reconsolidation, schema learning, replay selection |
| Neural development and pruning | excess capacity, critical periods, structural commitment | [P-004](principle-registry.md#p-004--diversity-selection-and-protection), [P-005](principle-registry.md#p-005--use-dependent-topology) | queued | primary developmental evidence behind the imported analogy |
| Cephalopods | peripheral autonomy and degrees-of-freedom reduction | [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation), [P-008](principle-registry.md#p-008--compartmentalized-interaction) | partial | sucker-level sensing, cross-arm coordination, global override |
| Insect mushroom bodies | expansion, sparse discrimination, associative memory | [P-001](principle-registry.md#p-001--selective-allocation), [P-006](principle-registry.md#p-006--homeostatic-negative-feedback) | partial | multimodal mushroom-body circuits and rapid association |
| Social insects | stigmergy, quorum, traffic control, collective repair | [P-001](principle-registry.md#p-001--selective-allocation), [P-006](principle-registry.md#p-006--homeostatic-negative-feedback), [P-013](principle-registry.md#p-013--externalized-shared-state) | partial | nest-site quorum, bridge construction, network repair |
| Plant stress and systemic signaling | priming, distributed alarm, reversible response state | [P-003](principle-registry.md#p-003--temporary-trace-before-commitment), [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime) | partial | electrical/systemic signals, seasonal memory, root allocation |
| Fungal and mycorrhizal networks | frontier exploration, fusion, trade, transport | [P-005](principle-registry.md#p-005--use-dependent-topology), [P-007](principle-registry.md#p-007--prediction-error-allocation) | partial | damage repair, partner choice, cheating control |
| Protists and slime molds | distributed topology adaptation and collective decisions | [P-005](principle-registry.md#p-005--use-dependent-topology) | partial | habituation, anticipation, multi-source allocation |
| Adaptive and innate immunity | repertoire diversity, selection, memory, surveillance | [P-001](principle-registry.md#p-001--selective-allocation), [P-004](principle-registry.md#p-004--diversity-selection-and-protection), [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime) | partial | innate trained memory, tolerance, contraction, distributed danger signals |
| Bacteria and microbial collectives | bet hedging, quorum, dormancy, horizontal transfer | [P-004](principle-registry.md#p-004--diversity-selection-and-protection) | partial | primary quorum experiments, biofilms as external memory, phage defense |
| Regeneration and morphogenesis | target-state repair and positional memory | [P-006](principle-registry.md#p-006--homeostatic-negative-feedback), [P-009](principle-registry.md#p-009--maintenance-plane) | partial | bioelectric target states, salamander limb repair, cancer suppression |
| Evolution and development | evolvability, canalization, modularity, robustness | [P-004](principle-registry.md#p-004--diversity-selection-and-protection), [P-010](principle-registry.md#p-010--structural-offloading-and-co-design) | partial | gene-regulatory construction, exaptation, open-ended novelty |
| Collective animal behavior | local rules, consensus, leadership, fission–fusion | unresolved | queued | fish schools, bird flocks, primate group decisions |
| Endocrine and hormonal control | low-bandwidth global context and multi-timescale regulation | unresolved | queued | stress axes, circadian control, growth and satiety signals |
| Vascular and metabolic networks | resource allocation, demand response, redundancy | unresolved | queued | angiogenesis, capillary recruitment, organ-level budgeting |
| Microbiomes and host ecosystems | cooperative/competitive consortia and regime shifts | unresolved | queued | functional redundancy, colonization resistance, dysbiosis recovery |
| Ecology | resilience, diversity, succession, niche construction | unresolved | queued | disturbance recovery, portfolio effects, early-warning signals |

## Non-biological scientific fields

| Domain | Problem patterns to collect | Likely bundle relation | State | Next pass |
| --- | --- | --- | --- | --- |
| Control theory | stability, observability, hierarchical and adaptive control | P-002, P-006, P-007 | queued | identify the standard control analogue for each proposed biological loop |
| Operations research and queueing | allocation, congestion, reserve capacity, scheduling | P-001, P-005, P-013 | queued | compare ant-inspired routing with established optimal/robust schedulers |
| Distributed systems | consensus, failure detection, logs, repair, eventual consistency | P-002, P-009, P-013 | partial | map exact analogues before claiming biological novelty |
| Information theory | rate–distortion, value of information, coding under constraints | P-001, P-007, P-012 | queued | formalize when another observation or bit of state is worth its energy |
| Statistical decision theory | uncertainty, exploration, sequential tests, change detection | P-003, P-004, P-007 | queued | distinguish priming and bet hedging from optimal Bayesian baselines |
| Dynamical systems | attractors, metastability, bifurcation, critical transitions | P-006, P-011 | queued | define stability and switching without metaphor |
| Network science | adaptive graphs, percolation, robustness, multilayer networks | P-005, P-008, P-011 | partial | common benchmark for neural, fungal, slime-mold, and routing graphs |
| Error-correcting codes and fault tolerance | redundancy, reconstruction, graceful degradation | P-004, P-009 | queued | compare regeneration metaphors with coding and checkpoint baselines |
| Thermodynamics and physical computing | energy limits, reversible operations, embodied computation | P-007, P-010 | queued | separate fundamental limits from current hardware overheads |
| Materials and self-assembly | computation in morphology, hysteresis, self-repair | P-006, P-010 | queued | programmable matter, mechanical logic, adaptive materials |
| Robotics | active sensing, morphology, local control, sim-to-real | P-002, P-007, P-010 | partial | matched embodied experiments for principle bundles |
| Computer architecture | memory hierarchy, near-memory compute, fabrics, precision | P-001, P-002, P-010, P-012 | partial | identify silicon-native implementation for each accepted invariant |

## Collection order

Research proceeds breadth-first before it goes deep:

1. capture one strong causal or intervention-based primary result per queued
   domain;
2. attach it to an existing `P-` bundle or justify a new invariant;
3. identify the strongest conventional engineering analogue;
4. only then deepen the domains that change an experiment or architecture.

This prevents the repository from becoming an encyclopedia while still making
“we have not looked there yet” explicit and actionable.

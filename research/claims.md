# Evidence ledger

This ledger is the gate between source material and canonical claims. Status
describes the exact statement here, not a broader interpretation.

## Status summary

| ID | Short name | Status |
| --- | --- | --- |
| C-001 | Neural signaling has a strict energy budget | established |
| C-002 | Sparse coding can learn useful sensory structure | established |
| C-003 | Conditional routing decouples capacity from active compute | established |
| C-004 | Early exits can trade compute for quality per input | established |
| C-005 | Predictive residuals are a useful cortical model | plausible |
| C-006 | Joint-embedding prediction learns semantic image features | established |
| C-007 | Embodied multimodal training grounds general physical concepts | speculative |
| C-008 | Complementary fast and slow learning reduces interference | plausible |
| C-009 | Parameter-importance regularization reduces forgetting | established |
| C-010 | Offline replay can protect old memories in neural models | plausible |
| C-011 | Grokking is a universal maturity signal | disputed |
| C-012 | Pruning can reveal competitive sparse subnetworks | established |
| C-013 | Extreme quantization preserves general capability | plausible |
| C-014 | Non-parametric retrieval improves knowledge-intensive generation | established |
| C-015 | Event-driven neuromorphic hardware supports local sparse learning | established |
| C-016 | The inherited brain-to-hyperscaler energy range is valid | disputed |
| C-017 | Thin dendrites can act as nonlinear computational subunits | established |
| C-018 | Neurons can homeostatically scale synaptic strengths | established |
| C-019 | Delayed dopamine can gate earlier local plasticity | established |
| C-020 | Disinhibitory interneurons provide context-dependent gain | established |
| C-021 | Astrocytes participate in synapse removal and remote memory | established |
| C-022 | Natural sensing depends on self-generated sensor motion | established |
| C-023 | Faithful brain emulation is a necessary or optimal endpoint | disputed |
| C-024 | Cephalopod arms use segmented and simplified peripheral control | established |
| C-025 | Insect feedback inhibition maintains sparse discriminable codes | established |
| C-026 | Repeated plant stress can leave a reversible response memory | established |
| C-027 | Local flow adaptation can form efficient resilient networks | established |
| C-028 | Immune affinity maturation couples variation, selection, and protection | established |
| C-029 | Morphological development can guide embodied-agent search | established |
| C-030 | Phase coupling can define transient large-scale neural states | plausible |
| C-031 | Ant trails can store direction in environmental geometry | established |
| C-032 | Stochastic phenotype switching can evolve as risk spreading | established |
| C-033 | Regeneration reads pre-existing positional context | established |
| C-034 | Fungal networks couple exploratory growth with transport | established |
| C-035 | Ant traffic recruits reserve routes before throughput collapses | established |
| C-036 | Assembly-specific replay disruption produces selective memory loss | established |
| C-037 | Replay allocation is nonuniform and signal-dependent | plausible |
| C-038 | Prior schema can accelerate consolidation | established |
| C-039 | Retrieval can reopen a memory-sensitive state | established |
| C-040 | Prediction error is a universal reconsolidation gate | disputed |
| C-041 | Dopaminergic activity can regulate active forgetting | established |
| C-042 | Microglia can mediate active forgetting through synapse removal | established |
| C-043 | Complement and microglia causally refine developing connectivity | established |
| C-044 | Removing mature extracellular structure can reopen cortical plasticity | established |
| C-045 | A local receptor brake can gate response to broad modulation | established |
| C-046 | Antagonistic broadcasts can sustain distributed behavioral modes | established |
| C-047 | Broadcast frequency and duration can produce different system responses | established |
| C-048 | Receiver identity can decode one broadcast on different timescales | established |
| C-049 | Presynaptic ATP supply is locally coupled to activity | established |
| C-050 | Resource placement can change local computational dynamics | established |
| C-051 | Neural activity can recruit adjacent local vascular supply | established |
| C-052 | Fish groups can use nonlinear quorum-like commitment | established |
| C-053 | Uncommitted members can reduce confident-minority capture | established |
| C-054 | Pigeon-flock influence graphs can be sparse and directed | plausible |
| C-055 | A specialist can enforce admission pressure through shared chemistry | established |
| C-056 | Capability-gap analysis can guide modular ecological repair | established |
| C-057 | Functional redundancy predicts reduced newcomer engraftment | plausible |
| C-058 | Recovery can slow before a controlled biological tipping point | established |
| C-059 | Statistical warnings preceded a manipulated whole-lake regime shift | established |
| C-060 | Diversity can move stability dimensions in opposite directions | established |
| C-061 | Learned hippocampal sequences can be generated without changing external input | established |
| C-062 | Children can target exploration toward confounded causal evidence | established |
| C-063 | Pedagogical instruction can narrow spontaneous exploration | established |
| C-064 | Causal transparency can change imitation versus emulation | established |
| C-065 | Behavioral variability can be regulated rather than fixed noise | established |
| C-066 | Hippocampal damage can impair construction of imagined scenes | established |

## Claims

### C-001

- **Statement:** Neural signaling operates under a strict metabolic budget, and
  the cost of spiking constrains how much cortex can be strongly active at once.
- **Status:** established, for biological energy accounting and estimates of
  cortical activity—not as a direct digital efficiency ratio.
- **Primary sources:** `attwell2001energy`, `lennie2003cost`.
- **Rationale:** Both works explicitly model or estimate signaling cost. Lennie
  argues that substantially active neurons must be a small fraction of cortex.
- **Open issue:** Whole-brain power and effective computation are not single,
  task-independent constants.
- **Used by:** [thesis](../concept/00-thesis-and-principles.md),
  [sparse compute](../concept/30-sparse-predictive-compute.md),
  [energy model](../concept/80-energy-model.md).

### C-002

- **Statement:** Optimizing a sparse representation of natural images can learn
  localized, oriented, band-pass features resembling properties of simple-cell
  receptive fields.
- **Status:** established within the model and data studied.
- **Primary source:** `olshausen1996emergence`.
- **Rationale:** The result supports sparse representation learning; it does not
  prove that sparsity alone reproduces cortical intelligence.
- **Open issue:** Transfer to multimodal predictive world models.
- **Used by:** [sensorimotor grounding](../concept/20-sensorimotor-grounding.md).

### C-003

- **Statement:** Sparse mixture-of-experts routing can increase parameter
  capacity without activating all parameters for each example.
- **Status:** established for published MoE systems.
- **Primary sources:** `shazeer2017outrageously`, `fedus2021switch`.
- **Rationale:** Trainable gates select a subset of experts, demonstrating the
  capacity/active-compute separation central to this project.
- **Open issue:** Routing, communication, and load-balancing overhead can erase
  benefits on unsuitable hardware or small workloads.
- **Used by:** [neurogenesis and routing](../concept/10-neurogenesis-and-routing.md),
  [system synthesis](../concept/70-system-synthesis.md).

### C-004

- **Statement:** Intermediate classifiers can let easier inputs exit a deep
  model early, reducing average inference work with a measurable quality trade.
- **Status:** established for the evaluated BERT tasks.
- **Primary source:** `xin2020deebert`.
- **Rationale:** This is evidence for adaptive depth, not for a universal saving
  or reliable confidence under distribution shift.
- **Open issue:** Calibration and tail-risk in multimodal systems.
- **Used by:** [sparse predictive compute](../concept/30-sparse-predictive-compute.md).

### C-005

- **Statement:** Hierarchical prediction with feed-forward residual errors is a
  useful model of some visual cortical response properties.
- **Status:** plausible as a broader engineering principle.
- **Primary source:** `rao1999predictive`.
- **Rationale:** The cited model reproduces selected receptive-field effects;
  it does not establish that the whole brain minimizes one prediction-error
  objective.
- **Open issue:** Whether residual-gated compute remains stable for action,
  language, and long-horizon uncertainty.
- **Used by:** [sparse predictive compute](../concept/30-sparse-predictive-compute.md).

### C-006

- **Statement:** Predicting target representations from context can learn
  scalable semantic image representations without pixel reconstruction.
- **Status:** established for I-JEPA's image experiments.
- **Primary source:** `assran2023ijepa`.
- **Rationale:** It supports latent prediction as a candidate objective, not the
  claim that JEPA alone creates multimodal or causal grounding.
- **Open issue:** Cross-modal alignment, action-conditioned prediction, and
  physical intervention tests.
- **Used by:** [sensorimotor grounding](../concept/20-sensorimotor-grounding.md).

### C-007

- **Statement:** Temporally aligned perception, action, and outcome training
  will produce physical concepts that generalize more robustly than comparable
  text-centric training.
- **Status:** speculative project hypothesis.
- **Primary sources:** none sufficient yet; `assran2023ijepa` supports only a
  narrower representation-learning component.
- **Rationale:** The proposal is testable but the imported claim that grounding
  would eliminate hallucination is unsupported.
- **Open issue:** Define comparable data, capacity, and intervention-based
  evaluation.
- **Used by:** [sensorimotor grounding](../concept/20-sensorimotor-grounding.md),
  [roadmap](../concept/90-research-roadmap.md).

### C-008

- **Statement:** Separating rapid episodic acquisition from slow integration is
  a useful design for learning new information without destructive
  interference.
- **Status:** plausible for the proposed architecture.
- **Primary source:** `mcclelland1995complementary`.
- **Rationale:** Complementary Learning Systems provides a computational and
  neuroscientific basis, but the project's exact memory partition remains
  untested.
- **Open issue:** What information crosses tiers, when, and under which safety
  check.
- **Used by:** [memory and consolidation](../concept/40-memory-and-consolidation.md).

### C-009

- **Statement:** Penalizing changes to parameters estimated as important for
  previous tasks can reduce catastrophic forgetting in sequential learning.
- **Status:** established in the evaluated tasks.
- **Primary source:** `kirkpatrick2017overcoming`.
- **Rationale:** Elastic Weight Consolidation is a demonstrated mechanism, not
  proof that protected weights are sufficient for open-ended learning.
- **Open issue:** Scaling the importance estimate and avoiding plasticity loss.
- **Used by:** [memory and consolidation](../concept/40-memory-and-consolidation.md).

### C-010

- **Statement:** Offline replay can reduce catastrophic forgetting in neural
  models and is a candidate consolidation mechanism.
- **Status:** plausible for the proposed system.
- **Primary source:** `tadros2020sleep`.
- **Rationale:** Computational experiments support the mechanism in bounded
  settings; “sleep” is not evidence for one mandatory implementation.
- **Open issue:** Replay selection, privacy, coverage, and compute cost.
- **Used by:** [memory and consolidation](../concept/40-memory-and-consolidation.md).

### C-011

- **Statement:** Extended training will reliably produce a grokking transition
  that proves a model has discovered the underlying rule and is ready to prune.
- **Status:** disputed.
- **Primary source:** `power2022grokking` establishes delayed generalization on
  small algorithmic datasets, not this universal claim.
- **Rationale:** Grokking is an observation under particular optimization and
  data regimes. It is not a general certification method.
- **Open issue:** Identify maturity tests that work without a visible phase
  transition.
- **Used by:** [grokking and pruning](../concept/50-grokking-and-pruning.md).

### C-012

- **Statement:** Iterative pruning can identify sparse subnetworks that match a
  dense network in the settings tested by the lottery-ticket work.
- **Status:** established within those settings.
- **Primary source:** `frankle2019lottery`.
- **Rationale:** This motivates staged pruning but does not imply a fixed safe
  pruning percentage or automatic energy reduction on dense hardware.
- **Open issue:** Structured sparsity, retraining cost, and multimodal transfer.
- **Used by:** [grokking and pruning](../concept/50-grokking-and-pruning.md).

### C-013

- **Statement:** Ternary-weight language models can preserve full-precision
  quality at equal model size and training tokens while reducing selected
  inference costs.
- **Status:** plausible; the central BitNet b1.58 evidence is a preprint and the
  result must be reproduced under project workloads.
- **Primary source:** `ma2024bitnet`.
- **Rationale:** Supports extreme quantization as a research candidate, not an
  automatic post-training “myelination” step.
- **Open issue:** Training recipe, activation precision, kernels, and total
  system energy.
- **Used by:** [hardening and factual memory](../concept/60-hardening-and-factual-memory.md).

### C-014

- **Statement:** Combining parametric generation with non-parametric retrieval
  can improve knowledge-intensive generation and make the retrieved evidence
  inspectable and replaceable.
- **Status:** established in the evaluated RAG tasks.
- **Primary source:** `lewis2020rag`.
- **Rationale:** Supports separating mutable facts from weights. It does not
  make generation automatically factual or retrieval automatically correct.
- **Open issue:** Source quality, conflict resolution, latency, and provenance.
- **Used by:** [hardening and factual memory](../concept/60-hardening-and-factual-memory.md).

### C-015

- **Statement:** Neuromorphic hardware can execute asynchronous spiking
  networks with on-chip local learning mechanisms.
- **Status:** established for Loihi's published architecture.
- **Primary source:** `davies2018loihi`.
- **Rationale:** Demonstrates feasibility of a substrate, not superiority for
  the project's tasks.
- **Open issue:** End-to-end training, programmability, accuracy, and comparison
  against optimized conventional accelerators.
- **Used by:** [sparse predictive compute](../concept/30-sparse-predictive-compute.md),
  [roadmap](../concept/90-research-roadmap.md).

### C-016

- **Statement:** A human brain implemented with current hyperscaler efficiency
  would consume between 427 kilowatts and 14.1 megawatts.
- **Status:** disputed.
- **Primary sources:** none establish compatible “operations” for the numerator
  and denominator.
- **Rationale:** The inherited estimate mixes assumed brain operations,
  accelerator peak arithmetic, precision modes, utilization, and facility PUE.
- **Open issue:** Determine whether a functional comparison can be constructed
  without inventing an operation-equivalence factor.
- **Used by:** [energy model](../concept/80-energy-model.md).

### C-017

- **Statement:** Nearby inputs on the same thin dendritic branch of rat
  neocortical pyramidal neurons can sum sigmoidally, while inputs on separate
  branches sum more nearly linearly, supporting branch-local computational
  subunits.
- **Status:** established for the preparation and stimulation protocol studied.
- **Primary source:** `polsky2004dendrites`.
- **Rationale:** The experiment rejects a single global summation rule for these
  cells. It does not establish that artificial dendrites outperform ordinary
  neural-network components.
- **Open issue:** Whether a compartmental abstraction improves conditional
  expressivity per unit of measured energy.
- **Used by:** [launchpad](../concept/05-biology-is-a-launchpad.md),
  [neuroscience map](neuroscience-opportunity-map.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation).

### C-018

- **Statement:** Prolonged changes in cortical-neuron activity can cause
  compensatory scaling of miniature excitatory postsynaptic currents while
  approximately preserving relative synaptic strengths.
- **Status:** established in cultured neocortical neurons.
- **Primary source:** `turrigiano1998scaling`.
- **Rationale:** The result supports a slow stability controller distinct from
  task-error learning. It does not specify a target activation rate for an AI
  model.
- **Open issue:** Which controlled variables prevent expert collapse without
  suppressing useful specialization.
- **Used by:** [launchpad](../concept/05-biology-is-a-launchpad.md),
  [neuroscience map](neuroscience-opportunity-map.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-019

- **Statement:** In mouse hippocampal slices, dopamine delivered after a
  spike-timing protocol can retroactively convert timing-dependent depression
  into potentiation.
- **Status:** established for the experimental preparation.
- **Primary source:** `brzosko2015dopamine`.
- **Rationale:** This is concrete evidence for a local eligibility state gated
  by a delayed modulatory signal. It does not validate a particular artificial
  three-factor rule at scale.
- **Open issue:** Trace duration, interference, and the semantics of a safe
  artificial modulator.
- **Used by:** [neuroscience map](neuroscience-opportunity-map.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment).

### C-020

- **Statement:** VIP-expressing interneurons can suppress other inhibitory
  interneurons and increase the gain of a subpopulation of principal cells in
  awake mice during an auditory discrimination task.
- **Status:** established for the circuits and behavior studied.
- **Primary source:** `pi2013disinhibition`.
- **Rationale:** The result demonstrates a cell-type-specific disinhibitory
  control motif recruited by reinforcement signals. It does not show that an
  excite–veto–release router is superior in AI.
- **Open issue:** Whether explicit opponent gate roles improve routing stability
  beyond a larger conventional gate.
- **Used by:** [launchpad](../concept/05-biology-is-a-launchpad.md),
  [neuroscience map](neuroscience-opportunity-map.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-021

- **Statement:** Astrocytes participate in activity-dependent elimination of
  adult hippocampal excitatory synapses and can affect formation of remote
  contextual memory through hippocampal–cortical communication in specific
  mouse experiments.
- **Status:** established for those interventions; broader “glial intelligence”
  claims are not established.
- **Primary sources:** `lee2021astrocytes`, `kol2020astrocytes`.
- **Rationale:** The studies motivate a maintenance and consolidation role that
  is separate from the neuron's fast input–output path.
- **Open issue:** Whether one artificial maintenance plane can capture a useful
  common abstraction without becoming an unpriced second model.
- **Used by:** [neuroscience map](neuroscience-opportunity-map.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-022

- **Statement:** During active whisker exploration in awake mice, rotational
  force on the whisker predicted primary mechanosensory-neuron firing better
  than whisker angle in the studied conditions.
- **Status:** established for the measured sensorimotor task.
- **Primary source:** `campagner2016active`.
- **Rationale:** The result demonstrates that self-generated sensing mechanics
  matter to the sensory code. It does not prove that embodiment is required for
  every intelligent capability.
- **Open issue:** Which active interventions add information beyond a matched
  passive multimodal dataset.
- **Used by:** [sensorimotor grounding](../concept/20-sensorimotor-grounding.md),
  [neuroscience map](neuroscience-opportunity-map.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-023

- **Statement:** Faithfully emulating the biological substrate is necessary for,
  or defines the optimal endpoint of, energy-efficient artificial intelligence.
- **Status:** disputed.
- **Primary sources:** none establish this necessity or optimum.
- **Rationale:** Brains and digital systems face different component speeds,
  noise, communication, copying, storage, repair, and optimization constraints.
  Biological observations generate hypotheses; only matched engineering tests
  can choose an implementation.
- **Open issue:** Which biological constraints remain binding after a substrate
  change and which can be escaped.
- **Used by:** [launchpad](../concept/05-biology-is-a-launchpad.md).

### C-024

- **Statement:** Octopus arms combine a segmented axial nerve-cord organization
  with motor strategies that temporarily reduce the control problem by forming
  quasi-jointed structures.
- **Status:** established for the described anatomy and fetching behavior.
- **Primary sources:** `olson2025cephalopod`, `sumbre2005octopus`.
- **Rationale:** The findings support peripheral modularity and degrees-of-
  freedom reduction as biological control strategies. They do not establish
  one universal octopus-style controller.
- **Open issue:** Whether local autonomy plus sparse central override improves
  robust embodied learning at matched capacity.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation).

### C-025

- **Statement:** Feedback inhibition in the Drosophila mushroom body maintains
  sparse, decorrelated odor responses, and disrupting the loop impairs learned
  discrimination of similar odors in the studied experiments.
- **Status:** established for the circuit and odors studied.
- **Primary sources:** `caron2013random`, `lin2014sparse`.
- **Rationale:** The result links sparsification to behavioral discrimination,
  not merely to a compact representation.
- **Open issue:** Whether expand–sparsify–associate improves continual few-shot
  learning once expansion traffic is charged.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-026

- **Statement:** Repeated dehydration can train the transcriptional response of
  a subset of Arabidopsis genes, leaving molecular marks during recovery while
  transcript levels return near baseline.
- **Status:** established for the plants, genes, and protocol studied.
- **Primary source:** `ding2012drought`.
- **Rationale:** The result supports reversible stress priming. It is not
  evidence for general plant cognition or for an AI memory design.
- **Open issue:** Whether explicit decaying priming state improves recurring-
  hazard adaptation without persistent bias.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-027

- **Statement:** A local flow-dependent reinforcement and decay rule can model
  the formation of efficient, fault-tolerant transport networks by *Physarum*
  in the experimental settings studied.
- **Status:** established within the organism experiments and network model.
- **Primary source:** `tero2010network`.
- **Rationale:** The work supplies a concrete decentralized topology rule. It
  does not establish that the same rule is stable for expert routing.
- **Open issue:** Exploration reserves, monopoly prevention, and reconfiguration
  cost under returning task distributions.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology).

### C-028

- **Statement:** Germinal-center affinity maturation combines mutation,
  affinity-dependent selection, expansion, and protection of high-affinity B
  cell lineages through a reduced mutation rate per division in the cited mouse
  experiments.
- **Status:** established for the immunization experiments and model studied.
- **Primary source:** `merkenschlager2025hypermutation`.
- **Rationale:** The result is a concrete explore–select–protect loop. It does
  not license unconstrained mutation of a deployed model.
- **Open issue:** How to bound candidate generation and choose a trustworthy
  artificial affinity test.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-029

- **Statement:** In the cited simulated embodied-agent experiments,
  morphological development exposed body plans robust to controller changes
  and guided evolutionary search through differential canalization.
- **Status:** established within that simulation study.
- **Primary source:** `kriegman2018morphology`.
- **Rationale:** The result motivates joint structural and controller search; it
  does not establish transfer to physical robots or disembodied model topology.
- **Open issue:** Lifecycle energy, reality-gap robustness, and reproducibility
  when structure is also optimized.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-030

- **Statement:** Resting-state human MEG can be described by recurring,
  short-lived network states with distinct spatial, spectral, and phase-coupling
  patterns.
- **Status:** plausible as a general routing principle; established as a result
  of the cited analysis in 55 participants.
- **Primary source:** `vidaurre2018phase`.
- **Rationale:** The measurement supports transient temporal coalitions. It does
  not establish phase coupling as a causal universal communication protocol.
- **Open issue:** Whether phase- or slot-gated artificial communication beats a
  conventional router under the same bandwidth and latency budget.
- **Used by:** [neuroscience map](neuroscience-opportunity-map.md),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-031

- **Statement:** Pharaoh's ants can use bifurcation geometry in a pheromone
  trail network to recover travel direction after joining a trail incorrectly.
- **Status:** established for the species and trail experiments studied.
- **Primary source:** `jackson2004trails`.
- **Rationale:** The environment stores coordination information in its
  geometry, not only in an agent's internal memory or a direct message.
- **Open issue:** Which shared artificial state should be structural, decaying,
  attributable, or access-controlled.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-032

- **Statement:** Stochastic switching between bacterial phenotypes evolved in
  some experimental populations under continually changing selection, allowing
  those lineages to persist across fluctuating conditions.
- **Status:** established for the experimental evolution regime.
- **Primary source:** `beaumont2009bethedging`.
- **Rationale:** The experiment supports diversity as risk spreading when the
  next state is not reliably predictable. It does not establish that arbitrary
  noise improves an AI ensemble.
- **Open issue:** How much diversity is worth maintaining under a measured
  uncertainty and capacity budget.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-033

- **Statement:** During planarian regeneration, wound cells change chromatin
  accessibility according to the polarity of pre-existing tissue through
  Wnt/β-catenin-dependent signaling, helping specify head-versus-tail identity.
- **Status:** established for the molecular interventions and time course
  studied.
- **Primary source:** `pascual2023planarian`.
- **Rationale:** Repair uses distributed positional context to infer what is
  missing rather than replaying a complete stored copy of the body.
- **Open issue:** Whether target-state constraints can guide modular AI repair
  more cheaply than checkpoint restoration or retraining.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-034

- **Statement:** In imaged arbuscular mycorrhizal fungi, pulses of growing tips
  form travelling expansion waves whose density is regulated by fusion while
  the network maintains transport efficiency and adds shorter routes.
- **Status:** established for the strains and two-dimensional culture system
  studied.
- **Primary source:** `oyartegalvez2025fungal`.
- **Rationale:** The result couples cheap frontier exploration, density control,
  topology formation, and resource transport in one decentralized network.
- **Open issue:** Whether an expanding expert graph can preserve transport
  efficiency after charging growth and fusion costs.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-035

- **Statement:** In a two-route experiment, foraging ants concentrated on one
  trail at low density but established a second route under crowding before
  food-return throughput declined; the fitted mechanism included inhibitory
  interactions and reserve capacity.
- **Status:** established for the experimental setup and model studied.
- **Primary source:** `dussutour2004traffic`.
- **Rationale:** The result links local congestion feedback to proactive use of
  capacity reserves.
- **Open issue:** Whether an expert router can open reserve paths before queueing
  creates latency tails, without oscillation or chronic overprovisioning.
- **Used by:** [comparative biology](comparative-biology.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-036

- **Statement:** Closed-loop disruption of replay from a selected hippocampal
  place-cell assembly produced a selective deficit for the associated spatial
  memory in the cited rat experiment.
- **Status:** established for the assembly-specific rodent task studied.
- **Primary source:** `gridchyn2020replay`; broader ripple intervention context
  from `girardeau2009ripples`.
- **Rationale:** The causal content selectivity is stronger evidence than a
  generic association between sleep and memory. It does not establish replay
  as necessary for every memory system.
- **Open issue:** Which artificial memory unit is specific enough to target
  without repeatedly scanning or replaying the full store.
- **Used by:** [memory audit](audits/2026-08-05-memory-replay-forgetting.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-037

- **Statement:** In the cited rat and human studies, replay allocation was
  nonuniform and related to reward or learning, cumulative awake replay and
  familiarity, or estimated memory weakness; the studies do not identify one
  universal priority signal.
- **Status:** established within the individual observational experiments;
  plausible as a general budget-allocation principle.
- **Primary sources:** `singer2009rewardreplay`, `huelingorriz2023replay`, and
  `schapiro2018weakreplay`.
- **Rationale:** Multiple selective signals argue against uniform replay while
  also warning against treating reward, novelty, weakness, and surprise as
  synonyms.
- **Open issue:** Whether a multi-signal scheduler beats loss-, recency-,
  interference-, or temporal-difference-prioritized replay at equal cost.
- **Used by:** [memory audit](audits/2026-08-05-memory-replay-forgetting.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-038

- **Statement:** In a rat paired-associate experiment, previously acquired
  relational structure allowed new compatible associations learned in one
  trial to become persistent and rapidly less hippocampus-dependent.
- **Status:** established for the task and neural interventions studied;
  plausible as a schema-sensitive consolidation principle.
- **Primary source:** `tse2007schema`.
- **Rationale:** The result rejects a fixed consolidation schedule, but it does
  not justify writing apparently compatible artificial memories into slow
  weights without validation.
- **Open issue:** A falsifiable, shortcut-resistant measure of schema fit.
- **Used by:** [memory audit](audits/2026-08-05-memory-replay-forgetting.md),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-039

- **Statement:** Retrieval of an established auditory fear memory rendered its
  later expression sensitive to post-retrieval protein-synthesis inhibition in
  the amygdala in the cited rat experiments.
- **Status:** established for that fear-conditioning preparation; the scope and
  boundary conditions of reconsolidation vary by memory and protocol.
- **Primary source:** `nader2000reconsolidation`.
- **Rationale:** Retrieval can open a temporary update-sensitive state rather
  than only reading a permanently fixed record.
- **Open issue:** How an artificial system should detect, version, test, and
  roll back a memory-specific write window.
- **Used by:** [memory audit](audits/2026-08-05-memory-replay-forgetting.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment).

### C-040

- **Statement:** Prediction error was reported as necessary for retrieval-led
  destabilization of human associative fear memory in one study, but a later
  preregistered experiment did not replicate the proposed boundary conditions.
- **Status:** disputed as a precise general gate.
- **Primary sources:** `sevenster2013prediction` and
  `stemerding2022reconsolidation`.
- **Rationale:** Mismatch remains a useful candidate trigger, but the failed
  replication prevents promotion to a universal memory-update rule.
- **Open issue:** Whether calibrated surprise identifies safe artificial memory
  updates better than recency, conflict, or explicit version changes.
- **Used by:** [memory audit](audits/2026-08-05-memory-replay-forgetting.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-041

- **Statement:** Bidirectional manipulation of ongoing activity in a small set
  of dopaminergic neurons after olfactory learning changed the rate of
  appetitive and aversive memory forgetting in *Drosophila*.
- **Status:** established for the fly circuits and memory tasks studied.
- **Primary source:** `berry2012forgetting`.
- **Rationale:** The result establishes regulated active forgetting, not merely
  passive trace decay, in that preparation.
- **Open issue:** Which digital forgetting actions improve adaptation without
  erasing rare, attributable, or safety-critical state.
- **Used by:** [memory audit](audits/2026-08-05-memory-replay-forgetting.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-042

- **Statement:** In the cited adult-mouse experiments, microglial depletion,
  inhibition of phagocytosis, or engram-targeted complement inhibition reduced
  forgetting in the studied contextual fear-memory preparation.
- **Status:** established for the interventions and memory preparation studied.
- **Primary source:** `wang2020microgliaforgetting`.
- **Rationale:** A maintenance cell population can actively weaken memory by
  complement-dependent synaptic elimination. Literal microglia simulation is
  neither implied nor required.
- **Open issue:** Whether an auditable artificial maintenance process can prune
  memory state more safely and cheaply than passive expiry or retraining.
- **Used by:** [memory audit](audits/2026-08-05-memory-replay-forgetting.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-043

- **Statement:** During mouse retinogeniculate development, relative activity
  and C3/CR3 signaling affected microglial engulfment of inputs, eye-specific
  segregation, and retention of excess synapses.
- **Status:** established for the developmental preparation and interventions.
- **Primary source:** `schafer2012microglia`.
- **Rationale:** A distinct maintenance cell population causally participates
  in activity-sensitive structural refinement; this is not evidence for a
  universal pruning rule or percentage.
- **Open issue:** Whether a separate maintenance actor improves artificial
  topology contraction after its monitoring and rollback costs are counted.
- **Used by:** [neurodevelopment audit](audits/2026-08-05-neurodevelopment-global-control.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-044

- **Statement:** Enzymatic degradation of mature extracellular-matrix
  structures in adult rat visual cortex reopened an ocular-dominance response
  to monocular deprivation that was normally absent after the critical period.
- **Status:** established for the cited visual-cortex preparation.
- **Primary source:** `pizzorusso2002plasticity`.
- **Rationale:** Mature structure can act as a reversible plasticity constraint;
  removing it does not guarantee that subsequent change is useful.
- **Open issue:** How an artificial module can reopen, validate, reconsolidate,
  and roll back mature structure safely.
- **Used by:** [neurodevelopment audit](audits/2026-08-05-neurodevelopment-global-control.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-045

- **Statement:** Loss of the Lynx1 brake in adult mouse visual cortex restored
  a measured form of cholinergic-dependent plasticity, which nicotinic receptor
  antagonism then abolished.
- **Status:** established for the genetic, pharmacological, and visual task.
- **Primary source:** `morishita2010lynx1`.
- **Rationale:** A broad modulatory input and a receiver-local gate jointly
  determine whether a mature circuit changes.
- **Open issue:** Whether module-specific plasticity gates prevent drift better
  than optimizer schedules or parameter regularization.
- **Used by:** [neurodevelopment audit](audits/2026-08-05-neurodevelopment-global-control.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-046

- **Statement:** In *C. elegans*, causal manipulations identified opposing
  serotonergic and PDF systems that bias distributed circuits into persistent
  dwelling or roaming modes.
- **Status:** established for the organism, manipulations, and behaviors.
- **Primary source:** `flavell2013opposingstates`.
- **Rationale:** Low-dimensional, antagonistic signals can coordinate many
  receivers without carrying a detailed point-to-point command.
- **Open issue:** Whether rate-limited antagonistic context channels beat
  ordinary gates, FiLM, or supervisory control at equal communication cost.
- **Used by:** [neurodevelopment audit](audits/2026-08-05-neurodevelopment-global-control.md),
  [context-broadcast experiment](../experiments/candidates/002-multiscale-context-broadcast.md).

### C-047

- **Statement:** Optogenetic activation of mouse locus-coeruleus neurons showed
  that stimulation frequency and duration changed immediate arousal,
  sustained wakefulness, and locomotion non-monotonically.
- **Status:** established for the cited acute interventions.
- **Primary source:** `carter2010locuscoeruleus`.
- **Rationale:** A broadcast's temporal pattern can carry control information;
  stronger or longer is not equivalent to a scalar gain increase.
- **Open issue:** Whether multiple rates add value after their communication,
  filter-state, and stability costs are charged.
- **Used by:** [neurodevelopment audit](audits/2026-08-05-neurodevelopment-global-control.md),
  [context-broadcast experiment](../experiments/candidates/002-multiscale-context-broadcast.md).

### C-048

- **Statement:** In *C. elegans*, combinations and locations of serotonin
  receptors produced interacting, transient, and sustained responses to
  activation of one serotonergic source.
- **Status:** established for the receptor panel, restoration experiments, and
  measured behaviors.
- **Primary source:** `dag2023serotonergic`.
- **Rationale:** Receiver identity and local circuit location can decode the
  same broadcast differently across timescales.
- **Open issue:** Whether receiver-specific filters provide benefit beyond a
  low-rank hypernetwork or per-module recurrent gate.
- **Used by:** [neurodevelopment audit](audits/2026-08-05-neurodevelopment-global-control.md),
  [context-broadcast experiment](../experiments/candidates/002-multiscale-context-broadcast.md).

### C-049

- **Statement:** In cultured rat hippocampal neurons, action-potential trains
  increased presynaptic ATP demand, recruited local production, and made
  ongoing vesicle cycling sensitive to brief production blockade.
- **Status:** established for the optical reporter and perturbations used.
- **Primary source:** `rangaraju2014atp`.
- **Rationale:** Resource supply can be use-coupled at the site of work rather
  than represented only by a global average budget.
- **Open issue:** Whether local compute/energy backpressure improves allocation
  over a centralized scheduler on actual hardware.
- **Used by:** [neurodevelopment audit](audits/2026-08-05-neurodevelopment-global-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation).

### C-050

- **Statement:** Genetic removal and rescue of syntaphilin changed axonal
  mitochondrial mobility, density, calcium handling, and short-term synaptic
  facilitation in the cited mouse-neuron experiments.
- **Status:** established for the measured cellular system.
- **Primary source:** `kang2008mitochondria`.
- **Rationale:** Placement of a resource changes local dynamics, while movement
  and docking themselves incur costs.
- **Open issue:** Which state should move to compute, which compute should move
  to state, and when migration amortizes.
- **Used by:** [neurodevelopment audit](audits/2026-08-05-neurodevelopment-global-control.md),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-051

- **Statement:** Neural activity and glutamate recruited capillary dilation at
  pericyte locations in rodent preparations, and sensory-evoked capillary
  dilation preceded arteriole dilation in vivo.
- **Status:** established for the cited preparations and pharmacological path;
  quantitative allocation beyond them remains uncertain.
- **Primary source:** `hall2014pericytes`.
- **Rationale:** An adjacent infrastructure layer can translate local demand
  signals into physical supply changes.
- **Open issue:** Whether an artificial resource plane can respond locally
  without unstable oscillation or starving neighboring modules.
- **Used by:** [neurodevelopment audit](audits/2026-08-05-neurodevelopment-global-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-052

- **Statement:** In a controlled Y-maze experiment, larger stickleback groups
  discounted an isolated replica cue and showed a nonlinear response to added
  social support; coordinated bad cues could still capture the decision.
- **Status:** established for the apparatus and fitted response class.
- **Primary source:** `ward2008quorum`.
- **Rationale:** The useful candidate is nonlinear support relative to
  opposition and abstention, not the slogan “majority vote.”
- **Open issue:** Whether quorum gating beats calibrated confidence clipping
  under correlated errors and abstentions.
- **Used by:** [collective audit](audits/2026-08-05-collective-ecological-resilience.md).

### C-053

- **Statement:** In a collective-motion model and golden-shiner experiments,
  socially responsive fish without a trained directional preference reduced
  capture by a strongly opinionated minority under studied conflicts.
- **Status:** established for the model–experiment conditions; not a general
  theorem about uninformed agents.
- **Primary source:** `couzin2011uninformed`.
- **Rationale:** Abstaining participants can change collective gain without
  injecting an alternative claim or random noise.
- **Open issue:** Whether this differs materially from confidence calibration or
  robust aggregation in artificial ensembles.
- **Used by:** [collective audit](audits/2026-08-05-collective-ecological-resilience.md).

### C-054

- **Statement:** Lagged directional correlations in small homing-pigeon flocks
  revealed a sparse, directed leader–follower hierarchy associated with spatial
  position and visual laterality.
- **Status:** plausible as a causal communication structure because the study
  inferred influence from telemetry without leader intervention.
- **Primary source:** `nagy2010pigeons`.
- **Rationale:** The result supports sparse directed effective connectivity, not
  a claim that hierarchy is universally efficient.
- **Open issue:** Whether learned lag graphs reduce communication while
  tolerating leader failure better than top-$k$ messaging.
- **Used by:** [collective audit](audits/2026-08-05-collective-ecological-resilience.md),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-055

- **Statement:** Reintroducing *Clostridium scindens* after antibiotic exposure
  enhanced mouse resistance to *C. difficile* through a bile-acid-dependent
  shared chemical environment.
- **Status:** established for the mouse intervention and substrate dependence;
  not a human treatment claim.
- **Primary source:** `buffie2015microbiome`.
- **Rationale:** Shared state can alter which behaviors or invaders remain
  viable, not merely carry a message.
- **Open issue:** Whether a reversible digital substrate transformation can
  enforce admission more cheaply than centralized screening.
- **Used by:** [collective audit](audits/2026-08-05-collective-ecological-resilience.md),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-056

- **Statement:** Genome-guided identification of missing functions and addition
  of three selected strains repaired colonization resistance in a defined
  mouse microbial community for the tested *Salmonella* challenge.
- **Status:** established for the design workflow and mouse model.
- **Primary source:** `brugiroux2017oligomm`.
- **Rationale:** Modular repair can select candidates by missing capability
  rather than count, taxonomic resemblance, or random replacement.
- **Open issue:** Whether capability-gap expert admission predicts expressed
  function and beats size-matched search.
- **Used by:** [collective audit](audits/2026-08-05-collective-ecological-resilience.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-057

- **Statement:** A genomic functional-redundancy measure was negatively
  associated with donor-strain engraftment in two small reanalyzed human fecal
  microbiota-transplant datasets.
- **Status:** plausible as a niche-occupancy mechanism; causal redundancy was
  not randomized and genomic potential is not expressed function.
- **Primary source:** `tian2020redundancy`.
- **Rationale:** Redundant mature capacity may resist harmful and beneficial
  newcomers, making stability and adaptability opposing objectives.
- **Open issue:** Whether functional overlap predicts expert admission after
  controlling capacity, initialization, routing, and optimizer state.
- **Used by:** [collective audit](audits/2026-08-05-collective-ecological-resilience.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-058

- **Statement:** Recovery from small dilution perturbations slowed and passive
  autocorrelation rose as a cyanobacterial microcosm approached a controlled
  photo-inhibition tipping point.
- **Status:** established for the corrected experiment; not universal for all
  transitions or software failures.
- **Primary source:** `veraart2012recovery`.
- **Rationale:** Return dynamics can reveal weakening restoring forces before a
  snapshot metric crosses a failure threshold.
- **Open issue:** Whether bounded active probes add lead time beyond standard
  system identification at acceptable service and energy cost.
- **Used by:** [collective audit](audits/2026-08-05-collective-ecological-resilience.md),
  [fragility experiment](../experiments/candidates/003-recovery-dynamics-fragility.md).

### C-059

- **Statement:** During a three-year predator manipulation of one lake with an
  adjacent reference, statistical warning signals appeared during food-web
  reorganization before the manipulated regime transition was complete.
- **Status:** established for one manipulated and one reference lake; general
  false-positive rates cannot be inferred.
- **Primary source:** `carpenter2011lake`.
- **Rationale:** Recovery/fluctuation diagnostics can survive a distributed,
  multicomponent field system, but provide no universal threshold.
- **Open issue:** Whether multivariate service-network diagnostics outperform
  component SLOs and matched shadow deployments.
- **Used by:** [collective audit](audits/2026-08-05-collective-ecological-resilience.md),
  [fragility experiment](../experiments/candidates/003-recovery-dynamics-fragility.md).

### C-060

- **Statement:** In 690 aquatic ciliate microcosms, increased species richness
  improved temporal stability but reduced resistance to a warming perturbation
  under the study's measures.
- **Status:** established for the manipulated communities, duration, and
  perturbation.
- **Primary source:** `pennekamp2018stability`.
- **Rationale:** “Resilience” is a vector; diversity can move stability,
  resistance, recovery, and adaptability in different directions.
- **Open issue:** Which raw resilience dimensions and tradeoffs matter for
  modular AI under shift, faults, and newcomer admission.
- **Used by:** [collective audit](audits/2026-08-05-collective-ecological-resilience.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-061

- **Statement:** In a learned delayed-choice task, rat hippocampal ensembles
  expressed ordered sequences without changing external location, and sequence
  state predicted later choices including errors.
- **Status:** established for the learned task; not evidence of experience-free
  or human creativity.
- **Primary source:** `pastalkova2008sequences`.
- **Rationale:** Structured endogenous trajectories can be generated from
  internal and remembered state rather than copied from concurrent input.
- **Open issue:** Whether internally generated rollouts add useful novelty
  beyond sampling a learned policy at the same candidate budget.
- **Used by:** [generation audit](audits/2026-08-05-endogenous-generation-creativity.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment).

### C-062

- **Statement:** Preschoolers preferentially explored toys after observing
  confounded rather than matched unconfounded evidence and often acted to
  disambiguate possible causes.
- **Status:** established for the developmental experiment.
- **Primary source:** `schulz2007seriousfun`.
- **Rationale:** A learner can actively create informative observations rather
  than only absorb or imitate a fixed dataset.
- **Open issue:** Whether an artificial agent's targeted interventions beat
  random exploration and value-of-information baselines at matched cost.
- **Used by:** [generation audit](audits/2026-08-05-endogenous-generation-creativity.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-063

- **Statement:** In two toy studies, pedagogical demonstration caused
  preschoolers to focus more narrowly on the demonstrated function than
  several non-pedagogical or interrupted conditions.
- **Status:** established for the designed tasks; not a general claim that
  teaching reduces learning.
- **Primary source:** `bonawitz2011pedagogy`.
- **Rationale:** Social demonstration changes the learner's inference and can
  trade off against self-generated discovery.
- **Open issue:** How training systems should balance high-quality imitation
  data with preserving uncertainty and affordance search.
- **Used by:** [generation audit](audits/2026-08-05-endogenous-generation-creativity.md).

### C-064

- **Statement:** Chimpanzees more often omitted demonstrated, causally
  irrelevant actions when a puzzle box was transparent, while young children
  copied those actions at high fidelity in both transparent and opaque tasks.
- **Status:** established for the comparative experiment; not a species-wide
  ranking of causal reasoning.
- **Primary source:** `horner2005imitation`.
- **Rationale:** Action imitation, outcome emulation, and causal inference are
  separable learning operations.
- **Open issue:** When should an artificial learner copy a demonstrated process
  versus infer and reproduce only its causal effect.
- **Used by:** [generation audit](audits/2026-08-05-endogenous-generation-creativity.md).

### C-065

- **Statement:** Rat choice variability and human motor variability changed
  systematically with task context or learning and were linked to measured
  neural or behavioral mechanisms rather than behaving as fixed random noise.
- **Status:** established within the two task-specific experiments; plausible
  as a general adaptive-variability principle.
- **Primary sources:** `tervo2014variability`, `wu2014motorvariability`.
- **Rationale:** Stochasticity can be a controlled search resource, but more
  variability is not automatically more creative or more useful.
- **Open issue:** Whether learned variance control beats fixed-temperature
  sampling after candidate, failure, and interaction budgets are equalized.
- **Used by:** [generation audit](audits/2026-08-05-endogenous-generation-creativity.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-066

- **Statement:** Patients with primary bilateral hippocampal damage were
  markedly impaired relative to controls at constructing coherent new imagined
  scenes from short verbal cues in the cited study.
- **Status:** established for the small lesion study; the exact hippocampal
  boundary and generality remain debated.
- **Primary source:** `hassabis2007imagination`.
- **Rationale:** New imagined experience can depend on structured binding of
  remembered elements, not stochastic recombination alone.
- **Open issue:** Which separable generator, relational workspace, memory, and
  evaluator components are causally necessary in an artificial system.
- **Used by:** [generation audit](audits/2026-08-05-endogenous-generation-creativity.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

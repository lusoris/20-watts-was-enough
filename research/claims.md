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

- **Statement:** Metabolic accounting places the adult human brain's whole-organ
  power budget at approximately 17–20 W. Within that budget, the cost of neural
  signaling constrains how much cortex can be strongly active at once.
- **Status:** established for the cited whole-organ range and scoped biological
  energy accounts—not as a direct digital efficiency ratio.
- **Primary sources:** `levy2021communication`, `attwell2001energy`,
  `lennie2003cost`.
- **Rationale:** Levy and Calvert derive a 17–20 W whole-brain glucose power
  budget before partitioning it by tissue and function. Attwell and Laughlin
  model signaling cost; Lennie argues that substantially active neurons must be
  a small fraction of cortex.
- **Open issue:** The range depends on metabolic measurement and accounting
  assumptions, while effective computation is not a task-independent physical
  quantity.
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

### C-067

- **Statement:** A data-constrained pituitary–adrenal model showed that delayed
  feed-forward and glucocorticoid negative-feedback interactions can generate
  ultradian pulses without an ultradian hypothalamic input.
- **Status:** plausible model sufficiency supported by in-vivo pattern
  comparison, not exhaustive causal exclusion.
- **Primary source:** `walker2010ultradian`.
- **Rationale:** Delay and feedback can create a temporal carrier rather than
  merely attenuating a scalar signal.
- **Open issue:** Whether an identified delayed controller explains a target
  workload better than ordinary control and oscillator models.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-068

- **Statement:** In the cited cell and animal preparations, pulsatile and
  constant glucocorticoid exposure produced different receptor-occupancy and
  transcription dynamics.
- **Status:** established for the measured preparations and waveforms.
- **Primary source:** `stavreva2009ultradian`.
- **Rationale:** Integrated signal magnitude alone did not specify the measured
  receiver response; waveform timing carried functionally relevant structure.
- **Open issue:** Whether a rate-limited artificial broadcast benefits from
  pulse timing beyond matched FIR, recurrent, and modulation baselines.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md).

### C-069

- **Statement:** At matched portal insulin delivery rate, physiological pulses
  produced stronger measured hepatic action and signaling than constant
  delivery in the cited dog and rat experiments.
- **Status:** established for the interventions, species, and endpoints.
- **Primary source:** `matveyenko2012pulsatile`.
- **Rationale:** Temporal delivery pattern altered downstream response while
  the comparison held mean delivery rate constant.
- **Open issue:** Which receiver dynamics explain the effect and whether their
  artificial analogue beats standard pulse/frequency modulation.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md).

### C-070

- **Statement:** In perifused LβT2 cells, GnRH pulse frequency differentially
  regulated LHβ and FSHβ promoter activity, and changing receptor abundance
  selectively altered frequency decoding.
- **Status:** established for the cell-line promoter assay.
- **Primary source:** `bedecarrats2003gnrh`.
- **Rationale:** Receiver configuration changed how the same source channel's
  temporal pattern was interpreted.
- **Open issue:** Whether receiver-specific artificial state is useful beyond
  an identified filter bank or parameter-matched recurrent gate.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md).

### C-071

- **Statement:** An encapsulated SCN graft that prevented neural outgrowth but
  permitted diffusion restored circadian locomotor rhythmicity in SCN-lesioned
  hamsters.
- **Status:** established for the transplant preparation and behavioral
  endpoint.
- **Primary source:** `silver1996diffusible`.
- **Rationale:** A diffusible output from a pacemaker was sufficient for the
  measured behavioral rhythm without reconstructing the original neural path.
- **Open issue:** The signal dimensionality, receiver computation, and resource
  benefit needed for an artificial broadcast remain unmeasured.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions),
  [Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md).

### C-072

- **Statement:** Dexamethasone phase-shifted peripheral but not SCN clock-gene
  rhythms, and the measured hepatic shift required local glucocorticoid
  receptors while baseline liver rhythmicity had redundant support.
- **Status:** established for the cited mouse and cell interventions.
- **Primary source:** `balsalobre2000resetting`.
- **Rationale:** A shared entraining signal was interpreted by local receptor
  state and reset selected autonomous oscillators.
- **Open issue:** Whether persistent local phase is a distinct artificial
  primitive or ordinary local-clock discipline.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-073

- **Statement:** Isolated mouse peripheral tissues sustained tissue-specific
  PERIOD2 rhythms for more than twenty cycles, while SCN lesions caused
  peripheral phase desynchrony rather than abolishing local oscillation.
- **Status:** established for the reporter, tissues, and lesion experiment.
- **Primary source:** `yoo2004period2`.
- **Rationale:** Local oscillators retained state autonomously but required
  coordination to remain aligned as a composed system.
- **Open issue:** When sparse phase correction offers an advantage over a
  timestamp, phase-locked loop, or distributed-clock protocol.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-074

- **Statement:** Restricted daytime feeding gradually shifted mouse peripheral
  clocks by up to twelve hours with tissue-specific kinetics while leaving the
  SCN clock largely unchanged.
- **Status:** established for the feeding schedules, tissues, and gene-
  expression measurements.
- **Primary source:** `damiola2000feeding`.
- **Rationale:** Different local oscillators could be entrained by a resource
  schedule distinct from the central pacemaker.
- **Open issue:** Artificial multi-source entrainment must beat conventional
  scheduling and clock-skew correction at equal state and communication cost.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-075

- **Statement:** VIP or VPAC2 loss reduced rhythmicity and synchrony among
  mouse SCN neurons, and periodic VPAC2 agonist rescued VIP-deficient but not
  receptor-deficient tissue.
- **Status:** established for the genetic, pharmacological, neuronal, and
  behavioral assays.
- **Primary source:** `aton2005vip`.
- **Rationale:** Synchronization depended on both a shared signal and matching
  receiver machinery.
- **Open issue:** The artificial discriminant is receiver-specific temporal
  decoding beyond ordinary recurrent state and clock coupling.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions),
  [Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md).

### C-076

- **Statement:** In the cited SCN/lung experiments and oscillator analysis,
  stronger inter-oscillator coupling increased rigidity and narrowed the range
  of external entrainment; pharmacological coupling reduction broadened SCN
  entrainment.
- **Status:** established for the preparation and model-supported mechanism.
- **Primary source:** `abraham2010coupling`.
- **Rationale:** Coordination strength exposed a tradeoff between coherence,
  noise rejection, and speed or range of adaptation.
- **Open issue:** Whether the same tradeoff predicts useful coupling schedules
  in modular artificial systems.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-077

- **Statement:** In high-fat-fed mice consuming equivalent calories, an eight-
  hour daily feeding window changed circadian and metabolic dynamics and
  improved the measured metabolic outcomes relative to ad-libitum access.
- **Status:** established for the mouse intervention; phase, fasting duration,
  and intake distribution remain mechanistically entangled.
- **Primary source:** `hatori2012timerestricted`.
- **Rationale:** Timing of a fixed total resource can affect a composed system,
  motivating schedule as an explicit variable rather than a free detail.
- **Open issue:** Artificial benefits must survive fixed-window, batching,
  earliest-deadline-first, and optimized scheduling baselines.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-078

- **Statement:** In a ten-person forced-desynchrony study with controlled
  isocaloric meals, behavioral/endogenous circadian misalignment degraded
  multiple metabolic, endocrine, cardiovascular, and sleep measures.
- **Status:** established for the protocol and sample; effect sizes are not
  universal constants.
- **Primary source:** `scheer2009misalignment`.
- **Rationale:** Individually functioning schedules can conflict and degrade a
  composed system when their phase relations drift.
- **Open issue:** Whether local phase diagnostics improve artificial failure
  detection beyond clock-skew alarms and end-to-end service monitoring.
- **Used by:** [endocrine/circadian audit](audits/2026-08-05-endocrine-circadian-control.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-079

- **Statement:** For a code with minimum Hamming distance $d_{\min}$, unique
  bounded-distance decoding corrects at most
  $\lfloor(d_{\min}-1)/2\rfloor$ unknown-location symbol errors or
  $d_{\min}-1$ known erasures under the code and decoder assumptions.
- **Status:** established.
- **Primary sources:** `hamming1950error`, `reed1960polynomial` for the MDS
  Reed–Solomon specialization.
- **Rationale:** Exact reconstruction from deliberately encoded redundancy is
  the engineering null for restoring lost digital state.
- **Open issue:** Which AI state boundaries permit coding without dominant
  encode, decode, synchronization, or refresh cost.
- **Used by:** [fault-tolerance audit](audits/2026-08-05-fault-tolerance-and-reconstruction.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-080

- **Statement:** Distributed storage codes trade storage per node, repair
  bandwidth, locality, and erasure distance; reducing the number of helpers or
  bytes read is not a free improvement in robustness.
- **Status:** established for the cited coding results and deployed storage
  design.
- **Primary sources:** `dimakis2010network`, `gopalan2012locality`,
  `huang2012azure`.
- **Rationale:** Local reconstruction already has formal engineering
  mechanisms and lower bounds that any module-repair proposal must face.
- **Open issue:** Whether modular AI state exposes algebraic or semantic
  structure that permits low-fan-in repair without remote regressions.
- **Used by:** [fault-tolerance audit](audits/2026-08-05-fault-tolerance-and-reconstruction.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-081

- **Statement:** Under Poisson fail-stop assumptions, checkpoint/restart has an
  optimal interval determined by checkpoint duration and failure rate; exact
  rollback loses post-checkpoint work and preserves corruption already present
  in the saved state.
- **Status:** established under the cited failure and cost models.
- **Primary sources:** `young1974checkpoint`, `daly2006checkpoint`.
- **Rationale:** Checkpoint restoration is the minimum baseline for AI module
  rollback, with measurable normal-path and expected-rework costs.
- **Open issue:** How semantic validation latency, correlated failure, and
  lifecycle energy change the optimum for learned systems.
- **Used by:** [fault-tolerance audit](audits/2026-08-05-fault-tolerance-and-reconstruction.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state),
  [hardening](../concept/60-hardening-and-factual-memory.md).

### C-082

- **Statement:** In asynchronous crash-prone systems, failure detectors are
  characterized by completeness and accuracy rather than perfect instantaneous
  diagnosis; monitoring latency and false suspicion depend on timing
  assumptions.
- **Status:** established in the cited distributed-systems framework.
- **Primary source:** `chandra1996failure`.
- **Rationale:** A repair controller must expose detection errors and delay
  instead of treating a health signal as fault ground truth.
- **Open issue:** Whether recovery-dynamics probes add calibrated lead time over
  standard detectors and residual tests at equal disturbance and energy.
- **Used by:** [fault-tolerance audit](audits/2026-08-05-fault-tolerance-and-reconstruction.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md).

### C-083

- **Statement:** Majority crash-fault replication maintains an ordered log
  while a quorum is available, whereas PBFT requires at least $3f+1$ replicas
  to tolerate $f$ Byzantine faults under its model; neither protects against
  unrestricted common-mode semantic failure.
- **Status:** established for the cited protocol models and guarantees.
- **Primary sources:** `ongaro2014raft`, `castro1999pbft`.
- **Rationale:** Replication is the null for protected populations, while the
  fault model determines whether nominal diversity is useful.
- **Open issue:** Whether deliberately heterogeneous experts reduce measured
  common-mode failure enough to repay selection and validation cost.
- **Used by:** [fault-tolerance audit](audits/2026-08-05-fault-tolerance-and-reconstruction.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-084

- **Statement:** A self-stabilizing distributed algorithm can converge from an
  arbitrary initial state to an encoded legitimate-state set without an
  external exact copy, under its scheduler and fault assumptions.
- **Status:** established for the cited formal construction.
- **Primary source:** `dijkstra1974selfstabilizing`.
- **Rationale:** This is the engineering null for target-state repair: the
  intended set is encoded in rules instead of a snapshot.
- **Open issue:** Whether learned context-dependent target constraints can
  retain convergence, closure, and service guarantees.
- **Used by:** [fault-tolerance audit](audits/2026-08-05-fault-tolerance-and-reconstruction.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-085

- **Statement:** An integrity scrub reads and verifies all covered state and
  repairs detected corruption only when a valid redundant copy or parity
  reconstruction remains available; full scanning consumes I/O and energy.
- **Status:** established for the cited storage-system operation.
- **Primary source:** `openzfs2024scrub`.
- **Rationale:** Background integrity maintenance is established engineering;
  its coverage, bandwidth, and energy are explicit rather than free.
- **Open issue:** Which behavioral probes provide semantic-fault coverage per
  joule without overfitting the validation suite.
- **Used by:** [fault-tolerance audit](audits/2026-08-05-fault-tolerance-and-reconstruction.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [hardening](../concept/60-hardening-and-factual-memory.md).

### C-086

- **Statement:** When no clean exact state exists and multiple internal states
  could restore a missing capability, context-conditioned constraint-guided
  repair may occupy a better energy–latency–storage–regression frontier than
  checkpoint restore, replication, retraining, or unconstrained module search.
- **Status:** speculative project hypothesis after engineering deduplication.
- **Primary source:** none sufficient; biological leads are scoped in
  [C-033](#c-033) and capability-gap repair in [C-056](#c-056).
- **Rationale:** It is the residual mechanism not collapsed into exact restore,
  encoded reconstruction, or programmed legitimate-set convergence.
- **Open issue:** It must win on common-mode semantic or novel capability faults
  while exact methods correctly dominate ordinary corruption and loss.
- **Used by:** [fault-tolerance audit](audits/2026-08-05-fault-tolerance-and-reconstruction.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-087

- **Statement:** Endoplasmic-reticulum stress can activate PERK-dependent
  phosphorylation of eIF2alpha and rapidly reduce translation initiation,
  shedding incoming folding load before slower capacity changes take effect.
- **Status:** established in the cited cellular mechanism.
- **Primary source:** `Harding1999PERK`.
- **Rationale:** Fast admission throttling and slower recovery are separable
  actions, providing a concrete multirate maintenance pattern.
- **Open issue:** Timing, reversibility, and benefit depend on stress class; no
  direct AI-system advantage follows from the biology alone.
- **Used by:** [cellular quality-control audit](audits/2026-08-05-cellular-quality-control.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-088

- **Statement:** In the cited mouse deletion study, ATF6alpha was largely
  dispensable under basal conditions but important for folding, secretion,
  degradation, recovery, and survival during sustained ER challenge.
- **Status:** established for the cited preparation.
- **Primary source:** `Wu2007ATF6`.
- **Rationale:** A maintenance path can appear unnecessary at nominal load yet
  determine survival under persistent challenge.
- **Open issue:** Dependencies vary by tissue, duration, and stressor.
- **Used by:** [cellular quality-control audit](audits/2026-08-05-cellular-quality-control.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-089

- **Statement:** CHOP-driven restoration of protein-synthesis and oxidative
  load can worsen unresolved ER stress; in the cited preparations, suppressing
  that recovery arm reduced toxicity.
- **Status:** established in the cited genetic and pharmacological preparations.
- **Primary source:** `Marciniak2004CHOP`.
- **Rationale:** Returning throughput toward nominal levels is not evidence that
  the underlying fault has cleared; release requires an explicit gate.
- **Open issue:** The boundary between useful restart and destructive
  overcorrection must be measured for each stress regime.
- **Used by:** [cellular quality-control audit](audits/2026-08-05-cellular-quality-control.md),
  [P-003](principle-registry.md#p-003--reversible-commitment),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-090

- **Statement:** In the cited Hsp90–glucocorticoid-receptor system, the
  co-chaperone CHIP remodeled the complex, induced client ubiquitination, and
  shifted the client from folding toward proteasomal degradation.
- **Status:** established for the cited substrate and preparation.
- **Primary source:** `Connell2001CHIP`.
- **Rationale:** Repair and destruction are policy alternatives selected from
  evidence about an item, not interchangeable labels for maintenance.
- **Open issue:** Generality across substrates and the quantitative
  repair-versus-degradation decision rule remain unresolved.
- **Used by:** [cellular quality-control audit](audits/2026-08-05-cellular-quality-control.md),
  [P-003](principle-registry.md#p-003--reversible-commitment),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-091

- **Statement:** In the cited yeast and mammalian culture models, soluble
  ubiquitinated clients and terminal aggregates partitioned into distinct
  quality-control compartments, and changing ubiquitination changed routing.
- **Status:** established in the cited preparations.
- **Primary source:** `Kaganovich2008Compartments`.
- **Rationale:** Tagged state and physical condition can select a containment
  route before repair, recycling, or removal is attempted.
- **Open issue:** Sequestration can be protective, degradative, saturated, or
  harmful depending on cargo and context.
- **Used by:** [cellular quality-control audit](audits/2026-08-05-cellular-quality-control.md),
  [P-008](principle-registry.md#p-008--modular-containment),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-092

- **Statement:** In the cited cellular preparations, stress-responsive
  mitochondrial-derived vesicles transported selected mitochondrial cargo to
  lysosomes without whole-organelle mitophagy.
- **Status:** established route in the cited preparations.
- **Primary source:** `Soubannier2012MDV`.
- **Rationale:** Selective extraction can be a lower-scope maintenance action
  than replacing an entire component.
- **Open issue:** Cargo-selection rules, in-vivo prevalence, and demonstrated
  restoration of component function remain incomplete.
- **Used by:** [cellular quality-control audit](audits/2026-08-05-cellular-quality-control.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-093

- **Statement:** PINK1-dependent ubiquitin Ser65 phosphorylation activates
  Parkin after induced mitochondrial depolarization, but basal mitophagy in
  several high-demand mouse tissues persisted without PINK1.
- **Status:** established for the scoped damage-triggered mechanism; disputed
  as a universal account of basal mitophagy.
- **Primary sources:** `Koyano2014PhosphoUbiquitin`,
  `McWilliams2018BasalMitophagy`.
- **Rationale:** Amplified damage tagging can support decisive removal, while
  trigger scope and parallel turnover routes must remain explicit.
- **Open issue:** Physiological trigger regimes and pathway redundancy.
- **Used by:** [cellular quality-control audit](audits/2026-08-05-cellular-quality-control.md),
  [P-003](principle-registry.md#p-003--reversible-commitment),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-094

- **Statement:** In the cited preparations, ESCRT machinery arrived before
  Galectin-3-dependent lysophagy after reversible lysosomal injury, and
  disrupting ESCRT repair converted reversible damage into lethal damage.
- **Status:** established in the cited cultured-cell and infection-associated
  preparations.
- **Primary source:** `Radulovic2018LysosomeRepair`.
- **Rationale:** A fast repair attempt can precede destructive replacement when
  damage remains locally reversible.
- **Open issue:** The severity boundary and generality across organelles are
  unresolved.
- **Used by:** [cellular quality-control audit](audits/2026-08-05-cellular-quality-control.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-095

- **Statement:** Galectin-3 sensing of damage-exposed glycans supported
  ALIX/ESCRT repair, later autophagic responses, and, when those responses
  failed, TFEB-associated replacement signaling in the cited study.
- **Status:** plausible as an integrated severity-ordered policy; the
  individual subprocesses are established in the cited preparations.
- **Primary source:** `Jia2020Galectin3`.
- **Rationale:** A shared damage signal may coordinate repair, containment,
  removal, and replenishment without treating them as one operation.
- **Open issue:** Action thresholds, verification, pathogen exploitation, and
  whether staged action beats parallel action require direct tests.
- **Used by:** [cellular quality-control audit](audits/2026-08-05-cellular-quality-control.md),
  [P-003](principle-registry.md#p-003--reversible-commitment),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-096

- **Statement:** In the cited *C. elegans* interventions, impaired
  `dct-1`-dependent mitophagy reduced stress resistance and activated
  SKN-1-dependent regulation of both mitophagy and mitochondrial-biogenesis
  genes.
- **Status:** established in the cited interventions.
- **Primary source:** `Palikaras2015MitophagyBiogenesis`.
- **Rationale:** Removal and replenishment are coupled capacity decisions;
  destructive maintenance without replacement can deplete the system it
  protects.
- **Open issue:** Mammalian generality, energetic cost, and over-replacement.
- **Used by:** [cellular quality-control audit](audits/2026-08-05-cellular-quality-control.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-097

- **Statement:** In forced CLIMBER2 thermohaline-circulation experiments, a
  leading-mode estimate of the smallest decay rate decreased toward zero before
  the model's bifurcation and collapse.
- **Status:** established for the declared numerical model.
- **Primary source:** `held2004degenerate`.
- **Rationale:** Recovery-rate estimation can track gradual local stability loss
  when the weakening mode is observable.
- **Open issue:** It must beat standard state-space and system-identification
  estimators under the same excitation and history budget.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-098

- **Statement:** In one freshwater-hosed fully coupled atmosphere–ocean model,
  variance and lag-1 autocorrelation produced spatially variable warning up to
  250 model years before collapse after roughly 550 years of monitoring.
- **Status:** established for the declared model experiment, not as an Earth
  forecast.
- **Primary source:** `boulton2014amoc`.
- **Rationale:** Warning quality can depend on sensor location, mode projection,
  and long observation history.
- **Open issue:** Whether active or multivariate sensing can find informative
  projections cheaply enough in an engineered system.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-099

- **Statement:** Eleven intermediate-complexity climate models showed AMOC
  hysteresis under slow freshwater sweeps while materially disagreeing about
  present-state bistability and distance to the modeled threshold.
- **Status:** established model-intercomparison result.
- **Primary source:** `rahmstorf2005hysteresis`.
- **Rationale:** Path dependence can be robust while threshold location and
  current branch membership remain uncertain.
- **Open issue:** Recovery tests must distinguish return rate from recoverable
  path and cannot infer rollback from local stability alone.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-100

- **Statement:** A quasi-static Parallel Ice Sheet Model experiment produced
  multiple Antarctic ice-loss thresholds and reverse paths that did not restore
  the current configuration at present-day temperature.
- **Status:** established for the model and forcing protocol; threshold values
  are model-conditioned.
- **Primary source:** `garbe2020antarctic`.
- **Rationale:** Reversing an input does not guarantee restoration of prior
  state when the state–control relation is hysteretic.
- **Open issue:** Engineered rollback claims need branch identity, recovery
  target, and return-path tests.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [hardening](../concept/60-hardening-and-factual-memory.md).

### C-101

- **Statement:** A global ocean model collapsed under sufficiently rapid,
  small-amplitude freshwater forcing while slower forcing to the same level did
  not, demonstrating rate-induced tipping in that model.
- **Status:** established for the declared model.
- **Primary source:** `lohmann2021rate`.
- **Rationale:** Input rate can exceed tracking capacity even when the final
  input magnitude is nominally tolerable.
- **Open issue:** Candidate 003 must include rate-induced transitions that may
  not exhibit the same local slowing signal.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-102

- **Statement:** Bifurcation-, noise-, and rate-induced tipping are distinct
  dynamical mechanisms; local critical slowing is not required for the latter
  two.
- **Status:** established theoretical distinction; empirical prevalence is
  system-specific.
- **Primary sources:** `ashwin2012open`, `ritchie2016rate`.
- **Rationale:** A recovery-rate alarm has a defined applicability class rather
  than serving as a universal transition detector.
- **Open issue:** The transition class is itself partially observed and must be
  inferred without oracle fault labels.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md).

### C-103

- **Statement:** Eight selected palaeoclimate proxy records showed rising
  autocorrelation before known abrupt transitions, but their retrospective,
  event-conditioned selection does not establish prospective false-alarm rates.
- **Status:** established for the analyzed records; predictive interpretation
  remains plausible but unvalidated.
- **Primary sources:** `dakos2008climate`, `boettiger2012prosecutor`.
- **Rationale:** Conditioning the dataset on known failures can make a detector
  look more reliable than it is in continuous operation.
- **Open issue:** Prospective negative controls and full non-event intervals are
  required.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md).

### C-104

- **Statement:** In aligned NGRIP records of 25 Dansgaard–Oeschger events, the
  cited analysis found no significant joint increase in variance and
  autocorrelation before the jumps.
- **Status:** established result of that analysis; noise-induced attribution is
  plausible rather than uniquely identified.
- **Primary source:** `ditlevsen2010wishful`.
- **Rationale:** Abrupt transitions can occur without the canonical warning
  signature.
- **Open issue:** Candidate detectors must report class-conditional misses, not
  only successful warning examples.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md).

### C-105

- **Statement:** In one retrospective lake-sediment record and matched model,
  rising variance with decreasing autocorrelation and skewness began 10–30
  years before reconstructed eutrophication and was interpreted as flickering
  rather than ordinary critical slowing.
- **Status:** plausible real-system mechanism; evidence is retrospective and
  model-assisted.
- **Primary source:** `wang2012flickering`.
- **Rationale:** Switching among competing states produces a different signal
  class from smooth loss of restoring rate.
- **Open issue:** A detector must classify flickering rather than force it into
  one return-rate curve.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md).

### C-106

- **Statement:** Spatial ecosystem models predict rising neighbor correlation
  before some coupled fold transitions, but field patch patterns alone do not
  establish prospective warning of desertification.
- **Status:** established in the declared models; plausible and
  model-conditioned in field systems.
- **Primary sources:** `kefi2007spatial`, `dakos2010spatial`.
- **Rationale:** Spatial structure can expose a weakening mode missed by a
  scalar aggregate, while observational meaning remains mechanism-dependent.
- **Open issue:** The value of spatial telemetry must exceed sensor, transfer,
  and estimation cost.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-107

- **Statement:** Common early-warning summary statistics can have severe error
  tradeoffs and elevated false positives when analysts condition on trajectories
  already known to transition.
- **Status:** established in the cited statistical simulations; no universal
  numerical error rate is claimed.
- **Primary sources:** `boettiger2012limits`, `boettiger2012prosecutor`.
- **Rationale:** Warning statistics require prospective calibration, explicit
  base rates, and non-transition controls.
- **Open issue:** Which calibration method remains valid under changing fault
  prevalence and workload.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-108

- **Statement:** In an idealized sea-ice model with no bifurcation or
  accelerating retreat, autocorrelation rose as summer ice vanished because of
  changing effective heat capacity, producing a mechanistic false alarm.
- **Status:** established counterexample in the declared model.
- **Primary source:** `wagner2015falsealarms`.
- **Rationale:** Slower observed response can arise from benign or expected
  physical changes rather than loss of stability.
- **Open issue:** Mechanism-specific residuals must distinguish dangerous and
  benign slowing at equal data budgets.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md).

### C-109

- **Statement:** Observation-based AMOC, western Greenland, and Amazon studies
  report trends compatible with declining stability, but rely on proxies or
  reconstructed states and have not prospectively predicted an adjudicated
  large-scale tipping event.
- **Status:** plausible and disputed in interpretation and threshold proximity.
- **Primary sources:** `boers2021amoc`, `boersrypdal2021greenland`,
  `boulton2022amazon`.
- **Rationale:** Observation-model uncertainty and causal interpretation must
  remain visible when transferring a signal into system monitoring.
- **Open issue:** Proxy robustness, forcing separation, and prospective
  adjudication.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md).

### C-110

- **Statement:** Historical-data tipping-time estimates are not robust to model
  form, proxy choice, observational uncertainty, infilling, and forcing
  extrapolation; tested methods can produce finite dates for a linear process
  that cannot tip.
- **Status:** established in the cited methodological stress tests.
- **Primary sources:** `ditlevsen2023forecast`, `benyami2024uncertainty`.
- **Rationale:** Estimated current recovery time does not license an exact
  failure-date forecast.
- **Open issue:** Prospective forecasting conditions, if any, must be specified
  and validated before dates are reported.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md).

### C-111

- **Statement:** In one targeted CESM AMOC-collapse run, a freshwater-transport
  indicator was less dependent on generic critical-slowing window choice,
  supporting physics-specific indicators as mandatory comparators.
- **Status:** established for the declared model; present-Earth interpretation
  remains retrospective and model-assisted.
- **Primary source:** `vanwesten2024physics`.
- **Rationale:** A mechanism-specific observable may dominate a generic warning
  statistic when causal structure is available.
- **Open issue:** Candidate 003 must compare against system-specific queue,
  retry, conservation, and controller-margin indicators.
- **Used by:** [Earth-system transition audit](audits/2026-08-05-earth-system-transition-signals.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-112

- **Statement:** Properly designed geometry, inertia, compliance, damping, and
  contact can produce stable task-specific motion with simpler active control
  than a rigid fully actuated design.
- **Status:** established for the cited passive-dynamic walking systems.
- **Primary source:** `collins2005passive`.
- **Rationale:** Physical structure can remove repeated trajectory-control work
  inside a bounded operating envelope.
- **Open issue:** Load, terrain, speed, disturbance range, actuation, and
  dissipative losses determine whether the lifecycle frontier improves.
- **Used by:** [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-113

- **Statement:** Compliant nonlinear bodies can implement continuous-time
  transformations, and measured transient dynamics of a soft silicone arm can
  provide task-usable short-term memory with a trained readout.
- **Status:** established for the cited theoretical model and platform.
- **Primary sources:** `hauser2011morphological`, `nakajima2014softbody`.
- **Rationale:** Body dynamics can serve as a physical reservoir rather than
  requiring explicit digital recurrence for every state update.
- **Open issue:** Sensors, actuation, sampling, readout, timescale matching, and
  calibration remain part of the system cost.
- **Used by:** [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-114

- **Statement:** Fixed nonlinear physical dynamics with fading memory can
  replace explicit recurrent state updates while a trainable readout performs
  the task mapping.
- **Status:** established for the cited delay and spintronic reservoirs.
- **Primary sources:** `appeltant2011delay`, `torrejon2017spintronic`.
- **Rationale:** Recurrent arithmetic is exchanged for substrate dynamics, not
  eliminated without cost.
- **Open issue:** Encoding, drive, conversion, sampling, readout, calibration,
  drift, and retries determine complete efficiency.
- **Used by:** [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-115

- **Statement:** Bistable mechanical unit cells can retain rewritable state and
  alter bulk response, while coupled curved-beam structures can implement
  reprogrammable combinational and sequential logic under ordered excitation.
- **Status:** established for the reported prototypes.
- **Primary sources:** `chen2021mechanicalmemory`, `mei2021mechanologic`.
- **Rationale:** Mechanical memory and logic provide reprogrammable structural
  specialization rather than a general-purpose free computation substrate.
- **Open issue:** Drive, addressing, reset, density, latency, variation, and
  fatigue bound usefulness.
- **Used by:** [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-116

- **Statement:** Local stiffness changes induced during supervised force
  training reshaped a mechanical energy landscape so a creased sheet performed
  a learned force-response classification on held-out inputs.
- **Status:** established for the cited simulated and physical systems.
- **Primary source:** `stern2020physicallearning`.
- **Rationale:** Task-specific parameters can reside in a material's
  constitutive response.
- **Open issue:** Labels, update implementation, reset, overwrite, loading
  envelope, drift, and lifetime cost remain external constraints.
- **Used by:** [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-117

- **Statement:** Reaction–diffusion dynamics can transform local kinetics,
  diffusion, boundaries, and source fields into spatial patterns; engineered
  multicellular systems have used diffusible signals and genetic logic to form
  bands and detect edges.
- **Status:** established in theory and the cited engineered systems.
- **Primary sources:** `turing1952morphogenesis`, `basu2005pattern`,
  `tabor2009edge`.
- **Rationale:** Local chemistry can perform spatial information processing and
  pattern construction.
- **Open issue:** Simple diffusion time scales with distance squared, while
  reagent supply, noise, growth, sensitivity, and reset constrain transfer.
- **Used by:** [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-118

- **Statement:** Designed molecular binding rules and distributed robot rules
  can assemble specified structures without centrally placing each component.
- **Status:** established for the cited molecular and robot systems.
- **Primary sources:** `winfree1998dnacrystal`, `rothemund2006dnaorigami`,
  `rubenstein2014kilobot`.
- **Rationale:** Global placement work is exchanged for component programming,
  local motion, convergence time, error handling, and yield.
- **Open issue:** Kinetic traps, malformed output, congestion, assembly time,
  and reset or recycling are material costs.
- **Used by:** [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-119

- **Statement:** Cyclically driven disordered systems can retain multiple
  transient signatures of prior drive amplitudes, with learning, forgetting,
  noise, and overdrive jointly determining retention.
- **Status:** established for the cited modeled and associated experimental
  class, not as general-purpose memory.
- **Primary source:** `keim2011transientmemory`.
- **Rationale:** Material history can serve as local memory for threshold or
  exposure statistics matched to its read mechanism.
- **Open issue:** State may be analog, transient, aggregate, and probe-dependent
  rather than addressable or provenance-rich.
- **Used by:** [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-120

- **Statement:** Crack-triggered microcapsules can autonomously deliver healing
  agent, microvascular delivery can support repeated events, and reversible
  bonds can restore material properties; success remains limited by inventory,
  transport, chemistry, and damage geometry.
- **Status:** established for the cited material systems.
- **Primary sources:** `white2001autonomic`, `toohey2007microvascular`,
  `cordier2008rubber`.
- **Rationale:** Local material self-repair is an engineering null for
  maintenance but does not guarantee restoration of calibrated computation.
- **Open issue:** Healing time, channel damage, property loss, recalibration,
  second-damage survival, added mass, and embodied energy.
- **Used by:** [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-121

- **Statement:** For a mature frequent physically coupled task, compiling a
  learned mapping into a reversible local substrate with health probes, a
  digital shadow, and fallback may reduce lifecycle sensing, conversion,
  communication, and inference energy at equal task quality and risk.
- **Status:** speculative systems hypothesis after engineering deduplication.
- **Primary source:** none sufficient; component feasibility is scoped in
  [C-112](#c-112)–[C-120](#c-120).
- **Rationale:** The candidate joins physical offload with versioning,
  validation, exception handling, and reversible deployment.
- **Open issue:** It is not distinct if a passive component, analog controller,
  FPGA/ASIC, or matched physical reservoir occupies the same Pareto region.
- **Used by:** [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-122

- **Statement:** In the cited Iowa maximal-coverage model, ten optimized
  candidate sentinel sites achieved the same 20-mile population-coverage proxy
  as 22 existing voluntary sites, while 22 optimized sites covered more than
  75% of the modeled population.
- **Status:** established optimization result for the declared geographic
  proxy, not observed outbreak detection.
- **Primary source:** `polgreen2009optimizing`.
- **Rationale:** Sentinel placement is an explicit allocation problem with a
  target, metric, and resource constraint.
- **Open issue:** Geographic coverage does not guarantee representativeness,
  signal quality, equity, network reach, or detection value.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation).

### C-123

- **Statement:** In one prospective 2009 Harvard cohort, friend-nominated
  students exhibited an earlier fitted clinical epidemic curve than a random
  student group.
- **Status:** established scoped observational result.
- **Primary source:** `christakis2010sensors`.
- **Rationale:** Network-biased sampling can expose propagating events earlier
  than uniform sampling in some structures.
- **Open issue:** Lead depends on topology, pathogen, sample, measurement,
  care-seeking, and the distinction between early arrival and representative
  burden.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation).

### C-124

- **Statement:** In the simulation scenarios evaluated by Fricker et al., a
  model-residual CUSUM outperformed the EARS C1–C3 syndromic detection methods.
- **Status:** established for the cited simulation suite, not every event
  stream.
- **Primary source:** `fricker2008ears`.
- **Rationale:** Robust residual sequential detectors are mandatory nulls for
  biologically framed anomaly or outbreak alarms.
- **Open issue:** Detector ranking changes with baseline model, noise, shift,
  delay, and false-alarm cost.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-125

- **Statement:** A space–time permutation scan can operate without an explicit
  population-at-risk denominator by conditioning on observed marginals, but it
  can miss spatially diffuse proportional increases and is sensitive to changes
  in the capture process.
- **Status:** established method property and scoped operational boundary.
- **Primary source:** `kulldorff2005spacetime`.
- **Rationale:** Removing one unavailable denominator changes the detection
  target rather than making observation bias disappear.
- **Open issue:** AI pooled-signal detectors need explicit nulls for global
  shifts, mixture change, and sensor participation change.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-126

- **Statement:** Real-time event counts are right-truncated by reporting delay,
  and the delay distribution can change during response; the cited German STEC
  study used Bayesian nowcasting to estimate occurred-but-not-yet-reported
  cases.
- **Status:** established in the cited outbreak and method.
- **Primary source:** `hoehle2014nowcasting`.
- **Rationale:** Recent apparent improvement can reflect delayed observation
  rather than recovery.
- **Open issue:** Delay drift, vintage preservation, interval calibration, and
  action-dependent reporting need continual validation.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-127

- **Statement:** SARS-CoV-2 RNA in wastewater preceded first reported cases at
  one Dutch site and tracked reported prevalence during the studied early
  epidemic, without establishing a universal lead or infections-per-copy
  conversion.
- **Status:** established scoped observational association.
- **Primary sources:** `medema2020sewage`, `peccia2020wastewater`.
- **Rationale:** Pooled environmental state can provide broad early coverage
  while remaining lossy, delayed, and weakly attributable.
- **Open issue:** Shedding, flow, catchment, sampling, assay, weather, and
  clinical reporting vary over time and place.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-128

- **Statement:** Search-query fractions can nowcast a clinical influenza-like-
  illness series in a scoped period, but platform, media, and behavioral drift
  prevent treating the proxy as a stable autonomous measurement channel.
- **Status:** disputed as a robust standalone surveillance channel; scoped
  predictive association is established.
- **Primary sources:** `ginsberg2009queries`, `olson2013reassessing`.
- **Rationale:** A fast proxy can be policy- and platform-coupled rather than a
  direct sensor of the hidden process.
- **Open issue:** Observation-model drift and adversarial attention shifts need
  independent anchors.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-129

- **Statement:** The first ENE-COVID probability-sample wave estimated
  population seroprevalence beyond routine case reports while retaining assay,
  timing, nonresponse, and sampling-frame uncertainty.
- **Status:** established for the cited study wave and population frame.
- **Primary source:** `pollan2020seroprevalence`.
- **Rationale:** A separate denominator-calibration stream can reveal hidden
  burden that event-report telemetry misses.
- **Open issue:** Probability sampling is slower and costlier than continuous
  operational telemetry and may not identify current incidence.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-130

- **Statement:** The Guinea ring-vaccination trial provides cluster-randomized
  evidence for immediate versus delayed rVSV-ZEBOV vaccination among traced
  rings, not for global optimality of the tracing or targeting policy.
- **Status:** established within the cited trial design and eligibility rules.
- **Primary source:** `henaorestrepo2017ebola`.
- **Rationale:** Causal effect of a response must remain separate from optimality
  of the surveillance and allocation policy that selected its target.
- **Open issue:** Changing epidemic context, open-label operation, and
  population eligibility limit transfer.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation).

### C-131

- **Statement:** Interventions and adaptive behavior can change both epidemic
  state and later observations, so observational before/after curves do not
  identify a controller without an action-conditioned observation model or
  valid counterfactual.
- **Status:** plausible general control requirement supported by theoretical
  feedback models and retrospective analyses.
- **Primary sources:** `hatchett2007interventions`, `bootsma2007measures`,
  `fenichel2011behavior`.
- **Rationale:** A controller can suppress its own telemetry and mistake that
  observation change for independent evidence of recovery.
- **Open issue:** Which randomized, instrumental, or shadow-replica designs
  identify action effects cheaply and safely in modular AI systems.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-132

- **Statement:** A surveillance–intervention architecture that versions sensing
  and action provenance and jointly estimates hidden state and observation drift
  may improve fault control when policy changes the telemetry it observes.
- **Status:** speculative project hypothesis after POMDP and control
  normalization.
- **Primary source:** none sufficient; foundational nulls include
  `kaelbling1998pomdp` and `howard1966informationvalue`.
- **Rationale:** The candidate preserves the distinction among hidden process,
  changing sensor channel, and action-induced observation rather than fitting
  only the post-action telemetry.
- **Open issue:** It is not distinct if a delay-aware POMDP, dual-control policy,
  residual detector, and value-of-information sampler match it at equal cost.
- **Used by:** [epidemiology audit](audits/2026-08-05-epidemiology-and-surveillance-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-133

- **Statement:** Under specified concave utilities, capacity constraints, and
  controller conditions, decentralized shadow-price feedback can converge
  toward a proportional-fair network objective.
- **Status:** established in the cited model.
- **Primary source:** `kelly1998rate`.
- **Rationale:** A price-like signal can compress marginal scarcity for local
  allocation without creating a new coordination principle.
- **Open issue:** Delays, nonstationarity, nonconcave quality, strategic reports,
  and physical energy accounting change the guarantee.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-134

- **Statement:** Self-interested route choice can differ from the total-latency
  optimum, and the efficiency bound depends on the latency-function class.
- **Status:** established in the cited nonatomic routing model.
- **Primary source:** `roughgarden2002selfish`.
- **Rationale:** Local route improvement does not generally imply global system
  efficiency when decisions impose congestion externalities.
- **Open issue:** Learned modular routers need a defined agent objective before
  selfish-routing results apply rather than ordinary control.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology).

### C-135

- **Statement:** Second-price and Groves-style truthfulness require a defined
  utility, information, identity, feasible-outcome, and enforceable-transfer
  model; the guarantee does not transfer automatically to learned modules.
- **Status:** established theorem under the cited models; systems transfer is
  conditional.
- **Primary sources:** `vickrey1961counterspeculation`, `groves1973incentives`.
- **Rationale:** Calling an internal scalar a bid does not make it truthful or
  behaviorally meaningful.
- **Open issue:** Whether persistent modules possess private information,
  feasible deviations, and real opportunity-cost consequences.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-001](principle-registry.md#p-001--selective-allocation).

### C-136

- **Statement:** Auction objective choice matters: expected seller utility,
  allocative welfare, energy, latency, and task quality can imply different
  allocation rules.
- **Status:** established in the cited model; AI objective translation remains
  a design choice.
- **Primary source:** `myerson1981optimal`.
- **Rationale:** An incentive-compatible allocator can still optimize the wrong
  system target.
- **Open issue:** Multiobjective quality and risk should remain visible rather
  than being hidden inside a transfer scalar.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-137

- **Statement:** Under the Myerson–Satterthwaite bilateral private-value
  assumptions, incentive compatibility, participation, budget balance, and
  ex-post efficiency cannot generally all be achieved.
- **Status:** established in the cited model.
- **Primary source:** `myerson1983bilateral`.
- **Rationale:** Architecture contracts must state which desirable property is
  relaxed rather than promising an impossible bundle.
- **Open issue:** Which impossibility results apply to approximate, repeated,
  nonmonetary modular allocation.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-138

- **Statement:** Deferred acceptance provides stability in classical matching,
  while matching-with-contracts results depend on substitutability and
  aggregate-demand conditions.
- **Status:** established in the cited models.
- **Primary sources:** `gale1962college`, `hatfield2005contracts`.
- **Rationale:** Stable assignment is a specific blocking-pair property rather
  than maximum quality, fairness, or energy efficiency.
- **Open issue:** Complementary modules and changing capabilities can violate
  substitutability and persistent preference assumptions.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-139

- **Statement:** In the cited multitask principal–agent model, stronger
  incentives on a measurable task can reduce effort on poorly measured
  substitute tasks.
- **Status:** established in the cited model.
- **Primary source:** `holmstrom1991multitask`.
- **Rationale:** Router-visible success can train specialists to sacrifice
  hidden or delayed objectives even when the allocation metric improves.
- **Open issue:** The magnitude and presence of metric gaming are empirical and
  require withheld multidimensional outcomes.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-140

- **Statement:** Proper scoring rules can elicit a forecaster's belief about a
  verified event under their assumptions, but do not validate the event
  definition, observation channel, competence, effort, or causal contribution.
- **Status:** established with an explicit systems boundary.
- **Primary sources:** `brier1950verification`, `gneiting2007scoring`.
- **Rationale:** Calibrated self-reports require protected outcomes and do not
  replace independent evaluation.
- **Open issue:** Delayed, manipulable, correlated, or missing outcomes can
  undermine the score's intended meaning.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-141

- **Statement:** Peer prediction can make truthful reporting an equilibrium
  under strong signal and prior assumptions, while absence of ground truth
  leaves equilibrium-selection, shared-error, and collusion risks.
- **Status:** established in the cited model; robustness limitation plausible.
- **Primary source:** `miller2005peer`.
- **Rationale:** Agreement is not correctness, especially among correlated
  specialists trained on shared data.
- **Open issue:** Whether occasional protected audits can anchor reports without
  dominating total evaluation cost.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-142

- **Statement:** In the cited common-pool experiments, communication and
  endogenous sanction choice sometimes improved efficiency, while sanctions
  could consume net benefit; self-governance was possible but not guaranteed.
- **Status:** established for the cited experimental treatments.
- **Primary source:** `ostrom1992covenants`.
- **Rationale:** Monitoring and enforcement are costly control actions whose
  governance rule affects resource outcomes.
- **Open issue:** Digital quota, admission, rollback, or central control may be
  cheaper than module-level sanction mechanisms.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-143

- **Statement:** False identities and an untrustworthy mechanism operator are
  distinct attack surfaces not solved by participant-level strategy-proofness.
- **Status:** established in the cited models.
- **Primary sources:** `yokoo2004falsename`, `douceur2002sybil`,
  `akbarpour2020credible`.
- **Rationale:** An allocator must address identity, collusion, omitted reports,
  committed randomness, and replay, not only truthful bids from fixed agents.
- **Open issue:** The storage, latency, privacy, and governance cost of
  contestability may exceed its benefit.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-144

- **Statement:** When selection-trained specialists possess hidden information,
  can benefit from misleading router-visible metrics, and face real future
  traffic consequences, delayed randomized audits and contestable records may
  reduce gaming at equal total cost.
- **Status:** speculative project hypothesis after economic and engineering
  normalization.
- **Primary sources:** component threat models in `holmstrom1991multitask`,
  `everitt2017corrupted`, and [C-143](#c-143).
- **Rationale:** The possible contribution is audit-backed contestable
  allocation under endogenous metric pressure, not market vocabulary.
- **Open issue:** It must lose or tie when modules are cooperative and directly
  observable, and beat calibrated routers, primal–dual control, bandits, and
  randomized evaluation only in the strategic private-information regime.
- **Used by:** [economics audit](audits/2026-08-05-economics-market-design-incentives.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-145

- **Statement:** Conventional progress and preservation establish absence of a
  modeled type error for well-typed programs under the theorem's language and
  semantics, not termination, functional correctness, security, or factual
  truth.
- **Status:** established.
- **Primary source:** `wright1994syntactic`.
- **Rationale:** Assurance claims must name the property and trusted semantics
  instead of using “type-safe” as a general quality label.
- **Open issue:** Compiler/runtime defects, unsafe operations, foreign
  interfaces, reflection, and deployment configuration remain outside many
  proofs.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-146

- **Statement:** Refinement and dependent types can statically establish
  value-indexed predicates, trading automation and expressiveness against
  specification and proof cost.
- **Status:** established for the cited systems.
- **Primary sources:** `xi1999dependent`, `rondon2008liquid`.
- **Rationale:** Stronger static structure verifies only predicates that are
  encoded and correctly connected to implementation semantics.
- **Open issue:** Wrong specifications, axioms, models, libraries, and evolving
  requirements remain outside the theorem.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-147

- **Statement:** Higher-order contracts can mediate delayed function
  interactions, detect encoded boundary violations, and assign blame according
  to contract polarity.
- **Status:** established in the cited formal system.
- **Primary source:** `findler2002contracts`.
- **Rationale:** Runtime obligations and attribution can cross modular
  boundaries without pretending to prove all internal behavior.
- **Open issue:** Only mediated, observed, expressible interactions are covered;
  runtime cost depends on crossings and configuration.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-148

- **Statement:** Effect systems conservatively describe possible effects,
  whereas capability systems restrict operations to holders of delegated
  authority; description and authority are distinct assurance classes.
- **Status:** established for the cited systems.
- **Primary sources:** `lucassen1988effects`, `watson2010capsicum`.
- **Rationale:** A module may be predicted to perform an effect without being
  authorized to do it, or hold authority it does not exercise.
- **Open issue:** Hidden primitives and ambient authority break the boundary;
  neither mechanism establishes intent, outcome correctness, or truth.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-149

- **Statement:** A consumer can admit untrusted code by checking a
  producer-supplied proof against a consumer-defined safety policy and formal
  machine model.
- **Status:** established in the cited proof-carrying-code system.
- **Primary source:** `necula1997pcc`.
- **Rationale:** Proof construction can move across a trust boundary while a
  small checker enforces a declared policy.
- **Open issue:** Policy, checker, semantics, loader, proof-artifact binding, and
  every relevant update remain trusted or invalidating.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-150

- **Statement:** Separation logic's frame rule supports compositional reasoning
  about disjoint owned state, while shared and concurrent state require
  additional invariants.
- **Status:** established.
- **Primary source:** `reynolds2002separation`.
- **Rationale:** Explicit ownership can confine proof and maintenance scope.
- **Open issue:** Hidden aliases, foreign interfaces, interference, or wrong
  invariants invalidate local reasoning.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-151

- **Statement:** A sound abstract interpretation over-approximates modeled
  reachable behavior; widening and finite abstractions enable analysis while
  potentially producing false alarms and weak invariants.
- **Status:** established.
- **Primary source:** `cousot1977abstract`.
- **Rationale:** Static coverage and precision have a formal tradeoff rather
  than constituting a universal proof of safety.
- **Open issue:** Semantics, transfers, libraries, reflection, native behavior,
  and update invalidation must remain soundly modeled.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-152

- **Statement:** Runtime verification can produce true, false, or inconclusive
  verdicts for finite observed traces under a specified temporal semantics,
  rather than proving arbitrary future behavior.
- **Status:** established.
- **Primary source:** `bauer2011runtime`.
- **Rationale:** Monitored evidence must retain observation coverage, order,
  verdict class, and response latency.
- **Open issue:** Instrumentation completeness, monitorability, event order,
  overhead, and damage before response bound the guarantee.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-153

- **Statement:** Sound gradual boundaries can preserve type and blame
  guarantees across typed and untyped modules using runtime casts or wrappers,
  whose cost can vary sharply across mixed configurations.
- **Status:** established; performance magnitude is system-specific.
- **Primary sources:** `siek2006gradual`, `wadler2009blame`,
  `takikawa2016dead`.
- **Rationale:** Mixed-trust composition pays configuration- and
  boundary-crossing-dependent enforcement cost.
- **Open issue:** Complete mediation plus language-specific mutation, identity,
  and proxy semantics are required.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-154

- **Statement:** Transactions recover participating state under declared
  atomicity, isolation, and durability assumptions, while saga compensations
  are not generally semantic inverses of completed actions.
- **Status:** established.
- **Primary sources:** `haerder1983transactions`, `garciamolina1987sagas`.
- **Rationale:** Rollback authority is bounded by resource participation and
  reversibility of external effects.
- **Open issue:** Observation, time, messages, physical acts, disclosure, and
  third-party effects may be irreversible.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-155

- **Statement:** Dynamic software update can replace code and transform live
  state at controlled update points while preserving a system-specific safety
  relation, but type-safe updating does not imply behavioral continuity.
- **Status:** established for the cited mechanism; general semantic equivalence
  is not established.
- **Primary source:** `hicks2005dynamic`.
- **Rationale:** Reversible specialization requires explicit migration,
  dependency, protocol, validation, and rollback obligations.
- **Open issue:** Update timing, external effects, state readability, and old/new
  interaction can invalidate recovery.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-156

- **Statement:** Provenance models can compose source and derivation
  annotations, and artifact identity can bind records to versions, without
  proving that an originating assertion is true or entails a derived claim.
- **Status:** established.
- **Primary source:** `green2007provenance`.
- **Rationale:** Derivation, identity, evidence quality, and truth are distinct
  assurance classes.
- **Open issue:** Capture completeness, source quality, retraction status, and
  claim-to-source entailment require separate checks.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-157

- **Statement:** Binding proofs, effects, capabilities, tests, runtime monitors,
  provenance, migration, and compensation to one versioned adaptive module may
  reduce unsafe composition and collateral maintenance failure relative to the
  strongest conventional platform at equal lifecycle cost.
- **Status:** speculative project synthesis after PL and systems
  deduplication.
- **Primary source:** none sufficient; components are scoped in
  [C-145](#c-145)–[C-156](#c-156).
- **Rationale:** The candidate preserves graded assurance classes and their
  invalidation boundaries instead of collapsing proof, monitored behavior,
  authority, provenance, and empirical evidence into “verified.”
- **Open issue:** It must beat typed APIs, sandbox/IAM, CI/static analysis,
  production monitors, lineage, canaries, transactions, and ordinary deployment
  metadata at equal lifecycle budget.
- **Used by:** [programming-languages audit](audits/2026-08-05-programming-languages-verification.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

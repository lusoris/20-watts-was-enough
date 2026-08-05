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

### C-158

- **Statement:** Equilibrium binding and conformational change can implement
  selective molecular recognition, but affinity alone is neither posterior
  probability nor kinetic proofreading.
- **Status:** established.
- **Primary sources:** `koshland1958specificity`, `monod1965allosteric`,
  `savir2007conformational`.
- **Rationale:** Concentration, occupancy, binding energy, and conformational
  cost jointly determine a scoped physical classifier.
- **Open issue:** Saturation, nonspecific binding, slow release, and look-alike
  ligands limit discrimination; software transfer must beat calibrated
  classification or likelihood-ratio nulls.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-159

- **Statement:** A driven multistep pathway with discriminatory dissociation
  and reset can improve specificity beyond a single equilibrium discrimination
  step in the stated kinetic models.
- **Status:** established.
- **Primary sources:** `hopfield1974proofreading`, `ninio1975kinetic`.
- **Rationale:** Temporary intermediate states create repeated opportunities
  for wrong candidates to escape before product commitment.
- **Open issue:** Correlated or nondiscriminating stages, bypass, fuel limits,
  and irreversible partial action collapse the benefit.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [Candidate 010](../experiments/candidates/010-reset-coupled-staged-verification.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-160

- **Statement:** Kinetic proofreading occupies a model-specific
  speed–error–dissipation frontier; more stages or fuel do not guarantee a
  universal monotonic accuracy improvement.
- **Status:** established.
- **Primary sources:** `murugan2012speed`, `sartori2015thermodynamics`.
- **Rationale:** Error reduction, delay, reset traffic, and chemical driving
  are coupled rather than summarized by one accuracy multiplier.
- **Open issue:** Every transfer must count rejected work and compare against
  conditioned sequential tests, cascades, retries, and codes.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [Candidate 010](../experiments/candidates/010-reset-coupled-staged-verification.md).

### C-161

- **Statement:** Finite-time diffusive sensing, noisy feedback suppression,
  template-copying error, sensory adaptation, and steady-state current
  precision have different lower bounds whose numerical scalings are not
  interchangeable.
- **Status:** established.
- **Primary sources:** `berg1977chemoreception`, `lestas2010limits`,
  `lan2012tradeoff`, `barato2015tur`.
- **Rationale:** Each result assumes a particular observable, dynamics,
  stationarity condition, boundary, and cost definition.
- **Open issue:** Hidden reservoirs, memory, transient operation,
  coarse-graining, or a changed output invalidate direct reuse.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [energy model](../concept/80-energy-model.md).

### C-162

- **Statement:** Open elementary mass-action networks require explicit
  chemostat work and entropy-production accounting to maintain nonequilibrium
  state; coarse-graining can hide reservoirs and cycles.
- **Status:** established.
- **Primary sources:** `schnakenberg1976network`, `rao2016nonequilibrium`.
- **Rationale:** A reaction vessel's internal dissipation is not a complete
  wall-energy boundary.
- **Open issue:** Reagent synthesis, mixing, pumping, temperature control,
  sensing, reset, purification, waste, and embodied hardware remain outside a
  vessel-only ledger.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-163

- **Statement:** Autocatalytic and cooperative RNA systems can amplify,
  compete, and persist in scoped in-vitro conditions while resource depletion,
  parasites, mutation, inhibition, and selection protocol bound transfer.
- **Status:** established.
- **Primary sources:** `lincoln2009replication`, `vaidya2012network`,
  `eigen1971selforganization`.
- **Rationale:** Positive feedback and catalytic cooperation create growth, not
  a free guarantee of robustness or open-ended improvement.
- **Open issue:** Equal-resource comparisons must include stochastic
  extinction, parasite load, mutation, and waste removal.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-164

- **Statement:** Compartments can preserve genotype–phenotype association and,
  under scoped selection and mixing protocols, prevent parasite-driven
  extinction.
- **Status:** established.
- **Primary sources:** `tawfik1998compartments`, `szathmary1987group`,
  `ichihashi2013darwinian`, `matsumura2016transient`.
- **Rationale:** Physical locality can couple a producer to its product before
  group-level evaluation and propagation.
- **Open issue:** Leakage, multiple occupancy, fusion, starvation,
  small-number extinction, and a misaligned group objective can erase or
  reverse the effect.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-165

- **Statement:** Coupled reaction and diffusion can form spatial patterns from
  local fields, with a characteristic diffusion time scaling as $L^2/D$.
- **Status:** established.
- **Primary sources:** `turing1952morphogenesis`, `basu2005pattern`.
- **Rationale:** Local physical propagation can replace a global address table
  in a declared geometry.
- **Open issue:** Quadratic spatial latency, boundary sensitivity, parameter
  drift, weak addressability, and conversion cost constrain useful scale.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [adaptive-materials audit](audits/2026-08-05-adaptive-materials-and-self-assembly.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-166

- **Statement:** Chemical fuel can program the finite lifetime of assemblies in
  specific synthetic materials, while complete erasure and lifecycle
  efficiency remain chemistry-specific.
- **Status:** established.
- **Primary sources:** `boekhoven2015transient`,
  `tenasolsona2017nonequilibrium`.
- **Rationale:** Fuel activation and spontaneous deactivation can implement a
  physical expiration path.
- **Open issue:** Kinetic traps, incomplete decay, by-products, replenishment,
  reset, manufacturing, and waste can dominate the apparent benefit.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-167

- **Statement:** Formal chemical reaction networks can be compiled
  approximately into DNA strand-displacement systems under scale-separation
  and inventory assumptions, and molecular logic, neural, and oscillator
  circuits have been demonstrated.
- **Status:** established.
- **Primary sources:** `soloveichik2010dna`, `qian2011scaling`,
  `qian2011neural`, `srinivas2017enzymefree`.
- **Rationale:** Chemistry is an established computing substrate rather than
  evidence that its implementation is automatically faster or more efficient.
- **Open issue:** Leakage, depletion, crosstalk, slow propagation, readout,
  reset, fabrication yield, and conversion must enter matched comparisons.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-168

- **Statement:** Chemical limit cycles and propagating waves provide
  autonomous phase state but no general accuracy, computation, or
  energy-efficiency guarantee.
- **Status:** established.
- **Primary sources:** `field1972oscillations`, `field1974oregonator`,
  `zaikin1970waves`.
- **Rationale:** Fuel-maintained phase is a concrete state variable with
  measurable period, coupling, and phase diffusion.
- **Open issue:** Depletion, phase noise, temperature sensitivity, mode change,
  and rigid entrainment must be compared with timers, oscillators, PLLs, and
  recurrent control.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-169

- **Statement:** Antithetic integral feedback can guarantee robust perfect
  adaptation of a regulated mean under the theorem's stochastic-network
  conditions and has been implemented experimentally, but it does not
  guarantee low variance or universal stability.
- **Status:** established.
- **Primary sources:** `briat2016antithetic`, `aoki2019universal`.
- **Rationale:** Controller species encode an integral-like state through
  production and annihilation.
- **Open issue:** Ergodicity, stability, controllability, reachable set point,
  molecular burden, variance, and population heterogeneity remain binding.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-170

- **Statement:** Reset-coupled staged verification may reduce costly false
  commitment when a later stage adds conditional information or a distinct
  detector and rollback is cheaper than the avoided error.
- **Status:** speculative.
- **Primary source:** none sufficient; component mechanisms are scoped in
  [C-159](#c-159) and [C-160](#c-160).
- **Rationale:** The composition preserves reversibility until commitment and
  charges rejected work rather than treating it as free overhead.
- **Open issue:** It must beat conditioned sequential tests, calibrated
  cascades, abstention, retries, independent verification, and codes at equal
  complete budget.
- **Used by:** [Candidate 010](../experiments/candidates/010-reset-coupled-staged-verification.md),
  [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-171

- **Statement:** Physical locality may improve credit assignment when a
  producer and its shareable product cannot otherwise be attributed cheaply
  and reliably.
- **Status:** plausible.
- **Primary sources:** `tawfik1998compartments`, `matsumura2016transient`.
- **Rationale:** Compartment occupancy can make lineage and product fate share
  one causal boundary.
- **Open issue:** Explicit provenance, quotas, sharded evaluation, and ordinary
  sandboxing may dominate without leakage and group-selection costs.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-172

- **Statement:** A fuel-coupled transient state may serve as a fail-closed
  physical lease when loss of fuel makes hazardous action impossible.
- **Status:** speculative.
- **Primary sources:** `boekhoven2015transient`,
  `tenasolsona2017nonequilibrium` establish component feasibility only.
- **Rationale:** Authority and physical availability can share the same
  expiring substrate instead of relying on a separate revocation message.
- **Open issue:** It must beat signed leases, TTLs, watchdogs, volatile latches,
  and powered interlocks under stuck-on, stuck-off, partition, waste, and
  lifecycle tests.
- **Used by:** [chemistry audit](audits/2026-08-05-chemistry-reaction-networks-proofreading.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-173

- **Statement:** Field studies of selected hazardous organizations identify
  recurring weak-signal attention, cross-check, expertise, maintenance, and
  temporary authority mechanisms without establishing a portable causal effect.
- **Status:** plausible.
- **Primary sources:** `rochlin1987selfdesigning`,
  `roberts1990characteristics`, `laporte1991practice`.
- **Rationale:** The observations supply operational mechanisms, not a universal
  reliability label.
- **Open issue:** Outcome selection, survivorship, unobserved near misses,
  training, luck, and domain-specific authority confound transfer.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [Candidate 011](../experiments/candidates/011-dual-loop-operational-assurance.md).

### C-174

- **Statement:** Interactive complexity and tight coupling can create
  propagation paths that attention or response culture cannot interrupt before
  consequence.
- **Status:** plausible.
- **Primary sources:** `perrow1984normal`, `sagan1993limits`.
- **Rationale:** Topology, timing, buffers, and common-mode weaknesses can
  dominate response quality.
- **Open issue:** The candidate needs operational measures of interaction and
  coupling plus matched topology and response interventions.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-175

- **Statement:** Reserve capacity, monitoring, graceful degradation, recovery,
  and sustained adaptation are distinct resilience dimensions whose values can
  move in opposite directions.
- **Status:** established.
- **Primary sources:** `woods2015four`, `hollnagel2013safety`.
- **Rationale:** One resilience scalar can hide which capacity actually changed.
- **Open issue:** Each dimension needs an observable task metric and resource
  boundary before an intervention can be evaluated.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-176

- **Statement:** Crew-resource-management challenge and acknowledgement
  protocols may expose distributed evidence suppressed by authority gradients.
- **Status:** plausible.
- **Primary sources:** `helmreich1999crm`, `faa2004crm`.
- **Rationale:** Explicit callout, cross-check, acknowledgement, and correction
  change the information and authority path.
- **Open issue:** The protocol must beat structured assertions, deterministic
  interlocks, pagers, and revocation at equal false-stop and training cost.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation).

### C-177

- **Statement:** Incident-command systems define a modular temporary authority
  and information structure for volatile multi-party response.
- **Status:** established.
- **Primary sources:** `bigley2001ics`, `fema2017nims`.
- **Rationale:** Objectives, roles, operating periods, spans of control, and
  briefed command transfer provide a mature coordination null.
- **Open issue:** Effectiveness depends on training, communication, role fit,
  scale, and whether role overhead exceeds incident complexity.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [Candidate 011](../experiments/candidates/011-dual-loop-operational-assurance.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-178

- **Statement:** Near-miss report count is the product of precursor exposure
  and the detection, reporting, and retention processes rather than a direct
  safety rate.
- **Status:** established.
- **Primary sources:** `phimister2003nearmiss`, `faa2021asrp`.
- **Rationale:** Silence can reflect low exposure, weak sensing, fear, friction,
  or deletion; volume can reflect hazards, better observation, duplication, or
  gaming.
- **Open issue:** Conditional probabilities depend on severity, identity,
  workload, instrumentation, incentives, and enforcement.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [Candidate 011](../experiments/candidates/011-dual-loop-operational-assurance.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-179

- **Statement:** Sampling ordinary successful work may reveal adaptations and
  drift omitted by failure-only analysis.
- **Status:** plausible.
- **Primary sources:** `hollnagel2013safety`, `march1991samples`.
- **Rationale:** Conditioning only on failures selects a narrow tail and hides
  how constraints are usually satisfied.
- **Open issue:** Ordinary work vastly outnumbers incidents; the method must
  improve prospective hazard discovery under a fixed analysis and retention
  budget.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-180

- **Statement:** Blameless postmortems may improve candor only when protection
  boundaries, exclusions, evidence, owned actions, and outcome verification are
  credible.
- **Status:** plausible.
- **Primary source:** `lunney2016postmortem`.
- **Rationale:** A non-punitive account can preserve local observations that
  blame suppresses, but document production is not prevention.
- **Open issue:** Practitioner evidence does not isolate causal effect;
  no-accountability variants, performative closure, and legal/security duties
  can defeat the mechanism.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-181

- **Statement:** Checklists can reduce omissions and coordinate handoffs, while
  benefit depends on trigger, content, fidelity, deviation policy, training,
  and maintenance.
- **Status:** plausible.
- **Primary source:** `haynes2009checklist`.
- **Rationale:** Externalized steps alter recall and team coordination in a
  scoped workflow.
- **Open issue:** Before-after effect sizes do not transfer as constants;
  fixation, bypass, stale items, delay, and revision cost must be measured.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-182

- **Statement:** Escalation is operationally specified only when trigger,
  acknowledgement, authority, scope, fallback, expiry, and restoration are
  explicit.
- **Status:** plausible.
- **Primary sources:** `helmreich1999crm`, `bigley2001ics`, `fema2017nims`.
- **Rationale:** Temporary authority inversion must be a bounded state
  transition rather than an informal appeal to expertise.
- **Open issue:** It must beat an approval gate, pager, scoped token,
  deterministic interlock, and kill switch under missed-event and false-stop
  costs.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [Candidate 011](../experiments/candidates/011-dual-loop-operational-assurance.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation).

### C-183

- **Statement:** Redundancy improves reliability only relative to a declared
  dependence, adjudication, switching, demand, and repair model.
- **Status:** established.
- **Primary source:** `landau1969redundancy`.
- **Rationale:** Shared model, data, prompt, tool, specification, or operator
  can create common-mode failure that independent-channel arithmetic omits.
- **Open issue:** Diversity cost and failure dependence must be measured rather
  than inferred from replica count.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-184

- **Statement:** Stored incident documents become organizational memory only
  when applicable lessons are retrieved, used, evaluated, invalidated, and
  retired.
- **Status:** plausible.
- **Primary sources:** `march1991samples`, `drupsteen2013critical`,
  `lukic2012framework`, `nasa2026lessons`.
- **Rationale:** Archive size measures storage, not memory-in-use or changed
  future behavior.
- **Open issue:** Prospective retrieval precision, recurrence, stale-lesson
  harm, curation, and retirement latency must be measured across versions.
- **Used by:** [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-185

- **Statement:** Binding live multi-agent traces to dependencies, scoped
  response actions, tests, deployments, verified outcomes, later retrieval,
  and retirement may reduce both containment delay and recurrence.
- **Status:** speculative.
- **Primary source:** none sufficient; components are scoped in
  [C-173](#c-173)–[C-184](#c-184).
- **Rationale:** The held composition makes live response and longitudinal
  learning separate loops with an explicit versioned interface.
- **Open issue:** It must beat mature telemetry, SRE roles, IAM, interlocks,
  canaries, chaos drills, postmortems, action tracking, and searchable runbooks
  at equal operational cost.
- **Used by:** [Candidate 011](../experiments/candidates/011-dual-loop-operational-assurance.md),
  [HRO audit](audits/2026-08-05-high-reliability-organizations-incident-learning.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-186

- **Statement:** Stored-program substation protection can infer fault location
  and issue breaker-opening commands, establishing high-speed bounded local
  digital authority as an engineering family.
- **Status:** established.
- **Primary source:** `rockefeller1969fault`.
- **Rationale:** Detection, selectivity, and actuation can be colocated inside a
  crisp physical protection zone.
- **Open issue:** AI transfers need an equally explicit zone, actuator,
  dependability target, and safe failure path.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-187

- **Statement:** Protection quality jointly includes dependability, security,
  selectivity, and clearing performance; a fast detector alone is not a
  protection result.
- **Status:** established.
- **Primary sources:** `rockefeller1969fault`, `nerc2019prc004`.
- **Rationale:** Missed action, false action, collateral isolation, and delay
  are separate failure axes.
- **Open issue:** Numerical targets and tradeoffs remain scheme-, zone-, and
  consequence-specific.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [Candidate 012](../experiments/candidates/012-latency-qualified-authority.md).

### C-188

- **Statement:** Online relay-setting changes and hierarchies of local,
  substation, and remote processors predate modern machine learning.
- **Status:** established.
- **Primary source:** `rockefeller1988adaptive`.
- **Rationale:** Adaptive authority and multilevel protection are mandatory
  engineering nulls rather than novel consequences of biological analogy.
- **Open issue:** Field benefit, validation latency, setting error, and
  observability remain application-specific.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-189

- **Statement:** Protection defects, setting and design errors, malfunctions,
  and communication failures can remain latent and amplify a later disturbance.
- **Status:** established.
- **Primary sources:** `tamronglak1996anatomy`, `phadke1995anatomy`,
  `nerc2020reliability`.
- **Rationale:** A safety layer becomes another coupled component with hidden
  common-mode and maintenance failures.
- **Open issue:** Rates vary by system, reporting period, exposure, and
  classification; independent validation and behavioral scrubbing require
  explicit budgets.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-190

- **Statement:** Wide-area protection and remedial-action schemes combine
  broader measurements with selected pre-engineered actions without replacing
  local primary protection guarantees.
- **Status:** established.
- **Primary sources:** `begovic2005wide`, `nerc2016prc012`.
- **Rationale:** Wider view, communication, and event-dependent coordination
  trade additional coverage for latency, trust, and coupling.
- **Open issue:** Exact performance and coalition membership remain
  scheme-specific; communication alone does not establish useful transient
  coordination.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-191

- **Statement:** Static state estimation infers voltage state from redundant
  measurements and a network model under observability and error assumptions;
  it is neither direct ground truth nor a dynamic-stability guarantee.
- **Status:** established.
- **Primary source:** `schweppe1970state`.
- **Rationale:** A shared estimated state depends on model, topology,
  measurement placement, covariance, and residual assumptions.
- **Open issue:** Topology error, nonstationarity, unobservable regions, delay,
  and adversarial model consistency can defeat the estimate.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-192

- **Statement:** Synchrophasors provide standardized time-referenced phasor,
  frequency, and rate-of-change measurements, while end-to-end control latency
  and trust require separate clock, network, concentrator, model, and actuator
  evidence.
- **Status:** established.
- **Primary sources:** `phadke1983measurement`,
  `ieeeiec2018synchrophasor`.
- **Rationale:** Synchronized measurement widens the observable boundary but
  does not by itself grant authority or certify the whole path.
- **Open issue:** Timestamp quality, delay, loss, spoofing, aggregation, and
  control deadlines must be measured end to end.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [Candidate 012](../experiments/candidates/012-latency-qualified-authority.md).

### C-193

- **Statement:** In a linear state-estimation model, attacks of the form
  $a=Hc$ can bias estimated state while preserving ordinary residual structure
  under the stated access assumptions.
- **Status:** established.
- **Primary source:** `liu2009false`.
- **Rationale:** A residual-only detector can be blind to model-consistent
  corruption.
- **Open issue:** The construction is threat-model scoped; access, topology,
  nonlinear dynamics, protected sensors, and alternative checks change
  feasibility.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-194

- **Statement:** Frequency response composes inertia and load behavior, primary
  feedback, secondary restoration, and tertiary reserve or dispatch; these
  layers are not interchangeable.
- **Status:** established.
- **Primary sources:** `kundur2004definition`, `nerc2019pfc`.
- **Rationale:** Arresting deviation, stabilizing frequency, restoring the
  target, and replenishing reserve occur under different authority, timescale,
  and energy boundaries.
- **Open issue:** Aggregate parameters and response quality change with device
  mix, operating point, limits, and topology.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-195

- **Statement:** Droop-controlled sources can coordinate and share power from
  local electrical measurements and network coupling, while synchronization
  guarantees remain model-, limit-, and topology-scoped.
- **Status:** established.
- **Primary sources:** `chandorkar1993parallel`,
  `simpsonporco2013droop`, `dorfler2013synchronization`.
- **Rationale:** Local physical feedback can coordinate without continuous
  central commands.
- **Open issue:** Saturation, line dynamics, delays, heterogeneous controls,
  weak grids, and changed topology bound transfer.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-196

- **Statement:** Fast frequency and grid-forming response is constrained by
  rated power, current, headroom, energy, delay, duration, state of charge, and
  interacting controls rather than being free software inertia.
- **Status:** established.
- **Primary sources:** `nerc2020ffr`, `nerc2023gfm`, `milano2018lowinertia`.
- **Rationale:** Fast control consumes finite physical authority and can
  saturate before slower layers restore state.
- **Open issue:** Device and test values do not transfer; qualification must
  include the second event and replenishment.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [Candidate 012](../experiments/candidates/012-latency-qualified-authority.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-197

- **Statement:** Demand response is constrained load flexibility whose value
  depends on response, duration, availability, location, process or comfort
  cost, and rebound.
- **Status:** established.
- **Primary sources:** `callaway2011loads`, `palensky2011demand`.
- **Rationale:** Deferred consumption and lost service are not equivalent to
  generated energy or permanent capacity.
- **Open issue:** Baselines, rebound, correlated participation, communication,
  and a second event can reverse apparent benefit.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-198

- **Statement:** Reserve is usable only when available, rampable before the
  deadline, sustainable for the required duration, and deliverable through the
  surviving network.
- **Status:** established.
- **Primary sources:** `nerc2018bal002`, `uscanada2004blackout`.
- **Rationale:** Nameplate or stored capacity is not operational headroom.
- **Open issue:** Location, transmission, fuel or state of charge, restoration,
  common-mode loss, and replenishment determine the next-event state.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-199

- **Statement:** Controlled islanding is a constrained physical partition that
  requires generator coherence, real and reactive balance, network limits,
  viable protection and control, and later synchronization.
- **Status:** established.
- **Primary sources:** `sun2003splitting`, `yang2006islanding`,
  `lasseter2002microgrids`.
- **Rationale:** Generic graph modularity cannot establish that each island is
  dynamically viable or safely reconnectable.
- **Open issue:** Model error, boundary selection, load pickup, protection
  settings, black-start resources, and resynchronization remain decisive.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [Candidate 005](../experiments/candidates/005-severity-ordered-containment.md).

### C-200

- **Statement:** Cascading outages can couple physical redistribution,
  protection and control actions, observability, organizational failure, and
  both fast event and slow adaptation timescales.
- **Status:** established.
- **Primary sources:** `uscanada2004blackout`, `dobson2001initial`.
- **Rationale:** The safety and recovery layers participate in the same dynamic
  topology they attempt to stabilize.
- **Open issue:** One event sequence or theoretical model does not establish
  universal criticality or transferable event rates.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-201

- **Statement:** `N-1` security is conditional on a declared contingency set,
  initial state, models, limits, and corrective actions rather than a universal
  resilience theorem.
- **Status:** established.
- **Primary source:** `nerc2022tpl001`.
- **Rationale:** Multiple, protection-failure, common-structure, and outside-set
  events require additional assessment.
- **Open issue:** The contract must remain tied to actual topology, operating
  state, modeling uncertainty, and executable corrective authority.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-202

- **Statement:** Black-start restoration is a tested and trained sequence of
  cranking, energization, balancing, load pickup, synchronization, and authority
  transfer under real, reactive, resource, and topology constraints.
- **Status:** established.
- **Primary sources:** `nerc2018eop005`, `adibi1994restoration`,
  `lindenmeyer2001restoration`.
- **Rationale:** Recovery is constrained reconstruction with named prerequisites
  and staged authority, not merely restarting components.
- **Open issue:** Cranking resources, communication, cold-load pickup, reactive
  limits, hidden damage, and changed topology can invalidate the plan.
- **Used by:** [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-203

- **Statement:** Dynamically restricting action authority from observation age,
  integrity, mode, physical headroom, and coordination state may improve
  service and risk relative to fixed hierarchies.
- **Status:** speculative.
- **Primary source:** none sufficient; grid components are scoped in
  [C-186](#c-186)–[C-202](#c-202).
- **Rationale:** Fast local evidence, delayed wide-area evidence, finite
  authority, and degraded communication are represented in one shrinking or
  widening admissible-action boundary.
- **Open issue:** The candidate must beat adaptive protection, gain scheduling,
  constrained and robust control, barrier functions, runtime assurance, and
  restoration runbooks without self-certification or uncharged reserve.
- **Used by:** [Candidate 012](../experiments/candidates/012-latency-qualified-authority.md),
  [power-grid audit](audits/2026-08-05-power-grids-protection-and-recovery.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-204

- **Statement:** In Arabidopsis, clade-3 glutamate-receptor-like channels
  participate causally in wound-induced electrical and calcium signaling and
  distal defense, while in Marchantia a related systemic signal can be
  uncoupled from systemic oxylipin-gene induction.
- **Status:** established.
- **Primary sources:** `mousavi2013glr`, `toyota2018glutamate`,
  `sanmartin2024marchantia`.
- **Rationale:** Propagation and decoded downstream effect are separate causal
  stages.
- **Open issue:** Species, vascular anatomy, stimulus, receptor complement, and
  output determine whether a propagated signal changes defense.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-205

- **Statement:** RBOHD-dependent reactive-oxygen propagation and GLR3.3
  desensitization show that rapid plant-wide alarms combine local amplification
  with mechanisms that restore a resting state.
- **Status:** established.
- **Primary sources:** `miller2009rbohd`, `yan2024desensitization`.
- **Rationale:** Regenerative gain and negative feedback jointly determine
  coverage, sensitivity, saturation, and repeated-event response.
- **Open issue:** Reported speeds and defense effects are assay-specific;
  repeated-stress, false-alarm, and growth costs remain regime-dependent.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-206

- **Statement:** Rapid hydraulic root-to-shoot drought evidence and slower
  CLE25/ABA-mediated control are complementary rather than interchangeable.
- **Status:** established.
- **Primary sources:** `christmann2007hydraulic`, `takahashi2018cle25`.
- **Rationale:** A fast physical state path can trigger protection while a
  slower biochemical path supplies more specific context and control.
- **Open issue:** Contribution changes with species, tissue, drought onset,
  duration, geometry, conductance, capacitance, and transpiration.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-207

- **Statement:** Nitrogen-starved Arabidopsis roots can send CEP peptides to
  shoot receptors, which induce descending CEPD signals that enhance
  high-affinity nitrate uptake where roots locally encounter nitrate.
- **Status:** established.
- **Primary sources:** `tabata2014cep`, `ohkubo2017cepd`.
- **Rationale:** The loop separates deficit-up, context-down, and local
  opportunity gating.
- **Open issue:** The systems abstraction may reduce entirely to backpressure,
  primal–dual control, and ordinary feasibility constraints.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [Candidate 013](../experiments/candidates/013-deficit-capability-routing.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-208

- **Statement:** NRT1.1- and TCP20-related signaling contributes to
  preferential lateral-root proliferation in nitrate-rich patches under
  heterogeneous supply.
- **Status:** established.
- **Primary sources:** `remans2006nrt11`, `guan2014tcp20`.
- **Rationale:** Local nutrient evidence changes irreversible structural
  allocation and future sampling geometry.
- **Open issue:** Growth pays only when a patch persists long enough to
  amortize construction, maintenance, and reversal cost.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-209

- **Statement:** Differential growth is shared across plant tropisms, while
  cue sensing, transporters, tissue, and signaling mechanism are not universal.
- **Status:** established.
- **Primary sources:** `ding2011pin3`, `rakusova2011pin3`,
  `dietrich2017hydrotropism`, `kimura2018rootphototropism`.
- **Rationale:** Similar actuator geometry can arise from materially different
  sensing and causal paths.
- **Open issue:** A post-bending molecular gradient cannot by itself identify
  the initiating sensor or justify one generic tropism controller.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-210

- **Statement:** Sugar availability can precede auxin depletion in initiating
  pea bud release after decapitation, while auxin transport and strigolactone
  pathways regulate later branch competition and sustained outgrowth.
- **Status:** established.
- **Primary sources:** `mason2014sugar`, `brewer2009strigolactone`,
  `prusinkiewicz2009auxinswitch`.
- **Rationale:** Initial reserve release and sustained structural admission are
  distinct stages.
- **Open issue:** Sugar is both resource and signal; node, species, and
  developmental state limit transfer.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-211

- **Statement:** Direct pressure, flow, geometry, imaging, and transporter
  perturbations support osmotically generated long-distance phloem flow with
  active loading and anatomically selective unloading.
- **Status:** established.
- **Primary sources:** `knoblauch2016munch`, `rosselliott2017unloading`,
  `chen2012sweet`.
- **Rationale:** Physical transport, loading, unloading, and cargo filtering
  form separate cost and control boundaries.
- **Open issue:** No single efficiency constant covers geometry, viscosity,
  pressure, active transport, interface selectivity, and maintenance.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-212

- **Statement:** In split-pot tomato, a larger root sink attracted more carbon
  when vascularly aligned with a labeled source but did not overcome a poorly
  connected sector.
- **Status:** established.
- **Primary source:** `bledsoe2006sectoriality`.
- **Rationale:** Demand cannot allocate through a path the physical topology
  does not provide.
- **Open issue:** Species and developmental architectures differ; the
  transferable constraint is feasible path before objective size.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-213

- **Statement:** Controlled experiments have demonstrated direct hyphal carbon
  transfer in one mycorrhizal system and a defense-associated receiver effect
  in connected tomato plants after donor challenge.
- **Status:** established.
- **Primary sources:** `francis1984direct`, `song2010communication`.
- **Rationale:** A shared fungal path can carry material or alter a receiver
  response in scoped systems.
- **Open issue:** Direct path, payload, donor benefit, receiver benefit,
  intentional signaling, and ecosystem effect remain separate claims.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-214

- **Statement:** Controlled isotope experiments support preferential
  reciprocal allocation between plants and fungi while multi-host networks can
  produce strongly asymmetric terms of trade.
- **Status:** established.
- **Primary sources:** `kiers2011rewards`, `walder2012unequal`.
- **Rationale:** Exchange occurs between partners with partly aligned and
  partly conflicting objectives.
- **Open issue:** Reciprocal reward does not establish equality, altruism,
  shared intent, or benefit to every participant.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-215

- **Statement:** Shared mycorrhizal networks can increase some productivity or
  nutrient measures while also intensifying competition or plant-size
  inequality in controlled systems.
- **Status:** established.
- **Primary sources:** `merrild2013competition`,
  `weremijewicz2013inequality`.
- **Rationale:** Community outcome is vector-valued rather than captured by
  mean biomass.
- **Open issue:** Productivity, distribution, robustness, exclusion, and each
  participant's benefit require separate measurements.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-216

- **Statement:** A composition of upward deficit signals, downward scarcity
  context, and local capability gates may reduce communication while allocating
  sparse capacity under heterogeneous demand.
- **Status:** speculative.
- **Primary sources:** `tabata2014cep`, `ohkubo2017cepd`,
  `remans2006nrt11` establish biological components only.
- **Rationale:** The composition separates demand, global context, and local
  feasibility before allocation or growth.
- **Open issue:** It must beat backpressure, primal–dual control, delayed
  centralized optimization, and learned routing under delay, topology change,
  strategic demand, and complete resource cost.
- **Used by:** [Candidate 013](../experiments/candidates/013-deficit-capability-routing.md),
  [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-217

- **Statement:** Evidence that compatible fungi occur, a tracer reaches a
  receiver, or a connected seedling performs better does not alone establish a
  continuous common network, path-exclusive transfer, net donor benefit, or
  generalized aid in forests.
- **Status:** disputed.
- **Primary source:** `karst2023bias`.
- **Rationale:** Controlled transfer mechanisms coexist with path ambiguity,
  unequal outcomes, and documented citation bias in stronger forest-network
  narratives.
- **Open issue:** This disputes the generalized inference chain, not the
  ecological importance of mycorrhizae or every controlled transfer result.
- **Used by:** [plant audit](audits/2026-08-05-plant-distributed-control.md),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-218

- **Statement:** Remote inference requires a forward observation model that
  separates latent source, nuisance state, propagation, instrument response,
  background, and noise.
- **Status:** established.
- **Primary sources:** `rodgers2000inverse`, `line2013retrieval`.
- **Rationale:** An inverse estimate is conditional on the process that turns a
  latent state into measurements.
- **Open issue:** A concentrated posterior or confidence score can remain wrong
  under response, nuisance, background, or structural misspecification.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-219

- **Statement:** Richardson–Lucy and CLEAN establish response-aware
  reconstruction families without proving that every reconstructed feature is
  physical.
- **Status:** established.
- **Primary sources:** `richardson1972bayesian`, `lucy1974iterative`,
  `hogbom1974aperture`.
- **Rationale:** Reconstruction combines a response model, data, iteration, and
  regularizing choices.
- **Open issue:** Response error, stopping rule, sidelobes, priors, and
  nonlinear preprocessing can create artifacts; injection and alternative
  reductions remain mandatory.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-220

- **Statement:** Catalog membership is a selection event whose probability may
  depend on the same noisy data later analyzed.
- **Status:** established.
- **Primary sources:** `schmidt1968space`, `loredo2004source`.
- **Rationale:** Population likelihood must include detection and inclusion
  probability over source and context, not treat the observed catalog as an
  unbiased sample.
- **Open issue:** Constant completeness correction fails when efficiency varies
  with flux, background, location, spectrum, cadence, or pipeline state.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-221

- **Statement:** A non-detection constrains a source only through declared
  exposure, background, threshold, response, and detection power.
- **Status:** established.
- **Primary source:** `kashyap2010upper`.
- **Rationale:** No selected record is not equivalent to a measured zero or an
  exposure-free upper bound.
- **Open issue:** Power changes with source properties, trial policy,
  background, calibration, and searched family.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-222

- **Statement:** Survey design is a multi-objective allocation problem across
  area, depth, cadence, wavelength, latency, and follow-up capacity.
- **Status:** established.
- **Primary source:** `ivezic2019lsst`.
- **Rationale:** Observation policy changes which events and populations become
  visible.
- **Open issue:** Incompatible science utilities, weather, hardware, season,
  alert load, and future discoveries prevent one astronomy-specific universal
  policy.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-223

- **Statement:** Hierarchical marginalization can prevent plug-in source
  uncertainty from corrupting population inference under a correct population,
  measurement, and selection model.
- **Status:** established.
- **Primary source:** `loredo2004source`.
- **Rationale:** Individual uncertainty and population structure must be
  propagated jointly instead of replacing every source with one point estimate.
- **Open issue:** Misspecified population families, priors, selection, and
  dependence can remain confidently wrong.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-224

- **Statement:** Multi-sensor fusion requires an explicit source-association
  hypothesis and a dependence model before evidence is multiplied.
- **Status:** established.
- **Primary sources:** `budavari2008crossid`, `abbott2017multimessenger`.
- **Rationale:** Records can be unrelated coincidences or share calibration,
  clocks, foregrounds, catalogs, simulations, and priors.
- **Open issue:** Different modality is not evidence of conditional
  independence; association uncertainty must reach the final claim.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-225

- **Statement:** Model evidence, posterior or predictive checking, and
  computation calibration answer distinct assurance questions.
- **Status:** established.
- **Primary sources:** `trotta2008bayes`, `skilling2006nested`,
  `gelman1996posterior`, `talts2018sbc`.
- **Rationale:** Relative model support, fit-to-observed discrepancies, and
  correctness of the inference implementation are not interchangeable.
- **Open issue:** All can pass inside a jointly misspecified model family or
  simulator.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-226

- **Statement:** Rare-event significance must account for the searched
  template, time, location, and parameter family plus downstream follow-up
  exposure.
- **Status:** established.
- **Primary sources:** `allen2012findchirp`, `kovacs2002box`,
  `gross2010trials`.
- **Rationale:** A local detection statistic omits the opportunities that could
  have produced an extreme score.
- **Open issue:** Adaptive search, correlated templates, broker filtering, and
  repeated follow-up complicate effective trial accounting.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-227

- **Statement:** A versioned time-domain alert is a temporary follow-up claim,
  not a confirmed discovery or authority for irreversible action.
- **Status:** established.
- **Primary sources:** `bellm2019ztf`, `seaman2011voevent`.
- **Rationale:** Detection, packet schema, revisions, broker policy,
  subscribers, and later observations jointly determine operational meaning.
- **Open issue:** Subscriber lag, supersession, duplicated alerts, and
  follow-up selection can propagate stale confidence.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-228

- **Statement:** Remote mechanistic model comparison does not by itself
  identify an intervention effect or exclude omitted causes.
- **Status:** established.
- **Primary source:** `catling2018biosignatures`.
- **Rationale:** A best-supported explanation remains conditional on the
  modeled alternatives, observation chain, and background knowledge.
- **Open issue:** Mechanistic plausibility, predictive support, exclusion of
  alternatives, and identified causality need separate labels.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-229

- **Statement:** Some remote-inference uncertainty is limited by response null
  spaces, exact degeneracy, or a finite number of realized modes rather than
  detector noise.
- **Status:** established.
- **Primary sources:** `rodgers2000inverse`, `knox1995inflationary`.
- **Rationale:** More exposure cannot identify a direction that the response
  does not encode or create independent realizations that do not exist.
- **Open issue:** Systems must separate reducible measurement uncertainty from
  structural and realization-limited uncertainty before buying more data.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-230

- **Statement:** Adaptive astronomical follow-up is a value-of-information
  sensing problem whose policy induces future selection.
- **Status:** established.
- **Primary sources:** `ivezic2019lsst`, `bellm2019ztf`.
- **Rationale:** Limited observation capacity is assigned to candidates that
  alter expected inference or decision value.
- **Open issue:** The policy must beat ordinary Bayesian design, scheduling,
  POMDP, and bandit baselines while measuring self-confirmation and missed
  classes.
- **Used by:** [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-231

- **Statement:** Propagating response, exposure, selection, association,
  uncertainty, and data-vintage dependencies with an inferred claim may reduce
  invalid multi-agent evidence composition.
- **Status:** speculative.
- **Primary source:** none sufficient; components are scoped in
  [C-218](#c-218)–[C-230](#c-230).
- **Rationale:** The held observation contract makes downstream validity depend
  on the full versioned observation chain rather than a detached confidence
  score.
- **Open issue:** It must beat a typed schema, calibrated likelihood, selection
  model, lineage, detection statistics, predictive checks, simulation
  calibration, graded assurance, surveillance modeling, and value-of-information
  scheduling at equal lifecycle cost.
- **Used by:** [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [astronomy audit](audits/2026-08-05-astronomy-remote-inference.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-232

- **Statement:** Brittle crack advance can be expressed as an energy-release
  threshold in the Griffith idealization.
- **Status:** established.
- **Primary source:** `griffith1921rupture`.
- **Rationale:** Local propagation follows a material and loading condition,
  not a represented routing objective.
- **Open issue:** Ductile, frictional, chemically assisted, heterogeneous, and
  dynamic fracture require additional state and constitutive laws.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-233

- **Statement:** Interacting local failures can generate spatially organized
  fracture or fault sets without a central controller.
- **Status:** plausible.
- **Primary sources:** `renshaw1994fracture`, `cowie1993faults`.
- **Rationale:** Stress redistribution and local propagation produce network
  structure through physics.
- **Open issue:** Fit, finite-scale dependence, material heterogeneity, and
  boundary conditions do not establish a represented service objective.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-234

- **Statement:** Geometric connectivity and hydraulic conductance are not
  equivalent in fracture networks.
- **Status:** established.
- **Primary sources:** `berkowitz1995connectivity`,
  `witherspoon1980cubic`.
- **Rationale:** A connected path may have negligible aperture or throughput,
  while contact, roughness, stress, fluid, and boundary conditions determine
  actual transport.
- **Open issue:** Graph metrics cannot substitute for task capacity or service
  under load.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-235

- **Statement:** Apparent fracture scaling requires explicit lower and upper
  cutoffs, sampling support, and finite-size tests.
- **Status:** established.
- **Primary sources:** `bonnet2001scaling`, `rundle2003faultsystems`.
- **Rationale:** A fitted power law over a sampled range does not establish one
  growth mechanism, criticality, or unlimited scale transfer.
- **Open issue:** Detection limits, orientation, dimensional projection, and
  truncation alter fitted exponents.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md).

### C-236

- **Statement:** Coupled flow, erosion, and topography can generate drainage
  organization through local feedback and conservation.
- **Status:** established.
- **Primary sources:** `smith1972drainage`, `howard1994drainage`.
- **Rationale:** Existing paths concentrate flow, which changes erosion and
  future paths under declared process laws.
- **Open issue:** Model class, substrate, uplift, sediment, vegetation, climate,
  and absent agency bound transfer.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-237

- **Statement:** Minimum-energy drainage networks are solutions to
  analyst-defined objectives rather than evidence that rivers represent and
  optimize that objective online.
- **Status:** established.
- **Primary sources:** `rinaldo1992minimum`,
  `rodrigueziturbe1992leastenergy`, `banavar1999transport`.
- **Rationale:** Similar statistics can emerge from variational models,
  dissipative dynamics, positive feedback, or survivor selection.
- **Open issue:** Equifinality and objective choice prevent inferring a hidden
  controller from an efficient-looking network.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-238

- **Statement:** Stream-power landscape equations are useful scoped process
  models rather than universal laws.
- **Status:** plausible.
- **Primary source:** `howard1994drainage`.
- **Rationale:** The equations expose relationships among uplift, slope,
  drainage area, and erosion inside a model class.
- **Open issue:** Transport limitation, glaciation, mass wasting, vegetation,
  lithology, thresholds, and stochastic events require other dynamics.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md).

### C-239

- **Statement:** Sediment continuity couples erosion and deposition; material
  removed from one control volume is transported, stored, or leaves through a
  declared boundary.
- **Status:** established.
- **Primary source:** `paola2005exner`.
- **Rationale:** Structural deletion has a relocation and downstream-state
  consequence rather than zero lifecycle cost.
- **Open issue:** Open boundaries, grain classes, porosity, suspension, and
  unresolved storage must be declared.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-240

- **Statement:** Landscape response time depends on forcing, process law,
  spatial scale, observed metric, direction, and initial condition.
- **Status:** established.
- **Primary sources:** `whipple2001response`, `tucker1997climate`.
- **Rationale:** Different parts and metrics of one landscape can adjust on
  different clocks.
- **Open issue:** One relaxation time cannot represent mixed processes,
  thresholds, moving boundaries, or path-dependent topology.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-241

- **Statement:** Geomorphic adjustment can depend on forcing direction and
  prior state.
- **Status:** established.
- **Primary sources:** `schumm1979thresholds`, `jerolmack2007avulsion`.
- **Rationale:** Similar external forcing can map to different internal state
  and trajectories because stored geometry and sediment history differ.
- **Open issue:** Hysteresis must remain distinct from ordinary lag, averaging,
  irreversible damage, and noise.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-242

- **Statement:** River capture and avulsion can persistently reassign transport
  service and encode path dependence.
- **Status:** established.
- **Primary sources:** `willett2014reorganization`,
  `jerolmack2007avulsion`.
- **Rationale:** Topology change can move both flow and downstream consequence
  rather than preserving existing service.
- **Open issue:** Persistence, trigger, sediment supply, and affected recipients
  differ; topology change is not delegated control.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-243

- **Statement:** Sediment transport and preservation can destroy or distort
  environmental input signals before they enter the geological record.
- **Status:** established.
- **Primary source:** `jerolmack2010shredding`.
- **Rationale:** The archive has a preservation operator, not merely additive
  measurement noise.
- **Open issue:** Inference requires event survival, averaging, storage,
  remobilization, and censoring models.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-244

- **Statement:** Near-threshold channel dynamics can act as a nonlinear filter
  on climatic forcing in scoped systems.
- **Status:** plausible.
- **Primary source:** `phillips2016filter`.
- **Rationale:** A process threshold can suppress small inputs and release
  accumulated response during larger events.
- **Open issue:** Field scope, sediment supply, measurement support, and
  alternative controls limit the inference.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-245

- **Statement:** Infinite-slope and infiltration models express conditional
  landslide margins rather than universal trigger laws.
- **Status:** established.
- **Primary sources:** `montgomery1994landslide`, `iverson2000landslide`.
- **Rationale:** Failure depends on material, geometry, pore pressure,
  infiltration, boundary, and initial conditions.
- **Open issue:** Hidden hydrologic and strength state can make a precise
  physical threshold operationally hard to observe.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-246

- **Statement:** Empirical rainfall intensity–duration thresholds can support
  regional warning only inside their calibration and operating boundaries.
- **Status:** established.
- **Primary sources:** `caine1980rainfall`, `keefer1987warning`,
  `baum2010timing`.
- **Rationale:** Operational warning trades misses, false alarms, lead time,
  spatial support, and base rate rather than discovering a universal trigger.
- **Open issue:** Terrain, sensor network, storm type, transfer region, event
  inventory, and intervention policy change performance.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-247

- **Statement:** Sparse geophysical and hydrologic data resolve averages under
  an observation operator rather than a unique hidden field.
- **Status:** established.
- **Primary sources:** `backus1968resolution`, `beven1989hydrology`,
  `bloeschl1995scale`.
- **Rationale:** Spatial support, averaging kernel, nonuniqueness, and model
  structure determine what a measurement can resolve.
- **Open issue:** More sensors can still leave null spaces, equifinality, and
  scale mismatch.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-248

- **Statement:** Geomorphic estimates integrating different spatial and
  temporal windows need not estimate the same quantity.
- **Status:** established.
- **Primary sources:** `granger1996erosion`, `kirchner2001timescales`,
  `hilley2004landslides`.
- **Rationale:** Event, reach, catchment, and geological averages carry
  different supports and may respond to different histories.
- **Open issue:** Stationarity and support equivalence must be tested before
  fusion or trend comparison.
- **Used by:** [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-249

- **Statement:** Requiring every telemetry value to carry spatial support,
  integration window, latency, resolution, observation operator, preservation
  state, and intervention history may reduce false mixed-clock diagnosis.
- **Status:** speculative.
- **Primary source:** none sufficient; geological component boundaries are
  scoped in [C-235](#c-235), [C-243](#c-243), [C-247](#c-247), and
  [C-248](#c-248).
- **Rationale:** A fusion layer can compare observations only through declared
  transformations between supports instead of treating unlike aggregates as
  contemporaneous measurements of one state.
- **Open issue:** The proposal must beat standard observation models,
  hierarchical state-space models, Gaussian processes, mixed-frequency models,
  event-time schemas, lineage, and a metadata-only “never aggregate unlike
  windows” rule at equal cost.
- **Used by:** [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [geology audit](audits/2026-08-05-geology-geomorphology.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-250

- **Statement:** Authentication and authorization are distinct; protocol
  authentication is relative to a named correspondence, freshness, and
  adversary model.
- **Status:** established.
- **Primary sources:** `needham1978authentication`, `dolev1983security`,
  `lowe1995attack`.
- **Rationale:** Demonstrating control of accepted credentials does not grant a
  capability or prove benign intent and safe outcome.
- **Open issue:** Endpoint compromise, identity proofing, replay state, clock,
  recovery, and implementation remain trusted boundaries.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [Candidate 009](../experiments/candidates/009-graded-assurance-envelopes.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-251

- **Statement:** Secure cryptographic primitives do not by themselves prove a
  composed authentication protocol secure.
- **Status:** established.
- **Primary sources:** `dolev1983security`, `lowe1995attack`.
- **Rationale:** Message order, identities, freshness, binding, and adversarial
  composition create protocol-level failure despite strong encryption.
- **Open issue:** Formal model, computational assumptions, implementation,
  endpoint, and key custody must match deployment.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [Candidate 009](../experiments/candidates/009-graded-assurance-envelopes.md).

### C-252

- **Statement:** Least privilege, complete mediation, separation of privilege,
  and capability-based authority are established security design families.
- **Status:** established.
- **Primary sources:** `saltzer1975protection`, `dennis1966programming`,
  `watson2010capsicum`.
- **Rationale:** Authority is reduced, mediated at named boundaries, and split
  across principals or capabilities.
- **Open issue:** Incorrect policy, ambient bypass, malicious authorized action,
  collusion, and compromised enforcement remain outside the guarantee.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-253

- **Statement:** Weighted capability-seconds may expose cumulative authority
  risk when right definitions and severity weights remain auditable.
- **Status:** plausible.
- **Primary source:** none sufficient; dimensional synthesis from
  [C-252](#c-252).
- **Rationale:** Scope and duration jointly determine compromise opportunity
  more clearly than credential count.
- **Open issue:** Cardinality and weights can be arbitrary, nonlinear, and
  context-dependent; report raw rights and time beside any aggregate.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [Candidate 012](../experiments/candidates/012-latency-qualified-authority.md).

### C-254

- **Statement:** NIST zero trust removes location-based implicit trust while
  retaining explicit roots in identity, policy, telemetry, enforcement, and
  recovery.
- **Status:** established.
- **Primary source:** `rose2020zero`.
- **Rationale:** Repeated access evaluation changes the trust path but cannot
  eliminate trust roots.
- **Open issue:** Operational efficacy, policy correctness, compromised
  identity/control planes, authorized harm, and recovery remain
  deployment-specific.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [Candidate 009](../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 012](../experiments/candidates/012-latency-qualified-authority.md).

### C-255

- **Statement:** Shamir sharing protects secrecy below threshold in its ideal
  finite-field model without alone providing verifiability, robust signing,
  availability, or secure reconstruction.
- **Status:** established.
- **Primary source:** `shamir1979share`.
- **Rationale:** Polynomial shares distribute a secret but do not specify the
  whole participant, communication, refresh, and recovery protocol.
- **Open issue:** Malicious shares, unavailable holders, side channels, random
  generation, identity, and reconstruction exposure require other mechanisms.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-256

- **Statement:** Threshold-system benefit depends on audited administrative,
  software, credential, identity, and recovery independence plus compromise
  cadence rather than logical participant count alone.
- **Status:** plausible.
- **Primary sources:** `herzberg1995proactive`, `gennaro2001threshold`,
  `douceur2002sybil`.
- **Rationale:** A shared control plane or Sybil owner collapses apparent
  multiplicity into one failure domain.
- **Open issue:** Independence is difficult to establish and maintain; latency,
  coordination, liveness, and recovery costs rise with distribution.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-257

- **Statement:** PBFT-style safety assumes bounded Byzantine identities and
  authenticated replicas, while liveness, privacy, client correctness, and
  common-mode compromise are separate.
- **Status:** established.
- **Primary sources:** `lamport1982byzantine`, `castro1999pbft`.
- **Rationale:** Quorum intersection provides scoped agreement under a declared
  fault and timing model.
- **Open issue:** Excess faults, correlated implementation or keys, Sybils,
  bad clients, denial of service, and state privacy lie outside the basic claim.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-258

- **Statement:** Proactive lifetime guarantees depend on fewer than the
  threshold number of compromises per vulnerability window plus trustworthy
  refresh, erasure, epoch agreement, and recovery.
- **Status:** established.
- **Primary sources:** `herzberg1995proactive`, `castro2002proactive`.
- **Rationale:** Periodic refresh can prevent compromises from accumulating
  across epochs only under mobile-adversary and clean-refresh assumptions.
- **Open issue:** Refresh-channel, clock, erasure, recovery-root, or common-mode
  compromise breaks the bound.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-259

- **Statement:** Forward-secure signatures can protect past epochs after
  current-key compromise under scheme assumptions without protecting the
  current or future epoch or guaranteeing erasure.
- **Status:** established.
- **Primary source:** `bellare1999forward`.
- **Rationale:** Key evolution narrows the temporal set of forgeries available
  after compromise.
- **Open issue:** Current compromise, rollback to old key state, copied
  plaintext, malicious legitimate signing, endpoint state, and erasure remain.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-260

- **Statement:** End-to-end revocation exposure is better measured from
  compromise to the last covered acceptance than by nominal credential lifetime.
- **Status:** plausible.
- **Primary source:** `santesson2013ocsp`.
- **Rationale:** Sessions, caches, delegation, offline enforcement, status
  freshness, propagation, and acknowledgement can outlive issuer revocation.
- **Open issue:** Coverage and acceptance logs may be incomplete or controlled
  by the compromised path.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [Candidate 012](../experiments/candidates/012-latency-qualified-authority.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment).

### C-261

- **Statement:** Operational alert precision depends on attack prevalence, so
  balanced-dataset accuracy is insufficient.
- **Status:** established.
- **Primary sources:** `denning1987intrusion`, `paxson1999bro`,
  `sommer2010outside`.
- **Rationale:** Even high sensitivity and specificity can yield analyst-flooding
  false positives when attacks are rare.
- **Open issue:** Prevalence, adaptive evasion, base-rate drift, sensor coverage,
  duplicate alerts, and analyst behavior remain uncertain.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-262

- **Statement:** Intrusion detection is a sensing and classification layer,
  not containment, revocation, or compromise recovery.
- **Status:** established.
- **Primary sources:** `denning1987intrusion`, `paxson1999bro`.
- **Rationale:** An alert changes no authority unless a separately defined and
  evaluated response path acts on it.
- **Open issue:** Automatic coupling can introduce false shutdown, attacker
  control of response, and unsafe remediation.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [Candidate 011](../experiments/candidates/011-dual-loop-operational-assurance.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-263

- **Statement:** Moving-target defenses should be evaluated by attacker
  work-factor change after information leakage, retries, and adaptation rather
  than nominal configuration entropy.
- **Status:** plausible.
- **Primary sources:** `shacham2004aslr`, `snow2013jit`.
- **Rationale:** Randomization helps only when it invalidates useful attacker
  knowledge more quickly than it adds defender cost and new attack surface.
- **Open issue:** Disclosure, crashes, probing, side channels, reuse, deployment
  diversity, and adaptation can erase the nominal search space.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-264

- **Statement:** Information-flow and noninterference guarantees are relative
  to labels, observations, semantics, declassification, and covered channels.
- **Status:** established.
- **Primary sources:** `denning1976lattice`, `goguen1982policies`.
- **Rationale:** A formal flow property can restrict declared information
  transfer without proving truth, purpose, task quality, or all covert channels.
- **Open issue:** Timing, resource, physical, declassification, reflection,
  native, and uninstrumented channels can lie outside the model.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [Candidate 009](../experiments/candidates/009-graded-assurance-envelopes.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-265

- **Statement:** Availability recovery can faithfully restore compromised
  state; compromise recovery additionally needs a trustworthy horizon, clean
  root, credential replacement, persistence removal, and recurrence tests.
- **Status:** established.
- **Primary sources:** `herzberg1995proactive`, `castro2002proactive`.
- **Rationale:** Service restoration and security-state restoration have
  different target invariants.
- **Open issue:** The image, backup, keys, build chain, attestation, operators,
  logs, and historical data may share the compromise.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [Candidate 005](../experiments/candidates/005-severity-ordered-containment.md),
  [Candidate 011](../experiments/candidates/011-dual-loop-operational-assurance.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-266

- **Statement:** Explicit identity and credential epoch, capability scope,
  revocation freshness, approval-domain independence, observation age,
  compromise assumptions, and clean-root evidence may improve graded assurance
  and dynamic authority envelopes.
- **Status:** speculative.
- **Primary source:** none sufficient; component guarantees are scoped in
  [C-250](#c-250)–[C-265](#c-265).
- **Rationale:** The security profile binds who may act, for how long, under
  which adversary and clean-recovery assumptions to the same versioned envelope.
- **Open issue:** It must beat short-lived IAM, PKI, HSM/KMS, sandboxing,
  service-mesh policy, threshold approval, monitoring, reimage, key rotation,
  and validation at equal complete budget.
- **Used by:** [Candidate 009](../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 012](../experiments/candidates/012-latency-qualified-authority.md),
  [security audit](audits/2026-08-05-security-cryptography.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](principle-registry.md#p-009--maintenance-plane),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-267

- **Statement:** Combining detection, diversity, thresholds, and recovery under
  biological-immunity or collective-intelligence language does not establish a
  novel security architecture.
- **Status:** disputed.
- **Primary source:** none; each component has the conventional nulls in
  [C-252](#c-252)–[C-265](#c-265).
- **Rationale:** Security novelty requires a specific adversary, trust boundary,
  guarantee, and equal-budget win rather than metaphorical recurrence.
- **Open issue:** A precise mechanism can still survive if it beats the best
  security baseline under adaptive attack.
- **Used by:** [security audit](audits/2026-08-05-security-cryptography.md),
  [principle registry](principle-registry.md).

### C-268

- **Statement:** Formal composition can systematically relate structured
  expressions to interpretations only under a declared grammar, lexicon, type
  discipline, and semantic interpretation.
- **Status:** established.
- **Primary sources:** `lambek1958mathematics`, `montague1970universal`.
- **Rationale:** Composition supplies a rule for building meanings from parts;
  it does not select the lexicon, context, referent, world state, or truth.
- **Open issue:** Learned composition must be compared with typed grammars and
  semantic parsers on held-out task denotation rather than proxy structure.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-269

- **Statement:** Explicit compositional structure can improve transmission to
  new learners in bounded emergent-language experiments even when it is not
  necessary for within-population generalization.
- **Status:** plausible.
- **Primary source:** `chaabouni2020compositionality`.
- **Rationale:** Learnability by a new receiver and success among co-adapted
  senders and receivers are different outcomes.
- **Open issue:** Replicate across tasks, architectures, heterogeneous agents,
  and equal-budget typed baselines.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md),
  [routing chapter](../concept/10-neurogenesis-and-routing.md).

### C-270

- **Statement:** Pragmatic interpretation is a defeasible inference over
  alternatives, priors, context, sender goals, and incentive assumptions rather
  than a typed guarantee, proof, or authority grant.
- **Status:** established.
- **Primary sources:** `grice1975logic`, `frank2012predicting`,
  `crawford1982strategic`.
- **Rationale:** The inferred intention can change with the listener's model
  even when the literal signal is unchanged.
- **Open issue:** Unknown or misaligned incentives can make recursive pragmatic
  confidence actively misleading.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md),
  [grounding chapter](../concept/20-sensorimotor-grounding.md).

### C-271

- **Statement:** Collaborative reference and lexical entrainment can be
  partner- and interaction-history-specific.
- **Status:** established.
- **Primary sources:** `clark1986referring`, `brennan1996conceptual`.
- **Rationale:** Repeated partners can converge on shorter local descriptions
  that are not automatically shared with newcomers or other groups.
- **Open issue:** Per-partner state may cost more than explicit identifiers and
  can preserve mistaken or exclusionary pacts.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [memory chapter](../concept/40-memory-and-consolidation.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md).

### C-272

- **Statement:** Human conversation contains organized practices for locating
  and repairing trouble, with broad cross-linguistic similarities in
  other-initiated repair within the audited samples.
- **Status:** established.
- **Primary sources:** `schegloff1977preference`,
  `dingemanse2015universal`.
- **Rationale:** Repair is a separately observable coordination process rather
  than proof that the first message was understood.
- **Open issue:** An AI transfer must beat schema errors, NACK/retry, targeted
  clarification, and ordinary exception handling under bounded latency.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment).

### C-273

- **Statement:** Evidence-backed acknowledgements and partner-scoped state may
  reduce false-common-ground commitments in multi-agent systems.
- **Status:** plausible.
- **Primary sources:** `clark1991grounding`, `clark1986referring`.
- **Rationale:** Delivery, parsing, sufficient understanding, acceptance, and
  task success are distinct states that may diverge under asymmetric context.
- **Open issue:** Test against an append-only replicated log with explicit
  acknowledgements and version vectors under packet loss and churn.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-274

- **Statement:** Human turn transition is locally coordinated and shows both
  cross-linguistic commonalities and variation; it does not establish one
  universal centralized scheduling algorithm.
- **Status:** established.
- **Primary sources:** `sacks1974simplest`, `stivers2009universals`.
- **Rationale:** Gaps, overlap, selection, self-selection, and timing depend on
  interactional and language-specific conditions.
- **Open issue:** Machine workloads require comparison with priority queues,
  leases, actors, cancellation, and deadline schedulers.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [sparse-compute chapter](../concept/30-sparse-predictive-compute.md),
  [P-011](principle-registry.md#p-011--transient-communication-coalitions).

### C-275

- **Statement:** Shannon capacity and rate-distortion limits are relative to a
  source, channel, code, and distortion model and do not themselves define
  truth, reference, intention, or task value.
- **Status:** established.
- **Primary sources:** `shannon1948mathematical1`,
  `shannon1948mathematical2`, `berger1971rate`.
- **Rationale:** A semantic or safety claim enters through a separately
  declared distortion, utility, grounding, and authority model.
- **Open issue:** End-to-end experiments must charge encoder, decoder,
  synchronization, repair, and protected-tail errors.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [energy chapter](../concept/80-energy-model.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md).

### C-276

- **Statement:** Context-sensitive brevity plausibly reflects a trade between
  production cost, predictability, and recoverability rather than a fixed law
  of optimal message length.
- **Status:** plausible.
- **Primary sources:** `ferrericancho2003least`, `piantadosi2011word`,
  `levy2008expectation`.
- **Rationale:** Short forms can externalize cost into priors, decoder state,
  ambiguity, clarification, and maintenance.
- **Open issue:** Causal transfer requires native-unit task distortion,
  protected-tail loss, total energy, and drift tests.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [energy chapter](../concept/80-energy-model.md),
  [P-001](principle-registry.md#p-001--selective-allocation).

### C-277

- **Statement:** Iterated learning can amplify learner biases and transmission
  bottlenecks; increased learnability does not imply increased task fitness.
- **Status:** established.
- **Primary sources:** `griffiths2007language`, `kirby2008cumulative`.
- **Rationale:** Repeated reconstruction selects what later learners can acquire,
  which can simplify or regularize a code while discarding useful distinctions.
- **Open issue:** Measure rare-meaning retention, cross-play, cumulative compute,
  and outcome utility in heterogeneous populations.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [memory chapter](../concept/40-memory-and-consolidation.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md).

### C-278

- **Statement:** Multi-agent task reward alone does not guarantee that an
  emergent communication code is interpretable, compositional, grounded,
  transferable, or safe.
- **Status:** established.
- **Primary sources:** `kottur2017natural`,
  `chaabouni2020compositionality`.
- **Rationale:** Co-adapted agents can exploit task-specific correlations and
  private encodings without recovering the properties named above.
- **Open issue:** Require direct denotation, cross-play, newcomer, grounding,
  incentive, and protected-meaning tests.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md),
  [system synthesis](../concept/70-system-synthesis.md).

### C-279

- **Statement:** Local convention adaptation can help under genuine requirement
  drift only if candidate forms remain mapped to explicit semantics and survive
  cross-play, compatibility, protected-meaning, and rollback gates.
- **Status:** plausible.
- **Primary sources:** `lewis1969convention`, `baronchelli2006sharp`,
  `centola2015spontaneous`.
- **Rationale:** Population convergence is a coordination outcome, while safe
  protocol evolution also needs semantic and lifecycle constraints.
- **Open issue:** Compare with schema registries and human-authored migration at
  equal communication, storage, compute, and maintenance cost.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-280

- **Statement:** A versioned, repairable convention layer may improve
  heterogeneous-agent adaptation while reducing total design and communication
  cost under vocabulary, task, and population drift.
- **Status:** speculative.
- **Primary source:** none sufficient; component mechanisms are scoped in
  [C-268](#c-268)–[C-279](#c-279).
- **Rationale:** The residual binds typed literal content, defeasible inference,
  uptake evidence, repair lineage, cross-play, compatibility, and rollback.
- **Open issue:** It must beat a complete typed protocol, schema registry,
  acknowledgement, calibrated inference, replicated state, and migration stack.
- **Used by:** [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md),
  [system synthesis](../concept/70-system-synthesis.md),
  [roadmap](../concept/90-research-roadmap.md).

### C-281

- **Statement:** Convergence, frequency, or communicative task success is not
  sufficient evidence that an emergent code is meaningful, truthful, grounded,
  inclusive, or safe.
- **Status:** disputed.
- **Primary sources:** `kottur2017natural`,
  `chaabouni2020compositionality`, `crawford1982strategic`.
- **Rationale:** Coordination can stabilize on brittle, private, deceptive, or
  exclusionary signals whose semantics fail outside the co-adapted population.
- **Open issue:** A specific code can still pass independent semantic,
  grounding, incentive, cross-play, safety, and lifecycle tests.
- **Used by:** [communication audit](audits/2026-08-05-linguistics-communication.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md),
  [principle registry](principle-registry.md).

### C-282

- **Statement:** Under a neutral finite diploid Wright–Fisher model, smaller
  effective population size accelerates expected heterozygosity loss.
- **Status:** established.
- **Primary source:** `Nei1975Bottleneck`.
- **Rationale:** A demographic bottleneck primarily changes drift and variation;
  it is not a generic consolidation or optimization operator.
- **Open issue:** Mutation, migration, selection, linkage, population structure,
  and other inheritance systems change the quantitative null.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [Candidate 016](../experiments/candidates/016-conflict-bounded-unit-transition.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-283

- **Statement:** One of ten selected *Chlamydomonas* populations in the cited
  experiment evolved an alternating multicellular/unicellular lifecycle by
  approximately 315 generations.
- **Status:** established.
- **Primary source:** `Ratcliff2013LifeCycle`.
- **Rationale:** The result demonstrates a scoped evolved reproductive cycle;
  the single-cell phase's observed fecundity advantage does not prove that
  conflict suppression caused its origin.
- **Open issue:** Preserve replicate count, selection regime, and historical
  explanation rather than generalizing one trajectory.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [Candidate 016](../experiments/candidates/016-conflict-bounded-unit-transition.md).

### C-284

- **Statement:** A narrow reproductive propagule can align higher-level
  heredity by increasing relatedness within a new unit, but it can also lose
  useful variation and create founder risk.
- **Status:** plausible.
- **Primary sources:** `Queller2000Relatedness`, `Michod2007Individuality`,
  `Ratcliff2013LifeCycle`.
- **Rationale:** Reproduction through few founders and demographic contraction
  are different operations with different selection consequences.
- **Open issue:** Test whether clean versioning and capability isolation provide
  the same engineered benefit without a lifecycle framing.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [Candidate 016](../experiments/candidates/016-conflict-bounded-unit-transition.md),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-285

- **Statement:** Reproductive resets may reduce inherited parasitic local state
  in continual artificial lineages beyond ordinary versioning and capability
  isolation.
- **Status:** speculative.
- **Primary source:** none sufficient; biological boundary conditions are in
  [C-282](#c-282)–[C-284](#c-284).
- **Rationale:** A declared child configuration can separate inherited state
  from within-lifetime specialization.
- **Open issue:** Founder failures, diversity loss, validation, and rare-role
  deletion may erase the gain.
- **Used by:** [Candidate 016](../experiments/candidates/016-conflict-bounded-unit-transition.md),
  [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md).

### C-286

- **Statement:** Survival through a mass extinction, taxonomic recovery,
  abundance recovery, ecological-function recovery, and later diversification
  need not coincide.
- **Status:** established.
- **Primary sources:** `Jablonski2002Survival`, `KirchnerWeil2000Recovery`,
  `Alroy2010Shifting`.
- **Rationale:** Recovery is vector-valued and path-dependent; richness alone
  can hide loss of function, abundance, geography, or interactions.
- **Open issue:** Fossil sampling and binning can change inferred timing and
  magnitude on every axis.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback),
  [research roadmap](../concept/90-research-roadmap.md).

### C-287

- **Statement:** A universal approximately ten-million-year post-extinction
  origination peak is not supported independently of estimator, time binning,
  taxonomic treatment, and sampling correction.
- **Status:** disputed.
- **Primary sources:** `KirchnerWeil2000Recovery`, `Alroy2008Dynamics`.
- **Rationale:** Sampling-standardized analyses can materially alter the
  apparent origination and extinction trajectory.
- **Open issue:** Any claimed delay needs interval uncertainty and alternative
  observation models rather than a fixed constant.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md).

### C-288

- **Statement:** Destructive population shocks have no general basis as an
  efficient training or optimization operator.
- **Status:** speculative.
- **Primary sources:** `RaupSepkoski1982Extinctions`,
  `Jablonski2002Survival`.
- **Rationale:** Extinction is a lossy path-dependent filter whose survivors and
  later radiations need not preserve capability or ecological function.
- **Open issue:** A bounded engineered deletion rule can still be tested, but it
  must beat reversible pruning and diversity-preserving selection.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-289

- **Statement:** Replicated island *Anolis* radiations show convergent ecomorph
  outcomes within a constrained system while retaining historical contingency.
- **Status:** established.
- **Primary source:** `Losos1998Radiations`.
- **Rationale:** Ecological opportunity and accessible variation can produce
  repeated structure without making evolution deterministic in general.
- **Open issue:** Engineered niche mechanisms must beat quality-diversity,
  population training, and routed-expert baselines.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-290

- **Statement:** Distinct ecological or task niches can protect useful
  specialization, but niche labels do not guarantee capability or independent
  failure modes.
- **Status:** plausible.
- **Primary source:** `Losos1998Radiations`.
- **Rationale:** Specialization is useful when it contributes distinct
  task-native outcomes rather than only occupying a descriptor bin.
- **Open issue:** Measure Pareto coverage, correlation, interface cost, and
  recovery at fixed evaluations and energy.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [routing chapter](../concept/10-neurogenesis-and-routing.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-291

- **Statement:** Mitochondria have bacterial ancestry and organelle DNA can
  transfer to a host nucleus, establishing acquisition and later integration
  without identifying one exact universal origin sequence.
- **Status:** established.
- **Primary sources:** `Sagan1967Mitosing`, `Andersson1998Rickettsia`,
  `Stegemann2003GeneTransfer`.
- **Rationale:** Persistent integration involves inheritance, interfaces, state
  transfer, and dependency beyond temporary cooperation.
- **Open issue:** Competing origin models and later transfers constrain the
  historical detail; reversible plugins are a strong engineering null.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-292

- **Statement:** Staged capability integration may reduce duplicated compute or
  state while preserving replacement and rollback better than conventional
  composition.
- **Status:** speculative.
- **Primary source:** none sufficient; evolutionary integration is scoped in
  [C-291](#c-291).
- **Rationale:** Acquisition, stable inheritance, interface transfer, and
  dependency consolidation are separate lifecycle stages.
- **Open issue:** It must beat clean APIs, retrieval services, distillation,
  model merging, and ordinary dependency management at equal cost.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [system synthesis](../concept/70-system-synthesis.md).

### C-293

- **Statement:** Strong settling selection produced simple clonal
  multicellular yeast phenotypes and propagule-associated apoptosis in the
  cited laboratory system.
- **Status:** established.
- **Primary source:** `Ratcliff2012Multicellularity`.
- **Rationale:** The experiment demonstrates a scoped transition in selectable
  collective traits, not a universal path to complexity or division of labor.
- **Open issue:** Selection regime, organism, timescale, and replicate behavior
  bound the transfer.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [Candidate 016](../experiments/candidates/016-conflict-bounded-unit-transition.md).

### C-294

- **Statement:** Higher-level evolutionary individuality requires heritable
  variation in collective performance plus sufficient control of lower-level
  conflict for selection at that level to persist.
- **Status:** plausible.
- **Primary sources:** `Price1970Selection`, `Frank1995Policing`,
  `Queller2000Relatedness`, `Michod2007Individuality`,
  `SzathmaryMaynardSmith1995Transitions`.
- **Rationale:** Cooperation or aggregation alone does not define a reproduced
  selection unit; within- and between-unit selection can oppose one another.
- **Open issue:** There is no single universal relatedness or policing threshold,
  and engineered descendant relations must be operationally defined.
- **Used by:** [Candidate 016](../experiments/candidates/016-conflict-bounded-unit-transition.md),
  [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-295

- **Statement:** Costed policing may improve higher-level artificial collective
  performance when member-level shortcuts are individually rewarded.
- **Status:** speculative.
- **Primary source:** `Frank1995Policing`.
- **Rationale:** Conflict control can change the balance between within- and
  between-collective selection.
- **Open issue:** Permissions, unit tests, external evaluation, quotas, and
  ordinary auditing may match the benefit with fewer false sanctions.
- **Used by:** [Candidate 016](../experiments/candidates/016-conflict-bounded-unit-transition.md),
  [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md).

### C-296

- **Statement:** Exaptation distinguishes the historical origin of a trait from
  its current useful role.
- **Status:** established.
- **Primary sources:** `GouldVrba1982Exaptation`, `Blount2012Citrate`.
- **Rationale:** Present utility does not show that a component originated by
  selection or design for that role.
- **Open issue:** Post-hoc naming has no predictive value without a search
  denominator and independent validation.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [endogenous-generation audit](audits/2026-08-05-endogenous-generation-creativity.md),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-297

- **Statement:** Provenance-aware component search may lower the cost of finding
  valid cross-task reuse when failed searches and retesting are included.
- **Status:** plausible.
- **Primary source:** `Blount2012Citrate`.
- **Rationale:** Searchable origin, dependency, behavior, and validation records
  can expose co-option candidates without claiming they were designed for the
  new role.
- **Open issue:** It must beat semantic retrieval, transfer learning, model
  merging, and architecture search on search-plus-validation joules.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-298

- **Statement:** Absence from an observed or theoretical morphospace does not
  alone identify developmental infeasibility.
- **Status:** established.
- **Primary sources:** `MaynardSmith1985Constraints`, `Raup1966Morphospace`.
- **Rationale:** Selection, function, history, sampling, and generative
  constraints can all leave regions empty.
- **Open issue:** Search systems need explicit excluded-region probes and escape
  operators rather than treating absence as impossibility.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [routing chapter](../concept/10-neurogenesis-and-routing.md).

### C-299

- **Statement:** Generative constraints can improve valid-search yield while
  risking permanent exclusion of recoverable optima.
- **Status:** plausible.
- **Primary sources:** `MaynardSmith1985Constraints`, `Raup1966Morphospace`.
- **Rationale:** Structured proposal spaces can avoid invalid configurations,
  but their bias is part of the algorithm and lifecycle cost.
- **Open issue:** Compare typed spaces, learned proposal distributions,
  regularization, and unconstrained search with explicit escape mutations.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [Candidate 004](../experiments/candidates/004-closed-endogenous-curriculum.md),
  [routing chapter](../concept/10-neurogenesis-and-routing.md).

### C-300

- **Statement:** Fossil ranges and inferred rates depend on preservation, rock
  availability, collection, taxonomy, time binning, and estimator choice.
- **Status:** established.
- **Primary sources:** `FooteRaup1996Preservation`, `Marshall1994Ranges`,
  `PetersFoote2002Extinction`, `Alroy2008Dynamics`.
- **Rationale:** Observed first and last occurrences are products of a changing
  observation process rather than exact latent origination/extinction times.
- **Open issue:** No correction recovers information never preserved; coverage
  remains conditional on the observation model.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md).

### C-301

- **Statement:** Retrospective fossil dynamics do not by themselves validate
  prospective early-warning signals for artificial systems.
- **Status:** disputed.
- **Primary sources:** `FooteRaup1996Preservation`, `Marshall1994Ranges`,
  `PetersFoote2002Extinction`.
- **Rationale:** Sparse preservation, time averaging, changing observation
  kernels, range truncation, and abrupt transitions can destroy identifiable
  prospective lead time.
- **Open issue:** Candidate 003 must test prospective timestamps, kernel
  misspecification, transition class, lead-time distribution, and abstention.
- **Used by:** [paleobiology audit](audits/2026-08-05-paleobiology-major-transitions.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md).

### C-302

- **Statement:** Tumors can undergo clonal evolution through heritable somatic
  variation and differential expansion.
- **Status:** established.
- **Primary source:** `nowell1976clonal`.
- **Rationale:** Local replicative success can oppose organism-level function;
  internal adaptation is not automatically system alignment.
- **Open issue:** The founding synthesis is not one universal tumor dynamical
  law and does not license unconstrained artificial variation.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [Candidate 016](../experiments/candidates/016-conflict-bounded-unit-transition.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-303

- **Statement:** Spatially separated samples from one tumor can contain branched
  subclones that a single biopsy misses.
- **Status:** established.
- **Primary source:** `gerlinger2012intratumor`.
- **Rationale:** Aggregate or local response can leave consequential hidden
  heterogeneous state unidentified.
- **Open issue:** Cancer type, sample placement, assay sensitivity, and time
  constrain the recovered lineage history.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-304

- **Statement:** Relapse can derive from a founding clone or a subclone already
  present at diagnosis.
- **Status:** established.
- **Primary source:** `ding2012clonal`.
- **Rationale:** Initial response does not establish eradication; recurrence
  needs lineage, detection-limit, and follow-up evidence.
- **Open issue:** Residual state, reseeding, observation limits, and new
  emergence remain distinct recurrence explanations.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [Candidate 005](../experiments/candidates/005-severity-ordered-containment.md),
  [Candidate 011](../experiments/candidates/011-dual-loop-operational-assurance.md).

### C-305

- **Statement:** Treatment can shape the mutational and clonal state observed at
  recurrence in scoped cancers and treatment regimes.
- **Status:** established.
- **Primary source:** `johnson2014mutational`.
- **Rationale:** An intervention changes both immediate burden and subsequent
  selection pressure.
- **Open issue:** Associations are treatment-, subgroup-, and observation-
  process-specific rather than a deterministic recurrence rule.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [Candidate 007](../experiments/candidates/007-endogenous-observation-surveillance.md).

### C-306

- **Statement:** Evolution-informed combinations or adaptive schedules can
  delay resistance only under declared mutation, cross-resistance, competition,
  observation, and safety assumptions.
- **Status:** plausible.
- **Primary sources:** `bozic2013evolutionary`, `zhang2017integrating`,
  `zhang2022evolution`.
- **Rationale:** Preserving a sensitive competitor or combining interventions
  can change resistance dynamics, but small nonrandomized clinical studies do
  not establish a general policy.
- **Open issue:** Compare with standard partially observed and model-predictive
  control under equal data and intervention budgets.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [P-006](principle-registry.md#p-006--homeostatic-negative-feedback).

### C-307

- **Statement:** Adaptive abiraterone dosing may extend response while reducing
  drug exposure in selected metastatic prostate-cancer patients.
- **Status:** plausible.
- **Primary sources:** `zhang2017integrating`, `zhang2022evolution`.
- **Rationale:** The audited pilot and contemporaneous comparison reported
  favorable scoped outcomes with intermittent treatment.
- **Open issue:** Small nonrandomized cohorts require randomized confirmation,
  broader safety evidence, and validation of the competition model.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md).

### C-308

- **Statement:** Central tolerance can delete developing self-reactive T cells
  in defined mouse models.
- **Status:** established.
- **Primary source:** `kappler1987tcell`.
- **Rationale:** Deletion is one tolerance operation rather than a universal
  self/non-self classifier.
- **Open issue:** False deletion, incomplete antigen representation, and
  peripheral context require separate controls.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-309

- **Statement:** Self-reactive B cells can persist in a functionally silenced
  state in a defined transgenic mouse model.
- **Status:** established.
- **Primary source:** `goodnow1988altered`.
- **Rationale:** Silencing and deletion are different state transitions with
  different reversibility and failure modes.
- **Open issue:** The model does not establish one universal outcome for all
  self-reactive cells or artificial anomaly states.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [P-003](principle-registry.md#p-003--temporary-trace-before-commitment).

### C-310

- **Statement:** Aire broadens thymic representation of tissue-associated
  antigens and contributes to central tolerance in the studied system.
- **Status:** established.
- **Primary source:** `anderson2002aire`.
- **Rationale:** A detector can act only on represented evidence; observation
  coverage and action policy remain separate.
- **Open issue:** Representation is incomplete and does not by itself choose a
  safe response.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [P-007](principle-registry.md#p-007--prediction-error-allocation).

### C-311

- **Statement:** Peripheral regulatory T-cell mechanisms contribute to
  self-tolerance in model systems.
- **Status:** established.
- **Primary sources:** `sakaguchi1995tolerance`, `hori2003foxp3`.
- **Rationale:** Tolerance uses layered representation, deletion, silencing,
  regulation, and context rather than one threshold.
- **Open issue:** Layered control can normalize slow compromise or suppress
  legitimate novelty and must beat calibrated abstention and cost-sensitive
  action baselines.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation).

### C-312

- **Statement:** Tested autoantibodies can precede clinical systemic lupus
  erythematosus by years among people who later receive the diagnosis.
- **Status:** established.
- **Primary source:** `arbuckle2003autoantibodies`.
- **Rationale:** A marker can precede threshold crossing without becoming a
  diagnosis or proof that preemptive intervention helps.
- **Open issue:** Eventual-case sampling, prevalence, sampling cadence, positive
  predictive value, and intervention harm bound transfer.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md).

### C-313

- **Statement:** Alpha-synuclein is a component of Lewy-body pathology.
- **Status:** established.
- **Primary source:** `spillantini1997alpha`.
- **Rationale:** Membership in an observed aggregate does not identify the toxic
  species, causal direction, or useful intervention target.
- **Open issue:** Aggregate burden, soluble species, sequestration, clearance,
  and function need separate perturbation evidence.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-314

- **Statement:** Proteostasis capacity and stress responses can be experimentally
  altered in scoped worm, fly, and mouse models.
- **Status:** established.
- **Primary sources:** `vilchez2012rpn6`, `labbadia2015heatshock`,
  `ravikumar2004autophagy`.
- **Rationale:** Failure depends on production, conversion, sequestration,
  clearance, and maintenance capacity rather than aggregate quantity alone.
- **Open issue:** Human efficacy and a universal artificial maintenance rule are
  unsupported.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [Candidate 005](../experiments/candidates/005-severity-ordered-containment.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-315

- **Statement:** Tau or alpha-synuclein pathology can be experimentally seeded
  and propagated in susceptible mouse brains.
- **Status:** established.
- **Primary sources:** `clavaguera2009tauopathy`, `luk2012synuclein`.
- **Rationale:** Local failure products can spread through susceptible
  compartments under scoped biological conditions.
- **Open issue:** Route, species, susceptibility, human disease, and generic
  distributed-system transfer remain limited.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [Candidate 005](../experiments/candidates/005-severity-ordered-containment.md),
  [P-008](principle-registry.md#p-008--compartmentalized-interaction).

### C-316

- **Statement:** Similar post-stroke task success can coexist with different
  movement strategies and reliance on compensation.
- **Status:** established.
- **Primary sources:** `levin2009recovery`, `cirstea2000compensatory`.
- **Rationale:** Endpoint performance underidentifies native capability,
  compensating strategy, and environmental support.
- **Open issue:** The reference mechanism and native-path distance require
  task-specific justification rather than historical preference.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [Candidate 005](../experiments/candidates/005-severity-ordered-containment.md),
  [hardening chapter](../concept/60-hardening-and-factual-memory.md).

### C-317

- **Statement:** Some gains after constraint-induced movement therapy can be
  mediated by task-specific compensation rather than normalized motor control.
- **Status:** plausible.
- **Primary sources:** `kitago2013cimt`, `michaelsen2006trunk`.
- **Rationale:** A successful task score does not show which control strategy
  changed.
- **Open issue:** Small scoped kinematic studies do not characterize every
  patient, task, or outcome.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [hardening chapter](../concept/60-hardening-and-factual-memory.md).

### C-318

- **Statement:** Constraint-induced movement therapy can improve selected
  upper-extremity outcomes in an eligible post-stroke population.
- **Status:** established.
- **Primary source:** `wolf2006excite`.
- **Rationale:** The trial establishes a treatment-bundle effect within its
  selection and protocol, not one isolated learned-nonuse mechanism.
- **Open issue:** Restraint, shaped practice, transfer procedures, eligibility,
  adherence, and later compensation bound generality.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [routing chapter](../concept/10-neurogenesis-and-routing.md).

### C-319

- **Statement:** Skilled use and rehabilitative training can change motor
  representations in adult nonhuman primates.
- **Status:** established.
- **Primary sources:** `nudo1996usedependent`,
  `nudo1996rehabilitative`.
- **Rationale:** Use allocation can reshape measured representation, but map
  change is not inherently beneficial or equivalent to stored skill.
- **Open issue:** Bounded forced use must beat load balancing, exploration,
  rehearsal, and dropout without damaging healthy capability.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology),
  [routing chapter](../concept/10-neurogenesis-and-routing.md).

### C-320

- **Statement:** Rehabilitation outcomes can depend jointly on intervention
  timing, amount, content, and baseline state; dose is a schedule rather than
  one scalar.
- **Status:** established.
- **Primary sources:** `avert2015mobilisation`, `winstein2016icare`,
  `dromerick2021cpass`.
- **Rationale:** Active-control trials show that theory-rich content, more time,
  or earlier treatment do not supply a monotonic universal benefit.
- **Open issue:** Artificial recovery schedules must demonstrate replicating
  state-by-timing or state-by-dose interactions beyond tuned ordinary schedules.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [memory chapter](../concept/40-memory-and-consolidation.md),
  [roadmap](../concept/90-research-roadmap.md).

### C-321

- **Statement:** A more intensive very-early mobilization bundle reduced the
  odds of a favorable three-month outcome versus usual care in the AVERT trial.
- **Status:** established.
- **Primary source:** `avert2015mobilisation`.
- **Rationale:** The result directly rejects the unrestricted rule that earlier
  and more rehabilitation is always better.
- **Open issue:** The bundle changed timing, frequency, and amount, so the
  harmful component is not isolated.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [roadmap](../concept/90-research-roadmap.md).

### C-322

- **Statement:** Reserve can preserve observed function while underlying damage
  or pathology accumulates.
- **Status:** plausible.
- **Primary sources:** `katzman1988dementia`, `stern2002reserve`.
- **Rationale:** Service output and remaining disturbance margin are different
  state variables.
- **Open issue:** Reserve proxies are entangled with selection and measurement;
  engineering reserve must be operationalized under declared perturbations.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md),
  [Candidate 011](../experiments/candidates/011-dual-loop-operational-assurance.md).

### C-323

- **Statement:** Use-dependent plastic change can accompany or cause adverse
  outcomes in narrow human and animal settings.
- **Status:** established.
- **Primary sources:** `flor1995phantom`, `byl1996dystonia`,
  `kozlowski1996injury`.
- **Rationale:** Plasticity carries no sign; repetitive or early forced use can
  stabilize pain, dedifferentiation, impaired control, or additional injury.
- **Open issue:** Human correlation, primate overuse, and rodent lesion evidence
  have different causal scope and cannot be collapsed into one effect size.
- **Used by:** [pathology audit](audits/2026-08-05-pathology-rehabilitation.md),
  [maturity chapter](../concept/50-grokking-and-pruning.md),
  [P-005](principle-registry.md#p-005--use-dependent-topology).

### C-324

- **Statement:** Compensation-aware recovery accounting may select more robust
  recovered artificial systems than endpoint task-score evaluation alone.
- **Status:** speculative.
- **Primary source:** none sufficient; the restoration/compensation boundary is
  scoped in [C-316](#c-316)–[C-323](#c-323).
- **Rationale:** The method separately reports native-path distance,
  compensating resource burden, dependency removal, transfer, recurrence,
  reserve, and adverse effects.
- **Open issue:** Reject it as redundant if ordinary multi-objective robustness
  and fault-injection accounting predict the same failures with lower overhead.
- **Used by:** [Candidate 005](../experiments/candidates/005-severity-ordered-containment.md),
  [hardening chapter](../concept/60-hardening-and-factual-memory.md),
  [pathology audit](audits/2026-08-05-pathology-rehabilitation.md).

### C-325

- **Statement:** Atomicity, isolation, and durability are distinct storage
  contracts and none establishes factual truth or specification adequacy.
- **Status:** established.
- **Primary sources:** `gray1981transaction`, `mohan1992aries`.
- **Rationale:** Each property constrains effects, concurrency, or persistence
  only inside a declared system and failure boundary.
- **Open issue:** External actions and application invariants require separate
  coordination and evidence.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 009](../experiments/candidates/009-graded-assurance-envelopes.md),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-326

- **Statement:** Write-ahead-log recovery depends on ordering and a trustworthy
  stable-storage boundary.
- **Status:** established.
- **Primary source:** `mohan1992aries`.
- **Rationale:** Acknowledged recovery guarantees stop when log/page ordering,
  stable media, checksums, or implementation assumptions fail.
- **Open issue:** Physical side effects outside the transaction are not made
  reversible by the log.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 009](../experiments/candidates/009-graded-assurance-envelopes.md).

### C-327

- **Statement:** Snapshot isolation can admit histories that are not
  serializable.
- **Status:** established.
- **Primary sources:** `berenson1995isolation`, `bernstein1983mvcc`.
- **Rationale:** Versioned snapshots and write-conflict rules can still permit
  write skew and other application anomalies.
- **Open issue:** Every implementation must name and test its exact isolation
  contract rather than inherit a label by analogy.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-328

- **Statement:** Linearizability and serializability are different correctness
  conditions; only the former necessarily preserves real-time order for the
  declared object operations.
- **Status:** established.
- **Primary source:** `herlihy1990linearizability`.
- **Rationale:** Concurrent-object operations and multi-operation transaction
  histories have different scopes and admissible orders.
- **Open issue:** The two can coincide for a restricted API but must not be
  treated as synonyms generally.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 015](../experiments/candidates/015-versioned-repairable-conventions.md).

### C-329

- **Statement:** CAP is a scoped impossibility result about availability and
  atomic consistency during partitions, not a three-feature product taxonomy.
- **Status:** established.
- **Primary source:** `gilbert2002cap`.
- **Rationale:** The theorem's definitions of partition, availability, and
  consistency determine its conclusion.
- **Open issue:** Partial synchrony, bounded staleness, transaction scope, and
  normal-operation trade-offs require other models.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [P-002](principle-registry.md#p-002--local-autonomy-with-exception-escalation).

### C-330

- **Statement:** Simple quorum overlap guarantees depend on fixed membership,
  weights, protocol version, failure, and concurrency assumptions.
- **Status:** established.
- **Primary source:** `gifford1979weighted`.
- **Rationale:** Arithmetic overlap alone does not solve arbitrary concurrency,
  Byzantine behavior, changing membership, or common-mode failures.
- **Open issue:** Identity and administrative independence must be measured, not
  inferred from logical replica count.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 012](../experiments/candidates/012-latency-qualified-authority.md).

### C-331

- **Statement:** Replication and erasure coding preserve exact state under
  declared faults without supplying semantic diversity, truth, or new function.
- **Status:** established.
- **Primary sources:** `reed1960codes`, `dimakis2010regenerating`,
  `huang2012azure`, `lamport1998paxos`, `ongaro2014raft`.
- **Rationale:** Copies, code symbols, or an agreed log can reproduce a shared
  semantic error exactly.
- **Open issue:** Common software, credentials, commands, and recovery roots can
  correlate nominal failure domains.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [fault-tolerance audit](audits/2026-08-05-fault-tolerance-and-reconstruction.md),
  [P-004](principle-registry.md#p-004--diversity-selection-and-protection).

### C-332

- **Statement:** An exact learned index requires a correction or fallback path
  outside the predictor.
- **Status:** established.
- **Primary sources:** `bayer1972btree`, `kraska2018learnedindexes`.
- **Rationale:** A learned model predicts a location or range; exact lookup
  still verifies and corrects prediction error.
- **Open issue:** Distribution shift, updates, rebuild cost, correction window,
  and tail latency determine the lifecycle advantage.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [P-001](principle-registry.md#p-001--selective-allocation),
  [P-010](principle-registry.md#p-010--structural-offloading-and-co-design).

### C-333

- **Statement:** Adaptive recency/frequency cache policies are mature nulls for
  use-dependent memory allocation.
- **Status:** established.
- **Primary sources:** `belady1966replacement`, `denning1968workingset`,
  `megiddo2003arc`, `einziger2017tinylfu`.
- **Rationale:** Cache admission and eviction already adapt to trace structure;
  biological terminology is not an algorithmic distinction.
- **Open issue:** AI-specific value must improve task/evidence outcomes beyond
  size-, miss-cost-, and shift-aware caching without future leakage.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 018](../experiments/candidates/018-value-reconstructability-aware-tiering.md),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-334

- **Statement:** LSM compaction trades read, write, space, maintenance debt, and
  tail-latency behavior rather than removing cost.
- **Status:** established.
- **Primary sources:** `oneil1996lsm`, `dayan2018dostoevsky`,
  `balmau2019silk`.
- **Rationale:** Logical write throughput can externalize work into background
  merging, amplification, stalls, and device wear.
- **Open issue:** Workload, media, configuration, scheduler, and foreground
  interference determine the frontier.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 017](../experiments/candidates/017-contract-preserving-semantic-compaction.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-335

- **Statement:** Garbage and version reclamation is correct only relative to
  declared reachability, visibility, roots, snapshots, and retention horizons.
- **Status:** established.
- **Primary sources:** `dijkstra1978garbage`, `postgresql2025vacuum`.
- **Rationale:** Age, coldness, or current unreachability does not establish
  epistemic unimportance or future irrelevance.
- **Open issue:** Long readers, legal holds, rollback, source invalidation, and
  rare future safety queries change the live set.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [memory chapter](../concept/40-memory-and-consolidation.md),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

### C-336

- **Statement:** Event replay reproduces intended state only when ordering,
  event schemas, handlers, configuration, nondeterministic inputs, and external
  effects remain controlled and version-compatible.
- **Status:** plausible.
- **Primary sources:** `fowler2005eventsourcing`, `mohan1992aries`.
- **Rationale:** Re-executing bytes through changed semantics can silently
  create a different state or duplicate irreversible effects.
- **Open issue:** Prospective replay experiments should quantify semantic drift,
  upcaster burden, external receipts, and recovery time.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 011](../experiments/candidates/011-dual-loop-operational-assurance.md),
  [P-013](principle-registry.md#p-013--externalized-shared-state).

### C-337

- **Statement:** Valid time and system/transaction time answer different
  questions and cannot generally be reduced to one timestamp without lost
  information.
- **Status:** established.
- **Primary sources:** `snodgrass1985time`, `kulkarni2012sqltemporal`.
- **Rationale:** When a proposition is asserted to hold in the world and when a
  database stored or believed it are separate coordinates.
- **Open issue:** Event, processing, receipt, and correction clocks may add more
  coordinates in observation pipelines.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
  [factual-memory chapter](../concept/60-hardening-and-factual-memory.md).

### C-338

- **Statement:** Storage-tier break-even thresholds depend on workload,
  hardware, energy, and economic assumptions rather than one durable constant.
- **Status:** established.
- **Primary source:** `gray1987fiveminute`.
- **Rationale:** Access rate, capacity price, transfer cost, latency, energy,
  endurance, and failure risk move the placement frontier.
- **Open issue:** Every quantitative tiering result must expose current hardware
  and cost configuration.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 018](../experiments/candidates/018-value-reconstructability-aware-tiering.md).

### C-339

- **Statement:** Semantic and evidence value may improve AI artifact placement
  beyond access probability, size, and miss cost when decided without future
  leakage.
- **Status:** plausible.
- **Primary source:** none sufficient; established cache and storage nulls are
  scoped in [C-333](#c-333) and [C-338](#c-338).
- **Rationale:** A rare cold record can be required for audit, rollback,
  invalidation, or reconstruction despite low expected access.
- **Open issue:** Strong engineered feature vectors may match the result and
  metadata/migration cost may erase the saving.
- **Used by:** [Candidate 018](../experiments/candidates/018-value-reconstructability-aware-tiering.md),
  [storage audit](audits/2026-08-05-databases-storage.md),
  [P-001](principle-registry.md#p-001--selective-allocation).

### C-340

- **Statement:** A compactor may shrink histories while preserving registered
  query, evidence, rollback, uncertainty, and invalidation contracts better than
  ordinary views, snapshots, and archives.
- **Status:** speculative.
- **Primary source:** none sufficient; physical compaction boundaries are in
  [C-334](#c-334)–[C-337](#c-337).
- **Rationale:** The residual is preservation of a finite declared semantic
  contract, not arbitrary future meaning.
- **Open issue:** It must survive hidden future queries and include metadata,
  retained fragments, compaction work, failure, and audit reconstruction cost.
- **Used by:** [Candidate 017](../experiments/candidates/017-contract-preserving-semantic-compaction.md),
  [storage audit](audits/2026-08-05-databases-storage.md),
  [P-009](principle-registry.md#p-009--maintenance-plane).

### C-341

- **Statement:** Physical compaction is not equivalent to biological memory
  consolidation or semantic summarization.
- **Status:** disputed.
- **Primary sources:** `oneil1996lsm`, `dayan2018dostoevsky`.
- **Rationale:** Conventional compaction preserves a declared logical storage
  view while changing physical representation; it does not preserve arbitrary
  evidence or future answers.
- **Open issue:** A semantic compactor can earn a distinct label only by passing
  registered preservation, hidden-query, and invalidation tests.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 017](../experiments/candidates/017-contract-preserving-semantic-compaction.md),
  [memory chapter](../concept/40-memory-and-consolidation.md).

### C-342

- **Statement:** Cold, old, or currently unreachable information is not thereby
  unimportant, false, or safe to forget.
- **Status:** disputed.
- **Primary sources:** `dijkstra1978garbage`, `postgresql2025vacuum`.
- **Rationale:** Reachability and access frequency are policy-relative storage
  states rather than future task or evidence value.
- **Open issue:** Rare safety, legal, provenance, rollback, and recurrence needs
  must enter retention tests without making deletion impossible.
- **Used by:** [storage audit](audits/2026-08-05-databases-storage.md),
  [Candidate 017](../experiments/candidates/017-contract-preserving-semantic-compaction.md),
  [Candidate 018](../experiments/candidates/018-value-reconstructability-aware-tiering.md),
  [P-012](principle-registry.md#p-012--memory-matched-to-information-lifetime).

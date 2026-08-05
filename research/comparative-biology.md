# Comparative biology opportunity map

Brains are one solution to adaptive control. This map looks for principles that
become invisible when “biologically inspired AI” means “copy a mammalian
cortex.” The candidates below are abstractions to test, not claims that an
organism secretly implements a modern AI algorithm.

## Cephalopod arms: peripheral autonomy with sparse central override

**Observed system.** Octopus arms contain a large distributed nervous system,
and their axial nerve cords have a segmented organization aligned with local
arm structure ([C-024](claims.md#c-024)). Earlier motor-control experiments also
show that arm movements can be simplified into locally controlled stereotyped
patterns rather than centrally specifying every degree of freedom.

**Transferable principle.** Put fast control next to the sensors and actuators.
The center should send goals, constraints, and exception signals rather than a
complete low-level trajectory.

**Candidate architecture.** Each sensorimotor segment owns a small predictive
controller and local memory. It handles familiar events autonomously and sends
only novelty, conflict, risk, or unresolved uncertainty to a global model. The
global model can override and can update local policies during consolidation.

**First experiment.** A soft-body or high-degree-of-freedom simulator with
local policies versus one monolithic controller. Match observations and total
capacity; measure communication, recovery from a damaged segment, task quality,
latency, and energy.

**Risk.** Local controllers develop incompatible objectives or hide state that
the global safety layer needed.

## Insect mushroom body: expand, sparsify, then associate

**Observed system.** In Drosophila, diverse olfactory channels converge onto
Kenyon cells, and feedback inhibition maintains sparse, decorrelated odor
representations that support discrimination of similar odors
([C-025](claims.md#c-025)).

**Transferable principle.** A large, diverse intermediate code can make similar
inputs separable, while global inhibition keeps only a small subset active.
Learning can then concentrate on associations at the sparse output rather than
rewriting the entire feature extractor.

**Candidate architecture.** Stable or slowly changing random/diverse feature
expansion, adaptive sparsification, and a fast associative memory. Existing
random-feature and sparse-memory methods mean the components are not novel; the
research question is whether their biological combination helps continual
few-shot learning under an energy budget.

**First experiment.** Similarity-controlled few-shot classes arriving
sequentially. Compare dense learned features, random expansion alone, and
expansion plus feedback sparsification. Measure collision rate, memory capacity,
retention, active state, and update energy.

**Risk.** Expansion inflates memory movement and merely moves the cost before
the sparse bottleneck.

## Plants: reversible stress priming without a central controller

**Observed system.** Repeated dehydration in Arabidopsis changes the later
transcriptional response of a subset of genes while expression can return near
baseline during recovery ([C-026](claims.md#c-026)). This is a specific form of
stress memory, not evidence for general plant cognition.

**Transferable principle.** Preserve a cheap latent “preparedness” state after
an event so that recurrence changes response speed or gain, without permanently
committing the whole system.

**Candidate architecture.** Event-triggered, decaying context marks adjust
router thresholds, learning rates, cache residency, or protective policies.
Marks are local, versioned, and reversible. Consolidation promotes only
repeatedly useful changes into slow structure.

**First experiment.** A non-stationary stream with recurring hazards separated
by long quiet intervals. Compare no memory, permanent fine-tuning, recurrent
state, and explicit decaying priming marks. Measure response time, false alarms,
retention, and update energy.

**Risk.** Priming turns into persistent bias, overreaction, or an attacker-
controlled trigger.

## Slime mold: reinforce useful flow and let unused topology decay

**Observed system.** Experiments and a mathematical model of *Physarum*
transport networks show that local flow-sensitive adaptation can produce
efficient, fault-tolerant network structures ([C-027](claims.md#c-027)).

**Transferable principle.** Topology can be an online state: reinforce routes
that carry useful flow, decay routes that do not, and retain redundancy where
it protects against disruption.

**Candidate architecture.** Expert-to-expert links have capacities $d_e$ that
adapt from measured useful traffic $\phi_e$:

$$
d_{e,t+1} = (1-\rho)d_{e,t} + \alpha g(\phi_{e,t}),
$$

where $\rho$ is the decay rate, $\alpha$ is adaptation strength, and $g$ maps
useful flow to reinforcement. A minimum exploration reserve prevents premature
disconnection.

**First experiment.** A modular model facing changing task clusters and link
failures. Compare fixed all-to-all, learned static sparse, and adaptive-flow
topologies. Include reconfiguration cost and test whether the topology recovers
after a distribution returns.

**Risk.** Popular routes become self-reinforcing monopolies; rare but critical
paths disappear.

## Adaptive immunity: diversify, select, expand, then protect

**Observed system.** Germinal-center B cells combine somatic variation,
affinity-dependent selection, clonal expansion, and lineage preservation.
Recent mouse experiments indicate that high-affinity lineages can divide more
while reducing mutation per division ([C-028](claims.md#c-028)).

**Transferable principle.** Exploration pressure should depend on maturity:
diversify uncertain candidates, allocate resources to candidates that match a
local test, and reduce mutation after a high-quality solution emerges.

**Candidate architecture.** For a novel regime, spawn small adapter or expert
variants rather than mutating the stable model. Evaluate them in a bounded
sandbox, expand useful variants, merge only validated invariants, and preserve
proven lineages with a lower mutation rate.

**First experiment.** Continual tasks containing both genuinely new regimes and
recurrences. Compare fixed adapters, population-based training, and adaptive
clone/selection/contraction under the same parameter-generation budget.

**Risk.** Resource explosion, selection on a bad proxy, loss of diversity, or
an autoimmune analogue in which internal novelty detectors attack useful
modules.

## Morphology and development: co-design the problem and its controller

**Observed system.** Work on evolving simulated embodied agents found that
development can expose body plans robust to controller changes and guide later
evolution ([C-029](claims.md#c-029)). The evidence is from artificial embodied
agents; it supports an engineering principle, not a universal law of organisms.

**Transferable principle.** Do not assume the controller is the only learnable
object. Sensor placement, body compliance, memory layout, module boundaries,
and interconnect topology can transform the problem seen by the learner.

**Candidate architecture.** Alternate controller learning with slow structural
search. Prefer structural changes that make a family of controllers robust,
not a body or topology overfit to one frozen policy.

**First experiment.** Jointly search sensor layout and controller on a physical
or simulated task, then replace or perturb the controller and environment.
Compare against controller-only search and charge fabrication/reconfiguration
cost to lifecycle energy.

**Risk.** Co-design makes experiments irreproducible, expands the search space,
or locks a transient behavior into expensive hardware.

## Social insects: shared environmental memory and reserve capacity

**Observed system.** Pharaoh's ants can recover direction from the geometry of
trail bifurcations ([C-031](claims.md#c-031)). In a separate two-route experiment,
crowding caused ants to establish another route before food-return throughput
fell, with inhibitory interactions contributing to the modeled transition
([C-035](claims.md#c-035)).

**Transferable principle.** Coordination state can live in the shared
environment, and local congestion can recruit reserve capacity without a
central scheduler.

**Candidate architecture.** Modules write small, decaying records to a shared
workspace: route pressure, partial results, uncertainties, or requests. Other
modules discover work by reading the workspace. Congestion opens an alternate
route before a latency limit is violated.

**First experiment.** Compare pairwise module messages, a central queue, and a
decaying shared workspace on a bursty multi-agent task. Measure message count,
queue tails, stale-state errors, recovery after a route failure, and energy.

**Risk.** Positive feedback creates herding, poisoned shared state spreads, or
anonymous writes destroy provenance.

## Bacteria: risk spreading when prediction is impossible

**Observed system.** In an experimental fluctuating environment, some
*Pseudomonas fluorescens* populations evolved rapid stochastic switching among
phenotypes, allowing their lineage to persist as favored states changed
([C-032](claims.md#c-032)).

**Transferable principle.** When useful predictive cues are absent, keep a
small diversity reserve rather than forcing the whole population into the
currently favored state.

**Candidate architecture.** Maintain a bounded set of deliberately diverse
experts, seeds, or policies whose correlations are monitored. Increase the
reserve only when uncertainty about future regimes is high; do not inject noise
into the mature core indiscriminately.

**First experiment.** Hidden-regime tasks where some switches are predictable
and others are not. Compare a single adaptive policy, a diversity ensemble, and
an uncertainty-controlled reserve. Charge inactive capacity and selection cost.

**Risk.** “Diversity” becomes expensive random duplication with no survival or
adaptation advantage.

## Planarian regeneration: repair from target constraints

**Observed system.** After amputation, planarian wound cells use pre-existing
tissue polarity; Wnt/β-catenin-dependent chromatin changes help specify whether
the missing pole should become a head or tail ([C-033](claims.md#c-033)).

**Transferable principle.** Repair need not restore a byte-for-byte snapshot.
It can infer missing structure from distributed positional constraints and a
target-state specification.

**Candidate architecture.** Store invariants about valid module roles,
interfaces, and global behavior separately from individual parameters. After
damage, synthesize or select a replacement that satisfies those invariants,
then validate it in shadow mode.

**First experiment.** Delete or corrupt modules in a small modular network.
Compare full checkpoint restore, retraining, redundancy, and constraint-guided
replacement. Measure recovery quality, time, storage, energy, and behavioral
regressions.

**Risk.** An incomplete target specification reconstructs a system that passes
local interface checks but has lost rare global behavior.

## Fungi: exploratory growth coupled to a transport backbone

**Observed system.** Time-resolved imaging of arbuscular mycorrhizal fungi found
self-regulating travelling waves of network growth: expanding tips explore,
fusion regulates density, transport efficiency remains stable, and loops shorten
routes to potential partners ([C-034](claims.md#c-034)).

**Transferable principle.** Separate an inexpensive exploratory frontier from a
stable transport backbone, then fuse successful exploration into the backbone
without letting network density grow without bound.

**Candidate architecture.** Spawn low-cost provisional experts at a novelty
frontier. Successful paths are connected, merged, or widened; redundant paths
fuse or decay; stable trunks receive optimized bandwidth and placement.

**First experiment.** A growing task graph with sparse novelty. Compare fixed
capacity, unconstrained expert growth, and frontier–fusion growth. Measure
coverage, duplicate experts, communication path length, forgetting, and full
lifecycle energy.

**Risk.** The travelling-wave language adds nothing beyond ordinary neural
architecture search, or growth cost dominates any later efficiency.

## Cross-domain synthesis

The recurring ideas are more useful than their biological labels:

| Recurring principle | Appears in | Engineering question |
| --- | --- | --- |
| Local autonomy plus sparse escalation | Cephalopod arms, immune response, plant signaling | What can be resolved locally, and what event justifies global compute? |
| Separate exploration from protected maturity | Immune affinity maturation, development, consolidation | When should variation decrease and rollback protection increase? |
| Adapt topology from use | Slime-mold transport, neural structural plasticity, vascular growth | Can connectivity follow valuable flow without erasing rare paths? |
| Cheap reversible state before permanent change | Plant priming, eligibility traces, fast memory | What temporary mark buys a faster second response without drift? |
| Expansion followed by selective sparsity | Insect mushroom body, immune repertoires | When is extra candidate capacity worth the selection cost? |
| Structure reduces controller burden | Bodies, dendrites, peripheral circuits | Which computation belongs in topology, material, memory placement, or code? |
| Shared state replaces direct messages | Ant trails, external memories, digital logs | What should agents leave in a common workspace, with what decay and provenance? |
| Diversity spreads unpredictable risk | Bacterial switching, immune repertoires, developmental overproduction | When should the system preserve alternatives instead of selecting one winner? |
| Target constraints guide repair | Planarian regeneration, homeostasis, software invariants | Can a valid subsystem be reconstructed without a full snapshot? |
| Exploratory frontier feeds stable backbone | Fungal growth, immune candidate search, modular expansion | How should cheap probes become durable capacity without uncontrolled growth? |

## Next domains to audit

The next literature pass should investigate these without promoting them to
claims yet:

- bacterial quorum sensing and collective threshold decisions;
- regeneration and self-repair beyond the initial planarian polarity result;
- developmental gene-regulatory networks as robust distributed program
  construction;
- ecological succession and diversity as protection against regime change;
- collective error correction in cell assemblies; and
- ecological resource-allocation and resilience networks.

For each domain, the acceptance bar is the same: a causal primary result, a
precise abstraction, knowledge of existing engineering analogues, and a small
experiment that can fail.

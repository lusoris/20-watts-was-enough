# Audit: neurodevelopment, global context, and metabolic allocation

**Promoted evidence:** [C-043](../claims.md#c-043)–[C-051](../claims.md#c-051).

- **Audit date:** 2026-08-05
- **Scope:** primary intervention-heavy evidence for developmental pruning and
  plasticity gates, low-bandwidth neuromodulatory context, and local metabolic
  or neurovascular allocation
- **Promotion state:** audit candidates only; no stable `C-` IDs are assigned
  here

## Selection rule

This pass prioritizes experiments with genetic deletion or rescue,
pharmacological blockade, targeted stimulation or inhibition, or a direct
perturbation of the proposed mechanism. Reviews and correlation-only studies
were used to locate work but are not included as evidence candidates. The AI
tests below are engineering translations to falsify; they are not results of
the biological papers.

## A. Development, pruning, and bounded plasticity

### NGC-01 — Complement-dependent microglial pruning in a developmental window

**Primary source.** Schafer et al., 2012,
“Microglia Sculpt Postnatal Neural Circuits in an Activity and
Complement-Dependent Manner”
([DOI](https://doi.org/10.1016/j.neuron.2012.03.026);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC3528177/)).

**Scoped causal observation.** During peak refinement of the mouse
retinogeniculate projection, microglia contained presynaptic retinal-ganglion
cell material. Manipulating relative retinal activity altered the amount of
input engulfed. Genetic deletion of either complement component C3 or
microglial complement receptor CR3 reduced engulfment. CR3 deletion and
pharmacological inhibition of microglial function produced impaired
eye-specific segregation; CR3 knockout animals retained excess
retinogeniculate synapses into young adulthood.

**Mechanism actually tested.** C3/CR3 phagocytic signaling is one causal route
by which microglia remove developing presynaptic inputs. The study does not
establish the upstream rule that selects an individual synapse for complement
tagging. Its own data left substantial residual engulfment in the knockouts.

**Organism and preparation.** Postnatal mouse retina-to-dorsal-lateral-
geniculate circuit, with in vivo labeling, genetic knockouts, array tomography,
and pharmacological perturbation.

**Evidence limits.** Eye-specific anatomical segregation is not a general
measure of useful computation or behavior. Germline complement deletions can
have effects beyond the measured event. Engulfed presynaptic label is strong
evidence of removal but does not by itself identify the utility criterion.
“Microglia prune weak synapses” is therefore too broad for promotion from this
paper alone.

**Registry mapping.** This fits
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection)
(overproduce, select, contract),
[P-005](../principle-registry.md#p-005--use-dependent-topology)
(activity-sensitive structural refinement), and
[P-009](../principle-registry.md#p-009--maintenance-plane)
(a cell population outside the fast signal path executes removal). No new
invariant is needed.

**Strongest conventional analogue.** Structured pruning or dynamic sparse
training driven by accumulated activation or responsibility statistics, with
the pruning operation performed by a separate lifecycle process.

**Falsifiable AI experiment.** Train a modular network with excess candidate
edges. Under equal training FLOPs and final sparsity, compare magnitude
pruning, random pruning, and a slow maintenance worker that removes edges using
only locally accumulated responsibility and inactivity traces. Reject the
translation if it does not improve the retained-quality/shift-recovery frontier
or if trace collection and rewiring cost erase inference savings.

### NGC-02 — Mature extracellular structure can constrain adult plasticity

**Primary source.** Pizzorusso et al., 2002,
“Reactivation of Ocular Dominance Plasticity in the Adult Visual Cortex”
([DOI](https://doi.org/10.1126/science.1072699)).

**Scoped causal observation.** In adult rats, enzymatic degradation of
chondroitin-sulfate proteoglycans in visual cortex with chondroitinase ABC made
subsequent monocular deprivation produce an ocular-dominance shift that was
normally absent after the critical period. Perineuronal-net organization
coincided with critical-period closure and was delayed by dark rearing.

**Mechanism actually tested.** Mature extracellular-matrix structure is a
causal constraint on experience-dependent visual-cortical plasticity in this
preparation; removing that constraint reopens a measurable form of plasticity.
The intervention removes a brake. It does not specify which resulting changes
are beneficial or how a circuit should be reconsolidated afterward.

**Organism and preparation.** Adult rat primary visual cortex; local enzyme
treatment, monocular deprivation, and electrophysiological ocular-dominance
measurement.

**Evidence limits.** The assay is restricted to visual cortical responses
after deprivation. Enzymatic matrix degradation is broad and does not isolate
one molecular target. Reopened plasticity can be harmful under noisy,
adversarial, or unrepresentative experience; the paper is not evidence for
unconditionally increasing learning rates.

**Registry mapping.** This belongs to
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection)
because stable solutions acquire protection after a high-plasticity phase, and
to [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design)
because a mature constraint is stored in surrounding structure. It does not
require a new invariant.

**Strongest conventional analogue.** Parameter freezing or trust-region
regularization with an explicit, reversible consolidation mask.

**Falsifiable AI experiment.** On a continual-learning stream, freeze mature
modules after validation and reopen their gradient masks only when a calibrated
drift detector fires. Compare with always-trainable weights, a fixed freezing
schedule, and elastic-weight consolidation at equal optimizer updates. Reject
the mechanism if adaptive reopening does not reduce forgetting at matched
adaptation latency, or if false drift events cause more damage than an
always-plastic baseline.

### NGC-03 — A molecular brake can stabilize adult cortex despite modulatory input

**Primary source.** Morishita et al., 2010,
“Lynx1, a Cholinergic Brake, Limits Plasticity in Adult Visual Cortex”
([DOI](https://doi.org/10.1126/science.1195320);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC3387538/)).

**Scoped causal observation.** Adult *Lynx1* knockout mice showed an
ocular-dominance shift after brief monocular deprivation that adult wild-type
mice did not. Nicotinic acetylcholine-receptor antagonists abolished this
restored adult plasticity. Loss of Lynx1 increased nicotinic responses, linking
the phenotype to cholinergic receptor modulation rather than simply to the
presence of cholinergic innervation.

**Mechanism actually tested.** Developmentally increased Lynx1 suppresses
nicotinic acetylcholine-receptor signaling and helps maintain a low-plasticity
adult network state. Plasticity therefore depends on both a modulatory drive
and a local gate on how that drive is received.

**Organism and preparation.** Mouse primary visual cortex; germline knockout,
monocular deprivation, local and systemic receptor antagonism,
electrophysiology, and visual-evoked responses.

**Evidence limits.** A germline knockout can alter development before the adult
test, so this is not a clean demonstration that acute adult removal alone is
sufficient. The result concerns one sensory system and one form of plasticity.
Stability is not merely a defect: removing brakes can increase interference or
excitotoxic risk.

**Registry mapping.** The stability/plasticity transition fits
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection).
The slower gain constraint also touches
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback), but the
paper does not demonstrate a complete feedback controller. No new invariant is
needed.

**Strongest conventional analogue.** Per-module gradient gates or adaptive
regularization strengths that locally attenuate a global optimizer signal.

**Falsifiable AI experiment.** Give all modules the same scalar adaptation
request while each module learns a bounded local plasticity gate from its
stability and interference history. Compare with one global learning-rate
schedule and per-parameter adaptive optimizers. Reject the translation if the
gate cannot improve the retention/adaptation Pareto frontier under equal
updates, or if it merely reproduces optimizer second-moment statistics.

## B. Low-bandwidth global context across timescales

### NGC-04 — Opposing diffuse signals can sustain mutually exclusive modes

**Primary source.** Flavell et al., 2013,
“Serotonin and the Neuropeptide PDF Initiate and Extend Opposing Behavioral
States in *C. elegans*”
([DOI](https://doi.org/10.1016/j.cell.2013.08.001);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC3942133/)).

**Scoped causal observation.** Genetic, cell-targeting, and optogenetic
experiments identified serotonin signaling through MOD-1 as promoting long
dwelling states and PDF signaling through PDFR-1 as promoting long roaming
states. Optogenetic manipulation of critical MOD-1-expressing targets induced
prolonged dwelling, while optogenetic activation of cAMP in
PDFR-1-expressing cells induced prolonged roaming. The modulatory circuit was
distributed across sensory, interneuron, and motor classes rather than forming
a single sensory-to-motor chain.

**Mechanism actually tested.** Two antagonistic neuromodulatory systems bias
distributed fast circuits into persistent alternative modes. Slow receptor and
second-messenger dynamics extend state beyond a brief electrical event.

**Organism and preparation.** Freely moving *Caenorhabditis elegans* foraging
on structured bacterial food, with mutants, cell-specific rescue or targeting,
calcium measurements, and optogenetic perturbations.

**Evidence limits.** The nervous system has 302 neurons and the behavioral
states are specifically roaming and dwelling. “Global” does not mean uniform:
only cells with relevant receptors and circuit positions respond. Persistent
state is not evidence that a two-scalar controller suffices for mammalian
cognition or large AI systems.

**Registry mapping.** State persistence has connections to
[P-011](../principle-registry.md#p-011--transient-communication-coalitions), but
P-011 currently concerns time-aligned communication, not a few-to-many context
broadcast. The finding also is not necessarily homeostatic negative feedback
under [P-006](../principle-registry.md#p-006--homeostatic-negative-feedback).
This is evidence for considering a separate **multiscale context-broadcast**
invariant after cross-domain deduplication.

**Strongest conventional analogue.** Supervisory or gain-scheduled control
with hysteretic modes; in reinforcement learning, options or latent policy
modes with explicit termination conditions.

**Falsifiable AI experiment.** Add two antagonistic scalar context channels to
a recurrent agent solving a nonstationary explore/exploit environment. Local
modules decode the scalars, while a hysteresis penalty discourages flicker.
Compare with an equal-parameter recurrent policy and a standard options agent.
Reject the mechanism if it does not improve return per environment step and
mode-transition stability, or if the same result is obtained by adding two
ordinary hidden units without broadcast constraints.

### NGC-05 — One broad neuromodulatory source has frequency- and duration-dependent effects

**Primary source.** Carter et al., 2010,
“Tuning Arousal with Optogenetic Modulation of Locus Coeruleus Neurons”
([DOI](https://doi.org/10.1038/nn.2682);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC3174240/)).

**Scoped causal observation.** Acute optogenetic activation of
noradrenergic locus-coeruleus neurons in mice was sufficient to induce rapid
sleep-to-wake transitions. Acute inhibition shortened wake episodes but did
not abolish all sleep-to-wake transitions. Different tonic and phasic
stimulation frequencies and durations produced different effects on immediate
transition probability, sustained wakefulness, and locomotion; excessively
high sustained stimulation caused behavioral arrest rather than monotonically
greater arousal.

**Mechanism actually tested.** A small, broadly projecting population can
causally adjust distributed arousal through a low-dimensional signal whose
temporal pattern matters. The partial effect of inhibition shows redundant
arousal routes rather than a single master controller.

**Organism and preparation.** Freely behaving mice with cell-targeted
channelrhodopsin or halorhodopsin, EEG/EMG state classification, and locomotor
measurement.

**Evidence limits.** Artificially synchronized optogenetic firing is not
endogenous locus-coeruleus coding. Wakefulness and locomotion are coarse
outputs, downstream receptor contributions were not isolated, and stimulation
precision in vivo was not directly measured. The result does not justify one
central scalar controlling every AI module.

**Registry mapping.** The broad signal can contribute to
[P-001](../principle-registry.md#p-001--selective-allocation) by changing the
availability of activity and to
[P-011](../principle-registry.md#p-011--transient-communication-coalitions) by
changing effective network state. Its few-to-many temporal code is still
different from both bundles and supports the same candidate
**multiscale context-broadcast** invariant as NGC-04.

**Strongest conventional analogue.** Gain scheduling or mode-dependent global
control, with frequency/duration represented by filtered control channels
rather than by a detailed command stream.

**Falsifiable AI experiment.** Broadcast a one-dimensional control signal to
all blocks of a conditional-compute model, but expose each block to short and
long exponential filters of that signal. In tasks containing brief surprise
and sustained regime changes, compare with no broadcast, a static compute
budget, and a high-bandwidth per-block router. Reject the low-bandwidth design
if it cannot match quality and recovery time with fewer routing bits and lower
controller overhead, or if high signal amplitude causes uncontrolled compute
saturation rather than a bounded response.

### NGC-06 — Local receptor identity separates transient from sustained responses to one broadcast

**Primary source.** Dag et al., 2023,
“Dissecting the Functional Organization of the *C. elegans* Serotonergic
System at Whole-Brain Scale”
([DOI](https://doi.org/10.1016/j.cell.2023.04.023);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC10484565/)).

**Scoped causal observation.** Optogenetic activation of the food-responsive
serotonergic NSM neuron slowed movement and increased feeding; these effects
were absent in serotonin-deficient animals and in animals lacking all six known
serotonin receptors. A combinatorial panel of 64 receptor-mutant genotypes
showed distinct and interacting receptor contributions. In reduced genotypes,
SER-4 supported an onset-sensitive transient slowing response, whereas MOD-1
supported slowing during persistent release. Cell-specific restoration showed
that target location, not only receptor molecular kinetics, contributed to the
temporal response. Identified-neuron whole-brain imaging found widespread
associated dynamics.

**Mechanism actually tested.** A common extrasynaptic signal is decoded by
heterogeneous local receptors and circuit locations into distinct temporal
responses. The broadcast therefore carries less information than the full
system response; local state and receptor identity supply part of the control
logic.

**Organism and preparation.** Freely moving *C. elegans*, optogenetic waveform
control, six-receptor combinatorial mutants, cell-specific restoration,
CRISPR receptor-expression reporters, and identified-neuron calcium imaging.

**Evidence limits.** Forced NSM stimulation in the absence of food isolates
serotonin but is not a natural multimodulator condition. Whole-brain activity
relationships were largely correlational. Unknown additional receptors cannot
be completely excluded, and connectome scale and dynamics differ from larger
nervous systems.

**Registry mapping.** This does not fit
[P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime),
because the different time constants concern control responses rather than
storage. It sharpens the candidate **multiscale context-broadcast** invariant:
a few-to-many signal is decoded by local transfer functions rather than copied
uniformly.

**Strongest conventional analogue.** A control bus whose receivers implement
different filters, thresholds, and gains; equivalently, feature-wise modulation
with receiver-specific temporal kernels.

**Falsifiable AI experiment.** Send one context stream to expert modules that
must independently choose a transient high-pass, sustained low-pass, or direct
response under a fixed parameter budget. Test alternating abrupt and prolonged
regime changes. Compare with a single shared filter and with unconstrained
cross-attention. Reject the mechanism if receiver-specific filters do not
specialize reproducibly, fail to improve transient/sustained response error,
or require as many control bits as the unconstrained router.

## C. Local energy sensing and neurovascular allocation

### NGC-07 — Presynaptic ATP production is activity-coupled and functionally necessary

**Primary source.** Rangaraju et al., 2014,
“Activity-Driven Local ATP Synthesis Is Required for Synaptic Function”
([DOI](https://doi.org/10.1016/j.cell.2013.12.042);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC3955179/)).

**Scoped causal observation.** A targeted optical ATP reporter in cultured rat
hippocampal neurons showed that action-potential trains increased presynaptic
ATP demand and recruited both glycolytic and mitochondrial production.
Blocking either production route during activity reduced ATP, while combined
blockade at rest had stronger effects. Suppressing calcium entry or Munc13-
dependent vesicle cycling reduced the activity-associated ATP burden. Brief
interruption of activity-driven ATP synthesis impaired vesicle exocytosis,
endocytosis, and reacidification despite a substantial resting ATP pool.

**Mechanism actually tested.** Local energy production is coupled to use, and
the synaptic vesicle cycle is a major measured source of the presynaptic demand.
Supply-path perturbations cause immediate functional backpressure rather than
only long-term damage.

**Organism and preparation.** Cultured rat hippocampal neurons; genetically
encoded presynaptic ATP measurement, electrical stimulation, metabolic
inhibitors, calcium removal, Munc13 knockdown, and optical vesicle-cycle assays.

**Evidence limits.** Dissociated culture is not an intact neurovascular system.
The ATP reporter and inhibitor conditions have finite resolution and potential
off-target effects. The estimated ATP count is not an energy budget for a whole
brain, and biological ATP concentration must not be converted directly into
accelerator joules.

**Registry mapping.** Local coupling fits
[P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation)
and resource delivery to active sites fits the broad wording of
[P-001](../principle-registry.md#p-001--selective-allocation). No new invariant
is required, but P-001 should retain physical resource allocation in its scope.
The paper does not establish a negative-feedback set point, so it is not direct
support for P-006.

**Strongest conventional analogue.** Local queue-based dynamic voltage and
frequency scaling with backpressure when a module exhausts its power or token
budget.

**Falsifiable AI experiment.** Give each expert a measured local energy and
thermal budget replenished as a function of recent useful work. When the budget
falls, the expert must early-exit, defer, or escalate. Compare with one global
power cap and unconstrained routing on bursty heterogeneous workloads. Reject
the design if local accounting overhead exceeds saved energy, if tail latency
or quality worsens at matched joules, or if experts learn to game the usefulness
proxy.

### NGC-08 — Organelle placement alters synaptic dynamics

**Primary source.** Kang et al., 2008,
“Docking of Axonal Mitochondria by Syntaphilin Controls Their Mobility and
Affects Short-Term Facilitation”
([DOI](https://doi.org/10.1016/j.cell.2007.11.024);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC2259239/)).

**Scoped causal observation.** Syntaphilin associated axonal mitochondria with
microtubules. Deleting *snph* in mice increased the mobile fraction of axonal
mitochondria and reduced axonal mitochondrial density. Neurons from the
knockout showed altered calcium handling and increased short-term facilitation
during prolonged stimulation; reintroducing syntaphilin rescued the measured
mobility and physiological phenotype.

**Mechanism actually tested.** A dedicated docking protein controls the
mobility-versus-placement tradeoff of axonal mitochondria, and that placement
changes short-timescale synaptic behavior. The experiment establishes that
resource location matters; it does not establish a general rule that
mitochondria are dynamically routed to whichever synapse is currently most
useful.

**Organism and preparation.** Mouse *snph* knockout and cultured hippocampal
neurons, with live mitochondrial imaging, electrophysiology, calcium
measurements, transgenic re-expression, and rescue.

**Evidence limits.** Short-term facilitation is not a direct ATP-efficiency
metric and the proposed calcium explanation is not equivalent to measured
energy delivery. Culture and developmental knockout can differ from adult in
vivo allocation. More mobility is not simply better: docking, coverage, and
replacement have competing benefits.

**Registry mapping.** Placement of a recurring resource near work maps directly
to [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design),
while local coverage is related to
[P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation).
No new invariant is needed.

**Strongest conventional analogue.** Cache or model-state pinning near a
compute hotspot, balanced against migration and replication cost.

**Falsifiable AI experiment.** In a distributed mixture-of-experts system,
let an allocator pin expert weights and key-value state near nodes using them,
subject to a fixed memory and migration budget. Compare static placement,
least-recently-used caching, and an oracle trace. Reject the biological
translation if learned docking cannot beat conventional cache policies on
bytes moved, tail latency, and joules without reducing quality, or if migration
oscillation dominates savings.

### NGC-09 — Neural activity can recruit capillary-level blood-flow changes

**Primary source.** Hall et al., 2014,
“Capillary Pericytes Regulate Cerebral Blood Flow in Health and Disease”
([DOI](https://doi.org/10.1038/nature13165);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC3976267/)).

**Scoped causal observation.** Electrical neural activity and glutamate in
rodent brain-slice preparations evoked capillary dilation at pericyte locations.
Pharmacological interventions supported a pathway in which prostaglandin E2
drives dilation while nitric oxide suppresses vasoconstricting 20-HETE. During
sensory stimulation in vivo, measured capillary dilation preceded measured
arteriole dilation. A vascular model attributed most of the predicted flow
increase in that preparation to capillary dilation.

**Mechanism actually tested.** Local neural signals can be translated into
local vascular supply changes through multiple chemical mediators and mural
cells. Supply is controlled by an adjacent infrastructure layer, not by the
spiking signal path itself.

**Organism and preparation.** Juvenile rat cerebellar slices, anesthetized
mouse somatosensory cortex during whisker stimulation, pharmacological pathway
perturbations, two-photon vascular imaging, and flow modeling.

**Evidence limits.** The relative role and definition of capillary pericytes
versus vascular smooth-muscle cells remains methodologically contested. The
reported 84% contribution was model-derived, not a direct whole-brain
measurement, and should not enter an energy model as a constant. Slice age,
brain region, anesthesia, vessel classification, and pathology affect
generalization. Blood flow supplies several substrates and is not a direct
measure of computation allocated.

**Registry mapping.** Demand-linked supply fits
[P-001](../principle-registry.md#p-001--selective-allocation), slower local
infrastructure control fits
[P-009](../principle-registry.md#p-009--maintenance-plane). No new invariant is
needed. The measured activity-to-dilation pathway is not by itself evidence of
the negative-feedback set point required by P-006.

**Strongest conventional analogue.** A local infrastructure controller that
adjusts accelerator power, memory bandwidth, or network quality of service
from measured queue pressure rather than from the task model's detailed
commands.

**Falsifiable AI experiment.** Partition an accelerator cluster into local
resource domains. Let a slow controller allocate power and memory bandwidth
from smoothed queue depth and deadline miss risk while the model controls only
task routing. Compare centralized scheduling, fixed partitions, and the local
controller under spatially bursty load. Reject the design if it cannot reduce
joules and deadline misses jointly, if neighboring domains starve, or if the
controller's sampling and actuation latency makes it unstable.

## Deduplication result

The developmental and metabolic papers enrich existing bundles rather than
creating organism-themed mechanisms:

| Observed operation | Normalized control operation | Existing bundle |
| --- | --- | --- |
| complement-mediated developmental removal | use a slow maintenance actor to contract candidate topology under local evidence | P-004 + P-005 + P-009 |
| perineuronal-net and Lynx1 brakes | protect mature state by locally lowering plasticity; reopen only under an explicit intervention | P-004, with P-006/P-010 support |
| activity-driven ATP production | couple local supply and backpressure to measured local demand | P-001 + P-002 |
| mitochondrial docking | trade movement cost against useful resource placement | P-002 + P-010 |
| neurovascular dilation | let an adjacent control layer allocate physical supply from local demand proxies | P-001 + P-009 |

The three neuromodulatory papers expose a gap not cleanly represented by
P-001–P-013. A candidate invariant for cross-audit review is:

> **Multiscale context broadcast.** When many local controllers must change
> regime together but detailed point-to-point commands are too expensive, send
> a low-dimensional, few-to-many signal. Each receiver combines it with local
> state through its own gain, threshold, and temporal filter. Redundant or
> antagonistic channels bound failure and enable persistent modes.

This should not yet receive a `P-` ID. It differs from P-006 because the signal
need not implement negative feedback, from P-011 because it need not select a
communication coalition through timing alignment, and from P-012 because its
timescales concern control response rather than memory medium. A parallel audit
of endocrine, immune, bacterial, and plant systemic signals may either support
this boundary or show that it should be merged into a broader control bundle.

## Cross-paper architecture constraints

Any resulting system hypothesis should satisfy all of these constraints:

1. **Plasticity is gated, not merely reduced with age.** A mature module needs a
   reversible protection state, an evidence-based reopening trigger, and a
   reconsolidation test.
2. **Global context is not a global command.** The broadcast remains
   low-dimensional; local receivers determine their response from local state
   and distinct temporal filters.
3. **Global control is redundant.** Failure or inhibition of one channel must
   not make state transition impossible.
4. **Resource accounting is local and physical.** Measure joules, bytes moved,
   bandwidth, latency, and thermal limits at the boundary where allocation is
   claimed.
5. **The maintenance path has a budget.** Pruning, migration, monitoring, and
   resource control are not free background processes.
6. **Structural changes remain reversible until validated.** Biology's limited
   reversibility is not a silicon requirement; shadow evaluation, versioning,
   and rollback should be retained.

## Highest-value composed test

Build a continual modular model with three orthogonal controllers:

- a low-dimensional context bus with receiver-specific fast and slow filters;
- per-module reversible plasticity gates; and
- per-module compute/energy budgets with a slower infrastructure allocator.

Use a stream with abrupt context switches, slow drift, recurring regimes, and
bursty resource pressure. Compare isolated controllers and the full composition
against conventional routing, adaptive optimizers, fixed compute budgets, and
centralized scheduling. Equalize trainable parameters, optimizer updates,
memory bytes, and the measured energy boundary.

The composition is rejected if it fails to improve the joint frontier of
retention, adaptation latency, calibration, tail latency, and joules; if the
low-dimensional bus conveys as many effective bits as a normal router; or if
controller monitoring and migration costs erase the sparse-compute gains.

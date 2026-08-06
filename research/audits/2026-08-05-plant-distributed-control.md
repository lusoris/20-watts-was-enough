# Primary-source audit: plant distributed control and collective interactions

**Audit date:** 2026-08-05

**Source addition:** 2026-08-06 — Rillig et al. (2025),
"Concurrent common fungal networks formed by different guilds of fungi"
([DOI](https://doi.org/10.1111/nph.20418)).

**Scope:** within-plant distributed sensing and control, hydraulic/electrical/
chemical long-distance signalling, nutrient foraging, tropisms, shoot
branching, source--sink transport, mycorrhizal exchange, and community effects

**Purpose:** candidate evidence for later claim-ledger review; this file does
not promote claims, create stable claim IDs, or create new principles

## Method and promotion rule

This audit asks what plants actually measure and do before asking whether the
mechanism is useful for AI. It emphasizes original experiments, genetic or
physical interventions, direct measurements, and path-discriminating controls.
One critical evidence review is included because claims about forest common
mycorrhizal networks are unusually vulnerable to path ambiguity and positive
citation bias.

Every proposed translation is compared with a strong engineering null. A
biological mechanism is not an architectural contribution if a conventional
event bus, feedback controller, network-flow algorithm, hierarchical scheduler,
or market mechanism achieves the same equal-budget frontier. Evidence that a
plant uses a mechanism is not evidence that silicon should copy its substrate.

The scale distinction is mandatory:

1. **individual plant:** organs and tissues share one genotype and vascular
   body; systemic responses can therefore be selected for organismal fitness;
2. **symbiosis:** a plant and a fungus are distinct organisms exchanging
   resources under partly aligned and partly conflicting interests; and
3. **community or ecosystem:** multiple organisms can show transfer,
   facilitation, competition, or correlated responses without a common
   objective or a collective controller.

“Candidate bundle” below is provisional. The audit-local `C-PLANT-*` labels are
not entries in the canonical claim ledger.

## Executive synthesis

The primary evidence supports a **distributed body**, not a body without
integration. Local sensors and effectors are coupled by several long-distance
media with different physical constraints and timescales. Wounding can recruit
electrical depolarization, calcium, glutamate-receptor-like channels, reactive
oxygen species, and later hormonal defence. Water deficit can be conveyed
rapidly through hydraulics and also through slower peptide/hormone pathways.
Nitrogen deficit can travel root-to-shoot and return shoot-to-root before local
nitrate presence gates uptake. These are multiplexed control loops, not a
single plant “nervous system.”

Growth is both computation and actuator. Roots and shoots sense directional
cues, alter transporter polarity or tissue-specific growth, and thereby change
their future sampling geometry. But mechanisms differ sharply among organs and
stimuli: asymmetric auxin transport supports hypocotyl photo- and gravitropism,
whereas Arabidopsis root hydrotropism is cortex-specific and root
phototropism can begin without the canonical asymmetric-auxin explanation.

Resource allocation is likewise constrained rather than globally optimized.
Phloem loading, pressure-driven transport, unloading anatomy, vascular
sectoriality, sink demand, and developmental state all shape delivery. A large
sink does not necessarily override an unfavorable vascular path. Apical
dominance is not a single top-down auxin command: sugar availability can trigger
the earliest bud release after decapitation, while auxin transport,
strigolactone, cytokinin, and local bud state regulate later competition and
sustained branching.

Mycorrhizal exchange is real, but “wood-wide web” narratives often outrun the
measurements. Direct hyphal transfer, reciprocal rewards in controlled
plant--fungus experiments, unequal terms of trade, defence priming, intensified
competition, and greater size inequality can all occur. Resource movement or a
receiver response does not by itself demonstrate altruism, optimization for the
plant community, intentional messaging, or ecosystem cognition.

No new stable principle is recommended. The strongest residual—bidirectional
deficit reporting followed by capability-gated local allocation—currently
reduces to [`P-001`](../principle-registry.md#p-001--selective-allocation),
[`P-006`](../principle-registry.md#p-006--homeostatic-negative-feedback), and
[`P-011`](../principle-registry.md#p-011--transient-communication-coalitions),
with backpressure/primal--dual control as the engineering null. Plant results
do, however, sharpen several failure conditions and motivate matched-cost
experiments.

## Scale separation: what the evidence can and cannot establish

| Scale | Unit whose performance is measured | Credible causal language | Invalid shortcut | AI relevance |
| --- | --- | --- | --- | --- |
| Cell/tissue inside one plant | cell, vascular strand, organ, whole plant | local sensing, propagation, feedback, developmental coordination | every propagated ion or molecule is an encoded message | modules may share multiple channels and close local loops |
| Whole individual plant | survival, growth, water status, nutrient uptake, branching | organism-level allocation under anatomical and physiological constraints | the plant solves a globally optimal objective | test decentralized allocation against explicit optimizers |
| Plant--fungus symbiosis | each partner's carbon, phosphorus, nitrogen, growth, reproduction | exchange, preferential allocation, reciprocal reward, exploitation | mutualism implies equal or altruistic trade | strategic modules need audits, outside options, and gaming tests |
| Multiple plants linked by fungi | donor/receiver tracer, defence response, biomass distribution | transfer or response conditional on a candidate path | transfer proves aid, communication, or shared intent | shared fabric can carry useful and harmful flows |
| Community/ecosystem | productivity, diversity, inequality, nutrient cycling, stability | emergent outcome under competition and facilitation | the ecosystem is a coherent controller | optimize vector-valued outcomes; expose distributional effects |

This separation also changes experimental design. Inside one plant, blocking a
receptor, vascular route, or transporter can identify a causal loop. Between
organisms, the experiment must additionally exclude diffusion, root contact,
volatile cues, microbial changes, isotope recycling, and treatment-induced
changes in fungal abundance or plant condition. At community scale, average
biomass can rise while inequality and exclusion also rise.

## Mechanism map and deduplication

| Biological observation | Exact abstraction | Existing bundle(s) | Strongest non-biological null | Disposition |
| --- | --- | --- | --- | --- |
| Wound-triggered electrical/Ca/ROS propagation | regenerative alarm on a constrained transport graph with local refractory feedback | `P-006`, `P-009`, `P-011` | publish/subscribe interrupt bus plus rate limiter | deduplicate; test multiplexing only |
| Hydraulic drought response plus CLE25/ABA path | fast physical state propagation plus slower chemical confirmation/control | `P-006`, `P-007`, `P-010`, `P-011` | observer plus PID/MPC with redundant sensors | deduplicate |
| CEP up, CEPD down, nitrate-gated uptake | deficit report, global context return, local capability gate | `P-001`, `P-006`, `P-011`; adjacent to multiscale context broadcast | backpressure or primal--dual resource allocation | held as composition |
| Local nitrate foraging and lateral-root growth | spend irreversible structure where expected resource return is high | `P-001`, `P-005`, `P-007`, `P-010` | adaptive sampling, bandit allocation, topology optimization | deduplicate |
| Tropic differential growth | translate directional error into asymmetric actuator growth | `P-007`, `P-010` | extremum-seeking control or gradient-following robot | deduplicate; preserve organ-specific mechanisms |
| Sugar-first bud release with hormonal stabilization | release dormant capacity when bottleneck clears, then consolidate competition | `P-001`, `P-003`, `P-006`, `P-012` | admission control/hierarchical scheduler | held as composition |
| Pressure-flow plus selective loading/unloading | demand-biased flow over a physically constrained network | `P-001`, `P-006`, `P-010`, `P-013` | capacitated network flow/backpressure | deduplicate |
| Reciprocal mycorrhizal reward | local exchange under partially conflicting objectives | `P-001`, `P-008`, `P-013` | market/contract/matching mechanism | deduplicate; gaming is central |
| CMN transfer, priming, and inequality | shared fabric changes externalities and competitive outcomes | `P-004`, `P-008`, `P-013` | shared cache/message bus/market with unequal access | no collective-intelligence claim |
| Concurrent fungal guild links | superposed, typed transport layers can share plant endpoints without being causally interchangeable | `P-008`, `P-013`; observation contract in Candidate 014 | multiplexed network with per-channel telemetry and fault injection | perspective-level design constraint; no new principle |

### Cross-audit deduplication

- The [collective/ecological resilience audit](2026-08-05-collective-ecological-resilience.md)
  already requires vector-valued community outcomes and separates transfer,
  productivity, stability, and participant-level benefit. The mycorrhizal
  material supplies a plant-specific instance, not a second collective
  intelligence bundle.
- The [economics, market design, and incentives audit](2026-08-05-economics-market-design-incentives.md)
  already supplies shadow prices, auctions, matching, sanctions, strategic
  misreporting, and distributional nulls. Reciprocal fungal reward does not
  create a new allocation principle beyond those mechanisms.
- The [endocrine and circadian control audit](2026-08-05-endocrine-circadian-control.md)
  already holds multiscale context broadcast against gain-control and
  supervisory-control baselines. CEP/CEPD and CLE25 add plant transport
  mechanisms but not a new broadcast invariant.
- The [adaptive materials and self-assembly audit](2026-08-05-adaptive-materials-and-self-assembly.md)
  already treats physical structure as task-specific computation with
  fabrication, retention, reset, and drift costs. Tropic growth is an embodied
  control example within that accounting boundary.
- The [engineering analogues audit](2026-08-05-engineering-analogues.md)
  already provides conventional event-driven, feedback, routing, and
  source--sink-like nulls. Every experiment below keeps those baselines rather
  than comparing the plant mechanism only with dense monolithic computation.

## 1. Rapid wound signalling: regenerative alarm, not a neuron analogue

### Biological observation

Mousavi et al. screened Arabidopsis membrane-protein mutants and found that
mutations in clade-3 `GLR` genes attenuated wound-induced surface-potential
changes; the `glr3.3 glr3.6` combination also reduced distal jasmonate-related
responses. Toyota et al. then imaged a wound-triggered calcium signal and used
genetic and application experiments to support a chain in which wound-released
glutamate activates GLR channels and helps propagate calcium-based defence
signalling to distant leaves. These studies establish causal components in a
vascular plant and do not establish identity with animal synapses.

Miller et al. measured an RBOHD-dependent systemic ROS-associated response in
Arabidopsis after several stresses. The reported propagation rate was
$8.4\ \mathrm{cm\,min^{-1}}$ in that assay; it is not a species-independent
constant, a neuronal conduction speed, or a complete latency measurement for
defence output. Yan et al. identified Ca$^{2+}$/calmodulin-dependent GLR3.3
desensitization. A CRISPR gain-of-function allele with impaired desensitization
prolonged electrical/calcium signals and increased anti-herbivore defence,
showing that the alarm path contains negative feedback rather than merely
maximal amplification.

A useful evolutionary boundary comes from Marchantia. Sanmartín et al. found
that its single GLR was required for systemic electrical and calcium wound
signals, yet those signals were not coupled to systemic oxylipin-based
wound-induced gene expression in the tested liverwort. Propagation, decoding,
and downstream action are therefore separable.

### Proposed AI translation

Use a sparse topological alarm fabric in which a local event can recruit a
fast low-payload interrupt, a richer contextual stream, and a slower policy
response. Each receiving module must decode the event under local state; an
alarm is not itself a command. Add local refractory/desensitization state to
prevent a persistent fault or adversary from monopolizing the fabric.

### Efficiency mechanism

Regenerative local propagation can avoid continuously polling every module and
can reach only topologically relevant regions. A low-dimensional interrupt may
trigger selective high-cost diagnosis. Any gain is conditional on low idle
cost, sparse alarms, inexpensive repeaters, and a false-positive rate low
enough that downstream activation does not dominate energy.

### Evidence status and deduplication

The plant biology is **established for the tested species, genotypes, and
stimuli**. The AI translation is **plausible but unvalidated**. The abstraction
is `P-011` communication plus `P-006` desensitization and `P-009` maintenance;
it does not justify a new “plant electrical intelligence” principle.

### Failure modes and measurable predictions

- A signal can propagate without the intended downstream program, as the
  Marchantia result demonstrates.
- Regenerative paths amplify noise, correlated faults, or adversarial alarms.
- Longer or stronger signals may improve defence while raising growth,
  bandwidth, or recovery costs not visible in a short assay.
- Topology can leave important modules unreachable or create cut vertices.
- The architecture is useful only if event-driven cost beats optimized polling
  and if refractory control preserves recall for genuinely repeated events.

For any engineered wave, report

$$
v = \frac{L}{\Delta t},
$$

where $v$ is propagation speed in metres per second, $L$ is path length in
metres, and $\Delta t$ is onset-time difference in seconds. Also report message
energy $E_{\mathrm{msg}}$ in joules, false-alarm rate in events per hour,
recovery time in seconds, and distal task-response latency separately.

## 2. Water deficit: fast hydraulics and slower chemical control coexist

### Biological observation

Christmann et al. manipulated root water supply and ABA competence. In their
rapid drought assay, a hydraulic response in the shoot preceded ABA signalling
and stomatal closure; root ABA biosynthesis was not required for the response,
whereas shoot ABA biosynthesis/signalling was. Attenuating the hydraulic change
blocked the long-distance response. This supports a physical root-to-shoot
trigger followed by local hormonal control for that regime, not the claim that
all drought signalling is purely hydraulic.

Takahashi et al. found that Arabidopsis `CLE25` expression increases in root
vascular tissue under dehydration, that the peptide moves to the shoot, and
that BAM receptors, leaf `NCED3` induction, ABA accumulation, and stomatal
control participate in the response. Hydraulic and peptide/hormone evidence
therefore describe different, potentially interacting paths and timescales.

### Proposed AI translation

Separate an inexpensive physical or aggregate telemetry channel from slower
semantically specific control messages. A sudden shared-resource pressure
change can trigger local safe-mode behavior immediately; a slower authenticated
message can tune duration, target, and recovery policy.

### Efficiency mechanism

The controlled plant state already changes the transport medium. Reusing that
physical state can provide fast global evidence without a dedicated message
from every sensor. The slower path reduces ambiguity. In computing, the
analogue is only efficient when pressure/temperature/queue/voltage telemetry is
already measured and when false safe-mode transitions cost less than waiting
for the rich path.

### Mathematical audit

A minimal hydraulic relation is

$$
Q = K_h(\Psi_1-\Psi_2),
$$

where $Q$ is volume flow in $\mathrm{m^3\,s^{-1}}$, $K_h$ is hydraulic
conductance in $\mathrm{m^3\,Pa^{-1}\,s^{-1}}$, and $\Psi$ is water potential
in pascals. With storage,

$$
C_h\frac{d\Psi}{dt}=Q_{\mathrm{in}}-Q_{\mathrm{out}},
$$

where $C_h$ is hydraulic capacitance in $\mathrm{m^3\,Pa^{-1}}$. These
equations expose why response speed depends on conductance, capacitance,
geometry, boundary conditions, and transpiration. A fixed “plant signal speed”
cannot be imported into an AI design.

### Evidence status, null, and failure modes

Both pathways are **established in scoped Arabidopsis experiments**; their
relative contribution across species, tissues, and drought trajectories is
context-dependent. The strongest null is a conventional observer feeding
PID/MPC control from redundant telemetry. The candidate maps to `P-006`,
`P-007`, `P-010`, and `P-011`.

Failure conditions include slow drift that never crosses the fast alarm,
transient hydraulic shocks unrelated to drought, a compromised chemical path,
and a controller that cannot distinguish “protect now” from “reconfigure for a
long shortage.” Tests must vary onset rate, duration, spatial localization,
sensor delay, and channel corruption rather than use one abrupt fault.

## 3. Nitrogen demand and patch foraging: bidirectional context with a local gate

### Biological observation

Tabata et al. showed that nitrogen-starved Arabidopsis roots induce
C-terminally encoded peptides (CEPs), that shoot LRR receptor kinases perceive
the root-derived signal, and that this pathway contributes to compensatory
nitrate uptake by other roots. Ohkubo et al. identified leaf-induced CEPD1 and
CEPD2 as descending mobile polypeptides. They travel to roots and upregulate
the high-affinity nitrate transporter gene `NRT2.1` specifically where nitrate
is present. The loop combines a deficit report, shoot-level integration, a
return signal, and local resource availability.

Root structure also adapts to patches. Remans et al. found that `NRT1.1`
participates in the signalling pathway for lateral-root proliferation in a
nitrate-rich patch; the mutant phenotype could not be reduced to lower local
nitrate uptake. Guan et al. used split roots to show that TCP20 is needed for
preferential lateral-root proliferation in nitrate-rich regions under the
tested heterogeneous supply.

### Proposed AI translation

Modules report unmet demand upward using a compact signal. A global or
intermediate controller broadcasts current scarcity/context downward, but
capacity expands only at modules that also detect a local opportunity. The
growth version can add or strengthen experts, memory shards, sensors, or routes
near recurring high-value demand.

### Efficiency mechanism

Bidirectionality avoids a full global map in every root/module: deficit is
compressed on the way up; global state is compressed on the way down; a local
capability test selects where expensive uptake or structure is activated.
This can save communication and prevent capacity from being deployed where the
requested resource is absent.

### Strongest null and deduplication

The closest engineered null is backpressure or a primal--dual allocator:
queues or deficits act as local prices, a coordinator updates a shadow price,
and service is allocated where both demand and capacity exist. A centralized
optimizer with delayed but complete state is another required baseline.
Because that null expresses the same causal loop, the plant result currently
deduplicates into `P-001`, `P-006`, and `P-011`; structural growth additionally
uses `P-005`, `P-007`, and `P-010`. It is adjacent to the held multiscale
context-broadcast candidate but does not independently establish it.

### Failure modes and measurable predictions

- Delay can produce oscillatory over-allocation after a patch has disappeared.
- A deficit signal can be honest inside one organism but strategically gamed
  by autonomous software modules.
- Irreversible growth can lock the system to yesterday's resource map.
- Local nitrate sensing and systemic demand are necessary distinctions; a
  single global signal should not activate every receiver.
- The scheme fails as an AI contribution if primal--dual control or
  backpressure matches its regret and latency with fewer messages or less
  state.

Use a budget constraint rather than anthropomorphic “decision” language:

$$
\sum_{i=1}^{n} u_i(t) \le B(t), \qquad u_i(t)\ge 0,
$$

where $u_i$ is allocation rate to module $i$ in compute-seconds per second or
watts, and $B$ is the corresponding total budget. Measure cumulative unmet
demand, energy in joules, structural changes, messages, and reallocation regret
after patch switches.

## 4. Tropisms: control through differential growth, with mechanism diversity

### Biological observation

Ding et al. found that unilateral light changes PIN3 polarization in
Arabidopsis hypocotyl endodermis and supports asymmetric auxin distribution and
phototropic bending. Rakusová et al. found gravity-dependent PIN3 polarization
to the lower side of hypocotyl endodermal cells, with GNOM/PINOID-dependent
trafficking, asymmetric auxin response, and shoot bending.

Those results must not be universalized. Dietrich et al. used genetics,
tissue-specific expression, imaging, and modelling to show that Arabidopsis
root hydrotropism can be driven by a cortex-specific growth mechanism involving
ABA-related SnRK2.2 and MIZ1 in elongation-zone cortical cells; the root cap and
meristem roles differ from gravitropism. Kimura et al. found that root negative
phototropism began before detectable asymmetric auxin, persisted or increased
when polar auxin transport/biosynthesis was disrupted in ways that suppressed
gravitropism, and therefore did not require the canonical asymmetric-auxin
mechanism in their Arabidopsis assays.

### Proposed AI translation

Let sensing change the geometry that determines future sensing. A module can
move, grow, specialize, or allocate receptive field toward a persistent
gradient instead of repeatedly computing a global plan. Distinct cue classes
should be free to use distinct transduction mechanisms that converge only at a
shared actuator interface.

### Efficiency mechanism

Once structure has changed, passive geometry can keep the sensor or capacity in
a useful region. Recurrent digital control and communication may fall, but
construction, material turnover, delayed correction, and irreversibility must
be charged. The biological advantage may depend on slow environmental dynamics
relative to growth.

### Mathematical audit

For a slender growing organ, a minimal curvature relation is

$$
\frac{d\kappa}{dt}=\frac{\dot\epsilon_2-\dot\epsilon_1}{d},
$$

where curvature $\kappa$ has units $\mathrm{m^{-1}}$, the flank strain rates
$\dot\epsilon_1$ and $\dot\epsilon_2$ have units $\mathrm{s^{-1}}$, and organ
diameter $d$ is in metres. This is an actuator relation, not a sensory model.
An engineered test must separately measure cue estimation error, actuation
energy, construction energy, and the cost of reversing curvature or topology.

### Evidence status, null, and failure modes

Differential-growth control is **established**, while the molecular mechanism
is **organ- and stimulus-specific**. The strongest nulls are extremum-seeking
control, gradient ascent, active sensing, and standard mobile-sensor placement.
The abstraction maps to `P-007` and `P-010`, with `P-005` when topology changes.

Failure conditions include moving or deceptive gradients, conflicting cues,
growth slower than environmental change, irreversible overshoot, and a cue
whose reporter correlates with bending only because another tropism was
activated. The Kimura result is an especially important causal warning:
post-bending asymmetry can be an effect of coupled dynamics rather than the
cause of the first bend.

## 5. Apical dominance: resource release, hormonal gating, and branch competition

### Biological observation

Mason et al. measured pea bud growth after decapitation and found that basal
buds could begin release before auxin depletion reached them. Sucrose in node-2
buds rose by 44% within four hours in the reported experiment, and supplying
sucrose to intact plants could promote release. This supports sugar
availability as an initial regulator in that system; it does not make sugars
the only regulator of branching.

Brewer et al. used pea and Arabidopsis branching mutants and grafting/hormone
experiments to place strigolactone action downstream of auxin in shoot-branch
control. Prusinkiewicz et al. combined plant experiments with modelling to
support competition for access to the main stem's polar auxin transport stream
as a switch affecting bud activation. Together, the studies favor a staged and
competitive system: a strong apex is a resource sink and hormonal source;
removal rapidly changes sugar supply; buds begin activation; hormonal and
transport feedback then determine sustained growth and renewed dominance.

### Proposed AI translation

Keep dormant or low-duty modules near useful state. When a dominant path fails
or stops consuming a scarce budget, release reserve modules quickly using
resource availability, then let slower performance and interference signals
decide which reserves consolidate and which return to dormancy.

### Efficiency mechanism

Resource-first release can react before a slower control-plane update reaches
all candidates. Dormant capacity avoids the steady cost of keeping every branch
fully active. Slower consolidation limits long-term duplication.

### Evidence status and deduplication

The timing and causal findings are **established in the tested pea/Arabidopsis
systems**. “Resource-first release, hormonal consolidation” is a **plausible AI
composition**, not a new principle. It combines `P-001`, `P-003`, `P-006`, and
`P-012`. The strongest null is a hierarchical scheduler with admission control,
warm standby, leases, and explicit failover.

### Failure modes and measurable predictions

- Sugar is both resource and signal; increased concentration does not identify
  which role caused every later effect.
- Initial bud release and sustained branch growth are different endpoints.
- Multiple reserves can activate together and create destructive contention.
- Warm standby state consumes memory and maintenance energy.
- The candidate fails if ordinary leases/failover match recovery and quality
  at equal reserve, communication, and update cost.

Report detection-to-first-use latency in seconds, reserve watts, duplicate work
in joules, time to reconsolidate one winner, and lost work under false release.

## 6. Source--sink allocation: physical flow, active interfaces, and topology

### Biological observation

Knoblauch et al. directly measured sieve-tube pressure, flow velocity,
viscosity, and geometry in morning glory across plant lengths. Their results
supported osmotically generated pressure differences as a unifying mechanism
for long-distance phloem flow and showed that much of the pressure drop can be
consumed along the transport path rather than only at sinks.

Ross-Elliott et al. combined live imaging, 3-D electron microscopy, genetic
blockade, and modelling in Arabidopsis roots. Small solutes unloaded through
funnel plasmodesmata by combined bulk flow and diffusion, while larger proteins
showed size-dependent batch unloading into the phloem-pole pericycle. In the
reported geometry, a single protophloem file carried about
$230\ \mathrm{fL\,s^{-1}}$; modelled funnel pores required roughly
$0.05$--$0.2\ \mathrm{MPa}$ rather than the infeasible $8.14\ \mathrm{MPa}$
estimated for simple pores. These are system-specific measurements, not design
constants.

Chen et al. used optical sucrose sensors and Arabidopsis mutants to identify
SWEET11/12-mediated sucrose efflux into the apoplast as part of a two-step
loading mechanism followed by proton-coupled import to the sieve
element--companion-cell complex. Bledsoe and Orians used $^{13}$C in split-pot
tomato plants and found that sink size affected allocation but did not override
vascular sectoriality: a large root accumulated little label from a
non-orthostichous source leaf.

### Proposed AI translation

Treat compute, activations, parameters, and energy as flows on a capacitated
graph. Sources inject only through controlled interfaces; sinks create demand;
local geometry and link resistance constrain feasible allocation; filters at
unloading boundaries separate cargo classes. Adapt demand and topology, but do
not assume any sink can reach any source.

### Efficiency mechanism

Pressure/congestion and local depletion can allocate flow without transmitting
a complete global schedule. Selective loading and unloading protect shared
media and keep large cargo out of destinations that cannot process it.
Efficiency disappears if conversion, buffering, backpressure, stranded
capacity, and retransmission exceed a direct routed design.

### Mathematical audit

For a pressure-driven conduit,

$$
Q_v = K_h\Delta P,
$$

where volume flow $Q_v$ is in $\mathrm{m^3\,s^{-1}}$, hydraulic conductance
$K_h$ is in $\mathrm{m^3\,Pa^{-1}\,s^{-1}}$, and pressure difference
$\Delta P$ is in pascals. Advective molar transport of solute $s$ is

$$
\dot n_s = c_s Q_v + J_{s,\mathrm{diff}},
$$

where $\dot n_s$ is in $\mathrm{mol\,s^{-1}}$, concentration $c_s$ is in
$\mathrm{mol\,m^{-3}}$, and diffusive contribution $J_{s,\mathrm{diff}}$ is in
$\mathrm{mol\,s^{-1}}$. Loading/unloading work, leakage, and viscosity are not
free simply because intermediate transport is pressure-driven.

### Evidence status, null, and failure modes

Pressure flow, active interfaces, convective unloading, and sectorial
constraints are **established in the scoped species and tissues**. The
engineering translation is covered by capacitated network flow, queueing,
backpressure, content-addressed routing, and membrane/API filtering. It maps to
`P-001`, `P-006`, `P-010`, and `P-013`.

Failure conditions include topology-induced starvation, a high-demand sink on
a poor path, viscosity/congestion collapse, pathogen or adversary exploitation
of a loader, and size filters that block necessary control payloads. A global
average utilization metric can hide stranded resources behind sectorial cuts.

## 7. Mycorrhizal exchange: transfer, trade, externalities, and unequal outcomes

### 7.1 Direct pathway evidence

Francis and Read used autoradiography and pathway controls to show that carbon
could move primarily through a direct vesicular--arbuscular mycorrhizal hyphal
path between connected plants; shading the receiver changed transfer,
consistent with source--sink influence. This is evidence for a pathway under
the experimental conditions, not for why a fungus allocated the carbon or
whether the donor benefited.

Song et al. connected tomato plants with *Glomus mosseae*, challenged one donor
with *Alternaria solani*, and observed defence-gene/enzyme induction and greater
disease resistance in connected receivers relative to their controls. This is
consistent with a CMN-mediated defence cue under that pot design. It does not
identify an intentional sender, exclude every indirect microbial effect in all
settings, or establish forest-scale communication.

### 7.2 Plant--fungus exchange is strategic, not uniformly cooperative

Kiers et al. manipulated partner quality and isotope-labelled exchange in an
arbuscular mycorrhizal system. Plants allocated more carbon to more beneficial
fungal partners, and fungi allocated more phosphorus to roots with greater
carbon supply. This is strong controlled evidence for preferential reciprocal
reward. It is also well described by biological-market and partner-choice
models; it is not evidence that the pair optimizes a shared scalar objective.

Walder et al. traced carbon, $^{15}$N, and $^{33}$P in flax and sorghum sharing
one of two fungal networks. Terms of trade were strongly asymmetric and
fungus-dependent: flax could invest relatively little carbon while receiving
much of the labelled nutrients, whereas sorghum could invest much more for
less return. Mixed-culture biomass could still exceed the monoculture mean.
System productivity and partner fairness are therefore distinct outcomes.

### 7.3 Community effects can be competitive

Merrild et al. linked tomato seedlings to a CMN already associated with a large
cucumber and found intensified phosphorus competition under their conditions.
Weremijewicz and Janos isolated root systems while preventing, severing, or
allowing CMNs among *Andropogon gerardii*. Intact networks increased average
size and nutrient concentrations but also increased size inequality by 32% and
produced negative neighbor-size associations. A shared network can amplify a
rich-get-richer loop.

Karst, Jones, and Hoeksema's evidence audit is not a primary plant experiment,
but it is methodologically decisive for scope. They found that common public
claims about forest CMNs were often stronger than the underlying evidence and
documented positive citation bias. Presence of compatible fungi, tracer in a
receiver, or a positive seedling outcome does not by itself establish a
continuous common network, path-exclusive transfer, or net benefit from an old
tree to a young one.

### Proposed AI translation

Shared infrastructure may carry payloads, market signals, alerts, and
externalities among modules without a central dispatcher. Each participant can
allocate resources preferentially based on measured return. The system must
retain participant identity, outside options, path provenance, and
distributional metrics; otherwise high-capacity modules can monopolize the
fabric and make average throughput look healthy.

### Efficiency mechanism

One physical/logical fabric can amortize discovery and transport across many
participants, while local exchange rules avoid a central all-pairs planner.
Specialized partners can extend reach into otherwise inaccessible resource
patches. Savings are conditional on the cost of maintaining the fabric,
measuring contributions, preventing spoofing, and limiting parasitism.

### Evidence status and deduplication

- Direct transfer and several controlled receiver effects are **established in
  particular experimental systems**.
- Reciprocal reward is **established for the tested arbuscular mycorrhizal
  partners and conditions**, not universal strict reciprocity.
- Claims of generalized interplant aid, intentional communication, or forest
  collective cognition are **speculative or disputed**.
- The architecture deduplicates into `P-001`, `P-004`, `P-008`, and `P-013`.
  The strongest nulls are market allocation, shared buses/caches, network flow,
  and ecological competition models.

### Measurement and path-identification requirements

For a labelled resource, an apparent receiver gain can be written

$$
\Delta n_R = n_{\mathrm{direct\ hypha}}
            + n_{\mathrm{soil/diffusion}}
            + n_{\mathrm{root/contact}}
            + n_{\mathrm{recycled}}
            - n_{\mathrm{loss}},
$$

all in moles. Measuring only $\Delta n_R$ does not identify the hyphal term.
Mesh size, severing, air gaps, microbial controls, donor/receiver physiology,
fungal abundance, and time-resolved isotope recovery are needed as appropriate.

Rillig et al. add a second attribution problem: mycorrhizal, endophytic,
parasitic, and saprobic fungi may form concurrent direct or indirect links
between the same plant endpoints. Their Letter proposes terminology and an
experimental program; it does not establish the prevalence or functional
effect of those concurrent networks. An intact-versus-cut result that changes
several guilds at once therefore identifies only a bundle effect. A
guild-specific claim requires guild and genet typing, continuity evidence, an
independently switchable intervention, indirect-path controls, and
participant-specific outcomes.

For allocation outcome, report at least total productivity and a distribution:

$$
G = \frac{\sum_i\sum_j |x_i-x_j|}{2n\sum_i x_i},
$$

where $x_i$ is a non-negative participant outcome (for example biomass or
service received), $n$ is participant count, and $G$ is the dimensionless Gini
coefficient. Higher total $\sum_i x_i$ does not imply lower inequality $G$.

### Failure modes

- Correlated isotope enrichment can arise through a path other than the
  claimed common network.
- A network can improve average production while excluding or suppressing
  smaller participants.
- Participants can manipulate apparent supply, quality, or need.
- A shared fabric can transmit parasites, pathogens, or misleading alarms.
- Results in seedlings, pots, one fungal species, or one nutrient regime may
  reverse with different partners and soil ecology.
- “Communication” can collapse to passive transport along source--sink
  gradients; “cooperation” can collapse to repeated exchange with sanctions.
- Co-severed fungal guilds can make a bundle effect look like a
  mycorrhiza-specific causal effect.

## Applicability map to sparse, grounded, continual AI

| Plant-derived pattern | Sparse activation | Grounding/embodiment | Continual adaptation | Required guardrail |
| --- | --- | --- | --- | --- |
| Event-driven wound alarm | wakes only affected routes and diagnostic modules | alarm originates in physical/local state | desensitization adapts response history | refractory limits, provenance, downstream confirmation |
| Hydraulic plus chemical drought paths | fast coarse route, slower selective route | reuses real resource state as sensor | controller changes as shortage persists | distinguish shocks, drift, and sensor failure |
| CEP/CEPD nutrient loop | activates uptake only where demand and resource coincide | local resource sensor gates global context | capacity follows moving resource patches | delay/oscillation control and anti-gaming |
| Tropic growth | grows or attends toward persistent error | body/placement changes future observations | structural state carries experience | reversal budget and competing-cue tests |
| Bud release and reconsolidation | dormant experts activate after incumbent loss | shared energy/compute budget is explicit | later competition compresses redundant reserves | prevent thundering herd and false failover |
| Source--sink flow | routes payload under link and sink constraints | topology, pressure, and conversion costs are explicit | source/sink roles can change over time | cut-aware fairness and cargo filters |
| Mycorrhizal exchange | participants contact only through a shared fabric | resources and externalities are conserved | partner preference can update | audit strategic behavior and inequality |

The most useful lesson is not “make neural networks more plant-like.” It is to
make state, transport, delay, topology, local opportunity, and resource
conservation explicit. A grounded system should know which measurements arise
from the task environment, which are internal proxies, and which interventions
change future observations.

## Equal-budget falsification program

### Test A — Multiplexed plant-style alarm versus an optimized event bus

**Task.** A modular embodied agent faces local damage, overload, and benign
transients on a changing sparse topology.

**Treatments.** (1) periodic polling, (2) conventional publish/subscribe event
bus, (3) regenerative local alarm, and (4) regenerative alarm plus a slower
authenticated context channel and local desensitization.

**Equal budget.** Match sensors, total delivered bits, network links, peak
power, and downstream diagnostic capacity. Charge idle listening and recovery.

**Measures.** Detection recall, false activations, onset-to-mitigation latency,
joules, message count, topology coverage, repeated-event recall, and
catastrophic misses.

**Falsification.** Reject the plant-style residual if pub/sub matches the
quality--energy--latency frontier, if correlated false alarms saturate it, or if
desensitization hides repeated true faults.

### Test B — Bidirectional deficit/capability routing versus control nulls

**Task.** Resource patches and service demand move independently among modules.

**Treatments.** (1) central optimizer with delayed full state, (2) backpressure,
(3) primal--dual shadow prices, (4) learned router, and (5) deficit-up,
context-down, local-capability-gated allocation.

**Equal budget.** Match total compute, messages, state bytes, maximum active
capacity, and reconfiguration operations.

**Measures.** Fulfilled demand, cumulative regret, tail starvation, energy,
oscillation amplitude, patch-switch recovery, topology churn, and susceptibility
to dishonest demand.

**Falsification.** Reject distinctiveness if backpressure or primal--dual
control ties or wins. Reject safety if a strategic module can monopolize
capacity without a detectable penalty.

### Test C — Growth-mediated tropism versus active placement

**Task.** Sensors or expert capacity must track noisy, drifting, sometimes
adversarial gradients.

**Treatments.** (1) static placement, (2) mobile/extremum-seeking controller,
(3) differentiable active sensing, and (4) slow structural growth with local
differential actuation.

**Equal budget.** Include fabrication/growth, actuation, reversal, sensing,
communication, and controller inference energy over the entire experiment.

**Measures.** Integrated task reward, tracking error, joules, structural mass
or parameters added, recovery after gradient reversal, and damage after cue
conflict.

**Falsification.** Reject the growth approach if environmental correlation time
is not long enough to amortize construction or if ordinary movement dominates
without irreversible lock-in.

### Test D — Resource-first reserve release versus explicit failover

**Task.** A dominant expert or service intermittently fails while warm reserves
can duplicate work.

**Treatments.** (1) hot redundancy, (2) leased warm standby, (3) consensus
failover, and (4) resource-first release followed by slower performance-based
reconsolidation.

**Equal budget.** Match reserve parameters, memory freshness, communication,
and allowed concurrent compute.

**Measures.** Recovery latency, lost requests, duplicate joules, false-release
rate, time to one stable winner, and performance after recurrent failures.

**Falsification.** Reject the candidate if a lease-based scheduler matches
recovery with lower duplication or if repeated release/consolidation causes
oscillation.

### Test E — Shared symbiotic fabric versus direct exchange

**Task.** Heterogeneous modules exchange data or scarce accelerator/memory
service while contribution quality and demand vary.

**Treatments.** (1) centralized allocation, (2) direct bilateral contracts,
(3) shared neutral bus, (4) market-based shared fabric with participant choice,
and (5) the same fabric with unverifiable transfer paths.

**Equal budget.** Match link capacity, discovery messages, accounting compute,
storage, and total available resource. Charge monitoring and dispute handling.

**Measures.** Total task reward, worst-decile service, Gini coefficient,
participant survival/retention, attack propagation, contribution--reward
calibration, and provenance errors.

**Falsification.** Reject collective-benefit claims if average reward rises only
through exclusion, if path ambiguity prevents causal attribution, or if direct
contracts/central allocation dominate after audit cost.

## Quantitative reporting checklist

Every plant-inspired systems result should expose:

- the unit of selection or optimization being claimed;
- topology, path length, cut structure, and directionality;
- signal onset, propagation, decoding, action, and recovery latencies
  separately, all in seconds;
- payload and control traffic in bits, not only message counts;
- energy in joules and average/peak power in watts, including idle sensing,
  conversion, construction, maintenance, and rollback;
- material or parameter growth and the cost of pruning/reversal;
- resource mass balance and uncertainty for tracer/flow claims;
- mean performance, tails, inequality, and excluded participants;
- adversarial or correlated-error conditions; and
- a matched conventional control, routing, scheduling, or market baseline.

## Proposed claims for ledger integration

The identifiers below are provisional audit-local labels. Root integration
should assign stable IDs only after checking overlap with existing claims.

### C-PLANT-01 — GLR-dependent electrical/calcium wound propagation is causal but not sufficient for every distal response

- **Statement:** In Arabidopsis, clade-3 GLRs participate causally in
  wound-induced electrical and calcium signalling and distal defence; in
  Marchantia, a GLR-dependent systemic electrical/calcium signal can be
  uncoupled from systemic oxylipin-gene induction.
- **Proposed status:** established.
- **Primary sources:** mousavi2013glr; toyota2018glutamate;
  sanmartin2024marchantia.
- **Boundary:** species, vascular anatomy, stimulus, and decoded output matter;
  propagation alone is not evidence of a successful message.
- **Affected principles:** P-009, P-011.

### C-PLANT-02 — Plant systemic alarms contain regenerative gain and negative feedback

- **Statement:** RBOHD-dependent ROS propagation and GLR3.3 desensitization
  show that rapid plant-wide alarm paths combine local amplification with
  mechanisms that restore a resting state.
- **Proposed status:** established for the reported Arabidopsis assays.
- **Primary sources:** miller2009rbohd; yan2024desensitization.
- **Boundary:** the reported speeds and defence benefits are not universal;
  full growth and repeated-stress costs remain regime-dependent.
- **Affected principles:** P-006, P-009, P-011.

### C-PLANT-03 — Rapid hydraulic drought evidence and slower CLE25/ABA signalling are complementary, not interchangeable

- **Statement:** A fast hydraulic root-to-shoot response can precede local
  shoot ABA action, while a root-derived CLE25 peptide can modulate leaf ABA
  synthesis and stomatal control in dehydration.
- **Proposed status:** established in scoped Arabidopsis experiments.
- **Primary sources:** christmann2007hydraulic; takahashi2018cle25.
- **Boundary:** contribution depends on drought onset, duration, tissue, and
  species; neither paper makes one pathway universal.
- **Affected principles:** P-006, P-007, P-010, P-011.

### C-PLANT-04 — Nitrogen acquisition uses deficit-up, context-down, local-opportunity gating

- **Statement:** Nitrogen-starved roots can send CEP peptides to shoot
  receptors, which induce descending CEPD signals that enhance high-affinity
  nitrate uptake where roots locally encounter nitrate.
- **Proposed status:** established for Arabidopsis.
- **Primary sources:** tabata2014cep; ohkubo2017cepd.
- **Boundary:** the AI abstraction may be no more than backpressure or
  primal--dual control and must be tested against those nulls.
- **Affected principles:** P-001, P-006, P-011.

### C-PLANT-05 — Root foraging couples local nutrient evidence to structural allocation

- **Statement:** NRT1.1- and TCP20-related signalling contributes to
  preferential lateral-root proliferation in nitrate-rich patches under
  heterogeneous supply.
- **Proposed status:** established for the reported Arabidopsis designs.
- **Primary sources:** remans2006nrt11; guan2014tcp20.
- **Boundary:** growth is slow, partly irreversible, and beneficial only when
  resource patches persist long enough.
- **Affected principles:** P-001, P-005, P-007, P-010.

### C-PLANT-06 — Tropic control converges on differential growth without one universal sensory mechanism

- **Statement:** PIN3-dependent auxin asymmetry supports hypocotyl photo- and
  gravitropism, while Arabidopsis root hydrotropism and root phototropism can
  use materially different tissue and signalling mechanisms.
- **Proposed status:** established.
- **Primary sources:** ding2011pin3; rakusova2011pin3;
  dietrich2017hydrotropism; kimura2018rootphototropism.
- **Boundary:** do not infer the causal sensor from a post-bending molecular
  gradient; organ and cue are part of the mechanism.
- **Affected principles:** P-005, P-007, P-010.

### C-PLANT-07 — Initial bud release and sustained branch selection are distinct stages

- **Statement:** Sugar availability can precede auxin depletion in initiating
  pea bud release after decapitation, while auxin transport and strigolactone
  pathways regulate later branch competition and sustained outgrowth.
- **Proposed status:** established.
- **Primary sources:** mason2014sugar; brewer2009strigolactone;
  prusinkiewicz2009auxinswitch.
- **Boundary:** sugar is both resource and signal, and results differ by node,
  species, and developmental state; the staged AI synthesis remains plausible,
  not established.
- **Affected principles:** P-001, P-003, P-006, P-012.

### C-PLANT-08 — Source--sink flow is physically driven and interface-regulated

- **Statement:** Direct pressure, flow, geometry, imaging, and transporter
  perturbations support osmotically generated long-distance phloem flow with
  active loading and anatomically selective unloading.
- **Proposed status:** established for the reported species/tissues.
- **Primary sources:** knoblauch2016munch; rosselliott2017unloading;
  chen2012sweet.
- **Boundary:** transport, loading, unloading, and cargo filtering have
  separate costs and cannot be represented by one efficiency constant.
- **Affected principles:** P-001, P-006, P-010, P-013.

### C-PLANT-09 — Sink demand does not erase vascular topology constraints

- **Statement:** In split-pot tomato, a larger root sink attracted more carbon
  when vascularly aligned with the labelled source leaf but did not overcome a
  poorly connected sector.
- **Proposed status:** established for the experiment.
- **Primary source:** bledsoe2006sectoriality.
- **Boundary:** species and developmental architecture differ; the general
  claim is that feasible paths constrain demand, not a fixed tomato topology.
- **Affected principles:** P-001, P-008, P-010.

### C-PLANT-10 — Common mycorrhizal networks can provide a direct transfer path and a defence-associated receiver effect

- **Statement:** Controlled studies have demonstrated direct hyphal carbon
  transfer in one VA system and defence priming/resistance in connected tomato
  receivers after donor pathogen challenge.
- **Proposed status:** established for the experimental systems.
- **Primary sources:** francis1984direct; song2010communication.
- **Boundary:** direct path, payload identity, sender benefit, and ecosystem
  effect are separate questions; forest generalization is unsupported.
- **Affected principles:** P-008, P-013.

### C-PLANT-11 — Mycorrhizal partners can preferentially reward, but exchange need not be equal

- **Statement:** Controlled isotope experiments support preferential
  reciprocal allocation between plants and fungi, while multi-host networks
  can produce strongly asymmetric terms of trade.
- **Proposed status:** established for the tested symbioses.
- **Primary sources:** kiers2011rewards; walder2012unequal.
- **Boundary:** biological-market behavior does not imply strict reciprocity,
  shared intent, or equal benefit across partners.
- **Affected principles:** P-001, P-004, P-008, P-013.

### C-PLANT-12 — Shared mycorrhizal networks can increase productivity and inequality simultaneously

- **Statement:** CMNs have amplified nutrient competition or plant size
  inequality in controlled systems even when some mean growth or nutrient
  measures improved.
- **Proposed status:** established for the reported microcosms.
- **Primary sources:** merrild2013competition; weremijewicz2013inequality.
- **Boundary:** community benefit is vector-valued; mean biomass does not show
  fairness, robustness, or benefit to every participant.
- **Affected principles:** P-004, P-008, P-013.

### C-PLANT-13 — Bidirectional deficit-to-capability allocation is not yet a distinct principle

- **Statement:** A plant-inspired composition of upward deficit signals,
  downward context, and local capability gates may reduce communication while
  allocating sparse capacity under heterogeneous demand.
- **Proposed status:** speculative systems hypothesis.
- **Primary sources:** tabata2014cep; ohkubo2017cepd; remans2006nrt11.
- **Rationale:** Biological recurrence raises experiment priority, but the
  causal abstraction is already implemented by backpressure and primal--dual
  control.
- **Boundary:** promote only if the equal-budget test finds a residual beyond
  those baselines under delay, topology change, and strategic demand.
- **Affected principles:** P-001, P-005, P-006, P-011.

### C-PLANT-14 — Generalized forest-network aid and communication claims exceed current path-identifying evidence

- **Statement:** Evidence that compatible fungi occur, a tracer reaches a
  receiver, or a connected seedling performs better does not by itself
  establish a continuous common network, path-exclusive transfer, net donor
  benefit, or generalized interplant aid in forests.
- **Proposed status:** disputed.
- **Primary source:** none; the decisive source is the evidence and citation
  audit karst2023bias.
- **Rationale:** The record supports some controlled CMN mechanisms while
  documented overinterpretation prevents their promotion to universal
  community-level claims.
- **Boundary:** This does not dispute the ecological importance of mycorrhizal
  fungi or every controlled transfer experiment; it disputes the stronger
  inference chain.
- **Affected principles:** constrains interpretation of P-013.

## Audit decision

1. **Do not add a stable principle.** Every strong mechanism currently
   deduplicates into the existing registry or a standard control/network/economic
   null.
2. **Prioritize the nitrogen-loop experiment.** It is the cleanest plant result
   that combines local autonomy, global context, and local opportunity, and the
   strongest test is whether it beats backpressure/primal--dual routing.
3. **Use plant signalling as a multiplexing case study, not as a nervous-system
   metaphor.** Separate propagation, decoding, and response.
4. **Treat growth as a lifecycle investment.** Structural adaptation must
   amortize construction and reversal over environmental persistence.
5. **Keep mycorrhizal scales explicit.** Transfer, reciprocal exchange,
   receiver benefit, community productivity, inequality, and ecosystem
   stability are separate claims.
6. **Require path-exclusive and distributional controls.** A shared network is
   valuable only after alternative paths, strategic behavior, and unequal
   outcomes are measured.
7. **Keep concurrent fungal layers typed.** Endpoint detection or a shared cut
   does not identify guild, genet, continuity, transport, or functional effect.

## Bibliography (audit-local BibTeX)

```bibtex
@article{mousavi2013glr,
  author  = {Mousavi, Seyed A. R. and Chauvin, Adeline and Pascaud, Fran{\c{c}}ois and Kellenberger, Stephan and Farmer, Edward E.},
  title   = {{GLUTAMATE RECEPTOR-LIKE} Genes Mediate Leaf-to-Leaf Wound Signalling},
  journal = {Nature},
  year    = {2013},
  volume  = {500},
  number  = {7463},
  pages   = {422--426},
  doi     = {10.1038/nature12478},
  url     = {https://doi.org/10.1038/nature12478}
}

@article{toyota2018glutamate,
  author  = {Toyota, Masatsugu and Spencer, Dirk and Sawai-Toyota, Satoe and Wang, Jiaqi and Zhang, Tong and Koo, Abraham J. and Howe, Gregg A. and Gilroy, Simon},
  title   = {Glutamate Triggers Long-Distance, Calcium-Based Plant Defense Signaling},
  journal = {Science},
  year    = {2018},
  volume  = {361},
  number  = {6407},
  pages   = {1112--1115},
  doi     = {10.1126/science.aat7744},
  url     = {https://doi.org/10.1126/science.aat7744}
}

@article{miller2009rbohd,
  author  = {Miller, Gad and Schlauch, Karen and Tam, Rachel and Cortes, Diego and Torres, Miguel A. and Shulaev, Vladimir and Dangl, Jeffery L. and Mittler, Ron},
  title   = {The Plant {NADPH} Oxidase {RBOHD} Mediates Rapid Systemic Signaling in Response to Diverse Stimuli},
  journal = {Science Signaling},
  year    = {2009},
  volume  = {2},
  number  = {84},
  pages   = {ra45},
  doi     = {10.1126/scisignal.2000448},
  url     = {https://doi.org/10.1126/scisignal.2000448}
}

@article{yan2024desensitization,
  author  = {Yan, Chun and Gao, Qifei and Yang, Mai and Shao, Qiaolin and Xu, Xiaopeng and Zhang, Yongbiao and Luan, Sheng},
  title   = {{Ca2+/Calmodulin}-Mediated Desensitization of Glutamate Receptors Shapes Plant Systemic Wound Signalling and Anti-Herbivore Defence},
  journal = {Nature Plants},
  year    = {2024},
  volume  = {10},
  number  = {1},
  pages   = {145--160},
  doi     = {10.1038/s41477-023-01578-8},
  url     = {https://doi.org/10.1038/s41477-023-01578-8}
}

@article{sanmartin2024marchantia,
  author  = {Sanmart{\'i}n, Maite and Rojo, Enrique and Kurenda, Andrzej and Larruy-Garc{\'i}a, Beatriz and Zamarre{\~n}o, {\'A}ngel M. and Delgadillo, M. Otilia and Brito-Guti{\'e}rrez, Pavel and Garc{\'i}a-Mina, Jos{\'e} M. and Farmer, Edward E. and S{\'a}nchez-Serrano, Jose J.},
  title   = {{GLR}-Dependent Calcium and Electrical Signals Are Not Coupled to Systemic, Oxylipin-Based Wound-Induced Gene Expression in {Marchantia polymorpha}},
  journal = {New Phytologist},
  year    = {2024},
  volume  = {244},
  number  = {3},
  pages   = {870--882},
  doi     = {10.1111/nph.19803},
  url     = {https://doi.org/10.1111/nph.19803}
}

@article{christmann2007hydraulic,
  author  = {Christmann, Alexander and Weiler, Elmar W. and Steudle, Ernst and Grill, Erwin},
  title   = {A Hydraulic Signal in Root-to-Shoot Signalling of Water Shortage},
  journal = {The Plant Journal},
  year    = {2007},
  volume  = {52},
  number  = {1},
  pages   = {167--174},
  doi     = {10.1111/j.1365-313X.2007.03234.x},
  url     = {https://doi.org/10.1111/j.1365-313X.2007.03234.x}
}

@article{takahashi2018cle25,
  author  = {Takahashi, Fuminori and Suzuki, Takehiro and Osakabe, Yuriko and Betsuyaku, Shigeyuki and Kondo, Yuki and Dohmae, Naoshi and Fukuda, Hiroo and Yamaguchi-Shinozaki, Kazuko and Shinozaki, Kazuo},
  title   = {A Small Peptide Modulates Stomatal Control via Abscisic Acid in Long-Distance Signalling},
  journal = {Nature},
  year    = {2018},
  volume  = {556},
  number  = {7700},
  pages   = {235--238},
  doi     = {10.1038/s41586-018-0009-2},
  url     = {https://doi.org/10.1038/s41586-018-0009-2}
}

@article{tabata2014cep,
  author  = {Tabata, Ryo and Sumida, Kumiko and Yoshii, Tomoaki and Ohyama, Kentaro and Shinohara, Hidefumi and Matsubayashi, Yoshikatsu},
  title   = {Perception of Root-Derived Peptides by Shoot {LRR-RKs} Mediates Systemic {N}-Demand Signaling},
  journal = {Science},
  year    = {2014},
  volume  = {346},
  number  = {6207},
  pages   = {343--346},
  doi     = {10.1126/science.1257800},
  url     = {https://doi.org/10.1126/science.1257800}
}

@article{ohkubo2017cepd,
  author  = {Ohkubo, Yuri and Tanaka, Mina and Tabata, Ryo and Ogawa-Ohnishi, Mari and Matsubayashi, Yoshikatsu},
  title   = {Shoot-to-Root Mobile Polypeptides Involved in Systemic Regulation of Nitrogen Acquisition},
  journal = {Nature Plants},
  year    = {2017},
  volume  = {3},
  pages   = {17029},
  doi     = {10.1038/nplants.2017.29},
  url     = {https://doi.org/10.1038/nplants.2017.29}
}

@article{remans2006nrt11,
  author  = {Remans, Tony and Nacry, Philippe and Pervent, Marjorie and Filleur, Sophie and Diatloff, Eugene and Mounier, Emmanuelle and Tillard, Pascal and Forde, Brian G. and Gojon, Alain},
  title   = {The {Arabidopsis NRT1.1} Transporter Participates in the Signaling Pathway Triggering Root Colonization of Nitrate-Rich Patches},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2006},
  volume  = {103},
  number  = {50},
  pages   = {19206--19211},
  doi     = {10.1073/pnas.0605275103},
  url     = {https://doi.org/10.1073/pnas.0605275103}
}

@article{guan2014tcp20,
  author  = {Guan, Peizhu and Wang, Rongchen and Nacry, Philippe and Breton, Ghislain and Kay, Steve A. and Pruneda-Paz, Jose L. and Davani, Ariea and Crawford, Nigel M.},
  title   = {Nitrate Foraging by {Arabidopsis} Roots Is Mediated by the Transcription Factor {TCP20} through the Systemic Signaling Pathway},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2014},
  volume  = {111},
  number  = {42},
  pages   = {15267--15272},
  doi     = {10.1073/pnas.1411375111},
  url     = {https://doi.org/10.1073/pnas.1411375111}
}

@article{ding2011pin3,
  author  = {Ding, Zhaojun and Galv{\'a}n-Ampudia, Carlos S. and Demarsy, Emilie and {\L}angowski, {\L}ukasz and Kleine-Vehn, J{\"u}rgen and Fan, Yuanwei and Morita, Miyo T. and Tasaka, Masao and Fankhauser, Christian and Offringa, Remko and Friml, Ji{\v{r}}{\'i}},
  title   = {Light-Mediated Polarization of the {PIN3} Auxin Transporter for the Phototropic Response in {Arabidopsis}},
  journal = {Nature Cell Biology},
  year    = {2011},
  volume  = {13},
  number  = {4},
  pages   = {447--452},
  doi     = {10.1038/ncb2208},
  url     = {https://doi.org/10.1038/ncb2208}
}

@article{rakusova2011pin3,
  author  = {Rakusov{\'a}, Hana and Gallego-Bartolom{\'e}, Javier and Vanstraelen, Marleen and Robert, H{\'e}l{\`e}ne S. and Alabad{\'i}, David and Bl{\'a}zquez, Miguel A. and Benkov{\'a}, Eva and Friml, Ji{\v{r}}{\'i}},
  title   = {Polarization of {PIN3}-Dependent Auxin Transport for Hypocotyl Gravitropic Response in {Arabidopsis thaliana}},
  journal = {The Plant Journal},
  year    = {2011},
  volume  = {67},
  number  = {5},
  pages   = {817--826},
  doi     = {10.1111/j.1365-313X.2011.04636.x},
  url     = {https://doi.org/10.1111/j.1365-313X.2011.04636.x}
}

@article{dietrich2017hydrotropism,
  author  = {Dietrich, Daniela and Pang, Lei and Kobayashi, Akie and Fozard, John A. and Boudolf, V{\'e}ronique and Bhosale, Rahul and Antoni, Regina and Nguyen, Tuan and Hiratsuka, Sotaro and Fujii, Nobuharu and Miyazawa, Yutaka and Bae, Tae-Woong and Wells, Darren M. and Owen, Markus R. and Band, Leah R. and Dyson, Rosemary J. and Jensen, Oliver E. and King, John R. and Tracy, Saoirse R. and Sturrock, Craig J. and Mooney, Sacha J. and Roberts, Jeremy A. and Bhalerao, Rishikesh P. and Dinneny, Jos{\'e} R. and Rodriguez, Pedro L. and Nagatani, Akira and Hosokawa, Yoichiro and Baskin, Tobias I. and Pridmore, Tony P. and De Veylder, Lieven and Takahashi, Hideyuki and Bennett, Malcolm J.},
  title   = {Root Hydrotropism Is Controlled via a Cortex-Specific Growth Mechanism},
  journal = {Nature Plants},
  year    = {2017},
  volume  = {3},
  pages   = {17057},
  doi     = {10.1038/nplants.2017.57},
  url     = {https://doi.org/10.1038/nplants.2017.57}
}

@article{kimura2018rootphototropism,
  author  = {Kimura, Taro and Haga, Ken and Shimizu-Mitao, Yasushi and Takebayashi, Yumiko and Kasahara, Hiroyuki and Hayashi, Ken-ichiro and Kakimoto, Tatsuo and Sakai, Tatsuya},
  title   = {Asymmetric Auxin Distribution Is Not Required to Establish Root Phototropism in {Arabidopsis}},
  journal = {Plant and Cell Physiology},
  year    = {2018},
  volume  = {59},
  number  = {4},
  pages   = {828--840},
  doi     = {10.1093/pcp/pcy018},
  url     = {https://doi.org/10.1093/pcp/pcy018}
}

@article{mason2014sugar,
  author  = {Mason, Michael G. and Ross, John J. and Babst, Benjamin A. and Wienclaw, Brittany N. and Beveridge, Christine A.},
  title   = {Sugar Demand, Not Auxin, Is the Initial Regulator of Apical Dominance},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2014},
  volume  = {111},
  number  = {16},
  pages   = {6092--6097},
  doi     = {10.1073/pnas.1322045111},
  url     = {https://doi.org/10.1073/pnas.1322045111}
}

@article{brewer2009strigolactone,
  author  = {Brewer, Philip B. and Dun, Elizabeth A. and Ferguson, Brett J. and Rameau, Catherine and Beveridge, Christine A.},
  title   = {Strigolactone Acts Downstream of Auxin to Regulate Bud Outgrowth in Pea and {Arabidopsis}},
  journal = {Plant Physiology},
  year    = {2009},
  volume  = {150},
  number  = {1},
  pages   = {482--493},
  doi     = {10.1104/pp.108.134783},
  url     = {https://doi.org/10.1104/pp.108.134783}
}

@article{prusinkiewicz2009auxinswitch,
  author  = {Prusinkiewicz, Przemyslaw and Crawford, Scott and Smith, Richard S. and Ljung, Karin and Bennett, Tom and Ongaro, Veronica and Leyser, Ottoline},
  title   = {Control of Bud Activation by an Auxin Transport Switch},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2009},
  volume  = {106},
  number  = {41},
  pages   = {17431--17436},
  doi     = {10.1073/pnas.0906696106},
  url     = {https://doi.org/10.1073/pnas.0906696106}
}

@article{knoblauch2016munch,
  author  = {Knoblauch, Michael and Knoblauch, Jan and Mullendore, Daniel L. and Savage, Jessica A. and Babst, Benjamin A. and Beecher, Sierra D. and Dodgen, Adam C. and Jensen, Kaare H. and Holbrook, N. Michele},
  title   = {Testing the {M{\"u}nch} Hypothesis of Long Distance Phloem Transport in Plants},
  journal = {eLife},
  year    = {2016},
  volume  = {5},
  pages   = {e15341},
  doi     = {10.7554/eLife.15341},
  url     = {https://doi.org/10.7554/eLife.15341}
}

@article{rosselliott2017unloading,
  author  = {Ross-Elliott, Timothy J. and Jensen, Kaare H. and Haaning, Katrine S. and Wager, Brittney M. and Knoblauch, Jan and Howell, Alexander H. and Mullendore, Daniel L. and Monteith, Alexander G. and Paultre, Danae and Yan, Dawei and Otero, Sofia and Bourdon, Matthieu and Sager, Ross and Lee, Jung-Youn and Helariutta, Yk{\"a} and Knoblauch, Michael and Oparka, Karl J.},
  title   = {Phloem Unloading in {Arabidopsis} Roots Is Convective and Regulated by the Phloem-Pole Pericycle},
  journal = {eLife},
  year    = {2017},
  volume  = {6},
  pages   = {e24125},
  doi     = {10.7554/eLife.24125},
  url     = {https://doi.org/10.7554/eLife.24125}
}

@article{chen2012sweet,
  author  = {Chen, Li-Qing and Qu, Xiao-Qing and Hou, Bi-Huei and Sosso, Davide and Osorio, Sonia and Fernie, Alisdair R. and Frommer, Wolf B.},
  title   = {Sucrose Efflux Mediated by {SWEET} Proteins as a Key Step for Phloem Transport},
  journal = {Science},
  year    = {2012},
  volume  = {335},
  number  = {6065},
  pages   = {207--211},
  doi     = {10.1126/science.1213351},
  url     = {https://doi.org/10.1126/science.1213351}
}

@article{bledsoe2006sectoriality,
  author  = {Bledsoe, Tessa M. and Orians, Colin M.},
  title   = {Vascular Pathways Constrain {$^{13}$C} Accumulation in Large Root Sinks of {Lycopersicon esculentum} ({Solanaceae})},
  journal = {American Journal of Botany},
  year    = {2006},
  volume  = {93},
  number  = {6},
  pages   = {884--890},
  doi     = {10.3732/ajb.93.6.884},
  url     = {https://doi.org/10.3732/ajb.93.6.884}
}

@article{francis1984direct,
  author  = {Francis, R. and Read, D. J.},
  title   = {Direct Transfer of Carbon between Plants Connected by Vesicular--Arbuscular Mycorrhizal Mycelium},
  journal = {Nature},
  year    = {1984},
  volume  = {307},
  pages   = {53--56},
  doi     = {10.1038/307053a0},
  url     = {https://doi.org/10.1038/307053a0}
}

@article{song2010communication,
  author  = {Song, Yuan Yuan and Zeng, Ren Sen and Xu, Jian Feng and Li, Jun and Shen, Xiang and Yihdego, Woldemariam Gebrehiwot},
  title   = {Interplant Communication of Tomato Plants through Underground Common Mycorrhizal Networks},
  journal = {PLoS ONE},
  year    = {2010},
  volume  = {5},
  number  = {10},
  pages   = {e13324},
  doi     = {10.1371/journal.pone.0013324},
  url     = {https://doi.org/10.1371/journal.pone.0013324}
}

@article{kiers2011rewards,
  author  = {Kiers, E. Toby and Duhamel, Marie and Beesetty, Yugandhar and Mensah, Jerry A. and Franken, Oscar and Verbruggen, Erik and Fellbaum, Carl R. and Kowalchuk, George A. and Hart, Miranda M. and Bago, Alberto and Palmer, Todd M. and West, Stuart A. and Vandenkoornhuyse, Philippe and Jansa, Jan and B{\"u}cking, Heike},
  title   = {Reciprocal Rewards Stabilize Cooperation in the Mycorrhizal Symbiosis},
  journal = {Science},
  year    = {2011},
  volume  = {333},
  number  = {6044},
  pages   = {880--882},
  doi     = {10.1126/science.1208473},
  url     = {https://doi.org/10.1126/science.1208473}
}

@article{walder2012unequal,
  author  = {Walder, Florian and Niemann, Helge and Natarajan, Mathimaran and Lehmann, Moritz F. and Boller, Thomas and Wiemken, Andres},
  title   = {Mycorrhizal Networks: Common Goods of Plants Shared under Unequal Terms of Trade},
  journal = {Plant Physiology},
  year    = {2012},
  volume  = {159},
  number  = {2},
  pages   = {789--797},
  doi     = {10.1104/pp.112.195727},
  url     = {https://doi.org/10.1104/pp.112.195727}
}

@article{merrild2013competition,
  author  = {Merrild, Marie P. and Ambus, Per and Rosendahl, S{\o}ren and Jakobsen, Iver},
  title   = {Common Arbuscular Mycorrhizal Networks Amplify Competition for Phosphorus between Seedlings and Established Plants},
  journal = {New Phytologist},
  year    = {2013},
  volume  = {200},
  number  = {1},
  pages   = {229--240},
  doi     = {10.1111/nph.12351},
  url     = {https://doi.org/10.1111/nph.12351}
}

@article{weremijewicz2013inequality,
  author  = {Weremijewicz, Joanna and Janos, David P.},
  title   = {Common Mycorrhizal Networks Amplify Size Inequality in {Andropogon gerardii} Monocultures},
  journal = {New Phytologist},
  year    = {2013},
  volume  = {198},
  number  = {1},
  pages   = {203--213},
  doi     = {10.1111/nph.12125},
  url     = {https://doi.org/10.1111/nph.12125}
}

@article{karst2023bias,
  author  = {Karst, Justine and Jones, Melanie D. and Hoeksema, Jason D.},
  title   = {Positive Citation Bias and Overinterpreted Results Lead to Misinformation on Common Mycorrhizal Networks in Forests},
  journal = {Nature Ecology \& Evolution},
  year    = {2023},
  volume  = {7},
  number  = {4},
  pages   = {501--511},
  doi     = {10.1038/s41559-023-01986-1},
  url     = {https://doi.org/10.1038/s41559-023-01986-1}
}
```

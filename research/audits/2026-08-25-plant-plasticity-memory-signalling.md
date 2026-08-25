# Plant plasticity, stress memory, and distributed signalling

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-25
- **Primary field anchors:** DFG 2.12-04, *Pflanzenphysiologie*, and DFG
  2.12-06, *Zell- und Entwicklungsbiologie der Pflanzen*
- **Supporting field anchors:** DFG 2.12-05 and 2.12-07; EuroSciVoc
  plant, signalling, physiology, development, epigenetics, and biophysics
  concepts; bounded ANZSRC 310111, 310504, and 310802--310806 routes
- **Scope:** digital vernalization memory; lifecycle reset; heat-stress trace
  writing, maintenance, and retrieval; meristem-localized preparedness;
  common-plus-typed systemic acclimation; stress-dependent tissue routes;
  hydropatterning and xerobranching; source-leaf control of later stomatal
  development; membrane salt sensing and routed calcium propagation; and
  phytochrome light--temperature integration
- **Promotion state:** ten bounded claim proposals are reserved as
  [`C-1516`](#c-1516)--[`C-1525`](#c-1525); no new P-series principle or
  architecture candidate is proposed
- **Central ledger:** [C-1516](../claims.md#c-1516)--[C-1525](../claims.md#c-1525)
- **Execution state:** ten CPU-only synthetic falsification protocols are
  frozen in [Fixture F-023](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md);
  no runner, generated data, result, or workstation-energy measurement exists
- **Repository constraint:** this standalone audit does not edit the central
  claim ledger, bibliography, audit index, taxonomy routing, generated
  coverage, concept or math chapters, plots, changelog, application, or PDF

## Executive finding

The earlier plant audit already owns wound-induced GLR/electrical/calcium
signalling, regenerative ROS alarms and reset, rapid hydraulic drought
signalling versus slower CLE25/ABA context, nitrate-deficit routing, tropisms,
source--sink transport, and fungal-network attribution. The comparative
biology material already owns repeated-dehydration transcriptional priming.
Repeating those observations under broader labels such as plant intelligence,
memory, or distributed control would not add a mechanism.

Ten narrower residues survive deduplication:

1. a quantitative duration can be represented by the fraction of stable
   binary locus/cell switches;
2. within-lifetime retention and between-generation reset are distinct causal
   operations;
3. acute activation, transient trace writing, trace maintenance, and later
   reinduction can be experimentally separated;
4. preparedness can be localized in a regenerative tissue and depend on an
   explicitly charged resource reserve;
5. a rapid common alarm can require a second, stress-specific signal before a
   particular systemic response is selected;
6. different stresses can use different vascular and nonvascular propagation
   routes;
7. growth can create the disequilibrium used to sense water and can gate a
   delayed, partly irreversible topology decision;
8. mature resource-producing modules can influence sensor density in modules
   that develop later;
9. a structural boundary component can sense a chemical perturbation and
   participate in launching a routed ionic response; and
10. one dynamical photoreceptor state can jointly depend on light, temperature,
    and elapsed history.

These observations qualify P-003, P-005--P-006, P-008--P-012, and existing
maintenance, memory-lifetime, structural, and communication boundaries. They
do not establish that a plant-themed algorithm is novel, efficient, robust,
or preferable to Bayesian filtering, change-point detection, caches,
state-space models, POMDPs, model-predictive control, tagged event buses,
autoscaling, topology optimisation, or calibrated sensors. F-023 therefore
charges information, state, communication, reserve, construction,
maintenance, reset, and compute before any synthetic translation can pass.

## Exact deduplication boundary

The following existing records remain authoritative owners:

1. C-026 owns repeated-dehydration transcriptional priming in Arabidopsis;
   C-1518 is narrower because it separates writer occupancy, persistent
   locus-local state, sustained expression, and enhanced reinduction after
   heat.
2. C-204 owns wound GLR/electrical/calcium propagation and decoded distal
   defence; no generic electrical-signalling claim is added here.
3. C-205 owns regenerative RBOHD alarms plus desensitizing negative feedback;
   C-1520 asks instead whether a common alarm and typed context are jointly
   required, and C-1521 asks whether route identity is stress-dependent.
4. C-206 owns rapid hydraulic drought evidence versus slower CLE25/ABA
   control. No second hydraulic claim is proposed.
5. C-208 owns nitrate-conditioned root proliferation; C-1522 adds
   growth-generated observation and distinct wet-contact versus air-gap
   developmental gates, not another generic foraging claim.
6. C-209 owns shared differential-growth geometry across tropisms. C-1522 is
   about pre-branch competence and structural admission, not bending.
7. C-210--C-212 own sugar/auxin branch release and source--sink transport.
   C-1523 is restricted to mature-leaf state affecting stomatal development in
   later leaves and retains the correction to the recent source.
8. C-213--C-217 and C-563--C-584 own mycorrhizal and broader fungal-network
   mechanism and attribution boundaries.

The user-supplied Rillig et al. paper,
[DOI 10.1111/nph.20418](https://doi.org/10.1111/nph.20418), is already present
in the repository's plant, fungal, and soil work. It is a 2025 *New
Phytologist* Letter and proposed research programme on concurrent common
fungal networks formed by different guilds. It does not directly establish
that concurrent guild networks exist, which guild caused a transfer, or what
their net functional effect is. It therefore receives no new claim or test in
this audit. Its durable consequence remains the existing demand for typed
guild attribution, continuity tests, independent interventions, and
factorial designs.

## Field-centred scope and exact routing

### Fine-grained routing recommendation

Central integration should add only the following claim-supported child
assignments. A `dedicated` route means this audit directly examines that child
field but does not imply exhaustive coverage.

1. DFG `2.12-04`, *Pflanzenphysiologie* -- `dedicated`, supported by C-1518--C-1525;
2. DFG `2.12-06`, *Zell- und Entwicklungsbiologie der Pflanzen* --
   `dedicated`, supported by C-1516--C-1519, C-1522, and C-1523;
3. DFG `2.12-05`, *Biochemie und Biophysik der Pflanzen* -- `adjacent`, only
   for C-1516, C-1518, C-1520, C-1524, and C-1525;
4. DFG `2.12-07`, *Genetik und Genomik der Pflanzen* -- `adjacent`, only for
   C-1516--C-1518 and C-1523;
5. EuroSciVoc `a2f16477-c745-46f0-b832-586b1c0e468b`, *physiology* --
   `dedicated, bounded plant depth`;
6. EuroSciVoc `584d9d66-018f-4bb9-812c-7fafd5b1abd4`, *developmental biology*
   -- `dedicated, bounded plant depth`;
7. EuroSciVoc `93205ae1-235c-4259-a94d-ca9453a2ce17`, *botany* -- `adjacent`;
8. EuroSciVoc `15701609-4c65-462a-b230-d362816906ed`, *cell signaling* --
   `adjacent`, only for C-1518, C-1520, C-1521, C-1524, and C-1525;
9. EuroSciVoc `9e3cada3-2cd1-4c90-b8c2-0cb98a892a97`, *epigenetics* --
   `adjacent`, only for C-1516--C-1518;
10. EuroSciVoc `9cfaafe4-7fee-41fc-ba8d-cf23a2a176e6`, *biophysics* --
    `adjacent`, only for C-1521, C-1522, C-1524, and C-1525;
11. EuroSciVoc `bf927f14-c975-45e6-bedd-a383152aa7d3`, *genetics* --
    `adjacent`, only for C-1516--C-1518 and C-1523;
12. ANZSRC `310804`, *Plant developmental and reproductive biology* --
    `dedicated`;
13. ANZSRC `310806`, *Plant physiology* -- `dedicated`;
14. ANZSRC `310111`, *Signal transduction* -- `adjacent`, only for C-1518,
    C-1520, C-1521, C-1524, and C-1525;
15. ANZSRC `310504`, *Epigenetics (incl. genome methylation and epigenomics)*
    -- `adjacent`, only for C-1516--C-1518;
16. ANZSRC `310802`, *Plant biochemistry* -- `adjacent`, only for C-1518,
    C-1519, C-1520, C-1524, and C-1525; and
17. ANZSRC `310803`, *Plant cell and molecular biology* -- `adjacent`, only for
    C-1516--C-1521 and C-1523--C-1525.

ANZSRC remains an independent omission detector, not the normative taxonomy
for this EU/German project. Do not infer these child assignments from parent
classes. Do not route DFG 2.12-02 ecology or 2.12-03 organismic interactions
from the environmental treatments alone: this audit does not provide field
ecology, community, microbiome, or plant--organism interaction depth. The
deduplicated fungal Letter does not change that routing.

### Included

1. Primary perturbation, reporter, imaging, physiological, and model-qualified
   evidence with species, tissue, stage, protocol, and causal boundary retained.
2. Mathematical translations that define state, observation, action,
   timescale, unit, uncertainty, reserve, and irreversible cost.
3. CPU-only synthetic tests against exact Bayesian/state-space filters,
   change-point models, recurrent and cache baselines, POMDP/MPC controllers,
   tagged buses, autoscaling, topology optimisation, and calibrated sensors.
4. Hostile transfer in which cue duration, recurrence, lineage correlation,
   route semantics, channel reliability, resource persistence, sensor drift,
   or environmental coupling changes after freeze.

### Excluded

1. New plant, tissue, cell-culture, field, genetic-modification, environmental
   release, or fungal-network experiments.
2. A claim that FLC, HSFA, ROS, ABA, auxin, GIPC, calcium, sugar, or phyB is a
   software component or universal plant mechanism.
3. A universal memory duration, switch probability, route speed, branch
   threshold, stomatal-density rule, salt threshold, thermal-reversion rate,
   or efficiency percentage.
4. Conversion of biological metabolism, synthetic operation counts, or
   simulated resource units into workstation joules.
5. A claim that a biological observation establishes an AI advantage,
   creativity, cognition, intention, legal compliance, or deployment safety.

## Evidence and normative firewalls

### Evidence roles

1. **Primary perturbation evidence** can establish necessity, sufficiency, or
   association only in the stated organism, tissue, stage, intervention, and
   outcome. It does not establish universality or engineering advantage.
2. **Reporter and chromatin measurements** resolve states imperfectly. A
   population-average mark is not automatically a single-cell memory carrier;
   a persistent mark associated with memory is not automatically its sole
   cause.
3. **Mathematical models** identify a compatible mechanism class. The digital
   FLC and growth-sustained water-potential results include model-supported
   steps that remain labelled as such.
4. **Composed claims** require special restraint. C-1524 combines an
   established membrane salt-sensing result with an established routed
   calcium-wave result; the complete engineered composition is `plausible`,
   not biologically established end to end.
5. **Corrections travel with sources.** Bao et al. 2023 must always be cited
   with the 2024 correction, DOI 10.1073/pnas.2416561121, which replaced
   published Figure 5 and Supplementary Figure S1. The corrected online
   version, not the superseded figures, is the evidence object.
6. **Taxonomies and law** establish routing and obligations only. They cannot
   raise a scientific evidence status.

### European/German applicability sentinel

This audit reads published work and specifies synthetic computation. It
authorises no biological experiment, collection, release, deployment, or
processing of personal data.

1. [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
   requires a purpose-, role-, date-, and use-specific analysis if a later AI
   system falls within scope. A benchmark pass is not conformity evidence.
2. [Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
   and the German BDSG become relevant only if later work processes personal
   data. Synthetic seeds contain none.
3. [Directive 2001/18/EC](https://eur-lex.europa.eu/eli/dir/2001/18/oj) and
   German implementation require a fresh applicability, authorization, and
   risk assessment before any covered deliberate release of genetically
   modified organisms. This audit authorises no release.
4. Regulation (EU) No 511/2014 and applicable German implementation require a
   fresh due-diligence assessment if later work uses covered genetic resources
   or associated traditional knowledge. No material is acquired here.

Current consolidated EU text, German law, competent authority, institutional
rules, intended purpose, actor role, and applicable DIN/EN/ISO edition must be
checked at the time of real work. No US or non-EU rule substitutes for an
applicable European or German requirement.

## Construct, symbol, and unit firewall

F-023 uses artificial event streams, graphs, modules, and resource fields.
Biological measurements are not copied into generator constants.

1. Seed $s$ is the inferential cluster; $t$ is simulated time [s] and $H$ is
   horizon [s]. Repeated events inside a seed do not increase sample size.
2. Cue $x_t\in[0,1]$ and hidden regime $h_t$ are dimensionless. A sensor sample
   is counted as one scalar plus serialized bytes [B].
3. Binary latch $z_i(t)\in\{0,1\}$ and commitment fraction
   $f(t)=N^{-1}\sum_i z_i(t)$ are dimensionless. $N$ is a count, not a neuron
   or cell count.
4. Durable state $m_k(t)$ and fast state $a(t)$ are artificial variables.
   Stored state is bytes [B]; state changes and writes are counts [write].
5. Trace decay $\lambda_k$ has units s$^{-1}$, delay $\tau$ is seconds [s],
   and a keyed trace $m_k$ is dimensionless unless a protocol declares a
   native quantity.
6. Graph $G=(V,E)$ is an artificial communication or growth graph. Link
   capacity is bytes/s, traffic is bytes/s, latency is seconds [s], and route
   maintenance is counted in link-update operations.
7. Construction $K$, reserve $R$, action exposure $A$, and synthetic service
   utility use separately reported cost units [CU]. They are not joules and
   are never added without a development-frozen conversion defined by the
   generator.
8. Resource concentration $c(\mathbf r,t)$ is synthetic resource units per
   square metre [RU/m$^2$]; capture is RU/s. Position $\mathbf r$ is metres
   [m], velocity is m/s, and a branch length is metres [m].
9. Event probabilities, Brier score, calibration error, false-action rate,
   service fraction, and regret normalized by a positive oracle scale are
   dimensionless.
10. CPU time is seconds [s], wall time is seconds [s], peak resident memory and
    files are bytes [B], and operations are counts [op]. Workstation energy is
    joules [J] only if a separate calibrated protocol is preregistered;
    otherwise it is `not measured`.

## Shared mathematical skeleton

### Population switch memory

For $N$ artificial latches, unswitched latch $i$ changes state with hazard
$p_t=1-\exp[-\alpha\,x_t\Delta t]$ and remains switched until an authorized
reset:

$$
z_i(t+\Delta t)=z_i(t)\lor
\mathbf 1[u_{i,t}<p_t],
\qquad
f(t)=\frac{1}{N}\sum_{i=1}^{N}z_i(t).
$$

$\alpha$ is s$^{-1}$, $\Delta t$ is [s], and $u_{i,t}$ is an independent
unit-uniform draw. This is a synthetic candidate, not a biochemical model of
FLC. A quantized analogue accumulator, exact Bayesian filter, HMM, and
recurrent model receive the same observations and state cap in PLM-T01.

### Lifecycle retention and reset

Let $\theta_g$ be a dimensionless latent task parameter in lifecycle $g$:

$$
\theta_{g+1}=\rho\theta_g+\sqrt{1-\rho^2}\,\epsilon_g,
\qquad \epsilon_g\sim N(0,1).
$$

A reset action $r_g\in[0,1]$ produces initial memory
$m_{g+1,0}=(1-r_g)m_{g,H}$. Reset writes, retained bytes, and first-quarter
prediction loss are recorded separately. $\rho$ is hidden from deployable
arms and changes under hostile transfer.

### Transient writer and decaying keyed trace

For key $k$, writer event $w_k(t)\in\{0,1\}$ deposits a trace

$$
\frac{dm_k}{dt}=-\lambda_km_k+\eta_kw_k(t),
\qquad
0\le m_k\le1.
$$

$\eta_k$ is dimensionless write magnitude and $\lambda_k$ is [s$^{-1}$].
Acute output, trace state, and later retrieval are independently ablated in
PLM-T03; a cache with optimally tuned TTL and an equal-state recurrent model
are mature nulls.

### Regenerative reserve and recovery

For service capacity $C(t)$ [tasks/s], accepted load $S(t)$ [tasks/s], and
reserve debit $q(t)$ [CU/s], unmet service and reserve are

$$
U=\int_0^H\max[0,D(t)-S(t)]dt,
\qquad
R=\int_0^H q(t)dt.
$$

State placed in a regenerative controller, workers, checkpoints, or standby
replicas counts against the same byte and reserve budgets. Recovery cannot be
credited to an uncharged extra worker or reserve.

### Common alarm plus typed context

For common alarm $g_t\in\{0,1\}$, typed posterior $\pi_t(k)$, and action
thresholds $\gamma,\beta$, candidate action $k$ is

$$
a_t(k)=\mathbf1[g_t\ge\gamma]\mathbf1[\pi_t(k)\ge\beta].
$$

The POMDP and Bayesian classifier baselines receive identical alarm and typed
observations. Alarm latency, wrong-mode actions, abstention, message bytes,
and action exposure remain separate outcomes.

### Route-aware propagation

Layer $\ell$ has adjacency $A^{(\ell)}$, byte capacity $B^{(\ell)}_{ij}$, and
queue $q^{(\ell)}_{ij}$. Total provisioned capacity, node state, payload,
headers, route tags, and maintenance updates are matched between the
multilayer and tagged-single-bus arms. A route is not free information.

### Sense by action and structural admission

Artificial probe motion $\dot{\mathbf r}=v$ changes the observation operator
$y_t=\mathcal H(c,\mathbf r_t,v_t)+\nu_t$. A branch $e$ is admitted only once
and incurs

$$
K_e=k_L\ell_e+k_0,
\qquad
M_e=\int_{t_e}^{H}\mu_L\ell_e\,dt,
$$

where $k_L$ is CU/m, $k_0$ is CU, and $\mu_L$ is CU/(m s). MPC/POMDP and
topology-optimisation nulls may execute the same probes and branches.

### Delayed capacity development

Generation $g$ exports resource $e_g(t)$ [CU/s] through a bounded link and
chooses future capacity $n_{g+1}$ [count] after delay $\tau_b$ [s]. Unmet
demand, idle capacity, construction, resource transport, and reversal cost
are separate. Age and current demand are supplied to every arm in PLM-T08.

### Boundary sensing and routed wave

Mixture vector $\mathbf c_t$ [synthetic concentration units] reaches a
boundary transfer $y_t=\phi(\mathbf c_t;\psi_t)+\nu_t$. Drift state $\psi_t$
is hidden. A threshold event launches messages over a graph with finite
capacity and latency. A calibrated conventional sensor plus event bus receives
the same sampling authority and calibration budget.

### Coupled light--temperature state

Candidate active state $p_t\in[0,1]$ follows

$$
\frac{dp}{dt}=k_{on}(L_t)(1-p)-k_{off}(T_t)p,
$$

where light input $L_t$ is dimensionless, temperature $T_t$ is kelvin [K], and
$k_{on},k_{off}$ are [s$^{-1}$]. This synthetic state-space equation is only a
testable abstraction of thermal reversion. Equal-raw-observation and
sensor-co-design strata prevent a hidden information advantage.

### Complete resource ledger

Every arm reports the vector

$$
\mathcal R=(B_{state},B_{msg},N_{obs},N_{op},N_{write},K,M,R,
t_{CPU},t_{wall},B_{RSS},B_{artifact}).
$$

No scalar efficiency score may hide a worsening protected axis. Track-specific
primary loss and one preregistered resource route are defined in F-023.

## Claim-ledger proposals

### C-1516

- **Statement:** In the cited Arabidopsis vernalization studies, stable FLC
  silencing behaved as a cell/locus-level all-or-nothing switch, while the
  quantitative whole-plant response tracked the fraction switched as prior
  cold exposure increased; interrupted-cold experiments and modelling
  supported digital rather than purely analogue registration at FLC.
- **Status:** established for the cited FLC reporters, chromatin measurements,
  interruption protocol, and compatible model class; the molecular
  temperature-registering element and universality remain unresolved.
- **Primary sources:** [Angel et al. 2011](https://doi.org/10.1038/nature10241)
  and [Angel et al. 2015](https://doi.org/10.1073/pnas.1503100112).
- **Rationale:** population fraction and individual state are different
  representations; quantitative duration need not require a continuously
  varying durable state at every unit.
- **Proposed AI translation:** encode noisy duration in a population of
  stochastic binary latches with explicit reset and calibration.
- **Efficiency mechanism:** a stable binary representation may reduce
  high-precision durable state and repeated analogue writes.
- **Failure modes:** small-population variance, correlated latches, premature
  commitment, irreversible error, calibration drift, costly reset, and an
  exact Bayesian or quantized accumulator matching the result.
- **Measurable prediction:** on interrupted/noisy cue schedules, the latch arm
  improves calibrated duration/commitment loss or reduces state writes at
  non-inferior loss versus the strongest equal-state filter, without excess
  premature commitments; the advantage must disappear outside the registered
  thresholded-retention regime.
- **Open question:** does any benefit survive RNG state, latch correlation,
  calibration, and reset accounting?
- **Used by:** [PLM-T01](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md#plm-t01-population-switch-duration-memory).
- **Disposition:** scoped central claim proposal; no new principle.

### C-1517

- **Statement:** In Arabidopsis, FLC silencing induced by vernalization is
  retained through later somatic growth but actively reset during reproductive
  and embryonic development; impaired H3K27 demethylation or embryonic
  reactivation can permit partial inheritance of the vernalized state.
- **Status:** established for the cited Arabidopsis genetic, chromatin, and
  developmental interventions; no universal plant inheritance rule is made.
- **Primary sources:** [Sheldon et al. 2008](https://doi.org/10.1073/pnas.0711453105),
  [Crevillen et al. 2014](https://doi.org/10.1038/nature13722), and
  [Tao et al. 2019](https://doi.org/10.1038/s41477-019-0402-3).
- **Rationale:** retention and reset have separate timing, mechanism, and
  failure consequences.
- **Proposed AI translation:** treat lifecycle transition as an authenticated,
  evidence-gated reset operation rather than incidental forgetting.
- **Efficiency mechanism:** reset can prevent obsolete consolidated state from
  biasing a new independent lifecycle without discarding useful within-life
  memory early.
- **Failure modes:** destroying transferable priors, incomplete reset, lineage
  leakage, false boundary detection, correlated lifecycles, and ordinary
  Bayesian change-point adaptation matching the result.
- **Measurable prediction:** forced reset improves early-life calibration only
  when cross-lifecycle mutual information is low; an evidence-gated reset
  follows the correlation crossover without hidden oracle access.
- **Open question:** can reset evidence be obtained more cheaply than directly
  estimating and adapting the transition model?
- **Used by:** [PLM-T02](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md#plm-t02-lifecycle-retention-and-reset).
- **Disposition:** scoped central claim proposal; reinforces memory-lifetime
  accounting.

### C-1518

- **Statement:** In the cited Arabidopsis heat-stress studies, HSFA2 binding
  was transient while H3K4 hypermethylation and altered transcription at
  memory-associated loci persisted; HSFA2/HSFA3 complexes contributed to
  sustained induction and enhanced reinduction in genetically separable ways.
- **Status:** established for the cited heat protocols, loci, binding,
  chromatin, expression, and mutant assays; persistent H3K4 methylation is
  associated with and regulator-dependent but is not declared the sole memory
  carrier.
- **Primary sources:** [Lamke et al. 2016](https://doi.org/10.15252/embj.201592593)
  and [Friedrich et al. 2021](https://doi.org/10.1038/s41467-021-23786-6).
- **Rationale:** acute response, trace writing, maintenance, and retrieval are
  distinct causal stages rather than one undifferentiated memory variable.
- **Proposed AI translation:** a transient writer deposits keyed, decaying
  traces that outlive the writer and are read only on matching recurrence.
- **Efficiency mechanism:** sparse event writes may replace permanent
  fine-tuning or continuously active recurrence.
- **Failure modes:** negative transfer, unbounded trace accumulation, wrong-key
  retrieval, stored output rather than memory, a correlational chromatin mark,
  and cache/TTL or equal-state recurrent nulls matching the result.
- **Measurable prediction:** writer/trace/retrieval separation reduces
  second-event latency or writes within a bounded recurrence window, while
  independent ablations identify acquisition, maintenance, and retrieval
  failures and hostile label reversal removes or reverses the benefit.
- **Open question:** which trace lifetime can be estimated without post-hoc
  tuning to the recurrence distribution?
- **Used by:** [PLM-T03](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md#plm-t03-transient-writer-trace-and-retrieval).
- **Disposition:** scoped central claim proposal; narrower than C-026.

### C-1519

- **Statement:** In the cited Arabidopsis study, the shoot apical meristem
  displayed autonomous heat-stress memory that supported regrowth after a
  later otherwise lethal treatment, while HSFA2-regulated genes and sugar
  availability participated in the observed preparedness.
- **Status:** established for the cited tissue, genotype, treatment, gene, and
  regrowth assays; tissue generality and the relative causal contribution of
  stored carbohydrate versus transcriptional state remain bounded.
- **Primary source:** [Olas et al. 2021](https://doi.org/10.1016/j.molp.2021.05.024),
  read with its [2024 correction](https://doi.org/10.1016/j.molp.2024.03.010).
- **Rationale:** preserving regenerative capacity is a different objective
  from uniformly protecting every current worker, and reserve is part of the
  mechanism rather than free support.
- **Proposed AI translation:** place preparedness in module-renewal/control
  state while explicitly reserving the resources required for recovery.
- **Efficiency mechanism:** localized state may reduce idle replication when
  workers are replaceable and regeneration is the bottleneck.
- **Failure modes:** uncharged reserve, targeted control-plane loss, single
  point of failure, concentrated attack, independent worker failures for which
  hot standby is better, and checkpointed recovery matching the result.
- **Measurable prediction:** under worker-heavy loss, localized regenerative
  state restores service with fewer idle bytes or maintenance operations than
  uniform protection at matched reserve; targeted regenerative-state loss is
  detected and cannot be hidden in mean recovery.
- **Open question:** when is concentrated preparedness cheaper than a mature
  checkpoint plus hot standby after correlated-failure risk is charged?
- **Used by:** [PLM-T04](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md#plm-t04-regenerative-locus-and-charged-reserve).
- **Disposition:** scoped central claim proposal.

### C-1520

- **Statement:** In the cited Arabidopsis systemic-acclimation experiments, a
  rapidly propagating RBOHD-dependent ROS wave supplied a general systemic
  signal, while an additional stress-specific signal was required for the
  appropriate acclimation; ABA signalling contributed to heat-specific
  systemic acclimation and heat/high-light cross-protection was not generic.
- **Status:** established for the cited Arabidopsis treatments, mutants,
  grafts, transcript/metabolite observations, and protection outcomes;
  pharmacological inhibition and system specificity limit generalisation.
- **Primary source:** [Suzuki et al. 2013](https://doi.org/10.1105/tpc.113.114595).
- **Rationale:** reach and readiness do not identify response type; a generic
  alarm and typed context can be jointly necessary.
- **Proposed AI translation:** require conjunction of a low-bandwidth common
  readiness signal and a typed posterior before high-cost action.
- **Efficiency mechanism:** cheap global readiness may reduce repeated full
  payload broadcasts while typed gating reduces wrong-mode actions.
- **Failure modes:** added-channel cost, lost or forged typed context,
  correlated path failure, latency, hazard mixtures, and a Bayesian classifier
  or tagged event bus matching the result.
- **Measurable prediction:** common-plus-typed gating reduces wrong-mode action
  exposure at matched detection latency and information versus common-only and
  typed-only ablations; typed-channel swaps change selected response and loss
  of the common channel suppresses unsupported action.
- **Open question:** does conjunction offer anything beyond a calibrated
  POMDP using the same observations and action costs?
- **Used by:** [PLM-T05](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md#plm-t05-common-alarm-plus-typed-context).
- **Disposition:** scoped central claim proposal; does not duplicate C-205.

### C-1521

- **Statement:** In tissue-specific Arabidopsis RBOHD-complementation
  experiments, high-light systemic ROS propagation required vascular
  expression, whereas heat and wounding could propagate through vascular or
  mesophyll routes; mesophyll propagation was consistent with a contribution
  to high-light/heat combination integration.
- **Status:** established for the scoped route-specific complementation,
  systemic transcript, and heat-acclimation observations; route coding and
  exact coupling among ROS, calcium, hydraulic, and electrical signals remain
  plausible rather than established.
- **Primary source:** [Zandalinas and Mittler 2021](https://doi.org/10.1093/plphys/kiab157).
- **Rationale:** path support and stress identity can covary; route topology is
  not automatically an interchangeable transport substrate.
- **Proposed AI translation:** use overlapping communication layers whose
  route and payload are both observable, with selective redundancy and
  explicit common-mode failure accounting.
- **Efficiency mechanism:** persistent route--event structure may reduce tags
  or improve fault isolation without provisioning one universal fabric.
- **Failure modes:** promoter leakage, compensation, route identity carrying
  no useful information, extra maintenance, common nodes, mapping drift, and a
  tagged single bus matching the result.
- **Measurable prediction:** a route-aware multilayer arm improves mixed-event
  attribution or link-failure tolerance only when route--hazard relationships
  persist; route randomisation or hostile mapping reversal removes the gain.
- **Open question:** after route capacity, tags, maintenance, and common-mode
  nodes are matched, is route semantics still useful?
- **Used by:** [PLM-T06](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md#plm-t06-stress-dependent-route-multiplexing).
- **Disposition:** scoped central claim proposal.

### C-1522

- **Statement:** In the cited root studies, local water availability acted
  before lateral-root founder-cell specification, root growth was necessary
  for normal hydropatterning and generated model-predicted water-potential
  differences associated with later branch position, while transient root-tip
  exposure to air invoked a distinct ABA-associated xerobranching response
  that suppressed later branch formation.
- **Status:** established for hydropatterning, developmental competence,
  growth perturbations, auxin/ARF7-associated mechanisms, and xerobranching in
  the cited Arabidopsis and cereal assays; the precise internal water-potential
  cue remains model-supported and assay generality is bounded.
- **Primary sources:** [Bao et al. 2014](https://doi.org/10.1073/pnas.1400966111),
  [Robbins and Dinneny 2018](https://doi.org/10.1073/pnas.1710709115),
  [Orosa-Puente et al. 2018](https://doi.org/10.1126/science.aau3956), and
  [Orman-Ligeza et al. 2018](https://doi.org/10.1016/j.cub.2018.07.074).
- **Rationale:** action can create an informative disequilibrium before a
  delayed structural admission; opportunity and anti-opportunity gates are
  distinct.
- **Proposed AI translation:** allow a bounded active probe to generate the
  observation used to admit or suppress a costly persistent branch.
- **Efficiency mechanism:** active sensing may avoid stranded construction
  when resource patches persist long enough to amortise probe and branch cost.
- **Failure modes:** agar/air artifact, model misspecification, passive sensors
  already supplying equal information, irreversible wrong branches, short
  patches, sensor-action confounding, and POMDP/MPC or topology optimisation
  matching the result.
- **Measurable prediction:** active-probe admission reduces stranded branch
  cost or resource regret versus passive thresholding, but must be non-inferior
  to a mature active-sensing/topology null with identical probe authority;
  rapid patch reversal removes the structural advantage.
- **Open question:** does sense-by-action add a useful rule after the full
  value-of-information problem is solved by MPC/POMDP?
- **Used by:** [PLM-T07](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md#plm-t07-sense-by-growth-and-structural-admission).
- **Disposition:** scoped central claim proposal; extends rather than repeats
  C-208.

### C-1523

- **Statement:** In the cited Arabidopsis studies, environmental or
  carbohydrate state in mature leaves influenced stomatal development in
  subsequently developing leaves; the recent source attributes a route through
  HXK1, EIN3, SUC2-mediated sucrose transport, KIN10, and SPCH.
- **Status:** established for the cited Arabidopsis treatments, grafting or
  transgenic manipulations, transport measurements, and stomatal outcomes;
  the 2023 paper is interpreted only in its corrected online form and broad
  environmental or species generality is unresolved.
- **Primary sources:** [Lake et al. 2001](https://doi.org/10.1038/35075660),
  [Bao et al. 2023](https://doi.org/10.1073/pnas.2302854120), and its mandatory
  [2024 correction](https://doi.org/10.1073/pnas.2416561121).
- **Rationale:** current producer state can regulate the density of interfaces
  that will exist in future modules after a developmental delay.
- **Proposed AI translation:** condition future sensing/actuation capacity on
  sustained exportable resource as well as forecast demand.
- **Efficiency mechanism:** resource-flow gating may reduce future capacity
  that cannot be supported, while avoiding purely local demand myopia.
- **Failure modes:** age, carbon dioxide, light, sugar, and demand confounding;
  developmental lag; irreversible overprovision; transport bottlenecks; and
  model-predictive autoscaling matching the result.
- **Measurable prediction:** under persistent regimes, resource-flow-aware
  capacity reduces unmet demand plus idle capacity at matched construction and
  reserve versus local scaling; under rapid reversal or resource--demand
  decoupling, the advantage disappears or becomes harmful.
- **Open question:** is resource flow a useful predictor after a mature
  autoscaler receives the same history and forecasts?
- **Used by:** [PLM-T08](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md#plm-t08-resource-conditioned-future-capacity).
- **Disposition:** scoped central claim proposal with mandatory correction.

### C-1524

- **Statement:** In Arabidopsis, plasma-membrane GIPC sphingolipids and the
  MOCA1-dependent headgroup were required for normal salt-induced surface
  depolarisation, calcium influx, calcium-wave, antiporter, and growth
  responses; separate imaging localized a rapid salt-triggered root-to-shoot
  calcium wave to cortex/endodermal routes and implicated TPC1 in that assay.
- **Status:** established component observations with a plausible composed
  boundary-sensor-to-routed-wave interpretation; a universal end-to-end salt
  code, exclusive sensor, or universal TPC1 mechanism is not established.
- **Primary sources:** [Jiang et al. 2019](https://doi.org/10.1038/s41586-019-1449-z)
  and [Choi et al. 2014](https://doi.org/10.1073/pnas.1319955111).
- **Rationale:** the material boundary can participate in detection before a
  finite-speed routed signal recruits slower control.
- **Proposed AI translation:** combine an embedded boundary transfer function
  with event-triggered propagation and explicit drift/selectivity monitoring.
- **Efficiency mechanism:** passive boundary detection may reduce idle polling
  while an event wave limits communication to detected perturbations.
- **Failure modes:** ion cross-sensitivity, boundary ageing, concentration
  damage, drift, route outage, false waves, disputed channel interpretation,
  and a calibrated sensor plus event bus matching the result.
- **Measurable prediction:** the composed arm reduces polling operations or
  latency at matched selectivity and false-alarm loss versus the conventional
  sensor/event-bus null; mixture, drift, and route-outage transfer must expose
  its limits rather than be averaged away.
- **Open question:** does embedding detection in the boundary save any
  resource once calibration, replacement, and event-bus costs are included?
- **Used by:** [PLM-T09](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md#plm-t09-boundary-sensing-and-routed-event-wave).
- **Disposition:** plausible composed central claim proposal.

### C-1525

- **Statement:** In the cited Arabidopsis studies, phytochrome B activity
  depended on both photoconversion and temperature-dependent thermal reversion;
  its state integrated light, temperature, and elapsed night history and
  affected temperature-responsive development.
- **Status:** established for the cited Arabidopsis photoreceptor,
  spectroscopy, mutant, promoter, transcript, and growth experiments; context,
  tissue, and downstream generality remain bounded.
- **Primary sources:** [Jung et al. 2016](https://doi.org/10.1126/science.aaf6005)
  and [Legris et al. 2016](https://doi.org/10.1126/science.aaf5656).
- **Rationale:** one dynamical sensor state can be jointly sensitive to
  multiple physical variables and their history; instantaneous channels need
  not be independently identifiable.
- **Proposed AI translation:** use a compact coupled state-space sensor only
  when a calibrated observation model preserves task-relevant identifiability.
- **Efficiency mechanism:** stable physical coupling may reduce sensor count,
  state, or sampling while retaining adequate joint estimates.
- **Failure modes:** light--temperature confounding, non-identifiability,
  thermal drift, context-specific downstream action, calibration burden, and
  independent calibrated sensors or nonlinear filtering matching the result.
- **Measurable prediction:** on factorial light--temperature histories, the
  coupled state matches independent-sensor task loss with fewer sensing/state
  resources only inside its calibrated envelope; changed reversion dynamics or
  daytime transfer exposes error or abstention.
- **Open question:** when does coupling provide compression rather than merely
  hide two variables in a harder inverse problem?
- **Used by:** [PLM-T10](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md#plm-t10-coupled-light-temperature-history-sensor).
- **Disposition:** scoped central claim proposal.

## Source-to-claim and source-to-test ledger

1. `AngelEtAl2011PolycombSwitch` and `AngelEtAl2015DigitalFLC` support C-1516
   and motivate PLM-T01. They do not validate artificial latch efficiency.
2. `SheldonEtAl2008FLCReset`, `CrevillenEtAl2014Reprogramming`, and
   `TaoEtAl2019EmbryonicReset` support C-1517 and motivate PLM-T02. They do not
   establish an optimal software reset policy.
3. `LamkeEtAl2016HitAndRun` and `FriedrichEtAl2021HSFMemory` support C-1518 and
   motivate PLM-T03. Persistent histone methylation is not promoted as the
   unique carrier.
4. `OlasEtAl2021SAMHeatMemory`, read with
   `OlasEtAl2024SAMHeatMemoryCorrection`, supports C-1519 and motivates
   PLM-T04. The fixture charges both localized state and reserve.
5. `SuzukiEtAl2013SystemicAcclimation` supports C-1520 and motivates PLM-T05.
   It does not establish an arbitrary two-channel protocol.
6. `ZandalinasMittler2021Routes` supports C-1521 and motivates PLM-T06. The
   route-aware AI interpretation remains a falsification target.
7. `BaoEtAl2014Hydropatterning`, `RobbinsDinneny2018SenseByGrowth`,
   `OrosaPuenteEtAl2018ARF7`, and `OrmanLigezaEtAl2018Xerobranching` support
   C-1522 and motivate PLM-T07. Modelled water potential is not labelled a
   direct measurement.
8. `LakeEtAl2001MatureLeaves`, `BaoEtAl2023StomatalDevelopment`, and
   `PNAS2024BaoCorrection` support C-1523 and motivate PLM-T08. The correction
   is inseparable from the 2023 citation.
9. `JiangEtAl2019GIPCSaltSensor` and `ChoiEtAl2014CalciumWave` support the
   component observations in plausible C-1524 and motivate PLM-T09.
10. `JungEtAl2016PhytochromeThermosensor` and `LegrisEtAl2016PhyBIntegration`
    support C-1525 and motivate PLM-T10.
11. `RilligEtAl2025ConcurrentCFN` is a deduplicated research Letter. It
    supports no new C-1516--C-1525 claim and no F-023 protocol.
12. DFG, EuroSciVoc, and ANZSRC records support routing labels only.

## Falsification disposition

[Fixture F-023](../../experiments/fixtures/023-plant-plasticity-memory-signalling.md)
is a complete preimplementation specification, not an implementation. It
contains ten tracks, mature nulls, equal-information and equal-budget rules,
hostile transfer, corrections and caveats, prospective statistics, explicit
terminal states, and a no-result boundary.

No claim is promoted to a P-series principle merely because its synthetic
translation passes. A valid `PASS` would establish only a preregistered result
inside the named synthetic generator. A valid `FAIL` would reject that
translation under the tested support, not the biological observation. An
`INCONCLUSIVE` result would report insufficient registered sensitivity or an
unchallenging generator. `INVALID` would report protocol, leakage, numerical,
unit, seed, artifact, or compute-integrity failure.

## Audit verdict

The repository has ten genuinely nonduplicate plant-mechanism residues ready
for central review as C-1516--C-1525 and one preimplementation fixture F-023.
The strongest near-term tests are population switch memory, writer/trace/
retrieval separation, common-plus-typed systemic action, and sense-by-action
structural admission. The remaining tracks are retained because their mature
nulls can kill attractive but weak translations before implementation effort
expands.

This audit does not claim results, measured energy savings, biological
universality, field performance, regulatory compliance, or implementation
readiness. Central claims, references, routing files, indexes, and generated
artifacts remain intentionally unchanged for root-level integration.

## BibTeX appendix

### Scientific sources

```bibtex
@article{AngelEtAl2011PolycombSwitch,
  author  = {Angel, Andrew and Song, Jie and Dean, Caroline and Howard, Martin},
  title   = {A Polycomb-based switch underlying quantitative epigenetic memory},
  journal = {Nature},
  year    = {2011},
  volume  = {476},
  pages   = {105--108},
  doi     = {10.1038/nature10241},
  url     = {https://doi.org/10.1038/nature10241}
}

@article{AngelEtAl2015DigitalFLC,
  author  = {Angel, Andrew and Song, Jie and Yang, Hongchun and Questa, Julia I. and Dean, Caroline and Howard, Martin},
  title   = {Vernalizing cold is registered digitally at {FLC}},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2015},
  volume  = {112},
  number  = {13},
  pages   = {4146--4151},
  doi     = {10.1073/pnas.1503100112},
  url     = {https://doi.org/10.1073/pnas.1503100112}
}

@article{SheldonEtAl2008FLCReset,
  author  = {Sheldon, Candice C. and Hills, Melissa J. and Lister, Clare and Dean, Caroline and Dennis, Elizabeth S. and Peacock, W. James},
  title   = {Resetting of {FLOWERING LOCUS C} expression after epigenetic repression by vernalization},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2008},
  volume  = {105},
  pages   = {2214--2219},
  doi     = {10.1073/pnas.0711453105},
  url     = {https://doi.org/10.1073/pnas.0711453105}
}

@article{CrevillenEtAl2014Reprogramming,
  author  = {Crevillen, Pedro and Yang, Hongchun and Cui, Xia and Greeff, Christiaan and Trick, Martin and Qiu, Qi and Cao, Xiaofeng and Dean, Caroline},
  title   = {Epigenetic reprogramming that prevents transgenerational inheritance of the vernalized state},
  journal = {Nature},
  year    = {2014},
  volume  = {515},
  pages   = {587--590},
  doi     = {10.1038/nature13722},
  url     = {https://doi.org/10.1038/nature13722}
}

@article{TaoEtAl2019EmbryonicReset,
  author  = {Tao, Zeng and Hu, Hongmiao and Luo, Xiao and Jia, Bei and Du, Jiamu and He, Yuehui},
  title   = {Embryonic resetting of the parental vernalized state by two {B3} domain transcription factors in {Arabidopsis}},
  journal = {Nature Plants},
  year    = {2019},
  volume  = {5},
  pages   = {424--435},
  doi     = {10.1038/s41477-019-0402-3},
  url     = {https://doi.org/10.1038/s41477-019-0402-3}
}

@article{LamkeEtAl2016HitAndRun,
  author  = {Lamke, Jorn and Brzezinka, Krzysztof and Altmann, Simone and Baurle, Isabel},
  title   = {A hit-and-run heat shock factor governs sustained histone methylation and transcriptional stress memory},
  journal = {The EMBO Journal},
  year    = {2016},
  doi     = {10.15252/embj.201592593},
  url     = {https://doi.org/10.15252/embj.201592593}
}

@article{FriedrichEtAl2021HSFMemory,
  author  = {Friedrich, Thomas and Oberkofler, Vicky and Trindade, Ines and Altmann, Simone and Brzezinka, Krzysztof and Lamke, Jorn and Gorka, Michal and Kappel, Christian and Sokolowska, Ewelina and Graf, Alexander and Skirycz, Aleksandra and Baurle, Isabel},
  title   = {Heteromeric {HSFA2}/{HSFA3} complexes drive transcriptional memory after heat stress in {Arabidopsis}},
  journal = {Nature Communications},
  year    = {2021},
  volume  = {12},
  pages   = {3426},
  doi     = {10.1038/s41467-021-23786-6},
  url     = {https://doi.org/10.1038/s41467-021-23786-6}
}

@article{OlasEtAl2021SAMHeatMemory,
  author  = {Olas, Justyna Jadwiga and Apelt, Federico and Annunziata, Maria Grazia and John, Sheeba and Richard, Sarah Isabel and Gupta, Saurabh and Kragler, Friedrich and Balazadeh, Salma and Mueller-Roeber, Bernd},
  title   = {Primary carbohydrate metabolism genes participate in heat-stress memory at the shoot apical meristem of {Arabidopsis thaliana}},
  journal = {Molecular Plant},
  year    = {2021},
  volume  = {14},
  number  = {9},
  pages   = {1508--1524},
  doi     = {10.1016/j.molp.2021.05.024},
  url     = {https://doi.org/10.1016/j.molp.2021.05.024},
  note    = {Read with the published 2024 correction DOI 10.1016/j.molp.2024.03.010}
}

@article{OlasEtAl2024SAMHeatMemoryCorrection,
  author  = {Olas, Justyna Jadwiga and Apelt, Federico and Annunziata, Maria Grazia and John, Sheeba and Richard, Sarah Isabel and Gupta, Saurabh and Kragler, Friedrich and Balazadeh, Salma and Mueller-Roeber, Bernd},
  title   = {Correction: Primary carbohydrate metabolism genes participate in heat-stress memory at the shoot apical meristem of {Arabidopsis thaliana}},
  journal = {Molecular Plant},
  year    = {2024},
  volume  = {17},
  number  = {4},
  pages   = {676},
  doi     = {10.1016/j.molp.2024.03.010},
  url     = {https://doi.org/10.1016/j.molp.2024.03.010},
  note    = {Published correction to DOI 10.1016/j.molp.2021.05.024}
}

@article{SuzukiEtAl2013SystemicAcclimation,
  author  = {Suzuki, Nobuhiro and Miller, Gad and Salazar, Carolina and Mondal, Hossain A. and Shulaev, Elena and Cortes, Diego F. and Shuman, Joel L. and Luo, Xiaozhong and Shah, Jyoti and Schlauch, Karen and Shulaev, Vladimir and Mittler, Ron},
  title   = {Temporal-spatial interaction between reactive oxygen species and abscisic acid regulates rapid systemic acclimation in plants},
  journal = {The Plant Cell},
  year    = {2013},
  volume  = {25},
  number  = {9},
  pages   = {3553--3569},
  doi     = {10.1105/tpc.113.114595},
  url     = {https://doi.org/10.1105/tpc.113.114595}
}

@article{ZandalinasMittler2021Routes,
  author  = {Zandalinas, Sara I. and Mittler, Ron},
  title   = {Vascular and nonvascular transmission of systemic reactive oxygen signals during wounding and heat stress},
  journal = {Plant Physiology},
  year    = {2021},
  volume  = {186},
  number  = {3},
  pages   = {1721--1733},
  doi     = {10.1093/plphys/kiab157},
  url     = {https://doi.org/10.1093/plphys/kiab157}
}

@article{BaoEtAl2014Hydropatterning,
  author  = {Bao, Yun and Aggarwal, Pooja and Robbins, Neil E. and Sturrock, Craig J. and Thompson, Mark C. and Tan, Han Qi and Tham, Cliff and Duan, Lina and Rodriguez, Pedro L. and Vernoux, Teva and Mooney, Sacha J. and Bennett, Malcolm J. and Dinneny, Jose R.},
  title   = {Plant roots use a patterning mechanism to position lateral root branches toward available water},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2014},
  volume  = {111},
  number  = {25},
  pages   = {9319--9324},
  doi     = {10.1073/pnas.1400966111},
  url     = {https://doi.org/10.1073/pnas.1400966111}
}

@article{RobbinsDinneny2018SenseByGrowth,
  author  = {Robbins, Neil E. and Dinneny, Jose R.},
  title   = {Growth is required for perception of water availability to pattern root branches in plants},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2018},
  volume  = {115},
  number  = {4},
  pages   = {E822--E831},
  doi     = {10.1073/pnas.1710709115},
  url     = {https://doi.org/10.1073/pnas.1710709115}
}

@article{OrosaPuenteEtAl2018ARF7,
  author  = {Orosa-Puente, Beatriz and Leftley, Nicola and von Wangenheim, Daniel and Banda, Jason and Srivastava, Anjil K. and Hill, Kristine and Truskina, Jekaterina and Bhosale, Rahul and Morris, Emily and Srivastava, Moumita and Kumpers, Britta and Goh, Tatsuaki and Fukaki, Hidehiro and Vermeer, Joop E. M. and Vernoux, Teva and Dinneny, Jose R. and French, Andrew P. and Bishopp, Anthony and Sadanandom, Ari and Bennett, Malcolm J.},
  title   = {Root branching toward water involves posttranslational modification of transcription factor {ARF7}},
  journal = {Science},
  year    = {2018},
  volume  = {362},
  number  = {6421},
  pages   = {1407--1410},
  doi     = {10.1126/science.aau3956},
  url     = {https://doi.org/10.1126/science.aau3956}
}

@article{OrmanLigezaEtAl2018Xerobranching,
  author  = {Orman-Ligeza, Beata and Morris, Emily C. and Parizot, Boris and Lavigne, Tristan and Babe, Aurelie and Ligeza, Aleksander and Klein, Stephanie and Sturrock, Craig and Xuan, Wei and Novak, Ondrej and Ljung, Karin and Fernandez, Maria A. and Rodriguez, Pedro L. and Dodd, Ian C. and De Smet, Ive and Chaumont, Francois and Batoko, Henri and Perilleux, Claire and Lynch, Jonathan P. and Bennett, Malcolm J. and Beeckman, Tom and Draye, Xavier},
  title   = {The xerobranching response represses lateral root formation when roots are not in contact with water},
  journal = {Current Biology},
  year    = {2018},
  volume  = {28},
  number  = {19},
  pages   = {3165--3173.e5},
  doi     = {10.1016/j.cub.2018.07.074},
  url     = {https://doi.org/10.1016/j.cub.2018.07.074}
}

@article{LakeEtAl2001MatureLeaves,
  author  = {Lake, Janice A. and Quick, W. Paul and Beerling, David J. and Woodward, F. Ian},
  title   = {Signals from mature to new leaves},
  journal = {Nature},
  year    = {2001},
  volume  = {411},
  pages   = {154},
  doi     = {10.1038/35075660},
  url     = {https://doi.org/10.1038/35075660}
}

@article{BaoEtAl2023StomatalDevelopment,
  author  = {Bao, Qin-Xin and Mu, Xin-Rong and Tong, Chen and Li, Cong and Tao, Wen-Zhe and Zhao, Sheng-Ting and Liu, Yu-Xin and Wang, Wan-Ni and Wei, Yu-Ting and Yu, Fu-Huan and Wang, Jing-Wen and Sun, Zhi-Lan and Fan, Bing-Ling and Sun, Jia and Wang, Chen and Loake, Gary J. and Meng, Lai-Sheng},
  title   = {Sugar status in preexisting leaves determines systemic stomatal development within newly developing leaves},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2023},
  volume  = {120},
  number  = {24},
  pages   = {e2302854120},
  doi     = {10.1073/pnas.2302854120},
  url     = {https://doi.org/10.1073/pnas.2302854120},
  note    = {Read with the published correction DOI 10.1073/pnas.2416561121}
}

@article{PNAS2024BaoCorrection,
  title   = {Correction for Bao et al., Sugar status in preexisting leaves determines systemic stomatal development within newly developing leaves},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2024},
  volume  = {121},
  number  = {37},
  pages   = {e2416561121},
  doi     = {10.1073/pnas.2416561121},
  url     = {https://doi.org/10.1073/pnas.2416561121}
}

@article{JiangEtAl2019GIPCSaltSensor,
  author  = {Jiang, Zhonghao and Zhou, Xiaoping and Tao, Ming and Yuan, Fang and Liu, Lulu and Wu, Feihua and Wu, Xiaomei and Xiang, Yun and Niu, Yue and Liu, Feng and Li, Chijun and Ye, Rui and Byeon, Benjamin and Xue, Yan and Zhao, Hongyan and Wang, Hsin-Neng and Crawford, Bridget M. and Johnson, Douglas M. and Hu, Chanxing and Pei, Christopher and Zhou, Wenming and Swift, Gary B. and Zhang, Han and Vo-Dinh, Tuan and Hu, Zhangli and Siedow, James N. and Pei, Zhen-Ming},
  title   = {Plant cell-surface {GIPC} sphingolipids sense salt to trigger {Ca2+} influx},
  journal = {Nature},
  year    = {2019},
  volume  = {572},
  pages   = {341--346},
  doi     = {10.1038/s41586-019-1449-z},
  url     = {https://doi.org/10.1038/s41586-019-1449-z}
}

@article{ChoiEtAl2014CalciumWave,
  author  = {Choi, Won-Gyu and Toyota, Masatsugu and Kim, Su-Hwa and Hilleary, Richard and Gilroy, Simon},
  title   = {Salt stress-induced {Ca2+} waves are associated with rapid, long-distance root-to-shoot signaling in plants},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2014},
  volume  = {111},
  number  = {17},
  pages   = {6497--6502},
  doi     = {10.1073/pnas.1319955111},
  url     = {https://doi.org/10.1073/pnas.1319955111}
}

@article{JungEtAl2016PhytochromeThermosensor,
  author  = {Jung, Jae-Hoon and Domijan, Mirela and Klose, Cornelia and Biswas, Surojit and Ezer, Daphne and Gao, Mingjun and Khattak, Asif Khan and Box, Mathew S. and Charoensawan, Varodom and Cortijo, Sandra and Kumar, Manoj and Grant, Alastair and Locke, James C. W. and Schafer, Eberhard and Jaeger, Katja E. and Wigge, Philip A.},
  title   = {Phytochromes function as thermosensors in {Arabidopsis}},
  journal = {Science},
  year    = {2016},
  volume  = {354},
  number  = {6314},
  pages   = {886--889},
  doi     = {10.1126/science.aaf6005},
  url     = {https://doi.org/10.1126/science.aaf6005}
}

@article{LegrisEtAl2016PhyBIntegration,
  author  = {Legris, Martina and Klose, Cornelia and Burgie, E. Sethe and Rojas, Cecilia Costigliolo and Neme, Maximiliano and Hiltbrunner, Andreas and Wigge, Philip A. and Schafer, Eberhard and Vierstra, Richard D. and Casal, Jorge J.},
  title   = {Phytochrome {B} integrates light and temperature signals in {Arabidopsis}},
  journal = {Science},
  year    = {2016},
  volume  = {354},
  number  = {6314},
  pages   = {897--900},
  doi     = {10.1126/science.aaf5656},
  url     = {https://doi.org/10.1126/science.aaf5656}
}

@article{RilligEtAl2025ConcurrentCFN,
  author  = {Rillig, Matthias C. and Lehmann, Anika and Mounts, Ian R. and Bock, Beatrice M.},
  title   = {Concurrent common fungal networks formed by different guilds of fungi},
  journal = {New Phytologist},
  year    = {2025},
  volume  = {246},
  number  = {1},
  pages   = {33--38},
  doi     = {10.1111/nph.20418},
  url     = {https://doi.org/10.1111/nph.20418},
  note    = {Letter and proposed research programme; deduplicated here, not primary evidence for a new claim}
}
```

### Taxonomy and EU/German applicability sources

```bibtex
@misc{DFG2024PlantFields,
  author = {{Deutsche Forschungsgemeinschaft}},
  title  = {Fachsystematik der DFG fuer die Jahre 2024--2028: Fachkollegium 2.12 Pflanzenwissenschaften},
  year   = {2024},
  url    = {https://www.dfg.de/de/ueber-uns/gremien/fachkollegien/fachsystematik/lebenswissenschaften-2-12},
  note   = {Official German field taxonomy; routing only}
}

@misc{EuroSciVoc16,
  author = {{Publications Office of the European Union}},
  title  = {European Science Vocabulary (EuroSciVoc), version 1.6},
  year   = {2025},
  url    = {https://op.europa.eu/en/web/eu-vocabularies/euroscivoc},
  note   = {Official EU multilingual routing vocabulary; routing only}
}

@misc{ANZSRC2020PlantFields,
  author = {{Australian Bureau of Statistics and Stats NZ}},
  title  = {Australian and New Zealand Standard Research Classification (ANZSRC), 2020},
  year   = {2020},
  url    = {https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/2020},
  note   = {Independent omission check; not normative for this EU/German project}
}

@misc{EU2024AIActPlantAudit,
  author = {{European Parliament and Council of the European Union}},
  title  = {Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence},
  year   = {2024},
  url    = {https://eur-lex.europa.eu/eli/reg/2024/1689/oj},
  note   = {Applicability sentinel only}
}

@misc{EU2016GDPRPlantAudit,
  author = {{European Parliament and Council of the European Union}},
  title  = {Regulation (EU) 2016/679},
  year   = {2016},
  url    = {https://eur-lex.europa.eu/eli/reg/2016/679/oj},
  note   = {Applicability sentinel only}
}

@misc{EU2001GMReleasePlantAudit,
  author = {{European Parliament and Council of the European Union}},
  title  = {Directive 2001/18/EC on the deliberate release into the environment of genetically modified organisms},
  year   = {2001},
  url    = {https://eur-lex.europa.eu/eli/dir/2001/18/oj},
  note   = {Applicability sentinel only; no release is authorised}
}
```

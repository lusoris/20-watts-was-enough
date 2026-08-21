# Biotechnology, chemistry, and process-systems transfer audit

<!-- markdownlint-disable MD013 -->

**Date:** 2026-08-21

**Scope:** environmental biotechnology, industrial biotechnology and bioprocess
engineering, plus the remaining chemistry and chemical-engineering gaps most
likely to be confused with AI mechanisms: metabolic control and flux allocation,
continuous-culture feedback, engineered consortia, ecological stability,
catalysis and reaction networks, autocatalysis and oscillation, coupled
separation, process intensification, mass transfer and scale-up, green chemistry,
circular material accounting, field bioremediation, adaptive evolutionary
failure, and measurement/operator limits.

**Ledger state:** primary-source audit only. Temporary `BTCP-T*` labels below are
recommendations for root review, not stable claim IDs. This audit creates no
candidate and changes no registry, coverage file, crosswalk, or bibliography.

**Purpose:** retain only source operations that transfer with the same state,
intervention, conservation boundary, feedback authority, timescale, and failure
mode. A resemblance in vocabulary is not transfer.

## Normative-source header

- **Normative context:** European Union and Germany are the default deployment
  context for lifecycle, circularity, waste, and recovered-material examples.
  International standards are used as accounting comparators, not empirical
  evidence.
- **Jurisdiction and authority:** Directive 2008/98/EC is EU law implemented
  through Member States. Commission Recommendations (EU) 2021/2279 and
  2026/510 are non-binding technical recommendations; Recommendation (EU)
  2022/2510 is the initial SSbD framework on which the 2026 revision builds.
  ISO 14040:2006, ISO 14044:2006, ISO 22095:2020, ISO 22095-2:2026, and
  ISO 59020:2024 are
  international standards; DIN EN ISO 14040:2021-02 and
  DIN EN ISO 14044:2021-02 are German/European adoptions. ECHA guidance is
  interpretive guidance, not legislation.
- **Snapshot and versions:** checked 2026-08-21. ISO lists ISO 14040:2006 and
  ISO 14044:2006 as current after 2022 confirmation; their published amendments
  are part of the current catalogue records. ISO 22095:2020 is published but its
  catalogue is at close-of-review stage and lists Amendment 1:2026.
  ISO 22095-2:2026 was published in January 2026. ISO 59020:2024 remains a
  published edition, but ISO marks it “to be revised” and lists a working-draft
  successor. The JRC published a revised Safe and Sustainable by Design
  framework in December 2025. Commission Recommendation (EU) 2026/510 of
  6 March 2026 then adopted that revised framework as a new voluntary point of
  reference while expressly creating no new Union legal obligations. The
  2026 Recommendation also notes that the Commission is revising PEF from the
  2021 recommendation, so a comparison must freeze the PEF/OEF method version it
  actually uses. The Waste Framework Directive reference below is the
  consolidated text of 2025-10-16. Official catalogue pages, rather than
  inaccessible paid clauses, support version/status statements.
- **Applicability hook:** the legal and contractual status of this project is
  unresolved. The Waste Framework Directive becomes relevant when a qualifying
  EU/Member-State actor handles waste or recovered substances; a standard becomes
  obligatory only through applicable law, permit, procurement, certification,
  or contract. Nothing in this audit is a compliance determination.

## Executive finding

No new principle or candidate survives this audit.

Biotechnology supplies unusually useful **intervention fixtures**, but not a new
architecture vocabulary. Dynamic metabolic regulation is feedback under a
scarce cellular-resource budget. A chemostat is an open material balance whose
dilution rate changes both residence time and selection. A turbidostat is an
output-feedback loop with an imperfect biomass proxy. Engineered consortia are
multi-population dynamical systems whose function, composition, and evolutionary
stability can diverge. Catalysis and separation add reaction, transport,
deactivation, fouling, holdup, and off-spec propagation. Remediation adds spatial
transport, incomplete observability, daughter products, long rebound horizons,
and regulatory endpoints. Each mechanism is valuable precisely because it makes
an AI claim easier to lose.

| Disposition | Result | Reason |
| --- | --- | --- |
| **Promote** | none | Every transferable state transition is already represented by an existing project principle/candidate or a mature control, optimization, reaction-engineering, separation, ecological, or lifecycle method. |
| **Retain as workstation fixtures** | eight adversarial test families below | They add conserved quantities, feedback authority, hidden gradients, ecological/evolutionary escape, sensor distortion, and lifecycle reversals that are absent from a loose analogy. |
| **Reject as distinct principles** | flux control, chemostasis, turbidostatic control, cross-feeding, autocatalysis, oscillation, catalytic activity, process intensification, circularity, and bioaugmentation | The nouns name substrates or established methods. None changes the normalized operation after the physical boundary is removed. |
| **Candidate edit** | none | The only plausible residuals route cleanly to Candidates 001, 003, 007, 011, 013, 014, and 019. Adding a biotechnology-branded candidate would duplicate them. |

The strongest result is negative: an AI design does not earn credit for
“metabolism,” “ecosystem,” “catalysis,” “continuous flow,” or “circularity.” It
must beat the mature null that can act on the same measured state with the same
actuators and total lifecycle budget. Equal performance is a loss for the novel
mechanism.

## Field-coverage disposition

This is a **field-centered audit for OECD 2.8 Environmental biotechnology and
OECD 2.9 Industrial biotechnology**. It directly treats engineered field
remediation, bioaugmentation/biostimulation, open-system recovery and rebound,
strain design, fermentation, continuous-culture control, bioprocess scale-up,
separation, and evolutionary production failure. Those two entries can therefore
be routed here as `dedicated`, while retaining the explicit gaps below: the
environmental-biotechnology sample is dominated by groundwater remediation and
does not exhaust wastewater, gaseous emissions, mining, marine systems, or
containment; the industrial-biotechnology sample does not exhaust cell therapy,
food fermentation, enzyme manufacture, or regulatory process validation.

The chemistry material is a **gap probe and engineering null**, not a chemistry
field census. The DFG board dispositions recommended after this audit are:

| DFG board | Disposition after this audit | Exact reason and remaining gap |
| --- | --- | --- |
| **3.11 Molekülchemie** | **unreviewed** | Catalytic kinetics and atom economy do not substitute for a synthesis-centered audit of method development, mechanism, selectivity, scope, stereochemistry, and molecular characterization. |
| **3.14 Analytische Chemie** | **adjacent only** | Sensor calibration, optical-density distortion, sampling, and mass closure are measurement constraints, but there is no field-centered treatment of chemical metrology, calibration hierarchy, detection/quantification limits, uncertainty, matrix effects, speciation, or interlaboratory comparability. |
| **3.15 Biologische Chemie und Lebensmittelchemie** | **adjacent only** | Metabolic control and engineered pathways provide biological-chemistry evidence, but molecular biochemistry is sampled narrowly and food chemistry is absent. |
| **3.16 Polymerforschung** | **unreviewed** | Membranes and catalyst supports are process components here; polymer synthesis, structure--property relations, processing, ageing, recycling chemistry, and polymer analytics are not audited. |
| **3.17 Theoretische Chemie** | **adjacent only** | Stoichiometric networks, microkinetics, scaling relations, and transport models are used as engineering formalisms, but electronic-structure theory, quantum chemistry, molecular dynamics, statistical mechanics, and method validation are not field-centered. |

These recommendations intentionally do not mutate the machine coverage record in
this scoped change. In particular, touching one board's method does not justify a
`dedicated` label for that board.

## Deduplication against durable project work

This audit was compared before translation with the
[process-engineering audit](2026-08-05-process-engineering.md), the
[chemistry/reaction-network audit](2026-08-05-chemistry-reaction-networks-proofreading.md),
the [microbial-ecology audit](2026-08-05-microbial-ecology-biofilms.md), the
[principle registry](../principle-registry.md), and all current candidate
contracts.

| Apparent novelty | Normalized operation | Existing destination or mature null | Residue retained here |
| --- | --- | --- | --- |
| metabolic flux allocation | allocate constrained capacity among competing pathways as state changes | P-001, P-006, P-007; constrained optimization, MPC, feedback linearization, robust control | source-grounded burden, conservation, and evolutionary-escape tests |
| chemostat/turbidostat “self-regulation” | material balance plus feedback on flow or environment | P-006/P-009; PID, MPC, state estimation, anti-windup | authority, washout, proxy drift, and actuator-saturation tests |
| stable consortium | maintain function across interacting populations, perturbation, invasion, and succession | P-004/P-008/P-011/P-013; ecological dynamics, robust control, redundancy | separate composition, function, recovery, and evolutionary stability |
| catalytic intelligence | change reaction rate/selectivity through a condition-specific pathway and active state | ordinary microkinetics, degree-of-rate-control analysis, optimization; P-010 only if physical co-design matters | hidden transport, deactivation, active-site inventory, and regeneration costs |
| autocatalytic learning | positive feedback with resource consumption and competition | P-004/P-006; replicator dynamics and ordinary amplification | parasite/shortcut takeover and substrate-depletion tests |
| oscillator clock | limit cycle or ecological oscillation under stated kinetics | P-006; established nonlinear dynamics and control | phase, amplitude, entrainment range, bifurcation, and stability tests |
| continuous/intensified process | couple reaction and separation with smaller buffers and faster propagation | process-engineering audit; Candidate 001 only for real online graph change | residence-time distribution, fouling, off-spec propagation, cleaning, surge-capacity tests |
| remediation “adaptation” | intervene in a spatial reaction/transport system and monitor recovery or rebound | P-003/P-007/P-009; reactive-transport estimation and receding-horizon control | daughter-product, mass-removal, lineage, oxygen-ingress, and rebound tests |
| circular AI | keep materials in loops or allocate chain-of-custody credits | material balances, LCA, PEF, ISO 22095/59020; P-009/P-013 | functional-unit, allocation, double-counting, energy, toxicity, and end-of-life tests |
| adaptive producer strain | select and reproduce variants under a production burden | P-004/P-009; evolutionary engineering and quality control; Candidates 007/019 | rare escape, lineage, seed-train, reset, and production-horizon tests |
| online biomass awareness | infer viable state from optical density or other process signals | Candidate 007 and Candidate 014; calibration, observers, sensor fusion | morphology, bubbles, fouling, sampling, lag, missingness, and operator-action tests |

The [chemistry audit](2026-08-05-chemistry-reaction-networks-proofreading.md)
already rejects autocatalysis as a synonym for intelligence and oscillation as a
synonym for reasoning. The [microbial audit](2026-08-05-microbial-ecology-biofilms.md)
already rejects quorum as consensus and composition as cognition. The
[process-engineering audit](2026-08-05-process-engineering.md) already treats
control, recycle, separation, RTO, MPC, faults, and flowsheet transitions. This
file does not reopen those names; it adds the bioprocess, field-remediation,
evolution, and measurement conditions under which their claims fail.

## Evidence and transfer discipline

### Evidence statuses

| Status | Meaning in this audit |
| --- | --- |
| **Formal/foundational** | an equation, theorem, or definition is valid only under its declared steady-state, rate-law, geometry, mixing, or control assumptions |
| **Controlled laboratory intervention** | an actuator was changed and a response measured in a bounded strain, reactor, catalyst, or community |
| **Pilot or field intervention** | a real site or industrially relevant process was perturbed, with stronger realism but weaker control over heterogeneity and confounding |
| **Authoritative method** | a regulator, standards body, or JRC document defines a method, term, or reporting expectation; it does not show empirical performance |
| **AI hypothesis** | the exact software/control translation proposed here; no source paper is counted as evidence that the translation benefits AI |

### Minimum transfer tuple

Every mechanism is normalized to

```text
<problem; source organization and scale; constrained resource; sensed state;
 causal intervention; information path; actuation authority; timescale;
 conservation boundary; failure boundary>
```

A translation is admissible only if the AI system preserves the causal
intervention and its limiting state. For example, a chemostat transfers as
controlled turnover of a finite inventory, not as “continuous learning”; a
catalyst transfers as a condition-specific change in a reaction path with
poisoning and regeneration, not as a smart reusable expert; and a consortium
transfers as interacting populations subject to invasion and composition drift,
not as a generic multi-agent diagram.

### Terms that must not be collapsed

- **Flux** is amount per area per time, or more generally a rate through a
  declared boundary. It is not importance, attention, or cooperation.
- **Yield** is product per consumed substrate; **titer** is product
  concentration; **productivity** is product per volume per time. Improving one
  need not improve the others.
- **Steady state** is time-invariance of chosen state variables under a stated
  boundary. It is not evolutionary stability or robustness to changed inputs.
- **Composition stability** keeps relative or absolute populations near a
  target. **Functional stability** keeps a declared transformation or service.
  **Evolutionary stability** prevents or tolerates fitter escape types. They are
  separate endpoints.
- **Catalytic activity**, **selectivity**, and **stability** are separate.
  Apparent intrinsic activity can be limited by external or internal transport.
- **Conversion**, **purity**, **recovery**, and **throughput** are not
  interchangeable separation metrics.
- **Bioaugmentation** adds organisms; **biostimulation** changes environmental
  resources or electron donors/acceptors. Neither by itself proves complete,
  durable, or safe contaminant removal.
- **Disappearance of a parent contaminant** is not mass removal. Sorption,
  dilution, displacement, incomplete daughter transformation, and later
  reoxidation/rebound remain alternatives.
- **Atom economy** is a stoichiometric property of a reaction. **PMI/E-factor**
  counts process material. **Circularity** describes looped material/value
  features. **Lifecycle impact** requires a functional unit, system boundary,
  inventories, allocation, and impact method. None substitutes for another.
- **Optical density** is an instrument response influenced by scattering,
  morphology, medium, path length, and instrument. It is not automatically dry
  mass, viable count, strain ratio, or productive biomass [@stevenson2016].
- **Automation** records or executes an operator's policy. It does not remove
  human choices about calibration, sampling, thresholds, overrides, cleaning,
  contamination response, and acceptable risk.

## Common equations and dimensional checks

These equations are audit contracts, not a claim that every system obeys the
simplest model. A fixture must state which terms are measured, inferred, held
constant, or deliberately misspecified.

### Stoichiometric and open-system balance

For concentration vector $c$ in a well-mixed control volume,

$$
\frac{dc}{dt}
= N r(c,u,\theta)
+ \frac{q}{V}\left(c_{\mathrm{in}}-c\right)
+ s_{\mathrm{ext}} .
$$

$c$ is mol/m$^3$; $N$ is the dimensionless stoichiometric matrix; $r$ is
mol/(m$^3$ s); flow $q$ is m$^3$/s; volume $V$ is m$^3$; and external
source/sink $s_{\mathrm{ext}}$ is mol/(m$^3$ s). Every term is a concentration
rate. The dilution rate is $D=q/V$ in s$^{-1}$ or h$^{-1}$, with no mixture of
time bases.

### Metabolic flux control

At a declared steady state, a local flux-control coefficient is

$$
C_{E_i}^{J}
= \frac{E_i}{J}\frac{\partial J}{\partial E_i},
\qquad
\sum_i C_{E_i}^{J}=1.
$$

$E_i$ is enzyme amount or activity in declared units and $J$ is a pathway flux,
so the coefficient is dimensionless. The summation theorem is a steady-state
result under the metabolic-control-analysis scaling assumptions; it is not a
universal claim that control is evenly distributed or constant across operating
points [@heinrich1974]. A perturbation that changes expression burden, cell
state, thermodynamic driving force, or network structure changes the local
coefficients.

### Chemostat and washout

For viable biomass $X$ and limiting substrate $S$,

$$
\frac{dX}{dt}
= \left(\mu(S)-D-k_d\right)X,
$$

$$
\frac{dS}{dt}
= D\left(S_{\mathrm{in}}-S\right)
- \frac{1}{Y_{X/S}}\mu(S)X.
$$

$X$ and $S$ are kg/m$^3$ (or another explicitly consistent concentration);
$\mu$, $D$, and decay $k_d$ are h$^{-1}$; and yield $Y_{X/S}$ is kg biomass per
kg substrate. The simple model predicts washout when net growth cannot match
dilution, but real cultures add maintenance, multiple substrates, retention,
biofilms, death, morphology, inhibition, and evolution [@novick1950;
@herbert1956].

### Turbidostat/output feedback

A realizable controller is bounded:

$$
D(t)
= \operatorname{sat}_{[D_{\min},D_{\max}]}
\left(
D_0 + K_p e(t) + K_i\int_0^t e(\tau)\,d\tau
\right),
\qquad
e(t)=\widehat X(t)-X_{\mathrm{set}}.
$$

$D$ is h$^{-1}$. If $e$ is kg/m$^3$, $K_p$ is
m$^3$/(kg h) and $K_i$ is m$^3$/(kg h$^2$). If the controller instead uses raw
optical density, the gains have instrument-specific units and $\widehat X$ must
not be claimed. Dead time, sampled measurement, pump quantization, anti-windup,
and safe washout bounds belong in the controller contract.

### Oxygen transfer and uptake

$$
\operatorname{OTR}
= k_La\left(C^{*}_{O_2}-C_{O_2}\right),
\qquad
\operatorname{OUR}=q_{O_2}X.
$$

$k_La$ is s$^{-1}$; oxygen concentrations are mol/m$^3$; OTR and OUR are
mol/(m$^3$ s); specific uptake $q_{O_2}$ is mol/(kg s) when $X$ is kg/m$^3$.
An average dissolved-oxygen probe can remain above its setpoint while cells
traverse local oxygen- or glucose-limited zones in a large vessel. Enfors and
colleagues measured such scale-dependent physiological responses in 22 m$^3$
*E. coli* fed-batch cultivation and a scale-down reactor [@enfors2001].

### Reaction network and catalytic control

For elementary reactions,

$$
\frac{dc}{dt}=N r(c,T,p,a),
$$

where $a$ is active-catalyst inventory. A condition-specific degree of rate
control can be written

$$
X_i
= \left.\frac{\partial\ln r}{\partial(-G_i/RT)}\right|_{G_{j\ne i}},
$$

where $G_i$ is the free energy of an intermediate or transition state in J/mol,
$R$ is J/(mol K), $T$ is K, and $X_i$ is dimensionless. It is a sensitivity at
the stated state, not proof of one timeless “rate-determining step”
[@campbell2001]. Scaling relations can constrain simultaneous optimization of
intermediate binding and activation barriers [@norskov2002].

### Internal transport limitation

For a first-order reaction in a porous slab with characteristic half-thickness
$L$,

$$
\phi=L\sqrt{\frac{k}{D_{\mathrm{eff}}}},
\qquad
\eta=\frac{\tanh\phi}{\phi}.
$$

$k$ is s$^{-1}$, effective diffusivity $D_{\mathrm{eff}}$ is m$^2$/s, and
$\phi$ and effectiveness factor $\eta$ are dimensionless. The expression for
$\eta$ is geometry- and rate-law-specific; a spherical pellet or nonlinear
kinetics requires the appropriate solution. Thiele's particle-size result and
Mears' reactor tests forbid interpreting an observed rate as intrinsic before
external and internal transport checks [@thiele1939; @mears1971].

### Separation, recovery, and fouling

For a membrane,

$$
J_v=\frac{Q_p}{A},
\qquad
L_p=\frac{J_v}{\Delta p_{\mathrm{TM}}},
\qquad
R_m=\frac{\dot m_{p,\mathrm{product}}}{\dot m_{f,\mathrm{product}}}.
$$

Permeate flux $J_v$ is m/s (often reported as L/(m$^2$ h)); permeate flow
$Q_p$ is m$^3$/s; area $A$ is m$^2$; transmembrane pressure
$\Delta p_{\mathrm{TM}}$ is Pa; hydraulic permeability $L_p$ is m/(Pa s); and
mass recovery $R_m$ is dimensionless. Purity needs a separate product mass
fraction. Critical-flux experiments show that operating regime and history
matter to fouling; “continuous” does not mean stationary or cleaning-free
[@field1995].

### Consortium dynamics and evolutionary escape

A generalized Lotka--Volterra approximation is

$$
\frac{dx_i}{dt}
=x_i\left(r_i+\sum_j a_{ij}x_j\right)-D x_i.
$$

$x_i$ is cells/m$^3$ or kg/m$^3$; $r_i$ and $D$ are h$^{-1}$; $a_{ij}$ has
units that make $a_{ij}x_j$ h$^{-1}$. The coefficients are effective,
environment-specific interactions, not universal causal edges.

For burdened producers $P$ and nonproducers $N$,

$$
\frac{dP}{dt}
=\left(\mu_P-D-\lambda\right)P,
\qquad
\frac{dN}{dt}
=\left(\mu_N-D\right)N+\lambda P.
$$

$\lambda$ is an escape-generation rate in h$^{-1}$. When $\mu_N>\mu_P$, rare
escape can dominate over an industrial production horizon even when the clone
was initially correct. Rugbjerg and colleagues experimentally observed multiple
genetic error modes and modeled production load plus escape rate in a
large-scale bioproduction simulation [@rugbjerg2018].

### Reactive transport for remediation

For aqueous contaminant concentration $C(\mathbf x,t)$,

$$
\frac{\partial C}{\partial t}
=\nabla\cdot\left(D_h\nabla C\right)
-\mathbf u\cdot\nabla C
-r(C,E,A,\theta)
+s(\mathbf x,t).
$$

$C$ is mol/m$^3$; hydrodynamic dispersion $D_h$ is m$^2$/s; pore-water velocity
$\mathbf u$ is m/s; reaction $r$ and source $s$ are mol/(m$^3$ s). Sorption,
immobile domains, gas phases, redox species, biomass, donor, acceptor, parent,
and daughter products require their own balances where material. A concentration
decline at one well does not close site mass.

### Green-chemistry and circular-material accounting

For a target product with stoichiometric coefficient $\nu_P$ and reactants $j$,

$$
\operatorname{AE}
=\frac{\nu_P M_P}{\sum_j \nu_j M_j},
\qquad
\operatorname{PMI}
=\frac{m_{\mathrm{all\ input}}}{m_{\mathrm{product}}}.
$$

Atom economy AE and process mass intensity PMI are dimensionless (often
reported as percentages or kg/kg). AE excludes yield, solvent, catalyst,
work-up, utilities, hazard, and end of life; PMI includes process material only
within the declared boundary. Trost introduced atom economy as a reaction-design
criterion, not a lifecycle score [@trost1991].

A chain-of-custody claim needs two ledgers. Physical material obeys

$$
M_{\mathrm{physical,in}}
=M_{\mathrm{physical,out}}+M_{\mathrm{physical,loss}}
+\Delta M_{\mathrm{physical,inventory}},
$$

while eligible attributes obey, over one site and claim period,

$$
A_{\mathrm{eligible,in}}+A_{\mathrm{carried,in}}
=A_{\mathrm{allocated,out}}+A_{\mathrm{expired/lost}}
+A_{\mathrm{carried,out}}.
$$

$M$ terms are physical kg; $A$ terms are kg-equivalent attributes under one
declared eligibility and conversion rule. Allocation credits are accounting
attributes, not physical molecules, and can never exceed eligible input after
declared conversion losses. ISO 22095 supplies chain-of-custody terminology and
models; ISO 22095-2:2026 addresses mass-balance requirements. Neither makes an
impact claim without an LCA/PEF boundary.

## Mechanism audit

### 1. Metabolic control and dynamic flux allocation

**Source operation and evidence.** Heinrich and Rapoport's steady-state
analysis established that control of flux in an enzymatic chain is a property of
the system and operating point rather than an intrinsic label on one enzyme
[@heinrich1974]. Xu and colleagues then gave a controlled laboratory example of
dynamic pathway regulation: a malonyl-CoA-responsive transcriptional controller
balanced fatty-acid synthesis with cellular demand and improved the tested
production phenotype relative to their static designs [@xu2014]. The first is
foundational/formal under explicit assumptions; the second is a strain- and
pathway-specific intervention, not a universal design rule.

**Transferable mechanism.** Sense a scarce intermediate or capacity deficit;
actuate competing consumers or producers; keep essential host demand inside a
viability envelope; and evaluate the closed-loop transient, not only the final
product. The conserved budget and sensor/actuator causal path must remain.

**Exact AI translation.** A resource router measures backlog, memory pressure,
latency, thermal/power headroom, and task-quality deficits; it reallocates a
finite compute/memory/communication budget subject to service and safety
constraints. The intervention is a change in actual admission, scheduling, or
capacity—not a prompt that calls allocation “metabolism.” This maps to P-001,
P-006, P-007 and [Candidate 013](../../experiments/candidates/013-deficit-capability-routing.md).

**Strongest mature null.** Constrained optimization, backpressure scheduling,
ordinary feedback control, model-predictive control, or a fixed policy tuned on
the same traces with the same sensors, actuators, compute, and reserve. The
metabolic translation loses if one of these matches performance.

**Failure boundary.** A local flux coefficient is treated as globally fixed;
the controller starves maintenance; an unmeasured host burden moves the operating
point; sensor delay creates oscillation; greater titer hides lower yield or
productivity; or fitter nonproducing variants remove the control burden. Measure
substrate/product balances, viability, burden, rare escape, and transient
recovery.

### 2. Chemostat, turbidostat, and cybergenetic feedback

**Source operation and evidence.** The original chemostat formulation coupled
growth and dilution in an open culture [@novick1950], and Herbert, Elsworth, and
Telling developed and experimentally tested its continuous-culture theory
[@herbert1956]. eVOLVER demonstrated automated, parallel control of culture
conditions in laboratory yeast and bacterial systems [@wong2018]. Gutiérrez
Mena, Kumar, and Khammash used flow-cytometric composition measurements, external
PID control, and optogenetic growth actuation to hold or change the ratio of a
two-strain *E. coli* co-culture; after about 40 h (roughly 80 generations in
their conditions), drift consistent with escape mutations appeared despite the
controller [@gutierrezmena2022]. These are controlled apparatus/intervention
results, with no field or industrial-scale guarantee.

**Transferable mechanism.** Maintain turnover of a finite inventory while an
external controller measures a defined output and changes a bounded actuator.
Dilution controls residence time and selection as well as inventory. The sensor,
sampling interval, estimator, controller, actuator saturation, safe range, and
material balance are inseparable.

**Exact AI translation.** A service pool continuously admits and evicts work to
hold a calibrated operational state—such as verified queue age or recoverable
memory pressure—inside a band. The action is explicit admission/eviction or
capacity control. A turbidostat analogy is valid only if the measured output
drives the turnover actuator and proxy error is modeled. It maps to P-006/P-009,
[Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
and [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

**Strongest mature null.** Hysteresis control, PID with anti-windup, Kalman or
moving-horizon estimation plus MPC, or a fixed dilution schedule, each with
identical measurement and actuator limits.

**Failure boundary.** Washout; controller windup; valve/pump bias; aliasing from
slow sampling; raw optical density changing with morphology or bubbles;
contamination; wall growth; line blockage; actuator authority insufficient for a
growth-rate shift; or feedback deliberately sustaining selection for an
undesired type. Toprak and colleagues' morbidostat is the decisive warning:
closed-loop maintenance of growth inhibition was a tool for selecting resistance,
not preventing it [@toprak2012].

### 3. Consortia, cross-feeding, and ecological stability

**Source operation and evidence.** Shou, Ram, and Vilar constructed two yeast
populations whose exchanged metabolites created obligate mutual dependence and
observed viable co-culture over a range of initial conditions, along with
asymmetric and delayed starvation effects [@shou2007]. Gutiérrez Mena and
colleagues demonstrate that an otherwise unstable engineered two-strain ratio
can be stabilized by ordinary external feedback, but also that evolution can
eventually outrun that controller [@gutierrezmena2022]. Friedman, Higgins, and
Gore found scoped pairwise assembly rules in microbial microcosms
[@friedman2017]; the result does not license fixed pairwise coefficients in a
new environment. Fussmann and colleagues crossed a Hopf bifurcation in a live
chemostat predator--prey system [@fussmann2000], while Becks and colleagues
experimentally demonstrated chaos in a microbial food web [@becks2005]. These
are direct evidence that bounded ecological systems can be stable, oscillatory,
or chaotic depending on operating conditions—not that complexity is beneficial.

**Transferable mechanism.** Maintain a service by multiple interacting
populations with explicit exchange products, growth/decay, dilution, spatial or
mixing state, immigration/invasion, and lineage. Composition is a controlled
state only if a sensor and actuator exist; otherwise it is an outcome.

**Exact AI translation.** Multiple persistent model/tool populations exchange
typed artifacts under bounded interfaces, with per-population resource accounts
and a separately measured end-to-end task function. Perturb one population,
introduce a fast free-rider that consumes shared artifacts without producing
them, and test recovery. This maps to P-004, P-008, P-011, P-013 and Candidates
003/019; it is not evidence for a new “collective intelligence” principle.

**Strongest mature null.** One integrated model, a fixed modular pipeline,
ordinary ensemble selection, external PID/MPC over population shares, or robust
redundant services with explicit health checks.

**Failure boundary.** A target mixture persists while product flux collapses;
relative abundance hides total-population loss; pairwise interactions change
with medium or scale; a producer is invaded by a faster consumer; spatial
segregation blocks exchange; control needs an uncounted cytometer/operator; or
the function disappears after withdrawal of external stabilization. Require
absolute populations, exchanged-metabolite or artifact flux, function, recovery,
and lineage—not a single stacked-area plot.

### 4. Catalysis, reaction networks, and deactivation

**Source operation and evidence.** Campbell's degree-of-rate-control framework
formalized condition-specific sensitivity of overall rate to states in a
mechanism [@campbell2001]. Nørskov and colleagues found scaling relations linking
intermediate stability and activation energies for a stated class of
heterogeneous catalytic reactions [@norskov2002]. Thiele and Mears establish why
particle and reactor transport must be excluded before assigning intrinsic
kinetics [@thiele1939; @mears1971]. Hansen and colleagues directly imaged dynamic
shape changes in supported copper nanocrystals under reaction-relevant gas
conditions, making active state a changing population rather than an immutable
object [@hansen2002].

**Transferable mechanism.** Change the rate distribution among competing paths
by modifying a bounded, condition-dependent active state. Track active-site
inventory, reactant/product balances, temperature, pressure, transport,
selectivity, deactivation, regeneration, and side products.

**Exact AI translation.** A reusable transformation module changes the cost or
selectivity of a declared operation without being consumed per successful event,
but its capacity/state can poison, drift, deactivate, and require regeneration.
The closest AI object is a cached/indexed/compiled transformation whose measured
hit quality and capacity decay under workload shift. Only physical or structural
co-design routes to P-010; ordinary software reuse does not.

**Strongest mature null.** Automatic differentiation and local sensitivity,
microkinetic fitting, Bayesian optimization, robust design, memoization, a
compiled kernel, or a workload-specific fixed module under equal storage,
training, monitoring, and refresh cost.

**Failure boundary.** Rate improvement is mass-transfer or heat-transfer
artifact; selectivity worsens; active sites disappear; a poison or new workload
invalidates the state; regeneration consumes more energy/material than the saved
work; or a descriptor/scaling relation is extrapolated outside its chemical
class. A “catalyst agent” with no conserved active state, deactivation law, or
regeneration cost is only a metaphor.

### 5. Autocatalysis, selection, and oscillation

**Source operation and evidence.** Mills, Peterson, and Spiegelman's serial
transfer experiment used Q-beta replicase to select rapidly replicating RNA;
the selected molecules became shorter under the experimental selection regime
[@mills1967]. Sel'kov supplied a simple glycolytic kinetic model capable of
self-oscillation [@selkov1968]. Live chemostat experiments show Hopf crossing and
chaotic food-web dynamics [@fussmann2000; @becks2005]. Evidence status is
foundational laboratory selection plus nonlinear-model/controlled ecological
evidence; none establishes problem-solving intelligence.

**Transferable mechanism.** Autocatalysis is positive feedback coupled to a
finite substrate, dilution, decay, and competition. Oscillation is a limit-cycle
regime with amplitude, phase, period, entrainment range, and bifurcation
boundaries. Selection rewards measured replication/retention under the actual
environment, including shortcuts.

**Exact AI translation.** A self-amplifying proposal or policy receives more
compute because it increases a declared replication signal. The fixture must
introduce a shorter/cheaper parasite that scores the proxy while discarding task
function. For oscillation, use a phase-bearing scheduler only if phase and
entrainment improve a periodic workload over clocks, queues, and MPC. This maps
to P-004/P-006 and the already-audited oscillation/proofreading work.

**Strongest mature null.** Replicator dynamics, tournament selection, ordinary
boosting, rate limiting, a fixed-period scheduler, event-driven scheduling, or
MPC.

**Failure boundary.** Substrate depletion, runaway amplification, parasite
takeover, loss of diversity, cycle-to-cycle drift, period doubling/chaos,
unmodeled delay, or synchronized demand spikes. Amplification is not learning;
oscillation is not deliberation; persistence is not correctness.

### 6. Coupled separation and process intensification

**Source operation and evidence.** Yamamoto and colleagues directly coupled
hollow-fiber solid--liquid separation to an activated-sludge aeration tank, an
early membrane-bioreactor intervention [@yamamoto1989]. Warikoo and colleagues
demonstrated a laboratory integrated continuous platform linking perfusion cell
culture with sequential capture and downstream operations for recombinant
proteins [@warikoo2012]. Field and colleagues established the critical-flux
concept experimentally for microfiltration fouling [@field1995]. These studies
show scoped feasibility and operating behavior, not that continuous or
intensified operation dominates every batch process.

**Transferable mechanism.** Couple transformation and selection/separation so
material moves through smaller intermediate inventories and shorter feedback
paths. Preserve residence-time distributions, capacity, rejection, recovery,
purity, fouling/deactivation, cleaning, surge capacity, and off-spec routing.

**Exact AI translation.** Stream inference, verification, caching, and
commitment through a coupled service chain with bounded buffers and explicit
quarantine/rework paths. Only a runtime change to the active unit/stream graph
qualifies as [Candidate 001](../../experiments/candidates/001-adaptive-topology.md);
static pipelining or fusion is established systems engineering.

**Strongest mature null.** An optimized batch pipeline, fixed streaming graph,
microbatching, queue/backpressure control, or ordinary staged verification with
matched latency, reserve capacity, and recovery.

**Failure boundary.** One upstream upset contaminates all downstream material;
small buffers remove diagnostic/recovery time; filter fouling or capture
breakthrough changes residence time; startup/shutdown dominates useful
production; cleaning validation and disposables reverse the energy/material
benefit; or high throughput hides lower recovery and more off-spec output.

### 7. Mass transfer, mixing, and scale-up

**Source operation and evidence.** Enfors and colleagues compared 22 m$^3$
*E. coli* fed-batch operation with laboratory and scale-down systems, observing
physiological responses associated with large-scale mixing and feed-zone
gradients [@enfors2001]. Thiele and Mears provide complementary catalyst-scale
transport constraints [@thiele1939; @mears1971]. This is strong evidence that a
well-mixed small-scale result cannot be promoted by matching nominal averages.

**Transferable mechanism.** Local exposure histories—not merely vessel-average
inputs—drive state. Scale-up changes mixing time, transfer area, gradients,
sensor representativeness, shear, heat removal, and actuator distribution.

**Exact AI translation.** A distributed system fixture assigns each worker a
local history of queue delay, network bandwidth, stale parameters, thermal
throttling, and data composition while exposing the controller only aggregated
telemetry. A successful policy must remain safe when equal averages hide
different local trajectories. This sharpens Candidates 007, 012, and 014.

**Strongest mature null.** Local backpressure, placement-aware load balancing,
distributed MPC, stratified monitoring, or conservative worst-node limits.

**Failure boundary.** A global mean conceals local starvation/overload; a sensor
is placed in a well-behaved zone; scale-down omits the correct exposure
frequency; transport and reaction times are mismatched; or a policy trained in
homogeneous simulation fails under spatial/temporal gradients. Report full
exposure distributions and worst-zone constraint time, not only averages.

### 8. Green chemistry, circularity, and lifecycle accounting

**Source operation and evidence.** Trost's atom economy is a stoichiometric
reaction-design metric [@trost1991]. ISO 14040/14044 define LCA principles,
framework, requirements, and guidelines; Commission Recommendation
(EU) 2021/2279 recommends Environmental Footprint methods; the JRC Safe and
Sustainable by Design framework orders safety and lifecycle assessment for
chemicals/materials [@iso14040; @iso14044; @eu2021pef; @jrcssbd;
@jrcssbd2025; @eu2026ssbd]. ISO 22095 and
ISO 22095-2 define chain-of-custody/mass-balance approaches, while ISO 59020
addresses measurement of circularity performance [@iso22095; @iso220952;
@iso59020]. These are authoritative methods, not controlled evidence that a
particular circular process lowers impact.

**Transferable mechanism.** Define a functional unit and control volume; close
physical material and energy balances; separately record attribute credits;
declare allocation/substitution choices and time/geography; propagate
uncertainty; then compare lifecycle impacts and safety. Circular input fraction,
recovery fraction, and environmental impact remain separate outputs.

**Exact AI translation.** Account for embodied hardware, training, inference,
idle/reserve capacity, network, cooling, storage, maintenance, retraining,
operator labor, e-waste, and any reused-compute or renewable-energy attribute
credits per declared useful output. A shared GPU-hour credit cannot be allocated
twice. This is a maintenance/accounting constraint under P-009/P-013, not a new
“circular intelligence” mechanism.

**Strongest mature null.** ISO-conformant LCA or PEF study, material-flow
analysis, process-cost model, and ordinary chain-of-custody ledger with the same
data and uncertainty. Atom economy or a one-number carbon estimate is not a
strong enough comparator.

**Failure boundary.** Burden shifting across energy, toxicity, water, land, or
end of life; boundary truncation; double credit; implausible avoided-burden
assumption; wrong grid/time/location; recycled content with worse quality or
energy; allocation reversal; leakage; or a recovered substance failing product,
waste, REACH/CLP, permit, or contract requirements. The revised Commission
Recommendation (EU) 2026/510 is a voluntary decision framework with explicit
scoping, safety, environmental, socioeconomic, evaluation, and documentation
parts; it does not create new chemical-law obligations or make a high-level
design label a safety/sustainability conclusion [@eu2026ssbd].

### 9. Bioremediation, field heterogeneity, and rebound

**Source operation and evidence.** At a chlorinated-solvent field site, Major
and colleagues first used donor addition and recirculation, then bioaugmented
with the KB-1 consortium; their pilot reported transformation of PCE through
daughter products to ethene, spatial spread of the inoculum marker, and
concentrations below their stated target over the test horizon [@major2002]. At
a uranium-contaminated aquifer, Anderson and colleagues stimulated indigenous
*Geobacter* activity with acetate and measured uranium reduction
[@anderson2003]. Wu and colleagues later demonstrated the decisive boundary:
after sustained in-situ U(VI) bioreduction, dissolved-oxygen ingress caused
spatially variable reoxidation/rebound, and renewed electron-donor addition
restored reducing conditions [@wu2007]. These are field interventions, but
site-specific hydrogeology, chemistry, organisms, and monitoring prevent a
universal remediation rule.

**Transferable mechanism.** Combine spatially distributed sensing with a
causal intervention in resource/redox state; track parent, daughters, terminal
products, biomass/lineage where relevant, donor/acceptor, toxicity, mass removal,
and post-treatment rebound. Separate treatment-zone concentration control from
site inventory and durable risk reduction.

**Exact AI translation.** Intervene selectively in a partially observed,
spatially heterogeneous failure field, monitor transformation products rather
than only the alert that disappears, and require a long no-intervention recovery
horizon. This maps to P-003/P-007/P-009 and Candidates 003/007. The analogue is
valid only when the remediation-like action changes a measured causal state and
can produce delayed relapse.

**Strongest mature null.** Monitored natural attenuation, pump-and-treat or
physical removal in the source field; in the AI fixture, ordinary incident
response, rollback, isolation, data repair, and state-estimation MPC. Compare
equal monitoring, time, energy, and residual risk.

**Failure boundary.** Dilution/displacement is counted as destruction; toxic
daughter products are omitted; rebound starts after the reporting horizon;
injection moves contaminant outside sampled wells; donor causes secondary water
quality problems; organisms fail to distribute or persist; or the intervention
requires indefinite energy/material input. Kill any transfer whose apparent
benefit vanishes under a closed mass balance or extended monitoring.

### 10. Evolutionary failure of engineered production

**Source operation and evidence.** Rugbjerg and colleagues serially propagated
mevalonate-producing *E. coli* over industrially relevant population sizes and
generation counts, observed recurring structural pathway disruptions and loss
of production, and modeled escape generation plus the fitness advantage from
relieving production load [@rugbjerg2018]. Gutiérrez Mena and colleagues saw
late drift in their controlled co-culture consistent with escape mutations
[@gutierrezmena2022]. Toprak and colleagues showed that an external loop designed
to maintain antibiotic selection pressure efficiently discovers resistance
paths [@toprak2012]. Mills and colleagues show the broader proxy lesson: serial
selection rewarded shorter replicators under the imposed assay [@mills1967].

**Transferable mechanism.** Any replicated component under a costly desired
function creates selection for variants that retain replication/admission while
dropping the function. The key variables are burden, escape rate, population
size, generation horizon, bottleneck, detectability, and reset or lineage policy.

**Exact AI translation.** Repeatedly fine-tuned, copied, distilled, or selected
agents face a cheaper-policy escape path that preserves the benchmark/admission
signal while losing a costly safety or quality behavior. Track lineage and
function across generations, include rare seeded escape, and audit inherited
tests/configuration. This maps to P-004/P-009 and
[Candidate 019](../../experiments/candidates/019-audited-cumulative-inheritance.md),
with Candidate 007 for surveillance.

**Strongest mature null.** Immutable release artifacts, fixed verified models,
regression-gated CI, redundancy, essential-function coupling, lineage tracking,
periodic reseeding, and ordinary change control under matched cost.

**Failure boundary.** Aggregate mean hides a rare clone; assay frequency is
slower than takeover; the desired function is absent from the fitness/admission
criterion; a reset restores genotype but not contaminated state; bottlenecks
amplify drift; or production decline appears only after the experiment stops.
The fixture horizon must exceed the predicted takeover time with uncertainty.

### 11. Measurement, identifiability, and operator limitations

**Source operation and evidence.** Stevenson and colleagues showed why
microplate optical-density readings require instrument- and organism-appropriate
calibration, including nonlinear multiple-scattering effects [@stevenson2016].
eVOLVER and evotron demonstrate that automation can deliver calibrated,
repeatable actuation and sampling [@wong2018; @gutierrezmena2022], but their
success depends on apparatus, calibration, sample handling, software, and the
chosen measurand. The sources do not establish that one proxy identifies every
latent biological state.

**Transferable mechanism.** Treat the observation contract as a versioned
measurement model with units, calibration range, response time, sampling
location, missingness, interference, drift, and maintenance state. Record every
manual sample rejection, recalibration, override, alarm acknowledgement,
cleaning, inoculation, and recovery action.

**Exact AI translation.** A monitor exposes raw signal, calibrated estimate,
uncertainty, provenance, version, freshness, and known interference separately.
Policies are evaluated with and without operator rescue and under a frozen
operator-action budget. This maps directly to Candidates 007, 011, and 014.

**Strongest mature null.** Calibrated sensor fusion plus a state observer,
statistical process control, explicit human-in-the-loop runbook, and redundant
reference assays. A learned latent monitor must beat these at equal labels,
compute, calibration effort, and operator time.

**Failure boundary.** OD changes because cell size/shape changes; dead cells or
bubbles raise the signal; a sampling line lags or selects a subpopulation;
calibration is extrapolated; the controller reacts faster than the assay; an
operator silently discards bad points; a causal parameter is unidentifiable; or
offline ground truth is unavailable at deployment. A dashboard is not an
observer proof, and automation does not erase human authority.

## Exact AI transfer matrix

| Source operation retained | AI state and actuator required | Forbidden leap | Equal-budget mature comparator | Project destination |
| --- | --- | --- | --- | --- |
| metabolite-responsive flux allocation | measured resource deficit; explicit admission/scheduling/capacity actuator | call attention weights “metabolic flux” | constrained optimizer, backpressure, MPC | P-001/P-006/P-007; Candidate 013 |
| chemostatic turnover | finite inventory; admission and eviction/dilution authority | call continual updates “chemostasis” | fixed schedule, PID, MPC | P-006/P-009; Candidate 011 |
| turbidostatic output control | calibrated output estimate; bounded turnover actuator | treat raw utilization or OD as true productive state | observer plus PID/MPC | Candidates 007/014 |
| consortium exchange | persistent typed populations; measured exchange and end-to-end function | infer intelligence from coexistence or a stable ratio | monolith, fixed modules, ensemble, external controller | P-004/P-008/P-011/P-013 |
| catalytic path change | reusable but degradable transformation state; regeneration actuator | call any tool or expert a catalyst | compiled/cached fixed module, optimizer | P-010 only for real co-design |
| autocatalytic amplification | replication signal, finite resource, decay, parasites | equate amplification/selection with learning correctness | tournament/replicator/boosting | P-004/P-006 |
| limit-cycle coordination | phase/amplitude state; entrainment actuator | equate oscillation with cognition | event-driven or fixed-period scheduler, MPC | P-006; existing oscillation audit |
| intensified reaction/separation | coupled streaming stages, holdup, quarantine/rework authority | equate a pipeline with adaptive topology | optimized batch/fixed stream graph | Candidate 001 only if graph changes |
| spatial remediation | distributed latent failure state; intervention and rebound observation | count disappearance of an alert as repair | rollback, isolation, state estimation | P-003/P-007/P-009; Candidate 003/007 |
| producer evolutionary escape | replicated lineage, costly function, admission signal, reset | assume repeated selection preserves expensive behavior | immutable release plus CI/change control | P-004/P-009; Candidate 019 |
| circular material ledger | physical and attribute ledgers, functional unit, allocation rules | call reuse or lower operational watts lifecycle sustainability | LCA/PEF plus chain-of-custody accounting | P-009/P-013 |
| calibrated process observation | raw signal, measurement model, uncertainty, version, operator log | treat telemetry as ground truth | calibrated sensor fusion/SPC/runbook | Candidates 007/011/014 |

## Shared workstation experiment contract

The eight fixtures below are designs for a later executable harness. They are not
counted as workstation-executable until a manifest, runner, frozen environment,
seed pack, raw-output schema, and deterministic smoke test exist. A compliant
implementation must run on an ordinary workstation without proprietary plant or
laboratory software; synthetic truth is retained for causal scoring, while each
controller receives only its declared observations.

### Resource parity and analysis

1. Freeze a task generator, hidden-state simulator, perturbation schedule, and
   common random-number seed set before controller tuning. Use at least 100
   stochastic seeds for rare-escape/rebound fixtures unless a power calculation
   justifies another count.
2. Give every controller the same sampled measurements, actuator bounds, wall
   time, CPU/GPU allowance, memory, storage, lookahead, training episodes,
   calibration data, reset opportunities, and operator-minutes. Charge failed
   actions, rejected work, standby capacity, and retries.
3. Tune every comparator on the same development seeds. Keep a sequestered
   perturbation family for confirmatory evaluation, including parameter shifts
   beyond the training convex hull.
4. Predeclare one primary benefit metric, a smallest worthwhile difference
   $\delta$, non-inferiority margins for every safety/material constraint, and
   the familywise analysis. Report paired effects, uncertainty intervals, full
   seed distributions, and worst-case runs—not only a mean.
5. A novel controller wins only if the lower confidence bound of its paired
   improvement over the **best** mature comparator exceeds $\delta$, every hard
   constraint is met, and no lifecycle component is silently excluded. A tie is
   a rejection of novelty.
6. In deterministic simulations, normalized material/attribute balance residual
   must remain below $10^{-8}$ per integration step. In empirical replays, use a
   predeclared residual tolerance derived from sensor and inventory uncertainty;
   unexplained residual is an invalid run, not beneficial performance.
7. Run three operator regimes: no rescue, identical scripted rescue, and an
   equal-time-budget human/runbook comparator. Log intervention timestamp,
   information available, action, reason, and downstream consequence.

### Common lifecycle vector

Retain components until explicit value weights are declared:

$$
\mathbf C_{\mathrm{life}}=
\left[
E_{\mathrm{feedstock}},E_{\mathrm{sterilize}},E_{\mathrm{mix}},E_{\mathrm{aerate}},
E_{\mathrm{separate}},E_{\mathrm{clean}},E_{\mathrm{compute}},E_{\mathrm{idle}},
M_{\mathrm{virgin}},M_{\mathrm{aux}},M_{\mathrm{water}},M_{\mathrm{waste}},
M_{\mathrm{emission}},A_{\mathrm{land}},T_{\mathrm{down}},H_{\mathrm{operator}},
C_{\mathrm{capital}},R_{\mathrm{harm}}
\right].
$$

Energy entries are J; material/water/emission entries are kg (water may also be
reported in m$^3$ with density/conversion stated); land occupation is m$^2$·year;
downtime and operator labor are h; capital cost is declared currency and year;
and harm risk states probability, consequence unit, population, and horizon.
Compute electricity includes host, accelerator, network, storage, cooling, and
idle allocation measured at the wall where practicable. Embodied hardware is
annualized only with declared utilization, lifetime, and allocation sensitivity.

For production fixtures the default functional unit is **1 kg on-spec product at
the facility gate** plus a separate service-quality endpoint. For remediation it
is **1 kg parent-equivalent contaminant transformed to declared acceptable
terminal products over a post-treatment rebound horizon**; concentration control
at one well is not the functional unit. For AI translations it is **1,000
accepted task outputs meeting a frozen quality and safety threshold**, with
rejected work still charged.

## Workstation fixtures

### F-BTCP-01 — FluxAlloc-Shift

**Question.** Does a metabolite-inspired dynamic allocator outperform ordinary
constrained resource control when demand, capacity, and observation quality
shift?

**Simulator and intervention.** Use a directed task network whose nodes consume
CPU-s, GPU-s, J, memory-byte-s, and input tokens to produce typed intermediates.
At 20%, 45%, and 70% of each episode, independently change input mix, one node's
capacity, and one sensor gain. The candidate senses a deficit vector and changes
admission/routing shares; it may not create capacity.

**Comparators.** Optimized fixed shares; deficit round-robin; backpressure;
primal--dual constrained allocation; and receding-horizon MPC using the same
model-identification budget.

**Metrics.** Accepted outputs/s; on-time fraction; Joules/accepted output;
GPU-s/accepted output; peak memory bytes; constraint-violation integral in
resource-unit·s; useful-intermediate yield; recovery time in s; allocation total
variation per hour; and starvation time per service class.

**Adversarial tests.** Delayed/noisy deficit sensor; oscillatory demand near the
controller bandwidth; correlated capacity loss; a maintenance task with no
immediate output reward; a high-scoring path that consumes a scarce intermediate;
and an unseen task type that reverses the local sensitivity ranking.

**Kill criteria.** Kill if the best conventional controller is within $\delta$
of primary useful throughput; if any hard service/resource constraint is worse;
if performance depends on a coefficient learned only at the nominal operating
point; or if maintenance starvation creates delayed failure. Surviving evidence
belongs to Candidate 013, not a new metabolic principle.

### F-BTCP-02 — CultureLoop-Proxy

**Question.** Can a proposed adaptive culture controller beat calibrated
observer-plus-PID/MPC when the output proxy and actuator drift?

**Simulator and intervention.** Integrate the chemostat equations with Monod
growth, death, substrate inhibition, actuator delay/quantization, wall biomass,
and a hidden productive fraction. Generate optical response
$y_t=\alpha_t X_t+\beta_t X_t^2+b_t+\epsilon_t$, with morphology-dependent
$\alpha_t$, bubbles/outliers $b_t$, and sampled reference assays. The controller
sets dilution and feed inside declared bounds.

**Comparators.** Fixed dilution; on/off turbidostat with hysteresis; calibrated
PI/PID with anti-windup; extended Kalman filter plus PID; and constrained MPC.

**Metrics.** Integrated absolute productive-biomass error in kg·h/m$^3$;
washout probability; substrate/product yield in kg/kg; productivity in
kg/(m$^3$ h); off-spec hours; dilution total variation; pump energy in J;
reference-assay count; and operator-minutes.

**Adversarial tests.** Abrupt cell-size change at constant viable biomass;
gradual OD gain drift; air bubbles; pump bias; sample-line delay; blocked outlet;
growth-rate jump; contamination; missing reference assays; and a setpoint above
physical actuator authority.

**Kill criteria.** Kill on any washout outside the allowed probability, hidden
use of true biomass, extrapolation beyond the calibration range, more operator
rescue than a comparator, or no benefit over observer-plus-MPC. A controller that
holds raw OD while productive biomass drifts has failed.

### F-BTCP-03 — Consortium-FATE

**Question.** Does a multi-population architecture preserve function and recover
from invasion better than a monolith or externally controlled modules?

**Simulator and intervention.** Combine resource balances with three producer or
helper populations, one exchanged intermediate, state-dependent interactions,
dilution, immigration, and stochastic birth of a nonproducing consumer. Expose
no true interaction coefficients. The candidate may change resource supply,
turnover, population admission, or exchange access within matched authority.

**Comparators.** Single integrated producer; fixed three-module pipeline; fixed
initial mixture; ordinary ensemble selection; external PID on measured shares;
and robust MPC over shares and exchange flux.

**Metrics.** End-to-end function units/h; absolute and relative population
error; exchanged-artifact mass balance; probability of functional survival;
time to free-rider takeover; return time after pulse loss; diversity; total
control effort; and Joules/function unit.

**Adversarial tests.** One helper knockout; changed resource that flips an
interaction sign; 0.01% free-rider seed; spatially restricted exchange;
measurement of composition without function; immigration; feedback delay; and
withdrawal of external stabilization.

**Kill criteria.** Kill if only composition is stable, if the monolith/fixed
pipeline or external PID/MPC matches function and recovery, if relative
abundance hides collapse in total population, or if function requires indefinite
unpriced controller/sensor support.

### F-BTCP-04 — CatalysisNet-Transport

**Question.** Does a catalytic-network-inspired optimizer find causal kinetic
improvements after transport, active-state change, and regeneration are exposed?

**Simulator and intervention.** Implement a reversible microkinetic network with
competing product routes, temperature-dependent rates, heat release, film
transfer, porous-slab effectiveness, site blocking, and
$da/dt=-k_d a+k_r u_{\mathrm{regen}}(1-a)$. The policy may choose catalyst/state,
temperature, feed, and regeneration subject to active-site, temperature, and
energy bounds.

**Comparators.** Degree-of-rate-control intervention; automatic-differentiation
local sensitivity; Bayesian optimization; global mixed-integer/nonlinear search;
and a robust fixed operating recipe.

**Metrics.** Moles target/s; conversion; target selectivity; yield; active sites
retained; hotspot exceedance; mol side product; regeneration material and J/mol
target; wall energy J/mol; and uncertainty-calibrated constraint violations.

**Adversarial tests.** Hide film limitation during training; change pellet size;
introduce poison; shift feed impurity; change exotherm/heat-transfer coefficient;
force regeneration downtime; and evaluate outside the learned descriptor range.

**Kill criteria.** Kill if the apparent rate gain disappears after intrinsic-rate
correction, if selectivity/thermal safety worsens, if uncharged regeneration or
active-site loss explains the result, or if a standard optimizer matches the
feasible Pareto front. Do not promote a software “catalyst” from this fixture.

### F-BTCP-05 — Intensified-Separation

**Question.** Does coupled continuous processing or adaptive topology beat an
optimized batch/fixed-flow process once residence time, fouling, cleaning, and
off-spec propagation are charged?

**Simulator and intervention.** Model a reactor, cell-retention membrane,
capture column, polishing step, surge tanks, quarantine, and rework/disposal.
Use tanks-in-series residence-time distributions, flux decline, breakthrough,
clean-in-place cycles, assay delay, and startup/shutdown inventory. Candidate 001
may switch real unit/stream edges; other policies may change setpoints only.

**Comparators.** Optimized batch; fixed continuous train; microbatch pipeline;
supervisory mode selector; and constrained MPC with the same installed standby
capacity.

**Metrics.** kg on-spec/h; purity mass fraction; recovery; yield; off-spec kg;
time-to-detect and time-to-isolate in h; product-at-risk kg; buffer/storage
volume m$^3$; pressure/flux; cleaning water/material kg; energy MJ/kg; downtime;
and capitalized installed capacity.

**Adversarial tests.** Feed impurity pulse shorter than assay delay; membrane
fouling; column breakthrough; valve stuck during reconfiguration; contaminated
recycle; utility loss; startup after cleaning; and simultaneous upstream upset
plus full quarantine buffer.

**Kill criteria.** Kill if a fixed train or planned mode selector matches the
candidate; if a graph switch loses inventory traceability or violates pressure,
purity, or containment; if off-spec/cleaning reverses the lifecycle benefit; or
if average throughput hides unacceptable product-at-risk. Only a surviving real
graph-change track belongs under Candidate 001.

### F-BTCP-06 — Remediation-Rebound

**Question.** Does intervention-aware control reduce durable contaminant mass and
risk under sparse sensing better than conventional remediation/state estimation?

**Simulator and intervention.** Use a two-dimensional heterogeneous
advection--dispersion--reaction grid with sorption and immobile domains. Track
PCE-like parent, sequential daughter products, terminal product, donor, oxygen,
biomass, and toxicity weights. Sparse wells report delayed/noisy samples. The
policy can place bounded donor, inoculum, extraction, or monitoring effort.

**Comparators.** No-action/monitored-natural-attenuation model; uniform donor;
fixed pump-and-treat; Bayesian state estimation plus receding-horizon control;
and a conservative hotspot rule.

**Metrics.** Total parent and daughter mol; toxicity-weighted inventory; kg
terminal product; mass-balance residual; plume area above threshold in m$^2$;
energy MJ/kg transformed; donor kg/kg; monitoring samples; maximum downgradient
concentration; rebound ratio after intervention stops; and operator-hours.

**Adversarial tests.** Oxygen intrusion after apparent success; unsampled fast
flow path; donor-induced mobilization; inoculum retention near the injection
well; sensor below quantification limit; daughter product more toxic than parent;
changed hydraulic gradient; and a rebound horizon longer than training.

**Kill criteria.** Kill if decline is dilution/displacement, if parent loss is
offset by daughters, if normalized mass residual exceeds tolerance, if benefit
reverses during the no-intervention horizon, if downgradient risk rises, or if
ordinary state-estimation MPC matches durable risk per lifecycle cost.

### F-BTCP-07 — Evolutionary-Escape

**Question.** Can an adaptive/inheritance design preserve a costly function over
a production horizon containing rare, faster escape variants?

**Simulator and intervention.** Use stochastic birth--death--mutation dynamics
for producer and multiple escape types, serial seed-train bottlenecks, burden
changes, assay sampling, false negatives, quarantine, reset/reseed, and inherited
configuration/tests. Seed both de novo mutation and one initially undetected rare
escape in confirmatory episodes.

**Comparators.** Static producer; burden-reduced design; essential-function
coupling; fixed immutable release with regression gate; scheduled reference
assay/reseed; and lineage-aware monitoring plus ordinary change control.

**Metrics.** Probability productive fraction falls below specification; median
and tail generations-to-loss; kg product; escape frequency; assay sensitivity
and lead time; false quarantine; discarded batches; reset cost; lineage coverage;
and J/kg on-spec.

**Adversarial tests.** Multiple error modes; mutation outside monitored locus;
fitness advantage only during scale-up; assay slower than takeover; bottleneck;
test deletion inherited as a “performance optimization”; and reset from a
contaminated seed or configuration.

**Kill criteria.** Kill if the horizon ends before the predicted takeover
distribution, if aggregate quality hides rare escape, if immutable CI/change
control matches preservation, if the desired function is absent from admission,
or if monitoring/reset cost reverses productivity. A survivor sharpens
Candidate 019; it does not create a biotechnology principle.

### F-BTCP-08 — Circular-Ledger

**Question.** Does a circular/reuse policy remain preferable after physical
balances, attribute allocation, uncertainty, safety, and lifecycle energy are
made explicit?

**Simulator and intervention.** Use a multi-period process graph with virgin,
recovered, downgraded, waste, and stock inventories; conversion losses;
chain-of-custody credits; electricity by time/location; equipment lifetime; and
uncertain impact factors. The policy chooses reuse, recovery, allocation, and
replacement, but cannot create physical mass or attribute credits.

**Comparators.** Atom-economy heuristic; PMI minimization; virgin linear system;
ordinary material-flow optimization; ISO/PEF-style consequential and
attributional variants; and robust optimization across allocation choices.

**Metrics.** Physical kg in/out/loss; credit balance; recycled input and output
fractions; service life; MJ/functional unit; kg CO$_2$e/functional unit; water;
hazard/toxicity indicators; waste; cost; data-quality score; and uncertainty
interval. Keep impact categories separate.

**Adversarial tests.** Double allocation of one credit; boundary shift to a
supplier; optimistic avoided burden; recycled feed with reduced life/quality;
regional grid reversal; stock accumulation presented as recycling; export of
waste; and a safety constraint that rules out the highest-circularity option.

**Kill criteria.** Kill if any physical or credit ledger fails, if the advantage
reverses under a plausible allocation/system boundary/grid mix, if function or
safety is non-equivalent, if more than one material impact category is hidden by
a scalar, or if ISO/PEF-style accounting finds no advantage over the linear null.

## Cross-fixture adversarial matrix

| Hidden assumption | Required attack | Required observable | Automatic rejection |
| --- | --- | --- | --- |
| conservation closes | inject known mass/credit imbalance and a displaced-but-not-destroyed state | per-species physical residual and separate attribute ledger | a controller benefits from unexplained loss or double credit |
| the sensor measures the target | drift gain, change morphology/mix, add outliers, delay samples | raw signal, calibration version, uncertainty, reference assay | policy needs hidden truth or calls proxy control success |
| average state represents local exposure | hold global mean fixed while changing spatial/temporal gradients | per-location exposure history and worst-zone constraint time | success exists only under well-mixed averages |
| feedback is stabilizing | sweep gain, delay, saturation, and plant growth; cross Hopf/washout boundaries | poles/return map where defined, overshoot, constraint time, recovery | oscillation, windup, washout, or resistance/escape is induced |
| function follows composition | hold population shares fixed while disabling exchange/product function | absolute abundance, exchange flux, end-to-end function | composition stays “stable” while function fails |
| desired function is evolutionarily retained | seed rare cheaper variants and extend the generation horizon | lineage frequency, per-lineage function, time-to-loss | aggregate assay misses takeover or test ends too early |
| rate is intrinsic | change mixing, film transfer, pellet/worker size, and thermal removal | intrinsic-rate correction, local temperature/concentration | gain disappears when transport is matched |
| process intensification lowers total cost | include startup, cleaning, off-spec, reserve, and recovery | complete lifecycle vector per functional unit | advantage depends on omitted buffers/disposables/downtime |
| remediation is durable | stop treatment and introduce oxygen/flow-path shift | parent, daughters, terminal product, toxicity, long rebound ratio | apparent removal reverses or moves outside the sampled zone |
| circularity implies lower impact | vary allocation, functional life, grid, substitution, and safety constraints | physical/credit balance and disaggregated impact categories | result reverses under a plausible declared scenario |
| automation removes operator dependence | replay no-rescue and equal-budget human/runbook arms | complete intervention log and operator-minutes | unpriced manual rescue is needed for success |

## Recommended ledger claims

These are the precise claims this audit recommends for later central-ledger
review. They are intentionally not written to the shared ledger in this scoped
change.

### BTCP-T01 — Flux control is distributed and operating-point dependent

- **Statement:** in a steady-state enzymatic chain satisfying metabolic-control
  analysis assumptions, control coefficients describe local system sensitivity;
  control is not an immutable property of one “rate-limiting” enzyme.
- **Evidence status:** established within the formal model and supported by the
  foundational analysis [@heinrich1974].
- **Disposition:** evidence input for P-001/P-006; no new principle.

### BTCP-T02 — Dynamic pathway regulation can beat tested static expression

- **Statement:** a malonyl-CoA-responsive controller improved the tested
  fatty-acid production design by dynamically balancing pathway and cellular
  demands; the result is construct- and condition-specific.
- **Evidence status:** controlled laboratory intervention [@xu2014].
- **Disposition:** fixture evidence for Candidate 013. Compare with bilevel
  strain optimization and ordinary feedback [@burgard2003].

### BTCP-T03 — Dilution is plant dynamics and selection pressure

- **Statement:** in continuous culture, dilution changes biomass/substrate
  inventory, residence time, washout boundary, and the relative fitness required
  for persistence; it is not merely a refresh frequency.
- **Evidence status:** foundational theory and experiment [@novick1950;
  @herbert1956].
- **Disposition:** P-006/P-009; measurement/control fixture only.

### BTCP-T04 — External feedback can stabilize composition without making the community self-governing

- **Statement:** external flow-cytometric measurement, PID computation, and
  optogenetic growth actuation stabilized and steered a two-strain laboratory
  co-culture for a bounded horizon; later drift was consistent with escape
  mutation.
- **Evidence status:** controlled laboratory intervention [@gutierrezmena2022].
- **Disposition:** strong null against “emergent consortium control”; Candidates
  007/011/014/019.

### BTCP-T05 — Composition, function, dynamical stability, and evolutionary stability differ

- **Statement:** engineered mutual dependence, externally controlled mixture,
  Hopf oscillation, and microbial chaos are all experimentally realizable in
  different systems; no one abundance statistic establishes functional or
  evolutionary stability.
- **Evidence status:** multiple controlled microbial systems [@shou2007;
  @gutierrezmena2022; @fussmann2000; @becks2005].
- **Disposition:** clarifies P-004/P-008/P-011/P-013; no new consortium
  principle.

### BTCP-T06 — Catalytic rate sensitivity is condition-specific and transport-qualified

- **Statement:** degree-of-rate-control attribution is local to a mechanism and
  operating state; measured reactor rate must be cleared of external/internal
  transport limitation before being called intrinsic.
- **Evidence status:** formal/foundational reaction engineering
  [@campbell2001; @thiele1939; @mears1971].
- **Disposition:** mature-null constraint, not an AI principle.

### BTCP-T07 — Active catalyst state can change during operation

- **Statement:** supported copper nanocrystal shape changed dynamically with the
  gas environment in atom-resolved imaging, so active material cannot always be
  treated as an immutable module.
- **Evidence status:** direct physical observation in a scoped catalytic system
  [@hansen2002].
- **Disposition:** deactivation/regeneration adversary for P-010 claims.

### BTCP-T08 — Autocatalytic selection rewards the assay, including shortcuts

- **Statement:** serial extracellular RNA replication selected faster, shorter
  replicators under the imposed environment; autocatalysis plus selection does
  not preserve an external desired function.
- **Evidence status:** foundational laboratory intervention [@mills1967].
- **Disposition:** adversarial fixture for P-004; duplicate of established
  selection/proxy failure.

### BTCP-T09 — Continuous integration is feasible but remains a coupled process

- **Statement:** membrane bioreactor and integrated continuous-bioprocess studies
  establish scoped feasibility; they do not remove fouling, residence-time,
  cleaning, recovery, startup, or off-spec constraints.
- **Evidence status:** controlled process demonstrations plus experimental
  fouling evidence [@yamamoto1989; @warikoo2012; @field1995].
- **Disposition:** process null; Candidate 001 only if the active graph changes
  online and survives conservation-qualified transitions.

### BTCP-T10 — Scale-up cannot be represented by nominal averages alone

- **Statement:** large-vessel mixing/feed gradients produced physiological
  histories not represented by an otherwise similar homogeneous laboratory
  condition.
- **Evidence status:** 22 m$^3$ and scale-down comparative intervention
  [@enfors2001].
- **Disposition:** adversarial observation/latency fixture for Candidates
  007/012/014.

### BTCP-T11 — Bioremediation endpoints require products, mass, space, and rebound

- **Statement:** field bioaugmentation can complete a chlorinated-solvent
  transformation under scoped site conditions, while uranium bioreduction can
  reverse with oxygen ingress; parent concentration at a single time/location is
  not a durable-removal endpoint.
- **Evidence status:** field interventions [@major2002; @anderson2003;
  @wu2007].
- **Disposition:** recovery-dynamics fixture for Candidates 003/007; no general
  adaptive-remediation principle.

### BTCP-T12 — Production burden plus escape rate can destroy engineered function

- **Statement:** multiple genetic disruptions that relieved a costly production
  function arose and expanded over industrially relevant experimental horizons;
  initial clone correctness is not evolutionary stability.
- **Evidence status:** controlled serial-propagation experiment and fitted
  population model [@rugbjerg2018].
- **Disposition:** strong evidence input for P-004/P-009 and Candidate 019.

### BTCP-T13 — Closed-loop challenge can select the undesired response

- **Statement:** dynamically maintaining antibiotic growth inhibition was an
  effective selection environment for resistance trajectories; “feedback” has no
  intrinsically beneficial direction.
- **Evidence status:** controlled laboratory evolution [@toprak2012].
- **Disposition:** universal adversary for P-006 and adaptive curricula.

### BTCP-T14 — Optical density needs an explicit measurement model

- **Statement:** microbial optical-density calibration depends on instrument and
  biological/medium conditions and becomes nonlinear through multiple
  scattering; OD alone is not viable or productive biomass.
- **Evidence status:** controlled calibration study [@stevenson2016].
- **Disposition:** direct evidence input for Candidates 007/014.

### BTCP-T15 — Reaction efficiency, circularity, and lifecycle impact are different ledgers

- **Statement:** atom economy is a reaction stoichiometric metric; chain of
  custody allocates physical or attributed material through a declared model;
  LCA/PEF assesses impacts per functional unit and boundary. No one metric proves
  the others.
- **Evidence status:** foundational metric plus authoritative standards/methods
  [@trost1991; @iso14040; @iso14044; @iso22095; @iso220952; @iso59020;
  @eu2021pef].
- **Disposition:** lifecycle gate under P-009/P-013; no new principle.

### BTCP-T16 — This audit creates fixtures, not a candidate

- **Statement:** after normalized-state and equal-budget deduplication, no
  mechanism in this audit changes a project architecture object independently of
  existing principles or Candidates 001/003/007/011/013/014/019.
- **Evidence status:** project synthesis, not an external empirical claim.
- **Disposition:** no candidate edit.

## Normative and authoritative source matrix

| Source and official link | Role at the 2026-08-21 snapshot | Applicability hook in this audit | Does not establish |
| --- | --- | --- | --- |
| [ISO 14040:2006](https://www.iso.org/standard/37456.html) | international LCA principles/framework; current after ISO confirmation, with Amendment 1:2020 listed | lifecycle-study structure when LCA is claimed or contractually required | that a particular biotech/AI option has lower impact |
| [ISO 14044:2006](https://www.iso.org/standard/38498.html) | international LCA requirements/guidelines; current after ISO confirmation, with amendments listed | functional unit, boundary, inventory, impact, interpretation, reporting/critical-review discipline as applicable | a single universal allocation or impact answer |
| [DIN EN ISO 14040:2021-02](https://www.dinmedia.de/de/norm/din-en-iso-14040/325953744) and [DIN EN ISO 14044:2021-02](https://www.dinmedia.de/en/standard/din-en-iso-14044/325953813) | German/European adoptions | German contract, procurement, certification, or study specification that invokes them | automatic statutory obligation for this project |
| [ISO 22095:2020](https://www.iso.org/standard/72532.html) | published chain-of-custody terminology and models; catalogue is at close of review and lists Amendment 1:2026 | claims that attributes/material provenance are transferred through a supply chain | lower environmental impact or physical identity under every model |
| [ISO 22095-2:2026](https://www.iso.org/standard/84427.html) | requirements/guidance for mass-balance chain-of-custody models | a mass-balance product/material claim that invokes this model | physical segregation or entitlement beyond the declared credit system |
| [ISO 59020:2024](https://www.iso.org/standard/80650.html) | published circular-economy measurement/assessment standard; ISO marks the edition “to be revised” and lists a working-draft successor | a declared circularity-performance assessment using the identified edition | lifecycle superiority, safety, or legal end-of-waste status |
| [Commission Recommendation (EU) 2021/2279](https://eur-lex.europa.eu/eli/reco/2021/2279/2021-12-30/eng) | non-binding recommendation on Product and Organisation Environmental Footprint methods; Recommendation (EU) 2026/510 notes a Commission revision process | EU-facing comparative environmental-footprint work using a frozen, declared PEF/OEF edition | legal compliance, an evergreen method version, or one impact-free circular option |
| [Commission Recommendation (EU) 2022/2510](https://eur-lex.europa.eu/eli/reco/2022/2510/oj) and [JRC 2022 framework DOI 10.2760/487955](https://doi.org/10.2760/487955) | historical non-binding initial Safe and Sustainable by Design R&I framework on which the 2026 revision builds | reproducing or comparing the initial testing-period method | that the initial edition is the current revised method or that high-level principles prove safety/sustainability |
| [JRC revised SSbD framework 2025, DOI 10.2760/5103785](https://doi.org/10.2760/5103785) and [Commission Recommendation (EU) 2026/510](https://eur-lex.europa.eu/eli/reco/2026/510/oj/eng) | current revised voluntary framework and its JRC technical basis; adds explicit scoping, supply-chain process risk, lifecycle, socioeconomic, trade-off/uncertainty, and documentation structure | current EU-facing SSbD method comparison for R&I actors electing or asked to use it | new Union chemical-law obligations, minimum legal compliance, or proof that one design is safe/sustainable |
| [Waste Framework Directive 2008/98/EC, consolidated 2025-10-16](https://eur-lex.europa.eu/eli/dir/2008/98/2025-10-16) | binding EU directive through Member-State implementation for actors/operations in scope | qualifying EU/German waste holder, treatment operation, recovery, or end-of-waste decision | product status or compliance without the facts, national implementation, and other applicable law |
| [ECHA Guidance on waste and recovered substances](https://echa.europa.eu/guidance-documents/guidance-on-reach) | official interpretive REACH guidance, not legislation | recovered-substance actors assessing REACH duties/exemptions and supply-chain information | a blanket exemption for recovered material or an AI-specific duty |

## Primary and authoritative DOI inventory

The DOI strings below were checked against publisher, PubMed, institutional, or
official EU/ISO records on 2026-08-21. They are reproduced as DOI-resolver links
so that later ledger work need not infer them from prose.

| Evidence family | Exact primary/foundational sources |
| --- | --- |
| metabolic control and strain optimization | [Heinrich & Rapoport 1974](https://doi.org/10.1111/j.1432-1033.1974.tb03318.x); [Burgard, Pharkya & Maranas 2003](https://doi.org/10.1002/bit.10803); [Xu et al. 2014](https://doi.org/10.1073/pnas.1406401111) |
| continuous culture and external feedback | [Novick & Szilard 1950](https://doi.org/10.1126/science.112.2920.715); [Herbert, Elsworth & Telling 1956](https://doi.org/10.1099/00221287-14-3-601); [Wong et al. 2018](https://doi.org/10.1038/nbt.4151); [Gutiérrez Mena, Kumar & Khammash 2022](https://doi.org/10.1038/s41467-022-32392-z); [Toprak et al. 2012](https://doi.org/10.1038/ng.1034) |
| consortia and ecological regimes | [Shou, Ram & Vilar 2007](https://doi.org/10.1073/pnas.0610575104); [Friedman, Higgins & Gore 2017](https://doi.org/10.1038/s41559-017-0109); [Fussmann et al. 2000](https://doi.org/10.1126/science.290.5495.1358); [Becks et al. 2005](https://doi.org/10.1038/nature03627) |
| catalysis and transport | [Campbell 2001](https://doi.org/10.1006/jcat.2001.3396); [Nørskov et al. 2002](https://doi.org/10.1006/jcat.2002.3615); [Thiele 1939](https://doi.org/10.1021/ie50355a027); [Mears 1971](https://doi.org/10.1021/i260040a020); [Hansen et al. 2002](https://doi.org/10.1126/science.1069325) |
| autocatalysis and oscillation | [Mills, Peterson & Spiegelman 1967](https://doi.org/10.1073/pnas.58.1.217); [Sel'kov 1968](https://doi.org/10.1111/j.1432-1033.1968.tb00175.x) |
| separation, intensification, and scale-up | [Yamamoto et al. 1989](https://doi.org/10.2166/wst.1989.0209); [Field et al. 1995](https://doi.org/10.1016/0376-7388%2894%2900265-Z); [Warikoo et al. 2012](https://doi.org/10.1002/bit.24584); [Enfors et al. 2001](https://doi.org/10.1016/S0168-1656%2800%2900365-5) |
| green chemistry and JRC method | [Trost 1991](https://doi.org/10.1126/science.1962206); [Caldeira et al. 2022](https://doi.org/10.2760/487955); [Garmendia Aguirre et al. 2025](https://doi.org/10.2760/5103785) |
| field remediation | [Major et al. 2002](https://doi.org/10.1021/es0255711); [Anderson et al. 2003](https://doi.org/10.1128/AEM.69.10.5884-5891.2003); [Wu et al. 2007](https://doi.org/10.1021/es062657b) |
| evolutionary production failure and measurement | [Rugbjerg et al. 2018](https://doi.org/10.1038/s41467-018-03232-w); [Stevenson et al. 2016](https://doi.org/10.1038/srep38828) |

## Audit-local BibTeX

These entries are audit-local and are not a stealth edit to the central
bibliography.

```bibtex
@article{heinrich1974,
  author = {Heinrich, Reinhart and Rapoport, Tom A.},
  title = {A Linear Steady-State Treatment of Enzymatic Chains: General Properties, Control and Effector Strength},
  journal = {European Journal of Biochemistry},
  year = {1974},
  volume = {42},
  number = {1},
  pages = {89--95},
  doi = {10.1111/j.1432-1033.1974.tb03318.x}
}

@article{burgard2003,
  author = {Burgard, Anthony P. and Pharkya, Priti and Maranas, Costas D.},
  title = {{OptKnock}: A Bilevel Programming Framework for Identifying Gene Knockout Strategies for Microbial Strain Optimization},
  journal = {Biotechnology and Bioengineering},
  year = {2003},
  volume = {84},
  number = {6},
  pages = {647--657},
  doi = {10.1002/bit.10803}
}

@article{xu2014,
  author = {Xu, Peng and Li, Lingyun and Zhang, Fuming and Stephanopoulos, Gregory and Koffas, Mattheos A. G.},
  title = {Improving Fatty Acids Production by Engineering Dynamic Pathway Regulation and Metabolic Control},
  journal = {Proceedings of the National Academy of Sciences},
  year = {2014},
  volume = {111},
  number = {31},
  pages = {11299--11304},
  doi = {10.1073/pnas.1406401111}
}

@article{novick1950,
  author = {Novick, Aaron and Szilard, Leo},
  title = {Description of the Chemostat},
  journal = {Science},
  year = {1950},
  volume = {112},
  number = {2920},
  pages = {715--716},
  doi = {10.1126/science.112.2920.715}
}

@article{herbert1956,
  author = {Herbert, D. and Elsworth, R. and Telling, R. C.},
  title = {The Continuous Culture of Bacteria; a Theoretical and Experimental Study},
  journal = {Journal of General Microbiology},
  year = {1956},
  volume = {14},
  number = {3},
  pages = {601--622},
  doi = {10.1099/00221287-14-3-601}
}

@article{wong2018,
  author = {Wong, Brandon G. and Mancuso, Christopher P. and Kiriakov, Szilvia and Bashor, Caleb J. and Khalil, Ahmad S.},
  title = {Precise, Automated Control of Conditions for High-Throughput Growth of Yeast and Bacteria with {eVOLVER}},
  journal = {Nature Biotechnology},
  year = {2018},
  volume = {36},
  pages = {614--623},
  doi = {10.1038/nbt.4151}
}

@article{gutierrezmena2022,
  author = {Gutiérrez Mena, Joaquín and Kumar, Sant and Khammash, Mustafa},
  title = {Dynamic Cybergenetic Control of Bacterial Co-Culture Composition via Optogenetic Feedback},
  journal = {Nature Communications},
  year = {2022},
  volume = {13},
  pages = {4808},
  doi = {10.1038/s41467-022-32392-z}
}

@article{toprak2012,
  author = {Toprak, Erdal and Veres, Adrian and Michel, Jean-Baptiste and Chait, Remy and Hartl, Daniel L. and Kishony, Roy},
  title = {Evolutionary Paths to Antibiotic Resistance under Dynamically Sustained Drug Selection},
  journal = {Nature Genetics},
  year = {2012},
  volume = {44},
  number = {1},
  pages = {101--105},
  doi = {10.1038/ng.1034}
}

@article{shou2007,
  author = {Shou, Wenying and Ram, Sri and Vilar, José M. G.},
  title = {Synthetic Cooperation in Engineered Yeast Populations},
  journal = {Proceedings of the National Academy of Sciences},
  year = {2007},
  volume = {104},
  number = {6},
  pages = {1877--1882},
  doi = {10.1073/pnas.0610575104}
}

@article{friedman2017,
  author = {Friedman, Jonathan and Higgins, Logan M. and Gore, Jeff},
  title = {Community Structure Follows Simple Assembly Rules in Microbial Microcosms},
  journal = {Nature Ecology \& Evolution},
  year = {2017},
  volume = {1},
  pages = {0109},
  doi = {10.1038/s41559-017-0109}
}

@article{fussmann2000,
  author = {Fussmann, Gregor F. and Ellner, Stephen P. and Shertzer, Kyle W. and Hairston, Nelson G.},
  title = {Crossing the {Hopf} Bifurcation in a Live Predator--Prey System},
  journal = {Science},
  year = {2000},
  volume = {290},
  number = {5495},
  pages = {1358--1360},
  doi = {10.1126/science.290.5495.1358}
}

@article{becks2005,
  author = {Becks, Lutz and Hilker, Frank M. and Malchow, Horst and Jürgens, Klaus and Arndt, Hartmut},
  title = {Experimental Demonstration of Chaos in a Microbial Food Web},
  journal = {Nature},
  year = {2005},
  volume = {435},
  pages = {1226--1229},
  doi = {10.1038/nature03627}
}

@article{campbell2001,
  author = {Campbell, Charles T.},
  title = {Finding the Rate-Determining Step in a Mechanism: Comparing {DeDonder} Relations with the Degree of Rate Control},
  journal = {Journal of Catalysis},
  year = {2001},
  volume = {204},
  number = {2},
  pages = {520--524},
  doi = {10.1006/jcat.2001.3396}
}

@article{norskov2002,
  author = {Nørskov, Jens K. and Bligaard, Thomas and Logadottir, Ashildur and Bahn, S. and Hansen, L. B. and Bollinger, M. and Bengaard, H. and Hammer, B. and Sljivancanin, Z. and Mavrikakis, Manos and Xu, Yun and Dahl, Søren and Jacobsen, Claus J. H.},
  title = {Universality in Heterogeneous Catalysis},
  journal = {Journal of Catalysis},
  year = {2002},
  volume = {209},
  number = {2},
  pages = {275--278},
  doi = {10.1006/jcat.2002.3615}
}

@article{thiele1939,
  author = {Thiele, Ernest W.},
  title = {Relation between Catalytic Activity and Size of Particle},
  journal = {Industrial \& Engineering Chemistry},
  year = {1939},
  volume = {31},
  number = {7},
  pages = {916--920},
  doi = {10.1021/ie50355a027}
}

@article{mears1971,
  author = {Mears, David E.},
  title = {Tests for Transport Limitations in Experimental Catalytic Reactors},
  journal = {Industrial \& Engineering Chemistry Process Design and Development},
  year = {1971},
  volume = {10},
  number = {4},
  pages = {541--547},
  doi = {10.1021/i260040a020}
}

@article{hansen2002,
  author = {Hansen, Poul L. and Wagner, Jakob B. and Helveg, Stig and Rostrup-Nielsen, Jens R. and Clausen, Bjerne S. and Topsøe, Henrik},
  title = {Atom-Resolved Imaging of Dynamic Shape Changes in Supported Copper Nanocrystals},
  journal = {Science},
  year = {2002},
  volume = {295},
  number = {5562},
  pages = {2053--2055},
  doi = {10.1126/science.1069325}
}

@article{mills1967,
  author = {Mills, D. R. and Peterson, R. L. and Spiegelman, S.},
  title = {An Extracellular {Darwinian} Experiment with a Self-Duplicating Nucleic Acid Molecule},
  journal = {Proceedings of the National Academy of Sciences},
  year = {1967},
  volume = {58},
  number = {1},
  pages = {217--224},
  doi = {10.1073/pnas.58.1.217}
}

@article{selkov1968,
  author = {Sel'kov, E. E.},
  title = {Self-Oscillations in Glycolysis. 1. A Simple Kinetic Model},
  journal = {European Journal of Biochemistry},
  year = {1968},
  volume = {4},
  number = {1},
  pages = {79--86},
  doi = {10.1111/j.1432-1033.1968.tb00175.x}
}
```

```bibtex
@article{yamamoto1989,
  author = {Yamamoto, Kazuo and Hiasa, Masami and Mahmood, Talat and Matsuo, Tomonori},
  title = {Direct Solid--Liquid Separation Using Hollow Fiber Membrane in an Activated Sludge Aeration Tank},
  journal = {Water Science and Technology},
  year = {1989},
  volume = {21},
  number = {4--5},
  pages = {43--54},
  doi = {10.2166/wst.1989.0209}
}

@article{field1995,
  author = {Field, R. W. and Wu, D. and Howell, J. A. and Gupta, B. B.},
  title = {Critical Flux Concept for Microfiltration Fouling},
  journal = {Journal of Membrane Science},
  year = {1995},
  volume = {100},
  number = {3},
  pages = {259--272},
  doi = {10.1016/0376-7388(94)00265-Z}
}

@article{warikoo2012,
  author = {Warikoo, Veena and Godawat, Rahul and Brower, Kevin and Jain, Sujit and Cummings, Daniel and Simons, Elizabeth and Johnson, Timothy and Walther, Jason and Yu, Marcella and Wright, Benjamin and McLarty, Jean and Karey, Kenneth P. and Hwang, Chris and Zhou, Weichang and Riske, Frank and Konstantinov, Konstantin},
  title = {Integrated Continuous Production of Recombinant Therapeutic Proteins},
  journal = {Biotechnology and Bioengineering},
  year = {2012},
  volume = {109},
  number = {12},
  pages = {3018--3029},
  doi = {10.1002/bit.24584}
}

@article{enfors2001,
  author = {Enfors, S.-O. and Jahic, M. and Rozkov, A. and Xu, B. and Hecker, M. and Jürgen, B. and Krüger, E. and Schweder, T. and Hamer, G. and O'Beirne, D. and Noisommit-Rizzi, N. and Reuss, M. and Boone, L. and Hewitt, C. and McFarlane, C. and Nienow, A. and Kovacs, T. and Trägårdh, C. and Fuchs, L. and Revstedt, J. and Friberg, P. C. and Hjertager, B. and Blomsten, G. and Skogman, H. and Hjort, S. and Hoeks, F. and Lin, H.-Y. and Neubauer, P. and van der Lans, R. G. J. M. and Luyben, K. Ch. A. M. and Vrábel, P. and Manelius, Å.},
  title = {Physiological Responses to Mixing in Large Scale Bioreactors},
  journal = {Journal of Biotechnology},
  year = {2001},
  volume = {85},
  number = {2},
  pages = {175--185},
  doi = {10.1016/S0168-1656(00)00365-5}
}

@article{trost1991,
  author = {Trost, Barry M.},
  title = {The Atom Economy---A Search for Synthetic Efficiency},
  journal = {Science},
  year = {1991},
  volume = {254},
  number = {5037},
  pages = {1471--1477},
  doi = {10.1126/science.1962206}
}

@article{major2002,
  author = {Major, David W. and McMaster, Margaret L. and Cox, Ernest E. and Edwards, Elizabeth A. and Dworatzek, Sandra M. and Hendrickson, Erik R. and Starr, Mark G. and Payne, John A. and Buonamici, Louis W.},
  title = {Field Demonstration of Successful Bioaugmentation to Achieve Dechlorination of Tetrachloroethene to Ethene},
  journal = {Environmental Science \& Technology},
  year = {2002},
  volume = {36},
  number = {23},
  pages = {5106--5116},
  doi = {10.1021/es0255711}
}

@article{anderson2003,
  author = {Anderson, Robert T. and Vrionis, Helen A. and Ortiz-Bernad, Irene and Resch, Charles T. and Long, Philip E. and Dayvault, Richard and Karp, Ken and Marutzky, Sam and Metzler, Donald R. and Peacock, Aaron and White, David C. and Lowe, Mary and Lovley, Derek R.},
  title = {Stimulating the In Situ Activity of {Geobacter} Species To Remove Uranium from the Groundwater of a Uranium-Contaminated Aquifer},
  journal = {Applied and Environmental Microbiology},
  year = {2003},
  volume = {69},
  number = {10},
  pages = {5884--5891},
  doi = {10.1128/AEM.69.10.5884-5891.2003}
}

@article{wu2007,
  author = {Wu, Wei-Min and Carley, Jack and Luo, Jian and Ginder-Vogel, Matthew A. and Cardenas, Erick and Leigh, Mary Beth and Hwang, Chiachi and Kelly, Shelly D. and Ruan, Chuanmin and Wu, Liyou and Van Nostrand, Joy and Gentry, Terry and Lowe, Kenneth and Mehlhorn, Tonia and Carroll, Sue and Luo, Wensui and Fields, Matthew W. and Gu, Baohua and Watson, David and Kemner, Kenneth M. and Marsh, Terence and Tiedje, James and Zhou, Jizhong and Fendorf, Scott and Kitanidis, Peter K. and Jardine, Philip M. and Criddle, Craig S.},
  title = {In Situ Bioreduction of Uranium ({VI}) to Submicromolar Levels and Reoxidation by Dissolved Oxygen},
  journal = {Environmental Science \& Technology},
  year = {2007},
  volume = {41},
  number = {16},
  pages = {5716--5723},
  doi = {10.1021/es062657b}
}

@article{rugbjerg2018,
  author = {Rugbjerg, Peter and Myling-Petersen, Nils and Porse, Andreas and Sarup-Lytzen, Kira and Sommer, Morten O. A.},
  title = {Diverse Genetic Error Modes Constrain Large-Scale Bio-Based Production},
  journal = {Nature Communications},
  year = {2018},
  volume = {9},
  pages = {787},
  doi = {10.1038/s41467-018-03232-w}
}

@article{stevenson2016,
  author = {Stevenson, Keiran and McVey, Alexander F. and Clark, Ivan B. N. and Swain, Peter S. and Pilizota, Teuta},
  title = {General Calibration of Microbial Growth in Microplate Readers},
  journal = {Scientific Reports},
  year = {2016},
  volume = {6},
  pages = {38828},
  doi = {10.1038/srep38828}
}

@standard{iso14040,
  author = {{International Organization for Standardization}},
  title = {{ISO 14040:2006 Environmental Management---Life Cycle Assessment---Principles and Framework}},
  year = {2006},
  url = {https://www.iso.org/standard/37456.html},
  note = {Current catalogue record checked 2026-08-21; Amendment 1:2020 listed}
}

@standard{iso14044,
  author = {{International Organization for Standardization}},
  title = {{ISO 14044:2006 Environmental Management---Life Cycle Assessment---Requirements and Guidelines}},
  year = {2006},
  url = {https://www.iso.org/standard/38498.html},
  note = {Current catalogue record checked 2026-08-21; amendments listed}
}

@standard{din14040,
  author = {{DIN}},
  title = {{DIN EN ISO 14040:2021-02 Environmental Management---Life Cycle Assessment---Principles and Framework}},
  year = {2021},
  url = {https://www.dinmedia.de/de/norm/din-en-iso-14040/325953744}
}

@standard{din14044,
  author = {{DIN}},
  title = {{DIN EN ISO 14044:2021-02 Environmental Management---Life Cycle Assessment---Requirements and Guidelines}},
  year = {2021},
  url = {https://www.dinmedia.de/en/standard/din-en-iso-14044/325953813}
}

@standard{iso22095,
  author = {{International Organization for Standardization}},
  title = {{ISO 22095:2020 Chain of Custody---General Terminology and Models}},
  year = {2020},
  url = {https://www.iso.org/standard/72532.html},
  note = {Catalogue record checked 2026-08-21; Amendment 1:2026 listed}
}

@standard{iso220952,
  author = {{International Organization for Standardization}},
  title = {{ISO 22095-2:2026 Chain of Custody---Part 2: Requirements and Guidelines for Mass Balance}},
  year = {2026},
  url = {https://www.iso.org/standard/84427.html}
}

@standard{iso59020,
  author = {{International Organization for Standardization}},
  title = {{ISO 59020:2024 Circular Economy---Measuring and Assessing Circularity Performance}},
  year = {2024},
  url = {https://www.iso.org/standard/80650.html}
}

@misc{eu2021pef,
  author = {{European Commission}},
  title = {Commission Recommendation ({EU}) 2021/2279 on the Use of the Environmental Footprint Methods to Measure and Communicate the Life Cycle Environmental Performance of Products and Organisations},
  year = {2021},
  url = {https://eur-lex.europa.eu/eli/reco/2021/2279/2021-12-30/eng}
}

@report{jrcssbd,
  author = {Caldeira, Carla and Farcal, Lucian R. and Garmendia Aguirre, Irantzu and Mancini, Lucia and Tosches, Davide and Amelio, Antonio and Rasmussen, Kirsten and Rauscher, Hubert and Riego Sintes, Juan and Sala, Serenella},
  title = {Safe and Sustainable by Design Chemicals and Materials---Framework for the Definition of Criteria and Evaluation Procedure for Chemicals and Materials},
  institution = {Publications Office of the European Union},
  year = {2022},
  number = {EUR 31100 EN; JRC128591},
  doi = {10.2760/487955},
  isbn = {978-92-76-53264-4},
  url = {https://publications.jrc.ec.europa.eu/repository/handle/JRC128591}
}

@report{jrcssbd2025,
  author = {Garmendia Aguirre, Irantzu and Abbate, Elisabetta and Bracalente, Giulio and Mancini, Lucia and Cappucci, Grazia Maria and Tosches, Davide and Rasmussen, Kirsten and Sokull-Kluettgen, Birgit and Rauscher, Hubert and Sala, Serenella},
  title = {Safe and Sustainable by Design Chemicals and Materials. Revised Framework (2025)},
  institution = {Publications Office of the European Union},
  year = {2025},
  number = {EUR 40399; JRC143022},
  doi = {10.2760/5103785},
  isbn = {978-92-68-30330-6},
  url = {https://publications.jrc.ec.europa.eu/repository/handle/JRC143022}
}

@misc{eu2022ssbd,
  author = {{European Commission}},
  title = {Commission Recommendation ({EU}) 2022/2510 Establishing a European Assessment Framework for Safe and Sustainable by Design Chemicals and Materials},
  year = {2022},
  url = {https://eur-lex.europa.eu/eli/reco/2022/2510/oj}
}

@misc{eu2026ssbd,
  author = {{European Commission}},
  title = {Commission Recommendation ({EU}) 2026/510 of 6 March 2026 on Revising the European Assessment Framework for Safe and Sustainable by Design Chemicals and Materials},
  year = {2026},
  number = {C/2026/1438},
  url = {https://eur-lex.europa.eu/eli/reco/2026/510/oj/eng}
}

@misc{eu2008waste,
  author = {{European Parliament and Council of the European Union}},
  title = {Directive 2008/98/{EC} on Waste and Repealing Certain Directives},
  year = {2008},
  url = {https://eur-lex.europa.eu/eli/dir/2008/98/2025-10-16},
  note = {Consolidated text of 2025-10-16, checked 2026-08-21}
}

@online{echawaste,
  author = {{European Chemicals Agency}},
  title = {Guidance on Waste and Recovered Substances},
  year = {2010},
  url = {https://echa.europa.eu/guidance-documents/guidance-on-reach},
  note = {Version 2, ECHA-10-G-07-EN, May 2010},
  urldate = {2026-08-21}
}
```

## Verdict

This field wave closes two genuine census gaps without manufacturing a new
principle. OECD 2.8 and 2.9 now have a field-centered primary-source audit; the
specified DFG chemistry boards remain adjacent or unreviewed exactly as declared
above. Chemistry and process engineering contribute the controlling nulls:
stoichiometry, kinetics, transport, separation, feedback, optimization,
measurement, safety, and lifecycle accounting already exist as mature methods.

The durable contribution is the test boundary. A mechanism must close physical
and attribute balances; expose its sensor and actuator authority; survive local
gradients, delay, saturation, fouling, invasion, mutation, and rebound; beat the
best conventional controller or optimizer with the same resources; and retain an
advantage after cleaning, monitoring, operator labor, embodied equipment,
separation, waste, and end-of-life costs. If it cannot, the biological or
chemical name is decoration.

Accordingly, the audit recommends the sixteen temporary ledger claims and eight
fixture contracts above, **no registry promotion, and no candidate edit**.

# Environmental engineering: water, waste, remediation, and delayed process state

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-24
- **Scope:** water and wastewater treatment; continuous-flow hydraulics and
  residence-time distributions; biological solids retention; integrated sewer,
  treatment-plant, and receiving-water control; process monitoring and
  maintenance; membrane fouling; adsorptive breakthrough; anaerobic digestion;
  oxidative transformation products; waste and resource recovery; lifecycle
  accounting, rebound, and centralised versus decentralised infrastructure
- **Evidence rule:** a concentration, load, stored mass, treatment conversion,
  parent-compound disappearance, effect endpoint, compliant service, and net
  lifecycle benefit are different records
- **Promotion state:** no new principle and no new candidate; nine scoped new
  boundaries are reserved as [C-1470](#c-1470--mean-residence-time-does-not-identify-contact-history)--C-1476
  and [C-1478](#c-1478--unit-efficiency-does-not-identify-net-service-level-benefit)--[C-1479](#c-1479--centralisation-level-is-a-topology--and-operations-dependent-decision).
  claim number `1477` remains unused because `ENV-T08` extends existing `C-1285`
- **Execution state:** ten CPU-only synthetic falsification contracts are
  frozen below as `ENV-T01`--`ENV-T10`; none is an implemented runner,
  simulation result, measured effect, or energy result
- **Repository constraint:** this standalone audit does not modify the central
  claim ledger, bibliography, audit index, field-coverage files, principle or
  candidate registry, generated site, experiment registry, or application code

## Executive finding

Environmental engineering does not supply a new generic intelligence primitive.
It supplies unusually strict operational tests for whether the project preserves
flow history, population lifetime, delayed feedback, measurement provenance,
maintenance state, material closure, service boundaries, and coupled-system
externalities.

Ten boundaries survive primary-source and authoritative-source review. Nine
reserve new claim IDs; boundary 8 adds evidence and a test to existing C-1285:

1. nominal hydraulic retention time does not identify the residence-time
   distribution, bypass, early escape, dead volume, recirculation, or reactive
   exposure;
2. hydraulic retention time and biological solids or population lifetime are
   not interchangeable when material is retained, recycled, attached, or
   selectively wasted;
3. local control can export load, delay, flooding risk, energy demand, or failure
   probability to another connected subsystem;
4. sensor anomaly, sensor fault, process disturbance, calibration state, and
   maintenance state are different records;
5. membrane fouling and usable flux depend on operating and cleaning history;
6. batch sorption capacity or a fixed removal percentage does not identify
   dynamic bed service life under transport, competition, ageing, and
   desorption;
7. buffering and slow biological state can hide approaching anaerobic failure
   from a pH-only monitor;
8. parent-compound disappearance is not mineralisation, attributable-mass
   closure, or proof of reduced biological effect;
9. unit-process efficiency or resource recovery does not identify net
   service-level benefit without a lifecycle counterfactual, substitution, and
   possible demand response; and
10. centralised and decentralised systems have context-dependent Pareto
    frontiers rather than one universal ordering.

The project should import these as stronger boundaries and falsification
families, not rename them as environmental principles. The surviving mechanism
families already exist in P-002, P-004--P-013 and in the held candidates for
recovery, endogenous observation, operational assurance, latency, deficit
routing, and versioned observation contracts.

## Exact scope and boundary

### In scope

- Municipal and industrial water or wastewater process systems at the level
  needed to test conservation, delay, state, topology, observability,
  maintenance, and service accounting.
- Continuous-flow reactors, tanks, reaches, recycle paths, dead zones, bypass,
  dispersion, and residence-time distributions.
- Suspended and retained biological populations, solids wasting, washout,
  recovery, and population selection.
- Coupled sewer, storage, pump, treatment, and receiving-water control.
- Calibration, sensor faults, process disturbances, anomaly isolation,
  maintenance records, and abstention under non-identifiability.
- Membrane resistance, fouling, cleaning, irreversible ageing, adsorptive-media
  breakthrough, competition, regeneration, and desorption.
- Anaerobic digestion, alkalinity, volatile fatty acids, gas variables,
  inhibition, and delayed overload signals.
- Parent compounds, products, mass and elemental closure, effect endpoints,
  post-treatment, and analytical censoring.
- Resource recovery, wastewater reuse, waste-management interfaces, lifecycle
  inventories, avoided burdens, substitution, rebound, and infrastructure
  topology.
- Formal transfer only at the level of a testable invariant. Shared vocabulary
  or metaphor is not evidence of a transferable mechanism.

### Out of scope

- No claim that an environmental analogy by itself predicts an AI improvement.
- No field, wet-lab, pilot-plant, health-risk, or regulatory-compliance result.
- No universal efficiency percentage, rebound coefficient, critical flux,
  adsorptive-media lifetime, indicator set, or optimal centralisation level.
- No legal opinion, conformity assessment, approval, permit, or certification.
- No non-European jurisdiction as the default normative baseline.
- No conversion of simulated process electricity into measured workstation or
  AI energy.
- No review article, encyclopedia, vendor material, or imported discussion used
  as scientific evidence.

## Normative-source header

- **Default jurisdiction:** European Union law and German implementation are
  the baseline. Scientific claims rely on primary research. Laws and standards
  constrain reporting, monitoring, risk management, and applicability; they do
  not establish the proposed cross-domain mechanism or effect size.
- **Urban wastewater snapshot:** Directive (EU) 2024/3019 establishes a recast
  urban-wastewater framework including integrated planning, monitoring, energy
  audits, and a progressive national-level energy-neutrality objective
  [@EU2024UrbanWastewater]. That objective is not a per-plant proof of net
  climate benefit. The directive explicitly warns that energy-neutrality
  initiatives should not increase methane or nitrous-oxide emissions.
- **Reuse snapshot:** Regulation (EU) 2020/741 sets minimum requirements for
  reclaimed water used for agricultural irrigation, including monitoring,
  permitting, responsibilities, and a water-reuse risk-management plan
  [@EU2020WaterReuse]. Commission Delegated Regulation (EU) 2024/1765 supplies
  technical specifications for the key risk-management elements of that plan
  [@EU2024WaterReuseRisk]. Both sources are normative-only here and must not be
  silently generalised to every reuse route or treated as evidence that a
  project mechanism improves outcomes.
- **Waste snapshot:** Directive 2008/98/EC and the German KrWG establish the
  waste hierarchy, resource-protection purpose, and environmentally compatible
  waste management [@EU2008WasteFramework; @GermanyKrWG]. They do not prove that
  a particular recovery route has a positive lifecycle result.
- **German water snapshot:** WHG sections 54--61 define wastewater disposal,
  permit, plant, and self-monitoring boundaries [@GermanyWHG]. WHG section 55
  permits decentralised domestic-wastewater disposal to serve public welfare
  where its conditions are met; it does not prefer decentralisation in every
  setting. The AbwV supplies minimum discharge and plant requirements while a
  permit may impose stricter conditions [@GermanyAbwV].
- **Lifecycle snapshot:** DIN EN ISO 14040:2021-02 and DIN EN ISO
  14044:2021-02 provide the current German lifecycle principles, framework,
  requirements, and guidance used here [@DINENISO14040_2021;
  @DINENISO14044_2021]. They do not supply a universal functional unit,
  allocation rule, grid mix, substitution rate, or rebound coefficient.
- **Control-standard hook:** European and German wastewater-control standards
  must be edition-checked immediately before implementation. The publication of
  EN 12255-12:2024 means that an older German national edition cannot be
  silently assumed current.
- **Applicability hook:** unresolved. A binding conclusion requires the exact
  plant, agglomeration, discharge or reuse route, waste classification,
  receiving water, permit, operator, competent German authority, standard
  edition, monitoring purpose, and intended decision. This document is neither
  legal advice nor a conformity assessment.

## Construct firewall

- **Concentration:** mass per volume, for example kg/m$^3$ or mg/L. It is not
  load, stored mass, exposure, or removal.
- **Load rate:** mass per time, for example kg/d or kg/s. Equal concentrations
  under different flows do not imply equal load.
- **Nominal hydraulic retention time:** $V/Q$. It is a mean-scale descriptor,
  not the residence-time distribution of material parcels.
- **Solids retention time:** retained biomass inventory divided by solids loss
  rate. It is not HRT and can itself be a distribution.
- **Removal:** declared change in a measured target across a boundary. It is not
  automatically destruction, mineralisation, transfer prevention, or safety.
- **Treatment conversion:** reaction or transformation under a declared species
  and mass boundary. Parent disappearance can produce unmeasured daughters.
- **Breakthrough:** time- or bed-volume-qualified effluent response. It is not a
  fixed material constant and does not equal batch capacity.
- **Critical flux:** an observed operating boundary under stated membrane,
  feed, hydrodynamic, time, and detection conditions. It is not a universal
  zero-fouling constant.
- **Sensor anomaly:** an observation that departs from a model or expected
  pattern. It is not automatically a sensor fault or process failure.
- **Maintenance event:** intervention that can change sensor, membrane, media,
  actuator, or model state. A maintenance recommendation and completed,
  verified maintenance are different records.
- **Recovered resource:** mass or energy leaving one process boundary in a
  potentially usable form. It is not automatically substituted virgin
  production or net lifecycle benefit.
- **Compliant service:** delivered quantity meeting the declared quality,
  location, time, reliability, and legal boundary. Process throughput alone is
  not service.
- **Rebound:** change in demand or system use caused by an intervention. Its
  direction and magnitude are empirical and context-dependent.
- **Decentralised:** a topology and responsibility arrangement, not a synonym
  for modular, local, resilient, inexpensive, or sustainable.

## Shared mathematical boundary

### Conservation precedes efficiency

For a declared constituent and time interval,

$$
M_{\mathrm{in}}-M_{\mathrm{out}}-\Delta M_{\mathrm{stored}}
-M_{\mathrm{destroyed}}+M_{\mathrm{formed}}=\varepsilon_M,
$$

where every term has the same mass unit and $\varepsilon_M$ is the numerical,
sampling, or model-closure residual. A reported removal efficiency without the
storage, transfer, daughter, and censoring terms is a smaller claim.

### Mean contact time is not a contact-time distribution

Let $E(t)$ be a normalized residence-time density,

$$
\int_0^\infty E(t)\,\mathrm dt=1,
\qquad
\tau=\int_0^\infty tE(t)\,\mathrm dt.
$$

For a first-order reaction with rate $k$ in s$^{-1}$ or d$^{-1}$,

$$
X=1-\int_0^\infty E(t)e^{-kt}\,\mathrm dt.
$$

Systems with the same mean $\tau$ can therefore have different conversion $X$,
early escape, and tails.

### Hydraulic and biological lifetimes are typed separately

$$
\mathrm{HRT}=\frac{V}{Q},
\qquad
\mathrm{SRT}=
\frac{M_X}{\dot M_{X,\mathrm{waste}}+\dot M_{X,\mathrm{effluent}}}.
$$

$V$ is liquid volume in m$^3$, $Q$ is flow in m$^3$/d, $M_X$ is retained
biomass in kg, and the denominator is biomass loss in kg/d. Recycle, attachment,
selective wasting, decay, and immigration can make one scalar SRT incomplete,
but they do not license replacing it with HRT.

### Fouling has recoverable and irreversible state

For a pressure-driven membrane,

$$
\Delta P=\mu J\left(R_m+R_c(t)+R_i(t)\right),
$$

where $\Delta P$ is Pa, viscosity $\mu$ is Pa s, flux $J$ is m/s, and membrane,
cake, and irreversible resistances $R_m,R_c,R_i$ are m$^{-1}$. A cleaning event
can reduce $R_c$ while leaving or increasing $R_i$.

### Service and lifecycle boundaries remain explicit

For intervention $a$ against counterfactual $0$,

$$
B_{\mathrm{net}}(a)
=B_{\mathrm{direct}}(a)+B_{\mathrm{upstream}}(a)
+B_{\mathrm{capital}}(a)-B_{\mathrm{avoided}}(a),
$$

and a potable-displacement ratio can be reported as

$$
D=\frac{P_0-P_a}{V_{\mathrm{reuse}}},
$$

where $P_0$ and $P_a$ are potable abstractions in m$^3$ under the counterfactual
and intervention, and $V_{\mathrm{reuse}}$ is delivered compliant reuse in
m$^3$. Neither $D=1$ nor a fixed rebound term is assumed.

## Evidence synthesis and proposed claim blocks

### C-1470 — Mean residence time does not identify contact history

In a non-ideal continuous-flow system, nominal hydraulic retention time $V/Q$
does not identify early escape, tailing, recirculation, dead volume, or reaction
exposure. Performance predictions therefore require a residence-time
distribution or an equivalent flow-history state. Danckwerts defined measurable
residence-time distributions and showed that systems with the same mean
residence time can differ in conversion and blending performance
[@Danckwerts1953RTD].

- **Evidence status:** established continuous-flow and reactor-design boundary.
- **Primary source:** `Danckwerts1953RTD`.
- **Source-domain boundary:** RTD does not by itself identify a reactive,
  multiphase, time-varying, or internally unobservable system.
- **Proposed AI translation:** queue dwell time, route history, and exposure
  distributions must remain distinct from mean latency when state or loss is
  path-dependent.
- **Efficiency mechanism:** retain a tested sufficient flow-history state rather
  than replaying every parcel or event.
- **Failure modes:** reactive or sorbing tracer; outlet-only non-identifiability;
  time-varying flow; sensor lag mistaken for dispersion; insufficient
  tanks-in-series family; unit mismatch.
- **Affected chapters:** 22, 30, 70, 80, and the regime-qualified flow and
  dimensional-analysis math notes.
- **Measurable prediction:** `ENV-T01` requires an RTD-aware mature model to
  reduce paired early-escape and conversion loss by at least 20% relative to an
  ideal $V/Q$ model on confirmation, with positive held-out transfer.
- **Speculative extension:** no particular neural memory, routing architecture,
  or universal RTD parameter is promoted.

### C-1471 — Hydraulic and biological residence times are different state variables

Where solids are retained, recycled, attached, or selectively wasted,
hydraulic retention time and biomass or solids retention time are not
interchangeable. Population selection, washout, and recovery depend on
biological lifetime and its history. SHARON exploited bounded growth-rate and
retention differences [@HellingaEtAl1998SHARON], and mechanistic work isolates
an SRT role in complete nitrification [@LiuWang2014SRT].

- **Evidence status:** established suspended-growth biological-treatment
  boundary.
- **Primary sources:** `HellingaEtAl1998SHARON`, `LiuWang2014SRT`.
- **Source-domain boundary:** temperature, oxygen, substrate, inhibition,
  immigration, biofilms, and granules can change selection; no universal SRT is
  asserted.
- **Proposed AI translation:** component lifetime, retention, replication,
  retirement, and population composition must not be inferred from request or
  token latency alone.
- **Efficiency mechanism:** allocate retention and renewal by function-specific
  lifetime instead of retaining all state equally.
- **Failure modes:** once-through system; biofilm age distribution collapsed to
  one scalar; measured SRT error; confounding by temperature or oxygen;
  washout attributed to one variable.
- **Affected chapters:** 10, 30, 40, 70, and 90.
- **Measurable prediction:** `ENV-T02` requires at least 25% lower ammonium-and-
  nitrite load-prediction loss for an explicit SRT-and-population model than for
  an HRT-only model; washout timing is a separately reported secondary outcome.
- **Speculative extension:** no organism guild or wastewater kinetic constant
  is imported as an AI design constant.

### C-1472 — Local control can export load to neighbouring subsystems

In coupled flow systems, a locally beneficial control action can move delay,
storage, flooding risk, pollutant load, energy demand, or failure probability
elsewhere. Control must therefore be evaluated over the coupled
sewer--plant--receiving-system boundary and its delays. A full-scale controller
in Wilhelmshaven jointly changed sewer pumping and plant inflow
[@SeggelkeEtAl2013IntegratedRTC]. BSM2 supplies a whole-plant benchmark
[@JeppssonEtAl2007BSM2], while full-scale ammonium-control work shows that even
energy comparison can be operationally difficult [@AmandEtAl2014AmmoniumControl].

- **Evidence status:** plausible general coupled-system boundary grounded in
  established full-scale and benchmark evidence; the project composition is
  unvalidated.
- **Primary sources:** `SeggelkeEtAl2013IntegratedRTC`,
  `AmandEtAl2014AmmoniumControl`; authoritative benchmark:
  `JeppssonEtAl2007BSM2`.
- **Source-domain boundary:** integrated control is not automatically superior;
  topology, forecasts, sensors, objectives, receiving waters, and actuators are
  site-specific.
- **Proposed AI translation:** locally optimized modules require a joint state,
  protected downstream constraints, delayed effects, and local safe fallback.
- **Efficiency mechanism:** act locally under ordinary conditions and escalate
  only when shared constraints or uncertainty require coordination.
- **Failure modes:** forecast error; communications loss; actuator saturation;
  omitted receiving-water state; scalar objective hides trade-offs; controller
  maintenance exceeds benefit.
- **Affected chapters:** 26, 30, 70, 80, and 90.
- **Measurable prediction:** `ENV-T03` requires at least 15% lower total
  receiving-water nitrogen load than independent local rules, with flooding,
  COD, compliance, and simulated electricity protected separately.
- **Speculative extension:** robust integrated MPC is the mature null; project
  hierarchy has no novelty if it cannot beat or resource-dominate that null.

### C-1473 — Measurement anomaly, sensor fault, and process disturbance are not synonyms

Reliable process monitoring requires sensor history, calibration and
maintenance state, multivariate process context, and explicit allowance for
non-identifiable fault or disturbance pairs. Wastewater data are nonstationary
and contain events on multiple timescales [@RosenLennox2001Monitoring]. A
full-scale Finnish study treated both instrument and process anomalies with
adaptive multivariate detection and isolation [@HaimiEtAl2016Anomaly].

- **Evidence status:** established process-monitoring and identifiability
  boundary.
- **Primary sources:** `RosenLennox2001Monitoring`, `HaimiEtAl2016Anomaly`.
- **Source-domain boundary:** successful anomaly detection in one plant does not
  supply universal fault isolation or authorize autonomous control.
- **Proposed AI translation:** observation records carry sensor/model version,
  calibration, maintenance, support, uncertainty, and an equivalence set when
  unique attribution is unsupported.
- **Efficiency mechanism:** use multivariate residuals and maintenance
  provenance to target recalibration or inspection instead of treating every
  anomaly as a system-wide failure.
- **Failure modes:** correlated faults; missing maintenance; adaptive model
  learns a slow fault; process change mimics drift; forced unique diagnosis;
  bad observation enters control before isolation.
- **Affected chapters:** 20, 25, 26, 30, and 70.
- **Measurable prediction:** `ENV-T04` requires at least 20% lower frozen
  false-alarm, delay, isolation, and unsafe-control loss than static univariate
  thresholds while preserving set-valued answers for non-identifiable cases.
- **Speculative extension:** no anomaly detector is promoted as a general
  reasoning architecture.

### C-1474 — Fouling state is path- and maintenance-dependent

Membrane resistance and usable flux depend on feed history, operating flux,
deposition, irreversible resistance, and cleaning sequence. Critical flux is an
operationally conditioned observation, not a universal material constant. The
concept was introduced under specified experimental conditions
[@FieldEtAl1995CriticalFlux], and repeated wastewater-effluent filtration and
cleaning produced accumulated irreversible resistance
[@ShanNeufeld2007Fouling].

- **Evidence status:** established scoped membrane-operation boundary.
- **Primary sources:** `FieldEtAl1995CriticalFlux`,
  `ShanNeufeld2007Fouling`.
- **Source-domain boundary:** membrane, hydrodynamics, temperature, feed,
  solids, chemistry, observation time, and cleaning all qualify the result.
- **Proposed AI translation:** maintenance, resets, compaction, and irreversible
  degradation must update state and remaining capability rather than merely
  clear an alert.
- **Efficiency mechanism:** condition cleaning and replacement on estimated
  recoverable and irreversible state instead of a fixed schedule.
- **Failure modes:** short test misses ageing; below-threshold operation treated
  zero fouling; aggressive cleaning shortens life; chemical burden omitted;
  shutdown time deleted.
- **Affected chapters:** 26, 40, 70, 80, and 90.
- **Measurable prediction:** `ENV-T05` requires at least 15% lower unmet-service
  and noncompliant-production loss than a fixed critical-flux or cleaning schedule without
  extra quality or pressure-limit violations.
- **Speculative extension:** no fixed cleaning percentage, flux threshold, or
  membrane lifetime is promoted.

### C-1475 — Batch capacity and fixed removal do not identify bed service life

In multicomponent adsorptive treatment, service life depends on transport,
competition, matrix composition, media age, loading history, breakthrough, and
possible desorption. Long-duration column tests show compound-specific
selectivity, breakthrough, matrix effects, and desorption
[@McCleafEtAl2017PFAS]. Seven-month pilot columns show chain-length-dependent
breakthrough and disagreement between batch- and pilot-derived behaviour
[@LiuWernerBellona2019PFAS].

- **Evidence status:** established scoped dynamic-adsorption boundary.
- **Primary sources:** `McCleafEtAl2017PFAS`,
  `LiuWernerBellona2019PFAS`.
- **Source-domain boundary:** the strongest evidence here is GAC/PFAS-specific;
  it does not establish every sorbent, matrix, or solute.
- **Proposed AI translation:** finite support stores require lineage, loading,
  competition, saturation, release, and replacement state rather than a fixed
  hit rate.
- **Efficiency mechanism:** sample and replace by predicted breakthrough risk
  and value of information rather than uniform intervals.
- **Failure modes:** analytical censoring; unmeasured competitors; batch-to-
  column extrapolation; regeneration release; scale-dependent hydrodynamics;
  one solute hides another.
- **Affected chapters:** 25, 40, 70, 80, and 90.
- **Measurable prediction:** `ENV-T06` requires at least 30% lower above-limit
  load than independent batch-isotherm or fixed-removal models; breakthrough-
  time error is a separately reported secondary outcome.
- **Speculative extension:** no PFAS-specific affinity becomes a general memory
  or routing constant.

### C-1476 — Buffering hides approaching anaerobic failure

In buffered anaerobic treatment, pH can respond later than precursor
accumulation. Reliable overload detection therefore requires delayed-state
inference from a context-dependent combination of volatile fatty acids,
alkalinity, gas variables, hydrogen, feed, and inhibition state. Controlled
disturbances show different sensitivity and delay across these indicators
[@BoeEtAl2010Indicators], while experimental work evaluates complementary
alkalinity, hydrogen, and microbial measures [@BjornssonEtAl2001Monitoring].
ADM1 is the mature multistep process null [@BatstoneEtAl2002ADM1].

- **Evidence status:** established scoped anaerobic-monitoring boundary.
- **Primary sources:** `BoeEtAl2010Indicators`,
  `BjornssonEtAl2001Monitoring`; mature model: `BatstoneEtAl2002ADM1`.
- **Source-domain boundary:** the best indicator set depends on reactor,
  substrate, temperature, inhibition, mixing, and assay availability.
- **Proposed AI translation:** buffered outputs can lag latent overload; control
  authority must depend on precursor state, delay, uncertainty, and safe
  fallback rather than one visible endpoint.
- **Efficiency mechanism:** allocate expensive assays only when cheap signals
  leave a consequential state ambiguity.
- **Failure modes:** hydrogen false alarm; VFA assay delay; sensor drift; model
  mismatch under ammonia or LCFA; unsafe actuation under broad uncertainty;
  recovery window truncated.
- **Affected chapters:** 25, 26, 30, 40, and 70.
- **Measurable prediction:** `ENV-T07` requires at least 25% lower dimensioned
  upset, lost-feed, and unsafe-action loss than pH-only protection, with
  calibrated uncertainty.
- **Speculative extension:** no universal indicator panel or pH trigger is
  proposed.

### Existing C-1285 extension — Parent disappearance is not destruction or safety

For transformative treatment, removal of a measured parent compound does not
by itself establish mineralisation, disappearance of attributable mass, or
reduction of biological effect. Pilot ozonation demonstrates strong but
compound-dependent parent removal [@HuberEtAl2005Ozonation]. Laboratory-to-
full-scale analysis identifies transformation products and age-dependent post-
treatment behaviour [@GuldeEtAl2021Products]. A German pilot study observes
toxicity changes after ozonation and differences among post-treatments
[@SchneiderEtAl2020Toxicity].

- **Evidence status:** established scoped transformation and effect boundary.
- **Primary sources:** `HuberEtAl2005Ozonation`, `GuldeEtAl2021Products`,
  `SchneiderEtAl2020Toxicity`.
- **Source-domain boundary:** not every transformation product is hazardous;
  target, non-target, elemental, and effect observations have different
  supports and uncertainties.
- **Proposed AI translation:** success on a named target does not close daughter
  states, displaced harm, side effects, or delayed outcome verification.
- **Efficiency mechanism:** use staged target, non-target, closure, and effect
  assays according to unresolved consequential mass or effect.
- **Failure modes:** parent-only endpoint; target list treated exhaustive;
  below-detection set to zero; elemental closure treated molecular safety;
  post-treatment age omitted; one bioassay universalized.
- **Affected chapters:** 20, 25, 26, 70, and 90.
- **Measurable prediction:** `ENV-T08` requires at least 25% fewer false-safe
  declarations than parent-removal-only decisions.
- **Claim disposition:** these sources and `ENV-T08` attach directly to existing
  `C-1285`. They do not reserve or consume claim number `1477`, which remains unused.

### C-1478 — Unit efficiency does not identify net service-level benefit

A resource-recovery or efficiency intervention must be evaluated against an
explicit service counterfactual and lifecycle boundary, including
infrastructure, operating inputs, direct emissions, substitution, and demand
response. Wastewater lifecycle inventories show material trade-offs
[@FoleyEtAl2010LCI]. Quasi-experimental recycling evidence shows that nominal
recycled-water production need not yield one-for-one potable displacement in
the studied setting [@MaierEtAl2022Recycling]. A primary irrigation study finds
no significant Jevons backfire after accounting for staggered adoption and
dynamics [@CameronHarpHendricks2025Efficiency].

- **Evidence status:** disputed for rebound sign and magnitude; established for
  the need to declare the lifecycle and service boundary.
- **Primary sources:** `FoleyEtAl2010LCI`, `MaierEtAl2022Recycling`,
  `CameronHarpHendricks2025Efficiency`.
- **Authoritative method:** `DINENISO14040_2021`,
  `DINENISO14044_2021`.
- **Source-domain boundary:** no California or irrigation estimate is
  transferred as a European wastewater constant.
- **Proposed AI translation:** efficiency claims require an explicit service
  denominator, counterfactual demand, upstream and capital inputs, displaced
  activity, direct emissions, and induced use.
- **Efficiency mechanism:** retain a versioned service ledger so a changed grid,
  demand, substitution, or policy state recomputes only affected terms.
- **Failure modes:** wrong counterfactual; double-counted avoided burden; static
  grid; hidden quality difference; leakage; post-hoc functional unit; unit-
  process result presented as net benefit.
- **Affected chapters:** 22, 26, 70, 80, and 90.
- **Measurable prediction:** `ENV-T09` requires at least 25% lower policy-
  selection regret from a service-level lifecycle/counterfactual model than
  from plant-gate efficiency or nominal one-for-one substitution.
- **Speculative extension:** no universal rebound coefficient and no single
  scalar sustainability score are proposed.

### C-1479 — Centralisation level is a topology- and operations-dependent decision

Neither centralised nor decentralised treatment is a universal environmental
or reliability winner. Density, topography, conveyance, reuse opportunity,
correlated hazards, maintenance access, operator capacity, spare parts, and
treatment requirements determine the feasible Pareto frontier. A primary LCA
comparison finds material context dependence [@RischEtAl2021Decentralisation].
WHG section 55 makes decentralised domestic-wastewater disposal legally
possible under suitable conditions [@GermanyWHG]; that is not empirical proof
of superiority.

- **Evidence status:** plausible context-qualified infrastructure boundary.
- **Primary source:** `RischEtAl2021Decentralisation`.
- **Authoritative constraints:** `GermanyWHG`, `EU2020WaterReuse`.
- **Source-domain boundary:** one LCA inventory does not identify every climate,
  density, treatment target, operator system, or common-cause hazard.
- **Proposed AI translation:** modularity and centralisation are selected under
  workload topology, communication, shared resources, operator capacity,
  common-cause failure, and service constraints.
- **Efficiency mechanism:** local service and fallback where it is cheaper and
  reliable, shared capacity and specialist maintenance where scale or
  assurance dominates.
- **Failure modes:** shared power or operator defeats nominal redundancy;
  average cost hides unequal outage; local reuse omits monitoring burden;
  central expertise omitted; maintenance access assumed; correlated failure
  treated independent.
- **Affected chapters:** 10, 26, 70, 80, and 90.
- **Measurable prediction:** `ENV-T10` requires at least 15% lower constrained
  architecture regret than central-only or fully local heuristics, with held-
  out urban, rural, and common-cause transfer.
- **Speculative extension:** no universal centralisation ratio or module size is
  proposed.

## Exact deduplication against the existing registry

- **C-1470:** P-012 memory matched to lifetime and P-013 external shared state;
  existing C-1303 and C-1381 already cover contact time, storage, load, and
  breakthrough. Add RTD evidence; do not add a "flow memory" principle.
- **C-1471:** P-004 diversity/select/protect, P-005 use-dependent topology,
  P-006 homeostatic negative feedback, and P-012 lifetime matching.
- **C-1472:** P-002 local first/escalate, P-006 feedback, P-008 compartmentalised
  interaction, P-011 transient communication, and P-013 shared state. It
  operationalises CAND-012, CAND-013, and CAND-014.
- **C-1473:** P-007 prediction-error allocation, P-009 maintenance plane, and
  P-013 shared state. It strengthens CAND-007, CAND-011, and CAND-014.
- **C-1474:** P-005, P-009, and P-012. Recovery fragility remains under
  CAND-003/CAND-005.
- **C-1475:** P-005, P-009, P-010 structural offloading, and P-012; it is also an
  operational refinement of C-1381.
- **C-1476:** P-006, P-007, P-009, and P-012. Delayed authority remains under
  CAND-012.
- **ENV-T08 / existing C-1285:** P-007, P-009, and P-013. The new sources and
  protocol extend C-1285; claim number `1477` remains unused.
- **C-1478:** P-013 plus compensation-aware recovery under CAND-005. Boundary-
  qualified upscaling already exists in C-1305.
- **C-1479:** P-002, P-008, P-009, and P-013; deficit routing remains under
  CAND-013.

No new principle or candidate is justified. The genuine residual gaps are
experimental contracts for RTD tails, HRT/SRT separation, maintenance-
conditioned state, competitive breakthrough, buffered delays, product/effect
closure, service counterfactuals, and operator-constrained topology.

## Common CPU-only protocol contract

The following rules are part of every `ENV-T` protocol. Every numeric effect,
coverage, closure, non-inferiority, and resource threshold is a preregistered
synthetic falsification tolerance or minimum detectable engineering effect. It
is not a measured effect, legal limit, recommended operating value, or imported
physical constant.

1. **Runtime and generator:** deterministic TypeScript/JavaScript under the
   repository's pinned Node.js runtime, PCG64-DXSM, canonical little-endian
   serialisation, SHA-256 world manifests, binary64 reference solvers, and no
   network access at run time. Parallel reductions sort by canonical world ID.
   `U(a,b)` is continuous uniform, $U_{\mathbb Z}\{a,b\}$ is inclusive discrete
   uniform, `logU` is log-uniform, and an unweighted categorical list is uniform;
   every draw is independent unless a dependence is stated. Event intervals are
   half-open. Rejection sampling consumes draws in the written field order,
   stops after 10,000 attempts, and then emits a retained generator failure with
   the track's terminal loss. Stable hashes resolve every tie and unordered set.
2. **Disjoint seed packs:** each track receives 64 public development seeds,
   128 registrar-sealed confirmation seeds from the same DGP family, and 64
   registrar-sealed transfer seeds from the separately stated family. Seed
   hashes are committed before development; keys remain unavailable until code,
   configuration, thresholds, and analysis are frozen.
3. **Independence unit:** one seed is one inferential cluster. Timesteps,
   sensors, solutes, reactors, storms, assets, faults, treatment episodes, and
   decisions inside a seed are repeated measures and cannot inflate $n$.
4. **Arms:** A is the tempting collapsed baseline; B is the strongest
   preregistered mature engineering null; C is the relevant composition of
   existing project principles or candidates. All arms see the same latent
   world through the same declared observation and actuator boundary. Oracle
   fields are evaluator-only. If additional assays are the tested resource,
   their count, latency, material, and cost are charged.
5. **Tuning:** A/B/C receive the same development worlds and declared tuning
   budget. Confirmation and transfer perform no model selection,
   hyperparameter search, threshold repair, seed deletion, or stopping-rule
   change.
6. **Primary estimand:** every track freezes one finite seed-level loss
   $L_{g,s}$, its native unit, observation horizon, denominator where one is
   used, and terminal-failure score before confirmation. For a required
   fractional reduction $r$, B versus A uses the shifted paired contrast

   $$
   D^{B:A}_s=L_{B,s}-(1-r)L_{A,s}.
   $$

   C versus B uses the analogous $D^{C:B}_s$. This avoids unstable ratios and
   remains defined when a comparator loss is zero: $L_A=L_B=0$ gives no
   improvement credit and cannot pass an improvement gate, while $L_A=0<L_B$
   fails. A resource route uses
   $D^{R,C:B}_s=R_{C,s}-(1-r_R)R_{B,s}$ in the resource's declared native unit.
   Loss and resource routes are never mixed in one scalar.
7. **Confirmatory calculation:** the seed-cluster mean of the applicable
   shifted contrast is the estimand. Confirmation uses a one-sided, centred
   cluster bootstrap-$t$: for track $j$, centre
   $e_{j,s}=D_{j,s}-\bar D_j$, resample the same seed indices jointly across all
   ten tracks, and calculate
   $T^*_{j,b}=\bar e^*_{j,b}/(s^*_{j,b}/\sqrt n)$. The observed statistic is
   $T_{j,obs}=\bar D_j/(s_{D,j}/\sqrt n)$. If
   $s^*_{j,b}=0$, set $T^*_{j,b}=0$ rather than mixing native-unit values across
   tracks. Exactly 20,000 replicates use
   `SHA256("ENV-v2|contrast|bootstrap")` as a 256-bit little-endian seed. The
   one-sided raw $p_j$ is
   $(1+\#\{T^*_{j,b}\le T_{j,obs}\})/(20000+1)$. Let
   $c_{0.01}$ be the empirical 0.01 quantile of
   $\min_jT^*_{j,b}$, using the conservative lower order statistic
   $\lceil0.01(20000+1)\rceil$. The simultaneous upper bound is
   $U_j=\bar D_j-c_{0.01}s_{D,j}/\sqrt n$. A zero-variance nonzero contrast uses
   its signed constant directly: negative has $p=1/(20000+1)$ and
   $U_j=\bar D_j$; positive has $p=1$ and $U_j=\bar D_j$. An all-zero contrast
   has $p=1$ and $U_j=0$. Holm controls the ten B-versus-A raw bootstrap-$t$
   $p$-values at familywise $\alpha=0.01$ and, separately, the ten C-versus-B
   values.

   A preregistered **symmetry sensitivity**, not the confirmatory randomization
   test, sign-flips the uncentred seed contrasts about the zero boundary and
   uses the same studentized statistic. It exhaustively enumerates all
   $2^n$ vectors only when $n\le20$; otherwise it uses exactly 100,000 distinct
   vectors without replacement from
   `SHA256("ENV-v2|track|contrast|sign")`. Its plus-one Monte Carlo value is
   $(1+N_{\le T_{obs}})/(100000+1)$ and is never called exact. Development
   reports skewness and type-I calibration under the frozen null DGP, so this
   sensitivity cannot silently substitute a symmetry assumption for the
   bootstrap gate.
8. **Boundary and novelty gates:** B passes confirmation only when its Holm-
   adjusted one-sided bootstrap-$t$ $p\le0.01$, the simultaneous 99% upper bound
   for $E[D^{B:A}_s]$ is **strictly below zero**, and all protected gates pass.
   On transfer, use the same contrast with $r/2$; its upper bound must also be
   strictly below zero and its prespecified one-sided $p\le0.01$. Before
   confirmation C selects either a 10% loss reduction or a 15% named-resource
   reduction. The resource route also freezes the paired primary-loss
   non-inferiority contrast
   $D^{NI,C:B}_s=L_{C,s}-L_{B,s}-0.01L^{max}_s$, where $L^{max}_s$ is that protocol's
   registered finite terminal-failure loss in the primary unit; its simultaneous
   99% upper bound must be at most zero. If $k$ tracks select a resource route,
   their $k$ NI contrasts form a separate preregistered family: the same joint
   seed resamples calculate the 0.01 quantile of the minimum of their
   dimensionless bootstrap-$t$ statistics, giving simultaneous 99% upper bounds
   across those $k$ gates (and no NI family when $k=0$). They are not silently
   inserted into, or omitted from, the ten selected novelty contrasts. The
   corresponding resource contrast and
   all other protected gates remain mandatory. Transfer uses half the selected
   improvement and half the 1% loss margin. Equality at an improvement margin,
   a failed protected gate, or an unselected post-hoc route kills novelty.
9. **Development-only sensitivity:** the 64 development seeds alone determine
   nuisance choices and a simulation-based power/sensitivity report for the
   frozen shifted contrast, including zero-heavy losses, 1%, 5%, and 10%
   contamination, and the registered terminal-failure score. The report states
   detectable effects at 80% power; it cannot change a threshold, seed count,
   loss, or exclusion after confirmation keys are released.
10. **Uncertainty:** DGP parameter variation is sampled at seed level. Proper
   interval score and coverage are reported wherever an arm emits uncertainty.
   Unbounded or non-finite intervals fail. A point estimate cannot replace an
   interval at a safety or compliance boundary.
11. **Feasibility:** eight development seeds form a shakedown. Projected limit
    per track is 8 wall-clock hours, 16 logical CPU cores, 32 GiB peak RAM, and
    40 GiB writable artifacts. A resolution change is permitted only on
    development, followed by a new manifest and complete freeze. More than 5%
    solver or numerical failures on confirmation makes the track infeasible.
12. **Failure retention:** every seed, abort, timeout, invalid result, and
    refusal remains in analysis. Arm-specific failure receives the frozen
    worst-case loss. Missing time after a simulated shutdown or breakthrough is
    not deleted.
13. **Stopping:** there is no optional early efficacy stop. All frozen seeds run
    unless a feasibility or protected structural failure terminates the track.
    The reason and remaining scheduled observations are persisted.
14. **Abstention:** abstention is a decision with nonzero loss. It invokes the
    frozen safe fallback and incurs its compute, delay, material, and service
    cost. Non-safety answer or action coverage may not fall more than one
    percentage point below B. An interval crossing a frozen safety or
    compliance boundary forces abstention.
15. **Protected failures:** unit mismatch, oracle leakage, confirmation tuning,
    omitted failed run, unauthorized real-world action, hidden threshold or
    version, broken conservation accounting, or presentation of simulated
    process energy as measured compute energy fails the track regardless of
    mean loss.
16. **Resource boundary:** report CPU-seconds, wall-seconds, peak resident bytes,
    bytes read and written, artifact bytes, assay count, chemicals in kg, media
    in kg, water in m$^3$, and operator time in h where applicable. Simulated
    process electricity is reported in kWh and labelled `simulated`.
    Workstation joules and carbon are `not measured`; no "20 W" compute claim is
    permitted without a separately preregistered calibrated power-meter
    boundary.
17. **Execution state:** a passing implementation would remain
    `protocol_complete`. No protocol below has been implemented or executed, and
    no result is reported in this audit.

## Ten falsification protocol specifications

### ENV-T01 — RTD, bypass, and flow-history contract

- **Claim:** `C-1470`.
- **Primary unit and units:** one supported continuous-flow graph with three
  independent tracer episodes; time (s, h, d), volume (m$^3$), flow
  (m$^3$/s), concentration (kg/m$^3$), mass (kg), and first-order rate
  (d$^{-1}$).
- **Frozen DGP:** sample the supported residence regime before geometry. Draw
  nominal $\tau_n\sim\operatorname{logU}(6,72)$ h, inlet
  $Q\sim\operatorname{logU}(0.01,1)$ m$^3$/s, and set total liquid volume
  $V=Q\tau_n$ after converting hours to seconds. Draw
   $N\sim U_{\mathbb Z}\{6,20\}$, bypass fraction $b\sim U(0,0.20)$,
   stagnant fraction $f_s\sim U(0.02,0.30)$, and recirculation ratio
   $r_c\sim U(0,0.60)$. Draw the active-compartment count
   $m\sim U_{\mathbb Z}\{3,N-1\}$. A Dirichlet$(2,\ldots,2)$ draw allocates
   $(1-f_s)V$ among active compartments in a serial chain; a second such draw
   allocates $f_sV$ among the $N-m$ side compartments. Main inlet and outlet
   flow are $(1-b)Q$, chain throughflow is $(1-b+r_c)Q$, the last-to-first
   recycle is $r_cQ$, and the direct inlet-to-outlet bypass is $bQ$. Each side
   compartment attaches to active node
   `1 + (uint64(SHA256(seed|side-ID)) mod m)` and exchanges equal bidirectional flow
   $q_{ex}=V_{side}/\tau_{ex}$ with
   $\tau_{ex}\sim\operatorname{logU}(0.25\tau_n,4\tau_n)$. This algorithm, edge
   order, and all draws are serialized before simulation. Resample if any
   compartment receives less than 0.5% of $V$, any flow is negative, or inlet,
   outlet, bypass, recycle, exchange, or node closure exceeds
   $10^{-12}$ m$^3$/s.
- **Frozen integration and horizon:** with $q_{i,out}$ the total advective and
  exchange outflow of node $i$, define
  $\tau_{fast}=\min_i V_i/q_{i,out}$. Draw reaction rate zero with probability
  0.2 and otherwise $k\sim\operatorname{logU}(0.01,2)$ d$^{-1}$. Use
  $\Delta t=\min(30\text{ s},\tau_{fast}/40,(1/k)/40)$ after converting every
  lifetime to seconds, omitting the last term when $k=0$, and reject a graph
  with $\tau_{fast}<5$ min. A preliminary conservative impulse runs until 99.9%
  recovery or 60 d, whichever comes first, to obtain latent $t_{99.9}$;
  ordinary worlds are resampled unless a finite $t_{99.9}\le30$ d is obtained.
  Each episode runs for
  $H=\max(10\tau_n,t_{99.9}+2\tau_n)$, capped at 60 d. At the cap, unrecovered
  mass and every unavailable RTD quantile are right-censored with the remaining
  stored mass recorded; they are never imputed or dropped.
- **Observation and episode map:** inject one conservative 1 kg calibration
  pulse, one conservative 1 kg evaluation pulse, and one reactive 1 kg
  evaluation pulse into separate zero-tracer initial states. Five-minute outlet
  observations have a seed-frozen first-order sensor lag $U(1,20)$ min and
  Gaussian standard deviation equal to $U(0.005,0.03)$
  of the episode peak; raw signed readings and the censor flag are retained.
- **Arms:** A uses ideal CSTR or plug flow with $V/Q$; B uses a tracer-calibrated
  tanks-in-series plus axial-dispersion model; C uses P-012/P-013 versioned graph
  and flow-history state.
- **Mature null:** B receives the calibration pulse and all declared flow
  observations, then fits only on development/calibration periods.
- **Transfer family:** held-out looped graphs, correlated storm inflows, and
  temperature-dependent rates; no transfer parameter is tuned on confirmation.
- **Primary metric and threshold:** for episode $p$, let $M^{early}_p$ be outlet
  mass by $0.25\tau_n$ and $M^{conv}_p$ be reacted mass at $H$. The seed loss is

  $$
  L_s=\sum_{p\in\{2,3\}}\left(
  |\widehat M^{early}_p-M^{early}_p|+
  |\widehat M^{conv}_p-M^{conv}_p|\right)\ \text{kg}.
  $$

   Evaluator truth includes reacted, outlet, and still-stored mass, so right-
   censored RTD quantiles do not erase either primary mass term. Each arm must
   return two point estimates in $[0,1]$ kg per evaluation episode; if it also
   returns an interval, the point used above is its declared pre-confirmation
   centre and interval score is secondary. A missing or out-of-range estimate,
   non-finite state, broken closure, or interval not contained in $[0,1]$ kg
   receives $L_s=4$ kg. B uses $r=0.20$ in the common shifted contrast.
- **Secondary metrics:** errors in $t_{10}$, $t_{50}$, and $t_{90}$ (h); escaped
  tracer mass (kg); reaction-conversion error (kg); 99% interval coverage (%);
  CPU and artifact resources.
- **Protected gates:** coverage 97--100%; non-negative concentrations; relative
  constituent closure below $10^{-7}$; identical pulse and observation support
  across arms.
- **Stopping/abstention:** non-conservative tracer closure, negative
  concentration, or unstable solver receives worst-case loss. An arm abstains
  when an RTD quantile is unbounded.
- **Novelty/kill:** C must clear the common performance or resource gate against
  B; parity kills the composition.
- **Artifacts:** `world-manifest.json`, `flows.parquet`, `tracer.parquet`,
  `rtd-estimates.jsonl`, `mass-closure.csv`, `seed-outcomes.jsonl`.

### ENV-T02 — HRT, SRT, and population washout

- **Claim:** `C-1471`.
- **Primary unit and units:** one 365-day biological-treatment world; HRT (h),
  SRT (d), concentration (mg N/L), load (kg N/d), biomass (kg), oxygen
  (mg O$_2$/L), temperature (degrees Celsius), and simulated electricity (kWh).
- **Frozen hydraulic and population DGP:** truth resolution is 15 min. Draw
  $R\sim U_{\mathbb Z}\{2,5\}$ reactors, flow
  $Q\sim\operatorname{logU}(0.02,2)$ m$^3$/s, HRT $\theta\sim U(4,24)$ h, and
  total volume $V=Q\theta$ after conversion to seconds. Allocate $V$ with a
  Dirichlet$(3,\ldots,3)$ draw in a serial chain. Fresh inlet and final effluent
  are $Q$; a final-to-first recycle $R_QQ$ uses $R_Q\sim U(0.25,1.5)$, so every
  chain edge carries $(1+R_Q)Q$ and the final splitter returns $R_QQ$ while
  discharging $Q$. Dissolved species use those liquid concentrations. A perfect
  clarifier prevents biomass in the final $Q$ outlet and returns all
  $(1+R_Q)QX_{g,R}$ final-reactor biomass flux in the recycle at concentration
  $(1+R_Q)X_{g,R}/R_Q$; this closes each guild before wasting. A proportional wasting
  sink removes $M_{X,g}/\theta_c$ kg/d from every guild $g$, distributed among
  tanks in proportion to its current guild mass, where SRT
  $\theta_c\sim U(3,40)$ d is independent of HRT. Thus, with growth and decay
  disabled, total guild mass has exactly the declared solids lifetime; recycle
  changes location but not inventory.
- **Frozen reactions and initial state:** dissolved NH$_4$-N, NO$_2$-N, and
  NO$_3$-N and AOB/NOB biomass are advected by the declared flow matrix. In each
  reactor (all concentrations in mg/L and time in d),

  $$
  r_A=\mu_A(T)X_A\frac{S_{NH4}}{0.5+S_{NH4}}
      \frac{S_O}{0.4+S_O},\qquad
  r_N=\mu_N(T)X_N\frac{S_{NO2}}{0.2+S_{NO2}}
      \frac{S_O}{0.6+S_O},
  $$

  with $\mu_A(20)=0.8$ d$^{-1}$, $\mu_N(20)=0.7$ d$^{-1}$,
  $\mu_g(T)=\mu_g(20)1.072^{T-20}$, decay 0.15 and 0.10 d$^{-1}$, and yields
  $Y_A=0.15$, $Y_N=0.04$ mg biomass/mg N, and biomass N content
  $i_N=0.12$ mg N/mg biomass. AOB consume $r_A/Y_A$ NH$_4$-N, incorporate
  $i_Nr_A$, and produce the remainder as NO$_2$-N; NOB consume $r_N/Y_N$
  NO$_2$-N, incorporate $i_Nr_N$, and produce the remainder as NO$_3$-N.
  Decay returns $i_Nb_gX_g$ to NH$_4$-N; wasting exports and records $i_N$ times
  wasted biomass. Guild growth is $r_g$, followed by decay and the wasting sink.
  Each of the six kinetic/yield numbers receives
  one seed-level lognormal multiplier with CV 0.25. Negative states are rejected.
  Initialise every reactor with NH$_4$-N at baseline influent, NO$_2$-N and
  NO$_3$-N at zero, and each guild at 0.1 mg biomass/L, then integrate constant baseline influent for
  $10\max(\theta/24,\theta_c)$ d or until every state $x$ satisfies
  $|\dot x|/\max(|x|,x_{ref})<10^{-8}$ d$^{-1}$, using
  $x_{ref}=0.01$ mg N/L for dissolved species and 0.001 mg biomass/L for guilds.
  Failure to converge within that horizon resamples the world under the common
  10,000-attempt generator cap.
- **Frozen forcing and observations:** mean temperature is $U(12,22)$ degrees
  Celsius with annual sinusoidal amplitude $U(2,8)$ and phase $U(0,2\pi)$; DO
  is a seed-fixed $U(0.3,4)$ mg O$_2$/L.
  Baseline influent NH$_4$-N is log-uniform 15--800 mg/L, with NO$_2$-N zero
  and NO$_3$-N $U(0,10)$ mg/L. Hourly
  $z_h=0.98z_{h-1}+\eta_h$, $\eta_h\sim N(0,0.1^2)$, starts in its stationary
  normal distribution and multiplies all influent N by
  $\exp(z_h-\operatorname{Var}(z)/2)$. Draw
  $K=\min(12,\operatorname{Poisson}(6))$ non-overlapping shocks, with onset
  uniform over days 15--350, duration log-uniform 2--48 h, and multiplier
  log-uniform 2--10. All forcing is zero-order held at the truth step. Flow,
  temperature, DO, and wasting are observed every 15 min with 1% Gaussian CV;
  influent and effluent N species every 6 h with 5% CV and LOD 0.01 mg N/L,
  returning $[0,\mathrm{LOD}]$ below it. All arms receive identical samples.
- **Arms:** A uses HRT-only fixed first-order removal; B uses a calibrated
  guild-resolved activated-sludge state-space model with explicit SRT; C uses
  P-004/P-005/P-012 lifetime-qualified population specialisation and history.
- **Mature null:** the guild-resolved process model receives the same influent,
  wasting, recycle, DO, and temperature observations as C.
- **Transfer family:** attached-retention and comammox-like guild families plus
  unseen temperature/load correlation.
- **Primary metric and threshold:** let $M_{d,j}$ be the daily integrated
  effluent mass, in kg N rather than kg N/d, of ammonium or nitrite. Freeze

  $$
  L_s=\sum_{d=1}^{365}\sum_{j\in\{NH_4,NO_2\}}
  |\widehat M_{d,j}-M_{d,j}|\quad\text{kg N}.
  $$

  Let $B_s$ be initial dissolved plus $i_N$-weighted biomass N plus all 365-day
  influent N, in kg. Every daily constituent truth and prediction is constrained
  to $[0,B_s]$. A missing/out-of-range
  prediction, non-finite population state, negative guild mass, or broken
  nitrogen ledger receives $L_{fail}=730B_s$, the finite endpoint maximum for
  365 days times two constituents. B uses
  $r=0.25$.
- **Secondary metrics:** 95th-percentile NH$_4$-N and NO$_2$-N (mg N/L);
  washout classification and timing (d); recovery (d); violation duration (h);
  simulated aeration electricity (kWh); biomass and nitrogen closure.
- **Protected gates:** violation hours no more than 1% above comparator;
  relative nitrogen closure below $10^{-6}$; no negative guild mass.
- **Stopping/abstention:** a non-finite growth rate or negative mass fails the
  seed. Control abstains under an unbounded guild-state interval and uses the
  frozen conservative wasting/aeration policy.
- **Novelty/kill:** C must beat or resource-dominate B; ordinary explicit SRT
  modelling at parity kills novelty.
- **Artifacts:** `influent.parquet`, `guild-state.parquet`, `wasting.csv`,
  `effluent.csv`, `nitrogen-closure.csv`, `seed-outcomes.jsonl`.

### ENV-T03 — Integrated wet-weather control

- **Claim:** `C-1472`.
- **Primary unit and units:** one 120-day sewer--plant--receiving-water world;
  rainfall (mm), flow (m$^3$/s), volume (m$^3$), load (kg N, kg COD), flooding
  (m$^3$ h), duration (h), and simulated electricity (kWh).
- **Frozen catchment and routing DGP:** truth resolution is 2 min. Draw
  $N\sim U_{\mathbb Z}\{20,80\}$ subcatchments, total area
  $A\sim\operatorname{logU}(2,100)$ km$^2$, and allocate area by
  Dirichlet$(2,\ldots,2)$. Node $i>1$ drains to a uniformly drawn node in
  $\{1,\ldots,i-1\}$ and node 1 drains to the plant, giving a connected directed
  tree. Impervious coefficient is $U(0.2,0.9)$; dry flow is $U(50,250)$
  L/person/d for a Dirichlet allocation of a
  $\operatorname{logU}(10^4,10^6)$ population. With $A_i$ in km$^2$ and rainfall
  intensity $I_i$ in mm/h, each runoff reservoir obeys
  $\dot V_i=10^{3}C_iA_i I_i-V_i/\tau_i$ in m$^3$/h because
  1 mm km$^2=1000$ m$^3$; all later flow conversions are explicit and
  $\tau_i\sim\operatorname{logU}(0.1,3)$ h. Sewer node storage is
  $U(0.5,5)$ times one dry-weather hour; its outlet is
  $\min(V_i/\tau_{s,i},q_{cap,i})$, where $\tau_{s,i}\sim U(0.1,2)$ h and
  $q_{cap,i}=U(1,5)$ times peak dry flow. Excess above storage is overflow.
- **Frozen storms and nitrogen ledger:** draw
  $K\sim\operatorname{Poisson}(0.15\times120)$ storm onsets from the ordered
  statistics of independent $U(0,120\text{ d})$ draws. Depth is log-uniform
  2--80 mm, duration lognormal with median 2 h and log-SD 0.6, and twelve equal-
  time hyetograph fractions are Dirichlet$(2,\ldots,2)$; overlapping intensities
  add. Surface nitrogen stock follows
  in hours as
  $\dot B_i=(k_{b,i}/24)(B_{max,i}-B_i)-k_{w,i}q_{run,i}B_i$, with
  $B_{max,i}\sim\operatorname{logU}(0.1,100)$ kg,
  $k_b\sim\operatorname{logU}(0.01,0.2)$ d$^{-1}$ divided by 24 in the equation, and
  $k_w\sim\operatorname{logU}(10^{-5},10^{-2})$ m$^{-3}$; washed mass rate is
  $k_wq_{run}B$ kg/h after converting $q$ to m$^3$/h. Dry wastewater carries
  $U(20,80)$ mg N/L. A parallel COD stock uses the identical equation with
  $B_{max,COD}\sim\operatorname{logU}(10,1000)$ kg, independently drawn
  $k_b,k_w$ from the same ranges, and dry concentration $U(100,500)$ mg COD/L.
  Every surface, sewer, plant, overflow, and reach inventory has explicit kg-N
  and kg-COD states and conservative flux rows.
- **Frozen plant, reach, observation, and action map:** plant hydraulic capacity
  is $U(1.2,3)$ times peak dry flow, equalization is $U(0,12)$ dry-flow hours,
  and independent N/COD baseline removals are
  $\eta_{0,j}\sim U(0.6,0.95)$ with
  $\eta_j(q)=\operatorname{clip}[\eta_{0,j}-0.25(q/q_{cap}-1)_+,0,1]$; flow above
  capacity bypasses. One completely mixed reach has residence time
  $U(0.5,48)$ h and independent first-order N and COD losses
  $\operatorname{logU}(0.001,0.2)$ d$^{-1}$, but primary receiving load is
  counted where plant effluent, bypass, or overflow enters it. Set equalization
  release capacity $q_{e,max}=q_{cap}$. All quantities in the following routing
  operator use m$^3$, h, m$^3$/h, and kg. If the sampled equalization duration is
  $h_e$, its capacity is $V_{e,max}=h_eq_{dry}$; initialise $V_e=0$ and
  $M_{e,N}=M_{e,COD}=0$. At each 2-min truth step of length $\Delta t$ h, let
  $q_r$ and $\dot M_{r,j}$ be root-sewer flow and constituent-$j$ flux and set
  $c_{r,j}=\dot M_{r,j}/q_r$ when $q_r>0$, otherwise zero. From the pre-step
  equalization state set $c_{e,j}=M_{e,j}/V_e$ when $V_e>0$, otherwise zero,
  compute

  $$
  q_e=\min\!\left(\frac{V_e}{1\ \mathrm h},a_eq_{e,max}\right),\quad
  V_{rel}=V_e-q_e\Delta t,\quad
  q_{store}=\min\!\left(q_r,\frac{V_{e,max}-V_{rel}}{\Delta t}\right),
  $$

  and route $q_p=q_r-q_{store}+q_e$ with
  $\dot M_{p,j}=(q_r-q_{store})c_{r,j}+q_ec_{e,j}$ to the plant. Update
  $V_e\leftarrow V_{rel}+q_{store}\Delta t$ and
  $M_{e,j}\leftarrow M_{e,j}+\Delta t(q_{store}c_{r,j}-q_ec_{e,j})$.
  Thus incoming liquid that cannot be stored goes directly to the plant rather
  than disappearing, and the recovery tail empties the same volume and mass
  states. Every 5 min an
  arm selects each node-outlet pump multiplier $a_i\in\{0,0.5,1\}$, giving
  $q_{i,out}=\min(V_i/\tau_{s,i},a_iq_{cap,i})$; equalization release multiplier
  $a_e\in\{0,0.5,1\}$ enters the routing operator above; and plant setpoint
  $a_p\in\{0.75,1,1.25\}$ replaces $q_{cap}$ by $a_pq_{cap}$ in both bypass and
  $\eta_j(q)$. Pump heads are seed-fixed $U(5,30)$ m and efficiencies 0.70; with
  $\rho=1000$ kg/m$^3$ and $g=9.80665$ m/s$^2$, simulated electricity is
  $\rho gq h\Delta t/(0.70\times3.6\times10^6)$ kWh
  after SI conversion. Impossible actions clip and are logged. Rain/level/flow/N/COD sensors have 2%
  Gaussian CV and a seed-fixed $U(0,15)$ min delay; actuator delay is
  $U(2,20)$ min.
  Forecast depth and duration are multiplied by independent mean-one lognormal
  errors with log-SD 0.35, and onset error is $N(0,(20\text{ min})^2)$.
- **Arms:** A uses independent local level, pump, and plant-setpoint rules; B
  uses robust integrated model-predictive control over the complete graph; C
  uses P-002/P-006/P-008/P-013 hierarchy with local fallback and versioned
  shared state.
- **Mature null:** constrained robust MPC sees the same forecasts and actuator
  states as C and optimizes the same declared system boundary.
- **Transfer family:** clustered storms, one network loop, correlated
  sensor/actuator failure, and an unseen receiving-water response time.
- **Primary metric and threshold:** after day 120, run a 30-day no-new-storm
  recovery with dry flow, safe local control, and every stored liquid and N mass
  retained until discharged or transformed. Freeze
  $L_s=\int_0^{150d}\dot M_{N,receiving}(t)\,dt$ in kg N, including treatment
  effluent, overflow, and bypass. At a failure time $t_f$, set
  $L_{fail}$ to load accrued before $t_f$ plus every kg N then present in
  surface, sewer, plant, and reach states plus all already scheduled influent N
  through day 150. This deliberately conservative finite terminal score prevents
  stored mass or a stopped run from improving the result. B uses $r=0.15$.
- **Secondary metrics:** COD discharge (kg COD); CSO volume (m$^3$); flooding
  (m$^3$ h); effluent noncompliance (h and kg); receiving-threshold exceedance
  (h); simulated pumping electricity (kWh).
- **Protected gates:** no increase in flooding; COD and compliance no more than
  1% worse; simulated electricity no more than 5% worse; complete storage and
  pollutant closure.
- **Stopping/abstention:** an infeasible action is rejected and replaced with
  local safe control. Omitted overflow or storage mass fails the seed.
- **Novelty/kill:** C must clear the common gate against robust integrated MPC;
  lower algorithmic complexity alone is insufficient unless resource reduction
  is registered and protected outcomes remain non-inferior.
- **Artifacts:** `network.json`, `storms.parquet`, `forecasts.parquet`,
  `actions.parquet`, `system-loads.csv`, `protected-events.csv`.

### ENV-T04 — Sensor and process anomaly isolation

- **Claim:** `C-1473`.
- **Primary unit and units:** one 180-day instrumented plant world; channel time
  (h), detection delay (h), false alarms per 1,000 channel-h, concentrations in
  their declared process units, and maintenance/assay counts.
- **Frozen DGP:** use a 12-state synthetic process in standardized state units
  with a 5 min fourth-order Runge--Kutta truth step. Generate an orthogonal
  matrix $Q_x$ by QR decomposition of a seed-normal matrix, changing each
  column sign so the corresponding diagonal of $R$ is positive, and rates
  $\lambda_i\sim\operatorname{logU}(1/48,1/2)$ h$^{-1}$; then
  $A=Q_x\operatorname{diag}(-\lambda_i)Q_x^\top$. Draw fixed sparse matrices
  $B\in\mathbb R^{12\times6}$ and $E\in\mathbb R^{12\times8}$ in h$^{-1}$,
  and $H\in\mathbb R^{18\times12}$. Each entry is independently zero with
  probability 0.7 and otherwise $N(0,1)$; normalize every nonzero column of
  $B,E$ and every nonzero row of $H$ to unit Euclidean norm. Resample a zero
  column/row or a controllability/observability numerical rank below 12, using
  tolerance $10^{-10}$ times the largest singular value. Set
  $x(0)\sim N(0,0.25^2I)$, $u_0=0$, and $d=0$ outside declared events. Truth
  follows

  $$
  \dot x=Ax+Bu+0.02\,\Lambda\tanh(x)+Ed,
  \qquad y^0=Hx+\epsilon,\quad y=\mathcal F(y^0),
  $$

  where $\Lambda=\operatorname{diag}(\lambda_i)$ and $d$ is a piecewise-
  constant process disturbance. The typed fault operator $\mathcal F$ adds bias,
  drift, or cross-sensitivity; holds the last pre-fault value for freeze; emits a
  missing flag for dropout; and scales $y^0$ for multiplicative fouling. Thus no
  multiplicative fault is silently represented as an additive state. Finally,
  $\epsilon_j\sim N(0,\sigma_j^2)$ with
  $\sigma_j\sim\operatorname{logU}(0.01,0.10)$ standardized units. A committed
  scale table maps every $x_i$ and $y_j$ to its displayed native concentration,
  flow, oxygen, pressure, or temperature unit; arms receive both value and unit.
- **Fault, observation, and maintenance map:** schedule
  $U_{\mathbb Z}\{24,60\}$ non-overlapping sensor faults and
  $U_{\mathbb Z}\{12,30\}$ process disturbances, with onset uniform over days
  7--170. Fault and step duration is log-uniform 0.5--72 h; a ramp instead draws
  its complete event duration $U(2,24)$ h. The six fault types are
  equiprobable. Sensor faults are bias $U(1,5)\sigma_j$, drift
  $U(0.1,1)\sigma_j$/d, freeze, dropout, multiplicative fouling $U(0.6,0.95)$,
  or cross-sensitivity to one other channel with coefficient $U(0.1,0.5)$.
  Disturbances choose a column of $E$ uniformly and are equiprobable steps or
  linear ramps across their declared event duration, with signed amplitude $U(1,4)$ standardized
  state units; sign is equiprobable. On a Bernoulli(0.20) seed flag, replace one
  ordinary event by an executable equivalence episode. Draw a process step as
  above and integrate its open-loop, noise-free output residual $r(t)$ for 6 h
  with $u=u_0$. A fair latent coin then instantiates either that process step or
  a synthetic multichannel calibration-map sensor fault
  $\mathcal F(y^0)=y^0+r(t)$, while control remains $u_0$ for those 6 h. The two
  observable trajectories are therefore identical by construction; its truth
  label is the two-member set `{process step, calibration-map fault}` until hour
  6, after which ordinary observation/control resumes. Calibration every 14 d
  observes a certified zero/span with 0.25 $\sigma_j$ noise. A completed
  maintenance action after a $U(2,12)$ h delay draws
  $\rho\sim U(0.8,1)$. It multiplies additive bias, accumulated drift, and
  cross-sensitivity coefficient by $1-\rho$; maps a multiplicative fouling
  factor $m$ to $1-(1-\rho)(1-m)$; and clears a freeze or dropout exactly when a
  precommitted hash-keyed $U(0,1)$ draw is at most $\rho$. Otherwise that
  categorical fault remains. During a calibration-map equivalence episode,
  `maintain(channel j)` treats $r_j(t)$ as an additive fault state and multiplies
  that component by $1-\rho$ for the episode's remainder; the latent process-step
  branch is physically unaffected. The intervention may therefore break the
  pre-intervention observational equivalence and is logged as such. The completion record contains the actual typed
  transition and a versioned status bit; only a failed categorical repair can
  emit false `success`, with precommitted Bernoulli(0.02) probability.
  Event intervals are half-open; a rejected overlap is resampled in channel,
  onset, duration order. A `consequential` event is frozen as one whose
  no-fallback counterfactual leaves $|x_i|>3$ for at least 30 min.
- **Action and safe-state map:** actions update every 15 min and obey
  $u=\operatorname{clip}(u_0-K\hat x,-1,1)$, where $K$ is the discrete LQR gain
  computed by zero-order-hold discretization at 15 min from the manifest-declared
  $(A,B)$, with identity state cost and $0.1I$ action cost. These nominal matrices
  are available equally to all arms; event labels and fault states are not.
  At the same update an arm emits no alarm or one or more alarm records. Every
  alarm record must name exactly one of the 18 channels and carry a set of
  sensor/process labels; a multichannel alarm therefore emits one record per
  implicated channel. A record without a valid channel is a malformed terminal
  output and receives $L_{fail,s}$. The arm also emits one request from `none`,
  `calibrate(channel)`, or
  `maintain(channel)`; busy duplicate requests are rejected. A maintenance
  request starts the declared 2--12 h delay, while calibration returns at the
  next 15 min boundary. Protected state is $|x_i|\le3$ for all $i$. An
  unresolved consequential anomaly invokes $u_0$ and an immediate calibration
  request; unsafe-control exposure $U_s$ is the number of hours outside the
  protected set before verified fallback or repair. The evaluator logs every
  alarm, diagnosis set, action, request, completion, and state excursion.
  Repeated alarm records from one channel within one clock-hour form one alarm
  episode. Its timestamp and diagnosis set are those of the earliest record,
  with stable record hash breaking an equal-timestamp tie; later records remain
  logged but cannot enlarge that set. There are therefore exactly
  $18\times4320$ possible false-alarm bins.
- **Frozen alarm/event matching:** all scheduled event intervals are mutually
  non-overlapping. Process them by onset. The first unassigned alarm episode in
  $[t_{on},\min(t_{on}+24\text{ h},t_{off}+24\text{ h})]$ is that event's
  detection (earliest timestamp, then lowest channel index) and sets
  $d_e=t_{alarm}-t_{on}$; if none occurs, set $d_e=24$ h and
  the returned diagnosis to the empty set. The empty set does not increment
  $N_W$, but a consequential event with neither isolation nor verified fallback
  still increments $N_U$. Every other alarm episode is unmatched and enters
  $N_{FA}$, including duplicates during an event. A matched diagnosis is wrong
  only when its returned set is disjoint from the singleton truth label or, in
  the first 6 h of the constructed episode, from both equivalence labels.
  $N_W$ counts those disjoint sets. An event is isolated when the set intersects
  truth; $N_U$ counts consequential events lacking isolation or verified
  fallback within 6 h. Hour-bin assignment uses alarm timestamp floor-to-hour;
  each channel-hour bin with one or more unmatched alarms counts once.
- **Arms:** A uses static univariate 3-SD thresholds; B uses moving-window
  multiscale PCA plus an observer/residual bank and maintenance events; C uses
  P-007/P-009/P-013 with CAND-014 versioned observation contracts.
- **Mature null:** B receives the same multivariate channels, calibration, and
  maintenance records as C and may emit set-valued diagnoses.
- **Transfer family:** unseen compound faults, maintenance-log omission, and
  correlated sensor drift.
- **Primary metric and threshold:** with
  $N_{bin}=18\times180\times24$ channel-hour alarm bins and
  $H_s=N_{bin}$ channel-h,
  $N_{FA}$ false alarms, event delays $d_e$ capped at 24 h, $N_W$ uniquely wrong
  diagnoses, unsafe exposure $U_s$ in h, and $N_U$ consequential events neither
  isolated nor placed in fallback within 6 h, freeze

  $$
  L_s=\frac{1000\text{ channel-h}}{H_s}\left[
  0.25\text{ h}\,N_{FA}+\sum_e\min(d_e,24\text{ h})+
  8\text{ h}\,N_W+4U_s+12\text{ h}\,N_U\right].
  $$

  The unit is h-equivalent per 1,000 channel-h. With $N_E$ scheduled faults plus
  disturbances, terminal failure is

  $$
  L_{fail,s}=\frac{1000\text{ channel-h}}{H_s}\left[
  0.25\text{ h}\,N_{bin}+(24+8+12)\text{ h}\,N_E+
  4(4320\text{ h})\right],
  $$

  corresponding to a deliberately punitive all-bin alarm ceiling (which is no
  smaller than the realizable fault-free-bin count), every
  event delayed 24 h and wrongly uncontained, and full-horizon unsafe exposure.
  B uses $r=0.20$.
- **Secondary metrics:** false alarms per 1,000 channel-h; detection delay (h);
  set-valued isolation coverage (%); macro-F1 on identifiable cases; process-
  versus-sensor confusion (%); bad-control exposure (h); abstention and assay
  count.
- **Protected gates:** set-valued isolation coverage at least 97%; no increase
  in unsafe-control exposure; no event-level pseudo-replication; equivalence-set
  cases excluded from unique-label F1 but included in coverage.
- **Stopping/abstention:** a forced unique label for an evaluator-declared
  equivalence set is an error. Unresolved consequential anomalies force safe
  control fallback; its calibration, delay, and lost-control-service costs stay
  in $L_s$ and the resource ledger.
- **Novelty/kill:** C must beat or resource-dominate the complete adaptive
  multivariate null; merely storing a version field does not survive.
- **Artifacts:** `sensor-stream.parquet`, `fault-truth.enc`,
  `maintenance-events.jsonl`, `diagnoses.jsonl`, `control-exposure.csv`.

### ENV-T05 — Membrane fouling and cleaning history

- **Claim:** `C-1474`.
- **Primary unit and units:** one 180-day membrane world; flux
  (L m$^{-2}$ h$^{-1}$), pressure (kPa), resistance (m$^{-1}$), solids (g/L),
  permeate (m$^3$), chemicals (kg), downtime (h), and simulated electricity
  (kWh).
- **Frozen DGP:** truth resolution is 10 min. Draw membrane area
  $A_m\sim\operatorname{logU}(200,5000)$ m$^2$, clean resistance
  $R_m\sim\operatorname{logU}(2\times10^{11},2\times10^{12})$ m$^{-1}$,
  demanded flux $J_d\sim U(10,40)$ L m$^{-2}$ h$^{-1}$, feed solids baseline
  $C_{s,0}\sim\operatorname{logU}(0.05,10)$ g/L, temperature $T\sim U(8,30)$
  degrees Celsius, and TMP limit $P_{lim}\sim U(50,300)$ kPa. Dynamic viscosity
  is $\mu(T)=1.002\times10^{-3}\exp[-0.025(T-20)]$ Pa s. At each step Darcy's
  equation uses the commanded flux converted to m/s:
  $\Delta P=\mu J(R_m+R_c+R_i)$; $P_{lim}$ is converted from kPa to Pa before
  comparison.
- **Fouling and quality transitions:** for $\Delta h=1/6$ h,

  $$
  \begin{aligned}
  R_c'&=R_c e^{-k_r\Delta h}+
    a_c(C_s/1\text{ g L}^{-1})(J/20\text{ L m}^{-2}\text{h}^{-1})\Delta h,\\
  R_i'&=R_i+
    a_i(C_s/1\text{ g L}^{-1})(J/20\text{ L m}^{-2}\text{h}^{-1})\Delta h,
  \end{aligned}
  $$

  with initial $R_c=R_i=d=0$, $k_r\sim\operatorname{logU}(0.005,0.10)$ h$^{-1}$,
  $a_c\sim\operatorname{logU}(10^9,10^{11})$ m$^{-1}$ h$^{-1}$, and
  $a_i\sim\operatorname{logU}(10^7,10^9)$ m$^{-1}$ h$^{-1}$. Draw
  $K\sim U_{\mathbb Z}\{0,12\}$ non-overlapping feed shocks; onset is uniform
  over days 10--170, duration log-uniform 2--24 h, and multiplier log-uniform
  2--10. Candidate intervals are sorted by onset and overlaps resampled in that
  order. Baseline rejection
  $\eta_0\sim U(0.995,0.9999)$ and permeate solids are
  $C_p=C_s\operatorname{clip}(1-\eta_0+d,0,1)$, where damage $d$ starts at zero and each chemical
  clean adds $U(0,5\times10^{-4})$; the seed-frozen quality limit is
  $C_{lim}=0.01C_{s,0}$ g/L. Backwash removes $U(0.6,0.9)$ of $R_c$ in 20 min;
  chemical cleaning removes $U(0.85,0.99)$ of $R_c$ and $U(0,0.2)$ of $R_i$
  in 6 h. For
  each action, its day-zero removal fraction is multiplied at day $t$ by
  $1-\delta t/(180\text{ d})$, $\delta\sim U(0,0.30)$; this is a relative, not
  percentage-point, decline and is clipped to $[0,1]$.
  Backwash consumes $U(0.5,2)$ L/m$^2$ water and a chemical clean consumes
  $U(0.1,2)$ kg chemical; membrane mass is $U(0.2,2)$ kg/m$^2$. These
  seed-frozen draws are identical across arms.
- **Observation map:** flux and TMP arrive every 10 min with 1% Gaussian CV;
  feed solids and permeate solids arrive every 6 h with 5% CV, analytical LOD
  $10^{-4}C_{s,0}$, interval output $[0,\mathrm{LOD}]$ below it, and the committed
  g/L unit. Cleaning completion is observed without delay but recovery is known
  only through subsequent pressure/flux observations. All arms receive the same
  samples, censor flags, and maintenance-event versions.
- **Action and service map:** every 10 min an arm selects flux from
  $\{0,0.5J_d,J_d,1.25J_d\}$, starts an available cleaning action, or replaces
  the membrane. Only one backwash, clean, or replacement may be active; flux is
  forced to zero throughout its 20 min, 6 h, or 48 h interval, and a request
  while busy is rejected and logged. Replacement restores $R_c=R_i=d=0$ and charges the
  seed-frozen membrane mass and replacement record. Gross
  volume is $A_mJ\Delta h/1000$ m$^3$. Compliant service is at most demanded
  volume and requires $C_p\le C_{lim}$ and $\Delta P\le P_{lim}$; excess and
  noncompliant production are not service. Pumping electricity is simulated
  from hydraulic work $\Delta P\,V/(0.65\times3.6\times10^6)$ kWh. Every action,
  cleaning interval, chemical mass, pressure trip, and quality state is logged.
- **Arms:** A uses fixed critical flux and fixed cleaning interval; B uses a
  nonlinear fouling-state estimator and constrained MPC; C uses
  P-005/P-009/P-012 history and maintenance state.
- **Mature null:** B receives the same feed, pressure, flux, permeate-quality,
  and cleaning observations as C.
- **Transfer family:** held-out membrane/feed family, irreversible ageing step,
  and cleaning-chemistry change.
- **Primary metric and threshold:** let $V_{dem}$ be the 180-day integral of
  $A_mJ_d/1000$, $V_{comp}$ delivered compliant service capped by contemporaneous
  demand, and $V_{non}$ gross volume produced above either quality or TMP limit.
  Freeze

  $$
  L_s=(V_{dem}-V_{comp})+2V_{non}\quad\text{m}^3.
  $$

  Shutdown therefore remains unmet service rather than missing data. A
  non-finite state, broken volume ledger, or action outside the frozen set gets
  $L_{fail}=V_{dem}+2V_{gross,max}$, where
  $V_{gross,max}=A_m(1.25J_d)(180\times24\text{ h})/1000$ m$^3$. B uses
  $r=0.15$.
- **Secondary metrics:** net permeate (m$^3$); TMP and exceedance (kPa, h);
  irreversible resistance (m$^{-1}$); cleaning chemicals (kg); downtime (h);
  simulated pumping electricity (kWh); membrane replacements (count).
- **Protected gates:** zero additional quality violations; TMP exceedance no
  greater than B; relative volume closure below $10^{-7}$; shutdown time remains
  in the denominator.
- **Stopping/abstention:** a TMP-limit crossing invokes backwash or safe
  shutdown. Treating shutdown observations as missing is a protected failure.
- **Novelty/kill:** C must clear the common gate against the nonlinear
  maintenance-aware controller; a relabelled fouling state at parity is killed.
- **Artifacts:** `feed.parquet`, `membrane-state.parquet`, `cleaning.jsonl`,
  `permeate.csv`, `pressure-events.csv`, `resource-ledger.csv`.

### ENV-T06 — Competitive adsorption and breakthrough

- **Claim:** `C-1475`.
- **Primary unit and units:** one 365-day adsorptive-bed world; concentration
  (micrograms/L), time (h, d), bed volumes (dimensionless count), mass (mg),
  media (kg), empty-bed contact time (min), and assay count.
- **Frozen bed and solute table:** draw bed diameter $D_b\sim U(0.4,2)$ m,
  length $L_b\sim U(1,3)$ m, porosity $\epsilon\sim U(0.35,0.55)$, and media
  bulk density $\rho_b\sim U(350,650)$ kg/m$^3$. Set
  $A_b=\pi D_b^2/4$, $V_b=A_bL_b$, draw EBCT $\theta\sim U(5,30)$ min, convert
  $\theta$ to seconds, and set $Q=V_b/\theta$ in m$^3$/s. Media mass is
  $\rho_bV_b$ kg. For
  each of $U_{\mathbb Z}\{4,12\}$ solutes draw a compliance threshold
  $C_{lim,j}=10^{U(-2,1)}$ micrograms/L, baseline influent
  $C_{in,j}=C_{lim,j}10^{U(0.3,3)}$, $q_{max,j}\sim\operatorname{logU}(10^2,10^5)$
  mg/kg, $b_j\sim\operatorname{logU}(10^{-4},1)$ L/microgram, and
  $k_{LDF,j}\sim\operatorname{logU}(0.01,10)$ h$^{-1}$. Detection limit is
  $U(0.01,0.5)C_{lim,j}$. DOM is $U(0.5,20)$ mg C/L with
  $b_{DOM}\sim\operatorname{logU}(10^{-3},1)$ L/mg C.
- **Frozen transport solver:** initialise $C_j=q_j=0$ and use 80 finite-volume cells of
  $\Delta x=L_b/80$, axial dispersion
  $D_{ax}\sim\operatorname{logU}(10^{-7},10^{-4})$ m$^2$/s, interstitial
  velocity $v=Q/(A_b\epsilon)$, and the competitive equilibrium

  $$
  q_j^*=\frac{q_{max,j}b_jC_j}
  {1+\sum_\ell b_\ell C_\ell+b_{DOM}C_{DOM}},
  \qquad \dot q_j=k_{LDF,j}(q_j^*-q_j).
  $$

  Internally $C_j$ is mg/m$^3$, numerically equal to micrograms/L, and
  $\rho_bq_j$ is mg/m$^3$. For each solute the coupled balance is

  $$
  \epsilon\frac{\partial C_j}{\partial t}+
  \rho_b\frac{\partial q_j}{\partial t}=-\frac{\partial F_j}{\partial x},
  \qquad F_j=\epsilon\left(vC_j-D_{ax}\frac{\partial C_j}{\partial x}\right),
  $$

  with Danckwerts inlet $F_j(0)=\epsilon vC_{in,j}$ and zero-gradient outlet.
  A first-order upwind advective and centred diffusive finite-volume flux uses
  SSP-RK2. Strang-split LDF half-steps use
  $q\leftarrow q^*+(q-q^*)e^{-k_{LDF}\Delta t/2}$ with $q^*$ evaluated at the
  current mobile state, and change mobile mass by
  $\Delta C=-\rho_b\Delta q/\epsilon$ in the same cell. A step that would make
  $C$ or $q$ negative is bisected recursively down to 0.1 s; failure there
  rejects the realization. The adaptive upper substep is

  $$
  \Delta t=\min\left(15\text{ s},\theta/40,
  0.2\Delta x/v,0.1\Delta x^2/D_{ax},0.05/k_{LDF,max}\right),
  $$

  with every term converted to seconds and $k_{LDF,max}$ converted from h$^{-1}$
  to s$^{-1}$; hourly output is an aggregation, not the truth step. Any negative
  concentration or solute-wise closure error above
  $10^{-6}$ rejects the numerical realization.
- **Influent, assay, and action map:** daily
  $z_d=0.95z_{d-1}+\eta_d$, $\eta_d\sim N(0,0.15^2)$, starts in its stationary
  normal distribution and multiplies all solutes by
  $\exp(z_d-\operatorname{Var}(z)/2)$. One persistent DOM step starts at a
  uniform day 60--300 and multiplies DOM by $U(2,5)$. Regeneration is unavailable
  with probability 0.5 and otherwise may be commanded once: it removes a
  seed-frozen $U(0.4,0.9)$ fraction of every $q_j$ inventory and returns that
  removed mass to a perfectly mixed release tank feeding the column uniformly
  over a log-uniform 6--48 h. Replacement takes 24 h, sends all adsorbed mass to
  a separately closed disposal ledger, installs the original media mass with
  $q=0$, and supplies no treated service while offline.

  The fixed target panel is the lowest-hash half of solute IDs assayed every 7 d
  with 24 h latency; the broad panel assays all solutes every 30 d with 72 h
  latency. A requested extra broad panel has the same latency and is limited to
  one pending request and one request per 7 d. Assays return left-censored
  intervals below their frozen LOD with 5% multiplicative Gaussian error.
  Actions at each hourly boundary are continue, request an extra broad assay,
  replace media, regenerate if available, or isolate the bed and invoke a
  frozen zero-discharge service fallback. Busy or unavailable actions are
  rejected. All release, disposal, assay latency, media, and lost service are
  logged.
- **Frozen calibration phase:** before the scored year, generate eight
  single-solute batch points per solute at log-spaced 0.01--10 times baseline
  concentration using the same equilibrium equation without competitors and 5%
  Gaussian error. Independently run one fresh, geometrically identical column
  at constant baseline multisolute/DOM influent for 180 d or until any
  $C_{out,j}/C_{in,j}\ge0.90$, whichever comes first. Influent and every effluent
  solute are assayed every 24 h with the same LOD and 5% error; flow, bed, and
  media metadata are exact. These batch and column records are the declared
  calibration data, are identical for all arms, and are a fixed shared pretest
  resource rather than a C-only assay saving.
- **Arms:** A uses fixed removal or independent batch Langmuir isotherms; B uses
  a calibrated multicomponent transport/adsorption model fit to column data; C
  uses P-005/P-009/P-012 media-lineage state with active sampling.
- **Mature null:** B receives the same column-calibration data, influent assays,
  flow, and media records as C.
- **Transfer family:** unseen affinity ordering, abrupt DOM increase, and post-
  regeneration desorption.
- **Primary metric and threshold:** truth-level above-limit load is

  $$
  L_s=\sum_j\int_0^{365\,d}Q(t)
  \max[C_{out,j}(t)-C_{lim,j},0],\mathrm dt\quad\text{mg},
  $$

  with $Q\,dt$ converted to m$^3$, because micrograms/L times m$^3$ equals mg.
  An unobserved early breach
  therefore remains in the loss without an arbitrary extra penalty. A failed
  solver, missing post-breakthrough interval, or unclosed regeneration receives
  loss accrued before failure plus the remaining-horizon influent solute mass
  and all mobile, adsorbed, and release-tank solute inventory still inside the
  system. This finite conservative score is $L^{max}_s$ for the common resource-route
  gate. B uses $r=0.30$.
- **Secondary metrics:** $10\%$, $50\%$, and $90\%$ breakthrough-time error in
  bed volumes and d; early breaches (count); retained and released mass (mg);
  media used (kg); assay count; CPU and storage.
- **Protected gates:** solute-wise and total relative mass closure below
  $10^{-6}$; censored values are not set to zero; all regeneration releases
  remain inside the accounting horizon; delivered treated-service volume may
  not fall more than 1% below B, and all bypass/fallback volume is charged as
  lost service.
- **Stopping/abstention:** an interval overlapping a compliance boundary forces
  an assay or media replacement. Missing post-breakthrough time receives
  worst-case load.
- **Novelty/kill:** C may preregister at least 10% primary improvement or at
  least 20% fewer assays with breach non-inferiority. A batch-capacity model
  cannot be presented as the mature null.
- **Artifacts:** `column.json`, `influent.parquet`, `assays.parquet`,
  `breakthrough.csv`, `media-lineage.jsonl`, `mass-closure.csv`.

### ENV-T07 — Buffered anaerobic overload

- **Claim:** `C-1476`.
- **Primary unit and units:** one 300-day digester world; HRT (d), loading
  (kg COD m$^{-3}$ d$^{-1}$), VFA (mg COD/L), alkalinity (meq/L), gas
  (Nm$^3$/d), pH, time (h, d), and lost feed (kg COD).
- **Frozen reduced anaerobic DGP:** this test uses an explicit ADM1-informed
  synthetic truth, not an unspecified ADM1 implementation. Truth resolution is
  15 min. Draw volume $V\sim\operatorname{logU}(100,10000)$ m$^3$, HRT
  $\theta\sim U(10,40)$ d, dilution $D=1/\theta$ d$^{-1}$, and $Q=VD$ m$^3$/d.
  Organic loading $\ell\sim U(1,8)$ kg COD m$^{-3}$ d$^{-1}$ gives influent
  $S_{in}=\ell/D$ kg COD/m$^3$. Carbohydrate, protein, and lipid fractions
  $(f_1,f_2,f_3)$ are Dirichlet$(2,2,2)$. For each fraction,
  $k_{h,l}\in\{0.5,0.25,0.10\}$ d$^{-1}$ times an independent lognormal CV-0.20
  multiplier and acid yield $y_l\sim U(0.6,0.9)$. With substrate $S_l$, VFA
  $A$, methanogen biomass $X$, and inert soluble COD $I$ in kg COD/m$^3$,

  $$
  \begin{aligned}
  \dot S_l&=D(f_lS_{in}-S_l)-k_{h,l}S_l,\\
  r_a&=\sum_l y_lk_{h,l}S_l,\\
  r_m&=k_mX\frac{A}{K_A+A}I_{pH}I_NI_L,\\
  \dot A&=-DA+r_a-r_m,\\
  \dot X&=Y_mr_m-(b_m+D)X,\\
  \dot I&=-DI+\sum_l(1-y_l)k_{h,l}S_l+b_mX,\\
  \dot B&=D(B_{in}-B)-\alpha r_a+\beta r_m .
  \end{aligned}
  $$

  Here $B$ and $B_{in}\sim U(20,200)$ are meq/L;
  $k_m=8$ d$^{-1}$, $K_A=0.5$ kg COD/m$^3$, $Y_m=0.06$,
  $b_m=0.02$ d$^{-1}$, $\alpha\sim U(2,8)$ and $\beta\sim U(1,6)$
  meq/g COD, with the numerical kg/m$^3$ to g/L identity used in the last
  equation. These six kinetic/stoichiometric terms receive independent
  lognormal CV-0.20 multipliers. Algebraic pH is
  $\operatorname{clip}\{7+\log_{10}[(B/50)/(A/0.5+0.05)],4,9\}$ and
  $I_{pH}=\exp[-((pH-7)/0.8)^2]$. Baseline ammonia $N\sim U(0.1,5)$ g N/L and
  LCFA proxy $L=f_3S_{in}$ give
  $I_N=[1+(N/K_N)^2]^{-1}$, $K_N\sim U(1,4)$ g N/L, and
  $I_L=[1+(L/K_L)^2]^{-1}$, $K_L\sim U(0.5,5)$ kg COD/m$^3$. The COD not
  retained as new biomass becomes gas; methane is
  $(0.35\ \text{Nm}^3/\text{kg COD})(1-Y_m)r_mV$ Nm$^3$/d. Substrate-to-inert,
  biomass-decay, effluent, VFA, biomass, and methane-COD rows close the COD
  ledger. Temperature $U(30,40)$ degrees Celsius multiplies only kinetic
  $k_{h,l}$, $k_m$, and $b_m$ terms by $1.05^{T-35}$; hydraulic $D$ and $Q$ and
  stoichiometric yields remain unchanged. Draw one
  $r_{CO2}\sim U(0.3,1)$ Nm$^3$ CO$_2$/Nm$^3$ CH$_4$; total gas is methane
  times $(1+r_{CO2})$, and reported dry composition is the corresponding CH$_4$/CO$_2$
  volume fraction pair.
- **Initial state and disturbances:** start the burn-in at
  $S_l=f_lS_{in}/2$, $A=X=0.1$, $I=0$ kg COD/m$^3$, and $B=B_{in}$; integrate constant
  baseline feed for $20\theta$ d and require every state $x$ to satisfy
  $|\dot x|/\max(|x|,x_{ref})<10^{-8}$ d$^{-1}$, using
  $x_{ref}=10^{-6}$ kg COD/m$^3$ for $S_l,A,X,I$ and
  $10^{-6}$ meq/L for $B$. A world that does not converge within that horizon
  is resampled under the common 10,000-attempt generator cap;
  that converged state begins day 0. Days 0--30 are a disturbance-free baseline.
  Draw $U_{\mathbb Z}\{4,12\}$ non-overlapping feed shocks with onset uniform over days 30--260,
  duration log-uniform 6--72 h, and multiplier log-uniform 1.5--4. Draw
  $U_{\mathbb Z}\{0,4\}$
  ammonia or LCFA events equiprobably, with onset in the same interval, duration
  12--120 h, and multiplier log-uniform 1.5--5 on $N$ or $L$. Ordinary worlds
  resample overlaps; only the transfer family permits one compound overlap.
- **Observation and action map:** pH, gas flow/composition, temperature, and feed
  arrive every 15 min with 1% Gaussian CV and seed-frozen $U(0,12)$ h sensor delay;
  alkalinity is daily with 5% CV. A requested VFA assay returns after a frozen
  $U(4,48)$ h delay with 5% CV; reported VFA is $1000A$ mg COD/L. Hourly actions
  choose the multiplier applied to inlet substrate concentrations at fixed $Q$
  from $\{0,0.25,0.5,0.75,1\}$ and independently may request one VFA assay; an
  assay request leaves the selected feed multiplier unchanged. Increasing the
  multiplier while truth
  has pH below 6.7 or VFA/alkalinity above 0.8 mg COD/meq is an unsafe action;
  this evaluator state is withheld and charges the following one-hour control
  interval to $T_{unsafe}$. The conservative fallback uses multiplier
  0.25 until the 99% state interval re-enters both limits, then ramps one level
  per 6 h. Assays, feed denied, gas lost, and every action are logged.
- **Arms:** A uses a pH threshold and fixed feed reduction; B uses ADM1 plus an
  extended Kalman filter and multi-indicator constrained control; C uses
  P-006/P-007/P-009/P-012 delayed prediction with active assay allocation.
- **Mature null:** B receives the same pH, gas, feed, alkalinity, VFA, delay, and
  assay observations as C and includes their resource costs.
- **Transfer family:** unseen substrate composition, combined lipid/ammonia
  inhibition, and a temperature-ramp disturbance.
- **Primary metric and threshold:** for each event, the pre-event methane
  reference is the truth median over the half-open interval from 7 d to 1 d
  before onset. A methane excursion counts only after 48 continuous hours below
  50% of that reference, including the qualifying 48 h; any truth step with pH
  below 6.5 counts immediately. $T_{up}$ is the duration in d of the union of
  those intervals, so overlaps are not double-counted. $T_{unsafe}$ is likewise
  the union duration in d for which the commanded feed violates the evaluator
  rule above. $F_{ref}$ is the median scheduled kg COD/d during the declared
  disturbance-free days 0--30, and
  $M_{lost}=\sum_t(F_{scheduled,t}-F_{delivered,t})_+\Delta t$ in kg COD with
  $\Delta t=1/96$ d. Freeze

  $$
  L_s=F_{ref}T_{up}+M_{lost}+2F_{ref}T_{unsafe}
  \quad\text{kg COD-equivalent}.
  $$

  Permanent zero feed therefore pays the full lost-feed term. A failed state,
  truncated recovery, or broken COD, VFA, biomass, gas, or alkalinity ledger receives
  $L_{fail}=F_{ref}(300\text{ d})+M_{scheduled}+2F_{ref}(300\text{ d})$.
  B uses $r=0.25$.
- **Secondary metrics:** detection lead or lag (h); VFA (mg COD/L); alkalinity
  (meq/L); methane (Nm$^3$/d); lost feed (kg COD); false alarms/y; unsafe feed
  actions; assay and compute resources.
- **Protected gates:** no increase in unsafe feed actions; COD and alkalinity
  relative closure each below $10^{-6}$; full recovery horizon
  retained.
- **Stopping/abstention:** a state interval outside the preregistered safe set
  invokes the frozen conservative feed policy. An arm cannot gain by permanent
  zero feed because lost feed remains dimensioned inside $L_s$.
- **Novelty/kill:** C must beat or resource-dominate the full ADM1/EKF null;
  pH-plus-one-extra-threshold is not a novel composition.
- **Artifacts:** `adm1-world.json`, `feed.parquet`, `sensor-state.parquet`,
  `assays.jsonl`, `actions.parquet`, `closure.csv`, `upsets.csv`.

### ENV-T08 — Transformation-product and effect closure

- **Claim:** existing `C-1285`; claim number `1477` remains unused.
- **Primary unit and units:** one seed containing 24 treatment episodes;
  concentration (micrograms/L), TOC (mg C/L), mass (mg), ozone (kg), simulated
  electricity (kWh), and a preregistered dimensionless effect index.
- **Frozen reaction graph:** each of 24 episodes draws a target node count
  $N\sim U_{\mathbb Z}\{20,80\}$ and
  $P\sim U_{\mathbb Z}\{4,\min(15,N)\}$ roots. A root formula
  $(C,H,N,O,X)$ draws integers from respectively 1--30, 2--60, 0--5, 0--20,
  and 0--4, rejecting formula mass outside 50--600 g/mol using atomic weights
  12.011, 1.008, 14.007, 15.999, and 35.45. Root concentration is log-uniform
  0.01--10 micrograms/L. The lowest-hash splittable leaf is expanded until
  exactly $N$ nodes exist. It draws
  $d\sim U_{\mathbb Z}\{1,\min(3,N-N_{current})\}$ children, CO$_2$ count
  uniformly from 0 through $\lfloor0.3C\rfloor$, water count uniformly from 0
  through $\lfloor H/2\rfloor$, and oxidant-O count uniformly from 0 through 40.
  The remaining nonnegative $(C,H,N,O,X)$ vector after adding oxidant O and
  removing CO$_2$ and H$_2$O is partitioned among $d$ ordered children by
  sequential hash-keyed binomial draws. Reject until every child has positive
  formula mass and complete C/H/N/O/X closure is within integer equality.
  Products are therefore generated by, rather than independently assigned to,
  reactions; the result is an acyclic rooted forest with one incoming reaction
  per product. CO$_2$, H$_2$O, oxidant, and every product remain explicit ledger
  rows.

  Each internal-node reaction has $k_r\sim\operatorname{logU}(10^{-4},1)$ per
  exposure unit. Draw oxidation horizon $H_e\sim\operatorname{logU}(0.25,24)$ h
  and total exposure $E_e\sim\operatorname{logU}(0.1,100)$ exposure units; set
  $e(t)=E_e/H_e$ h$^{-1}$ for $0\le t<H_e$ and zero afterward. The truth solver
  integrates

  $$
  \dot n_i=-\sum_{r\in out(i)}k_r e(t)n_i+
  \sum_{r:j\to i}\nu_{r,i}k_r e(t)n_j
  $$

  with adaptive RK45 relative tolerance $10^{-9}$ and absolute tolerance
  $10^{-12}$ mol/L from the root concentrations converted with their formula
  masses; $n_i$ is mol/L, $e(t)$ is h$^{-1}$-scaled exposure, and
  $\nu_{r,i}=1$ for each generated child in its single balanced parent reaction.
  DOC is $U(1,20)$ mg C/L, bromide $U(0,2)$ mg/L, and pH $U(6,9.5)$.
  Matrix suppression multiplies analytical response by a
  seed-frozen $U(0.5,1)$ factor. Episode water volume is log-uniform 10--10,000
  m$^3$; synthetic ozone dose is
  $m_{O3}=E_eV_e\xi$, with
  $\xi\sim\operatorname{logU}(10^{-4},10^{-2})$ kg/(m$^3$ exposure unit), and
  simulated electricity is $U(5,20)m_{O3}$ kWh. Post-treatment type is uniformly
  absent, biological, or sorptive and age is $U(0,30)$ d. For each product,
  $k_{post}\sim\operatorname{logU}(10^{-4},1)$ d$^{-1}$; the fraction
  $1-e^{-k_{post}t}$ transfers to explicit CO$_2$/inorganic rows for biological
  treatment or to a closed media-inventory row for sorption. Absent treatment
  has $k_{post}=0$. Sorptive media capacity is
  $\operatorname{logU}(10^{-3},1)$ kg captured formula mass/kg media, so charged
  media mass is terminal captured kg divided by that capacity. Formula atoms,
  carbon, water, oxidant, CO$_2$, and media
  inventories are retained through the episode terminal record.
- **Frozen assay and effect map:** all parents form the target panel. The fixed
  non-target panel is the lowest-hash 16 products, or all products if fewer;
  TOC and four effect channels complete B's battery. Compound LODs are
  log-uniform 0.001--0.1 micrograms/L, measurement CV is 5%, and sub-LOD values
  are intervals $[0,\mathrm{LOD}]$. Target and TOC assays take 4 h, non-target
  assays 48 h, and effect assays 24 h; each consumes one assay unit, while a
  non-target or effect assay consumes four material units. Effect truth is

  $$
  E=\max\left[0,\sum_i a_i\frac{c_i}{C_i^*}+
  \sum_{(i,j)\in\mathcal I}\gamma_{ij}
  \sqrt{\frac{c_i c_j}{C_i^*C_j^*}}\right],
  $$

  where $c_i$ is formula-mass concentration derived from $n_i$, and
  $C_i^*\sim\operatorname{logU}(0.01,10)$ micrograms/L,
  $a_i\sim\operatorname{logU}(10^{-3},1)$ then normalized to sum to one, and
  $U_{\mathbb Z}\{0,20\}$ hash-selected interaction pairs have
  $\gamma_{ij}\sim U(-0.1,0.3)$.
  The four assay channels are fixed random nonnegative projections of the
  species terms using independent exponential-rate-one weights normalized to
  unit sum, with 5% Gaussian error. Arms know
  the development calibration but not evaluator-only unassayed species,
  interaction coefficients, or confirmation graph.

  The calibration generator creates a fixed 128-pseudo-species formula library
  with the root-formula law above. Lowest formula-hash ranks 1--32 are its fixed
  target panel, ranks 33--64 its fixed non-target panel, and ranks 65--128 are
  unassayed species. Each of 256 development mixture pairs includes every
  library species independently with probability 0.15, resampling until 5--30
  are present with at least one target and one non-target. Its paired influent
  concentrations $c_i^{in}$ are log-uniform 0.001--10 micrograms/L. One
  hash-keyed $R_i\sim U(0,1)$ per present species gives the treated sample
  $c_i^{out}=R_ic_i^{in}$; absent species have both concentrations zero. Thus
  every residual has a declared paired baseline rather than a free-standing
  post-treatment value.

  Assign one fixed species LOD from the episode's log-uniform 0.001--0.1
  micrograms/L law. For each influent or treated compound sample independently,
  draw matrix-response $s\sim U(0.7,1)$ and report
  $sc_i(1+\epsilon_i)$ with $\epsilon_i\sim N(0,0.05^2)$, clipped at zero and
  censored to $[0,\mathrm{LOD}_i]$ below LOD. Paired TOC is the formula-carbon
  sum over all 128 species with independent 5% Gaussian relative error clipped
  at zero. The post-treatment concentrations independently draw $a_i$ and
  $U_{\mathbb Z}\{0,20\}$ interactions and generate truth $E$ and the four
  effect readings by the episode equations. Its seven fixed regression features
  are (i) treated target-panel carbon divided by paired influent target-panel
  carbon, (ii) above-LOD treated non-target-panel carbon divided by paired
  influent non-target-panel carbon, (iii) treated TOC divided by paired influent
  TOC, and (iv--vii) the four treated effect-channel readings. Compound-carbon
  sums use each interval's upper endpoint and each denominator is
  $\max(U_{in},10^{-12}\ \text{micrograms C/L})$; TOC uses its clipped numeric
  reading. These complete mixture,
  assay, feature, and effect records—not an unspecified external dataset—form
  the calibration set. For each arm, effect
  intervals use a frozen split-conformal map: the lowest-hash 128 of 256
  development calibration mixtures fit nonnegative ridge regression with
  penalty $10^{-3}$ after unit-standardization; the other 128 supply the
  absolute-residual quantile at rank
  $\min\{128,\lceil0.99(128+1)\rceil\}=128$, the largest calibration residual.
  Add that radius to the fitted effect
  to obtain the upper bound. An unidentified-carbon upper bound assigns every
  sub-LOD interval its upper endpoint and every unassayed carbon atom the
  residual between influent carbon and measured products plus CO$_2$, clipped
  to 0--100%. Calibration split, feature order, ridge solver tolerance
  $10^{-12}$, and clipping are identical across arms. If a paired influent
  parent assay is below LOD, percentage removal is undefined and A must return
  `unresolved`; it cannot treat the upper endpoint as a detected baseline.
- **Decision and resource map:** A declares `safe` when every measured parent
  falls at least 80% and remains below its LOD. B applies the fixed battery and
  declares `safe` only when its 99% upper effect bound is below 1 and its upper
  unidentified-carbon fraction is at most 10%. C may adaptively request from
  the same target/non-target/TOC/effect assay menu but may not exceed B's assay
  count or receive a shorter latency. Other outcomes are `unresolved` and
  invoke the same frozen no-release/post-treatment fallback. Each assay,
  latency, ozone dose, media mass, fallback hour, and simulated kWh is logged.
  The decision clock starts at the post-treatment sample: A and B order their
  frozen panels immediately; C may order at hour 0 and once again at hour 48.
  Every arm must issue `safe` or `unresolved` by hour 96; an assay still pending
  at that deadline contributes its full cost but cannot support `safe`.
- **Arms:** A uses parent-removal percentage; B uses a kinetic/speciation model
  plus fixed target, non-target, mass, and effect battery; C uses
  P-007/P-009/P-013 active assay allocation and a versioned product graph.
- **Mature null:** B receives the full fixed assay panel and the same treatment,
  matrix, and post-treatment-age observations available to C.
- **Transfer family:** new product routes, matrix suppression, aged post-
  treatment, and product interactions absent from development.
- **Primary metric and threshold:** evaluator truth marks an episode unsafe when
  $E\ge1$ or more than 10% of attributable influent carbon remains in
  non-mineralized species outside B's frozen target/non-target reference panel.
  With truth label $z_e$ and decision $d_e$, freeze

  $$
  L_s=\frac{1000}{24}\sum_{e=1}^{24}
  \mathbf 1\{d_e=\text{safe}\land z_e=\text{unsafe}\}
  $$

  false-safe declarations per 1,000 episodes. Invalid element closure,
  non-finite intervals, a missing terminal decision, or suppressed failed
  episode receives $L_s=1000$. B uses $r=0.25$.
- **Secondary metrics:** parent and product concentration (micrograms/L); TOC
  (mg C/L); attributable-carbon closure (%); effect index; ozone (kg); assay and
  post-treatment media count/kg; simulated electricity (kWh).
- **Protected gates:** the simultaneous upper 99% bound for the paired seed
  contrast $L_{C,s}-L_{B,s}-0.5$ false-safe episodes per 1,000 must be at most
  zero; represented-species elemental closure below
  $10^{-6}$; unidentified mass reported separately.
- **Stopping/abstention:** more than 10% unidentified attributable carbon or an
  effect interval crossing 1.0 forces `unresolved`, never `safe`. `Unresolved`
  carries the safe-fallback service and assay cost and remains subject to the
  common answer-coverage gate, so always abstaining cannot win.
- **Novelty/kill:** C must reduce fixed-panel resource use or false-safe loss
  against B. Existing C-1285 remains the parent claim; this track cannot create
  a duplicate principle.
- **Artifacts:** `reaction-graph.enc`, `treatment.jsonl`, `target-assays.csv`,
  `nontarget.parquet`, `effects.csv`, `element-closure.csv`, `decisions.jsonl`.

### ENV-T09 — Lifecycle, substitution, and rebound

- **Claim:** `C-1478`.
- **Primary unit and units:** one 20-year monthly service/counterfactual world;
  compliant service and abstraction (m$^3$), electricity (kWh), GHG
  (kg CO$_2$e), nutrients (kg N, kg P), and cost (constant EUR$_{2026}$).
- **Frozen demand and asset DGP:** generate baseline ID 0 and
  $U_{\mathbb Z}\{2,7\}$ alternatives.
  Month $t\in\{0,\ldots,239\}$ has $\Delta=365.25/12$ d. Draw initial population
  $P_0\sim\operatorname{logU}(10^4,10^6)$ and annual growth
  $g_P\sim U(-0.01,0.02)$, then $P_t=P_0(1+g_P)^{t/12}$. Baseline per-capita
  demand is $d_{0,t}=d_0[1+a\sin(2\pi t/12+\phi)]$ with
  $d_0\sim U(80,200)$ L/person/d, $a\sim U(0,0.30)$, and
  $\phi\sim U(0,2\pi)$. Draw one time-invariant generalized cost
  $c_a\sim\operatorname{logU}(0.5,5)$ EUR$_{2026}$/m$^3$ per alternative and an
  elasticity, with equal probability, from $U(-0.4,-0.1)$, $\{0\}$, or
  $U(0.1,0.4)$. Demand is

  $$
  d_{a,t}=\operatorname{clip}\left[
  d_{0,t}(c_a/c_0)^{\epsilon_a},50,300\right]
  \quad\text{L person}^{-1}\text{d}^{-1}.
  $$

  Requested monthly volume is
  $V^{dem}_{a,t}=P_td_{a,t}\Delta/1000$ m$^3$. Capacity is $U(0.9,1.3)$ times the
  maximum baseline daily demand; baseline is fixed at 1.3, legally eligible,
  and always available/compliant so it is feasible by construction. Each other
  alternative has a Bernoulli(0.9) legal-eligibility flag fixed before selection.
  Asset age
  advances monthly. Resource efficiency is
  $\eta^{res}_{a,t}=\max[0.7,1-\delta_a age_t]$ with
  $\delta_a\sim U(0,0.01)$ y$^{-1}$. A single lifetime
  $T_a\sim U(8,30)$ y schedules replacement at month
  $m_{a,k}=\lceil12kT_a\rceil$ for every positive integer $k$ with
  $m_{a,k}<240$; one draw $f^{rep}_a\sim U(0.2,1)$ supplies both the capital and
  material replacement fraction, avoiding duplicate burdens. Replacement
  resets age and efficiency, adds downtime $U(1,90)$ d clipped to that month,
  and is an exact ledger event. Retirement at month 240 adds decommissioning and
  recycling rows.
- **Frozen service, substitution, and inventory map:** every non-baseline
  alternative starts available and compliant. Availability has monthly
  up-to-down probability $U(0.001,0.02)$ and down-to-up probability $U(0.2,0.9)$;
  conditional on being up, quality has compliant-to-noncompliant probability
  $U(0.001,0.02)$ and recovery probability $U(0.2,0.9)$. Hash-keyed uniforms
  advance both chains once per month. Let $d^{down}_{a,t}=0$ except in a
  replacement month, when it is that event's sampled downtime clipped to
  $\Delta$. Gross production is

  $$
  V^{gross}_{a,t}=A_{a,t}(1-d^{down}_{a,t}/\Delta)
  \min(V^{dem}_{a,t},q_{cap,a}\Delta).
  $$

  Compliant service is
  $S_{a,t}=Q_{a,t}V^{gross}_{a,t}$ and
  noncompliant volume is $(1-Q_{a,t})V^{gross}_{a,t}$. Noncompliant volume is
  never service. Reuse fraction $r_a\sim U(0,1)$ makes delivered compliant reuse
  $r_aS_{a,t}$ and displaces potable abstraction only up to that volume.
  Physical recovery factors $y_{N,a}\sim\operatorname{logU}(10^{-4},0.05)$ kg
  N/m$^3$ and $y_{P,a}\sim\operatorname{logU}(10^{-5},0.01)$ kg P/m$^3$ give
  $M_{rec,N}=y_NS$ and $M_{rec,P}=y_PS$. Recovered nutrient or
  material uptake is
  $u_{a,t}=\operatorname{logit}^{-1}(\alpha_a+z_t)$, where
  $\alpha_a=\operatorname{logit}(u_{a,0})$ and initial uptake
  $u_{a,0}\sim U(0.01,0.99)$, and
  $z_t=0.9z_{t-1}+\eta_t$, $\eta_t\sim N(0,0.15^2)$, with $z_0$ drawn from its
  stationary normal distribution. Actual avoided production
  is $u_{a,t}$ times physically recovered mass; unused recovery receives no
  credit.
- **Frozen lifecycle equations:** draw base treatment electricity
  $e_a\sim U(0.2,2)$ kWh/m$^3$ and chemical use
  $m_a\sim\operatorname{logU}(0.01,1)$ kg/m$^3$; realized $E_{a,t}$ and
  $M_{chem,a,t}$ equal these factors times gross production divided by
  $\eta^{res}_{a,t}$. Direct-emission factor
  $g_{direct,a}\sim\operatorname{logU}(0.001,1)$ kg
  CO$_2$e/m$^3$ gives $G_{direct,a,t}=g_{direct,a}V^{gross}_{a,t}$. Draw
  $g_{cap,a}\sim U(100,2000)$ kg CO$_2$e per (m$^3$/d) of design capacity and set
  $G_{cap,a}=g_{cap,a}q_{cap,a}$. Replacement uses the already drawn
  $f^{rep}_a$ fraction of
  initial construction. Retirement burden is $U(0.02,0.20)$ of initial
  construction and recycling credit is $U(0,0.20)$ of it. Grid intensity is
  $g_t=g_0\exp[-\kappa(t/12\text{ y})]$ with
  $g_0\sim U(0.02,0.8)$ kg CO$_2$e/kWh and
  $\kappa\sim U(0,0.10)$ y$^{-1}$. Chemical and displaced-product factors are
  independently log-uniform 0.1--10 kg CO$_2$e/kg. Initial capital is
  $U(500,5000)$ EUR$_{2026}$/(m$^3$/d) times $q_{cap}$. Fixed-O&M fraction
  $f^{OM}_a\sim U(0.01,0.08)$ applies to initial capital/y, electricity price
  $p_E\sim U(0.05,0.40)$ EUR$_{2026}$/kWh, chemical price
  $p_C\sim\operatorname{logU}(0.1,10)$ EUR$_{2026}$/kg, and each recovered-
  product credit $p_m\sim U(0,2)$ EUR$_{2026}$/kg applies only to mass actually
  taken up. Decommissioning $C_{decom}$ is $U(0.05,0.30)$ of initial capital and
  recycling credit $C_{recycle}$ is $U(0,0.20)$ of it. For alternative $a$,

  $$
  G_a=G_{cap,a}+G_{replace,a}+G_{retire,a}+
  \sum_t\left(E_{a,t}g_t+M_{chem,a,t}g_{chem,a}+G_{direct,a,t}
  -\sum_{m\in\{N,P\}}u_{a,t}M_{rec,m,a,t}g_{disp,m,a}\right),
  $$

  in kg CO$_2$e. With replacement-event set $\mathcal R_a$, constant-EUR cost is

  $$
  C_a=C_{cap,a}+\sum_{r\in\mathcal R_a}f^{rep}_aC_{cap,a}
  +20f^{OM}_aC_{cap,a}+\sum_t(p_EE_{a,t}+p_CM_{chem,a,t}
  -\sum_{m\in\{N,P\}}p_m u_{a,t}M_{rec,m,a,t})
  +C_{decom,a}-C_{recycle,a}.
  $$

  Every price and fraction is the seed-fixed draw above; no discounting or
  carbon price is used. Separate unweighted rows hold kWh, kg N,
  kg P, abstraction m$^3$, noncompliant volume, and compliant-service m$^3$; no
  row may migrate between boundaries after development.
- **Observation and selection map:** before the scored horizon, generate an
  independent 24-month pilot from the same alternative parameters and reset all
  Markov and uptake states afterward. Pilot demand, service, electricity, and
  potable abstraction arrive monthly with 2% Gaussian CV; direct emissions and
  chemical inventories quarterly with 10% CV; construction rows are exact; and
  uptake is assayed quarterly with SD 0.05 clipped only for the reported physical
  interval, while the raw value is retained. A scores plant-gate operating GHG
  at month-0 grid intensity, assumes $u=1$ and 1:1 compliant-reuse displacement,
  and omits capital. B runs exactly 4,096 lifecycle trajectories with constant
  uptake fixed to the pilot mean. C runs the same 4,096 trajectories with the
  stated uptake-state and demand-response transitions. Simulation seeds are
  `SHA256("ENV-T09|seed|arm|draw")`. A calls an eligible alternative feasible
  when nameplate capacity covers its deterministic demand and ignores future
  failures. B and C require at least 95% of their 4,096 draws to satisfy every
  scored feasibility constraint. Each chooses the lowest predicted GHG intensity
  among predicted-feasible alternatives, falls back to baseline if none, and
  breaks exact ties by stable alternative hash. The choice is terminal before
  the scored 20-year truth is exposed.
- **Arms:** A is the plant-gate score above; B is the DIN EN ISO
  14040/14044-compatible fixed-uptake lifecycle Monte Carlo; C uses P-013
  versioned service, measured uptake, and compensation-aware transitions.
- **Mature null:** B has the same lifecycle inventory, scenario ranges,
  constraints, and observation dates as C. C cannot win through a wider system
  boundary unavailable to B.
- **Transfer family:** correlated grid/demand changes, policy intervention,
  altered substitution markets, and a held-out negative-rebound family.
- **Primary metric and threshold:** an alternative is feasible only if its
  20-year compliant service is at least 99% of baseline, quality violations are
  at most 0.1% of demanded volume, constant-EUR lifecycle cost is at most 150%
  of baseline, and its seed-frozen legal-eligibility flag is true. Baseline is
  generated to be feasible. Define $I_a=G_a/S_a$ in kg CO$_2$e per m$^3$
  compliant service and

  $$
  L_s=I_{\widehat a}-\min_{a\in\mathcal F}I_a.
  $$

  A missing required inventory interval, infeasible selection, zero service,
  non-finite result, or absent terminal selection receives
  $L_{fail}=\max_{a\in\mathcal F}I_a-\min_{a\in\mathcal F}I_a+1$ kg
  CO$_2$e/m$^3$. B uses $r=0.25$.
- **Secondary metrics:** potable-displacement ratio (m$^3$/m$^3$ reuse); net
  electricity (kWh/m$^3$ service); abstraction (m$^3$); GHG (kg CO$_2$e);
  nutrient substitution (kg N, kg P); lifecycle cost (EUR$_{2026}$); compliant
  service (m$^3$); interval coverage; alternative-ranking accuracy.
- **Protected gates:** the feasibility constraints above are absolute; no single
  weighted sustainability score is allowed. Potable abstraction, kWh, kg N,
  kg P, EUR$_{2026}$, and compliant service remain separately reported.
- **Stopping/abstention:** missing direct-emission, construction, substitution,
  or demand-response intervals prevents a net-benefit declaration. No universal
  rebound coefficient is emitted.
- **Novelty/kill:** C must beat or resource-dominate the complete versioned
  lifecycle null; a dynamic dashboard at inferential parity is killed.
- **Artifacts:** `functional-unit.json`, `inventory.parquet`,
  `counterfactuals.jsonl`, `demand.parquet`, `lifecycle-results.csv`,
  `uncertainty.jsonl`.

### ENV-T10 — Context-qualified centralisation

- **Claim:** `C-1479`.
- **Primary unit and units:** one 30-year spatial service world; compliant
  service (m$^3$), noncompliant delivered volume (m$^3$), outage exposure
  (person h), repair time (h), pipe (km), material (kg), electricity (kWh),
  operator time (h), GHG (kg CO$_2$e), and cost (EUR$_{2026}$).
- **Frozen spatial and facility DGP:** draw population
  $P\sim\operatorname{logU}(10^4,10^6)$ and density
  $\rho_P\sim\operatorname{logU}(5,20000)$ km$^{-2}$, giving square service
  area $A=P/\rho_P$. Draw $N\sim U_{\mathbb Z}\{100,2000\}$ demand nodes and
  place them by seeded Poisson-disc
  sampling with minimum separation $0.1\sqrt{A/N}$ km; allocate population with
  a Dirichlet$(2,\ldots,2)$ vector. Join each
  node to its four nearest neighbours, retain the minimum spanning tree, and
  multiply each edge's Euclidean road length by an independent $U(1,1.5)$.
  Elevation is a zero-mean
  Gaussian field with SD $U(5,200)$ m and exponential correlation length
  $\operatorname{logU}(0.1,10)$
  km. Draw candidate-plant count $U_{\mathbb Z}\{5,30\}$ and depot count
  $U_{\mathbb Z}\{1,5\}$; the corresponding lowest-hash nodes receive those roles.
  Anchor index 0 opens one packaged plant at every demand node, assigns each node
  to itself, has no distribution pipe or pump, capacity 1.3 times that node's
  peak demand, 48 h initially full storage, fallback fraction 1, monitoring
  fraction 1, backup-power fraction 1, 90 design-flow days of consumable, three
  shifts, and two same-class spares per plant. Every depot serves its nearest
  nodes. Before any arm receives a world, resample it if this anchor under policy
  A fails any frozen static or numerical feasibility gate on either the 16
  design scenarios or the sealed 64 evaluator scenarios. The conditioning event
  and rejected hashes are recorded, but evaluator fields remain hidden from all
  arms; therefore both selection and evaluator feasible sets contain anchor 0.
- **Frozen finite architecture catalogue and hydraulics:** an architecture is a committed tuple
  of opened plants, node assignments, pipe paths and diameters from
  $\{0.05,0.10,0.20,0.40,0.80\}$ m, pump locations, 0--48 h local storage,
  local fallback capacity, monitoring points, backup power, consumable stock,
  operator shifts, and spare stock.
  The candidate set is finite and has exactly 33 tuples. Index 0 is the anchor.
  Index 1 opens the candidate site minimizing population-weighted total hydraulic
  distance, assigns every node to it, uses capacity 1.3 times aggregate peak,
  48 h plant storage, fallback fraction 0.25 at the lowest-hash nodes, monitoring
  and backup-power fractions 1, 90 stock days, three shifts, and two same-class
  spares. Its pipes use shortest road-tree paths and the same smallest-feasible-
  diameter and positive-head pump rules below. Indices 2--32 follow this
  generator. Draw plant count uniformly from 1 through
  $\min(16,N_{site})$, select that many sites by the lowest values of
  `SHA256(seed|k|site-ID)`, assign each demand node to the selected site with
  minimum $d_h=d_{road}+(0.01\text{ km/m})\max(\Delta z,0)$, choose the smallest pipe
  diameter keeping design velocity at most 2 m/s, and hash-draw storage from
  $\{0,6,12,24,48\}$ h, fallback fraction from $\{0,0.25,0.5,1\}$, monitoring
  fraction from $\{0.25,0.5,1\}$, backup-power fraction from
  $\{0,0.5,1\}$, consumable stock from $\{0,7,30,90\}$ design-flow days,
  shifts from $\{1,2,3\}$, and spare count from
  $\{0,1,2\}$ per installed equipment class at each opened plant. Pipe paths are
  shortest paths in the road tree;
  every selected storage duration $h_{s,k}$ is attached to opened plant $k$ and
  converted to physical capacity by
  $V_{max,k}=(h_{s,k}/24\ \mathrm{h/d})q^{peak}_{assigned,k}$ m$^3$, where
  $q^{peak}_{assigned,k}$ is the sum of architecture-independent peak daily
  demands, in m$^3$/d, of nodes assigned to $k$. Thus the anchor's self-assigned
  48 h uses each node's own peak, index 1's 48 h uses its aggregate assigned
  peak, and indices 2--32 use one `tuple|site`-hash draw per opened plant. Storage
  starts ordinary operation and each isolated evaluator scenario full at
  $V_{max,k}$ with
  $C^{store}_{k,0}=0.5\min_{i\mapsto k}C_{lim,i}$; only subsequent compliant
  surplus can refill it. Capital and material multipliers consume this same m$^3$
  capacity, never the hour count.
  Pump installation follows the signed hydraulic rule below. Monitoring
  points comprise one mandatory outlet monitor at every opened plant and local
  fallback plus the lowest tuple-hash
  $\lceil f_{mon}N\rceil$ demand nodes. Local fallback is installed at the
  lowest tuple-hash $\lceil f_fN\rceil$ demand nodes, each with design capacity
  equal to that node's architecture-independent peak daily demand; $f_{mon}$
  and $f_f$ are the tuple's selected monitoring and fallback fractions. Every
  point and fallback unit enters the capital, material, lifetime, maintenance,
  and hazard ledgers. Invalid
  tuples remain in the catalogue but are infeasible. Architecture hash order is
  the only tie-break. Catalogue indices 0 and 1 supply A's local and central
  endpoints. All arms receive this same catalogue, 16 hash-generated design
  hazard scenarios, and ordinary monthly forcing; the 64 evaluator scenarios
  remain sealed. Facility physics, unit costs, removal, material, lifetime, and
  quality draws are keyed by `seed|site-ID|asset-class` and reused whenever that
  asset appears in different tuples; tuple fields do not redraw a favourable
  plant.
  Each node draws monthly baseline demand $U(80,200)$ L/person/d, seasonal
  amplitude $a_i\sim U(0,0.30)$, and phase $\phi_i\sim U(0,2\pi)$. For month
  $m$, set $d_{i,m}=d_{i,0}[1+a_i\sin(2\pi m/12+\phi_i)]$ L/person/d,
  $q^{dem,d}_{i,m}=P_id_{i,m}/1000$ m$^3$/d, and operational demand
  $\bar q^{dem}_{i,m}=q^{dem,d}_{i,m}/24$ m$^3$/h; hold it constant within the
  month. For global hour $h$, use
  $m(h)=\lfloor h/[24(365.25/12)]\rfloor$ and the month containing that hour's
  opening; the sinusoid already repeats because of its $2\pi m/12$ argument.
  Architecture-independent peak daily demand is
  $q^{peak}_i=\max_{m=0}^{11}q^{dem,d}_{i,m}$. Pipe flow
  obeys continuity and Darcy--Weisbach head loss
  $h_f=0.02(L/D)(v^2/2g)$ with $g=9.80665$ m/s$^2$; for pumped volume $V_p$
  in m$^3$ and $\rho_w=1000$ kg/m$^3$, electricity is
  $\rho_wgV_p\max(h_f+\Delta z,0)/(0.70\times3.6\times10^6)$ kWh. Each installed
  road-tree segment is one physical bidirectional pipe with area
  $A_e=\pi D_e^2/4$, operational capacity
  $q_{e,max}=7200A_e$ m$^3$/h, one signed net flow
  $f_e\in[-q_{e,max},q_{e,max}]$ in m$^3$/h, and no simultaneous counterflow.
  For proposed direction $u\to v$, use $v_e=|f_e|/(3600A_e)$ m/s and
  $h^{req}_{uv}=0.02(L_e/D_e)(v_e^2/2g)+z_v-z_u$. During catalogue construction,
  compute each direction's design flow in m$^3$/h as the sum of assigned peak
  daily flows whose source-to-node path uses it, divided by 24; install one reversible 70%-efficient pump iff any
  used direction has $h^{req}_{uv}>0$ at that design flow. At operation, a
  direction with $h^{req}_{uv}\le0$ is gravity-feasible through a passive bypass;
  a positive-head direction is feasible only when that installed pump is
  available and pays the hydraulic-energy equation above. `assigned` exposes
  only the original source-to-node directions; `shared` may expose either
  physically feasible direction subject to the single signed capacity. For catalogue
  indices 2--32, plant design capacity is $U(0.8,1.5)$ times assigned peak
  demand; indices 0 and 1 retain their explicitly frozen 1.3 multiplier and are
  not redrawn here. This $q_{cap}$ is nominal treatment design flow in m$^3$/d,
  not a hard hydraulic stop. Set $\bar q_{cap}=q_{cap}/24$ and
  $\bar q_{hyd}=1.5q_{cap}/24$ in m$^3$/h. Freeze operational plant-flow support
  $0\le\bar q\le\bar q_{hyd}$; the source edge in every max-flow uses
  $\bar q_{hyd}$, reduced by availability or backup-power fraction where
  applicable. Flow above $\bar q_{cap}$ is treated but follows the overload branch of the removal
  equation; demand above $\bar q_{hyd}$ is unserved and no undeclared bypass source is
  created. Treatment removal is
  $\eta(\bar q)=\operatorname{clip}[\eta_0-0.15(\bar q/\bar q_{cap}-1)_+,0,1]$ with
  $\eta_0\sim U(0.95,0.9999)$.

  For tuple backup fraction $f_b>0$, install one typed backup unit for every
  plant, local fallback, and pump; $f_b=0$ installs none. Its base daily flow is
  $q^{base}_a=1.5q_{cap,a}$ for a plant, $q^{peak}_i$ for fallback $i$, and
  $q^{base}_e=24\max(q^{design}_{e,+},q^{design}_{e,-})$ m$^3$/d for a pump,
  where the directional pump design flows above are in m$^3$/h. Freeze protected
  capacity $q^{prot}_a=f_bq^{base}_a$ m$^3$/d. Plant backup is at its plant node,
  fallback backup at its demand node, and pump backup at the pipe midpoint; each
  is a separate cost/material/lifetime/hazard asset. During grid loss, an
  available plant or positive-head pump direction is capped at
  $q^{prot}_a/24$ m$^3$/h, while a gravity direction needs no power. Local
  fallback is always backup-powered and is usable only up to its later-declared
  $\bar q^{fb}_i$ while its backup unit is available. Node influent concentration is
  $C_{in,i,0}\sim\operatorname{logU}(1,100)$ mg/L and monthly
  $z_t=0.8z_{t-1}+\epsilon_t$, $\epsilon_t\sim N(0,0.15^2)$, starts stationary
  and multiplies it by $\exp(z_t-\operatorname{Var}(z)/2)$. Plant influent is
  the flow-weighted mixture. Each demand node has the architecture-independent
  threshold $C_{lim,i}=u_i(1-\eta_{0,i}^{anchor})C_{in,i,0}$ with
  $u_i\sim U(1.10,2)$; a delivery to node $i$ is compliant only at or below that
  threshold. The local anchor uses capacity 1.3 times peak demand, so its nominal
  outlet is below the threshold; overload, forcing, or outages can still violate
  it. Every influent, effluent,
  stored, bypassed, and fallback pollutant mass is integrated in mg and kg rows.
- **Frozen cost and lifecycle transitions:** for each diameter class, pipe
  capital and material are independently $\operatorname{logU}(100,2000)$
  EUR$_{2026}$/m and $\operatorname{logU}(5,500)$ kg/m, then isotonic-sorted by
  diameter. Plant capital is
  $C_{plant}=c_0[q_{cap}/(1000\text{ m}^3/\text{d})]^{0.7}$ with
  $c_0\sim\operatorname{logU}(10^5,10^8)$ EUR$_{2026}$, and operator work costs
  $U(30,100)$ EUR$_{2026}$/h. Plant material is
  $U(100,1000)$ kg per (m$^3$/d) design capacity; storage, fallback, and monitoring
  capital are respectively $\operatorname{logU}(10,1000)$ EUR$_{2026}$/m$^3$,
  $\operatorname{logU}(100,2000)$ EUR$_{2026}$/(m$^3$/d), and
  $\operatorname{logU}(1000,100000)$ EUR$_{2026}$ per point. Pump capital and
  material are $\operatorname{logU}(1000,10^6)$ EUR$_{2026}$ and
  $\operatorname{logU}(100,10000)$ kg per installed pump. Depot/crew capital and
  material are respectively $\operatorname{logU}(10^4,10^6)$ EUR$_{2026}$ and
  $\operatorname{logU}(100,10000)$ kg per active shift. Storage,
  fallback, and monitoring material are respectively
  $\operatorname{logU}(10,200)$ kg/m$^3$,
  $\operatorname{logU}(1,50)$ kg/(m$^3$/d), and
  $\operatorname{logU}(1,100)$ kg/point. Freeze an equipment compatibility class
  as `(asset kind, catalogue/model ID, nominal capacity, specification vector)`;
  continuously sized assets receive a frozen model ID that is also assigned to
  every spare generated for that exact specification. `Same class` below means
  equality of this complete tuple, not merely both being pumps, plants, storage,
  or backup units. Each initial spare duplicates its compatibility class's full
  nominal capacity, initial capital, and material row. Backup power costs
  $\operatorname{logU}(100,2000)$ EUR$_{2026}$/(m$^3$/d) protected capacity and
  $\operatorname{logU}(1,50)$ kg/(m$^3$/d); multiply both by that unit's frozen
  $q^{prot}_a$ and sum once across installed units (zero when $f_b=0$).
  Consumable-store capital is
  $\operatorname{logU}(1,10)$ EUR$_{2026}$/kg capacity, where capacity equals
  chemical dose times design flow times selected stock days. Backup electricity
  costs $U(0.2,0.8)$ EUR$_{2026}$/kWh and emits $U(0.2,1)$ kg CO$_2$e/kWh.
  Embodied factors are
  $\operatorname{logU}(0.5,5)$ kg CO$_2$e/kg. Electricity price is
  $U(0.05,0.40)$ EUR$_{2026}$/kWh and grid intensity is $U(0.02,0.8)$ kg
  CO$_2$e/kWh. Each plant and local fallback draws chemical dose
  $\operatorname{logU}(0.001,0.5)$ kg/m$^3$ and non-pump electricity intensity
  $e_a\sim U(0.1,2)$ kWh/m$^3$. Chemical price is log-uniform 0.1--10
  EUR$_{2026}$/kg, road travel
  costs $U(0.3,2)$ EUR$_{2026}$/km, and fixed O&M is $U(0.01,0.05)$ of installed
  capital/y. Each installed repairable asset—plant treatment train, pump,
  storage unit, fallback unit, monitoring point, backup-power unit, or depot—draws one replacement
  life $T_a\sim U(8,30)$ y and one $f^{rep}_a\sim U(0.2,1)$ that supplies both
  replacement capital and material burden. Its integer service-life threshold is
  $\ell_a=\lceil12T_a\rceil$ months with $\Delta=365.25/12$ d per month: the first
  planned-replacement request enters the ordinary FIFO depot queue at the opening
  of month $\ell_a$. Each such request draws on-site crew work
  $w^{plan}\sim U(2,80)$ h and passive commissioning
  $d^{comm}\sim U(1,90)$ d. The asset remains operational while waiting for a
  unit or crew. When its crew job starts, the unit is consumed, the asset becomes
  unavailable, and the job uses the same travel, shift, pre-emption, and operator-
  cost rules as an equipment repair. After crew work completes, commissioning
  runs for $d^{comm}$ without occupying a crew. If commissioning completes at
  continuous global day $t_c$, physical return and the age reset occur at global
  integer hour $h^{ret}_a=\lceil24t_c\rceil$; define the first calendar-month
  opening not before return as $r_a=\lceil h^{ret}_a/(24\Delta)\rceil$, and let the
  next request enter at the opening of month $r_a+\ell_a$. This recurrence reuses
  the same $\ell_a$ rather than redrawing a favourable life, and no age accrues
  between removal and the return boundary. Unavailable overlap with each month
  reduces that asset's available capacity by the corresponding fraction of
  monthly hours; monthly lifecycle rows aggregate the hourly queue/commissioning
  ledger.

  Lifecycle collisions use one replacement job per asset. A planned due date
  reached while that asset has an open equipment-damage condition, equipment-
  repair request, or equipment-repair commissioning state is suppressed and
  logged without reserving stock or placing an order. A planned job that was
  already requested may not start while an independent hazard impairment is
  active on its asset; its reservation and FIFO position are retained. Completion
  of an equipment repair that consumes a same-class unit is an unplanned
  replacement. At actual restoration hour
  $h^{rest}_a=\lceil\max(t_{on}+d_{event},t_{\mathrm{repair\ complete}})\rceil$ its
  service age resets to zero and its next request enters at month
  $\lceil h^{rest}_a/(24\Delta)\rceil+\ell_a$. By the equipment-target eligibility
  rule below, no planned request, reservation, order, or commissioning state can
  coexist with that equipment repair; encountering such a state invalidates and
  resamples the scenario. No life, work, or commissioning draw is redrawn. These
  rules preclude two concurrent replacement jobs or orders for one asset.

  Spare stock is an integer state per site and exact compatibility class,
  initially equal to the architecture tuple's 0--2 count for every installed
  class at each opened plant; each depot also
  receives that count for the depot-asset class and zero units of every other
  class. A depot's dispatchable same-class pool is exactly
  the sum of unreserved units at plants it serves; a dispatch records and
  decrements the origin plant selected by minimum shortest-road distance from
  that plant to the requesting asset, then by plant hash. A planned replacement
  or equipment repair first reserves one available on-site unit or then the
  selected depot-pool unit. If none exists, it places one dedicated unit order
  with a fixed 90 d lead and is ineligible for crew dispatch until that arrival;
  a planned asset continues operating during this wait, whereas a damaged asset
  remains unavailable. At crew-work start the reserved/dedicated unit is
  consumed. Consuming stock immediately places one separate replenishment order
  with the same 90 d lead; its arrival increments the recorded origin stock only
  up to its initial design count. A dedicated order is installed by its named job
  and never also increments stock. Orders are FIFO by request timestamp then asset
  hash, may be outstanding concurrently, and each charges exactly one
  target asset's $f^{rep}_a$ capital/material row at order time and carries that
  target class's nominal capacity and specification. This is the only restocking
  rule; no emergency unit appears for free. Decommissioning and salvage are independently $U(0.05,0.30)$
  and $U(0,0.20)$ of initial capital. For each plant or fallback, chemical mass
  is its dose times its own treated gross volume and non-pump electricity is
  $e_aV_a$ kWh; pump electricity remains the separate hydraulic row for every
  ordinary and event flow. When grid status is available, all process and pump
  kWh use the grid price/intensity. During grid loss, the backup-supported
  fraction uses the frozen backup price/intensity; unsupported flow capacity is
  zero. No kWh appears in both rows. Total constant-EUR cost is the row sum of initial and replacement
  capital, O&M, electricity, chemical, operator, and travel costs plus
  decommissioning minus salvage. Lifecycle GHG is embodied initial/replacement
  material plus electricity at the applicable grid/backup factor and chemical at
  log-uniform 0.1--10 kg CO$_2$e/kg. Rows evolve monthly for 30 y; replacements
  restore capacity only after the frozen spare/procurement, work, cost, material,
  and downtime transitions above. Open orders and unavailable assets remain in
  the month-360 terminal record.
- **Frozen outage and service map:** design and evaluator scenario generators are
  identical but use disjoint hashes. Each of 16 design and 64 evaluator
  scenarios draws one type uniformly from equipment, flood, grid power,
  communications, consumable, or road/operator access. With
  $H_{30}=30(365.25)(24)$ h, start hour is
  $U_{\mathbb Z}\{0,\lfloor H_{30}-2160\ \mathrm h\rfloor\}$, so the complete 90 d paired event/ordinary window
  remains inside the frozen lifecycle horizon. Equipment selects uniformly from the complete
  installed plant, pump, storage, fallback, monitoring, power, and depot asset
  ledger that is available immediately before onset and has no open planned-
  replacement request, reserved replacement unit, or commissioning state;
  resample the scenario under
  the common generator cap if none exists. Its duration is the ceiling in hours
  of a log-uniform 2--720 h draw. Plants, plant storage, outlet monitors, plant
  backup, and consumable stores use their plant-node coordinate; fallback,
  fallback backup, and demand monitors use their demand-node coordinate; depots
  use their selected node; and a pump plus its backup use the midpoint of its
  road-tree segment. A point asset is
  inside a hazard footprint when its Euclidean distance to the centre is at most
  the radius. A road or pipe edge is inside when its closed line segment
  intersects the closed disk, evaluated by point-to-segment distance; touching
  the boundary counts. Every hazard interval is half-open $[t_0,t_0+d_h)$ on
  this global integer-hour grid. Flood marks every plant, pump, monitor, storage,
  fallback, power unit, depot, and road edge inside its footprint unavailable
  and moves its stored water and pollutant mass to a typed `flood_release` ledger,
  leaving storage volume and mass zero. That released water is not delivered and
  therefore does not enter $N_q$, $A_q$, or $R_q$; its lost service enters
  $H_q$/$\Delta S_q$, while released m$^3$ and kg remain separate environmental
  rows. Every other spatial
  type uses the ceiling in hours of a log-uniform 6--1,440 h draw and
  affects all relevant assets whose coordinates fall inside a centre drawn
  uniformly over the square and radius log-uniform 0.1--50 km. Communications
  removes remote observations/actions but not local fallback. Grid events remove
  grid supply and leave only the tuple's backup-power fraction. Consumable
  events stop replenishment. Every plant and fallback $a$ has its own store and
  never borrows another asset's chemical. Let $q^{design,d}_a$ be plant
  $q_{cap}$ or the fallback node's full peak flow in m$^3$/d. Its capacity and
  ordinary refill rate are
  $M^{chem}_{max,a}=dose_aq^{design,d}_ad_{stock,a}$ kg and
  $r^{chem}_a=dose_aq^{design,d}_a/24$ kg/h. The ordered hourly transition is:
  pre-flow inventory $M^{avail}_a=M_{a,t}$; chemical volume cap
  $V^{chem}_a=M^{avail}_a/dose_a$ m$^3$; source-rate cap equal to the lesser of
  its hydraulic/power cap and $V^{chem}_a/(1\ \mathrm h)$; max-flow realization
  $V_{a,t}$; then $M^-_a=M^{avail}_a-dose_aV_{a,t}$. Finally set
  $M_{a,t+1}=\min(M^{chem}_{max,a},M^-_a+(1\ \mathrm h)r^{chem}_a)$ when
  replenishment is available and $M_{a,t+1}=M^-_a$ when it is not. Thus same-hour
  refill cannot authorize flow, plant $V_{a,t}$ excludes fallback volume, and a
  fallback consumes only its own store. Access events pause affected travel. Each
  event scenario and its paired no-hazard ordinary window clone the same ordinary
  lifecycle state at its start hour and reset available storage and consumable
  stores to their design maxima with the declared $C^{store}_{k,0}$. Both then
  run the same fixed 90 d window; only the event copy receives the hazard. Truth
  availability is sampled at the opening of each global integer hour and applies
  on that hour. Controller actions occur at global hours divisible by 6 and take
  effect immediately; an onset between those boundaries retains the last
  ordinary action until the next boundary. Continuous repair/work completion is
  made physically available at $\lceil t_{complete}\rceil$ h; packet arrival
  keeps its continuous delay and is usable at the first decision boundary whose
  time is at least its arrival. Hourly demand, service, noncompliant delivery,
  and flood-release rows are scored only through hour 2160;
  there is no fictitious post-window demand. If an exogenous equipment damage
  condition remains open at hour 2160, that system design is infeasible in the
  scenario. Also fail when an unavailable asset/job is open in the event copy but
  not in the paired no-hazard ordinary copy at that same terminal; an identical
  planned-replacement state open in both copies is not a hazard failure and has
  already reduced both service ledgers. Cost and material for
  every order already placed remain charged. An open stock-replenishment order
  not tied to an unavailable asset remains a terminal inventory deficit but does
  not by itself fail the scenario.
  For an equipment scenario, the sampled 2--720 h duration is the exogenous
  damage interval and restoration occurs at
  $\max(t_{on}+d_{event},t_{\mathrm{repair\ complete}})$. Thus a short repair cannot erase
  continuing damage and an elapsed damage interval cannot erase a spare/queue
  delay. Footprint effects restore exactly at event end and do not create an
  unstated repair unless the scenario type is equipment.
  An unavailable depot supplies no crew, stock dispatch, or new work. Its
  in-progress job is paused, retains any already reserved spare at that job site,
  and is requeued with its remaining repair-work balance at the available depot;
  old travel progress is discarded and the full round trip from the new depot is
  charged. Choose the available depot
  having minimum shortest-road distance to the affected asset, then lowest depot
  hash. The same rule assigns repair of the depot asset itself. If no depot is
  available, every crew-mediated job remains queued with zero progress: a
  footprint-disabled depot can resume after event end, whereas an equipment-
  disabled sole depot cannot self-repair and remains open at the 90 d terminal.
  On the first depot restoration, queued jobs are reassigned in their original
  FIFO order. Reservation/procurement may occur while a job is queued under the
  unified rule above, but a reservation alone moves no unit. At crew dispatch,
  the origin unit is instantaneously staged at the assigned available depot with
  zero elapsed time, distance, energy, emissions, and cost; this is an explicit
  logical-fungibility abstraction. The crew carries it on the already counted
  outbound depot-to-asset leg, and it reaches the job site when that outbound leg
  completes; the declared depot-to-asset round trip is the only transport row.
  If that depot or access route is unavailable, dispatch and staging cannot occur.
  Repair requests enter a FIFO depot queue, require $U(2,80)$ operator-h, consume
  a same-class spare under the frozen inventory/procurement rule above, and
  include shortest-road travel. With no available spare, work cannot start until
  the ordered unit arrives; the no-spare interval remains outage, unserved
  service, cost, and operator-queue time. Synthetic clock hour 0 is the daily
  schedule origin. With $s\in\{1,2,3\}$ shifts, a depot has exactly one crew
  available in the half-open daily window $[24d,24d+8s)$ h for every integer day
  $d$, and no crew outside it; adjacent shifts hand over with no lost work. A
  job consumes $2d_{road}/(50\ \mathrm{km/h})$ crew-h for outbound-plus-return
  travel and its sampled 2--80 operator-h of repair or planned-replacement work, with both balances paused
  outside the window. Controller-requested pre-emption is permitted only at 6 h
  action boundaries; a shift closing suspends work regardless of that grid and
  the same job resumes at the next coverage opening from its saved balance.
  Unavailable access pauses repair. At each one-hour event step, storage state
  obeys
  $V_{t+1}=\operatorname{clip}[V_t+(1\ \mathrm h)(\dot V_{in}-\dot V_{out}),0,V_{max}]$
  with rates in m$^3$/h; pollutant mass uses the same one-hour multiplier on
  mg/h inflow/outflow fluxes and perfectly mixed concentration. Storage outflow is capped at its
  assigned hourly demand and recharge uses only compliant surplus. Local
  fallback is a source capped at its node-specific operational $\bar q^{fb}_i$, with
  independent $\eta_f\sim U(0.99,0.99999)$, and consumes the same declared
  power and chemical resources. A capacitated max-flow carries both m$^3$/h and
  pollutant mg/h, mixes incoming mass at every node, applies plant/fallback
  removal, and uses the time-expanded objective and tie order frozen in the
  action map below. Delivered volume
  is compliant service only when outlet concentration is at most the destination
  $C_{lim}$. For the one-hour event step, node $i$ contributes

  $$
  H_{i,t}=P_i\,\operatorname{clip}\!\left(
  1-\frac{V^{comp}_{i,t}}{V^{dem}_{i,t}},0,1\right)(1\ \mathrm h)
  $$

  person-h, where $V^{comp}$ is compliant delivered volume capped at demand;
  if $V^{dem}_{i,t}=0$, define $H_{i,t}=0$. Unserved and noncompliant delivery
  both reduce $V^{comp}$ and therefore contribute proportionally rather than
  being treated as a zero/full binary outage. Scenario exposure is
  $H=\sum_{i,t}H_{i,t}$ and the feasibility gate uses its arithmetic mean across
  the 64 evaluator scenarios. The evaluator records unserved and noncompliant delivered
  volume, person-hours, repair, travel, and every
  lifecycle row. Missing monitoring, unreachable maintenance, or absent
  emergency storage makes an architecture infeasible before scoring.
- **Observation and operating-action map:** each `(asset, field)` draws one
  seed-frozen delay $\delta\sim U(0,6)$ h. Binary equipment, actuator, grid,
  communications, and access status is exact at its integer-hour sample time
  and receives no Gaussian perturbation. For a continuous flow sample, its scale
  is $\bar q_{hyd}$ for a plant, $\bar q^{fb}_i$ for fallback $i$, or
  $q_{e,max}$ for a pipe or pump, all in m$^3$/h. Concentration, storage, and
  available-backup-fraction scales are respectively
  $\min_{i\mapsto k}C_{lim,i}$, $V_{max}$, and 1. Each continuous field reports
  $y=\operatorname{clip}(x+\epsilon,l,u)$ with
  $\epsilon\sim N(0,(0.02\,scale)^2)$; bounds are $[0,\infty)$ for flow and
  concentration, $[0,V_{max}]$ for storage, and $[0,1]$ for backup fraction.
  A packet sampled at $t$ becomes usable at $t+\delta$ with its sample timestamp.
  At a 6 h decision boundary an arm receives exactly the packets whose arrival
  time has elapsed and uses the latest timestamp per field. Remote packets
  sampled during communications loss are dropped rather than delivered later;
  local source-outlet packets remain available to the local rule.

  For a concentration packet with scale $s_C$, freeze the one-sided observational
  upper bound $U_C=\max(0,y_C)+2.326(0.02s_C)$. Missing concentration makes
  $U_C=\infty$. A local quality alarm occurs when $U_C>C_{lim}$ for any assigned
  destination; a local power alarm occurs when latest exact grid, source, pump,
  or actuator status on the assigned path is unavailable. These are policy
  calculations, not claims of simultaneous physical 99% coverage.

  Every 6 h an action selects, for each opened plant, a storage-release cap
  $g_k\in\{0,0.25,0.5,0.75,1\}$ times
  $\min[V_k,(6\ \mathrm h/(24\ \mathrm{h/d}))q^{peak}_{assigned,k}]$ m$^3$, and, for each
  available depot, `none` or one currently queued job. A controller also selects
  `assigned` or `shared` routing. It does not set continuous pipe flows:
  `assigned` exposes only the tuple's assigned source paths, while `shared`
  exposes all currently available installed edges and sources; the declared
  lexicographic capacitated max-flow is a six-layer hourly time-expanded network
  and uniquely chooses continuous flows, storage up to the epoch cap, and
  available fallback up to $\bar q^{fb}_i$. Its objectives sum over the six layers;
  each layer converts m$^3$/h and mg/h rates to volume and mass with exactly
  $\Delta t=1$ h.
  it minimizes noncompliant m$^3$, unserved m$^3$, person-h, and operating EUR
  lexicographically, then maximizes terminal stored m$^3$, then minimizes the
  ordered path-hash vector and flow-variable hash.
  Only a job with a reserved stock unit or arrived dedicated unit is dispatch-
  eligible; otherwise it remains in the frozen procurement wait. Busy,
  unavailable, malformed, or over-cap actions are rejected, logged, and replaced
  by A's safe local action for that epoch.

  A uses `assigned`, sets $g_k=1$ only after reported inflow loss, otherwise zero,
  permits local fallback on a power/quality alarm or unmet demand, and dispatches
  the oldest feasible FIFO job at each depot. B uses a four-epoch 24 h receding
  horizon. Its forecast knows deterministic calendar demand, executed actions,
  queue/work/procurement balances, and latest arrived packets; it holds latest
  continuous flow/quality forcing constant, assumes no new hazard, and keeps a
  currently reported impairment active until a known repair/procurement
  completion. It receives no event end, future noise, delayed packet, or sealed
  state. B enumerates the finite storage-cap and eligible-dispatch choices,
  invokes the unique max-flow for continuous quantities, minimizes predicted
  noncompliant m$^3$, unserved m$^3$, person-h, then EUR lexicographically, uses
  action hash for a final tie, and executes only the first epoch. Failure to
  complete this exact mature-null optimization is a retained terminal failure,
  not permission to substitute an undeclared heuristic.

  For C, let $D^{6h}_i$ be known six-hour demand and let $S^{6h,max}_i$ be the
  unique max-flow's maximum compliant six-hour supply using latest reported
  availability, current storage, permitted fallback, and the $U_C$ bounds. Set
  reserve $R_i=S^{6h,max}_i/D^{6h}_i-1$, with $R_i=\infty$ only when
  $D^{6h}_i=0$. C uses A's local action only while every $R_i>0.20$, every
  contributing source has $U_C<0.8C_{lim,i}$, and no latest reported shared asset
  on the path is impaired; otherwise it invokes B. Communications loss forces
  the local rule, for which missing quality closes the source. All arms receive
  identical delayed packets and physical actuator availability.
- **Frozen architectural constraint map:** the five named feasibility constraints
  are the following exhaustive booleans; no implementation may infer an extra
  threshold from a tuple fraction.

  1. `monitoring`: installed counts equal the mandatory source-outlet points plus
     $\lceil f_{mon}N\rceil$ demand-node points. An operating plant or fallback
     requires its own outlet monitor to be available; otherwise its flow is
     forced to zero until monitoring returns. Node monitors provide the delayed
     quality observations but do not create oracle truth.
  2. `reachable_access`: in the ordinary road tree every repairable asset has a
     finite shortest path to at least one depot. Hazard-time loss of that path or
     depot follows the frozen queue/no-depot transition and is scored as service,
     person-hour, work, and cost—not a second hidden feasibility test.
  3. `emergency_48h`: for node $i$ assigned to plant $k$, allocate shared storage
     $V^{alloc}_i=V_{max,k}q^{peak}_i/q^{peak}_{assigned,k}$. Let $I^{fb}_i$ mark
     an installed local fallback, $f_b$ be backup-power fraction, and $d_{stock}$
     consumable-stock days. Freeze
     $q^{fb,d}_i=I^{fb}_i\min(1,f_b,d_{stock}/2)q^{peak}_i$ m$^3$/d and
     $\bar q^{fb}_i=q^{fb,d}_i/24$ m$^3$/h. Require

     $$
     V^{alloc}_i+(2\ \mathrm d)q^{fb,d}_i\ge(2\ \mathrm d)q^{peak}_i
     \quad\text{for every demand node }i.
     $$

     A zero assigned-peak denominator is invalid. During a grid event an available
     plant or positive-head pump is capped at its installed
     $q^{prot}_a/24$ m$^3$/h, an unavailable backup unit makes that protected
     capacity zero, gravity directions remain power-independent, and fallback is
     capped at its declared $\bar q^{fb}_i$ while its backup unit is available.
     Backup electricity and fallback chemicals remain charged. This static inventory
     gate does not waive the scenario service gates.
  4. `operator`: every depot has its tuple's $s\in\{1,2,3\}$ and obeys the exact
     shift/travel schedule above. Work outside that capacity is impossible and
     remains queued; there is no unregistered minimum-utilisation or completion
     threshold.
  5. `maintenance`: every repairable asset has a typed lifetime, cost/material
     row, depot route, spare state, and procurement transition. Spare count zero
     is permitted only through the charged 90 d no-spare branch. At an event
     terminal, an exogenous damage condition or event-copy-only unavailable
     asset/job fails the scenario; a state identically open in the paired ordinary
     copy and an inventory-only replenishment deficit are retained and charged
     but do not. At the ordinary month-360 terminal, unavailable time has already
     reduced $S^{ord}_{30y}$ and placed orders remain charged; neither state is
     extrapolated beyond the horizon or deleted by imputation.

- **Arms:** A selects the lower cost/service among design-feasible catalogue
  indices 0 and 1 and falls back to feasible anchor 0 if index 1 fails. B
  enumerates all 33 tuples using the 16 design
  scenarios, the complete hydraulic/lifecycle ledger, and its scheduler, then
  selects minimum predicted cost/service among design-feasible tuples. C uses
  the same catalogue, ledger, scenarios, and constrained choice with
  P-002/P-008/P-009/P-013 modular hierarchy with shared state and local
  fallback. `Design-feasible` applies the same numerical gates below to the 16
  design scenarios; evaluator feasibility is recomputed only after selection.
  For a common regret oracle, define a system design $z=(a,p)$ as one of the 33
  architecture tuples paired with one of the three frozen A/B/C operating
  policies above. The evaluator runs all 99 pairs on the same 64 scenarios;
  hence $\mathcal F$, cost, and service never change policy silently between an
  arm and its oracle. Arm A may select only its two A-policy endpoint pairs, B
  any B-policy pair, and C any C-policy pair.
- **Mature null:** B sees the same sites, costs, hazards, operators, quality
  targets, and uncertainty as C and returns a Pareto set before the primary
  constrained choice.
- **Transfer family:** held-out dense urban, sparse rural, steep topography,
  cold-climate, and common-cause power/flood families.
- **Primary metric and threshold:** for evaluator scenario $q$, let $D_q$ be
  exogenous ordinary demand over its same 90 d calendar window, $N_q$ the
  noncompliant delivered m$^3$, $H_q$ the person-hour sum above, $R_q$ the count
  of node-hours with positive delivered volume, and $A_q$ the subset whose mixed
  delivered concentration exceeds that node's $C_{lim}$. On the 64 evaluator
  scenarios, a feasible system design must satisfy

  $$
  \frac{\sum_qN_q}{\sum_qD_q}\le0.001,\qquad
  \frac1{64}\sum_qH_q\le24P\ \text{person-h},\qquad
  \frac{\sum_qA_q}{\sum_qR_q}\le0.001.
  $$

  A zero or non-finite $\sum_qD_q$ or $\sum_qR_q$ fails feasibility rather than
  making a favourable ratio. The 16 design scenarios apply identical pooled
  formulas with 16 in the exposure mean. The system must also satisfy the frozen monitoring, reachable-
  access, 48 h emergency-storage-or-equivalent-fallback, operator, and
  maintenance constraints. For system design $z$, let $C^{ord}_{z,30y}$ and
  $S^{ord}_{z,30y}$ be ordinary 30-year constant-EUR cost and compliant service.
  For scenario $q$, rerun its matching ordinary 90 d window without the hazard
  and freeze

  $$
  \Delta C_{z,q}=C^{event}_{z,q}-C^{ord-window}_{z,q},\qquad
  \Delta S_{z,q}=\operatorname{clip}(S^{ord-window}_{z,q}-S^{event}_{z,q},
  0,S^{ord-window}_{z,q}).
  $$

  Define

  $$
  C_z=C^{ord}_{z,30y}+\frac1{64}\sum_q\Delta C_{z,q},\qquad
  S_z=S^{ord}_{z,30y}-\frac1{64}\sum_q\Delta S_{z,q}>0.
  $$

  Thus reduced event-period operating cost, repair/procurement cost, unserved
  volume, and noncompliant volume enter once; 64 counterfactual lifetimes are
  never summed. Freeze

  $$
  L_s=\frac{C_{\widehat z}}{S_{\widehat z}}-
  \min_{z\in\mathcal F}\frac{C_z}{S_z}
  \quad\text{EUR}_{2026}/\text{m}^3.
  $$

  An infeasible, zero-service, non-finite, or absent terminal system design gets
  $L_{fail}=\max_{z\in\mathcal F}C_z/S_z-\min_{z\in\mathcal F}C_z/S_z+10$
  EUR$_{2026}$/m$^3$. B uses $r=0.15$.
- **Secondary metrics:** compliant service and noncompliant delivered volume
  (m$^3$); flood-release volume (m$^3$) and pollutant mass (kg); outage exposure (person h); mean and 95th-percentile repair time
  (h); pipe (km); materials (kg); simulated pump electricity (kWh); operator
  travel/work (h); lifecycle GHG (kg CO$_2$e); architecture-class accuracy (%).
- **Protected gates:** the feasibility constraints above are absolute;
  noncompliant volume, outage person-hours, water-quality probability,
  flood release, service, operator work, energy, material, GHG, and cost remain
  separate rows; water and pollutant ledgers close within $10^{-7}$ relative error.
- **Stopping/abstention:** an architecture lacking reachable maintenance,
  required monitoring, emergency storage, or treatment compliance is infeasible
  rather than assigned a favourable low cost.
- **Novelty/kill:** C must beat or resource-dominate the complete constrained
  facility-location/reliability null. A universal module or centralisation ratio
  is not an allowed result.
- **Artifacts:** `spatial-graph.json`, `facilities.jsonl`, `hazards.parquet`,
  `outages.parquet`, `service.csv`, `lifecycle.csv`, `pareto.jsonl`.

## Mandatory mature-null stack

The tracks are not permitted to compare only with a weak heuristic.

1. RTD estimation with tracer-calibrated tanks-in-series or dispersion is the
   null for mean-contact-time claims.
2. Explicit SRT and guild-resolved activated-sludge state is the null for
   biological-lifetime claims.
3. Robust integrated MPC over the declared whole-system boundary is the null
   for hierarchical control.
4. Adaptive multiscale multivariate monitoring with maintenance provenance is
   the null for observation contracts.
5. Nonlinear fouling-state estimation with constrained operation is the null
   for cleaning-history state.
6. Multicomponent column transport and adsorption is the null for
   breakthrough-aware media management.
7. ADM1-family delayed state estimation and constrained control is the null for
   buffered anaerobic monitoring.
8. A fixed but complete target/non-target/mass/effect battery is the null for
   active product/effect sensing.
9. A complete, uncertainty-bearing lifecycle/counterfactual model under DIN EN
   ISO 14040/14044 is the null for a versioned service ledger.
10. Constrained facility-location, hydraulic, reliability, maintenance, and
    lifecycle optimization is the null for modular infrastructure synthesis.

## Cross-track failure modes

- Concentration substituted for load or mass.
- Nominal residence time substituted for an exposure distribution.
- HRT substituted for SRT, media age, or maintenance state.
- Hidden storage, bypass, daughters, regeneration release, or shutdown time.
- Parent disappearance described as destruction or safety.
- Simulated process electricity presented as measured compute energy.
- Additional assays or maintenance given to C without resource accounting.
- A weak baseline presented as the strongest null.
- Confirmation or transfer parameters exposed during development.
- Timepoints, sensors, solutes, or storms treated as independent replicates.
- Failed or refused worlds deleted from denominators.
- Safe abstention made free or used to win through zero service.
- One scalar objective averages away flooding, quality, toxicity, or service
  constraints.
- An EU/German legal or standards statement treated as an empirical effect.
- A case-specific treatment parameter promoted as a general AI constant.

## Source roles and evidence limits

- Primary experiments and full-scale studies establish bounded environmental-
  engineering observations, not cross-domain project effects.
- Danckwerts, BSM2, and ADM1 provide established mathematical or benchmark
  structures. They are mature comparators, not validation of C.
- EU and German legal sources establish applicability, reporting, permitting,
  monitoring, and risk-management boundaries only.
- DIN EN ISO 14040/14044 supplies lifecycle method structure. It does not choose
  the result-driving functional unit or scenario values for this project.
- Rebound is deliberately `disputed`: the audit requires it to remain an
  estimated scenario variable instead of assuming zero, a positive constant,
  or inevitable backfire.
- ENV-T08 is deliberately attached to C-1285. The environmental evidence
  strengthens that family; claim number `1477` remains unused rather than creating a
  synonym.

## BibTeX appendix

```bibtex
@article{Danckwerts1953RTD,
  author  = {Danckwerts, P. V.},
  title   = {Continuous Flow Systems: Distribution of Residence Times},
  journal = {Chemical Engineering Science},
  year    = {1953},
  volume  = {2},
  number  = {1},
  pages   = {1--13},
  doi     = {10.1016/0009-2509(53)80001-1}
}

@article{HellingaEtAl1998SHARON,
  author  = {Hellinga, C. and Schellen, A. A. J. C. and Mulder, J. W. and van Loosdrecht, M. C. M. and Heijnen, J. J.},
  title   = {The SHARON Process: An Innovative Method for Nitrogen Removal from Ammonium-Rich Waste Water},
  journal = {Water Science and Technology},
  year    = {1998},
  volume  = {37},
  number  = {9},
  pages   = {135--142},
  doi     = {10.1016/S0273-1223(98)00281-9}
}

@article{LiuWang2014SRT,
  author  = {Liu, Guoqiang and Wang, Jianmin},
  title   = {Role of Solids Retention Time on Complete Nitrification: Mechanistic Understanding and Modeling},
  journal = {Journal of Environmental Engineering},
  year    = {2014},
  volume  = {140},
  number  = {1},
  pages   = {48--56},
  doi     = {10.1061/(ASCE)EE.1943-7870.0000779}
}

@article{SeggelkeEtAl2013IntegratedRTC,
  author  = {Seggelke, Katja and L{\"o}we, Roland and Beeneken, Thomas and Fuchs, Lothar},
  title   = {Implementation of an Integrated Real-Time Control System of Sewer System and Waste Water Treatment Plant in the City of Wilhelmshaven},
  journal = {Urban Water Journal},
  year    = {2013},
  volume  = {10},
  number  = {5},
  pages   = {330--341},
  doi     = {10.1080/1573062X.2013.820331}
}

@article{JeppssonEtAl2007BSM2,
  author  = {Jeppsson, Ulf and Pons, Marie-No{\"e}lle and Nopens, Ingmar and Alex, Jens and Copp, John B. and Gernaey, Krist V. and Ros{\'e}n, Christian and Steyer, Jean-Philippe and Vanrolleghem, Peter A.},
  title   = {Benchmark Simulation Model No 2: General Protocol and Exploratory Case Studies},
  journal = {Water Science and Technology},
  year    = {2007},
  volume  = {56},
  number  = {8},
  pages   = {67--78},
  doi     = {10.2166/wst.2007.604}
}

@article{AmandEtAl2014AmmoniumControl,
  author  = {{\AA}mand, Linda and Laurell, C. and Stark-Fujii, Kristina and Thunberg, A. and Carlsson, Bengt},
  title   = {Lessons Learnt from Evaluating Full-Scale Ammonium Feedback Control in Three Large Wastewater Treatment Plants},
  journal = {Water Science and Technology},
  year    = {2014},
  volume  = {69},
  number  = {7},
  pages   = {1573--1580},
  doi     = {10.2166/wst.2014.061}
}

@article{RosenLennox2001Monitoring,
  author  = {Ros{\'e}n, Christian and Lennox, James A.},
  title   = {Multivariate and Multiscale Monitoring of Wastewater Treatment Operation},
  journal = {Water Research},
  year    = {2001},
  volume  = {35},
  number  = {14},
  pages   = {3402--3410},
  doi     = {10.1016/S0043-1354(01)00069-0}
}

@article{HaimiEtAl2016Anomaly,
  author  = {Haimi, Henri and Mulas, Michela and Corona, Francesco and Marsili-Libelli, Stefano and Lindell, Paula and Heinonen, Mari and Vahala, Riku},
  title   = {Adaptive Data-Derived Anomaly Detection in the Activated Sludge Process of a Large-Scale Wastewater Treatment Plant},
  journal = {Engineering Applications of Artificial Intelligence},
  year    = {2016},
  volume  = {52},
  pages   = {65--80},
  doi     = {10.1016/j.engappai.2016.02.003}
}

@article{FieldEtAl1995CriticalFlux,
  author  = {Field, R. W. and Wu, D. and Howell, J. A. and Gupta, B. B.},
  title   = {Critical Flux Concept for Microfiltration Fouling},
  journal = {Journal of Membrane Science},
  year    = {1995},
  volume  = {100},
  number  = {3},
  pages   = {259--272},
  doi     = {10.1016/0376-7388(94)00265-Z}
}

@article{ShanNeufeld2007Fouling,
  author  = {Shan, Huifeng and Neufeld, Ronald D.},
  title   = {Irreversible Fouling during Multicycle Microfiltration of Wastewater Effluent},
  journal = {Water Environment Research},
  year    = {2007},
  volume  = {79},
  number  = {13},
  pages   = {2527--2535},
  doi     = {10.2175/106143007X212175}
}

@article{McCleafEtAl2017PFAS,
  author  = {McCleaf, Philip and Englund, Sophie and {\"O}stlund, Anna and Lindegren, Klara and Wiberg, Karin and Ahrens, Lutz},
  title   = {Removal Efficiency of Multiple Poly- and Perfluoroalkyl Substances in Drinking Water Using Granular Activated Carbon and Anion Exchange Column Tests},
  journal = {Water Research},
  year    = {2017},
  volume  = {120},
  pages   = {77--87},
  doi     = {10.1016/j.watres.2017.04.057}
}

@article{LiuWernerBellona2019PFAS,
  author  = {Liu, Charlie J. and Werner, David and Bellona, Christopher},
  title   = {Removal of Per- and Polyfluoroalkyl Substances from Contaminated Groundwater Using Granular Activated Carbon: A Pilot-Scale Study with Breakthrough Modeling},
  journal = {Environmental Science: Water Research \& Technology},
  year    = {2019},
  volume  = {5},
  number  = {11},
  pages   = {1844--1853},
  doi     = {10.1039/C9EW00349E}
}

@article{BoeEtAl2010Indicators,
  author  = {Boe, Kanokwan and Batstone, Damien J. and Steyer, Jean-Philippe and Angelidaki, Irini},
  title   = {State Indicators for Monitoring the Anaerobic Digestion Process},
  journal = {Water Research},
  year    = {2010},
  volume  = {44},
  number  = {20},
  pages   = {5973--5980},
  doi     = {10.1016/j.watres.2010.07.043}
}

@article{BjornssonEtAl2001Monitoring,
  author  = {Bj{\"o}rnsson, Lovisa and Murto, Marika and Jantsch, Tor Gunnar and Mattiasson, Bo},
  title   = {Evaluation of New Methods for the Monitoring of Alkalinity, Dissolved Hydrogen and the Microbial Community in Anaerobic Digestion},
  journal = {Water Research},
  year    = {2001},
  volume  = {35},
  number  = {12},
  pages   = {2833--2840},
  doi     = {10.1016/S0043-1354(00)00585-6}
}

@article{BatstoneEtAl2002ADM1,
  author  = {Batstone, D. J. and Keller, J. and Angelidaki, I. and Kalyuzhnyi, S. V. and Pavlostathis, S. G. and Rozzi, A. and Sanders, W. T. M. and Siegrist, H. and Vavilin, V. A.},
  title   = {The IWA Anaerobic Digestion Model No 1 (ADM1)},
  journal = {Water Science and Technology},
  year    = {2002},
  volume  = {45},
  number  = {10},
  pages   = {65--73},
  doi     = {10.2166/wst.2002.0292}
}

@article{HuberEtAl2005Ozonation,
  author  = {Huber, Marc M. and G{\"o}bel, Anke and Joss, Adriano and Hermann, Nadine and L{\"o}ffler, Dirk and McArdell, Christa S. and Ried, Achim and Siegrist, Hansruedi and Ternes, Thomas A. and von Gunten, Urs},
  title   = {Oxidation of Pharmaceuticals during Ozonation of Municipal Wastewater Effluents: A Pilot Study},
  journal = {Environmental Science \& Technology},
  year    = {2005},
  volume  = {39},
  number  = {11},
  pages   = {4290--4299},
  doi     = {10.1021/es048396s}
}

@article{GuldeEtAl2021Products,
  author  = {Gulde, Rebekka and Rutsch, Moreno and Clerc, Baptiste and Scholl{\'e}e, Jennifer E. and von Gunten, Urs and McArdell, Christa S.},
  title   = {Formation of Transformation Products during Ozonation of Secondary Wastewater Effluent and Their Fate in Post-Treatment: From Laboratory- to Full-Scale},
  journal = {Water Research},
  year    = {2021},
  volume  = {200},
  pages   = {117200},
  doi     = {10.1016/j.watres.2021.117200}
}

@article{SchneiderEtAl2020Toxicity,
  author  = {Schneider, Ilona and Abbas, Aennes and Bollmann, Anna and Dombrowski, Andrea and Knopp, Gregor and Schulte-Oehlmann, Ulrike and Seitz, Wolfram and Wagner, Martin and Oehlmann, J{\"o}rg},
  title   = {Post-Treatment of Ozonated Wastewater with Activated Carbon and Biofiltration Compared to Membrane Bioreactors: Toxicity Removal In Vitro and in Potamopyrgus antipodarum},
  journal = {Water Research},
  year    = {2020},
  volume  = {185},
  pages   = {116104},
  doi     = {10.1016/j.watres.2020.116104}
}

@article{FoleyEtAl2010LCI,
  author  = {Foley, Jeffrey and de Haas, David and Hartley, Ken and Lant, Paul},
  title   = {Comprehensive Life Cycle Inventories of Alternative Wastewater Treatment Systems},
  journal = {Water Research},
  year    = {2010},
  volume  = {44},
  number  = {5},
  pages   = {1654--1666},
  doi     = {10.1016/j.watres.2009.11.031}
}

@article{MaierEtAl2022Recycling,
  author  = {Maier, Jason and Palazzo, Joseph and Geyer, Roland and Steigerwald, Douglas G.},
  title   = {How Much Potable Water Is Saved by Wastewater Recycling? Quasi-Experimental Evidence from California},
  journal = {Resources, Conservation and Recycling},
  year    = {2022},
  volume  = {176},
  pages   = {105948},
  doi     = {10.1016/j.resconrec.2021.105948}
}

@article{CameronHarpHendricks2025Efficiency,
  author  = {Cameron-Harp, Micah V. and Hendricks, Nathan P.},
  title   = {Efficiency and Water Use: Dynamic Effects of Irrigation Technology Adoption},
  journal = {Journal of the Association of Environmental and Resource Economists},
  year    = {2025},
  volume  = {12},
  number  = {2},
  pages   = {285--312},
  doi     = {10.1086/732140}
}

@article{RischEtAl2021Decentralisation,
  author  = {Risch, Eva and Boutin, Catherine and Roux, Philippe},
  title   = {Applying Life Cycle Assessment to Assess the Environmental Performance of Decentralised versus Centralised Wastewater Systems},
  journal = {Water Research},
  year    = {2021},
  volume  = {196},
  pages   = {116991},
  doi     = {10.1016/j.watres.2021.116991}
}

@misc{EU2024UrbanWastewater,
  author = {{European Parliament and Council of the European Union}},
  title  = {Directive (EU) 2024/3019 Concerning Urban Wastewater Treatment (Recast)},
  year   = {2024},
  url    = {https://eur-lex.europa.eu/eli/dir/2024/3019/oj/eng}
}

@misc{EU2020WaterReuse,
  author = {{European Parliament and Council of the European Union}},
  title  = {Regulation (EU) 2020/741 on Minimum Requirements for Water Reuse},
  year   = {2020},
  url    = {https://eur-lex.europa.eu/eli/reg/2020/741/oj}
}

@misc{EU2024WaterReuseRisk,
  author = {{European Commission}},
  title  = {Commission Delegated Regulation (EU) 2024/1765 Supplementing Regulation (EU) 2020/741 with Regard to Technical Specifications of the Key Elements of Risk Management},
  year   = {2024},
  url    = {https://eur-lex.europa.eu/eli/reg_del/2024/1765/oj/eng},
  note   = {Normative source only; not scientific evidence of project performance}
}

@misc{EU2008WasteFramework,
  author = {{European Parliament and Council of the European Union}},
  title  = {Directive 2008/98/EC on Waste},
  year   = {2008},
  url    = {https://eur-lex.europa.eu/eli/dir/2008/98/oj}
}

@misc{GermanyWHG,
  author = {{Federal Republic of Germany}},
  title  = {Wasserhaushaltsgesetz},
  url    = {https://www.gesetze-im-internet.de/whg_2009/},
  note   = {Use the consolidated version current on the execution date}
}

@misc{GermanyAbwV,
  author = {{Federal Republic of Germany}},
  title  = {Abwasserverordnung},
  url    = {https://www.gesetze-im-internet.de/abwv/},
  note   = {Use the consolidated version current on the execution date}
}

@misc{GermanyKrWG,
  author = {{Federal Republic of Germany}},
  title  = {Kreislaufwirtschaftsgesetz},
  url    = {https://www.gesetze-im-internet.de/krwg/},
  note   = {Use the consolidated version current on the execution date}
}

@misc{DINENISO14040_2021,
  author = {{DIN}},
  title  = {DIN EN ISO 14040:2021-02 Environmental Management -- Life Cycle Assessment -- Principles and Framework},
  year   = {2021},
  doi    = {10.31030/3179655}
}

@misc{DINENISO14044_2021,
  author = {{DIN}},
  title  = {DIN EN ISO 14044:2021-02 Environmental Management -- Life Cycle Assessment -- Requirements and Guidelines},
  year   = {2021},
  doi    = {10.31030/3179656}
}
```

## Disposition

- Claims `C-1470`--`C-1476` and `C-1478`--`C-1479` are now bounded
  central-ledger entries. Claim number `1477` is unused; ENV-T08 attaches to
  existing C-1285. Inclusion records evidence and test obligations; it does not
  promote a candidate architecture or assert a result.
- Protocols `ENV-T01`--`ENV-T10` are frozen specifications only. No runner,
  seed pack, simulation, test result, benchmark result, energy result, or claim
  promotion exists.
- No new principle and no new candidate is justified. The audit strengthens
  existing mechanism families and mature-null requirements.
- EU and German sources remain applicability and reporting constraints, not
  scientific evidence of project performance.
- Central claims, references, indexes, coverage, registry mappings, and
  generated material are integrated as separate, visible repository changes;
  this audit remains the dated rationale and protocol source rather than a
  substitute for those canonical indexes.

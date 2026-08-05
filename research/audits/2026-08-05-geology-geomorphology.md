# Primary-source audit: geology and geomorphology

<!-- markdownlint-disable MD013 -->

**Audit date:** 2026-08-05

**Scope:** fracture and fault networks; river and drainage topology;
erosion–deposition feedback; landscape response times; hysteresis and path
dependence; transport-network adaptation; landslide thresholds; and sparse,
multiscale observation

**Ledger state:** candidate evidence only. `C-GEO-*` labels below are temporary
and must receive stable `C-` identifiers, merge dispositions, or explicit
rejections from the root integrator.

**Purpose:** determine what geological and geomorphological mechanisms add
beyond the Earth-transition, adaptive-materials, topology, maintenance, and
power-grid audits, while separating passive physical self-organization from a
usable adaptive-control architecture.

## Executive conclusion

Geology supplies strong mechanisms and even stronger category boundaries.
Fractures, faults, channels, divides, landslides, and depositional paths retain
history in material structure. Flow and stress can reinforce some routes,
abandon others, and create networks with efficient-looking statistics. Abrupt
change can occur after slow loading, and the observable record can average,
alias, or entirely remove the forcing that produced it.

None of that, by itself, is adaptive control. A landscape normally has:

- no encoded service objective distinct from its governing physics;
- no sensor/controller/actuator boundary;
- no authority mechanism choosing among safe actions;
- no promise to preserve downstream service, reversibility, or future option
  value; and
- no lifecycle accountant that charges displaced mass, fracture damage,
  stored sediment, or recovery time.

The apparent optimization is usually one of four things:

1. an analyst-defined variational model whose low-cost networks resemble some
   natural statistics;
2. dissipative dynamics following stress, gravity, and hydraulic gradients;
3. positive feedback in which existing paths attract more flow and therefore
   change faster; or
4. selection bias in which the surviving or currently active network is
   evaluated after alternatives were eroded, buried, or disconnected.

The mechanisms therefore deduplicate mostly into
[P-005](../principle-registry.md#p-005--use-dependent-topology),
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback),
[P-007](../principle-registry.md#p-007--prediction-error-allocation),
[P-008](../principle-registry.md#p-008--compartmentalized-interaction),
[P-009](../principle-registry.md#p-009--maintenance-plane),
[P-010](../principle-registry.md#p-010--structural-offloading-and-co-design),
[P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime),
and a weak form of
[P-013](../principle-registry.md#p-013--externalized-shared-state).

One methodological residual is worth holding: **support-qualified evidence
fusion**. Every observation should carry its spatial support, time-averaging
window, latency, censoring process, and causal intervention history. This is
not yet a new principle. Backus–Gilbert inversion, multiscale hydrology,
state-space estimation, hierarchical Bayesian models, and data assimilation
are its established nulls. It survives only if an explicit support ledger
improves AI-system diagnosis under mixed telemetry windows beyond those
methods at equal observation and compute cost.

## Evidence and interpretation boundary

This audit uses four evidence classes:

| Class | Evidence | What it supports | What it does not support |
| --- | --- | --- | --- |
| G1 | field measurement, natural experiment, or operational warning record | behavior in the measured sites, events, instruments, and averaging windows | universal dynamics, unique cause, or an AI architecture |
| G2 | controlled laboratory or physical-scale experiment | causal mechanism in the tested material, geometry, and forcing envelope | field-scale universality or economic advantage |
| G3 | mechanistic analytical or numerical model | consequences of declared equations, parameters, boundary conditions, and discretization | that nature implements the model or optimizes its objective |
| G4 | authoritative synthesis or review | evidence range, terminology, and known inferential limitations | a new controlled result |

Power laws, fractal dimensions, efficient-looking networks, and criticality
claims receive no special promotion. Bonnet et al. emphasize that geological
fracture scaling has finite upper and lower bounds, that exponent estimation is
problematic, and that extrapolation across dimension is nontrivial
([Reviews of Geophysics 2001](https://doi.org/10.1029/1999RG000074)). A fitted
scale-free form is a description over a sampled range, not proof of one growth
law, self-organized criticality, optimal computation, or unlimited transfer to
AI scale.

## Terms that must not be collapsed

| Term | Operational meaning here | Not equivalent to |
| --- | --- | --- |
| fracture | a discontinuity whose propagation or opening follows a material and loading law | an arbitrary graph edge or software error |
| fault | a fracture or fracture zone accommodating displacement | a classified failure label |
| connectivity | existence of connected paths under a declared geometric or hydraulic criterion | conductance, throughput, robustness, or observability |
| drainage network | topographically and hydraulically coupled routes collecting water and sediment | a freely rewritable communication graph |
| erosion | detachment and removal of material | pruning with zero relocation cost |
| deposition | storage of transported material when capacity or pathway changes | successful consolidation or useful memory |
| response time | time for a declared metric to approach a declared new state after forcing | age of a landform or one universal landscape constant |
| threshold | condition at which a modeled or observed process changes regime | a guaranteed warning point or precise forecast time |
| hysteresis | different state or transition path at the same forcing because history is retained | ordinary lag, noise, or irreversible damage alone |
| self-organization | macroscopic pattern emerging from local physical interactions | goal-directed optimization, sensing, or control authority |
| resilience | persistence or recovery of a declared function under a declared disturbance | mere survival of some topology |
| observation scale | spatial footprint, temporal integration, resolution, and sampling support of a measurement | process scale or model grid size |

## Passive organization versus usable adaptive control

A geological mechanism qualifies as a transferable **adaptive-control** design
only when the proposed engineered system specifies all of the following:

1. **Service variable:** a measurable outcome external to the adaptation law,
   such as delivered flow, task accuracy, or failure containment.
2. **Observation:** which state is sensed, with spatial/temporal support,
   latency, uncertainty, and missingness.
3. **Decision:** a counterfactual policy that could choose a different action
   under a different observation.
4. **Authority and actuator:** which structure or route may be changed, how
   quickly, and under what safety envelope.
5. **Budget:** material movement, switching work, reserve, communication,
   computation, monitoring, and recovery.
6. **Memory and reset:** what state persists, how it is read, and the cost or
   impossibility of returning to a prior topology.
7. **Guarantee boundary:** loads, disturbances, observation errors, and
   consecutive events under which service remains acceptable.

A river that incises where shear stress and sediment supply permit satisfies
none of these merely by changing its channel. The physical environment is both
state and transition law; there is no separate controller. An engineered
channel, dam, warning system, or adaptive network may satisfy the list, but
then its intelligence lies in the engineered observation and intervention
loop, not in erosion itself.

## Timescale, information, and budget ladder

The bands below are orders of process organization, not universal numerical
constants. Every implementation must report its actual distributions.

| Layer | Exact problem | Information path | Physical path or authority | Typical process band | Budget and hard boundary |
| --- | --- | --- | --- | --- | --- |
| elastic loading and crack advance | redistribute stress and extend a crack when energy release exceeds resistance | local stress field and crack geometry are coupled through elasticity | no authority; constitutive fracture response | elastic-wave to rupture-event time, then loading intervals from events to geological time | strain energy, fracture energy J/m², stress Pa, crack area m²; heterogeneity and mixed-mode loading bound prediction |
| fracture/fault-network evolution | nucleate, grow, arrest, link, slip, and sometimes heal discontinuities | long-range stress redistribution plus local flaws, friction, fluids, and material state | passive material response; tectonic forcing supplies work | event seconds to recurrent loading over years–millions of years | displacement, elastic work, damage, fluid pressure, frictional heat; observed traces incompletely sample 3-D state |
| hillslope and channel transport | move rock, soil, water, and sediment down gradients | rainfall/runoff and gravity act through topography, material, vegetation, and sediment state | passive flux; engineered works add external authority | storms and floods to soil-production and incision intervals of years–millions of years | water and sediment flux, shear stress, erodibility, uplift, displaced volume, deposition capacity |
| drainage reorganization | move divides, capture flow, avulse, abandon, and reactivate routes | evolving elevation steers flow; flow changes erosion or deposition; new topography steers later flow | passive positive feedback unless an external controller moves water or sediment | floods/avulsions through divide migration over centuries–millions of years | excavation/deposition work, lost service, new gradients, sediment storage, irreversible capture |
| landslide initiation and motion | identify when resisting shear no longer exceeds driving shear | rainfall, infiltration, pore pressure, slope, material strength, roots, and prior damage | gravity acts after failure; warnings only inform human authority | infiltration minutes–months; rapid failures seconds–minutes; slow slides seasonal–decadal | shear strength, pore pressure Pa, displaced mass, runout, warning false-action cost |
| landscape inference | infer hidden material, flux, and history from sparse surface and proxy observations | instruments and samples apply different spatial kernels and time averages | observer chooses sensors/models; nature supplies no truth API | seconds for waveforms through millennial nuclide averages and million-year thermochronology | instrument count, access, resolution, dating error, model discrepancy, nonuniqueness |

## Evidence synthesis

| Record | Mechanism or source | Exact problem and information/physical path | Evidence and guarantee boundary | Strongest null and project disposition |
| --- | --- | --- | --- | --- |
| GEO-01 | fracture and fault advance | loading + crack geometry and material state → energy release, stress redistribution, growth, arrest, linkage, or slip | G2/G3 for ideal brittle criteria and declared experiments/models; heterogeneous mixed-mode paths remain uncertain | fracture, cohesive-zone, and damage mechanics; passive threshold, not delegated authority |
| GEO-02 | fracture connectivity and conductance | sampled discontinuities → finite graph connectivity; aperture, stress, and boundaries → hydraulic service | G2/G3 under geometric, laminar-flow, aperture, and finite-scale assumptions | discrete-fracture-network simulation, percolation, and finite-volume flow; topology alone is insufficient |
| GEO-03 | channelization and landscape evolution | topography routes runoff → concentrated flux erodes/transports → altered elevation redirects later runoff | G3 and field-consistency evidence; process law, threshold, parameter, and grid scale remain site-specific | conservation-law landscape models; P-005 manifestation and P-010 physical state |
| GEO-04 | optimal channel networks | analyst minimizes a declared dissipation/cost functional over candidate networks | G3 similarity of some network statistics; no evidence that a river evaluates a global objective | minimum-cost flow, Steiner/arborescence, and network-design optimization; no new natural optimizer |
| GEO-05 | Exner sediment balance | erosion/deposition and sediment-flux divergence → bed-elevation change → altered hydraulics | conservation law with closure uncertainty; transport formula and averaging scale control outcomes | mass-conserving morphodynamics; no free memory or optimization |
| GEO-06 | asymmetric response time | forcing direction, magnitude, rate, and existing topology → process- and metric-specific transient | G3 model results and field compatibility; steady state and one relaxation time cannot be presumed | state-space and switched/hybrid dynamics; Earth-transition audit owns generic warning claims |
| GEO-07 | threshold, lag, and hysteresis discrimination | forward/reverse rate sweeps + return tests → separate lag, settled branches, damage, and path dependence | G1/G3 concepts and models; loop shape alone does not identify mechanism | hysteresis models, system identification, explicit hidden-state and damage models |
| GEO-08 | capture and avulsion | divide/channel state + relative erosion or aggradation → route switch → persistent new contributing area | G1/G3 for cited fields/models; future topology is not generally unique or reversible | dynamic graph optimization with switching cost; P-005/P-012/P-013 manifestation |
| GEO-09 | morphodynamic signal filtering | threshold storage and release + autogenic reorganization → distorted or absent forcing signal | G2/G3 and field-statistical support by study; not universal destruction at every scale | nonlinear state-space/filter models, deconvolution, and causal generative models |
| GEO-10 | conditional landslide stability | slope, strength, hydrologic state, and load → resisting/driving margin → initiation and motion | mechanistic criteria are surface-, site-, state-, and model-scoped | infinite-slope, infiltration, progressive-failure, and runout models; no universal tipping signal |
| GEO-11 | empirical and hybrid landslide warning | rainfall, antecedent state, susceptibility, and forecast → calibrated alert region/window → separate authority | G1/G3 warning evidence; skill requires prospective non-event records and domain bounds | intensity–duration, survival/hazard, infiltration-stability, and ensemble warning models |
| GEO-12 | sparse multiscale observation | hidden 3-D time-varying state → instrument/sample support → nonunique estimate | inverse resolution is conditional on kernels, priors, physics, and noise | Backus–Gilbert, Bayesian inverse problems, data assimilation, Gaussian processes, and multiresolution state-space models |
| GEO-13 | mixed geological clocks | event gauges, imagery, cosmogenic nuclides, and thermochronology average different intervals | each estimate is valid for its support; equality or disagreement does not alone identify trend | support-aware evidence fusion; held method candidate, not a new principle |

## GEO-01 — Fracture advance is a local energy threshold, not a routing policy

Griffith framed brittle rupture as an energy balance: extending a crack releases
elastic energy but creates new surface
([Royal Society 1921](https://doi.org/10.1098/rsta.1921.0006)). In modern
energy-release notation,

$$
G=-\frac{\partial \Pi}{\partial A},
\qquad
G\ge G_c\ \text{for admissible crack advance}.
$$

$\Pi$ is total potential energy in joules, $A$ is crack area in square metres,
$G$ is energy-release rate in J/m², and $G_c$ is the material's critical
fracture energy in J/m² under the declared mode, rate, temperature, and
environment. The inequality is a necessary local criterion in the idealized
model. It does not determine a unique three-dimensional path through a
heterogeneous rock, nor does it cover plasticity, frictional slip, subcritical
growth, fluid pressure, branching, or mixed-mode fracture without extensions.

Renshaw and Pollard modeled a set of interacting parallel fractures under
constant remote stress, comparing numerical evolution with experiments. Stress
interaction altered arrest, growth concentration, and clustering; the result
was controlled by the declared flaw geometry and a velocity exponent
([JGR 1994](https://doi.org/10.1029/94JB00139)). Cowie, Vanneste, and Sornette
used a threshold rupture model driven at a plate boundary to study nucleation,
growth, coalescence, and localization of a fault population
([JGR 1993](https://doi.org/10.1029/93JB02223)). These are evidence that local
failure and nonlocal stress redistribution can organize topology. They are not
evidence that faults sense network utility or preserve transport service.

### Information, timescale, budget, and failure boundary

- **State carried by physics:** stress tensor Pa, elastic moduli Pa, fracture
  geometry m/m², toughness or fracture energy, pore pressure Pa, frictional
  state, and material heterogeneity.
- **Path:** external loading → elastic redistribution → local crack-tip or
  interface criterion → extension/slip/arrest → changed stress field.
- **Timescale:** rupture propagation and wave-mediated redistribution can be
  fast; loading, healing, and network growth can be many orders slower. A single
  “fault adaptation rate” is meaningless.
- **Budget:** external mechanical work, new surface area, frictional work,
  damaged volume, and sometimes fluid work. Damage is not a free write.
- **Hard boundary:** the state is partly hidden in 3-D; observed surface traces
  omit blind fractures, aperture, stress, connectivity at depth, and current
  frictional state.

The strongest AI null is not a neural graph-growth rule. It is fracture/damage
mechanics plus graph connectivity under explicit uncertainty. A learned model
adds value only by predicting a declared quantity—growth, permeability,
failure probability, or observation value—better than that null on held-out
geometries and loads.

## GEO-02 — Connectivity, conductance, and criticality are different claims

Berkowitz analyzed two-dimensional fracture-network connectivity with
percolation theory, deriving and testing relationships among fracture density,
intersections, and the probability of hydraulic connection in Monte Carlo
networks
([Mathematical Geology 1995](https://doi.org/10.1007/BF02084422)). A connected
path is a topological property under the chosen intersection and boundary
rules. It does not specify usable flow.

For an ideal smooth parallel-plate fracture, the cubic-law volumetric flow is

$$
Q=\frac{w b^3}{12\mu}\frac{\Delta p}{L},
$$

where $Q$ is m³/s, $w$ is fracture width in m, $b$ is hydraulic aperture in m,
$\mu$ is dynamic viscosity in Pa·s, $\Delta p$ is pressure difference in Pa,
and $L$ is path length in m. Witherspoon et al. experimentally examined the
law in deformable rock fractures and emphasized the dominant cubic dependence
on aperture
([Water Resources Research 1980](https://doi.org/10.1029/WR016i006p01016)).
Roughness, tortuosity, contact, inertial flow, channeling, multiphase effects,
matrix exchange, and stress-dependent closure break the idealization.

Thus three declarations are mandatory:

1. **geometric connectivity:** does any path join the specified boundaries?
2. **hydraulic connectivity:** does the path transmit under the declared
   pressure, phase, and aperture state?
3. **service connectivity:** does transmitted flow/transport meet a minimum
   rate, quality, latency, and robustness contract?

The same separation applies to AI graphs. A connected expert graph need not
have capacity, stable routing, observability, or fault tolerance. Fractal
dimension and degree statistics do not replace an end-to-end service test.

Rundle et al. review statistical-physics treatments of multiscale earthquake
fault systems and the use of critical and cellular-automaton models
([Reviews of Geophysics 2003](https://doi.org/10.1029/2003RG000135)). Those
models are useful nulls for avalanche-like event statistics. Similarity of an
event-size distribution does not identify the generating mechanism, make
individual event times predictable, or establish a controllable critical
state.

## GEO-03 — Drainage topology is flow–structure feedback under conservation

Smith and Bretherton analyzed stability and mass conservation in drainage-basin
evolution, showing how concentrated drainage can emerge from coupled surface
transport rather than from a predeclared channel graph
([Water Resources Research 1972](https://doi.org/10.1029/WR008i006p01506)).
Howard's detachment-limited landscape model combined creep, threshold slumping,
fluvial detachment, and sediment transport; its drainage arrangement was
sensitive to initial conditions even where average morphology was less so
([Water Resources Research 1994](https://doi.org/10.1029/94WR00757)).

A common reduced detachment-limited landscape equation is

$$
\frac{\partial z}{\partial t}
=U-KA^mS^n+D_h\nabla^2z,
\qquad
S=|\nabla z|,
$$

where:

- $z$ is surface elevation in m and $t$ is time in s, yr, or another declared
  unit;
- $U$ is rock-uplift or base-level-relative forcing in m/time;
- $A$ is contributing drainage area in m²;
- $S$ is dimensionless local slope;
- $K$ is an effective erodibility with dimensions
  $\mathrm{m}^{1-2m}/\mathrm{time}$ for this form;
- $m$ and $n$ are dimensionless exponents; and
- $D_h$ is a linear hillslope-transport coefficient in m²/time.

The term $KA^mS^n$ is erosion rate in m/time. The equation is a model family,
not one universal law. It compresses discharge statistics, width, sediment
tools/cover, lithology, thresholds, vegetation, and stochastic events into
effective parameters. Transport-limited terrain needs explicit sediment flux;
landslide-dominated or glacial landscapes may need different state and event
laws.

The relevant local feedback is

```text
slightly lower or more erodible path
  -> receives more contributing flow
  -> experiences altered detachment/transport
  -> changes elevation and gradient
  -> redirects later flow
```

That is a genuine manifestation of
[P-005](../principle-registry.md#p-005--use-dependent-topology). It can reinforce
use, but it lacks P-005's engineering safeguards: explicit exploration reserve,
returning-regime recovery, bounded rewiring, service protection, and a policy
that distinguishes useful flow from destructive overload.

### Strongest topology null

An AI proposal based on “rivers grow efficient routes” must beat at least:

- minimum-cost flow or capacitated network design;
- online routing with switching and congestion costs;
- reinforcement/decay rules such as the existing *Physarum* null in
  [C-027](../claims.md#c-027);
- dynamic graph sparsification and link hysteresis;
- robust/stochastic routing under demand uncertainty; and
- the stream-power or mass-conserving physical model when the task is an
  actual landscape.

The geological contribution is a failure boundary: a used path can incise or
damage itself, an unused path can become expensive to recover, and a route
change moves conserved material somewhere else. Reinforcement is not
automatically beneficial.

## GEO-04 — Minimum-energy networks are analyst objectives, not hidden agents

Rinaldo et al. generated optimal channel networks by minimizing declared
energy-expenditure functionals and found fractal/multifractal statistics similar
to natural drainage networks
([Water Resources Research 1992](https://doi.org/10.1029/92WR00801)). A related
paper argued that least-energy patterns could reproduce river-network
statistics
([Geophysical Research Letters 1992](https://doi.org/10.1029/92GL00938)).
Banavar, Maritan, and Rinaldo later studied general efficient transportation
networks serving distributed volumes
([Nature 1999](https://doi.org/10.1038/20144)).

For a graph $G=(V,E)$, a generic model objective can be written

$$
\mathcal C_\gamma(G)
=\sum_{e\in E}\ell_e |Q_e|^\gamma,
$$

where $\ell_e$ is edge length in m, $Q_e$ is a declared flow in m³/s, and
$\gamma$ is dimensionless. The objective's units are
$\mathrm{m}^{1+3\gamma}\mathrm{s}^{-\gamma}$; it is not automatically physical
power. A physical dissipation model needs the pressure/head, resistance,
geometry, and fluid properties that make its units watts. Different $\gamma$,
constraints, boundary demands, loop permissions, and local-minimum rules
produce different networks.

The correct inference is narrow: low-cost branching-network models can explain
some aggregate structure without designing each branch independently. The
incorrect inferences are:

- nature solved a unique global optimization problem;
- observed similarity identifies the objective or construction algorithm;
- a tree is fault tolerant merely because it is efficient;
- local erosion has access to total future demand; or
- the final network reports the cost of abandoned alternatives and displaced
  material.

The strongest null for a computing application is an explicit graph optimizer
with the same demand forecasts, construction/switching budget, redundancy, and
failure constraints. A geological analogy matters only if a local rule reaches
a better online service–cost frontier without privileged global state.

## GEO-05 — Erosion and deposition are one mass budget

The standard Exner balance for a one-layer noncohesive bed can be written

$$
(1-\lambda_p)\frac{\partial \eta}{\partial t}
+\nabla\!\cdot\mathbf q_s=0,
$$

where $\lambda_p$ is dimensionless deposit porosity, $\eta$ is bed elevation in
m, and $\mathbf q_s$ is volumetric sediment flux per unit transverse width in
m²/time. Both terms therefore have units m/time. Positive flux divergence
lowers the bed; negative divergence deposits sediment. Paola and Voller derive
a generalized mass balance that also exposes rock/sediment interfaces,
compaction, soil production, creep, uplift/subsidence, and chemical terms
([JGR Earth Surface 2005](https://doi.org/10.1029/2004JF000274)).

This conservation constraint blocks three seductive AI analogies:

1. **Pruning is not disappearance.** Removed parameters, cache entries, traffic,
   or data must be stored, transferred, recomputed, or irreversibly discarded.
2. **Deposition is not necessarily memory.** A sediment body persists, but its
   content may be mixed, inaccessible, ambiguously dated, and only indirectly
   related to the original forcing.
3. **Local efficiency can externalize cost.** Incision or route clearing may
   increase downstream sedimentation, flood risk, or loss of an alternate path.

An engineered use of erosion/deposition feedback must close the lifecycle
boundary: input material, stored volume, exported waste, actuator work, cleanup,
and the next event. Otherwise “self-maintaining” topology merely relocates its
maintenance debt.

### Erosion–deposition feedback loop

```text
flow and sediment supply
  -> transport capacity relative to supplied load
  -> erosion, transit, or deposition
  -> changed bed elevation, roughness, and channel geometry
  -> changed flow depth, shear stress, route selection, and storage
  -> changed later transport capacity
```

This loop can be stabilizing in one state variable and destabilizing in
another. Deposition can reduce local slope yet raise an alluvial channel toward
an avulsion threshold. Incision can increase capacity yet steepen adjacent
hillslopes and trigger mass wasting. It is not one scalar homeostat.

## GEO-06 — Response time depends on process, metric, direction, and history

Whipple derived response-time relations for detachment-limited fluvial systems
under tectonic and climatic perturbations, explicitly limiting the result to
the stream-power model and noting omitted processes would tend to lengthen
response
([American Journal of Science 2001](https://doi.org/10.2475/ajs.301.4-5.313)).
Tucker and Slingerland's numerical drainage-basin experiments found asymmetric
responses: increased runoff could expand channels rapidly and initially
aggrade main channels before later incision, whereas decreased runoff produced
network retraction and a more gradual response
([Water Resources Research 1997](https://doi.org/10.1029/97WR00409)).

A minimal dimensionless regime indicator is

$$
\chi=\frac{T_{\mathrm{forcing}}}{T_{\mathrm{response}}},
$$

where both terms use the same time unit. If $\chi\gg1$, a quasi-steady
approximation may be plausible for the chosen state and forcing. If
$\chi\lesssim1$, forcing changes on or faster than the response and transient
tracking matters. The ratio does not predict a transition by itself because
response time depends on state, topology, amplitude, direction, and the metric
used to define “responded.”

For a scalar metric $y$ and tolerance $\epsilon$, an operational response time
should be declared as

$$
T_r(\epsilon)
=\inf\left\{t\ge0:
|y(t')-y_{\mathrm{target}}|
\le \epsilon\ \text{for all}\ t'\in[t,t+T_{\mathrm{hold}}]
\right\}.
$$

$T_r$, $t$, $t'$, and $T_{\mathrm{hold}}$ are in the same time unit;
$\epsilon$ and $y$ have the same unit. The hold window prevents a transient
crossing from being labeled recovery. The target may be undefined when forcing
continues to drift or when a route capture changes the admissible state.

This section deduplicates directly against the
[Earth-transition audit](2026-08-05-earth-system-transition-signals.md): slower
recovery is informative only for declared, observable mechanisms. A long
landscape lag can arise from low transport capacity, storage, missing pathways,
or averaging—not necessarily loss of local stability.

## GEO-07 — Hysteresis, lag, damage, and path dependence must be separated

Schumm distinguished intrinsic thresholds created by evolving landform state
from extrinsic thresholds crossed as an external control changes
([Transactions of the Institute of British Geographers 1979](https://doi.org/10.2307/622211)).
Tucker and Slingerland's direction-dependent channel expansion/retraction and
Jerolmack and Paola's avulsion model illustrate how stored topography makes
future route selection depend on prior deposition and abandoned paths
([Geomorphology 2007](https://doi.org/10.1016/j.geomorph.2007.04.022)).

For an observed output $y$ under a slowly swept forcing $u$, a descriptive
hysteresis gap is

$$
\Delta_h(u)=y_{\uparrow}(u)-y_{\downarrow}(u),
$$

where $y_{\uparrow}$ and $y_{\downarrow}$ have the same physical unit and are
measured on increasing and decreasing forcing branches after the same declared
settling rule. A nonzero gap alone does not identify equilibrium hysteresis.
Finite-rate lag, measurement filtering, irreversible erosion, unobserved state,
and different boundary conditions can produce a loop.

The required discriminating experiment crosses forcing rate with direction:

- if the loop collapses toward zero as the sweep becomes slow, ordinary lag is
  a strong explanation;
- if separated settled branches persist and can be revisited, hysteresis or
  multistability is plausible;
- if material was destroyed or exported and the original state cannot be
  reconstructed, the result may be irreversible damage rather than a reusable
  memory primitive.

Geological path dependence maps to P-012 only when an engineered system can
identify what is retained, read it at useful cost, match it to an information
lifetime, and reset or safely supersede it. A buried channel or fault fabric is
durable state, but not necessarily addressable memory.

## GEO-08 — Drainage capture and avulsion rewrite service as well as topology

Willett et al. used drainage-network geometry to infer divide migration and
documented contrasting reorganization states in the Loess Plateau, Taiwan, and
the southeastern United States
([Science 2014](https://doi.org/10.1126/science.1248765)). River capture changes
contributing area and reroutes water, sediment, nutrients, and ecological
connections. The new network is path-dependent and may leave wind gaps or
abandoned valleys, but it need not improve every transported service.

Jerolmack and Paola's cellular avulsion model allowed a channel to aggrade to a
superelevation threshold and then selected a new steepest-descent path. Simple
local state generated variable avulsion size and route reuse because old
floodplain/channel topography persisted. The result is G3 evidence within the
model, not a claim that natural avulsions are governed by one scalar threshold.

The correct AI transfer is not “occasionally reroute everything.” It is the
following accounting contract:

$$
C_{\mathrm{switch}}
=C_{\mathrm{build}}+C_{\mathrm{migrate}}+C_{\mathrm{orphan}}
+C_{\mathrm{transient}}+C_{\mathrm{rollback}}+C_{\mathrm{verify}},
$$

where every $C$ is reported in a common declared unit such as joules, dollars,
service-loss seconds, or a published multi-objective vector. The scalar sum is
valid only after conversion weights are fixed before evaluation. Geological
systems warn that abandoned routes, transient overload, downstream deposition,
and lost catchment are often the dominant terms.

The strongest nulls are online network design, dynamic shortest path/min-cost
flow, robust routing, graph rewiring with switching penalties, and P-005's
reinforcement/decay rule. A geomorphic transfer wins only on consecutive demand
changes, including return to an abandoned regime.

## GEO-09 — Sediment systems can destroy the signal they appear to record

Jerolmack and Paola modeled thresholded sediment storage and release as a
nonlinear filter that can smear an environmental forcing across scales or make
it undetectable at the output
([Geophysical Research Letters 2010](https://doi.org/10.1029/2010GL044638)).
Their evidence combines numerical models with comparison to physical
sediment-transport systems. The exact shredding regime is model- and
timescale-specific; the paper does not prove that all stratigraphic or
geomorphic signals are lost.

Phillips and Jerolmack analyzed channel geometry and streamflow records from
186 coarse-grained U.S. rivers. They reported that channel adjustment kept the
distribution of flood shear velocity near the threshold for sediment motion,
blunting the geometrical influence of larger floods in that sample
([Science 2016](https://doi.org/10.1126/science.aad3348)). This is G1 evidence
for a field relationship and a proposed self-organization mechanism. It is not
evidence that all river types, sediment sizes, tectonic settings, or future
climates share one stationary filter.

For an external forcing $u(t)$, hidden morphodynamic state $x(t)$, and observed
deposit or flux $y(t)$, the appropriate abstraction is

$$
\dot x=f(x,u,\xi),
\qquad
y=h(x,u)+\eta,
$$

where $x$ contains stored sediment and topology, $\xi$ is process variability,
and $\eta$ is measurement error. Units are component-specific and must be
declared; this notation does not make unlike states commensurate. If two
different forcing histories $u_1$ and $u_2$ produce observationally
indistinguishable $y$ under admissible hidden states, no decoder can uniquely
recover the forcing without additional information or assumptions.

This is a hard null for AI memory and anomaly narratives:

- the output record is not a lossless event log;
- a durable trace may contain internally generated events;
- absence of a trace is not absence of forcing;
- large forcing need not produce proportionally large observed change; and
- a powerful learner cannot recover information that the physical channel did
  not preserve.

The proper comparison is a mechanistic state-space or generative model with
identifiability analysis, not a bigger sequence model evaluated only on one
simulated process family.

## GEO-10 — Landslide thresholds are conditional failure margins

Montgomery and Dietrich coupled topographic convergence, steady subsurface
flow, and infinite-slope stability to predict spatial patterns of shallow
landsliding
([Water Resources Research 1994](https://doi.org/10.1029/93WR02979)). Iverson
derived reduced infiltration and pressure-response models spanning rainfall
and landslide timescales
([Water Resources Research 2000](https://doi.org/10.1029/2000WR900090)). These
are mechanistic nulls for any generic “approaching threshold” detector.

A general Mohr–Coulomb factor of safety along a candidate failure surface is

$$
FS=\frac{c'+(\sigma_n-u_w)\tan\phi'}{\tau_d},
$$

where $c'$ is effective cohesion in Pa, $\sigma_n$ is total normal stress in
Pa, $u_w$ is pore-water pressure in Pa, $\phi'$ is the effective friction angle
in radians or degrees as explicitly declared, and $\tau_d$ is driving shear
stress in Pa. $FS$ is dimensionless; $FS\le1$ marks failure in the idealized
static criterion.

The criterion is not a complete forecast because:

- the failure surface and its depth may be unknown;
- $c'$, $\phi'$, soil depth, root reinforcement, and hydraulic conductivity
  vary spatially and change with weathering, fire, land use, and prior strain;
- preferential flow and perched water violate simple vertical/steady flow;
- progressive failure and rate-dependent friction can precede gross failure;
- seismic loading, toe erosion, excavation, snowmelt, and reservoir changes are
  distinct triggers; and
- runout and consequence require different models after initiation.

The exact information path is

```text
rainfall/snowmelt and antecedent water state
  -> infiltration, redistribution, and drainage
  -> pore-pressure/effective-stress field
  -> resisting versus driving shear on candidate surfaces
  -> local failure, progressive linkage, and motion
  -> runout and downstream impact
```

Skipping the hidden hydrologic state and predicting failure directly from
rainfall may be operationally useful, but it changes the claim from mechanics
to a calibrated empirical hazard model.

## GEO-11 — Rainfall thresholds are warning rules, not universal laws

Caine compiled reported shallow-landslide/debris-flow events and proposed an
intensity–duration lower envelope of the form

$$
I_c(D)=\alpha D^{-\beta},
$$

with rainfall intensity $I_c$ in mm/h, duration $D$ in hours, dimensionless
$\beta$, and $\alpha$ in
$(\mathrm{mm}/\mathrm{h})\,\mathrm{h}^{\beta}$. In the cited compilation,
$\alpha=14.82$ and $\beta=0.39$, with the stated best-defined duration range
from 10 minutes to 10 days
([Geografiska Annaler 1980](https://doi.org/10.1080/04353676.1980.11879996)).
Those numbers are historical dataset results, not constants of nature.

Keefer et al. combined empirical/theoretical rainfall relations, susceptibility
mapping, real-time telemetered gauges, and forecasts in a San Francisco Bay
regional warning prototype. During the February 1986 storms, the system issued
warnings and predicted the timing of major events, while the authors reported
that modifications and further development were needed
([Science 1987](https://doi.org/10.1126/science.238.4829.921)). Baum, Godt, and
Savage later coupled transient unsaturated infiltration to grid-cell slope
stability; the Seattle-area test estimated onset on average 7 hours earlier
than observed landslides under that event/model configuration
([JGR Earth Surface 2010](https://doi.org/10.1029/2009JF001321)).

These studies establish a layered warning architecture:

```text
regional susceptibility and exposure map
  + live rainfall and forecast
  + antecedent hydrologic state or proxy
  + empirical threshold or infiltration/stability model
  -> calibrated alert region and time window
  -> separate human emergency authority
  -> event/non-event adjudication and model update
```

It maps to P-007 for observation allocation and P-009 for monitoring,
calibration, warning, and post-event correction. It does not map to P-002's
local actuation unless a separately authorized system can take a bounded
action. The landscape does not issue the warning or choose an evacuation.

### Strongest warning nulls and failure boundary

Any AI landslide-warning result must compare with:

- climatological/base-rate and susceptibility-only forecasts;
- regional intensity–duration and cumulative-rainfall thresholds;
- logistic, survival, point-process, and calibrated hazard models;
- transient infiltration plus infinite-slope stability;
- displacement/velocity thresholding where InSAR/GNSS is available;
- nowcast/forecast ensembles with explicit precipitation uncertainty; and
- abstention outside mapped failure modes.

Evaluation must use complete prospective operating intervals, not only storms
that produced landslides. Report alerts per unit time and area, missed events,
lead time, spatial intersection, calibration, exposed population/assets,
evacuation or closure cost, and performance under fires, sensor loss, new
landslide types, and altered rainfall climatology.

## GEO-12 — Sparse observation resolves averages, not hidden ground truth

Backus and Gilbert formalized the resolving power of finite gross Earth data:
an inverse estimate is an averaging of the unknown state with a resolution
kernel, subject to a tradeoff between resolution and uncertainty
([Geophysical Journal 1968](https://doi.org/10.1111/j.1365-246X.1968.tb00216.x)).
Beven identified structural, subgrid, parameter-dimensionality, and practical
limits of nominally physically based distributed hydrologic models
([Journal of Hydrology 1989](https://doi.org/10.1016/0022-1694(89)90101-7)).
Blöschl and Sivapalan distinguish process, observation, and model scales and
show why aggregation/upscaling is itself a modeling operation
([Hydrological Processes 1995](https://doi.org/10.1002/hyp.3360090305)).

For field $x(\mathbf r,t)$, observation $k$ can be represented as

$$
y_k=
\int_{t_k^-}^{t_k^+}
\int_{\Omega_k}
W_k(\mathbf r,t)x(\mathbf r,t)\,d\mathbf r\,dt
+\epsilon_k,
$$

where $\Omega_k$ is spatial support, $[t_k^-,t_k^+]$ is the integration window,
$W_k$ is the instrument/sampling kernel, and $\epsilon_k$ is error. If $W_k$
is normalized to integrate to one, $y_k$ has the same unit as $x$; otherwise
the kernel's units and output unit must be stated. A point gauge, raster pixel,
basin sediment sample, and cosmogenic-nuclide erosion estimate have different
$W_k$ even if all are called “erosion observations.”

Tarboton's D-infinity routing method shows that even drainage area derived from
a gridded elevation model depends on the discrete flow-direction representation
([Water Resources Research 1997](https://doi.org/10.1029/96WR03137)). Perron,
Kirchner, and Dietrich found characteristic ridge–valley wavelengths and
nonfractal structure using spectra of high-resolution topography at two
California sites
([JGR Earth Surface 2008](https://doi.org/10.1029/2007JF000866)). Resolution can
reveal a characteristic scale, but a scale detected at one site and instrument
does not license scale-free extrapolation.

### Sparse and biased sensing failure modes

1. **Support mismatch:** a local pore-pressure sensor is compared with a
   catchment-average outcome.
2. **Temporal aliasing:** intermittent imagery misses the acceleration or
   failure interval.
3. **Survivorship/censoring:** deposits are preserved where later erosion did
   not remove them.
4. **Geometry ambiguity:** surface traces stand in for unknown 3-D connectivity.
5. **Resolution-induced topology:** DEM gridding, pit filling, and channel
   thresholds alter apparent links and contributing area.
6. **Equifinality:** different parameter/state combinations match the same
   runoff, topography, or displacement.
7. **Change of support:** sensor missions, pixel size, laboratory methods, and
   sampled catchments change across a time series.
8. **Event-conditioned labels:** inventories omit small, obscured, remote, or
   non-damaging failures and overrepresent investigated storms.

P-007 can allocate additional measurements, but a residual cannot identify
which hidden process is wrong without an observation model. P-009 must own
sensor calibration, support metadata, inventory revision, and negative-control
periods.

## GEO-13 — Geological measurements use incompatible clocks unless modeled

Granger, Kirchner, and Finkel showed how in-situ-produced cosmogenic nuclides in
alluvial sediment can estimate spatially averaged long-term erosion over a
contributing basin
([Journal of Geology 1996](https://doi.org/10.1086/629823)). Kirchner et al.
compared decadal sediment yields, approximately 10-kyr cosmogenic estimates,
and approximately 10-Myr exhumation estimates in Idaho mountain catchments. In
that study, long-term cosmogenic estimates averaged 17 times the 10–84-year
sediment-flux estimates while agreeing more closely with the much longer
thermochronologic scale
([Geology 2001](https://doi.org/10.1130/0091-7613%282001%29029%3C0591%3AMEOYKY%3E2.0.CO%3B2)).
The authors interpreted this as strong episodicity at those sites, not a
universal factor.

Hilley et al. used persistent-scatterer InSAR to resolve millimetre-per-year
line-of-sight changes of slow-moving landslides and their seasonal variation
([Science 2004](https://doi.org/10.1126/science.1098821)). Such data are
powerful where coherent scatterers and favorable viewing geometry exist; they
measure line-of-sight surface displacement, not the full subsurface slip field
or a universal failure precursor.

The lesson for AI observability is exact:

| Evidence stream | Natural aggregation | What it can miss |
| --- | --- | --- |
| high-rate local sensor | seconds–days at one instrument volume | spatially remote or deeper mode; long recurrence |
| event inventory or gauge | event/daily to decades over a mapped/gauged region | unrecorded small events; rare long-cycle bursts |
| repeat imagery/InSAR | revisit interval and pixel/scatterer support | rapid between-pass motion, decorrelation, unfavorable geometry |
| basin sediment sample/cosmogenic nuclide | contributing-area mixture over kyr-scale exposure/erosion | event ordering and local extremes |
| stratigraphic record | irregular preserved deposition intervals | erased hiatuses, autogenic events, exact forcing |
| thermochronology | exhumation integrated over Myr and mineral closure history | recent transient rates and surface-process partition |

Fusing these as if they were synchronous labels creates false precision. Each
datum must carry its kernel, interval, age uncertainty, and preservation model.

## Cross-domain deduplication

### Against the current principle registry

| Registry bundle | Genuine geological manifestation | What must not be imported | Strongest established null |
| --- | --- | --- | --- |
| [P-005 — use-dependent topology](../principle-registry.md#p-005--use-dependent-topology) | flow concentration, incision, fracture/fault linkage, route capture, avulsion and abandoned-path reuse | more use can erode capacity or concentrate hazard; no exploration reserve or service objective is inherent | online network design, reinforcement/decay routing, dynamic graph optimization, transport PDEs |
| [P-006 — homeostatic negative feedback](../principle-registry.md#p-006--homeostatic-negative-feedback) | slope relaxation, near-threshold channel geometry, local deposition/incision feedback | not every feedback is negative; thresholds can produce cascades, avulsion, landsliding, or permanent capture | nonlinear/hybrid control, constrained dynamics, conservation-law models |
| [P-007 — prediction-error allocation](../principle-registry.md#p-007--prediction-error-allocation) | targeted field sampling, inversion resolution, sensor placement, residual model checking | residual size is not physical importance; support mismatch and unobservable state can hide failure | optimal experimental design, data assimilation, Bayesian inverse methods, Backus–Gilbert resolution |
| [P-008 — compartmentalized interaction](../principle-registry.md#p-008--compartmentalized-interaction) | catchments, sub-basins, fracture clusters, sediment-storage reaches | a watershed boundary is not an isolation boundary; water, sediment, stress, organisms, and hazards cross it | graph partitioning with conserved cut flows and boundary conditions |
| [P-009 — maintenance plane](../principle-registry.md#p-009--maintenance-plane) | monitoring, mapping, sediment management, slope drainage, inspections, model/inventory revision | natural erosion is not maintenance; it does not preserve an externally declared service | condition monitoring, asset management, data assimilation, warning operations, lifecycle intervention planning |
| [P-010 — structural offloading and co-design](../principle-registry.md#p-010--structural-offloading-and-co-design) | durable channels/topography route later flow; fracture fabric controls later transport | path formation consumes and relocates matter, can be irreversible, and may encode obsolete forcing | passive mechanics, physical routing, compiled topology, ASIC/FPGA/analog substrate nulls from adaptive materials |
| [P-012 — memory matched to information lifetime](../principle-registry.md#p-012--memory-matched-to-information-lifetime) | soil moisture, stored sediment, abandoned channels, fault fabric, cosmogenic and stratigraphic records retain different histories | persistence is not addressability, fidelity, provenance, or safe reset | multirate state estimation, event logs, summaries, archives, retention-aware storage |
| [P-013 — externalized shared state](../principle-registry.md#p-013--externalized-shared-state) | topography and deposits influence later water/sediment paths and later observers | a passive landscape does not identify writers, preserve exact messages, or supply access control | explicit spatial database, blackboard, append-only event log, shared physical field model |

### Against the Earth-transition audit

The geology literature reinforces, but does not expand, the transition-class
boundary:

- slope failure can occur after a mechanistic margin crosses zero;
- landslide timing can depend on transient infiltration without a detectable
  gradual surface precursor;
- avulsion and capture are thresholded topology changes with path-dependent
  post-event states;
- sediment storage/release can create flickering-like or bursty output without
  a changing external forcing; and
- slow observed change can reflect averaging or transport capacity rather than
  weakening restoring stability.

Therefore the
[Earth-transition audit](2026-08-05-earth-system-transition-signals.md) remains
the owner of transition-class-aware fragility sensing. Geology contributes
mechanism-specific test tracks—failure margin, infiltration delay, avulsion,
signal shredding, and support mismatch—not a broader early-warning claim.

### Against adaptive materials and self-assembly

The
[adaptive-materials audit](2026-08-05-adaptive-materials-and-self-assembly.md)
already establishes that substrate state, passive dynamics, hysteresis,
physical learning, and local repair are not free computation. Landscapes make
that boundary more severe:

- write time can be centuries or longer;
- reset may require moving enormous material or may be impossible;
- the substrate is open, heterogeneous, and only sparsely observed;
- the state may be produced by forcing irrelevant to the current task; and
- “readout” can require destructive sampling, inversion, or proxy assumptions.

Geological topology is therefore evidence for structural offload and material
memory, not evidence that a rewritable physical skill substrate is easy.

### Against maintenance and recovery

Natural channel migration, erosion, sediment flushing, or slope collapse may
renew one local capacity while damaging downstream service. Maintenance
requires an externally defined function, diagnosis, bounded intervention,
verification, and replenishment. The passive landscape has no such contract.

The strongest nulls are ordinary monitoring, dredging/sediment management,
drainage and stabilization, inspection, hazard zoning, engineered redundancy,
and restoration planning. Any “self-healing network” analogy must report the
service that recovered, the material inventory consumed, collateral change,
and readiness for the next event.

### Against the power-grid audit

The
[power-grid audit](2026-08-05-power-grids-protection-and-recovery.md) separates
fast local physics, authorized protection, slower control, contingency reserve,
and restoration. Geology supplies no counterexample to that ladder. A fracture
or landslide is a physical response, not a relay; a river capture is topology
change, not a remedial action scheme; a rainfall threshold is a warning rule,
not actuation authority.

The grid audit's latency-qualified authority envelope becomes relevant only
for engineered hazard response—closing a road, releasing a reservoir,
evacuating, stabilizing, or rerouting service. The certificate must depend on
observation support, forecast age, slope/river headroom, actuator limits, and
human authority. Passive geomorphic change does not broaden that residual.

## What geology adds without creating another principle

1. **Topology writes are mass- and damage-conserving.** Link creation/removal
   has a physical destination and often an irreversible transient.
2. **Current topology hides construction history.** A good present graph does
   not reveal alternatives destroyed during search or the forcing objective.
3. **Transport can erase its input signal.** Persistent physical records are
   not inherently faithful memories.
4. **Observation support is part of the datum.** A value without spatial and
   temporal support is not ready for fusion.
5. **The same forcing can produce direction-dependent adjustment.** Repeated
   return-to-regime tests are mandatory for topology adaptation.
6. **Threshold exceedance and warning are different problems.** A precise
   failure criterion with hidden state may yield worse operational warning than
   a calibrated empirical threshold, and vice versa.

## Held residual: support-qualified evidence fusion

### Candidate statement

For observation $k$, define a support certificate

$$
\mathcal S_k=
\left(
\Omega_k,
[t_k^-,t_k^+],
\ell_k,
\delta_k,
M_k,
P_k,
I_k
\right),
$$

where $\Omega_k$ is spatial support in m, m², m³, or an explicit graph subset;
$[t_k^-,t_k^+]$ is the integration interval in seconds; $\ell_k$ is reporting
latency in seconds; $\delta_k$ is spatial/temporal resolution in declared
units; $M_k$ is the measurement operator and preprocessing version; $P_k$ is
preservation/censoring state; and $I_k$ records interventions capable of
changing both system and observation. A fusion layer may compare or aggregate
$y_k$ only through a declared transformation between certificates.

The speculative systems claim is that requiring this certificate at every
telemetry boundary may reduce false diagnosis in AI systems whose metrics mix
request-level events, rolling aggregates, sampled traces, delayed human
labels, retained logs, and post-intervention outcomes.

### Exact problem

Engineered systems routinely combine observations with different clocks and
supports:

- a per-token confidence, per-request latency, five-minute service average,
  daily evaluation sample, monthly incident count, and quarterly human audit;
- a local module health probe and globally aggregated loss;
- immediate automated labels and delayed expert adjudication; and
- telemetry after an intervention that altered routing, sampling, or event
  prevalence.

Naive fusion treats those values as contemporaneous measurements of one state.
The result can reverse trends, hide localized failure, double-count correlated
evidence, and train a controller on labels produced under a different policy.

### Information and authority path

```text
raw sensor, sample, log, or human report
  -> immutable value plus support certificate
  -> observation-model transform into a declared target support
  -> uncertainty and overlap accounting
  -> estimator or diagnostic model
  -> abstain, request a better-supported observation, or issue evidence
  -> separately authorized intervention
  -> record intervention-induced change to future observation operators
```

### Strongest nulls

- Backus–Gilbert resolution and averaging kernels;
- multiresolution and hierarchical state-space models;
- Bayesian inverse problems and data assimilation;
- spatiotemporal Gaussian processes;
- mixed-frequency time-series models;
- causal inference with policy/intervention indicators;
- telemetry semantic schemas, event time/watermarks, and lineage systems; and
- P-007/P-009/P-012/P-013 composed without a new principle.

### Promotion and failure boundary

Keep the candidate outside the registry unless it produces a Pareto improvement
over these nulls. Reject or narrow it if:

1. metadata enforcement alone, without a new inference rule, captures all gain;
2. a standard hierarchical state-space or Gaussian-process model matches it;
3. certificate construction costs more than the false decisions it prevents;
4. the declared support is itself inferred from the same biased data;
5. transformations create a falsely precise common scale;
6. missing preservation or intervention state remains unidentifiable;
7. results disappear when all methods receive the same timestamps, lineage,
   and observation kernels; or
8. a simpler rule—never aggregate unlike windows—performs as well.

## Applicability map

The table maps observations to engineering conditions; it does not claim that
the corresponding geological process computes a policy.

| Geological result | Potential systems use | Required state or measurement | Do not transfer when |
| --- | --- | --- | --- |
| Griffith-type fracture threshold | Guard an irreversible local topology write by an independently estimated margin | load or benefit, write cost, uncertainty, and post-write service | the margin is learned only from successful writes, damage is reversible, or a global constraint dominates |
| Fracture connectivity and cubic-law conductance | Separate graph reachability from usable capacity | topology plus aperture/capacity, boundary conditions, and finite-size bounds | binary connectivity already determines service or edge capacities are stationary and known |
| Flow–structure reinforcement | Adapt sparse routes to persistent demand | conserved flow, local load, reinforcement and decay rates, and write budget | demand cycles faster than structural response, attackers can create reinforcement, or old routes cannot decay safely |
| Drainage capture or avulsion | Evaluate expensive route replacement rather than edge-local tuning | alternative route, switching transient, abandoned-state cost, and recovery state | topology writes are cheap, service is stateless, or a standard online-routing controller dominates |
| Exner sediment balance | Account jointly for creation, movement, deletion, and displaced state | a closed resource ledger and explicit boundary fluxes | deleted state has no cost and no conservation law applies |
| Landscape response time and hysteresis | Schedule updates and resets by rate, direction, and retained state | a declared response metric, forcing history, and repeated forward/reverse sweeps | the system is memoryless at the tested scale or only one forcing direction is observed |
| Sediment signal shredding | Treat persistent traces as a filtered, censored record | preservation operator, event distribution, and independent calibration | logging is complete, immutable, and causally ordered |
| Landslide failure margin and warning thresholds | Gate high-consequence action through hazard evidence and calibrated abstention | independent state estimate, forecast horizon, base rate, authority, and intervention cost | a threshold is exported outside its calibration domain or triggers unbounded action |
| Multiscale observation kernels | Fuse measurements only after declaring their support | spatial/temporal kernel, latency, preprocessing, preservation, and intervention state | all observations share the same support and clock |
| Geological clocks | Compare short and long records without treating either as ground truth | exposure/retention model and scale-matched uncertainty | processes are stationary and all estimators integrate the same interval |

The most credible transfers are therefore accounting constraints, observation
semantics, and falsification procedures. Directly copying crack growth,
channelization, or slope failure as an optimizer remains a weak analogy until
it beats ordinary graph, control, estimation, and lifecycle baselines.

## Equal-budget falsification program

### Common protocol and accounting

Every candidate and null receives the same training traces, admissible
observations, actuation envelope, tuning evaluations, and random seeds. It may
not inspect the simulator's hidden state unless that state is also exposed to
all baselines. Report the resource envelope

$$
\mathcal B=(E,C,M,O,W,T),
$$

where $E$ is wall-plug energy in joules, $C$ is compute in FLOPs or declared
hardware operations, $M$ is peak and retained memory in bytes, $O$ is sensor
samples and ingested bytes, $W$ is the count and cost in joules or service-loss
seconds of topology writes, and $T$ is wall-clock latency in seconds. If a
physical/material experiment is used, add material input and discarded mass in
kilograms. Do not hide observation, tuning, retraining, migration, reset, or
recovery cost in setup.

Compare methods by the unscalarized outcome vector

$$
\mathbf J=
(L_{\mathrm{service}},N_{\mathrm{failure}},N_{\mathrm{false}},
E,O_b,W_c,T_{\mathrm{recover}},M_{\mathrm{discard}}),
$$

where $L_{\mathrm{service}}$ is a declared task loss in task units,
$N_{\mathrm{failure}}$ and $N_{\mathrm{false}}$ are event counts,
$E$ is joules, $O_b$ is observation traffic in bytes, $W_c$ is topology-write
cost in joules or service-loss seconds, $T_{\mathrm{recover}}$ is recovery time
in seconds, and $M_{\mathrm{discard}}$ is discarded physical mass in kilograms
or discarded state in bytes. A candidate passes only by a preregistered Pareto
improvement or a preregistered scalarization whose weights are reported before
results.

### Test A — connectivity is not capacity

- **Task:** predict reachability and end-to-end flow in finite synthetic and
  measured fracture graphs while aperture fields, boundary conditions, and
  sparse probes vary independently.
- **Nulls:** bond/site percolation, graph connectivity, resistor-network flow,
  cubic-law flow with calibrated aperture, and a generic graph estimator.
- **Decisive result:** a geology-inspired representation must improve held-out
  flow prediction or calibration at equal $\mathcal B$, not merely classify
  connectivity. Gains must survive graph-size and boundary-condition shifts.
- **Kill:** the gain disappears when the null receives aperture and support
  metadata, or the candidate extrapolates a fitted power law beyond measured
  scale bounds.

### Test B — flow-reinforced topology under changing demand

- **Task:** maintain service on a capacitated graph under stationary, drifting,
  cycling, bursty, and adversarial demand while link writes incur migration and
  discarded-state cost.
- **Nulls:** fixed sparse topology, shortest-path and min-cost flow,
  congestion-aware online routing, standard sparsification, a Physarum-like
  adaptive network, and a budget-matched learned router.
- **Decisive result:** the candidate must reduce service loss and total write
  cost across unseen regimes, including return to an earlier regime.
- **Kill:** only monotone or stationary workloads improve; reinforcement locks
  in attacker-induced paths; or the advantage vanishes after reset and write
  costs are counted.

### Test C — erosion/deposition lifecycle accounting

- **Task:** add, move, merge, prune, and restore modules while tracking every
  byte of parameters, optimizer state, cache, index, replica, and checkpoint.
- **Nulls:** ordinary pruning/growth with complete resource accounting,
  garbage collection, quota-based lifecycle control, and constrained
  optimization with the same conservation equations.
- **Decisive result:** the proposed erosion/deposition rule must prevent ghost
  resources or reduce service loss per retained byte and joule beyond the
  accounting null.
- **Kill:** the effect is entirely due to adding a ledger, or reported savings
  omit displaced state, retraining, checkpoint, or disposal cost.

### Test D — rate, direction, and hysteresis sweep

- **Task:** apply identical forcing amplitudes with logarithmically spaced ramp
  rates, both directions, dwell times, and repeated loops; then revisit earlier
  regimes after controlled delays.
- **Nulls:** memoryless response, linear time-invariant and state-space models,
  explicit switching-cost control, and recurrent models with equal state and
  compute budgets.
- **Decisive result:** the candidate must predict loop area, lag, return state,
  and service during reversal on held-out sweep rates.
- **Kill:** apparent memory disappears after controlling for lag, hidden damage,
  or measurement averaging; one-direction performance is the only gain.

### Test E — prospective threshold warning

- **Task:** issue time-stamped warnings on a chronologically held-out rainfall,
  pore-pressure, terrain, and event stream without post-event relabeling.
- **Nulls:** calibrated intensity–duration threshold, logistic or survival
  model, physically based infiltration/stability model, and a hybrid ensemble.
- **Metrics:** event recall, false alarms per site-year, warning lead time in
  seconds, calibration, abstention rate, and decision cost under fixed authority.
- **Kill:** a universal threshold is required, spatial leakage occurs, warning
  quality is reported without base rate, or action value depends on an
  unmodeled actuator or evacuation capacity.

### Test F — support-qualified evidence fusion

- **Task:** diagnose faults from request events, rolling aggregates, sampled
  traces, delayed labels, and post-intervention observations whose supports are
  deliberately mismatched.
- **Nulls:** common-window resampling, hierarchical state-space models,
  Gaussian-process fusion, data assimilation, and metadata-only enforcement.
- **Decisive result:** certificates must improve prospective calibration or
  reduce false interventions after metadata creation, storage, and latency are
  charged to $\mathcal B$.
- **Kill:** metadata alone supplies the gain; a standard observation model
  matches it; or support fields cannot be measured independently.

### Test G — record preservation and signal shredding

- **Task:** recover a known input-event distribution after transport,
  aggregation, thresholding, deletion, and selective preservation.
- **Nulls:** deconvolution with known kernel, censored-event likelihood,
  survival/retention models, immutable full logging, and matched reservoir
  sampling.
- **Decisive result:** the candidate must estimate both the forcing and its
  uncertainty on held-out preservation regimes with less storage or energy.
- **Kill:** it treats the surviving record as an unbiased sample, cannot detect
  non-identifiability, or full logging is cheaper at the required fidelity.

### Test H — mixed-clock topology lifecycle

- **Task:** combine millisecond load, hourly faults, monthly drift, and rare
  topology replacement in one system; score immediate service, long-term
  retention, write cost, and recovery.
- **Nulls:** a monolithic controller, a standard hierarchical controller,
  event-triggered control, and independently tuned P-005/P-010/P-012/P-013
  components.
- **Decisive result:** a geology-derived synthesis must improve the joint Pareto
  frontier under clock and intervention shifts, not win one timescale by moving
  cost to another.
- **Kill:** the composed registry principles match it, the result requires
  privileged future information, or the slow layer cannot be safely suspended.

## Temporary claims

These audit-local IDs are not additions to `research/claims.md`. Their status
must not be promoted without the cited scope and falsification test.

| ID | Status | Claim and scope | Primary support | Main disproof or boundary | Affected sections |
| --- | --- | --- | --- | --- | --- |
| C-GEO-01 | established | Brittle crack advance can be expressed as an energy-release threshold in the Griffith idealization. | Griffith 1921 | ductile, frictional, chemically assisted, and heterogeneous fracture require more state | GEO-01 |
| C-GEO-02 | plausible | Interacting local failures can generate spatially organized fracture or fault sets without a central controller. | Renshaw & Pollard 1994; Cowie et al. 1993 | fit and finite-scale dependence; no evidence of represented goals | GEO-01 |
| C-GEO-03 | established | Geometric connectivity and hydraulic conductance are not equivalent. | Berkowitz 1995; Witherspoon et al. 1980 | aperture, contact, roughness, stress, and boundary conditions govern flow | GEO-02 |
| C-GEO-04 | established | Apparent fracture scaling requires explicit lower and upper cutoffs and finite-size tests. | Bonnet et al. 2001; Rundle et al. 2003 | extrapolation outside observed scales | GEO-02 |
| C-GEO-05 | established | Coupled flow, erosion, and topography can generate drainage organization through local feedback and conservation. | Smith & Bretherton 1972; Howard 1994 | model-class assumptions and absent agency | GEO-03 |
| C-GEO-06 | established | Minimum-energy drainage networks are solutions to analyst-defined objective functions, not evidence that rivers represent or optimize that objective online. | Rinaldo et al. 1992; Rodríguez-Iturbe et al. 1992; Banavar et al. 1999 | equifinality and objective choice | GEO-04 |
| C-GEO-07 | plausible | Stream-power landscape equations are useful scoped process models, not universal laws. | Howard 1994 | transport-limited, glacial, mass-wasting, vegetation, lithology, and stochastic-event regimes | GEO-03, GEO-06 |
| C-GEO-08 | established | Sediment continuity couples erosion and deposition; deletion from one control volume is flux or storage elsewhere. | Paola & Voller 2005 | open boundaries must be declared | GEO-05 |
| C-GEO-09 | established | Landscape response time depends on forcing, process law, spatial scale, metric, and initial condition. | Whipple 2001; Tucker & Slingerland 1997 | a single relaxation time is generally insufficient | GEO-06 |
| C-GEO-10 | established | Geomorphic adjustment can depend on forcing direction and prior state. | Schumm 1979; Jerolmack & Paola 2007 | distinguish hysteresis from lag, damage, and averaging | GEO-07 |
| C-GEO-11 | established | River capture and avulsion can persistently reassign transport service and encode path dependence. | Willett et al. 2014; Jerolmack & Paola 2007 | topology change is not delegated control | GEO-08 |
| C-GEO-12 | established | Sediment transport and preservation can destroy or distort environmental input signals. | Jerolmack & Paola 2010 | inference requires a preservation operator | GEO-09 |
| C-GEO-13 | plausible | Near-threshold channel dynamics can act as a nonlinear filter on climatic forcing in the studied systems. | Phillips & Jerolmack 2016 | field scope and alternative sediment-supply controls | GEO-09 |
| C-GEO-14 | established | Infinite-slope and infiltration models express conditional landslide margins, not universal trigger laws. | Montgomery & Dietrich 1994; Iverson 2000 | unobserved material and hydrologic state | GEO-10 |
| C-GEO-15 | established | Empirical rainfall intensity–duration thresholds can support regional warning within calibration bounds. | Caine 1980; Keefer et al. 1987; Baum et al. 2010 | base-rate, transfer, sensor, terrain, and lead-time dependence | GEO-11 |
| C-GEO-16 | established | Sparse geophysical and hydrologic data resolve averages under an observation operator, not a unique hidden field. | Backus & Gilbert 1968; Beven 1989; Blöschl & Sivapalan 1995 | resolution and model structure must be reported | GEO-12 |
| C-GEO-17 | established | Geomorphic estimates integrating different spatial and temporal windows need not estimate the same quantity. | Granger et al. 1996; Kirchner et al. 2001; Hilley et al. 2004 | stationarity and support equivalence must be tested | GEO-13 |
| C-GEO-18 | speculative | Mandatory support certificates may improve mixed-clock AI diagnosis after their full cost is counted. | transfer hypothesis; no direct geological validation | Tests F and H; reject if standard observation models or metadata-only schemas match it | Held residual |

## Integration disposition

- Map channel formation, local reinforcement, and sparse traffic to
  [P-005](../principle-registry.md#p-005--use-dependent-topology).
- Map consolidation and irreversible topology writes to
  [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design).
- Map operating margins, rainfall warnings, and landslide gating to
  [P-006](../principle-registry.md#p-006--homeostatic-negative-feedback) and
  [P-007](../principle-registry.md#p-007--prediction-error-allocation), while
  catchment and fracture compartments map to
  [P-008](../principle-registry.md#p-008--compartmentalized-interaction).
- Map mixed clocks and preserved records to
  [P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime) and
  [P-013](../principle-registry.md#p-013--externalized-shared-state).
- Keep passive fracture, river, and landslide self-organization under P-005
  and P-010 only at the descriptive level; do not infer a controller. Reserve
  [P-009](../principle-registry.md#p-009--maintenance-plane) for engineered
  monitoring, bounded intervention, verification, and replenishment.
- Hold support-qualified evidence fusion outside the registry as
  `C-GEO-18` until Tests F and H beat standard observation-model and metadata
  nulls at equal budget.

**Audit verdict:** geology and geomorphology provide unusually strong nulls for
claims that attractive topology implies intelligence. Their transferable value
is narrower and more useful: conserved lifecycle accounting, capacity-aware
topology, irreversible-write costs, rate/direction tests, preservation-aware
records, and support-qualified observation. No new nature-derived AI principle
is established by this audit. One residual is held for experiment, not promoted.

## Audit-local bibliography

The bibliography is complete for works cited in this audit. DOI links in the
body are the authoritative locators; imported synthesis is not evidence.

```bibtex
@article{griffith1921rupture,
  author = {Griffith, Alan A.},
  title = {The Phenomena of Rupture and Flow in Solids},
  journal = {Philosophical Transactions of the Royal Society of London. Series A},
  year = {1921},
  volume = {221},
  number = {582--593},
  pages = {163--198},
  doi = {10.1098/rsta.1921.0006}
}

@article{renshaw1994fracture,
  author = {Renshaw, Carl E. and Pollard, David D.},
  title = {Numerical Simulation of Fracture Set Formation: A Fracture Mechanics Model Consistent with Experimental Observations},
  journal = {Journal of Geophysical Research: Solid Earth},
  year = {1994},
  volume = {99},
  number = {B5},
  pages = {9359--9372},
  doi = {10.1029/94JB00139}
}

@article{cowie1993faults,
  author = {Cowie, Patience A. and Vanneste, Christian and Sornette, Didier},
  title = {Statistical Physics Model for the Spatiotemporal Evolution of Faults},
  journal = {Journal of Geophysical Research: Solid Earth},
  year = {1993},
  volume = {98},
  number = {B12},
  pages = {21809--21821},
  doi = {10.1029/93JB02223}
}

@article{berkowitz1995connectivity,
  author = {Berkowitz, Brian},
  title = {Analysis of Fracture Network Connectivity Using Percolation Theory},
  journal = {Mathematical Geology},
  year = {1995},
  volume = {27},
  number = {4},
  pages = {467--483},
  doi = {10.1007/BF02084422}
}

@article{bonnet2001scaling,
  author = {Bonnet, Emmanuel and Bour, Olivier and Odling, Noelle E. and Davy, Philippe and Main, Ian and Cowie, Patience and Berkowitz, Brian},
  title = {Scaling of Fracture Systems in Geological Media},
  journal = {Reviews of Geophysics},
  year = {2001},
  volume = {39},
  number = {3},
  pages = {347--383},
  doi = {10.1029/1999RG000074}
}

@article{witherspoon1980cubic,
  author = {Witherspoon, Paul A. and Wang, Jane S. Y. and Iwai, K. and Gale, John E.},
  title = {Validity of Cubic Law for Fluid Flow in a Deformable Rock Fracture},
  journal = {Water Resources Research},
  year = {1980},
  volume = {16},
  number = {6},
  pages = {1016--1024},
  doi = {10.1029/WR016i006p01016}
}

@article{rundle2003faultsystems,
  author = {Rundle, John B. and Turcotte, Donald L. and Shcherbakov, Robert and Klein, William and Sammis, Charles},
  title = {Statistical Physics Approach to Understanding the Multiscale Dynamics of Earthquake Fault Systems},
  journal = {Reviews of Geophysics},
  year = {2003},
  volume = {41},
  number = {4},
  pages = {1019},
  doi = {10.1029/2003RG000135}
}

@article{smith1972drainage,
  author = {Smith, Robert and Bretherton, Francis P.},
  title = {Stability and the Conservation of Mass in Drainage Basin Evolution},
  journal = {Water Resources Research},
  year = {1972},
  volume = {8},
  number = {6},
  pages = {1506--1529},
  doi = {10.1029/WR008i006p01506}
}

@article{howard1994drainage,
  author = {Howard, Alan D.},
  title = {A Detachment-Limited Model of Drainage Basin Evolution},
  journal = {Water Resources Research},
  year = {1994},
  volume = {30},
  number = {7},
  pages = {2261--2285},
  doi = {10.1029/94WR00757}
}

@article{rinaldo1992minimum,
  author = {Rinaldo, Andrea and Rodriguez-Iturbe, Ignacio and Rigon, Riccardo and Bras, Rafael L. and Ijjasz-Vasquez, Ede J. and Marani, Alessandro},
  title = {Minimum Energy and Fractal Structures of Drainage Networks},
  journal = {Water Resources Research},
  year = {1992},
  volume = {28},
  number = {9},
  pages = {2183--2195},
  doi = {10.1029/92WR00801}
}

@article{rodrigueziturbe1992leastenergy,
  author = {Rodriguez-Iturbe, Ignacio and Rinaldo, Andrea and Rigon, Riccardo and Bras, Rafael L. and Ijjasz-Vasquez, Ede J. and Marani, Alessandro},
  title = {Fractal Structures as Least Energy Patterns: The Case of River Networks},
  journal = {Geophysical Research Letters},
  year = {1992},
  volume = {19},
  number = {9},
  pages = {889--892},
  doi = {10.1029/92GL00938}
}

@article{banavar1999transport,
  author = {Banavar, Jayanth R. and Maritan, Amos and Rinaldo, Andrea},
  title = {Size and Form in Efficient Transportation Networks},
  journal = {Nature},
  year = {1999},
  volume = {399},
  pages = {130--132},
  doi = {10.1038/20144}
}

@article{paola2005exner,
  author = {Paola, Chris and Voller, Vaughan R.},
  title = {A Generalized Exner Equation for Sediment Mass Balance},
  journal = {Journal of Geophysical Research: Earth Surface},
  year = {2005},
  volume = {110},
  number = {F4},
  pages = {F04014},
  doi = {10.1029/2004JF000274}
}

@article{whipple2001response,
  author = {Whipple, Kelin X.},
  title = {Fluvial Landscape Response Time: How Plausible Is Steady-State Denudation?},
  journal = {American Journal of Science},
  year = {2001},
  volume = {301},
  number = {4--5},
  pages = {313--325},
  doi = {10.2475/ajs.301.4-5.313}
}

@article{tucker1997climate,
  author = {Tucker, Gregory E. and Slingerland, Rudy},
  title = {Drainage Basin Responses to Climate Change},
  journal = {Water Resources Research},
  year = {1997},
  volume = {33},
  number = {8},
  pages = {2031--2047},
  doi = {10.1029/97WR00409}
}

@article{willett2014reorganization,
  author = {Willett, Sean D. and McCoy, Scott W. and Perron, J. Taylor and Goren, Liran and Chen, Chia-Yu},
  title = {Dynamic Reorganization of River Basins},
  journal = {Science},
  year = {2014},
  volume = {343},
  number = {6175},
  pages = {1248765},
  doi = {10.1126/science.1248765}
}

@article{jerolmack2007avulsion,
  author = {Jerolmack, Douglas J. and Paola, Chris},
  title = {Complexity in a Cellular Model of River Avulsion},
  journal = {Geomorphology},
  year = {2007},
  volume = {91},
  number = {3--4},
  pages = {259--270},
  doi = {10.1016/j.geomorph.2007.04.022}
}

@article{jerolmack2010shredding,
  author = {Jerolmack, Douglas J. and Paola, Chris},
  title = {Shredding of Environmental Signals by Sediment Transport},
  journal = {Geophysical Research Letters},
  year = {2010},
  volume = {37},
  number = {19},
  pages = {L19401},
  doi = {10.1029/2010GL044638}
}

@article{phillips2016filter,
  author = {Phillips, Colin B. and Jerolmack, Douglas J.},
  title = {Self-Organization of River Channels as a Critical Filter on Climate Signals},
  journal = {Science},
  year = {2016},
  volume = {352},
  number = {6286},
  pages = {694--697},
  doi = {10.1126/science.aad3348}
}

@article{schumm1979thresholds,
  author = {Schumm, Stanley A.},
  title = {Geomorphic Thresholds: The Concept and Its Applications},
  journal = {Transactions of the Institute of British Geographers},
  year = {1979},
  volume = {4},
  number = {4},
  pages = {485--515},
  doi = {10.2307/622211}
}

@article{montgomery1994landslide,
  author = {Montgomery, David R. and Dietrich, William E.},
  title = {A Physically Based Model for the Topographic Control on Shallow Landsliding},
  journal = {Water Resources Research},
  year = {1994},
  volume = {30},
  number = {4},
  pages = {1153--1171},
  doi = {10.1029/93WR02979}
}

@article{iverson2000landslide,
  author = {Iverson, Richard M.},
  title = {Landslide Triggering by Rain Infiltration},
  journal = {Water Resources Research},
  year = {2000},
  volume = {36},
  number = {7},
  pages = {1897--1910},
  doi = {10.1029/2000WR900090}
}

@article{caine1980rainfall,
  author = {Caine, Nel},
  title = {The Rainfall Intensity-Duration Control of Shallow Landslides and Debris Flows},
  journal = {Geografiska Annaler: Series A, Physical Geography},
  year = {1980},
  volume = {62},
  number = {1--2},
  pages = {23--27},
  doi = {10.1080/04353676.1980.11879996}
}

@article{keefer1987warning,
  author = {Keefer, David K. and Wilson, Raymond C. and Mark, Robert K. and Brabb, Earl E. and Brown, William M., III and Ellen, Stephen D. and Harp, Edwin L. and Wieczorek, Gerald F. and Alger, Cynthia S. and Zatkin, Robert S.},
  title = {Real-Time Landslide Warning during Heavy Rainfall},
  journal = {Science},
  year = {1987},
  volume = {238},
  number = {4829},
  pages = {921--925},
  doi = {10.1126/science.238.4829.921}
}

@article{baum2010timing,
  author = {Baum, Rex L. and Godt, Jonathan W. and Savage, William Z.},
  title = {Estimating the Timing and Location of Shallow Rainfall-Induced Landslides Using a Model for Transient, Unsaturated Infiltration},
  journal = {Journal of Geophysical Research: Earth Surface},
  year = {2010},
  volume = {115},
  number = {F3},
  pages = {F03013},
  doi = {10.1029/2009JF001321}
}

@article{backus1968resolution,
  author = {Backus, George and Gilbert, Freeman},
  title = {The Resolving Power of Gross Earth Data},
  journal = {Geophysical Journal of the Royal Astronomical Society},
  year = {1968},
  volume = {16},
  number = {2},
  pages = {169--205},
  doi = {10.1111/j.1365-246X.1968.tb00216.x}
}

@article{beven1989hydrology,
  author = {Beven, Keith},
  title = {Changing Ideas in Hydrology---The Case of Physically-Based Models},
  journal = {Journal of Hydrology},
  year = {1989},
  volume = {105},
  number = {1--2},
  pages = {157--172},
  doi = {10.1016/0022-1694(89)90101-7}
}

@article{bloeschl1995scale,
  author = {Bloeschl, Guenter and Sivapalan, Murugesu},
  title = {Scale Issues in Hydrological Modelling: A Review},
  journal = {Hydrological Processes},
  year = {1995},
  volume = {9},
  number = {3--4},
  pages = {251--290},
  doi = {10.1002/hyp.3360090305}
}

@article{tarboton1997flow,
  author = {Tarboton, David G.},
  title = {A New Method for the Determination of Flow Directions and Upslope Areas in Grid Digital Elevation Models},
  journal = {Water Resources Research},
  year = {1997},
  volume = {33},
  number = {2},
  pages = {309--319},
  doi = {10.1029/96WR03137}
}

@article{perron2008spectral,
  author = {Perron, J. Taylor and Kirchner, James W. and Dietrich, William E.},
  title = {Spectral Signatures of Characteristic Spatial Scales and Nonlinear Diffusion in Landscapes},
  journal = {Journal of Geophysical Research: Earth Surface},
  year = {2008},
  volume = {113},
  number = {F4},
  pages = {F04003},
  doi = {10.1029/2007JF000866}
}

@article{granger1996erosion,
  author = {Granger, Darryl E. and Kirchner, James W. and Finkel, Robert C.},
  title = {Spatially Averaged Long-Term Erosion Rates Measured from In Situ-Produced Cosmogenic Nuclides in Alluvial Sediment},
  journal = {The Journal of Geology},
  year = {1996},
  volume = {104},
  number = {3},
  pages = {249--257},
  doi = {10.1086/629823}
}

@article{kirchner2001timescales,
  author = {Kirchner, James W. and Finkel, Robert C. and Riebe, Clifford S. and Granger, Darryl E. and Clayton, James L. and King, John G. and Megahan, Walter F.},
  title = {Mountain Erosion over 10 yr, 10 k.y., and 10 m.y. Time Scales},
  journal = {Geology},
  year = {2001},
  volume = {29},
  number = {7},
  pages = {591--594},
  doi = {10.1130/0091-7613(2001)029<0591:MEOYKY>2.0.CO;2}
}

@article{hilley2004landslides,
  author = {Hilley, George E. and Burgmann, Roland and Ferretti, Alessandro and Novali, Fabrizio and Rocca, Fabio},
  title = {Dynamics of Slow-Moving Landslides from Permanent Scatterer Analysis},
  journal = {Science},
  year = {2004},
  volume = {304},
  number = {5679},
  pages = {1952--1955},
  doi = {10.1126/science.1098821}
}
```

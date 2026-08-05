# Soft and active matter: agency, energy, and phase-boundary audit

<!-- markdownlint-disable MD013 -->

**Date:** 2026-08-05

**Status:** breadth-first primary-source audit. The C-SAM-* identifiers in
this file are temporary and are not entries in the shared claim ledger.

**Scope:** flocking, active nematics, motility-induced phase separation,
jamming, granular flow, colloidal self-organization, topological defects,
local interaction rules, and externally driven nonequilibrium matter.

**Question:** which physical mechanisms can remove repeated digital work, and
which attractive patterns are only passive relaxation, continuously powered
fixed dynamics, or externally implemented feedback?

## Executive finding

Soft and active matter supplies strong substrate mechanisms and even stronger
null models. Local interactions can produce ordered motion, clusters, phase
separation, defects, rigidity, flow arrest, and reversible assembly without a
central planner. None of those observations by itself establishes sensing,
representation, objective evaluation, policy adaptation, or learning.

The audit therefore separates four layers that are often collapsed by the
word "active":

| Layer | Minimum causal description | Energy source | Sensing/control | Adaptive policy |
| --- | --- | --- | --- | --- |
| Passive physics | relaxes or fluctuates under a fixed energy landscape and boundary conditions | thermal, gravitational, elastic, or imposed preparation | none required | absent |
| Driven fixed dynamics | constituents continuously consume or receive energy under fixed interaction rules | chemical fuel, light, electric field, vibration, gravity, or imposed flow | physical coupling may respond locally, but no explicit estimator is required | absent |
| Feedback-controlled matter | observations are converted into interventions by a controller | drive plus sensor, compute, communication, and actuator power | explicit and measurable | fixed unless an update rule is added |
| Adaptive matter/system | performance evidence changes the policy, interaction rule, morphology, or objective over time | all preceding costs plus training, validation, memory, and reset | explicit, with observation support and delay | present and testable |

The cited flocking, motility-induced phase separation, active-nematic,
jamming, granular-flow, and most colloidal-assembly results occupy the first
two layers. Khadka et al.'s information-bound particles and Lavergne et al.'s
perception-dependent particles occupy the third: an external observation and
feedback apparatus supplies the interaction. None of the audited systems
demonstrates a task-general learned policy that updates from success or
failure.

No new stable project principle survives deduplication. The useful transfers
are scoped implementations or stress tests of
[P-005](../principle-registry.md#p-005--use-dependent-topology),
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback),
[P-010](../principle-registry.md#p-010--structural-offloading-and-co-design),
and [P-011](../principle-registry.md#p-011--transient-communication-coalitions).
The only held residue is an experiment for
[Candidate 006](../../experiments/candidates/006-reversible-physical-skill.md):
compile a stable, high-frequency, spatially local coordination rule into a
reversible physical phase or interaction field, retain a digital shadow and
health probes, and require lifecycle superiority over passive mechanics,
analog feedback, and conventional distributed control. It is not promoted as
a new principle.

## Evidence and interpretation rules

This audit uses primary experimental or theoretical papers for mechanism
claims. A theory paper establishes a result inside its model assumptions. A
simulation establishes behavior of the implemented model and protocol. An
experiment establishes behavior of the apparatus and operating regime. None
of these automatically establishes a universal law or an AI architecture.

Every proposed transfer must answer:

1. What physical state contains the program, working state, and memory?
2. What supplies free energy, and where is it dissipated?
3. Which variables are sensed, at what spatial and temporal support?
4. Is the interaction a constitutive response, a fixed feedback law, or an
   updated policy?
5. Which work is removed from software, and which fabrication, transduction,
   readout, reset, and maintenance work replaces it?
6. Which conventional controller, optimizer, scheduler, or material is the
   strongest null?
7. What observation would falsify the transfer?

The imported Google and Gemini material is not evidence for this audit. The
closest prior project nulls are:

- [adaptive materials and self-assembly](2026-08-05-adaptive-materials-and-self-assembly.md),
  for physical computation, reversible assembly, lifecycle energy, reset, and
  digital-shadow requirements;
- [collective and ecological resilience](2026-08-05-collective-ecological-resilience.md),
  for group thresholds, local rules, diversity, and correlated failure;
- [chemistry, reaction networks, and proofreading](2026-08-05-chemistry-reaction-networks-proofreading.md),
  for driven nonequilibrium selectivity and fuel accounting; and
- [engineering analogues](2026-08-05-engineering-analogues.md), for control,
  routing, scheduling, caching, and hardware/software co-design nulls.

## Shared mathematical boundary

### Passive overdamped dynamics

A passive Brownian configuration \(x\) can be represented locally as

$$
\dot{x}=-M\nabla U(x)+\sqrt{2k_BTM}\,\xi(t).
$$

\(x\) has the coordinates appropriate to the substrate, \(M\) is mobility,
\(U\) is potential energy in joules, \(k_B\) is the Boltzmann constant in
joules per kelvin, \(T\) is temperature in kelvin, and \(\xi\) is normalized
white noise. For one translational coordinate, \(M\) has units
\(\mathrm{m/(N\,s)}\), so both deterministic and stochastic terms have units
\(\mathrm{m/s}\). This dynamics can find low-energy configurations without a
represented objective or online policy update.

At equilibrium,

$$
p(x)=Z^{-1}\exp\left[-\frac{U(x)}{k_BT}\right],
$$

where \(p\) is a probability density and \(Z\) normalizes it. DNA-mediated
colloidal assembly can program \(U\) through binding specificity, but the
assembly process is not thereby an adaptive search policy.

### Active Brownian dynamics

A common minimal model for an active particle on a substrate is

$$
\dot{\mathbf r}_i
=v_0\mathbf p_i+\mu\mathbf F_i
+\sqrt{2D_t}\,\boldsymbol{\xi}_i(t),
\qquad
\dot{\theta}_i=\sqrt{2D_r}\,\eta_i(t).
$$

\(\mathbf r_i\) is position in metres, \(v_0\) is propulsion speed in
metres/second, \(\mathbf p_i=(\cos\theta_i,\sin\theta_i)\) is a dimensionless
orientation, \(\mu\) is translational mobility in
\(\mathrm{m/(N\,s)}\), \(\mathbf F_i\) is force in newtons, \(D_t\) is
translational diffusion in \(\mathrm{m^2/s}\), and \(D_r\) is rotational
diffusion in \(\mathrm{s^{-1}}\). The noises are delta-correlated with the
normalization implied by the prefactors.

Two declared persistence measures are

$$
\ell_p=\frac{v_0}{D_r}
\quad [\mathrm{m}],
\qquad
\mathrm{Pe}_r=\frac{v_0}{aD_r}
\quad [1],
$$

where \(a\) is particle radius in metres. Other Péclet conventions exist and
must not be mixed without conversion. A mechanical propulsion estimate is

$$
F_a\approx\frac{v_0}{\mu}
\quad [\mathrm{N}],
\qquad
P_a\approx F_av_0=\frac{v_0^2}{\mu}
\quad [\mathrm{W}].
$$

\(P_a\) is only the particle-scale mechanical power scale. It excludes laser
losses, fuel preparation, pumps, cameras, computers, field generators, and
thermal management.

### Active stress and chemical drive

At continuum scale, an active nematic is often represented by an active stress

$$
\boldsymbol{\sigma}^{a}=-\alpha\mathbf Q.
$$

\(\boldsymbol{\sigma}^{a}\) and \(\alpha\) are in pascals, while the nematic
order tensor \(\mathbf Q\) is dimensionless. Under one sign convention,
positive and negative \(\alpha\) distinguish contractile and extensile stress;
authors' conventions must be reported. A local mechanical power density is

$$
\dot e_a=\boldsymbol{\sigma}^{a}:\nabla\mathbf u
\quad [\mathrm{W/m^3}],
$$

where velocity \(\mathbf u\) is in metres/second and
\(\nabla\mathbf u\) in inverse seconds. Its sign can vary locally; the
integrated energy balance must include viscous dissipation and boundary work.

For an ATP-driven material, the chemical input scale is

$$
P_{\mathrm{chem}}
=\dot n_{\mathrm{ATP}}\left|\Delta G_{\mathrm{ATP}}\right|
\quad [\mathrm{W}],
$$

where \(\dot n_{\mathrm{ATP}}\) is ATP consumption in moles/second and
\(\Delta G_{\mathrm{ATP}}\) is operating free energy per mole in joules/mole.
Concentration, temperature, and reaction conditions must accompany the value.

### Flocking order and local rule

For \(N\) equal-speed particles, polarization is

$$
\Phi=\frac{1}{Nv_0}
\left\lVert\sum_{i=1}^{N}\mathbf v_i\right\rVert,
\qquad 0\leq\Phi\leq1.
$$

\(\Phi\) is dimensionless, \(\mathbf v_i\) and \(v_0\) are in
metres/second. In the Vicsek model the heading is updated from neighboring
headings plus noise, while position advances at fixed speed. This is a fixed
local rule, not evidence that particles infer goals or learn whom to follow.

### Jamming and granular flow

For frictionless soft particles, a typical finite-range repulsion is

$$
U_{ij}
=\frac{\varepsilon}{\beta}
\left(1-\frac{r_{ij}}{\sigma_{ij}}\right)^\beta
\Theta(\sigma_{ij}-r_{ij}),
$$

where \(U_{ij}\) and \(\varepsilon\) are joules, \(r_{ij}\) and
\(\sigma_{ij}\) are metres, \(\beta\) is dimensionless, and \(\Theta\) is the
dimensionless step function. Packing fraction \(\phi\) and coordination
number \(z\) are dimensionless; stress and elastic moduli are pascals.
Thresholds depend on dimension, particle shape, friction, potential, boundary,
preparation, and the operational definition of jammed.

Dense granular flow is often summarized by

$$
I=\frac{\dot\gamma d}{\sqrt{P/\rho_s}},
\qquad
\mu_{\mathrm{eff}}=\frac{\tau}{P}.
$$

\(I\) and \(\mu_{\mathrm{eff}}\) are dimensionless,
\(\dot\gamma\) is shear rate in \(\mathrm{s^{-1}}\), \(d\) is grain diameter
in metres, \(P\) and shear stress \(\tau\) are pascals, and solid density
\(\rho_s\) is in \(\mathrm{kg/m^3}\). A constitutive relation
\(\mu_{\mathrm{eff}}(I)\) is a regime-specific material model, not a policy.

### Whole-system energy

Every efficiency experiment must report

$$
E_{\mathrm{total}}
=E_{\mathrm{drive}}+E_{\mathrm{sense}}+E_{\mathrm{control}}
+E_{\mathrm{communicate}}+E_{\mathrm{transduce}}+E_{\mathrm{read}}
+E_{\mathrm{reset}}+E_{\mathrm{maint}}+E_{\mathrm{recovery}}
+E_{\mathrm{fabrication}}^{\mathrm{amortized}}.
$$

All terms are joules over the same task interval and boundary. If a term is
unmeasured, it is reported as an uncertainty interval or excluded explicitly;
it is never silently zero. Results should be joules per accepted task outcome
at matched quality, latency, operating envelope, and recovery probability.

## Mechanism-family audit

### 1. Flocking and local interaction rules

[Vicsek et al. (1995)](https://doi.org/10.1103/PhysRevLett.75.1226)
introduced constant-speed particles that align to the average direction in a
neighborhood plus angular noise and reported numerical evidence for an
order–disorder transition. [Toner and Tu
(1995)](https://doi.org/10.1103/PhysRevLett.75.4326) constructed a
nonequilibrium continuum theory with long-range orientational order in two
dimensions under the model assumptions. These establish that transport plus
local alignment can sustain macroscopic order that an equilibrium analogy
would miss.

They do not establish perception, preference, or learning. Constant
self-propulsion is an energy source supplied by the model, and the neighbor
rule is already the program. A centralized controller is unnecessary because
the desired statistic is local and permutation-invariant, not because
information processing is free.

[Ballerini et al. (2008)](https://doi.org/10.1073/pnas.0711437105)
reconstructed three-dimensional starling flocks and found the data more
consistent with interactions over a roughly fixed number of topological
neighbors than over a fixed metric radius. The result is an observational and
model-comparison inference in studied flocks, not a universal value, a direct
measurement of every bird's sensory computation, or proof that topological
routing is always superior.

[Couzin et al. (2002)](https://doi.org/10.1006/jtbi.2002.3065) showed in a
self-organizing model that small changes in individual interaction zones can
cause group-level transitions, spatial sorting, hysteresis, and history
dependence. Their "collective memory" is path dependence of the current group
configuration. It is not durable episodic memory, symbolic recall, provenance,
or cumulative knowledge.

**Project mapping.** Local neighbor choice is already
[P-005](../principle-registry.md#p-005--use-dependent-topology) when the graph
changes with interaction, and temporary alignment is
[P-011](../principle-registry.md#p-011--transient-communication-coalitions).
Density or error regulation is
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback).
[Candidate 001](../../experiments/candidates/001-adaptive-topology.md) already
owns adaptive graph lifecycle, and
[Candidate 013](../../experiments/candidates/013-deficit-capability-routing.md)
owns bidirectional resource routing. Flocking supplies a fixed-rule baseline,
not a new invariant.

**Strongest nulls.** k-nearest-neighbor consensus, Reynolds-style separation/
alignment/cohesion, distributed averaging, fixed TDMA, congestion control, and
a central estimator with broadcast. The biological mechanism matters only if
it wins after neighbor discovery, localization, communication, collision, and
propulsion are charged.

### 2. Active nematics and topological defects

[Simha and Ramaswamy
(2002)](https://doi.org/10.1103/PhysRevLett.89.058101) predicted
long-wavelength instabilities, propagating modes, and giant number fluctuations
for modeled ordered suspensions of self-propelled particles.
[Sanchez et al. (2012)](https://doi.org/10.1038/nature11591) assembled
microtubule–kinesin bundles that consumed ATP and generated chaotic flows,
active liquid-crystal behavior, and motile droplets. This is an experimentally
grounded example of internally distributed mechanical drive, but ATP and the
prepared molecular apparatus supply the free energy and rule set.

[Giomi et al. (2013)](https://doi.org/10.1103/PhysRevLett.110.228101)
showed in theory and simulation that activity changes defect dynamics:
contractile activity can enhance annihilation while extensile activity can
separate and proliferate defects. In a two-dimensional nematic, the winding
charge is

$$
s=\frac{1}{2\pi}\oint_C d\theta,
$$

where \(s\) is dimensionless, \(C\) is a closed path in metres, and
\(\theta\) is director angle in radians with nematic identification
\(\theta\equiv\theta+\pi\). Half-integer defects are topologically allowed.
Topology constrains admissible charge and transformations; it does not by
itself detect semantic errors, choose a correction, preserve truth, or supply
fault tolerance.

**Project mapping.** Defect motion and material flow are physical state under
[P-010](../principle-registry.md#p-010--structural-offloading-and-co-design).
Maintaining a target activity or defect density would require
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback).
Reversible deployment, sensing, and fallback remain
[Candidate 006](../../experiments/candidates/006-reversible-physical-skill.md).
There is no support here for a separate "topological error correction"
principle.

**Strongest nulls.** passive liquid-crystal coarsening, reaction–diffusion
patterns, excitable media, analog filters, conventional error-correcting codes,
and a digitally simulated or controlled flow. A useful defect computer must
specify input encoding, output decoding, reset, defect creation/annihilation
cost, error distribution, throughput, and total power.

### 3. Motility-induced phase separation

[Tailleur and Cates
(2008)](https://doi.org/10.1103/PhysRevLett.100.218103) analyzed interacting
one-dimensional run-and-tumble particles and obtained self-trapping and domain
formation, with a detailed-balance mapping in certain cases.
[Fily and Marchetti
(2012)](https://doi.org/10.1103/PhysRevLett.108.235702) studied repulsive
self-propelled disks with rotational noise and no aligning interaction and
found phase separation below close packing in their model.
[Buttinoni et al.
(2013)](https://doi.org/10.1103/PhysRevLett.110.238301) observed dynamic
clustering and phase separation in quasi-two-dimensional diffusiophoretic Janus
colloids and reproduced qualitative behavior with a minimal repulsive
self-propelled-particle model.

These results are especially important as a negative control for agency:
clustering, sorting, and dense/dilute allocation can arise from persistence,
collisions, density-dependent motility, and drive without attraction,
alignment, a router, or value estimate.

**Project mapping.** Phase localization can physically instantiate
[P-001](../principle-registry.md#p-001--selective-allocation) or
[P-010](../principle-registry.md#p-010--structural-offloading-and-co-design)
only after a task maps useful work to the phase and the phase boundary remains
controllable. It does not create relevance. The closest system nulls are
ordinary clustering, load balancing, queueing, caching, and
[Candidate 013](../../experiments/candidates/013-deficit-capability-routing.md).

**Strongest nulls.** equilibrium phase separation, attraction-mediated
aggregation, congestion collapse, hash partitioning, consistent hashing,
queue-based routing, and feedback-controlled load shedding. Any claimed
benefit must survive matched density, drive, delay, boundary, and reset costs.

### 4. Jamming, rigidity, and granular flow

[O'Hern et al. (2003)](https://doi.org/10.1103/PhysRevE.68.011306)
studied zero-temperature, zero-applied-stress packings of frictionless
finite-range repulsive particles and reported protocol-scoped jamming
thresholds, emergent moduli, and critical-like scaling.
[Donev et al. (2004)](https://doi.org/10.1103/PhysRevE.70.043301)
challenged aspects of the definitions and random-close-packing
interpretation. The pair is a useful warning: "point J" is not a substrate-free
constant.

[Bi et al. (2015)](https://doi.org/10.1038/nphys3471) found a
density-independent rigidity transition in a confluent-tissue vertex model,
controlled by a shape-related parameter encoding the balance of cortical
tension and adhesion. This is a model result relevant to tissue mechanics,
not evidence that any dense modular AI should tune one universal shape index.

[Pouliquen (1999)](https://doi.org/10.1063/1.869928) measured scaling in
granular layers flowing down rough inclined planes, including dependence on a
stopping thickness.
[Jop, Forterre, and Pouliquen
(2006)](https://doi.org/10.1038/nature04801) proposed and experimentally tested
a three-dimensional viscoplastic constitutive law for dense granular flow.
[Caitano et al.
(2021)](https://doi.org/10.1103/PhysRevLett.127.148002) experimentally
characterized a clogging transition in vibrated granular media as a function
of outlet size and vibration intensity. These are powerful models of
threshold, congestion, and failure; none is a learning rule.

**Project mapping.** Jamming is primarily a capacity and failure regime for
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback) and
[P-010](../principle-registry.md#p-010--structural-offloading-and-co-design).
Recovery-rate probes overlap
[Candidate 003](../../experiments/candidates/003-recovery-dynamics-fragility.md);
operating margins and degraded authority overlap
[Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md)
and
[Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md).
Clog prevention and staged intervention overlap
[Candidate 005](../../experiments/candidates/005-severity-ordered-containment.md).

**Strongest nulls.** queueing and backpressure, admission control, circuit
breakers, percolation, contact-network mechanics, calibrated load tests,
standard rheology, and conventional active system identification. "Criticality
improves computation" is rejected unless a controlled distance-to-transition
beats stable off-critical operation after variance, recovery time, and failure
cost are charged.

### 5. Passive colloidal self-assembly

[Mirkin et al. (1996)](https://doi.org/10.1038/382607a0) reversibly assembled
gold nanoparticles with complementary DNA linkers.
[Alivisatos et al.
(1996)](https://doi.org/10.1038/382609a0) used DNA to organize nanocrystal
structures.
[Manoharan, Elsesser, and Pine
(2003)](https://doi.org/10.1126/science.1086189) formed small microsphere
clusters through droplet-mediated confinement and found packings governed by a
geometric objective.

These studies show that interaction specificity, component geometry,
confinement, concentration, temperature, and annealing can encode assembly.
The design work is compiled into particles and boundary conditions. Brownian
motion supplies exploration, and free-energy differences bias outcomes.
Synthesis, purification, defects, kinetic traps, yield, readout, denaturation,
and discarded material remain in the lifecycle boundary.

**Project mapping.** This is already the molecular branch of
[P-010](../principle-registry.md#p-010--structural-offloading-and-co-design)
and the direct substrate null documented by the
[adaptive-materials audit](2026-08-05-adaptive-materials-and-self-assembly.md).
Reversible denaturation is not semantic rollback, and binding specificity is
not learned relevance.

**Strongest nulls.** conventional fabrication, pick-and-place, equilibrium
annealing, simulated annealing, constraint solving, and DNA nanotechnology.
The comparison metric is accepted assemblies per joule, time, reagent mass,
and occupied fabrication volume at equal defect tolerance.

### 6. Externally driven active colloids

[Palacci et al. (2013)](https://doi.org/10.1126/science.1230020) used
light-activated colloidal surfers to create dynamic "living crystals." The
particles consumed optical/chemical drive; self-propulsion and light-activated
interactions produced structures that formed, broke, and reformed. Turning off
the drive removed the active state. "Living" describes dynamics, not
metabolism, learning, or independent agency.

[Khadka et al.
(2018)](https://doi.org/10.1038/s41467-018-06445-1) provide the cleanest
feedback boundary. Dark-field images were processed in real time; particle
positions determined laser placement; an FPGA and software steered optical
heating; continuous feedback created virtual interactions. Reported particle
drive included incident heating power per particle on the order of tenths of a
milliwatt in demonstrated conditions, while the full microscope, camera,
computation, laser inefficiency, and thermal boundary were additional. That
apparatus is a feedback-controlled robotic system, not control-free
self-organization.

[Lavergne et al.
(2019)](https://doi.org/10.1126/science.aau5347) demonstrated group formation
and cohesion with visual-perception-dependent motility in active particles.
The scientifically useful distinction is that a specified observation rule
modulates actuation. Unless the rule itself updates from performance evidence,
this remains fixed feedback rather than adaptive policy.

**Project mapping.** The sensor/controller/particle split belongs to
[P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation),
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback), and
[P-010](../principle-registry.md#p-010--structural-offloading-and-co-design).
Observation support, delay, and intervention effects are already
[Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md)
and
[Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).
Authority under stale sensing is
[Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md).

**Strongest nulls.** camera-in-the-loop multi-agent control, optical trapping,
potential-field control, model-predictive control, consensus, and ordinary
robot swarms. The physical particles must beat these systems end to end, not
only in particle-scale propulsion power.

## Deduplication against the full project

### Principle bundles

| Soft/active-matter observation | Existing owner | Deduplication result |
| --- | --- | --- |
| only a subset becomes dense, ordered, or load-bearing | P-001 selective allocation | phase selection does not define task relevance |
| local interactions avoid a central coordinator | P-002 local autonomy | fixed local physics is the simplest null, not a new exception protocol |
| metastable cluster or defect persists briefly | P-003 temporary trace | physical persistence is a trace only if an experiment reads and uses it |
| multiple configurations compete | P-004 diversity, selection, protection | thermodynamic abundance is not validation or protection |
| neighbors and contacts change with motion | P-005 use-dependent topology | established physical instance; adaptation requires a utility-coupled update |
| order, density, stress, or activity is regulated | P-006 homeostatic feedback | only feedback with a set point and measured deviation qualifies |
| defects or gradients attract extra work | P-007 prediction-error allocation | physical salience is not epistemic uncertainty or value of information |
| phases and domains contain interactions | P-008 compartmentalization | material boundaries do not supply semantic APIs or isolation guarantees |
| annealing, fuel replenishment, and reset happen off-line | P-009 maintenance plane | maintenance must be explicit and costed; spontaneous relaxation is not repair |
| geometry and interactions execute a recurring mapping | P-010 structural offloading | direct existing owner |
| transient alignment or clusters create effective links | P-011 transient coalitions | direct existing owner at a descriptive level |
| hysteresis stores prior forcing | P-012 lifetime-matched memory | only if retention, readout, overwrite, and usefulness match information lifetime |
| environmental fields coordinate constituents | P-013 externalized shared state | direct analogue only when the field is read/write state for a task |

### Candidate coverage

| Candidates | Relationship to this audit | Disposition |
| --- | --- | --- |
| [001](../../experiments/candidates/001-adaptive-topology.md), [002](../../experiments/candidates/002-multiscale-context-broadcast.md), [013](../../experiments/candidates/013-deficit-capability-routing.md) | neighbor graphs, fields, and local resource flow | fixed flocking and phase dynamics are nulls; no new candidate |
| [003](../../experiments/candidates/003-recovery-dynamics-fragility.md), [005](../../experiments/candidates/005-severity-ordered-containment.md), [009](../../experiments/candidates/009-graded-assurance-envelopes.md), [012](../../experiments/candidates/012-latency-qualified-authority.md) | jamming, clogging, recovery, operating margins | strengthens transition-class and observability caveats only |
| [006](../../experiments/candidates/006-reversible-physical-skill.md) | phase, geometry, or interactions compile a local skill | hold one lifecycle experiment; direct owner |
| [007](../../experiments/candidates/007-endogenous-observation-surveillance.md), [014](../../experiments/candidates/014-versioned-observation-contract.md) | camera/field observations alter interventions | direct owner of sensor support, delay, and action-observation coupling |
| [004](../../experiments/candidates/004-closed-endogenous-curriculum.md), [008](../../experiments/candidates/008-contestable-modular-allocation.md), [010](../../experiments/candidates/010-reset-coupled-staged-verification.md), [011](../../experiments/candidates/011-dual-loop-operational-assurance.md) | generation, strategic allocation, verification, and incident learning | audited physical systems lack evaluator, incentives, staged evidence, and learning loop |
| [015](../../experiments/candidates/015-versioned-repairable-conventions.md), [017](../../experiments/candidates/017-contract-preserving-semantic-compaction.md), [018](../../experiments/candidates/018-value-reconstructability-aware-tiering.md), [019](../../experiments/candidates/019-audited-cumulative-inheritance.md) | semantics, value, compaction, and inherited knowledge | no support: physical patterns lack meaning, provenance, reconstructability valuation, and learner turnover |
| [016](../../experiments/candidates/016-conflict-bounded-unit-transition.md) | collective as a unit | clustering or coordinated motion lacks collective heredity and conflict-control evidence |

The candidate crosswalk is deliberately exhaustive. Similar geometry does not
justify a new label when the missing distinction is the evaluator, semantic
contract, or lifecycle control already owned elsewhere.

## Strongest null hypotheses

1. **Passive-energy null:** the useful pattern is equilibrium or metastable
   relaxation under a designed energy landscape.
2. **Fixed-drive null:** nonequilibrium order follows from continuous drive
   and fixed interactions; no sensing or policy is required.
3. **External-controller null:** the apparent material intelligence is a
   conventional sensor–computer–actuator loop whose plant happens to be soft
   matter.
4. **Congestion null:** phase separation or jamming is ordinary queueing,
   bottleneck, or overload behavior expressed spatially.
5. **Analog-hardware null:** the substrate is a noisy special-purpose analog
   computer and should be compared to an analog circuit, FPGA/ASIC, and
   matched digital simulation.
6. **Semantics null:** a stable cluster, defect, or phase is not memory,
   evidence, or knowledge until a declared task can write, read, validate, and
   use it.
7. **Boundary-shift null:** an apparent efficiency gain disappears when drive,
   sensing, control, transduction, reset, calibration, and fabrication are
   included.

## Falsification experiments

### Experiment A — four-layer causal attribution

- **Task:** reproduce one target collective pattern under passive interaction,
  fixed drive, fixed sensor feedback, and learned feedback.
- **Controls:** identical particles, geometry, noise, task horizon, and output
  tolerance; an oracle controller supplies an upper bound.
- **Measurements:** pattern error, recovery seconds, sensor samples,
  controller operations, communicated bytes, drive joules, controller joules,
  reset joules, and accepted outcomes.
- **Decisive result:** each added layer must improve a preregistered
  quality–energy–recovery frontier beyond the preceding layer.
- **Kill:** fixed physics matches the learned policy, or the gain disappears
  when controller and observation energy are included.

### Experiment B — local-neighbor flocking

- **Task:** maintain cohesion and target transport under density changes,
  occlusion, delayed observations, adversarial agents, and link failure.
- **Nulls:** metric-radius alignment, fixed-\(k\) topological consensus,
  k-nearest-neighbor control, global broadcast, and centralized estimation.
- **Hold constant:** propulsion work, localization accuracy, neighbor-query
  rate, communication byte/s, and collision risk.
- **Measurements:** polarization \(\Phi\), target error metres, collisions/hour,
  disconnections/hour, p99 response milliseconds, and joules/metre.
- **Kill:** topological/local rules win only when discovery or communication is
  free, or a conventional consensus controller ties them.

### Experiment C — phase separation as allocation

- **Task:** route identical work items between dense processing regions and a
  dilute reserve while demand and capacity shift.
- **Nulls:** hash partitioning, least-loaded routing, backpressure,
  primal–dual allocation, and a conventional cache.
- **Hold constant:** throughput, capacity, buffer volume, observation delay,
  migration distance, and reset budget.
- **Measurements:** accepted tasks/second, tail latency milliseconds, dropped
  tasks, migrated bytes or particles, phase-switch seconds, and joules/task.
- **Kill:** the phase has no task-selective signal, jams under bursts, or
  ordinary load balancing matches its frontier.

### Experiment D — defect-mediated physical primitive

- **Task:** implement a declared local operation using defect creation,
  transport, interaction, and annihilation.
- **Nulls:** passive liquid crystal, reaction–diffusion medium, analog circuit,
  FPGA, and digital PDE solver.
- **Hold constant:** input/output resolution, error tolerance, throughput, and
  physical footprint.
- **Measurements:** operation error, bits or task units/second, defect
  lifetime seconds, reset seconds, drive watts, readout joules, and
  faults/operation.
- **Kill:** defect topology does not improve robustness or energy after
  transduction, or uncontrolled proliferation dominates useful interactions.

### Experiment E — jamming-aware authority and fragility

- **Task:** operate a modular system across gradual congestion, abrupt
  bottleneck closure, hysteretic recovery, and hidden-mode failure.
- **Nulls:** queue length, utilization, pressure proxy, CUSUM, active system
  identification, admission control, and circuit breakers.
- **Hold constant:** probe energy, telemetry rate, reserved capacity, and
  intervention authority.
- **Measurements:** warning lead seconds, false alarms/hour, missed failures,
  throughput, recovery seconds, reserve joules, and collateral task loss.
- **Kill:** recovery slowing predicts only gradual visible transitions, or
  conventional load metrics match it. Never extrapolate one jamming threshold
  across protocols.

### Experiment F — reversible phase-boundary skill compilation

- **Task:** execute a stable, frequent, spatially local sensor-to-action
  mapping in a reconfigurable soft/active substrate.
- **Nulls:** passive mechanics, analog feedback, a microcontroller, FPGA/ASIC,
  matched physical reservoir, and digital multi-agent control.
- **Required candidate:** versioned physical configuration, calibrated health
  probes, explicit safe envelope, reversible reset, digital shadow, and
  automatic fallback.
- **Measurements:** end-to-end joules/accepted outcome, p99 latency, area or
  volume, write/reset energy, drift/hour, calibration time, failure recovery,
  fabrication yield, and amortized lifecycle energy.
- **Promote condition:** a repeated sensing–representation–decision–actuation
  path is materially removed and the substrate improves a multi-objective
  frontier in both stable and shifted regimes.
- **Kill:** benefit is particle-scale only, the digital shadow performs the
  real control continuously, reset is destructive, or an analog/FPGA baseline
  ties it.

## Temporary claims

These audit-local claims preserve evidence scope. They must not be cited as
promoted project claims without root-level deduplication.

| ID | Status | Scoped claim | Primary support | Main boundary or falsifier |
| --- | --- | --- | --- | --- |
| C-SAM-01 | established | A fixed local alignment rule with noise can generate ordered collective motion in the Vicsek model. | Vicsek et al. 1995 | model and protocol scope; no learning |
| C-SAM-02 | established | A nonequilibrium hydrodynamic flocking model can sustain two-dimensional long-range order under its assumptions. | Toner & Tu 1995 | not a universal animal mechanism |
| C-SAM-03 | plausible | Studied starling flocks were more consistent with a roughly fixed number of topological neighbors than a fixed metric radius. | Ballerini et al. 2008 | observational inference; species and condition scope |
| C-SAM-04 | established | A local-rule group model can exhibit hysteresis, spatial sorting, and configuration-dependent history effects. | Couzin et al. 2002 | model "memory" is not symbolic or durable memory |
| C-SAM-05 | established | ATP-driven microtubule–kinesin assemblies can generate active flows and liquid-crystalline structures. | Sanchez et al. 2012 | prepared system and continuous chemical drive |
| C-SAM-06 | plausible | Active stress can qualitatively change defect annihilation, separation, and proliferation in modeled active nematics. | Giomi et al. 2013 | coefficient, sign, geometry, and model dependence |
| C-SAM-07 | established | Self-propelled particles can phase-separate without alignment or attractive pair forces in specified models and experiments. | Tailleur & Cates 2008; Fily & Marchetti 2012; Buttinoni et al. 2013 | not all active systems; drive and boundary matter |
| C-SAM-08 | disputed | Clustering or phase separation is evidence of collective intelligence or task-aware allocation. | contradicted by minimal active-particle results | requires independent task signal, evaluator, and adaptive update |
| C-SAM-09 | established | DNA binding specificity and confinement can program reversible or geometry-selected colloidal assembly. | Mirkin et al. 1996; Alivisatos et al. 1996; Manoharan et al. 2003 | design, synthesis, annealing, yield, and readout remain external |
| C-SAM-10 | established | Jamming thresholds and scaling in frictionless soft-particle models are protocol and definition dependent. | O'Hern et al. 2003; Donev et al. 2004 | no universal point or packing constant |
| C-SAM-11 | plausible | A shape-controlled rigidity transition exists in the cited confluent-tissue vertex model at constant density. | Bi et al. 2015 | model result, not a universal tissue or AI rule |
| C-SAM-12 | established | Dense granular flows and vibrated clogging can be described by scoped constitutive variables and transition surfaces. | Pouliquen 1999; Jop et al. 2006; Caitano et al. 2021 | geometry, friction, rate, and drive regime |
| C-SAM-13 | established | Light-driven colloids can repeatedly assemble and disassemble dynamic clusters. | Palacci et al. 2013 | continuous optical/chemical energy; no policy update |
| C-SAM-14 | established | Real-time observation and external feedback can create effective interactions among active particles. | Khadka et al. 2018; Lavergne et al. 2019 | controller and sensor are part of the system boundary |
| C-SAM-15 | disputed | Topological charge alone implements semantic error correction, verification, or fault tolerance. | topology constrains physical state only | requires encoded symbols, noise model, decoder, and recovery guarantee |
| C-SAM-16 | established | Particle-scale mechanical power is not the same as wall-plug or lifecycle power. | dimensional boundary; Khadka et al. 2018 apparatus | measure complete drive, sensing, compute, reset, and fabrication |
| C-SAM-17 | established | None of the audited fixed-rule physical systems demonstrates policy learning from task-success evidence. | audited mechanism boundary | falsified by an explicit, endogenous update rule with held-out adaptation |
| C-SAM-18 | speculative | A reversible phase or interaction field may economically compile a mature local coordination skill. | transfer hypothesis only | Experiment F; reject if conventional hardware/control ties it |

## Integration disposition

**Promote now:** no new stable principle and no shared C- claim. Promote only
the audit method: every "active" system must be classified as passive,
driven-fixed, feedback-controlled, or adaptive, with an end-to-end energy
boundary.

**Hold:** C-SAM-18 only as an experimental specialization of
[Candidate 006](../../experiments/candidates/006-reversible-physical-skill.md).
It may also serve as a stress test for P-005, P-006, P-010, and P-011. Do not
create Candidate 020.

**Reject as standalone principles:**

- flocking as proof of distributed intelligence;
- motility-induced phase separation as relevance-aware routing;
- jamming or criticality as a general recipe for efficient computation;
- topological defects as automatic error correction;
- self-assembly as learning;
- hysteresis as semantic memory;
- "living" active materials as evidence of agency; and
- particle-scale propulsion efficiency as system efficiency.

**Audit verdict:** soft and active matter can be an excellent implementation
substrate when the target mapping is local, stable, repeated, tolerant of
noise, and physically colocated. Its deepest contribution to this project is a
discipline of attribution: visible order can be generated by physics with no
policy at all, and apparent autonomy can be maintained by a large external
sensor/controller/energy stack. The burden is therefore not to reproduce a
pattern. It is to show a task-bearing, reversible, measurable system advantage
after energy, semantics, observation, reset, and failure are included.

## Bibliography (audit-local BibTeX)

The bibliography contains the primary and foundational works cited in this
audit. DOI links are the authoritative locators.

```bibtex
@article{vicsek1995phase,
  author = {Vicsek, Tamás and Czirók, András and Ben-Jacob, Eshel and Cohen, Inon and Shochet, Ofer},
  title = {Novel Type of Phase Transition in a System of Self-Driven Particles},
  journal = {Physical Review Letters},
  year = {1995},
  volume = {75},
  number = {6},
  pages = {1226--1229},
  doi = {10.1103/PhysRevLett.75.1226}
}

@article{toner1995birds,
  author = {Toner, John and Tu, Yuhai},
  title = {Long-Range Order in a Two-Dimensional Dynamical {XY} Model: How Birds Fly Together},
  journal = {Physical Review Letters},
  year = {1995},
  volume = {75},
  number = {23},
  pages = {4326--4329},
  doi = {10.1103/PhysRevLett.75.4326}
}

@article{couzin2002collective,
  author = {Couzin, Iain D. and Krause, Jens and James, Richard and Ruxton, Graeme D. and Franks, Nigel R.},
  title = {Collective Memory and Spatial Sorting in Animal Groups},
  journal = {Journal of Theoretical Biology},
  year = {2002},
  volume = {218},
  number = {1},
  pages = {1--11},
  doi = {10.1006/jtbi.2002.3065}
}

@article{ballerini2008topological,
  author = {Ballerini, Michele and others},
  title = {Interaction Ruling Animal Collective Behavior Depends on Topological Rather than Metric Distance: Evidence from a Field Study},
  journal = {Proceedings of the National Academy of Sciences},
  year = {2008},
  volume = {105},
  number = {4},
  pages = {1232--1237},
  doi = {10.1073/pnas.0711437105}
}

@article{simha2002instabilities,
  author = {Simha, R. Aditi and Ramaswamy, Sriram},
  title = {Hydrodynamic Fluctuations and Instabilities in Ordered Suspensions of Self-Propelled Particles},
  journal = {Physical Review Letters},
  year = {2002},
  volume = {89},
  number = {5},
  pages = {058101},
  doi = {10.1103/PhysRevLett.89.058101}
}

@article{sanchez2012active,
  author = {Sanchez, Tim and Chen, Daniel T. N. and DeCamp, Stephen J. and Heymann, Michael and Dogic, Zvonimir},
  title = {Spontaneous Motion in Hierarchically Assembled Active Matter},
  journal = {Nature},
  year = {2012},
  volume = {491},
  pages = {431--434},
  doi = {10.1038/nature11591}
}

@article{giomi2013defects,
  author = {Giomi, Luca and Bowick, Mark J. and Ma, Xu and Marchetti, M. Cristina},
  title = {Defect Annihilation and Proliferation in Active Nematics},
  journal = {Physical Review Letters},
  year = {2013},
  volume = {110},
  number = {22},
  pages = {228101},
  doi = {10.1103/PhysRevLett.110.228101}
}

@article{tailleur2008runtumble,
  author = {Tailleur, Julien and Cates, Michael E.},
  title = {Statistical Mechanics of Interacting Run-and-Tumble Bacteria},
  journal = {Physical Review Letters},
  year = {2008},
  volume = {100},
  number = {21},
  pages = {218103},
  doi = {10.1103/PhysRevLett.100.218103}
}

@article{fily2012phase,
  author = {Fily, Yaouen and Marchetti, M. Cristina},
  title = {Athermal Phase Separation of Self-Propelled Particles with No Alignment},
  journal = {Physical Review Letters},
  year = {2012},
  volume = {108},
  number = {23},
  pages = {235702},
  doi = {10.1103/PhysRevLett.108.235702}
}

@article{buttinoni2013clustering,
  author = {Buttinoni, Ivo and Bialké, Julian and Kümmel, Felix and Löwen, Hartmut and Bechinger, Clemens and Speck, Thomas},
  title = {Dynamical Clustering and Phase Separation in Suspensions of Self-Propelled Colloidal Particles},
  journal = {Physical Review Letters},
  year = {2013},
  volume = {110},
  number = {23},
  pages = {238301},
  doi = {10.1103/PhysRevLett.110.238301}
}

@article{ohern2003jamming,
  author = {O'Hern, Corey S. and Silbert, Leonardo E. and Liu, Andrea J. and Nagel, Sidney R.},
  title = {Jamming at Zero Temperature and Zero Applied Stress: The Epitome of Disorder},
  journal = {Physical Review E},
  year = {2003},
  volume = {68},
  number = {1},
  pages = {011306},
  doi = {10.1103/PhysRevE.68.011306}
}

@article{donev2004comment,
  author = {Donev, Aleksandar and Torquato, Salvatore and Stillinger, Frank H. and Connelly, Robert},
  title = {Comment on Jamming at Zero Temperature and Zero Applied Stress: The Epitome of Disorder},
  journal = {Physical Review E},
  year = {2004},
  volume = {70},
  number = {4},
  pages = {043301},
  doi = {10.1103/PhysRevE.70.043301}
}

@article{bi2015rigidity,
  author = {Bi, Dapeng and Lopez, J. H. and Schwarz, J. M. and Manning, M. Lisa},
  title = {A Density-Independent Rigidity Transition in Biological Tissues},
  journal = {Nature Physics},
  year = {2015},
  volume = {11},
  pages = {1074--1079},
  doi = {10.1038/nphys3471}
}

@article{pouliquen1999scaling,
  author = {Pouliquen, Olivier},
  title = {Scaling Laws in Granular Flows down Rough Inclined Planes},
  journal = {Physics of Fluids},
  year = {1999},
  volume = {11},
  number = {3},
  pages = {542--548},
  doi = {10.1063/1.869928}
}

@article{jop2006constitutive,
  author = {Jop, Pierre and Forterre, Yoël and Pouliquen, Olivier},
  title = {A Constitutive Law for Dense Granular Flows},
  journal = {Nature},
  year = {2006},
  volume = {441},
  pages = {727--730},
  doi = {10.1038/nature04801}
}

@article{caitano2021clogging,
  author = {Caitano, R. and Guerrero, B. V. and González, R. E. R. and Zuriguel, Iker and Garcimartín, Ángel},
  title = {Characterization of the Clogging Transition in Vibrated Granular Media},
  journal = {Physical Review Letters},
  year = {2021},
  volume = {127},
  number = {14},
  pages = {148002},
  doi = {10.1103/PhysRevLett.127.148002}
}

@article{mirkin1996dna,
  author = {Mirkin, Chad A. and Letsinger, Robert L. and Mucic, Robert C. and Storhoff, James J.},
  title = {A {DNA}-Based Method for Rationally Assembling Nanoparticles into Macroscopic Materials},
  journal = {Nature},
  year = {1996},
  volume = {382},
  number = {6592},
  pages = {607--609},
  doi = {10.1038/382607a0}
}

@article{alivisatos1996nanocrystal,
  author = {Alivisatos, A. Paul and Johnsson, Kai P. and Peng, Xiaogang and Wilson, Troy E. and Loweth, Christopher J. and Bruchez, Marcel P. and Schultz, Peter G.},
  title = {Organization of Nanocrystal Molecules Using {DNA}},
  journal = {Nature},
  year = {1996},
  volume = {382},
  number = {6592},
  pages = {609--611},
  doi = {10.1038/382609a0}
}

@article{manoharan2003packing,
  author = {Manoharan, Vinothan N. and Elsesser, Mark T. and Pine, David J.},
  title = {Dense Packing and Symmetry in Small Clusters of Microspheres},
  journal = {Science},
  year = {2003},
  volume = {301},
  number = {5632},
  pages = {483--487},
  doi = {10.1126/science.1086189}
}

@article{palacci2013crystals,
  author = {Palacci, Jérémie and Sacanna, Stefano and Steinberg, Asher Preska and Pine, David J. and Chaikin, Paul M.},
  title = {Living Crystals of Light-Activated Colloidal Surfers},
  journal = {Science},
  year = {2013},
  volume = {339},
  number = {6122},
  pages = {936--940},
  doi = {10.1126/science.1230020}
}

@article{khadka2018information,
  author = {Khadka, Utsab and Holubec, Viktor and Yang, Haw and Cichos, Frank},
  title = {Active Particles Bound by Information Flows},
  journal = {Nature Communications},
  year = {2018},
  volume = {9},
  pages = {3864},
  doi = {10.1038/s41467-018-06445-1}
}

@article{lavergne2019perception,
  author = {Lavergne, François A. and Wendehenne, Hugo and Bäuerle, Tobias and Bechinger, Clemens},
  title = {Group Formation and Cohesion of Active Particles with Visual Perception-Dependent Motility},
  journal = {Science},
  year = {2019},
  volume = {364},
  number = {6435},
  pages = {70--74},
  doi = {10.1126/science.aau5347}
}
```

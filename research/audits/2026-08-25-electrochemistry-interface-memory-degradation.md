# Electrochemistry: interfaces, memory, and degradation

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-25
- **Gap selected:** electrochemistry, chosen because the repository coverage
  report still calls surface and electrochemical chemistry uneven, while the
  preserved DFG, ANZSRC, and EuroSciVoc depth inventories leave their exact
  electrochemistry children unassigned
- **Primary field anchors:** DFG 3.13-01, *Physikalische Chemie von
  Molekülen, Flüssigkeiten und Grenzflächen, Biophysikalische Chemie*;
  ANZSRC 340604, *Electrochemistry*; EuroSciVoc
  `4e705211-8770-4a2a-8596-dbc25b41c83b`, *electrochemistry*
- **Adjacent battery anchors:** DFG 3.12-02; ANZSRC 400404; EuroSciVoc
  `2322520f-4e32-45e3-8f8b-bedc5ab4ba9b`, *electric batteries*, only for the
  phase, interphase, deposition, hysteresis, identifiability, and ageing claims
- **Scope:** charge-transfer boundaries; diffusion memory and finite
  boundaries; impedance validity; relaxation/diffusion-time inversion;
  rate-dependent phase separation; passivating interphases; depletion-driven
  ramified deposition; parameter identifiability; path-dependent apparent
  equilibria; and delayed degradation in protocol optimisation
- **Promotion state:** ten bounded claim proposals are reserved as
  [`C-1530`](#c-1530)--[`C-1539`](#c-1539); no new P-series principle or
  architecture candidate is proposed
- **Execution state:** ten CPU-only synthetic falsification protocols are
  frozen in [Fixture F-025](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md);
  no runner, generated data, result, physical-cell experiment, or workstation
  energy measurement exists
- **Repository constraint:** this standalone audit does not edit central
  claims, references, audit indexes, taxonomy routing, coverage, concept or
  math chapters, plots, changelog, application, or PDF

## Executive finding

Electrochemistry contributes a useful set of boundaries that the current
project does not yet treat as a field. It couples an interfacial transformation
to transport, stored charge, geometry, material state, and irreversible side
reactions. The observable voltage or current is therefore rarely an isolated
readout of one mechanism. Frequency-domain consistency can reject some invalid
records without identifying a unique circuit; a passivating layer can protect
an interface while consuming inventory and adding resistance; a scalar state
of charge can omit path and particle-population state; and an apparently good
short-horizon control policy can incur delayed damage outside its training
support.

Ten nonduplicate residues survive the repository audit:

1. interfacial rate, thermodynamic driving force, and bulk transport are
   separate terms that should not be collapsed into one commanded input;
2. diffusion creates a history-dependent response whose finite-length and
   boundary conditions change the low-frequency limit;
3. Kramers--Kronig compliance is a data-validity test, not a certificate of a
   unique physical mechanism;
4. distributions of relaxation or diffusion times are inverse problems with
   finite-band resolution and regularisation dependence;
5. phase separation can be promoted or suppressed by rate, size, material,
   and boundary regime rather than serving as an unconditional design motif;
6. a protective interphase consumes inventory, changes impedance, and can
   continue to grow; cracking and repair enter F-025 only as explicitly
   synthetic engineering stressors, not as residues attributed to these
   sources;
7. carrier depletion and space charge can precede ramified deposition in a
   scoped high-field dilute-electrolyte regime;
8. excellent terminal-observable fit does not make internal physical
   parameters structurally or practically identifiable;
9. insertion systems can have path- and population-dependent apparent
   equilibria, so one scalar occupancy need not close the state; and
10. degradation depends on exposure history and support, so early-prediction
    optimisation needs delayed-damage and hostile-transfer tests.

These residues qualify existing project principles about predictive state,
homeostatic feedback, maintenance, structural change, and complete resource
accounting. They do not establish that an electrochemical metaphor is novel,
that a battery model should become an AI architecture, or that any proposed
translation saves energy. F-025 therefore compares every translation with a
mature physical/statistical null and charges state, sensing, communication,
probing, construction, reserve, maintenance, delayed damage, compute, and
artifacts.

## Evidence-based gap selection

The selection is not based on the word *battery* appearing infrequently.

1. [`research/field-coverage.md`](../field-coverage.md) explicitly says that
   surface and electrochemical chemistry remain uneven after reaction,
   molecular-control, polymer, analytical, and process work.
2. [`research/taxonomies/field-depth.md`](../taxonomies/field-depth.md) marks
   EuroSciVoc *electrochemistry* and *electric batteries*, DFG 3.12-02 and
   3.13-01, ANZSRC 340604, and ANZSRC 400404 as unassigned.
3. Existing chemical work includes one scoped alternating-current reaction
   control result, and existing systems work mentions battery state of charge,
   storage, and sensing. No prior audit owns the coupled interface--transport--
   observation--degradation field boundary proposed here.
4. Electrochemistry is broad. This audit does not claim exhaustive coverage of
   corrosion, electrocatalysis, fuel cells, electroanalysis, electrode
   manufacture, electrolyte formulation, safety engineering, recycling, or
   industrial battery qualification.

## Exact deduplication and convergence boundary

The following existing records remain authoritative owners:

1. **C-1335** owns alternating-current frequency selection between competing
   oxidation pathways. C-1530 does not repeat waveform-controlled synthesis;
   it isolates the general interface-rate/transport boundary and tests whether
   the achieved flux can be inferred from a command.
2. **C-1283** owns intrinsic reaction-rate attribution after external and
   internal transport are cleared. C-1530 converges with it but adds
   electrochemical overpotential, activities, charge transfer, and current;
   it is not a second generic transport caveat.
3. **C-470** owns the warning that phase separation is not evidence of
   collective intelligence. C-1534 asks a different question: whether the
   phase regime itself changes with imposed rate and particle scale.
4. **C-917** owns the generic requirement to record path and dwell time in a
   hysteretic transition. C-1538 adds a scoped multiparticle insertion
   mechanism and a direct test of whether scalar occupancy is a sufficient
   state.
5. **C-1526** owns projected memory after unresolved variables are eliminated.
   C-1531 converges mathematically but contributes an experimentally
   addressable impedance, exact finite-boundary counterexamples, and a test of
   memory-kernel support rather than another general memory theorem.
6. Existing optical, chemical-sensing, and inverse-problem claims already
   require operator-qualified observations and uncertainty. C-1532--C-1533
   add the narrower distinction among validity, finite-band resolution, and
   mechanism identifiability for complex impedance.
7. Existing maintenance claims already require that protection and repair be
   charged. C-1535 supplies a material example for protection, inventory loss,
   resistance, and continued growth; F-025 adds cracking and repair only as
   synthetic stress variables owned by those existing engineering claims. It
   does not relabel maintenance as a new principle.
8. Existing resource-depletion and runaway claims own generic scarcity and
   positive feedback. C-1536 is restricted to a primary electrochemical model
   in which anion depletion, space charge, and deposit morphology are linked.
9. Existing system-identification claims own the general fit-versus-mechanism
   distinction. C-1537 adds a constructive electrochemical example in which a
   nominal single-particle model exposes only grouped parameters under stated
   open-circuit-voltage and excitation conditions.
10. Existing lifecycle and cumulative-damage work owns generic ageing. C-1539
    adds calendar exposure, electrochemical state, early outcome prediction,
    protocol search, and a mandatory chemistry/temperature/support transfer.

Convergence is intentional evidence that the same systems boundaries recur in
another mature science. It does not justify duplicate principles or claims.

## Field-centred scope and exact routing

### Fine-grained routing recommendation

If these proposals are later integrated centrally, add only these exact
child-level assignments; parent coverage must not be inherited:

1. DFG `3.13-01`, *Physikalische Chemie von Molekülen, Flüssigkeiten und
   Grenzflächen, Biophysikalische Chemie* -- `dedicated`, C-1530--C-1533 and
   C-1536;
2. DFG `3.12-02`, *Physikalische Chemie von Festkörpern und Oberflächen,
   Materialcharakterisierung* -- `adjacent`, only C-1534--C-1539;
3. ANZSRC `340604`, *Electrochemistry* -- `dedicated`, C-1530--C-1539;
4. ANZSRC `400404`, *Electrochemical energy storage and conversion* --
   `adjacent`, only C-1534--C-1539;
5. EuroSciVoc `4e705211-8770-4a2a-8596-dbc25b41c83b`, *electrochemistry* --
   `dedicated`, C-1530--C-1539; and
6. EuroSciVoc `2322520f-4e32-45e3-8f8b-bedc5ab4ba9b`, *electric batteries* --
   `adjacent`, only C-1534--C-1539.

Do not route DFG 4.22-01 energy-process engineering, ANZSRC 400804 electrical
energy storage, bioelectrochemistry, corrosion engineering, electroanalytical
chemistry, or battery manufacturing from this audit. The protocols are
synthetic mechanism tests, not engineering breadth.

### Included

1. Primary theory, experiments, and model-qualified results with chemistry,
   geometry, excitation, boundary, frequency band, timescale, and observable
   retained.
2. Explicit separation of command, achieved interface state, transport,
   observable, hidden state, inference operator, side reaction, and delayed
   damage.
3. CPU-only synthetic comparisons with nonlinear state-space models,
   diffusion PDEs, finite RC ladders, Kramers--Kronig validators, equivalent
   circuits, regularised DRT/DDT inversions, phase-field/reduced models,
   constrained controllers, identifiability-aware design, hysteresis models,
   survival models, and safe Bayesian optimisation.
4. Hostile transfer across geometry, frequency band, drift, reaction regime,
   material scale, interphase damage, depletion, excitation, path statistics,
   temperature, and degradation mechanism.

### Excluded

1. Physical cells, potentiostats, batteries, chemicals, high voltage,
   electrodeposition, corrosion, charging, teardown, microscopy, thermal-abuse
   tests, or laboratory automation.
2. Universal Butler--Volmer parameters, Warburg exponents, equivalent
   circuits, phase thresholds, SEI chemistry, Sand time, hysteresis width,
   cycle life, ageing law, safe charging law, or improvement percentage.
3. Treating a fitted circuit element, DRT/DDT peak, latent state, or model
   parameter as a directly observed physical component without independent
   intervention.
4. Converting synthetic operations, current-like variables, task units, or
   simulated loss into workstation joules, cell energy, safety, or lifetime.
5. Product, transport, workplace, environmental, conformity, or battery-law
   claims.

## Evidence, interpretation, and normative firewalls

1. **Theory is conditional.** A constitutive equation or phase-field solution
   establishes consequences of its assumptions. Empirical adequacy remains
   chemistry-, scale-, interface-, temperature-, and protocol-specific.
2. **Validity is not identification.** A Kramers--Kronig-compatible impedance
   can still admit several circuits or distributed mechanisms. Conversely,
   drift, nonlinearity, insufficient settling, noise, and band truncation can
   produce validation residuals without naming their cause.
3. **Regularisation is part of the observation operator.** A DRT/DDT peak is
   conditional on frequency support, discretisation, noise model, penalty,
   non-negativity, and resolution. Peak count is not a free fact.
4. **Battery examples remain examples.** LiFePO4 phase behaviour, graphite
   calendar ageing, a particular single-particle model, or the reported
   fast-charge campaign does not establish a universal electrochemical rule.
5. **Optimisation evidence is support-bound.** Attia et al. demonstrated a
   closed-loop procedure in a declared cell/protocol family. The result is not
   a universal fast-charging policy and does not waive delayed validation.
6. **No-result authority:** source collection and protocol completeness are
   not synthetic results. A later synthetic pass would establish only the
   frozen data-generating process and transfer family.

### European/German applicability sentinel

F-025 uses synthetic arrays and no personal data, physical cell, substance,
product, electrical installation, laboratory apparatus, or market activity.
No DIN, EN, harmonised standard, or conformity route is invoked because none
is needed to execute this documentation-only CPU fixture. If later work moves
to physical batteries, cells, chemicals, electrical test equipment, transport,
workplace exposure, or a product, the then-current EU/German law and applicable
DIN/EN editions require a fresh role-, purpose-, chemistry-, equipment-, and
date-specific assessment. A synthetic pass is not conformity or safety
evidence.

## Construct, symbol, and unit firewall

| Symbol | Meaning | Unit |
| --- | --- | --- |
| $t$ | physical or simulated time | s |
| $f$; $\omega=2\pi f$ | frequency; angular frequency | Hz; rad s$^{-1}$ |
| $V$, $\eta$ | voltage; overpotential relative to a declared reference | V |
| $I$, $j$ | current; current density | A; A m$^{-2}$ |
| $Q$ | charge or lost cyclable inventory | C |
| $Z(\omega)$ | complex impedance $\tilde V/\tilde I$ | $\Omega$ |
| $R$, $C_e$ | resistance; electrical capacitance | $\Omega$; F |
| $c$ | concentration | mol m$^{-3}$ |
| $x$ | normalized occupancy or state of charge in a synthetic model | 1 |
| $D$ | diffusion coefficient | m$^2$ s$^{-1}$ |
| $L$, $h$ | diffusion length; interphase thickness | m |
| $h_{min}$ | strictly positive lower thickness used by the toy growth law | m |
| $\tau$ | relaxation or diffusion time | s |
| $g(\ln\tau)$ | relaxation-time density per log-time | $\Omega$ |
| $T$ | absolute temperature | K |
| $n$, $F$, $R_g$ | electron stoichiometric count, Faraday constant, and molar-gas constant | 1; C mol$^{-1}$; J mol$^{-1}$ K$^{-1}$ |
| $j_0$, $\alpha_a$, $\alpha_c$ | exchange current density and anodic/cathodic transfer coefficients | A m$^{-2}$; 1; 1 |
| $i$, $\sigma_W$, $R_\infty$ | imaginary unit, Warburg coefficient, and high-frequency resistance | 1; $\Omega$ s$^{-1/2}$; $\Omega$ |
| $z$, $\hat g_\lambda$, $K$ | observed impedance vector, estimated distribution, and its discretized forward map | $\Omega$; $\Omega$ per declared log-time quadrature; $K\hat g_\lambda$ in $\Omega$ |
| $W$, $L_r$, $\lambda$ | inverse-noise weight, declared dimensionless regularisation operator, and regularisation weight | $\Omega^{-1}$; 1; $\Omega^{-2}$ so both objective terms are dimensionless |
| $S(\theta)$, $\theta$, $y$, $\Sigma$, $\mathcal I$ | sensitivity/Jacobian, declared parameter vector, observation, observation covariance, and local information matrix | each row/column retains the observation and parameter units; $\Sigma$ in observation-unit squared; $\mathcal I_{kl}$ in $\theta_k^{-1}\theta_l^{-1}$ |
| $d$ | synthetic accumulated delayed damage | damage unit (DU) |
| $\hat t$, $\xi$, $M^*$, $\kappa^*$, $\mu^*$, $r^*$, $f^*$, $\eta^*$ | normalized phase-field time, coordinate, mobility, gradient coefficient, chemical potential, source, free-energy density, and overpotential | 1 |
| $k_r$, $k_d$, $k_m$, $k_{cr}$ | layer reaction, diffusion, current-coupling, and crack-loss coefficients | m s$^{-1}$; m$^2$ s$^{-1}$; m$^3$ C$^{-1}$; s$^{-1}$ |
| $u_{cr}$, $\rho_f$, $A$ | dimensionless crack exposure, film resistivity, and area | 1; $\Omega$ m; m$^2$ |
| $c_0$, $t_{dep}$ | reference concentration and first declared depletion-crossing time | mol m$^{-3}$; s |
| $H$, $m_t$, $u_t$, $\psi$, $\Delta t$, $\lambda_d$, $J$, $J_{task}$, $d_H$ | observation map, latent path state, action, damage-rate map, step, damage-loss weight, total loss, task loss, and horizon damage | map; declared state unit; declared action unit; DU s$^{-1}$; s; loss DU$^{-1}$; 1; 1; DU |

The fixture also uses task loss [1], operations [op], bytes [B], messages
[message], construction/maintenance cost units [CU], and wall/CPU time [s].
Those synthetic units are not converted into amperes, joules, cell life, or
biological metabolism. Every normalized quantity retains its raw numerator,
denominator, and native unit.

## Shared mathematical skeleton

### Interface kinetics are not transport closure

A common symmetric notation for a charge-transfer boundary is

$$
j = j_0\left[
\exp\!\left(\frac{\alpha_a nF\eta}{R_gT}\right)
-\exp\!\left(-\frac{\alpha_c nF\eta}{R_gT}\right)
\right],
$$

where $j_0$ is exchange current density [A m$^{-2}$], and
$\alpha_a,\alpha_c$ are dimensionless transfer coefficients, $n$ is the
dimensionless electron stoichiometric count, $F$ is in C mol$^{-1}$, $\eta$
is in V, $R_g$ is in J mol$^{-1}$ K$^{-1}$, and $T$ is in K. Each exponent is
therefore dimensionless. Activities, condensed-phase interactions,
double-layer state, coupled ion transfer, and concentration at the interface
can change this closure. Even a correct boundary law does not supply bulk
concentration or voltage loss; those require transport and electrical
equations.

### Diffusion creates a boundary-qualified memory

For a one-dimensional concentration field,

$$
\partial_t c = D\,\partial_{zz}c,
\qquad 0<z<L.
$$

Under a semi-infinite, linear, time-invariant limit the impedance can contain

$$
Z_W(\omega)=\frac{\sigma_W}{\sqrt{i\omega}},
$$

with $[\sigma_W]=\Omega\,\mathrm{s}^{-1/2}$. Finite reflective,
transmissive, or mixed boundaries replace that asymptote by distinct
low-frequency limits involving $\tanh\sqrt{i\omega\tau_D}$ or
$\coth\sqrt{i\omega\tau_D}$, where $\tau_D=L^2/D$ [s]. A fractional-looking
response over one band is therefore not proof of an infinite power-law memory.

### Impedance validity and distribution inversion

For a stable causal linear time-invariant response with suitable convergence,
real and imaginary impedance obey Kramers--Kronig relations. A convenient
relaxation representation is

$$
Z(\omega)=R_\infty+\int_{-\infty}^{\infty}
\frac{g(\ln\tau)}{1+i\omega\tau}\,d\ln\tau.
$$

Recovering $g$ from finitely many noisy frequencies is ill-conditioned. A
discrete estimate commonly solves

$$
\hat g_\lambda=\arg\min_{g\ge0}
\|W(Kg-z)\|_2^2+\lambda\|L_rg\|_2^2,
$$

where $K$ is the forward kernel, $W$ the declared noise weight, $L_r$ the
regularisation operator, and $\lambda$ the penalty. $\lambda$, band, grid, and
noise are part of the result.

### Phase, passivation, depletion, and ageing state

A bounded **nondimensional** phase-field generator uses

$$
\partial_{\hat t}x=\nabla_{\xi}\!\cdot(M^*\nabla_{\xi}\mu^*)+r^*(x,\eta^*),
\qquad
\mu^*=f^{*\prime}(x)-\kappa^*\nabla_{\xi}^2x,
$$

where every starred quantity, $x$, $\xi$, and $\hat t$ is dimensionless. The
normalization constants are frozen with the generator and reported before any
conversion to physical units. A passivating layer can instead follow the
dimensioned toy regime law

$$
\dot h=\min\!\left\{k_r,\;\frac{k_d}{\max(h,h_{min})},\;k_m |j|\right\}
-k_{cr}\,u_{cr}(t)h,
\quad
R_{film}=\rho_f h/A,
$$

with initial $h(0)\ge h_{min}>0$ and the coefficient units given in the symbol
table. Each term in $\dot h$ is metres per second and $R_{film}$ is ohms.
Inventory loss is proportional to newly formed layer volume. This is a
synthetic discriminator, not an asserted universal SEI law.

For depletion testing, a one-dimensional Nernst--Planck generator records the
first time $t_{dep}$ at which the receiving-boundary concentration crosses a
frozen fraction of $c_0$. No standalone $(c_0/j)^2$ timer is accepted: it is
dimensionally incomplete without geometry, charge, mobilities, transference,
and boundary terms. Any reduced timer must be derived from either a frozen
dimensioned generator or a frozen nondimensional generator whose length,
time, concentration, potential, and flux scales are all reported, and it must
pass the corresponding dimensional reconstruction before it can enter an arm.

### Identifiability, hysteresis, and delayed damage

Local parameter information is represented by

$$
S_{nk}=\frac{\partial y(t_n;\theta)}{\partial\theta_k},
\qquad
\mathcal I=S^T\Sigma^{-1}S.
$$

A small residual does not imply full-rank, well-conditioned $\mathcal I$.
For hysteresis, an observation $y_t=H(x_t,m_t)$ retains an internal path or
population state $m_t$ when $x_t$ alone is not Markov-sufficient. Delayed
damage is accumulated separately from immediate reward:

$$
d_{t+1}=d_t+\Delta t\,\psi(u_t,x_t,T_t,m_t),
\qquad
J=J_{task}+\lambda_d d_H.
$$

The damage law, its uncertainty, and observation delay are explicit test
objects rather than free penalties.

## Claim-ledger proposals

### C-1530

- **Statement:** electrochemical interfacial current is a nonlinear function
  of a declared thermodynamic driving force, activities, temperature, and
  kinetic closure, while measured terminal response can also include bulk
  transport, double-layer, and ohmic contributions; a commanded voltage is
  not the achieved reaction flux.
- **Status:** established theoretical framework; the classical or generalized
  closure and its parameters remain system- and regime-specific.
- **Primary sources:** [Ferguson and Bazant 2012](https://doi.org/10.1149/2.048212jes)
  and the theory synthesis [Bazant 2013](https://doi.org/10.1021/ar300145c).
- **Biological/scientific observation:** condensed-phase interactions and
  phase gradients can alter reaction kinetics beyond dilute independent-event
  assumptions.
- **Proposed AI translation:** separate controller command, local driving
  force, interface transfer, transport saturation, and terminal observation
  instead of treating one scalar activation as all five.
- **Efficiency mechanism:** a qualified interface model may avoid repeated
  overdrive and unnecessary probes when saturation or transport, not command,
  limits useful work.
- **Failure modes:** wrong kinetic family, non-identifiable $j_0$ and
  transport, temperature drift, hidden series loss, full state estimator/MPC
  matching the result, or model overhead exceeding avoided actions.
- **Measurable prediction:** under held-out kinetic/transport combinations,
  the qualified arm reduces constraint violation or probing at non-inferior
  flux tracking versus a nonlinear state-space/MPC null with identical
  observations and action authority; benefit must vanish when the command is
  already a sufficient statistic.
- **Open question:** can the boundary be learned without smuggling hidden
  interfacial concentration into the proposed arm?
- **Used by:** [ECM-T01](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md#ecm-t01-interface-kinetics-versus-transport).
- **Disposition:** scoped central claim; converges with C-1283 and
  does not repeat C-1335.

### C-1531

- **Statement:** diffusion-controlled electrochemical response has a
  history-dependent impedance whose low-frequency form changes with finite
  length, relaxation, and reflective/transmissive boundary conditions; a
  semi-infinite Warburg law is not boundary-free.
- **Status:** established within the cited diffusion and generalized-boundary
  theory; empirical model selection remains system-specific.
- **Primary source:** [Criado et al. 2000](https://doi.org/10.1016/S0022-0728(00)00188-1).
- **Biological/scientific observation:** eliminating a distributed transport
  field produces a nonlocal input--output memory, but boundaries truncate or
  reshape that memory.
- **Proposed AI translation:** select memory horizon and kernel family from
  declared support and boundary regime rather than hard-coding an infinite
  power law.
- **Efficiency mechanism:** a finite ladder or truncated kernel may retain the
  useful response with less state than a dense history, while avoiding the
  bias of a one-step Markov closure.
- **Failure modes:** narrow-band exponent mimicry, time variance,
  reaction-diffusion confounding, discretisation error, exact state-space
  realization matching the result, or memory state costing more than replay.
- **Measurable prediction:** finite-boundary models outperform a one-lag null
  under long-memory regimes and outperform an infinite Warburg arm after the
  low-frequency boundary turns over, while a balanced finite-state null may
  erase any special-kernel advantage.
- **Open question:** what is the smallest observable-supported state
  realization after boundary uncertainty is charged?
- **Used by:** [ECM-T02](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md#ecm-t02-finite-diffusion-memory).
- **Disposition:** scoped central claim; a physical residue adjacent
  to but not duplicating C-1526.

### C-1532

- **Statement:** a linear Kramers--Kronig transform can diagnose whether a
  sampled immittance record is compatible with a relaxed causal, stable,
  linear, time-invariant representation, but compliance does not identify a
  unique electrochemical circuit or mechanism.
- **Status:** established validation method and interpretation boundary for
  the cited formulation; finite band, noise, drift, and nonlinear excitation
  limit power.
- **Primary source:** [Boukamp 1995](https://doi.org/10.1149/1.2044210).
- **Biological/scientific observation:** constitutive consistency can reject
  some records before interpretation without resolving the inverse problem.
- **Proposed AI translation:** insert a validity gate before latent/mechanism
  inference and permit `invalid` or `non-identifying` outcomes.
- **Efficiency mechanism:** early rejection can avoid expensive fitting and
  unsafe updates on drifted or nonlinear records.
- **Failure modes:** low-power residual test, truncated-band artifacts,
  over-rejection, hidden nonlinearity that passes, equating compliance with
  truth, or ordinary residual/change-point checks matching the gate.
- **Measurable prediction:** the gate reduces confident mechanism actions on
  drift/nonlinearity records without degrading valid-record calibration, and
  remains noncommittal among observationally equivalent compliant circuits.
- **Open question:** how much invalidity can be detected without lengthening
  acquisition enough to erase the saved compute?
- **Used by:** [ECM-T03](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md#ecm-t03-impedance-validity-before-interpretation).
- **Disposition:** scoped central claim.

### C-1533

- **Statement:** DRT and DDT methods can separate characteristic process-time
  structure from impedance through a declared forward kernel, but finite
  frequency support, noise, discretisation, and regularisation limit peak
  resolution and make recovered distributions operator-dependent.
- **Status:** established method capability for the cited SOFC and diffusion
  frameworks; unique physical attribution of every recovered peak is not
  established.
- **Primary sources:** [Schichlein et al. 2002](https://doi.org/10.1023/A:1020599525160)
  and [Song and Bazant 2018](https://doi.org/10.1103/PhysRevLett.120.116001).
- **Biological/scientific observation:** a distributed system can expose a
  spectrum of characteristic times, but recovering that spectrum is an
  ill-conditioned inverse problem.
- **Proposed AI translation:** attach a resolution certificate and
  perturbation stability to every inferred multiscale latent decomposition.
- **Efficiency mechanism:** resolvable time groups may support sparse targeted
  updates instead of one dense model, provided inversion cost and uncertainty
  are lower than the saved work.
- **Failure modes:** split/merged/spurious peaks, penalty cherry-picking,
  negative or nonphysical weights, wrong kernel, visually persuasive but
  unstable decomposition, and a parametric circuit or direct predictor
  matching downstream performance.
- **Measurable prediction:** certified peaks meet frozen separation and
  coverage thresholds across noise/band perturbations; below the theoretical
  resolution floor the system merges or abstains rather than inventing extra
  mechanisms.
- **Open question:** does a distribution help the task after its uncertainty,
  grid, regularisation search, and acquisition band are charged?
- **Used by:** [ECM-T04](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md#ecm-t04-regularised-time-distribution-resolution).
- **Disposition:** scoped central claim.

### C-1534

- **Statement:** in the cited electrochemical phase-field model of LiFePO4
  nanoparticles, low currents admitted nucleation or spinodal separation,
  whereas above a critical current the unstable region disappeared and
  particles filled more homogeneously; phase separation was therefore
  rate- and scale-qualified rather than inevitable.
- **Status:** established theoretical/model result for the cited material and
  assumptions; universal battery phase behaviour or lifetime benefit is not
  established.
- **Primary source:** [Bai, Cogswell, and Bazant 2011](https://doi.org/10.1021/nl202764f).
- **Biological/scientific observation:** externally driven reaction can move a
  system across a morphology boundary and suppress an equilibrium tendency.
- **Proposed AI translation:** allow specialization/segregation only inside a
  measured regime map that includes forcing rate, module size, and coupling.
- **Efficiency mechanism:** avoiding unnecessary split/merge operations when
  drive homogenizes state may reduce structural churn.
- **Failure modes:** material-specific free energy, wrong critical rate,
  numerical phase diffusion, hidden nucleation, equating morphology with task
  specialization, or a hybrid mode detector/MPC matching the result.
- **Measurable prediction:** a regime-qualified policy reduces structural
  changes at non-inferior task loss across rate and size sweeps, but loses its
  advantage under hostile free-energy or boundary changes and never receives
  credit merely for producing domains.
- **Open question:** is explicit phase state useful beyond ordinary
  change-point or hybrid-system model selection?
- **Used by:** [ECM-T05](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md#ecm-t05-rate-dependent-phase-regime).
- **Disposition:** scoped central claim; retains C-470's
  non-intelligence boundary.

### C-1535

- **Statement:** the solid-electrolyte interphase can passivate a reactive
  electrode while its formation and continued growth consume cyclable
  inventory, add transport/impedance, and change growth regime with operating
  conditions; passivation is protective but not free or necessarily static.
- **Status:** established SEI model and model-qualified growth-regime evidence
  for cited alkali-metal/lithium-ion contexts; composition and dominant
  long-term mechanism remain chemistry- and protocol-specific.
- **Primary sources:** [Peled 1979](https://doi.org/10.1149/1.2128859),
  [Single, Latz, and Horstmann 2018](https://doi.org/10.1002/cssc.201800077),
  and [von Kolzenberg, Latz, and Horstmann 2020](https://doi.org/10.1002/cssc.202000867).
- **Biological/scientific observation:** a boundary layer can reduce an
  immediate parasitic reaction while imposing inventory, resistance,
  maintenance, and damage costs over longer horizons.
- **Proposed AI translation:** model protective filters, caches, trust layers,
  or quarantine barriers as stateful consumable infrastructure with growth,
  resistance, cracking, repair, and replacement.
- **Source boundary:** the cited sources support passivation, inventory loss,
  resistance, continued growth, and regime change. Cracking and repair are
  synthetic engineering stressors in ECM-T06, not findings attributed to
  those sources.
- **Efficiency mechanism:** a correctly sized barrier may reduce repeated
  downstream damage more than its construction and latency cost.
- **Failure modes:** uncharged formation, hidden resource loss, barrier
  thickening, crack-driven resets, stale blocking, chemical nonuniversality,
  or a stateless rate limiter/rollback policy matching the result.
- **Measurable prediction:** an adaptive barrier reduces cumulative damage at
  lower total lifecycle cost than no barrier, a fixed barrier, and a mature
  rollback/rate-limiter null, while inventory and impedance remain protected
  axes and crack transfer cannot be averaged away.
- **Open question:** can protection state be inferred before the cost of
  probing and maintenance exceeds avoided damage?
- **Used by:** [ECM-T06](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md#ecm-t06-passivation-with-inventory-and-resistance).
- **Disposition:** scoped central claim; reinforces maintenance and
  complete-resource accounting.

### C-1536

- **Statement:** in Chazalviel's dilute-electrolyte, high-field, blocking-
  contact model, anion depletion created space charge near the cathode and
  preceded ramified metallic growth; the result is geometry- and regime-
  qualified, not a universal dendrite law.
- **Status:** established primary theoretical/numerical result for the cited
  model; transfer to other electrolytes, solids, currents, or morphologies
  requires independent evidence.
- **Primary source:** [Chazalviel 1990](https://doi.org/10.1103/PhysRevA.42.7355).
- **Biological/scientific observation:** local carrier depletion can remove a
  stabilising approximation, create a field concentration, and amplify
  protrusions.
- **Proposed AI translation:** monitor local resource concentration and
  geometry, not only global mean throughput, before allowing positive-feedback
  allocation or growth.
- **Efficiency mechanism:** an early depletion gate may avoid costly runaway
  repair while preserving throughput below the support boundary.
- **Failure modes:** wrong depletion model, false alarms under supported
  transport, unobserved local concentration, grid-driven branching,
  conservative throttling, or robust queue/load control matching the result.
- **Measurable prediction:** a concentration- and geometry-aware controller
  reduces ramified/runaway exposure at matched throughput versus mean-load
  control; it must abstain or fail visibly when transference, geometry, or
  boundary support changes.
- **Open question:** can local depletion be estimated cheaply enough without
  the estimator becoming the dominant communication and sensing cost?
- **Used by:** [ECM-T07](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md#ecm-t07-depletion-before-ramified-growth).
- **Disposition:** scoped central claim.

### C-1537

- **Statement:** for the cited lithium-ion single-particle model, only grouped
  parameter combinations were identifiable from terminal response under the
  stated model and open-circuit-voltage conditions; low voltage residual alone
  did not make every physical parameter recoverable.
- **Status:** established structural/practical identifiability analysis for the
  cited model; other chemistries, models, excitations, and sensors can change
  the identifiable combinations.
- **Primary source:** [Bizeray et al. 2019](https://doi.org/10.1109/TCST.2018.2838097).
- **Biological/scientific observation:** hidden physical parameters can enter
  observations only through lower-dimensional groups unless experiments
  excite independent sensitivities.
- **Proposed AI translation:** require rank, conditioning, profile, and
  intervention evidence before assigning semantics to latent parameters.
- **Efficiency mechanism:** active excitation can target unresolved
  directions and stop collecting redundant observations.
- **Failure modes:** local rather than global identifiability, numerical
  derivative error, prior-dominated estimates, OCV plateaus, model mismatch,
  unsafe excitation, and black-box prediction matching the task without
  parameter recovery.
- **Measurable prediction:** an identifiability-aware design recovers only
  declared groups with calibrated uncertainty and spends fewer probes than
  random excitation, while refusing semantic claims for null-space
  directions even when prediction error is low.
- **Open question:** when is physical-parameter recovery worth more than a
  calibrated direct predictor under the same action and probe budget?
- **Used by:** [ECM-T08](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md#ecm-t08-identifiability-aware-excitation).
- **Disposition:** scoped central claim.

### C-1538

- **Statement:** the cited multiparticle insertion model and experiments
  support charge/discharge hysteresis that can persist toward low rate and
  arise from sequential particle-population state, so equal scalar occupancy
  can correspond to different terminal voltage and apparent equilibria.
- **Status:** established scoped model plus experimental interpretation for
  the cited insertion systems; the source does not establish one universal
  hysteresis mechanism or width.
- **Primary source:** [Dreyer et al. 2010](https://doi.org/10.1038/nmat2730).
- **Biological/scientific observation:** a macroscopic fraction can omit the
  distribution and path variables needed to predict a hysteretic observable.
- **Proposed AI translation:** retain a minimal path/population state only
  when interventions show that the scalar summary fails closure.
- **Efficiency mechanism:** a compact distributed-state summary may avoid
  replaying full history while preventing wrong state reuse.
- **Failure modes:** slow relaxation mistaken for hysteresis, measurement
  offset, excessive Preisach state, path bit sufficient, changed particle
  distribution, or recurrent/state-space null matching the result.
- **Measurable prediction:** a distributed-state arm improves held-out loop
  and reversal prediction over scalar state, but must not beat a direction-bit
  or compact recurrent null unless minor loops actually require extra state.
- **Open question:** what is the smallest sufficient path state across rate,
  dwell, and population changes?
- **Used by:** [ECM-T09](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md#ecm-t09-path-dependent-apparent-equilibria).
- **Disposition:** scoped central claim; sharpens C-917.

### C-1539

- **Statement:** calendar capacity loss in the cited commercial-cell study
  depended nonlinearly on state of charge, graphite-electrode potential, and
  temperature, while the cited closed-loop campaign demonstrated early-
  outcome prediction and Bayesian optimisation for a declared fast-charge
  protocol/cell family; neither result supplies a universal ageing law or
  charging policy.
- **Status:** established scoped experimental observations and optimisation
  capability; cross-chemistry, temperature, protocol, and mechanism transfer
  remains unresolved.
- **Primary sources:** [Keil et al. 2016](https://doi.org/10.1149/2.0411609jes)
  and [Attia et al. 2020](https://doi.org/10.1038/s41586-020-1994-5).
- **Biological/scientific observation:** damage can accumulate during both
  active operation and rest, depend on internal state, and become observable
  long after the action selected by an optimiser.
- **Proposed AI translation:** include exposure-state and delayed-damage
  uncertainty in policy search, with early prediction used only inside a
  validated support envelope.
- **Efficiency mechanism:** early elimination of damaging policies may reduce
  full-horizon trials, but only if false ranking, reserve trials, and delayed
  validation are counted.
- **Failure modes:** proxy leakage, censored survivors, unobserved calendar
  time, mechanism shift, knee onset, chemistry transfer, optimizer
  overconfidence, early predictor bias, and exhaustive/safe BO null matching
  the result.
- **Measurable prediction:** exposure-aware safe optimisation reaches a
  non-inferior final task/damage frontier with fewer full-horizon evaluations
  than mature early-stopping/BO nulls, and hostile chemistry/temperature
  transfer triggers calibrated abstention rather than confident reuse.
- **Open question:** how many long-horizon reserve evaluations are necessary
  to validate an early surrogate without erasing its claimed saving?
- **Used by:** [ECM-T10](../../experiments/fixtures/025-electrochemistry-interface-memory-degradation.md#ecm-t10-delayed-degradation-aware-policy-search).
- **Disposition:** scoped central claim.

## Source-to-claim and source-to-test ledger

| Source | Supports | Does not establish |
| --- | --- | --- |
| Ferguson & Bazant 2012; Bazant 2013 | C-1530 / ECM-T01 interface thermodynamics and kinetic closure | universal Butler--Volmer validity or AI efficiency |
| Criado et al. 2000 | C-1531 / ECM-T02 finite/general diffusion boundaries | one empirical Warburg model for every cell |
| Boukamp 1995 | C-1532 / ECM-T03 linear Kramers--Kronig validation | unique circuit or mechanism |
| Schichlein et al. 2002; Song & Bazant 2018 | C-1533 / ECM-T04 DRT/DDT capability | every peak as a unique physical process |
| Bai et al. 2011 | C-1534 / ECM-T05 rate-dependent phase model | universal morphology or lifetime benefit |
| Peled 1979; Single et al. 2018; von Kolzenberg et al. 2020 | C-1535 / ECM-T06 passivation and continued growth | universal SEI composition or mechanism |
| Chazalviel 1990 | C-1536 / ECM-T07 depletion/space-charge mechanism | all dendrites or all electrolytes |
| Bizeray et al. 2019 | C-1537 / ECM-T08 grouped identifiability | all battery models or excitation designs |
| Dreyer et al. 2010 | C-1538 / ECM-T09 multiparticle hysteresis | universal hysteresis state or width |
| Keil et al. 2016; Attia et al. 2020 | C-1539 / ECM-T10 exposure-dependent ageing and scoped optimisation | universal lifetime model or charging law |

## Falsification disposition

1. **Promote a claim only** if its frozen C arm passes its C-versus-B route,
   protected axes, component ablations, and hostile transfer with valid
   computation.
2. **Retain as evidence only** if the scientific source remains valid but the
   artificial translation fails, ties, or costs more than the mature null.
3. **Mark `INCONCLUSIVE`** when the registered generator lacks challenge or
   sensitivity, never because an inconvenient result is small.
4. **Mark `INVALID`** for leakage, hidden-oracle access, unit failure,
   non-closing ledgers, numerical instability above the cap, broken seed
   commitments, missing artifacts, or post-freeze changes.
5. **Kill the field translation** if validity is treated as mechanism,
   morphology as intelligence, passivation as free, fit as identifiability,
   early prediction as final validation, or synthetic cost as physical energy.

## Audit verdict

Electrochemistry is genuinely underrepresented and yields ten bounded,
nonduplicate mechanism claims. Its strongest contribution is not a battery
analogy but a discipline of separating interface, transport, observation,
state, history, damage, and inverse uncertainty. The correct next action is
F-025 implementation and sealed execution, not immediate architecture
promotion. All ten claims are now integrated into the central ledger while the
ten protocols remain preimplementation and carry no execution result.

## BibTeX appendix

```bibtex
@article{FergusonBazant2012PorousElectrodes,
  author = {Ferguson, Todd R. and Bazant, Martin Z.},
  title = {Nonequilibrium Thermodynamics of Porous Electrodes},
  journal = {Journal of The Electrochemical Society},
  year = {2012},
  volume = {159},
  number = {12},
  pages = {A1967--A1985},
  doi = {10.1149/2.048212jes},
  eprint = {1204.2934},
  archivePrefix = {arXiv}
}

@article{Bazant2013NonequilibriumChargeTransfer,
  author = {Bazant, Martin Z.},
  title = {Theory of Chemical Kinetics and Charge Transfer based on Nonequilibrium Thermodynamics},
  journal = {Accounts of Chemical Research},
  year = {2013},
  volume = {46},
  number = {5},
  pages = {1144--1160},
  doi = {10.1021/ar300145c}
}

@article{CriadoEtAl2000GeneralDiffusionBoundaries,
  author = {Criado, C. and Galan-Montenegro, P. and Velasquez, P. and Ramos-Barrado, J. R.},
  title = {Diffusion with general boundary conditions in electrochemical systems},
  journal = {Journal of Electroanalytical Chemistry},
  year = {2000},
  volume = {488},
  number = {1},
  pages = {59--63},
  doi = {10.1016/S0022-0728(00)00188-1}
}

@article{Boukamp1995LinearKramersKronig,
  author = {Boukamp, Bernard A.},
  title = {A Linear Kronig--Kramers Transform Test for Immittance Data Validation},
  journal = {Journal of The Electrochemical Society},
  year = {1995},
  volume = {142},
  number = {6},
  pages = {1885--1894},
  doi = {10.1149/1.2044210}
}

@article{SchichleinEtAl2002DRT,
  author = {Schichlein, H. and Muller, A. C. and Voigts, M. and Krugel, A. and Ivers-Tiffee, E.},
  title = {Deconvolution of electrochemical impedance spectra for the identification of electrode reaction mechanisms in solid oxide fuel cells},
  journal = {Journal of Applied Electrochemistry},
  year = {2002},
  volume = {32},
  number = {8},
  pages = {875--882},
  doi = {10.1023/A:1020599525160}
}

@article{SongBazant2018DDT,
  author = {Song, Juhyun and Bazant, Martin Z.},
  title = {Electrochemical Impedance Imaging via the Distribution of Diffusion Times},
  journal = {Physical Review Letters},
  year = {2018},
  volume = {120},
  pages = {116001},
  doi = {10.1103/PhysRevLett.120.116001},
  eprint = {1709.04147},
  archivePrefix = {arXiv}
}

@article{BaiCogswellBazant2011PhaseSuppression,
  author = {Bai, Peng and Cogswell, Daniel A. and Bazant, Martin Z.},
  title = {Suppression of Phase Separation in {LiFePO4} Nanoparticles During Battery Discharge},
  journal = {Nano Letters},
  year = {2011},
  volume = {11},
  number = {11},
  pages = {4890--4896},
  doi = {10.1021/nl202764f},
  eprint = {1108.2326},
  archivePrefix = {arXiv}
}

@article{Peled1979SEI,
  author = {Peled, Emanuel},
  title = {The Electrochemical Behavior of Alkali and Alkaline Earth Metals in Nonaqueous Battery Systems---The Solid Electrolyte Interphase Model},
  journal = {Journal of The Electrochemical Society},
  year = {1979},
  volume = {126},
  number = {12},
  pages = {2047--2051},
  doi = {10.1149/1.2128859}
}

@article{SingleLatzHorstmann2018SEIGrowth,
  author = {Single, Fabian and Latz, Arnulf and Horstmann, Birger},
  title = {Identifying the Mechanism of Continued Growth of the Solid--Electrolyte Interphase},
  journal = {ChemSusChem},
  year = {2018},
  volume = {11},
  pages = {1950--1955},
  doi = {10.1002/cssc.201800077},
  eprint = {1812.03841},
  archivePrefix = {arXiv}
}

@article{VonKolzenbergLatzHorstmann2020SEIRegimes,
  author = {von Kolzenberg, Lars and Latz, Arnulf and Horstmann, Birger},
  title = {Solid--Electrolyte Interphase During Battery Cycling: Theory of Growth Regimes},
  journal = {ChemSusChem},
  year = {2020},
  volume = {13},
  pages = {3901--3910},
  doi = {10.1002/cssc.202000867},
  eprint = {2004.01458},
  archivePrefix = {arXiv}
}

@article{Chazalviel1990RamifiedDeposits,
  author = {Chazalviel, Jean-Noel},
  title = {Electrochemical aspects of the generation of ramified metallic electrodeposits},
  journal = {Physical Review A},
  year = {1990},
  volume = {42},
  number = {12},
  pages = {7355--7367},
  doi = {10.1103/PhysRevA.42.7355}
}

@article{BizerayEtAl2019SPMIdentifiability,
  author = {Bizeray, Adrien M. and Kim, Jin-Ho and Duncan, Stephen R. and Howey, David A.},
  title = {Identifiability and Parameter Estimation of the Single Particle Lithium-Ion Battery Model},
  journal = {IEEE Transactions on Control Systems Technology},
  year = {2019},
  volume = {27},
  number = {5},
  pages = {1862--1877},
  doi = {10.1109/TCST.2018.2838097},
  eprint = {1702.02471},
  archivePrefix = {arXiv}
}

@article{DreyerEtAl2010InsertionHysteresis,
  author = {Dreyer, Wolfgang and Jamnik, Janko and Guhlke, Clemens and Huth, Robert and Moskon, Joze and Gaberscek, Miran},
  title = {The thermodynamic origin of hysteresis in insertion batteries},
  journal = {Nature Materials},
  year = {2010},
  volume = {9},
  number = {5},
  pages = {448--453},
  doi = {10.1038/nmat2730}
}

@article{KeilEtAl2016CalendarAging,
  author = {Keil, Peter and Schuster, Simon F. and Wilhelm, Jorn and Travi, Julian and Hauser, Andreas and Karl, Ralph C. and Jossen, Andreas},
  title = {Calendar Aging of Lithium-Ion Batteries. I. Impact of the Graphite Anode on Capacity Fade},
  journal = {Journal of The Electrochemical Society},
  year = {2016},
  volume = {163},
  number = {9},
  pages = {A1872--A1880},
  doi = {10.1149/2.0411609jes}
}

@article{AttiaEtAl2020ClosedLoopCharging,
  author = {Attia, Peter M. and Grover, Aditya and Jin, Norman and Severson, Kristen A. and Markov, Todor M. and Liao, Yang-Hung and Chen, Michael H. and Cheong, Bryan and Perkins, Nicholas and Yang, Zi and Herring, Patrick K. and Aykol, Muratahan and Harris, Stephen J. and Braatz, Richard D. and Ermon, Stefano and Chueh, William C.},
  title = {Closed-loop optimization of fast-charging protocols for batteries with machine learning},
  journal = {Nature},
  year = {2020},
  volume = {578},
  pages = {397--402},
  doi = {10.1038/s41586-020-1994-5}
}
```

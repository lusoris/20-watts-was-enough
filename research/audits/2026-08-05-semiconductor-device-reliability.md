# Semiconductor device and circuit reliability: primary-source audit

- **Audit date:** 2026-08-05
- **Scope:** fabrication yield and variability; transistor, dielectric,
  interconnect, memory, package, radiation, and thermal failure mechanisms;
  accelerated qualification; field error evidence; error correction, scrubbing,
  redundancy, adaptive voltage/frequency/body-bias control, wear leveling;
  approximate, analog, and in-memory computation; manufacturing and lifecycle
  energy; and measurement standards
- **Evidence rule:** only primary measurements, primary models tied to stated
  assumptions, and authoritative standards support audit-local claims. A passed
  qualification stress, simulated lifetime, component efficiency, or corrected
  task result establishes only its declared construct and boundary.
- **Promotion state:** audit-local `SEMI-` claims only. No new principle or
  candidate is promoted by this audit.

## Executive finding

Semiconductor engineering contributes a mature discipline for operating useful
systems made from parts that are never identical, never perfectly stable, and
never observed without a measurement model. Its strongest transferable package
is not a device metaphor. It is a **mission-profile-qualified degradation and
recovery contract**:

1. preserve distributions across fabricated units instead of a nominal device;
2. keep time-zero variation, reversible drift, cumulative degradation, abrupt
   failure, transient upset, and measurement error as different states;
3. connect accelerated stress to use only through a failure-mechanism-specific
   model with uncertainty and censored observations;
4. expose temperature, voltage, current density, activity, radiation, refresh,
   correction, repair, and workload as parts of the operating history;
5. adapt operating margin from independent monitors while reserving a verified
   fallback and charging detection, recovery, reserve, and lifetime loss;
6. place redundancy, coding, scrubbing, remapping, and wear leveling according
   to the fault geometry and common-cause model; and
7. compare accepted service over fabrication, packaging, calibration, operation,
   cooling, maintenance, replacement, and disposal—not core operations alone.

This package matters directly to sparse and physically compiled AI systems.
Sparse activity changes local current, temperature, retention, and wear rather
than making them disappear. Analog and in-memory paths exchange data movement
for calibration, conversion, stochastic programming, nonlinearity, drift,
limited endurance, and peripheral work. Lowering voltage exchanges switching
energy for delay and error margin. Redundancy exchanges local failures for area,
power, routing, repair, and correlated-fault exposure.

Every proposed transfer has mature engineering nulls: statistical timing and
yield analysis, reliability qualification, physics-of-failure models, guardbands,
error-correcting codes, memory scrubbing, sparing and remapping, Razor-class
timing detection, adaptive voltage/frequency/body bias, thermal management,
hardware-aware training, periodic recalibration, mixed-precision refinement,
and ISO/SEMI lifecycle accounting. After deduplication, this audit finds no exact
residual that merits a new project principle or candidate. It does sharpen
Candidates 001, 005, 006, 009, 010, 012, 014, 017, and 018 and defines decisive
tests that can retire hardware-level claims when the mature null stack matches
their quality–risk–latency–resource frontier.

## Outcome and construct firewall

The following quantities answer different questions. They must not be collapsed
into “reliability” or “efficiency.”

| Construct | Required report | Invalid substitution |
| --- | --- | --- |
| manufacturing yield | accepted die or packages divided by started units, test coverage, specification, process, wafer/lot/site structure, rework policy | one functional sample |
| parametric yield | joint fraction meeting all electrical and timing limits over declared process, voltage, temperature, and aging corners | mean performance or separate per-metric yields |
| qualification | revisioned standard, sample selection, lots, stresses, duration, failures, failure analysis, and applicability of generic data | “automotive grade,” burn-in, or a pass badge alone |
| survival or lifetime | failure definition, mission profile, censoring, lifetime distribution, confidence or credible interval, and extrapolation model | mean time to failure as a guaranteed life |
| transient error rate | particle or noise environment, sensitive state, cross-section, upset multiplicity, masking, correction, observation time, and uncertainty | device FIT as application failure rate |
| degradation | monitored parameter, baseline, reversible and permanent components, stress and recovery history, temperature, and failure threshold | elapsed calendar time |
| correctness | accepted output definition, silent corruption, detected/recovered errors, replay cost, and end-to-end coverage | raw bit-error rate |
| availability | delivered service time, repair and restart policy, degraded modes, and common-cause events | component survival |
| task quality | preregistered loss, calibration, safety or constraint violations, shift set, and abstention | analog MVM error or top-1 accuracy alone |
| energy | boundary from input acquisition to accepted output, precision, throughput, utilization, idle, conversion, cooling, and retries | MAC/J or array-core power |
| lifetime service | useful accepted work before retirement, including wear distribution, remapping, reserve, repair, and replacement | nominal cycle endurance of one cell |
| lifecycle burden | functional unit, geography, electricity mix, fab utilization and yield, process gases, water, materials, packaging, transport, use, maintenance, and end of life | operational electricity alone |

### Evidence-state types

For each component, route, or physical parameter, record a typed state rather
than a scalar “health” score:

| State | Meaning | Typical response |
| --- | --- | --- |
| `time_zero_variation` | fabricated difference present before use | bin, calibrate, map, guardband, or reject |
| `reversible_drift` | state changes with bias, temperature, time, or recovery and can partly return | recalibrate, relax, compensate, or reschedule |
| `cumulative_degradation` | stress history consumes margin or endurance | derate, rotate, remap, repair, or retire |
| `abrupt_failure` | open, short, breakdown, latch-up, or other discontinuity | contain, isolate, replace, or fail safe |
| `transient_upset` | state corruption without lasting physical damage | detect, correct, scrub, replay, or vote |
| `latent_fault` | fault exists but has not yet been sensitized or observed | test, patrol, diversify, or reduce exposure |
| `measurement_uncertainty` | monitor or tester does not know the state exactly | propagate uncertainty, add evidence, or abstain |
| `model_out_of_support` | stress, geometry, material, workload, or environment exceeds validation | stop extrapolation and requalify |

## Strong ordinary null stack

A hardware-reliability proposal must beat the relevant composition of:

- foundry process-design-kit corners, Monte Carlo mismatch, statistical static
  timing analysis, design-for-manufacturing, design-for-test, screening, binning,
  guardbands, and yield-aware placement;
- AEC-Q100 or JESD47-class qualification, JEP122 failure-mechanism models,
  JESD89-class soft-error measurement, calibrated accelerated life tests,
  destructive physical analysis, and field-return telemetry;
- SEC–DED or stronger error correction, parity and checksums, lockstep or voting,
  patrol scrubbing, sparing, remapping, retry, checkpoint/replay, containment,
  and tested degraded modes;
- conservative voltage/frequency tables, critical-path or canary monitors,
  Razor-class timing-error detection, adaptive voltage and frequency scaling,
  adaptive body bias, dynamic thermal management, and workload migration;
- static and dynamic wear leveling, bad-block management, retention-aware
  refresh, read-retry, remapping, and explicit endurance reserves;
- periodic and residual-triggered calibration, verify-and-program, differential
  mapping, hardware-aware training, mixed-precision correction, and a matched
  digital accelerator using the same sparsity and precision; and
- ISO 14040/14044 lifecycle assessment, SEMI S23 equipment-mode accounting,
  process-specific yield and utilization, packaging, cooling, maintenance,
  replacement, and uncertainty propagation.

No proposal receives credit for rediscovering one item in this stack under a
different domain label.

## Shared quantitative model

### Mission profile and competing mechanisms

Let a mission profile be a time series

$$
m(t)=\{T_j(t),V(t),j(t),a(t),\Phi_r(t),h(t),q(t)\},
$$

where $T_j$ is junction temperature [K], $V$ is supply or stress voltage [V],
$j$ is current density [A/m$^2$], $a$ is switching or access activity
[dimensionless], $\Phi_r$ is radiation flux [particle/(m$^2$ s)], $h$ is
relative humidity [dimensionless], and $q$ is the workload or operating mode.
For competing failure mechanisms $k$ with cause-specific hazards
$\lambda_k(t\mid m)$ [1/s], a simple independent-risks survival model is

$$
S(t\mid m)=\exp\!\left[-\int_0^t\sum_k\lambda_k(\tau\mid m)\,d\tau\right].
$$

Independence is an assumption, not a fact. Shared temperature, supply noise,
layout, manufacture, radiation bursts, and maintenance actions can correlate
mechanisms and replicas. A Weibull lifetime model for one scoped mechanism is

$$
S_k(t)=\exp\!\left[-\left(\frac{t}{\eta_k}\right)^{\beta_k}\right],
$$

where $\eta_k$ is the scale time [s] and $\beta_k$ is the dimensionless shape.
$\beta_k=1$ gives a constant hazard; fitting another value does not identify the
physical cause by itself.

### Acceleration and extrapolation

For a thermally activated mechanism with apparent activation energy $E_a$ [eV],
the Arrhenius acceleration factor from use temperature $T_u$ [K] to stress
temperature $T_s$ [K] is

$$
AF_T=\exp\!\left[\frac{E_a}{k_B}
\left(\frac{1}{T_u}-\frac{1}{T_s}\right)\right],
$$

where $k_B=8.617333262\times10^{-5}$ eV/K. The equation is usable only when the
same mechanism and apparent $E_a$ apply across both regimes. For the empirical
Black form of electromigration lifetime,

$$
\operatorname{MTTF}_{\mathrm{EM}}
=A j^{-n}\exp\!\left(\frac{E_a}{k_BT_j}\right),
$$

where $A$ has units that make time [s], $j$ is current density [A/m$^2$], $n$ is
dimensionless, and $T_j$ is conductor temperature [K]. Geometry, microstructure,
stress gradients, current waveform, self-heating, reservoirs, and failure
criterion are hidden in $A$, $n$, and applicability; the expression is not a
universal law for arbitrary interconnects.

### Electrothermal state

A first-order compact thermal state is

$$
C_{\mathrm{th}}\frac{dT_j}{dt}
=P(t)-\frac{T_j(t)-T_a(t)}{R_{\mathrm{th}}},
$$

where $C_{\mathrm{th}}$ is thermal capacitance [J/K], $P$ is dissipated power
[W], $T_a$ is ambient or boundary temperature [K], and $R_{\mathrm{th}}$ is
thermal resistance [K/W]. A single pole is an approximation; packages and 3-D
stacks generally require spatial or multi-pole models. Because temperature
changes delay, leakage, retention, and aging rates, reliability control must
close the loop through measured or bounded temperature rather than average
power alone.

### Yield and variability

Under the illustrative assumption of independent Poisson-distributed fatal
defects with areal density $D_0$ [defect/m$^2$] over die area $A_d$ [m$^2$],

$$
Y_{\mathrm{Poisson}}=\exp(-A_dD_0).
$$

Clustering, edge effects, critical area, systematic defects, parametric limits,
test escape, redundancy, and repair invalidate the simple form. For local random
MOS mismatch, the empirical Pelgrom form is commonly written

$$
\sigma(\Delta V_T)=\frac{A_{V_T}}{\sqrt{WL}},
$$

where $\sigma(\Delta V_T)$ is threshold mismatch standard deviation [V],
$A_{V_T}$ is the process- and layout-specific matching coefficient [V m], and
$W,L$ are device dimensions [m]. Systematic gradients and modern device-specific
sources require additional terms.

### Soft errors, correction, and scrubbing

For radiation species or energy bin $r$, an unmitigated upset rate can be
represented as

$$
R_{\mathrm{upset}}=N_b\sum_r\int \sigma_r(E)\phi_r(E)\,dE,
$$

where $N_b$ is the number of susceptible stored bits [bit], $\sigma_r(E)$ is
upset cross-section [m$^2$/bit], and $\phi_r(E)$ is differential particle flux
[particle/(m$^2$ s eV)]. Architectural failure rate further depends on temporal,
logical, electrical, and application masking plus detection and correction.

If independent correctable upsets strike one codeword as a Poisson process of
rate $\lambda_c$ [1/s] and patrol scrub interval is $\tau_s$ [s], the probability
of two or more accumulated upsets before a scrub is

$$
P_{\ge2}=1-e^{-\lambda_c\tau_s}(1+\lambda_c\tau_s).
$$

The expression is only a baseline. Multi-cell upsets, permanent faults, burst
radiation, scrub errors, shared decoders, address faults, and correlated replicas
break its assumptions.

### Adaptive operating point and accepted service

Dynamic CMOS switching energy per transition is approximately

$$
E_{\mathrm{dyn}}=\alpha C_{\mathrm{sw}}V^2,
$$

where $\alpha$ is activity [dimensionless], $C_{\mathrm{sw}}$ is effective
switched capacitance [F], and $V$ is supply [V]. Lower voltage reduces this term
quadratically but increases path delay and may increase timing, SRAM, analog,
and retention errors. For a policy $\pi$ selecting voltage, frequency, body bias,
mapping, refresh, calibration, and redundancy, evaluate

$$
J(\pi)=
\frac{N_{\mathrm{accepted}}(\pi)}
{E_{\mathrm{fab}}+E_{\mathrm{pkg}}+E_{\mathrm{use}}(\pi)
+E_{\mathrm{cool}}(\pi)+E_{\mathrm{maint}}(\pi)+E_{\mathrm{replace}}(\pi)},
$$

where $N_{\mathrm{accepted}}$ is the count of outputs meeting the declared task,
correctness, and safety contract [output], and all denominator terms are energy
[J] allocated to the same functional unit. Report latency, tail risk, lifetime,
availability, and material impacts separately; maximizing $J$ alone can hide
unsafe or short-lived operation.

### Analog and in-memory error state

For a programmed matrix $G_0$ represented by conductances [S], an analog
matrix-vector path at time $t$ can be modeled as

$$
\hat y_t = Q_{\mathrm{ADC}}\!\left[
(G_0+\Delta G_{\mathrm{prog}}+\Delta G_{\mathrm{drift}}(t,T)
+\Delta G_{\mathrm{read}})Q_{\mathrm{DAC}}(x)
+e_{\mathrm{wire}}+e_{\mathrm{periph}}
\right],
$$

where $x$ is the input vector, $Q_{\mathrm{DAC}}$ and $Q_{\mathrm{ADC}}$ are
conversion operators, $\Delta G_{\mathrm{prog}}$ is programming error [S],
$\Delta G_{\mathrm{drift}}$ is time- and temperature-dependent drift [S],
$\Delta G_{\mathrm{read}}$ is read noise [S], and $e_{\mathrm{wire}}$ and
$e_{\mathrm{periph}}$ are interconnect and peripheral errors in output-current
or converted-code units. Each term must be measured over devices, time, array
position, temperature, and operating history. A single additive Gaussian error
is not an adequate default.

## Audit-local claim ledger

### SEMI-001 — Reliability is conditional survival of a declared function

- **Status:** established.
- **Statement:** semiconductor reliability is defined only relative to a
  function, failure criterion, environment, operating history, and time horizon;
  it is not an intrinsic scalar attached to a technology name.
- **Primary anchors:** [NIST/SEMATECH reliability methods](https://www.nist.gov/publications/nistsematech-engineering-statistics-handbook-chapter-8-reliability),
  [AEC-Q100 Rev. J](https://www.aecouncil.com/AECDocuments.html), and
  [JEP122H](https://jedec.dpdcart.com/product/161444).
- **Rationale:** standards select tests from expected failure mechanisms and use
  conditions, while lifetime statistics require an explicit event definition.
- **Open question:** how should task-dependent analog degradation thresholds be
  versioned when the downstream model and workload change?
- **Transfer:** attach a mission profile, failure predicate, and validity horizon
  to every hardware capability claim.
- **Strong null:** conventional mission-profile qualification and reliability
  block diagrams with stated failure thresholds.
- **Deduplication:** P-006, P-009, and P-012; Candidates 009, 011, and 014.
- **Decisive test:** change the workload and failure predicate while holding the
  device fixed; an invariant scalar health score should fail to predict service.

### SEMI-002 — Qualification is evidence under a scoped stress set, not a lifetime guarantee

- **Status:** established.
- **Statement:** passing a stress-test qualification supports conformance to that
  revision, sample plan, failure criteria, and technology applicability; it does
  not prove every field mission or exclude untested mechanisms.
- **Primary anchors:** [AEC-Q100 Rev. J and its test-method family](https://www.aecouncil.com/AECDocuments.html),
  [JESD47L](https://standards.globalspec.com/std/14579554/jesd47l), and
  [NASA-STD-8739.10](https://standards.nasa.gov/sites/default/files/standards/NASA/Baseline/0/nasa-std-873910.pdf).
- **Rationale:** AEC explicitly calls for mechanism-based tests and
  requalification after relevant changes; NASA separates source control,
  derating, and radiation concerns.
- **Open question:** what minimum requalification is needed after changing
  calibration, firmware, model weights, or task acceptance thresholds?
- **Transfer:** bind assurance evidence to hardware, firmware, calibration,
  workload, and test versions.
- **Strong null:** an ordinary qualification matrix plus configuration control
  and change-impact analysis.
- **Deduplication:** P-009 and P-012; Candidates 009, 011, and 014.
- **Decisive test:** introduce a mechanism outside the original stress matrix and
  verify that the evidence contract marks the qualification out of support.

### SEMI-003 — Accelerated-life extrapolation is failure-mechanism-specific

- **Status:** established.
- **Statement:** acceleration factors are valid only when the stressed and use
  regimes share the relevant mechanism and the selected model and parameters
  remain supported.
- **Primary anchors:** [JEP122H](https://jedec.dpdcart.com/product/161444),
  [NIST accelerated-life methods](https://www.itl.nist.gov/div898/handbook/apr/section1/apr15.htm),
  and [NIST Cu electromigration waveform study](https://doi.org/10.1109/IRPS.2011.5784570).
- **Rationale:** temperature, field, current, humidity, cycling, and radiation
  accelerate different physical processes; excessive stress can introduce a new
  mechanism or change microstructure.
- **Open question:** how can online controllers detect that their aging model is
  crossing a mechanism boundary before destructive failure?
- **Transfer:** record the acceleration model, fitted parameters, stress range,
  residuals, and out-of-support detector with every lifetime estimate.
- **Strong null:** separate mechanism fits, step-stress checks, and held-out
  use-condition validation.
- **Deduplication:** P-006, P-007, and P-009; Candidates 003, 009, and 014.
- **Decisive test:** fit at high stress, predict withheld lower-stress data, then
  repeat across a known mechanism transition.

### SEMI-004 — Censoring and confidence belong in every low-failure estimate

- **Status:** established.
- **Statement:** zero or few observed failures do not imply zero hazard; exposure,
  censoring, sampling, distribution choice, and interval coverage determine the
  supported upper bound.
- **Primary anchors:** [NIST/SEMATECH reliability chapter](https://www.nist.gov/publications/nistsematech-engineering-statistics-handbook-chapter-8-reliability),
  [JESD85 methods as defined in JESD88E](https://www.renesas.com/document/gde/jedec-definition),
  and [AEC-Q100-008 early-life failure rate](https://www.aecouncil.com/AECDocuments.html).
- **Rationale:** reliability demonstrations are exposure experiments, often with
  right-censored units and a selected lifetime family.
- **Open question:** how should confidence be propagated when field telemetry is
  missing not at random because dead devices stop reporting?
- **Transfer:** report exposure and intervals, not only point FIT or MTTF values.
- **Strong null:** standard binomial, Poisson, or survival-analysis intervals with
  explicit censoring.
- **Deduplication:** P-007, P-009, and P-013; Candidates 007, 009, and 014.
- **Decisive test:** compare stated coverage against repeated synthetic and field
  cohorts with informative dropout.

### SEMI-005 — Measurement uncertainty is part of conformity decisions

- **Status:** established.
- **Statement:** tester accuracy, calibration, sampling, guard bands, and decision
  rules affect whether a part is accepted or rejected near a specification limit.
- **Primary anchors:** [JCGM 100:2008](https://doi.org/10.59161/JCGM100-2008E),
  [JCGM 106:2012](https://doi.org/10.59161/JCGM106-2012), and
  [AEC-Q100-009 electrical distributions](https://www.aecouncil.com/AECDocuments.html).
- **Rationale:** measured value and uncertainty determine conformity risk; a hard
  threshold on an unqualified reading hides false accept and false reject rates.
- **Open question:** how should correlated on-chip monitor error be propagated
  through adaptive voltage and lifetime-control decisions?
- **Transfer:** store calibration lineage, uncertainty, and decision guard band
  with health telemetry.
- **Strong null:** GUM-compliant uncertainty propagation and ordinary guard-banded
  acceptance sampling.
- **Deduplication:** P-007 and P-013; Candidates 009 and 014.
- **Decisive test:** inject monitor bias and drift near the control threshold;
  compare unsafe accepts and needless derating.

### SEMI-006 — Manufacturing yield and field reliability are different distributions

- **Status:** established.
- **Statement:** a device can pass production tests yet fail later, or be screened
  out despite adequate field life; yield, test escape, early-life failure, and
  wear-out require different evidence.
- **Primary anchors:** [Murphy 1964](https://doi.org/10.1109/PROC.1964.3442),
  [AEC-Q002 statistical yield analysis](https://www.aecouncil.com/AECDocuments.html),
  and [AEC-Q100-008](https://www.aecouncil.com/AECDocuments.html).
- **Rationale:** fatal fabrication defects, parametric tails, latent defects, and
  use-induced mechanisms occur at different stages and have different selection.
- **Open question:** how much field telemetry is needed to update manufacturing
  screens without overfitting one product population?
- **Transfer:** maintain separate yield, escape, infant-mortality, random-failure,
  and wear-out ledgers.
- **Strong null:** standard test-flow, burn-in, field-return, and survival models.
- **Deduplication:** P-004, P-009, and P-012; Candidates 009, 011, and 014.
- **Decisive test:** follow serialized units from wafer probe through field use
  and estimate transitions rather than inferring them from final survivors.

### SEMI-007 — Defect yield depends on area and spatial defect structure

- **Status:** established.
- **Statement:** larger critical area generally exposes more opportunities for
  fatal defects, but clustering, layout sensitivity, repair, and edge structure
  determine the actual yield law.
- **Primary anchors:** [Murphy 1964](https://doi.org/10.1109/PROC.1964.3442) and
  [Stapper, Armstrong, and Saji 1983](https://doi.org/10.1109/PROC.1983.12619).
- **Rationale:** Poisson yield is a useful null, not a universal fabrication law;
  observed wafer maps and critical-area models carry additional information.
- **Open question:** can modular chiplets reduce scrap and embodied energy after
  packaging, interconnect, test, and known-good-die burdens are included?
- **Transfer:** charge topology and die size decisions for empirical yield and
  repairability, not transistor count alone.
- **Strong null:** monolithic and chiplet designs matched for function, process,
  redundancy, package, interconnect, test, and delivered-good-unit volume.
- **Deduplication:** P-004, P-008, P-009, and P-010; Candidates 001 and 018.
- **Decisive test:** use fab-calibrated wafer maps to compare good delivered
  systems and lifecycle energy under both organizations.

### SEMI-008 — Local random mismatch shrinks only under scoped scaling laws

- **Status:** established.
- **Statement:** MOS parameter mismatch showed inverse square-root area scaling
  in the measured processes and layouts studied by Pelgrom and colleagues;
  systematic gradients and technology-specific sources remain separate.
- **Primary anchors:** [Pelgrom, Duinmaijer, and Welbers 1989](https://doi.org/10.1109/JSSC.1989.572629)
  and [Asenov 1998](https://doi.org/10.1109/16.658683).
- **Rationale:** discrete dopants, dimensions, work-function grains, interfaces,
  and layout gradients do not reduce to one global Gaussian offset.
- **Open question:** which variation coordinates are observable cheaply enough
  to support per-device routing rather than worst-case margin?
- **Transfer:** train and qualify across measured per-device distributions and
  spatial correlation, not independent synthetic noise alone.
- **Strong null:** Monte Carlo PDK models, common-centroid layout, calibration,
  binning, and static guardbands.
- **Deduplication:** P-001, P-006, and P-008; Candidates 001, 006, and 013.
- **Decisive test:** test multiple dies, wafers, lots, sites, and temperatures;
  hold out whole hierarchy levels when evaluating adaptation.

### SEMI-009 — Parametric yield is a joint tail problem

- **Status:** established.
- **Statement:** satisfying each specification marginally at a high rate does not
  establish the joint fraction satisfying all correlated timing, power, noise,
  analog, and memory constraints.
- **Primary anchors:** [AEC-Q100-009](https://www.aecouncil.com/AECDocuments.html),
  [Borkar et al. 2003](https://doi.org/10.1145/775832.775865), and
  [Bowman, Duvall, and Meindl 2002](https://doi.org/10.1109/JSSC.2002.803055).
- **Rationale:** process variables influence multiple endpoints and extreme paths;
  separate average margins can conceal joint failures.
- **Open question:** how should a learned hardware mapper preserve calibrated
  joint-tail risk under workload shift?
- **Transfer:** evaluate the joint acceptance region and conditional tails.
- **Strong null:** statistical static timing, correlated Monte Carlo analysis,
  and conservative corner signoff.
- **Deduplication:** P-006 and P-008; Candidates 009, 012, and 014.
- **Decisive test:** compare predicted and measured joint failure probability on
  held-out wafers and workloads, not marginal RMSE.

### SEMI-010 — Redundancy can convert fabrication defects into repairable yield loss

- **Status:** established.
- **Statement:** spare rows, columns, blocks, and remapping can raise accepted
  yield when defect geometry and diagnosis allow replacement, at costs in area,
  test, routing, latency, and residual common modes.
- **Primary anchors:** [Stapper, McLaren, and Dreckmann 1980](https://doi.org/10.1147/rd.243.0398)
  and [Kuo and Fuchs 1986](https://doi.org/10.1145/318013.318075).
- **Rationale:** repair changes the acceptance function; it does not remove
  defects or guarantee post-repair lifetime.
- **Open question:** what granularity of spare expert, array, or compute tile
  minimizes lifecycle cost under clustered defects and later wear?
- **Transfer:** evaluate repairable capacity and diagnosis coverage with reserve
  explicitly unavailable to nominal throughput.
- **Strong null:** conventional sparing and redundancy allocation optimized for
  the measured fault map.
- **Deduplication:** P-004, P-008, and P-009; Candidates 001, 005, and 018.
- **Decisive test:** sweep cluster size and spare granularity under equal area,
  test time, routing, and lifetime reserve.

### SEMI-011 — Time-zero variation and time-dependent variation interact

- **Status:** plausible.
- **Statement:** smaller devices can exhibit device-specific aging and random
  telegraph fluctuations whose magnitude and trajectory depend on their initial
  microscopic state; a single deterministic aging shift can miss tails.
- **Primary anchors:** [Kaczer et al. 2010](https://doi.org/10.1109/IRPS.2010.5488856),
  [Grasser et al. 2010](https://doi.org/10.1109/IRPS.2010.5488859), and
  [Rauch et al. 2020](https://arxiv.org/abs/2001.03236).
- **Rationale:** discrete traps produce step-like temporal variation, while
  fabricated differences alter field, delay, and stress exposure.
- **Open question:** which stochastic-tail models remain identifiable from cheap
  fleet monitors?
- **Transfer:** preserve initial calibration and longitudinal per-unit traces
  instead of subtracting one population-average drift curve.
- **Strong null:** hierarchical mixed-effects aging models and static worst-case
  guardbands.
- **Deduplication:** P-003, P-006, and P-012; Candidates 003, 009, and 014.
- **Decisive test:** predict held-out per-device trajectories from time-zero state
  and early observations, with calibrated tail coverage.

### SEMI-012 — Wafer, lot, die, block, device, and time are different variation scales

- **Status:** established.
- **Statement:** semiconductor variation contains hierarchical spatial and
  temporal components; randomly splitting individual measurements can leak
  shared fabrication history and overstate generalization.
- **Primary anchors:** [Pelgrom et al. 1989](https://doi.org/10.1109/JSSC.1989.572629),
  [Bowman et al. 2002](https://doi.org/10.1109/JSSC.2002.803055), and
  [AEC-Q002](https://www.aecouncil.com/AECDocuments.html).
- **Rationale:** local mismatch, die gradients, wafer signatures, lot shifts, and
  aging share different causes and correlations.
- **Open question:** how much hierarchical telemetry can be retained without
  exposing proprietary process information?
- **Transfer:** group evaluation splits by fabrication and time hierarchy.
- **Strong null:** hierarchical statistical process control and mixed-effects
  models.
- **Deduplication:** P-008, P-012, and P-013; Candidates 014, 017, and 019.
- **Decisive test:** compare random-record, device-held-out, wafer-held-out,
  lot-held-out, and future-time performance.

### SEMI-013 — Bias-temperature instability contains stress and recovery dynamics

- **Status:** established.
- **Statement:** bias-temperature instability changes transistor threshold and
  performance under bias and temperature, with observable recovery after stress;
  measurement delay and waveform therefore alter the reported degradation.
- **Primary anchors:** [Alam 2003](https://doi.org/10.1109/IEDM.2003.1269295),
  [Grasser et al. 2010](https://doi.org/10.1109/IRPS.2010.5488859), and
  [Kaczer et al. 2010](https://doi.org/10.1109/IRPS.2010.5488856).
- **Rationale:** trap capture and emission produce history-dependent kinetics;
  a single end-of-stress reading confounds stress, recovery, and instrument delay.
- **Open question:** can workload scheduling exploit recovery without increasing
  total damage, latency, or correlated aging elsewhere?
- **Transfer:** record stress duty cycle and observation delay; distinguish
  reversible state from permanent margin loss.
- **Strong null:** waveform-aware BTI models, static derating, and ordinary
  workload rotation.
- **Deduplication:** P-003, P-006, and P-009; Candidates 003 and 005.
- **Decisive test:** replay matched workloads with different stress/recovery order
  and predict both immediate and delayed parameter trajectories.

### SEMI-014 — Hot-carrier degradation is activity- and bias-specific

- **Status:** established.
- **Statement:** energetic carriers generated under particular electric-field
  and current conditions can create or charge interface and oxide defects,
  degrading device parameters according to switching and bias history.
- **Primary anchors:** [Hu et al. 1985](https://doi.org/10.1109/T-ED.1985.22053)
  and [JEP122H](https://jedec.dpdcart.com/product/161444).
- **Rationale:** calendar time or average utilization alone does not encode the
  drain, gate, substrate-current, and temperature conditions that drive damage.
- **Open question:** which application-level activity summaries preserve enough
  causal information for lifetime control without transistor-level traces?
- **Transfer:** route or schedule based on mechanism-relevant stress counters,
  not generic token or operation counts.
- **Strong null:** activity-aware aging simulation plus conventional guardband.
- **Deduplication:** P-001, P-006, and P-009; Candidates 005, 012, and 018.
- **Decisive test:** equalize operation count while varying bias and switching
  waveform; compare parameter shift and remaining margin.

### SEMI-015 — Dielectric breakdown is a stochastic threshold-crossing process

- **Status:** established.
- **Statement:** time-dependent dielectric breakdown is observed as a
  distribution of breakdown times under field and temperature; area scaling and
  Weibull extrapolation require spatial homogeneity and a stable mechanism.
- **Primary anchors:** [JEP122H](https://jedec.dpdcart.com/product/161444),
  [McPherson and Mogul 1998](https://doi.org/10.1063/1.368122), and
  [Keane et al. 2011](https://doi.org/10.1109/TVLSI.2009.2024982).
- **Rationale:** accumulated defects and conductive paths are stochastic; soft
  and hard breakdown, thickness variation, and local field enhancement change
  the observed distribution.
- **Open question:** how should graceful task degradation respond to rising
  leakage before a physically abrupt breakdown?
- **Transfer:** never convert a fitted median breakdown time into a deterministic
  retirement date; propagate tail risk and model support.
- **Strong null:** area-scaled Weibull analysis, leakage monitoring, and static
  dielectric guardbands.
- **Deduplication:** P-006 and P-009; Candidates 003, 005, and 012.
- **Decisive test:** predict withheld areas, fields, and temperatures, including
  deliberately nonuniform geometry.

### SEMI-016 — Electromigration depends on current, temperature, geometry, and material history

- **Status:** established.
- **Statement:** electron-driven atomic transport can nucleate and grow voids or
  extrusions, but lifetime parameters depend on interconnect material,
  microstructure, reservoirs, geometry, stress, waveform, and temperature.
- **Primary anchors:** [Black 1969](https://doi.org/10.1109/PROC.1969.7340),
  [Blech 1976](https://doi.org/10.1063/1.322842), and
  [NIST IRPS 2011](https://doi.org/10.1109/IRPS.2011.5784570).
- **Rationale:** Black-type current and temperature acceleration is empirical and
  scoped; short-line back stress and waveform conditions can change outcomes.
- **Open question:** can sparse routing reduce total interconnect damage without
  concentrating current into a small set of hot links?
- **Transfer:** attach current-density and thermal histories to physical routes
  and measure wear concentration.
- **Strong null:** electromigration-aware physical design, width rules, redundant
  vias, current balancing, and route rotation.
- **Deduplication:** P-001, P-005, P-006, and P-009; Candidates 001, 005, and 018.
- **Decisive test:** match completed work but vary route concentration and burst
  waveform; inspect resistance, voiding, and tail lifetime.

### SEMI-017 — Self-heating closes a nonlinear reliability loop

- **Status:** established.
- **Statement:** current and switching generate local heat; temperature changes
  delay, leakage, material transport, and degradation rates, which can change
  power and current again.
- **Primary anchors:** [Rzepka et al. 1998](https://doi.org/10.1109/95.725203),
  [Skadron et al. 2003](https://doi.org/10.1109/ISCA.2003.1206984), and
  [Ding et al. 2025](https://doi.org/10.1109/TDMR.2025.3629672).
- **Rationale:** average chip power is an inadequate proxy for local transient
  temperature, especially with spatial activity and package thermal impedance.
- **Open question:** which low-cost sensors and thermal models expose damaging
  gradients in heterogeneous 3-D systems?
- **Transfer:** close resource routing and voltage control around bounded local
  temperature and damage state.
- **Strong null:** HotSpot-class calibrated thermal modeling, dynamic thermal
  management, and conventional hotspot-aware placement.
- **Deduplication:** P-001, P-006, P-008, and P-009; Candidates 001, 005, and 012.
- **Decisive test:** hold average power fixed while changing spatial and temporal
  concentration; compare peak temperature, delay, and degradation.

### SEMI-018 — Package and interconnect fatigue depends on thermal-cycle amplitude and dwell

- **Status:** established.
- **Statement:** repeated temperature changes can fatigue solder joints and
  package interfaces; cycle range, ramp, dwell, geometry, material, and failure
  criterion determine acceleration.
- **Primary anchors:** [Darveaux 2000](https://doi.org/10.1109/6144.833046) and
  [AEC-Q100 Rev. J](https://www.aecouncil.com/AECDocuments.html).
- **Rationale:** steady hot operation and frequent power cycling can produce
  different package damage even at similar average temperature.
- **Open question:** when does aggressive power gating save operational energy
  but shorten package or interconnect service life?
- **Transfer:** count thermal transitions and dwell profiles as well as joules.
- **Strong null:** package finite-element fatigue models and standard temperature
  cycling qualification.
- **Deduplication:** P-006 and P-009; Candidates 003, 005, and 012.
- **Decisive test:** equalize total on-time and energy while varying cycle
  frequency, ramp, and dwell; measure joint damage and service loss.

### SEMI-019 — Failure mechanisms share stressors and cannot always be summed independently

- **Status:** plausible.
- **Statement:** temperature, voltage, current, fabrication variation, and package
  state can couple nominally separate mechanisms; summing independent constant
  failure rates can misstate system risk.
- **Primary anchors:** [JEP122H](https://jedec.dpdcart.com/product/161444),
  [Rzepka et al. 1998](https://doi.org/10.1109/95.725203), and
  [Ding et al. 2025](https://doi.org/10.1109/TDMR.2025.3629672).
- **Rationale:** the same local heat changes electromigration, delay, leakage,
  retention, and monitor readings; damage can also redistribute current.
- **Open question:** which couplings materially change decisions, rather than
  only adding model complexity?
- **Transfer:** use a coupled state graph where evidence justifies it and retain
  an independent-risks baseline.
- **Strong null:** mechanism-specific models composed through shared measured
  stress variables.
- **Deduplication:** P-006, P-008, and P-009; Candidates 003, 005, and 014.
- **Decisive test:** compare independent and coupled models prospectively under
  combined electrothermal stress.

### SEMI-020 — Sparse execution can trade total switching for local wear concentration

- **Status:** plausible.
- **Statement:** conditional activation can reduce total switching and data
  movement while increasing duty cycle, temperature, current density, and aging
  concentration in frequently selected routes or experts.
- **Primary anchors:** [Skadron et al. 2003](https://doi.org/10.1109/ISCA.2003.1206984),
  [Rzepka et al. 1998](https://doi.org/10.1109/95.725203), and
  [Black 1969](https://doi.org/10.1109/PROC.1969.7340).
- **Rationale:** total energy and maximum local stress are different objectives;
  skewed routing can improve one and damage the other.
- **Open question:** what regularizer captures lifetime and repair cost without
  forcing wasteful uniform use?
- **Transfer:** report route-selection concentration jointly with local thermal
  and aging telemetry.
- **Strong null:** load balancing constrained by measured temperature, timing,
  and cumulative damage.
- **Deduplication:** P-001, P-005, P-006, and P-008; Candidates 001, 008, and 018.
- **Decisive test:** compare energy-optimal, uniform, and damage-aware routing on
  the same tasks, silicon, cooling, and lifetime horizon.

### SEMI-021 — Recovery episodes do not erase cumulative damage

- **Status:** established.
- **Statement:** some electrical parameters partially recover after bias or
  temperature stress, while other defects, electromigration voids, endurance
  consumption, and package fatigue persist; equal current performance can hide
  unequal remaining life.
- **Primary anchors:** [Grasser et al. 2010](https://doi.org/10.1109/IRPS.2010.5488859),
  [Black 1969](https://doi.org/10.1109/PROC.1969.7340), and
  [Darveaux 2000](https://doi.org/10.1109/6144.833046).
- **Rationale:** observed function after rest is not a conserved damage measure.
- **Open question:** which nondestructive probes distinguish compensation from
  recovered physical margin in complex accelerators?
- **Transfer:** track native margin, compensating voltage or calibration, and
  cumulative stress separately.
- **Strong null:** standard degradation models plus support-removal and margin
  tests.
- **Deduplication:** P-003, P-006, P-009, and P-012; Candidate 005.
- **Decisive test:** equalize post-recovery task score, remove compensation, and
  compare remaining safe operating envelope and subsequent failure trajectory.

### SEMI-022 — Radiation error rate is environment- and spectrum-specific

- **Status:** established.
- **Statement:** soft-error and destructive-event rates depend on particle type,
  energy or linear energy transfer, altitude, shielding, solar and terrestrial
  environment, device cross-section, and operating state.
- **Primary anchors:** [Ziegler and Lanford 1979](https://doi.org/10.1126/science.206.4420.776),
  [JESD89](https://citeseerx.ist.psu.edu/document?doi=9e8e4d1efeb0c2d571f6f0436c5ec253ddbc7e80&repid=rep1&type=pdf),
  and [NASA JSC-HDBK-07-001](https://standards.nasa.gov/standard/JSC/JSC-HDBK-07-001).
- **Rationale:** accelerated source exposure must be folded with the intended
  spectrum and device response; one terrestrial FIT does not transfer to space.
- **Open question:** how should route authority change when radiation telemetry
  is sparse, delayed, or itself faulted?
- **Transfer:** make environmental spectrum and evidence age part of the hardware
  authority envelope.
- **Strong null:** JESD89/NASA radiation characterization plus static mission
  shielding and derating.
- **Deduplication:** P-006, P-007, and P-009; Candidates 007, 012, and 014.
- **Decisive test:** measure cross-section over particle energy and state, then
  predict a withheld environment rather than scaling one source count.

### SEMI-023 — Transient upset, transient pulse, latch-up, burnout, and dose are distinct hazards

- **Status:** established.
- **Statement:** ionizing radiation can cause non-destructive stored-state upset,
  transient analog or logic pulses, destructive latch-up or burnout, and
  cumulative total-ionizing-dose degradation; they require different detection
  and response.
- **Primary anchors:** [May and Woods 1979](https://doi.org/10.1109/T-ED.1979.19370),
  [NASA JSC-HDBK-07-001](https://standards.nasa.gov/standard/JSC/JSC-HDBK-07-001),
  and [NASA-STD-8739.10](https://standards.nasa.gov/sites/default/files/standards/NASA/Baseline/0/nasa-std-873910.pdf).
- **Rationale:** correcting a flipped memory bit does not contain latch-up or
  restore dose-degraded analog margin.
- **Open question:** what minimal event classifier supports the least destructive
  correct response under ambiguous telemetry?
- **Transfer:** type fault evidence before choosing scrub, replay, power cycle,
  isolation, derating, or replacement.
- **Strong null:** conventional radiation-hardening-by-design, current limiting,
  watchdogs, ECC, reset, and dose monitoring.
- **Deduplication:** P-002, P-003, P-008, and P-009; Candidates 005 and 012.
- **Decisive test:** inject each event class and score classification, containment,
  collateral loss, recovery, and recurrence separately.

### SEMI-024 — Field error populations can contradict accelerated-test folklore

- **Status:** established.
- **Statement:** large production studies found DRAM errors dominated by hard
  errors in the observed fleet and flash-drive reliability relationships that
  differed from simple raw-error and wear assumptions.
- **Primary anchors:** [Schroeder, Pinheiro, and Weber 2009](https://doi.org/10.1145/1555349.1555372)
  and [Schroeder, Lagisetty, and Merchant 2016](https://www.usenix.org/conference/fast16/technical-sessions/presentation/schroeder).
- **Rationale:** field selection, controller behavior, workload, temperature,
  manufacturing, and detection differ from isolated accelerated cell tests.
- **Open question:** how can vendors publish useful field distributions without
  leaking customer or product-sensitive data?
- **Transfer:** calibrate fault models against longitudinal field data and retain
  discrepancies as model risk.
- **Strong null:** conventional reliability growth using both accelerated and
  field-return datasets.
- **Deduplication:** P-007, P-009, P-012, and P-013; Candidates 007, 011, and 014.
- **Decisive test:** freeze a lab-derived predictor, evaluate future fleet data,
  and localize errors by permanent/transient and device/workload hierarchy.

### SEMI-025 — Device upset rate is not application failure rate

- **Status:** established.
- **Statement:** logical, electrical, temporal, architectural, software, and
  application masking can prevent or amplify a device event before it becomes an
  incorrect accepted output.
- **Primary anchors:** [Mukherjee et al. 2003](https://doi.org/10.1109/MICRO.2003.1253181)
  and [NASA JSC-HDBK-07-001](https://standards.nasa.gov/standard/JSC/JSC-HDBK-07-001).
- **Rationale:** susceptible bits, live state, instruction influence, checking,
  replay, and task semantics mediate propagation.
- **Open question:** how can application vulnerability be estimated for dynamic
  sparse graphs without exhaustive fault injection?
- **Transfer:** measure silent accepted corruption at the task boundary in
  addition to raw faults and detected corrections.
- **Strong null:** architectural vulnerability factor analysis and end-to-end
  fault injection.
- **Deduplication:** P-002, P-007, and P-008; Candidates 009, 010, and 014.
- **Decisive test:** inject the same device fault across live and dead state and
  compare device, architectural, and accepted-output events.

### SEMI-026 — Error-correcting codes are matched to a fault geometry

- **Status:** established.
- **Statement:** a SEC–DED code corrects one erroneous bit and detects two within
  its codeword under its decoder assumptions; burst, chip, address, decoder,
  correlated, or higher-multiplicity faults require different interleaving or
  codes.
- **Primary anchors:** [Hsiao 1970](https://doi.org/10.1147/rd.144.0395) and
  [Chen and Hsiao 1984](https://doi.org/10.1147/rd.282.0124).
- **Rationale:** redundancy count alone does not determine coverage; physical bit
  placement and shared logic determine which errors land in one codeword.
- **Open question:** which learned placement policy remains robust when the field
  fault geometry shifts from its training distribution?
- **Transfer:** co-design codes, interleaving, placement, and scrubbing against
  measured spatial and temporal correlation.
- **Strong null:** conventional ECC/interleaving optimized for the observed
  channel and chip organization.
- **Deduplication:** P-008, P-009, and P-010; Candidates 005, 009, and 017.
- **Decisive test:** cross independent, adjacent, burst, chip, decoder, and
  address faults at equal redundancy and latency.

### SEMI-027 — Scrubbing trades latent-error residence time for work and wear

- **Status:** established.
- **Statement:** periodically reading, correcting, and rewriting memory reduces
  the time in which correctable errors can accumulate, while consuming bandwidth,
  energy, controller activity, and possibly write endurance.
- **Primary anchors:** [Saleh, Serrano, and Patel 1990](https://www.nokia.com/bell-labs/publications-and-media/publications/reliability-of-scrubbing-recovery-techniques-for-memory-systems/)
  and [Hsiao 1970](https://doi.org/10.1147/rd.144.0395).
- **Rationale:** scrub interval changes multi-error probability; the independent
  Poisson model is only a baseline for correlated and permanent faults.
- **Open question:** can risk-adaptive scrubbing beat fixed patrol schedules after
  telemetry, burst risk, and endurance cost are included?
- **Transfer:** schedule verification from hazard and consequence, with hard
  maximum evidence age for protected state.
- **Strong null:** optimized fixed, deterministic, and stochastic scrub schedules
  with conventional ECC.
- **Deduplication:** P-003, P-006, P-009, and P-012; Candidates 005, 010, and 012.
- **Decisive test:** compare adaptive and fixed scrubbing across independent,
  burst, permanent, and adversarial faults at equal bandwidth, energy, and wear.

### SEMI-028 — Replication fails together when replicas share cause or verifier

- **Status:** established.
- **Statement:** spatial replication and voting tolerate only faults outside the
  shared supply, clock, thermal, radiation, design, voter, software, and update
  failure domains.
- **Primary anchors:** [Lyons and Vanderkulk 1962](https://doi.org/10.1147/rd.621.0200),
  [NASA-STD-8739.10](https://standards.nasa.gov/sites/default/files/standards/NASA/Baseline/0/nasa-std-873910.pdf),
  and [NASA JSC-HDBK-07-001](https://standards.nasa.gov/standard/JSC/JSC-HDBK-07-001).
- **Rationale:** majority voting adds no information when every replica receives
  the same wrong design, corrupted update, supply event, or environmental burst.
- **Open question:** how much physical and implementation diversity is worth its
  verification and maintenance burden?
- **Transfer:** declare independence assumptions and include voters, references,
  and control planes inside the fault model.
- **Strong null:** conventional fault-tree and common-cause analysis with diverse
  redundancy where justified.
- **Deduplication:** P-008 and P-009; Candidates 005, 009, and 020.
- **Decisive test:** inject independent and shared faults into replicas, voter,
  clock, supply, update, and monitor paths.

### SEMI-029 — Detection, containment, correction, replay, and replacement are separate stages

- **Status:** established.
- **Statement:** detecting an error does not establish containment, correct
  diagnosis, successful repair, absence of corrupted side effects, or restored
  future reliability.
- **Primary anchors:** [Arlat et al. 1990](https://doi.org/10.1109/32.44380),
  [Razor](https://doi.org/10.1109/MICRO.2003.1253179), and
  [AEC-Q100-007 fault simulation and test grading](https://www.aecouncil.com/AECDocuments.html).
- **Rationale:** a checker can detect after external commitment; replay can repeat
  a permanent or deterministic fault; replacement can import stale state.
- **Open question:** what minimal transaction boundary prevents analog or timing
  errors from escaping before validation?
- **Transfer:** timestamp and score every assurance stage separately.
- **Strong null:** mature ECC, retry, checkpoint/replay, isolation, and sparing
  with end-to-end validation.
- **Deduplication:** P-002, P-003, and P-009; Candidates 005, 009, and 010.
- **Decisive test:** inject faults before and after irreversible outputs and
  measure detected, contained, corrected, replayed, and silent outcomes.

### SEMI-030 — Fault injection establishes coverage only for its sampled fault model

- **Status:** established.
- **Statement:** fault-injection results are conditional on injection location,
  timing, duration, activation, observation, workload, and representativeness of
  the physical fault population.
- **Primary anchors:** [Arlat et al. 1990](https://doi.org/10.1109/32.44380),
  [AEC-Q100-007](https://www.aecouncil.com/AECDocuments.html), and
  [Mukherjee et al. 2003](https://doi.org/10.1109/MICRO.2003.1253181).
- **Rationale:** uniform bit flips are convenient but do not represent all delay,
  analog, burst, permanent, address, control, or correlated physical faults.
- **Open question:** how should physical test data update an architectural fault
  injection distribution with uncertainty?
- **Transfer:** publish the injection distribution and reweight or abstain outside
  its support.
- **Strong null:** stratified injection tied to physical characterization and
  end-to-end coverage analysis.
- **Deduplication:** P-007, P-009, and P-013; Candidates 009, 014, and 017.
- **Decisive test:** train or tune on one injection family and evaluate withheld
  physical and cross-layer fault classes.

### SEMI-031 — Voltage reduction buys dynamic-energy savings by spending timing and state margin

- **Status:** established.
- **Statement:** dynamic switching energy scales approximately with $V^2$, while
  lower supply increases delay and can induce timing, SRAM, analog, and retention
  failures; the useful operating point is workload- and device-specific.
- **Primary anchors:** [Razor](https://doi.org/10.1109/MICRO.2003.1253179),
  [Tschanz et al. 2002](https://doi.org/10.1109/JSSC.2002.803949), and
  [MATIC](https://doi.org/10.23919/DATE.2018.8341970).
- **Rationale:** a nominal guardband covers process, voltage, temperature, aging,
  droop, and data-dependent delay; removing it changes the error distribution.
- **Open question:** what voltage controller remains calibrated under changing
  network topology, aging, memory placement, and rare critical inputs?
- **Transfer:** optimize accepted task work per joule under explicit silent-error
  and tail-latency constraints.
- **Strong null:** characterized DVFS tables and conservative voltage guardbands.
- **Deduplication:** P-006 and P-007; Candidates 009, 010, and 012.
- **Decisive test:** sweep voltage on many dies, temperatures, ages, and tasks;
  report all faults, correction work, latency, and lifetime stress.

### SEMI-032 — Timing-error detection can replace some static margin with recovery

- **Status:** established.
- **Statement:** Razor-class shadow sampling detects selected late transitions
  and can replay or correct them, permitting operation closer to actual timing
  limits when checker and recovery assumptions hold.
- **Primary anchors:** [Ernst et al. 2003](https://doi.org/10.1109/MICRO.2003.1253179)
  and [Das et al. 2009](https://doi.org/10.1109/JSSC.2008.2007145).
- **Rationale:** the method converts a portion of worst-case voltage margin into
  detection hardware, hold-time constraints, replay latency, and error energy.
- **Open question:** how should analog and memory faults that do not present as a
  late digital transition be included in the same authority envelope?
- **Transfer:** treat aggressive operation as reversible speculation until a
  checker validates the transaction.
- **Strong null:** static timing closure, canary paths, and Razor with conventional
  replay control.
- **Deduplication:** P-002, P-003, P-006, and P-009; Candidates 009, 010, and 012.
- **Decisive test:** include checker faults, short paths, droops, replay storms,
  and externally visible side effects, not just recoverable path delay.

### SEMI-033 — Canary monitors are useful only within their tracking envelope

- **Status:** established.
- **Statement:** replica paths, ring oscillators, SRAM canaries, and thermal
  sensors estimate nearby failure margin only to the extent they track the
  spatial, temporal, data-dependent, and aging behavior of protected circuits.
- **Primary anchors:** [Tschanz et al. 2002](https://doi.org/10.1109/JSSC.2002.803949),
  [MATIC](https://doi.org/10.23919/DATE.2018.8341970), and
  [Skadron et al. 2003](https://doi.org/10.1109/ISCA.2003.1206984).
- **Rationale:** monitor offset, placement, quantization, calibration, and shared
  supply effects can create false headroom or needless derating.
- **Open question:** how many independent monitors are needed to bound a sparse,
  reconfigurable, spatially heterogeneous accelerator?
- **Transfer:** version monitor-to-protected-path calibration and shrink authority
  with evidence age and residual error.
- **Strong null:** pessimistic static margins plus calibrated distributed monitors.
- **Deduplication:** P-006 and P-007; Candidates 009, 012, and 014.
- **Decisive test:** induce spatial gradients and workload-specific critical paths
  withheld from monitor calibration.

### SEMI-034 — Body bias trades speed against leakage and junction constraints

- **Status:** established.
- **Statement:** forward and reverse body bias can compensate some process and
  workload variation, but change threshold, leakage, speed, junction bias, and
  technology-specific reliability limits.
- **Primary anchors:** [Tschanz et al. 2002](https://doi.org/10.1109/JSSC.2002.803949)
  and [Martin et al. 2002](https://doi.org/10.1145/774572.774678).
- **Rationale:** per-die or regional adaptation can improve joint frequency-power
  yield, but the optimal bias depends on state and constraints.
- **Open question:** does fine-grained body-bias control remain beneficial in the
  selected device technology after regulators, wells, sensors, and control work?
- **Transfer:** keep body bias as one costed actuator, not a universal plasticity
  mechanism.
- **Strong null:** characterized adaptive body bias and supply-voltage control.
- **Deduplication:** P-001 and P-006; Candidates 001, 012, and 013.
- **Decisive test:** compare static bins, per-die, and regional adaptive bias over
  process, temperature, aging, leakage, and task load.

### SEMI-035 — Thermal management regulates temperature, not merely power

- **Status:** established.
- **Statement:** frequency scaling, local toggling, task migration, cooling, and
  throttling can bound temperature, but sensor error and thermal time constants
  determine performance and safety.
- **Primary anchors:** [Skadron et al. 2003](https://doi.org/10.1109/ISCA.2003.1206984)
  and [Rzepka et al. 1998](https://doi.org/10.1109/95.725203).
- **Rationale:** equal instantaneous or average power can produce different
  spatial temperatures because package paths and activity history differ.
- **Open question:** when does migrating work reduce a hotspot versus heating
  communication and spare regions enough to worsen lifecycle cost?
- **Transfer:** control on predicted thermal state and uncertainty with latency-
  appropriate local protection.
- **Strong null:** calibrated compact thermal models and conventional dynamic
  thermal management.
- **Deduplication:** P-002, P-006, P-008, and P-009; Candidates 001 and 012.
- **Decisive test:** cross thermal sensor offset, workload migration, fan/cooling
  degradation, and transient bursts.

### SEMI-036 — Adaptive margin control needs an independently enforceable safe envelope

- **Status:** plausible.
- **Statement:** a learned or optimizing controller that sets voltage, frequency,
  refresh, calibration, or routing should not be the sole judge of whether its
  own evidence and actuators remain trustworthy.
- **Primary anchors:** [Razor](https://doi.org/10.1109/MICRO.2003.1253179),
  [NASA-STD-8739.10](https://standards.nasa.gov/sites/default/files/standards/NASA/Baseline/0/nasa-std-873910.pdf),
  and [AEC-Q100](https://www.aecouncil.com/AECDocuments.html).
- **Rationale:** controller, monitor, clock, supply, firmware, and update faults
  can create unsafe positive feedback.
- **Open question:** what is the smallest trusted protection layer for each
  hardware class and failure consequence?
- **Transfer:** reserve local interlocks, timeout, bounds, and a tested fallback
  outside the adaptive policy.
- **Strong null:** runtime assurance, hardware interlocks, watchdogs, and static
  derated modes.
- **Deduplication:** P-002, P-006, P-008, and P-009; Candidates 009, 012, and 020.
- **Decisive test:** corrupt the policy, telemetry, and actuator independently and
  together while measuring containment and fallback availability.

### SEMI-037 — Approximation is valid only across an explicit precision boundary

- **Status:** established.
- **Statement:** approximate data or operations may reduce energy only when flows
  into exact control, addressing, safety, accounting, and acceptance state are
  explicitly constrained and task error is measured.
- **Primary anchors:** [Sampson et al. 2011](https://doi.org/10.1145/1993498.1993518),
  [MATIC](https://doi.org/10.23919/DATE.2018.8341970), and
  [Razor](https://doi.org/10.1109/MICRO.2003.1253179).
- **Rationale:** numerical error is not harmless because an application average
  is tolerant; rare inputs and control-path corruption can have discontinuous
  consequences.
- **Open question:** which internal states in an adaptive model are safely
  approximate across distribution and objective changes?
- **Transfer:** type approximate state, permitted consumers, error budget,
  fallback, and irreversibility boundary.
- **Strong null:** typed approximate computation with exact control and calibrated
  quality monitoring.
- **Deduplication:** P-002, P-008, P-009, and P-012; Candidates 009, 010, and 012.
- **Decisive test:** search tail and adversarial inputs that route approximate
  error into exact or irreversible state.

### SEMI-038 — Analog in-memory computation instantiates weights as physical state

- **Status:** established.
- **Statement:** resistive arrays can perform vector–matrix products using stored
  device conductances and circuit laws, reducing some weight movement while
  making device, wire, and peripheral state part of the computation.
- **Primary anchors:** [Le Gallo et al. 2018](https://doi.org/10.1038/s41928-018-0054-8),
  [Joshi et al. 2020](https://doi.org/10.1038/s41467-020-16108-9), and
  [Le Gallo et al. 2023](https://doi.org/10.1038/s41928-023-01010-1).
- **Rationale:** the crossbar computes an analog current sum, but input drive,
  output conversion, tiling, activation, communication, and correction remain.
- **Open question:** which operators have enough reuse, locality, and tolerated
  precision to amortize programming and calibration?
- **Transfer:** route only operator- and workload-matched maps to physical arrays.
- **Strong null:** a digital accelerator matched for node, precision, sparsity,
  batching, utilization, memory, and complete task boundary.
- **Deduplication:** P-001, P-010, and P-012; Candidates 001, 006, and 018.
- **Decisive test:** compare acquisition-to-accepted-output systems, not array
  MACs, over realistic reuse and batch distributions.

### SEMI-039 — Programming physical weights is stochastic, asymmetric, and state-dependent

- **Status:** established.
- **Statement:** PCM and RRAM conductance changes vary across devices and pulses,
  depend on current state, and can require iterative verify-and-program or
  algorithmic tolerance.
- **Primary anchors:** [Ambrogio et al. 2014](https://doi.org/10.1109/TED.2014.2313889),
  [Nminibapiel et al. 2017](https://doi.org/10.1109/LED.2017.2696002), and
  [Ambrogio et al. 2018](https://doi.org/10.1038/s41586-018-0180-5).
- **Rationale:** a requested weight and realized conductance are different
  variables; verification itself is noisy and costs pulses, time, and endurance.
- **Open question:** when does allocating extra programming effort to important
  weights beat retraining, digital residuals, or different mapping?
- **Transfer:** retain requested, programmed, measured, and task-effective weight
  states separately.
- **Strong null:** iterative verify-and-program, differential cells, remapping,
  calibration, and quantization-aware training.
- **Deduplication:** P-003, P-004, P-006, and P-012; Candidates 006, 014, and 018.
- **Decisive test:** sweep target state, device, pulse history, temperature, and
  verification budget; report tails and endurance consumed.

### SEMI-040 — Conductance drift makes weight age an inference variable

- **Status:** established.
- **Statement:** amorphous PCM resistance evolves after programming with
  device- and state-dependent drift and noise; elapsed time, temperature, and
  reference state affect inferred weights and network accuracy.
- **Primary anchors:** [Boniardi and Ielmini 2011](https://doi.org/10.1063/1.3599559),
  [Joshi et al. 2020](https://doi.org/10.1038/s41467-020-16108-9), and
  [Ballmaier et al. 2025](https://doi.org/10.1002/aelm.202400905).
- **Rationale:** an approximate power law over one window is not stationary over
  all times and temperatures; common and differential drift need not cancel.
- **Open question:** which compact drift state is sufficient for large shared
  arrays under intermittent operation?
- **Transfer:** timestamp physical weights and propagate calibration age and
  temperature into route confidence.
- **Strong null:** periodic/reference-cell drift compensation, refresh, remapping,
  and digital storage.
- **Deduplication:** P-003, P-006, and P-012; Candidates 006, 012, and 014.
- **Decisive test:** evaluate immediately and across logarithmically spaced ages,
  temperature histories, power cycles, and unseen weight distributions.

### SEMI-041 — Array wires and data converters set scaling and precision limits

- **Status:** established.
- **Statement:** line resistance, source and access resistance, sneak paths,
  finite dynamic range, DAC/ADC quantization, peripheral noise, and tiling alter
  the realized matrix operation and its energy.
- **Primary anchors:** [Le Gallo et al. 2023](https://doi.org/10.1038/s41928-023-01010-1),
  [Chen et al. 2019](https://doi.org/10.1038/s41928-019-0288-0), and
  [Li et al. 2021](https://doi.org/10.1038/s41467-021-25455-0).
- **Rationale:** ideal crossbar parallelism does not include converters,
  communication, accumulation, or voltage drop across large arrays.
- **Open question:** where is the end-to-end crossover against current digital
  accelerators for sparse and attention-like workloads?
- **Transfer:** model the full mixed-signal path with measured peripheral energy,
  latency, and errors by utilization.
- **Strong null:** matched digital and mixed-signal ASICs at the same accepted
  task quality and process assumptions.
- **Deduplication:** P-001, P-008, and P-010; Candidates 001, 006, and 018.
- **Decisive test:** sweep array size, sparsity, fan-in, precision, reuse, batch,
  and drift while measuring wall power and accepted throughput.

### SEMI-042 — Hardware-aware training transfers only across its nonideality support

- **Status:** established.
- **Statement:** training with measured or modeled hardware errors can recover
  accuracy on supported distributions, but does not establish robustness to
  unseen devices, faults, drift laws, temperatures, or correlated errors.
- **Primary anchors:** [Joshi et al. 2020](https://doi.org/10.1038/s41467-020-16108-9),
  [Rasch et al. 2023](https://doi.org/10.1038/s41467-023-40770-4), and
  [MATIC](https://doi.org/10.23919/DATE.2018.8341970).
- **Rationale:** the error model becomes part of the training distribution and
  can be overfit like any simulator.
- **Open question:** what device- and lot-held-out protocol is sufficient to
  estimate transfer to production hardware?
- **Transfer:** version the nonideality distribution and abstain or recalibrate
  on residual shifts.
- **Strong null:** post-training calibration, robust quantization, ensembles,
  digital correction, and ordinary domain randomization.
- **Deduplication:** P-004, P-006, and P-007; Candidates 004, 006, and 014.
- **Decisive test:** hold out device lots, temperatures, drift ages, spatial
  correlations, stuck cells, and converter nonlinearities.

### SEMI-043 — Mixed-precision refinement moves rather than removes exact work

- **Status:** established.
- **Statement:** an imprecise in-memory kernel plus high-precision residual or
  iterative refinement can reach accurate solutions when conditioning and error
  bounds permit, while retaining digital compute, conversions, and iterations.
- **Primary anchors:** [Le Gallo et al. 2018](https://doi.org/10.1038/s41928-018-0054-8)
  and [Ambrogio et al. 2018](https://doi.org/10.1038/s41586-018-0180-5).
- **Rationale:** physical computation supplies a proposal or low-precision update;
  a digital path evaluates and corrects it.
- **Open question:** which AI workloads expose residuals cheaply enough for
  reliable iterative correction?
- **Transfer:** account for exact residual construction, convergence checks,
  retries, and failure to converge.
- **Strong null:** digital mixed precision, quantized accelerators, and standard
  iterative refinement.
- **Deduplication:** P-003, P-009, and P-010; Candidates 006, 009, and 010.
- **Decisive test:** cross condition number, drift, faults, precision, and reuse;
  charge every high-precision iteration and conversion.

### SEMI-044 — Endurance is a distribution over cells, states, pulses, and conditions

- **Status:** established.
- **Statement:** nonvolatile-memory cells tolerate a finite and variable number
  of programming events, with failure dependent on device, state trajectory,
  pulse, temperature, and acceptance threshold.
- **Primary anchors:** [Huo et al. 2016](https://doi.org/10.1088/1674-4926/37/5/054009),
  [Ambrogio et al. 2014](https://doi.org/10.1109/TED.2014.2313889), and
  [AEC-Q100-005](https://www.aecouncil.com/AECDocuments.html).
- **Rationale:** a nominal cycle count is not a guaranteed uniform capacity and
  may not transfer from binary storage to multilevel analog updates.
- **Open question:** what online wear proxy predicts analog-task failure before
  hard cell failure?
- **Transfer:** maintain per-region endurance uncertainty and reserve rather than
  one global write counter.
- **Strong null:** standard endurance qualification, bad-block management,
  overprovisioning, and conservative write limits.
- **Deduplication:** P-005, P-009, and P-012; Candidates 005, 006, and 018.
- **Decisive test:** measure device distributions under task-real pulse trains,
  multilevel targets, temperatures, and retention intervals.

### SEMI-045 — Wear leveling redistributes damage but adds mapping state and attack surface

- **Status:** established.
- **Statement:** changing logical-to-physical mapping can approach more uniform
  wear and extend useful life, but costs metadata, movement, latency, energy,
  recovery logic, and resilience to malicious or pathological writes.
- **Primary anchors:** [Qureshi et al. 2009](https://doi.org/10.1145/1669112.1669117)
  and [Wang et al. 2015](https://doi.org/10.1109/TVLSI.2014.2350073).
- **Rationale:** uniform use is not automatically optimal when cells have unequal
  endurance, data have unequal value, and movement itself consumes writes.
- **Open question:** should physical expert rotation optimize remaining life,
  reconstruction cost, or task value under adversarial demand?
- **Transfer:** treat remapping metadata, migration, recovery, and reserve as part
  of the state machine.
- **Strong null:** static/dynamic wear leveling and bad-block remapping optimized
  for measured endurance variation.
- **Deduplication:** P-001, P-005, P-009, P-012, and P-013; Candidates 001, 005,
  017, and 018.
- **Decisive test:** compare uniform, endurance-aware, value-aware, and adversarial
  mappings under equal capacity, metadata, movement, and recovery cost.

### SEMI-046 — Raw memory error rate need not predict uncorrectable service failure

- **Status:** established.
- **Statement:** Google’s six-year flash field study found raw bit error rate
  relationships and uncorrectable errors that did not support common simple
  proxies; controller and device-level metrics must be validated against service
  outcomes.
- **Primary anchors:** [Schroeder, Lagisetty, and Merchant 2016](https://www.usenix.org/conference/fast16/technical-sessions/presentation/schroeder).
- **Rationale:** ECC strength, bad blocks, controller firmware, read traffic,
  device model, wear, and non-bit failures mediate end-to-end data loss.
- **Open question:** which analog-array telemetry predicts silent task failure
  rather than merely conductance variance?
- **Transfer:** choose monitors by prospective outcome prediction, not physical
  plausibility alone.
- **Strong null:** conventional SMART/controller telemetry calibrated on future
  field failures.
- **Deduplication:** P-007 and P-009; Candidates 003, 007, and 014.
- **Decisive test:** freeze thresholds and compare prospective prediction of raw,
  corrected, uncorrectable, silent, and replacement outcomes.

### SEMI-047 — Semiconductor fabrication has material and energy burdens outside use power

- **Status:** established.
- **Statement:** primary lifecycle inventories show substantial electricity,
  fuels, ultrapure materials, gases, water, and infrastructure burdens in wafer
  and device production; results depend strongly on process and allocation.
- **Primary anchors:** [Williams, Ayres, and Heller 2002](https://doi.org/10.1021/es025643o),
  [Krishnan et al. 2008](https://doi.org/10.1021/es071174k), and
  [Boyd et al. 2010](https://doi.org/10.1021/es902388b).
- **Rationale:** an operationally efficient specialized device can lose its
  advantage when low utilization, yield, short life, or frequent replacement
  amortizes high manufacture over little accepted service.
- **Open question:** current node- and package-specific inventories are often
  proprietary; how can decisions expose uncertainty without false precision?
- **Transfer:** include fabrication and packaging energy ranges in hardware route
  crossover decisions.
- **Strong null:** ISO 14040/14044 lifecycle assessment with process-specific
  sensitivity ranges.
- **Deduplication:** P-009, P-010, and P-012; Candidates 006, 017, and 018.
- **Decisive test:** calculate break-even accepted operations over measured yield,
  utilization, lifetime, replacement, and electricity mixes.

### SEMI-048 — Fab utilization and process rate change energy per accepted unit

- **Status:** established.
- **Statement:** semiconductor facilities and tools consume substantial idle,
  support, and cleanroom energy, so energy per wafer or good die depends on
  throughput, utilization, rework, and yield rather than recipe energy alone.
- **Primary anchors:** [Boyd et al. 2010](https://doi.org/10.1021/es902388b),
  [SEMI S23-1021E2](https://store-us.semi.org/products/s02300-semi-s23-guide-for-conservation-of-energy-utilities-and-materials-used-by-semiconductor-manufacturing-equipment),
  and [Krishnan et al. 2008](https://doi.org/10.1021/es071174k).
- **Rationale:** denominator choice and facility allocation can reverse rankings
  between low-volume prototypes and mature high-yield production.
- **Open question:** what public ranges are defensible for future accelerators
  before production yield and utilization exist?
- **Transfer:** publish low/base/high fab allocation scenarios and break-even
  points rather than one embodied-energy constant.
- **Strong null:** SEMI mode accounting and ISO lifecycle sensitivity analysis.
- **Deduplication:** P-006, P-009, and P-012; Candidates 006 and 018.
- **Decisive test:** recompute rankings across measured process, idle, rest,
  sleep, yield, and utilization distributions.

### SEMI-049 — Equipment energy must be measured by operating mode and utility boundary

- **Status:** established.
- **Statement:** process, idle, rest, and sleep modes and non-electric utilities
  require explicit rates, durations, conversions, and reporting boundaries.
- **Primary anchors:** [SEMI S23-1021E2](https://store-us.semi.org/products/s02300-semi-s23-guide-for-conservation-of-energy-utilities-and-materials-used-by-semiconductor-manufacturing-equipment)
  and [JCGM 100:2008](https://doi.org/10.59161/JCGM100-2008E).
- **Rationale:** peak tool power or process-only electricity omits facility and
  standby burdens; energy-equivalent conversions add model uncertainty.
- **Open question:** can future hardware papers publish compatible fabrication
  and use-stage mode traces without disclosing proprietary recipes?
- **Transfer:** require mode-resolved power, time, uncertainty, and conversion
  factors for physical-compute energy claims.
- **Strong null:** standard SEMI S23 measurement and reporting.
- **Deduplication:** P-006 and P-009; Candidates 006, 014, and 018.
- **Decisive test:** independently meter full tool and facility inputs across a
  representative production schedule.

### SEMI-050 — Lifetime extension can save manufacture while increasing use energy

- **Status:** plausible.
- **Statement:** guardbands, redundancy, refresh, cooling, calibration, and repair
  can extend useful hardware life but consume operational energy and capacity;
  replacement can save use energy while spending new fabrication burden.
- **Primary anchors:** [ISO 14044](https://www.iso.org/standard/38498.html),
  [Williams et al. 2002](https://doi.org/10.1021/es025643o), and
  [SEMI S23](https://store-us.semi.org/products/s02300-semi-s23-guide-for-conservation-of-energy-utilities-and-materials-used-by-semiconductor-manufacturing-equipment).
- **Rationale:** neither maximum physical lifetime nor minimum instantaneous
  power is a complete lifecycle objective.
- **Open question:** what functional unit fairly values evolving AI service
  quality across old and replacement hardware?
- **Transfer:** optimize lifecycle service under separate quality, safety,
  material, and energy constraints.
- **Strong null:** replacement and refurbishment analysis under ISO-conformant
  consequential and attributional sensitivity cases.
- **Deduplication:** P-006, P-009, P-010, and P-012; Candidates 005, 006, and 018.
- **Decisive test:** compare keep, derate, repair, repurpose, and replace policies
  on prospective service and lifecycle distributions.

### SEMI-051 — Physical specialization pays only when reuse and support amortize its lifecycle

- **Status:** established.
- **Statement:** moving a stable operation into an ASIC, analog array, or other
  physical structure can reduce repeated programmable work, but loses when
  workload reuse, yield, lifetime, calibration support, or utilization is too low.
- **Primary anchors:** [Le Gallo et al. 2023](https://doi.org/10.1038/s41928-023-01010-1),
  [Krishnan et al. 2008](https://doi.org/10.1021/es071174k), and
  [Murphy 1964](https://doi.org/10.1109/PROC.1964.3442).
- **Rationale:** compile-to-structure is an amortization decision across design,
  fabrication, mapping, conversion, maintenance, and future change.
- **Open question:** which measured workload-stability statistic predicts a
  profitable physical commitment without hindsight leakage?
- **Transfer:** require a prospective crossover and rollback plan for physical
  skill compilation.
- **Strong null:** optimized digital, FPGA, ASIC, and mixed-signal alternatives
  under matched lifetime volume and update rate.
- **Deduplication:** P-009, P-010, and P-012; Candidates 006, 017, and 018.
- **Decisive test:** hold out future workload changes and compare cumulative
  accepted service after redesign, remapping, calibration, and replacement.

### SEMI-052 — The residual is an evaluation contract, not a new mechanism

- **Status:** established.
- **Statement:** after comparison with mature semiconductor and systems
  engineering, this audit’s transferable content composes existing project
  bundles and candidates; it does not expose a distinct problem–causal-loop–
  timescale invariant.
- **Primary anchors:** [JEP122H](https://jedec.dpdcart.com/product/161444),
  [AEC-Q100](https://www.aecouncil.com/AECDocuments.html),
  [Razor](https://doi.org/10.1109/MICRO.2003.1253179),
  [Hsiao 1970](https://doi.org/10.1147/rd.144.0395), and
  [ISO 14044](https://www.iso.org/standard/38498.html).
- **Rationale:** variation-aware allocation, local containment, temporary traces,
  feedback, maintenance separation, structural compilation, lifetime-matched
  memory, and environmental telemetry already map to P-001 through P-013.
- **Open question:** can the integrated benchmark reveal a composition advantage
  beyond a complete conventional reliability stack?
- **Transfer:** retain this audit as a falsification and measurement contract.
- **Strong null:** the entire ordinary stack stated above.
- **Deduplication:** P-001–P-013; Candidates 001, 005, 006, 009, 010, 012, 014,
  017, and 018.
- **Decisive test:** retire every semiconductor-derived architectural claim that
  does not improve the equal-budget accepted-service frontier beyond that stack.

## Negative results and construct traps

1. **A qualification pass is not a universal life certificate.** It is scoped to
   a standard revision, sample, process family, test conditions, failure criteria,
   and reuse rules for generic data.
2. **A FIT value is not a deterministic deadline.** It is a rate estimate under a
   distribution and exposure model, often with large uncertainty and mechanism-
   specific acceleration.
3. **A high mean yield is not a good tail.** Joint parametric constraints,
   spatial clusters, rare process excursions, and test escapes can dominate.
4. **A “recovered” parameter is not restored physical life.** Bias recovery,
   recalibration, extra voltage, ECC, and remapping can hide cumulative damage.
5. **Sparse switching is not uniform thermal relief.** Concentrating work can
   create hotter and faster-aging routes even when chip energy falls.
6. **ECC is not generic fault tolerance.** Its coverage is determined by codeword,
   interleaving, decoder, address, burst, chip, and common-cause geometry.
7. **Scrubbing is not free maintenance.** It spends bandwidth, energy, controller
   activity, and writes; a scrub can also propagate a miscorrection or latent
   controller error.
8. **Replication is not independence.** Shared design, data, update, clock, supply,
   cooling, voter, and environment can defeat all replicas together.
9. **Fault injection is not the field distribution.** Uniform bit flips are one
   experimental input class, not evidence for delay, analog, burst, permanent,
   radiation, control, or correlated fault coverage.
10. **Voltage underscaling is not automatically approximate computation.** It can
    corrupt exact state, address/control paths, or rare outputs unless the error
    boundary is enforced and tested.
11. **A canary is not the protected circuit.** It can under-track local droop,
    data-dependent paths, temperature gradients, aging, or memory-cell tails.
12. **An analog multiply is not an accepted task output.** Programming, DACs,
    wires, ADCs, tiling, activation, communication, calibration, drift correction,
    and fallback remain in the path.
13. **Hardware-aware training is not physical proof.** It establishes robustness
    only to the sampled nonideality model and tested devices.
14. **A nominal endurance cycle count is not system lifetime.** Unequal wear,
    mapping metadata, bad blocks, multilevel states, temperature, retention,
    writes caused by maintenance, and adversarial patterns intervene.
15. **Operational joules are not lifecycle energy.** Yield, fab utilization,
    packaging, calibration, cooling, maintenance, replacement, and end-of-life
    allocation can reverse the comparison.
16. **Physical specialization is not permanent efficiency.** It needs enough
    accepted reuse before task or interface change invalidates the mapping.

## Decisive equal-budget experiments

Each experiment fixes a service target and reports the full outcome firewall.
Energy, reserve, monitor area, calibration, test, recovery, human work, and
replacement are inside the budget.

### E-SEMI-01 — Hierarchical variation and yield transfer

- **Question:** does per-device adaptation improve joint parametric yield beyond
  static corners and binning without hiding fabrication leakage?
- **Design:** sample multiple dies from multiple wafer sites, wafers, and lots.
  Measure timing, leakage, SRAM margin, analog transfer, monitor offset, and
  temperature. Split by device, wafer, lot, and future time.
- **Arms:** worst-case guardband; per-die binning; regional calibrated control;
  learned mapper with the same sensor, regulator, and test budget.
- **Measures:** joint accepted yield, false accept/reject, tail timing and power,
  monitor error, test time, controller area/energy, and post-aging yield.
- **Kill rule:** retire the learned arm if hierarchical holdouts or monitor shift
  erase its Pareto advantage.

### E-SEMI-02 — Mechanism-qualified accelerated-life extrapolation

- **Question:** can a degradation model predict use conditions rather than only
  interpolate its accelerated stress set?
- **Design:** for one material stack and failure criterion, preregister candidate
  Arrhenius/field/current models, stress across a matrix that includes suspected
  mechanism transitions, retain censored units, and hold out use-like conditions.
- **Arms:** single apparent activation factor; mechanism-separated models;
  hierarchical model with explicit out-of-support detection.
- **Measures:** survival calibration, interval coverage, residuals, failure
  analysis agreement, false-safe extrapolations, and experiment energy/time.
- **Kill rule:** forbid field use when a simpler standard model matches or the
  proposed model fails coverage at withheld low stress.

### E-SEMI-03 — Sparse routing energy–temperature–wear frontier

- **Question:** does conditional routing save lifecycle resources after hotspot
  and concentrated-aging costs?
- **Design:** run identical accepted workloads on measured silicon under uniform,
  energy-minimal, thermal-aware, and cumulative-damage-aware routing. Control
  cooling, clocks, voltage, and total work.
- **Measures:** wall energy, accepted latency and quality, spatial temperature,
  droop, current density, timing errors, calibrated aging proxies, migration,
  reserve, repair, and projected plus observed wear.
- **Kill rule:** reject “sparse is cooler” if total energy falls but the lifetime-
  adjusted accepted-service frontier does not improve.

### E-SEMI-04 — Fault geometry versus correction stack

- **Question:** which combination of code, interleaving, scrub, sparing, replay,
  and replication matches the actual error process?
- **Design:** inject and physically induce independent, adjacent, burst, chip,
  address, decoder, timing, permanent, and correlated faults. Include quiet and
  active state, different scrub ages, and external side effects.
- **Arms:** parity; SEC–DED; stronger ECC/interleaving; ECC plus scrub; sparing;
  checkpoint/replay; diverse replication; adaptive composition at equal cost.
- **Measures:** silent corruption, detected uncorrectable error, miscorrection,
  containment, replay, availability, bandwidth, latency, energy, wear, and common-
  cause failure.
- **Kill rule:** retire adaptive composition if a fixed conventional stack reaches
  the same frontier or the policy misclassifies withheld fault classes.

### E-SEMI-05 — Evidence-age-qualified voltage authority

- **Question:** can online voltage control remove margin safely as monitors age,
  drift, and lose tracking?
- **Design:** characterize many devices over temperature, droop, workload,
  spatial gradient, aging, sensor offset, and calibration age. Inject monitor,
  regulator, clock, and policy faults.
- **Arms:** datasheet voltage; characterized DVFS; canary AVS; Razor/replay;
  evidence-age-qualified controller with an independent lower bound and fallback.
- **Measures:** accepted joules, tail latency, timing/SRAM/analog faults, silent
  errors, replay storms, monitor miss rate, fallback availability, and damage.
- **Kill rule:** retire the new controller if ordinary AVS/Razor matches it or any
  single controller fault escapes the protected transaction boundary.

### E-SEMI-06 — Approximate-state containment

- **Question:** can selected hardware state be approximate without contaminating
  exact control or rare high-consequence outcomes?
- **Design:** label exact and approximate states, then cross random, structured,
  and adversarial bit/timing/analog errors with distribution and objective shift.
- **Arms:** exact digital; untyped approximation; typed approximation with exact
  control; outcome-gated approximation with verification and fallback.
- **Measures:** task loss distribution, calibration, constraint violations,
  control/address corruption, silent acceptance, verification cost, energy,
  latency, and fallback rate.
- **Kill rule:** reject approximation if tail or protected-outcome risk cannot be
  bounded at the claimed energy advantage.

### E-SEMI-07 — Analog in-memory end-to-end crossover

- **Question:** where does a physical matrix path beat matched digital hardware
  after all conversions, drift, faults, and reuse are charged?
- **Design:** fabricate or use multiple characterized arrays and run fixed,
  convolutional, recurrent, and attention-like operators across array size,
  precision, sparsity, batch, reuse, temperature, and time since programming.
- **Arms:** digital GPU/ASIC; quantized digital; idealized array simulation;
  measured analog array; analog plus calibration; analog plus digital residual;
  fallback scheduler.
- **Measures:** accepted task quality and calibration, tail errors, latency,
  throughput, array/DAC/ADC/communication/host/cooling energy, programming,
  calibration, area, yield, endurance, and operator lifetime.
- **Kill rule:** forbid component-level TOPS/W claims from driving architecture;
  retire the route where the complete digital null reaches the same frontier.

### E-SEMI-08 — Hardware-aware training out-of-support test

- **Question:** does hardware-aware training learn robust task structure or one
  measured nonideality distribution?
- **Design:** train on a subset of device lots, arrays, temperatures, drift ages,
  spatial correlations, stuck cells, converter curves, and wire conditions. Hold
  each factor and combinations out.
- **Arms:** software baseline; post-training quantization; hardware-aware training;
  hardware-aware training plus residual-triggered calibration; digital fallback.
- **Measures:** quality, calibration, abstention, residual detection, transfer,
  calibration samples, retraining energy, writes, and lifetime.
- **Kill rule:** retire robustness claims when unmodeled but physically supported
  shifts produce confident silent failures.

### E-SEMI-09 — Wear, value, and reconstructability placement

- **Question:** does value-aware physical placement beat established wear
  leveling and remapping after movement and metadata costs?
- **Design:** use measured heterogeneous endurance and failure maps with workloads
  spanning uniform, skewed, shifting, burst, and adversarial writes. Assign data
  independently measured value and reconstruction cost.
- **Arms:** no leveling; Start-Gap-class dynamic leveling; endurance-aware;
  value/reconstructability-aware; replicated/coded placement at equal capacity.
- **Measures:** accepted service before failure, worst-cell wear, silent loss,
  movement writes, metadata, latency, energy, recovery, and attack sensitivity.
- **Kill rule:** retire value-aware placement if leakage-free held-out value adds
  no benefit over endurance-aware wear leveling.

### E-SEMI-10 — Keep, derate, repair, repurpose, or replace lifecycle crossover

- **Question:** which hardware lifecycle policy maximizes accepted service under
  quality, risk, energy, material, and carbon constraints?
- **Design:** prospectively follow a device cohort with measured degradation,
  repair, energy, and workload evolution. Use low/base/high fabrication inventory
  and electricity-mix cases with explicit allocation.
- **Arms:** fixed retirement age; run-to-failure; telemetry-based derating;
  repair/remap; repurpose to tolerant work; replacement with current hardware.
- **Measures:** accepted outputs, quality, availability, tail risk, operational
  energy, cooling, repair, replacement, embodied energy, material use, and
  uncertainty intervals.
- **Kill rule:** reject any universal replacement or lifetime-extension rule; keep
  only policies that remain Pareto-competitive across registered sensitivity cases.

## Deduplication and candidate disposition

### Principle-level mapping

| Existing principle | Semiconductor recurrence | Disposition |
| --- | --- | --- |
| P-001 scarce activity allocation | binning, adaptive voltage/body bias, hotspot-aware routing, remapping, spare allocation | strengthens measurement and lifetime costs; no new invariant |
| P-002 local resolution and escalation | ECC, Razor detection, local interlocks, latch-up containment, replay | mature null for reflex and containment paths |
| P-003 cheap trace before commitment | shadow latch, syndrome, residual, monitor history, temporary replayable execution | mature null for staged verification |
| P-004 generate/select/protect or compress | process population, screening, binning, redundancy repair, hardware-aware search | substrate-specific evidence; no residual |
| P-005 reinforce useful paths and decay unused topology | wear, remapping, route rotation, spare consumption | adds irreversible physical state and adversarial wear tests |
| P-006 slower negative feedback | AVFS, body bias, thermal management, refresh and scrub-rate control | direct established engineering implementation |
| P-007 spend observation on unresolved error | calibration, monitors, fault injection, field telemetry, residual-triggered repair | mature value-of-information and metrology null |
| P-008 contain interactions in modules | codewords, fault domains, spare blocks, chiplets, isolated power/clock domains | mature modular fault-containment null |
| P-009 separate execution from maintenance | scrubbing, calibration, remapping, repair, qualification, failure analysis | strong established recurrence |
| P-010 move recurring computation into structure | ASICs, crossbars, analog state, ECC logic, physical interleaving | sharpens reuse and lifecycle crossover |
| P-011 transient coalitions through timing | clock/power domains and synchronized buses do not add a distinct recurrence here | no promotion pressure |
| P-012 match medium and update rate to lifetime | SRAM/DRAM/NVM tiers, retention, refresh, endurance, physical weights | strong established recurrence |
| P-013 coordinate through external state | wafer maps, calibration records, syndromes, wear maps, field logs | strengthens provenance and stale-state tests |

### Candidate-level disposition

| Candidate | Added semiconductor pressure | Disposition |
| --- | --- | --- |
| 001 adaptive topology | migration must include physical placement, thermal gradients, fault domains, spare wear, calibration, and remap recovery | retain; no new candidate |
| 005 severity-ordered containment | distinguish transient upset, cumulative degradation, abrupt failure, and measurement uncertainty; score compensation versus native recovery | retain and strengthen |
| 006 reversible physical skill | require multi-device fabrication yield, programming distribution, drift, endurance, peripherals, fallback, and lifecycle break-even | retain and strengthen |
| 009 graded assurance | bind qualification, calibration, monitor, firmware, workload, and hardware versions; include test coverage and failure model | retain and strengthen |
| 010 staged verification | Razor, ECC, verify-and-program, residual checks, and replay are mandatory mature nulls | retain only beyond complete stack |
| 012 latency-qualified authority | evidence age must include monitor tracking, calibration drift, thermal dynamics, voltage droop, scrub age, and radiation state | retain and strengthen |
| 014 observation contract | add tester uncertainty, mission profile, accelerated-model support, hierarchy, and missing field telemetry | retain and strengthen |
| 017 semantic compaction | preservation claims must survive bit faults, ECC limits, remapping, firmware changes, and medium aging | retain and strengthen |
| 018 value/reconstructability tiering | compare value signals against ordinary wear leveling, endurance-aware placement, ECC, sparing, and field failure prediction | retain only if leakage-free value helps |

### Exact residual test

The normalized problem is: **deliver accepted service from a variable and aging
physical substrate under limited sensing, correction, reserve, and lifecycle
resources**. The causal loop is: **characterize or monitor → estimate margin and
fault class → allocate operating point and protection → execute provisionally or
within an envelope → detect/correct/contain → update calibration, wear, and
evidence → repair, remap, derate, or retire**. Its timescales range from a clock
edge through scrub intervals, drift and wear, product life, and replacement.

Those elements are already covered by P-001, P-002, P-003, P-005, P-006, P-007,
P-008, P-009, P-010, P-012, and P-013. Semiconductor practice supplies unusually
strict measurement, acceleration, fault-geometry, and lifecycle tests, but no
uncovered causal invariant. **Disposition: do not allocate a new principle or
candidate ID.** The
durable result should be a fixture or evaluation contract combining E-SEMI-01
through E-SEMI-10, not a renamed architecture.

## Open questions

1. What compact mission-profile representation preserves enough voltage,
   activity, current, temperature, recovery, radiation, and workload history for
   prospective lifetime prediction?
2. How can a runtime system distinguish recoverable drift, cumulative damage,
   transient upset, monitor error, and model-out-of-support state before acting?
3. Which on-chip monitors remain independent enough from protected paths and
   control infrastructure to justify adaptive authority?
4. Can sparse conditional routing reduce total energy without concentrating
   electrothermal and endurance damage into a small physical subset?
5. What hardware fault distribution should AI fault-injection suites use after
   calibration to radiation, voltage, aging, memory, and field evidence?
6. Which exact model and control state must remain protected when approximate
   arithmetic or undervolted memories are allowed?
7. When do error correction and replay reduce net lifecycle cost after correction
   energy, latency, wear, reserve, and correlated decoder faults?
8. How should analog weight age, calibration age, and temperature be propagated
   into task confidence and routing decisions?
9. Can hardware-aware training transfer across unseen lots, arrays, drift laws,
   spatial correlations, converter curves, and stuck-device patterns?
10. Which operator-reuse and workload-stability statistics predict an analog,
    ASIC, or other physical-compilation crossover prospectively?
11. Does value- and reconstructability-aware placement add information beyond
    conventional endurance-aware wear leveling without target leakage?
12. How should generic qualification evidence be invalidated after firmware,
    calibration, model, task, package, cooling, or workload changes?
13. What public lifecycle inventory ranges are defensible for current logic,
    memory, advanced packaging, and low-volume experimental hardware?
14. When does extending hardware life through cooling, refresh, calibration, and
    repair cost more lifecycle energy or material than replacement or repurposing?
15. Can one benchmark expose the joint Pareto frontier of accepted quality,
    silent-error risk, latency, availability, operational energy, embodied energy,
    and lifetime without collapsing it to a scalar?

## Bibliography

### Standards, measurement, and qualification

1. Automotive Electronics Council. **AEC-Q100 Rev. J: Failure Mechanism Based
   Stress Test Qualification for Integrated Circuits**, with Q100-005, Q100-007,
   Q100-008, and Q100-009 subordinate methods. Official document index:
   <https://www.aecouncil.com/AECDocuments.html>.
2. JEDEC. **JEP122H: Failure Mechanisms and Models for Semiconductor Devices**
   (2016). Official catalog: <https://jedec.dpdcart.com/product/161444>.
3. JEDEC. **JESD47L: Stress-Test-Driven Qualification of Integrated Circuits**.
   Standard record: <https://standards.globalspec.com/std/14579554/jesd47l>.
4. JEDEC. **JESD89: Measurement and Reporting of Alpha Particle and Terrestrial
   Cosmic Ray-Induced Soft Errors in Semiconductor Devices**. Archived standard:
   <https://citeseerx.ist.psu.edu/document?doi=9e8e4d1efeb0c2d571f6f0436c5ec253ddbc7e80&repid=rep1&type=pdf>.
5. JEDEC. **JESD88E: JEDEC Dictionary of Terms for Solid-State Technology**
   (definitions include JESD85 failure-rate terms).
   <https://www.renesas.com/document/gde/jedec-definition>.
6. NASA. **JSC-HDBK-07-001: High Energy/LET Radiation EEE Parts Certification
   Handbook**. <https://standards.nasa.gov/standard/JSC/JSC-HDBK-07-001>.
7. NASA. **NASA-STD-8739.10: Electrical, Electronic, and Electromechanical Parts
   Assurance Standard**. <https://standards.nasa.gov/sites/default/files/standards/NASA/Baseline/0/nasa-std-873910.pdf>.
8. JCGM. **JCGM 100:2008, Evaluation of measurement data—Guide to the expression
   of uncertainty in measurement**. DOI: <https://doi.org/10.59161/JCGM100-2008E>.
9. JCGM. **JCGM 106:2012, The role of measurement uncertainty in conformity
   assessment**. DOI: <https://doi.org/10.59161/JCGM106-2012>.
10. NIST/SEMATECH. **Engineering Statistics Handbook, Chapter 8: Reliability**
    (2003; maintained by NIST). <https://www.nist.gov/publications/nistsematech-engineering-statistics-handbook-chapter-8-reliability>.
11. ISO. **ISO 14044:2006, Environmental management—Life cycle assessment—
    Requirements and guidelines**. <https://www.iso.org/standard/38498.html>.
12. SEMI. **SEMI S23-1021E2: Guide for Conservation of Energy, Utilities and
    Materials Used by Semiconductor Manufacturing Equipment**.
    <https://store-us.semi.org/products/s02300-semi-s23-guide-for-conservation-of-energy-utilities-and-materials-used-by-semiconductor-manufacturing-equipment>.

### Yield, variability, aging, and electrothermal physics

13. Murphy, B. T. **Cost-size optima of monolithic integrated circuits**.
    *Proceedings of the IEEE* 52 (1964). DOI:
    <https://doi.org/10.1109/PROC.1964.3442>.
14. Stapper, C. H., Armstrong, F. M., and Saji, K. **Integrated circuit yield
    statistics**. *Proceedings of the IEEE* 71 (1983). DOI:
    <https://doi.org/10.1109/PROC.1983.12619>.
15. Stapper, C. H., McLaren, A. N., and Dreckmann, M. **Yield model for
    productivity optimization of VLSI memory chips with redundancy and partially
    good product**. *IBM Journal of Research and Development* 24 (1980). DOI:
    <https://doi.org/10.1147/rd.243.0398>.
16. Kuo, S.-Y., and Fuchs, W. K. **Efficient spare allocation in reconfigurable
    arrays**. DAC (1986). DOI: <https://doi.org/10.1145/318013.318075>.
17. Pelgrom, M. J. M., Duinmaijer, A. C. J., and Welbers, A. P. G. **Matching
    properties of MOS transistors**. *IEEE JSSC* 24 (1989). DOI:
    <https://doi.org/10.1109/JSSC.1989.572629>.
18. Asenov, A. **Random dopant induced threshold voltage lowering and fluctuations
    in sub-0.1 μm MOSFETs: a 3-D atomistic simulation study**. *IEEE TED* 45
    (1998). DOI: <https://doi.org/10.1109/16.658683>.
19. Bowman, K. A., Duvall, S. G., and Meindl, J. D. **Impact of die-to-die and
    within-die parameter fluctuations on the maximum clock frequency distribution
    for gigascale integration**. *IEEE JSSC* 37 (2002). DOI:
    <https://doi.org/10.1109/JSSC.2002.803055>.
20. Borkar, S. et al. **Parameter variations and impact on circuits and
    microarchitecture**. DAC (2003). DOI:
    <https://doi.org/10.1145/775832.775865>.
21. Alam, M. A. **A critical examination of the mechanics of dynamic NBTI for
    PMOSFETs**. IEDM (2003). DOI:
    <https://doi.org/10.1109/IEDM.2003.1269295>.
22. Grasser, T. et al. **The time dependent defect spectroscopy (TDDS) for the
    characterization of the bias temperature instability**. IRPS (2010). DOI:
    <https://doi.org/10.1109/IRPS.2010.5488859>.
23. Kaczer, B. et al. **Origin of NBTI variability unraveled by ultra-fast
    $V_T$ measurements**. IRPS (2010). DOI:
    <https://doi.org/10.1109/IRPS.2010.5488856>.
24. Hu, C. et al. **Hot-electron-induced MOSFET degradation—model, monitor, and
    improvement**. *IEEE TED* 32 (1985). DOI:
    <https://doi.org/10.1109/T-ED.1985.22053>.
25. McPherson, J. W., and Mogul, H. C. **Underlying physics of the thermochemical
    E model in describing low-field time-dependent dielectric breakdown in SiO2
    thin films**. *Journal of Applied Physics* 84 (1998). DOI:
    <https://doi.org/10.1063/1.368122>.
26. Keane, J. et al. **An array-based test circuit for fully automated gate
    dielectric breakdown characterization**. *IEEE TVLSI* 19 (2011). DOI:
    <https://doi.org/10.1109/TVLSI.2009.2024982>.
27. Black, J. R. **Electromigration failure modes in aluminum metallization for
    semiconductor devices**. *Proceedings of the IEEE* 57 (1969). DOI:
    <https://doi.org/10.1109/PROC.1969.7340>.
28. Blech, I. A. **Electromigration in thin aluminum films on titanium nitride**.
    *Journal of Applied Physics* 47 (1976). DOI:
    <https://doi.org/10.1063/1.322842>.
29. Rzepka, S. et al. **Characterization of self-heating in advanced VLSI
    interconnect lines based on thermal finite-element simulation**. *IEEE
    Transactions on Components, Packaging, and Manufacturing Technology A* 21
    (1998). DOI: <https://doi.org/10.1109/95.725203>.
30. Skadron, K. et al. **Temperature-aware microarchitecture**. ISCA (2003).
    DOI: <https://doi.org/10.1109/ISCA.2003.1206984>.
31. Ding, Y. et al. **Analytical model for Cu interconnect lifetimes under
    combined thermomigration and electromigration stress**. *IEEE TDMR* (2025).
    DOI: <https://doi.org/10.1109/TDMR.2025.3629672>.
32. Darveaux, R. **Effect of simulation methodology on solder joint crack growth
    correlation**. *IEEE Transactions on Components and Packaging Technologies*
    23 (2000). DOI: <https://doi.org/10.1109/6144.833046>.
33. Choi, S. et al. **Electromigration of Cu interconnects under AC, pulsed-DC
    and DC test conditions—ramifications on accelerated testing**. IRPS (2011).
    DOI: <https://doi.org/10.1109/IRPS.2011.5784570>.

### Radiation, field evidence, and fault tolerance

34. May, T. C., and Woods, M. H. **Alpha-particle-induced soft errors in dynamic
    memories**. *IEEE TED* 26 (1979). DOI:
    <https://doi.org/10.1109/T-ED.1979.19370>.
35. Ziegler, J. F., and Lanford, W. A. **Effect of cosmic rays on computer
    memories**. *Science* 206 (1979). DOI:
    <https://doi.org/10.1126/science.206.4420.776>.
36. Schroeder, B., Pinheiro, E., and Weber, W.-D. **DRAM errors in the wild: a
    large-scale field study**. SIGMETRICS (2009). DOI:
    <https://doi.org/10.1145/1555349.1555372>.
37. Schroeder, B., Lagisetty, R., and Merchant, A. **Flash reliability in
    production: the expected and the unexpected**. FAST (2016).
    <https://www.usenix.org/conference/fast16/technical-sessions/presentation/schroeder>.
38. Hsiao, M. Y. **A class of optimal minimum odd-weight-column SEC–DED codes**.
    *IBM Journal of Research and Development* 14 (1970). DOI:
    <https://doi.org/10.1147/rd.144.0395>.
39. Chen, C. L., and Hsiao, M. Y. **Error-correcting codes for semiconductor
    memory applications: a state-of-the-art review**. *IBM Journal of Research
    and Development* 28 (1984). DOI:
    <https://doi.org/10.1147/rd.282.0124>.
40. Saleh, A. M., Serrano, J. J., and Patel, J. H. **Reliability of scrubbing
    recovery techniques for memory systems**. *IEEE Transactions on Reliability*
    39 (1990). Primary record:
    <https://www.nokia.com/bell-labs/publications-and-media/publications/reliability-of-scrubbing-recovery-techniques-for-memory-systems/>.
41. Lyons, R. E., and Vanderkulk, W. **The use of triple-modular redundancy to
    improve computer reliability**. *IBM Journal of Research and Development* 6
    (1962). DOI: <https://doi.org/10.1147/rd.621.0200>.
42. Arlat, J. et al. **Fault injection for dependability validation: a methodology
    and some applications**. *IEEE TSE* 16 (1990). DOI:
    <https://doi.org/10.1109/32.44380>.
43. Mukherjee, S. S. et al. **A systematic methodology to compute the
    architectural vulnerability factors for a high-performance microprocessor**.
    MICRO (2003). DOI: <https://doi.org/10.1109/MICRO.2003.1253181>.

### Adaptive operation, approximate computing, and physical memory

44. Ernst, D. et al. **Razor: a low-power pipeline based on circuit-level timing
    speculation**. MICRO (2003). DOI:
    <https://doi.org/10.1109/MICRO.2003.1253179>.
45. Das, S. et al. **RazorII: in situ error detection and correction for PVT and
    SER tolerance**. *IEEE JSSC* 44 (2009). DOI:
    <https://doi.org/10.1109/JSSC.2008.2007145>.
46. Tschanz, J. W. et al. **Adaptive body bias for reducing impacts of die-to-die
    and within-die parameter variations on microprocessor frequency and leakage**.
    *IEEE JSSC* 37 (2002). DOI:
    <https://doi.org/10.1109/JSSC.2002.803949>.
47. Martin, S. M. et al. **Combined dynamic voltage scaling and adaptive body
    biasing for lower power microprocessors under dynamic workloads**. ICCAD
    (2002). DOI: <https://doi.org/10.1145/774572.774678>.
48. Kim, S. et al. **MATIC: learning around errors for efficient low-voltage
    neural network accelerators**. DATE (2018). DOI:
    <https://doi.org/10.23919/DATE.2018.8341970>.
49. Sampson, A. et al. **EnerJ: approximate data types for safe and general
    low-power computation**. PLDI (2011). DOI:
    <https://doi.org/10.1145/1993498.1993518>.
50. Ambrogio, S. et al. **Statistical fluctuations in HfOx resistive-switching
    memory: part I—set/reset variability**. *IEEE TED* 61 (2014). DOI:
    <https://doi.org/10.1109/TED.2014.2313889>.
51. Nminibapiel, D. M. et al. **Impact of RRAM read fluctuations on the
    program-verify approach**. *IEEE Electron Device Letters* 38 (2017). DOI:
    <https://doi.org/10.1109/LED.2017.2696002>.
52. Boniardi, M., and Ielmini, D. **Physical origin of the resistance drift
    exponent in amorphous phase change materials**. *Applied Physics Letters* 98
    (2011). DOI: <https://doi.org/10.1063/1.3599559>.
53. Ballmaier, S. et al. **Resistance drift of phase change materials beyond the
    power law**. *Advanced Electronic Materials* (2025). DOI:
    <https://doi.org/10.1002/aelm.202400905>.
54. Ambrogio, S. et al. **Equivalent-accuracy accelerated neural-network training
    using analogue memory**. *Nature* 558 (2018). DOI:
    <https://doi.org/10.1038/s41586-018-0180-5>.
55. Le Gallo, M. et al. **Mixed-precision in-memory computing**. *Nature
    Electronics* 1 (2018). DOI:
    <https://doi.org/10.1038/s41928-018-0054-8>.
56. Joshi, V. et al. **Accurate deep neural network inference using computational
    phase-change memory**. *Nature Communications* 11 (2020). DOI:
    <https://doi.org/10.1038/s41467-020-16108-9>.
57. Li, C. et al. **4K-memristor analog-grade passive crossbar circuit**. *Nature
    Communications* 12 (2021). DOI:
    <https://doi.org/10.1038/s41467-021-25455-0>.
58. Le Gallo, M. et al. **A 64-core mixed-signal in-memory compute chip based on
    phase-change memory for deep neural network inference**. *Nature Electronics*
    6 (2023). DOI: <https://doi.org/10.1038/s41928-023-01010-1>.
59. Chen, W.-H. et al. **CMOS-integrated memristive non-volatile computing-in-
    memory for AI edge processors**. *Nature Electronics* 2 (2019). DOI:
    <https://doi.org/10.1038/s41928-019-0288-0>.
60. Rasch, M. J. et al. **Hardware-aware training for large-scale and diverse deep
    learning inference workloads using in-memory computing-based accelerators**.
    *Nature Communications* 14 (2023). DOI:
    <https://doi.org/10.1038/s41467-023-40770-4>.
61. Huo, R. et al. **Endurance characteristics of phase change memory cells**.
    *Journal of Semiconductors* 37 (2016). DOI:
    <https://doi.org/10.1088/1674-4926/37/5/054009>.
62. Qureshi, M. K. et al. **Enhancing lifetime and security of PCM-based main
    memory with Start-Gap wear leveling**. MICRO (2009). DOI:
    <https://doi.org/10.1145/1669112.1669117>.
63. Wang, Z. et al. **Dynamic wear leveling for phase-change memories with
    endurance variations**. *IEEE TVLSI* 23 (2015). DOI:
    <https://doi.org/10.1109/TVLSI.2014.2350073>.

### Lifecycle inventories

64. Williams, E. D., Ayres, R. U., and Heller, M. **The 1.7 kilogram microchip:
    energy and material use in the production of semiconductor devices**.
    *Environmental Science & Technology* 36 (2002). DOI:
    <https://doi.org/10.1021/es025643o>.
65. Krishnan, N. et al. **A hybrid life cycle inventory of nano-scale
    semiconductor manufacturing**. *Environmental Science & Technology* 42
    (2008). DOI: <https://doi.org/10.1021/es071174k>.
66. Boyd, S. B. et al. **Deconstructing energy use in microelectronics
    manufacturing: an experimental case study of a MEMS fabrication facility**.
    *Environmental Science & Technology* 44 (2010). DOI:
    <https://doi.org/10.1021/es902388b>.

## Audit disposition

- **Audit-local claims:** 52 (`SEMI-001`–`SEMI-052`).
- **Status counts:** 47 established; 5 plausible; 0 speculative; 0 disputed.
- **Decisive equal-budget experiments:** 10 (`E-SEMI-01`–`E-SEMI-10`).
- **Negative results and construct traps:** 16.
- **Bibliography entries:** 66.
- **New principle:** none.
- **New candidate:** none.
- **Durable output:** mission-profile-qualified degradation and recovery
  evaluation contract, with equal-budget fixtures for hierarchical variation,
  mechanism-specific extrapolation, sparse electrothermal wear, fault geometry,
  voltage authority, approximation containment, analog crossover, nonideality
  transfer, wear placement, and lifecycle policy.

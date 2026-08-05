# Olfaction, chemical sensing, and plume tracking: primary-source audit

- **Audit date:** 2026-08-05
- **Scope:** receptor and taste coding; olfactory-bulb gain and normalization;
  concentration, identity, adaptation, temporal coding, and active sniffing;
  sparse piriform representations; associative learning and valence; mixtures,
  masking, and source localization; turbulent plume search in animals and
  robots; electronic noses; calibration, drift, poisoning, humidity, and
  analytical-chemistry nulls; safety, exposure, and lifecycle energy
- **Evidence rule:** every claim is audit-local and bounded to the cited
  experiment, model, method, or standard. Imported summaries and biological
  analogies are not evidence. A biological mechanism receives engineering
  credit only after an equal-budget comparison with the strongest applicable
  sensing, signal-processing, analytical-chemistry, estimation, and control
  stack.
- **Promotion state:** `OLFACT-` claims only. This audit promotes no stable
  claim, principle, candidate, or fixture.

## Executive finding

Chemical sensing is not a static vector-classification problem. The measured
signal is jointly produced by source release, turbulent transport, chemistry,
surface exchange, the sampling trajectory, pump or sniff dynamics, chamber and
sensor response, temperature and humidity, calibration state, sensor age, and
the decision policy. In animals, receptor populations, normalization,
adaptation, respiration-locked timing, sparse distributed cortical activity,
learning, and action transform that signal again. In instruments, the
corresponding operations already have mature alternatives: calibrated sensor
arrays, chromatography, mass spectrometry, ion-mobility and direct-inlet mass
spectrometry, dynamic sensor models, drift correction, probabilistic source
estimation, active search, and abstaining decision systems.

The strongest bounded findings are:

1. Mammalian olfactory receptors use combinatorial population codes in the
   studied systems, and those codes change with concentration. That is evidence
   for distributed identity inference, not a universal coding rule for all
   chemosensation: mammalian sweet and umami pathways provide a scoped
   labelled-line counterexample.
2. Normalization, recurrent inhibition, temporal patterning, and adaptation can
   stabilize some identity information across concentration or history, but no
   cited mechanism makes identity concentration-free under arbitrary mixtures,
   saturation, receptor coverage, or sensor drift.
3. Sniffing and locomotion are measurement actions. Millisecond-scale timing,
   bilateral correlation, serial sampling, and wind sensing can matter, yet
   their value depends on species, plume regime, range, and task. Stereo,
   continuous steering, and smooth-gradient ascent are not universal solutions.
4. Turbulent plumes are intermittent on behavioral timescales. Encounter
   timing and blanks can be more informative than a slowly converged mean;
   reactive surge--cast policies, Bayesian source estimators, infotaxis, and
   compact temporal-memory policies are therefore required nulls.
5. Piriform representations are distributed and can be sparse, but sparsity is
   concentration- and protocol-dependent and the represented ensemble can
   drift over weeks. Sparse activity does not establish sparse hardware,
   stable addressing, low energy, or superior learning.
6. Innate and learned valence can be dissociated experimentally. Rapid reward
   coding in one study appeared in olfactory tubercle within minutes but not as
   an explicit posterior-piriform code, so “piriform rapidly assigns value” is
   not a safe architectural claim.
7. Cross-reactive electronic noses are established, but their labels remain
   conditional on the analyte panel, calibration gases, concentration range,
   device batch, temperature, humidity, contamination, ageing, sampling
   apparatus, and data split. Multi-year drift and benchmark confounding are
   first-order problems.
8. GC--MS, sorbent or canister sampling, PTR--MS, ion-mobility spectrometry,
   calibrated libraries, and certified gas mixtures are mature nulls. They do
   not eliminate sampling loss, co-elution, library ambiguity, interferences,
   or uncertainty; they make those failure modes testable.
9. Odor detection, chemical identification, concentration estimation, source
   localization, pleasantness, hazard, and exposure are different outcomes.
   Odor threshold is not a safety threshold.
10. The residual is an **operator-, action-, history-, calibration-, and
    exposure-qualified chemical observation contract**. That residual is a
    domain instantiation of existing `P-` bundles and Candidates 007, 012, and
    014, with Fixtures F-005 and F-009 supplying most of the benchmark logic.
    It is not yet a new principle or fixture.

## Outcome and construct firewall

| Construct | Literal question | Minimum measurement | Invalid substitution |
| --- | --- | --- | --- |
| presence | did a declared analyte exceed a detection decision boundary? | target-present and target-absent trials, false alarms, limit of detection, matrix and protocol | sensor voltage above an arbitrary threshold |
| chemical identity | which molecular species or registered class produced the evidence? | calibrated confusion set, standards, retention or spectral evidence, uncertainty | odor name, valence, or one library hit |
| concentration | what amount fraction or mass/amount concentration occupied a declared support? | `mol/mol`, `mol/m^3`, or `kg/m^3`, temperature, pressure, time support, calibration and uncertainty | raw resistance, peak area, or perceived intensity |
| flux or release rate | how much material crossed a surface or left a source per time? | `mol/(m^2 s)` or `mol/s`, geometry and uncertainty | local concentration |
| mixture composition | which components and proportions were present? | component-wise estimates, recovery, interferents, censoring and uncertainty | dominant label or perceptual similarity |
| odor identity | which learned perceptual category was reported? | psychophysical or behavioral confusion matrix under a declared protocol | molecular identity |
| intensity | what perceptual magnitude was reported? | psychometric function and uncertainty | concentration alone |
| valence | was the odor approached, avoided, or rated under a context? | choice/rating, context, learning history and uncertainty | toxicity, identity, or detection |
| detection threshold | at what concentration did performance reach a registered criterion? | psychometric curve, criterion, background and matrix | occupational limit or “safe” level |
| adaptation | how did receptor or sensor response change during continued/repeated stimulation? | input-locked response trajectory and recovery | behavioral habituation or hardware drift |
| habituation | how did response to repeated presentations change and generalize? | behavior or circuit response across intervals and controls | receptor adaptation |
| masking | how did a masker change target detection or identification? | threshold shift or confusion change over mixture composition | mixture concentration or overlap alone |
| plume encounter | when did the moving receiver cross a declared concentration/detection support? | synchronized fast ground truth, pose, sensor response and threshold | a slow sensor peak |
| source direction | which bearing was inferred? | angular error and false declarations | higher concentration at one instant |
| source position | which location was inferred? | position error in metres, coverage/calibration, stopping rule | plume contact or direction |
| source attribution | which physical emitter generated the sampled material? | competing-source model, transport evidence and posterior calibration | chemical identity alone |
| hazard | can the substance cause a specified adverse effect under a route and condition? | toxicological endpoint, route, population and authoritative limit | odor intensity or aversion |
| exposure | what time-integrated external concentration reached the subject? | concentration-time profile with units, route and uncertainty | sensor duty cycle or odor detection |
| absorbed dose | how much material entered the organism or target compartment? | dosimetry/biomonitoring model and uncertainty | external exposure |
| sparse activity | what fraction of units/events was active in a declared bin? | active fraction, bin width, information and task error | low electrical energy |
| active sensing | did a chosen sniff, pump, heater, valve, or movement improve a target? | causal action contrast with matched evidence, dose, latency, risk, and energy | correlation between movement and success |
| lifecycle efficiency | what protected outcome was obtained for all resources? | quality--risk--latency vector plus joules, consumables, calibration, replacements, people, and embodied burden | sensor or inference power alone |

## Quantitative chemical-sensing contract

### Episode and operator identity

For episode $e$, preserve the versioned record

$$
\mathcal C_e=(S_e,X_e,A_e,O_e,K_e,H_e,T_e,U_e,B_e),
$$

where:

- $S_e$ records source identities, release rates in `mol/s`, mixture,
  temperature in kelvins, pressure in pascals, phase, geometry, and source
  motion in `m/s`;
- $X_e$ records the three-dimensional domain, boundaries and surfaces, airflow
  $\mathbf u$ in `m/s`, turbulence statistics, temperature, pressure, relative
  humidity as a dimensionless fraction, background chemicals, and history;
- $A_e$ records receiver pose and every commanded and realized acquisition
  action: motion, sniff or pump waveform, volumetric flow in `m^3/s`, valve,
  chamber, preconcentration, heater temperature and dwell, purge, and query;
- $O_e$ is the physical observation operator: inlet and tubing, sorption,
  transport delay, chamber volume, sensor cross-sensitivity, response and
  recovery kernels, saturation, quantization, selection, preprocessing, and
  time support;
- $K_e$ is calibration identity: reference-gas composition and uncertainty,
  instrument/device/batch identity, response model, blank, zero/span history,
  temperature/humidity compensation, maintenance, age, poisoning indicators,
  and validity interval;
- $H_e$ records prior exposure, adaptation, contamination, storage, cleaning,
  training, and previous actions with timestamps;
- $T_e$ is the literal target, deadline in seconds, loss/utility, abstention and
  safety policy;
- $U_e$ is the independent unit: molecule, injection, vial, sensor, device,
  batch, day, source, plume realization, site, animal, or subject; and
- $B_e$ is the common ceiling in samples, episodes, labelled standards, sensor
  channels, aperture, actions, metres travelled, seconds, bytes, compute,
  hyperparameter trials, person-hours, joules, consumables, emissions,
  exposures, calibration, replacement, and embodied hardware.

For method $q$ and literal outcome $k$,

$$
Q_{q,k}(\mathcal C)=
\mathbb E\!\left[Y_k\mid do(q),\mathcal C\right],
$$

where $Y_k$ retains its registered physical or decision unit. A gain cannot be
attributed to $q$ if methods receive different inlet dynamics, calibration,
concentration ranges, plume seeds, wind, source-off trials, motion authority,
sensor age, or training and tuning budgets.

### Transport, chemistry, and source release

For analyte $i$, a continuum starting model is

$$
\frac{\partial c_i}{\partial t}
+\mathbf u\!\cdot\!\nabla c_i
=\nabla\!\cdot(D_i\nabla c_i)-k_i c_i+q_i(\mathbf x,t),
$$

where $c_i(\mathbf x,t)$ is amount concentration in `mol/m^3`, position
$\mathbf x$ is in metres, time $t$ is in seconds, velocity $\mathbf u$ is in
`m/s`, molecular/effective diffusivity $D_i$ is in `m^2/s`, first-order loss
$k_i$ is in `1/s`, and volumetric source $q_i$ is in `mol/(m^3 s)`. This
equation has units `mol/(m^3 s)` throughout. Turbulent closure, buoyancy,
multiphase droplets, reactive chemistry, adsorption/desorption, terrain,
thermal stratification, and boundary fluxes must be added when relevant; an
effective $D_i$ cannot silently absorb every omitted process.

For an ideal-gas amount fraction $x_i$ (for example `µmol/mol`, often written
`ppmv`), the corresponding mass concentration is

$$
\rho_i=x_i\frac{P M_i}{R T},
$$

where $\rho_i$ is in `kg/m^3`, pressure $P$ is in pascals, molar mass $M_i$ is
in `kg/mol`, the molar gas constant $R=8.314462618\ \mathrm{J/(mol\,K)}`,
temperature $T$ is in kelvins, and $x_i$ is dimensionless. A ppm-to-`mg/m^3`
conversion without $M_i$, $T$, and $P$ is incomplete.

### Dynamic, cross-sensitive observation

For sensor channel $m$ sampled at $t_n$ while following trajectory
$\mathbf x_m(t)$, write

$$
y_{m,n}=g_{m,v}\!\left(
\sum_i\int_0^\infty
h_{m,i,v}(\tau;\mathbf z_n)
c_i(\mathbf x_m(t_n-\tau),t_n-\tau)\,d\tau,
\mathbf z_n\right)+\epsilon_{m,n},
$$

where $y_{m,n}$ is in the sensor's calibrated output unit, $v$ is the operator
and calibration version, $h_{m,i,v}$ is a causal response kernel in `1/s`,
$g_{m,v}$ is a possibly nonlinear mapping, $\tau$ is delay in seconds,
$\mathbf z_n$ contains temperature, humidity, pressure, flow, heater state,
interferents, age and poisoning state, and $\epsilon_{m,n}$ is error in output
units. The integral returns `mol/m^3`; $g$ maps it to output. Static vectors are
only justified after response, recovery, hysteresis, saturation, and support
have been tested.

A calibrated inverse estimate is a distribution, not a label:

$$
p(\mathbf c_t,\mathbf s\mid y_{1:t},a_{1:t},\mathcal C_e),
$$

where $\mathbf c_t$ is the concentration field, $\mathbf s$ is source state,
$y_{1:t}$ is the observation history, and $a_{1:t}$ is the realized sampling
and motion history. The posterior is meaningful only under the registered
operator, prior support, likelihood, and calibration checks.

### Active sampling and source search

An acquisition policy chooses

$$
a_t=\pi(y_{1:t},a_{1:t-1},b_t),
$$

where $a_t$ may include receiver motion in `m/s`, sniff/pump flow in `m^3/s`,
heater power in watts, valve or preconcentrator state, purge, declaration, or
abstention; $b_t$ is a calibrated belief state. A value-of-information action
can be compared through

$$
\operatorname{EVI}(a_t)=
\min_d\mathbb E\!\left[L(d,\theta)\mid H_t\right]
-\mathbb E_{Y\sim p(\cdot\mid H_t,a_t)}\!\left[
\min_d\mathbb E\!\left[L(d,\theta)\mid H_t,a_t,Y\right]\right]
-C(a_t),
$$

where $H_t=(y_{1:t},a_{1:t-1})$ is the causal history, $Y$ is the possible next
observation under action $a_t$, $d$ is a decision, $\theta$ is the target state,
$L$ is loss in a declared unit, and $C(a_t)$ converts energy, latency, travel,
exposure, wear, and opportunity cost into that same utility unit. Positive
values favor the action. Infotaxis, particle-filter belief control, model
predictive control, finite-state surge--cast, and history-aware RL are nulls,
not synonyms for biology.

### Exposure, safety, and complete energy

External inhalation exposure to analyte $i$ along a path is

$$
E_i=\int_0^T \rho_i(\mathbf x(t),t)\,dt,
$$

where $E_i$ is in `kg s/m^3` (often reported as `mg min/m^3`), $\rho_i$ is
mass concentration in `kg/m^3`, and $T$ is seconds. Exposure is not absorbed
dose or risk. Route, breathing/pump rate, toxicokinetics, susceptible
population, averaging time, ceiling, short-term limit, and immediately
dangerous concentration remain separate.

Complete episode energy is

$$
E_{\mathrm{episode}}=
E_{\mathrm{motion}}+E_{\mathrm{pump}}+E_{\mathrm{heater}}+
E_{\mathrm{separation}}+E_{\mathrm{ionization}}+E_{\mathrm{compute}}+
E_{\mathrm{network}}+E_{\mathrm{facility}}+E_{\mathrm{maintenance}},
$$

with every term in joules. Lifecycle reporting additionally amortizes embodied
sensor/instrument/robot energy, carrier and calibration gases, sorbents,
columns, dopants, filters, cleaning, poisoned-sensor and pump replacement,
storage, human work, and disposal over accepted service. Event sparsity,
low inference power, or organism metabolism cannot substitute for that sum.

## Strongest mature null stack

Any proposed biologically inspired system must be compared with the applicable
composition below, not with one weak classifier:

1. **Sampling and standards:** passivated canisters, active sorbent tubes,
   filters, blanks, duplicates, certified gravimetric or volumetric gas
   mixtures, zero/span checks, recovery studies, traceable clocks and flow.
2. **Separation and identification:** GC--MS, GC--FID/PID, GC×GC where needed,
   retention indices, authentic standards, deconvolution, curated spectral
   libraries, and uncertainty-qualified identification.
3. **Fast/direct instruments:** PTR--MS or SIFT--MS, ion-mobility/FAIMS,
   electrochemical cells, photoionization detectors, tunable-diode or infrared
   spectroscopy, and targeted colorimetric chemistry, each within its support.
4. **Cross-reactive arrays:** MOX, conductive-polymer, QCM/SAW, electrochemical,
   optical/colorimetric, or hybrid arrays with controlled temperature,
   humidity, concentration, flow, batch, interferents, poisoning and ageing.
5. **Signal processing:** dynamic-system identification, baseline correction,
   deconvolution, filtering, peak detection/integration, PCA/PLS, LDA/QDA,
   calibrated logistic models, SVMs, trees/ensembles, Bayesian models, domain
   adaptation, novelty detection, selective prediction, and abstention.
6. **Transport and state estimation:** registered CFD or measured-plume
   operators, Kalman/particle filters, Gaussian-process plume models,
   uncertainty propagation, observability analysis, and source-off checks.
7. **Search and control:** random walk, chemotaxis/tropotaxis, wind-only
   anemotaxis, surge--cast/zigzag finite-state policies, infotaxis,
   particle-filter belief control, MPC/POMDP, and matched-memory RL.
8. **Assurance and safety:** detector performance standards, method blanks,
   calibration validity, out-of-support and poisoning alarms, occupational
   exposure limits, fail-safe actions, independent confirmation, and complete
   audit trail.
9. **Resource accounting:** identical sensors, aperture, samples, source/plume
   realizations, labelled standards, training interactions, search and tuning,
   compute, action rate, motion, latency, false-declaration policy, human work,
   consumables, maintenance, and lifecycle energy.

## Audit-local evidence claims

### OLFACT-001 — receptor families provide a large sensing basis, not one detector per odor

- **Status:** established, for the mammalian receptor family and expression
  logic studied; receptor count and repertoire are species-specific.
- **Primary source:** [Buck and Axel (1991)](https://doi.org/10.1016/0092-8674%2891%2990418-X).
- **Observation:** the work identified a large multigene family encoding
  candidate odorant receptors and established a molecular basis for a broad
  population sensor repertoire.
- **Boundary:** a large basis does not by itself specify the downstream code,
  guarantee coverage of arbitrary chemicals, or imply a useful artificial
  array without calibrated response functions.

### OLFACT-002 — mammalian odor coding is combinatorial in the studied receptor panel

- **Status:** established within the assayed receptors and odorants.
- **Primary source:** [Malnic et al. (1999)](https://doi.org/10.1016/S0092-8674%2800%2980581-4).
- **Observation:** individual receptors responded to multiple odorants and
  individual odorants activated multiple receptors, producing combinatorial
  receptor patterns.
- **Boundary:** the result does not establish arbitrary open-world chemical
  identification, and it does not make every receptor channel equally
  informative or independent.

### OLFACT-003 — receptor codes vary with concentration

- **Status:** established within the same scoped receptor experiments.
- **Primary source:** [Malnic et al. (1999)](https://doi.org/10.1016/S0092-8674%2800%2980581-4).
- **Observation:** increasing concentration recruited or altered receptor
  responses, so the population pattern was not a concentration-free identity
  token.
- **Boundary:** a classifier tested at one concentration grid cannot claim
  concentration invariance; concentration and identity must be crossed in the
  split and scored separately.

### OLFACT-004 — chemosensation does not have one universal population-code architecture

- **Status:** established as a scoped counterexample in mammalian sweet and
  umami taste pathways.
- **Primary source:** [Zhao et al. (2003)](https://doi.org/10.1016/S0092-8674%2803%2900844-4).
- **Observation:** receptor deletion and receptor-expression manipulations
  supported dedicated taste-cell pathways whose behavioral meaning depended
  strongly on the activated cell class.
- **Boundary:** this does not prove that all taste is labelled-line coding; it
  blocks transferring one olfactory coding slogan to every chemical sense.

### OLFACT-005 — divisive normalization can arise from pooled receptor input

- **Status:** established in the Drosophila antennal-lobe preparation studied;
  cross-species implementation is plausible, not established.
- **Primary source:** [Olsen, Bhandawat, and Wilson (2010)](https://doi.org/10.1016/j.neuron.2010.04.009).
- **Observation:** lateral inhibition scaled with total olfactory receptor
  neuron activity and divisively normalized projection-neuron responses while
  making them more transient.
- **Boundary:** pooled inhibition can discard absolute intensity and can fail
  under saturation, novel interferents, or nonstationary sensor gain; compare
  with explicit calibrated normalization and robust scaling.

### OLFACT-006 — olfactory-bulb transformations can improve concentration-tolerant identity

- **Status:** established for the imaged mouse bulb and odor panel.
- **Primary source:** [Storace and Cohen (2017)](https://doi.org/10.1038/s41467-017-00036-2).
- **Observation:** comparing input and output representations implicated the
  bulb transformation in greater concentration invariance.
- **Boundary:** “greater invariance” is not independence from concentration,
  mixtures, adaptation, sampling waveform, or receptor saturation.

### OLFACT-007 — temporal population trajectories can retain identity across intensity

- **Status:** established in the locust preparation and tested odor set.
- **Primary source:** [Stopfer, Jayaraman, and Laurent (2003)](https://doi.org/10.1016/j.neuron.2003.08.011).
- **Observation:** projection-neuron population trajectories grouped by odor
  identity across concentrations while downstream Kenyon cells exhibited
  heterogeneous concentration tolerance.
- **Boundary:** this is evidence for population-time structure, not a guarantee
  that one invariant embedding or fixed threshold will work across species and
  chemical regimes.

### OLFACT-008 — recurrent piriform circuitry can support concentration invariance

- **Status:** established for the mouse circuit perturbations and odors tested.
- **Primary source:** [Bolding and Franks (2018)](https://doi.org/10.1126/science.aat6904).
- **Observation:** recurrent circuitry and inhibition transformed bulb input
  into cortical identity representations that were more stable across
  concentration.
- **Boundary:** recurrent computation has latency and energy costs and must beat
  feed-forward normalization, calibrated generative models, and explicit
  concentration-conditioned classifiers at equal budget.

### OLFACT-009 — identity and intensity can be complementary population outputs

- **Status:** established for the mouse bulb and piriform recordings studied.
- **Primary source:** [Bolding and Franks (2017)](https://doi.org/10.7554/eLife.22630).
- **Observation:** bulb output retained strong concentration information while
  piriform activity supported a more concentration-tolerant identity code.
- **Boundary:** the two outcomes should remain jointly measured; suppressing
  intensity is harmful when concentration is itself the task or safety signal.

### OLFACT-010 — respiration supplies a mechanosensory timing reference

- **Status:** established in the recorded mouse olfactory system.
- **Primary source:** [Iwata et al. (2017)](https://doi.org/10.1016/j.neuron.2017.11.008).
- **Observation:** airflow-related mechanosensory input organized sniff-phase
  coding, and odor-driven phase shifts could remain informative across the
  tested concentrations.
- **Boundary:** timing relative to a sniff is operator state; removing the sniff
  waveform or using an unaligned clock changes the data-generating process.

### OLFACT-011 — the bulb can explicitly encode concentration changes between inhalations

- **Status:** established in the studied mouse recordings.
- **Primary source:** [Parabucki et al. (2019)](https://doi.org/10.1523/ENEURO.0396-18.2019).
- **Observation:** mitral/tufted activity represented changes in odor
  concentration from one inhalation to the next, not only instantaneous level.
- **Boundary:** differencing can amplify calibration noise and sensor drift;
  absolute, relative, and derivative cues require separate ablations.

### OLFACT-012 — receptor adaptation includes calcium feedback onto transduction

- **Status:** established in intact olfactory receptor cells under the studied
  stimulation protocol.
- **Primary source:** [Kurahashi and Menini (1997)](https://doi.org/10.1038/385725a0).
- **Observation:** calcium-dependent feedback modulated the cyclic-nucleotide-
  gated channel and contributed to response adaptation.
- **Boundary:** receptor adaptation is not synonymous with cortical habituation,
  perceptual constancy, sensor baseline correction, or multi-year device drift.

### OLFACT-013 — removing a calcium-modulated channel subunit impairs adaptation

- **Status:** established in the CNGA4 knockout studied.
- **Primary source:** [Munger et al. (2001)](https://doi.org/10.1126/science.1063224).
- **Observation:** loss of CNGA4 disrupted calcium--calmodulin-dependent
  olfactory adaptation, providing a causal molecular perturbation.
- **Boundary:** an engineering analogue must identify the controlled state and
  benefit; generic gain decay is not justified by the molecular result.

### OLFACT-014 — receptor current and spiking can have different concentration ranges

- **Status:** established in isolated mouse olfactory receptor neurons.
- **Primary source:** [Reisert and Matthews (2001)](https://doi.org/10.1111/j.1469-7793.2001.0113m.x).
- **Observation:** receptor current varied over a wider concentration range
  than the relatively steep spike-output relation.
- **Boundary:** transduction and event generation must be modelled separately;
  a sparse spike stream can hide graded input and saturation.

### OLFACT-015 — habituation depends on presentation history and generalizes selectively

- **Status:** established for the mouse behavioral and bulb protocols studied.
- **Primary source:** [Chaudhury et al. (2010)](https://doi.org/10.1037/a0020293).
- **Observation:** habituation depended on stimulus duration and intertrial
  interval and generalized more to related odorants.
- **Boundary:** “memory” must record interval, duration, similarity and recovery;
  a lower repeated response alone cannot identify adaptation, habituation,
  fatigue, motor change, or sensor drift.

### OLFACT-016 — sniff rate is rapidly and task-dependently controlled

- **Status:** established in six rats performing odor-mixture discrimination;
  source-localization benefit is untested by this paper.
- **Primary source:** [Kepecs, Uchida, and Mainen (2007)](https://doi.org/10.1152/jn.00071.2007).
- **Observation:** breathing ranged roughly from 2 to 12 Hz and could shift
  within about one cycle; difficult-trial accuracy was associated with entering
  a narrower high-rate range.
- **Boundary:** an active-sniff policy must beat fixed-rate and dose-matched
  acquisition while charging pump or respiratory cost.

### OLFACT-017 — sniffing changes the peripheral-to-bulb filter

- **Status:** established in the studied rat/mouse olfactory preparation.
- **Primary source:** [Verhagen et al. (2007)](https://doi.org/10.1038/nn1892).
- **Observation:** changing sniff frequency altered how odor input was filtered
  and represented in the bulb.
- **Boundary:** samples collected under different sniff or pump waveforms are
  not exchangeable unless the operator is identified or corrected.

### OLFACT-018 — early inhalation-locked activity can carry rapid odor information

- **Status:** established in the recorded mouse olfactory system and tested
  odors.
- **Primary source:** [Cury and Uchida (2010)](https://doi.org/10.1016/j.neuron.2010.09.040).
- **Observation:** transient inhalation-coupled activity carried substantial
  odor information within roughly 100 ms and retained structure across faster
  and slower sniffing.
- **Boundary:** the result is not a universal 100-ms identification guarantee;
  latency must include transport, sensor response, decision and action.

### OLFACT-019 — animals can behaviorally use millisecond-scale sniff phase

- **Status:** established in the mouse timing-discrimination experiment.
- **Primary source:** [Smear et al. (2011)](https://doi.org/10.1038/nature10521).
- **Observation:** mice reported relative timing differences on the order of
  10 ms within the sniff cycle.
- **Boundary:** timing precision is task-, apparatus-, concentration-, and
  species-specific; it does not imply that slow chemical sensors contain such
  information.

### OLFACT-020 — bulb response timing can tile the sniff cycle precisely

- **Status:** established in awake mouse mitral/tufted recordings.
- **Primary source:** [Shusterman et al. (2011)](https://doi.org/10.1038/nn.2877).
- **Observation:** odor responses were sniff-locked and distributed over the
  cycle with reported average timing jitter near 12 ms.
- **Boundary:** a precise neural timestamp cannot recover plume fluctuations
  removed by a slow inlet or sensor; end-to-end bandwidth is the relevant limit.

### OLFACT-021 — serial sampling can suffice in a noisy airborne gradient task

- **Status:** established for the tested mouse task; not established for
  long-range fully turbulent plumes.
- **Primary source:** [Findley et al. (2021)](https://doi.org/10.7554/eLife.58523).
- **Observation:** mice used concentration-gradient cues without requiring
  stereo olfaction, while respiration and nose movements were tightly coupled.
- **Boundary:** this is an explicit null against universal stereo necessity;
  bilateral, serial and wind cues must be crossed by range and plume regime.

### OLFACT-022 — bilateral temporal correlation can reveal odor-motion direction

- **Status:** established in Drosophila fictive-odor virtual reality and a
  replay of measured plume dynamics; generality beyond that system is open.
- **Primary source:** [Kadakia et al. (2022)](https://doi.org/10.1038/s41586-022-05423-4).
- **Observation:** flies used bilateral timing structure; reversing plume time
  while preserving stationary statistics reduced source-reaching success.
- **Boundary:** sensor spacing, sample rate, wind and body motion constrain the
  cue. Compare lag correlation with instantaneous bilateral gradient and
  unilateral-history nulls.

### OLFACT-023 — turbulent odor detections are intermittent, not a smooth gradient

- **Status:** established for passive-scalar regimes through theory tested
  against simulation, laboratory and field observations.
- **Primary source:** [Celani, Villermaux, and Vergassola (2014)](https://doi.org/10.1103/PhysRevX.4.041015).
- **Observation:** whiff intensity, duration and blank spacing have structured,
  heavy-tailed statistics.
- **Boundary:** the theory's transport assumptions must be registered; reactive,
  buoyant, depositing or multiphase chemicals can require different operators.

### OLFACT-024 — plume truth requires faster measurements than many gas sensors provide

- **Status:** established as a fluid-measurement result in a turbulent boundary
  layer.
- **Primary source:** [Crimaldi and Koseff (2001)](https://doi.org/10.1007/s003480000263).
- **Observation:** planar laser-induced fluorescence resolved fine spatial
  structure and point measurements reached kilohertz temporal resolution.
- **Boundary:** a controller evaluated only on its slow sensor cannot reveal
  how much failure comes from transport, sensor convolution, or policy.

### OLFACT-025 — field plume sparsity changes with environment

- **Status:** established for the measured open-field and forest tracer plumes.
- **Primary source:** [Murlis, Willis, and Cardé (2000)](https://doi.org/10.1046/j.1365-3032.2000.00176.x).
- **Observation:** signal occupied only about one fifth of sampled time in both
  environments while forest gaps were markedly longer; large tracer spikes did
  not map consistently to electroantennogram amplitude.
- **Boundary:** equal elapsed time is not equal evidence. Report encounter count,
  gap distribution, environment and sensor transfer function.

### OLFACT-026 — intuitive burst summaries can be poor directional cues

- **Status:** established negative result in the measured open-channel plume.
- **Primary source:** [Webster and Weissburg (2001)](https://doi.org/10.4319/lo.2001.46.5.1034).
- **Observation:** time-averaged concentration converged too slowly for the
  studied foraging horizon; burst rise slope required unrealistically rapid
  sampling, and burst magnitude/duration varied only mildly with source range.
- **Boundary:** claims of gradient ascent require held-out evidence above
  history-only, encounter-frequency, wind-only and transport-model nulls.

### OLFACT-027 — repeated odor onsets and offsets can sustain upwind tracking

- **Status:** established in the studied moth wind-tunnel behavior.
- **Primary source:** [Vickers and Baker (1994)](https://doi.org/10.1073/pnas.91.13.5756).
- **Observation:** filamentous pheromone presentation supported repeated upwind
  responses on contact and crosswind casting after loss.
- **Boundary:** the result supports an event-triggered controller null; it does
  not establish that one surge--cast rule is optimal across species, sensors,
  wind, terrain or source dynamics.

### OLFACT-028 — odor ON, odor OFF and wind can drive distinct motor transforms

- **Status:** established in the controlled Drosophila walking assay; the fitted
  controller is a model of that setting.
- **Primary source:** [Álvarez-Salvado et al. (2018)](https://doi.org/10.7554/eLife.37815).
- **Observation:** odor onset evoked upwind movement, offset evoked local search,
  and antennal mechanosensation supplied wind direction; removing wind terms
  nearly eliminated source finding in the reported simulation.
- **Boundary:** cross wind, ON/OFF memory, and odor level need separate ablations;
  trajectory fit alone is not evidence of the unique causal policy.

### OLFACT-029 — irregular plumes can favor event-biased stochastic decisions

- **Status:** established for the large-arena walking-fly experiment.
- **Primary source:** [Demir et al. (2020)](https://doi.org/10.7554/eLife.57524).
- **Observation:** in complex plumes, encounter timing biased stereotyped
  stochastic saccades and walk/stop transitions; continuous orientation and
  speed modulation characterized more regular conditions, not the irregular
  condition.
- **Boundary:** this is a negative result against universal continuous control,
  not proof that stochastic event policies dominate in every plume.

### OLFACT-030 — plume contact can alter locomotion without proving an optimal policy

- **Status:** established correlation in a freely moving mouse wind-tunnel
  experiment; causal utility remains open.
- **Primary source:** [Tariq et al. (2021)](https://doi.org/10.1523/ENEURO.0285-20.2020).
- **Observation:** a head-mounted ethanol sensor, validated against a PID to at
  least 15 Hz, registered contacts followed by lower head and body speed.
- **Boundary:** speed clamp or yoked replay is required before treating slowing
  as an information-maximizing or energy-optimal strategy.

### OLFACT-031 — infotaxis is a mature information-search null

- **Status:** established as a model-based search method; broad empirical
  optimality is not established.
- **Primary source:** [Vergassola, Villermaux, and Shraiman (2007)](https://doi.org/10.1038/nature05464).
- **Observation:** infotaxis selects motion by expected entropy reduction under
  sporadic encounters and was demonstrated numerically with mixing-flow data.
- **Boundary:** comparisons must equalize plume-model and prior access. A policy
  cannot claim advantage by receiving a better likelihood or source prior.

### OLFACT-032 — fused gas and wind sensing can localize a source robotically

- **Status:** established as a narrow wind-tunnel proof of concept.
- **Primary source:** [Ishida et al. (1994)](https://doi.org/10.1016/0924-4247%2894%2900829-9).
- **Observation:** a movable probe with gas and anemometric sensors tracked a
  source in a controlled wind tunnel.
- **Boundary:** one source and one facility do not establish open-world search;
  gas-only, wind-only, fused and randomized-wind policies need identical plume
  seeds and declaration criteria.

### OLFACT-033 — transient processing can compensate partly for slow MOX recovery

- **Status:** established in one two-metre robot experiment.
- **Primary source:** [Ishida et al. (2005)](https://doi.org/10.1109/JSEN.2004.839597).
- **Observation:** relative output changes and onset/recovery logic supported
  reported source tracking despite semiconductor recovery longer than 60 s.
- **Boundary:** compare thresholds, derivatives and explicit dynamic-state
  deconvolution under drift, humidity, source-off trials and equal false alarms.

### OLFACT-034 — a simpler reactive search can beat infotaxis on path length

- **Status:** established negative/comparative result in the reported
  robot/cyborg trials; the benchmark had unequal and filtered trial counts.
- **Primary source:** [Voges et al. (2014)](https://doi.org/10.1371/journal.pcbi.1003861).
- **Observation:** reactive off-zigzag produced shorter successful trajectories
  at similar success in some conditions, whereas infotaxis was less
  path-efficient but more robust when pheromone was absent.
- **Boundary:** count source-off arrivals as false positives and preregister
  equal horizons, trials, boundary handling and compute before ranking policies.

### OLFACT-035 — geometry can change which modular search policy works best

- **Status:** established in a two-scenario computational/indoor comparison,
  not as universal ranking.
- **Primary source:** [Li et al. (2020)](https://doi.org/10.1016/j.buildenv.2020.106746).
- **Observation:** a simple casting-plus-surge combination performed best
  overall among 16 tested algorithms, while a wall-aware behavior improved the
  wall-plume case.
- **Boundary:** hold out geometry and ventilation and equalize tuning, sensors,
  action rate and onboard compute.

### OLFACT-036 — particle-filter source belief is a mature robotics null

- **Status:** established as a narrow indoor robotic demonstration.
- **Primary source:** [Li et al. (2009)](https://doi.org/10.1109/CDC.2009.5400388).
- **Observation:** odor-patch detection, path logic and a particle filter were
  composed to estimate and declare a source in time-varying indoor airflow.
- **Boundary:** report credible-region coverage and source-off false
  declarations, not only successful endpoint distance.

### OLFACT-037 — compact temporal-memory RL can work in simulated plumes

- **Status:** plausible for the studied direct-numerical-simulation regimes;
  embodied transfer is unestablished.
- **Primary source:** [Rando et al. (2025)](https://doi.org/10.7554/eLife.102906.3).
- **Observation:** tabular Q-learning over a small temporal odor state learned
  within-plume persistence and crosswind recovery across several simulated
  plumes.
- **Boundary:** freeze policies before held-out sensor dynamics, Reynolds
  numbers and real-robot tests; equalize training interactions and tuning with
  finite-state, recurrent, belief-state and surge--cast baselines.

### OLFACT-038 — piriform odor activity can be sparse under global inhibition

- **Status:** established in the rat piriform preparation and stimuli studied.
- **Primary source:** [Poo and Isaacson (2009)](https://doi.org/10.1016/j.neuron.2009.05.022).
- **Observation:** global inhibition and oscillatory dynamics supported sparse
  cortical odor responses.
- **Boundary:** neural sparsity does not imply low total metabolic energy, sparse
  memory access, stable unit identity, or a win over compressed dense models.

### OLFACT-039 — piriform odor maps are distributed rather than neatly topographic

- **Status:** established in the imaged mouse piriform cortex.
- **Primary source:** [Stettler and Axel (2009)](https://doi.org/10.1016/j.neuron.2009.09.005).
- **Observation:** odor-responsive ensembles were spatially distributed and
  discontinuous rather than organized as a simple sensory map.
- **Boundary:** distributed coding does not determine the best hardware topology
  or routing algorithm; connectivity, access cost and interference remain open.

### OLFACT-040 — rate-like population information can outperform precise-pattern accounts

- **Status:** established in the studied rat discrimination task.
- **Primary source:** [Miura, Mainen, and Uchida (2012)](https://doi.org/10.1016/j.neuron.2012.04.021).
- **Observation:** distributed, decorrelated piriform population activity
  supported odor decisions; burst counts explained task information better
  than some precise latency/pattern measures, and small sampled ensembles could
  account for performance in that task.
- **Boundary:** this is not a universal neuron-count bound or proof against
  temporal coding elsewhere; independent animal, task and concentration splits
  are required.

### OLFACT-041 — the degree of piriform sparsity is disputed and concentration-dependent

- **Status:** disputed as a universal characterization; established that the
  measured degree varies with protocol and concentration.
- **Primary source:** [Roland et al. (2017)](https://doi.org/10.7554/eLife.26337).
- **Observation:** distributed ensembles encoded identity but activity was less
  sparse than some earlier accounts and changed with concentration.
- **Boundary:** always report bin width, threshold, concentration, layer,
  preparation, active fraction, information and error; never turn “sparse” into
  a binary architectural label.

### OLFACT-042 — piriform ensemble identity can drift while behavior remains stable

- **Status:** established for longitudinally recorded mouse piriform cortex.
- **Primary source:** [Schoonover et al. (2021)](https://doi.org/10.1038/s41586-021-03628-7).
- **Observation:** odor representations changed across weeks despite stable
  behavioral meaning.
- **Boundary:** stable task output does not imply stable unit addressing. Any
  artificial sparse memory must test remapping, readout maintenance and
  calibration cost rather than assuming fixed semantic neurons.

### OLFACT-043 — rapid reward-category coding need not appear explicitly in piriform

- **Status:** established negative regional result in the studied mouse task.
- **Primary source:** [Millman and Murthy (2020)](https://doi.org/10.1523/JNEUROSCI.2604-19.2020).
- **Observation:** explicit reward-category representations emerged in
  olfactory tubercle within minutes, while posterior piriform cortex did not
  show the same explicit representation even after overtraining.
- **Boundary:** “rapid olfactory association” cannot be assigned to one generic
  cortex module; region, readout, task and timescale matter.

### OLFACT-044 — arbitrary piriform ensembles can acquire opposite learned valence

- **Status:** established through ensemble activation paired with reward or
  shock in mice.
- **Primary source:** [Choi et al. (2011)](https://doi.org/10.1016/j.cell.2011.07.041).
- **Observation:** activating arbitrary piriform ensembles could later evoke
  appetitive or aversive behavior according to pairing history.
- **Boundary:** this supports flexible association, not unconstrained meaning:
  behavior depended on intervention and reinforcement history.

### OLFACT-045 — innate aversion and learned detection can be dissociated

- **Status:** established in a mouse olfactory-zone depletion experiment.
- **Primary source:** [Kobayakawa et al. (2007)](https://doi.org/10.1038/nature06281).
- **Observation:** disrupting a dorsal olfactory pathway abolished innate
  avoidance to tested odors while detection and learned avoidance remained.
- **Boundary:** detection, innate valence and learned valence require separate
  outputs and lesions/ablations; one “importance” score cannot replace them.

### OLFACT-046 — cortical amygdala pathways can causally drive innate odor behavior

- **Status:** established for the studied mouse appetitive and aversive odor
  circuits.
- **Primary source:** [Root et al. (2014)](https://doi.org/10.1038/nature13897).
- **Observation:** cortical-amygdala ensembles were necessary and sufficient for
  scoped innate odor-driven behaviors.
- **Boundary:** causal pathway in one species is not a general architecture for
  hazard classification; learning, context and toxicology can disagree with
  innate valence.

### OLFACT-047 — target detection in mixtures degrades with background count and overlap

- **Status:** established in the studied mouse mixture-learning experiments.
- **Primary source:** [Rokni et al. (2014)](https://doi.org/10.1038/nn.3775).
- **Observation:** mice learned targets embedded in variable mixtures, while
  performance degraded as backgrounds grew and component overlap increased.
- **Boundary:** mixture robustness must vary component count, ratios, chemical
  similarity, novel interferents and concentration; average closed-panel
  accuracy is insufficient.

### OLFACT-048 — chemically similar maskers can raise detection thresholds more

- **Status:** established for the rat odor-masking experiment and tested
  odorants.
- **Primary source:** [Laing et al. (1989)](https://doi.org/10.1016/0031-9384%2889%2990280-1).
- **Observation:** masking raised target thresholds and a more similar masker
  produced a larger effect in the reported comparison.
- **Boundary:** masking is a behavioral threshold shift, not merely receptor
  overlap or mixture concentration; criterion and perceptual learning must be
  controlled.

### OLFACT-049 — cross-reactive artificial sensor arrays are an established baseline

- **Status:** established as a sensing architecture, with task-specific
  calibration and analyte support.
- **Primary sources:** [Persaud and Dodd (1982)](https://doi.org/10.1038/299352a0);
  [Rakow and Suslick (2000)](https://doi.org/10.1038/35021028).
- **Observation:** partially selective semiconductor and colorimetric arrays
  generated analyte-dependent response patterns suitable for multivariate
  discrimination.
- **Boundary:** pattern recognition cannot identify analytes absent from sensor
  support, standards or training; cross-reactivity also creates interference.

### OLFACT-050 — electronic-nose drift is measurable over years

- **Status:** established for a 16-MOX-sensor, six-analyte dataset collected
  over three years.
- **Primary sources:** [Vergara et al. (2012)](https://doi.org/10.1016/j.snb.2012.01.074);
  [Fonollosa et al. (2015)](https://doi.org/10.1016/j.dib.2015.01.003).
- **Observation:** sensor distributions changed substantially over time and
  motivated drift compensation.
- **Boundary:** random row splits can leak acquisition time or batch. Split by
  device, batch, day and future time; retain raw vintages and source-off blanks.

### OLFACT-051 — humidity, stability, selectivity and poisoning are operator state

- **Status:** established for humidity interference in ion-mobility
  spectrometry and authoritative as detector qualification requirements.
- **Primary sources:** [Peng et al. (2015)](https://doi.org/10.1088/1752-7155/9/1/016003);
  [ISO 26142:2010](https://www.iso.org/standard/52319.html);
  [IEC 60079-29-1:2016](https://webstore.iec.ch/en/publication/25484).
- **Observation:** high moisture produced overlapping IMS peaks and impaired
  identification; detector standards explicitly require performance tests that
  include stability, response, range, selectivity and poisoning.
- **Boundary:** compensation learned on one humidity or device history is not
  proof of invariance. Out-of-support, poisoning and maintenance states need
  explicit detection and safe failure.

### OLFACT-052 — analytical identification and safety remain qualified claims

- **Status:** established as an authoritative methods-and-safety boundary.
- **Primary sources:** [EPA TO-15A](https://www.epa.gov/sites/default/files/2019-12/documents/to-15a_vocs.pdf),
  [EPA TO-17](https://www.epa.gov/sites/default/files/2019-11/documents/to-17r.pdf),
  [NIST SRD 1A](https://www.nist.gov/srd/nist-standard-reference-database-1a),
  [NIOSH Pocket Guide](https://www.cdc.gov/niosh/npg/default.html), and
  [NIOSH IDLH values](https://www.cdc.gov/niosh/idlh/default.html).
- **Observation:** validated workflows specify sampling, blanks, recovery,
  separation, calibration and identification support; exposure guidance is
  chemical-, route- and averaging-time-specific.
- **Boundary:** neither a library match nor an odor report establishes source,
  concentration, exposure or safety. Confirmatory analysis and an authoritative
  exposure rule remain separate decisions.

## Negative results, traps, and overclaims

1. **Smooth-gradient trap:** turbulent plumes contain whiffs and blanks; an
   instantaneous concentration gradient can be absent, aliased, or point away
   from the source. Gradient ascent is one baseline, not the physical default.
2. **Static-vector trap:** inlet, chamber, receptor/sensor, heater, humidity,
   contamination and recovery dynamics make observations path-dependent.
   Shuffling windows or pretending samples are IID can manufacture accuracy.
3. **Concentration--identity collapse:** a representation that hides
   concentration may help identity while destroying leak, dose or safety
   information. Report both outcomes and their joint error.
4. **Universal combinatorial-code claim:** olfactory receptor evidence does not
   imply that every chemical sense or target uses the same code; dedicated
   sweet/umami cell pathways are a direct counterexample.
5. **Universal normalization claim:** divisive inhibition in one insect circuit
   and recurrent inhibition in mouse piriform do not prove one transferable
   normalization law or a net engineering benefit.
6. **Timing-without-bandwidth claim:** millisecond neural timing cannot recover
   fluctuations removed by slow transport through tubing or a slow chemical
   sensor. Measure the complete impulse response.
7. **Universal stereo claim:** bilateral timing helps in one fly regime, while
   serial sampling sufficed in one mouse gradient task. Range, plume regime,
   motion and sensor spacing determine the value.
8. **Universal continuous-control claim:** walking flies in irregular plumes
   used event-biased stochastic actions, and reactive policies can match or
   beat more elaborate search on some metrics.
9. **Behavior-as-optimality claim:** contact-correlated slowing, sniffing or
   casting does not establish causal information gain, energy optimality, or
   superiority over engineered alternatives.
10. **Sparse-means-efficient claim:** sparse recorded activity says nothing by
    itself about total receptor maintenance, inhibition, routing, memory access,
    movement, respiration, or organism-level energy.
11. **Stable-neuron-address claim:** longitudinal piriform drift shows that
    stable behavior need not use a stable unit-level code. A fixed artificial
    address map incurs remapping and maintenance tests.
12. **One-region association claim:** rapid learned value appeared explicitly
    in olfactory tubercle, not posterior piriform, in the cited experiment.
13. **Valence-as-hazard claim:** innate aversion, learned preference, odor
    intensity, irritation, toxic effect, exposure and absorbed dose can
    disagree. Never use one as an unregistered proxy for another.
14. **Closed-panel e-nose claim:** high accuracy on known analytes and devices
    does not establish unknown detection, identification, mixture resolution,
    future-device calibration or source attribution.
15. **Random-split drift leakage:** rows collected near each other can share
    device, batch, day, concentration schedule and contamination. Random splits
    can turn time or batch into the label.
16. **Compensation-without-detection trap:** a model may correct expected drift
    while silently extrapolating under poisoning, replacement, novel humidity,
    interferents or sensor failure. It needs out-of-support alarms and abstention.
17. **Library-hit-as-identification trap:** a mass-spectrum match is conditional
    on sampling, separation, deconvolution, library coverage, retention evidence
    and uncertainty. Confirm with standards when the decision demands it.
18. **Instrument-as-oracle trap:** GC--MS and PTR--MS are strong nulls, not
    infallible truth. Collection loss, reaction, adsorption, breakthrough,
    co-elution, carryover, fragmentation and library errors remain measurable.
19. **Pseudoreplication trap:** repeated frames from one plume, vial, device,
    animal or day are not independent episodes. Split and bootstrap at the
    causal unit that must generalize.
20. **Source-off omission:** a controller that always declares the likely
    source region can look successful if every trial contains a source. Include
    source-off, wrong-source and out-of-domain trials.
21. **Free active sensing:** sniffing, pumping, heating, preconcentration,
    locomotion and purge consume time and energy, change exposure, age sensors,
    and can perturb the plume.
22. **Inference-only energy:** heaters, pumps, chromatography ovens, vacuum and
    ion sources, carrier/calibration gases, robot motion, maintenance, poisoned
    sensor replacement, facility power and embodied hardware belong in the
    boundary.
23. **Bio-inspired novelty by vocabulary:** rapid online learning from a
    chemosensor was already demonstrated on neuromorphic hardware
    ([Imam and Cleland 2020](https://doi.org/10.1038/s42256-020-0159-4)). A new
    proposal must beat that and ordinary online classifiers, not rename them.
24. **Residual-forcing trap:** after operator modelling, active design,
    calibrated inference, robust control and lifecycle accounting are admitted,
    the audit may leave no new computational primitive. That is a valid result.

## Decisive equal-budget experiments

Every experiment uses independent source/plume/device/animal units, frozen
analysis before the final split, identical outcome definitions, and a complete
budget $B_e$. “Equal model size” alone is not an equal budget.

### E-OLFACT-01 — concentration–identity factorization

- **Question:** does a proposed code preserve identity while retaining usable
  concentration information?
- **Design:** cross analyte identity, log concentration, mixture background,
  humidity and sampling waveform; hold out concentrations and analytes jointly.
- **Equal budget:** same sensors, raw time support, calibration standards,
  training episodes, parameter/tuning search, latency and joules.
- **Nulls and decision:** compare raw/dynamic calibrated classifiers,
  concentration-conditioned generative models, divisive normalization,
  recurrent networks and the candidate. Retain only if it improves the joint
  identity-confusion, concentration-error and calibration frontier; retire if
  apparent invariance merely discards concentration.

### E-OLFACT-02 — receptor/sensor coverage versus architecture

- **Question:** is gain caused by a coding rule or simply by broader chemistry?
- **Design:** construct matched arrays with equal channel count but different
  response-basis coverage; include chemicals outside each basis and mixtures.
- **Equal budget:** identical exposed sensor area, samples, standards, response
  bandwidth, compute, training labels, hardware power and replacement reserve.
- **Nulls and decision:** compare sparse and dense linear, kernel, tree, Bayesian
  and neural decoders. Retain an architecture claim only if it generalizes after
  coverage and signal-to-noise are matched.

### E-OLFACT-03 — normalization under saturation and interferents

- **Question:** when does pooled or recurrent normalization help rather than
  erase absolute or rare-component information?
- **Design:** sweep dynamic range, common-mode background, sparse target,
  saturation, novel interferents and sensor-gain drift.
- **Equal budget:** same observations, numerical precision, state, training and
  calibration data, compute, latency and energy.
- **Nulls and decision:** compare no normalization, robust scaling, explicit
  gain-state estimation, divisive normalization and recurrent inhibition.
  Retain only for a preregistered Pareto gain across identity, concentration,
  rare-target recall and calibration.

### E-OLFACT-04 — temporal code versus response-operator deconvolution

- **Question:** does event timing add chemical information beyond the measured
  sensor impulse response?
- **Design:** acquire fast ground truth and sensor output simultaneously; vary
  inlet length, chamber volume, pump waveform, heater and plume timescale.
- **Equal budget:** same physical channels, sample clock, causal history,
  compute window, latency and energy.
- **Nulls and decision:** compare instantaneous features, derivatives, matched
  filters, state-space deconvolution, point-process/event features and the
  candidate. Time-shuffle events while preserving marginal level and duty
  cycle. Retain only if causal timing survives held-out operators.

### E-OLFACT-05 — adaptive sniff or pump value

- **Question:** does closed-loop acquisition add information per total cost?
- **Design:** compare adaptive waveform/flow with fixed-rate, random, replayed
  and dose-matched schedules in the same measured plume realizations.
- **Equal budget:** cap total sampled volume, inhaled mass, pump/heater energy,
  action count, wall time, motion, compute and exposures.
- **Nulls and decision:** report literal task gain, posterior calibration,
  latency, wear and joules. Retain only if adaptive action improves the protected
  frontier rather than receiving more material or time.

### E-OLFACT-06 — bilateral, serial and wind cue factorial

- **Question:** which spatial cue works in which transport regime?
- **Design:** cross bilateral versus unilateral sensors, natural versus
  phase-scrambled serial sampling, wind present versus randomized, near versus
  far source, and regular versus intermittent plume.
- **Equal budget:** identical sensor area/channel count, spacing where relevant,
  samples, action rate, trajectory length, compute, tuning and energy.
- **Nulls and decision:** compare instantaneous gradient, lag correlation,
  unilateral history, wind-only and fused policies. Retain only cue-by-regime
  claims that replicate in held-out geometry.

### E-OLFACT-07 — plume statistic sufficiency

- **Question:** which causal history statistics actually predict source-bearing
  action?
- **Design:** benchmark mean, peak, slope, duration, encounter frequency,
  time-since-hit, whiff/blank sequence, bilateral lag and full causal history on
  fast measured plumes; time-reverse and time-shuffle selectively.
- **Equal budget:** same window, sample rate, labels, model capacity, tuning and
  latency.
- **Nulls and decision:** require held-out source-direction or source-position
  information, not correlation with downstream distance. Retire a feature when
  matched history or transport nulls reach the same calibrated error.

### E-OLFACT-08 — source-search policy tournament

- **Question:** does any bio-inspired controller beat mature search baselines?
- **Design:** frozen correlated random walk, gradient/tropotaxis, wind-only,
  surge--cast/off-zigzag, infotaxis, particle-filter belief control, MPC/POMDP,
  compact temporal-memory RL and candidate policies face identical recorded and
  live plume seeds.
- **Equal budget:** same sensor stream and dynamics, prior/model access,
  training interactions, hyperparameter evaluations, onboard compute, action
  rate, travel, time, energy and stopping rule.
- **Nulls and decision:** score success, source-off false declaration, position
  error, path, time, calibration, collision/risk and joules. Retain only a
  regime-qualified Pareto gain across held-out flow, source and geometry.

### E-OLFACT-09 — simulation-to-embodiment transfer

- **Question:** does a plume policy survive the physical operator it omitted?
- **Design:** train in DNS or replay, freeze, then test with tubing delay, slow
  response/recovery, humidity, drift, locomotor latency, saturation, source
  intermittency and real wind-tunnel/field trials.
- **Equal budget:** equal simulation interactions, randomization/tuning trials,
  real calibration trials, sensors, compute and physical episodes.
- **Nulls and decision:** compare hand-coded finite-state, system-identified
  belief control, domain-randomized RL and candidate. Retire if gain disappears
  under the measured operator or requires post-test retuning.

### E-OLFACT-10 — sparse representation total-cost test

- **Question:** does sparse coding improve accepted task work per lifecycle
  joule rather than only active-unit count?
- **Design:** match accuracy/calibration across dense, top-$k$, thresholded,
  event-driven and distributed sparse models under concentration, mixture and
  drift shifts.
- **Equal budget:** charge encoders, normalization/inhibition, indices, routing,
  memory traffic, idle hardware, remapping, training, motion/sensing and
  fabrication/amortized replacement.
- **Nulls and decision:** report active fraction, bytes, latency, total joules,
  error, calibration and recovery separately. Retire if compression, pruning or
  dense low-precision execution reaches the same frontier.

### E-OLFACT-11 — drifting ensemble/readout maintenance

- **Question:** can stable task semantics survive unit-level drift efficiently?
- **Design:** induce or collect gradual gain drift, sensor replacement,
  representational remapping and abrupt poisoning; preserve true time order.
- **Equal budget:** same labelled recalibration samples, update writes,
  monitoring, storage, compute, downtime, human work and energy.
- **Nulls and decision:** compare frozen readout, periodic calibration, online
  state-space drift estimation, domain adaptation, ensemble remapping and
  candidate maintenance. Retain only if future-time performance and false-alarm
  risk improve without hidden labels.

### E-OLFACT-12 — mixture foreground and masking battery

- **Question:** does the system separate a target from mixtures or merely learn
  the closed composition schedule?
- **Design:** cross target/background similarity, component count, ratio,
  concentration, novel interferents and unseen combinations; include
  target-absent mixtures.
- **Equal budget:** same sensor evidence, standards, training mixtures, search,
  capacity, latency and joules.
- **Nulls and decision:** compare calibrated multivariate baselines, nonnegative
  factorization, source-separation/generative models, retrieval and the
  candidate. Score detection, component identity, concentration and
  abstention separately.

### E-OLFACT-13 — e-nose drift, humidity and poisoning challenge

- **Question:** does claimed robustness survive prospective deployment state?
- **Design:** split by device, manufacture batch, future month, site and operator;
  independently sweep humidity/temperature and inject reversible drift,
  contamination, irreversible poisoning, replacement and unknown analytes.
- **Equal budget:** same zero/span checks, reference gas, recalibration labels,
  monitoring channels, compute, maintenance and replacement allowance.
- **Nulls and decision:** compare no correction, orthogonal correction,
  supervised/unsupervised domain adaptation, dynamic calibration, novelty
  detection and candidate. Require calibrated abstention and safe degradation,
  not only retained closed-set accuracy.

### E-OLFACT-14 — tiered analysis and safety decision

- **Question:** can a low-cost array safely decide when to escalate to a stronger
  analytical method?
- **Design:** blind samples include knowns, mixtures, unknowns, blanks,
  interferents and concentrations around task and exposure boundaries. The
  system may classify, abstain or request GC--MS/PTR--MS/IMS confirmation.
- **Equal budget:** equal initial sensors and samples; charge confirmations,
  turnaround, false reassurance, false alarm, exposure, consumables, people,
  facility power and lifecycle energy.
- **Nulls and decision:** compare always-confirm, never-confirm, calibrated
  cascade, sequential probability test, value-of-information policy and
  candidate. Retain only if risk--latency--cost improves under prospective
  source/device/site splits without using odor threshold as safety truth.

## Exact deduplication against the principle registry

| Existing principle | Chemical-sensing evidence | Disposition |
| --- | --- | --- |
| [P-001](../principle-registry.md#registry-summary) allocate scarce activity to a relevant subset | sparse piriform activity, receptor coverage, event-triggered search and tiered analysis | **Duplicate/qualification.** Adds mixture, calibration and operator tests; no new invariant. |
| [P-002](../principle-registry.md#registry-summary) resolve locally and escalate exceptions | ON/OFF search reflexes and low-cost sensor followed by confirmatory analysis | **Duplicate.** The safety cascade is tested by E-OLFACT-14, not promoted. |
| [P-003](../principle-registry.md#registry-summary) cheap temporary trace before slow commitment | sensor transients, whiff/blank memory, preconcentration and provisional classifications | **Duplicate.** Existing sequential-test and staged-verification nulls cover it. |
| [P-004](../principle-registry.md#registry-summary) generate diversity, select, protect/compress winners | receptor diversity and learned valence suggest search/selection analogies | **No distinct support.** Diversity here is sensing coverage, not evidence for a new optimization loop. |
| [P-005](../principle-registry.md#registry-summary) reinforce useful paths and decay unused topology | flexible odor--valence association is adjacent | **No structural residual.** The cited studies do not establish topology growth/decay as the causal benefit. |
| [P-006](../principle-registry.md#registry-summary) slower negative feedback stabilizes dynamics | receptor adaptation, divisive normalization, recurrent inhibition, sensor baseline/drift control | **Direct duplicate/qualification.** Absolute-signal loss, saturation and multi-timescale drift become required tests. |
| [P-007](../principle-registry.md#registry-summary) spend sensing/compute on unresolved prediction error | adaptive sniffing, infotaxis and confirmatory escalation | **Direct duplicate.** Value-of-information and POMDP/dual-control nulls already express the loop. |
| [P-008](../principle-registry.md#registry-summary) contain local interactions before integration | receptor channels, bulb/piriform stages and modular ON/OFF/wind controllers | **Duplicate at most.** Anatomy or pipeline staging alone is not a new causal principle. |
| [P-009](../principle-registry.md#registry-summary) separate execution from maintenance/consolidation | zero/span checks, cleaning, recalibration, drift monitoring and sensor replacement | **Direct operational duplicate.** Adds chemically specific maintenance burden. |
| [P-010](../principle-registry.md#registry-summary) move recurring computation into structure/placement | receptor chemistry, sensor coatings, chromatographic columns and inlet geometry physically shape inference | **Direct duplicate/qualification.** Fabrication, cross-sensitivity, poisoning and replacement must be charged. |
| [P-011](../principle-registry.md#registry-summary) transient coalitions through time-dependent communication | sniff-phase populations and encounter-timed motor policies | **Adjacent, not new evidence for a general communication coalition.** Timing benefit remains operator- and task-specific. |
| [P-012](../principle-registry.md#registry-summary) match medium/update rate to information lifetime | fast receptor adaptation, behavioral habituation, online drift state, slow calibration and library maintenance | **Direct duplicate/qualification.** The audit supplies explicit time constants and reset/recovery tests. |
| [P-013](../principle-registry.md#registry-summary) coordinate through environmental shared state | a chemical plume is external state, but generally a transported physical signal rather than an intentionally maintained coordination trace | **No promotion.** Use only when agents truly write/read a persistent chemical marker; otherwise F-005 transport is the correct frame. |

## Exact disposition against current candidates

| Candidate | Relationship | Decision from this audit |
| --- | --- | --- |
| [001 adaptive topology](../../experiments/candidates/001-adaptive-topology.md) | sensor placement/inlet geometry is adjacent | no change; ordinary experimental design, CFD and layout optimization are nulls |
| [002 multiscale context broadcast](../../experiments/candidates/002-multiscale-context-broadcast.md) | concentration, sniff phase and slow calibration provide multiscale context | sharpen with causal time-support tests; no new support beyond FiLM/recurrent/state-space nulls |
| [003 recovery-dynamics fragility](../../experiments/candidates/003-recovery-dynamics-fragility.md) | sensor recovery may signal reversible contamination | no change; recovery also reflects ordinary response dynamics and cannot diagnose poisoning alone |
| [004 closed endogenous curriculum](../../experiments/candidates/004-closed-endogenous-curriculum.md) | active sampling could choose informative chemicals/conditions | no change; active learning, experiment design and VOI are complete nulls |
| [005 severity-ordered containment](../../experiments/candidates/005-severity-ordered-containment.md) | purge, isolate, recalibrate, replace is a severity ladder | qualification only; detector diagnostics and maintenance policies are mature nulls |
| [006 reversible physical skill](../../experiments/candidates/006-reversible-physical-skill.md) | coatings, heaters, columns and inlet geometry implement physical transforms | direct stress test: charge calibration, drift, poisoning, reset and fallback; no new candidate |
| [007 endogenous-observation surveillance](../../experiments/candidates/007-endogenous-observation-surveillance.md) | sniff/pump/motion changes evidence and exposure | direct domain instantiation; E-OLFACT-05/06/08 are relevant tests |
| [008 contestable modular allocation](../../experiments/candidates/008-contestable-modular-allocation.md) | no strategic modules or private incentives in the audited mechanism | no relationship sufficient for update |
| [009 graded assurance envelopes](../../experiments/candidates/009-graded-assurance-envelopes.md) | calibration validity, poisoning state and safety grade bound actions | qualification only; standards and interlocks remain required nulls |
| [010 reset-coupled staged verification](../../experiments/candidates/010-reset-coupled-staged-verification.md) | e-nose screen followed by confirmatory analysis | direct test in E-OLFACT-14; retain only when confirmation adds conditional information after all cost |
| [011 dual-loop operational assurance](../../experiments/candidates/011-dual-loop-operational-assurance.md) | incidents can update calibration, poisoning and maintenance rules | no new mechanism; ordinary metrology/QC and post-incident change control are nulls |
| [012 latency-qualified authority](../../experiments/candidates/012-latency-qualified-authority.md) | stale, slow, saturated or poisoned sensors should narrow allowed actions | direct domain instantiation; operator health must be independently monitored |
| [013 deficit–capability routing](../../experiments/candidates/013-deficit-capability-routing.md) | routing a sample to capable instruments is adjacent | no new support; scheduling, triage and analytical workflow are nulls |
| [014 versioned observation contract](../../experiments/candidates/014-versioned-observation-contract.md) | transport, acquisition, response, calibration, support, uncertainty and lineage are the audit's core residual | **strong direct instantiation, not a new candidate**; chemical state and exposure fields should extend its test schema |
| [015 repairable conventions](../../experiments/candidates/015-versioned-repairable-conventions.md) | chemical names, units and library identifiers require versioning | ordinary schema/vocabulary work; no adaptive-convention residual shown |
| [016 conflict-bounded unit transition](../../experiments/candidates/016-conflict-bounded-unit-transition.md) | no collective heredity or conflict-control evidence | no relationship sufficient for update |
| [017 semantic compaction](../../experiments/candidates/017-contract-preserving-semantic-compaction.md) | retaining summaries instead of raw chromatograms/plume histories risks future-query loss | qualification: hidden-query tests must include recalibration, re-deconvolution and changed libraries |
| [018 value/reconstructability tiering](../../experiments/candidates/018-value-reconstructability-aware-tiering.md) | decide which samples, standards, raw traces and confirmatory results to retain | qualification only; storage/reanalysis value must be leakage-free and lifecycle-costed |
| [019 audited cumulative inheritance](../../experiments/candidates/019-audited-cumulative-inheritance.md) | calibration libraries and validated methods cross device/operator turnover | no new mechanism; certified standards, versioning and interlaboratory QA are mature nulls |
| [020 constitutional control plane](../../experiments/candidates/020-constitutional-control-plane.md) | safety authority and exposure limits can constrain automation | no governance novelty established; use existing safety/IAM/interlock stack |

## Exact fixture deduplication

| Fixture | Coverage of this audit | Disposition |
| --- | --- | --- |
| [F-001 shared-clock-free co-adaptation](../../experiments/fixtures/001-shared-clock-free-coadaptation.md) | sniff phase is local timing, but no partner co-adaptation is required | not the primary fixture |
| [F-002 reconstructive design](../../experiments/fixtures/002-versioned-reconstructive-design.md) | sensor/array design may use its provenance rules | supporting only |
| [F-003 opportunity/history-qualified action](../../experiments/fixtures/003-opportunity-history-qualified-action.md) | animal comparisons require actual sensory and motor opportunities and acquisition history | supporting for cross-species claims |
| [F-004 proof discovery](../../experiments/fixtures/004-versioned-proof-discovery.md) | no direct coverage | not applicable beyond ordinary claim validation |
| [F-005 flow inference/control](../../experiments/fixtures/005-regime-qualified-flow-inference-control.md) | advection, turbulence, intermittency, response-qualified metrology, assimilation and control | **primary transport/source-search fixture**; chemical reaction/sorption and exposure extend its operator |
| [F-006 representative adaptive performance](../../experiments/fixtures/006-representative-adaptive-performance.md) | history, readiness, speed/accuracy/risk/energy and transfer | supporting for adaptive search and device ageing |
| [F-007 optical inference](../../experiments/fixtures/007-operator-qualified-optical-inference.md) | forward-operator, calibration, null-space and active acquisition logic | conceptual duplicate; do not create a modality-specific principle from it |
| [F-008 device reliability](../../experiments/fixtures/008-mission-profile-qualified-device-reliability.md) | reversible drift, cumulative degradation, poisoning, latent failure and replacement | **primary sensor-lifecycle fixture** |
| [F-009 active acoustic inference](../../experiments/fixtures/009-operator-qualified-active-acoustic-inference.md) | emission/acquisition action, propagation, arrays, timing, scene inference, exposure and total cost | **primary active-sensing analogue**; replace waveform propagation with chemical transport and sampling |

**Deduplication verdict:** use a composition of F-005, F-008 and F-009 with
Candidate 014's versioned observation contract and Candidate 007's endogenous
observation tests. F-003 and F-006 qualify animal and adaptive-performance
comparisons. No audit-specific candidate or fixture is justified unless
E-OLFACT-01 through E-OLFACT-14 reveal a reproducible residual that this
composition cannot express.

## Open questions

1. Which chemical tasks retain useful identity information across truly unseen
   concentrations, mixtures, humidity and devices without erasing
   concentration or hazard information?
2. What minimal operator metadata permits cross-device reuse: full impulse
   response, a low-order dynamic state, calibration anchors, or something else?
3. When do receptor-like cross-reactive arrays beat targeted sensors plus a
   staged analytical workflow after standards and lifecycle cost are charged?
4. Can a learned acquisition policy transfer across tubing, chamber, pump,
   heater and sensor-response dynamics without new labels?
5. Which plume statistics remain source-bearing under held-out Reynolds number,
   terrain, thermal stratification, source height, buoyancy and chemical loss?
6. When does bilateral lag correlation add value beyond serial history and
   wind, given physical sensor spacing and bandwidth?
7. Can fast, low-power plume ground truth be obtained without substituting an
   offline laboratory instrument whose cost dominates the system?
8. What is the best calibrated abstention target for unknown analytes,
   mixtures, poisoning and out-of-range exposure?
9. Can representation drift be exploited as benign turnover, or does it merely
   move calibration and readout-maintenance cost elsewhere?
10. Does event sparsity reduce total memory traffic and energy once dynamic
    sensing, normalization, routing, state maintenance and missed-event risk are
    included?
11. Which rapid odor associations are stored in sensory, striatal/amygdala,
    hippocampal or task-specific circuits, and which architectural abstractions
    survive region-specific causal perturbation?
12. How should certified reference gases, blanks, unknowns and confirmatory
    instruments be scheduled to maximize information while minimizing exposure,
    consumables and calibration burden?
13. What causal diagnostics distinguish reversible humidity/baseline drift,
    ordinary ageing, contamination, irreversible poisoning and component
    failure early enough to constrain action safely?
14. Which raw traces and physical samples must remain recoverable for future
    reanalysis when libraries, exposure limits or calibration models change?
15. After the complete null stack is implemented, does any olfaction-specific
    residual improve a protected quality--risk--latency--lifecycle frontier, or
    is the durable output only a stricter observation contract?

## Primary-source and authoritative bibliography

### Receptors, circuits, timing, learning, and perception

- **B-001:** Buck, L. and Axel, R. (1991), “A novel multigene family may encode
  odorant receptors,” *Cell*. [DOI](https://doi.org/10.1016/0092-8674%2891%2990418-X).
- **B-002:** Malnic, B. et al. (1999), “Combinatorial receptor codes for odors,”
  *Cell*. [DOI](https://doi.org/10.1016/S0092-8674%2800%2980581-4).
- **B-003:** Zhao, G. Q. et al. (2003), “The receptors for mammalian sweet and
  umami taste,” *Cell*. [DOI](https://doi.org/10.1016/S0092-8674%2803%2900844-4).
- **B-004:** Olsen, S. R., Bhandawat, V. and Wilson, R. I. (2010), “Divisive
  normalization in olfactory population codes,” *Neuron*.
  [DOI](https://doi.org/10.1016/j.neuron.2010.04.009).
- **B-005:** Storace, D. A. and Cohen, L. B. (2017), “Measuring the olfactory bulb
  input-output transformation reveals a contribution to the perception of odorant
  concentration invariance,” *Nature Communications*.
  [DOI](https://doi.org/10.1038/s41467-017-00036-2).
- **B-006:** Stopfer, M., Jayaraman, V. and Laurent, G. (2003), “Intensity versus
  identity coding in an olfactory system,” *Neuron*.
  [DOI](https://doi.org/10.1016/j.neuron.2003.08.011).
- **B-007:** Bolding, K. A. and Franks, K. M. (2018), “Recurrent cortical circuits
  implement concentration-invariant odor coding,” *Science*.
  [DOI](https://doi.org/10.1126/science.aat6904).
- **B-008:** Bolding, K. A. and Franks, K. M. (2017), “Complementary codes for odor
  identity and intensity in olfactory cortex,” *eLife*.
  [DOI](https://doi.org/10.7554/eLife.22630).
- **B-009:** Iwata, R. et al. (2017), “Mechanosensory-based phase coding of odor
  identity in the olfactory bulb,” *Neuron*.
  [DOI](https://doi.org/10.1016/j.neuron.2017.11.008).
- **B-010:** Parabucki, A. et al. (2019), “Odor concentration change coding in the
  olfactory bulb,” *eNeuro*.
  [DOI](https://doi.org/10.1523/ENEURO.0396-18.2019).
- **B-011:** Kurahashi, T. and Menini, A. (1997), “Mechanism of odorant adaptation
  in the olfactory receptor cell,” *Nature*.
  [DOI](https://doi.org/10.1038/385725a0).
- **B-012:** Munger, S. D. et al. (2001), “Central role of the CNGA4 channel
  subunit in Ca2+-calmodulin-dependent odor adaptation,” *Science*.
  [DOI](https://doi.org/10.1126/science.1063224).
- **B-013:** Reisert, J. and Matthews, H. R. (2001), “Response properties of
  isolated mouse olfactory receptor cells,” *Journal of Physiology*.
  [DOI](https://doi.org/10.1111/j.1469-7793.2001.0113m.x).
- **B-014:** Chaudhury, D. et al. (2010), “Olfactory bulb habituation to odor
  stimuli,” *Behavioral Neuroscience*.
  [DOI](https://doi.org/10.1037/a0020293).
- **B-015:** Kepecs, A., Uchida, N. and Mainen, Z. F. (2007), “Rapid and precise
  control of sniffing during olfactory discrimination in rats,” *Journal of
  Neurophysiology*. [DOI](https://doi.org/10.1152/jn.00071.2007).
- **B-016:** Verhagen, J. V. et al. (2007), “Sniffing controls an adaptive filter
  of sensory input to the olfactory bulb,” *Nature Neuroscience*.
  [DOI](https://doi.org/10.1038/nn1892).
- **B-017:** Cury, K. M. and Uchida, N. (2010), “Robust odor coding via
  inhalation-coupled transient activity in the mammalian olfactory bulb,”
  *Neuron*. [DOI](https://doi.org/10.1016/j.neuron.2010.09.040).
- **B-018:** Smear, M. et al. (2011), “Perception of sniff phase in mouse
  olfaction,” *Nature*. [DOI](https://doi.org/10.1038/nature10521).
- **B-019:** Shusterman, R. et al. (2011), “Precise olfactory responses tile the
  sniff cycle,” *Nature Neuroscience*. [DOI](https://doi.org/10.1038/nn.2877).
- **B-020:** Findley, T. M. et al. (2021), “Sniff-synchronized, gradient-guided
  olfactory search by freely moving mice,” *eLife*.
  [DOI](https://doi.org/10.7554/eLife.58523).
- **B-021:** Kadakia, N. et al. (2022), “Odour motion sensing enhances navigation
  of complex plumes,” *Nature*.
  [DOI](https://doi.org/10.1038/s41586-022-05423-4).
- **B-022:** Poo, C. and Isaacson, J. S. (2009), “Odor representations in
  olfactory cortex: sparse coding, global inhibition, and oscillations,”
  *Neuron*. [DOI](https://doi.org/10.1016/j.neuron.2009.05.022).
- **B-023:** Stettler, D. D. and Axel, R. (2009), “Representations of odor in the
  piriform cortex,” *Neuron*.
  [DOI](https://doi.org/10.1016/j.neuron.2009.09.005).
- **B-024:** Miura, K., Mainen, Z. F. and Uchida, N. (2012), “Odor representations
  in olfactory cortex: distributed rate coding and decorrelated population
  activity,” *Neuron*. [DOI](https://doi.org/10.1016/j.neuron.2012.04.021).
- **B-025:** Roland, B. et al. (2017), “Odor identity coding by distributed
  ensembles of neurons in the mouse olfactory cortex,” *eLife*.
  [DOI](https://doi.org/10.7554/eLife.26337).
- **B-026:** Schoonover, C. E. et al. (2021), “Representational drift in primary
  olfactory cortex,” *Nature*.
  [DOI](https://doi.org/10.1038/s41586-021-03628-7).
- **B-027:** Millman, D. J. and Murthy, V. N. (2020), “Rapid learning of odor-value
  association in the olfactory striatum,” *Journal of Neuroscience*.
  [DOI](https://doi.org/10.1523/JNEUROSCI.2604-19.2020).
- **B-028:** Choi, G. B. et al. (2011), “Driving opposing behaviors with ensembles
  of piriform neurons,” *Cell*.
  [DOI](https://doi.org/10.1016/j.cell.2011.07.041).
- **B-029:** Kobayakawa, K. et al. (2007), “Innate versus learned odour processing
  in the mouse olfactory bulb,” *Nature*.
  [DOI](https://doi.org/10.1038/nature06281).
- **B-030:** Root, C. M. et al. (2014), “The participation of cortical amygdala in
  innate, odour-driven behaviour,” *Nature*.
  [DOI](https://doi.org/10.1038/nature13897).
- **B-031:** Rokni, D. et al. (2014), “An olfactory cocktail party: figure-ground
  segregation of odorants in rodents,” *Nature Neuroscience*.
  [DOI](https://doi.org/10.1038/nn.3775).
- **B-032:** Laing, D. G. et al. (1989), odor masking in rats, *Physiology &
  Behavior*. [DOI](https://doi.org/10.1016/0031-9384%2889%2990280-1).
- **B-033:** Sosulski, D. L. et al. (2011), “Distinct representations of olfactory
  information in different cortical centres,” *Nature*.
  [DOI](https://doi.org/10.1038/nature09868).
- **B-034:** Roesch, M. R. et al. (2006), associative encoding in anterior
  piriform and orbitofrontal cortex, *Cerebral Cortex*.
  [DOI](https://doi.org/10.1093/cercor/bhk009).
- **B-035:** Imam, N. and Cleland, T. A. (2020), “Rapid online learning and robust
  recall in a neuromorphic olfactory circuit,” *Nature Machine Intelligence*.
  [DOI](https://doi.org/10.1038/s42256-020-0159-4).

### Plumes, animal navigation, and robotics

- **B-036:** Celani, A., Villermaux, E. and Vergassola, M. (2014), “Odor
  landscapes in turbulent environments,” *Physical Review X*.
  [DOI](https://doi.org/10.1103/PhysRevX.4.041015).
- **B-037:** Crimaldi, J. P. and Koseff, J. R. (2001), “High-resolution
  measurements of the spatial and temporal scalar structure of a turbulent
  plume,” *Experiments in Fluids*.
  [DOI](https://doi.org/10.1007/s003480000263).
- **B-038:** Murlis, J., Willis, M. A. and Cardé, R. T. (2000), “Spatial and
  temporal structures of pheromone plumes in fields and forests,” *Physiological
  Entomology*. [DOI](https://doi.org/10.1046/j.1365-3032.2000.00176.x).
- **B-039:** Webster, D. R. and Weissburg, M. J. (2001), “Chemosensory guidance
  cues in a turbulent chemical odor plume,” *Limnology and Oceanography*.
  [DOI](https://doi.org/10.4319/lo.2001.46.5.1034).
- **B-040:** Vickers, N. J. and Baker, T. C. (1994), “Reiterative responses to
  single strands of odor promote sustained upwind flight and odor source
  location by moths,” *PNAS*. [DOI](https://doi.org/10.1073/pnas.91.13.5756).
- **B-041:** Álvarez-Salvado, E. et al. (2018), “Elementary sensory-motor
  transformations underlying olfactory navigation in walking fruit-flies,”
  *eLife*. [DOI](https://doi.org/10.7554/eLife.37815).
- **B-042:** Demir, M. et al. (2020), “Walking Drosophila navigate complex plumes
  using stochastic decisions biased by the timing of odor encounters,” *eLife*.
  [DOI](https://doi.org/10.7554/eLife.57524).
- **B-043:** Tariq, M. F. et al. (2021), head-mounted sensor measurement of
  plume contacts in mice, *eNeuro*.
  [DOI](https://doi.org/10.1523/ENEURO.0285-20.2020).
- **B-044:** Vergassola, M., Villermaux, E. and Shraiman, B. I. (2007),
  “‘Infotaxis’ as a strategy for searching without gradients,” *Nature*.
  [DOI](https://doi.org/10.1038/nature05464).
- **B-045:** Ishida, H. et al. (1994), gas/odor-source localization with gas and
  anemometric sensors, *Sensors and Actuators A*.
  [DOI](https://doi.org/10.1016/0924-4247%2894%2900829-9).
- **B-046:** Ishida, H. et al. (2005), “Controlling a Gas/Odor Plume-Tracking
  Robot Based on Transient Responses of Gas Sensors,” *IEEE Sensors Journal*.
  [DOI](https://doi.org/10.1109/JSEN.2004.839597).
- **B-047:** Voges, N. et al. (2014), “Reactive searching and infotaxis in odor
  source localization,” *PLOS Computational Biology*.
  [DOI](https://doi.org/10.1371/journal.pcbi.1003861).
- **B-048:** Li, J. et al. (2020), comparative three-dimensional odor-source
  localization algorithms, *Building and Environment*.
  [DOI](https://doi.org/10.1016/j.buildenv.2020.106746).
- **B-049:** Li, F. et al. (2009), particle-filter mobile-robot odor-source
  localization in time-varying airflow, *IEEE CDC*.
  [DOI](https://doi.org/10.1109/CDC.2009.5400388).
- **B-050:** Rando, J. et al. (2025), temporal-memory reinforcement learning for
  odor-plume navigation, *eLife*.
  [DOI](https://doi.org/10.7554/eLife.102906.3).

### Artificial sensors, calibration, analytical chemistry, and safety

- **B-051:** Persaud, K. and Dodd, G. (1982), “Analysis of discrimination
  mechanisms in the mammalian olfactory system using a model nose,” *Nature*.
  [DOI](https://doi.org/10.1038/299352a0).
- **B-052:** Rakow, N. A. and Suslick, K. S. (2000), “A colorimetric sensor array
  for odour visualization,” *Nature*.
  [DOI](https://doi.org/10.1038/35021028).
- **B-053:** Vergara, A. et al. (2012), “Chemical gas sensor drift compensation
  using classifier ensembles,” *Sensors and Actuators B*.
  [DOI](https://doi.org/10.1016/j.snb.2012.01.074).
- **B-054:** Fonollosa, J. et al. (2015), “Chemical gas sensor array dataset,”
  *Data in Brief*.
  [DOI](https://doi.org/10.1016/j.dib.2015.01.003).
- **B-055:** Padilla, M. et al. (2010), orthogonal-signal-correction drift
  compensation for chemical sensor arrays, *Chemometrics and Intelligent
  Laboratory Systems*. [DOI](https://doi.org/10.1016/j.chemolab.2009.10.002).
- **B-056:** Scholz, C. et al. (2021), “Drift in a popular metal oxide sensor
  dataset reveals limitations for gas classification benchmarks.”
  [arXiv](https://arxiv.org/abs/2108.08793).
- **B-057:** Peng, L. et al. (2015), humidity interference and dopant mitigation
  in ion-mobility spectrometry, *Journal of Breath Research*.
  [DOI](https://doi.org/10.1088/1752-7155/9/1/016003).
- **B-058:** Hansel, A. et al. (1995), “Proton transfer reaction mass
  spectrometry: on-line trace gas analysis at the ppb level,” *International
  Journal of Mass Spectrometry and Ion Processes*.
  [DOI](https://doi.org/10.1016/0168-1176%2895%2904294-U).
- **B-059:** Stein, S. E. (1994), “Estimating probabilities of correct
  identification from results of mass spectral library searches,” *Journal of
  the American Society for Mass Spectrometry*.
  [DOI](https://doi.org/10.1016/1044-0305%2894%2985022-4).
- **B-060:** Stein, S. E. and Scott, D. R. (1994), “Optimization and testing of
  mass spectral library search algorithms for compound identification,”
  *Journal of the American Society for Mass Spectrometry*.
  [DOI](https://doi.org/10.1016/1044-0305%2894%2987009-8).
- **B-061:** Wallace, W. E. et al. (2017), inter-library comparison for mass
  spectral quality assurance, *Journal of the American Society for Mass
  Spectrometry*. [DOI](https://doi.org/10.1007/s13361-016-1589-4).
- **B-062:** U.S. EPA (2019), *Compendium Method TO-15A: Determination of VOCs in
  Air Collected in Specially Prepared Canisters and Analyzed by GC--MS*.
  [Official method](https://www.epa.gov/sites/default/files/2019-12/documents/to-15a_vocs.pdf).
- **B-063:** U.S. EPA, *Compendium Method TO-17: Determination of VOCs in Ambient
  Air Using Active Sampling onto Sorbent Tubes*.
  [Official method](https://www.epa.gov/sites/default/files/2019-11/documents/to-17r.pdf).
- **B-064:** NIST, *Standard Reference Database 1A: NIST/EPA/NIH Mass Spectral
  Library with Search Program*.
  [Authoritative database](https://www.nist.gov/srd/nist-standard-reference-database-1a).
- **B-065:** NIST, *AMDIS—Identification overview*.
  [Authoritative documentation](https://chemdata.nist.gov/mass-spc/amdis/overview/page6.htm).
- **B-066:** ISO 26142:2010, *Hydrogen detection apparatus—Stationary
  applications*. [ISO catalogue](https://www.iso.org/standard/52319.html).
- **B-067:** IEC 60079-29-1:2016, *Gas detectors—Performance requirements of
  detectors for flammable gases*. [IEC catalogue](https://webstore.iec.ch/en/publication/25484).
- **B-068:** ISO 6141:2015, *Gas analysis—Contents of certificates for calibration
  gas mixtures*. [ISO catalogue](https://www.iso.org/standard/53597.html).
- **B-069:** ISO 6142-1:2015, *Gas analysis—Preparation of calibration gas
  mixtures—Part 1: Gravimetric method for Class I mixtures*.
  [ISO catalogue](https://www.iso.org/committee/53314/x/catalogue/).
- **B-070:** ISO 6143:2025, *Gas analysis—Comparison methods for determining and
  checking the composition of calibration gas mixtures*.
  [ISO catalogue](https://www.iso.org/standard/85579.html).
- **B-071:** ISO 6144:2003, *Gas analysis—Preparation of calibration gas
  mixtures—Static volumetric method*.
  [ISO catalogue](https://www.iso.org/standard/24666.html).
- **B-072:** NIOSH, *Pocket Guide to Chemical Hazards*.
  [Authoritative guide](https://www.cdc.gov/niosh/npg/default.html).
- **B-073:** NIOSH, *Immediately Dangerous to Life or Health (IDLH) Values*.
  [Authoritative values](https://www.cdc.gov/niosh/idlh/default.html).

## Audit verdict

The audit finds substantial, well-bounded biological and engineering knowledge,
but no olfaction-specific principle that survives deduplication today. The
durable contribution is a stricter contract:

> Every chemical inference remains attached to source and transport state,
> realized acquisition action, dynamic and cross-sensitive observation
> operator, calibration and exposure history, uncertainty and support, literal
> outcome, feasible action, safety rule, independent sampling unit, and complete
> lifecycle budget.

Use olfactory biology to generate hypotheses about population coverage,
normalization, temporal acquisition, event-triggered search, sparse distributed
representation, association and maintenance. Credit none of them until the
corresponding candidate beats calibrated analytical instruments, dynamic sensor
models, strong statistical classifiers, Bayesian estimation, reactive and
belief-state control, out-of-support detection, and the full resource boundary
in E-OLFACT-01 through E-OLFACT-14. If those nulls tie, retire the biological
analogy; if a residual survives across independent chemistry, device and plume
regimes, then—and only then—consider a candidate or fixture update.

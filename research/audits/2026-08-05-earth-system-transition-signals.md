# Earth-system transition signals: evidence, failure classes, and engineering nulls

**Audit date:** 2026-08-05

**Scope:** climate and Earth-system tipping mechanisms; critical slowing down;
flickering; spatial warning signals; hysteresis; observation and intervention
limits; normalization against
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback),
[P-007](../principle-registry.md#p-007--prediction-error-allocation),
[P-009](../principle-registry.md#p-009--maintenance-plane), and
[Candidate 003](../../experiments/candidates/003-recovery-dynamics-fragility.md).

**Promotion status:** audit only. The `Proposed-C-ES-*` records below are
proposals for later ledger integration, not active claim IDs.

**Evidence rule:** a transition produced by a numerical Earth-system model is a
causal result *inside that model*. It is not an experimental intervention on
Earth. A trend reconstructed around a known historical transition is
retrospective evidence, not a prospective alarm trial.

## Executive decision

Recovery dynamics remain a useful but narrow candidate sensor. They have a
clear mathematical target when a slowly forced, locally stable state approaches
a bifurcation and its dominant restoring eigenvalue tends toward zero. That
target has been demonstrated in controlled ecological experiments already
recorded as [C-058](../claims.md#c-058) and
[C-059](../claims.md#c-059), and in forced climate-model experiments. It has not
been established as a universal warning signal for Earth-system transitions or
engineered failures.

The Earth-system literature supplies four hard corrections to Candidate 003:

1. **Classify the transition before interpreting the signal.** Bifurcation-
   induced, noise-induced, and rate-induced tipping are different causal
   classes. Abrupt shocks and boundary impacts add further no-warning classes.
2. **Estimate a recovery operator, not just autocorrelation.** Changing noise,
   observation filters, effective heat capacity, forcing rate, or the observed
   variable can alter variance and autocorrelation without shrinking a basin or
   weakening the relevant restoring mode.
3. **Use prospective base rates and negative controls.** Selecting records
   because they later transitioned biases apparent warning performance. An
   operational detector needs false-alarm and miss rates over unselected healthy
   and failing trajectories.
4. **Do not turn a stability trend into a tipping date.** Current historical
   records, proxies, gap filling, model form, and future-forcing uncertainty do
   not support precise extrapolation of major Earth-system tipping times.

No new architectural principle is warranted. The transferable design is a
measurement-and-control composition:

```text
P-006 restoring feedback
  -> local recovery dynamics exist
  -> P-007 prices the value of another observation or safe probe
  -> P-009 measures, audits, and acts within a declared transition class
```

The under-covered object is not “nature predicts collapse.” It is a calibrated
**transition-class-aware fragility monitor** whose output may be “no information
available,” “mechanism mismatch,” or “unobservable,” as well as an alarm.

## Selection and evidence classes

The Intergovernmental Panel on Climate Change defines a tipping point as a
critical threshold beyond which a system reorganizes, often abruptly and/or
irreversibly, and assesses candidate components with different confidence and
reversibility timescales. It does not treat every abrupt or irreversible change
as the same mechanism. See
[IPCC AR6 WGI Chapter 4](https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-4/)
and
[Chapter 9](https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-9/).

This audit uses the following evidence ladder.

| Class | What is actually controlled? | What can be concluded? | What cannot be concluded? |
| --- | --- | --- | --- |
| E1 — living-system intervention | forcing or perturbation is deliberately changed in a living system, ideally with controls | causal response in the tested preparation | universal transition detection or direct applicability to climate/AI |
| E2 — forced numerical Earth-system experiment | forcing, rate, and model state are known; counterfactual runs are possible | causal behavior of the declared model and parameterization | that Earth has the same threshold, basin geometry, or observation map |
| E3 — mechanistic theory or low-order model | equations and transition class are known | existence conditions, expected signatures, counterexamples | prevalence in real systems |
| E4 — prospective observation | detector and threshold are fixed before an independently adjudicated event | real-world operating characteristics if enough events and controls exist | mechanism without attribution work |
| E5 — retrospective observation/proxy | a known event or suspected degradation interval is analyzed after selection | compatibility with a mechanism; hypothesis generation | prospective positive predictive value or causal warning |
| E6 — authoritative assessment | multiple literatures are synthesized with calibrated confidence | research scope and consensus boundary | a new primary causal result |

No retained Earth observation reaches E4 for a major climate tipping event. The
strongest causal Earth-system entries here are E2 model-forcing experiments.
The strongest physical living-system interventions remain C-058 and C-059; they
are not duplicated below.

## Mathematical boundary of critical slowing down

Let a partially observed stochastic system be

$$
d x_t=f(x_t,\mu_t)\,dt+G(x_t,\mu_t,t)\,dW_t,
\qquad
y_t=h(x_t,t)+\eta_t,
$$

where $x_t$ is the latent state, $\mu_t$ is a forcing or control parameter,
$G$ maps process noise $dW_t$ into state space, $y_t$ is the observation,
$h$ is the observation operator, and $\eta_t$ is measurement error. Around a
stable quasi-equilibrium $x^*(\mu)$,

$$
A(\mu)=\left.\frac{\partial f}{\partial x}\right|_{x=x^*(\mu)},
\qquad
\kappa(\mu)=-\max_i \operatorname{Re}\lambda_i(A)>0.
$$

$A$ has units of inverse time, $\lambda_i(A)$ and $\kappa$ have units
$\mathrm{s}^{-1}$ (or the declared system-time unit), and the local e-folding
recovery time is

$$
\tau_r=\frac{1}{\kappa}\quad\text{time}.
$$

For the scalar Ornstein–Uhlenbeck approximation

$$
d z_t=-\kappa z_t\,dt+\sigma\,dW_t,
$$

sampled every $\Delta t$,

$$
\rho_1=e^{-\kappa\Delta t},
\qquad
\operatorname{Var}(z)=\frac{\sigma^2}{2\kappa}.
$$

Here $z$ has the state unit, $\sigma$ has state-unit $\mathrm{time}^{-1/2}$,
$\rho_1$ is dimensionless, and variance has squared state units. Near a generic
fold bifurcation under sufficiently slow forcing and stable noise statistics,
$\kappa\rightarrow0^+$, so recovery slows, $\rho_1\rightarrow1$, and variance
can increase.

Those equations do **not** license the converse “rising autocorrelation implies
an approaching fold.” The inference additionally requires:

- a locally equilibrated or slowly drifting state;
- excitation of the relevant mode;
- observation of that mode through $h$;
- sufficiently stationary process and measurement noise;
- sampling fast enough to resolve recovery and long enough to estimate it;
- no changing filter, aggregation, infilling, or effective inertia that mimics
  a longer response time;
- a transition whose causal route actually changes local stability.

These conditions are testable in a simulator and only partially testable in a
single Earth record.

## Transition classes and expected warnings

Ashwin et al. separated bifurcation-induced (B), noise-induced (N), and
rate-induced (R) tipping in open systems. The table extends that useful taxonomy
with operational failure classes.

| Transition class | Causal event | Is $\kappa\to0$ required? | What may warn? | Recovery-sensor verdict |
| --- | --- | ---: | --- | --- |
| B-tipping near a fold | current attractor loses local stability or disappears as forcing changes | usually yes for the critical mode | slower impulse recovery, dominant pole toward the stability boundary, variance/AC under assumptions | in scope |
| Hopf or oscillatory instability | a complex-conjugate pair crosses the stability boundary | real part slows, frequency matters | multivariate pole/damping estimate, spectral change | scalar return time is incomplete |
| N-tipping | noise carries the state across a basin boundary while local stability may remain | no | barrier/escape-rate change, extreme-event or noise-amplitude model | may give no warning |
| R-tipping | forcing changes too quickly for the state to track an otherwise stable branch | no | forcing rate relative to tracking capacity; state-to-moving-attractor lag | static recovery threshold may miss it |
| flickering | noise produces repeated switches between metastable basins before sustained occupancy | not necessarily | transition occupancy, dwell times, skewness, multimodality | different signal family |
| hysteretic transition | forward and reverse paths cross different thresholds | only near a local bifurcation edge | branch identity, path history, forcing direction, recovery rate | one scalar “distance” is insufficient |
| boundary/impact transition | state hits a constraint, saturation, or contact boundary | no | headroom and reachability to the boundary | use constraint monitoring |
| abrupt component or parameter jump | fault occurs without a gradual precursor | no | sometimes cause-specific precursor; otherwise post-change detection | no advance warning claim |
| hidden-mode instability | destabilizing eigenmode is weakly excited or weakly observed | may occur latently | targeted excitation, sensor redesign, observability analysis | passive metric can miss it |
| benign dynamical slowing | inertia, filtering, or gain changes while no dangerous attractor is approached | apparent only | physical/context model and negative controls | false-alarm class |

Candidate 003 currently includes a fold-like gradual track, stable confounds,
a sudden jump, and nonlinear queues. It should not be described as a generic
tipping benchmark until it also separates N-, R-, flickering, hysteretic,
hidden-mode, and benign-slowing tracks.

## Evidence map

Source labels `ES-*` are local audit handles, not stable claim identifiers.

### ES-01 — CLIMBER2 degenerate fingerprinting

**Primary study.** Held and Kleinen, “Detection of climate system bifurcations
by degenerate fingerprinting,” *Geophysical Research Letters* 31, L23207
(2004). [DOI: 10.1029/2004GL020972](https://doi.org/10.1029/2004GL020972).

**Exact result.** The authors proposed estimating the smallest decay rate and
tested it in CLIMBER2 thermohaline-circulation experiments: 5,000-year
equilibrium runs at six freshwater forcings, diffusivity variants, and a
50,000-year transient CO2-forcing run ending in collapse. A leading spatial
mode plus an AR-style decay estimate approached zero in the model.

**Evidence class and limit.** E2. Forcing, model state, and transition are
known, so the result is causal within CLIMBER2. The unusually long model records,
white-noise excitation, leading-mode construction, and quasi-equilibrium
assumptions are not available as such in the observed ocean.

**Project use.** Direct mathematical support for measuring a dominant return
rate in Candidate 003. It also establishes the strongest null: standard
state-space/system identification already targets the same pole.

### ES-02 — fully coupled AMOC hosing experiment

**Primary study.** Boulton, Allison, and Lenton, “Early warning signals of
Atlantic Meridional Overturning Circulation collapse in a fully coupled climate
model,” *Nature Communications* 5, 5752 (2014).
[DOI: 10.1038/ncomms6752](https://doi.org/10.1038/ncomms6752).

**Exact result.** In a freshwater-hosing run of a coupled atmosphere–ocean
general circulation model, lag-1 autocorrelation and variance increased before
the forced AMOC collapse at some latitudes. Reported warning reached up to 250
model years, but only after roughly 550 model years of monitoring, and
statistical significance varied spatially.

**Evidence class and limit.** E2. This is a stronger model-complexity test than
ES-01, not an observed-ocean alarm trial. The long monitoring requirement and
latitude dependence are part of the result, not implementation details to omit.

**Project use.** Multivariate/spatial sensor selection and monitoring latency
must be scored. “Detected before failure” is inadequate when detection needs
more history than the intervention horizon permits.

### ES-03 — AMOC hysteresis is model-supported but threshold location varies

**Primary study.** Rahmstorf et al., “Thermohaline circulation hysteresis: a
model intercomparison,” *Geophysical Research Letters* 32, L23605 (2005).
[DOI: 10.1029/2005GL023655](https://doi.org/10.1029/2005GL023655).

**Exact result.** Eleven intermediate-complexity climate models underwent
slowly increasing and decreasing North Atlantic freshwater forcing. All showed
hysteresis attributed to salt-advection feedback, while hysteresis width and
the modeled present-day position varied substantially. Seven standard model
configurations placed the present state in a bistable regime and four in a
monostable regime.

**Evidence class and limit.** E2 model intercomparison. Agreement on a modeled
mechanism is material; disagreement on state location means the numerical
freshwater thresholds are not Earth constants.

**Project use.** A P-006 feedback loop can create path dependence as well as
restore a state. Candidate 003 needs forward/reverse sweeps and branch identity;
recovery on one branch does not identify the reverse threshold.

### ES-04 — Antarctic hysteresis is a long-horizon model commitment

**Primary study.** Garbe et al., “The hysteresis of the Antarctic Ice Sheet,”
*Nature* 585, 538–544 (2020).
[DOI: 10.1038/s41586-020-2727-5](https://doi.org/10.1038/s41586-020-2727-5).

**Exact result.** Quasi-static warming and cooling simulations with the
Parallel Ice Sheet Model produced multiple temperature thresholds and strongly
path-dependent regrowth. The study reports long-term committed ice loss under
held warming levels; the model was forced at one degree Celsius per 10,000
years for the quasi-static reference sweep.

**Evidence class and limit.** E2, supported against palaeodata but not a
controlled Earth intervention. Model structure, forcing path, equilibrium
timescale, and omitted/parameterized processes condition the thresholds.

**Project use.** “Irreversible” must always name a timescale and reversal path.
For AI systems, restoration cost and reachable state after rollback must be
measured separately from pre-failure recovery speed.

### ES-05 — rate-induced AMOC collapse

**Primary study.** Lohmann and Ditlevsen, “Risk of tipping the overturning
circulation due to increasing rates of ice melt,” *Proceedings of the National
Academy of Sciences* 118(9), e2017989118 (2021).
[DOI: 10.1073/pnas.2017989118](https://doi.org/10.1073/pnas.2017989118).

**Exact result.** In a global ocean model, sufficiently fast freshwater-forcing
changes produced AMOC collapse even at small forcing amplitudes; slower changes
to the same level did not. Chaotic variability made the outcome harder to
predict.

**Evidence class and limit.** E2. This establishes rate dependence in the
declared ocean model, not an Earth threshold or forecast.

**Project use.** Add matched-endpoint, different-ramp-rate trials. A detector
that sees only the instantaneous operating point and local return rate can miss
a tracking failure caused by the forcing derivative.

### ES-06 — B/N/R mechanisms are not interchangeable

**Primary studies.** Ashwin et al., “Tipping points in open systems:
bifurcation, noise-induced and rate-dependent examples in the climate system,”
*Philosophical Transactions of the Royal Society A* 370, 1166–1184 (2012),
[DOI: 10.1098/rsta.2011.0306](https://doi.org/10.1098/rsta.2011.0306); Ritchie
and Sieber, “Early-warning indicators for rate-induced tipping,” *Chaos* 26,
093116 (2016),
[DOI: 10.1063/1.4963012](https://doi.org/10.1063/1.4963012).

**Exact result.** Ashwin et al. construct B-, N-, and R-tipping in a global
energy-balance model and show that R-tipping need not involve either noise or a
quasi-static bifurcation. Ritchie and Sieber analyze a drifting noisy normal
form and show that common variance/autocorrelation indicators can appear with a
delay relative to the fastest drift and tipping path.

**Evidence class and limit.** E3 mathematical/model evidence. It establishes
possible mechanisms and counterexamples, not their frequency in Earth or
production systems.

**Project use.** The monitor must output a mechanism posterior or applicability
diagnostic, not a decontextualized scalar called “tipping risk.”

### ES-07 — retrospective palaeoclimate slowing signal

**Primary study.** Dakos et al., “Slowing down as an early warning signal for
abrupt climate change,” *Proceedings of the National Academy of Sciences* 105,
14308–14312 (2008).
[DOI: 10.1073/pnas.0802430105](https://doi.org/10.1073/pnas.0802430105).

**Exact result.** The authors selected eight reconstructed ancient abrupt
climate shifts and reported rising short-term autocorrelation before all eight
after detrending and windowed analysis.

**Evidence class and limit.** E5. The records concern known transitions, are
heterogeneous proxies with different resolution and dating properties, and do
not estimate prospective false-alarm rates. Natural fluctuations substitute
for controlled perturbations. The result is compatibility evidence, not an
eight-of-eight prospective detector score.

**Project use.** Candidate 003 must never build its test set by cropping only
pre-failure intervals. Healthy intervals, other transition types, and complete
unselected runs determine positive predictive value.

### ES-08 — a negative palaeoclimate result

**Primary study.** Ditlevsen and Johnsen, “Tipping points: early warning and
wishful thinking,” *Geophysical Research Letters* 37, L19703 (2010).
[DOI: 10.1029/2010GL044486](https://doi.org/10.1029/2010GL044486).

**Exact result.** In aligned high-resolution NGRIP records of 25
Dansgaard–Oeschger events, the authors found no significant joint increase in
variance and autocorrelation before the jumps. They interpreted the result as
consistent with noise-induced transitions with limited warning.

**Evidence class and limit.** E5. Absence of these indicators does not uniquely
prove a noise mechanism; proxy smoothing, scale selection, and weakly observed
modes remain alternatives. It nevertheless directly refutes a claim that every
abrupt palaeoclimate transition shows detectable slowing.

**Project use.** A missed-alarm class is part of the scientific model, not an
edge case to hide. Candidate 003 must report class-conditional miss rates.

### ES-09 — flickering is not ordinary slowing

**Primary study.** Wang et al., “Flickering gives early warning signals of a
critical transition to a eutrophic lake state,” *Nature* 492, 419–422 (2012).
[DOI: 10.1038/nature11655](https://doi.org/10.1038/nature11655).

**Exact result.** Sediment-derived records from a Chinese lake and a
mathematical lake model showed rising variance together with *decreasing*
autocorrelation and skewness beginning 10–30 years before the reconstructed
eutrophication transition. The pattern was interpreted as flickering between
states under large perturbations rather than critical slowing down.

**Evidence class and limit.** The lake record is E5 and the matched model is E3.
The event was not prospectively alarmed or experimentally induced. Sparse
sediment records, catchment history, proxy construction, and model choice
condition the mechanism attribution.

**Project use.** Detect multimodality, state occupancy, and dwell-time changes
separately from exponential recovery. A system already flickering may be unsafe
to probe and should not be forced into the Candidate 003 curve fit.

### ES-10 — spatial signals are model-conditional

**Primary studies.** Kéfi et al., “Spatial vegetation patterns and imminent
desertification in Mediterranean arid ecosystems,” *Nature* 449, 213–217
(2007), [DOI: 10.1038/nature06111](https://doi.org/10.1038/nature06111);
Dakos et al., “Spatial correlation as leading indicator of catastrophic
shifts,” *Theoretical Ecology* 3, 163–174 (2010),
[DOI: 10.1007/s12080-009-0060-6](https://doi.org/10.1007/s12080-009-0060-6).

**Exact result.** Kéfi et al. combined field vegetation-patch data across
Mediterranean grazing gradients with a stochastic cellular-automaton model;
model departures from a power-law patch distribution appeared near modeled
desertification. Dakos et al. showed in spatial ecosystem models that neighbor
correlation could rise before a fold and outperform temporal indicators when
heterogeneity and connectivity were sufficient.

**Evidence class and limit.** The field comparison is cross-sectional E5-like
observational evidence, not a longitudinal prospective collapse. Both studies'
near-threshold interpretation depends materially on models. Spatial sampling,
resolution, connectivity, exogenous spatial gradients, and boundary geometry
can create or erase the statistics.

**Project use.** A distributed AI system should compare temporal return modes
with spatial cross-component correlation, but only after permutation,
topology-preserving, load-gradient, and sensor-resolution controls.

### ES-11 — generic warning statistics need explicit error rates

**Primary studies.** Boettiger and Hastings, “Quantifying limits to detection
of early warning for critical transitions,” *Journal of the Royal Society
Interface* 9, 2527–2539 (2012),
[DOI: 10.1098/rsif.2012.0125](https://doi.org/10.1098/rsif.2012.0125); and
“Early warning signals and the prosecutor's fallacy,” *Proceedings of the Royal
Society B* 279, 4734–4739 (2012),
[DOI: 10.1098/rspb.2012.2085](https://doi.org/10.1098/rspb.2012.2085).

**Exact result.** In simulated stochastic systems, common summary-statistic
indicators showed severe sensitivity/reliability tradeoffs even under favorable
assumptions. Conditioning analysis on trajectories known to have transitioned
by chance elevated false positives. Likelihood/model-based comparison improved
performance in the tested cases.

**Evidence class and limit.** E3 simulation and statistical-method evidence.
The exact rates depend on the models and decision threshold; the general
selection-bias argument does not.

**Project use.** Report receiver-operating and precision–recall behavior under
the intended event base rate. Compare explicit generative models, not only
Kendall trends in rolling variance or autocorrelation.

### ES-12 — a physical false alarm in sea-ice modeling

**Primary study.** Wagner and Eisenman, “False alarms: How early warning signals
falsely predict abrupt sea ice loss,” *Geophysical Research Letters* 42,
10335–10341 (2015).
[DOI: 10.1002/2015GL066297](https://doi.org/10.1002/2015GL066297).

**Exact result.** An idealized climate model showed increasing autocorrelation
as summer sea-ice area vanished even though the model had no bifurcation and no
accelerating retreat. Variance decreased. The authors traced the slowing to a
change in effective heat capacity and also constructed a case where both common
indicators rose without a physically reachable bifurcation.

**Evidence class and limit.** E3 mechanistic counterexample. It does not show
that observed Arctic indicators have the same cause, but it disproves
universality of the statistic-to-bifurcation mapping.

**Project use.** Add benign changes in inertia, caching, batching, controller
period, and observation filtering. A detector must distinguish weakened
restoring gain from increased effective state capacity.

### ES-13 — observation-based AMOC signals are proxy inference

**Primary study.** Boers, “Observation-based early-warning signals for a
collapse of the Atlantic Meridional Overturning Circulation,” *Nature Climate
Change* 11, 680–688 (2021).
[DOI: 10.1038/s41558-021-01097-4](https://doi.org/10.1038/s41558-021-01097-4).

**Exact result.** The study fit restoring-rate and common critical-slowing
indicators to eight sea-surface-temperature- and salinity-based AMOC indices
and found spatially consistent trends interpreted as loss of stability during
the last century.

**Evidence class and limit.** E5. The indices are fingerprints, not a century
of direct AMOC transport measurement. The inference depends on observation
products, proxy validity, detrending, window length, noise model, and conceptual
AMOC dynamics. No collapse has occurred to adjudicate the alarm.

**Project use.** A proxy must pass an observation-model benchmark: latent-mode
correlation, stability of that mapping across regimes, missing-data behavior,
and agreement among independently constructed sensors.

### ES-14 — Greenland and Amazon stability trends are not observed tipping

**Primary studies.** Boers and Rypdal, “Critical slowing down suggests that the
western Greenland Ice Sheet is close to a tipping point,” *Proceedings of the
National Academy of Sciences* 118, e2024192118 (2021),
[DOI: 10.1073/pnas.2024192118](https://doi.org/10.1073/pnas.2024192118);
Boulton, Lenton, and Boers, “Pronounced loss of Amazon rainforest resilience
since the early 2000s,” *Nature Climate Change* 12, 271–278 (2022),
[DOI: 10.1038/s41558-022-01287-8](https://doi.org/10.1038/s41558-022-01287-8).

**Exact result.** The Greenland study found rising variance and autocorrelation
in central-western melt-rate/derived height records and fit a melt–elevation
feedback model. The Amazon study analyzed 1991–2016 remotely sensed vegetation
optical depth; 76.2% of 6,369 selected forest grid cells had positive lag-1
autocorrelation trends from 2003, with stronger inferred resilience loss in drier
areas and nearer human land use.

**Evidence class and limit.** E5 plus conceptual-model support. Neither study
observed and prospectively predicted the proposed large-scale tipping event.
Local-to-whole-system representativeness, reconstruction/sensor changes,
forcing nonstationarity, droughts, fire/land use, and spatial dependence limit
causal attribution and exact threshold inference.

**Project use.** Large sensor counts do not create independent transition
replicates. Report effective sample size under shared forcing and spatial
correlation; separate degradation detection from tipping classification.

### ES-15 — statistical tipping-time forecast and its stress test

**Primary studies.** Ditlevsen and Ditlevsen, “Warning of a forthcoming collapse
of the Atlantic meridional overturning circulation,” *Nature Communications*
14, 4254 (2023),
[DOI: 10.1038/s41467-023-39810-w](https://doi.org/10.1038/s41467-023-39810-w);
Ben-Yami et al., “Uncertainties too large to predict tipping times of major
Earth system components from historical data,” *Science Advances* 10,
eadl4841 (2024),
[DOI: 10.1126/sciadv.adl4841](https://doi.org/10.1126/sciadv.adl4841).

**Exact result.** Ditlevsen and Ditlevsen fit a stochastic fold model to an SST
AMOC fingerprint and estimated a mid-century central collapse time under their
assumptions. Ben-Yami et al. stress-tested tipping-time methods and input
uncertainties. Some methods returned finite tipping dates for a linear system
that could not tip under nonstationary red noise; alternate AMOC fingerprints
shifted estimates by decades, while observational-dataset uncertainty could
spread estimates by thousands of years.

**Evidence class and limit.** Both are E3/E5 statistical modeling of historical
proxies, not prospective observations of an AMOC collapse. The latter study
directly shows that finite date output is not evidence that a bifurcation exists.

**Project use.** Candidate 003 may estimate a current recovery time and a
calibrated alarm horizon. It must not extrapolate a fitted pole to an exact
failure date unless the forcing path and model class are experimentally locked
and held-out calibration supports that operation.

### ES-16 — physics-based indicators can outperform generic statistics in one model

**Primary study.** van Westen, Kliphuis, and Dijkstra, “Physics-based early
warning signal shows that AMOC is on tipping course,” *Science Advances* 10,
eadk1189 (2024).
[DOI: 10.1126/sciadv.adk1189](https://doi.org/10.1126/sciadv.adk1189).

**Exact result.** A targeted, slowly freshwater-forced CESM run produced an
AMOC tipping event. The authors proposed the minimum of AMOC-induced freshwater
transport at the southern Atlantic boundary as a physics-based indicator.
Classical critical-slowing indicators in that run were sensitive to the chosen
analysis window; reanalysis products were then compared with the physical
indicator.

**Evidence class and limit.** The tipping and indicator validation are E2
inside one targeted CESM experiment. The present-Earth interpretation is E5:
reanalysis is model-assimilated observation, no AMOC collapse has adjudicated
the signal, and the forced model trajectory is not a measured future.

**Project use.** Mechanism-specific conserved-flow or balance indicators are
strong nulls against a generic recovery statistic. In engineered systems,
compare return rate with retry reproduction number, conservation residual,
queue-flow balance, and controller phase margin.

## What the evidence does and does not establish

| Proposition | Audit judgment | Reason |
| --- | --- | --- |
| A dominant recovery rate can decrease before a slowly forced bifurcation | established in theory, living experiments, and multiple forced models | C-058/C-059, ES-01, ES-02 |
| Rising lag-1 autocorrelation alone identifies an approaching dangerous bifurcation | disputed | ES-08 and ES-12 supply missing- and false-alarm cases |
| Variance plus autocorrelation is a universal classifier | disputed | noise, filtering, changing inertia, spatial aggregation, and model mismatch break the converse |
| Flickering and critical slowing are the same mechanism | false | ES-09 reports a different signature and basin-switching interpretation |
| Spatial statistics can warn earlier than temporal statistics | plausible under declared coupled spatial models | ES-10; field forecast evidence remains weak |
| Hysteresis means rollback restores the previous state | false | ES-03 and ES-04 show path-dependent reverse thresholds |
| A stable operating point implies safe tracking under fast forcing | false in model classes | ES-05/ES-06 rate-induced tipping |
| Historical stability trends determine a reliable tipping date | currently unsupported for major Earth-system components | ES-15 |
| Physics-specific indicators should be compared with generic EWS | established evaluation requirement | ES-16 and system-identification nulls |

## Failure classes where recovery cannot warn

“Cannot warn” here means no information about the future event exists in the
pre-event recovery trajectory available to the detector—not merely that the
chosen estimator is weak.

1. **Unannounced step fault.** A parameter or component jumps from healthy to
   failed with identical pre-event dynamics. Any claimed positive lead time is
   leakage or use of another precursor.
2. **Pure noise escape under fixed local dynamics.** The basin barrier is
   crossed by a rare disturbance while $A$, $\kappa$, and the observation map
   remain fixed. Recovery estimates can rank local stiffness but cannot predict
   the random escape time.
3. **Rate-induced tracking failure with unchanged frozen stability.** Each
   instantaneous equilibrium is locally stable, but the forcing trajectory
   moves faster than the state can track. A recovery metric without $\dot\mu$
   and tracking error is incomplete.
4. **Unobserved critical mode.** The unstable direction lies in the null space
   of the sensor or is never excited. No passive estimator can identify it from
   the provided output.
5. **Boundary collision.** A state hits a hard limit while return dynamics away
   from the boundary are unchanged. Headroom/reachability, not slowing, carries
   the warning.
6. **Delayed or remote trigger.** Stored work, a timed action, external actor,
   or downstream dependency activates later without changing current local
   dynamics.
7. **Adversarial mimicry or concealment.** An actor shapes telemetry or probe
   responses to appear stable. This violates the stochastic-identification
   assumptions and requires integrity/security controls.
8. **Probe too small, too large, or unsafe.** Below the noise floor it contains
   no useful excitation; above the local linear region it estimates different
   dynamics or triggers the event itself.

These are preregistered negative controls for Candidate 003, not reasons to
discard recovery sensing where its assumptions hold.

## False alarms and ambiguous signals

The main false-alarm families are equally important:

- changing process-noise color or amplitude;
- changing measurement noise, dropout, temporal infilling, or smoothing;
- sliding-window edge effects and post-selected detrending;
- increasing effective heat capacity, batching interval, cache residence time,
  or observation aggregation without loss of stability;
- workload/seasonality/forcing trends that violate local stationarity;
- switching among healthy modes or scheduled controller regimes;
- spatially shared forcing mistaken for growing coupling;
- a harmless or reversible bifurcation mistaken for a dangerous transition;
- selecting only trajectories or windows known to end in a transition;
- fitting a fold model to a process for which no fold is possible.

A maintenance plane must suppress action when the applicability checks fail.
“Unknown due to observation drift” is a better output than a numerically precise
but uncalibrated fragility score.

## Strongest null models

### Dynamical-systems and system-identification nulls

1. **Innovation-form linear state-space model.** Fit a multivariate model with
   exogenous inputs and time-varying or piecewise-stationary noise. Use Kalman
   innovations for residual checks and estimate pole uncertainty.
2. **Standard active identification.** Recursive least squares and
   subspace-identification variants receive the same probes, abort decisions,
   telemetry, and compute budget as Candidate 003. This is already B5 and is the
   primary novelty null.
3. **Competing stochastic mechanism models.** Compare stationary OU,
   drifting-OU, fold normal form, double-well/flickering, changing-noise, and
   rate-driven tracking models by held-out predictive likelihood and calibrated
   posterior predictive checks.
4. **Physics/accounting model.** Use conservation laws, queue-flow balance,
   controller gain/phase margin, saturation distance, and retry reproduction
   gain. A domain-specific predictor that wins is the preferred explanation.
5. **Observability and controllability audit.** Calculate or estimate which
   local modes can be excited safely and observed. Failure here predicts a miss
   before testing an alarm statistic.

### Change-detection nulls

1. **CUSUM and generalized likelihood-ratio detection** on declared residuals,
   including an oracle model-form version as a ceiling.
2. **Page–Hinkley and EWMA** for low-cost mean/residual drift.
3. **Bayesian online change-point detection** with hazard-rate sensitivity and
   multiple healthy regimes.
4. **Conformal or exchangeability-based monitoring** where its assumptions can
   be audited, to expose miscalibration under drift.
5. **Time-only, shuffled-order, and window-location controls** to reveal event-
   position leakage and the prosecutor's-fallacy selection effect.

The recovery candidate is useful only if it adds lead time, calibration, or
diagnostic specificity at equal observation, excitation, and compute cost. A
different narrative over the same identified pole is not novelty.

## Decisive AI/system test suite

Extend Candidate 003 with preregistered trajectory families while keeping the
current equal-budget rules.

| Track | Ground-truth construction | Decisive question |
| --- | --- | --- |
| F — gradual fold | dominant pole approaches one under a slow ramp; include fixed-marginal and natural-noise variants | does active recovery beat passive ID and change detection? |
| H — Hopf | complex pole pair loses damping at matched scalar recovery summary | does multivariate pole estimation prevent scalar misclassification? |
| N — noise escape | fixed local Jacobian and shrinking barrier, plus fixed-barrier/increasing-noise controls | can the method admit that event time is not recoverably predictable? |
| R — rate-induced | same start/end forcing with multiple ramp rates; frozen equilibria remain stable | does a rate/tracking model beat recovery-only alarms? |
| FL — flickering | noisy double-well with known basin occupancy and barrier | do multimodality/dwell-time models beat exponential recovery fits? |
| HY — hysteresis | forward and reverse parameter sweeps with two stable branches | is branch/history represented, and is rollback reachability estimated? |
| SP — spatial | coupled grid with controllable heterogeneity, connectivity, gradients, and sensor resolution | do spatial indicators survive topology-preserving nulls? |
| HM — hidden mode | critical eigenmode has swept excitation and observation gain | is the applicability boundary predicted by observability analysis? |
| B — boundary | queue or memory reaches a hard constraint without pole drift | do headroom/reachability nulls win as they should? |
| J — abrupt jump | identical pre-event distributions and dynamics, random jump time | does every method correctly report no advance skill? |
| CF — confounds | changing noise color, batching, cache inertia, filtering, seasonality, and missing data | are false alarms held below the locked budget? |

### Protocol requirements

- Generate complete unselected trajectories, then hide labels, mechanisms,
  transition times, and benign/failing proportions until scoring.
- Lock detectors on separate calibration families. Include prevalence sweeps so
  precision is reported, not inferred from sensitivity and specificity alone.
- Give all methods identical telemetry and causal timestamps. Give active
  methods identical safe excitation and abort rules.
- Score mechanism classification and applicability rejection in addition to
  binary alarm performance.
- Report lead time divided by the minimum safe intervention time. Absolute
  seconds alone do not transfer across systems.
- Report false alarms per operating time and per healthy regime, misses per
  transition class, calibration error, recovery/pole error, compute joules,
  probe joules, and service disruption.
- Evaluate coverage under sensor dropout, altered noise, topology shift, and a
  new observation operator.
- Include a counterfactual hold/reversal when safe: after an alarm, freeze or
  reverse the forcing in randomized simulator replicas. Improvement of the
  measured mode supports—but does not alone prove—the proposed mechanism.
- Reject a universal-warning claim if the detector alarms on J before the jump,
  assigns a fold date to a non-tipping linear process, or hides N/R/HM misses in
  an aggregate score.

### Promotion gate

Promotion beyond Candidate 003 should require all of the following:

1. superiority to standard active identification on at least one preregistered
   class at equal probe and compute cost;
2. no material loss to mechanism-specific nulls on their own applicable tracks;
3. calibrated abstention on transition classes with no recoverable precursor;
4. a prospective false-alarm ceiling across benign dynamical-slowing controls;
5. correct uncertainty coverage for recovery rate and class posterior;
6. an intervention decision that improves expected loss after including probe,
   monitoring, delay, and false-action costs.

## Observation and intervention limits

Earth-system monitoring cannot ethically or practically randomize the planet,
repeat the same climate trajectory, inject matched global probes, or observe a
large sample of adjudicated major tipping events. Long response times can exceed
instrument records; palaeoclimate proxies add dating, smoothing, spatial, and
observation-model uncertainty; reanalyses blend observations with model
assumptions; and the future forcing path is itself unknown.

The appropriate Earth-science response is triangulation: process models,
ensembles, palaeorecords, multiple instruments, physically motivated
fingerprints, negative controls, and explicit uncertainty. The appropriate
engineering response is different because controlled simulation, shadow
replicas, bounded perturbation, and repeated held-out trials are available. We
should use that stronger design rather than importing the weakest inferential
features of Earth observation.

Intervention also changes the inference problem. A successful precaution can
prevent the labeled event, making naive evaluation call the alarm a false
positive. Decision evaluation therefore needs counterfactual replicas or a
causal policy design, not only event prediction. Conversely, probing a fragile
system can consume the remaining margin. P-009 must own a hard safety gate,
probe budget, abort path, and independent rollback; the detector must never be
the sole guard on its own excitation.

## Deduplication against the principle registry

### P-006 — homeostatic negative feedback

Critical slowing measures a weakening property of a restoring loop; it is not a
new feedback architecture. Hysteresis further shows that feedback can create
multiple stable branches and path dependence. Keep the stabilizer under P-006
and attach recovery sensing as a diagnostic candidate.

### P-007 — prediction-error allocation

Surprise, residuals, and information gain can schedule observation or choose a
probe, but prediction error is not a stability margin. Use P-007 to allocate a
finite sensing budget across uncertain modes. Do not promote “high error means
near tipping.”

### P-009 — maintenance plane

Prospective monitoring, controlled excitation, provenance, calibration,
abstention, and safe action belong to P-009. It is the natural owner of the
Candidate 003 loop. The maintenance plane must remain separately observable and
must not destabilize the task plane it measures.

### Candidate 003 — recovery dynamics as latent fragility sensing

Retain the candidate, but narrow its claim to *gradual local stability loss in
observable, safely excitable modes*. Expand its falsification set as specified
above. “Tipping-point prediction” is too broad; “transition-class-aware local
fragility estimation” is accurate.

## Proposed claims for later ledger integration

### Proposed-C-ES-01

- **Statement:** In forced CLIMBER2 thermohaline-circulation experiments, a
  leading-mode estimate of the smallest decay rate decreased toward zero before
  the model's bifurcation and collapse.
- **Status:** established for the declared numerical model.
- **Primary source:** `held2004degenerate`.
- **Destination:** Candidate 003; P-006 diagnostic note; system-identification
  null required.

### Proposed-C-ES-02

- **Statement:** In one freshwater-hosed fully coupled atmosphere–ocean model,
  variance and lag-1 autocorrelation produced spatially variable warning up to
  250 model years before AMOC collapse after roughly 550 years of monitoring.
- **Status:** established for the declared model experiment; not an Earth
  forecast.
- **Primary source:** `boulton2014amoc`.
- **Destination:** Candidate 003 spatial/multivariate and history-length tests.

### Proposed-C-ES-03

- **Statement:** Eleven intermediate-complexity climate models showed AMOC
  hysteresis under slow freshwater sweeps, while disagreeing materially about
  present-state bistability and distance to the modeled threshold.
- **Status:** established model-intercomparison result.
- **Primary source:** `rahmstorf2005hysteresis`.
- **Destination:** P-006 failure/path-dependence note; Candidate 003 hysteresis
  track.

### Proposed-C-ES-04

- **Statement:** A quasi-static Parallel Ice Sheet Model experiment produced
  multiple Antarctic ice-loss thresholds and reverse paths that did not restore
  the current configuration at present-day temperature.
- **Status:** established for the model and forcing protocol; threshold values
  are model-conditioned.
- **Primary source:** `garbe2020antarctic`.
- **Destination:** rollback/reversibility definition under P-009.

### Proposed-C-ES-05

- **Statement:** A global ocean model collapsed under sufficiently rapid,
  small-amplitude freshwater forcing while slower forcing to the same level did
  not, demonstrating rate-induced AMOC tipping in that model.
- **Status:** established for the declared model.
- **Primary source:** `lohmann2021rate`.
- **Destination:** Candidate 003 rate-induced track; P-006 tracking boundary.

### Proposed-C-ES-06

- **Statement:** Bifurcation-, noise-, and rate-induced tipping are distinct
  dynamical mechanisms; local critical slowing is not required for the latter
  two.
- **Status:** established theoretical distinction; empirical prevalence is
  system-specific.
- **Primary sources:** `ashwin2012open`, `ritchie2016rate`.
- **Destination:** applicability gate for Candidate 003.

### Proposed-C-ES-07

- **Statement:** Eight selected palaeoclimate proxy records showed rising
  autocorrelation before known abrupt transitions, but the retrospective,
  event-conditioned design does not establish prospective false-alarm rates.
- **Status:** established observation of the analyzed records; causal and
  predictive interpretation plausible but unvalidated.
- **Primary sources:** `dakos2008climate`, `boettiger2012prosecutor`.
- **Destination:** Candidate 003 data-selection control.

### Proposed-C-ES-08

- **Statement:** In aligned NGRIP records of 25 Dansgaard–Oeschger events, the
  cited analysis found no significant joint increase in variance and
  autocorrelation before the jumps.
- **Status:** established result of that analysis; noise-induced attribution is
  plausible, not uniquely identified.
- **Primary source:** `ditlevsen2010wishful`.
- **Destination:** Candidate 003 missed-warning boundary.

### Proposed-C-ES-09

- **Statement:** In one retrospective lake-sediment record and a matched model,
  rising variance with decreasing autocorrelation and skewness began 10–30
  years before reconstructed eutrophication and was interpreted as flickering,
  not ordinary critical slowing.
- **Status:** plausible real-system mechanism; retrospective and model-assisted.
- **Primary source:** `wang2012flickering`.
- **Destination:** Candidate 003 flickering/classification track.

### Proposed-C-ES-10

- **Statement:** Spatial ecosystem models predict rising neighbor correlation
  before some coupled fold transitions, but field patch-pattern observations do
  not by themselves establish prospective warning of desertification.
- **Status:** established in declared models; plausible and model-conditioned in
  field systems.
- **Primary sources:** `kefi2007spatial`, `dakos2010spatial`.
- **Destination:** Candidate 003 spatial track; P-007 sensor allocation.

### Proposed-C-ES-11

- **Statement:** Common early-warning summary statistics can have severe error
  tradeoffs and elevated false positives when analysts condition on trajectories
  already known to transition.
- **Status:** established in the cited statistical simulations; universal
  numerical error rates are not claimed.
- **Primary sources:** `boettiger2012limits`, `boettiger2012prosecutor`.
- **Destination:** prospective calibration rule for P-009 and Candidate 003.

### Proposed-C-ES-12

- **Statement:** In an idealized sea-ice model with no bifurcation or
  accelerating retreat, autocorrelation rose as summer ice vanished because of
  changing effective heat capacity, demonstrating a mechanistic false alarm.
- **Status:** established counterexample in the declared model.
- **Primary source:** `wagner2015falsealarms`.
- **Destination:** Candidate 003 benign-slowing confound track.

### Proposed-C-ES-13

- **Statement:** Observation-based AMOC, western Greenland, and Amazon analyses
  report trends compatible with declining stability, but they use proxies or
  reconstructed states and have not prospectively predicted an adjudicated
  large-scale tipping event.
- **Status:** plausible, disputed in interpretation and threshold proximity.
- **Primary sources:** `boers2021amoc`, `boersrypdal2021greenland`,
  `boulton2022amazon`.
- **Destination:** evidence boundary for Candidate 003; observation-model tests.

### Proposed-C-ES-14

- **Statement:** Historical-data tipping-time estimates are not currently
  robust to model form, proxy choice, observational uncertainty, infilling, and
  forcing extrapolation; some tested methods produce finite dates for a linear
  process that cannot tip.
- **Status:** established in the cited methodological stress tests.
- **Primary sources:** `ditlevsen2023forecast`, `benyami2024uncertainty`.
- **Destination:** prohibit exact failure-date extrapolation from Candidate 003
  without prospective validation.

### Proposed-C-ES-15

- **Statement:** In one targeted CESM AMOC-collapse run, a freshwater-transport
  indicator was less dependent on a generic critical-slowing window choice,
  supporting physics-specific indicators as mandatory nulls.
- **Status:** established for the declared model; present-Earth interpretation
  remains retrospective/model-assisted.
- **Primary source:** `vanwesten2024physics`.
- **Destination:** Candidate 003 mechanism-specific null suite.

## Proposed BibTeX entries for integration

```bibtex
@article{held2004degenerate,
  author  = {Held, Hermann and Kleinen, Thomas},
  title   = {Detection of Climate System Bifurcations by Degenerate Fingerprinting},
  journal = {Geophysical Research Letters},
  year    = {2004},
  volume  = {31},
  number  = {23},
  pages   = {L23207},
  doi     = {10.1029/2004GL020972},
  url     = {https://doi.org/10.1029/2004GL020972}
}

@article{boulton2014amoc,
  author  = {Boulton, Chris A. and Allison, Lesley C. and Lenton, Timothy M.},
  title   = {Early Warning Signals of Atlantic Meridional Overturning Circulation Collapse in a Fully Coupled Climate Model},
  journal = {Nature Communications},
  year    = {2014},
  volume  = {5},
  pages   = {5752},
  doi     = {10.1038/ncomms6752},
  url     = {https://doi.org/10.1038/ncomms6752}
}

@article{rahmstorf2005hysteresis,
  author  = {Rahmstorf, Stefan and Crucifix, Michel and Ganopolski, Andrey and Goosse, Hugues and Kamenkovich, Igor and Knutti, Reto and Lohmann, Gerrit and Marsh, Robert and Mysak, Lawrence A. and Wang, Zhaomin and Weaver, Andrew J.},
  title   = {Thermohaline Circulation Hysteresis: A Model Intercomparison},
  journal = {Geophysical Research Letters},
  year    = {2005},
  volume  = {32},
  number  = {23},
  pages   = {L23605},
  doi     = {10.1029/2005GL023655},
  url     = {https://doi.org/10.1029/2005GL023655}
}

@article{garbe2020antarctic,
  author  = {Garbe, Julius and Albrecht, Torsten and Levermann, Anders and Donges, Jonathan F. and Winkelmann, Ricarda},
  title   = {The Hysteresis of the Antarctic Ice Sheet},
  journal = {Nature},
  year    = {2020},
  volume  = {585},
  pages   = {538--544},
  doi     = {10.1038/s41586-020-2727-5},
  url     = {https://doi.org/10.1038/s41586-020-2727-5}
}

@article{lohmann2021rate,
  author  = {Lohmann, Johannes and Ditlevsen, Peter D.},
  title   = {Risk of Tipping the Overturning Circulation Due to Increasing Rates of Ice Melt},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2021},
  volume  = {118},
  number  = {9},
  pages   = {e2017989118},
  doi     = {10.1073/pnas.2017989118},
  url     = {https://doi.org/10.1073/pnas.2017989118}
}

@article{ashwin2012open,
  author  = {Ashwin, Peter and Wieczorek, Sebastian and Vitolo, Renato and Cox, Peter},
  title   = {Tipping Points in Open Systems: Bifurcation, Noise-Induced and Rate-Dependent Examples in the Climate System},
  journal = {Philosophical Transactions of the Royal Society A},
  year    = {2012},
  volume  = {370},
  number  = {1962},
  pages   = {1166--1184},
  doi     = {10.1098/rsta.2011.0306},
  url     = {https://doi.org/10.1098/rsta.2011.0306}
}

@article{ritchie2016rate,
  author  = {Ritchie, Paul and Sieber, Jan},
  title   = {Early-Warning Indicators for Rate-Induced Tipping},
  journal = {Chaos},
  year    = {2016},
  volume  = {26},
  number  = {9},
  pages   = {093116},
  doi     = {10.1063/1.4963012},
  url     = {https://doi.org/10.1063/1.4963012}
}

@article{dakos2008climate,
  author  = {Dakos, Vasilis and Scheffer, Marten and van Nes, Egbert H. and Brovkin, Victor and Petoukhov, Vladimir and Held, Hermann},
  title   = {Slowing Down as an Early Warning Signal for Abrupt Climate Change},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2008},
  volume  = {105},
  number  = {38},
  pages   = {14308--14312},
  doi     = {10.1073/pnas.0802430105},
  url     = {https://doi.org/10.1073/pnas.0802430105}
}

@article{ditlevsen2010wishful,
  author  = {Ditlevsen, Peter D. and Johnsen, Sigfus J.},
  title   = {Tipping Points: Early Warning and Wishful Thinking},
  journal = {Geophysical Research Letters},
  year    = {2010},
  volume  = {37},
  number  = {19},
  pages   = {L19703},
  doi     = {10.1029/2010GL044486},
  url     = {https://doi.org/10.1029/2010GL044486}
}

@article{wang2012flickering,
  author  = {Wang, Rong and Dearing, John A. and Langdon, Peter G. and Zhang, Enlou and Yang, Xiangdong and Dakos, Vasilis and Scheffer, Marten},
  title   = {Flickering Gives Early Warning Signals of a Critical Transition to a Eutrophic Lake State},
  journal = {Nature},
  year    = {2012},
  volume  = {492},
  pages   = {419--422},
  doi     = {10.1038/nature11655},
  url     = {https://doi.org/10.1038/nature11655}
}

@article{kefi2007spatial,
  author  = {K{\'e}fi, Sonia and Rietkerk, Max and Alados, Concepci{\'o}n L. and Pueyo, Yolanda and Papanastasis, Vasilios P. and ElAich, Ahmed and de Ruiter, Peter C.},
  title   = {Spatial Vegetation Patterns and Imminent Desertification in Mediterranean Arid Ecosystems},
  journal = {Nature},
  year    = {2007},
  volume  = {449},
  pages   = {213--217},
  doi     = {10.1038/nature06111},
  url     = {https://doi.org/10.1038/nature06111}
}

@article{dakos2010spatial,
  author  = {Dakos, Vasilis and van Nes, Egbert H. and Donangelo, Ra{\'u}l and Fort, Hugo and Scheffer, Marten},
  title   = {Spatial Correlation as Leading Indicator of Catastrophic Shifts},
  journal = {Theoretical Ecology},
  year    = {2010},
  volume  = {3},
  number  = {3},
  pages   = {163--174},
  doi     = {10.1007/s12080-009-0060-6},
  url     = {https://doi.org/10.1007/s12080-009-0060-6}
}

@article{boettiger2012limits,
  author  = {Boettiger, Carl and Hastings, Alan},
  title   = {Quantifying Limits to Detection of Early Warning for Critical Transitions},
  journal = {Journal of the Royal Society Interface},
  year    = {2012},
  volume  = {9},
  number  = {75},
  pages   = {2527--2539},
  doi     = {10.1098/rsif.2012.0125},
  url     = {https://doi.org/10.1098/rsif.2012.0125}
}

@article{boettiger2012prosecutor,
  author  = {Boettiger, Carl and Hastings, Alan},
  title   = {Early Warning Signals and the Prosecutor's Fallacy},
  journal = {Proceedings of the Royal Society B},
  year    = {2012},
  volume  = {279},
  number  = {1748},
  pages   = {4734--4739},
  doi     = {10.1098/rspb.2012.2085},
  url     = {https://doi.org/10.1098/rspb.2012.2085}
}

@article{wagner2015falsealarms,
  author  = {Wagner, Till J. W. and Eisenman, Ian},
  title   = {False Alarms: How Early Warning Signals Falsely Predict Abrupt Sea Ice Loss},
  journal = {Geophysical Research Letters},
  year    = {2015},
  volume  = {42},
  number  = {24},
  pages   = {10335--10341},
  doi     = {10.1002/2015GL066297},
  url     = {https://doi.org/10.1002/2015GL066297}
}

@article{boers2021amoc,
  author  = {Boers, Niklas},
  title   = {Observation-Based Early-Warning Signals for a Collapse of the Atlantic Meridional Overturning Circulation},
  journal = {Nature Climate Change},
  year    = {2021},
  volume  = {11},
  pages   = {680--688},
  doi     = {10.1038/s41558-021-01097-4},
  url     = {https://doi.org/10.1038/s41558-021-01097-4}
}

@article{boersrypdal2021greenland,
  author  = {Boers, Niklas and Rypdal, Martin},
  title   = {Critical Slowing Down Suggests That the Western Greenland Ice Sheet Is Close to a Tipping Point},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2021},
  volume  = {118},
  number  = {21},
  pages   = {e2024192118},
  doi     = {10.1073/pnas.2024192118},
  url     = {https://doi.org/10.1073/pnas.2024192118}
}

@article{boulton2022amazon,
  author  = {Boulton, Chris A. and Lenton, Timothy M. and Boers, Niklas},
  title   = {Pronounced Loss of Amazon Rainforest Resilience Since the Early 2000s},
  journal = {Nature Climate Change},
  year    = {2022},
  volume  = {12},
  number  = {3},
  pages   = {271--278},
  doi     = {10.1038/s41558-022-01287-8},
  url     = {https://doi.org/10.1038/s41558-022-01287-8}
}

@article{ditlevsen2023forecast,
  author  = {Ditlevsen, Peter and Ditlevsen, Susanne},
  title   = {Warning of a Forthcoming Collapse of the Atlantic Meridional Overturning Circulation},
  journal = {Nature Communications},
  year    = {2023},
  volume  = {14},
  pages   = {4254},
  doi     = {10.1038/s41467-023-39810-w},
  url     = {https://doi.org/10.1038/s41467-023-39810-w}
}

@article{vanwesten2024physics,
  author  = {van Westen, Ren{\'e} M. and Kliphuis, Michael and Dijkstra, Henk A.},
  title   = {Physics-Based Early Warning Signal Shows That {AMOC} Is on Tipping Course},
  journal = {Science Advances},
  year    = {2024},
  volume  = {10},
  number  = {6},
  pages   = {eadk1189},
  doi     = {10.1126/sciadv.adk1189},
  url     = {https://doi.org/10.1126/sciadv.adk1189}
}

@article{benyami2024uncertainty,
  author  = {Ben-Yami, Maya and Morr, Andreas and Bathiany, Sebastian and Boers, Niklas},
  title   = {Uncertainties Too Large to Predict Tipping Times of Major Earth System Components from Historical Data},
  journal = {Science Advances},
  year    = {2024},
  volume  = {10},
  number  = {31},
  pages   = {eadl4841},
  doi     = {10.1126/sciadv.adl4841},
  url     = {https://doi.org/10.1126/sciadv.adl4841}
}
```

## Audit conclusion

Earth-system science strengthens the *bounded* Candidate 003 hypothesis while
destroying a broad one. A known, observable, safely excitable local mode can
slow before a gradual bifurcation, and measuring its recovery can reveal
fragility hidden from current-state dashboards. The same literature provides
mechanistic false alarms, retrospective-selection bias, proxy uncertainty,
rate- and noise-induced transitions, hysteresis, hidden modes, and shocks for
which that signal is absent or ambiguous.

The next scientific move is therefore not another universal early-warning
score. It is the transition-class test suite above, with standard system
identification, change detection, mechanism-specific physics, and honest
abstention as first-class competitors.

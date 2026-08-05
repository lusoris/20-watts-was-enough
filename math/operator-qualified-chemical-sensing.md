# Operator-qualified active chemical sensing

This note formalizes [Fixture F-011](../experiments/fixtures/011-operator-qualified-active-chemical-sensing.md)
from the [olfaction, chemical sensing, and plume-tracking
audit](../research/audits/2026-08-05-olfaction-chemical-sensing-plume-tracking.md).
It supplies a hostile comparison boundary for
[Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md),
[Candidate 006](../experiments/candidates/006-reversible-physical-skill.md),
[Candidate 007](../experiments/candidates/007-endogenous-observation-surveillance.md),
[Candidate 009](../experiments/candidates/009-graded-assurance-envelopes.md),
[Candidate 010](../experiments/candidates/010-reset-coupled-staged-verification.md),
[Candidate 012](../experiments/candidates/012-latency-qualified-authority.md),
[Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
[Candidate 017](../experiments/candidates/017-contract-preserving-semantic-compaction.md),
and [Candidate 018](../experiments/candidates/018-value-reconstructability-aware-tiering.md).
The fixture and this note create no principle or architecture candidate.

## Episode, operator, and outcome identity

For episode $e$, preserve

$$
\mathcal C_e=(S_e,X_e,A_e,R_e,O_e,K_e,H_e,T_e,U_e,B_e),
$$

where:

- $S_e$ is every target, interferent, and source identity; source mixture;
  release rate in moles per second; phase; temperature in kelvins; geometry in
  metres; motion in metres per second; and source-selection history;
- $X_e$ is the domain, boundaries, surfaces, flow field in metres per second,
  pressure in pascals, relative humidity as a dimensionless fraction,
  temperature in kelvins, turbulence, chemistry, sorption, and background;
- $A_e$ is every commanded and realized motion, orientation, sniff or pump
  waveform, volumetric flow in cubic metres per second, heater power in watts,
  valve, preconcentration, purge, query, confirmation, and stopping action;
- $R_e$ is receiver/body identity, morphology, pose, bilateral spacing or array
  geometry in metres, feasible motion, inlet, tubing, chamber, pump, heater,
  transducer, health, saturation, and authority;
- $O_e$ is the observation operator: transport and sampling support, causal
  response/recovery kernels, cross-sensitivity, nonlinearity, quantization,
  timestamps, latency in seconds, preprocessing, missingness, and selection;
- $K_e$ is calibration identity and validity: reference-gas composition,
  concentration and uncertainty, zero/span and blank history, flow,
  temperature/humidity compensation, device and batch, age, drift, poisoning,
  maintenance, traceability, and data vintage;
- $H_e$ is prior chemical exposure, adaptation, habituation, contamination,
  storage, cleaning, training, reinforcement, previous actions, feedback, and
  readout-remapping history with timestamps;
- $T_e$ is the literal outcome, deadline in seconds, loss/utility, abstention,
  exposure rule, and safety policy;
- $U_e$ is the independent unit: molecule, injection, vial, sample, sensor,
  device, manufacture batch, day, source, plume realization, site, body,
  animal, subject, or population; and
- $B_e$ is the componentwise ceiling in samples, standards, labels, channels,
  aperture, actions, metres, seconds, bytes, optimization/search trials,
  person-hours, joules, consumables, emissions, exposures, unsafe events,
  replacements, embodied hardware, and opportunity.

For method $q$ and literal outcome $k$, define

$$
Q_{q,k}(\mathcal C)=
\mathbb E\!\left[Y_k\mid do(q),\mathcal C\right],
$$

where $Y_k$ retains the registered unit for outcome $k$. The contrast does not
isolate $q$ if source chemistry, concentration range, plume realization,
receiver, calibration, operator, history, action authority, confirmation access,
or any binding budget differs without a registered intervention.

## Chemical amount, concentration, and conversion

For analyte $i$, amount concentration is

$$
c_i=\frac{n_i}{V},
$$

where amount $n_i$ is in moles, volume $V$ is in cubic metres, and $c_i$ is in
moles per cubic metre. Mass concentration is

$$
\rho_i=c_iM_i,
$$

where molar mass $M_i$ is in kilograms per mole and $\rho_i$ is in kilograms
per cubic metre.

For an ideal gas with dimensionless amount fraction $x_i$,

$$
c_i=x_i\frac{P}{RT},
\qquad
\rho_i=x_i\frac{PM_i}{RT},
$$

where pressure $P$ is in pascals, absolute temperature $T$ is in kelvins, and
$R=8.314462618\ \mathrm{J/(mol\,K)}$. A conversion from parts per million by
volume to milligrams per cubic metre therefore carries analyte molar mass,
temperature, pressure, and the definition of the fraction.

## Transport, reaction, sorption, and intermittent plumes

A continuum starting model for analyte $i$ is

$$
\frac{\partial c_i}{\partial t}
+\mathbf u\!\cdot\!\nabla c_i
=\nabla\!\cdot(D_i\nabla c_i)
+R_i(\mathbf c,T,P,H_r,\mathbf x,t)
+q_i(\mathbf x,t),
$$

where position $\mathbf x$ is in metres; time $t$ is in seconds; velocity
$\mathbf u$ is in metres per second; diffusivity or declared effective
dispersion $D_i$ is in square metres per second; relative humidity $H_r$ is
dimensionless; reaction, loss, and phase-transfer term $R_i$ is in moles per
cubic metre per second; and volumetric source $q_i$ has the same unit. Every
term has units of moles per cubic metre per second.

For surface $\Gamma$, a general molar flux condition is

$$
-D_i\nabla c_i\!\cdot\!\mathbf n
=J_{i,\Gamma}(c_i,\eta_{\Gamma},T,H_r,t),
$$

where outward unit normal $\mathbf n$ is dimensionless, surface flux
$J_{i,\Gamma}$ is in moles per square metre per second, and surface state
$\eta_{\Gamma}$ records adsorption, desorption, wetting, reaction, and history.
Terrain, buoyancy, droplets, thermal stratification, and unresolved turbulent
fluxes cannot be hidden inside $D_i$ without declaring the validity regime.

For a registered detection boundary $c_i^{\mathrm{det}}$ in moles per cubic
metre, define a whiff indicator and cumulative occupation time by

$$
w_i(t)=\mathbb I[c_i(\mathbf x_r(t),t)\ge c_i^{\mathrm{det}}],
\qquad
T_i^{\mathrm{whiff}}=\int_0^{T_e}w_i(t)\,dt,
$$

where receiver trajectory $\mathbf x_r(t)$ is in metres, episode duration
$T_e$ and whiff occupation $T_i^{\mathrm{whiff}}$ are in seconds, and
$\mathbb I[\cdot]$ is dimensionless. Report the distributions of whiff
duration, blank duration, peak, integral, rise/fall and encounter spacing; a
time-averaged concentration is not a substitute.

## Dynamic cross-sensitive observation operator

For sensor or receptor channel $m$ sampled at device time $t_n$, use

$$
y_{m,n}=g_{m,v}\!\left(
\sum_{i=1}^{I}\int_0^\infty
h_{m,i,v}(\tau;\mathbf z_n)
c_i(\mathbf x_r(t_n-\tau),t_n-\tau)\,d\tau,
\mathbf z_n\right)+\epsilon_{m,n},
$$

where $I$ is dimensionless analyte count; channel output $y_{m,n}$ and error
$\epsilon_{m,n}$ use the channel's calibrated unit; response kernel
$h_{m,i,v}$ is in reciprocal seconds; delay $\tau$ is in seconds; $v$ is the
operator/calibration version; $g_{m,v}$ maps amount concentration to output;
and state $\mathbf z_n$ includes flow, heater, chamber, temperature, humidity,
pressure, interferents, saturation, adaptation, age, drift and poisoning. The
integral is in moles per cubic metre. A static feature vector is a special case
that must survive response, recovery, hysteresis and support interventions.

Device time is corrected by

$$
\bar t_{m,n}=t^{\mathrm{dev}}_{m,n}-\delta_{m,v},
$$

where device time $t^{\mathrm{dev}}_{m,n}$, corrected time $\bar t_{m,n}$, and
clock offset $\delta_{m,v}$ are in seconds. Retain clock drift in seconds per
second, jitter and residual uncertainty in seconds, capture time, receipt time,
and synchronization version. At decision time $t$, only observations received
no later than $t$ are causally available.

## Mixture identifiability and null spaces

Under a local linearization around concentration vector
$\mathbf c_0\in\mathbb R_+^I$, let

$$
\Delta\mathbf y\approx
\mathbf J_v(\mathbf c_0,\mathbf z)\Delta\mathbf c+\boldsymbol\epsilon,
\qquad
[\mathbf J_v]_{m,i}=\left.
\frac{\partial \mathbb E[y_m]}{\partial c_i}
\right|_{\mathbf c_0,\mathbf z,v},
$$

where $\Delta\mathbf y\in\mathbb R^M$ is in channel-output units,
$\Delta\mathbf c\in\mathbb R^I$ is in moles per cubic metre, $M$ is channel
count, and Jacobian element $J_{m,i}$ has output-unit cubic metres per mole.
Full column rank of $\mathbf J_v$ is necessary for unconstrained local recovery
when $M\ge I$, but is not sufficient under noise, saturation, unknown
interferents, changing $v$, or nonlinear ambiguity.

The observation-equivalent set at tolerance $\varepsilon_y$ is

$$
\mathcal N_v(\mathbf y)=
\left\{\mathbf c\in\mathcal S_c:
\left\|\mathbf y-G_v(\mathbf c;\mathbf z)\right\|_{\Sigma_y^{-1}}
\le\varepsilon_y\right\},
$$

where supported composition set $\mathcal S_c$ uses moles per cubic metre,
forward operator $G_v$ returns channel outputs, error covariance $\Sigma_y$
is in squared output units, Mahalanobis norm is dimensionless, and threshold
$\varepsilon_y$ is dimensionless. Identification must abstain when materially
different identity, concentration, exposure or hazard states remain in
$\mathcal N_v(\mathbf y)$.

For Gaussian error and differentiable mean $\boldsymbol\mu(\boldsymbol\theta)$,
the local Fisher information is

$$
\mathbf F(\boldsymbol\theta)=
\left(\frac{\partial\boldsymbol\mu}{\partial\boldsymbol\theta}\right)^T
\Sigma_y^{-1}
\left(\frac{\partial\boldsymbol\mu}{\partial\boldsymbol\theta}\right),
$$

where parameter vector $\boldsymbol\theta$ contains registered identities,
concentrations, source coordinates, and operator states with declared units.
Near-singular directions identify local non-identifiability; a learned decoder
does not remove them without additional prior or action-generated evidence.

## Concentration, identity, mixtures, and calibration

Keep the protected outcome vector

$$
\mathbf Y=
(Y_{\mathrm{det}},Y_{\mathrm{id}},Y_{\mathrm{conc}},Y_{\mathrm{mix}},
Y_{\mathrm{dir}},Y_{\mathrm{pos}},Y_{\mathrm{attr}},Y_{\mathrm{val}},
Y_{\mathrm{exp}},Y_{\mathrm{haz}}),
$$

whose elements respectively measure presence, chemical or perceptual identity,
concentration, mixture composition, direction, position, physical-source
attribution, valence, exposure, and hazard. Units and losses differ; no scalar
average may allow one to substitute for another.

For yes/no detection,

$$
d'=\Phi^{-1}(P_{\mathrm{hit}})-
\Phi^{-1}(P_{\mathrm{false\ alarm}}),
$$

where both probabilities and sensitivity $d'$ are dimensionless. Report the
criterion, concentration/matrix, target-absent mixtures and uncertainty.

For concentration estimate $\widehat c_i$ in moles per cubic metre, a
dimensionless log error is

$$
\ell_{i,n}^{\mathrm{conc}}=
\left|\log\frac{\widehat c_{i,n}+c_i^*}{c_{i,n}+c_i^*}\right|,
$$

where positive reference $c_i^*$ is in moles per cubic metre and is frozen
before evaluation. Also report bias and absolute error in native units;
$c_i^*$ cannot be tuned on the confirmatory split.

For categorical identity prediction $p_q(z_n\mid o_n)$,

$$
L_q^{\mathrm{id}}=-\frac{1}{N}
\sum_{n=1}^{N}\log_2p_q(z_n\mid o_n),
$$

where $N$ is independent episode count, $z_n$ is the registered identity,
$o_n$ is causally available evidence, and $L_q^{\mathrm{id}}$ is in bits per
episode. Report confusion, unknown rejection, calibration and risk--coverage by
held-out source, concentration, mixture, device, batch, day and site.

For calibration parameter vector $\boldsymbol\kappa$ with covariance
$\Sigma_\kappa$, first-order propagated output covariance is

$$
\Sigma_{y,\mathrm{cal}}
\approx\mathbf J_\kappa\Sigma_\kappa\mathbf J_\kappa^T,
\qquad
\mathbf J_\kappa=\frac{\partial\boldsymbol\mu_y}
{\partial\boldsymbol\kappa},
$$

where each covariance retains the squared units of its parameters or outputs.
Reference-gas uncertainty, flow, blank, zero/span, temperature, humidity,
device, batch and validity interval are part of $\boldsymbol\kappa$, not
post-hoc notes.

## Adaptation, recovery, drift, and poisoning

Separate fast receptor/sensor state from slow condition state:

$$
\mathbf r_{n+1}=f_r(\mathbf r_n,\mathbf c_n,a_n;v)+\boldsymbol\xi_n,
\qquad
\mathbf d_{e+1}=f_d(\mathbf d_e,\mathcal E_e,m_e;v)+\boldsymbol\omega_e,
$$

where within-episode response state $\mathbf r_n$ may include occupancy,
adaptation, heater and recovery; between-episode state $\mathbf d_e$ includes
age, contamination, baseline/gain drift and poisoning; concentration
$\mathbf c_n$ is in moles per cubic metre; acquisition action $a_n$ carries
its physical units; cumulative exposure and stress $\mathcal E_e$ uses a
declared vector of concentration-time, temperature-time and electrical stress;
maintenance action $m_e$ records purge, cleaning, recalibration or replacement;
and errors $\boldsymbol\xi_n,\boldsymbol\omega_e$ retain state units.

For a step ending at time $t_0$, define a registered recovery time

$$
t_{\mathrm{rec}}(\epsilon)=
\inf\left\{t\ge t_0:
\frac{|y(t)-y_{\mathrm{blank}}|}{s_y}\le\epsilon
\text{ continuously for }T_{\mathrm{hold}}\right\}-t_0,
$$

where output $y(t)$, blank output $y_{\mathrm{blank}}$ and scale $s_y$ share the
channel unit; tolerance $\epsilon$ is dimensionless; hold time
$T_{\mathrm{hold}}$ and recovery time $t_{\mathrm{rec}}$ are in seconds.
Recovery does not prove restored calibration, selectivity or absence of
poisoning; reference challenges must test those outcomes separately.

## Temporal codes, active sampling, and receiver motion

For causal feature window $W$ seconds, preserve a temporal record

$$
\mathcal E_{m,W}=
\{(t_j,y_j,v,K_j):t-W<t_j\le t\},
$$

where event time $t_j$ is in seconds, value $y_j$ uses the calibrated channel
unit, operator version $v$ is dimensionless, and $K_j$ is calibration state.
Every event threshold, refractory rule, interpolation, derivative, clock and
response kernel is versioned. Time shuffling must preserve marginal
concentration, duty cycle and event count when testing whether temporal order
adds information.

At decision time $t$, the active policy is

$$
a_t=\pi_q(\mathcal H_t,\widehat{\mathbf c}_t,
\widehat{\mathbf s}_t,\widehat O_t,\widehat U_t,
\mathcal A_t^{\mathrm{safe}},\mathbf B_t),
$$

where $\mathcal H_t$ is causally received observations and actions;
$\widehat{\mathbf c}_t$ is concentration/mixture belief in moles per cubic
metre; $\widehat{\mathbf s}_t$ is source state with position in metres and
release rate in moles per second; $\widehat O_t$ is operator/condition belief;
$\widehat U_t$ is uncertainty; $\mathcal A_t^{\mathrm{safe}}$ is the feasible
action set; and remaining budget $\mathbf B_t$ retains componentwise units.

Action value under possible next observation $Y$ is

$$
\operatorname{EVI}(a_t)=
\min_d\mathbb E[L(d,\theta)\mid\mathcal H_t]
-\mathbb E_{Y\sim p(\cdot\mid\mathcal H_t,a_t)}\!\left[
\min_d\mathbb E[L(d,\theta)\mid\mathcal H_t,a_t,Y]\right]
-C(a_t),
$$

where decision $d$, target state $\theta$, loss $L$ and action cost $C$ use one
registered utility unit. $C$ includes latency, motion, sampled amount, exposure,
pump/heater/valve energy, wear, consumables and opportunity. Positive EVI
favors the action. Adaptive sniffing receives no credit if it merely samples
more chemical mass or receives more time.

## Plume-source belief and search

For source state $\mathbf s$ and concentration field $\mathbf c_{0:t}$,
posterior inference is

$$
p(\mathbf s,\mathbf c_{0:t},O_t\mid y_{1:t},a_{1:t},\mathcal C_e),
$$

where source position is in metres, release rate in moles per second,
concentration in moles per cubic metre, and operator state $O_t$ includes
response, calibration and health. A particle filter, state-space estimator,
Gaussian-process plume model, infotaxis policy, POMDP, model-predictive
controller, finite-state surge--cast policy and matched-memory reinforcement
learner are competing nulls.

For stopping time $\tau_q$ in seconds and source-location estimate
$\widehat{\mathbf x}_{s,q}$ in metres, one source-search vector is

$$
\mathbf Y_q^{\mathrm{search}}=
\left(
\mathbb I[\mathrm{success}],
\|\widehat{\mathbf x}_{s,q}-\mathbf x_s\|_2,
\tau_q,L_q,E_q,N_q^{\mathrm{false}},N_q^{\mathrm{unsafe}}
\right),
$$

where path length $L_q$ is in metres, episode energy $E_q$ is in joules, and
the success indicator and false/unsafe declaration counts are dimensionless.
Report every element; success conditional on successful trials is not a valid
policy comparison.

## Receptor, representation, association, and valence causality

A receptor-like front end or learned representation $z=f_q(y)$ earns causal
credit only through a registered intervention. For endpoint $k$, define

$$
\Delta_{z,k}=
\mathbb E[Y_k\mid do(z=z^{\mathrm{full}}),\mathcal C]
-\mathbb E[Y_k\mid do(z=z^{\mathrm{abl}}),\mathcal C],
$$

where $z^{\mathrm{abl}}$ removes only the registered channel, temporal state,
normalization, sparse route or associative readout, and released resources stay
unused. The effect $Delta_{z,k}$ retains outcome $k$'s unit. Activation,
sparsity, mutual information, decoding and anatomical analogy do not substitute
for target detection, concentration, mixture, source, transfer, valence,
exposure, safety, latency or energy outcomes.

For association episode $e$, keep

$$
\mathcal L_e=(o_e,r_e,c_e,\pi_e,f_e,t_e),
$$

where odor evidence $o_e$ carries its operator identity, reinforcement $r_e$
uses the task's utility unit, context $c_e$ is registered, policy/intervention
$\pi_e$ is versioned, feedback $f_e$ is timestamped, and acquisition time $t_e$
is in seconds. Chemical identity, learned category, innate choice, learned
choice, pleasantness, toxicity and hazard remain distinct labels and losses.

## Exposure, safety, and authority

External mass-concentration exposure along receiver or subject path is

$$
E_i^{\mathrm{ext}}=\int_0^{T_e}
\rho_i(\mathbf x_r(t),t)\,dt,
$$

where $E_i^{\mathrm{ext}}$ is in kilogram-seconds per cubic metre, commonly
reported as milligram-minutes per cubic metre; $\rho_i$ is in kilograms per
cubic metre; and time is in seconds. Exposure is not absorbed dose or risk.
Route, respiration, susceptible population, toxicokinetics, averaging time,
short-term limit, ceiling and immediately dangerous concentration are separate.

The admissible action set is

$$
\mathcal A_t^{\mathrm{safe}}=
\left\{a:\Pr(g_j(x_{t:t+H},a)>0\mid\mathcal H_t)
\le\beta_j\ \text{for every registered constraint }j\right\},
$$

where prediction horizon $H$ is in seconds; constraint $g_j$ uses its native
unit and is positive on violation; and risk ceiling $\beta_j$ is dimensionless.
Exposure, flammability, collision, contamination, saturation, calibration age,
poisoning and authority can each shrink the set. The sensing policy cannot
self-certify its safety envelope without an independent monitor or validated
fallback.

## Analytical confirmation and staged verification

Let screen $S$ emit class, concentration, uncertainty and abstention, and let
confirmatory method $V$ return chromatography, spectrometry or other registered
evidence. The conditional value of confirmation is

$$
\operatorname{EVI}(V\mid S)=
\min_d\mathbb E[L(d,\theta)\mid S]
-\mathbb E_V\!\left[\min_d\mathbb E[L(d,\theta)\mid S,V]\right]
-C(V),
$$

where $L$ and $C(V)$ share a declared utility unit. Confirmation cost includes
sample handling, standards, blanks, turnaround, carrier gas, columns/sorbents,
vacuum/ionization or detector power, compute, analyst time, exposure, and
sample destruction. A library hit is not a privileged oracle; recovery,
retention, deconvolution, coverage and uncertainty remain part of $V$.

## Lifecycle energy, human work, and equal budgets

Lifecycle energy over one accepted service interval is

$$
E_q^{\mathrm{life}}=
E_q^{\mathrm{data}}+E_q^{\mathrm{train}}+E_q^{\mathrm{move}}+
E_q^{\mathrm{pump}}+E_q^{\mathrm{heat}}+E_q^{\mathrm{sense}}+
E_q^{\mathrm{separate}}+E_q^{\mathrm{ionize}}+E_q^{\mathrm{infer}}+
E_q^{\mathrm{comm}}+E_q^{\mathrm{store}}+E_q^{\mathrm{cal}}+
E_q^{\mathrm{maint}}+E_q^{\mathrm{facility}}+E_q^{\mathrm{emb}},
$$

where every term is in joules and covers data acquisition, training, physical
motion, pumping, heating, analytical separation, ionization/vacuum when used,
sensing, inference, communication, storage, calibration, maintenance, facility
overhead and amortized embodied hardware. Carrier and calibration gases,
sorbents, columns, dopants, filters, cleaning and replacements are additionally
reported in their physical and environmental units rather than silently
converted to compute joules.

Human effort is

$$
H_q^{\mathrm{human}}=
H_q^{\mathrm{design}}+H_q^{\mathrm{sample}}+H_q^{\mathrm{label}}+
H_q^{\mathrm{cal}}+H_q^{\mathrm{analyze}}+H_q^{\mathrm{tune}}+
H_q^{\mathrm{safety}}+H_q^{\mathrm{monitor}}+H_q^{\mathrm{maint}},
$$

where every term is in person-hours and roles are reported separately.

The complete resource vector is

$$
\mathbf C_q=(N_{\mathrm{sample}},N_{\mathrm{standard}},N_{\mathrm{label}},
N_{\mathrm{step}},N_{\mathrm{tune}},N_{\mathrm{byte}},T_{\mathrm{wall}},
L_{\mathrm{path}},V_{\mathrm{sample}},H_q^{\mathrm{human}},
E_q^{\mathrm{life}},\mathbf E^{\mathrm{ext}},N_{\mathrm{unsafe}},
N_{\mathrm{replace}},C_{\mathrm{opp}}),
$$

where the six $N$ terms count samples, standards, labels, optimization or
environment steps, tuning trials and bytes; wall time $T_{\mathrm{wall}}$ is in
seconds; path $L_{\mathrm{path}}$ is in metres; sampled volume
$V_{\mathrm{sample}}$ is in cubic metres; human work is in person-hours;
lifecycle energy is in joules; exposure vector $\mathbf E^{\mathrm{ext}}$
retains kilogram-seconds per cubic metre by analyte; unsafe events and
replacements are counts; and opportunity $C_{\mathrm{opp}}$ uses registered
task exposures or person-hours.

Method $q$ is feasible only when

$$
\mathbf C_q\preceq\mathbf B,
$$

where $\mathbf B$ is the preregistered componentwise ceiling with identical
units. Over-budget runs are infeasible; failed runs remain in denominators and
resources released by an ablation stay unused.

## Confirmatory contrast and hard retirement

Let $b^*(j)$ be the strongest frozen mature baseline for track $j$. Orient
protected endpoints so larger $Q$ is better and use negative values only for
preregistered non-inferiority margins. For protected outcomes
$k\in\mathcal P_j$, retain a track residual only when

$$
\Pr\!\left(
Q_{q,k}-Q_{b^*(j),k}>\delta_{j,k}
\text{ for every }k\in\mathcal P_j
\right)\ge1-\alpha_j,
$$

where margin $\delta_{j,k}$ has outcome $k$'s unit and error budget
$\alpha_j$ is dimensionless. The result must survive held-out chemicals,
mixtures, concentrations, release/transport regimes, plume seeds, sources,
receivers/bodies, sensors, batches, operator/calibration versions, days, sites,
model families and hardware at equal complete cost. Otherwise retire the
architectural residual while retaining the operator/action/exposure contract.

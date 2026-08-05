# Candidate 003: recovery dynamics as latent fragility sensing

**Stage:** 1 — synthetic falsification  
**Status:** candidate; not an accepted project claim  
**Primary question:** within gradual local stability loss in observable, safely
excitable modes, can small bounded perturbations estimate shrinking restoring
margin earlier than conventional service metrics, passive change detection,
queueing headroom, mechanism-specific indicators, and standard system
identification at a controlled monitoring and probe budget—and abstain on
transition classes where no such precursor exists?

## Why this experiment exists

A system can sit at the same apparent operating point while its restoring
dynamics weaken. Ecological experiments provide examples of slower recovery and
increased autocorrelation before some controlled regime transitions, but they
do not establish a universal failure detector for software or AI systems.
Return-rate estimation is also established control-system practice. The Stage-1
test therefore asks whether the proposed **probe-and-recover maintenance
primitive** adds engineering value; it does not test whether an ecological
metaphor sounds plausible.

[C-082](../../research/claims.md#c-082) adds a required systems boundary:
failure detectors expose completeness, accuracy, timing, and false-suspicion
assumptions rather than providing instantaneous diagnosis. Candidate alarms
therefore report those axes separately and never treat injected fault time as
an input available to the detector.

The benchmark deliberately includes a condition in which instantaneous and
marginal steady-state statistics are held constant while temporal recovery
changes. It also includes less favorable conditions—workload drift, burst
noise, nonlinear saturation, and sudden faults—to measure false alarms and
scope limits.

## Hypothesis and null

**Candidate hypothesis.** Under a gradual loss of local stability, a bounded
impulse followed by a robust recovery-rate estimate gives earlier, better-
calibrated warning than steady-state SLOs, conventional change detectors, or
passive recovery estimates at acceptable traffic, latency, and energy cost,
while an applicability test rejects noise-, rate-, boundary-, hidden-mode-, and
abrupt-jump cases that the recovery model cannot identify.

**Null.** At equal telemetry and compute budgets, recovery probes provide no
material lead-time or calibration advantage; conventional passive monitoring
or standard active system identification is as good or better. Failure to beat
standard active identification rejects novelty even if both methods detect the
transition.

## Controlled system

### System interpretation

Simulate four services connected in a cyclic residual-work path. Each service
has an admission controller that holds its measured queue near a fixed target.
A fraction of a deviation at one service appears as rework or retry pressure at
the next service one sample later. The hidden return gain $g_t$ controls whether
deviations decay, persist, or grow.

This is a local linearization of a queue/retry/controller loop, not a claim that
production queues are Gaussian or linear. A later stage must repeat the result
in a discrete-event queueing system.

### Units and nominal operating point

| Quantity | Symbol | Value | Unit |
| --- | --- | ---: | --- |
| sample interval | $\Delta t$ | 0.1 | s |
| services | $n$ | 4 | service |
| nominal total admitted load | $\lambda_0$ | 700 total; 175 per service | request-equivalents per second (RE/s) |
| nominal per-service capacity | $\mu$ | 250 | RE/s |
| nominal per-service utilization | $u_0$ | 0.70 | dimensionless |
| target queue per service | $q^*$ | 20 | RE |
| stationary deviation scale in hidden-margin track | $\sigma_x$ | 1 | RE |
| queue measurement noise s.d. | $\sigma_y$ | 0.25 | RE |
| nominal service-time equivalent | $1/\mu$ | 4 | ms/RE |
| episode duration | $T$ | 7,200 | s |
| samples per episode | $N$ | 72,000 | sample |

One RE is the work performed by one nominal request in this simulator. It is an
accounting unit, not necessarily one HTTP request in a later implementation.

### State dynamics

Let $x_t\in\mathbb{R}^4$ be queue deviation from the target, in RE, and let
$P$ be the cyclic permutation matrix that sends service $i$ to $i+1$ modulo
four:

$$
x_{t+1}=g_t P x_t+w_t+B p_t,
\qquad
q_t=q^*\mathbf{1}+x_t,
\qquad
y_t=q_t+\nu_t.
$$

Here:

- $g_t$ is the dimensionless hidden return gain; the local system is stable for
  $0\leq g_t<1$ and unstable for $g_t>1$;
- $w_t$ is process disturbance in RE;
- $p_t$ is a known probe in RE;
- $B$ selects one service, rotating across probes;
- $\nu_t\sim\mathcal{N}(0,\sigma_y^2I)$ is measurement noise in RE.

Because $P$ is orthogonal, an isolated noiseless deviation has

$$
\lVert x_{t+k}\rVert_2=g_t^k\lVert x_t\rVert_2
$$

for constant $g_t$. The ground-truth 95% recovery time is

$$
\tau_{95}(g)=\Delta t\frac{\ln(0.05)}{\ln(g)}\quad\text{s},
\qquad 0<g<1.
$$

Every symbol above has a defined unit. $g$, $u_0$, and the matrix $P$ are
dimensionless; $x$, $q$, $y$, $w$, and $p$ are in RE.

### The hidden-resilience condition

In Track H, draw

$$
w_t\sim\mathcal{N}\!\left(0,(1-g_t^2)\sigma_x^2I\right).
$$

For fixed $g<1$ and no probe, the stationary marginal covariance of $x_t$ is
$\sigma_x^2I$ for every $g$. Mean queue, queue variance, utilization, and the
marginal latency distribution are therefore unchanged by construction while
autocorrelation and recovery time change. This is an identifiability stress
test, not a proposed law of production noise. It prevents a detector from
winning merely because queue variance explodes near the threshold.

Observed request latency is generated as

$$
L_{i,t}=L_0+(4\ \mathrm{ms/RE})x_{i,t}+\epsilon_{i,t},
$$

where $L_0=84$ ms and $\epsilon_{i,t}\sim\mathcal{N}(0,(2\ \mathrm{ms})^2)$.
Throughput remains $700$ RE/s and nominal utilization remains $0.70$. With the
probe disabled, all $g$ values in Track H have the same one-time queue and
latency distributions; only time dependence differs.

### Transition schedule and controls

Each two-hour episode is drawn from one preregistered family:

1. **H — hidden gradual transition.** $g=0.60$ for the first 1,200 s, then
   increases linearly to $1.01$ over 5,400 s and remains there. The ground-truth
   crossing $t^*$ where $g=1$ occurs at 6,468.3 s.
2. **N — natural-noise transition.** Same $g_t$, but
   $w_t\sim\mathcal{N}(0,(0.20\ \mathrm{RE})^2I)$ independent of $g$. Marginal
   variance may now rise and conventional detectors get that information.
3. **S — stable stationary control.** $g$ is fixed per episode at 0.60, 0.75,
   or 0.90.
4. **C — stable confound controls.** $g=0.75$ while one non-stability factor
   changes: a $\pm10\%$ sinusoidal load, a twofold measurement-noise increase,
   a step in latency offset, or heavy-tailed request bursts. These are false-
   alarm tests.
5. **J — sudden jump.** $g$ jumps from 0.75 to 1.01 without a gradual approach.
   No advance warning is expected; this measures whether reports incorrectly
   imply universality.
6. **Q — nonlinear queue replication.** A discrete-event four-service queue
   with finite capacity, retry feedback, clipping at zero, and the same nominal
   load. Parameters are chosen from a locked calibration to match the linear
   system’s local return gains. This tests whether a result depends entirely on
   Gaussian linear dynamics.

Use 500 healthy `S`/`C` episodes for threshold calibration, then lock all code
and thresholds. Evaluate on 200 `H`, 200 `N`, 200 held-out `S`/`C`, 100 `J`, and
100 `Q` episodes. Seeds, family labels, and transition times remain hidden from
detectors until scoring.

### Stage-1B transition-class suite

The initial six families test gradual scalar slowing and basic confounds. The
Earth-system audit adds a broader falsification suite because critical slowing
is not required for noise- or rate-induced transitions
([C-102](../../research/claims.md#c-102)), warning signatures may be spatial
([C-098](../../research/claims.md#c-098), [C-106](../../research/claims.md#c-106)),
and path reversal need not restore the previous state
([C-099](../../research/claims.md#c-099), [C-100](../../research/claims.md#c-100)).

| Track | Ground-truth construction | Correct behavior |
| --- | --- | --- |
| F — gradual fold | dominant pole approaches one under a slow ramp; fixed-marginal and natural-noise variants | estimate restoring loss and beat passive ID or abstain |
| O — oscillatory loss | complex pole pair loses damping at matched scalar recovery summary | use multivariate pole structure; do not report a scalar fold |
| NE — noise escape | fixed local Jacobian with shrinking barrier; fixed-barrier/increasing-noise controls | report that event time is not identified by recovery rate |
| R — rate-induced | identical start/end forcing under multiple ramp rates; frozen equilibria remain stable | mechanism-specific tracking-margin model wins or candidate abstains |
| FL — flickering | noisy double-well with known basin occupancy and barrier | multimodality and dwell-time nulls win over exponential recovery fits |
| HY — hysteresis | forward and reverse sweeps across two stable branches | represent history, branch identity, and rollback reachability |
| SP — spatial | coupled grid with varied heterogeneity, connectivity, gradients, and sensor resolution | spatial evidence earns its sensing and transfer cost |
| HM — hidden mode | critical eigenmode has swept excitation and observation gain | observability analysis predicts applicability before probing |
| B — hard boundary | queue, memory, or resource reaches a constraint without pole drift | headroom and reachability nulls win |
| J — abrupt jump | identical pre-event distributions and dynamics with random jump time | correctly report no advance skill |
| CF — confounds | noise color, batching, cache inertia, filtering, seasonality, missingness | respect the locked false-alarm budget |

Generate complete unselected trajectories before hiding class, transition time,
and benign/failing prevalence. Retrospective event-conditioned selection is a
known bias ([C-103](../../research/claims.md#c-103),
[C-107](../../research/claims.md#c-107)); negative-warning cases
([C-104](../../research/claims.md#c-104)) and benign slowing
([C-108](../../research/claims.md#c-108)) are required evaluation classes.
Detector fitting uses separate calibration families. Evaluation reports
class-conditional misses, false alarms per healthy operating time, precision
under prevalence sweeps, class-posterior calibration, and the fraction of cases
in which the method correctly refuses a warning claim.

## Candidate probe and estimator

### Probe schedule and cost

Starting at $t=600$ s, inject exactly 36 positive pulses, one every 180 s, with
a fixed amplitude of 4 RE in one 0.1 s interval. Rotate the selected service.
The last scheduled pulse is at $t=6,900$ s.

- Cost per pulse: **4 RE** of synthetic work.
- Maximum completed-episode traffic cost: $36\times4=144$ RE.
- Nominal two-hour traffic: $700\ \mathrm{RE/s}\times7,200\ \mathrm{s}
  =5,040,000$ RE.
- Maximum traffic overhead: $144/5,040,000=0.002857\%$.
- Maximum modeled immediate queue-delay increment at the selected service:
  $4\ \mathrm{RE}\times4\ \mathrm{ms/RE}=16$ ms before propagation.

The traffic cost is exact in simulator units. For energy, first measure
$E_{\mathrm{RE}}$ in joules/RE as the median package-plus-accelerator energy of
$10^6$ nominal requests on the declared test hardware. The accounting estimate
is $4E_{\mathrm{RE}}$ joules/pulse and $144E_{\mathrm{RE}}$ joules/episode.
Also report the paired observed increment

$$
E_{\mathrm{probe}}=E_{\mathrm{active\ run}}-E_{\mathrm{sham\ run}}\quad\text{J}
$$

using identical seeds and a sham marker that performs monitor computation but
injects zero target work. Do not substitute TDP for measured energy.

### Recovery estimate

For probe $j$ at time $t_j$, estimate the pre-probe center from the preceding
30 s. After subtracting that center, use the state-vector norm above the
measurement-noise floor. Fit a robust linear slope to

$$
\log \frac{\lVert y_{t_j+k}-\bar y_{j,\mathrm{pre}}\rVert_2}
{\lVert y_{t_j+1}-\bar y_{j,\mathrm{pre}}\rVert_2}
=k\log g+\varepsilon_{j,k}
$$

over at most 90 s and before the next probe. Convert the slope to $\hat g_j$ and
$\hat\tau_{95,j}$ in seconds. Bootstrap residual blocks to obtain a 95%
confidence interval. Aggregate only the latest three non-aborted probes using
the median; do not smooth across more than 540 s.

The preregistered candidate alarm is raised when the lower 95% confidence bound
for $\tau_{95}$ exceeds 10 s on two consecutive completed probes. For reference,
$\tau_{95}=10$ s corresponds to $g\approx0.9705$ at $\Delta t=0.1$ s. The alarm
threshold may be made stricter—but not looser—if the healthy calibration set
would otherwise exceed the false-alarm budget below.

Define $\tau_{95}=+\infty$ when $\hat g\geq1$ because the fitted local response
does not return to 5% under the model. Such an estimate triggers the same
uncertainty and safety gates; it does not authorize further probing.

## Baselines

All baselines operate on the same samples and locked train/calibration split.

### B0 — oracle margin

Use the true $g_t$ and alarm at the same $\tau_{95}>10$ s threshold. This is an
unattainable ceiling for lead time and verifies scoring, not a competitor.

### B1 — conventional service dashboard

Use rolling p50/p95/p99 latency, error rate, throughput, utilization, mean queue,
and maximum queue. Alarm on a calibrated SLO threshold or a calibrated
three-sigma deviation. Track H is designed to deny this baseline temporal
information; Tracks N, C, and Q test it fairly when marginals change.

### B2 — queueing headroom

Estimate per-service $\hat u=\hat\lambda/\hat\mu$ and the M/M/1 waiting-time
baseline

$$
\hat W_q=\frac{\hat u}{\hat\mu(1-\hat u)}\quad\text{s}.
$$

Alarm when calibrated utilization or predicted wait crosses its threshold.
This baseline should remain unchanged in H because the retry-loop return gain is
not server utilization. That limitation is the point: report it instead of
presenting the baseline as incompetent.

### B3 — conventional change detection

Run EWMA, two-sided CUSUM, and Page–Hinkley detectors on latency and queue
residuals. Tune window and threshold only on the 500 calibration episodes. Use
the best detector selected by calibration false-alarm-constrained lead time;
report all three in the appendix to prevent selector hiding.

### B4 — passive recovery/control estimate

Without using probe markers or injected work, fit AR(1) per service and a
four-state VAR(1) model over rolling 30 s, 60 s, and 120 s windows. Estimate the
dominant pole and its $\tau_{95}$. This is both a passive critical-slowing
baseline and a conventional local control-identification baseline.

### B5 — standard active system identification

Give a recursive-least-squares or subspace state-space estimator the exact same
36 pulse times, amplitudes, telemetry, and abort decisions as the candidate.
It estimates the spectral radius of $A$ and its uncertainty, then alarms at the
equivalent 10 s recovery threshold. If B5 matches or beats the candidate, the
special recovery-curve estimator is rejected or reduced to a presentation
layer over standard system identification.

### B6 — no-information and shuffled controls

Include a time-only prior, random alarms matched to each method’s alarm rate,
and a detector given probe markers with post-probe samples shuffled. The last
control tests whether the estimator uses recovery order rather than probe timing
or late-episode position.

### B7 — mechanism-specific and observation-model controls

Give system-specific indicators the same raw signals, history, and compute
budget: queue headroom and retry reproduction number, controller gain/phase
margin, conservation and consistency residuals, memory-pressure trajectory,
hard-boundary reachability, and branch-aware state estimation. A targeted
physical indicator can be less window-sensitive than generic slowing in its
applicable model ([C-111](../../research/claims.md#c-111)). Also fit explicit
observation models and sweep proxy transformations, missingness, filtering, and
sensor replacement because apparent stability trends can depend on reconstructed
state ([C-109](../../research/claims.md#c-109)).

## Equal-budget rules

- Every method receives the same 10 Hz telemetry: queue, latency, utilization,
  and throughput as four `float64` values per service, exactly 128 data bytes per
  sample before transport framing, or 1,280 data bytes/s.
- No method may use hidden $g_t$, episode family, future samples, or transition
  time. Only B0 receives $g_t$.
- Each method gets the same 500 calibration episodes. Hyperparameters and alarm
  thresholds are frozen before held-out evaluation.
- Online computation is capped at $10^5$ floating-point operations per sample
  and 256 MiB resident memory. Report actual CPU/GPU time and measured joules;
  the cap does not replace measurement.
- Active methods B5 and the candidate receive identical target probes and abort
  decisions. Neither may add excitation.
- Passive methods may spend zero probe work; they are not charged for unused
  budget. Compare accuracy and lead time both directly and on a quality–energy
  Pareto plot.
- Probe-aware and passive methods receive identical raw telemetry. Only active
  methods receive the known pulse amplitude and selected-service marker.
- An ablation that changes pulse size or frequency must keep total scheduled
  work at 144 RE/episode unless it is explicitly labeled a cost sweep.

## Outcomes and units

### Detection

- **Lead time:** $t^*-t_{\mathrm{alarm}}$ in seconds; positive is early, negative
  is late. Report median, interquartile range, and full empirical CDF.
- **Detection probability:** fraction of transition episodes alarmed at least
  300 s and 600 s before $t^*$, in percent.
- **Miss rate:** transition episodes without a pre-crossing alarm, in percent.
- **False-alarm rate:** alarms per 24 simulated hours and fraction of healthy
  episodes with at least one alarm, in percent. Report each C confound
  separately.
- **Margin estimation:** absolute error $|\hat g-g|$ (dimensionless), absolute
  $\tau_{95}$ error in seconds, and empirical coverage of nominal 95% intervals.
- **Ranking:** Spearman correlation between estimated fragility and true
  $1/(1-g)$ on stable samples; exclude $g\geq1$ where that expression diverges.

### Service and resource cost

- injected work in RE and percent of admitted traffic;
- probe-attributable energy in joules and energy per completed estimate in
  joules/estimate;
- peak incremental p99 latency in milliseconds;
- latency-area cost
  $\sum_t\lambda_0\Delta t\max(0,L_t^{\mathrm{active}}-L_t^{\mathrm{sham}})$ in
  request-milliseconds;
- aborted probes and monitor CPU time in seconds;
- telemetry volume in bytes and monitor memory in MiB.

### Statistical comparison

Use paired seeds for candidate/B5 and active/sham comparisons. Bootstrap
episode-level differences with 10,000 resamples and report 95% intervals. Report
effect sizes and raw distributions; a small p-value alone does not satisfy a
promotion criterion.

## Ablations

1. **No pulse:** run the same recovery estimator on ambient fluctuations.
2. **Temporal order destroyed:** shuffle the 90 s post-probe samples.
3. **No cross-service state:** estimate from the probed service only.
4. **No uncertainty gate:** alarm on point estimate alone; quantify false alarms.
5. **Recovery statistic:** compare exponential slope, threshold-crossing return
   time, VAR pole, and nonparametric impulse-response area.
6. **Amplitude at fixed work:** 1, 2, 4, and 8 RE with probe counts adjusted so
   total scheduled work is 144 RE (use a 144-RE labeled cost sweep where integer
   scheduling prevents identical timing).
7. **Probe spacing at fixed work:** distribute 144 RE over 90, 180, 360, and
   720 s nominal intervals without overlapping unfinished recovery windows.
8. **Noise model:** stationary Gaussian, fixed-amplitude Gaussian, Student-$t$
   bursts, autocorrelated measurement noise, and dropped samples.
9. **Topology:** cycle, chain, hub, and two weakly coupled modules at matched
   spectral radius.
10. **Nonlinearity:** finite queues, clipping, retry saturation, and state-
    dependent service rates in Track Q.

## Preregistered rejection criteria

Reject promotion of the candidate primitive if any of the following holds on
held-out evaluation:

1. At no more than one false alarm per 24 simulated hours, it detects fewer than
   80% of H episodes at least 300 s before $t^*$, or its median lead time is less
   than 600 s. These are Stage-1 engineering targets, not biological constants.
2. Its median lead-time improvement over the best passive B1–B4 baseline is
   less than 300 s, or the paired 95% interval includes zero, at the same false-
   alarm ceiling.
3. Standard active identification B5 matches its detection probability within
   5 percentage points and lead time within 60 s at equal probe cost. In that
   case retain B5 as conventional engineering and reject a distinct
   biology-inspired method claim.
4. Any stable confound family exceeds one false alarm per 24 simulated hours
   after threshold locking.
5. Nominal 95% intervals cover true $g$ in less than 90% or more than 99% of
   eligible estimates, indicating material miscalibration or useless width.
6. Results disappear in Q, under heavy-tailed noise, or when topology changes,
   unless a specific, measurable applicability test identifies the valid regime
   before probing.
7. Completed probing exceeds 0.01% traffic overhead, raises p99 latency by more
   than 20 ms, or raises paired episode energy by more than 0.5% over the sham
   run. These are Stage-1 service-cost limits, not general production limits.
8. Shuffled recovery order performs within 5 percentage points of the candidate
   on detection probability. That would indicate leakage from probe timing or
   episode position rather than recovery dynamics.
9. It emits advance warnings in `J`, converts recovery-time estimates into an
   exact failure date, or materially undercovers date uncertainty under proxy,
   model-form, infilling, and forcing changes
   ([C-110](../../research/claims.md#c-110)).
10. It fails to abstain on `NE`, `R`, `HM`, or `B`, or hides those misses inside
    an aggregate score.
11. A B7 mechanism-specific indicator matches or dominates it on its own
    applicable track at equal observation and compute cost.
12. It improves warning accuracy but the resulting intervention policy does not
    improve expected loss after probe, monitoring, delay, false-action, and
    prevented-event accounting.

Passing Stage 1 only warrants a discrete-event and then shadow-deployment test;
it does not justify production probing or an `established` evidence status.

## Safety limits

- Stage 1 runs only in simulation or an isolated shadow replica. It must not
  inject work into a user-facing, safety-critical, financial, medical, or
  irreversible control path.
- A pulse is capped at 4 RE, 20% of one service’s target queue and 0.002857% of
  completed-episode traffic in aggregate.
- Do not start a pulse if any service queue exceeds 30 RE, modeled p99 latency
  exceeds 200 ms, error rate exceeds 0.1%, or a previous pulse has not recovered
  below 5% of its initial norm.
- Abort the current pulse window if any queue leaves $[0,40]$ RE, the deviation
  norm exceeds 12 RE, modeled p99 latency exceeds the 250 ms test SLO, or
  measurement coverage falls below 95%.
- After an aborted probe, raise a monitor-health event, inject no more probes
  for at least 600 s, and do not reuse the truncated window as a successful
  recovery estimate.
- Crossing $g\geq1$ is permitted only because the system is simulated. A later
  shadow test must stop well before a validated safe margin and must define a
  rollback independent of this detector.
- The detector may recommend hold, rollback, or human review. It may not delete
  state, shed user traffic, or change model weights during Stage 1.

## Evidence boundary

Veraart et al. experimentally increased light stress in cyanobacterial
microcosms and observed slower recovery from small dilution perturbations and
rising autocorrelation near a tipping point
([DOI: 10.1038/nature10723](https://doi.org/10.1038/nature10723)). A publisher
corrigendum states that flushing 10% of the medium reduced biomass by roughly
3–5% because mixing was incomplete and corrects the light-attenuation scale;
the authors reported that the correction did not change the conclusions
([DOI: 10.1038/nature11029](https://doi.org/10.1038/nature11029)). The paper
supports ranking fragility under its controlled transition, not exact prediction
of stochastic transition timing.

Carpenter et al. gradually manipulated the top-predator structure of one lake
for three years while monitoring one reference lake and reported warning
statistics during food-web reorganization more than a year before transition
completion ([DOI: 10.1126/science.1203672](https://doi.org/10.1126/science.1203672)).
That is valuable whole-ecosystem intervention evidence, but one manipulated and
one reference lake cannot establish a general false-positive rate.

These studies motivate the question. They do not show that all abrupt changes
exhibit critical slowing, that autocorrelation is specific to declining
resilience, or that active probes are safe and efficient in an AI service.
Control theory and queueing practice are the relevant engineering baselines,
and the candidate is rejected if it cannot beat them under the rules above.

The Earth-system evidence adds model demonstrations of decay-rate warning
([C-097](../../research/claims.md#c-097)), rate-induced failure without the same
precursor ([C-101](../../research/claims.md#c-101)), flickering as a different
signal class ([C-105](../../research/claims.md#c-105)), false warning from
benign mechanism change ([C-108](../../research/claims.md#c-108)), and severe
uncertainty in extrapolated tipping dates ([C-110](../../research/claims.md#c-110)).
The candidate is therefore a **transition-class-aware local fragility
estimator**, not a general tipping-point predictor.

## Promotion decision after Stage 1

If the candidate passes every rejection criterion, draft Stage 2 around a
replayable discrete-event expert-routing service with shadow traffic and a
hardware energy ledger. If it fails only against B5, preserve “monitor recovery
dynamics” as a conventional system-identification recommendation, not as a new
biological principle. If it fails on confounds, nonlinear queues, or safety
cost, archive the primitive and retain the ecological studies only as scoped
evidence about their original systems.

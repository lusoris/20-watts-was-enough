# Candidate 002: multiscale context broadcast

- **Stage:** 1 — isolated mechanism experiment
- **Status:** design candidate; not approved for implementation
- **Candidate invariant:** low-dimensional, few-to-many context is decoded by
  module-specific local transfer functions at different timescales
- **Evidence audit:**
  [neurodevelopment, global context, and metabolic allocation](../../research/audits/2026-08-05-neurodevelopment-global-control.md)
- **Principle status:** no `P-` ID is assigned unless this mechanism survives
  deduplication and experiment

## Question and claim boundary

Can one rate-limited context broadcast coordinate heterogeneous modules more
efficiently than conventional conditioning, gating, token, hypernetwork, and
supervisory-control methods because each receiver applies a distinct local and
temporal interpretation?

This experiment does **not** test whether artificial neuromodulators resemble
serotonin, norepinephrine, or an endocrine system. It tests a narrower systems
hypothesis:

> A small broadcast can be useful when the same event must cause different
> signed, state-dependent, and time-dependent responses in different modules,
> provided that most response logic resides at the receiver.

Success must be distinguishable from ordinary feature-wise conditioning. If
temporally filtered [FiLM](https://arxiv.org/abs/1709.07871), a recurrent gate,
a learned global token, a
[hypernetwork](https://arxiv.org/abs/1609.09106), or a tuned multirate controller
matches the result at the same task and systems budget, this candidate does not
earn a new principle.

## Relevant current evidence and bundles

- [C-020](../../research/claims.md#c-020) supports cell-type-specific contextual
  gain in one mouse circuit, not an artificial broadcast architecture.
- [C-018](../../research/claims.md#c-018) supports a slower stability controller,
  not a few-to-many context signal.
- [C-030](../../research/claims.md#c-030) supports recurring transient network
  states as an observational result, not causal broadcast control.
- [C-003](../../research/claims.md#c-003) establishes conditional routing as an
  AI baseline that this mechanism must improve upon rather than rename.
- [P-001](../../research/principle-registry.md#p-001--selective-allocation),
  [P-006](../../research/principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-008](../../research/principle-registry.md#p-008--compartmentalized-interaction),
  and
  [P-011](../../research/principle-registry.md#p-011--transient-communication-coalitions)
  are adjacent bundles. None currently specifies a rate-limited few-to-many
  signal with receiver-specific temporal decoding.

The experiment follows the isolated-mechanism gate in the
[research roadmap](../../concept/90-research-roadmap.md#stage-1--isolated-mechanism-experiments).

## Pre-registered hypotheses

### H1 — receiver-specific temporal decoding

At the same broadcast rate, parameter cap, inference-operation cap, and
training budget, receiver-specific fast and slow filters will reduce both task
error and impulse-response error relative to the best memoryless or
shared-filter conditioning baseline.

### H2 — communication efficiency

The candidate will outperform the equal-interface recurrent gate and match an
unconstrained learned global-token or hypernetwork baseline within a declared
task-equivalence margin, while moving fewer cross-module bytes and using no more
inference energy at the measurement boundary than the higher-bandwidth method.

### H3 — selective mechanism ablation

Removing the fast receiver path will selectively damage response to brief
events; removing the slow path will selectively damage sustained-regime
tracking. Sharing or permuting receiver parameters across modules will damage
module-specific response. Nonspecific degradation is not evidence for the
claimed mechanism.

### H4 — value beyond conventional control

On known nominal linear dynamics, a tuned gain-scheduled multirate controller
is expected to be difficult to beat. The learned candidate is useful only if it
occupies a better quality–communication–energy frontier under declared
nonlinearity, parameter uncertainty, or observation noise. If tuned
supervisory control remains dominant, the candidate is rejected for this task
class.

## Candidate mechanism

### Communication contract

At base step $t$, a context encoder receives only the global observation
$g_t$. It emits two scalar channels:

$$
b_t = \left[b_t^{F}, b_t^{S}\right],
$$

where:

- $b_t^{F}$ is updated every base step;
- $b_t^{S}$ is updated once every $K=32$ base steps and held between updates;
- each transmitted value is uniformly quantized to $q=8$ bits; and
- the primary base interval is $\Delta t=10\ \mathrm{ms}$.

The primary average broadcast rate is therefore

$$
R_b = \frac{q}{\Delta t} + \frac{q}{K\Delta t}
    = 825\ \mathrm{bit\,s^{-1}}.
$$

The exact bitstream is logged. Floating-point tensors may be used internally
after receipt, but they must be deterministic expansions of the transmitted
quantized values. No module may access $g_t$, another module's state, encoder
hidden state, quantizer residuals, gradients from future steps, or an
unquantized copy of $b_t$ during evaluation.

### Receiver contract

Each module $i$ maintains two causal first-order receiver states:

$$
r^{F}_{i,t} = \alpha^{F}_i r^{F}_{i,t-1}
  + \left(1-\alpha^{F}_i\right)b^{F}_t,
$$

$$
r^{S}_{i,t} = \alpha^{S}_i r^{S}_{i,t-1}
  + \left(1-\alpha^{S}_i\right)b^{S}_t,
$$

with

$$
\alpha_i^k = \exp\!\left(-\frac{\Delta t}{\tau_i^k}\right),
\qquad k\in\{F,S\}.
$$

$\tau_i^F$ and $\tau_i^S$ are positive learned time constants constrained to
the ranges declared below. The module forms

$$
m_{i,t} =
\left[b_t^F,r_{i,t}^F,b_t^S,r_{i,t}^S\right]
$$

and combines $m_{i,t}$ with a summary of its own local hidden state $h_{i,t}$
through a small receiver network $R_i$. $R_i$ emits bounded gain, bias, and
optional compute-gate values applied only inside module $i$:

$$
(\gamma_{i,t},\beta_{i,t},z_{i,t}) = R_i(m_{i,t},h_{i,t}),
$$

$$
\tilde h_{i,t}
= \gamma_{i,t}\odot\operatorname{LayerNorm}(h_{i,t})+\beta_{i,t}.
$$

This affine application makes FiLM a direct baseline. The claimed difference
is the constrained communication channel plus receiver-specific temporal
state, not the affine operation itself. Bounds on $\gamma$, $\beta$, and
$z$ are fixed before the full runs and shared with relevant baselines.

## Task A — ReceiverBank-ID

### Purpose

Measure whether the learned architecture recovers heterogeneous causal response
kernels rather than merely fitting average prediction loss.

### Generator

Each sequence has $T=1{,}024$ steps and $M=12$ local modules. Module $i$
receives local state $x_{i,t}\in\mathbb{R}^{8}$ generated by an independent
stable autoregressive process. Local state alone contains no information about
future global context.

Two hidden global processes are generated:

1. $c_t^F$: signed pulses with independently varied onset, amplitude, and
   duration of one to eight base steps;
2. $c_t^S$: a semi-Markov regime variable with training dwell times of 64 to
   512 base steps.

The context observation $g_t$ is a noisy, invertible mixing of the current
hidden processes. The model must encode it through the broadcast contract.

For each module, the target contains:

- a local nonlinear function of $x_{i,t}$;
- an instantaneous fast-context term;
- a module-specific filtered fast term with
  $\tau_i^F\in\{10,20,40,80\}\ \mathrm{ms}$;
- a module-specific filtered slow term with
  $\tau_i^S\in\{0.32,0.64,1.28,2.56\}\ \mathrm{s}$;
- fixed signed receiver gains balanced across modules; and
- a local receptivity factor computed from $x_{i,t}$ so that context does not
  affect every module uniformly at every step.

The recorded generator equation, coefficients, noise distributions, and random
seeds are part of the experiment artifact. Target noise is applied only after
the causal response is computed.

### Splits

- **IID:** new sequences from training ranges.
- **Waveform OOD:** unseen pulse widths and amplitude combinations.
- **Timescale OOD:** slow-regime dwell times of 32–63 and 513–1,024 steps.
- **Noise OOD:** twice the training observation-noise standard deviation.
- **Composition OOD:** fast-pulse/regime combinations withheld during training.

### Counterfactual probe

Freeze local states and inject a unit impulse separately into each hidden
context component. Estimate the causal response kernel

$$
\hat K_i^k(\ell)
= \frac{\partial \hat y_{i,t+\ell}}{\partial c_t^k},
\qquad k\in\{F,S\},
$$

for lags $\ell=0,\ldots,512$. Compare it with the analytic generator kernel.
This prevents an average-loss improvement from being misreported as evidence
for module- and timescale-specific decoding.

## Task B — SwitchedPlant-8

### Purpose

Test whether the same communication mechanism has value in closed-loop control
when a strong engineered multirate controller is available.

### Plant

Eight independent local plants run at $\Delta t=10\ \mathrm{ms}$. Each plant
has a two-dimensional normalized state $s_{i,t}$, one bounded local action
$a_{i,t}$, stable nominal linear dynamics, process noise, and a local reference.
The shared context changes:

- a fast safety disturbance and constraint weighting; and
- a slow operating regime that changes reference, disturbance statistics, and
  actuator effectiveness.

The same context has different signed and delayed consequences across plants.
Every local controller observes $s_{i,t}$ and the received context state but
not another plant. The global encoder observes only the noisy context sensor,
not local plant state. This isolates one-way broadcast from centralized state
feedback.

The normalized episode cost is

$$
J = \sum_{t=1}^{T}\Delta t\sum_{i=1}^{8}
\left[
  e_{i,t}^{\mathsf T}Q_i(c_t)e_{i,t}
  + \lambda_a a_{i,t}^2
  + \lambda_{\Delta a}(a_{i,t}-a_{i,t-1})^2
  + \lambda_v v_{i,t}^2
\right],
$$

where $e_{i,t}$ is normalized tracking error and $v_{i,t}$ is normalized
constraint violation. $Q_i$, $\lambda_a$, $\lambda_{\Delta a}$, and
$\lambda_v$ are fixed before full runs and identical across methods.

### Evaluation regimes

- **Nominal:** dynamics and noise seen during tuning.
- **Parameter shift:** independently perturb allowed plant coefficients by up
  to $\pm15\%$ while preserving stability.
- **Delay shift:** introduce an unmodeled one-step actuator delay in a random
  half of plants.
- **Sensor-noise shift:** double context and local-state observation noise.
- **Event collision:** fast safety events occur near slow-regime transitions.

The $15\%$ shift is an experiment stress level, not a biological or deployment
constant. Sensitivity runs use $5\%$, $10\%$, and $20\%$.

## Required baselines

All learned baselines receive the same local observations. Equal-interface
variants receive exactly the logged quantized broadcast unless explicitly
labeled as a higher-bandwidth upper bound.

| ID | Baseline | What it tests |
| --- | --- | --- |
| B0 | Local-only | Whether context is needed at all |
| B1 | Instantaneous FiLM | Per-module affine conditioning on current $b_t$, with no temporal receiver state |
| B2 | Shared-filter FiLM | Fast and slow filters are computed once globally and shared by every module before per-module FiLM |
| B3 | Memoryless ordinary gate | Sigmoid or softmax module gate from current local state and $b_t$; no receiver memory |
| B4 | Recurrent ordinary gate | A parameter-matched GRU gate receives local state and $b_t$ and can learn arbitrary temporal state |
| B5 | Bottleneck global token | A learned projection of quantized $b_t$ creates one token that local module tokens cross-attend to |
| B6 | Standard global token | One hidden-width context token is computed directly from $g_t$ and mixed through attention; quality upper bound with its actual larger traffic charged |
| B7 | Low-rank hypernetwork | Quantized $b_t$ generates bounded rank-$r$ adapters or gate weights for each module |
| B8 | Tuned multirate receiver bank | Fixed-form IIR filters and module gains selected by system identification or search; no neural receiver |
| B9 | Gain-scheduled supervisory control | Task B only: nominal per-plant LQR controllers, fast safety override, and a slow regime supervisor, tuned on the same training distribution |
| B10 | Oracle context | True $c_t^F,c_t^S$ and generator/plant parameters; unattainable diagnostic ceiling, never eligible as a learned winner |

The global-token baseline is motivated by shared-token Transformer designs such
as the learned classification token in
[Vision Transformer](https://arxiv.org/abs/2010.11929), but here the token is
defined specifically as a context carrier. The ordinary gate must include a
gated recurrent variant; comparing only with a memoryless sigmoid would make a
temporal task trivial. The hypernetwork generates weights as in the conventional
definition—one network producing parameters for another—not as a biological
analogy. B8 and B9 are necessary because the candidate receiver is also a
multirate control structure.

## Equal-budget protocol

### Fixed data and optimization budget

- Task A: $2{,}000{,}000$ generated training steps per full run.
- Task B: $5{,}000{,}000$ differentiable plant transitions per full run.
- Same train/validation/test generator seeds across methods.
- Same optimizer family, precision, checkpoint selection rule, gradient-update
  count, and maximum sequence-unroll length where applicable.
- Thirty hyperparameter configurations per method receive the same short-run
  step budget. The top configuration is selected using validation data only.
- Ten paired full-run seeds are executed after selection.
- Tuning and failed-run energy are reported separately from final-run energy;
  neither disappears from lifecycle accounting.

If a method requires a different optimizer or stability treatment, that becomes
a named variant and consumes configurations from the same search allowance.

### Model and operation budget

Primary learned comparisons use:

- at most $300{,}000$ trainable parameters;
- a common local backbone depth and interface;
- profiled multiply–accumulate operations within $\pm5\%$ per module-step;
- the same activation-precision mode; and
- the same batch size unless memory capacity prevents it.

Architectures are width-tuned to meet the operation envelope; unused padding
parameters do not count as matching. If exact matching is impossible, run three
widths bracketing the candidate and compare interpolated quality–cost Pareto
curves. Parameter count, executed operations, peak allocated bytes, and actual
wall latency are all reported; theoretical FLOPs alone are insufficient.

### Communication budget

For equal-interface variants, the only cross-module context input is the
$825\ \mathrm{bit\,s^{-1}}$ primary broadcast. Report both logical channel bits
and physical tensor bytes moved. Local expansion of a received scalar does not
increase logical bits but does consume memory traffic and operations.

B6 is deliberately allowed a larger hidden-width token and B7 may generate
many local weights. They are compared on a quality–communication–energy
frontier, not falsely labeled equal-communication baselines.

### Energy and latency boundary

Measure after fixed warm-up over at least $100{,}000$ inference steps:

- accelerator board power $P_{\mathrm{board}}(t)$ in watts at at least 10 Hz;
- board energy
  $E_{\mathrm{board}}=\int P_{\mathrm{board}}(t)\,dt$ in joules;
- wall latency per base step in milliseconds, including encoder, quantizer,
  receiver, and modulation;
- peak device memory in bytes; and
- host-to-device and inter-device bytes where applicable.

If an external node power meter is available, record node energy separately.
Do not infer node or facility energy from board power. On one accelerator,
logical communication savings may not reduce board energy; that is a valid
negative result.

## Variables and units

| Symbol | Meaning | Unit |
| --- | --- | --- |
| $M$ | number of receiver modules | count |
| $t$ | discrete base-step index | count |
| $\Delta t$ | base-step duration | seconds |
| $K$ | slow-channel update interval | base steps |
| $d_b$ | number of broadcast components | count |
| $q$ | transmitted precision per component | bits |
| $R_b$ | average logical broadcast rate | bits per second |
| $b_t^F,b_t^S$ | transmitted fast and slow context values | dimensionless quantized values |
| $r_{i,t}^F,r_{i,t}^S$ | local receiver states | dimensionless |
| $\tau_i^F,\tau_i^S$ | receiver time constants | seconds |
| $\alpha_i^F,\alpha_i^S$ | discrete filter retention factors | dimensionless |
| $h_{i,t}$ | local hidden state | dimensionless activations |
| $s_{i,t}$ | normalized plant state | dimensionless after declared scaling |
| $a_{i,t}$ | normalized bounded control action | dimensionless |
| $J$ | normalized cumulative control cost | dimensionless-seconds |
| $P$ | measured electrical power | watts |
| $E$ | measured electrical energy | joules |
| $L$ | wall latency | milliseconds per base step |
| $B_{\mathrm{physical}}$ | measured context-related memory traffic | bytes per base step |

All plant normalizers are fixed from training data and stored. Report original
unnormalized constraint violations alongside normalized $J$ if physical units
are later assigned to the simulator.

## Metrics

### Task metrics

**Task A**

- normalized root-mean-square prediction error (NRMSE), overall and per module;
- fast-event onset error and peak-amplitude error;
- slow-regime steady-state error and settling time in seconds;
- response-kernel NRMSE over lag and module;
- error by receptivity decile; and
- IID and each OOD split reported separately.

**Task B**

- normalized episode cost $J$;
- integral absolute tracking error in seconds;
- maximum overshoot as a fraction of the local allowed range;
- constraint-violation count, duration in seconds, and integrated magnitude;
- control variation $\sum_t|a_{i,t}-a_{i,t-1}|$; and
- recovery time after fast events and slow transitions in seconds.

### Mechanism metrics

- learned $\tau_i^F$ and $\tau_i^S$ versus generator values;
- per-module impulse-response kernel error;
- signed response agreement with ground truth;
- fast/slow branch utilization;
- receiver-output mutual information with the transmitted code, estimated only
  as a diagnostic and never treated as exact channel capacity;
- code usage entropy in bits; and
- module response diversity after controlling for local state.

### Systems metrics

- train and inference joules at each declared boundary;
- inference milliseconds per step, median and p95;
- executed operations per step;
- peak device bytes;
- logical broadcast bits per second;
- physical context-related bytes per step; and
- tuning plus final-training lifecycle energy.

## Ablations

Run every ablation with the same selection and full-seed protocol unless marked
as a diagnostic sweep.

1. **No broadcast:** replace both channels with their training means.
2. **Shuffle in time:** permute broadcasts between sequences while preserving
   their marginal distribution.
3. **No fast branch:** remove $b^F$ and $r_i^F$.
4. **No slow branch:** remove $b^S$ and $r_i^S$.
5. **Memoryless receiver:** set $r_i^F=b_t^F$ and $r_i^S=b_t^S$.
6. **Shared time constants:** one $\tau^F$ and one $\tau^S$ for all modules.
7. **Shared receiver:** share all receiver parameters across modules.
8. **Permuted receiver identities:** apply trained receiver $R_i$ and its time
   constants to a different module without retraining.
9. **Unsigned receiver:** constrain all context gains to be nonnegative.
10. **No local-state input:** $R_i$ receives only broadcast-derived state.
11. **All-fast transmission:** update both components every base step and charge
    the resulting bits; compare at the larger rate and with a rate-matched
    quantization variant.
12. **Unquantized transmission:** diagnostic upper bound that is ineligible for
    the primary equal-interface comparison.
13. **Broadcast dimension sweep:** $d_b\in\{1,2,4,8\}$.
14. **Precision sweep:** $q\in\{4,8,16\}$ bits per update.
15. **Receiver-state capacity sweep:** one IIR state, the primary two-state
    receiver, and a parameter-matched GRU receiver.

Selective evidence for H3 requires an interaction: the fast-branch ablation
must damage fast-event metrics more than slow steady-state metrics, and the
slow-branch ablation must show the reverse. A general loss increase after
deleting parameters proves only that capacity was removed.

## Analysis and decision protocol

### Pairing and uncertainty

- Pair methods by generator seed and initialization seed where architecture
  permits.
- Report every full-run seed; do not discard unstable runs.
- Use paired bootstrap 95% confidence intervals across full-run seeds and test
  episodes for method differences.
- Report median, mean, standard deviation, and worst seed.
- Predeclare NRMSE, Task-B $J$, physical bytes, and inference joules as primary;
  treat remaining metrics as diagnostic or safety constraints.

### Practical margins

Before full runs, freeze these project decision margins:

- task equivalence: within $2\%$ relative of the better normalized task metric;
- material task improvement: at least $5\%$ relative;
- material response-kernel improvement: at least $10\%$ relative; and
- material systems improvement: at least $5\%$ relative in measured joules or
  at least $25\%$ fewer physical context bytes at task equivalence.

These are engineering decision thresholds, not empirical constants. Publish
sensitivity at $2\%$, $5\%$, and $10\%$ task margins and at $10\%$, $25\%$,
and $50\%$ traffic margins.

## Promotion gates

### Mechanism-support gate

All conditions are required:

1. On both tasks, the candidate improves the primary task metric by at least
   $5\%$ over the best equal-interface memoryless or shared-filter baseline,
   with the paired 95% interval excluding zero.
2. On Task A, response-kernel NRMSE improves by at least $10\%$ over that same
   baseline.
3. The fast/slow and receiver-sharing ablations show the predeclared selective
   interactions.
4. The candidate is not task-equivalent to the parameter-matched recurrent
   ordinary gate at the same communication and systems cost. Equivalence here
   counts against novelty.
5. No hidden communication path or rate-contract violation is detected.

### Efficiency-promotion gate

Passing the mechanism gate is not enough for Stage 2. The candidate must also:

1. match the best higher-bandwidth learned token or hypernetwork baseline within
   the $2\%$ task-equivalence margin;
2. use at least $25\%$ fewer measured physical context bytes or at least $5\%$
   less measured inference energy;
3. add no more than $5\%$ p95 latency at the matched task point; and
4. remain nondominated by tuned supervisory/multirate control in at least one
   declared shifted Task-B regime without becoming unsafe elsewhere.

Only a mechanism-gate pass plus an efficiency-gate pass justifies integration
into a two-loop prototype. A mechanism-only pass remains an isolated research
result.

## Immediate rejection conditions

Reject or merge the candidate rather than creating a new principle if any of
the following holds:

- shared-filter FiLM, the recurrent gate, or tuned multirate receiver bank is
  task-equivalent at the same rate and cost;
- a standard global token achieves equal quality with equal or lower measured
  bytes, latency, and energy;
- the result depends on unquantized continuous values, quantizer residuals, or
  another undeclared channel;
- learned time constants do not reproduce under seed changes or do not align
  with causal response kernels;
- deleting either temporal branch causes only nonspecific capacity loss;
- receiver identity can be permuted without a module-specific penalty;
- the candidate wins only because it receives local or global observations
  denied to a baseline;
- the advantage disappears after equal hyperparameter-search budget or
  operation matching;
- the learned system violates constraints more often than the conventional
  controller;
- receiver and modulation overhead erase routing or communication savings; or
- the tuned gain-scheduled multirate controller dominates all learned methods
  on quality, safety, traffic, and energy.

If instantaneous or shared-filter FiLM wins, record this as evidence that
feature-wise conditioning is sufficient. If a GRU gate wins, record that
general recurrent state is sufficient. If supervisory control wins, use the
engineered controller rather than preserving biological terminology.

## Implementation prerequisites

No full experiment should start until all prerequisites have executable tests.

### Generator and simulator

- deterministic ReceiverBank-ID generator with serialized coefficients,
  normalizers, seeds, and analytic response kernels;
- deterministic differentiable SwitchedPlant-8 simulator with stability tests,
  declared normalized units, and an independent rollout checker;
- fixed IID/OOD split manifests; and
- oracle scripts that verify target equations and nominal control solutions.

### Communication enforcement

- an explicit quantizer and bit-packing/logging layer;
- unit tests for update cadence, sample-and-hold behavior, and average bit rate;
- architectural checks that modules cannot reach global observations or encoder
  hidden state; and
- run artifacts containing the exact transmitted code for a reproducible test
  subset.

### Models and baselines

- one shared modular-backbone interface used by every learned method;
- reference implementations of instantaneous and shared-filter FiLM, MLP and
  GRU gating, bottleneck and standard global tokens, and a low-rank
  hypernetwork;
- a system-identification baseline for fixed IIR receiver banks;
- a gain-scheduled LQR/safety-override controller reviewed independently of the
  learned implementation; and
- scripts that profile parameter count, executed operations, memory, and
  context traffic for every model.

### Measurement and reproducibility

- device-power sampling validated against a fixed synthetic workload;
- synchronized power, latency, and workload timestamps;
- environment, dependency, compiler, device, driver, and precision manifests;
- immutable configuration and seed files per run;
- failure logging that preserves diverged and constraint-violating runs; and
- one command that regenerates tables, response kernels, Pareto plots, and
  confidence intervals from raw artifacts.

## Expected interpretation

The strongest positive result is not “a biological broadcast works.” It is:

> Under a measured information-rate constraint, heterogeneous local temporal
> decoders reproduce causal receiver kernels and match higher-bandwidth
> coordination with lower physical traffic or energy, beyond what tuned FiLM,
> gating, tokens, hypernetworks, and multirate control provide.

Anything weaker should be attributed to the conventional method that explains
it. This candidate is deliberately easy to retire or merge.

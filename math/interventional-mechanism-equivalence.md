# Intervention-qualified mechanism equivalence

<!-- markdownlint-disable MD013 -->

- **Purpose:** freeze the equations, property ontology, intervention interface,
  abstention rule and singular-boundary-layer metric for RSD-T02
- **Claims:** [C-1541](../research/claims.md#c-1541) and
  [C-1560](../research/claims.md#c-1560),
  [C-1561](../research/claims.md#c-1561),
  [C-1562](../research/claims.md#c-1562),
  [C-1563](../research/claims.md#c-1563), and
  [C-1564](../research/claims.md#c-1564)
- **Evidence audit:** [mechanism equivalence and intervention-qualified discrimination](../research/audits/2026-08-26-rsd-t02-mechanism-equivalence.md)
- **Decision:** [0019 — score interventional properties, not generator names](../decisions/0019-score-interventional-properties-not-generator-names.md)
- **Experiment contract:** [Fixture F-026, RSD-T02](../experiments/fixtures/026-interface-qualified-relative-sensing.md#rsd-t02--mechanism-discrimination-under-matched-step-behavior)
- **Result state:** public-development equation and contract foundation;
  `NO_RESULT`, no implemented estimator comparison, no confirmation custody and
  no energy measurement

## Two different questions

RSD-T02 contains two linked but mathematically different strata:

1. `T02-MECH` asks which structural or interventional properties can be
   distinguished after several synthetic systems are forced to have the same
   canonical step response.
2. `T02-FLOOR` asks whether an estimator recovers a source-qualified
   supremum-norm error floor in a singularly perturbed system.

The first is a model-discrimination problem. The second is a norm and temporal
resolution problem. Combining them into one family label or one integrated
trajectory score would make both endpoints ambiguous.

## Notation and units

| Symbol | Meaning | Unit |
| --- | --- | --- |
| $t$ | physical time | seconds (s) |
| $u_c(t)$ | input on channel $c\in\{A,B\}$ | input unit (U) |
| $b$ | registered positive background | U |
| $v_c(t)=u_c(t)/b$ | background-normalized input | dimensionless |
| $F_*$ | canonical fold, fixed to $2$ | dimensionless |
| $\tau_*$ | matched response time constant | s |
| $x,a,r_c,z$ | internal states | dimensionless |
| $\widetilde y(t)$ | internal output before a registered clamp | dimensionless |
| $y(t)$ | reported output | dimensionless |
| $P$ | registered intervention panel | finite set |
| $D_{\infty}^{m,n,i}$ | maximum output difference between recipes $m,n$ under intervention $i$ | dimensionless |
| $D_2^{m,n,i}$ | RMS output difference | dimensionless |
| $\epsilon$ | fast/slow time-scale ratio | dimensionless |
| $p$ | positive multiplicative scale factor | dimensionless |
| $E_{\infty}(\epsilon,p)$ | maximum instantaneous FCD discrepancy | dimensionless |
| $E_2(\epsilon,p)$ | integrated RMS discrepancy | dimensionless |

The synthetic T02 input support uses $b\in\{0.5,2,8\}\,\mathrm U$,
$\tau_*\in\{0.5,1,2\}\,\mathrm s$, and strictly positive normalized input.
These are frozen benchmark design values, not biological estimates.

## Exact matched-step construction

Every mechanism recipe starts at the steady normalized background $v=1$ and
receives the canonical step $v:1\rightarrow F_*$. All five recipes must produce

$$
y_*(t)=e^{-t/\tau_*},
\qquad t\ge0.
$$

This removes ordinary step fit as a discriminator by construction. The
generator recipe remains evaluator-only provenance.

### Input-driven incoherent feed-forward recipe

Use

$$
\tau_*\dot x=v-x,
\qquad
\widetilde y=\frac{v-x}{F_*-1},
\qquad
x(0^-)=1.
$$

The direct $v\rightarrow y$ path and delayed antagonistic
$v\rightarrow x\rightarrow y$ path form the operational feed-forward
structure. For a constant post-step input $F_*$,

$$
x(t)=F_*-(F_*-1)e^{-t/\tau_*},
$$

and therefore $\widetilde y(t)=e^{-t/\tau_*}$.

This is a synthetic reduced recipe inspired by the functional structure. It is
not asserted to be the molecular equation set of a particular organism.

### Nonlinear output-feedback recipe

Let

$$
\widetilde y=\frac{v-a}{F_*-1},
$$

$$
\tau_*\dot a
=
(F_*-1)y
+
\kappa(v-1)(v-F_*)y^2,
\qquad
a(0^-)=1,
\qquad
\kappa=0.25.
$$

Normally $y=\widetilde y$. During the registered output-clamp intervention,
$y=0$ is forced inside the feedback edge while $\widetilde y$ remains
evaluator-visible after response freeze. The nonlinear term is zero at both
$v=1$ and $v=F_*$. On the canonical step,

$$
\tau_*\dot a=F_*-a,
$$

which gives the same $y_*(t)$. Away from that step and under the output clamp,
the state update differs.

### Channel-local receptor/reference memory

For $c\in\{A,B\}$, use

$$
\tau_*\dot r_c
=
\chi_c(t)\,[v_c-r_c],
\qquad
r_A(0^-)=r_B(0^-)=1,
$$

$$
\widetilde y
=
\frac{v_{c_{\mathrm{active}}}-r_{c_{\mathrm{active}}}}{F_*-1}.
$$

$\chi_c(t)=1$ only for the active channel. The inactive channel retains its
own reference. The first active-channel step again yields $y_*(t)$, while
same-channel and cross-channel restimulation test state locality.

### Static normalization plus an ordinary high-pass readout

Define the static affine fold transform

$$
\phi_{\mathrm{lin}}(v)=\frac{v-1}{F_*-1},
$$

followed by

$$
\tau_*\dot z=\phi_{\mathrm{lin}}(v)-z,
\qquad
\widetilde y=\phi_{\mathrm{lin}}(v)-z,
\qquad
z(0^-)=0.
$$

The normalization reference $b$ is static, but the complete system is not
memoryless: the ordinary high-pass filter has causal state. On the canonical
step $\phi_{\mathrm{lin}}=1$, so $z=1-e^{-t/\tau_*}$ and
$\widetilde y=y_*(t)$.

This recipe is input--output isomorphic to the reduced I1-FFL recipe under the
registered affine interface. Their names must not be forced apart.

### Explicit log difference plus the same readout order

For $v>0$, define

$$
\phi_{\log}(v)=\frac{\ln v}{\ln F_*},
$$

$$
\tau_*\dot z=\phi_{\log}(v)-z,
\qquad
\widetilde y=\phi_{\log}(v)-z,
\qquad
z(0^-)=0.
$$

The canonical step again has $\phi_{\log}=1$. Other folds and ramps distinguish
the log transform from the affine transform. Nonpositive input is outside
support and forces abstention; no hidden numerical epsilon is inserted.

## Matched-step certificate

For recipes $m$ and $n$, background $b$, time constant $\tau_*$ and output
samples $t_k$, define

$$
D_{\mathrm{step},\infty}^{m,n}
=
\max_k |y_m(t_k)-y_n(t_k)|.
$$

A public-development pack is invalid unless:

1. every initialization residual is at most $10^{-12}$;
2. every registered recipe pair has
   $D_{\mathrm{step},\infty}^{m,n}\le10^{-10}$;
3. the canonical step policy projection contains no recipe, equation, state,
   parameter or property identifier; and
4. every actionable arm receives the same projection hash.

The tolerances are benchmark design constants. They are not empirical
biological margins and grant no result authority.

## Property vector and equivalence

The primary target is the evaluator-certified vector

$$
\boldsymbol\pi
=
\left(
T_{\mathrm{drive}},
F_{y},
C_{\mathrm{local}},
M_{\mathrm{causal}}
\right),
$$

where:

1. $T_{\mathrm{drive}}\in\{\text{affine-fold},\text{log-fold}\}$;
2. $F_y$ states whether the reported output participates in a state-update
   feedback edge;
3. $C_{\mathrm{local}}$ states whether reference state is channel-local;
4. $M_{\mathrm{causal}}\in\{\text{true},\text{false},\text{unassessed}\}$ is
   certified from equations or an identifying intervention, never from a
   finite trace alone.

Nonlinear update form remains equation provenance in the v1 bank. It perfectly
co-varies with the output-feedback coordinate across these five worlds, so the
contract cannot honestly score it as a separately identified property without
adding a counterworld that breaks that dependence.

For intervention panel $P$, observation map $h$, sample grid $\mathcal T$ and
initialized recipes $m,n$, define

$$
D_{\infty}^{m,n,i}
=
\max_{t_k\in\mathcal T_i}
|y_m^i(t_k)-y_n^i(t_k)|,
$$

$$
D_2^{m,n,i}
=
\sqrt{
\frac{1}{T_i}
\int_0^{T_i}
[y_m^i(t)-y_n^i(t)]^2dt
}.
$$

A pair with different property vectors is numerically separated only when one
frozen intervention has estimate $\widehat D_{\infty}^{m,n,i}$ and numerical
error bound $\eta$ satisfying

$$
\widehat D_{\infty}^{m,n,i}-\eta\ge10^{-3},
\qquad
\eta\le10^{-8}.
$$

An analytic equivalence or a complete bounded finite-grid equivalence with
$\widehat D+\eta\le10^{-10}$ may retain both recipes. A claimed analytic
equivalence that conflicts with its numerical bound is invalid rather than
silently unresolved. Every other case is unresolved.

The I1-FFL and affine high-pass recipes deliberately share one operational
property vector and one full-panel equivalence class. Guessing between their
hidden names is an error, not added accuracy.

The v1 construction certificates are scoped to $b=2\,\mathrm U$,
$\tau_*=1\,\mathrm s$, a $24\,\mathrm s$ horizon, 64 output samples per
second and binary64 RK4. Discontinuous commands use half-open intervals and
the left limit for the final RK4 stage ending on an event; the next step starts
from the right-limit command. Distances at internal steps $1/1024\,\mathrm s$
and $1/2048\,\mathrm s$ must differ by at most $10^{-12}$. The conservative
construction lower bounds are $0.23$ for the clamp and cross-channel
certificates and $0.07$ for the affine-versus-log ramp certificate. These
margin checks reproduce a synthetic construction; they are not empirical
mechanism evidence or confirmation results.

## Nested intervention panels

The full fixed panel contains exactly 26 episodes:

1. three canonical steps at the three backgrounds;
2. six repeated-pulse cells obtained from
   $w\in\{1/8,1/2,2\}\,\mathrm s$ and
   $\Pi\in\{1/2,2,8\}\,\mathrm s$ with $w<\Pi$;
3. eight ramps: linear or exponential, up or down, each lasting $0.5$ or
   $4\,\mathrm s$;
4. two opaque-state resets;
5. two opaque-state freezes;
6. one reported-output clamp;
7. two interrupted-ramp holds lasting $0.5$ or $4\,\mathrm s$; and
8. same-channel and cross-channel restimulation.

Every episode lasts $24\,\mathrm s$. The noncanonical episodes use
$b=2\,\mathrm U$ and $\tau_*=1\,\mathrm s$. Periodic pulses have
$v(t)=2$ on $[j\Pi,j\Pi+w)$ while that interval remains inside the episode and
$v(t)=1$ otherwise. For ramp duration $d$, let
$s(t)=\min\{1,\max\{0,t/d\}\}$. Linear-in-fold ramps use

$$
v(t)=1+s(t)(v_1-1),
$$

and linear-in-log-fold ramps use

$$
v(t)=\exp\!\left[s(t)\ln v_1\right],
$$

with $v_1=2$ for up-ramps and $v_1=0.5$ for down-ramps. Reset occurs at
$0.75\,\mathrm s$; state freezes and the reported-output clamp occupy
$[0.5,1)\,\mathrm s$. Interrupted ramps pause after one second of active ramp
progress and resume after the registered hold. Restimulation drives channel A
on $[0,1)\,\mathrm s$, returns both channels to one on $[1,2)\,\mathrm s$,
then drives A or B on $[2,3)\,\mathrm s$. The machine contract carries these
numbers in each episode descriptor.

Every recipe exposes two opaque handles. A single-state recipe receives an
inert padding state, and a seed-derived hidden permutation maps states to
handles. State count and semantic node names therefore do not identify the
recipe.

The observation regimes are:

1. `O0-MATCHED-STEP`: three episodes and at most 4,611 sample rows; every
   varying structural coordinate requires abstention.
2. `O1-FULL-PANEL`: all 26 episodes and at most 39,962 sample rows; this is the
   future fixed-panel primary regime.
3. `O2-SELECT6`: the three step episodes plus at most six selected queries, no
   more than two privileged internal queries, and at most 13,833 sample rows;
   it is a secondary active-design regime.

The current code freezes these regimes and analytic construction certificates.
It does not implement an actionable estimator or a claim-eligible run.

The repeated-pulse grid is retained because the Rahi evidence makes
refractory stabilization and period skipping useful one-sided signatures in a
different bounded model class. The current five-world bank does not instantiate
that signature: its registered feedback nonlinearity is zero at both square-
pulse levels. C-1561 therefore remains a future pulse-signature extension, not
a claim supported by these construction tests.

## Calibration and abstention

For property coordinate $q$, let $\mathcal E_q$ be the set of values compatible
with the registered observation packet and define

$$
I_q=\mathbb 1[|\mathcal E_q|=1].
$$

An arm returns a probability $\widehat P(I_q=1)$, a posterior over property
values, and either `decide` or `abstain`. With probabilities clipped at
$10^{-12}$, the calibration loss in nats is

$$
L_{\mathrm{cal},q}
=
-I_q\ln\widehat P(I_q=1)
-(1-I_q)\ln[1-\widehat P(I_q=1)]
-I_q\ln\widehat P(\pi_q).
$$

The decision loss is dimensionless:

$$
L_{\mathrm{dec},q}
=
\begin{cases}
0, & I_q=1\text{ and the decision is correct},\\
0.25, & I_q=1\text{ and the arm abstains},\\
0, & I_q=0\text{ and the arm abstains},\\
1, & \text{wrong decision or declaration on a non-singleton set}.
\end{cases}
$$

Coverage, selective risk and reliability remain separate. Sensitivity analyses
later vary the identifiable-case abstention cost to $0.1$ and $0.5$; they do
not replace the primary loss.

## The fast boundary layer needs the right norm

The source-qualified stratum uses the nondimensional input-degradation model

$$
\tau_s\dot x=\bar u-x,
\qquad
\epsilon\tau_s\dot y=x-\bar u y,
$$

with $\tau_s=1\,\mathrm s$, $\bar u_0=1$, $\bar u_*=2$,
$x(0)=\bar u_0$ and $y(0)=1$. The scaled member uses
$\bar u_p=p\bar u$, $x_p(0)=p\bar u_0$ and $y_p(0)=1$.

The primary finite-grid truth is

$$
D_{\infty,\epsilon,p}
=
\sup_{0\le t\le8\tau_s}
|y_{\epsilon,p}(t)-y_{\epsilon,1}(t)|.
$$

For this registered construction, the associated fast initial-value systems
give

$$
M_p
=
\left|1-\frac{\bar u_0}{\bar u_*}\right|
|p-1|p^{p/(1-p)}>0,
\qquad p\ne1,
$$

and a source-shaped finite-$\epsilon$ bound has the form

$$
D_{\infty,\epsilon,p}
\ge
M_p-\epsilon\widetilde N_p.
$$

The protected construction does not infer this asymptotic statement from a
finite sweep. It checks the declared generator and bound.

An RMS score measures something else:

$$
D_{2,\epsilon,p}
=
\sqrt{
\frac{1}{8\tau_s}
\int_0^{8\tau_s}
|y_{\epsilon,p}(t)-y_{\epsilon,1}(t)|^2dt
}.
$$

The exact physical-time metric counterexample

$$
e_{\epsilon}(t)=e^{-t/(\epsilon\tau_s)}
$$

has

$$
\|e_{\epsilon}\|_{\infty}=1,
\qquad
\operatorname{RMS}(e_{\epsilon})
=
\sqrt{
\frac{\epsilon\tau_s}{2T}
\left(1-e^{-2T/(\epsilon\tau_s)}\right)
}
\longrightarrow0.
$$

![A boundary-layer peak remains fixed in the supremum norm while its RMS value falls with epsilon.](../public/plots/fast-boundary-layer-norms.svg)

The figure is an exact toy norm comparison, not a biological fit or a run of
the source-shaped generator.

## Fast- and slow-time sampling

The protected grid freezes

$$
\epsilon\in
\{10^{-1},10^{-2},10^{-3},10^{-4},10^{-5},10^{-6},10^{-7}\},
$$

$$
p\in\{0.5,2,4,8,20\}.
$$

The critical initial-layer time is

$$
t_{\epsilon,p}
=
\epsilon\tau_s
\frac{\ln p}{(p-1)\bar u_*}.
$$

Every cell samples the union

$$
\left\{
\epsilon\tau_s\frac{j}{128}:j=0,\ldots,1024
\right\}
\cup
\left\{
\tau_s\frac{k}{64}:k=0,\ldots,512
\right\}.
$$

The first grid resolves the shrinking boundary layer; the second retains the
eight-second slow response. Deduplication leaves at most 1,537 paired rows per
cell.

The floor stratum crosses three equation-defined models, seven epsilon values
and five scale factors. Besides the singular system above, both controls share

$$
\tau_s\dot x=\bar u-x.
$$

The exact-equivariance control reports

$$
y_{0}=\frac{\bar u}{x}-1.
$$

Because the scaled member has $\bar u_p=p\bar u$ and $x_p=px$, its discrepancy
is identically zero. The regular-perturbation control reports

$$
y_{\epsilon}
=
\frac{\bar u}{x}-1
+\epsilon(\bar u-\bar u_0).
$$

Its scaled-versus-unscaled discrepancy is
$\epsilon|p-1||\bar u-\bar u_0|$ and therefore tends to zero. The three
registered models are consequently:

1. the source-shaped singular construction;
2. an exact-equivariance zero-floor control; and
3. a regular-perturbation control whose discrepancy tends to zero.

That is 105 public-development cells and at most 161,385 paired rows. RMS is
diagnostic only and cannot establish or refute the supremum floor.

## Information firewall

Every actionable arm receives only causal inputs, reported outputs, masks,
opaque intervention commands, timestamps and units. Before the arm response is
frozen it does not receive:

1. recipe or equation identity;
2. semantic state names or the hidden handle permutation;
3. parameters or evaluator properties;
4. future samples or future-derived normalization;
5. the equivalence or separation certificate; or
6. continuous evaluator truth.

The actionable registry has nine roles:

1. `A-RAW`;
2. `B-STATIC-DIV`;
3. `B-STREAM`;
4. `B-LOG-RATIO`;
5. `B-DIFFERENCE`;
6. `B-STATE-SPACE`;
7. `B-RECURRENT`;
8. `C-MECHANISM-BANK`; and
9. `C-DUAL`.

`O-GRAPH` is evaluator-only and excluded from parity, tuning, promotion and
resource rankings. Public source code does not create confirmation secrecy; a
claim-eligible run later needs separately committed sealed seed mapping and
custody.

## Typed acquisition and computation cost

Do not collapse intervention access and execution into one score. Every arm
retains at least:

1. episodes and sample rows;
2. serialized observation bytes and input commands;
3. internal resets, freezes and output clamps;
4. channel switches and state writes;
5. scalar operations and transcendental evaluations;
6. retained-state and parameter bytes;
7. tuning trials and wall seconds; and
8. later measured joules, when a calibrated physical protocol exists.

The foundation suggests future caps of one CPU thread, binary64 arithmetic,
16 retained scalars, 512 trainable scalars and 32 tuning trials. They are not
active parity claims because the algorithms and complete ledger are absent.

## Support and fail-closed cases

Each scientific case retains the six independent support axes already frozen
for RSD-T01:

1. input domain;
2. transformation family;
3. instrument range and temporal resolution;
4. initialization;
5. causal observation; and
6. evaluation window.

Valid scientific hostiles include additive offset, near-zero input, clipping,
hidden reset, future-aware normalization, channel-state contamination and
boundary-layer censoring. Parser, checksum, order or unit failures remain
malformed sentinels outside the scientific denominator.

Missing, duplicate, rejected or mixed-initialization transcripts force system
abstention and remain visible. A fixed slow-time sampler that misses the
protected fast layer is a scientific failure, not a missing-data deletion.

## Current authority and kill rules

The machine registry states:

```json
{
  "authority": "contract-foundation-only",
  "partition": "public-development",
  "information_cut_status": "registered-projection-no-secret-custody",
  "comparison_authority": false,
  "result_authority": "NO_RESULT"
}
```

The future T02 comparison is killed if any of the following occurs:

1. step fit, recipe name or graph access supplies the primary answer;
2. a declared separating intervention lacks a pairwise certificate;
3. an arm is rewarded for guessing inside an observational equivalence class;
4. privileged access is unequal or missing from the cost vector;
5. RMS or a fixed slow grid substitutes for the registered supremum endpoint;
6. a finite epsilon sweep is presented as proof of an asymptotic theorem; or
7. a mechanism-specific bank cannot beat the generic state-space/recurrent
   null under the same projection and budget.

The current foundation can test equations, exact step matching, operational
equivalence, registry closure, abstention scoring and temporal-grid coverage.
It cannot support architecture superiority, natural-mechanism attribution,
workstation readiness or energy efficiency.

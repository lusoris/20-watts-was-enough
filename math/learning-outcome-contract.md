# Horizon-qualified learning outcomes

## Scope

This note makes acquisition, retention, transfer, fluency, calibration,
motivation, and effort separate outputs. It supports the
[learning-science audit](../research/audits/2026-08-05-learning-science-skill-acquisition.md)
and the experiment contracts for Candidates
[004](../experiments/candidates/004-closed-endogenous-curriculum.md) and
[019](../experiments/candidates/019-audited-cumulative-inheritance.md).
Its evidence boundaries are [C-627](../research/claims.md#c-627)–[C-658](../research/claims.md#c-658).

## Immediate and retained change

For learner/model $i$, skill item $j$, and policy $m$, let $Y_{ijm}(t)$ be a
score in a declared score unit. Acquisition and retained change are

$$
A_{ijm}=Y_{ijm}(t_{\mathrm{post}})-Y_{ijm}(t_{\mathrm{pre}}),
$$

$$
R_{ijm}(\Delta)=
Y_{ijm}(t_{\mathrm{post}}+\Delta)-Y_{ijm}(t_{\mathrm{pre}}),
$$

where retention horizon $\Delta$ is seconds, task events, or another declared
clock. A policy can win on $A$ and lose on $R(\Delta)$.

## Transfer is indexed

Let $d\in\{0,1,2,3\}$ identify preregistered strata: trained form, near
variant, changed representation/context, and novel causal composition. Against
baseline $m_0$,

$$
T_m(d)=
\mathbb E[Y^{\mathrm{transfer}}\mid m,d]
-\mathbb E[Y^{\mathrm{transfer}}\mid m_0,d].
$$

$T_m(d)$ uses score units and is reported for every $d$. A single mean called
“generalization” cannot show which cue, mapping, or composition transferred.

For elapsed time $\tau$ seconds, $c$ correct responses, and $n$ attempts,

$$
F=\frac{c}{\tau}
\quad[\mathrm{correct\ tasks\ s^{-1}}],
\qquad
e=1-\frac{c}{n}\quad[1].
$$

Fluency requires the $(F,e)$ frontier, not speed alone. Calibration retains
item-level confidence before feedback and reports a proper score such as

$$
\operatorname{BS}=\frac{1}{N}\sum_{k=1}^{N}(p_k-y_k)^2,
$$

which is dimensionless for probability $p_k$ and binary outcome $y_k$.

## Skill-local scheduling state

For skill $j$, scheduler state is

$$
\mathcal L_{j,t}=
(\hat a,\hat r_{\Delta_1:\Delta_q},\hat T_{0:3},
\hat F,\hat c,\sigma,\chi,h,v),
$$

where $\hat a$ is acquisition, $\hat r$ retention by target horizon,
$\hat T$ transfer by stratum, $\hat F$ fluency, $\hat c$ calibration, $\sigma$
support/scaffold state, $\chi$ confusability/context, $h$ intervention history,
and $v$ state/model version. These are estimates with uncertainty, not hidden
truth labels.

The next event may retrieve, restudy, vary, compare, explain, fade support, or
stop. Difficulty is admissible only when processing succeeds often enough to
produce information; failure without interpretable feedback is not useful
effort by definition.

## Complete cost

Keep raw cost components

$$
\mathbf c_m=(\tau,N_e,N_r,N_f,N_h,B,E,H_T,H_L),
$$

where $\tau$ is learner time in seconds; $N_e,N_r,N_f,N_h$ are exposure,
retrieval, feedback, and hint counts; $B$ is stored bytes; $E$ is joules; and
$H_T,H_L$ are teacher and learner effort in person-seconds. Variable-time
mastery, adaptive scheduling, or interactive teaching cannot claim efficiency
while receiving uncharged extra attempts or attention.

## Falsification boundary

The scheduler loses if tuned spaced repetition, fixed expanding intervals,
ordinary knowledge tracing, blocked/random/interleaved schedules, worked
examples with fixed fading, hard-example mining, or fixed curriculum match the
delayed retention–transfer–cost frontier. A teaching channel loses if a
versioned artifact plus tests preserves equal capability across learner/model
turnover at lower combined effort.

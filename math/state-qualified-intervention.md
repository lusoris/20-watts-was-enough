# State-qualified intervention and withdrawal

## Scope

This note formalizes the held pharmacology/toxicology transfer: commanded
intervention, realized internal state, mechanism engagement, benefit, harm,
adaptation, and withdrawal remain separate. It supports the
[pharmacology audit](../research/audits/2026-08-05-pharmacology-toxicology.md)
and Candidates [005](../experiments/candidates/005-severity-ordered-containment.md),
[007](../experiments/candidates/007-endogenous-observation-surveillance.md),
[012](../experiments/candidates/012-latency-qualified-authority.md), and
[014](../experiments/candidates/014-versioned-observation-contract.md).
The evidence and boundary claims are
[C-607](../research/claims.md#c-607)–[C-626](../research/claims.md#c-626).

## Intervention chain

For system state $x_t$, commanded intervention $d_t$, realized internal
exposure $e_t$, adaptation state $z_t$, and observation $y_t$, use

$$
e_{t+1}=f_e(e_t,d_t,c_t,w_t^e),
$$

$$
x_{t+1}=f_x(x_t,e_t,z_t,c_t,w_t^x),
\qquad
z_{t+1}=f_z(z_t,e_t,x_t,c_t,w_t^z),
$$

$$
y_t=h_v(x_t,e_t,z_t,d_{0:t},s_t)+\epsilon_t.
$$

Here $c_t$ is typed context, $s_t$ is sampling/selection state, $v$ is the
observation-model version, and every disturbance $w_t^\cdot$ and error
$\epsilon_t$ has the unit of the equation in which it appears. The command
$d_t$ and exposure $e_t$ need not share a unit: a token quota, update rate, or
tool permission is not evidence that the intended computation, parameter
change, or external effect occurred. Forecast value, feedback correction,
integrated action exposure, reserve debit, and later outcome remain separate
coordinates for the same reason ([C-1494](../research/claims.md#c-1494)).

The evaluator reports endpoint vectors rather than a hidden scalar:

$$
\mathbf q_t=
\left(\mathbf b_t,\mathbf h_t,\mathbf r_t,
E_t,L_t,M_t,H_t\right),
$$

where $\mathbf b_t$ is task benefit, $\mathbf h_t$ is protected harm,
$\mathbf r_t$ is remaining reserve, $E_t$ is lifecycle energy in joules,
$L_t$ is latency in seconds, $M_t$ is moved/stored information in bytes, and
$H_t$ is human effort in person-seconds. Unlike coordinates are never added
without a declared decision rule and weights.

## Qualified authority region

An intervention is admissible only inside a versioned region

$$
\mathcal D_t=
\mathcal A_v(\hat e_t,\hat x_t,\hat z_t,
\mathbf b_t,\mathbf h_t,\mathbf r_t,
u_t,\tau_t,p_t),
\qquad d_t\in\mathcal D_t,
$$

where $u_t$ is the complete uncertainty record, $\tau_t$ is observation age in
seconds, and $p_t$ identifies the supported population/task/context. Calling
$\mathcal D_t$ a “window” does not make it a fixed scalar interval. It changes
with endpoint, schedule, context, uncertainty, adaptation, reserve, and the
cost of delayed harm. A local rule must also be requalified when its trigger
becomes widespread and its shared-system cost changes
([C-1493](../research/claims.md#c-1493)).

## Withdrawal is its own transition

Removing support is not algebraic negation of adding support. Let
$\Delta d_t=d_t-d_{t-1}$. A reduction policy must satisfy

$$
d_t\in\mathcal D_t,
\qquad
\Delta d_t\in\mathcal R_v(\hat z_t,\mathbf r_t,u_t),
$$

where $\mathcal R_v$ is a rate-qualified removal set. After $d_t$ reaches zero,
evaluation continues for declared horizon $T_W$ seconds or task events:

$$
W_{0:T_W}=
\left(\Delta\mathbf b,\Delta\mathbf h,\Delta\mathbf r,
t_{\mathrm{rebound}},t_{\mathrm{recover}},E,M,H\right).
$$

This exposes dependence hidden by supported performance. A rollback is not
complete when the command disappears; it is complete only when rebound,
recurrence, native capability, reserve, and observation coverage meet their
declared postconditions.

## Interaction and schedule tests

For interventions $a$ and $b$, interaction is the residual against a named
reference $g_0$:

$$
I_{ab}=g(a,b)-g_0(a,b).
$$

$I_{ab}$ inherits the endpoint unit. Its sign can change with response scale,
schedule, context, and endpoint, so “synergy” without $g_0$ is undefined. The
test matrix must also compare schedules with equal cumulative command but
different peaks, spacing, duration, and recovery; matched totals do not imply
matched internal state.

## Falsification boundary

The contract adds nothing if a Bayesian state-space PK/PD analogue,
mixed-effects estimator, constrained MPC/POMDP, calibrated harm monitors, and
staged decommissioning/taper policy match its benefit–harm–reserve–cost
frontier. Universal hormesis, one-number therapeutic windows, dose-as-effect,
and absence-of-observed-harm claims fail before this comparison.

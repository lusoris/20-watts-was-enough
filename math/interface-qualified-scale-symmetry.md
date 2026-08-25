# Interface-qualified scale symmetry

<!-- markdownlint-disable MD013 -->

- **Purpose:** define and visualize full-trajectory fold-change detection,
  weaker lookalikes, observation-interface dependence, and the cost of
  preserving an absolute side channel
- **Claims:** [C-1540](../research/claims.md#c-1540)--[C-1549](../research/claims.md#c-1549)
- **Evidence audit:** [relative sensing and scale symmetry](../research/audits/2026-08-25-relative-sensing-scale-symmetry.md)
- **Experiment contract:** [Fixture F-026](../experiments/fixtures/026-interface-qualified-relative-sensing.md)
- **Result state:** analytical definitions and one illustrative exact model;
  no trained-model, biological, workstation or energy result

## Notation, units, and interfaces

| Symbol | Meaning | Unit |
| --- | --- | --- |
| $t$ | time | seconds (s) |
| $x(t)$ | internal state vector | model-declared |
| $u(t)$ | positive external input | model-declared input unit |
| $b$ | positive background input | same unit as $u$ |
| $p$ | positive multiplicative scale factor | dimensionless |
| $G$ | registered set of admissible scale factors | dimensionless set |
| $y(t)$ | output at one declared interface | model-declared |
| $r(t)$ | positive reference state | same unit as $u$ |
| $\tau_r$ | reference time constant | seconds (s) |
| $m$ | pulse fold multiplier | dimensionless |
| $D_{j,p}$ | normalized trajectory discrepancy | dimensionless |
| $s_{y,j}$ | frozen nonzero scale for output component $j$ | same unit as $y_j$ |

The observation chain is

$$
u_{\mathrm{external}}
\longrightarrow
u_{\mathrm{internal}}
\longrightarrow
y_{\mathrm{readout}}
\longrightarrow
a_{\mathrm{action}}.
$$

Scale symmetry at one arrow does not imply it at the next. The input, state,
readout, target and action must therefore be named independently.

## Exact full-trajectory definition

Consider a causal system

$$
\dot{x}=f(x,u),
\qquad
y=h(x,u),
$$

and let $x_{\mathrm{ss}}(b)$ be the initialized steady state associated with
positive background $b$. Exact FCD over scale support $G$ requires

$$
y\!\left(t; p u, x_{\mathrm{ss}}(pb)\right)
=
y\!\left(t; u, x_{\mathrm{ss}}(b)\right)
$$

for every registered input history, time, and $p\in G$. The equality is between
complete trajectories. Equality of a final value, peak, integral or selected
time point is insufficient.

Approximate FCD needs a frozen discrepancy, support, uncertainty model and
acceptance margin. It is not licensed by a visually attractive overlay.

## State-equivariance certificate

Assume the model has unique solutions on a declared forward-invariant positive
domain, and that $\rho_p$ maps that domain into itself for every $p\in G$.
Let $\rho_p$ transform internal state when the positive input is multiplied by
$p$. Under those conditions, a sufficient certificate is

$$
f\!\left(\rho_p(x),pu\right)
=
D\rho_p(x)f(x,u),
$$

$$
h\!\left(\rho_p(x),pu\right)
=
h(x,u),
$$

and

$$
\rho_p\!\left(x_{\mathrm{ss}}(b)\right)
=
x_{\mathrm{ss}}(pb).
$$

$D\rho_p(x)$ is the Jacobian of the state transformation. These equalities
belong to a defined model and observation map. Changing the output can change
both invariance and identifiability.

## Worked reference model

Use the positive-domain reference system

$$
\tau_r\dot r=u-r,
\qquad
y=\ln\frac{u}{r}.
$$

Under the transformation $(u,r)\mapsto(pu,pr)$, the state equation scales by
$p$ while the output remains

$$
\ln\frac{pu}{pr}=\ln\frac{u}{r}.
$$

If $r(0)=b$, then the transformed initial state is $pr(0)=pb$, so the entire
output trajectory is identical.

For a pulse that changes $u$ from $b$ to $mb$ at $t_0$ and returns to $b$ at
$t_1$, the reference during the pulse is

$$
r(t)
=
b\left[m-(m-1)e^{-(t-t_0)/\tau_r}\right],
\qquad t_0\le t<t_1,
$$

and the relative output is

$$
y(t)
=
\ln\frac{m}{m-(m-1)e^{-(t-t_0)/\tau_r}}.
$$

The background $b$ cancels. After the pulse, define

$$
q
=
(m-1)\left(1-e^{-(t_1-t_0)/\tau_r}\right).
$$

Then

$$
r(t)=b\left[1+q e^{-(t-t_1)/\tau_r}\right],
\qquad
y(t)=-\ln\left[1+q e^{-(t-t_1)/\tau_r}\right],
$$

which is again independent of $b$.

![Two geometrically scaled input/reference paths follow the same ratio contours and produce identical relative trajectories, while a separate absolute gate distinguishes them.](../public/plots/interface-qualified-scale-symmetry.svg)

The figure uses $b\in\{1,4\}$, $m=2$, $\tau_r=1.25\,\mathrm{s}$ and an
illustrative absolute gate at $u=6$ input units. The relative traces coincide
exactly in this model, but the $4\rightarrow8$ pulse crosses the gate while the
$1\rightarrow2$ pulse does not. The gate is a mathematical counter-task, not a
biological or safety threshold.

## Weaker lookalikes

### Exact adaptation

Exact adaptation constrains only the final output:

$$
\lim_{t\rightarrow\infty}y(t)=y_0.
$$

Two systems can share $y_0$ while their peak, latency, width and tail differ.

### Weber-like peak equality

Peak equality constrains a functional such as

$$
\max_t y_{pb}(t)=\max_t y_b(t),
$$

but does not constrain when the maximum occurs or the rest of the trajectory.

### Static normalization

A static value $u_t/r_t$ has no necessary causal rule for producing, aging,
validating or resetting $r_t$. Its output can look relative while its reference
uses future data or stale support.

### Additive difference and derivative

For positive $u$ and a frozen positive reference unit $u_*$ with the same input
unit,

$$
\ln\frac{u(t)}{u_*}-\ln\frac{b}{u_*}
=\ln\frac{u(t)}{b}
$$

is invariant to a common multiplicative scale. In contrast,
$u(t)-b$ is invariant to a common additive offset, and $du/dt$ responds to a
rate in input units per second. Limited step or ramp families can confound
these statistics.

## Approximate trajectory score

For output component $j$, held-out factor $p$, duration $T$ seconds and frozen
nonzero scale $s_{y,j}$, use

$$
D_{j,p}
=
\sqrt{
\frac{1}{T}
\int_0^T
\left\|
\frac{y_{j,p}(t)-y_{j,1}(t)}{s_{y,j}}
\right\|^2dt
}.
$$

The score is dimensionless. The scale $s_{y,j}$, integration grid, time
window, scale factors and uncertainty procedure must be frozen before
confirmation. Report peak, latency, duration and tail discrepancies separately
so a low integral error cannot hide one dangerous phase.

## Validity and failure boundaries

1. **Positive support.** Log ratio is undefined at zero and changes meaning
   across sign. A hidden epsilon is not a scientific solution.
2. **Saturation and clipping.** Multiplicative histories can become
   observationally identical for the wrong reason.
3. **Additive shift.** A ratio-qualified model need not transfer across added
   backgrounds.
4. **Reference age.** A stale or contaminated $r_t$ changes the statistic even
   when the current $u_t$ is valid.
5. **Initialization.** Comparing trajectories from unmatched states does not
   test the stated symmetry.
6. **Protocol support.** Steps alone do not certify pulses, ramps, stochastic
   histories or closed-loop action.
7. **Interface.** Relative encoding upstream can become absolute or
   difference-based downstream.
8. **Absolute target.** If the target depends on $u$ rather than $u/r$, a
   relative-only representation is insufficient by construction.

## Observation and recoverability

If an output is exactly invariant under a transformation, that transformed
quantity can be structurally unidentifiable from that output interface under
the declared initialized model. This is an observation-qualified statement,
not universal destruction of information. Recoverability can change when one
adds an output, fixes a parameter, changes initialization, or supplies a
calibrated absolute observation.

F-026 therefore reports three axes separately:

1. robustness to nuisance multiplicative scale;
2. recoverability of every protected absolute quantity; and
3. complete observation, state, compute and maintenance cost.

## Resource model

The authoritative report is a typed vector, not a sum of unlike units:

$$
\mathbf q=
\left(
L_{\mathrm{task}},
\mathbf r_{\mathrm{risk}},
N_{\mathrm{op}},
B_{\mathrm{comm}},
B_{\mathrm{state}},
T_{\mathrm{wall}},
E_{\mathrm{ws}},
N_{\mathrm{ref}}
\right).
$$

Here $L_{\mathrm{task}}$ retains its task-native unit;
$\mathbf r_{\mathrm{risk}}$ retains one registered unit per risk component;
$N_{\mathrm{op}}$ and $N_{\mathrm{ref}}$ are operation and reference-lifecycle
counts; $B_{\mathrm{comm}}$ and $B_{\mathrm{state}}$ are bytes;
$T_{\mathrm{wall}}$ is seconds; and measured workstation energy
$E_{\mathrm{ws}}$ is joules. None is inferred from another.

If a frozen decision rule genuinely needs a scalar diagnostic, every component
requires its own conversion weight into one declared decision unit:

$$
J=
\lambda_L L_{\mathrm{task}}
+\boldsymbol{\lambda}_r^{\mathsf T}\mathbf r_{\mathrm{risk}}
+\lambda_N N_{\mathrm{op}}
+\lambda_{Bc}B_{\mathrm{comm}}
+\lambda_{Bs}B_{\mathrm{state}}
+\lambda_TT_{\mathrm{wall}}
+\lambda_EE_{\mathrm{ws}}
+\lambda_U N_{\mathrm{ref}}.
$$

Reference updates, calibration, resets, selector execution, abstention,
fallback, writes and artifacts must appear in the appropriate count, byte and
time components. A biological FCD paper does not supply any of these AI
conversion weights.

## Test and retirement conditions

The relative translation remains viable only if it:

1. lowers held-out task loss or complete work against static, streaming,
   log-ratio, state-space and recurrent nulls;
2. preserves every absolute-critical counter-task or abstains before action;
3. survives non-step multiplicative histories inside declared support;
4. rejects additive, near-zero, saturated and stale-reference cases; and
5. retains its advantage after reference maintenance and fallback are charged.

Retire the translation if a simpler explicit transform or ordinary estimator
matches it, if full-trajectory invariance collapses to peak equality, or if a
calibrated absolute channel recreates the cost of keeping raw state everywhere.

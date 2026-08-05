# Measurement contracts, uncertainty, and invalidation

## Scope

This note defines the minimum mathematics needed to turn an indication into a
decision-bearing result. It connects the [metrology audit](../research/audits/2026-08-05-metrology-measurement-science.md),
[Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
and the [energy model](../concept/80-energy-model.md). It does not replace a
domain-specific measurement procedure.

## Result record

For one measured quantity, retain

$$
\mathcal M=(Y,\hat y,u_c,U,k,\mathcal Q,\mathcal P,\mathcal C,
\mathcal E,\mathcal S,\mathcal D,\mathcal V,t_0,t_1),
$$

where:

| Symbol | Meaning | Unit or declaration |
| --- | --- | --- |
| $Y$ | measurand: quantity intended to be measured | physical unit or named reference scale |
| $\hat y$ | value estimate attributed to $Y$ | same unit as $Y$ |
| $u_c$ | combined standard uncertainty | same unit as $Y$ |
| $U$ | expanded uncertainty | same unit as $Y$ |
| $k$ | coverage factor such that $U=ku_c$ | dimensionless |
| $\mathcal Q$ | object, population, component, state, location, and conditions | typed metadata |
| $\mathcal P$ | measurement procedure and model | versioned identifier |
| $\mathcal C$ | calibration chain, references, corrections, and validity scope | dependency record |
| $\mathcal E$ | environment and influence quantities | values with units |
| $\mathcal S$ | sampling, selection, missingness, and association contract | probability/model record |
| $\mathcal D$ | decision rule, tolerance, guard band, and risk allocation | versioned rule |
| $\mathcal V$ | data, software, instrument, certificate, and transformation provenance | dependency graph |
| $t_0,t_1$ | start and end of the supported interval | seconds on a named time basis |

The tuple is incomplete when a field that can alter the downstream decision is
missing. A confidence score alone cannot represent these distinct dependencies
([C-519](../research/claims.md#c-519)–[C-524](../research/claims.md#c-524)).

## Measurement model and dimensional validity

Let

$$
Y=f(X_1,\ldots,X_n),
$$

where input quantity $X_i$ has unit $[X_i]$ and $Y$ has unit $[Y]$.
Every additive term produced by $f$ must have unit $[Y]$. Software,
coefficients, numerical precision, and preprocessing that implement $f$ are
part of $\mathcal P$.

For estimates $x_i$, first-order covariance propagation gives

$$
u_c^2(\hat y)=
\sum_{i=1}^{n}\sum_{j=1}^{n}
c_i c_j u(x_i,x_j),
\qquad
c_i=\left.\frac{\partial f}{\partial X_i}\right|_{x_1,\ldots,x_n}.
$$

$c_i$ has unit $[Y]/[X_i]$ and covariance $u(x_i,x_j)$ has unit
$[X_i][X_j]$, so every summand has unit $[Y]^2$. Removing off-diagonal terms
asserts independence; it is not a harmless simplification when calibration,
clock, environment, preprocessing, prior, or training data are shared
([C-525](../research/claims.md#c-525),
[C-533](../research/claims.md#c-533)). For nonlinear or discontinuous models,
propagate sampled input distributions and report empirical interval coverage.

## Error, correction, and coverage

Given reference value $y_{\mathrm{ref}}$,

$$
e=\hat y-y_{\mathrm{ref}},
\qquad
c=-\hat e,
\qquad
\hat y_{\mathrm{corr}}=\hat y+c.
$$

Error $e$, correction $c$, and corrected estimate $\hat y_{\mathrm{corr}}$
have unit $[Y]$. The estimated correction remains uncertain. Expanded
uncertainty is

$$
U=k u_c,
$$

where $k$ is dimensionless. A stated $k$ does not by itself establish a
coverage probability; the distributional method and achieved coverage must be
reported ([C-524](../research/claims.md#c-524),
[C-526](../research/claims.md#c-526)).

## Repeatability and reproducibility

For replicate result $y_{lors}$ from location $l$, operator $o$, run $r$, and
system $s$, a variance-component null is

$$
y_{lors}=\mu+L_l+O_o+R_{r(lo)}+S_s+\epsilon_{lors}.
$$

$\mu$ and every random effect have unit $[Y]$; their variances have unit
$[Y]^2$. The design declares which factors are fixed or random and which are
confounded. A short run with one system estimates repeatability, not broad
reproducibility ([C-527](../research/claims.md#c-527),
[C-528](../research/claims.md#c-528)).

## Decision rules and guard bands

Let specification require $Y\le T$, where $T$ has unit $[Y]$. A simple guarded
acceptance rule is

$$
\text{accept if }\hat y+gU\le T,
$$

where guard multiplier $g\ge0$ is dimensionless. Increasing $g$ generally
reduces false acceptance while increasing false rejection. Choose $g$ from a
declared loss or risk allocation; do not hide that choice inside “confidence.”
The rule version, tolerance version, uncertainty method, and cost owner are
dependencies of the decision ([C-531](../research/claims.md#c-531)).

## Drift and recalibration

Represent indication drift relative to the last accepted calibration as

$$
d(t)=y_{\mathrm{check}}(t)-y_{\mathrm{ref}}(t),
$$

where $d$, check-standard result $y_{\mathrm{check}}$, and reference value
$y_{\mathrm{ref}}$ share unit $[Y]$. The review policy is a function

$$
\pi_{\mathrm{cal}}=
\pi(h_t,r_t,u_t,c_t,e_t),
$$

where $h_t$ is calibration/check history, $r_t$ is decision risk, $u_t$ is
current uncertainty, $c_t$ is calibration cost, and $e_t$ is equipment and
environment state. Inputs keep their native units; $\pi$ returns a categorical
action such as continue, check, restrict, recalibrate, or quarantine. A calendar
interval alone is not evidence of stability ([C-532](../research/claims.md#c-532)).

## Dependency invalidation

Let a directed acyclic graph $G=(V,E)$ contain calibration, raw-data, software,
model, transformation, result, and decision versions. Edge $(a,b)\in E$ means
that node $b$ depends on node $a$. If dependency $a$ changes or fails review,
its invalidation cone is

$$
\mathcal I(a)=\{v\in V: a\leadsto v\},
$$

where $a\leadsto v$ denotes a directed path and $\mathcal I(a)$ is a set of
version identifiers. Each affected node is re-evaluated, superseded, restricted,
or withdrawn; provenance alone does not decide which action is correct
([C-534](../research/claims.md#c-534),
[C-535](../research/claims.md#c-535)).

## Energy-measurement instantiation

For sampled power $P_m$ at time $t_m$ with interval $\Delta t_m$,

$$
\hat E=\sum_{m=1}^{M}P_m\Delta t_m,
$$

where $P_m$ is W, $\Delta t_m$ is s, and $\hat E$ is J. The model must name
the electrical boundary, voltage/current/phase calibration, bandwidth,
anti-aliasing, clock alignment, integration rule, missing-sample policy,
warm-up, idle allocation, retries, useful outputs, and facility attribution.
Uncertainty propagates through the integration model with shared meter,
coefficient, and clock covariance retained.

Compare candidate $C$ and baseline $B$ only after both satisfy the same
quality, risk, latency, and workload envelope. For paired run $r$,

$$
\Delta e_r=
\frac{E_{C,r}}{N_{q,C,r}}-
\frac{E_{B,r}}{N_{q,B,r}},
$$

where energies are J, $N_q$ is a qualified-event count, and $\Delta e_r$ is
J/qualified event. Report absolute values, paired effect, coverage, and all
failed or rejected runs. A software counter or narrow device boundary may rank
systems differently from calibrated end-to-end measurement; the direction is
an empirical question ([C-536](../research/claims.md#c-536)).

## Falsification conditions

Reject the cross-layer composition as a distinct systems contribution if:

1. a complete conventional metrology, statistics, and content-addressed
   provenance stack matches its coverage and stale-decision frontier;
2. it improves results only by receiving extra sensors, calibration runs,
   compute, storage, or analyst time;
3. dependencies are recorded but do not trigger correct downstream action;
4. uncertainty intervals become narrower while empirical coverage worsens;
5. shared dependencies are counted as independent evidence; or
6. the metadata and review burden costs more than the errors or work it avoids.

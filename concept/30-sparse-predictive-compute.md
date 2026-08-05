# Sparse activation, prediction, and adaptive compute

## Scope

Turn routing, prediction error, and confidence into a runtime policy that spends
more computation only when an event needs it.

## Biological observation

Spikes are costly, strong concurrent cortical activity is constrained, and
energy is allocated flexibly ([C-001](../research/claims.md#c-001)). Predictive
coding models explain selected cortical effects by passing residual errors
forward while feedback carries predictions
([C-005](../research/claims.md#c-005)).

Biological neurons are not “near-zero power” when silent, and predictive coding
is not an established complete theory of the brain. The engineering abstraction
is conditional update and residual-driven allocation.

## Proposed AI translation

Each event passes through four gates:

1. **change gate:** did relevant input state change beyond sensor noise?
2. **prediction gate:** is the current latent state predicted within calibrated
   uncertainty?
3. **routing gate:** which modules and memories can reduce the residual?
4. **exit gate:** is the answer or action sufficiently reliable to stop?

For predicted state $\hat{z}_t$ and observed state $z_t$, define normalized
surprise

$$
s_t=\frac{d(z_t,\hat{z}_t)}{\sigma_t+\epsilon},
$$

where $\sigma_t$ is predicted uncertainty and $\epsilon$ prevents division by
zero. Thresholds must be calibrated by risk class; surprise is not a universal
scalar objective.

Early exits expose intermediate predictions. An event exits at depth $k$ only
when its calibrated risk estimate satisfies the task-specific bound. Published
early-exit results establish the mechanism in narrower systems
([C-004](../research/claims.md#c-004)).

Two slower control paths remain candidates. First, a rate-limited context bus
may broadcast a few fast and slow variables that receivers decode with local
gains and temporal filters; the relevant biological observations are scoped in
[C-046](../research/claims.md#c-046)–[C-048](../research/claims.md#c-048), and
the mechanism must beat ordinary gates and control baselines in
[Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md).
Second, resource demand can be sensed near work and served by an adjacent
allocation layer ([C-049](../research/claims.md#c-049)–[C-051](../research/claims.md#c-051)).
Neither path is free or automatically stable.

## Efficiency mechanism

The active fraction of layer or module work is

$$
\rho(x)=\frac{\sum_j g_j(x)c_j(x)}{\sum_j c_j(x)},
\qquad 0\le\rho(x)\le1.
$$

The saving is real only if measured energy satisfies

$$
E_{\text{router}}+E_{\text{active}}+E_{\text{memory}}+E_{\text{network}}
< E_{\text{dense baseline}}
$$

at matched quality. Exact zero masks can skip equivalent arithmetic; approximate
prediction gates intentionally trade work for bounded error and are not
mathematically identical to dense execution.

## Evidence status

- Energy-constrained sparse cortical activity: established within
  [C-001](../research/claims.md#c-001).
- Predictive residual model: plausible broader translation under
  [C-005](../research/claims.md#c-005).
- Early exit: established in specific tasks under
  [C-004](../research/claims.md#c-004).
- Event-driven on-chip learning: feasible on a published substrate under
  [C-015](../research/claims.md#c-015), not proven superior for this project.
- Multirate broadcast and local physical resource allocation: biologically
  established observations, speculative AI translations under
  [C-046](../research/claims.md#c-046)–[C-051](../research/claims.md#c-051).

## Speculative extensions

- A budget controller that dynamically raises or lowers thresholds under an
  energy envelope while preserving hard safety floors.
- Local residual queues that wake modules asynchronously rather than advancing
  the whole network in lockstep.
- Learned escalation from a low-cost reflex path to deliberative modules and
  external tools.
- Bounded recovery probes that ask whether a seemingly healthy control loop is
  losing restoring margin, evaluated against conventional system identification
  in [Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md).

## Failure modes

- Overconfident early exits hide hard errors.
- Rare events appear predictable because the uncertainty model is poor.
- Gate evaluation and tensor dispatch cost more than the skipped work.
- Asynchronous execution reduces hardware utilization or increases latency
  variance.
- Predictability becomes a shortcut that ignores slow, important changes.
- A global context channel silently becomes a dense high-bandwidth router.
- Resource feedback oscillates, migrates state excessively, or starves a
  neighboring module.

## Measurable predictions

- Compute and energy correlate with calibrated difficulty rather than input
  length alone.
- Easy-event energy falls while hard-event accuracy and rare-event recall stay
  within declared bounds.
- Tail latency and calibration remain stable under distribution shift.
- Measured memory and interconnect energy fall with active FLOPs; otherwise the
  chosen sparsity granularity is rejected.

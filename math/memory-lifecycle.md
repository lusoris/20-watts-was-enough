# Budgeted memory lifecycle

## Purpose

Turn selective replay, consolidation, and forgetting into a costed decision
problem. This note specifies a testable controller; it does not claim that its
score is biologically implemented or optimal.

## Memory items and actions

At maintenance cycle $t$, the candidate memory set is $\mathcal{M}_t$. Each
item $i \in \mathcal{M}_t$ may receive one action

$$
a_{i,t} \in \mathcal{A}
= \{\text{defer},\text{replay},\text{merge},\text{externalize},
\text{weaken},\text{delete}\}.
$$

The action is versioned. `weaken` and `delete` are invalid unless an external
provenance record or explicit retention-policy exception exists.

## Expected utility

For item $i$ and action $a$, estimate

$$
G_{i,a,t}
= \widehat{\Delta L}_{i,a,t}
+ \lambda_R \widehat{\Delta R}_{i,a,t}
+ \lambda_S \widehat{\Delta S}_{i,a,t}
- \lambda_D \widehat{D}_{i,a,t},
$$

where:

- $\widehat{\Delta L}_{i,a,t}$ is the predicted reduction in future task loss
  relative to `defer` (dimensionless loss units);
- $\widehat{\Delta R}_{i,a,t}$ is the predicted reduction in a declared risk
  metric (risk units);
- $\widehat{\Delta S}_{i,a,t}$ is the predicted improvement in schema-consistent
  transfer (dimensionless score units);
- $\widehat{D}_{i,a,t}$ is predicted destructive-action harm, including rare
  memory loss and provenance failure (harm units);
- $\lambda_R$ has units loss/risk;
- $\lambda_S$ has units loss/score; and
- $\lambda_D$ has units loss/harm.

The terms cannot be added before the conversion coefficients and evaluation
sets are declared. Novelty, uncertainty, reward surprise, familiarity, and
interference are features used to estimate these outcomes, not interchangeable
units of utility.

## Resource model

For each candidate action, predict:

- $E_{i,a,t}$ — energy in joules;
- $B_{i,a,t}$ — data moved in bytes;
- $T_{i,a,t}$ — wall time in seconds; and
- $W_{i,a,t}$ — slow-model optimizer updates (count).

The scheduler selects binary variables $x_{i,a,t} \in \{0,1\}$:

$$
\max_x
\sum_{i \in \mathcal{M}_t}
\sum_{a \in \mathcal{A}}
x_{i,a,t}
\left(G_{i,a,t} - \lambda_E E_{i,a,t}\right)
$$

subject to

$$
\sum_a x_{i,a,t} = 1 \quad \forall i,
$$

$$
\sum_{i,a} x_{i,a,t}E_{i,a,t} \le E_t^{\max},
\qquad
\sum_{i,a} x_{i,a,t}B_{i,a,t} \le B_t^{\max},
$$

$$
\sum_{i,a} x_{i,a,t}T_{i,a,t} \le T_t^{\max},
\qquad
\sum_{i,a} x_{i,a,t}W_{i,a,t} \le W_t^{\max}.
$$

$\lambda_E$ has units loss/joule. The four budgets prevent a scheduler from
appearing efficient by hiding memory traffic, time, or optimizer work behind a
single energy proxy.

This is a multiple-choice multidimensional knapsack problem when predictions
are fixed. The first experiment need not solve it exactly; greedy, learned, and
standard replay priorities are compared under the same budgets.

The [illustrative single-item price envelope](visual-models.md#contextual-analytical-figures)
shows how the upper admissible action can change with $\lambda_E$. Its gains,
costs, and selected actions are hypothetical and are not a fitted policy.

## Reconsolidation gate

Retrieval produces a candidate branch rather than mutating the stored item in
place. Let $m_{i,t}$ be a calibrated mismatch statistic and $\theta_t$ a gate:

$$
z_{i,t} = \mathbb{1}[m_{i,t} > \theta_t].
$$

If $z_{i,t}=0$, the item remains read-only. If $z_{i,t}=1$, an update branch is
allowed but promotion still requires regression and provenance tests. Because
the exact biological prediction-error boundary is disputed under
[C-040](../research/claims.md#c-040), $\theta_t$ is an experimental variable,
not a biological constant.

Required ablations are:

1. always read-only;
2. always writable on retrieval;
3. fixed mismatch threshold;
4. calibrated risk-dependent threshold; and
5. explicit source-version change rather than inferred mismatch.

## Schema-fit gate

Let $s_{i,t}$ be schema-fit estimated on a held-out structural probe and
$q_{i,t}$ be shortcut risk. A candidate may receive a cheaper merge path only
when

$$
s_{i,t} \ge \tau_s
\quad \text{and} \quad
q_{i,t} \le \tau_q.
$$

The thresholds $\tau_s$ and $\tau_q$ are calibrated on validation streams with
both compatible items and deceptive near-matches. Training loss alone is not a
schema-fit measure.

## Measurement protocol

Report both realized and predicted quantities:

| Quantity | Unit | Boundary |
| --- | --- | --- |
| replay compute energy | J | accelerator or node, declared per run |
| memory traffic | byte | host–device and device memory reported separately |
| maintenance time | s | wall clock, including scheduler |
| optimizer work | update count | slow-model updates only |
| retention | task metric by item age | fixed evaluation stream |
| adaptation | events or seconds to threshold | after declared change point |
| obsolete intrusion | error count/rate | outdated association probes |
| destructive error | item count/rate | deleted state later shown necessary |
| provenance recovery | fraction | deleted items reconstructable from source |

Calibration error between predicted $G$ and realized outcome is itself a core
result. A scheduler that makes good-looking choices only after seeing future
tests is invalid.

## Falsification

The memory-lifecycle controller fails its first test if a conventional
single-priority or reservoir baseline matches its quality–risk–energy frontier,
if scheduling overhead consumes the saved replay budget, or if destructive
errors exceed the declared safety bound.

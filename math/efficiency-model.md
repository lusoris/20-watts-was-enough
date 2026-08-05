# First testable efficiency model

## Purpose

This model compares a conditional architecture with a dense baseline on the
same task. It deliberately does not attempt to turn brain activity into FLOPs.

## Per-event cost

For event $x$, let the dense baseline execute modules $1\ldots n$. Its measured
energy is

$$
E_D(x)=E_{D,\text{compute}}+E_{D,\text{memory}}
+E_{D,\text{network}}+E_{D,\text{host}}.
$$

For conditional gates $g_i(x)\in\{0,1\}$, the candidate uses

$$
E_C(x)=E_{\text{gate}}(x)
+\sum_{i=1}^{n} g_i(x)E_i(x)
+E_{C,\text{memory}}(x)
+E_{C,\text{network}}(x)
+E_{C,\text{host}}(x).
$$

The net event saving is

$$
S_E(x)=1-\frac{E_C(x)}{E_D(x)}.
$$

$S_E>0$ indicates lower measured energy. It is reported only for event strata
whose quality and risk remain inside the declared equivalence envelope.

## Lifecycle cost

Let $E_{\text{train}}$, $E_{\text{consolidate}}$, and $E_{\text{mature}}$ be
measured lifecycle phases. For $N$ qualified deployment events,

$$
E_{\text{life/event}}
=\frac{E_{\text{train}}+E_{\text{consolidate}}+E_{\text{mature}}}{N}
+\frac{1}{N}\sum_{j=1}^{N}E_C(x_j).
$$

Pruning or hardening is beneficial over the measured lifetime only when its
one-time cost is smaller than the accumulated deployment saving.

## Quality equivalence

Candidate $C$ is comparable to baseline $D$ only if

$$
Q_C \ge Q_D-\epsilon_Q,
\qquad
R_C \le R_D+\epsilon_R,
\qquad
L_{C,p95}\le L_{\max}.
$$

The tolerances are fixed before the experiment. Reporting only average quality
is insufficient when conditional compute can fail selectively on rare events.

## Brain counterfactual: unresolved

The dimensional form

$$
P_{\text{counterfactual}}
=P_{\text{brain}}
\frac{\eta_{\text{brain}}}{\eta_{\text{machine}}}
$$

is valid algebra only if both $\eta$ values measure the same functional output
under the same quality definition. Current “brain FLOP” estimates and
accelerator arithmetic do not meet that condition. Consequently claim
[C-016](../research/claims.md#c-016) remains disputed and no numerical range is
derived here.

## Initial hypotheses

- **H-E1:** conditional routing reduces device energy at matched quality only
  above a workload-dependent module granularity.
- **H-E2:** memory and interconnect savings, not arithmetic savings alone,
  determine whether sparse capacity wins end to end.
- **H-E3:** consolidation increases short-term energy but reduces amortized
  energy when it replaces frequent full-model updates.
- **H-E4:** structural pruning yields more portable energy savings than
  unstructured weight sparsity.

These hypotheses become claims only after experiments and ledger review.

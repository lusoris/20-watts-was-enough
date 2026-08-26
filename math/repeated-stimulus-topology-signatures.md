# One-sided topology signatures under repeated stimulation

<!-- markdownlint-disable MD013 -->

- **Purpose:** freeze the source-shaped equations, support gates, event rules,
  uncertainty treatment and endpoints for the `RSD-T02-PULSE` written protocol
- **Claim:** [C-1561](../research/claims.md#c-1561)
- **Primary source:** [Rahi et al. 2017](https://doi.org/10.1038/nmeth.4408),
  bibliography key [`rahi2017oscillatory`](../research/references.bib)
- **Evidence audit:** [repeated-stimulus pulse signatures](../research/audits/2026-08-26-rsd-t02-pulse-signatures.md)
- **Parent contract:** [intervention-qualified mechanism equivalence](interventional-mechanism-equivalence.md)
- **Experiment contract:** [Fixture F-026, RSD-T02-PULSE](../experiments/fixtures/026-interface-qualified-relative-sensing.md#rsd-t02-pulse--one-sided-repeated-stimulus-signatures)
- **Authority:** public-development written protocol; `NO_RESULT`, no runner,
  confirmation custody, workstation measurement or energy result

## Inference boundary

This subtrack asks whether a repeated-stimulus response is a valid one-sided
signature under a declared model and observation class. It does not infer a
universal graph name.

The scoreable plant property is

$$
q_{RI}=
\begin{cases}
1,&\text{the reported response causally drives its inhibitor},\\
0,&\text{the inhibitor is driven by the external input instead},\\
\mathrm{mixed},&\text{both paths are present},\\
\mathrm{unresolved},&\text{the allowed observations do not decide.}
\end{cases}
$$

Presence of a support-qualified stabilized refractory period or a
support-qualified subharmonic response can support $q_{RI}=1$ against the
registered pure feed-forward rival. Absence produces `unresolved`; it never
proves $q_{RI}=0$. A measurement dead time, an undersampled output, a mixed
motif or a model outside the source assumptions cannot inherit the diagnostic.

This is a companion stratum to `T02-MECH`. It does not alter the exact
matched-step five-recipe bank and does not pretend that the source-shaped pair
below has that bank's canonical step equality. `response_drives_inhibitor` is
a subtrack-local causal coordinate; it must not be silently merged into
`T02-MECH`'s `reported_output_feedback_edge` without a separate representation
map and intervention certificate.

## Source-shaped planted pair

Let $S_{d,T}(t)$ be a square pulse train in response units $\mathrm U$:

$$
S_{d,T}(t)
=
\begin{cases}
1\,\mathrm U,&0\le t-jT<d,\\
0\,\mathrm U,&d\le t-jT<T,
\end{cases}
\qquad j=0,1,2,\ldots
$$

where pulse duration $d$ and onset-to-onset period $T$ are both in seconds and
$0<d<T$. The response $R$ and inhibitor $I$ are in $\mathrm U$. With
$\tau_R=1\,\mathrm s$, the protected response-driven negative-feedback world
is

$$
\tau_R\dot R
=
\frac{S_{d,T}}
{1+(I/I_0)^n}
-R,
\qquad
\tau_R\dot I=R-\lambda I.
\tag{1}
$$

The paired input-driven incoherent feed-forward rival changes only the
inhibitor drive:

$$
\tau_R\dot R
=
\frac{S_{d,T}}
{1+(I/I_0)^n}
-R,
\qquad
\tau_R\dot I=S_{d,T}-\lambda I.
\tag{2}
$$

Both start at the $S=0$ equilibrium $(R,I)=(0,0)$. The reported scalar is

$$
O(t)=\left(\frac{R(t)}{1\,\mathrm U}\right)^3,
\tag{3}
$$

which is dimensionless. Equations (1) and (2) are the `NFL 1` and `IFFL 1`
forms studied by Rahi et al., with the hard threshold replaced by the Hill
form that their systematic exploration also used. The protected synthetic
parameter manifest is

$$
n=4,
\qquad
I_0=0.01\,\mathrm U,
\qquad
\lambda=0.3.
\tag{4}
$$

Those values lie on the source's enumerated parameter grid. Their behavior in
this fixture is a construction target, not a result imported from the paper.
Before any comparison run, a two-resolution construction certificate must
establish every truth label and support gate below. Failure invalidates the
world version; it does not permit threshold tuning after inspection.

Rahi et al. used a first-order downstream output node driven by powers of $R$
in this smooth-model exploration. At periodic steady state, its time average is
proportional to the time average of its drive. Equation (3) therefore retains
the same refractory argmax while event extraction remains on $R$ itself. This
is a fixture simplification, not a claim that the transient output nodes are
identical.

## Step adaptation and pulse support

For a step $S(t)=1\,\mathrm U\,\mathbf 1[t\ge0]$, let

$$
O_{\mathrm{pk}}=\max_{0\le t\le 200\,\mathrm s}O(t),
\qquad
\tau_a=\min\operatorname*{arg\,max}_{0\le t\le200\,\mathrm s}O(t),
$$

and let $O_{\mathrm{ss}}$ be the certified late-time value. The source-shaped
adaptation gate is

$$
A_{\mathrm{step}}
=
1-\frac{O_{\mathrm{ss}}}{O_{\mathrm{pk}}}
>0.80.
\tag{5}
$$

The refractory analysis may use only durations satisfying

$$
d\ge1.5\tau_a.
\tag{6}
$$

For each duration, an isolated pulse followed by a $100\,\mathrm s$ washout
defines the response-amplitude reference

$$
A_{\mathrm{iso}}(d)=\max_t R_d(t).
$$

The registered event threshold is the protocol convention

$$
\theta_R(d)=0.25A_{\mathrm{iso}}(d).
\tag{7}
$$

Thresholds $0.15A_{\mathrm{iso}}$ and $0.35A_{\mathrm{iso}}$ are sensitivity
diagnostics only. A pulse cell is in support only if all of the following hold:

1. Equation (5) passes and the off-state equilibrium is recovered before the
   first pulse, meaning
   $\max\{|R|,|I|\}/(1\,\mathrm U)\le10^{-8}$ after washout.
2. $A_{\mathrm{iso}}(d)$ exceeds five times its numerical error bound.
3. A single isolated pulse causes exactly one registered upward crossing of
   $\theta_R(d)$ before washout. Zero or multiple response cycles are outside
   the source-shaped single-response region.
4. The pulse edges are represented exactly by solver stops and the observation
   cadence resolves every threshold crossing with a latency error bound.
5. No saturation, clipping, censoring, output dead time, undocumented filter or
   future sample changes the event word.

The source's lower boundary - insufficient inhibitor accumulation - and upper
boundary - more than one response to one long pulse - are therefore explicit
support failures rather than favorable or unfavorable observations.

## Refractory-period stabilization

After convergence, define the cycle-averaged output over $K$ complete cycles:

$$
\overline O(d,T)
=
\frac{1}{KT}
\int_{t_b}^{t_b+KT}O(t;d,T)\,dt.
\tag{8}
$$

Use $K=20$ after the convergence time $t_b$. For fixed $d$, the refractory
period is

$$
T_{\max}(d)
\in
\operatorname*{arg\,max}_{T>d}\overline O(d,T).
\tag{9}
$$

If several periods are tied within the certified output error, retain the full
maximizer interval and report its largest member only as a descriptive value.
The decision must propagate the complete interval.

The protected stabilization panel is

$$
\mathcal D_{\mathrm{stab}}
=
\{0.30,0.50,1.00,1.50,2.00,3.00\}\,\mathrm s.
\tag{10}
$$

For each $d$, scan $T$ from $d+0.20\,\mathrm s$ through
$40.00\,\mathrm s$ at $0.20\,\mathrm s$ spacing, then refine the two coarse
neighbors around every tied maximum at $0.01\,\mathrm s$ spacing. This
response-dependent refinement rule is frozen before outputs and is applied to
every world.

Let $[T_d^-,T_d^+]$ be the error-qualified maximizer interval. For adjacent
durations $d_i<d_{i+1}$, the conservative secant-slope interval is

$$
M_i=
\left[
\frac{T_{d_{i+1}}^- - T_{d_i}^+}{d_{i+1}-d_i},
\frac{T_{d_{i+1}}^+ - T_{d_i}^-}{d_{i+1}-d_i}
\right].
\tag{11}
$$

Refractory stabilization is certified only if at least two consecutive
support-qualified intervals satisfy

$$
\sup M_i<\frac12.
\tag{12}
$$

The slope is dimensionless. A maximizer touching the $T$ boundary, an
unresolved maximizer interval, a duration violating (6), or a cell with more
than one response to one pulse makes stabilization `unresolved`.

## Response count and latency

For pulse $j$, let $N_j$ be the number of upward crossings of
$\theta_R(d)$ in $[jT,(j+1)T)$. Define

$$
b_j=\mathbf 1[N_j\ge1],
\qquad
N_{\mathrm{resp}}=\sum_{j=1}^{J}b_j,
\tag{13}
$$

where $N_{\mathrm{resp}}$ is a count and $J$ is the stimulus count. The first
crossing latency is

$$
L_j
=
\inf\{t-jT:R(t)\uparrow\theta_R(d),\ jT\le t<(j+1)T\},
\tag{14}
$$

in seconds. A missing event has no latency; it is not encoded as zero or $T$.
Report the observed $L_j$ values, missing-event count, event amplitude and all
$N_j$. A cell with any $N_j>1$ fails the single-response support gate.

## Period skipping

The protected skipping cells use

$$
d=0.20\,\mathrm s,
\qquad
T\in\{5.00,5.20,5.40\}\,\mathrm s.
\tag{15}
$$

These are synthetic protocol choices. For $q\in\{1,2,3,4,5\}$, compare the
complete state and output waveforms over one stimulus period after convergence:

$$
\Delta_q
=
\max_{0\le s<T}
\left|
x(t_b+s)-x(t_b+s-qT)
\right|_{\mathrm{scaled},\infty},
\qquad x=(R,I,O).
\tag{16}
$$

The scale is $1\,\mathrm U$ for $R$ and $I$ and one for $O$. Let $\eta_q$ be
the two-resolution bound for $\Delta_q$. Period skipping is certified only
when all of these conditions hold:

1. the smallest certified recurrence order $q_*$ is in $\{2,3,4,5\}$;
2. $\Delta_{q_*}+\eta_{q_*}\le10^{-10}$ while
   $\Delta_1-\eta_1>10^{-8}$;
3. the event word of length $q_*$ contains at least one response and at least
   one skipped pulse and repeats for four complete $q_*$ cycles;
4. every included pulse has $N_j\le1$; and
5. the direct plant output, not a censored or aliased observation, supplies the
   event word.

If no $q\le5$ converges before the time cap, the state is `unresolved`, not
`aperiodic NFL` and not `IFFL`. The largest consecutive zero run, $q_*$,
$N_{\mathrm{resp}}/J$, latency distribution and recurrence residuals are
secondary outputs.

## Null and counterworld bank

The versioned bank contains the following independent cases.

1. **`PS-NFL-H4`:** equations (1), (3) and (4). Its positive signature status
   must be established by a construction certificate before it enters any
   scored partition.
2. **`PS-IFFL-H4`:** equations (2), (3) and (4). It is the paired pure
   feed-forward rival. Any feedback assignment in this world is a false
   attribution.
3. **`PS-NFL-LTI`:** a signature-negative feedback control,

   $$
   \tau_R\dot r=S-r-i,
   \qquad
   \tau_I\dot i=r,
   \qquad
   (\tau_R,\tau_I)=(1,4)\,\mathrm s.
   $$

   This stable linear negative-feedback system adapts its signed response
   $r$ to zero but entrains to a periodic input. It checks that absence of the
   nonlinear signatures remains `unresolved` instead of being converted to an
   IFFL declaration.
4. **`PS-MIXED`:** the source's parallel slow-IFFL/fast-NFL counterworld. Use
   dimensionless states and normalized time
   $\widetilde t=t/(1\,\mathrm s)$:

   $$
   \frac{d I_1}{d\widetilde t}=S-\lambda_1I_1,
   \qquad
   \frac{d I_2}{d\widetilde t}=R-\lambda_2I_2,
   $$

   $$
   \frac{dR}{d\widetilde t}
   =
   \frac{S}{1+(I_2/I_0)^n}
   -(1+\kappa I_1)R,
   \qquad
   O=R^3,
   $$

   with $\lambda_1=1/200$, $\lambda_2=0.2$, $\kappa=0.01$, $n=1$ and
   $I_0=0.1$. Under the registered one-second normalization, evaluate
   $\overline O$ over windows ending at $50,150,250$ and $350\,\mathrm s$.
   A window-dependent signature reports
   `mixed/window-qualified`, never a single exclusive graph.
5. **`PS-DEADTIME`:** the direct plant is `PS-IFFL-H4`, but the observation
   layer suppresses reported events for $1.5T$ after every detected event.
   The resulting apparent skip pattern is a calibrated measurement-recovery
   artifact and must fail the observation support gate.
6. **`PS-ALIAS`:** the direct plant is `PS-IFFL-H4`, but the reported cadence
   is $\Delta t=T$ at a fixed phase. It cannot bound event count or latency and
   must fail temporal-resolution support.

The graph, equations, parameters, direct-versus-observed channel and
counterworld identity are evaluator-only. Actionable arms receive causal input,
reported output, timestamps, units, missingness and registered instrument
metadata. They do not receive the truth label or future samples.

## Numerical construction certificate

The future constructor must use binary64 integration with exact stops at pulse
edges. An adaptive Runge-Kutta reference run uses absolute tolerance
$10^{-12}\,\mathrm U$ for state variables and relative tolerance $10^{-10}$;
the refinement run halves both tolerances. The certificate retains maximum
state/output disagreement, quadrature disagreement, threshold-crossing time
disagreement and recurrence-residual disagreement.

Convergence is tested immediately before pulse onset. The state must recur to
fractional scaled error $10^{-10}$ for $q=1$ or the smallest $q\le5$, and the
same recurrence must persist for four additional cycles. Total simulated time
is capped at $20{,}000\,\mathrm s$ per cell. Nonconvergence, solver failure,
nonfinite state, negative concentration in a concentration-qualified world or
refinement disagreement produces `unresolved` or `malformed`; it is never
silently dropped.

No fixed numerical value in this note is an empirical biological tolerance.
Equations (7), (10), (15), the solver tolerances and the finite time cap are
synthetic protocol choices.

## Endpoints and decision

The primary outputs are separate:

1. `refractory_signature` in
   `{supported, absent, unresolved, out_of_support}` using (12);
2. `skipping_signature` in the same set using (16);
3. `feedback_support` in
   `{supported, unresolved, contradicted, out_of_support}`; and
4. false feedback attribution on `PS-IFFL-H4`, `PS-DEADTIME` and `PS-ALIAS`.

`feedback_support=supported` requires at least one positive signature, all of
its support gates, and a certified source-class rival. Two absent signatures
yield `unresolved`. `PS-NFL-LTI` is correct only when the method abstains.
`PS-MIXED` is correct only when the output retains the window qualification.

Report response count, stimulus count, seconds of latency, $T_{\max}$ in
seconds, dimensionless slope, recurrence order, recurrence residual, simulated
seconds, pulse cells, samples, bytes, solver evaluations, scalar operations,
retained-state bytes, wall seconds and later calibrated joules as separate
fields. No scalar efficiency score is registered.

## Kill rules

Kill a claim-eligible use of this subtrack if any of the following occurs:

1. one isolated pulse, graph identity or evaluator-only parameters supply the
   answer;
2. absent signatures are scored as evidence for feed-forward structure;
3. $d<1.5\tau_a$, insufficient adaptation or multiple responses per pulse are
   retained in the stabilization denominator;
4. a boundary maximum or unresolved maximizer interval is converted to a
   point estimate;
5. a dead-time or aliased observation is called plant feedback;
6. a mixed motif is forced into one exclusive topology;
7. event thresholds, duration cells, period cells or convergence order are
   changed after output inspection;
8. malformed/nonconverged cells are deleted; or
9. construction checks are presented as a comparison, biological prevalence,
   workstation or energy result.

## Disposition

This note completes the written mathematical specification missing from
C-1561. It does not complete the construction certificate, runner, actionable
estimator comparison, prospective confirmation partition or execution. The
only current authority is `public-development` and `NO_RESULT`.

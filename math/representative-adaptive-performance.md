# Representative adaptive-performance contract

This note formalizes [Fixture F-006](../experiments/fixtures/006-representative-adaptive-performance.md)
from the [sports expertise, adaptive performance, and team coordination
audit](../research/audits/2026-08-05-sports-expertise-team-coordination.md).
It supplies a comparison contract for [Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md),
[Candidate 004](../experiments/candidates/004-closed-endogenous-curriculum.md),
[Candidate 006](../experiments/candidates/006-reversible-physical-skill.md),
[Candidate 007](../experiments/candidates/007-endogenous-observation-surveillance.md),
[Candidate 009](../experiments/candidates/009-graded-assurance-envelopes.md),
[Candidate 012](../experiments/candidates/012-latency-qualified-authority.md),
[Candidate 014](../experiments/candidates/014-versioned-observation-contract.md),
and [Candidate 019](../experiments/candidates/019-audited-cumulative-inheritance.md).
It creates no new candidate.

## Versioned episode state

For agent $i$ in episode $e$, preserve

$$
\mathcal K_{i,e}=
(X_e,O_{i,e},A_{i,e},H_{i,e},M_e,F_{i,e},R_{i,e},D_{i,e},
G_{i,e},C_e,U_e,B_e),
$$

where:

- $X_e$ is the physical state, rules, task geometry, deadline, consequence,
  and hidden regime of episode $e$;
- $O_{i,e}$ is the information actually received by agent $i$, including
  source, support, latency in seconds, occlusion, noise, loss, and calibration;
- $A_{i,e}$ is the feasible action set under the current body, actuator,
  equipment, authority, rate, range, and safety constraints;
- $H_{i,e}$ is the timestamped acquisition and selection history: practice,
  feedback, opponents, teammates, injury or faults, prior exclusions, and
  opportunities that were offered or withheld;
- $M_e$ is the teammate and opponent roster, role assignment, policy history,
  turnover event, and communication topology;
- $F_{i,e}$ is the feedback channel, its delay in seconds, its information in
  bits, and the party choosing when it is supplied;
- $R_{i,e}$ is the resource and fatigue state, with each component stored in
  its native unit rather than collapsed into a readiness score;
- $D_{i,e}$ is the damage or fault state, diagnostic uncertainty, protected
  capability envelope, and current return stage;
- $G_{i,e}$ is the selection and opportunity policy that determines access to
  training, roles, observation, intervention, and later outcome measurement;
- $C_e$ is the randomized intervention, control, counterfactual pair, and
  stopping rule;
- $U_e$ is the sampling unit, such as action, possession, episode, agent,
  dyad, team, site, season, or cohort; and
- $B_e$ is the complete resource ceiling: events, bytes, seconds,
  person-hours, joules, damage, unsafe events, replacements, and opportunity.

The comparison estimand for method $m$ and literal outcome $k$ is

$$
Q_{m,k}(\mathcal K)=
\mathbb E\!\left[Y_k\mid do(m),\mathcal K\right],
$$

where $Y_k$ is measured in the registered unit for outcome $k$. A contrast
$Q_{m,k}-Q_{b,k}$ against baseline $b$ is uninterpretable when any element of
$\mathcal K$ differs without a registered intervention or adjustment.

## Outcome firewall

No scalar “performance” score may replace the following vector:

$$
\mathbf Y=
(Y^{\mathrm{ant}},Y^{\mathrm{int}},Y^{\mathrm{cue}},Y^{\mathrm{prac}},
Y^{\mathrm{ret}},Y^{\mathrm{tr}},Y^{\mathrm{exp}},Y^{\mathrm{adapt}},
Y^{\mathrm{pace}},Y^{\mathrm{ready}},Y^{\mathrm{return}},
Y^{\mathrm{team}},Y^{\mathrm{dec}},Y^{\mathrm{tal}},\mathbf C).
$$

The components and their units are:

| Symbol | Outcome | Required literal measurement and unit |
| --- | --- | --- |
| $Y^{\mathrm{ant}}$ | anticipation | proper predictive score in bits per event, calibration error dimensionless, commitment latency in milliseconds |
| $Y^{\mathrm{int}}$ | physical interception | success probability dimensionless, endpoint error in metres, movement onset in milliseconds, unsafe-event probability dimensionless |
| $Y^{\mathrm{cue}}$ | cue use | causal score change under a declared cue intervention, in bits per event or the registered task unit |
| $Y^{\mathrm{prac}}$ | practice performance | literal task quality by attempt number and exposure time in seconds |
| $Y^{\mathrm{ret}}$ | delayed retention | task quality after a delay $\Delta t_{\mathrm{ret}}$ in hours or days without the training scaffold |
| $Y^{\mathrm{tr}}$ | transfer | source-to-target task quality and gap in the literal task unit |
| $Y^{\mathrm{exp}}$ | exploration | action and outcome entropy in bits, action--outcome information in bits, coverage dimensionless, and later utility |
| $Y^{\mathrm{adapt}}$ | adaptability and recovery | perturbation loss, time to regain the envelope in seconds, overshoot, recurrence probability, and residual damage |
| $Y^{\mathrm{pace}}$ | pacing | power in watts or action intensity in its declared unit as a time series, plus terminal task quality |
| $Y^{\mathrm{ready}}$ | fatigue and readiness | task-specific capacity change, state-estimation error, calibrated admissibility, abstention, and recovery time |
| $Y^{\mathrm{return}}$ | staged return | false promotion, false withholding, stage dwell time in hours, recurrence, rollback, availability, and collateral loss |
| $Y^{\mathrm{team}}$ | coordination and shared information | team task quality, task-variable variance, compensation lag in seconds, belief log loss in bits per event, messages, bytes, cross-play, and repair latency |
| $Y^{\mathrm{dec}}$ | deception and opponent adaptation | opponent log loss in bits per action, calibration, exploitability, regret, abstention utility, and adaptation time |
| $Y^{\mathrm{tal}}$ | talent prediction | prospective calibration, false-negative recovery, later capability, attrition, opportunity received, and subgroup error |
| $\mathbf C$ | complete efficiency | events, bytes, wall-seconds, person-hours, joules, equipment, damage, unsafe events, replacements, and opportunity cost as separate axes |

## Representative distance is a vector

Let $P_{\mathrm{tr}}$ and $P_{\mathrm{te}}$ be the training and target
distributions. Register

$$
\mathbf d_{\mathrm{rep}}=
(d_O,d_A,d_T,d_M,d_F,d_R,d_D,d_G),
$$

where $d_O$ compares received information, $d_A$ feasible actions, $d_T$
deadline and consequence, $d_M$ teammate/opponent composition and policy,
$d_F$ feedback, $d_R$ resource state, $d_D$ damage/return state, and $d_G$
selection/opportunity policy. Each $d_z$ is a declared divergence between the
corresponding marginals or conditionals under $P_{\mathrm{tr}}$ and
$P_{\mathrm{te}}$. It is dimensionless for a statistical divergence and has
the registered ground-cost unit for optimal transport. No unreported weighted
sum is a valid “representativeness” score.

For source stratum $s$ and target stratum $t$, preserve the transfer matrix

$$
Q^{\mathrm{tr}}_{m,s\rightarrow t}
=\mathbb E[Y^{\mathrm{tr}}\mid do(m),s,t],
\qquad
G_{m,s\rightarrow t}
=Q^{\mathrm{tr}}_{m,s\rightarrow s}-Q^{\mathrm{tr}}_{m,s\rightarrow t},
$$

where both $Q^{\mathrm{tr}}$ and the transfer gap $G$ use the registered task
unit. Report $G$ separately by cue, feasible action, opponent, feedback,
resource, damage, and selection-policy changes.

## Anticipation, interception, and cue use

For $N$ independent events, outcome $y_n$, actual observation history
$o_{n,\le\tau}$ available by occlusion time $\tau$ in seconds, and predictive
distribution $p_m$, define

$$
L_m(\tau)=-\frac{1}{N}\sum_{n=1}^{N}
\log_2 p_m(y_n\mid o_{n,\le\tau}),
$$

where $L_m$ is log loss in bits per event. For information channel $c$, the
registered causal cue value is

$$
V_{m,c}(\tau)=L_{m,-c}(\tau)-L_{m,\mathrm{all}}(\tau),
$$

also in bits per event. Here $L_{m,-c}$ is measured under removal or
neutralization of channel $c$, not inferred from gaze or saliency. Predictive
regulation must additionally retain false-alarm action, reserve debit,
recovery, and cumulative exposure instead of treating cue value as the whole
outcome ([C-1494](../research/claims.md#c-1494)).

Physical coupling is reported separately as

$$
I_m=(p_{\mathrm{hit}},e_{\mathrm{end}},t_{\mathrm{move}},p_{\mathrm{unsafe}}),
$$

where $p_{\mathrm{hit}}$ is dimensionless interception success,
$e_{\mathrm{end}}$ is endpoint error in metres, $t_{\mathrm{move}}$ is movement
onset in milliseconds, and $p_{\mathrm{unsafe}}$ is dimensionless unsafe-event
probability. Label or joystick accuracy cannot substitute for $I_m$.

## Practice, retention, transfer, and exploration

Let $q_m(n,t)$ be literal task quality after attempt $n$ and exposure time $t$
in seconds. Keep three estimands:

$$
Q^{\mathrm{prac}}_m(n)=q_m(n,t_n),
\qquad
Q^{\mathrm{ret}}_m(\Delta t)=q_m(n_{\mathrm{last}},t_{\mathrm{last}}+\Delta t),
\qquad
Q^{\mathrm{tr}}_{m,s\rightarrow t}=q_m\text{ on target }t,
$$

where $\Delta t$ is the scaffold-free retention delay in hours or days. The
first target trial $Q^{\mathrm{tr},1}_{m,s\rightarrow t}$ is frozen before any
target update; later adaptation is a separate curve.

For action variable $A$ and reached-outcome variable $Z$, exploration is

$$
\mathcal X_m=
\left(H_m(A),H_m(Z),I_m(A;Z),K_m,Q^{\mathrm{tr}}_m,C_m\right),
$$

where both entropies and mutual information are in bits, $K_m$ is coverage of
the registered feasible region as a dimensionless fraction,
$Q^{\mathrm{tr}}_m$ is later transfer in its task unit, and $C_m$ is the
separate cost vector. Higher action entropy without outcome information or
later utility is not useful exploration.

After a perturbation at time $t_0$, define recovery time

$$
T^{\mathrm{rec}}_m=
\inf\left\{t-t_0:\ q_m(u)\in\mathcal A_q
\text{ for every }u\in[t,t+h]\right\},
$$

where $T^{\mathrm{rec}}_m$ and the stability horizon $h$ are in seconds,
$q_m(u)$ is task quality in its registered unit, and $\mathcal A_q$ is the
preregistered admissible quality envelope. Overshoot, recurrence, and damage
are additional axes rather than hidden inside $T^{\mathrm{rec}}_m$.

## Resource state, pacing, and readiness

Let external power $P(t)$ be in watts over event duration $T$ in seconds. The
external work is

$$
E_{\mathrm{ext}}=\int_0^T P(t)\,dt,
$$

where $E_{\mathrm{ext}}$ is in joules. Metabolic, device, facility, embodied,
and lifecycle energy use different boundaries and remain separate ledger rows.

A resource-qualified controller has the form

$$
a_t=\pi_m\!\left(o_{\le t},\widehat r_t,\widehat d_t,
s_t,\widehat\pi_{\mathrm{opp},t},\widehat b_{\mathrm{team},t},f_t\right),
$$

where $a_t$ is the commanded action or power target in its native unit,
$o_{\le t}$ is causally received observation history, $\widehat r_t$ is the
estimated resource/fatigue vector, $\widehat d_t$ is the estimated damage
state, $s_t$ is remaining work in metres, seconds, events, or joules,
$\widehat\pi_{\mathrm{opp},t}$ is the opponent-policy estimate,
$\widehat b_{\mathrm{team},t}$ is the teammate-state estimate, and $f_t$ is
available feedback. Each estimate and channel receives its own ablation.

Readiness is a calibrated action envelope rather than a score:

$$
\mathcal A^{\mathrm{ready}}_t(\alpha)=
\left\{a\in A_t:
\Pr(Z_{t:t+h}\in\mathcal Z_{\mathrm{safe}}\mid a,\mathcal I_t)
\ge 1-\alpha\right\},
$$

where $A_t$ is the feasible action set, $Z_{t:t+h}$ is the multidomain outcome
vector over horizon $h$ in hours, $\mathcal Z_{\mathrm{safe}}$ is the registered
safe envelope, $\mathcal I_t$ is information available at decision time, and
$\alpha$ is the dimensionless tolerated risk. Empty envelopes require
abstention or escalation.

## Staged and reversible return

Let $g_t\in\{0,1,2,3,4\}$ denote protected, modified, controlled, full-load,
and adversarial operation. Promotion is admissible only if

$$
g_{t+1}=g_t+1
\quad\text{and}\quad
\Pr(Z_{t:t+h}\in\mathcal A_{g_t+1}\mid\mathcal I_t)
\ge 1-\alpha_{g_t+1},
$$

where $\mathcal A_g$ is the multidomain admissible envelope for stage $g$,
$h$ is the follow-up horizon in hours or days, and $\alpha_g$ is its
dimensionless risk tolerance. If the current envelope is violated, the gate
must allow

$$
g_{t+1}<g_t.
$$

Report false promotion, false withholding, dwell time in hours, recurrence,
rollback count, availability, damage, and human adjudication hours separately.

## Team coordination and shared information

For task variable $z(t)$ and agent contribution $u_i(t)$, perturb agent $i$ by
$do(\eta_i)$ and estimate

$$
\Gamma_{ij}(\ell)=
\operatorname{Cov}\!\left(\Delta u_i(t),\Delta u_j(t+\ell)
\mid do(\eta_i),X_t\right),
$$

where $\ell$ is lag in seconds and $X_t$ is task state. Compensation requires
both a registered response in $\Gamma_{ij}$ and reduced task-variable error.
Here $u_i$ and $u_j$ are recorded in their native contribution units,
$\eta_i$ is a registered perturbation in the unit of agent $i$'s action or
state, and $\Gamma_{ij}$ has the product unit of the two contributions;
correlation or synchrony without intervention is insufficient. Common-drive
and edge-intervention controls are therefore mandatory before mapped synchrony
can be credited with useful coordination
([C-1495](../research/claims.md#c-1495)).

For teammate $j$'s future action or intent $b_{j,n}$ and agent $i$'s predictive
belief $p_i$, shared-information quality is

$$
L_{i\rightarrow j}=-\frac{1}{N}\sum_{n=1}^{N}
\log_2 p_i(b_{j,n}\mid h_{i,n}),
$$

where $L_{i\rightarrow j}$ is in bits per event, $h_{i,n}$ is information
actually available to $i$, and $N$ is the number of independent team events.
Report it under message ablation, teammate turnover, role reassignment, and
never-co-trained cross-play alongside messages, bytes, latency, repair, and
task quality.

## Deception and opponent adaptation

For opponent action $a^{\mathrm{opp}}_n$, available history $h_n$, and estimate
$\widehat\pi_m$, define

$$
L^{\mathrm{opp}}_m=-\frac{1}{N}\sum_{n=1}^{N}
\log_2\widehat\pi_m(a^{\mathrm{opp}}_n\mid h_n),
$$

in bits per opponent action. For matched genuine and deceptive interventions,

$$
\Delta^{\mathrm{dec}}_{m,k}=
Q_{m,k}\!\left(do(\mathrm{deceptive})\right)-
Q_{m,k}\!\left(do(\mathrm{genuine})\right),
$$

where $k$ names a literal outcome and the difference retains its unit. Report
calibration, confidence, exploitability, regret, abstention utility, and
adaptation time separately under known, held-out, changing, and colluding
opponents.

## Selection, opportunity, and prospective prediction

Let $S_i\in\{0,1\}$ denote selection, $Z_i$ preselection evidence,
$O^{+}_i$ postdecision opportunity in hours or task exposures, and
$Y^{\mathrm{future}}_i$ later capability in its task unit. The prospective
selection-policy estimand is

$$
\Delta^{\mathrm{sel}}(z)=
\mathbb E\!\left[Y^{\mathrm{future}}_i\mid do(S_i=1),Z_i=z\right]
-\mathbb E\!\left[Y^{\mathrm{future}}_i\mid do(S_i=0),Z_i=z\right].
$$

It cannot be estimated by comparing selected survivors with excluded agents
when selection changes $O^{+}_i$, coaching, opponents, follow-up, attrition, or
injury exposure. Report prospective calibration in new cohorts, selection and
opportunity rates, false-negative recovery, attrition, censoring, subgroup
error, later capability, and complete development cost.

## Complete efficiency and equal budgets

For method $m$, retain lifecycle energy

$$
E^{\mathrm{life}}_m=
E^{\mathrm{train}}_m+E^{\mathrm{infer}}_m+E^{\mathrm{sense}}_m+
E^{\mathrm{act}}_m+E^{\mathrm{comm}}_m+E^{\mathrm{facility}}_m+
E^{\mathrm{recover}}_m+E^{\mathrm{maint}}_m+E^{\mathrm{emb}}_m,
$$

where every $E$ term is in joules under one declared service interval. The
terms denote training, inference, sensing, actuation, communication, facility,
recovery, maintenance, and amortized embodied energy, respectively.

Human effort is

$$
H^{\mathrm{human}}_m=
H^{\mathrm{design}}_m+H^{\mathrm{coach}}_m+H^{\mathrm{demo}}_m+
H^{\mathrm{label}}_m+H^{\mathrm{tune}}_m+H^{\mathrm{monitor}}_m+
H^{\mathrm{repair}}_m+H^{\mathrm{medical}}_m,
$$

where each term is in person-hours and roles are reported separately. The
complete cost vector is

$$
\mathbf C_m=
(N_{\mathrm{event}},N_{\mathrm{step}},N_{\mathrm{query}},N_{\mathrm{byte}},
T_{\mathrm{wall}},H^{\mathrm{human}},E^{\mathrm{life}},N_{\mathrm{unsafe}},
D_{\mathrm{harm}},C_{\mathrm{opp}}),
$$

where the four $N$ terms count events, environment or optimization steps,
queries, and bytes; $T_{\mathrm{wall}}$ is wall time in seconds;
$H^{\mathrm{human}}$ is person-hours; $E^{\mathrm{life}}$ is joules;
$N_{\mathrm{unsafe}}$ counts unsafe events; $D_{\mathrm{harm}}$ is damage in a
registered physical or severity unit; and $C_{\mathrm{opp}}$ is withheld
opportunity in task exposures or person-hours.

Method $m$ is feasible only if

$$
\mathbf C_m\preceq\mathbf B,
$$

where $\mathbf B$ is the preregistered componentwise ceiling with the same
units. A complete efficiency claim requires non-inferiority on every protected
outcome and a Pareto improvement on at least one preregistered resource axis.
An over-budget run is infeasible, not a score to normalize afterward.

## Confirmatory contrast and retirement

Let $b^*(t)$ be the strongest mature baseline for track $t$, selected on
development data before confirmatory outcomes open. For protected outcome set
$\mathcal P_t$, retain a residual only when

$$
\Pr\!\left(
Q_{m,k}-Q_{b^*(t),k}>\delta_{t,k}
\text{ for every }k\in\mathcal P_t
\right)\ge 1-\alpha_t,
$$

where $\delta_{t,k}$ is the preregistered improvement or non-inferiority margin
in the unit of outcome $k$, and $\alpha_t$ is the dimensionless error budget.
The contrast must survive actual-channel, feasible-action, history,
opponent/team, feedback, resource, damage, selection, and complete-cost
ablations on held-out task, model, site, and hardware strata. Otherwise retire
the mechanism claim while preserving the measurement contract.

# Causal inference and adaptive experimentation: primary-source audit

- **Audit date:** 2026-08-05
- **Scope:** potential outcomes and graphical identification; randomized,
  sequential, and adaptive experiments; interference; mediation; instrumental
  variables; regression discontinuity; difference-in-differences; synthetic
  controls; negative controls; measurement error; missingness and censoring;
  selection and collider bias; transportability; multi-armed bandits; optional
  stopping; multiplicity; preregistration; registered reports; replication; and
  complete experimental human, energy, delay, and harm cost
- **Evidence rule:** audit-local `CAUSAL-` claims retain the estimand,
  assignment mechanism, identifying assumptions, sampling unit, observation
  process, stopping rule, and target population of the cited result. A method
  name is not an identification argument.
- **Promotion state:** candidate evidence only. This file promotes no stable
  `C-` claim, `P-` principle, candidate, or fixture.

## Executive finding

Causal inference contributes an **evaluation constitution**, not a new learning
primitive. Its durable instruction is to declare the intervention and causal
question before choosing an estimator; preserve the path from assignment to
exposure, measurement, selection, and analysis; and refuse to interpret an
association when the required intervention, counterfactual comparison, or
identifying assumptions are absent.

For this repository, the strongest reusable result is a **versioned estimand,
assignment, observation, and decision contract**:

1. freeze the unit, treatment versions, outcome, contrast, horizon, aggregation,
   intercurrent-event policy, target population, and harm/resource boundary;
2. record randomized assignment separately from treatment received, routing,
   co-interventions, interference exposure, missingness, censoring, and stopping;
3. register a causal graph or potential-outcome assumption set before outcome
   inspection and identify the estimand algebraically before fitting a model;
4. keep confirmatory outcomes, diagnostic outcomes, negative controls,
   mediators, harms, and exploratory probes in distinct namespaces;
5. preserve assignment probabilities and all adaptation decisions for
   sequential, response-adaptive, or bandit experiments;
6. report estimates with uncertainty, assumption and sensitivity results,
   multiplicity family, and every reason for abstention or invalidation; and
7. compare methods at equal total cost, including failed runs, tuning,
   instrumentation, human review, replication, waiting time, hardware energy,
   facility overhead, and harms incurred while learning.

Randomization identifies effects of assignment under its implemented design;
it does not repair outcome switching, treatment-version ambiguity,
noncompliance, interference, post-randomization selection, informative
censoring, or target-population mismatch. DAGs make assumptions inspectable;
they do not manufacture causal direction from an observational table.
Instrumental variables, regression discontinuity, difference-in-differences,
and synthetic controls identify different local or population quantities under
different untestable restrictions. Negative controls and sensitivity analyses
can expose incompatibility with a design; they do not certify the absence of
bias.

Adaptive experimentation creates a particularly important two-objective
problem. A bandit may lower cumulative regret for the units observed during the
experiment, while a randomized trial may estimate a prespecified contrast more
precisely or transparently. Allocation utility and inferential utility are not
interchangeable. Optional stopping and repeated looks require a design whose
error guarantees are valid at the stopping time; response-adaptive assignment
requires logged propensities, overlap, and analysis compatible with the actual
policy. No amount of adaptivity rescues an undefined estimand.

The complete mature null is therefore already substantial: factorial and
blocked randomization; cluster randomization under interference; intention-to-
treat and per-protocol estimands; sequential boundaries and confidence
sequences; causal DAG adjustment; inverse-probability, g-formula, doubly robust,
and randomization-based estimators; IV, RD, modern staggered DiD, and synthetic
controls; negative controls; missing-data and measurement-error models;
transport weighting; bandit and off-policy evaluation; multiplicity control;
preregistration, registered reports, reproducible pipelines, and independent
replication. The repository should beat this stack, not rename it.

No new principle survives deduplication. The most direct owner is
[Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md),
with operational consequences for Candidates 004, 007, 008, 009, 010, 011,
012, 019, and 020. A future causal-inference fixture is justified only after an
existing fixture cannot host the discrimination; this audit does not create one.

## Estimand and outcome firewall

The same dataset can answer incompatible questions. Each row below is a separate
registered object; one cannot silently replace another after results are known.

| Object | Literal question | Minimum retained state | Invalid substitution |
| --- | --- | --- | --- |
| assignment effect | what is the effect of being assigned policy $a$ rather than $a'$? | assignment rule, probability, unit, treatment versions, all assigned units | effect of treatment actually received |
| treatment-received effect | what is the effect of receiving exposure $d$ rather than $d'$? | assignment, uptake, adherence, co-interventions, confounders of receipt and outcome | intention-to-treat contrast |
| policy effect | what happens under a complete dynamic rule $g$? | decision history, available information, action support, time index, deviations | effect of one action token |
| direct effect | what changes through paths not mediated by declared $M$? | exposure, mediator timing, mediator--outcome confounders, intervention definition | coefficient of exposure after conditioning on $M$ |
| indirect effect | what changes through the declared mediator intervention? | mediator intervention or cross-world assumptions, temporal order, post-treatment confounders | mediator association with outcome |
| spillover effect | how does another unit's treatment or exposure alter this unit? | interference graph or exposure mapping, joint assignment, cluster membership | ordinary individual treatment effect |
| local IV effect | what is the effect among units whose receipt changes with instrument $Z$? | instrument assignment, first stage, exclusion, independence, monotonicity, compliance type | population average effect |
| RD effect | what is the treatment effect at cutoff $c$? | running variable, cutoff rule, bandwidth, manipulation checks, continuity assumptions | effect far from $c$ |
| DiD effect | what is the group/time-specific effect under a declared untreated trend counterfactual? | treatment cohort, calendar time, comparison set, pre-periods, anticipation rule | generic two-way fixed-effect coefficient |
| synthetic-control effect | how does one treated unit diverge from a donor-weighted counterfactual after treatment? | donor pool, weights, pre-fit, intervention timing, spillovers, placebo design | randomized population effect |
| retention effect | does a learned capability persist after a declared delay without training scaffolds? | delay in seconds or days, scaffolds removed, version, evaluation policy | end-of-training score |
| transfer effect | does a capability survive a declared target shift? | source and target distributions, support, adaptation budget | source-domain retention |
| safety effect | how does intervention change a prespecified adverse outcome? | severity, exposure time, ascertainment, censoring, competing events | absence of observed incident |
| energy effect | how many joules change for a fixed outcome contract and workload? | device power, utilization, duration, memory, PUE, retries, manufacture boundary | accelerator-hours or electricity cost |
| carbon effect | how many grams CO2e change under a declared location/time electricity mix and lifecycle boundary? | energy by interval, carbon intensity, hardware allocation, boundary | joules alone |
| human burden | how many person-hours and what task/harm distribution are required? | role, activity, duration, compensation, exposure, rework | payroll or headcount |
| cumulative experiment utility | what reward and harm accrue to units during learning? | per-unit outcomes, assignment policy, regret/harm weights, stopping | terminal model quality |
| deployment utility | what outcome follows after the selected policy is frozen or governed? | selected version, rollout population, monitoring and rollback | experiment-period reward |
| discovery status | is a result confirmatory, exploratory, diagnostic, replicated, or invalidated? | preregistration hash/time, deviations, family, independent reruns | thresholded $p$ value |

ICH E9(R1) treats the treatment condition, population, variable, intercurrent-
event strategy, and population-level summary as attributes of an estimand
([R03](#r03)). This audit generalizes that discipline to AI-system experiments:
model updates, fallback, early termination, rerouting, hardware failure, and
human override are intercurrent events and require a declared strategy.

## Formal state, symbols, and units

For unit $i$ and treatment assignment $A_i\in\mathcal A$, let $Y_i(a)$ denote
the potential outcome under intervention $a$. The finite-population average
treatment effect between $a$ and $a'$ is

$$
\tau_{a,a'}=\frac{1}{N}\sum_{i=1}^{N}\left(Y_i(a)-Y_i(a')\right).
$$

$\mathcal A$ is the declared set of treatment versions; $a$ and $a'$ are two
members of that set. $N$ is a count of experimental units; $Y_i(a)$ has the literal outcome unit
(for example accuracy points, seconds, joules, or incident count); and
$\tau_{a,a'}$ has the same unit. Because only one treatment version is realized
for a unit, $Y_i(a)$ and $Y_i(a')$ are not jointly observed for that unit
([R01](#r01)). Identification comes from the assignment design plus assumptions,
not from the notation.

The registered experiment state is

$$
\mathcal E=(U,A,D,Z,O,M,S,G,T,H,Q,\Pi,\Omega,\Delta),
$$

where:

- $U$ is the unit and clustering definition;
- $A$ is assigned intervention and its probability;
- $D$ is exposure actually received, including version and dose;
- $Z$ is the set of baseline covariates and any proposed instruments;
- $O$ is the observation operator, sensor version, latency, and error model;
- $M$ is the mediator and mechanism record;
- $S$ is selection, missingness, and censoring state;
- $G$ is the interference graph or exposure mapping;
- $T$ is the experiment and outcome time index in seconds, steps, or episodes;
- $H$ is treatment, adaptation, and system history;
- $Q$ is the outcome vector with literal units and aggregation rules;
- $\Pi$ is the assignment, adaptation, and stopping policy;
- $\Omega$ is the target population and transport contract; and
- $\Delta$ is the preregistered decision rule and multiplicity family.

In the formulas below, $X$ is the pre-treatment adjustment subset of $Z$ and
$H_t$ is the part of registered history $H$ available immediately before
decision $t$.

### Identification contract

For a binary treatment $A\in\{0,1\}$ and pre-treatment covariates $X$, the
observed-data adjustment formula

$$
\mathbb E[Y(1)-Y(0)]
=\int\left(\mathbb E[Y\mid A=1,X=x]-\mathbb E[Y\mid A=0,X=x]\right)dF_X(x)
$$

identifies the average effect only under consistency, conditional
exchangeability $Y(a)\perp A\mid X$, and positivity
$0<P(A=a\mid X=x)<1$ over the target support. $F_X$ is the target covariate
distribution; probabilities are dimensionless; $Y$ and the resulting contrast
share the outcome unit. A DAG can encode sufficient graphical restrictions and
expose collider paths ([R02](#r02), [R28](#r28)); it does not verify the causal
graph from the same observations.

### Assignment and sequential-decision contract

At decision time $t$, let $\pi_t(a\mid H_t)$ be the logged probability of
assigning action $a$ given observed history $H_t$. For bounded reward $R_t$ in
reward units, an inverse-propensity estimate for target policy $\pi^*$ is

$$
\widehat V(\pi^*)=\frac{1}{n}\sum_{t=1}^{n}
\frac{\pi^*(A_t\mid H_t)}{\pi_t(A_t\mid H_t)}R_t.
$$

$n$ is the number of decisions, $A_t$ is the realized action, and $\pi^*$ is
the target policy being evaluated. The probability ratio is dimensionless; and
$\widehat V$ has reward units per decision. This expression requires correct
logged propensities, a compatible history, and support wherever
$\pi^*(a\mid h)>0$. Large weights expose weak support rather than create it.
Bandit regret over $n$ decisions is

$$
\mathcal R_n=\sum_{t=1}^{n}\left(\mu_{a^*}-\mu_{A_t}\right),
$$

where $\mu_a$ is expected reward per decision under arm $a$, and $a^*$ is the
best arm in the declared stationary comparison class. $\mathcal R_n$ is in
cumulative reward units. A low-regret allocation is not automatically an
efficient estimator of $\tau$, especially when effects, contexts, or outcomes
change ([R31](#r31), [R32](#r32)).

For a confidence sequence $C_t$ for parameter $\theta$, time-uniform coverage
requires

$$
P\left(\forall t\ge 1:\theta\in C_t\right)\ge 1-\alpha,
$$

where $\alpha$ is a dimensionless error probability. This supports data-
dependent stopping under the theorem's assumptions; repeatedly applying a
fixed-horizon confidence interval does not ([R34](#r34)–[R36](#r36)).

### Interference contract

When units interact, write $Y_i(a_i,e_i)$, where $A_{-i}$ is the assignment
vector for units other than $i$ and $e_i=f_i(A_{-i},G)$ is unit $i$'s declared
exposure under registered mapping $f_i$ and graph $G$. A direct effect at
exposure $e$ is

$$
\tau^{\mathrm{dir}}(e)=\mathbb E\left[Y_i(1,e)-Y_i(0,e)\right],
$$

and a spillover contrast at own assignment $a$ is

$$
\tau^{\mathrm{spill}}(a;e,e')=
\mathbb E\left[Y_i(a,e)-Y_i(a,e')\right].
$$

Both contrasts use the outcome unit. They are undefined until the exposure
mapping, eligible neighbors, assignment support, and aggregation population are
specified ([R06](#r06), [R07](#r07)).

### Measurement, missingness, and censoring contract

Let the recorded quantity be $W=X+\varepsilon$, where $X$ and $W$ share a
physical unit and measurement error $\varepsilon$ has that unit. The audit must
retain calibration data or replicate measurements sufficient to characterize
$P(W\mid X)$; error in outcomes, treatments, running variables, confounders, and
selection indicators has different consequences. SIMEX and related corrections
add a model, not information, and must be sensitivity analyses when their error
model is uncertain ([R24](#r24)).

Let $R_i=1$ indicate an observed outcome. Inverse-probability weighting uses

$$
\widehat\mu_a=\frac{1}{N}\sum_{i=1}^{N}
\frac{\mathbf 1(A_i=a)R_iY_i}{P(A_i=a\mid X_i)P(R_i=1\mid A_i,X_i,H_i)}.
$$

$\mathbf 1(\cdot)$ is dimensionless; probabilities are dimensionless; and
$\widehat\mu_a$ has the outcome unit. The expression requires positive and
correctly modeled assignment and observation probabilities under the chosen
missingness assumptions ([R25](#r25), [R26](#r26)). Censoring time is measured
in seconds, episodes, days, or another declared time unit; Kaplan--Meier
estimation depends on noninformative censoring conditions and does not by itself
repair policy-induced dropout ([R27](#r27)).

### Complete resource and harm contract

For method $m$, total experimental energy is

$$
E_m^{\mathrm{total}}=
E_m^{\mathrm{train}}+E_m^{\mathrm{infer}}+E_m^{\mathrm{storage}}+
E_m^{\mathrm{network}}+E_m^{\mathrm{instrument}}+E_m^{\mathrm{failed}}+
E_m^{\mathrm{replicate}}+E_m^{\mathrm{embodied}},
$$

with every term in joules. Facility-adjusted information-technology energy over
intervals $k$ is

$$
E_m^{\mathrm{facility}}=\sum_k \mathrm{PUE}_k P_{m,k}\Delta t_k,
$$

where $P_{m,k}$ is measured average IT power in watts (joules per second),
$\Delta t_k$ is duration in seconds, and power usage effectiveness
$\mathrm{PUE}_k$ is dimensionless.
Operational emissions are

$$
C_m^{\mathrm{op}}=\sum_k E_{m,k}^{\mathrm{facility}}I_k,
$$

where $I_k$ is electricity carbon intensity in grams CO2e per joule and
$C_m^{\mathrm{op}}$ is grams CO2e. Location and time therefore belong to an
emissions claim ([R45](#r45)–[R48](#r48)).

The energy superscripts denote training, inference, storage, network transfer,
instrumentation, failed or abandoned work, independent replication, and the
allocated embodied-hardware share, respectively. Interval index $k$ partitions
time whenever power, PUE, or carbon intensity changes.

Human effort is not converted into accelerator joules. Report

$$
H_m^{\mathrm{human}}=\sum_r\sum_j n_{r,j}t_{r,j},
$$

where $n_{r,j}$ is the number of people in role $r$ performing activity $j$ and
$t_{r,j}$ is hours per person; $H_m^{\mathrm{human}}$ is person-hours. Record
design, implementation, data work, monitoring, adjudication, red-team exposure,
incident response, review, replication, and repair separately. Harm remains a
vector $K_m=(K_m^{\mathrm{safety}},K_m^{\mathrm{privacy}},
K_m^{\mathrm{labor}},K_m^{\mathrm{environment}},K_m^{\mathrm{opportunity}})$
with native units; a scalarization is allowed only with preregistered weights.

An equal-budget comparison enforces a common feasible envelope

$$
\mathcal B_m=(N_m,T_m,E_m^{\mathrm{total}},H_m^{\mathrm{human}},
W_m,M_m,K_m)\preceq\mathcal B_{\max},
$$

where $N_m$ is unit count, $T_m$ wall time in seconds, $W_m$ monetary cost in
the registered currency,
$M_m$ peak memory in bytes, and the remaining quantities are defined above.
$\preceq$ means componentwise compliance with the registered ceiling. Methods
report a Pareto frontier; they do not hide an exceeded dimension by
calling another dimension equal.

## Mature null stack

Before attributing value to a causal or adaptive mechanism, compare against the
complete relevant stack:

- complete, blocked, stratified, factorial, crossover, cluster, and stepped
  randomization with allocation concealment where applicable;
- intention-to-treat, assignment-policy, per-protocol, treatment-policy,
  hypothetical, composite, while-on-treatment, and principal-stratum estimands;
- randomization inference, robust standard errors, pre-treatment covariate
  adjustment, g-computation, inverse-probability weighting, augmented/doubly
  robust estimators, and targeted sensitivity analyses;
- preregistered DAG adjustment, unmeasured-confounding sensitivity analysis,
  negative-control exposures and outcomes, and blinded outcome adjudication;
- cluster randomization, graph cluster randomization, saturation designs, and
  explicit exposure mappings for interference;
- mediation analysis with temporally ordered mediators, defined mediator
  interventions, exposure-induced confounder handling, and sensitivity analysis;
- intention-to-treat IV, complier-average effects with instrument diagnostics,
  weak-instrument-robust inference, and explicit exclusion/monotonicity audits;
- local-linear RD with bandwidth and polynomial sensitivity, cutoff-density and
  covariate continuity checks, donut/placebo cutoffs, and fuzzy-RD compliance;
- group--time average treatment effects, cohort-specific event studies,
  anticipation checks, modern staggered DiD estimators, and bounded deviations
  from parallel trends;
- synthetic controls with declared donor pool, pre-period fit, predictor choice,
  in-space and in-time placebos, leave-one-out donors, and spillover checks;
- calibration, replicate measurement, validation subsets, regression
  calibration, SIMEX sensitivity, multiple imputation, inverse-censoring weights,
  pattern-mixture or selection-model sensitivity, and worst-case bounds;
- transport diagrams, sampling-score or outcome-model transport estimators,
  overlap diagnostics, target-population reweighting, and target-site replication;
- fixed-horizon trials, alpha-spending/group-sequential designs, sequential
  probability ratio tests, e-values or always-valid tests, confidence sequences,
  and simulation of operating characteristics under the exact stopping policy;
- Thompson sampling, UCB, contextual bandits, conservative exploration,
  randomized exploration floors, off-policy evaluation, and frozen-policy tests;
- familywise-error, false-discovery-rate, hierarchical, gatekeeping, and
  simultaneous-confidence procedures matched to the declared family;
- preregistration, analysis-plan versioning, registered reports, code and
  environment capture, immutable raw data, independent reruns, and direct or
  conceptual replication; and
- complete lifecycle accounting for searches, failed and excluded runs,
  evaluation, replication, monitoring, human work, energy, emissions, delay,
  and harms.

## Domain synthesis

### Potential outcomes and DAG identification

Potential outcomes force the intervention contrast to be stated at the unit and
population level ([R01](#r01)). Graphical models provide a compact language for
conditional independences, intervention queries, and adjustment criteria
([R02](#r02)). The frameworks are compatible but neither licenses causal
interpretation without consistency, treatment versions, exchangeability or
graphical separation, and positivity. Conditioning on every logged variable is
unsafe: a common effect of treatment and outcome can create an association when
conditioned upon ([R28](#r28)).

Randomization controls assignment, not every later process. The assignment
contrast remains identified under its design when outcomes are observed as
specified, but adherence, treatment switching, informative dropout,
interference, selective logging, or data-dependent exclusion can change the
question. Regression adjustment may improve precision but requires an estimator
and variance procedure justified for the randomization design; a convenient
outcome model is not implied by random assignment ([R05](#r05), [R56](#r56)).

### Interference and mediation

The no-interference simplification is often false for routers, expert mixtures,
shared caches, teams, markets, and online services. If one module's treatment
changes congestion, context, or training data for another, the unit-level
potential outcome depends on an assignment vector or exposure mapping. Direct,
indirect, total, and overall effects become different estimands
([R06](#r06), [R07](#r07)). Cluster assignment reduces some cross-arm contact
only when the cluster boundary matches the causal paths; cluster count, not
request count, constrains uncertainty for cluster-level assignment.

Mediation asks how an effect travels through a declared intermediate variable.
Natural direct and indirect effects require strong cross-world or equivalent
identification assumptions, including control of mediator--outcome confounding;
post-treatment common causes create additional difficulty
([R08](#r08), [R09](#r09)). Regressing outcome on treatment and mediator does
not, by itself, identify a path-specific effect. For this project, activation
sparsity, route entropy, memory traffic, latency, and energy may be mediators,
outcomes, or selection variables depending on the intervention. Their role must
be frozen before analysis.

### Quasi-experimental designs

An instrument changes treatment receipt and, under independence, exclusion,
first-stage relevance, and monotonicity, can identify a complier-average effect
rather than a population average effect ([R10](#r10)). A weak first stage can
make conventional estimates and confidence intervals unreliable
([R11](#r11), [R52](#r52)). Queue position, hardware availability, or random
feature exposure is not a valid instrument merely because it predicts routing;
it must have no prohibited path to the outcome.

RD identifies a local contrast around a cutoff when potential outcomes are
continuous in the running variable and units cannot precisely sort in a way that
breaks the design ([R12](#r12)–[R14](#r14)). A threshold router therefore cannot
be audited by RD when its score is manipulable, discretized, error-prone, or
directly changes other resources without those channels being part of the
treatment.

DiD replaces randomized assignment with a counterfactual trend restriction.
Staggered adoption and heterogeneous effects can make conventional two-way
fixed-effect coefficients combine inappropriate comparisons or create
contaminated event-study coefficients ([R16](#r16)–[R18](#r18)). Pre-treatment
plots are diagnostics, not proof of parallel counterfactual trends; sensitivity
to bounded deviations should be reported ([R19](#r19)). Synthetic controls make
the counterfactual construction visible through donor weights and pre-treatment
fit, but inference depends on a credible donor pool, no contamination, stable
relationships, and a limited number of treated units ([R20](#r20),
[R21](#r21), [R53](#r53)).

### Bias detection, observation, and transport

A negative-control outcome should not be causally affected by the treatment yet
should share relevant bias paths; a negative-control exposure should not cause
the outcome yet should share confounding or measurement structure. A detected
association is evidence against the design. A null association does not certify
validity if the control misses the actual bias path or is too noisy
([R22](#r22), [R23](#r23)).

Measurement error can attenuate, amplify, or otherwise distort an estimate
depending on which variable is measured with error and the model. Missing-at-
random is a conditional independence restriction, not a synonym for few missing
values ([R25](#r25)). Complete-case analysis is a selection procedure. Outcome-
dependent telemetry loss, crashed-run exclusion, early termination, and missing
human review can all be informative. Sensitivity analysis must vary the
unidentified observation process, not merely refit the same assumption.

Conditioning on a selection variable affected by treatment and outcome causes
collider bias; restricting analysis to successful, completed, accepted, or
surviving runs is therefore a causal operation ([R28](#r28)). Generalization
from an experiment to a deployment population further requires target support
and sufficient measurement of treatment-effect modifiers. Transport formulas
state which population differences are bridged; benchmark diversity alone does
not guarantee transportability ([R29](#r29), [R30](#r30)).

### Adaptive allocation, stopping, and multiplicity

Bandit algorithms optimize cumulative reward or regret under a declared reward
process; they do not automatically optimize power, calibration, harms, subgroup
precision, or post-selection deployment value ([R31](#r31), [R32](#r32)). The
experiment must preserve assignment probabilities and an exploration floor
compatible with the desired contrasts. If a harmful arm is curtailed, the
benefit is real but the resulting support and estimand change must be reported.

Repeatedly inspecting a fixed-horizon $p$ value and stopping after a favorable
look inflates false-positive risk. Group-sequential boundaries, alpha spending,
always-valid tests, or confidence sequences can support prespecified or data-
dependent stopping under their assumptions ([R34](#r34)–[R36](#r36),
[R59](#r59)). Adaptive-design guidance also requires prospective planning and
simulation of operating characteristics for complex rules ([R33](#r33)).

Multiplicity begins with the family definition. Familywise error controls the
probability of at least one false rejection in the family; false discovery rate
controls an expected proportion under the stated dependence conditions
([R37](#r37), [R38](#r38)). Neither rescues outcome switching, hidden subgroups,
optional stopping, or families declared after inspection. Sequential and
multiple-testing guarantees must hold jointly for the actual workflow.

### Preregistration, registered reports, and replication

Preregistration timestamps hypotheses, outcomes, exclusions, stopping,
multiplicity, and analysis choices before outcome inspection; it turns later
changes into visible deviations. It does not make a weak theory, invalid
measure, underpowered design, or incorrect analysis sound ([R39](#r39)).
Registered Reports move peer review and provisional publication commitment
before results, reducing outcome-contingent publication incentives
([R40](#r40)). Early comparative evidence on report quality is encouraging but
is observational and does not establish a universal causal effect of the format
([R41](#r41)).

Replication must state whether it targets the same implementation, same
estimand in a new sample, or a transported conceptual claim. Differences can
arise from sampling error, bias, treatment versions, context moderation, or
implementation failure. The Open Science Collaboration's 100-study project
found lower replication effect sizes and fewer conventionally significant
results in its sampled literature, but those numbers are not universal
constants for science ([R42](#r42)). A $p$ value neither measures effect size nor
practical importance ([R44](#r44)).

## Audit-local claim ledger

Statuses follow the project vocabulary. `Established` means the bounded claim
is supported by a theorem, design result, primary empirical study, or
authoritative standard under named assumptions. `Plausible` marks a reasoned
transfer to this repository that still needs direct testing. `Speculative`
marks a proposal without discriminating evidence. `Disputed` marks an active or
assumption-sensitive interpretation, not a vote count.

| ID | Status | Bounded claim | Primary or authoritative support | Architectural consequence |
| --- | --- | --- | --- | --- |
| CAUSAL-001 | established | A causal effect is a contrast between potential outcomes under specified treatment versions for a specified unit and population; both potential outcomes are not jointly observed for one unit. | [R01](#r01) | store intervention versions and contrasts, not a bare treatment label |
| CAUSAL-002 | established | Random assignment supplies a known assignment mechanism for assignment-effect inference; it does not define the outcome, treatment version, horizon, or target population. | [R01](#r01), [R04](#r04), [R03](#r03) | freeze the estimand before assignment |
| CAUSAL-003 | established | Intention-to-treat and treatment-received effects are different estimands when receipt differs from assignment. | [R03](#r03), [R10](#r10) | log assignment, receipt, adherence, and crossover separately |
| CAUSAL-004 | established | Regression adjustment in randomized experiments needs design-compatible estimation and uncertainty; randomization does not make an arbitrary regression model correct. | [R05](#r05), [R56](#r56) | keep a randomization-based null and report adjustment specification |
| CAUSAL-005 | established | Consistency and positivity are necessary parts of common observed-data identification formulas; positivity failures cannot be repaired by a flexible predictor. | [R01](#r01), [R55](#r55) | expose treatment-version ambiguity and support gaps as invalidity states |
| CAUSAL-006 | established | A causal DAG can encode conditional independence and intervention assumptions and derive adjustment expressions when identification follows. | [R02](#r02) | version the graph, variable meanings, and identification query |
| CAUSAL-007 | established | Conditioning on a collider or a descendant of selection can induce association and selection bias; coefficients of adjustment variables are not automatically their causal effects. | [R28](#r28), [R57](#r57) | prohibit automatic “control for every logged feature” analysis |
| CAUSAL-008 | established | Observational fit alone does not verify the causal graph assumed for identification. | [R02](#r02) | distinguish graph assumption, discovery proposal, and identified estimand |
| CAUSAL-009 | established | Under independence, exclusion, relevance, and monotonicity, binary IV identifies a complier-average causal effect, not necessarily the population average effect. | [R10](#r10) | label compliance population and never promote LATE to ATE silently |
| CAUSAL-010 | established | Weak instruments can make conventional IV point estimates and normal approximations unreliable. | [R11](#r11), [R52](#r52) | register first-stage and weak-IV-robust inference |
| CAUSAL-011 | established | Sharp RD identifies a local cutoff effect under continuity and assignment-rule assumptions. | [R12](#r12), [R13](#r13) | state the cutoff population and resist extrapolation |
| CAUSAL-012 | established | Sorting or manipulation around an RD cutoff can invalidate the local comparison; density and covariate diagnostics are informative but not exhaustive. | [R14](#r14) | treat threshold gaming and score error as design failures |
| CAUSAL-013 | established | DiD identification rests on a counterfactual untreated-trend restriction and treatment-timing/anticipation definitions. | [R15](#r15), [R18](#r18) | retain cohorts, calendar time, comparison set, and anticipation window |
| CAUSAL-014 | established | With staggered adoption and heterogeneous effects, conventional two-way fixed-effect DiD can combine comparisons with nontransparent or negative weights. | [R16](#r16) | use cohort/time-specific effects before aggregation |
| CAUSAL-015 | established | Conventional lead/lag event-study coefficients can be contaminated by treatment effects from other relative periods under heterogeneous effects. | [R17](#r17) | a visually flat pre-period is not a complete design audit |
| CAUSAL-016 | established | Sensitivity analysis can report how conclusions change under bounded deviations from parallel trends; it does not prove that the chosen bound is true. | [R19](#r19) | publish the bound and result frontier rather than one binary verdict |
| CAUSAL-017 | established | Synthetic control constructs a donor-weighted counterfactual whose credibility depends on donor support, pre-treatment fit, stable relationships, and lack of donor contamination. | [R20](#r20), [R21](#r21) | retain donor pool, weights, fit, and leave-one-out results |
| CAUSAL-018 | established | In-space and in-time placebos contextualize synthetic-control gaps but do not create randomized sampling when treatment assignment was not random. | [R21](#r21), [R53](#r53) | label placebo distribution as design-based diagnostic, not universal $p$ value |
| CAUSAL-019 | established | Under interference, potential outcomes depend on other units' assignments or exposures, so ordinary unit-level effects are insufficient. | [R06](#r06), [R07](#r07) | declare an exposure mapping and eligible interference graph |
| CAUSAL-020 | established | Cluster randomization changes the independent assignment unit; precision cannot be inferred from the number of lower-level requests alone. | [R06](#r06), [R49](#r49) | count clusters, cross-cluster paths, and within-cluster dependence |
| CAUSAL-021 | established | Partial or stratified interference is an assumption about which assignment vectors can affect which units; it is not implied by administrative grouping. | [R06](#r06), [R07](#r07) | perturb and audit claimed isolation boundaries |
| CAUSAL-022 | established | Natural direct and indirect effects require strong mediator intervention and confounding assumptions beyond temporal association. | [R08](#r08), [R09](#r09), [R51](#r51) | do not interpret an activation or energy coefficient as mechanism by default |
| CAUSAL-023 | established | Exposure-induced mediator--outcome confounding can defeat simple mediator adjustment. | [R08](#r08), [R09](#r09) | preserve post-treatment causal ordering and choose an identifiable mediation target |
| CAUSAL-024 | established | A valid negative-control outcome or exposure can reveal incompatibility with the assumed bias structure. | [R22](#r22), [R23](#r23) | add mechanism-matched negative controls to observational audits |
| CAUSAL-025 | established | A null negative-control result does not certify absence of confounding, selection, or measurement bias when the control does not share the relevant path or lacks power. | [R22](#r22), [R23](#r23) | record control relevance and detectable-effect range |
| CAUSAL-026 | established | Measurement error consequences depend on the error process and which causal variable is measured; “noise adds variance” is not a general correction. | [R24](#r24) | version sensors and propagate calibration uncertainty |
| CAUSAL-027 | established | SIMEX corrects under a specified measurement-error and extrapolation model; disagreement across plausible models is substantive uncertainty. | [R24](#r24) | use SIMEX as model-qualified sensitivity, not automatic truth recovery |
| CAUSAL-028 | established | Rubin's ignorability conditions for missing data require a missingness restriction and parameter distinctness, not merely a low missing-data fraction. | [R25](#r25) | missingness status and cause belong in the evidence record |
| CAUSAL-029 | established | Inverse-probability methods for incomplete data depend on positivity and correctly specified observation probabilities, with large weights exposing weak support. | [R26](#r26) | report weight distributions and truncation sensitivity |
| CAUSAL-030 | established | Kaplan--Meier estimation relies on conditions about censoring; policy-induced or prognosis-dependent censoring needs a different model or sensitivity analysis. | [R27](#r27) | crashes and stopped runs remain outcomes, not deletions |
| CAUSAL-031 | established | Complete-case, successful-run, and approved-output analyses condition on selection and can be biased when selection shares causes with treatment or outcome. | [R28](#r28) | include failed, abstained, vetoed, and unreviewed units in the flow record |
| CAUSAL-032 | established | Data missing not at random are not generally point-identified from observed data alone; conclusions require sensitivity parameters, bounds, or external information. | [R25](#r25), [R26](#r26) | publish an identified set or sensitivity curve when point identification fails |
| CAUSAL-033 | established | Transporting a trial effect requires a defined target population, overlap, and sufficient control of treatment-effect modifiers that differ across study and target populations. | [R29](#r29), [R30](#r30) | bind every generalization claim to target support and target data vintage |
| CAUSAL-034 | established | Similar average benchmark scores across sites do not establish transportability of treatment effects. | [R29](#r29), [R30](#r30) | test effect modification and target-site calibration explicitly |
| CAUSAL-035 | established | A bandit regret guarantee is tied to its reward, environment class, horizon, and comparator; it is not a generic causal-estimation guarantee. | [R31](#r31), [R32](#r32) | separate learning-period reward from inferential precision and deployment utility |
| CAUSAL-036 | established | Adaptive assignment changes exposure probabilities over time, so valid evaluation requires the realized policy, logged propensities, and support for the target contrast. | [R33](#r33), [R36](#r36) | make assignment logs append-only and analysis-compatible |
| CAUSAL-037 | established | Off-policy importance weights cannot evaluate actions that the behavior policy never takes in the relevant histories. | [R31](#r31), [R32](#r32) | maintain a randomized exploration floor for protected contrasts |
| CAUSAL-038 | disputed | Response-adaptive randomization necessarily benefits participants relative to fixed randomization. Benefits depend on delay, nonstationarity, outcome definition, inferential objective, and adaptation error. | [R33](#r33) | simulate participant reward, harm, power, bias, and duration jointly |
| CAUSAL-039 | established | Repeated fixed-horizon testing with data-dependent stopping can inflate Type I error. | [R34](#r34), [R36](#r36) | prohibit unlogged peeking and unregistered stopping |
| CAUSAL-040 | established | Group-sequential designs control errors through planned looks and boundaries under their model and design. | [R34](#r34), [R59](#r59) | precompute operating characteristics and log every look |
| CAUSAL-041 | established | Confidence sequences provide time-uniform coverage under their stated assumptions and therefore remain valid at compatible stopping times. | [R35](#r35) | use time-uniform intervals when the decision time is adaptive |
| CAUSAL-042 | established | Adaptive stopping, adaptive assignment, delayed outcomes, dependence, and nonstationarity are separate design dimensions; validity for one does not imply validity for the others. | [R33](#r33), [R35](#r35), [R36](#r36) | simulate the exact joint workflow rather than cite one sequential theorem |
| CAUSAL-043 | established | Familywise error and false discovery rate control different error objects. | [R37](#r37), [R38](#r38) | register the family and the error quantity that matters |
| CAUSAL-044 | established | The Benjamini--Hochberg procedure controls FDR under its stated dependence conditions; arbitrary dependence needs other guarantees or a qualified claim. | [R37](#r37), [R38](#r38) | do not apply one correction blindly across correlated probes |
| CAUSAL-045 | established | Multiplicity correction does not repair an outcome family or subgroup search declared after seeing results; valid sample-splitting or universal-inference constructions solve a narrower prespecified problem under their own conditions. | [R37](#r37), [R43](#r43), [R58](#r58) | version exploratory and confirmatory namespaces before unblinding |
| CAUSAL-046 | established | Preregistration makes timing and deviations inspectable but does not guarantee valid theory, measurement, execution, analysis, or reporting. | [R39](#r39) | preserve a preregistration hash plus explicit deviation ledger |
| CAUSAL-047 | established | Registered Reports move design review and provisional publication decisions before results are known. | [R40](#r40) | review expensive experiment contracts before spending the budget |
| CAUSAL-048 | plausible | The observed quality advantage of Registered Reports reflects at least partly the format rather than selection into the format. Existing comparisons are informative but not decisive. | [R41](#r41) | test internal prospective review by randomized or phased rollout if operationally important |
| CAUSAL-049 | established | Replication outcome depends on the target—same implementation, same estimand in a new sample, or transported conceptual claim. | [R42](#r42) | attach a replication type and admissible variation contract |
| CAUSAL-050 | established | A replication estimate outside an original interval can reflect sampling variation, bias, effect heterogeneity, treatment-version drift, or implementation error; one threshold does not distinguish them. | [R42](#r42), [R44](#r44) | require effect estimates, uncertainty, design comparison, and discrepancy diagnosis |
| CAUSAL-051 | established | The Open Science Collaboration's observed replication proportions and effect-size decline describe its sampled studies and protocols, not a universal constant for all fields. | [R42](#r42) | never use a field-wide scalar “replicability rate” as a prior without qualification |
| CAUSAL-052 | established | A $p$ value does not measure effect size, practical importance, or the probability that a hypothesis is true. | [R44](#r44) | decisions require effect, uncertainty, cost, and harm thresholds |
| CAUSAL-053 | established | Flexible stopping, outcome choice, exclusions, and covariate choices can raise false-positive rates when selected after outcome inspection. | [R43](#r43) | preserve all tried analyses and separate exploration from confirmation |
| CAUSAL-054 | established | Reporting only the final selected run conditions on a development process and hides selection multiplicity. | [R43](#r43), [R46](#r46) | account for search, failed runs, and tuning ancestry |
| CAUSAL-055 | established | Computational energy claims require measured or estimable hardware power, duration, utilization, memory, facility overhead, and location/time assumptions. | [R45](#r45), [R46](#r46) | keep joules and grams CO2e separate and expose PUE/intensity |
| CAUSAL-056 | established | Architecture, processor, datacenter, and electricity mix can materially change energy or carbon estimates, making retroactive constants unreliable. | [R47](#r47), [R48](#r48) | compare on the actual hardware and report configuration |
| CAUSAL-057 | plausible | Equal accelerator compute is not an equal experimental budget when instrumentation, storage, network, failures, replication, delay, and human work differ. | [R45](#r45)–[R48](#r48) | enforce a multidimensional budget envelope and Pareto comparison |
| CAUSAL-058 | plausible | Human monitoring and adjudication can be a binding resource and a treatment-dependent selection channel in adaptive AI experiments. | [R49](#r49), [R50](#r50) | measure person-hours, queues, disagreement, and unreviewed outcomes |
| CAUSAL-059 | established | Harms require explicit ascertainment and denominators; absence of a logged harm is not evidence of safety when observation differs by arm. | [R49](#r49), [R60](#r60) | predefine harm outcomes, exposure time, severity, and censoring |
| CAUSAL-060 | established | Early stopping can save units or energy but changes sample size, information, uncertainty, and sometimes the target population; all are part of the result. | [R33](#r33)–[R36](#r36) | report stopped and maximum-budget operating characteristics |
| CAUSAL-061 | established | A causal estimate remains conditional on untestable or externally justified assumptions even when its statistical uncertainty is small. | [R02](#r02), [R10](#r10), [R29](#r29), [R54](#r54) | separate sampling uncertainty from identification uncertainty |
| CAUSAL-062 | plausible | A versioned causal contract can catch silent estimand drift, collider adjustment, selection on completed runs, and invalid transport in this repository before expensive execution. | synthesis of [R02](#r02), [R03](#r03), [R28](#r28), [R29](#r29) | extend Candidate 014 evaluation rather than add a new primitive |
| CAUSAL-063 | speculative | Coupling the causal contract to automated lineage invalidation may improve research throughput without increasing false rejection beyond ordinary preregistration, CI, and provenance. | repo-specific proposal | test as an experiment factor; no architectural claim yet |
| CAUSAL-064 | established | No causal method, preregistration format, or replication count can identify an intervention whose versions, outcome, unit, or target population remain undefined. | [R01](#r01), [R03](#r03) | invalid estimands must terminate the analysis before model fitting |

## Negative findings and construct traps

1. **Prediction is not intervention.** A model can predict $Y$ from $X$ while
   the effect of changing $X$ is unidentified, zero, or opposite in sign.
2. **Feature importance is not a causal effect.** Permutation importance,
   saliency, attention, probes, and ablations answer different questions unless
   tied to a feasible intervention and stable treatment version.
3. **Randomization is not full validity.** It does not repair an undefined
   outcome, selective outcome observation, spillovers, post-randomization
   exclusions, or target mismatch.
4. **A DAG is not evidence by itself.** The graph records causal assumptions;
   decorative arrows do not identify direction or exclude latent common causes.
5. **Adjustment is not purification.** Conditioning on mediators, colliders,
   descendants of treatment, or error-prone proxies can add bias.
6. **A large sample is not positivity.** Millions of requests do not identify a
   contrast absent in a relevant subgroup or history.
7. **An instrument is not any predictor of treatment.** Relevance alone does not
   supply independence or exclusion; a queue or hardware lottery can affect
   latency and outcome directly.
8. **LATE is not ATE.** Compliers under one instrument need not represent the
   deployment population or compliers under another instrument.
9. **A cutoff jump is not automatically RD.** Sorting, rounded scores, sensor
   error, other policies at the same cutoff, and bandwidth choice can break the
   design.
10. **No significant pretrend is not proof of parallel trends.** Low power and
    contaminated event-study coefficients can hide or manufacture patterns.
11. **Two-way fixed effects is not generic DiD.** Staggered timing and effect
    heterogeneity alter the estimand.
12. **Synthetic resemblance is not randomization.** Good pre-fit can coexist
    with post-treatment donor contamination or structural divergence.
13. **A negative control is not a placebo ornament.** It must share the relevant
    bias path while lacking the target causal path.
14. **A null negative control is not clearance.** Low power or an irrelevant
    control can miss the actual bias.
15. **More sensors are not less measurement error.** Correlated calibration
    drift, shared preprocessing, or differential failure can make errors
    systematic.
16. **Missingness below a percentage is not ignorable.** A small selectively
    missing tail can dominate a rare-failure or safety claim.
17. **A crash is not a missing row.** It is an outcome plus a possibly censored
    downstream trajectory.
18. **Successful-run analysis is not efficiency evaluation.** It conditions on
    survival and hides failed energy, time, and harm.
19. **Benchmark variety is not transportability.** A target population and
    effect-modifier support are still required.
20. **Low regret is not causal certainty.** A bandit can exploit early noise,
    starve arms, and produce weak support for later contrasts.
21. **Adaptive is not automatically ethical or efficient.** Delayed outcomes,
    nonstationarity, false early winners, and switching costs can reverse the
    intended benefit.
22. **Peeking is not harmless monitoring.** Fixed-horizon intervals and tests do
    not acquire time-uniform validity through dashboards.
23. **FDR is not FWER.** Choosing the friendlier error definition after seeing
    discoveries invalidates the claim.
24. **Preregistered is not correct.** Registration reveals deviations; it does
    not validate constructs, code, assumptions, or data.
25. **Replication is not a binary stamp.** Same-code reruns, direct
    replications, and conceptual transport tests have different failure modes.
26. **A nonsignificant result is not equivalence.** Equivalence or
    noninferiority needs prespecified margins and appropriate inference.
27. **Energy is not carbon.** Joules, electricity cost, and CO2e require
    different conversions and boundaries.
28. **Equal compute is not equal burden.** Human review, data collection,
    storage, network, failed trials, waiting, harm, and replication remain.
29. **A final model is not the experimental denominator.** Every candidate,
    seed, tuning branch, discarded run, and reanalysis belongs to development
    cost and selection lineage.
30. **Statistical significance is not an architecture decision.** The decision
    must use effect magnitude, uncertainty, transport, safety, energy, human
    burden, reversibility, and opportunity cost.

## Equal-budget experiments tailored to this repository

All experiments share four rules:

1. publish the estimand and complete budget vector $\mathcal B_{\max}$ before
   assignment;
2. use the same eligible units, outcome-observation opportunity, maximum wall
   time, energy, memory, storage, network, human-review, and harm ceilings;
3. count search, calibration, failed runs, adaptation, monitoring, and
   replication against the method that incurred them; and
4. retain the causal-contract arm only when it changes an architecture decision
   or catches a planted/real failure without materially increasing false
   invalidation, cost, or delay.

### E-CAUSAL-01 — estimand-drift firewall

- **Owners:** [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md),
  with [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md).
- **Question:** does an executable estimand schema prevent analyses from
  switching between assignment, treatment-received, retention, transfer,
  safety, and energy outcomes after results are visible?
- **Design:** generate paired experiment packages containing treatment-version
  changes, altered horizons, hidden fallback, composite outcomes, post hoc
  exclusions, and harmless prose changes. Randomize reviewers and analysis
  agents to ordinary preregistration plus code review or the same stack plus
  typed estimand diff and dependency invalidation.
- **Primary outcomes:** true invalid-change detection, false invalidation,
  median review seconds, person-hours, joules, and accepted incorrect decisions.
- **Strong null:** immutable protocol, schema validation, ordinary Git diff,
  blinded statistician review, and CI tests.
- **Rejection rule:** reject the added contract if it does not reduce accepted
  estimand substitutions on withheld mutations at matched reviewer time and
  total energy, or if false invalidation exceeds the registered margin.

### E-CAUSAL-02 — collider and post-treatment adjustment trap

- **Owners:** Candidates [004](../../experiments/candidates/004-closed-endogenous-curriculum.md),
  [007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  and [014](../../experiments/candidates/014-versioned-observation-contract.md).
- **Question:** can the workflow reject attractive predictors that are
  colliders, mediators, or descendants of intervention rather than valid
  pre-treatment adjustment variables?
- **Design:** simulate and physically instantiate routing experiments with
  known DAGs, latent load, intervention-dependent logging, and measurement
  error. Compare fit-driven adjustment, expert DAG review, double selection,
  negative controls, and versioned graph plus algebraic identification.
- **Primary outcomes:** bias in outcome units, interval coverage, valid-effect
  detection, false graph rejection, graph-review person-hours, and energy.
- **Strong null:** preregistered DAGitty/do-calculus-style adjustment plus
  conventional sensitivity analysis and blinded review.
- **Rejection rule:** reject automation if the expert null matches bias and
  coverage or automation silently identifies any planted nonidentified query.

### E-CAUSAL-03 — interference-aware modular routing

- **Owners:** Candidates [001](../../experiments/candidates/001-adaptive-topology.md),
  [002](../../experiments/candidates/002-multiscale-context-broadcast.md),
  [008](../../experiments/candidates/008-contestable-modular-allocation.md), and
  [013](../../experiments/candidates/013-deficit-capability-routing.md).
- **Question:** do candidate routing changes improve treated requests directly,
  or merely shift queueing, cache, context, and energy costs to untreated
  modules or later requests?
- **Design:** compare request randomization, module-cluster randomization,
  randomized saturation, and graph-cluster assignment under controlled shared
  caches and queues. Register direct, spillover, total, and overall effects.
- **Primary outcomes:** literal task quality, direct and spillover latency in
  seconds, joules, tail failures, cross-cluster exposure, and interval coverage.
- **Strong null:** cluster-randomized design with prespecified exposure mapping,
  randomization inference, and cluster-robust uncertainty.
- **Rejection rule:** reject an individual-request causal claim when exposure
  mapping is wrong, cross-arm interference exceeds its bound, or gains disappear
  under overall-effect accounting.

### E-CAUSAL-04 — mechanism versus mediator correlation

- **Owners:** Candidates [002](../../experiments/candidates/002-multiscale-context-broadcast.md),
  [006](../../experiments/candidates/006-reversible-physical-skill.md),
  [010](../../experiments/candidates/010-reset-coupled-staged-verification.md), and
  [013](../../experiments/candidates/013-deficit-capability-routing.md).
- **Question:** are sparsity, route entropy, memory traffic, or latency actually
  mediating a quality/energy effect, or only correlated consequences?
- **Design:** factorially intervene on the candidate mechanism and the proposed
  mediator where feasible; otherwise compare interventional indirect effects,
  natural-effect sensitivity, and a no-mediation prediction. Plant
  exposure-induced mediator--outcome confounding in withheld regimes.
- **Primary outcomes:** total, direct, and indirect effects in native units;
  coverage; mediator intervention success; and added instrumentation cost.
- **Strong null:** factorial ablation plus ordinary path analysis and causal
  mediation sensitivity.
- **Rejection rule:** reject the mechanism claim when the mediator cannot be
  intervened upon or identified, when signs reverse under credible sensitivity,
  or when total effect persists without the proposed path.

### E-CAUSAL-05 — threshold authority RD audit

- **Owners:** Candidates [009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [010](../../experiments/candidates/010-reset-coupled-staged-verification.md), and
  [012](../../experiments/candidates/012-latency-qualified-authority.md).
- **Question:** what is the local causal effect of crossing a confidence,
  latency, integrity, or resource threshold on action quality and harm?
- **Design:** where the cutoff is externally fixed and not precisely
  manipulable, compare local-linear sharp/fuzzy RD with randomized tie-breaking
  in a narrow predeclared window. Add rounded scores, calibration drift,
  strategic score shaping, other cutoff policies, and sensor error as hostile
  regimes.
- **Primary outcomes:** cutoff-local quality, harm, abstention, latency, density
  continuity, covariate balance, bandwidth sensitivity, and extrapolation error.
- **Strong null:** narrow-window randomized experiment; otherwise local-linear
  RD with robust bias correction and cutoff diagnostics.
- **Rejection rule:** abstain when sorting, score error, coincident policies, or
  bandwidth sensitivity defeats the registered identification boundary.

### E-CAUSAL-06 — staggered deployment without forbidden comparisons

- **Owners:** Candidates [011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
  [014](../../experiments/candidates/014-versioned-observation-contract.md), and
  [019](../../experiments/candidates/019-audited-cumulative-inheritance.md).
- **Question:** does phased adoption reduce recurrence and resource cost across
  sites or cohorts when rollout timing and effects are heterogeneous?
- **Design:** randomize rollout timing where possible; otherwise preserve
  never-treated or not-yet-treated comparisons and estimate cohort--time effects.
  Compare conventional two-way fixed effects, Sun--Abraham, Callaway--Sant'Anna,
  randomization inference for randomized rollout, and HonestDiD sensitivity.
- **Primary outcomes:** cohort/time effect bias, simultaneous coverage,
  recurrence, quality, energy, anticipation, spillovers, and person-hours.
- **Strong null:** randomized stepped rollout with cohort-specific analysis.
- **Rejection rule:** reject any aggregate whose sign or decision changes under
  admissible cohort weighting or modest registered trend deviations.

### E-CAUSAL-07 — synthetic-control incident intervention

- **Owners:** Candidates [005](../../experiments/candidates/005-severity-ordered-containment.md),
  [011](../../experiments/candidates/011-dual-loop-operational-assurance.md), and
  [012](../../experiments/candidates/012-latency-qualified-authority.md).
- **Question:** when only one service or site receives an operational change,
  does a donor-weighted counterfactual support a bounded causal claim?
- **Design:** predeclare donor eligibility, predictor windows, weights, and
  intervention time. Inject known effects, donor contamination, shared shocks,
  pre-fit failures, and structural post-period drift. Compare synthetic control,
  synthetic DiD, interrupted time series, and no-effect prediction.
- **Primary outcomes:** effect error, pre-fit RMSPE, placebo rank, leave-one-out
  sensitivity, donor spillover, false attribution, compute, and analyst hours.
- **Strong null:** randomized switchback or matched concurrent control when
  available; otherwise classical synthetic-control diagnostics.
- **Rejection rule:** abstain on poor donor support, contamination, unstable
  leave-one-out conclusions, or placebo behavior inconsistent with the claim.

### E-CAUSAL-08 — observation failure, negative controls, and censoring

- **Owners:** Candidates [007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  [014](../../experiments/candidates/014-versioned-observation-contract.md), and
  [017](../../experiments/candidates/017-contract-preserving-semantic-compaction.md).
- **Question:** can the evidence pipeline detect when a candidate changes what
  gets logged, retained, reviewed, or censored rather than changing the plant?
- **Design:** cross intervention with telemetry version and retention policy;
  include negative-control outcomes upstream of the intervention and exposures
  sharing load/confounding but lacking the target path. Inject missing-at-random,
  outcome-dependent dropout, crash censoring, sensor drift, and compaction loss.
- **Primary outcomes:** bias, coverage, negative-control detection, observation-
  model calibration, crash inclusion, bytes, joules, and adjudication hours.
- **Strong null:** immutable raw log, calibration subset, multiple imputation,
  inverse-censoring weighting, pattern-mixture sensitivity, and ordinary
  negative controls.
- **Rejection rule:** reject recovery/efficiency claims when observation changes
  explain the effect or identified sets cross the decision threshold.

### E-CAUSAL-09 — transport across hardware, workloads, and operators

- **Owners:** Candidates [006](../../experiments/candidates/006-reversible-physical-skill.md),
  [012](../../experiments/candidates/012-latency-qualified-authority.md),
  [018](../../experiments/candidates/018-value-reconstructability-aware-tiering.md),
  and Fixtures [F-005](../../experiments/fixtures/005-regime-qualified-flow-inference-control.md),
  [F-007](../../experiments/fixtures/007-operator-qualified-optical-inference.md),
  [F-008](../../experiments/fixtures/008-mission-profile-qualified-device-reliability.md),
  and [F-009](../../experiments/fixtures/009-operator-qualified-active-acoustic-inference.md).
- **Question:** which effects transport across accelerators, memory systems,
  workload mixtures, sensors, sites, and human operators?
- **Design:** define source and target populations; measure candidate effect
  modifiers in both; compare source estimate, sampling-weight transport,
  outcome-model transport, doubly robust transport, and target-site randomized
  replication. Withhold target regimes with and without support.
- **Primary outcomes:** target effect error, coverage, effective sample size,
  maximum weights, abstention accuracy, target replication cost, and harms.
- **Strong null:** stratified multi-site randomized trial and target-specific
  calibration.
- **Rejection rule:** reject universal claims whenever target support is absent
  or target replication falls outside the registered transported uncertainty.

### E-CAUSAL-10 — fixed randomization versus adaptive allocation

- **Owners:** Candidates [004](../../experiments/candidates/004-closed-endogenous-curriculum.md),
  [008](../../experiments/candidates/008-contestable-modular-allocation.md), and
  [013](../../experiments/candidates/013-deficit-capability-routing.md).
- **Question:** does adaptive allocation improve cumulative unit outcomes
  without destroying precision, subgroup support, safety, or deployment choice?
- **Design:** compare equal-prior fixed randomization, Thompson sampling, UCB,
  conservative bandits, randomized exploration floors, and a dual-objective
  allocation optimizing registered reward plus information. Include delayed
  outcomes, drift, early false winners, switching cost, and rare harms.
- **Primary outcomes:** cumulative regret, cumulative harm, ATE/subgroup bias and
  coverage, minimum arm support, final-policy value, duration, joules, and review
  hours.
- **Strong null:** blocked fixed randomization plus prespecified sequential
  stopping and post-trial policy selection.
- **Rejection rule:** reject adaptive allocation when any reward gain is offset
  by the registered harm margin, invalid coverage, support loss, or worse
  frozen-policy value at equal total budget.

### E-CAUSAL-11 — optional stopping and multiple discovery families

- **Owners:** Candidates [003](../../experiments/candidates/003-recovery-dynamics-fragility.md),
  [004](../../experiments/candidates/004-closed-endogenous-curriculum.md),
  [009](../../experiments/candidates/009-graded-assurance-envelopes.md), and
  [010](../../experiments/candidates/010-reset-coupled-staged-verification.md).
- **Question:** can early decisions retain error guarantees across many metrics,
  thresholds, seeds, subgroups, and candidate branches?
- **Design:** compare dashboard peeking, fixed horizon, Pocock and O'Brien--
  Fleming group-sequential tests, confidence sequences, and always-valid tests;
  cross each with gatekeeping, FWER, BH/BY FDR, and no multiplicity control under
  independent, positively dependent, arbitrary dependent, delayed, and drifting
  outcomes.
- **Primary outcomes:** false-rejection probability, FDR, coverage at stopping,
  power, time to correct decision, joules, and number of outcome looks.
- **Strong null:** prespecified fixed-horizon family with simultaneous intervals
  and blinded monitoring.
- **Rejection rule:** reject any workflow that misses its declared joint error
  target under the exact stopping/assignment/dependence simulator.

### E-CAUSAL-12 — preregistration, internal Registered Report, and replication

- **Owners:** Candidates [009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
  [014](../../experiments/candidates/014-versioned-observation-contract.md), and
  [019](../../experiments/candidates/019-audited-cumulative-inheritance.md).
- **Question:** does pre-result design review plus independent replication
  improve decision correctness enough to justify its time and energy?
- **Design:** randomly assign matched candidate proposals to ordinary review,
  preregistration, preregistration plus internal Registered-Report review, or
  the same plus independent reproduction. Keep result visibility blinded during
  design assessment and score all later deviations.
- **Primary outcomes:** accepted false claims, rejected true effects, effect-
  size inflation, deviation count, independent replication agreement, calendar
  days, person-hours, joules, and opportunity cost.
- **Strong null:** ordinary code review, CI, immutable logs, and a post-result
  replication selected without knowledge of significance.
- **Rejection rule:** reject the heavier workflow if it does not improve
  preregistered decision loss at matched total cost, or if delay creates greater
  registered operational harm than the errors it prevents.

### E-CAUSAL-13 — complete-cost intervention comparison

- **Owners:** all candidates; primary accounting owner
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md)
  with [Candidate 018](../../experiments/candidates/018-value-reconstructability-aware-tiering.md).
- **Question:** does a reported efficiency gain survive complete development,
  measurement, selection, replication, human, facility, and harm accounting?
- **Design:** run a dense baseline and candidate through the same immutable
  experiment graph. Meter per-device power, memory, network, storage, PUE,
  failed branches, hyperparameter search, retained artifacts, human tasks,
  review queues, and independent rerun. Randomize evaluation order and blind
  quality adjudicators.
- **Primary outcomes:** task-quality vector, joules, grams CO2e, person-hours,
  wall seconds, bytes, monetary cost, harm vector, and Pareto dominance.
- **Strong null:** existing energy-reporting tools plus project accounting,
  W3C-style provenance, and ordinary lifecycle-cost review.
- **Rejection rule:** retract an efficiency claim when it depends on excluding
  failed/search/replication cost, moving a burden outside the boundary, changing
  quality or safety, or using a location-free carbon constant.

## Exact deduplication against the principle registry

The causal-inference discipline strengthens how principles are tested; it does
not add an abstract control loop beyond the current registry.

| Principle | Causal/experimental contribution | Disposition |
| --- | --- | --- |
| [`P-001` selective allocation](../principle-registry.md#p-001--selective-allocation) | randomized and adaptive assignment; propensity support; allocation versus inferential utility | existing principle; bandit allocation is a null, not a new principle |
| [`P-002` local resolution and escalation](../principle-registry.md#p-002--local-autonomy-with-exception-escalation) | sequential monitoring, local stopping, and prespecified escalation boundaries | existing principle; sequential analysis qualifies authority, not architecture |
| [`P-003` temporary trace before commitment](../principle-registry.md#p-003--temporary-trace-before-commitment) | exploratory evidence, immutable interim state, and delayed confirmatory commitment | existing principle; preregistration is a record contract |
| [`P-004` diversity, selection, and protection](../principle-registry.md#p-004--diversity-selection-and-protection) | multiple testing, selective reporting, bandit exploration, and replication of selected winners | existing principle; causal audit exposes selection cost |
| [`P-005` reinforce and decay topology](../principle-registry.md#p-005--use-dependent-topology) | graph interference, treatment-dependent topology, and post-selection evaluation | existing principle; no new topology mechanism |
| [`P-006` homeostatic negative feedback](../principle-registry.md#p-006--homeostatic-negative-feedback) | sequential error control, safety monitoring, and feedback-induced observation bias | existing principle; statistical feedback is a mature null |
| [`P-007` prediction-error allocation](../principle-registry.md#p-007--prediction-error-allocation) | active experimentation, value of information, uncertainty-directed sampling, and support floors | existing principle; bandits/active learning are direct baselines |
| [`P-008` modular containment](../principle-registry.md#p-008--compartmentalized-interaction) | cluster randomization and partial-interference boundaries | existing principle; administrative modules need causal boundary tests |
| [`P-009` maintenance plane](../principle-registry.md#p-009--maintenance-plane) | preregistration, monitoring, adjudication, invalidation, and replication | existing principle; evaluation governance belongs to maintenance |
| [`P-010` computation into structure](../principle-registry.md#p-010--structural-offloading-and-co-design) | compiled treatment versions and causal effects of structural placement | existing principle; physical embedding remains Candidate 006 territory |
| [`P-011` transient coalitions](../principle-registry.md#p-011--transient-communication-coalitions) | interference exposure, saturation, coalition assignment, and spillover estimands | existing watch principle; causal inference measures rather than creates coalitions |
| [`P-012` lifetime-matched memory](../principle-registry.md#p-012--memory-matched-to-information-lifetime) | outcome horizon, retention, censoring, data vintage, and replication lifetime | existing principle; time-indexed observation contract refines evaluation |
| [`P-013` externalized shared state](../principle-registry.md#p-013--externalized-shared-state) | preregistration, append-only assignment logs, DAGs, analysis plans, and result lineage | existing principle; the evidence ledger is shared state |

## Exact candidate routing

| Candidate | Causal-inference role and required null | Disposition |
| --- | --- | --- |
| [001 adaptive logical topology](../../experiments/candidates/001-adaptive-topology.md) | interference-aware graph/cluster assignment; account for migration exposure and spillovers | refine evaluation only |
| [002 multiscale context broadcast](../../experiments/candidates/002-multiscale-context-broadcast.md) | randomized receiver/rate interventions; direct and spillover effects; mediator audit | refine evaluation only |
| [003 recovery-dynamics fragility](../../experiments/candidates/003-recovery-dynamics-fragility.md) | probe assignment, sequential stopping, multiple thresholds, selection on recoverable runs | refine evaluation only |
| [004 closed endogenous curriculum](../../experiments/candidates/004-closed-endogenous-curriculum.md) | adaptive-treatment history, support floors, selection lineage, frozen-policy evaluation | refine evaluation only |
| [005 severity-ordered containment](../../experiments/candidates/005-severity-ordered-containment.md) | time-to-event, competing interventions, censoring, harms, synthetic control when randomized incidents are unavailable | refine evaluation only |
| [006 reversible physical skill](../../experiments/candidates/006-reversible-physical-skill.md) | hardware/site transport, treatment versions, IV exclusion traps, lifecycle energy mediation | refine evaluation only |
| [007 endogenous observation](../../experiments/candidates/007-endogenous-observation-surveillance.md) | direct owner of intervention-dependent telemetry, negative controls, missingness, and observation-policy effects | strong overlap; no new candidate |
| [008 contestable modular allocation](../../experiments/candidates/008-contestable-modular-allocation.md) | strategic interference, randomized audits, adaptive assignment propensities, selection/gaming outcomes | refine evaluation only |
| [009 graded assurance envelopes](../../experiments/candidates/009-graded-assurance-envelopes.md) | typed estimand/evidence states, multiplicity, confidence sequence, and invalidation thresholds | refine evaluation only |
| [010 reset-coupled staged verification](../../experiments/candidates/010-reset-coupled-staged-verification.md) | group-sequential/always-valid null, mediator audit, early-harm and stopping contract | mature sequential null directly competes |
| [011 dual-loop operational assurance](../../experiments/candidates/011-dual-loop-operational-assurance.md) | incident-selection bias, staggered rollout, recurrence censoring, and independent replication | refine evaluation only |
| [012 latency-qualified authority](../../experiments/candidates/012-latency-qualified-authority.md) | cutoff-local RD/randomized tie-break, time-varying treatment, safety estimands | refine evaluation only |
| [013 deficit--capability routing](../../experiments/candidates/013-deficit-capability-routing.md) | bandit/primal-dual nulls, interference, logged propensities, frozen target policy | mature adaptive-allocation null directly competes |
| [014 versioned observation contracts](../../experiments/candidates/014-versioned-observation-contract.md) | exact owner for estimand, graph, selection, observation, transport, analysis, and invalidation lineage | primary integration route |
| [015 versioned repairable conventions](../../experiments/candidates/015-versioned-repairable-conventions.md) | treatment-version consistency, uptake/adherence, cluster spillovers, message-meaning measurement | refine evaluation only |
| [016 conflict-bounded unit transition](../../experiments/candidates/016-conflict-bounded-unit-transition.md) | selection into higher-level units, interference, survival bias, and target-population definition | refine evaluation only |
| [017 semantic compaction](../../experiments/candidates/017-contract-preserving-semantic-compaction.md) | measurement loss, outcome reconstruction, missingness, and downstream invalidation under compaction | refine evaluation only |
| [018 value/reconstructability tiering](../../experiments/candidates/018-value-reconstructability-aware-tiering.md) | post-selection data availability, storage-energy boundary, target-query distribution | refine evaluation only |
| [019 audited cumulative inheritance](../../experiments/candidates/019-audited-cumulative-inheritance.md) | lineage selection, cohort/time effects, repeated testing, independent replication, survivorship | refine evaluation only |
| [020 constitutional control plane](../../experiments/candidates/020-constitutional-control-plane.md) | randomized governance changes where ethical, interference, mediator/authority paths, harms, transport | refine evaluation only |

## Exact fixture routing

| Fixture | Causal-inference stress added | Disposition |
| --- | --- | --- |
| [F-001 shared-clock-free co-adaptation](../../experiments/fixtures/001-shared-clock-free-coadaptation.md) | dyadic/coalitional interference, time-varying treatment, partner-history transport | add only when editing the fixture |
| [F-002 versioned reconstructive design](../../experiments/fixtures/002-versioned-reconstructive-design.md) | evaluator selection, outcome multiplicity, exposure-induced fixation mediators, provenance versus validity | add only when editing the fixture |
| [F-003 opportunity/history-qualified action](../../experiments/fixtures/003-opportunity-history-qualified-action.md) | treatment opportunity, compliance, acquisition-history confounding, target-population support | already aligned; no new fixture |
| [F-004 proof discovery/verification](../../experiments/fixtures/004-versioned-proof-discovery.md) | selected-proof denominator, optional stopping, multiplicity, independent checker as outcome operator | already aligned; no new fixture |
| [F-005 regime-qualified flow](../../experiments/fixtures/005-regime-qualified-flow-inference-control.md) | regime transport, adaptive sensing propensities, interference through control, censoring of unstable runs | add only when editing the fixture |
| [F-006 representative adaptive performance](../../experiments/fixtures/006-representative-adaptive-performance.md) | unit/history estimand, resource-state mediation, selection and transfer contract | already aligned; no new fixture |
| [F-007 operator-qualified optical inference](../../experiments/fixtures/007-operator-qualified-optical-inference.md) | measurement-error operator, calibration drift, null-space support, device transport | add only when editing the fixture |
| [F-008 mission-profile device reliability](../../experiments/fixtures/008-mission-profile-qualified-device-reliability.md) | survival/censoring, competing events, informative teardown, mission-profile transport | add only when editing the fixture |
| [F-009 active acoustic inference](../../experiments/fixtures/009-operator-qualified-active-acoustic-inference.md) | active-measurement policy, interference, missing echoes, environment transport | add only when editing the fixture |

## Promotion decision

- **New `P-` principle:** none. Experimental allocation, feedback, maintenance,
  shared records, selection, and timescale matching deduplicate into
  `P-001`–`P-013`.
- **New candidate:** none. The surviving system contract is owned most directly
  by Candidate 014; adaptive allocation and staged verification already have
  Candidates 013 and 010 plus mature conventional nulls.
- **New fixture:** none in this audit. The thirteen experiments above are
  proposed tracks. Promote a fixture only if the causal stress cannot be added
  to F-001–F-009 without changing that fixture's outcome contract.
- **Durable residue:** a versioned estimand/assignment/observation/decision
  contract, complete-cost denominator, and mandatory abstention when the causal
  query is undefined or unidentified.

## Open questions

1. Which causal queries are architecture decisions rather than diagnostics, and
   what smallest schema captures them without turning every run into a study?
2. Can a static DAG represent models that update other units' training data, or
   is a longitudinal structural causal model required for every candidate with
   shared replay?
3. What interference exposure mappings remain stable when routers change the
   graph they are supposed to evaluate?
4. How much randomized exploration is required to preserve protected subgroup
   effects under rare failures and delayed outcomes?
5. Can confidence sequences remain useful under the repository's expected
   heavy tails, nonstationarity, clustered requests, and adaptive assignment, or
   will conservative widths dominate the benefit?
6. Which safety outcomes require FWER, which discovery families can use FDR,
   and which should be treated as estimation without thresholded discovery?
7. How should experiment invalidation propagate when a sensor calibration,
   treatment version, DAG edge, target population, or carbon-intensity dataset
   changes?
8. Can negative controls be generated without sharing the target causal path
   while still sharing realistic load, logging, and selection paths?
9. What target-population data can be retained without making transport
   evaluation itself the dominant privacy, storage, and energy burden?
10. When a candidate alters throughput, what is the correct unit—request,
    session, user, module, service, site, or time block—and how does that choice
    alter interference and uncertainty?
11. How should human override and adjudication be randomized or instrumented
    without compromising safety or worker autonomy?
12. Can a preregistered decision rule express a Pareto outcome without hiding
    value judgments in scalar weights?
13. What replication portfolio best separates code reproducibility, stochastic
    robustness, hardware transport, workload transport, and causal replication?
14. When is partial identification more decision-useful than a point estimate
    from a fragile model, and how should an identified set map to architecture
    abstention?
15. How should embodied hardware energy and e-waste be allocated across
    experiments when utilization and useful lifetime are uncertain?
16. Does automated causal-contract validation prevent more costly errors than
    it creates through false invalidation and researcher time?

## Bibliography

Primary papers, formal methodological results, and authoritative guidance are
preferred. Reviews appear only where they delimit a method or summarize an
explicitly disputed interpretation.

### R01

Rubin, D. B. (1974). Estimating causal effects of treatments in randomized and
nonrandomized studies. *Journal of Educational Psychology*, 66(5), 688–701.
[DOI: 10.1037/h0037350](https://doi.org/10.1037/h0037350).

### R02

Pearl, J. (1995). Causal diagrams for empirical research. *Biometrika*, 82(4),
669–688. [DOI: 10.1093/biomet/82.4.669](https://doi.org/10.1093/biomet/82.4.669).

### R03

International Council for Harmonisation (2019/2021). *ICH E9(R1): Addendum on
Estimands and Sensitivity Analysis in Clinical Trials*.
[Authoritative FDA guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/e9r1-statistical-principles-clinical-trials-addendum-estimands-and-sensitivity-analysis-clinical).

### R04

Fisher, R. A. (1935). *The Design of Experiments*. Oliver and Boyd.
[Authoritative bibliographic record and scanned editions](https://openlibrary.org/works/OL43175747W/The_Design_Of_Experiments).

### R05

Freedman, D. A. (2008). On regression adjustments in experiments with several
treatments. *Annals of Applied Statistics*, 2(1), 176–196.
[DOI: 10.1214/07-AOAS143](https://doi.org/10.1214/07-AOAS143).

### R06

Hudgens, M. G., & Halloran, M. E. (2008). Toward causal inference with
interference. *Journal of the American Statistical Association*, 103(482),
832–842.
[DOI: 10.1198/016214508000000292](https://doi.org/10.1198/016214508000000292).

### R07

Aronow, P. M., & Samii, C. (2017). Estimating average causal effects under
general interference, with application to a social network experiment.
*Annals of Applied Statistics*, 11(4), 1912–1947.
[DOI: 10.1214/16-AOAS1005](https://doi.org/10.1214/16-AOAS1005).

### R08

Robins, J. M., & Greenland, S. (1992). Identifiability and exchangeability for
direct and indirect effects. *Epidemiology*, 3(2), 143–155.
[DOI: 10.1097/00001648-199203000-00013](https://doi.org/10.1097/00001648-199203000-00013).

### R09

Imai, K., Keele, L., & Tingley, D. (2010). A general approach to causal
mediation analysis. *Psychological Methods*, 15(4), 309–334.
[DOI: 10.1037/a0020761](https://doi.org/10.1037/a0020761).

### R10

Angrist, J. D., Imbens, G. W., & Rubin, D. B. (1996). Identification of causal
effects using instrumental variables. *Journal of the American Statistical
Association*, 91(434), 444–455.
[DOI: 10.1080/01621459.1996.10476902](https://doi.org/10.1080/01621459.1996.10476902).

### R11

Staiger, D., & Stock, J. H. (1997). Instrumental variables regression with weak
instruments. *Econometrica*, 65(3), 557–586.
[DOI: 10.2307/2171753](https://doi.org/10.2307/2171753).

### R12

Thistlethwaite, D. L., & Campbell, D. T. (1960). Regression-discontinuity
analysis: an alternative to the ex post facto experiment. *Journal of
Educational Psychology*, 51(6), 309–317.
[DOI: 10.1037/h0044319](https://doi.org/10.1037/h0044319).

### R13

Imbens, G. W., & Lemieux, T. (2008). Regression discontinuity designs: a guide
to practice. *Journal of Econometrics*, 142(2), 615–635.
[DOI: 10.1016/j.jeconom.2007.05.001](https://doi.org/10.1016/j.jeconom.2007.05.001).

### R14

McCrary, J. (2008). Manipulation of the running variable in the regression
discontinuity design: a density test. *Journal of Econometrics*, 142(2),
698–714.
[DOI: 10.1016/j.jeconom.2007.05.005](https://doi.org/10.1016/j.jeconom.2007.05.005).

### R15

Card, D., & Krueger, A. B. (1994). Minimum wages and employment: a case study
of the fast-food industry in New Jersey and Pennsylvania. *American Economic
Review*, 84(4), 772–793.
[DOI: 10.2307/2118030](https://doi.org/10.2307/2118030).

### R16

Goodman-Bacon, A. (2021). Difference-in-differences with variation in treatment
timing. *Journal of Econometrics*, 225(2), 254–277.
[DOI: 10.1016/j.jeconom.2021.03.014](https://doi.org/10.1016/j.jeconom.2021.03.014).

### R17

Sun, L., & Abraham, S. (2021). Estimating dynamic treatment effects in event
studies with heterogeneous treatment effects. *Journal of Econometrics*,
225(2), 175–199.
[DOI: 10.1016/j.jeconom.2020.09.006](https://doi.org/10.1016/j.jeconom.2020.09.006).

### R18

Callaway, B., & Sant'Anna, P. H. C. (2021). Difference-in-differences with
multiple time periods. *Journal of Econometrics*, 225(2), 200–230.
[DOI: 10.1016/j.jeconom.2020.12.001](https://doi.org/10.1016/j.jeconom.2020.12.001).

### R19

Rambachan, A., & Roth, J. (2023). A more credible approach to parallel trends.
*Review of Economic Studies*, 90(5), 2555–2591.
[DOI: 10.1093/restud/rdad018](https://doi.org/10.1093/restud/rdad018).

### R20

Abadie, A., & Gardeazabal, J. (2003). The economic costs of conflict: a case
study of the Basque Country. *American Economic Review*, 93(1), 113–132.
[DOI: 10.1257/000282803321455188](https://doi.org/10.1257/000282803321455188).

### R21

Abadie, A., Diamond, A., & Hainmueller, J. (2010). Synthetic control methods for
comparative case studies: estimating the effect of California's tobacco control
program. *Journal of the American Statistical Association*, 105(490), 493–505.
[DOI: 10.1198/jasa.2009.ap08746](https://doi.org/10.1198/jasa.2009.ap08746).

### R22

Lipsitch, M., Tchetgen Tchetgen, E., & Cohen, T. (2010). Negative controls: a
tool for detecting confounding and bias in observational studies.
*Epidemiology*, 21(3), 383–388.
[DOI: 10.1097/EDE.0b013e3181d61eeb](https://doi.org/10.1097/EDE.0b013e3181d61eeb).

### R23

Arnold, B. F., Ercumen, A., Benjamin-Chung, J., & Colford, J. M. Jr. (2016).
Negative controls to detect selection bias and measurement bias in
epidemiologic studies. *Epidemiology*, 27(5), 637–641.
[DOI: 10.1097/EDE.0000000000000504](https://doi.org/10.1097/EDE.0000000000000504).

### R24

Cook, J. R., & Stefanski, L. A. (1994). Simulation-extrapolation estimation in
parametric measurement error models. *Journal of the American Statistical
Association*, 89(428), 1314–1328.
[DOI: 10.1080/01621459.1994.10476871](https://doi.org/10.1080/01621459.1994.10476871).

### R25

Rubin, D. B. (1976). Inference and missing data. *Biometrika*, 63(3), 581–592.
[DOI: 10.1093/biomet/63.3.581](https://doi.org/10.1093/biomet/63.3.581).

### R26

Robins, J. M., Rotnitzky, A., & Zhao, L. P. (1994). Estimation of regression
coefficients when some regressors are not always observed. *Journal of the
American Statistical Association*, 89(427), 846–866.
[DOI: 10.1080/01621459.1994.10476818](https://doi.org/10.1080/01621459.1994.10476818).

### R27

Kaplan, E. L., & Meier, P. (1958). Nonparametric estimation from incomplete
observations. *Journal of the American Statistical Association*, 53(282),
457–481.
[DOI: 10.1080/01621459.1958.10501452](https://doi.org/10.1080/01621459.1958.10501452).

### R28

Hernán, M. A., Hernández-Díaz, S., & Robins, J. M. (2004). A structural
approach to selection bias. *Epidemiology*, 15(5), 615–625.
[DOI: 10.1097/01.ede.0000135174.63482.43](https://doi.org/10.1097/01.ede.0000135174.63482.43).

### R29

Pearl, J., & Bareinboim, E. (2014). External validity: from do-calculus to
transportability across populations. *Statistical Science*, 29(4), 579–595.
[DOI: 10.1214/14-STS486](https://doi.org/10.1214/14-STS486).

### R30

Dahabreh, I. J., Robertson, S. E., Steingrimsson, J. A., Stuart, E. A., &
Hernán, M. A. (2020). Extending inferences from a randomized trial to a new
target population. *Statistics in Medicine*, 39(14), 1999–2014.
[DOI: 10.1002/sim.8426](https://doi.org/10.1002/sim.8426).

### R31

Lai, T. L., & Robbins, H. (1985). Asymptotically efficient adaptive allocation
rules. *Advances in Applied Mathematics*, 6(1), 4–22.
[DOI: 10.1016/0196-8858(85)90002-8](https://doi.org/10.1016/0196-8858(85)90002-8).

### R32

Auer, P., Cesa-Bianchi, N., & Fischer, P. (2002). Finite-time analysis of the
multiarmed bandit problem. *Machine Learning*, 47, 235–256.
[DOI: 10.1023/A:1013689704352](https://doi.org/10.1023/A:1013689704352).

### R33

U.S. Food and Drug Administration (2019). *Adaptive Designs for Clinical Trials
of Drugs and Biologics: Guidance for Industry*.
[Authoritative guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/adaptive-design-clinical-trials-drugs-and-biologics-guidance-industry).

### R34

Pocock, S. J. (1977). Group sequential methods in the design and analysis of
clinical trials. *Biometrika*, 64(2), 191–199.
[DOI: 10.1093/biomet/64.2.191](https://doi.org/10.1093/biomet/64.2.191).

### R35

Howard, S. R., Ramdas, A., McAuliffe, J., & Sekhon, J. (2021). Time-uniform,
nonparametric, nonasymptotic confidence sequences. *Annals of Statistics*,
49(2), 1055–1080.
[DOI: 10.1214/20-AOS1991](https://doi.org/10.1214/20-AOS1991).

### R36

Johari, R., Pekelis, L., & Walsh, D. J. (2022). Always valid inference:
continuous monitoring of A/B tests. *Operations Research*, 70(3), 1806–1821.
[DOI: 10.1287/opre.2021.2135](https://doi.org/10.1287/opre.2021.2135);
[arXiv:1512.04922](https://arxiv.org/abs/1512.04922).

### R37

Benjamini, Y., & Hochberg, Y. (1995). Controlling the false discovery rate: a
practical and powerful approach to multiple testing. *Journal of the Royal
Statistical Society Series B*, 57(1), 289–300.
[DOI: 10.1111/j.2517-6161.1995.tb02031.x](https://doi.org/10.1111/j.2517-6161.1995.tb02031.x).

### R38

Benjamini, Y., & Yekutieli, D. (2001). The control of the false discovery rate
in multiple testing under dependency. *Annals of Statistics*, 29(4), 1165–1188.
[DOI: 10.1214/aos/1013699998](https://doi.org/10.1214/aos/1013699998).

### R39

Nosek, B. A., Ebersole, C. R., DeHaven, A. C., & Mellor, D. T. (2018). The
preregistration revolution. *Proceedings of the National Academy of Sciences*,
115(11), 2600–2606.
[DOI: 10.1073/pnas.1708274114](https://doi.org/10.1073/pnas.1708274114).

### R40

Chambers, C. D. (2013). Registered Reports: a new publishing initiative at
*Cortex*. *Cortex*, 49(3), 609–610.
[DOI: 10.1016/j.cortex.2012.12.016](https://doi.org/10.1016/j.cortex.2012.12.016).

### R41

Soderberg, C. K., Errington, T. M., Schiavone, S. R., et al. (2021). Initial
evidence of research quality of registered reports compared with the standard
publishing model. *Nature Human Behaviour*, 5, 990–997.
[DOI: 10.1038/s41562-021-01142-4](https://doi.org/10.1038/s41562-021-01142-4).

### R42

Open Science Collaboration (2015). Estimating the reproducibility of
psychological science. *Science*, 349(6251), aac4716.
[DOI: 10.1126/science.aac4716](https://doi.org/10.1126/science.aac4716).

### R43

Simmons, J. P., Nelson, L. D., & Simonsohn, U. (2011). False-positive
psychology: undisclosed flexibility in data collection and analysis allows
presenting anything as significant. *Psychological Science*, 22(11), 1359–1366.
[DOI: 10.1177/0956797611417632](https://doi.org/10.1177/0956797611417632).

### R44

Wasserstein, R. L., & Lazar, N. A. (2016). The ASA statement on p-values:
context, process, and purpose. *The American Statistician*, 70(2), 129–133.
[DOI: 10.1080/00031305.2016.1154108](https://doi.org/10.1080/00031305.2016.1154108).

### R45

Lannelongue, L., Grealey, J., & Inouye, M. (2021). Green Algorithms:
quantifying the carbon footprint of computation. *Advanced Science*, 8(12),
2100707. [DOI: 10.1002/advs.202100707](https://doi.org/10.1002/advs.202100707).

### R46

Henderson, P., Hu, J., Romoff, J., Brunskill, E., Jurafsky, D., & Pineau, J.
(2020). Towards the systematic reporting of the energy and carbon footprints of
machine learning. *Journal of Machine Learning Research*, 21(248), 1–43.
[arXiv:2002.05651](https://arxiv.org/abs/2002.05651).

### R47

Strubell, E., Ganesh, A., & McCallum, A. (2019). Energy and policy
considerations for deep learning in NLP. In *Proceedings of ACL 2019*,
3645–3650. [DOI: 10.18653/v1/P19-1355](https://doi.org/10.18653/v1/P19-1355);
[arXiv:1906.02243](https://arxiv.org/abs/1906.02243).

### R48

Patterson, D., Gonzalez, J., Le, Q., et al. (2021). Carbon emissions and large
neural network training. [arXiv:2104.10350](https://arxiv.org/abs/2104.10350).

### R49

Schulz, K. F., Altman, D. G., & Moher, D.; CONSORT Group (2010). CONSORT 2010
statement: updated guidelines for reporting parallel group randomised trials.
*BMJ*, 340, c332. [DOI: 10.1136/bmj.c332](https://doi.org/10.1136/bmj.c332).

### R50

Percie du Sert, N., Hurst, V., Ahluwalia, A., et al. (2020). The ARRIVE
guidelines 2.0: updated guidelines for reporting animal research. *PLOS
Biology*, 18(7), e3000410.
[DOI: 10.1371/journal.pbio.3000410](https://doi.org/10.1371/journal.pbio.3000410).

### R51

VanderWeele, T. J., & Vansteelandt, S. (2009). Conceptual issues concerning
mediation, interventions and composition. *Statistics and Its Interface*, 2(4),
457–468. [DOI: 10.4310/SII.2009.v2.n4.a7](https://doi.org/10.4310/SII.2009.v2.n4.a7).

### R52

Andrews, I., Stock, J. H., & Sun, L. (2019). Weak instruments in instrumental
variables regression: theory and practice. *Annual Review of Economics*, 11,
727–753.
[DOI: 10.1146/annurev-economics-080218-025643](https://doi.org/10.1146/annurev-economics-080218-025643).

### R53

Abadie, A., Diamond, A., & Hainmueller, J. (2015). Comparative politics and the
synthetic control method. *American Journal of Political Science*, 59(2),
495–510. [DOI: 10.1111/ajps.12116](https://doi.org/10.1111/ajps.12116).

### R54

Rosenbaum, P. R. (1987). Sensitivity analysis for certain permutation
inferences in matched observational studies. *Biometrika*, 74(1), 13–26.
[DOI: 10.1093/biomet/74.1.13](https://doi.org/10.1093/biomet/74.1.13).

### R55

Hernán, M. A., & Robins, J. M. (2016). Using big data to emulate a target trial
when a randomized trial is not available. *American Journal of Epidemiology*,
183(8), 758–764. [DOI: 10.1093/aje/kwv254](https://doi.org/10.1093/aje/kwv254).

### R56

Lin, W. (2013). Agnostic notes on regression adjustments to experimental data:
reexamining Freedman's critique. *Annals of Applied Statistics*, 7(1), 295–318.
[DOI: 10.1214/12-AOAS583](https://doi.org/10.1214/12-AOAS583).

### R57

Westreich, D., & Greenland, S. (2013). The table 2 fallacy: presenting and
interpreting confounder and modifier coefficients. *American Journal of
Epidemiology*, 177(4), 292–298.
[DOI: 10.1093/aje/kws412](https://doi.org/10.1093/aje/kws412).

### R58

Wasserman, L., Ramdas, A., & Balakrishnan, S. (2020). Universal inference.
*Proceedings of the National Academy of Sciences*, 117(29), 16880–16890.
[DOI: 10.1073/pnas.1922664117](https://doi.org/10.1073/pnas.1922664117).

### R59

O'Brien, P. C., & Fleming, T. R. (1979). A multiple testing procedure for
clinical trials. *Biometrics*, 35(3), 549–556.
[DOI: 10.2307/2530245](https://doi.org/10.2307/2530245).

### R60

U.S. Food and Drug Administration (2022). *Multiple Endpoints in Clinical
Trials: Guidance for Industry*.
[Authoritative guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/multiple-endpoints-clinical-trials-guidance-industry).

## Audit accounting

- `64` audit-local claims: `58 established`, `4 plausible`, `1 speculative`,
  and `1 disputed`.
- `60` bibliography entries: `54` DOI-linked records, `3` authoritative
  guidance records, `1` authoritative book record, and `2` primary arXiv
  technical reports.
- `13` equal-budget experiment tracks.
- Exact deduplication across `13` registered principles, `20` current
  candidates, and `9` current fixtures.
- Promotion result: `0` new principles, `0` new candidates, and `0` new
  fixtures.

# Primary-source audit: quantitative history, demography, collapse, and diffusion

**Audit date:** 2026-08-05

**Scope:** cohort/period effects, age structure, migration, demographic
transition, population momentum, diffusion and contagion, institutional
collapse and recovery, path dependence, selection and survivorship bias,
missing historical records, causal identification from long-run data, and the
boundary between retrospective explanation and prospective prediction

**Ledger status:** candidate evidence only; every QHD-* identifier is local to
this audit and must not be cited as a repository claim

**Purpose:** extract testable mechanisms and hard inferential limits from
demography and quantitative history without converting fitted historical
regularities into universal laws or forecasts

## Executive finding

This audit adds no new stable principle. It strengthens the project's
observation, lifecycle, and falsification discipline.

Demography supplies exact accounting identities and powerful conditional
projection models. Those models reveal structure that a population total
hides: age composition, cohort flow, migration, delayed effects, and transient
momentum. They do not make fertility, mortality, migration, or policy
stationary. Quantitative history can organize incomplete records, expose
comparative variation, and test explicitly modeled mechanisms. It cannot
recover a unique causal history from a surviving archive, turn a principal
component into a universal developmental axis, or obtain prospective skill
from retrospective fit.

The strongest surviving integration hypothesis is a **cohort-aware, versioned
population-of-components monitor**:

- track entry cohort, age/lifetime stage, calendar period, migration between
  roles, births/replication, deaths/retirement, and selection into observation
  separately;
- preserve the observation, survival, migration, and data-vintage process with
  every estimate;
- project composition with explicit transition matrices and scenario ranges,
  not one timeless rate;
- treat diffusion as a choice among independent exposure, network influence,
  common cause, homophilous selection, and command;
- define degradation and recovery by a vector of functions rather than one
  “collapse” label;
- require a named reinforcement mechanism for path dependence;
- use blocked temporal/geographic holdouts and frozen prospective forecasts;
  and
- abstain when age--period--cohort, missingness, interference, or historical
  instrument assumptions do not identify the requested quantity.

That hypothesis deduplicates into
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection),
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback),
[P-007](../principle-registry.md#p-007--prediction-error-allocation),
[P-009](../principle-registry.md#p-009--maintenance-plane),
[P-011](../principle-registry.md#p-011--transient-communication-coalitions),
[P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime),
and
[P-013](../principle-registry.md#p-013--externalized-shared-state). It informs
Candidate
[003](../../experiments/candidates/003-recovery-dynamics-fragility.md),
[007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
[011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
[014](../../experiments/candidates/014-versioned-observation-contract.md), and
[016](../../experiments/candidates/016-conflict-bounded-unit-transition.md).

The strongest conventional null is ordinary cohort-component accounting,
survival analysis, state-space estimation, nonstationary online learning,
causal-design-specific econometrics, missing-data sensitivity analysis, and
time-blocked forecasting. If those methods retain the same state and
observation contract, historical or demographic metaphors add no architecture.

## Four claims that must never be collapsed

| Claim type | Valid evidence | Invalid upgrade |
| --- | --- | --- |
| accounting identity | complete definitions and internally consistent counts | mechanism, causal direction, or forecast |
| descriptive regularity | measured association in a declared sample, period, coding system, and archive | invariant law or intervention effect |
| causal mechanism | identified contrast plus assumptions, timing, mediators, and alternative paths | universal transfer outside the identifying regime |
| prospective prediction | frozen model tested on observations unavailable during development | retrospective reconstruction, in-sample fit, or post-hoc “prediction” |

A model may pass one row and fail the others. A Leslie projection can be
arithmetically correct and predict poorly because rates change. A diffusion
curve can fit adoption almost perfectly while failing to identify peer
influence. A historical instrument can estimate a local effect under contested
exclusion restrictions and still have no forecasting skill. A collapse story
can explain selected surviving cases and fail on non-collapses or lost cases.

## Applicability gate for AI

| Historical/demographic construct | Necessary engineered analogue | Category error |
| --- | --- | --- |
| birth/entry cohort | components share an entry or training exposure that can affect later outcomes | arbitrary version label with no shared exposure |
| age effect | outcome changes with time since entry or lifecycle stage | calendar drift relabeled as aging |
| period effect | a simultaneous external change affects multiple ages/cohorts | parameter aging inside one module |
| population | countable units with entry, exit, and membership rules | activations within one forward pass |
| fertility/replication | units produce identifiable descendants under a declared inheritance rule | checkpoint copies with no selection or lineage |
| mortality/retirement | removal from the risk set or active population | temporary routing inactivity |
| migration | an identifiable unit changes region, role, module, or task population | information message between fixed units |
| demographic momentum | future total changes because current composition is off equilibrium even after rates change | ordinary optimizer momentum |
| social diffusion | adoption probability may depend on exposures from other units | common broadcast, shared data update, or command |
| collapse | sustained loss across declared population, authority, service, or network dimensions | one incident, benchmark dip, or model reset |
| recovery | restoration of declared function, not merely a returning count | replacement by a different function hidden by an aggregate |
| historical record | selected, delayed, damaged, or coded trace of latent events | complete event log with known retention |
| path dependence | order-sensitive outcome through a named reinforcing mechanism | persistence, hysteresis, or warm start alone |

The gate for Candidate 016 is particularly strict: module count and turnover do
not establish a population under selection. Descendants, inherited state,
variation, differential reproduction, and a collective boundary must all be
operational.

## Common notation and dimensions

For a closed accounting interval of length $\Delta t$ years,

$$
N_{t+\Delta t}
=N_t+B_t-D_t+I_t-O_t,
$$

where every term is persons or engineered units per interval except $N$, which
is a stock at a timestamp. $B,D,I,O$ are births/entries, deaths/exits,
immigration, and outmigration. Rates such as
$b_t=B_t/(N_t\Delta t)$ have units year$^{-1}$. The identity detects
inconsistent accounting; it does not explain any flow.

Let $\mathbf n_t$ be an age-structured count vector in persons or units and
$\mathbf L_t$ a Leslie transition matrix:

$$
\mathbf n_{t+\Delta t}=\mathbf L_t\mathbf n_t.
$$

Fertility entries are daughters or new units per source unit per interval;
survival/transition entries are dimensionless probabilities; matrix products
must respect the interval. For time-invariant primitive $\mathbf L$, dominant
eigenvalue $\lambda$ is growth per interval and
$r=\log(\lambda)/\Delta t$ has units year$^{-1}$. Stable-age conclusions are
conditional on primitive, stationary transitions and sufficient convergence
time.

For age $a$, calendar period $p$, and birth/entry cohort $c=p-a$, an additive
age--period--cohort model is

$$
g\!\left(\mathbb E[Y_{a,p}]\right)
=\mu+\alpha_a+\beta_p+\gamma_c.
$$

$Y$ has its declared outcome unit and $g$ is a specified link. Because
$c=p-a$, the linear components are exactly collinear. No estimator recovers a
unique triplet without restrictions, priors, nonlinear structure, external
variation, or substantive assumptions.

For adoption share $F(t)\in[0,1]$, the Bass model is

$$
\frac{dF(t)}{dt}
=\left(p+qF(t)\right)\left(1-F(t)\right),
$$

where $p$ and $q$ have units time$^{-1}$. This is a conditional adoption
curve, not identification of interpersonal contagion.

For a historical treatment $D\in\{0,1\}$ and outcome $Y$,

$$
\tau=\mathbb E[Y(1)-Y(0)]
$$

has the same unit as $Y$. Only one potential outcome is observed per unit.
Identification requires a design-specific exchangeability, instrument,
threshold, timing, or structural assumption; long elapsed time adds possible
mediators and confounders rather than causal authority.

## Audit and deduplication map

| Topic | Exact problem | Primary evidence class | Existing home | Disposition |
| --- | --- | --- | --- | --- |
| age--period--cohort | distinguish lifecycle, common shock, and entry-cohort exposure | algebraic identification boundary | P-012/P-013; Candidate 014 | constraint, no new principle |
| age structure | project composition from age-specific rates | demographic matrix identity/model | P-006/P-012 | reusable null |
| population momentum | quantify transient growth after replacement rates | stable-population mathematics | P-006/P-012 | lifecycle warning |
| demographic transition | describe mortality/fertility/age change and test competing mechanisms | long-run descriptive synthesis plus structural model | economics and cultural audits | no universal stage law |
| migration | separate flow, selection, network support, and destination effects | theory plus quasi-experiment | P-004/P-011/P-013 | experiment factor |
| diffusion/contagion | distinguish influence from homophily, common cause, independent exposure, and command | model, experiment, identification theorem | epidemiology/cultural/communication audits | threat model |
| quantitative history | compare coded long-run trajectories | structured database plus retrospective statistical model | P-013; Candidate 014 | observation framework |
| collapse/recovery | measure multivariate loss, propagation, adaptation, and restoration | chronology/correlational reconstruction plus shock study | Earth-system, paleobiology, HRO; Candidates 003/011 | no universal threshold |
| path dependence | identify order-sensitive reinforcement | long-run IV/RD/sequence evidence | economics, cultural, social-choice audits | mechanism requirement |
| survivorship/missingness | infer from records selected by survival, production, discovery, and coding | missing-data/selection theory plus taphonomic study | P-004/P-007/P-013; Candidates 007/014 | observation contract |
| causal long-run inference | estimate a counterfactual across deep time | IV/RD/natural experiment with contested assumptions | economics/social-choice audits | design-specific only |
| prediction | test future or genuinely held-out time/place | cross-validation and forecast competition | P-007/P-009 | decisive promotion gate |

## 1. Age, period, and cohort: the non-identification is structural

**Primary sources.** Mason, Mason, Winsborough, and Poole set out the cohort
analysis identification problem in archival data
([DOI: 10.2307/2094398](https://doi.org/10.2307/2094398)). Bell and Jones
demonstrate why technical estimators cannot remove the underlying exact
dependency without assumptions
([DOI: 10.1016/j.socscimed.2013.04.029](https://doi.org/10.1016/j.socscimed.2013.04.029)).

**Exact problem.** Age may change behavior through lifecycle processes; period
may change every active cohort through a shared shock; cohort may preserve a
formative exposure. But age, observation year, and birth year obey an identity.
Adding more observations or lower noise does not identify three unrestricted
linear trends.

**Evidence status.** Established algebraic boundary. Particular curvature,
deviations, or contrasts may be estimable under parameterization, but each
constraint determines part of the answer.

**Allowed claims.**

- report raw age-by-period rates and cohort trajectories;
- identify discontinuities tied to external events when the design supports
  them;
- estimate nonlinear deviations under declared smoothness or zero-sum
  constraints;
- compare sensitivity across defensible identifying restrictions; and
- state that multiple APC decompositions fit equally well when they do.

**Failure boundaries.**

- an intrinsic, hierarchical, Bayesian, or regularized estimator hides rather
  than eliminates its identifying assumption;
- changing bin width can change the implied constraint;
- selective attrition makes apparent aging differ from within-unit aging;
- repeated cross-sections do not become individual longitudinal data; and
- “generation” labels often bundle cohort, period, composition, and
  measurement change.

**AI translation.** When an old module underperforms, separate time since
creation, system-wide period drift, version/training cohort, and selective
survival. Do not retire a cohort merely because its surviving members face a
harder contemporary workload.

**Strongest null.** Stratified descriptive curves, longitudinal within-module
change where observed, explicit event indicators, and sensitivity across APC
constraints. Candidate 014 adds value only if its versioned exposure and
selection contract prevents downstream modules from silently treating one
decomposition as identified.

**Measurable prediction.** Synthetic data generated from different APC
decompositions with identical observed surfaces will yield divergent estimated
stories across constraints but identical fit. A valid system should flag
non-identification rather than confidently select one.

## 2. Age structure and cohort-component projection

**Primary source.** Leslie formalizes matrix projection for age-structured
populations
([DOI: 10.1093/biomet/33.3.183](https://doi.org/10.1093/biomet/33.3.183)).

**Exact problem.** A total population count cannot predict future entries,
exits, workload, or dependency when fertility/entry and survival/retirement
differ by age or stage.

**Efficiency mechanism.** Composition is a sufficient state for projection
under the chosen stage model. Multiplication makes delayed consequences
visible: reducing entry now may not reduce the active stock immediately;
retaining one stage may shift later bottlenecks; selective retirement changes
the future skill distribution.

**Evidence status.** Established mathematical model and accounting framework.
Projection accuracy remains conditional on transition rates, classification,
closed/open population treatment, and uncertainty.

**Failure boundaries.**

- rates change with congestion, policy, learning, environment, or density;
- unmodeled migration breaks a closed projection;
- age is not the relevant state when skill, health, role, or dependency
  governs transitions;
- aggregate fertility hides parity, sex, and exposure denominators;
- a dominant eigenvalue describes asymptotic behavior, not short transients;
  and
- stochastic extinction, rare shocks, and correlated failures are absent from
  a deterministic mean matrix.

**AI translation.** Track specialists by lifecycle state—candidate, protected
entrant, productive, maintaining, dormant, retired—not merely model count.
Transitions must be measured per episode or wall-clock interval and include
promotion, demotion, migration, fork, merge, and deletion.

**Strongest null.** A Markov/semi-Markov cohort model or ordinary inventory
flow model with uncertainty. The demographic label contributes nothing unless
inheritance or age structure is causal.

**Deduplication.** Diversity and survival are P-004; state regulation is P-006;
lifetime-specific storage is P-012; lineage is P-013; actual reproduction and
selection belong to Candidate 016.

## 3. Population momentum and transient composition

**Primary source.** Keyfitz derives population momentum after an immediate
shift to replacement fertility under stable-population assumptions
([DOI: 10.2307/2060339](https://doi.org/10.2307/2060339)).

Define conditional momentum

$$
M=\frac{N_{\infty}^{\mathrm{stationary}}}{N_0},
$$

a dimensionless ratio under a declared post-change fertility, mortality,
migration, sex, and stable-age scenario. $M>1$ means continued growth despite
replacement fertility because a large cohort is entering reproductive ages.
It is not physical momentum and not a universal constant.

**Exact problem.** Current composition stores delayed future flow. A rate can
reach its target while the stock continues moving.

**AI translation.** After stopping creation of specialists, queued entrants,
replicas, cached artifacts, contractual allocations, or mature modules may
continue increasing cost. Conversely, aggressive retirement can create a
future skill trough even while current throughput stays high.

**Failure boundaries.**

- the stationary endpoint is undefined under continuing migration or changing
  rates;
- a finite system may hit capacity before asymptotic momentum realizes;
- feedback makes rates endogenous to the stock;
- one population's momentum cannot be copied to another age structure; and
- optimizer momentum is an unrelated mechanism.

**Strongest null.** Queueing and stock-flow projection with age/stage
composition. A “demographic momentum controller” must beat that model at equal
state and compute.

**Measurable prediction.** Matched systems with identical totals and rates but
different stage composition should have different future entry/retirement
paths. A total-only controller should misallocate; a cohort-component
controller should improve only when transition estimates remain calibrated.

## 4. Demographic transition and age-structure dividends

**Primary sources.** Lee synthesizes the long-run descriptive transition from
high mortality and fertility toward lower rates and older age structures
([DOI: 10.1257/089533003772034943](https://doi.org/10.1257/089533003772034943)).
Galor and Weil construct a unified structural growth model linking population,
technology, human capital, and regime transition
([DOI: 10.1257/aer.90.4.806](https://doi.org/10.1257/aer.90.4.806)).
Bloom and Williamson estimate an association between working-age composition
and East Asian growth in 1965--1990
([DOI: 10.1093/wber/12.3.419](https://doi.org/10.1093/wber/12.3.419)).

**Descriptive regularity.** In many populations mortality decline preceded
fertility decline, population growth first accelerated then slowed, and age
structure shifted older. Timing, sequence, reversals, migration, and mechanisms
vary.

**Causal candidates.** Child survival, income, urbanization, education,
contraception, women's opportunities, old-age security, institutions, norms,
and technology can affect fertility or mortality and each other. The transition
label does not identify their direction or weight.

**Retrospective-fit boundary.** A structural model that reproduces broad
historical regimes demonstrates internal sufficiency under calibration, not
uniqueness. Multiple parameterizations and mechanisms can fit the same sparse
series. A “demographic dividend” is conditional on employment, education,
health, capital, institutions, and policy; a larger working-age share does not
automatically create growth.

**AI translation.** The tempting analogy is a system that moves from rapid
module creation to consolidation and maintenance as its capability base
matures. That remains a lifecycle scheduling hypothesis, not a natural stage
law. Environmental nonstationarity may require renewed entry indefinitely.

**Failure boundaries.**

- stage narratives become teleological and erase reversals;
- national aggregates conceal distribution and migration;
- dependency ratios classify people by age rather than actual production or
  care;
- policies affect both age structure and outcomes;
- historical data quality changes with development; and
- extrapolating a completed transition to an engineered system assumes the
  target environment stops changing.

**Strongest null.** A nonstationary capacity planner that estimates marginal
value of entry, training, maintenance, and retirement directly.

**Deduplication.** Diversity/entry protection is P-004, homeostatic stock
control P-006, maintenance P-009, and memory/lifecycle P-012. The economics and
cultural audits already cover human-capital and institutional mechanism
families.

## 5. Migration, selection, and network support

**Primary sources.** Sjaastad models migration as an investment with private
costs and returns
([DOI: 10.1086/258726](https://doi.org/10.1086/258726)). Edin, Fredriksson, and
Åslund exploit a Swedish refugee-placement policy to study enclave effects
([DOI: 10.1162/00335530360535225](https://doi.org/10.1162/00335530360535225)).
Damm uses Danish refugee dispersal to identify selection into enclaves and
effects of enclave size on earnings
([DOI: 10.1086/599336](https://doi.org/10.1086/599336)).

**Exact problem.** Movement changes both origin and destination composition.
Migrants are often selected on skill, risk, resources, networks, persecution,
constraints, or expected returns. Destination outcomes therefore mix treatment
effects with who moves and where they are placed.

For group $g$ and region $r$, the net migration rate is

$$
m_{g,r,t}=\frac{I_{g,r,t}-O_{g,r,t}}
{N_{g,r,t}\Delta t},
$$

with units year$^{-1}$. Net flow hides simultaneous large inflow and outflow,
return migration, and changes in composition.

**Evidence status.** Economic theory plus context-specific natural/quasi-
experiments. Dispersal policies help reduce residential self-selection for
eligible refugees but do not randomize every later move, network, policy, or
labor-market condition.

**AI translation.** Specialists migrate between tasks, modules, memory tiers,
or compute regions. Assignment outcomes can reflect initial skill and selective
movement, not the causal value of the destination. Network support may transmit
task information while also creating dependence and lock-in.

**Failure boundaries.**

- “brain drain” at the origin and “skill gain” at destination can coexist;
- movers and stayers have different unobserved counterfactuals;
- migration follows anticipated demand, creating reverse causality;
- forced placement is not voluntary routing;
- enclave size mixes peer support, discrimination, market access, and
  neighborhood conditions; and
- return migration selectively removes failures or successes from observation.

**Strongest null.** Switching-cost-aware assignment with pre-move covariates,
randomized or threshold-based trial placement, and explicit origin/destination
outcomes. Use fixed effects or causal designs only with their assumptions.

**Residual experiment.** Randomize eligible specialists among matched task
regions, allow a later voluntary migration phase, and retain origin outcomes.
Compare static assignment, learned routing, network-supported migration, and
protected exploration. Measure quality, adaptation time, communication,
switching energy, origin skill loss, destination congestion, return migration,
and selection-adjusted gains.

**Deduplication.** Migration preserves diversity under P-004, may create P-011
coalitions, and needs P-013 lineage. It does not establish a new mobility
principle.

## 6. Diffusion, contagion, and correlated adoption

**Primary sources.** Bass fits an innovation/imitation adoption model to
consumer durables
([DOI: 10.1287/mnsc.15.5.215](https://doi.org/10.1287/mnsc.15.5.215)).
Granovetter shows how distributions of individual thresholds can yield sharply
different collective outcomes despite similar averages
([DOI: 10.1086/226707](https://doi.org/10.1086/226707)). Centola's randomized
online-network experiment finds greater adoption under clustered reinforcement
for the studied health behavior
([DOI: 10.1126/science.1185231](https://doi.org/10.1126/science.1185231)).
Shalizi and Thomas establish that latent homophily and contagion are generically
confounded in observational network studies
([DOI: 10.1177/0049124111404820](https://doi.org/10.1177/0049124111404820)).

**Competing mechanisms.**

1. independent response to an external source;
2. common cause affecting linked units;
3. homophilous tie formation among similar units;
4. direct simple contagion from one exposure;
5. complex contagion requiring reinforcing exposures;
6. strategic imitation or threshold response;
7. command, policy, or shared software deployment; and
8. selective observation of visible adopters.

The same S-curve or network autocorrelation can arise from several.

**Evidence status.** Bass and Granovetter supply generative models with
retrospective applications; Centola supplies a causal network-topology result
for a bounded experimental task; Shalizi--Thomas supplies an identification
boundary. None licenses “ideas spread like viruses” as a general law.

**AI translation.** A convention, tool, prompt, evaluator, or failure behavior
may spread across agents. If all agents receive the same release, this is
broadcast, not contagion. If similar agents use the same tool, homophily is
plausible. If adoption requires acknowledgements from several peers, complex
contagion is an operational hypothesis.

**Failure boundaries.**

- network ties and behavior co-evolve;
- time bins can miss fast influence or reverse order;
- repeated exposure is correlated with relevance and centrality;
- an apparent threshold may reflect capacity or policy;
- clustered networks reinforce false as well as useful conventions;
- adoption count says nothing about quality or grounding; and
- interference violates independent-unit causal estimators.

**Strongest null.** Independent response to measured exposure and covariates,
plus broadcast/common-shock and homophily models. A causal influence claim
requires randomized exposure/topology, a valid instrument, or credible
interference design.

**Residual experiment.** Randomize network topology and exposure while
crossing simple versus reinforcement-requiring tasks, true versus false
conventions, and common broadcast versus peer transmission. Equalize messages,
bandwidth, opportunities, and seed quality. Measure adoption hazard, task
quality, false-convention spread, source attribution, time to correction,
concentration, and communication energy.

**Deduplication.** The
[epidemiology audit](2026-08-05-epidemiology-and-surveillance-control.md)
covers biological surveillance/contagion; the
[cultural audit](2026-08-05-cultural-evolution-archaeology.md) covers
transmission and convention dynamics; communication and Candidate 015 cover
repairable semantics. Here the residue is an identification warning for
P-011/P-013 and Candidates 007/014.

## 7. Quantitative history and coded social complexity

**Primary sources.** Turchin and collaborators construct Seshat and apply
principal-component analysis to 51 coded variables across 414 societies in 30
regions, finding that the first component explains roughly three quarters of
observed variation in their sample
([DOI: 10.1073/pnas.1708800115](https://doi.org/10.1073/pnas.1708800115)).
Turchin, Currie, Turner, and Gavrilets compare a spatial warfare/technology
model to the historical distribution of large-scale societies
([DOI: 10.1073/pnas.1308825110](https://doi.org/10.1073/pnas.1308825110)).

**Exact problem.** Convert heterogeneous textual, archaeological, and expert
records into comparable variables across long time and space, then test
explicit hypotheses about covariance or dynamics.

**What a principal component establishes.** For centered coded vector
$\mathbf x$, PC1 is

$$
z_1=\mathbf w_1^\top\mathbf x,
\qquad
\|\mathbf w_1\|_2=1,
$$

a dimensionless linear score determined by coding, scaling, covariance,
sampling, and missing-data treatment. High explained variance establishes a
low-dimensional correlation pattern in that dataset. It does not establish a
single causal ladder, moral progress, inevitability, or identical sequence.

**Evidence status.** Large structured comparative description and
retrospective model comparison. The database is a major measurement advance,
but entries remain historically reasoned codings with uncertainty,
disagreement, temporal resolution, and uneven source survival.

**Failure boundaries.**

- variables partly encode overlapping definitions, mechanically raising
  covariance;
- polity boundaries and time bins are analytical choices;
- literate centralized societies leave different records than small or
  defeated populations;
- experts know surrounding hypotheses, inviting coding dependence;
- spatial and temporal observations are not independent;
- interpolated or uncertain dates can create apparent lead/lag;
- a model tuned on the same map is not a forecast; and
- one component can conceal distinct institutional configurations with equal
  scores.

**Strongest null.** Transparent ontology plus multilevel descriptive model,
leave-one-region/era-out validation, coder disagreement, and simple spatial
diffusion/environmental baselines.

**AI translation.** A longitudinal system registry can encode module scale,
communication, hierarchy, memory, control, and maintenance. PCA can summarize
covariation but must not become an autonomous “complexity reward.” Candidate
014 is the appropriate home for codebook, provenance, missingness, and vintage.

**Measurable prediction.** A historical mechanism must forecast a preregistered
held-out region/time interval better than scale, spatial diffusion, and
autoregressive baselines, while retaining calibration under alternative coding
and dating.

## 8. Collapse and recovery are multivariate trajectories

**Primary sources.** Kennett and collaborators align a precisely dated cave
climate record with Maya political chronologies and propose rainfall/drought
links to expansion, fragmentation, warfare, and asynchronous polity and
population decline
([DOI: 10.1126/science.1226299](https://doi.org/10.1126/science.1226299)).
Davis and Weinstein use Allied bombing of Japanese cities as a large temporary
shock and find long-run relative city-size recovery consistent with strong
locational fundamentals
([DOI: 10.1257/000282802762024502](https://doi.org/10.1257/000282802762024502)).

Define a collapse/recovery vector

$$
\mathbf C_t=
\left(
N_t,\ Q_t,\ A_t,\ K_t,\ G_t,\ R_t
\right),
$$

where $N$ is population/active-unit count, $Q$ service quality in task units,
$A$ available authority/capability fraction, $K$ connected-network fraction,
$G$ governance/change capacity in declared operations per interval, and $R$
resource reserve in joules, bytes, or task-native units. No scalar collapse
index is valid without weights and thresholds.

**Exact problem.** Distinguish shock, propagation, functional loss, migration,
institutional transformation, population decline, persistence, and recovery.
Recovery of a count can coexist with loss of identity, distribution,
institution, or function.

**Evidence status.** Kennett et al. provide high-resolution chronological
association and a proposed multistep mechanism, not randomized climate.
Davis--Weinstein provide a shock-based test of urban-location theories in one
postwar setting, not a universal resilience coefficient.

**Failure boundaries.**

- “collapse” bundles asynchronous changes across places and functions;
- monumental inscriptions decline because production or preservation changes;
- population leaves rather than dies;
- an external shock is endogenous to prior conflict or targeting;
- post-shock aid and policy affect recovery;
- a system rebuilds around a different function;
- early-warning signals do not precede every abrupt or exogenous failure; and
- cases famous for collapse are selected from many stressed non-collapses.

**Strongest null.** Incident and continuity engineering with component-specific
service-level objectives, fault trees, state estimation, backups, and recovery
time objectives. Candidate 003 only applies to gradual locally recoverable
transitions; Candidate 011 handles live containment plus longitudinal learning.

**Residual experiment.** Factor shock size, coupling, reserve, migration,
replacement, institutional rewrite, and observation loss. Compare static
threshold alerts, passive change detection, Candidate 003 probes, conventional
SRE recovery, and Candidate 011. Equalize sensing, intervention, storage,
reserve, and operator time. Measure each $\mathbf C_t$ component, time under
minimum service, irreversible lineage loss, false collapse alarms, migration,
and recovery to old versus new function.

**Deduplication.** This section adds no “civilizational collapse” principle.
The [Earth-system audit](2026-08-05-earth-system-transition-signals.md)
already bounds early warnings; the
[paleobiology audit](2026-08-05-paleobiology-major-transitions.md) covers
extinction and recovery; HRO covers incident learning; P-006/P-009 and
Candidates 003/011 hold the engineering mechanisms.

## 9. Path dependence: persistence requires reinforcement and a counterfactual

**Primary source.** Nunn constructs country-level slave-export measures from
shipping and historical records, relates them to later economic outcomes, and
uses historical selection arguments and an instrument to support a long-run
causal interpretation
([DOI: 10.1162/qjec.2008.123.1.139](https://doi.org/10.1162/qjec.2008.123.1.139)).
The [social-choice audit](2026-08-05-social-choice-institutions.md) separately
audits Pierson's increasing-returns framework and Dell's spatial regression
discontinuity.

**Required mechanism.** A path-dependence claim needs:

1. a branching event or differential exposure;
2. an alternative feasible path;
3. reinforcement through learning, coordination, complementarity, sunk cost,
   power, institutions, expectations, network support, or selection;
4. an order-sensitive outcome;
5. a reason ordinary persistence or stable fundamentals is insufficient;
6. a switching cost and bearer; and
7. a condition or intervention that weakens reinforcement.

**Evidence status.** Long-run historical causal evidence can be strong relative
to available alternatives and remain assumption-sensitive. Instruments,
historical exposure reconstruction, present-day boundaries, mediators, and
spatial correlation all require direct audit.

**AI translation.** Early routing gives modules data that improves later
routing; early protocols attract integrations; old evaluators shape the
training distribution; temporarily dominant modules control successor tests;
and retained artifacts make one architecture cheap to continue.

**Failure boundaries.**

- current advantage may reflect stable quality or geography;
- persistence alone supplies no branching counterfactual;
- every later mediator is not automatically part of one causal chain;
- reinforcement can be beneficial and costly to remove;
- an instrument's historical channel may affect outcomes directly; and
- selecting only persistent institutions erases failed or reversed paths.

**Strongest null.** Nonstationary online learning with switching costs,
protected exploration, periodic re-evaluation on independent outcomes, and
versioned migration.

**Residual experiment.** Randomize early exposure and incumbency, match final
resources, and ablate data advantage, compatibility, reputation, evaluator
control, and migration cost separately. The claim survives only if ordering
changes later outcomes and the named reinforcement ablation removes that gap.

**Deduplication.** Protected alternative lineages are P-004; error-directed
re-evaluation P-007; maintenance/migration P-009; history retention P-012/P-013;
conflict and heritable higher-level selection Candidate 016.

## 10. Missing records, survivorship, and selected history

**Primary sources.** Rubin formalizes missing-data mechanisms and the conditions
under which the missingness process may be ignored in likelihood/Bayesian
inference
([DOI: 10.1093/biomet/63.3.581](https://doi.org/10.1093/biomet/63.3.581)).
Heckman treats nonrandom sample selection as a specification problem under a
joint outcome/selection model
([DOI: 10.2307/1912352](https://doi.org/10.2307/1912352)). Surovell and
collaborators model the overrepresentation of younger archaeological deposits
caused by destructive taphonomic processes
([DOI: 10.1016/j.jas.2009.03.029](https://doi.org/10.1016/j.jas.2009.03.029)).

Let latent event/record $Y_i$ be observed only when $R_i=1$:

$$
Y_i^{\mathrm{obs}}=
\begin{cases}
Y_i,&R_i=1,\\
\text{missing},&R_i=0.
\end{cases}
$$

Historical observation can be factored diagnostically as

$$
P(R_i=1)=
P(\text{produced})
P(\text{survives}\mid\text{produced})
P(\text{discovered}\mid\text{survives})
P(\text{coded}\mid\text{discovered}),
$$

but the factors are not assumed independent or known. “Missing at random” is a
conditional assumption, not a synonym for random loss.

**Exact problem.** Winners, durable materials, centralized record producers,
recent periods, literate institutions, and visible successes enter the archive
at different probabilities. Outcome-conditioned survival biases rates,
sequences, network structure, and causal estimates.

**Evidence status.** Established missing/selection theory and empirical
taphonomic correction models. No generic correction recovers information lost
under unrestricted missing-not-at-random selection.

**Failure boundaries.**

- inverse-probability weighting needs nonzero and estimable observation
  probabilities;
- Heckman correction needs functional/distributional or exclusion assumptions;
- older-record correction can confuse preservation with real population change;
- written absences are not evidence of event absence;
- denominator reconstruction is often weaker than numerator counting;
- destroyed failures cannot be recovered from surviving successes; and
- modern telemetry retention policy changes the apparent historical process.

**AI translation.** Production logs omit blocked actions, failed agents,
unreported near misses, expired traces, and deleted modules. Successful lineages
have richer histories because they lasted and were instrumented. Training on
surviving trajectories can infer false success mechanisms.

**Strongest null.** A versioned observation/retention schema, probability sample
of ordinary and failed work, explicit non-detections, deletion tombstones,
selection model, and bounded MNAR sensitivity analysis.

**Residual experiment.** Generate a complete latent event history, then impose
age-, severity-, success-, actor-, and policy-dependent record loss. Compare
complete-case analysis, standard imputation, inverse weighting, explicit joint
selection models, and Candidate 014. Equalize stored bytes and model compute.
Measure estimand bias, interval coverage, false trend/collapse detection,
non-identification warnings, and storage/curation cost.

**Deduplication.** Observation allocation is P-007, preservation across
lifetimes P-012, lineage P-013, endogenous surveillance Candidate 007, and the
complete contract Candidate 014. P-004 is relevant when failed/minority
lineages need protected sampling.

## 11. Causal identification from long-run data

**Primary sources.** Acemoglu, Johnson, and Robinson use settler mortality as an
instrument for colonial institutions in a cross-country study
([DOI: 10.1257/aer.91.5.1369](https://doi.org/10.1257/aer.91.5.1369)).
Albouy audits mortality construction and robustness, reporting extensive
borrowed/incomparable values and weak/unreliable IV estimates under corrections
([DOI: 10.1257/aer.102.6.3059](https://doi.org/10.1257/aer.102.6.3059)).

For instrument $Z$, treatment/institution $D$, and outcome $Y$, a simple IV
estimand is

$$
\hat\tau_{\mathrm{IV}}
=\frac{\operatorname{Cov}(Z,Y)}
{\operatorname{Cov}(Z,D)}.
$$

It has units $Y/D$. Causal interpretation requires relevance; exclusion of
direct $Z\rightarrow Y$ paths; independence from outcome determinants;
well-defined treatment; and, for a local average treatment effect,
monotonicity and a specified complier population.

**Long-run hazards.**

- the instrument changes many later channels;
- historical variables are reconstructed with nonclassical error;
- borders aggregate heterogeneous exposure;
- treatment/institution measures are post-treatment or contemporary proxies;
- spatial dependence invalidates naïve uncertainty;
- descendants, migrants, and survivors change the population;
- multiple testing and specification search exploit a small effective sample;
- standard errors omit coding and dating uncertainty; and
- a persuasive mechanism narrative is not the exclusion restriction.

**Evidence status.** Design-specific, contested causal inference. A critique of
one dataset does not prove institutions irrelevant; an influential estimate
does not make its instrument valid elsewhere.

**Strongest null.** Transparent descriptive association; negative controls;
direct exposure reconstruction; alternative instruments; geographic/temporal
placebos; sensitivity to omitted variables, coding, boundaries, spatial
correlation, and weak instruments; and triangulation with another design.

**AI translation.** “Historical” interventions such as early initialization,
random seed, hardware availability, or queue position are instruments only if
they affect later outcomes solely through the proposed module/institution.
That exclusion is often false because early conditions also change data,
latency, failures, and human attention.

**Promotion boundary.** Candidate evidence must name its estimand and
population; publish the full first stage; show weak-instrument-robust intervals;
preserve record construction; and survive plausible alternative channels.

## 12. Retrospective fit is not prospective prediction

**Primary sources.** Stone formalizes cross-validatory assessment of
statistical predictions
([DOI: 10.1111/j.2517-6161.1974.tb00994.x](https://doi.org/10.1111/j.2517-6161.1974.tb00994.x)).
The M4 competition evaluates frozen forecasts from 61 methods on 100,000 time
series, including point and interval accuracy
([DOI: 10.1016/j.ijforecast.2019.04.014](https://doi.org/10.1016/j.ijforecast.2019.04.014)).

**Exact problem.** Historical models are frequently chosen after seeing the
full trajectory, event date, affected region, coding revisions, and candidate
mechanisms. Random row splits leak temporal, spatial, lineage, and source
dependence.

For forecast origin $t$ and horizon $h$, error is

$$
e_{t,h}=Y_{t+h}-\widehat Y_{t+h\mid t},
$$

in the same unit as $Y$. A $100(1-\alpha)\%$ interval has empirical coverage

$$
\frac1M\sum_{m=1}^{M}
\mathbf1\!\left[
Y_m\in[\ell_m,u_m]
\right],
$$

a dimensionless fraction that must be reported by horizon and regime. Good
mean error can coexist with catastrophic tail or transition failure.

**Required validation ladder.**

1. in-sample reconstruction, labeled only as fit;
2. rolling-origin temporal holdout;
3. leave-one-region/source/lineage-out transfer;
4. pseudo-prospective hindcast using only the data vintage available then;
5. frozen live forecast with preregistered outcome and horizon; and
6. intervention test when a causal mechanism is claimed.

Each rung answers a different question. Repeatedly revising a theory after a
hindcast exposes failures makes the next run retrospective again.

**Failure boundaries.**

- time-series autocorrelation leaks through random folds;
- source editions published later leak resolved dates and events;
- hyperparameter and ontology selection consume the holdout;
- rare collapse yields unstable accuracy and base-rate domination;
- a forecast can be calibrated overall and fail vulnerable regions;
- structural change invalidates stationary intervals; and
- “predicted before the paper” is not evidence unless the prediction was
  timestamped, specific, and scored.

**Strongest null.** Persistence, seasonal/age-structured naïve projection,
regularized autoregression, and domain-specific mechanistic baseline. Complexity
must earn its cost and beat these on frozen holdouts.

**AI translation.** Use versioned data vintages, time-respecting evaluation,
unseen task families, explicit abstention, and interval scoring. P-007 allocates
effort to prediction error; P-009 closes forecast failures into maintenance;
P-013 proves what was known at forecast time.

## Cross-domain synthesis

| Surviving mechanism | Why it matters | Existing repository home |
| --- | --- | --- |
| composition-aware stock/flow accounting | totals hide delayed transitions and migration | P-006/P-012 |
| explicit APC non-identification | lifecycle, period, and cohort stories can fit the same surface | P-012/P-013; Candidate 014 |
| separate state from observation/survival | archives and telemetry are selected histories | P-007/P-013; Candidates 007/014 |
| preserve failed and minority lineages | survivors cannot reveal eliminated alternatives | P-004/P-012 |
| distinguish peer influence from broadcast/common cause/homophily | correlated adoption is not contagion | P-011/P-013 |
| vector-valued collapse/recovery | count, function, authority, network, and identity recover differently | P-006/P-009; Candidates 003/011 |
| demand reinforcement for path dependence | persistence alone is non-diagnostic | P-004/P-009/P-013; Candidate 016 |
| freeze prospective predictions | retrospective fit has weak evidential weight for foresight | P-007/P-009/P-013 |

No row warrants a new P-* principle. The integration is useful as an
observation and evaluation contract.

## Strongest null stack

Every history/demography-inspired proposal must beat:

1. exact stock-flow accounting with reconciliation;
2. age/stage-structured Markov or semi-Markov projection;
3. explicit nonstationary migration and hazard models;
4. descriptive APC surfaces with sensitivity across identifying constraints;
5. calibrated state-space and change-point models;
6. broadcast, homophily, common-cause, and independent-exposure diffusion
   baselines;
7. standard missing-data, survival, and sample-selection sensitivity analysis;
8. causal-design-specific IV/RD/difference/placebo diagnostics;
9. ordinary SRE continuity, backup, and recovery objectives;
10. simple time-series baselines with rolling-origin and geographic holdout;
11. versioned schemas, raw trace custody, and deletion tombstones; and
12. human historical/expert review of coding and construct validity.

The candidate loses if it only improves narrative coherence, in-sample fit, or
aggregate accuracy while adding energy, latency, storage, or false certainty.

## Equal-budget decisive experiments

### A. APC abstention and constraint sensitivity

Generate identical age-by-period surfaces from observationally equivalent APC
parameterizations, then add longitudinal panels, selective attrition, known
period shocks, or external cohort instruments in separate conditions. Compare
naïve regression, intrinsic/hierarchical estimators, stratified descriptions,
and Candidate 014's assumption-carrying contract. Equalize samples and compute.

Measure coefficient-story error, predictive error, interval coverage,
constraint sensitivity, and correct non-identification rate. The candidate
fails if it merely chooses a preferred decomposition more confidently.

### B. Composition and momentum control

Create populations with equal total count but different age/stage structures,
then change entry, survival, migration, and capacity. Compare total-only
control, queue/stock-flow control, fixed Leslie projection, time-varying cohort
projection, and a learned state-space model. Equalize observed variables and
compute.

Measure forecast error by horizon, capacity violation, delayed skill shortage,
energy, unnecessary entry/retirement, and calibration under rate drift.

### C. Migration and placement

Randomize eligible modules among regions/tasks with heterogeneous networks and
later voluntary movement. Include selection, congestion, origin spillover, and
return migration. Compare static assignment, contextual routing,
switching-cost-aware routing, and network-supported migration. Equalize trials,
communications, and migration budget.

Measure causal destination gain, origin loss, quality, wage/reward analogue,
adaptation time, switching energy, return-selection bias, and distribution.

### D. Diffusion identification

Factor randomized peer exposure, common broadcast, homophilous network
formation, clustered reinforcement, command deployment, and hidden common
causes. Compare Bass/logistic fit, threshold model, network regression,
randomized exposure estimator, and explicit causal graph. Equalize seeds,
messages, and observation windows.

Measure mechanism classification, adoption forecast, false-contagion rate,
task quality, harmful adoption, correction latency, and interval calibration.

### E. Collapse and recovery

Inject slow endogenous degradation, abrupt exogenous shock, common-mode
failure, migration, observation loss, and functional substitution. Compare
scalar collapse index, multivariate change detection, Candidate 003,
conventional SRE, and Candidate 011. Equalize probes, reserve, logs, and human
minutes.

Measure service-vector loss, containment/recovery tails, false alarms,
irreversible lineage loss, old-function versus substitute recovery, and total
cost.

### F. Archive selection

Start with a complete latent history and impose record production,
preservation, discovery, retention, and coding selection that depends on age,
success, severity, and actor. Compare complete case, age correction, multiple
imputation, inverse weighting, joint selection, and Candidate 014. Equalize
retained bytes.

Measure trend, diffusion, and collapse estimand bias; confidence coverage;
denominator recovery; false certainty; and curation cost. Include unrestricted
MNAR cases where every method should abstain.

### G. Long-run causal design

Simulate and, where ethical, use historical benchmark datasets with known
relevance, exclusion violations, measurement error, spatial dependence,
migration, and weak instruments. Compare descriptive regression, IV, weak-IV
robust inference, negative controls, alternative-channel adjustment, and
triangulation across designs.

Measure estimand bias, interval coverage, first-stage strength, false causal
claim rate, robustness to boundary/coding changes, and transfer to a second
setting.

### H. Retrospective versus prospective history

For each candidate historical model, compare in-sample fit, random-fold
validation, rolling-origin holdout, leave-region-out transfer, pseudo-
prospective vintage-locked hindcast, and a frozen live forecast. Equalize
training information and tuning budget.

Measure point error, proper interval score, coverage by horizon/regime,
collapse-event precision/recall at declared base rate, abstention utility, and
performance relative to persistence and simple structural baselines.

### I. Path dependence and survivorship

Randomize early exposure among many lineages; allow some to fail, migrate,
merge, or become unobserved; then match final resources. Cross data advantage,
compatibility, reputation, evaluator control, and switching cost. Compare
survivor-only analysis, full-lineage logging, periodic reevaluation, protected
exploration, and Candidate 016.

Measure order effects, eliminated-lineage counterfactual error, incumbent
concentration, switching cost, collective performance, and whether ablation of
the named reinforcement removes persistence.

## Promotion and kill rules

The cohort-aware observation hypothesis may advance only if:

- it prevents a material error beyond the strongest statistical and systems
  null at equal end-to-end budget;
- every state, flow, rate, horizon, denominator, and transition interval has
  declared units;
- APC claims publish their identifying restrictions and alternatives;
- diffusion claims distinguish influence from homophily, broadcast, common
  cause, command, and selection;
- collapse/recovery claims report the full functional vector and explicit
  threshold sensitivity;
- missingness claims include production, survival, discovery, retention, and
  coding where relevant;
- causal claims state estimand, population, timing, identification assumptions,
  and negative/alternative-channel tests;
- forecasting claims use frozen time/place/lineage holdouts with simple
  baselines and calibrated intervals; and
- at least two engineered task families reproduce the gain prospectively.

Kill, merge, or narrow it when:

- a stock-flow, state-space, survival, or time-series baseline matches it;
- age, period, and cohort are reported as separately identified without
  substantive restrictions;
- demographic transition is treated as an inevitable maturity ladder;
- net migration is interpreted without gross flows and selection;
- network correlation is called contagion;
- a fitted S-curve or threshold is presented as a mechanism;
- collapse is one retrospectively chosen scalar;
- recovery of count is confused with recovery of function or identity;
- missing-at-random is asserted because the cause of loss is unknown;
- a historical instrument lacks a credible exclusion/measurement audit;
- persistence is called path dependence without reinforcement and an
  alternative path; or
- a hindcast repeatedly tuned after failure is presented as a prediction.

## Temporary claim ledger

These identifiers are audit-local. Status labels apply only to the bounded
statement.

| ID | Temporary claim | Status | Assumption or decisive boundary |
| --- | --- | --- | --- |
| QHD-01 | Age, period, and cohort linear components are not uniquely identified because cohort equals period minus age. | established formal | Extra data do not remove exact dependency without external structure. |
| QHD-02 | APC estimators encode identifying constraints or priors even when those constraints are implicit. | established methodological | Nonlinear deviations may still be estimable under declared models. |
| QHD-03 | Leslie matrices correctly propagate age-structured counts under their declared transition rates and interval. | established formal | Forecasting requires rate stability, migration treatment, and uncertainty. |
| QHD-04 | Equal population totals can imply different future paths when age composition differs. | established formal | Requires age/stage-specific transition differences. |
| QHD-05 | Population can continue growing after immediate replacement fertility because of age composition. | established formal/conditional | Momentum value depends on initial stable structure and post-change scenario. |
| QHD-06 | The mortality--fertility--aging sequence is a broad descriptive regularity with heterogeneous timing and mechanisms. | plausible descriptive synthesis | It is not an inevitable stage law. |
| QHD-07 | Working-age composition can affect growth only through complementary employment, health, education, capital, and institutions. | plausible causal family | Aggregate historical regressions do not isolate one universal dividend. |
| QHD-08 | Unified growth models can reproduce broad demographic/economic regimes. | established model capability | Retrospective fit does not establish unique mechanism or prospective skill. |
| QHD-09 | Migrants are commonly selected relative to stayers, biasing naïve destination comparisons. | established causal concern | Direction and magnitude are context-specific. |
| QHD-10 | Refugee dispersal policies can supply quasi-experimental variation in enclave exposure for eligible populations. | established context-bounded design | Later movement, compliance, policy, and external validity remain. |
| QHD-11 | Migration networks may transmit job/task information while creating selection and lock-in. | plausible empirical mechanism | Must separate network effect from mover and destination selection. |
| QHD-12 | Bass/logistic adoption curves do not identify interpersonal influence. | established identification boundary | Many generative mechanisms yield similar curves. |
| QHD-13 | Similar mean thresholds can generate different aggregate outcomes when threshold distributions differ. | established formal | Thresholds and exposure are not automatically observed. |
| QHD-14 | Clustered reinforcement increased adoption in Centola's bounded online experiment. | established context-bounded experiment | Does not generalize to all behaviors, networks, or truth. |
| QHD-15 | Homophily and contagion are generically confounded in unrestricted observational network settings. | established formal/methodological | Identification needs experiment or strong substantive assumptions. |
| QHD-16 | A high-variance first component in coded historical data establishes covariance, not a universal causal complexity ladder. | established statistical boundary | Coding, scale, missingness, and sampling determine the component. |
| QHD-17 | Seshat demonstrates feasibility of provenance-rich comparative quantitative history. | established infrastructure result | Database size does not remove construct and selection uncertainty. |
| QHD-18 | Chronological alignment of climate and political change supports but does not alone identify a collapse mechanism. | established causal boundary | Lead/lag, common causes, mediation, migration, and record survival matter. |
| QHD-19 | Large urban systems can recover relative size after severe temporary shocks in some settings. | established context-bounded empirical | Recovery is not universal and may reflect fundamentals and reconstruction. |
| QHD-20 | Collapse and recovery require a declared vector of population, service, authority, network, governance, reserve, and identity outcomes. | proposed measurement criterion | Weighting them into one index is normative/model-specific. |
| QHD-21 | Persistence is insufficient evidence of path dependence. | established conceptual boundary | A branching counterfactual and reinforcement mechanism are required. |
| QHD-22 | Long-run historical exposure can plausibly affect current outcomes through multiple institutional, cultural, and network channels. | plausible causal family | Each study needs design-specific identification and mediation audit. |
| QHD-23 | Historical records are selected by production, survival, discovery, retention, and coding. | established observation model | Factor probabilities are rarely independent or fully known. |
| QHD-24 | Taphonomic loss can make recent archaeological material overrepresented. | established empirical mechanism | Correction form is material, environment, and context specific. |
| QHD-25 | Unrestricted MNAR missingness is not recoverable from observed data alone. | established statistical boundary | Selection/measurement assumptions or external data are necessary. |
| QHD-26 | Long-run IV estimates depend on relevance, exclusion, independence, measurement, and population assumptions. | established causal boundary | Historical narrative cannot substitute for these. |
| QHD-27 | Retrospective fit and random-row validation overstate forecasting evidence under temporal/spatial dependence. | established evaluation boundary | Use rolling, place/lineage, vintage, and live holdouts. |
| QHD-28 | A cohort-aware versioned observation contract may reduce false historical narratives in evolving AI systems. | speculative integration | Must beat the null stack in experiments A--I. |

## Audit-local bibliography (BibTeX)

```bibtex
@article{mason1973cohort,
  author = {Mason, Karen Oppenheim and Mason, William M. and Winsborough, Halliman H. and Poole, W. Kenneth},
  title = {Some Methodological Issues in Cohort Analysis of Archival Data},
  journal = {American Sociological Review},
  year = {1973},
  volume = {38},
  number = {2},
  pages = {242--258},
  doi = {10.2307/2094398},
  url = {https://doi.org/10.2307/2094398}
}

@article{bell2013impossibility,
  author = {Bell, Andrew and Jones, Kelvyn},
  title = {The Impossibility of Separating Age, Period and Cohort Effects},
  journal = {Social Science \& Medicine},
  year = {2013},
  volume = {93},
  pages = {163--165},
  doi = {10.1016/j.socscimed.2013.04.029},
  url = {https://doi.org/10.1016/j.socscimed.2013.04.029}
}

@article{leslie1945matrices,
  author = {Leslie, P. H.},
  title = {On the Use of Matrices in Certain Population Mathematics},
  journal = {Biometrika},
  year = {1945},
  volume = {33},
  number = {3},
  pages = {183--212},
  doi = {10.1093/biomet/33.3.183},
  url = {https://doi.org/10.1093/biomet/33.3.183}
}

@article{keyfitz1971momentum,
  author = {Keyfitz, Nathan},
  title = {On the Momentum of Population Growth},
  journal = {Demography},
  year = {1971},
  volume = {8},
  number = {1},
  pages = {71--80},
  doi = {10.2307/2060339},
  url = {https://doi.org/10.2307/2060339}
}

@article{lee2003transition,
  author = {Lee, Ronald},
  title = {The Demographic Transition: Three Centuries of Fundamental Change},
  journal = {Journal of Economic Perspectives},
  year = {2003},
  volume = {17},
  number = {4},
  pages = {167--190},
  doi = {10.1257/089533003772034943},
  url = {https://doi.org/10.1257/089533003772034943}
}

@article{galor2000population,
  author = {Galor, Oded and Weil, David N.},
  title = {Population, Technology, and Growth: From Malthusian Stagnation to the Demographic Transition and Beyond},
  journal = {American Economic Review},
  year = {2000},
  volume = {90},
  number = {4},
  pages = {806--828},
  doi = {10.1257/aer.90.4.806},
  url = {https://doi.org/10.1257/aer.90.4.806}
}

@article{bloom1998transitions,
  author = {Bloom, David E. and Williamson, Jeffrey G.},
  title = {Demographic Transitions and Economic Miracles in Emerging Asia},
  journal = {The World Bank Economic Review},
  year = {1998},
  volume = {12},
  number = {3},
  pages = {419--455},
  doi = {10.1093/wber/12.3.419},
  url = {https://doi.org/10.1093/wber/12.3.419}
}

@article{sjaastad1962migration,
  author = {Sjaastad, Larry A.},
  title = {The Costs and Returns of Human Migration},
  journal = {Journal of Political Economy},
  year = {1962},
  volume = {70},
  number = {5, Part 2},
  pages = {80--93},
  doi = {10.1086/258726},
  url = {https://doi.org/10.1086/258726}
}

@article{edin2003enclaves,
  author = {Edin, Per-Anders and Fredriksson, Peter and {\AA}slund, Olof},
  title = {Ethnic Enclaves and the Economic Success of Immigrants---Evidence from a Natural Experiment},
  journal = {The Quarterly Journal of Economics},
  year = {2003},
  volume = {118},
  number = {1},
  pages = {329--357},
  doi = {10.1162/00335530360535225},
  url = {https://doi.org/10.1162/00335530360535225}
}

@article{damm2009enclaves,
  author = {Damm, Anna Piil},
  title = {Ethnic Enclaves and Immigrant Labor Market Outcomes: Quasi-Experimental Evidence},
  journal = {Journal of Labor Economics},
  year = {2009},
  volume = {27},
  number = {2},
  pages = {281--314},
  doi = {10.1086/599336},
  url = {https://doi.org/10.1086/599336}
}

@article{bass1969growth,
  author = {Bass, Frank M.},
  title = {A New Product Growth for Model Consumer Durables},
  journal = {Management Science},
  year = {1969},
  volume = {15},
  number = {5},
  pages = {215--227},
  doi = {10.1287/mnsc.15.5.215},
  url = {https://doi.org/10.1287/mnsc.15.5.215}
}

@article{granovetter1978threshold,
  author = {Granovetter, Mark},
  title = {Threshold Models of Collective Behavior},
  journal = {American Journal of Sociology},
  year = {1978},
  volume = {83},
  number = {6},
  pages = {1420--1443},
  doi = {10.1086/226707},
  url = {https://doi.org/10.1086/226707}
}

@article{centola2010spread,
  author = {Centola, Damon},
  title = {The Spread of Behavior in an Online Social Network Experiment},
  journal = {Science},
  year = {2010},
  volume = {329},
  number = {5996},
  pages = {1194--1197},
  doi = {10.1126/science.1185231},
  url = {https://doi.org/10.1126/science.1185231}
}

@article{shalizi2011homophily,
  author = {Shalizi, Cosma Rohilla and Thomas, Andrew C.},
  title = {Homophily and Contagion Are Generically Confounded in Observational Social Network Studies},
  journal = {Sociological Methods \& Research},
  year = {2011},
  volume = {40},
  number = {2},
  pages = {211--239},
  doi = {10.1177/0049124111404820},
  url = {https://doi.org/10.1177/0049124111404820}
}

@article{turchin2018complexity,
  author = {Turchin, Peter and Currie, Thomas E. and Whitehouse, Harvey and Fran{\c{c}}ois, Pieter and Feeney, Kevin and Mullins, Daniel and Hoyer, Daniel and Collins, Christina and Grohmann, Stephanie and Savage, Patrick and Mendel-Gleason, Gavin and Turner, Edward A. L. and Dupeyron, Agathe and Cioni, Enrico and Reddish, Jenny and Levine, Jill and Jordan, Greine and Brandl, Eva and Williams, Alice and Cesaretti, Rudolf and Krueger, Mark and Ceccarelli, Alessio and Figliulo-Rosswurm, Jay and Tuan, Po-Ju and Peregrine, Peter and Marciniak, Arkadiusz and Preiser-Kapeller, Johannes and Kradin, Nikolay and Korotayev, Andrey and Palmisano, Alessio and Baker, David and Bidmead, Julye and Bol, Peter and Christian, David and Cook, Conor and Covey, Alan and Feinman, Gary and J{\'u}lio, Armin and Kintigh, Keith and Larson, Jennifer and Mair, Victor and Manning, Joseph and McMahon, Andrew and Motta, Laura and Petrie, Cameron and Rudiak-Gould, Peter and Spinney, Luke and Spencer, Charles},
  title = {Quantitative Historical Analysis Uncovers a Single Dimension of Complexity That Structures Global Variation in Human Social Organization},
  journal = {Proceedings of the National Academy of Sciences},
  year = {2018},
  volume = {115},
  number = {2},
  pages = {E144--E151},
  doi = {10.1073/pnas.1708800115},
  url = {https://doi.org/10.1073/pnas.1708800115}
}

@article{turchin2013war,
  author = {Turchin, Peter and Currie, Thomas E. and Turner, Edward A. L. and Gavrilets, Sergey},
  title = {War, Space, and the Evolution of Old World Complex Societies},
  journal = {Proceedings of the National Academy of Sciences},
  year = {2013},
  volume = {110},
  number = {41},
  pages = {16384--16389},
  doi = {10.1073/pnas.1308825110},
  url = {https://doi.org/10.1073/pnas.1308825110}
}

@article{kennett2012maya,
  author = {Kennett, Douglas J. and Breitenbach, Sebastian F. M. and Aquino, Valorie V. and Asmerom, Yemane and Awe, Jaime and Baldini, James U. L. and Bartlein, Patrick and Culleton, Brendan J. and Ebert, Claire and Jazwa, Christopher and Macri, Martha J. and Marwan, Norbert and Polyak, Victor and Prufer, Keith M. and Ridley, Harriet E. and Sodemann, Harald and Winterhalder, Bruce and Haug, Gerald H.},
  title = {Development and Disintegration of Maya Political Systems in Response to Climate Change},
  journal = {Science},
  year = {2012},
  volume = {338},
  number = {6108},
  pages = {788--791},
  doi = {10.1126/science.1226299},
  url = {https://doi.org/10.1126/science.1226299}
}

@article{davis2002bones,
  author = {Davis, Donald R. and Weinstein, David E.},
  title = {Bones, Bombs, and Break Points: The Geography of Economic Activity},
  journal = {American Economic Review},
  year = {2002},
  volume = {92},
  number = {5},
  pages = {1269--1289},
  doi = {10.1257/000282802762024502},
  url = {https://doi.org/10.1257/000282802762024502}
}

@article{nunn2008slave,
  author = {Nunn, Nathan},
  title = {The Long-Term Effects of Africa's Slave Trades},
  journal = {The Quarterly Journal of Economics},
  year = {2008},
  volume = {123},
  number = {1},
  pages = {139--176},
  doi = {10.1162/qjec.2008.123.1.139},
  url = {https://doi.org/10.1162/qjec.2008.123.1.139}
}

@article{rubin1976missing,
  author = {Rubin, Donald B.},
  title = {Inference and Missing Data},
  journal = {Biometrika},
  year = {1976},
  volume = {63},
  number = {3},
  pages = {581--592},
  doi = {10.1093/biomet/63.3.581},
  url = {https://doi.org/10.1093/biomet/63.3.581}
}

@article{heckman1979selection,
  author = {Heckman, James J.},
  title = {Sample Selection Bias as a Specification Error},
  journal = {Econometrica},
  year = {1979},
  volume = {47},
  number = {1},
  pages = {153--161},
  doi = {10.2307/1912352},
  url = {https://doi.org/10.2307/1912352}
}

@article{surovell2009taphonomic,
  author = {Surovell, Todd A. and Finley, Judson Byrd and Smith, Geoffrey M. and Brantingham, P. Jeffrey and Kelly, Robert},
  title = {Correcting Temporal Frequency Distributions for Taphonomic Bias},
  journal = {Journal of Archaeological Science},
  year = {2009},
  volume = {36},
  number = {8},
  pages = {1715--1724},
  doi = {10.1016/j.jas.2009.03.029},
  url = {https://doi.org/10.1016/j.jas.2009.03.029}
}

@article{acemoglu2001colonial,
  author = {Acemoglu, Daron and Johnson, Simon and Robinson, James A.},
  title = {The Colonial Origins of Comparative Development: An Empirical Investigation},
  journal = {American Economic Review},
  year = {2001},
  volume = {91},
  number = {5},
  pages = {1369--1401},
  doi = {10.1257/aer.91.5.1369},
  url = {https://doi.org/10.1257/aer.91.5.1369}
}

@article{albouy2012colonial,
  author = {Albouy, David Y.},
  title = {The Colonial Origins of Comparative Development: An Empirical Investigation: Comment},
  journal = {American Economic Review},
  year = {2012},
  volume = {102},
  number = {6},
  pages = {3059--3076},
  doi = {10.1257/aer.102.6.3059},
  url = {https://doi.org/10.1257/aer.102.6.3059}
}

@article{stone1974crossvalidation,
  author = {Stone, M.},
  title = {Cross-Validatory Choice and Assessment of Statistical Predictions},
  journal = {Journal of the Royal Statistical Society: Series B (Methodological)},
  year = {1974},
  volume = {36},
  number = {2},
  pages = {111--133},
  doi = {10.1111/j.2517-6161.1974.tb00994.x},
  url = {https://doi.org/10.1111/j.2517-6161.1974.tb00994.x}
}

@article{makridakis2020m4,
  author = {Makridakis, Spyros and Spiliotis, Evangelos and Assimakopoulos, Vassilios},
  title = {The M4 Competition: 100,000 Time Series and 61 Forecasting Methods},
  journal = {International Journal of Forecasting},
  year = {2020},
  volume = {36},
  number = {1},
  pages = {54--74},
  doi = {10.1016/j.ijforecast.2019.04.014},
  url = {https://doi.org/10.1016/j.ijforecast.2019.04.014}
}
```

## Final deduplication decision

Do not add “demographic intelligence,” “civilizational lifecycle,”
“institutional contagion,” “population momentum,” “collapse sensing,” or
“cliodynamic prediction” as free-standing principles. Route evidence to the
specific mechanism: composition-aware flow, transition matrix, cohort exposure,
selection into movement, peer exposure, common cause, record survival,
functional degradation, restoring dynamics, path reinforcement, causal design,
or prospective forecast.

The durable lesson is epistemic: engineered systems also have cohorts,
migration, selected survivors, missing histories, delayed stock effects, and
tempting retrospective stories. The architecture should preserve enough
lineage and observation structure to test those stories—and enough humility to
say when the past cannot identify or predict the requested future.

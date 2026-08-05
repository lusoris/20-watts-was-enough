# Primary-source audit: social choice and institutional governance

**Audit date:** 2026-08-05

**Scope:** preference aggregation, strategic voting, delegable proxy voting,
decentralization and polycentricity, veto players and minority protection,
collective action and public goods, agenda control, regulatory capture,
constitutional amendment, participation and perceived legitimacy, and
institutional path dependence

**Ledger status:** candidate evidence only; every SCI-* identifier is local to
this audit and must not be cited as a repository claim

**Purpose:** identify formal constraints, empirically bounded institutional
mechanisms, and genuinely testable AI translations without treating political
institutions as decorative metaphors or allowing a theorem to choose a
normative objective

## Executive finding

This audit does **not** justify a new stable principle. Its strongest result is
a set of design constraints and a held integration hypothesis.

Social-choice theorems show that attractive guarantees cannot always coexist
under stated domains, outcome spaces, and behavioral assumptions. They do not
prove that collective choice is futile, identify the morally correct
aggregation rule, or imply that a machine-learning ensemble contains citizens.
Political institutions can expose information, distribute authority, protect
specified interests, make decisions contestable, and constrain capture. They
also create delay, duplicated work, agenda power, concentration, participation
cost, and lock-in. Whether any trade is acceptable is partly empirical and
partly normative; no accuracy, welfare, amendment-rate, or satisfaction metric
settles both parts.

The held integration hypothesis is a **constitutionalized, multi-level control
plane**:

- authority is local and scoped until a declared exception or spillover
  requires escalation;
- protected invariants and appeal paths are explicit rather than inferred from
  aggregate reward;
- proposals, agendas, reasons, conflicts of interest, votes, decisions, and
  amendments have versioned public lineage;
- vetoes are typed by scope, severity, evidence, deadline, and override rule;
- participation and delegation are revocable, audited, and protected against
  cycles and concentration;
- emergency authority expires and returns control through a checked handoff;
- institutional rules have ordinary amendment, urgent amendment, rollback,
  review, and retirement paths; and
- capture, exclusion, gridlock, policy churn, and participation burden are
  measured as costs rather than hidden by a success scalar.

That composition is already covered by
[P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation),
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection),
[P-008](../principle-registry.md#p-008--compartmentalized-interaction),
[P-009](../principle-registry.md#p-009--maintenance-plane),
[P-011](../principle-registry.md#p-011--transient-communication-coalitions), and
[P-013](../principle-registry.md#p-013--externalized-shared-state). It also
overlaps Candidate
[008](../../experiments/candidates/008-contestable-modular-allocation.md),
[011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
[012](../../experiments/candidates/012-latency-qualified-authority.md),
[015](../../experiments/candidates/015-versioned-repairable-conventions.md), and
[016](../../experiments/candidates/016-conflict-bounded-unit-transition.md).
Governance evidence should refine their threat models and tests, not create an
unfalsifiable “democratic AI” layer.

The strongest conventional null is ordinary systems engineering: one declared
objective, typed permissions and interfaces, a deterministic or learned
allocator, policy-as-code, review gates, append-only logs, runtime assurance,
and mature incident/change management. If modules share the same objective,
cannot strategically benefit from a report, have no morally relevant standing,
and operate under one authorized owner, this null should win.

## Three layers that must never be collapsed

| Layer | What it can establish | What it cannot establish | Required repository treatment |
| --- | --- | --- | --- |
| Formal | an implication or impossibility under explicit axioms, domain, outcome space, information, and equilibrium concept | empirical frequency, computational ease, legitimacy, justice, or the right objective | record the theorem assumptions beside every translation |
| Empirical | an estimated effect or association in a population, institution, treatment, period, and outcome measure | universal transfer, moral legitimacy, or an unmeasured counterfactual | preserve design, units, uncertainty, interference, attrition, and external-validity limits |
| Normative | a declared commitment about standing, rights, acceptable harm, distribution, procedure, or authority | a theorem-like prediction of performance | treat as an authorized design input, not as evidence extracted from behavior |

The following are **normative choices** even when encoded numerically:
who counts as a participant; which preferences may be aggregated; which
interests are protected against a majority; whether utilities are comparable;
how present and future interests are weighted; which harms are non-tradable;
who may amend the rules; when emergency override is legitimate; and what makes
a procedure legitimate. Human authorization is required for these choices.

The following are **empirical or formal performance questions**: cycle
frequency, manipulation opportunity, error under a truth-tracking model,
delegation concentration, response latency, spillover loss, public-goods
provision, veto-induced policy stability, capture indicators, amendment rate,
rule churn, participation burden, perceived legitimacy, compliance, and
recovery after change. Evidence about them can inform but cannot replace the
normative layer.

## Applicability gate for AI

Do not import a political institution unless the engineered system has the
corresponding problem.

| Political construct | Necessary AI analogue | Non-applicable case |
| --- | --- | --- |
| voter preference | persistent, behaviorally relevant ordering over feasible outcomes | modules emit noisy scores but share one loss |
| strategic vote/report | an agent can improve its own future state by misreporting | reports have no local consequence and are directly verified |
| political right | an externally authorized constraint or standing that aggregate reward may not override | a heuristic preference invented by the model designer |
| delegation | revocable transfer of decision weight to an identifiable proxy | ordinary routing to the highest predicted expert |
| constituency | a defined set of interests, tasks, owners, or affected parties represented by an agent | arbitrary cluster labels |
| federalism/polycentricity | overlapping or nested centers with scoped authority and spillovers | sharding or microservices under one complete controller |
| veto | power to block a class of state transitions despite aggregate support | a safety predicate that simply removes infeasible actions |
| agenda setter | actor that controls which alternatives reach comparison and in what order | a fixed exhaustive search over all feasible alternatives |
| capture | durable diversion of an institution from its authorized purpose through asymmetric influence | any disagreement with the designer |
| constitution | higher-order rules constraining ordinary rule changes | a configuration file with unrestricted administrator overwrite |
| legitimacy | an authorized normative relation, or a separately measured perception/acceptance construct | model confidence or user-click rate |
| path dependence | sequence-sensitive reinforcement with a specified mechanism and credible counterfactual | mere persistence or warm-start dependence |

If the right column describes the system, use optimization, control, IAM,
workflow, or ordinary evaluation. The political vocabulary adds no mechanism.

## Common notation, dimensions, and accounting

Let $N=\{1,\ldots,n\}$ denote participants or persistent modules, $X$ a finite
set of at least three feasible alternatives unless a subsection states a
binary domain, and $R_i$ participant $i$'s complete and transitive ranking on
$X$. A social-welfare function is

$$
F:\mathcal R^n\rightarrow\mathcal R,
$$

where rankings and ordinal positions are dimensionless. For pairwise majority,

$$
x\succ_M y
\quad\Longleftrightarrow\quad
\sum_{i=1}^{n}\mathbf 1[x\succ_i y]>\frac n2.
$$

The indicator and count are dimensionless. With at least three alternatives,
the majority relation can cycle even when every $R_i$ is transitive.

Engineering comparisons use a vector rather than a hidden scalar:

$$
\mathbf z=
\left(
Q,\ E,\ T,\ B,\ H_{\max},\ G,\ C,\ R,\ U
\right),
$$

where $Q$ is task quality in a declared task unit, $E$ energy in joules, $T$
latency in seconds, $B$ communication in bytes, $H_{\max}$ worst protected-
group loss in the task's native unit, $G$ gridlock or unresolved-decision time
in seconds, $C$ capture or influence diagnostics in declared dimensionless
indices, $R$ rule churn in changes per $10^3$ episodes, and $U$ human oversight
in person-minutes. No addition across these terms is valid without declared
conversion weights and sensitivity analysis.

For public-goods experiments, participant $i$ begins with endowment $e_i$,
contributes $c_i$, and receives

$$
\pi_i=e_i-c_i+\frac r n\sum_{j=1}^{n}c_j-k_i-f_i.
$$

$e_i,c_i,k_i,f_i,$ and $\pi_i$ use the same currency per round; $r$ is a
dimensionless group multiplier. The standard social-dilemma region
$1<r<n$ makes total contribution efficient while private marginal return
$r/n<1$. $k_i$ is monitoring or sanction cost and $f_i$ is a received fine.
This equation does not describe moral obligation.

## Audit map and deduplication

| Family | Exact question | Evidence type | Existing home | Disposition |
| --- | --- | --- | --- | --- |
| Arrow/May aggregation | which aggregation guarantees coexist on which domain? | theorem | P-013 for declared shared state; communication audit for semantics | constraint only |
| Gibbard--Satterthwaite | can deterministic unrestricted choice be dominant-strategy truthful? | theorem | Candidate 008 threat model | no new principle |
| delegable proxy | can decision weight follow expertise without cycles, concentration, or error amplification? | formal models | P-001/P-011/P-013; Candidates 008/015 | experiment factor |
| decentralization/polycentricity | when does local information outweigh coordination, duplication, spillover, and local capture? | theory plus bounded quasi-experiment | P-002/P-008/P-009 | no new principle |
| veto/minority protection | when does blocking authority prevent severe harm rather than freeze adaptation? | formal/comparative plus field experiment on representation | P-004/P-008/P-009; Candidates 011/012 | experiment factor |
| collective action | what supports costly contribution under strategic temptation? | laboratory experiment and formal payoff model | economics audit; P-006/P-009/P-013; Candidate 016 | deduplicate |
| agenda power | how do proposal set, order, and status quo change outcomes? | theorem/formal model | P-001/P-013; communication audit | threat model |
| regulatory capture | when do access, expertise, dependence, or rewards divert an evaluator/allocator? | political-economy theory plus observational evidence | economics and security audits; Candidate 008 | threat model |
| constitutional change | how do rules balance stability, repair, and capture of amendment? | comparative observational evidence | P-009/P-013; Candidates 011/015 | lifecycle factor |
| legitimacy/participation | what changes knowledge, satisfaction, acceptance, inclusion, and decisions? | randomized field experiment and deliberative study | P-011/P-013; Candidate 015 | human-system research only unless standing is explicit |
| path dependence | when do increasing returns make order and timing causally consequential? | conceptual mechanism plus regression discontinuity | P-004/P-009/P-013; cultural-evolution audit | lifecycle threat |

## 1. Aggregation: Arrow is a boundary, not a voting-system ranking

**Primary sources.** Arrow proves an impossibility result for social-welfare
functions ([DOI: 10.1086/256963](https://doi.org/10.1086/256963)). May
characterizes simple majority in a binary-choice setting
([DOI: 10.2307/1907651](https://doi.org/10.2307/1907651)).

**Exact problem.** Aggregate individual ordinal rankings into a complete and
transitive social ranking. Arrow's domain contains at least three alternatives.
The familiar theorem combines unrestricted admissible preference profiles,
weak Pareto/unanimity, independence of irrelevant alternatives,
non-dictatorship, and a rational collective ordering. No social-welfare
function satisfies all of those conditions together.

**Assumption boundary.** This is not “majority voting always fails.” Restricted
preference domains, cardinal or interpersonally comparable information,
randomization, incomplete collective relations, deliberation that changes
preferences, or relaxing another axiom changes the result. May's result is a
separate possibility result: on two alternatives, majority is characterized
by symmetry/anonymity, neutrality, and positive responsiveness under its
decision conditions. It must not be generalized to three or more alternatives.

**Mechanism and information path.** Aggregation discards some structure in
individual rankings. Pairwise majority can retain local comparisons yet
produce a Condorcet cycle. Scoring rules make different information and
independence commitments. A learned aggregator similarly embeds a rule about
which profile changes may affect which outcome.

**Evidence status.** Established formal results under stated axioms. Neither
result is an empirical estimate of election quality or a moral endorsement.

**AI translation.** Use the theorem as an API review: declare the outcome
space, admissible preference domain, what each “voter” observes, which
invariances the aggregator promises, and whether abstention/incomparability is
allowed. A mixture-of-experts gate combining calibrated predictions is not a
social-welfare function unless experts possess distinct persistent orderings.

**Failure boundary.** A global ranking can hide a cycle, a protected interest,
or dependence on excluded alternatives. Conversely, an explicit scalar loss
already supplies cardinal structure excluded from Arrow's setup; invoking the
theorem there can be a category error.

**Strongest null.** Direct constrained optimization over task-native outcomes,
with Pareto-front reporting and sensitivity analysis when objectives conflict.
Use majority only when the binary decision and standing of voters are actually
defined.

**Deduplication.** Shared preference/profile state belongs to P-013; typed
communication and semantic repair remain in the communication audit and
Candidate 015. There is no “collective intelligence through voting” principle.

## 2. Strategic choice: manipulability is existential, not ubiquitous

**Primary sources.** Gibbard's general result
([DOI: 10.2307/1914083](https://doi.org/10.2307/1914083)) and Satterthwaite's
existence/correspondence results
([DOI: 10.1016/0022-0531(75)90050-2](https://doi.org/10.1016/0022-0531(75)90050-2))
establish the deterministic social-choice boundary usually called the
Gibbard--Satterthwaite theorem.

For a single-winner rule $f$ and true ranking $R_i$, dominant-strategy
truthfulness requires

$$
f(R_i,R_{-i})\succeq_i f(R'_i,R_{-i})
$$

for every participant $i$, profile $R_{-i}$, and permitted misreport $R'_i$.
Under at least three possible outcomes, unrestricted strict preferences, a
non-imposed/surjective or unanimity condition, and deterministic choice, a
strategy-proof rule is dictatorial.

**What follows.** For every non-dictatorial rule in this class there exists a
profile and participant with a profitable misreport. The result does **not**
say that every election is manipulable by every voter, that manipulation is
easy to discover, that voters know others' preferences, or that every
randomized/restricted-domain mechanism has the same property.

**AI translation.** The theorem matters only if persistent modules have local
interests or selection pressures, reports influence an allocation, and a
misreport can improve future traffic, budget, survival, or reward. That is
exactly Candidate 008's applicability gate. When modules are cooperative and
router-visible, calibration plus constrained optimization is the stronger
null.

**Failure boundary.** Treating adversarial examples, ordinary prediction
error, or stochastic router variance as “strategic voting” confuses error with
incentive. Strategy-proofness also does not protect against false identities,
collusion, corrupt agenda setters, or an incorrect objective.

**Measurable prediction.** Under a constructed hidden-interest environment,
the gap between truthful and best-response reporting should grow with report
influence and persistent reward stakes. Under shared loss and direct
verification, it should vanish apart from estimation noise.

**Deduplication.** This is a threat model for Candidate 008 and the economics
audit, not a new control mechanism.

## 3. Rights and aggregation: Sen exposes a conflict but cannot specify rights

**Primary source.** Sen's “Paretian liberal” result
([DOI: 10.1086/259614](https://doi.org/10.1086/259614)) shows an incompatibility
between unrestricted preferences, a weak Pareto condition, and a minimal
liberty condition assigning decisive control over at least one pair of social
states to each of at least two individuals.

**Formal meaning.** Minimal protected decisiveness over personal domains can
conflict with unanimous preferences once individual rankings contain
external-regarding preferences. The result does not prove that rights are
impossible. It shows that a particular aggregation domain, Pareto requirement,
and formal rights condition cannot all be guaranteed simultaneously.

**Normative boundary.** The theorem cannot decide what a right is, who holds
one, whether some preferences are inadmissible, or how rights interact with
harm. Those are constitutional inputs. An AI system must not infer “minority
rights” from subgroup loss alone without human authorization and a defined
protected interest.

**AI translation.** Separate hard constraints and appealable rights from
aggregate objective scores. Record any override and its authority. This maps
to P-004 for protected diversity, P-008 for bounded interfaces, P-009 for
oversight, and P-013 for decision lineage.

**Failure boundary.** A veto attached to every local preference can destroy
feasibility; a rights label attached only after a bad outcome is not an
ex-ante constraint. “Pareto improvement” is also undefined without the
affected parties and their relevant ordering.

**Strongest null.** Explicit constrained optimization with authorized
non-tradable constraints, an infeasibility report, and a human escalation path.

## 4. Delegation and liquid democracy

**Primary sources.** Christoff and Grossi formally analyze binary voting with
delegable proxy and expose delegation cycles, collective abstention, and
inconsistency across logically connected propositions
([DOI: 10.4204/EPTCS.251.10](https://doi.org/10.4204/EPTCS.251.10)). Kahng,
Mackenzie, and Procaccia study truth tracking in a binary correct/incorrect
model and show that local delegation mechanisms cannot be guaranteed to
outperform direct voting even under favorable competence-directed delegation;
their non-local mechanism obtains stronger results under the model
([DOI: 10.1609/aaai.v32i1.11468](https://doi.org/10.1609/aaai.v32i1.11468)).

Represent delegation by a directed partial function

$$
d:V\rightarrow V\cup\{\text{yes},\text{no},\text{abstain}\}.
$$

If iterating $d$ reaches guru $g$, its voting weight is

$$
w_g=\left|\{i\in V:d^*(i)=g\}\right|.
$$

Counts and weights are dimensionless. A cycle has no guru unless the
constitution supplies a cycle-resolution rule.

**Exact problem.** Move decision weight toward expertise while retaining the
option of direct choice and revocation. The mechanism needs identity,
topic/scope, lineage, expiry, cycle handling, and a rule for proxy failure.

**Evidence status.** Formal/algorithmic. The truth-tracking objective assumes a
binary fact with participant competence; it is not a legitimacy model and does
not apply to distributive or value conflict.

**Efficiency mechanism.** Delegation may aggregate dispersed knowledge without
requiring every participant to evaluate every issue. It can also form transient
expert coalitions, matching P-011.

**Failure boundaries.**

- delegations cycle, terminate at abstention, or become stale;
- weight concentrates into super-proxies and can amplify one compromised node;
- correlated information violates independence intuitions;
- expertise is topic- and time-specific, while reputation becomes a generic
  authority token;
- revocation arrives after an irreversible action;
- chains obscure accountability and increase verification cost; and
- coercion, bribery, identity reset, or collusion are outside clean models.

**Strongest null.** A calibrated router that directly estimates competence per
task, with uncertainty, diversity constraints, fixed authority caps, and no
delegated political weight.

**Residual experiment.** Compare direct prediction, competence routing,
revocable proxy delegation, and a non-local optimized delegation rule under
equal observation, messages, compute, verification, and identity budgets.
Measure truth-tracking error, weight concentration (Herfindahl index),
unresolved-cycle rate, revocation latency in seconds, correlated-error loss,
and audit cost. Any legitimacy claim remains out of scope.

**Deduplication.** Routing is P-001; protected entrant diversity is P-004;
temporary coalitions are P-011; delegation graphs and revocations are P-013;
semantic scope belongs to Candidate 015. No standalone delegation principle.

## 5. Federalism, decentralization, and polycentricity

**Primary sources.** Ostrom, Tiebout, and Warren define a polycentric
metropolitan order as multiple formally independent decision centers that can
nevertheless interact coherently
([DOI: 10.2307/1952530](https://doi.org/10.2307/1952530)). This is a theoretical
inquiry, not proof that multiplicity always works. Faguet studies Bolivia's
1994 decentralization and reports shifts in municipal investment associated
with objective local needs, including prioritization by poorer and smaller
municipalities
([DOI: 10.1016/S0047-2727(02)00185-8](https://doi.org/10.1016/S0047-2727(02)00185-8)).

**Exact problem.** Allocate authority across levels when local units possess
information and face heterogeneous needs, but actions create cross-boundary
spillovers and scale economies.

A complete engineering cost ledger can be written

$$
J_{\mathrm{gov}}=
J_{\mathrm{task}}+
J_{\mathrm{coord}}+
J_{\mathrm{dup}}+
J_{\mathrm{spill}}+
J_{\mathrm{capture}}+
J_{\mathrm{switch}},
$$

with every term measured in joules, seconds, task-native loss, or converted
through explicitly declared weights. The sum is invalid if heterogeneous units
are left unconverted.

**Efficiency mechanism.** Local authority can exploit local state and shorten
control paths; overlapping centers can offer alternative service paths and
contain some failures. Higher levels can coordinate shared constraints,
redistribute capacity, and internalize spillovers.

**Evidence status.** Foundational theory plus a bounded country reform study.
The Bolivia evidence does not establish a universal decentralization effect;
assignment was institutional, outcomes were historically situated, and local
capacity/capture vary.

**Failure boundaries.**

- duplicated models, monitors, and data stores consume the claimed efficiency;
- a local action exports risk to other units;
- local elites or dominant modules capture the small center;
- inequitable initial capacity makes “local autonomy” reproduce inequality;
- overlapping authority produces forum shopping or contradictory commands;
- cross-unit crises outrun negotiation; and
- centralization can be superior under high common-mode coupling, strong scale
  economies, or a reliable global state estimator.

**Strongest null.** Hierarchical sharding with static typed ownership, a global
constraint solver, and ordinary incident escalation.

**Measurable prediction.** Polycentric control should improve response latency
and local fit only in regimes with informative local state and bounded
spillovers. Its advantage should reverse as cross-unit coupling, common-mode
risk, or coordination cost rises.

**Deduplication.** The residue is already P-002 plus P-008 and P-009. Emergency
authority is Candidate 012; live coordination and learning are Candidate 011.

## 6. Veto players, representation, and minority protection

**Primary sources.** Tsebelis formalizes veto players whose agreement is
required for policy change and predicts greater policy stability as the number
and ideological distance of relevant veto players increase under the model
([DOI: 10.1017/S0007123400007225](https://doi.org/10.1017/S0007123400007225)).
Randomly reserved female village-council leadership in India changed local
public-goods investment toward priorities more often expressed by women
([DOI: 10.1111/j.1468-0262.2004.00539.x](https://doi.org/10.1111/j.1468-0262.2004.00539.x)).
Mandated representation for disadvantaged castes and tribes changed targeted
transfers in Indian states
([DOI: 10.1257/000282803769206232](https://doi.org/10.1257/000282803769206232)).

For status quo $q$, veto player $k$ accepts proposal $x$ only when
$u_k(x)\ge u_k(q)$. The viable change set is

$$
W(q)=\bigcap_{k=1}^{K}\{x\in X:u_k(x)\ge u_k(q)\}.
$$

Utilities here are model-specific ordinal or cardinal constructs; they carry no
universal unit. A smaller $W(q)$ represents greater policy stability, not
greater welfare, correctness, or justice.

**Exact problem.** Protect a specified interest from a harmful transition or
require cross-perspective agreement before irreversible change.

**Normative boundary.** Which group deserves representation, what constitutes
severe harm, whether a veto is individual or collective, and what can override
it are normative constitutional choices. The Indian field evidence shows
policy effects of representation; it does not prove that one representation
rule is universally just.

**Efficiency mechanism.** An independently held veto can stop a transition
whose harm is invisible to the aggregate evaluator. Descriptive representation
can change which information and priorities reach the agenda.

**Failure boundaries.**

- vetoes protect incumbents or a narrow proxy rather than the intended group;
- multiple vetoes produce gridlock, stale policy, or failure to respond;
- nominally independent veto holders share data, models, incentives, or
  compromise;
- emergency bypass becomes the ordinary path;
- a protected group is internally heterogeneous;
- representation changes allocation but does not itself establish legitimacy;
  and
- the status quo may already impose severe harm.

**Strongest null.** A deterministic safety constraint, subgroup worst-case loss
bound, independent red-team gate, and time-bounded human review. A veto is
useful only if its holder contributes information or standing not captured by
those mechanisms.

**Residual experiment.** Introduce rare transitions that improve mean reward
but impose large loss on a known protected class. Compare scalar optimization,
hard constraints, quorum, independent veto, and veto with evidence/deadline/
appeal/override. At equal review and delay budgets measure severe-harm recall,
false blocks, time to safe change, emergency failure, concentration, and
status-quo harm. The political variant loses if an ordinary guardrail dominates.

**Deduplication.** Protection maps to P-004; veto scope to P-008; oversight and
repair to P-009; evidence lineage to P-013; fast authority to Candidates
011/012.

## 7. Collective action and public goods

**Primary sources.** Andreoni's repeated/restart voluntary-contribution
experiments distinguish learning and strategy in declining contribution
patterns
([DOI: 10.1016/0047-2727(88)90043-6](https://doi.org/10.1016/0047-2727(88)90043-6)).
Isaac, Walker, and Williams vary group size from 4 to 100 in voluntary-
contribution mechanisms and find that larger groups can be more efficient in
their treatments
([DOI: 10.1016/0047-2727(94)90068-X](https://doi.org/10.1016/0047-2727(94)90068-X)).
Ostrom, Walker, and Gardner show that communication and self-designed sanction
arrangements can improve common-pool outcomes in their laboratory environment
([DOI: 10.2307/1964229](https://doi.org/10.2307/1964229)).

**Exact problem.** Individual contribution has private cost while benefits are
partly shared; overuse has private benefit while depletion is shared.

**Evidence status.** Controlled laboratory evidence under specific endowments,
marginal per-capita returns, repetition, communication, identity, and sanction
rules. “More participants always cooperate less,” “communication solves
commons,” and a fixed sanction percentage are unsupported absolutes.

**AI translation.** Persistent modules may underinvest in shared tests,
documentation, maintenance, calibration, or reserve capacity only if selection
pressure gives them a locally advantageous alternative. Shared-loss components
without persistent stakes do not form a commons.

**Efficiency mechanism.** Communication can reveal intended strategies and
conditional cooperation; monitoring and sanctions change payoffs; self-designed
rules may use local knowledge and increase acceptance. All consume resources.

**Failure boundaries.** Cheap-talk agreements can fail, sanctions can be
costly or antisocial, monitoring can be gamed, identity reset defeats
reputation, and contributions can merely follow demand effects or experiment
parameters. Cooperation within a coalition can intensify harm outside it.

**Strongest null.** Central provisioning of shared infrastructure, explicit
budget reservation, contracts/tests required at merge, or a primal--dual
allocator. Candidate 016 applies only if member-level shortcuts and heritable
higher-level performance are explicit.

**Deduplication.** This is already addressed in the
[economics audit](2026-08-05-economics-market-design-incentives.md), P-006,
P-009, P-013, and Candidate 016. Retain the contradictory group-size evidence
as an anti-slogan boundary.

## 8. Agenda power and the status quo

**Primary sources.** McKelvey establishes broad reachability/instability in
multidimensional majority-rule spatial models under generic conditions
([DOI: 10.1016/0022-0531(76)90040-5](https://doi.org/10.1016/0022-0531(76)90040-5)).
Romer and Rosenthal analyze a setter who offers a proposal against a fixed
reversion/status quo
([DOI: 10.1007/BF03187594](https://doi.org/10.1007/BF03187594)).

With decisive voter $m$ and reversion $q$, a simplified setter problem is

$$
\max_{x\in X}u_S(x)
\quad\text{subject to}\quad
u_m(x)\ge u_m(q).
$$

The setter does not need to falsify votes; controlling $X$, proposal order, or
$q$ can change the accepted result.

**Exact problem.** Determine which alternatives become visible, comparable,
and votable, and what happens on rejection. Search and proposal generation are
politically consequential parts of aggregation.

**Evidence status.** Formal. McKelvey's result relies on multidimensional
spatial preferences and generic conditions; it does not imply unlimited agenda
power in every finite, institutionally constrained process.

**AI translation.** A proposal generator, retrieval layer, tool registry, or
router can exercise agenda power by omitting alternatives before evaluation.
An evaluator cannot select an option it never receives. Order can also affect
stateful deliberation and limited-context agents.

**Failure boundaries.** Randomizing order does not recover omitted options;
full enumeration may be infeasible; open proposal rights can create denial of
service; a fixed fallback can be strategically chosen; and a versioned agenda
can be transparent yet still captured.

**Strongest null.** A fixed candidate-generation protocol with coverage tests,
randomized or counterbalanced order, explicit fallback, and independent search
baselines.

**Residual experiment.** Give an agenda setter limited proposal bandwidth and
private alignment pressure. Compare fixed enumeration, one learned generator,
multiple independent generators, contestable proposal admission, and random
order. Hold candidate-generation compute and evaluator calls constant. Measure
best-known option recall, regret, status-quo sensitivity, subgroup max loss,
proposal duplication, and denial-of-service cost.

**Deduplication.** Candidate generation is selective allocation under P-001;
the agenda and reversion state belong to P-013; independent proposal channels
touch P-004/P-011; semantic admissibility belongs to Candidate 015.

## 9. Regulatory capture: influence, expertise, and capture are different

**Primary sources.** Stigler's economic theory treats regulation as a good
sought and supplied through political organization
([DOI: 10.2307/3003160](https://doi.org/10.2307/3003160)). Peltzman formalizes
limits, opposition, and distributional trade-offs in the political market for
regulation
([DOI: 10.1086/466865](https://doi.org/10.1086/466865)). Bertrand, Bombardini,
and Trebbi use U.S. federal lobbying data to distinguish issue expertise from
political connections, finding evidence of both and a more consistent monetary
premium for connections
([DOI: 10.1257/aer.104.12.3885](https://doi.org/10.1257/aer.104.12.3885)).

**Exact problem.** An institution authorized to serve a public or system-level
purpose depends on information, personnel, or political support from affected
participants. Those participants can shape agenda, evidence, enforcement, or
staff incentives toward their own interests.

**Definition boundary.** Contact, lobbying, expertise, industry experience,
high rewards, or a policy favorable to an incumbent is not sufficient evidence
of capture. A capture claim needs:

1. an authorized public/system purpose;
2. a demonstrable divergence from that purpose;
3. an influence mechanism or dependence;
4. plausible counterfactual policy or enforcement; and
5. treatment of legitimate expertise and alternative explanations.

**Evidence status.** Stigler and Peltzman provide political-economy models, not
universal empirical laws. Bertrand and colleagues provide observational
evidence about lobbying connections and expertise, not a direct scalar measure
of “capture.”

**AI translation.** A router, evaluator, safety monitor, or governance module
can become dependent on the specialists it scores: shared training data,
reused graders, concentrated traffic, evaluator fine-tuning by incumbents,
revolving module roles, privileged telemetry, or control of test generation
can all create influence paths.

**Efficiency mechanism of countermeasures.** Separate proposal, execution, and
evaluation; use unpredictable withheld audits; disclose dependency and
conflict graphs; protect entrant trials; rotate some evaluators; retain
independent raw evidence; make sanctions and appeal contestable. Every
countermeasure can discard expertise or add inconsistency.

**Failure boundaries.**

- “independent” evaluators share upstream models, data, vendors, or reward;
- rotation destroys domain memory and increases shallow error;
- disclosure produces records without changing influence;
- protected entrants become Sybil channels;
- randomized audit schedules become predictable;
- adversaries capture amendment and appointment rules; and
- the declared public objective is itself underspecified or illegitimate.

**Strongest null.** Standard separation of duties, IAM, procurement/vendor-risk
controls, conflict disclosure, independent test ownership, randomized
evaluation, and ordinary anomaly detection. Candidate 008 must beat this stack,
not merely an unaudited learned router.

**Measurable prediction.** Under persistent local stakes and asymmetric access,
policy/evaluation drift should correlate with connection paths after
conditioning on measured expertise. With shared loss, transparent data, and
direct outcome verification, special governance should add cost without
benefit.

**Deduplication.** This is the political-institutional version of principal--
agent and Goodhart pressure in the economics audit, collusion/Sybil and
separation-of-duty issues in the security audit, and evaluator independence in
the HRO audit. It strengthens Candidate 008's threat matrix; no new principle.

## 10. Constitutional amendment: stability is not quality

**Primary sources.** Lutz compares amendments across U.S. state constitutions
and 32 national constitutions, relating amendment rate to constitutional
length and formal amendment difficulty
([DOI: 10.2307/2944709](https://doi.org/10.2307/2944709)). Ginsburg and Melton
challenge rule-only measurement and argue that “amendment culture,” proxied
through prior constitutional amendment behavior, explains substantial
cross-national variation
([DOI: 10.1093/icon/mov041](https://doi.org/10.1093/icon/mov041)).

**Exact problem.** Higher-order rules must resist opportunistic ordinary
majorities while remaining repairable under error, environmental change, and
newly recognized harms.

**Evidence status.** Comparative observational studies. Amendment frequency is
not constitutional quality, legitimacy, adaptability, or rights protection.
Formal difficulty, text length, political demand, courts, replacement,
informal change, and inherited practice are endogenous and difficult to
separate.

**AI translation.** Distinguish ordinary parameter update, policy change,
constitutional constraint change, and emergency override. Each needs a version,
proposer, evidence, affected scope, compatibility check, approval threshold,
effective time, rollback path, and scheduled review.

**Lifecycle.**

1. propose with scope, rationale, affected invariants, and alternatives;
2. run adversarial, compatibility, and protected-interest tests;
3. deliberate through a time-bounded, declared agenda;
4. ratify under the rule valid at proposal time;
5. canary or stage where reversibility permits;
6. record dependencies and observed outcomes;
7. roll back or supersede under a predeclared path; and
8. retire emergency clauses automatically unless reauthorized.

**Failure boundaries.**

- excessive rigidity preserves known defects and drives informal bypass;
- excessive flexibility permits incumbent self-dealing and rule churn;
- a majority amends away the minority-protection rule;
- emergency clauses never expire;
- amendment culture becomes circular when measured by prior amendment rate;
- rollback is impossible after irreversible effects; and
- hidden weights or prompts mutate while the public “constitution” stays fixed.

**Strongest null.** Versioned configuration and policy-as-code with code review,
tests, signed releases, rollback, and conventional change advisory practice.

**Residual experiment.** Under regime drift and adversarial incumbents, compare
immutable rules, administrator overwrite, ordinary versioned policy, and a
constitutional lifecycle with protected clauses and expiring emergency paths.
Equalize review calls, test compute, storage, and deployment delay. Measure
adaptation regret, unauthorized rule change, severe-harm escapes, rollback
success, time in emergency mode, and rule churn.

**Deduplication.** Maintenance and change are P-009, lineage is P-013, bounded
interaction is P-008, fast temporary authority is Candidate 012, live/learning
closure is Candidate 011, and semantic migration/rollback is Candidate 015.

## 11. Participation, deliberation, and perceived legitimacy

**Primary sources.** In 49 Indonesian villages randomized between
representative meetings and direct plebiscites for development-project choice,
Olken reports substantially higher satisfaction, knowledge, perceived
benefits, and reported willingness to contribute under plebiscites, with much
smaller changes in the projects selected
([DOI: 10.1017/S0003055410000079](https://doi.org/10.1017/S0003055410000079)).
Luskin, Fishkin, and Jowell analyze a national probability sample of 301
British participants in a two-day deliberative poll on crime, examining
representativeness, knowledge gain, and opinion change
([DOI: 10.1017/S0007123402000194](https://doi.org/10.1017/S0007123402000194)).

**Exact problem.** Participation can expose local information, change
preferences through learning, and affect acceptance of a process. Those are
distinct outcomes.

**Evidence status.** Olken supplies a randomized field experiment in a defined
institution and place. Luskin and colleagues supply a structured deliberative
study with a probability sample and intensive intervention. Neither result
shows that participation always improves policy correctness, inclusion,
legitimacy in the normative sense, or cost-effectiveness.

**Measurement boundary.**

- **perceived legitimacy/satisfaction**: survey response on a declared scale;
- **knowledge**: scored answers to declared items;
- **participation**: attendance, speaking, voting, proposal, or contribution,
  each counted separately;
- **acceptance/compliance**: behavior under a defined opportunity and horizon;
- **decision quality**: task- or policy-native outcome; and
- **normative legitimacy**: not reducible to any one of the above.

Self-reported willingness is not actual contribution. More talk is not more
influence. Equal attendance is not equal agenda power.

**AI translation.** Human stakeholders may participate in objective setting,
appeal, red-team review, or constitutional amendment. Model modules themselves
do not acquire political standing from being numerous. Within a multi-agent
system, deliberation is justified instrumentally only if it improves
information, calibration, contestability, or decision quality at full cost.

**Failure boundaries.**

- participation selects for time, confidence, language, or technical access;
- discussion polarizes, conforms, or follows high-status speakers;
- organizers control briefing materials and agenda;
- process satisfaction rises while outcomes remain unchanged or worse;
- repeated consultation imposes uncompensated cognitive labor;
- confidential participation conflicts with auditable lineage; and
- a procedure can be popular and still violate an authorized right.

**Strongest null.** Representative human review plus structured evidence
elicitation, accessible appeal, and statistically designed stakeholder
sampling. For modules, use independent prediction and aggregation baselines.

**Residual experiment.** Compare representative review, direct vote, structured
deliberation, and stratified contestable review under equal person-minutes,
briefing information, facilitation, and decision time. Measure knowledge,
proposal diversity, speaking/influence inequality, decision quality,
protected-group max loss, satisfaction, actual follow-through, and burden.
Report them separately.

**Deduplication.** Transient deliberative groups map to P-011; records and
reasons to P-013; protection to P-004; communication repair to Candidate 015.
No “legitimacy module” is proposed.

## 12. Institutional path dependence and lock-in

**Primary sources.** Pierson develops an increasing-returns account of path
dependence in politics, emphasizing timing, sequence, reinforcement, and
critical junctures
([DOI: 10.2307/2586011](https://doi.org/10.2307/2586011)). Dell uses spatial
regression discontinuity around the historical boundary of Peru's colonial
mining-labor mita and estimates persistent effects on contemporary household
consumption and child stunting, tracing candidate channels through land tenure
and public-goods provision
([DOI: 10.3982/ECTA8121](https://doi.org/10.3982/ECTA8121)).

**Exact problem.** Early or contingent choices alter later returns, skills,
coordination, expectations, authority, or switching cost, so the same later
conditions can yield different outcomes after different sequences.

A minimal sequence-sensitive test compares

$$
Y_T(a\rightarrow b)\quad\text{with}\quad Y_T(b\rightarrow a)
$$

under matched final resources and environmental state. $Y_T$ must carry a
declared task unit. Unequal outcomes suggest order effects; they do not by
themselves identify increasing returns or an institutional mechanism.

**Evidence status.** Pierson is a conceptual/mechanistic framework. Dell is a
strong context-specific quasi-experimental persistence study; its estimated
effects must not become universal constants or an AI scaling law.

**Required diagnosis.** A path-dependence claim must specify:

1. the initial branching event;
2. the reinforcement mechanism—learning, complementarity, coordination,
   sunk cost, power, expectations, or rule feedback;
3. a credible alternative path;
4. sequence-sensitive observation;
5. switching cost and who bears it;
6. conditions that weaken or reverse reinforcement; and
7. whether persistence is efficient, harmful, or normatively ambiguous.

**AI translation.** Early expert routing creates data and reputation that
attract more routing; early protocol adoption creates compatibility lock-in;
initial evaluators shape the training distribution; temporary emergency rules
become normal; incumbent modules influence admission tests; and frozen
representations make later alternatives expensive.

**Failure boundaries.**

- persistence may reflect a stable optimum rather than lock-in;
- warm-start hysteresis may be ordinary optimizer dynamics;
- a historical boundary may correlate with omitted geography or institutions;
- switching can destroy valuable learned complementarity;
- random resets hide rather than solve path dependence; and
- a reversible software fork may not model irreversible human harms.

**Strongest null.** Standard nonstationary online learning with exploration,
switching-cost-aware optimization, versioned migration, and periodic
re-evaluation from raw outcomes.

**Measurable prediction.** Randomizing early exposure while matching final
budgets should create divergent later routing, protocol, or evaluator
concentration only when a named reinforcement path operates. Removing that path
should shrink the order effect.

**Deduplication.** Diversity and protected exploration are P-004; maintenance
and retirement are P-009; lineage is P-013; convention migration is Candidate
015; selection conflict is Candidate 016; and this topic is already adjacent
to the
[cultural-evolution audit](2026-08-05-cultural-evolution-archaeology.md).

## Cross-domain synthesis: what actually survives

The recurring institutional mechanisms are narrower than their political
labels:

| Surviving mechanism | Formal/empirical reason | Existing repository home |
| --- | --- | --- |
| declare the aggregation domain and axiom trade-offs | impossibility claims are domain-conditional | P-013; math and evaluation notes |
| preserve alternatives before aggregation | agenda control changes reachable outcomes | P-004/P-013 |
| scope local authority and escalate spillovers | local information competes with coordination and externalities | P-002/P-008 |
| separate protected constraints from aggregate reward | rights/minority interests can conflict with Pareto-style aggregation | P-004/P-009 |
| type vetoes and authority by evidence, deadline, and override | blocking can prevent harm or create gridlock | P-008/P-009; Candidates 011/012 |
| make delegation revocable and concentration-visible | proxy chains cycle and concentrate | P-011/P-013 |
| separate proposal, execution, evaluation, and amendment | agenda and capture act through institutional dependencies | P-008/P-009/P-013; Candidate 008 |
| version rules and retain repair/rollback paths | rigidity and flexibility both fail | P-009/P-013; Candidates 011/015 |
| protect exploration against incumbent reinforcement | path-dependent routing and entry can lock in | P-004; Candidates 008/016 |
| measure process, outcome, burden, and distribution separately | satisfaction, knowledge, policy, and legitimacy are not one scalar | P-009/P-013 |

No item requires promotion to a new P-* principle. The integration hypothesis
is worth testing only when multiple persistent actors have asymmetric
information, partially conflicting incentives, real authority, and
consequences that ordinary optimization cannot erase.

## Strongest null stack

Every governance-flavored candidate must compare against the complete stack,
not a strawman central controller:

1. explicit task objective and non-tradable constraints;
2. calibrated prediction with uncertainty;
3. typed IAM/capability scopes and deterministic safety interlocks;
4. constrained or model-predictive control with spillover terms;
5. independent test ownership and randomized withheld evaluation;
6. static separation of duties and conflict disclosure;
7. fixed typed protocols with schema registry and compatibility tests;
8. append-only decision, evidence, and change lineage;
9. mature incident command, rollback, and postmortem practice;
10. switching-cost-aware exploration and protected canaries; and
11. human review for normative standing, rights, exceptions, and amendment.

A proposed governance layer loses if this stack matches quality, protection,
adaptation, and capture resistance at equal energy, latency, storage,
communication, human attention, and authority.

## Equal-budget decisive experiments

### A. Aggregation and agenda stress test

Generate profiles with binary agreement, Condorcet structure, cycles,
single-peaked restrictions, correlated errors, and strategic stakes. Compare
direct constrained optimization, pairwise majority, scoring, Condorcet-style
selection, randomized choice, and deliberation. Separately vary proposal set,
order, and fallback. Equalize observations, candidate-generation calls,
messages, and compute.

Measure task regret, cycle/unresolved rate, profitable-manipulation opportunity,
best-known-option recall, status-quo sensitivity, subgroup maximum loss,
energy, latency, and explanation size. The result must be reported by domain;
no universal winner is expected.

### B. Delegation, concentration, and revocation

Construct topic-specific competence, correlated misinformation, proxy failure,
delegation cycles, strategic super-proxies, and identity reset. Compare direct
voting, calibrated competence routing, local proxy delegation, optimized
non-local delegation, and capped/revocable delegation. Equalize private signals,
verification, message budget, and decision time.

Measure error, calibration, delegation-depth distribution, Herfindahl
concentration, unresolved cycles, time-to-revocation, error amplification after
proxy compromise, and audit bytes/joules.

### C. Central, federal, and polycentric control

Use a modular environment with heterogeneous local demand, shared scarce
resources, cross-region externalities, correlated faults, and optional local
capture. Compare global control, hierarchical sharding, local autonomy with
exception escalation, and overlapping polycentric centers. Equalize models,
sensors, actuators, compute, reserve, and communication.

Measure local-fit loss, spillover harm, p50/p99 response latency, duplicated
work, contradictory command rate, common-mode failure, inequity across regions,
capture recovery, and total cost vector.

### D. Veto and minority-protection frontier

Create rare proposals with high mean utility but catastrophic protected-class
loss, plus benign proposals that trigger noisy warnings. Compare scalar reward,
hard worst-case constraints, quorum, independent veto, and typed veto with
appeal, deadline, override, and expiry. Equalize evaluator calls and human
minutes.

Measure severe-harm recall, false-block rate, gridlock duration, status-quo
harm, time to safe adaptation, emergency-bypass frequency, and override
accountability. The candidate fails if ordinary constraints dominate.

### E. Collective action under real local stakes

Give persistent modules a costly choice to contribute tests, telemetry,
maintenance, or reserve that benefits the group. Factor identity persistence,
monitoring, communication, sanction cost, group size, and outside harm.
Compare central provisioning, fixed contribution contracts, communication,
self-designed rules, and audit-backed sanctions. Equalize total endowment and
monitoring cost.

Measure contribution, task welfare, hidden-quality failures, sanction and
communication cost, antisocial punishment, identity-reset rate, and
out-group harm. Shared-loss cooperative controls must be included and should
eliminate the political mechanism's advantage.

### F. Agenda and capture attack

Give incumbent specialists private influence over proposals, tests, telemetry,
or evaluator training. Cross expertise with political/graph connection so both
explanations can be estimated. Compare one integrated allocator, static
separation of duties, evaluator rotation, independent raw-evidence custody, and
Candidate 008's full audit-backed contestable allocation. Equalize expertise
access, audit probability, compute, and entrant trials.

Measure hidden task quality, policy divergence from predeclared objective,
connection-conditioned influence, expertise loss, entrant survival, Sybil
success, evaluator correlation, and challenge resolution. Do not label a
favorable incumbent outcome “capture” without the defined divergence and
counterfactual.

### G. Constitutional repair under drift and emergency

Expose systems to legitimate environmental drift, opportunistic incumbent
amendment, urgent hazards, stale emergency state, and irreversible transitions.
Compare immutable rules, administrator overwrite, conventional policy-as-code,
and constitutional lifecycle rules with protected clauses, staged ratification,
expiry, and rollback. Equalize tests, review calls, deployment windows, and
storage.

Measure adaptation regret, unauthorized changes, rule churn, severe-harm
escapes, rollback success, time in emergency authority, hidden-rule mutation,
and restoration latency. Candidate 011/012/015 features are ablated separately.

### H. Participation and legitimacy decomposition

For human-governed objectives, compare representative review, direct
participation, deliberative sampling, and stratified contestable review.
Equalize person-minutes, accessibility support, briefing information,
facilitation, proposal bandwidth, and decision time.

Measure knowledge, proposal diversity, speaking and influence inequality,
decision quality, protected-interest loss, satisfaction, actual follow-through,
attrition, and participant burden. Keep perceived legitimacy separate from
normative legitimacy and from policy quality.

### I. Path-dependence reversal

Randomize early module exposure, evaluator assignment, protocol convention, and
temporary authority; later match environment, compute, data volume, and final
candidate set. Compare ordinary online learning, explicit exploration,
periodic cold re-evaluation, migration tooling, and protected entrant capacity.
Then ablate each proposed reinforcement mechanism.

Measure order effect on final allocation, concentration, switching cost,
quality, subgroup loss, recovery time, and retained compatibility burden. A
path-dependence claim fails if matched final-state controls erase the effect or
if no named reinforcement ablation reduces it.

## Promotion and kill rules

The constitutionalized multi-level control-plane hypothesis may advance only
if all of the following hold:

- the applicability gate identifies persistent asymmetric information,
  partially conflicting incentives, or externally authorized standing that the
  null stack does not already represent;
- improvements appear on task-native outcomes or protected-harm bounds, not
  only satisfaction, report count, deliberation volume, or rule activity;
- capture, gridlock, concentration, exclusion, and human burden are included in
  the common cost vector;
- at least two independent task families show advantage over the full null
  stack under equal end-to-end budgets;
- component ablations identify delegation, veto, amendment, or participation
  mechanisms rather than generic logging and redundancy;
- advantages survive shared-model/data correlation and strategic identity
  attacks; and
- normative commitments remain explicit human-authorized inputs.

Kill, merge, or narrow the hypothesis when any of the following occurs:

- modules share one objective and cannot benefit from false reports;
- constrained optimization plus IAM and policy-as-code matches the result;
- “legitimacy” is measured only by compliance, clicks, satisfaction, or model
  confidence;
- a veto lowers mean harm by freezing a harmful status quo;
- delegation advantage disappears after competence routing and correlation
  controls;
- capture claims cannot distinguish expertise from connection or objective
  divergence;
- amendment frequency is treated as quality;
- path dependence is inferred from persistence without a counterfactual and
  reinforcement mechanism;
- participation increases activity without information, inclusion, decision,
  or protection gains at full cost; or
- the institution cannot state who authorizes its constitutional objective.

## Temporary claim ledger

These identifiers are audit-local. Status labels describe evidence for the
bounded statement, not a repository endorsement.

| ID | Temporary claim | Status | Assumption or decisive boundary |
| --- | --- | --- | --- |
| SCI-01 | Arrow's aggregation guarantees cannot all coexist for unrestricted ordinal profiles over at least three alternatives. | established formal | Exact axioms and collective-order requirement must be retained. |
| SCI-02 | May characterizes simple majority on a binary domain under symmetry, neutrality, and responsiveness conditions. | established formal | Does not extend to three-plus alternatives. |
| SCI-03 | Deterministic, onto/unanimous, unrestricted single-winner choice over at least three outcomes cannot be both non-dictatorial and strategy-proof. | established formal | Existential manipulability is not ubiquitous or easy manipulation. |
| SCI-04 | Minimal individual decisiveness can conflict with weak Pareto under unrestricted preferences. | established formal | The theorem does not choose rights or prove that rights are impossible. |
| SCI-05 | Delegable proxy voting can create cycles, abstention, inconsistency, and concentrated weight. | established in formal models | Empirical frequency and legitimacy effects remain open. |
| SCI-06 | Competence-directed local delegation is not guaranteed to beat direct voting in the studied binary truth model. | established formal | Truth tracking is not value aggregation or legitimacy. |
| SCI-07 | Polycentricity denotes multiple interacting decision centers, not automatic fragmentation or automatic efficiency. | established conceptual | Performance depends on local information, spillovers, scale, and capture. |
| SCI-08 | Bolivia's decentralization was associated with investment becoming more responsive to measured local need in the studied reform. | plausible causal/context-bounded | Not a universal decentralization constant. |
| SCI-09 | More or more-distant veto players reduce the modeled winset and increase policy stability. | established formal | Stability is not welfare, protection, competence, or legitimacy. |
| SCI-10 | Randomly mandated representation changed public-goods allocation toward represented groups' expressed priorities in studied Indian institutions. | established context-bounded empirical | Does not settle which representation rule is just. |
| SCI-11 | Public-goods contribution depends on return, repetition, information, communication, monitoring, sanction, identity, and group design. | established as a bounded empirical family | No universal contribution or sanction percentage follows. |
| SCI-12 | Larger groups need not provide public goods less efficiently under all voluntary-contribution parameters. | established counterexample | Treatment parameters and marginal return are essential. |
| SCI-13 | Multidimensional majority choice can be agenda-sensitive and unstable under McKelvey's conditions. | established formal | Does not imply unconstrained agenda control in every institution. |
| SCI-14 | A proposal setter can exploit the reversion/status quo under the Romer--Rosenthal model. | established formal | Depends on proposal, acceptance, preference, and reversion assumptions. |
| SCI-15 | Lobbying data contain separable signals of issue expertise and political connection, with a monetary premium for connections in the studied setting. | plausible empirical | Influence and connection are not sufficient proof of capture. |
| SCI-16 | Regulatory-capture models predict organized interests can shape regulation, but model structure is not direct empirical proof. | plausible theory | A capture claim needs purpose, divergence, mechanism, and counterfactual. |
| SCI-17 | Formal amendment difficulty and constitutional length are associated with amendment rate in Lutz's samples. | plausible empirical | Amendment rate is not quality and institutional variables are endogenous. |
| SCI-18 | Prior amendment practice may explain variation beyond formal amendment rules. | plausible/disputed | “Amendment culture” measurement may itself be endogenous or circular. |
| SCI-19 | Direct plebiscites increased knowledge, satisfaction, perceived benefit, and reported willingness to contribute in Olken's 49-village experiment, with smaller policy-choice effects. | established context-bounded empirical | Self-report is not contribution; external validity is limited. |
| SCI-20 | Structured deliberation can change participant knowledge and opinions in a recruited probability sample. | plausible context-bounded empirical | Selection, facilitation, briefing, group influence, and cost matter. |
| SCI-21 | Perceived legitimacy, normative legitimacy, participation, knowledge, compliance, and decision quality are distinct constructs. | established measurement boundary | None is a valid proxy for all others without validation. |
| SCI-22 | Increasing returns can make institutional timing and sequence consequential. | plausible mechanism family | Must name reinforcement, alternative path, and reversal condition. |
| SCI-23 | Dell estimates persistent contemporary effects near the historical mita boundary and traces candidate land/public-goods channels. | established context-bounded quasi-experimental | Estimate is not universal and depends on RD validity and channel evidence. |
| SCI-24 | Early AI routing, evaluation, or protocol choices can create self-reinforcing concentration. | speculative translation | Requires randomized order effects and mechanism ablation. |
| SCI-25 | Typed, revocable, logged delegation may improve expert use under topic-specific private information. | speculative | Must beat calibrated routing at equal budget. |
| SCI-26 | Evidence-scoped vetoes may reduce rare protected-interest harms without prohibitive gridlock. | speculative | Must beat hard constraints and independent review. |
| SCI-27 | A versioned constitutional lifecycle may improve the stability--repair frontier under drift and opportunistic rule change. | speculative | Must beat mature policy-as-code/change management. |
| SCI-28 | A constitutionalized multi-level control plane may resist agenda, capture, and lock-in failures better than ordinary systems engineering. | speculative integration | Promotion requires experiments A--I and normative human authorization. |

## Audit-local bibliography (BibTeX)

```bibtex
@article{arrow1950difficulty,
  author = {Arrow, Kenneth J.},
  title = {A Difficulty in the Concept of Social Welfare},
  journal = {Journal of Political Economy},
  year = {1950},
  volume = {58},
  number = {4},
  pages = {328--346},
  doi = {10.1086/256963},
  url = {https://doi.org/10.1086/256963}
}

@article{may1952set,
  author = {May, Kenneth O.},
  title = {A Set of Independent Necessary and Sufficient Conditions for Simple Majority Decision},
  journal = {Econometrica},
  year = {1952},
  volume = {20},
  number = {4},
  pages = {680--684},
  doi = {10.2307/1907651},
  url = {https://doi.org/10.2307/1907651}
}

@article{gibbard1973manipulation,
  author = {Gibbard, Allan},
  title = {Manipulation of Voting Schemes: A General Result},
  journal = {Econometrica},
  year = {1973},
  volume = {41},
  number = {4},
  pages = {587--601},
  doi = {10.2307/1914083},
  url = {https://doi.org/10.2307/1914083}
}

@article{satterthwaite1975strategy,
  author = {Satterthwaite, Mark Allen},
  title = {Strategy-Proofness and Arrow's Conditions: Existence and Correspondence Theorems for Voting Procedures and Social Welfare Functions},
  journal = {Journal of Economic Theory},
  year = {1975},
  volume = {10},
  number = {2},
  pages = {187--217},
  doi = {10.1016/0022-0531(75)90050-2},
  url = {https://doi.org/10.1016/0022-0531(75)90050-2}
}

@article{sen1970impossibility,
  author = {Sen, Amartya},
  title = {The Impossibility of a Paretian Liberal},
  journal = {Journal of Political Economy},
  year = {1970},
  volume = {78},
  number = {1},
  pages = {152--157},
  doi = {10.1086/259614},
  url = {https://doi.org/10.1086/259614}
}

@inproceedings{christoff2017binary,
  author = {Christoff, Zo{\'e} and Grossi, Davide},
  title = {Binary Voting with Delegable Proxy: An Analysis of Liquid Democracy},
  booktitle = {Proceedings of TARK 2017},
  series = {Electronic Proceedings in Theoretical Computer Science},
  year = {2017},
  volume = {251},
  pages = {134--150},
  doi = {10.4204/EPTCS.251.10},
  url = {https://doi.org/10.4204/EPTCS.251.10}
}

@inproceedings{kahng2018liquid,
  author = {Kahng, Anson and Mackenzie, Simon and Procaccia, Ariel D.},
  title = {Liquid Democracy: An Algorithmic Perspective},
  booktitle = {Proceedings of the Thirty-Second AAAI Conference on Artificial Intelligence},
  year = {2018},
  volume = {32},
  number = {1},
  doi = {10.1609/aaai.v32i1.11468},
  url = {https://doi.org/10.1609/aaai.v32i1.11468}
}

@article{ostrom1961organization,
  author = {Ostrom, Vincent and Tiebout, Charles M. and Warren, Robert},
  title = {The Organization of Government in Metropolitan Areas: A Theoretical Inquiry},
  journal = {American Political Science Review},
  year = {1961},
  volume = {55},
  number = {4},
  pages = {831--842},
  doi = {10.2307/1952530},
  url = {https://doi.org/10.2307/1952530}
}

@article{faguet2004decentralization,
  author = {Faguet, Jean-Paul},
  title = {Does Decentralization Increase Government Responsiveness to Local Needs? Evidence from Bolivia},
  journal = {Journal of Public Economics},
  year = {2004},
  volume = {88},
  number = {3--4},
  pages = {867--893},
  doi = {10.1016/S0047-2727(02)00185-8},
  url = {https://doi.org/10.1016/S0047-2727(02)00185-8}
}

@article{tsebelis1995decision,
  author = {Tsebelis, George},
  title = {Decision Making in Political Systems: Veto Players in Presidentialism, Parliamentarism, Multicameralism and Multipartyism},
  journal = {British Journal of Political Science},
  year = {1995},
  volume = {25},
  number = {3},
  pages = {289--325},
  doi = {10.1017/S0007123400007225},
  url = {https://doi.org/10.1017/S0007123400007225}
}

@article{chattopadhyay2004women,
  author = {Chattopadhyay, Raghabendra and Duflo, Esther},
  title = {Women as Policy Makers: Evidence from a Randomized Policy Experiment in India},
  journal = {Econometrica},
  year = {2004},
  volume = {72},
  number = {5},
  pages = {1409--1443},
  doi = {10.1111/j.1468-0262.2004.00539.x},
  url = {https://doi.org/10.1111/j.1468-0262.2004.00539.x}
}

@article{pande2003mandated,
  author = {Pande, Rohini},
  title = {Can Mandated Political Representation Increase Policy Influence for Disadvantaged Minorities? Theory and Evidence from India},
  journal = {American Economic Review},
  year = {2003},
  volume = {93},
  number = {4},
  pages = {1132--1151},
  doi = {10.1257/000282803769206232},
  url = {https://doi.org/10.1257/000282803769206232}
}

@article{andreoni1988free,
  author = {Andreoni, James},
  title = {Why Free Ride? Strategies and Learning in Public Goods Experiments},
  journal = {Journal of Public Economics},
  year = {1988},
  volume = {37},
  number = {3},
  pages = {291--304},
  doi = {10.1016/0047-2727(88)90043-6},
  url = {https://doi.org/10.1016/0047-2727(88)90043-6}
}

@article{isaac1994group,
  author = {Isaac, R. Mark and Walker, James M. and Williams, Arlington W.},
  title = {Group Size and the Voluntary Provision of Public Goods: Experimental Evidence Utilizing Large Groups},
  journal = {Journal of Public Economics},
  year = {1994},
  volume = {54},
  number = {1},
  pages = {1--36},
  doi = {10.1016/0047-2727(94)90068-X},
  url = {https://doi.org/10.1016/0047-2727(94)90068-X}
}

@article{ostrom1992covenants,
  author = {Ostrom, Elinor and Walker, James and Gardner, Roy},
  title = {Covenants with and without a Sword: Self-Governance Is Possible},
  journal = {American Political Science Review},
  year = {1992},
  volume = {86},
  number = {2},
  pages = {404--417},
  doi = {10.2307/1964229},
  url = {https://doi.org/10.2307/1964229}
}

@article{mckelvey1976intransitivities,
  author = {McKelvey, Richard D.},
  title = {Intransitivities in Multidimensional Voting Models and Some Implications for Agenda Control},
  journal = {Journal of Economic Theory},
  year = {1976},
  volume = {12},
  number = {3},
  pages = {472--482},
  doi = {10.1016/0022-0531(76)90040-5},
  url = {https://doi.org/10.1016/0022-0531(76)90040-5}
}

@article{romer1978political,
  author = {Romer, Thomas and Rosenthal, Howard},
  title = {Political Resource Allocation, Controlled Agendas, and the Status Quo},
  journal = {Public Choice},
  year = {1978},
  volume = {33},
  number = {4},
  pages = {27--43},
  doi = {10.1007/BF03187594},
  url = {https://doi.org/10.1007/BF03187594}
}

@article{stigler1971theory,
  author = {Stigler, George J.},
  title = {The Theory of Economic Regulation},
  journal = {The Bell Journal of Economics and Management Science},
  year = {1971},
  volume = {2},
  number = {1},
  pages = {3--21},
  doi = {10.2307/3003160},
  url = {https://doi.org/10.2307/3003160}
}

@article{peltzman1976general,
  author = {Peltzman, Sam},
  title = {Toward a More General Theory of Regulation},
  journal = {The Journal of Law and Economics},
  year = {1976},
  volume = {19},
  number = {2},
  pages = {211--240},
  doi = {10.1086/466865},
  url = {https://doi.org/10.1086/466865}
}

@article{bertrand2014whom,
  author = {Bertrand, Marianne and Bombardini, Matilde and Trebbi, Francesco},
  title = {Is It Whom You Know or What You Know? An Empirical Assessment of the Lobbying Process},
  journal = {American Economic Review},
  year = {2014},
  volume = {104},
  number = {12},
  pages = {3885--3920},
  doi = {10.1257/aer.104.12.3885},
  url = {https://doi.org/10.1257/aer.104.12.3885}
}

@article{lutz1994amendment,
  author = {Lutz, Donald S.},
  title = {Toward a Theory of Constitutional Amendment},
  journal = {American Political Science Review},
  year = {1994},
  volume = {88},
  number = {2},
  pages = {355--370},
  doi = {10.2307/2944709},
  url = {https://doi.org/10.2307/2944709}
}

@article{ginsburg2015amendment,
  author = {Ginsburg, Tom and Melton, James},
  title = {Does the Constitutional Amendment Rule Matter at All? Amendment Cultures and the Challenges of Measuring Amendment Difficulty},
  journal = {International Journal of Constitutional Law},
  year = {2015},
  volume = {13},
  number = {3},
  pages = {686--713},
  doi = {10.1093/icon/mov041},
  url = {https://doi.org/10.1093/icon/mov041}
}

@article{olken2010direct,
  author = {Olken, Benjamin A.},
  title = {Direct Democracy and Local Public Goods: Evidence from a Field Experiment in Indonesia},
  journal = {American Political Science Review},
  year = {2010},
  volume = {104},
  number = {2},
  pages = {243--267},
  doi = {10.1017/S0003055410000079},
  url = {https://doi.org/10.1017/S0003055410000079}
}

@article{luskin2002considered,
  author = {Luskin, Robert C. and Fishkin, James S. and Jowell, Roger},
  title = {Considered Opinions: Deliberative Polling in Britain},
  journal = {British Journal of Political Science},
  year = {2002},
  volume = {32},
  number = {3},
  pages = {455--487},
  doi = {10.1017/S0007123402000194},
  url = {https://doi.org/10.1017/S0007123402000194}
}

@article{pierson2000increasing,
  author = {Pierson, Paul},
  title = {Increasing Returns, Path Dependence, and the Study of Politics},
  journal = {American Political Science Review},
  year = {2000},
  volume = {94},
  number = {2},
  pages = {251--267},
  doi = {10.2307/2586011},
  url = {https://doi.org/10.2307/2586011}
}

@article{dell2010mita,
  author = {Dell, Melissa},
  title = {The Persistent Effects of Peru's Mining Mita},
  journal = {Econometrica},
  year = {2010},
  volume = {78},
  number = {6},
  pages = {1863--1903},
  doi = {10.3982/ECTA8121},
  url = {https://doi.org/10.3982/ECTA8121}
}
```

## Final deduplication decision

Do not add “democratic intelligence,” “federal mind,” “liquid delegation,”
“minority veto,” “institutional legitimacy,” or “constitutional AI” as
free-standing principles. Route future evidence to the exact mechanism:
aggregation domain, strategic report, proposal admission, scoped authority,
spillover escalation, protected constraint, veto contract, delegation graph,
evaluation independence, versioned amendment, participation measurement, or
reinforcement/lock-in path.

The useful import from political science is not a claim that a model should
imitate a state. It is a discipline for asking who holds information and
authority, which alternatives never reach a decision, which interests are
protected or excluded, how rules themselves change, who can profit from those
rules, and what costs a stable arrangement pushes elsewhere.

# Primary-source audit: economics, market design, and incentives

**Audit date:** 2026-08-05

**Scope:** mechanism design, distributed resource allocation, congestion,
auctions, matching, principal--agent problems, metric gaming,
exploration--exploitation, commons governance, proper scoring, and robust or
adversarial market design

**Ledger status:** candidate evidence only; temporary claim labels in this
file are not promoted `C-` identifiers

**Purpose:** identify mechanisms that could matter for modular AI capacity,
routing, and evaluation while rejecting market metaphors that add no
information or incentive function

## Executive finding

Economics supplies powerful null models for this project, but not a new
architectural principle at the present evidence level. Shadow prices,
proportional-fair allocation, bandit exploration, deferred acceptance, VCG
transfers, proper scoring, audits, and costly sanctions all solve precisely
stated problems under restrictive assumptions. Most of their abstract
functions already deduplicate into [`P-001`](../principle-registry.md#p-001--selective-allocation),
[`P-004`](../principle-registry.md#p-004--diversity-selection-and-protection),
[`P-006`](../principle-registry.md#p-006--homeostatic-negative-feedback),
[`P-007`](../principle-registry.md#p-007--prediction-error-allocation),
[`P-009`](../principle-registry.md#p-009--maintenance-plane), and
[`P-013`](../principle-registry.md#p-013--externalized-shared-state).

The strongest conventional null is simple:

> If modules share one loss, reveal their state to the router, and cannot
> benefit from a false report, capacity routing is constrained optimization or
> online control—not mechanism design.

A genuine incentive problem requires all three of the following:

1. a module has decision-relevant information that the allocator cannot
   cheaply observe directly;
2. the module has a persistent objective or selection pressure that can make a
   false report locally advantageous; and
3. the allocator can impose a real consequence—future traffic, compute,
   admission, demotion, or another opportunity cost—that the module cannot
   costlessly evade.

One narrow experimental residue survives: **audit-backed contestable modular
allocation**. Persistent specialists would report capability, uncertainty, and
resource cost; a router would allocate scarce work; unpredictable withheld
audits and delayed outcomes would update future traffic or budget; new modules
would receive protected trial capacity; and an append-only record would make
reports and outcomes contestable. This is a composition of existing
principles, not a proposed new `P-` principle. It should be rejected if a
standard calibrated router, primal--dual controller, or ordinary randomized
evaluation matches it at equal total cost.

## Audit map

| Mechanism family | Exact problem | Existing-principle mapping | Residual disposition |
| --- | --- | --- | --- |
| Shadow prices and congestion control | allocate divisible capacity from local congestion feedback | `P-001`, `P-005`, `P-006` | no new principle |
| Auctions and VCG-style transfers | elicit private values/costs when reports affect allocation | `P-001`, `P-013` | useful only with strategic private information |
| Matching with contracts | produce stable assignments under two-sided preferences and constraints | `P-001`, `P-008` | experiment only for persistent heterogeneous modules |
| Bilateral-trade impossibility | expose incompatible truthfulness, efficiency, participation, and budget goals | design constraint across `P-001`/`P-006` | no mechanism; prevents overclaiming |
| Principal--agent and metric gaming | align hidden effort with a multidimensional system objective | `P-009`, with `P-001`/`P-004` | central to evaluation, not a new allocation invariant |
| Proper scoring and peer prediction | elicit calibrated beliefs or information when truth is delayed/absent | `P-007`, `P-009`, `P-013` | component of the surviving candidate |
| Exploration--exploitation | learn uncertain specialist value while spending scarce trials | `P-001`, `P-004`, `P-007` | established null |
| Commons governance | prevent overuse of a shared exhaustible resource | `P-006`, `P-009`, `P-013` | endogenous governance is a test factor, not a new principle |
| Robust/adversarial mechanism design | retain properties under unknown beliefs, false identities, collusion, or organizer deviation | `P-004`, `P-009`, `P-013` | threat model for the surviving candidate |

## Shared formal frame and units

Let module $i$ possess private state or type $\theta_i$, submit report
$\hat\theta_i$, receive allocation $x_i$, and incur cost $C_i(x_i,\theta_i)$.
Let $Q(x,y)$ be task quality after outcome $y$, $E(x)$ energy in joules, and
$L(x)$ latency in seconds. A system planner might optimize

$$
W(x)=\mathbb{E}[Q(x,y)]-\lambda_E E(x)-\lambda_L L(x)
$$

subject to compute, memory, and communication constraints. $\lambda_E$ has
units of quality per joule and $\lambda_L$ has units of quality per second. A
router that directly observes the required inputs can solve this optimization
without a market.

The mechanism-design problem appears only when allocation uses reports and
each participant has a utility such as

$$
u_i(\hat\theta_i,\theta_i)
=T_i(\hat\theta)-C_i(x_i(\hat\theta),\theta_i),
$$

where $T_i$ is a real transfer or future opportunity in the same utility unit.
A token with no scarce backing and no effect on future choices is not a
transfer. An incentive-compatibility claim must name the equilibrium concept,
the participant utility, the information model, and the feasible deviations.

For a resource $r$ with capacity $c_r$ and aggregate use $z_r$, a primal--dual
allocator can update a nonnegative shadow price

$$
p_{r,t+1}=\left[p_{r,t}+\eta\left(z_{r,t}-c_r\right)\right]_+.
$$

$z_r$ and $c_r$ share units such as tokens/s or byte/s; $p_r$ has units of
utility per resource unit; and $\eta$ carries the units required by the update.
This is the default null for any proposal in which “prices” merely communicate
congestion.

## 1. Shadow prices, congestion pricing, and selfish routing

**Primary sources.** Kelly, Maulloo, and Tan derive distributed rate-control
classes around a proportional-fair system objective and interpret their primal
and dual forms as congestion signals or shadow prices
([DOI: 10.2307/3010473](https://doi.org/10.2307/3010473)). Roughgarden and
Tardos quantify the gap between selfish and system-optimal nonatomic routing
([DOI: 10.1145/506147.506153](https://doi.org/10.1145/506147.506153)).

- **Exact problem.** Allocate divisible traffic across constrained links when
  each source knows its own demand or utility and the network observes
  aggregate congestion. Separately, bound the welfare loss when users choose
  minimum-latency routes for themselves rather than minimize total latency.
- **Information path.** Links aggregate load into a congestion signal or
  price; sources change rates or routes from that feedback. The network need
  not collect every utility function centrally, but the implemented objective
  is still chosen by the designer.
- **Timescale.** Fast rate updates act over packets, requests, or controller
  epochs; utility and capacity models are treated as stable long enough for the
  controller to approach its operating point.
- **Assumptions.** Kelly-style guarantees require declared increasing concave
  utilities, a specified capacity model, compatible gains and delays, and
  cooperative execution of the controller. Roughgarden--Tardos bounds depend
  on the latency-function class and a nonatomic routing model.
- **Efficiency mechanism.** A shadow price compresses the marginal external
  cost of scarce capacity into a local signal. It coordinates decentralized
  updates toward a declared system objective. Congestion tolls can similarly
  make a user internalize costs imposed on others.
- **Failure boundary.** Prices do not choose the correct objective, reveal
  hidden quality, prevent strategic misreporting, or guarantee stability under
  arbitrary feedback delay. Selfish local route choice can be inefficient; the
  size of the gap is not universal and can be unbounded for broad latency
  classes.
- **Strongest conventional null.** A tuned primal--dual or model-predictive
  resource controller with queue, energy, and tail-latency constraints. Add a
  bandit only when route/expert rewards are initially unknown.
- **Principle mapping.** `P-001` for selective allocation, `P-006` for
  congestion feedback, and `P-005` only when route or topology changes rather
  than rate alone.
- **Residual candidate.** None. Calling $p_r$ a “metabolic currency” does not
  change the algorithm. A residual begins only if modules possess hidden costs
  and can profit by manipulating the price signal.

## 2. Auctions, VCG transfers, and objective mismatch

**Primary sources.** Vickrey establishes the second-price sealed-bid benchmark
([DOI: 10.1111/j.1540-6261.1961.tb02789.x](https://doi.org/10.1111/j.1540-6261.1961.tb02789.x)).
Groves constructs compensation rules that induce semi-autonomous subunits to
communicate information and act as a team
([DOI: 10.2307/1914085](https://doi.org/10.2307/1914085)). Myerson instead
optimizes a seller's expected utility under a Bayesian model
([DOI: 10.1287/moor.6.1.58](https://doi.org/10.1287/moor.6.1.58)).

- **Exact problem.** Choose who receives a scarce item or resource when agents
  privately know values or costs and ordinary first-price reports invite
  shading. The goal may be allocative welfare, seller revenue, procurement
  cost, or another objective; these are not interchangeable.
- **Information path.** Participants submit bids or types to a mechanism. The
  allocation rule and transfer rule jointly determine payoffs, so the
  counterfactual effect of a report on others is part of the signal.
- **Timescale.** A one-shot auction clears one allocation; repeated auctions
  add learning, reputation, collusion, entry, and budget dynamics not covered
  by the one-shot theorem.
- **Assumptions.** The clean Vickrey/VCG truthfulness result uses quasilinear
  utilities, enforceable transfers, specified feasible outcomes, stable
  identities, and the relevant private-value structure. Budget constraints,
  interdependent values, complementarities, collusion, approximate
  optimization, and false identities can break the result.
- **Efficiency mechanism.** Charge a winner for the externality its presence
  imposes on others, separating the allocation decision from its own reported
  amount under the model. Myerson's result is a warning that changing the
  designer objective changes the mechanism: a revenue-optimal allocation need
  not maximize system quality or energy efficiency.
- **Failure boundary.** A learned module does not automatically have a utility
  function, and a scalar “bid” is not truthful merely because it is called a
  bid. VCG can run a deficit or fail budget balance, requires counterfactual
  optimization, and loses truthfulness under common approximations. Transfers
  between components of one fully cooperative model can cancel into bookkeeping
  with no behavioral effect.
- **Strongest conventional null.** Directly solve the same constrained routing
  problem from measured cost/quality predictors. If inputs are uncertain but
  nonstrategic, use calibrated uncertainty and online learning. If private
  reports are strategic, compare with a correctly specified VCG or posted-price
  mechanism rather than a hand-built token economy.
- **Principle mapping.** `P-001` plus `P-013` when bids and outcomes are stored
  in shared state.
- **Residual candidate.** Conditional. Auction-like allocation is worth
  testing only when persistent modules can hide or distort cost/capability and
  future traffic or compute is a real scarce transfer. No general auction
  principle survives.

## 3. Matching, contracts, and complementary specialists

**Primary sources.** Gale and Shapley prove existence of stable matchings in
their marriage and college-admissions models and give deferred acceptance
([DOI: 10.1080/00029890.1962.11989827](https://doi.org/10.1080/00029890.1962.11989827)).
Hatfield and Milgrom extend matching to contracts and obtain strong properties
under substitutability and a law of aggregate demand
([DOI: 10.1257/0002828054825466](https://doi.org/10.1257/0002828054825466)).
Roth's historical study connects stability to the orderly operation of the
medical labor match
([DOI: 10.1086/261272](https://doi.org/10.1086/261272)).

- **Exact problem.** Assign two sides—workers and firms, students and schools,
  or tasks and specialists—when both sides have preferences and a blocking pair
  could profitably abandon the proposed assignment. Matching with contracts
  also attaches terms to a relationship.
- **Information path.** Each side reports an ordering or choice function; a
  deferred process exposes rejections and retains provisional matches. The
  mechanism needs far less than a global differentiable objective, but relies
  on structured preferences.
- **Timescale.** Batch matching clears a market over proposal rounds. Persistent
  AI routing is online and nonstationary, so rematching frequency, migration,
  and relationship-specific learning must be charged separately.
- **Assumptions.** Classical stability uses coherent preferences and capacity
  constraints. Contract results depend on substitutes and aggregate-demand
  conditions. Strong complementarities among specialists can destroy these
  properties; preferences learned from endogenous traffic may not be fixed.
- **Efficiency mechanism.** Deferred acceptance removes assignments that would
  be displaced by mutually preferred alternatives and prevents unraveling into
  premature bilateral commitments. Stability is an institutional objective,
  not identical to maximum accuracy, welfare, fairness, or minimum energy.
- **Failure boundary.** Stable outcomes can be side-optimal and distributionally
  unequal. A task has no independent preference unless the system deliberately
  defines one. If one router can directly score every feasible expert bundle,
  ordinary assignment or min-cost flow is the stronger null. Complementary
  coalitions make pairwise stability particularly weak.
- **Strongest conventional null.** Min-cost flow or constrained assignment
  using measured quality, latency, energy, and migration cost; for online
  operation, a switching-cost-aware assignment controller.
- **Principle mapping.** `P-001` for assignment and `P-008` for typed module
  boundaries. Protected entrance for unmatched/new specialists also touches
  `P-004`.
- **Residual candidate.** A limited experiment on **relationship persistence**:
  whether stable task--specialist contracts reduce churn and retraining cost
  under two-sided constraints. It disappears if switching-cost-aware
  optimization matches it.

## 4. Impossibility results as design constraints

**Primary source.** Myerson and Satterthwaite characterize Bayesian incentive-
compatible, individually rational bilateral-trade mechanisms and show the
general impossibility of ex-post efficiency without outside subsidies under
their private-value setting
([DOI: 10.1016/0022-0531(83)90048-0](https://doi.org/10.1016/0022-0531(83)90048-0)).

- **Exact problem.** A buyer and seller privately know values for one possible
  trade. The designer seeks truthful participation, voluntary participation,
  budget balance, and efficient trade.
- **Information path.** Both sides report private values; transfers and trade
  depend on the joint reports. No external observation reveals the foregone
  gains from trades that do not occur.
- **Timescale.** One bilateral trade under a known type-distribution model.
  Repetition, competition, verification, or subsidies change the problem.
- **Assumptions.** Independent private values with overlapping supports,
  Bayesian incentive compatibility, individual rationality, and no outside
  subsidy. The theorem is not a universal claim that all exchange is
  inefficient.
- **Efficiency mechanism.** This is a feasibility boundary rather than a
  mechanism: some desirable properties cannot be simultaneously guaranteed
  when both sides hold private information.
- **Failure boundary.** Importing an impossibility without importing its
  assumptions is invalid. Conversely, claiming truthful, efficient,
  budget-balanced expert exchange without stating information and transfer
  assumptions ignores a known conflict.
- **Strongest conventional null.** Central measurement or verification that
  removes private information; otherwise a second-best mechanism with the
  exact desired constraint priority.
- **Principle mapping.** No new principle. It constrains how `P-001` and
  `P-006` can be instantiated.
- **Residual candidate.** None. Its value is to force an explicit priority
  among truthfulness, participation, efficiency, and budget balance.

## 5. Principal--agent problems, Goodhart pressure, and hidden effort

**Primary sources.** Holmström formalizes moral hazard with imperfect
observability and the value of additional performance signals
([DOI: 10.2307/3003320](https://doi.org/10.2307/3003320)). Holmström and
Milgrom show how rewarding measurable tasks can distort effort away from
poorly measured tasks in a multitask setting
([DOI: 10.1093/jleo/7.special_issue.24](https://doi.org/10.1093/jleo/7.special_issue.24)).
Goodhart's original monetary-control observation concerns statistical
regularities collapsing under control pressure; the popular “measure becomes a
target” wording is not his verbatim statement. Campbell independently describes
corruption pressure and process distortion when quantitative indicators drive
social decisions
([DOI: 10.1016/0149-7189(79)90048-X](https://doi.org/10.1016/0149-7189(79)90048-X)).
Everitt et al. give the directly relevant AI null: ordinary reinforcement
learning can perform poorly when the observed reward channel is corrupted
([DOI: 10.24963/ijcai.2017/656](https://doi.org/10.24963/ijcai.2017/656)).

- **Exact problem.** A principal wants multidimensional, partly hidden effort;
  an agent chooses behavior from a signal-dependent contract. For modular AI,
  selection pressure can make a specialist optimize router-visible metrics
  rather than downstream usefulness.
- **Information path.** Hidden action affects noisy proxy measurements and
  delayed outcomes. The evaluator chooses which signals enter reward,
  selection, or future traffic, thereby changing behavior and the measurement
  distribution itself.
- **Timescale.** Fast task actions are scored immediately, while true utility,
  side effects, calibration, and continual-learning damage may appear over
  longer horizons. Selection across many routing epochs creates the strategic
  pressure even if no module performs explicit symbolic deception.
- **Assumptions.** Principal--agent conclusions depend on preferences, risk,
  signal informativeness, feasible contracts, and how tasks substitute in the
  agent's effort. “Goodhart's law” is a family resemblance, not a theorem with
  one universal error bound.
- **Efficiency mechanism.** Use signals that add information about desired
  hidden behavior; balance incentives across tasks; reduce optimization power
  on fragile proxies; separate production from evaluation; and reserve
  decision weight for delayed or independently collected outcomes.
- **Failure boundary.** Adding metrics can worsen incentives when they are
  manipulable, redundant, or only cover easy tasks. An independent evaluator
  trained on the same proxy and data is not independent. Random audits cannot
  recover an unobserved objective and can themselves be learned if predictable.
- **Strongest conventional null.** Multi-objective constrained training with
  held-out evaluation, causal or randomized audits, calibration tests, and
  corrupted-reward-channel baselines. This is ordinary robust evaluation, not
  an economic market by default.
- **Principle mapping.** `P-009` for an evaluation/maintenance plane, `P-004`
  for diversity and protected challengers, and `P-013` for an auditable record.
- **Residual candidate.** Yes, but only as the core threat model for
  audit-backed contestable allocation: selection-trained modules may learn to
  inflate router-visible competence while shifting cost or failure to
  unmeasured dimensions.

## 6. Proper scoring and information elicitation

**Primary sources.** Brier introduced a quadratic score for probability
forecasts
([DOI: 10.1175/1520-0493(1950)078%3C0001:VOFEIT%3E2.0.CO;2](https://doi.org/10.1175/1520-0493%281950%29078%3C0001%3AVOFEIT%3E2.0.CO%3B2)).
Gneiting and Raftery characterize proper scoring rules for probabilistic
prediction
([DOI: 10.1198/016214506000001437](https://doi.org/10.1198/016214506000001437)).
Miller, Resnick, and Zeckhauser construct a peer-prediction mechanism in which
honest reporting is a Nash equilibrium under a model of correlated private
signals and a common prior
([DOI: 10.1287/mnsc.1050.0379](https://doi.org/10.1287/mnsc.1050.0379)).

- **Exact problem.** Elicit a probability distribution rather than an
  overconfident point claim, or elicit costly private information when ground
  truth is delayed or unavailable.
- **Information path.** A module reports predictive distribution $q_i(y)$.
  When $y$ is later observed, a proper score rewards calibration and sharpness
  under its formal conditions. Peer prediction instead scores one report
  against implications for another participant's report.
- **Timescale.** Forecast at routing time, settlement after the relevant
  outcome matures. Different event horizons require separate score accounts;
  otherwise short-horizon modules can dominate before long-horizon failures
  arrive.
- **Assumptions.** Strict propriety is relative to the event actually scored
  and an expected-utility forecaster. It does not make the event definition
  correct or the observation channel uncorrupted. Peer prediction requires
  correlated signals and strong prior/equilibrium assumptions; truth can
  coexist with uninformative, permutation, or collusive equilibria.
- **Efficiency mechanism.** Replace unverifiable confidence logits with
  probability reports whose expected score is optimized by the reporter's
  belief. Randomly selected, outcome-backed tasks create information about
  calibration that the router can use later.
- **Failure boundary.** A proper score elicits belief, not competence, effort,
  causal contribution, or honesty about resource cost. Reports can coordinate
  on a wrong equilibrium without ground truth. If a module can affect the
  event or its measurement, scoring can reward tampering.
- **Strongest conventional null.** Temperature/isotonic calibration on held-out
  data plus outcome-backed Brier or log score; use peer prediction only when a
  ground-truth audit is genuinely impossible and include collusive strategies.
- **Principle mapping.** `P-007` for uncertainty-sensitive allocation, `P-009`
  for evaluation, and `P-013` for delayed settlement state.
- **Residual candidate.** Proper scoring is a component—not the novelty—of the
  surviving audit-backed allocation experiment.

For categorical outcomes $y\in\{1,\ldots,K\}$ and reported probabilities
$q_k$, one loss-form Brier score is

$$
B(q,y)=\sum_{k=1}^{K}\left(q_k-\mathbf{1}[y=k]\right)^2.
$$

It is dimensionless. It must be reported separately from energy, latency, and
task utility unless explicit conversion weights are declared.

## 7. Exploration, exploitation, and entrant protection

**Primary sources.** Robbins frames sequential experimental allocation
([DOI: 10.1090/S0002-9904-1952-09620-8](https://doi.org/10.1090/S0002-9904-1952-09620-8)).
Lai and Robbins give asymptotically efficient adaptive allocation rules for
specified parametric bandit families
([DOI: 10.1016/0196-8858(85)90002-8](https://doi.org/10.1016/0196-8858(85)90002-8)).

- **Exact problem.** Allocate limited trials among alternatives with unknown
  reward distributions while minimizing cumulative loss from not always using
  the best arm.
- **Information path.** Chosen arms reveal samples; unchosen arms generally do
  not. Confidence bounds or posterior indices convert this selective feedback
  into an exploration schedule.
- **Timescale.** Per-decision updates over a horizon. Classical stationary
  results do not directly cover specialists that learn, share data, appear,
  disappear, or alter the reward distribution.
- **Assumptions.** Regret guarantees depend on reward class, stationarity,
  independence, observability, and horizon. Cost, latency, safety, and delayed
  rewards require contextual, constrained, or nonstationary extensions.
- **Efficiency mechanism.** Spend trials where uncertainty could change the
  decision, then concentrate traffic as evidence separates alternatives. This
  is the conventional null for “give new modules a chance.”
- **Failure boundary.** An arm is not strategic in the classical model. A
  learned module can change behavior under evaluation, manipulate observed
  reward, or benefit from an identity reset. Regret against a fixed best arm
  can also protect a stale incumbent under regime change.
- **Strongest conventional null.** Contextual bandit with calibrated confidence,
  explicit switching cost, delayed outcomes, and change-triggered restarts.
- **Principle mapping.** `P-001`, `P-004`, and `P-007`.
- **Residual candidate.** Only the interaction between exploration and
  strategic evaluation survives: protected entrant traffic must be coupled to
  identity continuity and withheld audits so that reset or audit-specialized
  modules cannot farm exploration budget.

## 8. Commons governance, monitoring, and sanctions

**Primary sources.** Ostrom, Walker, and Gardner experimentally compare
communication, sanctioning, and their combination in a common-pool-resource
game
([DOI: 10.2307/1964229](https://doi.org/10.2307/1964229)). In their treatments,
sanctioning without communication could consume enough resources to reduce net
benefit, while groups allowed to communicate and choose sanctions sometimes
reached high efficiency; outcomes varied and did not justify “always
cooperate.” Fehr and Gächter find that an opportunity for costly punishment
can sustain high public-good contributions in their laboratory design
([DOI: 10.1257/aer.90.4.980](https://doi.org/10.1257/aer.90.4.980)).

- **Exact problem.** Individuals can privately benefit from overusing or
  undercontributing to a resource whose yield is shared, subtractable, and
  difficult to exclude others from using.
- **Information path.** Participants observe aggregate yield and, depending on
  treatment, individual actions; communication supports agreements; monitoring
  identifies deviations; sanctions alter future payoff.
- **Timescale.** Repeated rounds allow norm formation, retaliation, learning,
  and institutional choice. One-shot payoff analysis does not capture all
  observed behavior.
- **Assumptions.** Laboratory token games simplify identity, group size,
  resource dynamics, communication, culture, and exit. Human social preference
  and emotion are not properties that software modules inherit.
- **Efficiency mechanism.** Locally chosen rules can use contextual knowledge;
  monitoring and credible sanctions can make defection costly; communication
  can coordinate expectations. Sanctions themselves consume resources and can
  trigger error or revenge.
- **Failure boundary.** Punishment without agreement or accurate monitoring can
  reduce total welfare. A central router already owns AI compute and can often
  enforce quotas directly, eliminating the commons problem. If modules cannot
  appropriate compute against policy, “governance” is theater.
- **Strongest conventional null.** Hard quotas, admission control, rate limits,
  and centralized audit. Compare endogenous rule choice only where local
  modules possess information the center lacks or centralized enforcement has
  measurable communication/latency cost.
- **Principle mapping.** `P-006` for feedback limiting overuse, `P-009` for
  monitoring and enforcement, and `P-013` for a shared usage ledger.
- **Residual candidate.** A governance factor—not a new principle—in which
  local specialist groups propose resource rules from private workload
  knowledge, while a maintenance plane verifies outcomes and caps sanction
  cost.

## 9. Robust, computational, and adversarial market design

**Primary sources.** Bergemann and Morris relax common-knowledge assumptions
and characterize robust implementation on richer type spaces
([DOI: 10.1111/j.1468-0262.2005.00638.x](https://doi.org/10.1111/j.1468-0262.2005.00638.x)).
Nisan and Ronen formulate algorithmic mechanism design for computational tasks
with self-interested participants
([DOI: 10.1006/game.1999.0790](https://doi.org/10.1006/game.1999.0790)). Yokoo,
Sakurai, and Matsubara show that VCG is not false-name-proof in their
combinatorial-auction setting and establish an efficiency tradeoff
([DOI: 10.1016/S0899-8256(03)00045-9](https://doi.org/10.1016/S0899-8256%2803%2900045-9)).
Douceur shows why cheap identities undermine redundancy and reputation without
a trusted identity basis
([DOI: 10.1007/3-540-45748-8_24](https://doi.org/10.1007/3-540-45748-8_24)).
Akbarpour and Li model credibility when the auctioneer can make undetectable
deviations and obtain a sharp restriction on credible optimal auctions in
their setting
([DOI: 10.3982/ECTA15925](https://doi.org/10.3982/ECTA15925)).

- **Exact problem.** Preserve desired behavior when higher-order beliefs are
  unknown, computing the exact allocation is hard, participants can split into
  identities or collude, or the mechanism operator itself can deviate from its
  advertised rule.
- **Information path.** Reports travel through an allocation algorithm whose
  code, randomization, audit record, and counterfactual calculations may not be
  visible to participants. Identity and provenance determine which reports are
  treated as independent.
- **Timescale.** One mechanism round plus repeated strategic adaptation.
  Credibility and Sybil resistance are lifecycle properties: code updates,
  module forks, lineage resets, and delayed settlement matter.
- **Assumptions.** Each robustness theorem covers a defined deviation set.
  Ex-post robustness to beliefs does not imply collusion resistance; truthful
  behavior without false names does not imply false-name-proofness; participant
  strategy-proofness does not make the operator credible.
- **Efficiency mechanism.** Prefer rules whose incentives depend on fewer
  unverifiable priors; make allocation and randomness auditable; bind identity
  to costly lineage or certified creation; and explicitly trade optimality for
  robustness when exact optimization or identity assumptions fail.
- **Failure boundary.** A shared log cannot prove that unlogged alternatives
  were considered. Cryptographic identity does not make reports truthful.
  Lineage costs can suppress genuinely useful duplication. Approximate solvers
  can invalidate transfers derived for exact optimization.
- **Strongest conventional null.** A nonstrategic robust optimizer plus access
  control, signed provenance, independent randomized evaluation, and explicit
  adversarial testing. Mechanism design must improve on that stack, not on an
  unaudited softmax router.
- **Principle mapping.** `P-004` for independent diversity and entrant
  protection, `P-009` for audit/verification, and `P-013` for shared provenance
  state.
- **Residual candidate.** Yes as a threat-model requirement for audit-backed
  contestable allocation: module identity, router credibility, collusion, and
  approximate allocation must all be tested. It still does not justify a new
  cross-domain principle.

## Surviving experimental candidate: audit-backed contestable allocation

**Temporary name:** `ECON-R1`

**Registry decision:** hold as an experimental composition; do not assign a
`P-` identifier

**Existing-principle bundle:** `P-001` + `P-003` + `P-004` + `P-007` +
`P-009` + `P-013`

### Exact proposed loop

1. Each persistent specialist has a lineage-bound identity and reports a
   predictive distribution, resource cost, and capability scope for a task.
2. A router allocates task traffic under energy, latency, and safety
   constraints. Ordinary primal--dual prices handle congestion.
3. A risk-weighted but partly unpredictable fraction of tasks is evaluated by
   a withheld outcome, counterfactual checker, or trusted external test.
4. A proper score evaluates probabilistic reports only after the relevant
   outcome matures. Resource-cost reports are compared with metered use.
5. Future traffic, compute budget, or admission priority changes from verified
   performance. This consequence is the economically meaningful “transfer.”
6. A protected exploration reserve gives entrants enough trials to challenge
   incumbents, but identity continuity prevents costless reputation resets.
7. Reports, allocations, measurements, audit-selection commitments, and
   delayed outcomes are written to an append-only record that a separate
   maintenance process can replay.

The candidate is not “modules bid tokens.” Its distinguishing transformation
is **selection under endogenous metric pressure with delayed, partially hidden
verification and contestable records**.

### Minimal update model

For module $i$, let $s_{i,t}$ be its settled outcome score, $m_{i,t}$ metered
resource use, $\hat m_{i,t}$ reported use, and $a_{i,t}\in\{0,1\}$ an audit
indicator drawn after the report from a committed random process. A simple
reputation state is

$$
r_{i,t+1}=(1-\rho)r_{i,t}
+\rho a_{i,t}\left[s_{i,t}-\kappa\lvert m_{i,t}-\hat m_{i,t}\rvert\right].
$$

$r$ and $s$ are dimensionless if a normalized proper score is used; $m$ and
$\hat m$ must share a declared unit such as joules or accelerator-ms;
$\kappa$ converts that unit into score units. This equation is only a test
fixture. It does not establish strategy-proofness and should be attacked for
selective behavior, collusion, audit inference, delayed harm, and identity
splitting.

### Why the residue might be real

Modern modular learners are normally optimized through routing and evaluation.
That can create a principal--agent-like condition without assuming human
motivation: a specialist that earns future traffic from a proxy metric is under
gradient or evolutionary pressure to improve that metric, including by
exploiting measurement gaps. Standard routing papers often treat expert scores
as nonstrategic observations. The residue is therefore an empirical systems
question: does incentive-aware evaluation improve the quality--energy--latency
frontier after the modules adapt to the allocator?

### Collapse conditions

Reject `ECON-R1` as unnecessary if any of the following holds:

- modules trained under the router do not develop materially different
  reporting/evaluation behavior from frozen or nonstrategic modules;
- direct metering plus calibrated uncertainty matches the audit-backed design;
- audits improve benchmark scores but not delayed external outcomes;
- apparent gains disappear after charging audit compute, duplicated
  evaluation, ledger traffic, settlement delay, and entrant reserve;
- reputation can be cheaply reset, transferred, split, or collusively pooled;
- one controller can jointly optimize all “participant” utilities, making the
  transfers behaviorally inert.

## Equal-budget decisive tests

### Common budget contract

Every comparison must hold or report the following over the same task stream:

- total training tokens and accelerator operations;
- wall energy in joules at one declared system boundary, including routing,
  audits, duplicate execution, storage, communication, and idle reserve;
- p50/p99 latency and deadline misses;
- total parameter count, active parameter-steps, and peak memory byte;
- external-state byte, read/write operations, and network byte;
- number of ground-truth labels or trusted evaluator calls;
- number of specialist births/resets and protected entrant trials; and
- final task utility plus each unaggregated safety or quality dimension.

If exact energy matching is infeasible, trace Pareto frontiers and compare at
interpolated equal-energy and equal-latency points. Mechanism state and audit
models count against the same parameter/storage budget as the null. All
policies receive identical task order, delayed outcomes, random seeds, and
allowed observations.

### Test A — applicability gate: cooperative modules

**Question.** Does a market mechanism help when no strategic information
problem exists?

- **Workload.** Frozen specialists with directly meterable energy and
  calibrated quality distributions.
- **Baselines.** Constrained optimizer; Kelly-style primal--dual controller;
  contextual bandit with the same observations.
- **Candidate.** Report/bid/allocation/settlement loop from `ECON-R1`.
- **Prediction.** The candidate should not beat the best null after overhead;
  a gain would more likely indicate a weaker baseline or extra information.
- **Decisive rejection.** If direct optimization matches or dominates, prohibit
  auction language for cooperative routing sections of the architecture.

### Test B — hidden cost and strategic misreporting

**Question.** Can audit-backed consequences improve allocation after modules
adapt to selection pressure?

- **Workload.** Specialists privately observe a task-specific cost or failure
  probability. Training rewards future traffic based on reported confidence
  and visible benchmark performance. Inject opportunities to shift compute,
  latency, or error into an unmetered dimension.
- **Baselines.** Direct report with no settlement; calibrated router with full
  metering; primal--dual allocation; oracle with true type as an upper bound.
- **Candidate.** Outcome-backed proper scores, unpredictable audits, metered
  cost settlement, and future-traffic consequence.
- **Prediction.** Relative to equal-cost baselines, the candidate reduces
  calibration error, cost-report error, and delayed external loss while
  preserving useful throughput.
- **Decisive rejection.** No improvement after adaptation, or improvement only
  because the candidate receives more trusted labels, compute, or outcome
  information.

### Test C — multitask metric gaming

**Question.** Does balanced, delayed evaluation prevent specialists from
optimizing easy visible tasks at the expense of poorly measured ones?

- **Workload.** Two task dimensions share limited specialist effort. One is
  immediately scored; the other has sparse delayed labels. Sweep substitutability
  and proxy correlation.
- **Baselines.** Scalar visible reward; fixed multi-objective weights;
  constrained optimization with a delayed-loss budget; separate production and
  evaluation models.
- **Candidate.** Random withheld audits and horizon-specific settlement
  accounts, with future traffic conditioned on both dimensions.
- **Prediction.** The candidate improves the vector of visible quality,
  delayed quality, calibration, energy, and tail latency—not merely a weighted
  aggregate.
- **Decisive rejection.** A fixed constrained optimizer matches the vector, or
  audits simply move gaming to the audit detector without improving external
  outcomes.

### Test D — entrant capture, identity reset, and collusion

**Question.** Does contestability preserve useful diversity without letting
modules farm exploration or coordinate reports?

- **Workload.** Add a genuinely superior newcomer after incumbent specialists
  have accumulated traffic. Also add clone identities, coordinated reporters,
  and a mediocre module that repeatedly resets.
- **Baselines.** Contextual bandit with restarts; fixed exploration floor;
  signed identity plus direct metering; oracle lineage.
- **Candidate.** Protected entrant reserve, lineage-bound reputation,
  correlation-aware audits, and shared provenance.
- **Prediction.** Faster admission of the superior entrant, bounded traffic to
  resets/clones, and low incumbent quality loss at matched exploration energy.
- **Decisive rejection.** Identity machinery blocks useful entrants, or simple
  restart-aware bandits and duplicate detection match performance.

### Test E — allocator credibility and approximation

**Question.** Are reports still useful when the router uses an approximate
solver or can bias supposedly random audits?

- **Workload.** Give the router an incentive to favor short-term visible score;
  vary solver approximation error and allow undetectable omission of bids or
  audit outcomes in one treatment.
- **Baselines.** Deterministic posted rules; auditable committed randomness;
  independent allocation replay; fully trusted router.
- **Candidate.** `ECON-R1` with and without append-only commitments and replay.
- **Prediction.** Commit/replay reduces undetected deviation and preserves
  calibrated reporting enough to justify its storage/latency cost.
- **Decisive rejection.** The record cannot detect the relevant deviations, or
  a simpler fixed rule is equally robust and more efficient.

## Temporary candidate claims for ledger review

These labels deliberately cannot be linked as official `C-` claims. Promotion
requires a later edit to `research/claims.md` and `research/references.bib`.

| Temporary label | Proposed scoped claim | Evidence status | Primary support | Principle impact |
| --- | --- | --- | --- | --- |
| `TEMP-C-ECON-01` | Under specified concave utilities and controller conditions, decentralized shadow-price feedback can converge toward a proportional-fair network objective. | established in model | Kelly et al. (1998) | supports `P-001`/`P-006`; not novel |
| `TEMP-C-ECON-02` | Self-interested route choice can differ from total-latency optimization; the efficiency bound depends on the latency-function class. | established in model | Roughgarden & Tardos (2002) | failure boundary for `P-005` |
| `TEMP-C-ECON-03` | Second-price/VCG-style truthfulness requires a defined utility, information, identity, and transfer model; it does not transfer automatically to learned modules. | established theorem plus scoped inference | Vickrey (1961); Groves (1973) | constraint on `P-001` |
| `TEMP-C-ECON-04` | Auction objective choice matters: expected seller utility, allocative welfare, energy, and task quality can imply different allocation rules. | established in model | Myerson (1981) | evaluation constraint |
| `TEMP-C-ECON-05` | Under the Myerson--Satterthwaite bilateral private-value assumptions, incentive compatibility, participation, budget balance, and ex-post efficiency cannot generally all be achieved. | established in model | Myerson & Satterthwaite (1983) | prevents impossible design bundles |
| `TEMP-C-ECON-06` | Deferred acceptance provides stability in classical matching, while stronger contract results depend on substitutability and aggregate-demand conditions. | established in model | Gale & Shapley (1962); Hatfield & Milgrom (2005) | supports `P-001`/`P-008` |
| `TEMP-C-ECON-07` | Strong incentives on a measurable task can reduce effort on poorly measured substitute tasks. | established in model | Holmström & Milgrom (1991) | motivates `P-009` evaluation separation |
| `TEMP-C-ECON-08` | Proper scores can elicit a forecaster's belief about a verified event, but do not validate the event definition, observation channel, competence, or causal contribution. | established plus explicit boundary | Brier (1950); Gneiting & Raftery (2007) | supports `P-007`/`P-009` |
| `TEMP-C-ECON-09` | Peer prediction can make truthful reporting an equilibrium under strong signal/prior assumptions, but absence of ground truth leaves equilibrium-selection and collusion risks. | established in model; limitation plausible | Miller et al. (2005) | held component of `ECON-R1` |
| `TEMP-C-ECON-10` | In the audited common-pool experiments, communication and endogenous sanction choice sometimes improved efficiency, whereas sanctions alone could consume net benefit; self-governance was possible but not guaranteed. | established for experimental treatments | Ostrom et al. (1992) | supports `P-009`/`P-013`; not universal |
| `TEMP-C-ECON-11` | False identities and an untrustworthy mechanism operator are distinct attack surfaces not solved by participant-level strategy-proofness. | established in stated models | Yokoo et al. (2004); Douceur (2002); Akbarpour & Li (2020) | threat boundary across `P-004`/`P-009`/`P-013` |
| `TEMP-C-ECON-12` | Selection-trained specialists may game router-visible metrics; delayed randomized audits and real future-traffic consequences may reduce this at equal total cost. | speculative engineering hypothesis | Holmström & Milgrom (1991); Everitt et al. (2017); proposed tests B--E | retain only as `ECON-R1` experiment |

## Deduplication decisions

### No “market allocation” principle

Prices that communicate scarcity are a mathematical implementation of
`P-001` and `P-006`. Bandit allocation is already the engineering null for
`P-001`/`P-004`/`P-007`. Stable matching is an assignment objective within
`P-001` and modular boundaries in `P-008`. None warrants a new `P-` identifier.

### No “economic memory” principle

Reputation, settlement, and bid history are externalized shared state (`P-013`)
with different retention horizons (`P-012`) maintained by an evaluation plane
(`P-009`). Their economic labels do not define a new information lifecycle.

### No “punishment” principle

Sanctions are one feedback actuator. They require monitoring, have cost, and
can cause retaliation or erroneous punishment. Hard quota, admission control,
and rollback remain stronger nulls. The transferable lesson is to account for
enforcement cost and endogenous rule choice, not to give modules human social
emotions.

### Hold one composition, not one new invariant

`ECON-R1` bundles selective allocation, temporary report-to-outcome traces,
entrant protection, uncertainty-aware routing, maintenance/audit, and shared
provenance. Its possible novelty is system behavior under endogenous metric
pressure, not any component. Promotion should require a decisive result from
tests B--E and continued failure of the nonstrategic null in test A.

## Superficial analogies to reject

- **“Experts compete, therefore use an auction.”** Competition in a softmax or
  top-$k$ gate is not strategic bidding. Name the private information, utility,
  feasible lie, and enforceable consequence.
- **“Tokens are money.”** Internal counters are prices only if they represent a
  scarce opportunity cost and change future behavior. Conserved notation is
  insufficient.
- **“VCG makes modules truthful.”** VCG truthfulness does not survive arbitrary
  budget limits, false identities, collusion, interdependent values, or
  approximate allocation.
- **“Stable matching maximizes performance.”** Stability prevents blocking
  pairs under reported preferences; it does not guarantee maximum quality,
  fairness, energy efficiency, or robustness to complementarity.
- **“Goodhart proves every metric fails.”** Optimization pressure can corrupt
  proxies through multiple mechanisms, but the magnitude and even presence of
  failure are empirical. The original Goodhart observation was scoped to
  monetary control.
- **“A proper score proves honesty.”** It elicits an expected-utility
  forecaster's belief about the scored event under the rule's assumptions. It
  does not secure the outcome sensor or establish useful effort.
- **“Peer agreement replaces ground truth.”** Correlated agreement can reward
  shared error, uninformative equilibria, or collusion.
- **“Punishment creates cooperation.”** Sanctions can consume the surplus,
  misfire, or trigger retaliation; Ostrom et al. explicitly found variable
  outcomes and costs.
- **“Bandits solve specialist evolution.”** Classical arms do not strategically
  change reports, create identities, share gradients, or alter their reward
  channel.
- **“A ledger makes the router credible.”** A ledger records selected events;
  it does not prove completeness, counterfactual correctness, or unbiased
  randomization unless those properties are separately committed and audited.

## Recommended next decision

Do not alter the principle registry from this audit. Add the economics claims
only after source-level review, and implement test A before building a market
mechanism. If the nonstrategic equal-budget null dominates—as expected—then
limit `ECON-R1` to workloads where modules adapt to selection and can exploit
hidden information. The first constructive experiment should be test C because
it creates a controlled, measurable incentive failure without requiring claims
of autonomous deception.

## Complete BibTeX for sources cited in this audit

```bibtex
@article{vickrey1961counterspeculation,
  author  = {Vickrey, William},
  title   = {Counterspeculation, Auctions, and Competitive Sealed Tenders},
  journal = {The Journal of Finance},
  year    = {1961},
  volume  = {16},
  number  = {1},
  pages   = {8--37},
  doi     = {10.1111/j.1540-6261.1961.tb02789.x},
  url     = {https://doi.org/10.1111/j.1540-6261.1961.tb02789.x}
}

@article{groves1973incentives,
  author  = {Groves, Theodore},
  title   = {Incentives in Teams},
  journal = {Econometrica},
  year    = {1973},
  volume  = {41},
  number  = {4},
  pages   = {617--631},
  doi     = {10.2307/1914085},
  url     = {https://doi.org/10.2307/1914085}
}

@article{myerson1981optimal,
  author  = {Myerson, Roger B.},
  title   = {Optimal Auction Design},
  journal = {Mathematics of Operations Research},
  year    = {1981},
  volume  = {6},
  number  = {1},
  pages   = {58--73},
  doi     = {10.1287/moor.6.1.58},
  url     = {https://doi.org/10.1287/moor.6.1.58}
}

@article{myerson1983bilateral,
  author  = {Myerson, Roger B. and Satterthwaite, Mark A.},
  title   = {Efficient Mechanisms for Bilateral Trading},
  journal = {Journal of Economic Theory},
  year    = {1983},
  volume  = {29},
  number  = {2},
  pages   = {265--281},
  doi     = {10.1016/0022-0531(83)90048-0},
  url     = {https://doi.org/10.1016/0022-0531(83)90048-0}
}

@article{kelly1998rate,
  author  = {Kelly, Frank P. and Maulloo, Aman K. and Tan, David K. H.},
  title   = {Rate Control for Communication Networks: Shadow Prices,
             Proportional Fairness and Stability},
  journal = {Journal of the Operational Research Society},
  year    = {1998},
  volume  = {49},
  number  = {3},
  pages   = {237--252},
  doi     = {10.2307/3010473},
  url     = {https://doi.org/10.2307/3010473}
}

@article{roughgarden2002selfish,
  author  = {Roughgarden, Tim and Tardos, {\'E}va},
  title   = {How Bad Is Selfish Routing?},
  journal = {Journal of the ACM},
  year    = {2002},
  volume  = {49},
  number  = {2},
  pages   = {236--259},
  doi     = {10.1145/506147.506153},
  url     = {https://doi.org/10.1145/506147.506153}
}

@article{gale1962college,
  author  = {Gale, David and Shapley, Lloyd S.},
  title   = {College Admissions and the Stability of Marriage},
  journal = {The American Mathematical Monthly},
  year    = {1962},
  volume  = {69},
  number  = {1},
  pages   = {9--15},
  doi     = {10.1080/00029890.1962.11989827},
  url     = {https://doi.org/10.1080/00029890.1962.11989827}
}

@article{hatfield2005contracts,
  author  = {Hatfield, John William and Milgrom, Paul R.},
  title   = {Matching with Contracts},
  journal = {American Economic Review},
  year    = {2005},
  volume  = {95},
  number  = {4},
  pages   = {913--935},
  doi     = {10.1257/0002828054825466},
  url     = {https://doi.org/10.1257/0002828054825466}
}

@article{roth1984medical,
  author  = {Roth, Alvin E.},
  title   = {The Evolution of the Labor Market for Medical Interns and
             Residents: A Case Study in Game Theory},
  journal = {Journal of Political Economy},
  year    = {1984},
  volume  = {92},
  number  = {6},
  pages   = {991--1016},
  doi     = {10.1086/261272},
  url     = {https://doi.org/10.1086/261272}
}

@article{holmstrom1979moral,
  author  = {Holmstr{\"o}m, Bengt},
  title   = {Moral Hazard and Observability},
  journal = {The Bell Journal of Economics},
  year    = {1979},
  volume  = {10},
  number  = {1},
  pages   = {74--91},
  doi     = {10.2307/3003320},
  url     = {https://doi.org/10.2307/3003320}
}

@article{holmstrom1991multitask,
  author  = {Holmstr{\"o}m, Bengt and Milgrom, Paul},
  title   = {Multitask Principal--Agent Analyses: Incentive Contracts,
             Asset Ownership, and Job Design},
  journal = {The Journal of Law, Economics, and Organization},
  year    = {1991},
  volume  = {7},
  number  = {Special Issue},
  pages   = {24--52},
  doi     = {10.1093/jleo/7.special_issue.24},
  url     = {https://doi.org/10.1093/jleo/7.special_issue.24}
}

@incollection{goodhart1975problems,
  author    = {Goodhart, Charles A. E.},
  title     = {Problems of Monetary Management: The {U.K.} Experience},
  booktitle = {Papers in Monetary Economics},
  year      = {1975},
  volume    = {1},
  pages     = {1--20},
  publisher = {Reserve Bank of Australia},
  address   = {Sydney, Australia},
  url       = {https://www.econbiz.de/10002525062}
}

@article{campbell1979planned,
  author  = {Campbell, Donald T.},
  title   = {Assessing the Impact of Planned Social Change},
  journal = {Evaluation and Program Planning},
  year    = {1979},
  volume  = {2},
  number  = {1},
  pages   = {67--90},
  doi     = {10.1016/0149-7189(79)90048-X},
  url     = {https://doi.org/10.1016/0149-7189(79)90048-X}
}

@inproceedings{everitt2017corrupted,
  author    = {Everitt, Tom and Krakovna, Victoria and Orseau, Laurent and
               Hutter, Marcus and Legg, Shane},
  title     = {Reinforcement Learning with a Corrupted Reward Channel},
  booktitle = {Proceedings of the Twenty-Sixth International Joint Conference
               on Artificial Intelligence},
  year      = {2017},
  pages     = {4705--4713},
  publisher = {International Joint Conferences on Artificial Intelligence},
  doi       = {10.24963/ijcai.2017/656},
  url       = {https://doi.org/10.24963/ijcai.2017/656}
}

@article{brier1950verification,
  author  = {Brier, Glenn W.},
  title   = {Verification of Forecasts Expressed in Terms of Probability},
  journal = {Monthly Weather Review},
  year    = {1950},
  volume  = {78},
  number  = {1},
  pages   = {1--3},
  doi     = {10.1175/1520-0493(1950)078<0001:VOFEIT>2.0.CO;2},
  url     = {https://doi.org/10.1175/1520-0493(1950)078%3C0001:VOFEIT%3E2.0.CO;2}
}

@article{gneiting2007scoring,
  author  = {Gneiting, Tilmann and Raftery, Adrian E.},
  title   = {Strictly Proper Scoring Rules, Prediction, and Estimation},
  journal = {Journal of the American Statistical Association},
  year    = {2007},
  volume  = {102},
  number  = {477},
  pages   = {359--378},
  doi     = {10.1198/016214506000001437},
  url     = {https://doi.org/10.1198/016214506000001437}
}

@article{miller2005peer,
  author  = {Miller, Nolan and Resnick, Paul and Zeckhauser, Richard},
  title   = {Eliciting Informative Feedback: The Peer-Prediction Method},
  journal = {Management Science},
  year    = {2005},
  volume  = {51},
  number  = {9},
  pages   = {1359--1373},
  doi     = {10.1287/mnsc.1050.0379},
  url     = {https://doi.org/10.1287/mnsc.1050.0379}
}

@article{robbins1952sequential,
  author  = {Robbins, Herbert},
  title   = {Some Aspects of the Sequential Design of Experiments},
  journal = {Bulletin of the American Mathematical Society},
  year    = {1952},
  volume  = {58},
  number  = {5},
  pages   = {527--535},
  doi     = {10.1090/S0002-9904-1952-09620-8},
  url     = {https://doi.org/10.1090/S0002-9904-1952-09620-8}
}

@article{lai1985adaptive,
  author  = {Lai, Tze Leung and Robbins, Herbert},
  title   = {Asymptotically Efficient Adaptive Allocation Rules},
  journal = {Advances in Applied Mathematics},
  year    = {1985},
  volume  = {6},
  number  = {1},
  pages   = {4--22},
  doi     = {10.1016/0196-8858(85)90002-8},
  url     = {https://doi.org/10.1016/0196-8858(85)90002-8}
}

@article{ostrom1992covenants,
  author  = {Ostrom, Elinor and Walker, James and Gardner, Roy},
  title   = {Covenants with and without a Sword: Self-Governance Is Possible},
  journal = {American Political Science Review},
  year    = {1992},
  volume  = {86},
  number  = {2},
  pages   = {404--417},
  doi     = {10.2307/1964229},
  url     = {https://doi.org/10.2307/1964229}
}

@article{fehr2000cooperation,
  author  = {Fehr, Ernst and G{\"a}chter, Simon},
  title   = {Cooperation and Punishment in Public Goods Experiments},
  journal = {American Economic Review},
  year    = {2000},
  volume  = {90},
  number  = {4},
  pages   = {980--994},
  doi     = {10.1257/aer.90.4.980},
  url     = {https://doi.org/10.1257/aer.90.4.980}
}

@article{bergemann2005robust,
  author  = {Bergemann, Dirk and Morris, Stephen},
  title   = {Robust Mechanism Design},
  journal = {Econometrica},
  year    = {2005},
  volume  = {73},
  number  = {6},
  pages   = {1771--1813},
  doi     = {10.1111/j.1468-0262.2005.00638.x},
  url     = {https://doi.org/10.1111/j.1468-0262.2005.00638.x}
}

@article{nisan2001algorithmic,
  author  = {Nisan, Noam and Ronen, Amir},
  title   = {Algorithmic Mechanism Design},
  journal = {Games and Economic Behavior},
  year    = {2001},
  volume  = {35},
  number  = {1--2},
  pages   = {166--196},
  doi     = {10.1006/game.1999.0790},
  url     = {https://doi.org/10.1006/game.1999.0790}
}

@article{yokoo2004falsename,
  author  = {Yokoo, Makoto and Sakurai, Yuko and Matsubara, Shigeo},
  title   = {The Effect of False-Name Bids in Combinatorial Auctions: New
             Fraud in Internet Auctions},
  journal = {Games and Economic Behavior},
  year    = {2004},
  volume  = {46},
  number  = {1},
  pages   = {174--188},
  doi     = {10.1016/S0899-8256(03)00045-9},
  url     = {https://doi.org/10.1016/S0899-8256(03)00045-9}
}

@inproceedings{douceur2002sybil,
  author    = {Douceur, John R.},
  title     = {The Sybil Attack},
  booktitle = {Peer-to-Peer Systems: First International Workshop, IPTPS 2002,
               Revised Papers},
  year      = {2002},
  series    = {Lecture Notes in Computer Science},
  volume    = {2429},
  pages     = {251--260},
  publisher = {Springer},
  doi       = {10.1007/3-540-45748-8_24},
  url       = {https://doi.org/10.1007/3-540-45748-8_24}
}

@article{akbarpour2020credible,
  author  = {Akbarpour, Mohammad and Li, Shengwu},
  title   = {Credible Auctions: A Trilemma},
  journal = {Econometrica},
  year    = {2020},
  volume  = {88},
  number  = {2},
  pages   = {425--467},
  doi     = {10.3982/ECTA15925},
  url     = {https://doi.org/10.3982/ECTA15925}
}
```

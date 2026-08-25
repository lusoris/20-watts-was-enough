# Finance and management science: risk, attention, commitment, governance, and control

**Date:** 2026-08-24\
**Status:** primary-source research audit and CPU-only protocol specification; no
experiment in this audit has been executed\
**Scope:** finance and management-science mechanisms that can qualify risk,
resource, commitment, organizational-attention, control, resilience, capacity,
accounting, and incentive claims in this repository

This audit closes a residual depth gap between the existing economics,
accounting/actuarial, operations-research, high-reliability-organization, and
institutional-governance audits. It does not import market vocabulary as an AI
architecture. A transfer is admissible only where the corresponding system
variables actually exist: constrained resources, action-dependent shared state,
irreversible commitment, separately rooted control evidence, limited review
capacity, or persistent actors with private information and consequences.

No file imported from Google Docs or Gemini is treated as evidence here. All
scientific claims below are anchored in primary theoretical or empirical work;
all legal and supervisory material is kept in a separate normative layer.

## Executive finding

Eight central claim additions are justified: proposed
[`C-1480`](#c-1480) through [`C-1487`](#c-1487). Two apparent additions are
duplicates and must not consume IDs:

1. queue conservation, variability, and heavy-traffic behavior are already
   central claims `C-659`--`C-661`; and
2. multitask incentive distortion, public-target gaming, and audit-backed
   contestability are already central claims `C-139`, `C-1433`, and `C-144`.

The ten protocols `FM-T01`--`FM-T10` therefore include two maturation and
source-reproduction tracks without creating duplicate claims. No mechanism in
this audit justifies a new `P-` principle or a new candidate. The durable residue
is a set of stronger measurement, mature-null, scope, and falsification
contracts.

## Exact scope and exclusions

### Included

1. formal risk aggregation, tail measures, and dependence;
2. endogenous market/funding-liquidity and forced-action feedback;
3. portfolio construction under estimated moments and concentration
   constraints;
4. organizational attention as a bounded, procedurally routed resource;
5. irreversible commitment and real-option value;
6. internal-control scope, independence, capacity, and change;
7. EU/German operational-resilience governance;
8. queues, utilization, variability, and deliverable capacity;
9. internal transfer prices and local-versus-system accounting boundaries; and
10. multitask incentives, reporting manipulation, and target gaming.

### Excluded

1. trading or investment advice, asset-price prediction, cryptocurrency,
   monetary policy, consumer-credit decisions, insurance pricing, and tax
   transfer pricing;
2. claims that a regulation proves scientific effectiveness;
3. US or Asian law as the project's normative baseline;
4. generic organizational-culture prescriptions or human-subject
   interventions;
5. production-system incidents, private financial data, live employee
   telemetry, or real capital allocation;
6. legal advice or a conclusion that this repository or a future system is
   compliant;
7. any assertion that a finance mechanism is intrinsically intelligent,
   biological, or brain-like;
8. secondary reviews as scientific evidence for a central claim; and
9. architecture promotion before the CPU-only protocols beat their mature
   nulls.

## Terminology and inference firewall

The following terms remain distinct throughout this audit:

| Term | Meaning here | Not interchangeable with |
| --- | --- | --- |
| loss | a declared adverse outcome in named units | uncertainty, probability, utility, or harm in another unit |
| tail level | a registered probability level and horizon | a universal safety threshold |
| liquidity | ability to execute a required exchange or meet a due obligation inside its window | solvency, booked reserve, nominal capacity, or mean throughput |
| diversification | a loss/exposure property under declared weights and dependence | component count, model count, or organizational variety |
| attention | finite human or organizational review/decision capacity routed by procedures | transformer attention, token count, FLOPs, or information availability |
| option | a preserved feasible future action with expiry and opportunity cost | delay, indecision, or free rollback |
| control independence | separation of relevant evidence, data, model, credential, authority, and incentive roots | two labels, two people, or two processes sharing every root |
| resilience | service- and horizon-qualified ability to continue, degrade, recover, and remain ready | capital, backup existence, mean uptime, or a completed incident report |
| capacity | deliverable work under skill, authority, dependency, timing, and failure constraints | nameplate, allocation, budget, or booked headroom |
| internal price | a rule for decentralized allocation in declared units | money, social value, truth, legality, or system welfare |
| incentive gaming | action or reporting chosen in response to a consequence structure | ordinary uncertainty, random error, or model misspecification |

Theoretical papers establish results only inside their formal assumptions.
Observational studies establish scoped associations, not universal causal
effects. Official sources establish scoped requirements or supervisory
expectations, not scientific effectiveness.

## EU/German normative firewall

These sources define scoped duties or technical comparators. They do not raise
an experimental claim's evidence status.

| Source | Scoped use | What it cannot establish |
| --- | --- | --- |
| [Regulation (EU) 2022/2554, DORA](https://eur-lex.europa.eu/eli/reg/2022/2554/oj/eng), especially Articles 5--6, 11--13 and 24--27 | governance, ICT continuity, response/recovery, function-qualified RTO/RPO, testing, learning, and third-party risk for in-scope financial entities | generic AI resilience, successful recovery, or lower recurrence |
| [Directive (EU) 2024/1619, CRD VI](https://eur-lex.europa.eu/eli/dir/2024/1619/oj/eng), amending CRD Articles 74 and 76 | governance, internal controls, independent control functions, authority, resources, and access in the defined banking scope | that role separation creates independent evidence or detects model error |
| [EBA/GL/2021/05](https://www.eba.europa.eu/publications-and-media/press-releases/eba-publishes-its-final-guidelines-internal-governance) | current final EBA internal-governance guidance; the EBA source page records that a revision is under review | binding applicability outside its scope or empirical effectiveness |
| [German AktG § 91](https://www.gesetze-im-internet.de/aktg/__91.html) | early-risk detection under paragraph 2 and an appropriate/effective internal-control and risk-management system for listed companies under paragraph 3 | a universal control architecture or an automatic effectiveness certificate |
| [BaFin MaRisk 06/2024](https://www.bafin.de/SharedDocs/Downloads/DE/Rundschreiben/dl_rs_06_2024_MaRisk_pdf_BA.pdf), especially AT 4.4 | German banking-supervisory expectations for independent risk control, authority, information access, resources, reporting, and internal audit | a generic duty for this project, independence of data/model roots, or correctness |
| existing Solvency II sources under `C-1268`/`C-1269` | scoped prudential calibration, stress testing, and internal-model governance | a universal risk percentile, AI safety threshold, or model truth |

Normative applicability must be rechecked for the exact actor, entity, role,
system, provision, jurisdiction, and date. A synthetic protocol in this audit
cannot establish compliance.

## Claim-ledger proposals

### C-1480

- **Statement:** Value-at-Risk need not be subadditive, while a carefully
  defined Expected Shortfall is coherent under its mathematical conditions;
  neither measure validates the loss variable, horizon, confidence level,
  dependence model, sample support, valuation, liquidity, or intervention
  assumptions.
- **Status:** established.
- **Evidence note:** the risk-functional results are formal. Estimator quality,
  model selection, operational transfer, and liquidity remain empirical and
  decision-qualified.
- **Primary sources:** `ArtznerEtAl1999CoherentRisk`,
  `AcerbiTasche2002ExpectedShortfall`.
- **Rationale:** an aggregation rule and an estimated tail are separate.
  Coherence constrains the functional; it does not prove that the fitted
  distribution, dependence, or operational boundary is correct.
- **Proposed AI translation:** every pooled failure or risk claim carries loss
  units, horizon, tail level, aggregation rule, dependence version, effective
  tail count, liquidity/action model, uncertainty, and abstention state.
- **Efficiency mechanism:** allocate expensive tail simulation and scenario
  expansion only where a cheaper bound cannot resolve a registered decision;
  charge abstention, tail sampling, and model maintenance.
- **Failure modes:** coherence called calibration; tiny effective tail sample;
  mixed units; post-hoc tail level; component count called diversification;
  omitted common roots; static losses despite action feedback; regulatory
  percentile transferred as a scientific constant.
- **Measurable prediction:** in `FM-T01`, a typed ES/scenario record will expose
  false-safe aggregation decisions that a scalar VaR or diagonal-covariance
  report accepts, while abstention and estimation cost remain visible.
- **Open question:** can a compact tail/dependence record improve decisions
  beyond proper ES, scenario stress, covariance propagation, robust
  optimization, and calibrated abstention at equal compute and coverage?
- **Used by:** `FM-T01`, `concept/30-sparse-predictive-compute.md`,
  `concept/70-system-synthesis.md`, `concept/80-energy-model.md`,
  `concept/90-research-roadmap.md`, `math/measurement-contract.md`, and
  `math/efficiency-model.md`.
- **Disposition:** promote audit-local `REC-AFR-06`; qualify `C-183`, `C-525`,
  `C-671`, and `C-1268`; map to P-004/P-009; no new principle.

### C-1481

- **Statement:** in the cited models, funding constraints, margins or solvency
  limits, forced sales, price impact, and overlapping exposures can form a
  positive-feedback loop in which individually defensive actions amplify
  system loss.
- **Status:** established.
- **Evidence note:** established inside the cited financial models. An AI
  translation is plausible only when the same action--shared-state--forced-
  response structure exists.
- **Primary sources:** `BrunnermeierPedersen2009Liquidity`,
  `CifuentesFerrucciShin2005Contagion`.
- **Rationale:** the action changes the shared state used to trigger the next
  action; an exogenous one-pass risk score therefore misses the fixed point.
- **Proposed AI translation:** apply only when reclamation, migration,
  throttling, deactivation, or reserve calls reduce shared headroom or fallback
  quality and force other modules to respond. Ordinary congestion without this
  feedback remains a queue/control problem.
- **Efficiency mechanism:** solve the feedback fixed point or a certified bound
  only near action thresholds; use cheaper one-pass estimates when the measured
  impact parameter is effectively zero.
- **Failure modes:** market terminology applied to cooperative modules;
  arbitrary price-impact coefficient; no forced-action threshold; centralized
  controller omitted; solvent state confused with deadline liquidity; static
  correlation substituted for action feedback; intervention cost externalized.
- **Measurable prediction:** `FM-T02`'s one-pass and fixed-point models coincide
  when impact is zero, but their forecast error separates as overlap, impact,
  and funding sensitivity rise; a staged controller earns credit only against
  the full fixed-point and centralized-control nulls.
- **Open question:** does an approximate local feedback model ever beat mature
  fixed-point clearing, constrained control, and robust optimization after
  communication, reserve, and convergence costs?
- **Used by:** `FM-T02`, `concept/01-working-architecture.md`,
  `concept/10-neurogenesis-and-routing.md`,
  `concept/30-sparse-predictive-compute.md`,
  `concept/70-system-synthesis.md`, `concept/80-energy-model.md`, and
  `concept/90-research-roadmap.md`.
- **Disposition:** P-006 feedback plus P-008 containment and P-009 maintenance;
  Candidates 012/013; no liquidity principle.

### C-1482

- **Statement:** mean--variance selection depends on expected returns,
  covariance, weights, and constraints; under estimation error, a
  non-negativity constraint can reduce out-of-sample risk even when it is not a
  true population constraint, so asset or expert count alone does not establish
  diversification or optimality.
- **Status:** established.
- **Evidence note:** the result is model-, estimator-, and sample-qualified. A
  constraint can exclude a real hedge in another regime.
- **Primary sources:** `Markowitz1952PortfolioSelection`,
  `JagannathanMa2003Constraints`.
- **Rationale:** optimization can amplify error in estimated moments. A
  constraint may act as regularization, but is not universally safer.
- **Proposed AI translation:** ensemble or expert portfolios report exposure
  factors, estimated dependence, weight concentration, turnover, regime,
  effective sample size, liquidity/switch cost, and out-of-sample risk.
- **Efficiency mechanism:** prefer simple or regularized allocation while
  estimation uncertainty dominates the forecast benefit of a more flexible
  optimizer; spend extra estimation only when it changes the decision.
- **Failure modes:** oracle covariance; same data for selection and evaluation;
  static dependence; hidden shorting or negative routing; survivor selection;
  transaction and switching costs omitted; constrained result declared
  universally safer.
- **Measurable prediction:** in `FM-T03`, unconstrained sample optimization
  becomes less stable as dimension/sample ratio rises; constraints or shrinkage
  improve some out-of-sample regimes but lose that advantage when estimates are
  sufficiently accurate or a required hedge is excluded.
- **Open question:** can an adaptive constraint selector beat shrinkage,
  factor, norm, turnover, and robust-optimization nulls without selecting its
  regime on test outcomes?
- **Used by:** `FM-T03`, `concept/10-neurogenesis-and-routing.md`,
  `concept/30-sparse-predictive-compute.md`,
  `concept/50-grokking-and-pruning.md`, `concept/70-system-synthesis.md`, and
  `concept/90-research-roadmap.md`.
- **Disposition:** refine `C-183`/`C-525` and P-001/P-004; no finance-derived
  diversity principle.

### C-1483

- **Statement:** organizational rules, resources, relationships, and
  communication procedures can determine which issues and responses receive
  decision-maker attention; supplying more information therefore need not
  increase detection or action under a fixed attention budget.
- **Status:** plausible.
- **Evidence note:** the source is a primary theoretical organizational
  framework, not a universal causal effect and not evidence that transformer
  attention is human or organizational attention.
- **Primary source:** `Ocasio1997Attention`.
- **Rationale:** information must enter a finite noticing, interpretation,
  prioritization, acknowledgement, decision, and action path before it can
  change an outcome.
- **Proposed AI translation:** treat reviewer/operator attention as a queue with
  routing rules, deadlines, source/status bias, interruption cost, protected
  sampling, escalation authority, and missed-work opportunity cost.
- **Efficiency mechanism:** allocate scarce review to calibrated expected
  consequence while retaining a protected reference channel that can reveal
  score drift and low-score severe events.
- **Failure modes:** tokens, FLOPs, and human attention collapsed; omniscient
  severity score; alert volume used as detection; no reviewer-service
  distribution; silent queue displacement; authority without response
  capacity; synthetic result generalized to employees.
- **Measurable prediction:** under fixed reviewer-minutes, undifferentiated
  alert inflation in `FM-T04` increases rare severe misses or routine
  displacement; calibrated priority plus protected low-score sampling improves
  the joint frontier only in the registered regimes.
- **Open question:** can a learned attention router beat calibrated priority,
  earliest-deadline, queue-aware, protected-sampling, and constrained-scheduling
  baselines without privileged severity or extra reviewer time?
- **Used by:** `FM-T04`, `concept/01-working-architecture.md`,
  `concept/30-sparse-predictive-compute.md`,
  `concept/60-hardening-and-factual-memory.md`,
  `concept/70-system-synthesis.md`, and `concept/90-research-roadmap.md`.
- **Disposition:** P-001/P-002/P-007/P-009/P-011/P-013 and Candidates
  011/012/020; no attention principle.

### C-1484

- **Statement:** in the cited stochastic investment model, uncertainty plus
  irreversible commitment can make waiting valuable even when immediate net
  present value is positive; this is not a universal rule to delay because
  expiry, delay loss, reversibility, observability, and alternative
  opportunities can remove or reverse the value.
- **Status:** established.
- **Evidence note:** established within the formal stopping model; transfer to
  staged AI deployment is unvalidated.
- **Primary source:** `McDonaldSiegel1986Waiting`.
- **Rationale:** “act now” and “retain the right to act later” are different
  feasible sets.
- **Proposed AI translation:** value staged deployment, pilot, shadow
  execution, reserved capacity, rollback, or deferred structural commitment
  only after charging delay, observation, reservation, lost-service, and
  irreversible partial effects.
- **Efficiency mechanism:** preserve an option only when expected information
  or state change can alter a later decision enough to repay the reservation
  and delay cost.
- **Failure modes:** procrastination called optionality; option assumed to
  survive; rollback leaks external effects; risk-neutral valuation imported
  without justification; future information not modeled; reservation capacity
  free; sunk and recoverable costs mixed.
- **Measurable prediction:** `FM-T05`'s exact dynamic-programming value minus
  immediate-rule value rises with uncertainty and unrecoverable commitment in
  the defined model, but shrinks with short expiry, high delay loss, or cheap
  reversibility.
- **Open question:** can a cheap staged policy match exact or robust dynamic
  programming under jump, drift, and misspecified information value after
  reservation and rollback leakage are charged?
- **Used by:** `FM-T05`, `concept/01-working-architecture.md`,
  `concept/40-memory-and-consolidation.md`,
  `concept/60-hardening-and-factual-memory.md`,
  `concept/70-system-synthesis.md`, `concept/90-research-roadmap.md`, and
  `math/state-qualified-intervention.md`.
- **Disposition:** P-003/P-004/P-009/P-012; Candidates
  001/005/009/010. Real-option mathematics is a mature commitment null, not a
  new principle.

### C-1485

- **Statement:** control effectiveness depends on the controlled risk,
  organizational complexity and change, evidence roots, authority, information
  access, reviewer resources, queueing, and correction path; role separation or
  checklist completion alone does not establish effective control.
- **Status:** plausible.
- **Evidence note:** the scientific study is observational and US financial-
  reporting scoped. European/German sources impose or describe governance
  expectations; neither source type proves the proposed AI composition.
- **Scientific source:** `DoyleGeMcVay2007InternalControl`.
- **Normative sources:** `EU2024CRDVI`, `EBA2021InternalGovernance`,
  `GermanyAktG91`, and `BaFin2024MaRisk`.
- **Rationale:** nominal independence does not separate correlated evidence
  roots, and a control that cannot receive information or act inside the
  decision window is not operationally effective.
- **Proposed AI translation:** record proposer, approver, executor, monitor,
  evidence roots, shared dependencies, authority, capacity, sampling frame,
  queue, exceptions, override, remediation, and verified effect.
- **Efficiency mechanism:** use risk-based review and independently rooted
  reconciliation where expected severe-loss reduction repays review work;
  retain direct automation for low-consequence, fully observable cases.
- **Failure modes:** compliance equals correctness; two roles share model,
  data, or credential roots; overloaded reviewer; independence without access;
  controls frozen through change; false blocks and bypass omitted; management
  self-certifies; audit queue externalized.
- **Measurable prediction:** in `FM-T06`, a same-root two-person check adds
  little against planted shared-source failures, while independently rooted
  evidence and risk-based review reduce severe escapes only while authority and
  review capacity remain adequate.
- **Open question:** can a versioned control selector outperform mature RBAC,
  reconciliation, sampled audit, anomaly detection, change control, and
  independent review without control proliferation or hidden queue cost?
- **Used by:** `FM-T06`, `concept/60-hardening-and-factual-memory.md`,
  `concept/70-system-synthesis.md`, `concept/90-research-roadmap.md`,
  `math/contestable-decision-record.md`, and `math/measurement-contract.md`.
- **Disposition:** `C-525`, `C-1265`, `C-1269`, P-008/P-009/P-013, and
  Candidates 009/014/020; no “three lines” principle.

### C-1486

- **Statement:** for in-scope financial entities, DORA requires governance,
  function-qualified continuity and recovery objectives, response/recovery
  arrangements, testing, learning, and third-party-risk management; backup
  existence, mean uptime, capital adequacy, or an incident report does not by
  itself establish restoration within a declared service and data-loss
  tolerance.
- **Status:** established.
- **Evidence note:** established as a scoped legal/governance statement. Any
  claim that the practices improve an AI system remains an empirical
  hypothesis.
- **Authoritative source:** `EU2022DORA`, especially Articles 5--6, 11--13 and
  24--27.
- **Rationale:** continuity, degraded service, recovery time, recovery point,
  correctness, dependency closure, and second-event readiness can move in
  different directions.
- **Proposed AI translation:** identify critical service, dependency closure,
  accepted/correct service, impact tolerance, RTO, RPO, backup lineage, restore
  test, degraded mode, authority, third party, second-event state, and full
  reserve/drill cost.
- **Efficiency mechanism:** rehearse and retain recovery paths in proportion to
  declared criticality and failure exposure; do not maintain every path at the
  same cost without a service case.
- **Failure modes:** DORA label used outside scope; paper plan untested;
  failover shares root; backup is corrupt or inaccessible; RTO excludes
  diagnosis or authorization; recovery produces stale or wrong service;
  third-party concentration omitted; one event consumes all reserve.
- **Measurable prediction:** in `FM-T07`, tested restoration with independent
  roots reduces synthetic RTO/RPO breaches versus untested redundancy for
  covered failures, but no claimed advantage survives omitted compound/common-
  cause failures or unmatched reserve.
- **Open question:** does Candidate 011/012 add anything beyond a mature SRE,
  continuity, tested-backup, dependency, incident-command, and change-control
  stack at equal reserve and operator work?
- **Used by:** `FM-T07`, `concept/26-reliability-under-mission-profiles.md`,
  `concept/60-hardening-and-factual-memory.md`,
  `concept/70-system-synthesis.md`, `concept/80-energy-model.md`, and
  `concept/90-research-roadmap.md`.
- **Disposition:** `C-175`, `C-178`, `C-183`, `C-184`, `C-185`,
  P-002/P-003/P-008/P-009/P-012/P-013, and Candidates 011/012. The residue is
  a mature governance/evaluation contract.

### C-1487

- **Statement:** in the cited decentralized-firm model, a market or internal
  transfer price aligns divisional decisions with the whole-firm objective only
  under specified competition, opportunity-cost, demand, capacity, and
  interdependence conditions; local profit or cost reduction alone does not
  establish system efficiency.
- **Status:** established.
- **Evidence note:** established within the formal model. BaFin allocation
  requirements are a scoped normative comparator, not scientific validation of
  one price rule.
- **Primary source:** `Hirshleifer1956TransferPricing`.
- **Normative comparator:** `BaFin2024MaRisk`.
- **Rationale:** a local ledger can omit system externalities, alternate uses,
  shared constraints, and downstream service loss.
- **Proposed AI translation:** internal compute tokens, quotas, shadow prices,
  chargebacks, or module scores must reconcile to accepted system service,
  externalities, constraints, and opportunity costs in native units.
- **Efficiency mechanism:** decentralize with a simple price only when its
  assumptions and reconciliation hold; otherwise use full-system or primal--
  dual control and charge coordination.
- **Failure modes:** internal token called money; local ledger excludes latency,
  energy, quality, reserve, or displaced work; competitive-market assumptions
  absent; transfer price chosen after results; nonconvex setup or capacity
  ignored; centralized full-information null omitted.
- **Measurable prediction:** `FM-T09` produces local/system sign reversals when
  externalities, scarce capacity, or alternate uses are omitted; the reversal
  disappears in the registered frictionless/aligned case.
- **Open question:** can a learned internal allocator beat centralized,
  decomposition, robust, and ordinary shadow-price controllers under private
  information without invoking market language as the mechanism?
- **Used by:** `FM-T09`, `concept/10-neurogenesis-and-routing.md`,
  `concept/30-sparse-predictive-compute.md`,
  `concept/70-system-synthesis.md`, `concept/80-energy-model.md`,
  `concept/90-research-roadmap.md`, and `math/material-service-state.md`.
- **Disposition:** P-001/P-006/P-009/P-013 and Candidates 008/013; no market
  principle.

## Common CPU-only protocol contract

Every protocol below incorporates this section. No local protocol may silently
relax it.

### Frozen generation and partitions

1. Protocol version: `FM-v1`.
2. Calculations use IEEE-754 binary64.
3. PRNG: NumPy `PCG64DXSM`; persist the NumPy version and generated-array
   SHA-256.
4. Seed: low 64 bits of
   `SHA256("FM-v1|FM-Txx|split|regime|replicate")`.
5. Development: 64 replicates, `split=dev`; tuning and diagnostics only.
6. Confirmation: 256 untouched replicates, `split=confirmation`; run once
   after configuration and analysis hashes are frozen.
7. Transfer: 128 replicates for each of two protocol-specific changed DGPs,
   `split=transfer-a` and `split=transfer-b`; no tuning.
8. All arms receive paired exogenous streams. Oracle arms may receive
   privileged state only when labelled as ceilings, never as deployable
   comparators.
9. Invalid, missing, crashed, or non-finite runs remain in the denominator.
   More than 1% invalid confirmation runs aborts inference; the invalid runs
   still remain in the published terminal-status table.

### Total terminal-status and abstention contract

1. Every scheduled replicate-arm row terminates exactly once as `ok`,
   `abstained`, `invalid`, `timeout`, `resource_exceeded`, or
   `hard_gate_failed`. No row is deleted or replaced.
2. Before confirmation, each protocol writes `analysis-plan.json` containing
   its eligible denominator, scalar seed loss, component weights, finite
   worst-case loss $L_{\max}$, protected endpoints, directions, margins, and
   fallback. An `invalid`, `timeout`, `resource_exceeded`, or
   `hard_gate_failed` row receives $L_{\max}$ and the adverse value of every
   protected endpoint. This deterministic assignment, rather than a missing
   value, is used in inference. Every additive abstention or fallback charge is
   capped at the same $L_{\max}$.
3. Abstention is an action. It invokes the protocol's named mature safe
   fallback, receives that fallback's outcome, and adds the declared
   abstention charge. Non-safety answer or action coverage may not be more than
   one percentage point below the relevant mature null. A protocol-specific
   stricter floor overrides this common floor.
4. A run may not gain by dropping work, ending before the common root stream,
   suppressing retries, omitting a loss, or declaring an unsupported answer.
   Root arrivals, cases, opportunities, and terminal outcomes are reconciled in
   native count and value units.
5. Hard integrity constraints have zero margin. Softer protected margins below
   are synthetic project choices, not legal limits, physical constants,
   recommended controls, or prior evidence of effect.

### Mature-null and budget rule

Each candidate receives the same observations, action authority, reserve, task
opportunities, and deadline. Routing, audit, control, memory, simulation,
optimization, abstention, retry, and failed-work costs are charged. A candidate
cannot win by receiving an oracle variable, extra retries, more capacity, or a
wider action set.

### Statistics and multiplicity

1. Freeze one scalar seed-level primary contrast and one practical-effect
   margin per protocol. Every contrast is oriented so a positive value supports
   the registered effect. If proposed arm $A$ must reduce loss relative to
   comparator $B$ by fraction $r$, use the shifted paired contrast
   $D_s=(1-r)L_{s,B}-L_{s,A}$, not an unspecified ratio of aggregates.
   Absolute gates subtract their registered margin from the paired improvement.
   Difference-in-differences and interactions state their cell weights locally.
2. Report per-arm distributions, paired differences, mean, median, p50/p95/p99
   where meaningful, and Monte Carlo standard error.
3. For $n\le20$, enumerate all sign flips. Otherwise generate exactly 100,000
   IID Rademacher sign vectors with `PCG64DXSM` seed equal to the low 64 bits of
   `SHA256("FM-v1|FM-Txx|confirmation|primary-sign")`. For the frozen oriented
   seed contrasts, set $T_{\mathrm{obs}}=n^{-1}\sum_sD_s$ and
   $T_b=n^{-1}\sum_s\xi_{b,s}D_s$. Use the conservative plus-one Monte Carlo
   p-value

   $$
   p=\frac{1+\#\{T_b\ge T_{\mathrm{obs}}\}}{100001}.
   $$

   Persist the vectors' SHA-256. This is a Monte Carlo randomization test, not
   an exact test when sign flips are sampled.
4. Generate exactly 100,000 paired seed-cluster bootstrap resamples from the
   independently derived low-64-bit
   `SHA256("FM-v1|FM-Txx|confirmation|primary-bootstrap")` seed. For observed
   seed contrasts $D_1,\ldots,D_n$, define
   $\bar D=n^{-1}\sum_sD_s$ and $SE=s_D/\sqrt n$, using the sample standard
   deviation with divisor $n-1$. In bootstrap draw $b$, sample one length-$n$
   seed-index vector with replacement, keep every arm/cell belonging to a
   selected seed together, and compute $\bar D_b^*$,
   $SE_b^*=s_{D,b}^*/\sqrt n$, and

   $$
   t_b^*=\frac{\bar D_b^*-\bar D}{SE_b^*}.
   $$

   If $SE_b^*=0$, set $t_b^*=0$ when its numerator is exactly zero and to the
   corresponding signed infinity otherwise. If observed $SE=0$ and all finite
   $D_s$ are identical, the interval is the point $[\bar D,\bar D]$; any other
   observed zero-variance state is invalid. With the 100,000 finite-or-infinite
   studentized values sorted ascending, let $q_{.005}$ and $q_{.995}$ be the
   500th and 99,500th order statistics (one-based) and report the 99%
   percentile-$t$ interval
   $[\bar D-q_{.995}SE,\bar D-q_{.005}SE]$. Persist every bootstrap index array
   and its SHA-256. Apply Holm--Bonferroni at familywise $\alpha=0.05$ across
   `FM-T01`--`FM-T10` primary tests. A skipped, ineligible, or failed protocol
   contributes $p=1$.
5. Protected endpoints use a separately derived
   `SHA256("FM-v1|FM-Txx|confirmation|protected-bootstrap")` seed and exactly
   100,000 paired seed-cluster resamples. For endpoint $j$, use the same
   studentization and zero-variance convention as item 4 to obtain
   $t_{b,j}^*$. Set $M_b=\max_j|t_{b,j}^*|$ over every protected endpoint in the
   protocol, including every registered subgroup/cell endpoint. The 99,000th
   sorted $M_b$ (one-based) is $c_{.99}$; report simultaneous intervals
   $[\bar D_j-c_{.99}SE_j,\bar D_j+c_{.99}SE_j]$ and evaluate the locally
   declared one-sided direction/margin from the appropriate bound. Signed
   infinity propagates into $M_b$; an indeterminate non-finite state is invalid.
   Persist resample hashes. A hard constraint violation has zero margin and
   cannot be averaged away.
6. With 256 confirmation seeds, the normal planning approximation at the
   conservative first Holm threshold 0.005 has about 0.92 one-sided power
   for a standardized paired effect $d=0.25$:
   $\Phi(16\times0.25-z_{0.995})\approx0.923$. This is sensitivity planning, not an
   expected effect. Development simulation must estimate at least 0.90 power
   for the local practical-effect margin; otherwise the protocol is marked
   infeasible before confirmation rather than weakening its threshold.
7. Transfer results receive 95% intervals computed by the same percentile-$t$
   construction (order statistics 2,500 and 97,500 of 100,000). Unless a local
   protocol explicitly preregisters a null-reproduction boundary, **each** of
   Transfer A and Transfer B must retain direction, at least half the registered
   confirmation practical effect, and every hard gate. A null-reproduction
   transfer instead passes only its locally stated equality/boundary gate and is
   never counted as evidence for a positive effect. Transfers are not used to
   retune.
8. Publish all arms and regimes; no selective regime removal.

### Threshold status

Every numeric loss limit, effect size, non-inferiority margin, correlation
bound, utilization, horizon, capacity, and resource threshold below is a
preregistered synthetic DGP parameter, falsification tolerance, or minimum
practical effect chosen by this project. None is a measured effect, a legal or
supervisory requirement, a recommended operating value, or an imported
physical constant unless a source and unit explicitly say otherwise.

### Resource and energy boundary

1. CPU only: no GPU, cluster, external API, or network data.
2. Charge process-tree user/system CPU seconds, wall seconds, peak RSS bytes,
   disk read/write bytes, serialized artifacts, generated events, fitting,
   oracle construction, audits, retries, and failed runs.
3. If a calibrated whole-machine meter or declared RAPL package/DRAM domains
   are available, report joules, sampling resolution, idle treatment, domain
   coverage, and uncertainty. Otherwise energy is **not measured**, and no
   joule or energy-efficiency conclusion is allowed.
4. Smoke gate: eight replicates per arm must finish in 15 minutes, peak below
   4 GiB, and project the full protocol below 12 core-hours and 8 GiB. If not,
   optimize implementation without changing the DGP or record the protocol as
   infeasible.
5. No efficacy peeking or early success stop. Stop only for resource
   infeasibility, invalid implementation, numerical failure, or a violated hard
   safety/integrity gate.
6. Process electricity, human review minutes, synthetic currency, and CPU time
   remain separate ledgers. None is converted to joules or carbon without the
   calibrated measurement boundary in item 3.

## CPU-only protocol specifications

### FM-T01 — Tail aggregation and estimator boundary

**Claims tested:** proposed C-1480; existing C-183, C-525, C-671, and C-1268.

**Frozen DGP.** Simulate 32 loss channels. For channel $i$,

$$
L_i=\sqrt{\rho}Z_0+\sqrt{1-\rho}Z_i+b_iJ,
\qquad b_i=1+0.5(i\bmod 4).
$$

$Z_0,Z_i$ are independent standard normal draws with unit scale in synthetic
loss units in development and are replaced as specified below. On a common-jump event,
$J=4U^{-1/\alpha}$ for $U\sim\operatorname{Uniform}(0,1)$; otherwise $J=0$.
Thus the jump is a Pareto-I loss with scale 4 synthetic loss units and the
listed shape $\alpha$. Use **30,000 fitting draws** and an independent 100,000-
draw evaluation stream per replicate. The expected fitting tail counts are 300
at 0.99 and 750 at 0.975, both above the frozen 250-observation abstention
floor. Evaluate equal weights $w_i=1/32$ and a concentrated vector with weights
$(0.40,0.30,0.20,0.10)$ on the first four channels and zero elsewhere.

- Development: $\rho=0.15$, jump probability $0.005$, Pareto shape $3$, scale
  $4$.
- Confirmation: Student-$t_5$ standardized to unit variance, $\rho=0.35$,
  jump probability $0.01$, Pareto shape $2.5$, scale $4$.
- Transfer A: standardized Student-$t_3$, $\rho=0.60$, jump probability $0.02$,
  Pareto shape $1.8$, scale $4$.
- Transfer B: retain the confirmation jump process and use
  $X_i=\sqrt{0.05}G+\sqrt{0.40}B_{k(i)}+\sqrt{0.55}I_iE_i/\sqrt{0.60}$ in place
  of the Gaussian-copula term, where
  $G,B_1,B_2,E_i$ are independent standardized Student-$t_5$ draws,
  $k(i)=1$ for $i\le16$ and 2 otherwise, and
  $I_i\sim\operatorname{Bernoulli}(0.60)$. This gives a 40% idiosyncratic
  point mass, unit marginal variance, within-block covariance 0.45, and
  between-block covariance 0.05 before the common jump.

**Arms.** Mean--variance proxy
$\widehat R_{0.99}=\bar L+z_{0.99}s_L$, where $z_{0.99}$ is the standard-normal
0.99 quantile; empirical 0.99 VaR; naive mean above
the sample quantile; Acerbi--Tasche empirical ES at 0.975 and 0.99 with
fractional mass at the quantile; covariance-based Gaussian Monte Carlo ES; a
fixed common-jump scenario-stress loss; and an oracle distributional ES ceiling.

For every non-oracle estimator and portfolio, construct the decision interval
from exactly 1,999 paired nonparametric bootstrap resamples of the 30,000 fitting
rows, using a separately derived
`SHA256("FM-v1|FM-T01|split|regime|replicate|tail-bootstrap")` seed shared by
all arms and portfolios. The one-sided 99% upper bound is the 1,980th sorted bootstrap estimate
(one-based); persist resample-index hashes. The oracle ceiling reports truth and
is excluded from deployable safety-decision comparisons.

**Decision, metrics, and units.** Portfolio loss, VaR, ES, interval width, and
estimation error are in synthetic loss units. The **project-chosen** safety
limit is $\ell=5$ loss units. An arm says safe only when its frozen 99% upper
confidence bound for its declared 0.99 risk estimate $\widehat R$ is at most
$\ell$; evaluation-stream 0.99 ES is
the decision truth. A safe decision with truth above $\ell$ is false-safe, and
an unsafe decision with truth at or below $\ell$ is false-unsafe. The scalar
seed loss is

$$
L_s=100\mathbf1_{\text{false-safe}}+5\mathbf1_{\text{false-unsafe}}
    +\min(20,k_E|\widehat R_{0.99}-ES^{\mathrm{eval}}_{0.99}|),
$$

in declared decision-loss units, where the **project-chosen** conversion is
$k_E=1$ decision-loss unit per synthetic loss unit and
$L_{\max}=125$ decision-loss units. The primary contrast is
$L_s$ for Acerbi--Tasche empirical 0.99 ES versus the mean--variance arm on the
concentrated portfolio in confirmation; the **project-chosen** practical gate
is at least 10% lower mean scalar loss. Also report 0.975/0.99 quantile and ES
error, 99% interval coverage, false-safe frequency and magnitude, effective
tail count, CPU seconds, and bytes. Protected directions are: false-safe
frequency and severe-underestimation magnitude may not increase (zero margin),
and coverage may be at most one percentage point lower. Joules are reported
only under the common calibrated energy boundary.

**Feasibility, stopping, and abstention.** A numerical gate requires nonnegative
loss weights summing to one within $10^{-12}$ and $ES_p\ge VaR_p$ within
$10^{-12}$ loss units. An arm abstains when its realized effective fitting-tail
count is below the **project-chosen** 250 observations or its 99% interval width
exceeds the **project-chosen** 25% of $\max(|\widehat{ES}|,10^{-12})$.
Abstention invokes the mature conservative fallback “unsafe/reject portfolio”
and adds two decision-loss units; it is not a missing prediction. Stop for a
non-finite tail estimate or a common-contract failure. Development must verify
the common 0.90 power target for the 10% shifted contrast before confirmation.

**No-results wording.** Protocol specification only; no FM-T01 result exists.
No claim about the superiority of ES, scenarios, or any candidate follows until
the untouched confirmation and both transfer runs pass the frozen gates.

### FM-T02 — Liquidity, leverage, and endogenous feedback

**Claim tested:** proposed C-1481.

**Frozen DGP and clock.** Simulate 24 entities $i$ holding 12 assets $a$. Index
$-1$ is the pre-shock reference: $p_{a,-1}=1$ synthetic currency unit per asset
unit, $A_{i,-1}=120$ currency units, $D_{i,-1}=110$, $E_{i,-1}=10$, and
leverage $A/E=12$.
Its common-asset weight is $c=0.35$; its other eleven weights are
$(1-c)\theta_i$ for a frozen
$\theta_i\sim\operatorname{Dirichlet}_{11}(1.5)$ draw. Pre-shock and round-0
quantity is $x_{ia,-1}=x_{ia,0}=120w_{ia}$ asset units and
$S_a=\sum_i x_{ia,-1}$. Between indices $-1$ and 0 apply the exogenous shock:
$p_{1,0}=0.95$ for the common asset and $p_{a,0}=0.98$ for $a=2,\ldots,12$;
holdings and liabilities do not change, so $D_{i,0}=110$. Define

$$
r_0=\log\!\frac{\sum_aS_ap_{a,0}}{\sum_aS_ap_{a,-1}},
\qquad u_0=0.06r_0^2,
\qquad v_0=\sqrt{u_0}.
$$

Thus the initial shock is included exactly once in the volatility state. The
post-shock aggregate-equity reference for Transfer B is
$E^{\mathrm{ref}}=\sum_i[\sum_ap_{a,0}x_{ia,0}-D_{i,0}]$; monitoring starts at
round 1, so the initializing shock itself cannot trigger the funding call.

Round $t=0$ begins from that post-shock state. At the start of every round
$t\ge0$, mark
$A_{i,t}=\sum_a p_{a,t}x_{ia,t}$ and $E_{i,t}=A_{i,t}-D_{i,t}$. Define the
outstanding-value-weighted market log return
$r_t=\log[(\sum_aS_ap_{a,t})/(\sum_aS_ap_{a,t-1})]$ and, for $t\ge1$,
$u_t=0.94u_{t-1}+0.06r_t^2$; the dimensionless EWMA volatility is
$v_t=\sqrt{u_t}$. The policy leverage ceiling is
$\lambda_t=12/(1+5v_t)$. A solvent entity must sell
$s_{i,t}=\min[A_{i,t},\max(0,A_{i,t}-\lambda_tE_{i,t})]$ currency units;
a defaulted entity ($E_{i,t}\le0$) sells its full remaining position. Sales
are pro rata by marked value, so $q_{ia,t}=s_{i,t}x_{ia,t}/A_{i,t}$ asset units.
Sale proceeds reduce both holdings and liabilities dollar for dollar:
$x_{ia,t}^{+}=x_{ia,t}-q_{ia,t}$ and
$D_{i,t}^{+}=\max(0,D_{i,t}-s_{i,t})$; any unpaid balance is logged as creditor
shortfall. All entities decide synchronously before prices update by

$$
p_{a,t+1}=\max\!\left(0.25,\;p_{a,t}\exp[-\eta Q_{a,t}/S_a]\right),
$$

where $Q_{a,t}=\sum_iq_{ia,t}$ and $S_a$ are asset units, making $Q/S$
dimensionless. Confirmation uses $\eta=0.10$. Iterate until both the maximum
relative price change
$\max_a|p_{a,t+1}/p_{a,t}-1|$ and maximum required-sale fraction
$\max_i[s_{i,t}/\max(A_{i,t},10^{-12}\ \text{currency units})]$ are below the
**project-chosen** $10^{-8}$, or for 1,000 rounds.

- Transfer A: common-holding share 0.85 and $\eta=0.20$.
- Transfer B: 30% of every entity's current liability is owed to one funding
  provider. At the start of the first round $t\ge1$ for which aggregate marked
  equity is below $0.80E^{\mathrm{ref}}$, freeze exposure as $0.30D_{i,t}$ for
  each entity. The provider calls exactly 50% of that frozen exposure at round
  $t+1$, once only. Define $c_i=0.50(0.30D_{i,t})$. At execution, replace that
  round's ordinary sale by
  $\widetilde s_{i,t+1}=\min[A_{i,t+1},s_{i,t+1}+c_i]$ and use
  $\widetilde s_{i,t+1}$ in the same pro-rata quantity/debt update. No call cash
  enters round $t$.

**Arms and information.** Forecast arms are: exogenous zero impact, one price-
impact pass, full fixed-point feedback, and full fixed point with the declared
funding state. They predict the terminal state of the same evaluator trajectory
and do not alter it. Counterfactual-control arms are analysed separately:
immediate liquidation; staged liquidation capped at 25% of each entity's
required sale per round; a centralized oracle ceiling that minimizes terminal
equity loss subject to the same per-round aggregate sale authority and perfect
future-state information; and the candidate local controller. At each round,
each controller chooses a fraction from $\{0,0.25,0.50,0.75,1\}$ of the current
required deleveraging sale; a due funding call is mandatory, sales remain pro
rata, and deferred requirement is logged as a leverage violation. The candidate
observes only current prices, its entity's holdings, $v_t$, and that entity's
funding call; its finite-state map is frozen after development. The central
oracle uses the same fraction/action set and aggregate sale authority. It is not
a deployable comparator and is excluded from the primary test.

**Outcomes, metrics, and units.** Evaluator truth is the fully iterated declared
DGP, including funding calls only in Transfer B. Forecast loss is
$L_s=\min(1,|\widehat{\Delta E}-\Delta E^{\mathrm{eval}}|/240)$, where
$\Delta E$ is aggregate equity loss in synthetic currency units; $L_{\max}=1$.
The primary contrast is fixed-point versus one-pass $L_s$ with a
**project-chosen** 20% relative reduction. Also report entity defaults (count),
creditor shortfall and equity loss (currency units), price drawdown (percentage
points), sale quantity (asset units), rounds, leverage violations, and
fixed-point residual. Protected directions are: absolute default-count error
and non-convergence frequency may not increase (zero margin); negative
quantities and the identity $A-D-E=0$ have zero tolerance apart from the
declared $10^{-8}$ relative numerical residual.

**Feasibility, stopping, and abstention.** Reconcile every price change, asset
unit, sale proceed, debt repayment, and creditor shortfall. The
**project-chosen** conservation residual is at most $10^{-8}$ of initial asset
value. Non-convergence receives $L_{\max}$ rather than deletion. When any asset
hits the price floor or the iteration cap, the candidate abstains to the mature
staged-liquidation fallback evaluated under the full fixed-point-with-funding
model. The fallback **restarts from the frozen round-0 post-shock balance sheet**,
namely $p_{a,-1}=1$, $(p_{1,0},p_{a>1,0})=(0.95,0.98)$,
$x_{ia,0}=120w_{ia}$, $D_{i,0}=110$, the derived $r_0$, $u_0=0.06r_0^2$,
$v_0$, and $E^{\mathrm{ref}}$, with the funding trigger untriggered and no call
scheduled. It reuses the same frozen $\theta_i$ and funding rule; it does not
continue from or reuse a partially iterated boundary state.
Its complete restarted outcome is scored and 0.01 scalar-loss units are added,
capped at $L_{\max}$. Stop for a negative holding or liability,
unexplained asset creation, timestamp/order failure, or common-contract failure.
Development must meet the common power target for the 20% shifted contrast.

**No-results wording.** Protocol specification only; no FM-T02 result exists.
It does not establish that endogenous feedback is material in any deployment or
that staged liquidation is safer.

### FM-T03 — Estimated portfolios and diversification limits

**Claim tested:** proposed C-1482.

**Frozen DGP.** Generate 40 zero-mean channel returns from four factors,
$r_t=Bf_t+\epsilon_t$. Factor variances, in squared synthetic-return units,
are $(0.040,0.020,0.010,0.005)$. Row $i$ of the fixed loading matrix has 0.6
on factor $1+(i\bmod4)$, 0.2 on factor $1+((i+1)\bmod4)$ when $i$ is even,
and zero elsewhere. Each idiosyncratic variance is one frozen
$\operatorname{Uniform}(0.010,0.040)$ draw per channel. Use fitting lengths
$T\in\{60,240,2000\}$ and an independent 2,000-step evaluation stream;
evaluation returns and all fitting prefixes are paired across arms.
Confirmation uses independent Gaussian factors and idiosyncratic errors.

- Transfer A: standardized Student-$t_5$ factors with equicorrelation 0.4,
  rescaled to preserve the listed marginal variances.
- Transfer B: the confirmation process plus a common negative jump with
  probability 0.01 and magnitude $0.05U^{-1/3}$ return units for
  $U\sim\operatorname{Uniform}(0,1)$, and a
  **project-chosen** switching loss of 0.001 return units per unit of turnover,
  charged once in the first portfolio return after each rebalance before
  variance and tail loss are evaluated.

**Frozen rebalance clock and action.** Every arm starts from
$w^{\mathrm{ref}}_0=(1/40,\ldots,1/40)$ and first rebalances immediately before
evaluation step 1. It then rebalances before steps
$21,41,\ldots,1981$: exactly 100 decisions at a fixed 20-step cadence. At
decision $k$, the estimation window is the latest $T$ observed return vectors,
using the fitting sample at $k=0$ and then rolling in only evaluation returns
strictly preceding the decision. The action is the complete next weight vector;
its reference is the arm's own previous vector and it must satisfy

$$
\sum_iw_{i,k}=1,
\qquad \sum_i|w_{i,k}-w^{\mathrm{ref}}_{i,k}|\le0.20.
$$

The 0.20 $L^1$ turnover budget is dimensionless and applies to every arm,
including the oracle and candidate. “Unconstrained” below means that weight
signs are unrestricted; it does not waive the equality or turnover constraint.
Nonnegative arms also require $w_i\ge0$. The chosen vector is held for the next
20 returns. Oracle minimum variance uses the declared population covariance at
the same cadence but has no future return or jump information. Equal weights
selects its unchanged vector at every decision. A switching charge is zero in
development, confirmation, and Transfer A; in Transfer B it is
$0.001\sum_i|w_{i,k}-w^{\mathrm{ref}}_{i,k}|$ return units at the first return
after decision $k$.

**Arms.** Equal weights; oracle minimum variance; unconstrained sample global
minimum variance; nonnegative sample minimum variance; Ledoit--Wolf shrinkage;
diagonal covariance; inverse-volatility; and a candidate adaptive allocation
with exactly the same observations and turnover budget.

**Outcomes, metrics, and units.** Each arm's scalar loss is
$L_{s,a,T}=\min(1\ \text{squared-return unit},\widehat{\operatorname{Var}}_{\mathrm{eval}}(w^Tr))$,
with
$L_{\max}=1$ squared-return unit. The registered primary
interaction is

$$
D_s=(L_{s,U,60}-L_{s,N,60})-(L_{s,U,2000}-L_{s,N,2000}),
$$

where $U$ and $N$ are the unconstrained and nonnegative sample estimators; the
cell weights are therefore $(+1,-1,-1,+1)$ in the order
$(U60,N60,U2000,N2000)$. The **project-chosen** practical gate is
$E[D_s]\ge0.002$ squared-return units. Also report 0.99 loss ES in return units,
  effective number $1/\sum_iw_i^2$, turnover per rebalance and per step,
  constraint violations,
condition number, CPU seconds, and bytes. Protected directions at $T=60$ are:
nonnegative-minus-unconstrained ES may be at most 0.005 return units and
  mean turnover may be at most 0.05 units per rebalance higher; both are
**project-chosen** non-inferiority margins.

**Feasibility, stopping, and abstention.** Weights must sum to one within
$10^{-10}$ and realized $L^1$ turnover may not exceed 0.20 by more than
$10^{-12}$ at any decision. The frozen covariance condition threshold is the
**project-chosen** $10^8$. A failed optimizer or covariance arm above that
threshold abstains toward equal weights and adds 0.001 squared-return-loss units;
specifically, with $w^{eq}_i=1/40$, it selects
$w^{fb}=w^{ref}+\alpha(w^{eq}-w^{ref})$, where
$\alpha=0$ if $\lVert w^{eq}-w^{ref}\rVert_1=0$ and otherwise
$\alpha=\min[1,0.20/\lVert w^{eq}-w^{ref}\rVert_1]$. Thus the fallback never
waives the turnover budget. Its realized outcome remains in the denominator. A non-finite
covariance, infeasible constraint, or weight-identity failure receives
$L_{\max}$. Development must demonstrate at least 0.90 power for the 0.002
interaction; otherwise confirmation is not run.

**No-results wording.** Protocol specification only; no FM-T03 result exists.
No general diversification or portfolio-constraint advantage is claimed.

### FM-T04 — Organizational attention under overload

**Claim tested:** proposed C-1483.

**Frozen DGP.** Generate 90 days of minute-level alerts and then drain the queue
for 24 hours without new arrivals. At each hour boundary, the arrival state
moves low-to-high with probability 0.02 and high-to-low with probability 0.25;
the initial state has the stationary distribution. Conditional on state,
minute arrivals are Poisson with rates 30/60 and 90/60. Consequence
$C\in\{1,10,100\}$ loss units has probabilities 0.94, 0.055, and 0.005.
Subgroup $G\sim\operatorname{Bernoulli}(0.5)$. The binary status signal $S$
has the following frozen probabilities:

| $C$ | $P(S=1\mid C,G=0)$ | $P(S=1\mid C,G=1)$ |
|---:|---:|---:|
| 1 | 0.10 | 0.30 |
| 10 | 0.30 | 0.50 |
| 100 | 0.80 | 0.40 |

The observed dimensionless score is
$Y=\log[C/(1\ \text{loss unit})]+0.5S+\epsilon$ with
$\epsilon\sim N(0,1)$. Four reviewers each supply 60 minutes per hour, hence
**240 total reviewer-minutes per hour**. Reviews are non-preemptive; service
time is lognormal with mean six reviewer-minutes and coefficient of variation
one. Deadlines from arrival are 24 hours, four hours, and 30 minutes for
$C=1,10,100$. A review completed by deadline prevents that alert's consequence;
a late or absent review incurs $C$. Reviewers never observe $C$.

- Transfer A preserves the consequence and subgroup base rates but replaces
  $\log[C/(1\ \text{loss unit})]$ by its negative in $Y$ for $G=1$ only.
- Transfer B gives 20% of $C=1$ alerts two additional copies (three records for
  one incident). Copies share an incident ID and consequence, but each consumes
  service unless detected; only the first on-time completion can prevent the
  incident loss. The adversary sets $S=1$ on the two copies without changing
  $C$.

**Arms.** FIFO; descending observed-score priority; uniform random queue
selection; a severity-band reserve that dedicates one reviewer to scores above
the frozen development 99th percentile and releases unused reserve after five
minutes; an exploration quota using 10% of starts for uniform random selection;
uncertainty-directed review using the frozen development posterior closest to
0.5 for $C=100$; the **mature composite**; and the candidate attention router
frozen after development. The mature composite freezes the development 99th
percentile of $Y$ as its high band, dedicates one reviewer to that band (releasing
the reviewer after five idle minutes), orders the other three queues by
descending $Y$ and then earliest declared deadline, and assigns exactly every
tenth non-reserve review start to uniform sampling from all waiting records
using the frozen root-ID order. It sees no $C$ or future service time. All arms
use the same four reviewer calendars and non-preemptive service draws.

**Outcomes, metrics, and units.** The scalar seed loss is
$L_s=\min(1,\text{missed }C{=}100\text{ loss}/\max(100,\text{available }C{=}100\text{ loss}))$,
with $L_{\max}=1$.
The primary contrast is candidate versus the mature composite with a
**project-chosen** 10% relative reduction. Candidate comparisons with FIFO,
observed-score, random, reserve-only, exploration-only, and uncertainty-directed
arms are secondary: their intervals are included in the protocol's simultaneous
max-$|t|$ family and cannot promote the candidate. Also report deadline misses by
severity, waiting time in minutes, queue length, reviewer utilization,
duplicate work, exploration share, and the absolute $G=0$ versus $G=1$ severe-
miss-rate gap in percentage points. Protected directions are: routine
($C=1$) on-time completion may be at most two percentage points lower; the
absolute subgroup gap may be at most one percentage point higher; and used
reviewer-minutes may never exceed 240 per hour. These margins are project
choices; the capacity bound is a hard DGP identity.

**Feasibility, stopping, and abstention.** Arrival IDs, incident IDs, service
draws, subgroup, status, consequence, and reviewer calendars must reconcile
across paired arms. The **project-chosen** unsafe threshold is a simultaneous
99% lower confidence bound below 0.50 for the positive predictive value of the
candidate's top-priority band on development. For each of the 64 development
seeds, compute one PPV as the number of $C=100$ records in that frozen band
divided by the number of records in the band; an empty band has PPV zero. Use
the common protected-bootstrap seed, 100,000 paired seed resamples,
sample-SD/$\sqrt{64}$ studentization, and zero-variance convention to construct
the 99% lower bound before confirmation. Crossing it freezes abstention for all
confirmation and transfer seeds; no later data reverse it. Abstention invokes
the mature composite fallback and adds 0.01 scalar-loss units capped at
$L_{\max}$.
Capacity creation, lost records, double prevention of one duplicated incident,
or timestamp inversion receives $L_{\max}$. Development must meet the common
power target for the 10% shifted contrast; subgroup and Transfer B results are
reported separately, and both transfer regimes must preserve at least half the
registered effect.

**No-results wording.** Protocol specification only; no FM-T04 result exists.
It does not show that a particular attention policy prevents organizational
blindness.

### FM-T05 — Real options under uncertainty and irreversibility

**Claim tested:** proposed C-1484.

**Frozen DGP and cash-flow clock.** Use decision months $t=0,\ldots,60$,
horizon $T=60$, $V_0=110$ synthetic currency units, full exercise cost
$K=100$ currency units, and continuously compounded annual discount rate
$r=0.05\ \mathrm{year}^{-1}$. Monthly project value follows

$$
V_{t+1}=V_t\exp\!\left[
  (\mu-\tfrac12\sigma^2)/12+\sigma\epsilon_t/\sqrt{12}
\right].
$$

where $\mu=0.02\ \mathrm{year}^{-1}$,
$\sigma\in\{0,0.15,0.35\}\ \mathrm{year}^{-1/2}$, and
$\epsilon_t\sim N(0,1)$. A fixed latent project-quality multiplier
$\Theta\in\{0.8,1.2\}$ is drawn with equal probability and is not directly
observed before exercise. Confirmation crosses unrecoverable-cost fraction
$f\in\{0.2,1.0\}$, last exercise month $e\in\{0,12,60\}$, and annual delay-
erosion rate $\delta\in\{0,0.05,0.15\}\ \mathrm{year}^{-1}$.

If exercise occurs at $t\le e$, the dated cash-flow ledger is: receive project
benefit $\Theta V_t e^{-\delta t/12}$ and pay the full $K$ at month $t$; recover
$(1-f)K$ at month $T$. Thus time-zero payoff is

$$
\Pi_t=e^{-rt/12}\left(\Theta V_t e^{-\delta t/12}-K\right)
      +e^{-rT/12}(1-f)K.
$$

Never exercising pays $\Pi_\varnothing=0$. A one-time pilot, available only to
the staged and full-oracle arms at any $t<e$, pays the nonrecoverable dated cost
$0.05K$ at $t$ and returns
$Y=\log\Theta+\nu$, $\nu\sim N(0,0.1^2)$; Bayes' rule on the stated two-point
prior updates the quality belief. It neither changes $V_t$ nor waives any part
of the later full exercise cost. If the pilot is taken at month $\tau<t$, total
payoff is
$\Pi^{\mathrm{pilot}}_{\tau,t}=-e^{-r\tau/12}0.05K+\Pi_t$; pilot followed by
abandonment pays only $-e^{-r\tau/12}0.05K$.

- Transfer A independently applies a monthly downward jump with probability
  0.02 and multiplier $e^{-J_t}$, where
  $J_t\sim\operatorname{Exponential}(\text{mean}=0.15)$.
- Transfer B leaves evaluation at $\mu=0.02$ but makes non-oracle planners use
  the frozen misspecified value $\widehat\mu=0.06\ \mathrm{year}^{-1}$.

**Arms.** Immediate exercise at $t=0$ if its prior-mean payoff is positive;
a fixed NPV hurdle that first exercises when prior-mean $\Pi_t\ge10$ currency
units; an exact finite-horizon Bellman policy over wait, exercise, pilot, and
abandon; a 12-month receding-horizon policy with terminal value equal to the
positive immediate-exercise payoff at its rolling boundary; a robust Bellman
policy that maximizes the worst expected payoff over
$\mu'\in\{0.01,0.03\}\ \mathrm{year}^{-1}$,
$\sigma'\in\{\max(0,\sigma-0.05\ \mathrm{year}^{-1/2}),\sigma+0.05\ \mathrm{year}^{-1/2}\}$,
and
$P(\Theta=1.2)\in\{0.4,0.6\}$; and a staged heuristic that pilots once when the
expected value of sample information exceeds $0.05K$ and then applies the
fixed NPV hurdle to the posterior. The exact Bellman arm is the privileged
decision ceiling for regret and is not presented as a deployable policy.

**Outcomes, metrics, and units.** Discounted payoff and regret are in synthetic
currency units, exercise time in months, rates in fractions, compute in CPU
seconds, and storage in bytes. For each generated path and cell, define the
privileged hindsight ceiling $\Pi_s^{\mathrm{clair}}$ as the largest realized
cash-flow payoff among never exercising, every permitted unpiloted exercise
month, and every permitted pilot-month/later-exercise-or-abandon pair, using the
realized $\Theta$, $V$ path, and pilot signal. It is evaluation-only and supplies
no action information. The scalar path loss is

$$
L_{s,a,c}=\min\!\left(2,
 \frac{\max(0,\Pi^{\mathrm{clair}}_{s,c}-\Pi_{s,a,c})}
      {100\ \text{currency units}}\right),
$$

with dimensionless $L_{\max}=2$. Let $A_{s,\sigma,f}$ be the **paired realized-
path** Bellman-minus-immediate payoff, averaged with equal weight over the nine
$(e,\delta)$ cells inside seed $s$. The registered seed-level primary
interaction is

$$
D_s=(A_{s,0.35,1}-A_{s,0,1})-(A_{s,0.35,0.2}-A_{s,0,0.2}),
$$

with cell weights $(+1,-1,-1,+1)$ in the displayed order and a
**project-chosen** practical gate $E[D_s]\ge1$ currency unit. The exact Bellman
time-zero expected values and their matching deterministic-DP contrasts remain
secondary oracle/reproduction outputs; they are not replicated as if they were
independent seed observations and are not used for the primary randomization
test or power claim. Also report realized payoff, clairvoyant regret, exact
expected policy value, exercise month, pilot use, opportunity-expiry rate, and
cash-flow components by date.
Protected directions for Bellman versus immediate are: the rate of positive-
oracle opportunities lost to expiry may be at most one percentage point higher,
and the 10th payoff percentile may be at most one currency unit lower. These
are project-chosen non-inferiority margins.

**Feasibility, stopping, and abstention.** The Bellman calculation uses a frozen
4,097-node equally spaced log-value grid on
$[\log V_0-20,\log V_0+20]$, linear interpolation, 128-node Gauss--Hermite
integration for Gaussian innovations, and 64-node Gauss--Laguerre integration
for Transfer A jump size. Below-grid continuation is zero and above-grid action
is immediate exercise. Doubling every grid and quadrature count
  must change every reported policy value by at most the **project-chosen**
  $10^{-8}$ currency units. This is a deterministic reproduction tolerance and
  is not a practical-effect grid. With the pilot action disabled and $\sigma=0$, it
must match the maximum of the 61 explicit dated deterministic $\Pi_t$ values
and zero within $10^{-8}$; a separate full-action check enumerates the two-point
pilot posterior. Every pilot and exercise cash flow must independently reconcile
to the formulas above.
For each non-oracle arm and cell, use the 64 paired **realized development
payoffs** as the seed observations and construct a simultaneous 99% max-$|t|$
interval for mean payoff with the common 100,000 protected-bootstrap resamples
and zero-variance rule. If that interval contains the outside option zero, that
arm is frozen as abstaining for the corresponding confirmation cell and the
same map is used in both transfers; exact DP expected values are not duplicated
as seed observations. It invokes “do not exercise,” records the
realized zero payoff, computes its clairvoyant-regret scalar loss, and then adds
0.01 scalar-loss units capped at $L_{\max}$. A Bellman residual, probability normalization, or
cash-flow identity failure receives $L_{\max}$. Development must meet the common
power target for the one-currency-unit interaction.

**No-results wording.** Protocol specification only; no FM-T05 result exists.
It does not establish a general option value of delay or justify delay where
expiry, erosion, or reversibility removes it.

### FM-T06 — Internal control, independence, and adaptation

**Claim tested:** proposed C-1485.

**Frozen DGP, signals, and clock.** Simulate 1,000 ordered blocks of 100 actions
(100,000 actions) arriving eight minutes apart, or 7.5 actions per hour. Before
action 50,001, mutually exclusive latent error classes 1--4 have probabilities
0.006, 0.003, 0.001, and 0.0002; remaining probability is no error. From action
50,001 onward, class 5 has probability 0.003 and the no-error probability is
reduced accordingly. Conditional on an error, loss severity is
$W=\min(1000,\max(1,e^Z))$ synthetic loss units for $Z\sim N(2,1)$; a severe
error has $W\ge50$. Every action has observed dimensionless risk score
$R=\log[W/(1\ \text{loss unit})]+\xi$, $\xi\sim N(0,1)$ for errors, and
$R=\xi$ otherwise.

After root action 100,000, admit no new actions and continue the same reviewer
calendar for a fixed 24-hour drain so every queued visit, release, and delayed
outcome can terminate. A root still nonterminal at drain end receives the
adverse scalar/protected assignment; the horizon is never extended selectively.

Evidence-source A has class sensitivities $(0.75,0.70,0.65,0.60,0.10)$;
source B has $(0.70,0.75,0.60,0.65,0.55)$. Both have false-positive probability
0.02. A maker self-check has sensitivities
$(0.60,0.55,0.50,0.45,0.10)$ and false-positive probability 0.01. One Bernoulli
evidence bit per source and action is generated from these rates: reviewers
sharing a source observe the same bit; source-independent reviewers observe A
and B. A root-cause mask is drawn independently with probability 0.004 per
100-action block and multiplies maker and source-A sensitivities by 0.1 for the
whole block. Per-action collusion with probability 0.001 forces the maker and
source-A bits to zero. An erroneous action incurs $W$ unless blocked before
release; a false flag on a correct action is one false block but no synthetic
loss.

Each review visit has an independent gamma service time with mean three
reviewer-minutes and coefficient of variation 0.8. Every arm reserves the same
60-reviewer-minute-per-hour calendar. Ordinary review arms have authority for
at most two visits per action. Random and risk audit arms may instead use four
visits on a selected action but may not exceed 600 reviewer-minutes per
100-action block. Both patterns use 45 expected reviewer-minutes per hour, or
75% of the calendar. Reserved-but-unused minutes are reported and charged; they
cannot be reassigned outside the arm.

- Transfer A moves class-5 onset to action 30,001. A root mask starts with
  probability 0.004 in an unmasked block and persists to the next block with
  probability 0.8, producing clusters.
- Transfer B replaces source B by a second source-A observation and raises
  collusion probability to 0.005; the duplicated A observation remains the same
  evidence bit rather than a fresh Bernoulli draw. This is a preregistered
  **root-collapse null reproduction**, not a positive-effect transfer: two
  nominally source-independent visits and two shared-source visits now have the
  same root evidence and are required to make identical decisions under paired
  visit-service draws.

**Arms and actions.** No review releases every action; maker self-check blocks
on its bit; one independent reviewer uses A; two shared-source reviewers both
use the one A bit; two source-independent reviewers use A and B and block if
either flags. Random audit selects 50 actions uniformly without replacement in
each block and gives each four visits (A, B, A, B); risk-based audit gives the
same four visits to the 50 highest-$R$ actions. Both therefore have the same
expected 600 reviewer-minutes per block as the two-review arms; selection occurs
only when the complete 100-action block is available, and selected actions are
held until their assigned visits finish. Candidate adaptive audit
starts with random audit and observes every action's latent outcome after a
fixed 50-action delay. Its frozen detector is
$C_t=\max(0,C_{t-1}+\mathbf1_{\{\text{class 5}\}}-0.001)$ and triggers at
$C_t\ge5$; after triggering it uses A and B once on every action. Queue order is
arrival order within a selected set. All decisions, release times, and delayed
outcomes are explicit logged actions.

**Outcomes, metrics, and units.** Scalar loss is
$L_s=\min(1,\text{undetected severe loss}/\max(1,\text{available severe loss}))$,
with $L_{\max}=1$. The primary contrast
is two source-independent versus two shared-source reviewers at identical
two-visit authority, with a **project-chosen** 10% relative reduction in mean
$L_s$. The one-independent-reviewer arm is the mature deployable fallback and an
exact arm; no-review and maker-only arms are lower-information boundaries.
Random, risk-based, and adaptive-audit comparisons are secondary and enter the
within-protocol simultaneous max-$|t|$ family; they cannot substitute for the
registered source-independence primary. Also report all undetected loss units, false-block fraction, class-5
detection delay in actions, visit and reserved minutes, p50/p99 queue delay in
minutes, source-bit correlation, reviewed-action coverage, CPU seconds, and
bytes. Protected directions are: false-block fraction may be at most 0.005
higher, p99 queue delay at most two minutes higher, and collusion miss fraction
at most 0.01 higher. These are project-chosen non-inferiority margins.

**Feasibility, stopping, and abstention.** Reconcile 100,000 root actions,
error/no-error status, evidence bits, visits, releases, false blocks, and every
loss unit. Exceeding the calendar, releasing before a required completed review,
or silently dropping an action receives $L_{\max}$. The
**project-chosen** independence bound is development residual correlation
0.25 after conditioning on error class. Pool the 64 development seeds; for each
source bit subtract its empirical mean within the six latent strata (no error
and classes 1--5), then compute the ordinary Pearson correlation of the two
finite residual vectors. A stratum with zero variance contributes zero
covariance; zero total variance or a non-finite result fails the bound. Above
0.25, the candidate abstains to the
mature one-independent-reviewer fallback; the fallback outcome remains scored
and 0.01 scalar-loss units are added. The 50-action outcome lag is preserved in
all detector updates. Development must meet the common power target for the 10%
shifted contrast; no threshold is relaxed after observing confirmation.
Transfer A must retain at least a 5% relative reduction and every hard/protected
gate. Transfer B is exempt from the common half-effect rule solely because it is
the registered root-collapse null: it passes only if every paired terminal
block/release decision and scalar loss of the two-review arms is exactly equal,
the mean paired primary contrast is exactly zero in binary64, and its 95%
interval is the point $[0,0]$. Any nonzero contrast is an implementation failure,
not evidence for or against C-1485; Transfer B can never promote a positive
independence effect.

**No-results wording.** Protocol specification only; no FM-T06 result exists.
No control architecture is represented as effective, independent, or compliant
without the frozen test and a separate legal assessment.

### FM-T07 — Operational resilience and dependency concentration

**Claim tested:** proposed C-1486.

**Frozen DGP, topology, and state.** Simulate one-minute aggregate-count steps
for 60 arrival days followed by a 24-hour drain. The eight nodes are ingress
$I$, router $R$, workers $W_1,W_2,W_3$, state store $S$, checkpoint store $K$,
and provider $P$; directed edges are $I\to R$, $R\to W_j$, $W_j\to S$,
$S\to K$, and $W_j\to P$. Installed bottleneck capacity is 800 task-equivalents
per minute (each worker has 300, but shared $I,R,S,P$ are capped at 800).
Root arrivals are Poisson with mean 600 tasks per minute; 10% are high priority
with five-minute deadline and value 10 loss units, and 90% are routine with
15-minute deadline and value one. Scheduled updates demand 50 task-equivalents
per minute. Normal offered work is therefore 650, leaving exactly 150 spare:
25% of mean root arrivals and 18.75% of installed capacity. “Reserve” below
always means these 150 task-equivalents per minute, not 25% of 800. Forty
percent of root tasks require $P$ in confirmation. A checkpoint of admitted
state is attempted every five minutes.

**Frozen service, queues, and event order.** A root requires one
task-equivalent at $I$, one at $R$, one at exactly one worker, and one at $S$;
provider-dependent roots additionally require one at $P$ in parallel after the
worker and cannot terminate until both $S$ and $P$ finish. Nominal per-minute
capacities are $I=R=S=P=800$, $W_1=W_2=W_3=300$, and one checkpoint write per
minute at $K$. The fixed 50 update task-equivalents consume 50 units at $R$, 50
across the workers in round-robin order, and 50 at $S$; they are one logical
update ledger, not 150 independent work units. Deferral adds exactly 50 update-
debt units for that minute and later repayment consumes the same three-stage
capacity. At each integer minute the simulator, in order: completes actions and
incident transitions; enqueues new roots and scheduled update work; allocates
that minute's capacity; completes service; and enqueues successor stages for the
next minute. Service is non-preemptive for the one-minute quantum. Queues are
FIFO within high-priority root, retry, routine-root, and update classes, in that
fixed priority order unless an arm explicitly sheds or defers a permitted class.
No arm may move work through two nodes in one minute. Worker assignment uses
root ID modulo three unless an arm takes a logged failover/allocation action.
A checkpoint attempt consumes the minute's one $K$ write and snapshots the
latest fully completed $S$ epoch only when $S$ and $K$ are both available;
otherwise the attempt is logged failed and no checkpoint is created.

The logged state each minute is every node's up/down/capacity status, per-class
queue count and oldest age, admitted/completed/dropped/lost task counts,
provider-dependent count, retry count, latest usable checkpoint age, update
debt in task-equivalents, reserve use, and recovery action. Controllers observe
this state with one-minute delay and may allocate capacity, admit or shed by
class/dependency, restart a node, fail over a worker, roll back a deployment,
restore one logged checkpoint, defer at most that minute's 50 update units, and
choose whether to retry. They may not create capacity, a checkpoint, or a task.

Every root has one initial attempt and at most two retry attempts. During a
retry-storm instance, a pre-generated per-attempt uniform causes a worker-stage
attempt to fail when it is below 0.25. A failed attempt creates exactly one
same-root retry with incremented attempt number and its full remaining declared
stage work; failure of attempt 3 is terminal lost. Outside a storm the failure
threshold is zero. Disabling retry makes later failed attempts terminal lost and
does not erase an already queued retry. Root IDs, attempt IDs, reason codes, and
all stage-entry/completion timestamps are immutable ledger rows.

At ingress, independently freeze a replayability bit
$B_i=\mathbf1[H_i/2^{64}<0.95]$, where $H_i$ is the low 64 bits of
`SHA256("FM-v1|FM-T07|split|regime|replicate|replayable|root-id")`. A replayable
root stores an immutable payload seed and stage-demand record; a non-replayable
root stores only its identity and outcome metadata. This **project-chosen** 95%
rate is a DGP parameter, not a measured recoverability claim.

Each replicate contains **24 incident instances in seven classes**, not 24
different classes. The six 60-minute single-node failures target, once each,
$R,W_1,W_2,W_3,S,P$. The two 120-minute zone failures target $(W_1,W_2)$ and
$(W_2,W_3)$. Four 180-minute 50%-capacity dependency slowdowns target $S,P,S,P$
in that order. Three checkpoint corruptions target $K$ and invalidate exactly
the two newest currently usable checkpoints. Three 120-minute retry storms
target worker attempts on $W_1,W_2,W_3$, using the attempt mechanics above.
Three 90-minute bad deployments reduce every worker from 300 to 180 units per
minute. Three 180-minute provider outages set $P$ capacity to zero. Onsets are sampled without replacement from
minute 360 through the end of day 59 subject to six-hour separation, then
sorted and frozen. The **project-chosen** evaluation tolerances are 15 minutes
from incident onset to restored on-time service and five minutes of checkpoint
age at recovery. They are synthetic falsification parameters, not DORA
requirements or recommended service objectives.

An incident ends at its declared natural duration unless a permitted completed
action clears it earlier. Exactly one operator recovery action may be active at
a time. `restart(node)` lasts five minutes, leaves that node unavailable, and
then clears a single-node failure on it. `failover(worker,target)` lasts two
minutes and then moves every not-yet-served source-worker queue row, with its
root/attempt/remaining work unchanged, to the named healthy worker; it does not
create capacity or clear the incident. `rollback` lasts ten minutes and then
restores all bad-deployment worker capacities to 300. `restore(checkpoint)`
lasts 15 minutes and then resets the $S$ epoch to the selected usable checkpoint.
Let $c$ be the selected checkpoint's state epoch and $t_r$ the restore-completion
minute. The affected set is exactly the roots whose most recent successful $S$
state-write epoch is in $(c,t_r]$, including roots with an earlier external
service-completion event. Sort them by root ID. For $B_i=0$, log the reverted
write and mark the root's **final drain-time status** lost. For $B_i=1$, log the
reversion and enqueue one state-replay generation at $R$ at minute $t_r+1$.
Replay consumes one task-equivalent at $R$, one at its hash-assigned worker, one
at $S$, and one at $P$ iff the original root was provider-dependent; it consumes
no $I$, mirror, update, or checkpoint work. Replay uses its own hashed per-copy
storm uniforms and at most three replay generations. All three failing makes
the final status lost. A successful replay creates one new $S$ state write and
waits for the ordinary five-minute checkpoint clock; no checkpoint is created
by the restore itself. Current node capacities, queues, outages, and priority
order apply, with replay placed in the retry class.

External work is never emitted twice: a root with an earlier service-completion
event retains that first completion timestamp and replay reconstructs state
only. The simulator emits exactly one immutable terminal row per root at the end
of the drain: `completed` if its required service and final state are present,
otherwise the already declared `dropped` or `lost`. Intermediate service-copy,
state-write, reversion, and replay events are not terminal rows. `retry-
disable` lasts one minute and then changes only the future retry transition as
defined above. Admission/shedding, update deferral, queue allocation, and retry
choice are one-minute control decisions recorded before service allocation.
Slowdowns and provider outages cannot be shortened by a local recovery action.

- Transfer A forms three frozen pairs (single-node plus retry storm, zone plus
  checkpoint corruption, and bad deployment plus provider outage); within each
  pair, one seeded instance of each named class is selected and the second onset
  is offset by a seeded $-5$ or $+5$ minutes. All 24 root incident IDs remain in
  the ledger.
- Transfer B raises provider-dependent root tasks from 40% to 80% and multiplies
  controller-visible recovery-time estimates by 0.75 while true durations stay
  unchanged.

**Arms and actions.** Reactive restart detects an unavailable node after two
minutes and restarts it once. Static redundancy uses reserve to mirror up to 25%
of admitted tasks on a uniformly selected second worker. Diversity-aware
redundancy applies the same eligibility fraction, always chooses a different
healthy worker failure domain, and does not mirror a provider-dependent root
because this DGP has no independent second provider; unused reserve remains
visible. Graceful degradation sheds routine
tasks while oldest routine age exceeds 15 minutes and stops shedding below five
minutes. Dependency-aware shedding first rejects tasks whose required
dependency is unavailable, then admits high priority before routine. Runbook
plus rehearsal maps each detected incident class to the fixed actions
restart/failover/rollback/restore/retry-disable in that order and has no action
for an unseen combination. The **mature composite** combines diversity-aware
redundancy, dependency-aware shedding, and that rehearsed runbook. At the first
one-minute-delayed abnormal-state observation it applies this frozen class map:
single-node $\to$ restart; zone $\to$ fail over each affected worker in ascending
worker ID; slowdown or provider outage $\to$ dependency-aware shedding;
corruption $\to$ restore the newest remaining usable checkpoint (the
pre-corruption third-newest); retry storm
$\to$ retry-disable; and bad deployment $\to$ rollback. When signatures overlap,
it queues mapped actions by detected onset then lexicographic signature and still obeys the
single-active-action rule. Its classifier uses only the delayed log: one newly
zero-capacity non-provider node is single-node; two zero-capacity workers are a
zone; $P=0$ is provider outage; an up node at exactly half nominal capacity is
slowdown; two checkpoint usability flags changing valid-to-invalid is
corruption; the first logged storm-qualified failed attempt is retry storm; and
all three workers at capacity 180 is bad deployment. All matching signatures
are emitted in detected-onset then lexicographic-signature order; an unmatched signature is the declared
untested combination. The candidate is a finite-state policy frozen after
development over exactly the logged state and action set. Every arm has the same
800 capacity, 150 normal spare, checkpoint clock, and 50-per-minute update
schedule.

**Frozen replica mechanics.** For each admitted root, compute the low 64 bits of
`SHA256("FM-v1|FM-T07|split|regime|replicate|mirror|root-id")`. It is mirror-
eligible iff that unsigned integer divided by $2^{64}$ is below 0.25. Static
redundancy selects one of the two non-primary workers by the next hash bit after
sorting worker IDs; diversity-aware selects the lowest hash-ranked healthy
non-primary worker satisfying its declared dependency rule. At each minute,
eligible roots are sorted by hash then root ID. Admit replica worker work only
for the first roots fitting both physical residual worker capacity and the
fixed **150 task-equivalent-per-minute replica reserve**. The cap remains 150
when arrivals exceed 600; excess eligible roots run primary-only and replicas
are never queued for a later minute.

Primary and replica copies share one root and attempt ID but have distinct
copy/worker IDs and pre-generated per-copy retry-storm uniforms. Each consumes
one worker task-equivalent. They do not duplicate $I$ or $R$. The first
successful worker completion wins; simultaneous successes choose the lower
worker ID. Every other unfinished copy is immediately logged `cancelled` and
consumes no later capacity, while already consumed worker work remains charged.
Exactly one winner enqueues exactly one $S$ service and, for a provider-dependent
root, exactly one $P$ service; there is no duplicate downstream, checkpoint, or
update work. If every copy in an attempt fails, they create exactly one next
retry attempt under the common three-attempt limit. Completion, cancellation,
retry, drop, loss, and restoration transitions reconcile to exactly one terminal
state for the root; copy completion is never counted as root completion.

**Outcomes, metrics, and units.** For incident $j$, recovery time $R_j$ is the
minutes from onset until both task classes meet their deadlines for five
consecutive minutes. If this condition is absent by the end of the 24-hour
drain, set $R_j=1455$ minutes so that the incident contributes the finite
worst-case excess of 1,440 minutes. Scalar seed loss is
$L_s=\min(1440,\frac1{24}\sum_j\max(0,R_j-15))$ minutes per incident, with
$L_{\max}=1440$ minutes. The primary candidate-versus-mature-composite contrast
has a **project-chosen** practical gate of at least two fewer minutes per
incident. Candidate comparisons with restart-only, static redundancy,
diversity-aware redundancy, graceful degradation, dependency-aware shedding,
and runbook-only arms are secondary, use the within-protocol simultaneous
max-$|t|$ family, and cannot promote the candidate. Also report root, admitted,
completed, dropped, retry, and lost task counts;
delayed task-minutes; checkpoint data-loss interval in minutes; degraded-service
fraction; reserve utilization; ending update debt in task-equivalents; CPU
seconds; and bytes. Protected directions are: data-loss interval and lost-task
count may not increase (zero margins), dropped-root fraction may not increase,
normal-period reserve utilization may be at most one percentage point higher,
and ending update debt at most 60 task-equivalents higher. A dropped or shed root
is not “on time” when determining $R_j$ and incurs its stated loss-unit value.
Installed capacity and root-count reconciliation are hard zero-margin
constraints.

**Feasibility, stopping, and abstention.** Root arrivals, task attributes,
provider flags, service opportunities, checkpoints, and incident IDs are paired
across arms; all 60-day roots remain in the denominator during the common drain.
An untested incident combination makes the candidate abstain to the mature
composite fallback and adds one minute to scalar loss. Hidden replicas, capacity above
800, a missing root/terminal task state, an unlogged retry or loss, or clock
inconsistency receives $L_{\max}$. Development must meet the common power target
for the two-minute margin; each transfer must retain at least one minute and all
hard identities.

**No-results wording.** Protocol specification only; no FM-T07 result exists.
Passing the synthetic test would not demonstrate DORA compliance or deployment
resilience by itself.

### FM-T08 — Queueing, variability, and capacity headroom

**Claims tested:** existing C-659, C-660, and C-661; no new claim is reserved.
**Mature primary nulls:** `little1961` and `kingman1961`.

**Frozen root stream and DGP.** Generate exactly 60,000 root arrival IDs per
cell, shared by every arm. IDs 1--10,000 form the fitting/warm-up prefix; IDs
10,001--60,000 form the fixed 50,000-root evaluation cohort. After the last
arrival, each arm drains until every admitted root is completed or has a logged
terminal drop; the horizon is root arrivals, never “50,000 completions.” Service
capacity is one service unit per service-time unit. Cross
$\rho\in\{0.60,0.80,0.90,0.95\}$,
$c_a^2\in\{1,5\}$, and $c_s^2\in\{1,4\}$. Inter-arrival times are gamma with
shape $1/c_a^2$ and scale $c_a^2/\rho$, hence mean $1/\rho$ service-time units.
Potential service for every root is lognormal with
$\sigma_{\log}^2=\log(1+c_s^2)$ and
$\mu_{\log}=-\sigma_{\log}^2/2$, hence mean one service-time unit. All potential
service draws remain in the root ledger even when a controller drops the root.

- Transfer A uses a continuous-time two-state Markov-modulated Poisson process
  with rates $0.5\rho$ and $1.5\rho$, symmetric transition rate 0.01 per
  service-time unit, and stationary initial state, preserving mean rate $\rho$.
- Transfer B fixes a priority flag ($P=1$ with probability 0.20) and retry flag
  ($R=1$ with probability 0.05) for each root. A retry root has two attempts,
  with its already generated potential service split equally between them; the
  first attempt fails and the second can complete. Thus retry scheduling changes
  while total root offered service is exactly unchanged. Priority affects order,
  not service, admission authority, or root value.

**Arms and information.** Prediction arms estimate parameters from root IDs
1--10,000 and predict evaluation-cohort p99 waiting time: deterministic mean-
load predicts zero below unit load; $M/M/1$ uses, with $t$ expressed in
mean-service units,
$P(W_q>t)=\rho e^{-(1-\rho)t}$ and therefore
$W_{q,0.99}=\max[0,\log(\rho/0.01)/(1-\rho)]$; Kingman uses mean
$\rho(c_a^2+c_s^2)/[2(1-\rho)]$ and the exponential-tail p99 equal to that
mean times $\log100$; and discrete-event simulation (DES) generates 100 independent
50,000-root streams from the frozen fitted family, initialized at the observed
post-prefix queue state, and reports their median p99.
The actual paired evaluation cohort is never used to fit a prediction. Control
arms are evaluated separately on that cohort: static 10% and 25% headroom admit
only while the trailing offered-load estimate is below 0.90 and 0.75,
respectively, and the candidate adaptive controller chooses admission using the
same trailing 1,000-root history, initialized by the fitting prefix. No controller changes service capacity; a
rejected root is a logged drop.

**Outcomes, metrics, and units.** Prediction scalar loss is
$L_s=\min(100,|\widehat W_{0.99}-W^{\mathrm{eval}}_{0.99}|)$ service-time
units, with $L_{\max}^{\mathrm{pred}}=100$ service-time units. The primary DES-versus-Kingman contrast has a
**project-chosen** 20% relative reduction gate. Kingman is the strongest
closed-form mature null available from the frozen first-two-moment information;
the deterministic mean-load and $M/M/1$ arms are exact weaker boundary arms,
not substitutes for it. DES-versus-mean-load, DES-versus-$M/M/1$, and every
control-arm comparison are secondary and enter the within-protocol simultaneous
max-$|t|$ family; they cannot promote the protocol. Also report mean, p95, and
p99 wait in service-time units, time-average queue length in jobs, 50,000 evaluation roots
partitioned into admitted/completed/dropped, useful completed service units,
utilization, CPU seconds, bytes, and generated DES events. In the separately
labelled candidate-versus-static-25% control comparison, every controller also
has the dimensionless scalar loss

$$
L_s^{\mathrm{ctrl}}=\min\!\left(100,
100\frac{\sum_{i\in\{\mathrm{dropped,lost}\}}v_i}
{\sum_{i\in\mathrm{evaluation\ roots}}v_i}\right)
$$

percentage points, where
$v_i=1$ for an ordinary root and $v_i=5$ for a priority root; its
$L_{\max}^{\mathrm{ctrl}}=100$. Protected directions
are zero additional dropped-root fraction and at most one percentage point
lower useful-throughput fraction; these are project-chosen margins. Root count
and offered-service reconciliation have zero margin.

**Feasibility, stopping, and abstention.** For admitted evaluation-cohort roots,
integrate their cohort occupancy from first evaluation arrival through their
last terminal event. The exact finite-cohort identity
$\bar L=(N/H)\bar W$ must hold within the **project-chosen** 0.5%, where $H$ is
that interval in service-time units, $N$ completed cohort roots, and $\bar W$
their mean sojourn time. All controllers face identical root arrivals, service,
priority, and retry draws. Fitted offered load is
$\widehat\rho=\bar S/\bar A$, where $\bar S$ is mean potential service and
$\bar A$ is mean inter-arrival time over root IDs 1--10,000. Its one-sided 99%
upper bound is the 1,980th sorted value from exactly 1,999 paired root-index
bootstrap resamples, using low-64-bit
`SHA256("FM-v1|FM-T08|split|regime|replicate|load-bootstrap")`; the same index
array resamples service and inter-arrival pairs and its hash is persisted. A
zero/non-finite resampled $\bar A$ yields $+\infty$. If that upper bound reaches
one, apply two typed fallbacks. A **prediction arm** returns the mature overload
answer “no finite stable quantile” and receives
$L_{\max}^{\mathrm{pred}}=100$ service-time units. The **candidate controller**
runs static 25% headroom for the complete evaluation cohort, scores that
fallback's $L_s^{\mathrm{ctrl}}$, and adds exactly one **percentage point**,
capped at $L_{\max}^{\mathrm{ctrl}}=100$ percentage points. No service-time
charge is added to controller loss and no percentage-point charge is added to
prediction loss. Event-order corruption, a root without exactly one terminal
state, or offered-work mismatch assigns each affected row its own typed cap and
adverse protected endpoints. Development must meet the common power target for the 20% shifted
contrast.

**No-results wording.** Protocol specification only; no FM-T08 result exists.
This protocol adds a mature operations-science null and does not create a new
queueing claim or principle.

### FM-T09 — Accounting boundaries and transfer-price alignment

**Claim tested:** proposed C-1487.

**Frozen DGP, actions, and ledgers.** Two modules independently choose proposed
upstream production $q_u$ and downstream order $q_d$ on the 0.01 grid in
$[0,60]$ quantity units. Cleared quantity is $q=\min(q_u,q_d)$; unmatched
production is not paid and still incurs upstream cost. External value, upstream
production cost, and downstream integration cost are

$$
V(q)=aq-\tfrac12bq^2,\quad
C_u(q)=cq+\tfrac12dq^2,\quad
C_e(q)=gq+\tfrac12hq^2.
$$

Coefficients $a,c,g$ have currency-per-quantity units and $b,d,h$ have
currency-per-quantity-squared units. Confirmation crosses
$a\in\{7,12\}$, $b=0.08$, $c=2$, $d=0.04$,
$g\in\{0,1\}$, $h\in\{0,0.03\}$, and capacity 60, creating both interior and
capacity-bound cells. Within every replicate and cell, use paired seeded
perturbations $a_s=\max(0,a+\xi_a)$,
$c_s=\max(0,c+\xi_c)$, and $g_s=\max(0,g+\xi_g)$ with independent
$\xi_a\sim N(0,0.2^2)$, $\xi_c\sim N(0,0.05^2)$, and
$\xi_g\sim N(0,0.05^2)$ in their corresponding coefficient units; all formulas
below use the perturbed values. This supplies a genuine seed-level sampling
distribution rather than 256 identical deterministic copies. For unit price
$p$ and fixed fee $F$ paid downstream to
upstream, total transfer is $T=pq+F$. Modules choose exact grid best responses

$$
q_u\in\arg\max_{[0,60]}\{pq_u-C_u(q_u)-K_0\mathbf1_{q_u>0}\},
$$

$$
q_d\in\arg\max_{[0,60]}\{V(q_d)-C_e(q_d)-pq_d-F+O(60-q_d)\},
$$

using the smallest maximizing grid value: each module forms its offer as if it
will be filled, after which the declared minimum rule clears the two offers.
Base confirmation has $K_0=0$ and $O=0$. Terminal module profits are
$\pi_u=T-C_u(q_u)-K_0\mathbf1_{q_u>0}$ and
$\pi_d=V(q)-C_e(q)-T+O(60-q)$. Both base outside options are zero; an arm may choose
$(q_u,q_d)=(0,0)$ and $F=0$. System surplus is $\pi_u+\pi_d$, so transfer
payments must cancel exactly and unmatched upstream cost remains visible.

- Transfer A uses the nonlinear downstream opportunity
  $O(z)=3z-0.04z^2$ currency units for unused capacity, where 3 and 0.04 carry
  currency-per-quantity and currency-per-quantity-squared units. Its no-trade downstream
  outside payoff is therefore $O(60)=36$ currency units; upstream remains zero.
- Transfer B sets $K_0=20$ currency units and adds
  $0.02q^2$ currency units of congestion cost to $C_e(q)$.

**Arms, signals, and clearing.** The central ceiling jointly maximizes the
declared system surplus over $(q_u,q_d)$ and observes all coefficients. Let
$q^C$ be that solution and $\lambda^C\ge0$ its capacity multiplier. Upstream
observes only $(c_s,d,K_0,p,F)$; downstream observes only
$(a_s,b,g_s,h,O,p,F)$; the learned coordinator observes only the offers and its
own price history. The privileged marginal-cost benchmark sets
$p=C'_u(q^C),F=0$; full-cost sets
$p=[C_u(60)+K_0]/60,F=0$; fixed negotiated price sets $p=5,F=0$; the privileged dual
benchmark sets $p=C'_u(q^C)+\lambda^C,F=0$. The two-part arm uses the dual unit
price. If variable-transfer profits before the fee are $\pi_u^0,\pi_d^0$ and
outside payoffs are $O_u,O_d$, it trades only when $S\ge O_u+O_d$ and sets
$F=O_u+(S-O_u-O_d)/2-\pi_u^0$; each module then receives its outside payoff
plus half the residual surplus. Otherwise it selects no trade and $F=0$.
These privileged arms are decomposition ceilings, not
deployable comparators. The learned candidate starts $p_0=5,F=0$, observes only
the preceding $(q_u,q_d)$, and iterates
$p_{k+1}=\operatorname{clip}_{[0,20]}[p_k+k_p(q_d-q_u)]$ with the
**project-chosen** gain
$k_p=0.05$ currency per quantity squared, price bounds 0 and 20 currency per
quantity, and at most 1,000 rounds, stopping at the **project-chosen**
$|q_d-q_u|\le0.01$ quantity units. It never observes $a,b,c,d,g,h$,
$K_0$, $O$, or $\lambda^C$.

**Outcomes, metrics, and units.** Scalar seed loss is the equal-weight mean over
the eight confirmation cells $c$ of capped centralized regret,
$L_{s,a}=\frac18\sum_c\min(500,\max(0,S^C_{s,c}-S_{s,a,c}))$ synthetic currency
units, with $L_{\max}=500$. The primary learned-versus-full-cost contrast has a
**project-chosen** 20% relative regret-reduction gate. Full-cost is the strongest
non-privileged frozen-price comparator with the learned arm's local information
boundary. The central, marginal-cost, dual-price, and two-part arms are exact
stronger decomposition ceilings but are inapplicable as primary deployable
comparators because they observe hidden coefficients, $q^C$, $\lambda^C$, or
both modules' surplus/outside payoffs. Learned-versus-fixed-price and all gaps to
the privileged ceilings are secondary, enter the within-protocol simultaneous
max-$|t|$ family, and cannot promote the learned arm. Report $q_u,q_d,q$ in
quantity units; $p$ in currency per quantity; $F,T,\pi_u,\pi_d$, surplus, and
regret in currency; iterations; price volatility; CPU seconds; and bytes.
Protected directions are zero additional module individual-rationality
violations ($\pi_u<O_u$ or $\pi_d<O_d$ for the stated cell-specific outside
payoffs) and
zero capacity violation. Transfer cancellation and
$\pi_u+\pi_d=S$ have a hard $10^{-10}$-currency tolerance.

**Feasibility, stopping, and abstention.** In each base convex cell, the
continuous analytic centralized solution and 0.01 grid solution must agree
within half a grid step (0.005 quantity units), where
$q^*=\operatorname{clip}_{[0,60]}[(a-c-g)/(b+d+h)]$, including both interior and
capacity-bound cases. Best-response objectives, unmatched output, transfer,
outside opportunity, setup cost, and congestion cost are independently
recomputed from the terminal log. For each development seed $s$ and each of the
eight confirmation cells $c$, record exactly one candidate terminal excess-
demand observation $e_{s,c}=q_{d,s,c}-q_{u,s,c}$ at the first declared stopping
round or at round 1,000. Using the common 100,000-resample protected-bootstrap
seed and studentization, construct one simultaneous 99% max-$|t|$ interval for
each of the eight cell means over the 64 development seeds. If a cell's lower
bound is below $-0.01$ **and** its upper bound is above $+0.01$ quantity units,
that cell is frozen before confirmation as abstaining to the mature no-trade
boundary; the same cell map is carried unchanged into both transfers. The
fallback restarts the cell, sets $(q_u,q_d,q)=(0,0,0)$ and $(p,F)=(5,0)$ without
an iteration, scores the complete zero-trade profit/surplus outcome including
outside payoffs, and adds one currency unit of scalar loss capped at
$L_{\max}$. No confirmation observation can trigger or reverse abstention.
Non-convergence, a nonzero fixed fee at no
trade, or an accounting/capacity identity failure receives $L_{\max}$.
Development must meet the common power target for the 20% shifted contrast.

**No-results wording.** Protocol specification only; no FM-T09 result exists.
No particular internal price, module boundary, or accounting policy is claimed
to align local and system objectives in general.

### FM-T10 — Incentive gaming and proxy distortion

**Claims tested:** existing C-139, C-1433, and C-144; no new claim is reserved.
**Mature primary nulls:** `holmstrom1991multitask` and
`CourtyMarschke2004Gaming`.

**Frozen DGP, subgroups, and potential outcomes.** Simulate 64 modules for
20,000 decision rounds plus a 100-round outcome-payment drain. Modules 1--32
have subgroup $G=0$ and 33--64 have $G=1$. Each chooses quality $q$, hidden
maintenance $h$, and gaming $g$ on the 0.05 grid subject to
$q+h+g\le1$. Effort cost is
$C_G=0.5(q^2+h^2+c_Gg^2)$ with $c_0=0.25$ and $c_1=0.10$ synthetic utility
units. The three actions are dimensionless shares; every displayed score or
utility coefficient carries the corresponding per-share units. Confirmation crosses $\kappa\in\{1,3\}$ and
$\beta\in\{0,0.5,1,2\}$. The measured score, maintenance signal, true system
utility, and failure probability are

$$
M=2q+\kappa g+\epsilon_M,
\qquad H=h+\epsilon_H,
$$

$$
U=2q+2h-3g-C_G-20F,
\qquad \Pr(F=1)=0.01+0.20g,
$$

with independent $\epsilon_M,\epsilon_H\sim N(0,0.1^2)$. Before any arm acts,
generate and pair by module-round the two noises, failure uniform $U_F$, audit-
opportunity uniform $U_A$, and flag uniform $U_D$. Then
$F=\mathbf1[U_F<0.01+0.20g]$, scheduled audit
$A=\mathbf1[U_A<0.10]$, ordinary audit flag
$D=A\mathbf1[U_D<\min(1,0.05+0.75g)]$, and red-team flag
$D^{RT}=A\mathbf1[U_D<\min(1,0.05+0.90g)]$. Thus false-positive probability
conditional on audit is 0.05 at $g=0$. One scheduled audit costs ten human
reviewer-minutes. Every arm receives and is charged the same realized audit
calendar, even when its reward ignores the flag; audit minutes remain separate
from CPU seconds and synthetic utility.

For each arm, a module chooses the grid action maximizing its declared expected
module payoff (gross bonus minus audit penalty minus $C_G$), using only exposed
signals and the known pre-action distribution. Ties use lexicographic smallest
$(g,h,q)$. After action, the paired potential outcomes above are realized and
the system logs $M,H,F,U$, gross bonus, penalty, net transfer, and audit minutes.

- Transfer A changes the score at round 10,001 to
  $M'=q+2h+\kappa g+\epsilon_M$. Modules and controllers continue using the old
  reward model for a fixed 100-round detection lag, then use the new exposed
  formula; no arm receives advance notice.
- Transfer B reveals $A$ immediately before action. Fixed pairs
  $(1,2),(3,4),\ldots,(63,64)$ may jointly maximize their summed module payoff
  and allocate gaming between members, subject to each member's unchanged
  $q+h+g\le1$ constraint; all other action and payout rules remain unchanged.

**Arms and reward maps.** Let dimensionless $\beta$ be incentive strength and
let $\gamma_a\ge0$, in synthetic bonus units per score unit, be an arm-specific
multiplier frozen after development. Gross bonus $B_a$ and audit penalty $J_a$
are:

| Arm | $B_a$ | $J_a$ |
|---|---|---|
| No incentive | $0$ | $0$ |
| Metric only | $\gamma_a\beta\max(M,0)$ | $0$ |
| Metric + random audit | $\gamma_a\beta\max(M,0)$ | $3\gamma_a\beta D$ |
| Multi-metric | $\gamma_a\beta\max(M+2H,0)$ | $3\gamma_a\beta D$ |
| Delayed outcome | $\gamma_a\beta\max(M+0.25U,0)$, paid at $t+100$ | $0$ |
| Capped incentive | $\min(2,\gamma_a\beta\max(M,0))$ | $3\gamma_a\beta D$ |
| Red-team audit | $\gamma_a\beta\max(M,0)$ | $5\gamma_a\beta D^{RT}$ |
| Direct-observability ceiling | none; choose $\arg\max E[U]$ directly | $0$ |

The candidate uses the multi-metric bonus and ordinary audit penalty. It starts
at the cell's registered $\beta$; it stays fixed for the first 1,000 rounds and
then, every 100 rounds, moves one step upward on $\{0,0.5,1,2\}$ only when the
simultaneous 99% lower bound for its preceding 1,000-round mean-$U$ difference
from no incentive is positive. At the upper boundary it stays. At the first
nonpositive lower bound it **permanently abstains for the rest of that replicate
to the capped-incentive reward at $\beta=0.5$**, records the fallback transition,
and never resumes the adaptive reward. This is the sole candidate fallback; no
down-one-grid or retain-current alternative exists. For each
$(\kappa,\beta)$ state, metric-only fixes $\gamma=1$. Every other nonzero arm
searches the frozen grid $\gamma_a\in\{0,0.001,\ldots,10\}$ and takes the
smallest value minimizing absolute expected gross-bonus mismatch to metric-only
at that same state; mismatch above the **project-chosen** 1% makes the arm
infeasible. The lookup and targets are frozen, and
Transfer A is not recalibrated. No arm may use audit flags that occur after its
action to change that action. The direct-observability arm chooses the grid
action maximizing expected true $U$ with $q,h,g$ exposed; it receives no bonus,
is excluded from payout matching, and is a privileged ceiling rather than a
deployable comparator.

The online lower bound is itself frozen. Immediately before rounds
$1001,1101,\ldots,19901$ (exactly 190 opportunities), compute for each of the 64
modules its mean paired $U_{\mathrm{candidate}}-U_{\mathrm{no\ incentive}}$ over
the preceding 1,000 roots, using the pre-generated potential-outcome uniforms.
Across those 64 module means use the sample-SD/$\sqrt{64}$ standard error and
the one-sided Student-$t_{63}$ critical value at
$1-0.01/(190\times8)=1-0.01/1520$. This Bonferroni bound is simultaneous over
all 190 opportunities and eight $(\kappa,\beta)$ cells within a regime. If its
standard error is zero, the lower bound equals the common finite module mean;
any non-finite state invokes the same permanent fallback. Confirmation and
transfer data never alter this rule.

**Outcomes, metrics, and units.** Scalar loss is
$L_s=\min(30,\max(0,\bar U_{\mathrm{direct}}-\bar U_a))$ synthetic utility
units per module-round, with $L_{\max}=30$. The primary contrast is candidate
minus **schedule-matched** metric-only mean true utility: the comparator replays
the candidate's logged $\beta_t$ sequence but uses only the metric-only reward,
so strength, gross-bonus target, and audit calendar are paired. It is equally weighted over
$\kappa\in\{1,3\}$ and nonzero $\beta\in\{0.5,1,2\}$; its
**project-chosen** practical gate is 0.10 utility units per module-round.
Schedule-matched random-audit, static multi-metric, delayed-outcome, capped, and
red-team arms are exact secondary comparators: each replays the candidate's
pre-fallback $\beta_t$ schedule, uses its own declared reward map, and undergoes
the same gross-bonus matching. Their candidate differences and the subgroup,
failure, maintenance, payout, and audit endpoints share the protocol's
simultaneous max-$|t|$ family and cannot replace the metric-only primary. The
direct-observability arm is a privileged ceiling and is inapplicable as a
deployable primary because it observes $q,h,g$ and optimizes $U$ directly.
Report $M,H,U$, $q,h,g$, failure fraction, gross bonus, penalty, net transfer,
audit and reserved minutes, delayed-payment liability at drain, absolute
subgroup mean-$U$ gap, CPU seconds, and bytes. Protected directions are: zero
increase in failure fraction, at most 0.02 lower mean maintenance, gross bonus
within 1% of the frozen target, at most 0.05 higher absolute subgroup utility
gap, and zero audit-calendar or payout-ledger violation. The nonzero margins are
project-chosen non-inferiority tolerances.

**Feasibility, stopping, and abstention.** Reconcile all
$64\times20{,}000$ module-round roots, action constraints, paired uniforms,
failures, scheduled audits, ten-minute audit charges, dated bonuses and
penalties, and the 100-round payment drain. In a deterministic noise-free unit
cell, exhaustive direct-observability action search must weakly dominate every
restricted arm within $10^{-12}$ utility units. The first nonpositive candidate
lower bound triggers the sole frozen capped-incentive fallback at $\beta=0.5$
for every remaining round, as defined in the action schedule, and adds 0.01
scalar-loss units capped at $L_{\max}$. An infeasible action, excess
audit, unmatched payout, unpaid delayed liability, or protected hard-gate
violation receives $L_{\max}$. Development must demonstrate the common 0.90
power target for the 0.10 utility margin before confirmation.

**No-results wording.** Protocol specification only; no FM-T10 result exists.
No anti-gaming or incentive-design benefit is claimed, and this protocol does
not create a new principle.

## Mechanism deduplication against the principle registry

The comparison unit is the causal mechanism, not the source discipline's
metaphor. A finance or management term does not earn a new principle when its
residue is already captured by an existing project principle, candidate, or
claim. The following disposition was made before integration.

| Imported topic | Existing mechanism coverage | Integration disposition |
|---|---|---|
| Tail aggregation and coherent risk | C-183, C-525, C-671, C-1268; P-004/P-009; audit-local REC-AFR-06 | Promote the sharper estimator-versus-functional boundary as C-1480; no new principle. |
| Liquidity, leverage, and endogenous feedback | P-006/P-008/P-009; Candidates 012/013 | Add the model-qualified fixed-point claim C-1481; do not introduce a “liquidity” mechanism. |
| Portfolio choice and diversification limits | C-183/C-525; P-001/P-004 | Add estimation-and-constraint qualification C-1482; “portfolio” is an allocation framing, not a new principle. |
| Organizational attention | P-001/P-002/P-007/P-009/P-011/P-013; Candidates 011/012/020 | Add the finite human/organizational attention boundary C-1483; do not equate it with neural or transformer attention. |
| Real options | P-003/P-004/P-009/P-012; Candidates 001/005/009/010 | Add mature stopping-model null C-1484; optionality is already conditional commitment and staged intervention. |
| Governance and internal control | C-525/C-1265/C-1269; P-008/P-009/P-013; Candidates 009/014/020 | Add evidence-root/capacity qualification C-1485; no role-separation or “three lines” principle. |
| Operational resilience | C-175/C-178/C-183/C-184/C-185; P-002/P-003/P-008/P-009/P-012/P-013; Candidates 011/012 | Add scoped governance/evaluation contract C-1486; no new resilience mechanism. |
| Queues and capacity headroom | C-659/C-660/C-661; mature Little/Kingman nulls | FM-T08 strengthens testing only. Claim number 1488 was intentionally unused by this audit at its freeze; no new principle. |
| Accounting boundaries and transfer prices | P-001/P-006/P-009/P-013; Candidates 008/013 | Add local-versus-system accounting boundary C-1487; no market or price principle. |
| Incentives and gaming | C-139/C-1433/C-144; existing multitask-incentive evidence | FM-T10 strengthens the mature null. Claim number 1489 was intentionally unused by this audit at its freeze; no new principle. |

**Registry verdict:** none of the audited residues is irreducible with respect to
the current principle registry. Propose **no new P-series principle and no new
candidate**. Claim numbers 1488 and 1489 were unallocated by this audit at its
freeze; later ledger allocation does not alter its verdict. The eight C-series proposals
add qualifications, scoped evidence, or evaluation boundaries; they do not
certify a candidate architecture.

## Audit disposition

1. C-1480 through C-1487 are now bounded central-ledger entries. Their
   inclusion records evidence and test obligations; it does not promote a
   candidate architecture or assert a result.
2. FM-T01 through FM-T10 are frozen protocol specifications, not executed
   experiments.
3. FM-T08 and FM-T10 deliberately attach to existing claims and do not consume
   claim IDs.
4. Scientific results, legal requirements, engineering translations, and
   project hypotheses remain separately labelled.
5. No quantitative improvement, compliance conclusion, or energy result is
   asserted by this audit.
6. The reciprocal implementation contract is
   [Fixture F-019 — Finance-risk, attention, and governance controls](../../experiments/fixtures/019-finance-risk-attention-governance.md).

## BibTeX-ready primary and authoritative sources

These entries are integrated into the central bibliography. DOI links point to
the article of record; official normative links point to EU, EBA, German-law,
or BaFin sources. Inclusion does not convert a normative source into scientific
evidence.

```bibtex
@article{ArtznerEtAl1999CoherentRisk,
  author  = {Artzner, Philippe and Delbaen, Freddy and Eber, Jean-Marc and Heath, David},
  title   = {Coherent Measures of Risk},
  journal = {Mathematical Finance},
  year    = {1999},
  volume  = {9},
  number  = {3},
  pages   = {203--228},
  doi     = {10.1111/1467-9965.00068},
  url     = {https://doi.org/10.1111/1467-9965.00068}
}

@article{AcerbiTasche2002ExpectedShortfall,
  author  = {Acerbi, Carlo and Tasche, Dirk},
  title   = {On the Coherence of Expected Shortfall},
  journal = {Journal of Banking \& Finance},
  year    = {2002},
  volume  = {26},
  number  = {7},
  pages   = {1487--1503},
  doi     = {10.1016/S0378-4266(02)00283-2},
  url     = {https://doi.org/10.1016/S0378-4266(02)00283-2}
}

@article{BrunnermeierPedersen2009Liquidity,
  author  = {Brunnermeier, Markus K. and Pedersen, Lasse Heje},
  title   = {Market Liquidity and Funding Liquidity},
  journal = {The Review of Financial Studies},
  year    = {2009},
  volume  = {22},
  number  = {6},
  pages   = {2201--2238},
  doi     = {10.1093/rfs/hhn098},
  url     = {https://doi.org/10.1093/rfs/hhn098}
}

@article{CifuentesFerrucciShin2005Contagion,
  author  = {Cifuentes, Rodrigo and Ferrucci, Gianluigi and Shin, Hyun Song},
  title   = {Liquidity Risk and Contagion},
  journal = {Journal of the European Economic Association},
  year    = {2005},
  volume  = {3},
  number  = {2--3},
  pages   = {556--566},
  doi     = {10.1162/jeea.2005.3.2-3.556},
  url     = {https://doi.org/10.1162/jeea.2005.3.2-3.556}
}

@article{Markowitz1952PortfolioSelection,
  author  = {Markowitz, Harry},
  title   = {Portfolio Selection},
  journal = {The Journal of Finance},
  year    = {1952},
  volume  = {7},
  number  = {1},
  pages   = {77--91},
  doi     = {10.2307/2975974},
  url     = {https://doi.org/10.2307/2975974}
}

@article{JagannathanMa2003Constraints,
  author  = {Jagannathan, Ravi and Ma, Tongshu},
  title   = {Risk Reduction in Large Portfolios: Why Imposing the Wrong Constraints Helps},
  journal = {The Journal of Finance},
  year    = {2003},
  volume  = {58},
  number  = {4},
  pages   = {1651--1683},
  doi     = {10.1111/1540-6261.00580},
  url     = {https://doi.org/10.1111/1540-6261.00580}
}

@article{Ocasio1997Attention,
  author  = {Ocasio, William},
  title   = {Towards an Attention-Based View of the Firm},
  journal = {Strategic Management Journal},
  year    = {1997},
  volume  = {18},
  number  = {S1},
  pages   = {187--206},
  doi     = {10.1002/(SICI)1097-0266(199707)18:1+<187::AID-SMJ936>3.0.CO;2-K}
}

@article{McDonaldSiegel1986Waiting,
  author  = {McDonald, Robert and Siegel, Daniel},
  title   = {The Value of Waiting to Invest},
  journal = {The Quarterly Journal of Economics},
  year    = {1986},
  volume  = {101},
  number  = {4},
  pages   = {707--727},
  doi     = {10.2307/1884175},
  url     = {https://doi.org/10.2307/1884175}
}

@article{DoyleGeMcVay2007InternalControl,
  author  = {Doyle, Jeffrey and Ge, Weili and McVay, Sarah},
  title   = {Determinants of Weaknesses in Internal Control over Financial Reporting},
  journal = {Journal of Accounting and Economics},
  year    = {2007},
  volume  = {44},
  number  = {1--2},
  pages   = {193--223},
  doi     = {10.1016/j.jacceco.2006.10.003},
  url     = {https://doi.org/10.1016/j.jacceco.2006.10.003}
}

@article{Hirshleifer1956TransferPricing,
  author  = {Hirshleifer, Jack},
  title   = {On the Economics of Transfer Pricing},
  journal = {The Journal of Business},
  year    = {1956},
  volume  = {29},
  number  = {3},
  pages   = {172--184},
  doi     = {10.1086/294110},
  url     = {https://doi.org/10.1086/294110}
}

@article{CourtyMarschke2004Gaming,
  author  = {Courty, Pascal and Marschke, Gerald},
  title   = {An Empirical Investigation of Gaming Responses to Explicit Performance Incentives},
  journal = {Journal of Labor Economics},
  year    = {2004},
  volume  = {22},
  number  = {1},
  pages   = {23--56},
  doi     = {10.1086/380402},
  url     = {https://doi.org/10.1086/380402}
}

@misc{EU2022DORA,
  author = {{European Parliament and Council of the European Union}},
  title  = {Regulation (EU) 2022/2554 on Digital Operational Resilience for the Financial Sector},
  year   = {2022},
  url    = {https://eur-lex.europa.eu/eli/reg/2022/2554/oj/eng},
  note   = {Official Journal text; consolidated applicability must be checked at use time}
}

@misc{EU2024CRDVI,
  author = {{European Parliament and Council of the European Union}},
  title  = {Directive (EU) 2024/1619 Amending Directive 2013/36/EU as Regards Supervisory Powers, Sanctions, Third-Country Branches, and Environmental, Social and Governance Risks},
  year   = {2024},
  url    = {https://eur-lex.europa.eu/eli/dir/2024/1619/oj/eng},
  note   = {Official Journal text; national transposition and scope must be checked at use time}
}

@misc{EBA2021InternalGovernance,
  author = {{European Banking Authority}},
  title  = {Guidelines on Internal Governance under Directive 2013/36/EU (EBA/GL/2021/05)},
  year   = {2021},
  url    = {https://www.eba.europa.eu/publications-and-media/press-releases/eba-publishes-its-final-guidelines-internal-governance},
  note   = {Official EBA source page; revision status must be checked at use time}
}

@misc{GermanyAktG91,
  author = {{Federal Republic of Germany}},
  title  = {Aktiengesetz, \S 91: Organisation; Buchfuehrung},
  year   = {2026},
  url    = {https://www.gesetze-im-internet.de/aktg/__91.html},
  note   = {Official German federal-law portal; current text must be checked at use time}
}

@misc{BaFin2024MaRisk,
  author = {{Bundesanstalt fuer Finanzdienstleistungsaufsicht}},
  title  = {Rundschreiben 06/2024 (BA): Mindestanforderungen an das Risikomanagement (MaRisk)},
  year   = {2024},
  url    = {https://www.bafin.de/SharedDocs/Downloads/DE/Rundschreiben/dl_rs_06_2024_MaRisk_pdf_BA.pdf},
  note   = {Official BaFin source; scope and current version must be checked at use time}
}
```

The repository already contains BibTeX entries `little1961`, `kingman1961`,
`holmstrom1991multitask`, and `EU2009SolvencyII`. Reuse those stable keys rather
than duplicating them. Solvency II is a normative comparator only; the queueing
and multitask-incentive articles are mature scientific nulls for FM-T08 and
FM-T10 respectively.

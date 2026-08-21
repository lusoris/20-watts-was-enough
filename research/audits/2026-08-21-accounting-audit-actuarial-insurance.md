# Accounting, audit, actuarial science, insurance, and financial-risk control

<!-- markdownlint-disable MD013 -->

**Audit date:** 2026-08-21

**Scope:** double-entry bookkeeping, reconciliation, event records and audit
trails, independence and segregation of duties, materiality, audit sampling,
claims reserves and uncertainty, risk pooling and correlated tails, solvency and
stress testing, model risk and governance, adverse selection, moral hazard, and
claims/incident feedback

**Promotion state:** audit-local `AFR-T` propositions only. This audit adds no
principle, central claim, experiment candidate, or candidate fixture. It defines
workstation tests and recommends ledger entries for later deduplication.

**Normative context:** European Union and Germany. The legal and supervisory
sources below were checked against official text available on 2026-08-21.
Applicability to a future system remains unresolved until its provider,
deployer, intended purpose, legal entity, market, users, and data flows are
known. The synthetic tests in this audit use no customer, policyholder, claims,
employee, or other personal data.

**Jurisdictions and authorities:** European Union; Federal Republic of Germany;
European Parliament and Council; European Commission; EIOPA; ESMA; ECB; German
Federal Ministry of Justice/Bundesamt für Justiz. IASB and IAASB material is
used only as clearly labelled international technical guidance. It is not
treated as EU law merely because it is international.

**Source roles:** EU regulations and applicable German statutes are binding
only when their facts and scope hooks are met. EU directives require the
applicable transposition and implementation analysis. EIOPA/ESMA/ECB material
is supervisory rule, guidance, or a domain comparator according to the exact
instrument. IASB/IAASB documents are technical or interpretive sources unless
a specific EU adoption or national rule makes a particular text applicable.
Peer-reviewed papers support formal, model-relative, or empirical claims, not
legal obligations.

## Executive finding

These fields contribute unusually useful **error-control institutions**, but
almost none of them is a natural law and none is automatically an AI
architecture.

- Double entry is a formal balance invariant over a declared account system. It
  can detect an unbalanced posting; it cannot detect a balanced omission,
  balanced fabrication, wrong valuation, wrong boundary, or shared
  misclassification.
- Reconciliation is informative when it compares genuinely separate
  representations, capture paths, or authorities. Two reports derived from the
  same wrong source can reconcile exactly.
- An event log or hash chain can expose alteration after capture under stated
  cryptographic and retention assumptions. It cannot establish that the event
  was captured, described truthfully, authorized, or interpreted under the
  correct schema.
- Independence, review, and segregation of duties constrain authority and
  conflicts. They do not create independent evidence when actors, models,
  credentials, data, or organizational incentives share a failure root.
- Materiality is a decision- and context-qualified governance judgement. Audit
  sampling has an explicit miss probability under a sampling frame and design.
  Neither is a physical detection limit or permission to ignore unmeasured
  harms.
- A reserve estimates delayed or uncertain obligations. Capital, liquidity,
  operational spare capacity, and an accounting provision are different
  states. Pooling reduces idiosyncratic relative variability only under a
  dependence model; common shocks and correlated tails can remove the gain.
- Solvency ratios and stress-test outcomes are conditional on valuation,
  horizon, confidence level, scenario, management-action, and model
  assumptions. Solvency II's 99.5% one-year calibration is a scoped regulatory
  rule, not a universal AI safety target.
- Model governance can make assumptions, ownership, validation, sensitivity,
  use, limitations, changes, and failures visible. A well-governed wrong model
  remains wrong.
- Adverse selection concerns hidden information about type or risk before an
  allocation or contract. Moral hazard concerns behavior or effort affected by
  the protection, allocation, or consequence structure. Ordinary uncertainty
  is neither.
- Claims and incident records are delayed, censored, selected observations.
  Closing a claim or corrective action is not proof that capability recovered,
  recurrence fell, or the observation channel remained stable.

The useful project-level residue is therefore not “financialized AI.” It is a
test contract for **balanced, attributable, independently challengeable state
under delayed obligations and endogenous incident feedback**. Every component
already has strong accounting, database, security, statistics, operations,
economics, or reliability nulls. The composition should be retired whenever
those conventional nulls match its quality–risk–latency–resource frontier.

## Result and deduplication map

| Field mechanism | What survives the audit | Existing project owner | Disposition |
| --- | --- | --- | --- |
| double entry and reconciliation | declared balance invariant plus comparison of separately rooted views | [P-013](../principle-registry.md#p-013--externalized-shared-state), storage and metrology audits | mature null; add a workstation falsifier |
| event record and audit trail | versioned lineage, tamper evidence, replay boundary, external-effect receipts | [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md), [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md), [Candidate 017](../../experiments/candidates/017-contract-preserving-semantic-compaction.md) | no new candidate |
| independence and segregation | authority conflict control plus a measurable failure-root graph | [P-008](../principle-registry.md#p-008--compartmentalized-interaction), [P-009](../principle-registry.md#p-009--maintenance-plane), [Candidate 020](../../experiments/candidates/020-constitutional-control-plane.md) | governance null and hostile test |
| materiality and sampling | purpose-qualified action threshold plus design-specific miss probability | [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md), metrology and legal-evidence audits | sharper evidence boundary |
| reserves and delayed claims | versioned forecast of obligations with prediction uncertainty and experience comparison | [P-009](../principle-registry.md#p-009--maintenance-plane), [P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime), [Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md), [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md) | workstation benchmark, not architecture |
| pooling and tail dependence | covariance-explicit aggregation and common-shock falsification | [P-004](../principle-registry.md#p-004--diversity-selection-and-protection), [C-183](../claims.md#c-183), [C-525](../claims.md#c-525), [C-671](../claims.md#c-671) | deduplicates |
| solvency, stress, and model governance | scenario- and horizon-qualified resource envelope with independent validation | [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md), [Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md), [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md) | mature comparator |
| adverse selection and moral hazard | hidden-type and hidden-action factorials only when persistent incentives exist | [C-139](../claims.md#c-139)–[C-144](../claims.md#c-144), [Candidate 008](../../experiments/candidates/008-contestable-modular-allocation.md) | strengthens candidate entrance criteria |
| claims and incident feedback | explicit reporting, delay, settlement, action, verification, and recurrence process | [C-178](../claims.md#c-178), [C-184](../claims.md#c-184), [C-185](../claims.md#c-185), [Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md) | deduplicates; add selection falsifier |

No uniquely justified candidate edit survives this pass.

## Four evidence types that must never inherit from one another

| Type | Question answered | Valid support | Invalid inheritance |
| --- | --- | --- | --- |
| formal identity or theorem | What follows from the declared definitions and assumptions? | proof, derivation, executable invariant check | implementation quality, empirical frequency, legal authority, social benefit |
| empirical assumption or estimate | What occurred or how well did a model predict in a defined population and observation process? | measurement, experiment, sampling design, uncertainty analysis | universal law, future regime, causal mechanism without identification |
| governance or legal rule | Who must, may, or must not act, record, review, disclose, reserve, or decide under an applicable authority? | applicable law, regulation, authorized policy, contract, adopted standard | causal effectiveness, optimality, physical necessity |
| AI translation hypothesis | Does a typed mechanism improve an AI system against complete conventional nulls? | preregistered equal-budget synthetic and workstation experiment, then external replication | analogy, regulatory adoption, balance identity, or a paper from the source domain |

For example, $A=L+E$ is an accounting identity after recognition and
measurement decisions. A statutory-audit independence rule is a governance
constraint. A lower reserve error in a claims triangle is an empirical result.
“Use two ledgers for AI state” is a separate engineering hypothesis. None of
the first three proves the fourth.

## Terms that must remain distinct

| Term | Exact role | Does not imply |
| --- | --- | --- |
| source event | asserted occurrence before accounting classification | complete or truthful capture |
| journal entry | typed postings attributed to one event and accounting rule | correct event, value, boundary, or authorization |
| ledger | accumulated account state under a posting and period policy | ground truth |
| double entry | equal-and-opposite/balanced posting relation in a declared account algebra | absence of omission, fraud, or shared error |
| trial balance | equality of aggregate debit and credit totals | accurate financial position or semantic validity |
| reconciliation | comparison and resolution of differences between two declared views | independence when both views share the same source |
| event sourcing | deriving application state by replaying retained domain events | stable semantics, reversible outside effects, or audit-grade evidence |
| audit trail | records intended to support traceability and accountability | tamper evidence, completeness, authenticity, or factual truth by itself |
| tamper evidence | alteration becomes detectable under stated hash, key, checkpoint, and retention assumptions | prevention, correct original capture, or availability |
| internal control | policy and mechanism intended to constrain error, misuse, or reporting risk | guaranteed prevention or detection |
| segregation of duties | incompatible authority is divided among principals or roles | independent knowledge, no collusion, or no common-mode failure |
| independent assurance | scoped work by an appropriately independent party under an identified criterion | future viability or total system correctness |
| materiality | context-qualified relevance of an omission or misstatement to a specified decision or requirement | a universal percentage or moral insignificance |
| detection limit | smallest signal/anomaly a declared method detects with stated error probabilities | materiality or acceptable consequence |
| audit sample | inspected units selected from a defined population and frame | complete coverage or evidence about unrecorded units |
| reserve/technical provision | estimate and/or prescribed amount for future obligations under a valuation basis | cash on hand, compute headroom, or solvency capital |
| capital | loss-absorbing financial resource under a legal/accounting definition | liquidity at the required time |
| liquidity | ability to meet due cash flows under a horizon and market-access assumption | positive net assets or long-run solvency |
| operational headroom | deliverable spare compute, memory, authority, staff, or service capacity | a booked reserve or capital buffer |
| pooling | aggregation of exposures | diversification without a dependence model |
| solvency | ability or regulatory position relative to obligations/capital requirements under a valuation regime | safety in every scenario |
| stress test | conditional response to a prescribed adverse scenario and action rule | probability of that scenario or exhaustive robustness |
| backtest | comparison of model outputs with realized outcomes under a frozen scoring rule | future validity after regime change |
| validation | structured challenge of data, assumptions, methods, outputs, use, and limitations | proof that the model is true |
| adverse selection | decision-relevant hidden type or risk before allocation/contracting | hidden action after protection |
| moral hazard | action or effort changes because consequences, protection, or monitoring changed | every performance drift or random error |
| claim | asserted demand/incident routed through a reporting and adjudication process | latent incident count, verified liability, or final loss |
| settlement/closure | procedural disposition under a rule and evidence state | restoration, prevention, or no recurrence |

## EU/Germany normative source register

The register records authority and scope rather than converting the whole
project into a regulated financial undertaking.

| Source checked 2026-08-21 | Role and version | Applicability hook | What this audit uses | Boundary |
| --- | --- | --- | --- | --- |
| German [HGB § 238](https://www.gesetze-im-internet.de/hgb/__238.html) and [§ 239](https://www.gesetze-im-internet.de/hgb/__239.html) | binding German commercial-law text in the official federal service | merchant and relevant bookkeeping/retention facts | traceable origin and processing; complete, correct, timely, ordered records; original content and time of later changes remain ascertainable | not a law of AI memory; exact entity and record duties require German legal analysis |
| [Regulation (EC) 1606/2002, Article 4](https://eur-lex.europa.eu/legal-content/en/ALL/?uri=CELEX:32002R1606) and [Commission Regulation (EU) 2023/1803, consolidated 2026-03-08](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02023R1803-20260308) | binding EU accounting-adoption framework and adopted standards text | principally EU-law-governed publicly traded companies' consolidated accounts, plus Member-State options and later amendments | demonstrates that IASB issuance and EU legal adoption are separate events | IASB publications are not automatically EU law; current consolidated and authentic OJ text must be checked for the specific reporting period |
| [Directive 2013/34/EU, Article 2(16)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02013L0034-20240528) | EU directive; consolidated text checked | undertakings and reports within directive/national implementation scope | materiality is tied to whether omission or misstatement could reasonably influence users' decisions and is assessed with similar items | requires applicable national implementation; does not authorize one cross-domain percentage |
| [Directive 2006/43/EC](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:02006L0043-20240109), especially Articles 21, 22, 24a, 24b, 25a, and 26 | EU statutory-audit directive; consolidated 2024-01-09 | statutory audit of annual/consolidated financial statements under EU/national law | professional scepticism, independence, conflict threats, quality controls, breach/complaint/audit files, resource sufficiency, and the boundary that statutory audit does not assure future viability or management effectiveness | national implementation and engagement scope govern; IAASB standards apply through the applicable adoption/national route, not by label alone |
| [Regulation (EU) 537/2014](https://eur-lex.europa.eu/eli/reg/2014/537/oj/eng), especially Articles 5–8 and 10 | binding EU regulation for specified public-interest-entity statutory audits | statutory audit of a public-interest entity and related actors/services | prohibited non-audit services, independence assessment, irregularity path, and engagement quality-control review by a reviewer not involved in the engagement | not a universal two-person rule for every AI action |
| [Directive 2009/138/EC (Solvency II), consolidated 2025-01-17](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02009L0138-20250117) and [EIOPA Single Rulebook](https://www.eiopa.europa.eu/rulebook/solvency-ii-single-rulebook_en) | EU insurance prudential framework; EIOPA rulebook is a documentation tool, authentic EU law remains the OJ | insurance/reinsurance undertaking and specific provision | technical provisions, SCR calibration, internal-model use/quality/validation/documentation, experience comparison | none of its calibration constants is a universal AI safety law |
| German [VAG § 26](https://www.gesetze-im-internet.de/vag_2016/__26.html), [§§ 76–79 and 111–121](https://www.gesetze-im-internet.de/vag_2016/BJNR043410015.html) | binding German insurance-supervision law; official text last amended by Article 25 of the Act of 25 March 2026 | supervised German insurance undertaking and exact provision | integrated and independent risk-control function; reserve uncertainty; internal-model use, data, calibration, profit/loss attribution, validation, and documentation | insurance implementation anchor, not a direct duty for this research repository |
| [Regulation (EU) 2022/2554 (DORA), Articles 12–13](https://eur-lex.europa.eu/eli/reg/2022/2554/oj) | binding EU regulation | an in-scope financial entity and ICT activity | multiple recovery checks/reconciliations; post-major-incident cause, response, forensic, escalation, improvement, and implemented-change review | incident review is not itself evidence that recurrence fell |
| [Regulation (EU) 2024/1689 (AI Act)](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32024R1689), especially Articles 9, 12, 15, 17 and Annex III | binding EU regulation with staged application | provider/deployer role, intended purpose, placing on market/use, and a high-risk classification; Annex III includes specified life/health-insurance risk-assessment and pricing uses | risk management, logging, robustness/cybersecurity, and quality-system applicability must be analyzed if a future system enters scope | this audit does not classify an unspecified future system; insurance subject matter alone is insufficient |
| [Directive (EU) 2025/2](https://eur-lex.europa.eu/eli/dir/2025/2/oj/eng) | in-force amending directive; transposition by 29 January 2027 and national application from 30 January 2027 | later Solvency II implementation and the affected undertaking/provision | transition flag for future audits | do not apply its future national rules as if already applicable on the audit date |
| [IFRS Practice Statement 2](https://www.ifrs.org/issued-standards/list-of-standards/materiality-practice-statement/) | IASB non-mandatory technical guidance, issued 2017 | voluntary use in IFRS financial-report materiality judgements; exact adopted IFRS context still checked separately | nature, magnitude, context, aggregation, and a four-step judgement process | the IASB explicitly labels it non-mandatory; it creates no stand-alone EU obligation |
| [IAASB 2025 Handbook](https://www.iaasb.org/publications/2025-handbook-international-quality-management-auditing-review-other-assurance-and-related-services), including ISA 320 and ISA 530 | international technical standards, current 2025 edition | applicable engagement plus adoption/national-standard route | materiality and audit-sampling comparator | Directive 2006/43 Article 26 makes the EU adoption/national route material; do not cite “ISA” as automatically binding EU law |
| [ECB revised Guide to internal models, publication approved 5 February 2024](https://www.ecb.europa.eu/press/govcdec/otherdec/2024/html/ecb.gc240223~b09bfd5ce7.en.html) | supervisory banking guide/comparator | significant institution and SSM supervisory context | mature model-risk governance comparator | banking supervision is not insurance law or a generic AI mandate |
| [EIOPA methodological principles of insurance stress testing](https://www.eiopa.europa.eu/publications/methodological-principles-insurance-stress-testing_en) and [2024 insurance stress test](https://www.eiopa.europa.eu/insurance-stress-test-2024_en) | supervisory methodology/exercise | participating insurance undertaking and exact exercise specification | severe-but-plausible scenarios; capital/liquidity separation; fixed- versus constrained-balance-sheet management actions | an exercise result is conditional on sample, scenario, valuation, and allowed actions |

## 1. Double entry, conservation, and reconciliation

### Formal identity

For event $e$, let $p_e\in\mathbb{R}^k$ be its posting vector in one
declared currency and sign convention. Let $B$ encode the account-balance
constraints. A balanced journal entry satisfies

$$
Bp_e=0.
$$

For the simplest scalar debit/credit representation, this reduces to

$$
\sum_{j=1}^{k}p_{e,j}=0.
$$

Each $p_{e,j}$ is measured in the accounting currency, for example EUR. If
multiple currencies, quantities, time bases, or valuation bases are mixed,
conversion and measurement must occur before the equality is meaningful or the
state must remain vector-valued. The familiar balance-sheet relation

$$
A_t-L_t-E_t=0
$$

is likewise an identity after the reporting entity, recognition, measurement,
classification, consolidation, and period rules have been applied. $A_t$,
$L_t$, and $E_t$ use the same currency and valuation date. Ellerman gives a
formal group-of-differences treatment of double entry
([DOI: 10.1080/0025570X.1985.11977191](https://doi.org/10.1080/0025570X.1985.11977191)).

The invariant detects a posting outside the null space of $B$. It does not
detect:

1. a real event omitted from all accounts;
2. a fabricated but balanced event;
3. a duplicated balanced event;
4. equal and opposite errors;
5. correct arithmetic under a wrong event type, entity boundary, price,
   currency conversion, period, or valuation rule; or
6. a shared transformation bug that affects every derived view.

“Balanced” is therefore a machine-checkable predicate, not an epistemic grade.

### Reconciliation and independence

Let $y_t^{(1)}$ and $y_t^{(2)}$ be two views of the same declared quantity, and
let $T_t$ transform the second view into the first view's unit, boundary, and
vintage. The reconciliation residual is

$$
r_t=y_t^{(1)}-T_t y_t^{(2)}.
$$

If their standard uncertainties are $u_1,u_2$ and their error covariance is
$c_{12}$, a diagnostic standardized residual is

$$
z_t=\frac{r_t}{\sqrt{u_1^2+u_2^2-2c_{12}}}.
$$

$r_t$, $u_1$, and $u_2$ share the measurand's unit; $z_t$ is dimensionless.
Dropping $c_{12}$ silently asserts an independence relation. Reconciliation is
strongest when the views have separately measured capture, transformation,
credential, software, operator, and review roots. DORA Article 12(7) requires
checks including multiple checks and reconciliations in its scoped recovery
setting; HGB §§ 238–239 require traceable and ordered commercial records in
their scope. Those governance rules do not alter the covariance algebra.

### AI translation and null

An AI system may use balanced postings for actually conserved or budgeted
quantities: compute allotments, storage quotas, energy budgets, capability
grants, outstanding work, or reversible state transitions. It must not force a
balance metaphor onto quality, truth, confidence, harm, or learned parameters
unless an actual conservation law or accounting policy has been defined.

The strongest null is a typed transaction/event schema with ordinary database
constraints, independently rooted reconciliation, idempotency keys, and
explicit correction entries. A proposed “neural ledger” has no residual merely
because it uses two numbers or a balancing loss.

## 2. Event sourcing, audit trails, and tamper evidence

For a canonical event encoding $m_t$, a simple forward hash chain is

$$
h_t=H(h_{t-1}\,\|\,t\,\|\,v_t\,\|\,m_t),
$$

where $H$ is a named cryptographic hash, $v_t$ is the schema/interpreter
version, $t$ is an ordered event identifier, and $\|$ denotes unambiguous
serialization. The chain makes a later alteration detectable only if the
verifier retains or obtains a trustworthy earlier checkpoint/root, the encoding
is canonical, the hash and key assumptions hold, and relevant records remain
available. Haber and Stornetta established a foundational digital time-stamping
construction ([DOI: 10.1007/BF00196791](https://doi.org/10.1007/BF00196791)).

The chain does not show that:

- a source event was observed rather than omitted;
- the event author was truthful, competent, or authorized;
- the event time equals receipt, processing, or recording time;
- the schema represented the intended semantics;
- replay through a later interpreter yields the original state; or
- a tool call, payment, message, or physical effect outside the log was undone.

HGB § 239(3) supplies a scoped institutional requirement that the original
content and timing of modifications remain ascertainable. It does not prescribe
this hash-chain design. Event sourcing, change-data capture, write-ahead logs,
audit logs, signed receipts, and provenance graphs remain different contracts,
as already established by [C-325](../claims.md#c-325)–[C-337](../claims.md#c-337).

The AI null is a versioned append-only event store with canonical schemas,
external-effect receipts, checkpoint verification, replay tests, retention,
key rotation, access control, and correction/supersession semantics. Candidate
009 owns assurance grades; Candidate 014 owns observation dependency/vintage;
Candidate 017 owns preservation across compaction and migration.

## 3. Independence, segregation of duties, and assurance scope

### Governance rule

Directive 2006/43 Article 22 requires statutory-audit independence from the
audited entity and exclusion from its decision-taking in the directive's scope.
It names self-review, self-interest, advocacy, familiarity, and intimidation
threats. Regulation 537/2014 adds public-interest-entity restrictions and an
engagement quality-control reviewer who is not involved in the engagement.
VAG § 26 establishes an independent risk-control function for its insurance
scope. These are authority/conflict rules, not empirical proof that a review
detects an error.

In systems terms, let $R(a)$ be the set of roles held by actor $a$, and let
$\mathcal{F}$ be the declared set of forbidden role combinations. Static
segregation requires

$$
\forall a,\quad R(a)\notin\mathcal{F}.
$$

Dynamic segregation instead constrains the actors or credentials participating
in one transaction history. Saltzer and Schroeder's separation-of-privilege
principle is the mature computer-security null
([DOI: 10.1109/PROC.1975.9939](https://doi.org/10.1109/PROC.1975.9939)).

### Empirical assumptions

The expected gain depends on quantities that the role graph alone does not
specify:

- the base rate and type of defects or abuse;
- each reviewer's sensitivity and false-alarm rate;
- dependence among their data, model, code, organization, and incentives;
- collusion and credential-compromise probability;
- authority to stop or correct;
- review time, queueing, fatigue, and bypass; and
- the loss from delay or deadlock.

Two personas produced by the same model, prompt, toolchain, and policy are not
two independent assurance roots. Two credentials controlled by one principal
are not segregation. Conversely, rigid separation can slow urgent repair,
diffuse responsibility, or block low-risk routine work.

### AI translation and null

The translation must name incompatible functions such as proposer, executor,
evidence collector, evaluator, release authority, incident commander, and
remedy owner. It must also name emergency override, expiry, retrospective
review, and credential recovery. The null is ordinary RBAC/capability control,
two-person authorization where justified, independent CI/evaluation, signed
artifacts, and sampled audit. Candidate 020 is relevant only when there is real
asymmetric information, conflicting incentive, spillover, or authorized
standing—not because a workflow has two boxes.

## 4. Materiality, sampling, and detection limits

### Materiality is a typed decision relation

Directive 2013/34/EU Article 2(16) ties materiality to whether omission or
misstatement could reasonably influence decisions based on an undertaking's
financial statements and requires assessment in the context of similar items.
IFRS Practice Statement 2 further treats materiality as entity-specific and
dependent on nature, magnitude, or both, but explicitly remains non-mandatory.

For this project, a materiality record is therefore a tuple rather than a
single percentage:

$$
M=(q,\,u,\,d,\,c,\,g,\,a,\,\tau,\,v),
$$

where $q$ is the quantity or information item, $u$ the intended user/decision
owner, $d$ the decision, $c$ the consequence vector, $g$ affected group or
protected interest, $a$ aggregation/context, $\tau$ time horizon, and $v$ the
applicable rule/version. Units remain attached to each consequence component.
A governance rule may define an action threshold from this record; science
must not hide that value choice inside a detector.

### Exact sampling miss probability

If a finite population contains $N$ units, exactly $m$ of which carry the
defined anomaly, and a simple random sample without replacement inspects $n$
units, then

$$
P_{\mathrm{miss}}(N,m,n)=
\begin{cases}
\dfrac{\binom{N-m}{n}}{\binom{N}{n}},&n\leq N-m,\\[6pt]
0,&n>N-m.
\end{cases}
$$

$N,m,n$ are counts and the probability is dimensionless. Under independent
Bernoulli sampling from a population with anomaly prevalence $p$,

$$
P_{\mathrm{miss}}=(1-p)^n,
\qquad
P_{\mathrm{detect}}=1-P_{\mathrm{miss}}.
$$

These formulas do not cover clustered anomalies, unequal selection, adaptive
stopping, imperfect tests, frame omissions, duplicates, or a perpetrator who
can predict the sample. ISA 530 is an international technical comparator for
audit sampling; its legal use in an EU statutory audit still follows the
applicable adoption/national route described by Directive 2006/43 Article 26.

### AI translation and null

Randomized audit is useful only when full evaluation is costly and the sample
frame includes the relevant outputs, actions, users, and time periods. Rare
protected-tail errors require stratification or targeted oversampling without
pretending the resulting sample is self-weighting. A model's “confidence” is
not an audit sampling probability.

The conventional nulls are full scan, uniform random sampling, stratified
sampling, probability proportional to a declared size/risk measure, sequential
testing with multiplicity control, and adversarial red teaming. The AI proposal
must report miss probability for planted anomaly classes, not an unqualified
“audit coverage” percentage.

## 5. Reserves, delayed obligations, and uncertainty

### Estimate, not spare capacity

Solvency II Article 77 and German VAG §§ 76–78 distinguish the best estimate
and risk margin within technical provisions. VAG § 77 defines the best estimate
as the probability-weighted average present value of future cash flows based on
current credible information, realistic assumptions, and appropriate
actuarial/statistical methods. This is a legal valuation rule in scope, not a
claim that the realized value will equal the estimate.

For a generic delayed-obligation process, write

$$
R_t=
\mathbb{E}\!\left[
\sum_{u>t}D(t,u)C_u
\,\middle|\,\mathcal{F}_t,\mathcal{M}_t
\right],
$$

where $C_u$ is a future net cash flow or obligation in EUR at time $u$,
$D(t,u)$ is a dimensionless discount factor, $\mathcal{F}_t$ is information
available at valuation time, and $\mathcal{M}_t$ names the model and assumption
version. $R_t$ is in EUR at time $t$. The realized forecast error is

$$
e_t=L_{t:\infty}-R_t,
$$

where $L_{t:\infty}$ is the subsequently observed discounted obligation under
the same boundary. This error is not known at valuation time, and even later it
can change with claims reopening, late reporting, inflation, legal change, or
boundary revision.

### A conventional claims-triangle null

Let $C_{i,k}$ be cumulative paid or incurred claims for origin period $i$ at
development age $k$, in EUR. A Mack chain-ladder model uses conditional mean
and variance assumptions of the form

$$
\mathbb{E}[C_{i,k+1}\mid\mathcal{F}_k]=f_k C_{i,k},
\qquad
\operatorname{Var}(C_{i,k+1}\mid\mathcal{F}_k)=\sigma_k^2 C_{i,k},
$$

with origin-period independence and further regularity conditions. Mack derives
a distribution-free standard-error estimator under the model
([DOI: 10.2143/AST.23.2.2005092](https://doi.org/10.2143/AST.23.2.2005092)).
“Distribution free” does not mean assumption free. Calendar effects, changing
case management, inflation, catastrophe mixtures, reporting delays, legal
change, and dependence can violate the model. England and Verrall survey
stochastic reserving models and emphasize prediction error and predictive
distributions
([DOI: 10.1017/S1357321700003809](https://doi.org/10.1017/S1357321700003809)).

EIOPA Delegated Regulation 2015/35 Article 264 requires at least annual
validation and comparison against experience in its scope; Article 272 requires
the actuarial function to assess uncertainty and review past best estimates.
The useful translation is the cycle, not the financial label:

```text
latent obligation
  -> selected/delayed report
  -> versioned estimate and interval
  -> resource decision
  -> later development/settlement
  -> experience comparison
  -> assumption/model/data change with preserved lineage
```

### AI translation and null

An AI analogue may forecast future remediation work, delayed tool failures,
appeals, safety incidents, retraining debt, or restoration cost. Call it a
reserve only if obligation boundary, unit, horizon, discount/priority rule,
observation delay, uncertainty, and deliverable backing are explicit. A scalar
loss estimate is not available compute. An earmarked compute budget is not an
estimate of expected incidents.

The nulls are survival/delay models, state-space forecasts, quantile regression,
conformal or distributional prediction under stated exchangeability, stochastic
programming, robust optimization, and ordinary capacity planning.

## 6. Pooling, dependence, and correlated tails

For aggregate loss or demand $S=\sum_{i=1}^{n}X_i$,

$$
\mathbb{E}[S]=\sum_i\mu_i,
\qquad
\operatorname{Var}(S)=
\sum_i\sigma_i^2+2\sum_{i<j}\operatorname{Cov}(X_i,X_j).
$$

All $X_i$, $S$, $\mu_i$, and $\sigma_i$ use the same loss unit, such as EUR or
joules; variance and covariance use the squared unit. For equal variance
$\sigma^2$ and equicorrelation $\rho$,

$$
\operatorname{Var}(\bar X)=
\sigma^2\left(\rho+\frac{1-\rho}{n}\right).
$$

When $\rho=0$, standard deviation of the mean decreases as $n^{-1/2}$. For
positive $\rho$, it approaches $\sigma\sqrt{\rho}$ rather than zero. The
equicorrelation model is illustrative; real common shocks, nonlinear
dependence, and tail dependence require richer models. This is the same
dependency boundary already captured by [C-183](../claims.md#c-183) and
[C-525](../claims.md#c-525).

For loss $L$ with distribution function $F_L$, define

$$
\operatorname{VaR}_{\alpha}(L)
=\inf\{\ell:F_L(\ell)\geq\alpha\},
$$

and one distribution-robust expected-shortfall representation

$$
\operatorname{ES}_{\alpha}(L)
=\frac{1}{1-\alpha}\int_{\alpha}^{1}
\operatorname{VaR}_{u}(L)\,du.
$$

VaR and ES have the same unit as $L$; $\alpha$ is dimensionless. VaR need not
be subadditive for general loss distributions. Properly defined ES is coherent
under the conditions detailed by Acerbi and Tasche
([DOI: 10.1016/S0378-4266(02)00283-2](https://doi.org/10.1016/S0378-4266(02)00283-2));
coherence axioms are desirable mathematical properties, not evidence that a
distribution or confidence level is correct.

The AI translation is a fault-demand portfolio with explicit shared roots:
training corpus, model family, prompt/evaluator, provider, credentials, network,
power, time window, operator, legal rule, and adversary. “Many agents” or
“diverse prompts” is not pooling evidence. Compare empirical common and tail
loss against the declared dependence model and charge the cost of diversity,
monitoring, switching, reserve, and adjudication.

## 7. Solvency, stress tests, and model governance

### Regulatory calibration is scoped

Solvency II Article 101 states that the SCR corresponds to VaR of basic own
funds at 99.5% over one year and names covered risk families. The value
$\alpha=0.995$ and horizon $T=1\ \text{year}$ are a governance calibration for
the specified prudential system. They are not an empirical constant of nature,
a bound on every loss, or a target transferable to arbitrary AI actions.

An AI resource-envelope statement must name at least

$$
\mathcal{E}=
(H,\,\alpha,\,L,\,V,\,D,\,A,\,R,\,G),
$$

where $H$ is horizon, $\alpha$ confidence/tail convention, $L$ loss vector,
$V$ valuation rule, $D$ dependence model, $A$ allowed management or recovery
actions, $R$ available and deliverable resources, and $G$ regime/generator.
Changing any component changes the assertion.

### Stress tests are conditional counterfactuals

For model $f_v$, baseline state $x_0$, scenario operator $S_s$, and allowed
action policy $\pi_a$, a stress result is

$$
y_{s,a}=f_v(S_s(x_0),\pi_a;\theta_v).
$$

It answers “what does this model and action convention produce under this
scenario?” It does not supply $P(S_s)$ and does not bound unmodeled scenarios.
EIOPA's 2024 exercise explicitly separated capital and liquidity and compared a
fixed balance sheet with a constrained balance sheet allowing specified
reactive management actions. That is direct evidence that action assumptions
change stress-test interpretation, not that either result is unconditional
resilience.

### Model governance is a lifecycle, not a certificate

Solvency II Articles 120–125 and German VAG §§ 115–121 provide a mature scoped
pattern:

1. the model is actually used in governance and decision processes;
2. data and statistical methods are appropriate to scope;
3. calibration and profit/loss attribution are explicit;
4. validation compares results and assumptions with experience;
5. sensitivity, stability, and reverse stress are examined;
6. changes and limitations are documented; and
7. an independent knowledgeable third party can understand and reproduce the
   design and outputs from documentation and inputs.

Delegated Regulation 2015/35 Articles 241–244 make independence, triggers,
responsibility, sensitivity, reverse stress, documentation, and reproducibility
concrete. The ECB guide supplies a banking comparator. None proves correctness.

The AI null is ordinary model-risk management with versioned datasets and
code, frozen evaluation, independent validation, calibration, subgroup/tail
tests, sensitivity, challenge models, reverse stress, change control,
deployment monitoring, fallback, and retirement. Candidate 009/014 may add
value only if cross-layer invalidation and observation dependencies improve
outcomes beyond that complete stack at equal cost.

## 8. Adverse selection, moral hazard, and incentive boundaries

Rothschild and Stiglitz analyze competitive insurance with imperfect
information about risk type
([DOI: 10.2307/1885326](https://doi.org/10.2307/1885326)). Holmström analyzes
moral hazard when private action affects the outcome distribution and explores
when an additional imperfect signal is useful for contracting
([DOI: 10.2307/3003320](https://doi.org/10.2307/3003320)). These are models with
declared agents, information, utilities, contracts, and feasible deviations.

Let $\theta_i$ be a persistent type known more accurately to module $i$ before
allocation, $a_i$ a later action or effort, $x_i$ the allocation, $y$ the
outcome, and $T_i$ a real future opportunity consequence. Then

$$
y\sim P(y\mid \theta_i,a_i,x_i),
\qquad
u_i=T_i-C_i(a_i,\theta_i).
$$

- **Adverse selection test:** the allocator cannot cheaply observe
  $\theta_i$, and selection/reporting depends on it before allocation.
- **Moral-hazard test:** $a_i$ is costly, imperfectly observed, and changes
  after the allocation, protection, audit probability, or consequence rule.
- **No incentive problem:** modules share the same objective, the router
  directly observes the relevant state, or no report/action changes a real
  consequence.

Candidate 008 already imposes the correct entrance gate: persistent private
decision-relevant information, a locally advantageous deviation, and a real
opportunity consequence. A token, score, or “premium” that changes no future
choice is bookkeeping. An ordinary calibration error is not adverse selection.
A post-deployment distribution shift is not moral hazard unless an actor's
choice responds to the consequence structure.

The strongest nulls are direct measurement, cooperative routing, calibrated
uncertainty, random audit, proper scoring with protected outcomes, bandits, and
ordinary access control. Only a separate hidden-type/hidden-action factorial can
show whether mechanism-design machinery is needed.

## 9. Claims and incident feedback

Let $I_j$ denote a latent incident, $C_j$ a report/claim, $A_t$ current policy or
intervention, $X_j$ observed context, $D_j$ reporting delay, and $S_j$ later
settlement/verification. A selected observation process can be written

$$
P(C_j=1,D_j\leq d\mid I_j=1,X_j,A_t,	ext{friction},	ext{incentive}).
$$

Observed claim count is therefore not latent incident count. Policy can change
exposure, detection, willingness to report, classification, settlement, and
retention simultaneously. This refines rather than replaces [C-178](../claims.md#c-178):

$$
N_{\mathrm{observed}}
=N_{\mathrm{latent}}
\times p_{\mathrm{detect}}
\times p_{\mathrm{report}}
\times p_{\mathrm{retain}},
$$

where the factorization is diagnostic and does not assert independence.

DORA Article 13 requires scoped post-major-incident review of causes,
procedures, response, forensic work, escalation, improvements, and implemented
changes. It does not say a written review prevents recurrence. A complete AI
feedback record separates:

```text
exposure -> latent incident -> detection -> report -> triage
         -> liability/severity estimate -> response -> disposition
         -> corrective change -> deployment -> verified effect
         -> recurrence under comparable exposure -> lesson retirement
```

Naively retraining on claims can amplify reporting bias, punish transparent
modules, miss silent failures, and learn from settlement strategy rather than
latent harm. Candidate 011 owns the live/learning loop; Candidate 014 owns the
observation and policy versions. The null is ordinary incident management plus
a delay/selection-aware outcome model and protected prospective verification.

## Shared deterministic synthetic package

The following is a specification for a future executable package, not a claim
that one exists or is workstation-ready.

### Data model

Each synthetic run must preserve both latent truth and every observed view:

| Object | Required fields |
| --- | --- |
| run | generator family/version, seed, code commit, configuration hash, start/end monotonic time |
| actor/root | actor ID, role, credential root, model root, data root, organization root, allowed actions |
| latent event | event ID, source time, entity/boundary, true type, amount/vector and unit, affected obligation, causal parent |
| observed record | observation ID, receipt/process/record times, source channel, schema version, value/unit, uncertainty, lineage |
| posting | journal ID, account ID, signed value/unit, valuation/conversion version, actor, authorization, correction/supersession link |
| claim/incident | latent event link, detection/report/retention probabilities, report delay, severity development, status, settlement, reopen flag |
| model decision | model/version, inputs and vintages, output distribution, materiality record, action, reviewer, override, consequence |
| integrity | canonical bytes hash, predecessor hash, signature/checkpoint, verification result, external-effect receipt |
| resources | CPU time, wall time, peak RSS, bytes read/written, durable writes, log bytes, messages, human-review seconds, blocked-service seconds |

All time fields specify their clock and use nanoseconds or seconds. Financial
values use integer minor currency units or decimal arithmetic; binary floating
point must not silently define ledger equality. Every derived table retains a
row-level link to its generator truth for evaluation but evaluation arms may
receive only their declared observation surface.

### Split and multiplicity

- Development seeds: `0..15`; sealed confirmation seeds: `16..63`.
- Four generator families are frozen before confirmation: independent routine
  events, clustered errors, common shock/tail dependence, and strategic
  reporter/action response.
- A fifth structurally different generator family is held for transfer and is
  not used for tuning.
- All arms receive identical latent events and equal information except for the
  mechanism under ablation. Pairing is preserved by seed.
- Primary contrasts, metrics, and directions are registered before sealed
  execution. Family-wise error is controlled with Holm's procedure at 0.05 for
  the named primary contrasts. Report paired effect sizes and 95% confidence
  intervals; do not promote from a $p$-value alone.
- The first executable run is a workstation pilot. Generalization requires a
  full package, held-out generator, second implementation, and independent
  rerun.

## Exact synthetic/workstation tests

### WS-AFR-01 — balance and independently rooted reconciliation

**Question:** Which error classes are exposed by a balance invariant and which
require an independently rooted view?

**Arms:**

1. mutable single-entry state;
2. typed double-entry journal plus trial-balance check;
3. arm 2 plus reconciliation against a separately generated operational view;
4. arm 3 but both views share the same parser/conversion root;
5. complete conventional null: ACID transaction, typed constraints,
   idempotency, independent reconciliation, and correction entries.

**Fault factorial:** unbalanced posting, one-sided truncation, omitted event,
duplicate balanced event, balanced fabrication, wrong account, wrong entity,
wrong period, wrong FX table, equal-and-opposite error, and shared parser bug.
Each occurs at prevalences $10^{-4},10^{-3},10^{-2}$ in streams of $10^6$
events, with clustered and independent placements.

**Primary metrics:** anomaly-class sensitivity, false alarms per million events,
detection latency in events and seconds, unresolved residual amount by unit,
silent wrong-state duration, recovery correctness, and complete resource vector.

**Hostile cases:** both roots use the same wrong source; balanced fraud; stale
conversion table; replay after schema change; correction posted without
supersession link.

**Kill rule:** reject any claim that double entry detects omissions,
misclassification, or shared false values if those cells do not improve over
chance/full information. Retire any new architecture if arm 5 matches or
dominates it at equal information and cost.

### WS-AFR-02 — event lineage and tamper-evidence boundary

**Question:** What can append-only and hash-linked records detect, and what
remains outside their evidence boundary?

**Arms:** mutable log; append-only database log; canonical hash chain with local
root; hash chain with independently retained periodic roots and signed external
effect receipts; complete storage/security null with access control, rotation,
backup, replay, and schema migration tests.

**Faults:** bit flip, deletion, truncation, reorder, backdating, fork,
checkpoint loss, credential compromise, validly signed fabrication, source
omission before capture, noncanonical encoding, schema reinterpretation,
duplicated outside effect, and restore from stale backup.

**Primary metrics:** alteration detection rate by class, first corrupted event
localization, false accusations, undetected-prefix length, replay-state equality,
outside-effect duplication, recovery point/time, verification CPU time, bytes,
durable writes, and root-management work.

**Hostile cases:** an authorized writer lies; all local roots are rewritten;
cryptographic records remain intact while the source sensor is bypassed; a
schema migration changes meaning without changing bytes.

**Kill rule:** no result may call a valid chain “truth,” “completeness,” or
“authorization.” Retire the residual if the complete conventional null matches
integrity and replay at lower lifecycle cost.

### WS-AFR-03 — segregation, independence, and collusion

**Question:** Does role separation add detection or containment beyond ordinary
authorization, and which shared roots erase it?

**Arms:** single proposer/executor; two roles under one credential/root; two
credentials but one model/data/tool root; distinct proposer and checker with
separate credentials and implementations; arm 4 plus sampled independent
assurance and emergency override; complete RBAC/capability/CI null.

**Faults:** accidental unsafe action, intentional self-approval, collusion,
credential theft, shared specification error, shared-model error, reviewer
fatigue, alert flood, emergency deadline, and unavailable reviewer.

**Primary metrics:** unsafe commits per 10,000 proposals, detection and block
rate by root, false blocks, time-to-authorize, deadline misses, deadlocks,
override abuse, reviewer minutes, messages, CPU/energy, and post-compromise
recovery time.

**Hostile cases:** two “agents” are aliases of one model session; reviewer
receives only proposer's summary; both roles share the compromised identity
provider; colluders exchange hidden state.

**Kill rule:** logical role count is never accepted as independence. Reject the
composition if independent-root measurement does not predict failures or if the
cost-adjusted conventional null dominates.

### WS-AFR-04 — materiality and audit-sampling calibration

**Question:** Are claimed detection probabilities calibrated for rare,
clustered, strategic, and out-of-frame errors?

**Arms:** full scan; simple random sample; stratified sample; probability
proportional to a frozen exposure/risk measure; adaptive/sequential sampler;
materiality-filtered sampler; adversary-aware randomized sampler.

**Population cells:** $N\in\{10^4,10^5,10^6\}$; anomaly count
$m\in\{1,10,100,1000\}$; uniform, one-cluster, many-cluster, protected-group,
high-value, low-value/high-consequence, and frame-omitted placement. A strategic
cell allows the generator to observe deterministic but not committed-random
selection.

**Primary metrics:** empirical versus exact miss probability, Brier/log score
for the detection prediction, sensitivity by anomaly class/group, false alarms,
coverage-weighted consequence missed, scan/sampling CPU and bytes, reviewer
minutes, and delay.

**Hostile cases:** unrecorded events absent from the frame; many individually
small errors that aggregate; one qualitative rights/safety violation below a
financial threshold; clustered errors; adaptive stopping without multiplicity
correction.

**Kill rule:** reject any universal materiality percentage or coverage claim.
A sampler advances only if its stated miss probability is calibrated for each
registered class and it improves the consequence–cost frontier over full scan
and conventional stratified/random nulls.

### WS-AFR-05 — reserve forecast under delayed and changing claims

**Question:** Which reserve method remains calibrated when reporting,
development, severity, and calendar regimes change?

**Arms:** last-observation heuristic; deterministic chain ladder; Mack
chain-ladder with prediction error; over-dispersed Poisson GLM; frozen
distributional/quantile model; delay-aware state-space model; equal-budget
ensemble. Every arm receives the same information vintage.

**Generators:** stationary development; severity inflation; calendar shock;
catastrophe mixture; reporting-delay drift; claims-management intervention;
policy-boundary change; reopened claims; zero/negative increments; and
correlated origin periods. Training uses 20 origin periods, calibration 10, and
sealed evaluation 20, with a separately generated tail beyond the observed
triangle.

**Primary metrics:** aggregate and origin-period reserve error, RMSE and MAE in
EUR, interval/quantile coverage and width, probability integral transform,
one-year development result, tail under-reserving frequency/severity, update
stability, and resources.

**Hostile cases:** model-selected truncation; inflation reversal; rare
catastrophe absent from training; intervention changes reporting but not latent
incidence; a numerically stable estimate with wrong coverage.

**Kill rule:** no method advances on mean error alone. It must retain calibrated
held-out coverage without hiding uncertainty in wider unusable intervals and
must beat conventional reserving/state-space nulls on a preregistered
accuracy–tail–resource frontier.

### WS-AFR-06 — pooling, covariance, and tail dependence

**Question:** When does aggregation diversify loss and when do common roots
erase the gain?

**Arms/cells:** pool sizes $n\in\{1,4,16,64,256\}$ under independent losses,
equicorrelation $\rho\in\{0,0.01,0.1,0.5\}$, block correlation, Gaussian-copula
dependence, heavy-tailed common shock, and a mixture with rare system-wide
failure. Use $2^{18}$ draws per seed for pilot estimation and freeze a larger
sample only after power/precision and energy are measured.

**Primary metrics:** empirical mean/variance/covariance, effective independent
count, VaR and ES at registered levels, exceedance frequency, worst-tail mean,
simultaneous failure count, calibration error, reserve required under each risk
functional, and full resource vector.

**Hostile cases:** zero ordinary correlation but tail dependence; correlated
model/evaluator error; one common credential/provider/power root; importance
sampling tuned on the same tail being evaluated.

**Kill rule:** reject diversification claims that omit off-diagonal covariance
or tail tests. Retire an architectural diversity claim if ordinary ensembles
with explicit failure-domain engineering match its tail/resource frontier.

### WS-AFR-07 — solvency, stress, and model-governance ablation

**Question:** Does the governance lifecycle detect dangerous model mismatch and
improve decisions, rather than merely produce documentation?

**Arms:** frozen point model; frozen distributional model; model plus monitoring
and backtest; model plus independent validation, sensitivity, change triggers,
and versioned limitations; arm 4 plus reverse stress and predeclared fallback;
complete conventional model-risk stack.

**Scenario factorial:** in-distribution noise, gradual drift, abrupt regime
shift, dependency increase, liquidity/deadline shock, observation failure,
adversarial input, and interaction of two individually tolerable shocks. For
each scenario run both fixed-action and constrained-reactive-action policies.

**Primary metrics:** resource shortfall frequency and magnitude under the
declared horizon, calibration, held-out tail loss, invalidation latency,
appropriate abstention/fallback, false invalidation, scenario coverage,
assumption-to-output sensitivity, reproducibility by an independent runner,
documentation/review time, and resource/energy cost.

**Hostile cases:** a model passes historical backtests but fails a new
dependence regime; management action is infeasible under shared load; validation
uses the developer's code/data; documentation reproduces the same error;
reverse stress finds only scenarios allowed by the model.

**Kill rule:** do not credit document count or review completion as risk
reduction. The governed arm advances only if planted mismatch is detected or
contained earlier and held-out loss improves after all validation, fallback,
reserve, and delay costs.

### WS-AFR-08 — adverse-selection versus moral-hazard factorial

**Question:** Is a proposed market/audit mechanism solving hidden type, hidden
action, both, or neither?

**Factors:** router observes type $\theta$ versus not; post-allocation action
$a$ is observable versus not; module has aligned versus divergent persistent
objective; report/action has zero versus real future opportunity consequence;
audit is predictable versus committed-random; outcome is immediate versus
delayed/selected.

**Arms:** direct measurement/cooperative router; calibrated router; contextual
bandit; proper scoring against protected outcomes; randomized audit with future
traffic consequence; Candidate-008-style contestable allocation; oracle.

**Primary metrics:** allocation regret against oracle, report calibration,
truthful-report and productive-action rates, hidden-task/protected-tail loss,
audit detection, gaming gain, entrant starvation, collusion, quality, latency,
compute/energy, and consequence/oversight cost.

**Hostile cases:** cheap identity reset; collusion; shared outcomes; module
changes observable task while sacrificing a hidden task; “currency” has no
effect; router could have measured type directly at lower cost.

**Kill rule:** Candidate 008 must tie or lose when information is direct,
objectives align, or consequences are fictitious. It advances only in cells
with verified persistent private information and strategic deviation where it
beats direct measurement, routing, bandits, and randomized evaluation at equal
total cost.

### WS-AFR-09 — claims/incident observation and verified-learning loop

**Question:** Can the system distinguish lower latent incidence from lower
reporting, and can it show that a corrective action changed recurrence?

**Arms:** naive retraining on observed claims; rate normalized only by exposure;
delay-aware model; joint latent-incidence/reporting model; randomized or
shadow-policy intervention where safe; Candidate-011/014 composition with
versioned observation/action provenance and prospective effect verification.

**Generators:** stable incidence/reporting; lower incidence; lower detection;
higher reporting friction; severity-dependent reporting; delayed/reopened
claims; intervention changes both incidence and reporting; investigator target
selection; closure gaming; transparent module receives more claims despite
lower latent incidence.

**Primary metrics:** latent-incidence estimation error, delay-distribution
calibration, false recovery declarations, corrective-action causal-estimand
bias/coverage under the registered design, recurrence by comparable exposure,
silent-failure duration, action closure without verification, report burden,
human minutes, compute/energy, and storage.

**Hostile cases:** no independent outcome; feedback suppresses its own
telemetry; policy routes hard cases away; reopenings occur after evaluation
cutoff; claim settlement is used as a safety label.

**Kill rule:** reject observed-claim-count optimization whenever reporting
changes are confounded with incidence. The composition advances only if it
reduces false recovery or recurrence on sealed data beyond mature incident
management plus delay/selection modeling at equal lifecycle cost.

## Resource, energy, and opportunity accounting

Every test reports a vector. No scalar “efficiency score” is permitted unless
weights and their owner are registered before execution.

$$
\mathbf{C}=
(Q,\,L,\,R,\,E,\,T_{\mathrm{cpu}},\,T_{\mathrm{wall}},\,M_{\mathrm{peak}},
\,B_r,\,B_w,\,W_d,\,H,\,D_s,\,F_b,\,K_r),
$$

where:

- $Q$ is the task-quality vector with task-specific units;
- $L$ is latency in seconds and its distribution, not only mean;
- $R$ is the registered risk/loss vector in its native units;
- $E$ is measured energy in joules;
- $T_{\mathrm{cpu}}$ and $T_{\mathrm{wall}}$ are CPU and wall seconds;
- $M_{\mathrm{peak}}$ is peak resident memory in bytes;
- $B_r,B_w$ are bytes read/written;
- $W_d$ is durable-write/fsync count and bytes;
- $H$ is human review/investigation time in person-seconds;
- $D_s$ is blocked or delayed service in request-seconds;
- $F_b$ is false blocks/stops as a count plus native consequence; and
- $K_r$ is reserved but unused deliverable capacity in its native unit-time.

All arms run CPU-only with the same hardware, OS, dependency lock, thread
count, affinity/power policy, warm-up, input order, and background-load rule.
Record CPU model, memory, storage, filesystem, power mode, ambient conditions
where material, package commit, configuration hash, and run log. Randomized arm
order and paired seeds reduce time drift.

Software energy counters may be reported as exploratory telemetry with source,
resolution, sampling interval, wraparound, domain coverage, and missingness.
Any claim in joules or superiority in energy requires a calibrated external
meter, whole-system boundary, idle baseline, uncertainty, repeated runs, and
integration method. Until that exists, the package is **workstation pilot
design only**, not calibrated energy evidence.

Charge at least:

1. ledger/reconciliation writes, checkpoints, retention, backup, and replay;
2. independent reviewer/model/implementation training and maintenance;
3. queueing, approvals, false blocks, overrides, and deadlocks;
4. reserve or redundant capacity whether used or idle;
5. audit sampling, investigation, appeals, and remediation;
6. model validation, scenario generation, data curation, and documentation;
7. incident-report burden and corrective-action verification; and
8. recovery after credential, root, schema, or storage compromise.

## Cross-test hostile cases

The package fails its scientific purpose if it omits any of these:

- balanced but false records;
- missing events outside the sample or ledger frame;
- independent logical roles with shared model/data/credential roots;
- collusion and predictable audits;
- individually immaterial items that aggregate or target one protected group;
- rare event absent from training and calibration data;
- zero ordinary correlation with positive tail dependence;
- reserve estimate mistaken for deliverable resource;
- solvent balance sheet but short-horizon liquidity/deadline failure;
- stress pass caused by infeasible management actions;
- validation performed by the same implementation and data path;
- good documentation reproducing a common bug;
- lower observed claims caused by lower reporting;
- action closure without prospective effect verification; and
- a complete conventional null that achieves the same frontier.

## Global kill rules

1. **Type kill:** retire any statement that moves from formal identity,
   empirical estimate, governance rule, or AI hypothesis into another category
   without new support.
2. **Truth kill:** a balanced, durable, signed, or reconciled record is never
   promoted as truthful unless capture and semantic evidence independently
   establish that claim.
3. **Independence kill:** do not count reviewers, agents, ledgers, models, or
   pools without a measured failure-root graph and hostile common-cause tests.
4. **Sampling kill:** do not claim coverage outside the registered frame,
   design, detector, anomaly class, and miss probability.
5. **Materiality kill:** reject a context-free threshold and retain protected,
   qualitative, aggregate, and tail consequences separately.
6. **Reserve kill:** do not equate an estimate, provision, capital amount,
   liquidity, and operational headroom.
7. **Tail kill:** reject pooling or solvency claims that omit covariance,
   common shock, tail dependence, horizon, and valuation/action assumptions.
8. **Governance kill:** document, committee, review, or compliance completion
   is not an outcome; require detected mismatch, contained loss, or verified
   recurrence change.
9. **Incentive kill:** do not invoke adverse selection or moral hazard without
   a persistent actor, private information/action, feasible deviation,
   objective, and real consequence.
10. **Feedback kill:** do not optimize observed claims without an exposure,
    detection, reporting, delay, retention, and intervention model.
11. **Null kill:** if the complete conventional stack matches or dominates at
    equal information, task quality, risk, latency, human work, compute,
    storage, reserve, and energy, retire the proposed composition.
12. **Energy kill:** without a calibrated external meter and uncertainty, do
    not use workstation telemetry to claim energy superiority.

## Audit-local propositions

These identifiers are local to this file and have no standing in
`research/claims.md`.

| ID | Status | Bounded proposition | Evidence and non-inheritance boundary |
| --- | --- | --- | --- |
| AFR-T01 | established formal | A declared double-entry posting system enforces a balance relation such as $Bp_e=0$. | Ellerman DOI; it does not establish correct event capture or valuation. |
| AFR-T02 | established formal | Balanced omission, fabrication, duplication, misclassification, valuation error, and shared-source error can satisfy the balance relation. | counterexamples; not an empirical fraud-rate estimate |
| AFR-T03 | established formal | Reconciliation compares declared views after boundary/unit/vintage transformation. | residual equation; effectiveness depends on detector and roots |
| AFR-T04 | established formal | Shared error covariance can make agreeing views weak evidence of correctness. | covariance propagation and C-525; no universal correlation value |
| AFR-T05 | established scoped governance | HGB §§ 238–239 require traceable, complete, correct, timely, ordered, and alteration-transparent commercial records in their scope. | German law; no direct AI applicability without a hook |
| AFR-T06 | established technical | A hash-linked log can make post-capture alteration detectable under canonicalization, checkpoint, key/hash, retention, and verifier assumptions. | Haber–Stornetta DOI; not truth, completeness, or availability |
| AFR-T07 | established scoped governance | EU statutory-audit rules distinguish independence, conflict threats, quality control, audit files, and engagement scope. | Directive 2006/43 and Regulation 537/2014; not an effect size |
| AFR-T08 | plausible systems boundary | Segregation benefit depends on error dependence, collusion, credential roots, stop authority, latency, and workload. | security/audit mechanisms plus proposed WS-AFR-03; no AI benefit yet |
| AFR-T09 | established scoped governance | EU financial-report materiality is decision- and context-qualified rather than one universal percentage. | Directive 2013/34 Article 2(16); IASB guidance remains scoped/non-mandatory |
| AFR-T10 | established formal | Simple-random-sample miss probability is hypergeometric for a finite population with known anomaly count and frame. | combinatorial identity; not valid for frame omissions or informative sampling |
| AFR-T11 | established formal | A sample cannot detect units absent from its frame, and clustered/strategic anomalies invalidate an independence-based miss formula. | sampling definitions/counterexamples; prevalence must be measured |
| AFR-T12 | established scoped governance | Solvency II technical provisions separate best estimate and risk margin and require current credible information and appropriate methods. | Directive 2009/138 Article 77 and VAG §§ 76–79; insurance scope only |
| AFR-T13 | established model-relative | Chain-ladder prediction-error formulas are conditional on development, variance, independence, and data assumptions. | Mack DOI; “distribution free” is not assumption free |
| AFR-T14 | established formal | Pool variance contains every covariance term; independent-pool scaling fails under positive common dependence. | variance identity; no empirical dependence inferred |
| AFR-T15 | established model-relative | VaR can fail subadditivity; a carefully defined expected shortfall is coherent under its mathematical conditions. | Acerbi–Tasche DOI; distribution and level remain assumptions/choices |
| AFR-T16 | established scoped governance | Solvency II calibrates SCR to 99.5% VaR of basic own funds over one year. | Article 101; not a universal safety probability |
| AFR-T17 | established methodological boundary | A stress-test result is conditional on scenario, valuation, model, horizon, and allowed management actions. | EIOPA methodology and 2024 fixed/constrained exercise; no scenario probability implied |
| AFR-T18 | established scoped governance | Solvency II/VAG internal-model rules require use, data/statistical quality, calibration, attribution, validation, and documentation in scope. | EU/German law; compliance does not prove model truth |
| AFR-T19 | plausible systems translation | Independent validation, reverse stress, and versioned change triggers may reduce AI model-mismatch loss. | WS-AFR-07 hypothesis; no result yet |
| AFR-T20 | established model distinction | Adverse selection is hidden-type risk before allocation/contracting; moral hazard is hidden action responding to protection/consequence. | Rothschild–Stiglitz and Holmström DOI; requires each model's assumptions |
| AFR-T21 | established project boundary | If state is directly observable, objectives align, or no real consequence exists, ordinary routing/control is the stronger null than an incentive mechanism. | deduplication against C-133–C-144; not an impossibility theorem for all systems |
| AFR-T22 | established observation boundary | Observed claims are selected by exposure, detection, reporting, delay, classification, retention, and settlement processes. | HRO claim C-178 plus actuarial/incident workflow; no universal factor values |
| AFR-T23 | established scoped governance | DORA requires post-major-incident review and learning steps for in-scope financial entities. | DORA Article 13; review completion does not establish recurrence reduction |
| AFR-T24 | speculative integration | Balanced, attributable, independently challengeable state may reduce false assurance under delayed obligations and endogenous feedback. | tests WS-AFR-01–09 required; no new candidate or principle |

## Recommended central-ledger entries

The root integrator should deduplicate these wordings against the live ledger
before assigning `C-` IDs. “Recommended” does not mean promoted.

| Proposed key | Recommended statement and status | Primary anchors | Likely route |
| --- | --- | --- | --- |
| REC-AFR-01 | **Established formal:** double entry detects violations of a declared balance relation but not balanced omission, fabrication, duplication, misclassification, valuation error, or shared-source error. | Ellerman, DOI `10.1080/0025570X.1985.11977191`; formal counterexamples | P-013; Candidates 009/014; storage null |
| REC-AFR-02 | **Established formal:** reconciliation strength depends on independently rooted views and their error covariance; agreement of common-derived views is not independent corroboration. | covariance identity; DORA Article 12(7) as scoped governance use | dedupe against C-183/C-525; Candidate 014 |
| REC-AFR-03 | **Established formal:** for simple random sampling without replacement, audit miss probability is hypergeometric and says nothing about anomalies absent from the frame. | combinatorial derivation; IAASB ISA 530 as technical comparator | Candidate 009; metrology/evaluator contracts |
| REC-AFR-04 | **Established scoped governance:** financial-report materiality is user-, decision-, context-, nature-, magnitude-, and aggregation-qualified rather than a universal percentage or physical detection limit. | Directive 2013/34/EU Article 2(16); IFRS Practice Statement 2, explicitly non-mandatory | legal-evidence and metrology boundaries |
| REC-AFR-05 | **Established model-relative:** claims reserves are versioned estimates of delayed obligations with prediction/model uncertainty and require comparison against later experience; they are not cash, capital, liquidity, or operational headroom. | Mack DOI `10.2143/AST.23.2.2005092`; England–Verrall DOI `10.1017/S1357321700003809`; Solvency II Article 77/VAG §§ 76–79 | P-009/P-012; Candidates 011/014 |
| REC-AFR-06 | **Established formal:** pooling reduces idiosyncratic relative variance only under a dependence model; positive covariance and common tail shocks bound or reverse the gain. | variance identity; Artzner DOI `10.1111/1467-9965.00068`; Acerbi–Tasche DOI `10.1016/S0378-4266(02)00283-2` | dedupe C-183/C-525/C-671; P-004 |
| REC-AFR-07 | **Established scoped governance:** Solvency II's 99.5% one-year SCR VaR is a regulatory calibration, while a stress-test result remains conditional on scenario, valuation, model, and allowed actions. | Solvency II Article 101; EIOPA stress methodology and 2024 exercise | Candidates 009/012/014 |
| REC-AFR-08 | **Established scoped governance:** Solvency II/VAG model governance requires use, data/statistical quality, calibration, attribution, validation, sensitivity/reverse stress, and documentation, but does not prove model truth. | Directive 2009/138 Articles 120–125; Delegated Regulation 2015/35 Articles 241–244; VAG §§ 115–121 | Candidate 009/014 mature null |
| REC-AFR-09 | **Established model distinction:** adverse selection requires hidden type before allocation; moral hazard requires hidden action responding to a consequence structure. Neither follows from ordinary uncertainty. | Rothschild–Stiglitz DOI `10.2307/1885326`; Holmström DOI `10.2307/3003320` | dedupe C-139–C-144; Candidate 008 entrance gate |
| REC-AFR-10 | **Plausible observation boundary:** claims/incident feedback must model exposure, detection, reporting, delay, retention, intervention, settlement, and prospective effect; lower observed claims need not mean lower latent incidence. | DORA Article 13; existing C-178/C-184/C-185 | Candidates 011/014 |

The root integration should prefer a sharper boundary on an existing claim over
creating a near-duplicate. `REC-AFR-24` is intentionally absent: the speculative
composition does not deserve a central claim until at least WS-AFR-01–09 exist
and beat their complete nulls.

## Audit-local DOI and official-source register

### Peer-reviewed/formal sources

- David P. Ellerman, “The Mathematics of Double Entry Bookkeeping,”
  *Mathematics Magazine* 58(4), 226–233 (1985),
  [DOI: 10.1080/0025570X.1985.11977191](https://doi.org/10.1080/0025570X.1985.11977191).
- Stuart Haber and W. Scott Stornetta, “How to Time-Stamp a Digital Document,”
  *Journal of Cryptology* 3, 99–111 (1991),
  [DOI: 10.1007/BF00196791](https://doi.org/10.1007/BF00196791).
- Jerome H. Saltzer and Michael D. Schroeder, “The Protection of Information
  in Computer Systems,” *Proceedings of the IEEE* 63(9), 1278–1308 (1975),
  [DOI: 10.1109/PROC.1975.9939](https://doi.org/10.1109/PROC.1975.9939).
- Thomas Mack, “Distribution-Free Calculation of the Standard Error of Chain
  Ladder Reserve Estimates,” *ASTIN Bulletin* 23(2), 213–225 (1993),
  [DOI: 10.2143/AST.23.2.2005092](https://doi.org/10.2143/AST.23.2.2005092).
- P. D. England and R. J. Verrall, “Stochastic Claims Reserving in General
  Insurance,” *British Actuarial Journal* 8(3), 443–518 (2002),
  [DOI: 10.1017/S1357321700003809](https://doi.org/10.1017/S1357321700003809).
- Philippe Artzner, Freddy Delbaen, Jean-Marc Eber, and David Heath, “Coherent
  Measures of Risk,” *Mathematical Finance* 9(3), 203–228 (1999),
  [DOI: 10.1111/1467-9965.00068](https://doi.org/10.1111/1467-9965.00068).
- Carlo Acerbi and Dirk Tasche, “On the Coherence of Expected Shortfall,”
  *Journal of Banking & Finance* 26(7), 1487–1503 (2002),
  [DOI: 10.1016/S0378-4266(02)00283-2](https://doi.org/10.1016/S0378-4266(02)00283-2).
- Michael Rothschild and Joseph E. Stiglitz, “Equilibrium in Competitive
  Insurance Markets: An Essay on the Economics of Imperfect Information,”
  *Quarterly Journal of Economics* 90(4), 629–649 (1976),
  [DOI: 10.2307/1885326](https://doi.org/10.2307/1885326).
- Bengt Holmström, “Moral Hazard and Observability,” *Bell Journal of Economics*
  10(1), 74–91 (1979),
  [DOI: 10.2307/3003320](https://doi.org/10.2307/3003320).

### Exact official legal and supervisory anchors

- HGB §§ 238–239:
  [official German text § 238](https://www.gesetze-im-internet.de/hgb/__238.html),
  [§ 239](https://www.gesetze-im-internet.de/hgb/__239.html).
- Regulation (EC) 1606/2002, Article 4:
  [EUR-Lex CELEX 32002R1606](https://eur-lex.europa.eu/legal-content/en/ALL/?uri=CELEX:32002R1606).
- Commission Regulation (EU) 2023/1803:
  [consolidated 2026-03-08](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02023R1803-20260308).
- Directive 2013/34/EU, Article 2(16):
  [consolidated text](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02013L0034-20240528).
- Directive 2006/43/EC, Articles 21, 22, 24a, 24b, 25a, 26:
  [consolidated 2024-01-09](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:02006L0043-20240109).
- Regulation (EU) 537/2014, Articles 5–8 and 10:
  [Official Journal text](https://eur-lex.europa.eu/eli/reg/2014/537/oj/eng).
- Directive 2009/138/EC, Articles 77, 101, 120–125:
  [consolidated 2025-01-17](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02009L0138-20250117),
  [EIOPA Article 77](https://www.eiopa.europa.eu/rulebook/solvency-ii-single-rulebook/article-2160_en),
  [EIOPA Article 101](https://www.eiopa.europa.eu/rulebook/solvency-ii-single-rulebook/article-2188_en).
- Delegated Regulation (EU) 2015/35, Articles 241–244 and 264/272:
  [EIOPA Article 241](https://www.eiopa.europa.eu/rulebook/solvency-ii-single-rulebook/article-5900_en),
  [Article 242](https://www.eiopa.europa.eu/rulebook/solvency-ii-single-rulebook/article-5901_en),
  [Article 243](https://www.eiopa.europa.eu/rulebook/solvency-ii-single-rulebook/article-5902_en),
  [Article 264](https://www.eiopa.europa.eu/rulebook/solvency-ii-single-rulebook/article-5927_en),
  [Article 272](https://www.eiopa.europa.eu/rulebook/solvency-ii-single-rulebook/article-5935_en).
- VAG § 26 and §§ 76–79, 111–121:
  [official § 26](https://www.gesetze-im-internet.de/vag_2016/__26.html),
  [official complete VAG](https://www.gesetze-im-internet.de/vag_2016/BJNR043410015.html).
- Regulation (EU) 2022/2554, Articles 12–13:
  [DORA Official Journal text](https://eur-lex.europa.eu/eli/reg/2022/2554/oj).
- Regulation (EU) 2024/1689, Articles 9, 12, 15, 17 and Annex III:
  [AI Act](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32024R1689).
- Directive (EU) 2025/2, transposition/application dates in Article 4:
  [Official Journal text](https://eur-lex.europa.eu/eli/dir/2025/2/oj/eng).

## Audit decision

This field closes a real coverage gap but produces **no new architectural
principle and no new candidate**. Its durable contribution is a set of hard
separations and nine executable falsifiers:

1. balance is not truth;
2. agreement is not independent reconciliation;
3. lineage is not original-event validity;
4. role count is not independence;
5. materiality is not detection;
6. sampling is not full coverage;
7. reserve is not resource;
8. pooling and solvency are dependence-, horizon-, and scenario-qualified; and
9. claims are an endogenous observation channel, not the latent process.

Candidate 008 receives the hidden-type/hidden-action entrance test; Candidates
009, 011, 014, 017, and 020 receive stronger conventional nulls and hostile
cases. They should be edited only when an executable package exists and the
root integrator can preserve their current scope. Until then, this audit is the
canonical design record and every experimental statement remains protocol-only.

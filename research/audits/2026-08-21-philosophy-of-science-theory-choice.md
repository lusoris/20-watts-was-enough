# Philosophy of science and theory choice

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-21
- **Scope:** underdetermination, unconceived alternatives, prediction versus accommodation, robustness and shared assumptions, theory-choice values, inductive risk, and the separation of predictive, causal, mechanistic, ontological, and formal acceptance
- **Evidence rule:** philosophical arguments and historical cases constrain the evaluator; they are not empirical frequency estimates for present scientific error and do not become architecture evidence by citation alone
- **Promotion state:** no new principle, central claim, architecture candidate, or fixture
- **Repository effect:** refine the existing scientific-discovery evaluator and Candidates 004, 009, and 014; add hostile overlays to Fixtures F-004 and F-005

## Executive finding

A scientific evaluator cannot infer a unique account of the world merely because
one available model fits, predicts, or survives the tests that the evaluator was
given. The result is qualified by the considered alternative set, auxiliary
assumptions, observation process, access history, test design, and intended use.

The durable residue is therefore a versioned **theory-choice contract**:

1. record the alternatives that were actually considered and how they were
   generated;
2. record the auxiliary assumptions needed to obtain each tested consequence;
3. distinguish evidence used to construct, tune, select, diagnose, confirm, or
   independently replicate a result;
4. count robustness through disclosed variation and shared failure roots rather
   than the number of agreeing pipelines;
5. keep fit, prospective prediction, transfer, causal effect, causal structure,
   mechanism, ontology, and formal derivability as different evidence targets;
   and
6. keep evidential support separate from a purpose- and consequence-qualified
   decision to act.

This does not solve unconceived alternatives. A finite system cannot certify
that it has represented every serious theory. The testable objective is narrower:
reduce premature closure, expose the boundary of the search, preserve live
equivalence sets, and buy observations or interventions that discriminate the
strongest available rivals.

## Audit propositions

The IDs in this table are local to this audit. They are not promoted claim-ledger
IDs.

| ID | Status | Scoped proposition | Boundary |
| --- | --- | --- | --- |
| `PHIL-T01` | established as an evaluator boundary | An empirical test constrains a focal hypothesis together with observation, calibration, preprocessing, boundary, numerical, nuisance, and other auxiliary assumptions. | This does not establish the strongest Quinean thesis that every belief is equally revisable. |
| `PHIL-T02` | plausible; generality disputed | The history of science contains repeated cases in which later serious alternatives were not considered by earlier investigators despite fitting important evidence available to them. | Stanford's detailed cases do not yield a calibrated present-day probability that any particular theory is false. |
| `PHIL-T03` | established as a search boundary | “No rival was found” reports a finite search over a representation and budget; it does not certify that no serious rival exists. | A broad, successful search can still be useful evidence about the currently enumerated family. |
| `PHIL-T04` | disputed as an absolute | A chronologically novel prediction is not automatically stronger evidence than accommodation. | Data access, use in construction or selection, overfitting opportunity, and the test's power against a named error matter. |
| `PHIL-T05` | plausible and operationalizable | Evidence used during theory construction can later participate in a severe test, while use-novel evidence can be weak. | “Severity” has competing philosophical explications; this project uses error-specific detection probability or sensitivity, not one universal scalar. |
| `PHIL-T06` | disputed as a counting rule | Agreement among multiple models, instruments, codes, or analysts does not by itself establish truth. | Shared calibration, data, preprocessing, theory, code, or specimens can create common-mode agreement. |
| `PHIL-T07` | plausible and conditional | Robustness is informative when variations would respond differently to relevant error explanations or possess meaningfully different failure roots. | The supported conclusion is robustness to the enumerated changes, not unrestricted truth. |
| `PHIL-T08` | established by counterexample | Predictive adequacy does not entail a causal interpretation; observationally equivalent models can disagree under intervention. | Intervention evidence itself remains qualified by implementation, support, interference, and causal assumptions. |
| `PHIL-T09` | plausible; domain-qualified | A mechanistic claim ordinarily requires evidence about components or entities, activities, organization, and productive relevance beyond prediction alone. | Mechanistic accounts were developed especially in biology and neuroscience and are not one universal definition of explanation. |
| `PHIL-T10` | disputed | Prediction, intervention, or a successful mechanistic model does not mechanically settle ontological commitment. | Constructive empiricism, entity realism, selective realism, and historical antirealism disagree about the warranted commitment. |
| `PHIL-T11` | established as a theory-choice boundary | Accuracy, consistency, scope, simplicity, and fruitfulness can conflict and do not define one context-free choice algorithm. | Any operational proxy or weighting is an evaluator decision that must be declared and versioned. |
| `PHIL-T12` | plausible normative constraint | False-accept and false-reject consequences can alter an action threshold without altering the evidence record. | The legitimate owners and values for those consequences are governance questions, not outputs of model fit. |

## Underdetermination is bundle-qualified

Duhem's physical-theory argument concerns the difficulty of locating a failed
prediction in one isolated hypothesis when deriving that prediction required a
larger theoretical and experimental bundle. Quine broadened the holist argument,
but the scope and consequences of that extension remain contested. The useful
engineering result is conservative: the evaluator must not silently hold every
auxiliary fixed and assign all residual error to the component currently open
for learning.

For focal hypothesis $h$, versioned auxiliary bundle $A_v$, observation process
$O_v$, and recorded data $D$, a score has the qualified form

$$
S(h;D,O_v,A_v),
$$

where $S$ is the named fit, likelihood, discrepancy, or decision score. A selected
model is at most

$$
h^*\in\operatorname*{arg\,max}_{h\in\mathcal H_v}
S(h;D,O_v,A_v),
$$

where $\mathcal H_v$ is the versioned set of represented alternatives. The result
does not quantify models outside $\mathcal H_v$, errors omitted from $A_v$, or
changes to $O_v$.

Stanford rejects the need for contrived permanent empirical equivalents and
instead argues from recurrent, transient failure to conceive later-successful
alternatives. His book develops Darwin's pangenesis, Galton's stirp theory, and
Weismann's germ-plasm theory as historical cases. Critics dispute whether these
cases support global antirealism, whether causal knowledge permits selective
commitment, and whether contemporary methods improve alternative generation.

The repository should therefore adopt neither “all theories are equally good”
nor “the current winner is approximately true.” It should report:

- the represented family and equivalence relation;
- how alternatives were generated, searched, pruned, and excluded;
- the proposal, evaluator, human, compute, and energy budgets;
- which auxiliaries were fixed, varied, or unavailable;
- live alternatives and unresolved directions; and
- the observation or intervention expected to distinguish each important pair.

An unsearched space is **alternative debt**, not a numerical probability of an
unknown theory.

## Prediction, accommodation, and access ancestry

Three notions of novelty must remain separate:

1. **temporal novelty:** the observation happened after the hypothesis was first
   stated;
2. **use novelty:** the observation and its information descendants were not used
   to construct, tune, select, or revise the hypothesis; and
3. **problem novelty:** the task, representation, mechanism family, or operating
   regime differs from those used during development.

Hitchcock and Sober give overfitting-based reasons why prediction can sometimes
have an evidential advantage over accommodation. Mayo argues that the deeper
issue is whether a test would probably have exposed a specified error, not use
novelty alone. Iseda argues that systematic neglect of relevant alternatives can
still undermine a purportedly severe test. These analyses do not yield the rule
“prediction always wins.”

Every evidence artifact therefore carries an access DAG. A result is operationally
use-novel only when no recorded path runs from the result, an equivalent record,
or an information-bearing summary into hypothesis construction, hyperparameter
tuning, selection, stopping, or revision before the freeze event. Human exposure,
benchmark familiarity, public queries, and evaluator feedback are nodes in the
same graph. Absence of a recorded path is not metaphysical proof of independence;
it is an auditable access claim.

For a named discrepancy $\delta$, workstation tests may estimate

$$
p_{\mathrm{detect}}(\delta)
=\Pr(\text{test rejects or flags the claim}\mid\delta\text{ is planted}),
$$

under a frozen generator and test procedure. This quantity is dimensionless and
specific to the planted discrepancy, data-generating family, sample size, and
decision rule. It must not be presented as a universal measure of severity.

Evidence roles are typed:

| Role | May support | Does not by itself establish |
| --- | --- | --- |
| construction | a candidate and its ancestry | confirmation |
| tuning | performance on the tuning protocol | generalization beyond it |
| selection | a choice among candidates under a declared rule | unbiased evaluation of that choice |
| post-hoc diagnostic | localization or a new hypothesis | prospective confirmation |
| sealed confirmation | the preregistered contrast on the sealed support | independent replication or unrestricted transfer |
| independent replication | reconstruction under the named independence and support conditions | unique mechanism or ontology |

If hidden access is later discovered, the artifact is reclassified; the data are
not deleted and the chronological date is not rewritten.

## Robustness requires a failure-root graph

The robustness literature does not support a simple “more agreeing methods means
more truth” rule. Orzack and Sober criticize the truth connection of derivational
robustness. Weisberg argues that comparison across model variants can identify a
robust theorem under a structured family. Schupbach characterizes useful diversity
through methods that discriminate relevant competing explanations. Stegenga shows
that robustness arguments can mislead and that real evidence is often discordant.
Stegenga and Menon show that intuitive material or assumption diversity is not
equivalent to probabilistic independence and can, in some configurations, reduce
rather than raise combined confirmation.

Each evidential method $m_i$ is therefore linked to its known roots:

```text
data or specimen
instrument and calibration
preprocessing and feature extraction
background theory and model family
software, solver, and numerical method
training corpus and evaluator
laboratory, analyst, or review chain
funding, governance, and publication selection where material
```

The evaluator stores this method–root bipartite graph and any known covariance.
It does not convert graph distance into a universal independence weight. The
decisive check is intervention: plant or reveal a shared-root fault and measure
whether the system suppresses false corroboration, preserves discordance, and
localizes the common dependency.

Robustness claims use the form “stable under changes $V$ while roots $R$ remained
shared,” where both $V$ and $R$ are explicit. Discordant evidence remains visible;
a pooled mean may not erase it.

## Acceptance targets form a non-inheritance contract

Different scientific and philosophical questions can be asked of the same model.
The evaluator records the target rather than compressing them into confidence:

| Target | Minimum relevant evidence event | Explicit non-inheritance |
| --- | --- | --- |
| within-support fit | declared observations, operator, residual/discrepancy, and uncertainty | fit does not imply prospective prediction |
| prospective prediction | frozen candidate, access-qualified sealed outcome, calibration | prediction does not imply causal structure |
| regime transfer | held-out apparatus, population, geometry, operator, or mechanism regime | transfer does not imply mechanism |
| causal effect | supported intervention or qualified natural experiment with assumptions | an average effect does not identify a complete causal graph |
| causal structure | alternatives that disagree under interventions plus identification assumptions | one identified relation does not supply a full mechanism |
| mechanism | component/entity, activity, organization, localization, intervention, and reconstruction evidence appropriate to the domain | mechanism support does not settle unique ontology |
| ontology | explicit entity/relation commitment and rival ontologies | no automatic promotion from prediction, causation, or mechanism |
| formal statement | exact proposition, logic, axioms, dependencies, certificate, and checker | proof does not establish empirical applicability or ontology |

Woodward's interventionism offers an operational account of causal invariance.
Machamer, Darden, and Craver characterize mechanisms through organized entities
and activities, while Craver distinguishes data summaries and how-possibly
sketches from how-actually mechanistic explanation. These are valuable evaluator
comparators, not a decree that every discipline must use one metaphysics.

Van Fraassen's constructive empiricism holds that theory acceptance need involve
belief only in empirical adequacy. Hacking and Cartwright defend more selective
realist commitments grounded partly in manipulation and localized causal
knowledge. Laudan and Stanford use historical theory change to challenge broad
realist inference. Because the dispute is live, the evaluator must not output
`ontology=true`. It may retain an explicit, contestable ontological hypothesis
and its evidence.

## Theory choice is vector-valued and purpose-qualified

Kuhn identifies accuracy, consistency, scope, simplicity, and fruitfulness as
recurrent theory-choice values while arguing that they need not determine a
unique choice. Operational measures of those values can conflict. A project may
also care about calibration, intervention cost, risk, compute, energy, and human
work.

For candidate $h$, report a vector

$$
V(h)=(a,c,s,p,f,r,e,w),
$$

where $a$ is the registered accuracy measure, $c$ consistency, $s$ scope, $p$
simplicity or parsimony, $f$ fruitfulness, $r$ risk, $e$ energy, and $w$ human
work. Every component keeps its native unit or declared dimensionless scale.
There is no default sum. If a decision uses weights or lexicographic priorities,
their owner, purpose, version, and sensitivity analysis are part of the decision
record.

Rudner and Douglas argue that accepting or rejecting a claim can expose people
or environments to different consequences of error. The repository already
records false-accept and false-reject costs. This audit adds a firewall:

- evidence records what the tests support;
- the decision record states the intended action and consequence model; and
- changing the action threshold does not rewrite the evidence.

## Versioned theory-choice record

For candidate $h$, store

$$
R_h=(h,\tau,\mathcal H_v,A_v,O_v,U_v,T_v,G_v,D_v),
$$

where:

- $\tau$ is the claim target from the non-inheritance table;
- $\mathcal H_v$ is the represented alternative set and its search record;
- $A_v$ is the auxiliary bundle;
- $O_v$ is the observation/intervention process;
- $U_v$ is the evidence-use and access DAG;
- $T_v$ is the test, named rival/error, and discrimination analysis;
- $G_v$ is the method–failure-root graph and covariance record; and
- $D_v$ is the purpose-qualified decision record.

The record minimally contains:

```text
claim_target
alternative_set_version
members_and_equivalence_classes
alternative_generation_and_search_procedures
excluded_families_and_reasons
proposal_search_and_human_review_budget
unresolved_alternative_debt
auxiliary_bundle_and_dependency_versions
observation_or_intervention_operator
evidence_use_role_and_access_DAG_hash
freeze_and_preregistration_hash
named_error_or_rival
detection_power_or_sensitivity_boundary
method_data_calibration_code_theory_and_review_roots
known_shared_failures_and_covariance
discordant_results
blocked_evidence_inheritance_edges
intended_use_and_permitted_action
false_accept_and_false_reject_owner
theory_virtue_vector_and_weight_version
```

### Invalidation semantics

1. A newly viable rival invalidates uniqueness, causal-structure, mechanism, or
   ontological promotions that excluded it; it does not erase raw observations.
2. A changed auxiliary invalidates only consequences that depended on that
   auxiliary and any downstream admissions.
3. Discovered leakage reclassifies sealed confirmation as construction, tuning,
   selection, or post-hoc evidence.
4. A newly discovered common failure root narrows the robustness claim without
   automatically negating each individual result.
5. A changed intended use, consequence model, or theory-value weighting changes
   the decision, not the evidence state.
6. A checked formal proof remains checked after discovery-history reclassification;
   formalization fidelity, significance, and empirical applicability remain
   separately challengeable.

## Hostile workstation tests

### TC1 — sealed alternative release

Generate a latent world in which $H_1$ and a hidden $H_3$ agree on initial
observations. The initial represented family contains $H_1$ and a weaker rival
$H_2$, but not $H_3$. A sealed, declared representation-expansion operator can
construct $H_3$, and one affordable intervention makes $H_1$ and $H_3$ disagree.

Compare fixed-family Bayesian selection, symbolic and system-identification
search, independent proposer/red-team search, the complete conventional
composition, and Candidate 004 at equal proposal, evaluator, intervention,
human, time, byte, and energy budgets.

Report viable-rival yield, semantic equivalence classes, false unique promotion,
time and calls to first viable rival, equivalence-set recall, abstention,
intervention choice, downstream regret, and recovery after release. Retire the
residual if ordinary diverse search matches it or if confidence rises merely
because the candidate generator failed to imagine $H_3$.

### TC2 — prediction, accommodation, and hidden access

Pair identical hypothesis families while varying whether the sealed outcome, an
equivalent benchmark, a summary, human feedback, or repeated evaluator query is
available during construction, tuning, selection, or revision. Independently
vary chronological order so timestamps alone give the wrong classification.
Plant overfit degrees of freedom and discrepancies with known detection power.

Report access-DAG recall, evidence-role classification, false confirmation,
calibration, error-specific detection probability, post-freeze exclusions,
candidate/evaluator calls, and full cost. Any hidden path discovered after release
must trigger deterministic reclassification and downstream invalidation.

### TC3 — common-root robustness trap

Run at least four apparently different pipelines. Three use different model code
but share one hidden calibration, preprocessing, or truth-model defect. One uses
a different measurement principle and returns a discordant but better-supported
result. Cross disclosed and hidden shared roots.

Report false robust promotion, root localization, covariance recovery, preserved
discordance, calibration, stale downstream claims, reviewer time, and joules.
Counting the three correlated pipelines as three independent confirmations is a
contract failure.

### TC4 — acceptance-target confusion matrix

Provide:

1. a within-support fitting model that fails prospective data;
2. predictively equivalent structural causal models that differ under
   intervention;
3. a predictor with correct intervention response but wrong internal component
   organization;
4. a how-possibly mechanism that fails component replacement or reconstitution;
5. a supported mechanism compatible with two ontological interpretations; and
6. a checked formal theorem whose informal statement or physical mapping is
   defective.

Score every attempted inheritance between fit, prediction, transfer, causal
effect, causal structure, mechanism, ontology, and proof. Schema-level promotion
across a blocked edge is a deterministic failure even if a downstream scalar
score happens to improve.

### TC5 — theory-value and inductive-risk switch

Construct candidates that trade a small average-accuracy difference against
tail error, scope, simplicity, compute, energy, and asymmetric harm. Present the
same evidence under two registered intended uses with different false-accept and
false-reject consequences.

The evaluator must preserve one evidence record, expose the Pareto set, and
produce a different action only through the declared purpose and consequence
record. Hidden scalarization, unversioned preference changes, or rewriting the
evidence state is a failure.

### TC6 — formal discovery-history boundary

Give F-004 checked proofs whose conjectures were independently predicted,
accommodated after examples, retrieved from hidden ancestry, or leaked through
evaluator feedback. Cross correct and defective formalizations.

Proof validity must depend on the exact proposition and checker chain, not on
discovery history. Discovery credit and hidden-family transfer must depend on
access ancestry. Failure to find a proof remains `unknown` unless a checked
refutation or impossibility result exists.

### TC7 — physical equifinality and shared-model inversion

Apply TC1–TC4 to F-005 closure, assimilation, and control tracks. Use two latent
closures or mechanisms that agree under the development observation kernel but
disagree under a sealed forcing, sensor, or intervention. Cross independent and
shared solvers, grids, calibration, preprocessing, and truth models.

Report prediction, intervention response, component localization, robustness
roots, and ontology separately. Rollout accuracy, solver count, or control
success may not silently promote a mechanism claim.

## Repository routing

| Audit residue | Existing owner | Exact disposition |
| --- | --- | --- |
| proposal search beyond the initial family | Candidate 004 | add alternative-set record, sealed alternative-release split, mature red-team null, and premature-closure outcomes |
| evidence-role, access, and later reclassification | Candidates 004, 009, and 014 | version access ancestry and propagate invalidation; no new principle |
| non-inheritance among evidence targets | Candidate 009 | add scientific-claim assurance field and a type-confusion hostile track |
| auxiliary, alternative, and observation dependencies | Candidate 014 | extend the observation contract and invalidate only affected descendants |
| robustness and common roots | Candidates 009 and 014 | store the failure-root graph and preserve discordance; no independence scalar |
| proof versus discovery history | Fixture F-004 | preserve exact proof status while separating formalization, credit, significance, and empirical applicability |
| physical equifinality | Fixture F-005 | overlay closure, assimilation, sensing, and control tests; keep prediction, cause, mechanism, and ontology separate |
| theory virtues and inductive risk | Candidate 009 decision record | expose vector, owner, intended use, error costs, and sensitivity; do not rewrite evidence |

## Evidence boundaries

- Duhem and Quine supply philosophical arguments, not a measured universal rate
  of auxiliary failure.
- Stanford's historical induction is a serious warning against closure, but its
  extrapolation to all contemporary theories and its implications for realism
  remain disputed.
- Predictivism, use novelty, and severity have competing accounts. The repository
  implements provenance and error-discrimination tests without declaring the
  philosophical debate settled.
- Robustness analysis can expose results stable across assumptions, but the
  literature does not provide a universally valid confirmation weight for
  method diversity.
- Interventionist and mechanistic accounts provide useful test obligations, not
  one mandatory ontology for every science.
- Constructive empiricism, entity realism, and selective realism are competing
  stances. The evaluator records ontological hypotheses rather than deciding the
  realism debate.
- Kuhn's theory-choice values and inductive-risk arguments justify explicit
  vectors, owners, and decision records. They do not supply universal weights.

## Primary scholarly sources

### Underdetermination and unconceived alternatives

- Duhem, P. ([1906/1914] 1954), *The Aim and Structure of Physical Theory*,
  [DOI 10.1515/9780691233857](https://doi.org/10.1515/9780691233857).
- Quine, W. V. O. (1951), “Two Dogmas of Empiricism,”
  [DOI 10.2307/2181906](https://doi.org/10.2307/2181906).
- Stanford, P. K. (2001), “Refusing the Devil's Bargain: What Kind of
  Underdetermination Should We Take Seriously?”,
  [DOI 10.1086/392893](https://doi.org/10.1086/392893).
- Stanford, P. K. (2006), *Exceeding Our Grasp: Science, History, and the
  Problem of Unconceived Alternatives*,
  [DOI 10.1093/0195174089.001.0001](https://doi.org/10.1093/0195174089.001.0001).
- Chakravartty, A. (2008), “What You Don't Know Can't Hurt You: Realism and the
  Unconceived,”
  [DOI 10.1007/s11098-007-9173-1](https://doi.org/10.1007/s11098-007-9173-1).

### Prediction and accommodation

- Hitchcock, C. and Sober, E. (2004), “Prediction Versus Accommodation and the
  Risk of Overfitting,”
  [DOI 10.1093/bjps/55.1.1](https://doi.org/10.1093/bjps/55.1.1).
- Mayo, D. G. (1991), “Novel Evidence and Severe Tests,”
  [DOI 10.1086/289639](https://doi.org/10.1086/289639).
- Iseda, T. (1999), “Use-Novelty, Severity, and a Systematic Neglect of Relevant
  Alternatives,”
  [DOI 10.1086/392741](https://doi.org/10.1086/392741).

### Robustness and shared assumptions

- Orzack, S. H. and Sober, E. (1993), “A Critical Assessment of Levins's The
  Strategy of Model Building in Population Biology,”
  [DOI 10.1086/418301](https://doi.org/10.1086/418301).
- Weisberg, M. (2006), “Robustness Analysis,”
  [DOI 10.1086/518628](https://doi.org/10.1086/518628).
- Stegenga, J. (2009), “Robustness, Discordance, and Relevance,”
  [DOI 10.1086/605819](https://doi.org/10.1086/605819).
- Schupbach, J. N. (2018), “Robustness Analysis as Explanatory Reasoning,”
  [DOI 10.1093/bjps/axw008](https://doi.org/10.1093/bjps/axw008).
- Stegenga, J. and Menon, T. (2017), “Robustness and Independent Evidence,”
  [DOI 10.1086/692141](https://doi.org/10.1086/692141).

### Acceptance, explanation, realism, and values

- Kuhn, T. S. (1977), “Objectivity, Value Judgment, and Theory Choice,”
  [DOI 10.7208/9780226217239-014](https://doi.org/10.7208/9780226217239-014).
- van Fraassen, B. C. (1980), *The Scientific Image*,
  [DOI 10.1093/0198244274.001.0001](https://doi.org/10.1093/0198244274.001.0001).
- Hacking, I. (1983), *Representing and Intervening*,
  [DOI 10.1017/CBO9780511814563](https://doi.org/10.1017/CBO9780511814563).
- Cartwright, N. (1983), *How the Laws of Physics Lie*,
  [DOI 10.1093/0198247044.001.0001](https://doi.org/10.1093/0198247044.001.0001).
- Laudan, L. (1981), “A Confutation of Convergent Realism,”
  [DOI 10.1086/288975](https://doi.org/10.1086/288975).
- Woodward, J. (2003), *Making Things Happen: A Theory of Causal Explanation*,
  [DOI 10.1093/0195155270.001.0001](https://doi.org/10.1093/0195155270.001.0001).
- Machamer, P., Darden, L., and Craver, C. F. (2000), “Thinking about
  Mechanisms,” [DOI 10.1086/392759](https://doi.org/10.1086/392759).
- Craver, C. F. (2006), “When Mechanistic Models Explain,”
  [DOI 10.1007/s11229-006-9097-x](https://doi.org/10.1007/s11229-006-9097-x).
- Rudner, R. (1953), “The Scientist Qua Scientist Makes Value Judgments,”
  [DOI 10.1086/287231](https://doi.org/10.1086/287231).
- Douglas, H. (2000), “Inductive Risk and Values in Science,”
  [DOI 10.1086/392855](https://doi.org/10.1086/392855).

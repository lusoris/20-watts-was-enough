# Scientific-discovery evaluator contracts

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-06
- **Trigger:** supplied Google Doc on replacing current-theory constraints with empirical data or formal logic
- **Scope:** the document's dusty-plasma and FunSearch examples; empirical equation or force-law inference; executable mathematical construction search; boundaries between fit, identification, prediction, intervention, checking, and proof
- **Evidence rule:** the supplied document is a source lead only; statuses below come from the named primary papers, released artifacts, and the repository's existing measurement and proof audits
- **Promotion state:** no central claim, principle, candidate, or fixture added

## Executive finding

The useful residue is not “remove the old rules and constrain the model by raw
reality or pure logic.” Neither raw reality nor pure logic enters a computer.
An empirical system receives measurements produced by an observation process;
a formal system receives a human-encoded proposition, representation,
evaluator, and software stack.

The two branches share a proposal–evaluation loop but require different
acceptance contracts.

| Branch | Candidate | Immediate evaluator | Strongest supported result | Still unresolved |
| --- | --- | --- | --- | --- |
| empirical discovery | equation, force decomposition, latent dynamics, or intervention target | calibrated observations, held-out prediction, residual tests, and targeted perturbations | compatibility with recorded observations under the declared operator, support, model class, and uncertainty | causal identification, extrapolation, unmeasured state, alternative models, independent replication |
| formal construction search | program, witness, conjecture, proof attempt, or certificate | parser, execution, task score, exact property checker, solver, or proof kernel | only the property encoded and checked for the exact artifact and dependency versions | faithful specification, generality, optimality, importance, implementation trust, assumptions outside the formalization |

This is a typed evaluator boundary, not a new architecture principle. It
deduplicates into the repository's existing temporary proposal state,
diversity and selection, prediction-error allocation, maintenance, and
versioned memory mechanisms.

## Empirical acceptance is operator-qualified

Let the physical state be $x$, the instrument and preprocessing chain be
$O_{\eta}$ with calibration and configuration record $\eta$, and the observed
sample be

$$
y = O_{\eta}[x] + \epsilon,
$$

where $y$ has the instrument's declared units and $\epsilon$ contains recorded
random and systematic error terms in the same units. A candidate model $h$ is
not tested against reality directly. It is tested against $y$, conditional on
$O_{\eta}$, sampling, preprocessing, support, and nuisance assumptions.

For candidate family $\mathcal H$, empirical agreement can leave an
equivalence set

$$
\mathcal H_{\delta}
=\{h\in\mathcal H: D(O_{\eta}[h],y)\le\delta\},
$$

where $D$ is the preregistered discrepancy measure and $\delta$ has compatible
units or is explicitly dimensionless. A small discrepancy does not select a
unique causal law when several candidates, latent states, or parameter values
remain observationally equivalent.

An empirical discovery claim therefore needs separate evidence events:

1. **measurement validity:** calibration, uncertainty, support, preprocessing,
   selection, and observation-operator identity;
2. **within-support fit:** residuals and held-out results under the recorded
   apparatus and regime;
3. **identification:** alternative decompositions, symmetries, priors, anchors,
   equifinality, and sensitivity to model class;
4. **regime transfer:** withheld apparatus, operating conditions, geometries,
   scales, and observation processes;
5. **intervention:** prospective perturbations whose outcomes discriminate the
   proposed mechanism from its strongest alternatives; and
6. **replication:** independent reconstruction of the measurement and analysis
   chain.

## Case audit: physics-tailored dusty-plasma inference

The exact primary paper is Yu et al., published online 31 July 2025 in PNAS,
not April 2026
([DOI 10.1073/pnas.2505725122](https://doi.org/10.1073/pnas.2505725122)).
The likely source of the date error is an arXiv revision on 9 April 2025. The
separate three-dimensional tracking method was published in 2023
([DOI 10.1063/5.0147458](https://doi.org/10.1063/5.0147458)).

### What the experiment and model did

- Five laboratory runs contained 9, 10, 13, 15, and 18 levitated particles.
- Scanning laser-sheet tomography supplied three-dimensional trajectories, but
  the learned reduced force field was horizontal ($x$–$y$); the vertical
  sampling did not support an inferred $z$ force.
- The architecture assumed Newton's second law and decomposed acceleration
  into pairwise radial interaction, environmental confinement, and linear
  velocity drag. Translation and rotation structure, pairwise form, particle
  nonidentity, and a vertical descriptor were engineered into the model.
- Time-ordered cross-validation reported $R^2=0.9912$–$0.9963$ for the summed
  horizontal acceleration terms. The paper explicitly distinguishes this net
  fit from proof that every inferred component is correct.
- Two internally different mass estimates and synthetic recovery tests
  supported component interpretation. Absolute scale still required a
  manufacturer-average mass anchor.
- The released data and implementation are archived at
  [Zenodo](https://doi.org/10.5281/zenodo.15866620).

### Scoped result

The reported system provides established evidence that a physics-structured
neural model can fit held-out time segments from those runs and infer an
effective horizontal nonreciprocal interaction compatible with prior dusty-
plasma theory. Nonreciprocity itself was predicted and studied earlier; the
paper says it verified those predictions
([Ivlev et al. 2015](https://doi.org/10.1103/PhysRevX.5.011035)).

The interesting, narrower findings are model-mediated deviations from common
assumptions: a pair-dependent screening length varying with particle size and
a pressure-dependent charge–mass exponent. Their physical explanation and
generality remain open. The study did not demonstrate unconstrained symbolic
regression, a universal law, full three-dimensional force recovery,
independent-laboratory replication, or cross-domain transfer.

| Audit proposition | Status | Reason |
| --- | --- | --- |
| the paper appeared in April 2026 | disputed | PNAS publication was July 2025; April was a 2025 preprint revision |
| the model was constrained only by raw data | disputed | it encoded mechanics, decomposition, symmetries, pairwise structure, descriptors, and a mass anchor |
| the model recovered effective nonreciprocal horizontal interactions in the reported runs | established | held-out net-acceleration fit plus internal mass checks and synthetic recovery |
| nonreciprocity was a previously unknown physical effect | disputed | the paper verifies prior theoretical predictions and prior work |
| inferred screening and charge relations expose deviations from common approximations | plausible | scoped model-mediated result across five runs; cause and external validity remain unresolved |
| the method discovered a transferable fundamental law | speculative | no independent apparatus, regime-transfer, intervention, or cross-domain demonstration |

## Formal acceptance is specification-qualified

For proposition or task identity $p$, candidate artifact $a$, dependency
library $L_v$, evaluator $E_v$, and checker $K_v$, distinguish

$$
s=E_v(p,a,L_v)
$$

from

$$
\operatorname{Accept}(p,a,L_v,K_v)
=\operatorname{IdentityMatch}(p,a,L_v)
\land K_v(p,a,L_v).
$$

The score $s$ can rank programs without proving them. Even exact acceptance
establishes only the encoded proposition under the named definitions, axioms,
libraries, elaboration, checker, and artifact identity. It does not establish
that the formalization captures an informal intention or a physical world.

## Case audit: FunSearch

FunSearch combines a frozen pretrained code model, human-written executable
specification and program skeleton, a task-specific evaluator, and an island-
based evolutionary program database
([Romera-Paredes et al. 2024](https://doi.org/10.1038/s41586-023-06924-6)).
For cap sets, the model evolved a priority function inside a supplied greedy
constructor. Roughly $10^6$ model samples were used in the reported work.

The evaluator executed programs on specified inputs, rejected invalid,
resource-exceeding, or nonexecuting outputs, and scored retained programs. An
exact finite checker can establish that a returned set satisfies the encoded
cap-set property. It does not prove optimality, validate the full software
stack, or turn arbitrary model output into a formal proof.

The reported 512-point cap set in $\mathbb Z_3^8$ improved the prior 496-point
construction. Only 4 of 140 direct runs found the 512-point result, so the
search result also needs its stochastic success rate and compute budget. The
paper's broader asymptotic improvements are constructive lower bounds, not a
complete solution of the cap-set problem.

| Audit proposition | Status | Reason |
| --- | --- | --- |
| evaluator-guided program search improved selected mathematical constructions | established | exact artifacts and task results are reported in the primary paper |
| the finite 512-point witness establishes an existence lower bound after checking | established | the encoded cap-set property is decidable for the returned finite set |
| FunSearch used a general formal-logic or theorem-proof evaluator | disputed | it used executable task specifications, skeletons, scores, and property checks |
| the evaluator eliminated hallucinations or incorrect ideas in general | disputed | it filtered only failures represented by its execution and scoring contract |
| passing selected empirical inputs proves general program correctness | disputed | behavior outside the evaluated domain remains unproved |

## Workstation test contract

The supplied source should change later experiments in one concrete way: every
generator–evaluator system must declare which of the following tracks it is
running and may not inherit assurance from another track.

| Track | Hidden confirmatory changes | Required comparators | Decisive outputs |
| --- | --- | --- | --- |
| E1 measurement | calibration, sampling, noise, missing channels, preprocessing, selection | calibrated classical estimator and matched learned model | residuals, uncertainty coverage, traceability, failure detection |
| E2 identification | alternative latent mechanisms, equivalent equations, wrong decomposition, parameter anchors | system identification, symbolic regression, SINDy, Bayesian model comparison, physics-informed and unconstrained neural baselines | exact-recovery rate when truth exists, equivalence set, posterior or profile support, false identification |
| E3 regime transfer | apparatus, geometry, scale, forcing, operating range, observation operator | best domain-adaptation and invariant/structured baselines | calibration and predictive error by held-out regime; abstention quality |
| E4 intervention | perturbations that make leading mechanisms disagree | preregistered conventional experimental design and causal baselines | likelihood ratio or other declared discrimination statistic, harm, time, energy, human effort |
| F1 executable construction | unseen task families, evaluator inputs, skeletons, resource limits | enumeration, genetic programming, CEGIS, Bayesian optimization, matched model sampling | valid constructions, best score, success distribution, evaluator calls, joules, human-hours |
| F2 certificate or proof | proposition, definitions, axioms, library, checker, generated-family ancestry | interactive/automated theorem proving, SAT/SMT/CP, exact search and independent checking | accepted certificates, counterexamples, checker agreement, proof bytes, dependency robustness |

For every track, report candidate count, model calls, evaluator calls,
wall-seconds, CPU/GPU-seconds, peak bytes, electrical joules, and human-hours.
Do not call a fitted equation “discovered” without stating the hypothesis
grammar and competing observationally equivalent models. Do not call an
executed construction “proved” without naming the exact checked property and
checker chain.

## Deduplication and repository routing

| Audit residue | Existing owner | Disposition |
| --- | --- | --- |
| temporary proposals before acceptance | [P-003](../principle-registry.md#p-003--temporary-trace-before-commitment) and [P-004](../principle-registry.md#p-004--diversity-selection-and-protection) | duplicate; no principle |
| discrepancy-directed testing | [P-007](../principle-registry.md#p-007--prediction-error-allocation) | duplicate; evaluator must remain support-qualified |
| retained result, evaluator identity, and later invalidation | [P-009](../principle-registry.md#p-009--maintenance-plane) and [P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime) | duplicate; versioning requirement only |
| proposal–evaluation loop | [Candidate 004](../../experiments/candidates/004-closed-endogenous-curriculum.md) | existing experiment owner |
| empirical observation and support | [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md) and [Fixture F-005](../../experiments/fixtures/005-regime-qualified-flow-inference-control.md) | add as real-data stress case, not evidence inherited by the candidate |
| formal construction and verification | [Fixture F-004](../../experiments/fixtures/004-versioned-proof-discovery.md) | FunSearch is a mature comparator for efficiently evaluable construction tasks |
| graded difference between fit, component validation, transfer, and replication | [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md) | secondary assurance vocabulary only |

The source therefore adds a better test split and a corrected case study. It
does not enlarge the principle registry or architecture candidate set.

## Primary sources

- Yu, W., Abdelaleem, E., Nemenman, I., and Burton, J. C. (2025),
  [physics-tailored machine learning in dusty plasmas](https://doi.org/10.1073/pnas.2505725122).
- Yu, W. and Burton, J. C. (2023),
  [three-dimensional dusty-plasma particle tracking](https://doi.org/10.1063/5.0147458).
- Ivlev, A. V. et al. (2015),
  [nonreciprocal effective interactions](https://doi.org/10.1103/PhysRevX.5.011035).
- Romera-Paredes, B. et al. (2024),
  [FunSearch](https://doi.org/10.1038/s41586-023-06924-6).


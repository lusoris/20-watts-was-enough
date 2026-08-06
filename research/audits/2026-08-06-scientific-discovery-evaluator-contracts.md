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

## Selective relaxation is coupling-qualified

The second supplied document proposes a “pinned layer,” an “unpinned layer,”
and an orchestration loop that varies one scientific domain while treating the
others as fixed. The decomposition is useful, but the labels
“Domain-Specific Relaxation” and “Bounded Sandbox” were not established as
standard names for this architecture in the scoped primary-source search.
Treat them as source-specific descriptions, not scientific provenance.

The mature engineering relatives are multidisciplinary design optimization,
constrained and robust optimization, abstraction refinement, model-discrepancy
analysis, grey-box system identification, and runtime assurance. Universal
differential equations directly instantiate the close null of fixed mechanistic
terms plus a learnable unknown term
([Rackauckas et al. 2020](https://arxiv.org/abs/2001.04385)); sparse equation
identification is another mature comparator but can recover only dynamics
represented by its candidate library
([Brunton, Proctor, and Kutz 2016](https://doi.org/10.1073/pnas.1517384113)).
These methods do not make discrepancy localization identifiable. A flexible
term can absorb errors in fixed equations, boundaries, observations, latent
inputs, parameters, or numerics.

Multidisciplinary design optimization exists
precisely because structures, fluids, thermal behavior, controls, and other
disciplines exchange coupling variables rather than forming independent
chapters
([Martins and Lambe 2013](https://doi.org/10.2514/1.J051895)). Runtime-assurance
architectures permit a less-assured advanced component only within a monitored
safe region and transfer authority to an assured path before recovery becomes
infeasible
([Seto et al. 1998](https://doi.org/10.1109/ACC.1998.703255);
[Slagel et al. 2024](https://doi.org/10.1007/978-3-031-60698-4_19)). Neither
method makes the fixed model automatically correct.

Use “sandbox” only for an actual execution or capability boundary. Restricting
which model terms may vary is a hypothesis-family boundary; monitoring safe
physical states is an operational-assurance boundary; deciding what evidence
supports a scientific claim is an epistemic boundary. Conflating the four lets
containment evidence masquerade as model validity.

### Coupling contract

Partition a candidate into an explored block $u$, a nominally fixed block $v$,
shared parameters $\theta$, and versioned evidence and solver identity $\eta$.
The coupled analysis must satisfy

$$
R(u,v,\theta;\eta)=0,
$$

where every component of residual $R$ has a declared native unit or is formed
by a documented nondimensionalization. “Pinning” $v$ is valid only if the
solver still establishes multidisciplinary consistency for each proposed $u$.

For a pinned constraint $c_p$, the total sensitivity to an explored variable
is

$$
\frac{d c_p}{d u}
=\frac{\partial c_p}{\partial u}
+\frac{\partial c_p}{\partial v}\frac{d v^*}{d u},
$$

where $v^*(u)$ is the coupled fixed-point or solution state. Calling $c_p$
“outside the sandbox” does not remove either term. If the derivative is
nonzero, changing the open block changes the allegedly pinned result. If the
derivative is unknown, the coupling is an unclosed risk rather than zero.

Each retained constraint therefore needs a typed assurance class:

| Class | Admission event | Required identity | What it does not establish |
| --- | --- | --- | --- |
| formal invariant | proof or independently checked certificate | proposition, definitions, axioms, library, checker, artifact hash | faithful physical model or applicability outside assumptions |
| numerical bound | verified residual/error/tolerance result | equations, discretization, solver, mesh, precision, convergence and tolerance units | absence of model-form error or untested regimes |
| empirical envelope | calibrated measurement and support-qualified predictive/intervention evidence | observation operator, apparatus, sample, uncertainty, regime and analysis version | universal law or behavior outside support |
| heuristic penalty | finite score on declared cases | objective, weights, test cases, seeds and resource limit | feasibility, safety, causality, or proof |

A heuristic evaluation model is not a hard wall. A deterministic solver is
deterministic relative to its equations, discretization, implementation,
inputs, tolerances, and hardware—not necessarily relative to the physical
system.

### The supplied ice-storage example is false as written

The document says that an ice-storage phase transition happens during
extraction rather than charging. In a conventional cold-storage cycle, charging
solidifies water into ice and discharging melts the ice; both stages contain a
phase transition
([Aljuneidi et al. 2024](https://doi.org/10.1016/bs.aiht.2024.05.002)). A
system that pinned the supplied sentence would hard-code an error and reject
valid designs. This is a direct counterexample to the document's claim that the
pinned layer can be treated as an unquestionable mechanical baseline.

### Assumption lifecycle

Every pinned item must remain independently challengeable while proposals are
prevented from silently rewriting it. Store

$$
A_i=(q_i,s_i,e_i,b_i,v_i,d_i),
$$

where $q_i$ is the exact proposition or model component, $s_i$ its assurance
class and status, $e_i$ its evidence, $b_i$ its applicability boundary, $v_i$
its version, and $d_i$ its reverse dependencies. A new observation,
counterexample, solver defect, calibration change, or boundary violation
invalidates dependent admissions; it does not merely lower a prose confidence
score. Model calibration must also represent residual model discrepancy rather
than forcing every mismatch into adjustable parameters
([Kennedy and O'Hagan 2001](https://doi.org/10.1111/1467-9868.00294)).

The source's `99%` pinned and `1%` open split has no unit, denominator, or
evidence. Replace it with a dependency graph and measured search/assurance
budget. Different proposals can activate different constraint subsets; the
system must report which constraints ran, which were inapplicable, which
returned unknown, and which were approximated.

### Hostile selective-relaxation tests

Every experiment needs four matched arms before the hostile conditions below
are crossed: all components fixed; exactly one named component relaxed; the
target component and its strongest interacting neighbor relaxed jointly; and a
fully flexible or strongest mature baseline. Hold observations, candidate and
evaluator calls, compute, wall time, human work, and energy budgets equal. The
joint arm tests whether a learned component merely compensates an error in a
supposedly fixed neighbor; alternative decompositions test whether the result
depends on where the researcher drew the module boundary.

| Track | Planted condition | Required comparison | Reject the architecture when |
| --- | --- | --- | --- |
| S1 valid decomposition | one block varies and all cross-couplings are known | ordinary coupled optimization with the same solvers | orchestration adds no valid Pareto improvements at equal evaluations and joules |
| S2 hidden coupling | an open variable changes a pinned discipline through an omitted path | fully coupled multidisciplinary analysis | the gated system admits infeasible candidates or misses the coupling |
| S3 false pinned rule | one fixed proposition is plausible but wrong | versioned challengeable assumptions plus counterexample search | the hard gate suppresses the valid family and cannot recover after correction |
| S4 numerical false pass | discretization, tolerance, precision, convergence, or solver defect masks a violation | independent solver, refinement and residual/error estimation | admission changes across valid numerical implementations without detection |
| S5 regime shift | a formerly valid constraint leaves its calibrated support | robust/domain-qualified model with abstention | the system continues to call the pinned result certain |
| S6 objective gaming | a candidate exploits a proxy or evaluation-model blind spot | adversarial testing and direct physical/independent evaluation | proxy score rises while declared physical outcomes worsen |
| S7 swapped research domain | the open and fixed blocks exchange roles across episodes | full rebuild and dependency-aware incremental evaluation | stale caches, assumptions, or certificates leak assurance across roles |
| S8 all-correct negative control | fixed laws are correct but measurements contain noise, drift, missingness, and finite sampling | preregistered family-wise/FDR control and no-discrepancy model | the flexible block invents a new term above the error budget |
| S9 wrong-location absorption | the defect lies in a pinned module, boundary, observation operator, calibration, latent input, clock, or numerical implementation | one-relaxed variants, localized-discrepancy methods, and an abstaining ensemble | the open block confidently absorbs and mislabels the external defect |
| S10 multi-fault interaction | two defects and one cross-module interaction are planted | pairwise/factorial relaxation, explicit interaction model, and all-flexible discrepancy | the system forces a single culprit instead of returning an equivalence set or insufficient model |

Report valid-candidate yield, false admission, false rejection, hidden-coupling
detection, time to invalidate, recovery after correction, solver/evaluator
calls, wall-seconds, peak bytes, electrical joules, and human-hours. A larger
candidate count is not a gain when the acceptance surface is wrong.

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
| selectively open proposal block with fixed constraints | [Candidate 004](../../experiments/candidates/004-closed-endogenous-curriculum.md), [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md), and [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md) | no new architecture; add coupling, typed-assurance, and invalidation tests |
| scoped local composition and model-error absorption | [C-150](../claims.md#c-150), [C-153](../claims.md#c-153), [C-155](../claims.md#c-155), [C-868](../claims.md#c-868), [C-869](../claims.md#c-869), and [C-894](../claims.md#c-894) | existing claims already require true disjointness or explicit compatibility and warn that learned corrections can absorb upstream errors |

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
- Martins, J. R. R. A. and Lambe, A. B. (2013),
  [multidisciplinary design-optimization architectures](https://doi.org/10.2514/1.J051895).
- Seto, D. et al. (1998),
  [Simplex architecture](https://doi.org/10.1109/ACC.1998.703255).
- Slagel, J. T. et al. (2024),
  [formal runtime-assurance framework](https://doi.org/10.1007/978-3-031-60698-4_19).
- Kennedy, M. C. and O'Hagan, A. (2001),
  [computer-model calibration and discrepancy](https://doi.org/10.1111/1467-9868.00294).
- Aljuneidi, N. et al. (2024),
  [ice thermal-energy-storage modeling](https://doi.org/10.1016/bs.aiht.2024.05.002).
- Rackauckas, C. et al. (2020),
  [universal differential equations](https://arxiv.org/abs/2001.04385).
- Brunton, S. L., Proctor, J. L., and Kutz, J. N. (2016),
  [sparse identification of nonlinear dynamics](https://doi.org/10.1073/pnas.1517384113).

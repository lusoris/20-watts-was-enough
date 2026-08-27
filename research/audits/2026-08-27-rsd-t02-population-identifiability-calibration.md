# RSD-T02 population, identifiability, calibration, and null maturity

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-27
- **Question:** what must exist between a collection of matched-response
  construction recipes and a defensible comparison of mechanism-specific and
  generic dynamical estimators?
- **Fields sampled:** experimental design, structural identifiability,
  dynamical-system benchmarks, structured cross-validation, distribution
  shift, probabilistic calibration, selective prediction, and software
  provenance
- **Primary claims:** [C-1541](../claims.md#c-1541),
  [C-1562](../claims.md#c-1562), [C-1563](../claims.md#c-1563),
  [C-1565](../claims.md#c-1565), [C-1566](../claims.md#c-1566),
  [C-1567](../claims.md#c-1567), and [C-1568](../claims.md#c-1568)
- **Implementation state:** exact public family registry, deterministic
  fixed-parameter metadata generator, coverage audit, and six-level null
  maturation contract; no affected fitting or comparison

## Executive finding

The current 64 RSD-T02 seed labels do not create 64 systems. They select only
two opaque state-handle permutations. The current 35-projection packet also
combines step observations at three time constants with a 26-episode panel at
one time constant. It is useful for construction conformance, but it cannot be
the observation packet of one fixed system instance.

The new construction layer closes a narrower boundary:

1. five public equation families are versioned and linked to complete property
   certificates;
2. an exact HMAC-SHA-256 integer generator produces four conformance draws per
   family;
3. each accepted instance has one complete rational parameter vector and one
   time constant across 26 unique episodes;
4. draw indices, episodes, realizations and rows remain nested replay
   coordinates rather than scientific units; and
5. the registry computes lineage coverage instead of inferring it from family
   or draw count.

That audit immediately exposes the next constraint. `log-fold`,
`reported_output_feedback_edge=true`, and `channel_local_state=true` each have
only one structural lineage; `causal_memory=false` has none. More parameter
draws from the same equations cannot repair those gaps.

## Four levels that must not be conflated

| Level | What changes? | What it can test | What it cannot substitute for |
| --- | --- | --- | --- |
| episode | input history or intervention | response diversity within one fixed system | a new parameterized system |
| system instance | accepted complete parameter vector | within-family parameter variation | a new equation lineage |
| system family | equation template and declared parameter distribution | named-family performance | transfer beyond the fixed family panel |
| structural lineage | derivation, equivalence, code or ancestry component | protected outer transfer | a probabilistic superpopulation of all mechanisms |

Hurlbert's pseudoreplication analysis and Lazic, Clarke-Williams and Munafò's
experimental-unit treatment support the first separation. Repeated
observations may improve a within-instance estimate; they do not create an
independently instantiated system for a system-instance estimand.

The project-specific canonical digest is an enforcement device. It is not a
scientific theorem. Its purpose is to prevent a caller from assigning several
aliases to the same family, parameter, nuisance and certificate content and
then counting those aliases as independent systems.

## Exact public-development generator

For family $f$, conformance draw index $j$, parameter key $k$, and attempt
$a$, the generator canonicalizes

$$
m_{f,j,k,a}
=
\operatorname{canon}
\left(
  d, H_{\mathcal F}, H_f, f, v_f, j, k, a
\right),
$$

where $d$ is the generator domain, $H_{\mathcal F}$ is the digest of the
ordered scientific family projections, $H_f$ is the selected scientific
family-definition digest, and $v_f$ is the family version. Coverage policy,
custody state, packet metadata and authority text are excluded from
$H_{\mathcal F}$; each family projection includes its declared equation-
template digest.
It then computes

$$
w_{f,j,k,a}
=
\operatorname{U64BE}
\left[
\operatorname{HMAC}_{K_{\mathrm{public}}}
\left(m_{f,j,k,a}\right)_{0:8}
\right].
$$

The root key is public replay material. It provides deterministic domain
separation, not secrecy.

The only sampled parameter is one the current equations actually consume:

$$
\tau_{\mu s}
\sim
\operatorname{DiscreteUniform}
\{500000,\ldots,2000000\}.
$$

Let $K=1{,}500{,}001$ and

$$
L=2^{64}-\left(2^{64}\bmod K\right).
$$

Words $w\ge L$ are rejected before modulo reduction. For the first accepted
word,

$$
\tau_{\mu s}=500000+(w\bmod K),
\qquad
\tau_s=\frac{\tau_{\mu s}}{10^6}\ \mathrm{s}.
$$

Every attempt is logged and charged. The parameter document stores exact
integer numerator, denominator and unit fields, so identity generation does
not depend on `Math.log`, `Math.exp` or platform-specific decimal formatting.
The nonlinear-feedback family additionally binds
$\kappa=1/4$; every family binds the canonical fold $F_*=2/1$.

The scientific instance identity is

$$
I
=
H\!\left(
f,v_f,\ell_f,H_\theta,\tau_s,H_\nu,H_{\mathcal C}
\right),
$$

where $\ell_f$ is structural lineage, $H_\theta$ the complete parameter-vector
digest, $H_\nu$ the nuisance-interface digest and $H_{\mathcal C}$ the complete
property-certificate-set digest, which includes the equation-template digest.
The full registry digest, population-design bytes and model-source bytes remain
separate provenance. The draw index is recorded in the receipt but is absent
from $I$. If two generator coordinates ever yield identical
scientific content, they yield the same $I$ and effective increment zero.

The generated packet contains the 26 unique full-panel episode IDs. Every
episode repeats the same $H_\theta$ and $\tau_s$. A separate protocol digest
binds every episode schedule, the horizon, integration step, output rate, input
bounds, units and interpreter semantics into packet identity without changing
the system identity. The packet contains metadata only; the existing policy
runtime still expects its different, mixed-time-constant 35-projection
construction packet.

## Coverage is a lineage property

![Distinct structural-lineage counts per property value. The vertical threshold is the frozen minimum of two; four values remain below it.](../../public/plots/rsd-t02-lineage-coverage.svg)

| Property value | Families | Distinct structural lineages | Required | State |
| --- | ---: | ---: | ---: | --- |
| `drive_transform=affine-fold` | 4 | 3 | 2 | covered |
| `drive_transform=log-fold` | 1 | 1 | 2 | thin |
| `reported_output_feedback_edge=false` | 4 | 3 | 2 | covered |
| `reported_output_feedback_edge=true` | 1 | 1 | 2 | thin |
| `channel_local_state=false` | 4 | 3 | 2 | covered |
| `channel_local_state=true` | 1 | 1 | 2 | thin |
| `causal_memory=false` | 0 | 0 | 2 | absent |
| `causal_memory=true` | 5 | 4 | 2 | covered |

The I1-FFL and affine high-pass constructions are input--output isomorphic
under the full registered interface. They share one lineage and one full-panel
equivalence group for coverage counting. Counting their recipe names twice
would create apparent support without another independent structural route.

Coverage is a prerequisite, not power. Two lineages per value do not determine
the required number of system instances, an effect margin, variance, failure
rate, multiplicity adjustment or confirmation power.

## Identifiability is relative to an experiment

Bellman and Åström define structural identifiability through uniqueness under a
declared input--output experiment. Villaverde, Barreiro and Papachristodoulou
show how nonlinear ODE models can retain unidentifiable parameter combinations.
Apgar et al., Mélykúti et al., and Hamadeh, Ingalls and Sontag demonstrate that
designed dynamic inputs, initial conditions or perturbations can separate
specified rival models that ordinary observations fail to separate.

The logical form is conditional:

$$
\operatorname{Identifiable}
\left(
\mathcal M,\mathcal U,\mathcal H,\mathcal T,\Theta
\right),
$$

with candidate model set $\mathcal M$, admissible inputs or interventions
$\mathcal U$, observation map $\mathcal H$, time grid $\mathcal T$ and
parameter support $\Theta$. Changing any component can change the answer.

Three conclusions follow for RSD-T02:

1. structural identifiability of the declared target is necessary for unique
   recovery of that target, but full-parameter identifiability is not required
   for a coarser property partition, and structural identifiability alone does
   not guarantee practical recovery under finite noisy data;
2. a successful intervention separates only the declared candidates and
   parameter support certified by that intervention; and
3. exact input--output equivalence requires a set-valued answer or abstention,
   not a forced hidden graph name.

Szederkényi, Banga and Alonso provide the strongest version of the third
boundary for their mass-action representation: distinct reaction graphs can
realize identical dynamics under the stated constraints.

## Episode, parameter and lineage shifts answer different questions

Roberts et al. show why random cross-validation can underestimate error under
spatial, temporal, hierarchical or phylogenetic dependence. WILDS documents
substantial in- versus out-of-distribution gaps across ten real datasets.
Gilpin's 131-system dynamical benchmark and Wang et al.'s experiments expose
separate variation in equations, initial conditions, sampling, noise and
system parameters.

RSD-T02 therefore needs three separately named evaluations:

1. **episode transfer:** new histories for known fixed instances;
2. **parameter transfer:** independently generated instances from known
   family distributions; and
3. **lineage transfer:** evaluator-custodied equation families from protected
   ancestry components.

The public 20-artifact conformance plan exercises deterministic instance
construction only. It is not a sample-size decision. Its four draw indices per
family cannot establish parameter-shift performance, and the five public
families cannot establish unseen-lineage transfer.

## The generic nulls need a shared probabilistic interface

The names `B-STATE-SPACE` and `B-RECURRENT` currently overstate their executable
contents if read as model descriptions:

| Arm | Current executable core | Current coordinates | Maturity |
| --- | --- | --- | --- |
| `B-STATE-SPACE` | two fixed first-order affine/log reference traces plus reset/freeze distances | drive transform, causal memory | level 1: fixed conformance reference |
| `B-RECURRENT` | one fixed exponential running state over clamp and restimulation traces | feedback edge, channel locality | level 1: fixed conformance reference |

Neither is trained. Neither emits calibrated probabilities. They do not cover
the same primary properties. Comparing their present mean losses would mix
architecture with missing-output and abstention policy.

The target state-space null uses learned causal latent transition and
observation maps. The target recurrent null uses a compact learned GRU-style
causal state. Both must receive the same fixed-parameter packet schema and
allowlisted causal fields, and both must use one architecture-neutral output
interface that emits:

1. normalized value posteriors for every primary property;
2. a posterior that each property is identifiable under the observed panel;
3. a normalized joint property-vector posterior over the active coordinate
   domain with coherent marginals;
4. support state;
5. deterministic decide-or-abstain action and reason codes; and
6. a complete work ledger.

One admissible fitting objective is

$$
J(\theta)
=
\sum_{i,q}a_q
\left[
\operatorname{BCE}(I_{iq},s_{iq})
+I_{iq}\operatorname{CE}(\pi_{iq},p_{iq})
\right]
-\lambda_E\sum_i
\log\!\left(\sum_{v\in\mathcal E_i}q_i(v)\right)
+\lambda_P L_{\mathrm{pred}}(\theta)
+\lambda_R R(\theta).
$$

Here $\theta$ is the trainable parameter vector, $i$ indexes system instances,
and $q$ indexes the active property coordinates. Let $\mathcal V$ be the finite
active joint property-vector domain. For every $i$, $q_i:\mathcal V\to[0,1]$
is normalized so that $\sum_{v\in\mathcal V}q_i(v)=1$. The evaluator supplies
a nonempty compatibility set $\varnothing\ne\mathcal E_i\subseteq\mathcal V$.
Thus the equivalence-mass penalty is $+\infty$ when the model puts
zero mass on all compatible vectors.

$I_{iq}\in\{0,1\}$ is evaluator-certified identifiability and
$s_{iq}\in[0,1]$ its predicted probability. When $I_{iq}=1$,
$\pi_{iq}$ is the unique certified property value and $p_{iq}$ is a normalized
distribution over that property's registered values. When $I_{iq}=0$,
$\pi_{iq}$ need not exist and the masked term is defined explicitly as
$I_{iq}\operatorname{CE}(\pi_{iq},p_{iq})=0$. $L_{\mathrm{pred}}(\theta)$ is
an auxiliary causal prediction loss and $R(\theta)$ a frozen regularizer.
Both are normalized to be dimensionless before entering this objective, as
are BCE, CE, and the negative log-mass term.

The arm-specific training weights obey $a_q\ge0$ and
$\sum_q a_q=1$; they are selected inside fit only. They are not the common
endpoint-aggregation weights $w_q\ge0$, $\sum_qw_q=1$, which freeze before
development evaluation. The equivalence-mass coefficient obeys $\lambda_E>0$;
$\lambda_P,\lambda_R\ge0$. They are dimensionless because their terms are
normalized; every coefficient,
horizon, optimizer and stopping rule is selected inside fit only. The
deterministic trial tie-break freezes before trial outcomes exist.

This is a prospective objective family, not a fitted model or recommended
numeric weight vector.

## Calibration and abstention

Chow derives an optimum error--reject trade-off when posterior probabilities
are known. Guo et al. show that raw neural-classifier confidence can be poorly
calibrated and that held-out temperature scaling improved calibration in most
of their tested settings. Geifman and El-Yaniv formulate risk--coverage control
under an independent identically distributed calibration setting.

Let $z\in\mathcal Z$ be the calibrated information state available to the
decision rule, $\mathcal A$ the finite registered set of non-abstention
actions, $v\in\mathcal V$ an active-domain joint property vector, and
$q(v\mid z)$ a normalized posterior over $\mathcal V$. The registered
dimensionless loss is
$L:(\mathcal A\cup\{\bot\})\times\mathcal V\to[0,\infty)$, where $\bot$
denotes abstention. Define the posterior risk

$$
\rho(a,z)=\sum_{v\in\mathcal V}L(a,v)q(v\mid z).
$$

The registered conservative decision rule is

$$
\delta(z)=
\begin{cases}
\widehat a,
& \text{if support strictly passes, }
\arg\min_{a\in\mathcal A}\rho(a,z)=\{\widehat a\},
\text{ and }\rho(\widehat a,z)<\rho(\bot,z),\\
\bot, & \text{otherwise}.
\end{cases}
$$

Thus a non-abstention action is returned only when it is the unique best
registered action and strictly beats abstention. Equality with the abstention
loss, equality at the support threshold, or a tie between non-abstention
actions returns $\bot$. Scientific out-of-support cases remain in the
denominator as abstentions; malformed packets are rejected outside it.

The core, preprocessing, property heads and final numeric common resource caps
freeze before calibration. The calibration process may fit only its declared
map and thresholds; it may not change model weights. Equal-to-threshold cases
abstain. Calibration labels cannot influence fitting, and development-
evaluation labels cannot influence either. The joint posterior covers the
three primary properties until memory-negative and memory-positive lineages
pass the activation rule; adding causal memory requires a new contract version,
head and calibration.

An in-distribution calibration guarantee does not automatically extend to a
new mechanism lineage. Outer confirmation must report risk and coverage again
rather than transporting the public guarantee by assumption.

## Six explicit maturity levels

| Level | Status | Required evidence |
| ---: | --- | --- |
| 1 | fixed conformance reference | deterministic construction checks only |
| 2 | trainable public prototype | causal trainable core and leakage-safe output interface |
| 3 | fit-frozen development estimator | grouped fit-only selection and frozen model artifact |
| 4 | calibrated development comparator | frozen calibrator, support and abstention artifacts |
| 5 | confirmation-frozen mature null | model, calibration, final caps and source-runtime identity frozen |
| 6 | confirmation evaluated | one-pass run state, not a model property |

Only level 5 satisfies the population design's requirement for two frozen
mature generic nulls. Both current arms are level 1, and all ten intrinsic
null-maturity gates remain open. Two of ten separate comparison-release gates
are satisfied: the versioned public family registry and deterministic fixed-
parameter generator. The measured-energy meter gate applies only if the
comparison makes a measured-energy claim, so it is excluded from the 20-gate
non-energy derivation. All four affected-fitting blockers must also close
before mature-null status can become true.

```mermaid
flowchart LR
    R[Family registry<br/>satisfied] --> G[Fixed-instance generator<br/>satisfied]
    G --> C[Coverage-complete<br/>lineage bank]
    C --> S[Seal outer-family<br/>payload]
    S --> U[Parameterized runner<br/>validated]
    U --> D[Instance-level<br/>fit / calibration / dev-eval split]
    D --> T[Train and select<br/>both generic nulls]
    T --> B[Freeze final<br/>common caps]
    B --> F[Freeze fit-only<br/>coverage floor]
    F --> K[Calibrate probability,<br/>support and abstention]
    K --> V[One-pass dev evaluation<br/>+ pilot variance]
    V --> W[Audit null work +<br/>resource ledger]
    W --> P[Power + Holm-4<br/>analysis frozen]
    P --> O[Outer instance packs<br/>and evaluator custody]
    O --> X[One-pass confirmation]

    classDef done fill:#0f766e,stroke:#5eead4,color:#fff;
    classDef blocked fill:#7f1d1d,stroke:#fca5a5,color:#fff;
    class R,G done;
    class C,S,U,D,T,B,F,K,V,W,P,O,X blocked;
```

Affected fitting is blocked by incomplete lineage coverage, unassigned and
unsealed outer-family templates, the absent parameterized transcript/policy/
resource runner and the absent instance-level fit/calibration/development-
evaluation assignment. This order prevents later family choice from reacting
to public fit responses.

## Resource parity

Parity means common maxima and complete accounting, not padding actual work to
the same number. Both nulls need the same packet and intervention authority,
precision, hardware class, retained-state cap, influential-parameter cap,
scratch-memory cap, thread cap, wall-time cap, tuning-trial cap and restart cap.

Actual work remains separate for training, failed trials, selection,
calibration, fallback and inference. Successful preprocessing fits and data
reads, successful training and optimizer updates, output heads, calibrators,
support detectors and fallback code count. Failed, timed-out, out-of-memory and
manually abandoned trials remain in the ledger. A restart is a nested
optimization attempt, never an additional system instance.

The provisional values of 16 retained scalars, 512 trainable scalars and 32
tuning trials are inactive pilot envelopes. They become caps only after exact
feasible architectures are enumerated and tested. Current conformance operation
counts cannot stand in for training cost, elapsed time, memory or joules.

## Machine artifacts and hostile tests

The implementation adds:

- [`rsd-t02-system-family-registry.json`](../../experiments/workstation/fixture-026/configs/rsd-t02-system-family-registry.json);
- [`rsd-t02-development-instance-plan.json`](../../experiments/workstation/fixture-026/configs/rsd-t02-development-instance-plan.json);
- [`rsd-t02-system-family-generator.mjs`](../../experiments/workstation/fixture-026/rsd-t02-system-family-generator.mjs);
- [`rsd-t02-generated-artifacts.schema.json`](../../experiments/workstation/fixture-026/rsd-t02-generated-artifacts.schema.json);
- [`rsd-t02-null-maturation-design.json`](../../experiments/workstation/fixture-026/configs/rsd-t02-null-maturation-design.json); and
- their closed schemas, exact parent hashes and nineteen focused tests.

The tests cover schema and canonical-digest drift, exact integer-draw goldens,
family and draw domain separation, modulo rejection/exhaustion, fixed parameter
and time constant across all 26 episodes, equation-template and complete-
episode-protocol binding, packet/parameter mutation, canonical-instance
deduplication, generated-artifact schemas, honest coverage failure, exact
parent-source binding, authority inflation, false maturity relabelling, and the
shared primary-property output requirement.

The next hostile tranche must add a parameterized transcript runner and verify:

1. recipe, equation, family, lineage and truth honeypots cannot alter a
   pre-evaluator response;
2. the same causal prefix with hostile future suffix produces the same output
   at every registered decision deadline;
3. calibration cannot write model weights and evaluation cannot write model,
   calibrator or threshold artifacts;
4. instance order cannot leak recurrent state;
5. every crash, timeout, out-of-memory trial and fallback remains charged; and
6. packet bytes and privileged intervention authority are identical across
   arms.

## Evidence limitations

1. The cited identifiability papers analyze declared model classes; none proves
   universal recovery of natural or artificial mechanisms.
2. Structured blocking must match the intended target. It can deliberately
   create extrapolation and must be reported as such.
3. The public five-family registry is too small and property-imbalanced for the
   intended comparison.
4. The 20 generated artifacts test deterministic construction. They do not set
   a sample size, estimate variance or support a performance claim.
5. Selective-risk guarantees depend on calibration independence and target
   distribution. A lineage shift changes that premise.
6. No primary source supplies the project's property thresholds, architecture
   caps, loss weights, effect margin or power target; those remain prospective
   protocol choices.

## Primary bibliography

1. Bellman and Åström (1970), [On Structural Identifiability](https://doi.org/10.1016/0025-5564(70)90132-X).
2. Apgar et al. (2008), [Stimulus Design for Model Selection and Validation in Cell Signaling](https://doi.org/10.1371/journal.pcbi.0040030).
3. Mélykúti et al. (2010), [Discriminating between rival biochemical network models](https://doi.org/10.1186/1752-0509-4-38).
4. Hamadeh, Ingalls and Sontag (2013), [Transient dynamic phenotypes as criteria for model discrimination](https://doi.org/10.1098/rsif.2012.0935).
5. Villaverde, Barreiro and Papachristodoulou (2016), [Structural identifiability of dynamic systems biology models](https://doi.org/10.1371/journal.pcbi.1005153).
6. Szederkényi, Banga and Alonso (2011), [Inference of complex biological networks](https://doi.org/10.1186/1752-0509-5-177).
7. Hurlbert (1984), [Pseudoreplication and the Design of Ecological Field Experiments](https://doi.org/10.2307/1942661).
8. Lazic, Clarke-Williams and Munafò (2018), [What Exactly Is N in Cell Culture and Animal Experiments?](https://doi.org/10.1371/journal.pbio.2005282).
9. Roberts et al. (2017), [Cross-validation strategies for data with temporal, spatial, hierarchical, or phylogenetic structure](https://doi.org/10.1111/ecog.02881).
10. Koh et al. (2021), [WILDS: A Benchmark of in-the-Wild Distribution Shifts](https://proceedings.mlr.press/v139/koh21a.html).
11. Gilpin (2021), [Chaos as an Interpretable Benchmark for Forecasting and Data-Driven Modelling](https://arxiv.org/abs/2110.05266).
12. Wang et al. (2021), [Bridging Physics-Based and Data-Driven Modeling for Learning Dynamical Systems](https://proceedings.mlr.press/v144/wang21a.html).
13. Chow (1970), [On Optimum Recognition Error and Reject Tradeoff](https://doi.org/10.1109/TIT.1970.1054406).
14. Guo et al. (2017), [On Calibration of Modern Neural Networks](https://proceedings.mlr.press/v70/guo17a.html).
15. Geifman and El-Yaniv (2017), [Selective Classification for Deep Neural Networks](https://papers.nips.cc/paper_files/paper/2017/hash/4a8423d5e91fda00bb7e46540e2b0cf1-Abstract.html).

## Disposition

Keep the existing 35-projection runtime as a construction-conformance path.
Use the new 26-episode fixed-instance packet only after a parameterized
transcript and policy contract exists. Before training either generic null,
add coverage-completing public and protected lineages, assign and seal the
outer-family payload, and freeze the instance-level fit/calibration/development
evaluation split. The next executable target is level 2: trainable public
prototypes with one shared probability, support and abstention interface.

# Primary-source audit: paleobiology and major evolutionary transitions

**Audit date:** 2026-08-05  
**Scope:** population bottlenecks, mass extinction and recovery, adaptive
radiation, symbiogenesis, multicellularity, division of labor, cooperation and
conflict control, exaptation, developmental constraint, and incomplete fossil
observation  
**Purpose:** candidate evidence for later claim-ledger and principle-registry
review; this file does not promote claims or create a new `P-` identifier

## Executive finding

The strongest transferable lesson is not “copy evolution,” “kill weak models,”
or “combine more modules.” A major transition requires a change in the unit
that can persist, vary, and be selected: cooperation among lower-level units
must produce **heritable variation in higher-level performance**, while
relatedness, policing, reproductive organization, or another conflict-control
mechanism prevents lower-level selection from dissolving the collective
([Price 1970](https://doi.org/10.1038/227520a0); [Frank 1995](https://doi.org/10.1038/377520a0);
[Queller 2000](https://doi.org/10.1098/rstb.2000.0727)). That is a conditional
synthesis of existing [`P-004`](../principle-registry.md#p-004--diversity-selection-and-protection),
[`P-008`](../principle-registry.md#p-008--compartmentalized-interaction),
[`P-009`](../principle-registry.md#p-009--maintenance-plane),
and [`P-012`](../principle-registry.md#p-012--memory-matched-to-information-lifetime), not yet
a new architectural principle.

The second important result is epistemic. Fossils are observations passed
through preservation, rock availability, collection, taxonomy, and time
binning. A first or last observed occurrence is therefore not automatically a
true origination or extinction. Claims about pulses, delays, recovery, or
warning signals need an explicit observation model. This belongs with the
[versioned observation contract](../../experiments/candidates/014-versioned-observation-contract.md),
not as a separate “paleontological” controller.

The audit rejects three tempting shortcuts:

- A **demographic bottleneck** usually loses diversity and increases drift; it
  is not equivalent to a reproductive single-cell bottleneck that can align
  organism-level heredity.
- A **mass extinction** is a destructive, path-dependent filter, not an
  optimization operator. Survival, abundance, ecological function, and later
  diversification can disagree.
- A **radiation** is not free novelty. It depends on ecological opportunity,
  heritable variation, selection, interaction, and developmental accessibility.

## Evidence boundary and terms

This audit mixes experiments, comparative genomics, fossil occurrence
analyses, mathematical identities, and foundational concepts. They answer
different questions. An experimental evolution result establishes what
happened in its selected organisms and environment; a fossil pattern
establishes what is recoverable under a stated sampling treatment; a theory
paper identifies sufficient or necessary conditions inside a model. None alone
demonstrates that an engineered analogue will outperform standard methods.

| Term | Operational meaning in this audit | Common category error |
| --- | --- | --- |
| Demographic bottleneck | temporary reduction in effective population size $N_e$ | treating diversity loss as useful consolidation |
| Reproductive bottleneck | a new higher-level individual is founded by one or few propagules | equating it with top-$k$ routing or parameter pruning |
| Mass extinction | geologically brief, unusually high loss relative to background under an explicit taxonomic and temporal definition | treating the conventional “Big Five” as a fixed algorithmic threshold |
| Recovery | a vector of taxonomic, abundance, functional, geographic, and interaction-network trajectories | declaring recovery when richness alone returns |
| Adaptive radiation | lineage diversification associated with ecological and phenotypic differentiation | calling any hyperparameter sweep a radiation |
| Symbiogenesis | persistent evolutionary integration of formerly independent lineages | calling a reversible API composition an endosymbiosis |
| Evolutionary individuality | a collective that has sufficiently aligned heredity and fitness for selection at that level to matter | calling any cooperating ensemble an organism |
| Exaptation | a character useful now but not historically built by selection for its current role | using “unexpected reuse” without evidence about origin and current function |
| Developmental constraint | bias or limit on phenotypic variation imposed by the developmental system | inferring impossibility from an empty region of observed morphospace |

## Deduplication map

| Paleobiological pattern | Existing abstraction | What remains distinctive here |
| --- | --- | --- |
| radiation and differential survival | `P-004` diversity, selection, protection | ecological opportunity and recovery must be measured separately from selection |
| compartments, cells, propagules, organelles | `P-008` selective boundaries; chemistry audit | a compartment or autocatalytic set is not yet a heritable higher-level individual |
| repair, culling, turnover | `P-009` maintenance | organismal conflict control must be tested against ordinary lifecycle governance |
| inherited versus transient state | `P-012` memory lifetimes | transmission fidelity and unit-of-selection accounting |
| ecological resilience and succession | [collective/ecological audit](2026-08-05-collective-ecological-resilience.md) | mass-extinction observation bias and dead-clade outcomes |
| aggregation and collective decisions | collective-systems evidence | aggregation can improve tasks without producing evolutionary individuality |
| autocatalysis and symbiosis | [chemistry audit](2026-08-05-chemistry-reaction-networks-proofreading.md) | persistent partner integration requires inheritance, interfaces, and conflict control |
| novelty and co-option | [endogenous-generation audit](2026-08-05-endogenous-generation-creativity.md) | historical origin must be separated from current utility |
| slowing, variance, and transition warnings | [Earth-system transition audit](2026-08-05-earth-system-transition-signals.md) and [candidate 003](../../experiments/candidates/003-recovery-dynamics-fragility.md) | fossils are retrospective, sparse, range-truncated, and temporally smeared |
| preservation and collection metadata | [candidate 014](../../experiments/candidates/014-versioned-observation-contract.md) | paleobiology supplies a demanding observation-kernel test case, not a second contract |

## Mathematical boundary conditions

### Bottleneck null

For an idealized neutral diploid Wright–Fisher population,

$$
\mathbb{E}[H_{t+1}\mid H_t] = H_t\left(1-\frac{1}{2N_e}\right),
$$

where $H_t$ is expected heterozygosity (dimensionless), $t$ is measured in
generations, and $N_e$ is effective breeding population size in individuals.
A small $N_e$ accelerates diversity loss. Mutation, migration, selection,
linkage, demographic structure, and non-diploid inheritance change this null;
the equation does not say that every genetic variant is useful
([Nei, Maruyama, and Chakraborty 1975](https://doi.org/10.1111/j.1558-5646.1975.tb00807.x)).

### Selection accounting

The Price identity can be written

$$
\Delta\bar z =
\frac{\operatorname{Cov}(w_i,z_i)}{\bar w}
+
\frac{\mathbb{E}[w_i\Delta z_i]}{\bar w},
$$

where $z_i$ is a trait, $\bar z$ is its population mean, $\Delta\bar z$ is
mean change per generation, $w_i$ is descendants per parent (dimensionless),
$\bar w$ is mean reproductive success, and $\Delta z_i$ is transmission
change in the trait's units. Partitioning covariance between and within groups
can reveal opposing levels of selection. The identity is an accounting
relation, not a causal model; the definition of groups, descendants, and the
observation window must be fixed before interpretation
([Price 1970](https://doi.org/10.1038/227520a0)).

Hamilton's scoped inequality,

$$
r b > c,
$$

compares a social effect $b$ and actor cost $c$ in the same expected-fitness
units, weighted by relatedness regression $r$ (dimensionless). It is not a
universal scalar controller, and relatedness does not replace mechanism,
ecology, or enforcement ([Hamilton 1964](https://doi.org/10.1016/0022-5193(64)90038-4)).

### Diversity and extinction null

A minimal birth–death description is

$$
\frac{dD}{dt}=(\lambda-\mu)D, \qquad D^{+}=sD^{-},
$$

where $D$ is lineage count, $D^{-}$ and $D^{+}$ are counts immediately before
and after the pulse, $\lambda$ and $\mu$ are origination and extinction rates
in lineage$^{-1}$ Myr$^{-1}$, and the pulse survival fraction $s\in[0,1]$ is
dimensionless. It is useful as a null, but it omits abundance,
ecological function, trait distributions, interactions, geography, and
sampling. A diversity-dependent example such as
$\lambda(D)=\lambda_0(1-D/K)$ is an optional hypothesis, not a general law of
radiations.

### Observation null

With homogeneous Poisson preservation rate $q$ in
occurrences lineage$^{-1}$ Myr$^{-1}$,

$$
P(\text{no occurrence in }\Delta)=e^{-q\Delta},\qquad
p_{\mathrm{detect}}(T)=1-e^{-qT}.
$$

Real $q$ varies with taxon, environment, time, rock exposure, collection, and
taxonomy. More generally,

$$
y(t)=\int K(t-u)x(u)\,du+\epsilon(t),
$$

where $t$ and $u$ are in Myr, $x$ is latent biological history in the chosen
state units, $K$ is a preservation-and-binning kernel in Myr$^{-1}$, $y$ is
observed occurrence intensity, and $\epsilon$ is measurement and
classification error in the same units as $y$. Inference about transition
duration or lead time is invalid if $K$ is silently treated as a delta
function.

## 1. Bottlenecks: diversity loss is not conflict control

**Observation.** Classical population-genetic analysis predicts rapid loss of
heterozygosity under severe demographic contraction, with outcomes depending
on duration, recovery, and reproductive system ([Nei et al. 1975](https://doi.org/10.1111/j.1558-5646.1975.tb00807.x)).
By contrast, an obligate unicellular propagule can make cells within a new
multicellular individual clonal, raising relatedness and aligning inheritance.
In experimental *Chlamydomonas*, one of ten selected populations evolved an
alternating multicellular/unicellular life cycle after approximately 315
generations; the single-cell phase maximized fecundity in the observed setting,
where within-cluster conflict was not the demonstrated cause
([Ratcliff et al. 2013](https://doi.org/10.1038/ncomms3742)).

**Translation and efficiency hypothesis.** A system may periodically create a
versioned, reproducible child configuration from a narrow, validated state and
then permit within-lifetime specialization. The possible advantage is clean
attribution and reduced inheritance of parasitic local adaptations—not generic
compression.

**Evidence status.** Established for the scoped population-genetic null and
the reported algal experiment; plausible but untested as an AI systems
mechanism.

**Failure boundary.** A narrow founder loses minority capabilities, creates
correlated failure, and can amplify founder defects. Cloning checkpoints,
reproducible builds, ensemble resampling, or capability isolation may deliver
the same benefit more safely. Historical origin and later conflict-control
function must not be conflated.

**Measurable prediction.** Under repeated specialization and reproduction, a
validated single-founder lifecycle should reduce within-lineage sabotage and
inheritance variance at equal compute, while maintaining task diversity better
than simple truncation selection. If ordinary versioning plus diversity
preservation dominates, no transition-specific mechanism is warranted.

## 2. Mass extinction and recovery: destructive filter, vector outcome

**Observation.** Raup and Sepkoski's family-level compilation found four
statistically distinct marine extinction events in their data and treated a
Devonian candidate as non-significant; the later “Big Five” shorthand should
not be mistaken for a universal numerical threshold
([Raup and Sepkoski 1982](https://doi.org/10.1126/science.215.4539.1501)).
Kirchner and Weil reported an approximately 10 Myr cross-correlation lag from
extinction peaks to origination peaks, including after removing the largest
events ([Kirchner and Weil 2000](https://doi.org/10.1038/35004564)). A later,
sampling-standardized genus analysis instead found very high origination in the
interval immediately following the most rapid mass extinctions and showed how
range methods can smear rates backward or forward ([Alroy 2008](https://doi.org/10.1073/pnas.0802597105)).
These are method- and bin-dependent results, not contradictory universal
clocks. Surviving a pulse also does not guarantee later recovery or
diversification: “dead clades walking” can persist briefly and disappear
([Jablonski 2002](https://doi.org/10.1073/pnas.102163299)).

**Translation and efficiency hypothesis.** The defensible analogue is not
catastrophic culling. It is post-failure accounting that separately tracks
survival, service restoration, capability richness, functional coverage,
abundance/load share, and long-run evolvability.

**Evidence status.** Established fossil patterns within their datasets and
estimators; disputed as a single fixed recovery lag; speculative as a training
intervention.

**Failure boundary.** Deliberately deleting models, data, or capabilities can
erase rare functions and produce irrecoverable path dependence. Apparent rapid
recovery can be caused by coarse time bins, range-through assumptions, or high
origination estimates under changing sampling. Never report a scalar
“recovered” state without the vector and observation contract.

**Measurable prediction.** If shock-driven restructuring has value, it must
beat reversible pruning, checkpoint rollback, structured dropout, and
population-based training on a preregistered recovery vector at identical
training energy and wall time. Otherwise the extinction analogy is rejected.

## 3. Adaptive radiation: opportunity, constraints, and contingency

**Observation.** Greater Antillean *Anolis* radiations independently produced
similar habitat-associated ecomorph sets on four islands, providing evidence
for repeated convergence within a bounded ecological and morphological system
([Losos et al. 1998](https://doi.org/10.1126/science.279.5359.2115)). It does not
show that evolutionary outcomes are generally deterministic. Fossil analyses
also show that diversity limits and the relative prominence of large marine
groups can shift idiosyncratically through time rather than converge on one
fixed carrying capacity ([Alroy 2010](https://doi.org/10.1126/science.1189910)).

**Translation and efficiency hypothesis.** Generate protected variants only
when they experience distinct tasks, resources, or interaction niches, then
measure both specialization and retained interchangeability. The mechanism is
ecology-conditioned `P-004`, not diversity for its own sake.

**Evidence status.** Established comparative convergence in the *Anolis*
system; plausible general dependence on opportunity and constraint;
speculative engineering benefit beyond standard population-based search,
quality-diversity optimization, or mixture-of-experts routing.

**Failure boundary.** Empty parameter slots are not ecological opportunity.
Shared training data and objectives can make variants strongly correlated;
competition can eliminate rare but valuable functions; specialization can
increase interfaces and reduce graceful fallback.

**Measurable prediction.** Niche-conditioned populations should improve
coverage of a held-out capability matrix and failure diversity at matched
energy, parameter count, and samples. A benefit that disappears against a
standard diversity regularizer or router is not evidence for a new principle.

## 4. Symbiogenesis: acquisition is not integration

**Observation.** The endosymbiotic account of mitochondria and plastids was
developed in modern form by Sagan/Margulis, although not every proposed
symbiotic origin in that paper is now accepted
([Sagan 1967](https://doi.org/10.1016/0022-5193(67)90079-3)). Comparative
genomics linked the mitochondrial lineage with alphaproteobacteria
([Andersson et al. 1998](https://doi.org/10.1038/24094)). Competing detailed
scenarios remain hypotheses; for example, the hydrogen hypothesis explicitly
proposes a metabolic dependency between host and symbiont
([Martin and Müller 1998](https://doi.org/10.1038/32096)). Experimental tobacco
lines have shown high-frequency transfer of chloroplast DNA to the nucleus,
demonstrating an integration route without showing that every transfer is
functional or adaptive ([Stegemann et al. 2003](https://doi.org/10.1073/pnas.1430924100)).

**Translation and efficiency hypothesis.** Acquire a previously autonomous
capability, then progressively establish a narrow transport interface,
compatible lifecycle, shared provenance, replication control, and an escape or
replacement path. Efficiency could arise when a costly capability is reused
without being reimplemented, but dependency management is the central cost.

**Evidence status.** Established for the core bacterial ancestry of
mitochondria and plastids and experimentally observed organelle-to-nucleus DNA
transfer; disputed for some detailed origin sequences; speculative for AI.

**Failure boundary.** Persistent composition can remain parasitic, unstable,
or mutually destructive. Centralizing control can make the acquired component
irreversible and non-replaceable. A clean API, plugin, distillation, model
merge, or retrieval service is the strongest null and should be preferred when
it achieves equivalent capability and efficiency.

**Measurable prediction.** A staged integration protocol should reduce total
training energy and duplicate state while meeting dependency, rollback,
security, and fault-containment targets better than conventional composition.
Without those gains, “symbiogenesis” is only metaphor.

## 5. Multicellularity and division of labor

**Observation.** Settling selection in yeast produced clonal “snowflake”
clusters with multicellular propagules, a juvenile phase, and increased
apoptosis associated with greater propagule production
([Ratcliff et al. 2012](https://doi.org/10.1073/pnas.1115323109)). The experiment
shows that simple multicellular traits can evolve rapidly under strong
selection; it does not recreate complex organismal individuality. In the
choanoflagellate *Salpingoeca rosetta*, a bacterial sulfonolipid triggered an
extant rosette-development program, showing environmental control of a
multicellular phenotype rather than the historical origin of animals
([Alegado et al. 2012](https://doi.org/10.7554/eLife.00013)). Theory on the
unicellular-to-multicellular transition emphasizes fitness transfer and
germ–soma specialization, with conflict mediation required when cell- and
organism-level interests diverge ([Michod 2007](https://doi.org/10.1073/pnas.0701489104)).

**Translation and efficiency hypothesis.** A persistent system can permit
modules to specialize in mutually exclusive roles when the joint lifecycle
reproduces reliable higher-level behavior and coordination cost is lower than
duplicating every capability. This is more demanding than conditional routing:
the collective needs versioned heredity, credit assignment, failure
containment, and regeneration rules.

**Evidence status.** Established for the laboratory systems; plausible as a
general transition framework; speculative as an efficiency architecture.

**Failure boundary.** Division of labor loses redundancy, introduces interface
fragility, and can create reproductive or control monopolies. Fast aggregation
does not establish individuality. A modular monolith or routed ensemble may be
cheaper, more inspectable, and easier to replace.

**Measurable prediction.** Under repeated tasks and component turnover,
specialized collectives should improve joules per successful episode while
retaining recovery after removal of a specialist. Measure interface traffic,
replicated state, regeneration time, correlated failure, and performance—not
only average accuracy.

## 6. Cooperation, policing, and a change in selection level

**Observation.** Theory shows that mutual policing can repress within-group
competition and make cooperation more favorable, but policing itself has costs
and depends on how groups form and reproduce
([Frank 1995](https://doi.org/10.1038/377520a0)). Relatedness and single-cell
development can reduce internal conflict in “fraternal” transitions, yet no
single relatedness condition is sufficient across all major transitions
([Queller 2000](https://doi.org/10.1098/rstb.2000.0727)). The classic synthesis
of major transitions focuses on changes in information transmission and on
formerly independent replicators becoming parts of a larger unit; it does not
establish an inevitable trend toward complexity
([Szathmáry and Maynard Smith 1995](https://doi.org/10.1038/374227a0)).

**Translation and efficiency hypothesis.** Define the candidate higher-level
unit, its reproduction event, inherited state, performance measure, and
within-unit defectors before claiming a transition. Add the least costly
conflict controls—lineage restriction, audit, resource budgets, sanctions, or
reproductive separation—and test whether higher-level selection is measurable.

**Evidence status.** Established mathematical and evolutionary framework;
implementation-specific mechanisms are plausible; AI efficiency gains are
speculative.

**Failure boundary.** Policing consumes resources, can falsely punish useful
deviation, and can itself become a controlling parasite. High relatedness also
creates correlated vulnerability. If a normal permission system and unit tests
give the same safety–efficiency frontier, the biological framing adds no
mechanism.

**Measurable prediction.** In a population of cooperating modules with
individually rewarded shortcuts, explicit conflict control should raise
between-collective heritable performance more than it suppresses productive
within-collective variation. Report the Price partition and enforcement cost;
do not infer the selection level from aggregate reward alone.

## 7. Exaptation: keep origin separate from current utility

**Observation.** Gould and Vrba introduced “exaptation” to distinguish a
character's historical genesis from its current useful role
([Gould and Vrba 1982](https://doi.org/10.1017/S0094837300004310)). In the
long-term *E. coli* experiment, aerobic citrate use arose through a promoter-
capture rearrangement in a lineage made permissive by earlier mutations,
providing a concrete case of co-option and historical contingency in one
population ([Blount et al. 2012](https://doi.org/10.1038/nature11514)). It does
not estimate a universal rate or advantage of exaptation.

**Translation and efficiency hypothesis.** Preserve searchable provenance and
behavioral descriptors for modules so a capability selected for one task can
be evaluated cheaply for another. The gain would come from reuse and reduced
new training.

**Evidence status.** Established conceptual distinction and scoped
experimental case; plausible tooling recommendation; speculative claim that an
explicit exaptation search beats transfer learning, library retrieval, model
merging, or architecture search.

**Failure boundary.** Calling a successful reuse “exaptation” after the fact
has no predictive value. Broad behavioral indexing and retesting can cost more
than targeted training, and hidden coupling to the original context can cause
silent failure.

**Measurable prediction.** A provenance-aware reuse index must find useful
cross-task components with lower search-plus-validation energy and equal
reliability than semantic retrieval and standard transfer baselines. Successes
must be counted against all candidates searched.

## 8. Developmental constraint and accessible search space

**Observation.** Maynard Smith and colleagues defined developmental constraints
as biases or limits on possible phenotypic variation caused by developmental
organization and emphasized the difficulty of separating developmental from
selective explanations ([Maynard Smith et al. 1985](https://doi.org/10.1086/414425)).
Raup's theoretical shell morphospace generated possible coiling geometries and
made unoccupied regions visible, but absence alone cannot distinguish
developmental infeasibility, poor function, historical path dependence, or
sampling ([Raup 1966](https://doi.org/10.2307/1301992)).

**Translation and efficiency hypothesis.** Encode generative constraints that
make valid, composable architectures easy to reach and invalid ones difficult,
while retaining explicit escape mutations. Efficiency may come from avoiding
unproductive regions rather than searching them and pruning afterward.

**Evidence status.** Established as an evolutionary concept and theoretical
morphospace method; plausible as constrained architecture search; speculative
that biologically patterned constraints outperform ordinary typing,
regularization, grammars, or priors.

**Failure boundary.** A prior can permanently exclude the eventual optimum.
Observed absence is not evidence of impossibility. Constraints need measured
coverage, violation cost, and escape behavior, not aesthetic resemblance to
development.

**Measurable prediction.** At equal evaluations and energy, a constrained
generator should increase valid-sample yield and final Pareto coverage without
reducing out-of-distribution architectural novelty. Compare against typed
search spaces, regularization, and learned proposal distributions.

## 9. Incomplete fossil observation

**Observation.** Foote and Raup estimated preservation completeness from gaps
and ranges for several fossil groups, obtaining high but group- and scale-
dependent values; those estimates are not universal constants
([Foote and Raup 1996](https://doi.org/10.1017/S0094837300016134)). Marshall
derived range confidence intervals while relaxing fully random fossil-horizon
placement, but the method still requires assumptions about gap distributions
and sufficiently rich records
([Marshall 1994](https://doi.org/10.1017/S0094837300012938)). Rock-area and
fossil-occurrence patterns covary, so geological availability and biology must
be modeled jointly rather than assuming either pure artifact or pure signal
([Peters and Foote 2002](https://doi.org/10.1038/416420a)). Sampling-
standardized occurrence analysis can materially change inferred origination
and extinction dynamics ([Alroy 2008](https://doi.org/10.1073/pnas.0802597105)).

**Translation and efficiency hypothesis.** Any historical telemetry pipeline
should version the latent-state hypothesis, sensor/collection process,
taxonomic or schema mapping, detection probability, temporal kernel, missing-
not-at-random assumptions, and uncertainty. This directly exercises
[candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

**Evidence status.** Established methodological limitation; plausible general
observation-contract requirement; no evidence that fossil-style inference is
itself an efficient AI architecture.

**Failure boundary.** Confidence intervals are conditional on their sampling
model. More sophisticated correction can add model error, and no correction
recovers information never preserved. Candidate 003 must abstain when an
abrupt transition, sparse sampling, time averaging, or changing observation
kernel destroys prospective lead-time identifiability.

**Measurable prediction.** On simulated latent histories with known
preservation kernels and on real telemetry downsampled under controlled
missingness, explicit observation contracts should improve calibration and
transition-time coverage over naive range endpoints. They fail if nominal
coverage is not achieved under preregistered kernel misspecification tests.

## Applicability map

| Candidate domain | Potentially useful transfer | Required instrumentation | Do not infer |
| --- | --- | --- | --- |
| continual model lineages | reproducible propagules, inherited-state accounting | lineage graph, retained capability matrix, founder-loss metrics | a narrow bottleneck is automatically beneficial |
| modular multi-agent systems | higher-level selection and conflict-cost partition | per-module and collective reward, enforcement energy, heritability | cooperation alone creates individuality |
| capability composition | staged partner integration and dependency control | interface traffic, provenance, rollback, replacement time | every useful plugin is symbiogenesis |
| population/search systems | niche-conditioned variation | niche occupancy, failure correlation, energy, novelty coverage | more variants imply radiation |
| reuse and transfer | provenance-aware co-option search | search denominator, validation cost, original/current task records | post-hoc reuse predicts future reuse |
| architecture generation | constrained valid search with escape paths | valid-yield, Pareto coverage, excluded-region probes | empty search regions are impossible |
| sparse historical telemetry | observation-kernel-aware inference | detection model, schema history, interval uncertainty | observed endpoints are true endpoints |
| regime-shift monitoring | abstention under poor temporal identifiability | prospective timestamps, kernel stability, lead-time distribution | retrospective fossil pulses validate early warning |

## Equal-budget falsification program

Every comparison fixes or reports training energy (J), inference energy per
episode (J), accelerator model and count, wall time (s), samples, parameter and
resident-memory budget (bytes), and human intervention. Accuracy-only wins do
not establish efficiency.

| Test | Candidate | Strongest nulls | Preregistered success condition | Decisive failure |
| --- | --- | --- | --- | --- |
| PALEO-E01 | validated reproductive reset between specialization cycles | checkpoint/versioning, ensemble resampling, truncation selection, capability isolation | lower inherited defect rate and equal capability coverage at matched joules | diversity loss or founder failures erase governance gain |
| PALEO-E02 | conflict-bounded higher-level collective | ordinary modules plus permissions/tests, mixture-of-experts, ensemble selection | positive between-collective selection after enforcement cost, with stable heredity | aggregate reward rises but within-unit shortcuts or policing cost dominate |
| PALEO-E03 | staged symbiogenic integration | clean API/plugin, retrieval service, distillation, model merge | less duplicated compute/state with equal rollback, security, and replacement | irreversible dependency or interface burden exceeds reuse gain |
| PALEO-E04 | niche-conditioned “radiation” | population-based training, quality-diversity, diversity regularization, routed experts | greater capability/failure-diversity Pareto coverage at equal evaluations | correlated variants or niche bookkeeping provides no frontier gain |
| PALEO-E05 | provenance-aware exaptation search | transfer learning, semantic component retrieval, architecture search | lower search-plus-validation joules per accepted cross-task reuse | advantage disappears when unsuccessful searches are included |
| PALEO-E06 | developmental search constraints with explicit escape | typed search, learned proposals, regularization, unconstrained search | higher valid yield without lower held-out novelty or best Pareto result | prior excludes recoverable optima or escape cost dominates |
| PALEO-E07 | observation-contract transition inference | calibrated state-space model without paleontological framing, candidate 014 baseline | better calibration and transition-time interval coverage under fixed missingness | gains vanish under realistic kernel change or no prospective lead time exists |

## Temporary claims for ledger review

These identifiers are audit-local and must not be cited as promoted claims.

| ID | Status | Scoped statement | Disposition |
| --- | --- | --- | --- |
| PALEO-T01 | established | Under the stated neutral finite-population assumptions, smaller $N_e$ accelerates expected heterozygosity loss. | reference for bottleneck null |
| PALEO-T02 | established | Ratcliff et al. observed an alternating life cycle in one of ten selected *Chlamydomonas* populations by about 315 generations. | preserve replicate count and historical-origin caveat |
| PALEO-T03 | plausible | A narrow reproductive propagule can align higher-level heredity by raising within-unit relatedness. | deduplicate into `P-004`/`P-012`; test E01 |
| PALEO-T04 | speculative | Reproductive resets improve continual AI lineages beyond versioning and capability isolation. | hold pending E01 |
| PALEO-T05 | established | Fossil survival, taxonomic recovery, and later diversification need not coincide. | add only with recovery vector |
| PALEO-T06 | disputed | Origination generally peaks about 10 Myr after extinction. | reject as universal; estimator/bin dependent |
| PALEO-T07 | speculative | Destructive population shocks improve training efficiency. | reject absent reversible-baseline win in E02/E04 |
| PALEO-T08 | established | Replicated *Anolis* radiations show convergence within a constrained island system. | do not generalize to deterministic evolution |
| PALEO-T09 | plausible | Distinct ecological/task niches can protect useful specialization. | already `P-004` plus ecology; test E04 |
| PALEO-T10 | established | Core mitochondrial ancestry is bacterial, and organelle DNA can transfer to the nucleus. | evidence for acquisition and integration, not exact origin sequence |
| PALEO-T11 | speculative | Staged capability integration beats conventional software and model composition. | hold pending E03 |
| PALEO-T12 | established | Strong settling selection produced simple clonal multicellular yeast traits and propagule-associated apoptosis. | scoped laboratory result |
| PALEO-T13 | plausible | Higher-level individuality needs heritable variation in collective fitness plus adequate conflict control. | synthesis of selection literature; no new `P-` yet |
| PALEO-T14 | speculative | Policing yields a net AI efficiency gain over permissions and testing. | hold pending E02 |
| PALEO-T15 | established | Exaptation separates historical origin from current utility. | terminology guardrail |
| PALEO-T16 | plausible | Provenance-aware component search can make useful co-option cheaper to find. | hold pending E05 |
| PALEO-T17 | established | Observed morphospace absence does not alone identify developmental constraint. | evaluation guardrail |
| PALEO-T18 | plausible | Generative constraints can improve valid-search yield but risk excluding optima. | test E06; nearest ordinary search priors |
| PALEO-T19 | established | Fossil ranges and rates depend on preservation, rock availability, collection, taxonomy, and estimator. | route to candidate 014 |
| PALEO-T20 | speculative | Retrospective fossil dynamics validate prospective transition warnings. | reject; candidate 003 must test lead time and abstention |

## Research disposition

**Promote now:** no new stable principle. Promote the distinctions between
demographic and reproductive bottlenecks, survival and recovery, acquisition
and integration, aggregation and individuality, and historical origin and
current utility as review guardrails.

**Hold as an integration hypothesis:** **conflict-bounded unit transition**—a
higher-level unit becomes an engineering-relevant selection target only when
its lifecycle supplies reproducible inheritance, measurable heritable
variation in collective performance, and conflict controls whose cost does not
erase the joint gain. Review after PALEO-E01 and PALEO-E02; deduplicate against
`P-004`, `P-008`, `P-009`, and `P-012` before any promotion.

**Route elsewhere:** observation-kernel work to candidate 014; prospective
regime-warning questions to candidate 003; niche diversity to `P-004` and the
collective/ecological audit; compartment and autocatalysis questions to the
chemistry audit.

**Reject as unsupported prescriptions:** mass extinction as optimization,
fixed recovery times, fixed pruning/extinction percentages, automatic progress
toward complexity, “one cell = one model,” “organelle = plugin,” and claims that
the fossil record directly reveals exact transition timing.

## Audit-local bibliography

```bibtex
@article{Alegado2012Rosette,
  author  = {Alegado, Rosanna A. and Brown, Laura W. and Cao, Shugeng and Dermenjian, Renee K. and Zuzow, Richard and Fairclough, Stephen R. and Clardy, Jon and King, Nicole},
  title   = {A Bacterial Sulfonolipid Triggers Multicellular Development in the Closest Living Relatives of Animals},
  journal = {eLife},
  year    = {2012},
  volume  = {1},
  pages   = {e00013},
  doi     = {10.7554/eLife.00013}
}

@article{Alroy2008Dynamics,
  author  = {Alroy, John},
  title   = {Dynamics of Origination and Extinction in the Marine Fossil Record},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2008},
  volume  = {105},
  number  = {Supplement 1},
  pages   = {11536--11542},
  doi     = {10.1073/pnas.0802597105}
}

@article{Alroy2010Shifting,
  author  = {Alroy, John},
  title   = {The Shifting Balance of Diversity Among Major Marine Animal Groups},
  journal = {Science},
  year    = {2010},
  volume  = {329},
  number  = {5996},
  pages   = {1191--1194},
  doi     = {10.1126/science.1189910}
}

@article{Andersson1998Rickettsia,
  author  = {Andersson, Siv G. E. and Zomorodipour, Alireza and Andersson, Jan O. and Sicheritz-Pont{\'e}n, Thomas and Alsmark, U. Cecilia M. and Podowski, Raf M. and N{\"a}slund, A. Kristina and Eriksson, Ann-Sofie and Winkler, Herbert H. and Kurland, Charles G.},
  title   = {The Genome Sequence of Rickettsia prowazekii and the Origin of Mitochondria},
  journal = {Nature},
  year    = {1998},
  volume  = {396},
  pages   = {133--140},
  doi     = {10.1038/24094}
}

@article{Blount2012Citrate,
  author  = {Blount, Zachary D. and Barrick, Jeffrey E. and Davidson, Christopher J. and Lenski, Richard E.},
  title   = {Genomic Analysis of a Key Innovation in an Experimental Escherichia coli Population},
  journal = {Nature},
  year    = {2012},
  volume  = {489},
  pages   = {513--518},
  doi     = {10.1038/nature11514}
}

@article{FooteRaup1996Preservation,
  author  = {Foote, Michael and Raup, David M.},
  title   = {Fossil Preservation and the Stratigraphic Ranges of Taxa},
  journal = {Paleobiology},
  year    = {1996},
  volume  = {22},
  number  = {2},
  pages   = {121--140},
  doi     = {10.1017/S0094837300016134}
}

@article{Frank1995Policing,
  author  = {Frank, Steven A.},
  title   = {Mutual Policing and Repression of Competition in the Evolution of Cooperative Groups},
  journal = {Nature},
  year    = {1995},
  volume  = {377},
  pages   = {520--522},
  doi     = {10.1038/377520a0}
}

@article{GouldVrba1982Exaptation,
  author  = {Gould, Stephen Jay and Vrba, Elisabeth S.},
  title   = {Exaptation---A Missing Term in the Science of Form},
  journal = {Paleobiology},
  year    = {1982},
  volume  = {8},
  number  = {1},
  pages   = {4--15},
  doi     = {10.1017/S0094837300004310}
}

@article{Hamilton1964Social,
  author  = {Hamilton, W. D.},
  title   = {The Genetical Evolution of Social Behaviour. I},
  journal = {Journal of Theoretical Biology},
  year    = {1964},
  volume  = {7},
  number  = {1},
  pages   = {1--16},
  doi     = {10.1016/0022-5193(64)90038-4}
}

@article{Jablonski2002Survival,
  author  = {Jablonski, David},
  title   = {Survival without Recovery after Mass Extinctions},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2002},
  volume  = {99},
  number  = {12},
  pages   = {8139--8144},
  doi     = {10.1073/pnas.102163299}
}

@article{KirchnerWeil2000Recovery,
  author  = {Kirchner, James W. and Weil, Anne},
  title   = {Delayed Biological Recovery from Extinctions throughout the Fossil Record},
  journal = {Nature},
  year    = {2000},
  volume  = {404},
  pages   = {177--180},
  doi     = {10.1038/35004564}
}

@article{Losos1998Radiations,
  author  = {Losos, Jonathan B. and Jackman, Todd R. and Larson, Allan and de Queiroz, Kevin and Rodr{\'i}guez-Schettino, Lourdes},
  title   = {Contingency and Determinism in Replicated Adaptive Radiations of Island Lizards},
  journal = {Science},
  year    = {1998},
  volume  = {279},
  number  = {5359},
  pages   = {2115--2118},
  doi     = {10.1126/science.279.5359.2115}
}

@article{Marshall1994Ranges,
  author  = {Marshall, Charles R.},
  title   = {Confidence Intervals on Stratigraphic Ranges: Partial Relaxation of the Assumption of Randomly Distributed Fossil Horizons},
  journal = {Paleobiology},
  year    = {1994},
  volume  = {20},
  number  = {4},
  pages   = {459--469},
  doi     = {10.1017/S0094837300012938}
}

@article{MartinMueller1998Hydrogen,
  author  = {Martin, William and M{\"u}ller, Mikl{\'o}s},
  title   = {The Hydrogen Hypothesis for the First Eukaryote},
  journal = {Nature},
  year    = {1998},
  volume  = {392},
  pages   = {37--41},
  doi     = {10.1038/32096}
}

@article{MaynardSmith1985Constraints,
  author  = {Maynard Smith, J. and Burian, R. and Kauffman, S. and Alberch, P. and Campbell, J. and Goodwin, B. and Lande, R. and Raup, D. and Wolpert, L.},
  title   = {Developmental Constraints and Evolution: A Perspective from the Mountain Lake Conference on Development and Evolution},
  journal = {The Quarterly Review of Biology},
  year    = {1985},
  volume  = {60},
  number  = {3},
  pages   = {265--287},
  doi     = {10.1086/414425}
}

@article{Michod2007Individuality,
  author  = {Michod, Richard E.},
  title   = {Evolution of Individuality during the Transition from Unicellular to Multicellular Life},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2007},
  volume  = {104},
  number  = {Supplement 1},
  pages   = {8613--8618},
  doi     = {10.1073/pnas.0701489104}
}

@article{Nei1975Bottleneck,
  author  = {Nei, Masatoshi and Maruyama, Takeo and Chakraborty, Ranajit},
  title   = {The Bottleneck Effect and Genetic Variability in Populations},
  journal = {Evolution},
  year    = {1975},
  volume  = {29},
  number  = {1},
  pages   = {1--10},
  doi     = {10.1111/j.1558-5646.1975.tb00807.x}
}

@article{PetersFoote2002Extinction,
  author  = {Peters, Shanan E. and Foote, Michael},
  title   = {Determinants of Extinction in the Fossil Record},
  journal = {Nature},
  year    = {2002},
  volume  = {416},
  pages   = {420--424},
  doi     = {10.1038/416420a}
}

@article{Price1970Selection,
  author  = {Price, George R.},
  title   = {Selection and Covariance},
  journal = {Nature},
  year    = {1970},
  volume  = {227},
  pages   = {520--521},
  doi     = {10.1038/227520a0}
}

@article{Queller2000Relatedness,
  author  = {Queller, David C.},
  title   = {Relatedness and the Fraternal Major Transitions},
  journal = {Philosophical Transactions of the Royal Society B: Biological Sciences},
  year    = {2000},
  volume  = {355},
  number  = {1403},
  pages   = {1647--1655},
  doi     = {10.1098/rstb.2000.0727}
}

@article{Ratcliff2012Multicellularity,
  author  = {Ratcliff, William C. and Denison, R. Ford and Borrello, Mark and Travisano, Michael},
  title   = {Experimental Evolution of Multicellularity},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2012},
  volume  = {109},
  number  = {5},
  pages   = {1595--1600},
  doi     = {10.1073/pnas.1115323109}
}

@article{Ratcliff2013LifeCycle,
  author  = {Ratcliff, William C. and Herron, Matthew D. and Howell, Kathryn and Pentz, Jennifer T. and Rosenzweig, Frank and Travisano, Michael},
  title   = {Experimental Evolution of an Alternating Uni- and Multicellular Life Cycle in Chlamydomonas reinhardtii},
  journal = {Nature Communications},
  year    = {2013},
  volume  = {4},
  pages   = {2742},
  doi     = {10.1038/ncomms3742}
}

@article{Raup1966Morphospace,
  author  = {Raup, David M.},
  title   = {Geometric Analysis of Shell Coiling: General Problems},
  journal = {Journal of Paleontology},
  year    = {1966},
  volume  = {40},
  number  = {5},
  pages   = {1178--1190},
  doi     = {10.2307/1301992}
}

@article{RaupSepkoski1982Extinctions,
  author  = {Raup, David M. and Sepkoski, J. John},
  title   = {Mass Extinctions in the Marine Fossil Record},
  journal = {Science},
  year    = {1982},
  volume  = {215},
  number  = {4539},
  pages   = {1501--1503},
  doi     = {10.1126/science.215.4539.1501}
}

@article{Sagan1967Mitosing,
  author  = {Sagan, Lynn},
  title   = {On the Origin of Mitosing Cells},
  journal = {Journal of Theoretical Biology},
  year    = {1967},
  volume  = {14},
  number  = {3},
  pages   = {225--274},
  doi     = {10.1016/0022-5193(67)90079-3}
}

@article{Stegemann2003GeneTransfer,
  author  = {Stegemann, Sandra and Hartmann, Sonja and Ruf, Stephanie and Bock, Ralph},
  title   = {High-Frequency Gene Transfer from the Chloroplast Genome to the Nucleus},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2003},
  volume  = {100},
  number  = {15},
  pages   = {8828--8833},
  doi     = {10.1073/pnas.1430924100}
}

@article{SzathmaryMaynardSmith1995Transitions,
  author  = {Szathm{\'a}ry, E{\"o}rs and Maynard Smith, John},
  title   = {The Major Evolutionary Transitions},
  journal = {Nature},
  year    = {1995},
  volume  = {374},
  pages   = {227--232},
  doi     = {10.1038/374227a0}
}
```

# Developmental biology and morphogenesis: signals, competence, and lifecycle audit

<!-- markdownlint-disable MD013 -->

**Date:** 2026-08-05

**Status:** breadth-first primary-source audit. The C-DEV-* identifiers in
this file are temporary and are not additions to the shared claim ledger.

**Scope:** positional information, morphogen interpretation, lateral
inhibition, segmentation, lineage commitment, competence windows,
apoptosis-based sculpting, regeneration, metamorphosis, canalization, and
developmental plasticity.

**Purpose:** identify transferable control mechanisms without treating an
embryo as a cost-free blueprint, a developmental phenotype as proof of current
adaptation, or a necessary component as evidence of evolutionary origin.

## Executive finding

Development is not the execution of a complete geometric drawing. It is a
resource-consuming, path-dependent process in which spatial and temporal
signals are interpreted through local receptor, transcriptional, chromatin,
mechanical, and lineage state. The same extracellular signal can produce
different outcomes in different tissues or times; neighboring cells can
amplify small differences into distinct fates; oscillation can be converted
into repeated spatial boundaries; and differentiated states can be stabilized,
redirected, or experimentally reprogrammed.

Three separations are mandatory:

1. **Signal versus competence.** A morphogen or hormone is not a full command.
   Response depends on what the receiver can currently decode and execute.
2. **Specification versus implementation.** Fate markers and boundaries are
   not the completed tissue. Growth, migration, extracellular matrix,
   apoptosis, clearance, remodeling, and validation consume time and matter.
3. **Current mechanism versus evolutionary origin.** Knockout, inhibition,
   rescue, transplantation, or ectopic expression can establish a present
   causal role. It does not establish why the mechanism evolved, whether the
   phenotype is adaptive, or which historical sequence produced it.

No new stable project principle survives deduplication. Positional and temporal
gating map to
[P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation),
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback), and the
held multiscale-context mechanism in
[Candidate 002](../../experiments/candidates/002-multiscale-context-broadcast.md).
Fate diversification, commitment, and pruning map to
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection).
Boundary formation and structural consolidation map to
[P-008](../principle-registry.md#p-008--compartmentalized-interaction) and
[P-010](../principle-registry.md#p-010--structural-offloading-and-co-design).
Regeneration maps to [P-009](../principle-registry.md#p-009--maintenance-plane)
and the existing constraint-guided repair work. Developmental robustness is a
system property to test, not a license to operate at one alleged optimal
critical point.

One audit-local composition is held only as an experimental fixture:

> A low-bandwidth spatial or temporal signal is decoded by versioned local
> competence state; a transition is admitted only inside a measured window;
> commitment narrows future actions; structural writes are validated; and
> reopening requires an explicit trigger, resource budget, and rollback path.

This is a composition of P-002/P-003/P-004/P-006/P-008/P-009/P-010 and
Candidates 002, 006, 009, 010, and 014. It is not Candidate 021.

## Evidence discipline

### Observation, perturbation, and origin

| Evidence form | What it can establish | What it cannot establish alone |
| --- | --- | --- |
| spatial expression or fate map | association, ordering, candidate source/response domains | necessity, sufficiency, or direction of causation |
| loss of function | necessity in the studied background, stage, and assay | sufficiency, directness, uniqueness, or evolutionary origin |
| ectopic expression or ligand addition | sufficiency within the exposed competent tissue | normal endogenous role, normal dose, or safety |
| rescue | specificity of a perturbation and a route to restored phenotype | completeness of the mechanism or generality |
| lineage tracing | descendants under the label and observation window | all potential fates, unlabeled contributions, or causal control |
| transplantation or tissue recombination | context dependence and some autonomous/nonautonomous effects | unperturbed physiology or historical origin |
| comparative or selection experiment | possible evolutionary association or response | current developmental necessity unless separately perturbed |

The words "for," "designed to," and "evolved to" are excluded unless a
selection, comparative, or phylogenetic argument supports them. A phenotype
that is stable, common, or inducible is not automatically beneficial.

### Prior-project nulls

This audit deduplicates against:

- [neurodevelopment and global control](2026-08-05-neurodevelopment-global-control.md),
  which already owns activity-dependent pruning, critical-period brakes, and
  low-bandwidth context signals;
- [cellular quality control](2026-08-05-cellular-quality-control.md), which
  owns sensing, isolation, repair, replacement, and turnover;
- [adaptive materials and self-assembly](2026-08-05-adaptive-materials-and-self-assembly.md),
  which owns reaction–diffusion, physical patterning, morphological
  computation, and lifecycle substrate accounting;
- [fault tolerance and reconstruction](2026-08-05-fault-tolerance-and-reconstruction.md),
  which owns checkpoint, replication, coding, and constraint-guided functional
  reconstruction nulls;
- [paleobiology and major transitions](2026-08-05-paleobiology-major-transitions.md),
  which separates development, reproduction, selection level, lineage
  transition, and historical inference; and
- [engineering analogues](2026-08-05-engineering-analogues.md), which supplies
  control, allocation, scheduling, partitioning, and compilation baselines.

## Mathematical and resource boundary

### Morphogen production, transport, and decay

A minimal concentration field is

$$
\frac{\partial c}{\partial t}
=D\nabla^2c-kc+s(\mathbf x,t).
$$

\(c\) is concentration in \(\mathrm{mol/m^3}\), \(D\) diffusion coefficient
in \(\mathrm{m^2/s}\), \(k\) first-order removal rate in
\(\mathrm{s^{-1}}\), and \(s\) source rate in
\(\mathrm{mol/(m^3\,s)}\). For a linear steady diffusion–degradation model, a
characteristic length is

$$
\lambda=\sqrt{\frac{D}{k}}\quad[\mathrm{m}].
$$

This is one model, not the definition of a morphogen. Transport can include
advection, receptor binding, internalization, extracellular retention,
relay, growth, and moving boundaries.

For a locally exponential profile \(c(x)=c_0e^{-x/\lambda}\), a threshold
\(\theta\) gives

$$
x_\theta=\lambda\ln\left(\frac{c_0}{\theta}\right)\quad[\mathrm{m}],
\qquad
\sigma_x\approx
\frac{\sigma_c}{\left|\partial c/\partial x\right|}
\quad[\mathrm{m}].
$$

\(c_0,\theta,\sigma_c\) are in \(\mathrm{mol/m^3}\);
\(\partial c/\partial x\) is in \(\mathrm{mol/m^4}\). The uncertainty formula
is a local linearization. It exposes why gradient precision, receiver noise,
embryo scaling, correlations, and downstream correction must be measured
separately.

### Concentration, duration, and competence

Let \(a(c,q)\in[0,1]\) be normalized pathway activity determined by signal
concentration \(c\) and local competence state \(q\). An integrated exposure
is

$$
I(T)=\int_0^T a(c(t),q(t))\,dt\quad[\mathrm{s}].
$$

Distinct fates may depend on instantaneous \(a\), duration \(T\), integral
\(I\), rate of change, or sequence. A static threshold cannot be assumed.
Competence \(q\) may contain receptor abundance, chromatin accessibility,
transcription factors, cell-cycle state, position, and prior signals.

### Lateral inhibition

A scoped Delta–Notch-style model is

$$
\frac{dN_i}{dt}
=\beta_N f\left(\sum_{j\in\mathcal N_i}w_{ij}D_j\right)-\gamma_NN_i,
\qquad
\frac{dD_i}{dt}
=\beta_D g(N_i)-\gamma_DD_i.
$$

\(N_i\) and \(D_i\) are receptor-response and ligand concentrations in
\(\mathrm{mol/m^3}\); \(\beta_N,\beta_D\) are production scales in
\(\mathrm{mol/(m^3\,s)}\); \(\gamma_N,\gamma_D\) are removal rates in
\(\mathrm{s^{-1}}\); \(w_{ij}\) and \(f,g\) are dimensionless. Lateral
inhibition requires \(g\) to decrease sufficiently with \(N_i\) in the
relevant regime. Pattern depends on graph \(\mathcal N_i\), delay, mobility,
initial asymmetry, feedback gain, and noise. "One winner per neighborhood" is
not a universal consequence.

### Segmentation clock and moving determination front

A generic coupled phase model is

$$
\frac{d\phi_i}{dt}
=\omega_i+
K\sum_{j\in\mathcal N_i}
\sin\left[\phi_j(t-\tau)-\phi_i(t)\right].
$$

\(\phi_i\) is phase in radians, \(\omega_i\) intrinsic angular frequency in
\(\mathrm{rad/s}\), \(K\) coupling rate in \(\mathrm{s^{-1}}\), and
\(\tau\) communication delay in seconds. If a front moves at speed \(v_f\)
in \(\mathrm{m/s}\) and one boundary is fixed per oscillation of period
\(T_c\) seconds, the simplest length estimate is

$$
L_s=v_fT_c\quad[\mathrm{m}].
$$

Real somitogenesis couples oscillation, tissue elongation, gradients,
cell-state transitions, and mechanics. The product is a dimensional baseline,
not a universal somite law.

### Growth, sculpting, and repair accounting

For a declared tissue or module population,

$$
\frac{dN}{dt}
=b(t)-d(t)+i(t)-o(t)
\quad[\mathrm{cells/s}],
$$

where \(N\) is cell count, \(b\) birth/differentiation inflow, \(d\) death,
\(i\) migration into the boundary, and \(o\) migration out, all in
cells/second. Cell number alone omits cell size, matrix, transport, and
function.

The lifecycle energy boundary is

$$
E_{\mathrm{dev}}
=\int_0^{T}
\left(
P_{\mathrm{signal}}+P_{\mathrm{synthesis}}+P_{\mathrm{transport}}
+P_{\mathrm{remodel}}+P_{\mathrm{turnover}}+P_{\mathrm{clearance}}
+P_{\mathrm{repair}}+P_{\mathrm{control}}
\right)dt.
$$

Every \(P\) is watts and \(E_{\mathrm{dev}}\) is joules. Also report material
mass in kilograms or moles, elapsed time in seconds, peak power in watts,
discarded state in bytes or kilograms, and accepted functional units. Growth
followed by apoptosis can be efficient for a constrained organism while being
wasteful for an artificial substrate; that is an experiment, not an analogy.

### Plasticity is not adaptiveness

A reaction norm can be written

$$
z=\alpha+\beta E+\epsilon,
$$

where phenotype \(z\) has a declared unit, environment \(E\) has a declared
unit, \(\beta\) converts environment units to phenotype units, and
\(\epsilon\) is residual variation in phenotype units. Plasticity is
\(\beta\neq0\). Adaptive plasticity additionally requires higher expected
fitness or task utility than a suitable fixed policy:

$$
\Delta W=
\mathbb E[W_{\mathrm{plastic}}-W_{\mathrm{fixed}}],
$$

where \(W\) is reproductive output or declared task utility in one common
unit. The sign of \(\Delta W\) cannot be inferred from the existence or
direction of \(\beta\).

## Mechanism-family audit

### 1. Positional information and morphogen interpretation

[Driever and Nüsslein-Volhard
(1988)](https://doi.org/10.1016/0092-8674(88)90183-3) genetically altered
maternal bicoid dosage and distribution, measured the protein gradient, and
observed corresponding shifts in anterior fate-map positions. This is strong
causal evidence that Bicoid concentration contributes positional information
in the studied Drosophila embryo. It does not imply that one concentration
uniquely specifies every downstream fate or that a gradient is decoded without
cross-regulation and timing.

[Gurdon et al. (1994)](https://doi.org/10.1038/371487a0) used amphibian tissue
combinations to show distance-dependent gene responses to an activin source,
supporting a concentration-dependent vertebrate morphogen response in that
preparation.
[Dessaud et al. (2007)](https://doi.org/10.1038/nature06347) showed that
ventral neural-tube identity depends on both Sonic hedgehog concentration and
exposure duration, with temporal adaptation in the response. These studies
reject the naive rule "position equals one instantaneous scalar."

[Houchmandzadeh, Wieschaus, and Leibler
(2002)](https://doi.org/10.1038/415798a) quantified early Drosophila pattern
precision and proportional scaling. Downstream boundaries were more precise
than a one-input readout of measured Bicoid variation would predict,
implicating additional maternal or network information. Precision is therefore
an end-to-end system property, not a constant attached to one morphogen.

**AI translation.** A low-bandwidth context field can parameterize many local
modules if each receiver carries a typed transfer function and if spatial/
temporal support is explicit. This is Candidate 002 plus
[Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md),
not a new broadcast principle.

**Strongest nulls.** coordinate embeddings, feature-wise modulation,
conditional normalization, state-space observers, reaction–diffusion
controllers, Gaussian-process fields, and ordinary message passing. A
biological translation must beat them after field production, distribution,
readout, calibration, and boundary drift are charged.

### 2. Lateral inhibition and local fate competition

[Heitzler and Simpson
(1991)](https://doi.org/10.1016/0092-8674(91)90263-X) used Drosophila genetic
mosaics to distinguish cell-autonomous Notch response from nonautonomous Delta
signaling during neural-versus-epidermal fate choice. Failure of Notch/Delta
communication produced excess neural precursors, while relative Notch activity
biased which adjacent cell adopted the neural fate.

[Collier et al. (1996)](https://doi.org/10.1006/jtbi.1996.0233) formalized a
feedback model in which adjacent cells amplify small differences into
contrasting states. It is a theoretical null: the pattern follows from local
inhibitory coupling and feedback under specified parameters. It does not prove
that all Notch systems implement the same equations or that the selected cell
is globally optimal.

**AI translation.** Local competition can allocate one specialist per
neighborhood without a central ranking, mapping to
[P-001](../principle-registry.md#p-001--selective-allocation),
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection),
and [P-008](../principle-registry.md#p-008--compartmentalized-interaction).
The hard boundary is objective visibility: developmental winner selection can
be based on local molecular state, while an AI specialist must still be judged
on task utility, capacity, and safety.

**Strongest nulls.** local winner-take-all, k-medoids, graph coloring,
maximal-independent-set algorithms, competitive learning, mixture-of-experts
routing, and distributed constraint optimization.

### 3. Segmentation and conversion of time into space

[Nüsslein-Volhard and Wieschaus
(1980)](https://doi.org/10.1038/287795a0) used a systematic mutagenesis screen
to identify Drosophila loci whose loss altered segment number or polarity,
revealing multiple spatial scales of pattern control. The screen establishes
necessity of loci under the assay, not a complete dynamical mechanism or
evolutionary history of segmentation.

[Palmeirim et al.
(1997)](https://doi.org/10.1016/S0092-8674(00)80451-1) observed cyclic
c-hairy1 expression in chick presomitic mesoderm with a period corresponding
to somite formation and used explants to support tissue-autonomous oscillation.
The moving expression pattern reflected coordinated pulses rather than cells
physically carrying a stripe forward.

[Dubrulle, McGrew, and Pourquié
(2001)](https://doi.org/10.1016/S0092-8674(01)00437-8) altered FGF signaling
in chick presomitic mesoderm and shifted the determination front and future
somite boundaries. The result supports a clock-plus-front mechanism in that
system: timing and positional competence jointly fix repeated boundaries.

**AI translation.** Oscillation plus a moving admission boundary can compile a
stream into repeated modules. This is P-003/P-006/P-008/P-011 and conventional
clocked pipeline design. It becomes interesting only when local oscillators
reduce synchronization traffic or improve graceful degradation over a central
clock and counter.

**Strongest nulls.** counters, phase-locked loops, synchronous pipelines,
distributed clocks, TDMA, windowed stream processing, and periodic checkpoint
or batching schedules.

### 4. Lineage commitment and competence windows

[Steinbach, Wolffe, and Rupp
(1997)](https://doi.org/10.1038/38755) manipulated somatic linker histone H1
in Xenopus and found that its accumulation was rate-limiting for loss of
mesodermal competence, with selective silencing of regulatory genes. This is a
causal example in which the receiver's chromatin state closes a response
window even when the external inducing signal remains conceptually available.

[Kinoshita, Bessho, and Asashima
(1995)](https://doi.org/10.1046/j.1440-169X.1995.t01-2-00008.x) varied the
timing and duration of activin treatment in isolated Xenopus blastomeres and
identified a stage-dependent onset of competence in that preparation.
Together, the studies show that competence can both open and close and that
chronological time is only a proxy for changing internal state.

Commitment is also not absolute.
[Xie et al. (2004)](https://doi.org/10.1016/S0092-8674(04)00419-2) forced
C/EBP expression in differentiated B cells and observed stepwise
reprogramming into functional macrophage-like cells through changes including
Pax5 inhibition and endogenous PU.1 dependence.
[Takahashi and Yamanaka
(2006)](https://doi.org/10.1016/j.cell.2006.07.024) generated induced
pluripotent-stem-cell-like colonies from mouse fibroblast cultures with four
defined factors. These are powerful engineering interventions, not evidence
that normal tissues routinely or safely reverse lineage state.

**AI translation.** Competence is a local admission mask over a global signal;
commitment is a costly reduction of reachable states, not an irreversible
type cast. This deduplicates to P-003/P-004/P-008/P-010,
[Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
and
[Candidate 010](../../experiments/candidates/010-reset-coupled-staged-verification.md).
Reopening is analogous to privileged migration or retraining and must carry
validation and rollback.

**Strongest nulls.** learning-rate schedules, frozen parameters, trust regions,
typed state machines, staged deployment, capability admission, curriculum
schedules, explicit migration scripts, fine-tuning, and full retraining.

### 5. Apoptosis and sculpting

Developmental removal is an active process, not absence of growth.
[Yokouchi et al.
(1996)](https://doi.org/10.1242/dev.122.12.3725) blocked BMP signaling in
chick limb buds with a dominant-negative receptor and suppressed programmed
cell death in affected regions; BMP-2/-4 also induced apoptosis in isolated
interdigital mesenchyme.
[Gañan et al.
(1996)](https://doi.org/10.1242/dev.122.8.2349) locally applied TGF-β or BMP
signals before interdigital death and altered death and skeletal pattern in a
dose- and stage-dependent manner.

[Lindsten et al.
(2000)](https://doi.org/10.1016/S1097-2765(00)00136-2) found that mice lacking
both proapoptotic Bax and Bak had severe developmental defects including
persistent interdigital webs and excess cells in multiple systems. Redundancy
matters: single-gene loss did not reveal the full role.

These experiments establish that regulated cell death causally contributes to
specified morphogenetic outcomes. They do not establish that overproduce-and-
delete is the cheapest artificial construction strategy. Cells already carry
local position, adhesion, and clearance interfaces; digital modules may be
cheaper to instantiate conditionally than to train and erase.

**AI translation.** Developmental sculpting is the direct biological instance
of [P-004](../principle-registry.md#p-004--diversity-selection-and-protection),
P-005, and P-009 already covered by the neurodevelopment and cellular-quality
audits. The retained question is when excess candidates improve search enough
to repay training, telemetry, deletion, compaction, and recovery costs.

**Strongest nulls.** conditional construction, structured pruning, magnitude
pruning, dynamic sparse training, regularization, architecture search,
garbage collection, and explicit dependency-aware deletion.

### 6. Regeneration and positional-context repair

[Gurley, Rink, and Sánchez Alvarado
(2008)](https://doi.org/10.1126/science.1150029) used RNA interference in
planarians to show that β-catenin pathway state is necessary for posterior
identity: reducing β-catenin or dishevelled caused posterior wounds to
regenerate heads, while perturbing an antagonist produced posteriorization.
The experiment demonstrates a polarity-control route, not a stored pixel-level
body copy.

[Pascual-Carreras et al.
(2023)](https://doi.org/10.1038/s41467-023-35937-y) combined wound-polarity
comparisons, chromatin accessibility, and Wnt/β-catenin perturbation to show
early pole-specific chromatin remodeling during planarian regeneration. This
is already promoted in scoped form as
[C-033](../claims.md#c-033).

[Wagner, Wang, and Reddien
(2011)](https://doi.org/10.1126/science.1203983) used irradiation and
single-cell transplantation to show that clonogenic neoblasts can generate
multiple differentiated cell types and restore regeneration in lethally
irradiated planarians. The result identifies a renewable cellular resource;
it does not make proliferation, differentiation, or organism-wide replacement
free.

[Kragl et al. (2009)](https://doi.org/10.1038/nature08152) lineage-traced
axolotl limb tissues and found a heterogeneous blastema of progenitors with
restricted contributions rather than complete dedifferentiation to a common
pluripotent state. Positional identity was also cell-type dependent. Therefore
"regeneration" does not name one universal algorithm.

**AI translation.** Context-conditioned repair without an exact copy is
already the residual in the
[fault-tolerance audit](2026-08-05-fault-tolerance-and-reconstruction.md).
Exact checkpoints, logs, replicas, and codes should win when the target state
is digitally available. Developmental repair is relevant only for
underdetermined functional recovery where constraints are cheaper than the
missing parameter state.

**Strongest nulls.** checkpoint/restore, log replay, replication, erasure
coding, local reconstruction codes, fine-tuning from a clean ancestor,
dependency resolution, program repair, and constrained architecture search.

### 7. Metamorphosis and coordinated system replacement

Metamorphosis is a distributed migration under a shared endocrine schedule,
not an instantaneous mode switch.
[Bender et al.
(1997)](https://doi.org/10.1016/S0092-8674(00)80466-3) identified Drosophila
ecdysone-receptor mutations with isoform-specific metamorphic defects and used
transgenic isoforms to obtain differential rescue of salivary-gland gene
activation. A shared hormone is decoded through tissue and receptor state.

[Minakuchi et al.
(2008)](https://doi.org/10.1111/j.1742-4658.2008.06428.x) knocked down a
juvenile-hormone biosynthetic enzyme in Tribolium and caused precocious
metamorphosis; applying a juvenile-hormone mimic rescued the timing phenotype.
This establishes a present endocrine timing role under the experiment.

Metamorphosis combines selective death of larval structures, proliferation and
differentiation of adult structures, transport, matrix remodeling, and a
period of altered or reduced function. A global trigger can coordinate
heterogeneous local programs, but the trigger does not contain those programs.

**AI translation.** The closest owners are Candidate 002 for few-to-many
context, [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md)
for versioned compatibility,
[Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md)
for operational learning and change, and
[Candidate 015](../../experiments/candidates/015-versioned-repairable-conventions.md)
for migration of shared conventions. Blue/green deployment, schema migration,
rolling replacement, and shadow validation are stronger nulls than a
"metamorphic AI" metaphor.

**Strongest nulls.** rolling upgrade, blue/green and canary deployment,
versioned schema migration, feature flags, staged deprecation, drain-and-
replace, checkpoint conversion, and full clean rebuild.

### 8. Canalization and developmental robustness

[Rutherford and Lindquist
(1998)](https://doi.org/10.1038/24550) genetically or pharmacologically reduced
Hsp90 function in Drosophila, exposed background-dependent morphological
variation, and selected variants that could later appear without Hsp90
impairment. The experiments support a scoped buffering/capacitance mechanism.
They do not show that all robustness is centralized in Hsp90, that exposed
variants are useful, or that Hsp90 evolved in order to store future
adaptations.

[Houchmandzadeh et al.
(2002)](https://doi.org/10.1038/415798a) supply a complementary systems null:
precision can improve between an upstream gradient and a downstream boundary,
so robustness may be distributed across multiple inputs and interactions.

For output \(y\) and perturbation \(u\), local sensitivity is

$$
S_{yu}=\frac{\partial y}{\partial u},
$$

with units of \(y\) per unit of \(u\). Canalization is scoped low sensitivity
over declared perturbations and outcomes. It can hide latent fragility,
increase maintenance cost, or block needed adaptation. One flat derivative
does not imply global robustness.

**AI translation.** Robustness maps to P-006/P-009 and ordinary robust control,
ensembles, normalization, regularization, and fault tolerance. Latent variation
released under stress maps to P-004 only if variants are preserved, evaluated,
and contained.

**Strongest nulls.** robust optimization, adversarial training, domain
randomization, ensembles, redundancy, normalization, fault injection, and
sensitivity regularization.

### 9. Developmental plasticity

[Kucharski et al.
(2008)](https://doi.org/10.1126/science.1153069) silenced Dnmt3 in newly
hatched honeybee larvae and shifted many worker-destined developmental
trajectories toward queen-like adults with developed ovaries. The result links
an epigenetic regulator causally to nutrition-associated caste development in
the studied system. It does not show that DNA methylation is the sole decoder,
that the experimental queens had equal lifetime fitness, or why eusocial caste
systems evolved.

[Ghalambor et al.
(2015)](https://doi.org/10.1038/nature15256), with corrections documented in
their [2018 erratum](https://doi.org/10.1038/nature25499), compared guppy gene
expression across ancestral and derived environments. Their result supports
the important boundary that initial plastic responses can be nonadaptive and
then expose expression traits to selection. Plasticity is therefore a
response property, not a guarantee of current benefit.

**AI translation.** Environment-dependent developmental paths can create
conditional architectures or curricula, but they map to P-004/P-007/P-010 and
[Candidate 004](../../experiments/candidates/004-closed-endogenous-curriculum.md).
The environment must not be allowed to write structure without an independent
task and safety evaluation.

**Strongest nulls.** conditional computation, hypernetworks, meta-learning,
domain adaptation, curriculum learning, data augmentation, robust
optimization, and environment-conditioned architecture search.

## Deduplication against the full project

### Principle bundles

| Developmental observation | Existing owner | Boundary |
| --- | --- | --- |
| restricted cells respond to a broad field | P-001 selective allocation | field exposure is not task relevance |
| local state decodes global position/time | P-002 local autonomy | decoder, support, delay, and exception path must be explicit |
| transient exposure precedes commitment | P-003 temporary trace | biochemical integration is not durable evidence by itself |
| progenitors diversify, commit, and excess cells die | P-004 diversity/selection/protection | fate success and system utility are different evaluators |
| contacts and tissues change through growth and removal | P-005 use-dependent topology | development is not necessarily use-dependent; topology writes have resource cost |
| feedback stabilizes boundaries and proportions | P-006 homeostatic feedback | precision needs a measured controlled variable and loop |
| unresolved or damaged regions receive growth | P-007 prediction-error allocation | a wound signal is not epistemic uncertainty |
| compartments and lineage restrictions limit interactions | P-008 compartmentalization | tissue boundaries are not semantic interfaces or security boundaries |
| turnover, apoptosis, and regeneration maintain structure | P-009 maintenance plane | growth/clearance compete with normal function |
| fate becomes persistent structure | P-010 structural offloading | direct existing owner; reversibility and drift remain |
| oscillators form temporary phase relations | P-011 transient coalitions | segmentation is a physical timing instance, not a new router |
| chromatin and lineage state persist at different timescales | P-012 lifetime-matched memory | state duration must match future utility and rewriting cost |
| extracellular gradients store shared spatial context | P-013 externalized shared state | field integrity, access, decay, and readout cost apply |

### Candidate coverage

| Candidates | Developmental overlap | Disposition |
| --- | --- | --- |
| [001](../../experiments/candidates/001-adaptive-topology.md), [006](../../experiments/candidates/006-reversible-physical-skill.md), [013](../../experiments/candidates/013-deficit-capability-routing.md) | growth, contact change, physical compilation, and resource supply | direct owners; charge growth and rollback |
| [002](../../experiments/candidates/002-multiscale-context-broadcast.md), [014](../../experiments/candidates/014-versioned-observation-contract.md) | shared gradients/hormones plus receiver-specific temporal decoding | strongest positive overlap; no new candidate |
| [003](../../experiments/candidates/003-recovery-dynamics-fragility.md), [007](../../experiments/candidates/007-endogenous-observation-surveillance.md) | developmental transitions and interventions change what can be observed | transition and observation caveats only |
| [004](../../experiments/candidates/004-closed-endogenous-curriculum.md) | competence windows and environment-conditioned developmental paths | direct curriculum null; development does not supply evaluator independence |
| [005](../../experiments/candidates/005-severity-ordered-containment.md), [011](../../experiments/candidates/011-dual-loop-operational-assurance.md) | apoptosis, replacement, regeneration, and metamorphic migration | direct lifecycle owners |
| [008](../../experiments/candidates/008-contestable-modular-allocation.md), [020](../../experiments/candidates/020-constitutional-control-plane.md) | cell competition or organizers may look political | reject mapping absent private incentives, authorized standing, agenda, veto, or rule repair |
| [009](../../experiments/candidates/009-graded-assurance-envelopes.md), [010](../../experiments/candidates/010-reset-coupled-staged-verification.md), [012](../../experiments/candidates/012-latency-qualified-authority.md) | competence, commitment, staged transition, and bounded action | direct owners; fate markers do not certify safety |
| [015](../../experiments/candidates/015-versioned-repairable-conventions.md) | coordinated metamorphic change resembles protocol migration | only a migration null; hormones do not encode semantics |
| [016](../../experiments/candidates/016-conflict-bounded-unit-transition.md) | cell lineage and organismal integration | ontogenetic lineage is not collective heredity or a new unit of selection |
| [017](../../experiments/candidates/017-contract-preserving-semantic-compaction.md), [018](../../experiments/candidates/018-value-reconstructability-aware-tiering.md) | apoptosis and differentiation remove or tier state | no support for semantic preservation or value-aware placement |
| [019](../../experiments/candidates/019-audited-cumulative-inheritance.md) | lineage continuity and inherited developmental programs | germline inheritance is not audited cumulative knowledge across artificial learners |

Development uses many mechanisms simultaneously, but co-occurrence in one
organism does not make their composition novel. The project must preserve the
separate signal, decoder, evaluator, resource, maintenance, and validation
roles in ablations.

## Strongest null hypotheses

1. **Coordinate-field null:** a morphogen translation is ordinary coordinate
   conditioning or feature-wise modulation with receiver-specific gains.
2. **Dynamical-pattern null:** reaction–diffusion, coupled oscillators, or
   inhibitory feedback explain the pattern without representation or planning.
3. **State-machine null:** competence and commitment are typed guards and
   versioned state transitions.
4. **Scheduled-training null:** critical windows are fixed learning-rate,
   freezing, or curriculum schedules.
5. **Conditional-construction null:** building only admitted modules dominates
   overproduction followed by pruning.
6. **Deployment-migration null:** metamorphosis is rolling replacement,
   blue/green deployment, or clean rebuild with a shared trigger.
7. **Exact-repair null:** checkpoints, logs, replicas, or codes dominate
   biological-style regeneration whenever exact digital state exists.
8. **Robust-control null:** canalization is ordinary sensitivity reduction,
   redundancy, or robust optimization.
9. **Nonadaptive-response null:** plastic change exists but does not improve
   task utility relative to a fixed policy.
10. **Historical-story null:** a current causal effect is mislabeled as the
    evolutionary reason the mechanism exists.
11. **Boundary-shift null:** efficiency disappears after synthesis, migration,
    turnover, clearance, validation, downtime, and repair reserve are counted.

## Equal-budget falsification experiments

### Experiment A — scalar gradient versus local-state decoder

- **Task:** assign spatially distributed modules to ordered roles under size,
  source, noise, and boundary shifts.
- **Arms:** fixed coordinate embedding; one scalar gradient plus uniform
  thresholds; gradient plus receiver competence; message passing; centralized
  assignment.
- **Equalize:** trainable parameters, samples, sensor resolution, field-update
  rate, communicated bytes, and inference joules.
- **Measure:** role accuracy, boundary error metres or module slots,
  calibration, adaptation seconds, bytes, and joules/accepted assignment.
- **Kill:** competence state adds no generalization beyond ordinary
  conditioning, or field generation/readout costs erase the gain.

### Experiment B — lateral inhibition versus ordinary allocation

- **Task:** choose noninterfering specialists on dynamic graphs with local
  capacity and heterogeneous task utility.
- **Arms:** Delta–Notch-style inhibition, local winner-take-all,
  maximal-independent-set, graph coloring, k-medoids, and centralized
  utility-constrained assignment.
- **Equalize:** messages, iterations, candidate evaluations, and energy.
- **Measure:** utility/step, constraint violations, convergence seconds,
  churn, orphan regions, message bytes, and joules.
- **Kill:** the biological rule selects molecularly salient but task-poor
  winners, oscillates, or ties a conventional local allocator.

### Experiment C — clock-and-front segmentation

- **Task:** convert a variable-rate stream into bounded modules while the
  processing frontier moves and local clocks drift.
- **Arms:** central counter, timestamp windows, PLL-synchronized workers,
  coupled local oscillators, and oscillator-plus-competence-front.
- **Equalize:** clock observations, synchronization bytes, buffer capacity,
  compute, and power.
- **Measure:** boundary jitter seconds, segment-size error items, late events,
  recovery after clock failure, bytes, and joules/item.
- **Kill:** local oscillation increases drift or traffic, or a timestamped
  stream processor dominates.

### Experiment D — competence-gated commitment

- **Task:** specialize modules across an ordered nonstationary curriculum, then
  reopen a subset after a genuine regime change.
- **Arms:** always-plastic, fixed freeze schedule, EWC/trust region, typed
  admission mask, learned competence gate, and full retraining.
- **Equalize:** optimizer updates, trainable parameter-seconds, examples,
  validation calls, and total energy.
- **Measure:** retention, adaptation latency, false reopenings, collateral
  regressions, rollback success, and joules/accepted update.
- **Kill:** chronological schedules match the gate, local self-certification
  admits unsafe transitions, or reopening costs more than retraining.

### Experiment E — overproduce-and-sculpt

- **Task:** discover a sparse modular architecture under stable and shifting
  workloads.
- **Arms:** conditional construction, dense train-then-prune, magnitude
  pruning, dynamic sparse training, architecture search, and
  local-signal-mediated apoptosis.
- **Equalize:** candidate parameter-updates, final active parameters,
  evaluation calls, memory traffic, and wall energy.
- **Measure:** final/shift quality, training joules, deleted parameter-bytes,
  compaction time, peak memory, regrowth recovery, and waste.
- **Kill:** excess construction provides no search benefit, or delete/regrow
  cost dominates dynamic sparsity.

### Experiment F — positional-context regeneration

- **Task:** restore independently damaged modules under deletion, stale state,
  common-mode semantic fault, and underdetermined capability loss.
- **Arms:** checkpoint, log replay, replication, coding, ancestor fine-tune,
  full search, and context-constrained reconstruction.
- **Equalize:** detection evidence, training data, validation tests, reserve
  compute, storage, and energy.
- **Measure:** worst-slice restored quality, safety risk, minimum/full-service
  seconds, bytes, joules, collateral regression, false repair, and rollback.
- **Kill:** context reconstruction claims a win on faults where exact recovery
  should dominate, or uses hidden target information.

### Experiment G — metamorphic migration

- **Task:** migrate a running multi-module system across an incompatible
  representation or protocol version.
- **Arms:** in-place rewrite, rolling upgrade, blue/green, clean rebuild,
  hormone-like global trigger with local decoders, and trigger plus competence
  gates.
- **Equalize:** hardware reserve, state conversion, tests, deployment windows,
  storage, and operator attention.
- **Measure:** availability, version-skew errors, p99 latency, lost work,
  rollback seconds, discarded bytes, peak watts, and total joules.
- **Kill:** global coordination causes correlated failure, local programs are
  merely migration scripts under new names, or clean rebuild is cheaper.

### Experiment H — canalization and plasticity

- **Task:** train under controlled genetic/parameter, environmental, sensor,
  and adversarial perturbations, then shift to a genuinely new regime.
- **Arms:** nominal training, robust optimization, ensembles, domain
  randomization, buffered latent variants, and environment-conditioned
  developmental policy.
- **Equalize:** models, samples, optimizer operations, variant storage,
  inference calls, and energy.
- **Measure:** perturbation sensitivity, clean quality, worst-group quality,
  adaptation steps, hidden-failure rate, diversity, storage, and joules.
- **Kill:** buffering merely hides correlated defects, plastic response lowers
  utility, or robust optimization matches the frontier.

## Temporary claims

These identifiers preserve audit scope and must not be promoted without
root-level review.

| ID | Status | Scoped claim | Primary support | Main boundary |
| --- | --- | --- | --- | --- |
| C-DEV-01 | established | Genetically changing Bicoid level shifts anterior fate-map positions in the studied Drosophila embryos. | Driever & Nüsslein-Volhard 1988 | one gradient is not the whole decoder |
| C-DEV-02 | established | Distance from an activin source can select different gene responses in amphibian tissue combinations. | Gurdon et al. 1994 | preparation and candidate-morphogen scope |
| C-DEV-03 | established | Sonic hedgehog interpretation in ventral neural patterning depends on concentration and exposure duration. | Dessaud et al. 2007 | pathway and tissue scope |
| C-DEV-04 | plausible | Downstream Drosophila boundaries use information or correction beyond a one-input readout of measured Bicoid variability. | Houchmandzadeh et al. 2002 | measurement/model assumptions |
| C-DEV-05 | established | Relative Notch/Delta activity causally biases neural-versus-epidermal fate in Drosophila mosaics. | Heitzler & Simpson 1991 | not every Notch context is lateral inhibition |
| C-DEV-06 | established in model | Feedback lateral inhibition can amplify small local differences into alternating cell states. | Collier et al. 1996 | parameter and graph conditions |
| C-DEV-07 | established | Mutations in distinct Drosophila loci disrupt segmentation at different spatial scales. | Nüsslein-Volhard & Wieschaus 1980 | necessity screen, not complete dynamics |
| C-DEV-08 | established | Chick presomitic mesoderm exhibits autonomous cyclic c-hairy1 expression linked in period to somite formation. | Palmeirim et al. 1997 | correlation does not make c-hairy1 the sole clock |
| C-DEV-09 | established | Altering FGF signaling shifts the chick determination front and future somite boundaries. | Dubrulle et al. 2001 | clock/front implementation is system-specific |
| C-DEV-10 | established | Somatic linker H1 accumulation causally contributes to loss of Xenopus mesodermal competence. | Steinbach et al. 1997 | one competence mechanism and assay |
| C-DEV-11 | established | Activin response competence in isolated Xenopus blastomeres has a stage-dependent onset. | Kinoshita et al. 1995 | isolation and treatment scope |
| C-DEV-12 | established | Forced C/EBP expression can reprogram differentiated B cells toward functional macrophage-like cells in vitro. | Xie et al. 2004 | engineered intervention, culture conditions, safety |
| C-DEV-13 | established | Four defined factors generated iPS-like colonies from mouse fibroblast cultures. | Takahashi & Yamanaka 2006 | initial selection and pluripotency criteria; not routine in vivo reversal |
| C-DEV-14 | established | BMP-pathway and Bax/Bak perturbations show that regulated death contributes causally to normal limb and tissue sculpting. | Yokouchi et al. 1996; Gañan et al. 1996; Lindsten et al. 2000 | redundant pathways and organism/stage scope |
| C-DEV-15 | established | Planarian Wnt/β-catenin state controls anterior-versus-posterior regenerative identity. | Gurley et al. 2008; Pascual-Carreras et al. 2023 | not a full body blueprint |
| C-DEV-16 | established | A single transplanted clonogenic neoblast can restore regenerative capacity to a lethally irradiated planarian host. | Wagner et al. 2011 | exceptional organism and resource-rich proliferation |
| C-DEV-17 | established | Axolotl limb blastemas contain lineage-restricted progenitors retaining tissue-origin information. | Kragl et al. 2009 | lineage-label and tissue scope |
| C-DEV-18 | established | Ecdysone-receptor isoforms and juvenile-hormone synthesis causally regulate scoped insect metamorphic transitions. | Bender et al. 1997; Minakuchi et al. 2008 | endocrine trigger is not the local rebuild program |
| C-DEV-19 | established in study | Hsp90 impairment exposes background-dependent morphological variation in Drosophila, some of which can respond to selection. | Rutherford & Lindquist 1998 | does not establish universal capacitance or evolutionary purpose |
| C-DEV-20 | established | Dnmt3 knockdown shifts honeybee caste-associated development toward queen-like phenotypes. | Kucharski et al. 2008 | not the sole nutritional decoder or lifetime-fitness test |
| C-DEV-21 | established in study | Plastic gene-expression responses in ancestral guppies were not uniformly adaptive; some nonadaptive responses were associated with later evolution. | Ghalambor et al. 2015; 2018 erratum | magnitude corrected; expression is not whole-organism fitness |
| C-DEV-22 | disputed | Developmental plasticity, canalization, or regeneration is automatically efficient or adaptive. | contradicted by resource accounting and nonadaptive plasticity | requires equal-budget utility and lifecycle test |
| C-DEV-23 | disputed | A current knockout/rescue phenotype establishes why a mechanism evolved. | evidence-category boundary | requires comparative, selection, or phylogenetic evidence |
| C-DEV-24 | speculative | Competence-gated structural transition may improve continual modular learning and migration. | transfer hypothesis only | reject if ordinary gates, schedules, and migration dominate Experiments D/G |

## Integration disposition

**Promote now:** no new stable principle, candidate, or shared claim. Retain the
signal-versus-competence, specification-versus-implementation, and
current-function-versus-origin distinctions as audit requirements.

**Hold:** C-DEV-24 as a cross-candidate experimental fixture only. Candidate
002 owns low-bandwidth context; Candidate 009 owns versioned admissibility;
Candidate 010 owns evidence before commitment; Candidate 006 owns reversible
physical compilation; Candidate 014 owns observation support and vintage.

**Reject as standalone principles or prescriptions:**

- morphogens as complete coordinate programs;
- lateral inhibition as globally optimal expert selection;
- segmentation clocks as a novel scheduling primitive without a systems win;
- lineage commitment as irreversible;
- critical periods as justification for arbitrary early freezing;
- apoptosis or pruning as intrinsically efficient;
- regeneration as checkpoint-free exact restoration;
- metamorphosis as cost-free global mode switching;
- Hsp90-like buffering as universally beneficial canalization;
- plastic response as proof of adaptiveness; and
- present causal role as evidence of evolutionary origin.

**Audit verdict:** developmental biology contributes a precise systems lesson:
signals are interpreted by receivers with histories, permissions, and finite
windows, and the resulting decisions are paid for in growth, material,
turnover, validation, and lost flexibility. That lesson strengthens existing
project primitives. It does not yet establish a new one.

## Bibliography (audit-local BibTeX)

```bibtex
@article{driever1988bicoid,
  author = {Driever, Wolfgang and N{\"u}sslein-Volhard, Christiane},
  title = {The bicoid protein determines position in the Drosophila embryo in a concentration-dependent manner},
  journal = {Cell},
  year = {1988},
  volume = {54},
  number = {1},
  pages = {95--104},
  doi = {10.1016/0092-8674(88)90183-3}
}

@article{gurdon1994activin,
  author = {Gurdon, John B. and Harger, Pamela and Mitchell, A. and Lemaire, Patrick},
  title = {Activin signalling and response to a morphogen gradient},
  journal = {Nature},
  year = {1994},
  volume = {371},
  pages = {487--492},
  doi = {10.1038/371487a0}
}

@article{dessaud2007sonic,
  author = {Dessaud, Eric and Yang, Lin Lin and Hill, Katy and Cox, Barny and Ulloa, Fausto and Ribeiro, Ana and Mynett, Anita and Novitch, Bennett G. and Briscoe, James},
  title = {Interpretation of the sonic hedgehog morphogen gradient by a temporal adaptation mechanism},
  journal = {Nature},
  year = {2007},
  volume = {450},
  pages = {717--720},
  doi = {10.1038/nature06347}
}

@article{houchmandzadeh2002precision,
  author = {Houchmandzadeh, Bahram and Wieschaus, Eric and Leibler, Stanislas},
  title = {Establishment of developmental precision and proportions in the early Drosophila embryo},
  journal = {Nature},
  year = {2002},
  volume = {415},
  pages = {798--802},
  doi = {10.1038/415798a}
}

@article{heitzler1991choice,
  author = {Heitzler, Pascal and Simpson, Pat},
  title = {The choice of cell fate in the epidermis of Drosophila},
  journal = {Cell},
  year = {1991},
  volume = {64},
  number = {6},
  pages = {1083--1092},
  doi = {10.1016/0092-8674(91)90263-X}
}

@article{collier1996lateral,
  author = {Collier, Joanne R. and Monk, Nicholas A. M. and Maini, Philip K. and Lewis, Julian H.},
  title = {Pattern Formation by Lateral Inhibition with Feedback: a Mathematical Model of Delta-Notch Intercellular Signalling},
  journal = {Journal of Theoretical Biology},
  year = {1996},
  volume = {183},
  number = {4},
  pages = {429--446},
  doi = {10.1006/jtbi.1996.0233}
}

@article{nussleinvolhard1980segment,
  author = {N{\"u}sslein-Volhard, Christiane and Wieschaus, Eric},
  title = {Mutations affecting segment number and polarity in Drosophila},
  journal = {Nature},
  year = {1980},
  volume = {287},
  pages = {795--801},
  doi = {10.1038/287795a0}
}

@article{palmeirim1997hairy,
  author = {Palmeirim, Isabel and Henrique, Domingos and Ish-Horowicz, David and Pourqui{\'e}, Olivier},
  title = {Avian hairy gene expression identifies a molecular clock linked to vertebrate segmentation and somitogenesis},
  journal = {Cell},
  year = {1997},
  volume = {91},
  number = {5},
  pages = {639--648},
  doi = {10.1016/S0092-8674(00)80451-1}
}

@article{dubrulle2001fgf,
  author = {Dubrulle, J{\'e}r{\^o}me and McGrew, Michael J. and Pourqui{\'e}, Olivier},
  title = {{FGF} Signaling Controls Somite Boundary Position and Regulates Segmentation Clock Control of Spatiotemporal {Hox} Gene Activation},
  journal = {Cell},
  year = {2001},
  volume = {106},
  number = {2},
  pages = {219--232},
  doi = {10.1016/S0092-8674(01)00437-8}
}

@article{steinbach1997histones,
  author = {Steinbach, Oliver C. and Wolffe, Alan P. and Rupp, Ralf A. W.},
  title = {Somatic linker histones cause loss of mesodermal competence in Xenopus},
  journal = {Nature},
  year = {1997},
  volume = {389},
  pages = {395--399},
  doi = {10.1038/38755}
}

@article{kinoshita1995competence,
  author = {Kinoshita, Koichiro and Bessho, Yasumasa and Asashima, Makoto},
  title = {Onset of competence to respond to activin A in isolated eight-cell stage Xenopus animal blastomeres},
  journal = {Development, Growth \& Differentiation},
  year = {1995},
  volume = {37},
  number = {3},
  pages = {303--309},
  doi = {10.1046/j.1440-169X.1995.t01-2-00008.x}
}

@article{xie2004reprogramming,
  author = {Xie, Hui and Ye, Min and Feng, Rui and Graf, Thomas},
  title = {Stepwise Reprogramming of B Cells into Macrophages},
  journal = {Cell},
  year = {2004},
  volume = {117},
  number = {5},
  pages = {663--676},
  doi = {10.1016/S0092-8674(04)00419-2}
}

@article{takahashi2006ips,
  author = {Takahashi, Kazutoshi and Yamanaka, Shinya},
  title = {Induction of Pluripotent Stem Cells from Mouse Embryonic and Adult Fibroblast Cultures by Defined Factors},
  journal = {Cell},
  year = {2006},
  volume = {126},
  number = {4},
  pages = {663--676},
  doi = {10.1016/j.cell.2006.07.024}
}

@article{yokouchi1996bmp,
  author = {Yokouchi, Yuji and Sakiyama, Jiro and Kameda, Tetsuya and Ueno, Naoto and Kuroiwa, Atsushi},
  title = {{BMP}-2/-4 mediate programmed cell death in chicken limb buds},
  journal = {Development},
  year = {1996},
  volume = {122},
  number = {12},
  pages = {3725--3734},
  doi = {10.1242/dev.122.12.3725}
}

@article{ganan1996tgf,
  author = {Ga{\~n}{\'a}n, Yolanda and Macias, David and Duterque-Coquillaud, Michelle and Ros, Maria A. and Hurle, Juan M.},
  title = {Role of {TGF} betas and {BMPs} as signals controlling the position of the digits and the areas of interdigital cell death in the developing chick limb autopod},
  journal = {Development},
  year = {1996},
  volume = {122},
  number = {8},
  pages = {2349--2357},
  doi = {10.1242/dev.122.8.2349}
}

@article{lindsten2000bakbax,
  author = {Lindsten, Tullia and Ross, Andrew J. and King, Andrew and Zong, Wei-Xing and Rathmell, Jeffrey C. and Shiels, Heather A. and Ulrich, Eric and Waymire, Kenneth G. and Mahar, Patricia and Frauwirth, Kenneth and Chen, Yifang and Wei, Min and Eng, Victoria M. and Adelman, David M. and Simon, M. Celeste and Ma, Avery and Golden, Jeffrey A. and Evan, Gerard and Korsmeyer, Stanley J. and MacGregor, Grant R. and Thompson, Craig B.},
  title = {The Combined Functions of Proapoptotic Bcl-2 Family Members Bak and Bax Are Essential for Normal Development of Multiple Tissues},
  journal = {Molecular Cell},
  year = {2000},
  volume = {6},
  number = {6},
  pages = {1389--1399},
  doi = {10.1016/S1097-2765(00)00136-2}
}

@article{gurley2008betacatenin,
  author = {Gurley, Kyle A. and Rink, Jochen C. and S{\'a}nchez Alvarado, Alejandro},
  title = {Beta-catenin defines head versus tail identity during planarian regeneration and homeostasis},
  journal = {Science},
  year = {2008},
  volume = {319},
  number = {5861},
  pages = {323--327},
  doi = {10.1126/science.1150029}
}

@article{pascualcarreras2023wnt,
  author = {Pascual-Carreras, Eudald and Marin-Barba, Marta and Castillo-Lara, Sergio and Coronel-Cordoba, Pablo and Magri, Marta Silvia and Wheeler, Grant N. and Gomez-Skarmeta, Jose Luis and Abril, Josep F. and Salo, Emili and Adell, Teresa and others},
  title = {{Wnt}/{\(\beta\)}-catenin signalling is required for pole-specific chromatin remodeling during planarian regeneration},
  journal = {Nature Communications},
  year = {2023},
  volume = {14},
  pages = {298},
  doi = {10.1038/s41467-023-35937-y}
}

@article{wagner2011neoblasts,
  author = {Wagner, Daniel E. and Wang, Irving E. and Reddien, Peter W.},
  title = {Clonogenic neoblasts are pluripotent adult stem cells that underlie planarian regeneration},
  journal = {Science},
  year = {2011},
  volume = {332},
  number = {6031},
  pages = {811--816},
  doi = {10.1126/science.1203983}
}

@article{kragl2009memory,
  author = {Kragl, Martin and Knapp, Dunja and Nacu, Eugen and Khattak, Shahryar and Maden, Malcolm and Epperlein, Hans Henning and Tanaka, Elly M.},
  title = {Cells keep a memory of their tissue origin during axolotl limb regeneration},
  journal = {Nature},
  year = {2009},
  volume = {460},
  pages = {60--65},
  doi = {10.1038/nature08152}
}

@article{bender1997ecdysone,
  author = {Bender, Michael and Imam, F. Barry and Talbot, William S. and Ganetzky, Barry and Hogness, David S.},
  title = {Drosophila Ecdysone Receptor Mutations Reveal Functional Differences among Receptor Isoforms},
  journal = {Cell},
  year = {1997},
  volume = {91},
  number = {6},
  pages = {777--788},
  doi = {10.1016/S0092-8674(00)80466-3}
}

@article{minakuchi2008jhamt,
  author = {Minakuchi, Chieka and Namiki, Tomohiro and Yoshiyama, Masatoshi and Shinoda, Tetsuro},
  title = {{RNAi}-mediated knockdown of juvenile hormone acid O-methyltransferase gene causes precocious metamorphosis in the red flour beetle Tribolium castaneum},
  journal = {The FEBS Journal},
  year = {2008},
  volume = {275},
  number = {11},
  pages = {2919--2931},
  doi = {10.1111/j.1742-4658.2008.06428.x}
}

@article{rutherford1998hsp90,
  author = {Rutherford, Suzanne L. and Lindquist, Susan},
  title = {{Hsp90} as a capacitor for morphological evolution},
  journal = {Nature},
  year = {1998},
  volume = {396},
  pages = {336--342},
  doi = {10.1038/24550}
}

@article{kucharski2008honeybee,
  author = {Kucharski, Robert and Maleszka, J{\"u}rgen and For{\^e}t, Sylvain and Maleszka, Ryszard},
  title = {Nutritional control of reproductive status in honeybees via {DNA} methylation},
  journal = {Science},
  year = {2008},
  volume = {319},
  number = {5871},
  pages = {1827--1830},
  doi = {10.1126/science.1153069}
}

@article{ghalambor2015plasticity,
  author = {Ghalambor, Cameron K. and Hoke, Kim L. and Ruell, Emily W. and Fischer, Eva K. and Reznick, David N. and Hughes, Kimberly A.},
  title = {Non-adaptive plasticity potentiates rapid adaptive evolution of gene expression in nature},
  journal = {Nature},
  year = {2015},
  volume = {525},
  pages = {372--375},
  doi = {10.1038/nature15256}
}

@article{ghalambor2018erratum,
  author = {Ghalambor, Cameron K. and Hoke, Kim L. and Ruell, Emily W. and Fischer, Eva K. and Reznick, David N. and Hughes, Kimberly A.},
  title = {Erratum: Non-adaptive plasticity potentiates rapid adaptive evolution of gene expression in nature},
  journal = {Nature},
  year = {2018},
  volume = {555},
  pages = {688},
  doi = {10.1038/nature25499}
}
```

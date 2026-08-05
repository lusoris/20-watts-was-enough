# Primary-source audit: cellular quality control

**Audit date:** 2026-08-05

**Scope:** proteostasis, the unfolded-protein response (UPR), autophagy,
mitophagy, organelle repair, damage tagging, compartmental isolation, and
repair–recycle–replacement decisions

**Ledger state:** candidate evidence only; final claim numbers must be assigned
by the root integrator

**Purpose:** determine whether cellular quality control contributes an
intervention-supported systems principle beyond generic maintenance, and define
tests that can reject the proposed AI translation

## Method and evidence boundary

This audit privileges genetic deletion or knockdown, pharmacological
perturbation, biochemical reconstitution, live-cell tracking, and controlled
damage experiments. A cellular result is evidence for the scoped biological
mechanism, not for an AI architecture. “Established” below therefore means
established within the cited preparation; every AI translation remains
`speculative` until it beats matched engineering nulls.

The source set deliberately spans three scales:

1. **load regulation and repair capacity** — how a compartment reacts before
   individual clients are classified;
2. **item and subcomponent triage** — how suspect material is tagged, routed,
   repaired, or extracted; and
3. **whole-component lifecycle control** — how a damaged organelle is isolated,
   removed, and replenished.

No source supports a universal damage threshold, a universally optimal order
of actions, or the claim that more degradation is always beneficial. Acute
chemical injury in cultured cells, basal turnover in intact animals, and
age-related decline are kept separate.

## Executive conclusion

The evidence supports a **conditional severity ladder**, not one biological
garbage collector:

```text
detect local stress
    → reduce new load
    → tag and contain suspect material
    → attempt local repair or selective extraction
    → recycle an irrecoverable item/component
    → replace lost capacity
    → verify recovery and release containment
```

The strongest potentially useful invariant is:

> Limit propagation first; preserve reversible options while evidence is
> incomplete; escalate from local repair to selective recycling and only then
> replacement, with the escalation decision conditioned on damage state,
> repair response, resource budget, and the cost of collateral loss.

This is not yet a new registry principle. Its pieces overlap
[`P-003`](../principle-registry.md#p-003--temporary-trace-before-commitment),
[`P-006`](../principle-registry.md#p-006--homeostatic-negative-feedback),
[`P-008`](../principle-registry.md#p-008--compartmentalized-interaction),
[`P-009`](../principle-registry.md#p-009--maintenance-plane), and
[`P-010`](../principle-registry.md#p-010--structural-offloading-and-co-design).
What remains under-specified is the **pre-diagnostic containment and explicit
action ladder**: a local mechanism can reduce blast radius within minutes while
a slower maintenance process decides whether to repair, recycle, or replace.
That candidate should remain held until it outperforms fault-containment,
rollback, microrestart, redundancy, garbage-collection, and rejuvenation
baselines at equal cost.

## Terms that must not be collapsed

| Operation | Operational definition | Not equivalent to |
| --- | --- | --- |
| sensing | estimate abnormal load, structure, membrane integrity, or function | knowing the root cause |
| containment | immediately limit spread, interaction, or incoming work while diagnosis is incomplete | repair; permanent deletion |
| tagging | attach local, inspectable evidence that changes routing or action priority | a guaranteed verdict that the target is bad |
| triage | choose among retry/refold, isolate, repair, recycle, replace, or terminal shutdown | generic background maintenance |
| repair | restore the same item or boundary sufficiently to resume service | rollback to a replica; replacement |
| selective extraction | remove a damaged subcomponent while retaining the enclosing component | destroying the whole component |
| recycling | destructively recover reusable constituents from an item judged uneconomical or unsafe to retain | forgetting merely because an item is old |
| replacement | create or provision new capacity after removal or persistent deficit | repair of the old capacity |
| verification | test whether function and containment state can safely return to normal | assuming an action succeeded |

[`P-009`](../principle-registry.md#p-009--maintenance-plane) owns the separation
of lifecycle work from the fast task path. The candidate here is narrower:
**containment is a fast safety action, while triage is an evidence- and
cost-conditioned policy that can live on the maintenance plane.**

## Evidence synthesis

| Record | Intervention-supported mechanism | Information path | Biological timescale | Main resource cost | Registry disposition |
| --- | --- | --- | --- | --- | --- |
| CQC-01 | PERK reduces translation during ER stress | ER lumen → PERK → eIF2α → translation initiation | acute signaling | foregone synthesis; kinase signaling | `P-006`; fast load shedding |
| CQC-02 | ATF6 and IRE1/XBP1 increase longer-horizon folding and degradation capacity | ER sensors → processed/spliced transcription factors → nucleus | transcriptional, acute-to-chronic | transcription, translation, chaperones, degradation capacity | `P-006` + `P-009` |
| CQC-03 | CHOP/GADD34-mediated restart can reload an unresolved compartment and worsen injury | persistent stress → CHOP → GADD34/ERO1α → synthesis and oxidation | prolonged stress | renewed client load and redox cost | failure boundary for `P-006` |
| CQC-04 | CHIP changes a chaperone client from folding to ubiquitin-proteasome degradation | client conformation/chaperone state → CHIP → ubiquitin → proteasome | client lifecycle | ATP-dependent chaperone and proteasome work | `P-003` + `P-009` |
| CQC-05 | ubiquitination and aggregation state alter spatial routing of misfolded proteins | local tag/state → juxtanuclear or perivacuolar compartment | minutes-to-hours in cell models | transport, sequestration, retained capacity | `P-008` + `P-009` |
| CQC-06 | fission and selective re-fusion segregate lower-potential mitochondrial daughters | local membrane potential/fusion competence → network exclusion → autophagy | seconds-to-hours in tracked cells | fission/fusion and lost respiratory capacity | `P-008` + `P-010` |
| CQC-07 | mitochondrial-derived vesicles remove selected cargo before whole-organelle mitophagy | oxidative state/cargo selection → vesicle → lysosome | early stress response | vesicle formation, transport, lysosomal degradation | selective extraction under `P-009` |
| CQC-08 | PINK1/phospho-ubiquitin/Parkin amplifies a depolarization-triggered removal tag | membrane potential → PINK1 → phospho-ubiquitin/Parkin → autophagy | acute induced damage | phosphorylation, ubiquitination, autophagy; organelle loss | `P-003` + `P-009`; scope-limited |
| CQC-09 | ESCRT repair precedes lysophagy; Galectin-3 coordinates repair, later removal, and TFEB-associated replacement | exposed lumenal glycans → Gal3/ALIX/ESCRT → autophagy/TFEB | minutes for repair recruitment; later removal/replacement | membrane remodeling, autophagy, biogenesis | held containment/triage candidate |
| CQC-10 | mitophagy and biogenesis are coupled by stress-responsive retrograde signaling | mitochondrial deficit → SKN-1 → DCT-1 plus biogenesis genes | stress/age-dependent organismal response | turnover plus new organelle synthesis | `P-006` + `P-009` |

Timescales are qualitative ranges tied to the cited preparations. They are not
portable constants for an engineered system.

## CQC-01 — Fast load shedding precedes repair-capacity expansion

**Primary evidence.** Harding, Zhang, and Ron identified the ER-resident kinase
PERK and showed that ER stress increases its kinase activity; PERK
phosphorylates eIF2α at Ser51 and inhibits translation initiation
([Nature 1999](https://doi.org/10.1038/16729)). In a different branch, Yoshida
et al. showed that ATF6 induces `XBP1` transcription while IRE1 splices its
mRNA, and that the spliced product is the strongly active UPR transcription
factor ([Cell 2001](https://doi.org/10.1016/S0092-8674(01)00611-0)). Wu et al.
deleted `Atf6α` in mice: basal development and basal chaperone expression were
largely preserved, but stressed cells and tissues were impaired in folding,
secretion, degradation, recovery, chronic-stress tolerance, organ function,
and survival ([Developmental Cell 2007](https://doi.org/10.1016/j.devcel.2007.07.005)).

**Mechanism and information flow.** One sensor branch rapidly reduces arrival
of new folding work; other branches transmit compartment state to the nucleus
and increase future capacity. The system therefore controls both the **input
rate** and the **service capacity** of the stressed compartment. Cross-branch
convergence at XBP1 shows coordination, not interchangeable redundant sensors.

**Costs and failure boundary.** Translation attenuation immediately forgoes
useful output. Transcriptional adaptation consumes time, transcription,
translation, chaperone capacity, and degradation capacity. `Atf6α` deletion
being mild at baseline but damaging under challenge warns against evaluating a
maintenance mechanism only on an undisturbed workload.

**Deduplication.** This is an unusually concrete biological implementation of
[`P-006`](../principle-registry.md#p-006--homeostatic-negative-feedback): reduce
load and later change capacity from a sensed aggregate error. The slower
capacity program belongs adjacent to
[`P-009`](../principle-registry.md#p-009--maintenance-plane). It is not evidence
for a new principle by itself.

**Strongest null and decisive AI test.** Compare an anomaly-triggered
throttle-plus-capacity controller with fixed admission control, backpressure,
queue-length autoscaling, and robust model serving with a static reserve. Inject
bursty corrupt inputs and internal latency faults. Match peak reserve and
controller compute. Reject the biological translation if it does not improve
useful work per joule and tail-risk-adjusted availability, or if it oscillates,
chronically under-utilizes capacity, or amplifies a transient false alarm.

## CQC-02 — Recovery feedback can become a destructive overcorrection

**Primary evidence.** Marciniak et al. used `Chop`-null and GADD34-mutant cells
and mice plus pharmacological redox interventions. CHOP induced GADD34, which
dephosphorylated eIF2α and restored client-protein synthesis; it also induced
the oxidase ERO1α. Removing CHOP or preventing GADD34-mediated dephosphorylation
reduced abnormal high-molecular-weight complexes, and the mutant mice resisted
tunicamycin-associated renal toxicity
([Genes & Development 2004](https://doi.org/10.1101/gad.1250704)).

**Mechanism and boundary.** A controller that correctly resumes throughput
after a resolved transient can be harmful when the service defect persists.
The same feedback action—release of translation attenuation—changes from
recovery to positive load amplification. This is a direct warning against an
AI controller that interprets elapsed time as proof of recovery.

**Registry disposition.** Failure mode of
[`P-006`](../principle-registry.md#p-006--homeostatic-negative-feedback), with a
[`P-003`](../principle-registry.md#p-003--temporary-trace-before-commitment)
implication: release from a temporary protective state should require new
evidence, not only decay of the timer.

**AI test.** After a throttle event, independently vary whether the inducing
fault has cleared. Compare time-only restart, health-probe-gated restart,
closed-loop rate ramp, and circuit-breaker baselines. Measure recurrent
overload, lost useful work, time to recovery, interventions, and energy. A
candidate “UPR-like” controller fails if health-gated conventional backpressure
dominates it.

## CQC-03 — Chaperone-mediated triage couples repair evidence to destruction

**Primary evidence.** Connell et al. showed that the co-chaperone CHIP remodels
Hsp90 complexes, releases p23, abolishes glucocorticoid-receptor activity,
induces receptor ubiquitination, and routes the client to proteasomal
degradation rather than continued chaperone-assisted folding
([Nature Cell Biology 2001](https://doi.org/10.1038/35050618)). Babbitt et al.
then biochemically reconstituted a ubiquitinated substrate–26S proteasome cycle
and showed that ATP hydrolysis participates in substrate degradation and 19S
regulatory-particle disassembly
([Cell 2005](https://doi.org/10.1016/j.cell.2005.03.028)).

**Mechanism and information flow.** A chaperone-accessible client is not simply
“bad.” Its interaction state becomes evidence for whether to continue folding
or add a degradation tag. The tag changes downstream routing. Repair and
destruction therefore share sensors but are distinct actions.

**Resource boundary.** Neither refolding nor disposal is free: chaperones,
ubiquitin machinery, substrate transport/unfolding, and proteasomal processing
consume resources, including ATP. The cited glucocorticoid receptor is one
client in a cellular model; CHIP is not a universal scalar damage score.

**Deduplication.** The provisional mark and option to reverse/continue map to
[`P-003`](../principle-registry.md#p-003--temporary-trace-before-commitment);
the lifecycle decision maps to
[`P-009`](../principle-registry.md#p-009--maintenance-plane). What is worth
testing is not “use ubiquitin in AI,” but whether **local repair evidence can
avoid both premature deletion and repeated futile repair**.

**AI test.** Corrupt individual experts, adapters, cache entries, and memory
records with faults of known repairability. Give the controller only local
health traces. Compare fixed retry limits, confidence thresholds, LRU/TTL,
oracle labels, checkpoint restore, and learned repair-or-retire triage. Charge
diagnosis, retries, copying, downtime, and replacement training. Reject the
candidate if it cannot beat the best fixed or Bayesian decision policy outside
its training fault distribution.

## CQC-04 — Tags and physical state alter containment routes

**Primary evidence.** Kaganovich, Kopito, and Frydman observed two distinct
quality-control inclusions in yeast and mammalian cell culture. Soluble,
ubiquitinated misfolded proteins accumulated in a juxtanuclear compartment
enriched in proteasomes, whereas terminal aggregates accumulated in a
perivacuolar inclusion. Impairing ubiquitination blocked juxtanuclear routing;
enhancing ubiquitination redirected part of a prion substrate toward it
([Nature 2008](https://doi.org/10.1038/nature07195)).

**Mechanism and information flow.** Routing depends jointly on an explicit
tag and a physical property—aggregation/solubility. Compartments can increase
encounter rates with repair/degradation machinery and keep poorly reversible
material away from normal interactions. Containment therefore limits blast
radius before clearance finishes.

**Boundary.** The named compartments and routing rules came from particular
reporters and culture conditions. Sequestration may protect, concentrate toxic
species, or simply reveal saturated clearance; it is not automatically
beneficial. A tag can also be mistaken or manipulated.

**Deduplication.** The spatial separation belongs to
[`P-008`](../principle-registry.md#p-008--compartmentalized-interaction); the
handling policy belongs to `P-009`. The under-covered operation is a
**quarantine state with bounded privileges and explicit exit conditions**, not
another permanent module partition.

**AI test.** Inject faults that can spread through shared attention, retrieval,
or parameter updates. Compare no isolation, static shards, access-control
sandboxing, taint tracking, rollback, and tag-driven quarantine. Measure
secondary corruptions, false quarantines, time-to-diagnosis, retained service,
and bytes/joules. The candidate fails if static least privilege or conventional
taint tracking gives the same containment at lower lifecycle cost.

## CQC-05 — Network dynamics can segregate a suspect subcomponent before removal

**Primary evidence.** Twig et al. photolabeled and tracked individual
mitochondria. Fission often produced daughters with unequal membrane potential;
the lower-potential daughter was less likely to fuse again. Inhibiting fission
with dominant-negative DRP1 or `FIS1` RNA interference reduced mitochondrial
autophagy, increased oxidized mitochondrial proteins, reduced respiration, and
impaired insulin secretion
([The EMBO Journal 2008](https://doi.org/10.1038/sj.emboj.7601963)).

**Mechanism and information flow.** Fission exposes within-component
heterogeneity; selective re-fusion acts as a functional gate. The suspect
daughter loses access to the shared mitochondrial network before autophagic
removal. Isolation is thus produced by a topology transition driven by local
functional state.

**Boundary.** These interventions alter mitochondrial morphology and function
in β-cell and cultured-cell preparations; they do not prove that fragmentation
is generally protective. Excess fragmentation can itself be pathological.

**Deduplication.** Dynamic exclusion maps to `P-008`; making a recurring
functional distinction structural maps to
[`P-010`](../principle-registry.md#p-010--structural-offloading-and-co-design).
It is evidence for testing reversible topology-based containment, not for
copying mitochondrial fission.

**AI test.** Give a modular model shared state and dynamically separable
submodules. Corrupt a fraction of one module while preserving useful state in
the rest. Compare whole-module restart, static partitioning, replica failover,
checkpoint rollback, and health-gated split-and-test. Require the split policy
to preserve unaffected work and later rejoin repaired components. Reject it if
split/rejoin overhead or false isolation exceeds the collateral work saved.

## CQC-06 — Selective extraction can precede whole-component recycling

**Primary evidence.** Soubannier et al. used confocal and electron microscopy
to show that mitochondria-derived vesicles (MDVs) carry selected cargo to
lysosomes. MDVs occurred at steady state, increased early under oxidative
stress, and reached lysosomes without requiring mitochondrial depolarization,
ATG5, or LC3, distinguishing the route from canonical whole-organelle
mitophagy ([Current Biology 2012](https://doi.org/10.1016/j.cub.2011.11.057)).

**Mechanism and information flow.** Local cargo selection and vesicle transport
permit damaged molecular components to be removed while retaining the
mitochondrion. This is more granular than “repair or replace”: extraction is a
third option whose value depends on fault locality.

**Boundary.** The study establishes a route and stress response, not the full
cargo-selection code or a proof that MDVs always restore organelle function.
Vesicle production and lysosomal degradation have transport and processing
costs.

**Deduplication.** Selective extraction is a concrete action within `P-009`.
It should not be promoted separately unless subcomponent salvage beats
checkpoint restore or component replacement under matched fault locality and
state-transfer cost.

**AI test.** Corrupt localized tensors, expert weights, indexes, or key–value
segments. Compare full checkpoint restoration, replica replacement,
recomputation, retraining, and provenance-guided selective reconstruction.
Sweep fault locality and dependency density. The candidate should win only in
a measurable region where reconstruction scope remains small; reject any claim
of general superiority outside that region.

## CQC-07 — Damage-triggered tag amplification supports decisive removal, but not all turnover

**Primary evidence.** Narendra et al. showed that Parkin is recruited to
low-membrane-potential mitochondria in mammalian cells and promotes their
engulfment and selective elimination by autophagy
([Journal of Cell Biology 2008](https://doi.org/10.1083/jcb.200809125)). Koyano
et al. showed that PINK1 phosphorylates ubiquitin at Ser65 after loss of
mitochondrial membrane potential and used phosphomimetic and in-vitro
interventions to demonstrate activation of Parkin E3 activity
([Nature 2014](https://doi.org/10.1038/nature13392)). This forms a damage-gated
positive-feedback tag: PINK1 generates phospho-ubiquitin, Parkin extends
ubiquitin tagging, and tagged surface creates more substrate for the pathway.

**Critical generality check.** In intact mito-QC reporter mice, McWilliams et
al. observed widespread basal mitophagy in high-metabolic-demand tissues that
persisted without `Pink1`
([Cell Metabolism 2018](https://doi.org/10.1016/j.cmet.2017.12.008)). The
PINK1/Parkin depolarization pathway must therefore not be presented as the
universal controller of mitochondrial turnover.

**Costs and failure boundary.** Amplification can convert weak local evidence
into a decisive destructive commitment, but it can also amplify a mistaken
tag. Removal forfeits remaining component capacity and invokes autophagic
processing plus later replacement. The canonical acute depolarization assays
do not establish thresholds for physiological basal damage.

**Deduplication.** Accumulating a reversible local mark before destructive
commitment is nearest to `P-003`; executing removal is `P-009`. The novel-looking
biochemistry reduces computationally to **evidence amplification with an
irreversible-action gate**, for which sequential tests and fault detectors are
strong nulls.

**AI test.** Seed weak, noisy fault evidence on components, including correlated
false positives and adversarial tags. Compare fixed thresholds, sequential
probability-ratio tests, cumulative-sum change detectors, quorum checkers, and
local self-amplifying tags. Measure detection delay, missed faults, collateral
deletions, spread before isolation, and total energy. Reject the mechanism if
ordinary sequential evidence accumulation matches it, or if modest correlated
tag error causes runaway retirement.

## CQC-08 — Repair, removal, and replacement form a staged response

**Primary evidence.** Radulovic et al. found that ESCRT-I, -II, and -III
components were recruited to damaged lysosomes before Galectin-3 and lysophagy.
Depletion of TSG101 or ALIX blocked repair and turned otherwise reversible
lysosomal damage into a lethal insult
([The EMBO Journal 2018](https://doi.org/10.15252/embj.201899753)). In the
reported cell experiments, ESCRT recruitment was detectable on a minutes
timescale, whereas loss-of-viability consequences were evaluated later; these
are preparation-specific observations, not universal deadlines.

Jia et al. then used lysosomal damage, Galectin-3 knockout, ALIX perturbation,
proteomics, imaging, and additional proteopathic and infection models. Exposed
lumenal glycans recruited cytosolic Galectin-3; Galectin-3 promoted ALIX/ESCRT
repair, controlled later autophagic handling, and when that handling failed in
Galectin-3-knockout cells a TFEB-associated lysosomal replacement program
increased ([Developmental Cell 2020](https://doi.org/10.1016/j.devcel.2019.10.025)).

**Mechanism and information flow.** Membrane rupture reveals a normally hidden
surface, converting boundary failure into an unambiguous local signal. The
same damage sensor participates in a staged policy: fast boundary repair,
later autophagic removal if repair is insufficient, and replacement when
capacity remains deficient. This is the clearest intervention-supported case
for distinguishing containment/triage from generic maintenance.

**Boundary.** The sequence is conditional, not a universal fixed timer. The
pathway can be exploited by intracellular pathogens, and more replacement does
not prove restored function. Galectin-3/ESCRT chemistry is not itself an AI
primitive.

**Deduplication and held candidate.** `P-009` supplies the maintenance actor;
`P-006` supplies deficit feedback; `P-003` supplies reversible state. The held
candidate is **severity-ordered containment and triage**: prefer the least
destructive action consistent with limiting propagation, escalate only on
failed verification or stronger damage evidence, and couple retirement to
capacity replacement. Promotion requires a matched systems win against the
nulls below.

**AI test.** Inject boundary violations into stateful modules: memory
corruption, runaway activations, malformed messages, and stale indexes.
Compare (a) checkpoint rollback, (b) replica failover, (c) microrestart, (d)
static quarantine plus rebuild, and (e) the staged ladder: revoke interfaces,
attempt local repair, run a bounded validation probe, selectively reconstruct,
then replace. Sweep fault locality, observability, repairability, and traffic.
Reject the candidate if it cannot reduce expected collateral loss at the same
availability, compute, storage, and operator-intervention budget.

## CQC-09 — Removal must be coupled to capacity replacement

**Primary evidence.** Komatsu et al. deleted `Atg7` specifically in the mouse
central nervous system. The mice developed behavioral deficits, neuronal loss,
and age-progressive ubiquitin-positive inclusions despite no obvious change in
proteasome function, showing that basal autophagy is required in this scoped
non-dividing tissue rather than only during starvation
([Nature 2006](https://doi.org/10.1038/nature04723)). Palikaras, Lionaki, and
Tavernarakis perturbed the mitophagy mediator `dct-1` and associated stress
pathways in *C. elegans*. Mitophagy impairment reduced stress resistance and
activated SKN-1-dependent retrograde signaling that regulated both `dct-1` and
mitochondrial-biogenesis genes
([Nature 2015](https://doi.org/10.1038/nature14300)).

**Mechanism and information flow.** Continual low-rate turnover prevents
damage accumulation in long-lived cells. At organelle scale, a deficit signal
links removal capacity to new synthesis; deleting without replenishing would
merely exchange corruption for capacity loss.

**Boundary.** Loss-of-function establishes necessity in these preparations,
not that aggressive autophagy or replacement is universally beneficial. New
capacity consumes material and energy; excessive turnover can destroy useful
state. The worm pathway does not establish the mammalian policy.

**Deduplication.** Basal lifecycle work is directly `P-009`; capacity feedback
is `P-006`. Replacement may involve `P-010` when new structure is provisioned,
but nothing here shows that structural offloading is the aim.

**AI test.** In a lifelong-learning system, compare no maintenance, periodic
full rebuild, fixed-rate retirement, checkpoint recovery, and
health-conditioned retirement coupled to measured replacement capacity.
Evaluate quality, availability, retained rare capabilities, resource headroom,
write amplification, and lifecycle energy over long runs. Reject the candidate
if fixed rejuvenation or replica rotation matches performance, or if the
controller silently erodes rare capability while aggregate quality stays
stable.

## Resource and timescale accounting

Any engineered translation must report the following rather than calling
maintenance “background” work:

| Quantity | Definition | Unit |
| --- | --- | --- |
| $E_{sense}$ | energy for health probes, tag generation, and diagnosis | J |
| $E_{contain}$ | energy for isolation, copying, access checks, and traffic rerouting | J |
| $E_{repair}$ | energy for retry, local optimization, reconstruction, or patching | J |
| $E_{recycle}$ | energy for destructive validation, deletion, compaction, and reclaim | J |
| $E_{replace}$ | energy for provisioning, transfer, retraining, and warm-up | J |
| $W_{lost}$ | useful work discarded or prevented by the intervention | task-appropriate work unit |
| $T_{unavailable}$ | service time below the declared availability threshold | s |
| $B_{spread}$ | secondary components affected by one initiating fault | component count or weighted state size |

For action $a$ on component $i$, a testable decision objective is

$$
J(a\mid z_i)=
\mathbb{E}[L_{residual}+L_{spread}+L_{collateral}+L_{downtime}\mid z_i,a]
+\lambda_E E_a+\lambda_W W_{lost,a},
$$

where $z_i$ is the observable health evidence; each $L$ is reported in a
declared task-loss unit or converted to one declared utility scale;
$E_a$ is joules; $W_{lost,a}$ is lost useful work; and $\lambda_E$ and
$\lambda_W$ are explicit conversion weights, not hidden constants.
$\lambda_E$ has units of task loss per joule and $\lambda_W$ has units of task
loss per work unit, so every term in $J$ has the declared task-loss unit. A
ladder is supported only if its learned or specified policy improves the Pareto
frontier without relying on an advantageous conversion weight.

A containment-specific outcome should also be reported:

$$
A_{spread}=\int_{t_0}^{t_{recover}}
\sum_{j\ne i} w_j\,\mathbf{1}[j\text{ is affected by fault }i],dt,
$$

where $t_0$ is the initiating-fault time, $t_{recover}$ is the time of verified
recovery, $j$ indexes every component other than initiating component $i$,
$w_j$ is a declared dimensionless importance weight, and the indicator is one
only while component $j$ is affected by fault $i$. Thus $A_{spread}$ has units
of weighted-component-seconds. This separates rapid blast-radius control from
eventual repair success.

## Strongest computing, control, and fault-tolerance nulls

The candidate is not novel merely because biology instantiates it with
proteins and organelles. The following must be treated as first-class baselines,
not footnotes:

| Null | What it already provides | What the candidate must add |
| --- | --- | --- |
| queue control, admission control, circuit breaking, and autoscaling | load shedding and capacity adaptation | better stability or lower full-lifecycle cost under partially observed, mixed fault types |
| sequential change detection and Bayesian decision theory | evidence accumulation and cost-sensitive thresholds | a superior local-information or correlated-fault tradeoff, not new vocabulary |
| static fault-containment domains, least privilege, and taint tracking | blast-radius limitation and tagged dataflow | adaptive isolation that saves useful work without unacceptable false quarantine |
| checkpoint/rollback and replica failover | known-good restoration and availability | cheaper recovery when fault locality is high and state transfer is expensive |
| microreboot and recursive restart | fine-grained restart without whole-service failure | validated repair-versus-restart selection, not merely smaller restart scope |
| concurrent/generational garbage collection | tracing, reclamation, barriers, and lifecycle scheduling | semantic damage handling that beats reachability/age heuristics after charging probes |
| RAID/error-correcting codes and scrubbing | reconstruction from redundancy and periodic damage correction | lower redundancy or movement cost for structured local faults |
| software rejuvenation | periodic or condition-based reset before aging failure | evidence-conditioned timing and granularity that wins outside the fitted aging model |

Canonical examples are Chandy and Lamport’s consistent distributed snapshots
([ACM TOCS 1985](https://doi.org/10.1145/214451.214456)), Dijkstra et al.’s
concurrent tracing collector
([CACM 1978](https://doi.org/10.1145/359642.359655)), Patterson, Gibson, and
Katz’s explicit redundancy/performance tradeoffs
([SIGMOD 1988](https://doi.org/10.1145/971701.50214)), and Candea et al.’s
fine-grained microrecovery evaluation
([USENIX OSDI 2004](https://www.usenix.org/conference/osdi-04/microreboot%E2%80%94-technique-cheap-recovery)).
See also the repository’s
[engineering-analogue audit](2026-08-05-engineering-analogues.md#p-009--maintenance-plane).

## Decisive integrated experiment: CQC-Bench

**System.** A stateful mixture-of-experts or modular agent with shared
retrieval, per-module checkpoints, replaceable adapters, and a measured
resource budget.

**Faults.** Factorially vary:

- localized versus diffuse parameter corruption;
- transient overload versus persistent service failure;
- wrong-but-readable memory versus unreadable state;
- interface leakage that spreads errors between modules;
- repairable versus irrecoverable faults;
- independent versus correlated/adversarial health tags; and
- slow capacity decay versus abrupt failure.

**Candidate ablation ladder.** Add in order: health sensing, input throttling,
interface quarantine, temporary tags, local repair, selective reconstruction,
component retirement, replacement, and post-action verification. Every added
stage must earn its overhead.

**Baselines.** No maintenance; fixed periodic maintenance; static isolation;
full checkpoint rollback; replica failover; microrestart; error-correcting or
redundant storage; conventional garbage collection; Bayesian repair/replace
decision; and an oracle with true fault type as an upper bound.

**Matched resources.** Equalize peak compute, persistent storage, replica
capacity, diagnostic calls, allowed downtime, and operator interventions. Use
wall-plug energy where available and otherwise publish the device-level
measurement boundary.

**Primary outcomes.** Useful task work per joule; time-weighted service quality;
$A_{spread}$; catastrophic-loss frequency; time to containment; time to
verified recovery; false isolation/deletion; rare-capability retention;
diagnostic bytes; state moved; and full lifecycle energy.

**Rejection criteria.** Reject the held candidate if any of the following
persists across preregistered fault mixtures:

1. the full ladder is Pareto-dominated by checkpointing, replication, or
   microrestart;
2. its apparent gain disappears when sensing, copying, replacement, and idle
   reserve are charged;
3. ordinary sequential decision policies choose actions as well with less
   complexity;
4. correlated tag error causes cascading quarantine or destructive deletion;
5. local metrics recover while rare capabilities or provenance silently
   degrade; or
6. the controller cannot define a stable release condition after containment.

## Superficial analogy traps

- Ubiquitin is not “importance weighting.” In these sources it participates in
  local routing and degradation decisions with context-dependent meaning.
- Autophagy is not ordinary parameter pruning. It encloses and degrades cargo,
  has constitutive and stress-induced roles, and can remove whole organelles.
- A lysosome is not a recycle bin unless transport, destructive processing,
  resource recovery, and failure of the recycler itself are modeled.
- PINK1/Parkin is not the universal mitophagy algorithm; basal mitophagy in the
  cited mouse tissues persisted without PINK1.
- Sequestration is not proof of successful repair. It may be containment,
  terminal storage, a response to saturated clearance, or a source of harm.
- “Repair first” is not an absolute. Severe faults, rapid spread, or cheap
  replicas can make immediate replacement optimal.
- Destruction without replenishment is not maintenance; it can preserve local
  cleanliness while causing global capacity collapse.

## Proposed C-claims for root integration

Temporary labels avoid collisions with claims proposed by parallel audits. The
root integrator should assign final `C-` numbers and independently verify ledger
fit.

### CQC-C1 — ER stress can rapidly reduce incoming protein-folding load

- **Status:** established in the cited cellular mechanism.
- **Statement:** ER stress activates PERK, which phosphorylates eIF2α Ser51 and
  attenuates translation initiation.
- **Primary source:** Harding, Zhang, and Ron (1999),
  [doi:10.1038/16729](https://doi.org/10.1038/16729).
- **Open issue:** timing, reversibility, and benefit across stress classes; no
  direct AI efficacy claim.
- **Likely use:** `P-006`, `P-009`.

### CQC-C2 — ATF6 is dispensable for much basal function but important under sustained ER challenge

- **Status:** established in the cited mouse deletion study.
- **Statement:** `Atf6α` deletion left basal development largely intact but
  impaired stressed folding, secretion, degradation, recovery, chronic-stress
  tolerance, and challenged-organ survival.
- **Primary source:** Wu et al. (2007),
  [doi:10.1016/j.devcel.2007.07.005](https://doi.org/10.1016/j.devcel.2007.07.005).
- **Open issue:** tissue and stress-specific dependencies.
- **Likely use:** `P-006`, `P-009`.

### CQC-C3 — Recovery-driven load restoration can worsen unresolved ER stress

- **Status:** established in the cited genetic/pharmacological preparations.
- **Statement:** CHOP-driven GADD34 and ERO1α increased protein-synthesis/redox
  load; `Chop` loss or blocked GADD34-mediated eIF2α dephosphorylation reduced
  complexes and tunicamycin toxicity.
- **Primary source:** Marciniak et al. (2004),
  [doi:10.1101/gad.1250704](https://doi.org/10.1101/gad.1250704).
- **Open issue:** when adaptive restart crosses into harmful overcorrection.
- **Likely use:** failure boundary for `P-006`; release gate for `P-003`.

### CQC-C4 — A co-chaperone can shift a client from folding toward tagged degradation

- **Status:** established for the cited Hsp90/glucocorticoid-receptor system.
- **Statement:** CHIP remodels the chaperone complex, induces client
  ubiquitination, and promotes proteasomal degradation.
- **Primary source:** Connell et al. (2001),
  [doi:10.1038/35050618](https://doi.org/10.1038/35050618).
- **Open issue:** generality across substrates and quantitative repair-versus-
  degradation policy.
- **Likely use:** `P-003`, `P-009`.

### CQC-C5 — Tag and aggregation state can redirect misfolded material between compartments

- **Status:** established in the cited yeast and mammalian culture models.
- **Statement:** soluble ubiquitinated clients and terminal aggregates
  partitioned to distinct inclusions; changing ubiquitination changed routing.
- **Primary source:** Kaganovich, Kopito, and Frydman (2008),
  [doi:10.1038/nature07195](https://doi.org/10.1038/nature07195).
- **Open issue:** whether sequestration is protective, degradative, or harmful
  for each cargo and context.
- **Likely use:** `P-008`, `P-009`.

### CQC-C6 — Mitochondria can export selected cargo to lysosomes without whole-organelle mitophagy

- **Status:** established route in the cited cellular preparations.
- **Statement:** stress-responsive MDVs carried selected mitochondrial cargo to
  lysosomes independently of depolarization, ATG5, and LC3.
- **Primary source:** Soubannier et al. (2012),
  [doi:10.1016/j.cub.2011.11.057](https://doi.org/10.1016/j.cub.2011.11.057).
- **Open issue:** cargo-selection rules, restoration of function, and in-vivo
  prevalence.
- **Likely use:** granular repair/recycle action within `P-009`.

### CQC-C7 — PINK1-phosphorylated ubiquitin activates Parkin after induced mitochondrial depolarization

- **Status:** established for the scoped biochemical/cellular mechanism. The
  universal basal-mitophagy version is `disputed`.
- **Statement:** PINK1-dependent ubiquitin Ser65 phosphorylation activates
  Parkin and supports a feed-forward damage-tagging pathway, but basal
  mitophagy in several high-demand mouse tissues persisted without PINK1.
- **Primary sources:** Koyano et al. (2014),
  [doi:10.1038/nature13392](https://doi.org/10.1038/nature13392); McWilliams et
  al. (2018),
  [doi:10.1016/j.cmet.2017.12.008](https://doi.org/10.1016/j.cmet.2017.12.008).
- **Open issue:** physiological trigger regimes and pathway redundancy.
- **Likely use:** `P-003`, `P-009` with an explicit scope warning.

### CQC-C8 — ESCRT repair precedes lysophagy after reversible lysosomal injury

- **Status:** established in the cited cultured-cell and infection-associated
  preparations.
- **Statement:** ESCRT machinery arrived before Galectin-3/lysophagy, and
  blocking TSG101/ALIX-dependent repair converted reversible damage into lethal
  damage.
- **Primary source:** Radulovic et al. (2018),
  [doi:10.15252/embj.201899753](https://doi.org/10.15252/embj.201899753).
- **Open issue:** damage-severity boundary and generality across organelles.
- **Likely use:** `P-009`; held containment/triage candidate.

### CQC-C9 — A lysosomal damage sensor coordinates repair, later removal, and replacement signaling

- **Status:** plausible as an integrated, ordered policy; the individual
  subprocesses are established within the cited preparations.
- **Statement:** Galectin-3 sensing of damage-exposed glycans supported
  ALIX/ESCRT repair, later autophagic responses, and, when those failed,
  increased TFEB-associated replacement signaling.
- **Primary source:** Jia et al. (2020),
  [doi:10.1016/j.devcel.2019.10.025](https://doi.org/10.1016/j.devcel.2019.10.025).
- **Open issue:** action thresholds, verification, pathogen exploitation, and
  whether this policy outperforms parallel rather than staged action.
- **Likely use:** `P-003`, `P-006`, `P-009`; held containment/triage candidate.

### CQC-C10 — Mitophagy and mitochondrial biogenesis can be coupled by retrograde stress signaling

- **Status:** established in the cited *C. elegans* interventions.
- **Statement:** impaired `dct-1`-dependent mitophagy reduced stress resistance
  and activated SKN-1-dependent regulation of both mitophagy and mitochondrial-
  biogenesis genes.
- **Primary source:** Palikaras, Lionaki, and Tavernarakis (2015),
  [doi:10.1038/nature14300](https://doi.org/10.1038/nature14300).
- **Open issue:** mammalian generality, energetic cost, and over-replacement.
- **Likely use:** `P-006`, `P-009`.

## Complete BibTeX entries for root integration

```bibtex
@article{Harding1999PERK,
  author  = {Harding, Heather P. and Zhang, Yuhong and Ron, David},
  title   = {Protein Translation and Folding Are Coupled by an Endoplasmic-Reticulum-Resident Kinase},
  journal = {Nature},
  year    = {1999},
  volume  = {397},
  number  = {6716},
  pages   = {271--274},
  doi     = {10.1038/16729},
  url     = {https://doi.org/10.1038/16729}
}

@article{Yoshida2001XBP1,
  author  = {Yoshida, Hiderou and Matsui, Tetsuya and Yamamoto, Akio and Okada, Tetsuya and Mori, Kazutoshi},
  title   = {{XBP1} mRNA Is Induced by {ATF6} and Spliced by {IRE1} in Response to {ER} Stress to Produce a Highly Active Transcription Factor},
  journal = {Cell},
  year    = {2001},
  volume  = {107},
  number  = {7},
  pages   = {881--891},
  doi     = {10.1016/S0092-8674(01)00611-0},
  url     = {https://doi.org/10.1016/S0092-8674(01)00611-0}
}

@article{Wu2007ATF6,
  author  = {Wu, Jun and Rutkowski, D. Thomas and Dubois, Meghan and Swathirajan, Jayanth and Saunders, Thomas and Wang, Junying and Song, Benbo and Yau, Grace D.-Y. and Kaufman, Randal J.},
  title   = {{ATF6alpha} Optimizes Long-Term Endoplasmic Reticulum Function to Protect Cells from Chronic Stress},
  journal = {Developmental Cell},
  year    = {2007},
  volume  = {13},
  number  = {3},
  pages   = {351--364},
  doi     = {10.1016/j.devcel.2007.07.005},
  url     = {https://doi.org/10.1016/j.devcel.2007.07.005}
}

@article{Marciniak2004CHOP,
  author  = {Marciniak, Stefan J. and Yun, Chi Y. and Oyadomari, Seiichi and Novoa, Isabel and Zhang, Yuhong and Jungreis, Rivka and Nagata, Kazuhiro and Harding, Heather P. and Ron, David},
  title   = {{CHOP} Induces Death by Promoting Protein Synthesis and Oxidation in the Stressed Endoplasmic Reticulum},
  journal = {Genes \& Development},
  year    = {2004},
  volume  = {18},
  number  = {24},
  pages   = {3066--3077},
  doi     = {10.1101/gad.1250704},
  url     = {https://doi.org/10.1101/gad.1250704}
}

@article{Connell2001CHIP,
  author  = {Connell, Paul and Ballinger, Carol A. and Jiang, Jiong and Wu, Yao and Thompson, Leslie J. and Hohfeld, Jorg and Patterson, Cam},
  title   = {The Co-Chaperone {CHIP} Regulates Protein Triage Decisions Mediated by Heat-Shock Proteins},
  journal = {Nature Cell Biology},
  year    = {2001},
  volume  = {3},
  number  = {1},
  pages   = {93--96},
  doi     = {10.1038/35050618},
  url     = {https://doi.org/10.1038/35050618}
}

@article{Babbitt2005ProteasomeATP,
  author  = {Babbitt, Shalon E. and Kiss, Alexi and Deffenbaugh, Andrew E. and Chang, Yie-Hwa and Bailly, Eric and Erdjument-Bromage, Hediye and Tempst, Paul and Buranda, Tione and Sklar, Larry A. and Baumler, Jennifer and Gogol, Edward and Skowyra, Dorota},
  title   = {{ATP} Hydrolysis-Dependent Disassembly of the {26S} Proteasome Is Part of the Catalytic Cycle},
  journal = {Cell},
  year    = {2005},
  volume  = {121},
  number  = {4},
  pages   = {553--565},
  doi     = {10.1016/j.cell.2005.03.028},
  url     = {https://doi.org/10.1016/j.cell.2005.03.028}
}

@article{Kaganovich2008Compartments,
  author  = {Kaganovich, Daniel and Kopito, Ron and Frydman, Judith},
  title   = {Misfolded Proteins Partition between Two Distinct Quality Control Compartments},
  journal = {Nature},
  year    = {2008},
  volume  = {454},
  number  = {7208},
  pages   = {1088--1095},
  doi     = {10.1038/nature07195},
  url     = {https://doi.org/10.1038/nature07195}
}

@article{Komatsu2006Atg7,
  author  = {Komatsu, Masaaki and Waguri, Satoshi and Chiba, Tomoki and Murata, Shigeo and Iwata, Jun-ichi and Tanida, Isei and Ueno, Takashi and Koike, Masato and Uchiyama, Yasuo and Kominami, Eiki and Tanaka, Keiji},
  title   = {Loss of Autophagy in the Central Nervous System Causes Neurodegeneration in Mice},
  journal = {Nature},
  year    = {2006},
  volume  = {441},
  number  = {7095},
  pages   = {880--884},
  doi     = {10.1038/nature04723},
  url     = {https://doi.org/10.1038/nature04723}
}

@article{Twig2008FissionFusion,
  author  = {Twig, Gilad and Elorza, Alvaro and Molina, Anthony J. A. and Mohamed, Hibo and Wikstrom, Jakob D. and Walzer, Gil and Stiles, Linsey and Haigh, Sarah E. and Katz, Steve and Las, Guy and Alroy, Joseph and Wu, Min and Py, Benedicte F. and Yuan, Junying and Deeney, Jude T. and Corkey, Barbara E. and Shirihai, Orian S.},
  title   = {Fission and Selective Fusion Govern Mitochondrial Segregation and Elimination by Autophagy},
  journal = {The EMBO Journal},
  year    = {2008},
  volume  = {27},
  number  = {2},
  pages   = {433--446},
  doi     = {10.1038/sj.emboj.7601963},
  url     = {https://doi.org/10.1038/sj.emboj.7601963}
}

@article{Narendra2008Parkin,
  author  = {Narendra, Derek and Tanaka, Atsushi and Suen, Der-Fen and Youle, Richard J.},
  title   = {Parkin Is Recruited Selectively to Impaired Mitochondria and Promotes Their Autophagy},
  journal = {Journal of Cell Biology},
  year    = {2008},
  volume  = {183},
  number  = {5},
  pages   = {795--803},
  doi     = {10.1083/jcb.200809125},
  url     = {https://doi.org/10.1083/jcb.200809125}
}

@article{Soubannier2012MDV,
  author  = {Soubannier, Vincent and McLelland, Gian-Luca and Zunino, Rodolfo and Braschi, Emelie and Rippstein, Peter and Fon, Edward A. and McBride, Heidi M.},
  title   = {A Vesicular Transport Pathway Shuttles Cargo from Mitochondria to Lysosomes},
  journal = {Current Biology},
  year    = {2012},
  volume  = {22},
  number  = {2},
  pages   = {135--141},
  doi     = {10.1016/j.cub.2011.11.057},
  url     = {https://doi.org/10.1016/j.cub.2011.11.057}
}

@article{Koyano2014PhosphoUbiquitin,
  author  = {Koyano, Fumika and Okatsu, Kei and Kosako, Hidetaka and Tamura, Yasushi and Go, Etsu and Kimura, Mayumi and Kimura, Yoko and Tsuchiya, Hikaru and Yoshihara, Hidehito and Hirokawa, Takatsugu and Endo, Toshiya and Fon, Edward A. and Trempe, Jean-Francois and Saeki, Yasushi and Tanaka, Keiji and Matsuda, Noriyuki},
  title   = {Ubiquitin Is Phosphorylated by {PINK1} to Activate Parkin},
  journal = {Nature},
  year    = {2014},
  volume  = {510},
  number  = {7503},
  pages   = {162--166},
  doi     = {10.1038/nature13392},
  url     = {https://doi.org/10.1038/nature13392}
}

@article{McWilliams2018BasalMitophagy,
  author  = {McWilliams, Thomas G. and Prescott, Alan R. and Montava-Garriga, Lambert and Ball, Graeme and Singh, Francois and Barini, Erica and Muqit, Miratul M. K. and Brooks, Simon P. and Ganley, Ian G.},
  title   = {Basal Mitophagy Occurs Independently of {PINK1} in Mouse Tissues of High Metabolic Demand},
  journal = {Cell Metabolism},
  year    = {2018},
  volume  = {27},
  number  = {2},
  pages   = {439--449.e5},
  doi     = {10.1016/j.cmet.2017.12.008},
  url     = {https://doi.org/10.1016/j.cmet.2017.12.008}
}

@article{Palikaras2015MitophagyBiogenesis,
  author  = {Palikaras, Konstantinos and Lionaki, Eirini and Tavernarakis, Nektarios},
  title   = {Coordination of Mitophagy and Mitochondrial Biogenesis during Ageing in {C. elegans}},
  journal = {Nature},
  year    = {2015},
  volume  = {521},
  number  = {7553},
  pages   = {525--528},
  doi     = {10.1038/nature14300},
  url     = {https://doi.org/10.1038/nature14300}
}

@article{Radulovic2018LysosomeRepair,
  author  = {Radulovic, Maja and Schink, Kay O. and Wenzel, Eva M. and Nahse, Viola and Bongiovanni, Antonino and Lafont, Frank and Stenmark, Harald},
  title   = {{ESCRT}-Mediated Lysosome Repair Precedes Lysophagy and Promotes Cell Survival},
  journal = {The EMBO Journal},
  year    = {2018},
  volume  = {37},
  number  = {21},
  pages   = {e99753},
  doi     = {10.15252/embj.201899753},
  url     = {https://doi.org/10.15252/embj.201899753}
}

@article{Jia2020Galectin3,
  author  = {Jia, Jingyue and Claude-Taupin, Aurore and Gu, Yuexi and Choi, Seong Won and Peters, Ryan and Bissa, Bhawana and Mudd, Michal H. and Allers, Lee and Pallikkuth, Sandeep and Lidke, Keith A. and Salemi, Michelle and Phinney, Brett and Mari, Muriel and Reggiori, Fulvio and Deretic, Vojo},
  title   = {Galectin-3 Coordinates a Cellular System for Lysosomal Repair and Removal},
  journal = {Developmental Cell},
  year    = {2020},
  volume  = {52},
  number  = {1},
  pages   = {69--87.e8},
  doi     = {10.1016/j.devcel.2019.10.025},
  url     = {https://doi.org/10.1016/j.devcel.2019.10.025}
}

@article{ChandyLamport1985Snapshots,
  author  = {Chandy, K. Mani and Lamport, Leslie},
  title   = {Distributed Snapshots: Determining Global States of Distributed Systems},
  journal = {ACM Transactions on Computer Systems},
  year    = {1985},
  volume  = {3},
  number  = {1},
  pages   = {63--75},
  doi     = {10.1145/214451.214456},
  url     = {https://doi.org/10.1145/214451.214456}
}

@article{Dijkstra1978GarbageCollection,
  author  = {Dijkstra, Edsger W. and Lamport, Leslie and Martin, A. J. and Scholten, C. S. and Steffens, E. F. M.},
  title   = {On-the-Fly Garbage Collection: An Exercise in Cooperation},
  journal = {Communications of the ACM},
  year    = {1978},
  volume  = {21},
  number  = {11},
  pages   = {966--975},
  doi     = {10.1145/359642.359655},
  url     = {https://doi.org/10.1145/359642.359655}
}

@inproceedings{Patterson1988RAID,
  author    = {Patterson, David A. and Gibson, Garth and Katz, Randy H.},
  title     = {A Case for Redundant Arrays of Inexpensive Disks ({RAID})},
  booktitle = {Proceedings of the 1988 ACM SIGMOD International Conference on Management of Data},
  year      = {1988},
  pages     = {109--116},
  publisher = {Association for Computing Machinery},
  doi       = {10.1145/971701.50214},
  url       = {https://doi.org/10.1145/971701.50214}
}

@inproceedings{Candea2004Microreboot,
  author    = {Candea, George and Kawamoto, Shinichi and Fujiki, Yuichi and Friedman, Greg and Fox, Armando},
  title     = {Microreboot---A Technique for Cheap Recovery},
  booktitle = {6th Symposium on Operating Systems Design and Implementation (OSDI 04)},
  year      = {2004},
  month     = {December},
  pages     = {31--44},
  publisher = {USENIX Association},
  address   = {San Francisco, CA},
  url       = {https://www.usenix.org/conference/osdi-04/microreboot%E2%80%94-technique-cheap-recovery}
}
```

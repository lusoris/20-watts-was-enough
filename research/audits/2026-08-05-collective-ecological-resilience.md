# Primary-source audit: collective and ecological resilience

**Promoted evidence:** [C-052](../claims.md#c-052)–[C-060](../claims.md#c-060).

**Audit date:** 2026-08-05  
**Scope:** collective animal decisions, host-associated microbial ecosystems,
ecological resilience, succession-like replacement, and early warning of state
transitions  
**Purpose:** candidate evidence for later claim-ledger review; this file does
not itself promote claims or create new principles

## Method and promotion rule

This audit includes nine original experimental or data-driven studies. A
finding is scoped to what the paper measured; a biological result is not
treated as evidence that the proposed engineered analogue will work. Each
record separates the observed result, inferred control loop, limits, nearest
existing principle, and a falsifiable systems experiment.

“Candidate new bundle” below means that the result does not cleanly reduce to
[`P-001`–`P-013`](../principle-registry.md). It is a proposal for registry
review, not a new `P-` identifier.

## Synthesis

| Study | Biological control pattern | Evidence type | Registry disposition | Audit priority |
| --- | --- | --- | --- | --- |
| Ward et al. (2008) | nonlinear quorum filters isolated social errors | controlled fish experiment plus fitted model | adjacent to `P-011`; candidate new bundle | high |
| Couzin et al. (2011) | uncommitted members reduce capture by a confident minority | theory plus fish experiment | nearest `P-006`, but not homeostasis | medium-high |
| Nagy et al. (2010) | directional influence forms a sparse hierarchy | high-resolution flock telemetry | deduplicate into `P-011` | medium |
| Buffie et al. (2015) | a specialist changes a shared substrate to resist invasion | mouse intervention plus human/mouse data | `P-013`, with `P-008` and `P-009` | high |
| Brugiroux et al. (2017) | capability-gap analysis guides minimal community repair | gnotobiotic mouse intervention | `P-004` plus `P-008` | medium-high |
| Tian et al. (2020) | incumbent functional redundancy predicts poor newcomer engraftment | reanalysis of two human FMT datasets plus model | failure mode of `P-004`/`P-008` | medium |
| Veraart et al. (2012) | recovery slows before an experimentally driven tipping point | perturbed cyanobacterial microcosm | candidate new recovery-diagnostics bundle | high |
| Carpenter et al. (2011) | whole-food-web statistics warn during a multiyear regime shift | manipulated and reference lakes | same bundle as Veraart; do not duplicate | high |
| Pennekamp et al. (2018) | diversity improves one stability axis and worsens another | 690 manipulated ciliate microcosms | measurement constraint, not new architecture | high |

The audit supports three architectural candidates and one evaluation rule:

1. **Quorum-gated commitment:** require nonlinear, independently sourced
   support before an irreversible or high-risk action.
2. **Shared-substrate defense:** allow specialist modules to alter a shared
   environment so that unsafe or parasitic processes become less viable.
3. **Probe-and-recover health monitoring:** estimate fragility from response to
   bounded perturbations, not only from current task quality.
4. **Vector-valued resilience:** report temporal stability, acute resistance,
   recovery, adaptability, and newcomer acceptance separately.

## 1. Nonlinear quorum responses in stickleback decisions

**Primary study.** Ward, Sumpter, Couzin, Hart, and Krause, “Quorum
decision-making facilitates information transfer in fish shoals,” *PNAS* 105,
6948–6953 (2008). [DOI: 10.1073/pnas.0710344105](https://doi.org/10.1073/pnas.0710344105).

**Exact scoped result.** Three-spined sticklebacks chose between arms of a
Y-maze while motorized replica conspecifics supplied controlled social cues,
with or without a replica predator. A solitary fish or group of two followed
one replica, whereas groups of four or eight largely ignored one replica and
required a second replica to show significant following. A fitted response
model favored a nonlinear quorum over no social response or weak linear
copying. The best-fit threshold steepness was reported as $k=3.25$ without the
predator and $k=2.25$ with it. Simulations of the fitted class, not the animal
experiment alone, predicted accuracy and speed advantages over independent or
weakly linear decision rules.

**Mechanism or causal loop.** Recent commitments to an option provide positive
feedback, but the probability of following rises disproportionately only after
support is large enough relative to opposing and still-uncommitted fish. This
filters isolated errors while retaining rapid commitment once evidence
accumulates. It can still amplify coordinated misinformation: multiple replicas
could lead fish past the predator.

**Timescale and information flow.** Local movement cues are integrated over a
single maze decision, on behavioral rather than developmental timescales.
Information flows from recent movers to nearby uncommitted fish; individuals
need not identify which demonstrator is informed.

**Limits.** The apparatus used small groups, binary paths, replica fish, and a
simulated predator. Threshold parameters are not universal constants. The
benefit assumes that errors are not too correlated; two coordinated bad cues
defeated the filter. Model predictions beyond the tested group sizes are not
additional animal evidence.

**Deduplication.** Nearest to [`P-011`](../principle-registry.md#p-011--transient-communication-coalitions)
because current activity creates a temporary coalition. It is not merely
time-windowed communication: the essential transformation is nonlinear
evidence-to-commitment gating. It does not use environmental shared state, so
it should not be folded into `P-013`. Candidate new bundle:
**thresholded collective commitment under anonymous evidence**.

**Strongest engineered analogue.** A high-risk action gate that accepts compact
votes from conditionally invoked, independently trained checkers and commits
only when support crosses a threshold relative to objections and abstentions.

**Falsifiable experiment.** Give modular agents binary safety decisions with a
known correct answer. Factorially vary group size, individual error rate, error
correlation, and adversarially coordinated voters. Compare (a) a single expert,
(b) linear vote, (c) fixed majority, and (d) learned relative quorum. Measure
error, abstention, decision latency, messages, joules, and catastrophic false
commitments. The candidate fails if its safety–latency Pareto frontier does not
dominate linear voting outside its tuning distribution or if modest correlated
errors erase the gain.

## 2. Uncommitted individuals as a brake on confident minorities

**Primary study.** Couzin et al., “Uninformed individuals promote democratic
consensus in animal groups,” *Science* 334, 1578–1580 (2011).
[DOI: 10.1126/science.1210280](https://doi.org/10.1126/science.1210280).

**Exact scoped result.** In a collective-motion model and experiments with
golden shiners trained to prefer colored targets, a strongly opinionated
minority could determine group direction under conflict. Adding fish without a
trained target preference inhibited minority capture across a reported range
of conditions and returned control to the numerical majority. The study does
not show that uninformed members improve every group or decision.

**Mechanism or causal loop.** Strong preference changes the gain of social
influence, not just the number of votes. Uncommitted individuals contribute
social alignment without adding directional preference; in the studied
conflict, this dilutes the directional leverage of the intense minority and
lets the larger weakly opinionated cohort determine motion. This is a
collective gain-control effect rather than information creation.

**Timescale and information flow.** Target preferences were learned before the
test; consensus emerged through local motion alignment during a trial. Private
directional preference and current social direction combine at the individual,
then feed back into group motion.

**Limits.** The result depends on the relative sizes and preference strengths
of conflicting cohorts and on the movement model. “Uninformed” does not mean
randomly noisy: the added fish still followed social motion. Target-choice
behavior in small fish groups does not establish a general political or
multi-agent theorem.

**Deduplication.** It is adjacent to [`P-006`](../principle-registry.md#p-006--homeostatic-negative-feedback)
because it restrains a monopolizing positive-feedback loop, but no slower
controller senses aggregate state or restores a set point. It is also not
`P-011`: transient communication is present, but the distinctive effect is
preference dilution. Treat it as a possible subcase of the quorum/commitment
bundle above until an engineered experiment distinguishes them.

**Strongest engineered analogue.** Confidence-capped consensus in which
abstaining observers relay agreement structure but cannot inject a preferred
answer, preventing a small set of high-logit agents from dominating solely
through calibration error.

**Falsifiable experiment.** Create ensembles with a correct weak majority and
an incorrect overconfident minority. Add zero, moderate, or many abstaining
alignment agents and compare raw logit pooling, one-agent-one-vote, confidence
clipping, and neutral-agent gain control. Sweep error correlation and preference
strength. Reject the mechanism if abstainers merely add cost, if calibrated
clipping dominates at all operating points, or if they also suppress a correct
expert minority under the same uncertainty distribution.

## 3. Directed leadership networks in pigeon flocks

**Primary study.** Nagy, Ákos, Biro, and Vicsek, “Hierarchical group dynamics in
pigeon flocks,” *Nature* 464, 890–893 (2010).
[DOI: 10.1038/nature08891](https://doi.org/10.1038/nature08891).

**Exact scoped result.** Lightweight high-resolution GPS logs from homing
pigeons flying in flocks of up to ten were analyzed using lagged directional
correlations. Pairwise delays produced a well-defined leader–follower hierarchy;
average spatial position correlated with leadership rank, and responses were
faster to flock-mates viewed mainly through the left eye. The result shows an
organized, asymmetric lead–lag network in these flights.

**Mechanism or causal loop.** Directional changes propagate through a sparse
directed influence graph rather than requiring simultaneous all-to-all
agreement. However, the graph was inferred from temporal correlation. The study
did not manipulate a purported leader and therefore does not prove that the
earlier bird causally controls the later bird.

**Timescale and information flow.** Directional response delays occur below the
scale of whole flights; ranks were reconstructed across pairwise interactions
and multiple flights. Current heading information flows predominantly from
higher- to lower-ranked birds, while visual laterality affects response delay.

**Limits.** Flocks were small, birds were experienced homing pigeons, and a
lead–lag relation can include common-cause effects. The authors explicitly
limit the efficiency suggestion to flock sizes permitting regular pairwise
interactions. The paper does not show that a fixed hierarchy is optimal or that
it generalizes to large bird flocks.

**Deduplication.** Direct support for the abstraction already in
[`P-011`](../principle-registry.md#p-011--transient-communication-coalitions):
time-dependent effective connectivity can be sparse and directed. Leadership
selection also resembles `P-001`, but no new principle is needed.

**Strongest engineered analogue.** Learn a directed, lag-aware communication
graph among modules for each operating regime, with an asynchronous fallback
when the inferred leaders fail.

**Falsifiable experiment.** On cooperative navigation or distributed control,
compare all-to-all messaging, symmetric top-$k$, static hierarchy, and a learned
directed lag graph at matched accuracy. Measure bandwidth, latency, energy,
recovery after leader corruption/removal, and graph stability across tasks. The
analogue fails if directionality does not reduce communication at fixed quality
or produces unacceptable single-point failures.

## 4. Metabolite-mediated colonization resistance

**Primary study.** Buffie et al., “Precision microbiome reconstitution restores
bile acid mediated resistance to *Clostridium difficile*,” *Nature* 517,
205–208 (2015). [DOI: 10.1038/nature13828](https://doi.org/10.1038/nature13828).

**Exact scoped result.** Different antibiotic treatments created different
microbiota states and *C. difficile* susceptibility in mice. Modeling combined
with mouse and hospitalized-patient microbiota data identified resistance-
associated taxa. Administering *Clostridium scindens* after antibiotic exposure
enhanced resistance in mice; experiments linked the effect to the organism’s
7-alpha-dehydroxylation of host bile acids and made the protection dependent on
the presence of endogenous bile substrate.

**Mechanism or causal loop.** A specialist consumes a host-supplied substrate
and writes an inhibitory metabolite into the shared intestinal environment.
That environmental state makes invasion less viable without every host cell or
commensal directly detecting and attacking the pathogen. Antibiotics can remove
the specialist, break the conversion loop, and expose the niche.

**Timescale and information flow.** Community disruption, recolonization,
metabolite turnover, and pathogen expansion interact over the infection
experiment. Information is implicit in shared chemistry: host bile reaches the
specialist, whose product changes the growth conditions encountered by the
pathogen.

**Limits.** Protection was enhanced, not absolute. It was a mouse intervention
supported by cross-species association, not a human treatment trial. The effect
is conditional on bile chemistry and cannot be generalized to arbitrary
microbes, pathogens, or environmental metabolites.

**Deduplication.** A strong biological instance of
[`P-013`](../principle-registry.md#p-013--externalized-shared-state): a component
coordinates indirectly by changing shared state. The specialized converter is
also `P-008`; restoring it after disruption resembles `P-009`. Do not create a
generic “microbiome principle.” The important refinement to `P-013` is that
shared state can enforce **ecological admission pressure**, not only convey
messages.

**Strongest engineered analogue.** A small guardian module transforms shared
inputs, tokens, or resource metadata into an admission environment in which
known parasitic computations cannot cheaply propagate—for example, signed
capability derivation with short-lived validity instead of repeated global
screening.

**Falsifiable experiment.** In a modular agent workspace, introduce processes
that copy outputs or consume shared budget without contributing verified work.
Compare central per-action policing with a specialist that transforms shared
capabilities and provenance state. Ablate the specialist and its required
substrate separately. Measure attack reproduction number, useful throughput,
false rejection, latency, and joules. The analogy is supported only if the
specialist’s effect depends on the predicted shared-state transformation and
beats centralized screening at matched safety.

## 5. Capability-guided repair of a minimal microbial community

**Primary study.** Brugiroux et al., “Genome-guided design of a defined mouse
microbiota that confers colonization resistance against *Salmonella enterica*
serovar Typhimurium,” *Nature Microbiology* 2, 16215 (2017).
[DOI: 10.1038/nmicrobiol.2016.215](https://doi.org/10.1038/nmicrobiol.2016.215).

**Exact scoped result.** A defined twelve-strain mouse community
(`Oligo-MM12`) stably colonized germ-free mice across generations and resisted
*Salmonella* better than germ-free mice but less than a conventional complex
microbiota. Comparative genome and metagenome analysis identified functions
present in the conventional community but missing from `Oligo-MM12`. Adding
three selected facultative anaerobes produced conventional-like colonization
resistance in the tested model.

**Mechanism or causal loop.** This study establishes a design workflow more
strongly than a single molecular mechanism: measure a minimal system’s
capability gaps, select complementary members from a strain library, assemble,
and challenge the result. The three added strains repaired missing functional
coverage; the paper does not reduce protection to one isolated interaction.

**Timescale and information flow.** Stable community assembly persists across
mouse generations; infection challenge probes shorter-term resistance. Design
information flows through offline genome comparison, whereas runtime protection
emerges from microbe–microbe, host–microbe, and resource interactions.

**Limits.** Mouse, pathogen, housing, and diet context matter. Genome-encoded
capability does not guarantee expression, and adding three strains is not a
universal minimal recipe. “Conventional-like” resistance on this outcome does
not mean that the synthetic community recreates all conventional microbiome
functions.

**Deduplication.** Bundle into
[`P-004`](../principle-registry.md#p-004--diversity-selection-and-protection)
for selection from a candidate library and
[`P-008`](../principle-registry.md#p-008--compartmentalized-interaction) for a
small set of complementary specialists. The novel contribution is an
experimental design tactic—**select by missing function, not organism count**—
rather than a new invariant.

**Strongest engineered analogue.** Repair a sparse expert system by identifying
uncovered capability regions from challenge traces, then admitting the smallest
set of candidate experts that closes coverage without violating latency and
energy budgets.

**Falsifiable experiment.** Remove known capabilities from a modular agent
system and construct repair sets by (a) random expert addition, (b) similarity
to current experts, (c) validation accuracy alone, or (d) explicit capability-
gap coverage. Challenge with held-out failures and adversarial mixtures. Measure
coverage, interference, communication, energy, and retained performance. Reject
the tactic if gap-guided sets do not outperform size-matched selection or if
nominal capability coverage fails to predict expressed behavior.

## 6. Functional redundancy as an engraftment barrier

**Primary study.** Tian et al., “Deciphering functional redundancy in the human
microbiome,” *Nature Communications* 11, 6217 (2020).
[DOI: 10.1038/s41467-020-19940-1](https://doi.org/10.1038/s41467-020-19940-1).

**Exact scoped result.** The authors constructed taxon–gene genomic-content
networks, proposed a quantitative within-sample functional-redundancy measure,
and reanalyzed two existing fecal-microbiota-transplant datasets. Pre-transplant
functional redundancy was negatively associated with the later fraction of
donor-specific strains in both datasets. The analyzed cohorts were small: five
metabolic-syndrome patients in one study and nineteen patients with recurrent
*C. difficile* infection in the other. Functional redundancy was more strongly
associated with donor-strain fraction than functional or taxonomic diversity in
their regressions.

**Mechanism or causal loop.** The proposed explanation is niche occupancy:
newcomers whose functions overlap incumbent taxa face competition, so redundant
coverage makes the resident community resistant to replacement. This is a
mechanistic hypothesis consistent with the association, not a directly
manipulated causal result. The paper’s evolution model separately found network
topologies compatible with functional redundancy under moderate selection and
high horizontal gene transfer; those parameter results should not be read as a
human causal estimate.

**Timescale and information flow.** A pre-existing community structure
constrains strain engraftment over serial post-transplant observations.
Information is not signaled centrally; competition acts through overlap in
ecological function and resources.

**Limits.** The study reuses clinical datasets with small cohorts, possible
donor–recipient compatibility confounding, and no randomized manipulation of
functional redundancy. Genomic potential is not equivalent to expressed
function, and the authors state that dedicated clinical studies are required.
The result concerns resistance to addition, not recovery after every type of
disturbance.

**Deduplication.** Treat as a failure mode and boundary condition for
[`P-004`](../principle-registry.md#p-004--diversity-selection-and-protection)
and [`P-008`](../principle-registry.md#p-008--compartmentalized-interaction):
protecting redundant winners can impede beneficial replacement. It does not
justify a new “redundancy principle” without causal manipulation.

**Strongest engineered analogue.** Expert ecosystems can become structurally
resistant to new modules when incumbent experts redundantly cover the same
routing region and absorb all traffic, even when a newcomer is better on an
emerging regime.

**Falsifiable experiment.** Train expert pools with equal aggregate accuracy but
controlled overlap in functional coverage. Insert a specialist superior on a
new subdistribution while holding router initialization constant. Measure time
to useful routing share, sample cost, old-task loss, and final energy. Intervene
by temporarily reserving exploration traffic. The hypothesis fails if incumbent
functional overlap does not predict engraftment after controlling for capacity,
initial logits, and optimizer state.

## 7. Critical slowing down in a perturbed living microcosm

**Primary study.** Veraart et al., “Recovery rates reflect distance to a tipping
point in a living system,” *Nature* 481, 357–359 (2012).
[DOI: 10.1038/nature10723](https://doi.org/10.1038/nature10723). The publisher
issued a methods/scale correction that did not change the conclusions:
[DOI: 10.1038/nature11029](https://doi.org/10.1038/nature11029).

**Exact scoped result.** Increasing light drove cyanobacterial microcosms toward
a photo-inhibition tipping point. Recovery from repeated small dilution
perturbations slowed over a broad range as the critical light level was
approached, and autocorrelation in background fluctuations increased. The
corrigendum specifies that flushing 10% of the medium reduced biomass by only
about 3–5% because mixing was incomplete, and corrects the reported light scale.

**Mechanism or causal loop.** Near a local bifurcation, the dominant restoring
rate weakens: displacement decays more slowly and successive observations retain
more memory of prior displacement. A bounded perturbation therefore reveals
loss of restoring capacity that a snapshot of current biomass can hide.

**Timescale and information flow.** Populations were perturbed every four to
five days while environmental pressure increased. Recovery trajectories and
passive temporal autocorrelation carry system-level information to an external
observer; the organism does not itself implement a warning controller.

**Limits.** Stochasticity prevented precise prediction of transition timing;
the authors support ranking systems from more resilient to more fragile. The
study uses a controlled single-population microcosm near a classical tipping
point. Critical slowing is not guaranteed before transitions caused by shocks,
non-bifurcation failures, controller bugs, or unobserved variables.

**Deduplication.** Not [`P-006`](../principle-registry.md#p-006--homeostatic-negative-feedback):
`P-006` is a stabilizing control loop, whereas this is a diagnostic obtained by
measuring the loop’s weakening response. Candidate new bundle:
**recovery dynamics as a latent fragility sensor**.

**Strongest engineered analogue.** A maintenance plane periodically applies
tiny safe perturbations to replicas or shadow traffic and estimates local
return rate, variance, and autocorrelation before admitting more load or
structural change.

**Falsifiable experiment.** Gradually increase router load, recurrence gain, or
memory-write coupling toward a known phase transition in a synthetic modular
system. Inject bounded impulses and estimate recovery eigenvalues without using
the hidden control parameter. Compare prediction against static loss, entropy,
and utilization. Evaluate lead time, false alarms, missed transitions, quality
cost, and probe energy. The candidate fails if recovery features do not improve
out-of-distribution transition ranking or are too expensive/noisy at safe probe
amplitudes.

## 8. Early warning during a whole-lake food-web shift

**Primary study.** Carpenter et al., “Early warnings of regime shifts: a
whole-ecosystem experiment,” *Science* 332, 1079–1082 (2011).
[DOI: 10.1126/science.1203672](https://doi.org/10.1126/science.1203672).

**Exact scoped result.** Researchers gradually added top predators to one lake
for three years while monitoring an adjacent reference lake. Statistical
warning signals appeared during food-web reorganization more than a year before
the manipulated lake’s transition was complete. This supplies a field-scale
test beyond small laboratory populations, with a concurrent reference system.

**Mechanism or causal loop.** Predator addition reorganized coupled trophic
feedbacks. As the system lost resilience, return dynamics and fluctuation
statistics changed before the eventual food-web regime became fully expressed.
Unlike the cyanobacterial experiment, the relevant state is distributed across
interacting populations; the warning is a property of the coupled system, not
one component in isolation.

**Timescale and information flow.** Slow forcing and observation operated over
years; warnings preceded completion by more than one year. Effects flow through
the trophic network, and multivariate ecosystem observations expose the
reorganization to the monitor.

**Limits.** This was one manipulated lake paired with one reference lake, not a
large randomized sample. Its value is causal intervention at ecosystem scale,
but generalization and false-positive rates cannot be estimated from two lakes.
The warning did not provide an exact universal threshold or transition date.

**Deduplication.** Bundle with the Veraart result under **recovery dynamics as a
latent fragility sensor**; do not create separate microcosm and ecosystem
principles. It adds evidence that the signal can survive distributed
interactions and long timescales.

**Strongest engineered analogue.** Monitor a service ecosystem as a coupled
network—router, caches, experts, memory, queues, and maintenance processes—using
a matched shadow deployment as a reference rather than declaring each service
healthy independently.

**Falsifiable experiment.** Gradually change one coupling, such as retry gain or
shared-cache pressure, until a known system-level regime shift occurs. Compare
univariate component alarms, multivariate network recovery statistics, and a
matched control deployment. Score warning lead time, false positives across
benign shifts, localization accuracy, and monitoring energy. The analogue fails
if network indicators add no reliable lead time beyond ordinary service-level
objectives.

## 9. Diversity creates opposing stability effects

**Primary study.** Pennekamp et al., “Biodiversity increases and decreases
ecosystem stability,” *Nature* 563, 109–112 (2018).
[DOI: 10.1038/s41586-018-0627-8](https://doi.org/10.1038/s41586-018-0627-8).

**Exact scoped result.** The authors manipulated species richness in 690
aquatic-ciliate micro-ecosystems, sampling them 19 times over 40 days (12,939
samples). Greater richness increased temporal stability but decreased
resistance to warming. When stability components were aggregated, the
diversity–overall-stability relation could be hump-shaped or U-shaped rather
than monotonic.

**Mechanism or causal loop.** The authors’ supported interpretation is a
tradeoff: complementarity increased total biomass and its temporal stability,
but higher-biomass diverse communities experienced larger biomass losses during
warming without sufficient response diversity. Diversity changes several
controlled quantities at once; a scalar “resilience” score can hide opposite
movements.

**Timescale and information flow.** Community assembly and repeated observation
occurred over 40 days; warming tested acute resistance within that window.
Species interactions distribute function across the community, while the
experimenter separately measures baseline variation and perturbation response.

**Limits.** The result is for ciliate microcosms, a warming perturbation, and the
study’s stability definitions. Richness is not equivalent to functional or
response diversity. The hump/U aggregation depends on component signs and
weights; it is not a universal optimal diversity level.

**Deduplication.** This is a measurement and optimization constraint across
`P-004`, `P-006`, and `P-008`, not a new architectural principle. It directly
rejects the assumption that more diversity or redundancy yields one-dimensional
resilience.

**Strongest engineered analogue.** Evaluate an expert population with a
resilience vector rather than a composite headline: steady-state variance,
acute quality loss, time to recovery, retained adaptability, newcomer
engraftment, and energy reserve.

**Falsifiable experiment.** Build expert pools at controlled richness and
response diversity while matching nominal capacity. Test stationary workload
noise, abrupt distribution shift, component loss, and gradual load increase.
Measure each stability axis before selecting any aggregation weights. The
prediction is an empirical tradeoff surface, not monotonic benefit. Reject the
claimed analogy if all axes improve monotonically after controlling for total
capacity and training compute.

## Deduplication decisions

### Candidate bundle A: thresholded collective commitment

Ward et al. provide direct evidence for nonlinear evidence accumulation in a
vertebrate group. Couzin et al. show a related but not identical gain-control
effect under conflict. They should initially share one experimental bundle:

```text
anonymous local commitments
  -> nonlinear support relative to opposition/abstention
  -> suppression of isolated or overconfident capture
  -> group commitment
```

This is not identical to `P-011`, which specifies when or with whom to
communicate but not the nonlinear commit rule. One experiment should compare
quorum gating, confidence clipping, and neutral-agent dilution before the
registry creates another principle.

### Existing bundle: sparse transient communication

Nagy et al. fit `P-011`. A “leadership principle” would be duplicate wording for
a sparse directed effective graph unless intervention demonstrates a separate
control loop.

### Existing bundle with a sharper role for shared state

Buffie et al. fit `P-013`, but expand its engineered search space: shared state
can change the viability of behaviors, not only carry coordination messages.
Brugiroux et al. remain in `P-004`/`P-008` as capability-guided assembly. Tian
et al. supply the opposite edge of the same design: strong incumbent coverage
may resist both harmful and beneficial newcomers.

### Candidate bundle B: recovery-based fragility sensing

Veraart et al. and Carpenter et al. should be deduplicated despite organism,
scale, and timescale differences:

```text
small displacement or ambient fluctuation
  -> estimate return dynamics
  -> detect weakening restoring forces
  -> rank fragility before state quality visibly collapses
```

It remains a diagnostic, not a stabilization mechanism. It becomes a control
principle only if a maintenance plane acts on the estimate and that closed loop
improves safety at acceptable probing cost.

### Cross-cutting evaluation rule: resilience is a vector

Pennekamp et al. and Tian et al. rule out a single monotonic diversity story.
Temporal stability, acute resistance, recovery, and willingness to admit a
better newcomer can move in opposing directions. Future experiments should not
hide these axes in one score before reporting the raw components.

## Superficial analogies to reject

- **“A flock is a transformer attention map.”** The pigeon study inferred
  pairwise directional delay in flocks of at most ten; it did not identify
  token attention, content-addressed retrieval, or a universal graph.
- **“Quorum means majority vote.”** The stickleback response was nonlinear and
  relative to opposing and uncommitted fish. Its benefit depended on error
  independence, and coordinated replica cues still induced harmful following.
- **“Add ignorant agents to improve democracy.”** The untrained fish were
  socially responsive, not random-noise generators, and the benefit occurred
  in a specific conflict between preference strength and cohort size.
- **“Microbes are software agents.”** The transferable mechanism in Buffie et
  al. is substrate-dependent alteration of a shared environment; the organism
  label contributes nothing unless that loop is implemented and ablated.
- **“More modules create resilience.”** Pennekamp et al. found opposing effects
  on temporal stability and warming resistance, while Tian et al. found an
  association between redundancy and resistance to newcomer engraftment.
- **“Genome coverage guarantees runtime capability.”** Brugiroux et al. used
  genome-guided selection and an infection challenge; genomic potential alone
  does not establish expression or causal sufficiency.
- **“Rising autocorrelation predicts any failure.”** Critical slowing is
  expected near particular local transitions. Shock failures, nonstationarity,
  hidden drivers, changing observation noise, and software faults can generate
  missing or spurious signals.
- **“A year of ecological warning becomes a fixed number of AI steps.”** The
  useful quantity is lead time relative to the system’s intervention and
  recovery timescale, not a copied duration.
- **“Hierarchy is efficient because pigeons use it.”** The telemetry paper
  observed directed lead–lag structure; it did not experimentally compare its
  energy or accuracy with egalitarian alternatives.

## Vascular and resource-network decision

No vascular/resource-network paper is promoted in this pass. Strong candidates
encountered in the surrounding literature primarily optimize or simulate
transport networks, or infer design from static biological structure. They may
be valuable theory, but they do not meet this audit’s bar for a strong causal
biological intervention beyond the already represented flow/topology evidence
in [`P-005`](../principle-registry.md#p-005--use-dependent-topology). A later
audit should require perturbation of flow demand or damage followed by measured
remodeling and functional recovery, with the feedback loop distinguished from
*Physarum* and fungal-network evidence already in the registry.

## Recommended experiment order

1. **Recovery probe on a synthetic tipping system.** Cheapest way to test a
   genuinely new diagnostic bundle with a known ground-truth transition.
2. **Quorum gate under correlated errors.** Tests both the proposed benefit and
   the principal biological failure mode in one small benchmark.
3. **Resilience-vector benchmark.** Establish reporting conventions before
   architecture comparisons begin.
4. **Capability-gap expert repair.** Compare function-guided and random module
   admission at matched size and energy.
5. **Shared-substrate guardian.** Higher implementation risk; proceed only after
   specifying an actual digital substrate and a reversible intervention.
6. **Directed lag graph.** Treat as an ablation of `P-011`, not a separate
   organism-themed architecture.

# Primary-source audit: microbial ecology and biofilms

**Audit date:** 2026-08-05  
**Status:** breadth-first audit; temporary claims only  
**Scope:** quorum sensing and quenching, biofilm gradients and extracellular
matrix, persister states, horizontal gene transfer, phage–bacteria dynamics,
metabolic cross-feeding, spatial competition, collective antibiotic tolerance,
dispersal, and community succession  
**Purpose:** test whether these mechanisms leave a project-level invariant
after molecular signaling, physiology, population dynamics, selection, spatial
transport, and lifecycle cost are kept separate

This file does not promote evidence into the shared claim ledger, change a
principle, or approve an architecture. Its C-MIC identifiers are audit-local
until root-level review.

## Executive finding

Microbial communities are strong evidence for local chemical sensing, spatially
structured interaction, heterogeneous physiological state, ecological
selection, and environment-mediated coordination. They are weak evidence for a
single organism-like controller.

The central decomposition is

$$
\text{molecular transport}
\rightarrow
\text{receiver response}
\rightarrow
\text{cell phenotype}
\rightarrow
\text{population dynamics}
\rightarrow
\text{selection across lineages}.
$$

Evidence at one arrow does not establish the next. A reporter responding to an
autoinducer does not show consensus. A biofilm surviving an antibiotic does not
identify matrix exclusion as the cause. A transferred plasmid does not show
that its payload is adaptive. A cross-fed metabolite does not establish
cooperation. A stable community composition does not establish a collective
memory or a new unit of selection.

Two popular analogies are rejected at the audit boundary:

1. **Quorum is not consensus.** Cells synthesize, transport, lose, detect, and
   respond to molecules. Concentration depends on cell activity, geometry,
   flow, degradation, and receiver state. There need be no proposal, vote,
   objection, membership list, or mutually known commitment.
2. **A biofilm is not a brain.** A matrix-embedded population can form
   gradients, local niches, clonal sectors, invasion barriers, and dispersal
   states. None of those observations establishes representations, a global
   objective, inference, credit assignment, or organism-level cognition.

The strongest transferable requirement is therefore methodological:
**preserve locality, state heterogeneity, transport, lineage, and lifecycle
cost in the engineered null.** Once that is done, most observations
deduplicate into
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection),
[P-005](../principle-registry.md#p-005--use-dependent-topology),
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback),
[P-008](../principle-registry.md#p-008--compartmentalized-interaction),
[P-009](../principle-registry.md#p-009--maintenance-plane),
[P-011](../principle-registry.md#p-011--transient-communication-coalitions),
or
[P-013](../principle-registry.md#p-013--externalized-shared-state).
No new stable principle or candidate is justified by this audit.

## Evidence discipline

### Four layers that must not be collapsed

| Layer | Unit of observation | Typical intervention | What the evidence can establish | What it cannot establish alone |
| --- | --- | --- | --- | --- |
| molecular signaling | molecules, receptors, promoters, second messengers | delete synthase/receptor, add signal, degrade signal, change flow | scoped causal signal production or response | group agreement, adaptiveness, population benefit |
| cell physiology | growth, metabolism, stress state, matrix production, lysis | nutrient, oxygen, drug, regulator mutation | scoped causal phenotype and survival mechanism | heritable resistance, community optimum |
| population/ecology | abundance, transfer, predation, spatial sectors, succession | density, founder ratio, resource flux, phage, immigration | interaction-dependent dynamics | why a mechanism evolved or whether each participant benefits |
| evolutionary selection | genotype/lineage frequency and fitness | serial passage, competition, relatedness, spatial structure | selection under the tested environment | present molecular function in every context or collective individuality |

### Observation, intervention, and origin

- A spatial association between a metabolite and a taxon is **observation**.
- Deleting a producer, adding purified metabolite, restoring the producer, or
  blocking uptake can support **causal current function**.
- Fitness competitions across environments can support **selection under those
  conditions**.
- Claims about why quorum sensing, matrix, dormancy, or dispersal originally
  evolved require comparative or historical evidence beyond a present-day
  knockout.

### Definitions used here

- **Resistance:** heritable ability to grow at a drug concentration that
  inhibits the susceptible comparator; minimum inhibitory concentration has
  concentration units.
- **Tolerance:** slower killing without necessarily changing the MIC; measure
  with a kill curve or a time such as MDK99 in hours.
- **Persistence:** a subpopulation-level survival phenotype, commonly
  reversible on regrowth, that creates a biphasic or otherwise heterogeneous
  kill response. It is not synonymous with a resistance mutation or with one
  universal dormant state.
- **Quorum sensing:** regulation in response to produced and detected chemical
  signals. “Density sensing” is an approximation whose validity depends on
  transport and geometry.
- **Cross-feeding:** use by one population of a metabolite produced or released
  by another. Its net ecological sign may be positive, neutral, exploitative,
  or negative.
- **Succession:** time-ordered change in community composition or function. It
  is not automatically progress toward a climax or optimum.

## Common notation and dimensional checks

### Signal transport is not a vote count

For signal concentration $a(\mathbf{x},t)$,

$$
\frac{\partial a}{\partial t}
=
D_a\nabla^2 a
-\mathbf{u}\cdot\nabla a
+p_a n
-k_a a
-q_a(a,n),
$$

where:

- $a$ is signal concentration in $\mathrm{mol\,m^{-3}}$;
- $D_a$ is diffusivity in $\mathrm{m^2\,s^{-1}}$;
- $\mathbf{u}$ is fluid velocity in $\mathrm{m\,s^{-1}}$;
- $n$ is cell density in $\mathrm{cells\,m^{-3}}$;
- $p_a$ is production in
  $\mathrm{mol\,cell^{-1}\,s^{-1}}$;
- $k_a$ is first-order loss in $\mathrm{s^{-1}}$; and
- $q_a$ is enzymatic uptake or quenching in
  $\mathrm{mol\,m^{-3}\,s^{-1}}$.

All terms have units $\mathrm{mol\,m^{-3}\,s^{-1}}$. A receiver may respond
through

$$
r_i(a)=r_{0,i}
+r_{\max,i}\frac{a^{h_i}}{K_i^{h_i}+a^{h_i}},
$$

with response $r_i$ in declared reporter or synthesis units per second,
$K_i$ in $\mathrm{mol\,m^{-3}}$, and dimensionless Hill coefficient $h_i$.
Even a steep response is a local input–output curve, not evidence of a
collective decision.

For a homogeneous closed approximation with $N$ producing cells in volume $V$
and first-order loss,

$$
a^* \approx \frac{p_aN}{V k_a}.
$$

The same $N$ can therefore be below or above a response threshold when $V$,
loss, or flow changes. Boedicker et al. activated a quorum-sensing reporter
with as few as one to three confined cells; Kim et al. and Darch et al. showed
that flow and spatial arrangement alter signaling. “Quorum size” is not a
portable constant.

### Biofilm gradients require transport and consumption

For a substrate $s$ consumed approximately with first-order rate $k_s$ inside
a homogeneous region,

$$
\frac{\partial s}{\partial t}
=D_s\nabla^2s-k_ss,
\qquad
\ell_s=\sqrt{\frac{D_s}{k_s}},
$$

where $s$ is $\mathrm{mol\,m^{-3}}$, $D_s$ is
$\mathrm{m^2\,s^{-1}}$, $k_s$ is $\mathrm{s^{-1}}$, and the penetration
length $\ell_s$ is in metres. Real uptake is often saturating and biomass is
heterogeneous; $\ell_s$ is a dimensional scale, not a universal biofilm
thickness.

Borriello et al. measured oxygen penetration of about $50\ \mathrm{\mu m}$ in
their roughly $210\ \mathrm{\mu m}$, 48-hour Pseudomonas colony biofilms, with
an active protein-synthesis band of roughly $30\ \mathrm{\mu m}$. Those values
belong to that preparation, not to “biofilms” as a class.

Matrix mass also has a cost:

$$
\frac{dM}{dt}
=p_MN-k_MM-J_{\mathrm{shed}},
$$

where $M$ is matrix mass in kilograms, $p_M$ is
$\mathrm{kg\,cell^{-1}\,s^{-1}}$, $k_M$ is $\mathrm{s^{-1}}$, and
$J_{\mathrm{shed}}$ is $\mathrm{kg\,s^{-1}}$. Matrix synthesis, repair,
export, hydration, and loss must be charged.

### Persister states are transition and killing dynamics

One minimal two-state model is

$$
\begin{aligned}
\frac{dG}{dt}
&=(\mu_G-d_G)G-k_{GP}G+k_{PG}P,\\
\frac{dP}{dt}
&=(\mu_P-d_P)P+k_{GP}G-k_{PG}P,
\end{aligned}
$$

where $G$ and $P$ are cells, all $\mu$, $d$, and $k$ terms are
$\mathrm{s^{-1}}$, and drug exposure changes killing rates $d_G$ and $d_P$.
The labels are phenomenological. Different mechanisms can generate similar
kill curves, and “P” need not be metabolically inert.

Report

$$
S(t)=\frac{N_{\mathrm{viable}}(t)}{N_{\mathrm{viable}}(0)}
$$

as a dimensionless survival fraction, the full kill curve, regrowth
susceptibility, and MIC in $\mathrm{mg\,L^{-1}}$ or
$\mathrm{\mu mol\,L^{-1}}$. Do not infer persistence from one endpoint.

### Horizontal transfer is followed by ecological selection

For donor $D$, recipient $R$, and transconjugant $T$ densities in
$\mathrm{cells\,m^{-3}}$, a well-mixed conjugation approximation is

$$
\frac{dT}{dt}
=\gamma DR+\mu_TT-\delta_TT,
$$

where $\gamma$ is
$\mathrm{m^3\,cell^{-1}\,s^{-1}}$ and $\mu_T,\delta_T$ are
$\mathrm{s^{-1}}$. In a biofilm, contact neighborhoods, growth fronts,
matrix, and second-generation transfer make $\gamma$ spatially variable.

The observed fraction after selection,

$$
f_T(t)=\frac{T(t)}{D(t)+R(t)+T(t)},
$$

combines transfer, differential growth, death, and sampling. A high final
fraction is not itself a high molecular transfer rate.

### Phage dynamics couple ecology and evolution

A minimal susceptible-bacteria/lytic-phage model is

$$
\begin{aligned}
\frac{dB}{dt}&=\mu(S)B-\phi BP-m_BB,\\
\frac{dP}{dt}&=(\beta-1)\phi BP-m_PP,
\end{aligned}
$$

where $B$ is $\mathrm{cells\,m^{-3}}$, $P$ is
$\mathrm{virions\,m^{-3}}$, $\phi$ is
$\mathrm{m^3\,virion^{-1}\,s^{-1}}$, $\beta$ is dimensionless burst size,
and $\mu,m_B,m_P$ are $\mathrm{s^{-1}}$. Latent period, spatial diffusion,
adsorption to matrix, host physiology, resistant lineages, and resource
competition are omitted here and can qualitatively change outcomes.

### Cross-feeding needs a mass balance

For metabolite $c$ produced by population $A$ and consumed by population $B$,

$$
\frac{\partial c}{\partial t}
=D_c\nabla^2c+p_cA-u_c(c)B-k_cc,
$$

where $c$ is $\mathrm{mol\,m^{-3}}$, $D_c$ is
$\mathrm{m^2\,s^{-1}}$, $p_c$ is
$\mathrm{mol\,cell^{-1}\,s^{-1}}$, $u_c$ is
$\mathrm{mol\,cell^{-1}\,s^{-1}}$, and $k_c$ is $\mathrm{s^{-1}}$.
Net benefit requires counterfactual growth or fitness measurements for each
partner, not merely detection of flux.

### Full lifecycle accounting

For an engineered analogue, count

$$
E_{\mathrm{life}}
=\int_0^T
\left(
P_{\mathrm{task}}
+P_{\mathrm{sense}}
+P_{\mathrm{signal}}
+P_{\mathrm{matrix}}
+P_{\mathrm{maint}}
+P_{\mathrm{transfer}}
+P_{\mathrm{defense}}
+P_{\mathrm{disperse}}
+P_{\mathrm{recover}}
\right)dt
+E_{\mathrm{replace}},
$$

with every power term in watts, time in seconds, and energy in joules.
Matrix or shared-state bytes, signal molecules or messages, dormant reserve,
phage/attack losses, failed transfers, validation, cleanup, recolonization,
and operator work remain visible.

## Audit map

| Mechanism family | Strongest supported operation | Mandatory boundary | Nearest project object | Initial disposition |
| --- | --- | --- | --- | --- |
| quorum sensing/quenching | local chemical response can depend on production, transport, confinement, and degradation | no consensus or fixed population threshold | P-011/P-013; chemistry null | deduplicate |
| biofilm gradients/matrix | consumption creates local physiological zones; matrix changes adhesion, flow, and invasion | no brain; matrix is not the sole tolerance cause | P-008/P-009/P-013 | deduplicate |
| persister states | reversible population heterogeneity can alter survival under finite stress | not resistance; not one universal dormancy program | P-004/P-006/P-009 | experiment factor |
| horizontal gene transfer | local contact can move mobile elements and generate second-generation spread | transfer is not adoption, truth, or benefit | P-004/P-005/P-013; Candidate 019 | threat/channel factor |
| phage–bacteria dynamics | predation, resources, space, and coevolution alter abundance and traits | no stable equilibrium or optimizer assumption | P-004/P-006/P-008 | stressor/null |
| metabolic cross-feeding | metabolite flow can create dependencies or change interaction sign | flux is not cooperation | P-008/P-013; Candidate 013 | deduplicate |
| spatial competition | founder position, flow, matrix, and local growth shape sectors and access | pattern is not centralized allocation | P-004/P-005/P-008 | deduplicate |
| collective drug tolerance | shared detoxification or physiology can change community kill response | tolerance, persistence, and resistance remain separate | P-006/P-009/P-013; Candidate 005 | threat/test factor |
| dispersal | regulated state change can release cells from established biofilms | release is not safe migration or successful recolonization | P-005/P-009 | lifecycle factor |
| succession | ecological interactions can produce reproducible temporal replacement | reproducibility is not progress or inheritance | P-004/P-009/P-013; Candidates 016/019 | hold as evaluation factor |

## 1. Quorum sensing and quorum quenching

### Primary evidence

Nealson, Platt, and Hastings found that bacterial luciferase synthesis was
activated after growing cells conditioned the medium, supporting
extracellular accumulation coupled to transcriptional control
([DOI](https://doi.org/10.1128/jb.104.1.313-322.1970)). Bassler et al. then
identified Vibrio harveyi genes required for signal production and response:
mutant phenotypes distinguished LuxL/LuxM production functions from the
LuxN sensor function and also indicated that an additional signal-response
system remained
([DOI](https://doi.org/10.1111/j.1365-2958.1993.tb01737.x)).

These experiments establish molecular production and receiver pathways in
specific organisms. They do not show that cells count one another, reach
agreement, or act for a community-level objective.

Physical interventions expose the density shortcut:

- Boedicker, Vincent, and Ismagilov confined one to three Pseudomonas
  aeruginosa cells in sub-picolitre droplets and observed activation of a
  quorum-sensing reporter and substantial cell-to-cell variability
  ([DOI](https://doi.org/10.1002/anie.200901550)).
- Kim et al. varied flow through synthetic biofilm geometries and showed both
  local and downstream consequences for quorum-sensing activation
  ([DOI](https://doi.org/10.1038/nmicrobiol.2015.5)).
- Darch et al. used engineered aggregates in an infection-relevant model and
  found that aggregate size and inter-aggregate distance affected quorum
  signaling
  ([DOI](https://doi.org/10.1073/pnas.1719317115)).

Signal concentration is therefore a joint measurement of production,
retention, flow, geometry, loss, and receiver state. Population density can
correlate with it without being the only encoded variable.

Dong et al. expressed an N-acyl homoserine lactonase that degraded
acyl-homoserine lactone signals and attenuated quorum-sensing-dependent
bacterial infection in the studied plant-pathogen system
([DOI](https://doi.org/10.1038/35081101)). This is a causal intervention on the
communication medium. It does not show that “silencing communication” is
universally safe: the signal can have multiple functions, a quenching enzyme
has production and delivery costs, and selection can favor bypass or altered
signals.

Diggle et al. competed P. aeruginosa signal, response, and cooperative-behavior
mutants and found conditions under which non-producing or non-responding
lineages gained a relative fitness advantage
([DOI](https://doi.org/10.1038/nature06279)). This is evolutionary evidence
that the molecular circuit and the public output create exploitable costs in
the tested environment. It is not evidence that every signal-regulated output
is cooperative or that “cheating” is a molecular category.

### AI translation and deduplication

The silicon-native object is a priced, lossy broadcast field with local
receivers, not a consensus algorithm. A module may publish compact state into
a shared medium and independently change behavior when its filtered local
concentration crosses a threshold. This maps to:

- [P-011](../principle-registry.md#p-011--transient-communication-coalitions)
  when the signal creates temporary effective connectivity;
- [P-013](../principle-registry.md#p-013--externalized-shared-state) when
  modules coordinate by reading an environmentally stored field; and
- [P-006](../principle-registry.md#p-006--homeostatic-negative-feedback) only
  when a measured variable is actually restored by negative feedback.

It does **not** support the thresholded collective-commitment candidate from
the
[collective audit](2026-08-05-collective-ecological-resilience.md#candidate-bundle-a-thresholded-collective-commitment).
Fish quorum-like decisions there aggregate observed commitments. Bacterial
autoinducer response may instead report confinement, flow, production, or
metabolism without proposals or votes.

The strongest engineering nulls are a typed event bus, pub/sub with TTL,
rate-limited broadcast, a shared counter, a leaky integrator, and a
reaction–diffusion field. The
[chemistry audit](2026-08-05-chemistry-reaction-networks-proofreading.md)
already requires transport, driven work, reset, and measurement error to
remain explicit.

### Failure modes and predictions

- A high-producing faulty sender can trigger receivers without a high cell or
  module count.
- Flow or cleanup can suppress a real collective state by washing the signal
  away.
- Quenching can remove useful context, select evasive senders, or shift burden
  to a second signal.
- Heterogeneous receptor gain can create partial activation even at one
  concentration.
- Treating a threshold as consensus hides correlated sources and abstentions.

An engineered field analogue is supported only if changing retention,
transport, or local geometry changes routing in the predicted direction while
sender count is held fixed, and if it beats pub/sub plus ordinary filters at
equal bandwidth, state, latency, and energy.

## 2. Biofilm gradients and extracellular matrix

### Primary evidence

Borriello et al. measured large anoxic regions in mature P. aeruginosa colony
biofilms, with oxygen and protein-synthesis activity confined to surface
regions. Anaerobic challenge of young biofilms reduced killing, and their
analysis attributed a large fraction of protection in that preparation to
oxygen limitation
([DOI](https://doi.org/10.1128/AAC.48.7.2659-2664.2004)). The result directly
links transport-limited physiology to drug response; it does not establish a
universal thickness or one mechanism for every antibiotic.

Nguyen et al. disrupted the stringent response and showed that active
starvation responses contributed causally to antibiotic tolerance in
nutrient-limited and biofilm P. aeruginosa
([DOI](https://doi.org/10.1126/science.1211037)). This rejects a purely passive
“slow growth means protection” story for that system. Transport-generated
starvation and a receiver-local stress program are distinct causal steps.

Matrix has mechanical and ecological effects beyond chemical diffusion:

- Nadell et al. used Vibrio cholerae matrix mutants and invasion assays to show
  that RbmA-dependent mother–daughter and polysaccharide association restricted
  invasion into established biofilm interiors
  ([DOI](https://doi.org/10.1038/ismej.2014.246)).
- Nadell et al. later competed P. aeruginosa Pel matrix producers and
  non-producers under different flow and pore structures. Producers dominated
  simple flowing environments, while heterogeneous low-flow refuges permitted
  coexistence
  ([DOI](https://doi.org/10.7554/eLife.21855)).

Those studies show that matrix changes adhesion, lineage arrangement,
hydrodynamic retention, and access to space. They do not make matrix a
universal public good: benefits can be partly privatized, competitors can be
displaced, and environmental geometry changes the fitness sign.

### AI translation and deduplication

The transferable abstraction is **stateful local microenvironment plus bounded
interaction**, already covered by
[P-008](../principle-registry.md#p-008--compartmentalized-interaction) and
[P-013](../principle-registry.md#p-013--externalized-shared-state).
Maintaining, clearing, and rebuilding the environment is
[P-009](../principle-registry.md#p-009--maintenance-plane).

A digital “matrix” could be a scoped shared cache, workspace, placement
constraint, or interface membrane that changes which components encounter
which resources. Ordinary sharding, locality-aware placement, access control,
caches, and queues are the mandatory nulls. A dense shared embedding is not
matrix-like merely because many modules read it.

### Failure modes and predictions

- Protection may arise from inactive targets, active stress response, spatial
  refuge, detoxification, or lineage composition rather than matrix exclusion.
- A structure that retains useful state can also retain toxins, phage, stale
  messages, or exploiters.
- Matrix production consumes substrate and export capacity and may reduce
  growth.
- Reduced mixing can protect diversity or prevent useful coordination,
  depending on interaction range.
- Invasion resistance can also reject beneficial newcomers, matching the
  engraftment warning in the
  [collective/ecology audit](2026-08-05-collective-ecological-resilience.md#6-functional-redundancy-as-an-engraftment-barrier).

The analogue requires independent ablations of transport, receiver physiology,
physical/shared structure, and population composition. If a conventional
partition plus backpressure reproduces the result, no biofilm-derived
architecture remains.

## 3. Persister states

### Primary evidence

Balaban et al. tracked single Escherichia coli cells in microfluidic devices
and observed reversible switching between normally growing and slow-growing
persister-associated states. Descendants regrown after survival remained
drug-sensitive, distinguishing the scoped phenotype from genetic resistance
([DOI](https://doi.org/10.1126/science.1099390)).

The apparently simple dormancy story does not generalize cleanly:

- Wakamoto et al. followed Mycobacterium smegmatis lineages under isoniazid.
  Stochastic pulses of KatG, which activates the drug, were negatively
  associated with survival; survival heterogeneity was dynamic and related to
  drug activation rather than a single pre-existing dormant class
  ([DOI](https://doi.org/10.1126/science.1229858)).
- Orman and Brynildsen used growth and metabolic reporters plus sorting and
  concluded that rapid pre-treatment growth could yield persisters and that
  low replication or metabolism increased probability but was neither
  necessary nor sufficient in their assay
  ([DOI](https://doi.org/10.1128/AAC.00243-13)). The measurement and sorting
  interpretation has been disputed, so this supports heterogeneity more
  strongly than a universal negative theorem.
- Goormaghtigh et al. reconstructed and corrected strains used in a prominent
  toxin–antitoxin account and found that deleting ten type-II systems did not
  reduce the measured E. coli persistence phenotype
  ([DOI](https://doi.org/10.1128/mbio.00640-18)). This is a direct warning
  against promoting one molecular story from confounded strains.

### AI translation and deduplication

A reversible low-activity subpopulation under intermittent hazards is an
instance of
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection).
State entry/exit and capacity recovery touch
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback) and
[P-009](../principle-registry.md#p-009--maintenance-plane). It is not a new
memory type and does not by itself justify keeping idle experts.

The immunology comparison in
[comparative biology](../comparative-biology.md#adaptive-immunity-diversify-select-expand-then-protect)
is a null, not an identity. Immune repertoires diversify and select lineages
through different mechanisms; a persister survives a finite challenge without
necessarily acquiring improved recognition or heritable capability.

Strong engineering nulls are replicas, checkpoint snapshots, cold standby,
randomized restarts, portfolio hedging, dropout, and explicit reserve capacity.
Every protected inactive unit must be charged for memory, refresh, delayed
service, and recovery.

### Failure modes and predictions

- A “dormant” module can preserve stale or unsafe state rather than useful
  capacity.
- Random heterogeneity helps only for hazards whose vulnerable states are not
  perfectly correlated.
- Very slow resumption can erase survival value under service deadlines.
- Repeated stress can select heritable resistance, changing the problem.
- Endpoint survivor counts can confound pre-existing state, induced response,
  mutation, spatial refuge, and assay detection limit.

The engineered claim fails if explicit replicas or checkpoint/restart dominate
on timely utility and lifecycle joules, or if the survivor reserve cannot
re-enter service with calibrated state after the hazard.

## 4. Horizontal gene transfer

### Primary evidence

Hausner and Wuertz quantified conjugative transfer in defined biofilms with
three-dimensional in-situ imaging. Their inferred rates were much higher than
classical plating estimates and depended on biofilm time and structure rather
than nutrient concentration alone
([DOI](https://doi.org/10.1128/AEM.65.8.3710-3713.1999)). The result is partly a
measurement lesson: culture-based recovery can miss spatial transfer events.

Bourassa et al. fluorescently tracked ICEBs1 in Bacillus subtilis biofilms.
Transfer occurred in heterogeneous local clusters, high matrix production
favored acquisition in that system, and newly formed transconjugants were major
contributors to subsequent propagation
([DOI](https://doi.org/10.1128/jb.00181-22)). This supports a local
contact-and-relay process, not homogeneous broadcast.

Conjugation, transformation, and transduction are different mechanisms.
Presence of acquired DNA also remains distinct from expression, phenotypic
effect, net fitness, fixation, and long-term retention. Antibiotic selection
after transfer can amplify a rare acquisition; a high endpoint frequency can
therefore reflect selection more than transfer.

### AI translation and deduplication

The closest analogue is transfer of a versioned executable artifact between
modules or agents. Transport and lineage belong to
[P-013](../principle-registry.md#p-013--externalized-shared-state);
population variation and selection to
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection);
repeatedly used edges may touch
[P-005](../principle-registry.md#p-005--use-dependent-topology).

This does not establish
[Candidate 019](../../experiments/candidates/019-audited-cumulative-inheritance.md).
A plasmid can cross a boundary without independent evaluation, semantic
compatibility, protected-function testing, audit, or improvement across learner
turnover. It is closer to package distribution—sometimes useful, sometimes
parasitic—than to cumulative culture.

It also does not establish
[Candidate 016](../../experiments/candidates/016-conflict-bounded-unit-transition.md).
Transfer between cells is not reproduction of a collective configuration and
does not create positive between-collective selection after within-collective
conflict is accounted for.

### Failure modes and predictions

- Mobile elements can impose carriage costs, disrupt hosts, or transfer
  resistance and virulence.
- Dense contact can increase transfer opportunity and competition
  simultaneously.
- A beneficial payload in one host or environment can be neutral or harmful
  elsewhere.
- Second-generation relay can amplify an unsafe artifact faster than central
  review.
- Detection pipelines can confuse transfer with clonal expansion.

Any AI use must require signed provenance, compatibility checks, a sandbox,
rollback, and independent task evaluation. Ordinary package registries,
federated updates, retrieval, and artifact stores are the strongest nulls.

## 5. Phage–bacteria dynamics

### Primary evidence

Chao, Levin, and Stewart maintained Escherichia coli and lytic T7 in continuous
culture and observed coexistence involving susceptible and resistant bacterial
clones plus host-range phage variants. Which community persisted depended on
resource and predation regimes
([DOI](https://doi.org/10.2307/1935611)).

Bohannan and Lenski varied glucose supply in E. coli–T4 chemostats. Enrichment
increased phage density, modestly increased bacterial density, reduced
population stability, and accelerated appearance and invasion of
phage-resistant bacteria in their experiment
([DOI](https://doi.org/10.1890/0012-9658(1997)078%5B2303:EOREOA%5D2.0.CO;2)).
More resource did not monotonically improve community stability.

Buckling and Rainey serially passaged Pseudomonas fluorescens and phage and
observed antagonistic coevolution with divergent trajectories across replicate
communities
([DOI](https://doi.org/10.1098/rspb.2001.1945)). Selection changed both sides;
one fixed phage or bacterial policy is therefore a weak null for long-running
systems.

Testa et al. compared phage attack on sensitive P. aeruginosa with or without a
competing insensitive strain in liquid and surface colonies. Sensitive cells
were eliminated in liquid but could remain sensitive in colonies, with
slow-growing colony centers acting as refuges; competition also changed
resistance evolution and phage abundance
([DOI](https://doi.org/10.1038/s42003-019-0633-x)).

### AI translation and deduplication

Phage is best retained as a **replicating adversary and eco-evolutionary
stressor**, not copied as a benevolent maintenance process. Diversity and
selection map to P-004; spatial refuges to P-008; population stabilization
touches P-006 only when a real negative-feedback loop and target variable are
specified.

The
[epidemiology audit](2026-08-05-epidemiology-and-surveillance-control.md)
provides the mandatory spread and observation nulls: infection opportunity,
detection, intervention, and reporting are different processes. Here,
adsorption, lysis, burst, transport, resistance, and resource supply likewise
remain separate.

### Failure modes and predictions

- A phage-like detector that replicates may become the dominant workload or
  attack healthy modules.
- Spatial containment can create persistent adversarial refuges.
- Resistance can trade off with growth or alter other interactions; measuring
  attack survival alone misses this.
- Resource enrichment can increase adversary abundance and oscillation.
- Coevolution can overfit both attacker and defender to one another while
  weakening performance elsewhere.

Engineered tests must include fixed attacks, adaptive attacks, non-replicating
fault injectors, static isolation, ordinary patching, and red-team coevolution.
The biological analogy earns nothing unless its spatial and evolutionary terms
predict a distinct equal-budget frontier.

## 6. Metabolic cross-feeding

### Primary evidence

Cross-feeding is a flux category, not a fixed ecological relationship.

Giri et al. paired four amino-acid auxotrophic recipients with 25 potential
donor species. Recipients grew in many pairings, and greater metabolic and
phylogenetic dissimilarity was associated with recipient benefit in this assay
([DOI](https://doi.org/10.1016/j.cub.2021.10.019)). This establishes a
conditioned donor–recipient pattern, not a universal assembly law: the assay
selected a need, medium, recipients, and measured recipient growth more
directly than donor lifetime fitness.

Borer et al. used two Pseudomonas stutzeri lineages linked by nitrite
production and consumption during spatial range expansion. Changing ambient
pH altered nitrite toxicity and shifted the effective interaction from
competition toward stronger mutualism; trophic dependence and chance founder
position shaped durable spatial sectors
([DOI](https://doi.org/10.1038/s42003-020-01409-y)). The same biochemical
exchange therefore had context-dependent ecological sign.

Enke et al. assembled model marine communities from particle-associated
bacteria. Obligate cross-feeders could hinder primary degraders from
colonizing and consuming chitin particles, lengthening particle half-life in a
dose-dependent manner in the studied communities
([DOI](https://doi.org/10.1038/s41467-018-05159-8)). Cross-feeder abundance was
not equivalent to higher community function on the declared turnover outcome.

Adamowicz et al. constructed obligate cross-feeding communities and challenged
them with antibiotics. Resistant members could be inhibited at lower
concentrations when their required partner was susceptible, approximating a
“weakest-link” effect in several conditions, while timing and cross-protection
created deviations
([DOI](https://doi.org/10.1038/s41396-018-0212-z)).

### AI translation and deduplication

The transferable operation is typed resource transformation plus local
dependency. Compartment-specific capabilities belong to
[P-008](../principle-registry.md#p-008--compartmentalized-interaction), and
metabolites written into a shared environment to
[P-013](../principle-registry.md#p-013--externalized-shared-state).

Cross-feeding does not establish
[Candidate 013](../../experiments/candidates/013-deficit-capability-routing.md).
That candidate specifically requires local deficit reporting, cross-scale
integration, a compact return signal, and a local capability gate. A metabolite
flow can be unidirectional waste use with no deficit message or descending
context.

Strong nulls are typed service composition, queues, dataflow graphs,
producer–consumer pipelines, cache reuse, and ordinary resource markets. A
digital module consuming another module's by-product is not novel without a
measured locality, conversion, or coordination advantage.

### Failure modes and predictions

- Dependency can create a weakest-link failure and prevent autonomous recovery.
- A consumer can increase its own fitness while lowering total task throughput.
- A metabolite may be beneficial at one concentration and toxic at another.
- Flux can be accidental leakage rather than selected cooperative investment.
- Relative abundance can rise while absolute production falls.
- Spatial separation can starve partners; excessive mixing can expose goods to
  competitors.

The analogue must report each participant's counterfactual utility, total
system utility, conversion loss, transport distance, dependency graph,
recovery after member deletion, and full energy. “Both persist” is
insufficient.

## 7. Spatial competition and lineage sorting

### Primary evidence

Xavier and Foster modeled growing biofilms and predicted that polymer
production could move producer lineages toward oxygen-rich growth fronts and
smother competitors
([DOI](https://doi.org/10.1073/pnas.0607651104)). This is a mechanistic model,
not a universal empirical result; its value is the explicit coupling between
growth geometry, resource access, and matrix cost.

The later experiments above supply causal constraints:

- RbmA-dependent matrix structure limited invasion in V. cholerae biofilms.
- Pel production changed P. aeruginosa competitive outcomes, but pore geometry
  and flow allowed coexistence in some environments.
- In the Borer et al. range expansions, chance access to the frontier and local
  trophic conditions generated long-lived sectors.
- In Testa et al., slow-growing colony centers protected phage-sensitive cells
  without genetic resistance.

Spatial pattern is therefore generated jointly by birth, motion, adhesion,
resource transport, mechanical displacement, death, and founder sampling. A
sector boundary need not encode a task decomposition or group decision.

### AI translation and deduplication

Spatially restricted interaction is P-008. Recurrent reinforcement or removal
of actual logical connections is P-005 only when topology changes, rather than
when fixed geometry changes traffic. Selection among protected variants is
P-004.

[Candidate 001](../../experiments/candidates/001-adaptive-topology.md) remains
the decisive topology null. A biofilm result is relevant only if an engineered
policy changes active logical edges and beats fixed topology plus adaptive
routing after reconfiguration, reserve, and recovery costs. Placement or
sharding alone is not adaptive topology.

### Failure modes and predictions

- Founder effects and frontier surfing can amplify neutral or harmful
  lineages.
- Local exclusion can preserve specialization or entrench incumbents.
- Physical adjacency can improve cross-feeding while worsening competition,
  phage exposure, or HGT.
- A visually ordered pattern can have lower throughput than a mixed one.
- Geometry changes external validity: flat flow cells, porous media, wounds,
  and particles need not share a winner.

An engineered claim requires matched initial lineages, randomized positions,
absolute population or throughput measures, and geometry-held ablations of
communication, resource flow, and topology.

## 8. Collective antibiotic tolerance and resistance

### Primary evidence

Several distinct mechanisms can protect susceptible neighbors:

- Lee et al. evolved E. coli under increasing norfloxacin and reported that
  highly resistant isolates produced indole, inducing stress and efflux
  responses that increased survival of less resistant cells
  ([DOI](https://doi.org/10.1038/nature09354)).
- Yurtsev et al. followed a beta-lactamase plasmid and found an equilibrium
  resistant fraction that scaled with antibiotic concentration divided by
  cell density over the tested range; susceptible cells could benefit from
  environmental drug inactivation while avoiding plasmid cost
  ([DOI](https://doi.org/10.1038/msb.2013.39)).
- Sorg et al. showed that intracellular chloramphenicol acetyltransferase in
  resistant Streptococcus pneumoniae could deplete extracellular active drug
  and permit susceptible growth in cultures, structured assays, and a mouse
  coinfection model
  ([DOI](https://doi.org/10.1371/journal.pbio.2000631)).
- Adamowicz et al. showed the opposite dependency effect in some cross-feeding
  communities: a susceptible required partner lowered the concentration at
  which otherwise resistant members were inhibited.
- Borriello et al. and Nguyen et al. demonstrated spatial oxygen limitation and
  active starvation response as tolerance mechanisms that do not require a
  resistant helper lineage.

Thus “collective protection” spans signal-induced physiology, extracellular or
intracellular detoxification, target inactivity, active stress responses,
spatial refuge, and partner dependency. These mechanisms make different
predictions under timing, mixing, drug class, and member deletion.

### AI translation and deduplication

Detoxification through shared state is P-013; dynamic load and recovery control
is P-006; maintenance and cleanup is P-009; compartments are P-008.

[Candidate 005](../../experiments/candidates/005-severity-ordered-containment.md)
already owns sensing, containment, repair/reconstruction, replacement, and
verification. Microbial tolerance adds a threat model—neighbors can mask
vulnerability or detoxify a shared hazard—but not a new triage principle.

The
[cellular quality-control audit](2026-08-05-cellular-quality-control.md)
requires repair, removal, and replacement to be distinguished. Here, survival,
growth resumption, MIC, and later recurrence must likewise remain separate.

### Failure modes and predictions

- Susceptible survivors can conceal the presence and fitness cost of resistant
  minorities.
- Shared detoxification can select freeloaders and change the resistant
  fraction without eliminating the resistance determinant.
- A treatment that disperses or mixes cells can raise or lower protection
  depending on mechanism.
- Tolerance during a finite pulse can leave MIC unchanged yet extend required
  treatment duration.
- Killing the “helper” can collapse a dependency or remove a protective
  function and worsen another outcome.

Report MIC, kill curves, MDK, regrowth, resistance genotype frequency,
absolute load, spatial distribution, and recurrence. One viability endpoint
cannot identify the mechanism.

## 9. Biofilm dispersal

### Primary evidence

Barraud et al. exposed established P. aeruginosa biofilms to low,
non-bactericidal nitric-oxide conditions and observed dispersal; nitric-oxide
scavenging and pathway interventions supported a signaling role in the studied
system
([DOI](https://doi.org/10.1128/JB.00779-06)).

Roy, Petrova, and Sauer found that nutrient-shift-induced dispersion increased
phosphodiesterase activity and lowered c-di-GMP, and that the phosphodiesterase
DipA was required for the scoped P. aeruginosa response
([DOI](https://doi.org/10.1128/jb.05346-11)).

Active dispersal must be separated from erosion, sloughing, mechanical
detachment, killing, and sampling loss. A released cell is not necessarily
viable, safer, less virulent, successfully established elsewhere, or returned
to the ancestral planktonic state.

### AI translation and deduplication

Reversible exit from a persistent local structure touches P-005 when actual
connectivity changes and P-009 when a maintenance controller triggers and
validates the transition. It does not justify global teardown or unvalidated
migration.

Strong nulls are load shedding, autoscaling, process draining, live migration,
cache eviction, checkpoint/restart, and rolling deployment. Each already has
explicit availability and rollback semantics that the biological analogy
lacks.

### Failure modes and predictions

- Dispersal can export a fault or adversary to new compartments.
- Released state may lose locally accumulated public goods or protection.
- Premature dispersal sacrifices sunk matrix and specialization costs.
- Incomplete dispersal leaves a seed for regrowth while creating a second
  population elsewhere.
- Low c-di-GMP or one signal is not a universal safe-to-migrate certificate.

Measure released units, viable units, source clearance, destination
establishment, state consistency, recurrence, latency, bytes moved, and
joules. A fall in source biomass is not successful migration.

## 10. Community succession

### Primary evidence

Datta et al. colonized model marine particles with isolates associated with
different natural successional phases. They observed rapid, reproducible
microscale replacement from early colonizers toward primary degraders and
later secondary consumers, with dispersal limitation and facilitative
interactions contributing in the system
([DOI](https://doi.org/10.1038/ncomms11965)).

Enke et al. then showed that composition altered particle turnover and that
secondary cross-feeders could slow consumption by primary degraders. The later
community was not automatically better on particle-processing time.

Succession can reflect substrate modification, depletion, dispersal,
facilitation, inhibition, predation, stochastic founder order, and immigration.
Reproducible stages support a dynamical description; they do not show progress,
optimality, or a stored development program.

### AI translation and deduplication

Variant replacement and protected diversity are P-004. Maintenance,
retirement, and restoration are P-009. Environmental records are P-013 only
when later actors actually read persistent shared state rather than merely
encountering depleted resources.

Succession does not establish Candidate 016: there is no declared collective
offspring, reproducible collective heredity, or positive cost-adjusted
between-collective selection. It does not establish Candidate 019: replacement
can occur without validation, recombination, protected capability retention,
or accumulation across learner turnover.

The closest ordinary nulls are staged pipelines, queueing networks, workflow
orchestration, rolling replacement, curriculum schedules, and nonstationary
mixture models.

### Failure modes and predictions

- Relative-abundance succession can hide falling absolute biomass or function.
- Stage labels can be artifacts of sampling frequency and compositional data.
- Priority effects can make one inoculation order look deterministic.
- Later consumers can depend on waste from an inefficient earlier stage.
- A repeated sequence can be externally forced by resource depletion rather
  than internally controlled.

Engineered studies must randomize founder order, track absolute as well as
relative quantities, perturb the proposed facilitator, replenish the
substrate, and test whether stage identity predicts intervention response
beyond time elapsed.

## Deduplication against project principles

| Principle | What microbial evidence adds | What it does not add |
| --- | --- | --- |
| P-004 — diversity, selection, protection | persister heterogeneity, phage resistance, plasmid lineages, founder and spatial sorting | a guarantee that diversity is adaptive, safe, or cheap |
| P-005 — use-dependent topology | dispersal and matrix can change physical neighborhood; HGT follows contacts | evidence that reinforcing digital edges beats adaptive routing |
| P-006 — homeostatic negative feedback | stress response and population regulation can be modeled as feedback when a target and sign are identified | every density threshold, coexistence, or stable abundance |
| P-008 — compartmentalized interaction | gradients, sectors, local conjugation, refuges, and trophic neighborhoods | biofilm-as-module identity or universal benefit from isolation |
| P-009 — maintenance plane | matrix turnover, stress response, cleanup, dispersal, and recolonization are lifecycle work | free resilience or a separate global microbial supervisor |
| P-011 — transient communication coalitions | diffusible signals can transiently alter effective receiver behavior | consensus, membership, independence, or commitment |
| P-013 — externalized shared state | signals, metabolites, matrix, toxins, and depleted resources mediate later behavior | truth, provenance, authorship, exact rollback, or semantic compatibility |

## Deduplication against held candidates

| Candidate | Microbial resemblance | Decisive non-equivalence | Disposition |
| --- | --- | --- | --- |
| [001 — adaptive topology](../../experiments/candidates/001-adaptive-topology.md) | matrix, sectors, detachment, and contact graphs change interactions | physical growth/erosion is not a costed logical-edge policy | no promotion; add spatial stress only |
| [003 — recovery dynamics fragility](../../experiments/candidates/003-recovery-dynamics-fragility.md) | community recovery and phage oscillations can change before collapse | succession or oscillation is not critical slowing; transition class and perturbation response remain required | no promotion |
| [005 — severity-ordered containment](../../experiments/candidates/005-severity-ordered-containment.md) | tolerance, local refuges, detoxification, dispersal, and regrowth create staged outcomes | microbes do not supply the candidate's verified least-destructive action ladder | add masking/recurrence stressors |
| [013 — deficit–capability routing](../../experiments/candidates/013-deficit-capability-routing.md) | metabolite demand and local consumption resemble routed resources | ordinary cross-feeding lacks deficit-up/context-down signaling and a declared capability gate | no promotion |
| [016 — conflict-bounded unit transition](../../experiments/candidates/016-conflict-bounded-unit-transition.md) | matrix goods, cheats, phage, plasmids, and succession create multilevel-looking dynamics | no collective reproduction event or cost-adjusted between-collective selection is established | retain conflict stress only |
| [019 — audited cumulative inheritance](../../experiments/candidates/019-audited-cumulative-inheritance.md) | HGT and ecological succession transmit material across cell turnover | transfer is not evaluated cumulative capability with compatibility, audit, and protected retention | retain unsafe-transfer null |

## Cross-audit deduplication

- **Immunology:** clonal diversity and selection already support P-004.
  Persister survival lacks antigen-specific recognition and affinity
  maturation; HGT lacks controlled immune memory.
- **Collective/ecology:** shared-substrate defense, capability-gap repair,
  engraftment barriers, and vector-valued resilience are already recorded in
  the
  [collective audit](2026-08-05-collective-ecological-resilience.md).
  Microbial quorum sensing must not be merged with animal quorum-like voting.
- **Chemistry:** diffusion, reaction, driven reset, concentration thresholds,
  and mass-action stochasticity are already normalized in the
  [chemistry audit](2026-08-05-chemistry-reaction-networks-proofreading.md).
  A microbial molecule does not create a new information principle.
- **Epidemiology:** phage spread, contact opportunity, endogenous observation,
  intervention feedback, and refuges face the same state/observation separation
  as the
  [epidemiology audit](2026-08-05-epidemiology-and-surveillance-control.md).
- **Cellular quality control:** sensing, containment, repair, removal,
  replacement, and verification remain separate actions in the
  [cellular quality-control audit](2026-08-05-cellular-quality-control.md).
  Biofilm survival or dispersal does not collapse them.

## Strongest null hypotheses

1. **Transport null:** quorum-like gains are fully explained by a leaky
   concentration field, geometry, flow, and receiver threshold; no
   group-decision primitive is needed.
2. **Messaging null:** typed pub/sub with TTL and rate limits matches any
   signal-field communication benefit at lower latency and lifecycle cost.
3. **Partition null:** ordinary sharding, access control, caching, and
   locality-aware placement match matrix/compartment benefits.
4. **Physiology null:** biofilm drug tolerance is explained by growth,
   oxygen, active stress response, and drug-specific pharmacodynamics rather
   than a collective controller.
5. **Reserve null:** replicas, checkpoints, cold standby, and random
   restarts dominate persister-like inactive capacity.
6. **Transfer null:** package registries, federated update, retrieval, and
   signed artifact delivery dominate HGT-like lateral propagation.
7. **Evolution null:** phage coevolution adds no robust defense beyond
   adaptive red teaming, diversity, patching, and ordinary attack generation.
8. **Dataflow null:** typed producer–consumer graphs and queues dominate
   cross-feeding analogues after conversion and dependency costs.
9. **Routing null:** backpressure, primal–dual allocation, and Candidate 013
   match any deficit or resource-flow behavior.
10. **Spatial-null:** observed sectors and coexistence are founder effects,
    limited mixing, and local resource access, not useful self-organization.
11. **Drug-response null:** apparent collective protection is a mixture of
    detoxification, altered target activity, survivor composition, and
    selection that a mechanistic pharmacodynamic model explains.
12. **Migration null:** process draining, live migration, cache eviction, and
    rolling deployment dominate dispersal analogues.
13. **Workflow null:** staged pipelines and scheduled replacement reproduce
    succession without ecological populations.
14. **Measurement null:** compositional sequencing, plating, endpoints, and
    reporter thresholds create the apparent community-level effect; absolute,
    lineage-resolved, time-resolved measures remove it.

## Equal-budget falsification experiments

All arms receive paired seeds and identical raw observations, task
opportunities, wall-clock envelope, peak memory, storage, communication
capacity, model or module count, update operations, and external intervention
budget unless the varied resource is the registered treatment. Report total
joules and timely protected utility, not only final accuracy or survivor count.

### Experiment A — signal field versus messaging

- **Task:** route sparse context among modules distributed across a changing
  communication geometry with local demand and intermittent link flow.
- **Arms:** shared counter; typed pub/sub plus TTL; leaky global integrator;
  spatial diffusion/advection field; field plus enzymatic/algorithmic
  quenching; and learned attention with matched message budget.
- **Equalize:** sender opportunities, delivered bits, receiver state, latency
  budget, memory, controller operations, and energy.
- **Intervene:** hold sender count fixed while changing confinement, flow,
  degradation, one high-output sender, and receptor gain.
- **Measure:** timely utility, false activation, missed activation, spatial
  selectivity, messages, state bytes, latency, and joules.
- **Kill:** the field reduces to a count, pub/sub dominates, or activation is
  unsafe under one faulty producer.

### Experiment B — matrix, gradient, and physiology decomposition

- **Task:** serve requests through a spatially partitioned shared workspace
  under burst load, contaminating inputs, and local resource depletion.
- **Arms:** flat shared memory; static shards; locality-aware cache; explicit
  diffusion/consumption environment; structure without receiver adaptation;
  receiver adaptation without structure; and the complete analogue.
- **Equalize:** capacity, bytes, peak bandwidth, reserve, cleanup, and energy.
- **Intervene:** independently vary transport, local consumption, response
  program, structural barrier, and population composition.
- **Measure:** useful throughput, contamination spread, tail latency, local
  resource profiles, false exclusion, cleanup work, recurrence, and joules.
- **Kill:** one conventional partition or physiology model explains the gain,
  or retained hazards erase the benefit.

### Experiment C — persister-like reserve

- **Task:** maintain a modular service through finite, unpredictable hazards
  that affect active configurations differently.
- **Arms:** no reserve; hot replica; checkpoint/restart; cold standby;
  randomized low-activity state; learned switching; and oracle hazard-aware
  reserve.
- **Equalize:** total capacity, state bytes, refresh work, fault exposure,
  recovery compute, and energy.
- **Intervene:** vary hazard duration, correlation, recurrence, state staleness,
  and service deadline.
- **Measure:** survival, timely restored utility, resumption delay, stale-state
  errors, normal-regime opportunity cost, and lifecycle joules.
- **Kill:** reserve states are not reversible, correlated hazards erase
  diversity, or checkpoints/replicas dominate the frontier.

### Experiment D — horizontal artifact transfer

- **Task:** spread optional capabilities among heterogeneous agents with
  changing interfaces, some useful and some malicious or incompatible.
- **Arms:** central package registry; retrieval on demand; federated averaging;
  direct neighbor transfer; relay transfer by recipients; and neighbor transfer
  plus provenance, sandbox, tests, rollback, and revocation.
- **Equalize:** bytes, validation compute, update opportunities, storage,
  failures, human review, and energy.
- **Measure:** acquisition time, expressed capability, incompatibility,
  malicious spread, rollback completeness, task value, lineage, and joules.
- **Kill:** unreviewed relay amplifies harm, or the signed central registry
  matches capability transfer with lower burden.

### Experiment E — phage-like adaptive adversary

- **Task:** protect a modular population against replicating attacks whose
  target range can evolve.
- **Arms:** fixed fault injection; static red-team suite; adaptive centralized
  attacker; coevolving attacker population; coevolution plus spatial
  compartments; and conventional patch/isolation stack.
- **Equalize:** attack queries, defender updates, models, compute, wall time,
  reserve, and energy.
- **Intervene:** vary resource enrichment, attack transport, refuges,
  mutation, host-range cost, and return to attack-free tasks.
- **Measure:** protected utility, attacker load, oscillation amplitude,
  recovery, generalization to held-out attacks, clean-task cost, and joules.
- **Kill:** defender and attacker merely overfit, spatial refuges preserve
  attacks, or ordinary adaptive red teaming dominates.

### Experiment F — cross-feeding versus typed dataflow

- **Task:** compose modules that transform scarce resources through
  intermediate products under spatial delay and member loss.
- **Arms:** monolith; typed centralized pipeline; queue-based producer–
  consumer; unrestricted by-product sharing; local cross-feeding field; and
  Candidate 013 deficit–capability routing.
- **Equalize:** conversion capacity, messages, state, topology, latency,
  module count, failed work, and energy.
- **Intervene:** vary intermediate toxicity, leakage, consumer dependence,
  distance, partner deletion, and input regime.
- **Measure:** each member's counterfactual utility, total timely utility,
  conversion loss, recovery, dependency concentration, and joules.
- **Kill:** typed queues match the result, the system becomes a weakest-link
  dependency, or a consumer gain lowers total function.

### Experiment G — spatial competition and founder effects

- **Task:** allocate expanding capacity among competing module lineages on a
  graph with local resource fronts and porous refuges.
- **Arms:** random placement; mixed global allocator; static partition;
  locality-aware placement; matrix/adhesion analogue; and Candidate 001
  adaptive topology.
- **Equalize:** initial lineages, active capacity, edges, migration work,
  resource flux, telemetry, and energy.
- **Intervene:** randomize founder positions, reverse flow, change pore
  geometry, and swap lineage labels.
- **Measure:** absolute task output, lineage fraction, access inequality,
  newcomer success, diversity, reconfiguration, and joules.
- **Kill:** apparent advantage follows lucky frontier position or static
  placement, not the proposed adaptive mechanism.

### Experiment H — mechanism-resolved collective drug tolerance

- **Task:** survive finite corruption pulses in a mixed module population
  containing resistant, susceptible, detoxifying, dormant, and dependent
  members.
- **Arms:** independent protection; shared detoxification; receiver stress
  response; spatial refuge; persister reserve; cross-feeding dependency; and
  Candidate 005's full triage ladder.
- **Equalize:** peak capacity, protective compute, storage, communication,
  exposure, replacement resources, and energy.
- **Intervene:** delete the helper, mix compartments, change pulse duration,
  switch corruption class, and remove the hazard before regrowth.
- **Measure:** threshold for continued service, kill curve, recovery time,
  protected-output recurrence, resistant fraction, absolute load, and joules.
- **Kill:** one endpoint misclassifies mechanisms, protection masks a growing
  dangerous minority, or standard containment/restore dominates.

### Experiment I — dispersal versus controlled migration

- **Task:** exit an overloaded or contaminated persistent workspace while
  preserving useful state.
- **Arms:** abrupt teardown; passive expiry; process drain and restart;
  checkpoint/live migration; signal-triggered partial dispersal; and verified
  staged migration with rollback.
- **Equalize:** state bytes, downtime, target capacity, cleanup, validation,
  fallback reserve, and energy.
- **Measure:** source clearance, viable migrated units, destination utility,
  consistency errors, spread of contamination, recurrence, and joules.
- **Kill:** source biomass falls but contamination spreads, destination
  establishment fails, or ordinary draining/migration wins.

### Experiment J — succession versus staged workflow

- **Task:** process replenishable complex inputs through early extractors,
  primary transformers, and secondary consumers under arrival-order changes.
- **Arms:** fixed pipeline; learned scheduler; queueing network; ecological
  population with local interactions; time-only stage policy; and
  state-triggered replacement.
- **Equalize:** cumulative work, modules, inputs, storage, communication,
  turnover, wall time, and energy.
- **Intervene:** randomize inoculation order, remove facilitators, replenish
  substrate early, insert late consumers first, and change sampling interval.
- **Measure:** absolute throughput, relative composition, stage duration,
  retained capability, priority effects, recovery, and joules.
- **Kill:** stages follow elapsed time or depletion alone, later composition
  lowers function, or a standard pipeline matches the frontier.

## Temporary claims

These claims are deliberately scoped to their preparations and evidence type.

| ID | Status | Scoped claim | Primary support | Main boundary |
| --- | --- | --- | --- | --- |
| C-MIC-01 | established | Growing luminous bacteria can condition medium and activate transcription of the luminescence system in the studied culture. | Nealson et al. 1970 | not consensus or a universal density gauge |
| C-MIC-02 | established | LuxL/LuxM and LuxN perturbations separated signal-production and response functions in Vibrio harveyi. | Bassler et al. 1993 | additional pathways existed; one circuit is not quorum sensing in general |
| C-MIC-03 | established | One to three confined P. aeruginosa cells could activate a quorum-sensing reporter in sub-picolitre droplets. | Boedicker et al. 2009 | confinement and reporter scope |
| C-MIC-04 | established | Flow and aggregate geometry causally altered quorum-sensing activation in the studied synthetic/biofilm systems. | Kim et al. 2016; Darch et al. 2018 | density is only one contributor |
| C-MIC-05 | established | Enzymatic acyl-homoserine-lactone degradation attenuated scoped quorum-dependent infection. | Dong et al. 2001 | no universal safety or resistance-proof therapy |
| C-MIC-06 | established | Signal or response non-producers could exploit quorum-regulated public output and gain relative fitness under tested conditions. | Diggle et al. 2007 | not every regulated trait is cooperative |
| C-MIC-07 | established | Mature P. aeruginosa colony biofilms contained oxygen-limited, low-activity regions contributing to antibiotic tolerance. | Borriello et al. 2004 | preparation- and drug-specific quantitative contribution |
| C-MIC-08 | established | The stringent response causally contributed to starvation-associated antibiotic tolerance in scoped P. aeruginosa biofilms and models. | Nguyen et al. 2011 | active response is not the only tolerance mechanism |
| C-MIC-09 | established | RbmA-dependent V. cholerae matrix structure restricted invasion into established biofilm interiors. | Nadell et al. 2015 | not universal matrix protection |
| C-MIC-10 | established | Flow and pore geometry changed competition between Pel-producing and non-producing P. aeruginosa lineages. | Nadell et al. 2017 | environment-specific fitness sign |
| C-MIC-11 | established | E. coli persistence in a classic single-cell assay involved reversible phenotypic switching and retained drug susceptibility after regrowth. | Balaban et al. 2004 | one strain, drugs, and device |
| C-MIC-12 | established | Stochastic KatG expression affected isoniazid killing in single mycobacterial lineages. | Wakamoto et al. 2013 | drug activation mechanism, not all persistence |
| C-MIC-13 | disputed generalization | Pre-treatment dormancy is not a necessary-and-sufficient definition of persistence; available assays and interpretations remain mechanism-sensitive. | Orman & Brynildsen 2013 plus published dispute | do not replace one universal claim with another |
| C-MIC-14 | established | Corrected deletion of ten type-II toxin–antitoxin systems did not reduce the measured E. coli persistence phenotype. | Goormaghtigh et al. 2018 | does not exclude every TA role in every condition |
| C-MIC-15 | established in system | In-situ imaging revealed spatially structured conjugation events that classical plating undercounted in defined biofilms. | Hausner & Wuertz 1999 | method and plasmid/system scope |
| C-MIC-16 | established | ICEBs1 transfer formed local biofilm clusters and newly formed transconjugants drove much subsequent propagation. | Bourassa et al. 2022 | transfer is not benefit or validated adoption |
| C-MIC-17 | established | Resource and predation conditions supported complex E. coli–T7 coexistence with resistant and host-range variants in chemostats. | Chao et al. 1977 | not a universal equilibrium |
| C-MIC-18 | established | Glucose enrichment increased phage density, reduced stability, and accelerated resistant-lineage invasion in E. coli–T4 chemostats. | Bohannan & Lenski 1997 | one resource, host, phage, and apparatus |
| C-MIC-19 | established | Replicate bacteria–phage communities followed divergent antagonistic coevolutionary trajectories. | Buckling & Rainey 2002 | no general defense benefit |
| C-MIC-20 | established | Slow-growing colony interiors let sensitive bacteria escape phage while liquid cultures did not in a two-strain P. aeruginosa system. | Testa et al. 2019 | refuge is conditional and may retain threats |
| C-MIC-21 | established in assay | Metabolically dissimilar donors more often supported selected amino-acid auxotroph recipients in a pairwise screen. | Giri et al. 2021 | recipient growth is not bilateral fitness |
| C-MIC-22 | established | pH-dependent nitrite toxicity changed the interaction sign and spatial lineage success in a synthetic cross-feeding range expansion. | Borer et al. 2020 | system-specific chemistry and geometry |
| C-MIC-23 | established | Secondary cross-feeders could slow particle turnover by hindering primary degraders in model marine communities. | Enke et al. 2018 | community abundance is not task optimum |
| C-MIC-24 | established | Obligate cross-feeding could lower the antibiotic concentration tolerated by otherwise resistant members through a susceptible dependency. | Adamowicz et al. 2018 | timing and cross-protection caused deviations |
| C-MIC-25 | established | Resistant minority lineages altered survival of susceptible neighbors through indole-associated response or antibiotic deactivation in scoped systems. | Lee et al. 2010; Sorg et al. 2016 | mechanisms differ; neither is consensus |
| C-MIC-26 | established | Beta-lactamase-plasmid frequency reflected antibiotic concentration, density, public detoxification, and carriage cost in the studied population. | Yurtsev et al. 2013 | endpoint fraction mixes transfer and selection |
| C-MIC-27 | established | Nitric oxide and c-di-GMP phosphodiesterase interventions triggered scoped P. aeruginosa biofilm dispersal. | Barraud et al. 2006; Roy et al. 2012 | active dispersal is not safe migration |
| C-MIC-28 | established | Model marine-particle communities underwent rapid reproducible succession shaped by dispersal limitation and facilitation. | Datta et al. 2016 | reproducibility is not progress or inheritance |
| C-MIC-29 | disputed | Quorum sensing is equivalent to consensus, voting, or independently corroborated commitment. | contradicted by transport and confinement interventions | reject category error |
| C-MIC-30 | disputed | Biofilm structure establishes brain-like representation, global control, or collective cognition. | no supporting intervention in audited sources | reject analogy |
| C-MIC-31 | disputed | Cross-feeding, matrix production, or community persistence is intrinsically cooperative and efficient. | sign reversals and lifecycle accounting | requires counterfactual fitness and full cost |
| C-MIC-32 | speculative | A transport-explicit, locally decoded shared field may improve sparse modular coordination when geometry and cleanup are task-relevant. | transfer hypothesis only | hold as P-011/P-013 experiment fixture; reject if pub/sub wins |

## Integration disposition

**Promote now:** no new stable principle, candidate, or shared claim. The
primary studies sharpen existing principles by requiring transport-explicit
fields, local receiver state, lineage-resolved ecology, and lifecycle
accounting.

**Hold:** C-MIC-32 only as an experimental fixture within P-011/P-013 and
Experiment A. It is not Candidate 021. Candidate 001 owns actual topology
change; Candidate 003 owns transition-class-qualified recovery diagnostics;
Candidate 005 owns severity-ordered containment; Candidate 013 owns
deficit–capability routing; Candidate 016 owns collective-unit selection; and
Candidate 019 owns audited cumulative inheritance.

**Reject as standalone principles or prescriptions:**

- quorum sensing as consensus, democracy, or reliable population count;
- quorum quenching as universally safe communication shutdown;
- biofilm as brain, organism-level controller, or general intelligent
  collective;
- extracellular matrix as the sole cause of tolerance or an intrinsically
  cooperative public good;
- persistence as genetic resistance, universal dormancy, or free reserve;
- horizontal gene transfer as learning, truth propagation, or audited
  inheritance;
- phage coevolution as automatically robust adversarial training;
- cross-feeding as necessarily mutualistic or efficient;
- spatial pattern as evidence of useful modular organization;
- collective survival as one antibiotic-response mechanism;
- dispersal as validated migration; and
- succession as progress, optimization, or a collective developmental program.

**Audit verdict:** microbial ecology contributes unusually strong falsification
cases for simplistic collective metaphors. Signals are physical fields,
receivers are heterogeneous, shared environments can help or harm, spatial
structure changes both opportunity and selection, and apparent robustness can
hide vulnerable or exploitative lineages. Those findings strengthen existing
project bundles and experiment design. They do not justify a microbial-themed
architecture or a new candidate.

## Bibliography (audit-local BibTeX)

```bibtex
@article{nealson1970luminescence,
  author = {Nealson, Kenneth H. and Platt, Terry and Hastings, J. Woodland},
  title = {Cellular Control of the Synthesis and Activity of the Bacterial Luminescent System},
  journal = {Journal of Bacteriology},
  year = {1970},
  volume = {104},
  number = {1},
  pages = {313--322},
  doi = {10.1128/jb.104.1.313-322.1970}
}

@article{bassler1993intercellular,
  author = {Bassler, Bonnie L. and Wright, Miriam and Showalter, Richard E. and Silverman, Michael R.},
  title = {Intercellular signalling in Vibrio harveyi: sequence and function of genes regulating expression of luminescence},
  journal = {Molecular Microbiology},
  year = {1993},
  volume = {9},
  number = {4},
  pages = {773--786},
  doi = {10.1111/j.1365-2958.1993.tb01737.x}
}

@article{boedicker2009confinement,
  author = {Boedicker, James Q. and Vincent, Meghan E. and Ismagilov, Rustem F.},
  title = {Microfluidic Confinement of Single Cells of Bacteria in Small Volumes Initiates High-Density Behavior of Quorum Sensing and Growth and Reveals Its Variability},
  journal = {Angewandte Chemie International Edition},
  year = {2009},
  volume = {48},
  number = {32},
  pages = {5908--5911},
  doi = {10.1002/anie.200901550}
}

@article{kim2016flow,
  author = {Kim, Minyoung Kevin and Ingremeau, Fran{\c{c}}ois and Zhao, Aishan and Bassler, Bonnie L. and Stone, Howard A.},
  title = {Local and global consequences of flow on bacterial quorum sensing},
  journal = {Nature Microbiology},
  year = {2016},
  volume = {1},
  pages = {15005},
  doi = {10.1038/nmicrobiol.2015.5}
}

@article{darch2018spatial,
  author = {Darch, Sophie E. and Simoska, Olja and Fitzpatrick, Mignon and Barraza, Juan P. and Stevenson, Keith J. and Bonnecaze, Roger T. and Shear, Jason B. and Whiteley, Marvin},
  title = {Spatial determinants of quorum signaling in a Pseudomonas aeruginosa infection model},
  journal = {Proceedings of the National Academy of Sciences},
  year = {2018},
  volume = {115},
  number = {18},
  pages = {4779--4784},
  doi = {10.1073/pnas.1719317115}
}

@article{dong2001quenching,
  author = {Dong, Yi-Hu and Wang, Lian-Hui and Xu, Jin-Ling and Zhang, Hai-Bao and Zhang, Xi-Fen and Zhang, Lian-Hui},
  title = {Quenching quorum-sensing-dependent bacterial infection by an N-acyl homoserine lactonase},
  journal = {Nature},
  year = {2001},
  volume = {411},
  pages = {813--817},
  doi = {10.1038/35081101}
}

@article{diggle2007cooperation,
  author = {Diggle, Stephen P. and Griffin, Ashleigh S. and Campbell, Genevieve S. and West, Stuart A.},
  title = {Cooperation and conflict in quorum-sensing bacterial populations},
  journal = {Nature},
  year = {2007},
  volume = {450},
  number = {7168},
  pages = {411--414},
  doi = {10.1038/nature06279}
}

@article{borriello2004oxygen,
  author = {Borriello, Giorgia and Werner, Erin and Roe, Frank and Kim, Aana M. and Ehrlich, Garth D. and Stewart, Philip S.},
  title = {Oxygen Limitation Contributes to Antibiotic Tolerance of Pseudomonas aeruginosa in Biofilms},
  journal = {Antimicrobial Agents and Chemotherapy},
  year = {2004},
  volume = {48},
  number = {7},
  pages = {2659--2664},
  doi = {10.1128/AAC.48.7.2659-2664.2004}
}

@article{nguyen2011starvation,
  author = {Nguyen, Dao and Joshi-Datar, Amruta and L{\'e}pine, Fran{\c{c}}ois and Bauerle, Elizabeth and Olakanmi, Oyebode and Beer, Karlyn and McKay, Geoffrey and Siehnel, Richard and Schafhauser, James and Wang, Yun and Britigan, Bradley E. and Singh, Pradeep K.},
  title = {Active Starvation Responses Mediate Antibiotic Tolerance in Biofilms and Nutrient-Limited Bacteria},
  journal = {Science},
  year = {2011},
  volume = {334},
  number = {6058},
  pages = {982--986},
  doi = {10.1126/science.1211037}
}

@article{nadell2015invasion,
  author = {Nadell, Carey D. and Drescher, Knut and Wingreen, Ned S. and Bassler, Bonnie L.},
  title = {Extracellular matrix structure governs invasion resistance in bacterial biofilms},
  journal = {The ISME Journal},
  year = {2015},
  volume = {9},
  pages = {1700--1709},
  doi = {10.1038/ismej.2014.246}
}

@article{nadell2017flow,
  author = {Nadell, Carey D. and Ricaurte, Deirdre and Yan, Jing and Drescher, Knut and Bassler, Bonnie L.},
  title = {Flow environment and matrix structure interact to determine spatial competition in Pseudomonas aeruginosa biofilms},
  journal = {eLife},
  year = {2017},
  volume = {6},
  pages = {e21855},
  doi = {10.7554/eLife.21855}
}

@article{balaban2004persistence,
  author = {Balaban, Nathalie Q. and Merrin, Jack and Chait, Remy and Kowalik, Lukasz and Leibler, Stanislas},
  title = {Bacterial Persistence as a Phenotypic Switch},
  journal = {Science},
  year = {2004},
  volume = {305},
  number = {5690},
  pages = {1622--1625},
  doi = {10.1126/science.1099390}
}

@article{wakamoto2013dynamic,
  author = {Wakamoto, Yuichi and Dhar, Neeraj and Chait, Remy and Schneider, Katrin and Signorino-Gelo, Fran{\c{c}}ois and Leibler, Stanislas and McKinney, John D.},
  title = {Dynamic Persistence of Antibiotic-Stressed Mycobacteria},
  journal = {Science},
  year = {2013},
  volume = {339},
  number = {6115},
  pages = {91--95},
  doi = {10.1126/science.1229858}
}

@article{orman2013dormancy,
  author = {Orman, Mehmet A. and Brynildsen, Mark P.},
  title = {Dormancy Is Not Necessary or Sufficient for Bacterial Persistence},
  journal = {Antimicrobial Agents and Chemotherapy},
  year = {2013},
  volume = {57},
  number = {7},
  pages = {3230--3239},
  doi = {10.1128/AAC.00243-13}
}

@article{goormaghtigh2018toxin,
  author = {Goormaghtigh, Fr{\'e}d{\'e}ric and Fraikin, Nathan and Putrin{\v{s}}, Marta and Hallaert, Thibaut and Hauryliuk, Vasili and Garcia-Pino, Abel and Sj{\"o}din, Andreas and Kasvandik, Sergo and Udekwu, Klas and Tenson, Tanel and Kaldalu, Niilo and Van Melderen, Laurence},
  title = {Reassessing the Role of Type II Toxin-Antitoxin Systems in Formation of Escherichia coli Type II Persister Cells},
  journal = {mBio},
  year = {2018},
  volume = {9},
  number = {3},
  pages = {e00640-18},
  doi = {10.1128/mbio.00640-18}
}

@article{hausner1999conjugation,
  author = {Hausner, Martina and Wuertz, Stefan},
  title = {High Rates of Conjugation in Bacterial Biofilms as Determined by Quantitative In Situ Analysis},
  journal = {Applied and Environmental Microbiology},
  year = {1999},
  volume = {65},
  number = {8},
  pages = {3710--3713},
  doi = {10.1128/AEM.65.8.3710-3713.1999}
}

@article{bourassa2022ice,
  author = {Bourassa, Jean-S{\'e}bastien and Jeannotte, Gabriel and Lebel-Beaucage, Sandrine and Beauregard, Pascale B.},
  title = {Second-Generation Transfer Mediates Efficient Propagation of {ICEBs1} in Biofilms},
  journal = {Journal of Bacteriology},
  year = {2022},
  volume = {204},
  number = {10},
  pages = {e00181-22},
  doi = {10.1128/jb.00181-22}
}

@article{chao1977community,
  author = {Chao, Lin and Levin, Bruce R. and Stewart, Frank M.},
  title = {A Complex Community in a Simple Habitat: An Experimental Study with Bacteria and Phage},
  journal = {Ecology},
  year = {1977},
  volume = {58},
  number = {2},
  pages = {369--378},
  doi = {10.2307/1935611}
}

@article{bohannan1997enrichment,
  author = {Bohannan, Brendan J. M. and Lenski, Richard E.},
  title = {Effect of Resource Enrichment on a Chemostat Community of Bacteria and Bacteriophage},
  journal = {Ecology},
  year = {1997},
  volume = {78},
  number = {8},
  pages = {2303--2315},
  doi = {10.1890/0012-9658(1997)078[2303:EOREOA]2.0.CO;2}
}

@article{buckling2002coevolution,
  author = {Buckling, Angus and Rainey, Paul B.},
  title = {Antagonistic coevolution between a bacterium and a bacteriophage},
  journal = {Proceedings of the Royal Society B: Biological Sciences},
  year = {2002},
  volume = {269},
  number = {1494},
  pages = {931--936},
  doi = {10.1098/rspb.2001.1945}
}

@article{testa2019phage,
  author = {Testa, Samuele and Berger, Sarah and Piccardi, Philippe and Oechslin, Frank and Resch, Gr{\'e}gory and Mitri, Sara},
  title = {Spatial structure affects phage efficacy in infecting dual-strain biofilms of Pseudomonas aeruginosa},
  journal = {Communications Biology},
  year = {2019},
  volume = {2},
  pages = {405},
  doi = {10.1038/s42003-019-0633-x}
}

@article{giri2021dissimilarity,
  author = {Giri, Samir and O{\~n}a, Leonardo and Waschina, Silvio and Shitut, Shraddha and Yousif, Ghada and Kaleta, Christoph and Kost, Christian},
  title = {Metabolic dissimilarity determines the establishment of cross-feeding interactions in bacteria},
  journal = {Current Biology},
  year = {2021},
  volume = {31},
  number = {24},
  pages = {5547--5557.e6},
  doi = {10.1016/j.cub.2021.10.019}
}

@article{borer2020spatial,
  author = {Borer, Benedict and Ciccarese, Davide and Johnson, David and Or, Dani},
  title = {Spatial organization in microbial range expansion emerges from trophic dependencies and successful lineages},
  journal = {Communications Biology},
  year = {2020},
  volume = {3},
  pages = {685},
  doi = {10.1038/s42003-020-01409-y}
}

@article{enke2018microscale,
  author = {Enke, Tim N. and Leventhal, Gabriel E. and Metzger, Matthew and Saavedra, Jos{\'e} T. and Cordero, Otto X.},
  title = {Microscale ecology regulates particulate organic matter turnover in model marine microbial communities},
  journal = {Nature Communications},
  year = {2018},
  volume = {9},
  pages = {2743},
  doi = {10.1038/s41467-018-05159-8}
}

@article{adamowicz2018crossfeeding,
  author = {Adamowicz, Elizabeth M. and Flynn, Jeffrey and Hunter, Ryan C. and Harcombe, William R.},
  title = {Cross-feeding modulates antibiotic tolerance in bacterial communities},
  journal = {The ISME Journal},
  year = {2018},
  volume = {12},
  pages = {2723--2735},
  doi = {10.1038/s41396-018-0212-z}
}

@article{xavier2007cooperation,
  author = {Xavier, Jo{\~a}o B. and Foster, Kevin R.},
  title = {Cooperation and conflict in microbial biofilms},
  journal = {Proceedings of the National Academy of Sciences},
  year = {2007},
  volume = {104},
  number = {3},
  pages = {876--881},
  doi = {10.1073/pnas.0607651104}
}

@article{lee2010charity,
  author = {Lee, Henry H. and Molla, Michael N. and Cantor, Charles R. and Collins, James J.},
  title = {Bacterial charity work leads to population-wide resistance},
  journal = {Nature},
  year = {2010},
  volume = {467},
  pages = {82--85},
  doi = {10.1038/nature09354}
}

@article{yurtsev2013plasmids,
  author = {Yurtsev, Eugene A. and Chao, Hui Xiao and Datta, Manoshi S. and Artemova, Tatiana and Gore, Jeff},
  title = {Bacterial cheating drives the population dynamics of cooperative antibiotic resistance plasmids},
  journal = {Molecular Systems Biology},
  year = {2013},
  volume = {9},
  pages = {683},
  doi = {10.1038/msb.2013.39}
}

@article{sorg2016collective,
  author = {Sorg, Robin A. and Lin, Leo and van Doorn, G. Sander and Sorg, Moritz and Olson, Joshua and Nizet, Victor and Veening, Jan-Willem},
  title = {Collective Resistance in Microbial Communities by Intracellular Antibiotic Deactivation},
  journal = {PLOS Biology},
  year = {2016},
  volume = {14},
  number = {12},
  pages = {e2000631},
  doi = {10.1371/journal.pbio.2000631}
}

@article{barraud2006nitric,
  author = {Barraud, Nicolas and Hassett, Daniel J. and Hwang, Sung-Hei and Rice, Scott A. and Kjelleberg, Staffan and Webb, Jeremy S.},
  title = {Involvement of Nitric Oxide in Biofilm Dispersal of Pseudomonas aeruginosa},
  journal = {Journal of Bacteriology},
  year = {2006},
  volume = {188},
  number = {21},
  pages = {7344--7353},
  doi = {10.1128/JB.00779-06}
}

@article{roy2012dipa,
  author = {Roy, Ankita Basu and Petrova, Olga E. and Sauer, Karin},
  title = {The Phosphodiesterase DipA (PA5017) Is Essential for Pseudomonas aeruginosa Biofilm Dispersion},
  journal = {Journal of Bacteriology},
  year = {2012},
  volume = {194},
  number = {11},
  pages = {2904--2915},
  doi = {10.1128/jb.05346-11}
}

@article{datta2016succession,
  author = {Datta, Manoshi S. and Sliwerska, Elzbieta and Gore, Jeff and Polz, Martin F. and Cordero, Otto X.},
  title = {Microbial interactions lead to rapid micro-scale successions on model marine particles},
  journal = {Nature Communications},
  year = {2016},
  volume = {7},
  pages = {11965},
  doi = {10.1038/ncomms11965}
}
```

# Soil, crop, and multi-resource co-limitation audit

<!-- markdownlint-disable MD013 -->

**Date:** 2026-08-21

**Scope:** soil resource form and transport, crop water–nutrient interaction,
multiple-nutrient limitation, spatial patchiness, stage-qualified supply,
root proliferation, balanced fertilization, crop-system models, and the
translation to typed resource allocation

**Purpose:** test whether soil and crop science change the project's resource
state, mathematics, and experiments; identify mature nulls; and define a
workstation contract for
[Candidate 013](../../experiments/candidates/013-deficit-capability-routing.md)
without promoting a new principle

**Evidence boundary:** primary experiments, original quantitative syntheses,
primary models, official datasets, and authoritative model descriptions. A
response to resource addition establishes limitation only for the measured
system, intervention, endpoint, and observation window. It does not by itself
identify transport, uptake, allocation, or community mechanism.

## Executive finding

Soil and crop science materially change the experimental contract but do not
add a principle. The strongest cross-domain result is:

> Usable capacity is a time-qualified intersection of typed delivery
> processes; total stock, measured concentration, allocation, structural
> proliferation, uptake, and realized service are different states.

This result sharpens the existing material-service firewall and makes the
scalar version of Candidate 013 an explicit special case. It does not establish
that the candidate's upward-deficit/downward-context composition is novel or
superior. Multi-resource backpressure, vector shadow prices, mechanistic
transport and uptake, balanced-nutrient models, crop-system simulation, and
receding-horizon optimization are mandatory nulls.

| Disposition | Result |
| --- | --- |
| **Promote** | none |
| **Experiment** | vector deficit/context signaling with a joint local feasibility gate under complementary, differently mobile, expiring resources |
| **Adopt as evaluation contract** | separate stock, form, reachable flux, uptake, internal pool, conversion, endpoint service, loss, and residual state |
| **Reject as universal** | one limiting resource at a time; more stock means more service; root proliferation means greater capture; balanced inputs always increase yield; any positive interaction proves simultaneous co-limitation |

## Terms that must remain separate

### Resource-state chain

For every resource type retain, in order:

1. total elemental or physical stock;
2. labile, exchangeable, soluble, released, or otherwise accessible form;
3. location and distance from a receiver;
4. mass-flow, diffusion, transport, or transformation rate;
5. receiver uptake or acceptance capacity;
6. internal storage and remobilizable quota;
7. physiological or task conversion;
8. harvested or endpoint-qualified service;
9. loss, waste, toxicity, or off-target consequence; and
10. residual state available to the next event.

No arrow is licensed by the observation of the state before it.

### Limitation forms

Let $Y_{00}$ be the untreated outcome, $Y_{10}$ and $Y_{01}$ the two
single-resource outcomes, and $Y_{11}$ the combined-resource outcome.

- **Single-resource limitation:** only one single-resource intervention
  produces the declared response.
- **Independent co-limitation:** both resources separately produce a response.
- **Simultaneous co-limitation:** neither resource alone produces the response,
  while the combination does.
- **Serial limitation:** a second resource becomes effective only after a
  primary resource has been supplied; order or time resolves the mechanism.
- **Super-additivity:**

  $$
  \Delta_{12}=Y_{11}+Y_{00}-Y_{10}-Y_{01}>0.
  $$

  This is an interaction contrast in outcome units, not sufficient evidence
  for simultaneous co-limitation.
- **Community-level co-limitation:** the aggregate can respond to multiple
  resources even when different members are singly limited by different
  resources.

Factorial intervention is necessary for these labels, and sequential
intervention is necessary when serial and simultaneous explanations remain
compatible.

## Evidence audit

### SCL-01 — multiple limitation forms occur, and synergy is not a unique mechanism

**Status:** established by original quantitative synthesis.

Harpole et al. assembled 641 published factorial nitrogen–phosphorus studies
across terrestrial, freshwater, and marine primary producers. More than half
showed some synergistic response. Strict simultaneous or independent
co-limitation was supported in 28% under the authors' response classification.
The paper explicitly separates simultaneous, independent, serial, additive,
super-additive, and sub-additive responses.

**Boundary:** this is a heterogeneous community-biomass synthesis, not a crop
routing experiment. Its classification depends on treatment means, response
thresholds, study power, and endpoint. Community-level patterns can arise from
different species or mechanisms.

**Project consequence:** Candidate 013 must not use `positive interaction` as
a synonym for `simultaneous co-limitation`. Its synthetic fixture needs all
limitation forms plus sequential interventions.

**Primary synthesis:** W. S. Harpole et al., *Nutrient co-limitation of primary
producer communities*, Ecology Letters 14, 852–862 (2011),
[doi:10.1111/j.1461-0248.2011.01651.x](https://doi.org/10.1111/j.1461-0248.2011.01651.x).

### SCL-02 — standardized grassland experiments reject a universal scalar nutrient bottleneck

**Status:** established for the tested grasslands and endpoint.

Fay et al. applied N, P, and K plus micronutrients in full factorial
combinations at 42 grassland sites on five continents for three to five years.
Nutrient availability limited aboveground net primary production at 31 sites,
and pairwise combinations co-limited it at 29. Across sites, combined N and P
increased ANPP by 40%, compared with 18% for N alone and 9% for P alone. The
form and magnitude varied by site and year.

**Boundary:** the endpoint was grassland ANPP, not crop grain yield or
individual physiology. K and micronutrients were bundled, so their effects
cannot be separated. Twenty-eight of the 42 sites were in North America. The
result falsifies a universal one-dimensional resource story, not every scoped
bottleneck model.

**Project consequence:** typed vector state and held-out environment tests are
mandatory; one global scarcity scalar is a comparator, not an assumption.

**Primary experiment:** P. A. Fay et al., *Grassland productivity limited by
multiple nutrients*, Nature Plants 1, 15080 (2015),
[doi:10.1038/nplants.2015.80](https://doi.org/10.1038/nplants.2015.80).

### SCL-03 — long-duration public factorial data can provide an external fixture

**Status:** established for the measured grassland response; executable source
available.

Fay et al. later analyzed standardized N, P, and K plus micronutrient
factorials from 71 grasslands on six continents, with sites observed for four
to fourteen years. Adding more nutrient types progressively steepened the
global biomass–precipitation relationship, and the change depended on the form
of nutrient interaction. The released Dryad package contains site and site-year
means, metadata, and the analysis code.

**Boundary:** the public workbook contains aggregate site and site-year data,
not a complete root transport record. It can test response typing,
generalization, and analysis reproducibility. It cannot validate the
Candidate-013 routing mechanism.

**Project consequence:** use complete sites, years, precipitation bands, and
continents as held-out groups. Lock the downloaded artifact by DOI and SHA-256.

**Primary experiment:** P. A. Fay et al., *Interactions among nutrients govern
the global grassland biomass–precipitation relationship*, PNAS 122,
e2410748122 (2025),
[doi:10.1073/pnas.2410748122](https://doi.org/10.1073/pnas.2410748122).

**Official data:** P. A. Fay et al., Dryad dataset (2025),
[doi:10.5061/dryad.vdncjsz50](https://doi.org/10.5061/dryad.vdncjsz50).

### SCL-04 — acclimating crops motivate dynamic marginal allocation

**Status:** established as a scoped agronomic model critique; the universal
optimization claim remains unproved.

Sinclair and Park showed why a strict single limiting-factor account ignores
crop morphological and physiological acclimation. They formulated resource
investment in terms of changing marginal returns and predicted that several
resources can constrain growth together as the crop and environment change.

**Boundary:** this is a model analysis, not evidence that every plant globally
equalizes every marginal return. Objective, timescale, and unmeasured costs
matter.

**Project consequence:** dynamic vector marginal-return allocation is a mature
null. The candidate cannot claim novelty from balancing several deficits.

**Primary model paper:** T. R. Sinclair and W. I. Park, *Inadequacy of the
Liebig limiting-factor paradigm for explaining varying crop yields*, Agronomy
Journal 85, 742–746 (1993),
[doi:10.2134/agronj1993.00021962008500030040x](https://doi.org/10.2134/agronj1993.00021962008500030040x).

### SCL-05 — water changes nitrogen delivery and use in a field crop

**Status:** established for one maize experiment.

Kim et al. ran a randomized split-block maize experiment for three years with
rainfed versus supplemental-water regimes and four urea-N rates. Plants
responded to water and N simultaneously. N fertilization increased water-use
efficiency, while supplemental water increased measured use of soil N. The
fertilizer-N efficiency contrast was smaller and did not meet the same strength
of statistical evidence as the soil-N contrast.

**Boundary:** one crop, site, soil, water treatment family, and three seasons.
It does not establish the sign or magnitude for other crops, nutrients, soils,
or climates.

**Project consequence:** water is both a required resource and a transport
state. A controller that holds nutrient stock fixed while changing water can
change deliverability.

**Primary experiment:** K.-I. Kim et al., *Do synergistic relationships between
nitrogen and water influence the ability of corn to use nitrogen derived from
fertilizer and soil?*, Agronomy Journal 100, 551–556 (2008),
[doi:10.2134/agronj2007.0064](https://doi.org/10.2134/agronj2007.0064).

### SCL-06 — balanced water–nitrogen stress can improve a scoped crop frontier

**Status:** established for the analyzed semiarid wheat systems.

Sadras combined measured wheat yields from farmers' fields and experiments in
southeastern Australia with a crop-model boundary analysis. For a given water
supply, yield gap and water-use efficiency improved as water and nitrogen
limitations became more balanced.

**Boundary:** the result depends on the semiarid systems, crop model, boundary
function, and definition of degree of co-limitation. It does not license a
universal scalar balance score.

**Project consequence:** include balance-aware policies as nulls, but retain
raw water, N, yield, loss, and uncertainty axes.

**Primary analysis:** V. O. Sadras, *Yield and water-use efficiency of water-
and nitrogen-stressed wheat crops increase with degree of co-limitation*,
European Journal of Agronomy 21, 455–464 (2004),
[doi:10.1016/j.eja.2004.07.007](https://doi.org/10.1016/j.eja.2004.07.007).

### SCL-07 — equal concentration or stock does not imply equal root delivery

**Status:** established for the tested soils and seedlings.

Olsen and Watanabe compared phosphorus diffusion and corn-seedling uptake in
soils with different texture. At equal initial soil-solution P concentration,
diffusion coefficient and phosphate-buffer capacity changed predicted and
measured uptake. Bhadoria et al. separately measured phosphate diffusion as a
function of soil water content and bulk density.

**Boundary:** these are phosphorus transport experiments, not complete crop-
yield trials. Parameter values and geometry do not transfer unchanged to every
soil.

**Project consequence:** total stock, labile pool, solution concentration,
diffusive or advective delivery, and receiver uptake must be separate fields.
WS-SCL-03 deliberately holds total stock equal while changing deliverability.

**Primary sources:**

- S. R. Olsen and F. S. Watanabe, *Diffusion of phosphorus as related to soil
  texture and plant uptake*, Soil Science Society of America Journal 27,
  648–653 (1963),
  [doi:10.2136/sssaj1963.03615995002700060024x](https://doi.org/10.2136/sssaj1963.03615995002700060024x).
- P. B. S. Bhadoria et al., *Phosphate diffusion coefficients in soil as
  affected by bulk density and water content*, Zeitschrift für
  Pflanzenernährung und Bodenkunde 154, 53–57 (1991),
  [doi:10.1002/jpln.19911540111](https://doi.org/10.1002/jpln.19911540111).

### SCL-08 — mechanistic transport-plus-uptake is an old and strong null

**Status:** established model family with scoped assumptions.

Claassen and Barber measured nutrient influx as a function of concentration
using a Michaelis–Menten form, then coupled soil supply, transport, root uptake,
and root growth in a simulation model. The resulting model family predates the
candidate by decades.

**Boundary:** classical versions simplify root geometry, soil heterogeneity,
microbial competition, and parameter dynamics. They are not an oracle, but a
candidate must beat an applicable calibrated implementation rather than a
total-stock heuristic.

**Project consequence:** the deliverability equation in
[material-service-state.md](../../math/material-service-state.md) is an
accounting bound; the mechanistic model is an eligible arm.

**Primary sources:**

- N. Claassen and S. A. Barber, *A method for characterizing the relation
  between nutrient concentration and flux into roots of intact plants*, Plant
  Physiology 54, 564–568 (1974),
  [doi:10.1104/pp.54.4.564](https://doi.org/10.1104/pp.54.4.564).
- N. Claassen and S. A. Barber, *Simulation model for nutrient uptake from soil
  by a growing plant root system*, Agronomy Journal 68, 961–964 (1976),
  [doi:10.2134/agronj1976.00021962006800060030x](https://doi.org/10.2134/agronj1976.00021962006800060030x).

### SCL-09 — localized structural response is resource-specific and is not service

**Status:** established for barley sand culture; capture consequence is scoped.

Drew supplied high or low phosphate, nitrate, ammonium, or potassium to
different zones of 21-day barley root systems. Local phosphate, nitrate, and
ammonium changed lateral-root initiation and extension; potassium produced a
different, less localized pattern. Robinson's quantitative reanalysis showed
that local proliferation need not materially improve capture of mobile nitrate
even when it improves capture of less-mobile phosphate.

**Boundary:** short-duration sand culture plus a model-based reanalysis, not a
field-yield result. The direction and value of structural response depend on
resource mobility, geometry, plant state, and construction cost.

**Project consequence:** structural growth receives no score until delivered
flux, endpoint service, construction, maintenance, retirement, and patch
lifetime are measured.

**Primary sources:**

- M. C. Drew, *Comparison of the effects of a localised supply of phosphate,
  nitrate, ammonium and potassium on the growth of the seminal root system,
  and the shoot, in barley*, New Phytologist 75, 479–490 (1975),
  [doi:10.1111/j.1469-8137.1975.tb01409.x](https://doi.org/10.1111/j.1469-8137.1975.tb01409.x).
- D. Robinson, *Resource capture by localized root proliferation: why do
  plants bother?*, Annals of Botany 77, 179–186 (1996),
  [doi:10.1006/anbo.1996.0020](https://doi.org/10.1006/anbo.1996.0020).

### SCL-10 — stage-qualified supply can change the value of one resource type

**Status:** established for the tested maize regime.

Zhang et al. varied irrigation deficits during late vegetative and maturation
stages over three maize seasons. Late-vegetative deficit reduced kernel number
and leaf mass, while maturation deficit directly reduced grain-filling rate and
duration. Cross-stage interaction was present, and the same broad resource type
had different consequences by stage.

**Boundary:** one cultivar, site, soil family, and staged-deficit design. It
does not establish a universal ordering of crop-stage sensitivity. The
experiment did not isolate equal seasonal water totals delivered under
different schedules; that stricter comparison remains a workstation test.

**Project consequence:** every resource commitment needs a deadline or service
window. Late abundance cannot retrospectively repair missed service.

**Primary experiment:** H. Zhang et al., *Response of maize yield components
to growth stage-based deficit irrigation*, Agronomy Journal 111, 3244–3252
(2019),
[doi:10.2134/agronj2019.03.0214](https://doi.org/10.2134/agronj2019.03.0214).

### SCL-11 — balanced-nutrient and crop-system models are mandatory nulls

**Status:** established methods; none is universal ground truth.

QUEFTS calculates potential N, P, and K supply, mutually conditioned uptake,
nutrient-specific yield ranges, and their combined yield. Its original supply
equations were fitted to field trials and explicitly scoped to deep,
well-drained tropical soils within declared pH and soil-test ranges. DSSAT and
APSIM couple soil, weather, crop, and management components. AquaCrop supplies
a water-driven crop-production null.

**Boundary:** all require parameterization and calibration. QUEFTS' original
soil equations do not apply unchanged outside their domain. AquaCrop does not
replace a complete multi-nutrient model. Model agreement is not physical truth.

**Project consequence:** use the applicable calibrated model family and expose
its support. A candidate win over a static plan is not sufficient.

**Primary and authoritative model sources:**

- B. H. Janssen et al., *A system for quantitative evaluation of the fertility
  of tropical soils (QUEFTS)*, Geoderma 46, 299–318 (1990),
  [doi:10.1016/0016-7061(90)90021-Z](https://doi.org/10.1016/0016-7061(90)90021-Z).
- J. W. Jones et al., *The DSSAT cropping system model*, European Journal of
  Agronomy 18, 235–265 (2003),
  [doi:10.1016/S1161-0301(02)00107-7](https://doi.org/10.1016/S1161-0301(02)00107-7).
- D. P. Holzworth et al., *APSIM – evolution towards a new generation of
  agricultural systems simulation*, Environmental Modelling & Software 62,
  327–350 (2014),
  [doi:10.1016/j.envsoft.2014.07.009](https://doi.org/10.1016/j.envsoft.2014.07.009).
- P. Steduto et al., *AquaCrop—the FAO crop model to simulate yield response
  to water: I. concepts and underlying principles*, Agronomy Journal 101,
  426–437 (2009),
  [doi:10.2134/agronj2008.0139s](https://doi.org/10.2134/agronj2008.0139s).

### SCL-12 — predictive and stochastic irrigation control are ordinary comparators

**Status:** established control families with scoped demonstrations.

Model-predictive irrigation using weather forecasts and AquaCrop, and
multistage stochastic farm irrigation under uncertain rainfall and water
availability, already instantiate prediction, staged action, resource state,
and recourse.

**Boundary:** these papers do not prove universal field superiority, and their
objectives differ. They establish eligible controller families.

**Project consequence:** Candidate 013 must beat calibrated stochastic or
receding-horizon control after observation, solve deadline, resource, and
intervention budgets are equalized.

**Primary methods:**

- S. K. Saleem et al., *Irrigation control based on model predictive control:
  formulation of theory and validation using weather forecast data and
  AquaCrop model*, Environmental Modelling & Software 78, 40–53 (2016),
  [doi:10.1016/j.envsoft.2015.12.012](https://doi.org/10.1016/j.envsoft.2015.12.012).
- Q. Li and G. Hu, *Multistage stochastic programming modeling for farmland
  irrigation management under uncertainty*, PLOS ONE 15, e0233723 (2020),
  [doi:10.1371/journal.pone.0233723](https://doi.org/10.1371/journal.pone.0233723).

### SCL-13 — concurrent fungal guild networks remain a research prompt

**Status:** speculative for this project's mechanism.

Rillig et al. propose studying concurrent common fungal networks formed by
mycorrhizal, endophytic, parasitic, and saprobic guilds, including direct versus
indirect links and hyphal-continuity tests.

**Boundary:** the paper is a conceptual research agenda. It does not establish
that concurrent guild networks improve crop resource allocation or an AI
routing algorithm.

**Project consequence:** use guild, link-continuity, payload, and functional-
effect distinctions when designing fixtures; do not use the paper as evidence
for Candidate 013.

**Conceptual source supplied to the project:** M. C. Rillig et al.,
*Concurrent common fungal networks formed by different guilds of fungi*, New
Phytologist 246, 33–38 (2025),
[doi:10.1111/nph.20418](https://doi.org/10.1111/nph.20418).

## Mathematical translation

The auditable state is not a scalar `available resource`. For module $i$,
resource $k$, and time $t$, use the compartment vector and transition balance
defined in
[material-service-state.md](../../math/material-service-state.md). The minimum
required accounting properties are:

1. one conservation equation per resource type;
2. form-changing transitions separate from external gains and losses;
3. deliverable flux bounded by transport, receiver capacity, and demand;
4. service feasibility checked across the complete resource bundle;
5. an explicit service window;
6. stranded reservation and residual state reported by resource type; and
7. factorial interaction kept separate from mechanism classification.

For service class $j$, $\nu_{jk}$ is resource-$k$ units per service unit. The
joint feasibility constraint

$$
\sum_j\nu_{jk}q_{ij}(t)
\le U^{\mathrm{usable}}_{ik}(t)
\quad\text{for every required }k
$$

is an accounting bound, not a universal fixed-proportion production law.
Partial substitution, internal storage, transformation, and toxicity require
additional declared constraints.

## Mandatory null stack

Before a soil/crop-derived routing claim can survive, compare it with:

1. full factorial response surfaces and mixed-effects models;
2. scoped minimum, saturating, and interaction response functions;
3. dynamic marginal-return allocation;
4. mechanistic transport-plus-uptake models;
5. balanced-nutrient models such as QUEFTS where supported;
6. calibrated DSSAT or APSIM, with AquaCrop for the water-driven track;
7. multi-resource backpressure;
8. vector primal–dual shadow-price allocation;
9. bottleneck or dominant-resource allocation;
10. stochastic and receding-horizon optimization with frozen actions and
    critical windows; and
11. a learned router with identical observations, bytes, state, training
    events, and simulator access.

If this composition matches the candidate's complete service, loss, state,
energy, and second-event frontier, reject distinctiveness.

## Exact Candidate 013 refinement

Candidate 013 now treats scalar capability as the $K=1$ special case and adds:

1. vector local capability and deliverable-resource state;
2. service-class resource stoichiometry;
3. byte-matched vector deficit and scarcity context;
4. a joint local feasible set rather than independent binary gates;
5. resource form, transport, release, storage, expiry, and service windows;
6. limitation-form labels generated by factorial and sequential intervention;
7. stranded resource, loss, residual state, and endpoint service outcomes; and
8. soil/crop response confirmation plus a non-agricultural transfer domain.

The exact experiment descriptions, arms, equalization, outcomes, and kill
rules are in the candidate's
[workstation contract](../../experiments/candidates/013-deficit-capability-routing.md#workstation-contract).

## Audit-local claim decisions

### Established

- **SCL-E01:** factorial resource responses can represent several limitation
  forms; a positive interaction is not a unique mechanism.
- **SCL-E02:** multiple nutrients constrained ANPP in the tested standardized
  grassland experiments, with strong site and time variation.
- **SCL-E03:** in the tested maize and wheat systems, water and nitrogen effects
  interacted; water also changed nitrogen delivery or use.
- **SCL-E04:** total stock or solution concentration alone does not determine
  root delivery; texture, water, buffering, transport, and uptake matter.
- **SCL-E05:** localized root proliferation is resource-specific and does not
  necessarily increase capture or endpoint service.
- **SCL-E06:** resource timing and crop stage can change realized service in
  the tested deficit-irrigation regime. The same-total scheduling effect is a
  hypothesis to test, not a result assigned to this paper.
- **SCL-E07:** mechanistic uptake, balanced-nutrient, crop-system, stochastic,
  and predictive-control models are mature null families.

### Plausible but unproved

- **SCL-P01:** a typed resource-bundle contract should reduce phantom capacity
  and stranded commitments relative to a scalar availability state.
- **SCL-P02:** compressed vector context may be useful when the complete state
  is too costly or stale, resources are complementary, and local feasibility
  remains informative.
- **SCL-P03:** residual resource form and second-event service may reveal costs
  hidden by first-event yield or throughput.

### Speculative

- **SCL-S01:** the particular deficit-up/context-down/joint-gate composition
  beats mature vector controllers at equal lifecycle cost.
- **SCL-S02:** a useful regime learned from soil/crop fixtures transfers to a
  non-agricultural multi-resource service system.
- **SCL-S03:** concurrent fungal guild networks contribute a distinct routing
  mechanism useful to the project.

## Kill conditions

Reject the soil/crop refinement as a distinct systems contribution if any of
the following holds:

1. an ordinary typed ledger plus applicable mechanistic model removes the
   false-capacity advantage;
2. multi-resource backpressure, vector primal–dual control, or receding-horizon
   optimization matches the complete frontier;
3. improvement comes from extra state, messages, labels, inventory, water,
   reserve, or intervention authority;
4. the candidate counts total stock, concentration, root/capacity growth,
   uptake, or allocation as endpoint service;
5. the result disappears when transport and service windows are modeled;
6. average service improves by stranding one resource, increasing loss,
   worsening a protected stratum, or borrowing from the next event; or
7. the predicted useful regime does not reproduce in the non-agricultural
   confirmation domain.

## Audit decision

1. **Add no principle.** The evidence refines P-001/P-005/P-006/P-011 and the
   material-service evaluation contract.
2. **Adopt the vector state now.** A scalar availability field remains only a
   declared single-resource special case.
3. **Make soil physics a null, not a metaphor.** Stock, form, flux, uptake,
   internal quota, and service remain distinct.
4. **Make co-limitation a test label, not a slogan.** Factorial and sequential
   interventions determine the category.
5. **Give structural growth no proxy credit.** Measure delivered resource,
   endpoint service, and full lifecycle cost.
6. **Run synthetic falsifiers before external data.** WS-SCL-01 and WS-SCL-02
   expose category and routing failures before the more expensive fixtures.
7. **Use the public long-duration dataset only for what it observes.** It can
   confirm response typing across sites and years, not the routing mechanism.
8. **Require cross-domain transfer before promotion.** Otherwise merge the
   candidate into ordinary multi-resource allocation and control.

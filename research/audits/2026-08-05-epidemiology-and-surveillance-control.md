# Primary-source audit: epidemiology and surveillance control

**Audit date:** 2026-08-05

**Scope:** sparse and delayed surveillance, sentinel selection, sequential
outbreak detection, syndromic and wastewater signals, under-ascertainment,
contact structure, adaptive intervention, asymmetric alarm costs, and feedback
from interventions into observations

**Ledger state:** candidate evidence only; final claim numbers must be assigned
by the root integrator

**Purpose:** determine whether epidemiological surveillance contributes a
systems principle beyond selective allocation, uncertainty-priced sensing,
maintenance control, shared environmental state, and ordinary partially
observable control

## Executive conclusion

The literature does **not** support a free-standing principle that can be
summarized as “sample a few central sensors, detect a change, then intervene.”
Each part already has strong statistical, operations-research, network, and
control baselines. The more defensible cross-domain invariant is narrower:

> A surveillance controller must retain an explicit model of observation
> delay, coverage, ascertainment, and intervention provenance because its
> actions change both the hidden process and the process by which that hidden
> state becomes observable.

This is a useful systems requirement, but at the present abstraction it is a
partially observable Markov decision process (POMDP), state-estimation, and
dual-control problem—not a new biological principle. Epidemiology supplies
especially severe real-world tests of that problem:

- an outbreak exists before a report exists;
- the people or locations sampled are not interchangeable;
- an early proxy can be sensitive but nonspecific;
- the denominator may be absent or changing;
- a false alarm consumes finite investigation capacity;
- behavior, testing policy, and public-health action change subsequent data;
- retrospective “lead time” is easily inflated by final revised data or by
  choosing the eventual peak as the reference time.

The held candidate is therefore **intervention-aware surveillance under
endogenous observation**. It should remain an experiment candidate rather than
a registry principle unless it beats a delay-aware state-space estimator,
sequential likelihood detector, value-of-information sampler, maximum-coverage
placement, and POMDP/model-predictive controller at matched sensing,
investigation, actuation, and energy cost.

## Method and evidence boundary

This audit prioritizes primary methods papers, prospective field observations,
controlled intervention evidence, and authoritative evaluation guidance. The
evidence classes are kept separate:

| Evidence class | What it can establish | Representative records here |
| --- | --- | --- |
| cluster-randomized intervention | causal effect of the assigned intervention within the trial design | ring vaccination |
| prospective observational surveillance | temporal association under an operating data-collection process | friend-nominated sensors; operational syndromic feeds |
| probability-sample measurement | population prevalence under sampling, nonresponse, and assay assumptions | ENE-COVID serosurvey |
| retrospective comparative or model-based inference | compatibility of observations with a model; not randomized causality | 1918 city analyses; undocumented-infection estimates; digital traces |
| method simulation or replay | detector behavior under declared injected or historical conditions | CUSUM/EARS comparison; Farrington improvements |
| operations-research optimization | optimum for the declared objective and constraints | maximal geographic coverage |
| theoretical control/behavior model | consequences of assumptions; not empirical intervention effect | POMDP; adaptive behavior model |
| authoritative evaluation guidance | required measures and operational boundaries | CDC surveillance framework |

“Established” below means established for the scoped epidemiological method or
study population. It is never evidence that the analogous AI mechanism will
work. No paper supports a universal lead time, universal centrality target,
fixed under-ascertainment fraction, universal wastewater conversion factor, or
alarm threshold that transfers across pathogens, populations, platforms, and
reporting regimes.

## Terms that must not be collapsed

| Term | Operational meaning | Not equivalent to |
| --- | --- | --- |
| latent incidence | newly occurring events in the population per unit time, whether observed or not | reported cases |
| prevalence | fraction or count currently in a state at a defined time | incidence; test positivity |
| coverage | fraction of the target population, geography, network, or event stream reachable by the sampling design | ascertainment probability |
| ascertainment | probability that an event inside the covered population enters a given observation stream | assay sensitivity alone |
| reporting delay | distribution from event occurrence through collection, processing, and availability | detector latency after data arrival |
| syndromic signal | early, usually nonspecific proxy such as chief complaint or search behavior | confirmed infection |
| sentinel | selected sampling unit used to infer a wider process | a representative random sample by definition |
| pooled signal | aggregate material or activity from many contributors | attributable individual record |
| alarm | statistical or rule-based indication that investigation is warranted | confirmed outbreak; authorization for irreversible action |
| lead time | time between two explicitly named milestones | time before infection; time before the eventual peak without qualification |
| intervention effect | change caused by an assigned or otherwise identified action | association between action timing and later outcomes |
| surveillance policy | rule choosing what to sample, when to alert, and often what to investigate | the detector statistic alone |
| response policy | rule choosing an action from the current belief and resource state | proof that the inferred state is correct |

## Evidence synthesis

| Record | Evidence and design | Information path | Delay, coverage, and resource units | Evidence status | Initial disposition |
| --- | --- | --- | --- | --- | --- |
| EPI-01 | maximal-coverage placement of Iowa influenza sentinels | population centroid and distance threshold → selected facilities | persons within 20 miles; sites; recruitment capacity | established optimization result for its proxy objective | [P-001](../principle-registry.md#p-001--selective-allocation); strong OR null |
| EPI-02 | prospective 2009 Harvard friend-nomination cohort | network nomination → selected students → clinical/self-report stream | students sampled; days of fitted lead; visits and surveys | scoped prospective observational result | P-001 plus network-sampling baseline |
| EPI-03 | robust regression, scan statistics, and residual CUSUM | counts → expected baseline → likelihood/residual accumulation → investigation flag | cases/week or visits/day; false alarms/time; detector delay | established method families; simulation and operational evidence | [P-007](../principle-registry.md#p-007--prediction-error-allocation); change-detection null |
| EPI-04 | Bayesian occurred-but-not-yet-reported nowcasting | partial reports + delay distribution → posterior current counts | events/day; delay in days; interval coverage | established scoped method | state-estimation null; P-007 |
| EPI-05 | wastewater SARS-CoV-2 RNA tracking | catchment shedding → sewer transport/sample → extraction/qRT-PCR → aggregate signal | copies/mL or copies/L; people/catchment; samples/week; turnaround time | scoped observational association | pooled lossy [P-013](../principle-registry.md#p-013--externalized-shared-state) analogue |
| EPI-06 | search-query influenza nowcasting and later comparative reassessment | behavior + media + platform → query fraction → fitted ILI proxy | query fraction; regions; reporting lag; prediction error | useful scoped proxy; robust autonomous surveillance disputed | adversarial concept-drift case for P-007 |
| EPI-07 | nationwide Spanish probability-sample serosurvey | sampled household → assay → weighted population estimate | persons; households; prevalence fraction; assay/nonresponse uncertainty | established descriptive estimate for study wave | denominator/ascertainment calibration, not real-time detection |
| EPI-08 | Guinea immediate-versus-delayed ring-vaccination cluster trial | confirmed case → contact ring → randomized timing → vaccination → disease endpoint | people/ring; days; vaccine doses; cases | causal vaccine evidence within trial | targeted response under P-001; not proof of optimal surveillance |
| EPI-09 | retrospective 1918 city comparison and fitted transmission models | mortality records + intervention timing → association/model fit | deaths/100,000/week; days; city | retrospective and model-based, causality limited | intervention-feedback boundary |
| EPI-10 | adaptive epi-economic behavior model | perceived risk → contact choice → transmission → perceived risk | contacts/person/time; incidence; utility | theoretical | endogenous-observation/control null |

## EPI-01 — Sentinel placement is an explicit resource-allocation problem

### Geographic coverage

Polgreen et al. applied a maximal coverage model to 143 possible Iowa
influenza-sentinel locations. The existing 22 voluntary sites placed 56% of the
state population within 20 miles; the model achieved the same proxy coverage
with 10 sites, while 22 selected sites covered more than 75% and added nearly
600,000 residents to the covered population
([American Journal of Epidemiology 2009](https://doi.org/10.1093/aje/kwp270)).
This is a strong operations-research result for **geographic population within
a fixed radius**, not evidence that those sites improve outbreak sensitivity,
represent demographic or network heterogeneity, or measure the same pathogen
signal with equal quality.

For selected site set $S$, candidate locations $j$, population cells $i$, and
declared radius $r$, the proxy is

$$
C_r(S)=\frac{\sum_i N_i\,
\mathbf{1}\!\left[\min_{j\in S}d(i,j)\le r\right]}
{\sum_i N_i}.
$$

Here $N_i$ is people in cell $i$, $d(i,j)$ and $r$ share a distance unit such
as kilometres, and $C_r$ is dimensionless. Changing $r$, travel accessibility,
population resolution, participation probability, or the outcome of interest
changes the problem. The result therefore normalizes directly to
[`P-001`](../principle-registry.md#p-001--selective-allocation): choose scarce
sites under a declared utility and budget. Maximum coverage, facility location,
$k$-median, submodular sensor placement, and optimal experimental design are
the nulls to beat.

### Network-biased sentinels

Christakis and Fowler prospectively followed 744 Harvard students in a random
group and a group nominated as friends of randomly selected students. In that
single 2009 outbreak, the clinically diagnosed epidemic curve in the friend
group was fitted 13.9 days earlier (95% CI 9.9–16.6); a significant difference
was available on study day 16, 46 days before the estimated peak in health-
service visits
([PLOS ONE 2010](https://doi.org/10.1371/journal.pone.0012948)). The paper
explicitly states that lead depends on the outbreak, measurement, population,
sample size, and network topology. Friend nomination is a proxy for position in
an incompletely observed contact network; it is not a recovered transmission
path. The study was prospective but did not randomize populations to competing
surveillance policies, and presentation to a university health service remains
a selected observation.

Mossong et al. provide an important boundary. In a prospective diary study,
7,290 participants in eight European countries recorded 97,904 one-day
contacts; mixing was strongly age assortative and schoolchildren and young
adults had distinctive contact structure
([PLOS Medicine 2008](https://doi.org/10.1371/journal.pmed.0050074)). The data
were self-reported, children were deliberately oversampled, one day does not
measure stable personal centrality, and the authors did not claim the countries
formed a representative sample of Europe. Lloyd-Smith et al. likewise showed,
through statistical analysis of contact-tracing data and transmission models,
that individual infectiousness can be highly heterogeneous and that average
$R_0$ can hide very different emergence behavior
([Nature 2005](https://doi.org/10.1038/nature04153)). That finding is
model-supported heterogeneity, not a guarantee that one observable centrality
measure identifies the future high-impact nodes.

**Failure boundary.** A sentinel optimized for early arrival can be poor for
population prevalence, subgroup equity, severity, or pathogen attribution.
Network-aware selection also concentrates privacy risk and creates a known
target for evasion or manipulation. Any AI analogue must distinguish “high
probability of seeing a propagating fault early” from “representative estimate
of total fault burden.”

## EPI-02 — Sequential detection already has strong statistical nulls

Farrington et al. developed robust regression thresholds for weekly infection
reports, accounting for heterogeneous frequencies, trend, seasonality, and
outlying historical counts; exceedances were flags for investigation, not
machine-certified outbreaks
([JRSS A 1996](https://doi.org/10.2307/2983331)). Noufaily et al. later changed
trend, seasonality, reweighting, and error handling in this quasi-Poisson
family. Extensive simulations plus parallel runs on England and Wales isolate
data greatly reduced alarms while maintaining overall performance and in some
cases increasing sensitivity
([Statistics in Medicine 2013](https://doi.org/10.1002/sim.5595)).

Kulldorff et al.'s prospective space–time permutation scan uses case counts
without a population-at-risk denominator. It conditions on spatial and
temporal marginals, scans many candidate cylinders, and uses Monte Carlo
hypothesis testing to control the maximum statistic
([PLOS Medicine 2005](https://doi.org/10.1371/journal.pmed.0020059)). This is
valuable when denominators are missing, but the conditioning creates a precise
blind spot: a spatially diffuse system-wide increase that leaves relative
spatial allocation unchanged is not the target alternative. Promotions,
opening hours, changes in total emergency-department use, coding changes, and
day-of-week by location can hide or create clusters.

Wald's sequential probability-ratio test
([Annals of Mathematical Statistics 1945](https://doi.org/10.1214/aoms/1177731118))
and Page's CUSUM are foundational sequential nulls
([Biometrika 1954](https://doi.org/10.1093/biomet/41.1-2.100)). Fricker,
Hegler, and Dunfee compared EARS C1–C3 methods with CUSUM on model-based
prediction errors across background incidence, seasonality, day effects, and
noise regimes. The residual CUSUM was significantly better in every evaluated
scenario, leading the authors to recommend it over those EARS methods
([Statistics in Medicine 2008](https://doi.org/10.1002/sim.3197)). Therefore a
new “bio-inspired outbreak detector” must beat residual CUSUM, generalized
likelihood-ratio and scan tests, EWMA, Bayesian quickest detection, and
multiple-testing-aware variants—not only a rolling mean or fixed threshold.

For stream-specific observation $y_t$, predictive density $p_0$ under the
current baseline, and declared outbreak alternative $p_1$, one null is

$$
S_t=\max\left(0,S_{t-1}+\ell_t\right),
\qquad
\ell_t=\log\frac{p_1(y_t\mid y_{<t})}{p_0(y_t\mid y_{<t})}.
$$

$S_t$ and $\ell_t$ are dimensionless log-likelihood quantities. The alarm
threshold must be calibrated to a rate such as false alarms per 365 stream-days
or per analyst-week. A detector delay in samples is not comparable across a
daily clinical feed and an hourly pooled sensor until converted to time.

The CDC evaluation framework makes the operational boundary explicit: a
surveillance system includes data capture and processing, statistical
screening, epidemiological interpretation, investigation, and response. It
requires timeliness, sensitivity, predictive values, and costs to be assessed
together, and notes that both false alarms and delayed response are costly
([MMWR 2004](https://www.cdc.gov/mmwr/preview/mmwrhtml/rr5305a1.htm)). The
important systems unit is thus not merely false-positive probability. It is
also **alerts/day × analyst-hours/alert**, including the opportunity cost of
the true event that exhausted investigators fail to examine.

## EPI-03 — The newest data are systematically incomplete

An event occurring on day $t$ may appear in a report days later, and the delay
distribution can itself change during a response. Höhle and an der Heiden
developed a Bayesian occurred-but-not-yet-reported nowcast for hospitalizations
during Germany's 2011 STEC O104:H4 outbreak. Their retrospective scoring could
use the eventually completed count to assess real-time predictions; the work
also found that intervention measures changed reporting delays, motivating a
model with delay covariates
([Biometrics 2014](https://doi.org/10.1111/biom.12194)).

Let $x_t$ be latent incident events/day, $q_t^{(k)}$ the dimensionless
ascertainment probability for stream $k$, $c_t^{(k)}$ the dimensionless
coverage fraction, and $p_k(d\mid a_{0:t})$ the probability that a captured
event appears after exactly $d$ days under action history $a_{0:t}$. Then

$$
\mathbb{E}\!\left[y_t^{(k)}\right]
=\sum_{d=0}^{D_k}
x_{t-d}\,c_{t-d}^{(k)}q_{t-d}^{(k)}
p_k\!\left(d\mid a_{0:t}\right).
$$

Both $x_t$ and $y_t^{(k)}$ have events/day; the other factors are
dimensionless. This equation is deliberately schematic: overdispersion,
revisions, weekday effects, spatial coupling, and informative missingness must
be specified in an actual model. It nonetheless exposes a non-negotiable
identifiability boundary: a decrease in reports can reflect lower incidence,
lower coverage, lower ascertainment, a longer delay, or some combination.

Retrospective evaluation must reconstruct the exact data vintages available at
each decision time. Feeding a historical detector the final revised time
series leaks future reports backward and creates fictitious timeliness.

## EPI-04 — Wastewater is broad, pooled, lossy environmental state

Medema et al. sampled sewage from six Dutch cities and an airport with four
qRT-PCR assays. They detected no SARS-CoV-2 RNA on 6 February 2020; on 4–5
March they detected one or more fragments at three sites. At Amersfoort, one
assay detected RNA six days before the first reported cases, and measured RNA
rose with reported prevalence
([Environmental Science & Technology Letters 2020](https://doi.org/10.1021/acs.estlett.0c00357)).
Peccia et al. independently showed that SARS-CoV-2 RNA in New Haven primary
sludge tracked community infection dynamics
([Nature Biotechnology 2020](https://doi.org/10.1038/s41587-020-0684-z)).

These are observational associations between two imperfect streams. They do
not establish a universal six-day lead, a fixed conversion from copies/L to
infected people, or that wastewater precedes infection. The information path
includes fecal shedding, sewer participation, catchment mobility, travel time,
dilution and flow, sample frequency, recovery efficiency, inhibition, assay
target, laboratory turnaround, and data release. The clinical comparison path
has its own testing and reporting policy.

Wastewater resembles
[`P-013`](../principle-registry.md#p-013--externalized-shared-state) only at a
high level: many agents contribute to a persistent environmental signal that
others can read. Unlike a versioned digital log, it is physically integrated,
lossy, difficult to attribute, not globally addressed, and unevenly available
to people outside sewered catchments. Those differences are not incidental;
they determine privacy, resolution, robustness, and actionability.

An AI analogue is pooled fleet telemetry: it can reveal a regional or module-
class anomaly cheaply while hiding which instance is faulty. The null is
ordinary aggregated monitoring with a documented aggregation kernel. The
candidate must show when pooled sensing plus targeted follow-up is better than
uniform individual telemetry at equal bytes, energy, privacy exposure, and
time-to-isolation.

## EPI-05 — Fast behavioral proxies are policy- and platform-coupled

Ginsberg et al. fitted influenza-like illness (ILI) from regional search-query
fractions. The estimates had about a one-day publication lag and tracked the
CDC series used for model construction and validation
([Nature 2009](https://doi.org/10.1038/nature07634)). The authors explicitly
did not present the system as a replacement for clinical or laboratory
surveillance and warned that panic, concern, recalls, and unrelated query
surges could create exaggerated estimates or false alerts.

Olson et al. subsequently compared original and updated Google Flu Trends with
national, regional, and city-level ILI surveillance over ten influenza seasons,
including prospective operating periods and the 2009 pandemic
([PLOS Computational Biology 2013](https://doi.org/10.1371/journal.pcbi.1003256)).
The reassessment demonstrates why high retrospective correlation does not
establish a stable observation channel. Media coverage, user composition,
health-seeking behavior, search ranking and suggestion, platform model updates,
and changes in the clinical target all create concept drift. An adversary can
also generate queries much more cheaply than genuine infections.

This is a decisive warning for [`P-007`](../principle-registry.md#p-007--prediction-error-allocation):
large residuals in a behavioral proxy may indicate hazard, changing behavior,
measurement-policy drift, or manipulation. Prediction error, epistemic
uncertainty, novelty, and expected value of another measurement remain
different quantities. Ronald Howard's value-of-information formulation is the
strong decision baseline: acquire a confirmatory measurement only when its
expected improvement in the downstream decision exceeds its cost
([IEEE 1966](https://doi.org/10.1109/TSSC.1966.300074)).

## EPI-06 — Missing denominators require separate measurement

Pollán et al. selected 35,883 households from Spanish municipal rolls with a
two-stage stratified random design. In the first ENE-COVID wave, 61,075 people
received the point-of-care antibody test; estimates were weighted and
post-stratified, and two assays exposed a specificity–sensitivity range. About
one third of seropositive participants were asymptomatic, and only a minority
of symptomatic participants positive on both serologic tests reported a prior
PCR test
([The Lancet 2020](https://doi.org/10.1016/S0140-6736(20)31483-5)). This is
strong descriptive evidence that routine case streams did not enumerate all
infections in that wave. It is not real-time detection, and its estimates
remain conditioned on assay performance, timing/seroreversion, exclusions,
non-contact, and nonresponse.

Li et al. inferred undocumented SARS-CoV-2 infections from a metapopulation
transmission model fitted to multiple data sources in early China
([Science 2020](https://doi.org/10.1126/science.abb3221)). That work is useful
evidence that latent ascertainment can materially alter inferred spread, but
its numerical estimates are model- and period-dependent rather than directly
observed constants. The project must not reuse an undocumented fraction from
that study as a general prior.

For systems work, the analogue is silent or sampled failure: tickets, crash
reports, and visible errors observe only the users and components that reach a
reporting channel. A periodic probability sample, audit, or injected known-
truth cohort can estimate the missing denominator. It consumes resources and
may lag; it should not be silently merged with the operational alert stream.

## EPI-07 — Causal intervention evidence is rarer than surveillance association

The Guinea Ebola Ça Suffit! trial formed rings from contacts and contacts of
contacts around newly confirmed cases, then cluster-randomized eligible rings
to immediate or 21-day-delayed vaccination. In the randomized comparison, no
Ebola cases occurred at least ten days after randomization among vaccinated
contacts in immediate clusters, versus 16 cases in seven delayed clusters;
the reported vaccine-efficacy estimate was 100% with a wide 95% confidence
interval of 68.9–100.0
([The Lancet 2017](https://doi.org/10.1016/S0140-6736(16)32621-6)). This is
causal evidence for the assigned vaccine timing in that ring design. It does
not independently prove that contact tracing found every exposed person, that
the ring-selection policy was globally optimal, or that targeted intervention
always dominates population intervention.

The distinction matters because interventions feed back into surveillance.
Hatchett, Mecher, and Lipsitch retrospectively analyzed nonpharmaceutical
intervention timing and mortality in 17 U.S. cities during the 1918 pandemic.
Earlier layered interventions were associated with lower first-wave peak
mortality, while the relationship with cumulative mortality was smaller and no
single intervention was associated with improved aggregate outcomes
([PNAS 2007](https://doi.org/10.1073/pnas.0610941104)). Bootsma and Ferguson
fit transmission models to mortality and intervention histories in 16 cities;
their results required both organized measures and reactive behavior to
explain differing epidemic curves
([PNAS 2007](https://doi.org/10.1073/pnas.0611071104)). These are valuable
retrospective/model results, but cities did not randomize action timing.
Confounding by perceived severity, data quality, compliance, demographics,
and simultaneous actions prevents treating a fitted intervention coefficient
as a clean causal sensor–actuator transfer function.

Fenichel et al. make the feedback explicit in a theoretical epi-economic model:
individuals trade the benefit of contacts against infection risk, so perceived
risk changes contacts and therefore later transmission
([PNAS 2011](https://doi.org/10.1073/pnas.1011250108)). This model is not
empirical causal evidence, but it is a strong null against any architecture
that assumes the observation process is passive. In an AI service, throttling,
isolation, rollback, retraining, warning banners, and altered sampling can all
change both fault prevalence and telemetry volume.

## Closed-loop mathematical model and units

A minimal model must separate hidden state, sensing, and action:

$$
x_{t+1}=f(x_t,a_t,w_t),
$$

$$
y_{t+d_k}^{(k)}=
h_k\!\left(x_t,a_{0:t},c_t^{(k)},q_t^{(k)},\theta_t^{(k)}\right)
+v_t^{(k)}.
$$

Definitions:

- $x_t$: hidden state, such as incident cases/day, prevalence fraction, or
  faulty instances; one declared representation must be used per model;
- $a_t$: intervention and sensing action, such as tests/day, sites sampled,
  isolation fraction, or instances restarted;
- $w_t$: process disturbance in the same state-transition units;
- $y_t^{(k)}$: stream-$k$ observation, retaining its native unit—for example
  confirmed cases/day, visits/day, RNA copies/L, or dimensionless query
  fraction;
- $d_k$: collection and reporting delay in days, hours, or seconds;
- $c_t^{(k)}$: dimensionless population/catchment coverage;
- $q_t^{(k)}$: dimensionless ascertainment or detection probability;
- $\theta_t^{(k)}$: stream-specific calibration, platform, assay, and
  aggregation parameters;
- $v_t^{(k)}$: measurement error in the same unit as $y_t^{(k)}$.

Raw streams with different units must not be summed. They can update a shared
latent belief only through a declared likelihood or calibrated observation
model. The posterior belief is

$$
b_t(x)=p\!\left(x_t=x\mid y_{0:t}^{(1:K)},a_{0:t-1}\right),
$$

and the policy chooses both sensing and response actions. Kaelbling, Littman,
and Cassandra provide the standard POMDP reference
([Artificial Intelligence 1998](https://doi.org/10.1016/S0004-3702(98)00023-X)).
If an action has both immediate control value and information value, this is
also a dual-control or active-system-identification problem.

The objective must express asymmetric errors and resource exhaustion in one
declared utility, task-loss, or monetary unit:

$$
J(\pi)=\mathbb{E}_{\pi}\!\left[
\sum_t
L_{\mathrm{miss}}I_t^{\mathrm{miss}}
+L_{\mathrm{false}}I_t^{\mathrm{false}}
+L_{\mathrm{delay}}\Delta t_t
+C_{\mathrm{sample},t}
+C_{\mathrm{investigate},t}
+C_{\mathrm{action},t}
\right].
$$

$I_t^{\mathrm{miss}}$ and $I_t^{\mathrm{false}}$ are dimensionless indicators;
$\Delta t_t$ is time; therefore $L_{\mathrm{delay}}$ has loss/time, while all
other terms are converted to the same loss unit. A multiobjective frontier is
preferable when such conversion would conceal policy judgments. At minimum,
report:

- sensitivity at a fixed false-alarm ceiling;
- predictive value and calibration by prevalence regime;
- detection delay from a named latent-truth milestone and from data arrival;
- missed outbreaks or faults per evaluation period;
- alerts/day and analyst-minutes/alert;
- tests/day, samples/week, sites, covered persons, or covered instances;
- bytes/day, compute J/day, and action-attributable J/event for AI systems;
- collateral action cost and useful work lost;
- performance separately under each coverage, delay, and ascertainment shift.

## Failure boundaries and adversarial cases

1. **Uniform shifts under conditioned scans.** A space–time permutation test
   can miss a geographically diffuse rise that preserves the spatial marginal.
2. **Denominator drift.** Changes in care-seeking, total visits, test access,
   or platform participation change a rate even when the latent hazard does
   not.
3. **Right truncation.** The most recent periods look artificially safe because
   their reports have not arrived.
4. **Revision leakage.** Retrospective use of final counts gives the detector
   information unavailable at the original decision time.
5. **Alert exhaustion.** A sensitive detector can reduce total protection when
   false alarms consume the investigators needed for a later true event.
6. **Intervention-induced silence.** Isolation or throttling can reduce both
   propagation and reporting opportunity. Interpreting the lower signal as
   proof of eradication can cause premature release and rebound.
7. **Confounding by indication.** The worst locations receive the strongest
   actions; naive outcome comparison can make effective action look harmful.
8. **Behavioral feedback.** Warnings, publicity, fear, and reassurance change
   queries, visits, contacts, and compliance independently of latent infection.
9. **Platform manipulation.** Bots or coordinated actors can cheaply inflate
   search and social signals; model or ranking changes can create silent drift.
10. **Pooled-signal ambiguity.** Wastewater or fleet aggregates can detect a
    regional anomaly while remaining unable to attribute it to a person,
    host, module, or causal pathway.
11. **Catchment and equity gaps.** Nonsewered communities, people outside
    voluntary provider networks, or intermittently connected devices are not
    missing at random.
12. **Central-sensor evasion.** A pathogen, fault, or adversary can propagate
    through peripheral or newly rewired paths that yesterday's centrality
    ranking does not cover.
13. **Assay and calibration change.** Variant biology, sample inhibition,
    extraction yield, coding practice, and classifier updates alter $h_k$.
14. **Simpson aggregation.** A stable pooled total can hide opposing subgroup
    changes; a rising total can reflect changing mixture weights.
15. **Ethical impossibility of probing.** Deliberately increasing human hazard
    for system identification is not justified. Any AI analogue using active
    fault probes belongs first in simulation or an isolated shadow replica.

## Normalization against the registry and Candidate 003

| Existing item | Epidemiological overlap | What is not already owned |
| --- | --- | --- |
| [P-001](../principle-registry.md#p-001--selective-allocation) | select sites, people, tests, investigations, and interventions under budget | only the requirement that allocation changes the observation model and must be logged |
| [P-007](../principle-registry.md#p-007--prediction-error-allocation) | acquire another measurement where residual decision uncertainty justifies it | residual magnitude alone is unsafe when coverage, delay, or policy drifts |
| [P-009](../principle-registry.md#p-009--maintenance-plane) | slower surveillance and investigation process observes aggregate health and coordinates lifecycle actions | surveillance is not background-free; investigator capacity and reporting delay are explicit bottlenecks |
| [P-013](../principle-registry.md#p-013--externalized-shared-state) | wastewater and public behavioral traces are population-created environmental state | pooled state is lossy, weakly attributable, and governed by catchment physics rather than digital consistency |
| [Candidate 003](../../experiments/candidates/003-recovery-dynamics-fragility.md) | interventions or bounded probes may reveal dynamics not visible in passive marginals | routine surveillance is passive/endogenous; an intervention is an identification probe only when deliberately randomized or instrumented with a valid counterfactual |

Candidate 003 asks whether a safe bounded perturbation and its recovery curve
reveal hidden fragility better than passive monitoring and standard active
system identification. Epidemiological case reports, wastewater, queries, and
chief complaints mostly observe naturally generated signals; they do not
estimate recovery from a known excitation. A live public-health intervention
also cannot be relabeled a probe after the fact: action was selected from
perceived risk, affects many mechanisms, and usually lacks a randomized
counterfactual. In an AI system, only a predeclared safe action on a simulation,
canary, or shadow replica should count as the Candidate-003 mechanism.

The distinct held candidate is instead:

> **Intervention-aware surveillance under endogenous observation:** maintain
> joint provenance for sensing and response policy, estimate a delayed hidden
> state with changing coverage/ascertainment, and prevent action-induced
> telemetry changes from being misread as independent evidence of recovery.

At present this is a composition of P-001, P-007, P-009, and P-013 under a
POMDP/dual-control null. Preserve it as a candidate experiment, not a new
`P-` entry.

## Strongest null models

### Statistical decision nulls

- Bayesian decision theory with asymmetric loss and explicit value of sample
  information;
- Neyman–Pearson or constrained-risk rules at a fixed false-alarm or missed-
  event budget;
- calibrated abstention and confirmatory testing;
- hierarchical Bayes/state-space models that estimate observation-channel
  drift rather than interpreting every residual as latent-state change.

### Change-detection nulls

- Page CUSUM and likelihood-ratio CUSUM on model residuals;
- sequential probability-ratio and generalized likelihood-ratio tests;
- EWMA, Page–Hinkley, Shiryaev–Roberts, and Bayesian quickest detection;
- spatial and space–time scan statistics with multiple-testing calibration;
- robust quasi-Poisson Farrington-style surveillance;
- occurred-but-not-yet-reported nowcasting before detection on recent counts.

Fricker et al.'s result makes residual CUSUM the minimum serious comparator;
Noufaily et al. make robust trend, seasonality, baseline, and dispersion
handling a minimum requirement.

### Operations-research nulls

- maximal coverage, facility location, $k$-median, and set cover;
- submodular sensor placement and optimal experimental design;
- constrained bandits and adaptive sampling;
- queueing/staffing models for finite investigation and laboratory capacity;
- contact-network acquaintance sampling, centrality targeting, contact tracing,
  and percolation-based intervention.

### Control nulls

- hidden Markov/state-space filtering with delay and right truncation;
- POMDP belief-state control and model-predictive control;
- dual control or active system identification when actions are deliberately
  informative;
- robust control under observation-model uncertainty;
- ordinary fleet telemetry, canaries, anomaly detection, SLOs, and rollback in
  the AI/system translation.

## Decisive AI/system experiment

### Proposed benchmark: SCOPE

Build **Surveillance under Changing Observation, Policy, and Environment
(SCOPE)** as a synthetic and then shadow-service benchmark. A propagating fault
moves over a dynamic modular graph while no detector receives the hidden fault
labels online.

Each episode exposes four sensor classes:

1. delayed high-specificity instance diagnoses;
2. early low-specificity syndromic residuals;
3. pooled regional telemetry without instance attribution;
4. behavioral/demand telemetry coupled to warnings and service policy.

Independently vary:

- sensor coverage from 20% to 100% of instances;
- ascertainment from 0.2 to 0.95;
- report-delay distributions from seconds to hours with a mid-episode shift;
- graph assortativity, degree dispersion, and rewiring;
- fault propagation rate and local severity;
- investigator budget in analyst-minutes/hour;
- asymmetric false-action and missed-fault costs;
- user/adversary manipulation of behavioral signals;
- action effects on both propagation and telemetry volume.

Compare uniform, maximum-coverage, neighbor-nominated, and value-of-information
sampling. Every detector must compete with residual CUSUM/GLR, robust seasonal
count models, scan statistics, and delay-aware state-space nowcasting. Every
response policy must compete with a tuned POMDP/model-predictive controller.
If active excitation is included, Candidate 003's standard system-
identification baseline receives the identical safe shadow probe.

### Required provenance ablation

The held candidate stores, per decision:

- data vintage and collection window;
- sensor inclusion/catchment and missingness;
- observation-model version;
- alert and confirmatory-test policy;
- action, target, time, intensity, and expected observation effect;
- rollback/release rule.

Ablate only this action-and-observation provenance while holding model capacity
constant. The candidate must then predict both latent fault state and the
counterfactual no-action observation path. A gain only in fitting observed
telemetry after acting is insufficient.

### Outcomes

- hidden-state calibration and log score by coverage/delay regime;
- detection lead in seconds from actual fault propagation, not final report;
- true and false alerts per 1,000 instance-hours;
- analyst-minutes per true detection;
- faulted requests prevented and healthy requests disrupted;
- bytes and joules per instance-hour for sensing and control;
- time to correct attribution after a pooled alarm;
- counterfactual action-effect error on randomized shadow episodes;
- subgroup miss rate under structured coverage gaps;
- recovery/rebound error after action release.

### Preregistered rejection criteria

Reject a distinct candidate if any of the following holds:

1. a delay-aware POMDP or model-predictive controller matches the quality–cost
   frontier within uncertainty;
2. passive residual CUSUM/GLR plus nowcasting matches detection at equal false
   alerts and analyst time;
3. a maximum-coverage or value-of-information sampler matches the proposed
   placement policy at equal sample cost;
4. gains disappear when evaluated on true data vintages rather than final
   revised histories;
5. the controller interprets its own telemetry suppression as recovery and
   releases action prematurely;
6. performance collapses under a change in coverage, ascertainment, graph
   structure, or proxy behavior not seen in training;
7. pooled or central sensors systematically miss declared subgroups, and the
   gap is hidden by aggregate utility;
8. an adversary can trigger high-cost action by manipulating the cheap proxy
   while direct evidence remains unchanged;
9. provenance improves auditability but not state estimation, decisions, or
   calibrated uncertainty—in that case retain it as good systems engineering,
   not algorithmic novelty;
10. an active-probe version cannot beat standard active system identification
    under Candidate 003's equal-probe and safety rules.

## Proposed claim-ledger entries

These labels are local to this audit. The root integrator should deduplicate
them and assign final `C-` numbers.

| Proposed label | Proposed claim | Status | Evidence boundary | Likely destination |
| --- | --- | --- | --- | --- |
| EPI-C1 | In the Iowa maximal-coverage model, 10 optimized candidate sites achieved the same 20-mile population-coverage proxy as 22 existing voluntary sentinels; 22 optimized sites covered more than 75%. | `established` | model optimum for geographic proxy, not observed outbreak detection | P-001 evidence/null |
| EPI-C2 | In one prospective Harvard 2009 outbreak cohort, friend-nominated students exhibited an earlier fitted clinical epidemic curve than the random group. | `established` | scoped observational result; lead is network-, pathogen-, sample-, and care-seeking-dependent | P-001 evidence |
| EPI-C3 | Robust residual sequential methods are mandatory baselines: a model-residual CUSUM outperformed EARS C1–C3 across all scenarios evaluated by Fricker et al. | `established` | simulation scenarios, not every disease stream | P-007 null |
| EPI-C4 | A space–time permutation scan can operate without population-at-risk denominators by conditioning on marginals, but this target can miss spatially diffuse proportional increases and remains sensitive to capture-process changes. | `established` | mathematical method property plus scoped operational evaluation | P-007 boundary |
| EPI-C5 | Real-time counts are right-truncated by reporting delay, and the delay distribution can change during response; nowcasting must precede interpretation of recent trends. | `established` | demonstrated in the 2011 German STEC nowcasting study; implementation-specific | P-007/P-009 evidence |
| EPI-C6 | SARS-CoV-2 RNA in wastewater preceded the first reported cases at one Dutch site and tracked reported prevalence across the studied early epidemic, but no universal lead or infections-per-copy conversion follows. | `established` | scoped observational association; assay, shedding, flow, catchment, and clinical reporting confound transfer | P-013 evidence/boundary |
| EPI-C7 | Search-query fractions can nowcast a clinical ILI series in a scoped operating period, but platform, media, and behavioral drift prevent treating the proxy as a stable autonomous measurement channel. | `disputed` | initial fit and later comparative reassessment; not a claim that digital traces have no value | P-007 adversarial case |
| EPI-C8 | Probability-sample serosurveillance can reveal infections absent from routine case reports, while assay, timing, and nonresponse uncertainty remain explicit. | `established` | first ENE-COVID wave and noninstitutionalized sampling frame | under-ascertainment evidence |
| EPI-C9 | The Guinea ring-vaccination trial provides cluster-randomized evidence for immediate versus delayed rVSV-ZEBOV vaccination among traced rings, not for the global optimality of the tracing or targeting policy. | `established` | open-label outbreak trial with scoped eligibility and changing epidemic context | P-001 intervention evidence |
| EPI-C10 | Interventions and adaptive behavior change both epidemic state and later observations, so observational before/after curves do not identify a controller without an action-conditioned observation model or valid counterfactual. | `plausible` | theoretical feedback plus retrospective city analyses; general systems translation remains untested | held intervention-aware candidate |
| EPI-C11 | A closed surveillance–intervention architecture that records sensing/action provenance and jointly estimates state and observation drift may improve AI fault control under policy-coupled telemetry. | `speculative` | no direct AI experiment yet; may reduce fully to POMDP/dual control | new experiment candidate only |

## Proposed BibTeX entries

```bibtex
@article{polgreen2009optimizing,
  author  = {Polgreen, Philip M. and Chen, Zunqui and Segre, Alberto M. and Harris, Meghan L. and Pentella, Michael A. and Rushton, Gerard},
  title   = {Optimizing Influenza Sentinel Surveillance at the State Level},
  journal = {American Journal of Epidemiology},
  year    = {2009},
  volume  = {170},
  number  = {10},
  pages   = {1300--1306},
  doi     = {10.1093/aje/kwp270},
  url     = {https://doi.org/10.1093/aje/kwp270}
}

@article{christakis2010sensors,
  author  = {Christakis, Nicholas A. and Fowler, James H.},
  title   = {Social Network Sensors for Early Detection of Contagious Outbreaks},
  journal = {PLOS ONE},
  year    = {2010},
  volume  = {5},
  number  = {9},
  pages   = {e12948},
  doi     = {10.1371/journal.pone.0012948},
  url     = {https://doi.org/10.1371/journal.pone.0012948}
}

@article{mossong2008contacts,
  author  = {Mossong, Jo{ë}l and Hens, Niel and Jit, Mark and Beutels, Philippe and Auranen, Kari and Mikolajczyk, Rafael and Massari, Marco and Salmaso, Stefania and Scalia Tomba, Gianpaolo and Wallinga, Jacco and Heijne, Janneke and Sadkowska-Todys, Malgorzata and Rosinska, Magdalena and Edmunds, W. John},
  title   = {Social Contacts and Mixing Patterns Relevant to the Spread of Infectious Diseases},
  journal = {PLOS Medicine},
  year    = {2008},
  volume  = {5},
  number  = {3},
  pages   = {e74},
  doi     = {10.1371/journal.pmed.0050074},
  url     = {https://doi.org/10.1371/journal.pmed.0050074}
}

@article{lloydsmith2005superspreading,
  author  = {Lloyd-Smith, James O. and Schreiber, Sebastian J. and Kopp, P. Ekkehard and Getz, Wayne M.},
  title   = {Superspreading and the Effect of Individual Variation on Disease Emergence},
  journal = {Nature},
  year    = {2005},
  volume  = {438},
  pages   = {355--359},
  doi     = {10.1038/nature04153},
  url     = {https://doi.org/10.1038/nature04153}
}

@article{farrington1996algorithm,
  author  = {Farrington, C. P. and Andrews, N. J. and Beale, A. D. and Catchpole, M. A.},
  title   = {A Statistical Algorithm for the Early Detection of Outbreaks of Infectious Disease},
  journal = {Journal of the Royal Statistical Society: Series A (Statistics in Society)},
  year    = {1996},
  volume  = {159},
  number  = {3},
  pages   = {547--563},
  doi     = {10.2307/2983331},
  url     = {https://doi.org/10.2307/2983331}
}

@article{kulldorff2005spacetime,
  author  = {Kulldorff, Martin and Heffernan, Richard and Hartman, Jessica and Assun{ç}{\~a}o, Renato and Mostashari, Farzad},
  title   = {A Space--Time Permutation Scan Statistic for Disease Outbreak Detection},
  journal = {PLOS Medicine},
  year    = {2005},
  volume  = {2},
  number  = {3},
  pages   = {e59},
  doi     = {10.1371/journal.pmed.0020059},
  url     = {https://doi.org/10.1371/journal.pmed.0020059}
}

@article{noufaily2013improved,
  author  = {Noufaily, Angela and Enki, Doyo G. and Farrington, Paddy and Garthwaite, Paul and Andrews, Nick and Charlett, Andr{\'e}},
  title   = {An Improved Algorithm for Outbreak Detection in Multiple Surveillance Systems},
  journal = {Statistics in Medicine},
  year    = {2013},
  volume  = {32},
  number  = {7},
  pages   = {1206--1222},
  doi     = {10.1002/sim.5595},
  url     = {https://doi.org/10.1002/sim.5595}
}

@article{fricker2008ears,
  author  = {Fricker, Ronald D., Jr. and Hegler, Benjamin L. and Dunfee, David A.},
  title   = {Comparing Syndromic Surveillance Detection Methods: {EARS'} versus a {CUSUM}-Based Methodology},
  journal = {Statistics in Medicine},
  year    = {2008},
  volume  = {27},
  number  = {17},
  pages   = {3407--3429},
  doi     = {10.1002/sim.3197},
  url     = {https://doi.org/10.1002/sim.3197}
}

@article{page1954inspection,
  author  = {Page, E. S.},
  title   = {Continuous Inspection Schemes},
  journal = {Biometrika},
  year    = {1954},
  volume  = {41},
  number  = {1--2},
  pages   = {100--115},
  doi     = {10.1093/biomet/41.1-2.100},
  url     = {https://doi.org/10.1093/biomet/41.1-2.100}
}

@article{wald1945sequential,
  author  = {Wald, Abraham},
  title   = {Sequential Tests of Statistical Hypotheses},
  journal = {The Annals of Mathematical Statistics},
  year    = {1945},
  volume  = {16},
  number  = {2},
  pages   = {117--186},
  doi     = {10.1214/aoms/1177731118},
  url     = {https://doi.org/10.1214/aoms/1177731118}
}

@techreport{buehler2004framework,
  author      = {Buehler, James W. and Hopkins, Richard S. and Overhage, J. Marc and Sosin, Daniel M. and Tong, Van},
  title       = {Framework for Evaluating Public Health Surveillance Systems for Early Detection of Outbreaks: Recommendations from the {CDC} Working Group},
  institution = {Centers for Disease Control and Prevention},
  series      = {MMWR Recommendations and Reports},
  year        = {2004},
  volume      = {53},
  number      = {RR-5},
  pages       = {1--11},
  url         = {https://www.cdc.gov/mmwr/preview/mmwrhtml/rr5305a1.htm}
}

@article{hoehle2014nowcasting,
  author  = {H{\"o}hle, Michael and an der Heiden, Matthias},
  title   = {Bayesian Nowcasting during the {STEC O104:H4} Outbreak in Germany, 2011},
  journal = {Biometrics},
  year    = {2014},
  volume  = {70},
  number  = {4},
  pages   = {993--1002},
  doi     = {10.1111/biom.12194},
  url     = {https://doi.org/10.1111/biom.12194}
}

@article{medema2020sewage,
  author  = {Medema, Gertjan and Heijnen, Leo and Elsinga, Goffe and Italiaander, Ronald and Brouwer, Anke},
  title   = {Presence of {SARS-Coronavirus-2} {RNA} in Sewage and Correlation with Reported {COVID-19} Prevalence in the Early Stage of the Epidemic in the Netherlands},
  journal = {Environmental Science \& Technology Letters},
  year    = {2020},
  volume  = {7},
  number  = {7},
  pages   = {511--516},
  doi     = {10.1021/acs.estlett.0c00357},
  url     = {https://doi.org/10.1021/acs.estlett.0c00357}
}

@article{peccia2020wastewater,
  author  = {Peccia, Jordan and Zulli, Alessandro and Brackney, Doug E. and Grubaugh, Nathan D. and Kaplan, Edward H. and Casanovas-Massana, Arnau and Ko, Albert I. and Malik, Amyn A. and Wang, Dennis and Wang, Mike and Warren, Joshua L. and Weinberger, Daniel M. and Arnold, Walter and Omer, Saad B.},
  title   = {Measurement of {SARS-CoV-2 RNA} in Wastewater Tracks Community Infection Dynamics},
  journal = {Nature Biotechnology},
  year    = {2020},
  volume  = {38},
  number  = {10},
  pages   = {1164--1167},
  doi     = {10.1038/s41587-020-0684-z},
  url     = {https://doi.org/10.1038/s41587-020-0684-z}
}

@article{ginsberg2009queries,
  author  = {Ginsberg, Jeremy and Mohebbi, Matthew H. and Patel, Rajan S. and Brammer, Lynnette and Smolinski, Mark S. and Brilliant, Larry},
  title   = {Detecting Influenza Epidemics Using Search Engine Query Data},
  journal = {Nature},
  year    = {2009},
  volume  = {457},
  number  = {7232},
  pages   = {1012--1014},
  doi     = {10.1038/nature07634},
  url     = {https://doi.org/10.1038/nature07634}
}

@article{olson2013reassessing,
  author  = {Olson, Donald R. and Konty, Kevin J. and Paladini, Marc and Viboud, C{\'e}cile and Simonsen, Lone},
  title   = {Reassessing {Google Flu Trends} Data for Detection of Seasonal and Pandemic Influenza: A Comparative Epidemiological Study at Three Geographic Scales},
  journal = {PLOS Computational Biology},
  year    = {2013},
  volume  = {9},
  number  = {10},
  pages   = {e1003256},
  doi     = {10.1371/journal.pcbi.1003256},
  url     = {https://doi.org/10.1371/journal.pcbi.1003256}
}

@article{pollan2020seroprevalence,
  author  = {Poll{\'a}n, Marina and P{\'e}rez-G{\'o}mez, Beatriz and Pastor-Barriuso, Roberto and Oteo, Jes{\'u}s and Hern{\'a}n, Miguel A. and P{\'e}rez-Olmeda, Mayte and Sanmart{\'i}n, Jose L. and Fern{\'a}ndez-Garc{\'i}a, Aurora and Cruz, Israel and Fern{\'a}ndez de Larrea, Nerea and Molina, Marta and Rodr{\'i}guez-Cabrera, Francisco and Mart{\'i}n, Mariano and Merino-Amador, Paloma and Le{\'o}n Paniagua, Jose and Mu{\~n}oz-Montalvo, Juan F. and Blanco, Faustino and Yotti, Raquel and {ENE-COVID Study Group}},
  title   = {Prevalence of {SARS-CoV-2} in Spain ({ENE-COVID}): A Nationwide, Population-Based Seroepidemiological Study},
  journal = {The Lancet},
  year    = {2020},
  volume  = {396},
  number  = {10250},
  pages   = {535--544},
  doi     = {10.1016/S0140-6736(20)31483-5},
  url     = {https://doi.org/10.1016/S0140-6736(20)31483-5}
}

@article{li2020undocumented,
  author  = {Li, Ruiyun and Pei, Sen and Chen, Bin and Song, Yimeng and Zhang, Tao and Yang, Wan and Shaman, Jeffrey},
  title   = {Substantial Undocumented Infection Facilitates the Rapid Dissemination of Novel Coronavirus ({SARS-CoV-2})},
  journal = {Science},
  year    = {2020},
  volume  = {368},
  number  = {6490},
  pages   = {489--493},
  doi     = {10.1126/science.abb3221},
  url     = {https://doi.org/10.1126/science.abb3221}
}

@article{henaorestrepo2017ebola,
  author  = {Henao-Restrepo, Ana Maria and Camacho, Anton and Longini, Ira M. and Watson, Conall H. and Edmunds, W. John and Egger, Matthias and Carroll, Miles W. and Dean, Natalie E. and Diatta, Ibrahima and Doumbia, Moussa and Draguez, Bertrand and Duraffour, Sophie and Enwere, Godwin and Grais, Rebecca and G{\"u}nther, Stephan and Gsell, Pierre-St{\'e}phane and Hossmann, Stefanie and Watle, Sara Viksmoen and Kond{\'e}, Mandy Kader and K{\'e}{\"i}ta, Sakoba and Kone, Souleymane and Kuisma, Eewa and Levine, Myron M. and Mandal, Sema and Mauget, Thomas and Norheim, Gunnstein and Riveros, Ximena and Soumah, Aboubacar and Trelle, Sven and Vicari, Andrea S. and R{\o}ttingen, John-Arne and Kieny, Marie-Paule},
  title   = {Efficacy and Effectiveness of an {rVSV}-Vectored Vaccine in Preventing {Ebola} Virus Disease: Final Results from the {Guinea} Ring Vaccination, Open-Label, Cluster-Randomised Trial ({Ebola {\c{C}}a Suffit!})},
  journal = {The Lancet},
  year    = {2017},
  volume  = {389},
  number  = {10068},
  pages   = {505--518},
  doi     = {10.1016/S0140-6736(16)32621-6},
  url     = {https://doi.org/10.1016/S0140-6736(16)32621-6}
}

@article{hatchett2007interventions,
  author  = {Hatchett, Richard J. and Mecher, Carter E. and Lipsitch, Marc},
  title   = {Public Health Interventions and Epidemic Intensity during the 1918 Influenza Pandemic},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2007},
  volume  = {104},
  number  = {18},
  pages   = {7582--7587},
  doi     = {10.1073/pnas.0610941104},
  url     = {https://doi.org/10.1073/pnas.0610941104}
}

@article{bootsma2007measures,
  author  = {Bootsma, Martin C. J. and Ferguson, Neil M.},
  title   = {The Effect of Public Health Measures on the 1918 Influenza Pandemic in {U.S.} Cities},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2007},
  volume  = {104},
  number  = {18},
  pages   = {7588--7593},
  doi     = {10.1073/pnas.0611071104},
  url     = {https://doi.org/10.1073/pnas.0611071104}
}

@article{fenichel2011behavior,
  author  = {Fenichel, Eli P. and Castillo-Chavez, Carlos and Ceddia, M. G. and Chowell, Gerardo and Gonzalez Parra, Paula A. and Hickling, Graham J. and Holloway, Garth and Horan, Richard and Morin, Benjamin and Perrings, Charles and Springborn, Michael and Velazquez, Leticia and Villalobos, Cristina},
  title   = {Adaptive Human Behavior in Epidemiological Models},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2011},
  volume  = {108},
  number  = {15},
  pages   = {6306--6311},
  doi     = {10.1073/pnas.1011250108},
  url     = {https://doi.org/10.1073/pnas.1011250108}
}

@article{howard1966informationvalue,
  author  = {Howard, Ronald A.},
  title   = {Information Value Theory},
  journal = {IEEE Transactions on Systems Science and Cybernetics},
  year    = {1966},
  volume  = {2},
  number  = {1},
  pages   = {22--26},
  doi     = {10.1109/TSSC.1966.300074},
  url     = {https://doi.org/10.1109/TSSC.1966.300074}
}

@article{kaelbling1998pomdp,
  author  = {Kaelbling, Leslie Pack and Littman, Michael L. and Cassandra, Anthony R.},
  title   = {Planning and Acting in Partially Observable Stochastic Domains},
  journal = {Artificial Intelligence},
  year    = {1998},
  volume  = {101},
  number  = {1--2},
  pages   = {99--134},
  doi     = {10.1016/S0004-3702(98)00023-X},
  url     = {https://doi.org/10.1016/S0004-3702(98)00023-X}
}
```

## Integration recommendation

1. Add EPI-C1 through EPI-C9 only after deduplicating them against existing
   allocation, prediction-error, shared-state, and evidence-boundary claims.
2. Keep EPI-C10 as a scoped rationale for an action-conditioned observation
   model; do not promote the retrospective 1918 effect sizes as constants.
3. Route EPI-C11 to a candidate experiment derived from SCOPE. It is explicitly
   rejected as distinct novelty if standard POMDP/dual-control and sequential-
   detection baselines match it.
4. Keep wastewater, search, serology, case reports, and syndromic streams in
   native units. Fusion belongs in a likelihood model with data-vintage and
   policy provenance.
5. Treat every alarm as a request for a costed next decision, not as a diagnosis
   and not as permission for irreversible action.

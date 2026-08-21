# Particle, nuclear, and high-energy experimentation

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-21
- **Taxonomy target:** DFG Fachkollegium **3.24 — Teilchen, Kerne und Felder** and particle/nuclear depth within OECD FORD 1.3 Physical sciences
- **Scope:** detector response and calibration; online trigger and irreversible event selection; inverse unfolding; nuisance and systematic uncertainty; signal/control regions; rare-event search, trials, and blinding; simulation mismatch; analysis preservation and open data; symmetry, effective theories, and regime boundaries
- **Evidence rule:** a detector output is conditional on an apparatus and reconstruction; simulation is a model, not truth; a control region constrains a signal-region prediction only through a declared transfer model; a local excess is not a global false-positive probability; rerunning an artifact is not independent replication
- **Promotion state:** no new principle and no new candidate; eight CPU-only synthetic falsification tracks refine Candidates 009, 010, 013, 014, 017, and 018
- **Safety boundary:** the workstation package contains no radioactive material, ionising-radiation source, accelerator, medical exposure, or human data

## Executive finding

Particle and nuclear experimentation contributes a particularly demanding
ordinary null for the project's proposed observation and assurance machinery.
Large experiments already make irreversible, resource-limited decisions before
the eventual scientific question is known; infer latent distributions through
versioned detector responses; couple signal and control samples through shared
nuisance parameters; search many correlated hypotheses; and preserve enough of
the statistical and computational model for later reinterpretation.

The durable residue is an **end-to-end selection–response–inference contract**:

1. every retained event or summary carries the trigger menu, thresholds,
   prescales, dead time, conditions, and inclusion support that produced it;
2. every reconstructed quantity carries the calibration and response model,
   applicable time and regime, uncertainty components, and correlations;
3. every inverse result exposes response-matrix version, efficiency, background,
   regularization or prior, closure tests, alternative responses, and
   non-identifiable directions;
4. every rare-event statement names the searched family, local and global test,
   nuisance model, stopping and tuning history, blinded access history, and
   control-to-signal transfer assumptions;
5. every simulation-derived result remains conditional on generator, physics
   list, detector geometry, conditions, reconstruction, and data/simulation
   validation; and
6. every preservation claim names which data level, likelihood, workflow,
   environment, credentials, and external services are actually recoverable.

None of these items is a new AI principle. They are a severe composite test of
selective allocation, temporary trace, prediction-error allocation,
maintenance, structural offloading, memory lifetime, externalized state, and
the repository's existing candidate contracts. Promotion is justified only if
the project composition prevents invalid downstream claims or improves a
quality–resource frontier beyond the full field-standard null stack.

## Taxonomy correction and conservative classification

The task prompt named “DFG 3.21 Teilchen, Kerne und Felder.” In the current DFG
Fachkollegien system for 2024–2028, **3.21 is Physik der kondensierten Materie**
and **3.24 is Teilchen, Kerne und Felder**. The official 3.24 page lists
“Kern- und Elementarteilchenphysik, Quantenmechanik, Relativitätstheorie,
Felder” as 3.24-01
([DFG 3.24](https://www.dfg.de/de/ueber-uns/gremien/fachkollegien/fachsystematik/naturwissenschaften-3-24)).
The repository's field census already uses 3.24 correctly.

**Classification recommendation:**

- **DFG 3.24 — dedicated, bounded coverage.** This audit is centered on the
  field's experimental inference stack and includes a scoped theory/regime
  section. It does not claim comprehensive coverage of nuclear structure,
  lattice field theory, accelerator engineering, neutrino phenomenology,
  gravitation, or every detector technology.
- **OECD FORD 1.3 Physical sciences — remains dedicated; depth improved.** The
  OECD category already receives dedicated evidence from optics, astronomy,
  fluid/plasma, soft-matter, thermodynamics, and metrology audits. This audit
  closes the explicit particle/nuclear experimentation blind spot; it does not
  make every physical-science subfield complete.

## Terminology firewall

The following distinctions are binding for this audit.

1. A **collision, decay, or simulated event** is not the same object as a
   trigger record, reconstructed event, selected analysis event, histogram bin,
   or likelihood term.
2. **Acceptance** is geometric and kinematic eligibility under a declared
   process and object definition. **Efficiency** is a conditional retention or
   reconstruction probability. Neither is a universal property of an event.
3. A **trigger** is an online selection system under latency, compute, bandwidth,
   and storage constraints. It is not an epistemically neutral accelerator.
4. A **prescale** deliberately retains only a known fraction of eligible events.
   A retained sample is interpretable only if the prescale and its validity
   interval are known.
5. **Zero-bias** or minimum-bias streams are monitoring/reference paths with
   their own definitions and budgets. They are not complete truth streams.
6. **Calibration** establishes a scoped relation between indication and a
   reference or in-situ constraint. **Simulation correction** is not calibration
   by itself, and agreement with one reference process is not validation in all
   regimes.
7. A **response matrix** maps truth-level bins or states to reconstructed bins,
   including inefficiency. Its inverse need not exist and, when it exists
   numerically, may be unstable.
8. **Unfolding** estimates a latent distribution from reconstructed observations
   using a response, background model, and regularization or prior. It does not
   recover model-free truth.
9. **Forward folding** compares a latent-model prediction after the declared
   response with observations. It avoids an explicit inverse but does not remove
   response misspecification.
10. A **nuisance parameter** represents uncertainty or variation not designated
    as the parameter of interest. Profiling or marginalizing it does not prove
    that the nuisance family is complete.
11. A **constraint term** in a likelihood may encode an auxiliary measurement,
    calibration, or prior model. It is not automatically independent evidence.
12. A **control region** is selected to constrain a background or nuisance
    model. Transfer to a signal region depends on a declared relation and may be
    biased by contamination, covariate shift, or common modeling error.
13. A **signal region** is a prespecified or disclosed region used for the target
    test. It is not known to contain signal merely because it has that name.
14. A **local p-value** tests an excess at one specified hypothesis point. A
    **global p-value** includes the declared search over points, windows,
    channels, or models. Neither is the probability that a theory is true.
15. **Blinding** limits selected access during construction. It does not repair
    detector bias, invalid likelihoods, incomplete alternatives, or changes made
    after unblinding.
16. **Reproducibility/rerun** means a specified computational result can be
    regenerated under declared artifacts and conditions. **Replication** adds
    materially independent data, apparatus, analysis, or investigators.
17. **Symmetry** restricts admissible transformations or relations. Approximate
    and broken symmetries have a domain and error; imposing an invalid exact
    symmetry can hide a discovery target.
18. An **effective theory** is a scale-qualified description with explicit
    degrees of freedom, expansion/order, and breakdown scale. It is not a claim
    that omitted mechanisms never matter.

## Audit-local propositions

These IDs are local to this audit and are not central claim-ledger IDs.

| ID | Status | Scoped proposition | Boundary |
| --- | --- | --- | --- |
| `PNF-T01` | established field practice | The ATLAS Run-2 trigger reduced a 40 MHz crossing rate to an average recorded rate of about 1 kHz through a versioned menu under compute, bandwidth, and storage limits. | The numbers describe that system and period; they are not a universal optimal reduction ratio. |
| `PNF-T02` | established inference boundary | Triggering and prescaling create a selection operator that must be included in downstream rate and population inference. | Known weights cannot recover events with zero or unknown inclusion probability. |
| `PNF-T03` | established measurement practice | ATLAS jet calibration combined simulation-based corrections with in-situ data constraints and reported regime-dependent systematic uncertainty. | One detector/object calibration does not transfer its numerical uncertainty to another instrument or task. |
| `PNF-T04` | established inverse-problem result | Detector migration and inefficiency can make direct matrix inversion singular or variance-amplifying; unfolding therefore introduces regularization or prior structure. | A stable-looking unfolded curve is not evidence that the response or prior is correct. |
| `PNF-T05` | established statistical method | Joint likelihoods can connect channels and bins through shared nuisance parameters and auxiliary constraints. | Profiling, asymptotics, or a standard schema does not validate the nuisance family or independence assumptions. |
| `PNF-T06` | established design boundary | Control-to-signal extrapolation is conditional on a transfer model, shared parameters, and contamination assumptions. | Agreement in a control region is not proof of background validity in a signal region. |
| `PNF-T07` | established multiple-testing result | Searching over an unknown location or model creates a distinction between local and global tail probabilities. | A trial factor depends on the actual correlated search, not just the nominal number of bins. |
| `PNF-T08` | established method with limited target | Blinding can reduce outcome-directed tuning by withholding selected result information until procedures are frozen. | It cannot remove all experimenter degrees of freedom or substitute for model checking and replication. |
| `PNF-T09` | established software/physics boundary | Geant4 exposes explicit geometry and physics models for simulating particle passage through matter. | A detailed simulation remains a conditional model and must be tested against relevant data. |
| `PNF-T10` | established preservation boundary | CERN's LHC open-data policy distinguishes data levels and states that educational/outreach subsets are not adequate for scientific publication. | “Open” alone does not imply rawness, completeness, fitness for a new inference, or available expert support. |
| `PNF-T11` | established engineering practice | Preserving data, code, environment, and declarative workflow enables stronger rerun and reinterpretation tests than preserving a paper or table alone. | A successful rerun may reproduce the same shared error and is not independent replication. |
| `PNF-T12` | established theory practice | Effective-field-theory predictions are organized by a dimensionless scale ratio and finite-order truncation, with a declared breakdown regime. | The power counting, coefficient prior, and breakdown scale are model assumptions to be checked. |
| `PNF-T13` | plausible systems transfer | A versioned selection–response contract can reduce false population, anomaly, and mechanism claims after thresholds, calibration, or simulation change. | It must beat ordinary event schemas, propensity logging, measurement uncertainty, and dependency tracking. |
| `PNF-T14` | plausible systems transfer | Preserving a small probability sample outside an adaptive trigger can expose selection drift and estimate lost support. | The monitor spends bandwidth and cannot certify unobserved zero-probability regions. |
| `PNF-T15` | plausible systems transfer | Full statistical-model artifacts can improve later reinterpretation and nuisance-aware combination beyond point estimates and marginal error bars. | Publication of a likelihood does not make its observations, nuisance family, or physical interpretation correct. |
| `PNF-T16` | speculative systems transfer | A regime-qualified hierarchy of effective models may reduce compute while exposing breakdown more honestly than one universal model. | This is ordinary model selection/multifidelity modeling until it beats those nulls at equal cost. |
| `PNF-T17` | disputed overclaim | A field-specific five-sigma convention is a universal threshold for scientific truth, anomaly response, or AI deployment. | Decision loss, search space, model error, prior evidence, and consequences differ across tasks. |
| `PNF-T18` | disputed overclaim | Detector simulation, closure on simulated data, or a reproducible workflow establishes real-world correctness. | Each can preserve or reproduce shared misspecification. |
| `PNF-T19` | established nuclear-data practice | Evaluated nuclear-data libraries are versioned syntheses of measurements, models, standards, and judgments, with application-relevant covariance and benchmark validation. | An evaluated central value is not raw observation; agreement of means across libraries does not establish agreement of covariance or fitness for every application. |

## Evidence synthesis

### Online selection is conditional computation with irreversible support loss

The ATLAS Run-2 system is a concrete, field-scale example of conditional
computation. It used a two-level trigger to reduce an initial 40 MHz bunch-
crossing rate to an average recording rate of about 1 kHz. Approximately 1,500
event selections were organized in a menu whose allocated rates and bandwidth
changed with operating conditions. The paper also documents special streams,
prescales, monitoring, configuration, validation, and condition updates
([doi:10.1088/1748-0221/15/10/P10004](https://doi.org/10.1088/1748-0221/15/10/P10004)).

The transferable lesson is not the reduction factor. It is that allocation and
observation are coupled. Let incoming event $i$ have byte size $b_i$ [bytes],
processing time $t_i$ [CPU s], and inclusion probability
$\pi_i=P(A_i=1\mid z_i,m,v)$, where $z_i$ is the online observable state, $m$
is the operating mode, $v$ is the trigger-menu version, and $A_i$ indicates
retention. For a finite population of eligible events, a Horvitz–Thompson count
estimator is

$$
\widehat N=\sum_{i:A_i=1}\frac{1}{\pi_i}.
$$

$\widehat N$ and $N$ are event counts; $\pi_i$ is dimensionless. The formula
requires positive, known inclusion support. If $\pi_i=0$, or if the logging
record cannot reconstruct $\pi_i$, no weight recovers the missing event class.
Correlated, adaptive, capacity-censored, or without-replacement selection needs
the corresponding joint design rather than an independent-Bernoulli variance
formula.

For input rate $R_{\mathrm{in}}$ [events/s], mean retained bytes
$E[A_i b_i]$ [bytes/event], and monitor/calibration traffic
$\dot B_{\mathrm{aux}}$ [bytes/s], the storage/network rate is

$$
\dot B=R_{\mathrm{in}}E[A_i b_i]+\dot B_{\mathrm{aux}}.
$$

For $c$ equivalent CPU workers, a first stability diagnostic is

$$
\rho=\frac{R_{\mathrm{in}}E[t_i]}{c}<1,
$$

where $\rho$ is dimensionless. This mean-load condition is necessary but not
sufficient for a tail-latency guarantee: burstiness, service-time tails,
priority, memory pressure, I/O, and synchronization remain explicit. A trigger
that meets mean throughput while selectively timing out hard or novel events
may improve cost and worsen discovery support.

**AI translation.** Early exits, cascades, sparse routing, tool-call admission,
memory retention, and anomaly triage must carry selection probability or a
declared deterministic support predicate, version, rejection reason, and an
auditable outside-policy sample. This refines P-001 and Candidates 013, 014, and
018. It is not a new routing principle.

### Detector output is apparatus-, calibration-, and regime-qualified

ATLAS's Run-2 jet-energy result begins with simulation-based calibration and
then uses several in-situ techniques to correct data/simulation differences and
measure resolution. Its quoted jet-energy-scale and resolution uncertainties
change with transverse momentum and detector region
([doi:10.1140/epjc/s10052-021-09402-3](https://doi.org/10.1140/epjc/s10052-021-09402-3)).
The exact percentages belong to those objects, data, detector conditions, and
procedures; the generalizable mechanism is layered calibration plus explicit
regime-dependent uncertainty.

A simple synthetic detector model is

$$
y=a_{r,t}E+c_{r,t}E^2/E_0+d_{r,t}+\epsilon,
$$

where $E$ and indication $y$ are in GeV, $a_{r,t}$ is dimensionless,
$c_{r,t}$ is dimensionless, reference $E_0$ is in GeV, offset $d_{r,t}$ is in
GeV, $r$ indexes detector region, $t$ indexes the conditions interval, and
$\epsilon$ is measurement noise in GeV. A calibration fitted at one $(r,t,E)$
support cannot silently validate another. Covariance among $a,c,d$ and shared
reference uncertainties must propagate to downstream quantities.

Geant4 is a mature toolkit for particle-transport simulation with explicit
geometry and physics models
([doi:10.1016/S0168-9002(03)01368-8](https://doi.org/10.1016/S0168-9002(03)01368-8)).
Its sophistication is exactly why “simulation says so” is an inadequate
provenance statement. Geometry, material, physics list, generator, random
seeds, detector conditions, electronics, digitization, reconstruction,
software version, and data-validation support are separate dependencies.

**AI translation.** A learned evaluator or simulator is another response model.
Calibration on one benchmark and agreement on one slice do not authorize a
universal confidence score. This routes to Candidate 014 and the metrology
audit; it adds no calibration principle.

### Unfolding exposes prior, response, and non-identifiability

For latent truth-bin counts $x_i$, response probabilities $R_{ji}$, background
counts $b_j$, and observed reconstructed-bin counts $y_j$, a common model is

$$
y_j\sim\operatorname{Poisson}\!\left(
\sum_i R_{ji}x_i+b_j\right).
$$

$x_i,b_j,y_j$ are counts; $R_{ji}$ is dimensionless and includes migration and
efficiency, with $\sum_jR_{ji}\le 1$. If two truth columns produce the same
reconstructed distribution, their difference lies in an observational null
space. No algorithm can identify it from $y$ alone.

D'Agostini's multidimensional Bayesian method explicitly notes singular and
unstable direct inversions and uses iterative prior updating
([doi:10.1016/0168-9002(95)00274-X](https://doi.org/10.1016/0168-9002(95)00274-X)).
Höcker and Kartvelishvili formulate regularized unfolding through the singular
value decomposition and propagate covariance
([doi:10.1016/0168-9002(95)01478-0](https://doi.org/10.1016/0168-9002(95)01478-0)).
These are mature inverse-problem nulls, not endorsements of one universal
unfolding method.

A generic regularized estimator is

$$
\widehat{\mathbf x}_{\lambda}
=\arg\min_{\mathbf x\ge0}
\left[
D_{\mathrm{Pois}}(\mathbf y,R\mathbf x+\mathbf b)
+\lambda\lVert L\mathbf x\rVert_2^2
\right],
$$

where $D_{\mathrm{Pois}}$ is a dimensionless Poisson deviance, $L$ is a declared
regularization operator, and $\lambda$ has the unit required to make the
penalty dimensionless. The response, binning, $L$, and $\lambda$ are part of
the result. Iteration count in iterative Bayes plays a regularizing role and is
likewise part of the procedure.

Minimum credible validation includes:

1. closure on simulations not used to tune the method;
2. stress on alternative truth shapes and response perturbations;
3. coverage or calibration of the reported interval under the declared family;
4. stability to binning and regularization choices;
5. explicit inefficiency and zero-support bins;
6. full covariance, including regularization-induced correlations;
7. forward-folded residuals in observed space; and
8. a statement of what remains non-identifiable.

Closure on the same generator and response used to build $R$ is a weak unit
test. Forward folding is a strong ordinary comparator, especially when the
scientific question can be answered without publishing an unfolded object.

**AI translation.** Representation decoding, latent-state recovery, world-model
inference, semantic decompression, and evaluator inversion must expose their
operator and prior. This is already owned by Candidates 014 and 017 plus the
optics and astronomy audits.

### Signal and control regions form one conditional statistical model

HistFactory is an official field tool for constructing binned parametric
likelihoods from modular channels, samples, and systematic variations
([doi:10.17181/CERN-OPEN-2012-016](https://doi.org/10.17181/CERN-OPEN-2012-016)).
A simplified joint model is

$$
L(\mu,\boldsymbol\theta)=
\prod_{r\in\mathrm{SR}}
\operatorname{Pois}\!\left(
n_r\mid \mu s_r(\boldsymbol\theta)+b_r(\boldsymbol\theta)
\right)
\prod_{c\in\mathrm{CR}}
\operatorname{Pois}\!\left(
n_c\mid \mu s_c(\boldsymbol\theta)+b_c(\boldsymbol\theta)
\right)
\,\pi(\boldsymbol\theta),
$$

where $n,s,b$ are counts, signal strength $\mu$ is dimensionless,
$\boldsymbol\theta$ contains nuisance parameters with declared units or
standardized scales, and $\pi$ represents auxiliary constraints or priors.
Shared nuisance parameters encode dependence between regions. Duplicating one
auxiliary datum in several factors would falsely multiply evidence.

The control region contributes only through a transfer relation. If
$b_{\mathrm{SR}}=\tau(\boldsymbol\theta)b_{\mathrm{CR}}$, transfer factor $\tau$
is dimensionless and requires its own validation support. Signal contamination,
unmodeled background composition, selection-induced covariate shift, and a
common simulation error can invalidate the transfer even when the control-region
fit is excellent.

Cowan et al. derive asymptotic likelihood-ratio approximations and the Asimov
data set for median sensitivity in a scoped regular setting
([doi:10.1140/epjc/s10052-011-1554-0](https://doi.org/10.1140/epjc/s10052-011-1554-0)).
The approximations are a computational null, not a guarantee at boundaries,
small samples, non-identifiability, or a misspecified likelihood. Exact or
simulation-based calibration remains required when its assumptions fail.

**AI translation.** A benchmark, red-team set, shadow deployment, or verifier
set is a control region only under a declared transfer model. “Passes the
control set” must not become “safe in production” without support, contamination,
and shared-root accounting. This refines Candidates 009, 010, and 014.

### Rare-event inference must include the searched family

For a fixed hypothesis point $m$, define a statistic $q(m)$. A local tail
probability is

$$
p_{\mathrm{local}}(m)=P_0\bigl(q(m)\ge q_{\mathrm{obs}}(m)\bigr).
$$

If the analysis searched $m\in\mathcal M$, the relevant global statistic can be

$$
q_{\max}=\sup_{m\in\mathcal M}q(m),
\qquad
p_{\mathrm{global}}=P_0\bigl(q_{\max}\ge q_{\max,\mathrm{obs}}\bigr).
$$

Both p-values are dimensionless. Gross and Vitells give an asymptotic procedure
for the look-elsewhere effect in a resonance search
([doi:10.1140/epjc/s10052-010-1470-8](https://doi.org/10.1140/epjc/s10052-010-1470-8)).
The actual family includes more than mass bins when analysts tried alternative
windows, features, channels, preprocessing, model families, or stopping rules.
Correlated hypotheses do not reduce to a naive independent-bin count.

Feldman and Cousins address data-dependent switching between upper limits and
two-sided intervals through a unified Neyman construction
([doi:10.1103/PhysRevD.57.3873](https://doi.org/10.1103/PhysRevD.57.3873)).
The broader lesson is that the procedure and ordering rule precede the observed
outcome. The field's five-sigma discovery convention is not a universal loss
function for operational AI alarms or scientific truth.

Klein and Roodman review several blinding strategies used in nuclear and
particle physics
([doi:10.1146/annurev.nucl.55.090704.151521](https://doi.org/10.1146/annurev.nucl.55.090704.151521)).
Blinding should record:

1. which variables, regions, offsets, labels, or summaries were hidden;
2. who had access, when, and for what role;
3. which code, cuts, nuisance models, validation plots, and stopping rules were
   frozen before access;
4. every post-unblinding change and whether fresh confirmation remains; and
5. whether sidebands, simulation, or auxiliary channels leaked target information.

**AI translation.** Anomaly mining, architecture search, evaluator selection,
and red-team iteration need a search-family and access-ancestry ledger. This is
already covered by temporary proposal state, staged verification, graded
assurance, and the scientific-discovery audit.

### Simulation mismatch is a model-risk problem, not an edge case

The field often trains selection, estimates efficiency, constructs response
matrices, and predicts backgrounds using simulation, then constrains or corrects
the result with data. The ATLAS calibration example explicitly applies in-situ
corrections after simulation-based calibration. This is evidence for a layered
workflow, not proof that a residual data/simulation correction captures every
missing mechanism.

For simulator distribution $p_s(x,y)$ and target distribution $p_t(x,y)$,
importance reweighting based only on observables requires support and an
appropriate density ratio. Even under covariate shift,

$$
E_t[\ell(f(X),Y)]
=E_s\!\left[
\frac{p_t(X)}{p_s(X)}\ell(f(X),Y)
\right]
$$

holds only where $p_s(X)>0$ whenever $p_t(X)>0$ and the conditional target
relation satisfies the declared assumption. The ratio is dimensionless and
$\ell$ retains its task-defined unit. Conditional shift, latent confounding,
new event topologies, or detector failure breaks the identity.

Mandatory mismatch probes include alternate generators/responses, nuisance
interpolation and extrapolation, withheld detector regions and periods,
out-of-support injections, data-driven controls, simulator-classifier tests,
and outcome checks that cannot be optimized through the same simulator. “More
realistic” is not a metric until the target observations and discrepancy are
named.

### Open artifacts have different reconstructability levels

The CERN Open Data Policy for LHC experiments defines several levels of data
release and explicitly distinguishes outreach/education subsets from data
adequate for scientific publication
([doi:10.7483/OPENDATA.0XO6.HYY1](https://doi.org/10.7483/OPENDATA.0XO6.HYY1)).
HEPData preserves publication-related tables and resources with versions and
persistent identifiers
([doi:10.1088/1742-6596/898/10/102006](https://doi.org/10.1088/1742-6596/898/10/102006)).
ATLAS has demonstrated publication of full statistical-likelihood workspaces
for selected searches
([ATL-PHYS-PUB-2019-029](https://cds.cern.ch/record/2684863)).

REANA represents analyses as declarative DAG workflows dispatched to supported
compute backends; published examples include ATLAS and CMS workflows
([doi:10.3389/fdata.2021.661501](https://doi.org/10.3389/fdata.2021.661501)).
These mechanisms establish that complex analysis preservation is feasible. They
do not imply that every historical analysis is captured, every container will
remain runnable, external services and credentials are preserved, or the
preserved inference is scientifically correct.

For artifact $a$, record a reconstructability vector rather than a binary flag:

$$
\mathbf R_a=(R_D,R_C,R_E,R_W,R_L,R_V,R_A),
$$

where components indicate tested recovery of data, code, environment, workflow,
likelihood/statistical model, validation references, and required authority or
external services. Each component is an ordinal state such as absent,
documented, resolved, runnable, and independently verified; it is not a
probability unless calibrated as one.

**AI translation.** Model weights plus a README are not a reproducible system.
Selection logs, evaluator state, retrieval snapshots, environment, authority,
and verification data are dependencies. This refines Candidates 009, 017, and
018 and adds no provenance principle.

### Evaluated nuclear data are versioned models with correlated uncertainty

Nuclear experiments and applications often consume evaluated libraries rather
than one raw measurement. JEFF-3.3 is a European/OECD-NEA collaborative
fission-and-fusion library whose release integrates many nuclides, reactions,
decay/fission-yield products, formats, and validation activities
([doi:10.1140/epja/s10050-020-00141-9](https://doi.org/10.1140/epja/s10050-020-00141-9)).
The library is a scientific product with provenance and version, not a table of
direct observations.

The OECD Nuclear Energy Agency's WPEC Subgroup 44 report notes that evaluated
libraries can have broadly similar mean cross sections while giving materially
different covariance information. It examines covariance generation,
cross-isotope/reaction correlations, integral-experiment use, and the difficulty
of application-independent covariance
([NEA/NSC/R(2021)4](https://www.oecd-nea.org/jcms/pl_78107/investigation-of-covariance-data-in-general-purpose-nuclear-data-libraries)).

Let evaluated reaction data over energy groups be vector
$\boldsymbol\sigma$ [barn], with covariance
$C_\sigma$ [barn$^2$]. For application response
$k=f(\boldsymbol\sigma)$ and local sensitivity row vector
$J=\partial f/\partial\boldsymbol\sigma$ [unit of $k$/barn], first-order
propagation is

$$
u^2(k)\approx J C_\sigma J^\mathsf T.
$$

$u^2(k)$ has the squared unit of $k$. The calculation depends on library
version, covariance representation, energy processing/grouping, application
model, and linearization support. Updating evaluated data with an integral
benchmark and then presenting the same benchmark as independent validation can
create evidence reuse; benchmark identity and assimilation role must therefore
be explicit.

**AI translation.** An evaluated benchmark, safety corpus, knowledge base, or
aggregate “gold set” is a versioned inference product. Preserve source
measurements, model components, correlations, processing, application
sensitivities, and which benchmarks were used for fit versus validation. This
deduplicates to Candidates 009, 014, and 017 plus database, metrology, and
scientific-discovery audits. WS-PNF-04 tests covariance misspecification;
WS-PNF-07 tests library revision and evidence reuse.

### Symmetry and effective theory are constraints with breakdown records

Particle and nuclear theory use symmetry and scale separation to reduce the
admissible model space. Appelquist and Carazzone establish a scoped decoupling
result for heavy fields in renormalizable theories
([doi:10.1103/PhysRevD.11.2856](https://doi.org/10.1103/PhysRevD.11.2856));
Weinberg's phenomenological-Lagrangian construction is foundational for modern
effective-theory reasoning
([doi:10.1016/0378-4371(79)90223-1](https://doi.org/10.1016/0378-4371(79)90223-1)).
Neither says that arbitrary components may be deleted without matching their
low-energy effect.

A finite-order effective expansion can be written

$$
O^{(k)}(p)=O_{\mathrm{ref}}(p)
\sum_{n=0}^{k}c_n(p)Q(p)^n,
\qquad
Q(p)=\frac{p}{\Lambda_b},
$$

where observable $O$ and $O_{\mathrm{ref}}$ share units, coefficients $c_n$
and expansion parameter $Q$ are dimensionless, momentum/energy scale $p$ and
breakdown scale $\Lambda_b$ share units, and the intended regime is $Q<1$.
Furnstahl et al. demonstrate Bayesian quantification of truncation uncertainty
for nuclear EFT predictions under explicit coefficient priors and power
counting
([doi:10.1103/PhysRevC.92.024005](https://doi.org/10.1103/PhysRevC.92.024005)).

The transfer is a regime-qualified model ladder:

1. name retained and omitted degrees of freedom;
2. state invariances, approximate symmetries, and permitted breaking terms;
3. record scale variable, order, matching data, coefficient prior, and
   breakdown criterion;
4. estimate truncation separately from measurement, numerical, and parameter
   uncertainty;
5. test order-by-order behavior on held-out observables; and
6. abstain or escalate when the breakdown monitor fires.

Equivariant architectures, feature constraints, reduced-order models,
multifidelity modeling, mixture-of-experts routing, and model-predictive regime
switching are mature AI/engineering nulls. A physics label earns no credit.

## European, German, and standards boundary

The following instruments have narrow, exact roles here.

1. **DIN EN ISO/IEC 17025:2018-03** is the current German/European adoption of
   ISO/IEC 17025:2017 for competence, impartiality, and consistent operation of
   testing and calibration laboratories
   ([DIN record](https://www.dinmedia.de/en/standard/din-en-iso-iec-17025/278030106)).
   It is a mature laboratory-system comparator when a real test or calibration
   laboratory is in scope. This audit does not claim that every research
   analysis must be accredited or that conformance validates a scientific model.
2. **Council Directive 2013/59/Euratom** establishes basic safety standards for
   occupational, medical, and public exposure to ionising radiation
   ([EUR-Lex](https://eur-lex.europa.eu/eli/dir/2013/59/oj)).
3. Germany implements the radiation-protection framework through the
   **Strahlenschutzgesetz (StrlSchG)** and **Strahlenschutzverordnung (StrlSchV)**
   ([StrlSchG](https://www.gesetze-im-internet.de/strlschg/BJNR196610017.html),
   [StrlSchV](https://www.gesetze-im-internet.de/strlschv_2018/BJNR203600018.html)).

The synthetic workstation tests do not create exposure and therefore do not
invoke radiation-source authorization, dose, worker-classification, or facility
requirements. A later physical detector, accelerator, sealed/unsealed source,
medical exposure, radioactive material, or radiation-emitting device requires
a separate activity- and jurisdiction-specific legal assessment before work.
No compliance status is inferred from this documentation.

## Proposed selection–response record

For dataset or stream $d$, retain

$$
S_d=(I,V,T,M,A,\Pi,D,C,R,B,N,F,G,P,X),
$$

where:

- $I,V$ are stream identity and immutable version/hash;
- $T$ is acquisition event time, processing time, and validity interval;
- $M$ is operating mode and detector/system conditions;
- $A$ is acceptance/support definition;
- $\Pi$ is trigger, prescale, timeout, dead-time, and inclusion design;
- $D$ is raw/reconstructed data-level and object definition;
- $C$ is calibration, reference, correction, and uncertainty state;
- $R$ is response/efficiency model with binning, covariance, and support;
- $B$ is background and control-to-target transfer model;
- $N$ is nuisance inventory, correlation graph, and constraint provenance;
- $F$ is searched hypothesis family, stopping rule, and multiplicity treatment;
- $G$ is blinded-access, tuning, review, and post-unblinding change history;
- $P$ is generator/simulation, software, environment, workflow, and artifact
  provenance;
- $X$ is downstream dependency, invalidation, expiry, and reconstructability
  state.

This record is a schema refinement for Candidate 014 composed with Candidate
009. It is not evidence that all fields are known. `unknown`, `not observed`,
`zero support`, `not preserved`, and `disputed` are first-class states.

## CPU-only workstation falsification package

### Common execution contract

All tests are synthetic and deterministic from committed seeds. The pilot uses
8 paired seeds; confirmation uses 32 fresh paired seeds selected before pilot
inspection. Each fixture must run on one workstation with at most 8 logical CPU
threads, 16 GiB peak resident memory, and 4 GiB combined input plus temporary
artifact storage. GPU, network services, proprietary data, and hidden expert
labels are prohibited.

Per fixture, the pilot budget is at most 12 CPU-hours and 25 GiB total durable
writes across all arms; confirmation is at most 96 CPU-hours and 200 GiB writes.
An arm that exceeds the cap is a recorded resource failure, not silently run on
more hardware. Freeze generator, seed list, arm versions, hyperparameter budget,
statistical plan, and kill rules before confirmation.

Every arm records:

- task outcome vector and all false-positive/false-negative denominators;
- p50/p95/p99 latency [s] and throughput [events/s];
- CPU and wall time [s], peak RSS [bytes], bytes read/written, and durable writes;
- retained, rejected, timed-out, and zero-support event counts;
- human setup/review time [person-s] from a prescribed operator script;
- package, operating-system, CPU, thread, seed, and configuration hashes; and
- whole-system energy [J] only when an external calibrated meter, idle baseline,
  integration interval, and uncertainty are available.

Software energy counters may be exploratory telemetry but cannot support a
joule claim. Model training, simulation generation, calibration, pseudoexperiments,
storage, reruns, and failed trials are inside the lifecycle boundary.

### WS-PNF-01 — irreversible trigger under rare shift

Generate 400,000 events per confirmation seed. Each event has 32 float32
features (128 raw feature bytes), an event-time stamp, regime label hidden from
the trigger, and a sealed ground-truth class. Background is a correlated mixture;
the target rate is 0.1%. At 60% of event time, shift one background component,
feature latency, and 30% of target morphology. Inject a burst whose mean load is
below capacity but whose p99 service demand exceeds it.

The online budget permits retaining at most 1.0% of events plus a separate 0.1%
uniform audit stream. Per-event online CPU is capped at 200 microseconds in the
simulated accounting; queue timeout is 20 milliseconds. Rejected raw features
are irrecoverable after the decision.

**Arms:** uniform sample; fixed threshold; threshold plus prescale; two-stage
calibrated cascade; queue-aware value-of-information routing; Candidate 013;
Candidate 013 plus the proposed selection–response record. The oracle target
label is an ineligible ceiling.

**Outcomes:** target recall, background retention, global population-estimate
bias and interval coverage, novel-target recall, timeout class composition,
audit-stream estimator variance, p99 latency, bytes, CPU, and calibration after
drift.

**Gate:** no excess zero-support target family; simultaneous 95% interval
coverage at least 92.5% across registered population queries; and strictly
better target-recall/resource frontier than the best calibrated cascade.

**Kill:** reject the residue if a uniform audit stream plus ordinary logged
propensities matches it, or if apparent efficiency comes from timing out hard
events, using sealed labels, or charging no cost for the audit stream.

### WS-PNF-02 — calibration, drift, and shared reference root

Generate 240,000 latent energies spanning 10–3,000 synthetic GeV across four
detector regions and twelve time blocks. Apply the nonlinear response above,
piecewise gain drift, saturation, heteroscedastic noise, and one shared reference
bias. Provide calibration anchors in only eight time/region combinations and
withhold two energy extremes for confirmation.

**Arms:** no calibration; one global linear calibration; per-region static
calibration; periodic recalibration; state-space drift tracking; robust spline
calibration; Candidate 014 record with dependency invalidation. Give all arms
the same anchors and fitting budget.

**Outcomes:** bias [GeV], resolution [GeV], interval coverage, worst-region
error, drift-detection delay [s], false recalibrations, reference-root
localization, invalidation recall/precision, CPU, bytes, and human review.

**Gate:** noninferior mean error and lower worst-region error than robust spline;
nominal 95% coverage between 92.5% and 97.5% in supported regions; explicit
abstention outside support; and at least 95% recall of claims affected by the
shared reference fault.

**Kill:** reject if a standard drift model plus dependency graph matches all
outcomes, if uncertainty shrinks under reference bias, or if an unsupported
energy regime receives an ordinary calibrated result.

### WS-PNF-03 — unfolding under response mismatch

Use 60 truth bins and 60 reconstructed bins over 0–3,000 synthetic GeV. Generate
five held-out truth families and response matrices with condition numbers near
$10^2$, $10^4$, and $10^6$; include 5% inefficiency, two zero-support truth bins,
background contamination, finite response-Monte-Carlo counts, and an alternative
response with shifted tails. Observe 100,000 events per seed.

**Arms:** efficiency-corrected bin counts; direct pseudoinverse; truncated SVD;
Tikhonov; iterative Bayes with frozen iteration choice; forward-folded parametric
likelihood; nonparametric forward model; Candidate 014/017 composition. Equalize
response-simulation counts and tuning calls.

**Outcomes:** truth-bin bias [events], covariance coverage, integrated absolute
error [events], Wasserstein distance [GeV] for normalized shapes, observed-space
deviance, zero-support honesty, sensitivity to alternate response, CPU, memory,
and stored covariance bytes.

**Gate:** no claims in zero-support directions; at least 92.5% simultaneous
coverage for the registered aggregate functionals; forward-folded residuals
within the calibrated null envelope; and a quality/cost frontier gain beyond
the best forward-folded null.

**Kill:** reject if gains occur only on the response used for training, if
regularization choice used confirmation truth, if covariance omits response
uncertainty, or if forward folding answers the task at equal or lower cost.

### WS-PNF-04 — control-region transfer and nuisance correlation

Generate one signal region and three control regions with 24 bins each. Use
Poisson counts, twelve nuisance parameters, a known sparse covariance graph,
one common calibration root, nonlinear transfer at one boundary, and signal
contamination levels of 0%, 5%, and 20%. Include 1,000 null and 1,000 injected
pseudoexperiments per confirmation seed.

**Arms:** control-region plug-in estimate; independent per-region fits; joint
likelihood with diagonal nuisances; joint likelihood with correct correlations;
robust partial-pooling model; saturated goodness-of-fit comparator; Candidate
009/014 composition. The true nuisance graph is an ineligible ceiling except in
the labeled calibration arm.

**Outcomes:** signal-strength bias, 95% interval coverage, Type-I error, power,
control and signal predictive residuals, contamination sensitivity, common-root
localization, fit failures, CPU, and bytes.

**Gate:** family-wise Type-I error no greater than 5% under every registered
null regime; coverage at least 92.5%; noninferior power; and lower false assurance
under correlation and contamination mismatch than the best ordinary model.

**Kill:** reject if a conventional joint likelihood plus posterior/predictive
checks matches it, or if better fit is obtained by absorbing the injected signal
into an unconstrained nuisance.

### WS-PNF-05 — blinded correlated rare-event scan

Generate 512 ordered mass positions with Gaussian-process-correlated background
at correlation lengths 2, 8, and 32 bins. Half the injected alternatives contain
one narrow peak, one quarter a broad excess, and one quarter no signal. Permit a
development analyst twenty search-window or preprocessing choices. Create 20,000
null toys per seed for global calibration.

**Arms:** unblinded adaptive tuning with local p-value; fixed split sample;
masked signal window; salted/offset result; preregistered scan with empirical
global maximum statistic; sequential e-value or always-valid comparator;
Candidate 010 access-ancestry record. Equalize total search and toy calls.

**Outcomes:** local and global Type-I error, family-wise error, power by signal
width, discovery delay, post-unblinding changes, analyst-choice count, missed
non-peak alternatives, CPU, and human time.

**Gate:** global family-wise error no greater than 5% with a 95% binomial upper
confidence bound no greater than 6%; noninferior power to the best valid null;
and complete disclosure of every target-informed choice.

**Kill:** reject if blinding is credited despite an unlogged post-unblinding
retune, if the search family excludes tried alternatives, if a fixed empirical
max-statistic test matches it, or if peak-focused blinding suppresses the broad
alternative without reporting that loss.

### WS-PNF-06 — simulation-to-target mismatch

Generate 300,000 simulator events and 100,000 target-like events with 20
features. Factor shifts into calibration drift, covariate shift with support,
conditional label shift, a new zero-support topology, and a shared generator
bug. Provide 10,000 labeled target control events and seal the remaining target
labels.

**Arms:** simulator-only logistic model; simulator-only boosted tree; marginal
calibration; importance weighting; domain-adversarial/robust representation;
nuisance-parameterized model; data-driven control model; Candidate 014 record
with out-of-support abstention. Equalize training examples, hyperparameter
trials, and CPU.

**Outcomes:** target log loss, calibration error, precision/recall at the frozen
operating point, zero-support abstention, worst-shift loss, false confidence,
generator-bug localization, CPU, memory, and control-label use.

**Gate:** no ordinary prediction on zero-support topology; noninferior supported-
target loss; lower worst-shift false confidence than the best robust baseline;
and no use of sealed labels in construction.

**Kill:** reject if a standard support detector plus target calibration matches
the frontier, if simulator–target discrimination is mistaken for causal fault
localization, or if target labels are used without charging them.

### WS-PNF-07 — preserved likelihood and workflow under dependency change

Construct 40 synthetic analyses, each a 30-step DAG with 500 hashed artifacts,
four package environments, two response versions, one evaluated-data-library
version, one credentialed mock service, and a binned likelihood. Create 100
mutations: input revision, calibration change, covariance/library revision,
fit-versus-validation benchmark-role change, nuisance-correlation change,
environment drift, silent code change, service removal, and corrupted
provenance edge.

**Arms:** paper plus tables; notebook snapshot; code plus lockfile; container
image; DAG plus content hashes; full likelihood plus DAG/environment; Candidate
009/017/018 composition with dependency invalidation. All preserved artifacts
consume their actual bytes.

**Outcomes:** exact rerun rate, statistical reproduction tolerance, affected-
artifact recall/precision, stale-result escapes, root-cause localization,
repair time [s], external-service failures, retained bytes, CPU, and operator
minutes.

**Gate:** at least 99% invalidation recall with no more than 20% unnecessary
reruns; materially higher successful reinterpretation than a container plus DAG;
and lower stale-result escape at equal retained bytes or a disclosed Pareto gain.

**Kill:** reject if a mature content-addressed build graph plus archived
likelihood matches it, if identical rerun is reported as replication, or if
credentials/external services are silently assumed to survive.

### WS-PNF-08 — symmetry and effective-model breakdown

Generate 64 synthetic observable families on
$Q\in\{0.05,0.10,\ldots,1.20\}$. Half obey an even symmetry inside the regime,
one quarter include a small symmetry-breaking term, and one quarter change
functional family above a hidden breakdown point in $Q\in[0.55,0.85]$.
Provide orders 0–4 for development and hold out order 5 plus high-$Q$ outcomes.

**Arms:** unrestricted polynomial; symmetry-constrained polynomial; spline;
Gaussian process; fixed-order effective expansion with naive last-term error;
Bayesian truncation model; learned mixture-of-experts; regime-gated hierarchy
with explicit abstention. Equalize fit calls and retained coefficients.

**Outcomes:** supported-regime prediction error, 68% and 95% interval coverage,
symmetry-breaking detection, breakdown-detection delay in $Q$, false abstention,
high-$Q$ overconfidence, coefficient/storage count, CPU, and lifecycle retraining
cost.

**Gate:** nominal coverage within 3 percentage points inside the supported
regime; at least 90% breakdown detection before the first consequential
high-confidence failure; noninferior error to the best GP/spline null; and a
strict compute or state reduction after all monitoring cost.

**Kill:** reject if ordinary cross-validated multifidelity modeling matches it,
if exact symmetry hides registered breaking, if the breakdown scale is tuned on
held-out outcomes, or if truncation uncertainty is merged with measurement and
numerical error.

## Confirmatory analysis and decision contract

The confirmatory unit is an independently seeded complete acquisition-to-claim
episode, not an event, histogram bin, scan point, or pseudoexperiment. Pair arms
on the same latent events, detector response, drift, nuisance graph, search
family, simulation shift, and dependency mutation. Cluster repeated episodes
sharing a response family, simulator root, calibration reference, or workflow
lineage.

Hold out entire:

- rare-event morphologies and background regimes;
- detector regions, time blocks, and calibration roots;
- truth shapes and response perturbation families;
- nuisance graphs and signal-contamination regimes;
- search correlation lengths and analyst-choice sequences;
- simulator shifts and zero-support topologies;
- workflow/environment mutation families; and
- symmetry-breaking and effective-theory breakdown families.

Use a frozen gate order:

1. no excess irreversible harm, zero-support claim, Type-I error, or stale-result
   escape relative to the best valid null;
2. calibrated intervals and declared multiplicity within registered tolerance;
3. noninferior task utility and rare-event power;
4. lower invalid-inference, mismatch, or reconstruction failure; then
5. lower compute, latency, storage, human work, or measured energy.

Report raw vectors and simultaneous intervals. Do not collapse false discovery,
missed rare event, calibration, task utility, bytes, and energy into one score.
Multiplicity includes the eight fixtures, primary comparator contrasts, and
registered primary outcomes. Pilot data may select one primary comparator per
fixture but may not change confirmation generators, gates, or outcome meanings.

## Resource and lifecycle accounting

For arm $a$, report

$$
\mathbf C_a=(Q_a,F_a,L_a,T^{\mathrm{cpu}}_a,T^{\mathrm{wall}}_a,
M_a,B^{\mathrm{read}}_a,B^{\mathrm{write}}_a,S_a,H_a,E_a),
$$

where:

- $Q_a$ is the task-quality vector in native units;
- $F_a$ is the false-positive/false-negative and coverage vector [counts or
  dimensionless rates with denominators];
- $L_a$ is the latency distribution [s];
- $T^{\mathrm{cpu}}_a,T^{\mathrm{wall}}_a$ are CPU and wall time [s];
- $M_a$ is peak resident memory [bytes];
- $B^{\mathrm{read}}_a,B^{\mathrm{write}}_a$ are I/O [bytes];
- $S_a$ is retained durable state [bytes] plus artifact count;
- $H_a$ is prescribed human work [person-s]; and
- $E_a$ is whole-system measured energy [J], or `not measured`.

Charge event generation, rejected-event monitoring, calibration streams,
response simulation, pseudoexperiments, nuisance fits, covariance storage,
likelihood publication, container/workflow preservation, invalidation, reruns,
and operator review. A trigger does not save energy if it shifts more work into
simulation, calibration, manual exception review, or later re-acquisition.

## Mandatory mature null stack

1. fixed and calibrated cascades, queue-aware scheduling, sampling, and logged
   propensity/inclusion designs;
2. streaming systems with backpressure, dead-letter paths, audit streams, and
   versioned schemas;
3. DIN/BIPM-style calibration, uncertainty, traceability, drift, and
   intercomparison practice where applicable;
4. direct forward modeling, truncated SVD, Tikhonov regularization, iterative
   Bayes, likelihood-free and likelihood-based inverse methods;
5. joint generalized linear/hierarchical likelihoods, profile and marginal
   nuisance treatment, robust partial pooling, and saturated checks;
6. family-wise and false-discovery control, empirical maximum statistics,
   sequential/always-valid tests, preregistration, and split confirmation;
7. blinded signal regions, salted/offset results, access controls, and explicit
   post-unblinding logs;
8. alternate simulation/generator ensembles, target calibration, importance
   weighting, support detection, robust training, and data-driven controls;
9. content-addressed builds, lockfiles, containers, workflow DAGs, artifact
   hashes, likelihood publication, and independent rerun services;
10. versioned evaluated-data libraries, covariance propagation, sensitivity
    analysis, differential and integral benchmark validation, and explicit
    fit/validation ancestry;
11. symmetry-aware models, reduced-order and multifidelity models, Gaussian
    processes, mixture-of-experts routing, and explicit out-of-distribution
    abstention; and
12. Candidates 009, 010, 013, 014, 017, and 018 without particle-physics labels.

## Deduplication map

| Field mechanism | Existing repository owner | Disposition |
| --- | --- | --- |
| trigger menus, prescales, and rate budgets | P-001; Candidates 013 and 018 | conditional routing/storage null; add inclusion-support and timeout accounting |
| calibration, response, drift, and uncertainty | P-006, P-007, P-009, P-013; Candidate 014; metrology audit | no new principle; add detector-response stress cases |
| unfolding and forward folding | P-007 and P-013; Candidate 014; optics and astronomy audits | inverse-operator refinement; explicit zero-support and regularization records |
| nuisance correlation and control regions | Candidates 009, 010, and 014; scientific-discovery audit | assurance/evaluator refinement; shared-root and transfer tests |
| rare-event search and look-elsewhere effect | P-003 and P-007; Candidates 004, 009, and 010; astronomy audit | search-family and access-ancestry refinement |
| blinding | P-003; Candidates 009 and 010; philosophy/scientific-discovery audits | mature construction/confirmation separation; record post-unblinding changes |
| simulation mismatch | P-007 and P-009; Candidates 003, 007, 009, and 014 | ordinary model-risk and observation-operator null |
| full likelihood and workflow preservation | P-009, P-012, and P-013; Candidates 009, 017, and 018 | reconstructability refinement, not truth or replication |
| evaluated nuclear-data libraries and covariance | P-009, P-012, and P-013; Candidates 009, 014, and 017; database/metrology audits | versioned shared evidence product; add benchmark-role and covariance ancestry |
| symmetry and effective-model hierarchy | P-010 and P-012; Candidates 001, 013, and 017 | structured prior/model-lifetime null; add breakdown gate only |

No project principle survives this deduplication as uniquely particle- or
nuclear-derived. The useful residue is a connected adversarial fixture suite.

## Cross-fixture failure modes

Reject any claimed gain that depends on:

1. treating selected events as an unbiased population;
2. reconstructing a zero-support class without external information;
3. using the same simulation to build and validate a response;
4. tuning regularization, search windows, or nuisance models on confirmation
   truth;
5. counting an auxiliary/control sample twice through shared lineage;
6. reporting only local significance after a broader search;
7. presenting five sigma as a universal action threshold;
8. calling a hidden post-unblinding revision “blinded confirmation”;
9. profiling an unconstrained nuisance that absorbs the injected target;
10. mistaking data/simulation discrimination for causal fault localization;
11. omitting generator, calibration, reconstruction, or trigger versions;
12. calling a rerun independent replication;
13. preserving code while losing data, environment, workflow, likelihood,
    authority, or external services;
14. imposing an exact symmetry that removes the registered discovery target;
15. extrapolating an effective model beyond its declared breakdown scale; or
16. excluding simulation, monitoring, calibration, storage, review, or rerun
    cost from the lifecycle boundary.

## Proposed central claims

The root integrator may assign the next available central IDs. These eleven claims
are the maximum justified promotion set; local propositions need not all become
central claims.

1. **Trigger selection is an observation dependency.** A high-rate trigger can
   perform large resource reduction, but downstream inference remains conditional
   on menu, prescale, operating mode, efficiency/support, timeout, and monitoring
   streams. Sources: `ATLAS2020Run2Trigger`.
2. **Calibration is layered and regime-qualified.** Simulation-based response
   corrections plus in-situ constraints can produce scoped calibrated objects,
   while uncertainty varies with object, region, time, and scale. Sources:
   `ATLAS2021JetCalibration`, `DIN17025_2018`.
3. **Unfolding is response- and regularization-qualified.** Detector migration
   and inefficiency can make inversion ill-posed; stable recovery requires a
   declared response, prior/regularizer, validation family, covariance, and
   non-identifiable directions. Sources: `DAgostini1995Unfolding`,
   `HoeckerKartvelishvili1996SVD`.
4. **A fitted nuisance model is not a complete systematic-uncertainty proof.**
   Joint likelihoods can propagate declared correlations and auxiliary
   constraints, but profiling/asymptotics do not validate omitted nuisances,
   transfer assumptions, or independence. Sources: `CranmerEtAl2012HistFactory`,
   `CowanEtAl2011Asymptotic`.
5. **Rare-event significance must include the actual search family.** A local
   tail probability differs from the global probability after searching an
   unknown location or correlated alternative family. Source:
   `GrossVitells2010LookElsewhere`.
6. **Blinding has a scoped bias-control target.** Withholding result information
   can reduce outcome-directed tuning, but it does not repair model error and
   requires disclosure of access and post-unblinding changes. Source:
   `KleinRoodman2005Blinding`.
7. **Simulation is a conditional forward model.** Detailed particle-transport
   simulation exposes geometry and physics-model choices but does not become
   ground truth without regime-relevant data validation. Sources:
   `AgostinelliEtAl2003Geant4`, `ATLAS2021JetCalibration`.
8. **Open-data and preservation levels support different claims.** Tables,
   educational subsets, reconstructed research data, likelihoods, and runnable
   workflows provide different reinterpretation and reconstructability support;
   none alone establishes independent replication. Sources:
   `CERN2020OpenDataPolicy`, `MaguireEtAl2017HEPData`,
   `ATLAS2019FullLikelihoods`, `SimkoEtAl2021DeclarativeWorkflows`.
9. **Evaluated nuclear data are model- and covariance-qualified.** A library
   combines measurements, models, processing, standards, and judgment under a
   version; central values, covariance, and benchmark role must remain
   application- and ancestry-qualified. Sources: `PlompenEtAl2020JEFF33`,
   `OECDNEA2023NuclearCovariance`.
10. **Effective-model uncertainty is regime-qualified.** A finite-order expansion
   is conditional on its scale ratio, power counting, coefficient assumptions,
   and breakdown scale; truncation uncertainty remains distinct from
   measurement and numerical error. Sources: `FurnstahlEtAl2015EFTTruncation`,
   `AppelquistCarazzone1975Decoupling`, `Weinberg1979Phenomenological`.
11. **The proposed selection–response record is a hypothesis.** Carrying trigger,
    response, nuisance, search, access, simulation, and reconstructability state
    may prevent stale or unsupported downstream claims beyond ordinary
    provenance and metrology. Evidence test: WS-PNF-01 through WS-PNF-08; no
    external source establishes the composition.

## Primary and authoritative source keys

| Proposed key | Source | DOI or official URL |
| --- | --- | --- |
| `DFG2024ParticleNuclearFields` | Deutsche Forschungsgemeinschaft, “3.24 Teilchen, Kerne und Felder,” Fachkollegien 2024–2028 | https://www.dfg.de/de/ueber-uns/gremien/fachkollegien/fachsystematik/naturwissenschaften-3-24 |
| `OECD2015Frascati` | OECD, *Frascati Manual 2015: Guidelines for Collecting and Reporting Data on Research and Experimental Development* | https://doi.org/10.1787/9789264239012-en |
| `ATLAS2020Run2Trigger` | ATLAS Collaboration, “Operation of the ATLAS trigger system in Run 2,” *JINST* 15, P10004 (2020) | https://doi.org/10.1088/1748-0221/15/10/P10004 |
| `ATLAS2021JetCalibration` | ATLAS Collaboration, “Jet energy scale and resolution measured in proton–proton collisions at $\sqrt{s}=13$ TeV with the ATLAS detector,” *EPJ C* 81, 689 (2021) | https://doi.org/10.1140/epjc/s10052-021-09402-3 |
| `AgostinelliEtAl2003Geant4` | S. Agostinelli et al., “Geant4—a simulation toolkit,” *NIM A* 506, 250–303 (2003) | https://doi.org/10.1016/S0168-9002(03)01368-8 |
| `DAgostini1995Unfolding` | G. D'Agostini, “A multidimensional unfolding method based on Bayes' theorem,” *NIM A* 362, 487–498 (1995) | https://doi.org/10.1016/0168-9002(95)00274-X |
| `HoeckerKartvelishvili1996SVD` | A. Höcker and V. Kartvelishvili, “SVD approach to data unfolding,” *NIM A* 372, 469–481 (1996) | https://doi.org/10.1016/0168-9002(95)01478-0 |
| `CranmerEtAl2012HistFactory` | K. Cranmer et al., *HistFactory: A tool for creating statistical models for use with RooFit and RooStats*, CERN-OPEN-2012-016 | https://doi.org/10.17181/CERN-OPEN-2012-016 |
| `CowanEtAl2011Asymptotic` | G. Cowan, K. Cranmer, E. Gross, and O. Vitells, “Asymptotic formulae for likelihood-based tests of new physics,” *EPJ C* 71, 1554 (2011) | https://doi.org/10.1140/epjc/s10052-011-1554-0 |
| `GrossVitells2010LookElsewhere` | E. Gross and O. Vitells, “Trial factors for the look elsewhere effect in high energy physics,” *EPJ C* 70, 525–530 (2010) | https://doi.org/10.1140/epjc/s10052-010-1470-8 |
| `FeldmanCousins1998Unified` | G. J. Feldman and R. D. Cousins, “Unified approach to the classical statistical analysis of small signals,” *Phys. Rev. D* 57, 3873–3889 (1998) | https://doi.org/10.1103/PhysRevD.57.3873 |
| `KleinRoodman2005Blinding` | J. R. Klein and A. Roodman, “Blind analysis in nuclear and particle physics,” *Annual Review of Nuclear and Particle Science* 55, 141–163 (2005) | https://doi.org/10.1146/annurev.nucl.55.090704.151521 |
| `AppelquistCarazzone1975Decoupling` | T. Appelquist and J. Carazzone, “Infrared singularities and massive fields,” *Phys. Rev. D* 11, 2856 (1975) | https://doi.org/10.1103/PhysRevD.11.2856 |
| `Weinberg1979Phenomenological` | S. Weinberg, “Phenomenological Lagrangians,” *Physica A* 96, 327–340 (1979) | https://doi.org/10.1016/0378-4371(79)90223-1 |
| `FurnstahlEtAl2015EFTTruncation` | R. J. Furnstahl, N. Klco, D. R. Phillips, and S. Wesolowski, “Quantifying truncation errors in effective field theory,” *Phys. Rev. C* 92, 024005 (2015) | https://doi.org/10.1103/PhysRevC.92.024005 |
| `CERN2020OpenDataPolicy` | CERN, *CERN Open Data Policy for the LHC Experiments*, CERN-OPEN-2020-013 | https://doi.org/10.7483/OPENDATA.0XO6.HYY1 |
| `MaguireEtAl2017HEPData` | E. Maguire, L. Heinrich, and G. Watt, “HEPData: a repository for high energy physics data,” *J. Phys.: Conf. Ser.* 898, 102006 (2017) | https://doi.org/10.1088/1742-6596/898/10/102006 |
| `ATLAS2019FullLikelihoods` | ATLAS Collaboration, *Reproducing searches for new physics through publication of full statistical likelihoods*, ATL-PHYS-PUB-2019-029 | https://cds.cern.ch/record/2684863 |
| `SimkoEtAl2021DeclarativeWorkflows` | T. Šimko et al., “Scalable declarative HEP analysis workflows for containerised compute clouds,” *Frontiers in Big Data* 4, 661501 (2021) | https://doi.org/10.3389/fdata.2021.661501 |
| `PlompenEtAl2020JEFF33` | A. J. M. Plompen et al., “The joint evaluated fission and fusion nuclear data library, JEFF-3.3,” *EPJ A* 56, 181 (2020) | https://doi.org/10.1140/epja/s10050-020-00141-9 |
| `OECDNEA2023NuclearCovariance` | OECD Nuclear Energy Agency, *Investigation of Covariance Data in General Purpose Nuclear Data Libraries*, NEA/NSC/R(2021)4 | https://www.oecd-nea.org/jcms/pl_78107/investigation-of-covariance-data-in-general-purpose-nuclear-data-libraries |
| `DIN17025_2018` | DIN EN ISO/IEC 17025:2018-03, *General requirements for the competence of testing and calibration laboratories* | https://doi.org/10.31030/2731745 |
| `EU2013EuratomBSS` | Council Directive 2013/59/Euratom, basic safety standards for protection against ionising radiation | https://eur-lex.europa.eu/eli/dir/2013/59/oj |
| `Germany2017StrlSchG` | German Strahlenschutzgesetz, current official consolidated text | https://www.gesetze-im-internet.de/strlschg/BJNR196610017.html |
| `Germany2018StrlSchV` | German Strahlenschutzverordnung, current official consolidated text | https://www.gesetze-im-internet.de/strlschv_2018/BJNR203600018.html |

## Audit decision

1. **Classify current DFG 3.24 as dedicated, bounded coverage.** Do not relabel
   3.21; it is condensed-matter physics in the current DFG system.
2. **Add no principle and no candidate.** Triggering, calibration, unfolding,
   nuisance inference, blinding, multiple testing, preservation, symmetry, and
   effective theories all have mature homes.
3. **Route the experimental residue primarily to Candidate 014**, composed with
   Candidate 009 for claim/invalidation state, Candidate 010 for protected
   confirmation, Candidates 013/018 for conditional retention, and Candidate
   017 for reconstruction.
4. **Promote at most the eleven scoped central claims above.** The final one remains
   explicitly hypothetical until the eight workstation tracks beat their mature
   nulls.
5. **Use WS-PNF-01 through WS-PNF-08 as the deliverable.** The field earns its
   place in the project by making selection, response, search, simulation, and
   reconstructability failures executable—not by lending physics terminology to
   an architecture.

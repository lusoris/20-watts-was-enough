# Measurement-heavy science: analytical chemistry, water, and Earth observation

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-24
- **Scope:** analytical and food chemistry; chemical identity, speciation,
  fractionation, matrix effects, calibration, detection and quantification;
  sampling and interlaboratory comparison; hydrology, water treatment,
  groundwater, and limnology; ocean and atmospheric observation; geophysics,
  geodesy, and remote-sensing inversion
- **Evidence rule:** a sample, instrument indication, calibrated result,
  detection decision, mapped product, analysis field, reanalysis, retrieved
  geophysical variable, and latent environmental state are different records
- **Promotion state:** no new principle and no new candidate; nine scoped
  boundaries are reserved as [C-1377](#c-1377)--[C-1385](#c-1385) for central
  ledger integration
- **Execution state:** nine CPU-only synthetic falsification contracts are
  fully specified below; none is an implemented runner or empirical result
- **Repository constraint:** this audit is deliberately self-contained. It does
  not modify the central claim ledger, bibliography, coverage maps, indexes,
  application source, candidates, or experiment registries

## Normative-source header

- **Default jurisdiction:** European Union law and German implementation are
  the baseline. ISO, IEC, EN/DIN, JCGM, Eurachem, WMO, IOC/GOOS, GCOS, IERS,
  EUREF, and CEOS/QA4EO documents are used as scoped technical practice, not as
  laws unless a binding instrument, contract, accreditation scope, or
  conformity route invokes them.
- **EU water snapshot:** the Water Framework Directive 2000/60/EC and
  Groundwater Directive 2006/118/EC were checked in their consolidated forms
  current from 2026-05-10 after Directive (EU) 2026/805. Commission Directive
  2009/90/EC remains the technical source for chemical-analysis quality under
  Water Framework Directive monitoring. Directive (EU) 2020/2184 remains the
  drinking-water source for sampling points and analytical performance.
- **EU food snapshot:** Commission Implementing Regulation (EU) 2023/2782,
  applicable since 2024-04-01, replaced Regulation (EC) No 401/2006 for
  mycotoxin sampling and analysis. Regulation (EU) 2023/915 was checked in its
  current consolidated form. Implementing Regulation (EU) 2021/808 supplies a
  bounded, explicit matrix-effect and calibration example for pharmacologically
  active residues. Regulation (EU) 2017/625 governs official-control laboratory
  designation and method hierarchy when its scope applies.
- **German snapshot:** the LFGB was checked as amended on 2026-02-03; section 64
  anchors the official collection of sampling and examination procedures. The
  Groundwater Ordinance (GrwV) was checked as last amended in 2022 and the
  Surface Waters Ordinance (OGewV) in its current official online text.
- **Standards snapshot:** ISO/IEC 17025:2017, ISO 5725-1:2023,
  ISO/IEC 17043:2023, ISO 13528:2022 with Amendment 1:2026, ISO 17034:2016,
  ISO 19111:2019 with its published amendments, and ISO 19157-1:2023 were the
  evaluated editions. The 2026 draft revision of ISO 11843-1 was not treated as
  a published standard; detection terminology is instead tied to the published
  IUPAC recommendation, applicable law, and the current Eurachem guide.
- **Applicability hook:** unresolved. A binding conclusion requires the exact
  food or water matrix, analyte/species, lot and sampling target, laboratory and
  accreditation scope, intended decision, environmental compartment, observing
  programme, spatial product, actor, German competent authority, and market or
  regulatory use to be fixed first. This document is neither a conformity
  assessment nor legal advice.

## Executive finding

Measurement-heavy fields do not provide a new generic intelligence primitive.
They provide a severe test of whether the project can keep the **observation
operator** separate from the **latent state** it is asked to inform.

Nine boundaries survive field-specific review:

1. total element or nominal analyte amount does not identify chemical species,
   bioavailable fraction, extraction-defined fraction, or unchanged in-situ
   state;
2. detection, identification, quantification, and conformity are different
   decisions with different error contracts;
3. laboratory precision cannot repair an unrepresentative or transformed
   sample;
4. calibration traceability and interlaboratory agreement do not guarantee
   matrix fitness, adequate uncertainty, or absence of shared bias;
5. concentration at a point is not catchment load, stored mass, exposure, or
   treatment performance;
6. wells and lake profiles constrain support-weighted states under flow,
   stratification, mixing, reaction, and network design rather than revealing a
   unique subsurface or whole-lake field;
7. gridded ocean and atmospheric analyses combine heterogeneous observations,
   forward operators, priors, dynamics, selection, and quality control;
8. a coordinate, velocity, gravity/seismic estimate, or deformation field is
   qualified by reference frame, epoch, covariance, forward kernel, and inverse
   resolution; and
9. an Earth-observation pixel or retrieval is an instrument- and
   algorithm-dependent average, not a direct high-resolution sample of the
   target state.

The common chain is therefore:

```mermaid
flowchart LR
    X["Latent state<br/>species · field · history"]
    S["Sampling support<br/>where · when · what entered"]
    P["Preservation / preparation<br/>transport · extraction · conversion"]
    H["Observation operator<br/>instrument · PSF · response · geometry"]
    Y["Indication<br/>counts · volts · radiance"]
    C["Calibrated result<br/>unit · uncertainty · covariance"]
    I["Inverse / assimilation<br/>prior · dynamics · resolution"]
    D["Decision<br/>detect · quantify · classify · act"]
    V["Independent check<br/>reference · comparison · outcome"]

    X --> S --> P --> H --> Y --> C --> I --> D --> V
    V -. drift / mismatch / invalidation .-> S
    D -. adaptive sampling .-> S

    classDef latent fill:#4c1d95,stroke:#c4b5fd,color:#faf5ff;
    classDef sample fill:#164e63,stroke:#67e8f9,color:#ecfeff;
    classDef measure fill:#1e3a8a,stroke:#93c5fd,color:#eff6ff;
    classDef infer fill:#713f12,stroke:#fde047,color:#fffbeb;
    classDef decide fill:#7f1d1d,stroke:#fda4af,color:#fff1f2;
    classDef verify fill:#14532d,stroke:#86efac,color:#f0fdf4;
    class X latent;
    class S,P sample;
    class H,Y,C measure;
    class I infer;
    class D decide;
    class V verify;
```

Every edge has a version and a failure mode. A more accurate inverse cannot
recover a species destroyed during storage. A traceable calibration cannot make
one well representative of an aquifer. A finer grid cannot create spatial
resolution absent from the averaging kernel. A consensus among laboratories or
retrieval algorithms can retain a common calibration, matrix, or forward-model
bias.

## Construct firewall

### Analytical chemistry and food control

- **Analyte:** component represented by a name in the measurement procedure. It
  is not automatically a uniquely defined measurand.
- **Chemical species:** a specific form defined by isotopic composition,
  oxidation/electronic state, or molecular/complex structure. **Speciation
  analysis** identifies or measures species; **fractionation** classifies
  operationally defined groups through a declared procedure
  [@TempletonEtAl2000Speciation].
- **Total concentration:** sum under a stated material and procedure. It does not
  reveal the distribution among species or the state before preparation.
- **Matrix:** components other than the target analyte that can affect sampling,
  recovery, separation, response, or interference. A solvent calibration is not
  automatically transferable to a food, sediment, biota, or natural-water
  matrix [@MatuszewskiEtAl2003Matrix; @EU2021_808].
- **Recovery:** relation between measured and reference/spiked amount under a
  stated procedure. It is not proof that native analyte, spike, bound fraction,
  degradation product, and reference material behave identically.
- **Limit of detection:** a decision-capability statement against a blank or
  null under declared false-positive and false-negative conditions. It is not a
  universal property of an instrument [@Currie1995Detection].
- **Limit of quantification:** lowest level shown fit for a stated quantitative
  performance. A fixed multiple of blank standard deviation is one convention,
  not a context-free physical boundary [@EurachemValidation2025].
- **Identification:** evidence for chemical identity under declared selectivity
  criteria. It is not concentration, toxicity, legal non-compliance, or source
  attribution.
- **Conformity decision:** comparison with a requirement using a declared
  decision rule and uncertainty. It is not supplied by the displayed digits or
  calibration curve alone [@jcgm106].
- **Lot, incremental sample, aggregate sample, laboratory sample, test portion,
  and analytical result** are different physical and inferential levels. Current
  EU mycotoxin rules define and control those levels separately
  [@EU2023_2782].

### Water and Earth-system observation

- **Water level, head, discharge, concentration, load, flux, storage, residence
  time, and status class** are different quantities. For example, concentration
  has units kg/m$^3$ while load rate has units kg/s.
- **Monitoring point:** location and support of an observation. It is not a water
  body, aquifer, catchment, lake layer, air mass, ocean volume, or population.
- **Water-body status:** rule-governed assessment from a monitoring programme.
  It is not a single sample and does not imply that every point has the class
  [@EU2000_60_2026; @EU2006_118_2026].
- **Analysis:** state estimate produced by combining observations and a model at
  one time. **Reanalysis** repeats a consistent assimilation system across a
  historical record; neither is raw observation [@HersbachEtAl2020ERA5].
- **Coordinate:** ordered values in a coordinate system. Without coordinate
  reference system, datum/frame, coordinate epoch where applicable, and
  transformation provenance, it is not a unique Earth location
  [@ISO19111_2019; @EU1089_2010].
- **Spatial resolution:** ability to distinguish spatial structure under an
  observation and inverse operator. Pixel spacing, grid spacing, point-spread
  width, geolocation uncertainty, and inverse averaging-kernel width are not
  interchangeable.
- **Retrieved variable:** inverse estimate from measured radiance or another
  indirect observable. It is conditional on the forward model, nuisance state,
  prior or regularizer, quality screening, and algorithm version
  [@rodgers2000inverse; @QA4EO2009].
- **Validation:** comparison against a reference suitable for the declared
  measurand, support, scale, and conditions. Collocation is not equivalence, and
  a reference is not error-free by definition.

## Shared mathematical boundary

### A versioned observation operator precedes every inverse

For an observation $i$, write

$$
y_i = \mathcal{H}_i[x;\phi_i] + b_i + \epsilon_i,
$$

where $x(\mathbf r,t)$ is the latent state, $\mathcal H_i$ is the observation
operator, $\phi_i$ contains instrument, sampling, geometry, preparation, and
algorithm state, $b_i$ is bias in the same unit as $y_i$, and $\epsilon_i$ is
random error. For an average of a quantity that has the same unit as $x$,

$$
\mathcal H_i[x]
= \frac{1}{Z_i}
  \int_{T_i}\int_{V_i} K_i(\mathbf r,t)x(\mathbf r,t)
  \,\mathrm dV\,\mathrm dt,
\qquad
Z_i = \int_{T_i}\int_{V_i} K_i(\mathbf r,t)
  \,\mathrm dV\,\mathrm dt.
$$

$K_i$ is a non-negative support/response kernel, $V_i$ is volume in m$^3$,
$T_i$ is time in s, and $Z_i$ normalizes the weighted average. If $x$ is
kg/m$^3$, the normalized result is kg/m$^3$. A spectrometer, gravimeter, radar,
or radiometer generally maps state to a *different* observable and therefore
uses a dimension-bearing forward operator rather than this normalized average.

Two operators can yield the same reading for different states. The inverse is
therefore qualified by the null space, prior or regularizer, resolution, and
operator version; a small residual $y-\mathcal H(\hat x)$ is not uniqueness.

### Chemical species, preparation, and matrix response

For species $j=1,\ldots,J$ of one element or analyte family,

$$
c_T = \sum_{j=1}^{J} \nu_j c_j,
\qquad
\alpha_j = \frac{\nu_j c_j}{c_T},
\qquad
\sum_j \alpha_j = 1,
$$

where $c_j$ and total amount concentration $c_T$ are mol/m$^3$, $\nu_j$ is the
dimensionless number of target moieties represented by species $j$, and
$\alpha_j$ is dimensionless. Preparation can transform the vector:

$$
\mathbf c^{\mathrm{meas}}
= \mathbf R_{\mathrm{prep}}(\tau,T,\mathrm{pH},E_h)\mathbf c^{\mathrm{in\ situ}}
+ \mathbf q,
$$

where $\mathbf R_{\mathrm{prep}}$ is a dimensionless recovery/conversion matrix,
$\tau$ is time in s, $T$ is kelvin, pH is dimensionless, $E_h$ is volt, and
$\mathbf q$ is contamination in mol/m$^3$. A simplified response model is

$$
s = a + b\sum_j r_j c_j + \boldsymbol\gamma^\top\mathbf m + \epsilon,
$$

where $s$ and $a$ are instrument response units, $b$ has response units per
(mol/m$^3$), $r_j$ is relative species response, and $\mathbf m$ contains matrix
features with coefficients $\boldsymbol\gamma$ chosen to preserve response
units. Solvent calibration silently assumes that the relevant $r_j$, recovery,
interference, and matrix terms transfer.

### Detection and quantification are error contracts

Let $Y$ be a decision statistic and $y_C$ a critical value. A declared
false-positive probability $\alpha$ and false-negative probability $\beta$ at a
detection capability $x_D$ satisfy

$$
\Pr(Y>y_C\mid x=0)=\alpha,
\qquad
\Pr(Y\le y_C\mid x=x_D)=\beta.
$$

$x$ and $x_D$ carry the measurand unit; $Y$ may be a signal, concentration
estimate, or dimensionless statistic. Quantification additionally requires a
target such as maximum relative standard uncertainty,

$$
u_{\mathrm{rel}}(x)=\frac{u(x)}{|x|}\le u_{\mathrm{target}},
$$

where $u(x)$ has the same unit as $x$ and $u_{\mathrm{target}}$ is
dimensionless. Reporting every result below $x_D$ as zero changes the estimator,
distribution, trend, mass balance, and downstream inverse; it is not neutral
censoring.

### Sampling and analytical uncertainty occupy different levels

For lot or environmental target $l$, primary unit/site $p$, preparation $q$,
and replicate analysis $r$,

$$
z_{lpqr}=\mu+L_l+P_{p(l)}+Q_{q(lp)}+A_{r(lpq)},
$$

where every term has the measurand unit. Under an additive independent model,

$$
u^2_{\mathrm{target}}
=u^2_{\mathrm{between\ target}}
+u^2_{\mathrm{sampling}}
+u^2_{\mathrm{preparation}}
+u^2_{\mathrm{analysis}}.
$$

Covariance terms must be added when stages share equipment, calibration roots,
operators, sites, or time. The target definition determines whether spatial or
lot heterogeneity is part of the measurand or uncertainty. Eurachem explicitly
extends the measurement process through sampling and physical preparation when
the measurand is concentration in the sampling target rather than the delivered
laboratory sample [@EurachemSampling2019].

### Water storage and constituent mass must close

For a control volume with water storage $S$ in m$^3$,

$$
\frac{\mathrm dS}{\mathrm dt}
=\sum_i Q_i-\sum_o Q_o+P A-E A,
$$

where discharge $Q$ is m$^3$/s, precipitation and evapotranspiration rates
$P,E$ are m/s, and area $A$ is m$^2$. For constituent mass $M$ in kg,

$$
\frac{\mathrm dM}{\mathrm dt}
=\sum_i Q_i c_i-\sum_o Q_o c_o+R+J,
$$

where concentration $c$ is kg/m$^3$ and reaction/source terms $R,J$ are kg/s.
A point concentration does not determine the products $Qc$, integrated mass,
storage, exposure, or treatment removal. A treatment-stage removal fraction

$$
\eta_M=1-\frac{\int Q_{out}(t)c_{out}(t)\,\mathrm dt}
                   {\int Q_{in}(t)c_{in}(t)\,\mathrm dt}
$$

is dimensionless and requires aligned flow, concentration, time support, bypass,
and retained or transformed mass.

### Groundwater and lake observations are dynamics-filtered

A saturated groundwater head model can be written

$$
S_s\frac{\partial h}{\partial t}
=\nabla\cdot(\mathbf K\nabla h)+q_v,
$$

where specific storage $S_s$ is m$^{-1}$, head $h$ is m, hydraulic conductivity
$\mathbf K$ is m/s, and volumetric source per bulk volume $q_v$ is s$^{-1}$.
Solute transport may be represented as

$$
\frac{\partial(\theta c)}{\partial t}
=-\nabla\cdot(\mathbf q c-\theta\mathbf D\nabla c)+r_c,
$$

where water content $\theta$ is dimensionless, Darcy flux $\mathbf q$ is m/s,
dispersion $\mathbf D$ is m$^2$/s, $c$ is kg/m$^3$, and $r_c$ is
kg/(m$^3$ s). A well adds a screened-interval, pumping, borehole-storage, and
sampling operator.

For a lake layer $k$ of volume $V_k$ in m$^3$ and dissolved-oxygen
concentration $c_k$ in kg/m$^3$,

$$
\frac{\mathrm d(V_kc_k)}{\mathrm dt}
=\sum_j F_{jk}-\sum_j F_{kj}+G_k-R_k,
$$

where interlayer transport $F$, gas exchange $G$, and reaction/respiration $R$
are kg/s. A surface sample cannot identify hypolimnetic oxygen or mixing regime;
profile depth, season, stratification, ice cover, and sensor response matter
[@JaneEtAl2021Lakes; @WoolwayMerchant2019].

### Analysis fields retain model and observing-system dependence

A state-space assimilation step is

$$
\mathbf x_{t+1}=\mathcal M_t(\mathbf x_t)+\boldsymbol\eta_t,
\qquad
\mathbf y_t=\mathcal H_t(\mathbf x_t)+\boldsymbol\epsilon_t,
$$

with state propagation $\mathcal M_t$, observation operator $\mathcal H_t$,
model error $\boldsymbol\eta_t$, and observation error
$\boldsymbol\epsilon_t$. Components retain their native physical units;
covariance matrices therefore contain products of those units. An innovation

$$
\mathbf d_t=\mathbf y_t-\mathcal H_t(\mathbf x_t^f)
$$

diagnoses the forecast-observation mismatch, not which side is wrong. ERA5, for
example, assimilates an evolving mix of conventional and satellite observations
through a declared model and quality-control system [@HersbachEtAl2020ERA5].

### Reference frame and inverse resolution are part of the result

A simplified station trajectory is

$$
\mathbf r(t)=\mathbf r_0+\mathbf v(t-t_0)
+\sum_k\mathbf a_k\sin(\omega_k t)+\mathbf o(t)+\boldsymbol\epsilon(t),
$$

where position $\mathbf r$ and offsets $\mathbf o$ are m, velocity $\mathbf v$
is m/s, epoch $t$ is s or a declared coordinate-year convention, and angular
frequency $\omega$ is rad/s. ITRF2020 explicitly models positions, velocities,
periodic terms, discontinuities, and post-seismic deformation
[@AltamimiEtAl2023ITRF2020]. Comparing bare coordinates from different frames or
epochs can manufacture motion.

For a linearized geophysical inverse,

$$
\mathbf y=\mathbf G\mathbf m+\boldsymbol\epsilon,
\qquad
\hat m(r_0)=\int A(r_0,r)m(r)\,\mathrm dr,
$$

where rows of $\mathbf G$ are forward sensitivity kernels and $A$ is the inverse
averaging kernel. $A$ shows the spatial average actually resolved; model-grid
spacing does not [@backus1968resolution].

### Remote radiance and retrieval are not a pixel truth label

For a thermal spectral channel, a schematic top-of-atmosphere radiance is

$$
L^{TOA}_{\lambda}
=T^{\uparrow}_{\lambda}
 \left[\epsilon_{\lambda}B_{\lambda}(T_s)
 +\frac{\rho_{\lambda}T^{\downarrow}_{\lambda}E_{\lambda}}{\pi}\right]
+L^{path}_{\lambda},
$$

where radiance $L$ and Planck radiance $B$ are
W/(m$^2$ sr $\mu$m), transmittance $T^{\uparrow},T^{\downarrow}$, emissivity
$\epsilon$, and reflectance $\rho$ are dimensionless, surface temperature $T_s$
is K, irradiance $E$ is W/(m$^2$ $\mu$m), and $L^{path}$ is path radiance. The
sensor then applies spectral response, point-spread function, sampling,
geolocation, quantization, and calibration.

For a retrieval $\hat{\mathbf x}$ around a prior $\mathbf x_a$, the averaging
kernel

$$
\mathbf A=\frac{\partial\hat{\mathbf x}}{\partial\mathbf x}
$$

is dimensionless when estimate and state share units. In the linearized form

$$
\hat{\mathbf x}-\mathbf x_a
=\mathbf A(\mathbf x-\mathbf x_a)+\mathbf G_y\boldsymbol\epsilon,
$$

$\mathbf A$ separates measurement sensitivity from prior pull, and
$\mathbf G_y$ maps measurement error into state units
[@rodgers2000inverse].

## Deduplication against the existing project

No new `P-` entry survives. The measurement-heavy result is a field-complete
stress test for existing homes:

- [P-001 selective allocation](../principle-registry.md#p-001--selective-allocation)
  already owns adaptive allocation. Sampling design, station placement, and
  satellite tasking are mature optimal-design/value-of-information nulls.
- [P-007 prediction-error allocation](../principle-registry.md#p-007--prediction-error-allocation)
  already owns residual-driven sensing. Innovation magnitude alone cannot
  distinguish state change, operator drift, matrix mismatch, or model error.
- [P-009 maintenance plane](../principle-registry.md#p-009--maintenance-plane)
  already owns calibration, reference transfer, overlap, drift detection,
  reprocessing, and observation-network sustainment.
- [P-012 memory matched to information lifetime](../principle-registry.md#p-012--memory-matched-to-information-lifetime)
  already owns raw indications, calibration states, intermediate products,
  reference materials, and long-lived climate records at different update and
  retention rates.
- [P-013 externalized shared state](../principle-registry.md#p-013--externalized-shared-state)
  already owns shared observation archives, laboratory records, station
  metadata, calibration hierarchies, and reference-frame registries.

The residual routes are likewise already named:

- [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md)
  covers action-dependent monitoring, adaptive wells/stations, treatment
  feedback, and observing systems whose future sampling depends on prior
  estimates.
- [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md)
  covers grade-, version-, and evidence-qualified processing and release.
- [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md)
  is the direct home for specimen/support, preparation, calibration, forward
  operator, selection, uncertainty, covariance, reference frame, inverse, and
  dependency invalidation.

The strongest prior audit owners remain:

- [metrology and measurement science](2026-08-05-metrology-measurement-science.md)
  for measurand, calibration hierarchy, traceability, uncertainty, reference
  materials, interlaboratory comparison, and conformity decisions;
- [astronomy and remote inference](2026-08-05-astronomy-remote-inference.md)
  for forward models, inverse degeneracy, selection, non-detection, and
  versioned observation packets;
- [geology and geomorphology](2026-08-05-geology-geomorphology.md) for
  support-weighted geophysical/hydrologic inference and mixed clocks;
- [mineralogy, petrology, and geochemistry](2026-08-21-mineralogy-petrology-geochemistry.md)
  for groundwater redox/speciation, reactive transport, matrix-qualified
  reference materials, and geochronological inverse structure;
- [biotechnology, chemistry, and process systems](2026-08-21-biotechnology-chemistry-process-systems.md)
  for process measurement, mass closure, treatment-like transport/reaction, and
  optical proxy failure; and
- [Earth-system transition signals](2026-08-05-earth-system-transition-signals.md)
  for observation-operator-qualified dynamical warning claims.

This audit adds field depth and exact fixtures; it does not rename those
principles.

## Copy-ready central claims

### C-1377

- **Statement:** Chemical amount, identity, species distribution, and
  operationally defined fraction are distinct measurands. Sampling,
  preservation, preparation, interconversion, recovery, selectivity, matrix
  response, and calibration range determine which one an analytical result can
  support; a total-element or nominal-analyte result does not reconstruct the
  unchanged in-situ species vector.
- **Evidence status:** established analytical-chemistry boundary; the proposed
  systems transfer is plausible but unvalidated.
- **Primary/authoritative sources:** `TempletonEtAl2000Speciation`,
  `MatuszewskiEtAl2003Matrix`, `EU2021_808`, `EurachemValidation2025`,
  `jcgm200`.
- **Rationale:** IUPAC distinguishes species and operational fractions; current
  EU residue rules explicitly define matrix effects and require matrix,
  interference, stability, and validation checks; VIM ties a result to a
  specified measurand and procedure.
- **Proposed AI translation:** attach identity, support, preparation and response
  operators to every chemical/environmental feature instead of treating a
  column name or sensor channel as latent-state truth.
- **Efficiency mechanism:** avoid training, routing, or follow-up on analytically
  non-equivalent values; reuse an observation only while its operator and
  applicability roots remain valid.
- **Failure modes:** species conversion during storage; extraction-dependent
  fraction presented as total; matrix suppression/enhancement; unmatched spike;
  isomer/interference; calibration extrapolation; learned correction hiding a
  changed preparation path.
- **Measurable prediction:** in held-out matrix and preparation shifts, an
  operator-bound model will reduce species-specific false decisions and
  miscalibration relative to solvent-calibrated or label-only models, while a
  complete matrix-matched analytical null may erase the proposed systems gain.
- **Open question:** does the versioned dependency record improve decisions
  beyond matrix-matched calibration, internal standards, standard addition,
  isotope dilution, validated speciation models, and ordinary laboratory
  provenance at equal sample and labour cost?
- **Used by:** [this audit](#ws-meao-01--speciation-preparation-and-matrix-transfer),
  [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1378

- **Statement:** Detection, identification, quantification, and conformity are
  separate decisions. A detection capability is conditional on blank/null,
  decision statistic, calibration and variance model, declared false-positive
  and false-negative probabilities, matrix, procedure, and time; a
  quantification limit additionally requires fit-for-purpose bias/precision or
  uncertainty, and neither limit alone decides compliance.
- **Evidence status:** established.
- **Primary/authoritative sources:** `Currie1995Detection`,
  `EurachemValidation2025`, `EU2009_90`, `EU2023_2782`, `jcgm106`.
- **Rationale:** IUPAC supplies the critical-value/detection-capability error
  structure; current EU water and food instruments define scoped performance
  and decision rules rather than one universal signal multiple.
- **Proposed AI translation:** represent observations below, near, and above a
  decision boundary with likelihood/censoring and decision provenance instead
  of zero filling or a global confidence threshold.
- **Efficiency mechanism:** reserve confirmatory work for cases where it can
  change the decision while preventing cheap screening from masquerading as a
  quantitative result.
- **Failure modes:** blank contamination; heteroscedasticity; multiple analytes;
  calibration drift; treating non-detect as zero; deriving LOQ from instrument
  noise only; double use of confirmation data; changing the decision threshold
  after viewing results.
- **Measurable prediction:** probability-calibrated detection plus explicit
  quantification and conformity stages will meet preregistered error rates under
  low-level heteroscedastic and censored data more often than fixed
  signal-to-noise cut-offs.
- **Open question:** can a learned cascade beat current statistical detection,
  validated screening/confirmation, and conformity-decision practice after
  confirmation load, false negatives, and uncertainty are charged?
- **Used by:** [this audit](#ws-meao-02--detection-quantification-and-censoring),
  [Candidate 010](../../experiments/candidates/010-reset-coupled-staged-verification.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1379

- **Statement:** An analytical result for a delivered test portion does not by
  itself establish the property of a food lot, water body, sediment, soil, or
  other sampling target. Target definition, frame, increment/site selection,
  spatial and temporal support, aggregation, homogenization, preparation,
  preservation, rejected or inaccessible units, and sampling uncertainty are
  part of the inference.
- **Evidence status:** established.
- **Primary/authoritative sources:** `EurachemSampling2019`, `EU2023_2782`,
  `EU2017_625`, `DE_LFGB_2026`, `EU2000_60_2026`.
- **Rationale:** Eurachem explicitly includes sampling and preparation in the
  measurement process for target-level measurands; current EU mycotoxin rules
  distinguish lot, increments, aggregate, and laboratory sample because
  contamination can be highly heterogeneous.
- **Proposed AI translation:** keep the population/target, acquisition design,
  accessible frame, physical aggregation, and test portion as typed levels;
  never split nested units across training and confirmation.
- **Efficiency mechanism:** spend laboratory assays on designs that reduce
  target-level decision uncertainty rather than increasing replicate precision
  on one convenience sample.
- **Failure modes:** clustered contamination; seasonal aliasing; sampler access
  bias; inadequate increments; segregation during transport; incomplete
  homogenization; compositing that hides extremes; pseudo-replication;
  laboratory-only uncertainty budget.
- **Measurable prediction:** target-aware hierarchical sampling will reduce lot-
  or water-body false release/classification at equal analytical count compared
  with convenience sampling; if the applicable prescribed or mature design
  matches it, no project residual survives.
- **Open question:** when does adaptive sampling improve a declared decision
  without making future observations endogenous or violating a prescribed
  official-control plan?
- **Used by:** [this audit](#ws-meao-03--lot-and-environmental-sampling),
  [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1380

- **Statement:** Metrological traceability, suitable reference material,
  method validation, within-laboratory quality control, interlaboratory
  comparison, proficiency testing, and fitness for the intended matrix and
  decision are distinct evidence. Agreement or a consensus assigned value can
  retain shared calibration, method, commutability, matrix, or preparation bias.
- **Evidence status:** established measurement-science boundary.
- **Primary/authoritative sources:** `jcgm200`, `iso17025`, `iso17034`,
  `iso17043`, `iso13528`, `ISO13528_Amd1_2026`, `BIPM_CCQM_2026`.
- **Rationale:** VIM says traceability does not guarantee adequate uncertainty or
  absence of mistakes; ISO standards allocate different roles to laboratories,
  reference-material producers, PT providers, and PT statistics; CCQM runs
  matrix- and measurand-specific comparisons rather than granting universal
  chemical equivalence.
- **Proposed AI translation:** model calibration ancestry as a covariance and
  applicability graph, not a binary `calibrated` flag or an assumption that
  independent organisations have independent errors.
- **Efficiency mechanism:** target independent comparisons at unshared roots and
  invalidate only descendants affected by a changed standard, material,
  software, or matrix scope.
- **Failure modes:** common calibrator bias; non-commutable CRM; consensus of
  similarly biased methods; PT item unlike routine samples; laboratory ranking
  without uncertainty; reference drift; duplicated nominally independent roots.
- **Measurable prediction:** root-aware hierarchical comparison will produce
  better interval coverage and shared-bias alarms than independence-assuming
  pooling under seeded common-mode failures, but should tie a complete
  covariance-aware metrology null.
- **Open question:** can dependency invalidation reduce revalidation work without
  missing correlated descendants compared with ordinary LIMS/QMS, calibration
  hierarchy, PT, and uncertainty records?
- **Used by:** [this audit](#ws-meao-04--calibration-hierarchy-and-interlaboratory-comparison),
  [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1381

- **Statement:** Point concentration, discharge, constituent load, stored mass,
  exposure, water-body status, treatment-stage removal, transformation product,
  and compliance at a defined point are different quantities. Hydrologic and
  treatment claims require aligned flow, volume, residence time, reaction,
  bypass, sampling support, uncertainty, and mass-balance boundaries.
- **Evidence status:** established conservation and regulatory measurement
  boundary; transfer benefit remains untested.
- **Primary/authoritative sources:** `WMO168_2008`, `EU2000_60_2026`,
  `EU2009_90`, `EU2020_2184`, `DE_OGewV_2016`.
- **Rationale:** WMO hydrological practice distinguishes measured hydrological
  variables and network-derived information; EU water law defines monitoring,
  status, sampling points, analytical performance, and treatment-qualified
  drinking-water compliance at different levels.
- **Proposed AI translation:** enforce unit-bearing water and constituent
  balance nodes before learning residual corrections or action policies.
- **Efficiency mechanism:** diagnose which unmeasured flux, reaction, or support
  dominates a decision before adding sensors or model capacity.
- **Failure modes:** concentration/load confusion; storm aliasing; discharge and
  chemistry sampled at different times; unrecorded bypass; species conversion;
  retained mass later released; apparent removal caused by dilution; sampling
  upstream of the actual point of compliance.
- **Measurable prediction:** a conservation- and operator-aware model will
  improve held-out load, storage, and breakthrough prediction over
  concentration-only models, particularly during pulses and flow changes; a
  standard calibrated state-space/process model may fully match it.
- **Open question:** does the versioned observation contract add anything after
  full mass balance, residence-time distribution, reaction/transport modelling,
  process monitoring, and decision-specific sampling are present?
- **Used by:** [this audit](#ws-meao-05--catchment-load-and-treatment-breakthrough),
  [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1382

- **Statement:** Groundwater wells and lake samples/profiles constrain a
  support-weighted state under heterogeneous flow, screened interval, pumping,
  transport, reaction, stratification, mixing, season, depth, and network
  design; they do not identify a unique aquifer field, whole-lake state, source,
  or trend without an explicit forward model and support analysis.
- **Evidence status:** established inverse/support boundary with field-specific
  primary evidence.
- **Primary/authoritative sources:** `beven1989hydrology`,
  `bloeschl1995scale`, `EU2006_118_2026`, `DE_GrwV_2022`,
  `JaneEtAl2021Lakes`, `WoolwayMerchant2019`.
- **Rationale:** hydrological models are scale- and structure-qualified; current
  EU/German groundwater rules require coherent representative networks rather
  than equating one point with a body; lake oxygen and mixing evidence depends
  on depth profiles and temporal structure.
- **Proposed AI translation:** expose observability and support maps, competing
  model families, and abstention regions alongside interpolated latent fields.
- **Efficiency mechanism:** allocate wells, profiles, or sampling times to
  decision-relevant unresolved modes rather than uniformly densifying a grid.
- **Failure modes:** equifinality; anisotropy; preferential flow; well mixing;
  pumping-induced capture; seasonally aliased trends; surface-only lake sample;
  moving thermocline; sensor fouling; network changes mistaken for state change.
- **Measurable prediction:** support-aware ensembles will improve predictive
  coverage at held-out wells/depths and abstain in unresolved modes more
  reliably than smooth interpolation; adaptive placement must beat conventional
  optimal design at equal field cost.
- **Open question:** can active sampling avoid self-confirming models when the
  sampling action changes local flow, mixes a well, or preferentially observes
  predicted anomalies?
- **Used by:** [this audit](#ws-meao-06--groundwater-and-lake-observability),
  [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1383

- **Statement:** Oceanic or atmospheric observation, quality-controlled
  observation, gridded product, analysis, and reanalysis are distinct. A field
  estimate is conditional on platform and instrument mix, sampling support,
  calibration and drift, selection/quality control, observation operator,
  background dynamics, error covariance, assimilation version, and changing
  observing-system coverage.
- **Evidence status:** established observing-system and data-assimilation
  boundary.
- **Primary/authoritative sources:** `WongEtAl2020Argo`, `GOOS_EOV_2026`,
  `WMO_GAW_QA_2026`, `GCOS_ECV_2026`, `Evensen1994EnKF`,
  `HersbachEtAl2020ERA5`.
- **Rationale:** Argo documents changing coverage, vertical resolution, sensor
  issues, and QC; GOOS/GCOS/WMO define requirements, metadata, calibration,
  overlap, and network quality; ERA5 explicitly combines an evolving observing
  system with model and assimilation machinery.
- **Proposed AI translation:** bind training examples and trend claims to the
  observing-system and assimilation vintage that generated them; retain raw or
  lower-level evidence for independent checks.
- **Efficiency mechanism:** reprocess only affected products after operator or
  calibration change and prioritize observations by forecast/decision value
  under coverage constraints.
- **Failure modes:** platform drift; coverage shift manufacturing a trend;
  correlated satellite channels; rejected observations omitted from lineage;
  bias correction anchored to a changing subset; reanalysis grid treated as
  measured truth; extreme smoothing; model error absorbed as observation bias.
- **Measurable prediction:** version-aware assimilation will reduce false trends
  and interval undercoverage during seeded network transitions; if standard
  observing-system experiments and covariance-aware assimilation match it, the
  project-specific layer should be retired.
- **Open question:** how much lifecycle benefit remains after mature WIGOS/GAW,
  GOOS/Argo, GCOS, data-assimilation, bias-correction, and reprocessing practice?
- **Used by:** [this audit](#ws-meao-07--ocean--atmosphere-analysis-under-network-change),
  [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1384

- **Statement:** A geodetic coordinate or velocity and a geophysical inverse
  estimate are qualified by reference system/frame, realization, epoch, station
  motion and discontinuities, transformation, covariance, forward sensitivity
  kernel, regularization or prior, null space, and averaging-kernel resolution;
  coordinate or model-grid precision does not establish physical accuracy or
  resolving power.
- **Evidence status:** established.
- **Primary/authoritative sources:** `IERS2010Conventions`,
  `AltamimiEtAl2023ITRF2020`, `EUREF_ETRS89`, `ISO19111_2019`,
  `EU1089_2010`, `backus1968resolution`.
- **Rationale:** IERS/ITRF/EUREF define time-dependent reference realization;
  ISO and INSPIRE require reference-system metadata; Backus--Gilbert shows that
  inverse results are spatial averages determined by data kernels and the
  resolution--variance trade-off.
- **Proposed AI translation:** treat frames, epochs, transformations, covariance,
  forward kernels, and averaging kernels as executable dependencies of every
  spatial feature and learned target.
- **Efficiency mechanism:** prevent expensive retraining and false anomaly
  response caused by coordinate/frame mismatch; localize which inverse modes
  justify further observations.
- **Failure modes:** mixed ETRS89/ITRF/WGS84-like realizations; missing coordinate
  epoch; equipment or earthquake offset fitted as velocity; diagonal covariance
  assumption; over-regularized field; fine output grid sold as fine resolution;
  shared reference-station error.
- **Measurable prediction:** frame- and kernel-aware models will sharply reduce
  false deformation/anomaly calls and provide calibrated coverage during frame,
  station, and operator changes; complete geodetic and inverse-theory nulls
  should already obtain most of the gain.
- **Open question:** does cross-layer invalidation catch materially more
  descendants than established reference-frame registries, covariance-aware
  adjustment, geospatial metadata, and inverse-resolution reporting?
- **Used by:** [this audit](#ws-meao-08--reference-frame-and-geophysical-resolution),
  [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1385

- **Statement:** An Earth-observation pixel, fundamental data record, thematic
  product, and retrieved geophysical state are different levels. Spectral
  response, radiometric calibration, point-spread function, sampling and
  geolocation, atmosphere/cloud and surface nuisance state, sub-pixel mixture,
  forward model, prior/training support, quality screening, retrieval version,
  averaging kernel, and validation support bound the inference.
- **Evidence status:** established remote-sensing/metrology boundary; learned-
  system lifecycle benefit is speculative.
- **Primary/authoritative sources:** `rodgers2000inverse`, `QA4EO2009`,
  `GasconEtAl2017Sentinel2`, `ISO19157_1_2023`, `EU2007_2_2024`.
- **Rationale:** optimal-estimation theory exposes prior sensitivity and
  averaging kernels; QA4EO requires measurand, traceability, uncertainty, and
  product-level quality; Sentinel-2 calibration/validation demonstrates the
  distinct radiometric, geometric, and product checks in a European mission.
- **Proposed AI translation:** train against the forward observation and support
  model, retain per-example product/operator version, and score retrieval at its
  actual averaging support rather than against a nominal pixel label.
- **Efficiency mechanism:** route high-cost correction or independent reference
  acquisition only where nuisance uncertainty or decision value warrants it;
  reuse products only inside validated support.
- **Failure modes:** cloud screening selection; atmospheric-correction error;
  adjacency; sub-pixel mixture; PSF/grid confusion; geolocation mismatch;
  prior-dominated retrieval; synthetic-to-real forward-model gap; validation at
  unmatched support; confident learned inverse outside training physics.
- **Measurable prediction:** a forward/operator-aware hybrid will improve
  uncertainty calibration and false-change control under atmosphere, mixture,
  and prior shifts compared with a pixel-label inverse; it must beat calibrated
  optimal estimation and QA4EO-style product practice, not only a naive network.
- **Open question:** is there a systems residual after mature radiative transfer,
  optimal estimation, Cal/Val, uncertainty propagation, analysis-ready data,
  and versioned geospatial metadata are composed?
- **Used by:** [this audit](#ws-meao-09--remote-sensing-retrieval-and-effective-resolution),
  [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

## Workstation falsification contracts

These are executable-design descriptions, not results. They use synthetic truth
only to test logical identifiability, error propagation, calibration, resource
accounting, and transfer claims before any field, laboratory, regulated, or
satellite validation is attempted. Synthetic success cannot establish external
validity or replace an applicable prescribed method.

### Common execution and confirmation contract

- **Compute boundary:** CPU only; IEEE-754 binary64 for generator truth and
  reference calculations; no GPU or network call during a run. Record CPU model,
  physical/logical cores, RAM, OS, runtime and package lock, BLAS backend, thread
  counts, wall time, peak resident memory, and whole-system energy only when a
  supported meter is available. Each confirmatory protocol must fit within
  16 GiB peak RAM and 12 wall-clock hours on the declared workstation or be
  rejected as not workstation-ready.
- **Determinism:** use PCG64DXSM or a documented bit-identical replacement.
  Namespace every stream by protocol, generator family, arm, and seed. Generator
  streams are common across arms; fitting and stochastic-policy streams are
  separated so an arm cannot change the simulated world by consuming more
  random numbers.
- **Smoke seeds:** decimal seeds `11` and `29` for every generator family. Smoke
  output can validate schemas and invariants only.
- **Development seeds:** decimal seeds `10001` through `10040`; they may be used
  for implementation, threshold sanity checks, and tuning. They never enter a
  confirmation estimate.
- **Confirmation seeds:** 80 unique unsigned 64-bit values per protocol. Before
  final code freeze, a person not tuning the methods generates the file,
  commits its SHA-256 digest and row count, and withholds its contents. After the
  implementation, environment lock, metrics, exclusions, and gates are signed,
  the seed file is revealed and its digest verified. No confirmation seed is
  rerun with changed code; defects trigger a versioned restart of the complete
  protocol.
- **Independent units:** the physical target is the split unit: lot, catchment,
  aquifer/lake, observing-system episode, station network, or remote-sensing
  scene. Replicates, pixels, increments, depths, stations, spectra, and time
  points from one target never cross fit/tune/confirmation partitions.
- **Generator split:** every protocol names four mechanism families unless it
  explicitly names two composite domains. For four-family protocols, allocate
  20 confirmation seeds per family; for two-domain protocols, allocate 40 per
  domain and balance the hostile subfamilies within domain. Generator parameters
  for confirmation are drawn from preregistered ranges but use unseen joint
  combinations and at least one held-out mechanism form.
- **Parity:** arms receive identical raw observable support, train/validation
  targets, tuning calls, and total CPU-seconds unless an added measurement,
  reference, assay, station, or metadata field is the intervention being priced.
  Charge sample/assay count, reference-material use, sensing time, storage,
  communication, analyst-review proxy minutes, confirmation load, false action,
  and measured joules separately. Oracle arms are diagnostic ceilings and never
  eligible for promotion.
- **Statistics:** retain every seed. Report paired seed-level effects against the
  strongest tuned mature null, medians, 5th/95th percentiles, and two-sided 95%
  percentile bootstrap intervals with 10,000 resamples of independent units.
  Apply Holm correction across the nine protocol-level primary promotion tests.
  For nominal 95% intervals, the default acceptable empirical coverage band is
  92--98%; report interval width and conditional coverage by hostile family.
- **Protected outcomes:** a primary average cannot compensate for a worse false-
  release/non-compliance rate, mass-balance violation, unreported null-space
  mode, extreme-event miss, reference-frame false alarm, or undercoverage. Each
  protocol gives its non-inferiority margin. Report the complete Pareto vector,
  not only a weighted score.
- **Threshold meaning:** numeric gates below are experiment-selection criteria,
  not natural constants, legal tolerances, or claims of expected improvement.
  Freeze them before confirmation and publish failures unchanged.
- **Artifacts:** retain `run-manifest.json`, generator and arm configuration,
  signed code/environment digest, sealed-seed digest and revealed seed file, raw
  latent truth, raw indications, operator/preparation/calibration versions,
  rejected/censored observations, fit state, per-target predictions and
  decisions, uncertainty/covariance outputs, resource telemetry, exception log,
  aggregate tables, plots, and SHA-256 checksums. Store smoke, development, and
  confirmation roots separately.
- **Global rejection:** reject a transfer if a mature null reaches the same
  protected-outcome/resource frontier, gains require oracle truth or leaked
  confirmation structure, invariants fail, results depend on deleting failed
  seeds, or the added record improves confidence language without improving a
  decision or exposing a reproducible invalid inference.

### WS-MEAO-01 — Speciation, preparation, and matrix transfer

- **Claim/hypothesis:** C-1377. A species- and operator-bound record should
  reduce false species-specific decisions after matrix and preparation shift;
  the project layer earns no residual if complete analytical practice matches
  it.
- **Independent unit and size:** one synthetic sample target. Per seed generate
  1,200 targets: 600 fit, 200 tuning, and 400 held-out. No aliquot or replicate
  from one target crosses a split.
- **Generator families:** (1) equilibrium species with pH/ligand variation;
  (2) kinetically trapped species with storage-time conversion; (3) extraction-
  defined fractions with species-dependent recovery; and (4) LC/ICP/MS-like
  matrix suppression/enhancement plus an isobaric/interfering component.
  Generate 3--8 species at 0.01--100 $\mu$mol/L, preparation recoveries
  0.35--1.15, matrix response multipliers 0.45--1.55, 0--5% carry-over, and
  heteroscedastic response noise of 0.5--12% relative plus a response-unit
  floor. Confirmation holds out one conversion network and one nonlinear matrix
  response form.
- **Observations:** solvent standards, declared matrix-matched standards,
  procedural blanks, spikes, optional internal standard, storage/preparation
  metadata, and instrument response. Extra standards and replicates are charged.
- **Arms and mature nulls:** (A) solvent calibration on nominal total analyte;
  (B) strongest conventional stack selected on development data from matrix-
  matched calibration, standard addition, internal standard/isotope-dilution
  analogue, recovery correction, and validated working range; (C) versioned
  species-level preparation/response forward model with applicability and
  invalidation; (D) robust hierarchical calibration with matrix random effects;
  (E) true species/preparation state, diagnostic only.
- **Perturbations:** matrix class, ionic/organic load, pH, storage time and
  temperature, spike/native non-equivalence, interference abundance,
  calibration-root shift, missing metadata, and species outside the calibrated
  support.
- **Metrics:** species MAE and RMSE in $\mu$mol/L; total-analyte mass-balance
  error in $\mu$mol/L and percent; nominal-95% coverage and interval width;
  calibration slope/intercept; wrong above/below species-threshold decisions per
  1,000 targets; abstentions; standards, blanks, spikes and instrument injections
  per target; CPU-s, MiB, review-proxy minutes, and measured J/accepted result.
- **Invariant checks:** generator species mass closes to relative $10^{-10}$
  before contamination; forward recomputation matches stored indication to
  relative $10^{-9}$; unit conversion round-trips to relative $10^{-12}$.
- **Promotion gate:** C must reduce wrong species-threshold decisions by at least
  20% relative to B with Holm-adjusted 95% interval excluding zero, keep
  coverage in 92--98%, keep total-analyte absolute bias no worse than B by more
  than 0.2 pooled standard deviations, and use no more than 1.25 times B's total
  injections plus review cost.
- **Rejection gate:** reject the residual if B or D meets the same frontier; if
  C wins only with true conversion constants unavailable from observations; if
  abstention hides more than 10% of the held-out targets without a preregistered
  fallback; or if total performance improves while a held-out hazardous species
  has worse false-negative risk by over 0.5 percentage points.
- **Required artifacts:** species/reaction graph, in-situ and post-preparation
  vectors, calibration and matrix roots, every blank/spike/standard, response
  residual plots by matrix and concentration, decision confusion matrices, and
  resource ledger.

### WS-MEAO-02 — Detection, quantification, and censoring

- **Claim/hypothesis:** C-1378. Explicit critical-value, detection-power,
  quantitative-performance, and conformity stages should control seeded error
  rates better than fixed signal-to-noise thresholds and zero substitution.
- **Independent unit and size:** one analytical sequence with its own blanks,
  calibration, drift, and 2,000 unknown samples; generate 100 fit sequences, 40
  tuning sequences, and 100 confirmation sequences per seed.
- **Generator families:** (1) homoscedastic Gaussian response; (2)
  concentration-dependent variance; (3) blank contamination and batch drift;
  and (4) skew/heavy-tail response with interfering peaks. True concentration is
  a mixture containing exactly-zero samples, a log-uniform near-zero component
  from 0.1 to 3 nominal detection units, a working-range component, and 1%
  out-of-range samples.
- **Arms and mature nulls:** (A) fixed three-sigma detection, ten-sigma LOQ, and
  substitution of non-detects with zero; (B) IUPAC/ISO-style calibrated critical
  value and minimum detectable value with declared $\alpha=\beta=0.05$ plus a
  validated quantitative working range; (C) probability-of-detection and
  heteroscedastic calibration model with censored likelihood, separate identity/
  quantity/conformity decisions, and confirmatory test routing; (D) strongest
  conventional censored/hurdle regression and decision-rule stack; (E) true
  concentration, diagnostic only.
- **Perturbations:** blank count, low-level replicate count, calibration spacing,
  drift slope, contamination bursts, interference prevalence, matrix response,
  number of analytes (1, 8, 64), confirmation capacity, and specification
  distance from the detection region.
- **Metrics:** empirical false-positive $\hat\alpha$ and false-negative
  $\hat\beta$ at the declared boundary; identification error; MAE and relative
  bias by concentration decile; nominal-95% coverage; false conformity and false
  non-conformity per 10,000; trend bias after censoring; confirmations per 1,000;
  turnaround proxy-minutes; CPU-s, MiB, and J/result.
- **Invariant checks:** injected zero mass and concentration distribution match
  manifest within Monte Carlo tolerance; calibration fit never sees unknown
  truth; all reported inequalities preserve the concentration unit and original
  censoring direction.
- **Promotion gate:** C must keep both $\hat\alpha$ and $\hat\beta$ in 0.035--0.065
  for the preregistered nominal-0.05 boundary in every non-adversarial family,
  achieve 92--98% interval coverage, reduce false conformity by at least 15%
  relative to the strongest of B/D with adjusted interval excluding zero, and
  not increase confirmations by more than 20%.
- **Rejection gate:** reject if B/D matches the frontier; if C tunes the critical
  value on unknown truth; if undercoverage occurs in any held-out near-limit
  stratum; if multiple-analyte false positives are hidden by per-analyte
  reporting; or if zero substitution performs equally after the full downstream
  task is scored.
- **Required artifacts:** blank and calibration sequences, decision-statistic
  distributions, power curves, censoring maps, coverage-by-concentration plots,
  conformity tables, confirmation queue, and all adjusted/unadjusted tests.

### WS-MEAO-03 — Lot and environmental sampling

- **Claim/hypothesis:** C-1379. Target-level hierarchical sampling should beat
  convenience sampling; a project-specific adaptive design must additionally
  beat the applicable prescribed template or mature survey-sampling null without
  weakening due-process or protected decisions.
- **Independent unit and size:** one food lot or one bounded environmental
  target. Per seed simulate 800 targets: 300 food lots, 300 spatial water/
  sediment targets, and 200 mixed hostile targets. Each contains 10,000--100,000
  primary particles/cells or a continuous field discretized only for truth.
- **Generator families:** (1) well-mixed lognormal concentration; (2) rare
  clustered mycotoxin-like hotspots; (3) stratified gradient plus inaccessible
  units; and (4) pulsed spatial-temporal environmental contamination with
  seasonal/event aliasing. Preparation adds segregation, comminution,
  homogenization, subsampling, recovery, and analytical error.
- **Arms and mature nulls:** (A) one convenience grab plus laboratory replicates;
  (B) simple random equal-mass increments; (C) parameterized current
  EU-2023/2782-style lot/sublot/increment/aggregate/laboratory-sample template
  where applicable and a conventional probability/stratified design elsewhere;
  (D) hierarchical risk-based/adaptive design with target/support record and
  priced accessibility; (E) complete target, diagnostic only. D is never
  presented as a substitute for a legally required plan.
- **Budgets:** 1, 3, 10, 30, or 100 increments/sites; fixed total sampled mass of
  1 kg or a normalized environmental equivalent for the main comparison; 1--8
  analytical test portions; sampling travel and preparation proxy cost declared
  before tuning.
- **Perturbations:** hotspot fraction and correlation length, particle-size
  segregation, gradient direction, inaccessible share, mixing efficacy,
  sampler bias, storm timing, composite duration, preservation loss, analytical
  precision, and threshold distance.
- **Metrics:** target-mean and 95th-percentile error in mg/kg or mg/L; false lot
  acceptance/rejection per 1,000; water-body false class per 1,000; nominal-95%
  coverage; hotspot detection; sampled mass, increments/sites, travel km proxy,
  preparation and assay minutes; sample bytes; CPU-s and J/decision.
- **Invariant checks:** complete target mass and hotspot membership are fixed
  before sampling; combined increments equal recorded aggregate mass to relative
  $10^{-12}$; no analytical replicate is counted as an independent target
  sample.
- **Promotion gate:** D must reduce false target acceptance/classification by at
  least 15% relative to C with adjusted interval excluding zero at identical
  sampled mass and assay count, while the upper 95% interval for added false
  rejection stays below 1.0 percentage point and total sampling/preparation cost
  stays within 1.20 times C.
- **Rejection gate:** reject the residual if C or a standard stratified design
  matches it; if D uses target truth, future events, or unpriced access; if
  adaptive selection biases the reported prevalence/trend; or if benefit occurs
  only by changing the target definition after sampling.
- **Required artifacts:** full target truth, accessible frame, spatial/lot map,
  increment and aggregation lineage, sample masses, inaccessible/rejected units,
  preparation tree, sampling-uncertainty decomposition, and decision maps.

### WS-MEAO-04 — Calibration hierarchy and interlaboratory comparison

- **Claim/hypothesis:** C-1380. Explicit shared-root covariance and matrix scope
  should prevent false assurance from laboratory consensus; it creates no new
  mechanism if mature metrological comparison already does so.
- **Independent unit and size:** one comparison round for one material/measurand.
  Simulate 24--80 laboratories, 4--12 calibration-root groups, 6 routine matrix
  classes, and 12 blinded materials per round; 300 fit/tuning rounds and 200
  held-out rounds per seed.
- **Generator families:** (1) independent laboratory bias; (2) shared calibrator
  bias; (3) non-commutable or matrix-mismatched reference material; and (4)
  common method/preparation bias with apparently tight consensus. Add lab random
  effects, reported uncertainty miscalibration, transcription errors, and
  occasional contamination.
- **Arms and mature nulls:** (A) unweighted consensus mean and between-lab SD;
  (B) robust ISO-13528-style assigned value/z-score practice with declared
  uncertainty; (C) traceable reference value plus conventional ISO 5725/PT
  analysis; (D) root-, matrix-, and covariance-aware hierarchical model with
  applicability/invalidation graph; (E) true material values and biases,
  diagnostic only.
- **Perturbations:** number and concentration of shared roots, CRM homogeneity and
  commutability, matrix distance, lab uncertainty quality, dominant-method
  fraction, reference drift, missing lineage, and maliciously copied metadata.
- **Metrics:** assigned-value bias in mg/kg; nominal-95% coverage and width;
  shared-root shift recall/false-alarm; incorrectly accepted/rejected laboratories
  per 100; routine-sample prediction RMSE; affected-descendant precision/recall;
  reference measurements, analyst proxy-hours, storage bytes, CPU-s, and J/round.
- **Invariant checks:** calibration graph is acyclic and all simulated laboratory
  results reconcile with stored root plus local effects to relative $10^{-10}$;
  oracle root labels are inaccessible to deployable arms.
- **Promotion gate:** D must attain 92--98% coverage, detect at least 80% of
  shared shifts greater than one declared PT SD at no more than 5% false alerts,
  reduce wrong laboratory qualification by at least 20% relative to the
  strongest of B/C with adjusted interval excluding zero, and keep review cost
  within 1.25 times C.
- **Rejection gate:** reject if C with conventional covariance/sensitivity
  analysis matches D; if D assumes correct ancestry unavailable in practice; if
  copied lineage is treated as truth; if routine-matrix prediction does not
  improve; or if consensus bias is detectable only using the oracle value.
- **Required artifacts:** true and reported calibration DAGs, material/property
  certificates, homogeneity/matrix flags, lab results and uncertainties,
  assigned values, covariance matrices, z/En scores where used, invalidation
  queries, and qualification confusion matrices.

### WS-MEAO-05 — Catchment load and treatment breakthrough

- **Claim/hypothesis:** C-1381. Conservation- and support-aware estimation should
  improve load, stored mass, and treatment breakthrough decisions relative to
  concentration-only learning; mature process/state-space models are the main
  null.
- **Independent unit and size:** one synthetic catchment--reservoir--treatment
  episode of 365--1,825 days at 15-minute truth resolution. Generate 120 fit, 40
  tuning, and 160 held-out episodes per seed.
- **Generator families:** (1) steady flow and conservative solute; (2) storm
  pulses with asynchronous chemistry/discharge sampling; (3) sorbing/reacting
  parent and transformation product; and (4) treatment columns with bypass,
  capacity exhaustion, backwash/release, and residence-time dispersion.
- **Truth model:** close water storage in m$^3$ and constituent mass in kg;
  discharge 0.01--100 m$^3$/s, concentration 0.001--100 mg/L, storage residence
  0.1--300 days, transformation half-life 0.1--1,000 days, and treatment capacity
  0.1--100 kg. Numerical truth uses an independently tested finite-volume
  solver.
- **Arms and mature nulls:** (A) concentration interpolation and fixed percent
  removal; (B) conventional flow-weighted load calculation plus calibrated
  linear/nonlinear state-space and breakthrough model; (C) versioned
  conservation/speciation/support graph with operator-aware inference and
  residual diagnosis; (D) process-model ensemble/data-assimilation null; (E)
  complete state and fluxes, diagnostic only.
- **Perturbations:** gauge bias and rating shift, missing storms, sample timing,
  composite window, flow/chemistry clock offset, reaction rate, unmeasured
  tributary, bypass, sensor fouling, treatment-medium change, and censoring.
- **Metrics:** daily load MAE in kg/day; cumulative mass error in kg and percent;
  storage error in m$^3$; parent/product error in mg/L; breakthrough-time MAE in
  hours; false compliance per 10,000 samples and per episode; mass-balance
  residual; samples, assays, state bytes, CPU-s, and J/episode.
- **Invariant checks:** generator water and constituent closure each remain below
  relative $10^{-8}$ plus declared solver tolerance; arm accounting cannot use
  unknown flux truth; all time integrations use explicit seconds and preserve
  kg.
- **Promotion gate:** C must reduce cumulative-load and breakthrough-time MAE by
  at least 10% and 20%, respectively, relative to the strongest B/D with both
  adjusted intervals excluding zero; keep false-compliance non-inferior within
  0.5 percentage points; maintain 92--98% interval coverage; and use no more
  than 1.20 times the strongest null's total sensing plus compute cost.
- **Rejection gate:** reject if B/D matches the frontier; if improvement is only
  numerical mass closure without better held-out decisions; if C imputes an
  unmeasured flux from future effluent; if dilution is counted as removal; or if
  transformation products and retained/released mass are omitted.
- **Required artifacts:** water and mass ledgers, every flow/concentration
  support window, reaction and treatment state, breakthrough curves, residual
  attribution, compliance decisions, samples/assays, and unit-check report.

### WS-MEAO-06 — Groundwater and lake observability

- **Claim/hypothesis:** C-1382. Support-aware ensemble inference should improve
  coverage and abstention over smooth interpolation, while active placement must
  beat mature monitoring-network design without oracle access or self-confirming
  selection.
- **Independent unit and size:** one aquifer realization or one lake-year.
  Confirmation contains 40 aquifer and 40 lake seeds; each seed generates one
  fit world, one topology-matched tuning world, and four held-out worlds.
- **Aquifer generator:** 2-D confined/unconfined finite-volume flow and
  advection--dispersion--reaction on a 128 by 128 truth grid; log-conductivity
  variance 0.2--3.0, anisotropy 1--20, 1--4 preferential channels, 8--40 wells,
  screened intervals represented by mixing weights, seasonal recharge,
  pumping, and one parent/product plume. Hold out a channel geometry and
  boundary-condition family.
- **Lake generator:** 1-D vertical heat/oxygen/nutrient balance with 40 layers,
  changing mixed-layer depth, 0--2 seasonal turnovers, episodic inflow,
  production/respiration, sensor lag/fouling, and 2--12 profiles per year. Hold
  out a mixing-event and oxygen-demand form.
- **Arms and mature nulls:** (A) kriging/spline interpolation treating points as
  direct state; (B) calibrated groundwater/lake process model with ensemble
  Kalman/smoother or conventional Bayesian inverse; (C) multi-model
  support/operator-aware ensemble with observability map and abstention; (D) C
  plus adaptive site/depth/time selection priced against a conventional
  A-/D-optimal or value-of-information design; (E) full truth, diagnostic only.
- **Perturbations:** well pumping during sample, screen length, preferential
  path, boundary misspecification, depth/season aliasing, thermocline migration,
  missing profiles, sensor drift, number of samples, and intervention-induced
  observation change.
- **Metrics:** held-out head error in m; groundwater concentration error in
  mg/L; plume-volume and threshold-exceedance error in m$^3$; lake temperature
  error in K and oxygen error in mg/L by depth; hypoxic volume error in m$^3$;
  95% coverage/width; false trend/source assertions; abstention; wells/profiles,
  field proxy-hours, CPU-s, MiB, and J/world.
- **Invariant checks:** PDE solvers close water/tracer/oxygen balances to relative
  $10^{-7}$ plus solver tolerance; observation operators average the declared
  screen/depth/time support; no deployable arm accesses truth-grid values at
  proposed new sites before acquisition.
- **Promotion gate:** C must reduce protected false plume/hypoxia assertions by
  at least 20% relative to B, keep 92--98% coverage in both domains, and improve
  native-unit RMSE by at least 10% in one domain without more than 2% regression
  in the other. D must reduce integrated posterior variance or protected-decision
  error per field-cost unit by at least 10% relative to the strongest
  conventional design with adjusted interval excluding zero.
- **Rejection gate:** reject if B or conventional design matches; if abstention
  exceeds 15% without a safe fallback; if D samples where its current model
  predicts anomalies but fails the held-out alternative model; if pumping or
  sampling effects are omitted; or if grid truth rather than held-out
  observations supplies the deployable score.
- **Required artifacts:** conductivity/bathymetry and latent state, boundary and
  forcing files, well screens/profile depths, sampling actions, observation
  kernels, ensemble members, observability/resolution maps, balance checks,
  held-out predictions, abstentions, and field-cost ledger.

### WS-MEAO-07 — Ocean--atmosphere analysis under network change

- **Claim/hypothesis:** C-1383. Recording the evolving network and observation
  operators should reduce false trends and undercoverage during platform and
  instrument transitions; mature observing-system experiments and assimilation
  are the required null.
- **Independent unit and size:** one five-year synthetic coupled 2-D ocean--
  atmosphere episode on a periodic 128 by 256 truth grid with hourly dynamics
  and six-hour analysis cycles. Per seed generate one development and two
  held-out episodes.
- **Generator families:** (1) stationary field with expanding coverage; (2) true
  trend with stable network; (3) instrument-generation transition with overlap
  and shared drift; and (4) sparse-region extreme events plus selectively
  missing observations. Dynamics combine advection, diffusion, seasonal modes,
  multiscale forcing, and bounded nonlinear tracer/temperature coupling.
- **Platforms/operators:** drifting profiles, fixed stations, radiosonde-like
  columns, aircraft tracks, and satellite swaths with distinct space/time
  support, vertical kernels, error correlation, bias, latency, QC, and failure.
  Coverage and vertical resolution change in declared epochs modeled after the
  kinds of changes documented for Argo and ERA5, without replaying their data.
- **Arms and mature nulls:** (A) bin average/gridding with independent errors;
  (B) optimal interpolation or EnKF with correctly tuned stationary covariance;
  (C) mature bias-aware ensemble/variational assimilation plus observing-system
  experiments; (D) C plus versioned operator/calibration/network dependencies,
  rejected-observation lineage, and targeted reprocessing; (E) truth,
  diagnostic only.
- **Perturbations:** platform density, drift, overlap duration, correlated
  channels, QC threshold, coverage hole, model error, bias anchor, observation
  latency, extreme scale, and network expansion/contraction.
- **Metrics:** field RMSE in K, m/s, or mmol/m$^3$ by variable; nominal-95%
  coverage/width; false trend and missed trend per 100 episodes; trend bias per
  decade in native unit; extreme-event recall/precision and location error km;
  innovation diagnostics; observing count, rejected count, bytes, CPU-s, MiB,
  reprocessed cell-hours, and J/analysis cycle.
- **Invariant checks:** truth conserves declared tracer to relative $10^{-8}$
  absent sources; every observation recomputes from stored operator and state;
  identical observations feed B--D; rejected values remain in lineage but not
  assimilation.
- **Promotion gate:** D must reduce false-trend rate by at least 50% relative to
  C in no-trend/network-change worlds and keep it at or below 5%, reduce absolute
  trend bias by at least 15% in true-trend worlds, keep coverage at 92--98%, and
  improve extreme recall by at least 5 percentage points without over 2 points
  loss of precision; total lifecycle cost must be within 1.25 times C.
- **Rejection gate:** reject if C with standard network-change experiments and
  bias modelling matches D; if D assumes the sign of platform drift; if
  reanalysis is scored as an observation; if network coverage is leaked through
  truth masks; or if trends improve only after deleting transition periods.
- **Required artifacts:** truth fields, platform trajectories, raw and rejected
  observations, operator/calibration/network epochs, bias roots, innovations,
  analysis ensembles, trend/extreme maps, reprocessing dependency queries, and
  lifecycle ledger.

### WS-MEAO-08 — Reference frame and geophysical resolution

- **Claim/hypothesis:** C-1384. Frame/epoch/covariance and averaging-kernel
  records should prevent false motion and false spatial resolution; any project
  residual must exceed standard geodetic adjustment and inverse theory.
- **Independent unit and size:** one station-network plus geophysical-inverse
  episode. Each seed generates 80 stations for 12 years of daily coordinates and
  40--160 forward-kernel measurements of a 1-D/2-D latent field.
- **Generator families:** (1) stable frame plus linear motion; (2) frame change
  and shared reference-station error; (3) equipment/earthquake discontinuities,
  seasonal and post-seismic motion; and (4) ill-posed gravity/seismic-like
  inverse with resolution--variance trade-off and a held-out null-space mode.
- **Arms and mature nulls:** (A) bare coordinate differencing and fine-grid least
  squares with diagonal errors; (B) conventional reference-frame transformation,
  generalized least squares, discontinuity/seasonal model, and regularized
  inverse; (C) Backus--Gilbert or equivalent resolution-reporting inverse plus
  full covariance; (D) B/C plus versioned frame, station, kernel, transformation,
  and descendant invalidation contract; (E) true coordinates/field, diagnostic
  only.
- **Perturbations:** ETRS89/ITRF-like frame rate, epoch mismatch, common-mode
  reference error, offset timing, post-seismic decay, station dropout, covariance
  misspecification, kernel width/noise, regularization, and output grid spacing.
- **Metrics:** position RMSE in mm; velocity error in mm/year; false deformation
  calls per 1,000 station-years; nominal-95% coverage; latent-field RMSE;
  averaging-kernel width and side-lobe mass in km/dimensionless units; unresolved-
  mode false assertion; affected-descendant precision/recall; CPU-s, MiB,
  metadata bytes, review minutes, and J/episode.
- **Invariant checks:** frame transformations round-trip within 0.001 mm in
  binary64 test cases; stored covariance is positive semidefinite within
  numerical tolerance; synthetic data equal forward-kernel application plus
  stored noise to relative $10^{-10}$.
- **Promotion gate:** D must reduce false deformation calls by at least 80%
  relative to A and at least 10% relative to the strongest B/C, keep 92--98%
  coverage, label at least 95% of seeded null-space modes unresolved, and reach
  at least 95% affected-descendant recall at no more than 10% unnecessary
  rebuilds; adjusted intervals must exclude zero for the B/C contrast.
- **Rejection gate:** reject the project residual if B/C plus ordinary metadata
  matches D; if D knows true frame offsets unavailable from standards/control
  points; if fine grid spacing is scored as resolution; if covariance is
  diagonalized for convenience; or if an unresolved mode receives a precise
  physical label.
- **Required artifacts:** frame definitions and epochs, station events,
  transformations, coordinates/covariances, forward and averaging kernels,
  regularization path, resolution--variance curves, null-space fixtures,
  dependency/invalidation logs, and deformation confusion matrices.

### WS-MEAO-09 — Remote-sensing retrieval and effective resolution

- **Claim/hypothesis:** C-1385. A forward/operator-aware hybrid should reduce
  miscalibration and false change under atmosphere, mixture, geolocation, and
  prior shift; calibrated optimal estimation and QA4EO-style product practice
  are the decisive nulls.
- **Independent unit and size:** one synthetic scene with an independent
  atmosphere, surface field, sensor state, and acquisition. Per seed generate
  2,000 fit, 500 tuning, and 500 held-out 64 by 64 scenes; confirmation streams
  scenes to keep peak RAM below the common limit.
- **Generator families:** (1) linear spectral mixture with clear atmosphere; (2)
  nonlinear temperature/emissivity or gas-profile retrieval; (3) cloud/aerosol,
  adjacency, PSF, and geolocation error; and (4) held-out surface spectrum,
  atmosphere, prior, and sensor-response shift. Generate 8--64 bands, 2--8 latent
  components, point-spread FWHM 0.7--3.5 pixels, geolocation error 0--1.5 pixels,
  and correlated radiance noise 0.1--5%.
- **Arms and mature nulls:** (A) discriminative pixel-label network using nominal
  grid cells; (B) calibrated radiative-transfer/optimal-estimation retrieval
  with prior, posterior covariance, averaging kernel, and QC; (C) hybrid
  amortized inverse trained through the forward model with operator version and
  out-of-support abstention; (D) B plus QA4EO-style end-to-end uncertainty,
  fiducial-reference analogue, support-matched validation, and product lineage;
  (E) sub-pixel truth, diagnostic only.
- **Parity and reference acquisition:** A--D receive identical radiances and
  ancillary inputs. C/D may acquire 0, 4, 16, or 64 independent reference
  footprints per sensor epoch; acquisition is priced and validation footprints
  never train a model scored on the same scene.
- **Perturbations:** spectral-response drift, radiometric bias, PSF, band loss,
  atmospheric-profile error, cloud-screen selection, sub-pixel mixture,
  geolocation, prior mean/covariance, training support, validation support, and
  algorithm version.
- **Metrics:** top-of-atmosphere radiance residual in
  W/(m$^2$ sr $\mu$m); surface temperature error in K or concentration error in
  mol/m$^2$; nominal-95% coverage/width; calibration error; false-change and
  missed-change per 10,000 pixels and per scene; averaging-kernel effective
  width in m; OOD recall/false abstention; fiducial comparisons; CPU-s, MiB,
  model/metadata bytes, reference acquisitions, and J/accepted retrieval.
- **Invariant checks:** the independent forward implementation reproduces stored
  radiance within relative $10^{-8}$; convolution conserves radiance under the
  declared boundary rule; geolocation and support transformations are invertible
  in the no-error fixture; validation support is explicitly matched or
  convolved.
- **Promotion gate:** C or D must reduce false-change rate by at least 20%
  relative to B, keep 92--98% coverage, improve held-out physical-state RMSE by
  at least 10% or reduce full lifecycle CPU-energy/reference cost by at least 20%
  at non-inferior RMSE (2% margin), and maintain at least 90% OOD recall with no
  more than 10% false abstention. The strongest qualifying B/D comparison and
  Holm-adjusted interval govern promotion.
- **Rejection gate:** reject if B/D matches the frontier; if benefit is measured
  against nominal pixels rather than support-matched truth; if C uses a forward
  model unavailable at deployment without charging it; if cloud/OOD rejection
  removes more than 15% of the target population without reporting selection;
  or if averaging-kernel/prior-dominated levels are labeled independently
  resolved.
- **Required artifacts:** sub-pixel state, atmospheric and surface inputs,
  sensor/PSF/spectral response, raw radiance, cloud/QC/rejection masks,
  geolocation, priors, averaging kernels, retrieved covariance, reference
  footprints, product lineage, support-matched validation, and resource ledger.

## Cross-protocol promotion decision

The nine tests answer three different questions and must not be pooled into one
score:

1. **Scientific boundary reproduction:** do naive arms fail for the seeded
   operator/support reasons, and do complete mature methods recover calibrated
   decisions?
2. **Systems residual:** does a versioned cross-layer observation/dependency
   record improve a protected outcome or lifecycle cost beyond the strongest
   complete field method?
3. **Operational readiness:** can the result be reproduced on the declared CPU
   workstation within the resource and artifact contract?

The claims can remain established even when the project residual is rejected.
Candidate 014 receives experimental support only if at least three distinct
protocol families (one analytical/sampling, one water, and one ocean/geodesy/
remote-sensing) pass their protocol-specific residual gate, no protected gate
fails, the median lifecycle resource increase is at most 20%, and an untouched
reviewer can reconstruct every decision from retained artifacts. Otherwise the
audit remains a set of measurement contracts and mature nulls, which is still a
useful outcome.

## Field-coverage disposition and remaining gaps

This audit changes the following field-level entries from adjacent treatment to
dedicated treatment:

1. analytical chemistry, including calibration, trace analysis, speciation,
   matrix effects, detection/quantification, sampling, and interlaboratory
   comparison;
2. food chemistry and official-control sampling as a bounded analytical
   application;
3. hydrology, groundwater, water-quality monitoring, and water-treatment
   evidence boundaries;
4. limnological observation, profiles, stratification, mixing, and target
   support;
5. ocean and atmospheric observing systems, quality assurance, changing
   networks, analysis, and reanalysis;
6. geodesy/reference frames and geophysical inverse resolution; and
7. remote-sensing radiometry, retrieval, effective resolution, Cal/Val, and
   geospatial reference/version metadata.

It does not close every specialty. Remaining work includes analytical
electrochemistry and surface analysis; non-target screening and unknown
identification; isotope-dilution implementation detail; microbiological sampling
and culture/qPCR observation operators; hydrogeophysics; coastal estuarine
observation; cryosphere observing systems; gravimetry and geomagnetism in depth;
SAR/interferometry; GNSS reflectometry; lidar/radar polarimetry; and the exact
German transposition/applicability analysis for a future concrete product.

## Source inventory and copy-ready bibliography appendix

The evidence set contains **49 distinct sources**: **13 existing central
bibliography entries** reused without modification and **36 copy-ready new
entries** below. Source roles are: 14 EU/German legal or official-control
sources, 21 international/European standards and authoritative technical
frameworks, and 14 academic primary or programme-defining scientific
sources. A source can occupy more than one substantive topic, but it is counted
once in that total.

### Reuse these 13 existing keys

Do not insert duplicates for:

- `jcgm200`, `jcgm100`, `jcgm106`, `iso17025`, `iso5725`, `iso17034`,
  `iso17043`, and `iso13528`;
- `backus1968resolution`, `beven1989hydrology`, `bloeschl1995scale`,
  `rodgers2000inverse`, and `Evensen1994EnKF`.

### Copy-ready new BibTeX entries (36)

```bibtex
@book{EurachemValidation2025,
  editor = {Cantwell, Helen},
  title = {The Fitness for Purpose of Analytical Methods: A Laboratory Guide to Method Validation and Related Topics},
  edition = {3},
  publisher = {Eurachem},
  year = {2025},
  url = {https://www.eurachem.org/images/stories/Guides/pdf/MV_guide_3rd_ed_V1_EN.pdf}
}

@book{EurachemSampling2019,
  editor = {Ramsey, Michael H. and Ellison, Stephen L. R. and Rostron, Philip},
  title = {Measurement Uncertainty Arising from Sampling: A Guide to Methods and Approaches},
  edition = {2},
  publisher = {Eurachem, EUROLAB, CITAC, Nordtest and RSC Analytical Methods Committee},
  year = {2019},
  isbn = {9780948926358},
  url = {https://www.eurachem.org/images/stories/Guides/pdf/UfS_2019_EN_P2.pdf}
}

@article{TempletonEtAl2000Speciation,
  author = {Templeton, Douglas M. and Ariese, Freek and Cornelis, Rita and Danielsson, Lars-Goran and Muntau, Herbert and van Leeuwen, Herman P. and Lobinski, Ryszard},
  title = {Guidelines for Terms Related to Chemical Speciation and Fractionation of Elements: Definitions, Structural Aspects, and Methodological Approaches},
  journal = {Pure and Applied Chemistry},
  year = {2000},
  volume = {72},
  number = {8},
  pages = {1453--1470},
  doi = {10.1351/pac200072081453},
  url = {https://doi.org/10.1351/pac200072081453}
}

@article{Currie1995Detection,
  author = {Currie, Lloyd A.},
  title = {Nomenclature in Evaluation of Analytical Methods Including Detection and Quantification Capabilities},
  journal = {Pure and Applied Chemistry},
  year = {1995},
  volume = {67},
  number = {10},
  pages = {1699--1723},
  doi = {10.1351/pac199567101699},
  url = {https://doi.org/10.1351/pac199567101699}
}

@article{MatuszewskiEtAl2003Matrix,
  author = {Matuszewski, B. K. and Constanzer, M. L. and Chavez-Eng, C. M.},
  title = {Strategies for the Assessment of Matrix Effect in Quantitative Bioanalytical Methods Based on HPLC-MS/MS},
  journal = {Analytical Chemistry},
  year = {2003},
  volume = {75},
  number = {13},
  pages = {3019--3030},
  doi = {10.1021/ac020361s},
  url = {https://doi.org/10.1021/ac020361s}
}

@misc{EU2021_808,
  author = {{European Commission}},
  title = {Commission Implementing Regulation (EU) 2021/808 on the Performance of Analytical Methods for Residues of Pharmacologically Active Substances Used in Food-Producing Animals and on the Interpretation of Results and Sampling Methods},
  year = {2021},
  url = {https://eur-lex.europa.eu/eli/reg_impl/2021/808/2024-08-20/eng},
  note = {Consolidated version current 2024-08-20; checked 2026-08-24}
}

@misc{EU2023_2782,
  author = {{European Commission}},
  title = {Commission Implementing Regulation (EU) 2023/2782 Laying Down the Methods of Sampling and Analysis for the Control of the Levels of Mycotoxins in Food},
  year = {2023},
  url = {https://eur-lex.europa.eu/eli/reg_impl/2023/2782/2024-03-24/eng},
  note = {In force; applicable from 2024-04-01; checked 2026-08-24}
}

@misc{EU2023_915,
  author = {{European Commission}},
  title = {Commission Regulation (EU) 2023/915 on Maximum Levels for Certain Contaminants in Food},
  year = {2023},
  url = {https://eur-lex.europa.eu/eli/reg/2023/915/2025-10-08/eng},
  note = {Consolidated version checked 2026-08-24}
}

@misc{EU2017_625,
  author = {{European Parliament and Council of the European Union}},
  title = {Regulation (EU) 2017/625 on Official Controls and Other Official Activities Performed to Ensure the Application of Food and Feed Law and Related Rules},
  year = {2017},
  url = {https://eur-lex.europa.eu/eli/reg/2017/625/oj},
  note = {Current applicability must be checked for the exact official-control activity}
}

@misc{DE_LFGB_2026,
  author = {{Federal Republic of Germany}},
  title = {Lebensmittel-, Bedarfsgegenstande- und Futtermittelgesetzbuch (LFGB)},
  year = {2026},
  url = {https://www.gesetze-im-internet.de/lfgb/},
  note = {Version amended by Article 3 of the Act of 3 February 2026; sections 43, 50 and 64 checked 2026-08-24}
}

@misc{EU2009_90,
  author = {{European Commission}},
  title = {Commission Directive 2009/90/EC Laying Down Technical Specifications for Chemical Analysis and Monitoring of Water Status},
  year = {2009},
  url = {https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009L0090},
  note = {Checked 2026-08-24}
}

@misc{EU2020_2184,
  author = {{European Parliament and Council of the European Union}},
  title = {Directive (EU) 2020/2184 on the Quality of Water Intended for Human Consumption},
  year = {2020},
  url = {https://eur-lex.europa.eu/eli/dir/2020/2184/oj/eng},
  note = {Checked 2026-08-24}
}

@misc{EU2000_60_2026,
  author = {{European Parliament and Council of the European Union}},
  title = {Directive 2000/60/EC Establishing a Framework for Community Action in the Field of Water Policy},
  year = {2000},
  url = {https://eur-lex.europa.eu/eli/dir/2000/60/2026-05-10/eng},
  note = {Consolidated version current 2026-05-10 after Directive (EU) 2026/805}
}

@misc{EU2006_118_2026,
  author = {{European Parliament and Council of the European Union}},
  title = {Directive 2006/118/EC on the Protection of Groundwater against Pollution and Deterioration},
  year = {2006},
  url = {https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02006L0118-20260510},
  note = {Consolidated version current 2026-05-10}
}

@misc{EU2026_805,
  author = {{European Parliament and Council of the European Union}},
  title = {Directive (EU) 2026/805 Amending Directives 2000/60/EC, 2006/118/EC and 2008/105/EC as Regards Water Pollutants},
  year = {2026},
  url = {https://eur-lex.europa.eu/eli/dir/2026/805/oj},
  note = {Official Journal publication 2026-04-20; applicability must be read article by article}
}

@misc{DE_GrwV_2022,
  author = {{Federal Republic of Germany}},
  title = {Verordnung zum Schutz des Grundwassers (Grundwasserverordnung---GrwV)},
  year = {2022},
  url = {https://www.gesetze-im-internet.de/grwv_2010/},
  note = {Last amended 2022-10-12; Annexes 3 and 4 checked 2026-08-24}
}

@misc{DE_OGewV_2016,
  author = {{Federal Republic of Germany}},
  title = {Verordnung zum Schutz der Oberflachengewasser (Oberflachengewasserverordnung---OGewV)},
  year = {2016},
  url = {https://www.gesetze-im-internet.de/ogewv_2016/},
  note = {Current official online text checked 2026-08-24}
}

@techreport{WMO168_2008,
  author = {{World Meteorological Organization}},
  title = {Guide to Hydrological Practices, Volume I: Hydrology---From Measurement to Hydrological Information},
  institution = {World Meteorological Organization},
  number = {WMO-No. 168},
  edition = {6},
  year = {2008},
  url = {https://community.wmo.int/site/knowledge-hub/programmes-and-initiatives/water-resources-assessment/hydrology-publications}
}

@article{JaneEtAl2021Lakes,
  author = {Jane, Stephen F. and Hansen, Gretchen J. A. and Kraemer, Benjamin M. and Leavitt, Peter R. and Mincer, Joshua L. and North, Rebecca L. and Pilla, Rachel M. and Stetler, Jonathan T. and Williamson, Craig E. and Woolway, R. Iestyn and others},
  title = {Widespread Deoxygenation of Temperate Lakes},
  journal = {Nature},
  year = {2021},
  volume = {594},
  pages = {66--70},
  doi = {10.1038/s41586-021-03550-y},
  url = {https://doi.org/10.1038/s41586-021-03550-y}
}

@article{WoolwayMerchant2019,
  author = {Woolway, R. Iestyn and Merchant, Christopher J.},
  title = {Worldwide Alteration of Lake Mixing Regimes in Response to Climate Change},
  journal = {Nature Geoscience},
  year = {2019},
  volume = {12},
  number = {4},
  pages = {271--276},
  doi = {10.1038/s41561-019-0322-x},
  url = {https://doi.org/10.1038/s41561-019-0322-x}
}

@article{WongEtAl2020Argo,
  author = {Wong, Annie P. S. and Wijffels, Susan E. and Riser, Stephen C. and Pouliquen, Sylvie and Hosoda, Shigeki and Roemmich, Dean and others},
  title = {Argo Data 1999--2019: Two Million Temperature-Salinity Profiles and Subsurface Velocity Observations from a Global Array of Profiling Floats},
  journal = {Frontiers in Marine Science},
  year = {2020},
  volume = {7},
  pages = {700},
  doi = {10.3389/fmars.2020.00700},
  url = {https://doi.org/10.3389/fmars.2020.00700}
}

@online{GOOS_EOV_2026,
  author = {{Global Ocean Observing System}},
  title = {Essential Ocean Variables},
  year = {2026},
  url = {https://goosocean.org/what-we-do/framework/essential-ocean-variables/},
  urldate = {2026-08-24}
}

@online{WMO_GAW_QA_2026,
  author = {{World Meteorological Organization Global Atmosphere Watch}},
  title = {Quality Assurance},
  year = {2026},
  url = {https://community.wmo.int/site/knowledge-hub/programmes-and-initiatives/global-atmosphere-watch-programme-gaw/quality-assurance},
  urldate = {2026-08-24}
}

@online{GCOS_ECV_2026,
  author = {{Global Climate Observing System}},
  title = {Essential Climate Variables and Climate Monitoring Principles},
  year = {2026},
  url = {https://gcos.wmo.int/site/global-climate-observing-system-gcos/essential-climate-variables/about-essential-climate-variables},
  urldate = {2026-08-24},
  note = {Includes the 2022 ECV requirements and updated climate-monitoring principles}
}

@article{HersbachEtAl2020ERA5,
  author = {Hersbach, Hans and Bell, Bill and Berrisford, Paul and Hirahara, Shoji and Horanyi, Andras and Munoz-Sabater, Joaquin and Nicolas, Julien and Peubey, Carole and Radu, Raluca and Schepers, Dinand and others},
  title = {The ERA5 Global Reanalysis},
  journal = {Quarterly Journal of the Royal Meteorological Society},
  year = {2020},
  volume = {146},
  number = {730},
  pages = {1999--2049},
  doi = {10.1002/qj.3803},
  url = {https://doi.org/10.1002/qj.3803}
}

@article{AltamimiEtAl2023ITRF2020,
  author = {Altamimi, Zuheir and Rebischung, Paul and Collilieux, Xavier and Metivier, Laurent and Chanard, Kristel},
  title = {ITRF2020: An Augmented Reference Frame Refining the Modeling of Nonlinear Station Motions},
  journal = {Journal of Geodesy},
  year = {2023},
  volume = {97},
  pages = {47},
  doi = {10.1007/s00190-023-01738-w},
  url = {https://doi.org/10.1007/s00190-023-01738-w}
}

@techreport{IERS2010Conventions,
  editor = {Petit, Gerard and Luzum, Brian},
  title = {IERS Conventions (2010)},
  institution = {International Earth Rotation and Reference Systems Service},
  number = {IERS Technical Note 36},
  year = {2010},
  url = {https://iers-conventions.obspm.fr/conventions/content/tn36.pdf}
}

@online{EUREF_ETRS89,
  author = {{IAG Reference Frame Sub-Commission for Europe (EUREF)}},
  title = {European Geodetic Reference Systems: ETRS89},
  year = {2026},
  url = {https://www.euref.eu/european-geodetic-reference-systems},
  urldate = {2026-08-24},
  note = {ETRS89 was adopted by EUREF Resolution 1, Firenze, 1990}
}

@standard{ISO19111_2019,
  author = {{International Organization for Standardization}},
  title = {ISO 19111:2019---Geographic Information---Referencing by Coordinates},
  year = {2019},
  url = {https://www.iso.org/standard/74039.html},
  note = {Confirmed current in 2024; amendments through 2023 checked 2026-08-24}
}

@standard{ISO19157_1_2023,
  author = {{International Organization for Standardization}},
  title = {ISO 19157-1:2023---Geographic Information---Data Quality---Part 1: General Requirements},
  year = {2023},
  url = {https://www.iso.org/standard/78900.html}
}

@misc{EU1089_2010,
  author = {{European Commission}},
  title = {Commission Regulation (EU) No 1089/2010 Implementing Directive 2007/2/EC as Regards Interoperability of Spatial Data Sets and Services},
  year = {2010},
  url = {https://eur-lex.europa.eu/eli/reg/2010/1089/2023-11-19/eng},
  note = {Consolidated version current 2023-11-19; checked 2026-08-24}
}

@misc{EU2007_2_2024,
  author = {{European Parliament and Council of the European Union}},
  title = {Directive 2007/2/EC Establishing an Infrastructure for Spatial Information in the European Community (INSPIRE)},
  year = {2007},
  url = {https://eur-lex.europa.eu/eli/dir/2007/2/2024-11-26/eng},
  note = {Consolidated version current 2024-11-26; checked 2026-08-24}
}

@techreport{QA4EO2009,
  author = {{Group on Earth Observations and Committee on Earth Observation Satellites}},
  title = {A Quality Assurance Framework for Earth Observation: Operational Guidelines},
  institution = {GEO/CEOS},
  year = {2009},
  url = {https://qa4eo.org/docs/Guidelines_Framework_v3.0.pdf},
  note = {Version 3.0; current QA4EO implementation guidance checked 2026-08-24}
}

@article{GasconEtAl2017Sentinel2,
  author = {Gascon, Ferran and Bouzinac, Catherine and Thepaut, Olivier and Jung, Mathieu and Francesconi, Benjamin and Louis, Jerome and Lonjou, Vincent and Lafrance, Bruno and Massera, Stephane and Gaudel-Vacaresse, Angelique and others},
  title = {Copernicus Sentinel-2A Calibration and Products Validation Status},
  journal = {Remote Sensing},
  year = {2017},
  volume = {9},
  number = {6},
  pages = {584},
  doi = {10.3390/rs9060584},
  url = {https://doi.org/10.3390/rs9060584}
}

@online{BIPM_CCQM_2026,
  author = {{Bureau International des Poids et Mesures, Consultative Committee for Amount of Substance}},
  title = {CCQM Key Comparisons and Final Reports},
  year = {2026},
  url = {https://www.bipm.org/en/committees/cc/ccqm/key-comparisons},
  urldate = {2026-08-24},
  note = {Matrix- and measurand-specific chemical and biological measurement comparisons}
}

@standard{ISO13528_Amd1_2026,
  author = {{International Organization for Standardization}},
  title = {ISO 13528:2022/Amd 1:2026---Statistical Methods for Use in Proficiency Testing by Interlaboratory Comparison---Amendment 1},
  year = {2026},
  url = {https://www.iso.org/standard/90057.html},
  note = {Published 2026-07}
}
```

## Audit verdict

The durable output is a stricter evidence chain, not another analogy. The
measurement-heavy fields converge on the same rule from different directions:
**preserve what was physically selected and transformed, how the indication was
produced, which reference and units support it, which forward/inverse operators
created the estimate, what remains unresolved, and which decision the result is
fit to inform.**

The nine claims and nine protocols make that rule falsifiable. If the complete
analytical, hydrological, assimilation, geodetic, or remote-sensing null reaches
the same decision/resource frontier, the project should reuse it and delete the
proposed extra machinery. If a versioned cross-layer record catches failures
that those field stacks reproducibly miss, the evidence belongs under Candidate
014 and must remain linked to its physical source and operator.

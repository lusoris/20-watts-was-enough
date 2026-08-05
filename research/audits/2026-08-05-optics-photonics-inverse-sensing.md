# Optics, photonics, and inverse sensing: primary-source audit

- **Audit date:** 2026-08-05
- **Scope:** diffraction and information limits, photon budgets, inverse and
  computational imaging, phase retrieval, compressive sensing, super-resolution,
  adaptive optics, active illumination, coded apertures, multiplexing,
  calibration, detector limits, sensor fusion, analog optical computation,
  neuromorphic photonics, conversion and quantization, fabrication and thermal
  variation, and full lifecycle energy
- **Evidence rule:** a physical demonstration establishes only the measured
  operator, scale, precision, bandwidth, task, and boundary. Simulations and
  component-level energy estimates do not establish system-level advantage.
- **Promotion state:** audit-local `OPTIC-` claims only. No new principle or
  candidate is promoted by this audit.

## Executive finding

Optics contributes a sharper research discipline than the slogan “compute with
light.” A sensing system never receives the world directly. It receives photons
through a finite, noisy, drifting measurement operator. Reconstruction combines
that operator with prior assumptions; active sensing can spend photons and time
to change the operator; and analog optical hardware can execute some linear maps
with high spatial, temporal, or wavelength parallelism. None of those operations
creates information absent from both the measurements and the prior.

The strongest transferable package is a **measurement-operator-aware inference
contract**:

1. retain the calibrated forward operator and its version, not only a decoded
   tensor;
2. expose the operator's uncertainty, null spaces, saturation, and quantization;
3. allocate additional measurements where their expected task value exceeds
   illumination, latency, risk, and energy cost;
4. route only physically matched, sufficiently reusable linear transforms to an
   optical front end;
5. recalibrate or fall back when residuals indicate drift outside the declared
   envelope; and
6. compare complete acquisition-to-decision systems at equal task quality and
   lifecycle boundary.

Every element has mature conventional counterparts: Bayesian inverse problems,
optimal experiment design, model-predictive control, compressed sensing,
uncertainty quantification, digital accelerators, calibration monitors, and
heterogeneous scheduling. The audit therefore finds no causal residual that
requires a new project principle. It does produce demanding fixture refinements
for [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
[Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md),
[Candidate 017](../../experiments/candidates/017-contract-preserving-semantic-compaction.md),
and [Candidate 018](../../experiments/candidates/018-value-reconstructability-aware-tiering.md),
with hardware-routing pressure on [Candidate 001](../../experiments/candidates/001-adaptive-topology.md)
and [Candidate 013](../../experiments/candidates/013-deficit-capability-routing.md).

## Outcome firewall

The words “resolution,” “speed,” “parallelism,” “energy efficiency,” and
“all-optical” are not outcomes until their denominators and boundaries are fixed.

| Outcome | Required report | Invalid substitution |
| --- | --- | --- |
| task fidelity | preregistered task loss, calibration, and uncertainty on held-out physical scenes | PSNR or a visually pleasing reconstruction alone |
| spatial resolution | target type, contrast, wavelength, numerical aperture, field of view, estimator, and success criterion | pixel pitch or reconstructed voxel count |
| temporal resolution | exposure, source pulse, detector impulse response, controller delay, and reconstructed bandwidth | optical propagation time alone |
| spectral resolution | line shape, bandwidth, channel spacing, crosstalk, and SNR | number of wavelength channels |
| photon efficiency | photons incident, transmitted, absorbed, detected, and used per accepted decision | photons inside the multiply core |
| compute efficiency | complete useful task operations or decisions per joule at declared precision | nominal analog MACs per optical joule |
| latency | sensor integration through accepted output, including conversion and control | chip flight time |
| throughput | accepted outputs per second at fixed quality, batch, and duty cycle | carrier frequency times nominal channels |
| dynamic range | full-well or count-rate limits, read noise, dark signal, ADC range, and saturation policy | bit depth alone |
| robustness | degradation under operator shift, misalignment, temperature, aging, and scene shift | nominal-device accuracy |
| lifecycle cost | manufacture, packaging, calibration, operation, cooling, replacement, and disposal per service unit | accelerator package power |

## Transfer rule and strongest ordinary null stack

An optics-derived proposal is eligible for architectural work only if it declares
the object or latent state, forward operator, illumination, detector, noise law,
calibration state, reconstruction prior, task loss, and full resource boundary.
It must then survive the strongest appropriate ordinary nulls:

- a conventional lens or focused sensor with the same aperture, photon budget,
  detector area, exposure, and task;
- maximum-likelihood, maximum-a-posteriori, variational, and sampling-based
  inverse solvers using the same calibrated operator;
- Tikhonov, total-variation, sparse, low-rank, learned, and diffusion priors with
  prior-mismatch tests;
- direct Nyquist sampling, raster scanning, multiexposure HDR, conventional
  spectroscopy, and standard coded acquisition;
- passive fixed measurements, greedy value of information, Bayesian experiment
  design, POMDP planning, and model-predictive control;
- blind and non-blind deconvolution, phase diversity, ptychography, and standard
  phase-retrieval algorithms;
- a matched digital GPU, FPGA, ASIC, or DSP including memory traffic and exact
  arithmetic precision;
- a digital accelerator with the same sparsity, quantization, batching, and
  operator reuse as the optical path;
- open-loop calibration, periodic calibration, residual-triggered calibration,
  in-situ optimization, and a redundant reference channel;
- covariance-aware Kalman filtering, factor graphs, robust fusion, covariance
  intersection, and single-sensor fallbacks; and
- amortized embodied energy, source and detector power, DAC/ADC, control,
  thermal stabilization, cooling, host compute, idle power, yield, and lifetime.

An optical implementation earns credit only for a measured end-to-end advantage
on a declared Pareto frontier. Physical analogy, carrier speed, component
bandwidth, or a count of simultaneous interference products earns none.

## Shared quantitative contract

### Forward operator and noise

For scene or latent quantity $x$, calibration state $c_t$, chosen measurement
action $a_t$, and observation $y_t$, use

$$
y_t=\mathcal H(a_t,c_t)x+n_t,
$$

where $\mathcal H$ is the physical forward operator, $n_t$ is measurement noise,
and $t$ indexes an acquisition. The units of $x$ and $y_t$ are instrument-
specific and must be declared; $\mathcal H$ carries the corresponding conversion
units. If photon counts are conditionally independent and Poisson distributed,

$$
k_i\sim\operatorname{Poisson}(\mu_i),
\qquad
\mu_i=\eta_i\Phi_i\tau_i+b_i,
$$

where $k_i$ is detected electrons or counts [count], $\eta_i$ is detection
efficiency [dimensionless], $\Phi_i$ is incident photon rate [photon/s], $\tau_i$
is exposure [s], and $b_i$ is expected background plus dark count [count]. This
model is not universal: bunching, coherent receiver noise, read noise, fixed-
pattern error, afterpulsing, and dead time require explicit terms.

For an ideal background-free Poisson count with mean $N_\gamma$ [count], the
standard deviation is $\sqrt{N_\gamma}$ [count] and

$$
\operatorname{SNR}_{\mathrm{shot}}=\sqrt{N_\gamma}.
$$

This square-root scaling is a budget constraint, not a promise that a real
instrument reaches it.

### Identifiability, conditioning, and uncertainty

For a linearized operator $H$ with singular-value decomposition
$H=U\Sigma V^*$, a component along right singular vector $v_j$ is amplified in
an unregularized inverse by $1/\sigma_j$. Here $\sigma_j$ is singular value $j$
with the units of $H$, and $U$ and $V$ are unitary bases. If $\sigma_j=0$, that
component is in the null space and is not identified by the measurement.

For parameter vector $\theta$ and likelihood $p(y\mid\theta,a)$, Fisher
information under action $a$ is

$$
I_{jk}(\theta;a)=
\mathbb E\!\left[
\frac{\partial\log p(y\mid\theta,a)}{\partial\theta_j}
\frac{\partial\log p(y\mid\theta,a)}{\partial\theta_k}
\right].
$$

The entries carry reciprocal units of $\theta_j\theta_k$. Under the regularity
conditions of the Cramér–Rao theorem, an unbiased estimator satisfies

$$
\operatorname{Cov}(\hat\theta)\succeq I(\theta;a)^{-1}.
$$

This lower bound is model- and estimator-class-qualified. It does not validate a
wrong likelihood or guarantee that a finite-sample estimator attains the bound.

### Active measurement allocation

For belief state $b_t$, candidate action $a$, task utility $U$, observation $y$,
and action cost vector $C(a)$, define expected value of information

$$
\operatorname{EVI}(a\mid b_t)=
\mathbb E_{y\sim p(y\mid a,b_t)}
\left[
\max_d\mathbb E[U(d,\theta)\mid b_t,a,y]
\right]
-
\max_d\mathbb E[U(d,\theta)\mid b_t].
$$

$d$ is a downstream decision and $\theta$ is the uncertain task state. Utility
units are declared by the task. The cost vector reports at least photons [count],
energy [J], latency [s], sample dose [task-specific], actuator wear [cycles], and
risk [declared scale]; it must not be hidden inside one arbitrary coefficient.

### Drift and recalibration

Given calibration parameters $c_t$, reference observation $r_t$, and expected
reference $\hat r(c_t)$, define a normalized residual

$$
z_t^2=(r_t-\hat r(c_t))^\top S_t^{-1}(r_t-\hat r(c_t)),
$$

where $S_t$ is the residual covariance in squared observation units, so $z_t^2$
is dimensionless. A recalibration trigger must preregister its threshold, window,
false-alarm target, and fallback. Task residuals cannot by themselves distinguish
optical drift, scene shift, label shift, or model failure.

### End-to-end and lifecycle energy

For one accepted service unit, such as one correctly classified physical event,
report

$$
E_{\mathrm{service}}=
E_{\mathrm{source}}+E_{\mathrm{mod}}+E_{\mathrm{prop}}+
E_{\mathrm{detect}}+E_{\mathrm{ADC}}+E_{\mathrm{DAC}}+
E_{\mathrm{control}}+E_{\mathrm{digital}}+E_{\mathrm{thermal}}+
E_{\mathrm{facility}}+E_{\mathrm{embodied}},
$$

with every term in joules [J]. $E_{\mathrm{prop}}$ includes only powered
propagation elements; passive transmission loss instead raises source or
amplifier demand. Amortized embodied energy is

$$
E_{\mathrm{embodied}}=
\frac{E_{\mathrm{manufacture}}+E_{\mathrm{package}}+E_{\mathrm{replace}}-
E_{\mathrm{recovery}}}{N_{\mathrm{accepted,lifetime}}},
$$

where numerator terms are joules [J] and $N_{\mathrm{accepted,lifetime}}$ is the
count of accepted service units over measured or conservatively modeled life.

## Audit-local claim ledger

### OPTIC-001 — Inference is conditional on a measurement operator

- **Status:** established.
- **Statement:** an image or sensor tensor is generated by a physical operator,
  noise process, and acquisition policy; reconstructing a latent scene therefore
  requires those states or assumptions about them.
- **Primary sources:** [Fienup 1982](https://doi.org/10.1364/AO.21.002758),
  [Antipa et al. 2018](https://doi.org/10.1364/OPTICA.5.000001), and
  [Ahmed, Recht, and Romberg 2014](https://doi.org/10.1109/TIT.2013.2294644).
- **Rationale:** phase retrieval, lensless imaging, and blind deconvolution make
  operator dependence explicit. Their solution conditions differ, but none
  licenses discarding acquisition metadata.
- **Open issue:** how much of a high-dimensional operator can be compacted while
  preserving every downstream query of interest?
- **AI/system translation:** route the raw observation with an immutable operator
  version, uncertainty envelope, exposure, and preprocessing lineage.
- **Strong null:** attach ordinary sensor metadata and use a calibrated digital
  likelihood or differentiable simulator.
- **Deduplication:** P-013 and P-012; Candidates 014, 017, and 018.
- **Decisive test:** induce operator changes hidden from one method but visible to
  another; compare calibration, abstention, and task loss at equal storage and
  compute.

### OPTIC-002 — Finite apertures provide finite spatial information channels

- **Status:** established.
- **Statement:** wavelength, aperture, field of view, sampling, coherence, and
  noise jointly limit distinguishable spatial modes; pixel count alone does not
  measure recoverable information.
- **Primary sources:** [Cox and Sheppard 1986](https://doi.org/10.1364/JOSAA.3.001152),
  [Miller 2000](https://doi.org/10.1364/AO.39.001681), and
  [Donoho and Stark 1989](https://doi.org/10.1137/0149053).
- **Rationale:** space–bandwidth and communication-mode analyses bound orthogonal
  channels, while uncertainty results expose the trade between simultaneous
  concentration in conjugate domains.
- **Open issue:** task-specific decisions can require fewer modes than faithful
  reconstruction; their limit depends on the scene and loss distribution.
- **AI/system translation:** size latent channels against calibrated optical modes
  and task information, not against nominal pixels or reconstructed voxels.
- **Strong null:** a conventional imager matched for aperture, detector area,
  exposure, and optimal digital task head.
- **Deduplication:** P-001 and P-010; Candidates 013 and 017.
- **Decisive test:** compare task information and error as aperture, photon count,
  and scene bandwidth are crossed independently.

### OPTIC-003 — Null-space content is not recovered from measurement alone

- **Status:** established.
- **Statement:** if two admissible states produce the same likelihood under the
  calibrated operator, observations cannot distinguish them without an added
  prior, intervention, or measurement.
- **Primary sources:** [Donoho and Stark 1989](https://doi.org/10.1137/0149053),
  [Bruck and Sodin 1979](https://doi.org/10.1016/0030-4018(79)90058-0), and
  [Candès, Romberg, and Tao 2006](https://doi.org/10.1002/cpa.20124).
- **Rationale:** nonuniqueness is structural, not an optimization inconvenience.
  A generator can select a plausible representative but cannot convert that
  selection into measurement evidence.
- **Open issue:** operational systems need compact, intelligible summaries of
  task-relevant equivalence classes rather than enormous null-space bases.
- **AI/system translation:** return posterior alternatives, interval bounds, or
  abstention when actions depend on unresolved components.
- **Strong null:** calibrated Bayesian inference with posterior predictive checks
  and adversarial null-space examples.
- **Deduplication:** P-007 and P-013; Candidates 007, 014, and 017.
- **Decisive test:** construct pairs with identical measurements but different
  task labels; any confident separator without additional evidence fails.

### OPTIC-004 — Photon shot noise imposes square-root information scaling

- **Status:** established.
- **Statement:** under independent Poisson detection, signal grows linearly with
  expected detected photons while standard deviation grows as its square root.
- **Primary sources:** [Ober, Ram, and Ward 2004](https://doi.org/10.1016/j.bpj.2004.05.002),
  [Sharma and Piestun 2010](https://doi.org/10.1364/OL.35.003306), and
  [Wei et al. 2020](https://doi.org/10.1103/PhysRevA.102.043516).
- **Rationale:** Fisher-information and localization studies quantify limits under
  explicit photon models. They do not make every optical detector Poisson-limited.
- **Open issue:** background, coherent noise, dark current, read noise,
  afterpulsing, and temporal correlations dominate different regimes.
- **AI/system translation:** expose detected-photon budgets per route and train
  with the measured compound noise law.
- **Strong null:** a variance-stabilized likelihood or exact Poisson digital
  estimator using identical detected counts.
- **Deduplication:** P-001, P-006, and P-007; Candidates 007 and 009.
- **Decisive test:** sweep photons at fixed scenes and hardware, then compare
  empirical error and calibration against Poisson and measured-noise bounds.

### OPTIC-005 — Precision bounds are conditional, not universal resolution claims

- **Status:** established.
- **Statement:** Fisher information and Cramér–Rao bounds quantify precision only
  for the declared likelihood, parameterization, action, and estimator class.
- **Primary sources:** [Ober, Ram, and Ward 2004](https://doi.org/10.1016/j.bpj.2004.05.002),
  [Sharma and Piestun 2010](https://doi.org/10.1364/OL.35.003306), and
  [Tsang, Nair, and Lu 2016](https://doi.org/10.1103/PhysRevX.6.031033).
- **Rationale:** engineered measurements can change Fisher information, including
  for source separation, but misspecification and nuisance parameters change the
  attainable bound.
- **Open issue:** tractable bounds for learned, nonparametric scenes under operator
  uncertainty remain hard.
- **AI/system translation:** select measurements by task-conditioned information
  while reporting nuisance parameters and misspecification tests.
- **Strong null:** optimal conventional estimation and a measurement designed
  directly from Fisher information.
- **Deduplication:** P-001 and P-007; Candidates 007 and 014.
- **Decisive test:** preregister the model, estimate empirical bias and covariance,
  and repeat after withheld nuisance and calibration shifts.

### OPTIC-006 — Active illumination can buy information, but spends a real budget

- **Status:** established.
- **Statement:** changing illumination time, angle, spectrum, phase, or pattern can
  alter identifiability and task information; improvement must be charged to
  photons, dose, actuation, time, and inference.
- **Primary sources:** [Velten et al. 2012](https://doi.org/10.1038/ncomms1747),
  [Kirmani et al. 2014](https://doi.org/10.1126/science.1246774), and
  [Fienup 1982](https://doi.org/10.1364/AO.21.002758).
- **Rationale:** time-resolved and structured measurements reveal dimensions that
  passive intensity frames do not, but require active sources and calibrated
  temporal or spatial codes.
- **Open issue:** learned policies can exploit simulator errors or unsafe exposure
  shortcuts unless physical dose and coverage are constrained.
- **AI/system translation:** treat sensing as a costed action with expected task
  value and a safe passive fallback.
- **Strong null:** fixed optimal design, greedy information gain, Bayesian design,
  POMDP planning, and exhaustive scanning on the same budget.
- **Deduplication:** P-001 and P-007; Candidates 004, 007, 012, and 014.
- **Decisive test:** compare policies on held-out materials and dynamics under
  matched photons, dose, time, actuator cycles, and complete energy.

### OPTIC-007 — Compressive recovery trades samples for a structural prior

- **Status:** established.
- **Statement:** recovery from fewer linear measurements is guaranteed only when
  the signal class and measurement ensemble satisfy stated sparsity, incoherence,
  restricted-isometry, noise, or related conditions.
- **Primary sources:** [Donoho 2006](https://doi.org/10.1109/TIT.2006.871582),
  [Candès, Romberg, and Tao 2006](https://doi.org/10.1002/cpa.20124), and
  [Duarte et al. 2008](https://doi.org/10.1109/MSP.2007.914730).
- **Rationale:** compressed sensing avoids sampling every coefficient by assuming
  low-dimensional structure. It is not compression without assumptions or cost.
- **Open issue:** real scenes can be only approximately sparse, dynamic during
  sequential masks, or shifted from the learned representation.
- **AI/system translation:** make the structural prior and its violation detector
  part of the observation contract.
- **Strong null:** direct sampling plus conventional compression, adaptive sparse
  sampling, and a matched digital estimator.
- **Deduplication:** P-001, P-010, and P-012; Candidates 014, 017, and 018.
- **Decisive test:** cross sparsity, coherence, motion, photon regime, and prior
  mismatch; report failure detection as well as reconstruction score.

### OPTIC-008 — Phase retrieval has symmetry and ambiguity classes

- **Status:** established.
- **Statement:** intensity-only measurements discard phase and can leave global
  phase, shift, conjugate-reflection, factorization, or support ambiguities unless
  measurement diversity and constraints remove them.
- **Primary sources:** [Bruck and Sodin 1979](https://doi.org/10.1016/0030-4018(79)90058-0),
  [Fienup 1982](https://doi.org/10.1364/AO.21.002758), and
  [Candès, Li, and Soltanolkotabi 2015](https://doi.org/10.1109/TIT.2015.2399924).
- **Rationale:** algorithmic convergence is distinct from uniqueness, global
  optimality, and fidelity under physical coded-diffraction measurements.
- **Open issue:** practical identifiability under Poisson noise, partial coherence,
  unknown support, and calibration error is system-specific.
- **AI/system translation:** represent symmetry classes and acquire a diversity
  measurement when the downstream decision is not invariant to them.
- **Strong null:** hybrid input–output, Wirtinger flow, PhaseLift-class solvers,
  ptychography, interferometry, and phase diversity.
- **Deduplication:** P-003, P-007, and P-013; Candidates 007, 014, and 017.
- **Decisive test:** use adversarial ambiguous pairs and physical perturbations;
  score class coverage, uncertainty, and added-measurement cost.

### OPTIC-009 — Computational imaging co-design moves burden across the boundary

- **Status:** established.
- **Statement:** masks, diffusers, coded pupils, or illumination can encode scene
  variables for computational recovery, exchanging optical thickness or mechanics
  for calibration, compute, priors, photons, and artifacts.
- **Primary sources:** [Fenimore and Cannon 1978](https://doi.org/10.1364/AO.17.000337),
  [Asif et al. 2015](https://openaccess.thecvf.com/content_iccv_2015_workshops/w18/html/Asif_FlatCam_Replacing_Lenses_ICCV_2015_paper.html),
  and [Antipa et al. 2018](https://doi.org/10.1364/OPTICA.5.000001).
- **Rationale:** physical encoding and digital inversion are one instrument. A
  thinner front end is not automatically more informative or energy-efficient.
- **Open issue:** learned co-design often optimizes a simulation and data
  distribution that underrepresent manufacturing and environmental shift.
- **AI/system translation:** optimize acquisition and inference jointly but retain
  a hard physical calibration and identifiability audit.
- **Strong null:** best conventional optics plus a task head, and the same learned
  decoder with identity or standard optical front ends.
- **Deduplication:** P-010 and P-013; Candidates 006, 014, and 017.
- **Decisive test:** manufacture multiple devices and test held-out scenes under
  matched volume, aperture, photons, compute, latency, and energy.

### OPTIC-010 — Physical super-resolution changes the acquisition conditions

- **Status:** established.
- **Statement:** STED, PALM, and STORM obtain sub-diffraction localization or
  structure by using nonlinear depletion, photoswitching, sparse activation, and
  repeated acquisitions; they do not recover arbitrary lost frequencies from one
  ordinary passive frame.
- **Primary sources:** [Hell and Wichmann 1994](https://doi.org/10.1364/OL.19.000780),
  [Betzig et al. 2006](https://doi.org/10.1126/science.1127344), and
  [Rust, Bates, and Zhuang 2006](https://doi.org/10.1038/nmeth929).
- **Rationale:** these methods create distinguishability through controlled
  photophysics and acquisition over time. Dose, labeling, drift, density, and
  sample dynamics are part of the result.
- **Open issue:** the appropriate boundary depends on whether the task values
  localization, topology, morphology, live dynamics, or visual appearance.
- **AI/system translation:** “beyond baseline resolution” must name the additional
  intervention, prior, and resource that makes it possible.
- **Strong null:** conventional diffraction-limited imaging with matched dose and
  optimal task inference, plus the established physical super-resolution method.
- **Deduplication:** P-003, P-007, and P-010; Candidates 006, 007, and 014.
- **Decisive test:** match dose and acquisition time, include motion and bleaching,
  and score task truth against an independent modality.

### OPTIC-011 — Computational super-resolution is prior-qualified

- **Status:** established.
- **Statement:** stable recovery beyond a measured bandwidth requires restrictions
  such as sparsity, positivity, separation, repeated shifted views, or a learned
  distribution; performance collapses where those restrictions fail.
- **Primary sources:** [Donoho 1992](https://doi.org/10.1137/0523074),
  [Candès and Fernandez-Granda 2014](https://doi.org/10.1002/cpa.21455), and
  [Morgenshtern and Candès 2016](https://doi.org/10.1137/15M1016552).
- **Rationale:** mathematical guarantees explicitly bind recovery to source
  spacing, sign, noise, and signal class. A learned decoder makes analogous but
  often less visible distributional commitments.
- **Open issue:** perceptual metrics can reward plausible invented detail and are
  especially unsafe for evidence-bearing reconstruction.
- **AI/system translation:** label recovered high-frequency content by support:
  measured, intervention-derived, prior-dominated, or unresolved.
- **Strong null:** task inference directly from low-resolution data, classical
  regularization, multi-frame reconstruction, and posterior sampling.
- **Deduplication:** P-007 and P-013; Candidates 014, 017, and 018.
- **Decisive test:** use measurement-equivalent scenes with different fine detail;
  score coverage and false-detail rate, not only average perceptual quality.

### OPTIC-012 — Multiplex advantage depends on the dominant noise source

- **Status:** established.
- **Statement:** measuring many channels together can improve SNR when detector
  noise dominates, but strong source photon noise can be distributed across
  recovered channels and remove or reverse that advantage.
- **Primary sources:** [Decker and Harwit 1968](https://doi.org/10.1364/AO.7.002205)
  and [Voigtman and Winefordner 1987](https://doi.org/10.1366/0003702874447509).
- **Rationale:** Fellgett-style multiplex gain is conditional. Throughput,
  detector-noise, shot-noise, spectrum shape, and decoding matrix all matter.
- **Open issue:** analogous wavelength- and spatial-multiplexed compute claims
  frequently omit the source, crosstalk, and receiver-noise regime.
- **AI/system translation:** route to multiplexed hardware only from an online
  estimate of the complete noise and occupancy regime.
- **Strong null:** sequential or parallel direct channels using the same total
  detector area, bandwidth, time, and photons.
- **Deduplication:** P-001, P-002, and P-011; Candidates 001 and 013.
- **Decisive test:** cross detector noise, shot noise, channel occupancy, and
  dynamic range; publish SNR per channel and complete joules per accepted output.

### OPTIC-013 — Coded apertures exchange focusing for multiplexed inversion

- **Status:** established.
- **Statement:** coded apertures can provide throughput and field advantages where
  focusing optics are unavailable, but background, partial coding, finite detector
  extent, sampling, mask opacity, and decoder mismatch set artifacts and SNR.
- **Primary sources:** [Fenimore and Cannon 1978](https://doi.org/10.1364/AO.17.000337)
  and [Fenimore and Cannon 1981](https://doi.org/10.1364/AO.20.001858).
- **Rationale:** uniformly redundant arrays control autocorrelation sidelobes under
  stated sampling assumptions. They do not eliminate photon background or
  calibration error.
- **Open issue:** learned masks may overfit a scene class or exploit detector-
  specific artifacts that disappear across devices.
- **AI/system translation:** learn or select acquisition codes against a measured
  operator ensemble and explicit worst-case crosstalk constraint.
- **Strong null:** pinhole, focusing optics where physically possible, raster scan,
  random codes, and analytically designed URA/Hadamard codes.
- **Deduplication:** P-004, P-008, and P-010; Candidates 006 and 014.
- **Decisive test:** compare code families across background, off-axis sources,
  mask errors, detector defects, and operator shift at equal photons and area.

### OPTIC-014 — Adaptive optics is a bandwidth- and delay-limited control loop

- **Status:** established.
- **Statement:** wavefront correction requires sensing or estimating aberration,
  computing a command, actuating a corrector, and closing the loop faster and more
  accurately than the relevant disturbance dynamics.
- **Primary sources:** [Babcock 1953](https://doi.org/10.1086/126606),
  [Le Roux et al. 2004](https://doi.org/10.1364/JOSAA.21.001261), and
  [Correia et al. 2013](https://doi.org/10.1016/j.automatica.2012.03.030).
- **Rationale:** fitting error, measurement noise, delay, anisoplanatism, actuator
  limits, and unmodeled dynamics remain even with an accurate nominal inverse.
- **Open issue:** learned predictors can improve temporal prediction but may fail
  abruptly under nonstationary turbulence or mechanical disturbances.
- **AI/system translation:** treat perception adaptation as closed-loop control
  with explicit delay, authority, disturbance model, stability, and fallback.
- **Strong null:** integrator, LQG/Kalman, model-predictive, and data-driven linear
  predictive controllers using the same wavefront sensor and actuator.
- **Deduplication:** P-006, P-007, and P-009; Candidates 003, 009, 011, and 012.
- **Decisive test:** inject known disturbances across temporal frequency and
  amplitude; compare residual error, stability margin, energy, and recovery time.

### OPTIC-015 — Sensorless correction can optimize the wrong image metric

- **Status:** plausible.
- **Statement:** image-based adaptive optics can estimate correction without a
  separate wavefront sensor, but the chosen sharpness or task metric can have
  local optima, scene dependence, and confounding with object structure.
- **Primary sources:** [Booth 2007](https://doi.org/10.1364/OL.32.000005),
  [Débarre, Booth, and Wilson 2007](https://doi.org/10.1364/OE.15.008176), and
  [Thayil et al. 2011](https://doi.org/10.2971/jeos.2011.11045).
- **Rationale:** metric optimization is experimentally effective in scoped
  microscopes. General task benefit and unique wavefront recovery do not follow.
- **Open issue:** a learned task metric can reward hallucinated or class-specific
  detail while degrading measurement fidelity.
- **AI/system translation:** use multiple residual and task channels, protected
  reference targets, and a rollbackable correction state.
- **Strong null:** direct wavefront sensing, phase diversity, modal search, and a
  conventional sharpness metric with identical actuator evaluations.
- **Deduplication:** P-006, P-007, and P-009; Candidates 003, 009, and 014.
- **Decisive test:** conceal scene classes, insert metric-adversarial objects, and
  validate wavefront and task performance with independent measurements.

### OPTIC-016 — Blind calibration is bilinear and can be non-identifiable

- **Status:** established.
- **Statement:** jointly estimating a scene and an unknown transfer function
  introduces scale, shift, factorization, and model ambiguities unless diversity,
  subspace structure, references, or other constraints restore identifiability.
- **Primary sources:** [Ahmed, Recht, and Romberg 2014](https://doi.org/10.1109/TIT.2013.2294644)
  and [Fienup 1993](https://doi.org/10.1364/AO.32.001737).
- **Rationale:** self-calibration can work under explicit structural conditions;
  unconstrained joint fitting can explain errors by changing either scene or
  instrument.
- **Open issue:** large learned priors can conceal rather than resolve the
  ambiguity because they make one explanation look more plausible.
- **AI/system translation:** keep calibration variables causally separated from
  scene variables and include independent references or interventions.
- **Strong null:** laboratory calibration, reference channels, alternating
  minimization, convex blind deconvolution, and periodic known-target tests.
- **Deduplication:** P-003, P-009, and P-013; Candidates 009, 010, and 014.
- **Decisive test:** cross unseen scenes with unseen device perturbations; require
  correct attribution, not just low reconstruction residual.

### OPTIC-017 — Drift requires monitored, versioned recalibration

- **Status:** established.
- **Statement:** alignment, source intensity, detector response, wavelength,
  temperature, stress, and aging change the deployed forward operator, so a
  one-time calibration cannot be presumed valid indefinitely.
- **Primary sources:** [Bogaerts and Chrostowski 2018](https://doi.org/10.1002/lpor.201700237),
  [Hughes et al. 2018](https://doi.org/10.1364/OPTICA.5.000864), and
  [Teofilovic et al. 2024](https://doi.org/10.1364/JLT.42.007816).
- **Rationale:** photonic circuits are sensitive to geometric and thermal
  variation; in-situ and compensation methods explicitly measure this problem.
- **Open issue:** task residuals often detect change late and cannot localize its
  physical cause without dedicated probes.
- **AI/system translation:** version every operator, monitor references and
  residuals, and define recalibration, abstention, and digital fallback thresholds.
- **Strong null:** fixed schedule, control charts, reference photodiodes, digital
  calibration tables, and redundant sensors.
- **Deduplication:** P-006 and P-009; Candidates 003, 009, 010, 011, and 014.
- **Decisive test:** impose blind temperature, wavelength, alignment, and aging
  trajectories; score detection delay, false alarms, task loss, and recalibration
  energy.

### OPTIC-018 — Saturation, full well, dead time, and pile-up are information loss

- **Status:** established.
- **Statement:** clipped pixels and rate-limited photon counters map multiple
  incident fluxes to indistinguishable outputs; post-processing cannot uniquely
  recover the lost amplitude without additional exposure, coding, or prior.
- **Primary sources:** [Debevec and Malik 1997](https://doi.org/10.1145/258734.258884),
  [Heide et al. 2018](https://doi.org/10.1038/s41598-018-35212-x), and
  [Taguchi et al. 2013](https://doi.org/10.1118/1.4818943).
- **Rationale:** multiexposure HDR changes acquisition, while SPAD pile-up models
  explicitly account for missed events during dead time.
- **Open issue:** learned HDR can generate plausible highlights whose evidential
  basis is prior rather than measurement.
- **AI/system translation:** propagate saturation masks, censored likelihoods,
  dead-time state, and exposure alternatives into downstream inference.
- **Strong null:** bracketing, neutral-density or split-exposure sensors, censored
  maximum likelihood, and conventional pile-up correction.
- **Deduplication:** P-001, P-006, and P-013; Candidates 007, 009, and 014.
- **Decisive test:** use scenes with measurement-equivalent clipping but different
  true radiance; score interval coverage and false-detail rate.

### OPTIC-019 — Sensor fusion must account for shared error and alignment

- **Status:** established.
- **Statement:** multiple sensors improve inference only to the extent that their
  information is complementary and their timing, frames, calibration, and error
  dependence are modeled; double-counting correlated evidence creates
  overconfidence.
- **Primary sources:** [Kalman 1960](https://doi.org/10.1115/1.3662552) and
  [Julier and Uhlmann 1997](https://doi.org/10.1109/ACC.1997.609105).
- **Rationale:** optimal linear fusion relies on covariance assumptions;
  covariance intersection was introduced for unknown cross-correlation.
- **Open issue:** neural fusion can conceal modality leakage, timestamp errors,
  common-mode weather, or shared training-set bias.
- **AI/system translation:** store frame transforms, time uncertainty, provenance,
  and cross-covariance assumptions with every fused state.
- **Strong null:** single best sensor, late fusion, covariance-aware Kalman/factor
  graph, covariance intersection, and modality-dropout training.
- **Deduplication:** P-002, P-011, and P-013; Candidates 002, 014, and 015.
- **Decisive test:** cross missing modalities, latency, frame error, and correlated
  bias; score calibration and graceful degradation, not only nominal accuracy.

### OPTIC-020 — Passive optics can execute fixed linear transforms in propagation

- **Status:** established.
- **Statement:** diffraction, interference, Fourier planes, and interferometer
  meshes can implement structured or programmable linear maps with high physical
  parallelism and low incremental propagation energy.
- **Primary sources:** [Shen et al. 2017](https://doi.org/10.1038/nphoton.2017.93),
  [Lin et al. 2018](https://doi.org/10.1126/science.aat8084), and
  [Miller 2013](https://doi.org/10.1364/PRJ.1.000001).
- **Rationale:** the demonstrated physical map is real. Its usefulness depends on
  source, modulation, detector, precision, loss, programmability, and utilization.
- **Open issue:** nominal operation count is ambiguous for dense wave interference
  and cannot substitute for task throughput or energy.
- **AI/system translation:** compile stable, dense, high-reuse linear operators to
  optics only when the end-to-end regime supports them.
- **Strong null:** FFT/convolution algorithms and matched digital ASIC/FPGA/GPU at
  the same precision, batch, sparsity, and accepted-output rate.
- **Deduplication:** P-010; Candidates 001, 006, and 013.
- **Decisive test:** measure wall-plug acquisition-to-output energy and latency
  across utilization, matrix shape, precision, and operator-update frequency.

### OPTIC-021 — Direct optical task paths can avoid some conversions

- **Status:** plausible.
- **Statement:** when information already arrives optically and the required task
  output is low-dimensional, a matched optical or optoelectronic front end can
  avoid full-frame digitization, memory traffic, or reconstruction.
- **Primary sources:** [Ashtiani, Geers, and Aflatouni 2022](https://doi.org/10.1038/s41586-022-04714-0)
  and [Chang et al. 2018](https://doi.org/10.1038/s41598-018-30619-y).
- **Rationale:** direct sensor-to-classifier demonstrations establish a path, not
  general superiority. Small tasks, fixed operators, and optical input already at
  the device boundary are favorable conditions.
- **Open issue:** losing reconstructable raw data can impair audit, transfer, and
  recovery when future questions differ from the compiled task.
- **AI/system translation:** create reflex-like optical paths only beside a
  recoverability policy and a slower digital route.
- **Strong null:** low-resolution regions of interest, event cameras, analog sensor
  processing, early-exit digital models, and task-specific ASICs.
- **Deduplication:** P-001, P-010, and P-012; Candidates 006, 012, 017, and 018.
- **Decisive test:** include task change, incident response, raw-data retention,
  conversion, and retraining in the service-level comparison.

### OPTIC-022 — Optical-core energy is not system energy

- **Status:** disputed.
- **Statement:** sub-photon-per-multiplication and femtojoule optical-operation
  demonstrations do not by themselves establish lower wall-plug energy per useful
  inference because source efficiency, fan-out, loss, conversion, control, and
  digital work can dominate.
- **Primary sources:** [Wang et al. 2022](https://doi.org/10.1038/s41467-021-27774-8),
  which explicitly scopes its principal number to optical energy, and
  [Miller 2017](https://doi.org/10.1109/JLT.2017.2647779), which analyzes device and
  communication energy requirements.
- **Rationale:** the physical result is established at its stated boundary; the
  disputed move is extrapolating it to a complete deployed system.
- **Open issue:** integrated sources, nonvolatile weights, direct optical input,
  and low-dimensional output may materially shift the balance.
- **AI/system translation:** preserve a boundary-labeled energy vector and forbid
  comparisons that mix optical-core, chip, board, node, and facility scopes.
- **Strong null:** measured wall-plug digital accelerator with identical task,
  accuracy, batch, throughput, precision, and duty cycle.
- **Deduplication:** P-010; Candidates 006 and 013.
- **Decisive test:** instrument every rail and source at steady state and during
  calibration, then amortize idle and setup energy over accepted outputs.

### OPTIC-023 — Conversion precision and rate can dominate a hybrid path

- **Status:** established.
- **Statement:** DACs, modulators, photodetectors, transimpedance amplifiers, ADCs,
  serialization, and memory are functional parts of a photonic accelerator; their
  energy and bandwidth generally depend on sample rate, precision, and channel
  count.
- **Primary sources:** [Xu et al. 2019](https://doi.org/10.1038/s41377-019-0176-4),
  [Hamerly et al. 2019](https://doi.org/10.1103/PhysRevX.9.021032), and
  [Nahmias et al. 2020](https://doi.org/10.1109/JSTQE.2019.2941485).
- **Rationale:** optical linear algebra surrounded by electronic encoding and
  readout is a hybrid system. Lower precision can reduce cost, but it also changes
  model quality and calibration sensitivity.
- **Open issue:** converter sharing and analog accumulation reduce conversions but
  can increase fan-in range, noise, latency, or inflexibility.
- **AI/system translation:** place conversion boundaries by task-required
  precision and signal locality, not by a preference for optical or digital labels.
- **Strong null:** quantized digital inference and analog/mixed-signal electronic
  accelerators with the same effective number of bits and memory boundary.
- **Deduplication:** P-001, P-010, and P-012; Candidates 006, 013, and 017.
- **Decisive test:** sweep effective precision, conversion frequency, matrix size,
  and reuse; report accepted task outputs per wall-plug joule.

### OPTIC-024 — Analog errors compose across depth and fan-in

- **Status:** established.
- **Statement:** loss, phase error, amplitude error, shot noise, detector noise,
  crosstalk, and quantization perturb analog optical computations; cascaded layers
  require a measured error and gain budget.
- **Primary sources:** [Shen et al. 2017](https://doi.org/10.1038/nphoton.2017.93),
  [Hamerly et al. 2019](https://doi.org/10.1103/PhysRevX.9.021032), and
  [Feldmann et al. 2021](https://doi.org/10.1038/s41586-020-03070-1).
- **Rationale:** proof-of-concept classifiers demonstrate useful tolerance at one
  scale. They do not imply precision or cascadability independent of network size.
- **Open issue:** error-aware training can absorb stationary error while masking
  reduced margin to drift and distribution shift.
- **AI/system translation:** compile only operators whose task sensitivity fits a
  measured hardware-error envelope; verify at the physical output.
- **Strong null:** noise-aware quantized digital models and error-corrected analog
  electronic accelerators.
- **Deduplication:** P-006 and P-010; Candidates 003, 009, and 013.
- **Decisive test:** scale depth, fan-in, wavelength count, and path loss while
  holding task and total power fixed; measure calibration and tail failures.

### OPTIC-025 — Fabrication variation makes nominally identical circuits different

- **Status:** established.
- **Statement:** waveguide dimensions, thickness, refractive index, couplers,
  resonators, and phase shifters vary across dies and wafers, perturbing transfer
  functions and yield.
- **Primary sources:** [Bogaerts and Chrostowski 2018](https://doi.org/10.1002/lpor.201700237)
  and [Chrostowski and Hochberg 2015](https://doi.org/10.1017/CBO9781316084168.012).
- **Rationale:** design-for-manufacture, trimming, tuning, and calibration exist
  because the ideal layout is not the deployed operator.
- **Open issue:** papers often report one selected device without distributional
  yield, packaging, or replacement costs.
- **AI/system translation:** train and validate over measured device ensembles;
  preserve per-device operator identity and fallback eligibility.
- **Strong null:** binning, digital calibration, robust design, redundant paths,
  post-fabrication trimming, and conventional electronic tolerances.
- **Deduplication:** P-004, P-006, and P-009; Candidates 003, 009, 014, and 016.
- **Decisive test:** preregister the number of fabricated devices and report the
  full yield and performance distribution, not a best die.

### OPTIC-026 — Thermal tuning is control work with crosstalk

- **Status:** established.
- **Statement:** thermo-optic tuning can correct or program photonic circuits, but
  consumes static or dynamic power, shifts neighboring elements, and adds a
  temperature-dependent control problem.
- **Primary sources:** [Bogaerts and Chrostowski 2018](https://doi.org/10.1002/lpor.201700237),
  [Harris et al. 2014](https://doi.org/10.1364/OE.22.010487), and
  [Teofilovic et al. 2024](https://doi.org/10.1364/JLT.42.007816).
- **Rationale:** measured phase-shifter power and thermal crosstalk make clear that
  reconfiguration is not a free metadata update.
- **Open issue:** nonvolatile and electro-optic alternatives trade static power for
  write energy, loss, area, endurance, material integration, or drive voltage.
- **AI/system translation:** schedule photonic configuration with thermal state,
  neighboring-channel effect, reuse horizon, and write amortization.
- **Strong null:** fixed passive optics, carrier-depletion/electro-optic tuning,
  digital weights, and batch reuse of one programmed operator.
- **Deduplication:** P-006, P-009, P-010, and P-012; Candidates 001, 009, and 013.
- **Decisive test:** include warm-up, steady hold, retuning, thermal settling,
  cooling, and crosstalk compensation over the real workload trace.

### OPTIC-027 — In-situ optimization can absorb some hardware mismatch

- **Status:** plausible.
- **Statement:** measuring gradients or optimizing directly on a physical photonic
  system can reduce dependence on an exact digital twin and compensate some static
  device error.
- **Primary sources:** [Hughes et al. 2018](https://doi.org/10.1364/OPTICA.5.000864)
  and [Pai et al. 2023](https://doi.org/10.1126/science.ade8450).
- **Rationale:** adjoint and physical-gradient demonstrations establish workable
  protocols. They do not eliminate readout, training data, perturbation, control,
  drift, or convergence costs.
- **Open issue:** online adaptation can overwrite a validated state or fit transient
  noise unless it is bounded and versioned.
- **AI/system translation:** make physical calibration updates staged, reversible,
  independently evaluated, and energy-accounted.
- **Strong null:** digital hardware-aware training, finite-difference calibration,
  black-box optimization, lookup tables, and periodic supervised recalibration.
- **Deduplication:** P-003, P-005, P-006, and P-009; Candidates 009, 010, and 011.
- **Decisive test:** compare methods across static fabrication error and dynamic
  drift at equal calibration examples, perturbations, wall time, and energy.

### OPTIC-028 — “Neuromorphic photonics” does not establish a neural advantage

- **Status:** disputed.
- **Statement:** optical excitability, spikes, wavelength broadcast, or laser
  dynamics can implement useful temporal transforms, but neuron-like terminology
  alone does not demonstrate better learning, control, accuracy, or energy than
  conventional photonic signal processing and digital recurrent models.
- **Primary sources:** [Tait et al. 2014](https://doi.org/10.1109/JLT.2014.2345652),
  [Feldmann et al. 2019](https://doi.org/10.1038/s41586-019-1157-8), and
  [Shastri et al. 2021](https://doi.org/10.1038/s41566-020-00754-y).
- **Rationale:** device dynamics and network demonstrations are real; the disputed
  inference is that biological naming supplies a distinct computational benefit.
- **Open issue:** temporal tasks aligned to native device dynamics may show a
  residual after matched reservoir, DSP, and digital spiking baselines.
- **AI/system translation:** characterize the measured state-space kernel,
  bandwidth, memory, noise, and energy without biological proxy metrics.
- **Strong null:** linear filters, reservoir computing, state-space models,
  digital spiking networks, RF photonics, and matched DSP.
- **Deduplication:** P-003, P-011, and P-012; Candidates 002, 006, and 013.
- **Decisive test:** system identification plus held-out temporal tasks at matched
  state dimension, latency, training, precision, and wall-plug energy.

### OPTIC-029 — Hardware routing should be operator- and workload-matched

- **Status:** plausible.
- **Statement:** a hybrid scheduler can benefit by routing stable, dense, high-
  reuse linear transforms with native optical input to photonics while retaining
  sparse, precise, rapidly changing, control-heavy, or audit-critical work in
  digital paths.
- **Primary sources:** [Xu et al. 2021](https://doi.org/10.1038/s41586-020-03063-0),
  [Feldmann et al. 2021](https://doi.org/10.1038/s41586-020-03070-1), and
  [Ashtiani, Geers, and Aflatouni 2022](https://doi.org/10.1038/s41586-022-04714-0).
- **Rationale:** demonstrations show several favorable regimes, but no universal
  route. Configuration, conversion, utilization, and precision decide crossover.
- **Open issue:** routing overhead and workload prediction can erase gains for
  short or nonstationary jobs.
- **AI/system translation:** learn a conservative hardware policy from measured
  service curves and expose why each route is eligible.
- **Strong null:** static routing, compiler cost models, digital-only heterogeneous
  acceleration, and oracle routing with perfect future workload knowledge.
- **Deduplication:** P-001, P-002, P-010, and P-012; Candidates 001 and 013.
- **Decisive test:** replay real arrival traces across matrix shapes, reuse,
  precision, and drift; compare tail latency and joules per accepted result.

### OPTIC-030 — Physical offloading reduces digital work only when information is local

- **Status:** plausible.
- **Statement:** an optical front end can reduce digitized data and downstream
  arithmetic when it computes a sufficient task statistic before conversion, but
  it may destroy information needed for audit, adaptation, or future tasks.
- **Primary sources:** [Chang et al. 2018](https://doi.org/10.1038/s41598-018-30619-y),
  [Lin et al. 2018](https://doi.org/10.1126/science.aat8084), and
  [Ashtiani, Geers, and Aflatouni 2022](https://doi.org/10.1038/s41586-022-04714-0).
- **Rationale:** task-specific optical processing is a form of lossy compilation.
  Its value depends on the query set and reconstructability obligation.
- **Open issue:** sufficiency under one training distribution can fail under task
  or environment change.
- **AI/system translation:** pair each physical compression with a query registry,
  retained uncertainty, and escalation route to richer sensing.
- **Strong null:** learned sensor compression, regions of interest, event-driven
  readout, early-exit networks, and semantic codecs.
- **Deduplication:** P-010, P-012, and P-013; Candidates 006, 017, and 018.
- **Decisive test:** after deployment, introduce unregistered but safety-relevant
  queries; measure recovery, storage, energy, and failure detectability.

### OPTIC-031 — Uncertainty must distinguish noise, prior, and operator error

- **Status:** plausible.
- **Statement:** one confidence scalar is insufficient for inverse sensing because
  observation noise, null-space ambiguity, prior extrapolation, calibration
  uncertainty, and temporal drift call for different interventions.
- **Primary sources:** [Kaipio and Somersalo 2005](https://doi.org/10.1007/b138659),
  [Ahmed, Recht, and Romberg 2014](https://doi.org/10.1109/TIT.2013.2294644), and
  [Tsang, Nair, and Lu 2016](https://doi.org/10.1103/PhysRevX.6.031033).
- **Rationale:** inverse-problem uncertainty and experiment design separate what
  another photon, another measurement geometry, a recalibration, or a better prior
  could resolve.
- **Open issue:** scalable decomposition for large learned inverse models remains
  an engineering and statistical challenge.
- **AI/system translation:** expose typed uncertainty linked to allowed actions:
  integrate longer, change view, calibrate, query memory, abstain, or escalate.
- **Strong null:** posterior predictive checks, ensembles, conformal prediction,
  residual diagnostics, and deterministic condition-number thresholds.
- **Deduplication:** P-002, P-007, and P-013; Candidates 003, 007, 009, and 014.
- **Decisive test:** inject each uncertainty source separately and score source
  identification, calibration, chosen intervention, and cost.

### OPTIC-032 — Full lifecycle accounting can reverse a component-level ranking

- **Status:** established.
- **Statement:** source, conversion, control, thermal stabilization, cooling,
  calibration, utilization, yield, package, and embodied manufacture can change
  the energy ranking inferred from a passive optical core.
- **Primary sources:** [Williams, Ayres, and Heller 2002](https://doi.org/10.1021/es025643o),
  [Bogaerts and Chrostowski 2018](https://doi.org/10.1002/lpor.201700237), and
  [Wang et al. 2022](https://doi.org/10.1038/s41467-021-27774-8).
- **Rationale:** semiconductor manufacture has material and energy burden, while
  photonic systems add specialized packaging and calibration. Exact modern values
  are process- and vendor-specific and must be measured rather than copied.
- **Open issue:** public device-level studies rarely expose fab yield, packaging,
  field calibration, lifetime, and replacement data together.
- **AI/system translation:** require boundary-labeled operational and amortized
  lifecycle energy for every hardware claim.
- **Strong null:** matched digital service measured at the wall with identical
  availability, task quality, and amortization rules.
- **Deduplication:** P-009 and P-010; Candidates 006, 009, and 013.
- **Decisive test:** preregister the lifecycle inventory and conduct sensitivity
  analysis over lifetime, utilization, yield, electricity mix, and replacement.

## Negative results and boundary conditions

The following findings are not side notes; they define the failure surface of a
transfer.

1. **More reconstructed samples are not more independent information.**
   DiffuserCam reconstructs a large voxel grid from fewer sensor pixels by using
   a sparse scene model; its authors explicitly report scene-dependent effective
   resolution ([Antipa et al. 2018](https://doi.org/10.1364/OPTICA.5.000001)).
2. **Sparsity is not enough without geometry.** Super-resolution stability can
   deteriorate sharply with source clustering; separation or Rayleigh-regularity
   assumptions matter ([Donoho 1992](https://doi.org/10.1137/0523074);
   [Morgenshtern and Candès 2016](https://doi.org/10.1137/15M1016552)).
3. **Algorithmic convergence is not uniqueness.** Phase-retrieval iterations can
   decrease an error metric while remaining in an ambiguity class or wrong local
   solution ([Fienup 1982](https://doi.org/10.1364/AO.21.002758)).
4. **Multiplexing can lose under shot noise.** Strong broadband or line-source
   photon noise can contaminate recovered channels, reversing a detector-noise
   advantage ([Voigtman and Winefordner 1987](https://doi.org/10.1366/0003702874447509)).
5. **Super-resolution requires extra structure or intervention.** STED supplies a
   nonlinear depletion field; localization methods supply switchable sparse
   emitters and many frames. A one-frame learned reconstruction is a different
   evidential object.
6. **Saturation is censoring, not noise.** Once different fluxes produce the same
   clipped value, a decoder's specific brightness is prior-selected unless another
   exposure or code supplies evidence.
7. **Adaptive correction has a servo-lag floor.** Faster optical propagation does
   not remove sensing, estimation, actuator, and disturbance bandwidth limits.
8. **Self-calibration can fit the scene.** A low residual is compatible with the
   wrong factorization of object and operator in a blind inverse problem.
9. **In-situ training is not maintenance-free.** It trades digital-twin accuracy
   for physical measurements, control actions, labels or losses, and validation.
10. **Passive does not mean zero energy.** Passive propagation may be cheap, but
    insertion loss raises source demand and outputs still require detection or a
    physical downstream use.
11. **Optical speed is not decision latency.** An exposure, modulator, detector,
    converter, controller, and host can surround picosecond propagation.
12. **A photon-per-MAC number is not a wall-plug claim.** The cited sub-photon
    experiment explicitly centered optical energy; the full system boundary must
    be measured separately ([Wang et al. 2022](https://doi.org/10.1038/s41467-021-27774-8)).
13. **Biological vocabulary is not a baseline.** A photonic “synapse” or “spike”
    must beat matched signal-processing and state-space models on the task.
14. **Best-device reporting hides yield.** Fabrication variation, trimming,
    packaging, and replacement can dominate scaling economics and embodied cost.

## Construct-validity traps

| Trap | Why it fails | Required repair |
| --- | --- | --- |
| pixel or voxel count as resolution | oversampling and priors can create many correlated values | modulation transfer, two-point task, information, or localization criterion with photon budget |
| PSNR as truth | average distortion can miss invented or erased task-critical detail | independent ground truth, task score, calibration, and ambiguity coverage |
| simulation operator as hardware | misalignment, fabrication, wavelength, detector, and thermal effects are omitted | multiple physical devices and withheld perturbations |
| photons launched as photons used | loss and detector efficiency alter information | incident, transmitted, absorbed, and detected counts |
| optical joules as wall joules | lasers, drivers, conversion, control, and cooling are omitted | rail-level wall-plug measurement |
| MAC/s as throughput | analog interference products may not be independent or precise enough | accepted outputs/s at fixed task quality |
| time of flight as latency | exposure and interfaces dominate many systems | trigger-to-accepted-output distribution |
| “all-optical” as boundary | training, programming, nonlinearities, and readout may be electronic | block-level energy and dataflow diagram |
| nominal bit depth as precision | ENOB, SNR, drift, and crosstalk determine effective precision | calibrated effective precision across range and time |
| one die as scalability | selected devices omit yield and variation | preregistered multi-die distribution |
| more sensors as more evidence | shared bias and misregistration can double-count error | cross-covariance and frame/time audit |
| sharpness as corrected truth | object texture can confound wavefront and image metric | independent wavefront or reference target |
| perceptual detail as recovered detail | generative priors choose one null-space representative | ambiguity set and false-detail test |
| lower acquisition data as lower lifecycle cost | source, control, manufacture, and recalibration may grow | complete service-unit lifecycle inventory |

## Exact principle disposition

| Principle | Optics/photonics disposition |
| --- | --- |
| P-001 selective allocation | active illumination, exposure, wavelength, and hardware routing are direct instances; no new principle |
| P-002 local autonomy with exception escalation | a front end can classify locally and escalate typed uncertainty or drift; no new principle |
| P-003 temporary trace before commitment | repeated exposures, phase iterations, and provisional calibration states are temporary evidence; no new principle |
| P-004 diversity, selection, and protection | coded measurements and measurement diversity instantiate protected alternatives; no new principle |
| P-005 use-dependent topology | in-situ tuning changes a physical or logical operator through use; no new principle |
| P-006 homeostatic negative feedback | adaptive optics and thermal stabilization are explicit negative-feedback control; no new principle |
| P-007 prediction-error allocation | residual-triggered sensing and recalibration are direct instances; no new principle |
| P-008 compartmentalized interaction | wavelength, spatial mode, and coded-channel isolation expose crosstalk constraints; no new principle |
| P-009 maintenance plane | calibration, reference channels, thermal control, and yield tracking are maintenance-plane work; no new principle |
| P-010 structural offloading and co-design | optical front ends and analog transforms are core examples; no new principle |
| P-011 transient communication coalitions | temporarily combined sensor, wavelength, or mode channels instantiate transient coalitions; no new principle |
| P-012 memory matched to information lifetime | configuration reuse, calibration retention, and raw-data retention are lifetime-matching cases; no new principle |
| P-013 externalized shared state | operator versions, calibration records, and uncertainty are shared external state; no new principle |

## Exact candidate disposition

| Candidate | Disposition from this audit |
| --- | --- |
| 001 adaptive logical topology | refine with measured optical/digital service curves, configuration cost, and drift eligibility |
| 002 multiscale context broadcast | wavelength/spatial broadcast is a physical transport case; require crosstalk and receiver budgets |
| 003 recovery dynamics as latent fragility sensing | add calibration-residual and thermal-drift recovery traces, while preventing scene-shift confounding |
| 004 closed endogenous curriculum | active-measurement policies can generate observations; compare against optimal experiment-design nulls |
| 005 severity-ordered containment and triage | saturation, unsafe dose, and calibration loss supply severity inputs; no distinct optics residual |
| 006 reversible physical skill compilation | optical operator programming is a direct fixture; charge write, verification, rollback, and raw-data loss |
| 007 intervention-aware surveillance | primary owner for active illumination and endogenous observation; add null-space and dose accounting |
| 008 audit-backed contestable modular allocation | hardware route allocation must expose measurement and energy evidence; no new mechanism |
| 009 versioned graded assurance envelopes | add photon, temperature, alignment, precision, and calibration validity ranges |
| 010 reset-coupled staged verification | optical recalibration or reprogramming needs reference tests before promotion |
| 011 dual-loop operational assurance | pair fast correction with slow calibration/yield monitoring |
| 012 latency-qualified authority envelopes | include exposure, servo lag, settling, conversion, and p95 end-to-end latency |
| 013 bidirectional deficit–capability routing | primary owner for optical/digital routing; use measured crossover surfaces |
| 014 versioned observation contracts | primary owner for operator, noise, illumination, saturation, calibration, and lineage |
| 015 versioned, repairable conventions | sensor frames, channel labels, and calibration schemas are conventions; no new candidate |
| 016 conflict-bounded unit transition | multi-die updates and thermal neighbors need bounded rollout, but this is ordinary deployment control |
| 017 contract-preserving semantic compaction | optical sufficient-statistic paths must preserve registered queries and uncertainty |
| 018 value- and reconstructability-aware artifact tiering | decide when raw measurements, calibration probes, or only task outputs survive |
| 019 audited cumulative inheritance | fabrication, calibration, and operator histories should be retained across device generations |
| 020 constitutionalized multi-level control plane | source, dose, actuator, thermal, and fallback limits belong in enforceable control policy |

## Equal-budget decisive experiment suite

### E-OPTIC-01 — Null-space honesty

Construct physical and simulated pairs $x_1,x_2$ for which the calibrated
likelihoods are indistinguishable within measurement uncertainty but the task
answer differs. Compare a learned inverse, regularized optimization, posterior
sampler, and active-measurement policy. Match training data and initial photons.
Score false specificity, posterior coverage, abstention, added photons, latency,
and task loss. The transfer survives only if it exposes ambiguity or buys a
decisive measurement more efficiently than the Bayesian/design nulls.

### E-OPTIC-02 — Prior-mismatch super-resolution ladder

Cross source separation, positivity, sparsity, texture family, motion, and photon
count. Compare direct low-resolution task inference, classical sparse and total-
variation solvers, multi-frame reconstruction, a learned inverse, and a generative
prior. Ground truth comes from an independent higher-information acquisition.
Report false-detail rate and calibration separately from perceptual metrics.

### E-OPTIC-03 — Active photon allocation

Give every policy the same source, safe-dose ceiling, actuator, calibration,
maximum photon count, wall time, and compute. Compare fixed acquisition, random
codes, greedy EVI, model-predictive/Bayesian design, and the proposed system.
Withhold materials and disturbance dynamics. Score utility gained per detected
photon, joule, second, and dose unit, plus failure detection.

### E-OPTIC-04 — Multiplex crossover map

On one instrument, vary detector noise, photon flux, spectral or spatial occupancy,
background, crosstalk, and saturation. Compare multiplexed and direct acquisition
at equal detector area, time, and incident photons. Publish the complete crossover
surface rather than one favorable point. Any learned router is evaluated against
an oracle and a simple analytical threshold.

### E-OPTIC-05 — Drift-aware reconstruction

Independently inject temperature, wavelength, source-power, alignment, detector-
gain, and scene-distribution changes. Compare fixed calibration, periodic
calibration, residual trigger, independent reference channel, online joint fit,
and digital fallback. Score attribution accuracy, detection delay, false alarms,
task loss before detection, recovery time, calibration samples, and energy.

### E-OPTIC-06 — Optical/digital crossover

Implement the same operator and task on photonic hardware and the strongest
available digital accelerator. Sweep matrix shape, batch, sparsity, effective
precision, input origin, output dimension, operator reuse, and utilization.
Measure every power rail, warm-up, programming, conversion, host control, cooling,
and idle. Report joules and p95 latency per accepted output at matched quality.

### E-OPTIC-07 — Multi-device fabrication and thermal audit

Preregister a device count before fabrication. Characterize transfer functions,
yield, trimming, tuning power, thermal crosstalk, and task quality for every die.
Blind the task team to die selection. Compare nominal-model training, hardware-
aware ensemble training, per-device calibration, and in-situ optimization. Include
failed dies and calibration time in the lifecycle denominator.

### E-OPTIC-08 — Physical compaction under future queries

Compare full raw capture, conventional digital compression, learned semantic
compression, and task-specific optical processing. Match current-task quality and
storage/energy budget. After freezing the systems, reveal new task queries and an
incident-investigation request. Score recoverability, uncertainty honesty,
additional acquisition feasibility, and total lifecycle cost.

## Recommended contract refinements

This audit does not warrant a new principle or candidate. It recommends five
concrete refinements:

1. **Candidate 014:** add an operator block containing calibration version,
   acquisition action, illumination, compound noise law, null-space summary,
   saturation/dead-time mask, timestamp, and validity envelope.
2. **Candidate 007:** require typed value of information and separately account
   photons, dose, actuation, latency, risk, and energy.
3. **Candidates 001 and 013:** route by measured end-to-end crossover surfaces,
   including configuration reuse, conversion, precision, drift, and utilization.
4. **Candidates 017 and 018:** treat physical front-end processing as potentially
   irreversible semantic compaction; register future queries and raw-data recovery
   obligations before deployment.
5. **Candidates 003, 009, and 011:** distinguish scene shift from instrument drift
   with reference channels, typed residuals, staged recalibration, and rollback.

## Primary-source bibliography

- Ahmed, A., Recht, B., and Romberg, J. (2014). Blind deconvolution using convex
  programming. *IEEE Transactions on Information Theory*, 60, 1711–1732.
  [DOI](https://doi.org/10.1109/TIT.2013.2294644)
- Antipa, N., Kuo, G., Heckel, R., Mildenhall, B., Bostan, E., Ng, R., and
  Waller, L. (2018). DiffuserCam: lensless single-exposure 3D imaging. *Optica*,
  5, 1–9. [DOI](https://doi.org/10.1364/OPTICA.5.000001)
- Ashtiani, F., Geers, A. J., and Aflatouni, F. (2022). An on-chip photonic deep
  neural network for image classification. *Nature*, 606, 501–506.
  [DOI](https://doi.org/10.1038/s41586-022-04714-0)
- Asif, M. S., Ayremlou, A., Veeraraghavan, A., Baraniuk, R. G., and
  Sankaranarayanan, A. C. (2015). FlatCam: replacing lenses with masks and
  computation. *ICCV Workshops*, 12–15.
  [Authoritative proceedings](https://openaccess.thecvf.com/content_iccv_2015_workshops/w18/html/Asif_FlatCam_Replacing_Lenses_ICCV_2015_paper.html)
- Babcock, H. W. (1953). The possibility of compensating astronomical seeing.
  *Publications of the Astronomical Society of the Pacific*, 65, 229–236.
  [DOI](https://doi.org/10.1086/126606)
- Betzig, E., Patterson, G. H., Sougrat, R., Lindwasser, O. W., Olenych, S.,
  Bonifacino, J. S., Davidson, M. W., Lippincott-Schwartz, J., and Hess, H. F.
  (2006). Imaging intracellular fluorescent proteins at nanometer resolution.
  *Science*, 313, 1642–1645. [DOI](https://doi.org/10.1126/science.1127344)
- Bogaerts, W., and Chrostowski, L. (2018). Silicon photonics circuit design:
  methods, tools and challenges. *Laser & Photonics Reviews*, 12, 1700237.
  [DOI](https://doi.org/10.1002/lpor.201700237)
- Booth, M. J. (2007). Wavefront sensorless adaptive optics for large aberrations.
  *Optics Letters*, 32, 5–7. [DOI](https://doi.org/10.1364/OL.32.000005)
- Bruck, Y. M., and Sodin, L. G. (1979). On the ambiguity of the image
  reconstruction problem. *Optics Communications*, 30, 304–308.
  [DOI](https://doi.org/10.1016/0030-4018(79)90058-0)
- Candès, E. J., and Fernandez-Granda, C. (2014). Towards a mathematical theory
  of super-resolution. *Communications on Pure and Applied Mathematics*, 67,
  906–956. [DOI](https://doi.org/10.1002/cpa.21455)
- Candès, E. J., Li, X., and Soltanolkotabi, M. (2015). Phase retrieval via
  Wirtinger flow: theory and algorithms. *IEEE Transactions on Information
  Theory*, 61, 1985–2007. [DOI](https://doi.org/10.1109/TIT.2015.2399924)
- Candès, E. J., Romberg, J. K., and Tao, T. (2006). Stable signal recovery from
  incomplete and inaccurate measurements. *Communications on Pure and Applied
  Mathematics*, 59, 1207–1223. [DOI](https://doi.org/10.1002/cpa.20124)
- Chang, J., Sitzmann, V., Dun, X., Heidrich, W., and Wetzstein, G. (2018).
  Hybrid optical-electronic convolutional neural networks with optimized
  diffractive optics for image classification. *Scientific Reports*, 8, 12324.
  [DOI](https://doi.org/10.1038/s41598-018-30619-y)
- Chrostowski, L., and Hochberg, M. (2015). Fabrication. In *Silicon Photonics
  Design*. Cambridge University Press.
  [DOI](https://doi.org/10.1017/CBO9781316084168.012)
- Correia, C., Raynaud, H.-F., Kulcsár, C., and Conan, J.-M. (2013). Minimum
  variance prediction and control for adaptive optics. *Automatica*, 49,
  1119–1124. [DOI](https://doi.org/10.1016/j.automatica.2012.03.030)
- Cox, I. J., and Sheppard, C. J. R. (1986). Information capacity and resolution
  in an optical system. *Journal of the Optical Society of America A*, 3,
  1152–1158. [DOI](https://doi.org/10.1364/JOSAA.3.001152)
- Debevec, P. E., and Malik, J. (1997). Recovering high dynamic range radiance
  maps from photographs. *SIGGRAPH*, 369–378.
  [DOI](https://doi.org/10.1145/258734.258884)
- Decker, J. A., Jr., and Harwit, M. (1968). Sequential encoding with Hadamard
  transforms. *Applied Optics*, 7, 2205–2209.
  [DOI](https://doi.org/10.1364/AO.7.002205)
- Débarre, D., Booth, M. J., and Wilson, T. (2007). Image based adaptive optics
  through optimisation of low spatial frequencies. *Optics Express*, 15,
  8176–8190. [DOI](https://doi.org/10.1364/OE.15.008176)
- Donoho, D. L. (1992). Superresolution via sparsity constraints. *SIAM Journal
  on Mathematical Analysis*, 23, 1309–1331.
  [DOI](https://doi.org/10.1137/0523074)
- Donoho, D. L. (2006). Compressed sensing. *IEEE Transactions on Information
  Theory*, 52, 1289–1306. [DOI](https://doi.org/10.1109/TIT.2006.871582)
- Donoho, D. L., and Stark, P. B. (1989). Uncertainty principles and signal
  recovery. *SIAM Journal on Applied Mathematics*, 49, 906–931.
  [DOI](https://doi.org/10.1137/0149053)
- Duarte, M. F., Davenport, M. A., Takhar, D., Laska, J. N., Sun, T., Kelly,
  K. F., and Baraniuk, R. G. (2008). Single-pixel imaging via compressive
  sampling. *IEEE Signal Processing Magazine*, 25, 83–91.
  [DOI](https://doi.org/10.1109/MSP.2007.914730)
- Feldmann, J., Youngblood, N., Karpov, M., Gehring, H., Li, X., Stappers, M.,
  Le Gallo, M., Fu, X., Lukashchuk, A., Raja, A. S., et al. (2021). Parallel
  convolutional processing using an integrated photonic tensor core. *Nature*,
  589, 52–58. [DOI](https://doi.org/10.1038/s41586-020-03070-1)
- Feldmann, J., Youngblood, N., Wright, C. D., Bhaskaran, H., and Pernice,
  W. H. P. (2019). All-optical spiking neurosynaptic networks with self-learning
  capabilities. *Nature*, 569, 208–214.
  [DOI](https://doi.org/10.1038/s41586-019-1157-8)
- Fenimore, E. E., and Cannon, T. M. (1978). Coded aperture imaging with
  uniformly redundant arrays. *Applied Optics*, 17, 337–347.
  [DOI](https://doi.org/10.1364/AO.17.000337)
- Fenimore, E. E., and Cannon, T. M. (1981). Uniformly redundant arrays: digital
  reconstruction methods. *Applied Optics*, 20, 1858–1864.
  [DOI](https://doi.org/10.1364/AO.20.001858)
- Fienup, J. R. (1982). Phase retrieval algorithms: a comparison. *Applied
  Optics*, 21, 2758–2769. [DOI](https://doi.org/10.1364/AO.21.002758)
- Fienup, J. R. (1993). Phase-retrieval algorithms for a complicated optical
  system. *Applied Optics*, 32, 1737–1746.
  [DOI](https://doi.org/10.1364/AO.32.001737)
- Hamerly, R., Bernstein, L., Sludds, A., Soljačić, M., and Englund, D. (2019).
  Large-scale optical neural networks based on photoelectric multiplication.
  *Physical Review X*, 9, 021032.
  [DOI](https://doi.org/10.1103/PhysRevX.9.021032)
- Harris, N. C., Ma, Y., Mower, J., Baehr-Jones, T., Englund, D., Hochberg, M.,
  and Galland, C. (2014). Efficient, compact and low loss thermo-optic phase
  shifter in silicon. *Optics Express*, 22, 10487–10493.
  [DOI](https://doi.org/10.1364/OE.22.010487)
- Heide, F., Diamond, S., Lindell, D. B., and Wetzstein, G. (2018).
  Sub-picosecond photon-efficient 3D imaging using single-photon sensors.
  *Scientific Reports*, 8, 17726.
  [DOI](https://doi.org/10.1038/s41598-018-35212-x)
- Hell, S. W., and Wichmann, J. (1994). Breaking the diffraction resolution
  limit by stimulated emission. *Optics Letters*, 19, 780–782.
  [DOI](https://doi.org/10.1364/OL.19.000780)
- Hughes, T. W., Minkov, M., Shi, Y., and Fan, S. (2018). Training of photonic
  neural networks through in situ backpropagation and gradient measurement.
  *Optica*, 5, 864–871. [DOI](https://doi.org/10.1364/OPTICA.5.000864)
- Julier, S. J., and Uhlmann, J. K. (1997). A non-divergent estimation algorithm
  in the presence of unknown correlations. *American Control Conference*.
  [DOI](https://doi.org/10.1109/ACC.1997.609105)
- Kaipio, J., and Somersalo, E. (2005). *Statistical and Computational Inverse
  Problems*. Springer. [DOI](https://doi.org/10.1007/b138659)
- Kalman, R. E. (1960). A new approach to linear filtering and prediction
  problems. *Journal of Basic Engineering*, 82, 35–45.
  [DOI](https://doi.org/10.1115/1.3662552)
- Kirmani, A., Venkatraman, D., Shin, D., Colaco, A., Wong, F. N. C., Shapiro,
  J. H., and Goyal, V. K. (2014). First-photon imaging. *Science*, 343,
  58–61. [DOI](https://doi.org/10.1126/science.1246774)
- Le Roux, B., Conan, J.-M., Kulcsár, C., Raynaud, H.-F., Mugnier, L. M., and
  Fusco, T. (2004). Optimal control law for classical and multiconjugate adaptive
  optics. *Journal of the Optical Society of America A*, 21, 1261–1276.
  [DOI](https://doi.org/10.1364/JOSAA.21.001261)
- Lin, X., Rivenson, Y., Yardimci, N. T., Veli, M., Luo, Y., Jarrahi, M., and
  Ozcan, A. (2018). All-optical machine learning using diffractive deep neural
  networks. *Science*, 361, 1004–1008.
  [DOI](https://doi.org/10.1126/science.aat8084)
- Miller, D. A. B. (2000). Communicating with waves between volumes: evaluating
  orthogonal spatial channels and limits on coupling strengths. *Applied Optics*,
  39, 1681–1699. [DOI](https://doi.org/10.1364/AO.39.001681)
- Miller, D. A. B. (2013). Self-configuring universal linear optical component.
  *Photonics Research*, 1, 1–15.
  [DOI](https://doi.org/10.1364/PRJ.1.000001)
- Miller, D. A. B. (2017). Attojoule optoelectronics for low-energy information
  processing and communications. *Journal of Lightwave Technology*, 35,
  346–396. [DOI](https://doi.org/10.1109/JLT.2017.2647779)
- Morgenshtern, V. I., and Candès, E. J. (2016). Super-resolution of positive
  sources: the discrete setup. *SIAM Journal on Imaging Sciences*, 9, 412–444.
  [DOI](https://doi.org/10.1137/15M1016552)
- Nahmias, M. A., de Lima, T. F., Tait, A. N., Peng, H.-T., Shastri, B. J., and
  Prucnal, P. R. (2020). Photonic multiply-accumulate operations for neural
  networks. *IEEE Journal of Selected Topics in Quantum Electronics*, 26.
  [DOI](https://doi.org/10.1109/JSTQE.2019.2941485)
- Ober, R. J., Ram, S., and Ward, E. S. (2004). Localization accuracy in
  single-molecule microscopy. *Biophysical Journal*, 86, 1185–1200.
  [DOI](https://doi.org/10.1016/j.bpj.2004.05.002)
- Pai, S., Sun, Z., Hughes, T. W., Park, T., Bartlett, B., Williamson, I. A. D.,
  Minkov, M., Milanizadeh, M., Abebe, N., Morichetti, F., et al. (2023).
  Experimentally realized in situ backpropagation for deep learning in photonic
  neural networks. *Science*, 380, 398–404.
  [DOI](https://doi.org/10.1126/science.ade8450)
- Rust, M. J., Bates, M., and Zhuang, X. (2006). Sub-diffraction-limit imaging by
  stochastic optical reconstruction microscopy. *Nature Methods*, 3, 793–796.
  [DOI](https://doi.org/10.1038/nmeth929)
- Sharma, P., and Piestun, R. (2010). Performance limits on three-dimensional
  particle localization in photon-limited microscopy. *Optics Letters*, 35,
  3306–3308. [DOI](https://doi.org/10.1364/OL.35.003306)
- Shastri, B. J., Tait, A. N., Ferreira de Lima, T., Pernice, W. H. P.,
  Bhaskaran, H., Wright, C. D., and Prucnal, P. R. (2021). Photonics for
  artificial intelligence and neuromorphic computing. *Nature Photonics*, 15,
  102–114. [DOI](https://doi.org/10.1038/s41566-020-00754-y)
- Shen, Y., Harris, N. C., Skirlo, S., Prabhu, M., Baehr-Jones, T., Hochberg,
  M., Sun, X., Zhao, S., Larochelle, H., Englund, D., and Soljačić, M. (2017).
  Deep learning with coherent nanophotonic circuits. *Nature Photonics*, 11,
  441–446. [DOI](https://doi.org/10.1038/nphoton.2017.93)
- Taguchi, K., Iwanczyk, J. S., and Vision 20/20 contributors (2013). Vision
  20/20: single photon counting x-ray detectors in medical imaging. *Medical
  Physics*, 40, 100901. [DOI](https://doi.org/10.1118/1.4818943)
- Tait, A. N., Nahmias, M. A., Shastri, B. J., and Prucnal, P. R. (2014).
  Broadcast and weight: an integrated network for scalable photonic spike
  processing. *Journal of Lightwave Technology*, 32, 4029–4041.
  [DOI](https://doi.org/10.1109/JLT.2014.2345652)
- Teofilovic, I., Cem, A., Sanchez-Jacome, D., Perez-Lopez, D., and Da Ros, F.
  (2024). Thermal crosstalk modelling and compensation methods for programmable
  photonic integrated circuits. *Journal of Lightwave Technology*, 42,
  7816–7825. [DOI](https://doi.org/10.1364/JLT.42.007816)
- Tsang, M., Nair, R., and Lu, X.-M. (2016). Quantum theory of superresolution
  for two incoherent optical point sources. *Physical Review X*, 6, 031033.
  [DOI](https://doi.org/10.1103/PhysRevX.6.031033)
- Velten, A., Willwacher, T., Gupta, O., Veeraraghavan, A., Bawendi, M. G., and
  Raskar, R. (2012). Recovering three-dimensional shape around a corner using
  ultrafast time-of-flight imaging. *Nature Communications*, 3, 745.
  [DOI](https://doi.org/10.1038/ncomms1747)
- Voigtman, E., and Winefordner, J. D. (1987). The multiplex disadvantage and
  excess low-frequency noise. *Applied Spectroscopy*, 41, 1182–1184.
  [DOI](https://doi.org/10.1366/0003702874447509)
- Wang, T., Ma, S.-Y., Wright, L. G., Onodera, T., Richard, B. C., and McMahon,
  P. L. (2022). An optical neural network using less than 1 photon per
  multiplication. *Nature Communications*, 13, 123.
  [DOI](https://doi.org/10.1038/s41467-021-27774-8)
- Wei, X., Urbach, H. P., and Coene, W. M. J. (2020). Cramér–Rao lower bound and
  maximum-likelihood estimation in ptychography with Poisson noise. *Physical
  Review A*, 102, 043516. [DOI](https://doi.org/10.1103/PhysRevA.102.043516)
- Williams, E. D., Ayres, R. U., and Heller, M. (2002). The 1.7 kilogram
  microchip: energy and material use in the production of semiconductor devices.
  *Environmental Science & Technology*, 36, 5504–5510.
  [DOI](https://doi.org/10.1021/es025643o)
- Xu, S., Zou, X., Ma, B., Chen, J., Yu, L., and Zou, W. (2019).
  Deep-learning-powered photonic analog-to-digital conversion. *Light: Science &
  Applications*, 8, 66. [DOI](https://doi.org/10.1038/s41377-019-0176-4)
- Xu, X., Tan, M., Corcoran, B., Wu, J., Boes, A., Nguyen, T. G., Chu, S. T.,
  Little, B. E., Hicks, D. G., Morandotti, R., Mitchell, A., and Moss, D. J.
  (2021). 11 TOPS photonic convolutional accelerator for optical neural
  networks. *Nature*, 589, 44–51.
  [DOI](https://doi.org/10.1038/s41586-020-03063-0)

## Verdict

Optics does not supply a free-information or free-computation loophole. It
supplies a rigorous way to co-design what is measured, what remains ambiguous,
which physical transform is cheap in a given regime, when another measurement is
worth its cost, and when calibration has expired. Those lessons already
deduplicate into P-001, P-006, P-007, P-009, P-010, P-012, and P-013.

The next useful repository action is an adversarial fixture that joins
E-OPTIC-01, E-OPTIC-03, E-OPTIC-05, and E-OPTIC-06: a versioned observation
operator with typed uncertainty, active-measurement choices, drift injection, and
an optical/digital route evaluated at equal end-to-end and lifecycle budget. If
standard inverse solvers, experiment design, control, and digital acceleration
match it, retire the residual instead of renaming the baseline.

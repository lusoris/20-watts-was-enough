# Fixture F-024 — Applied multiscale reduction

<!-- markdownlint-disable MD013 -->

- **Status:** complete pre-implementation CPU-only experiment contract
- **Direct claims:** [C-1526](../../research/claims.md#c-1526)–[C-1529](../../research/claims.md#c-1529)
- **Source audit:** [applied multiscale reduction](../../research/audits/2026-08-25-applied-multiscale-reduction.md)
- **Audit snapshot:** SHA-256 `11BAF1FD7B89AE20F11D29E4ED13C039586A9ED631A26AAF9F14D295493B2198`
- **Mathematical contract:** [multiscale reduction contract](../../math/multiscale-reduction-contract.md)
- **Protocol IDs:** `AMR-T01`–`AMR-T04`
- **Execution state:** a development-only AMR-T01 smoke runner and `smoke-ready`
  manifest exist; no sealed confirmation or transfer pack, reference-
  workstation result, generated scientific dataset, or performance result
  exists
- **Registry disposition:** no new P-series principle, architecture candidate, or claimed effect

This fixture preserves four distinct reduction questions. It does not treat
projection memory, slow-manifold persistence, HMM, and equation-free
computation as synonyms. Every number below is a synthetic generator setting,
numerical tolerance, minimum detectable project effect, or compute cap—not an
observed effect, physical safety limit, energy measurement, or deployment
claim.

| Protocol | Direct claim | Registered question |
| --- | --- | --- |
| AMR-T01 | [C-1526](../../research/claims.md#c-1526) | Projected memory versus Markov closure |
| AMR-T02 | [C-1527](../../research/claims.md#c-1527) | Normal hyperbolicity and the fold boundary |
| AMR-T03 | [C-1528](../../research/claims.md#c-1528) | Local micro-query contract |
| AMR-T04 | [C-1529](../../research/claims.md#c-1529) | Lift–evolve–restrict and closure |

## Question and hypotheses

The registered questions are falsification targets. The hypotheses are:

1. **H01 / AMR-T01:** a causal finite-memory model improves resolved-trajectory
   error over a Markov-only closure on held-out systems, while an exact or
   identified augmented-state null prevents credit for merely re-encoding the
   hidden state.
2. **H02 / AMR-T02:** a frozen attraction/healing gate accepts most normally
   hyperbolic cases and abstains before a quasi-steady reduction exceeds its
   error bound near a fold.
3. **H03 / AMR-T03:** a frozen HMM macro/micro composition can meet temperature
   and flux bounds with fewer fine-grid-equivalent updates than global fine
   resolution, but receives no credit where an analytic homogenized null is as
   accurate and cheaper.
4. **H04 / AMR-T04:** post-healing multi-lift agreement predicts a usable
   coarse timestepper in a closed family, while persistent lift dependence
   exposes an omitted slow variable.

Each hypothesis can fail independently. No composite “multiscale” conclusion
is registered.

## Systems, scenarios, and tasks

Each track below freezes:

1. a synthetic generator and its dimensional or dimensionless variables;
2. public development, private confirmation, and disjoint transfer supports;
3. observations and information unavailable to compared arms;
4. a strongest mature null and an evaluator-only oracle;
5. protected native-unit errors, closure or boundary conditions, and resource
   measures;
6. interventions that detect leakage or vacuous behaviour; and
7. promotion, rejection, invalidity, and kill rules.

## Arms, baselines, and strongest nulls

Arm labels have fixed roles:

1. **A — collapsed rule:** the tempting history-free, always-reduced,
   arithmetic-mean, or single-lift shortcut.
2. **B — strongest mature null:** respectively an identified minimal state-
   space model, a full adaptive stiff solver, analytic/quadrature
   homogenization, or an identified coarse state-space model.
3. **C — audited method:** respectively finite memory, gated slow reduction,
   HMM, or healed multi-lift equation-free projective evolution.
4. **O — evaluator-only oracle:** analytic, high-precision, globally fine, or
   continuously fine evolution. O never supplies confirmation features,
   labels, parameters, thresholds, stopping decisions, or retries.

An arm that receives extra hidden state, exact coefficients, future values, or
oracle residuals outside its written definition invalidates the affected pack.

## Matched budgets and equal information

A/B/C share the same resolved observations, timestamps, action authority,
public generator metadata, seed packs, number of development scoring calls,
CPU-thread and memory caps, stopping rules, failure handling, and output
schema. Any simulator or coefficient-query authority is listed by track and
counted. Analytic information legitimately defining B is declared before
freeze; it may not be hidden to manufacture a C advantage.

Every attempted calculation is charged before fallback. History buffers,
latent states, microcells, replicas, healing, rejected macrosteps, solver
iterations, coefficient queries, reconstruction, restriction, retries, and
artifacts enter the complete ledger. Matching wall time alone is insufficient.

## Measurements and units

Native errors are stored before normalization. Units are:

1. AMR-T01: $x,y$ in common unit $U$, time in seconds, rates in s$^{-1}$,
   kernel in s$^{-2}$, resolved errors in $U$.
2. AMR-T02: $x,y$ dimensionless after a recorded 1 s time scaling, time/event
   error in seconds, spectral margin dimensionless in fast time.
3. AMR-T03: position in metres, temperature in kelvin, conductivity in
   W m$^{-1}$ K$^{-1}$, source in W m$^{-3}$, heat flux in W m$^{-2}$.
4. AMR-T04: $X,H$ and their coarse moments dimensionless, $V$ in s$^{-1}$,
   relaxation rates in s$^{-1}$, time in seconds, and work in
   replica-microsteps.

All tracks record counts, bytes, CPU seconds, wall seconds and peak RSS. None
records or infers joules.

## Required ablations and interventions

1. AMR-T01: zero coupling, fast-memory, long-memory, history permutation, and
   equal-information hidden-state positive control.
2. AMR-T02: constant attracting margin, repelling branch, off-manifold initial
   layer, decreasing fold distance, gate removal, and full-solver fallback.
3. AMR-T03: mesh doubling, phase shift, noncommensurate microcell, two-
   frequency coefficient, arithmetic versus harmonic coefficient, query-
   budget audit, and global fine reference.
4. AMR-T04: replica relabelling, multiple admissible lifts, invalid
   mean-only lift, healing sweep, omitted slow variable, closing spectral gap,
   independent-noise variance check, and continuous fine fallback.

A development ablation may choose a frozen configuration. Confirmation and
transfer ablations are tests, never opportunities to retune.

## Analysis and statistical plan

For seed $s$ and arm $a$, emit finite loss $L_{s,a}\in[0,100]$ and every
protected raw endpoint. Let

$$
d_s^{C-B}=L_{s,C}-L_{s,B},
\qquad
r_s^{C-B}=\log\frac{W_{s,C}+\epsilon_W}{W_{s,B}+\epsilon_W},
$$

where $W$ is the track's named work and $\epsilon_W=1$ count. Use the seed as
the only resampling cluster. Construct two-sided studentized paired cluster-
bootstrap intervals with 100,000 deterministic resamples. If the empirical
standard error is exactly zero, a nonzero constant contrast is decisive and a
zero contrast is inconclusive.

Primary loss non-inferiority requires the upper 95% confidence bound for
$E[d_s^{C-B}]$ below `1.0` loss point. Track-specific raw-error margins must
also pass. A resource advantage requires the upper 95% bound for
$\exp(E[r_s^{C-B}])$ below `0.80`, with attributed bytes, peak RSS and failure
rate ratios not exceeding `1.00`. Where a track explicitly registers O rather
than B as the resource comparator, both B and O ratios are reported and the
stronger accuracy-eligible comparator controls the interpretation.

Holm controls the four across-track primary boundary families at familywise
$\alpha=0.05$. Within a track, Holm controls its error and resource novelty
axes at `0.05`. Protected absolute gates, oracle/reference checks and transfer
conditions are conjunctive and cannot be rescued by a composite loss.

## Promotion, rejection, and kill rules

A track can support only its bounded mechanism if:

1. all analytic/reference and leakage controls pass;
2. C beats A on its registered mechanism-sensitive endpoint;
3. C is non-inferior to B on loss and every protected native error;
4. the declared complete resource comparison passes;
5. failures, fallbacks, abstentions and missing artifacts remain in the
   denominator;
6. confirmation and transfer pass without retuning; and
7. no protected null or boundary explains the effect.

Otherwise the mechanism is rejected or remains unresolved. Passing does not
promote a principle, architecture candidate, energy claim, or deployment
readiness.

### No-results authority

This file is a preregistration. It contains no execution output. It cannot
establish a mathematical discovery, model-performance result, computational
saving, workstation-energy result, environmental benefit, conformity claim,
or deployment conclusion.

## Common CPU-only falsification contract

### Runtime, determinism, and seed grammar

Implement under the repository-pinned Node.js runtime in TypeScript/JavaScript,
CPU only, binary64 reference arithmetic, no run-time network, canonical
little-endian serialization, SHA-256 manifests, and stable-hash tie breaking.

Use PCG64-DXSM. For literal seed string $v$, hash the UTF-8 bytes once. Read
digest bytes 0–15 as unsigned little-endian 128-bit state $s$ and bytes 16–31
as unsigned little-endian 128-bit stream selector $r$. Initialize PCG at state
zero with odd increment $(2r+1)\bmod2^{128}$, advance, add $s$ modulo
$2^{128}$, and advance again. A uniform binary64 uses the top 53 random bits
divided by $2^{53}$. Bounded integers use rejection sampling, never modulo
reduction. Gaussian draws use one frozen, tested algorithm and store its name
and version in the manifest. Parallel reductions sort by canonical world ID.

### Seed packs and freeze

For track $k\in\{1,2,3,4\}$, public development seeds are
`1526000 + 10000*k + j`, $j=1,\ldots,64$. A registrar draws 128 private 64-bit
confirmation seeds and 64 disjoint private transfer seeds per track. The
registrar publishes ordered-pack SHA-256 commitments before implementation
freeze and reveals each pack only after code, configuration, dependency-lock,
artifact-schema and reference-workstation hashes are frozen. Private seeds
have no public derivation.

Only public seeds may choose features, history windows, regularization,
spectral thresholds, microcell sizes, boundary rules, quadrature, healing,
ensemble size, projective step, tolerances or fallback thresholds. Freeze one
configuration per arm/track by this lexicographic development rule:

1. pass every analytic and leakage control;
2. minimize mean primary loss;
3. minimize protected native error;
4. minimize named work;
5. minimize attributed bytes moved; and
6. break exact ties by canonical configuration hash.

### Inference unit and generation failures

One seed is one inferential cluster. Systems, parameter cells, timesteps,
spatial nodes, microcells, fine replicas and lifts inside a seed do not
increase $n$. Draw fields in written order. A rejection sampler or numerical
solver uses a manifest-frozen iteration cap. Exhaustion, divergence, NaN/Inf,
hash mismatch, deadline overrun, missing artifact, reference-check failure, or
unrecorded retry is retained as arm failure with $L_{s,a}=100$.

An allowed abstention invokes the stated fallback. Both diagnostic and
fallback work remain in the ledger. An abstention without a completed fallback
is a failure.

### Workstation and process caps

Before any private run, freeze processor model, physical/logical core count,
memory, operating-system build, Node.js/runtime versions, power mode, process
affinity, background-service policy, dependency lock, compiler flags and
thermal warm-up procedure. Each arm/seed is limited to four physical CPU
cores, 2 GiB peak process RSS and 45 s wall time; all four arms together are
limited to 180 s per seed. Caps apply to setup, diagnosis, rejected attempts,
fallback and serialization. Exceeding a cap is failure.

### Complete artifact and resource schema

Each raw row is keyed by audit hash, fixture hash, runner/config/schema hashes,
track, pack, seed, world, arm and attempt. Required fields include:

1. native state/field, maximum, flux, event, closure and boundary errors;
2. coverage, abstention, false acceptance, failure and terminal loss;
3. fine/coarse RHS evaluations, accepted/rejected steps and linear iterations;
4. microsteps, macrosteps, lifts, restrictions, healing steps, coefficient or
   simulator queries, retries and fallbacks;
5. logical state/history/coefficient/lift/restrict/solver/artifact bytes read
   and written, total attributed bytes moved and peak live algorithmic bytes;
6. CPU seconds, wall seconds, peak RSS and artifact bytes; and
7. analytic/reference residuals, solver tolerance, step or mesh size, and all
   normalization constants with unit strings.

Counters must reconcile with an append-only raw event stream. Work spent by a
failed or rejected attempt is never overwritten by its retry. Process energy
is not measured and no count may be relabelled as joules.

The development-only AMR-T01 smoke runner implements a deliberately narrower
plumbing schema, not the confirmation schema above. Every smoke row binds the
current audit, fixture, mathematical contract, runner, configuration, and
schema hashes plus track, public-development pack, seed, world, arm, and
attempt. It records native resolved-state error, clipped loss, deterministic
work/traffic proxies, units, and explicit no-result/no-energy authority flags.
It omits nondeterministic CPU timing and RSS endpoints and cannot satisfy the
registered confirmation analysis. Any confirmation or transfer implementation
must use the complete schema above and new private packs; smoke artifacts
cannot be promoted or pooled with them.

### Frozen candidate grids and numerical references

Candidate grids are finite so “development tuning” cannot become an open-ended
search:

1. AMR-T01 tests causal autoregressive lag counts `{1}` for A, `{2}` for B,
   and `{4, 8, 12, 16}` for C, with ridge penalties
   `{0, 1e-8, 1e-6, 1e-4, 1e-2}` after resolved-prefix standardization. B is
   represented in minimal companion state-space form and rejects roots outside
   the unit disk; C projects unstable roots to radius `0.999`. Public
   development chooses one ridge value for A/B and one lag/ridge pair for C;
   each private system estimates only its allowed coefficients from its own
   resolved prefix under that frozen rule.
2. AMR-T02 uses a fifth-order three-stage Radau IIA B solver with analytic
   Jacobian, Newton residual tolerance `1e-11`, at most 12 Newton iterations,
   relative tolerance `1e-9`, absolute tolerance `1e-11`, and step range
   `[1e-6, 0.02]` in dimensionless $\theta$. O repeats at tolerances 100 times
   smaller and maximum step four times smaller; step halving must change each
   protected output by less than `1e-4` of its margin. C searches spectral
   margins `{0.10, 0.20, 0.40}`, invariance residuals
   `{1e-3, 3e-3, 1e-2}`, and healing windows `{0.01, 0.03, 0.10}` in
   dimensionless time.
3. AMR-T03 searches shared macro-cell counts `{16, 32, 64}`, C microcell
   extents `{1, 2, 4}` estimated periods, cells per microperiod `{8, 16, 32}`,
   and relaxation/oversampling collars `{0, 1, 2}` microperiods. A/B use the
   selected shared macro count. B's transfer quadrature uses a frozen
   composite Gauss rule refined until consecutive effective coefficients
   differ by at most `1e-10 W m^-1 K^-1`; every evaluation and refinement is
   charged. O is conservative finite volume with pivoted tridiagonal solve,
   residual at most `1e-11` times the source norm, and mandatory mesh doubling.
4. AMR-T04 fixes fine Euler--Maruyama step `0.0025 s` and 2,048 replicas. C
   searches healing `{0.05, 0.10, 0.20, 0.40} s`, measurement burst
   `{0.025, 0.05, 0.10} s`, projective step `{0.10, 0.20, 0.40} s`, and
   normalized lift-disagreement threshold `{0.01, 0.02, 0.04}`. The canonical
   48 lowest configuration hashes form the allowed development grid. O uses
   step `0.00125 s` with Brownian-bridge-coupled increments; a fixed public
   subset repeats at `0.000625 s` and must differ by less than one tenth of
   each error margin.

Each arm receives 48 public development configuration-evaluation slots per
track, and every slot is scored on all 64 public seeds. An arm with fewer
distinct configurations repeats its canonical configuration so search budget,
not only the selected model, remains matched. Solver failure, root projection,
quadrature refinement, and reference repetition remain in the ledger.

## AMR-T01 — C-1526 projected memory versus Markov closure

### Registered generator

For each seed, draw 24 systems

$$
\dot{x}=-\alpha x+\beta y,
\qquad
\dot{y}=\gamma x-\lambda y,
$$

over $t\in[0,20]\,\mathrm{s}$. $x,y$ share unit $U$;
$\alpha,\beta,\gamma,\lambda$ have unit s$^{-1}$. Draw $\alpha,\lambda$ from
`logU(0.25,4) s^-1`, signed $\beta,\gamma$ from
`U(-1.5,1.5) s^-1`, and $x_0,y_0$ from `U(-2,2) U`, rejecting until
$\alpha\lambda-\beta\gamma\ge0.15\,\mathrm{s}^{-2}$. Cap rejection at 256
draws per system. Sample resolved $x$ every 0.05 s. At evaluation, A/B/C
receive the prefix $x(t)$ on $t\in[0,1]\,\mathrm{s}$ and make one open-loop
rollout over $t\in(1,20]\,\mathrm{s}$. True $y$, including $y_0$, is
evaluator-only.

Development uses all public support. Confirmation uses a fixed stratified
Latin hypercube generated from private seeds and excludes public parameter
cells. Transfer contains equal numbers of zero-coupling, fast-memory
$\lambda\in[4,8]\,\mathrm{s}^{-1}$, and long-memory
$\lambda\in[0.12,0.25]\,\mathrm{s}^{-1}$ cases while retaining stability.

### Arms and strongest null

1. A fits scalar $\dot x=ax$ from public resolved trajectories.
2. B fits the minimal stable two-state linear realization from the same
   resolved trajectories and may maintain one latent coordinate; it never sees
   true $y$ or confirmation parameters.
3. C fits a causal finite-impulse-response model with development-selected lag
   count, ridge penalty and stability projection.
4. O uses the analytic matrix exponential and exact convolution solely to
   score trajectories and kernel-reference residuals.

A/B/C receive the same $x$ history and training/scoring calls. Parameter counts,
history bytes, latent updates and fitting work are recorded.

### Protected endpoints and controls

Primary native error is

$$
e_x=\left(\frac{1}{19\,\mathrm{s}}
\int_{1\,\mathrm{s}}^{20\,\mathrm{s}}(x_a(t)-x_O(t))^2dt\right)^{1/2}
$$

in $U$, with B non-inferiority margin `0.02 U`. Also record maximum absolute
error, sign/phase crossings, unstable rollouts, parameter count, multiply-add
equivalents and traffic.

Zero coupling must erase the exact kernel. History permutation after the query
time must not affect a causal arm; permutation inside the declared past window
must degrade a genuinely memory-using C on coupled cases. A separate positive
control exposes exact $y_0$ equally to A/B/C; it is never pooled with the
registered comparison. Any O-derived kernel or confirmation-system parameter
in fitting artifacts invalidates the pack.

### Decision and kill rule

C must beat A on coupled held-out $e_x$, remain non-inferior to B, and meet the
common work/traffic gate. Kill H01 if C gains after future-history permutation,
fails zero coupling, destabilizes long-memory transfer, loses to B on error or
complete resources, or requires hidden $y_0$.

## AMR-T02 — C-1527 normal hyperbolicity and fold boundary

### Registered generator

Use

$$
\varepsilon x'=y-x^2,
\qquad
y'=-1,
$$

where prime denotes derivative with respect to dimensionless
$\theta=t/\tau_0$, $x,y$ are dimensionless, and the manifest records
$\tau_0=1\,\mathrm{s}$. Draw
$\varepsilon\sim\operatorname{logU}(0.005,0.08)$,
$y_0\sim U(0.8,1.5)$, terminal gap
$d_{\min}\sim\operatorname{logU}(0.04,0.5)$, and initial offset
$x_0-\sqrt{y_0}\sim U(-0.08,0.08)$. Development and confirmation stop at
$y=d_{\min}>0$. Confirmation holds out stratified interior cells. Transfer
uses $d_{\min}\in[10^{-4},0.04)$, offsets up to `0.3`, and protected episodes
continuing through the fold $y=0$.

### Arms and strongest null

1. A evolves the attracting quasi-steady branch $x=+\sqrt y$ whenever real,
   without a validity gate.
2. B is a binary64 adaptive stiff full solver with shared absolute/relative
   tolerances and step rejection.
3. C uses a development-frozen first-order slow approximation only when its
   lower fast spectral-margin estimate, invariance residual, healing residual
   and off-manifold distance pass; otherwise C falls back to B and charges all
   diagnosis plus fallback.
4. O is an independently implemented high-precision reference with
   tolerance/step-halving certification.

### Protected endpoints and controls

Protected endpoints are maximum absolute $y$-aligned $x$ error (margin `0.01`)
and, only on protected fold-crossing transfer episodes, absolute error in the
first time $x$ crosses zero (margin `0.02 s`; failure to cross before the
frozen episode cap receives terminal loss). Near-fold false acceptance must be at most `5%`; acceptance on
normally hyperbolic confirmation support must exceed `80%`. Named work is
full-solver-equivalent RHS evaluations including gate and fallback work.

A linear fast system with constant negative fast eigenvalue is the positive
control. Reversing its sign is a repelling control the gate must reject. Gate
removal must increase protected near-fold false acceptance. Initial-layer
offsets test healing rather than being deleted. O/B disagreement above the
frozen reference tolerance invalidates the world rather than favouring C.

### Decision and kill rule

Kill H02 if C fails the repelling control, accepts inaccurate fold cases above
5%, accepts at most 80% of normally hyperbolic confirmation support, is
inferior to B, or cannot satisfy the common complete-resource gate. A fold
failure is recorded as operation outside ordinary Fenichel hypotheses, not as
a refutation of the theorem.

## AMR-T03 — C-1528 local micro-query contract

### Registered generator

Solve the steady unit-area slab problem

$$
-\frac{d}{dx}\left(\kappa(x/\ell)\frac{dT}{dx}\right)=q(x),
\qquad T(0)=T(L)=300\,\mathrm{K},
$$

with $L=1\,\mathrm{m}$,
$\ell/L\sim\operatorname{logU}(1/160,1/40)$,
$\kappa(\xi)=\kappa_0[2+\sin(2\pi\xi+\phi)]$,
$\kappa_0=1\,\mathrm{W\,m^{-1}\,K^{-1}}$,
$\phi\sim U(0,2\pi)$, and
$q(x)=q_0[1+0.25\cos(2\pi x/L)]$ with
$q_0\sim U(40,120)\,\mathrm{W\,m^{-3}}$. Confirmation holds out periods and
phases. Transfer uses noncommensurate periods, smoothly modulated amplitudes,
and a bounded two-frequency positive conductivity.

### Arms and strongest null

1. A uses arithmetic-mean conductivity on the shared macro grid.
2. B uses $\kappa_{\mathrm{eff}}=\kappa_0\sqrt3$ on the single-sinusoid family
   and frozen quadrature homogenization on transfer.
3. C uses the same macro grid plus periodic constrained microcells to estimate
   flux with frozen cell length, boundary rule, quadrature, relaxation and
   query schedule.
4. O is a globally fine conservative finite-volume solve with at least 32
   cells per shortest local period and independent mesh doubling.

All arms receive the slab, boundary, source and coefficient oracle. Every
coefficient call is counted. B's analytic formula is declared problem
information and cannot be hidden. C cannot query O fields or confirmation
effective coefficients.

### Protected endpoints and controls

Protected endpoints are domain-normalized temperature $L^2$ error against O,
margin `0.20 K`, and absolute boundary-flux error, margin
`0.50 W m^-2`. Named work is fine-cell-equivalent stencil updates. Coefficient
queries, linear iterations, micro unknowns, attributed bytes, RSS and solver
failures are separately protected.

Mesh doubling must change O's protected outputs by less than one tenth of each
margin. Arithmetic and harmonic means must coincide for a constant-coefficient
positive control. Phase translation by one period must preserve the effective
coefficient within numerical tolerance. Undersized and noncommensurate
microcells are protected resonance tests, not tuning worlds.

### Decision and kill rule

C must remain non-inferior to B and O on supported families and use fewer named
updates than O. Because B is the strongest null, no HMM advantage is credited
where B is equally accurate and cheaper. Kill H03 if C fails reference checks,
uses more coefficient queries or attributed bytes than O, benefits from hidden
phase/period information, or fails noncommensurate or two-frequency transfer.

## AMR-T04 — C-1529 lift–evolve–restrict and closure

### Registered generator

For each world evolve 2,048 replicas with dimensionless $X_i,H_i$ and
$V_i,m(X_i,H_i)$ in s$^{-1}$. The frozen fine simulator updates

$$
dX_i=V_i\,dt+\sigma_X\,dW_i,
\qquad
dV_i=\rho[m(X_i,H_i)-V_i]dt+\sigma_V\,dB_i,
$$

where $\rho\sim\operatorname{logU}(8,40)\,\mathrm{s}^{-1}$ and all noise,
drift, discretization and stability parameters are frozen from public seeds;
$\sigma_X$ has unit s$^{-1/2}$ and $\sigma_V$ has unit s$^{-3/2}$.
In the closed family $H_i$ is absent or relaxes faster than $V_i$. In the
protected nonclosed family $H_i$ evolves at
`0.02–0.12 s^-1` and affects $m$. The proposed coarse state is
$U=(\bar X,\operatorname{var}X)$. Three admissible lifts match both coarse
moments but differ in higher moments and conditional $V/H$ distributions.

Development uses closed cases. Confirmation holds out interior rates, moments
and noise levels. Transfer introduces slow $H$, bistable lift conditionals and
a closing fast/slow spectral gap.

### Arms and strongest null

1. A uses one canonical lift, no healing and a frozen projective step.
2. B is a stable regularized coarse state-space model fitted only on public
   fine bursts with the same coarse variables and simulator-query budget.
3. C uses all three lifts, common-random-number fine bursts, frozen healing,
   restriction, derivative estimation, a lift-disagreement gate and
   projective steps; rejection falls back to continuous fine evolution.
4. O continuously evolves the full ensemble and supplies coarse scoring only.

### Protected endpoints and controls

Over 20 s, protected maximum errors are `0.02` for $\bar X$ and `0.03` for
$\operatorname{var}X$. Record post-healing maximum pairwise lift disagreement,
derivative variance, coverage, fallback and false acceptance. False acceptance
on the slow-$H$ family must be at most `5%`. Named work is replica-microsteps,
including all lifts, healing, retries, rejected projections and fallback.

Replica relabelling must leave outputs invariant. A lift matching the mean but
not variance is invalid and must fail pre-evolution validation. Increasing
healing on public positive controls should reduce disagreement; it must not be
selected on private slow-$H$ worlds. Repeat a frozen subset with independent
rather than common noise to show that common random numbers reduce variance
without erasing genuine lift dependence.

### Decision and kill rule

C must beat A, remain non-inferior to B, keep slow-$H$ false acceptance at most
5%, and satisfy the complete microstep/traffic gate against the strongest
accuracy-eligible B/O comparator. Kill H04 if one privileged lift drives the
effect, persistent disagreement is ignored, relabelling changes results,
fallback work is omitted, or continuous fine evolution is no more expensive
under the full ledger.

## Artifact boundary and implementation order

The permitted implementation scope is a deterministic CPU runner, unit tests,
frozen manifests, raw event/summary schemas and generated artifacts under a
future result directory. It does not include changing a claim, threshold,
source interpretation, taxonomy route or protocol after private reveal.

Implementation order is:

1. analytic/reference solvers and dimensional unit tests;
2. RNG, canonical serialization and manifest tests;
3. append-only work/traffic event ledger and reconciliation tests;
4. A/B/C arms and leakage controls;
5. public development only;
6. code/config/schema/workstation freeze and registrar commitments;
7. one confirmation run; and
8. one transfer run without retuning.

Until all eight steps exist and the registered gates are evaluated, F-024
remains a complete protocol but an unexecuted one. “Complete” describes this
experiment contract, not scientific completion or readiness.

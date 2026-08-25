# Applied multiscale reduction: memory, slow manifolds, micro queries, and coarse timesteppers

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-25
- **Primary field:** applied mathematics
- **Method families:** Mori--Zwanzig projection, geometric singular perturbation theory, heterogeneous multiscale methods, and equation-free coarse computation
- **Scope:** mathematical conditions under which unresolved variables may be represented, eliminated, queried locally, or evolved through a fine simulator
- **Evidence rule:** theorem, exact identity, numerical framework, empirical transfer, and repository hypothesis remain separate records
- **Promotion state:** four bounded claim proposals are reserved as [`C-1526`](#c-1526)--[`C-1529`](#c-1529); no P-series principle or architecture candidate is proposed
- **Central ledger:** [C-1526](../claims.md#c-1526)--[C-1529](../claims.md#c-1529)
- **Execution state:** four CPU-only falsification protocols are frozen as `AMR-T01`--`AMR-T04`; AMR-T01 has a development-only smoke runner, while AMR-T02--AMR-T04 remain unimplemented; no sealed confirmation or transfer run, reference-workstation result, or performance result exists
- **Repository constraint:** this standalone audit does not edit the central claim ledger, bibliography, audit index, taxonomy routing, field coverage, principle/candidate registries, generated site, or PDF

## Executive finding

The four method families answer different reduction questions and should not be
collapsed into one generic appeal to “multiscale modelling”:

1. Mori--Zwanzig projection states what an exact projected evolution contains:
   an instantaneous term, a history term, and an orthogonal-dynamics term.
2. Geometric singular perturbation theory states conditions under which a
   normally hyperbolic slow manifold persists for a sufficiently small
   timescale ratio; it also exposes the boundary at which that guarantee ends.
3. The heterogeneous multiscale method couples a declared macro scheme to
   constrained local micro-solves that estimate missing macro data.
4. Equation-free computation constructs a coarse timestepper by lifting a
   coarse state, evolving a fine simulator, and restricting again; its closure
   premise is testable through healing and lift dependence.

All four are useful to this repository because they replace an unqualified
“discard the detail” move with a measurable contract. None establishes that an
AI workload contains a slow manifold, short memory, valid macro variables, or
cheap local micro queries. The proposed translations are therefore
`plausible` or `speculative` even where the underlying mathematical statement
is `established`.

## Field-centred scope and exact routing

### Fine-grained routing recommendation

Add only these terminal records during a later central integration:

1. DFG `3.31-01`, *Mathematik* -- `dedicated`. The preserved DFG hierarchy has
   no finer terminal applied-mathematics child; no parent code inherits this
   evidence.
2. ANZSRC `490101`, *Approximation theory and asymptotic methods* --
   `dedicated` for [`C-1527`](#c-1527).
3. ANZSRC `490105`, *Dynamical systems in applications* -- `dedicated` for
   [`C-1526`](#c-1526), [`C-1527`](#c-1527), and
   [`C-1529`](#c-1529).
4. ANZSRC `490302`, *Numerical analysis* -- `dedicated` for
   [`C-1528`](#c-1528) and [`C-1529`](#c-1529).
5. ANZSRC `490303`, *Numerical solution of differential and integral
   equations* -- `dedicated` for [`C-1528`](#c-1528).
6. ANZSRC `490409`, *Ordinary differential equations, difference equations and
   dynamical systems* -- `adjacent` for the finite-dimensional GSPT fixture;
   the audit does not survey the whole field.
7. EuroSciVoc `96c3e7e8-7584-4f61-a90d-39652b83f41e`, *applied mathematics*
   -- `dedicated`.
8. EuroSciVoc `a010f01c-4bd9-4bca-b568-0c1357034db9`, *numerical analysis* --
   `dedicated` for [`C-1528`](#c-1528) and [`C-1529`](#c-1529).
9. EuroSciVoc `f646b1b6-0774-41fd-afb3-570c9832ed05`, *dynamical systems* --
   `dedicated` for [`C-1526`](#c-1526), [`C-1527`](#c-1527), and
   [`C-1529`](#c-1529).
10. EuroSciVoc `fad48e49-fad0-43df-8328-87dd8d61618c`, *differential
    equations* -- `adjacent`; the four residues use differential equations but
    do not establish field-wide coverage.
11. EuroSciVoc `a5553f24-f643-4dea-99b3-e1a6e8a869ff`, *partial differential
    equations* -- `adjacent` for the elliptic HMM protocol only.

Do not route ANZSRC group `4901`, `4903`, or `4904`, their parent division, a
DFG parent above `3.31-01`, or a EuroSciVoc parent as covered. Do not infer
pathophysiology, computational neuroscience, statistical mechanics, machine
learning, or software-engineering coverage from the examples. The 1961 and
1972 thermodynamics papers support a projection formalism; they do not make
this an audit of thermodynamic applications.

### Included

1. Exact or theorem-qualified reduction statements with their hypotheses.
2. Compression, reconstruction, lifting, restriction, healing, memory, and
   micro-query operators that can be tested literally.
3. Strong mature numerical nulls, including the unreduced solver, an exact
   augmented-state model, an analytic homogenized solution where available,
   and an identified coarse state-space model.
4. Complete error, compute, microstep, memory-traffic, failure, and artifact
   accounting on bounded synthetic systems.

### Excluded

1. A claim that biological or artificial systems generally possess separated
   timescales, normally hyperbolic slow manifolds, finite memory, or closed
   coarse variables.
2. A claim that a projected noise term is random, independent, Gaussian, or
   negligible without a separately justified ensemble and projection.
3. A claim that local micro-solves are cheaper than the full fine model before
   equal-work and equal-information accounting.
4. Hardware-energy or carbon claims. CPU time, operation proxies, bytes moved,
   and peak resident memory are recorded; energy is unmeasured.
5. Safety, deployment, legal, or conformity claims.

## Evidence and interpretation firewalls

The cited papers are primary sources for the mathematical identity, theorem,
or numerical framework named below. They do not validate the proposed AI
translation or the fixture's synthetic parameter ranges.

The 1961 Zwanzig paper derived a non-Markovian transport equation, but its
nonlinear transport derivation omitted fluctuation terms. Zwanzig and Nordholm
published a corrected derivation in 1972. This audit therefore does not cite
the 1961 paper alone for an unrestricted nonlinear formula: [`C-1526`](#c-1526)
is anchored jointly by Mori's projection formulation, the corrected 1972
record, and the later explicit orthogonal-dynamics identity of Chorin, Hald,
and Kupferman. The linear two-variable example used by `AMR-T01` is derived
directly and does not depend on the disputed nonlinear step.

Fenichel's persistence result is conditional on regularity, compactness and
normal hyperbolicity. Krupa and Szmolyan analyse dynamics near a fold using
additional blow-up analysis; that work is used here to mark a boundary, not to
claim that ordinary Fenichel persistence continues through a fold.

HMM and equation-free computation are numerical frameworks. A published
framework and selected convergence/example results do not imply accuracy for
an arbitrary macro variable, lifting operator, microcell, healing duration, or
artificial workload.

## Construct and unit firewall

The fixture uses four distinct quantities:

1. **state error**, in the native unit of the resolved variable or kelvin for
   the heat-conduction track;
2. **flux error**, in watts per square metre for the HMM track;
3. **compute work**, counted as fine right-hand-side evaluations, linear-solver
   iterations, microsteps, macrosteps, lift/restrict calls, and CPU seconds;
4. **memory traffic**, counted as algorithmically attributed bytes read and
   written, with process peak resident set size reported separately.

These quantities are never converted to joules. A lower state error does not
imply lower work; a lower operation count does not imply lower traffic; and a
lower measured runtime on one workstation does not imply an architecture-
independent efficiency gain.

## Shared mathematical skeleton

Let a fine state be $z=(x,y)$, where $x$ is resolved and $y$ is unresolved. A
declared projection $P$ and its complement $Q=I-P$ induce an exact projected
evolution with an instantaneous contribution, a history contribution and an
orthogonal-dynamics contribution. In the fixture's dimensioned linear example,

$$
\dot{x}=-\alpha x+\beta y,\qquad
\dot{y}=\gamma x-\lambda y,
$$

where $x$ and $y$ share unit $U$ and
$\alpha,\beta,\gamma,\lambda$ have unit $\mathrm{s}^{-1}$. Eliminating $y$
gives

$$
\dot{x}(t)=-\alpha x(t)+\beta e^{-\lambda t}y(0)
+\int_0^t \underbrace{\beta\gamma e^{-\lambda(t-s)}}_{K(t-s)}x(s)\,ds.
$$

$K$ has unit $\mathrm{s}^{-2}$, so its convolution has unit $U\,\mathrm{s}^{-1}$.
A Markov approximation is a separate limit, not a restatement
of this identity.

For a fast--slow system, write

$$
\tau_f\dot{x}=f(x,y,\varepsilon),\qquad
\tau_s\dot{y}=g(x,y,\varepsilon),\qquad
\varepsilon=\frac{\tau_f}{\tau_s}.
$$

The critical manifold is $S_0=\{(x,y):f(x,y,0)=0\}$. Normal hyperbolicity
requires the fast Jacobian to have no eigenvalue with zero real part, uniformly
on the compact portion under consideration. A fold at which the relevant
eigenvalue reaches zero is outside the ordinary persistence guarantee.

For a fine propagator $\Phi_T^f$, compression/restriction $Q_c$, and a family
of reconstructions/lifts $R(U,\xi)$, the coarse timestepper is

$$
\Phi_T^c(U;\xi)=Q_c\,\Phi_T^f(R(U,\xi)).
$$

The identity $Q_cR(U,\xi)=U$ is necessary but not sufficient for closure. If
different admissible $\xi$ values yield materially different post-healing
coarse evolution, the proposed coarse state is not closed at that horizon.
The complete notation, dimensional derivations and work ledgers are frozen in
the companion [multiscale reduction contract](../../math/multiscale-reduction-contract.md).

## Claim-ledger proposals

### C-1526

- **Claim:** For a declared projection of a sufficiently regular full
  dynamical system, the exact resolved evolution contains an instantaneous
  projected term, a history integral, and an orthogonal-dynamics term; the
  linear time-invariant example makes the history term a convolution. Deleting
  the latter two terms is a Markov-closure approximation, not an exact
  consequence of projection.
- **Status:** `established` as a projection identity under the source
  assumptions; `plausible` that a finite-memory approximation can improve a
  bounded artificial reduced model at matched information; `speculative` as a
  general AI-efficiency mechanism.
- **Primary sources:** [Zwanzig 1961](https://doi.org/10.1103/PhysRev.124.983),
  read with the [1972 corrected nonlinear derivation](https://doi.org/10.1103/PhysRevA.5.2680);
  [Mori 1965](https://doi.org/10.1143/PTP.33.423); and
  [Chorin, Hald, and Kupferman 2000](https://doi.org/10.1073/pnas.97.7.2968).
- **Rationale:** Projection can move unresolved influence into history and an
  orthogonal component rather than erase it. The exact two-variable linear
  system provides a dimensioned analytic falsification case.
- **AI translation:** A reduced recurrent state may need a measured memory
  window or an explicitly augmented latent state. “Sparse current activation”
  does not by itself justify history-free dynamics.
- **Efficiency mechanism:** Pay only for a bounded history or compact
  augmentation if it is non-inferior to full evolution and materially cheaper
  under the complete work-and-traffic ledger.
- **Failure modes:** kernel truncation bias; hidden-initial-state leakage;
  unstable learned kernels; long-tailed memory; inconsistent projection;
  treating deterministic orthogonal dynamics as independent noise; and
  comparing against a weak Markov null instead of the exact augmented-state
  model.
- **Measurable prediction:** on held-out coupled linear systems with memory
  timescale inside the declared window, a frozen finite-memory arm reduces
  resolved trajectory error relative to a Markov-only arm; any claimed
  resource advantage must remain non-inferior to the exact two-state null.
- **Open question:** Can an online diagnostic distinguish safely truncatable
  memory from an omitted slow variable before long-horizon failure?
- **Affected boundaries:** predictive processing and adaptive computation;
  fast/slow memory and replay; dimensional analysis; resource-normalized
  reduction. These are proposed links, not evidence that those chapters
  currently implement Mori--Zwanzig dynamics.
- **Direct test:** [`AMR-T01`](#amr-t01-c-1526-projected-memory-versus-markov-closure).

### C-1527

- **Claim:** A compact normally hyperbolic critical manifold of a sufficiently
  smooth fast--slow ordinary differential equation persists as a nearby slow
  manifold for sufficiently small nonzero timescale ratio; this ordinary
  guarantee does not extend through a loss of normal hyperbolicity such as a
  fold.
- **Status:** `established` theorem under explicit hypotheses; `plausible` that
  a computable spectral-margin gate can prevent some invalid reductions in a
  bounded synthetic system; `speculative` as a general artificial-system
  certification method.
- **Primary sources:** [Fenichel 1979](https://doi.org/10.1016/0022-0396(79)90152-9)
  and [Krupa and Szmolyan 2001](https://doi.org/10.1137/S0036141099360919).
- **Rationale:** A small parameter alone is not a certificate. Persistence also
  needs a stable geometric object and a nonzero fast spectral margin over the
  region used.
- **AI translation:** Fast-path/slow-path computation should carry an
  abstention boundary based on attraction, healing and spectral margin instead
  of assuming that named timescales imply a slow manifold.
- **Efficiency mechanism:** Use a reduced slow evolution only inside the
  certified support; fall back to the full solver near initial layers, weak
  attraction, folds or off-manifold states.
- **Failure modes:** noncompact support; insufficient regularity; complex fast
  modes crossing the imaginary axis; fold or canard behaviour; delayed loss of
  stability; off-manifold initialization; and estimating a margin from data
  already containing the confirmation answer.
- **Measurable prediction:** a frozen normal-hyperbolicity gate accepts most
  held-out normally hyperbolic cases while abstaining before the reduced
  model's error exceeds its declared bound near folds; reduction without the
  gate fails the protected fold family more often.
- **Open question:** Which observable diagnostics remain reliable when the fast
  Jacobian is unavailable and only short trajectories can be queried?
- **Affected boundaries:** adaptive computation, fast/slow routing, structural
  consolidation, and asymptotic/dimensional analysis. A biological timescale
  label is not evidence for these hypotheses.
- **Direct test:** [`AMR-T02`](#amr-t02-c-1527-normal-hyperbolicity-and-fold-boundary).

### C-1528

- **Claim:** Heterogeneous multiscale methods couple a declared macro solver to
  constrained local micro-solves that estimate otherwise unavailable macro
  data through explicit compression and reconstruction operators; accuracy
  and cost are conditional on macro discretization, micro-domain, boundary,
  sampling, relaxation and compression errors.
- **Status:** `established` as a numerical framework, with scoped convergence
  analysis for specified homogenization problems; `speculative` that the same
  contract yields an AI runtime advantage.
- **Primary sources:** [E and Engquist 2003](https://doi.org/10.4310/CMS.2003.v1.n1.a8),
  [E, Engquist, and Huang 2003](https://doi.org/10.1103/PhysRevB.67.092101),
  and [E, Ming, and Zhang 2005](https://doi.org/10.1090/S0894-0347-04-00469-2).
- **Rationale:** Multiscale savings arise only when the macro method needs
  limited local information and that information can be estimated on smaller
  micro supports than a full fine solve.
- **AI translation:** A coarse controller may query a high-detail module only
  where a declared missing constitutive quantity is needed, while retaining
  the query support, reconstruction and uncertainty in the decision record.
- **Efficiency mechanism:** Replace global fine evolution with bounded local
  micro queries, but count every microcell, boundary treatment, relaxation
  step, failed solve and transferred byte.
- **Failure modes:** resonance between microcell and fine period; biased micro
  boundary conditions; insufficient relaxation; a macro variable that omits a
  relevant mode; double-counting analytic information; and a micro budget that
  secretly exceeds the full fine solve.
- **Measurable prediction:** in a held-out one-dimensional periodic
  heat-conduction family, a frozen HMM arm meets field and flux non-inferiority
  to the full fine solver with fewer fine-grid-equivalent updates; this claim
  is killed if the analytic homogenized null is equally accurate and cheaper,
  or if transfer to phase-shifted/noncommensurate microstructure fails.
- **Open question:** How should query support be selected when microstructure
  is nonstationary and the relevant error is a downstream decision rather than
  a field norm?
- **Affected boundaries:** conditional routing, local specialist queries,
  adaptive computation, and compute/traffic accounting. This claim does not
  make homogenization a universal model-compression recipe.
- **Direct test:** [`AMR-T03`](#amr-t03-c-1528-local-micro-query-contract).

### C-1529

- **Claim:** An equation-free coarse timestepper can be composed as
  restriction after fine evolution after lifting when coarse observables close
  after a declared healing interval; persistent dependence on admissible lifts
  is evidence against closure at that state and horizon.
- **Status:** `established` as a computational framework with published model
  examples; `plausible` as a closure diagnostic in a bounded ensemble
  simulator; `speculative` as a general AI computation pattern.
- **Primary sources:** [Kevrekidis et al. 2003](https://doi.org/10.4310/CMS.2003.v1.n4.a5),
  also available as [arXiv:physics/0209043](https://arxiv.org/abs/physics/0209043),
  and [Gear and Kevrekidis 2003](https://doi.org/10.1137/S1064827501388157).
- **Rationale:** A fine timestepper can support coarse projective computation
  without an explicit closed equation, but only if lifting ambiguity decays
  before the measurement horizon.
- **AI translation:** A coarse planner may call a fine simulator for short
  bursts, estimate a coarse derivative, and project, while a multi-lift
  disagreement gate detects omitted variables.
- **Efficiency mechanism:** amortize short fine bursts over longer coarse
  projective steps only when healing, ensemble variance and rejected
  projections are included in the ledger.
- **Failure modes:** nonunique lifting; insufficient healing; slow hidden
  variables; bistability; rare transitions; projective instability; ensemble
  under-sampling; adaptive retries hidden from resource totals; and training a
  coarse null on confirmation trajectories.
- **Measurable prediction:** in a closed fast--slow ensemble family, a frozen
  healed multi-lift coarse timestepper attains the declared rollout error with
  fewer microsteps than continuous fine evolution, while its disagreement gate
  abstains on a protected omitted-slow-variable family.
- **Open question:** Can closure be certified locally without making the
  ensemble and healing cost comparable to direct fine simulation?
- **Affected boundaries:** world-model simulation, adaptive computation,
  uncertainty-gated routing, and coarse/fine memory. The framework does not
  establish that the selected observables are sufficient.
- **Direct test:** [`AMR-T04`](#amr-t04-c-1529-lift--evolve--restrict-and-closure).

## Exact deduplication verdict

The repository already contains adjacent statements, but none subsumes the
four residues:

1. `C-890` records that averaging or filtering nonlinear fluid equations
   creates unresolved correlations and closure terms. [`C-1526`](#c-1526)
   adds an exact projection decomposition, an orthogonal-dynamics term and a
   memory test; it does not duplicate a fluid-specific closure warning.
2. `C-895`--`C-897` qualify POD, DMD and truncation by target and closure.
   [`C-1527`](#c-1527) adds the normal-hyperbolicity hypotheses and explicit
   fold boundary for slow-manifold persistence.
3. `C-898` and `C-900` qualify adaptive refinement and quantity-of-interest
   control. [`C-1528`](#c-1528) instead fixes compression/reconstruction and
   local micro-query semantics for missing macro data.
4. `C-904`--`C-905` address recoverability and observability.
   [`C-1529`](#c-1529) supplies a lift--evolve--restrict operator and makes
   post-healing lift dependence a closure falsifier.
5. `C-1305` states that an equivalent coarse property is target- and
   boundary-qualified. [`C-1528`](#c-1528) gives a particular numerical
   mechanism and error ledger rather than restating that qualification.
6. `C-1496` and existing fast/slow prose use timescale language but do not
   establish a critical manifold or a Fenichel certificate.

The four new claims must also remain distinct from one another. Mori--Zwanzig
diagnoses what projection retains; GSPT certifies when a slow geometric
reduction persists; HMM assumes a macro discretization and queries missing
local data; equation-free computation assumes coarse observables and a fine
timestepper without requiring an explicit macro equation.

## Common CPU-only falsification contract

Every numerical value below is a synthetic generator setting, numerical
tolerance, minimum detectable project effect, or compute cap. None is an
observed result, safe operating limit, deployment requirement, or legal
threshold.

1. **Runtime and determinism:** implement in TypeScript/JavaScript under the
   repository-pinned Node.js runtime, CPU only, binary64 reference arithmetic,
   no network at run time, and canonical little-endian serialization. Use
   PCG64-DXSM. Hash each literal seed string with SHA-256; bytes 0--15 specify
   the unsigned little-endian 128-bit state and bytes 16--31 the stream
   selector. Initialize with an odd increment, and use rejection sampling for
   bounded integers. Parallel reductions sort by canonical world ID.
2. **Seed packs:** track $k\in\{1,2,3,4\}$ uses public development seeds
   `1526000 + 10000*k + j`, $j=1,\ldots,64$. A registrar creates 128 private
   confirmation and 64 disjoint private transfer seeds per track, publishing
   SHA-256 commitments before code, configuration, and schema freeze. Private
   seeds have no public derivation.
3. **Inference unit:** one seed is one cluster. Timesteps, microcells,
   trajectories, lift replicas, spatial nodes and parameter cases within a
   seed are repeated observations and cannot increase $n$.
4. **Arms and information:** A is the tempting collapsed reduction, B is the
   strongest mature null, C is the audited method, and O is evaluator-only
   fine truth. A/B/C receive identical resolved observations, action authority,
   public metadata, seed packs, tuning calls, CPU-thread cap, and stopping
   rules. Hidden fine state and analytic answers are never exposed unless the
   arm definition explicitly supplies the same item to every compared arm.
5. **Development and freeze:** only public seeds may tune memory windows,
   spectral thresholds, microcell sizes, healing, ensemble size, macro steps,
   regularization or fallback. Select one configuration per arm and track by a
   written lexicographic rule, then freeze code/config/schema hashes before a
   private pack is revealed. No confirmation-dependent retry, threshold,
   feature, solver or seed deletion is allowed.
6. **Failures:** divergence, NaN/Inf, nonconvergence, missing artifacts, hash
   mismatch, deadline overrun, or exhausted retry cap remains in the
   denominator with terminal loss $L_{\max}=100$. An abstention is successful
   only where the protocol permits fallback and the fallback cost and error
   are fully counted.
7. **Compute cap:** at most four physical CPU cores, 2 GiB peak resident memory
   per process, 45 s wall time per arm/seed, and 180 s total wall time per seed
   across A/B/C/O on the reference workstation. Exceeding a cap is a retained
   failure, not a missing datum.
8. **Complete ledger:** each run records fine RHS evaluations, coarse RHS
   evaluations, linear iterations, microsteps, macrosteps, lift/restrict calls,
   healing steps, rejected steps, retries, bytes read, bytes written, attributed
   bytes moved, CPU seconds, wall seconds, peak RSS and artifact bytes. Failed
   work and fallback work remain included. No operation proxy is reported as
   joules.
9. **Primary endpoint:** each seed/arm produces finite clipped loss
   $L_{s,a}\in[0,100]$ from the track's declared native errors and penalties.
   Protected native-unit gates must pass independently; compensation inside a
   composite loss cannot rescue a failed boundary.
10. **Paired inference:** use paired seed differences. For every registered
    mean contrast, form a studentized cluster-bootstrap interval with 100,000
    deterministic resamples. A zero empirical standard error makes a
    nonzero constant contrast decisive and a zero contrast inconclusive.
    Control the four across-track primary boundary families with Holm at
    familywise $\alpha=0.05$; control each track's error and resource novelty
    axes with Holm at $0.05$.
11. **Non-inferiority and resource:** C must be non-inferior to B on primary
    loss with margin $\Delta_L=1.0$ point and on each protected native error
    with its track-specific margin. A resource advantage requires the upper
    95% bound for the paired ratio of C to B to be below `0.80` for the named
    work measure, with no increase above `1.00` for attributed bytes moved,
    peak RSS, or failure rate. Ratios use paired log ratios with a declared
    positive denominator floor.
12. **Transfer:** the frozen configuration is evaluated once on the disjoint
    transfer family. Promotion requires the same directional error, boundary,
    resource and failure gates; transfer data cannot retune the configuration.
13. **No-results authority:** the audit and fixture freeze questions and
    procedures only. They contain no generated data and cannot establish an
    effect, architecture readiness, energy reduction, scientific discovery or
    deployment claim.

## CPU protocols

### AMR-T01 (C-1526): projected memory versus Markov closure

**Question.** Does a frozen finite-memory projected model improve held-out
resolved evolution over a Markov-only closure, and does it retain a resource
advantage against the exact augmented-state null?

**Generator.** For each seed draw 24 stable linear systems
$\dot{x}=-\alpha x+\beta y$, $\dot{y}=\gamma x-\lambda y$ over
$t\in[0,20]\,\mathrm{s}$. Draw $\alpha,\lambda\in[0.25,4]\,\mathrm{s}^{-1}$
log-uniformly, signed $\beta,\gamma\in[-1.5,1.5]\,\mathrm{s}^{-1}$ subject to
$\alpha\lambda-\beta\gamma\ge0.15\,\mathrm{s}^{-2}$, and
$x_0,y_0\in[-2,2]U$. Observe $x$ at 0.05 s intervals;
$y_0$ is evaluator-only. Development uses the stated support. Confirmation
holds out interior parameter cells. Transfer comprises (i) $\beta\gamma=0$,
(ii) $\lambda\in[4,8]\,\mathrm{s}^{-1}$ fast-memory cases, and (iii)
$\lambda\in[0.12,0.25]\,\mathrm{s}^{-1}$ tails longer than the development
window. Every arm receives the resolved prefix $x(t)$ on
$t\in[0,1]\,\mathrm{s}$ at 0.05 s intervals and is scored on one frozen
open-loop rollout over $t\in(1,20]\,\mathrm{s}$; true $y$ is never an arm
input.

**Arms.** A is a first-order Markov model $\dot{x}=a x$ fitted only on public
resolved trajectories. B is the exact two-state augmented model with
parameters estimated from the same resolved development trajectories using a
frozen minimal-realization/state-space procedure; it may maintain a latent
state but never receives true $y$. C is a causal finite-impulse-response memory
model with frozen lag count and stable regularized coefficients. O evaluates
the analytic two-state solution and exact convolution; it supplies no features
or parameters after development freeze.

**Controls and leakage tests.** Zero coupling must make A and C converge to the
same memory-free description. Permuting pre-query histories must damage C if
it actually uses causal memory. Supplying the exact $y_0$ to every arm is a
separate positive control, never part of the registered comparison. Fitting an
analytic kernel to confirmation parameters is oracle leakage and invalidates
the pack.

**Endpoints.** Protected error is time-normalized resolved RMSE divided by
$U$, margin `0.02`; secondary endpoints are maximum absolute resolved error,
phase/sign error, stability failures and coverage. Named work is multiply-add
equivalents plus latent/history state updates; the complete common ledger is
also reported.

**Kill rule.** Reject the proposed finite-memory residue if C is not superior
to A on held-out error, is inferior to B, lacks the registered work advantage
against B, destabilizes the long-memory transfer family, or its advantage
persists after history permutation.

### AMR-T02 (C-1527): normal hyperbolicity and fold boundary

**Question.** Can a frozen spectral-margin/healing gate use a slow reduction
inside normally hyperbolic support and abstain before ordinary slow-manifold
accuracy fails near a fold?

**Generator.** Use the dimensionless fast--slow fold family
$\varepsilon x'=y-x^2$, $y'=-1$, where prime denotes derivative with respect
to $\theta=t/\tau_0$ and the recorded reference is $\tau_0=1\,\mathrm{s}$.
Draw
$\varepsilon\in[0.005,0.08]$, $y_0\in[0.8,1.5]$, a terminal gap
$d_{\min}\in[0.04,0.5]$, and initial offsets from the attracting branch
$x=+\sqrt y$ of at most `0.08`; development and confirmation episodes stop at
$y=d_{\min}>0$. Confirmation uses unseen interior cells. Transfer reduces
$d_{\min}$ to $[10^{-4},0.04)$, introduces offsets up to `0.3`, and includes
protected episodes that continue through $y=0$, where the fast Jacobian
$-2x$ loses its nonzero real-part margin.

**Arms.** A always evolves the quasi-steady branch without a gate. B is a
binary64 adaptive stiff full solver with shared tolerances. C uses a frozen
first-order slow approximation only when a development-selected lower bound
on $|2x|$, healing residual and off-manifold distance passes; otherwise it
falls back to B and counts all diagnosis and fallback work. O is a high-
precision reference trajectory used only for error scoring.

**Controls.** A linear fast subsystem with constant negative fast eigenvalue is
the positive normally hyperbolic control. Reversing the fast eigenvalue gives a
repelling control that the gate must reject. The fold family is not labelled a
counterexample to GSPT; it tests operation outside the ordinary theorem's
hypotheses.

**Endpoints.** Protected errors are slow-variable maximum absolute error
(margin `0.01`) and event-time absolute error (margin `0.02 s`). Gate false
acceptance near the fold must be below `5%`; normally hyperbolic acceptance
must exceed `80%`. Named work is full-solver-equivalent RHS evaluations,
including diagnostic and fallback evaluations.

**Kill rule.** Reject the gate if it accepts inaccurate protected fold cases,
fails the repelling control, accepts fewer than 80% of the normally hyperbolic
support, or cannot reduce named work by the common resource criterion while
remaining non-inferior to B.

### AMR-T03 (C-1528): local micro-query contract

**Question.** Can a frozen HMM macro solver estimate missing local heat flux
with less fine-grid-equivalent work than global fine resolution while meeting
field and flux error bounds?

**Generator.** Solve the steady one-dimensional unit-area slab problem

$$
-\frac{d}{dx}\!\left(\kappa(x/\ell)\frac{dT}{dx}\right)=q(x),\qquad
T(0)=T(L)=300\,\mathrm{K},
$$

with $L=1\,\mathrm{m}$, microperiod $\ell/L\in[1/160,1/40]$,
$\kappa(\xi)=\kappa_0[2+\sin(2\pi\xi+\phi)]$,
$\kappa_0=1\,\mathrm{W\,m^{-1}\,K^{-1}}$, phase $\phi\in[0,2\pi)$, and
$q(x)=q_0[1+0.25\cos(2\pi x/L)]$ with
$q_0\in[40,120]\,\mathrm{W\,m^{-3}}$. Confirmation holds out periods and
phases. Transfer uses noncommensurate microperiods, two smoothly modulated
amplitudes, and a bounded two-frequency coefficient outside the analytic
single-sinusoid family.

**Arms.** A uses the arithmetic-mean conductivity in the shared macro grid. B
uses the analytic harmonic effective conductivity $\kappa_{\mathrm{eff}}=\kappa_0\sqrt{3}$
for the single-sinusoid confirmation family and a declared
quadrature homogenization on transfer. C uses the shared macro grid plus local
constrained periodic microcells to estimate flux, with frozen microcell length,
boundary treatment, quadrature, relaxation and query schedule. O is a globally
fine finite-volume solution with at least 32 cells per shortest period and a
mesh-doubling reference check.

**Equal information.** All arms receive $L$, boundary temperatures, $q(x)$,
the coefficient oracle $\kappa(\xi)$ and the allowed coefficient-query budget.
B's analytic expression is counted as precomputed problem information and is
the strongest null; C may not infer confirmation phase or period from O.
Coefficient calls, microcell unknowns and linear iterations are fully logged.

**Endpoints.** Protected errors are domain-normalized temperature $L^2$ error
(margin `0.20 K`) and boundary-flux absolute error (margin
`0.50 W m^-2`). Named work is fine-cell-equivalent stencil updates; coefficient
oracle calls and bytes moved are separate protected resources.

**Kill rule.** Reject an HMM advantage if C is inferior to B on any supported
family, fails mesh/reference checks, uses more coefficient calls or attributed
bytes than O, or fails the noncommensurate/two-frequency transfer boundary.

### AMR-T04 (C-1529): lift--evolve--restrict and closure

**Question.** Does post-healing agreement across admissible lifts identify a
closed coarse state strongly enough to permit projective integration, while
abstaining when a hidden slow variable prevents closure?

**Generator.** Each seed defines an ensemble of 2,048 fine replicas with
dimensionless $X_i,H_i$ and rate state $V_i$ in $\mathrm{s}^{-1}$.
$V_i$ relaxes toward $m(X_i,H_i)$, also in $\mathrm{s}^{-1}$, at rate
$\rho\in[8,40]\,\mathrm{s}^{-1}$; $X_i$ changes through
the ensemble mean of $V_i$ plus frozen stochastic increments; and $H_i$ is
either absent/fast (closed family) or evolves at
$0.02$--$0.12\,\mathrm{s}^{-1}$ (protected omitted-slow-variable family).
The proposed coarse state is $(\bar X,\operatorname{var}X)$. Three admissible
lifts share those moments but differ in higher moments and $V/H$ conditionals.
Development uses closed cases. Confirmation holds out interior rates and
initial moments. Transfer adds the slow-$H$ family and a closing spectral gap.

**Arms.** A uses one arbitrary lift, no healing and a frozen projective step. B
is a regularized coarse state-space model identified on public fine bursts with
the same resolved variables and query budget. C uses all three lifts, a frozen
healing interval, common-random-number fine bursts, restriction, derivative
estimation and a lift-disagreement gate; rejection falls back to continuous
fine evolution. O continuously evolves the full ensemble for scoring.

**Controls.** Relabelling replica indices must not change a result. Matching
only the mean while changing the variance is an invalid lift and must be
rejected before evolution. Increasing healing should reduce disagreement in
the closed positive control but not erase persistent disagreement caused by
slow $H$. Common random numbers reduce comparison variance but cannot be used
to suppress genuine lift dependence.

**Endpoints.** Protected error is maximum coarse moment error over 20 s
(margins `0.02` for mean and `0.03` for variance). Protected closure metrics
are post-healing maximum pairwise lift disagreement and false acceptance on
the omitted-$H$ family (`<=5%`). Named work is replica-microsteps, including
healing, retries, rejected projections and fallback.

**Kill rule.** Reject the closure mechanism if C does not beat A, is inferior
to B, fails to abstain on omitted $H$, relies on one privileged lift, or its
complete microstep/traffic ledger lacks the common resource advantage against
continuous fine evolution.

## Source-to-claim/test ledger

| Source | Exact support used | Claim | Test boundary |
| --- | --- | --- | --- |
| Zwanzig (1961), read with Zwanzig and Nordholm (1972) | Non-Markovian memory formulation; later correction to the nonlinear transport derivation | C-1526 | The 1961 nonlinear step is not treated as an unrestricted exact formula |
| Mori (1965) | Projection formalism and generalized transport/memory representation | C-1526 | Does not imply finite or cheap memory |
| Chorin, Hald, and Kupferman (2000) | Markov, memory and orthogonal-dynamics decomposition for reduced dynamics | C-1526 | AMR-T01 uses a directly derived linear case |
| Fenichel (1979) | Persistence under normal hyperbolicity and regularity hypotheses | C-1527 | Fold/zero spectral margin is outside ordinary guarantee |
| Krupa and Szmolyan (2001) | Additional analysis near fold and canard singularities | C-1527 | Used to mark, not erase, the boundary |
| E and Engquist (2003) | General HMM macro/micro framework | C-1528 | Requires explicit error and cost decomposition |
| E, Engquist, and Huang (2003) | HMM realization for micromagnetics | C-1528 | Example is not general AI validation |
| E, Ming, and Zhang (2005) | Analysis for elliptic homogenization and compression/reconstruction | C-1528 | Supports the scoped elliptic fixture, not arbitrary PDEs |
| Kevrekidis et al. (2003) | Equation-free coarse timestepper framework | C-1529 | Closure and lifting remain hypotheses |
| Gear and Kevrekidis (2003) | Projective integration with legacy/fine simulators | C-1529 | Savings require complete microstep accounting |

## Test coverage and order

1. Implement analytic/reference evaluators and zero-coupling, constant-margin,
   mesh-doubling and relabelling controls first.
2. Freeze common artifact schemas and exact work/traffic counters.
3. Run public development packs only; select one configuration per arm/track.
4. Publish code, configuration and schema hashes alongside registrar seed
   commitments.
5. Reveal and run each confirmation pack once.
6. Run transfer packs without retuning.
7. Publish failures and protected native-unit endpoints before any composite
   loss or narrative summary.

No track depends on another track passing. A positive result in one family
cannot promote another family or a combined architecture.

## Failure and interpretation firewall

1. A failed Markov arm does not prove that every useful reduction needs long
   memory.
2. A passing spectral gate does not prove the existence of a slow manifold
   outside the tested support.
3. A passing periodic HMM test does not establish savings for stochastic,
   nonstationary or high-dimensional microstructure.
4. A passing equation-free test does not establish that a chosen coarse state
   is globally closed.
5. A method that matches error but loses on complete work or traffic is not an
   efficiency result.
6. A method that saves work only because a null was denied equal information
   is invalid.
7. CPU timing is workstation- and implementation-specific; it is secondary to
   native work and traffic ledgers and is not an energy measurement.

## Open blockers before central integration

1. The central claim ledger, bibliography, audit index and taxonomy routing
   must reserve and reciprocally link C-1526--C-1529 in one later integration.
2. A runner and exact reference-workstation manifest do not exist.
3. Registrar-generated confirmation and transfer commitments do not exist.
4. The analytic or high-precision oracles require independent unit tests.
5. No development, confirmation or transfer result exists.

## Audit verdict

Four nonduplicate, bounded residues survive. Their mathematical cores have
strong primary-source support, but every proposed artificial-system benefit
remains preimplementation. Central integration may register the claims and
fixture without creating a new principle or candidate. No result, energy
benefit, readiness, or deployment conclusion is warranted.

## Audit-local BibTeX bibliography

These keys are audit-local recommendations. Central integration must deduplicate
them by DOI before adding any bibliography record.

```bibtex
@article{zwanzig1961memory,
  author = {Zwanzig, Robert},
  title = {Memory Effects in Irreversible Thermodynamics},
  journal = {Physical Review},
  year = {1961},
  volume = {124},
  number = {4},
  pages = {983--992},
  doi = {10.1103/PhysRev.124.983},
  url = {https://doi.org/10.1103/PhysRev.124.983}
}

@article{zwanzigNordholm1972corrected,
  author = {Zwanzig, Robert and Nordholm, K. S. J. and Mitchell, W. C.},
  title = {Memory Effects in Irreversible Thermodynamics: Corrected Derivation of Transport Equations},
  journal = {Physical Review A},
  year = {1972},
  volume = {5},
  number = {6},
  pages = {2680--2682},
  doi = {10.1103/PhysRevA.5.2680},
  url = {https://doi.org/10.1103/PhysRevA.5.2680}
}

@article{mori1965transport,
  author = {Mori, Hazime},
  title = {Transport, Collective Motion, and Brownian Motion},
  journal = {Progress of Theoretical Physics},
  year = {1965},
  volume = {33},
  number = {3},
  pages = {423--455},
  doi = {10.1143/PTP.33.423},
  url = {https://doi.org/10.1143/PTP.33.423}
}

@article{chorinHaldKupferman2000optimal,
  author = {Chorin, Alexandre J. and Hald, Ole H. and Kupferman, Raz},
  title = {Optimal Prediction and the Mori--Zwanzig Representation of Irreversible Processes},
  journal = {Proceedings of the National Academy of Sciences},
  year = {2000},
  volume = {97},
  number = {7},
  pages = {2968--2973},
  doi = {10.1073/pnas.97.7.2968},
  url = {https://doi.org/10.1073/pnas.97.7.2968}
}

@article{fenichel1979geometric,
  author = {Fenichel, Neil},
  title = {Geometric Singular Perturbation Theory for Ordinary Differential Equations},
  journal = {Journal of Differential Equations},
  year = {1979},
  volume = {31},
  number = {1},
  pages = {53--98},
  doi = {10.1016/0022-0396(79)90152-9},
  url = {https://doi.org/10.1016/0022-0396(79)90152-9}
}

@article{krupaSzmolyan2001extending,
  author = {Krupa, Martin and Szmolyan, Peter},
  title = {Extending Geometric Singular Perturbation Theory to Nonhyperbolic Points---Fold and Canard Points in Two Dimensions},
  journal = {SIAM Journal on Mathematical Analysis},
  year = {2001},
  volume = {33},
  number = {2},
  pages = {286--314},
  doi = {10.1137/S0036141099360919},
  url = {https://doi.org/10.1137/S0036141099360919}
}

@article{eEngquist2003heterogeneous,
  author = {E, Weinan and Engquist, Bjorn},
  title = {The Heterogeneous Multiscale Methods},
  journal = {Communications in Mathematical Sciences},
  year = {2003},
  volume = {1},
  number = {1},
  pages = {87--132},
  doi = {10.4310/CMS.2003.v1.n1.a8},
  url = {https://doi.org/10.4310/CMS.2003.v1.n1.a8}
}

@article{eEngquistHuang2003heterogeneous,
  author = {E, Weinan and Engquist, Bjorn and Huang, Zhongyi},
  title = {Heterogeneous Multiscale Method: A General Methodology for Multiscale Modeling},
  journal = {Physical Review B},
  year = {2003},
  volume = {67},
  number = {9},
  pages = {092101},
  doi = {10.1103/PhysRevB.67.092101},
  url = {https://doi.org/10.1103/PhysRevB.67.092101}
}

@article{eMingZhang2005analysis,
  author = {E, Weinan and Ming, Pingbing and Zhang, Pingwen},
  title = {Analysis of the Heterogeneous Multiscale Method for Elliptic Homogenization Problems},
  journal = {Journal of the American Mathematical Society},
  year = {2005},
  volume = {18},
  number = {1},
  pages = {121--156},
  doi = {10.1090/S0894-0347-04-00469-2},
  url = {https://doi.org/10.1090/S0894-0347-04-00469-2}
}

@article{kevrekidisEtAl2003equationFree,
  author = {Kevrekidis, Ioannis G. and Gear, C. William and Hyman, James M. and Kevrekidis, Panagiotis G. and Runborg, Olof and Theodoropoulos, Constantinos},
  title = {Equation-Free, Coarse-Grained Multiscale Computation: Enabling Microscopic Simulators to Perform System-Level Analysis},
  journal = {Communications in Mathematical Sciences},
  year = {2003},
  volume = {1},
  number = {4},
  pages = {715--762},
  doi = {10.4310/CMS.2003.v1.n4.a5},
  eprint = {physics/0209043},
  archivePrefix = {arXiv},
  url = {https://doi.org/10.4310/CMS.2003.v1.n4.a5}
}

@article{gearKevrekidis2003projective,
  author = {Gear, C. William and Kevrekidis, Ioannis G.},
  title = {Projective Methods for Stiff Differential Equations: Problems with Gaps in Their Eigenvalue Spectrum},
  journal = {SIAM Journal on Scientific Computing},
  year = {2003},
  volume = {24},
  number = {4},
  pages = {1091--1106},
  doi = {10.1137/S1064827501388157},
  url = {https://doi.org/10.1137/S1064827501388157}
}
```

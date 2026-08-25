# Multiscale reduction contract

<!-- markdownlint-disable MD013 -->

- **Status:** pre-implementation mathematical and accounting contract
- **Claims:** [C-1526](../research/claims.md#c-1526)--[C-1529](../research/claims.md#c-1529)
- **Source audit:** [applied multiscale reduction](../research/audits/2026-08-25-applied-multiscale-reduction.md)
- **Fixture:** [F-024](../experiments/fixtures/024-applied-multiscale-reduction.md)
- **Result state:** an AMR-T01 development-only smoke runner exists; no sealed confirmation or transfer run, reference-workstation result, measured effect, or energy result exists

This note fixes notation, units, exact identities, approximation boundaries,
and resource ledgers for four different reduction methods. It does not assert
that a biological or artificial workload has short memory, a slow manifold, a
valid homogenized limit, or closed coarse variables.

## 1. Notation and units

| Symbol | Meaning | Unit |
| --- | --- | --- |
| $t,s,T,t_h$ | physical, integration, burst, and healing times | s |
| $x,y,z$ | resolved, unresolved, and full states | component-specific; $U$ in the linear example |
| $\alpha,\beta,\gamma,\lambda$ | linear rate coefficients | s$^{-1}$ |
| $K(\tau)$ | linear memory kernel | s$^{-2}$ when $x,y$ share $U$ |
| $\eta(t)$ | unresolved-initial-condition transient | $U\,$s$^{-1}$ |
| $P,Q$ | projection and complementary projection, $Q=I-P$ | dimensionless operators |
| $\mathcal L$ | Liouville generator | s$^{-1}$ |
| $\tau_f,\tau_s$ | fast and slow reference times | s |
| $\varepsilon=\tau_f/\tau_s$ | timescale ratio | dimensionless |
| $f,g$ | fast and slow vector fields after time scaling | same state units as $x$ and $y$, respectively |
| $X_0$ | declared trajectory-magnitude scale for $x$ | $U$ |
| $S_0$ | critical manifold $f(x,y,0)=0$ | state space |
| $\sigma_f$ | minimum magnitude of fast spectral real part | dimensionless in fast time; s$^{-1}$ if dimensionalized |
| $u,U$ | fine and coarse states | component-specific |
| $Q_c$ | compression/restriction from fine to coarse state | typed operator |
| $R(U,\xi)$ | reconstruction/lift with admissible lift index $\xi$ | fine state |
| $\Phi_T^f,\Phi_T^c$ | fine and induced coarse propagators over $T$ | typed maps |
| $L,x,\ell$ | slab length, coordinate, and microperiod | m |
| $T_h(x)$ | temperature field; subscript avoids confusion with burst time | K |
| $\kappa$ | thermal conductivity | W m$^{-1}$ K$^{-1}$ |
| $q$ | volumetric heat source | W m$^{-3}$ |
| $J=-\kappa\,dT_h/dx$ | heat flux | W m$^{-2}$ |
| $N_*$ | event or operation count | count |
| $B_*$ | attributed data traffic or storage | byte |
| $t_{\mathrm{cpu}},t_{\mathrm{wall}}$ | measured process and elapsed times | s |
| $M_{\mathrm{RSS}}$ | peak resident-set size | byte |

Subscripts identify objects; they do not silently change units. Every
implementation artifact must store a unit string beside dimensional fields.
Dimensionless normalization constants remain in the manifest rather than
being discarded after preprocessing.

## 2. Exact resolved memory in a coupled linear system

### 2.1 Full model

Consider

$$
\dot{x}(t)=-\alpha x(t)+\beta y(t),\qquad
\dot{y}(t)=\gamma x(t)-\lambda y(t),
\tag{1}
$$

with $[x]=[y]=U$ and
$[\alpha]=[\beta]=[\gamma]=[\lambda]=\mathrm{s}^{-1}$. Each right-hand term
has unit $U\,\mathrm{s}^{-1}$. Stability of the two-dimensional linear system
is guaranteed in the fixture by

$$
\alpha+\lambda>0,
\qquad
\alpha\lambda-\beta\gamma>0.
\tag{2}
$$

Equation (2) is a generator restriction, not a biological or deployment
limit.

### 2.2 Eliminate the unresolved state

Multiplying the second equation by $e^{\lambda t}$ gives

$$
\frac{d}{dt}\left(e^{\lambda t}y(t)\right)
=\gamma e^{\lambda t}x(t).
\tag{3}
$$

Integrating from $0$ to $t$ and multiplying by $e^{-\lambda t}$ yields

$$
y(t)=e^{-\lambda t}y_0
+\gamma\int_0^t e^{-\lambda(t-s)}x(s)\,ds.
\tag{4}
$$

Substitution into the first equation gives the exact resolved equation

$$
\dot{x}(t)=-\alpha x(t)
+\underbrace{\beta e^{-\lambda t}y_0}_{\eta(t)}
+\int_0^t
\underbrace{\beta\gamma e^{-\lambda(t-s)}}_{K(t-s)}x(s)\,ds.
\tag{5}
$$

The three contributions in (5) are instantaneous resolved dynamics, a
transient determined by unresolved initial state, and a memory convolution.
They are exact for (1); no stochastic premise is required.

### 2.3 Dimensional analysis

The kernel has

$$
[K]=[\beta\gamma]=\mathrm{s}^{-2}.
$$

Since $[x(s)\,ds]=U\,\mathrm{s}$,

$$
\left[\int_0^t K(t-s)x(s)\,ds\right]
=U\,\mathrm{s}^{-1}.
$$

Also $[\eta]=[\beta y_0]=U\,\mathrm{s}^{-1}$. Thus every term in (5) has
the unit of $\dot x$. An implementation that stores $K$ as a dimensionless
attention weight without its time discretization is not implementing (5).

For uniform step $\Delta t$, a left-rule discrete memory approximation is

$$
M_n=\Delta t\sum_{j=0}^{n-1}K((n-j)\Delta t)x_j,
\tag{6}
$$

where $\Delta t\,K$ has unit s$^{-1}$. A learned discrete coefficient
$w_j=\Delta t K(j\Delta t)$ therefore has unit s$^{-1}$, not unit one.

### 2.4 Markov and finite-memory approximations

If $\lambda$ is large relative to the resolved variation rate, $x$ is smooth
on $1/\lambda$, and the initial layer has decayed, then

$$
\int_0^t e^{-\lambda(t-s)}x(s)\,ds
=\frac{x(t)}{\lambda}+O(\lambda^{-2}\dot{x})
+O\!\left(\frac{X_0}{\lambda}e^{-\lambda t}\right).
\tag{7}
$$

Here $X_0$ is a declared bound or reference scale with the same unit $U$ as
$x$. All three terms in (7) therefore have unit $U\,\mathrm{s}$; the final
term records the exponentially decaying initial-layer contribution rather
than adding a dimensionless remainder to a dimensional integral.

This gives the leading Markov approximation

$$
\dot{x}\approx
\left(-\alpha+\frac{\beta\gamma}{\lambda}\right)x.
\tag{8}
$$

Equation (8) is conditional on timescale separation and initial-layer control.
It is not obtained by merely setting $y=0$. A finite window $W$ instead drops

$$
R_W(t)=\int_0^{\max(0,t-W)}K(t-s)x(s)\,ds,
\tag{9}
$$

whose error requires a bound on both kernel tail and trajectory magnitude. A
short fitted window is not self-validating.

The original two-state system (1) is an exact augmented-state representation.
It is the strongest compact null for this example: a finite-memory model must
not claim mathematical novelty merely for approximating a system that the
latent state represents exactly.

## 3. General projection identity and its boundary

Let the autonomous fine dynamics be $\dot z=F(z)$ and let observables evolve
under the Liouville generator

$$
\mathcal L A(z)=F(z)\cdot\nabla A(z).
\tag{10}
$$

For a declared projection $P$ on observables, $Q=I-P$, and sufficient
regularity for the semigroups below, the Dyson identity gives one common
Mori--Zwanzig form:

$$
\frac{d}{dt}e^{t\mathcal L}A
=e^{t\mathcal L}P\mathcal L A
+e^{tQ\mathcal L}Q\mathcal L A
+\int_0^t e^{(t-s)\mathcal L}P\mathcal L
e^{sQ\mathcal L}Q\mathcal L A\,ds.
\tag{11}
$$

Depending on convention, equivalent rearrangements place propagators or
projectors differently. The implementation must record the chosen convention;
pieces from incompatible conventions cannot be combined by label.

In (11):

1. $e^{t\mathcal L}P\mathcal L A$ is the propagated Markov term;
2. $e^{tQ\mathcal L}Q\mathcal L A$ is the orthogonal-dynamics term; and
3. the integral is the memory term.

If $A$ has unit $U$, then $\mathcal LA$ and the first two right-hand terms have
unit $U\,$s$^{-1}$. Inside the integral, two generators contribute
$U\,$s$^{-2}$ and integration restores $U\,$s$^{-1}$. Calling the
orthogonal-dynamics term “noise” does not establish independence, stationarity,
Gaussianity, or zero mean.

The 1961 nonlinear transport derivation must be read with the 1972 correction
for omitted fluctuations. This note relies on the directly checked linear
derivation (1)--(5) for the fixture and treats (11) only within its declared
operator assumptions.

## 4. Fast--slow geometry and normal hyperbolicity

### 4.1 Scaling

Start with reference times $\tau_f,\tau_s>0$:

$$
\tau_f\frac{dx}{dt}=f(x,y,\varepsilon),\qquad
\tau_s\frac{dy}{dt}=g(x,y,\varepsilon),\qquad
\varepsilon=\frac{\tau_f}{\tau_s}.
\tag{12}
$$

Here $f$ and $g$ have the same state units as $x$ and $y$ respectively. With
slow time $\theta=t/\tau_s$, (12) becomes

$$
\varepsilon x'=f(x,y,\varepsilon),\qquad
y'=g(x,y,\varepsilon),
\tag{13}
$$

where prime means $d/d\theta$ and the vector fields carry the corresponding
state units. They become dimensionless only after an additional, explicitly
recorded state normalization. With fast time $r=t/\tau_f$,

$$
\dot x_r=f(x,y,\varepsilon),\qquad
\dot y_r=\varepsilon g(x,y,\varepsilon).
\tag{14}
$$

### 4.2 Critical and slow manifolds

At $\varepsilon=0$, the critical manifold is

$$
S_0=\{(x,y):f(x,y,0)=0\}.
\tag{15}
$$

For a compact submanifold $K\subset S_0$, define the fast spectral margin

$$
\sigma_f(K)=
\inf_{(x,y)\in K}
\min_{\mu\in\operatorname{spec}D_xf(x,y,0)}|\operatorname{Re}\mu|.
\tag{16}
$$

$K$ is normally hyperbolic when $\sigma_f(K)>0$ and the splitting required by
the theorem is uniform. Under the requisite smoothness and compactness,
Fenichel persistence supplies a locally invariant $S_\varepsilon$ near $K$
for sufficiently small $\varepsilon$. The theorem is local to the qualified
compact set and sufficiently small, not all, $\varepsilon$.

### 4.3 Boundary at a fold

For the dimensionless fold normal form used in `AMR-T02`,

$$
\varepsilon x'=y-x^2,\qquad y'=-1,
\tag{17}
$$

$S_0=\{y=x^2\}$. The fast Jacobian is

$$
D_xf=-2x.
\tag{18}
$$

The branch $x>0$ is attracting in fast time, the branch $x<0$ is repelling,
and at $(x,y)=(0,0)$ the spectral margin vanishes. Ordinary normal-hyperbolic
persistence therefore does not cover the fold point. Special fold/canard
analysis can describe additional behaviour under additional hypotheses; it
does not retroactively make (16) positive.

An operational gate may estimate a lower margin, an invariance residual and an
off-manifold distance, but that estimate is a diagnostic, not a theorem. Its
false-acceptance and abstention rates must be tested against a full stiff
solver, including initial layers and held-out fold approaches.

## 5. Compression, reconstruction, and local micro queries

Let $X_f$ and $X_c$ be typed fine and coarse state spaces. Define

$$
Q_c:X_f\rightarrow X_c,
\qquad
R:X_c\times\Xi\rightarrow X_f,
\tag{19}
$$

where $Q_c$ is compression/restriction and $R(U,\xi)$ is a reconstruction or
lift indexed by admissible unresolved detail $\xi$. Exact consistency would be

$$
Q_cR(U,\xi)=U.
\tag{20}
$$

Numerical consistency instead records

$$
e_{QR}(U,\xi)=\|Q_cR(U,\xi)-U\|_{X_c}
\tag{21}
$$

and compares it with a frozen tolerance. Equation (20) or small (21) does not
guarantee dynamical closure.

Suppose a macro scheme advances

$$
U_{n+1}=\mathcal M_{\Delta T}(U_n;D(U_n)),
\tag{22}
$$

but the macro datum $D(U)$, such as a constitutive flux, is unavailable. HMM
uses a constrained micro problem on support $\omega(U)$:

$$
u^{\xi}_{m+1}=\mathcal S_{\delta t}
\bigl(u^{\xi}_m;U,\omega,b,\xi\bigr),
\qquad
\widehat D(U)=\mathcal A\left(\{u^{\xi}_m\}_{m=m_h}^{m_h+m_a}\right),
\tag{23}
$$

where $b$ is the micro boundary rule, $m_h$ is relaxation/healing count,
$m_a$ is averaging count and $\mathcal A$ is the declared estimator. The
error must be decomposed, at minimum, as

$$
e_{\mathrm{total}}
\le e_{\mathrm{macro}}+e_{\mathrm{micro}}+e_{\mathrm{boundary}}
+e_{\mathrm{relax}}+e_{\mathrm{sampling}}+e_{QR}.
\tag{24}
$$

The terms need not be statistically independent and may not be combined in
quadrature without a proof. A local solve is not cheap by definition; support,
unknowns, coefficient queries, iterations, retries and transfers all enter the
ledger.

For the one-dimensional heat track,

$$
-\frac{d}{dx}\left(\kappa(x/\ell)\frac{dT_h}{dx}\right)=q(x).
\tag{25}
$$

$dT_h/dx$ has unit K m$^{-1}$, so the inner flux has unit W m$^{-2}$ and its
divergence W m$^{-3}$, matching $q$. For
$\kappa(\xi)=\kappa_0[2+\sin(2\pi\xi+\phi)]$, the one-dimensional periodic
effective coefficient is the harmonic mean

$$
\kappa_{\mathrm{eff}}
=\left(\int_0^1\frac{d\xi}{\kappa(\xi)}\right)^{-1}
=\kappa_0\sqrt{3}.
\tag{26}
$$

This analytic result is the strongest null for the single-sinusoid family, not
information that may be hidden from a comparator.

## 6. Lift--evolve--restrict and equation-free closure

Given a fine propagator $\Phi_T^f$, define the lift-specific coarse map

$$
\Phi_T^c(U;\xi)=Q_c\Phi_T^f(R(U,\xi)).
\tag{27}
$$

With healing $t_h$ followed by measurement burst $T_b$, one derivative
estimator is

$$
\widehat F_c(U;\xi)=
\frac{
Q_c\Phi_{t_h+T_b}^f(R(U,\xi))
-Q_c\Phi_{t_h}^f(R(U,\xi))}{T_b}.
\tag{28}
$$

For an admissible lift set $\Xi_U$, define post-healing disagreement

$$
D_{\mathrm{lift}}(U;t_h,T_b)=
\max_{\xi_i,\xi_j\in\Xi_U}
\left\|\widehat F_c(U;\xi_i)-
\widehat F_c(U;\xi_j)\right\|_{X_c}.
\tag{29}
$$

A small value is evidence only at the tested state, lift family, healing time,
burst, ensemble size and norm. Persistent disagreement falsifies the proposed
closure at that horizon. Agreement can be falsely induced by using identical
lifts, an insensitive restriction, an overlong burst that crosses the decision
horizon, shared random numbers without independent variance checks, or a norm
that suppresses the omitted coordinate.

A projective step

$$
U_{n+1}=U_n+\Delta T\,\widehat F_c(U_n)
\tag{30}
$$

must record stability rejections and fallback. Work spent on an abandoned
projective step remains work.

## 7. Error, work, traffic, and microstep ledgers

### 7.1 Accuracy records

Every seed, world and arm records protected errors before aggregation:

$$
e_{L^2}(a)=
\left(
\frac{1}{T}\int_0^T
\|Q_cz_a(t)-Q_cz_O(t)\|_2^2\,dt
\right)^{1/2},
\tag{31}
$$

or the protocol's spatial analogue, plus maximum error, flux/event error,
coverage, abstention, failure and closure disagreement. Numerical quadrature
and interpolation rules are frozen. An absent output receives the terminal
loss; it is not omitted.

### 7.2 Compute ledger

For every arm, record nonnegative integer counters:

| Counter | Required content |
| --- | --- |
| $N_{\mathrm{fine,RHS}}$ | all fine-model RHS evaluations, including rejected solver steps |
| $N_{\mathrm{coarse,RHS}}$ | all explicit coarse-model RHS evaluations |
| $N_{\mathrm{lin}}$ | linear iterations, including failed and setup iterations |
| $N_{\mathrm{micro}}$ | replica-, cell-, or particle-microsteps, not merely burst calls |
| $N_{\mathrm{macro}}$ | accepted and rejected macrosteps, separated in raw fields |
| $N_{\mathrm{lift}}$ | reconstruction/lifting calls for every replica and retry |
| $N_{\mathrm{restrict}}$ | compression/restriction calls |
| $N_{\mathrm{heal}}$ | microsteps executed only for healing/relaxation |
| $N_{\mathrm{query}}$ | coefficient, simulator, or oracle queries permitted to the arm |
| $N_{\mathrm{retry}}$ | retries and fallback invocations |

A declared operation proxy is

$$
W_{\mathrm{proxy}}=
c_fN_{\mathrm{fine,RHS}}
+c_cN_{\mathrm{coarse,RHS}}
+c_lN_{\mathrm{lin}}
+c_mN_{\mathrm{micro}}
+c_LN_{\mathrm{lift}}
+c_QN_{\mathrm{restrict}},
\tag{32}
$$

where every coefficient $c_*$ is a frozen measured instruction- or
multiply-add-equivalent calibration with manifest hash. Track-specific named
work may use a raw counter such as $N_{\mathrm{micro}}$ to avoid hiding a
dominant cost inside weights. Report both. Do not tune $c_*$ after results.
Counters used together in (32) must represent disjoint work. If, for example,
$N_{\mathrm{micro}}$ is a labelled subset of $N_{\mathrm{fine,RHS}}$, the
manifest sets one corresponding coefficient to zero and records the parent--
child relation; nested counters may not be charged twice.

### 7.3 Traffic and memory ledger

Attributed algorithmic traffic is

$$
B_{\mathrm{moved}}=
B_{\mathrm{state,read}}+B_{\mathrm{state,write}}
+B_{\mathrm{history,read}}+B_{\mathrm{history,write}}
+B_{\mathrm{coeff}}+B_{\mathrm{lift}}+B_{\mathrm{restrict}}
+B_{\mathrm{solver}}+B_{\mathrm{artifact}}.
\tag{33}
$$

Each component is counted from typed-array lengths times element widths plus
serialized metadata bytes. Allocation alone is not traffic. Cache-line or
hardware-counter estimates may be added as a separately labelled measurement;
they may not replace (33) silently. Record:

1. logical bytes read and written by component;
2. artifact bytes written;
3. peak live algorithmic bytes from allocation instrumentation;
4. process $M_{\mathrm{RSS}}$;
5. CPU and wall seconds; and
6. implementation, runtime, operating-system and processor manifest hashes.

### 7.4 HMM and equation-free microstep identities

For HMM macro queries $q=1,\ldots,N_q$ with microcell unknown count $n_q$,
relaxation steps $h_q$, averaging steps $a_q$ and solver iterations $i_q$,

$$
N_{\mathrm{micro}}^{\mathrm{HMM}}
=\sum_{q=1}^{N_q}n_q(h_q+a_q+i_q),
\tag{34}
$$

unless the implementation supplies a more literal disaggregated counter. It
is invalid to report only $N_q$.

For equation-free coarse steps $k=1,\ldots,N_K$, lifts
$j=1,\ldots,n_{\xi,k}$, replicas $r=1,\ldots,n_{r,k}$ and executed fine steps
$m_{kjr}$ including healing, burst, rejected projection and fallback,

$$
N_{\mathrm{micro}}^{\mathrm{EF}}
=\sum_{k=1}^{N_K}
\sum_{j=1}^{n_{\xi,k}}
\sum_{r=1}^{n_{r,k}}m_{kjr}.
\tag{35}
$$

Adaptive increases in lift count, replicas, healing, or burst length remain in
(35). A fallback full solve is added, not substituted after deleting the failed
coarse attempt.

### 7.5 Equal-resource and equal-information comparisons

For compared arms A/B/C, freeze:

1. identical resolved observations and timestamps;
2. identical coefficient or simulator-query authority;
3. identical public development worlds and private pack commitments;
4. identical tuning-call, CPU-thread, wall-time and memory caps;
5. no fine hidden state or analytic answer unique to the proposed arm;
6. identical terminal-loss handling; and
7. complete pre-fallback plus fallback accounting.

If an analytic null legitimately knows a coefficient formula, that knowledge
is recorded as problem information and its storage/precomputation is stated.
The proposed arm may not claim an information advantage by withholding a
closed-form solution that is part of the declared problem family.

## 8. Validation invariants

Before any experiment result can be interpreted, a runner must prove:

1. equations (1) and (5) match to numerical tolerance on random stable systems;
2. discrete kernel units include $\Delta t$ and converge under step halving;
3. zero coupling makes the exact memory term zero;
4. the fold gate reports loss of margin as $x\rightarrow0$;
5. reconstruction error (21) is recorded for every lift/micro query;
6. the analytic harmonic mean (26) matches direct quadrature;
7. replica relabelling leaves restrictions and results invariant;
8. operation, microstep and byte ledgers reconcile with raw events;
9. failures and fallbacks remain in every aggregate; and
10. no field labelled energy or joules is emitted without an independently
    specified physical measurement protocol.

Until these invariants, the four fixture tracks, sealed confirmation, and
transfer gates are complete, this note supports only a testable mathematical
contract. It contains no performance result.

# Boundary-qualified physical-computation contract

This note defines the quantitative boundary for
[Fixture F-010](../experiments/fixtures/010-boundary-qualified-physical-computation.md).
It operationalizes the durable result of the
[information thermodynamics and physical computation audit](../research/audits/2026-08-05-information-thermodynamics-physical-computation.md):
a fundamental lower bound, a device transition, a circuit, a workload, a
facility, and a hardware lifecycle answer different questions and cannot be
substituted for one another.

- **Status:** fixture mathematics; no new principle or candidate
- **Comparison unit:** one preregistered useful-task service contract evaluated
  over a declared hardware lifecycle
- **Primary rule:** report energy, time, error, stability, uncertainty, and
  accepted outcomes jointly at every boundary used in a claim

## Identity and useful-task contract

For arm $a$, hardware instance $h$, workload episode $e$, and measurement
interval $r$, seal the immutable identity

$$
I_{a,h,e,r}=(a,h,e,r,v^{\mathrm{hw}},v^{\mathrm{sw}},v^{\mathrm{cal}},s,t_0,t_1),
$$

where $a$ is an arm identifier [identifier], $h$ is a physical hardware
identifier [identifier], $e$ is an episode identifier [identifier], $r$ is a
meter interval identifier [identifier], $v^{\mathrm{hw}}$ is hardware and
firmware version [identifier], $v^{\mathrm{sw}}$ is software, compiler, model,
and configuration version [identifier], $v^{\mathrm{cal}}$ is instrument and
calibration version [identifier], $s$ is site [identifier], and $t_0,t_1$ are
interval endpoints [s] with duration $\tau_r=t_1-t_0$ [s]. Repair,
recalibration, replacement, remapping, or version change creates a linked new
identity rather than overwriting history.

Let requested outcome $j$ have preregistered service vector

$$
R_j=(q_j,L_j^{\max},\rho_j^{\max},\Theta_j,	au_j^{\mathrm{ret}}),
$$

where $q_j$ is the required task-quality vector in declared task-native units,
$L_j^{\max}$ is maximum allowed end-to-end latency [s], $\rho_j^{\max}$ is a
vector of maximum allowed failure and escaped-harm probabilities
[failure/request], $\Theta_j$ is minimum useful throughput [request/s], and
$\tau_j^{\mathrm{ret}}$ is required state-retention horizon [s]. Define

$$
A_j=\mathbf 1\!\left[
Q_j\succeq q_j\ \land\ L_j\le L_j^{\max}\ \land\
\rho_j\preceq\rho_j^{\max}\ \land\ \Theta\ge\Theta_j
\right],
$$

where $A_j\in\{0,1\}$ is accepted-outcome status, $Q_j$ is measured quality in
the same units as $q_j$, $L_j$ is measured latency [s], $\rho_j$ is the measured
risk vector [failure/request], $\Theta$ is delivered throughput [request/s],
$\succeq$ and $\preceq$ mean every registered component passes its direction,
and $\mathbf 1[\cdot]$ is an indicator [dimensionless]. Let

$$
N_{\mathrm{acc}}=\sum_{j=1}^{N_{\mathrm{req}}}A_j,
\qquad
f_{\mathrm{acc}}=\frac{N_{\mathrm{acc}}}{N_{\mathrm{req}}},
$$

where $N_{\mathrm{req}}$ is requested outcomes [request], $N_{\mathrm{acc}}$ is
accepted outcomes [accepted outcome], and $f_{\mathrm{acc}}$ is accepted fraction
[dimensionless]. Rejected, abstained, timed-out, silently corrupted, retried,
and safety-blocked requests remain in $N_{\mathrm{req}}$ and the resource ledger.

## Six-boundary energy vector

For a sealed comparison unit, report

$$
\mathbf E=
\left(
E^{\mathrm{fund}},
E^{\mathrm{dev}},
E^{\mathrm{circ}},
E^{\mathrm{IT}},
E^{\mathrm{fac}},
E^{\mathrm{emb}}
\right) \quad [\mathrm J],
$$

where $E^{\mathrm{fund}}$ is a theorem-qualified lower bound for the declared
information operation [J], $E^{\mathrm{dev}}$ is measured energy crossing the
device terminals [J], $E^{\mathrm{circ}}$ is measured or calibrated energy of
the complete circuit and controls [J], $E^{\mathrm{IT}}$ is metered IT energy
for the complete workload [J], $E^{\mathrm{fac}}$ is allocated facility energy
[J], and $E^{\mathrm{emb}}$ is allocated fabrication-to-retirement energy [J].
The vector is not a sum: boundaries can be nested. A report must state whether
$E^{\mathrm{dev}}\subset E^{\mathrm{circ}}\subset E^{\mathrm{IT}}\subset E^{\mathrm{fac}}$
for its meters.

Per-accepted-outcome intensity at boundary $b$ is

$$
e^b=\frac{E^b}{N_{\mathrm{acc}}}
\quad [\mathrm{J/accepted\ outcome}],
\qquad
b\in\{\mathrm{dev,circ,IT,fac,emb,life}\}.
$$

If $N_{\mathrm{acc}}=0$, $e^b$ is undefined and the arm fails; it is not reported
as zero. `fund` is excluded from this normalization unless the logical operation
and accepted outcome have an explicit registered multiplicity.

## Fundamental information-operation boundary

### Logical loss and generalized erasure

Let $X$ be the input logical state, $Y$ the retained logical output, and $S$
usable side information, all discrete random variables [state]. With natural
logarithms, define

$$
H(X\mid Y,S)=-\sum_{x,y,s}p(x,y,s)
\ln p(x\mid y,s) \quad [\mathrm{nat}],
$$

where $p(x,y,s)$ is the joint probability [dimensionless].
$H(X\mid Y,S)$ records input distinctions unavailable from retained output and
side state. It is not automatically heat; a physical encoding and protocol are
still required.

For physical microstate $z\in\mathcal Z$, probability $p(z)$ [dimensionless],
Hamiltonian $\mathcal H(z)$ [J], bath temperature $T$ [K], and Boltzmann
constant $k_B=1.380649\times10^{-23}$ J/K, define nonequilibrium free energy

$$
\mathcal F[p,\mathcal H]
=\sum_{z\in\mathcal Z}p(z)\mathcal H(z)
+k_BT\sum_{z\in\mathcal Z}p(z)\ln p(z)
\quad [\mathrm J].
$$

For an isothermal transformation under the assumptions registered by the
selected theorem, expected work performed on the system obeys

$$
\langle W_{\mathrm{on}}\rangle\ge
\Delta\mathcal F
=\mathcal F[p_1,\mathcal H_1]-\mathcal F[p_0,\mathcal H_0]
\quad [\mathrm J],
$$

where $p_0,p_1$ are initial and final microstate distributions,
$\mathcal H_0,\mathcal H_1$ are initial and final Hamiltonians [J], and
$W_{\mathrm{on}}$ is work on the system [J]. The protocol class, bath, initial
state, correlations, cycle closure, and controls are part of the theorem.

For cyclic reset of a degenerate, uniformly random binary memory with symmetric
final error probability $\epsilon\in[0,1/2]$, the special case is

$$
E^{\mathrm{fund}}_{\mathrm{reset}}(T,\epsilon)
=k_BT\left[\ln2-h(\epsilon)\right] \quad [\mathrm J],
$$

where

$$
h(\epsilon)=-\epsilon\ln\epsilon-(1-\epsilon)\ln(1-\epsilon)
\quad [\mathrm{nat}]
$$

is binary entropy. At $\epsilon=0$, this becomes $k_BT\ln2$. For a biased input,
nondegenerate memory, correlated side state, finite reservoir, or noncyclic
operation, use the applicable generalized bound rather than this special case.

### Finite time, error, and state stability

For protocol $\pi$ with duration $\tau_\pi$ [s], define empirical excess work

$$
W^{\mathrm{ex}}_\pi
=\langle W_{\mathrm{on},\pi}\rangle-\Delta\mathcal F
\quad [\mathrm J].
$$

$W^{\mathrm{ex}}_\pi$ is compared only among protocols with matched initial and
final physical distributions, error definition, bath, and controls. The joint
protocol outcome is

$$
\mathbf g_\pi=
(\langle W_{\mathrm{on},\pi}\rangle,
\tau_\pi,\epsilon_\pi,p^{\mathrm{tail}}_\pi)
\quad [\mathrm J,\mathrm s,1,1],
$$

where $\epsilon_\pi$ is mean logical error [error/transition] and
$p^{\mathrm{tail}}_\pi$ is a registered high-work or harmful-event probability
[event/transition]. No coordinate may be silently scalarized.

For one activated bistable-memory null,

$$
\tau_{\mathrm{ret}}=\tau_0
\exp\!\left(\frac{\Delta U}{k_BT}\right) \quad [\mathrm s],
\qquad
p_{\mathrm{loss}}(t)=1-
\exp\!\left(-\frac{t}{\tau_{\mathrm{ret}}}\right),
$$

where $\tau_0$ is attempt time [s], $\Delta U$ is effective barrier [J],
$\tau_{\mathrm{ret}}$ is mean retention time [s], $t$ is storage time [s], and
$p_{\mathrm{loss}}$ is loss probability [loss/stored state]. The equation is a
registered activated-process null, not a universal retention law.

Define error-consequence energy

$$
E^{\mathrm{err}}=
E^{\mathrm{detect}}+E^{\mathrm{correct}}+E^{\mathrm{retry}}
+E^{\mathrm{fallback}}+E^{\mathrm{lost\ service}}
\quad [\mathrm J],
$$

where the terms are measured detection, correction, retry, fallback, and
allocated lost-service energy [J]. Harm and task loss not expressible in joules
remain separate registered coordinates.

## Nonequilibrium, feedback, and uncertainty-relation scope

For repeated realizations initially in canonical equilibrium at inverse
temperature $\beta=(k_BT)^{-1}$ [1/J], a registered Jarzynski test uses

$$
\widehat J=\frac{1}{N_\pi}\sum_{i=1}^{N_\pi}
\exp(-\beta W_i),
\qquad
J_0=\exp(-\beta\Delta F),
$$

where $N_\pi$ is independent protocol realizations [realization], $W_i$ is work
on realization $i$ [J], $\Delta F$ is equilibrium free-energy change [J], and
$\widehat J,J_0$ are dimensionless. Report the work distribution, rare-event
coverage, dependence diagnostics, and uncertainty of $\widehat J$; a single
$W_i<\Delta F$ is not a violation.

For feedback measurement record $M$ and controlled state $X$, let mutual
information be

$$
I(X;M)=\sum_{x,m}p(x,m)\ln
\frac{p(x,m)}{p(x)p(m)} \quad [\mathrm{nat}].
$$

The joint feedback ledger is

$$
E^{\mathrm{joint}}_{
\mathrm{feedback}}
=E^{\mathrm{plant}}+E^{\mathrm{sense}}+E^{\mathrm{record}}
+E^{\mathrm{control}}+E^{\mathrm{actuate}}+E^{\mathrm{reset}}
\quad [\mathrm J],
$$

where every term is energy crossing the declared plant, sensor, record memory,
controller, actuator, or reset boundary [J]. Extracted work from the plant is
reported with sign and cannot cancel unmeasured controller work.

For a stationary continuous-time Markov jump model and a registered integrated
current $J_t$ over duration $t$ [s], the original steady-state thermodynamic
uncertainty relation is tested as

$$
\mathcal U_t=
\frac{\operatorname{Var}(J_t)}{\langle J_t\rangle^2}
\Sigma_t\ge2,
$$

where $\Sigma_t$ is expected total entropy production in units of $k_B$
[dimensionless], and $\mathcal U_t$ is dimensionless. Before evaluating it,
register the current, transition graph, Markov property, stationarity,
time-reversal convention, observation completeness, and estimator for
$\Sigma_t$. A finite-time, transient, non-Markovian, deterministic, or quantum
claim requires its own cited inequality and assumptions; failure of this scope
test blocks the inference.

## Device, circuit, and memory boundaries

### Measured device transition

For device transition $k$ over interval $[t_k^0,t_k^1]$, terminal energy is

$$
E_k^{\mathrm{dev}}=
\sum_{c=1}^{C_k}\int_{t_k^0}^{t_k^1}V_{k,c}(t)i_{k,c}(t)\,dt
\quad [\mathrm J],
$$

where $C_k$ is the number of terminals or supplied channels [channel],
$V_{k,c}$ is measured potential [V], $i_{k,c}$ is signed current [A], and time
$t$ is [s]. Instrument bandwidth, phase, probe loading, integration rule,
calibration covariance, and recovered-energy sign are registered. Heat requires
an independent calorimetric or validated thermodynamic inference; terminal
electrical energy is not relabeled as heat.

For conventional capacitive switching, the registered null is

$$
E^{\mathrm{dyn}}=\alpha C_{\mathrm{eff}}V^2N_{\mathrm{cyc}}
\quad [\mathrm J],
$$

where $\alpha$ is mean activity per cycle [transition/cycle],
$C_{\mathrm{eff}}$ is effective switched capacitance [F], $V$ is supply voltage
[V], and $N_{\mathrm{cyc}}$ is cycles [cycle]. Short-circuit, leakage, clock,
interconnect, and control energy are additional measured terms.

For an idealized adiabatic RC path, use the scoped model

$$
E^{\mathrm{adiabatic}}(\tau)
=\gamma\frac{RC}{\tau}CV^2
+P_{\mathrm{leak}}\tau+E^{\mathrm{clock}}(\tau)
+E^{\mathrm{control}}+E^{\mathrm{I/O}}+E^{\mathrm{reset}}
\quad [\mathrm J],
$$

where $R$ is effective resistance [ohm], $C$ is capacitance [F], $\tau$ is
transition time [s] with registered slow-ramp support, $\gamma$ is a
waveform-dependent coefficient [dimensionless], $P_{\mathrm{leak}}$ is leakage
power [W], and the remaining terms are measured clock, control, input/output,
and reset energies [J]. A real crossover exists at operating point $o$ only if

$$
E^{\mathrm{adiabatic}}(o)<E^{\mathrm{ordinary}}(o)
$$

at matched task quality, transition error, useful throughput, area or hardware
budget, temperature, and complete cyclic state.

### Logical reversibility and closed history

For a reversible arm, let $B^{\mathrm{anc}}$ be prepared ancilla bits [bit],
$B^{\mathrm{hist}}$ be retained history [bit], $B^{\mathrm{out}}$ be preserved
output [bit], and $B^{\mathrm{garb}}$ be garbage remaining before closure [bit].
The run closes only when each non-output state is assigned exactly one action:

$$
B^{\mathrm{anc}}+B^{\mathrm{hist}}+B^{\mathrm{garb}}
=B^{\mathrm{uncompute}}+B^{\mathrm{retain}}+B^{\mathrm{export}}
+B^{\mathrm{erase}} \quad [\mathrm{bit}],
$$

where the right-hand terms are uncomputed, deliberately retained, exported, and
erased bits [bit]. Each action carries circuit, movement, stability, and eventual
reset energy. Equality is a bookkeeping conservation rule, not a claim that all
logical states are independent or uniformly random.

### Retention and correction ledger

For memory tier $m$, define

$$
E_m^{\mathrm{memory}}
=N_m^{\mathrm w}e_m^{\mathrm w}
+N_m^{\mathrm r}e_m^{\mathrm r}
+N_m^{\mathrm{ref}}e_m^{\mathrm{ref}}
+E_m^{\mathrm{ECC}}+E_m^{\mathrm{scrub}}+E_m^{\mathrm{move}}
+E_m^{\mathrm{idle}}
\quad [\mathrm J],
$$

where $N_m^{\mathrm w}$, $N_m^{\mathrm r}$, and $N_m^{\mathrm{ref}}$ are write,
read, and refresh counts [operation]; $e_m^{\mathrm w}$,
$e_m^{\mathrm r}$, and $e_m^{\mathrm{ref}}$ are measured energy per respective
operation [J/operation]; and the remaining terms are error-correction,
scrubbing, movement, and idle energy [J]. Report raw bit errors, detected
uncorrectable errors, miscorrections, silent corruption, retries, endurance,
retention distribution, and accepted retrievals separately.

## Workload and data-movement boundary

Partition the implemented workload into physical hierarchy links
$\ell\in\mathcal L$, including register, local memory, cache, on-package,
off-package memory, host, storage, and network paths. Define

$$
E^{\mathrm{move}}=
\sum_{\ell\in\mathcal L}
B_\ell\widehat e_\ell(B_\ell,d_\ell,p_\ell,o_\ell)
\quad [\mathrm J],
$$

where $B_\ell$ is bytes transferred on link $\ell$ [byte], $d_\ell$ is physical
or logical distance class [class], $p_\ell$ is precision and encoding [bit/value
and identifier], $o_\ell$ is the operating point containing voltage,
temperature, rate, and utilization [registered tuple], and
$\widehat e_\ell$ is a measured energy model [J/byte] with a coverage interval.
A component table from another process or workload may be a prior but not a
measurement.

For routed or sparse workload episode $e$, let

$$
E_e^{\mathrm{IT}}=
\int_{t_e^0}^{t_e^1}P^{\mathrm{IT}}_e(t)\,dt
\quad [\mathrm J],
$$

where $P^{\mathrm{IT}}_e(t)$ is metered IT power [W], and $t_e^0,t_e^1$ are
episode boundaries [s]. The declared IT boundary contains compute, memory,
interconnect, storage and network shares, host orchestration, routing metadata,
load imbalance, idle allocation, conversion, correction, calibration, rejected
work, and retries. Diagnostic decomposition is

$$
E_e^{\mathrm{IT}}=
E_e^{\mathrm{arith}}+E_e^{\mathrm{move}}+E_e^{\mathrm{route}}
+E_e^{\mathrm{sync}}+E_e^{\mathrm{convert}}+E_e^{\mathrm{idle}}
+E_e^{\mathrm{maint}}+E_e^{\mathrm{retry}}
\quad [\mathrm J],
$$

where every right-hand term is an allocated measured or calibrated energy [J].
The equality is checked against the top-level meter within registered closure
tolerance $\delta_E$ [J]; an unclosed residual remains explicit.

Let requested arithmetic count be $N_e^{\mathrm{op}}$ [operation], useful bytes
be $B_e^{\mathrm{use}}$ [byte], routed candidates be $N_e^{\mathrm{route}}$
[candidate], and active hardware-time capacity be

$$
C_e^{\mathrm{cap}}=
\sum_{u=1}^{U}n_u\tau_{e,u}
\quad [\mathrm{device\ s}],
$$

where $U$ is hardware class count [class], $n_u$ is provisioned device count
[device], and $\tau_{e,u}$ is reserved wall time [s]. Slower execution and idle
replicas are therefore not free when throughput is held constant.

## Facility and cooling boundary

For facility interval $r$, measure

$$
E_r^{\mathrm{fac}}=
\int_{t_0}^{t_1}P_r^{\mathrm{fac}}(t)\,dt,
\qquad
E_r^{\mathrm{IT}}=
\int_{t_0}^{t_1}P_r^{\mathrm{IT}}(t)\,dt
\quad [\mathrm J],
$$

where $P_r^{\mathrm{fac}}$ is total data-centre facility power [W] and
$P_r^{\mathrm{IT}}$ is IT-equipment power [W] under the registered ISO/IEC
30134-2 measurement category and boundaries. Power usage effectiveness is

$$
\operatorname{PUE}_r=
\frac{E_r^{\mathrm{fac}}}{E_r^{\mathrm{IT}}}
\quad [\mathrm{dimensionless}].
$$

For a task cohort $c$ sharing interval $r$, allocated facility energy is

$$
E_{c,r}^{\mathrm{fac}}
=E_{c,r}^{\mathrm{IT}}
+w_{c,r}\left(E_r^{\mathrm{fac}}-E_r^{\mathrm{IT}}\right)
\quad [\mathrm J],
$$

where $E_{c,r}^{\mathrm{IT}}$ is directly metered or allocation-qualified cohort
IT energy [J], and $w_{c,r}\in[0,1]$ is a preregistered overhead-allocation
weight with $\sum_cw_{c,r}=1$. At minimum, test IT-energy, peak-demand,
space/capacity, and direct cooling-submeter allocation cases. Multiplying an
episode by a generic PUE is not a confirmatory measurement.

Cooling diagnostics report

$$
E_r^{\mathrm{cool}}=
E_r^{\mathrm{chiller}}+E_r^{\mathrm{fan}}+E_r^{\mathrm{pump}}
+E_r^{\mathrm{tower}}+E_r^{\mathrm{control}}
\quad [\mathrm J],
$$

where the terms are chiller, fan, pump, heat-rejection, and cooling-control
energy [J]. Ambient dry-bulb and wet-bulb temperatures [K], humidity
[dimensionless], supply/return temperatures [K], flow [m$^3$/s], utilization
[dimensionless], and site are held or modeled explicitly. PUE is not carbon,
water, task quality, or a cooling coefficient of performance.

## Embodied lifecycle boundary

For hardware cohort $h$, define cradle-to-retirement primary-energy inventory

$$
E_h^{\mathrm{life}}=
E_h^{\mathrm{fab}}+E_h^{\mathrm{pack}}+E_h^{\mathrm{transport}}
+E_h^{\mathrm{deploy}}+E_h^{\mathrm{op}}+E_h^{\mathrm{maint}}
+E_h^{\mathrm{replace}}+E_h^{\mathrm{EOL}}
\quad [\mathrm J],
$$

where the terms are allocated fabrication, packaging, transport, deployment,
operation including facility share, maintenance, replacement, and end-of-life
primary energy [J]. Credits, if allowed by the preregistered lifecycle method,
are signed and shown separately.

Let $Y_h\in(0,1]$ be accepted packaged yield [accepted device/started device],
$N_h^{\mathrm{start}}$ be started units [device], $N_h^{\mathrm{life}}$ be
lifetime accepted task outcomes [accepted outcome], and $u_h$ be useful
utilization [useful device-second/provisioned device-second]. The lifecycle
intensity is

$$
e_h^{\mathrm{life}}=
\frac{E_h^{\mathrm{life}}}{N_h^{\mathrm{life}}}
\quad [\mathrm{J/accepted\ outcome}],
$$

with $N_h^{\mathrm{life}}$ estimated only over registered deployment demand,
support lifetime, failure, maintenance, retirement, and replacement policies.
Yield and utilization are reported rather than absorbed into an optimistic
denominator.

For new specialized hardware $s$ versus an already available conventional arm
$c$, the operational-energy break-even count is

$$
N^*=
\frac{
E_s^{\mathrm{emb}}-E_c^{\mathrm{incremental\ emb}}
}{e_c^{\mathrm{op}}-e_s^{\mathrm{op}}}
\quad [\mathrm{accepted\ outcome}],
$$

when $e_c^{\mathrm{op}}>e_s^{\mathrm{op}}$. Here $E_s^{\mathrm{emb}}$ is newly
incurred embodied energy [J], $E_c^{\mathrm{incremental\ emb}}$ is additional
embodied energy incurred by the conventional option [J], and
$e_c^{\mathrm{op}},e_s^{\mathrm{op}}$ are facility-inclusive operational
intensities [J/accepted outcome]. If the denominator is nonpositive, no positive
energy break-even exists. $N^*$ is reported as a distribution under yield,
utilization, service-life, demand, and allocation uncertainty.

Climate, water, material criticality, toxicity, and labor are separate outcome
coordinates. For greenhouse-gas inventory,

$$
G_h=\sum_{g=1}^{G}a_{h,g}\chi_g
\quad [\mathrm{kg\ CO_2e}],
$$

where $a_{h,g}$ is activity amount in its declared inventory unit, $\chi_g$ is
the geography-, time-, and pathway-qualified characterization factor
[kg CO$_2$e/inventory unit], and $G$ is inventory-flow count [flow]. Energy
alone does not determine $G_h$.

## Uncertainty, support, and matched comparison

For reported outcome $y$ [native unit], decompose its estimator as

$$
\widehat y=y+b^{\mathrm{meter}}+b^{\mathrm{model}}
+b^{\mathrm{alloc}}+\varepsilon,
$$

where $b^{\mathrm{meter}}$ is meter/calibration bias [native unit],
$b^{\mathrm{model}}$ is model-form or extrapolation bias [native unit],
$b^{\mathrm{alloc}}$ is shared-resource allocation effect [native unit], and
$\varepsilon$ is repeatability variation [native unit]. Report a coverage or
credible interval for $y$, calibration lineage, covariance where quantities
share meters or models, and sensitivity across registered allocation and
lifecycle cases. An interval for repeatability alone is not total uncertainty.

Let $x$ be an episode/regime feature vector in registered native units and
$\mathcal S_{\mathrm{val}}$ be validation support. Define a preregistered support
distance

$$
d_{\mathrm{sup}}(x)=
\inf_{z\in\mathcal S_{\mathrm{val}}}
\left\|D^{-1}(x-z)\right\|_2
\quad [\mathrm{dimensionless}],
$$

where $D$ is a diagonal matrix of fixed feature scales in the same units as
$x$, and $\|\cdot\|_2$ is Euclidean norm. Authority is withheld when
$d_{\mathrm{sup}}(x)>d_{\max}$, where $d_{\max}$ is a sealed dimensionless
threshold. Other support tests are allowed only when specified before the
held-out release.

The primary outcome vector for arm $a$ is

$$
\mathbf Y_a=
\left(
f_{\mathrm{acc}},Q,L_{0.50},L_{0.99},\rho,
e^{\mathrm{IT}},e^{\mathrm{fac}},e^{\mathrm{life}},
E^{\mathrm{err}},C^{\mathrm{cap}},G,W,M
\right),
$$

where $f_{\mathrm{acc}}$ is accepted fraction [dimensionless], $Q$ is registered
task quality [task-native units], $L_{0.50},L_{0.99}$ are median and 99th
percentile latency [s], $\rho$ is the registered risk vector
[failure/request], the $e$ terms are energy intensity [J/accepted outcome],
$E^{\mathrm{err}}$ is error-consequence energy [J], $C^{\mathrm{cap}}$ is
capacity use [device s], $G$ is greenhouse-gas inventory [kg CO$_2$e], $W$ is
water inventory [m$^3$], and $M$ is a material/labor burden vector in declared
native units. The vector is not reduced to one score after observing results.

Arm $p$ Pareto-dominates null $n$ only if its simultaneous uncertainty region is
no worse on every hard-gated coordinate and strictly better on at least one
preregistered primary coordinate under every required sensitivity case. Let

$$
D_{p,n}=1
$$

denote that decision [dimensionless], and $D_{p,n}=0$ otherwise. A component
energy win with worse quality, risk, latency, capacity, or another required
boundary cannot set $D_{p,n}=1$.

The [illustrative simultaneous-decision figure](visual-models.md#contextual-analytical-figures)
shows the uncertainty regions and hard gates without assigning measured values
to any system.

## Equal-budget constraints

For resource $r\in\mathcal R$, require

$$
B_{a,r}\le B_r^{\max},
$$

where $B_{a,r}$ is arm-$a$ consumption in the native unit of resource $r$ and
$B_r^{\max}$ is the shared ceiling in that unit. The registered resource set is

$$
\mathcal R=\{
\text{data},\text{design work},\text{fabrication},\text{area},
\text{memory},\text{sensors},\text{controls},\text{reserve},
\text{training compute},\text{wall time},\text{capacity},
\text{operational energy},\text{maintenance},\text{replacement}
\}.
$$

Each resource has its own unit; unlike quantities are never summed. If an arm
uses less of a capped resource, the unused amount remains reported and is not
converted into post-hoc credit. If an arm violates any hard ceiling, its result
is infeasible rather than penalized by a chosen scalar.

## Required nulls and ablations

The complete null stack contains, when technically compatible:

1. source/channel coding, compression, quantization, pruning, batching,
   memoization, caching, compiler elimination, and recomputation;
2. clock and power gating, dynamic voltage/frequency scaling, near-threshold
   operation, mixed precision, structured sparsity, tiling, data reuse, and
   hierarchy-aware placement;
3. reversible logic with closed ancilla/history accounting, adiabatic or
   energy-recovery logic with measured power clock, and conventional logic at
   matched throughput and process;
4. ECC, checksums, retry, checkpoint/replay, guardbands, calibration,
   redundancy, and abstention;
5. matched digital, analog, in-memory, optical, and neuromorphic implementations
   including conversion, communication, control, drift, thermal, and host work;
6. direct facility metering and registered shared-overhead allocations; and
7. ISO 14040/14044 lifecycle cases with common functional unit, yield,
   utilization, lifetime, replacement, geography, and uncertainty.

Ablations remove exactly one of: generalized physical-state modeling;
finite-time optimization; finite-error accounting; retention/correction;
closed reversible history; power-clock recovery; feedback-controller boundary;
TUR scope gate; hierarchy-aware routing; facility metering; embodied inventory;
or uncertainty/support gating. Recalibrate each ablation only within the same
development budget. An ablation that makes an arm infeasible is recorded as
such, not silently retuned with additional resources.

## Held-out regimes and hard retirement

Confirmation splits group by physical device, fabrication cohort, circuit and
clock instance, software/model version, workload family, data-layout and
hierarchy regime, task shift, transition duration, final error target,
temperature, retention horizon, sensor/controller version, facility/site,
season, electricity case, and future time. Random transitions or requests from
the same group are development diagnostics only.

Retire the broad physical-efficiency composition if any of the following holds:

1. a claimed lower bound lacks its state distribution, Hamiltonian, bath,
   correlations, final error, duration, or cycle boundary;
2. a device advantage disappears when waveform source, parasitics, control,
   correction, and full transition closure are measured;
3. a reversible advantage excludes history, ancillae, output preservation,
   uncomputation, retention, export, or eventual erasure;
4. an adiabatic advantage disappears at matched useful throughput, hardware
   capacity, error, and leakage-inclusive power-clock cost;
5. a feedback or information-engine gain disappears when sensing, memory,
   control, actuation, and reset share one boundary;
6. a thermodynamic uncertainty inference fails its process, current,
   stationarity, observation, or entropy-production scope test;
7. a memory advantage fails the required retention, endurance, correction,
   silent-corruption, or replacement contract;
8. arithmetic savings are offset by routing, data movement, synchronization,
   conversion, imbalance, or idle capacity;
9. a facility claim uses component power, TDP, or a generic PUE instead of
   calibrated interval evidence;
10. lifecycle superiority depends on an unsupported yield, utilization,
    lifetime, demand, allocation, electricity, or replacement assumption;
11. no Pareto gain survives the strongest compatible null stack, held-out
    regimes, and required uncertainty sensitivities; or
12. the result lowers quality, safety, latency, retention, or coverage relative
    to the sealed useful-task contract.

Passing this contract supplies evidence only for the already named candidate
scope in Fixture F-010. It creates no project-wide claim, principle, or
candidate by itself.

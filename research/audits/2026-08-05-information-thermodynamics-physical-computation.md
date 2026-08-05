# Information thermodynamics and physical computation: primary-source audit

- **Audit date:** 2026-08-05
- **Scope:** logical and physical information; Landauer erasure; reversible and
  adiabatic computing; finite-time, finite-error, and finite-reservoir costs;
  fluctuation relations; information engines; thermodynamic uncertainty;
  sensing and learning; retention and analog noise; circuit and data-movement
  energy; facility cooling; fabrication and lifecycle burden
- **Evidence rule:** audit-local claims require a primary paper, experiment, or
  authoritative standard. A theorem supports only its declared physical model,
  initial state, controls, reservoir, observable, and asymptotic regime. An
  isolated device result does not establish application or lifecycle efficiency.
- **Promotion state:** audit-local `THERMO-` claims only. No new principle or
  experiment candidate is promoted. The residual is an evaluation contract.

## Executive finding

Information is physical, but there is no single conversion from an algorithmic
operation, parameter, token, or floating-point operation to joules. The durable
result of this audit is a **six-boundary physical-computation firewall**:

1. a logical transformation specifies which distinctions are retained or
   discarded;
2. a physical device implements that transformation through a stated protocol,
   error allowance, duration, temperature, and state distribution;
3. a circuit supplies clocks, controls, wires, converters, leakage management,
   synchronization, correction, and reset;
4. a computer moves and stores data across a hierarchy while executing a
   workload at declared precision, utilization, and acceptance criteria;
5. a facility supplies power conversion, cooling, networking, and other
   infrastructure; and
6. a lifecycle includes fabrication, packaging, deployment, maintenance,
   replacement, and end of life.

Landauer's principle is a lower bound on a specified logically irreversible
physical transformation under stated thermodynamic assumptions. It is not an
energy-per-FLOP constant, a power bound, or a forecast of accelerator energy.
Reversible logic can avoid mandatory information destruction, and adiabatic
protocols can reduce particular switching losses, but neither removes finite
time, leakage, clock, control, communication, error, storage, or eventual reset
costs. Nonequilibrium equalities and thermodynamic uncertainty relations add
powerful tests, yet their assumptions prevent using them as generic AI-system
efficiency laws.

The strongest useful transfer is therefore methodological. Every efficiency
claim should name the accepted task, expose every energy boundary, report time
and error jointly, distinguish measured energy from a theoretical minimum, and
include capital and lifecycle work when hardware specialization or retention
changes. This contract deduplicates into existing project principles and
fixtures; it is not a new natural principle.

## Outcome and construct firewall

| Boundary | Quantity that may be claimed | Required qualifiers | Invalid substitution |
| --- | --- | --- | --- |
| fundamental | minimum expected work for a defined state transformation | initial distribution, Hamiltonian, bath temperature, final error, correlations, protocol class, cycle closure | $k_BT\ln2$ per gate, FLOP, parameter, or token |
| device | measured terminal energy or heat for one switch, memory, sensor, or converter | waveform, duration, voltage, temperature, state preparation, error distribution, parasitics, instrumentation | ideal erasure work or simulated internal energy |
| circuit | energy of logic plus clocks, controls, interconnect, leakage, ancillae, conversion, correction, and reset | technology, layout, frequency, utilization, precision, voltage, thermal state, I/O boundary | core-switching energy or energy of successful paths only |
| computer/workload | wall-plug IT energy per accepted task or service | complete software, memory hierarchy, batch size, quality gate, latency, failures, retries, idle allocation, useful throughput | peak TOPS/W, TDP, or one kernel |
| facility | total facility energy and demand attributable under a declared allocation | IT boundary, cooling, conversion, network, storage, measurement interval, location, weather, allocation rule | PUE multiplied into an unspecified task or PUE as carbon intensity |
| lifecycle | cumulative energy, emissions, material and water burdens per functional unit | fabrication yield, packaging, transport, maintenance, lifetime, utilization, replacement, geography, electricity mix, end of life, uncertainty | operational electricity alone |

### Typed energy ledger

For each result, record rather than merge:

- `logical_erasure_bound_J`: a theorem-derived lower bound for the declared
  transformation;
- `device_terminal_J`: measured electrical, optical, mechanical, or chemical
  energy crossing the device boundary;
- `circuit_overhead_J`: clocks, control, interconnect, sensing, conversion,
  leakage, correction, history, reset, and unused capacity;
- `it_task_J`: metered IT energy divided by accepted task outcomes;
- `facility_task_J`: allocated facility energy divided by accepted outcomes;
- `embodied_task_J`: allocated fabrication-to-retirement burden per accepted
  outcome; and
- `uncertainty`: coverage interval plus model and allocation sensitivity.

The entries are related but not interchangeable. A lower number at one boundary
does not establish a lower number at another.

## Shared quantitative model

### Logical information and erasure

For a discrete memory state $X$ with probabilities $p_x$, use natural
logarithms and define Shannon entropy

$$
H(X)=-\sum_x p_x\ln p_x \quad [\mathrm{nat}].
$$

For a cyclic, isothermal, quasistatic reset of a degenerate memory whose logical
state has distribution $p$, the ideal expected work obeys

$$
W_{\min}\ge k_BT H(X) \quad [\mathrm J],
$$

where $k_B=1.380649\times10^{-23}$ J/K is the exact SI value of the Boltzmann
constant ([BIPM SI Brochure](https://www.bipm.org/en/publications/si-brochure))
and $T$ is bath temperature [K]. The familiar $k_BT\ln2$ follows only for a
uniformly random binary state. If reset may end in the wrong logical state with probability
$\epsilon\in[0,1/2]$ under the symmetric binary model, the information reduction
is

$$
\Delta H=\ln2-h(\epsilon),\qquad
h(\epsilon)=-\epsilon\ln\epsilon-(1-\epsilon)\ln(1-\epsilon),
$$

so the corresponding ideal bound is $W_{\min}\ge k_BT\Delta H$. This is not a
permission to omit the downstream cost of an error.

For a system with microstate $z$, Hamiltonian $E(z)$ [J], and distribution
$p(z)$ [1/state], define nonequilibrium free energy

$$
\mathcal F[p,E]=\sum_z p(z)E(z)+k_BT\sum_zp(z)\ln p(z)
=F_{\mathrm{eq}}+k_BT D_{\mathrm{KL}}(p\Vert p_{\mathrm{eq}}) \quad [\mathrm J].
$$

Here $F_{\mathrm{eq}}$ is equilibrium Helmholtz free energy [J] and
$D_{\mathrm{KL}}$ is dimensionless. General work bounds depend on changes in
$\mathcal F$, not on logical labels alone. Side information, correlations,
nondegenerate energy levels, and finite reservoirs alter the accounting.

### Nonequilibrium identities

For repeated realizations of a system initially at canonical equilibrium,
driven by a specified protocol while coupled to a bath at inverse temperature
$\beta=(k_BT)^{-1}$ [1/J], Jarzynski's equality is

$$
\left\langle e^{-\beta W}\right\rangle=e^{-\beta\Delta F},
$$

where $W$ is work performed on the system [J] and $\Delta F$ is the equilibrium
free-energy difference [J]. For a time-reversed protocol satisfying microscopic
reversibility, Crooks' relation is

$$
\frac{P_F(W)}{P_R(-W)}=e^{\beta(W-\Delta F)},
$$

where $P_F$ and $P_R$ are forward and reverse work probability densities
[1/J]. Individual trajectories can have $W<\Delta F$; the ensemble identities
remain intact.

With feedback based on a measurement record $M$, one common Sagawa--Ueda form is

$$
\left\langle e^{-\beta(W-\Delta F)-I(X;M)}\right\rangle=1,
$$

where $I(X;M)$ is trajectory-level mutual information [nat] under that model.
Work extracted from the controlled subsystem cannot be evaluated without the
measurement, memory, controller, and reset boundary.

### Precision, current, and dissipation

For a stationary continuous-time Markov jump process and an integrated current
$J_t$ satisfying the original steady-state thermodynamic uncertainty relation,

$$
\frac{\operatorname{Var}(J_t)}{\langle J_t\rangle^2}
\,\Sigma_t\ge2,
$$

where $\Sigma_t$ is expected total entropy production over duration $t$ in
units of $k_B$ [dimensionless]. The observable, dynamics, stationarity, time
regime, and reversal convention are part of the theorem. Later finite-time,
transient, and quantum variants use different hypotheses and bounds.

For a bistable memory with an activated escape model,

$$
\tau_{\mathrm{ret}}\approx\tau_0e^{\Delta E/(k_BT)} \quad [\mathrm s],
\qquad
p_{\mathrm{loss}}(t)=1-e^{-t/\tau_{\mathrm{ret}}},
$$

where $\tau_0$ is an attempt time [s], $\Delta E$ is an effective barrier [J],
and $p_{\mathrm{loss}}$ is dimensionless. The approximation assumes a scoped
activated process; real devices can have multiple barriers, history, field,
temperature gradients, and correlated failure.

For an idealized capacitance $C$ [F] charged conventionally through a resistive
path from 0 to supply voltage $V$ [V], a full charge-discharge event draws and
ultimately dissipates approximately

$$
E_{\mathrm{CMOS}}\approx CV^2 \quad [\mathrm J].
$$

An activity model uses $P_{\mathrm{dyn}}\approx\alpha CV^2f$ [W], where
$\alpha$ is the dimensionless activity per cycle and $f$ is frequency [Hz]. In
an idealized slow ramp through resistance $R$ [ohm] over transition time $\tau$
[s], adiabatic charging has the scaling

$$
E_{\mathrm{ad}}\sim \gamma\frac{RC}{\tau}CV^2 \quad [\mathrm J],
$$

for $\tau\gg RC$, with dimensionless waveform coefficient $\gamma$. This is an
RC-protocol model, not a universal lower bound; leakage and clock-generation
cost grow important as operation slows.

For an additive white Gaussian noise communication channel, reliable
communication at vanishing spectral efficiency has the asymptotic bound

$$
\frac{E_b}{N_0}\ge\ln2,
$$

where $E_b$ is received energy per information bit [J] and $N_0$ is one-sided
noise spectral density [J]. It is a channel-coding result, not a logic-switching
law.

### Workload, facility, and lifecycle denominators

Let $N_{\mathrm{acc}}$ be the number of outputs passing a preregistered task
acceptance rule. Define

$$
e_{\mathrm{IT}}=
\frac{\int_0^{t_f}P_{\mathrm{IT}}(t)\,dt}{N_{\mathrm{acc}}}
\quad [\mathrm{J/accepted\ outcome}],
$$

including computation, memory, I/O, retries, idle allocation, and required
control inside the declared IT boundary. Facility power-usage effectiveness is

$$
\mathrm{PUE}=
\frac{E_{\mathrm{facility}}}{E_{\mathrm{IT}}}
\quad[\mathrm{dimensionless}],
$$

measured over the interval and boundary required by ISO/IEC 30134-2. PUE does
not report task quality, carbon intensity, water, or embodied burden.

For lifecycle comparison, let $E_{\mathrm{emb}}$, $E_{\mathrm{op}}$,
$E_{\mathrm{maint}}$, and $E_{\mathrm{EOL}}$ be allocated embodied,
operational, maintenance, and end-of-life primary energy [J] under one functional
unit and system boundary. Then

$$
e_{\mathrm{life}}=
\frac{E_{\mathrm{emb}}+E_{\mathrm{op}}+E_{\mathrm{maint}}+E_{\mathrm{EOL}}}
{N_{\mathrm{acc,life}}}
\quad [\mathrm{J/accepted\ outcome}].
$$

Carbon dioxide equivalent requires a separate inventory and characterization;
it cannot be recovered from energy alone without geography-, time-, and
pathway-specific factors.

## Strong ordinary null stack

A proposed physical-efficiency mechanism must beat the relevant composition of:

- Shannon source/channel coding, ordinary lossy compression, quantization,
  pruning, batching, memoization, caching, and compiler common-subexpression
  elimination;
- clock gating, power gating, dynamic voltage/frequency scaling, near-threshold
  operation, multi-bit and mixed-precision arithmetic, accelerator tiling, data
  reuse, sparse storage, and memory-hierarchy placement;
- reversible logic with explicit ancilla and uncomputation, adiabatic or
  energy-recovery logic with measured power-clock overhead, and conventional
  irreversible logic at matched process, throughput, error, and layout;
- algorithmic checkpointing, recomputation, approximate computing, error
  correction, retries, guardbands, calibration, redundancy, and abstention under
  the same accepted-output rule;
- matched digital, analog, in-memory, optical, and neuromorphic implementations
  with converters, programming, drift control, communication, thermal control,
  and host work included;
- facility metering under ISO/IEC 30134-2 boundaries, plus explicit allocation
  of shared storage, networking, cooling, power conversion, and idle capacity;
  and
- ISO 14040/14044 lifecycle assessment with a common functional unit, yield,
  utilization, lifetime, replacement, geography, electricity mix, uncertainty,
  and sensitivity analysis.

No result receives credit for comparing a theoretical minimum in one arm with a
metered total in another, moving work beyond the measurement boundary, lowering
quality, extending latency without charging capacity, or ignoring replacement.

## Audit-local claims

Statuses mean: `established` is supported within the cited model or measured
boundary; `plausible` is a transfer not yet demonstrated at the target system
boundary; `disputed` marks a common inference contradicted or left unjustified
by the scoped evidence. These claims do not enter the project-wide evidence
ledger automatically.

| ID | Status | Claim, rationale, and boundary | Affected project text | Primary or authoritative support |
| --- | --- | --- | --- | --- |
| `THERMO-001` | established | Logical information and physical entropy require an explicit physical encoding and coarse graining. Logical labels alone do not determine heat. | [thesis](../../concept/00-thesis-and-principles.md), [energy](../../concept/80-energy-model.md) | [Landauer 1961](https://doi.org/10.1147/rd.53.0183); [Bennett 1982](https://doi.org/10.1007/BF02084158) |
| `THERMO-002` | established | Resetting a uniformly distributed, degenerate binary memory in an isothermal cyclic process has ideal expected work at least $k_BT\ln2$. Temperature, distribution, Hamiltonian, cycle closure, and error are part of the statement. | [energy](../../concept/80-energy-model.md), [notation](../../math/notation.md) | [Landauer 1961](https://doi.org/10.1147/rd.53.0183); [Reeb and Wolf 2014](https://doi.org/10.1088/1367-2630/16/10/103011) |
| `THERMO-003` | established | For a nonuniform degenerate logical state, the quasistatic erasure term is $k_BTH(X)$, not necessarily $k_BT\ln2$. State preparation and prior information therefore change the bound. | [energy](../../concept/80-energy-model.md), [efficiency model](../../math/efficiency-model.md) | [Landauer 1961](https://doi.org/10.1147/rd.53.0183); [Shannon 1948](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x) |
| `THERMO-004` | established | For nondegenerate or nonequilibrium memories, minimum work is governed by nonequilibrium free-energy change; a logical entropy count alone is incomplete. | [energy](../../concept/80-energy-model.md), [efficiency model](../../math/efficiency-model.md) | [Deffner and Jarzynski 2013](https://doi.org/10.1103/PhysRevX.3.041003); [Reeb and Wolf 2014](https://doi.org/10.1088/1367-2630/16/10/103011) |
| `THERMO-005` | established | Permitting a symmetric binary reset error $\epsilon$ reduces the information erased to $\ln2-h(\epsilon)$. Useful-system accounting must charge the consequences of those errors. | [hardening](../../concept/60-hardening-and-factual-memory.md), [energy](../../concept/80-energy-model.md) | [Diana, Bagci, and Esposito 2013](https://doi.org/10.1103/PhysRevE.87.012111); [Wimsatt et al. 2021](https://doi.org/10.1007/s10955-021-02733-1) |
| `THERMO-006` | established | Correlations and usable side information can reduce erasure work; destroying the correlation or resetting the helper transfers rather than deletes the accounting. | [memory](../../concept/40-memory-and-consolidation.md), [energy](../../concept/80-energy-model.md) | [del Rio et al. 2011](https://doi.org/10.1038/nature10123); [Deffner and Jarzynski 2013](https://doi.org/10.1103/PhysRevX.3.041003) |
| `THERMO-007` | established | Individual stochastic realizations may dissipate less than $k_BT\ln2$, or even show negative entropy production, without violating ensemble fluctuation relations. | [energy](../../concept/80-energy-model.md), [roadmap](../../concept/90-research-roadmap.md) | [Jarzynski 1997](https://doi.org/10.1103/PhysRevLett.78.2690); [Crooks 1999](https://doi.org/10.1103/PhysRevE.60.2721); [Seifert 2005](https://doi.org/10.1103/PhysRevLett.95.040602) |
| `THERMO-008` | established | A finite heat reservoir produces corrections to the infinite-bath Landauer limit; the correction depends on reservoir dimension and state. | [energy](../../concept/80-energy-model.md) | [Reeb and Wolf 2014](https://doi.org/10.1088/1367-2630/16/10/103011) |
| `THERMO-009` | established | A colloidal one-bit memory approached the Landauer limit for increasingly slow reset protocols, supporting the bound in that physical platform rather than a universal device energy constant. | [energy](../../concept/80-energy-model.md), [roadmap](../../concept/90-research-roadmap.md) | [Bérut et al. 2012](https://doi.org/10.1038/nature10872) |
| `THERMO-010` | established | A feedback-trap implementation measured the finite-time approach to the Landauer bound and exposed protocol-dependent work distributions. | [energy](../../concept/80-energy-model.md), [roadmap](../../concept/90-research-roadmap.md) | [Jun, Gavrilov, and Bechhoefer 2014](https://doi.org/10.1103/PhysRevLett.113.190601) |
| `THERMO-011` | established | Nanomagnetic bit erasure has experimentally approached the Landauer scale under a deliberately controlled protocol; this does not include a complete computing system. | [hardening](../../concept/60-hardening-and-factual-memory.md), [energy](../../concept/80-energy-model.md) | [Hong et al. 2016](https://doi.org/10.1126/sciadv.1501492) |
| `THERMO-012` | established | A molecular nanomagnet experiment measured information erasure close to the Landauer limit at cryogenic operation (1 K), with platform-specific field control and refrigeration boundaries. | [hardening](../../concept/60-hardening-and-factual-memory.md), [energy](../../concept/80-energy-model.md) | [Gaudenzi et al. 2018](https://doi.org/10.1038/s41567-018-0070-7) |
| `THERMO-013` | established | Universal computation can be expressed with logically reversible operations, so logical irreversibility is not required at every intermediate step. | [architecture](../../concept/01-working-architecture.md), [energy](../../concept/80-energy-model.md) | [Bennett 1973](https://doi.org/10.1147/rd.176.0525); [Fredkin and Toffoli 1982](https://doi.org/10.1007/BF01857727) |
| `THERMO-014` | established | Reversible computation generally retains history or ancillae and later uncomputes them, producing time, space, communication, and control tradeoffs rather than free computation. | [memory](../../concept/40-memory-and-consolidation.md), [system synthesis](../../concept/70-system-synthesis.md) | [Bennett 1973](https://doi.org/10.1147/rd.176.0525); [Bennett 1989](https://doi.org/10.1137/0218053) |
| `THERMO-015` | established | Logical reversibility is necessary for avoiding compulsory logical erasure but is not sufficient for thermodynamic reversibility of a physical implementation. | [architecture](../../concept/01-working-architecture.md), [energy](../../concept/80-energy-model.md) | [Bennett 1982](https://doi.org/10.1007/BF02084158); [Wolpert, Kolchinsky, and Owen 2019](https://doi.org/10.1038/s41467-019-09542-x) |
| `THERMO-016` | established | Idealized adiabatic RC charging can reduce resistive loss roughly as $RC/\tau$ when the transition is slow relative to the circuit time constant. The coefficient and validity depend on waveform and circuit. | [energy](../../concept/80-energy-model.md), [system synthesis](../../concept/70-system-synthesis.md) | [Athas et al. 1994](https://doi.org/10.1109/92.335009) |
| `THERMO-017` | established | Slowing adiabatic switching does not remove leakage, power-clock generation, synchronization, control, interconnect, and retention costs; a finite optimum may result. | [energy](../../concept/80-energy-model.md), [roadmap](../../concept/90-research-roadmap.md) | [Athas et al. 1994](https://doi.org/10.1109/92.335009); [Kim and Chae 2005](https://doi.org/10.1145/1062261.1062332) |
| `THERMO-018` | established | A fabricated eight-bit reversible energy-recovery microprocessor demonstrated lower dissipation in a measured operating range, establishing feasibility but not zero-energy or workload-general superiority. | [architecture](../../concept/01-working-architecture.md), [energy](../../concept/80-energy-model.md) | [Kim and Chae 2005](https://doi.org/10.1145/1062261.1062332) |
| `THERMO-019` | established | Finite-time reset incurs protocol- and dynamics-dependent excess work above its quasistatic limit; duration must accompany energy. | [energy](../../concept/80-energy-model.md), [efficiency model](../../math/efficiency-model.md) | [Aurell et al. 2011](https://doi.org/10.1103/PhysRevLett.106.250601); [Proesmans, Ehrich, and Bechhoefer 2020](https://doi.org/10.1103/PhysRevLett.125.100602) |
| `THERMO-020` | established | Finite-time and finite-error effects are separate axes: a protocol can trade speed, work, and reliability, and the appropriate bound depends on control restrictions. | [hardening](../../concept/60-hardening-and-factual-memory.md), [energy](../../concept/80-energy-model.md) | [Diana, Bagci, and Esposito 2013](https://doi.org/10.1103/PhysRevE.87.012111); [Proesmans, Ehrich, and Bechhoefer 2020](https://doi.org/10.1103/PhysRevE.102.032105); [Wimsatt et al. 2021](https://doi.org/10.1007/s10955-021-02733-1) |
| `THERMO-021` | established | Finite-time quantum erasure also exhibits excess cost and work fluctuations; classical quasistatic formulas cannot simply be relabeled as quantum-system bounds. | [energy](../../concept/80-energy-model.md), [roadmap](../../concept/90-research-roadmap.md) | [Miller et al. 2020](https://doi.org/10.1103/PhysRevLett.125.160602); [Zhen et al. 2021](https://doi.org/10.1103/PhysRevLett.127.190602); [Rolandi and Perarnau-Llobet 2023](https://doi.org/10.22331/q-2023-11-03-1161) |
| `THERMO-022` | established | Passive retention of a bistable memory is an energy-barrier, temperature, time, and error-probability problem; write ease and retention are coupled by the device physics and protocol. | [memory](../../concept/40-memory-and-consolidation.md), [hardening](../../concept/60-hardening-and-factual-memory.md) | [Kramers 1940](https://doi.org/10.1016/S0031-8914%2840%2990098-2); [Brown 1963](https://doi.org/10.1103/PhysRev.130.1677) |
| `THERMO-023` | established | Lower switching dissipation can increase error probability or duration; reliability claims require a joint energy--error--speed frontier rather than energy alone. | [hardening](../../concept/60-hardening-and-factual-memory.md), [energy](../../concept/80-energy-model.md) | [Fashami, Atulasimha, and Bandyopadhyay 2013](https://doi.org/10.1038/srep03204); [Wimsatt et al. 2021](https://doi.org/10.1007/s10955-021-02733-1) |
| `THERMO-024` | established | Johnson--Nyquist noise and the fluctuation--dissipation relation impose physical noise on resistive and dissipative analog elements. Precision requires bandwidth, impedance, temperature, signal-energy, and estimator qualifiers. | [sensing](../../concept/24-operator-qualified-sensing.md), [energy](../../concept/80-energy-model.md) | [Johnson 1928](https://doi.org/10.1103/PhysRev.32.97); [Nyquist 1928](https://doi.org/10.1103/PhysRev.32.110); [Callen and Welton 1951](https://doi.org/10.1103/PhysRev.83.34) |
| `THERMO-025` | established | Continuous-valued physical computation does not provide free infinite precision; dynamic range, thermal and device noise, drift, calibration, conversion, and error tolerance determine useful bits. | [sparse predictive compute](../../concept/30-sparse-predictive-compute.md), [energy](../../concept/80-energy-model.md) | [Sarpeshkar 1998](https://doi.org/10.1162/089976698300017052); [Diamantini, Gammaitoni, and Trugenberger 2016](https://doi.org/10.1103/PhysRevE.94.012139) |
| `THERMO-026` | plausible | Noise or stochastic dynamics may reduce energy for selected probabilistic, search, or sampling workloads, but advantage over a matched deterministic or pseudorandom null is workload-, accuracy-, latency-, and hardware-dependent. | [architecture](../../concept/01-working-architecture.md), [roadmap](../../concept/90-research-roadmap.md) | [Fashami, Atulasimha, and Bandyopadhyay 2013](https://doi.org/10.1038/srep03204); [Goldt and Seifert 2017](https://doi.org/10.1103/PhysRevLett.118.010601) |
| `THERMO-027` | established | Shannon's $E_b/N_0\ge\ln2$ asymptote applies to reliable communication over an additive white Gaussian noise channel at vanishing spectral efficiency; it is not a per-gate, per-MAC, or memory-write lower bound. | [sensorimotor grounding](../../concept/20-sensorimotor-grounding.md), [energy](../../concept/80-energy-model.md) | [Shannon 1948](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x) |
| `THERMO-028` | established | Jarzynski's equality links an exponential average of nonequilibrium work to equilibrium free-energy difference for a specified initially canonical protocol ensemble. It is not a claim that every realization costs $\Delta F$. | [energy](../../concept/80-energy-model.md), [roadmap](../../concept/90-research-roadmap.md) | [Jarzynski 1997](https://doi.org/10.1103/PhysRevLett.78.2690) |
| `THERMO-029` | established | Crooks' fluctuation theorem relates forward and reverse work distributions under microscopic-reversibility assumptions and identifies $\Delta F$ at their crossing. Reverse-protocol construction is part of the test. | [energy](../../concept/80-energy-model.md), [roadmap](../../concept/90-research-roadmap.md) | [Crooks 1999](https://doi.org/10.1103/PhysRevE.60.2721) |
| `THERMO-030` | established | Integral fluctuation theorems permit negative stochastic entropy production on individual trajectories while constraining the exponential ensemble average. | [energy](../../concept/80-energy-model.md), [efficiency model](../../math/efficiency-model.md) | [Seifert 2005](https://doi.org/10.1103/PhysRevLett.95.040602) |
| `THERMO-031` | established | Feedback can increase extractable work by an information term under the Sagawa--Ueda model; the measurement record is a physical resource whose acquisition, retention, control, and reset remain outside a subsystem-only balance. | [sensing](../../concept/24-operator-qualified-sensing.md), [system synthesis](../../concept/70-system-synthesis.md) | [Sagawa and Ueda 2010](https://doi.org/10.1103/PhysRevLett.104.090602); [Sagawa and Ueda 2012](https://doi.org/10.1103/PhysRevE.85.021104) |
| `THERMO-032` | established | A feedback-controlled Brownian particle experimentally converted acquired information into free energy, validating a scoped information-engine relation rather than net power generation without a controller. | [sensing](../../concept/24-operator-qualified-sensing.md), [energy](../../concept/80-energy-model.md) | [Toyabe et al. 2010](https://doi.org/10.1038/nphys1821) |
| `THERMO-033` | established | A single-electron Szilard engine experimentally linked mutual information and extracted work in a controlled mesoscopic device. The result is platform- and cycle-specific. | [sensing](../../concept/24-operator-qualified-sensing.md), [energy](../../concept/80-energy-model.md) | [Koski et al. 2014](https://doi.org/10.1073/pnas.1406966111) |
| `THERMO-034` | established | In an autonomous electronic Maxwell-demon experiment, the controlled system cooled while the demon dissipated heat; the joint boundary restored the thermodynamic balance. | [system synthesis](../../concept/70-system-synthesis.md), [energy](../../concept/80-energy-model.md) | [Koski et al. 2015](https://doi.org/10.1103/PhysRevLett.115.260602) |
| `THERMO-035` | established | In bipartite stochastic systems, continuous information flow and entropy production can be assigned to coupled subsystems only under an explicit joint process and transition structure. | [system synthesis](../../concept/70-system-synthesis.md), [efficiency model](../../math/efficiency-model.md) | [Horowitz and Esposito 2014](https://doi.org/10.1103/PhysRevX.4.031015) |
| `THERMO-036` | established | Biochemical sensing models exhibit resource-dependent precision bounds; copy number, integration time, receptor statistics, and energy supply cannot be collapsed into one universal “information cost.” | [sensorimotor grounding](../../concept/20-sensorimotor-grounding.md), [operator-qualified sensing](../../concept/24-operator-qualified-sensing.md) | [Govern and ten Wolde 2014](https://doi.org/10.1073/pnas.1411524111); [Govern and ten Wolde 2014](https://doi.org/10.1103/PhysRevLett.113.258102) |
| `THERMO-037` | established | A model of sensory adaptation yields an energy--speed--accuracy tradeoff: reducing dissipation changes achievable response speed and precision under that network architecture. | [sensorimotor grounding](../../concept/20-sensorimotor-grounding.md), [energy](../../concept/80-energy-model.md) | [Lan et al. 2012](https://doi.org/10.1038/nphys2276) |
| `THERMO-038` | plausible | Retaining predictive rather than merely historical information may reduce useless physical memory updates in an AI system, but the proposed transfer needs a measured device-to-task boundary and a matched predictive-compression null. | [sparse predictive compute](../../concept/30-sparse-predictive-compute.md), [memory](../../concept/40-memory-and-consolidation.md) | [Still et al. 2012](https://doi.org/10.1103/PhysRevLett.109.120604) |
| `THERMO-039` | plausible | Stochastic-thermodynamic learning efficiency can guide toy adaptive systems, but present bounds do not establish a joule lower bound or advantage for gradient training on digital accelerators. | [grokking and pruning](../../concept/50-grokking-and-pruning.md), [energy](../../concept/80-energy-model.md) | [Goldt and Seifert 2017](https://doi.org/10.1103/PhysRevLett.118.010601); [Goldt and Seifert 2017](https://doi.org/10.1088/1367-2630/aa89ff) |
| `THERMO-040` | established | The original steady-state thermodynamic uncertainty relation bounds relative current variance by entropy production for continuous-time Markov processes under its stated assumptions. | [energy](../../concept/80-energy-model.md), [efficiency model](../../math/efficiency-model.md) | [Barato and Seifert 2015](https://doi.org/10.1103/PhysRevLett.114.158101); [Gingrich et al. 2016](https://doi.org/10.1103/PhysRevLett.116.120601) |
| `THERMO-041` | established | A thermodynamic uncertainty relation is not a model-free law for arbitrary estimators, nonstationary training runs, deterministic computers, or quantum devices; observable and dynamical assumptions must be checked. | [energy](../../concept/80-energy-model.md), [roadmap](../../concept/90-research-roadmap.md) | [Horowitz and Gingrich 2017](https://doi.org/10.1103/PhysRevE.96.020103); [Hasegawa and Van Vu 2019](https://doi.org/10.1103/PhysRevLett.123.110602); [Timpanaro et al. 2019](https://doi.org/10.1103/PhysRevLett.123.090604) |
| `THERMO-042` | established | Finite-time and arbitrary-initial-state uncertainty relations exist, but their right-hand sides and validity conditions differ from the original long-time steady-state expression. | [energy](../../concept/80-energy-model.md), [efficiency model](../../math/efficiency-model.md) | [Horowitz and Gingrich 2017](https://doi.org/10.1103/PhysRevE.96.020103); [Liu, Gong, and Ueda 2020](https://doi.org/10.1103/PhysRevLett.125.140602); [Monnai 2023](https://doi.org/10.1103/PhysRevE.108.024119) |
| `THERMO-043` | established | Decomposing a computation into independently operated modules can add thermodynamic cost because correlations crossing module boundaries are discarded or inaccessible. | [modularity](../../concept/10-neurogenesis-and-routing.md), [system synthesis](../../concept/70-system-synthesis.md) | [Boyd, Mandal, and Crutchfield 2018](https://doi.org/10.1103/PhysRevX.8.031036); [Wolpert, Kolchinsky, and Owen 2019](https://doi.org/10.1038/s41467-019-09542-x) |
| `THERMO-044` | established | A physical process optimized for one input distribution can dissipate extra work under a mismatched distribution; the cost depends on the actual implementation and priors, not the abstract map alone. | [adaptive routing](../../concept/10-neurogenesis-and-routing.md), [energy](../../concept/80-energy-model.md) | [Kolchinsky and Wolpert 2017](https://doi.org/10.1088/1742-5468/aa7ee1); [Kolchinsky and Wolpert 2021](https://doi.org/10.1103/PhysRevE.104.054107) |
| `THERMO-045` | established | Circuit topology, gate decomposition, timing, and accessible correlations can change minimum thermodynamic cost even for computations with the same input--output function. | [architecture](../../concept/01-working-architecture.md), [system synthesis](../../concept/70-system-synthesis.md) | [Wolpert and Kolchinsky 2020](https://doi.org/10.1088/1367-2630/ab82b8); [Kolchinsky and Wolpert 2020](https://doi.org/10.1103/PhysRevResearch.2.033312) |
| `THERMO-046` | established | On measured digital accelerators, memory access and data movement can consume substantial or dominant energy relative to arithmetic; locality and reuse therefore matter at the circuit/workload boundary. | [sparse predictive compute](../../concept/30-sparse-predictive-compute.md), [energy](../../concept/80-energy-model.md) | [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323); [Chen et al. 2017](https://doi.org/10.1109/JSSC.2016.2616357); [Jouppi et al. 2017](https://doi.org/10.1145/3079856.3080246) |
| `THERMO-047` | plausible | A hierarchy-aware energy model can predict which sparse or modular routes save task energy, but component energy tables cannot be transferred unchanged across process, voltage, precision, hierarchy, workload, and utilization. | [sparse predictive compute](../../concept/30-sparse-predictive-compute.md), [energy](../../concept/80-energy-model.md) | [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323); [Chen et al. 2017](https://doi.org/10.1109/JSSC.2016.2616357); [Sze et al. 2017](https://doi.org/10.1109/JPROC.2017.2761740) |
| `THERMO-048` | established | The ordinary $CV^2$ switching model describes circuit charging loss, not Landauer erasure. Dynamic energy also depends on activity, voltage, capacitance, frequency, short-circuit current, leakage, and implementation. | [energy](../../concept/80-energy-model.md), [system synthesis](../../concept/70-system-synthesis.md) | [Athas et al. 1994](https://doi.org/10.1109/92.335009); [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323) |
| `THERMO-049` | established | ISO/IEC 30134-2 defines PUE as facility energy divided by IT-equipment energy over a declared data-center boundary and annual measurement period. PUE is neither task efficiency nor carbon intensity. | [energy](../../concept/80-energy-model.md), [measurement contract](../../math/measurement-contract.md) | [ISO/IEC 30134-2:2026](https://www.iso.org/standard/30134-2) |
| `THERMO-050` | established | Semiconductor fabrication and packaging have material- and energy-intensive burdens; use-phase efficiency rankings can change when yield, utilization, lifetime, replacement, and functional unit are included. | [energy](../../concept/80-energy-model.md), [roadmap](../../concept/90-research-roadmap.md) | [Williams, Ayres, and Heller 2002](https://doi.org/10.1021/es025643o); [Krishnan et al. 2008](https://doi.org/10.1021/es071174k); [Boyd et al. 2010](https://doi.org/10.1021/es902388b) |
| `THERMO-051` | plausible | Specialized low-operational-energy hardware is lifecycle-superior only if saved use energy and accepted service outweigh added fabrication, low utilization, shortened support life, maintenance, and replacement under uncertainty. | [energy](../../concept/80-energy-model.md), [research roadmap](../../concept/90-research-roadmap.md) | [Pirson and Bol 2021](https://doi.org/10.1016/j.jclepro.2021.128966); [ISO 14040:2006](https://www.iso.org/standard/37456.html); [ISO 14044:2006](https://www.iso.org/standard/38498.html) |
| `THERMO-052` | disputed | Distance above $k_BT\ln2$ is not, by itself, an actionable ranking or forecast for AI-system efficiency. The comparison crosses logical-erasure, device, circuit, workload, facility, and lifecycle boundaries and omits quality, time, and error. | [thesis](../../concept/00-thesis-and-principles.md), [energy](../../concept/80-energy-model.md) | [Wimsatt et al. 2021](https://doi.org/10.1007/s10955-021-02733-1); [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323); [ISO/IEC 30134-2:2026](https://www.iso.org/standard/30134-2) |

### Claim-status count

- `established`: 46
- `plausible`: 5
- `disputed`: 1
- **total:** 52

## Negative results and recurrent overclaims

These are not stylistic cautions. Each one changes the scientific claim or the
ranking of systems.

1. **Assigning $k_BT\ln2$ to every operation.** Landauer cost attaches to a
   specified reduction of physical-state information, not to every gate, MAC,
   FLOP, token, or parameter access.
2. **Treating a bit as necessarily uniform.** A known or biased bit has less
   Shannon entropy; state preparation and correlation cannot be hidden.
3. **Calling Landauer a power bound.** The ideal expression is work [J] per
   transformation. Power [W] additionally requires a protocol duration and
   throughput model.
4. **Declaring a violation from one low-work trajectory.** Fluctuation theorems
   constrain ensembles; sub-bound individual realizations are expected.
5. **“Beating Landauer” by accepting errors.** Finite error changes the logical
   transformation. Downstream correction, rejection, risk, and lost service
   remain in the task ledger.
6. **Equating logical and thermodynamic reversibility.** A reversible truth
   table does not guarantee quasistatic physical evolution or recovery of all
   supplied energy.
7. **Calling adiabatic switching lossless.** Resistive loss can fall with slower
   ramps while leakage, clock, synchronization, control, and throughput costs
   remain.
8. **Omitting the power clock.** Energy-recovery logic requires a physical
   waveform source, distribution network, phase discipline, and often charge
   recycling across imperfect loads.
9. **Hiding garbage and ancillae.** A reversible kernel is not cyclic until
   histories and temporary states are returned, retained, exported, or reset.
10. **Treating latency as free.** Slower operation consumes capacity, can
    increase leakage and retention work, and may require more parallel hardware
    to maintain throughput.
11. **Drawing an information engine around the controlled subsystem only.**
    Measurement, controller memory, feedback actuation, and reset determine the
    joint balance.
12. **Using a thermodynamic uncertainty relation without checking its model.**
    Steady-state Markov-current results do not automatically bind a transient,
    deterministic, non-Markovian, or quantum computation.
13. **Promoting a biochemical sensing theorem to an AI lower bound.** Copy
    number and receptor-network bounds are powerful scoped models, not measured
    limits on GPUs or neural networks.
14. **Treating analog values as free real numbers.** Useful resolution requires
    signal energy, dynamic range, bandwidth, calibration, and an error model.
15. **Ignoring retention.** A low-energy write is not useful if stored state is
    lost during the required horizon or must be refreshed frequently.
16. **Quoting component picojoules as constants.** Process, voltage, precision,
    distance, topology, utilization, and workload determine actual access and
    movement energy.
17. **Excluding interconnect and conversion.** Analog, optical, in-memory, and
    chiplet paths can move work into DACs, ADCs, serializers, drivers, links,
    calibration, thermal control, or hosts.
18. **Using PUE as task efficiency or carbon.** PUE is a facility/IT energy
    ratio. It contains neither accepted outcomes nor electricity carbon
    intensity.
19. **Reporting operational energy as lifecycle efficiency.** Fabrication,
    yield, packaging, maintenance, lifetime, utilization, and replacement can
    reverse a hardware ranking.
20. **Comparing unlike acceptance rules.** Less energy obtained through lower
    accuracy, unreported abstention, longer latency, more risk, or narrower
    support is not an efficiency gain until evaluated on one service contract.

## Equal-budget decisive experiments

Each experiment uses the same accepted-output rule and charges all work inside
the stated boundary. “Equal budget” means the arms receive the same training or
design data, wall-clock opportunity, silicon/process access, quality threshold,
latency or throughput requirement, reliability horizon, and accounting boundary
unless the varied quantity is the preregistered independent variable.

### `E-THERMO-01` — Finite-time, finite-error erasure surface

- **Question:** does a proposed reset protocol beat the best ordinary protocol
  after duration and final-state error are matched?
- **Arms:** proposed protocol; optimal-control or best measured conventional
  protocol on the same bistable device; quasistatic reference.
- **Measure:** full work distribution [J], heat where observable [J], duration
  [s], reset error, initial distribution, bath temperature [K], and confidence
  intervals over independent cycles.
- **Kill rule:** retire the claim if any apparent advantage vanishes after
  matching $\epsilon$ and $\tau$, or if the result is only an individual
  trajectory rather than an ensemble difference.

### `E-THERMO-02` — Reversible kernel with closed history

- **Question:** does logical reversibility lower complete circuit energy for a
  useful computation?
- **Arms:** reversible circuit including ancilla preparation, routing,
  uncomputation, output copy, and reset; best irreversible implementation;
  recomputation/checkpoint variant.
- **Measure:** terminal joules per accepted result, latency, area, throughput,
  leakage, error/retry rate, history bits retained, I/O, and clock/control work.
- **Kill rule:** retire if the advantage requires excluding history, output
  preservation, final reset, or the throughput-equivalent parallel hardware.

### `E-THERMO-03` — Adiabatic crossover

- **Question:** over which frequency, voltage, temperature, and utilization
  regimes does energy recovery beat conventional CMOS?
- **Arms:** laid-out adiabatic/energy-recovery circuit with its power clock;
  matched standard-cell CMOS; clock-gated and voltage-scaled CMOS nulls.
- **Measure:** supply and clock joules, leakage, recovered energy, useful
  transitions, area, timing yield, error, and task throughput across a sweep.
- **Kill rule:** retire a regime-general claim if savings exist only at a
  throughput that requires enough replication to erase the system-level gain.

### `E-THERMO-04` — Retention--write--error frontier

- **Question:** does a proposed physical memory reduce lifecycle energy at the
  required retention and error level?
- **Arms:** proposed memory; SRAM/DRAM/nonvolatile baselines appropriate to the
  horizon; recomputation instead of storage.
- **Measure:** write/read/refresh/correction energy, retention distribution over
  temperature and time, endurance, latency, capacity, standby, and accepted
  retrievals before retirement.
- **Kill rule:** retire if lower write energy is offset by refresh, correction,
  lost outputs, reduced endurance, or replacement within the target mission.

### `E-THERMO-05` — Analog precision and noise closure

- **Question:** does an analog physical path deliver lower energy at matched
  useful precision and robustness?
- **Arms:** analog path with converters and calibration; digital mixed-precision
  baseline; digitally simulated low-precision/stochastic null.
- **Measure:** wall-plug joules per accepted inference, effective resolution,
  noise spectrum, drift, calibration/retraining, latency, throughput, quality
  under shift, and failure tails.
- **Kill rule:** retire if the advantage disappears after conversion,
  calibration, communication, drift correction, and rejected outputs are added.

### `E-THERMO-06` — Information-engine boundary closure

- **Question:** is apparent work extraction preserved when sensing, memory,
  control, actuation, and reset are inside the boundary?
- **Arms:** feedback engine; open-loop protocol with the same actuator budget;
  predictive controller with the same sensor record.
- **Measure:** joint heat and work [J], mutual information [nat] with estimator
  uncertainty, controller energy, memory preparation/reset, cycle time, and net
  extracted work.
- **Kill rule:** retire a net-gain claim if it exists only for the controlled
  subsystem or depends on uncharged precomputed measurements.

### `E-THERMO-07` — Uncertainty-relation applicability test

- **Question:** does a claimed precision--dissipation bound apply to the actual
  process and observable?
- **Arms:** empirical process; fitted stationary Markov model; nonstationary,
  hidden-state, and non-Markov alternatives with matched predictive fit.
- **Measure:** current definition, variance, entropy-production estimator,
  stationarity tests, waiting-time and memory diagnostics, finite-time bound,
  and held-out coverage.
- **Kill rule:** reject the bound as explanatory if assumptions fail, entropy
  production is not identifiable, or a better-fitting allowed model changes the
  conclusion.

### `E-THERMO-08` — Modularity and mismatch cost

- **Question:** do proposed modules save complete energy when their cross-module
  correlations and input-distribution shifts are charged?
- **Arms:** modular implementation; joint implementation; modular implementation
  with shared sufficient statistics; each calibrated to training and shifted
  priors.
- **Measure:** task energy, intermodule traffic, discarded mutual information,
  calibration/reset work, accuracy, latency, and mismatch loss across declared
  distributions.
- **Kill rule:** retire if modularity savings vanish against the best joint or
  shared-statistic baseline, or if the result assumes the deployment prior.

### `E-THERMO-09` — Data-movement and hierarchy audit

- **Question:** does sparse/conditional computation reduce wall-plug energy once
  indices, routing, imbalance, cache misses, and memory traffic are included?
- **Arms:** proposed routing; dense optimized baseline; static structured
  sparsity; compiler/cache/tiling null with the same model quality.
- **Measure:** joules and bytes by register, SRAM/cache, DRAM, interconnect, host,
  and storage; utilization, latency tails, throughput, routing overhead, and
  accepted quality.
- **Kill rule:** retire if saved arithmetic is offset by movement, metadata,
  synchronization, fragmentation, or idle capacity.

### `E-THERMO-10` — Facility allocation closure

- **Question:** does a workload-level improvement reduce facility energy rather
  than merely IT-component energy?
- **Arms:** proposed and conventional systems in randomized matched time blocks
  or calibrated side-by-side infrastructure at equal service load.
- **Measure:** IT and facility meters, cooling and power-conversion energy,
  ambient conditions, storage/network allocation, idle baseline, accepted
  requests, latency, and uncertainty over at least a representative season.
- **Kill rule:** retire a facility claim if it is inferred only from TDP, peak
  throughput, or an unmeasured generic PUE multiplier.

### `E-THERMO-11` — Specialization lifecycle crossover

- **Question:** when does embodied burden of specialized hardware amortize
  against operational savings?
- **Arms:** new specialized device; existing general-purpose device; software
  optimization on already deployed hardware; shared-device service.
- **Measure:** cradle-to-grave inventory, die and package yield, allocated fab
  energy, utilization, service life, maintenance, replacement, operational
  energy, accepted lifetime outcomes, and uncertainty/sensitivity distributions.
- **Kill rule:** retire lifecycle superiority if it depends on an unsupported
  utilization, lifetime, yield, electricity mix, or displaced-hardware credit.

### `E-THERMO-12` — Full physical-efficiency stack

- **Question:** does the proposed system improve accepted service across all six
  boundaries rather than one selected denominator?
- **Arms:** proposed system; strongest ordinary stack; ablations for algorithm,
  device, hierarchy, facility, and replacement policy.
- **Measure:** a preregistered vector
  $(Q,L,R,E_{\mathrm{device}},E_{\mathrm{circuit}},e_{\mathrm{IT}},
  e_{\mathrm{facility}},e_{\mathrm{life}})$ containing quality, latency, risk,
  and boundary-specific energy with intervals; no scalarization after results.
- **Kill rule:** retire the broad claim if no Pareto improvement survives under
  plausible allocation and uncertainty choices, even when a component metric
  improves.

## Deduplication and disposition

### Existing principle bundles

| Imported result | Existing owner | Deduplication result |
| --- | --- | --- |
| allocate physical activity where it reduces accepted-task error per joule | [`P-001` selective allocation](../principle-registry.md#p-001--selective-allocation) | energy is another scarce resource and constraint; no new allocation principle |
| compute provisionally, retain history, then uncompute or commit | [`P-003` temporary trace before commitment](../principle-registry.md#p-003--temporary-trace-before-commitment) | reversible history sharpens the cost model but does not change the bundle |
| closed-loop energy recovery, thermal regulation, and operating-point control | [`P-006` homeostatic negative feedback](../principle-registry.md#p-006--homeostatic-negative-feedback) | ordinary feedback and control nulls own the mechanism |
| spend sensing or updates where uncertainty and predictive error warrant them | [`P-007` prediction-error allocation](../principle-registry.md#p-007--prediction-error-allocation) | information thermodynamics supplies scoped cost tests, not a new routing rule |
| contain physical interactions while preserving useful correlations | [`P-008` compartmentalized interaction](../principle-registry.md#p-008--compartmentalized-interaction) | modularity dissipation is a failure mode and evaluation term |
| distinguish useful execution from reset, refresh, calibration, correction, cooling, and repair | [`P-009` maintenance plane](../principle-registry.md#p-009--maintenance-plane) | the device/circuit/facility ledger specifies maintenance cost |
| move recurring computation into topology, locality, memory, or substrate | [`P-010` structural offloading and co-design](../principle-registry.md#p-010--structural-offloading-and-co-design) | physical compilation remains a lifecycle comparison, not automatic savings |
| choose memory medium and update policy from required information lifetime | [`P-012` memory matched to information lifetime](../principle-registry.md#p-012--memory-matched-to-information-lifetime) | retention--write--error frontier makes the existing principle testable |
| coordinate through a persistent external physical or informational record | [`P-013` externalized shared state](../principle-registry.md#p-013--externalized-shared-state) | measurement records and controller memories must be charged and reset |

### Candidate and fixture overlap

- [Candidate 001](../../experiments/candidates/001-adaptive-topology.md)
  already owns graph adaptation; `E-THERMO-09` requires it to pay routing,
  movement, imbalance, and idle capacity.
- [Candidate 005](../../experiments/candidates/005-severity-ordered-containment.md)
  already owns recovery staging; finite-error operation must include correction,
  rejection, retry, and residual harm.
- [Candidate 006](../../experiments/candidates/006-reversible-physical-skill.md)
  is the direct owner of physical compilation. `E-THERMO-02`, `03`, `05`, and
  `11` prevent a device-only or use-phase-only win.
- [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md)
  owns versioned evidence boundaries; thermodynamic applicability conditions
  belong in that envelope.
- [Candidate 010](../../experiments/candidates/010-reset-coupled-staged-verification.md)
  already owns reversible provisional execution and final commitment; history,
  verification, uncompute, and reset must all close.
- [Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md)
  owns latency-qualified action; slower low-energy protocols cannot silently
  weaken the service or authority contract.
- [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md)
  owns measurement support, uncertainty, and dependencies; heat, work,
  information, PUE, and lifecycle inventories need those same fields.
- [Candidate 017](../../experiments/candidates/017-contract-preserving-semantic-compaction.md)
  and [Candidate 018](../../experiments/candidates/018-value-reconstructability-aware-tiering.md)
  own history reduction and placement; erasure, recomputation, retention, and
  embodied hardware extend their cost vectors without creating a new candidate.
- [Fixture F-006](../../experiments/fixtures/006-representative-adaptive-performance.md)
  already requires representative workload, adaptation, shift, and cumulative
  effort; add the six-boundary ledger when an energy claim is tested.
- [Fixture F-007](../../experiments/fixtures/007-operator-qualified-optical-inference.md)
  already prevents physical transforms from hiding conversion, calibration,
  control, and task-support failure.
- [Fixture F-008](../../experiments/fixtures/008-mission-profile-qualified-device-reliability.md)
  is the closest durable owner for retention, error, temperature, wear,
  correction, lifecycle, and accepted-service accounting.
- [Fixture F-009](../../experiments/fixtures/009-operator-qualified-active-acoustic-inference.md)
  already charges active sensing, actuation, environment, operator support, and
  full-system energy.

### Residual test

No mechanism survives as a new `P-` bundle or candidate. The exact residual is
a **boundary-qualified physical-computation evaluation contract**:

> A physical-efficiency result is admissible only when it reports a common
> accepted service, separates logical lower bound, device, circuit, workload,
> facility, and lifecycle quantities, and jointly exposes time, error,
> uncertainty, retained state, controller work, and replacement assumptions.

This is a measurement and falsification rule. It belongs in the energy model,
measurement contract, and existing fixtures when those files are next revised;
this audit alone does not modify or promote them.

## Open research questions

1. Which useful AI subroutines destroy large amounts of logically irrecoverable
   information after optimal compression, and which merely move or overwrite
   physically costly but logically redundant state?
2. Can reversible pebbling or checkpoint/uncompute schedules reduce complete
   training or search energy once memory hierarchy, communication, latency, and
   leakage are included?
3. Where is the measured adiabatic crossover for modern interconnect-dominated
   circuits at fixed useful throughput and timing yield?
4. Can a physical compiler jointly optimize logical reversibility, placement,
   voltage, precision, retention, and expected deployment distribution without
   creating prohibitive mismatch cost?
5. Which learned representations preserve useful cross-module correlations
   while avoiding the communication energy that makes monolithic execution
   expensive?
6. Can predictive-information objectives reduce physical state updates in a
   deployed continual learner beyond ordinary compression, caching, and
   event-triggered control?
7. What experimentally identifiable entropy-production estimators remain valid
   for hidden-state, nonstationary, partially observed learning hardware?
8. Do any useful accelerator currents satisfy a thermodynamic uncertainty
   relation whose precision variable corresponds to task acceptance rather than
   an internal device current?
9. When does stochastic physical sampling beat high-quality pseudorandom
   digital sampling on energy, mixing, bias, tail coverage, and wall-clock time?
10. What is the minimum complete cost of measurement-based conditional routing
    when sensing, confidence estimation, arbitration, communication, and false
    routes are included?
11. How should idle and shared infrastructure energy be allocated to bursty
    conditional workloads without rewarding low utilization or hidden queuing?
12. Which retention horizon minimizes lifecycle energy when refresh,
    recomputation, correction, migration, and hardware replacement are all
    available?
13. Can reversible or error-tolerant memories be fabricated and controlled with
    lower lifetime burden than replicated conventional memories at equal
    accepted retrieval service?
14. How sensitive are accelerator lifecycle rankings to fab yield, package
    complexity, utilization, software support lifetime, and displaced-hardware
    assumptions?
15. Can uncertainty intervals for component energy, facility allocation, and
    lifecycle inventory be propagated to a robust Pareto decision without a
    post-hoc scalar score?
16. What measurement protocol can separate true task-energy reduction from
    temporal or geographic load shifting when carbon, water, and grid impact are
    also decision variables?

## Bibliography

1. R. Landauer, “Irreversibility and Heat Generation in the Computing
   Process,” *IBM Journal of Research and Development* 5 (1961),
   [doi:10.1147/rd.53.0183](https://doi.org/10.1147/rd.53.0183).
2. C. H. Bennett, “The Thermodynamics of Computation—a Review,”
   *International Journal of Theoretical Physics* 21 (1982),
   [doi:10.1007/BF02084158](https://doi.org/10.1007/BF02084158).
3. D. Reeb and M. M. Wolf, “An Improved Landauer Principle with Finite-Size
   Corrections,” *New Journal of Physics* 16 (2014),
   [doi:10.1088/1367-2630/16/10/103011](https://doi.org/10.1088/1367-2630/16/10/103011).
4. C. E. Shannon, “A Mathematical Theory of Communication,” *Bell System
   Technical Journal* 27 (1948),
   [doi:10.1002/j.1538-7305.1948.tb01338.x](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x).
5. S. Deffner and C. Jarzynski, “Information Processing and the Second Law of
   Thermodynamics: An Inclusive, Hamiltonian Approach,” *Physical Review X* 3
   (2013), [doi:10.1103/PhysRevX.3.041003](https://doi.org/10.1103/PhysRevX.3.041003).
6. G. Diana, G. B. Bagci, and M. Esposito, “Finite-Time Erasing of Information
   Stored in Fermionic Bits,” *Physical Review E* 87 (2013),
   [doi:10.1103/PhysRevE.87.012111](https://doi.org/10.1103/PhysRevE.87.012111).
7. W. C. Wimsatt et al., “Refining Landauer's Stack: Balancing Error and
   Dissipation When Erasing Information,” *Journal of Statistical Physics* 183
   (2021), [doi:10.1007/s10955-021-02733-1](https://doi.org/10.1007/s10955-021-02733-1).
8. L. del Rio et al., “The Thermodynamic Meaning of Negative Entropy,”
   *Nature* 474 (2011),
   [doi:10.1038/nature10123](https://doi.org/10.1038/nature10123).
9. C. Jarzynski, “Nonequilibrium Equality for Free Energy Differences,”
   *Physical Review Letters* 78 (1997),
   [doi:10.1103/PhysRevLett.78.2690](https://doi.org/10.1103/PhysRevLett.78.2690).
10. G. E. Crooks, “Entropy Production Fluctuation Theorem and the Nonequilibrium
    Work Relation for Free Energy Differences,” *Physical Review E* 60 (1999),
    [doi:10.1103/PhysRevE.60.2721](https://doi.org/10.1103/PhysRevE.60.2721).
11. U. Seifert, “Entropy Production along a Stochastic Trajectory and an
    Integral Fluctuation Theorem,” *Physical Review Letters* 95 (2005),
    [doi:10.1103/PhysRevLett.95.040602](https://doi.org/10.1103/PhysRevLett.95.040602).
12. A. Bérut et al., “Experimental Verification of Landauer's Principle Linking
    Information and Thermodynamics,” *Nature* 483 (2012),
    [doi:10.1038/nature10872](https://doi.org/10.1038/nature10872).
13. Y. Jun, M. Gavrilov, and J. Bechhoefer, “High-Precision Test of Landauer's
    Principle in a Feedback Trap,” *Physical Review Letters* 113 (2014),
    [doi:10.1103/PhysRevLett.113.190601](https://doi.org/10.1103/PhysRevLett.113.190601).
14. J. Hong et al., “Experimental Test of Landauer's Principle in Single-Bit
    Operations on Nanomagnetic Memory Bits,” *Science Advances* 2 (2016),
    [doi:10.1126/sciadv.1501492](https://doi.org/10.1126/sciadv.1501492).
15. R. Gaudenzi et al., “Quantum Landauer Erasure with a Molecular Nanomagnet,”
    *Nature Physics* 14 (2018),
    [doi:10.1038/s41567-018-0070-7](https://doi.org/10.1038/s41567-018-0070-7).
16. C. H. Bennett, “Logical Reversibility of Computation,” *IBM Journal of
    Research and Development* 17 (1973),
    [doi:10.1147/rd.176.0525](https://doi.org/10.1147/rd.176.0525).
17. E. Fredkin and T. Toffoli, “Conservative Logic,” *International Journal of
    Theoretical Physics* 21 (1982),
    [doi:10.1007/BF01857727](https://doi.org/10.1007/BF01857727).
18. C. H. Bennett, “Time/Space Trade-Offs for Reversible Computation,” *SIAM
    Journal on Computing* 18 (1989),
    [doi:10.1137/0218053](https://doi.org/10.1137/0218053).
19. D. H. Wolpert, A. Kolchinsky, and J. A. Owen, “A Space–Time Tradeoff for
    Implementing a Function with Master Equation Dynamics,” *Nature
    Communications* 10 (2019),
    [doi:10.1038/s41467-019-09542-x](https://doi.org/10.1038/s41467-019-09542-x).
20. W. C. Athas et al., “Low-Power Digital Systems Based on Adiabatic-Switching
    Principles,” *IEEE Transactions on VLSI Systems* 2 (1994),
    [doi:10.1109/92.335009](https://doi.org/10.1109/92.335009).
21. S. Kim and S.-I. Chae, “Implementation of a Simple 8-bit Microprocessor with
    Reversible Energy Recovery Logic,” *ISLPED '05* (2005),
    [doi:10.1145/1062261.1062332](https://doi.org/10.1145/1062261.1062332).
22. E. Aurell et al., “Refined Second Law of Thermodynamics for Fast Random
    Processes,” *Physical Review Letters* 106 (2011),
    [doi:10.1103/PhysRevLett.106.250601](https://doi.org/10.1103/PhysRevLett.106.250601).
23. K. Proesmans, J. Ehrich, and J. Bechhoefer, “Finite-Time Landauer Principle,”
    *Physical Review Letters* 125 (2020),
    [doi:10.1103/PhysRevLett.125.100602](https://doi.org/10.1103/PhysRevLett.125.100602).
24. K. Proesmans, J. Ehrich, and J. Bechhoefer, “Optimal Finite-Time Bit Erasure
    under Full Control,” *Physical Review E* 102 (2020),
    [doi:10.1103/PhysRevE.102.032105](https://doi.org/10.1103/PhysRevE.102.032105).
25. H. J. D. Miller et al., “Quantum Fluctuations Hinder Finite-Time
    Information Erasure near the Landauer Limit,” *Physical Review Letters* 125 (2020),
    [doi:10.1103/PhysRevLett.125.160602](https://doi.org/10.1103/PhysRevLett.125.160602).
26. Y.-Z. Zhen et al., “Universal Bound on Energy Cost of Bit Reset in Finite
    Time,” *Physical Review Letters* 127 (2021),
    [doi:10.1103/PhysRevLett.127.190602](https://doi.org/10.1103/PhysRevLett.127.190602).
27. A. Rolandi and M. Perarnau-Llobet, “Finite-Time Landauer Principle beyond
    Weak Coupling,” *Quantum* 7 (2023),
    [doi:10.22331/q-2023-11-03-1161](https://doi.org/10.22331/q-2023-11-03-1161).
28. H. A. Kramers, “Brownian Motion in a Field of Force and the Diffusion Model
    of Chemical Reactions,” *Physica* 7 (1940),
    [doi:10.1016/S0031-8914(40)90098-2](https://doi.org/10.1016/S0031-8914%2840%2990098-2).
29. W. F. Brown Jr., “Thermal Fluctuations of a Single-Domain Particle,”
    *Physical Review* 130 (1963),
    [doi:10.1103/PhysRev.130.1677](https://doi.org/10.1103/PhysRev.130.1677).
30. M. S. Fashami, J. Atulasimha, and S. Bandyopadhyay, “Energy Dissipation and
    Error Probability in Fault-Tolerant Binary Switching,” *Scientific Reports*
    3 (2013), [doi:10.1038/srep03204](https://doi.org/10.1038/srep03204).
31. J. B. Johnson, “Thermal Agitation of Electricity in Conductors,” *Physical
    Review* 32 (1928),
    [doi:10.1103/PhysRev.32.97](https://doi.org/10.1103/PhysRev.32.97).
32. H. Nyquist, “Thermal Agitation of Electric Charge in Conductors,” *Physical
    Review* 32 (1928),
    [doi:10.1103/PhysRev.32.110](https://doi.org/10.1103/PhysRev.32.110).
33. H. B. Callen and T. A. Welton, “Irreversibility and Generalized Noise,”
    *Physical Review* 83 (1951),
    [doi:10.1103/PhysRev.83.34](https://doi.org/10.1103/PhysRev.83.34).
34. R. Sarpeshkar, “Analog versus Digital: Extrapolating from Electronics to
    Neurobiology,” *Neural Computation* 10 (1998),
    [doi:10.1162/089976698300017052](https://doi.org/10.1162/089976698300017052).
35. M. C. Diamantini, L. Gammaitoni, and C. A. Trugenberger, “Landauer Bound for
    Analog Computing Systems,” *Physical Review E* 94 (2016),
    [doi:10.1103/PhysRevE.94.012139](https://doi.org/10.1103/PhysRevE.94.012139).
36. S. Goldt and U. Seifert, “Stochastic Thermodynamics of Learning,” *Physical
    Review Letters* 118 (2017),
    [doi:10.1103/PhysRevLett.118.010601](https://doi.org/10.1103/PhysRevLett.118.010601).
37. T. Sagawa and M. Ueda, “Generalized Jarzynski Equality under Nonequilibrium
    Feedback Control,” *Physical Review Letters* 104 (2010),
    [doi:10.1103/PhysRevLett.104.090602](https://doi.org/10.1103/PhysRevLett.104.090602).
38. T. Sagawa and M. Ueda, “Nonequilibrium Thermodynamics of Feedback Control,”
    *Physical Review E* 85 (2012),
    [doi:10.1103/PhysRevE.85.021104](https://doi.org/10.1103/PhysRevE.85.021104).
39. S. Toyabe et al., “Experimental Demonstration of Information-to-Energy
    Conversion and Validation of the Generalized Jarzynski Equality,” *Nature
    Physics* 6 (2010),
    [doi:10.1038/nphys1821](https://doi.org/10.1038/nphys1821).
40. J. V. Koski et al., “Experimental Realization of a Szilard Engine with a
    Single Electron,” *Proceedings of the National Academy of Sciences* 111
    (2014), [doi:10.1073/pnas.1406966111](https://doi.org/10.1073/pnas.1406966111).
41. J. V. Koski et al., “On-Chip Maxwell's Demon as an Information-Powered
    Refrigerator,” *Physical Review Letters* 115 (2015),
    [doi:10.1103/PhysRevLett.115.260602](https://doi.org/10.1103/PhysRevLett.115.260602).
42. J. M. Horowitz and M. Esposito, “Thermodynamics with Continuous Information
    Flow,” *Physical Review X* 4 (2014),
    [doi:10.1103/PhysRevX.4.031015](https://doi.org/10.1103/PhysRevX.4.031015).
43. C. C. Govern and P. R. ten Wolde, “Optimal Resource Allocation in Cellular
    Sensing Systems,” *Proceedings of the National Academy of Sciences* 111
    (2014), [doi:10.1073/pnas.1411524111](https://doi.org/10.1073/pnas.1411524111).
44. C. C. Govern and P. R. ten Wolde, “Energy Dissipation and Noise Correlations
    in Biochemical Sensing,” *Physical Review Letters* 113 (2014),
    [doi:10.1103/PhysRevLett.113.258102](https://doi.org/10.1103/PhysRevLett.113.258102).
45. G. Lan et al., “The Energy–Speed–Accuracy Trade-Off in Sensory Adaptation,”
    *Nature Physics* 8 (2012),
    [doi:10.1038/nphys2276](https://doi.org/10.1038/nphys2276).
46. S. Still et al., “Thermodynamics of Prediction,” *Physical Review Letters*
    109 (2012),
    [doi:10.1103/PhysRevLett.109.120604](https://doi.org/10.1103/PhysRevLett.109.120604).
47. S. Goldt and U. Seifert, “Thermodynamic Efficiency of Learning a Rule in
    Neural Networks,” *New Journal of Physics* 19 (2017),
    [doi:10.1088/1367-2630/aa89ff](https://doi.org/10.1088/1367-2630/aa89ff).
48. A. C. Barato and U. Seifert, “Thermodynamic Uncertainty Relation for
    Biomolecular Processes,” *Physical Review Letters* 114 (2015),
    [doi:10.1103/PhysRevLett.114.158101](https://doi.org/10.1103/PhysRevLett.114.158101).
49. T. R. Gingrich et al., “Dissipation Bounds All Steady-State Current
    Fluctuations,” *Physical Review Letters* 116 (2016),
    [doi:10.1103/PhysRevLett.116.120601](https://doi.org/10.1103/PhysRevLett.116.120601).
50. J. M. Horowitz and T. R. Gingrich, “Proof of the Finite-Time Thermodynamic
    Uncertainty Relation for Steady-State Currents,” *Physical Review E* 96
    (2017), [doi:10.1103/PhysRevE.96.020103](https://doi.org/10.1103/PhysRevE.96.020103).
51. Y. Hasegawa and T. Van Vu, “Fluctuation Theorem Uncertainty Relation,”
    *Physical Review Letters* 123 (2019),
    [doi:10.1103/PhysRevLett.123.110602](https://doi.org/10.1103/PhysRevLett.123.110602).
52. A. M. Timpanaro et al., “Thermodynamic Uncertainty Relations from Exchange
    Fluctuation Theorems,” *Physical Review Letters* 123 (2019),
    [doi:10.1103/PhysRevLett.123.090604](https://doi.org/10.1103/PhysRevLett.123.090604).
53. K. Liu, Z. Gong, and M. Ueda, “Thermodynamic Uncertainty Relation for
    Arbitrary Initial States,” *Physical Review Letters* 125 (2020),
    [doi:10.1103/PhysRevLett.125.140602](https://doi.org/10.1103/PhysRevLett.125.140602).
54. T. Monnai, “Thermodynamic Uncertainty Relation in Arbitrary Time,” *Physical
    Review E* 108 (2023),
    [doi:10.1103/PhysRevE.108.024119](https://doi.org/10.1103/PhysRevE.108.024119).
55. A. B. Boyd, D. Mandal, and J. P. Crutchfield, “Thermodynamics of Modularity:
    Structural Costs beyond the Landauer Bound,” *Physical Review X* 8 (2018),
    [doi:10.1103/PhysRevX.8.031036](https://doi.org/10.1103/PhysRevX.8.031036).
56. A. Kolchinsky and D. H. Wolpert, “Dependence of Dissipation on the Initial
    Distribution over States,” *Journal of Statistical Mechanics* (2017),
    [doi:10.1088/1742-5468/aa7ee1](https://doi.org/10.1088/1742-5468/aa7ee1).
57. A. Kolchinsky and D. H. Wolpert, “Dependence of Integrated, Instantaneous,
    and Fluctuating Entropy Production on the Initial State in Quantum and
    Classical Processes,” *Physical Review E* 104 (2021),
    [doi:10.1103/PhysRevE.104.054107](https://doi.org/10.1103/PhysRevE.104.054107).
58. D. H. Wolpert and A. Kolchinsky, “Thermodynamics of Computing with Circuits,”
    *New Journal of Physics* 22 (2020),
    [doi:10.1088/1367-2630/ab82b8](https://doi.org/10.1088/1367-2630/ab82b8).
59. A. Kolchinsky and D. H. Wolpert, “Thermodynamic Costs of Turing Machines,”
    *Physical Review Research* 2 (2020),
    [doi:10.1103/PhysRevResearch.2.033312](https://doi.org/10.1103/PhysRevResearch.2.033312).
60. M. Horowitz, “1.1 Computing's Energy Problem (and What We Can Do about It),”
    *IEEE International Solid-State Circuits Conference* (2014),
    [doi:10.1109/ISSCC.2014.6757323](https://doi.org/10.1109/ISSCC.2014.6757323).
61. Y.-H. Chen, J. Emer, and V. Sze, “Eyeriss: An Energy-Efficient Reconfigurable
    Accelerator for Deep Convolutional Neural Networks,” *IEEE Journal of
    Solid-State Circuits* 52 (2017),
    [doi:10.1109/JSSC.2016.2616357](https://doi.org/10.1109/JSSC.2016.2616357).
62. N. P. Jouppi et al., “In-Datacenter Performance Analysis of a Tensor
    Processing Unit,” *ISCA '17* (2017),
    [doi:10.1145/3079856.3080246](https://doi.org/10.1145/3079856.3080246).
63. V. Sze et al., “Efficient Processing of Deep Neural Networks: A Tutorial and
    Survey,” *Proceedings of the IEEE* 105 (2017),
    [doi:10.1109/JPROC.2017.2761740](https://doi.org/10.1109/JPROC.2017.2761740).
64. ISO/IEC, *ISO/IEC 30134-2:2026 Information Technology—Data Centres Key
    Performance Indicators—Part 2: Power Usage Effectiveness (PUE)*,
    [official catalogue](https://www.iso.org/standard/30134-2).
65. E. D. Williams, R. U. Ayres, and M. Heller, “The 1.7 Kilogram Microchip:
    Energy and Material Use in the Production of Semiconductor Devices,”
    *Environmental Science & Technology* 36 (2002),
    [doi:10.1021/es025643o](https://doi.org/10.1021/es025643o).
66. N. Krishnan et al., “A Hybrid Life Cycle Inventory of Nano-Scale
    Semiconductor Manufacturing,” *Environmental Science & Technology* 42
    (2008), [doi:10.1021/es071174k](https://doi.org/10.1021/es071174k).
67. S. B. Boyd et al., “Life-Cycle Assessment of Computational Logic Produced
    from 1995 through 2010,” *Environmental Science & Technology* 44 (2010),
    [doi:10.1021/es902388b](https://doi.org/10.1021/es902388b).
68. T. Pirson and D. Bol, “Assessing the Embodied Carbon Footprint of IoT Edge
    Devices with a Bottom-Up Life-Cycle Approach,” *Journal of Cleaner
    Production* 322 (2021),
    [doi:10.1016/j.jclepro.2021.128966](https://doi.org/10.1016/j.jclepro.2021.128966).
69. ISO, *ISO 14040:2006 Environmental Management—Life Cycle Assessment—Principles
    and Framework*, [official catalogue](https://www.iso.org/standard/37456.html).
70. ISO, *ISO 14044:2006 Environmental Management—Life Cycle Assessment—Requirements
    and Guidelines*, [official catalogue](https://www.iso.org/standard/38498.html).
71. A. Shehabi et al., *2024 United States Data Center Energy Usage Report*,
    Lawrence Berkeley National Laboratory (2024),
    [doi:10.71468/P1WC7Q](https://doi.org/10.71468/P1WC7Q).
72. Bureau International des Poids et Mesures, *The International System of
    Units (SI Brochure)*, 9th edition, updated 2026,
    [doi:10.59161/AUEZ1291](https://doi.org/10.59161/AUEZ1291).

## Audit disposition

- audit-local claims: **52** (`46 established`, `5 plausible`, `1 disputed`)
- decisive equal-budget experiments: **12**
- recurrent overclaims and negative-result traps: **20**
- open research questions: **16**
- bibliography entries: **72**
- new principles: **0**
- new candidates: **0**
- exact residual: one evaluation contract, assigned to the existing energy,
  measurement, and benchmark-fixture structure rather than promoted

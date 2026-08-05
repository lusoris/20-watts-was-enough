# Primary-source audit: power grids, protection, and recovery

<!-- markdownlint-disable MD013 -->

**Audit date:** 2026-08-05

**Scope:** protection relays, adaptive and wide-area protection, hierarchical
frequency and voltage control, inertia and grid-forming response, droop and
synchronization, demand response and reserves, controlled islanding and
microgrids, cascading failure and `N-1` security, state estimation and
synchrophasors, false-data injection, restoration, and black start

**Ledger state:** candidate evidence only; `C-GRID-*` labels below are temporary
and must be assigned stable `C-` numbers by the root integrator

**Purpose:** determine what power-system engineering adds beyond the existing
principle registry, and establish the conventional protection, control,
optimization, and cyber-physical nulls that any AI translation must beat

## Executive conclusion

The power grid is not evidence for one novel principle called “decentralized
intelligence,” “self-healing,” or “homeostasis.” It is evidence for a strict
composition of mechanisms with different information, authority, latency, and
physical budgets:

1. local protection is allowed to disconnect equipment quickly, but only for a
   deliberately bounded zone and operating characteristic;
2. primary frequency and voltage controls respond from local electrical state
   and reserved physical capability;
3. synchronized measurements and state estimators create a wider but delayed,
   model-dependent view;
4. remedial schemes, dispatch, reserve sharing, and operator procedures may
   exercise wider authority at slower timescales;
5. islanding contains propagation by cutting physical coupling, but creates new
   balance, stability, protection, and resynchronization obligations; and
6. restoration is a verified sequence of resource activation and authority
   handoffs, not a snapshot rollback.

Every one of these families predates modern machine learning. Digital
substation protection was formulated by Rockefeller in 1969
([IEEE](https://doi.org/10.1109/TPAS.1969.292466)); adaptive relaying with
hierarchical processors and online setting changes was explicit by 1988
([IEEE](https://doi.org/10.1109/61.193943)); wide-area protection and emergency
control were mature enough for a systems review by 2005
([IEEE](https://doi.org/10.1109/JPROC.2005.847258)); and Schweppe et al. called
their decentralized supply-demand proposal “Homeostatic Utility Control” in
1980 ([IEEE](https://doi.org/10.1109/TPAS.1980.319745)). These are strong
terminological and engineering nulls.

The audit therefore rejects the following unsupported transfers:

- “faster neurons” do not imply better protection unless sensing window,
  breaker time, false-trip rate, selectivity, fault-current physics, and
  hardware energy are matched;
- synchronized PMUs do not create ground truth, observability, trustworthy
  topology, or an authorization to trip;
- inertia, fast frequency response, and grid-forming control are not free
  software features: they require current capacity, active-power headroom,
  stored or curtailed energy, measurement and control bandwidth, and stable
  interaction with other devices;
- `N-1` is a scoped planning or operating criterion over declared
  contingencies, models, limits, and corrective actions—not proof against
  common-mode, hidden, cyber, extreme, or sequential failures;
- a microgrid boundary is not generic modularity: electrical separation must
  leave feasible voltage, frequency, generation-load balance, protection, and
  reconnection conditions on both sides; and
- black start is not “self-repair.” It is a controlled, trained, and tested
  reconstruction process with cranking paths, reactive-power constraints,
  priority loads, fuel, batteries, communications, and named authority.

The only held residual is **latency-qualified authority envelopes**: a system
may allow each controller only those actions that remain safe under its current
observation delay, telemetry trust, physical headroom, and coordination mode,
with explicit handoff and rollback when the envelope changes. This is useful,
but it is not yet a new principle. At current resolution it is a composition of
[P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation),
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback),
[P-008](../principle-registry.md#p-008--compartmentalized-interaction),
[P-009](../principle-registry.md#p-009--maintenance-plane), and the held
severity-ordered containment candidate, against established hierarchical
control, protection coordination, supervisory control, runtime assurance,
remedial-action schemes, and restoration plans. It should not be promoted
unless the tests defined below show a result those nulls cannot reproduce.

## Evidence and interpretation boundary

This audit prioritizes foundational primary papers, standards, regulator or
reliability-organization documents, and official post-event investigations.
They establish different kinds of propositions:

| Evidence class | What it can establish | What it cannot establish |
| --- | --- | --- |
| relay or controller derivation | logic, model, and scoped analytical property | field reliability outside the assumed device and network model |
| hardware or laboratory test | measured response for the tested setup | universal clearing or control time |
| simulation on a named network | behavior under that model, parameter set, and event set | guaranteed field containment or restoration |
| planning or operating standard | required process, event category, authority, and evidence | physical sufficiency for unmodeled events merely because compliance exists |
| post-event investigation | reconstructed causal and organizational failures for that event | universal frequency of each causal mechanism |
| mathematical stability result | theorem under stated topology, dynamics, and limits | robustness after assumptions, saturation, delay, or topology are changed |
| white paper or reliability guideline | authoritative functional expectations and test proposals | a peer-reviewed universal theorem or commercial-device guarantee |

“Established” below means established for the scoped engineering mechanism,
standard, theorem, or investigated event. It never means that an analogous AI
architecture will improve quality, safety, or energy. No source here supports a
universal relay time, droop coefficient, reserve fraction, inertia floor,
pruning percentage, island size, restoration order, or claimed
orders-of-magnitude AI efficiency gain.

## Terms that must not be collapsed

| Term | Operational meaning | Not equivalent to |
| --- | --- | --- |
| fault | an abnormal electrical condition for which protection is designed | any anomaly, prediction error, or low-confidence sample |
| protection | detection and isolation intended to limit equipment or system damage | optimization; generic monitoring; diagnosis after the event |
| dependability | operating when protection is required | overall accuracy |
| security | refraining from operation when protection is not required | cyber security; secrecy |
| selectivity | isolating the intended minimum zone or equipment in the intended sequence | high classifier precision without physical coordination |
| primary protection | the designated protection for its zone, normally closest to the fault | a globally optimal controller |
| backup protection | delayed or alternate clearing when primary protection or a breaker fails | a replica that shares all sensing, settings, power, and communication dependencies |
| remedial action scheme (RAS) | pre-engineered detection and control for particular system conditions or events | open-ended agent planning |
| state estimation | model-based inference of bus voltage states from redundant imperfect measurements | direct measurement of every state; dynamic-stability proof |
| synchrophasor | time-referenced phasor, frequency, or ROCOF measurement satisfying a declared measurement standard | trustworthy global state; guaranteed low end-to-end control latency |
| observability | ability to infer the selected model state from available measurements | correctness of topology, parameters, measurements, timestamps, or semantics |
| inertia | stored kinetic energy coupled through synchronous electromechanical dynamics | arbitrary fast power injection |
| fast frequency response | controlled active-power injection or load reduction fast enough to affect the arresting period | inertia; sustained energy; secondary restoration of nominal frequency |
| grid-forming response | converter behavior that establishes and regulates an internal voltage phasor and interacts as a voltage source | unlimited fault current, energy, or stability under saturation |
| droop | local proportional relation between measured frequency/voltage deviation and power/voltage command | zero steady-state error; economic dispatch by itself |
| reserve | qualified unused capability available under stated response, duration, and deliverability conditions | installed nameplate capacity |
| demand response | controlled or incentive-induced load change relative to an operating baseline | generation; free curtailment; permanent energy reduction |
| islanding | intentional or accidental electrical separation into energized subsystems | software partitioning with no conservation law or reconnection requirement |
| `N-1` security | acceptability after each declared single contingency under stated limits and allowed actions | immunity to all single causes, common mode, sequential events, or model error |
| resilience | ability to withstand, adapt to, and recover from disruption under declared service measures | reliability or `N-1` compliance alone |
| black-start resource | resource able to start without support from the bulk system, or remain energized as qualified by the restoration plan | any battery, generator, or idle compute node |
| restoration | sequenced re-energization and rebalancing after partial or complete shutdown | checkpoint restore; returning to the exact pre-event state |

## Control and authority ladder

The times below are **design bands to be measured per implementation**, not
universal constants. A valid experiment must report the actual sampling,
filter, computation, communication, actuation, and settling distributions.

| Layer | Exact problem | Information path | Authority path | Relevant timescale and units | Physical or operational budget | Scoped guarantee and hard boundary |
| --- | --- | --- | --- | --- | --- | --- |
| equipment physics | exchange imbalance energy and establish voltages/currents | electromagnetic and electromechanical coupling through the network | none; response follows device physics | subcycle through seconds; V, A, Hz, Hz/s, rad, MW, MVAr | rotor kinetic energy, converter current, stored energy, thermal margin | response exists only while device physics and limits permit it |
| primary protection | clear an in-zone fault before damage or instability | CT/PT or sampled values → relay characteristic → trip circuit → breaker | pre-authorized local trip for a bounded zone | waveform samples, cycles, milliseconds, breaker travel; exact values scheme-specific | instrument transformers, IED compute/W, station DC, breaker duty, communications where used | dependability/security/selectivity only for studied faults, settings, hardware, and coordination |
| primary frequency/voltage control | arrest imbalance and share load without waiting for a central dispatch | terminal voltage/current/frequency → governor, AVR, droop, or GFM inner loop | local continuous actuation within headroom and current limits | subcycle converter response through seconds; MW, MVAr, Hz, V | headroom MW, ramp MW/s, current pu/A, energy MW·s or MWh, thermal limit | local or network stability only under declared dynamics, gain, delay, and saturation assumptions |
| wide-area monitoring and RAS | recognize and mitigate selected system conditions | meters/PMUs → communications/concentrator → estimator or event logic → nominated actuators | predesigned multi-site action or operator-supervised action | cycles to seconds and minutes; packets/s, Mb/s, timestamp error, missing-data rate | PMUs, clocks, links, processors, cyber controls, prequalified actuators | no guarantee outside event logic, communication, model, and actuator availability |
| secondary balancing | restore scheduled frequency/interchange after primary arrest | SCADA/PMU/ACE → balancing authority AGC → participating resources | centralized or coordinated redispatch of contracted resources | seconds to minutes; MW, MW/min, Hz, tie-line MW | regulation range, ramp, telemetry, control bandwidth, fuel/energy | restores target only if response is available, stable, and deliverable |
| contingency reserve and tertiary dispatch | replace lost supply and restore reserve margins | forecasts, commitments, outages, network model → operator/market/optimizer → resources | balancing authority, reserve-sharing group, or system operator | minutes to hours; MW, MW/min, MWh, startup min | committed reserve, transmission deliverability, duration, fuel, opportunity cost | scoped to qualifying events and performance rules, not every cascade or energy shortage |
| emergency separation | prevent a disturbance from propagating through the interconnection | local/wide-area state and event logic → breaker set and load/generation controls | RAS, protection, or operator according to an engineered plan | cycles to seconds; breaker operations, MW imbalance, Hz and V trajectory | cutset, shedding MW, surviving generation and reactive support, communications | containment only if each resulting island remains dynamically and operationally feasible |
| restoration and black start | rebuild a controllable energized system from a shutdown state | field status, plans, simulations, voice/data links → RC/TOP/GOP/field crews → switching and startup | explicit organizational hierarchy with approved plans and local procedures | minutes to hours or longer; MW/MVAr, MWh, startup min, switching count | black-start availability, cranking power, station batteries, fuel, crews, voltage/frequency margins | sequenced progress under tested plan assumptions; no exact-state or fixed-time guarantee |

The ladder is evidence against any design that gives a slow, remote, or
model-dependent controller unlimited authority merely because it has a larger
model. Conversely, it is not evidence that local action is intrinsically
correct. Hidden relay failures and miscoordination show that fast local
authority can amplify a disturbance.

## Evidence synthesis

| Record | Mechanism or source | Exact problem and information/authority path | Guarantee or evidence status | Strongest null and registry disposition |
| --- | --- | --- | --- | --- |
| GRID-01 | digital and zoned protection | local electrical measurements → relay logic → trip circuit/breaker for a declared zone | foundational implementation concept; modern performance remains scheme-specific | conventional distance, differential, overcurrent, pilot, and breaker-failure protection; [P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation), [P-008](../principle-registry.md#p-008--compartmentalized-interaction) |
| GRID-02 | adaptive relaying | topology/environment/experience → setting, characteristic, or logic change through frontline, station, and remote processors | adaptive protection established as a design family, not a universal safety result | offline coordination plus setting groups, online adaptive relays, supervisory/runtime assurance; P-002/P-009 |
| GRID-03 | wide-area protection and RAS | synchronized or SCADA measurements → event logic/estimate → selected shedding, tripping, separation, or setpoint action | established architecture; action remains event-, communications-, and model-scoped | RAS, system integrity protection scheme, robust MPC, event-triggered control; P-002/P-011 only when participation truly changes by event |
| GRID-04 | static state estimation | heterogeneous meter vector + topology/parameter model → estimated bus voltage magnitudes and angles → operator/security applications | weighted inference under observability and error-model assumptions | WLS/LAV/robust and distributed state estimation; [P-007](../principle-registry.md#p-007--prediction-error-allocation) |
| GRID-05 | synchrophasors | common time reference + local waveform → phasor/frequency/ROCOF stream → concentrator or application | measurement definitions and tests, not trustworthy control or complete state | PMU standards, clock-quality monitoring, dynamic state estimation; weak P-013 support |
| GRID-06 | false-data injection | attacker modifies a model-consistent set of measurements → estimator accepts biased state | primary linear-model construction and simulation; threat-model scoped | residual bad-data detection plus robust estimation, protected meters, topology/temporal/cross-channel validation; P-007/P-009 |
| GRID-07 | inertia, droop, and hierarchical frequency control | network frequency/voltage → local physical or proportional response → slower integral/dispatch restoration | well-established physics/control; formal synchronization only under stated network assumptions | swing-equation models, governors/AVRs, droop, AGC, distributed averaging integral control; [P-006](../principle-registry.md#p-006--homeostatic-negative-feedback) |
| GRID-08 | grid-forming and fast frequency response | terminal waveform and internal voltage state → subcycle converter current/power → network response | functional guidance and model/field tests; bounded by current, headroom, energy, delay, and interactions | conventional GFM/VSM/matching/dVOC/droop/current-limiting control; P-002/P-006 |
| GRID-09 | demand response | price or dispatch plus local process state → aggregate load change → rebound and recovery | controllability methods established; availability and user-process constraints remain | aggregator MPC, thermostatic-load ensembles, direct load control, price response; P-002/P-006 |
| GRID-10 | reserve sharing | reportable imbalance/contingency → qualified headroom and load response → recovery of balance and reserve | authoritative performance obligation under declared event definitions | security-constrained commitment/dispatch, reserve sharing, robust/stochastic optimization; P-006/P-009 |
| GRID-11 | microgrids and controlled islanding | disturbance/state estimate → constrained cutset → local balance and stabilization → later synchronization | simulations and deployed control concepts; no universal feasible partition | graph cut plus AC/dynamic constraints, slow coherency, UFLS, microgrid controls; P-008 and severity-ordered containment |
| GRID-12 | cascading-failure analysis | initiating outages → flow redistribution, protection/control action, further outages; slow investment/load evolution changes future risk | authoritative event reconstruction plus simplified multiscale models | dynamic security assessment, branching/OPA models, contingency simulation, robust control; P-006/P-009 |
| GRID-13 | `N-1` and planning events | declared network state + contingency set → post-contingency analysis and allowed corrective action | compliance criterion for stated categories, not a universal guarantee | contingency analysis, security-constrained OPF/UC, probabilistic risk assessment; P-009 |
| GRID-14 | black start and restoration | approved plan + field status + black-start resources → cranking paths, startup, load pickup, island synchronization → BA handback | authoritative plan, test, training, and coordination requirements | restoration optimization, operator runbooks/drills, dynamic and power-flow verification; P-002/P-008/P-009/P-013 |

## GRID-01 — Protection is bounded local authority, not generic anomaly detection

Rockefeller's stored-program digital protection proposal explicitly joined
fault detection and location to opening the appropriate circuit breakers for
station and outgoing-line faults
([IEEE 1969](https://doi.org/10.1109/TPAS.1969.292466)). The enduring causal
path is:

```text
primary voltage/current
  -> instrument transformer or sampled-value source
  -> filtering and protection quantity
  -> zone/characteristic/timer/interlock
  -> trip output and station DC circuit
  -> circuit breaker interrupts current
  -> local and remote backup if the intended clearing path fails
```

This path has at least five distinct latency terms:

$$
T_{\mathrm{clear}}
=T_{\mathrm{sense}}+T_{\mathrm{filter}}+T_{\mathrm{logic}}
+T_{\mathrm{trip}}+T_{\mathrm{breaker}}.
$$

All terms are in seconds. Communication and remote decision terms must be
added when the scheme uses them. Reporting only neural-network inference time
while omitting the waveform window, anti-aliasing/filter group delay, I/O,
trip-circuit energization, and breaker interruption is invalid.

For event set $\mathcal{F}$, in-zone subset $\mathcal{F}_{\mathrm{in}}$, and
relay output $u(f)\in\{0,1\}$, two separate empirical quantities are

$$
\widehat D
=\frac{\sum_{f\in\mathcal{F}_{\mathrm{in}}}
\mathbf{1}[u(f)=1]}{|\mathcal{F}_{\mathrm{in}}|},
\qquad
\widehat S
=\frac{\sum_{f\notin\mathcal{F}_{\mathrm{in}}}
\mathbf{1}[u(f)=0]}{|\mathcal{F}\setminus\mathcal{F}_{\mathrm{in}}|}.
$$

$\widehat D$ is test-set dependability and $\widehat S$ is test-set security;
both are dimensionless empirical rates, not guaranteed probabilities outside
the fault and operating-state distribution. Selectivity additionally asks
**which** breakers opened and in what sequence. A detector can score well on
binary labels while shedding the wrong load or isolating too much network.

### Information, authority, and budget

- **Information:** local current and voltage waveforms, derived sequence or
  impedance quantities, breaker position, permissive/blocking signals, and
  selected topology or setting-group state.
- **Authority:** pre-authorized trip of specific breakers; backup may act over
  a wider zone after a declared delay or breaker-failure indication.
- **Physical budget:** CT/PT or sensor error and saturation, sampling and IED
  watts, station-battery availability, trip-coil energy, breaker interrupting
  duty, communications where applicable, and the MW/load consequences of each
  opening.
- **Guarantee:** only the studied operating characteristic, fault envelope,
  coordination, hardware chain, and timing margins.
- **Failure boundary:** load encroachment, power swing, current-transformer
  saturation, weak or inverter-limited fault current, bad topology or settings,
  DC supply loss, communication failure, breaker failure, common-mode design
  error, and faults outside the modeled zone.

The strongest null is the full relay suite—not a static threshold: line
differential, distance zones, directional overcurrent, pilot permissive or
blocking, breaker-failure logic, autoreclose, out-of-step functions, and
coordinated primary/backup timing. A learned detector has not improved
protection until it beats these at matched sensing, clearing deadline,
false-trip exposure, zone selectivity, device power, and breaker consequences.

The mapping to [P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation)
is direct: state and high-speed authority are colocated, with slower backup and
operator escalation. The protection zone is a concrete
[P-008](../principle-registry.md#p-008--compartmentalized-interaction)
mechanism because the action boundary corresponds to actual electrical
equipment and breakers. Neither mapping proves a biological origin or a new AI
primitive.

## GRID-02 — Adaptive and wide-area protection are established nulls

Rockefeller et al. defined adaptive transmission relaying as online changes to
settings, characteristics, or logic in response to contingencies that alter
fault-current distribution, environment, or operating experience. Their
architecture included frontline parallel processors, a substation host,
remote central processors, and communication before or after a disturbance
([IEEE 1988](https://doi.org/10.1109/61.193943)). This is already a hierarchy
of local reflex, station context, and remote model—not a gap that a generic
mixture-of-experts analogy fills.

Begovic et al. later reviewed wide-area protection and emergency control using
system-wide measurements, communications, synchronized phasors, local
terminals, and carefully engineered protection/control actions
([Proceedings of the IEEE 2005](https://doi.org/10.1109/JPROC.2005.847258)).
NERC's current RAS standard gives the engineering boundary a governance form:
the purpose of PRC-012-2 is to prevent a remedial action scheme from
introducing unintentional or unacceptable reliability risk, and new or
functionally modified schemes are reviewed by the relevant Reliability
Coordinator before service
([NERC PRC-012-2](https://www.nerc.com/standards/reliability-standards/prc/prc-012-2)).

An adaptive setting update $\theta_{t+1}=g(\theta_t,\hat x_t,m_t)$ is safe only
relative to:

- estimator or mode input $\hat x_t$ and its delay, uncertainty, and attack
  surface;
- declared system mode $m_t$ and verified topology;
- a coordination set $\Theta_{\mathrm{safe}}(m_t)$ containing settings that
  preserve required dependability, security, loadability, and backup margins;
- an authenticated and atomic deployment path;
- local behavior during communication loss or partial update; and
- rollback, version provenance, post-event records, and periodic validation.

The formula itself is dimensionless notation; every component of $\theta$ must
retain its physical unit—amperes, volts, ohms, seconds, degrees, or per-unit
gain. “The policy adapted” is not auditable unless the exact version reaching
each relay is recorded.

### Hidden failures reverse the locality intuition

Fast local authority can magnify a remote disturbance. Tamronglak et al.
modeled preventive relaying strategies around protection-system hidden
failures ([IEEE 1996](https://doi.org/10.1109/61.489327)). The related DOE/ORNL
report defines the relevant class as a defect that remains latent until another
event activates an incorrect protective action
([DOE 1995](https://doi.org/10.2172/32561)). NERC's 2020 State of Reliability
reported that incorrect settings/logic/design, relay failures or malfunctions,
and communication failures consistently made up more than 60% of recorded
misoperations in the five-year analyses then reported
([NERC 2020](https://www.nerc.com/globalassets/programs/rapa/pa/nerc_sor_2020.pdf)).
That historical statistic is scoped to NERC's data and cause coding; it is not
a universal failure prior.

The implication for AI is severe. Redundant learned relays are not independent
when they share training data, topology, label errors, firmware, clocks, input
transformers, station DC, or an attack path. Maintenance under
[P-009](../principle-registry.md#p-009--maintenance-plane) must include
independent fault studies, settings review, end-to-end injection tests,
configuration comparison, misoperation analysis, and corrective action. Merely
adding self-monitoring does not expose faults whose trigger condition has not
yet occurred.

### `P-011` is a conditional, not automatic, mapping

Synchronized PMU streams or a fixed pilot channel do **not** by themselves
instantiate [P-011](../principle-registry.md#p-011--transient-communication-coalitions).
A defensible P-011 manifestation would require the participating measurements
or actuators to form and dissolve according to the event, with measured setup
cost, membership consistency, stale-member handling, and a safer fallback.
Fixed wide-area wiring with a permanent participant set is ordinary
distributed control. A RAS that selects a contingency-specific set of
generators, loads, or breakers is closer, but its strongest null remains a
precomputed event-action table or event-triggered distributed controller.

## GRID-03 — State estimation and PMUs widen view, not certainty or authority

Schweppe and Wildes formulated static power-system state estimation as the
conversion of redundant, imperfect measurements plus a system model into an
estimate of bus voltage states
([IEEE 1970](https://doi.org/10.1109/TPAS.1970.292678)). For measurement vector
$z$, state vector $x$, nonlinear measurement model $h$, and measurement-error
covariance $R$, the standard weighted least-squares null is

$$
\hat x
=\arg\min_x J(x),
\qquad
J(x)=(z-h(x))^\mathsf{T}R^{-1}(z-h(x)).
$$

The state commonly contains voltage magnitudes in per unit or kV and phase
angles in radians. Entries of $z$ may include MW, MVAr, A, V, or dimensionless
per-unit quantities. $R$ carries the squared units of the corresponding
measurement errors so $J$ is dimensionless after proper normalization. A
paper that mixes residuals across measurement types without covariance or
unit normalization is not performing a valid comparison.

This estimator provides neither a dynamic trajectory nor a protection
decision. Its assumptions include a sufficiently observable measurement
configuration, a correct enough topology and parameter model, timestamps that
refer to a coherent state window, and an error model that makes the objective
meaningful. Bad-data processing can identify residual inconsistency; it
cannot prove that all consistent data are true.

Phadke, Thorp, and Adamiak showed how a substation relay platform could track a
positive-sequence voltage phasor and estimate local frequency and ROCOF by
regression, with laboratory experiments and planned field tests
([IEEE 1983](https://doi.org/10.1109/TPAS.1983.318043)). The current active
synchrophasor measurement standard defines phasor, frequency, ROCOF,
timestamping, performance evaluation, and PMU compliance under static and
dynamic tests, while explicitly leaving the hardware, software, and algorithm
open
([IEC/IEEE 60255-118-1:2018](https://doi.org/10.1109/IEEESTD.2018.8577045)).
The information path is therefore

```text
local waveform
  -> anti-alias/filter/window/phasor algorithm
  -> local timestamp and clock-quality state
  -> packet and communications network
  -> phasor data concentrator alignment
  -> estimator, display, detector, or control application
  -> separately authorized actuator path
```

Each arrow adds error, delay, loss, or correlated failure. A “30 frames/s PMU”
claim is not an end-to-end 33 ms control guarantee. Tests must report waveform
window length, measurement reporting latency, timestamp uncertainty, network
delay and jitter, concentrator wait policy, missing-frame handling, application
compute, and actuator delay.

### Model-consistent false data defeat a residual-only detector

Liu, Ning, and Reiter constructed false-data injection attacks against the
linearized estimator

$$
z=Hx+e.
$$

If an attacker can inject $a=Hc$, then

$$
z'=z+a=H(x+c)+e,
$$

so a residual of the form $z-H\hat x$ can remain in the same class while the
accepted state shifts by $c$
([ACM CCS 2009](https://doi.org/10.1145/1653662.1653666)). The result is a
constructive attack under a linear model and explicit meter-access or resource
constraints, demonstrated on IEEE test systems. It is not proof that every AC
state estimator or protected deployment is arbitrarily corruptible.

Here $H$ is the linearized measurement matrix, $e$ is measurement error, $a$
is the injected measurement-space vector, and $c$ is the induced state-space
offset. Each row of $Hc$ has the same unit as the corresponding entry of $z$;
per-unit normalization or an explicit diagonal scaling is therefore required
before aggregating residuals across measurement types.

This paper is the strongest null for vague “prediction error detects bad
telemetry” proposals. [P-007](../principle-registry.md#p-007--prediction-error-allocation)
does map to residual-directed investigation, but only after model-consistent
attacks, topology error, clock error, correlated sensor failure, and concept
drift are included. Defences must be compared against combinations of:

- protected or independently measured critical quantities;
- robust or least-absolute-value estimators;
- temporal/dynamic consistency rather than a single static residual;
- topology and parameter validation;
- multi-channel physics, breaker, and field-status cross-checks;
- explicit attack-graph and meter-compromise constraints; and
- abstention or authority reduction when observability or trust is lost.

The maintenance mapping to
[P-009](../principle-registry.md#p-009--maintenance-plane) is stronger than a
novel detector claim: calibrate clocks and sensors, validate topology,
exercise loss-of-telemetry modes, preserve raw event records, audit estimator
versions, and correct identified failure causes.

### `P-013` requires a careful distinction

The power network exposes shared physical state: frequency, voltage, phase,
and flows couple distant devices. SCADA and PMU systems also create an
external shared estimate for operators and applications. This is adjacent to
[P-013](../principle-registry.md#p-013--externalized-shared-state), but two
different cases must not be collapsed:

- frequency and voltage are continuously evolving physical variables, not a
  durable trace “left” in the environment; and
- an estimator database is a maintained digital blackboard with ownership,
  timestamp, model, and trust requirements.

The first is closer to coordination through a common dynamical medium; the
second is conventional shared state. Neither supports a claim that an
unversioned global workspace is ground truth.

## GRID-04 — Frequency stability is energy-constrained feedback

The IEEE/CIGRE task force classifies power-system stability by the physical
variables and mechanisms involved rather than treating all departures from an
operating point as one anomaly
([Kundur et al. 2004](https://doi.org/10.1109/TPWRS.2004.825981)). Rotor-angle,
frequency, and voltage stability have different state, actuation, and
timescale requirements. An AI monitor that reports one scalar “grid health”
without preserving these modes destroys actionable information.

For a coherent per-unit frequency model, define the dimensionless frequency
deviation $\delta_f=\Delta\omega/\omega_s$. A simplified aggregate swing
equation is

$$
2H\frac{d\delta_f}{dt}
=\Delta P_m-\Delta P_e-D_f\delta_f.
$$

Here:

- $H$ is the inertia constant in seconds;
- $\omega_s$ is nominal electrical angular frequency in rad/s;
- $\Delta\omega$ is angular-frequency deviation in rad/s and $\delta_f$ is its
  per-unit value;
- $\Delta P_m$ and $\Delta P_e$ are mechanical/input and electrical/output
  power deviations in per unit on the declared MVA base; and
- $D_f$ is a load-damping coefficient in per-unit power per per-unit frequency.

This aggregate equation is a reduced model, not a substitute for multi-machine,
converter, voltage, protection, and network dynamics. Milano et al. survey the
modeling and control difficulties created when converter-interfaced resources
reduce synchronous inertia and change the meaning of the traditional
timescale separation
([PSCC 2018](https://doi.org/10.23919/PSCC.2018.8450880)).

NERC's primary-frequency-control guideline describes frequency response as an
interplay of inertia, load damping, and defined controls, while balancing
authorities use AGC to manage area control error and scheduled frequency
([NERC 2019](https://www.nerc.com/comm/OC/RS_GOP_Survey_DL/PFC_Reliability_Guideline_rev20190501_v2_final.pdf)).
BAL-003 requires a Balancing Authority or Frequency Response Sharing Group to
meet a frequency response obligation measured under the standard's method
([NERC BAL-003-2](https://www.nerc.com/standards/reliability-standards/bal/bal-003-2)).

The architecture is a mature
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback)
null:

```text
power imbalance
  -> inertial/load response constrains initial motion
  -> local governor, inverter, or controllable-load response arrests deviation
  -> AGC/integral action restores scheduled frequency and interchange
  -> tertiary dispatch replaces energy and replenishes reserve
```

The layers do not perform the same job. Inertia changes initial acceleration
without waiting for measurement and control logic; primary droop arrests but
normally leaves an offset; secondary integral control restores the setpoint;
tertiary actions replace sustained energy and opportunity cost.

## GRID-05 — Droop and synchronization already provide local coordination

Chandorkar, Divan, and Adapa developed a parallel-inverter controller using
locally measurable terminal quantities and no control communication critical
to basic operation
([IEEE 1993](https://doi.org/10.1109/28.195899)). A simplified active-power
droop law is

$$
\omega_i
=\omega^\star-n_i(P_i-P_i^\star),
$$

where $\omega_i$ and $\omega^\star$ are rad/s, $P_i$ and $P_i^\star$ are W or
per unit on a declared base, and $n_i$ is rad/s per W or the corresponding
per-unit gain. Frequency becomes both a local measured error and a physical
coordination variable. This is local negative feedback through the network,
not message-passing consensus.

Simpson-Porco, Dörfler, and Bullo cast an inductive islanded microgrid with
droop-controlled inverters as a Kuramoto-type oscillator network. They give a
necessary and sufficient condition for a unique locally exponentially stable
synchronized solution in their model, characterize proportional power
sharing and serviceable loads under actuation limits, and add distributed
averaging integral control to restore frequency while preserving sharing
([Automatica 2013](https://doi.org/10.1016/j.automatica.2013.05.018)). The
guarantee is scoped to the paper's network and controller assumptions; it does
not survive arbitrary losses, voltage dynamics, saturation, current limiting,
delay, topology, or unmodeled converter interactions.

Dörfler, Chertkov, and Bullo provide a concise synchronization condition for a
class of nonlinear oscillator networks, exact for specified topologies and
parameter cases and empirically accurate across the tested ensembles
([PNAS 2013](https://doi.org/10.1073/pnas.1212134110)). That result is a strong
mathematical null for a bio-inspired synchronization claim. A new mechanism
must state the oscillator/network model, coupling, delay, disturbance,
saturation, and stability region, not show only phase alignment in a favorable
simulation.

### Failure and budget boundary

- Droop intentionally trades steady-state frequency or voltage error for
  decentralized sharing; a slower loop is required to restore nominal values.
- Larger gain is not free: it can interact with filters, network modes, line
  impedance, other controllers, and saturation.
- “No communication” does not mean no coupling. The energized AC network is
  the communication medium and carries real power and faults as well as phase.
- A stable synchronized equilibrium may not be reachable within converter
  current, generator power, thermal, or load-shedding limits.
- Proportional sharing is not necessarily economic, emissions-optimal, or
  secure under a line contingency.

Thus [P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation)
and P-006 already have exact engineering manifestations. The nulls are droop,
passivity/energy-function analysis, oscillator synchronization, distributed
integral control, and robust/decentralized control.

## GRID-06 — Grid-forming response is fast but not free

NERC's 2023 functional specification for bulk-system-connected grid-forming
battery energy storage evaluates whether a model behaves as a controlled
voltage source and reaches stable operating points after removal of a
synchronous source. In its example tests, GFM BESS current changed within a
quarter-cycle and active/reactive powers settled according to frequency and
voltage droop
([NERC 2023](https://www.nerc.com/globalassets/our-work/white-papers/white_paper_gfm_functional_specification.pdf)).
Those are results for the declared EMT test systems and models—not a universal
commercial response time.

The same document makes the limiting contract explicit: GFM behavior must
handle current limits and the cited industry requirements constrain inertial
response by inverter rating and energy storage. NERC's fast-frequency-response
white paper likewise shows illustrative simulations with 10 ms, 500 ms, and
1 s response delays, but states that the result requires responsive reserve
and, in its comparisons, matched MVA rating and headroom
([NERC 2020](https://www.nerc.com/globalassets/our-work/white-papers/fast-frequency-response-concepts-and-bps-reliability-needs.pdf)).

Any claimed synthetic-inertia or GFM service must publish at least

$$
\mathcal{B}_{\mathrm{GFM}}
=\left(
S_{\max}, I_{\max}, P_{\mathrm{head}}, E_{\mathrm{avail}},
T_{\mathrm{delay}}, T_{\mathrm{support}}, \mathrm{SOC}, T_{\mathrm{thermal}}
\right),
$$

with $S_{\max}$ in MVA, $I_{\max}$ in A or per unit, active-power headroom
$P_{\mathrm{head}}$ in MW, available response energy $E_{\mathrm{avail}}$ in
MJ or MWh, response delay and support duration in seconds, state of charge
dimensionless or percent, and thermal state in a declared unit/model.

The strongest nulls are conventional voltage-source converter control,
frequency/voltage droop, virtual synchronous machine, matching control,
dispatchable virtual oscillator control, explicit current limiting, and
passivity/robust stability analysis. A neural policy is credible only if it
improves the nadir/ROCOF/voltage/current/stability frontier at the **same** MVA,
current, headroom, stored energy, delay, sensing, and thermal budget.

The project mapping is P-002 plus P-006. “Subcycle reflex” is descriptive, not
novel. The physical limiter and energy source must remain outside any learned
policy's ability to redefine them.

## GRID-07 — Demand response is controlled flexibility with rebound

Schweppe et al.'s “Homeostatic Utility Control” proposed an overall supply-
demand equilibrium using distributed customer interaction, time-varying
prices, dispersed storage, and generation
([IEEE 1980](https://doi.org/10.1109/TPAS.1980.319745)). This source defeats
both the novelty of the word *homeostatic* and the idea that customer-side
feedback appeared with modern AI.

Callaway and Hiskens formalize the controllability problem for aggregated
electric loads, including heterogeneous local dynamics and the need to shape
aggregate response without violating end-use behavior
([Proceedings of the IEEE 2011](https://doi.org/10.1109/JPROC.2010.2081652)).
Palensky and Dietrich distinguish efficiency, time-of-use response, demand
response, and faster reserve services, noting that faster intervention can
impose greater unwanted effects on customer processes
([IEEE 2011](https://doi.org/10.1109/TII.2011.2158841)).

For load $j$, a minimal energy-constrained flexibility description is

$$
\Delta P_j(t)\in[\underline P_j(t),\overline P_j(t)],
\qquad
\left|\frac{d\Delta P_j}{dt}\right|\le r_j,
\qquad
\frac{1}{3600}\int_{t_0}^{t_1}\Delta P_j(t)\,dt=\Delta E_j,
$$

where $t$, $t_0$, and $t_1$ are seconds, $\Delta P_j$ is MW relative to a
declared baseline, $r_j$ is MW/s, and $\Delta E_j$ is MWh; the factor $1/3600$
converts MW-seconds to MWh. If minutes or hours are used instead, both the ramp
unit and conversion factor must change consistently. For an energy-shifting
load, $\Delta E_j$ may need to return near zero over the service horizon,
creating rebound. Comfort, temperature, process inventory, deadline, opt-out,
wear, and equity constraints must be represented separately; they cannot be
hidden inside aggregate MW.

### Information, authority, and failure boundary

- **Information path:** price, dispatch, or local frequency → aggregator or
  device policy → appliance/process actuation → aggregate meter feedback.
- **Authority:** often voluntary/contractual and bounded by customer or process
  constraints; emergency underfrequency shedding is a different, explicitly
  authorized protection action.
- **Budget:** response MW, ramp MW/s, duration h, rebound MW/MWh, communication,
  unavailable fraction, customer utility/cost, cycling/wear, and controller
  energy.
- **Failure boundary:** correlated switching, rebound peak, baseline gaming,
  opt-out, loss of communications, price oscillation, hidden process
  constraints, insufficient duration, and geographic non-deliverability.

The strongest null is not “do nothing”; it is thermostatic-load ensemble
control or aggregator MPC with randomized/localized actuation, explicit
comfort/process models, rebound accounting, and qualification telemetry.
This is [P-006](../principle-registry.md#p-006--homeostatic-negative-feedback)
with [P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation)
when local devices preserve hard constraints and expose aggregate capability
upward.

## GRID-08 — Reserve is qualified, deliverable headroom

NERC BAL-002-3 requires a Balancing Authority or Reserve Sharing Group to
return area control error to defined values following a reportable balancing
contingency event
([NERC BAL-002-3](https://www.nerc.com/standards/reliability-standards/bal/bal-002-3)).
This is an operational contract, not an abstract stock of spare megawatts.

For resource $i$ and contingency $c$, let $R_i$ be offered reserve in MW,
$A_i(c)$ its availability fraction, $L_i(c)$ its locational deliverability
fraction after the contingency, $r_i$ its ramp rate in MW/s, $T_c$ the response
deadline in seconds, and $E_i(c)$ its available energy in MWh. A deliberately
conservative usable-reserve expression is

$$
R_{\mathrm{usable}}(c,T_c)
=\sum_i
\min\!\left[
R_iA_i(c)L_i(c),
r_iT_c,
\frac{3600E_i(c)}{T_c}
\right].
$$

The factor 3600 converts MWh divided by seconds to MW. This expression is an
audit model, not a NERC formula. It exposes three reasons nameplate reserve may
be unusable: it is unavailable under the same cause, cannot reach the target
through the surviving network, cannot ramp before the deadline, or cannot
sustain the response.

The strongest control and optimization nulls are security-constrained unit
commitment/economic dispatch, contingency analysis, reserve sharing, and
robust or stochastic optimization with ramp, startup, energy, and transmission
constraints. An AI routing analogue should therefore account for spare expert
memory and compute, activation and warm-up latency, network path capacity,
energy, correlated failure, and time-to-replenish. “Twenty percent unused
capacity” has no meaning without this contract.

Reserve replenishment belongs to
[P-009](../principle-registry.md#p-009--maintenance-plane): after response, the
system must restore the ability to survive the next event. The stabilizing
response itself maps to P-006. Neither mapping requires a new registry entry.

## GRID-09 — Islanding is a constrained physical partition

Lasseter's microgrid concept treats a cluster of loads and microsources as one
controllable cell that can satisfy local objectives and present a controlled
interface to the wider system
([IEEE 2002](https://doi.org/10.1109/PESW.2002.985003)). The abstraction is
valuable, but the cell is only viable because it contains or can access
voltage-forming capacity, real/reactive balance, protection, and energy.

For an emergency partition $\Pi=\{\mathcal V_1,\ldots,\mathcal V_K\}$ of buses,
necessary but
not sufficient screening constraints include

$$
\left|
\sum_{i\in \mathcal V_k}P_i^{\mathrm{gen}}
-\sum_{j\in \mathcal V_k}P_j^{\mathrm{load}}
-P_k^{\mathrm{loss}}
\right|
\le \Delta P_k^{\mathrm{arrest}},
$$

$$
\underline v_i\le v_i\le\overline v_i,
\qquad
|S_{ij}|\le\overline S_{ij},
\qquad
\mathcal{G}_k\text{ remains synchronizable and controllable}.
$$

$P_i^{\mathrm{gen}}$, $P_j^{\mathrm{load}}$, $P_k^{\mathrm{loss}}$, and
$\Delta P_k^{\mathrm{arrest}}$ are MW; $v_i$ and its lower and upper bounds are
kV or per unit on a declared base; and $S_{ij}$ and $\overline S_{ij}$ are MVA.
$\mathcal G_k$ denotes the electrical and control model induced by bus set
$\mathcal V_k$. $\Delta P_k^{\mathrm{arrest}}$ is the island's qualified
combination of inertia, fast response, governor/droop, storage, and
shedding—not an arbitrary tolerance. Dynamic stability, transient voltage,
fault-current and protection coordination, black-start status, and load
composition remain outside a simple steady-state balance.

Sun, Zheng, and Lu use ordered binary decision diagrams to search splitting
strategies satisfying generation-load balance and transmission constraints,
explicitly confronting combinatorial explosion
([IEEE 2003](https://doi.org/10.1109/TPWRS.2003.810995)). Yang, Vittal, and
Heydt combine slow-coherency generator grouping with graph cuts, test it on a
30,000-bus/5,000-generator Eastern Interconnection model for the 2003 blackout
scenario, and use adaptive frequency-decline load shedding inside load-rich
islands
([IEEE 2006](https://doi.org/10.1109/TPWRS.2006.881126)). These are strong
graph/dynamics nulls, but remain simulation studies under their model and
scenario.

### Why partitioning can fail

- opening the proposed cutset may itself be too slow, unavailable, or
  misoperated;
- each island sees an immediate generation-load mismatch and frequency
  trajectory;
- voltage and reactive-power support are local and may be stranded on the wrong
  side;
- inverter current limits and loss of fault current can invalidate protection
  settings;
- coherent generator grouping changes with operating point and disturbance;
- load shedding that saves frequency destroys service and may remove cranking
  or communication support;
- the disconnected regions lose inter-area support and diversity; and
- later reconnection requires acceptable voltage magnitude, phase, frequency,
  and authority.

This is a concrete [P-008](../principle-registry.md#p-008--compartmentalized-interaction)
manifestation and an instance of severity-ordered containment. The strongest
null is controlled islanding or RAS with AC power-flow, transient-stability,
slow-coherency, protection, and load-shedding constraints—not generic graph
community detection. It also warns against a software analogy in which
modules can be isolated without conserving work, state, or energy.

## GRID-10 — Cascades couple fast protection to slow adaptation

The U.S.-Canada task force's final report on the August 14, 2003 blackout
identified four broad causal groups: inadequate system understanding,
inadequate situational awareness, inadequate tree trimming, and inadequate
reliability-coordinator diagnostic support. It reconstructed how alarm and
analysis deficiencies, line contacts and trips, reactive-power and voltage
conditions, flow redistribution, and subsequent protection actions became a
wide cascade
([U.S.-Canada Power System Outage Task Force 2004](https://www.nerc.com/pa/rrm/ea/Documents/August_2003_Blackout_Final_Report.pdf)).
The task force also noted that reactive reserves available at a regional level
were not necessarily useful at the stressed location because reactive power
cannot be transported arbitrarily far. This is an empirical example of the
deliverability boundary.

Dobson, Carreras, Lynch, and Newman introduced a deliberately simplified model
with slow load growth and capacity upgrade interacting with fast overload and
line-outage cascades
([HICSS 2001](https://doi.org/10.1109/HICSS.2001.926274)). Its value here is
the two-timescale hypothesis: policies that suppress small failures can alter
loading and investment so that the future risk distribution changes. The
authors' initial model was exploratory; it is not a field-validated universal
blackout law.

A cascade record must preserve the event graph rather than reduce it to final
unserved load:

```text
initiating condition
  -> physical redistribution
  -> local control/protection response
  -> topology and observability change
  -> new overload, angle, voltage, or frequency state
  -> further protection/control/human action
  -> separation, stabilization, or collapse
```

For cascade $q$, useful units include number and type of outages, MW and MWh
unserved, customers interrupted, elapsed seconds/minutes, breaker operations,
incorrect/failed operations, voltage/frequency extrema, thermal exposure, and
restoration time. An average outage count hides the tail and spatial
concentration.

The strongest nulls are dynamic security assessment, AC and dynamic
contingency simulation, protection-aware cascade models, branching-process
models with calibrated event data, and robust emergency control. The mapping
to P-006 is the disturbance-restoring loop; P-009 covers studies, settings,
vegetation, tools, drills, and corrective action that change future risk.
P-007 applies to targeted wide-area investigation only if estimator delay and
missing data are charged.

## GRID-11 — `N-1` is a declared event contract, not a universal theorem

NERC TPL-001-5.1 defines a P0 normal-system condition and multiple planning
event categories. P1 is a single contingency such as loss of one generator,
transmission circuit, transformer, shunt device, or one pole of a DC line;
later categories explicitly include stuck breakers, failure of a nonredundant
protection component, overlapping singles, and common-structure losses
([NERC TPL-001-5.1](https://www.nerc.com/globalassets/standards/reliability-standards/tpl/tpl-001-5.1.pdf)).
The table itself is evidence that “`N-1`” is not the whole security model.

Let $\mathcal C$ be the declared contingency set, $x_0$ the studied initial
condition, $\phi_c$ the post-contingency state transition including allowed
corrective actions, and $\mathcal X_{\mathrm{allow}}(c)$ the applicable
thermal, voltage, stability, and service limits. A compact criterion is

$$
\forall c\in\mathcal C:\quad
\phi_c(x_0,u_c)\in\mathcal X_{\mathrm{allow}}(c).
$$

This is dimensionless set notation. The underlying states and constraints have
physical units. The result is conditional on $x_0$, $\mathcal C$, the network
and resource model, successful protection, the availability and timing of
$u_c$, and the standard's allowed consequences. It does not cover events not
in $\mathcal C$, common causes represented incorrectly, maliciously false
data, unmodeled dynamic modes, weather-correlated failures, or the next event
before reserves and topology are restored.

The strongest null for any “anticipate one component failure” AI proposal is
contingency analysis plus security-constrained OPF or unit commitment, with
probabilistic risk assessment as a complementary comparator. Prediction alone
does not establish security; the post-contingency action must be feasible,
stable, deliverable, and authorized.

## GRID-12 — Restoration is constrained reconstruction with named authority

NERC EOP-005-3 requires each Transmission Operator to develop and implement a
restoration plan approved by its Reliability Coordinator. The plan coordinates
with the interconnection-level strategy and identifies black-start resources,
MW/MVAr characteristics, cranking paths, acceptable voltage/frequency limits,
loads needed for restoration, reconnection processes, and eventual handback to
the Balancing Authority. The standard also requires periodic verification,
black-start testing, and training
([NERC EOP-005-3](https://www.nerc.com/globalassets/standards/reliability-standards/eop/eop-005-3.pdf)).

Adibi and Fink's restoration-planning paper treats restoration as a planned
power-system operating problem rather than ad hoc switching
([IEEE 1994](https://doi.org/10.1109/59.317561)). Lindenmeyer, Dommel, and
Adibi's bibliographic survey separates active/reactive behavior, frequency and
voltage control, switching strategies, protection/local control, planning,
tools, case studies, and operator training
([IJEPES 2001](https://doi.org/10.1016/S0142-0615(00)00061-2)).

The operational sequence is roughly

```text
confirm shutdown state and authority
  -> start or confirm surviving black-start resource
  -> energize a feasible cranking path
  -> supply station service and start non-black-start units
  -> add stabilizing and priority load in controlled blocks
  -> regulate frequency, voltage, reactive power, and inrush
  -> build and synchronize islands
  -> restore wider service and transfer balancing authority
  -> replenish fuel, batteries, reserve, and protection readiness
```

Order matters. Energizing a long unloaded line can create overvoltage;
transformer inrush can challenge protection; starting a thermal unit may need
cranking power and time; adding too much load can collapse frequency; adding
too little load can also make control difficult; and communications, station
batteries, fuel, and field crews may share the initiating failure.

For restoration action $a_k$ with start time $t_k$, duration $d_k$, and
prerequisite set $\mathrm{pred}(k)$, a basic sequencing constraint is

$$
t_k\ge t_j+d_j
\quad\forall j\in\mathrm{pred}(k).
$$

$t_k$, $t_j$, $d_k$, and $d_j$ use the same declared unit—normally seconds,
minutes, or hours for the selected planning layer—and $j$ indexes every direct
predecessor of action $k$. The constraint must be joined to AC power flow,
dynamic frequency/voltage, unit startup,
crew, communication, protection, and synchronization constraints. Minimizing
only $\sum_k t_k$ or maximizing MW restored can sacrifice priority customers,
stability margin, or next-step feasibility. Metrics should include
priority-weighted MWh served, voltage/frequency violations, failed switching
attempts, unsafe energizations, operator interventions, and reserve/fuel state.

Restoration maps strongly to
[P-009](../principle-registry.md#p-009--maintenance-plane), because plans,
tests, drills, batteries, fuel, and resource verification exist outside normal
energy delivery. It maps to P-008 through island building, P-002 through local
procedures under Reliability Coordinator/Transmission Operator authority, and
P-013 through shared plans, topology, status, logs, and voice/data records.
The strongest null is mixed-integer or graph-based restoration optimization
plus tested operator runbooks and dynamic verification. It is not checkpoint
rollback and does not guarantee the exact pre-blackout dispatch or topology.

## Cross-domain deduplication against the current registry

| Registry bundle | Genuine grid manifestation | What must not be imported | Strongest non-novel null |
| --- | --- | --- | --- |
| [P-002 — local autonomy with exception escalation](../principle-registry.md#p-002--local-autonomy-with-exception-escalation) | local relay trips, governor/droop/GFM response, local microgrid control, backup and operator escalation | “local” does not mean benign; trips can propagate and settings can be wrong | protection zones and backup coordination; decentralized control; supervisory hierarchy |
| [P-006 — homeostatic negative feedback](../principle-registry.md#p-006--homeostatic-negative-feedback) | governor/droop, AVR, AGC, load response, UFLS/UVLS, reserve recovery | one scalar setpoint cannot represent angle, voltage, frequency, thermal, and service security simultaneously | classical/robust frequency and voltage control; distributed integral control; constrained MPC |
| [P-007 — prediction-error allocation](../principle-registry.md#p-007--prediction-error-allocation) | WLS residuals, bad-data processing, targeted contingency analysis, event-triggered investigation | a small residual is not truth; model-consistent attacks and topology errors can be residual-invisible | state estimation, sequential residual tests, robust estimation, value-of-information sensor placement |
| [P-008 — compartmentalized interaction](../principle-registry.md#p-008--compartmentalized-interaction) | protection zones, bus arrangements, microgrid cells, controlled islands | arbitrary graph clusters are not viable electrical islands; cut edges carry support and synchronization | zoned protection, constrained controlled islanding, microgrid control and protection |
| [P-009 — maintenance plane](../principle-registry.md#p-009--maintenance-plane) | relay settings studies, testing, misoperation correction, vegetation/tool maintenance, reserve replenishment, drills, black-start verification | maintenance is not “sleep” unless its resource, interruption, and effect are measured | asset/protection management, offline studies, operator training, restoration standards |
| [P-011 — transient communication coalitions](../principle-registry.md#p-011--transient-communication-coalitions) | contingency-specific RAS participants or dynamically selected measurement/actuator groups, if membership really changes | synchronized timestamps or a permanent WAN are not a transient coalition | event-triggered control, multicast/publish-subscribe, precomputed RAS action sets |
| [P-013 — externalized shared state](../principle-registry.md#p-013--externalized-shared-state) | SCADA/EMS state, topology, synchronized event records, restoration plans and logs; physical grid variables as a weaker common medium | frequency/voltage are transient dynamics, not durable stigmergic memory; an estimator is not ground truth | state databases, blackboards, event logs, model/version control, shared physical plant state |

### Recurrent pattern, not independent discovery

Power engineering uses the same broad operations seen in biological and other
engineering audits—local response, slower supervision, sparse escalation,
modular containment, reserve, maintenance, and staged reconstruction. That
recurrence increases experimental priority but does not demonstrate that
nature and grids independently discovered one identical mechanism. Grid
designers explicitly used control theory, cybernetics, hierarchy, redundancy,
and optimization; some even used biological terminology. The units and causal
constraints remain electrical.

### Silicon speed does not remove system latency

Electronic logic can evaluate far faster than a biological neuron, but the
controlled system pays other delays and budgets:

$$
T_{\mathrm{closed\ loop}}
=T_{\mathrm{observe}}+T_{\mathrm{compute}}+T_{\mathrm{communicate}}
+T_{\mathrm{authorize}}+T_{\mathrm{actuate}}+T_{\mathrm{plant}}.
$$

All terms are seconds. Accelerating $T_{\mathrm{compute}}$ has little value
when measurement windows, breaker travel, turbine/thermal state, energy
availability, human authority, or network dynamics dominate. Faster action can
be worse when it reduces selectivity, excites a mode, causes correlated load
rebound, saturates current, or commits to an incorrect topology. The correct
research question is not “can silicon react faster than neurons?” but “which
state, action, and validation can safely move to the fast path under a declared
physical and information budget?”

## Held residual: latency-qualified authority envelopes

### Candidate statement

Let controller $i$ at time $t$ have observation age $\tau_i(t)$ in seconds,
trust or integrity state $q_i(t)$, mode estimate $m_i(t)$, physical headroom
$b_i(t)$, and available communication/coordination state $c_i(t)$. Instead of
granting a fixed action set, define a certified authority envelope

$$
\mathcal U_i(t)
=\mathcal E_i\!\left(
\tau_i(t),q_i(t),m_i(t),b_i(t),c_i(t)
\right),
$$

and require $u_i(t)\in\mathcal U_i(t)$. As telemetry grows stale, trust is lost,
current/energy headroom falls, or coordination disappears, the envelope may
shrink to a local safe fallback. A wider or more disruptive action requires a
validated authority handoff, explicit provenance, and a postcondition that
licenses the next layer.

$\mathcal E_i$ is the proposed certified set-valued map, $\mathcal U_i(t)$ is
its admissible action set, and $u_i(t)$ is the selected physical or logical
action. Every component of $q_i$, $m_i$, $b_i$, $c_i$, and $u_i$ must declare
its unit, normalization, admissible range, timestamp, and provenance in an
implementation; the abstract notation does not make unlike quantities
commensurate.

The residual is **not** “use a hierarchy.” It is the stronger hypothesis that
continuously matching action authority to measured information quality and
remaining physical capability produces a better safety/service frontier than
fixed local rights, a monolithic global controller, or a static fallback
table.

### Exact problem

Fast local controllers have timely but narrow evidence; global controllers
have broader but delayed and attackable evidence; disruptive actions consume
irreversible service and physical headroom. Fixed authority is either too weak
for rare events or too broad when observability degrades.

### Information and authority path

```text
local sensors + device limits + clock/communication health
  -> local trust and headroom certificate
  -> admissible-action envelope
  -> local act, abstain, or escalate
  -> wider estimator/supervisor validates event and coordinates participants
  -> versioned envelope update with rollback/fallback
  -> post-event record and offline correction
```

The certificate must not be self-asserted by the same learned policy that
wants wider authority. Device limits and trip/fallback paths remain enforced
by a simpler independent mechanism.

### Nearest established nulls

- coordinated primary and backup protection;
- relay setting groups and adaptive relaying;
- RAS and system-integrity protection schemes;
- gain scheduling, hybrid and supervisory control;
- constrained and robust model-predictive control;
- control barrier functions and runtime assurance architectures;
- event-triggered distributed control; and
- black-start/restoration runbooks with named authority and prerequisites.

It remains held outside the registry because the current proposal may be only a
relabeling of these methods plus P-002/P-006/P-008/P-009 and severity-ordered
containment.

### Falsification boundary

Reject the candidate if any of the following holds:

1. a static protection/control hierarchy matches its quality, service, and
   risk after budgets are equalized;
2. a robust or constrained MPC/runtime-assurance baseline reproduces the
   dynamic envelope;
3. envelope transitions create more unsafe transients or inconsistent action
   than they prevent;
4. the trust/headroom certificate depends on the same corrupted data as the
   proposed controller with no independent check;
5. update, validation, communication, and rollback cost erase the claimed
   energy or latency benefit;
6. degraded modes silently broaden rather than shrink authority;
7. the result disappears under common-mode, topology-error, saturation, or
   communication-loss tests; or
8. gains require uncharged reserve, duplicate sensors, privileged labels,
   wider actuators, or offline oracle knowledge.

## Decisive equal-budget experiments

### Common accounting contract

Every experiment reports a vector, not a single “efficiency” score:

$$
\mathbf J=\left(
J_{\mathrm{service}},
J_{\mathrm{damage}},
J_{\mathrm{false\ action}},
J_{\mathrm{latency}},
J_{\mathrm{energy}},
J_{\mathrm{communication}},
J_{\mathrm{reserve}},
J_{\mathrm{human}},
J_{\mathrm{recovery}}
\right).
$$

The dimensions must be explicit: MW and MWh served or shed, damaged-equipment
proxy or thermal/fault exposure, unnecessary breaker operations, seconds,
joules or kWh for control hardware and communications, MW/MWh of held reserve,
operator-minutes/interventions, and seconds or hours to a declared recovered
state. A Pareto frontier is preferable to a hidden weighted sum. If a scalar is
used, weights and uncertainty intervals must be published before evaluation.

All methods receive identical:

- sensor and PMU placement, sample streams, timestamp quality, and missing-data
  process;
- communication topology, bandwidth, jitter, packet loss, and cyber controls;
- maximum actuation set and authority;
- breaker, converter, generator, load, storage, and thermal models;
- active-power headroom, current limit, response energy, and reserve duration;
- online compute hardware, memory, wall-clock deadline, and device power;
- topology and contingency information available at the decision time;
- training event count and simulator access; and
- post-event labels and offline tuning opportunities.

Evaluation uses held-out topologies, operating points, protection settings,
load compositions, inverter penetrations, fault impedances, failure
correlations, and attack strategies. Confidence intervals must be clustered by
event family and topology, not only by waveform sample.

### Test A — Local fault clearing and selectivity

**Compare:** coordinated distance/differential/overcurrent and breaker-failure
protection; conventional adaptive setting groups; a learned detector with the
same trip authority; and the candidate authority envelope.

**Events:** internal and external faults, high-resistance faults, load
encroachment, stable and unstable power swings, CT saturation, weak/inverter-
limited fault current, topology changes, stale setting group, delayed or lost
pilot signal, DC supply degradation, stuck breaker, and common-mode input
error.

**Decisive metrics:** in-zone dependability, out-of-zone security, minimum-zone
selectivity, total clearing-time distribution, fault energy
$\int v(t)i(t)\,dt$ in J where measured consistently, unnecessary MW shed,
breaker operations, IED/communication joules, and worst-case—not only mean—
performance.

**Win condition:** strict Pareto improvement over conventional adaptive
protection without using later or wider data, plus no regression on studied
hard safety cases. Faster classification alone is a loss.

### Test B — Adaptive settings and authority under observability loss

**Compare:** fixed settings, predefined setting groups, the Rockefeller-style
hierarchical adaptive null, robust supervisory/runtime-assurance control, and
the held candidate.

**Interventions:** change line/generator status, fault-current contribution,
microgrid mode, PMU/SCADA delay, topology error, clock error, partial update,
malicious measurement, and communication partition.

**Metrics:** unsafe or uncoordinated setting-seconds, false/missed trips,
version disagreement duration, rollback time, configuration traffic/energy,
operator interventions, and service lost.

**Win condition:** the dynamic envelope must shrink correctly before an unsafe
action, preserve more service than conservative fallback, and beat robust
supervision at identical certification and communication cost.

### Test C — Frequency arrest, restoration, and GFM saturation

**Compare:** synchronous-inertia/governor model, ordinary droop, established
GFM controller with current limiting, distributed secondary control, and the
candidate learned controller.

**Equalize:** MVA, pre-event MW, headroom MW, current pu, available MJ/MWh,
delay/filtering, support duration, state of charge, thermal model, and network.

**Events:** generation and load loss, islanding, phase jump, voltage dip,
unbalanced fault, weak-grid condition, consecutive disturbances before energy
recovery, and mixed vendors/controllers.

**Metrics:** ROCOF in Hz/s, nadir/zenith in Hz, voltage extrema in pu, settling
time in s, current-limit time in s, unstable/oscillatory cases, energy injected
in MJ/MWh, curtailed energy, thermal violations, and time to replenish reserve.

**Win condition:** a robust frontier improvement under saturation and
consecutive events. A result that assumes more headroom or energy is not a
controller result.

### Test D — State estimation and false-data injection

**Compare:** WLS plus residual bad-data detection, robust/LAV estimator,
temporal dynamic estimator, protected-meter placement, a learned anomaly
detector, and the candidate authority-gating layer.

**Events:** Gaussian and heavy-tailed noise, missing data, timestamp skew,
topology/parameter error, abrupt legitimate switching, $a=Hc$ attacks,
limited-meter attacks, replay, and simultaneous physical fault plus cyber
attack.

**Metrics:** voltage magnitude/angle error, unobservable-state duration,
false alarms per operating day, detection delay, attacker-induced physical
cost, compute/communication energy, abstention duration, and unsafe authorized
actions.

**Win condition:** improvement beyond robust and temporal physics baselines on
unseen attacks/topologies without rejecting legitimate switching or relying on
the final correct topology.

### Test E — Demand response and reserve deliverability

**Compare:** randomized local thermostat/load policy, aggregator MPC,
price-based response, security-constrained reserve dispatch, and a proposed
distributed policy.

**Equalize:** contracted MW, ramp, duration, energy-shift obligation, comfort or
process bounds, opt-out rate, communication, and locational network limits.

**Events:** ordinary load variation, generator loss, communication partition,
forecast error, correlated hot/cold weather, repeated calls, baseline attack,
and rebound coincident with a second contingency.

**Metrics:** delivered MW by deadline, locationally usable MW, rebound MW/MWh,
comfort/process violations, customer cost, false dispatch, reserve recovery
time, communication/compute energy, and unserved MWh.

**Win condition:** better service-risk-cost frontier through the second event,
not only the first response peak.

### Test F — Controlled islanding

**Compare:** fixed RAS cutsets, load-shedding-only baseline, OBDD/graph
partition with steady-state constraints, slow-coherency/dynamic islanding,
robust MPC, and the held candidate.

**Equalize:** available breakers, detection time, search compute, topology
knowledge, models, load-shedding authority, GFM/governor resources, and
communications.

**Events:** unseen dispatches and topologies, inaccurate dynamic model,
protection misoperation, breaker failure, low inertia, insufficient reactive
support, and consecutive contingencies during island stabilization.

**Metrics:** stable island fraction, priority-weighted MWh served, MW shed,
voltage/frequency/thermal violations, breakers operated, incorrect separation,
search and actuation time, resynchronization time, and total recovery energy.

**Win condition:** more stable service with no increase in catastrophic wrong
cuts and no oracle knowledge of the eventual coherent groups.

### Test G — Restoration and black start

**Compare:** tested operator plan, shortest/cranking-path heuristic,
mixed-integer restoration optimizer, robust/receding-horizon planner, and the
candidate authority-envelope planner.

**Equalize:** black-start resources and failure probabilities, cranking MW and
MVAr, fuel, station-battery duration, crews, communications, topology
uncertainty, switching time, dynamic simulator calls, and operator authority.

**Events:** unavailable black-start unit, failed line/breaker, stale topology,
communication loss, energization overvoltage, transformer inrush,
unsuccessful generator start, hidden load, and failed island synchronization.

**Metrics:** time to first priority load, priority-weighted MWh over the full
horizon, voltage/frequency violations, unsafe energizations, failed starts,
switching count, operator interventions, solver/communication energy, time to
Balancing Authority handback, and restored reserve/fuel margin.

**Win condition:** robust improvement over plans and optimization under hidden
failures. An oracle plan for the realized fault set is only a lower bound.

### Test H — End-to-end cascade and recovery chain

The final test combines A–G. It samples a slow operating trajectory, initiating
physical event, protection action, estimator degradation or attack, reserve
deployment, possible islanding, and restoration. The method must keep one
causal event log and charge all duplicate sensors, idle reserve, background
verification, model updates, retraining, communications, actuation, and
recovery. The candidate survives only if its advantage persists after the
complete lifecycle is charged.

## Temporary proposed evidence claims

These labels are local to this audit. They are deliberately narrower than the
section headings and should be merged or rejected before stable numbering.

| Temporary ID | Proposed claim | Status | Primary or authoritative support | Registry effect and open question |
| --- | --- | --- | --- | --- |
| C-GRID-01 | Stored-program substation protection can derive fault detection/location and issue breaker-opening commands; high-speed local digital authority is therefore an established engineering family. | established for the foundational design family | [Rockefeller 1969](https://doi.org/10.1109/TPAS.1969.292466) | supports P-002/P-008; which AI tasks have an equally crisp zone and safe actuator? |
| C-GRID-02 | Protection quality is jointly dependability, security, selectivity, and clearing performance; a fast detector alone is not a protection result. | established engineering requirement; numerical performance is scheme-specific | Rockefeller 1969; [NERC PRC-004-6](https://www.nerc.com/standards/reliability-standards/prc/prc-004-6) | prevents latency-only AI claims |
| C-GRID-03 | Online relay changes based on system/environment state and a hierarchy of frontline, substation, and remote processors were proposed before modern ML. | established historical record; field benefit remains application-specific | [Rockefeller et al. 1988](https://doi.org/10.1109/61.193943) | strong null for P-002/P-009 and authority-envelope novelty |
| C-GRID-04 | Protection defects, settings/design errors, malfunctions, and communication failures can remain latent and amplify another disturbance. | established mechanism; rates vary by system and reporting period | [Tamronglak et al. 1996](https://doi.org/10.1109/61.489327); [DOE report](https://doi.org/10.2172/32561); [NERC 2020](https://www.nerc.com/globalassets/programs/rapa/pa/nerc_sor_2020.pdf) | maintenance and independence boundary for P-009 |
| C-GRID-05 | Wide-area protection and RAS combine wider measurements with selected pre-engineered actions, but communications and broad view do not supersede local primary protection guarantees. | established architecture; exact performance scheme-specific | [Begovic et al. 2005](https://doi.org/10.1109/JPROC.2005.847258); [NERC PRC-012-2](https://www.nerc.com/standards/reliability-standards/prc/prc-012-2) | P-011 only if event-dependent membership is measured |
| C-GRID-06 | Static state estimation infers voltage state from redundant measurements and a network model under observability and error assumptions; it is not direct ground truth or a dynamic-stability guarantee. | established | [Schweppe and Wildes 1970](https://doi.org/10.1109/TPAS.1970.292678) | P-007 null; weak P-013 shared-state mapping |
| C-GRID-07 | Synchrophasors provide standardized time-referenced phasor, frequency, and ROCOF measurements; end-to-end control latency and trust require additional clock, network, concentrator, model, and actuator evidence. | established measurement standard and boundary | [Phadke et al. 1983](https://doi.org/10.1109/TPAS.1983.318043); [IEC/IEEE 60255-118-1](https://doi.org/10.1109/IEEESTD.2018.8577045) | no automatic P-011 promotion |
| C-GRID-08 | In a linear state-estimation model, attacks of the form $a=Hc$ can bias the estimated state while preserving the ordinary residual structure under the paper's access assumptions. | established theoretical construction and simulation; threat-model scoped | [Liu et al. 2009](https://doi.org/10.1145/1653662.1653666) | adversarial boundary for P-007/P-009 |
| C-GRID-09 | Frequency response composes inertia/load behavior, primary feedback, secondary restoration, and tertiary reserve/dispatch; the layers are not interchangeable. | established physical/control architecture | [Kundur et al. 2004](https://doi.org/10.1109/TPWRS.2004.825981); [NERC PFC 2019](https://www.nerc.com/comm/OC/RS_GOP_Survey_DL/PFC_Reliability_Guideline_rev20190501_v2_final.pdf) | strong P-006 null |
| C-GRID-10 | Droop-controlled sources can coordinate and share power using local electrical measurements and network coupling; synchronization guarantees remain model-, limit-, and topology-scoped. | established control family and scoped theorem | [Chandorkar et al. 1993](https://doi.org/10.1109/28.195899); [Simpson-Porco et al. 2013](https://doi.org/10.1016/j.automatica.2013.05.018) | supports P-002/P-006, not a new biological principle |
| C-GRID-11 | Fast frequency and grid-forming response must be evaluated with MVA, current limit, headroom, energy, delay, duration, state of charge, and interacting controls; it is not free software inertia. | authoritative functional guidance; individual values device/test-specific | [NERC FFR 2020](https://www.nerc.com/globalassets/our-work/white-papers/fast-frequency-response-concepts-and-bps-reliability-needs.pdf); [NERC GFM 2023](https://www.nerc.com/globalassets/our-work/white-papers/white_paper_gfm_functional_specification.pdf) | hard budget requirement for P-002/P-006 transfers |
| C-GRID-12 | Demand response is constrained load flexibility whose value depends on response, duration, availability, process/comfort cost, location, and rebound. | established control problem; availability and effect program-specific | [Callaway and Hiskens 2011](https://doi.org/10.1109/JPROC.2010.2081652); [Palensky and Dietrich 2011](https://doi.org/10.1109/TII.2011.2158841) | P-002/P-006 null; test second-event rebound |
| C-GRID-13 | Reserve is usable only when available, rampable before the deadline, sustainable, and deliverable through the surviving network. | established operational constraint; audit equation is proposed, not a standard formula | [NERC BAL-002-3](https://www.nerc.com/standards/reliability-standards/bal/bal-002-3); 2003 investigation | P-006 response plus P-009 replenishment |
| C-GRID-14 | Controlled islanding is a constrained partition requiring generator coherence, real/reactive balance, network limits, viable protection/control, and later synchronization; generic graph modularity is insufficient. | established problem; cited outcomes simulation-scoped | [Sun et al. 2003](https://doi.org/10.1109/TPWRS.2003.810995); [Yang et al. 2006](https://doi.org/10.1109/TPWRS.2006.881126) | supports P-008 and severity-ordered containment |
| C-GRID-15 | Cascading outages arise through coupled physical redistribution, protection/control actions, observability and organizational failures, and can span fast event and slow adaptation timescales. | established for event sequence; multiscale model is plausible/theoretical | [2003 Task Force report](https://www.nerc.com/pa/rrm/ea/Documents/August_2003_Blackout_Final_Report.pdf); [Dobson et al. 2001](https://doi.org/10.1109/HICSS.2001.926274) | P-006/P-009; do not infer universal criticality |
| C-GRID-16 | `N-1` security is conditional on a declared contingency set, initial state, models, limits, and corrective actions; multiple, protection-failure, and common-structure categories require additional assessment. | established authoritative scope | [NERC TPL-001-5.1](https://www.nerc.com/globalassets/standards/reliability-standards/tpl/tpl-001-5.1.pdf) | contingency analysis null; no universal resilience claim |
| C-GRID-17 | Black-start restoration is a tested and trained sequence of cranking, energization, balancing, load pickup, synchronization, and authority transfer under real/reactive and resource constraints. | established process requirement | [NERC EOP-005-3](https://www.nerc.com/globalassets/standards/reliability-standards/eop/eop-005-3.pdf); [Adibi and Fink 1994](https://doi.org/10.1109/59.317561) | P-002/P-008/P-009/P-013; strongest recovery null |
| C-GRID-18 | Dynamically restricting action authority using observation age, telemetry trust, physical headroom, and coordination state may improve service-risk tradeoffs beyond fixed hierarchies. | speculative held candidate | synthesis only; no cited source establishes the combined AI advantage | keep outside registry until Tests A–H beat supervisory/runtime-assurance nulls |

## Integration disposition

The root integrator should:

1. merge C-GRID-01 through C-GRID-17 only after checking for existing claims
   with the same mechanism and evidence scope;
2. keep C-GRID-18 as a temporary residual, not a promoted principle;
3. attach grid manifestations to P-002/P-006/P-007/P-008/P-009 and only attach
   P-011/P-013 where the distinctions above are preserved;
4. add every quantitative transfer to an experiment budget before using it in
   concept prose;
5. forbid “self-healing grid,” “software inertia,” “global ground truth,” and
   universal `N-1` language unless the scoped definition follows immediately;
6. preserve the difference between protection, control, estimation,
   contingency planning, and restoration in architecture diagrams; and
7. treat standards as authoritative requirement sources, not empirical proof
   that every compliant system survives every event.

## Complete BibTeX for sources cited in this audit

```bibtex
@article{rockefeller1969fault,
  author = {Rockefeller, G. D.},
  title = {Fault Protection with a Digital Computer},
  journal = {IEEE Transactions on Power Apparatus and Systems},
  volume = {PAS-88},
  number = {4},
  pages = {438--464},
  year = {1969},
  doi = {10.1109/TPAS.1969.292466}
}

@article{rockefeller1988adaptive,
  author = {Rockefeller, G. D. and Wagner, C. L. and Linders, J. R. and Hicks, K. L. and Rizy, D. T.},
  title = {Adaptive Transmission Relaying Concepts for Improved Performance},
  journal = {IEEE Transactions on Power Delivery},
  volume = {3},
  number = {4},
  pages = {1446--1458},
  year = {1988},
  doi = {10.1109/61.193943}
}

@article{begovic2005wide,
  author = {Begovic, Miroslav and Novosel, Damir and Karlsson, Daniel and Henville, Charlie and Michel, Gary},
  title = {Wide-Area Protection and Emergency Control},
  journal = {Proceedings of the IEEE},
  volume = {93},
  number = {5},
  pages = {876--891},
  year = {2005},
  doi = {10.1109/JPROC.2005.847258}
}

@article{schweppe1980homeostatic,
  author = {Schweppe, Fred C. and Tabors, Richard D. and Kirtley, James L., Jr. and Outhred, Hugh R. and Pickel, Fred H. and Cox, Alan J.},
  title = {Homeostatic Utility Control},
  journal = {IEEE Transactions on Power Apparatus and Systems},
  volume = {PAS-99},
  number = {3},
  pages = {1151--1163},
  year = {1980},
  doi = {10.1109/TPAS.1980.319745}
}

@techreport{nerc2016prc012,
  author = {{North American Electric Reliability Corporation}},
  title = {{PRC-012-2}: Remedial Action Schemes},
  institution = {North American Electric Reliability Corporation},
  year = {2016},
  url = {https://www.nerc.com/standards/reliability-standards/prc/prc-012-2}
}

@article{tamronglak1996anatomy,
  author = {Tamronglak, S. and Horowitz, S. H. and Phadke, A. G. and Thorp, J. S.},
  title = {Anatomy of Power System Blackouts: Preventive Relaying Strategies},
  journal = {IEEE Transactions on Power Delivery},
  volume = {11},
  number = {2},
  pages = {708--715},
  year = {1996},
  doi = {10.1109/61.489327}
}

@techreport{phadke1995anatomy,
  author = {Phadke, A. G. and Horowitz, S. H. and Thorp, J. S.},
  title = {Anatomy of Power System Blackouts and Preventive Strategies by Rational Supervision and Control of Protection Systems},
  institution = {Oak Ridge National Laboratory},
  number = {ORNL/Sub--89-SD630C/1},
  year = {1995},
  doi = {10.2172/32561}
}

@techreport{nerc2020reliability,
  author = {{North American Electric Reliability Corporation}},
  title = {2020 State of Reliability},
  institution = {North American Electric Reliability Corporation},
  year = {2020},
  url = {https://www.nerc.com/globalassets/programs/rapa/pa/nerc_sor_2020.pdf}
}

@techreport{nerc2019prc004,
  author = {{North American Electric Reliability Corporation}},
  title = {{PRC-004-6}: Protection System Misoperation Identification and Correction},
  institution = {North American Electric Reliability Corporation},
  year = {2019},
  url = {https://www.nerc.com/standards/reliability-standards/prc/prc-004-6}
}

@article{schweppe1970state,
  author = {Schweppe, Fred C. and Wildes, J.},
  title = {Power System Static-State Estimation, Part I: Exact Model},
  journal = {IEEE Transactions on Power Apparatus and Systems},
  volume = {PAS-89},
  number = {1},
  pages = {120--125},
  year = {1970},
  doi = {10.1109/TPAS.1970.292678}
}

@article{phadke1983measurement,
  author = {Phadke, A. G. and Thorp, J. S. and Adamiak, M. G.},
  title = {A New Measurement Technique for Tracking Voltage Phasors, Local System Frequency, and Rate of Change of Frequency},
  journal = {IEEE Transactions on Power Apparatus and Systems},
  volume = {PAS-102},
  number = {5},
  pages = {1025--1038},
  year = {1983},
  doi = {10.1109/TPAS.1983.318043}
}

@techreport{ieeeiec2018synchrophasor,
  author = {{IEEE} and {IEC}},
  title = {{IEC/IEEE 60255-118-1:2018}: Measuring Relays and Protection Equipment---Part 118-1: Synchrophasor for Power Systems---Measurements},
  institution = {IEEE and International Electrotechnical Commission},
  pages = {1--78},
  year = {2018},
  doi = {10.1109/IEEESTD.2018.8577045}
}

@inproceedings{liu2009false,
  author = {Liu, Yao and Ning, Peng and Reiter, Michael K.},
  title = {False Data Injection Attacks against State Estimation in Electric Power Grids},
  booktitle = {Proceedings of the 16th ACM Conference on Computer and Communications Security},
  pages = {21--32},
  year = {2009},
  publisher = {ACM},
  doi = {10.1145/1653662.1653666}
}

@article{kundur2004definition,
  author = {Kundur, Prabha and Paserba, John and Ajjarapu, Venkat and Andersson, Goran and Bose, Anjan and Canizares, Claudio and Hatziargyriou, Nikos and Hill, David and Stankovic, Alex and Taylor, Carson and Van Cutsem, Thierry and Vittal, Vijay},
  title = {Definition and Classification of Power System Stability},
  journal = {IEEE Transactions on Power Systems},
  volume = {19},
  number = {3},
  pages = {1387--1401},
  year = {2004},
  doi = {10.1109/TPWRS.2004.825981}
}

@inproceedings{milano2018lowinertia,
  author = {Milano, Federico and Dorfler, Florian and Hug, Gabriela and Hill, David J. and Verbic, Gregor},
  title = {Foundations and Challenges of Low-Inertia Systems},
  booktitle = {2018 Power Systems Computation Conference},
  pages = {1--25},
  year = {2018},
  publisher = {IEEE},
  doi = {10.23919/PSCC.2018.8450880}
}

@techreport{nerc2019pfc,
  author = {{North American Electric Reliability Corporation}},
  title = {Reliability Guideline: Primary Frequency Control},
  institution = {North American Electric Reliability Corporation},
  year = {2019},
  url = {https://www.nerc.com/comm/OC/RS_GOP_Survey_DL/PFC_Reliability_Guideline_rev20190501_v2_final.pdf}
}

@techreport{nerc2019bal003,
  author = {{North American Electric Reliability Corporation}},
  title = {{BAL-003-2}: Frequency Response and Frequency Bias Setting},
  institution = {North American Electric Reliability Corporation},
  year = {2019},
  url = {https://www.nerc.com/standards/reliability-standards/bal/bal-003-2}
}

@article{chandorkar1993parallel,
  author = {Chandorkar, Mukul C. and Divan, Deepakraj M. and Adapa, Rambabu},
  title = {Control of Parallel Connected Inverters in Standalone AC Supply Systems},
  journal = {IEEE Transactions on Industry Applications},
  volume = {29},
  number = {1},
  pages = {136--143},
  year = {1993},
  doi = {10.1109/28.195899}
}

@article{simpsonporco2013droop,
  author = {Simpson-Porco, John W. and Dorfler, Florian and Bullo, Francesco},
  title = {Synchronization and Power Sharing for Droop-Controlled Inverters in Islanded Microgrids},
  journal = {Automatica},
  volume = {49},
  number = {9},
  pages = {2603--2611},
  year = {2013},
  doi = {10.1016/j.automatica.2013.05.018}
}

@article{dorfler2013synchronization,
  author = {Dorfler, Florian and Chertkov, Michael and Bullo, Francesco},
  title = {Synchronization in Complex Oscillator Networks and Smart Grids},
  journal = {Proceedings of the National Academy of Sciences},
  volume = {110},
  number = {6},
  pages = {2005--2010},
  year = {2013},
  doi = {10.1073/pnas.1212134110}
}

@techreport{nerc2023gfm,
  author = {{North American Electric Reliability Corporation}},
  title = {Grid Forming Functional Specifications for BPS-Connected Battery Energy Storage Systems},
  institution = {North American Electric Reliability Corporation},
  year = {2023},
  url = {https://www.nerc.com/globalassets/our-work/white-papers/white_paper_gfm_functional_specification.pdf}
}

@techreport{nerc2020ffr,
  author = {{North American Electric Reliability Corporation}},
  title = {Fast Frequency Response Concepts and Bulk Power System Reliability Needs},
  institution = {North American Electric Reliability Corporation},
  year = {2020},
  url = {https://www.nerc.com/globalassets/our-work/white-papers/fast-frequency-response-concepts-and-bps-reliability-needs.pdf}
}

@article{callaway2011loads,
  author = {Callaway, Duncan S. and Hiskens, Ian A.},
  title = {Achieving Controllability of Electric Loads},
  journal = {Proceedings of the IEEE},
  volume = {99},
  number = {1},
  pages = {184--199},
  year = {2011},
  doi = {10.1109/JPROC.2010.2081652}
}

@article{palensky2011demand,
  author = {Palensky, Peter and Dietrich, Dietmar},
  title = {Demand Side Management: Demand Response, Intelligent Energy Systems, and Smart Loads},
  journal = {IEEE Transactions on Industrial Informatics},
  volume = {7},
  number = {3},
  pages = {381--388},
  year = {2011},
  doi = {10.1109/TII.2011.2158841}
}

@techreport{nerc2018bal002,
  author = {{North American Electric Reliability Corporation}},
  title = {{BAL-002-3}: Disturbance Control Standard---Contingency Reserve for Recovery from a Balancing Contingency Event},
  institution = {North American Electric Reliability Corporation},
  year = {2018},
  url = {https://www.nerc.com/standards/reliability-standards/bal/bal-002-3}
}

@inproceedings{lasseter2002microgrids,
  author = {Lasseter, Robert H.},
  title = {MicroGrids},
  booktitle = {2002 IEEE Power Engineering Society Winter Meeting},
  volume = {1},
  pages = {305--308},
  year = {2002},
  publisher = {IEEE},
  doi = {10.1109/PESW.2002.985003}
}

@article{sun2003splitting,
  author = {Sun, Kai and Zheng, Da-Zhong and Lu, Qiang},
  title = {Splitting Strategies for Islanding Operation of Large-Scale Power Systems Using OBDD-Based Methods},
  journal = {IEEE Transactions on Power Systems},
  volume = {18},
  number = {2},
  pages = {912--923},
  year = {2003},
  doi = {10.1109/TPWRS.2003.810995}
}

@article{yang2006islanding,
  author = {Yang, Bo and Vittal, Vijay and Heydt, Gerald T.},
  title = {Slow-Coherency-Based Controlled Islanding---A Demonstration of the Approach on the August 14, 2003 Blackout Scenario},
  journal = {IEEE Transactions on Power Systems},
  volume = {21},
  number = {4},
  pages = {1840--1847},
  year = {2006},
  doi = {10.1109/TPWRS.2006.881126}
}

@techreport{uscanada2004blackout,
  author = {{U.S.-Canada Power System Outage Task Force}},
  title = {Final Report on the August 14, 2003 Blackout in the United States and Canada: Causes and Recommendations},
  institution = {U.S. Department of Energy and Natural Resources Canada},
  year = {2004},
  url = {https://www.nerc.com/pa/rrm/ea/Documents/August_2003_Blackout_Final_Report.pdf}
}

@inproceedings{dobson2001initial,
  author = {Dobson, Ian and Carreras, Benjamin A. and Lynch, Vickie E. and Newman, David E.},
  title = {An Initial Model for Complex Dynamics in Electric Power System Blackouts},
  booktitle = {Proceedings of the 34th Annual Hawaii International Conference on System Sciences},
  year = {2001},
  publisher = {IEEE},
  doi = {10.1109/HICSS.2001.926274}
}

@techreport{nerc2022tpl001,
  author = {{North American Electric Reliability Corporation}},
  title = {{TPL-001-5.1}: Transmission System Planning Performance Requirements},
  institution = {North American Electric Reliability Corporation},
  year = {2022},
  url = {https://www.nerc.com/globalassets/standards/reliability-standards/tpl/tpl-001-5.1.pdf}
}

@techreport{nerc2018eop005,
  author = {{North American Electric Reliability Corporation}},
  title = {{EOP-005-3}: System Restoration from Blackstart Resources},
  institution = {North American Electric Reliability Corporation},
  year = {2018},
  url = {https://www.nerc.com/globalassets/standards/reliability-standards/eop/eop-005-3.pdf}
}

@article{adibi1994restoration,
  author = {Adibi, M. M. and Fink, L. H.},
  title = {Power System Restoration Planning},
  journal = {IEEE Transactions on Power Systems},
  volume = {9},
  number = {1},
  pages = {22--28},
  year = {1994},
  doi = {10.1109/59.317561}
}

@article{lindenmeyer2001restoration,
  author = {Lindenmeyer, D. and Dommel, H. W. and Adibi, M. M.},
  title = {Power System Restoration---A Bibliographical Survey},
  journal = {International Journal of Electrical Power \& Energy Systems},
  volume = {23},
  number = {3},
  pages = {219--227},
  year = {2001},
  doi = {10.1016/S0142-0615(00)00061-2}
}
```

## Audit verdict

Power systems contribute unusually concrete discipline to this project:
every “intelligent” action must say what it sensed, how old and trustworthy the
state was, which physical component it could command, how quickly the plant
could respond, what reserve and energy were consumed, which failure model the
guarantee covered, and who or what authorized the next layer.

That discipline largely deduplicates into the current registry and mature
engineering. The held authority-envelope candidate is worth testing because it
forces information quality and physical headroom into the action-rights model.
It is not yet evidence for a new AI principle, and it should be discarded if
standard protection coordination, robust supervisory control, or restoration
planning matches it under the same budget.

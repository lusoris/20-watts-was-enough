# Engineering analogue audit

**Date:** 2026-08-05  
**Scope:** control and decision theory, operations research, distributed
systems, adaptive routing, computer architecture, and thermodynamics  
**Purpose:** prevent the project from presenting established engineering
patterns as biologically inspired novelty.

## Executive finding

The abstract forms of nearly all current `P-` principles have established
engineering analogues. That is useful: these analogues supply strong baselines,
formal objectives, stability conditions, and units. Biological evidence may
still motivate a better **mechanism**, **coupling between mechanisms**, or
**operating regime**, but it does not make the abstract pattern new.

The audit assigns three dispositions:

- **established analogue:** the proposed invariant is already a standard
  engineering pattern at its present level of abstraction;
- **partial analogue:** engineering captures part of the loop, while a stated
  biological mechanism remains outside the baseline; and
- **discriminating opportunity:** a difference is concrete enough to test. It
  is not a novelty claim until it beats the engineering baseline.

| Principle | Closest engineering body | Audit disposition |
| --- | --- | --- |
| [P-001](../principle-registry.md#p-001--selective-allocation) | constrained utility allocation; multi-armed bandits | established analogue |
| [P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation) | local state estimation plus innovation-triggered escalation; hierarchical routing | partial analogue |
| [P-003](../principle-registry.md#p-003--temporary-trace-before-commitment) | sequential change detection; snapshots and caches | partial analogue |
| [P-004](../principle-registry.md#p-004--diversity-selection-and-protection) | bandit exploration and allocation; replicated fault tolerance | partial analogue |
| [P-005](../principle-registry.md#p-005--use-dependent-topology) | adaptive routing and congestion control | discriminating opportunity if topology itself changes |
| [P-006](../principle-registry.md#p-006--homeostatic-negative-feedback) | feedback control; primal/dual rate control | established analogue |
| [P-007](../principle-registry.md#p-007--prediction-error-allocation) | innovations, value of information, sequential tests | established analogue |
| [P-008](../principle-registry.md#p-008--compartmentalized-interaction) | partitioning, areas, sharding, and hierarchical memory | established pattern; boundary learning remains open |
| [P-009](../principle-registry.md#p-009--maintenance-plane) | checkpointing, control planes, recovery, garbage collection | established pattern; learned lifecycle policy remains open |
| [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design) | cache/layout specialization and hardware–software co-design | established analogue |
| [P-011](../principle-registry.md#p-011--transient-communication-coalitions) | time-aware gates and scheduled fabrics | established analogue at the scheduling level |
| [P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime) | storage hierarchies, cache replacement, and explicit expiry | established pattern; semantic promotion remains open |
| [P-013](../principle-registry.md#p-013--externalized-shared-state) | replicated state machines, link-state databases, blackboards | established analogue |

## Formal reference points

These twelve primary papers or authoritative standards form the audit set.
They are reference points, not a claim that the associated fields have been
exhaustively reviewed.

1. R. E. Kalman, “A New Approach to Linear Filtering and Prediction
   Problems,” *Journal of Basic Engineering* 82(1), 35–45 (1960),
   [doi:10.1115/1.3662552](https://doi.org/10.1115/1.3662552). The canonical
   state-space estimator and innovation update; relevant to P-002, P-006, and
   P-007.
2. Ronald A. Howard, “Information Value Theory,” *IEEE Transactions on Systems
   Science and Cybernetics* 2(1), 22–26 (1966),
   [doi:10.1109/TSSC.1966.300074](https://doi.org/10.1109/TSSC.1966.300074).
   Makes information valuable through changed decisions and utility, not
   surprise alone; relevant to P-001, P-007, and P-012.
3. E. S. Page, “Continuous Inspection Schemes,” *Biometrika* 41(1–2), 100–115
   (1954),
   [doi:10.1093/biomet/41.1-2.100](https://doi.org/10.1093/biomet/41.1-2.100).
   A foundational cumulative sequential change detector; relevant to P-003
   and P-007.
4. T. L. Lai and Herbert Robbins, “Asymptotically Efficient Adaptive
   Allocation Rules,” *Advances in Applied Mathematics* 6(1), 4–22 (1985),
   [doi:10.1016/0196-8858(85)90002-8](https://doi.org/10.1016/0196-8858(85)90002-8).
   Formalizes adaptive allocation under uncertain rewards and asymptotic
   regret; relevant to P-001 and P-004.
5. F. P. Kelly, A. K. Maulloo, and D. K. H. Tan, “Rate Control for
   Communication Networks: Shadow Prices, Proportional Fairness and
   Stability,” *Journal of the Operational Research Society* 49(3), 237–252
   (1998), [doi:10.2307/3010473](https://doi.org/10.2307/3010473). Gives
   decentralized primal/dual congestion controllers with a system objective
   and stability argument; relevant to P-001, P-005, and P-006.
6. J. Moy, “OSPF Version 2,” Internet Standard STD 54 / RFC 2328 (1998),
   [doi:10.17487/RFC2328](https://doi.org/10.17487/RFC2328). Specifies
   replicated link-state databases, flooding, aging, areas, failure detection,
   and shortest-path recomputation; relevant to P-002, P-005, P-008, and
   P-013.
7. K. Mani Chandy and Leslie Lamport, “Distributed Snapshots: Determining
   Global States of Distributed Systems,” *ACM Transactions on Computer
   Systems* 3(1), 63–75 (1985),
   [doi:10.1145/214451.214456](https://doi.org/10.1145/214451.214456). Shows
   how a consistent global state can be captured without stopping an
   asynchronous computation; relevant to P-003, P-009, and P-013.
8. Miguel Castro and Barbara Liskov, “Practical Byzantine Fault Tolerance,”
   *OSDI ’99*, 173–186 (1999),
   [USENIX proceedings](https://www.usenix.org/conference/osdi-99/presentation/practical-byzantine-fault-tolerance),
   [doi:10.1145/296806.296824](https://doi.org/10.1145/296806.296824).
   A replicated-state-machine baseline under arbitrary faults; relevant to
   P-004, P-009, and P-013.
9. IEEE, “802.1Qbv-2015 — Enhancements for Scheduled Traffic,” subsequently
   incorporated into IEEE 802.1Q,
   [official project page](https://www.ieee802.org/1/pages/802.1bv.html).
   Specifies time-aware queue gates driven by a common time base; relevant to
   P-011.
10. R. L. Mattson, J. Gecsei, D. R. Slutz, and I. L. Traiger, “Evaluation
    Techniques for Storage Hierarchies,” *IBM Systems Journal* 9(2), 78–117
    (1970), [doi:10.1147/sj.92.0078](https://doi.org/10.1147/sj.92.0078).
    Introduces stack processing and exact access-frequency/miss-ratio
    evaluation across hierarchy sizes; relevant to P-010 and P-012.
11. Mark Horowitz, “Computing’s Energy Problem (and What We Can Do About It),”
    *ISSCC 2014*, 10–14,
    [doi:10.1109/ISSCC.2014.6757323](https://doi.org/10.1109/ISSCC.2014.6757323).
    Separates arithmetic, storage, and movement energy and motivates
    specialization; relevant to P-001 and P-010. Its numerical operation costs
    are technology-specific historical measurements, not reusable constants.
12. Rolf Landauer, “Irreversibility and Heat Generation in the Computing
    Process,” *IBM Journal of Research and Development* 5(3), 183–191 (1961),
    [doi:10.1147/rd.53.0183](https://doi.org/10.1147/rd.53.0183). Establishes
    the thermodynamic connection between logical irreversibility and heat;
    relevant to P-010 and to the project’s energy accounting boundary.

## Shared equations and units

Four equations should be treated as engineering null models.

### Estimation residual

For the linear system

$$
x_t = A x_{t-1} + w_t, \qquad y_t = Hx_t + v_t,
$$

the Kalman innovation is

$$
r_t = y_t - H\hat{x}_{t|t-1}.
$$

$x_t$ is state in domain-specific units, $y_t$ is the observation, $A$ and
$H$ are transition and observation operators, $w_t$ and $v_t$ are process and
measurement noise, and $r_t$ has the units of $y_t$. An “unexpected event”
router must outperform a calibrated residual or normalized innovation test,
not an unconditional-compute baseline alone.

### Value of information

For action $a$, uncertain state $\theta$, utility $U$, and candidate
observation $Z$, the expected value of sample information is

$$
\operatorname{EVSI}(Z) =
\mathbb{E}_{Z}\!\left[\max_a \mathbb{E}[U(a,\theta)\mid Z]\right]
- \max_a \mathbb{E}[U(a,\theta)].
$$

EVSI has the same unit as utility. A sensor action, memory lookup, additional
layer, or human query is rational when EVSI exceeds its full acquisition cost
after both are expressed in a common utility or constrained optimization.
Entropy reduction alone is not enough.

### Sequential change accumulation

For observations with pre-change density $f_0$ and post-change density $f_1$,
a Page-style cumulative statistic is

$$
g_t = \max\!\left(0, g_{t-1} +
\log \frac{f_1(y_t)}{f_0(y_t)}\right),
\qquad \tau = \inf\{t:g_t\ge h\}.
$$

$g_t$ and threshold $h$ are dimensionless log-likelihood ratios; $\tau$ is in
samples or seconds. A proposed temporary trace must distinguish itself from
this cheap accumulate–reset–commit loop.

### Constrained allocation and energy

Kelly-style allocation can be written

$$
\max_{x\ge 0}\sum_i U_i(x_i)
\quad\text{subject to}\quad Rx\le c,
$$

where $x_i$ is allocation in requests/s, tokens/s, bit/s, or another declared
rate; $R$ is a dimensionless resource-incidence matrix; $c$ is capacity in the
same rate units; and $U_i$ is declared utility. The system energy boundary is

$$
E_{\mathrm{total}} = E_{\mathrm{arithmetic}} + E_{\mathrm{memory}}
+ E_{\mathrm{network}} + E_{\mathrm{control}} + E_{\mathrm{idle}},
$$

with every term measured in joules over the same interval. Power is energy per
time in watts. The Landauer floor $k_B T\ln 2$ joules applies to erasing one bit
at temperature $T$ kelvin; it is not a lower bound for a model inference, a
multiply, or moving a byte through a real hierarchy.

## Principle-by-principle crosswalk

### P-001 — Selective allocation

- **Closest mathematical analogue.** Constrained utility maximization selects
  rates under capacity, while multi-armed bandits allocate trials among
  uncertain alternatives to control regret. Top-$k$ routing is one discrete
  policy inside this already-established problem class.
- **Biological detail not captured.** Inhibitory competition, metabolic
  coupling, physical clonal expansion/contraction, and activity-dependent
  capacity growth have lifecycle costs not represented by a static arm or
  flow.
- **Baseline to beat.** Proportional-fair primal/dual rate control plus a
  Lai–Robbins-style confidence-index allocator when rewards are uncertain.
- **Variables and units.** Reward or task utility per request; allocation
  requests/s; capacity tokens/s or bit/s; queue occupancy requests; p50/p99
  latency ms; control traffic byte/s; energy J/request; cumulative regret in
  utility units.
- **Minimal discriminating experiment.** Replay the same nonstationary expert
  demand trace through (a) proportional-fair allocation, (b) bandit allocation,
  and (c) the proposed inhibitory top-$k$ router. Match total capacity and
  exploration budget. A biological mechanism matters only if it improves the
  quality–energy–tail-latency frontier or recovers faster after a regime shift.

### P-002 — Local autonomy with exception escalation

- **Closest mathematical analogue.** A local observer predicts state and sends
  an exception when its normalized innovation crosses a threshold. Hierarchical
  routing areas likewise keep most state and recomputation local while
  summarizing information across boundaries.
- **Biological detail not captured.** Dendritic nonlinear subunits and embodied
  arm controllers act on continuous local dynamics and may alter the input
  they subsequently observe. A packet router or linear observer does not model
  that closed sensorimotor loop.
- **Baseline to beat.** Local Kalman filters with innovation-triggered central
  escalation; for networked modules, fixed hierarchy with OSPF-style area
  summaries and a central fallback.
- **Variables and units.** Residual in sensor units and normalized residual
  dimensionless; escalation events/s; payload byte/event; local and global
  response latency ms; missed-event probability; false-escalation probability;
  energy J/event.
- **Minimal discriminating experiment.** Give local controllers identical
  sensors and actuation on a disturbance benchmark. Sweep the escalation
  threshold for both the proposed mechanism and the innovation baseline.
  Compare closed-loop loss, missed hazards, bytes transmitted, and joules.

### P-003 — Temporary trace before commitment

- **Closest mathematical analogue.** Page’s statistic is a cheap reversible
  trace that accumulates evidence, resets when evidence reverses, and triggers
  a costly action only at a threshold. A distributed snapshot is a different
  analogue: a temporary consistent record created while execution continues.
- **Biological detail not captured.** A synaptic eligibility trace assigns
  delayed credit to a specific earlier interaction; CUSUM detects distribution
  change but does not solve causal credit assignment. Plant priming also changes
  future response readiness rather than merely raising an alarm.
- **Baseline to beat.** Page/CUSUM change detection plus an ordinary recency
  cache or consistent snapshot. If the task is delayed credit, include a
  conventional exponential eligibility trace separately.
- **Variables and units.** Trace amplitude or log-likelihood dimensionless;
  decay time s or steps; detection delay samples or s; false alarms/hour;
  durable writes/event; retained byte; rollback latency ms; J/trace update.
- **Minimal discriminating experiment.** Generate events with independently
  controlled recurrence, delayed reward, and distribution change. Compare
  CUSUM, recency/eligibility baselines, and the proposed trace. This separates
  change detection, content retention, and delayed credit instead of rewarding
  one mechanism for conflated tasks.

### P-004 — Diversity, selection, and protection

- **Closest mathematical analogue.** Bandit allocation formalizes generating
  observations across candidates and concentrating resources on winners;
  replicated fault-tolerant systems preserve service by maintaining diverse
  copies and quorums. Neither alone captures the full proposed lifecycle.
- **Biological detail not captured.** Mutation of candidate structure,
  lineage-dependent variation rates, clonal expansion/contraction, and a
  transition from exploration to protected consolidation are absent from a
  fixed-arm bandit and identical replicas.
- **Baseline to beat.** Confidence-index bandit allocation with restarts under
  detected nonstationarity; PBFT-style replication for claims about protection
  from arbitrary component faults.
- **Variables and units.** Candidate count; trials/candidate; mutation or edit
  operations/step; cumulative regret; validation utility; replicas; tolerated
  faults; recovery time s; stored byte; training and recovery energy J.
- **Minimal discriminating experiment.** Under a fixed compute and storage
  budget, compare the proposed lineage/selection schedule to confidence-index
  allocation with change-triggered restarts. Introduce both task shifts and
  component faults. Report regret, diversity, rollback success, recovery time,
  and energy; do not use pruning percentage as the outcome.

### P-005 — Use-dependent topology

- **Closest mathematical analogue.** Kelly controllers adapt rates and can
  include routing control; OSPF floods changed link state and recomputes
  shortest paths. These alter traffic and route choice over a mostly given
  graph. They are **not mathematically equivalent** to creating and deleting
  capacity as a function of useful flow.
- **Biological detail not captured.** Reinforcement and decay of the substrate
  itself, hysteresis, exploratory growth, reversible regrowth, and the energy
  cost of keeping an unused path viable.
- **Baseline to beat.** OSPF equal-cost multipath or shortest-path routing with
  Kelly-style congestion control; add a conventional dynamic edge-weight
  optimizer before claiming topology novelty.
- **Variables and units.** Active vertices/edges; edge capacity bit/s; edge
  weight s, J/byte, or declared cost; rewirings/hour; byte-hops; delivered
  utility/s; failure recovery s; idle-path power W; topology-update energy J.
- **Minimal discriminating experiment.** On identical dynamic demand and link
  failure traces, compare (a) fixed graph plus adaptive flows/weights, (b)
  periodic graph re-optimization, and (c) reinforcement–decay with exploration.
  Charge for edge creation, state migration, idle reserve, and recovery. A gain
  only against static shortest paths is insufficient.

### P-006 — Homeostatic negative feedback

- **Closest mathematical analogue.** Feedback control changes an input from
  measured deviation; Kelly’s primal/dual dynamics use congestion prices to
  converge toward a constrained system optimum, with a Lyapunov stability
  argument. “Slower loop stabilizes a faster loop” is standard multirate and
  supervisory control at the current abstraction level.
- **Biological detail not captured.** Multiple interacting viability ranges,
  component-specific set points, metaplasticity, and slow structural changes
  that modify the controller itself.
- **Baseline to beat.** Tuned proportional–integral or primal/dual resource
  controller with anti-windup and explicit delay handling.
- **Variables and units.** Controlled activity requests/s or activations/s;
  set point in the same unit; settling time s; overshoot percent; oscillation
  frequency Hz; constraint violations/s; utilization percent; J/control update.
- **Minimal discriminating experiment.** Apply step, ramp, burst, and delayed
  loads to identical modules. Compare the proposed homeostat with tuned PI and
  Kelly-style feedback at matched telemetry and actuation rates. Measure
  stability margin, recovery, quality, and controller energy.

### P-007 — Prediction-error allocation

- **Closest mathematical analogue.** Kalman innovations quantify residual
  evidence; Page accumulates evidence for a regime change; Howard’s value of
  information buys a measurement only when its expected decision improvement
  exceeds cost. Together these are a strong null model for “compute where
  uncertainty remains.”
- **Biological detail not captured.** Active sensing changes the world–sensor
  geometry; biological prediction errors can be hierarchical, modality
  specific, and coupled to action and learning. Residual magnitude, epistemic
  uncertainty, novelty, and expected utility remain distinct.
- **Baseline to beat.** Calibrated residual/change detector feeding a one-step
  expected-value-of-information policy for extra layer, sensor, lookup, or
  query acquisition.
- **Variables and units.** Residual in observation units; normalized innovation
  and log likelihood dimensionless; predictive NLL nat/item or bit/item;
  acquisition count/item; latency ms; information payload bit; energy J/item;
  downstream utility in declared task units.
- **Minimal discriminating experiment.** Give all policies the same menu of
  priced compute and sensor actions. Compare fixed compute, residual threshold,
  one-step EVSI, and the proposed biological router on calibrated easy, noisy,
  ambiguous, and adversarial cases. Plot utility against joules and latency;
  require gains over EVSI, not just fixed compute.

### P-008 — Compartmentalized interaction

- **Closest mathematical analogue.** OSPF areas bound detailed topology
  exchange and summarize across area boundaries; sharding and hierarchical
  memory similarly restrict routine interactions. The general cost is a graph
  partition objective balancing cut traffic, local capacity, and failure
  isolation.
- **Biological detail not captured.** Nonlinear dendritic computations inside a
  cell, typed inhibitory circuits, embodied segment dynamics, and plastic
  compartment boundaries are not represented by a fixed administrative area.
- **Baseline to beat.** Static graph partitioning/sharding with typed APIs and
  OSPF-style hierarchical summaries; include a monolith as a reference, not as
  the only competitor.
- **Variables and units.** Cut traffic byte/s; local-state byte; cross-boundary
  calls/s; service latency ms; interference as task-loss change; fault blast
  radius modules; repartition migrations and migrated byte; J/request.
- **Minimal discriminating experiment.** Train or operate matched modular tasks
  under a fixed communication budget. Compare learned compartments to static
  partitions optimized from the same trace. Shift task correlations halfway
  through; measure interference, transfer, repartition cost, and energy.

### P-009 — Maintenance plane

- **Closest mathematical analogue.** Chandy–Lamport records a consistent state
  without stopping task execution; replicated services checkpoint, recover,
  change views, and discard old protocol state. Operating systems and networks
  routinely separate data and control/maintenance paths.
- **Biological detail not captured.** Glial metabolic support and circuit
  modulation, replay-selected memory transformation, sleep-state global
  coordination, and repair policies learned across multiple timescales.
- **Baseline to beat.** Periodic or incremental snapshots plus health monitor,
  checkpoint garbage collection, and PBFT-style recovery when arbitrary faults
  are in scope.
- **Variables and units.** Checkpoint interval s; snapshot byte; control traffic
  byte/s; pause time ms; mean time to recovery s; lost work request or joule;
  stale-state probability; maintenance power W; service availability percent.
- **Minimal discriminating experiment.** Subject a stateful continual learner to
  component faults, memory pressure, and distribution drift. Give periodic,
  load-adaptive, and proposed maintenance policies the same average power and
  storage budget. Compare availability, retained quality, rollback loss, and
  total energy over the full run.

### P-010 — Structural offloading and co-design

- **Closest mathematical analogue.** Cache and storage hierarchy design place
  frequently reused state near compute; compilation and specialization move
  recurring work into fixed execution/data paths. Horowitz’s accounting shows
  why data movement and generality costs matter. This is established
  hardware–software co-design.
- **Biological detail not captured.** A body or dendritic structure develops
  while interacting with its task and may continue remodeling. Conventional
  compilation usually assumes a specified workload and discrete deployment
  boundary.
- **Baseline to beat.** Profile-guided compilation, operator fusion, cache-aware
  layout, quantization, and a specialized accelerator or near-memory kernel
  where applicable.
- **Variables and units.** Arithmetic operations/item; DRAM, cache, and network
  byte/item; cache miss ratio; wall energy J/item; rail power W; latency ms;
  silicon area mm² where hardware changes; compilation/reconfiguration energy J
  amortized over useful items.
- **Minimal discriminating experiment.** Run one stable and one shifting
  workload through generic execution, profile-guided static specialization,
  and reversible structural adaptation. Measure end-to-end energy at the same
  system boundary, including profiling, migration, recompilation, and rollback.

### P-011 — Transient communication coalitions

- **Closest mathematical analogue.** IEEE 802.1Qbv uses a time-indexed gate
  $g_q(t)\in\{0,1\}$ for each egress queue $q$, creating scheduled
  communication windows while other traffic is blocked or shaped. At this
  abstraction level, time-dependent effective connectivity is not new.
- **Biological detail not captured.** Endogenous phase formation, multiple
  simultaneous frequency bands, synchronization without a single precise
  clock, rapid coalition learning, and phase-dependent computation rather than
  packet eligibility alone.
- **Baseline to beat.** Offline-optimized fixed TDMA/802.1Qbv gate schedule plus
  a work-conserving priority scheduler for unscheduled traffic.
- **Variables and units.** Cycle and gate interval µs; clock error ns or µs;
  throughput bit/s; deadline miss percent; latency and jitter µs; link
  utilization percent; rescheduling time ms; synchronization and switching
  energy J/s.
- **Minimal discriminating experiment.** Use a workload whose communicating
  module coalitions change at controlled rates. Compare fixed time-aware gates,
  periodic schedule re-optimization, and learned transient windows. Charge for
  clocking and schedule updates; report deadlines, utilization, adaptation
  delay, and energy.

### P-012 — Memory matched to information lifetime

- **Closest mathematical analogue.** Storage hierarchies already trade access
  frequency, capacity, latency, and cost across media; Mattson stack processing
  supplies exact miss-ratio curves for a class of policies. TTL expiry and
  tiering add explicit lifetime. The project’s principle is broader only if it
  learns semantic promotion, provenance, and mutation policy beyond locality.
- **Biological detail not captured.** Episodic-to-semantic transformation,
  reconsolidation, content-dependent forgetting, immune lineage persistence,
  and promotion based on future behavioral utility rather than reuse alone.
- **Baseline to beat.** LRU/stack-policy hierarchy with size tuned from the
  miss-ratio curve, explicit TTL, and an oracle-lifetime upper bound.
- **Variables and units.** Object lifetime s; inter-access time s; update rate
  writes/s; tier capacity byte; hit/miss percent; access latency ms; stale read
  percent; migrated byte; retention utility; storage and movement J/object.
- **Minimal discriminating experiment.** Generate objects whose access
  frequency, truth lifetime, provenance value, and task utility can vary
  independently. Compare LRU+TTL, oracle lifetime, and proposed promotion and
  expiry. This reveals whether it learns information lifetime rather than
  merely caching popularity.

### P-013 — Externalized shared state

- **Closest mathematical analogue.** OSPF nodes coordinate through a flooded,
  aged link-state database; replicated state machines coordinate clients and
  replicas through ordered durable state; snapshots capture consistent shared
  state across asynchronous channels. Digital blackboards and logs are direct,
  long-established instances of the invariant.
- **Biological detail not captured.** Pheromone state is spatial, anonymous,
  low precision, locally sensed, and physically decaying. Digital state can be
  exact, globally addressed, attributable, access-controlled, and replicated;
  discarding those advantages needs evidence.
- **Baseline to beat.** Versioned shared key–value or append-only state with
  explicit consistency; PBFT replication when arbitrary faults are claimed,
  or OSPF-style reliable flooding and aging for topology dissemination.
- **Variables and units.** State byte; read/write operations/s; direct and
  control traffic byte/s; propagation/convergence latency ms; stale-read
  percent; conflicting writes; replicas and tolerated faults; storage J/day and
  operation J/request.
- **Minimal discriminating experiment.** Have many modules solve a coordination
  task using pairwise broadcast, a versioned replicated store, and a decaying
  stigmergic workspace. Match storage and network budgets. Vary agent churn and
  faults; measure solution utility, convergence, traffic, inconsistency, and
  energy. “Fewer pairwise messages than broadcast” is not enough if the store
  pays equivalent replication traffic.

## Required novelty gate for future architecture claims

Before calling a mechanism biologically inspired or novel, an experiment
proposal should answer all five questions:

1. **Which engineering null model applies?** Name an algorithm or system from
   this audit, not merely “dense baseline” or “standard AI.”
2. **Which state transformation differs?** A biological name, organism, or
   metaphor is not a difference.
3. **Which cost is added?** Include sensing, control traffic, state migration,
   synchronization, maintenance, idle reserve, and reconfiguration.
4. **Which unit-bearing prediction distinguishes it?** State a direction and a
   measurement such as joules/item, byte/item, false alarms/hour, recovery
   seconds, or regret.
5. **What result would collapse it back into known engineering?** If a tuned
   control, allocation, caching, routing, or replication baseline matches it,
   retain the biological observation as explanatory evidence but remove the
   architecture novelty claim.

The strongest near-term research opportunity is therefore not another list of
natural metaphors. It is a factorial experiment over mechanisms that standard
engineering usually studies separately: uncertainty-priced allocation,
reversible topology adaptation, lifetime-aware memory, scheduled
communication, and an explicit maintenance plane—measured with a single
end-to-end energy and failure boundary.

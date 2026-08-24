# Operating systems, distributed consistency, recovery, and measurement depth

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-24
- **Scope:** operating-system resource boundaries; distributed authority,
  consistency, timing, and fault models; retry and external-effect semantics;
  checkpoint/log/replay recovery; empirical workload and tail-latency
  measurement; fault-schedule and artifact provenance.
- **Question:** which systems principles add a genuinely distinct, testable
  boundary after the project's database, fault-tolerance, programming-language,
  security, metrology, and computing/network audits are mandatory nulls?
- **Evidence rule:** a paper's theorem, a system's documented interface, a
  measured implementation result, and the proposed AI translation remain
  different objects. No cited result is evidence that the translation improves
  this project.
- **Claim state:** five bounded ledger additions are proposed as `C-1440` through
  `C-1444`. End-to-end arguments, failure detectors, linearizability/CAP,
  write-ahead logging, deterministic replay, crash/Byzantine separation,
  tail-at-scale, and generic provenance are deduplicated to existing claims.
- **Execution state:** six CPU-feasible synthetic protocol specifications are
  specified. They are designs only: no smoke, confirmation, transfer, energy,
  or workstation result is reported here.
- **Promotion state:** zero new principles and zero new candidates. A systems
  mechanism becomes infrastructure or a mature null unless a later candidate
  beats it at equal correctness, fault, latency, work, and lifecycle boundaries.

## Executive finding

The useful result is a set of contracts that AI-system prose often collapses.

1. A time lease bounds authority only under its clock and recovery assumptions.
   Once a new holder exists, a delayed old holder is excluded by a resource that
   checks a newer epoch or lock sequencer, not by confidence that the old process
   noticed expiry.
2. Safety and liveness are different. Deterministic consensus cannot guarantee
   termination in the fully asynchronous crash model used by FLP; practical
   progress relies on a named extension such as partial synchrony,
   randomization, or a failure-detector assumption.
3. Linearizability, serializability, availability, bounded staleness, and
   convergence remain distinct. Their existing project claims already own this
   boundary; this audit adds no new consistency slogan.
4. A retry after an unknown outcome can duplicate a non-idempotent effect.
   Exactly-once *observable effect* requires a stable request identity and a
   durable duplicate/result record atomically coupled to the protected effect,
   or an equivalent receiver-side contract. A transport acknowledgement alone
   does not supply that boundary.
5. A checkpoint, write-ahead log, distributed snapshot, and deterministic
   execution recording preserve different state. None automatically reverses an
   effect outside its participating recovery boundary.
6. Crash, omission, timing, corruption, and Byzantine faults license different
   guarantees. A crash-tolerant replicated log is not silently promoted to a
   Byzantine or common-mode guarantee.
7. Tail latency is an end-to-end distribution, not a mean branch time. A
   completion-paced load generator can omit arrivals precisely while the system
   stalls; its reported quantiles then answer a different question from an open
   arrival process.
8. Operating-system controls are resource- and scheduler-scoped. A CPU quota is
   not a memory, I/O, accelerator, network, kernel, or energy enclosure. Stall
   time and accepted service remain separate from allocated cycles.
9. Reproducible systems evidence binds code, configuration, workload, topology,
   clocks, fault schedule, observation points, raw histories, checker, and
   environment. That provenance permits replay and audit; it does not prove the
   implementation or claim correct.

These findings mainly harden
[Candidate 003](../../experiments/candidates/003-recovery-dynamics-fragility.md),
[Candidate 005](../../experiments/candidates/005-severity-ordered-containment.md),
[Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
[Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
[Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md),
[Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md),
[Candidate 015](../../experiments/candidates/015-versioned-repairable-conventions.md),
and the workstation evidence contract. They do not define another architecture.

## Source-status and observation boundary

All academic claims below use primary papers, standards, or official interface
documentation. Foundational papers remain the primary source for the theorem or
mechanism they introduced; “old” does not mean superseded. Living Linux
documentation was checked on 2026-08-24 and is cited as a versioned access
snapshot, not as a cross-operating-system theorem.

| Source class | What it can establish | What it cannot establish here |
| --- | --- | --- |
| impossibility or possibility proof | result inside its process, channel, timing, fault, and adversary model | behavior of an unspecified implementation or a different fault model |
| protocol/system paper | design, stated contract, implementation, and measured configuration | universal latency, energy, correctness, or transfer to an AI service |
| RFC or official kernel documentation | current interface semantics and normative/authoritative scope | scientific superiority or behavior outside the documented version/configuration |
| synthetic protocol below | whether its implementation distinguishes seeded mechanisms under a declared generator | field reliability, theorem proof, calibrated joules, or general deployment validity |
| proposed AI translation | an experimentable system hypothesis | evidence that the source mechanism improves AI |

## Construct firewall

| Construct | Exact object | Invalid substitution |
| --- | --- | --- |
| lease | time-bounded right under a specified grant, clock, renewal, and recovery protocol | proof that no delayed old holder can still affect an external resource |
| epoch or fencing token | monotonically ordered authority generation checked at the effect boundary | timestamp, process ID, or label that the resource does not validate |
| suspicion | failure-detector output based on observations and timing assumptions | ground-truth crash diagnosis |
| safety | prohibited outcomes do not occur in every execution licensed by the model | eventual completion or high availability |
| liveness | required progress eventually occurs under named progress assumptions | consistency or bounded latency in every execution |
| linearizability | each completed concurrent object operation can be placed once between invocation and response while respecting real time | serializability, durability, truth, or availability under partition |
| availability | every request to a non-failing node eventually receives a response under the named model | successful, fresh, correct, or semantically valid response |
| idempotent operation | repeated application has the same intended state effect as one application for the declared operation semantics | execution exactly once, identical logs, or no external side effects |
| duplicate suppression | remembered request identity prevents a repeated protected effect inside a retention and migration boundary | an eternal global exactly-once guarantee |
| write-ahead log | recovery record made durable before the dependent data/effect under a declared stable-storage ordering | semantic truth or reversal of non-participating effects |
| consistent snapshot | process/channel state forming a consistent cut under the snapshot model | one simultaneous wall-clock state or a correct application belief |
| deterministic replay | reproduction relative to captured nondeterminism and replay constraints | counterfactual equivalence, coverage of unrecorded environment state, or effect rollback |
| crash fault | process stops taking protocol steps as modeled | arbitrary, equivocating, malicious, or common-mode behavior |
| Byzantine fault | arbitrary behavior within a stated authentication, quorum, synchrony, and fault-count model | protection beyond the threshold or against shared roots |
| response time | completion time minus the intended arrival/scheduled time for a declared request | service time measured only after dispatch |
| coordinated omission | arrivals/measurements suppressed because the generator waits for the system under test | every difference between open and closed workloads |
| OS resource controller | enforcement/accounting mechanism for the controller's documented resource and task scope | complete machine, accelerator, network, or energy isolation |
| provenance | identities and derivation/observation relations for artifacts and activities | correctness, authenticity, truth, or causal sufficiency |

## Exact deduplication against current claims and candidates

| Requested topic | Existing owner | Residual disposition |
| --- | --- | --- |
| end-to-end argument | [C-1408](../claims.md#c-1408); `SaltzerReedClark1984` | **Fully deduplicated.** Endpoint semantics and verification remain necessary even when lower layers optimize or partially check them. |
| unreliable failure detectors | [C-082](../claims.md#c-082); `chandra1996failure` | **Reused.** `C-1441` adds the orthogonal FLP/partial-synchrony liveness boundary; it does not rename suspicion classes. |
| linearizability versus serializability | [C-328](../claims.md#c-328) | **Fully deduplicated.** No new consistency claim. |
| availability versus atomic consistency under partition | [C-329](../claims.md#c-329) | **Fully deduplicated.** CAP remains scoped to its definitions. |
| quorum and replicated-log assumptions | [C-083](../claims.md#c-083), [C-330](../claims.md#c-330), [C-331](../claims.md#c-331) | **Fully deduplicated.** Fault count, membership, independence, and common-mode roots remain explicit. |
| write-ahead logging and recovery | [C-325](../claims.md#c-325), [C-326](../claims.md#c-326); `mohan1992aries` | **Fully deduplicated.** Recovery ordering is not semantic correctness or external-effect rollback. |
| event and deterministic replay | [C-336](../claims.md#c-336) | **Mechanistically deduplicated.** `OCallahanEtAl2017RR` deepens the capture/hardware/OS boundary without a new claim. |
| crash versus Byzantine tolerance | [C-083](../claims.md#c-083); `castro1999pbft`, `ongaro2014raft` | **Fully deduplicated.** Different fault models remain different guarantees. |
| tail at scale and hedging | [C-1411](../claims.md#c-1411); `DeanBarroso2013` | **Reused.** `C-1443` is about the load/observation operator, not a new hedge policy. |
| generic measurement provenance | [C-859](../claims.md#c-859), Candidate 014; `w3cprov` | **Fully deduplicated.** The exact systems manifest below is an application of the existing observation contract. |
| fault-injection representativeness | [C-1031](../claims.md#c-1031) | **Reused.** `ChenEtAl2025CAFault` adds contemporary evidence that configuration and fault inputs interact, but the general sampled-fault boundary already exists. |
| leases, epochs, and resource fencing | mentioned as mature nulls in Candidate 012 but no dedicated ledger statement | **New bounded claim `C-1440`.** It distinguishes time expiry from effect-boundary stale-holder exclusion. |
| retry, idempotence, and duplicate-result retention | used operationally in prior audits but no dedicated ledger statement | **New bounded claim `C-1442`.** It states the end-to-end effect boundary without claiming universal exactly-once messaging. |
| coordinated omission/open versus closed arrival operator | not separately owned; adjacent to `C-1407`, `C-1409`, and `C-1411` | **New bounded claim `C-1443`.** It concerns what latency distribution is sampled. |
| controller-scoped OS resource isolation and stall time | absent from the ledger | **New bounded claim `C-1444`.** It is Linux-documentation scoped and does not claim all operating systems share the interface. |

## Shared mathematical and dimensional boundary

### Authority requires an effect-boundary order

Let an authority service allocate a monotonically increasing epoch
$e\in\mathbb{N}$ for resource $r$. The resource durably stores $E_r$, the
largest activated epoch. A request $(x,e)$ is eligible only when

$$
\operatorname{eligible}(x,e,r)=
\mathbf{1}[e=E_r]\,\mathbf{1}[\operatorname{active}(r,e)]\,
\mathbf{1}[\operatorname{releaseReceipt}(x,r,e)]\,
\mathbf{1}[\operatorname{scope}(x)\subseteq r]\,
\mathbf{1}[\operatorname{preconditions}(x)].
$$

Before a new holder can act, the authority protocol orders four boundaries:
the resource durably installs $e_{new}>E_r$ and atomically sets
$E_r\leftarrow e_{new}$ active; only then does the resource emit an activation
acknowledgement; the authority receives that acknowledgement and issues an
epoch/resource-bound release receipt; only then may the holder issue effects.
The resource rejects requests without that receipt and every request whose
epoch differs from the exact active epoch. Thus neither an uninstalled future
epoch nor an installed epoch presented before the holder-release boundary is
eligible merely because its number is larger. The integer epoch is
dimensionless. Lease duration and lock delay are seconds; clock error, drift,
pause, message delay, and recovery delay are also seconds and cannot be added to
an epoch as though they were the same quantity.

This construction is not a complete authorization protocol. Token
authentication, scope, delegation, revocation, resource identity, durable
installation, wraparound, and compromise remain separate. Chubby's lock
sequencer supplies a concrete primary-source instance: recipients are expected
to validate the lock name, mode, and generation and reject invalid requests
[@Burrows2006Chubby]. Gray and Cheriton's lease paper supplies the time-bounded
cache-consistency mechanism and its clock/failure assumptions
[@GrayCheriton1989Leases].

### Safety and liveness use different quantifiers

For execution set $\mathcal{E}(M)$ licensed by model $M$, a safety property can
be written

$$
\forall \xi\in\mathcal{E}(M),\quad \neg\operatorname{bad}(\xi).
$$

A liveness property requires progress on executions satisfying an additional
progress predicate $G$:

$$
\forall \xi\in\mathcal{E}(M),\quad
G(\xi)\Rightarrow \Diamond\operatorname{decide}(\xi).
$$

FLP establishes a nontermination possibility for deterministic consensus in
its fully asynchronous message-passing model with one possible crash
[@FischerLynchPaterson1985FLP]. Dwork, Lynch, and Stockmeyer instead define
partially synchronous models in which message/process bounds exist but are
unknown, or become valid after an unknown stabilization time
[@DworkLynchStockmeyer1988PartialSynchrony]. A timeout $\tau$ is seconds; a
failure suspicion is a categorical observation, not a measured crash.

### Retry semantics attach identity to the effect boundary

For state transition $f_x$, idempotence for request $x$ is

$$
f_x(f_x(s))=f_x(s).
$$

That equality concerns the declared state $s$. Logs, billing, tool calls, or
physical effects may still differ. For a non-idempotent operation, let request
identity be $q=(c,e_c,n)$: client identity $c$, client incarnation $e_c$, and
monotone sequence $n$. An exactly-once protected effect requires an atomic
transition inside boundary $B$:

$$
(s,D)\xrightarrow{q,x}
\begin{cases}
(s,D),\;D[q].result,&q\in D,\\
(f_x(s),D\cup\{q\mapsto result\}),&q\notin D,
\end{cases}
$$

where $D$ is durable duplicate/result state. Retention, migration, client-ID
reuse, and resource scope determine when $q\in D$ remains knowable. RIFL is a
primary system example of durable RPC result tracking and migration with the
protected objects [@LeeEtAl2015RIFL]. RFC 9110 separately defines HTTP method
idempotence and constrains automatic retry of non-idempotent methods
[@RFC9110HTTP]. Neither source makes an arbitrary external world transactional.

### Recovery point and replay coverage are explicit

Let $S_k$ be a checkpoint, $L_{k+1:m}$ an ordered valid log suffix, $h_v$ the
versioned handler, $N$ captured nondeterministic inputs, and $X$ external
effects. A reconstructed internal state is

$$
\widehat S_m=\operatorname{Replay}(S_k,L_{k+1:m};h_v,N).
$$

Equality $\widehat S_m=S_m$ is meaningful only under a declared equality or
observational-equivalence relation. It does not imply that $X$ was rolled back
or emitted once. ARIES supplies the write-ahead ordering null
[@mohan1992aries]; Chandy--Lamport supplies a consistent distributed-cut null
[@ChandyLamport1985Snapshots]; RR demonstrates practical record/replay only
under explicit hardware, OS, scheduling, and nondeterminism-capture constraints
[@OCallahanEtAl2017RR]. This entire boundary remains owned by `C-326` and
`C-336`.

### Latency begins at the declared arrival clock

For request $i$, let $a_i$ be intended arrival/schedule time, $d_i$ dispatch
time, and $c_i$ completion or terminal-timeout time, all in seconds on a
declared clock. Then

$$
L_i=c_i-a_i=(d_i-a_i)+(c_i-d_i)=Q_i+R_i,
$$

where $L_i$ is end-to-end response time, $Q_i$ is pre-dispatch/queue delay, and
$R_i$ is post-dispatch response/service-path time. A completion-paced generator
makes future $a_i$ depend on earlier $c_j$; during a stall it can create no
request and therefore record no $L_i$ for the users who would have arrived.
Open and closed workload models can consequently produce different response
distributions even with nominally similar service demand
[@SchroederWiermanHarcholBalter2006OpenClosed]. Coordinated-omission studies show
the concrete benchmark failure [@FriedrichWingerathRitter2017CoordinatedOmission].

Quantiles use raw terminal outcomes, including timeouts at the declared bound;
they are never computed after deleting failures. With $n$ independent request
latencies the Dvoretzky--Kiefer--Wolfowitz bound is

$$
P\left(\sup_x|F_n(x)-F(x)|>\epsilon\right)
\leq 2e^{-2n\epsilon^2}.
$$

Requests inside one shared queue episode are not independent, so protocol
uncertainty clusters on the independently generated episode/world rather than
pretending that millions of requests are millions of replications.

### OS controls and pressure have controller-specific units

Linux cgroup v2 documents separate CPU, memory, I/O, PID, and other controller
interfaces. The CPU controller's bandwidth and weight apply to named scheduler
classes and distribute CPU time; they do not account for execution frequency as
a physical-energy measure [@LinuxCgroupV2_2026]. Pressure Stall Information
reports `some` and `full` stall fractions and cumulative stall time in
microseconds for CPU, memory, and I/O [@LinuxPSI_2026]. Therefore:

$$
T_{wall}=T_{run}+T_{cpu\_wait}+T_{mem\_wait}+T_{io\_wait}+T_{other},
$$

with every $T$ in seconds, but overlap and kernel definitions must be respected;
the terms cannot be naively summed when instrumentation permits simultaneous
classification. CPU seconds, wall seconds, bytes, I/O operations, requests, and
stall microseconds are reportable in CPU-only tests. Joules require a calibrated
hardware acquisition boundary and are not inferred from these counters.

## Scoped depth cards

### SYS-01 — Lease expiry is not stale-holder exclusion

- **Reserved claim:** [C-1440](#c-1440).
- **Primary-source observation:** leases trade bounded write delay and renewal
  traffic against cache/authority reuse under clock and non-Byzantine failure
  assumptions. Chubby's sequencer contains lock identity, mode, and generation;
  the protected service is expected to reject an invalid or older sequencer
  [@GrayCheriton1989Leases; @Burrows2006Chubby].
- **Proposed AI translation:** every exclusive writer, trainer, model promoter,
  memory compactor, tool actuator, or authority-transfer path carries a
  resource-scoped epoch. The actual mutable resource installs and checks it;
  the orchestration service's belief is not sufficient.
- **Efficiency mechanism:** a lease permits local action without a coordination
  round trip on every operation; a monotonically ordered fence prevents delayed
  prior owners from corrupting the new epoch. Benefit must charge renewal,
  durable epoch installation, rejection/retry, and temporary unavailability.
- **Mature null:** an ordinary distributed lock/lease service with authenticated
  lock sequencers or generation numbers, conditional writes, explicit
  activation acknowledgement, and tested recovery.
- **Failure modes:** clock step or drift outside the bound; paused old process;
  delayed/reordered RPC; epoch reused after restart; token not checked by the
  resource; resource loses its maximum epoch; wraparound; scope alias; shared
  credential compromise; new owner acts before fence installation; lock delay
  misreported as a fence.
- **Measurable prediction:** under pause, partition, reorder, and restart
  schedules, effect-boundary fencing should eliminate seeded stale-holder
  effects that survive lease-only expiry, at the cost of measurable activation
  and metadata overhead.
- **Disposition:** infrastructure/mature null for Candidate 012 and Candidate
  009, not a new principle.

### SYS-02 — Consensus progress is assumption-qualified

- **Reserved claim:** [C-1441](#c-1441).
- **Primary-source observation:** FLP gives a possible nonterminating execution
  for deterministic consensus with one crash in a fully asynchronous model.
  Partial synchrony and unreliable failure-detector classes provide different,
  explicit ways to recover progress while preserving separately stated safety
  properties [@FischerLynchPaterson1985FLP;
  @DworkLynchStockmeyer1988PartialSynchrony; @chandra1996failure].
- **Proposed AI translation:** a distributed agent, expert, tool, or memory
  control plane publishes `safe`, `live-under-G`, `degraded`, and `unknown`
  separately. Timeouts create suspicions and fallback actions; they do not
  create ground-truth crash labels.
- **Efficiency mechanism:** local progress and temporary unavailability can be
  preferable to global waiting, but only under an explicit consistency and
  authority envelope. Adaptive timeouts may reduce unnecessary waiting after
  stabilization while charging false suspicions and message work.
- **Mature null:** Raft/Paxos-class crash consensus, DLS-style partial synchrony,
  Chandra--Toueg failure-detector contracts, and ordinary degraded-mode design.
- **Failure modes:** liveness promised before stabilization; packet delay called
  crash; clock/time unit omitted; minority partition serves forbidden writes;
  randomized protocol described as deterministic; Byzantine behavior injected
  into a crash proof; quorum independence assumed; safety and availability
  merged into one success rate.
- **Measurable prediction:** a typed synchrony/failure-detector gate should
  reduce false terminal diagnosis and unsafe double authority versus a fixed
  timeout while preserving safety; it may increase declared-unavailable time.
- **Disposition:** evaluation boundary for Candidates 003/012/014. The existing
  `C-082` continues to own failure-detector completeness and accuracy.

### SYS-03 — Consistency labels do not compose by name

- **Reserved claim:** none; deduplicated to
  [C-325](../claims.md#c-325),
  [C-328](../claims.md#c-328),
  [C-329](../claims.md#c-329), and
  [C-330](../claims.md#c-330).
- **Primary-source observation:** linearizability constrains object histories
  using real-time order; CAP's impossibility result uses specified definitions
  of atomic consistency, availability, and partition; quorum overlap and
  replicated logs carry their own membership/fault assumptions
  [@herlihy1990linearizability; @gilbert2002cap; @ongaro2014raft]. Elle shows
  that observed histories can reveal selected isolation anomalies only for the
  datatypes and inference coverage its checker supports
  [@KingsburyAlvaro2021Elle].
- **Proposed AI translation:** name the state object, operation/transaction
  boundary, invocation and response, unknown outcomes, real-time relation,
  staleness clock, conflict rule, and admissible degraded response for model
  registries, factual stores, caches, tool ledgers, and shared agent state.
- **Efficiency mechanism:** weaker or scoped contracts can reduce coordination,
  but the changed semantics are part of the result, not free speedup.
- **Failure modes:** session consistency called linearizability; snapshot
  isolation called serializability; timeout deleted from history; checker
  noncoverage treated as success; availability counts error responses as useful
  service; stale cache correctness inferred from version presence alone.
- **Measurable prediction:** no new one. Existing claims require history-based
  validation under fault and concurrency schedules.

### SYS-04 — Retry safety belongs to the receiving effect boundary

- **Reserved claim:** [C-1442](#c-1442).
- **Primary-source observation:** HTTP defines idempotence by intended method
  effect and restricts automatic retry of non-idempotent requests. RIFL converts
  at-least-once RPC behavior into exactly-once RPC semantics for its protected
  system by durable result tracking, stable request identifiers, and migration
  of metadata with objects [@RFC9110HTTP; @LeeEtAl2015RIFL]. The end-to-end
  argument already explains why lower-layer delivery cannot certify
  application completion [@SaltzerReedClark1984].
- **Proposed AI translation:** every consequential tool call, training commit,
  payment-like action, artifact publication, memory mutation, or actuator command
  has a stable incarnation-qualified request ID; the receiving resource stores
  or conditionally applies that ID with the effect and returns a receipt.
- **Efficiency mechanism:** safe retries recover from lost responses and crashes
  without global transactions when the receiver can cheaply retain duplicate
  state. Retention bytes, lookup, migration, expiry, and reconciliation are
  charged.
- **Mature null:** idempotent API, idempotency key, conditional update/CAS,
  transactional outbox/inbox, durable result cache, or saga/compensation where
  true atomicity is unavailable.
- **Failure modes:** client sequence reused after restore; duplicate table
  expires before retry; result record and effect commit separately; metadata
  not migrated; request ID aliases a different payload; a second receiver is
  outside the duplicate domain; human/physical effect cannot be undone; retry
  storm; success receipt lost; "exactly once" claimed for an unbounded world.
- **Measurable prediction:** durable receiver-side identity coupled to the
  effect should reduce duplicate non-idempotent effects under lost-response and
  crash schedules versus blind retry and sender-only logging; an external sink
  remains unsafe until it participates or independently deduplicates.
- **Disposition:** established systems boundary for Candidates 009/010/011/015;
  no AI-specific mechanism.

### SYS-05 — Recovery replays only what crossed the recovery boundary

- **Reserved claim:** none; deduplicated to
  [C-326](../claims.md#c-326) and [C-336](../claims.md#c-336).
- **Primary-source observation:** ARIES binds log-before-data ordering to its
  stable-storage recovery model; Chandy--Lamport captures a consistent cut;
  RR records/replays execution under explicit CPU, kernel, scheduling, and
  nondeterminism constraints [@mohan1992aries; @ChandyLamport1985Snapshots;
  @OCallahanEtAl2017RR].
- **Proposed AI translation:** recovery manifests separately bind model/optimizer
  state, mutable stores, queues, RNG, clocks, tool receipts, external versions,
  and replay code. Re-execution is permitted only where side effects are
  idempotent, deduplicated, or explicitly compensated.
- **Efficiency mechanism:** checkpoints cap repeated work; logs preserve recent
  transitions; selective nondeterminism capture makes rare failures diagnosable.
  Snapshot bytes, logging bandwidth, replay CPU, pause time, and retained effect
  receipts are charged.
- **Mature null:** checkpoint plus WAL/command log, consistent snapshot, content-
  addressed release, deterministic record/replay, side-effect receipt/outbox,
  and tested restore.
- **Failure modes:** torn log tail; checkpoint contains latent fault; schema or
  handler drift; RNG/time/system-call omitted; multithreaded race outside replay
  support; external effect repeated; replay reads current rather than recorded
  dependency; state hash passes while semantics changed; restore never tested.
- **Measurable prediction:** no new ledger claim. The recovery protocol should
  expose which seeded faults each artifact family can and cannot reconstruct.

### SYS-06 — Fault model and fault schedule are treatment variables

- **Reserved claim:** none; deduplicated to
  [C-083](../claims.md#c-083) and [C-1031](../claims.md#c-1031).
- **Primary-source observation:** crash-consensus and PBFT guarantee different
  properties under different fault counts and timing/progress assumptions
  [@ongaro2014raft; @castro1999pbft]. Contemporary configuration-aware fault
  injection found additional fault-handling paths and bugs by varying
  fault-dependent configuration rather than using only defaults
  [@ChenEtAl2025CAFault].
- **Proposed AI translation:** fault injection crosses fault type, site, time,
  duration, concurrency, workload, configuration, topology, version, and
  observation coverage. The exact schedule is a content-identified experimental
  treatment and replay input.
- **Efficiency mechanism:** causal/lineage and configuration guidance can prune
  redundant schedules, but selection cost and missed regions remain explicit.
- **Mature null:** model checking where tractable, property-based history tests,
  systematic schedule exploration, configuration-aware fault injection,
  common-cause analysis, and held-out fault families.
- **Failure modes:** crash-only test supports Byzantine claim; uniform random
  injection called representative; fault occurs before activation; default
  configuration hides handler; expected failure excluded; scheduler seed lost;
  test oracle shares the implementation bug; finite non-finding called proof.
- **Measurable prediction:** no new ledger claim. Configuration-by-fault
  interactions should be reported as coverage, not inflated into field rates.

### SYS-07 — Completion-paced tests can erase the tail they claim to measure

- **Reserved claim:** [C-1443](#c-1443).
- **Primary-source observation:** open generators schedule arrivals independently
  of completions; closed generators couple new work to completions. Their
  response behavior differs under load. Coordinated omission occurs when a
  blocking/completion-paced generator skips intended requests during stalls and
  underreports the affected latency distribution
  [@SchroederWiermanHarcholBalter2006OpenClosed;
  @FriedrichWingerathRitter2017CoordinatedOmission]. Tail-at-scale separately
  establishes why rare component delays become service-level events
  [@DeanBarroso2013].
- **Proposed AI translation:** model-serving, retrieval, expert/agent fan-out,
  tool, and training-pipeline benchmarks retain scheduled arrival, dispatch,
  completion/timeout, queue, cancellation, and terminal outcome for every
  intended request. Open, closed, and trace-replay workloads are named rather
  than pooled.
- **Efficiency mechanism:** valid arrival and tail measurement prevents false
  promotion of a faster-looking policy that merely suppresses load during
  stalls. It may require more generator capacity and larger raw traces.
- **Mature null:** independent open-loop generator, calibrated trace replay,
  complete terminal-outcome ledger, arrival-to-terminal latency, exact raw
  quantiles, censored/timeout sensitivity, and load-generator saturation checks.
- **Failure modes:** service time reported as response time; unsent intended
  arrivals absent; timeouts deleted; offered load replaced by achieved
  throughput; generator and system share bottleneck; percentile merge wrong;
  p99.9 from too few independent episodes; warm-up/tuning included selectively;
  overload stopped early and excluded.
- **Measurable prediction:** arrival-clock-complete measurement should recover
  seeded stall exposure and tail quantiles across open/closed regimes, whereas
  naive completion-paced measurement should become optimistically biased when
  stall duration is non-negligible relative to interarrival time.
- **Disposition:** measurement hardening for Fixture F-012, Candidate 014, and
  every performance/energy claim.

### SYS-08 — OS resource isolation is a vector, not a process label

- **Reserved claim:** [C-1444](#c-1444).
- **Primary-source observation:** Linux cgroup v2 exposes controller-specific
  hierarchy and CPU/memory/I/O/PID interfaces; the CPU controller has explicit
  scheduler and temporal scope. PSI separately reports CPU, memory, and I/O
  stall time [@LinuxCgroupV2_2026; @LinuxPSI_2026].
- **Proposed AI translation:** each experiment and deployed module declares
  controls and observations for CPU time/frequency, memory capacity/pressure,
  I/O bytes/operations/stall, accelerator occupancy/memory, network load,
  thermal state, and shared services. Unsupported dimensions are named, not
  silently called isolated.
- **Efficiency mechanism:** pressure-aware admission, migration, pause, and load
  shedding may maintain accepted service at higher utilization than static
  overprovisioning. Monitoring, headroom, migration, and rejected work are paid.
- **Mature null:** cgroup/container/VM controls appropriate to the platform,
  accelerator partitioning where supported, queue/admission control, PSI or
  equivalent stall telemetry, host-wide counters, and isolated external meter.
- **Failure modes:** CPU quota called energy cap; memory reclaim or I/O stall
  hidden; GPU uncontrolled; shared page cache/network/kernel work uncharged;
  fair-class rule applied to realtime task; frequency/thermal state omitted;
  per-process counter excludes helpers; controller version/configuration absent;
  synthetic PSI analogue called a Linux measurement.
- **Measurable prediction:** a controller-vector plus pressure-aware admission
  should improve tail-SLA violations under cross-resource contention versus
  CPU-only limiting in the seeded simulator; native transfer remains required.
- **Disposition:** established Linux-scoped boundary and experimental null, not
  a cross-platform guarantee.

### SYS-09 — Provenance enables audit, not correctness

- **Reserved claim:** none; deduplicated to [C-859](../claims.md#c-859) and
  Candidate 014.
- **Primary-source observation:** W3C PROV represents entities, activities,
  agents, and derivations. Systems papers make code, configuration, history,
  and fault/model boundaries necessary to interpret a result
  [@w3cprov; @KingsburyAlvaro2021Elle; @ChenEtAl2025CAFault].
- **Proposed AI translation:** every run root binds source commit, dirty-state
  rejection, runtime/dependency lock, hardware/OS, topology, configuration,
  workload generator, seed pack, intended arrivals, fault schedule, raw events,
  checker/version, exclusions, termination, derived tables, and energy-provider
  identity when energy is measured.
- **Efficiency mechanism:** content identity and derivation avoid repeated
  search and enable selective invalidation/reanalysis. Hashing, storage,
  migration, review, and retention remain costs.
- **Failure modes:** hashes without semantic dependencies; mutable tag; missing
  dirty diff; raw events overwritten; checker shares code with system; clock
  source absent; fault schedule reconstructed from prose; provenance graph
  mistaken for proof; selective retention of successful runs.
- **Measurable prediction:** no new claim. A replay audit must reconstruct every
  published aggregate from immutable raw events or mark it unverifiable.

## Protocol-wide execution, inference, and evidence contract

The six protocols below are CPU-only synthetic or discrete-event tests. They do
not execute real distributed databases, Linux cgroups, GPUs, network partitions,
physical actuators, or calibrated energy meters.

### Frozen splits and independent units

- **Development:** 16 public seed worlds per protocol for implementation and
  diagnostics; permanently ineligible for confirmation.
- **Smoke:** eight fixed seed worlds per protocol, at one-tenth event count,
  expected to complete in at most 60 CPU-seconds and 512 MiB peak RAM on the
  declared reference workstation. Smoke proves wiring only.
- **Confirmation:** 96 encrypted/committed, later-revealed seed worlds per
  protocol. A seed world, not a request, node, message, crash, or repetition, is
  the independent unit.
- **Transfer:** 32 disjoint held-out worlds that change at least one generator
  family named in the protocol. Transfer is analysed only after confirmation
  decisions are sealed.
- **Pairing:** all eligible arms in one world receive the same exogenous request,
  service-demand, fault, clock, and topology potential streams. They never share
  realized mutable queues, logs, duplicate tables, or resource state.

### Randomness and deterministic event order

Each seed expands through PCG64-DXSM into named substreams. Events are ordered by
the tuple `(virtual_time_ns, event_class_rank, node_id, local_sequence)`. The
event-class rank and every tie-break rule are frozen in `event-order.json`.
Random-number draw order, distribution implementation, and serialization are
versioned. Re-running the same arm/world must reproduce the scientific event
hash byte for byte; timestamps and host CPU counters live outside that hash.

### Common resources and units

Full confirmation for each protocol is capped at 60 CPU-minutes, 4 GiB peak RAM,
and 2 GiB retained raw artifacts on the reference workstation. Each arm reports:

- wall and process CPU time in seconds;
- peak resident memory and retained artifacts in bytes;
- simulated messages, operations, requests, and terminal outcomes as counts;
- simulated network/storage traffic in bytes;
- latency, queue, pause, unavailability, recovery, and stall time in
  milliseconds or microseconds as explicitly labeled; and
- useful accepted outcomes and all duplicate, rejected, timed-out, failed, and
  recovery work.

No CPU counter is converted to joules. A later native-energy replication needs a
calibrated external acquisition, interval ownership, idle/baseline convention,
uncertainty budget, and raw readings before `J/accepted outcome` is eligible.

### Multiplicity, uncertainty, and power

`C-1440`--`C-1444` contribute exactly five claim-level primary paired contrasts.
Holm controls family-wise two-sided `alpha=0.01`; planning uses the conservative
first threshold `alpha=0.002`. With 96 independent paired worlds, the normal
planning approximation has power about `0.906` for standardized paired effect
`d=0.45` (`sqrt(96)*0.45 - z_0.999 = 1.319`). This is a design sensitivity, not a
promised effect or substitute for the registered analysis.

For each claim-level contrast, the scalar per-world loss difference is fixed in
the protocol before confirmation. Analysis treats the 96 paired seed worlds as
IID generator clusters and uses a studentized paired world-cluster bootstrap:
each draw resamples complete paired-world rows with replacement, never requests,
messages, or operations independently. The two-sided null test recentres the
world differences at zero and uses 1,000,000 PCG64-DXSM draws with a plus-one
Monte Carlo p-value; 99% percentile-$t$ intervals use 100,000 separately seeded
draws. This procedure requires independent seed worlds and finite variance of
the registered scalar loss. If diagnostics reject that generator contract, the
claim is ineligible rather than silently switching tests. Any choice among
baseline arms is made on the 16 development worlds and frozen before seed
commitment; confirmation data never select the comparator. Holm is applied only
to the five valid claim-level bootstrap p-values. Safety invariants are hard
gates: one violation
rejects the implementation regardless of the mean. Zero violations in 96 worlds
has a one-sided 99% Clopper--Pearson upper bound of `0.04684` on the probability
of a violating *generator world*; it is not a per-operation or deployment-risk
bound. Missing/corrupt worlds are failures, never deletions. No outlier is
removed after reveal.

### Common provenance artifacts

Every protocol produces `design.json`, `source.json`, `runtime.json`,
`hardware-os.json`, `seed-commitments.json`, `seed-reveal.json`,
`generator.json`, `event-order.json`, `arms.json`, `raw-events.jsonl.zst`,
`terminal-outcomes.parquet`, `fault-schedules.jsonl`, `checker-results.jsonl`,
`resource-ledger.json`, `analysis-plan.json`, `analysis-output.json`,
`scientific-hashes.json`, and `run-receipt.json`. The manifest records every
failed or interrupted attempt and why it was replaced.

## CPU-feasible falsification protocol specifications

### OSD-T01 — Lease expiry, epoch activation, and stale-writer fencing

- **Claim:** `C-1440`.
- **Question:** does the effect boundary reject every operation from a prior
  authority epoch after the new epoch is acknowledged active, including when
  the old holder is paused, partitioned, restarted, or delayed?
- **World:** three authority replicas, eight mutable resource shards, four
  clients, 50,000 attempted mutations, 24 ownership transfers, and 1,000 ms
  nominal leases over 120 virtual seconds. Each mutation carries resource ID,
  client incarnation, epoch, activation-release receipt digest, local sequence,
  payload digest, and send time.
- **Fault generator:** 0--3,000 ms message delay; reorder and duplication;
  0--2,500 ms process pause spanning expiry; client crash/restart; authority
  leader crash; resource crash with either valid durable epoch or deliberately
  corrupt/absent durability; clock drift `[-500,500]` ppm; clock steps
  `[-2,2]` s; dropped activation acknowledgement; delayed old mutation; and one
  out-of-model forged-token episode marked Byzantine-negative-control.
- **Arms:**
  1. advisory lease expiry checked only by clients;
  2. lease plus a fixed 1,000 ms post-failure lock delay;
  3. monotonically increasing resource-scoped epoch, durably installed before
     activation acknowledgement; the authority issues a resource/epoch-bound
     release receipt only after receiving that acknowledgement, and every
     mutation is rejected unless its epoch equals the exact active resource
     epoch and its receipt validates;
  4. arm 3 plus authenticated token and payload binding, to expose the separate
     forgery boundary.
- **Strongest mature null:** arms 3/4. They are conventional fencing and
  authentication, not project inventions.
- **Oracle/invariants:** the generator owns true holder intervals and accepted
  resource history. Before `holder_release(r,e,receipt)`, no operation carrying
  epoch `e` may be accepted, whether or not installation has started or the
  resource acknowledgement is in flight; after release, no accepted operation
  on `r` may carry an epoch other than `e` or omit/mismatch that receipt; no epoch can
  decrease across a valid resource restart; an
  activation acknowledgement may be emitted only after durable installation;
  one `(client_incarnation,sequence)` maps to one payload digest; the forged
  negative control must never support a crash-only guarantee.
- **Primary paired contrast:** per-world stale-holder accepted effects per
  million attempts, arm 3 versus one of arms 1/2 selected on development worlds
  and frozen before confirmation. The hard gate for arm
  3 is exactly zero. The claim-level effect is eligible only if arm 3 also keeps
  accepted throughput within 5% and p99 activation latency within 250 ms of the
  best safe arm.
- **Secondary metrics:** split-authority milliseconds; no-owner milliseconds;
  false rejection per million current-epoch operations; activation and recovery
  latency (ms); messages and bytes/mutation; duplicate work; process CPU-s;
  retained epoch bytes; and terminal unknown outcomes.
- **Analysis:** the five-claim Holm/paired-bootstrap procedure uses the per-world stale-
  effect difference after assigning one million penalty units to any invariant
  violation. Report separate clock-valid, clock-invalid, durable, lost-durable,
  and forged-token strata; never average the Byzantine control into a crash
  guarantee.
- **Smoke/full feasibility:** smoke uses 5,000 mutations, four transfers, and
  eight worlds; full uses the frozen world above for 96 confirmation plus 32
  transfer worlds. Transfer holds out simultaneous old-client resume plus
  resource recovery and a new delay distribution.
- **Falsification:** reject the implementation if any stale epoch is accepted
  after activation acknowledgement, epoch durability is reconstructed from an
  untrusted client, an old epoch is reused, or the result depends on the old
  holder observing expiry. Retire any extra project envelope if ordinary arm 3
  matches it at equal scope and cost.
- **Extra artifacts:** `authority-events.jsonl`, `resource-history.jsonl`,
  `epoch-installs.jsonl`, `lease-clocks.jsonl`, `token-checks.jsonl`, and
  `stale-effect-witnesses.jsonl`.

### OSD-T02 — Partial synchrony, suspicions, and progress qualification

- **Claim:** `C-1441`.
- **Question:** can the implementation preserve crash-model safety while
  reporting progress and failure evidence without turning timeout into truth?
- **World:** five replicated state-machine nodes, three clients, 20,000 commands,
  12 leader terms, and 300 virtual seconds. At most two nodes crash in any
  crash-eligible interval; the truth log records crash, pause, partition, and
  delay separately.
- **Timing generator:** six 50-second regimes. Before an unknown generated
  stabilization time, delay is adversarial in `[0,10]` s with finite eventual
  delivery; afterwards an unknown actual bound is selected from
  `{10,50,200}` ms. Processor pause, asymmetric partition, loss followed by
  eventual redelivery, leader crash, slow nonfailed node, and one equivocation
  negative control are crossed with offered load 20%--90% of nominal capacity.
- **Arms:**
  1. fixed 100 ms timeout reported as a terminal crash diagnosis;
  2. fixed timeout reported only as suspicion, with majority crash-consensus;
  3. adaptive observed-delay timeout with suspicion plus an explicit
     `pre-stabilization/unknown/degraded/live-under-bound` state;
  4. future-delay oracle, diagnostic and promotion-ineligible.
- **Strongest mature null:** arm 3 is ordinary assumption-qualified failure
  detection and crash consensus. No neural detector receives credit for the
  abstraction.
- **Oracle/invariants:** committed commands form one prefix-consistent order;
  no two different values commit at one index; a client command has at most one
  committed identity; a suspicion is never serialized as a ground-truth crash;
  liveness deadlines apply only after the generated bound is in force and a
  quorum is nonfailed; the equivocation control is labeled outside crash-model
  coverage.
- **Primary paired contrast:** false terminal crash diagnoses per 1,000 true
  node-minutes, arm 3 versus arm 1, with zero crash-model safety violations in
  arm 3. Eligible improvement requires at least a 30% reduction in false
  terminal diagnoses while post-stabilization p99 decision latency is no more
  than 10% worse than arm 2.
- **Secondary metrics:** suspicion precision/recall by cause; false leadership
  transfers; unavailability and unknown-state seconds; post-stabilization commit
  latency (ms); messages/command; leader churn; timeout trajectory; accepted
  commands/s; and CPU-s.
- **Analysis:** primary world effect is the false-terminal-diagnosis rate
  difference with a safety-violation penalty. Report liveness conditionally by
  actual post-stabilization bound, quorum state, and offered load. No statistic
  from the equivocation control is called crash-consensus power.
- **Smoke/full feasibility:** smoke uses 2,000 commands and two regimes; full
  uses 20,000 commands for each of 96 worlds. Transfer hides a bimodal post-
  stabilization delay and a pause pattern that resembles a crash for 8 seconds.
- **Falsification:** reject if the arm violates log safety within the crash
  model, calls a nonfailed slow node definitely crashed, claims bounded progress
  before its assumption holds, hides unavailable time, or labels equivocation
  as tolerated without a Byzantine protocol.
- **Extra artifacts:** `message-schedule.jsonl`, `node-truth.jsonl`,
  `suspicions.jsonl`, `term-log.jsonl`, `commit-history.jsonl`, and
  `assumption-state.jsonl`.

### OSD-T03 — Unknown outcomes, idempotence, and duplicate effects

- **Claim:** `C-1442`.
- **Question:** which boundary prevents a lost response or crash from turning a
  retry into duplicate, missing, or payload-aliased consequential effects?
- **World:** 100,000 logical requests from 32 clients to eight shards. Forty
  percent are idempotent assignments, 30% non-idempotent increments, 20%
  debit/credit pairs inside one store, and 10% external-sink notifications. Each
  client has a 128-bit identity, 64-bit incarnation, and 64-bit sequence.
- **Fault generator:** request loss, response loss, duplicated/reordered
  delivery, crash before effect, crash after effect before response, duplicate-
  table loss, metadata migration, client rollback with/without incarnation
  advance, ID/payload collision injection, dedup retention expiry at
  `{1,10,100}` seconds, and retry backoff `{0,10,100}` ms. Faults are generated
  at exact transition boundaries, not inferred from final state.
- **Arms:**
  1. no retry after timeout;
  2. blind at-least-once retry;
  3. durable sender intent/result log only;
  4. receiver-side durable request/result table atomically committed with the
     internal effect and migrated with its shard;
  5. arm 4 plus independently deduplicating external sink and durable receipt.
- **Strongest mature null:** arm 4 for one participating store; arm 5 when the
  external sink supports the request identity. These are conventional
  idempotency/exactly-once-effect patterns.
- **Oracle/invariants:** one logical request maps to one payload digest; every
  intended internal request ends in exactly one of `applied-once`, `not-applied`,
  or `unknown-at-deadline`; no result for another payload may be returned; arm 4
  may not promise the external sink; arm 5's sink applies each ID at most once.
- **Primary paired contrast:** lifecycle error loss
  `10*duplicate_internal + 10*missing_acknowledged + payload_alias + unknown`,
  per 100,000 logical internal requests, arm 4 versus one of arms 2/3 selected
  on development worlds and frozen before confirmation.
  Arm 4 must have zero duplicate acknowledged internal effects; arm 5 must have
  zero duplicate external effects inside the retained-ID horizon.
- **Secondary metrics:** missing effect, unknown outcome, stale-result, and false-
  duplicate counts; retry attempts; dedup lookup p50/p99 (microseconds);
  completion p99 (ms); table and receipt bytes; migration bytes; CPU-s; and
  accepted effects/s.
- **Analysis:** apply the five-claim Holm/paired-bootstrap procedure to the per-world
  lifecycle-loss contrast. Separately report each error class with 99% world-
  cluster intervals; report retention-expired retries as out-of-contract rather
  than silently pooling them with in-horizon requests.
- **Smoke/full feasibility:** smoke uses 10,000 logical requests; full uses
  100,000 for 96 worlds. Transfer withholds simultaneous client rollback,
  duplicate-table migration, and delayed response beyond the longest retention
  horizon.
- **Falsification:** reject if result/effect atomicity can tear, request identity
  is reused after client restore, migration loses duplicate state, payload is
  not bound to identity, or an internal receipt is used to claim an external
  effect. Retire added AI logic if arm 4/5 matches it.
- **Extra artifacts:** `logical-requests.jsonl`, `deliveries.jsonl`,
  `effect-ledger.jsonl`, `dedup-state.jsonl`, `migration-events.jsonl`,
  `external-receipts.jsonl`, and `unknown-outcomes.jsonl`.

### OSD-T04 — Checkpoint, WAL, snapshot, replay, and external-effect recovery

- **Claim:** no new claim; deepens `C-326` and `C-336`.
- **Question:** which seeded internal and external state can each recovery
  artifact reconstruct, and which failures remain outside its boundary?
- **World:** four workers, a 64-key transactional state store, a four-channel
  message graph, one external append-only sink, 50,000 versioned commands, five
  checkpoints, and 40 generated crash points. Commands consume explicit RNG,
  wall-clock, monotonic-clock, configuration, and dependency-version inputs.
- **Fault generator:** crash before/after WAL flush, before/after data flush,
  torn final log record, stale/corrupt checkpoint, lost channel message,
  reordered replay, handler/schema/configuration version change, omitted RNG or
  clock input, external effect before crash, thread-interleaving perturbation,
  and incomplete dependency capture.
- **Arms:**
  1. latest checkpoint only;
  2. checkpoint plus write-ahead command log;
  3. consistent distributed snapshot plus channel state and log suffix;
  4. arm 3 plus captured nondeterministic inputs and versioned replay handler;
  5. arm 4 plus receiver-side external-effect IDs/receipts.
- **Strongest mature null:** arm 5. It combines established artifacts; it is not
  evidence for a new memory or sleep mechanism.
- **Oracle/invariants:** expected state and effect ledger are generated before
  recovery. WAL-dependent data cannot be considered durable before its log
  record; recovered channel cut must be consistent; replay reads only frozen
  inputs; one external ID appears at most once; state-hash equality and semantic
  query equality are reported separately.
- **Outcomes:** exact-state mismatch per 64 keys; semantic-query failures per
  10,000 checks; lost/duplicate external effects; recovery point objective
  (commands); recovery time (ms); log/snapshot/read/write bytes; replay CPU-s;
  normal-path overhead; and unavailable milliseconds.
- **Uncertainty:** no confirmatory claim-level p-value. Report 99% world-cluster
  intervals and the complete fault-family detection/recovery matrix. A single
  violated declared invariant rejects that arm's recovery contract.
- **Smoke/full feasibility:** smoke uses 5,000 commands, one checkpoint, and
  eight crash points; full uses 50,000 commands and 40 crash points for each of
  96 worlds. Transfer withholds a handler upgrade combined with a post-effect,
  pre-receipt crash and a torn channel-state record.
- **Falsification:** reject if recovery uses oracle truth, current mutable
  dependencies, or deleted failed attempts; if a replayed state hash conceals a
  query mismatch; if an external effect is repeated; or if restore is inferred
  from artifact presence without execution.
- **Extra artifacts:** `checkpoints/`, `wal-segments/`, `channel-cuts.jsonl`,
  `nondeterminism.jsonl`, `handler-versions.json`, `recovery-attempts.jsonl`,
  `state-oracle.json`, and `semantic-checks.jsonl`.

### OSD-T05 — Open/closed load, coordinated omission, and tail truth

- **Claim:** `C-1443`.
- **Question:** does the benchmark retain intended arrivals and terminal outcomes
  during stalls, or does the system under test reduce the sample that judges it?
- **World:** a pre-generated 32-server fork/join service trace with 200,000
  intended requests, fan-out 1--32, and a 30-second virtual run. Arrival
  families are Poisson, gamma-renewal (`CV` 0.5 and 2), burst/on-off, and frozen
  empirical-shape replay. Service families are lognormal, Weibull, Pareto, and
  two-state fast/stalled. Utilization spans 0.3--1.1; common stalls last
  1--2,000 ms; deadline is 5,000 ms.
- **Measurement/load arms:**
  1. synchronous completion-paced generator recording dispatch-to-completion
     only and omitting would-be arrivals while blocked;
  2. arm 1 plus constant-interval synthetic coordinated-omission correction;
  3. independent open arrival scheduler with arrival-to-terminal measurement and
     enough generator capacity;
  4. arm 3 plus explicit generator-saturation monitor, timeout/censor ledger,
     exact raw-sample quantiles, and trace-clock calibration.
- **Strongest mature null:** arm 4. Arm 2 is eligible only in the constant-
  interval stratum its correction assumes.
- **Oracle/invariants:** the immutable intended-arrival trace and virtual service
  potential define truth. Every intended request has one terminal record;
  timeout is retained at 5,000 ms plus a censor flag; offered and accepted load
  are distinct; request p99 is not branch p99; percentile results recompute from
  sorted terminal samples exactly.
- **Primary paired contrast:** absolute error in log p99 arrival-to-terminal
  latency versus oracle, arm 4 versus arm 1. Eligibility requires arm 4 median
  absolute p99 error `<=1%`, stall-exposure recall `>=0.99`, and no more than
  exactly zero missing terminal records. These are protocol thresholds, not source
  results.
- **Secondary metrics:** p50/p95/p99/p99.9 error; timeout-rate error; queue-area
  error (request-s); offered/accepted requests/s; omitted-arrival count;
  generator saturation time; tail confidence interval coverage; raw bytes; and
  CPU-s.
- **Analysis:** the claim-level world effect is log-p99 absolute error difference
  with the Holm/paired-bootstrap procedure. Report by arrival family, utilization,
  stall-to-interarrival ratio, and fan-out. Arm 2 is never extrapolated from
  constant spacing to burst/renewal traces.
- **Smoke/full feasibility:** smoke uses 20,000 intended requests and four
  generator cells; full uses 200,000 per world for 96 worlds. Transfer hides a
  correlated generator/SUT pause and a trace whose timestamp resolution changes
  mid-run.
- **Falsification:** reject if intended unsent arrivals disappear, timeout rows
  are deleted, generator and SUT share an unreported bottleneck, achieved
  throughput substitutes for offered load, exact quantiles cannot be reproduced,
  or arm 2 is called generally corrected outside its assumptions.
- **Extra artifacts:** `intended-arrivals.bin`, `service-potentials.bin`,
  `dispatches.jsonl`, `terminals.jsonl`, `generator-pressure.jsonl`,
  `quantile-checks.json`, and `stall-witnesses.jsonl`.

### OSD-T06 — Controller scope, cross-resource pressure, and accepted service

- **Claim:** `C-1444`.
- **Question:** when contention moves between CPU, memory, and I/O, does a
  CPU-only limiter preserve service or merely move waiting outside its counter?
- **World:** a deterministic simulator with 16 worker groups, four priority
  classes, 100,000 jobs, 32 CPU-capacity units, 64 GiB simulated memory,
  4 GiB/s simulated storage, finite queues, reclaim/writeback, cache reuse, and
  a 200 ms SLA. Job phases consume CPU-us, resident bytes, read/write bytes, and
  dependency waits; no simulated unit is called a physical joule.
- **Regimes:** CPU-bound, memory-reclaim, I/O-saturation, mixed phase, bursty
  foreground plus restartable background, correlated cache eviction, helper
  work outside the nominal process, and an unsupported-accelerator negative
  control. Demand and capacity shift every 1--10 virtual seconds.
- **Arms:**
  1. no admission or resource control;
  2. CPU quota/weight only;
  3. static CPU/memory/I/O vector limits plus class queues;
  4. arm 3 plus synthetic resource-specific `some/full` stall signals,
     thresholded admission, background pause, and recovery hysteresis;
  5. perfect future-demand controller, diagnostic and ineligible.
- **Strongest mature null:** arms 3/4 are ordinary vector resource control and
  pressure-aware admission. A later Linux replication must replace simulated
  signals with the exact native interface and document unsupported dimensions.
- **Oracle/invariants:** resource conservation holds at every virtual tick;
  accepted plus rejected plus timed-out jobs equals intended jobs; helper work
  is charged to its originating arm; simulated CPU pressure is not memory/I/O
  pressure; accelerator-negative-control results are `unsupported`, never
  `isolated`; no resource counter is converted to energy.
- **Primary paired contrast:** SLA-violating accepted jobs per 10,000, arm 4
  versus arm 2. Eligibility requires at least a 20% reduction, no more than 5%
  loss of accepted throughput, and zero false `fully isolated` declarations in
  unsupported-resource worlds.
- **Secondary metrics:** p50/p99 latency (ms); accepted/rejected/timed-out jobs;
  CPU utilization; memory occupancy; read/write bytes; synthetic CPU/memory/I/O
  `some/full` stall microseconds; queue area (job-s); fairness by class; helper
  CPU-us; control transitions; and CPU-s to simulate.
- **Analysis:** apply the five-claim Holm/paired-bootstrap procedure to per-world SLA
  violation rate difference with unsupported-declaration hard penalty. Report
  all resource regimes separately and include a Pareto plot of accepted
  throughput, p99, rejection, and total simulated work.
- **Native-evidence boundary:** the simulator tests the workload generator,
  conservation checker, accounting schema, and proposed control contrast only.
  It does not test Linux cgroup membership, task migration, delegated subtree
  semantics, PSI sampling, reclaim or page-cache attribution, helper escape, or
  native scheduling. A separate Linux replication must run the frozen job and
  fault traces through cgroup v2 CPU, memory, and I/O controllers; record exact
  kernel, cgroup mount/delegation, controller files, task membership over time,
  PSI streams, block-device mapping, page-cache convention, escaped-helper
  probes, and unsupported accelerator/network dimensions; and reproduce every
  result from raw native counters. Until that replication passes its own
  invariants, this protocol contributes no empirical support to the
  Linux-interface claim `C-1444` and no synthetic SLA effect is called a Linux
  performance result.
- **Smoke/full feasibility:** smoke uses 10,000 jobs and four regimes; full uses
  100,000 jobs for 96 worlds. Transfer hides a helper-I/O burst plus memory-
  reclaim cycle and a scheduler class ignored by the CPU-only arm.
- **Falsification:** reject if arm 4 wins only by rejecting more than the stated
  budget, moves work to uncharged helpers, calls synthetic PSI a Linux result,
  treats CPU time as joules, or claims accelerator/network isolation without a
  controller and observation boundary.
- **Extra artifacts:** `job-demands.bin`, `resource-capacity.jsonl`,
  `queue-events.jsonl`, `synthetic-pressure.jsonl`, `controller-actions.jsonl`,
  `helper-work.jsonl`, and `service-frontier.csv`.

## Mandatory mature-null stack

Any later distributed AI-system claim in this scope must compare against the
relevant complete stack, not a deliberately weak "no recovery" control:

1. resource-checked epoch/fencing plus authenticated scope where authority can
   move;
2. named safety, liveness, synchrony, failure-detector, membership, and fault-
   count assumptions;
3. explicit object/transaction consistency and degraded availability contract;
4. stable request identity, idempotence/deduplication, conditional update, and
   receiver receipt at every consequential effect boundary;
5. checkpoint, WAL/snapshot, versioned replay, and tested restore appropriate to
   the state and external effects;
6. crash, omission, timing, corruption, Byzantine, and common-mode fault
   families kept separate, with configuration and schedule crossed;
7. arrival-clock-complete tail measurement with offered load, queue,
   cancellation, timeout, and generator pressure;
8. controller-specific CPU, memory, I/O, accelerator, network, helper, thermal,
   and energy boundaries appropriate to the platform; and
9. immutable code/configuration/workload/fault/raw-history/checker provenance
   with every failed attempt retained.

## Cross-track failure modes

1. Treating a lease timeout, heartbeat timeout, process ID, or wall-clock
   timestamp as a checked authority fence.
2. Claiming both availability and strong consistency during partitions without
   stating which requests, nodes, responses, and consistency condition define
   the claim.
3. Calling suspicion diagnosis, safety liveness, or crash tolerance Byzantine
   tolerance.
4. Calling message delivery, acknowledgement, or sender logging an exactly-once
   external effect.
5. Replaying internal state while silently duplicating or losing external
   actions.
6. Running fault injection under one default configuration and calling the
   tested space representative.
7. Deleting timeouts, unavailable episodes, failed attempts, rejected work, or
   overload from the denominator.
8. Measuring dispatch-to-completion while describing arrival-to-completion.
9. Treating branch p99, mean service time, or achieved throughput as a complete
   service tail.
10. Treating CPU quota, process counters, containers, or virtual machines as a
    calibrated whole-system energy enclosure.
11. Counting requests/messages inside one failure world as independent
    replication.
12. Treating deterministic replay or complete provenance as proof of correctness.

## Claim-integration appendix

The following blocks are content-ready for `research/claims.md`. Their
`Used by` links are intentionally relative to this audit; rebase those links
one directory shallower when copying the blocks into `research/claims.md`.
Source keys are either already in `research/references.bib` or supplied in the
bibliography handoff below.

### C-1440

- **Statement:** A time-bounded lease does not by itself exclude delayed effects
  from a prior holder after authority changes; stale-holder exclusion requires
  the protected resource to validate a monotonically ordered, resource-scoped
  epoch or lock sequencer (or an equivalent conditional-update boundary) and to
  reject older authority generations.
- **Status:** established mechanism and safety boundary for the cited lease and
  Chubby sequencer designs; performance is workload- and implementation-specific.
- **Primary sources:** `GrayCheriton1989Leases`, `Burrows2006Chubby`.
- **Rationale:** lease expiry limits authority under clock/recovery assumptions,
  while a checked generation orders effects at the resource even when an old
  process resumes or a delayed request arrives.
- **Open issue:** authenticate and bind token, resource, mode, payload,
  installation acknowledgement, durability, incarnation, and wraparound; then
  measure renewal, rejection, unavailability, latency, bytes, and work.
- **Used by:** [this audit](#sys-01--lease-expiry-is-not-stale-holder-exclusion),
  [OSD-T01](#osd-t01--lease-expiry-epoch-activation-and-stale-writer-fencing),
  [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md),
  and [sensorimotor grounding](../../concept/20-sensorimotor-grounding.md).

### C-1441

- **Statement:** Deterministic consensus has a possible nonterminating execution
  in the fully asynchronous one-crash FLP model; a liveness claim therefore must
  name the additional progress assumption, such as a specified partial-
  synchrony or failure-detector condition, separately from safety.
- **Status:** established for the cited formal models; implementation latency and
  availability remain empirical.
- **Primary sources:** `FischerLynchPaterson1985FLP`,
  `DworkLynchStockmeyer1988PartialSynchrony`, `chandra1996failure`.
- **Rationale:** timeouts and suspicions can enable progress under extended
  assumptions but do not turn network delay into ground-truth failure or make
  safety and liveness interchangeable.
- **Open issue:** every system must expose its channel, process, clock,
  stabilization, randomness, membership, quorum, adversary, and fault-count
  boundary and measure false suspicion, unavailable time, messages, and tails.
- **Used by:** [this audit](#sys-02--consensus-progress-is-assumption-qualified),
  [OSD-T02](#osd-t02--partial-synchrony-suspicions-and-progress-qualification),
  [Candidate 003](../../experiments/candidates/003-recovery-dynamics-fragility.md),
  [Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md),
  and [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1442

- **Statement:** After an unknown remote outcome, safe retry of a non-idempotent
  operation requires a stable request identity and durable duplicate/result
  state atomically coupled to the protected receiving effect, or an equivalent
  receiver-side conditional contract; sender retry or transport acknowledgement
  alone cannot guarantee an exactly-once external effect.
- **Status:** established boundary and implemented mechanism in the cited HTTP
  and RIFL scopes; arbitrary cross-system exactly-once effects are not claimed.
- **Primary sources:** `RFC9110HTTP`, `LeeEtAl2015RIFL`,
  `SaltzerReedClark1984`.
- **Rationale:** a response can be lost after an effect commits. Duplicate
  suppression works only while identity, result metadata, effect atomicity,
  migration, and retention remain inside the receiver's recovery boundary.
- **Open issue:** test client-incarnation reuse, payload alias, dedup expiry,
  metadata migration, crash at every commit edge, multiple receivers, physical
  side effects, receipt loss, and reconciliation cost.
- **Used by:** [this audit](#sys-04--retry-safety-belongs-to-the-receiving-effect-boundary),
  [OSD-T03](#osd-t03--unknown-outcomes-idempotence-and-duplicate-effects),
  [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 010](../../experiments/candidates/010-reset-coupled-staged-verification.md),
  [Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
  and [Candidate 015](../../experiments/candidates/015-versioned-repairable-conventions.md).

### C-1443

- **Statement:** A completion-paced or blocking load generator can suppress
  intended arrivals while the system stalls and thereby report an optimistically
  selected latency distribution; valid service-tail claims must identify the
  workload model and retain intended arrival-to-terminal outcomes, offered load,
  timeouts, and generator saturation.
- **Status:** established measurement-bias mechanism with empirical
  demonstrations in the cited open/closed and coordinated-omission studies;
  magnitude is workload- and generator-specific.
- **Primary sources:** `SchroederWiermanHarcholBalter2006OpenClosed`,
  `FriedrichWingerathRitter2017CoordinatedOmission`, `DeanBarroso2013`.
- **Rationale:** when arrivals depend on completions, slow intervals reduce both
  load and observation. Dispatch-to-completion quantiles then answer a different
  estimand from independently arriving users' response time.
- **Open issue:** compare open, closed, trace-replay, and corrected generators
  across burst, overload, timeout, fan-out, shared-generator bottleneck, clock,
  and censoring regimes with exact raw quantile reconstruction.
- **Used by:** [this audit](#sys-07--completion-paced-tests-can-erase-the-tail-they-claim-to-measure),
  [OSD-T05](#osd-t05--openclosed-load-coordinated-omission-and-tail-truth),
  [representative performance](../../concept/22-representative-adaptive-performance.md),
  [energy model](../../concept/80-energy-model.md), and
  [Fixture F-012](../../experiments/fixtures/012-layout-randomized-performance-inference.md).

### C-1444

- **Statement:** Linux cgroup v2 resource controls and Pressure Stall Information
  are controller- and scope-specific: CPU allocation does not establish memory,
  I/O, accelerator, network, helper-process, or energy isolation, while CPU,
  memory, and I/O stall time remain distinct observations.
- **Status:** established for the cited Linux interface documentation; cross-
  platform behavior and performance effects are empirical.
- **Primary sources:** `LinuxCgroupV2_2026`, `LinuxPSI_2026`.
- **Rationale:** one process label or CPU quota cannot bound work and waiting on
  resources governed, accounted, or shared through other mechanisms; CPU time is
  not a calibrated joule measure.
- **Open issue:** declare kernel/configuration, scheduler class, frequency,
  memory/reclaim, I/O, page cache, helpers, accelerator, network, thermal, meter,
  and accepted-service boundaries, then test contention transfer and control cost.
- **Used by:** [this audit](#sys-08--os-resource-isolation-is-a-vector-not-a-process-label),
  [OSD-T06](#osd-t06--controller-scope-cross-resource-pressure-and-accepted-service),
  [representative performance](../../concept/22-representative-adaptive-performance.md),
  [physical-computation boundaries](../../concept/28-physical-computation-boundaries.md),
  and [energy model](../../concept/80-energy-model.md).

## Source-role inventory

### Reuse existing bibliography keys

`SaltzerReedClark1984`, `chandra1996failure`, `herlihy1990linearizability`,
`gilbert2002cap`, `mohan1992aries`, `ChandyLamport1985Snapshots`,
`castro1999pbft`, `ongaro2014raft`, `DeanBarroso2013`, and `w3cprov`.

### New keys supplied below

| Key | Primary role | Boundary retained |
| --- | --- | --- |
| `GrayCheriton1989Leases` | lease mechanism and clock/failure model | lease is not unchecked eternal authority |
| `Burrows2006Chubby` | lock generations and recipient-validated sequencers | advisory lock belief is not resource fencing |
| `FischerLynchPaterson1985FLP` | asynchronous deterministic-consensus nontermination result | model-specific impossibility, not “networks can never agree” |
| `DworkLynchStockmeyer1988PartialSynchrony` | partial-synchrony models and consensus | liveness depends on named bounds/stabilization conditions |
| `LeeEtAl2015RIFL` | durable exactly-once RPC/result-tracking system | implementation scope and metadata retention/migration remain explicit |
| `RFC9110HTTP` | current HTTP idempotence/retry semantics | intended method effect, not global execution count |
| `SchroederWiermanHarcholBalter2006OpenClosed` | open versus closed workload behavior | workload model is part of the estimand |
| `FriedrichWingerathRitter2017CoordinatedOmission` | coordinated-omission benchmark demonstration | correction remains assumption-qualified |
| `OCallahanEtAl2017RR` | practical user-space deterministic replay | hardware/OS/nondeterminism and low-parallelism scope |
| `LinuxCgroupV2_2026` | current authoritative cgroup v2 interface | Linux version/configuration/controller scope |
| `LinuxPSI_2026` | current authoritative PSI interface | stall observation is not full causality or energy |
| `KingsburyAlvaro2021Elle` | history-based isolation anomaly inference | supported datatypes/anomalies, not universal checker completeness |
| `ChenEtAl2025CAFault` | current configuration-aware fault injection | experimental bug finding, not a field failure rate or proof |

## Copy-ready bibliography handoff

```bibtex
@inproceedings{GrayCheriton1989Leases,
  author    = {Gray, Cary G. and Cheriton, David R.},
  title     = {Leases: An Efficient Fault-Tolerant Mechanism for Distributed File Cache Consistency},
  booktitle = {Proceedings of the Twelfth ACM Symposium on Operating Systems Principles},
  year      = {1989},
  pages     = {202--210},
  publisher = {Association for Computing Machinery},
  doi       = {10.1145/74850.74870},
  url       = {https://doi.org/10.1145/74850.74870}
}

@inproceedings{Burrows2006Chubby,
  author    = {Burrows, Mike},
  title     = {The Chubby Lock Service for Loosely-Coupled Distributed Systems},
  booktitle = {7th USENIX Symposium on Operating Systems Design and Implementation},
  year      = {2006},
  pages     = {335--350},
  publisher = {USENIX Association},
  url       = {https://www.usenix.org/conference/osdi-06/chubby-lock-service-loosely-coupled-distributed-systems}
}

@article{FischerLynchPaterson1985FLP,
  author  = {Fischer, Michael J. and Lynch, Nancy A. and Paterson, Michael S.},
  title   = {Impossibility of Distributed Consensus with One Faulty Process},
  journal = {Journal of the ACM},
  year    = {1985},
  volume  = {32},
  number  = {2},
  pages   = {374--382},
  doi     = {10.1145/3149.214121},
  url     = {https://doi.org/10.1145/3149.214121}
}

@article{DworkLynchStockmeyer1988PartialSynchrony,
  author  = {Dwork, Cynthia and Lynch, Nancy and Stockmeyer, Larry},
  title   = {Consensus in the Presence of Partial Synchrony},
  journal = {Journal of the ACM},
  year    = {1988},
  volume  = {35},
  number  = {2},
  pages   = {288--323},
  doi     = {10.1145/42282.42283},
  url     = {https://doi.org/10.1145/42282.42283}
}

@inproceedings{LeeEtAl2015RIFL,
  author    = {Lee, Collin and Park, Seo Jin and Kejriwal, Ankita and Matsushita, Satoshi and Ousterhout, John},
  title     = {Implementing Linearizability at Large Scale and Low Latency},
  booktitle = {Proceedings of the 25th Symposium on Operating Systems Principles},
  year      = {2015},
  pages     = {71--86},
  publisher = {Association for Computing Machinery},
  doi       = {10.1145/2815400.2815416},
  url       = {https://doi.org/10.1145/2815400.2815416}
}

@techreport{RFC9110HTTP,
  author      = {Fielding, Roy T. and Nottingham, Mark and Reschke, Julian},
  title       = {{HTTP} Semantics},
  institution = {Internet Engineering Task Force},
  year        = {2022},
  number      = {RFC 9110},
  doi         = {10.17487/RFC9110},
  url         = {https://www.rfc-editor.org/rfc/rfc9110.html}
}

@inproceedings{SchroederWiermanHarcholBalter2006OpenClosed,
  author    = {Schroeder, Bianca and Wierman, Adam and Harchol-Balter, Mor},
  title     = {Open Versus Closed: A Cautionary Tale},
  booktitle = {3rd Symposium on Networked Systems Design and Implementation},
  year      = {2006},
  pages     = {239--252},
  publisher = {USENIX Association},
  url       = {https://www.usenix.org/conference/nsdi-06/open-versus-closed-cautionary-tale}
}

@inproceedings{FriedrichWingerathRitter2017CoordinatedOmission,
  author    = {Friedrich, Steffen and Wingerath, Wolfram and Ritter, Norbert},
  title     = {Coordinated Omission in {NoSQL} Database Benchmarking},
  booktitle = {Datenbanksysteme f{\"u}r Business, Technologie und Web 2017 -- Workshopband},
  year      = {2017},
  pages     = {215--225},
  publisher = {Gesellschaft f{\"u}r Informatik e.V.},
  url       = {https://dl.gi.de/items/780bef9a-d6df-4776-80e3-e85ae0158e63}
}

@inproceedings{OCallahanEtAl2017RR,
  author    = {O'Callahan, Robert and Jones, Chris and Froyd, Nathan and Huey, Kyle and Noll, Albert and Partush, Nimrod},
  title     = {Engineering Record and Replay for Deployability},
  booktitle = {2017 USENIX Annual Technical Conference},
  year      = {2017},
  pages     = {377--389},
  publisher = {USENIX Association},
  isbn      = {978-1-931971-38-6},
  url       = {https://www.usenix.org/conference/atc17/technical-sessions/presentation/ocallahan}
}

@misc{LinuxCgroupV2_2026,
  author = {Heo, Tejun},
  title  = {Control Group v2},
  year   = {2026},
  url    = {https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html},
  note   = {Official Linux kernel documentation; accessed 2026-08-24}
}

@misc{LinuxPSI_2026,
  author = {Weiner, Johannes},
  title  = {Pressure Stall Information},
  year   = {2026},
  url    = {https://www.kernel.org/doc/html/latest/accounting/psi.html},
  note   = {Official Linux kernel documentation; accessed 2026-08-24}
}

@article{KingsburyAlvaro2021Elle,
  author  = {Kingsbury, Kyle and Alvaro, Peter},
  title   = {Elle: Inferring Isolation Anomalies from Experimental Observations},
  journal = {Proceedings of the VLDB Endowment},
  year    = {2021},
  volume  = {14},
  number  = {3},
  pages   = {268--280},
  doi     = {10.14778/3430915.3430918},
  url     = {https://doi.org/10.14778/3430915.3430918}
}

@inproceedings{ChenEtAl2025CAFault,
  author    = {Chen, Yuanliang and Ma, Fuchen and Zhou, Yuanhang and Yan, Zhen and Jiang, Yu},
  title     = {{CAFault}: Enhance Fault Injection Technique in Practical Distributed Systems via Abundant Fault-Dependent Configurations},
  booktitle = {2025 USENIX Annual Technical Conference},
  year      = {2025},
  pages     = {1409--1424},
  publisher = {USENIX Association},
  isbn      = {978-1-939133-48-9},
  url       = {https://www.usenix.org/conference/atc25/presentation/chen-yuanliang}
}
```

## Audit disposition

- **Proposed claims:** five, `C-1440`--`C-1444`.
- **CPU-only protocol specifications:** six, `OSD-T01`--`OSD-T06`; none is an
  executed result.
- **New principles:** zero.
- **New candidates:** zero.
- **No empirical project results:** no protocol has run; all thresholds are
  preregistered falsification targets or design sensitivities.
- **Deduplicated without a new claim:** end-to-end placement, failure-detector
  classes, linearizability/serializability/CAP, quorum arithmetic, WAL,
  distributed snapshots, deterministic replay, crash/Byzantine boundaries,
  tail-at-scale/hedging, generic provenance, and generic fault-injection
  representativeness.
- **Next executable step:** integrate the five claim blocks and 13 new
  bibliography entries, then implement one fixture only after a frozen event
  schema, generator, oracle, seed split, analysis module, workstation manifest,
  and claim-ineligible smoke mode exist.

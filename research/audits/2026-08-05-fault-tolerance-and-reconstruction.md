# Fault tolerance and reconstruction: engineering null-model audit

<!-- markdownlint-disable MD013 -->

**Date:** 2026-08-05

**Scope:** error-correcting and erasure codes, checkpoint/restart, replication,
Byzantine fault tolerance, failure detectors, self-stabilization, integrity
scrubbing, graceful degradation, and repair locality

**Purpose:** determine which biological repair and regeneration proposals are
already established engineering, and isolate any testable remainder.

## Executive finding

Most current repair language in this project deduplicates into mature
engineering. Redundant candidates, checkpoints, logs, replicas, checksums,
background verification, failure detection, and invariant-restoring feedback
are not biologically novel at the level presently stated. They are strong
baselines and should be adopted where their assumptions hold.

The decisive distinction is the **recovery contract**:

1. **Exact restore:** return to a previously saved bit state (checkpoint,
   snapshot, replica, or log replay).
2. **Encoded reconstruction:** recover the unique source or missing fragment
   licensed by a redundancy code.
3. **Legitimate-set convergence:** reach any state in an explicitly specified
   acceptable set from an arbitrary state (self-stabilization or feedback).
4. **Constraint-guided functional reconstruction:** infer what capability is
   missing from partial context, synthesize one of multiple acceptable repairs,
   preserve unaffected behavior, and validate the result without possessing an
   exact target copy.

The first three are established engineering families. The fourth is the only
distinct candidate left by this audit, and even it is not a novelty claim:
diagnosis, planning, optimization, program repair, architecture search, and
model editing are adjacent null models. It becomes scientifically meaningful
only if a precisely specified mechanism beats those baselines when no clean
checkpoint or replica contains the required target state.

This conclusion narrows the interpretation of [C-033](../claims.md#c-033) and
[C-056](../claims.md#c-056). Planarian positional context suggests a useful
**target-constraint** analogy; microbiome capability-gap repair suggests a
useful **candidate-selection** tactic. Neither supports a claim that digital
systems lack repair, nor that a biological mechanism will be cheaper or more
reliable than exact digital restoration.

## Audit method and evidence boundary

The audit asks the same questions of every mechanism:

- What failure is it designed to handle?
- What assumptions make the guarantee possible?
- Where does validation information reside, and along which paths does it
  travel?
- What latency, communication, storage, computation, and energy are paid?
- Is the guarantee detection, availability, exact recovery, convergence, or
  merely best-effort service?
- Which correlated, semantic, adversarial, or out-of-model failures remain?

The sources are foundational peer-reviewed papers, primary conference papers,
or authoritative system documentation. Their guarantees are not portable
outside their stated fault and timing models. In particular, a checksum is not
a semantic oracle, replication is not diversity, recovery is not correctness,
and availability is not preservation of model quality.

## Mechanism-family map

| Family | Exact problem | Information and communication path | Dominant costs | Recovery guarantee | Hard boundary | Project disposition |
| --- | --- | --- | --- | --- | --- | --- |
| Distance-based error correction | Recover a codeword after bounded symbol corruption | Decoder reads a received word plus redundant symbols | Redundant symbols, encode/decode work, read energy | Unique bounded-distance recovery | Errors beyond distance; decoder/model mismatch; semantic corruption that remains a valid codeword | Established null for local state corruption |
| MDS erasure coding | Reconstruct known missing fragments | Any sufficient set of surviving fragments feeds a decoder | Storage overhead, fragment reads, network transfer, decode work | Exact source recovery from a bounded number of known erasures | Too many/correlated erasures; bad fragments mistaken as good; no semantic repair | Established null for missing shards/experts with encoded state |
| Regenerating and local-repair codes | Reduce traffic and fan-in of reconstruction | Replacement contacts selected surviving nodes; helpers send fragments or functions | Storage–bandwidth–locality tradeoff | Exact or functional coded-node repair, depending on code | Does not infer a new desired function; locality can reduce distance or add redundancy | Established null for repair locality |
| Checkpoint/restart | Avoid repeating an entire computation after fail-stop loss | Task periodically writes recoverable state; recovery reads latest valid checkpoint | Checkpoint I/O, storage, pause or copy overhead, lost work, restart latency | Exact rollback to saved state | Corrupt/stale checkpoint, latent error before checkpoint, external side effects, semantic failure | Established P-009/P-013 mechanism |
| Crash-fault replication and log consensus | Keep one ordered state despite crashes and partitions | Leader/orderer replicates log entries to a quorum; followers acknowledge | Multiple copies, write amplification, quorum latency, log/checkpoint storage | Consistent replicated state while a quorum is available | Byzantine behavior, common-mode bugs, minority partition availability, bad commands faithfully replicated | Established P-004/P-013 mechanism |
| Byzantine state-machine replication | Preserve an ordered service despite bounded arbitrary faulty replicas | Authenticated client and replica messages; pre-prepare/prepare/commit quorums | At least \(3f+1\) replicas, all-to-all phases, cryptography, logs/checkpoints | Safety with at most \(f\) Byzantine replicas; liveness only under timing/progress assumptions | More than \(f\) faults, shared implementation/credential compromise, nondeterminism, privacy leakage | Established adversarial null |
| Failure detectors | Supply suspicions needed by recovery/consensus despite ambiguous delay | Heartbeats, probes, acknowledgements, timeouts, or other observations | Monitoring traffic, timeout latency, false suspicions | Completeness/accuracy class, not perfect diagnosis in pure asynchrony | Cannot intrinsically distinguish a slow process from a failed one | Established sensing layer; not repair |
| Integrity scrubbing | Discover latent corruption before redundancy is exhausted | Scanner reads all reachable blocks, verifies checksums, fetches good replica/parity on mismatch | Full-scan I/O, contention, read energy, repair writes | Detection of checksum mismatch; exact repair only when valid redundancy remains | No valid copy, collision/bug outside integrity boundary, semantic invalidity | Established P-009 maintenance loop |
| Self-stabilization | Recover from arbitrary transient state without an external checkpoint | Local processes repeatedly read permitted state and apply transition rules | Convergence steps, messages, transient service loss, rule-execution energy | Eventual convergence to an encoded legitimate-state set under scheduler/model assumptions | Permanent/adversarial faults, unfair execution, wrong legitimate set, no preservation of prior semantics | Established P-006/P-009 null |
| Graceful degradation | Retain a declared subset or lower level of service after loss | Router/controller excludes failed capacity and reallocates surviving resources | Spare capacity, overload risk, increased latency, reduced quality, rebuild exposure | A service vector, not necessarily state recovery | Threshold exhaustion, cascading load, undeclared quality loss | Required evaluation mode, not a single algorithm |
| Constraint-guided functional reconstruction | Restore missing behavior when no exact target copy exists | Diagnose gap from probes/context; propose repair; validate against constraints and regressions; commit/rollback | Search, evaluation, sandbox capacity, provenance, validation energy | Hypothesis: acceptable functional state, not bit identity | Underspecified constraints, reward hacking, collateral damage, false diagnosis, untestable functions | Distinct candidate only after decisive baseline comparison |

## 1. Error correction and erasure reconstruction

### Problem and formal guarantee

For a \(q\)-ary block code \(C \subseteq \mathbb{F}_q^n\), let \(n\) be the
number of stored or transmitted symbols, \(k\) the number of source symbols for
a linear code, and \(d_{\min}\) the minimum Hamming distance between distinct
codewords. Distance gives exact bounded-fault statements:

$$
t_{\mathrm{error}} = \left\lfloor\frac{d_{\min}-1}{2}\right\rfloor,
\qquad
t_{\mathrm{erasure}} = d_{\min}-1.
$$

The first number is the maximum count of unknown-location symbol errors that a
bounded-distance decoder is guaranteed to correct. The second is the maximum
count of known-location erasures that is uniquely recoverable. Hamming's
foundational treatment makes redundancy and minimum distance an engineering
recovery mechanism, not an analogy ([Hamming 1950](https://onlinelibrary.wiley.com/doi/10.1002/j.1538-7305.1950.tb00463.x)).

An \([n,k]\) Reed–Solomon code is maximum-distance separable under its finite
field and code-length assumptions, so

$$
d_{\min}=n-k+1.
$$

Any \(k\) valid symbols reconstruct the source; therefore up to \(n-k\) known
erasures or \(\lfloor(n-k)/2\rfloor\) unknown symbol errors are correctable
([Reed and Solomon 1960](https://epubs.siam.org/doi/10.1137/0108018)). The
storage expansion is \(n/k\), or redundancy fraction \((n-k)/k\) relative to
the uncoded source. Reads, finite-field arithmetic, memory traffic, and network
movement must be charged separately; “only \(n-k\) parity symbols” is not an
energy measurement.

### Information path and assumptions

The target is already present implicitly in the code constraints. The decoder
does not decide what the data _should mean_; it selects the unique codeword
consistent with the received symbols and the fault bound. Detection requires a
syndrome, checksum, erasure notification, or a decoder that recognizes that the
word is outside the valid code set. A wrong but valid codeword can pass the
code-level check.

The guarantee assumes:

- encoding occurred before the failure;
- the code and symbol boundaries are known and implemented correctly;
- the number and kind of faults fall within the code's distance;
- surviving symbols and decoder computation are trustworthy enough; and
- correlated faults do not erase more independent symbols than the placement
  model permits.

This is a decisive null for claims that a missing expert, memory page, routing
table segment, or parameter shard can be “regenerated.” If its exact contents
were coded beforehand, reconstruction is already solved under a crisp fault
budget.

### Repair bandwidth and locality

Full reconstruction may recover the original object but still be wasteful for
one missing node. In the regenerating-code model, a file of \(B\) symbols is
stored across \(n\) nodes, any \(k\) of which recover it. Each node stores
\(\alpha\) symbols. A replacement contacts \(d_h\) surviving helper nodes and
downloads \(\beta\) symbols from each, so repair bandwidth is

$$
\gamma=d_h\beta,
$$

with the information-flow cut bound

$$
B \leq \sum_{i=0}^{k-1}
\min\!\left(\alpha,(d_h-i)\beta\right).
$$

Here \(d_h\) is the helper count, not code distance. This formalizes an
unavoidable storage–repair-bandwidth tradeoff. The original construction
permits **functional repair**: the replacement need not contain the same bits
as the lost node, but the global “any \(k\) nodes recover the file” invariant
must remain true ([Dimakis et al. 2010](https://arxiv.org/abs/0803.0632)). This
is already a non-identical repair that preserves function, but the function is
an explicitly encoded data-recovery invariant.

For a linear code with information-symbol locality \(r\), a coordinate is
locally repairable when it can be recovered by reading \(r\) other coordinates.
The Gopalan et al. bound can be written

$$
d_{\min} \leq n-k-\left\lceil\frac{k}{r}\right\rceil+2.
$$

Small repair fan-in therefore competes with redundancy and worst-case distance
([Gopalan et al. 2012](https://www.microsoft.com/en-us/research/publication/on-the-locality-of-codeword-symbols/)).
Windows Azure's Local Reconstruction Codes demonstrate the practical version:
additional local structure reduces fragments read, network bandwidth, I/O, and
degraded-read latency while retaining low storage overhead
([Huang et al. 2012](https://www.usenix.org/conference/atc12/technical-sessions/presentation/huang)).

For energy accounting, if a repair reads \(b_r\) bytes, transmits \(b_n\)
bytes, writes \(b_w\) bytes, and performs \(N_{ff}\) finite-field operations,
a minimally honest model is

$$
E_{\mathrm{repair}} =
b_r e_{\mathrm{read}} + b_n e_{\mathrm{net}} +
b_w e_{\mathrm{write}} + N_{ff}e_{ff},
$$

where each \(e\) is measured in joules per byte or joules per operation on a
declared hardware and placement configuration. The terms change with device,
topology, load, and code implementation; none should be imported as a universal
constant.

### Coding deduplication result

- “Use redundancy to regrow a missing module” deduplicates into erasure coding,
  replication, or checkpoint restoration when the desired module state is
  already encoded.
- “Repair from nearby modules” deduplicates into locality and regenerating-code
  optimization when nearby state contains sufficient coded information.
- A candidate remains only when the correct new module is not reconstructable
  from any stored codeword and must instead be inferred from task constraints.

## 2. Checkpoint, restart, snapshots, and logs

### Problem and cost model

Checkpoint/restart periodically stores enough application state to restart
from a prior point after a fail-stop event. Let:

- \(T\) be useful computation time between checkpoints, in seconds;
- \(C\) be checkpoint duration, in seconds;
- \(M\) be mean time to failure under the assumed Poisson model, in seconds;
- \(R\) be restart/reload time, in seconds.

A first-order lost-time fraction is

$$
W(T) \approx \frac{C}{T} + \frac{T}{2M} + \frac{R}{M}.
$$

The variable terms give the Young approximation

$$
T^* \approx \sqrt{2CM}.
$$

Checkpointing more often increases normal-path I/O; checkpointing less often
increases expected rework after a failure. Young introduced the first-order
interval ([Young 1974](https://doi.org/10.1145/361147.361115)); Daly derived a
higher-order estimate with a more complete cost function for Poisson
single-component failures ([Daly 2006](https://laro.lanl.gov/esploro/outputs/journalArticle/A-higher-order-estimate-of-the/9916364420003761)).
These formulas are null models, not prescriptions for bursty, correlated,
non-stationary, or semantic failures.

### Information path, guarantee, and boundary

The task writes a versioned state image to a failure-independent enough store.
Recovery locates the newest valid image, reloads it, and optionally replays a
write-ahead or command log. A distributed snapshot can preserve a consistent
cut without halting all participants, but consistency of the captured state is
not correctness of the application's beliefs.

Checkpoint/restart guarantees rollback to what was saved. It loses work after
the checkpoint and may duplicate or omit external side effects unless those
are coordinated. It also faithfully preserves a latent software bug, poisoned
training state, incorrect memory, or silent corruption that entered before the
checkpoint was certified. Multiple generations and validation reduce this
risk but add storage, read, and evaluation cost.

For AI systems, the direct baseline is not merely “retrain the model.” It is:

- restore model parameters, optimizer state, router state, memory indexes, and
  data-stream position from a validated checkpoint;
- replay an append-only event or training log after the checkpoint;
- fail over to a shadow or prior model version; and
- roll back only the damaged expert, adapter, memory partition, or routing
  table when state boundaries permit it.

These are direct implementations of [P-009](../principle-registry.md#p-009--maintenance-plane)
and [P-013](../principle-registry.md#p-013--externalized-shared-state). A slower
maintenance controller and an external versioned store remain good design
choices, but their existence is not a biological contribution.

## 3. Replication, consensus, and Byzantine faults

### Crash-fault replicated logs

Raft is a representative crash-fault consensus null model. A leader receives a
command, appends it to its log, sends it to followers, and commits after a
majority has stored it; followers then apply the ordered command to their state
machines. For \(N=2f+1\) replicas, a majority quorum can make progress with up
to \(f\) crashed or unreachable replicas, provided a majority can communicate
and stable state obeys the protocol. Membership changes use overlapping
majorities ([Ongaro and Ousterhout 2014](https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro)).

The normal information path is client → leader → followers → majority
acknowledgement → commit/application → response. The system pays \(N\)-way log
storage (subject to snapshotting), write amplification, at least a quorum round
trip before safe acknowledgement, heartbeats, election traffic, and recovery
transfer for lagging replicas. It remains available only on the majority side
of a partition.

Replication provides copies, not independent solutions. A deterministic
software defect, malicious update accepted by the protocol, poisoned training
batch, wrong objective, shared dependency failure, or credential compromise
can be reproduced across every replica. This is the central boundary for
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection):
replica count is not functional diversity unless failure independence is
measured.

The Google File System is a practical reference for this maintenance pattern:
commodity component failures are expected; metadata, chunk replication,
checksums, heartbeats, re-replication, and recovery workflows combine to retain
service ([Ghemawat, Gobioff, and Leung 2003](https://research.google/pubs/the-google-file-system/)).
Its lesson is architectural rather than universal: recovery depends on a
declared workload, fault model, replica placement, and centralized metadata
assumptions.

### Byzantine state-machine replication

PBFT extends replication to arbitrary faulty behavior under authenticated
communication and a bounded number of faulty replicas. To tolerate \(f\)
Byzantine replicas, the protocol uses at least

$$
N \geq 3f+1.
$$

A primary proposes an order; replicas exchange prepare and commit evidence;
clients accept sufficient matching replies; view change replaces a suspected
primary. Normal prepare/commit exchange is \(O(N^2)\) replica messages in the
original protocol, in addition to cryptographic work, replicated state, logs,
checkpoints, and state transfer. The 1999 implementation reported one measured
NFS configuration only; that historical overhead is not a portable cost
constant ([Castro and Liskov 1999](https://www.usenix.org/conference/osdi-99/presentation/practical-byzantine-fault-tolerance)).

Safety holds under the paper's replica, authentication, determinism, and fault
bound assumptions. Liveness requires progress/timing conditions sufficient for
timeouts and view changes; a fully asynchronous network cannot promise a fixed
completion time. PBFT does not make outputs semantically correct, conceal data
from replicas, or survive a common implementation bug that makes more than
\(f\) replicas fail identically.

### Replication deduplication result

- Protected candidate populations plus validation and rollback overlap with
  replicated services, shadow deployments, canaries, and quorum commitment.
- Biological diversity contributes a distinct hypothesis only when variants
  have demonstrably different failure modes and selection reduces common-mode
  risk more than it costs.
- An exact replicated state is usually a stronger and cheaper repair source
  than inferred regeneration. A biological reconstruction mechanism should be
  invoked only after showing why no trusted exact copy is available.

## 4. Failure detectors and integrity scrubbing

### Failure detectors are evidence channels, not oracles

In a purely asynchronous message-passing system, silence does not reveal
whether a process has crashed or a message/process is merely delayed. Chandra
and Toueg therefore specify failure detectors by **completeness** (which failed
processes are eventually suspected) and **accuracy** (which correct processes
are not suspected, and when), then show which detector classes suffice for
consensus under stated crash assumptions
([Chandra and Toueg 1996](https://doi.org/10.1145/226643.226647)).

If each monitored edge sends one heartbeat of \(b\) bytes every \(h\) seconds,
the nominal monitoring traffic is

$$
\dot{B}_{\mathrm{monitor}} = \frac{|E_m|b}{h}
\quad\text{bytes/s},
$$

where \(E_m\) is the directed set of monitored relationships. A timeout
\(\theta\) bounds suspicion latency only relative to timing assumptions; a
smaller \(\theta\) tends to raise false suspicions during queueing, overload,
or partitions. Recovery policy must therefore expose both missed-failure delay
and false-repair rate.

For this project, recovery-slowing evidence in [C-058](../claims.md#c-058) and
[C-059](../claims.md#c-059) should be compared with heartbeats, SLO residuals,
change detection, and online system identification. It may be valuable as a
graded fragility signal, but it is not a replacement for explicit fault
detection and it has no universal threshold.

### Scrubbing makes latent faults observable

OpenZFS provides an authoritative engineering example. A scrub reads all data
in a pool and verifies checksums; mirror, RAID-Z, or dRAID redundancy can supply
a good copy for automatic repair. Scrubbing differs from resilvering because it
searches all data for latent errors, rather than only data already known to be
out of date. The documentation explicitly notes that the operation is
I/O-intensive and serializes with resilvering
([OpenZFS 2024](https://openzfs.github.io/openzfs-docs/man/v2.3/8/zpool-scrub.8.html)).

For \(D\) bytes of reachable state, sustained scan bandwidth \(v\) bytes/s,
and measured read energy \(e_r\) joules/byte, lower-bound accounting is

$$
T_{\mathrm{scrub}} \geq \frac{D}{v},
\qquad
E_{\mathrm{scrub}} \geq D e_r,
$$

before checksum computation, metadata traversal, contention, repair reads,
network transfer, and repair writes. Scheduling a scrub is a trade between
normal-path cost and the time during which latent corruption can accumulate.

A checksum detects disagreement with previously recorded bits; it does not
prove those bits are factually or behaviorally correct. Without a valid
redundant copy, scrub can report damage but cannot reconstruct it. The AI
analogue must preserve this separation:

- **integrity scrub:** hash/checksum/version validation of parameters, indexes,
  artifacts, and logs;
- **behavior scrub:** replay held-out probes and invariants against active and
  shadow modules;
- **provenance scrub:** verify lineage, data version, signatures, and policy;
- **repair:** restore, replace, or synthesize only after diagnosis identifies a
  valid source or an explicit target constraint.

This is an established implementation of [P-009](../principle-registry.md#p-009--maintenance-plane).
Its potentially useful biological extension is adaptive probe selection under
a budget, not the existence of background maintenance.

## 5. Self-stabilization and homeostatic control

Dijkstra defined a self-stabilizing distributed system as one guaranteed to
reach a legitimate state in finite steps regardless of initial state, for the
specified distributed-control model
([Dijkstra 1974](https://doi.org/10.1145/361179.361202)). It is the strongest
engineering counterexample to a claim that repair always requires a stored
copy.

Let \(S\) be the state space, \(L\subseteq S\) the legitimate-state set, and
\(F:S\to 2^S\) the permitted transition relation under a scheduler. A standard
stabilization obligation has two parts:

1. **Convergence:** from every \(s_0\in S\), every fair execution reaches some
   \(s_t\in L\) in finite time.
2. **Closure:** once in \(L\), permitted executions remain in \(L\), absent a
   new fault.

No checkpoint needs to encode the exact target state. However, the legitimate
set and transition rules encode what counts as repaired. During convergence,
service may be wrong or unavailable; bounds depend on the topology, scheduler,
fault model, and algorithm. Persistent Byzantine faults, an unfair scheduler,
or a mistaken \(L\) can invalidate the guarantee.

This mechanism largely deduplicates the repair reading of
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback) and
[P-009](../principle-registry.md#p-009--maintenance-plane). Negative feedback
or local rules can restore an invariant without replaying a copy, but only
because the viable range or legitimate set has been engineered in advance.

[C-033](../claims.md#c-033) remains suggestive where local context appears to
select among different valid target structures. The precise computational
question is not “can a system recover without a checkpoint?”—self-stabilization
already answers yes. It is whether learned, distributed, context-dependent
target constraints can restore a missing _capability_ with less stored state,
coordination, and search than an explicitly programmed legitimate-set
controller.

## 6. Graceful degradation is a vector-valued contract

Graceful degradation should not be used as a synonym for successful repair. A
system may remain online while losing redundancy, latency margin, calibrated
confidence, safety coverage, modality coverage, or factual freshness.

Define a service vector before failure and during recovery:

$$
q(t) =
\bigl(
Q_{\mathrm{task}}(t),
L_{p99}(t),
A(t),
R_{\mathrm{safety}}(t),
C_{\mathrm{coverage}}(t),
P(t)
\bigr),
$$

where task quality \(Q_{\mathrm{task}}\) is dimensionless or task-specific,
tail latency \(L_{p99}\) is seconds, availability \(A\) is a fraction, residual
safety risk \(R_{\mathrm{safety}}\) is defined per decision/exposure, coverage
\(C_{\mathrm{coverage}}\) is a declared fraction, and power \(P\) is watts.
Report components rather than hiding them in one “resilience score.” This is
consistent with the opposing stability dimensions in
[C-057](../claims.md#c-057) and [C-060](../claims.md#c-060).

Replicated or coded storage can remain available in a degraded state after a
device loss, but reconstruction then consumes read/network/write capacity and
the system has less margin against another failure. Analogously, an AI router
may bypass a failed expert and preserve generic answers while silently losing a
language, modality, tool, or safety check. A correct evaluation therefore
measures:

- time to detect, isolate, restore minimum service, rebuild redundancy, and
  revalidate full service separately;
- quality and calibration by capability slice during the entire interval;
- extra energy, bytes moved, accelerator-hours, and storage;
- collateral regressions and false repair actions; and
- exposure to a second fault during degraded operation.

“It kept answering” is not a recovery guarantee.

## 7. Mapping to the current principle registry

| Project item | Established engineering core | What must be removed or qualified | Residual testable candidate |
| --- | --- | --- | --- |
| [P-004 — diversity, selection, protection](../principle-registry.md#p-004--diversity-selection-and-protection) | Replication, coding, shadow/canary variants, quorum commitment, rollback | Candidate count is not fault tolerance; identical variants share failure modes; selection can amplify one bad objective | Maintain variants targeted at measured, partially independent failure modes; show lower common-mode loss per joule and byte than replication/coding |
| [P-006 — homeostatic negative feedback](../principle-registry.md#p-006--homeostatic-negative-feedback) | Feedback control and self-stabilization restore declared ranges/legitimate states | “No stored blueprint” does not imply no encoded target; the target resides in rules, thresholds, topology, or loss | Learn context-dependent legitimate sets that preserve multiple functions, with stability and recovery bounds |
| [P-009 — maintenance plane](../principle-registry.md#p-009--maintenance-plane) | Monitoring, checkpointing, scrubbing, failover, garbage collection, repair orchestration | Background work is not free and is not biologically novel | Budgeted controller that selects probes and repair scope better than fixed schedules/thresholds without destabilizing the task plane |
| [P-013 — externalized shared state](../principle-registry.md#p-013--externalized-shared-state) | Logs, replicated state machines, snapshots, code fragments, blackboards | External state adds consistency, integrity, privacy, and movement costs; “shared memory” is already standard | Use compact, decaying, uncertainty-aware state only if it beats exact attributable logs on a declared coordination problem |
| [C-033 — positional-context regeneration](../claims.md#c-033) | Self-stabilization and constraint satisfaction already recover without exact-copy replay | Do not say engineering restoration requires a complete stored copy | Context-conditioned target inference when multiple repairs satisfy global constraints and no exact target is stored |
| [C-056 — capability-gap repair](../claims.md#c-056) | Diagnosis, set cover, module search, dependency resolution, architecture search, and replacement | Three selected biological strains do not establish general digital repair efficiency | Gap-derived candidate generation/admission that beats size-matched search and standard optimization while preserving unaffected capabilities |
| [C-057](../claims.md#c-057) / [C-060](../claims.md#c-060) — resilience tradeoffs | Reliability engineering already separates availability, durability, latency, and fault coverage | Avoid a scalar “resilience” claim | Use the service vector and measure whether diversity improves one axis by sacrificing another |
| [C-058](../claims.md#c-058) / [C-059](../claims.md#c-059) — recovery-based warning | Heartbeats, failure detectors, residual tests, CUSUM, and system identification are nulls | Slowing recovery is neither universal nor a fault classifier | Active low-cost probes that add warning lead time at controlled false-positive and service cost |

## 8. The remaining candidate: constraint-guided functional reconstruction

### Operational definition

A repair qualifies for this candidate only if all of the following hold:

1. An exact clean checkpoint, replica, log replay, or coded reconstruction of
   the desired module is unavailable or intentionally excluded in a stated
   ablation.
2. The target is underdetermined: multiple internal states could restore the
   required service.
3. Local and global constraints specify acceptable behavior more cheaply than
   a complete target parameter state.
4. The mechanism diagnoses a missing capability, proposes a bounded repair,
   validates it in shadow/sandbox execution, measures collateral regressions,
   and can roll back.
5. It beats engineering nulls on a predeclared multi-objective frontier rather
   than on recovery accuracy alone.

Let failed system \(M_f\), context \(x\), repair action \(a\), required
constraints \(g_j\), preserved capability set \(U\), and resource costs be
given. A minimal formulation is

$$
\begin{aligned}
\min_a\quad &
E(a)+\lambda_t T(a)+\lambda_s S(a)+
\lambda_c\Delta_U(M_f,a) \\
\text{subject to}\quad &
g_j(M_f\oplus a,x)\leq 0,\quad j=1,\ldots,m,\\
&R_{\mathrm{safety}}(M_f\oplus a)\leq \rho,\\
&a\in\mathcal{A}_{\mathrm{rollback}}.
\end{aligned}
$$

\(E\) is joules, \(T\) seconds, \(S\) bytes of new/changed state,
\(\Delta_U\) a declared dimensionless regression loss on unaffected
capabilities, \(g_j\) measurable constraint violations, \(\rho\) a risk bound,
and \(\mathcal{A}_{\mathrm{rollback}}\) the set of actions with preserved
provenance and reversible deployment. The coefficients convert unlike units
only if their interpretation is declared; otherwise report a Pareto frontier.

This formulation reveals the adjacency to ordinary constrained optimization.
The biological lead can contribute how constraints are distributed, how repair
scope is localized, or how candidates are generated—not the optimization
problem's existence.

### Decisive AI repair/recovery comparison

The first benchmark should use a modular model with independently corruptible
experts/adapters, a versioned memory store, and observable routing. Inject at
least six fault classes:

1. random bit/parameter corruption within one module;
2. complete loss of one module or shard;
3. stale but internally valid module state;
4. poisoned latest checkpoint with an older clean checkpoint available;
5. common-mode semantic defect present in every replica/checkpoint; and
6. capability loss with intact bytes, such as routing suppression or a
   distribution shift invalidating one specialization.

Compare, with identical detection evidence and resource caps:

| Baseline | Recovery source | Expected strong region | Decisive weakness tested |
| --- | --- | --- | --- |
| B0 no repair / bypass | Surviving modules only | Minimum degraded service | Quantifies whether any repair is worth its cost |
| B1 exact module checkpoint | Latest validated saved state | Random corruption or deletion | Staleness, poisoned checkpoint, post-checkpoint learning loss |
| B2 checkpoint plus log replay | Saved state plus ordered deltas/events | Recoverable recent state | Log completeness, deterministic replay, side effects |
| B3 replicated failover / quorum | Synchronized copies | Independent crash or corruption within replica bound | Common-mode semantic defects and storage/communication cost |
| B4 erasure/local reconstruction | Coded fragments | Missing/corrupted shard within code bound | Repair bandwidth, code-bound exhaustion, semantic failure |
| B5 restore then bounded fine-tune | Prior state plus current repair data | Moderate drift or stale checkpoint | Compute/energy and collateral forgetting |
| B6 fresh adapter/expert search | Training/architecture search | Novel missing capability | Search cost and data need |
| B7 explicit invariant controller | Hand-specified legitimate set and local rules | Known structural/service invariants | Constraint engineering and unmodeled semantics |
| B8 capability-gap constrained repair | Diagnosed gap plus contextual constraints | Underdetermined target with no clean exact copy | False diagnosis, reward hacking, regression, validation cost |

Predeclare these primary endpoints:

- restored quality per capability slice and worst-slice quality;
- residual safety risk and calibration error;
- detection, minimum-service, repair, and full-validation latency in seconds;
- energy in joules, average/peak power in watts, accelerator-seconds, bytes
  read/transmitted/written, and storage expansion;
- fraction of unaffected capabilities regressed beyond a fixed tolerance;
- false-repair and rollback rates; and
- probability of recovery under a second fault during rebuilding.

The candidate survives only if B8 occupies a useful Pareto region specifically
for faults 5–6, while B1–B4 should win on faults 1–2 if exact digital state is
available. Claiming otherwise would ignore one of digital systems' real
advantages over biology: cheap exact copying.

## 9. Failure boundaries that must stay visible

- **Encoded state is not intended state.** Codes, replicas, and logs preserve
  what was encoded, including a valid but wrong model.
- **Detection is not diagnosis.** A timeout or checksum locates evidence of a
  fault, not the correct semantic repair.
- **Diversity is not independence.** Copies trained on the same objective,
  data, code, and hardware can fail together.
- **Local repair is not globally safe.** Low fan-in can reduce traffic while a
  locally plausible change violates remote behavior.
- **Convergence is not continuity.** A self-stabilizing process may eventually
  recover while providing invalid service during convergence.
- **Availability is not capability coverage.** A model can answer while a
  specialization or safety path is absent.
- **Background work consumes the same machine.** Scrubs, replicas, shadow
  evaluation, replay, and repair compete for bandwidth, memory, power, and
  thermal headroom.
- **A biological target analogy is not a target specification.** “Regenerate
  what is missing” must become measurable constraints and validation tests.

## Proposed claims for ledger integration

The identifiers below are provisional audit-local labels; the root integration
should assign the next stable `C-` IDs.

### C-FT-01 — Distance bounds exact correction guarantees

- **Statement:** For a code with minimum Hamming distance \(d_{\min}\), unique
  bounded-distance decoding corrects at most
  \(\lfloor(d_{\min}-1)/2\rfloor\) unknown-location symbol errors or
  \(d_{\min}-1\) known erasures under the code and decoder assumptions.
- **Proposed status:** established.
- **Primary sources:** `hamming1950error`; `reed1960polynomial` for the MDS
  Reed–Solomon specialization.
- **Rationale:** Exact reconstruction from deliberately encoded redundancy is
  the null model for “regrowing” lost digital state.
- **Open question:** Which AI state boundaries permit coding without making
  encode/decode and synchronization cost dominant?
- **Affected principles:** P-004, P-009, P-013.

### C-FT-02 — Repair locality has unavoidable resource tradeoffs

- **Statement:** Distributed storage codes trade storage per node, repair
  bandwidth, locality, and erasure distance; reducing the number of helpers or
  bytes read is not a free improvement in robustness.
- **Proposed status:** established.
- **Primary sources:** `dimakis2010network`; `gopalan2012locality`;
  `huang2012azure`.
- **Rationale:** Local and function-preserving reconstruction already exist as
  formal engineering mechanisms.
- **Open question:** Can modular AI state expose sufficient algebraic or
  semantic structure for low-fan-in repair without harmful coupling?
- **Affected principles:** P-004, P-009.

### C-FT-03 — Checkpoint frequency trades normal cost against expected rework

- **Statement:** Under Poisson fail-stop assumptions, checkpoint/restart has an
  optimal interval determined by checkpoint duration and failure rate; exact
  rollback loses post-checkpoint work and does not remove corruption already
  present in the saved state.
- **Proposed status:** established.
- **Primary sources:** `young1974checkpoint`; `daly2006checkpoint`.
- **Rationale:** Checkpoint restoration is the minimum serious baseline for AI
  module regeneration.
- **Open question:** How should semantic validation latency and energy modify
  checkpoint schedules for learned systems?
- **Affected principles:** P-009, P-013.

### C-FT-04 — Failure detectors expose completeness/accuracy assumptions

- **Statement:** In asynchronous crash-prone systems, failure detectors are
  characterized by completeness and accuracy rather than perfect instantaneous
  diagnosis; monitoring latency and false suspicion are coupled through timing
  assumptions.
- **Proposed status:** established.
- **Primary source:** `chandra1996failure`.
- **Rationale:** A repair controller must price and report detection errors,
  not treat a health signal as ground truth.
- **Open question:** Do recovery-dynamics probes add calibrated lead time over
  standard detectors and residual tests at equal disturbance and energy?
- **Affected principles:** P-006, P-009.

### C-FT-05 — Replication guarantees are fault-model bounded

- **Statement:** Majority crash-fault replication maintains an ordered log
  while a quorum is available, whereas PBFT requires at least \(3f+1\)
  replicas to tolerate \(f\) Byzantine faults under its model; neither protects
  against unrestricted common-mode semantic failure.
- **Proposed status:** established.
- **Primary sources:** `ongaro2014raft`; `castro1999pbft`.
- **Rationale:** Replication is the null for protected populations, but shared
  failure modes determine whether nominal diversity is useful.
- **Open question:** Can deliberately heterogeneous experts reduce measured
  common-mode failures enough to repay selection and validation cost?
- **Affected principles:** P-004, P-009, P-013.

### C-FT-06 — Self-stabilization repairs without an exact checkpoint

- **Statement:** A self-stabilizing distributed algorithm can converge from an
  arbitrary initial state to an encoded legitimate-state set without an
  external exact copy, under its scheduler and fault assumptions.
- **Proposed status:** established.
- **Primary source:** `dijkstra1974selfstabilizing`.
- **Rationale:** This is the necessary engineering null for biological
  “target-state” repair; the intended set is encoded in rules rather than a
  snapshot.
- **Open question:** Can learned context-dependent target constraints retain
  convergence and closure guarantees?
- **Affected principles:** P-006, P-009; C-033.

### C-FT-07 — Scrubbing detects latent corruption but needs redundancy to heal

- **Statement:** An integrity scrub reads and verifies all covered state and
  can repair detected corruption only when a valid redundant copy or parity
  reconstruction remains available; full scanning consumes I/O and energy.
- **Proposed status:** established.
- **Primary source:** `openzfs2024scrub`.
- **Rationale:** Background integrity maintenance is established engineering,
  and its coverage and cost are measurable.
- **Open question:** Which behavioral probes give the best semantic-fault
  coverage per joule without overfitting the scrub suite?
- **Affected principle:** P-009.

### C-FT-08 — Constraint-guided functional reconstruction is an unvalidated candidate

- **Statement:** When no clean exact state exists and multiple internal states
  could restore a missing capability, context-conditioned constraint-guided
  repair may occupy a better energy–latency–storage–regression frontier than
  checkpoint restore, replication, retraining, or unconstrained module search.
- **Proposed status:** speculative.
- **Primary source:** none sufficient; this is a project hypothesis motivated
  by C-033 and C-056 after engineering deduplication.
- **Rationale:** It is the residual mechanism not collapsed into exact restore,
  encoded reconstruction, or explicitly programmed legitimate-set convergence.
- **Open question:** Does it win on common-mode semantic and novel capability
  faults while exact methods correctly dominate ordinary corruption and loss?
- **Affected principles:** P-004, P-006, P-009, P-013; C-033, C-056.

## BibTeX

```bibtex
@article{hamming1950error,
  author  = {Hamming, Richard W.},
  title   = {Error Detecting and Error Correcting Codes},
  journal = {The Bell System Technical Journal},
  year    = {1950},
  volume  = {29},
  number  = {2},
  pages   = {147--160},
  month   = apr,
  doi     = {10.1002/j.1538-7305.1950.tb00463.x},
  url     = {https://onlinelibrary.wiley.com/doi/10.1002/j.1538-7305.1950.tb00463.x}
}

@article{reed1960polynomial,
  author  = {Reed, Irving S. and Solomon, Gustave},
  title   = {Polynomial Codes Over Certain Finite Fields},
  journal = {Journal of the Society for Industrial and Applied Mathematics},
  year    = {1960},
  volume  = {8},
  number  = {2},
  pages   = {300--304},
  month   = jun,
  doi     = {10.1137/0108018},
  url     = {https://epubs.siam.org/doi/10.1137/0108018}
}

@article{dimakis2010network,
  author  = {Dimakis, Alexandros G. and Godfrey, P. Brighten and Wu, Yunnan and
             Wainwright, Martin J. and Ramchandran, Kannan},
  title   = {Network Coding for Distributed Storage Systems},
  journal = {IEEE Transactions on Information Theory},
  year    = {2010},
  volume  = {56},
  number  = {9},
  pages   = {4539--4551},
  month   = sep,
  doi     = {10.1109/TIT.2010.2054295},
  eprint  = {0803.0632},
  archivePrefix = {arXiv},
  url     = {https://arxiv.org/abs/0803.0632}
}

@article{gopalan2012locality,
  author  = {Gopalan, Parikshit and Huang, Cheng and Simitci, Huseyin and
             Yekhanin, Sergey},
  title   = {On the Locality of Codeword Symbols},
  journal = {IEEE Transactions on Information Theory},
  year    = {2012},
  volume  = {58},
  number  = {11},
  pages   = {6925--6934},
  month   = nov,
  doi     = {10.1109/TIT.2012.2208937},
  url     = {https://www.microsoft.com/en-us/research/publication/on-the-locality-of-codeword-symbols/}
}

@inproceedings{huang2012azure,
  author    = {Huang, Cheng and Simitci, Huseyin and Xu, Yikang and Ogus, Aaron
               and Calder, Brad and Gopalan, Parikshit and Li, Jin and
               Yekhanin, Sergey},
  title     = {Erasure Coding in Windows Azure Storage},
  booktitle = {2012 USENIX Annual Technical Conference (USENIX ATC 12)},
  year      = {2012},
  pages     = {15--26},
  address   = {Boston, MA},
  publisher = {USENIX Association},
  isbn      = {978-1-931971-93-5},
  url       = {https://www.usenix.org/conference/atc12/technical-sessions/presentation/huang}
}

@article{young1974checkpoint,
  author  = {Young, John W.},
  title   = {A First Order Approximation to the Optimum Checkpoint Interval},
  journal = {Communications of the ACM},
  year    = {1974},
  volume  = {17},
  number  = {9},
  pages   = {530--531},
  month   = sep,
  doi     = {10.1145/361147.361115},
  url     = {https://doi.org/10.1145/361147.361115}
}

@article{daly2006checkpoint,
  author  = {Daly, John T.},
  title   = {A Higher Order Estimate of the Optimum Checkpoint Interval for
             Restart Dumps},
  journal = {Future Generation Computer Systems},
  year    = {2006},
  volume  = {22},
  number  = {3},
  pages   = {303--312},
  doi     = {10.1016/j.future.2004.11.016},
  url     = {https://laro.lanl.gov/esploro/outputs/journalArticle/A-higher-order-estimate-of-the/9916364420003761}
}

@article{chandra1996failure,
  author  = {Chandra, Tushar Deepak and Toueg, Sam},
  title   = {Unreliable Failure Detectors for Reliable Distributed Systems},
  journal = {Journal of the ACM},
  year    = {1996},
  volume  = {43},
  number  = {2},
  pages   = {225--267},
  month   = mar,
  doi     = {10.1145/226643.226647},
  url     = {https://dl.acm.org/doi/10.1145/226643.226647}
}

@article{dijkstra1974selfstabilizing,
  author  = {Dijkstra, Edsger W.},
  title   = {Self-Stabilizing Systems in Spite of Distributed Control},
  journal = {Communications of the ACM},
  year    = {1974},
  volume  = {17},
  number  = {11},
  pages   = {643--644},
  month   = nov,
  doi     = {10.1145/361179.361202},
  url     = {https://doi.org/10.1145/361179.361202}
}

@inproceedings{castro1999pbft,
  author    = {Castro, Miguel and Liskov, Barbara},
  title     = {Practical Byzantine Fault Tolerance},
  booktitle = {Proceedings of the Third Symposium on Operating Systems Design
               and Implementation (OSDI '99)},
  year      = {1999},
  pages     = {173--186},
  address   = {New Orleans, LA},
  publisher = {USENIX Association},
  doi       = {10.1145/296806.296824},
  url       = {https://www.usenix.org/conference/osdi-99/presentation/practical-byzantine-fault-tolerance}
}

@inproceedings{ongaro2014raft,
  author    = {Ongaro, Diego and Ousterhout, John},
  title     = {In Search of an Understandable Consensus Algorithm},
  booktitle = {2014 USENIX Annual Technical Conference (USENIX ATC 14)},
  year      = {2014},
  pages     = {305--319},
  address   = {Philadelphia, PA},
  publisher = {USENIX Association},
  isbn      = {978-1-931971-10-2},
  url       = {https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro}
}

@inproceedings{ghemawat2003gfs,
  author    = {Ghemawat, Sanjay and Gobioff, Howard and Leung, Shun-Tak},
  title     = {The Google File System},
  booktitle = {Proceedings of the Nineteenth ACM Symposium on Operating Systems
               Principles (SOSP '03)},
  year      = {2003},
  pages     = {29--43},
  address   = {Bolton Landing, NY},
  publisher = {Association for Computing Machinery},
  doi       = {10.1145/945445.945450},
  url       = {https://research.google/pubs/the-google-file-system/}
}

@manual{openzfs2024scrub,
  author       = {{OpenZFS Project}},
  title        = {{zpool-scrub(8)}: Begin or Resume Scrub of ZFS Storage Pools},
  year         = {2024},
  month        = nov,
  organization = {OpenZFS Project},
  note         = {OpenZFS 2.3 manual page; accessed 2026-08-05},
  url          = {https://openzfs.github.io/openzfs-docs/man/v2.3/8/zpool-scrub.8.html}
}
```

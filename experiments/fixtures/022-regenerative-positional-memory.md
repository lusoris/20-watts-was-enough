# Fixture F-022 — Regenerative positional memory and structural consolidation

<!-- markdownlint-disable MD013 -->

- **Status:** complete preimplementation CPU-only experiment contract
- **Direct claims:** [`C-1506`](../../research/claims.md#c-1506)--[`C-1515`](../../research/claims.md#c-1515)
- **Source audit:** [developmental biology and regeneration depth](../../research/audits/2026-08-25-developmental-regeneration-depth.md)
- **Audit snapshot:** SHA-256 `78CB6D0A1BD984213B8E170D7F460665C43BBC8F6DFE6AD4BB9A41C11FDF1E3A`
- **Protocol IDs:** `DEV-T01`--`DEV-T10`
- **Execution state:** no runner, reference-workstation manifest, sealed seed pack, generated data, or result exists
- **Registry disposition:** no new P-series principle, architecture candidate, claimed AI effect, biological-energy estimate, or deployment claim

This fixture converts ten source-qualified developmental observations into ten
independent synthetic falsification tracks. A biological paper supports the
observation named in the audit; it does not validate the artificial graph,
state variable, controller, resource saving, or AI translation below. Every
numeric value is a synthetic generator setting, numerical tolerance, project
effect margin, or compute cap.

| Protocol | Direct claim | Registered question |
| --- | --- | --- |
| DEV-T01 | [C-1506](../../research/claims.md#c-1506) | Hysteretic positional memory |
| DEV-T02 | [C-1507](../../research/claims.md#c-1507) | Capacity/instruction separation |
| DEV-T03 | [C-1508](../../research/claims.md#c-1508) | Compensating pattern sources |
| DEV-T04 | [C-1509](../../research/claims.md#c-1509) | Finite scaling envelope |
| DEV-T05 | [C-1510](../../research/claims.md#c-1510) | Boundary-conditioned observability |
| DEV-T06 | [C-1511](../../research/claims.md#c-1511) | Load-dependent reinforcement |
| DEV-T07 | [C-1512](../../research/claims.md#c-1512) | Reversible boundary consolidation |
| DEV-T08 | [C-1513](../../research/claims.md#c-1513) | Conditional regulatory redundancy |
| DEV-T09 | [C-1514](../../research/claims.md#c-1514) | Local/global pattern composition |
| DEV-T10 | [C-1515](../../research/claims.md#c-1515) | Local-feedback symmetry breaking |

## Registered question

Can a bounded composition of durable local context, transported fields,
repair-gated writes, diverse small control paths, load-sensitive structure,
and reversible consolidation match the quality and protected outcomes of
mature reconstruction/control/graph nulls while reducing a prespecified
resource axis on hostile held-out support?

Each protocol tests one narrower proposition. No result may be inferred from
another track, and a favorable mean cannot compensate for an unsafe write,
wrong-role reconstruction, duplicate organizer, unsupported extrapolation,
failed rollback, hidden target information, or lower accepted service.

## Outcome vocabulary and no-results authority

Every track has exactly one terminal interpretation:

1. `PASS`: all registered confirmation, absolute, novelty, resource, support,
   and transfer gates pass.
2. `FAIL`: a valid complete run crosses a prespecified kill boundary or the
   proposal is statistically/resource dominated under the registered margin.
3. `INCONCLUSIVE`: artifacts are valid and complete, but neither the PASS nor
   FAIL criteria are resolved. It cannot be reported as weak support.
4. `INVALID`: leakage, seed/config change, broken units/schema, undeclared
   branch, nonconvergence outside the frozen rule, hidden failure, or a broken
   measurement boundary prevents scientific interpretation.
5. `NO_RESULT`: the pre-execution state of every protocol in this document.

A successful parser, build, unit test, smoke run, workstation-readiness check,
or generated plot does not change `NO_RESULT`. Only a frozen implementation,
committed manifests, revealed private packs, independent evaluation, and
complete artifacts can produce the other four states.

## Common CPU-only falsification contract

### 1. Runtime, arithmetic, and deterministic identity

Implement under the repository-pinned Node.js runtime in TypeScript or
JavaScript. Use binary64 reference arithmetic and PCG64-DXSM. Hash the UTF-8
bytes of each literal seed string once with SHA-256. Digest bytes 0--15 are the
little-endian 128-bit initial state and bytes 16--31 the 128-bit stream
selector; initialize PCG with odd increment $2r+1$ modulo $2^{128}$. A uniform
binary64 uses the top 53 bits divided by $2^{53}$; inclusive integers use
rejection sampling, never modulo reduction. Canonical serialization is
little-endian with sorted object keys, sorted graph IDs, stable-hash tie
breaking, and SHA-256 manifests. Parallel reductions sort by canonical world
ID before summation.

`U(a,b)` is continuous uniform, $U_{\mathbb Z}\{a,b\}$ is inclusive discrete
uniform, `logU(a,b)` is log-uniform, and $N(\mu,\sigma^2)$ is Gaussian. Draws
are independent unless a dependence is explicitly written. Quantile $Q_p$ is
order statistic $x_{\max(1,\lceil pn\rceil)}$ after stable ascending sort with
no interpolation.

### 2. Seed packs and freeze order

For track $k\in\{1,\ldots,10\}$, public development seeds are
`1506000 + 10000*k + j`, $j=1,\ldots,64$. A registrar generates 128 private
64-bit confirmation seeds and 64 disjoint private transfer seeds per track and
publishes SHA-256 commitments before implementation freeze. Code, configuration,
dependency lock, reference-workstation manifest, arm definitions, artifact
schema, development-selected nuisance parameters, and source-audit hash freeze
before a private pack is revealed. There is no public derivation of a private
seed. A corrected implementation requires a new version and fresh private
packs.

### 3. Inference unit and denominators

One seed is one inferential cluster. Graphs, nodes, edges, timesteps, wounds,
loads, organizers, queries, channels, and repeated worlds inside a seed do not
increase $n$. Every generated world and attempted task remains in its declared
denominator. A failed or abstained case is scored by its written rule; it is
never silently removed or replaced.

### 4. Frozen arms and information equality

Each track defines:

1. **A:** the tempting collapsed rule or unsafe analogy;
2. **B:** the strongest named mature null;
3. **C:** the proposed developmental composition; and
4. **O:** an evaluator-only oracle, never a deployable arm.

A/B/C receive identical registered observations, action authority, time
support, seed worlds, tuning calls, CPU-thread cap, stopping rules, and failure
handling. If B legitimately needs a globally supplied variable or checkpoint,
its bytes, maintenance, acquisition, and validation are charged; C may not
withhold the same observable and then claim superior quality. Hidden target
roles, future events, uncorrupted latent state, failure labels, and oracle
optima remain evaluator-only.

Every arm is a frozen algorithm, not a family placeholder. Initialization,
features, update order, solver tolerances, message format, tie rules,
abstention, fallback, retained state, and termination are hashed. An unlisted
branch is `INVALID`.

### 5. Equal budget, resource, and lifecycle boundary

Before scalarisation, every arm records:

1. attempted and accepted tasks [tasks];
2. wrong-role, duplicate-organizer, unsafe-write, support-miss, and rollback
   events [count];
3. recovery, convergence, p50/p95/p99 latency, and outage [s];
4. messages, payload, coordinate/checkpoint, validation, and retained-state
   bytes [B];
5. local updates, field steps, solver iterations, role writes, boundary writes,
   reopenings, and full rebuilds [count];
6. CPU time [s], monotonic wall time [s], peak RSS [B], bytes read/written [B],
   and compressed artifact size [B]; and
7. if and only if separately implemented, workstation electricity [J], meter
   model/serial/calibration, sample interval [s], boundary, idle allocation,
   uncertainty, and missing-sample rule.

Synthetic update/operation counts are never called energy. Metered workstation
energy cannot be converted to biological energy. Manufacture, training,
checkpoint refresh, validation, recovery, failed work, and disposal-like state
deletion are not omitted when present.

### 6. Generation, numerical, and deadline failures

Draw fields in written order. A rejection sampler gets 10,000 attempts unless
a protocol states less. A solver gets the written iteration and residual cap.
NaN/Inf, disconnected graph after the permitted generator repair, residual
above tolerance, hash mismatch, missing artifact, unauthorized write, or
deadline/RSS cap is a retained failed seed with $L_{s,a}=100$ for that arm.
The event is not converted to safe abstention unless the arm declared
abstention before seeing evaluator-only truth.

### 7. Development, confirmation, and transfer

Development alone selects the finite nuisance grid and one configuration per
arm. Confirmation performs no search, threshold repair, seed deletion,
denominator change, code modification, feature addition, or altered stopping
rule. Transfer changes only the named support in each protocol, repeats the
frozen arms, and is descriptive plus absolute-gate binding. Transfer cannot
rescue failed confirmation.

### 8. Statistical comparison, paired inference, and effect margins

For track $k$, proposal C is compared with mature null B on paired seed loss

$$
D_{k,s}=L_{k,s,C}-L_{k,s,B}.
$$

Each track freezes non-inferiority margin $\epsilon_k\ge0$. Use exactly 100,000
paired cluster-bootstrap-t resamples from
`SHA256("DEV-v1|confirmation|joint-bootstrap-t")`, with the same resampled
seed-index vectors across all ten tracks. Let $U^{99}_{D,k}$ be the one-sided
99% upper confidence bound from the centred bootstrap-t distribution. Quality
non-inferiority requires $U^{99}_{D,k}\le\epsilon_k$.

For a lower-is-better positive resource metric $M$ and required fractional
reduction $r_k$, define

$$
R_{k,s}=\ln\frac{M_{k,s,C}+c_M}{M_{k,s,B}+c_M},
$$

where $c_M=1$ for counts/bytes and $10^{-12}$ in the native unit otherwise.
Resource superiority requires the one-sided 99% upper bound
$U^{99}_{R,k}\le\ln(1-r_k)$. A probability/rate no-worsening gate uses paired
difference C minus B with margin 0.001 unless the protocol states a smaller
positive margin. Holm controls familywise $\alpha=0.01$ across the ten primary
quality tests and, separately within a track, across quality, resource, and
named protected no-worsening tests. Effect bounds and adjusted rejection are
both required. Two-sided 99% intervals and full paired distributions are
descriptive.

A is diagnostic and cannot promote C. O measures opportunity and leakage only.
A protocol that cannot distinguish C from B but meets neither the resource nor
quality kill boundary is `INCONCLUSIVE`, not PASS.

### 9. Common absolute gates

All tracks require:

1. zero oracle/target/future leakage;
2. zero unauthorized memory or boundary writes;
3. zero changed private seeds/configuration after reveal;
4. at least 0.99 accepted-service fraction whenever O declares the world
   feasible, unless a protocol freezes a stricter threshold;
5. unsafe-write and confident unsupported-action rate at most 0.001;
6. support-corruption or beyond-envelope recall at least 0.95 with false alarm
   at most 0.05 where the track contains such cases;
7. rollback success at least 0.99 where rollback is authorized;
8. every raw protected metric and denominator present before scalarisation;
9. no resource win attributable to fewer accepted tasks or a failed arm; and
10. transfer absolute gates pass with the same signed C--B quality/resource
    direction as confirmation.

### 10. Reference-workstation contract

Before the first timed development run, freeze
`reference-workstation.json`: CPU vendor/model/stepping/microcode, four
assigned physical-core IDs, SMT state, RAM, storage/firmware/filesystem, OS
build, Node binary hash/version, BIOS and power plan, repository commit, and
meter contract if used. Confirmation runs only on that manifest, AC power,
fixed performance plan, no network, normal priority, exactly four physical
cores with SMT siblings excluded, `UV_THREADPOOL_SIZE=4`, no child processes,
and no more than four worker threads. A 60 s pre-run observation must show at
most 5% mean non-runner load on assigned cores.

Run every `(track,seed,arm)` in a fresh Node process with `--expose-gc`. Execute
one excluded full-arm warm-up using the first public development seed, await
I/O, call `global.gc()` once, then time the target. Start monotonic wall/CPU
timers immediately before world generation and stop after artifacts are
compressed, closed, and `fsync` completes. Generation, arm computation,
validation, compression, and output I/O are included. Process launch, code
loading, excluded warm-up, and post-run hashing are excluded. Arm order is the
stable-hash permutation of A/B/C per seed.

Each arm/seed is capped at 60 s timed wall and 8 GiB peak RSS; each track is
capped at 2 GiB retained artifacts. These are prospective design caps, not
measured readiness. No GPU run substitutes for this CPU contract.

## Common synthetic graph conventions

Unless a protocol overrides them, a world begins from a rectangular unit-grid
graph with edge length $\ell=1$ m, four-neighbour adjacency, deterministic node
IDs `y*nx+x`, and dimensionless node fields. Hole masks are drawn, then the
largest connected component is retained only if it contains at least 90% of
pre-mask nodes; otherwise redraw the mask. Keeping the largest component is a
generator rule, not an arm repair. Evaluator coordinates and target roles are
hidden unless a protocol explicitly supplies and charges them.

Discrete field integration uses Heun's method with $\Delta t=0.05$ s. A
reference evaluator repeats selected development and every confirmation world
at $\Delta t=0.025$ s; maximum field discrepancy must be at most $10^{-5}$ and
role decisions identical, or the world is a retained numerical failure.
Dimensionless fields are projected to $[-8,8]$ only when a protocol explicitly
defines projection; every projection is logged.

## CPU-executable protocols

### DEV-T01: Hysteretic positional memory

- **Claim:** C-1506.
- **Question:** does repair-gated durable local context reduce reconstruction
  work without increasing wrong-role repair under valid, stale, local-corrupt,
  and common-mode-corrupt memory?
- **Generator and units:** each seed creates 32 independent $24\times24$ grid
  worlds with four target roles defined by two evaluator-only boundaries drawn
  at normalized coordinates $U(0.35,0.65)$. Pre-injury memory
  $m_i\in[-1,1]^4$ is the one-hot role encoded as $\{-1,1\}$ plus
  $N(0,0.02^2)$ noise. At $t=32$ s, delete a connected disk of radius
  $U_{\mathbb Z}\{3,6\}$ nodes. Surviving memory is valid, 10% independently
  permuted, shifted one role in one connected 20% patch, or globally shifted,
  with eight worlds per family. Demand is 20 tasks/s per surviving boundary
  edge through horizon 128 s.
- **Observations/actions:** all arms see graph adjacency, surviving node role
  outputs before injury, post-injury local messages, demand, failure mask, and
  memory bytes with provenance/corruption label hidden. They may propose roles,
  abstain/fallback, and write memory only under their declared gate. O sees
  target roles.
- **Arms:** A opens writes on every local disagreement and applies majority
  propagation. B is synchronous multi-source graph label propagation with a
  corruption-robust Potts/total-variation objective, solved by alpha-expansion
  over the four labels to no improving move. C uses the same local observations
  but retains unchanged supported memory, opens a write gate only after two
  independent neighborhood-consistency checks and held-out service probes, and
  otherwise invokes B as charged fallback. O supplies target roles.
- **Mature null:** B is a complete robust graph-reconstruction algorithm, not a
  context-free toy. C receives no corruption label or hidden coordinates.
- **Loss:** $L=40e_{role}+30(1-A_{service})+20p_{wrong}+10p_{unsafe}$, capped at
  100. Wrong repair and unsafe writes remain protected. $\epsilon_1=0.20$.
- **PASS/resource gate:** C non-inferior to B and reduces message bytes by 20%
  on valid/local-corrupt support, with wrong-role and unsafe-write rates no
  worse by 0.001. Common-mode corruption requires at least 0.95 abstention or
  fallback recall and at most 0.05 false alarm on valid worlds.
- **Kill/transfer:** kill if C gains by trusting poisoned memory, hides B
  fallback cost, or cannot rollback at least 0.99 of deliberately rejected
  writes. Transfer uses $32\times20$ grids, diagonal boundaries, 30% patch
  corruption, and a second wound after recovery.
- **Artifacts:** `worlds.jsonl`, `memory-ledger.parquet`, `gates.csv`,
  `role-proposals.zst`, `service.csv`, `messages.csv`, `rollbacks.csv`.

### DEV-T02: Capacity/instruction separation

- **Claim:** C-1507.
- **Question:** can distributed instruction holders and a replaceable worker
  pool restore service with fewer persistent bytes than exact checkpoint/log
  recovery while exposing insufficient surviving support?
- **Generator and units:** 32 worlds contain 384 task modules, 64 repair workers,
  eight role classes, and 96 directed dependency boundaries. Each role's local
  reconstruction contract is a 128-bit signed constraint. At $t=20$ s draw one
  of four equally represented events: delete 50% of workers; delete a connected
  20% of task modules; delete both; or corrupt 15% of instruction contracts.
  Horizon is 120 s, demand 1,024 tasks/s, state/checkpoints [B].
- **Observations/actions:** all arms see the same failure detector, surviving
  contracts, dependency graph, service probes, worker capacity, and validation
  budget. They can allocate workers, reconstruct modules, query at most 16
  contracts/world, abstain, or fall back.
- **Arms:** A co-locates the only instruction copy with each repair worker. B
  keeps a versioned exact role/checkpoint map plus append-only update log and
  restores from it. C distributes erasure-coded local constraints across task
  modules, keeps workers stateless, reconstructs only when at least the frozen
  support threshold verifies, and invokes B as charged fallback. O sees the
  original target graph.
- **Mature null:** B is exact checkpoint/log restoration including refresh,
  validation, retained bytes, and recovery I/O.
- **Loss:** $L=35e_{role}+35(1-A_{service})+20p_{invalid-repair}+10p_{missed-support}$,
  capped at 100; $\epsilon_2=0.10$.
- **PASS/resource gate:** C non-inferior to B and reduces persistent
  checkpoint/instruction bytes by 25%, with full-service recovery p99 no worse
  by 0.5 s and invalid repair no worse by 0.001. Insufficient-support recall is
  at least 0.95.
- **Kill/transfer:** exact B wins if C cannot reduce bytes after code,
  signatures, validation, fallback checkpoint, and repair-worker software are
  included. Transfer doubles role classes, removes one entire contract shard,
  and makes worker loss correlated with a task-module wound.
- **Artifacts:** `module-graph.json`, `contracts.parquet`, `checkpoint-ledger.csv`,
  `worker-events.csv`, `repairs.jsonl`, `support.csv`, `service.csv`.

### DEV-T03: Compensating pattern sources

- **Claim:** C-1508.
- **Question:** can reciprocal separated sources restore a target field after
  one source fails with fewer global messages than a mature distributed
  controller, while safely rejecting double-source loss?
- **Generator and units:** each seed creates 64 line graphs with 256 nodes,
  $\ell=1$ m, target field $z_i^*=2x_i/(255\,\mathrm m)-1$, field dimensionless,
  horizon 160 s, and observation noise $N(0,0.01^2)$. One source fails at 40 s,
  both fail at 40 s, one is delayed by $U(0,4)$ s, or neither fails, sixteen
  worlds each. Source command is [s$^{-1}$], messages [B].
- **Arms:** A uses one fixed left source and a static gain. B is a distributed
  state estimator plus constrained receding-horizon controller with horizon 16,
  quadratic field/error/control cost, projected-gradient tolerance $10^{-8}$,
  and 1,000 iterations. C uses left/right sources with reciprocal integral
  error feedback, anti-windup, delay monitor, and double-loss abstention. O
  solves the full-information finite-horizon quadratic program.
- **Equal information:** B/C receive the same sampled field probes, source
  health pings, delay timestamps, authority, and command limits. C's reciprocal
  source identity is charged state, not hidden biology.
- **Loss:** with RMSE $e_z$, overshoot $o_z$, accepted control horizon $A_H$,
  and unsupported-action rate $p_u$, $L=40e_z/e_{dev}+20o_z/o_{dev}+30(1-A_H)+10p_u$,
  capped at 100; development scales are positive B RMS
  values. $\epsilon_3=0.15$.
- **PASS/resource gate:** C non-inferior to B, reduces global message bytes 20%,
  settles after single-source loss within 20 s, overshoot at most 0.10, and
  detects/abstains on double loss with at least 0.99 recall and at most 0.02
  false alarm.
- **Kill/transfer:** kill on sustained oscillation, hidden source truth,
  uncharged controller state, or if B dominates messages after sparse updates.
  Transfer doubles line length, reverses source authority, and increases delay
  support to 8 s.
- **Artifacts:** `fields.zst`, `source-events.csv`, `commands.csv`,
  `controller-state.parquet`, `settling.csv`, `messages.csv`.

### DEV-T04: Finite scaling envelope

- **Claim:** C-1509.
- **Question:** can receiver-side feedback maintain proportional boundaries
  during growth while explicitly detecting the size at which its calibrated
  envelope ends?
- **Generator and units:** 64 one-dimensional growing domains start at
  $L_0\in\{64,80\}$ m and add one unit node every $U_{\mathbb Z}\{2,5\}$ s to
  confirmation lengths 96--160 m. Target role boundary is $x/L=0.37$.
  Transfer reaches 224--320 m or adds 25% length abruptly. Signal is
  dimensionless, receiver gain dimensionless, boundary error [m] and normalized
  error [1].
- **Arms:** A uses a fixed source/threshold calibrated at $L_0$. B receives
  exact current $L$ every step and assigns the proportional boundary. C receives
  no free $L$; it adapts local receptor gain from field occupancy feedback,
  carries a development-frozen support interval, and abstains to B outside it.
  O supplies exact target roles.
- **Mature null/equality:** B is exact global normalization. Its size broadcasts
  and validation bytes are charged. C may buy the same broadcast and then is
  scored as B fallback, not as a local success.
- **Loss:** $L=60e_{norm}+25(1-A_{service})+15p_{unsupported-action}$, capped at
  100; $\epsilon_4=0.01$ normalized loss.
- **PASS/resource gate:** inside support C has normalized boundary error no
  worse than B by 0.005 and reduces size/coordinate bytes 50%. Beyond support,
  failure/abstention recall is at least 0.95, false alarm at most 0.05, and no
  result may be called scale invariance.
- **Kill/transfer:** kill if C infers exact $L$ from an uncharged clock/node
  count, tunes the envelope on transfer, or claims a win through abstention
  without charging B. Transfer is the beyond-range/abrupt-growth family above.
- **Artifacts:** `growth-events.csv`, `fields.zst`, `receiver-gains.csv`,
  `boundaries.csv`, `support-dispositions.csv`, `broadcast-bytes.csv`.

### DEV-T05: Boundary-conditioned observability

- **Claim:** C-1510.
- **Question:** can edge access plus transported inhibition infer useful
  boundary-relative state on new shapes more cheaply than exact distributed
  graph distance?
- **Generator and units:** 32 worlds per seed use disks, rectangles, annuli, or
  two-lobed connected masks with 400--900 nodes. Development/confirmation hold
  out one parameter range per shape; transfer uses branching and three-hole
  masks. Boundary nodes receive apical signal $a_i=1$; interior nodes receive
  it only after a receptor-orientation flip. A boundary-induced inhibitor
  diffuses with synthetic $D=0.4$ m$^2$/s and decay $0.05$ s$^{-1}$. Target
  roles are graph-distance bands 0--2, 3--6, 7--12, and greater than 12 m.
- **Arms:** A thresholds the inhibitor and assumes identical receptor access.
  B runs exact multi-source BFS from observed boundary nodes after every
  topology change. C jointly records local access orientation and inhibitor
  state, updates only changed neighborhoods, and falls back to B on support
  conflict. O sees exact boundary distance.
- **Ablations:** remove access orientation, remove inhibitor, invert 10% of
  access sensors, and make a new hole at 60 s. Each family is equally
  represented.
- **Loss:** $L=50e_{role}+30(1-A_{service})+20p_{confident-boundary-error}$,
  capped at 100; $\epsilon_5=0.10$.
- **PASS/resource gate:** C non-inferior to B and reduces distance-update
  messages 20% after local topology changes, while sensor inversion recall is
  at least 0.95 and confident error at most 0.001.
- **Kill/transfer:** kill if shape coordinates leak, BFS state is undercharged,
  or C only works on radial geometry. Transfer uses the branching/holey masks
  and changes inhibitor decay to 0.10 s$^{-1}$ without retuning.
- **Artifacts:** `masks.zst`, `boundary-events.csv`, `sensor-orientation.csv`,
  `fields.zst`, `distance-updates.csv`, `role-proposals.csv`.

### DEV-T06: Load-dependent reinforcement

- **Claim:** C-1511.
- **Question:** can capped, decaying load-sensitive structure reduce continual
  routing work without hotspot capture or slow reversal?
- **Generator and units:** 32 connected geometric graphs have 256 nodes, mean
  degree 6, capacities $C_{ij}\sim U(50,200)$ tasks/s, and 64 source--sink
  flows. Demand is piecewise constant over 240 s. Families are stable
  correlated load, 10 s misleading burst, rotating hotspot, and complete
  source--sink reversal at 120 s. Latency [s], rate [tasks/s], state
  dimensionless, messages [B].
- **Arms:** A reinforces used edges without cap/decay. B is standard
  queue-differential backpressure with shortest-path bias recomputed each
  second. C updates $b_{ij}$ from capped utilization/conflict, decays unused
  state, freezes writes during anomaly, and reopens when service probes reject
  the current path. O computes the future-aware multicommodity flow.
- **Loss:** $L=30(1-A_{service})+25p99_{lat}/p99_{dev}+25p_{overload}+20p_{stuck}$,
  capped at 100; $\epsilon_6=0.20$.
- **PASS/resource gate:** C non-inferior to B on loss, accepted service at least
  0.99, overload no worse by 0.001, and routing-update messages reduced 20% in
  stable-load worlds. After reversal, p99 recovery is at most 15 s and no worse
  than B by 1 s.
- **Kill/transfer:** kill on path monopoly, burst hardening, omitted write cost,
  or if resource savings disappear when B uses event-triggered recomputation.
  Transfer doubles flows, halves 10% of capacities, and alternates load every
  30 s.
- **Artifacts:** `graphs.json`, `demands.zst`, `queues.zst`, `boundary-state.csv`,
  `routes.csv`, `service.csv`, `messages.csv`.

### DEV-T07: Reversible boundary consolidation

- **Claim:** C-1512.
- **Question:** when does delayed reversible hardening amortize its write and
  reopening costs relative to a mature continuously adaptive soft boundary?
- **Generator and units:** 32 worlds contain 192 modules in eight role
  compartments. Cross-role traffic has 20% harmful and 80% useful requests,
  labeled only after validation. Stable phase lasts 60--180 s, then half of
  worlds switch role dependencies. Boundary state is dimensionless, traffic
  [tasks/s], latency/reopen time [s], writes/blocked tasks [count].
- **Arms:** A hardens after 10 s and never reopens. B uses continuous typed
  dynamic routing with calibrated conflict classifier and no structural write.
  C requires a development-frozen maturity evidence window, writes reversible
  boundary state, audits a probe channel, and reopens/rolls back on sequential
  service evidence. O knows future stable interval and request type.
- **Loss:** $L=25(1-A_{service})+25p_{harmful-cross}+20p_{useful-blocked}+15t_{reopen}/t_{dev}+15p_{rollback-fail}$,
  capped at
  100; $\epsilon_7=0.15$.
- **PASS/resource gate:** C non-inferior to B, reduces steady routing-decision
  calls 25% in stable worlds, harmful cross-boundary rate no worse by 0.001,
  useful-blocked rate no worse by 0.001, and rollback succeeds at least 0.99.
- **Kill/transfer:** kill if the chosen maturity window uses future duration,
  hardening cost is omitted, or irreversible A matches C on shift recovery.
  Transfer shortens stable phases, introduces two rapid shifts, and makes 40%
  of cross-role requests useful.
- **Artifacts:** `compartments.json`, `requests.zst`, `maturity-evidence.csv`,
  `boundary-writes.csv`, `probe-results.csv`, `reopenings.csv`, `service.csv`.

### DEV-T08: Conditional regulatory redundancy

- **Claim:** C-1513.
- **Question:** can two small control paths with distinct input supports improve
  hostile-family tail reliability more cheaply than complete duplicated
  controllers?
- **Generator and units:** 64 worlds contain a binary admission decision with
  32 normalized features. Nominal data, temperature-like gain reduction,
  activator-feature dropout, single-channel implementation fault, and
  common-mode input corruption are equally represented. Each world has 10,000
  decisions. Error/risk are probabilities, state [B], operations [count].
- **Arms:** A is one regularized logistic gate. B is two independently trained
  32-feature gates plus disagreement abstention and full validation. C has two
  16-feature gates selected on development for minimum input-overlap subject to
  nominal calibration, plus disagreement abstention; the union never exceeds
  32 distinct features. O sees corruption labels and true outcomes.
- **Equal budget:** A/B/C receive equal training examples and tuning calls.
  B's duplicated parameters/inference are charged; C's feature-selection and
  dual validation are charged. No arm sees hostile-family identity online.
- **Loss:** $L=40p_{unsafe}+25p_{error}+20p_{abstain}+15ECE/ECE_{dev}$,
  capped at 100; $\epsilon_8=0.10$.
- **PASS/resource gate:** C non-inferior to B, unsafe error no worse by 0.0005,
  and parameter-plus-inference operations reduced 25%. Report nominal and every
  hostile family separately; common-mode corruption need not improve but must
  trigger no confident safety claim.
- **Kill/transfer:** kill if feature diversity is selected after confirmation,
  if C's gates have hidden unique labels, or full B dominates after batching.
  Transfer changes which feature groups fail and introduces correlated noise
  across the nominally diverse inputs.
- **Artifacts:** `datasets.zst`, `feature-support.json`, `models.json`,
  `decisions.parquet`, `calibration.csv`, `resource-ledger.csv`.

### DEV-T09: Local/global pattern composition

- **Claim:** C-1514.
- **Question:** can local periodic patterning plus a coarse global field recover
  roles after local damage with fewer assignment bytes than central graph
  optimisation?
- **Generator and units:** 32 $40\times24$ grid worlds have a coarse axial
  field $g(x)=x/L$, a local activator/inhibitor system with one of three
  wavelengths 4, 6, or 8 m, and target roles defined by periodic peaks only
  inside a field-selected admissible band. At 80 s delete a disk of radius 4 m;
  horizon 200 s. Transfer rotates the axis, changes wavelength to 5 or 7 m,
  and uses an irregular boundary.
- **Arms:** A-local omits the global field and A-global thresholds only the
  field; both are diagnostic A subarms and share A's denominator. B centrally
  solves a minimum-cost role assignment with graph smoothness, target count,
  field, and wavelength constraints using a frozen integer programme and
  optimality gap $10^{-6}$. C integrates the local fields, reads a 2-bit coarse
  context band, validates mode count locally, and repairs only the damaged
  neighborhood. O supplies target roles.
- **Numerics:** Heun integration follows the common rule; a discrete Fourier
  evaluator and connected-component evaluator independently count modes.
  Disagreement is a numerical/model-support failure, not an arm choice.
- **Loss:** $L=35e_{role}+25e_{mode}+25(1-A_{service})+15p_{spurious-pattern}$,
  capped at 100; $\epsilon_9=0.15$.
- **PASS/resource gate:** C non-inferior to B, reduces assignment/context bytes
  30%, and local repair touches at most 40% of nodes while meeting role/mode
  gates. Local-only and global-only subarms must fail on different preregistered
  axes in at least 80% of their designated diagnostic worlds.
- **Kill/transfer:** kill if B's optimization/preprocessing is undercharged, C
  uses evaluator coordinates, or transfer requires wavelength retuning.
  Transfer is the rotated/odd-wavelength/irregular family above.
- **Artifacts:** `worlds.jsonl`, `fields.zst`, `modes.csv`, `assignments.zst`,
  `damage-events.csv`, `touched-nodes.csv`, `messages.csv`.

### DEV-T10: Local-feedback symmetry breaking

- **Claim:** C-1515.
- **Question:** can local feedback select exactly one temporary organizer on an
  anonymous graph and recover after organizer deletion with less persistent
  coordinator state than mature randomized leader election?
- **Generator and units:** 64 connected graphs have 128--512 anonymous nodes:
  rings, grids with periodic boundaries, random regular graphs, and mildly
  asymmetric geometric graphs. Nodes start with identical visible state and
  independent registered random streams. At 60 s delete the elected organizer;
  horizon 160 s. Organizer count [count], convergence/re-election [s], messages
  and persistent state [B].
- **Arms:** A uses independent random timers plus local refractory inhibition.
  B draws a 128-bit random priority per node and floods the maximum with epoch,
  membership, duplicate detection, and timeout; ties use node random-stream
  hash, not hidden ID. C uses bounded local self-enhancement, neighbor relay,
  longer-range inhibitory field, duplicate-pole detector, and epoch reset after
  organizer loss. O sees all random draws and graph.
- **Mature null/equality:** B is a complete randomized leader-election
  protocol, not a fixed leader. All arms receive identical failure detection,
  membership events, random-bit budget, message payload accounting, and
  convergence certification requirement.
- **Loss:** $L=40p_{not-one}+25t_{elect}/t_{dev}+25t_{reelect}/t_{dev}+10p_{uncertified}$,
  capped at 100; $\epsilon_{10}=0.05$.
- **PASS/resource gate:** C non-inferior to B, exactly-one probability at least
  0.999, re-election p99 at most 20 s, duplicate-pole confident rate at most
  0.001, and persistent coordinator-state bytes reduced 20% without increasing
  total messages by more than 1%.
- **Kill/transfer:** kill if topology asymmetry or hidden IDs determine the
  winner, duplicate detection uses O, or B compresses below C under the same
  membership contract. Transfer doubles nodes, adds 5% churn, and presents a
  perfectly symmetric torus plus correlated message delay.
- **Artifacts:** `graphs.jsonl`, `random-streams.commitment`, `fields.zst`,
  `organizer-events.csv`, `messages.parquet`, `certificates.jsonl`,
  `reelection.csv`.

## Cross-track ablations and hostile artifact checks

1. Replace every durable state with zeros and confirm that no C arm silently
   reconstructs it from evaluator coordinates or filenames.
2. Permute node IDs while preserving graph isomorphism; outputs may differ only
   through registered randomness, never lexical IDs.
3. Reverse byte order in one intentionally malformed manifest and require
   deterministic rejection before execution.
4. Truncate, duplicate, reorder, and corrupt 1% of artifact rows; the evaluator
   must reject or identify every affected seed without repairing it silently.
5. Recompute protected denominators independently from immutable world
   manifests and require equality.
6. Run reference field/graph evaluators implemented without shared solver code
   on all confirmation seeds.
7. Replace every resource saved by a failed/abstained case with B's realized
   resource for sensitivity; no PASS may depend on failure savings.
8. Verify that every fallback invokes the complete B arm from the registered
   state and charges its bytes, compute, latency, and validation.

## Claim-to-test and evidence ledger

1. C-1506 maps only to DEV-T01; the axolotl source motivates gated persistent
   state, not the synthetic memory encoding.
2. C-1507 maps only to DEV-T02; planarian muscle/neoblast roles motivate
   separation, not an erasure-code choice.
3. C-1508 maps only to DEV-T03; Xenopus source compensation motivates the
   failure family, not controller gains.
4. C-1509 maps only to DEV-T04; Dpp/Pent evidence requires a finite envelope,
   not a universal scaling claim.
5. C-1510 maps only to DEV-T05; the hESC micropattern evidence motivates the
   observation operator, not an intact-embryo inference.
6. C-1511 maps only to DEV-T06; mechanical tension is not network traffic.
7. C-1512 maps only to DEV-T07; actomyosin is not a routing boundary.
8. C-1513 maps only to DEV-T08; enhancer overlap is not permission to duplicate
   arbitrary models.
9. C-1514 maps only to DEV-T09; the Turing interpretation remains plausible
   rather than uniquely established.
10. C-1515 maps only to DEV-T10; chick perturbations are stronger evidence than
    the complete symmetry-breaking model.

## Implementation order and readiness gates

1. Implement shared RNG, canonical graph/world serialization, manifest hashing,
   immutable denominators, and hostile artifact tests first.
2. Implement DEV-T03, DEV-T04, and DEV-T10 next because analytic field, scale,
   and exactly-one organizers provide strong independent oracles.
3. Implement DEV-T01 and DEV-T02 after corruption, checkpoint, fallback, and
   rollback ledgers pass property tests.
4. Implement DEV-T05 and DEV-T09 after the two-resolution field solver and
   graph-distance/mode evaluators agree on every public development seed.
5. Implement DEV-T06 and DEV-T07 after traffic conservation, queue, accepted-
   service, write, and blocked-useful-work balances close exactly.
6. Implement DEV-T08 after dataset partitions, feature-support separation,
   calibration, and common-mode corruption tests are immutable.

A track is only **smoke-ready** when its runner, schemas, public development
pack, property tests, independent evaluator, and reduced smoke manifest exist.
It is only **workstation-ready** when the exact reference-workstation manifest,
resource caps, full public pack, and artifact validation pass. It is only
**confirmation-ready** after code/config/schema hashes and private commitments
are frozen. None of those states exists now.

## Promotion, rejection, and interpretation rules

1. A PASS supports only the protocol's frozen synthetic claim and resource
   boundary. It does not promote a biological mechanism, architecture, or
   universal design rule.
2. A FAIL rejects the proposed translation under the tested conditions. It
   does not contradict the biological paper.
3. A C arm that matches B without its prespecified resource reduction is
   `INCONCLUSIVE` unless a kill boundary makes it FAIL.
4. A resource benefit that depends on hidden coordinates, incomplete
   validation, lower service, omitted fallback, or failed worlds is INVALID.
5. The exact checkpoint/log null remains preferred whenever it is valid,
   cheaper, and satisfies the same service and risk boundary.
6. No result may be described as eliminating hallucination, achieving
   self-repair, reproducing development, regenerating an AI, or approaching
   biological energy efficiency.

## Current execution state

All ten protocols are `NO_RESULT`. The source-audit snapshot is frozen above,
but no runner or workstation manifest exists, no development or private seed
has been executed, and no result artifact exists. This document is only a
prospective preimplementation contract.

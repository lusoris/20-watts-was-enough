# Fixture F-023 — Plant plasticity, memory, and signalling

<!-- markdownlint-disable MD013 -->

- **Status:** complete pre-implementation CPU-only experiment contract
- **Direct claim proposals:**
  [C-1516](../../research/claims.md#c-1516)--[C-1525](../../research/claims.md#c-1525)
- **Source audit:** [plant plasticity, stress memory, and distributed signalling](../../research/audits/2026-08-25-plant-plasticity-memory-signalling.md)
- **Audit snapshot:** SHA-256 `ECF80056D94EA6260AFA2B0DE3E6D629933A566F110BFAED10CCDF07FBF7214A`
- **Fixture ID:** `F-023`
- **Protocol IDs:** `PLM-T01`--`PLM-T10`
- **Execution state:** no runner, sealed-seed manifest, generated data,
  reference-workstation manifest, execution artifact, or result exists
- **Registry disposition:** no new P-series principle, architecture candidate,
  biological inference, or claimed efficiency effect

This fixture is the reciprocal falsification contract for ten plant-mechanism
claim proposals. It does not simulate a plant. Every environment, event,
module, latch, route, resource patch, sensor, and cost is synthetic. Biological
language remains source-qualified in the audit; every number below is a
generator setting, numerical tolerance, minimum project effect, or compute
cap rather than a biological normal, safe limit, legal threshold, or observed
improvement.

The user-supplied [DOI 10.1111/nph.20418](https://doi.org/10.1111/nph.20418)
is deliberately not a protocol input. It is an already-integrated 2025 *New
Phytologist* Letter and proposed research programme on concurrent fungal-guild
networks, not direct evidence for a new mechanism claim. F-023 neither repeats
the existing fungal attribution boundary nor creates an eleventh track.

| Protocol | Claim | Registered question |
| --- | --- | --- |
| PLM-T01 | [C-1516](../../research/claims.md#c-1516) | Population switches versus mature duration filters |
| PLM-T02 | [C-1517](../../research/claims.md#c-1517) | Retention and evidence-gated lifecycle reset |
| PLM-T03 | [C-1518](../../research/claims.md#c-1518) | Writer, trace, maintenance, and retrieval separation |
| PLM-T04 | [C-1519](../../research/claims.md#c-1519) | Regenerative-state placement with charged reserve |
| PLM-T05 | [C-1520](../../research/claims.md#c-1520) | Common alarm plus typed context |
| PLM-T06 | [C-1521](../../research/claims.md#c-1521) | Stress-dependent route multiplexing |
| PLM-T07 | [C-1522](../../research/claims.md#c-1522) | Sense-by-action before structural admission |
| PLM-T08 | [C-1523](../../research/claims.md#c-1523) | Resource-conditioned future capacity |
| PLM-T09 | [C-1524](../../research/claims.md#c-1524) | Boundary sensing plus routed event wave |
| PLM-T10 | [C-1525](../../research/claims.md#c-1525) | Coupled light--temperature history sensor |

## Question and hypotheses

Each protocol asks whether a bounded artificial translation of one biological
boundary can improve a registered task or resource endpoint after a mature
null receives equal observable information, action authority, state, tuning,
reserve, communication, construction, and failure treatment. Directional
hypotheses are falsification targets, not expected findings.

## Systems, scenarios, and tasks

Each track defines its own synthetic data-generating process (DGP), hidden
state, observation operator, action set, development/confirmation/transfer
support, intervention family, terminal loss, and artifact schema. No track may
borrow an evaluator-only field or a budget from another track.

## Arms, baselines, and strongest nulls

Every track contains four roles:

1. **A -- collapsed analogy:** the tempting simplified biomimetic rule.
2. **B -- mature null:** the strongest named Bayesian, statistical,
   state-space, recurrent, cache, POMDP/MPC, event-bus, autoscaling, topology,
   or sensor baseline.
3. **C -- bounded translation:** the proposed mechanism with every special
   state, route, reserve, write, construction, and calibration operation
   charged.
4. **O -- evaluator-only oracle:** hidden state used for regret, support, and
   leakage tests; O is never deployable and never supplies an action to A/B/C.

An A failure does not make C novel. C must survive B. If B implements the same
effective state transition more simply or cheaply, the track fails.

## Matched budgets and equal information

1. A/B/C receive the same serialized observation record and timestamps in the
   primary equal-information stratum. A field not delivered to all three is
   evaluator-only.
2. If sensing or probing is an action, all arms receive identical authority,
   deadlines, sample caps, movement/build authority, and charged observation
   bytes. An arm cannot receive a free physical gradient, route label,
   forecast, age, reserve state, or calibration target.
3. Persistent and transient state, model parameters, RNG state, queues,
   caches, route tables, calibration records, rollback data, and metadata all
   count in bytes. Compression and serialization code are frozen before
   confirmation.
4. Communication counts payload, type, timestamp, route, checksum, retry,
   acknowledgement, and protocol headers. Shared memory writes count as
   communication unless the same process and address-space boundary is frozen
   for every arm.
5. Construction, idle capacity, reserve, replacement, reset, calibration,
   maintenance, and rollback are never credited as free. A/B/C receive the
   same initial synthetic resource endowment.
6. The one secondary sensor-co-design stratum in PLM-T10 may choose different
   sensor front ends, but all raw channels, sample rates, calibration calls,
   bytes, and operations are charged. It cannot substitute for the primary
   equal-raw-observation result.

## Measurements and units

The audit's construct and unit firewall controls. Each track declares a finite
seed loss $L_{k,s,a}\in[0,100]$ for track $k$, seed $s$, and arm $a$, plus raw
protected outcomes in native units. Loss is dimensionless and uses only
development-frozen positive scales. State and communication are bytes [B],
latency and CPU/wall time are seconds [s], operations/writes/messages are
counts, construction/reserve/action exposure are synthetic cost units [CU],
distance is metres [m], capacity is tasks/s, and synthetic resource capture is
RU/s. Workstation electricity and carbon are `not measured`.

## Required ablations and interventions

Every C arm has the component ablations written in its track. Confirmation
uses all registered interventions; transfer changes the named support after
code, parameters, thresholds, scales, and artifacts are frozen. Removing an
ablation, comparator, failure, reversal, or corruption requires a new fixture
version and new sealed packs.

## Analysis and statistical plan

The common paired seed-cluster procedure below controls all ten primary
C-versus-B comparisons. Repeated events, modules, nodes, lifecycles, routes,
patches, and timesteps inside one seed are not independent replicates.

## Promotion, rejection, and kill rules

A track can report only `PASS`, `FAIL`, `INCONCLUSIVE`, or `INVALID`. Parity
supplies no novelty or efficiency credit. A valid biological source does not
rescue a failed artificial translation.

### No-results authority

This file contains no execution output. A complete specification, successful
shakedown, or working runner is not a result. Even a later synthetic `PASS`
would establish only the named DGP and transfer family; it would not establish
a biological fact, deployed AI benefit, measured energy saving, safety,
legality, or conformity.

## Common CPU-only falsification contract

1. **Runtime and determinism:** implement in TypeScript/JavaScript under the
   repository-pinned Node.js runtime. Use binary64 reference arithmetic,
   PCG64-DXSM, canonical little-endian serialization, SHA-256 world manifests,
   no network at run time, and stable-hash tie breaking. A SHA-256 seed digest
   supplies a 128-bit state from bytes 0--15 and an odd stream increment from
   bytes 16--31. Uniform binary64 draws use the top 53 output bits divided by
   $2^{53}$; bounded integers use rejection sampling, never modulo reduction.
   Gaussian draws use two consecutive open-unit uniforms and the cosine
   Box--Muller variate, discarding the sine mate. Parallel reductions sort by
   canonical world ID. Unless dependence is written, draws are independent.
   Unless a track states another distribution, a closed continuous range
   `a--b` means $U(a,b)$ once per seed and a closed count/integer range means
   inclusive discrete uniform. Draw order follows each track's prose order,
   then ascending entity ID and time.
2. **Seed packs:** track $k\in\{1,\ldots,10\}$ uses public development seeds
   `1516000 + 10000*k + j`, $j=1,\ldots,64$. A registrar creates 128 private
   64-bit confirmation seeds and 64 disjoint private transfer seeds per track,
   publishes their SHA-256 commitments before implementation freeze, and
   reveals a pack only after code, configuration, policy registry, scales, and
   artifact-schema hashes are frozen. Private seeds have no public derivation.
3. **Inference unit:** one seed is one cluster. Events, timesteps, latches,
   keys, workers, hazards, nodes, patches, branches, generations, mixtures,
   pulses, and queries within a seed are repeated observations only.
4. **Generation and numerical failure:** draw fields in written order. A
   rejection sampler stops after 10,000 attempts. A solver or optimizer uses
   its track cap. Exhaustion, divergence, NaN/Inf, hash mismatch, missing
   artifact, constraint breach, or timeout remains in the denominator with
   $L=100$ and the track's maximum finite resource charge for the affected
   arm. It cannot be deleted, replaced, or relabelled abstention.
5. **Frozen policies:** development alone selects parameters from each written
   finite grid. Exact ties choose lower retained state, then lower development
   operations, then lexicographically smaller serialized configuration. No
   unlisted model family, feature, branch, fallback, optimizer, threshold, or
   post-confirmation repair is permitted.
6. **Equal tuning:** each arm receives the same 64 development seeds and at
   most 256 complete configuration evaluations per track. Successive halving
   uses seed prefixes 16, 32, then 64, with the best one-quarter retained at
   each stage. A family with fewer configurations repeats its lexicographically
   ordered configurations only for accounting; it receives no extra search.
7. **Raw records:** before scalarization, every arm records task error,
   calibration, abstention, false and missed actions, latency, state bytes,
   message bytes, observation count, operation count, write/reset count,
   construction, maintenance, reserve, CPU-s, wall-s, peak RSS, bytes
   read/written, artifact bytes, failures, fallbacks, and every track-specific
   protected outcome. A lower scalar loss cannot erase a protected failure.
8. **Development-frozen scales:** each positive normalization scale is the
   90th percentile of the named B raw metric over all 64 development seeds,
   floored at $10^{-12}$ in its native unit. Winsorization is prohibited.
   Track loss is the written weighted sum, capped at 100 only after all raw
   values are retained. A changed scale requires a new protocol version.
9. **Development route selection:** each track preregisters one primary
   resource $R_{k,s,a}\ge0$. Development selects exactly one C:B route.
   The **loss route** is eligible when mean C loss is at least 10% below B and
   every protected resource has mean ratio at most 1.05. The **resource route**
   is eligible when mean C primary resource is at least 15% below B, mean C
   loss is within 1% of B's finite loss cap, and every protected outcome gate
   holds. If both are eligible, choose the larger fractional excess over its
   threshold; exact ties choose loss. If neither is eligible, freeze loss plus
   a `development-ineligible` flag that prevents `PASS`. The route never
   changes after confirmation is revealed.
10. **Primary contrasts:** on confirmation, the loss route uses

    $$
    D^{L}_{k,s}=L_{k,s,C}-0.90L_{k,s,B}.
    $$

    The resource route uses

    $$
    D^{R}_{k,s}=R_{k,s,C}-0.85R_{k,s,B},\qquad
    D^{NI}_{k,s}=L_{k,s,C}-L_{k,s,B}-1.
    $$

    Transfer uses factors 0.95 and 0.925 and non-inferiority margin 0.5. A
    zero B endpoint gives no fractional credit; C must then be zero and parity
    cannot pass a superiority route.
11. **Paired inference:** for each contrast, test
    $H_0:E[D]\ge0$ against $H_1:E[D]<0$. With $n$ seed clusters, compute
    $T_{obs}=\bar D/(s_D/\sqrt n)$. If the standard error is zero, assign
    $T=-\infty,0,+\infty$ according to the numerator sign. Centre residuals
    $e_s=D_s-\bar D$. Draw exactly 100,000 joint seed-index vectors with
    replacement, shared across all ten tracks in a family, using
    `SHA256("PLM-v1|phase|family|joint-bootstrap-t")`; `phase` is
    `confirmation` or `transfer`, and `family` is `selected` or
    `resource-NI`. The lower-tail plus-one value is

    $$
    p_k=\frac{1+\#\{b:T^*_{k,b}\le T_{k,obs}\}}{100001}.
    $$

    Holm controls familywise $\alpha=0.01$ across the ten selected-route
    tests. Resource-route non-inferiority tests form a second Holm family. Let
    $q_{.01,k}$ be the first percentile of the track bootstrap statistics. The
    one-sided 99% upper bound is
    $U_k=\bar D-q_{.01,k}s_D/\sqrt n$. A gate passes only with Holm-adjusted
    $p\le0.01$ and $U_k<0$; equality fails. Report raw/adjusted values, bounds,
    means, medians, 5th/95th percentiles, and every paired seed record.
12. **Protected no-worsening inference:** each track's named raw error,
    calibration, unsafe/unsupported action, recovery, or resource gates use
    paired differences and one-sided 99% bootstrap upper bounds. Unless the
    track states otherwise, probability/rate margin is 0.005 and normalized
    continuous-metric margin is 0.01. Holm at familywise 0.01 covers all
    protected gates within a track. Non-significance is not non-inferiority.
13. **Ablation identification:** C must beat each named C ablation on the raw
    endpoint the component is supposed to affect, with a one-sided 99% paired
    upper bound below zero. An ablation may share C's tuned parameters but not
    retune after confirmation. If no ablation differs under an otherwise
    informative DGP, the proposed decomposition fails.
14. **Hostile transfer:** the 64-seed transfer pack changes only the written
    support. Frozen C must retain the selected effect direction, every absolute
    safety/integrity gate, and either pass the relaxed transfer contrast or
    issue only a track-authorized abstention whose cost is retained. Transfer
    cannot rescue failed confirmation.
15. **Feasible sensitivity diagnostic:** using development seeds only, plant
    paired shifts of 0%, 2%, 5%, and 10% of B's median finite loss and estimate
    rejection with 20,000 fixed-reference joint bootstrap samples plus 5,000
    outer samples per shift. Freeze the reference critical value before outer
    sampling. Fewer than 80% rejections at the 5% shift makes a later valid
    non-rejection `INCONCLUSIVE`; it cannot change seeds, margins, or methods.
16. **Leakage and support:** hidden generator state, future observations,
    oracle labels, transfer flags, and private-seed identity are evaluator-only.
    A hash or mutual-information audit finding undeclared access makes the
    track `INVALID`. Support coverage, effective sample size, calibration, and
    abstention are reported; an unsupported but confident action is a
    protected failure.
17. **Conservation and closure:** byte, queue, capacity, resource, construction,
    reserve, and state ledgers close to relative tolerance $10^{-8}$ and
    absolute tolerance $10^{-10}$ in their native unit. Analytic-limit cells
    require relative error $10^{-6}$. More than 5% confirmation generator or
    numerical failures makes the track `INVALID`, not negative.
18. **Prospective compute envelope:** before the first timed development run,
    freeze `reference-workstation.json` with CPU model/stepping/microcode, four
    assigned physical cores, SMT status, RAM, storage/filesystem, OS build,
    Node binary hash/version, power plan, and repository commit. Run on AC
    power, no network, no GPU, at most four worker threads, at most 8 GiB peak
    RSS, 2 GiB retained artifacts per track, and 60 s timed wall per
    `(track,seed,arm)`. CPU, wall, I/O, compression, and artifact writes are
    included. Exceeding a cap is a retained failure, not a reason to reduce
    resolution after freeze.
19. **Terminal states:** `PASS` means the frozen selected route, all protected
    gates, ablations, and hostile transfer passed with valid computation.
    `FAIL` means a valid informative run missed any required gate.
    `INCONCLUSIVE` means valid computation lacked the frozen sensitivity or a
    track's predeclared challenge floor. `INVALID` means generator, numerical,
    leakage, seed, unit, artifact, or protocol integrity failed. No state is
    silently converted into another.
20. **No-result boundary:** protocol prose, code existence, unit tests, a
    shakedown, and an unsealed development run are not results. Result language
    begins only after independent review, freeze, registrar reveal, complete
    execution, validation, and retained artifacts.

## Ten CPU-executable protocol specifications

### PLM-T01: Population-switch duration memory

- **Claim tested:** proposed C-1516.
- **Scientific question:** under noisy, interrupted evidence followed by a
  stable thresholded decision, can a population of stochastic binary latches
  improve calibrated duration memory or reduce writes relative to mature
  equal-state filters?
- **DGP:** one seed contains 512 episodes. Each has $T\in\{64,96,128,192\}$
  one-second steps, hidden effective exposure
  $d=\sum_t h_t\Delta t$ [s], and 0--12 warm interruptions of 1--8 s. Hidden
  $h_t\in\{0,1\}$ follows a semi-Markov process. Observed $x_t$ has independent
  flip probability $p_f\sim U(0.01,0.20)$, missing blocks occupying 0--15% of
  steps, and timestamp jitter $N(0,0.05^2)$ s. Target commitment probability is
  $q^*=\operatorname{logit}^{-1}[(d-64)/8]$; a binary terminal target is drawn
  once from Bernoulli($q^*$).
- **Observations and hidden state:** A/B/C receive only timestamped $x_t$ and
  missingness. True $h_t,d,q^*$, interruption labels, and target probability
  are evaluator-only. All arms receive 256 B persistent state, including
  parameters and RNG state, and one terminal output probability.
- **Frozen arms:** A is a quantized accumulator with one tuned leak
  $\lambda\in\{0,0.001,0.005,0.01,0.02\}$ s$^{-1}$ and threshold. B is the best
  development-selected member of (i) exact two-state hidden semi-Markov
  Bayesian filtering with 8/16/32 duration bins, (ii) quantized Kalman-style
  accumulator with learned observation error, and (iii) a 1-layer GRU with
  hidden size 4/8/16 and quantized state; model bytes count. C uses
  $N\in\{32,64,128,192\}$ latches, hazard
  $1-\exp(-\alpha x_t)$ with
  $\alpha\in\{0.0025,0.005,0.01,0.02\}$ s$^{-1}$, optional two-step
  confirmation $r\in\{1,2\}$, and beta-binomial calibration fit on development.
- **Ablations:** correlated-latch RNG blocks of 8; no confirmation; fraction
  replaced by its same-bit deterministic counter; and no authorized reset
  between episodes.
- **Primary loss:**
  $L=40\,\mathrm{Brier}+20\,\mathrm{ECE}+20e_{rank}+20e_{premature}$,
  where ECE uses ten development-frozen probability bins, $e_{rank}$ is pairwise
  duration-order error, and $e_{premature}$ is the fraction committing above
  0.9 when $d<48$ s. Each term is dimensionless and retained separately.
- **Primary resource:** number of persistent-state bit transitions plus RNG
  state updates [write]. State bytes, update operations, and reset operations
  are protected resource axes.
- **Interventions:** uninterrupted versus interrupted schedules; missing blocks
  aligned versus unaligned with interruptions; low versus high sensor noise;
  and threshold neighborhoods $d\in[48,80]$ s. Component identification
  requires correlation to worsen calibration and no-confirmation to worsen
  premature commitment.
- **Hostile transfer:** interruption lengths become 9--20 s, flip errors occur
  in bursts from a two-state error process, and the target centre moves from
  64 to 80 s without retraining. All arms receive the new decision centre as a
  task contract but no new calibration data.
- **Absolute gates:** Brier $\le0.20$, ECE $\le0.05$, premature commitment
  $\le0.03$, no state-cap violation, and reset closure on every episode.
- **Challenge/no-result rule:** if fewer than 20% of episodes lie within 16 s
  of the decision centre or oracle Brier variance is below $10^{-4}$, the seed
  pack is underchallenging and a valid non-rejection is `INCONCLUSIVE`.
- **Artifacts:** episode manifest; raw and hidden streams in separate files;
  serialized policy/state hashes; latch transition counts; probabilities;
  calibration bins; paired losses/resources; and failure records.

### PLM-T02: Lifecycle retention and reset

- **Claim tested:** proposed C-1517.
- **Scientific question:** can an explicit evidence-gated lifecycle reset
  reduce inherited bias when lifecycle correlation changes without destroying
  useful priors when correlation persists?
- **DGP:** one seed contains 96 lifecycles, each with 128 Bernoulli-logistic
  tasks. Latent $\theta_g\in\mathbb R^8$ follows
  $\theta_{g+1}=\rho_g\theta_g+\sqrt{1-\rho_g^2}\epsilon_g$. Development and
  confirmation use blocks with $\rho_g\in\{0,0.3,0.7,0.95\}$ and hidden
  change-points every 8--24 lifecycles. Features are $N(0,I_8)$; labels follow
  $\operatorname{Bernoulli}(\sigma(x^T\theta_g))$.
- **Observations and hidden state:** A/B/C receive feature/label history,
  lifecycle-boundary events, and 4 KiB persistent state. They do not receive
  $\theta_g$, $\rho_g$, change-point locations, or transfer mode. Reset actions
  occur only at authenticated lifecycle boundaries and count state bytes
  cleared plus writes.
- **Frozen arms:** A carries the final posterior/weights unchanged. B is a
  Bayesian dynamic generalized linear model with development-selected
  transition variance and Adams--MacKay online change-point detection with
  hazard grid $\{1/8,1/16,1/32,1/64\}$. C keeps separate within-life and
  inherited summaries and chooses reset fraction
  $r\in\{0,0.25,0.5,0.75,1\}$ from a likelihood-ratio statistic with threshold
  $\gamma\in\{2,4,8,16\}$; its transition evidence, gate, rollback copy, and
  cleared state all count.
- **Ablations:** never reset; always reset; reset without boundary
  authentication; and gate with likelihood evidence shuffled across
  lifecycles.
- **Primary loss:**
  $L=50\ell_{first}+25\ell_{all}+15b_{carry}+10e_{reset}$ after division by
  development B scales. $\ell_{first}$ is log loss over the first 32 samples
  of each lifecycle, $\ell_{all}$ is full-life log loss, $b_{carry}$ is
  absolute signed carryover calibration bias, and $e_{reset}$ is wrong reset or
  wrong retain rate relative to evaluator-only counterfactual risk.
- **Primary resource:** bytes written or cleared at lifecycle boundaries [B].
  CPU operations, stored bytes, detection delay, and rollback bytes are
  protected.
- **Interventions:** fixed high/low correlation, abrupt correlation changes,
  identical marginal label rates with changed coefficients, and boundary-event
  corruption. The evidence-shuffle ablation must worsen first-quarter loss or
  wrong-reset rate.
- **Hostile transfer:** correlation becomes negative
  $\rho_g\in\{-0.8,-0.4\}$ for 16-lifecycle blocks and boundary events have 5%
  duplicates plus 5% delays. No arm is told the sign or block start.
- **Absolute gates:** first-quarter excess log loss versus oracle $\le0.20$,
  wrong reset/retain rate $\le0.15$, no reset outside an authenticated boundary,
  and complete cleared-byte/rollback closure.
- **Challenge/no-result rule:** if always-reset and never-reset differ by less
  than 0.01 mean first-quarter log loss on both development and confirmation,
  the pack cannot identify reset value and a valid non-rejection is
  `INCONCLUSIVE`.
- **Artifacts:** lifecycle parameters hidden from arms; observation manifest;
  boundary log; posterior/state bytes; reset decisions and evidence; rollback
  records; predictions; paired outcomes; and audit hashes.

### PLM-T03: Transient writer, trace, and retrieval

- **Claim tested:** proposed C-1518.
- **Scientific question:** can separating a transient writer, keyed decaying
  trace, and later retrieval reduce second-event response cost relative to an
  equal-state cache or recurrent learner without persistent bias?
- **DGP:** one seed contains 256 keys and 4,096 events over $H=86,400$ s.
  Hazard keys recur after log-uniform delays 30--30,000 s; 35% occur once.
  First presentation provides a noisy context vector in $\mathbb R^{16}$ and a
  target action after delay 1--8 s. Recurrences share action with probability
  $p_{same}\sim U(0.65,0.98)$. Distractor keys have cosine similarity
  0.7--0.98. Event cost rises linearly for the first 2 s of response latency.
- **Observations and hidden state:** all arms receive identical key embeddings,
  timestamps, revealed post-action labels, and 64 KiB total state. Future
  recurrence, true key identity before noisy matching, $p_{same}$, and label
  inversion are hidden. Each read/write and key comparison counts.
- **Frozen arms:** A permanently updates an online logistic classifier with
  learning rate $\{10^{-4},10^{-3},10^{-2},10^{-1}\}$. B is the better of an
  LRU/TTL cache with TTL
  $\{60,300,1800,7200,28800\}$ s and a quantized GRU/meta-learner with equal
  state. C has a writer threshold on surprise
  $\{0.1,0.25,0.5,1\}$, at most 512 keyed traces, exponential decay half-life
  $\{60,300,1800,7200\}$ s, cosine retrieval threshold
  $\{0.75,0.85,0.92,0.97\}$, and least-recently-supported eviction.
- **Ablations:** writer disabled; decay disabled; retrieval key shuffled;
  writer always on; and trace value retained but key removed.
- **Primary loss:**
  $L=35\ell_{recur}+20t_{response}+20\ell_{single}+15e_{wrong-key}+10b_{post}$,
  normalized by development B scales. $b_{post}$ is persistent prediction bias
  after a key's registered lifetime.
- **Primary resource:** persistent state writes [write]. Read operations,
  stored bytes, evictions, comparisons, and response latency are protected.
- **Interventions:** recurrence delay bins; key similarity; first versus later
  recurrence; writer-surprise bins; cache pressure; and same-label versus
  changed-label recurrence. Writer/decay/retrieval ablations must affect their
  registered stages rather than only aggregate loss.
- **Hostile transfer:** recurrence delays become 40,000--120,000 s, 60% of
  recurring keys invert their labels, and distractor similarity shifts upward
  by 0.03. Frozen expiry and abstention rules remain active.
- **Absolute gates:** wrong-key action rate $\le0.02$, post-lifetime bias
  $\le0.03$, state cap never exceeded, every eviction recorded, and single-hit
  loss no worse than B by more than the protected margin.
- **Challenge/no-result rule:** confirmation must contain at least 512
  recurrences in each of three delay bins and at least 256 high-similarity
  distractors; otherwise inference on stage separation is `INCONCLUSIVE`.
- **Artifacts:** ordered event stream; hidden recurrence ledger; state snapshots;
  writer/read/decay/eviction records; key-match scores; predictions; latency;
  resource vector; and paired losses.

### PLM-T04: Regenerative locus and charged reserve

- **Claim tested:** proposed C-1519.
- **Scientific question:** when workers are replaceable and regeneration is a
  bottleneck, does concentrating preparedness in renewal/control state improve
  recovery cost relative to checkpointed or uniformly replicated protection
  after reserve and correlated risk are charged?
- **DGP:** one seed simulates 128 worker modules, four renewal modules, and
  demand $D(t)\in[40,100]$ tasks/s over $H=14,400$ s. A priming event occurs
  600--3,600 s before a loss. Failure families remove 20--80% of workers,
  renewal modules, or both with common-cause correlation
  $\kappa\in\{0,0.25,0.5,0.8\}$. Rebuilding one worker takes 20--120 s, 1--8 CU
  reserve, and a valid 256 B role/configuration record.
- **Observations and hidden state:** all arms receive health events, demand,
  authenticated priming events, and identical failure detectors. They receive
  64 KiB preparedness/checkpoint state, 512 CU initial reserve, and identical
  rebuild authority. Future failure family and evaluator configuration are
  hidden.
- **Frozen arms:** A spreads priming state uniformly over workers. B is the
  best of incremental checkpoint plus four hot standbys and erasure-coded
  checkpoint with $(n,k)\in\{(6,4),(8,4),(10,6)\}$, with all standby reserve
  and refresh charged. C stores renewal recipes and priming state in
  $q\in\{1,2,3,4\}$ renewal modules plus an authenticated cold rollback copy;
  reserve fraction $r\in\{0.1,0.25,0.4,0.6\}$ is unavailable to ordinary
  service until released.
- **Ablations:** no localized state; no cold rollback; reserve uncharged
  diagnostic, which is prohibited from PASS; state localized but rebuild
  authority distributed; and priming copied after rather than before failure.
- **Primary loss:**
  $L=45U+20t_{95}+15e_{wrong-role}+10e_{undetected}+10R_{debit}$ after B-scale
  normalization. $U$ is unmet task area, $t_{95}$ time to 95% prefailure
  deliverable capacity, and wrong-role/undetected are protected rates.
- **Primary resource:** idle preparedness and checkpoint maintenance
  operations [op]. Retained bytes, reserved CU, rebuild CU, standby capacity,
  messages, and restoration latency are protected.
- **Interventions:** worker-only, renewal-only, and correlated loss; priming
  timing; demand surge during recovery; rollback corruption; and one versus
  repeated failures. Localized state must improve worker-heavy recovery, while
  cold rollback must specifically reduce renewal-loss terminal failures.
- **Hostile transfer:** failures target renewal modules with probability 0.7,
  rebuild time doubles, and priming has 10% false positives. C may abstain and
  use its charged rollback; unsupported reconstruction is a protected failure.
- **Absolute gates:** wrong-role rebuild rate $=0$, undetected unrecoverable
  state $=0$, reserve and byte ledgers close, no arm serves from reserved
  capacity before release, and targeted-renewal transfer terminal-failure rate
  is no worse than B by more than 0.005.
- **Challenge/no-result rule:** if worker-only and renewal-targeted failures do
  not each occupy at least 20% of confirmation seeds, placement risk is not
  identifiable and the track is `INVALID`; if all arms recover with
  $U<10^{-6}$ and no resource separation, it is `INCONCLUSIVE`.
- **Artifacts:** topology/failure manifest; state placement and byte hashes;
  checkpoint/standby/rollback records; reserve ledger; rebuild actions;
  accepted demand trace; terminal failures; and paired results.

### PLM-T05: Common alarm plus typed context

- **Claim tested:** proposed C-1520.
- **Scientific question:** does separating a rapid common readiness channel
  from typed context reduce wrong high-cost actions at matched information and
  latency relative to a mature joint Bayesian/POMDP policy?
- **DGP:** one seed contains 2,048 hazard episodes from four types
  $k\in\{1,2,3,4\}$ plus no-hazard. A common alarm has sensitivity
  $0.75$--$0.99$, false-positive rate $0.01$--$0.20$, and latency 10--80 ms.
  A typed 12-feature packet arrives 20--300 ms later with class overlap set by
  Mahalanobis separation 0.5--4. Hazards may co-occur in 15% of episodes.
  Each action has type-dependent prevention value, wrong-mode exposure
  1--20 CU, and delay cost 0.01--0.2 CU/ms.
- **Observations and hidden state:** A/B/C receive the identical timestamped
  common-alarm bitstream, typed feature packets, missingness, and action cost
  table. True hazard, latent severity, future packet, and channel corruption
  are hidden. All receive 32 KiB state, four action slots, identical deadlines,
  and the same abstain/safe-default action.
- **Frozen arms:** A acts from common alarm plus development-majority type. B
  is an exact finite-horizon POMDP with learned observation matrices and a
  calibrated gradient-boosted hazard posterior as approximation if exact
  belief enumeration exceeds 50,000 states; tree depth
  $\{2,3,4\}$, trees $\{32,64,128\}$, and probability calibration
  {isotonic, temperature} are finite. C opens a readiness gate on the common
  channel and selects action only when typed posterior exceeds
  $\beta\in\{0.6,0.75,0.9,0.97\}$ within wait deadline
  $w\in\{40,80,160,320\}$ ms; co-occurrence requires independent support for
  each action.
- **Ablations:** common-only; typed-only; typed packet with shuffled class;
  readiness gate forced open; and conjunction changed to disjunction.
- **Primary loss:**
  $L=35C_{harm}+25C_{delay}+20e_{wrong}+10e_{miss}+10e_{unsupported}$ after
  division by B development scales. Harm and delay remain CU and CU-ms raw;
  errors are rates.
- **Primary resource:** high-cost action exposure [CU]. Message bytes,
  observation count, wait latency, inference operations, and abstention are
  protected.
- **Interventions:** alarm-only period; typed-only period; packet delay;
  common-channel false alarms; typed-label swaps; mixed hazards; and common
  versus typed channel loss. A typed swap must change C's selected response
  distribution, while common-channel deletion must suppress unsupported
  high-cost action.
- **Hostile transfer:** class priors reverse, typed packets are adversarially
  delayed to just beyond the frozen wait deadline, 10% of packets carry a
  valid checksum but wrong type, and a fifth unseen hazard generates common
  alarms. The authorized response to unsupported type is abstention/default,
  whose delay and missed-prevention costs remain.
- **Absolute gates:** wrong-mode rate $\le0.01$, unsupported high-cost action
  rate $=0$, missed severe-event rate $\le0.05$, calibration ECE $\le0.05$, and
  p99 response latency $\le350$ ms.
- **Challenge/no-result rule:** at least 256 episodes must present disagreement
  between common alarm and typed posterior and at least 128 must contain mixed
  hazards; otherwise the conjunction boundary is `INCONCLUSIVE`.
- **Artifacts:** hazard/channel manifest; observation packet bytes; posterior
  and calibration records; gate/action timeline; harm/delay ledger; ablation
  outputs; unsupported events; and paired results.

### PLM-T06: Stress-dependent route multiplexing

- **Claim tested:** proposed C-1521.
- **Scientific question:** when event type and useful route have persistent but
  fallible structure, does a route-aware multilayer fabric improve attribution
  or fault isolation relative to a tagged single bus with equal information
  and total capacity?
- **DGP:** one seed contains a 64-node geometric graph with two overlapping
  layers. Each layer has total capacity 8 MiB/s, link latency 0.2--5 ms, and
  failure domains. Four event types originate at random nodes; development and
  confirmation route preference matrices have diagonal probability
  $p_r\sim U(0.55,0.95)$. Events emit 32--2,048 B payloads, may overlap within
  10 ms, and require delivery to 4--16 subscribers before deadlines 20--200 ms.
- **Observations and hidden state:** A/B/C receive payload, source, arrival
  time, route or explicit matched tag, queue state allowed by the policy, and
  link health. Evaluator event type before decoding, causal source during
  collisions, future failure, and preference matrix are hidden. Provisioned
  aggregate capacity, node state 64 KiB, and 16 MiB/s total fabric capacity are
  identical.
- **Frozen arms:** A uses one untagged FIFO bus and payload classifier. B uses
  one capacity-matched tagged publish/subscribe fabric with weighted fair
  queuing, per-type priorities, redundant shortest paths, and a Bayesian
  payload/tag classifier. C uses the two physical layers, route and payload
  jointly in a calibrated classifier, and per-layer queues; routing table
  updates occur every $\{10,50,200\}$ ms with hysteresis
  $\{0,0.1,0.25\}$. Any route bit that B must encode explicitly is charged as
  a tag byte and supplied to B.
- **Ablations:** layer identity erased before decoding; payload erased while
  retaining route; routes randomly permuted; layers collapsed into one bus;
  and duplicate delivery disabled.
- **Primary loss:**
  $L=35e_{attribute}+25e_{deadline}+20e_{drop}+10t_{p99}+10e_{false-route}$
  after B-scale normalization. Attribution and delivery remain event-level
  raw records.
- **Primary resource:** transmitted bytes including headers, tags, retries,
  duplicates, and acknowledgements [B]. Provisioned capacity, link count,
  queue bytes, route-table state, updates, and maintenance operations are
  protected.
- **Interventions:** one-layer outage; shared-node outage; payload collision;
  route-specific congestion; event mixture; and route/payload conflict. The
  identity-erased ablation must selectively worsen attribution when route
  structure is informative; route randomization must remove that gain.
- **Hostile transfer:** the route-preference matrix is permuted, common-mode
  failures remove 30% of shared nodes, and payload sizes double while total
  provisioned capacity stays fixed. Policies receive health observations but
  no transfer flag or new labels.
- **Absolute gates:** event attribution error $\le0.05$, severe-event deadline
  miss $\le0.02$, queue conservation error below tolerance, no hidden capacity,
  and transfer common-mode drop rate no worse than B by more than 0.005.
- **Challenge/no-result rule:** confirmation route identity must carry at least
  0.05 bit conditional mutual information about event type after payload,
  estimated evaluator-side with a frozen permutation test. Below that, a valid
  non-rejection is `INCONCLUSIVE`; C may not claim route semantics.
- **Artifacts:** graph/layer/failure manifest; per-packet payload/header/tag
  bytes; queue/link traces; decoder predictions; route updates; drops/retries;
  conditional-information diagnostic; and paired outcomes.

### PLM-T07: Sense-by-growth and structural admission

- **Claim tested:** proposed C-1522.
- **Scientific question:** can an action-created observation improve delayed
  structural admission after probe, construction, maintenance, and reversal
  costs are charged, and can it survive an active-sensing POMDP/MPC/topology
  null with the same authority?
- **DGP:** one seed contains a $20\times20$ m continuous field with 8--24
  resource patches. Patch radius is 0.4--3 m, concentration 1--20 RU/m$^2$,
  persistence 300--7,200 s, and motion 0--0.01 m/s. A root-like graph starts
  at the origin and grows for $H=14,400$ s. A probe may extend at up to
  0.02 m/s and draws local potential-difference observations whose signal
  magnitude depends on motion and resource gradient. A branch costs
  $k_0\in[1,5]$ CU plus $k_L\in[0.5,2]$ CU/m and maintenance
  $\mu_L\in[10^{-5},10^{-3}]$ CU/(m s); constructed branches cannot be deleted
  for 1,800 s.
- **Observations and hidden state:** all arms receive identical local contact,
  probe-created gradient, position relative to their own graph, elapsed time,
  construction cost, and resource captured after contact. Hidden patch field,
  future persistence/motion, and oracle optimal topology are evaluator-only.
  All receive the same 256 probes, 100 m total constructed length, 128 branches,
  64 KiB state, and 1,000 CU construction/reserve budget.
- **Frozen arms:** A branches when current local concentration exceeds a
  threshold $\{1,2,5,10\}$ RU/m$^2$. B is a particle-belief POMDP with
  $\{128,256,512\}$ particles plus receding-horizon MPC/topology optimization
  at horizon $\{300,900,1800\}$ s; it can execute every C probe and branch.
  C executes a bounded probe of length $\{0.05,0.1,0.2,0.4\}$ m, admits a
  branch when wet-opportunity posterior exceeds
  $\{0.6,0.75,0.9\}$, and independently suppresses admission after an
  air-gap/negative observation for refractory period
  $\{60,300,900\}$ s.
- **Ablations:** passive observation only; probe observation shuffled;
  positive gate only; negative gate only; refractory period removed; and
  construction made falsely reversible as a prohibited diagnostic.
- **Primary loss:**
  $L=40\,\mathrm{regret}_{capture}+20K+15M+15K_{stranded}+10e_{unsafe}$ after
  B-scale normalization. Capture is RU, construction/maintenance are CU,
  stranded cost is CU on branches capturing below 5% of their expected RU,
  and unsafe is budget/deadline violation rate.
- **Primary resource:** construction plus maintenance CU. Probe distance,
  observation bytes, computation, branch count, built length, reserve, and
  irreversible stranded capacity are protected.
- **Interventions:** stationary/slow/fast patches; wet contact versus air gap;
  growth/probe disabled; observation retained without action; and positive or
  negative gate ablations. Probe-shuffle must remove any information benefit.
- **Hostile transfer:** patch persistence falls to 30--240 s, patch velocity
  rises to 0.03 m/s, air gaps generate false negative readings with probability
  0.2, and construction lock extends to 3,600 s. No arm receives future
  persistence.
- **Absolute gates:** budget violations $=0$, stranded construction fraction
  $\le0.20$ in confirmation, captured RU ledger closure, no oracle field access,
  and hostile-transfer loss no worse than B by more than the selected margin.
- **Challenge/no-result rule:** evaluator-side value of the permitted probe
  must exceed 0.02 normalized oracle regret on at least 20% of confirmation
  seeds. Otherwise active sensing is not tested and the result is
  `INCONCLUSIVE`, even if one controller wins by compute accident.
- **Artifacts:** field/patch hidden manifest; graph/probe/action timeline;
  observation bytes; beliefs; construction/maintenance/reserve ledger;
  captured RU; stranded branches; oracle regret; ablations; and paired results.

### PLM-T08: Resource-conditioned future capacity

- **Claim tested:** proposed C-1523.
- **Scientific question:** when capacity decisions take effect only in future
  module generations, does sustained exportable resource improve admission
  relative to local or model-predictive autoscaling after transport,
  construction, idle capacity, and reversal are charged?
- **Source correction boundary:** the biological motivation uses Bao et al.
  2023 only together with its 2024 correction,
  [DOI 10.1073/pnas.2416561121](https://doi.org/10.1073/pnas.2416561121).
  No superseded Figure 5 or Supplementary Figure S1 is treated as evidence or
  a generator target.
- **DGP:** one seed contains 48 sequential module generations. Generation $g$
  has mature producer capacity $P_g(t)$ [CU/s], local demand $D_g(t)$
  [tasks/s], bounded export link $E_g\le20$ CU/s, and a delayed decision for
  $n_{g+1}\in\{0,\ldots,64\}$ sensor/actuator units. Build delay is
  $\tau_b\in\{300,900,1800,3600\}$ s, construction is 2--10 CU/unit, idle cost
  is 0.001--0.02 CU/(unit s), and each unit serves 1--4 tasks/s. Resource and
  future demand share latent correlation $\rho\sim U(-0.2,0.95)$ plus age and
  season effects.
- **Observations and hidden state:** A/B/C receive mature production, export
  flow, local and upstream demand histories, age, season index, current
  capacity, prices/costs, and build delay. Future demand, latent correlation,
  transfer mode, and oracle capacity are hidden. All receive 64 KiB state,
  identical build authority, 1,500 CU reserve, and the same forecast horizon.
- **Frozen arms:** A uses local-demand exponential smoothing with
  $\lambda\in\{0.01,0.05,0.2,0.5\}$ and target utilization
  $\{0.5,0.7,0.85\}$. B is stochastic model-predictive autoscaling with a
  Bayesian vector autoregression over all supplied histories, horizon
  $\{1,2,4,8\}$ generations, and chance constraint
  $\{0.9,0.95,0.99\}$. C uses the same demand forecast family but gates future
  units by a lower confidence bound on sustained exportable resource over
  window $\{300,900,1800,3600\}$ s and admission threshold
  $\{0.5,0.75,0.9\}$; every denied unit and resource bottleneck is logged.
- **Ablations:** resource gate removed; resource history shuffled across
  generations; age removed; demand forecast removed; transport cap ignored as
  a prohibited diagnostic; and resource signal supplied only after the build
  decision.
- **Primary loss:**
  $L=40U+25C_{idle}+20C_{build}+10C_{reversal}+5e_{deadline}$ after B-scale
  normalization. $U$ is unmet task area, costs are CU, and deadline error is a
  rate. Mean utilization cannot erase tail unmet demand or reserve exhaustion.
- **Primary resource:** construction plus idle-capacity CU. Capacity count,
  export CU, transport loss, reserve debit, decision messages, model state,
  and reversal cost are protected.
- **Interventions:** positive, zero, and negative resource--future-demand
  correlation; transport bottleneck; sustained versus transient production;
  age/season confounding; and build-delay sweep. Resource-shuffle must remove
  any claimed gate value beyond ordinary demand forecasting.
- **Hostile transfer:** demand reverses every 1--2 generations, correlation
  becomes $-0.8$, export link capacity halves, and resource production remains
  high while demand falls. C receives current observations but no new model
  search.
- **Absolute gates:** reserve exhaustion $=0$, p95 unmet-demand fraction
  $\le0.10$, no build beyond supplied reserve/transport support, resource and
  task ledgers close, and hostile reversal overcapacity no worse than B by
  more than 0.01 normalized units.
- **Challenge/no-result rule:** confirmation must contain at least 12
  generations each with positive and non-positive resource--future-demand
  conditional correlation. If the resource-shuffle ablation changes B-scaled
  loss by less than 0.01 throughout, the proposed predictor is unsupported and
  a valid non-rejection is `INCONCLUSIVE`.
- **Artifacts:** generation/demand/resource manifest; observation histories;
  posterior forecasts; capacity decisions; build/idle/reserve/transport
  ledgers; unmet service; ablations; correction provenance note; and paired
  outcomes.

### PLM-T09: Boundary sensing and routed event wave

- **Claim tested:** proposed C-1524.
- **Scientific question:** can a passive boundary transfer plus event-triggered
  wave reduce polling or response latency relative to a calibrated
  conventional sensor/event bus at matched selectivity, calibration, route,
  and front-end cost?
- **Evidence-status boundary:** the biological claim is a plausible
  composition of two established component observations. A synthetic pass
  cannot promote that biological composition to established.
- **DGP:** one seed contains 32 boundary sites on a 128-node graph. At each
  site, four-component mixture $\mathbf c_t$ changes through 1,024 episodes.
  Target analyte amplitude is 0--10 concentration units, three interferents
  are 0--20, and boundary response
  $y=\sum_j a_jc_j/(1+\sum_jb_jc_j)+\nu$ drifts as
  $a_j(t+1)=a_j(t)+N(0,\sigma_d^2)$ with
  $\sigma_d\in[10^{-5},10^{-2}]$ per second. True target events require
  delivery to 8 subscribers within 50--500 ms. Links have 1--50 ms latency,
  4--64 KiB/s capacity, and route outages.
- **Observations and hidden state:** all arms receive the same raw front-end
  samples, calibration standards when requested, timestamps, graph health, and
  action costs in the primary equal-information stratum. True mixture,
  response coefficients, future drift, and event label are hidden. Each arm
  has 64 KiB state, at most 64 calibration requests, the same sampling cap, and
  identical event-bus capacity.
- **Frozen arms:** A polls every $\{10,50,100,500\}$ ms and applies a scalar
  threshold. B is a calibrated nonlinear state-space sensor with an extended
  Kalman filter or 256/512-particle filter selected on development, CUSUM
  change detector, and tagged event bus. C uses a boundary transfer model with
  sparse event threshold, drift sentinel, and regenerative neighbor-to-neighbor
  wave with time-to-live $\{4,8,16\}$ hops and refractory interval
  $\{10,50,200\}$ ms. B receives any feature computed from raw samples by C.
- **Ablations:** boundary model replaced by scalar threshold; wave replaced by
  polling; drift sentinel disabled; route identity shuffled; refractory period
  disabled; and calibration made free as a prohibited diagnostic.
- **Primary loss:**
  $L=35e_{miss}+25e_{false}+20t_{detect}+10e_{wrong-type}+10e_{route}$ after
  B-scale normalization. Detection latency is seconds; errors are rates.
- **Primary resource:** polling plus front-end inference operations [op].
  Sample count, calibration calls, transmitted bytes, retries, wave events,
  state bytes, false-action CU, and replacement/reset operations are protected.
- **Interventions:** single analyte; interferent mixtures; gradual and abrupt
  drift; saturation; site-local and route outages; two simultaneous sources;
  and forged wave replay. Boundary and wave ablations must selectively affect
  detection and propagation endpoints.
- **Hostile transfer:** interferent amplitudes double, a previously weak
  interferent gains response coefficient equal to target, drift becomes
  piecewise abrupt, 25% of routes fail, and event sources overlap within 20 ms.
  Unsupported mixtures must trigger charged abstention/calibration rather than
  confident action.
- **Absolute gates:** false-event rate $\le0.01$, severe-event miss
  $\le0.02$, wrong-type action $=0$, p99 delivery deadline met on at least 0.98
  of supported events, calibration cap respected, and queue/mixture ledgers
  close.
- **Challenge/no-result rule:** target and at least one interferent must have
  overlapping raw-response distributions with evaluator AUROC between 0.65
  and 0.90 under a scalar threshold. Easier or impossible packs are
  `INCONCLUSIVE`, not evidence for or against the composition.
- **Artifacts:** mixture/response hidden manifest; raw samples; calibration
  calls; coefficient posteriors; detector/wave/route timeline; packet bytes;
  false/missed/replayed events; drift diagnostics; and paired outcomes.

### PLM-T10: Coupled light-temperature history sensor

- **Claim tested:** proposed C-1525.
- **Scientific question:** can a compact coupled dynamical state retain
  task-relevant light, temperature, and elapsed-history information with less
  state or sensing cost than mature independent-sensor/state-space nulls, and
  does it expose non-identifiability outside calibration support?
- **DGP:** one seed contains 1,024 episodes of 12 h simulated nights at 60 s
  steps plus 256 daytime episodes. Light $L_t\in[0,1]$ follows pulses and
  ramps; temperature $T_t\in[278,308]$ K follows independent and correlated
  trajectories. Hidden active state follows
  $\dot p=k_{on}(L)(1-p)-k_{off}(T)p$ with
  $k_{off}(T)=k_0\exp[-E/(R_gT)]$. The task predicts a four-level action based
  on terminal $p$, current $T$, and cumulative warm exposure. Sensor noise,
  calibration drift, and missing blocks are sampled per seed.
- **Observations and hidden state:** the primary stratum gives A/B/C identical
  raw observations, timing, calibration prefix, state cap, and sample budget.
  True $L,T,p,k_0,E$, future history, and episode/transfer identity remain
  evaluator-only. The separately reported sensor-co-design stratum changes
  front ends only under the charged boundary below and cannot replace the
  equal-information result.
- **Primary equal-information stratum:** A/B/C receive the same two raw scalar
  observations per minute: noisy coupled state $y_p$ and a calibration
  reference $y_r$ that contains no direct evaluator $L$ or $T$. Hidden
  $L,T,p,k_0,E$, future history, and episode type are evaluator-only. Every arm
  has 8 KiB state and identical sample timing.
- **Secondary sensor-co-design stratum:** B may instead sample independent
  noisy $L$ and $T$ sensors; C samples $y_p$ plus $y_r$. Both receive two
  scalars/min, but sensor calibration operations, payload bytes, model state,
  and front-end synthetic CU are charged. This stratum is descriptive unless
  C also passes the primary equal-information stratum.
- **Frozen arms:** A thresholds current $y_p$ without history. B is the better
  of an unscented Kalman filter, 256/512-particle nonlinear state-space model,
  and 1-layer GRU hidden size 4/8/16, all using the same primary observations.
  C uses the explicit coupled two-rate state with quantized parameter posterior,
  history state $p$, and support detector based on normalized innovation
  squared threshold $\{4,9,16\}$; $k_0,E$ use an 8x8 development grid and
  online updates stop after the calibration prefix.
- **Ablations:** history state reset each minute; temperature dependence fixed;
  light dependence fixed; support detector disabled; coupled observation
  shuffled across episodes; and independent sensors supplied without their
  cost as a prohibited diagnostic.
- **Primary loss:**
  $L=35e_{action}+25\mathrm{NLL}_{p}+20e_T+10\mathrm{ECE}+10e_{unsupported}$
  after B-scale normalization. $e_T$ is terminal temperature RMSE [K] and all
  raw estimates/intervals are retained.
- **Primary resource:** persistent state plus model bytes [B]. Sample bytes,
  calibration operations, inference operations, sensor-front-end CU in the
  secondary stratum, latency, and abstention are protected.
- **Interventions:** factorial independent light and temperature; perfectly
  correlated trajectories; short and long pulses; night versus day; missing
  blocks; reversion-rate sweep; and calibration drift. Removing history must
  selectively worsen long-pulse/elapsed-time tasks, while shuffled coupling
  removes task information.
- **Hostile transfer:** $k_0$ doubles, activation energy changes by 20%,
  daytime observations dominate, calibration reference drifts monotonically,
  and light/temperature correlation reverses. Frozen support detection may
  abstain, with retained task and latency cost.
- **Absolute gates:** action error $\le0.08$, ECE $\le0.05$, 90% interval
  coverage in [0.87,0.93], unsupported confident-action rate $=0$, state/sample
  cap respected, and primary equal-information loss no worse than B under the
  registered selected route.
- **Challenge/no-result rule:** evaluator Fisher-information matrix for
  $(L,T)$ from primary observations must have condition number between 10 and
  $10^6$ on at least half the confirmation episodes. Below 10 the task is
  nearly separable; above $10^6$ it is practically unidentified. Either case
  makes a mechanism comparison `INCONCLUSIVE` unless support abstention itself
  is the preregistered endpoint.
- **Artifacts:** environmental and sensor hidden manifest; raw observation
  streams; parameter/state posteriors; innovations/support decisions;
  predictions/intervals; sample/state/calibration ledgers; sensor-co-design
  secondary records; ablations; and paired outcomes.

## Cross-track hostile-transfer matrix

| Track | Frozen support | Hostile transfer | Required exposure |
| --- | --- | --- | --- |
| PLM-T01 | short interruptions, independent noise | long interruptions, burst noise, shifted threshold | all duration/noise cells retained |
| PLM-T02 | non-negative lifecycle correlation | negative correlation, duplicated/delayed boundaries | high/low/negative blocks |
| PLM-T03 | bounded recurrence and mostly stable labels | long delay, label inversion, closer distractors | delay and inversion bins |
| PLM-T04 | worker-heavy and mixed failures | renewal-targeted correlated failure | worker and renewal loss |
| PLM-T05 | four known hazards | delayed/forged type, unseen fifth hazard | disagreement and mixtures |
| PLM-T06 | stable route preference | permuted route semantics, common-mode outage | route/payload conflict |
| PLM-T07 | persistent/slow patches | fast/transient patches, false air gaps | probe-value and reversal cells |
| PLM-T08 | persistent correlated demand/resource | rapid reversal and negative correlation | positive/non-positive blocks |
| PLM-T09 | calibrated mixtures and gradual drift | new interferent, abrupt drift, route loss | overlap/drift/source cells |
| PLM-T10 | calibrated night dynamics | altered reversion, day dominance, reversed correlation | factorial and support cells |

Every listed transfer is mandatory. Averages across easier cells cannot erase
failure in the named hostile cell. Track artifacts must report cell-level
outcomes and simultaneous uncertainty.

## Frozen policy and manifest closure

Before confirmation reveal, implementation must freeze and hash:

1. `fixture-023.schema.json`, defining every manifest, observation, action,
   state, failure, resource, and result field with unit and nullability;
2. `fixture-023.config.json`, containing all finite grids, development-selected
   settings, scales, effect route, margins, compute caps, and software hashes;
3. `fixture-023.seeds.json`, containing public seeds and registrar commitments,
   never private values before reveal;
4. `fixture-023.policies.json`, serializing every A/B/C feature, initialization,
   state transition, model/solver, action, fallback, abstention, tie, and
   stopping rule;
5. `reference-workstation.json`, with the prospective timing boundary from the
   common contract;
6. an audit-to-fixture source map that records C-1516--C-1525 and
   PLM-T01--PLM-T10 one to one; and
7. shakedown records that demonstrate deterministic replay, unit closure,
   hidden-field denial, finite failure loss, and resource accounting without
   using sealed seeds.

An omitted policy branch, field unit, resource axis, or fallback is not filled
by implementer judgment after freeze. It is a specification defect requiring a
new version.

## Required result schema

A future result bundle must contain, per track, phase, seed, arm, and ablation:

1. world/config/policy/workstation/code hashes;
2. raw protected task and resource outcomes in native units;
3. finite scalar loss and primary resource;
4. state, observation, message, operation, write/reset, construction,
   maintenance, reserve, CPU, wall, memory, I/O, and artifact ledgers;
5. failure, fallback, abstention, support, calibration, closure, and leakage
   diagnostics;
6. paired seed contrasts, bootstrap statistics, raw and adjusted values,
   simultaneous bounds, effect route, and sensitivity diagnostic;
7. mandatory intervention and hostile-transfer cell results; and
8. exactly one terminal state with machine-readable reason codes.

Human-readable prose is generated only from this bundle. It may not replace
or repair it.

## Track-level terminal-state rules

1. **PASS:** confirmation selected-route contrast, protected gates, component
   ablations, and hostile transfer all pass; every hash, unit, closure,
   information, budget, and artifact check is valid.
2. **FAIL:** computation is valid and sufficiently sensitive, but C misses the
   selected effect, protected endpoint, ablation, or transfer gate; a mature B
   match is a legitimate failure and desired kill result.
3. **INCONCLUSIVE:** computation is valid but the frozen sensitivity diagnostic
   is inadequate or the track-specific challenge floor is unmet. It cannot be
   described as parity, safety, or evidence of no effect.
4. **INVALID:** private-seed handling, hidden-field isolation, deterministic
   replay, units, closure, numerical integrity, compute caps, policy closure,
   artifacts, or registered denominators fail. It cannot be described as a
   negative result.

If implementation never occurs, the durable disposition is `preimplementation
-- no result`, not `INCONCLUSIVE`.

## Implementation and artifact boundary

This specification intentionally creates no runner, package dependency,
generated fixture data, benchmark result, workstation manifest, plot, PDF,
central claim entry, bibliography entry, routing update, or site content. A
future implementation is a separate reviewed change and must not alter this
contract while using the same version identifier.

The first implementation milestone is deterministic development-only
shakedown for all ten tracks. It is not authorization to reveal confirmation
seeds, report an effect, run a biological experiment, or claim workstation
energy. Registrar reveal and full execution require a separately reviewed
freeze showing that equal information, state, reserve, communication,
construction, and resource accounting are mechanically enforced.

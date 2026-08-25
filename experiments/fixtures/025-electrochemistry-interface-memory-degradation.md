# Fixture F-025 — Electrochemistry: interfaces, memory, and degradation

<!-- markdownlint-disable MD013 -->

- **Status:** complete preimplementation CPU-only experiment contract
- **Direct claim proposals:**
  [C-1530](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1530)--[C-1539](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1539)
- **Source audit:** [electrochemistry: interfaces, memory, and degradation](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md)
- **Audit snapshot:** SHA-256 `30A513FCC222F8A9EBAF0F39C24B8787FF8AA2CBA93C2D2DE2E46FD00A11D6CB`
- **Fixture ID:** `F-025`
- **Protocol IDs:** `ECM-T01`--`ECM-T10`
- **Execution state:** no runner, sealed-seed manifest, generated data,
  reference-workstation manifest, execution artifact, or result exists
- **Physical boundary:** no cell, battery, electrolyte, chemical, potentiostat,
  electrodeposition, laboratory procedure, safety claim, or conformity claim
- **Registry disposition:** no new P-series principle, architecture candidate,
  physical-energy result, or claimed efficiency effect

F-025 is the reciprocal falsification contract for ten electrochemistry claim
proposals. It tests artificial translations and measurement boundaries with
synthetic equations and arrays. The scientific sources define what motivated a
track; they do not validate the translated algorithm. Every physical symbol,
synthetic task variable, byte, probe, operation, construction cost, maintenance
cost, and delayed damage value is retained separately.

| Protocol | Claim | Registered question |
| --- | --- | --- |
| ECM-T01 | [C-1530](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1530) | Interface kinetics versus transport and command |
| ECM-T02 | [C-1531](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1531) | Finite-boundary diffusion memory |
| ECM-T03 | [C-1532](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1532) | Impedance validity before interpretation |
| ECM-T04 | [C-1533](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1533) | Regularised time-distribution resolution |
| ECM-T05 | [C-1534](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1534) | Rate-dependent phase regime |
| ECM-T06 | [C-1535](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1535) | Passivation with inventory and resistance |
| ECM-T07 | [C-1536](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1536) | Depletion before ramified growth |
| ECM-T08 | [C-1537](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1537) | Identifiability-aware excitation |
| ECM-T09 | [C-1538](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1538) | Path-dependent apparent equilibria |
| ECM-T10 | [C-1539](../../research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md#c-1539) | Delayed-degradation-aware policy search |

## Question and hypotheses

Each track asks whether a bounded translation of an electrochemical mechanism
or evidence boundary improves a declared task or resource endpoint after a
mature null receives the same information, state, tuning, probes, actions,
construction, maintenance, failure treatment, and compute envelope.
Directional hypotheses are falsification targets. Parity, attractive plots,
successful code, and reproduction of the generator do not constitute a new
mechanism or efficiency result.

## Systems, scenarios, and tasks

Each protocol defines its own data-generating process (DGP), hidden state,
observation operator, action set, intervention, development support,
confirmation support, hostile transfer, terminal loss, and artifact schema.
Electrochemical-looking units are used only where the DGP declares them. AI
task units and synthetic cost units never inherit physical meaning.

## Arms, baselines, and strongest nulls

Every track contains four roles:

1. **A — collapsed analogy:** the tempting but underqualified electrochemical
   metaphor or scalar rule.
2. **B — mature null:** the strongest named nonlinear state estimator,
   vector-fitting/state-space model, validity/change-point test, regularised
   inverse method, hybrid controller, lifecycle controller, robust resource
   controller, optimal experiment design, recurrent hysteresis model, or safe
   Bayesian optimiser.
3. **C — bounded translation:** the proposed mechanism with every special
   state, probe, validity gate, kernel, distribution, structural transition,
   protective layer, depletion sensor, excitation, path state, reserve trial,
   and delayed validation charged.
4. **O — evaluator-only oracle:** exact hidden state and counterfactual outcome
   used for scoring, support, and leakage audits. O is not deployable and never
   supplies an action or feature to A/B/C.

If B implements the same effective transition or certificate as C more simply
or cheaply, the protocol fails. Failure of A supplies no novelty credit.

## Matched budgets and equal information

1. A/B/C receive byte-identical initial observations and the same acquisition
   menu. Thereafter, each arm receives only the canonical bytes and timestamps
   produced by its own logged acquisition actions. Interfacial concentration,
   true boundary type, valid/invalid label, latent peak distribution, phase
   field, layer thickness, local carrier field, true parameter vector,
   Preisach relays, ageing mechanism, transfer flag, and private seed are
   evaluator-only unless a protocol exposes the same noisy sensor through the
   common acquisition menu.
2. All arms receive the same maximum action and acquisition authority,
   deadline, sensor locations, perturbation limits, reserve-trial ceiling, and
   safety envelope. Actual observation times, probe locations, probe counts,
   excitation waveforms, and reserve allocations may differ only as explicit
   arm actions; their complete realized schedules and costs are primary
   measurements. A model cannot get a free concentration sensor, phase label,
   mechanism label, path bit, temperature forecast, or damage endpoint.
3. Persistent/transient state, parameters, RNG state, histories, kernels,
   circuit graphs, regularisation paths, route tables, solver checkpoints,
   calibration, rollback, and metadata count in bytes.
4. Communication counts payload, type, timestamp, checksum, retry,
   acknowledgement, and headers. Shared-memory transfer counts unless the same
   address-space boundary is frozen for every arm.
5. Probing, excitation, acquisition bandwidth, validation sweeps, reserve
   experiments, construction, idle capacity, protection, repair, replacement,
   reset, abstention, and delayed confirmation are charged. No layer, sensor,
   or long-horizon evaluation is free.
6. Physical current and voltage never become compute or energy credit.
   Workstation electricity is `not measured`.

## Ablations and interventions

Every C arm must run every component ablation registered for its track under
the same seed, realized input, acquisition authority, tuning envelope, and
resource accounting as intact C. An ablation removes or replaces exactly the
named mechanism; it may not silently retune the data generator, expose an
oracle field, enlarge a budget, or substitute a different intervention. The
track specification and frozen DGP registry define the exact intervention
cells and ablation algorithms. Missing cells, altered support, or an ablation
that does not actually remove the registered component makes the track
`INVALID`; a component whose removal is harmless blocks the corresponding
mechanistic promotion gate.

## Statistical analysis plan

The normative tuning, scalarization, inference, multiplicity, interval, and
failure rules are frozen in [Tuning, scalarization, and inference](#tuning-scalarization-and-inference)
and in each `ECM-T01`--`ECM-T10` terminal specification. Analysis uses the
registered seed-paired C-minus-B contrasts, retains every attempted seed in its
declared denominator, reports raw endpoints before scalarization, applies the
registered simultaneous uncertainty procedure, and runs the declared hostile
transfer and sensitivity gates. No post-hoc endpoint, seed removal, alternate
tail, unregistered stopping rule, or favorable ablation subset may replace the
frozen analysis. Numerical, leakage, integrity, and support failures keep their
registered punitive or `INVALID` semantics rather than disappearing from the
analysis set.

## Measurements and units

The audit's symbol and unit firewall controls. Track loss
$L_{k,s,a}\in[0,100]$ is dimensionless. Raw voltage [V], current [A], current
density [A m$^{-2}$], impedance [$\Omega$], frequency [Hz], time [s], length
[m], diffusion coefficient [m$^2$ s$^{-1}$], concentration [mol m$^{-3}$],
charge [C], and temperature [K] are retained before normalization. Synthetic
damage [DU], cost [CU], messages [message], bytes [B], operations [op], probes
[probe], full-horizon evaluations [evaluation], CPU time [s], wall time [s],
I/O [B], and artifact size [B] remain separate.

## Promotion, rejection, and no-result authority

A track can report only `PASS`, `FAIL`, `INCONCLUSIVE`, or `INVALID`.

- `PASS` requires the frozen C-versus-B route, protected gates, component
  ablations, hostile transfer, accounting closure, and protocol integrity.
- `FAIL` is a valid informative run missing any required gate, including parity
  with a mature null.
- `INCONCLUSIVE` is limited to a frozen sensitivity or challenge failure.
- `INVALID` means leakage, generator, unit, numerical, seed, artifact, or
  protocol integrity failure.

This file contains no results. Code existence, unit tests, a shakedown, public
development output, a fitted curve, or a source-supported biological/physical
claim is not an F-025 result. A later synthetic pass would not establish
physical performance, battery safety, measured energy saving, legal
compliance, or architectural novelty outside the named DGP.

## Common CPU-only falsification contract

### Runtime, determinism, and seed grammar

1. Implement in TypeScript/JavaScript under the repository-pinned Node.js
   runtime. Use binary64 reference arithmetic, PCG64-DXSM, canonical
   little-endian serialization, SHA-256 manifests, no run-time network, and
   stable-hash tie breaking.
2. A SHA-256 seed digest supplies a 128-bit PCG state from bytes 0--15 and an
   odd stream increment from bytes 16--31. Uniform binary64 draws use the top
   53 bits divided by $2^{53}$. Bounded integers use rejection sampling.
   Gaussian draws use two open-unit uniforms and the cosine Box--Muller
   variate, discarding the sine mate.
3. Public integer seeds are unsigned 64-bit little-endian bytes. Private seed
   reveals are exactly 32 registrar bytes. A stochastic stream digest is
   SHA-256 over the UTF-8 string
   F025-v1|phase|protocol|seed-hex|scope|canonical-id, where seed-hex is the
   uppercase byte-order-preserving hex encoding, scope is one of dgp,
   observation, arm-init, action-outcome, or analysis, and IDs use ASCII
   decimal integers without padding. This prevents arm-dependent calls from
   shifting DGP or observation randomness.
4. Each registry track declares drawOrder. Within a named draw, iterate
   ascending world, episode, entity, frequency, space, and time index.
   Action-dependent draws use a fresh action-outcome stream keyed by
   (arm,world,action-type,action-index) and never consume a shared sequential
   stream. Parallel reductions sort canonical IDs before binary64 summation.
   Unless dependence is stated, draws are independent. Closed real ranges are
   uniform; closed integer ranges are inclusive discrete uniform.

### Seed packs and freeze

1. Track $k\in\{1,\ldots,10\}$ uses public development seeds
   `1530000 + 10000*k + r`, with $r=1,\ldots,64$.
2. An independent registrar creates 128 private confirmation seeds and 64
   disjoint private transfer seeds per track, publishing SHA-256 commitments
   before implementation freeze. Private seeds have no public derivation.
3. Code, runtime, DGP, numerical tolerances, candidate grids, model bytes,
   observation schemas, scales, selected route, result schema, and artifact
   hashes freeze before confirmation reveal. No post-reveal repair is allowed.
4. One seed is one inference cluster. Frequencies, episodes, timesteps,
   particles, cells, relays, policies, probes, and paths inside a seed are
   repeated observations, not independent replicates.

### Numerical references and failures

1. O uses at least twice the spatial/mode/time resolution of scored arms where
   a discretized field is present. Richardson or modal-tail estimates are
   recorded. Analytic limit cells must agree within relative $10^{-6}$ and
   absolute $10^{-9}$ in the native unit.
2. Conservation of charge-like state, mass-like concentration, population
   fraction, inventory, bytes, messages, construction, maintenance, reserve,
   and damage closes to relative $10^{-8}$ and absolute $10^{-10}$.
3. A rejection sampler stops after 10,000 attempts. Solvers and optimizers use
   track caps. NaN/Inf, divergence, timeout, nonclosure, hash mismatch, missing
   artifact, or constraint breach remains in the denominator with $L=100$ and
   maximum finite resource charge for that arm.
4. More than 5% generator or oracle numerical failures in confirmation makes
   the track `INVALID`. Arm-specific numerical failure is retained as a
   performance failure and cannot be deleted or called abstention.

### Tuning, scalarization, and inference

1. Each arm gets the same 64 development seeds and a ceiling of 256 complete
   configurations per track. The frozen registry below declares the actual
   number of distinct configurations for A/B/C. A configuration is never
   repeated merely to consume unused authority. Record `candidate_count`,
   `evaluated_count`, `unused_count = 256 - evaluated_count`, per-candidate
   seed counts, operations, CPU time, failures, and bytes. B and C have the
   same candidate count within a track; A may expose fewer legitimate
   configurations, with the difference retained as unused search authority.
   If a registry contains at least 16 candidates, successive halving evaluates
   every candidate on seeds 1--16, the best ceiling-quarter on seeds 17--32,
   and the best ceiling-quarter of those survivors on seeds 33--64. Each
   candidate--seed pair is evaluated at most once. Exact ties use rule 2.
   At every rung, candidates satisfying all development absolute gates rank
   by arithmetic mean track loss over all cumulative seeds completed through
   that rung (1--16, then 1--32, then 1--64). Candidates missing a gate follow in
   ascending number of missed gates, then mean loss. This is the only halving
   score.
2. Exact development ties choose lower persistent bytes, then fewer operations,
   then lexicographically smaller serialization. No unlisted fallback,
   architecture, feature, optimizer, circuit, penalty, or threshold is legal.
3. Raw task error, calibration, false action, missed action, abstention,
   constraint exposure, latency, state, messages, probes, operations,
   construction, maintenance, reserve, CPU, wall, RSS, I/O, artifact bytes,
   numerical failures, and track-specific outcomes are recorded before loss.
4. Every positive normalization scale is the 90th percentile of B's named raw
   development metric, floored at $10^{-12}$ in its native unit. Specifically,
   before any halving decision, pool that metric over all 64 B candidates and
   development seeds 1--16, retain every finite seed-level value, and take the
   type-7 0.90 quantile; if none is finite, use $10^{-12}$. This fixed
   per-track scale is then used by A/B/C at every rung, confirmation, transfer,
   and ablation. Failed worlds retain raw failure fields and loss 100 but do
   not define a native-unit scale. No winsorization. Loss is capped at 100 only
   after raw retention.
5. Development freezes one route. The **loss route** is eligible if C mean loss
   is at least 10% below B and every protected resource ratio is at most 1.05.
   The **resource route** is eligible if the track's primary C resource is at
   least 15% below B, C mean loss is within one loss point of B, and every
   protected gate holds. If both qualify, choose the larger fractional excess;
   an exact tie chooses loss. If neither qualifies, freeze loss with a
   `development-ineligible` flag that prevents `PASS`.
6. Confirmation contrasts are

   $$
   D^L_s=L_{s,C}-0.90L_{s,B},
   \qquad
   D^R_s=R_{s,C}-0.85R_{s,B},
   \qquad
   D^{NI}_s=L_{s,C}-L_{s,B}-1.
   $$

   Transfer uses 0.95 for loss, 0.925 for resource, and a 0.5 loss-point
   non-inferiority margin. A zero B resource supplies no fractional credit.
7. The seed-level estimand is the arithmetic mean of the frozen world-level
   losses inside seed $s$; a rate first pools its numerator and denominator
   inside that seed. The suite estimand is the arithmetic mean over seeds.
   Test $H_0:E[D]\ge0$ versus $H_1:E[D]<0$ on paired seed clusters. With
   $n$ seeds, let $\bar D=n^{-1}\sum_sD_s$, let $s_D$ be the sample standard
   deviation, and let $T_{obs}=\bar D/(s_D/\sqrt n)$. For the null bootstrap,
   centre $e_s=D_s-\bar D$, draw $n$ indices with replacement, and compute
   $T^*=\bar e^*/(s_{e^*}/\sqrt n)$. Zero variance maps a negative, zero, or
   positive numerator to $-\infty$, 0, or $+\infty$. Use exactly 100,000
   joint resamples and the plus-one lower-tail value
   $(1+\#\{T^*\le T_{obs}\})/100001$. The resample stream is PCG64-DXSM
   seeded by SHA-256 of `F025-v1|phase|family|studentized`; the same index
   vector is used for every contrast in that family. A separate ordinary
   paired bootstrap of the uncentred $D_s$ values supplies the one-sided 99%
   upper confidence bound as the type-7 empirical 0.99 quantile of 100,000
   means. Holm controls familywise $\alpha=0.01$ across ten selected-route
   contrasts; resource-route non-inferiority is a second Holm family. A gate
   requires adjusted $p\le0.01$ and upper bound below zero; equality fails.
8. Protected no-worsening gates use paired one-sided 99% bootstrap upper bounds
   with within-track Holm control. Default margin is 0.005 for rates and 0.01
   normalized units. Non-significance is not non-inferiority.
9. C must beat each named component ablation on the raw endpoint that component
   claims to improve, with a paired one-sided 99% upper bound below zero. An
   ablation shares C's frozen tuning and may not retune.
10. Route and candidate selection use development seeds only. Confirmation
    and hostile transfer run the frozen selected artifacts without refitting,
    re-ranking, threshold selection, or hyperparameter selection. The
    development-only sensitivity scale is
    $S_k=\max\{5,\operatorname{median}_s L_{k,s,B}\}$ loss points. For
    $\delta\in\{0,0.02,0.05,0.10\}$ plant an improvement as
    $D^{plant}_s=(D_s-\bar D)-\delta S_k$ into fixed development residual
    vectors, using 20,000 bootstrap resamples for each of 5,000
    independently generated outer vectors. Thus the 5% target is always at
    least 0.25 loss points. Fewer than 80% rejections at the 5% shift makes a
    later valid non-rejection `INCONCLUSIVE`; sensitivity never changes sample
    size, margin, route, or threshold after confirmation reveal.

### Leakage, hostile transfer, and workstation cap

1. Hidden fields, future records, oracle labels, transfer identity, private
   seeds, and counterfactuals are evaluator-only. Undeclared access makes the
   track `INVALID`. Hash, field-access, and mutual-information audits are
   retained.
2. Hostile transfer changes only the written support. C stays frozen, retains
   every absolute integrity gate, and either passes the relaxed transfer route
   or uses only an explicitly authorized abstention with its full cost.
   Transfer cannot rescue failed confirmation.
3. Freeze `reference-workstation.json` before timed development: CPU
   model/stepping/microcode, four assigned physical cores, SMT state, RAM,
   storage/filesystem, OS build, Node binary/version/hash, power plan, and
   repository commit. Run on AC, no network, no GPU, at most four workers,
   8 GiB peak RSS, 2 GiB retained artifacts per track, and 90 s timed wall per
   `(track,seed,arm)`. CPU, wall, I/O, compression, checkpoints, and artifacts
   count. Electricity and carbon remain `not measured`.

## Frozen numerical component library

Only these implementations may be shared across tracks:

1. pivoted QR and SVD with tolerance grid
   $\{10^{-12},10^{-10},10^{-8},10^{-6}\}$ times the largest singular value;
2. nonnegative least squares by Lawson--Hanson with 20,000-iteration cap;
3. Tikhonov penalties $L\in\{I,D_1,D_2\}$ and
   $\lambda\in10^{\{-10,-9,\ldots,2\}}$ selected by development generalized
   cross-validation or frozen discrepancy principle;
4. implicit Euler, Crank--Nicolson, and backward differentiation order 2 with
   declared step grid and residual tolerance $10^{-9}$;
5. bootstrap and Holm routines specified above;
6. constrained particle filtering with systematic resampling at effective
   sample size below 50%; and
7. Gaussian-process regression with Matérn-5/2 kernel, censored likelihood
   where declared, jitter grid $10^{\{-10,-8,-6\}}$, and frozen acquisition
   tie breaking; and
8. radix-2 Cooley--Tukey FFT with bit-reversal order and binary64 butterfly
   summation, plus no-pivot banded LU for strictly diagonally dominant
   pentadiagonal transfer systems.

An arm-specific solver or library outside this list must appear in that
protocol's frozen candidate grid before confirmation.

## Frozen machine-readable DGP registry

This JSON object is normative. The prose below explains the scientific
question and gates but cannot override a registry value. Arrays are enumerated
in the shown order; Cartesian products use the last axis fastest and canonical
JSON lexical tie breaking. Every B/C grid contains 64 distinct candidates,
every A grid contains 16, and unused capacity up to 256 is reported rather
than filled by repeated configurations.

~~~json
{
  "schema": "urn:20watts:f025:dgp:v1",
  "fixture": "F-025",
  "numeric": {
    "float": "IEEE-754-binary64",
    "indexing": "world,episode,entity,frequency,space,time,action,and candidate indices are zero-based; public seed ordinal r is one-based",
    "rng": "PCG64-DXSM",
    "failureLoss": 100,
    "worldAggregation": "world-local raw metrics are averaged within seed; class, event, and rate formulas pool their numerator and denominator within seed before scaling; every track emits one seed-level value per named raw metric",
    "rateAggregation": "pool numerator and denominator within seed, then divide; never average already-computed per-world rates",
    "nrmse": "sqrt(sum((prediction-truth)^2)/max(1e-24,sum((truth-mean(truth))^2)))",
    "intervalScore90": "(upper-lower)+20*(lower-y)*I(y<lower)+20*(y-upper)*I(y>upper)",
    "component": "min(1,raw/max(1e-12,p90_B_development_raw))",
    "drawGrammar": "Uniform[a,b]=a+(b-a)U; logUniform[a,b]=exp(log(a)+U*(log(b)-log(a))); logNormal(mu,s)=exp(mu+sZ); Dirichlet(1) uses -log(U_i) normalized; skewNormal(alpha) uses delta=alpha/sqrt(1+alpha^2) and delta*abs(Z0)+sqrt(1-delta^2)*Z1; stationary AR1 starts sigma*Z0 and continues phi*xPrev+sigma*sqrt(1-phi^2)*Z; truncated and correlated normals use Cholesky then the declared rejection rule and 10,000-attempt cap",
    "balancedCategorical": "repeat labels in written order to the required world count, then apply one seed-specific Fisher-Yates permutation",
    "recordEncoding": "little-endian; 32-byte record header; float64=8 B; uint32=4 B; uint8=1 B; no padding",
    "candidateRule": "axes are named objects; candidates are distinct Cartesian tuples in shown axis order with the last axis fastest",
    "unusedCandidateAuthorityPerTrack": {"A":240,"B":192,"C":192},
    "selection": "development successive halving only; frozen artifact evaluated unchanged in confirmation and transfer"
  },
  "resultRecordSchema": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "urn:20watts:f025:result-record:v1",
    "type": "object",
    "additionalProperties": false,
    "canonicalEncoding": "UTF-8 JSONL, LF terminator, fieldOrder below, shortest round-trip binary64 number spelling, arrays in declared order, object keys otherwise ASCII lexical",
    "fieldOrder": ["fixture","auditSnapshot","protocol","phase","seedCommitment","seedReveal","arm","candidateId","configurationHash","codeHash","runtimeHash","workstationHash","terminalState","verdict","rawMetrics","ledgers","integrity","resultHash"],
    "required": ["fixture","auditSnapshot","protocol","phase","seedCommitment","seedReveal","arm","candidateId","configurationHash","codeHash","runtimeHash","workstationHash","terminalState","verdict","rawMetrics","ledgers","integrity","resultHash"],
    "properties": {
      "fixture": {"type":"string","const":"F-025"},
      "auditSnapshot": {"type":"string","pattern":"^[0-9A-F]{64}$"},
      "protocol": {"type":"string","enum":["ECM-T01","ECM-T02","ECM-T03","ECM-T04","ECM-T05","ECM-T06","ECM-T07","ECM-T08","ECM-T09","ECM-T10"]},
      "phase": {"type":"string","enum":["development","confirmation","transfer","ablation"]},
      "seedCommitment": {"type":"string","pattern":"^[0-9A-F]{64}$"},
      "seedReveal": {"type":["string","null"],"pattern":"^[0-9A-F]{16}$|^[0-9A-F]{64}$","missing":"null before authorized reveal only"},
      "arm": {"type":"string","enum":["A","B","C","O"]},
      "candidateId": {"type":["integer","null"],"minimum":0,"missing":"null for oracle only"},
      "configurationHash": {"type":"string","pattern":"^[0-9A-F]{64}$"},
      "codeHash": {"type":"string","pattern":"^[0-9A-F]{64}$"},
      "runtimeHash": {"type":"string","pattern":"^[0-9A-F]{64}$"},
      "workstationHash": {"type":"string","pattern":"^[0-9A-F]{64}$"},
      "terminalState": {"type":"string","enum":["NO_RESULT","RECORDED","NUMERICAL_FAILURE","TIMEOUT","CONSTRAINT_FAILURE","INVALID_ARTIFACT"]},
      "verdict": {"type":["string","null"],"enum":["PASS","FAIL","INCONCLUSIVE","INVALID",null],"missing":"null until track-level analysis"},
      "rawMetrics": {"type":"array","order":"ascending metric name","items":{"type":"object","additionalProperties":false,"required":["name","value","unit","numerator","denominator","missingReason","finite"],"properties":{"name":{"type":"string","minLength":1},"value":{"type":["number","null"]},"unit":{"type":"string","minLength":1},"numerator":{"type":["number","null"]},"denominator":{"type":["number","null"]},"missingReason":{"type":["string","null"],"enum":["not-applicable","event-before-landmark","solver-failure","not-acquired",null]},"finite":{"type":"boolean"}}}},
      "ledgers": {"type":"object","additionalProperties":false,"required":["state_B","messages","message_B","probes","samples","fits","actions","evaluationsEarly","evaluationsFull","operations","cpu_s","wall_s","rssPeak_B","io_B","artifact_B","construction_CU","maintenance_CU","reserveEvaluations","damage_DU","failures","abstentions"],"patternProperties":{"^(state_B|messages|message_B|probes|samples|fits|actions|evaluationsEarly|evaluationsFull|operations|cpu_s|wall_s|rssPeak_B|io_B|artifact_B|construction_CU|maintenance_CU|reserveEvaluations|damage_DU|failures|abstentions)$":{"type":"number","minimum":0}}},
      "integrity": {"type":"object","additionalProperties":false,"required":["observationAccessHash","solverResidualMax","closureResidualMax","physicalEnergyMeasured","physicalCellExperiment","legalConformityEvidence","architectureNoveltyEstablished"],"properties":{"observationAccessHash":{"type":"string","pattern":"^[0-9A-F]{64}$"},"solverResidualMax":{"type":"number","minimum":0},"closureResidualMax":{"type":"number","minimum":0},"physicalEnergyMeasured":{"const":false},"physicalCellExperiment":{"const":false},"legalConformityEvidence":{"const":false},"architectureNoveltyEstablished":{"const":false}}},
      "resultHash": {"type":"string","pattern":"^[0-9A-F]{64}$","definition":"SHA-256 of canonical record with resultHash omitted"}
    }
  },
  "algorithmRules": {
    "auxiliaryTraining": "Every track has 32 public non-inference auxiliary seeds. Seed bytes are SHA-256 UTF-8(F025-v1|protocol|aux|r), r=1..32. They use development support and expose only the same observations plus end-of-episode registered targets, never hidden state. Every candidate trains once on the same auxiliary pack; its operations, CPU, bytes, and failures count. Development seeds are evaluation-only except explicitly registered within-instance system identification or online state update.",
    "ridgeQR": "Standardize each feature with auxiliary-pack mean and population sd floored at 1e-12; prepend intercept; solve weighted ridge by pivoted QR, never penalizing intercept.",
    "boundedCoordinateSearch": "Draw 32 initial vectors independently log-uniform over each positive bound from arm-init streams and choose lowest objective, ties serialized vector. Run 200 sweeps in ascending parameter name: sweeps 1..50 use factor 2, 51..100 factor 1.25, 101..150 factor 1.05, 151..200 factor 1.01; test current/factor,current,current*factor clipped to bounds and keep lowest objective, ties lower value.",
    "adam": "Binary64 Adam, beta1=0.9, beta2=0.999, epsilon=1e-8, learning rate=1e-3, gradient-norm clip=1, 200 epochs, canonical batches of 64 without shuffle, no early stopping; initialize weight Normal(0,1/sqrt(fanIn)) and bias 0 from arm-init stream; minimize declared squared/negative-log-likelihood loss plus candidate ridge.",
    "neuralODE4": "Four latent states; vector field Dense(4+inputWidth,16,tanh)-Dense(16,4,linear); RK4 at observation step; linear observation head; train by adam on one-step prediction and roll out without teacher forcing after the first sample.",
    "gru": "One standard reset/update GRU layer of declared width, tanh candidate, sigmoid gates, followed by linear mean and log-scale heads; teacher forcing only on auxiliary input/output pairs; train by adam Gaussian NLL; confirmation receives no true future voltage.",
    "particleFilter": "Bootstrap filter with declared particle count, systematic resampling below ESS 0.5N, Gaussian parameter random walk sd=0.002 of each declared range per step, reflecting parameter boundaries, and observation likelihood from registered noise; posterior means and equal-tail intervals use stable particle index order.",
    "beamMPC": "At every decision expand every legal registered action from each node, propagate the arm model, score expected track raw task loss plus 100 times predicted constraint-breach probability plus declared construction/resource charges, keep the lowest 128 nodes by cost then action serialization, and apply the first action. Horizon is the candidate axis in registered decision steps or seconds.",
    "voi": "For each legal acquisition compute trace(P_before)-trace(P_after) under the arm linearized Gaussian posterior divided by its declared resource charge; choose greatest positive value, ties by canonical action ID, and STOP unless value exceeds the candidate threshold.",
    "vectorFit": "Sanathanan-Koerner iterations with stable real pole pairs initialized log-spaced over the observed band, 50-iteration cap, relative residue change 1e-9, reflect unstable poles into the left half-plane, then solve residues by ridgeQR.",
    "gp": "Matérn-5/2 ARD kernel; log length scales grid [-4,-2,0,2,4], output scale grid [-4,-2,0,2,4], registered jitter grid; exact Cholesky likelihood and lexical grid tie; censored observations use Gaussian survival likelihood and Newton tolerance 1e-9.",
    "boAcquisition": "For minimization with posterior mean mu, sd sigma, incumbent safe mean b, EI=(b-mu)*Phi(z)+sigma*phi(z), z=(b-mu)/sigma with EI=0 at sigma=0; UCB score=-(mu+q*sigma); Thompson draws one joint posterior sample from action-outcome stream and negates it; entropy is 0.5*log(1+sigma^2/noiseVariance). Set score=-infinity when predicted safety probability is below the candidate quantile; choose greatest score, then lexical policy tuple.",
    "normalFunctions": "phi(z)=exp(-z^2/2)/sqrt(2*pi). Phi(z) uses 0.5*erfc(-z/sqrt(2)); erfc uses Numerical Recipes t=1/(1+0.5*abs(x)) and t*exp(-x^2-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277))))))))), reflected as 2-value when x<0.",
    "survivalForest": "128 bootstrap trees; mtry=max(1,floor(sqrt(featureCount))); all midpoint splits with at least 8 rows per child; maximize log-rank statistic, ties feature then threshold; Nelson-Aalen leaf hazard; bootstrap and feature draws use arm-init streams.",
    "serialization": "Model type UTF-8, named hyperparameters in ASCII lexical order, then every binary64 parameter little-endian in declared tensor row-major order; SHA-256 defines configurationHash.",
    "ablation": "Clone the selected frozen C artifact, apply exactly one registered transform, retain all other weights, thresholds, observations, actions, and accounting, and do not retrain."
  },
  "tracks": {
    "ECM-T01": {
      "worldsPerSeed": 384,
      "state": ["cb[mol m-3]", "cs[mol m-3]", "eta[V]"],
      "constants": {"n": 1, "F_C_per_mol": 96485.33212, "Rg_J_per_molK": 8.314462618, "cref_mol_per_m3": 500, "Vs_m3": 1e-9, "Vb_m3": 9e-9},
      "draws": {
        "c0_mol_per_m3": "logUniform[100,1000]",
        "tauD_s": "logUniform[2,80]",
        "j0_A_per_m2": "logUniform[0.2,20]",
        "alphaA": "Uniform[0.35,0.65]",
        "alphaC": "1-alphaA",
        "T_K": "Uniform[283,323]",
        "area_m2": "logUniform[5e-5,2e-4]",
        "Cdl_F": "logUniform[0.01,0.2]",
        "Rs_ohm": "logUniform[0.01,0.5]",
        "targetFamily": "balanced categorical[step,ramp,PRBS]",
        "targetKnots_s": "step dwell 10; ramp duration 20; PRBS bit 5; signed levels balanced over [-0.70,-0.40,0.40,0.70] times one fixed episode magnitude qRef computed from the initial state",
        "pairedConstruction": "for each block ids 4m..4m+3, draw base id 4m with tauD restricted to logUniform[2,40] s and define id 4m+1 with tauDPartner=2*tauD. Linearize the registered three-state ODE at its initial equilibrium, solve (i*2*pi*0.1*I-J)^-1*B for a 0.01 V sinusoid, and compare complex qUseful/Vcmd gain. Find partner j0 by bisection on [0.2,20] A m-2 to relative gain error 1e-8; reject the block if no distinct root."
      },
      "drawOrder": ["c0_mol_per_m3","tauD_s","j0_A_per_m2","alphaA","T_K","area_m2","Cdl_F","Rs_ohm","targetFamily","targetKnots_s","pairedConstruction","terminalNoise","assayNoise"],
      "equations": [
        "E=(Rg*T/(n*F))*ln(max(cs,1e-12)/cref)",
        "jF=j0*sqrt(max(cs,1e-12)/cref)*(exp(alphaA*n*F*eta/(Rg*T))-exp(-alphaC*n*F*eta/(Rg*T)))",
        "deta=(Vcmd-E-eta-Rs*area*jF)/(Rs*Cdl)",
        "dcs=(cb-cs)/tauD-area*jF/(n*F*Vs)",
        "dcb=(Vs/Vb)*(cs-cb)/tauD",
        "I=area*jF+Cdl*deta",
        "qUseful=area*jF/(n*F)"
      ],
      "initial": ["cb=c0", "cs=c0", "eta=0", "Vcmd=(Rg*T/(n*F))*ln(c0/cref), hence I=0"],
      "boundaryConditions": ["not applicable: closed three-state ODE with explicit compartment exchange"],
      "constraints": ["25<=cb,cs<=1475 mol m-3", "abs(jF)<=50 A m-2", "abs(Vcmd)<=0.35 V", "abs(delta Vcmd)<=0.01 V per 0.25 s"],
      "actions": {"cadence_s": 0.25, "voltage": "choose one of 71 grid values -0.35+0.01*k V subject to slew", "assay": "at 2 s boundaries request one optional assay; maximum 24"},
      "solver": {"arm": "implicit Euler first step then BDF2 dt=0.25 s; damped Newton with pivoted QR, residual<=1e-10, max 12 iterations", "oracle": "implicit Euler first step then BDF2 dt=0.125 s, same equations and tolerance", "horizon_s": 300, "eventOrder": ["apply command slew", "implicit state solve", "constraint check", "emit terminal observation", "deliver due assay"]},
      "observations": [
        "each 0.25 s: t,Vcmd,V=E+eta,I,T; independent Gaussian noise sd[V]=0.001 V, sd[I]=max(1e-8,0.002*abs(I)) A; 72 B",
        "scheduled each 10 s: qUseful plus Gaussian sd=max(1e-12,0.01*abs(qUseful)) mol s-1, delivered after 2 s; 48 B",
        "optional assay: identical operator, maximum 24 episode-1; action cadence 2 s; 48 B and 1 probe"
      ],
      "target": "Before t=0 and without advancing state, set qRef to the largest abs(qUseful) among one implicit-Euler 0.25 s trial from the registered initial state over the 71 Vcmd values -0.35+0.01*k, k=0..70, retaining only constraint-safe trials. qTarget then follows targetKnots using this fixed qRef; ramps interpolate linearly. Oracle tests 81 two-segment sequences: V1 and V2 each use the nine values [-0.35,-0.2625,-0.175,-0.0875,0,0.0875,0.175,0.2625,0.35] V for 10 s each, reached through the common slew limit; choose lowest 20 s flux error, then lowest exposure, then lexical pair.",
      "rawMetrics": {
        "e_flux": "NRMSE(qHat,qUseful) on all post-warmup times t>=20 s",
        "e_constraint": "seconds with concentration or jF constraint violated divided by 280 s",
        "e_cal": "mean intervalScore90(qUseful) divided by mean(abs(qUseful))+1e-12 mol s-1",
        "e_probe": "optional probes/24",
        "e_latency": "mean command-to-90%-settled time/300 s"
      },
      "loss": "35*e_flux+25*e_constraint+15*e_cal+15*e_probe+10*e_latency after component scaling",
      "supports": {"development": "draws shown", "confirmation": "same support, private draws", "transfer": "tauD logUniform[80,160] s; j0 multiplied by 0.5 at t=150 s; Rs linear drift to 1.3*Rs"},
      "armAlgorithms": {
        "A": "ridgeQR maps [1,Vcmd,T and the declared history count of lagged terminal V,I] to qUseful on auxiliary assays. history=0 buys no optional assay; history=8 buys eight evenly spaced optional assays at t=30,60,...,240 s. It applies the lowest-slew voltage grid point minimizing one-step squared target error.",
        "B": "PF256/PF512 use particleFilter on latent [q,Vlag,Ilag,bias] with affine transition features [1,q,Vcmd,V,I,T] fitted by ridgeQR; NeuralODE4 uses the shared neuralODE4; HammersteinWiener uses tanh input and output maps around order-4 ridgeQR ARX. Every observer feeds beamMPC and uses fixed VOI threshold 0.01 for optional assays.",
        "C": "particleFilter carries [cb,cs,eta,tauD,j0,alphaA,Cdl,Rs] under the registered equations, uniform/log-uniform priors equal to generator ranges, and registered terminal/assay likelihoods. It feeds beamMPC and uses candidate probeVarianceThreshold on posterior qUseful coefficient of variation."
      },
      "ablationTransforms": ["collapseTransport:set cs=cb after every update and remove cb state","removeCapacitance:set Cdl=1e-12 F and remove capacitive current","commandAsOverpotential:replace eta by Vcmd in jF only","staticProbes:replace C acquisition schedule by B selected schedule from the paired seed"],
      "tuning": {
        "A": {"count": 16, "axes": [{"name":"model","values":["staticGain","twoGain"]},{"name":"ridge","values":[0,0.05,0.10,0.20]},{"name":"history","values":[0,8]}]},
        "B": {"count": 64, "axes": [{"name":"observer","values":["PF256","PF512","NeuralODE4","HammersteinWiener"]},{"name":"mpcHorizon_s","values":[10,20,40,80]},{"name":"ridge","values":[0.001,0.01,0.1,1]}]},
        "C": {"count": 64, "axes": [{"name":"particles","values":[64,128,256,512]},{"name":"mpcHorizon_s","values":[10,20,40,80]},{"name":"probeVarianceThreshold","values":[0.01,0.025,0.05,0.10]}]}
      }
    },
    "ECM-T02": {
      "worldsPerSeed": 256,
      "state": ["c(z,t)[mol m-3]"],
      "draws": {
        "L_m": "logUniform[1e-6,1e-3]",
        "D_m2_per_s": "logUniform[1e-14,1e-9]",
        "farBoundary": "balanced categorical[absorbing,reflecting,Robin]",
        "Bi_Robin": "logUniform[0.1,10] when Robin",
        "inputFamily": "balanced categorical[2,4,8,16 log-spaced sinusoids plus 4 signed steps]",
        "amplitude_mol_per_m2s": "base U logUniform[1e-9,1e-6]; sinusoid frequencies logspace[1e-2,10]/tauD, each amplitude U/m with independent phase Uniform[0,2*pi); signed steps of amplitude U at times [0.5,2,10,50]*tauD",
        "noise": "Gaussian sd=1e-9+rho*RMS(y), rho logUniform[0.001,0.02]"
      },
      "drawOrder": ["L_m","D_m2_per_s","farBoundary","Bi_Robin","inputFamily","amplitude_mol_per_m2s","noise"],
      "equations": ["dc/dt=D*d2c/dz2", "-D*dc/dz(0,t)=u(t)"],
      "initial": ["c(z,0)=0"],
      "boundaryConditions": ["at z=0: -D*dc/dz(0,t)=u(t)", "absorbing:c(L,t)=0", "reflecting:dc/dz(L,t)=0", "Robin:-D*dc/dz(L,t)=(Bi*D/L)*c(L,t)"],
      "solver": {
        "generator": "256 eigenmodes. With q=k*L, absorbing roots q=(m+0.5)*pi, reflecting roots q=m*pi including the zero mode, and Robin roots q*tan(q)=Bi. Robin roots use bisection in every pole-separated interval to width 1e-12. Step modes update exactly and sinusoid modes use the analytic convolution.",
        "crosscheck": "The 12 sentinels are the Cartesian product of boundaries [absorbing,reflecting,Robin with Bi=1] and (D,L) [(1e-14,1e-6),(1e-12,1e-5),(1e-10,1e-4),(1e-9,1e-3)] in SI units. Use Crank-Nicolson on 512 uniform finite volumes with dt<=min(0.002*tauD,one quarter of the next observation gap); compare only at observation times.",
        "arm": "observations on 512 fixed log times from 1e-3*tauD to 1e2*tauD",
        "eventOrder": ["evaluate registered input", "advance modes", "emit y=c(0,t)+noise"]
      },
      "observations": ["first 128 time samples: t,u,y; 56 B", "remaining 384 timestamps and future u are public; y is target only"],
      "actions": {"passive": true, "menu": [], "budget": 0},
      "target": "forecast all 384 held-out y values and 90% intervals; oracle is the 256-mode noiseless response",
      "rawMetrics": {
        "e_forecast": "NRMSE on held-out 384 y samples",
        "e_low_f": "abs(mean residual on final 64 samples)/max(1e-12,RMS target)",
        "e_step_tail": "For each step, use the first 16 observation samples strictly after its timestamp and before the next step; a sample belongs only to its most recent step. Pool squared errors and target deviations over these windows, then take NRMSE.",
        "e_cal": "abs(empirical 90% coverage-0.90)/0.10 plus mean intervalScore90/RMS target"
      },
      "loss": "45*e_forecast+25*e_low_f+15*e_step_tail+15*e_cal after component scaling",
      "supports": {"development": "shown support; each far boundary exactly one third up to one-world remainder", "confirmation": "same support", "transfer": "sample times 1e-2*tauD through 1e3*tauD; Robin only with Bi logUniform[0.03,0.3]; exactly 2 sparse steps"},
      "armAlgorithms": {
        "A": "Fit AR(arOrder) by ridgeQR to the first 128 samples and add warburgWeight times the discrete semi-infinite t^-1/2 convolution normalized to unit response; recursive 384-step forecast.",
        "B": "vectorFit uses the shared routine; balancedSS fits order-32 stableSS then balanced-truncates by SVD; ARX uses order lags for input and output; stableSS parameterizes real negative diagonal poles log-spaced over training support and solves residues by ridgeQR. Fit only the first 128 samples and propagate over public future input.",
        "C": "For each boundaryFamily, build the declared 4/8/16/32-mode analytic kernel; fit nonnegative modal weights by NNLS. Mixture uses all three families with Dirichlet priorConcentration and evidence exp(-0.5*weightedSSE). Forecast is the evidence-weighted convolution; state is the modal recursion."
      },
      "ablationTransforms": ["semiInfinite:replace every finite kernel by t^-1/2","noBoundarySelector:fix reflecting family","halfSupport:retain first ceiling(modes/2) modes","oneStepMarkov:retain only the fastest fitted pole"],
      "tuning": {
        "A": {"count": 16, "axes": [{"name":"arOrder","values":[1,2,4,8]},{"name":"warburgWeight","values":[0,0.25,0.5,1]}]},
        "B": {"count": 64, "axes": [{"name":"model","values":["vectorFit","balancedSS","ARX","stableSS"]},{"name":"order","values":[2,4,8,16]},{"name":"ridge","values":[1e-6,1e-4,1e-2,1]}]},
        "C": {"count": 64, "axes": [{"name":"boundaryFamily","values":["absorbing","reflecting","Robin","mixture"]},{"name":"modes","values":[4,8,16,32]},{"name":"priorConcentration","values":[0.01,0.1,1,10]}]}
      }
    },
    "ECM-T03": {
      "worldsPerSeed": 512,
      "state": ["no dynamic arm-visible state in the spectrum generator; acquisition ordinal and timestamp are observed metadata"],
      "initial": ["draw one valid base transfer function before applying exactly one registered class transformation"],
      "boundaryConditions": ["not applicable: frequency-domain lumped generator"],
      "frequencies_Hz": "61 logspace points 1e-3 through 1e4 inclusive",
      "classCounts": {"validIdentifying": 192, "validEquivalent": 64, "schemaProvenanceInvalid": 64, "KKInconsistent": 128, "nonlinearOutOfScope": 64},
      "draws": {"circuitOrder": "balanced categorical p in [1,2,3,4]", "R0_Rk_ohm": "logUniform[0.01,100]", "Ck_F": "logUniform[1e-5,10]", "warburgPresent": "Bernoulli(0.5), sigma logUniform[0.001,10] ohm s-1/2", "class": "fixed classCounts followed by seeded permutation", "noise": "proper complex Gaussian as declared in generator"},
      "drawOrder": ["class","circuitOrder","R0_Rk_ohm","Ck_F","warburgPresent","equivalenceSplit","corruptionSeverity","noise"],
      "equations": ["Zlin(omega)=R0+sum_k Rk/(1+i*omega*Rk*Ck)+I(warburg)*sigma/sqrt(i*omega)", "linear-drift and unsettled transformations are applied pointwise in acquisition order", "for cubic worlds and real sinusoid amplitude A: I1=A/Zlin+3*a3*A^3/4, I3=a3*A^3/4, Zobserved=A/I1, harmonicRatio=abs(I3)/abs(I1)"],
      "generator": {
        "valid": "Z=R0+sum_{k=1..p} Rk/(1+i*omega*Rk*Ck)+sigma/sqrt(i*omega), p balanced 1..4; R0,Rk logUniform[0.01,100] ohm; Ck logUniform[1e-5,10] F; sigma logUniform[0.001,10] ohm s-1/2; omit Warburg in half",
        "equivalence": "on the lowest-index RC branch k=1, replace its resistor by two series resistors 0.37*Rk and 0.63*Rk inside the same RC state; graph labels differ but terminal Z is byte-identical",
        "noise": "proper complex Gaussian; independent real/imag sd=rho*max(abs(Z),0.01 ohm)/sqrt(2); rho logUniform[0.0005,0.02]",
        "schemaCorruptions": "Checksum is SHA-256 of the canonical little-endian record excluding the checksum field. The 16 cases each are: swap timestamps at ordinal pairs [10,11] and [40,41]; replace frequency index 30 by frequency 29; unit token mOhm with unchanged numeric payload and failed checksum; calibration-version mismatch where Zobs=G(omega)*Z, G=1+0.05*i*(omega/omegaC)/(1+omega/omegaC), omegaC=1 rad s-1, but the record names the uncorrected version.",
        "KKCorruptions": "64 linear parameter drift Rk(t)=Rk0*(1+delta*s), s=(timestamp-firstTimestamp)/(lastTimestamp-firstTimestamp), delta Uniform[0.05,0.30]; 64 unsettled records use Zobs=R0+(1-exp(-twait/tauS))*(Zlin-R0), tauS logUniform[10,1000] s",
        "nonlinearity": "Use complex linear admittance 1/Zlin at sentinel frequency index 30 and real nonnegative a3. Solve a3 by bisection on [0,1e12] A V-3 until harmonicRatio at A=0.02 V and frequency index 30 equals h, h Uniform[0.01,0.10], relative tolerance 1e-10; reject if unbracketed. The same a3 is then used at every frequency."
      },
      "sweep": "descending frequency; settle max(3/f,1 s), then timestamp; fundamental amplitude A=0.01 V",
      "observations": ["expected 61-frequency schema and authorized holdout indices [4,9,14,19,24,29,34,39,44,49,54,59] are public; the 49 non-held records expose timestamp, ordinal, frequency, complex Z, amplitude, unit token, checksum, calibration version; 93 B each", "the 12 held complex values remain evaluator-only for e_fit"],
      "diagnostics": {
        "menu": "nine public sentinel frequency indices [0,7,15,22,30,38,45,53,60]",
        "bundle": "repeat at A=0.02 V after long wait 5/f; return fundamental complex Z and H3/H1 at both amplitudes",
        "budget": "maximum 9 bundles; 1 probe and 176 B per bundle"
      },
      "actions": {"cadence": "after initial sweep and before decision", "menu": "choose any subset of the nine sentinel bundles", "budget": "9 bundles, no unregistered repeat"},
      "decision": ["record-invalid", "physics-invalid", "nonlinear-out-of-scope", "valid-nonidentifying", "valid-candidate-set"],
      "decisionPrecedence": "record-invalid first, then nonlinear-out-of-scope, then physics-invalid, then valid class. Also emit booleans schemaValid, amplitudeLinear, kkConsistent, identifying. Transfer drift+nonlinearity has primary nonlinear-out-of-scope and kkConsistent=false.",
      "gateOrder": ["schema/provenance check; these cases are never attributed to KK", "amplitude/harmonic check", "linear KK residual check", "equivalence-aware candidate set"],
      "solver": "Boukamp real-linear basis orders [8,12,16,24], weighted QR; threshold quantiles [0.95,0.975,0.99,0.995] calibrated from 4,096 extra valid synthetic spectra under SHA256(F025-v1|T03|power), never scored and identical for all arms; max 20,000 iterations",
      "target": "primary decision, all four diagnostic booleans, and equivalence class; oracle knows corruption and exact graph quotient",
      "rawMetrics": {
        "e_invalid": "one minus exact multi-label recall over schema-invalid, KK-inconsistent, and nonlinear flags; primary class and every applicable boolean must match",
        "e_false_reject": "false invalid/nonlinear decisions divided by all valid records",
        "e_overclaim": "unique-mechanism reports divided by validEquivalent records",
        "e_candidate": "1-equivalence-class candidate-set coverage plus 0.02*max(0,setSize-trueClassSize)",
        "e_fit": "NRMSE of held-frequency complex prediction"
      },
      "loss": "35*e_invalid+20*e_false_reject+25*e_overclaim+10*e_candidate+10*e_fit after component scaling",
      "supports": {"development": "counts and corruption severities shown", "confirmation": "same support", "transfer": "drop first and last frequency decades; combine drift delta[0.02,0.08] with H3/H1[0.005,0.02]; complex AR(1) noise rho[0.2,0.6]"},
      "armAlgorithms": {
        "A": "Circuit selects base elements: R=[R0], RC=[R0 plus parallel RC], RRC=[R0 plus series L and parallel RC], Randles=[R0,parallel RC,Warburg]. maxBranches repeats the parallel-RC branch exactly 1..4 times, so every tuple is distinct. Bounds are R[1e-4,1e4] ohm, C[1e-8,1e3] F, L[1e-9,1e3] H, sigma[1e-6,1e3] ohm s-1/2. Fit weighted complex SSE by boundedCoordinateSearch; choose lowest AIC and always emit one graph label. Buy no sentinel bundles and STOP immediately after the initial sweep.",
        "B": "First fit the declared basisOrder rational basis by weighted QR. changePoint and robustResidual buy no sentinel bundles; heldFrequency buys indices [30,22,38] in that order; vectorFit buys all nine in order [30,22,38,15,45,7,53,0,60]. changePoint applies CUSUM to adjacent normalized complex residuals; heldFrequency withholds observed ordinals divisible by 5, refits, and gates on those internal held points while the 12 evaluator values remain scoring-only; vectorFit uses the shared routine constrained to basisOrder poles and a passivity check; robustResidual uses median/MAD residual threshold. Candidate quantile is calibrated on the public power pack. After its fixed purchase list, the arm STOPs and fits the same circuit library as A.",
        "C": "Validate checksum, unit, ordering, and calibration provenance before any physics test. If valid, buy sentinel bundles in the fixed order [30,22,38,15,45,7,53,0,60]: buy the first three, STOP acquisition and declare nonlinear-out-of-scope if any purchased harmonicRatio exceeds the public 0.995 quantile calibrated from the 4,096 valid power-pack spectra at that frequency; otherwise buy the remaining six and apply the same gate. This deterministic schedule replaces an undefined class posterior. Apply the registered Boukamp basis/kkQuantile only after the amplitude gate; quotient fitted circuit graphs by the exact terminal-equivalence rewrite; emit primary class, four booleans, and the reportPolicy candidate set."
      },
      "ablationTransforms": ["noGate:skip schema,harmonic,KK gates and always fit","uniqueCompliance:replace equivalence quotient by best single graph","noPowerCalibration:use asymptotic chi-square 0.99 threshold","shuffledOrder:sort observations by frequency before every order diagnostic"],
      "tuning": {
        "A": {"count": 16, "axes": [{"name":"circuit","values":["R","RC","RRC","Randles"]},{"name":"maxBranches","values":[1,2,3,4]}]},
        "B": {"count": 64, "axes": [{"name":"diagnostic","values":["changePoint","heldFrequency","vectorFit","robustResidual"]},{"name":"basisOrder","values":[8,12,16,24]},{"name":"quantile","values":[0.95,0.975,0.99,0.995]}]},
        "C": {"count": 64, "axes": [{"name":"kkBasisOrder","values":[8,12,16,24]},{"name":"kkQuantile","values":[0.95,0.975,0.99,0.995]},{"name":"reportPolicy","values":["abstain","set2","set4","all-equivalent"]}]}
      }
    },
    "ECM-T04": {
      "worldsPerSeed": 384,
      "state": ["latent nonnegative g(log10 tau)[ohm per decade] and selected frequency set"],
      "initial": ["draw complete latent peak mixture before noise and acquisition"],
      "boundaryConditions": ["finite-reflecting kernel is zero-flux at the far face; finite-transmissive kernel is zero-concentration at the far face; relaxation kernel has no spatial boundary"],
      "draws": {
        "peakCount": "balanced categorical[1,2,3,4]",
        "centres_log10s": "sorted Uniform[-5,5] with rejection until pair gaps>=0.10 decades",
        "width_decades": "balanced categorical[0.05,0.10,0.20,0.40,0.80]",
        "amplitudes_ohm": "Rpol*Dirichlet(1,...,1), Rpol logUniform[0.1,100]",
        "Rinf_ohm": "logUniform[0.01,10]",
        "kernel": "balanced categorical[relaxation,finite-reflecting,finite-transmissive]",
        "noise": "proper complex Gaussian sd_j=rho*max(abs(Z_j),0.01 ohm)/sqrt(2), rho logUniform[0.0005,0.03]",
        "band": "balanced categorical[3,5,8] decades centred at geometric mean peak frequency"
      },
      "drawOrder": ["peakCount","centres_log10s","width_decades","amplitudes_ohm","Rinf_ohm","kernel","band","noise"],
      "equations": ["g(q)=sum_p a_p*exp(-0.5*((q-mu_p)/w_p)^2)/(sqrt(2*pi)*w_p)", "Z=Rinf+integral g(q)*K(omega,10^q)dq", "Krelax=1/(1+i*omega*tau)", "Kreflect=coth(sqrt(i*omega*tau))/sqrt(i*omega*tau)", "Ktransmit=tanh(sqrt(i*omega*tau))/sqrt(i*omega*tau)"],
      "acquisition": {
        "universe": "161 log10-spaced frequencies over eight decades centred at the geometric mean latent peak frequency",
        "initial": "for drawn band d in [3,5,8], take the 21 distinct universe indices nearest centre-d/2+r*d/20 for r=0..20; ties choose lower index; identical for all arms",
        "publicPool": "the remaining 140 universe frequencies in ascending order",
        "holdout": "80 evaluator-only frequencies at centre-4+(r+0.5)*8/80 log10 Hz for r=0..79",
        "action": "choose one unused frequency per decision",
        "budget": "maximum 24 additions; complex sample plus uncertainty costs 72 B and 1 sample"
      },
      "observations": ["initial and acquired records expose frequency, real Z, imaginary Z, real/imag standard deviations; 72 B each"],
      "actions": {"cadence": "one selection after each completed solve", "menu": "one unused public-pool frequency or STOP", "budget": "24 added frequencies"},
      "resolvability": "For each adjacent pair, compare its noiseless 80-holdout spectrum with the moment-matched merged peak using S=real((z2-z1)^H Sigma^-1 (z2-z1)), with diagonal Sigma from the drawn real/imag noise. Resolvable iff S>=25, centre gap>=2*max(widths), and both mass fractions>=0.05. Unresolvable iff S<=9 or either mass fraction<0.02. Otherwise boundary. Repeatedly merge the leftmost unresolvable pair; recompute moments and S after each merge; boundary pairs require abstention.",
      "solver": {"arm": "256 uniform q nodes [-5,5], trapezoidal quadrature, NNLS/Tikhonov tolerance 1e-10 and 20,000 iterations", "oracle": "2048 nodes", "uncertainty": "128 parametric complex-Gaussian perturbations. Freeze the selected penalty and active set, solve each perturbation by one pivoted-QR restricted refit, and use type-7 5% and 95% quantiles.", "matching": "Hungarian cost abs(delta centre)+0.5*abs(log amplitude ratio); match allowed only within max(0.25 decade,width) and amplitude ratio [0.5,2]"},
      "target": "merged oracle distribution under resolvability rule; false peak penalty 2 decades plus unmatched mass",
      "rawMetrics": {
        "e_forward": "complex NRMSE on 80 evaluator-only frequencies",
        "e_peak_set": "matched earth-mover distance in decades plus 2*falsePeakCount, divided by max(1,truePeakCount)",
        "e_coverage": "abs(centre interval coverage-0.90)/0.10 plus mean intervalScore90 in decades",
        "e_instability": "mean matched-set change under perturbations divided by max(1,targetPeakCount)"
      },
      "loss": "35*e_forward+30*e_peak_set+20*e_coverage+15*e_instability after component scaling",
      "supports": {"development": "shown draws", "confirmation": "same support with at least 64 worlds in each resolvability stratum by rejection-balanced generation", "transfer": "replace each Gaussian by a normalized skew-normal at the same centre and width, shape balanced over [-8,-4,-2,2,4,8]; each spectrum mixes relaxation and one balanced diffusion kernel with relaxation weight Uniform[0.25,0.75]; complex AR(1) coefficient phi Uniform[0.2,0.6] in frequency order with proper-Gaussian innovation sd=sigma*sqrt(1-phi^2); reject until boundary S in [8,12]"},
      "armAlgorithms": {
        "A": "Cubic Savitzky-Golay smooth real and imaginary parts with odd window 2*smoothingWindow+1, compute discrete curvature, and report local maxima above peakThreshold times maximum curvature; no interval. Buy no optional frequencies and STOP after the common 21 samples.",
        "B": "NNLS uses the shared Tikhonov library and buys no additions. LASSO buys the first 8 public-pool entries in ascending pool index. Parametric buys 16 entries whose zero-based pool ranks are round(139*j/15), j=0..15. directPredictor buys the first 24 public-pool entries. Purchases occur one at a time in the listed order and then STOP. LASSO uses nonnegative coordinate descent 20,000 sweeps tolerance 1e-10; parametric uses 1..4 Gaussian peaks and the T03 coordinate search; directPredictor uses ridgeQR from complex samples to the 80 holdout values. penalty is respectively the inverse penalty, coefficient finite-difference penalty, adjacent-peak amplitude penalty, or frequency-coefficient penalty. selection always chooses its weight by the named GCV, discrepancy, nested, or fixed-median rule, so no axis is ignored.",
        "C": "Run the same inverse at inverseGrid nodes and freeze its selected nonnegative active set A; use all grid nodes when A is empty. Stack real and imaginary kernel rows. With W=Sigma^-1 from observed noise, selected regularizer lambda and penalty matrix L, set P=(K_A^T*W*K_A+lambda*L_A^T*L_A+1e-12*I)^-1. For an unused candidate frequency f with stacked row k_f and 2x2 noise covariance Sigma_f, set P_after=P-P*k_f^T*(Sigma_f+k_f*P*k_f^T)^-1*k_f*P and VOI_f=(trace(P)-trace(P_after))/1_sample. Choose greatest VOI_f, ties lower public-pool index; buy it only when VOI_f exceeds voiThreshold, refit and recompute, otherwise STOP, with 24 additions maximum. Compute the registered resolution matrix and perturbation intervals, merge/abstain by resolutionThreshold replacing S thresholds [9,16,25,36]."
      },
      "ablationTransforms": ["noCertificate:report all local maxima without resolution merge","maximumPeaks:force four peaks","fixedLambda:use median development lambda for every world","noActive:STOP after initial 21 frequencies"],
      "tuning": {
        "A": {"count": 16, "axes": [{"name":"smoothingWindow","values":[2,4,8,16]},{"name":"peakThreshold","values":[0.05,0.10,0.20,0.40]}]},
        "B": {"count": 64, "axes": [{"name":"inverse","values":["NNLS","LASSO","parametric","directPredictor"]},{"name":"penalty","values":["I","D1","D2","mixed"]},{"name":"selection","values":["GCV","discrepancy","nested","fixedMedian"]}]},
        "C": {"count": 64, "axes": [{"name":"inverseGrid","values":[64,128,256,512]},{"name":"resolutionThreshold","values":[9,16,25,36]},{"name":"voiThreshold","values":[0.00,0.01,0.025,0.05]}]}
      }
    },
    "ECM-T05": {
      "worldsPerSeed": 96,
      "state": ["x[128,1]", "topology in [unsplit,split]", "allocation p[1]", "transitionTimer[1]"],
      "domain": "xi in [0,ell], periodic finite volumes in development and confirmation",
      "draws": {"a": "logUniform[0.5,2]", "kappa": "logUniform[1e-5,1e-3]", "M": "logUniform[0.1,2]", "ell": "logUniform[0.5,4]", "driveSegment": "r in [0.01,5], logUniform, piecewise constant every 0.05", "coupling": "g Bernoulli(0.5), independently permuted relative to every morphology draw", "demand": "at each 0.05 boundary retain previous vector with probability 0.9, otherwise draw each component Uniform[0,1]"},
      "drawOrder": ["a","kappa","M","ell","initialPerturbation","driveSegment","coupling","demand","structureObservationNoise"],
      "equations": ["f=a*x^2*(1-x)^2", "mu=2*a*x*(1-x)*(1-2*x)-kappa*d2x/dxi2", "dx/dt=M*d2mu/dxi2+r(t)*(1-x)", "q=sum_{Fourier modes 4..32}|X_k|^2/max(1e-12,sum_{modes 1..32}|X_k|^2)"],
      "initial": "x_j=clip(0.45+epsilon_j-mean(epsilon),0.05,0.95), epsilon Gaussian sd=0.01; clipping is permitted only at initialization",
      "boundaryConditions": ["development and confirmation periodic x and mu; transfer boundary is declared in supports"],
      "task": {
        "allocation": "p in [0.25,0.5,0.75]; base service vector=[p,1-p]",
        "unsplit": "capacity=base service vector",
        "split": "capacity=(1+0.4*g*q)*base service vector",
        "outcome": "unmet=sum(max(0,demand-capacity)); idle=sum(max(0,capacity-demand))",
        "transition": "SPLIT starts a 0.02 timer with pending topology split and costs 4 CU; MERGE starts a 0.01 timer with pending topology unsplit and costs 2 CU. Capacity is [0,0] while timer>0. After each scored step decrement by 0.01; if the result is <=0, set the pending topology and clear the timer. HOLD leaves state unchanged. No second topology action is legal during a timer; minimum completed-topology dwell is 0.10; at most 16 transitions."
      },
      "actions": {"allocationCadence": 0.01, "allocationMenu": [0.25,0.5,0.75], "topologyMenu": ["HOLD","SPLIT","MERGE"], "topologyBudget": 16, "minimumDwell": 0.10},
      "solver": {"arm": "128-cell central finite volumes, dx=ell/128. At each dt=5e-4 solve (xNext-x)/dt=M*Laplace(2*a*x*(1-x)*(1-2*x)-kappa*Laplace(xNext))+r*(1-xNext). Periodic development/confirmation diagonalize the linear operator with the frozen radix-2 FFT; transfer uses frozen pentadiagonal LU. Residual<=1e-9; no Newton and no post-step clipping.", "oracle": "same scheme on 256 cells, dx=ell/256, dt=2.5e-4", "closure": "abs(sum(xNext-x)*dx-dt*sum(r*(1-xNext))*dx)<=1e-10", "horizon": 1, "eventOrder": ["advance phase field", "verify source-aware mass residual", "observe q with Gaussian sd 0.01 every 0.01", "choose allocation and optional legal topology action", "score service with zero capacity if timer active", "decrement timer and apply pending topology if it reaches zero"]},
      "observations": ["each 0.01: time,mean(x),r,q+N(0,0.01),demand1,demand2,current topology; 89 B"],
      "morphologyPredicate": "Oracle calls a world separated at time t iff spatial variance(x)>=0.02 and q>=0.25. A rate/size boundary crossing exists iff this predicate differs between two registered drive segments at fixed a,kappa,M,ell, or between paired ell and 2*ell worlds at fixed other parameters. Confirmation generation rejects until at least 30% of worlds cross.",
      "target": "oracle knows full field and g and minimizes unmet+0.2*idle+construction+unavailable time by exhaustive 3-allocation dynamic programming",
      "rawMetrics": {
        "e_task": "(arm task cost-oracle task cost)/max(1,oracle task cost)",
        "e_wrong_structure": "(unsupported split time+missed beneficial split time)/horizon using oracle action",
        "c_churn": "(4*splitCount+2*mergeCount) CU",
        "e_recovery": "seconds from each demand change until 3 consecutive scored samples are within 10% of oracle task cost; if absent before the next demand change or horizon, use the remaining segment duration; sum divided by horizon",
        "e_cal": "abs(beneficial-split probability coverage-0.90)/0.10 plus Brier score"
      },
      "loss": "35*e_task+25*e_wrong_structure+20*c_churn+10*e_recovery+10*e_cal after component scaling",
      "supports": {"development": "in world blocks ids 4m and 4m+1, draw base ell logUniform[0.5,2] and set partner ell=2*base; remaining worlds use shown full ell support", "confirmation": "same paired support and morphologyPredicate challenge balance", "transfer": "f becomes a*x^2*(1-x)^2+0.2*x^3; replace periodic boundary by dmu/dxi=0 at both ends and kappa*dx/dxi=0.1 at xi=0, -0.1 at xi=ell; coupling g independently redrawn every 0.25"},
      "armAlgorithms": {
        "A": "At an observation, SPLIT iff q exceeds varianceThreshold and completed-topology dwell exceeds minimumDwell; otherwise HOLD. Allocation chooses the p minimizing immediate observed unmet demand.",
        "B": "changePoint is two-sided Page-Hinkley on q and demand; HMM is a two-state Gaussian HMM fitted by 50 Baum-Welch iterations; hybridMPC and topologyMPC use beamMPC with observed q/demand and candidate hysteresis. All estimate split productivity by ridgeQR auxiliary outcomes.",
        "C": "Bin log10 r into 4 equal cells, log10 ell into 2, and q into regimeBins/8 equal cells, giving exactly regimeBins cells. Store Beta(1,1) beneficial-split posterior updated only from observed service outcomes, act only when posterior probability exceeds confidence, and use beamMPC for horizonSteps; otherwise HOLD."
      },
      "ablationTransforms": ["noDrive:remove r from regime key","equilibriumOnly:set r=0 in regime lookup","noSize:set ell=1 in lookup","noUncertainty:replace posterior gate by mean>0.5"],
      "tuning": {
        "A": {"count": 16, "axes": [{"name":"varianceThreshold","values":[0.05,0.10,0.20,0.40]},{"name":"minimumDwell","values":[0.05,0.10,0.20,0.40]}]},
        "B": {"count": 64, "axes": [{"name":"detector","values":["changePoint","HMM","hybridMPC","topologyMPC"]},{"name":"hysteresis","values":[0.05,0.10,0.20,0.40]},{"name":"horizonSteps","values":[5,10,20,40]}]},
        "C": {"count": 64, "axes": [{"name":"regimeBins","values":[8,16,32,64]},{"name":"confidence","values":[0.60,0.75,0.90,0.975]},{"name":"horizonSteps","values":[5,10,20,40]}]}
      }
    },
    "ECM-T06": {
      "worldsPerSeed": 384,
      "state": ["h[m]", "crackOpen[1]", "inventory[CU]", "damage[DU]", "available[1]", "maintenanceType[none,repair,replace]", "maintenanceRemaining[s]", "previousAchievedJ[A m-2]"],
      "constants": {"hMin_m": 2.5e-7, "hMax_m": 2e-5, "area_m2": 1e-4, "initialInventory_CU": 200},
      "draws": {"kr_m_per_s": "logUniform[1e-10,1e-8]", "kd_m2_per_s": "logUniform[1e-16,1e-13]", "km_m3_per_C": "logUniform[1e-12,1e-10]", "kcr_per_s": "logUniform[1e-7,1e-5]", "rhoFilm_ohm_m": "logUniform[0.01,1]", "hProtect_m": "logUniform[1e-6,5e-6]", "qLayer_CU_per_m3": "logUniform[2.5e10,1e11]", "lambda0_per_s": "logUniform[1e-6,1e-4]", "betaH": "Uniform[0.5,2]", "betaSlew": "Uniform[0.5,3]", "requestedCurrentDensity_A_per_m2": "piecewise Uniform[0,500], segment 10 s, with 5% stress pulses Uniform[500,1000]"},
      "drawOrder": ["kr_m_per_s","kd_m2_per_s","km_m3_per_C","kcr_per_s","rhoFilm_ohm_m","hProtect_m","qLayer_CU_per_m3","lambda0_per_s","betaH","betaSlew","requestedCurrentDensity_A_per_m2","crackUniform","maintenanceDuration","observationNoise"],
      "equations": ["Rfilm=rhoFilm*h/area", "achieved_j=0 while maintenanceRemaining>0, otherwise min(requested_j*throttle,(350 A m-2)/(1+Rfilm/(1 ohm)))", "growth=min(kr,kd/max(h,hMin),km*abs(achieved_j))", "uCr=1+2*crackOpen+I(repairActive)", "dh/dt=growth+bBuild-kcr*uCr*h", "damageRate=d0*exp(-h/hProtect)*(1+2*crackOpen), d0=1e-4 DU s-1", "hazard=lambda0*exp(betaH*(h-hMin)/(hMax-hMin)+betaSlew*abs(achieved_j-previousAchievedJ)/(100 A m-2))"],
      "initial": ["h=hMin", "crackOpen=0", "inventory=200 CU", "damage=0 DU", "available=1", "throttle=1", "maintenanceType=none", "maintenanceRemaining=0", "previousAchievedJ=0"],
      "boundaryConditions": ["not applicable: event-driven lumped lifecycle system"],
      "actions": {
        "cadence_s": 10,
        "menu": ["choose throttle in [0,0.25,0.5,0.75,1] and at most one of HOLD/INSPECT/BUILD/REPAIR/REPLACE", "INSPECT: immediate noisy h sd=0.1*h and crack bit error 0.02; max 40; maintenance cost 0.5 CU", "BUILD: bBuild in [1e-9,5e-9] m s-1 for 10 s; legal only while available", "REPAIR: legal only if crackOpen and no maintenance; sample integer duration Uniform[1,20] s, set maintenanceType=repair and available=0, charge maintenance 8 CU; crack stays open until completion, then closes", "REPLACE: legal only with no maintenance; set 30 s timer and available=0, charge maintenance 40 CU; max 2; on completion set h=hMin and crack=0"],
        "inventory": "At each step charge gross positive formation volume area*(growth+bBuild)*dt before applying kcr loss; insufficient layer inventory rejects BUILD and caps endogenous growth at affordable volume, recording unmet formation. Repair/replacement/inspection use a separate maintenance-CU ledger and never debit layer inventory."
      },
      "events": "dt=1 s: at 10 s boundary choose throttle plus at most one legal maintenance action; compute achieved_j from step-start h and availability; compute growth/build and charge gross volume; apply analytic kcr*uCr loss; if no crack is open and no repair is active, sample one crack Bernoulli(1-exp(-hazard*dt)); a new crack removes Uniform[0.2,0.8] of h but not below hMin; update resistance, throughput, damage, and previousAchievedJ; decrement maintenance and apply its completion transition; set available=I(maintenanceRemaining=0); emit observation. Any negative inventory, h<hMin, or h>hMax is a generator failure, never clipped.",
      "solver": {"arm": "explicit event solver dt=1 s with analytic exponential kcr*uCr update and trapezoidal damage", "oracle": "dt=0.5 s, full-state lifecycle MPC horizon 500 s", "horizon_s": 20000},
      "observations": ["each 10 s: request,achieved throughput,Rfilm+Gaussian sd=max(1e-6,0.01*Rfilm),inventory,availability; 73 B", "damage alarm when cumulative new damage crosses each 0.1 DU, delayed 20 s; 48 B", "inspection as action"],
      "target": "minimize lifecycle cost while serving request; catastrophic iff damage>=1 DU or inventory<0",
      "rawMetrics": {"d_cum": "terminal damage DU", "e_service": "integral(max(0,request-achieved))/integral(request)", "c_inventory": "200-terminal inventory CU", "c_maintenance": "inspection+repair+replacement CU", "e_catastrophic": "services with damage>=1 DU divided by 384", "availability": "sum available seconds/(384*20000 s), protected and unscaled"},
      "loss": "35*d_cum+20*e_service+15*c_inventory+15*c_maintenance+15*e_catastrophic after component scaling",
      "supports": {"development": "shown independent crack process", "confirmation": "same support", "transfer": "common-shock crack probability 0.02 per 100 s affecting 25% services; rhoFilm multiplied by 2; hProtect multiplied by 0.5"},
      "armAlgorithms": {
        "A": "Apply fixed throttle. On each delivered damage alarm, set throttle=0 for alarmDelay_s then resume; never inspect, build, repair, or replace.",
        "B": "rateLimit uses riskQuantile of auxiliary damage versus slew; rollback sets throttle=0 and REPLACE after an alarm; ageMaintenance INSPECTs every horizon_s and repairs detected cracks; robustMPC uses beamMPC with a ridgeQR state [resistance,alarmAge,throughput] and the declared riskQuantile.",
        "C": "particleFilter estimates [h,crackOpen,kr,kd,km,kcr,rhoFilm,hProtect] from resistance, service, alarms, and paid inspections. beamMPC expands throttle plus legal maintenance/build actions for horizon_s and evaluates damage/resource at riskQuantile."
      },
      "ablationTransforms": ["freeLayer:set qLayer=0 only in controller objective but retain evaluator charge","noResistance:set rhoFilm=0 in controller model","noCracks:set crack hazard=0 in controller model","fixedMaximum:BUILD until hMax then never change barrier action","noInspection:remove INSPECT from C menu"],
      "tuning": {
        "A": {"count": 16, "axes": [{"name":"throttle","values":[0.25,0.5,0.75,1]},{"name":"alarmDelay_s","values":[0,10,20,40]}]},
        "B": {"count": 64, "axes": [{"name":"controller","values":["rateLimit","rollback","ageMaintenance","robustMPC"]},{"name":"horizon_s","values":[100,250,500,1000]},{"name":"riskQuantile","values":[0.50,0.75,0.90,0.99]}]},
        "C": {"count": 64, "axes": [{"name":"particles","values":[64,128,256,512]},{"name":"horizon_s","values":[100,250,500,1000]},{"name":"riskQuantile","values":[0.50,0.75,0.90,0.99]}]}
      }
    },
    "ECM-T07": {
      "worldsPerSeed": 64,
      "state": ["cPlus(x,t)[1]", "cMinus(x,t)[1]", "phi(x,t)[1]", "anodeReserve[1]", "depositMass[1]", "front[64x64 bool]"],
      "normalization": {"lengthScale_m": 1e-4, "diffusionScale_m2_per_s": 1e-10, "timeScale_s": 100, "concentrationScale_mol_per_m3": 500, "potentialScale_V": 0.025679653, "fluxScale_mol_per_m2s": 5e-4},
      "draws": {"DminusOverDplus": "logUniform[0.25,4]", "epsilon": "logUniform[0.02,0.10]", "Pe": "logUniform[1,20]", "initialPerturbation": "sum k=1..4 Normal(0,0.0025)*cos(2*pi*k*x), subtract spatial mean", "frontBias": "Uniform[1,3]"},
      "drawOrder": ["DminusOverDplus","epsilon","Pe","initialPerturbation","frontBias","frontVoxelChoice","globalObservationNoise","probeNoise"],
      "equations": ["Jplus=-dcPlus/dx-cPlus*dphi/dx", "Jminus=-Dr*(dcMinus/dx-cMinus*dphi/dx)", "dcPlus/dt=-dJplus/dx", "dcMinus/dt=-dJminus/dx", "-epsilon^2*d2phi/dx2=cPlus-cMinus"],
      "initial": ["cPlus=cMinus=1+initialPerturbation and strictly positive", "phi solves Poisson boundary problem", "voxelMass=1/4096 and scaffoldMass=64*voxelMass", "anodeReserve=2-scaffoldMass", "depositMass=scaffoldMass", "remainder=0", "front bottom row occupied as the registered scaffold; newOccupiedCount=0"],
      "boundaryConditions": ["Jplus(0,t)=Jplus(1,t)=u(t)", "Jminus(0,t)=Jminus(1,t)=0", "phi(0,t)=0", "phi(1,t)=-Pe*u(t)"],
      "front": "At every dt, transfer m=u*dt: subtract m from anodeReserve, add m to depositMass and the voxel remainder. While remainder>=voxelMass, enumerate unoccupied four-neighbour perimeter voxels by row then column; E_i=row_i/63+(4-occupiedNeighbourCount_i)/4; bilinearly interpolate cPlus at the voxel tip; sample with probability proportional to exp(beta*E_i)*max(cPlusTip,1e-9); occupy it, increment newOccupiedCount, and subtract exactly voxelMass. beta=frontBias before min(cMinus)<0.05 and 3*frontBias afterwards. Contact is first occupied top-row voxel. Remainder equals depositMass-scaffoldMass-voxelMass*newOccupiedCount.",
      "actions": {"cadence": 0.005, "driveMenu": [0,0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.25,2.5,2.75,3], "slew": "abs(delta u)<=0.25 per decision and u(0-)=0", "probeMenu": "before the drive choice, request zero to eight probes sequentially from x=(i+0.5)/32, i=0..31; reused sites are legal, each response is returned before the next request, and total episode budget is 320", "probeOperator": "log concentration pair [log(max(cPlus,1e-9)),log(max(cMinus,1e-9))] with independent Gaussian sd 0.02 log units, 64 B and 1 probe", "mandatorySketch": "16-bin front maximum-height sketch every 0.01, 96 B"},
      "observations": ["each 0.005: t,u,transferredMass,vProxy where vProxy=phi(0)-phi(1)+u*integral(1/max(1e-9,cPlus+cMinus))dx plus Gaussian sd 0.01; 72 B", "mandatory front sketch and optional common concentration probes as declared in actions"],
      "solver": {"arm": "128-cell Scharfetter-Gummel finite volume; implicit Euler first step then BDF2 dt=1e-4; damped Newton residual<=1e-9; max 12; negative concentration is solver failure, never clipped", "oracle": "256 cells dt=5e-5 and 128x128 front with scaffoldMass=128/16384 and voxelMass=1/16384", "closure": "integral(cPlus) and integral(cMinus) each remain at their initial value; anodeReserve+depositMass remains 2; depositMass=scaffoldMass+voxelMass*newOccupiedCount+remainder, all within absolute 1e-10", "horizon": 0.5, "eventOrder": ["apply slew", "implicit PNP-Poisson solve", "check positivity and carrier balance", "transfer conservative mass", "grow front", "emit sketch and requested probes"]},
      "target": "At every decision emit contact-within-0.05 probability and maximize transferred mass without contact. Oracle exhaustively enumerates every length-10 action sequence from the 13-value driveMenu that obeys the 0.25 slew from the current drive (at most 3^10 leaves), simulates each for the 0.05 horizon, and chooses maximum no-contact transferred mass, then lower peak field, then lexically smaller ten-value sequence.",
      "rawMetrics": {"e_contact": "worlds with top-row contact divided by 64", "a_ramified": "For each final front, find the highest occupied row. Breadth-first search from bottom-row scaffold to any occupied voxel on that row using four-neighbour edges, ascending row/column ties. Ramified voxels are occupied non-scaffold voxels outside that one shortest path; divide by max(1,occupied non-scaffold voxels).", "e_throughput": "max(0,oracle transferred mass-arm transferred mass)/max(1e-12,oracle mass)", "e_false_stop": "At each decision where arm chooses u=0, oracle simulates the legal u=0.25 slew for 0.05 from the same hidden state. Count false stop iff that rollout has no contact and all concentrations stay positive; divide by all arm stop decisions, with 0/0=0.", "e_cal": "Brier score plus ten-equal-width-bin expected calibration error for predicted contact within 0.05; empty bins contribute zero"},
      "loss": "40*e_contact+25*a_ramified+20*e_throughput+10*e_false_stop+5*e_cal after component scaling",
      "supports": {"development": "shown fixed blocking closure", "confirmation": "same support", "transfer": "choose lower or upper Dr interval with equal probability, then logUniform[0.10,0.24] or logUniform[4.1,10]; anion flux Jminus(1)=gamma*u with gamma Uniform[0.05,0.20] and matching Jminus(0); add two two-voxel protrusions above scaffold columns 16 and 48, set scaffoldMass=68/4096, depositMass=scaffoldMass, anodeReserve=2-scaffoldMass, remainder=0, newOccupiedCount=0"},
      "observerDefinitions": {
        "B_modes": "For M=observerStates and m=0..M-1 set lambda_m=10^(-3+6*m/(M-1)) per dimensionless time. At each 0.005 decision update s_m_next=exp(-lambda_m*0.005)*s_m+(1-exp(-lambda_m*0.005))*u, s_m(0)=0. For each of the 64 site/species log-concentration channels use feature x=[1,s_0..s_(M-1),vProxy,16 sketch heights/63], coefficient prior mean 0 and covariance 100*I, so its prior log-concentration mean is 0. A paid probe updates only the two coefficient blocks at that site by Bayesian linear regression P_new=P-P*x*x^T*P/(0.02^2+x^T*P*x), w_new=w+P_new*x*(y-x^T*w)/0.02^2. Unprobed-site means and covariance rows use linear interpolation between nearest probed sites, or the nearest one outside their span; before any probe they retain the prior. No hidden concentration target or auxiliary probe is used.",
        "C_state": "For M=depletionStates use an M-cell Scharfetter-Gummel finite-volume discretization of the registered dimensionless PNP-Poisson equations, the same initial/boundary conditions, BDF2 dt=1e-4 and Newton tolerance as the arm solver. A fixed 128-particle bootstrap filter carries both M-cell concentration fields, Dr,epsilon,Pe and the 16 sketch heights; priors are exactly the generator supports and geometry particles use the registered front RNG. Paid probe likelihood is the registered 0.02-log-unit Gaussian.",
        "frontFeatures": "From sketch heights h_b in [0,63], b=0..15, define H=max(h)/63, rough=sqrt(sum_b(h_b-mean(h))^2/16)/63, curvature=sum_{b=1..14}max(0,h_(b-1)-2*h_b+h_(b+1))/(14*63), and cEdgeHat as the causal observer posterior mean of cPlus at x=31.5/32. Every auxiliary world executes the common triangular drive-index schedule [0,1,...,12,11,...,1] repeated to its horizon, with menu value 0.25*index and no probes beyond the mandatory observations. At auxiliary decision d the training row contains only causal observations through d and the actually executed u_d; its label, released 0.05 later, is one iff a top-row contact is visible in the mandatory sketches from decisions d+1 through d+10. No unexecuted drive or counterfactual label is generated. Fit a separate candidate-causal logistic model p=sigmoid(w dot [1,H,rough,1-cEdgeHat,u,u^2]) by the shared Adam/BCE rule. B uses p. C uses pC=sigmoid(logit(p)+curvatureWeight*curvature). A candidate drive is safe iff its p or pC is <=1-safetyQuantile; C uses the fixed probability cutoff 0.05 because it has no safetyQuantile axis.",
        "adaptiveProbe": "Let x be B's Gaussian observer state or C's particle vector [the 64 site/species log concentrations, H,rough,curvature]. For every site i form its 2-row centered linear least-squares observation operator H_i and posterior covariance P (Kalman P for B; unbiased particle sample covariance for C). With R=0.02^2*I_2, P_i=P-P*H_i^T*(H_i*P*H_i^T+R)^-1*H_i*P and score_i=trace(P)-trace(P_i). Choose the greatest score above 1e-4, ties lower site i, update after its returned observation, and repeat to eight probes at that decision or until no score exceeds 1e-4; never exceed 320."
      },
      "armAlgorithms": {
        "A": "Use vProxy only. Increase toward globalDriveLimit by one legal slew step when vProxy<voltageThreshold, decrease by one step otherwise; never buy concentration probes.",
        "B": "Use B_modes and its exact Gaussian update, call adaptiveProbe before every drive decision, and run beamMPC for horizonSteps registered decisions. Node cost is negative transferred mass plus 100*p; discard drives failing the exact safetyQuantile rule, and choose the first action of the lowest-cost surviving node. If none survives choose the greatest legal downward slew toward u=0.",
        "C": "Use C_state, call adaptiveProbe before every drive decision, and run beamMPC for horizonSteps registered decisions. Propagate every particle through the reduced PNP/front model; node cost is negative mean transferred mass plus 100*pC, discard pC>0.05, and choose the first action of the lowest-cost surviving node. If none survives choose the greatest legal downward slew toward u=0."
      },
      "ablationTransforms": ["meanOnly:replace all local probes by their arithmetic mean","noGeometry:zero front-risk term","noDepletion:remove concentration modes","uniformProbes:cycle sites 0..31","badTimer:replace posterior by dimensionally rejected square timer and require unit-gate failure"],
      "tuning": {
        "A": {"count": 16, "axes": [{"name":"globalDriveLimit","values":[0.5,1,1.5,2]},{"name":"voltageThreshold","values":[0.02,0.05,0.10,0.20]}]},
        "B": {"count": 64, "axes": [{"name":"observerStates","values":[16,32,64,128]},{"name":"safetyQuantile","values":[0.90,0.95,0.975,0.99]},{"name":"horizonSteps","values":[5,10,20,40]}]},
        "C": {"count": 64, "axes": [{"name":"depletionStates","values":[16,32,64,128]},{"name":"curvatureWeight","values":[0.05,0.10,0.20,0.40]},{"name":"horizonSteps","values":[5,10,20,40]}]}
      }
    },
    "ECM-T08": {
      "worldsPerSeed": 256,
      "state": ["z[1]", "q1[A]", "q2[A]", "optional mismatch q3[A]"],
      "publicDictionary": {"g1_per_s": "theta1_m2_per_s/theta3_m^2", "g2_per_s": "theta2_m2_per_s/theta4_m^2", "g3_ohm": "theta5_ohm/theta7", "g4_ohm": "theta6_ohm/theta8"},
      "draws": {"g1_per_s": "logUniform[1e-4,1e-1]", "g2_per_s": "logUniform[1e-4,1e-1]", "g3_ohm": "logUniform[0.005,0.5]", "g4_ohm": "logUniform[0.005,0.5]", "theta3_m": "logUniform[1e-6,1e-4], theta1=g1*theta3^2", "theta4_m": "logUniform[1e-6,1e-4], theta2=g2*theta4^2", "theta7": "logUniform[0.2,5], theta5=g3*theta7", "theta8": "logUniform[0.2,5], theta6=g4*theta8", "OCV": "balanced categorical[flat,moderate,steep] slopes [0.002,0.2,0.8] V per occupancy", "noise": "Gaussian voltage sd logUniform[0.0002,0.005] V", "modelMismatch": "Bernoulli(0.25) adds pole q3 with g5 logUniform[0.001,0.02] s-1 and g6 logUniform[0.001,0.02] ohm"},
      "drawOrder": ["g1_per_s","g2_per_s","g3_ohm","g4_ohm","theta3_m","theta4_m","theta7","theta8","OCV","modelMismatch","initial_z","noise","optionalSensorNoise"],
      "equations": ["dz/dt=-I/Q with Q=3600 C", "dq1/dt=-g1*q1+g1*I", "dq2/dt=-g2*q2+g2*I", "dq3/dt=-g5*q3+g5*I when mismatch is present", "U(z)=3.6 V+slope*(z-0.5)", "V=U(z)-g3*q1-g4*q2-(0.02 ohm)*I; mismatch subtracts g6*q3"],
      "initial": ["z Uniform[0.3,0.7]", "q1=q2=q3=0"],
      "boundaryConditions": ["not applicable: exact lumped modal surrogate; the public group dictionary is the complete fitted-model boundary"],
      "constraints": ["0.05<=z<=0.95", "abs(I)<=2 A", "abs(delta I)<=1 A per one-second sample; any candidate waveform predicted to breach z is unavailable, not clipped"],
      "experimentMenu": ["pulse desired signal: repeat [0,1,1,0,-1,-1] A with 50 s blocks", "PRBS desired signal: degree-7 maximal LFSR with primitive polynomial x^7+x^3+1, all-one initial register, bit 10 s, output plus/minus 1 A", "multisine desired signal: frequencies [1/600,2/600,4/600,8/600] Hz, phases -pi*k*(k-1)/4 for k=1..4, then rescale peak to 1 A", "rest desired signal: I=0", "after multiplying desired signal by amplitude [0.5,1,1.5,2], set I_t=clip(desired_t,I_(t-1)-1,I_(t-1)+1) A with I_-1=0"],
      "actions": {"maximumExperiments_s": [600,600,600], "choose": "execute at least one experiment; after each completed 600 s experiment choose STOP or one public waveform/amplitude for the next; actual excitation duration is 600,1200,or1800 s", "optionalSensorMenu": "while an experiment is running, immediately before applying current sample t=0,10,...,590 s, choose no sensor, noisy q1, or noisy q2; the chosen scalar is returned before that current sample; independent Gaussian sd=0.01 A; maximum 12 total; 48 B and 1 probe each"},
      "observations": ["each second: t,I,V; 56 B", "optional common q1/q2 sensor as action; true theta and g values remain hidden"],
      "solver": {"generator": "exact matrix exponential for constant-I one-second intervals", "oracle": "same equations plus hidden state; 128-mode label refers only to evaluator crosscheck and is not arm input", "rank": "weighted sensitivity S by central finite difference relative step 1e-5; singular values of whitened S; supported group direction i iff sigma_i/sigma_1>=tau. Challenge rho=sigma_4/sigma_1 is computed on the public unit-amplitude 600 s multisine without optional sensors, independent of arm actions."},
      "designDefinitions": {
        "fit": "At the initial design step use public prior means equal to geometric support midpoints for g1..g4 and the known OCV category. After each observation, refit log(g1..g4) by boundedCoordinateSearch on all paid voltage and sensor Gaussian NLL. Let J be its central-finite-difference Jacobian at relative step 1e-5, W the diagonal inverse registered noise variance, F=J^T*W*J, and P=(F+1e-12*I_4)^-1. A/B base-theta output, when requested, fixes theta3=theta4=1e-5 m and theta7=theta8=1 then applies the public dictionary; this arbitrary section is always flagged unsupported. Group 90% intervals are exp(log(gHat_i)+[-1,1]*1.6448536269514722*sqrt(P_ii)).",
        "B_scores": "For a legal candidate waveform a, compute its predicted whitened Jacobian S_a from the current fitted state and F_a=S_a^T*S_a. Dopt=[logdet(F+F_a+1e-12I)-logdet(F+1e-12I)]/600; Aopt=[trace((F+1e-12I)^-1)-trace((F+F_a+1e-12I)^-1)]/600; profile=[min_i 1/((F+F_a+1e-12I)^-1)_ii-min_i 1/((F+1e-12I)^-1)_ii]/600. robust is the minimum Dopt over OCV slopes [0.002,0.2,0.8] and mismatch scenarios [absent,present with g5=0.01 per s and g6=0.01 ohm]. For a q1 or q2 sensor row s use the identical increment with F_a=s^T*s and divisor 1. Execute the greatest strictly positive score, ties canonical action ID; the mandatory first waveform uses the greatest score even if nonpositive.",
        "C_entropy": "Use fit's Gaussian log-group posterior. For any waveform or sensor with whitened Jacobian S_a set P_after=(P^-1+S_a^T*S_a)^-1 and entropyGain=0.5*(logdet(P)-logdet(P_after))/resource, where resource is 600 s for a waveform and 1 probe for a sensor. Choose greatest positive entropyGain, ties canonical action ID. After each completed experiment draw 256 log-group vectors from N(log(gHat),P) using the action-outcome stream, recompute the accumulated-design singular values, and define supportProbability_i as the fraction with sigma_i/sigma_1>=rankTolerance. Group i is reportable iff supportProbability_i>=stopConfidence."
      },
      "target": "emit for each g group and each theta base parameter a value, 90% interval, and supported-or-abstain flag. Predict a 600 s evaluator-only multisine from the registered initial state using desired amplitude 0.75 and the same slew filter. Oracle knows groups and sensitivity nullspace.",
      "rawMetrics": {"e_group": "median over oracle-supported groups of abs(estimate-truth)/truth; if none are supported this is 0 only for abstention and 1 otherwise", "e_coverage": "abs(group interval coverage-0.90)/0.10 plus mean intervalScore90/truth over supported groups; 0 for a correct no-supported-group abstention", "e_semantic": "A theta claim is confident iff supported=true, endpoints are finite, and interval width<=abs(pointEstimate). Count confident claims whose oracle sensitivity direction has sigma_i/sigma_1<tau, divided by 8.", "e_prediction": "evaluator-only held-multisine voltage NRMSE", "e_constraint": "input or z constraint violations divided by actual excitation samples"},
      "loss": "30*e_group+25*e_coverage+20*e_semantic+15*e_prediction+10*e_constraint after component scaling",
      "supports": {"development": "dictionary and waveform menu public to every arm; group values hidden; 52 worlds for each rank tolerance use g2=g1*(1+delta), g4=g3*(1+delta), delta logUniform[1e-13,1e-5], with rejection until rho=sigma4/sigma1 is in [0.8*tau,1.2*tau]; remaining 48 unconstrained", "confirmation": "same four 52-world tolerance strata and 48 unconstrained worlds", "transfer": "flat slope fixed 0.001; mismatch pole always present with g6[0.02,0.05] ohm; delta logUniform[1e-15,1e-12]"},
      "armAlgorithms": {
        "A": "Execute its candidate waveform/amplitude for exactly one experiment, buy no optional sensors, fit theta1..theta8 directly by boundedCoordinateSearch on voltage SSE plus candidate ridge, emit intervals from the pivoted-SVD inverse Hessian, and STOP. Also convert to all four public groups so A receives no dictionary advantage.",
        "B": "Use fit and B_scores. At an experiment boundary enumerate all 16 legal waveform/amplitude pairs and execute the mandated best action; during that experiment evaluate q1/q2 rows at every registered 10 s sensor opportunity and purchase the best only when its score is strictly positive and the 12-probe budget remains. Refit after each returned sensor and experiment. STOP when no waveform score is positive after the first experiment or after three experiments. report=theta emits the arbitrary unsupported section; rankGroup emits only directions passing rankTolerance; abstain emits no parameter values; profileSet emits the finite profile-likelihood group set. Every mode predicts the held waveform.",
        "C": "Use fit and C_entropy with the public group dictionary. All modes select the first waveform by entropy. moreExcitation buys no sensors and continues choosing waveforms until every intended group is reportable, no waveform entropy is positive, or three experiments finish. sensor uses the same waveform rule and also evaluates q1/q2 entropy at every registered sensor opportunity, buying the best positive row within 12 probes. groupReport STOPs after the first experiment and reports only reportable groups; abstain STOPs after the first experiment and emits ABSTAIN for every parameter. All other modes STOP once every intended group is reportable or three experiments finish. Never emit a base theta value or interval; every null or sub-confidence group is ABSTAIN."
      },
      "ablationTransforms": ["originalParameters:force theta1..theta8 output","noOCVGuard:remove slope from sensitivity matrix","randomExcitation:choose action by action-outcome RNG","noMismatchCheck:omit held-waveform residual gate"],
      "tuning": {
        "A": {"count": 16, "axes": [{"name":"waveform","values":["pulse","PRBS","multisine","rest"]},{"name":"ridge","values":[1e-12,1e-10,1e-8,1e-6]}]},
        "B": {"count": 64, "axes": [{"name":"rankTolerance","values":[1e-12,1e-10,1e-8,1e-6]},{"name":"design","values":["Dopt","Aopt","profile","robust"]},{"name":"report","values":["theta","rankGroup","abstain","profileSet"]}]},
        "C": {"count": 64, "axes": [{"name":"rankTolerance","values":[1e-12,1e-10,1e-8,1e-6]},{"name":"stopConfidence","values":[0.80,0.90,0.95,0.99]},{"name":"nextAction","values":["moreExcitation","groupReport","sensor","abstain"]}]}
      }
    },
    "ECM-T09": {
      "worldsPerSeed": 384,
      "state": ["q[1]", "relay[particleCount,bool]", "lag[A]"],
      "draws": {"particleCount": "balanced categorical[128,512,2048]", "thresholdMixture": "component weights [0.55,0.45]; bivariate Normal(beta,alpha) means [(0.30,0.50),(0.55,0.75)], marginal sd [0.06,0.06], correlation 0.6; reject unless 0.05<=beta and beta+0.03<=alpha<=0.95", "particleWeight": "logNormal(0,0.3), normalized to sum 1", "interactionMark": "s=(alpha+beta-1)", "temperature": "piecewise categorical[288,298,308] K", "tau0_s": "logUniform[5,500]", "noise": "Gaussian sd logUniform[0.0002,0.003] V"},
      "drawOrder": ["particleCount","thresholdMixture","particleWeight","temperature","tau0_s","schedulePermutation","restDuration","noise"],
      "equations": ["q_next=clip(q+I*dt/3600,0,1)", "alphaT=clip(alpha-0.001*(T-298),0,1)", "betaT=clip(beta-0.001*(T-298),0,1)", "relay=1 if q>=alphaT; relay=0 if q<=betaT; otherwise unchanged", "x=sum(weight*relay)", "dl/dt=(I-lag)/tau(T), tau(T)=tau0*exp(1200*(1/T-1/298))", "V=3.4+0.4*q+0.08*sum(weight*interactionMark*relay)+0.03*x*(1-x)+0.02*lag+noise"],
      "initial": ["q=0", "all relays=0", "lag=0", "T=298 K"],
      "boundaryConditions": ["q is bounded on [0,1] by the registered schedule; no spatial boundary"],
      "schedules": "dt=1 s. Start q=0 and run I=+1 A until q=1, then I=-1 A until q=0. Draw K discrete-uniform in [1,12]; take the first K values of a seeded Fisher-Yates permutation of reversal targets [0.2,0.35,0.5,0.65,0.8,0.9] repeated twice; drive with sign toward each target, reverse sign on the first sample q crosses it, and stop that leg at the prior target or q boundary. At the start of every drive leg and every rest assign the next balanced-categorical T in [288,298,308] K before threshold and lag updates. After every reversal insert a rest from balanced categorical [10,30,100,300,1000] s. Finish at q=0; no state reset within a world.",
      "observations": ["each second: t,q,I,T,V; 72 B", "at every prediction time the exact next 32 registered I and T values are public; 512 B"],
      "actions": {"passive": true, "menu": [], "budget": 0},
      "solver": "exact ordered relay event update; on simultaneous crossings update ascending particle index; exact exponential lag update; oracle stores all relays. The first complete major loop is observed burn-in and unscored. Thereafter issue a 32-step forecast at non-overlapping times burnInEnd+32*r before consuming those 32 voltage observations; after each observed sample update state. Discard a final suffix shorter than 32.",
      "target": "next 32 voltage values and 90% intervals; separate scores on major loop, minor loops, first 8 samples after reversal, and rests",
      "rawMetrics": {"e_voltage": "NRMSE over all 32-step forecasts", "e_minor_loop": "NRMSE restricted to minor loops", "e_reversal": "abs(mean residual over first 8 post-reversal samples)/max(1e-6,voltage range)", "e_cal": "abs(coverage-0.90)/0.10 plus mean intervalScore90/max(1e-6,voltage range)"},
      "loss": "40*e_voltage+25*e_minor_loop+20*e_reversal+15*e_cal after component scaling",
      "supports": {"development": "two-component mixture and schedule shown", "confirmation": "same support with at least 96 equal-q path pairs differing by >5 noise sd", "transfer": "mixture weights [0.45,0.35,0.20] and third mean(beta,alpha)=(0.15,0.85); set K=24 and permute target list [0.2,0.35,0.5,0.65,0.8,0.9] repeated four times; tau0 logUniform[500,2000] s"},
      "armAlgorithms": {
        "A": "Fit a piecewise-linear V(q) curve with socKnots equal bins by ridgeQR. directionStates=0 ignores direction; positive values split that many equal bins between charge/discharge direction. Update only after each observed sample.",
        "B": "directionBit uses piecewise-linear q plus sign(I); GRU uses the shared gru at stateWidth; sparsePreisach uses stateWidth ordered threshold basis functions with nonnegative LASSO; stateSpace uses stateWidth stable diagonal lag poles. All output Gaussian 90% intervals with candidate quantile calibration.",
        "C": "Maintain separate charged/discharged relay-mass histograms with histogramBins equal q bins plus lagPoles log-spaced exponential states from 5 to 500 s. Fit observation weights by ridgeQR on auxiliary schedules; update a bin only when q crosses its boundary, then issue forecasts before online observation update."
      },
      "ablationTransforms": ["scalarOnly:merge charge/discharge histograms and remove lags","directionOnly:replace histograms by one direction bit","noPopulation:remove histograms","noRelaxation:remove lag poles","restReset:zero state after every rest"],
      "tuning": {
        "A": {"count": 16, "axes": [{"name":"socKnots","values":[4,8,16,32]},{"name":"directionStates","values":[0,1,2,4]}]},
        "B": {"count": 64, "axes": [{"name":"model","values":["directionBit","GRU","sparsePreisach","stateSpace"]},{"name":"stateWidth","values":[8,16,32,64]},{"name":"intervalQuantile","values":[0.80,0.90,0.95,0.99]}]},
        "C": {"count": 64, "axes": [{"name":"histogramBins","values":[8,16,32,64]},{"name":"lagPoles","values":[1,2,4,8]},{"name":"intervalQuantile","values":[0.80,0.90,0.95,0.99]}]}
      }
    },
    "ECM-T10": {
      "worldsPerSeed": 1,
      "state": ["z[1]", "temperature[K]", "damage[DU]", "survival[bool]", "purchasedEarly[256,bool]", "purchasedFull[256,bool]"],
      "candidatePolicies": "Sample 256 without replacement by Fisher-Yates from the 4096 six-tuples u_m in [0.5,1,1.5,2]. Each stage raises occupancy by 0.1, duration=0.1/u_m, and has rest [0,0.1,0,0.5,0,1] times world restMultiplier. A normalized cycle is one such six-stage job and starts from the same z0; this synthetic reset is common, explicit, and not a physical-cell claim.",
      "draws": {"ambient_K": "Uniform[283,323]", "initialOccupancy": "Uniform[0.1,0.3], hence all six stage occupancies remain <=0.9", "restMultiplier": "balanced categorical[0.5,1,2]", "thermalTau": "logUniform[0.1,2] normalized time", "thermalGain": "logUniform[0.2,1] K per current-squared per normalized-time", "chemistry": "for ordered seed index r within phase, family [A,B,C][(r-1) mod 3]; transfer family D", "measurementNoise": "independent Gaussian, sd damage=0.002 DU, temperature=0.2 K, impedance=0.002"},
      "drawOrder": ["candidatePolicyPermutation","ambient_K","initialOccupancy","restMultiplier","thermalTau","thermalGain","chemistry","reserveSet","measurementNoise"],
      "chemistryCoefficients": {
        "A": {"aCal": 2e-5, "aCyc": 1e-4, "aKnee": 0.10, "Nk": 900, "EaOverR_K": 2500},
        "B": {"aCal": 5e-5, "aCyc": 6e-5, "aKnee": 0.15, "Nk": 1100, "EaOverR_K": 3200},
        "C": {"aCal": 1e-5, "aCyc": 1.5e-4, "aKnee": 0.08, "Nk": 700, "EaOverR_K": 1800},
        "D": {"aCal": 8e-5, "aCyc": 4e-5, "aKnee": 0.20, "Nk": 600, "EaOverR_K": 3800}
      },
      "coefficientUnits": {"aCal": "DU per calendar-exposure unit", "aCyc": "DU per cycling-exposure unit", "aKnee": "DU", "Nk": "cycle", "EaOverR_K": "K", "u_m": "normalized occupancy per normalized time", "taskTime": "normalized time"},
      "equations": ["stage m starts at z=z0+0.1*(m-1), ends at z+0.1, duration=0.1/u_m, and taskTime=sum_m duration_m", "during stage: Tend=Tamb+(Tstart-Tamb)*exp(-duration/tauT)+gain*u^2*tauT*(1-exp(-duration/tauT))", "stage Tmean=Tamb+gain*u^2*tauT+(Tstart-Tamb-gain*u^2*tauT)*(tauT/duration)*(1-exp(-duration/tauT))", "during rest: Tend=Tamb+(Tstart-Tamb)*exp(-rest/tauT); TmeanRest=Tamb+(Tstart-Tamb)*(tauT/rest)*(1-exp(-rest/tauT)), with zero-rest contribution defined as 0", "Ecyc=sum_m u_m^2*duration_m*exp(EaOverR*(1/298-1/TmeanStage_m))", "Ecal=sum_m [duration_m*(0.5+zStart_m+0.05)*exp(EaOverR*(1/298-1/TmeanStage_m))+rest_m*(0.5+zEnd_m)*exp(EaOverR*(1/298-1/TmeanRest_m))]", "deltaDamage_n=aCal*Ecal+aCyc*Ecyc+aKnee*max(0,(n-Nk)/500)^2/1500", "damage_n=damage_(n-1)+deltaDamage_n", "capacity_n=exp(-damage_n)", "survival fails at first damage>=-ln(0.8)"],
      "earlyFeatures": "at cycles 50 and 100 expose noisy damage, finite-difference damage slope, maximum temperature, impedance=1+2*damage+noise, and derived parity s(policy)=(-1)^(sum stage-level indices). Damage feature includes +0.01*s in development, 0 in confirmation, and -0.01*s in transfer.",
      "initial": ["for each normalized cycle z=z0, temperature=ambient, damage carries from the prior cycle; before cycle 1 damage=0 and survival=true", "one eight-policy reserve set is sampled before any outcome and is byte-identical for A/B/C"],
      "boundaryConditions": ["not applicable: finite policy table and lumped trajectories"],
      "budgets": {"early": "maximum 192 unique policies", "full": "maximum 48 unique policies, all a subset of that arm's early policies", "reserve": "8 common policies sampled uniformly without replacement before any outcomes; every arm must execute them and they count in both early and full budgets", "parallelSlots": 4, "finalOutput": "exactly 8 ordered slots; each may be a policy or ABSTAIN sentinel"},
      "actions": {"menu": ["buy early evaluation for one not-yet-early policy", "buy full evaluation for one early policy not yet full", "STOP when budgets exhausted or arm chooses", "return eight policy-or-ABSTAIN slots"], "eventOrder": ["execute all eight precommitted reserve early and full evaluations in canonical policy-tuple order", "run the early-only acquisition stage in frozen batches of at most four", "run the full acquisition stage only on policies already purchased early, in frozen batches of at most four", "freeze final eight slots"]},
      "observations": "policy six-tuple, ambient, initial occupancy, immediate task time, early features when purchased, right-censored survival at last paid cycle, and final damage plus survival only for full evaluation. Returned damage at cycles 50,100,1500 has independent registered Gaussian sd 0.002 DU; survival/event cycle is exact. If failure occurs before cycle 50 or 100, return the exact failure cycle, mark every later early feature missing with reason event-before-landmark, and still charge the purchased evaluation. A full evaluation continues the synthetic damage recurrence to cycle 1500 for evaluator scoring after the observed failure. Explicit candidate index, noiseless damage, chemistry family, coefficients, and counterfactuals are hidden.",
      "solver": "closed-form stage temperature and binary64 accumulation for 1500 cycles; event check after every stage and cycle; censored GP likelihood tolerance 1e-9 max 20,000 iterations",
      "oracle": "evaluates every candidate to 1500 cycles and selects eight smallest taskTime+5*finalDamage among capacity>=0.82",
      "target": "match the oracle safe top-eight set and calibrated final damage while minimizing paid full evaluations; fewer than eight safe candidates makes the remaining oracle slots ABSTAIN",
      "rawMetrics": {"e_final_task": "Sort oracle safe policies by true taskTime+5*damage then policy tuple. For output slot i, use max(0,trueObjective(output_i)-trueObjective(oracle_i))/max(1e-12,trueObjective(oracle_i)); ABSTAIN contributes 1. Average eight slots.", "d_final": "mean final damage of selected policies; ABSTAIN contributes -ln(0.8)", "e_unsafe_select": "selected policies with capacity<0.82 divided by 8; ABSTAIN is safe but receives other penalties", "e_rank": "For the 28 ordered output-slot pairs, count a discordance when their output order disagrees with true objective order; true ties break by policy tuple and any pair containing ABSTAIN is discordant. Divide by 28.", "e_cal": "abs(empirical 90% final-damage interval coverage-0.90)/0.10 plus mean intervalScore90(final damage)/max(1e-12,mean final damage) over non-abstained slots; if all abstain set e_cal=1"},
      "loss": "30*e_final_task+35*d_final+20*e_unsafe_select+15*e_rank after component scaling; e_cal is protected",
      "supports": {"development": "families A-C; positive proxy sign", "confirmation": "families A-C; proxy coefficient zero", "transfer": "family D; ambient shifted +10 K but capped 333 K; proxy sign negative; Nk multiplied by 0.7"},
      "selectionDefinitions": {
        "twoStage": "After the common reserve, no arm may buy a full evaluation until its early stage has STOPped. At any stage compute every candidate score from the pre-batch artifact, choose up to four strictly positive scores in descending score then lexical policy tuple, execute those distinct policies in lexical tuple order, and refit only after the whole batch. Early candidates are not-yet-early policies; full candidates are early-but-not-full policies. STOP a stage when no score is strictly positive or its 192/48 unique-policy maximum is reached. Unused capacity is recorded and never replaced by repeats.",
        "B_acquisition": "Fit the chosen surrogate to auxiliary plus paid data with input [six u values,ambient,initialOccupancy,restMultiplier,taskTime] before early purchase and append all available early features afterwards. Predict y=taskTime+5*finalDamage with Gaussian mean mu and sd sigma; survivalForest uses the mean and sample sd across its 128 tree predictions. Define muDamage=(mu-taskTime)/5 and sdDamage=sigma/5, hence safetyProb=Phi((-ln(0.82)-muDamage)/max(1e-12,sdDamage)). Set acquisition to negative infinity below safetyQuantile; otherwise use the candidate shared boAcquisition with incumbent equal to the smallest safe posterior mean among paid full policies. If none exists use the smallest posterior mean among reserve policies. Let rho2=max(0.05,min(1,PearsonCorr(auxiliary latestEarlyDamage,auxiliary finalDamage)^2)); earlyScore=max(0,acquisition)*rho2 and fullScore=acquisition. Apply twoStage.",
        "C_acquisition": "For each registered Nk component fit the shared GP to y=taskTime+5*finalDamage and censored survival, and normalize component weights proportional to exp(component censored log likelihood minus its maximum). The mixture y mean and variance include within- and between-component variance; every component's damage mean and sd are (muY-taskTime)/5 and sigmaY/5. Let residualVariance be the auxiliary y residual variance floored at 1e-12 and rho2 the same frozen auxiliary quantity as B. earlyScore=0.5*log(1+rho2*varianceY/residualVariance); fullScore=0.5*log(1+varianceY/residualVariance). Set either score to negative infinity when support distance exceeds the candidate threshold or mixture safety probability Pr(y<=taskTime+5*(-ln(0.82))) is below supportQuantile. Apply twoStage.",
        "finalSelection": "A assigns each full observation interval noisyDamage plus or minus 1.6448536269514722*0.002 DU and calls it safe only when the upper endpoint is <=-ln(0.82). B calls a full policy safe when its Gaussian safety probability is at least safetyQuantile and uses muDamage plus or minus 1.6448536269514722*sdDamage. C calls a full policy safe when support distance is accepted and mixture safety probability is at least supportQuantile. For every C policy draw 4096 posterior y samples: draw a component by cumulative normalized weight then one standard Normal, both from the analysis stream in sample-index order, transform damage=(y-taskTime)/5, and take type-7 5% and 95% damage quantiles. Each arm sorts its safe full policies by posterior mean taskTime+5*damage then lexical tuple, returns the first eight, and fills missing slots with ABSTAIN. No early-only policy may be returned."
      },
      "armAlgorithms": {
        "A": "Base scores are taskOnly=taskTime, linearEarly=ridgeQR prediction of final damage, thermalOnly=maximum early temperature/323, and damageOnly=latest observed early damage. Final score is baseScore+damageWeight*latestEarlyDamage; before purchase missing early fields use the corresponding auxiliary conditional mean. Execute common reserves, buy remaining early evaluations in ascending score then tuple until 192, then buy full evaluations among early policies in updated ascending score then tuple until 48; these deterministic positive ranks deliberately consume the maxima. Apply finalSelection.",
        "B": "censoredGP uses the shared censored GP; survivalForest uses the shared forest; earlyGP uses the shared GP on appended early features; safeBO uses the shared GP jointly on objective and damage safety. Run B_acquisition and twoStage with the selected EI/UCB/Thompson/entropy rule, then apply finalSelection. Every early/full purchase, fit, prediction and batch is charged.",
        "C": "ExposureState calendar uses [Ecal,Tmax], cycling uses [Ecyc,Tmax], kneeMixture uses [earlyDamage,slope] plus knee hypotheses, and allExposure concatenates all available fields. mixtureComponents=1 uses Nk=900; otherwise use that many inclusive logspace Nk values from 500 to 1300 cycles. Standardize features by auxiliary mean and population sd floored at 1e-12. Support distance is Euclidean distance to the nearest auxiliary feature vector and its threshold is the type-7 empirical supportQuantile of leave-one-out auxiliary nearest-neighbour distances. Run C_acquisition and twoStage, then apply finalSelection."
      },
      "ablationTransforms": ["noCalendar:zero Ecal feature","noKnee:use one no-knee component","hideReserveOutcomes:mask common reserve outcomes from C model but retain cost","noSupportAbstention:set support threshold infinity","policyIdLeakDiagnostic:add explicit candidate index on development only and forbid promotion"],
      "tuning": {
        "A": {"count": 16, "axes": [{"name":"score","values":["taskOnly","linearEarly","thermalOnly","damageOnly"]},{"name":"damageWeight","values":[0,0.25,0.5,1]}]},
        "B": {"count": 64, "axes": [{"name":"surrogate","values":["censoredGP","survivalForest","earlyGP","safeBO"]},{"name":"acquisition","values":["EI","UCB","Thompson","entropy"]},{"name":"safetyQuantile","values":[0.80,0.90,0.95,0.99]}]},
        "C": {"count": 64, "axes": [{"name":"exposureState","values":["calendar","cycling","kneeMixture","allExposure"]},{"name":"mixtureComponents","values":[1,2,4,8]},{"name":"supportQuantile","values":[0.80,0.90,0.95,0.99]}]}
      }
    }
  }
}
~~~

## Ten CPU-executable protocol specifications

### ECM-T01: Interface kinetics versus transport

- **Claim tested:** C-1530.
- **Question:** can explicit separation of charge-transfer boundary,
  transport, and terminal loss reduce unsafe overdrive or probing versus a
  mature nonlinear estimator/controller given identical terminal records?
- **DGP:** one seed contains 384 episodes of 300 s with $\Delta t=0.25$ s.
  Bulk and surface concentrations $c_b,c_s\in[25,1475]$ mol m$^{-3}$ follow a
  two-compartment model with
  $\tau_D\in[2,80]$ s. Faradaic current density is generated by the audit's
  Butler--Volmer form with $j_0\in[0.2,20]$ A m$^{-2}$,
  $\alpha_a\in[0.35,0.65]$, $\alpha_c=1-\alpha_a$, electron count $n=1$,
  $T\in[283,323]$ K, area
  $A\in[0.5,2]10^{-4}$ m$^2$, double-layer capacitance
  $C_{dl}\in[0.01,0.2]$ F, and series resistance $R_s\in[0.01,0.5]\ \Omega$.
  Episodes use steps, ramps, and PRBS commands inside $|V_{cmd}|\le0.35$ V.
  Compartment exchange conserves electrolyte material, while the registered
  Faradaic term explicitly removes or adds it; only the combined ledger is
  tested for closure. O integrates the registered implicit coupled state;
  clipping mass or charge is illegal.
- **Observations and authority:** A/B/C receive timestamped $V_{cmd}$,
  terminal $V$, terminal $I$, $T$, and a delayed noisy useful-flux assay every
  10 s. They share 32 KiB state, 24 optional assay probes, and the same command
  envelope/rate limit. $c_s,c_b,j_F,j_C$ and parameters are hidden.
- **Arms:** A maps $V_{cmd}$ to flux by static calibrated gain. B is the best of
  a 256/512-particle constrained nonlinear state-space filter plus MPC, a
  fourth-order neural-ODE observer with constrained MPC, and a gain-scheduled
  Hammerstein--Wiener model. C uses separate interfacial, capacitive,
  transport, and ohmic states with Bayesian parameter groups and the same MPC
  horizon. All probes and model bytes count.
- **Ablations:** collapse $c_s=c_b$; remove capacitive state; replace achieved
  overpotential with command; and give C the B static probe schedule.
- **Primary loss:** normalized sum
  $35e_{flux}+25e_{constraint}+15e_{cal}+15e_{probe}+10e_{latency}$.
  $e_{constraint}$ includes time above hidden $|j_F|$ and concentration limits;
  assays reveal violations only after action.
- **Primary resource:** assay probes [probe]. State, operations, command total
  variation [V], and constraint exposure [s] are protected.
- **Interventions:** independently vary $R_s,C_{dl},\tau_D,j_0,T$; exchange
  step/ramp/PRBS order; and include equal terminal curves generated by distinct
  kinetic/transport pairs.
- **Hostile transfer:** $\tau_D$ extends to 160 s, $j_0$ halves mid-episode,
  and $R_s$ drifts by 30%. No arm receives the change time.
- **Absolute gates:** constraint exposure $\le0.5$% episode-time, useful-flux
  NRMSE $\le0.12$, 90% interval coverage in [0.86,0.94], no mass/charge
  nonclosure, and no hidden-state access.
- **Challenge rule:** if A and O differ by less than 0.02 normalized flux error
  in at least 90% of confirmation episodes, the pack cannot identify the
  boundary and a valid non-rejection is `INCONCLUSIVE`.
- **Kill rule:** any advantage disappears if the strongest B reaches the same
  task/resource frontier or C's hidden structural prior is not declared and
  charged.
- **Artifacts:** episode parameters in oracle-only manifest; serialized
  observation bytes; commands; state/posterior hashes; probes; flux estimates;
  violations; conservation residuals; raw resources; and paired outcomes.

### ECM-T02: Finite diffusion memory

- **Claim tested:** C-1531.
- **Question:** does a boundary-qualified finite diffusion representation
  retain predictive memory more cheaply than dense history while avoiding an
  infinite Warburg extrapolation outside support?
- **DGP:** one seed contains 256 linear diffusion worlds on $z\in[0,L]$, with
  $L\in[10^{-6},10^{-3}]$ m, $D\in[10^{-14},10^{-9}]$ m$^2$ s$^{-1}$, input
  flux composed of 2--16 log-spaced sinusoids plus steps, and one of absorbing,
  reflecting, or mixed Robin far boundaries. O uses 256 eigenmodes and a
  Crank--Nicolson 512-cell cross-check on the twelve registered sentinels. Each world supplies 512 logarithmic
  time samples spanning $10^{-3}\tau_D$ to $10^2\tau_D$ with 0.1--2% Gaussian
  measurement noise.
- **Observations and authority:** arms receive only boundary flux and boundary
  response with timestamps, 16 KiB state, and 128 pre-freeze training samples.
  The remaining 384 input values and timestamps are public forecast support;
  their responses are withheld targets. Boundary type, $D,L$, modal
  coefficients, and $\tau_D$ are hidden. This is a passive track: the action
  menu is empty and the action budget is zero.
- **Arms:** A is AR(1) plus a semi-infinite $\omega^{-1/2}$ tail. B is the
  development-best balanced/vector-fitted stable state-space model of order
  2/4/8/16/32 or regularized ARX with 8/16/32/64 lags. C is a nonnegative
  finite diffusion-kernel bank with absorbing/reflecting/mixed candidates and
  evidence-weighted boundary selection. Kernel and posterior bytes count.
- **Ablations:** force semi-infinite kernel; remove boundary selector; halve
  kernel support; and replace convolution by its one-step Markov state.
- **Primary loss:** $45e_{forecast}+25e_{low-f}+15e_{step-tail}+15e_{cal}$,
  evaluated on unseen inputs and times. Low-frequency extrapolation is scored
  separately from in-band fit.
- **Primary resource:** persistent state [B]. Operations, retained history [B],
  latency [s], and interval coverage are protected.
- **Interventions:** boundary swaps at fixed $D,L$; equal $\tau_D$ from
  different $D,L$; narrow versus wide excitation; and withheld long rests.
- **Hostile transfer:** the observed band shifts down by a decade, the far
  boundary changes from reflecting to mixed, and input pulses become sparse.
- **Absolute gates:** normalized forecast RMSE $\le0.15$, low-frequency bias
  $\le0.08$, 90% coverage in [0.85,0.95], stable poles only, and modal/PDE
  reference agreement within $10^{-5}$.
- **Challenge rule:** at least 25% of worlds must show a far-boundary turnover
  inside confirmation support; otherwise boundary identification is
  `INCONCLUSIVE`.
- **Kill rule:** C fails if vector fitting/balanced realization matches its
  frontier, if its inferred kernel extends beyond support without calibrated
  uncertainty, or if dense history is cheaper.
- **Artifacts:** inputs; responses; boundary oracle; mode tails; fitted poles
  and kernels; support maps; state bytes; predictions; residuals; and paired
  losses/resources.

### ECM-T03: Impedance validity before interpretation

- **Claim tested:** C-1532.
- **Question:** can a Kramers--Kronig validity gate prevent confident
  interpretation of drifted or nonlinear spectra without mistaking compliant
  data for a unique mechanism?
- **DGP:** one seed contains 512 complex spectra at 61 log-spaced frequencies
  from $10^{-3}$ to $10^4$ Hz. The registry fixes five disjoint evaluator
  classes: valid identifying, valid but terminal-equivalent, schema/provenance
  invalid, linear-KK inconsistent, and nonlinear/out-of-scope. Timestamp,
  frequency-set, unit/checksum, and calibration-version corruptions are
  schema/provenance failures and are never credited to a KK test. Drift and
  unsettled records test linear-KK consistency. Cubic records require the
  registered amplitude and third-harmonic observations. Thus no arm is
  penalized for an undetectable cause under its available bytes.
- **Observations and authority:** all arms receive frequency, complex
  impedance, timestamp, acquisition ordinal, amplitude, unit token, checksum,
  and calibration version; 32 KiB state; plus the same nine-bundle diagnostic
  menu. Each bundle buys a long-wait repeat at 20 mV and fundamental/third-
  harmonic data at 10 and 20 mV. Cause, validity, graph, and equivalence class
  are hidden.
- **Arms:** A fits the lowest-AIC circuit and always reports a mechanism. B is
  the best of robust residual/change-point diagnostics plus passive rational
  vector fitting and a held-frequency predictive check. C performs Boukamp-
  style linear Kramers--Kronig residual validation, frozen power calibration,
  then reports `invalid`, `valid-nonidentifying`, or a calibrated candidate
  set. Candidate circuit fitting after the gate is identical to B.
- **Ablations:** remove gate; treat every compliant spectrum as uniquely
  identifying; remove finite-band power calibration; and shuffle acquisition
  order before the gate.
- **Primary loss:** $35e_{invalid}+20e_{false-reject}+25e_{overclaim}+10e_{candidate}+10e_{fit}$,
  with overclaim highest whenever equivalent
  graphs are assigned one physical mechanism.
- **Primary resource:** mechanism fits attempted [fit]. Acquisition bytes,
  state, operations, abstention, false rejection, and latency are protected.
- **Interventions:** cause and severity factorial; frequency truncation; noise
  level; sweep direction; equivalent circuits; and valid high-complexity
  distributions.
- **Hostile transfer:** invalidity combines mild drift and mild nonlinearity,
  the frequency band loses both end decades, and noise becomes correlated
  complex Gaussian with unknown correlation length.
- **Absolute gates:** invalid recall $\ge0.85$, valid specificity $\ge0.90$,
  equivalent-graph unique-overclaim $\le0.01$, candidate-set coverage
  $\ge0.90$, and no validity label leakage.
- **Challenge rule:** if oracle invalid and valid residual distributions have
  AUROC below 0.65 even at full support, detection is underidentified and a
  valid non-rejection is `INCONCLUSIVE`.
- **Kill rule:** compliance may never be scored as mechanism truth; C fails if
  B's held-frequency/change-point gate is equally safe and cheaper.
- **Artifacts:** acquisition manifest; complex spectra; invalid cause oracle;
  linear-KK bases/residuals; power curves; circuit equivalence classes;
  candidate sets; decisions; fits/resources; and paired outcomes.

### ECM-T04: Regularised time-distribution resolution

- **Claim tested:** C-1533.
- **Question:** can a resolution-certified DRT/DDT recover only supported
  timescale structure and reduce acquisition or inference cost versus mature
  regularised inversions and parametric predictors?
- **DGP:** one seed contains 384 spectra with 1--4 nonnegative log-time peaks
  on $\tau\in[10^{-5},10^5]$ s. Peaks are Gaussian in $\log_{10}\tau$ with widths
  0.05--0.8 decades and separations 0.1--3 decades. The balanced generator
  assigns one third each to relaxation, reflective finite diffusion, and
  transmissive finite diffusion kernels.
  Every arm starts with the identical 21-point minimal grid and may buy at
  most 24 points from the public 140-point completion pool; the evaluator
  retains an 80-point holdout. Heteroscedastic complex noise is 0.05--3%.
  O evaluates 2048 log-time nodes.
- **Observations and authority:** arms receive the same complex samples,
  uncertainties, kernel family candidate set, and 64 KiB state. True peak
  count, locations, amplitudes, and resolvability are hidden. Optional extra
  frequencies are active probes, capped at 24 for all arms.
- **Arms:** A smooths a Nyquist curve and peak-picks curvature. B is the best
  of NNLS Tikhonov with $I,D_1,D_2$ penalty, sparse nonnegative LASSO, and
  parametric circuit/DDT mixtures chosen by nested development validation. C
  uses the same inverse library plus a frozen resolution matrix, perturbation
  bootstrap, peak-merging rule, and value-of-information selection of optional
  frequencies. If B plus a certificate is equivalent, C has no novelty.
- **Ablations:** omit certificate; report the maximum apparent peak count;
  fix $\lambda$ across noise levels; and disable active frequencies.
- **Primary loss:** $35e_{forward}+30e_{peak-set}+20e_{coverage}+15e_{instability}$.
  Peak-set error uses optimal transport in log-time with
  an explicit false-peak penalty; unresolvable pairs have one merged target.
- **Primary resource:** acquired frequency points [sample]. State, operations,
  regularisation fits, artifact bytes, false peaks, and coverage are protected.
- **Interventions:** sweep separation/width/noise/band; wrong relaxation versus
  diffusion kernel; delete edge decades; and perturb every sample within its
  declared uncertainty.
- **Hostile transfer:** peaks become skewed, kernel families mix in one
  spectrum, calibration noise is correlated, and two peaks move just below the
  development resolution threshold.
- **Absolute gates:** forward NRMSE $\le0.08$, resolvable-peak recall
  $\ge0.80$, false peaks $\le0.10$ per spectrum, 90% location coverage in
  [0.85,0.95], and at least 95% below-resolution pairs merged/abstained.
- **Challenge rule:** confirmation must contain at least 64 cases in each of
  resolvable, boundary, and unresolvable separation strata; otherwise the
  certificate is `INCONCLUSIVE`.
- **Kill rule:** a prettier or sparser distribution is not a pass; C fails if
  regularised B or a direct downstream predictor reaches the same frontier.
- **Artifacts:** true distributions; kernels; frequency selections; spectra;
  regularisation paths; resolution matrices; bootstrap perturbations; peak
  sets/intervals; predictions; and raw resource vectors.

### ECM-T05: Rate-dependent phase regime

- **Claim tested:** C-1534.
- **Question:** can a regime-qualified structural policy avoid unnecessary
  split/merge actions when drive suppresses phase separation, without turning
  domain formation into task or intelligence credit?
- **DGP:** one seed contains 96 one-dimensional reaction--phase-field worlds
  on 128 cells with dimensionless occupancy $x\in[0,1]$, double-well depth
  $a\in[0.5,2]$, gradient coefficient $\kappa\in[10^{-5},10^{-3}]$, mobility
  $M\in[0.1,2]$, and imposed normalized drive $r\in[0.01,5]$. O uses 256 cells
  and half timestep. A separately drawn bit $g$, independently permuted against
  morphology, determines whether the registered structure statistic changes
  split productivity for a separately generated two-skill load. Therefore a
  phase domain has no task meaning unless the hidden synthetic coupling makes
  it useful and the resulting service outcome is scored.
- **Observations and authority:** all arms receive mean occupancy, drive,
  the registered source integral, noisy variance/structure-factor samples every 20 steps, and
  task demand. They share 48 KiB state and 16 structural split/merge actions.
  Full field and true stability boundary are hidden.
- **Arms:** A always splits when variance exceeds one static threshold. B is a
  development-best hybrid mode detector plus constrained MPC/topology policy,
  with change-point and hysteresis guards. C uses an identified
  drive--size--coupling regime map, uncertainty gate, and explicit structural
  cost. Both B/C can decide no split.
- **Ablations:** remove drive from regime map; force equilibrium phase rule;
  remove size/coupling; and remove uncertainty abstention.
- **Primary loss:** $35e_{task}+25e_{wrong-structure}+20c_{churn}+10e_{recovery}+10e_{cal}$.
- **Primary resource:** structural actions [action]. State, sensing,
  construction CU, idle capacity CU, and recovery time [s] are protected.
- **Interventions:** rate/size sweeps through the stability boundary; identical
  mean occupancy with different fields; task-demand swaps independent of
  phase; and forced domain erasure.
- **Hostile transfer:** free-energy asymmetry appears, boundaries become
  wetting-biased, and task demand decorrelates from phase statistics.
- **Absolute gates:** task excess loss versus oracle $\le0.10$, unsupported
  split rate $\le0.03$, missed-needed split rate $\le0.05$, and field
  source-aware mass-balance/numerical closure.
- **Challenge rule:** at least 30% of confirmation worlds must cross a
  rate-dependent morphology boundary; otherwise regime value is
  `INCONCLUSIVE`.
- **Kill rule:** domain count alone never scores positively; C fails if hybrid
  B matches it or if a phase label is leaked as a task label.
- **Artifacts:** field/oracle checkpoints; structure factors; task series;
  observations; regime posteriors; actions; construction/idle ledgers;
  convergence studies; and paired outcomes.

### ECM-T06: Passivation with inventory and resistance

- **Claim tested:** C-1535.
- **Question:** can a stateful adaptive barrier reduce cumulative downstream
  damage after formation inventory, resistance, cracking, maintenance, and
  replacement are charged?
- **Source boundary:** layer formation, inventory loss, resistance, continued
  growth, and regime change are source-derived. Crack, repair, and replacement
  variables below are synthetic hostile engineering stressors, not battery
  findings or a physical-cell model.
- **DGP:** one seed contains 384 services over $H=20,000$ s. Hidden barrier
  thickness $h\in[0.25,20]$ synthetic $\mu$m follows the registered reaction/
  diffusion/migration regime toy law plus a separately charged commanded
  build rate. Immediate parasitic damage rate falls as
  $\exp(-h/h_p)$; useful throughput falls through
  $R_f=\rho_f h/A$. Synthetic stress pulses cause cracks with hazard depending on
  throughput slew and $h$. Every positive endogenous or commanded layer-volume
  increment consumes the registered $q_h$ [CU m$^{-3}$]; repair exposes the
  service for 1--20 s. Parameters shift among reaction-, diffusion-, and
  migration-limited worlds.
- **Observations and authority:** A/B/C receive request load, achieved
  throughput, terminal resistance proxy, delayed damage alarms, maintenance
  history, and inventory balance. They share 16 KiB state, identical
  throttling, inspection, build/repair authority, and 200 CU initial inventory.
  $h$, regime, crack state, and prospective damage are hidden.
- **Arms:** A runs without persistent barrier and reacts after alarms. B is the
  best robust rate limiter plus checkpoint/rollback or age-based preventive
  maintenance controller. C estimates barrier state and selects bounded
  build/hold/repair/replace actions by lifecycle MPC with all layer costs.
- **Ablations:** free formation inventory; omit resistance; omit cracks; fixed
  maximum barrier; and remove state inspection.
- **Primary loss:** $35d_{cum}+20e_{service}+15c_{inventory}+15c_{maintenance}+15e_{catastrophic}$.
- **Primary resource:** total lifecycle CU. Damage DU, unavailable time [s],
  inventory, state, probes, repairs, replacements, and throughput are
  protected.
- **Interventions:** change growth regime, damage permeability, load slew,
  crack hazard, inventory price, and recovery deadline; include cases where no
  barrier or a fixed limiter is optimal.
- **Hostile transfer:** cracks become correlated, resistance doubles per unit
  thickness, and protective benefit saturates earlier. No retuning.
- **Absolute gates:** catastrophic-damage rate $\le0.01$, service availability
  $\ge0.95$, inventory never negative, every build/repair closes within
  $10^{-8}$ CU, and no free layer state.
- **Challenge rule:** if no-barrier and oracle lifecycle loss differ by less
  than 5% on development and confirmation, barrier value is `INCONCLUSIVE`.
- **Kill rule:** C fails if formation, latency, or crack costs are omitted or a
  stateless rate-limit/rollback B is equally good and cheaper.
- **Artifacts:** hidden layer/regime/crack paths; observation stream; actions;
  inventory, resistance, damage, maintenance, and service ledgers; state
  snapshots; counterfactuals; and paired outcomes.

### ECM-T07: Depletion before ramified growth

- **Claim tested:** C-1536.
- **Question:** can a local depletion-and-geometry gate prevent runaway growth
  more efficiently than global mean-load control under equal sensing and
  throughput authority?
- **DGP:** one seed contains 64 nondimensional worlds. A closed binary-carrier
  Poisson--Nernst--Planck surrogate on 128 finite volumes evolves $c_+,c_-$ and
  $\phi$ under dimensionless drive $u\in\{0,0.25,0.5,1,2,3\}$. Equal cation
  flux enters and leaves the electrolyte, anions are blocking, potential has
  registered Dirichlet boundaries, and the anode-reserve/deposit/front ledger
  conserves every transferred unit. After receiving-edge anion concentration
  crosses 0.05, the 64x64 perimeter-growth bias triples. O uses doubled spatial,
  temporal, and front resolution and records depletion, ramified area, tip
  concentration, and first top-row contact.
- **Observations and authority:** arms receive global drive, voltage proxy,
  throughput, the mandatory 16-bin front-height sketch, and the same adaptive
  menu of 32 concentration sites. An action can buy zero to eight sites per
  decision with 320 total probes. They share 24 KiB state and the registered
  drive/slew/stop actions. Full fields and depletion time are hidden.
- **Arms:** A throttles on global mean voltage/current. B is robust queue/load
  control with a constrained state-space concentration observer and worst-case
  safety margin. C uses local depletion posterior plus front-curvature risk and
  receding-horizon control. Probe location is an action and charged for B/C.
- **Ablations:** mean concentration only; remove geometry; remove depletion;
  fixed uniform probes; and use an unqualified $(c_0/j)^2$ timer.
- **Primary loss:** $40e_{contact}+25a_{ramified}+20e_{throughput}+10e_{false-stop}+5e_{cal}$.
- **Primary resource:** concentration probes [probe]. Throughput, state,
  messages, operations, stopped time, and unsafe exposure are protected.
- **Interventions:** factorial drive/concentration/mobility/blocking/geometry;
  identical global mean with different edge depletion; seeded protrusions; and
  probe dropout.
- **Hostile transfer:** mobility ratio leaves development range, a declared
  matched partial anion flux replaces blocking, and two off-axis protrusions
  compete.
- **Absolute gates:** short-contact rate $\le0.01$, ramified area fraction
  $\le0.05$, throughput at least 75% of oracle-safe throughput, false-stop rate
  $\le0.10$, and carrier/field closure.
- **Challenge rule:** at least 64 confirmation worlds must deplete and 64 must
  remain supported under oracle-safe operation; otherwise discrimination is
  `INCONCLUSIVE`.
- **Kill rule:** no universal dendrite claim is allowed; C fails if robust B
  matches it or if local-field truth rather than paid probes enters C.
- **Artifacts:** DGP parameters; fields separated from arm observations;
  probe requests/values; front masks/sketches; controller state; throughput;
  depletion/contact events; closure residuals; and paired outcomes.

### ECM-T08: Identifiability-aware excitation

- **Claim tested:** C-1537.
- **Question:** can an identifiability-aware experiment recover only supported
  parameter groups, reduce redundant excitation, and avoid semantic claims in
  null-space directions?
- **DGP:** one seed contains 256 stable single-particle-inspired grouped
  state-space systems. Eight positive base parameters enter terminal voltage
  only through four public group functions, two diffusion-rate groups
  [s$^{-1}$] and two resistance groups [$\Omega$], plus an open-circuit curve
  whose slope contains flat, moderate, and steep regions. Current inputs are bounded by
  $|I|\le2$ A and $|dI/dt|\le1$ A s$^{-1}$. Voltage noise is 0.2--5 mV,
  temperature is 298 K, and each experiment has 600 s with $\Delta t=1$ s. O
  evaluates the exact linear transition. Some worlds add a small electrolyte
  pole absent from the fitted model.
- **Observations and authority:** arms receive current, voltage, time, and the
  public fitted-model equations and the same public four-group dictionary.
  They share 64 KiB state, 1,800 s total excitation, identical amplitude/slew
  limits, and the same optional 12-reading $q_1/q_2$ sensor menu. True base
  parameters, group values, misspecification, and OCV slope state are hidden.
- **Arms:** A uses one fixed PRBS then fits all eight original parameters by
  least squares. B is rank-revealing D-optimal sequential design with profile
  likelihood and grouped-parameter reporting when rank deficient. C uses the
  same mature design family plus the public group dictionary, online
  sensitivity-nullspace stop rule, and a choice between more excitation,
  coarser group report, or abstention. If B already does this equivalently, C
  must fail on novelty/resource superiority.
- **Ablations:** fit originals despite rank loss; remove OCV-slope guard;
  random excitation; and disable misspecification residual check.
- **Primary loss:** $30e_{group}+25e_{coverage}+20e_{semantic}+15e_{prediction}+10e_{constraint}$,
  where $e_{semantic}$ penalizes confident
  original-parameter claims along oracle null directions.
- **Primary resource:** excitation duration [s]. Current variation [A], probes,
  state, operations, prediction error, and unsafe/unsupported claims are
  protected.
- **Interventions:** OCV slope strata; parameter symmetries; noise; pulse,
  multisine, and PRBS candidates; rank-changing sensors; and small model
  mismatch.
- **Hostile transfer:** OCV flat regions lengthen, an electrolyte pole grows,
  and two parameter groups become nearly collinear. No model repair.
- **Absolute gates:** supported-group median relative error $\le0.15$, 90%
  interval coverage [0.85,0.95], unsupported original-parameter claim rate
  $\le0.01$, input constraints never violated, and held-input voltage NRMSE
  $\le0.10$.
- **Challenge rule:** at least one singular-value ratio must cross each frozen
  rank tolerance in 20% of confirmation worlds; otherwise rank handling is
  `INCONCLUSIVE`.
- **Kill rule:** low voltage residual is not identification. C fails on parity
  with rank-revealing B or if it reports source parameter names for group-only
  estimates.
- **Artifacts:** original/group parameters; OCV curve; currents/voltages;
  sensitivity matrices and singular values; design decisions; profile
  likelihoods; intervals; semantic claims; residual checks; and resources.

### ECM-T09: Path-dependent apparent equilibria

- **Claim tested:** C-1538.
- **Question:** when equal scalar occupancy hides relay/population state, what
  is the smallest charged representation that predicts major and minor loops
  across reversals and rests?
- **DGP:** one seed contains 384 ensembles of 128--2048 bistable particles.
  Each particle has insertion/removal thresholds drawn from a correlated
  bivariate Gaussian mixture; observation voltage is an occupancy-weighted
  mean plus interaction and 0.2--3 mV noise. Schedules contain full ramps,
  1--12 minor-loop reversals, 10--1000 s rests, and rate-dependent lag that can
  mimic hysteresis. O records every relay and separates persistent threshold
  memory from finite-rate relaxation.
- **Observations and authority:** all arms receive scalar occupancy, current,
  voltage, temperature, and timestamps; 32 KiB state; no relay labels. They
  receive the exact next 32 current/temperature values and predict all next 32
  voltages with calibrated intervals. Temperature shifts both thresholds and
  the registered finite-rate relaxation time; it is not an unused covariate.
- **Arms:** A uses a single-valued voltage--occupancy curve. B is the best of a
  direction-bit state-space model, width-8/16/32/64 GRU, and sparse Preisach
  model under equal bytes. C stores a 8/16/32/64-bin charged/discharged population
  histogram plus relaxation state and uncertainty. Model parameters count.
- **Ablations:** scalar occupancy only; direction bit only; remove population
  distribution; remove relaxation; and reset history after every rest.
- **Primary loss:** $40e_{voltage}+25e_{minor-loop}+20e_{reversal}+15e_{cal}$.
- **Primary resource:** persistent path state [B]. Operations, update writes,
  latency, major-loop error, minor-loop error, and interval width are protected.
- **Interventions:** equal occupancy reached by different paths; reversal depth;
  rest duration; rate; particle-count/distribution; and threshold-correlation
  changes.
- **Hostile transfer:** mixture gains a third threshold population, reversal
  density doubles, and relaxation time moves outside development support.
- **Absolute gates:** voltage NRMSE $\le0.08$, reversal bias $\le0.05$
  normalized, 90% coverage [0.85,0.95], no state-cap violation, and finite-rate
  lag is not labelled persistent hysteresis when the rest test removes it.
- **Challenge rule:** at least 96 confirmation schedules must revisit the same
  occupancy from paths whose oracle voltages differ by more than five noise
  standard deviations; otherwise path sufficiency is `INCONCLUSIVE`.
- **Kill rule:** C fails if a direction bit or GRU reaches the same frontier,
  if state is reset before scoring hostile minor loops, or if full history is
  stored outside the byte ledger.
- **Artifacts:** relay oracle; schedules; serialized observations; state
  snapshots; path histograms; GRU/Preisach models; predictions/intervals;
  reversal/rest labels; writes/bytes; and paired outcomes.

### ECM-T10: Delayed-degradation-aware policy search

- **Claim tested:** C-1539.
- **Question:** can exposure-aware early prediction and safe policy search
  reduce full-horizon evaluations without selecting policies that incur hidden
  delayed damage or fail under chemistry/temperature transfer?
- **DGP:** one seed creates 256 candidate six-stage policies. Each policy has
  immediate task time, thermal exposure, state exposure, and hidden damage from
  calendar, cycling, and knee mechanisms. A trajectory has 1,500 normalized
  cycles plus rest intervals; early features appear at cycles 50 and 100, while
  final damage and survival appear at 1,500. Four chemistry families change
  exposure coefficients, interaction signs, noise, and knee thresholds.
  Temperature is 283--323 K and initial state 0.1--0.9. Some early features
  correlate spuriously with policy ID in development only.
- **Observations and authority:** arms receive policy parameters, declared
  temperature/state, immediate task outcome, early features for executed
  policies, right-censored survival, and final outcomes only for paid
  full-horizon evaluations. They share 256 KiB state, 192 early evaluations,
  48 full-horizon evaluations that must be a subset of those 192, four parallel
  slots, and identical safety constraints. The eight reserve policies are
  sampled before any outcome and count in both budgets. Mechanism, future
  outcome, chemistry transfer flag, explicit candidate index, and
  counterfactuals are hidden; the parity feature derived from visible policy
  parameters is an intentional support-shift stressor, not secret-ID leakage.
- **Arms:** A ranks immediate task time and ignores delayed damage. B is the
  best mature censored-survival/early-prediction Gaussian process with safe
  Bayesian optimisation and conservative early stopping. C adds an explicit
  calendar/cycling exposure state, mixture uncertainty over knee mechanisms,
  and support-distance abstention. The same eight precommitted reserve
  full-horizon trials are mandatory for A/B/C and included in the 48. All
  modelling and trials count.
- **Ablations:** remove calendar exposure; remove knee mixture; remove reserve
  outcomes from the model input while retaining their cost; remove support
  abstention; and expose policy ID only in a development leakage diagnostic.
- **Primary loss:** $30e_{final-task}+35d_{final}+20e_{unsafe-select}+15e_{rank}$
  on the selected top-eight policy set.
- **Primary resource:** full-horizon evaluations [evaluation]. Early
  evaluations, state, operations, wall scheduling, unsafe selections,
  abstentions, reserve allocation, and interval coverage are protected.
- **Interventions:** independently vary calendar rest, state exposure,
  temperature, knee threshold, censoring, early-feature signal, and policy-ID
  confounding; include worlds where the immediate fastest policy is safe.
- **Hostile transfer:** chemistry family is held out, temperature rises 10 K,
  early-feature sign reverses for one mechanism, and knee onset moves 30%
  earlier. Frozen arms may abstain but not retrain.
- **Absolute gates:** unsafe selected-policy rate $\le0.02$, top-eight final
  regret $\le0.15$ normalized, 90% final-damage coverage [0.85,0.95], all eight
  reserve trials executed, no explicit candidate-index or counterfactual
  leakage, and no budget overrun.
- **Challenge rule:** at least 20% of candidate pairs must reverse ranking
  between cycle 100 and 1,500 and each seed must contain at least one knee;
  otherwise delayed selection is `INCONCLUSIVE`.
- **Kill rule:** early accuracy is not lifetime validation. C fails if safe BO
  B matches its frontier, reserve trials are excluded from cost, survivors are
  uncensored incorrectly, or hostile transfer produces confident reuse rather
  than calibrated abstention.
- **Artifacts:** policy table; chemistry/mechanism oracle; early/final
  trajectories in separated files; censoring records; exposure features;
  surrogate versions; acquisition decisions; reserve trials; selected sets;
  final regret/damage; budgets; and paired outcomes.

## Cross-track hostile-transfer matrix

| Track | Frozen support change | Mandatory exposed failure |
| --- | --- | --- |
| ECM-T01 | slower transport, kinetic drift, series-loss drift | command is no longer achieved flux |
| ECM-T02 | lower band, boundary swap, sparse pulse train | infinite memory extrapolation fails |
| ECM-T03 | combined mild invalidities, truncated band, correlated noise | validity power and non-identification are visible |
| ECM-T04 | skewed/mixed peaks below resolution | merge or abstain, never invent peaks |
| ECM-T05 | asymmetric energy, wetting boundary, demand decoupling | morphology earns no task credit |
| ECM-T06 | correlated cracks, stronger resistance, early saturation | protection cost and failure remain visible |
| ECM-T07 | mobility/boundary shift, competing protrusions | local support uncertainty is exposed |
| ECM-T08 | flat OCV, model pole, collinear groups | semantic parameter claims stop |
| ECM-T09 | new relay population, dense reversals, slow relaxation | minimal state must generalize or fail |
| ECM-T10 | held-out chemistry, hotter operation, proxy reversal, earlier knee | reuse abstains or fails safely |

## Required result schema

Each track writes one canonical JSON Lines record per `(phase, seed, arm)` plus
immutable binary/CSV arrays referenced by SHA-256. Required fields are:

1. fixture, audit snapshot, protocol, phase, seed commitment/reveal, arm,
   configuration hash, code/runtime/workstation hashes, start/end UTC, and
   terminal state;
2. raw task and protected outcomes with value, unit, numerator, denominator,
   normalization scale, missingness reason, and finite/nonfinite flag;
3. state, messages, probes, samples, fits, actions, evaluations, operations,
   CPU, wall, RSS, I/O, artifact, construction, maintenance, reserve, damage,
   failure, fallback, and abstention ledgers;
4. model/operator version, observation-field access log, parameter/kernel/
   circuit/state bytes, solver tolerances/iterations, numerical residuals, and
   conservation closure;
5. paired contrasts, raw and Holm-adjusted $p$, one-sided bounds, effect sizes,
   sensitivity result, protected gates, ablations, transfer gates, and
   machine-readable kill reason; and
6. explicit flags `physical_energy_measured=false`,
   `physical_cell_experiment=false`, `legal_conformity_evidence=false`, and
   `architecture_novelty_established=false`.

No summary may replace the raw per-seed records. Missing artifacts, units, or
protected axes make the affected track `INVALID`.

## Track-level terminal-state rules

1. A `PASS` requires confirmation and hostile transfer, selected C-versus-B
   route, every absolute/protected gate, every component ablation, valid
   sensitivity, all ledger closures, and zero undeclared oracle access.
2. A valid informative miss, including equality with B, is `FAIL`.
3. A challenge-floor or frozen-power miss is `INCONCLUSIVE`; it cannot be used
   after seeing the result to avoid `FAIL`.
4. Broken commitments, leakage, numerical-reference failure, excess generator
   failure, missing artifacts, unit ambiguity, or post-freeze change is
   `INVALID`.
5. Track states do not average. Nine passes and one failure remain nine passes
   and one failure; no suite-wide scalar can conceal ECM-T03 overclaim,
   ECM-T06 uncharged inventory, ECM-T07 short contact, ECM-T08 semantic
   non-identifiability, or ECM-T10 unsafe delayed damage.

## Implementation and artifact boundary

Implementation order is ECM-T03, ECM-T08, ECM-T02, ECM-T04, ECM-T09,
ECM-T01, ECM-T06, ECM-T07, ECM-T05, then ECM-T10: first validate observation
and inverse boundaries, then memory/state, then control/degradation. Before any
private reveal, independently review generator equations, units, oracle
separation, mature B arms, configuration grids, compute caps, conservation,
challenge floors, and artifact hashes.

F-025 stops at a complete experiment contract. It creates no runner, dataset,
result, plot, physical apparatus, safety recommendation, standard claim,
central claim entry, bibliography entry, routing entry, concept prose, or
architecture promotion.

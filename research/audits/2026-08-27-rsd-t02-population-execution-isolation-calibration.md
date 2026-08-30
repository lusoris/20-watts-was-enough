# RSD-T02 population execution, isolation, and calibration diagnostics

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-27
- **Question:** which public-development execution boundaries can now be
  exercised across the complete parameterized panel, and which gates still
  prevent a comparison?
- **Scope:** deterministic population traversal, per-instance policy
  isolation and durable recovery, and synthetic transcript calibration of the
  exact four-hypothesis analyzer
- **Claims touched:** [C-1565](../claims.md#c-1565),
  [C-1567](../claims.md#c-1567), and [C-1568](../claims.md#c-1568)
- **Evidence role:** executable method and integrity audit; no empirical model
  result
- **Authority:** `NO_RESULT`; scientific power, comparison inference, claim
  eligibility, confirmation, workstation measurement, and energy authority
  remain false

## Executive finding

Four execution questions now have executable public-development foundations:

1. Can every unique fixed-parameter instance be traversed without counting
   episodes, rows, realizations, or procedural labels as independent systems?
2. Can one fixed packet cross a content-addressed policy boundary in a fresh
   restricted process and resume from an ownership-bound disk ledger?
3. Can that isolated durable path traverse all 20 canonical instances and
   recover the instance-complete/outer-append crash window exactly once?
4. Does the exact registered bootstrap/Holm method behave acceptably under
   explicit synthetic null, alternative, and degeneracy scenarios?

The answer is now testable in code, but it is not yet a model comparison. The
population runner remains receipt-only; the isolated policy deliberately
returns deterministic abstentions; and the calibration distributions are
constructed method checks rather than reviewed pilot data. After independent
hostile review, only the narrow
`validated-parameterized-transcript-policy-resource-runner` infrastructure gate
is promoted. Model maturity, endpoint comparison, confirmation, claim and
energy authority remain closed.

## 1. The scientific unit stays the system instance

The public development panel crosses five registered equation families with
four conformance draw indices. Canonical deduplication therefore yields 20
fixed-parameter system instances. Each instance contains 26 intervention
episodes and nine registered arm invocations, but those nested observations do
not enlarge the scientific denominator.

For family $f$, let $\mathcal I_f$ contain its unique validated canonical
instance identities. The design weights are

$$
w_f=\frac{1}{5},
\qquad
w_{i\mid f}=\frac{1}{|\mathcal I_f|}=\frac{1}{4}.
$$

These are frozen aggregation metadata only. There are no endpoint values to
aggregate yet.

### Complete-panel workload receipt

The deterministic complete panel produces the following construction workload:

| Unit | Exact public-development count |
| --- | ---: |
| canonical system instances | 20 |
| episodes and realizations | 520 |
| transcript sample rows | 799,240 |
| input commands | 3,760 |
| simulation internal steps | 12,779,520 |
| RK4 derivative evaluations | 51,118,080 |
| registered arm invocations | 180 |
| arm sample-row reads | 7,193,160 |
| declared arm scalar operations | 21,579,480 |

These counts describe deterministic construction work. They are not latency,
memory, joules, accuracy, statistical information, or evidence of a useful
policy.

The population artifact stores content-addressed receipts and derived workload
counts, not the 20 full causal-view payloads. Imported prefixes are accepted
only after deterministic replay against the frozen design, registry, instance
plan, and fixed-instance runner inputs. Its internal hash chain detects content
or ordering changes relative to a trusted artifact, but it is explicitly not a
rollback-proof append-only authority without an externally retained head.

Machine-readable files:

- [`configs/rsd-t02-public-development-population-runner.json`](../../experiments/workstation/fixture-026/configs/rsd-t02-public-development-population-runner.json)
- [`rsd-t02-public-development-population-runner.schema.json`](../../experiments/workstation/fixture-026/rsd-t02-public-development-population-runner.schema.json)
- [`rsd-t02-public-development-population-runner.mjs`](../../experiments/workstation/fixture-026/rsd-t02-public-development-population-runner.mjs)
- [`rsd-t02-public-development-population-runner.test.mjs`](../../experiments/workstation/fixture-026/rsd-t02-public-development-population-runner.test.mjs)

## 2. One fixed packet can cross an isolated durable boundary

The fixed-instance overlay binds three executable identities:

1. the existing fixed-instance transcript runner configuration;
2. a content-addressed 26-projection policy bundle; and
3. the restricted worker source that loads and evaluates that exact bundle.

The parent constructs and validates the full packet and causal view, then starts
a fresh Node child. The policy receives only the allowlisted causal view. It
does not receive evaluator truth, family or equation identity, registry
metadata, environment variables, a clock, randomness, networking, writable
filesystem access, or dynamic-code authority. The current policy returns a
deterministic nine-arm abstention bank; semantic replay binds the child response
to the packet and bundle.

The durable layer uses an exclusive owner-bound lease, LF-delimited JSON
records, per-record file synchronization, a hash chain, and an atomically
replaced checkpoint. Raw-ledger reconstruction remains authoritative if the
checkpoint is missing or stale. A torn tail, altered record, foreign owner,
path alias, redirected ledger leaf, oversized recovery input, or deterministic
replay mismatch fails closed.

Durability is deliberately scoped. Requested file synchronization is recorded;
survival of every possible hardware, controller, filesystem, or operating-system
failure is not claimed.

Machine-readable files:

- [`configs/rsd-t02-fixed-instance-isolated-durable.json`](../../experiments/workstation/fixture-026/configs/rsd-t02-fixed-instance-isolated-durable.json)
- [`rsd-t02-fixed-instance-conformance-policy.source.js`](../../experiments/workstation/fixture-026/rsd-t02-fixed-instance-conformance-policy.source.js)
- [`build-rsd-t02-fixed-instance-conformance-policy.mjs`](../../experiments/workstation/fixture-026/build-rsd-t02-fixed-instance-conformance-policy.mjs)
- [`rsd-t02-fixed-instance-conformance-policy-worker.mjs`](../../experiments/workstation/fixture-026/rsd-t02-fixed-instance-conformance-policy-worker.mjs)
- [`rsd-t02-fixed-instance-durable-store.mjs`](../../experiments/workstation/fixture-026/rsd-t02-fixed-instance-durable-store.mjs)
- [`rsd-t02-run-lock.mjs`](../../experiments/workstation/fixture-026/rsd-t02-run-lock.mjs)
- [`rsd-t02-fixed-instance-isolated-durable-runner.mjs`](../../experiments/workstation/fixture-026/rsd-t02-fixed-instance-isolated-durable-runner.mjs)
- [`rsd-t02-fixed-instance-isolated-durable-runner.schema.json`](../../experiments/workstation/fixture-026/rsd-t02-fixed-instance-isolated-durable-runner.schema.json)
- [`rsd-t02-fixed-instance-isolated-durable-runner.test.mjs`](../../experiments/workstation/fixture-026/rsd-t02-fixed-instance-isolated-durable-runner.test.mjs)

## 3. Isolation and durability now span the complete public panel

The integrated runner creates one identity-keyed directory for each of the 20
canonical system instances, executes its nine arm slots through the restricted
child, and accepts an outer record only after the per-instance durable summary
is complete and current. The resulting construction has exactly 20 outer
records, 20 instance directories and 180 terminal arm records.

The most important restart boundary lies between completing one instance and
appending its outer record. Reopening revalidates that orphaned complete
directory and appends it once; reopening a completed panel revalidates all 20
summaries and executes zero remaining instances. Hostile tests also refuse a
foreign writer, raw-leaf replacement, path aliases, torn or altered ledgers,
oversized recovery inputs, and checkpoints ahead of raw authority. The retained
lock artifacts, absent external rollback head, unauthenticated caller-custodied
owner identifier and scoped file-sync claim remain explicit limitations.

The release manifest exact-binds the integrated, population, fixed-instance,
isolation, storage and lock modules; all four configs; the restricted worker;
the content-addressed bundle; and their local runtime dependencies. This closes
one infrastructure prerequisite. It does not run a trained estimator, retain
an endpoint, aggregate outcomes, compare models or authorize a claim.

Machine-readable files:

- [`configs/rsd-t02-public-development-isolated-durable-population.json`](../../experiments/workstation/fixture-026/configs/rsd-t02-public-development-isolated-durable-population.json)
- [`rsd-t02-public-development-isolated-durable-population-runner.schema.json`](../../experiments/workstation/fixture-026/rsd-t02-public-development-isolated-durable-population-runner.schema.json)
- [`rsd-t02-public-development-isolated-durable-population-runner.mjs`](../../experiments/workstation/fixture-026/rsd-t02-public-development-isolated-durable-population-runner.mjs)
- [`rsd-t02-public-development-isolated-durable-population-runner.test.mjs`](../../experiments/workstation/fixture-026/rsd-t02-public-development-isolated-durable-population-runner.test.mjs)
- [`configs/rsd-t02-parameterized-runner-release.json`](../../experiments/workstation/fixture-026/configs/rsd-t02-parameterized-runner-release.json)
- [`rsd-t02-parameterized-runner-release.schema.json`](../../experiments/workstation/fixture-026/rsd-t02-parameterized-runner-release.schema.json)

## 4. Exact-analyzer calibration can reject a planning assumption

The calibration module generates paired endpoint transcripts from declared
four-dimensional synthetic contrast distributions, applies pre-response
attrition and registered runtime-failure penalties, and invokes the existing
bootstrap/Holm analyzer unchanged.

For $k$ events in $R$ simulation replicates, the displayed smoothed Monte
Carlo point is

$$
\widetilde p_{\mathrm{MC}}=\frac{k+1}{R+1},
$$

with resolution $1/(R+1)$. Sampling uncertainty is kept separate: the Wilson
interval is computed for the observed binomial count $k/R$, not for an
invented $(k+1,R+1)$ sample.

For hypothesis $h$, $I_h$ invalid or zero-standard-error bootstrap
resamples out of $B$ give the analyzer's data-dependent attainable floor

$$
p_{\min,h}=\frac{I_h+1}{B+1}.
$$

The first Holm threshold is $\alpha/4=0.0125$. With $B=1000$, the nominal
plus-one floor is below that threshold, but a small two-instance panel can
still produce enough invalid resamples to make the threshold unattainable.

### Canonical synthetic diagnostic

The frozen public method-check configuration uses 99 simulation replicates per
scenario and 1,000 bootstrap resamples per hypothesis per replicate.

| Scenario | Any-rejection count | Resolution failures | Interpretation |
| --- | ---: | ---: | --- |
| synthetic null | 6 / 99 | 0 / 99 | observed frequency 0.061; its Wilson Monte Carlo interval 0.028--0.126 spans the 0.05 reference |
| minimum relevant synthetic effects | 55 / 99 | 0 / 99 | observed frequency 0.556; its Wilson interval 0.457--0.650 is far below the illustrative 0.90 target |
| two-instance nondegenerate hostile | 0 / 99 | 99 / 99 | data-dependent bootstrap floors block the first Holm threshold |
| two-instance zero-variance hostile | 0 / 99 | 99 / 99 | observed zero standard error forces non-rejection |

These frequencies characterize this deterministic synthetic method check. They
are not achieved scientific power, model performance, effect estimates, or
confidence intervals for a future experiment.

![Observed any-rejection frequencies with Wilson Monte Carlo intervals for the declared synthetic null and alternative, beside bootstrap-resolution failure frequencies for the two hostile scenarios.](../../public/plots/rsd-t02-bootstrap-calibration.svg)

Machine-readable files:

- [`configs/rsd-t02-pilot-transcript-calibration.json`](../../experiments/workstation/fixture-026/configs/rsd-t02-pilot-transcript-calibration.json)
- [`rsd-t02-pilot-transcript-calibration.schema.json`](../../experiments/workstation/fixture-026/rsd-t02-pilot-transcript-calibration.schema.json)
- [`rsd-t02-pilot-transcript-calibration-output.schema.json`](../../experiments/workstation/fixture-026/rsd-t02-pilot-transcript-calibration-output.schema.json)
- [`rsd-t02-pilot-transcript-calibration.mjs`](../../experiments/workstation/fixture-026/rsd-t02-pilot-transcript-calibration.mjs)
- [`rsd-t02-pilot-transcript-calibration.test.mjs`](../../experiments/workstation/fixture-026/rsd-t02-pilot-transcript-calibration.test.mjs)

## 5. Adversarial review changed the implementation

The first happy-path implementations were not accepted as sufficient. Separate
read-only reviews produced hostile counterexamples, and the contracts were
tightened around them.

### Population artifact

1. Rehashed but forged receipt digests and workload counters were accepted.
2. Runtime and JSON Schema disagreed on the canonical nine-arm count.
3. The internal hash chain was described too strongly despite lacking an
   external trusted head.

The hardened validator replays receipts, checks every scientific-unit and
workload cross-invariant, aligns runtime with schema, and states the chain's
actual integrity boundary.

### Pilot calibration

1. Scenario roles were labels rather than validated properties of the data-
   generating process.
2. The Wilson interval used the plus-one point-estimate pseudo-counts and could
   exclude zero after zero observed events.
3. scientific identities omitted the scenario/configuration digest.
4. Extra properties passed runtime validation but failed the JSON Schema.
5. An all-refused hostile configuration could still claim completed
   calibration and close a blocker.

The hardened contract binds role semantics and scenario identity, enforces
runtime/schema parity, separates point smoothing from interval coverage, and
requires the registered scenario coverage plus accepted analyzer executions
before the narrow method-calibration blocker can close. A final re-review also
found that hashing report-only controls into scientific IDs changed analyzer
sort order and finite-bootstrap decisions. Scientific IDs, transcript RNG and
resampling now use a DGP-only fingerprint; confidence level, replicate-count
ceiling and other report/analysis controls remain bound at the full transcript
and report audit roots without perturbing a common generated prefix.

### Durable isolated runner

1. Concurrent session calls could append the same sequence or release a lock
   while I/O remained active.
2. Lexical path aliases and redirected leaves could evade the intended lock
   boundary.
3. Mutable caller-owned configuration could alter later summaries.
4. Recovery reads had no frozen byte bound.
5. Lock release contained a verify-then-unlink replacement race.
6. The raw-ledger pathname could be replaced between two otherwise valid
   appends because the open session retained state but not the original leaf
   handle identity.
7. A first lock-release repair still performed one final pathname unlink after
   quarantine verification, leaving a smaller replacement race.
8. The first integrated population layer bound the output root but not the
   captured `instances/` directory identity; replacing that directory during an
   open session allowed the next outer record to append before reopen detected
   the missing tree.

The hardened path serializes session operations, freezes validated inputs and
returned evidence, canonicalizes and constrains output paths, bounds recovery
bytes, retains and revalidates the exact raw-ledger handle for the whole
session, and never pathname-deletes a retired quarantine artifact. The
integrated layer now revalidates the captured `instances/` real path, device and
inode before fixed work, after fixed-session closure, and immediately before
outer append; a mismatch poisons the session. The exact hostile reproduction
leaves the outer ledger at one record and preserves both displaced and
replacement trees. These are explicit boundary checks, not an atomic namespace
transaction against an out-of-protocol process mutating the path between two
instructions. Retired lock files are intentionally retained for explicit
cleanup; ordinary execution does not auto-delete them.

## 6. What is still missing

After integrating the population and isolated durable layers and promoting its
narrow infrastructure gate, at least the following remain open:

The non-energy maturity ledger now has five satisfied applicable gates and 15
open gates. Seven intrinsic null-maturity gates and three affected-fitting
blockers remain; mature-null, comparison and claim authority are still false.

1. coverage-complete structural lineages and sealed outer-family templates;
2. prospectively assigned fit, calibration, development-evaluation, outer
   confirmation, and transfer instances;
3. isolated execution of the actual trainable null and candidate policies;
4. frozen model, calibrator, support, loss, endpoint, and resource artifacts;
5. reviewed real pilot bytes and a jointly frozen bootstrap-aligned power plan;
6. one-pass private confirmation custody and release; and
7. calibrated workstation time, memory, and joule measurement if an energy
   endpoint is requested.

## Commands

From the repository root:

```bash
npm run test:workstation:fixture-026:execution-v52
node experiments/workstation/fixture-026/build-rsd-t02-fixed-instance-conformance-policy.mjs --check
npm run validate:workstation
npm run check:test-coverage
```

Every executable artifact in this audit remains `NO_RESULT`.

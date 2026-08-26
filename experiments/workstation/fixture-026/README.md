# Fixture 026 public-development CPU smoke harness

This directory contains a deterministic CPU-only plumbing harness for the
`RSD-T01` / `C-1540` slice of Fixture F-026. It validates the exact
generator-family × history grid and evaluator-only trace-fact vector
construction, then exercises two legacy generator-family diagnostics over
response shapes that endpoint and peak summaries deliberately conflate.
The bounded `RSD-T02` mechanism-conformance slice is connected to the runner.
Its source-shaped boundary-layer floor foundation remains isolated and
non-executable. Neither stratum has result authority.

Every event and every successful command response is labelled `NO_RESULT`.
This is not the registered RSD-T01 primary experiment, a comparison of trained
arms, or evidence for a scientific, performance, complete-work, or energy
claim.

## Synthetic scope

Each public seed contains an exact Cartesian grid of five constructed generator
families by four history families, for 20 valid cells:

1. an exact paired-trajectory match;
2. an approximate paired-trajectory match with frozen nonzero discrepancy;
3. an endpoint-return lookalike with two causal finite-memory windows;
4. a history-responsive causal trace and its fixed past-only delay, preserving
   peak amplitude while shifting latency and the time-indexed trajectory, not
   the intrinsic waveform; and
5. a static-ratio map with a frozen initial background.

This is a direct causal paired-trace fixture, not a collection of initialized
state-space systems and not a test of system-level symmetry across scales. The
generator-family labels name construction recipes, not mutually exclusive
scientific properties. After each probe response is frozen, the evaluator
records only trace-qualified facts: `paired_trajectory_match`,
`finite_horizon_endpoint_return`, `peak_amplitude_equal`,
`causal_memory_status: unassessed`, and `support_membership: inside`. The probes
do not predict that vector, so no property-performance score exists and the
fixture makes no structural memory claim.

Four additional malformed-record sentinels per seed are outside the
generator-family denominator and stop before accepted policy work. They cover
ordering, checksum, unit, and future-derived reference failures exactly once per
seed.

The two unequal-information probes retain their legacy `arm` event field but
are deliberately named diagnostics:

1. `full-trajectory-diagnostic` receives only `trace_valid` plus samples with
   `ordinal`, `time_s`, normalized `input_ratio`, `output_base_y`, and
   `output_scaled_y`;
2. `peak-endpoint-lookalike` receives only `trace_valid`,
   `peak_discrepancy`, and `endpoint_discrepancy`.

Their information and feature-construction work are not matched. Their
generator-family accuracy or counters therefore cannot support a comparative,
property-performance, or resource conclusion. The second probe exists only to
make registered lookalike collisions visible in the plumbing.

## Frozen score and firewall

For accepted samples, the evaluator computes

$$
D=\sqrt{\frac{\Delta t}{T}\left[
\frac{e_0^2+e_N^2}{2}+\sum_{k=1}^{N-1}e_k^2
\right]},\qquad
e_k=\frac{y_{p,k}-y_{1,k}}{s_y},
$$

with trapezoidal quadrature, `Δt = 0.02 s`, `T = 4 s`, and dimensionless
`s_y = 1`. Peak amplitude is the maximum absolute departure from each
trajectory's own prestimulus value, using the earliest sample on ties. Peak,
paired-final endpoint, final-0.5-second tail, and latency discrepancies remain
separate fields. The policy response freezes a generator-family label and an
estimate of `D` before the evaluator opens the family, semantic vector, and
evaluator `D`. Because the full probe receives both trajectories, its `D` is
directly computable; zero estimation error is conformance plumbing, not learned
symmetry.
Policy projections contain no seed, index, world ID, initialization ID, scale
factor, absolute background, checksum, provenance, parameter, unit, or
interface metadata.

This is a field and code-path firewall only. Because the development seeds,
generator, and generated trajectories are public and deterministic, it does
not establish information-theoretic blindness against an arm precomputed from
that public generator. A separately committed private confirmation partition
is the future epistemic boundary. Raw-event world and initialization hashes
are bookkeeping identifiers, not secrets, and never enter either policy view.

Inputs use normalized unit `U`; outputs are dimensionless log-ratio-like
signals with unit `1`. The declared positive floor is `0.05 U`. No hidden
epsilon is added. `band-limited-stochastic` is a seed-dependent random Fourier
realization with frozen harmonics 1--4, bounded random amplitudes and phases,
and an endpoint envelope. Its final 1.4 seconds are exactly flat, longer than
the largest 0.8-second finite-memory window. The same realized history drives
both scale members of a paired world. Endpoint-return traces compare the current
ratio only with samples 0.4 or 0.8 seconds in the past and apply the recorded
scaled-branch gain increment. Equal-peak delayed trajectories apply one recorded
common gain to a 0.6-second past window and then a fixed 0.3-second causal delay.
No earlier output uses a future sample or a full-horizon statistic.

The event parameter object is closed and family-qualified. Every record carries
the common background, scale factor, and input floor. The causal-reference
`tau` is non-null only for the exact, approximate, and malformed-sentinel
underlying traces. Approximate additive amplitude, endpoint gain increment and
two endpoint lags, and equal-peak common gain, memory lag, and delay have
distinct fields; every field not used by that generator family is explicitly
`null`.

## Accounting and non-energy boundary

For schema-valid accepted records, `serialized_policy_view_utf8_bytes` is the
exact UTF-8 byte length of `JSON.stringify(policyView)`, including
`trace_valid` and the observation.
The peak/endpoint arm reads exactly two exposed summary values.

`modeled_diagnostic_scalar_operations` is a frozen model, not an observed CPU
counter. For the full arm with $N$ samples and $M$ tail samples it is
$18N+4M+18$: $4N$ for the paired trajectory squared-error accumulation,
$8N$ for two static-fit squared-error accumulations, $6N$ for two absolute-
departure peak scans (subtraction, absolute value, and earliest-tie comparison),
$4M$ for the tail squared-error accumulation, and 18 fixed normalization,
endpoint, peak, latency, square-root, and decision operations. Here
$N=201$ and $M=26$. The summary arm uses a fixed worst-case model of three
numeric threshold comparisons: peak versus the approximate ceiling, endpoint
versus its tolerance, and peak versus its exact tolerance. Boolean OR, branch,
property-access, and control-flow operations are explicitly outside this
scalar model. These counts exclude transcendental-library implementation work
and are not timing, energy, or complete-work measurements.

Both probe classifiers retain zero persistent state across events.
`temporary_memory_measured` and `peak_memory_measured` are false; temporary
objects, live memory, allocator/runtime overhead, generator, validator,
evaluator, view hashing, precomputed-summary construction, wall time,
artifacts, tuning, fallback, maintenance, communication, and the full
registered resource vector remain unmeasured. `serialized_event_bytes_written`
alone is the exact UTF-8 JSONL line size. No counter is converted to joules and
no resource comparison is permitted.

The harness contains no meter path, GPU path, physical input, confirmation or
transfer seed, commitment, private custody, measured energy, or promotion
authority.

## Scientific-grid foundation

`scientific-grid.mjs` is an isolated prospective contract foundation. It
freezes ordered history × scale descriptors, multiple scale roles per shared
initialization, valid scientific hostile descriptors, the eight actionable arm
IDs, the evaluator-only oracle, and fail-closed system aggregation. It is not
called by the v2 runner and does not turn either diagnostic into a comparator.
The dimensionless cells are `2×` and `4×` as observed-development roles and
`8×` as a withheld-prospective role, each relative to the same `1×` reference.
All remain in the machine-readable `public-development` partition with
`information_cut_status: unregistered`; the eight unimplemented arms have no
current parity or ranking eligibility. Exact and approximate discrepancy
thresholds are contract constants, and aggregation requires one shared
initialization ID. Input-domain, transformation, instrument, initialization,
causal-observation, and evaluation-window support remain separate axes.

The current complete-trajectory packet remains a conformance-and-cost input. A
predictive arm comparison stays blocked until a separate protocol freezes the
information cut—such as a withheld suffix, scale cell, or intervention—and the
evaluator target visible only after response freeze. Public descriptor roles do
not create a private confirmation partition.

## RSD-T02 interventional mechanism-equivalence construction runtime

`rsd-t02-contract.mjs`, `rsd-t02-models.mjs`, and `rsd-t02-floor.mjs` freeze a
public-development foundation for two distinct strata. The checked-in
T02-MECH generator, evaluator, event contract and runner execute only the first:

1. `T02-MECH` gives five initialized two-state construction recipes the same
   canonical fold-step trajectory, then separates generator provenance from a
   scored four-property vector and exact input-output equivalence classes.
2. `T02-FLOOR` freezes a source-shaped singular perturbation check over 105
   model × epsilon × scale cells. Its primary discrepancy is the fast-layer
   supremum norm; integrated RMS remains diagnostic because it can vanish while
   the instantaneous discrepancy stays finite.

The mechanism panel contains 26 fixed episodes across canonical steps,
repeated pulses, ramps, opaque-state resets and freezes, one reported-output
clamp, interrupted holds, and same- versus cross-channel restimulation. Three
observation regimes distinguish a mandatory matched-step abstention baseline,
the fixed full panel, and a six-query active-design ceiling. Nine actionable
arm IDs remain parity- and ranking-ineligible; `O-GRAPH` is evaluator-only.
Pair certificates describe one analytic isomorphism and nine numerically
refined public-development constructions under their frozen schedules, not
scientific results.

The O0 registry count is per conditioned model instance: three background
steps and 4,611 rows for each $\tau_*$, crossed over $0.5$, $1$, and $2$ seconds
by the runtime for nine executions and 13,833 rows per recipe. O1 is exactly 26
episodes and 39,962 rows per recipe at $\tau_*=1$ second.

The square-pulse episodes do not instantiate the Rahi-style refractory or
period-skipping signature: the v1 feedback nonlinearity vanishes at both pulse
levels. C-1561 therefore remains a separately declared written subtrack rather
than a result of this construction runtime.

T02-MECH now has a deterministic bounded construction/conformance runtime: 175
events per selected seed, a closed actionable projection and response commit,
independent `O-GRAPH` evaluation, typed costs, append-only hash-chain resume,
exact pair matrices and recomputed analysis. The hashed profile deliberately
uses one public seed for smoke and two of 64 for bounded development
conformance; it is not the full development pack. Every actionable arm
abstains, C-1561 and C-1564 are excluded, and every artifact is `NO_RESULT`.
No actionable implementation, comparison, execution claim, confirmation
custody, promotion path, O2 runtime, T02-FLOOR runtime, asymptotic result,
workstation measurement or energy result exists. RSD-T01 remains the only
claim-scoped implemented track.

## Commands

From the repository root:

```powershell
node experiments/workstation/fixture-026/runner.mjs prepare --profile smoke
node experiments/workstation/fixture-026/runner.mjs smoke --profile smoke --output experiments/workstation/runs/fixture-026-smoke --resume false
node experiments/workstation/fixture-026/runner.mjs run --profile development --output experiments/workstation/runs/fixture-026-development --resume false
node experiments/workstation/fixture-026/runner.mjs analyze --output experiments/workstation/runs/fixture-026-development
node experiments/workstation/fixture-026/runner.mjs validate --output experiments/workstation/runs/fixture-026-development

node experiments/workstation/fixture-026/runner.mjs t02-prepare --profile smoke
node experiments/workstation/fixture-026/runner.mjs t02-smoke --profile smoke --output experiments/workstation/runs/fixture-026-t02-smoke --resume false
node experiments/workstation/fixture-026/runner.mjs t02-run --profile development --output experiments/workstation/runs/fixture-026-t02-development --resume false
node experiments/workstation/fixture-026/runner.mjs t02-analyze --output experiments/workstation/runs/fixture-026-t02-development
node experiments/workstation/fixture-026/runner.mjs t02-validate --output experiments/workstation/runs/fixture-026-t02-development
```

Focused tests:

```powershell
node --test --test-isolation=none experiments/workstation/fixture-026/contract.test.mjs experiments/workstation/fixture-026/runner.test.mjs experiments/workstation/fixture-026/scientific-grid.test.mjs experiments/workstation/fixture-026/rsd-t02-contract.test.mjs experiments/workstation/fixture-026/rsd-t02-models.test.mjs experiments/workstation/fixture-026/rsd-t02-floor.test.mjs experiments/workstation/fixture-026/rsd-t02-generator.test.mjs experiments/workstation/fixture-026/rsd-t02-evaluator.test.mjs experiments/workstation/fixture-026/rsd-t02-event.test.mjs experiments/workstation/fixture-026/rsd-t02-runner.test.mjs
```

## Integrity

Raw events are canonical LF-only newline-delimited JSON in an append-only
SHA-256 chain. An ownership-checked exclusive output lease rejects concurrent
writers and is never automatically broken. Symlink, junction, reparse-point
and resolved-path escapes are rejected before output mutation. CRLF, blank
lines, and multiple terminal newlines are rejected.
Resume is reconstructed from the raw ledger, binds the profile and every frozen
source identity, requires the ledger to be an exact ordered prefix of the work
grid, semantically replays every prior record before deriving remaining work,
repairs a missing or stale derivable checkpoint before declaring a complete
run, and rejects torn tails, substitutions, and mutations. Checkpoint,
`run.json`, and nested run-ledger documents are exact-keyed and typed; the raw
and checkpoint paths and `NO_RESULT` interpretation are frozen. World and initialization IDs
are deterministic SHA-256 bookkeeping identifiers with no secrecy claim and
are excluded from policy inputs. Public seeds are canonical decimal strings in
the full unsigned 64-bit range, then encoded as exactly eight little-endian
bytes and domain-separated before custom generator seeding. Noncanonical forms
such as leading-zero strings are rejected. The exact generator is PCG-CM-DXSM
128/64: its 128-bit
state transition uses multiplier `0xda942042e4dd58b5`, and DXSM maps the
pre-transition state to 64 output bits. Initial state and odd increment are
derived directly from SHA-256. This custom seeding is not NumPy `SeedSequence`
compatible, so equal decimal labels do not promise NumPy-compatible streams.
Confirmation and transfer files are literal `not-created` records.

The original v1 smoke contract remains reproducible from Git commit
`3daf857df3452f54e3caacacabd1782fdd460a99`. Version 2 intentionally changes
the seed grammar, grid, generator, event schema, run identity, and analysis
identity; current-source validation therefore rejects v1 run directories
instead of silently reinterpreting them.

Run identity also freezes the actual Node version, V8 version, libuv version,
platform, architecture, endianness, OS release, numeric model, and Math API
boundary. Checkpoints, events, replay, and analyses bind that fingerprint.
Same-environment tests observed byte-identical output under the recorded
fingerprint. Different fingerprints are distinct run identities and are
rejected, but this fingerprint is not a cross-host guarantee and does not bind
the executable hash, CPU model/features, or host math-library identity. No
byte guarantee is made across hosts or unrecorded differences in `Math.sin`,
`Math.log`, the executable, CPU features, or host math libraries.

## Missing before the registered experiment exists

This smoke slice deliberately lacks:

1. the eight actionable RSD-T01 arms (`A-RAW`, `B-STATIC-DIV`, `B-STREAM`,
   `B-LOG-RATIO`, `B-DIFFERENCE`, `B-STATE-SPACE`, `B-RECURRENT`, and `C-DUAL`)
   and their actual algorithms; `O-STATISTIC` remains evaluator-only;
2. matched information, state, tuning, feature-construction, and runtime budgets;
3. causal system equations, system-level symmetry across multiple scales, and
   genuinely structural memory truth;
4. held-out scale extrapolation and all registered near-zero, clipping,
   additive-offset, hidden-reset, slow-tail, and scientific leakage hostiles;
5. reference lifecycle, fallback, complete resource, and artifact accounting;
6. a registered prospective information cut, powered statistics, paired
   confirmation analysis, multiplicity control, and the simultaneous primary
   property-performance/trajectory-conformance endpoint;
7. confirmation and transfer seeds, commitments, custody, and releases;
8. calibrated workstation time, memory, and energy measurement; and
9. actionable algorithms, comparison/claim authority, confirmation custody,
   O2 selection, and T02-FLOOR execution for the bounded T02-MECH construction
   runtime; and
10. machine contracts and runners for RSD-T03 through RSD-T10.

Until those gaps are closed and separately reviewed, this directory remains a
public development smoke harness with `NO_RESULT` authority.

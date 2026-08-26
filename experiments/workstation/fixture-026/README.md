# Fixture 026 public-development CPU smoke harness

This directory contains a deterministic CPU-only plumbing harness for the
`RSD-T01` / `C-1540` slice of Fixture F-026. It checks whether a frozen
trapezoidal complete-trajectory discrepancy can separate five constructed
response-shape classes that endpoint and peak summaries deliberately conflate.

Every event and every successful command response is labelled `NO_RESULT`.
This is not the registered RSD-T01 primary experiment, a comparison of trained
arms, or evidence for a scientific, performance, complete-work, or energy
claim.

## Synthetic scope

Each six-world balance block contains five valid synthetic property classes:

1. exact full-trajectory scale symmetry;
2. approximate scale symmetry with a frozen nonzero discrepancy;
3. endpoint adaptation without trajectory symmetry;
4. equal peak and endpoint with different shape and latency; and
5. a memoryless static-ratio map with a frozen initial background.

The sixth world is a malformed-record sentinel. It is outside the five-class
accuracy denominator and must stop before accepted policy work. Across the
public seeds, the sentinels cover ordering, checksum, unit, and future-derived
reference failures.

The two arms are deliberately named diagnostics:

1. `full-trajectory-diagnostic` receives only `trace_valid` plus samples with
   `ordinal`, `time_s`, normalized `input_ratio`, `output_base_y`, and
   `output_scaled_y`;
2. `peak-endpoint-lookalike` receives only `trace_valid`,
   `peak_discrepancy`, and `endpoint_discrepancy`.

Their information and feature-construction work are not matched. Their
accuracy or counters therefore cannot support a comparative or resource
conclusion. The second arm exists only to make registered lookalike collisions
visible in the plumbing.

## Frozen score and firewall

For accepted samples, the evaluator computes

$$
D=\sqrt{\frac{\Delta t}{T}\left[
\frac{e_0^2+e_N^2}{2}+\sum_{k=1}^{N-1}e_k^2
\right]},\qquad
e_k=\frac{y_{p,k}-y_{1,k}}{s_y},
$$

with trapezoidal quadrature, `Δt = 0.02 s`, `T = 4 s`, and dimensionless
`s_y = 1`. Peak, endpoint, final-0.5-second tail, and latency discrepancies
remain separate fields. The policy response freezes a property label and an
estimate of `D` before the evaluator opens the oracle label and oracle `D`.
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
epsilon is added. `band-limited-multisine` is a deterministic multisine, not a
stochastic-profile claim.

## Accounting and non-energy boundary

For schema-valid accepted records, `serialized_policy_view_utf8_bytes` is the
exact UTF-8 byte length of `JSON.stringify(policyView)`, including
`trace_valid` and the observation.
The peak/endpoint arm reads exactly two exposed summary values.

`modeled_diagnostic_scalar_operations` is a frozen model, not an observed CPU
counter. For the full arm with $N$ samples and $M$ tail samples it is
$14N+4M+18$: $4N$ for the paired trajectory squared-error accumulation,
$8N$ for two static-fit squared-error accumulations, $2N$ for two peak scans,
$4M$ for the tail squared-error accumulation, and 18 fixed normalization,
endpoint, peak, latency, square-root, and decision operations. Here
$N=201$ and $M=26$. The summary arm uses a fixed worst-case model of three
numeric threshold comparisons: peak versus the approximate ceiling, endpoint
versus its tolerance, and peak versus its exact tolerance. Boolean OR, branch,
property-access, and control-flow operations are explicitly outside this
scalar model. These counts exclude transcendental-library implementation work
and are not timing, energy, or complete-work measurements.

Both classifiers retain zero persistent state across events.
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

## Commands

From the repository root:

```powershell
node experiments/workstation/fixture-026/runner.mjs prepare --profile smoke
node experiments/workstation/fixture-026/runner.mjs smoke --profile smoke --output experiments/workstation/runs/fixture-026-smoke --resume false
node experiments/workstation/fixture-026/runner.mjs run --profile development --output experiments/workstation/runs/fixture-026-development --resume false
node experiments/workstation/fixture-026/runner.mjs analyze --output experiments/workstation/runs/fixture-026-development
node experiments/workstation/fixture-026/runner.mjs validate --output experiments/workstation/runs/fixture-026-development
```

Focused tests:

```powershell
node --test --test-isolation=none experiments/workstation/fixture-026/contract.test.mjs experiments/workstation/fixture-026/runner.test.mjs
```

## Integrity

Raw events are newline-delimited JSON in an append-only SHA-256 chain. Resume
is reconstructed from the raw ledger, binds the profile and every frozen source
identity, and rejects torn tails and mutations. World and initialization IDs
are deterministic SHA-256 bookkeeping identifiers with no secrecy claim and
are excluded from policy inputs. Public seeds are encoded as
unsigned little-endian 64-bit values and domain-separated before custom
generator seeding. The exact generator is PCG-CM-DXSM 128/64: its 128-bit
state transition uses multiplier `0xda942042e4dd58b5`, and DXSM maps the
pre-transition state to 64 output bits. Initial state and odd increment are
derived directly from SHA-256. This custom seeding is not NumPy `SeedSequence`
compatible, so equal integer labels do not promise NumPy-compatible streams.
Confirmation and transfer files are literal `not-created` records.

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

1. the full seven-arm RSD-T01 null stack and actual algorithms;
2. matched information, state, tuning, feature-construction, and runtime budgets;
3. the full five-class × step/pulse/ramp/stochastic-history crossing;
4. stochastic histories, held-out scale extrapolation, and all registered
   near-zero, clipping, additive-offset, hidden-reset, slow-tail, and leakage
   hostiles;
5. reference lifecycle, fallback, complete resource, and artifact accounting;
6. powered statistics, paired confirmation analysis, multiplicity control, and
   the simultaneous primary accuracy/trajectory-estimation endpoint;
7. confirmation and transfer seeds, commitments, custody, and releases;
8. calibrated workstation time, memory, and energy measurement; and
9. runners for RSD-T02 through RSD-T10.

Until those gaps are closed and separately reviewed, this directory remains a
public development smoke harness with `NO_RESULT` authority.

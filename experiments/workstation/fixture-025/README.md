# Fixture F-025 workstation smoke harness

This directory implements the first public-development execution slice of
`ECM-T03` for C-1532. It exercises deterministic complex-spectrum generation,
record/provenance validation, amplitude and harmonic screening, a bounded
repeat-consistency surrogate, equivalence-aware reporting, matched accounting,
and corruption-evident resume. It does not execute the registered confirmation
or hostile-transfer experiment in the
[F-025 protocol](../../fixtures/025-electrochemistry-interface-memory-degradation.md).

## Authority boundary

- `NO_RESULT`: this harness tests software plumbing and gate precedence only.
- The repeat-consistency statistic is a deliberately bounded development
  surrogate. It is not the registered Boukamp linear Kramers--Kronig power
  calibration and cannot validate impedance data scientifically.
- The five public synthetic classes are balanced unit-test worlds, not the
  512-world confirmatory generator.
- No arm selection, effect size, safety statement, circuit-mechanism claim, or
  C-1532 conclusion is permitted.
- No physical cell, apparatus, or energy meter is used. Joule, watt, carbon,
  electrochemical-safety, and energy-efficiency conclusions are forbidden.
- Confirmation and transfer seeds and commitments do not exist. The two
  `*.unavailable.json` records preserve that absence.

## Commands

```text
node experiments/workstation/fixture-025/runner.mjs prepare --profile smoke
node experiments/workstation/fixture-025/runner.mjs smoke --profile smoke --output experiments/workstation/runs/fixture-025-smoke --resume false
node experiments/workstation/fixture-025/runner.mjs run --profile development --output experiments/workstation/runs/fixture-025-development --resume false
node experiments/workstation/fixture-025/runner.mjs analyze --output experiments/workstation/runs/fixture-025-development
node experiments/workstation/fixture-025/runner.mjs validate --output experiments/workstation/runs/fixture-025-development
```

`smoke` executes, analyzes, and validates. `run` writes raw development
artifacts only. Existing output is refused unless `--resume true` is explicit.
There is no confirmation, transfer, release, promotion, or apparatus action.

## Deterministic artifacts

Each seed produces a balanced cycle of valid-identifying,
valid-terminal-equivalent, record/provenance-invalid, repeat-inconsistent, and
nonlinear/out-of-scope worlds. Every world traverses three implementation
paths: ungated fitting, a residual-screen null, and an ordered validity gate.
The append-only raw ledger binds the complete scientific payload, exact source
and input hashes, completed work units, sequence, and preceding-record digest.
Resume reconstructs authority from raw events; the checkpoint may never
override them.

The diagnostic analysis requires the ordered path to:

1. stop record-invalid worlds before buying a physics probe;
2. stop nonlinear worlds after the first three registered bundles;
3. use all nine registered bundles for the repeat-consistency path;
4. report terminal-equivalent worlds as non-identifying candidate sets; and
5. keep every scientific, performance, physical-energy, and promotion flag
   false.

## What remains absent

The other nine F-025 tracks, full 512-world ECM-T03 generator, finite-band
Kramers--Kronig calibration, circuit fitting and quotient implementation,
private seed escrow, confirmation, hostile transfer, preregistered inference,
physical apparatus, and promotion evidence remain unimplemented. The manifest
therefore remains `smoke-ready`, never `workstation-ready`.

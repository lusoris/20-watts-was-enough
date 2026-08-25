# Fixture F-024 workstation smoke harness

This directory implements only the public-development smoke slice of
`AMR-T01` for C-1526. It exercises a stable two-variable linear system,
Markov-only reduction, finite projected memory, and an exact augmented-state
ceiling. It does not execute the registered confirmation or transfer tests in
the [F-024 protocol](../../fixtures/024-applied-multiscale-reduction.md).

## Authority boundary

- `NO_RESULT`: the harness checks deterministic plumbing, finite outputs,
  accounting, and corruption-evident resume only.
- The exact augmented-state arm receives the evaluator's full prefix-end state
  and is an analytical ceiling, not an equally informed empirical comparator.
- The finite-memory arm uses known synthetic coefficients and reconstructs its
  prefix-end unresolved state from resolved samples. This is a generator unit
  test, not learned closure evidence.
- No comparison, effect size, ranking, or diagnostic pass is claim-eligible.
- No energy is measured or modeled. Joule, watt, carbon, and energy-efficiency
  conclusions are explicitly forbidden.
- Confirmation and transfer seeds and commitments do not exist. The two
  `*.unavailable.json` documents record absence; they contain no seeds or
  commitments.

## Commands

```text
node experiments/workstation/fixture-024/runner.mjs prepare --profile smoke
node experiments/workstation/fixture-024/runner.mjs smoke --profile smoke --output experiments/workstation/runs/fixture-024-smoke --resume false
node experiments/workstation/fixture-024/runner.mjs run --profile development --output experiments/workstation/runs/fixture-024-development --resume false
node experiments/workstation/fixture-024/runner.mjs analyze --output experiments/workstation/runs/fixture-024-development
node experiments/workstation/fixture-024/runner.mjs validate --output experiments/workstation/runs/fixture-024-development
```

`smoke` executes, analyzes, and validates. `run` creates raw development
artifacts only. Existing output is refused unless `--resume true` is explicit.
There is no confirmation, transfer, release, or promotion action.

## Deterministic artifacts

The public seed list follows the F-024 development range. Worlds use the
fixture's named PCG64-DXSM initialization, binary64 arithmetic, an exact real
two-by-two matrix exponential, and a canonical work order. Each completed
seed/system/arm work unit is appended to `raw-events.jsonl`. The shared
checkpoint ledger binds:

1. the complete scientific payload;
2. the previous record hash and sequence;
3. completed work-unit keys;
4. the exact audit, F-024 fixture, mathematical contract, runner,
   configuration, output schema, public seeds, runtime contract, and source
   hashes; and
5. a durable checkpoint reconstructed from raw records on resume.

`run.json` and `analysis/summary.json` are canonical-content JSON artifacts.
Analysis is recomputed from the raw hash chain and refuses altered records,
torn tails, stale checkpoints, changed sources, non-finite values, or any
attempt to enable result or energy authority.

## What remains absent

This smoke harness does not implement fitted matched-information arms, private
seed escrow, the full AMR-T01 statistical plan, confirmation, transfer,
workstation-energy measurement, promotion evidence, or a release. Its manifest
therefore remains `smoke-ready`, never `workstation-ready`.

# Fixture F-023 workstation smoke harness

This directory implements a public-development shakedown for two bounded parts
of [Fixture F-023](../../fixtures/023-plant-plasticity-memory-signalling.md):
`PLM-T01` duration memory and `PLM-T02` lifecycle reset. It is deliberately not
the registered 64-seed development procedure, confirmation experiment, or
hostile-transfer experiment.

## Implemented mechanisms

1. `PLM-T01` gives a quantized accumulator, a duration-filter null, and an
   independent stochastic latch population exactly the same noisy/missing
   binary stream and the same 256 B state ceiling. Every episode closes its
   reset and cleared-byte ledgers.
2. `PLM-T02` gives a carried-prior arm, change-point null, and evidence-gated
   fractional-reset arm the same previous/current lifecycle records and the
   same authenticated or corrupted boundary event. Reset-capable arms must
   abstain on duplicate, delayed, or missing boundaries.
3. The policy implementations live in a separate module from the world
   generator/evaluator. They receive closed projections identified only by an
   opaque `w23_<digest>` world ID; seed, world index, target state, evaluator
   probabilities, and intervention labels are absent.
4. Every PLM-T02 event retains its per-example prediction and evaluator label.
   The runtime contract independently derives the NLL sum and mean from those
   pairs instead of trusting a supplied aggregate.

The policies are small deterministic plumbing proxies. They are not the full
model families, tuning grid, paired inference, ablations, challenge floors, or
transfer contract in F-023.

## Authority boundary

- Every event and analysis is explicitly `NO_RESULT`.
- Arm metrics are diagnostic only; comparative inference and claim eligibility
  are disabled.
- The public document contains exactly 64 formula-derived development seeds
  for each track; smoke selects the first two without inventing a partition.
  Confirmation and transfer files are parsed closed absence records and contain
  neither values nor commitments.
- State and operation ceilings are equal within a profile. Actual operations,
  writes, resets, cleared bytes, RNG updates, typed nulls, and abstentions stay
  visible. A typed operation-cap failure preserves its observed loss and
  actions; its charged loss is 100 and its maximum resource charges occupy
  separate fields. Policy/evaluator exceptions retain one task denominator
  with typed nulls and the same finite charges, including after a clean replay
  where the transient exception does not recur. A thrown, truncated, or
  malformed generator result marks the pack `INVALID` before any output
  directory or partial ledger is created.
- Energy is neither measured nor modeled. Joule, watt, carbon, and energy-
  efficiency conclusions are forbidden.

## Commands

```text
node experiments/workstation/fixture-023/runner.mjs prepare --profile smoke
node experiments/workstation/fixture-023/runner.mjs smoke --profile smoke --output experiments/workstation/runs/fixture-023-smoke --resume false
node experiments/workstation/fixture-023/runner.mjs run --profile development --output experiments/workstation/runs/fixture-023-development --resume false
node experiments/workstation/fixture-023/runner.mjs analyze --output experiments/workstation/runs/fixture-023-development
node experiments/workstation/fixture-023/runner.mjs validate --output experiments/workstation/runs/fixture-023-development
```

`smoke` executes, analyzes, and validates. `run` creates the append-only raw
development ledger and checkpoint. Existing output is refused unless resume is
explicit. There is no confirmation, transfer, release, promotion, or energy
action.

## Integrity and resume

Each raw event binds SHA-256 snapshots of the source audit, F-023 fixture,
runner, selected configuration, closed output schema, public seed document,
and both unavailable private-partition documents. The run embeds one canonical
identity that is compared in full with current inputs, every event, and the
checkpoint. The shared checkpoint ledger reconstructs authority from the
append-only raw record chain, rejects torn or altered records, reconciles the
final-record crash window, and produces byte-identical output after resume.
The F-023 wrapper additionally rejects unknown checkpoint fields, verifies
every record against freshly generated canonical work content and order, and
writes `run.json` through a durable atomic replacement. An explicitly resumed
complete raw/checkpoint pair can reconstruct a torn `run.json`; a valid but
different run document is never overwritten.

Analysis reports observed and charged loss, operations, persistent writes,
resets, cleared bytes, and RNG updates separately for every arm; a punitive
failure charge therefore cannot masquerade as observed policy behaviour.

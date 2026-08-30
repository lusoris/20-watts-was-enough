# Fixture 029 CMB-X01 + CMB-X04 public-development smoke suite

This directory contains deterministic, CPU-only aggregate-construction
diagnostics for two slices of Fixture F-029: `CMB-X01` / `C-1574` and
`CMB-X04` / `C-1580`. The suite receipts the two subruns without comparing,
ranking, pooling, or allowing one track to rescue the other. `CMB-X02` and
`CMB-X03` are not implemented.

Every event and command response is `NO_RESULT`. This harness is public
development plumbing, not confirmation evidence, a workstation-ready protocol,
an energy measurement, or authority for a scientific or performance claim.
Each subrun JSONL row is an aggregate **construction record** for one fixed
world--arm work unit. It is not a complete protocol-native action/event trace.

## What is fixed

1. All seven registered CMB-X01 arms and all eight registered CMB-X04 arms
   execute on every fixed synthetic world in their respective subruns.
2. Exogenous random streams exclude the arm ID, preserving paired
   counterfactual draws across arms. The CMB-X01 commitment covers every
   reachable geometry and mediator-leakage retry draw, not only attempt zero.
3. CMB-X01 separates actionable target evidence from evaluator-only latent
   target and productive-geometry state; CMB-X04 separates actionable phase,
   release-cue and registry observations from evaluator-only compatibility,
   hazard and release truth.
4. CMB-X01 fixes equal engine/action authority across occupancy, direct,
   garbage-collection, queue, recruitment and oracle diagnostics. CMB-X04
   fixes at most two simultaneous copies,
   three lifetime copies, and two sequential retries. The oracle alone fails
   information parity and remains diagnostic-only.
5. CMB-X01 target, mediator, queue and engine inventories, an untreated
   arm-independent service opportunity, registered harm ceilings, queue tail,
   pending-work limits and declared synthetic counters are recomputed. A null
   queue percentile passes only when no request remains pending.
6. CMB-X04 copy and artifact conservation, accepted service, protected
   integrity/release/tail limits and declared counters are recomputed. Analysis
   independently replays every seeded world--arm payload before trusting a
   correctly shaped or correctly rehashed ledger.
7. The CMB-X04 control grid includes perfect latent compatibility with guaranteed
   physical release, zero transit hazard, blocked release, plausible-surface
   incompatibility, inverted cues, short lifetime and weak association. The
   CMB-X01 grid includes no harm, no engine capacity, zero productive geometry,
   saturation, no resynthesis/replacement and cross-compartment leakage.

## Accounting and authority boundary

- CMB-X01 closes its declared target, mediator, queue and engine inventories;
  CMB-X04 closes copy creation, transport, loss, activation, binding,
  invalidation and destruction in a separate conservation ledger.
- Every CMB-X01 dequeue/requeue mutation is charged and the queue-flow and byte
  equations are runtime-validated. CMB-X04 reports transport writes separately
  from reconstructed-artifact materialisation writes before summing total
  bytes written.
- Logical operations; transported, read, and written bytes; retained
  byte-steps; wrapper construction, compatibility, release, cleanup, retry,
  replication, reload, and rebuild work remain separate counters.
- `resource_ledger_complete` means only that every declared synthetic
  construction counter is present, nonnegative, and conserved. It does not
  claim complete protocol-native lifecycle or comparative cost accounting.
- `wrapper_byte_steps` uses the declared 128-byte wrapper state, never artifact
  bytes as a proxy.
- Per-arm CPU time, wall time, and peak memory are deliberately not comparative
  endpoints. Each event records that bounded process-measurement exclusion.
- No counter is joules, watts, carbon, or evidence of energy efficiency.
- Confirmation and held-out seeds do not exist.

## Commands

From the repository root:

```bash
node experiments/workstation/fixture-029/suite-runner.mjs prepare --profile smoke
node experiments/workstation/fixture-029/suite-runner.mjs smoke --profile smoke --output tmp/fixture-029-smoke --resume false
node experiments/workstation/fixture-029/suite-runner.mjs run --profile development --output tmp/fixture-029-development --resume false
node experiments/workstation/fixture-029/suite-runner.mjs analyze --output tmp/fixture-029-development
node experiments/workstation/fixture-029/suite-runner.mjs validate --output tmp/fixture-029-development
```

Focused tests:

```bash
node --test --experimental-test-isolation=none experiments/workstation/fixture-029/cmb-x01-contract.test.mjs experiments/workstation/fixture-029/cmb-x01-runner.test.mjs experiments/workstation/fixture-029/contract.test.mjs experiments/workstation/fixture-029/runner.test.mjs experiments/workstation/fixture-029/suite-runner.test.mjs
```

Each subrun and the two-receipt suite ledger use canonical LF JSONL in an
append-only SHA-256 chain. Resume state is reconstructed from those records;
replaceable checkpoints cannot override them. Closed runtime contracts and
ordinary JSON Schemas reject unknown or malformed authority fields. Suite
protocol v2 binds both public configurations, the shared uint32 development
seed pack, subrun identities, runtime contracts, receipt/analysis schemas and
runners. The manifest's frozen profile also verifies the embedded seed and
track-configuration hashes. Passing it remains `NO_RESULT`.

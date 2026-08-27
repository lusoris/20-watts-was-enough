# Fixture 029 CMB-X04 public-development smoke harness

This directory contains a deterministic, CPU-only diagnostic for the `CMB-X04`
slice of Fixture F-029 and claim scope `C-1580`. It exercises phase-qualified
preservation and release against validation with retry, budget-matched
replication, checkpoint reload, reconstruction, no intervention, permanent
binding, and an ineligible oracle ceiling.

Every event and command response is `NO_RESULT`. This harness is public
development plumbing, not confirmation evidence, a workstation-ready protocol,
an energy measurement, or authority for a scientific or performance claim.
Each JSONL row is an aggregate **construction record** for one fixed
world--arm work unit. It is not a complete protocol-native action/event trace.

## What is fixed

1. All eight registered CMB-X04 arms execute on every fixed synthetic world.
2. Transit and release random streams exclude the arm ID, preserving paired
   counterfactual draws across arms.
3. Actionable observations contain typed public metadata, a noisy release cue,
   and a surface compatibility registry result. Evaluator-only compatibility,
   hazard, and release truth open only after the action transcript is fixed.
4. Every arm has the same declared authority: at most two simultaneous copies,
   three lifetime copies, and two sequential retries. The oracle alone fails
   information parity and remains diagnostic-only.
5. Copy and artifact conservation, accepted-service task performance, protected
   integrity/release/tail limits, and resource completeness are recomputed by
   the runtime validator.
6. The control grid includes perfect latent compatibility with guaranteed
   physical release, zero transit hazard, blocked release, plausible-surface
   incompatibility, inverted cues, short lifetime, and weak association.

## Accounting and authority boundary

- Copy creation, transport, loss, activation, binding, invalidation, and
  destruction form a closed conservation ledger.
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

```powershell
node experiments/workstation/fixture-029/runner.mjs prepare --profile smoke
node experiments/workstation/fixture-029/runner.mjs smoke --profile smoke --output tmp/fixture-029-smoke --resume false
node experiments/workstation/fixture-029/runner.mjs run --profile development --output tmp/fixture-029-development --resume false
node experiments/workstation/fixture-029/runner.mjs analyze --output tmp/fixture-029-development
node experiments/workstation/fixture-029/runner.mjs validate --output tmp/fixture-029-development
```

Focused tests:

```powershell
node --test --test-isolation=none experiments/workstation/fixture-029/contract.test.mjs experiments/workstation/fixture-029/runner.test.mjs
```

Raw events are canonical LF JSONL in an append-only SHA-256 chain. Resume state
is reconstructed from those events; the replaceable checkpoint cannot override
them. The run identity binds the public configuration, seed list, protocol
source, audit, runtime contract, generator, runner, schema, and shared ledger.

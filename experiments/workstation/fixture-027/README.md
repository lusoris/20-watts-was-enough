# Fixture 027 public-development CPU smoke harness

This directory contains a deterministic, CPU-only diagnostic harness for the
`RIN-T01` slice of Fixture F-027. It exercises source/load interconnection,
interface validation, removal of the binding edge, bounded synthetic
insulation, saturation reporting, append-only accounting, and exact resume.

Every event and every successful command response is labelled `NO_RESULT`.
This harness is development plumbing, not an execution of the registered
confirmation protocol and not evidence for a scientific, comparative,
performance, or energy claim.

## What the smoke diagnostic does

For each public seed, the generator emits a class-balanced set of six
synthetic worlds:

1. zero downstream load;
2. weak supported load;
3. strong connection-induced back-action;
4. back-action within a finite insulation envelope;
5. a saturated insulation envelope; and
6. a malformed interface record.

The three diagnostic arms are:

1. `isolated-assumption`, which exposes the miss incurred by treating the
   connected source as isolated;
2. `load-aware-interface`, which records whether the declared connection
   changes the source trajectory beyond the smoke threshold; and
3. `bounded-insulation-diagnostic`, which records finite restoration,
   synthetic action in normalized signal units, and saturation.

The source integrator also records a binding-only mass-closure residual and
checks that both registered edge-removal interventions (`load_total = 0` and
`binding_on = 0`) collapse the connection effect to binary64 tolerance. The
bounded-insulation arm is only a plumbing diagnostic; it does not expand the
claim scope beyond `RIN-T01` / `C-1550`.

## Authority boundary

- The signal unit `U` is a normalized synthetic concentration unit.
- `insulation_action_u` is integrated synthetic driver action, not joules.
- `accepted_*` counters cover only a schema-valid interface payload and the
  declared downstream arm model. `declared_arm_scalar_operations` is a
  synthetic model counter; generator and validator work is deliberately
  excluded rather than misreported as arm performance.
- `serialized_event_bytes_written` is the observed UTF-8 JSONL line size,
  including its integrity envelope. None of these counters is energy.
- Confirmation and transfer seeds are deliberately unavailable.
- The smoke grid is not the full RIN-T01 generator, lacks an independent
  numerical reference, and cannot satisfy the fixture's promotion contract.
- No output permits cross-arm inference or promotion.

## Commands

From the repository root:

```bash
node experiments/workstation/fixture-027/runner.mjs prepare --profile smoke
node experiments/workstation/fixture-027/runner.mjs smoke --profile smoke --output experiments/workstation/runs/fixture-027-smoke --resume false
node experiments/workstation/fixture-027/runner.mjs run --profile development --output experiments/workstation/runs/fixture-027-development --resume false
node experiments/workstation/fixture-027/runner.mjs analyze --output experiments/workstation/runs/fixture-027-development
node experiments/workstation/fixture-027/runner.mjs validate --output experiments/workstation/runs/fixture-027-development
```

Run the targeted tests without test-process isolation on hosts that prohibit
test-worker processes:

```bash
node --test --experimental-test-isolation=none experiments/workstation/fixture-027/contract.test.mjs experiments/workstation/fixture-027/runner.test.mjs
```

The ordinary `node --test` form is also valid where the runtime may spawn test
workers.

## Files and integrity

- `configs/` contains the public smoke and development profiles.
- `seeds/development.reveal.json` is the literal public seed list.
- `seeds/*.unavailable.json` prove that private partitions were not created.
- `generator.mjs` owns deterministic data generation and interface checking.
- `registry.mjs` freezes all ten RIN protocol IDs while marking only RIN-T01
  implemented by this harness.
- `contract.mjs` is the exact runtime event validator.
- `output.schema.json` binds the checked schema to that runtime validator.
- `runner.mjs` owns execution, analysis, validation, and resume.

Raw events are newline-delimited JSON in an append-only SHA-256 chain. The
checkpoint is reconstructed from raw events and cannot override them. A run
identity binds the configuration, seed pack, contract, generator, runner,
schema, and shared ledger implementation.

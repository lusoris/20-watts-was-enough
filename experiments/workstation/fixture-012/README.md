# Fixture 012 workstation harness

This is the executable synthetic slice of
[Fixture F-012](../../fixtures/012-layout-randomized-performance-inference.md).
It is **smoke-ready**, not a scientific or workstation result.

The generator sets the true layout-population effect to zero. A hostile
fixed-layout negative control repeatedly measures a favorable layout and
reports a false speedup. The complete mature null samples every configured
layout, counterbalances run order, and estimates at the independent-study
level. The operator-qualified arm receives identical observations and budgets
and must reproduce the mature null exactly.

![Noise-free synthetic expectation: favorable fixed-layout selection manufactures an apparent speedup, while complete-layout and operator-qualified analyses recover the population null](../../../public/plots/fixture-012-layout-selection.svg)

The figure is regenerated from the smoke configuration through the same
deterministic fixture generator with process and repeat noise disabled. Its
percentages and millisecond means are analytical fixture expectations, not
measured runtime or a performance claim.

Every raw event is validated before append and belongs to a contiguous SHA-256
chain. Analysis is rebuilt from the raw JSONL ledger. It refuses modified
events, forged/replayed appends, inconsistent run metadata, altered summaries,
or any output that asserts claim or scientific authority.

Run from the repository root:

```powershell
npm run workstation:fixture-012 -- prepare --profile smoke
npm run workstation:fixture-012 -- smoke --profile smoke --output experiments/workstation/runs/fixture-012-smoke
npm run workstation:fixture-012 -- run --profile development --output experiments/workstation/runs/fixture-012-development
npm run workstation:fixture-012 -- analyze --output experiments/workstation/runs/fixture-012-development
npm run workstation:fixture-012 -- validate --output experiments/workstation/runs/fixture-012-development
```

The smoke profile writes 1,536 events. The deterministic development profile
writes 27,648 events. Output directories and the raw ledger are created
exclusively; reruns must use a new directory.

## Physical workstation-development lane

The separate [operator runbook](WORKSTATION-RUNBOOK.md) defines a bounded
process-acquisition lane. It performs fresh seed-qualified rebuilds, requires
normalized structural layout manifests, randomizes layout order,
counterbalances variant order, excludes declared warmups, records exact
launcher start/exit timestamps, captures thermal and frequency samples,
checks exact stdout correctness, and stores content-identified provenance.
Complete layouts form a durable SHA-256 ledger with exact layout-boundary
resume, an authoritative-ledger checkpoint, and an exclusive campaign lock.
The process/CLI integration suite exercises paths containing spaces, stale
checkpoint repair, concurrent-writer refusal, binding corruption, raw-ledger
corruption, and redirected-path rejection.

```powershell
npm run workstation:fixture-012:physical -- prepare --config <experiment.json> --adapter-config <adapter.json>
npm run workstation:fixture-012:physical -- acquire --config <experiment.json> --adapter-config <adapter.json> --output <run-directory>
npm run workstation:fixture-012:physical -- validate --config <experiment.json> --output <run-directory>
```

The lane is development-only and is not the manifest's canonical confirmation
runner. Physical Windows execution currently fails closed with
`WINDOWS_JOB_OBJECT_REQUIRED`; the test-only direct-child bypass is not exposed
as a CLI option. A reviewed Job Object supervisor is required before the lane
can execute arbitrary workstation commands on Windows. POSIX execution uses a
detached process group and waits for termination. The default configuration is
latency-only. Selecting joules additionally requires a positive uncertainty
floor and an unexpired, content-identified calibration certificate for an
external cumulative-energy provider whose samples enclose every measured
interval; energy-claim authority still remains false.

Current limits are binding: synthetic smoke timing and energy remain modeled,
physical development seeds are visible, the Windows process-tree boundary is
not implemented, no compiler/linker/workload release is frozen, no real
confirmation or independent replication has been recorded, and confirmation
and held-out seed commitments remain pending. Consequently every synthetic and
development output retains `claim_eligible: false` and
`scientific_result: false`; workstation records additionally retain
`energy_claim_eligible: false`. The manifest remains `smoke-ready`.

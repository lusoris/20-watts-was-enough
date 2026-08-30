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

```bash
npm run workstation:fixture-012 -- prepare --profile smoke
npm run workstation:fixture-012 -- smoke --profile smoke --output experiments/workstation/runs/fixture-012-smoke
npm run workstation:fixture-012 -- run --profile development --output experiments/workstation/runs/fixture-012-development
npm run workstation:fixture-012 -- analyze --output experiments/workstation/runs/fixture-012-development
npm run workstation:fixture-012 -- validate --output experiments/workstation/runs/fixture-012-development
```

The smoke profile writes 1,536 events. The deterministic development profile
writes 27,648 events. Output directories and the raw ledger are created
exclusively; reruns must use a new directory.

## Physical execution is not implemented

The former host-specific acquisition lane has been removed. The repository no
longer carries a second supervisor, build script, shell harness or platform-
specific operator runbook for this fixture. A replacement must use portable Go
for its public entry point and keep platform details behind tested packages.
It must still freeze build and workload identities, contain descendants, bind
paths against substitution, retain append-only receipts, measure launch-to-exit
time and expose calibrated energy uncertainty when energy is in scope. Those
requirements cannot be inferred from language portability, so each admitted
operating system needs focused failure-path tests before the manifest can claim
a physical development lane.

Current limits are binding: synthetic smoke timing and energy remain modelled;
no physical acquisition implementation, compiler/linker/workload release,
real confirmation or independent replication exists; and confirmation and
held-out seed commitments remain pending. Every output therefore retains
`claim_eligible: false` and `scientific_result: false`. The manifest remains
`smoke-ready`.

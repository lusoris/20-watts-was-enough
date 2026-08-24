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
runner. Physical Windows execution now requires the checked-in C# Job Object
supervisor, its PowerShell harness, a locally compiled assembly, and the exact
PowerShell host binary to be content-identified in the adapter configuration.
On Windows 10/Server 2016 or later, the supervisor establishes
`KILL_ON_JOB_CLOSE` and uses `PROC_THREAD_ATTRIBUTE_JOB_LIST` to assign each
suspended target atomically during creation, before its first instruction, then resumes
it, records QueryPerformanceCounter launch-to-exit timestamps, and kills and
waits for all remaining job descendants on every handled exit. A host crash is
contained eventually by Windows closing the last kill-on-close Job handle; the
crashed host cannot itself wait. The adapter executes the already-hashed
  PowerShell harness snapshot through an encoded command under a separate minimal
  host environment. The C# helper rejects reparse-point paths, acquires monitored
  directory R oplocks parent-before-child, rejects every root except the protected
  Windows system-volume drive, and requires each identified leaf to have one
  hard-link name and a readable NTFS per-file USN. It denies ordinary and mapped
  writes under the Windows sharing contract, then rechecks file ID, attributes,
  reparse tag, link count, USN, directory guards, and the suspended process image
  before resume and throughout execution. A guard break or USN change terminates
  the whole job and is retained as `PATH_IDENTITY_BREAK`.
  A zero-exit leader that leaves a
live descendant is retained as `PROCESS_TREE_LEAK`, not accepted. A missing or changed supervisor
identity still fails closed with `WINDOWS_JOB_OBJECT_REQUIRED` or an identity
error; the fixture-only direct-child path is not a CLI option. POSIX execution
uses a detached process group and waits for termination. The default
configuration is latency-only. Selecting joules additionally requires a positive uncertainty
floor and an unexpired, content-identified calibration certificate for an
external cumulative-energy provider whose samples enclose every measured
interval; energy-claim authority still remains false.

The supervisor is an evidence-integrity and process-containment mechanism, not
a security sandbox or a security guarantee. “Fail closed” applies only to the
declared adapter contract and handled failure paths; it does not cover a
misqualified ACL boundary, compromised operating system, PowerShell or .NET
runtime, local-administrator access, or kernel compromise. The operator
runbook's [canonical Windows behavior inventory](WORKSTATION-RUNBOOK.md#canonical-windows-behavior-inventory)
separates behavior exercised directly by a scoped test from behavior supported
only through a shared implementation invariant.

Current limits are binding: synthetic smoke timing and energy remain modeled,
physical development seeds are visible, the PowerShell-host supervisor and
10-ms path/USN polling overhead have not been characterized for performance or
energy work, the operator must qualify the ACL-protected operating-system
PowerShell/.NET installation that remains the bootstrap trust root, no
compiler/linker/workload release is frozen, no real
confirmation or independent replication has been recorded, and confirmation
and held-out seed commitments remain pending. Consequently every synthetic and
development output retains `claim_eligible: false` and
`scientific_result: false`; workstation records additionally retain
`energy_claim_eligible: false`. The manifest remains `smoke-ready`.

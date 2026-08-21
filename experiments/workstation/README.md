# Workstation execution contract

The repository now contains one executable smoke harness alongside research and
protocol specifications, but no workstation-ready scientific package. A test
becomes workstation-ready only when its
checked manifest exists at `experiments/workstation/manifests/<artifact-id>.json`,
passes `npm run validate:workstation`, declares `workstation-ready`, names all
six fields below, and binds a hashed multi-domain hardware-confirmation evidence
bundle. A `smoke-ready` manifest proves only that the deterministic plumbing
runs; it does not upgrade any claim to workstation-executable.

1. **Command:** one non-interactive entry point with `prepare`, `smoke`, `run`,
   and `analyze` actions that returns a nonzero exit code when preparation,
   execution, analysis, or registered acceptance checks fail.
2. **Environment:** locked operating-system, driver, runtime, library, and
   container or environment identities.
3. **Hardware:** supported CPU, GPU, memory, storage, power-meter, and thermal
   assumptions, including a smaller smoke-test profile where possible.
4. **Seeds:** immutable development, confirmation, and held-out seed manifests;
   the confirmation set must remain unavailable during tuning.
5. **Data:** generation or acquisition procedure, versions, hashes, licenses,
   partitions, and cache locations.
6. **Outputs:** append-only raw events, measurements with units and uncertainty,
   machine-readable decisions, plots, and a reproducibility manifest.

## Required runner behavior

The future runner must support four separate actions:

1. `prepare` validates dependencies, disk space, hardware support, and data;
2. `smoke` completes a small deterministic run without claiming a result;
3. `run` executes a frozen experiment or named track; and
4. `analyze` rebuilds every aggregate and plot from raw outputs and evaluates
   the registered rejection rules.

Resuming an interrupted run must not change seeds or silently discard failures.
Energy runs must retain raw meter samples, wall-clock boundaries, idle policy,
device and software identity, sampling cadence, and uncertainty. Modeled and
measured joules remain separate output fields.

## Promotion sequence

1. Complete the written protocol gate in [test coverage](../test-coverage.md).
2. Implement the smallest deterministic simulator and strongest ordinary null.
3. Add budget-enforcement and accounting unit tests before the candidate.
4. Add a smoke profile that runs on an ordinary machine.
5. Freeze configuration, seeds, analysis, and rejection rules.
6. Only then add the full workstation profile and measured-energy instrumentation.

The coverage audit reports zero executable claims until manifests and their
referenced files actually exist.

The machine-readable contract is
[`manifest.schema.json`](manifest.schema.json). Referenced lockfiles, seed
manifests, generators, output schemas, runner entrypoints, and tests must exist
inside the repository. The coverage audit no longer treats six arbitrary
non-empty JSON fields as proof of execution readiness.

## Current implementation

[Candidate 010](candidate-010/README.md) now has the first validated
`smoke-ready` harness. It exercises deterministic paired opportunities, seven
eligible null/candidate arms, an oracle ceiling, real filesystem staging and
rollback, append-only raw events, declared-boundary checkpoint resume,
external-energy provenance validation, frozen design/analysis modules, and
reproducibility hashes. Its complete implementation test executes all 48
factorial scenarios through four isolated local effect boundaries with no
physical actuation. Retry/rollback now crosses two actual effect lifecycles, and
the independent-verifier comparator uses a separately implemented detector.
A separate persistent-service diagnostic exercises commit, reset, later
commit, stale-version refusal, and declared-interruption reconciliation on
transactional-KV and simulated-actuator instances. Resume is bound to the full
executable source identity and revalidates complete durable history against the
ledger. Atomic ownership-checked leases reject concurrent factorial and
persistent writers before mutation. An eight-case deterministic
fault campaign makes reset leakage, incomplete rollback, precommit effects,
delayed cleanup, stale or corrupt verification, failed finalization, and an
irreversible-effect sentinel observable to the validator.

Those roots are isolated per opportunity–arm work unit, so the factorial path
still does not test concurrent shared-service contention. File `fsync` is now
requested for complete raw records and checkpoint replacements, while torn-tail
repair, directory-entry persistence, and arbitrary power-loss recovery remain
outside the contract. Writer contention is refused, not benchmarked, and stale
locks are not broken automatically. The persistent and fault tracks are local diagnostics,
not confirmation data. The strict seed-release and promotion-evidence builders
exist, but no real frozen release, interval-owned calibrated energy observation,
or validated evidence bundle exists. Six of nine **structural** promotion gates
pass; no result claim or workstation-executable claim coverage follows from
them.

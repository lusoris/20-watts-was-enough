# Workstation execution contract

The repository now contains nine executable smoke harnesses alongside research
and protocol specifications, but no workstation-ready scientific package:
[Candidate 010](candidate-010/README.md) exercises staged verification and
[Fixture F-007](fixture-007/README.md) exercises optical null-space honesty;
[Fixture F-012](fixture-012/README.md) exercises layout-population performance
inference; [Fixture F-019](fixture-019/README.md) exercises the FM-T02
endogenous-feedback forecast boundary;
[Fixture F-022](fixture-022/README.md) exercises the DEV-T01 positional-memory
corruption and fallback boundary;
[Fixture F-023](fixture-023/README.md) exercises the PLM-T01 duration-memory and
PLM-T02 lifecycle-reset boundaries; and
[Fixture F-024](fixture-024/README.md) exercises the AMR-T01 projected-memory
development path; [Fixture F-025](fixture-025/README.md) exercises the ECM-T03
record, amplitude, repeat-consistency, and equivalence gate order; and
[Fixture F-027](fixture-027/README.md) exercises the RIN-T01 interconnection,
edge-removal, interface-validity, and bounded-insulation diagnostics.
A test becomes workstation-ready only when its
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

[Fixture F-019](fixture-019/README.md) now implements the CPU-only FM-T02
forecast slice for C-1481 with a NumPy-PCG64DXSM generator, independently coded
reference solver, one-pass and full-feedback paths, zero-impact/overlap/funding
interventions, corruption-evident resume, and recomputed development analysis.
FM-v1/FM-T02 is structurally non-promotable: its validator and the central gate
reject every evidence bundle and every confirmation/held-out reveal, not only
the publicly derivable label hashes. The development shakedown found that the
frozen aggregate endpoint is effectively seed-invariant
under the protocol's symmetric shocks and proportional sales, so confirmation
is explicitly blocked pending a reviewed protocol revision. No result or
energy conclusion follows.

[Fixture F-022](fixture-022/README.md) implements a bounded public-development
smoke path for C-1506 / DEV-T01. It exercises valid, independent, local-patch,
and common-mode positional-memory states against an open-write diagnostic, a
robust propagation null, and a gated proposal. Common-mode corruption must
trigger abstention and charge the complete null fallback; valid memory must not
trigger a false fallback. The registered Potts/total-variation null, private
partitions, paired inference, and reference-workstation contract remain
unimplemented, so every output is `NO_RESULT`.

[Fixture F-023](fixture-023/README.md) implements bounded public-development
smoke paths for C-1516--C-1517 / PLM-T01--PLM-T02. The first path exercises
duration accumulation, a conventional duration filter, and independent
latches under interruption and missingness. The second exercises carried
state, a change-point null, and evidence-gated fractional reset; duplicate,
delayed, or missing lifecycle boundaries force reset-capable arms to abstain.
The two paths share closed accounting and authority contracts but make no
comparative, scientific, energy, or promotion claim.

[Fixture F-024](fixture-024/README.md) implements a bounded public-development
smoke path for C-1526 / AMR-T01. It generates stable two-variable linear
systems, executes Markov-only, finite-memory, and exact augmented-state paths,
and verifies finite clipped records through a corruption-evident checkpoint
ledger. The exact augmented arm is an analytical ceiling with evaluator state,
not a matched-information confirmation comparator. No confirmation or transfer
seed or commitment has been created; no comparison, performance result, energy
conclusion, or claim eligibility follows.

[Fixture F-025](fixture-025/README.md) implements the first bounded
public-development execution slice for C-1532 / ECM-T03. It generates five
balanced spectrum classes, executes ungated, residual-screen, and ordered-gate
paths, and requires record/provenance failure to stop before physics probes,
nonlinearity to stop at the amplitude gate, and terminal-equivalent circuits
to remain non-identifying. Its repeat statistic is a smoke surrogate rather
than the registered finite-band Kramers--Kronig calibration. The other nine
tracks, private partitions, physical apparatus, and scientific adjudication
remain absent; every event is `NO_RESULT`.

[Fixture F-027](fixture-027/README.md) implements a bounded public-development
smoke slice for C-1550 / RIN-T01. It generates six synthetic source--load
world classes (six worlds per smoke seed and 30 per development seed), verifies
mass closure and two independent edge-removal controls,
rejects malformed interfaces, records finite insulation and saturation, and
binds exact resume to a corruption-evident event chain. It does not implement
the registered reduced source model, approximation envelope, or dimensional
confirmation comparison. RIN-T02--RIN-T10, private partitions, physical
systems, calibrated energy and
scientific adjudication remain absent. Every event is `NO_RESULT`.

The machine-readable contract is
[`manifest.schema.json`](manifest.schema.json). Referenced lockfiles, seed
manifests, generators, output schemas, runner entrypoints, and tests must exist
inside the repository. The coverage audit no longer treats six arbitrary
non-empty JSON fields as proof of execution readiness.

## Current implementation

[Fixture F-012](fixture-012/README.md) provides a deterministic synthetic
negative control for fixed-layout performance claims. Its complete mature null
randomizes the declared layout population, counterbalances variant order, and
uses independent studies for uncertainty. An identically informed
operator-qualified arm must match the null exactly at equal observation,
modeled-work, and modeled-energy budgets. The append-only SHA-256 ledger and
recomputed analysis are hostile-tested, but timings and joules remain modeled
and no confirmation or held-out release exists.

F-012 also has a separate physical workstation-development acquisition lane.
It can rebuild seed-qualified executable layouts, measure real process latency,
capture thermal/frequency telemetry, enforce exact correctness, and optionally
bind calibrated cumulative-energy samples. Its append-only layout records can
resume only at complete layout boundaries. This narrows the implementation gap
but does not change manifest readiness: the physical lane uses visible
development inputs and has no frozen release, confirmation analysis, independent
replication, or promotion evidence.

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
persistent writers before mutation. Source discovery freezes the execution
manifest, every production module, every registered test, the golden fixture,
and relative imports from both production and test code. A shared
runtime event contract validates smoke and factorial records before append and
again before analysis. An eight-case deterministic
fault campaign makes reset leakage, incomplete rollback, precommit effects,
delayed cleanup, stale or corrupt verification, failed finalization, and an
irreversible-effect sentinel observable to the validator.

Those roots are isolated per opportunity–arm work unit, so the factorial path
still does not test concurrent shared-service contention. File `fsync` is now
requested for complete raw records, persistent identity and receipt metadata,
checkpoints, and final run replacements, while torn-tail repair, directory-entry
persistence, and arbitrary power-loss recovery remain outside the contract.
The harness now inventories the exact local Node executable and installed
production-dependency bytes, materializes clean-`HEAD` source plus capsule-local
dependencies outside the repository, and launches a fixed child that verifies
those identities before importing Candidate code. Confirmation refuses the
ordinary worktree runner and requires a callback-scoped capsule capability plus
a release binding the same source, descriptor, runtime, dependencies, config,
design, and seeds. This is an implemented confirmation boundary, not a result:
no real frozen release, calibrated interval-owned energy record, or promotion
evidence bundle exists.
Writer contention is refused, not benchmarked, and stale locks are not broken
automatically. The persistent and fault tracks are local diagnostics,
not confirmation data. The strict seed-release and promotion-evidence builders
exist, but no real frozen release, interval-owned calibrated energy observation,
or validated evidence bundle exists. Six of nine **structural** promotion gates
pass; no result claim or workstation-executable claim coverage follows from
them.

The future confirmation operator is the explicit `capsule-confirmation` action
documented in the [Candidate 010 harness](candidate-010/README.md). It accepts a
version-3 release root, release document, disjoint seed-pack artifacts, and an
output directory; it does not accept a profile or raw confirmation seeds.
Interrupted invocations reuse one durable launch precommit. The completed
parent receipt and setup-cost record are separate from the earlier run identity,
and the inclusive child envelope is never added to arm cost a second time.

The same harness documents `capsule-promotion-build`, which creates evidence
and its validation receipt together. A readiness check subsequently rebuilds
the exact release-bound commit and recomputes the evidence; stored self-hashes
alone cannot pass the final gate.

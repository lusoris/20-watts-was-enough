# Candidate 010 workstation harness

This is the first executable layer of
[Candidate 010](../../candidates/010-reset-coupled-staged-verification.md).
It is deliberately **smoke-ready, not workstation-ready**.

The current harness provides:

1. deterministic correlated cheap evidence plus a verifier constructed only by
   temporary execution; non-oracle policies receive neither the latent truth nor
   the trace-construction job;
2. all seven original eligible arms, a trace-withholding ablation, and the
   ineligible oracle ceiling;
3. a correlation-conditioned sequential-test baseline;
4. the same real filesystem stage, temporary-execution, and commit/reset
   boundary for every arm, with boundary timing and byte counts; every modeled
   arm is also charged the temporary-execution term whether or not its policy
   receives the trace;
5. append-only raw opportunity-by-arm events and deterministic
   declared-checkpoint resume rebuilt from that ledger rather than a mutable
   record counter;
6. a checkpoint identity bound to the configuration, ordered seed pack, and
   work schedule, with mismatch, duplicate, corruption, and truncated-tail
   rejection; complete ledger records and checkpoint replacements request file
   `fsync`, while directory-entry persistence and arbitrary power-loss recovery
   remain outside the claim;
7. a byte-exact executable source bundle covering the generator, policies,
   trace job, adapters, runner, analysis, release validator, configs, lockfile,
   and current Git commit; resume and validation reject a changed bundle;
8. a frozen-release contract that derives confirmation authority only after
   source, config, design, registry, preregistration, seed commitment, reveal,
   and cross-partition disjointness all verify; no real release exists yet;
9. separate modeled and measured energy paths: external wall/rail readings need
   meter, calibration, interval, clock, boundary, uncertainty, and integrity
   records; fixtures and software telemetry cannot become measured-energy
   evidence;
10. a bounded 48-scenario factorial contract, six registered comparator
   policies, equal-budget accounting, held-out task-family contracts, and a
   multiplicity-controlled confirmatory analyzer that refuses
   smoke/development claims; retry/rollback now executes and charges two real
   effect lifecycles, while the independent-verifier arm uses a separately
   implemented and provenance-checked detector;
11. four common-interface effect boundaries: filesystem publication,
   hash-linked transactional KV, Ed25519-signed append-only publication, and a
   versioned local actuator simulator with physical actuation forbidden;
12. a complete 48-scenario implementation test that sends all six comparators and the
    candidate through every backend, exercises trace/reset ablations, checks
    paired budgets and rollback/commit proofs, and remains claim-ineligible;
13. deterministic scientific-payload hashes, a per-record SHA-256 hash chain,
   corruption detection, and a committed golden smoke/checkpoint digest;
14. a longitudinal diagnostic that drives transactional-KV and simulated-
    actuator instances through commit, reset, later commit, and stale-version
    refusal without recreating the service between operations, binds resume to
    the complete executable source identity, and revalidates the full durable
    history against the completed ledger;
15. an eight-case deterministic fault campaign covering reset leakage,
    incomplete rollback, precommit effects, delayed cleanup, stale or corrupt
    verification, failed finalization, and an irreversible-effect sentinel;
16. tests for generation, conditioning, trace revelation, rollback, commit,
    resume equivalence, seed sealing, energy rejection, budget parity,
    confirmatory abstention/kill rules, and smoke reproducibility; and
17. atomic, ownership-checked single-writer leases for factorial and persistent
    output roots, with contention rejected before mutation and no automatic
    stale-lock breaking.

Run:

```powershell
npm run workstation:candidate-010 -- prepare --profile smoke
npm run workstation:candidate-010 -- smoke --profile smoke
npm run workstation:candidate-010 -- factorial --profile development --splits development --output <run-directory>
npm run workstation:candidate-010 -- factorial --profile development --splits development --output <run-directory> --resume true
npm run workstation:candidate-010 -- analyze --output <run-directory>
npm run workstation:candidate-010 -- validate --output <run-directory>
npm run test:workstation
```

Generated runs are ignored under `experiments/workstation/runs/`. Each run
retains raw JSONL events, the exact config and seeds, environment identity, a
scientific digest, checkpoint identity, filesystem effects, optional raw and
normalized external-meter provenance, and a derived summary. The
[`energy-reading.template.json`](energy-reading.template.json) is intentionally
invalid until real meter, calibration, interval, uncertainty, and readings are
entered. A single whole-run reading can exercise the non-factorial plumbing but
is rejected for the interleaved factorial package because it cannot be assigned
to arms without a declared interval design.

## Current structural gate state: 6/9

The structural gates currently pass exact claim scope, frozen-profile hash,
the complete factorial implementation test, corruption-evident ledger
integration with declared-boundary resume tests, and external-meter provider
capability.
They still fail confirmation seeds, held-out seeds, and the final readiness
declaration with validated hardware evidence.

This is deliberate. Seed packs will be freshly generated and sealed only after
the runner, task backends, design, analysis, and meter contract are frozen.
Seeds that were visible during implementation are ineligible for confirmation.
The release validator is executable, but the repository deliberately contains
no real confirmation release document or revealed seed pack.

## Exact implementation limits

- The factorial runner gives every opportunity–arm work unit a fresh isolated
  effect root. A separate longitudinal diagnostic now exercises persistent
  transactional-KV and actuator history, including stale-version refusal and
  recovery from a declared interruption after backend finalization, but the
  main factorial does not yet test concurrent shared-service contention.
  Concurrent writers are refused rather than used as an experimental factor.
- Ledger appends and checkpoint replacements request file `fsync`, and a
  truncated final record fails closed. This does not establish directory-entry
  persistence, recovery by truncating a torn tail, or safety under arbitrary
  process, filesystem, or power-loss crashes.
- Retry/rollback and independent verification now have distinct executable
  mechanics. They remain local synthetic comparators rather than evidence that
  either mechanism is independent or effective in a deployed system.
- The eight-case fault campaign actively produces and detects declared failure
  modes, but it is a separate nonphysical diagnostic rather than a factorial or
  external failure-rate result. Zero violations in ordinary implementation
  scenarios still establish plumbing behavior only.
- The strict release validator and promotion-evidence builder exist, but no
  real frozen confirmation or held-out release and no validated promotion
  evidence bundle exist.
- No interval-owned calibrated energy observation has been collected or bound
  to factorial assignments. The current provider tests validate the contract,
  not an energy result.

## Why this does not yet count as an experiment result

The smoke profile contains only 64 paired opportunities. Its coefficient and
threshold values exercise the pipeline; they are not frozen confirmatory
choices. Confirmation and held-out seed files contain no disclosed seeds or
commitment yet. The four implemented task families are local, synthetic effect
boundaries; their passing tests establish executable contracts, not external
validity. The persistent-service and injected-fault tracks likewise test
declared local invariants, not superiority or field reliability. No calibrated
hardware reading has been collected, and a whole-run
reading cannot be silently allocated to interleaved arms. The synthetic trace
generator is not evidence that a real temporary action exposes useful
information. The 48-scenario run is therefore an implementation and
falsification diagnostic, not a superiority result.

The manifest limits this execution track to primary claim `C-170`. Even after a
future workstation-ready promotion, the other claims linked to Candidate 010
remain protocol-only unless a manifest names and implements their own execution
tracks.

The next promotion step is therefore not a label change. Freeze the now-
executable package, generate genuinely unseen confirmation and held-out seed
commitments, collect interval-owned calibrated meter observations on the target
workstation, and build the validated confirmation bundle. Only then may the
manifest change from `smoke-ready` to `workstation-ready` and upgrade claim
coverage.

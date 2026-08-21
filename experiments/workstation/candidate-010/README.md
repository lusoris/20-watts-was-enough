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
5. append-only raw opportunity-by-arm events;
6. separate modeled and measured energy fields, with measured joules explicitly
   unavailable;
7. deterministic scientific-payload hashes, a per-record SHA-256 hash chain,
   corruption detection, and a committed golden smoke digest;
8. raw-axis analysis that makes no superiority claim; and
9. tests for generation, evidence conditioning, trace revelation versus
   withholding, rollback, commit, boundary parity, corruption rejection, and
   complete smoke reproducibility.

Run:

```powershell
npm run workstation:candidate-010 -- prepare --profile smoke
npm run workstation:candidate-010 -- smoke --profile smoke
npm run workstation:candidate-010 -- validate --output <run-directory>
npm run test:workstation
```

Generated runs are ignored under `experiments/workstation/runs/`. Each run
retains raw JSONL events, the exact config and seeds, environment identity, a
scientific digest, filesystem effects, and a derived summary.

## Why this does not yet count as an experiment result

The smoke profile contains only 64 paired opportunities. Its coefficient and
threshold values exercise the pipeline; they are not frozen confirmatory
choices. Confirmation and held-out seed files contain no disclosed seeds or
commitment yet. There is no resume/checkpoint path, factorial scenario matrix,
task-family holdout, multiplicity-controlled confirmatory analysis, calibrated
external energy meter, or registered promotion decision. The synthetic trace
generator is not evidence that a real temporary action exposes useful
information.

The manifest limits this execution track to primary claim `C-170`. Even after a
future workstation-ready promotion, the other claims linked to Candidate 010
remain protocol-only unless a manifest names and implements their own execution
tracks.

The project must add those pieces and then change the manifest from
`smoke-ready` to `workstation-ready` before Candidate 010 can upgrade any claim
in the coverage report.

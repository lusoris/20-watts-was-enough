# Candidate 010 workstation harness

This is the first executable layer of
[Candidate 010](../../candidates/010-reset-coupled-staged-verification.md).
It is deliberately **smoke-ready, not workstation-ready**.

The current harness provides:

1. deterministic correlated evidence and verifier generation;
2. all seven eligible arms plus the ineligible oracle ceiling;
3. a correlation-conditioned sequential-test baseline;
4. reversible staging, verified reset, and atomic filesystem commit;
5. append-only raw opportunity-by-arm events;
6. separate modeled and measured energy fields, with measured joules explicitly
   unavailable;
7. deterministic scientific-payload hashes and a committed golden smoke digest;
8. raw-axis analysis that makes no superiority claim; and
9. tests for generation, evidence conditioning, rollback, commit, and complete
   smoke reproducibility.

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
commitment yet. There is no resume/checkpoint path, corruption-resistant raw
ledger, factorial scenario matrix, multiplicity-controlled confirmatory
analysis, calibrated external energy meter, or registered promotion decision.

The project must add those pieces and then change the manifest from
`smoke-ready` to `workstation-ready` before Candidate 010 can upgrade any claim
in the coverage report.

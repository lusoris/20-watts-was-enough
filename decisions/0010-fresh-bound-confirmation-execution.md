# Decision 0010 — Execute confirmation under one fresh bound identity

**Status:** accepted
**Date:** 2026-08-21

## Context

Hashing source files after a long-running process has imported them does not
show that the process executed those bytes. The loaded module cache may predate
the hash, installed dependencies may differ from the lockfile, and a seed
release stored beside the worktree can accidentally validate the worktree
instead of the source selected for execution.

These are evidence-boundary failures. A corruption-evident result ledger cannot
repair them after execution because the uncertainty concerns which program
produced the ledger.

## Decision

Candidate 010 confirmation and held-out execution must start in a fresh process
under one versioned identity that binds:

1. clean regular source blobs from one exact Git commit;
2. the exact Node executable and runtime fields;
3. the lockfile and byte inventory of every installed production dependency;
4. a dependency-local execution capsule that does not resolve shared
   `node_modules`;
5. a release binding root distinct from the executable source root;
6. a fixed child entrypoint verified before Candidate modules are imported; and
7. a callback-scoped, nonserializable execution capability that the
   confirmation runner revalidates before run, resume, validation, or analysis.

Development and claim-ineligible implementation tests may remain in-process.
They cannot be relabeled as confirmation output. Confirmation analysis is
produced only after the completed raw ledger validates under the same capsule,
runtime, dependency, source, and release identities.

## Consequences

- Dirty, staged, untracked, linked, substituted, or extra executable files fail
  capsule construction or verification.
- A release cannot use its own binding directory as a substitute executable
  tree and must bind the runtime and execution-capsule descriptor it admits.
- Serialized booleans, copied fields, and reconstructed objects cannot grant
  execution authority.
- Resume and later validation require the same stable authority identities as
  the original run.
- The fresh process and its verification work belong in a separate run-level
  resource and timing record; they are not free infrastructure and are not
  silently allocated to experimental arms. The inclusive child-process
  envelope is diagnostic rather than additive, so the experiment action is not
  counted again as setup work.
- An interrupted run reuses one exact durable launch precommit. The final
  parent-validated receipt is created only after run, validation, and analysis
  complete; it cannot be part of the earlier run identity.
- Readiness and result-location metadata may change after execution without
  changing the frozen execution contract. Promotion nevertheless rebuilds the
  exact release-bound source commit and refuses if the current scoped source,
  tests, schema, dependencies, or claim contract differ.
- This decision does not establish malicious-host isolation. A hostile kernel,
  transient mutation restored between checks, firmware, drivers, or physical
  measurement integrity need a stronger external trust boundary.
- Structural implementation gates remain distinct from a frozen release,
  calibrated interval-owned energy data, valid confirmation evidence, and a
  scientific result.

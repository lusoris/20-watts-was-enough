# 0059 — Run one enforcing dependency audit per full gate

- **Status:** accepted
- **Date:** 2026-09-04
- **Related:** [0044](0044-shard-workstation-ci-without-splitting-test-authority.md), [0048](0048-gate-ready-pull-requests-with-the-full-ci-matrix.md), [0056](0056-keep-public-workflows-off-self-hosted-runners.md)

## Context

The CI matrix installs the same locked JavaScript graph in several independent
jobs. The npm 12.0.2 `ci` command enables its registry audit submission by
default. Those submissions report advisories but do not replace the explicit
`npm audit --audit-level=high --package-lock-only` command that defines the
repository's failing severity threshold against the canonical lockfile.

A full pull-request run sent every install-time audit concurrently and the
explicit audit timed out at the registry bulk-advisory endpoint. Repeating the
same network request in each shard adds external load and elapsed time without
adding an independent security decision.

## Decision

1. Every workflow dependency install uses the exact locked-tree command
   `npm ci --no-audit`. Installation remains deterministic while the implicit
   registry audit side effect is disabled.
2. The full CI quality job runs exactly one explicit lockfile audit after
   installation. The exact command retains the high-severity exit threshold,
   ignores `node_modules` through `--package-lock-only`, bounds a registry
   attempt to 30 seconds and allows one retry. Its exit status remains a
   required part of the aggregate CI decision.
3. The release verification job repeats that single explicit audit against the
   immutable release input. Publication-only and matrix-shard jobs do not
   duplicate it.
4. The engineering-policy validator scans every workflow job for an unsafe
   `npm ci`, duplicate audit command, reordered audit or failure bypass. This is
   an operational security boundary, not evidence for a scientific claim.

## Consequences

- Ordinary matrix width no longer multiplies audit traffic to the registry.
- A high-severity advisory or failure of the one enforcing command still fails
  the full CI or release gate.
- The audit service remains an external dependency of full verification; a
  service outage is visible once instead of being amplified by every shard.

## Supersession

Supersede this record if dependency auditing moves to a repository-native,
offline or independently mirrored advisory source with equivalent locked-input
and severity enforcement.

# 0075 — Isolate CI driver dependency closures

- **Status:** accepted
- **Date:** 2026-09-05
- **Extends:** [0052](0052-impact-scope-every-pull-request.md), [0054](0054-classify-script-impact-by-executable-consumer.md), [0062](0062-impact-scope-comparable-main-pushes.md)
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7)

## Context

The impact planner and hosted PDF reproducibility job both ran through the
public `20w` command. That executable also imports experiment, release and
GitHub packages. Their initialisation can run before command dispatch, so
moving an experiment handler into another imported package does not by itself
remove it from the planner or PDF proof's execution boundary.

The current selector therefore treats changes under `tooling/cmd/20w/` as
full-gate authority. PR 103 exercised that rule correctly: its full-quality job
took 512 seconds and the concurrent renderer job took 490 seconds. These are
GitHub job durations, not CPU or energy measurements. Their overlap prevents
adding them as potential wall-time savings.

## Decision

1. Keep `20w` as the public command. Move its existing plan/projection and PDF
   proof argument handling into `internal/ciplancli` and
   `internal/pdfrendercli`. Public and private callers share those functions;
   there is no second selector or renderer implementation.
2. Add two private CI entry points: `cmd/ci-plan` and `cmd/pdf-proof`. The
   hosted impact job uses the former for both planning and projection; the
   existing renderer-selected job uses the latter for its unchanged two-builder
   proof. Do not add jobs, credentials, schedules or publication authority.
3. Test each private executable's complete repository-package dependency
   closure. The planner admits only `ciplancli`, `ciplan` and `strictjson`; the
   PDF proof admits only `pdfrendercli`, `pdfrender`, `pdfrenderlock` and
   `strictjson`. A new imported package fails the test until reviewed.
4. Bind that test and hosted execution to Linux/amd64, disabled cgo, no Go
   workspace or persistent Go environment, the installed local toolchain and
   read-only module resolution without a proxy or checksum lookup. Bound the
   test's offline `go list` subprocess to 30 seconds and 64 KiB per stream.
5. Both private command directories and their shared adapters remain explicit
   selector or renderer authority. Preserve the conservative public-command
   rule, unknown-path fallback, invalid-map failure and existing changed-path
   semantics. The authority-changing patch itself requires the full gate.
6. Preserve flags, JSON schema, success bytes and argument failures. A failed
   output write, including a silent short write, must exit with operational
   failure rather than reporting success. Retain the existing input limits,
   deadlines, receipt checks and owned-resource cleanup.
7. Tagged releases continue exercising the released public binary and its
   unconditional reproducibility proof. The private drivers are not additional
   release artifacts. Include their production sources and shared adapters in
   the existing book provenance inventory.
8. Put experiment help, dispatch, handlers and their tests in
   `internal/experimentcli`, with one public usage call and one dispatch call.
   Preserve the public unknown-command fallback and every existing command's
   output and exit contract. Do not introduce dynamic registration. The existing
   `go-experiment` owner selects container, Go and release checks for this
   package, including catalogue and release-plan consumers. Keep the public
   command directory conservative; a later edit there still selects full CI.
9. Version the Promise procedure's source binding when moving its CLI. New
   runs emit procedure v3 and bind every production file in `experimentcli`;
   the read-only checker retains the exact v2 source profile for explicitly
   supplied frozen source roots. Select only those named profiles from the
   bounded receipt, compare every reconstructed field and source identity, and
   reject unknown versions or missing sources. Never infer a legacy profile
   from missing new files, rewrite old receipts or rerun old wheels to hide a
   source-layout change.

## Remaining work and verification

Changes confined to the experiment CLI package no longer share selector or
renderer execution dependencies. They select container, Go and release checks,
not the full workstation matrix or fresh renderer builds. Adding a book-bound
source still changes `scripts/book-source.mjs` and selects the broad gate.
Separating that declarative inventory needs its own bounded parser, complete
source bindings and freshness tests. Do not omit provenance to reduce CI.

Focused checks cover public/private argument and output parity, experiment
handler-body preservation and 39 before/after binary protocol cases, write failures,
dependency growth, mapping combinations and workflow-policy invariants. The
integration gate remains `npm run check`, the complete Go race suite, book
generation and validation, and the hosted renderer proof. No duration target
or narrower future run is considered achieved until measured on that change.

Remove a private driver if its protected job is retired. Reconsider this
exception if it stops reducing the job's dependency closure; do not grow it
into another general-purpose command surface.

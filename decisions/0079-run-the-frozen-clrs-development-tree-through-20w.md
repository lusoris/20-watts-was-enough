# 0079 — Run the frozen CLRS development tree through 20w

- **Status:** accepted
- **Date:** 2026-09-05
- **Extends:** [0037](0037-release-go-tooling-and-scope-experiment-images.md),
  [0055](0055-freeze-clrs-text-as-a-controller-shakedown.md),
  [0076](0076-separate-book-support-provenance-inventory.md)
- **Related:** [issue #12](https://github.com/lusoris/20-watts-was-enough/issues/12)

## Context

The six exact Go specialists, candidate bindings, controller and held-reference
verifiers already exist. Local controller runs have needed a separate retained
helper to connect them. A reusable development command removes that extra
implementation without selecting a new dataset, changing the frozen grid or
admitting a released experiment image.

## Decision

1. `20w experiment run-clrs-shakedown` owns one explicit local development
   execution or a read-only retained-bundle check. It requires the supplied
   fixture tree, its independently retained SHA-256, a run identity and an
   output directory. It neither acquires nor generates fixtures or images.
2. Reuse the existing importer, task bindings, registry, admission, controller
   and exact verifiers. The Go command and its general tooling container now
   link all six existing solver packages. They no longer have a solver-free
   dependency closure. The dedicated scratch `clrs-specialist` image remains
   a separate one-request candidate process with its existing entry point.
3. The same Go implementation can run from a native command or inside the
   ordinary tooling container when the caller supplies the declared repository
   inputs, dataset and writable output parent. This change does not publish or
   admit a new experiment image. A released CLRS experiment still requires its own
   scoped, admitted OCI identity under decision 0037; the general tooling image
   does not substitute for that artifact.
4. Keep the frozen six-task, 48-example development contract and all outputs at
   `NO_RESULT`. Use one sequential pass, bounded input and event bytes, finite
   deadlines and no retries. Record decisions before effects, preserve partial
   evidence on failure and never overwrite an existing run directory. The
   [usage contract](../tooling/clrs-specialist/README.md) states the limits.
5. Check retained evidence against the supplied tree, canonical admission and
   policy, and held references. A successful check establishes unsigned bundle
   consistency, not authenticated execution or compilation. Preserve external
   exit status separately. No whole-task energy measurement is collected;
   joules remain null and elapsed times are diagnostic observations.
6. Extend decision 0076's support inventory by exactly one package prefix:
   production Go files directly inside `tooling/internal/clrsshakedown/`.
   Selected files stay in `scripts/book-support-sources.json`; the executable
   reader retains its exact allowlist, schema, byte/path limits, stable reads
   and rejection of tests, nested paths and other packages. This adds source
   provenance, not renderer execution authority. The existing cache and
   renderer bindings remain in `scripts/book-source.mjs`; the reader change
   retains its full integration and publication verification requirements.

## Licensing and review boundary

This implementation reuses the project's existing Go packages under the
allocation in [LICENSING.md](../LICENSING.md). It adds no third-party Go module,
upstream Python source body or embedded dataset. Source provenance identities
remain attached to the existing adapters; supplied fixture bytes retain their
own terms. Linking these packages does not complete the separate generator or
specialist-image licence review, source-provenance, SBOM or release-admission
checks. No new legal approval is claimed.

Codex was materially used for implementation, documentation, source review and
automated tests under maintainer direction. Those engineering checks are not
independent human research review. There is no model selection, new scientific
comparison, measurement protocol or claim promotion in this decision.

## Consequences

Contributors can rerun the same development wiring through one maintained Go
command and report a source-bound input identity with retained failure or
completion evidence. The general tooling binary gains the six existing solver
dependencies. Experiment-specific image identity, licensing, containment,
power measurement and scientific review remain separate gates.

## Supersession

Supersede this record before changing the frozen task or fixture contract,
invoking a new candidate class, promoting bundle consistency to execution
authentication, or admitting this command into a claim-eligible protocol.

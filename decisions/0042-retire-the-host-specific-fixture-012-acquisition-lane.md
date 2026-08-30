# 0042 — Retire the host-specific Fixture 012 acquisition lane

- **Status:** accepted
- **Date:** 2026-08-30
- **Supersedes:** clause 8 of [0037](0037-release-go-tooling-and-scope-experiment-images.md)

## Context

Fixture 012 has two different execution surfaces. Its synthetic
layout-population diagnostic is portable and smoke-ready. Its separate physical
acquisition lane depended on a C# supervisor, shell harness, local compilation,
one operating system's process primitives and one file system's identity
mechanisms. The lane remained development-only, supplied no scientific or
energy result and was not admitted to a release image.

Keeping that stack would make contributors maintain a second build and trust
boundary before the project has a physical Fixture 012 protocol eligible for
execution. Go can provide one portable public command, but compilation for
several operating systems does not make their process-containment and path-
identity semantics equivalent. Those differences belong behind tested Go
packages rather than in separate shell entry points.

## Decision

1. Remove Fixture 012's physical acquisition implementation, operator runbook,
   supervisor, shell scripts, local configuration templates and platform-
   specific integration fixtures.
2. Keep the deterministic synthetic diagnostic as a source-only Node harness
   until a separate parity-tested Go port replaces it. Its `smoke-ready` and
   `NO_RESULT` boundaries do not change.
3. A future physical acquisition lane must expose one Go command on every
   admitted platform. Platform packages may implement different containment
   primitives, but each admitted target must test descendant termination,
   cancellation, path substitution, bounded output, exact timing boundaries,
   append-only recovery and the declared energy-measurement boundary.
4. Do not restore a shell, C#, or host-only public entry point as an interim
   path. If a platform cannot satisfy the physical runner's frozen contract, it
   remains unsupported and the manifest continues to report that physical
   execution is not implemented.

## Consequences

- Repository validation and Fixture 012 smoke execution no longer carry a
  platform-specific build or shell dependency.
- The deleted lane's earlier tests remain part of Git history, but they are not
  current execution evidence after this decision.
- Fixture 012 loses its development-only physical acquisition path. This does
  not withdraw a scientific result because that path never had result or
  promotion authority.
- A Go replacement has a smaller public surface, while platform parity remains
  an executable obligation rather than an inference from language choice.

## Supersession

Supersede this record if Fixture 012 gains a portable Go acquisition lane, if
physical execution is removed from the fixture's intended scope, or if another
language becomes the repository's portable tooling boundary.

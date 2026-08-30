# 0038 — Publish only release-exercised container platforms

- **Status:** accepted
- **Date:** 2026-08-30
- **Partly supersedes:** [0037](0037-release-go-tooling-and-scope-experiment-images.md), clause 3 only

## Context

Decision 0037 selected a static multi-architecture image for the `20w`
command, while admitting native files only after their release paths execute.
The prepared container workflow did not meet the same standard: it built Linux
`amd64` and `arm64` manifests on an `amd64` runner, then executed the resolved
tag only on that host. Registry inspection proves platform metadata and labels;
it does not prove that the `arm64` binary starts or performs its bounded work.

No published release yet depends on the wider platform promise. The boundary
can therefore be corrected before the first tag that contains the new image.
The same preparation exposed a second boundary: attaching the public release
tag during the build made that tag visible before exact-digest execution and
provenance admission had finished.

## Decision

1. Publish the static `20w` image for Linux `amd64` only. Build, inspect,
   execute, attest and document that same platform set.
2. Push each container candidate under its canonical registry digest without
   attaching the public release tag. Inspect and execute that exact digest,
   require its complete runtime and source identity, establish or repair its
   source-bound attestation, and verify the resulting provenance. Only then
   attach the missing release tag and re-inspect the tag-to-digest binding.
3. Treat reruns as admission and repair, not replacement. An existing release
   tag must retain its exact digest and source/ref/commit binding, pass the same
   digest inspection and execution again, and may receive a missing
   attestation only after that execution passes. A missing tag may be attached
   only after an immediate absence check. Recovery has no intentional tag
   deletion or replacement path. The release job is serialized, but GHCR does
   not expose a documented atomic create-if-absent operation through this
   publication path. Package writers therefore remain a trusted concurrent-
   writer boundary, and final inspection must reject a divergent tag binding.
4. Run the admitted immutable digest and require `version --json` to report
   the release tag, commit, source timestamp, Go version, operating system and
   architecture exactly. The same digest must complete its bounded repository
   validation command before release publication continues.
5. Admit Linux `arm64` only after a release path executes the exact `arm64`
   digest on a native runner or a pinned emulator, checks the same binary
   identity and validation command, and retains the existing registry,
   provenance and digest-binding checks. Cross-compilation or config inspection
   alone is insufficient.
6. Keep container-platform admission separate from native-file admission. A
   working `arm64` container does not by itself admit a native download, and a
   cross-compiled native file does not admit the container platform.

## Alternatives considered

- **Keep the unexercised multi-platform manifest.** Rejected because users
  would receive a release promise that the workflow had not executed.
- **Drop `arm64` permanently.** Rejected because the target is compatible with
  the static Go design; it needs an exercised release lane, not a permanent
  exclusion.
- **Treat registry inspection as execution.** Rejected because image metadata
  cannot expose loader, instruction-set or runtime failures.
- **Attach the tag during the build and remove it after a failed admission.**
  Rejected because readers can observe the tag before admission, and recovery
  would require a destructive mutable-tag operation.

## Consequences

- The first static tooling image has one verified Linux platform rather than
  two differently evidenced platforms.
- Release notes, registry inspection and the build matrix describe the same
  admitted platform set.
- A failed candidate may leave an untagged registry object, but it does not
  create a release-tag identity. A rerun can repair a missing attestation or
  tag without taking an intentional replacement or deletion path.
- Adding `arm64` is a focused workflow change with a concrete pass condition;
  it does not require a redesign of the command or experiment catalogue.

## Supersession

Supersede this record when platform admission no longer requires exact-digest
execution, or when a stronger release test defines an equivalent executable
boundary.

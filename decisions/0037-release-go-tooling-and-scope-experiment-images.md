# 0037 — Release one scoped image per experiment

- **Status:** accepted
- **Date:** 2026-08-29
- **Supersedes:** [0034](0034-release-bounded-experiment-containers.md)

## Context

Decision 0034 selected one Linux image containing every smoke-ready workstation
harness. That would reproduce the software environment, but it also couples
unrelated harnesses to a shared Node-and-Python runtime, architecture, and
release cadence. A defect in one experiment would require contributors to
identify which part of the common image they had actually exercised.

Every experiment admitted to a tagged release needs a runnable OCI identity so
contributors can test the same bounded entry point and report its digest. The
image belongs to one experiment. A pure-Go runner can use a single static
binary in a tiny image; a JavaScript runner may temporarily need a scoped Node
image; Fixture 019 additionally requires CPython and a platform-specific locked
NumPy artifact. Source remains available for inspection, but source alone is
not a released experiment artifact.

The new `20w` command gives repository validation and experiment discovery a
small cross-platform distribution boundary. Its static image keeps the public
invocation consistent with experiment images. Native files remain useful when
an OCI runtime is unavailable, but they are parallel tooling rather than a
substitute for per-experiment images.

Fixture 012 is different again. Its physical development lane depends on
Windows Job Objects, suspended-process assignment, NTFS path identity, oplocks,
USNs, descendant cleanup, and measured launcher timing. A Linux image cannot
represent that host boundary. Replacing its checked-in C# and PowerShell path
with Go may reduce bootstrap and distribution overhead, but language choice is
not evidence that those behaviours remain equivalent.

## Decision

1. A tagged experiment release must publish one OCI image for each released
   experiment. Containers are the public and default distribution: release
   notes, experiment documentation, and issue templates lead with a bounded
   `docker run` command and the immutable image identity. The image name,
   digest, source revision, runtime, architecture, command, and declared
   authority state are part of its release and receipt identity. Because a
   process cannot recover the registry digest from its own filesystem, the
   caller must pass the exact resolved `sha256:` digest. A release-tagged image
   refuses execution without it. Development images and source runs record a
   typed unavailable or local state instead. Analysis and validation require
   the current mode, image fields, source revision, runtime and platform to
   match the stored execution receipt exactly. Execution provenance remains
   outside the scientific `run_id`.
2. Keep the command standard-library-first and split its implementation into
   bounded `internal/` packages. Rules adapted from Golusoris or another
   repository are translated through this project's principles; their service
   framework and dependency stack are not imported wholesale.
3. Publish the `20w` command in a static, multi-architecture OCI image for the
   default validation and catalogue examples. Attach native files as secondary
   conveniences for repository work without an OCI runtime. Build both forms
   from the same exact tagged `main` revision with the declared Go toolchain,
   source revision, target, checksums, SBOM, and provenance bound to the
   release. Native download links follow the container instructions, and
   installing the binary is not required to run an experiment image. The
   initial native set contains only the release-exercised
   `20w-linux-amd64`; admit another operating-system or architecture target
   only after its release path executes and verifies that file.
4. Build a Go-native experiment runner with `CGO_ENABLED=0` where its contract
   permits, then copy only the static binary and required immutable data into a
   `scratch` or equivalently minimal runtime image. The image contains no shell,
   package manager, compiler, or unrelated experiment source unless the exact
   experiment boundary requires one of them.
5. Give each remaining JavaScript experiment a bounded, experiment-specific
   Node image when it enters a release. This is a transitional runtime, not a
   reason to delay useful testing or to claim that the runner has been ported
   to Go. Its manifest and image retain the locked Node graph, finite command,
   output mount, receipt rules, and supported-platform boundary.
6. Publish Fixture 019's scoped image with only the source and locked Node,
   CPython, and NumPy environment required by that fixture. It remains limited
   to the architecture admitted by its lock and records `NO_RESULT` authority
   in development receipts.
7. Do not publish the generic all-harness image described by Decision 0034.
   Shared release automation may build and attest images, but it may not merge
   their runtime filesystems, tags, entry points, or receipts.
8. Keep Fixture 012's current Windows implementation authoritative until a
   native Go replacement passes an explicit parity gate. That gate must cover
   the canonical Windows behaviour inventory, atomic suspended-process Job
   assignment, path and file identity, oplock and USN failure paths,
   descendant termination and wait semantics, receipt compatibility, fault
   injection on supported Windows and NTFS hosts, Windows-container execution
   on each supported host class, and measured timing overhead. A Go prototype
   is development evidence only until those checks pass; Fixture 012 does not
   enter a tagged experiment release without its own verified Windows image.
9. Keep native tooling, tagged source, and per-experiment images as distinct
   release artifacts with distinct identities. None of them changes the claim,
   confirmation, hardware, custody, measurement, or promotion requirements in
   the workstation manifests.

## Alternatives considered

- **Keep one shared image for every harness.** Rejected because it makes
  unrelated experiments inherit Python, architecture, and release changes
  without giving each execution environment an unambiguous digest.
- **Release source and native binaries without images.** Rejected because an
  experiment release needs one runnable OCI identity that outside testers can
  reproduce and report consistently.
- **Rewrite every runner in Go now.** Rejected because a language migration can
  alter schemas, numerical behaviour, process containment, and retained
  receipts. Each replacement must first demonstrate contract parity.
- **Import the Golusoris framework for command structure and policy.** Rejected
  because its service-oriented dependency and Fx boundaries solve a different
  problem. This repository needs small validation and orchestration packages,
  not an application framework.
- **Wait for every Go port before releasing experiments.** Rejected because a
  bounded per-experiment Node image can expose the current implementation for
  testing without representing it as the final runtime.

## Consequences

- Testers can name one image digest for one experiment. A release issue does
  not need to reconstruct which harness inside a shared image was used.
- Pure-Go experiments and the `20w` command have small default runtime images,
  while the exercised `20w-linux-amd64` native file is a secondary convenience
  for repository work outside a container.
- Current JavaScript experiments can be released through scoped Node images and
  migrated independently when a Go port preserves their contract.
- Fixture 019 retains a reproducible Linux runtime without adding Python to
  unrelated experiment images.
- Fixture 012 retains its tested Windows trust boundary while a smaller native
  replacement and Windows image are developed against named falsification
  tests.
- The experiment catalogue becomes the single place to state whether an
  artifact is unreleased source, a transitional runtime, or a released image.
- Release engineering has three intentional build classes: optional portable
  tooling, tiny Go-runner images, and scoped non-Go runtime images. Their build
  logic may be shared; their artifact identities may not.

## Supersession

Supersede this record if experiments return to a shared image, a released
experiment no longer has an OCI artifact, the portable tooling language
changes, a native Fixture 012 implementation replaces the current Windows
boundary, or a release artifact enters a claim-eligible execution boundary.

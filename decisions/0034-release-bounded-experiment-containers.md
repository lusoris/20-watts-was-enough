# 0034 — Release bounded experiment containers

- **Status:** accepted
- **Date:** 2026-08-29

## Context

External contributors can inspect the workstation harnesses, but reproducing
their exact Node, Python, NumPy, and dependency environment currently requires
manual setup. That makes useful defect reports harder to compare. A container
can freeze the software environment and lower the cost of running development
smoke paths, but it cannot identify host hardware, measure external energy, or
turn a smoke run into scientific evidence.

The locked NumPy artifact is currently a Linux x86-64 wheel. Publishing a
multi-platform image would therefore claim an environment that the repository
has not frozen for the other architectures.

## Decision

1. Build one Linux `amd64` image containing every validated smoke-ready
   workstation harness, the locked Node 22 and CPython 3.13 runtimes, NumPy,
   manifests, source contracts, and repository validators they require.
2. Make the bounded smoke-suite orchestrator the image entry point. It still
   requires an explicit artifact or `--all` selection and an output directory.
3. Record the image name, release version, source commit, runtime, architecture,
   and `NO_RESULT` authority in each suite receipt.
4. Build and exercise the image in pull-request and `main` CI before it becomes
   releasable.
5. Publish the image to GitHub Container Registry only from the existing exact-
   tag release workflow. Emit release, minor, and `latest` tags, OCI provenance,
   an SBOM, and a GitHub artifact attestation.
6. Never overwrite an existing exact `vMAJOR.MINOR.PATCH` image tag. Moving
   aliases may advance only when a new immutable release tag is published.
7. Treat container execution as development or construction evidence only.
   Claim-eligible execution still requires the manifest's frozen hardware,
   custody, confirmation, measurement, and release boundaries.

## Consequences

- Contributors can reproduce the supported software environment and report an
  image digest, source revision, command, and receipt with an issue.
- The first published image will accompany the first release whose tagged
  source contains this workflow; this change does not manufacture an image for
  an older tag.
- Arm and other platforms remain unsupported until their complete scientific
  runtime and dependency artifacts are pinned and tested.
- Container isolation does not by itself satisfy process containment, energy
  metering, timing comparability, or scientific confirmation.

## Supersession

Supersede this record if experiment images split by artifact, the registry
changes, another architecture is admitted, or containers become part of a
claim-eligible execution boundary.

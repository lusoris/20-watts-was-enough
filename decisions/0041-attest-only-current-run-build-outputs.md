# 0041 — Attest only current-run build outputs

- **Status:** accepted
- **Date:** 2026-08-30
- **Partly supersedes:** [0038](0038-publish-only-release-exercised-container-platforms.md), clauses 2 and 3 only

## Context

Decision 0038 allowed a rerun to add a missing build-provenance attestation to
an existing image digest after re-executing that image. Execution can show that
the persisted bytes still satisfy the release's runtime checks. It cannot show
that the current workflow built those bytes.

`actions/attest-build-provenance` records the current workflow as the builder.
Using it for a digest selected from a pre-existing registry tag would therefore
make a stronger provenance statement than the run established. This is not a
repair operation; it is attribution of an earlier build to a later run.

## Decision

1. Create GitHub build-provenance attestations only for digest outputs produced
   by the corresponding build step in the current release run. The attestation
   action receives that build step's digest directly.
2. Treat an existing image tag as read-only admission input. Its exact digest
   must already have a valid attestation bound to this repository, release
   workflow, source tag and source commit. A missing or divergent attestation
   stops the release.
3. Keep inspection, offline execution and provenance verification separate.
   Passing runtime checks does not establish build provenance, and valid
   provenance does not establish runtime behavior.
4. Do not add an implicit recovery path. A future recovery design may rebuild
   the exact tagged source and prove that the current build output has the same
   digest before attesting that current output. Such a path needs its own
   reviewed workflow and decision.

## Alternatives considered

- **Attest an existing digest after executing it.** Rejected because execution
  does not identify who built the bytes.
- **Accept BuildKit's registry metadata without GitHub verification.** Rejected
  because the release contract requires the repository, workflow, source tag
  and source commit binding checked by the admission step.
- **Delete and rebuild a tag that lacks provenance.** Rejected because release
  recovery has no destructive tag-replacement authority.

## Consequences

- The first run builds and attests each new digest before any release tag is
  attached. A later rerun can re-admit that digest but cannot invent missing
  build history.
- A partially completed historical run without valid provenance fails closed.
  Runtime success alone cannot unblock it.
- Decision 0038 remains controlling for exercised platforms, immutable digest
  inspection and tag attachment. Its missing-attestation repair clauses no
  longer apply.

## Supersession

Supersede this record only with a provenance mechanism that can demonstrate
the builder identity of pre-existing bytes without attributing them to a run
that did not build them.

# Decision 0013 — Development diagnostics may block a protocol

**Status:** accepted
**Date:** 2026-08-25

## Context

Fixture F-019 implemented the frozen FM-T02 feedback forecast closely enough to
expose a design defect before confirmation: under its symmetric shocks and
proportional sales, the aggregate endpoint is effectively invariant to the
registered development seeds. More resampling, private seed packs, or a later
readiness label cannot make an uninformative endpoint identify the proposed
effect.

A second boundary also became explicit. Some executable claims concern
forecast validity, control, or identifiability without making an energy claim.
Requiring a meter for those claims would add work without measuring their
endpoint; silently omitting energy would instead allow later prose to imply an
efficiency result that was never tested.

## Decision

Treat protocol eligibility as a separately reviewed, content-identified input
to workstation promotion.

1. A development diagnostic that reveals structural invariance,
   non-identifiability, comparator collapse, or an unreachable intervention
   blocks the affected protocol before confirmation or held-out seeds are
   released.
2. The blocked protocol, exact diagnostic, and failure reason remain in the
   repository. They cannot be replaced by favorable summary flags, empty
   evidence objects, or a changed readiness label.
3. Any successor changes the protocol version and receives a new review before
   it can become promotion-eligible.
4. A promotion validator binds the exact artifact, claim scope, protocol
   version, review digest, source identity, runtime identity, raw ledger, and
   checkpoint. It recomputes eligibility rather than trusting stored booleans.
5. A claim with no energy endpoint may declare a reviewed non-energy boundary
   only when that boundary is bound to the exact claim scope and explicitly
   forbids every energy conclusion. All energy-bearing claims still require
   measured-energy evidence under their registered contract.

## Consequences

- F-019 remains a development-only smoke harness. Its implementation checks
  pass, but FM-T02 cannot produce a scientific result or become
  workstation-ready in its current form.
- Confirmation and held-out escrow are not generated merely to advance a
  readiness counter.
- A protocol failure discovered by faithful execution is retained as useful
  design evidence, not hidden as an implementation inconvenience.
- Readiness validators must fail closed on forged evidence, path substitution,
  schema extras, public-label seed packs, and claim-scope drift.
- The project can test non-energy mechanisms without pretending that CPU
  telemetry or an omitted meter supports an efficiency conclusion.

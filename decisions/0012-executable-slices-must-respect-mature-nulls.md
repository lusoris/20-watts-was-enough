# Decision 0012 — Executable slices must respect mature nulls

**Status:** accepted
**Date:** 2026-08-24

## Context

The evidence ledger now routes more than a thousand claims into complete
written protocols, while only a small fraction of those protocols has executable
plumbing. Converting a protocol into code creates a new bias risk: the easiest
implementation can make the proposed composition look useful by comparing it
with an intentionally incomplete baseline, exposing the proposal to extra
information, or scoring point answers while ignoring justified abstention.

Fixture F-007 makes the issue concrete. Under a rank-deficient base operator,
two latent answers can have the same likelihood. A naive point answer should be
penalized for false specificity; a mature selective baseline should be allowed
to abstain; and any proposed active composition must be compared with a mature
active method receiving the identical added observation and resource budget.

## Decision

Every new executable slice must bind four roles before its result code is
accepted:

1. a negative control capable of exposing whether the fixture has diagnostic
   power;
2. the strongest compatible mature null, including ordinary uncertainty,
   abstention, calibration, monitoring, and active evidence where applicable;
3. the proposed composition under exactly the same causally available
   information and componentwise budget; and
4. an unattainable oracle only when it is clearly separated from eligible
   comparisons.

If the proposal and mature null implement the same information path, the
acceptance test requires parity. Code must fail if it manufactures an advantage
from labels, hidden state, extra measurements, unmatched resources, favorable
missingness, or a weaker comparator.

Executable slices additionally require a versioned runtime validator,
deterministic development profile, explicit execution-claim scope, append-only
raw records, machine-recomputed analysis, hostile corruption tests, and a
nonzero exit code when registered checks fail. A smoke run exercises the
contract; only the separate workstation promotion gate can grant claim
authority.

## Consequences

- The first F-007 slice tests null-space honesty rather than attempting all
  eight optical tracks at once.
- Its operator-qualified active arm must exactly match the mature active arm;
  a reported gain would indicate leakage or comparator asymmetry.
- The slice can increase executable coverage without inflating
  workstation-executable claim counts.
- Later slices may replace simulated observations with physical adapters, but
  they retain the same negative-control and mature-null obligations.
- Readiness advances track by track; a fixture-level prose contract is not
  treated as an executed experiment.

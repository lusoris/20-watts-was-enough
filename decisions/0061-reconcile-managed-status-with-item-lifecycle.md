# 0061 — Reconcile managed status with item lifecycle

- **Status:** accepted
- **Date:** 2026-09-04
- **Related:** [0046](0046-project-the-research-roadmap-into-github-milestones.md), [0049](0049-adopt-bounded-maintenance-automation.md), [0057](0057-project-pull-request-metadata-from-managed-issues.md)

## Context

The managed labels describe live coordination state, but closing an item does
not remove its active status automatically. A live inventory on 2026-09-04
found closed issues 9 and 11 and merged pull requests 40, 41, 44 and 45 still
marked `status:in-progress`. Manual correction repaired that history but could
not stop the same drift recurring.

`status:wontfix` has a different meaning. It records an explicit maintainer
decision and must remain visible on an issue or unmerged pull request that was
closed deliberately. A close event alone cannot establish that decision.
Reopening also invalidates the closed-item meaning, but the existing issue and
pull-request authorities do not justify inventing any more specific state.

## Decision

1. Treat the five `status:*` entries in [the label manifest](../.github/labels.json)
   as one closed lifecycle vocabulary. The issue-assignment manifest identifies
   managed issues. Decision 0057's one explicit mapped-issue reference
   identifies managed pull requests; this decision adds no parallel inventory.
2. On issue close, remove `status:needs-triage`, `status:blocked`,
   `status:in-progress` and `status:waiting-on-author`. Preserve an existing
   `status:wontfix`, but never add it. On issue reopen, replace every managed
   status with `status:needs-triage`.
3. Let the canonical issue-metadata reconciliation repair missed events. A
   closed issue converges as in clause 2. An open issue with no active status,
   or only stale `status:wontfix`, converges to `status:needs-triage`. When one
   active status and stale `status:wontfix` coexist, retain the active status
   and remove only `status:wontfix`. Multiple active statuses and unknown
   `status:*` identities remain ambiguous and fail closed.
4. On pull-request merge, remove every managed status, including
   `status:wontfix`. On an unmerged close, remove the four active statuses and
   preserve an existing `status:wontfix`; never infer it. On reopen, rerun the
   issue-derived projection from decision 0057, including its mapped milestone,
   so the referenced issue remains the metadata authority rather than an
   event-local default.
5. Run lifecycle changes only from trusted `main`. An issue event invokes the
   bounded issue reconciler and completes the same bounded repair across the
   committed issue assignments; the normal metadata run provides the same
   recovery path when an event is missed. Serialize these non-coalescible issue
   events in GitHub's maximum pending queue, which holds up to 100 waiting runs:
   the default single pending slot can discard a reopen transition whose triage
   reset cannot be reconstructed from ordinary drift repair. Give each pull
   request the same maximum pending queue so a close cleanup cannot be replaced
   by a later edit event. Pull-request events and an explicit command invoke the
   bounded pull-request projection.
6. Let the normal metadata run repair pull-request events that were missed. It
   queries the Issues API separately for each of the five managed status labels
   and separately lists open pull requests. Each query is limited to four
   100-item pages and 16 MiB per response; their union is limited to 64 unique
   pull-request candidates. The open-list lane admits only a pull request whose
   body contains exactly one explicit reference to a mapped managed issue, so it
   can recover a missed reopen even after every managed status has disappeared.
   Discovery fails before the first write if a response, page chain, item or
   candidate set exceeds a bound. The observed state and merge endpoint select
   reopen projection or closed cleanup, and the existing projection performs
   exact-item confirmation and readback. This discovery deliberately adds no
   second pull-request manifest.
7. A closed pull request carrying only an unknown `status:*` label is outside
   the status queries; its trusted event or explicit number remains the repair
   route. An open pull request without exactly one mapped issue reference cannot
   be projected and remains unchanged. A discoverable candidate with an unknown
   or duplicate status fails closed during exact-item inspection. Neither
   discovery nor repair executes pull-request code.
8. Before writing, validate the committed authorities, repository and item
   identities, event state, label inventory and complete bounded target
   snapshot. Unknown or duplicate pull-request `status:*` identities fail
   closed. Change only managed status labels for a close or merge, preserving
   every preflighted non-status label and the existing milestone. A reopened
   pull request instead uses decision 0057's full projection. Validate mutation
   responses and read the target back. Partial transport failure and concurrent
   changes must converge on a bounded retry or fail visibly.
9. Treat status lifecycle as operational coordination only. Closing, merging,
   reopening or repairing an item cannot promote a claim, qualify an
   experiment, satisfy a roadmap gate or infer scientific completion.

## Consequences

- Completed work no longer remains visibly active after a successful event or
  issue-metadata repair.
- Maintainers retain a deliberate `status:wontfix` record without allowing
  automation to manufacture that judgement.
- Reopened issues have a deterministic triage state. Reopened pull requests
  continue to expose the referenced issue's reviewed classification.
- Full metadata repair covers closed pull requests that retain a known managed
  status and open pull requests with one explicit mapped-issue reference,
  including reopened items with no managed status.
- Ambiguous status inventories block their own repair and remain inspectable
  instead of being silently normalised.

## Supersession

Supersede this record if another tracker owns lifecycle status, pull requests
gain a separate committed status authority, or managed statuses cease to
describe GitHub coordination state.

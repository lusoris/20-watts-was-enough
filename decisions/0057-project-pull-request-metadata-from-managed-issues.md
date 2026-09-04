# 0057 — Project pull-request metadata from managed issues

- **Status:** accepted
- **Date:** 2026-09-04
- **Related:** [0046](0046-project-the-research-roadmap-into-github-milestones.md), [0049](0049-adopt-bounded-maintenance-automation.md), [0056](0056-move-ordinary-ci-to-office-arc-runners.md)

## Context

Decision 0046 withheld pull-request milestone assignment until a stable identity
could be committed and reviewed. The issue map now provides that identity, but
manually copying its milestone and classifications onto each pull request has
already left repository history incomplete. The pull-request body can name the
managed issue without adding another assignment manifest.

The automation runs on `pull_request_target`, where write permission is useful
but pull-request code is untrusted. A title or changed-file path can determine
only part of the classification. It cannot safely invent a priority, workflow
status or roadmap stage.

## Decision

1. A pull request may identify its work item with one stand-alone `Refs #N`,
   `Tracks #N`, `Closes #N`, `Fixes #N` or `Resolves #N` line. Projection occurs
   only when exactly one referenced number is present in the committed
   [issue-assignment manifest](../.github/issue-milestones.json). Repeated forms
   of the same number remain one reference. Missing, unmanaged or competing
   managed references cause no issue-derived projection write.
2. The issue map remains the single authority for the roadmap stage. Before a
   pull request is changed, the referenced record must be an open issue with
   the mapped, verified milestone and exactly one managed type, severity and
   status label plus at least one managed area.
3. Derive the pull-request type from its supported Conventional Commit title.
   Copy severity and status from the managed issue. Preserve path-derived areas
   and add the issue areas. Replace conflicting managed classifications while
   preserving labels outside those four namespaces.
4. Run the projection only from the trusted default-branch copy of the bounded
   Go command. The workflow may read pull-request metadata but never checks out
   or executes its code. It refreshes path labels first and uses only
   `contents:read`, `issues:write` and `pull-requests:write` at job scope.
5. Validate the committed authorities and exact remote label and milestone
   inventories before inspecting a target. Re-read the pull request and issue
   before mutation, add or remove only owned classification labels, update the
   milestone independently, then read back both records. Bound every retry and
   accept concurrent changes only in labels outside the four owned namespaces.
6. Pull-request labels and milestones remain coordination metadata. This
   projection cannot promote a claim, qualify a run or satisfy a roadmap exit
   gate.

## Consequences

- Contributors state the work relationship once; the issue map and issue
  classification drive the corresponding pull-request metadata.
- Body edits retrigger projection, while ambiguous or unmanaged references
  cannot trigger issue-derived metadata changes.
- The trusted metadata exception remains on a GitHub-hosted runner so no
  self-hosted office runner receives untrusted fork context.
- Clauses 3 and 6 of decision 0046 are partly superseded: the committed stable
  identity is now the managed issue reference rather than a separate
  pull-request assignment record.

## Supersession

Supersede this record if pull requests become an independent committed
authority, issue labels cease to own work classification, or the repository
moves away from GitHub metadata projection.

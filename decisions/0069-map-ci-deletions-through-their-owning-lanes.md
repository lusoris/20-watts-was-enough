# 0069 — Map CI deletions through their owning lanes

- **Status:** accepted
- **Date:** 2026-09-05
- **Partly supersedes:** [0043](0043-impact-scope-pull-request-ci.md) clause 3,
  [0052](0052-impact-scope-every-pull-request.md) clause 2, and
  [0062](0062-impact-scope-comparable-main-pushes.md) clause 2, only where they
  send every deletion to the full plan
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7)

## Context

The impact planner maps added and modified files through one closed path-to-lane
authority, but treats every deletion as ambiguous. Pull request #80 therefore
ran the complete workstation and container gates after removing one redundant
Mermaid source, even though the exact deleted path and all other changed paths
were mapped and no experiment runtime changed.

A deletion retains the information the selector needs: Git reports the former
path, and that path still resolves against the checked mapping in the pull
request checkout. A loadable selector change or shared full authority expands
through the same fail-closed path rules; a missing or invalid mapping blocks
planning, and an unmapped path expands to full. Rename, copy, and type-change
records are different because they describe two identities or a changed file
kind.

## Decision

1. Treat Git status `D` as one exact changed path and pass it through the same
   closed mapping used for additions and modifications.
2. Keep deletion fail-closed behavior at the authority boundary. A loadable
   selector change, a path mapped to `full`, or an unmapped path selects the
   complete plan. A missing or invalid mapping blocks planning before a plan can
   be projected.
3. Continue to send Git-classified renames and copies, type changes, and changes
   to non-regular modes to the complete plan. Detect copies against unmodified
   sources, and preserve both reported paths for rename and copy records. A
   regular deletion plus an independently classified regular addition maps both
   paths; the selector does not invent an identity relation that Git did not
   report.
4. Keep the existing revision, path, count, byte, subprocess, and timeout
   bounds. This change alters lane selection only; it removes no assertion from
   any selected lane or from the local aggregate.
5. Increment the projected plan schema to 2. Schema-1 output is rejected rather
   than interpreting its older change-shape reason under the new rules.
6. The selector's own change runs the complete gate. `npm run check` remains
   the local merge floor, and an impact-plan pass is not scientific or release
   evidence.

## Consequences

- Replaying pull request #80's exact base-to-head diff selects `go`, `release`,
  `research`, and `site`; it no longer selects workstation or container jobs.
- A mapped deletion pays for every declared consumer of its former path. It
  cannot make an unknown or authority-bearing path disappear from validation.
- Removing a dead source can now reduce duplication without spending several
  minutes on unrelated experiment fixtures.
- Issue #7 remains open for the measured full-gate target and other physical
  bottlenecks. This decision narrows when that gate is required; it does not
  weaken it.

## Supersession

Supersede this record if Git change identity is no longer derived from the exact
bounded raw diff, deleted paths lose a closed owner, or dependency
evidence shows that deletions require a broader lane than the mapping declares.

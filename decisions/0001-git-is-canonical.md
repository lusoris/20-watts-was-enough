# 0001 — Git is the canonical source

- **Status:** accepted
- **Date:** 2026-08-05

## Context

The concept had been repeatedly recreated in conversational tools, causing
wording, numbers, and scope to drift. A Google Doc captured one version but is
poorly suited to modular evidence, equations, generated graphics, and exact
change history.

## Decision

The Markdown files in this repository are canonical. Google Docs and AI
conversations are provenance inputs only. There is no two-way synchronization.

## Consequences

- Every future change is a reviewable Git diff.
- Equations, claims, diagrams, and prose can evolve independently.
- Exports may be generated later, but they never become the source of truth.

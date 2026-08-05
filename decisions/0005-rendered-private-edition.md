# 0005 — Render one private edition from canonical files

- **Status:** accepted
- **Date:** 2026-08-05

## Context

Raw repository navigation is a poor reading environment for a long research
concept, especially once equations, evidence tables, and diagrams become
central. A separate document service would reintroduce synchronization and
provenance problems.

## Decision

Git-tracked Markdown, BibTeX, and Mermaid files remain the only editable source.
The repository includes a reader that imports those files directly, provides
local hot reload, and produces a deployable online edition. Generated output is
ignored and must never become an independent editing surface.

The hosted edition is owner-only by default. Any later expansion of access is a
separate explicit decision; repository privacy alone is never assumed to protect
a website.

## Consequences

- A normal file save updates the local reader without copying prose.
- An online edition represents a specific committed source state.
- Math, tables, internal links, source warnings, and Mermaid diagrams can be
  reviewed in their final reading context.
- Publishing is blocked if the platform cannot verify owner-only access.
- The site runtime adds dependencies, but it does not change the research file
  format or replace Git history.

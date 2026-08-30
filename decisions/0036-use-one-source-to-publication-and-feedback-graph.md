# Decision 0036: use one source-to-publication-and-feedback graph

**Status:** accepted
**Date:** 2026-08-29

## Context

The public site, PDF, experiment releases, translations and contributor routes
had grown as separate features. Repeating their build or identity logic makes a
stale derivative appear authoritative and makes outside reports harder to route
back to the affected research artifact.

## Decision

Git `main` remains the sole content authority. Publication identity is shared
from one code registry. Pages, PDF, release assets, containers and reviewed
translations are generated or freshness-checked derivatives. Every reading
surface exposes a typed GitHub feedback route, and every issue records the
narrowest available source identity.

CI and tagged release verification each run the aggregate repository gate once.
Pages deployment retains its narrower publication build because that workflow
must create the deployable artifact. A workflow may repeat a check only when it
guards a distinct trust or artifact boundary.

## Consequences

- A value duplicated across dynamic and static publication code moves into the
  shared publication registry or gains an explicit consistency test.
- Issues coordinate work but do not become a document authority.
- Generator migration is justified by a missing contract, not by resemblance
  to another research repository.
- The maintained workflow and benchmark are documented in
  [`docs/publication-workflow.md`](../docs/publication-workflow.md).

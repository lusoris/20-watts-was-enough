---
name: research-design
description: Design or review the 20 Watts Was Enough visual system, research reader, GitHub Pages portal, typography, colour, layout, diagrams, or brand expression. Use for presentation and interface work; do not use for prose-only editing or to change scientific meaning.
---

# Research design

Make the research easier to navigate, read, question, and reproduce. The visual
system should express the project's character without competing with its
evidence.

Before changing presentation, read [`docs/design-system.md`](../../../docs/design-system.md),
the affected component and style owner, and the nearest `AGENTS.md`. Use the
project's `reader-editor` skill as well when layout exposes a prose problem;
presentation must not silently rewrite the claim.

Review the rendered surface and the relevant issue or user report before
critiquing it. Code alone can expose ownership and semantic defects, but it
cannot establish the visible hierarchy, clipping, density, or interaction
state a reader encounters.

## Frame the change

Name the intended reader, their task, the route or artifact involved, and the
first point where the current design fails. Separate:

- a comprehension or navigation failure;
- an accessibility defect;
- a maintainability defect in tokens, components, or cascade ownership; and
- a proposed change to brand expression.

Do not justify a change with *modern*, *clean*, or *research grade* alone.
State the observable improvement and what evidence could disprove it.

For a broad visual direction, choose one characteristic device grounded in the
project's subject—such as a real flow, material boundary, or evidence
relationship—and spend the expressive budget there. Keep the surrounding
system quiet. A repeated decorative network, number, gradient, or card grid is
not a signature unless it encodes something true.

Start with the established system. Preserve the current characteristic device
unless rendered evidence shows that it fails the reader's task or an accepted
decision supersedes it. Do not manufacture novelty by replacing a working
identity on every review.

## Build from the system

- Preserve semantic HTML, source order, research identifiers, evidence status,
  and local scrolling for genuinely two-dimensional material.
- Change shared tokens or the owning component before adding route-local
  exceptions. A new token needs a repeated semantic role, not merely a colour
  value that appeared twice.
- Before changing a selector, find every definition under the same media or
  container condition. Consolidate the touched rule into its declared owner;
  do not add another same-condition override to win the cascade.
- Keep colour supportive. Status, hierarchy, and actions require text, shape,
  position, or another non-colour cue.
- Use typography to establish reading order and distinguish prose, interface,
  and machine identities. Do not add a font dependency for novelty.
- Prefer CSS and existing editable vector or Mermaid sources. Use image
  generation only when the requested output is genuinely raster artwork.
- Treat motion as feedback or explanation. Respect reduced-motion preferences
  and avoid ambient animation that taxes attention or power without carrying
  information.

Tests should protect semantic roles, reading order, reflow, contrast,
interaction, and other observable behaviour. Lock an exact colour, grid value,
or source position only when a named design decision makes that constant part
of the contract.

Control labels may be corrected inside a design change. Identity, evidence
status, summaries, or other claim-bearing copy also requires `reader-editor`
and `research-writing` review; visual consistency is not authority to change
scientific meaning.

The brand is calm, exact, ecological without imitation, and technical without
the usual neon-AI or fake-laboratory cues. Preserve deliberate character;
avoid both generic dashboard styling and decorative journal mimicry.

## Verify the result

For a user-visible change, read and apply
[`references/visual-review.md`](references/visual-review.md). Automated checks
are necessary but cannot approve visual hierarchy, line length, clipping, or
the felt transition between overview and deep reading.

Record which tokens or components changed, which routes and states were
checked, the viewport and zoom conditions, keyboard findings, and any
intentional visual difference. Inspect each retained screenshot before using
it as evidence. Keep screenshots as bounded review evidence; they are not a
second design source.

A required route, state, viewport, keyboard, reflow, or zoom lane that could
not be exercised remains explicitly unverified. Do not give the change a
verified visual hand-off until that lane runs or the scoped review contract no
longer requires it.

## Hand-off

Report the reader task, the failure corrected, the design-system owner changed,
the evidence retained, and any decision that still needs the maintainer. If a
clearer layout would alter evidence status, wording, equations, or source order,
stop at that boundary and request the content decision instead.

When revising this skill itself, read
[`references/prior-art.md`](references/prior-art.md). It records the external
skill patterns already evaluated so the project does not repeatedly rediscover
or blindly fetch them.

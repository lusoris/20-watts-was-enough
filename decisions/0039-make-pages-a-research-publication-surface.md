# 0039 — Make Pages a research-publication surface

- **Status:** accepted
- **Date:** 2026-08-30

## Context

The first unified Pages portal preserved source identity, search, the complete
book, issue routes and a truthful `NO_RESULT` boundary. Its landing page still
used the visual hierarchy of an operations dashboard: a large dark hero, boxed
metrics, a red status panel, a six-column funnel, multiple accent colours and
heavy reader rails. A source-only audit checked text measure and responsive
rules but did not compare the rendered hierarchy with external research
publications. It therefore did not produce a material redesign.

An [external infrastructure
audit](../research/audits/2026-08-30-git-centred-open-research-publication-infrastructure.md)
compared maintained Git repositories, papers, specifications and rendered
publications. Their implementations differ, but the supported pattern keeps
the research object, publication identity, argument, provenance and correction
route primary. A separate local render audit established how the old Pages
hierarchy violated that direction.

## Decision

1. Treat Pages as a research-publication surface, not a repository dashboard.
   Open with the thesis, source authority, evidence stage and one explanatory
   figure before the detailed repository inventory.
2. Use a restrained paper, ink, muted-ink, hairline and project-green palette.
   Reserve amber and red for semantic states. `NO_RESULT` is a neutral
   eligibility boundary; invalidation, retraction or failure may use red.
3. Render the evidence path as a readable ordered sequence. Do not compress
   explanatory prose into a six-column metadata tier.
4. Give focused documents a dominant `68ch` argument column with wider local
   regions for figures, mathematics, tables and code. Navigation rails stay
   quiet and disappear when the viewport cannot support them.
5. Preserve the document title, sequence and source actions before Contents
   and body on mobile navigation. A route change must not scroll past that
   context.
6. Keep the custom generated reader because it already derives routes, source
   identity and issue targets from canonical registries. External sites are
   pattern evidence, not templates or new authorities.
7. Treat comprehension improvements as hypotheses. Validate thesis, status,
   source, feedback and experiment-finding tasks with bounded reader checks
   before claiming an improvement.

## Alternatives considered

- **Keep the dashboard and adjust font sizes.** Rejected because the primary
  defect was hierarchy and visual density, not only line measure.
- **Open directly on the book.** Rejected because it hides current evidence
  status and contribution routes from new readers.
- **Adopt Quarto, MyST or another research-site generator.** Rejected because
  no missing source or publication contract justifies a second generator and
  migration boundary.
- **Copy one journal theme.** Rejected because journal review, citation and
  account states would imply processes this project does not possess.

## Consequences

- The landing page can contain repository metrics, but they remain subordinate
  to the thesis and evidence statement.
- Visual changes require rendered desktop and mobile inspection as well as
  source tests. CSS declarations alone are insufficient evidence.
- Figures need captions and an explicit authority boundary. A conceptual
  figure cannot appear as an experimental result.
- A future experiment-record surface must derive release, image, receipt,
  review and citation identities from maintained registries rather than repeat
  them by hand.
- External evidence and its limits remain in the
  [research infrastructure audit](../research/audits/2026-08-30-git-centred-open-research-publication-infrastructure.md).
  Local observations and reader-task hypotheses remain in the
  [interface implementation audit](../docs/public-research-interface-audit.md).

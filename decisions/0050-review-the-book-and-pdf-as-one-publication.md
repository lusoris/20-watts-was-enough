# 0050 — Review the book and PDF as one publication

- **Status:** accepted
- **Date:** 2026-08-30
- **Related:** [0039](0039-make-pages-a-research-publication-surface.md), [0040](0040-bind-publications-to-reproducible-and-public-artifacts.md), [0045](0045-rewrite-renderer-layer-timestamps-before-recording-image-identity.md)

## Context

The continuous web book and downloadable PDF are generated from one canonical
source set, but their failure modes differ. Browser checks can establish
reflow, focus, navigation and local overflow without showing print pagination.
PDF integrity and reproducibility can establish exact bytes without showing
whether a table, diagram, equation, caption or chapter transition remains
legible on an A4 page. CSS inspection, PDF tag state and text extraction each
cover only part of the publication.

The checked-in book currently spans hundreds of pages and mixes prose, tables,
mathematics, diagrams, generated status panels and a field-coverage appendix.
Reviewing only the cover or one ordinary prose page would miss the densest
classes and could allow a deterministic but unreadable edition to pass.

## Decision

1. Treat the continuous web book and generated PDF as two renderings of one
   publication, never as parallel maintained editions.
2. Adopt the project-local
   [`publication-design`](../.agents/skills/publication-design/SKILL.md)
   contract for changes to book hierarchy, print typography, pagination,
   navigation, figures, tables, equations and PDF visual QA.
3. Preserve the existing source, renderer, integrity and reproducibility
   authorities. Generated PDFs, manifests, distribution trees and reader
   copies are never edited directly.
4. A current-publication hand-off starts from a freshly validated PDF. A failed
   integrity check forbids a current pass; any continued review is labelled as
   a historical-artifact audit. The hand-off samples every affected page class,
   inspects each retained render, and expands around any defect or pagination
   shift.
5. Semantic review retains `pdfinfo -struct` diagnostics and compares raw text
   order with the visible dashboard, table or equation, and diagram or figure
   classes in the sample. A zero exit status does not erase structure
   diagnostics or reading-order defects.
6. A tagged PDF, successful text extraction or clean screenshot is not a claim
   of PDF/UA or WCAG conformance. Unexercised semantic and assistive-technology
   lanes remain explicit.
7. Layout may not change scientific meaning, source order, evidence status,
   mathematical notation or claim authority incidentally. Those changes return
   to their content owner and review skills.

## Consequences

- Book and PDF changes gain one reusable review contract without duplicating
  the renderer or design system.
- Ordinary reviews remain bounded to representative page classes; a defect or
  broad pagination change expands the sample instead of requiring routine
  rasterization of the whole book.
- Deterministic generation remains necessary but no longer stands in for
  legibility, reading order or print-quality evidence.
- Structure diagnostics and nonlinear reading-order defects remain visible
  findings until the publication pipeline fixes or explicitly bounds them.

## Supersession

Supersede this record if the book and PDF stop sharing canonical sources, or if
a later verified publication workflow replaces the current rendering and
review boundaries.

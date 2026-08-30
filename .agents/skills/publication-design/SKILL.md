---
name: publication-design
description: Design or review the 20 Watts Was Enough continuous research book and generated PDF. Use for book hierarchy, print typography, pagination, navigation, figures, tables, equations, PDF accessibility checks, or rendered-page visual QA; use research-design for portal-only work and reader-editor for prose-only readability work.
---

# Publication design

Treat the web book and PDF as two renderings of one canonical source. Improve
legibility and navigation without creating a parallel edition or changing
scientific meaning through layout.

Before changing either surface, read:

- [`docs/design-system.md`](../../../docs/design-system.md);
- the project-local [`research-design` skill](../research-design/SKILL.md) and
  its [`visual-review` protocol](../research-design/references/visual-review.md);
- [`app/AGENTS.md`](../../../app/AGENTS.md) and
  [`scripts/AGENTS.md`](../../../scripts/AGENTS.md); and
- [`docs/publication-workflow.md`](../../../docs/publication-workflow.md).

Use `reader-editor` and, where required, `research-writing` when the defect is
in the words rather than their presentation. State the reader task, observed
failure, affected surface (`book`, `PDF`, or both), and affected chapters or
page types before editing.

## Authority map

| Concern | Authority |
| --- | --- |
| Included documents and order | `app/book-content.ts` and canonical Markdown |
| Book composition, hierarchy, TOC and heading IDs | `app/components/book-edition.tsx` |
| Static book/PDF entry | `github-pages/book.tsx` |
| Screen and print presentation | `app/globals.css` |
| Source closure and digest | `scripts/book-source.mjs` |
| PDF generation | `scripts/generate-book-pdf.mjs` |
| PDF and manifest integrity | `scripts/validate-book-pdf.mjs` and `scripts/lib/book-pdf-integrity.mjs` |
| Pinned renderer | `tooling/internal/pdfrender/` and `tooling/pdf-renderer/lock.json` |
| Generated pair | `public/downloads/20-watts-was-enough-full-concept-book.pdf` and `book-manifest.json` |

Never edit the generated PDF, manifest, `dist/`, `dist-github-pages/`, or
reader copies directly.

## Review contract

### Structure and navigation

- Preserve the canonical inventory and order unless the task explicitly
  changes book structure.
- Check the cover, TOC, readiness front matter, chapter starts, mathematics,
  appendix, source links, legal links, revision identity, and final page.
- Verify heading levels and IDs remain unique and TOC links reach the intended
  headings.
- Treat chapter reordering or parallel summaries as content-authority changes,
  not visual cleanup.
- Check PDF page numbers and chapter breaks in the rendered artifact.

### Typography and pagination

- Apply the screen measure, leading, zoom, and reflow requirements from the
  design system. Judge print text from rendered A4 pages, not CSS values alone.
- Inspect body text, captions, tables, code, equations, footnotes, and metadata
  at realistic reading or print size.
- Detect clipping, overlap, isolated headings or captions, widows and orphans,
  accidental blank pages, excessive forced breaks, and unreadably reduced
  material.
- Fix the owning component or layout rule. Do not solve one overflow by
  shrinking the entire book.

### Figures, tables and equations

- Preserve semantic structure, captions, source or construction paths, and a
  textual route to the information. Do not depend on colour alone.
- On screen, keep overflow local to genuinely two-dimensional material. In
  print, ensure each item fits, reflows, or splits intentionally without losing
  labels, units, comparators, or uncertainty.
- Do not rasterize text, equations, or tables merely to simplify pagination.
- Do not add landscape pages, a numbering system, or changed mathematical
  notation as an incidental style fix.

### Accessibility boundary

- Check HTML heading order, link purpose, source order, alternative text,
  captions, keyboard focus, 200% zoom, and 320 CSS-pixel reflow.
- A current-publication review begins only after `npm run validate:book-pdf`
  passes for the checked-in PDF and manifest. If validation fails, do not issue
  a current-publication pass. Continue only as an explicitly labelled
  historical-artifact audit that records the stale or mismatched authority.
- Record `pdfinfo` page format and tag state. Run `pdfinfo -struct`, retain its
  standard error separately, and treat every diagnostic as a semantic finding
  even when the command exits zero. Do not report a clean semantic pass while
  structure diagnostics remain unexplained.
- Compare `pdftotext -raw` order with the visible page for every sampled
  non-linear class: a dashboard or status panel, a table or displayed
  equation, and a diagram or figure. Record moved captions or values, merged
  labels, and fragmented equations rather than relying on an arbitrary prose
  spot-check.
- A tagged PDF, successful extraction, or clean screenshots do not establish
  PDF/UA or WCAG conformance. Keep those lanes unverified unless a dedicated
  semantic or assistive-technology audit ran.

## Rendered PDF QA

For a read-only audit, validate the checked-in pair first. After a source or
layout change, regenerate it before review:

```bash
npm run generate:book-pdf
npm run validate:book-pdf
```

Retain bounded evidence under
`.workingdir2/evidence/design/<date>-<change>/book-pdf/`. The evidence note
records the source revision, PDF and manifest hashes, validation result,
renderer and inspection-tool identities, exact commands, page-to-class sample
map, findings, and unexercised lanes. Record PDF metadata, structure output and
the Poppler version:

```bash
pdfinfo public/downloads/20-watts-was-enough-full-concept-book.pdf
pdfinfo -struct \
  public/downloads/20-watts-was-enough-full-concept-book.pdf \
  > .workingdir2/evidence/design/<date>-<change>/book-pdf/structure.txt \
  2> .workingdir2/evidence/design/<date>-<change>/book-pdf/structure.stderr.txt
pdftoppm -v
```

Inspect `structure.stderr.txt` even when `pdfinfo -struct` exits successfully.
A non-empty file is a retained semantic finding, not a clean result.

Render a representative page or bounded range at 150 DPI:

```bash
pdftoppm -png -r 150 -f <first-page> -l <last-page> \
  public/downloads/20-watts-was-enough-full-concept-book.pdf \
  .workingdir2/evidence/design/<date>-<change>/book-pdf/page
```

The sample must cover every affected class and normally includes the cover,
TOC, prose-heavy page, chapter boundary, table, displayed equation, figure or
Mermaid diagram, appendix or reference-heavy page, and final page. Inspect
every generated PNG. Expand around a defect or pagination shift; do not
rasterize all pages by default. Compare chapters or elements by identity, not
only page number, because pagination can move.

Inspect reading order for each sampled non-linear class, using one command per
page so the evidence stays attributable:

```bash
pdftotext -raw -f <page> -l <page> \
  public/downloads/20-watts-was-enough-full-concept-book.pdf \
  .workingdir2/evidence/design/<date>-<change>/book-pdf/page-<page>.txt
```

For book-screen changes, also run the viewport, zoom, reflow, keyboard, and
colour-independence lanes in the visual-review protocol.

## Verification and hand-off

Run the smallest applicable checks while developing:

```bash
node --test scripts/book-route.test.mjs scripts/book-edition-surface.test.mjs
npm run typecheck
npm run lint
npm run test:github-pages
npm run generate:book-pdf
npm run validate:book-pdf
```

Run `npm run check:prose` and `npm run validate:docs` when canonical prose or
document structure changes. Run the real two-builder PDF reproducibility
acceptance only when renderer, toolchain, source-closure, or publication-
generation authority changes; an ordinary bounded visual adjustment does not
require it.

Report the reader task and failure, authority files changed, screen states and
viewports inspected, PDF page types and numbers inspected, retained PNG/text
evidence, generation and integrity results, structure diagnostics, class-by-
class reading-order findings, and remaining semantic-accessibility or content
decisions.

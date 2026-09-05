# 0063 — Own public reader CSS separately

- **Status:** accepted
- **Date:** 2026-09-04
- **Related:** [0039](0039-make-pages-a-research-publication-surface.md), [0050](0050-review-the-book-and-pdf-as-one-publication.md), [issue 10](https://github.com/lusoris/20-watts-was-enough/issues/10)

## Context

The public reader accumulated a foundation layer, an overview layer, and a
later publication pass in `app/globals.css`. Equivalent screen scopes repeated
selectors, so a small change could depend on a distant later override. The
same file also owned the book, print, shared controls, and base prose rules.
That made both review and automated regression detection unnecessarily broad.

A separate stylesheet is useful only if it creates a real authority boundary.
Moving bytes without checking selector scopes would retain the same cascade in
another file, while merging breakpoints without respecting source order would
change responsive behaviour.

## Decision

1. Let `app/globals.css` own resets, shared typography and controls, the book,
   and print. Let `app/portal.css` own the public overview, document reader,
   and help presentation. Pages and the no-JavaScript help route load the
   public-reader owner after the global foundation.
2. Keep one ordered public-reader media family: screen, then maximum widths
   1180, 1080, 880, 760, 700, 620, and 460 pixels. A selector appears at most
   once inside an equivalent media scope. State and pseudo-element selectors
   remain distinct rules when they express distinct behaviour.
3. Parse both stylesheets with the locked PostCSS grammar. Fail when a
   public-reader selector leaks back into the global file, when equivalent
   media scopes repeat a selector, when the ordered media family drifts, or
   when the reader exceeds 80 characters per line or falls below 1.5 leading.
   Keep a 2,500-line debt ceiling on the reduced global owner.
4. Keep print rules in the global owner. CSS structure checks complement the
   route and accessibility tests; they do not replace browser review at the
   required routes, widths, text zoom, and keyboard states.

## Consequences

- Reviewers can identify the owner of a public-reader selector before changing
  it, and accidental later overrides fail in the site lane.
- The global stylesheet becomes materially smaller without creating a second
  source for publication content or changing print ownership.
- Adding a breakpoint or exceeding the global debt ceiling requires a reviewed
  authority change instead of silently extending the cascade.
- Visual equivalence during this consolidation does not prove that the design
  is optimal; later research-design work can change the owner deliberately and
  retain before-and-after evidence.

## Supersession

Supersede this record if the public reader adopts another generated or
component-scoped style authority, or if one responsive system can no longer
serve the overview, document reader, and help route.

# 0030 — Publish each research document at a canonical route

- **Status:** accepted
- **Date:** 2026-08-28

## Context

The public portal originally selected concept and mathematics documents with a
`?doc=` query parameter inside one client-rendered application shell. Every
selection therefore returned the homepage title, description, and canonical
URL before JavaScript ran. Search engines and link previews could not identify
the 49 maintained documents as distinct works, and there was no sitemap.

The repository already has one deterministic document corpus. Discovery
metadata must be generated from that corpus rather than maintained as another
hand-written index.

## Decision

1. Every maintained concept and mathematics document has one clean public HTML
   route derived deterministically from its repository path.
2. Each route emits indexable fallback content, a unique title and description,
   exactly one self-canonical URL, truthful social metadata, and structured data
   that describes the visible document.
3. Portal links use ordinary `<a href>` navigation and the History API. Legacy
   `?doc=` links redirect to the corresponding clean route.
4. `sitemap.xml` is generated from the same route registry and contains only
   absolute HTTPS canonical URLs. `robots.txt` advertises that sitemap and does
   not block the scripts, styles, or source assets needed to render a page.
5. The build validator requires exact equality between the canonical route set,
   sitemap entries, generated HTML documents, and reachable internal links.
6. Git Markdown remains the canonical source. Static routes, the portal, the
   book, and the PDF are generated reading surfaces, not additional prose stores.

## Alternatives considered

- **List only the portal and book in a sitemap.** Rejected because it leaves the
  maintained chapters indistinguishable behind one application shell.
- **Keep query-parameter URLs and update metadata only in JavaScript.** Rejected
  because raw HTML would continue to send conflicting homepage canonicals and
  discovery would depend on deferred rendering.
- **Publish raw Markdown as the canonical search result.** Rejected because it
  discards the maintained reader, mathematics, diagrams, navigation, and page
  metadata.
- **Maintain a second manual SEO index.** Rejected because it would drift from
  the document corpus that already drives the portal.

## Consequences

- New or removed concept and mathematics files change the route registry,
  sitemap, portal catalogue, and static pages together.
- A document move changes its public URL and therefore requires an explicit
  redirect decision rather than an unnoticed query-string change.
- Search Console submission remains an external deployment step; a valid
  sitemap is a discovery hint, not a guarantee of indexing or ranking.

## Supersession

Supersede this decision if the public site moves to a server-rendered platform
that provides the same canonical-route and corpus-equality guarantees directly.

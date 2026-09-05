# 0058 — Expose only route-available reviewed translations

- **Status:** accepted
- **Date:** 2026-09-04
- **Partly supersedes:** [0035](0035-publish-only-reviewed-source-bound-translations.md),
  language-control presentation only
- **Related:** [issue #51](https://github.com/lusoris/20-watts-was-enough/issues/51)

## Context

Decision 0035 required every published translation to be reviewed and bound to
the exact English source, but its language-control description still mixed two
different tasks. A reader choosing an available edition and a contributor
offering an unavailable language should not pass through the same list of
options.

The publication also needs one discoverable relationship between each
canonical document and its reviewed translations. Search guidance requires
each localized page to identify itself and all of its peers, with the links
returned by every member of that set. A one-sided or unreviewed language link
would misstate the public corpus.

## Decision

1. The reading control lists English and only the reviewed translations
   registered for the current source route. Other official EU languages remain
   reachable through the separate, source-bound contribution route; they are
   not presented as readable editions.
2. When a source route has at least one reviewed translation, every generated
   canonical and translated page emits the same fully qualified set of
   `rel="alternate"` links: one self link and one link for every reviewed peer.
   Unavailable, unreviewed and stale translations emit no language alternate.
3. The publication build validates the complete translation manifest and file
   digests before deriving its bounded availability projection. Static Pages,
   no-JavaScript navigation and hydrated navigation consume that same route
   model; malformed or duplicate projections fail closed.
4. Hydrated reading links retain the validated `PAGES_BASE_PATH` for supported
   subpath previews. Canonical and language-alternate discovery URLs remain at
   the production custom-domain root established by decision 0029.
5. The Pages artifact validator compares each document's complete alternate
   set with the validated manifest projection. Missing, extra, asymmetric or
   stale language metadata blocks publication.
6. Each reviewed-manifest entry records the exact lowercase 40-character Git
   source commit and a canonical UTC review instant. The translated page shows
   both maintained values and links its canonical source at that commit;
   malformed or omitted review provenance blocks publication.

This decision does not publish or assess a German translation. Issue 51 remains
blocked until a competent human reviewer accepts a source-bound German pilot
under decision 0035.

## Consequences

- Readers see only destinations that the project can actually serve.
- Static and hydrated reading controls preserve the same route and hosting-base
  semantics.
- Search metadata describes reviewed public editions without converting a
  translation request or draft into a publication claim.
- A reader can inspect which immutable source revision was reviewed and when,
  without trusting the build checkout as an inferred review record.
- Decision 0035 remains authoritative for review competence, source and target
  digests, disclosure and publication admission.

## References and disclosure

- [Google Search Central, *Tell Google about localized versions of your page*](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [W3C, *Authoring HTML: Language declarations*](https://www.w3.org/TR/i18n-html-tech-lang/)

OpenAI Codex was materially used on 2026-09-04 and 2026-09-05 for
implementation, testing and drafting under maintainer direction. It is not an
author or accountable approver. No translation was generated, reviewed or
published by this change.

## Supersession

Supersede this record if the project adopts a different public translation
authority, changes the canonical hosting root, or deliberately presents
unavailable languages inside the reading control again.

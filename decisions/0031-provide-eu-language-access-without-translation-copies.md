# 0031 — Provide EU language access without translation copies

- **Status:** accepted
- **Date:** 2026-08-28

## Context

The public portal and book need a practical reading path beyond English. A
second maintained corpus for every language would multiply review, scientific
drift, canonical URLs, search metadata, build cost, and correction work. An
embedded third-party translation widget would also execute external code and
potentially contact its provider before the reader made that choice.

## Decision

1. English Markdown remains the only canonical and reviewed prose corpus.
2. The portal and web book expose all 24 official EU languages through one
   shared control.
3. A non-English choice creates an explicit link to Google Translate for the
   same canonical HTTPS path, query, and fragment. Translation begins only
   after the reader follows that link in a new tab.
4. The control identifies the result as automatic and states that the external
   provider's terms and privacy policy then apply.
5. No translator script, silent redirect, translated source copy, translated
   canonical URL, or unreviewed `hreflang` claim is added.
6. The downloadable PDF remains a stable English artifact; the interactive
   handoff is omitted from its rendering surface.

## Alternatives considered

- **Maintain reviewed translations in Git.** Deferred until qualified review
  and correction capacity exists for each language.
- **Embed a translation widget.** Rejected because it creates a third-party
  runtime and privacy boundary before an explicit handoff is necessary.
- **Publish automatically generated translated pages as canonical variants.**
  Rejected because their scientific meaning is not reviewed and could drift
  independently from corrections to the English source.
- **Offer only a few large-language options.** Rejected because the same
  explicit handoff can cover the complete official EU language set without a
  second corpus.

## Consequences

- Readers gain a low-maintenance access aid, not a claim of human-reviewed
  localisation.
- Search engines continue to see one canonical version of each document.
- The external privacy boundary is visible and user-triggered.
- A future reviewed translation programme must define ownership, correction,
  canonical routing, search metadata, and parity checks before replacing this
  decision.

## Supersession

Supersede this record when the project maintains at least one reviewed
translation in Git, changes translation provider or privacy boundary, or makes
non-English pages independently canonical.

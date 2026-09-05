# 0067 — Bind public research objects to exact maintained identity

- **Status:** accepted
- **Date:** 2026-09-04
- **Related:** [issue #50](https://github.com/lusoris/20-watts-was-enough/issues/50)
- **Extends:** [decision 0036](0036-use-one-source-to-publication-and-feedback-graph.md), [decision 0039](0039-make-pages-a-research-publication-surface.md), [decision 0050](0050-review-the-book-and-pdf-as-one-publication.md)

## Context

A canonical route identifies where a research document is published, but it
does not identify the source revision used for that view. The public reader
also needs to show which maintained claims, principles, audits or experiment
contracts point to that document without inventing a relationship from shared
words or status.

Release disclosure records are edition-specific. In particular, a disclosure
for a tagged release cannot truthfully stand in for a later continuous `main`
snapshot.

## Decision

1. Every focused English concept or mathematics page exposes one compact
   research-object header. The static fallback and hydrated reader use the same
   identity projection.
2. A Pages build identifies itself as `Site vX.Y.Z · continuous main snapshot`.
   When CI supplies its exact commit, source, history, citation, licence and
   mapped-record links bind to that commit. Client-fetched Markdown and mapped
   records use the validated commit as a deployment cache key. The web-book
   cover carries the same edition label and commit.
3. A tagged release PDF is renderable only when both `vX.Y.Z` and an exact
   lowercase 40-character commit are supplied. Its cover shows both identities.
   The generated manifest and renderer-reproducibility receipt retain the same
   tag and commit pair.
   Query-selected PDF rendering is a loopback-only build input; public hosts
   ignore query-provided release identity.
4. Mapped records come only from exact Markdown links maintained in the focused
   document or from an exact claim-ledger `Used by` link back to that document.
   The projection does not join keywords, expand ranges, infer reverse
   relationships or assign evidence status to a whole document.
5. Disclosure is optional metadata. Omit the route unless an authority file
   explicitly maps that disclosure to the published object and edition.
6. Source, history, book, PDF, citation, licence and any available disclosure
   remain adjacent. Clarity and evidence corrections use different typed issue
   forms and carry the canonical path, public route, edition, available commit
   and, in the hydrated reader, current fragment. Each prefilled locator is one
   bounded, semicolon-delimited line; generation fails rather than truncating
   source identity.
7. Generated-build validation rejects stale or duplicate identity fields,
   missing exact routes and feedback links that lose their identity locator.

## Consequences

- A reader can cite or report the exact deployed Pages source revision without
  mistaking the package version for an immutable release or claiming an
  artifact-byte identity the header does not provide.
- Adding a research relationship requires an authored reciprocal or outbound
  link in an authority file; the portal does not become a second evidence
  ledger.
- The tagged `v0.3.0` disclosure stays absent from continuous `main` pages until
  a maintained mapping exists.
- Release automation must pass its verified tag commit into both PDF rendering
  and the independent reproducibility run.

## Disclosure

OpenAI Codex was materially used on 2026-09-04 for repository inspection,
drafting, implementation and automated checks under maintainer direction. It
is not an author or accountable approver. No scientific result, legal review,
security certification or accessibility conformance claim is created here.

## Supersession

Supersede this record if another authority replaces exact Markdown links, the
edition model changes, or disclosures gain a maintained object-to-edition
registry.

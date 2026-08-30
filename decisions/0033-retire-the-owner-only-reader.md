# 0033 — Retire the owner-only reader

- **Status:** accepted
- **Date:** 2026-08-29

## Context

GitHub Pages now publishes the portal, document routes, web book, PDF, legal
material, and source links at the custom-domain root. The older owner-only
ChatGPT Site duplicated that reading surface through a Vinext and Cloudflare
Worker build. Keeping both paths doubled framework dependencies, build tests,
link rules, and deployment state without providing a distinct research
authority or public capability.

## Decision

1. GitHub Pages is the only hosted reader and the only local web-development
   target.
2. The Pages portal and `/book/` remain static views of canonical Git source;
   generated output stays outside version control.
3. PDF generation renders the Pages book entry with an explicit source ref, so
   release PDFs and the web book share one renderer.
4. Remove the ChatGPT Sites project, hosting metadata, Vinext server routes,
   Cloudflare Worker, private-reader components, and their dependencies.
5. Retain direct GitHub source links and release-tag identity rather than
   introducing another content or deployment authority.

## Consequences

- There is one navigation, accessibility, SEO, link, and publication surface
  to test.
- Local preview uses the Pages Vite configuration, and the aggregate build
  validates the same static artifact that is deployed.
- Server-only features would require a new decision and a defined trust,
  privacy, retention, and operational boundary.
- This decision supersedes Decision 0005 and the owner-only-reader portions of
  Decision 0024. Decision 0024's Git, Pages, and licensing allocations remain
  in force.

## Supersession

Supersede this record if the public reader gains an intentional server-side
runtime or moves away from GitHub Pages.

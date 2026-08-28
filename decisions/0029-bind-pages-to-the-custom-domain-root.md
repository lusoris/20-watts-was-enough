# 0029 — Bind GitHub Pages to the custom-domain root

- **Status:** accepted
- **Date:** 2026-08-28

## Context

GitHub Pages serves the project through `https://www.cordana.dev/`. The static
bundle nevertheless used `/20-watts-was-enough/` as an unconditional Vite base,
which is correct for a repository URL on `github.io` but incorrect at a custom
domain root. The HTML therefore requested JavaScript and CSS below a directory
that does not exist and the deployed site failed before the reader could mount.

The build must retain an explicit subpath mode for local or alternate hosting
tests without allowing an accidental URL, traversal, query, or ambiguous path
to become part of a public artifact.

## Decision

1. The default and production GitHub Pages base is `/`, matching the configured
   custom-domain root.
2. `PAGES_BASE_PATH` is the only supported override. It is normalized and
   accepted only as a safe root-relative path made from URL-safe segments.
3. The Pages workflow sets the production base explicitly rather than relying
   on a developer's ambient environment.
4. The static-artifact validator resolves references against the same base as
   the build and rejects legacy repository-subpath asset routes in a root build.
5. Tests cover both `/` and an explicit repository subpath. The final artifact
   uploaded by the production workflow always uses `/` while the custom domain
   remains the publication endpoint.
6. Canonical and social metadata use `https://www.cordana.dev/`; GitHub remains
   the canonical source repository, not the canonical reading URL.

## Alternatives considered

- **Keep the repository-name base and proxy it at the custom domain.** Rejected
  because it makes every public route depend on a redundant implementation
  detail and caused the current deployment failure.
- **Remove subpath support entirely.** Rejected because the same static build
  may need a bounded preview below a path, and supporting that case makes the
  base contract directly testable.
- **Infer the base from the GitHub repository name in CI.** Rejected because
  repository identity does not determine the path of a configured custom
  domain.

## Consequences

- Root-hosted assets, documents, downloads, plots, legal files, and `/book/`
  resolve under `www.cordana.dev` without a repository-name prefix.
- Alternate subpath builds require an explicit environment value and use the
  same validator.
- A future domain or hosting-path change must update the workflow, canonical
  metadata, tests, and GitHub Pages configuration as one publication change.

## Supersession

Supersede this decision if GitHub Pages is replaced as the public deployment
mechanism or if the site deliberately moves below a non-root production path.

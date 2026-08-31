# Maintenance authority map

Use this routing table before adding automation. The paths and commands point
to the current owner; they do not make every listed repair safe to run against
remote state.

| Concern | Committed authority | Read-only or focused check | Repair or projection boundary |
| --- | --- | --- | --- |
| Dependency proposals and lockfile refresh | `renovate.json`, package and language lockfiles | `npm run validate:policy` plus the affected language tests | Renovate opens bounded review proposals; it does not automerge |
| CI lane selection | `.github/ci-impact.json` and `tooling/internal/ciplan/` | `go -C tooling run ./cmd/20w ci plan --root .. --base <commit> --head <commit>` | `.github/workflows/ci.yml` runs the projected lanes; `--full` remains the integration escape hatch |
| Labels, roadmap milestones and issue assignments | `.github/labels.json`, `.github/milestones.json` and `.github/issue-milestones.json` | `go -C tooling run ./cmd/20w github sync-metadata --root .. --check` | Trusted-main metadata workflow or explicit `--repository`; preflight all three scopes, preserve unmanaged objects and never infer a pull request |
| Experiment manifests and release candidates | `experiments/workstation/manifests/` and experiment contracts | `go -C tooling run ./cmd/20w experiment validate --root ..` and `go -C tooling run ./cmd/20w experiment release-plan --root ..` | Release workflow packages only admitted, exact-source artifacts |
| PDF publication | canonical book sources, `tooling/pdf-renderer/`, and renderer lock | `go -C tooling run ./cmd/20w publication render-pdf --root .. --check` and `npm run validate:book-pdf` | `npm run generate:book-pdf`; generated reader copies remain non-authoritative |
| PDF renderer reproducibility | renderer-lock schema 3, the explicit renderer-affecting source predicate and `tooling/internal/pdfrender/` | `go -C tooling run ./cmd/20w publication render-pdf --root .. --check` | The renderer-selected CI gate runs `20w publication verify-pdf-reproducibility` with two fresh no-cache builders and retains the receipt; tagged releases always run it and checksum the receipt. Missing, invalid, unmapped and selector-authority diffs select it fail-closed; non-additive diffs inspect both retained paths. A mismatch blocks the boundary. Remove this projection only when a superseding decision retires the Docker image identity or replaces its acceptance contract. |
| PDF semantic tools image | `tooling/pdf-tools/`, decision 0053 and the explicit `go-pdf-tools` impact rule | `go -C tooling run ./cmd/20w publication verify-pdf-tools --root ..` | The impact rule selects only Go and release checks until a focused final-image gate exists. Package revisions require review and a fresh lock; candidate assembly, publication and digest admission remain maintainer-gated issue-20 work. Do not schedule a lock refresh or use an ambient Poppler fallback. |
| Reader artifacts and Pages | `github-pages/public-artifacts.json`, canonical Markdown, and Pages source | `npm run test:github-pages` | `npm run prepare:reader-artifacts` and the trusted Pages workflow |
| Public redirect and certificate drift | `.github/public-transport.json` and decision 0047 | `go -C tooling run ./cmd/20w publication verify-public-transport --root .. --check` | The post-deployment Pages job performs the bounded live check; DNS and Cloudflare settings remain administrative state |
| Field coverage and test coverage | research ledgers, experiment contracts, and generator source | `npm run validate:coverage` and `npm run check:test-coverage` | `npm run generate:coverage` or `npm run audit:tests` only after reviewing the source delta |
| Scientific taxonomies | pinned taxonomy sources and import rules | `npm run validate:taxonomies` | `npm run generate:taxonomies`; imported terms do not become evidence |
| Translation freshness | English canonical files and `translations/manifest.json` | `npm run validate:translations` | Candidate export/import remains review-only; named human review is required for publication |
| Prose tripwires | canonical project Markdown and `scripts/audit-prose-style.mjs` | `npm run check:prose` | Conservative edits use `research-writing` and `reader-editor`; never auto-paraphrase claims |
| Repository policy and security posture | `AGENTS.md`, `docs/principles.md`, pinned workflows, and security configuration | `npm run validate:policy`, CodeQL, Scorecard, and dependency review | Repair the owned source; never silence a finding merely to make a gate green |
| Release state and assets | exact Git tag, release workflows, checksums, and Go release packages | The `go -C tooling run ./cmd/20w release` inspection and validation subcommands | The release workflow mutates only the exact admitted tag and release identity |

When two rows appear to own the same value, fix that duplication before adding
a synchroniser. Generated state should point back to its authority and expose a
freshness check.

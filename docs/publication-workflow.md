# Research publication and feedback workflow

## Current answer

Git `main` is the only maintained research authority. The portal, clean HTML
routes, full web book, PDF, release assets, scoped OCI images and reviewed
translations are generated derivatives. Issues and pull requests point back to
an exact source path, claim, experiment, commit, release tag or image digest;
they do not become another content store.

```text
canonical Git source
  ├─ Pages build ── portal + document routes + web book + static help + metadata
  ├─ PDF renderer ── downloadable book + manifest
  ├─ release build ── checksummed assets + attestations
  ├─ OCI build ── static 20w image + one scoped image per released experiment
  └─ translation manifest ── reviewed, source- and target-digest-bound derivatives

reader feedback
  └─ typed GitHub issue ── source identity ── pull request ── canonical Git source
```

## Why this structure fits research work

The useful pattern in established GitHub publishing systems is not a specific
site generator. It is a reproducible source-to-publication boundary. Quarto's
official guidance uses GitHub Pages for repository-hosted work, renders in CI,
supports navigable and searchable document collections, and adds scholarly
citation metadata. FAIR4RS asks research software to expose identifiers,
metadata, licences, provenance and qualified references. This repository keeps
its custom Vite reader because it already implements the required route,
search, mathematical rendering, fallback and PDF contracts; migrating
generators would duplicate work without fixing an identified boundary.

The reading column follows the accessibility constraint that users must be able
to keep lines at no more than 80 characters. Focused documents and the web book
use a 72-character measure, 16–16.5 px body text and approximately 1.72 line
spacing. Tables, equations and diagrams may use bounded overflow regions rather
than widening prose. Navigation and metadata remain visually subordinate but
must not fall below the tested readable scale.

## One authority per concern

| Concern | Maintained authority | Generated or external consumer |
| --- | --- | --- |
| Reader corpus | `concept/`, `math/` | Focused Pages routes, web book, PDF, search and metadata |
| Research ledgers, audits and generated reports | `research/` | Direct Git source links; only an explicitly listed appendix, currently `research/field-coverage.md`, enters the book and PDF |
| Claims and principles | stable `C-` and `P-` registries | readiness and traceability views |
| Experiment contracts | `experiments/candidates/`, `experiments/fixtures/` | workstation plans and receipts |
| Runtime | locked manifests and workstation code | static tooling image and one tagged GHCR image per released experiment |
| Public identity | `app/lib/publication.mjs` | dynamic and static SEO, reader links and issue routes |
| Translation status | `translations/manifest.json` | reviewed language routes bound to exact source and target bytes |
| Feedback | typed issue forms | pull requests against the matching authority |
| Managed issue labels | `.github/labels.json` | repository labels used by issue forms and triage |
| Durable policy | append-only `decisions/` | contributor and automation rules |

Duplication is allowed only when the derivative is necessary for distribution
and is regenerated or checked against its authority. A copied value with no
freshness check is a defect.

## Feedback from a reading surface

- A focused document exposes its canonical Markdown and a preselected site or
  documentation issue whose title names the source path.
- The portal and full book expose the GitHub issue chooser for evidence,
  experiment, translation, presentation, repository and private-security
  routing.
- Experiment reports name the container digest, source revision, artifact and
  `NO_RESULT` receipt.
- Translation routes prefill the target language, source path, source digest,
  reviewed target digest and recorded reviewer in the translation form. The
  reporter must still disclose any drafting tool.

The issue is a triage and coordination record. Accepted text, code, data and
policy changes still land through the authoritative file and its validation
gate.

The [public-interface audit and maintainer decision
queue](public-research-interface-audit.md) benchmarks the current reading
surface and keeps unresolved community, archive, annotation and translation
service choices out of presentation code.

## Automation boundary

The aggregate `npm run check` command is the pull-request and release quality
authority. Pages deployment runs the narrower `npm run test:github-pages`
pipeline because it must produce the upload artifact. Tagged release
verification runs the aggregate gate once, then creates tag-bound assets, the
static `20w` image, and scoped experiment images from the already verified
source. The first future tag whose source contains and passes this release path
will publish the new images; older releases are not backfilled. Their complete
`image@sha256:...` identities appear in the release notes. The only native
convenience file currently exercised and admitted is `20w-linux-amd64`. Each
external GitHub Action is pinned to a full commit SHA and every job has bounded
time and least privilege.

Container publication has a separate two-phase boundary. The build pushes a
candidate under its canonical digest without a release tag. The workflow then
validates and executes that exact digest, creates a missing source-bound
attestation, verifies provenance, and only then attaches the release tag and
checks its final digest binding. On a rerun, an existing tag is re-admitted at
the same digest; the workflow can repair a missing attestation after execution
passes, and recovery has no intentional deletion or replacement path. Tag
creation is serialized and immediately absence-checked. GHCR does not expose a
documented atomic create-if-absent operation through this path, so package
writers remain a trusted concurrent-writer boundary; final inspection rejects
a divergent binding. A candidate that fails before tag attachment is not a
release-tag identity.

The Go catalogue derives `experiment-release-plan.json` from the checked
workstation manifests. Policy validation reads the same manifest projection
and requires its image, platform, Dockerfile and build-context set to match the
explicit CI and release steps. The generated plan is not interpreted as
workflow code: each runtime class keeps a reviewed build and exact-digest
execution path in YAML. Adding or changing a release image therefore requires
the manifest and its workflow implementation to change together, or the gate
fails closed.

The `20w github sync-labels` command validates and applies the managed label
manifest. A trusted-main workflow creates missing labels and repairs changed
ones without deleting labels outside the manifest. Manual repair still checks
out canonical `main`, so an arbitrary workflow ref cannot become a second label
authority.

## Sources used for this benchmark

- [Quarto websites](https://quarto.org/docs/websites/)
- [Quarto publishing with GitHub Pages](https://quarto.org/docs/publishing/github-pages.html)
- [Quarto continuous integration](https://quarto.org/docs/publishing/ci.html)
- [Quarto citeable articles](https://quarto.org/docs/authoring/create-citeable-articles.html)
- [W3C sufficient techniques for visual presentation](https://www.w3.org/WAI/WCAG22/Techniques/css/C20)
- [FAIR Principles for Research Software](https://www.researchsoft.org/blog/2022-08/)
- [GitHub issue-form syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)

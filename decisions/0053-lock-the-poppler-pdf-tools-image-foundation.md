# 0053 — Lock the Poppler PDF-tools image foundation

- **Status:** accepted
- **Date:** 2026-08-31
- **Implements:** first repository-authority slice of [issue 20](https://github.com/lusoris/20-watts-was-enough/issues/20)

## Context

The PDF semantic sentinel names Poppler 26.08.0, but host-installed tools can
change without a repository diff. A dedicated image is needed before that
sentinel can become required CI. It must remain separate from the browser PDF
renderer and from experiment images because each has a different authority and
release cadence.

The inspected Wolfi graph for `poppler=26.08.0-r0`,
`poppler-utils=26.08.0-r0` and `poppler-doc=26.08.0-r0` contains 45 `x86_64`
APKs. The documentation package supplies 13 command man pages. The APK graph
does not supply Poppler's `AUTHORS`, `COPYING`, `COPYING3`, `README-XPDF` or
`README.contributors` files.

The root `LICENSE` at the reviewed Wolfi revision identifies Wolfi build
recipes as Apache-2.0. It also states that underlying packages retain their own
licence terms and that an assembled image combines those terms. The exact root
licence is therefore a recipe-provenance input, not a licence conclusion for
Poppler, its dependencies or the image.

With the pinned apko 1.2.41 image, its complete lock and
`SOURCE_DATE_EPOCH=1785757696`, two base-image builds produced the same archive
SHA-256, OCI manifest, config and layer identities recorded in
`tooling/pdf-tools/contract.json`. Runtime probes observed Poppler 26.08.0,
UID/GID 65532 and the absence of a shell and package manager under the planned
containment flags. These are construction checks for the base image, not a
published digest, final-image reproducibility result or scientific result.

## Decision

1. Keep one PDF-tools authority in `tooling/pdf-tools/`. Pin the apko builder by
   digest, all three direct APKs at `26.08.0-r0`, the complete transitive lock,
   the official Poppler archive, the reviewed Wolfi recipe revision and that
   revision's exact root Apache-2.0 recipe licence.
   Package-revision changes require a separate review and fresh semantic
   baseline; dependency automation must not refresh this lock opportunistically.
2. Validate the committed authority offline through
   `20w publication verify-pdf-tools`. The standard-library Go check owns
   config projection, lock closure, APK retention metadata, notice bytes,
   source identities, resource bounds and its link to the existing PDF-renderer
   BuildKit lock.
3. Add the five missing Poppler notice files in one deterministic final image
   layer beneath `/usr/share/licenses/poppler/`. Keep the man pages supplied by
   the exact `poppler-doc` APK. A two-build comparison of the final manifest,
   config and every layer remains a publication gate.
4. Retain every exact locked APK by URL, size and SHA-256. Before a candidate
   push, assemble the named bounded bundle containing those APKs, the lock and
   manifests, the official Poppler source archive, pinned recipe, pinned root
   recipe licence, notices and generated SPDX SBOM. Keep the candidate bundle
   for 30 days and carry the admitted inventory into a checksum-bound GitHub
   Release asset.
5. Treat the generated SPDX source and recipe locators, pinned Wolfi root
   recipe licence, APK licence declarations and copied notices as review
   inputs. None establishes an image-wide licence or legal-compliance result.
   Maintainer notice/source approval remains required before the first remote
   candidate push.
6. Keep the image at `NO_RESULT`. Do not publish from this repository slice,
   admit a mutable tag, claim a public digest or move the semantic sentinel into
   CI until the remaining issue-20 gates pass.

## Consequences

- Repository review can now detect package, provenance, notice and retention
  drift without Docker or network access.
- Image construction still needs the exact pinned apko container. Go owns the
  authority and validation; it does not reimplement APK assembly.
- The recorded base identities are bounded workstation observations. Final
  notice-layer assembly, two-build final-image acceptance, provenance, public
  visibility and anonymous exact-digest access remain open work in issue 20.
- The 30-day candidate route and eventual release asset preserve the reviewed
  bytes without turning a workflow artifact into source or scientific
  authority.

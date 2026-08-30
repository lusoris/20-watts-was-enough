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

The useful pattern in established Git-centred research projects is not a
specific site generator. It is a reproducible source-to-publication boundary.
The [external infrastructure
audit](../research/audits/2026-08-30-git-centred-open-research-publication-infrastructure.md)
compares that boundary across repositories, papers, specifications and current
service documentation. This repository keeps its custom Vite reader because
it already implements the required route, search, mathematical rendering,
fallback and PDF contracts; migrating generators would duplicate work without
fixing an identified boundary.

The reading column applies the externally recorded bounded-line, reflow and
text-spacing guidance. Focused documents use an `18px` body, approximately
`1.66` line height and a `68ch` argument measure on wide screens. Small screens
start around `17px`, `1.68` and `20px` gutters. These are project defaults, not
universal accessibility thresholds. Tables, equations and diagrams may use
bounded overflow regions rather than widening prose. Navigation and metadata
remain visually subordinate but must not fall below the tested readable scale.

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

The [external research audit](../research/audits/2026-08-30-git-centred-open-research-publication-infrastructure.md)
holds the comparison evidence and unresolved service choices. The
[interface implementation audit](public-research-interface-audit.md) records
only rendered observations, adopted rules and falsifiable reader tasks.

## Automation boundary

The aggregate `npm run check` command is the pull-request and release quality
authority. Pages deployment runs the narrower `npm run test:github-pages`
pipeline because it must produce the upload artifact. Tagged release
verification runs the aggregate gate once, then creates tag-bound assets, the
static `20w` image, and scoped experiment images from the already verified
source. Releases from v0.3.0 whose source contains and passes this path publish
the new images; earlier releases are not backfilled. Their complete
`image@sha256:...` identities are recorded in the checksum-bound
`oci-images.json` release asset. The release notes render the same identities
for readers, but are not digest authority. The only native convenience file
currently exercised and admitted is `20w-linux-amd64`. Each external GitHub
Action is pinned to a full commit SHA and every job has bounded time and least
privilege.

The PDF renderer's checked-in JSON lock is the authority for its container,
browser and resource inputs. The Go renderer validates that lock and generates
a temporary closed Dockerfile whose two `FROM` instructions contain the lock's
literal OCI digests. The template contains no image identity, and the generated
Dockerfile is not a second maintained source. The separate `package-lock.json`
binds JavaScript packages, and tagged release CI realizes that graph with the
exact locked Node and npm versions before rendering. Both locks and the Go
generator contribute to the book source digest.

The same lock binds the Docker exporter's layer-timestamp rewrite and records
compatibility version 30 as the reviewed default of the pinned BuildKit 0.32.2
image. Go uses `type=docker,rewrite-timestamp=true` explicitly and rejects the
known warnings for a missing epoch or failed layer rewrite. Compatibility 30 is
review metadata, not a passed Docker-exporter attribute; changing BuildKit
requires a fresh review and two-builder comparison.

The two render containers use disjoint output, work and browser-cache
directories, but currently share that one read-only installed JavaScript
dependency tree. Their byte comparison therefore tests deterministic rendering
conditional on one clean `npm ci` realization; it does not independently
reinstall or byte-bind two realized `node_modules` trees.

Container publication has a separate two-phase boundary. The build pushes a
candidate under its canonical digest without a release tag. The workflow then
validates and executes that exact digest. Only a digest produced by a build
step in the current run receives a new source-bound build attestation, using
that step's digest directly. On a rerun, an existing tag is re-admitted at the
same digest only if its workflow-, tag- and commit-bound provenance already
verifies; missing provenance stops the release. The workflow then attaches a
missing release tag and checks its final digest binding. Recovery has no
intentional deletion or replacement path. Tag
creation is serialized and immediately absence-checked. GHCR does not expose a
documented atomic create-if-absent operation through this path, so package
writers remain a trusted concurrent-writer boundary; final inspection rejects
a divergent binding. A candidate that fails before tag attachment is not a
release-tag identity.

GitHub Release publication starts only after all three final image digests can
be pulled without credentials from a fresh, empty Docker configuration. GitHub
[creates a personal-account package as private by
default](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility),
even when its linked repository is public. GitHub also warns that changing a
package from private to public is irreversible. For the v0.3.0 release, this
one-time settings action is limited to these three package identities:

- `ghcr.io/lusoris/20-watts-was-enough-20w`
- `ghcr.io/lusoris/20-watts-was-enough-fixture-007`
- `ghcr.io/lusoris/20-watts-was-enough-fixture-019`

The first run that creates them can therefore stop at this gate. Set only these
packages to **Public** in GitHub's package settings, then manually rerun the
same exact release tag. Do not create or move a replacement tag to pass the
visibility gate.

Repository [immutable releases must be
enabled](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases)
before v0.3.0 is published. Reading that setting requires repository
administration permission, which the release job does not receive. The
maintainer enables it through the administrative boundary; after publication,
the least-privileged workflow instead requires GitHub to report the release as
immutable. It also resolves either a lightweight or bounded annotated tag
chain to the verified source commit before it considers release state.

After final tag binding and the first anonymous pull gate, the Go release tool
writes one closed `oci-images.json`. It contains schema and contract versions,
the source tag and commit, `linux/amd64`, `NO_RESULT`, and the sorted exact
identities of the tooling, Fixture 007 and Fixture 019 images. The workflow
adds that file to `SHA256SUMS`, verifies the complete checksum inventory, and
attests every asset before publication. Release notes remain presentation;
editing prose cannot change the persisted container authority.

A same-tag run begins with a read-only preflight. The Go release command reads
every source asset twice, binds initial and final directory snapshots, and
derives the only allowed names from `SHA256SUMS`. Existing remote assets are
downloaded by asset ID and compared by hash and bytes. Before any upload,
creation or publication edit, the final step repeats the local stable-read and
attestation checks. It then validates the complete downloaded remote directory
against its own checksum authority and verifies attestations over those remote
bytes. No path deletes or moves a tag or asset, replaces an existing asset, or
uses `--clobber`.

GitHub recommends creating a draft, attaching every asset, and publishing only
after the draft is complete. A fresh run follows that sequence, verifies all
draft bytes, publishes it, and then requires GitHub to report the release as
immutable. A manual rerun may fill only missing assets in an existing
non-prerelease draft after every present asset compares exactly. An existing
published release must already be non-prerelease, complete, byte-matching and
immutable; that branch performs no container-image build, upload, attestation
creation, release edit or other remote mutation. It still verifies
release-asset attestations, every persisted image and tag binding, image
provenance, and anonymous exact-digest pulls.

The Go catalogue derives `experiment-release-plan.json` from the checked
workstation manifests. Policy validation reads the same manifest projection
and requires its image, platform, Dockerfile and build-context set to match the
explicit CI and release steps. The generated plan is not interpreted as
workflow code: each runtime class keeps a reviewed build and exact-digest
execution path in YAML. Adding or changing a release image therefore requires
the manifest and its workflow implementation to change together, or the gate
fails closed.

The `20w github sync-metadata` command validates and applies the managed label
and milestone manifests. A trusted-main workflow creates missing objects and
repairs changed ones without deleting unmanaged labels or milestones. Manual
repair still checks out canonical `main`, so an arbitrary workflow ref cannot
become a second metadata authority. Milestones project the stage identities and
links from the canonical [research roadmap](../concept/90-research-roadmap.md);
their completion percentages count associated issues and pull requests, not
scientific evidence.

## Research basis

The primary sources, repository snapshots, observations, retained boundaries
and open decisions are maintained once in the
[Git-centred open research publication infrastructure
audit](../research/audits/2026-08-30-git-centred-open-research-publication-infrastructure.md).

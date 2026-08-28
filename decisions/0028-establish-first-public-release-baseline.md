# 0028 — Establish the first public release baseline at v0.2.0

- **Status:** accepted
- **Date:** 2026-08-28

## Context

`CHANGELOG.md` contains a historical `0.1.0` entry dated 2026-08-05 for the
initial preservation and classification of source material. No Git tag or
GitHub Release was created at that point, and the package, publication
allowlist, split licensing, generated PDF manifest, public Pages edition, and
current source-provenance boundary did not yet exist as one tested release
contract.

Retroactively tagging an arbitrary 2026-08-05 commit would imply an exact tested
snapshot that was never frozen. A GitHub Release would also generate source
archives from that historical tree, including material predating the current
closed publication boundary. A version number in a changelog is not enough to
justify that new redistribution surface.

The current project is a material successor: it has a complete concept and
evidence framework, public portal and book, downloadable PDF, split licensing,
publication-boundary checks, workstation development harnesses, and the
engineering/governance contract adopted in decision 0027.

## Decision

1. Keep `0.1.0` as an honest changelog-only historical milestone. Do not create
   a retroactive `v0.1.0` tag or GitHub Release.
2. Set the next version to `0.2.0`. It is the second recorded project version
   and the first public tagged GitHub Release.
3. Create `v0.2.0` only from a clean, validated `main` commit whose
   `package.json`, root lockfile version, `CITATION.cff`, and changelog section
   agree.
4. Keep the continuously published tracked PDF bound to `main`. From the exact
   release-tag checkout, render and attach a second PDF/manifest pair bound to
   that immutable tag, together with project licensing and third-party notices,
   an SPDX dependency SBOM, and sorted SHA-256 checksums. Bind the exact attached
   bytes to GitHub build provenance without claiming a SLSA level,
   certification, or scientific confirmation.
5. Treat every release as an immutable research/publication snapshot. Scientific
   evidence and experiment authority remain controlled by their ledgers and
   promotion contracts, not by the tag.
6. Future tags use Semantic Versioning and the same exact-version and artifact
   checks. The package remains private and no npm publication occurs.

## Alternatives considered

- **Tag the first commit as v0.1.0.** Rejected because the changelog milestone
  did not identify one frozen, release-tested tree and the historical source
  archive would bypass the current publication choice.
- **Tag the current tree as v0.1.0 and then immediately create v0.2.0.**
  Rejected because it would rewrite the meaning and date of the existing
  milestone merely to produce two GitHub entries.
- **Restart public numbering at v1.0.0.** Rejected because the project remains
  pre-integrated-model, pre-confirmation, and explicitly pre-1.0.
- **Publish only the PDF manually.** Rejected because it would omit exact source
  identity, checksums, dependency inventory, and repeatable release validation.

## Consequences

- GitHub will have no `v0.1.0` tag; the reason is documented rather than hidden.
- `v0.2.0` is both semantically continuous with the changelog and honest about
  being the first public release surface.
- A release rebuild must target an existing immutable tag and may replace only
  its generated attachments after re-running the same validation.
- The Pages deployment remains continuous and separate from tagged release
  cadence, while both derive from canonical Git.

## Supersession

Supersede this decision if package publication is introduced, the public
artifact set changes materially, versions stop following Semantic Versioning,
or the publication boundary permits historical source archives that are
currently excluded.

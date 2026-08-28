# Repository-rule crosswalk

This ledger records which recurring conventions from the maintainer's other
repositories were adopted, adapted, staged, or rejected here. It prevents a
future maintainer or agent from copying a language- or product-specific setup
without checking whether its invariant belongs in this research repository.

## Reference set

The comparison used the public repository structures and contracts in:

- [`golusoris/golusoris`](https://github.com/golusoris/golusoris);
- [`golusoris/sveltesentio`](https://github.com/golusoris/sveltesentio);
- [`golusoris/goenvoy`](https://github.com/golusoris/goenvoy); and
- [`golusoris/.github`](https://github.com/golusoris/.github).

Those repositories are examples, not authorities for this project. The
deduplicated local authority is [`docs/principles.md`](principles.md).

## Repeated pattern extracted

Across the reference repositories, the stable pattern is:

1. one root engineering contract;
2. small nested contracts at real module or authority boundaries;
3. a narrow set of hard automated gates;
4. explicit contribution, ownership, governance, security, support, and
   conduct surfaces;
5. immutable action references and least-privilege workflows;
6. conventional change history and append-only decisions; and
7. automation that reflects the repository's language and artifacts rather
   than a generic tool checklist.

The current repository already had stronger rules for scientific evidence,
claim status, conventional nulls, experiment authority, units, source
provenance, split licensing, and EU/German applicability. Those were retained
and integrated rather than replaced.

## Adoption matrix

| Reference convention | Local decision | Concrete surface |
| --- | --- | --- |
| Root operational contract | **adopted** | [`AGENTS.md`](../AGENTS.md) |
| Nested per-module contracts | **adapted** to real trust boundaries only | `research/`, `experiments/`, `experiments/workstation/`, `app/`, `scripts/`, `.github/` |
| NASA/JPL Power of Ten | **adapted** by preserved invariant | [`docs/principles.md`](principles.md), P10-1–P10-10 |
| Zero-warning merge floor | **adopted** | `npm run check`, PR CI, Pages validation |
| Go lint/security/race toolchain | **rejected as language-specific** | TypeScript, ESLint, Node tests, CodeQL, dependency review instead |
| Global numerical coverage quota | **not adopted** | risk- and authority-based coverage; thresholds require a measured decision |
| Conventional Commits | **adopted** | contribution contract and PR-title CI |
| Semantic Versioning | **adopted for tagged snapshots** | release contract; no npm publication |
| Append-only ADRs | **already present and retained** | [`decisions/`](../decisions/README.md) |
| C4/PlantUML hierarchy | **not copied** | current Mermaid and mathematical-figure sources remain canonical |
| CODEOWNERS and PR template | **adopted and research-adapted** | `.github/CODEOWNERS`, `.github/PULL_REQUEST_TEMPLATE.md` |
| Generic bug/feature issues | **replaced** | evidence, mechanism, experiment, and presentation issue forms |
| EditorConfig | **adopted** | `.editorconfig` |
| Pinned GitHub Actions | **adopted** | all workflows use full commit SHAs |
| Renovate automerge | **staged** | config present; automerge remains off until required checks and repository rules are verified |
| Dependency licence deny-list | **rejected** | dependencies are reviewed against the actual EUPL/CC BY-SA boundary, not a copied GPL/AGPL ban |
| GoReleaser/OCI releases | **not applicable** | this project releases source, a static site, and a PDF research snapshot |
| Tag-bound release packaging and provenance | **adopted** | exact-version release workflow, deterministic SPDX SBOM, checksums, notices, PDF manifest, and GitHub build provenance |
| MkDocs workflow | **not applicable** | the existing Vite Pages portal and book are the maintained renderers |
| Auto-assignment and stale bots | **not adopted** | no value with one maintainer and long-running evidence work |
| US frameworks as normative defaults | **rejected** | EU/Germany applicability remains controlling; foreign material is comparative unless applicable |

## Enforcement now

The repository now treats the following as executable gates:

- strict TypeScript checking;
- ESLint, accessibility, React, and framework linting;
- parsed YAML and policy-surface validation;
- pinned Action digests, explicit workflow permissions, and job timeouts;
- documentation links, source-publication boundaries, evidence coverage,
  taxonomies, mathematics, workstation contracts, readiness, site builds, and
  PDF freshness;
- high-severity dependency advisories in CI;
- CodeQL analysis plus a non-blocking supply-chain posture audit; and
- exact-version tagged release packaging with deterministic assets, checksums,
  licence material, and provenance attestation.

The governance documents do not claim that a GitHub repository setting is
active. Settings are recorded as active only after an API check.

Host controls verified through the GitHub API on 2026-08-28 are:

- private vulnerability reporting enabled;
- secret scanning enabled;
- push protection enabled;
- workflow-token permissions read-only by default, without pull-request review
  approval; and
- immutable full-SHA pinning required for every GitHub Action.

## Staged controls and exit conditions

| Control | Why staged | Promotion condition |
| --- | --- | --- |
| Zero-debt P10-4 thresholds | The measured baseline contains 196 findings across 272 audited source files. A CI no-regression gate is active now. | Reduce the tracked file/rule groups to zero; the baseline may shrink but cannot grow or worsen. |
| Property, fuzz, mutation, and hostile-input testing | Valuable only at selected authority boundaries. | Add first to source publication, receipts, manifests, paths, hashes, schemas, and promotion gates; measure useful fault discovery. |
| Required main-branch ruleset | A bad initial check name or rule can block the sole maintainer. | Land the workflow, observe the exact green check contexts, then configure deletion/force-push protection and required CI deliberately. |
| Automated dependency merge | There is no verified required-check ruleset yet. | Enable only after CI and repository rules prevent an update from bypassing validation. |
| REUSE lint | Split licences, `sources/`, restricted taxonomy data, and generated mixed works cannot be represented by a copied catch-all annotation. | Complete a file-level licence inventory with truthful third-party and `LicenseRef` mappings before declaring REUSE conformance. |
| Dedicated Gitleaks CI | Native GitHub secret scanning and push protection are active; an unverified download pipeline would reduce supply-chain quality. | Use a full-SHA action that works for this repository or a checksum-pinned binary and retain only exact-value baseline exceptions. |

## Deliberate non-goals

The contract does not import Kubernetes, OCI, HTTP, database, Go module,
Go race-detector, Go linter, Claude hook, or package-release conventions before
the repository has the corresponding architecture. It also does not create a
second roadmap, ADR tree, prose store, or generated source of truth.

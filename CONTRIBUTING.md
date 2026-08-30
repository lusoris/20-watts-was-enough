# Working method

This repository is a research notebook with stronger provenance than an
ordinary notebook. Preserve uncertainty and history.

Read [`AGENTS.md`](AGENTS.md), the project-wide
[`engineering and research contract`](docs/principles.md), and the nearest
nested `AGENTS.md` before editing an authority or executable boundary.

## Prerequisites and bootstrap

The complete validation gate currently binds these development tools:

- Git;
- Go 1.27.0 from `tooling/go.mod`;
- the official Node.js 26.8.1 distribution or a pinned project container;
- npm 12.0.2 with the committed `package-lock.json`;
- CPython 3.14.7 with NumPy 2.5.2; and
- an OCI runtime with Docker Buildx for container changes and authoritative PDF
  generation.

Install JavaScript dependencies from the lockfile and verify the scientific
runtime before editing:

```bash
npm ci
npm run validate:runtime
python -m pip install --disable-pip-version-check --no-deps --require-hashes -r requirements-ci.txt
go -C tooling version
python --version
python -c "import numpy; print(numpy.__version__)"
```

The Node preflight checks both the exact version and a frozen Fixture 026
numeric sentinel. This catches vendor builds whose floating-point library path
does not reproduce the admitted experiment bytes even when the version label
looks compatible.

Fork the repository for an external contribution, clone the fork, create one
short-lived branch for the smallest coherent change, and open a pull request
against `lusoris/20-watts-was-enough:main`. Keep the branch current with
`main`, use a Conventional Commit title, and complete the pull-request
traceability and validation fields. Do not commit generated dependency
directories, build output, workstation evidence, private source material, or
machine-local files.

If you are deciding where to start, use the
[bounded workstream and issue map](docs/how-to-help.md). It identifies tasks
that need reader, translation, experiment, evidence, Go and security help,
together with their authority boundaries and focused checks.

## Change workflow

1. Start from the smallest affected chapter or claim; never regenerate the
   entire concept.
2. Separate three layers explicitly:
   - **observation:** what a biological or engineered system demonstrably does;
   - **translation:** an engineering mechanism motivated by that observation;
   - **hypothesis:** the expected benefit, with a falsifiable prediction.
3. Add or update a stable entry in [`research/claims.md`](research/claims.md)
   before promoting a new major assertion into the concept.
4. Map the observation to an existing `P-` bundle in
   [`research/principle-registry.md`](research/principle-registry.md); create a
   new principle only when the problem or causal invariant is materially new.
5. Add primary sources to [`research/references.bib`](research/references.bib).
   Imported AI conversations are never evidence.
6. Define every symbol and system boundary used in a calculation.
7. Update [`CHANGELOG.md`](CHANGELOG.md) and, for a durable choice, add a
   decision record under [`decisions/`](decisions/README.md).
8. Run the focused validator while working and `npm run check` before
   committing or opening a pull request.

Use Conventional Commits for commit and pull-request titles:
`type(scope): concise change`. Supported types are `feat`, `fix`, `docs`,
`chore`, `refactor`, `test`, `perf`, `ci`, `build`, and `revert`. Mark an
incompatible public CLI, schema, route, manifest, output, or analysis-law change
with `!` or a `BREAKING CHANGE:` footer and include a `Migration:` footer.

## Discovery workflow

No scientific field is out of scope merely because it appears unrelated to AI.
Use the problem-first search, extraction tuple, and promotion gates in
[`research/discovery-policy.md`](research/discovery-policy.md). A new audit must
name the strongest conventional engineering null model before its translation
can influence an architecture or experiment.

## Normative-source workflow

The default normative context is the European Union and Germany. Before using
language such as *required*, *compliant*, *certified*, or *state of the art*,
follow [`research/normative-baseline.md`](research/normative-baseline.md):

1. identify the system, intended use, deployment, actor role, and jurisdiction;
2. record the official source, exact version and status, relevant dates, source
   role, and concrete applicability hook;
3. distinguish binding law, project obligations, conformity routes, technical
   guidance, comparative foreign material, and drafts;
4. verify EU harmonisation, Official Journal citation, transition, and German
   adoption rather than inferring them from an ISO or IEC title; and
5. recheck official sources before consequential use.

Foreign law, standards, and regulator guidance remain valid comparative or
technical research inputs. They are not German or EU compliance requirements
without an explicit applicability hook.

## Research-integrity workflow

Follow the deduplicated
[`research integrity baseline`](research/research-integrity-baseline.md). For a
claim-eligible output, formal report, dataset, or tagged research snapshot,
record contributor roles and accountable approval, funding and material
support, competing interests, and material use of AI, automation, or external
services. Describe the human verification actually performed; do not replace a
disclosure with a generic statement that tools were used.

Before affected work begins, complete the baseline's trigger screen for people,
personal data, animals, biological or cultural material, physical or
environmental intervention, safety-critical use, surveillance, dual use,
military or violent use, export controls, or other credible harm. Obtain any
required competent approval before collection or execution. Claim-eligible
research objects also need a named custodian, access and reuse basis, metadata,
preservation period, and disposal or withdrawal rule.

Joint work that crosses an ordinary pull-request boundary needs a collaboration
agreement covering roles, applicable rules, custody, licensing, publication,
credit, conflicts, departures, and integrity handling. Formal reviewers follow
the confidentiality, recusal, non-appropriation, reason-giving, and tool-
disclosure rules in the baseline. Maintainer review is not described as
independent review.

## Licensing and provenance

Read [`LICENSING.md`](LICENSING.md) before contributing. Project-authored
technical material is accepted under EUPL v1.2 or later; original project
prose, mathematical exposition, diagrams, plots, and generated presentation
material are accepted under CC BY-SA 4.0. A contribution can contain both
scopes, and each part follows the nature-of-material boundary defined there.

Contribute only material that you have the right to license. Identify copied,
quoted, adapted, generated, or otherwise third-party material in the file and
preserve its author, source, date, licence, notices, and applicable use basis.
Do not place imported material under the project licences by implication.
Academic publication, public web access, citation, and bibliography inclusion
do not by themselves grant reuse rights. When provenance is needed, prefer a
link-only record under [`sources/`](sources/README.md). Retain a third-party
body only when a specific, recorded use basis permits redistribution; it
remains outside the repository-wide grants unless an explicit file notice says
otherwise.

## Live research edition

Run `npm ci` once, then `npm run dev:github-pages`. The public portal watcher
renders the canonical files without maintaining copied prose; a normal save
triggers local reload at the project-relative Pages path.

Run `npm run test:github-pages` before a publication-facing change. The GitHub
Pages workflow publishes the portal, `/book/`, and downloadable PDF from tested
`main`. It is the repository's only hosted reader and uses the same book entry
as PDF generation. Do not edit generated files under `dist-github-pages/` or
the prepared reader-artifact directory.

Each released experiment has its own image, documented in the
[workstation execution contract](experiments/workstation/README.md#run-a-released-experiment-image).
Container commands are the public default. Reports should include the exact
image digest, source revision, command, architecture, and `NO_RESULT` receipt.
Native `20w` files are secondary conveniences; installing one is not required
to run an experiment. Docker with Buildx is needed for container changes and
authoritative PDF generation, not prose-only contribution checks.

## Translations

Coordinate new or corrected translations through the
[translation issue form](https://github.com/lusoris/20-watts-was-enough/issues/new?template=translation-problem.yml).
Translated Markdown mirrors its canonical path under `translations/<language>/`.
Its `translations/manifest.json` entry must record the exact canonical and
translated repository paths, the SHA-256 digest of the English source, the
SHA-256 digest of the reviewed translated file, and at least one named human
reviewer. Run `npm run validate:translations` before submitting the pull
request.

Machine translation may be disclosed as a drafting aid, but its output is not
published directly. Review must cover research terminology, negation,
qualifications, equations, units, links and evidence status—not grammar alone.
When the canonical source digest changes, validation deliberately marks the
translation stale until it is checked again.

For a source-bound German draft, use `20w translation export-candidate` and
`20w translation import-candidate` as documented in the
[candidate exchange](translations/README.md#candidate-exchange). The exchange
records glossary, tool and reviewer metadata, but import produces only a
candidate-marked working artifact. It cannot update the reviewed manifest or
publish a page.

## Evidence statuses

- **established:** directly supported within a clearly stated experimental or
  analytical scope;
- **plausible:** supported indirectly or in narrower systems, but not yet for
  the proposed architecture;
- **speculative:** a testable project hypothesis with no adequate direct
  evidence yet; and
- **disputed:** contradicted, ill-defined, or dependent on incompatible
  measurements.

Status is not a score. An established result in a toy task does not establish
that it transfers to a large multimodal system.

## Quantitative claims

A number must be accompanied by a claim ID, a derivation with assumptions, or
the word **hypothesis**. Comparisons must use the same task, quality target,
system boundary, precision, utilization definition, and time basis.

## Diagrams and generated artifacts

Keep editable Mermaid or plotting sources under `assets/`. A rendered SVG or
PNG may be committed beside its source, but never replace the source with an
opaque image.

## Software and dependency changes

- Follow P10-1–P10-10 in [`docs/principles.md`](docs/principles.md).
- Bound loops, retries, subprocesses, browser work, queues, outputs, and
  timeouts; preserve cancellation and checked exit states.
- A new dependency records the alternatives considered, exact version,
  licence, security posture, runtime/build cost, and why it is needed.
- GitHub Actions use full commit SHAs and the smallest permissions possible.
- Do not suppress lint, type, security, schema, or freshness findings without a
  nearby reason and a removal condition.

## Validation and review

`npm run check` is the aggregate local gate. It includes policy and strict
TypeScript validation, linting, site tests, documentation, source boundaries,
coverage, taxonomies, mathematics, workstation contracts and tests, readiness,
the application build, and publication-artifact validation.

Regenerate and validate the PDF after changing its source set or renderer:

```bash
npm run generate:book-pdf
npm run validate:book-pdf
```

Update [`CHANGELOG.md`](CHANGELOG.md) for notable changes and add an append-only
decision record when authority, architecture, policy, licensing, publication,
or release semantics change. The pull-request template records the exact checks
run; a check not run needs an explanation, not an unchecked silent omission.

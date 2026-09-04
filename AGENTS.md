# Repository agent contract

Read [`docs/principles.md`](docs/principles.md) before changing this repository.
It is the project-wide engineering and research contract. Then read the nearest
nested `AGENTS.md` for the files in scope.

Before drafting or revising project-authored explanatory prose, read and apply
the project-local [`research-writing` skill](.agents/skills/research-writing/SKILL.md).
It does not apply to imported sources or verbatim quotations.

Before changing public layout, typography, colour, interface hierarchy, or
brand expression, read and apply the project-local
[`research-design` skill](.agents/skills/research-design/SKILL.md). Use the
[`reader-editor` skill](.agents/skills/reader-editor/SKILL.md) as well when the
design problem exposes a comprehension failure in project prose.

Before changing the continuous book or generated PDF hierarchy, print
typography, pagination, navigation, figures, tables, equations, or visual QA
contract, also read and apply the project-local
[`publication-design` skill](.agents/skills/publication-design/SKILL.md).

Before adding or changing recurring dependency, CI, release, generation,
GitHub-metadata, security-drift, or translation-freshness automation, read and
apply the project-local
[`maintenance-automation` skill](.agents/skills/maintenance-automation/SKILL.md).
It does not grant authority to automate scientific judgement, claim promotion,
or consequential remote state.

## Hard rules

1. Git `main` is canonical. Do not synchronize or regenerate the concept from a
   chat or a parallel document store.
2. Change the smallest coherent chapter, claim, equation, test, diagram, or
   decision. Preserve unrelated and untracked files.
3. Keep observation, engineering translation, and hypothesis distinct.
4. Add or update a stable `C-` claim before promoting a major assertion. Map it
   to an existing `P-` bundle before inventing a new principle.
5. Primary or authoritative sources may support claims; imported conversations
   and summaries may only identify leads.
6. Never present smoke, readiness, construction, synthetic calibration, or
   protocol conformance as a scientific result.
7. Define every quantitative boundary, unit, symbol, comparator, hardware
   context, and uncertainty source.
8. Bound every experiment loop, retry, queue, subprocess, search grid, output,
   and timeout. Record seeds and run identity at claim-eligible boundaries.
9. Keep generated sources editable and deterministic. Do not edit `dist/`,
   `dist-github-pages/`, or generated reader copies.
10. Follow [`LICENSING.md`](LICENSING.md). Citation is not permission to copy;
    `sources/` and all third-party material keep their own terms.
11. EU and German law, official adoptions, and applicability are the normative
    default. Do not infer compliance from a standard title or a checklist.
12. Use pinned dependencies and full commit SHAs for GitHub Actions. Do not
    claim a GitHub setting is active without verifying it remotely.
13. Project-authored prose must carry information rather than generated-sounding
    filler. Run `npm run check:prose` after changing canonical Markdown. Prose
    embedded in site code remains review-gated; the automated tripwire does not
    attempt brittle JSX or HTML extraction.
14. Apply [`research/research-integrity-baseline.md`](research/research-integrity-baseline.md)
    at every triggered research boundary. Disclose contributors, support,
    competing interests, and material AI or external-tool use; complete any
    required ethics or misuse review before the affected work begins.

## Repository map

| Path | Authority |
| --- | --- |
| `concept/` | Maintained synthesis and architecture chapters |
| `research/claims.md` | Stable evidence ledger and claim status |
| `research/principle-registry.md` | Deduplicated cross-domain causal invariants |
| `research/references.bib` | Bibliographic identities and primary-source locators |
| `research/audits/` | Field- and mechanism-level evidence audits |
| `research/research-integrity-baseline.md` | Deduplicated European research-conduct, disclosure, ethics, correction, and review rules |
| `research/disclosures/` | Per-output contributors, support, competing interests, material tools, approval, and verification records |
| `math/` | Notation, derivations, units, and testable models |
| `experiments/candidates/` | Architecture-candidate comparison contracts |
| `experiments/fixtures/` | Candidate-independent stress and falsification fixtures |
| `experiments/workstation/` | Executable development and claim-eligible run machinery |
| `assets/` | Editable diagrams, plotting data, and rendered figures |
| `decisions/` | Append-only durable decisions; supersede rather than rewrite |
| `sources/` | Provenance records and explicitly licensed imports, not evidence by default |
| `app/`, `github-pages/` | Interactive reader and public Pages portal |
| `.agents/skills/publication-design/` | Continuous-book and PDF review contract |
| `translations/` | Reviewed, source-version-bound derivatives; English Git source remains canonical |
| `scripts/` | Validation, generation, and publication-boundary tooling |

## Working sequence

1. Inspect the affected authority file and its reciprocal links.
2. Make the smallest patch; do not rewrite nearby material for style alone.
3. Run the most focused relevant test.
4. Run `npm run check` before commit. Changes that affect the book source set
   also require `npm run generate:book-pdf` and
   `npm run validate:book-pdf`.
5. Update `CHANGELOG.md` for a notable change. Add a decision record when an
   authority, architecture, policy, licensing, publication, or release rule
   changes durably.
6. Use a Conventional Commit message and push only a clean, validated tree.
7. Keep auxiliary Git worktrees under the ignored
   `.workingdir2/worktrees/` directory instead of creating repository siblings.

## Common commands

```bash
npm ci
npm run check
npm run test:github-pages
npm run generate:book-pdf
npm run validate:book-pdf
```

Use targeted `test:workstation:*` scripts during development. The aggregate
gate remains authoritative before a release or merge.

## File-specific instructions

- [`research/AGENTS.md`](research/AGENTS.md) governs claims, evidence, source
  audits, principle deduplication, and normative material.
- [`experiments/AGENTS.md`](experiments/AGENTS.md) governs candidate and fixture
  contracts.
- [`experiments/workstation/AGENTS.md`](experiments/workstation/AGENTS.md)
  governs executable runs and authority boundaries.
- [`app/AGENTS.md`](app/AGENTS.md) governs the interactive reader.
- [`scripts/AGENTS.md`](scripts/AGENTS.md) governs validators and generators.

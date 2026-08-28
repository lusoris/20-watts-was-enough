# 20 Watts Was Enough

[![CI](https://github.com/lusoris/20-watts-was-enough/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/lusoris/20-watts-was-enough/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/lusoris/20-watts-was-enough/actions/workflows/github-pages.yml/badge.svg?branch=main)](https://github.com/lusoris/20-watts-was-enough/actions/workflows/github-pages.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/lusoris/20-watts-was-enough/badge)](https://scorecard.dev/viewer/?uri=github.com/lusoris/20-watts-was-enough)
[![Latest release](https://img.shields.io/github/v/release/lusoris/20-watts-was-enough?sort=semver)](https://github.com/lusoris/20-watts-was-enough/releases/latest)
[![Code: EUPL 1.2](https://img.shields.io/badge/code-EUPL--1.2-315c9b.svg)](LICENSING.md)
[![Original content: CC BY-SA 4.0](https://img.shields.io/badge/original%20content-CC%20BY--SA%204.0-b85c00.svg)](LICENSING.md)
[![Ko-fi](https://img.shields.io/badge/ko--fi-support-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/lusoris)

![Abstract botanical and computational network](public/og-v2.jpg)

> A biologically inspired R&D blueprint for sparse, grounded, continual,
> energy-efficient AI.

The adult human brain operates within a whole-organ power budget of roughly
17–20 watts ([C-001](research/claims.md#c-001)). That observation does not
provide a fair brain-versus-silicon benchmark by itself; it establishes a
serious engineering question: which computational constraints behind adaptive
biological intelligence can be translated into measurable requirements for
artificial systems? The [energy evaluation chapter](concept/80-energy-model.md)
defines the boundary required for a comparison.

This repository develops that question as a traceable research programme. It
connects primary evidence, cross-domain principles, mathematical models,
architecture proposals, falsifiable experiments, and explicit failure rules.

## Read the project

| Goal | Start here |
| --- | --- |
| Understand the argument | [Working architecture](concept/01-working-architecture.md) |
| Browse the research online | [Research portal](https://www.cordana.dev/) |
| Read continuously | [Full HTML book](https://www.cordana.dev/book/) |
| Read offline or print | [Download the A4 PDF](https://www.cordana.dev/downloads/20-watts-was-enough-full-concept-book.pdf) |
| Inspect evidence | [Claim ledger](research/claims.md) and [bibliography](research/references.bib) |
| Inspect proposed tests | [Experiment coverage](experiments/test-coverage.md) |
| Find a specific area | [Repository map](docs/repository-map.md) |

The portal and web book offer an explicit automatic-translation handoff for all
24 official EU languages. English remains the reviewed canonical text; no
machine translation is written back into the repository.

## Central thesis

Useful adaptive intelligence may require much less active computation and data
movement than current systems routinely spend. The project investigates
whether that gap can be attacked through a system that:

- separates total capacity from active capacity;
- grounds representations in aligned perception, action, and outcome;
- allocates computation according to uncertainty and task demand;
- separates rapid episodic learning from slow structural learning;
- consolidates before pruning or hardening;
- keeps mutable facts in inspectable memory rather than forcing everything into
  weights; and
- measures quality, energy, data movement, lifecycle cost, and uncertainty
  together.

Nature is a source of mechanisms, not a shortcut around engineering controls.
Observations from neuroscience, biology, ecology, physics, chemistry,
mathematics, social systems, and other fields are normalized by their causal
operation, deduplicated into shared principle bundles, and tested against strong
ordinary engineering alternatives.

## Current state

This is an evolving concept and evidence framework, not a finished model. The
repository contains protocol-complete experiment descriptions and bounded
development smoke harnesses, but no integrated AI system and no claim-eligible
workstation result. The generated [coverage report](experiments/test-coverage.md)
and [machine-readable readiness summary](experiments/test-readiness-summary.json)
are the authoritative current status.

The default normative context is the European Union and Germany. Legal,
standards, and conformity statements remain qualified by jurisdiction, role,
version, applicability, and date under the
[normative baseline](research/normative-baseline.md).

Scientific conduct follows the
[research integrity baseline](research/research-integrity-baseline.md), which
deduplicates the recurring ALLEA, EU, DFG, and large European university rules
for disclosure, stewardship, ethics, correction, and review.

## How the repository works

```text
primary sources -> scoped claims -> deduplicated principles
                -> engineering translations -> equations and architecture
                -> equal-budget tests -> bounded evidence -> revised claims
```

- [`research/claims.md`](research/claims.md) gives major assertions stable
  `C-` identities and evidence status.
- [`research/principle-registry.md`](research/principle-registry.md) groups
  equivalent cross-domain mechanisms under stable `P-` identities.
- [`concept/`](concept/README.md) develops the maintained system synthesis.
- [`math/`](math/README.md) defines notation, units, derivations, and testable
  efficiency models.
- [`experiments/`](experiments/README.md) separates written protocols,
  development plumbing, and result authority.
- [`decisions/`](decisions/README.md) records durable choices without rewriting
  their history.
- [`sources/`](sources/README.md) preserves provenance and publication
  boundaries; imported discussions and summaries are leads, not evidence.

## Canonical source and editing

Git `main` is the canonical source. The Pages portal, HTML book, and PDF are
generated views of the same committed material; Google Docs and imported chats
are not synchronized document stores. Work incrementally on one chapter,
claim, equation, diagram, test, or decision rather than regenerating the whole
project.

Read [`AGENTS.md`](AGENTS.md) and the
[engineering and research contract](docs/principles.md) before editing. The
[research-writing skill](.agents/skills/research-writing/SKILL.md) keeps project
prose direct and evidence-aware, with a deliberately narrow automated check for
high-confidence generated filler. The
[repository-rule crosswalk](docs/repository-rule-crosswalk.md) explains which
conventions from the maintainer's other projects were adopted, adapted,
staged, or rejected here.

For a local live preview:

```powershell
npm ci
npm run dev:github-pages
```

The preview runs at `http://localhost:5173/` and reloads canonical Markdown,
equations, tables, diagrams, and plots as their source files change.

Before committing:

```powershell
npm run check
```

Changes to book sources also require:

```powershell
npm run generate:book-pdf
npm run validate:book-pdf
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the complete workflow and
[`SUPPORT.md`](SUPPORT.md) for issue routing. GitHub may report a small amount
of C# because one Windows Job Object helper provides bounded process
containment for workstation experiments; it is infrastructure, not a model
implementation.

## Citation, support, and licence

Use [`CITATION.cff`](CITATION.cff) and identify the exact release or commit when
citing the project. Scientific use should also cite the original sources that
support the specific claim; citing this synthesis does not replace them.

If the project is useful, support is available through
[Ko-fi](https://ko-fi.com/lusoris) or
[GitHub Sponsors](https://github.com/sponsors/lusoris).

Project-authored software, scripts, tests, configurations, schemas, and
workflows are licensed under the EUPL v1.2 or later. Original project prose,
mathematics, diagrams, plots, and presentation are licensed under CC BY-SA 4.0.
Third-party and source material retains its own terms. Read
[`LICENSING.md`](LICENSING.md) for the controlling boundary.

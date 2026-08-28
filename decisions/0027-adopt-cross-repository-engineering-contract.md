# 0027 — Adopt a cross-repository engineering contract

- **Status:** accepted
- **Date:** 2026-08-28

## Context

The repository has mature scientific-evidence, experiment-authority,
provenance, licensing, and publication rules, but those rules were distributed
across contribution prose and domain ledgers. It lacked the operational shape
used repeatedly in the maintainer's other repositories: a root contract,
bounded local contracts, general pull-request validation, ownership, security,
support, governance, and machine-checked workflow policy.

Copying the `golusoris` setup directly would also be wrong. Its Power-of-Ten
rules, CI, security tools, package boundaries, release machinery, and
deployment rules are largely Go- and service-specific. Its single MIT REUSE
annotation would misstate this repository's EUPL/CC BY-SA split and third-party
source boundaries.

## Decision

1. Establish [`docs/principles.md`](../docs/principles.md) as the unified
   engineering and research contract and [`AGENTS.md`](../AGENTS.md) as its
   operational entry point.
2. Add nested instructions only at real authority or executable boundaries:
   research, experiment contracts, workstation execution, reader code,
   validators/generators, and repository automation.
3. Adapt Holzmann's Power of Ten by preserved failure-prevention invariant to
   TypeScript, Node, scientific protocols, generated documents, and bounded
   workstation runs.
4. Treat P10-1, P10-2, P10-7, P10-8, and P10-10 as immediate hard review or CI
   gates. Apply the P10-4 size/complexity target immediately to new or
   materially changed functions, but stage repository-wide numerical linting
   until existing debt is measured.
5. Make strict type checking, policy validation, pinned Actions, workflow
   timeouts, pull-request checks, dependency review, and security analysis part
   of the executable repository contract.
6. Add project-specific ownership, contribution, conduct, governance, support,
   security, and citation surfaces without inventing contacts, compliance
   status, independent reviewers, or enabled repository settings.
7. Keep scientific authority, EU/Germany normative precedence, split
   licensing, append-only decisions, and existing candidate/fixture boundaries
   stronger where this repository already exceeds the generic reference.
8. Record every adopted, adapted, staged, rejected, and inapplicable reference
   convention in [`docs/repository-rule-crosswalk.md`](../docs/repository-rule-crosswalk.md).

## Alternatives considered

- **Copy the reference repository wholesale.** Rejected because it would add
  irrelevant Go, container, service, and US-normative machinery and could make
  false licence or compliance statements.
- **Keep the existing informal distribution of rules.** Rejected because
  contributors, agents, and CI could not determine one executable merge floor.
- **Turn every principle into an immediate lint rule.** Rejected because an
  unmeasured legacy baseline encourages mass suppressions and false confidence.
- **Add only community files.** Rejected because templates without executable
  gates would improve appearance but not repository behavior.

## Consequences

- A contributor can discover the repository-wide and nearest local contract
  before changing an authority surface.
- Policy drift, mutable Action tags, missing workflow bounds, and missing public
  governance surfaces become test failures.
- The normal local and CI entry point becomes `npm run check`.
- Some controls remain visibly staged with a measurable promotion condition;
  their presence in a ledger is not represented as enforcement.
- Repository settings that can block the sole maintainer are configured only
  after their exact remote check contexts have run successfully.

## Supersession

Supersede this record if the contract's authority moves, the scientific and
engineering contracts are split again, the release artifact class changes, or
another language/runtime becomes a first-class implementation boundary.
Ordinary tool-version, threshold, or workflow-job changes do not require a new
decision unless they change authority or risk.

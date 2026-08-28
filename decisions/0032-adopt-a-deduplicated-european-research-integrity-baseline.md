# 0032 — Adopt a deduplicated European research-integrity baseline

- **Status:** accepted
- **Date:** 2026-08-28

## Context

The repository already controls evidence scope, provenance, frozen protocols,
null models, reproducibility, and result authority. It did not fully govern
authorship, funding and conflicts, material AI or external-service use, data
custody and retention, ethics and misuse screening, collaboration agreements,
corrections, formal review, supervision, or integrity reports.

Official policies from large European research institutions repeat most of
these controls. Copying each institution's wording would create conflicting
and inapplicable layers. Their repetition is useful because it exposes a common
operational lineage; institutional reputation does not itself create
authority.

## Decision

1. Use the 2023 ALLEA European Code as the cross-disciplinary baseline, the
   Horizon Europe rules when EU funding activates them, the DFG Code as the
   German implementation baseline, and applicable EU or German law and
   approvals where their concrete triggers apply.
2. Treat university and research-institution codes as implementation examples.
   They bind this project only through an actual affiliation, collaboration,
   contract, funder, location, subject, or other applicability hook.
3. Maintain one deduplicated
   [`research integrity baseline`](../research/research-integrity-baseline.md)
   covering disclosure, authorship, research-object stewardship, pre-start
   ethics and misuse screening, collaboration, correction, review, confidential
   concerns, supervision, assessment, and funds.
4. Add the baseline to the root and research agent contracts, contribution and
   pull-request workflow, governance, support routing, repository map, and
   machine-checked policy surface.
5. Record current limits honestly: one maintainer cannot provide independent
   review or investigation, and the repository does not claim those capacities
   until a qualified conflict-free person and confidential channel exist.

## Alternatives considered

- **Choose one prestigious university's code.** Rejected because institutional
  rules are local implementations and may contain employment, doctoral,
  disciplinary, or national duties that do not apply here.
- **Combine every university rule.** Rejected because duplicate controls would
  obscure authority and make conflicts harder to resolve.
- **Keep only experiment-method rules.** Rejected because sound methods do not
  resolve contributor credit, conflicts, rights, data custody, misuse,
  correction, or reviewer conduct.
- **Claim immediate compliance with all cited codes.** Rejected because several
  sources are conditional funding rules, foreign institutional regulations, or
  procedures requiring capabilities this project does not yet have.

## Consequences

- Future research outputs carry explicit people, support, conflict, tool,
  ethics, and data-stewardship boundaries alongside scientific authority.
- Repeated controls are reviewable in one place and retain their actual source
  role.
- New contributors, funding, participants, non-public objects, physical work,
  or formal review activate defined policy work before they create evidence.
- CI proves that the policy surfaces and prose tripwire exist; it does not prove
  ethical approval, independent review, or compliance for a particular study.

## Supersession

Supersede this record if the research-integrity authority changes, the project
joins an institution or funded programme with stronger rules, or it establishes
independent review and complaint-handling bodies that replace the current
conditional procedures.

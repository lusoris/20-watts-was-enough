# Decision 0008 — Use the European Union and Germany as the normative default

**Status:** accepted
**Date:** 2026-08-06

## Context

The project draws technical ideas from every scientific and engineering field,
including standards, regulation, legal procedure, and safety practice from many
jurisdictions. That breadth is useful for discovery but unsafe for normative
statements: a foreign rule, an international standard, a draft, and an
applicable German requirement do not have the same authority or effect.

The repository therefore needs one default context for words such as *must*,
*compliant*, *required*, *certified*, and *state of the art*. A default does not
decide applicability. Product category, intended use, deployment location,
operator, affected people, contractual obligations, and effective date still
determine which requirements attach.

## Decision

Use the **European Union and Germany** as the default normative context. Apply
the source roles, hierarchy, minimum metadata, and recheck rules in
[`research/normative-baseline.md`](../research/normative-baseline.md).

In particular:

1. A compliance statement must identify the system and use, jurisdiction,
   authority, exact instrument or standard version, effective or transition
   date, and applicability hook.
2. Applicable EU and German law is evaluated before guidance or standards.
   Directives are evaluated together with their relevant German transposition
   or implementation; an EU-level summary alone is insufficient.
3. Where an EU legal act provides a harmonised-standards route, a conformity
   claim must verify the relevant Official Journal citation, scope, version,
   transition conditions, and covered legal requirements. A standard is not
   treated as law, and conformity with a standard is not treated as proof of
   safety, performance, or legal compliance beyond its actual scope.
4. German or European adoption status is recorded explicitly. An ISO or IEC
   publication is not silently relabeled as EN, DIN EN, DIN EN ISO, or DIN EN
   IEC.
5. Foreign law, foreign national standards, and foreign regulator guidance are
   comparative or technical sources by default. They become project
   obligations only when an explicit market, deployment, contract,
   certification, procurement, supply-chain, or other applicability hook is
   recorded.
6. Draft, withdrawn, superseded, and historical material retains that status.
   It may inform research but cannot support an unqualified current-compliance
   statement.
7. Consequential claims are rechecked against official sources at the time of
   deployment, procurement, certification, publication, or another decision.
   Repository text is neither legal advice nor certification.

## Consequences

- Normative claims become jurisdiction-, version-, role-, and date-qualified.
- Scientific evidence, technical guidance, conformity routes, and binding
  requirements remain distinct even when one source discusses several roles.
- Existing US and other foreign-jurisdiction audits remain preserved as
  comparative evidence; this decision neither rewrites nor invalidates them.
- The default may be superseded for a particular experiment or deployment by
  an explicitly documented applicability record, not by an implicit change in
  vocabulary.
- Conflicts, unclear applicability, and high-consequence interpretations are
  recorded as unresolved and sent for competent legal or conformity review.

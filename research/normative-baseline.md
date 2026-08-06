# Normative baseline: European Union and Germany

This file controls how the repository makes claims about law, regulation,
standards, conformity, and accepted technical practice. It is a research
provenance rule, not legal advice, a conformity assessment, or a claim that any
listed instrument applies to every future system.

The default context is the **European Union and Germany**. Another jurisdiction
may be added for a concrete use or deployment, but it must be named rather than
silently substituted.

## Determine applicability before authority

Before writing *must*, *required*, *compliant*, *certified*, or an equivalent,
record:

1. the product, model, component, service, or process being evaluated;
2. its intended use, reasonably foreseeable use, and deployment setting;
3. the provider, deployer, importer, distributor, operator, or other relevant
   role;
4. the jurisdiction and the people, market, infrastructure, or environment
   affected;
5. the authority, instrument, exact version, status, and relevant date; and
6. the fact that activates it: for example product classification, processing
   of personal data, market access, a permit, a contract, or a certification
   route.

If that record is incomplete, use *candidate requirement*, *comparative
practice*, or *applicability unresolved* instead of a compliance conclusion.

## Source roles and order of review

Legal force comes first; geography alone does not create a hierarchy. Review
sources in the following operational order and record their role explicitly:

| Order | Source role | Repository treatment |
| --- | --- | --- |
| 1 | Applicable binding requirements | Use the official EU or German legal text, including relevant amendment, effective, transition, territorial, and sector provisions. Include German federal, Land, or local rules when the use activates them. |
| 2 | Binding project-specific obligations | Record permits, regulatory orders, contracts, procurement terms, insurance conditions, and certification-scheme obligations separately from generally applicable law. |
| 3 | Applicable European conformity route | Verify whether a harmonised standard is cited for the relevant EU legal act in the Official Journal, which version and transition apply, and which legal requirements its presumption of conformity actually covers. Record the German adoption used in the project. |
| 4 | Non-harmonised European or German technical practice | Treat EN, DIN, VDE, VDI, BSI, and comparable material according to its actual status. It may support engineering judgment but does not gain legal force merely by being called a standard or guideline. |
| 5 | International technical source | Use ISO, IEC, ITU, and similar sources as technical methods where relevant; record any EN or DIN adoption relationship instead of assuming equivalence. |
| 6 | Foreign normative or technical source | Preserve US and other foreign rules, standards, and regulator guidance as comparative material unless an explicit deployment, market, contract, certification, procurement, or supply-chain hook makes them applicable. |
| 7 | Draft, withdrawn, superseded, or historical source | Use only with its status and research purpose stated. Do not use it for an unqualified current-compliance claim. |

This ordering does not resolve conflicts between instruments or decide whether
a standard represents the legally relevant state of the art. Record the
conflict and obtain competent review when the consequence matters.

## Minimum normative-source record

Every retained normative source must expose enough metadata for another
researcher to reproduce its role:

| Field | Required content |
| --- | --- |
| `role` | binding requirement, project obligation, conformity route, technical practice, comparative source, or draft/historical source |
| `jurisdiction` | EU, Germany, named German Land/local authority, or named foreign jurisdiction |
| `authority` | issuing legislature, regulator, court, standards body, or other organization |
| `identifier` | exact instrument or standard number and title |
| `version_status` | publication/version, amendment state, adopted/draft/withdrawn/superseded status |
| `dates` | publication and, where relevant, effective, transition, withdrawal, or supersession dates |
| `official_url` | stable official text, catalogue entry, or Official Journal record |
| `checked_on` | date on which the official source and status were verified |
| `scope` | system, intended use, deployment, actor role, and affected context |
| `applicability_hook` | the concrete fact that may make the source applicable; `unresolved` is allowed |
| `adoption_relation` | relevant EU harmonisation and EN/DIN/ISO/IEC relationship, or `not applicable` |
| `supersession` | replacement, transition, or `none found as of checked_on` |

Legal and standards sources do not establish an empirical mechanism merely by
being authoritative. A technical or scientific assertion still needs evidence
under [`claims.md`](claims.md) and [`discovery-policy.md`](discovery-policy.md).

## Official starting anchors

These are official entry points for the current default, not an exhaustive
applicability matrix:

- [Regulation (EU) 2024/1689 (Artificial Intelligence Act), EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [Regulation (EU) 2016/679 (General Data Protection Regulation), EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [Bundesdatenschutzgesetz (BDSG), Gesetze im Internet](https://www.gesetze-im-internet.de/bdsg_2018/)
- [European Commission: harmonised standards](https://single-market-economy.ec.europa.eu/single-market/goods/european-standards/harmonised-standards_en)

The AI Act, GDPR, and BDSG are checked only when their material and territorial
scope is relevant. The Commission page explains the harmonised-standards
mechanism; a concrete conformity claim additionally requires the applicable
legal act and Official Journal citation for the exact standard.

## Recheck and writing rules

- Recheck official sources before a consequential deployment, procurement,
  certification, conformity assessment, contract, or public claim.
- State the snapshot date. Never describe a changing rule simply as “current.”
- Quote sparingly and link to the official source; do not copy paywalled
  standards into the repository.
- Keep authority, applicability, conformity, empirical performance, and safety
  as separate findings.
- Preserve negative and unresolved applicability findings so later work does
  not repeat the same search.
- Escalate conflicts or high-consequence interpretations to qualified legal or
  conformity-assessment expertise.

## Existing comparative audits

The dated [legal-evidence audit](audits/2026-08-05-legal-evidence-procedure.md)
is explicitly scoped to United States federal law. It remains a comparative
source for procedural mechanisms; it is not evidence of EU or German
compliance. The same rule applies to foreign standards and regulator material
throughout the engineering audits unless an audit records a different
applicability hook.

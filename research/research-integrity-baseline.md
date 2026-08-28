# Research integrity baseline

This baseline turns recurring European research-integrity rules into one
project contract. It is deliberately not a collage of university regulations.
The same control often appears at European, national, funder, and university
level; it is recorded once here at the strongest applicable authority.

The project is currently independent, has one maintainer, does not employ or
supervise researchers, and is not funded through Horizon Europe or the DFG.
Rules tied to a funder, employer, ethics committee, or jurisdiction therefore
become binding only when their stated trigger is met. The integrity practices
below are adopted as project policy now.

## Authority order

The official sources and implementation links below were checked on
2026-08-28. Recheck them when a trigger makes the exact current version
consequential.

| Role | Source | How this project uses it |
| --- | --- | --- |
| European research-integrity baseline | [ALLEA, *The European Code of Conduct for Research Integrity*, 2023](https://allea.org/code-of-conduct/) | Primary cross-disciplinary integrity framework. The European Commission recognises it as the primary standard for EU-funded research. |
| EU-funded research obligation | [Horizon Europe Programme Guide](https://ec.europa.eu/info/funding-tenders/opportunities/docs/2021-2027/horizon/guidance/programme-guide_horizon_en.pdf), [Regulation (EU) 2021/695](https://eur-lex.europa.eu/eli/reg/2021/695/oj), and the Commission's [research ethics and integrity guidance](https://research-and-innovation.ec.europa.eu/strategy/support-policy-making/scientific-support-eu-policies/research-ethics-and-integrity_en) | Applicability and contractual requirements are checked before EU-funded work begins. Their existence alone does not bind an unfunded repository. |
| German good-research-practice baseline | [DFG, *Guidelines for Safeguarding Good Research Practice*](https://www.dfg.de/en/basics-topics/basics-and-principles-of-funding/good-research-practice/code-of-conduct) | Default German implementation reference. DFG-funded institutions must implement the Code; that funding condition is not misrepresented as general legislation. |
| Applicable law and approvals | EU, German, Land, and sector-specific official sources under the [normative baseline](normative-baseline.md) | Binding when the concrete system, activity, people, data, material, role, or deployment activates it. Required approval precedes the affected work. |
| Institutional implementation examples | Official policies listed below | Used to compare procedures and find omissions. They do not become universal rules because an institution is large, old, or well funded. |

French, Swiss, and British institutional rules are comparative sources unless
a collaboration, place of work, funder, contract, or research subject brings
them into scope. The same applies to every foreign university code.

## Required project controls

### 1. Research-output disclosure

A claim-eligible run, dataset, formal research report, or tagged research
snapshot must identify:

- each contributor and their concrete role;
- the person accountable for approving the output;
- funding, donated compute, data access, equipment, institutional support, and
  other material assistance;
- financial and non-financial competing interests, including a statement that
  none are known when that is the case;
- external services, AI systems, and automated tools that materially affected
  research design, source selection, data, code, analysis, interpretation, or
  prose, with purpose and version or dated service identity where available;
  and
- which human checked the affected output and what remained outside that
  check.

Authorship requires a substantial intellectual or experimental contribution,
participation in drafting or critical review, approval of the released output,
and acceptance of responsibility for the contributor's part. Tool use,
funding, access, routine execution, or status alone does not create authorship.
Non-author contributions remain credited.

### 2. Data, code, and material plan

Before a research object becomes claim-eligible, its authority record must
state:

- owner or custodian and the object's stable identity;
- origin, lawful basis, consent or permission where relevant, and allowed
  purposes;
- access class, storage location, encryption or other protection, and the
  people or roles permitted to use it;
- metadata, formats, software, protocols, and dependencies needed to interpret
  or reproduce it;
- publication and reuse basis: as open as possible, as closed as necessary;
- preservation period and why that period is reasonable;
- deletion, disposal, withdrawal, and derivative-handling rules; and
- the action taken if a participant withdraws, a licence changes, or the object
  is found to be invalid or unlawfully held.

There is no automatic ten-year rule. Some German institutions use ten years,
but this project records a period justified by the object, law, consent,
licence, reproducibility need, cost, and risk.

### 3. Ethics, rights, safety, and misuse screen

Screen the work before collection, intervention, release, or execution when it
involves any of the following:

- people, personal data, vulnerable groups, or decisions affecting rights or
  access to services;
- animals, biological material, cultural material, indigenous knowledge, or
  communities whose interests are not represented by a public licence;
- environmental release, physical intervention, hazardous material, medical
  or safety-critical use;
- surveillance, deception, manipulation, military or violent application,
  dual use, export controls, or a credible route to material misuse; or
- a collaborator, funder, institution, or jurisdiction with an approval or
  reporting requirement.

The screen records the trigger, affected parties and environment, foreseeable
benefit and harm, alternatives, safeguards, legal basis, required independent
review, approval identity, and stop conditions. Required consent, permit, data
protection assessment, ethics review, biosafety approval, or comparable
authorization must exist before the affected work starts. Repository review is
not a substitute for a competent external body.

### 4. Collaboration agreement

Before joint research crosses a repository contribution boundary, the parties
agree in writing on:

- aims, roles, decision rights, supervision, and accountable contacts;
- applicable integrity rules, law, ethics approvals, and safety duties;
- data and material custody, access, transfer, retention, and exit handling;
- intellectual property, licensing, confidentiality, publication, and
  contributor credit;
- funding, conflicts, external tools, and communication with the public; and
- correction, withdrawal, disagreement, and integrity-report handling.

A pull request is an implementation record, not a substitute for that
agreement when people, confidential material, funding, or institutional duties
are involved.

### 5. Corrections and withdrawals

Correct the smallest affected authority surface promptly. A correction must:

1. preserve the original Git or release record;
2. identify the error, discovery date, scope, and responsible correction;
3. link every affected claim, source, dataset, protocol, run, plot, chapter,
   release, and public communication that can reasonably be found;
4. state whether conclusions, status, or downstream work change;
5. mark invalid artifacts as withdrawn or superseded without silently deleting
   their history; and
6. notify known downstream users when the error could change safety, rights,
   scientific conclusions, or substantial resource decisions.

Evidence corrections use the route in [`SUPPORT.md`](../SUPPORT.md). Security,
personal data, or confidential allegations must not be posted publicly.

### 6. Review conduct

A formal reviewer must:

- disclose relevant expertise limits and competing interests, and recuse when
  impartial review is not credible;
- keep non-public material confidential and not reuse ideas, data, or code
  learned through review;
- judge the registered claim, method, evidence, and authority boundary rather
  than reputation, affiliation, or a preferred conclusion;
- give reasons that are specific enough to answer or audit;
- disclose material AI or external-service use in the review; and
- identify whether the review covered science, code, statistics, ethics,
  security, law, or only presentation.

The sole maintainer may perform repository review but cannot describe it as
independent review. A claim that requires independence stays unpromoted until a
qualified, conflict-free reviewer has completed the defined review.

### 7. Integrity concerns and fair handling

Impersonal errors in evidence or method use the public correction routes.
Allegations about a person, confidential records, personal data, or information
that could enable retaliation must not be filed in a public issue. If no
suitable confidential channel is available, notify [`@lusoris`](https://github.com/lusoris)
only that a channel is required and disclose no details publicly.

Any later investigation must give the reporter and respondent appropriate
confidentiality, protect good-faith reporting from retaliation, disclose
investigator conflicts, give the respondent notice and a meaningful chance to
answer, preserve evidence, distinguish fact finding from sanction, use a
proportionate outcome, and provide a route to correct or appeal the record. If
the maintainer is implicated, a conflict-free external person must handle the
matter. Until such a person and channel exist, the project must not claim that
it can adjudicate the allegation independently.

### 8. Training, supervision, assessment, and funds

The project currently has no supervision or personnel-assessment programme.
Before it accepts supervised researchers or regular contributors, it must
define role-appropriate induction, recurring integrity training, competent
supervision, escalation routes, and records of completion. Before allocating
grants, prizes, employment, or contributor rankings, it must define assessment
criteria that do not reduce quality to publication counts or repository
activity.

Any accepted research funding receives an owner, permitted-use boundary,
budget, decision trail, and final account. Compute and equipment donated in
kind are disclosed and costed where they affect a comparison.

## Institutional implementation examples

These official sources were checked for implementation detail, not copied as
separate layers of authority:

- Germany: [RWTH Aachen](https://www.rwth-aachen.de/cms/root/Die-RWTH/Aktuell/~xhf/Amtliche-Bekanntmachungen/lidx/1/?page=&search=research+practice&showall=1), the [Berlin University Alliance](https://www.berlin-university-alliance.de/en/commitments/research-quality/quality/index.html), [TU Berlin](https://www.tu.berlin/en/about/organization/legal-matters/guidelines-directives/principles-for-ensuring-good-research-practice), [Humboldt-Universität](https://www.hu-berlin.de/de/forschung/gute-wissenschaftliche-praxis/gwp-satzung-volltext), [Freie Universität Berlin](https://www.fu-berlin.de/en/sites/gwp/informationen/satzung/index.html), [TUM](https://www.gs.tum.de/en/gs/during-the-doctorate/good-scientific-practice/), [TUM research-data guidance](https://web.tum.de/en/researchdata/tum-guidelines/), and [LMU](https://cms-cdn.lmu.de/media/lmu/downloads/regulation-safeguarding-good-scientific-practice-2.pdf).
- United Kingdom and Switzerland: [Oxford](https://www.ox.ac.uk/research/support/governance-and-committees/research-policies/research-integrity-policy), [Cambridge](https://www.cam.ac.uk/research/integrity/resources/good-research-practice), [ETH Zürich](https://ethz.ch/content/dam/ethz/main/eth-zurich/organisation/rechtssammlung/414en.pdf), and [EPFL](https://www.epfl.ch/about/overview/regulations-and-guidelines/compliance/compliance-guide/research-ethics/).
- France: [CNRS/COMETS](https://comite-ethique.cnrs.fr/charte/), the [CNRS practical guide](https://comite-ethique.cnrs.fr/en/practical-guide/), [Université Paris-Saclay](https://www.universite-paris-saclay.fr/en/about/universite-paris-saclay-scientific-framework/ethics-and-scientific-integrity), and [Sorbonne Université](https://www.sorbonne-universite.fr/en/about-sorbonne-university/confident-responsible-and-open-science/scientific-integrity-delegation).

Their recurring controls converge because European, national, funder, and
institutional rules share a research-integrity lineage. Repetition helps test
whether this baseline missed an operational step; it does not turn prestige
into evidence.

## Review triggers

Recheck this baseline when the project gains a second maintainer, accepts
regular contributors, supervises a researcher, receives funding or material
support, handles non-public research objects, recruits participants, performs
physical or environmental intervention, enters an institutional collaboration,
or seeks formal independent review. Record a durable authority change in
[`decisions/`](../decisions/README.md).

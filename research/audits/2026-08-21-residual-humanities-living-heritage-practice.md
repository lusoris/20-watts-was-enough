# Residual humanities: living heritage, rehearsal, conservation, and archival absence

- **Audit date:** 2026-08-21
- **Breadth target:** OECD FORD 6.5 `Other humanities`, with deliberate probes into
  heritage studies, conservation theory, performance and rehearsal studies,
  archival criticism, and community-authorized cultural transmission
- **Evidence boundary:** field evidence and synthetic test contracts; no empirical
  result for the proposed AI system
- **Repository decision:** no new principle and no new architecture candidate

## Executive finding

The residual humanities are not a bag of aesthetic metaphors. They contribute a
set of unusually sharp distinctions about **what persists, who may decide that it
persists, and what a preserved object can still support**:

1. a surviving record is the output of capture, appraisal, description, access,
   and preservation processes; absence from the record is not automatically
   evidence that an event, practice, or group was absent;
2. cultural authenticity is evaluated through several context-dependent sources
   and attributed values, not one universal scalar;
3. a living practice can remain recognizable through authorized variation, while
   freezing one canonical sequence can preserve tokens and damage function;
4. rehearsal can create group-specific anticipatory routines through repeated,
   publicly inspectable enactment; later compressed cues depend on that shared
   interaction history;
5. conservation interventions are not simply reversible or irreversible;
   removal cost, collateral damage, documentation, future compatibility, and
   re-treatability are separate properties; and
6. digitization and provenance improve access and reconstructability but do not
   turn a representation into the represented object, practice, intention, or
   uncontested interpretation.

These findings sharpen [P-009 maintenance plane](../principle-registry.md#p-009--maintenance-plane),
[P-013 externalized shared state](../principle-registry.md#p-013--externalized-shared-state),
and Candidates [009](../../experiments/candidates/009-graded-assurance-envelopes.md),
[014](../../experiments/candidates/014-versioned-observation-contract.md),
[015](../../experiments/candidates/015-versioned-repairable-conventions.md),
[017](../../experiments/candidates/017-contract-preserving-semantic-compaction.md),
[019](../../experiments/candidates/019-audited-cumulative-inheritance.md), and
[020](../../experiments/candidates/020-constitutional-control-plane.md). The
transfer residue is a set of harder tests and typed records, not a new
“humanities intelligence” subsystem.

## What this audit does and does not cover

This is a field-centered search of an OECD catch-all. It is enough to replace
`unreviewed` with a narrow entry audit, but it cannot close an open residual
category. It directly samples:

- archival selection and archival silence;
- living and intangible cultural heritage;
- contextual authenticity judgements;
- conservation treatment and re-treatability;
- rehearsal as collective routine construction; and
- digital cultural-heritage representation and preservation.

It does **not** claim coverage of all museum studies, oral history, public
history, folklore, cultural studies, film, theatre, dance, architecture,
translation, curating, conservation science, or any cultural tradition. It does
not convert community knowledge into a motif library. Collective authority,
refusal, purpose, benefit, and remedy remain governed by the
[Indigenous data and knowledge governance audit](2026-08-21-indigenous-data-knowledge-governance.md)
and Candidate 020.

## Source-domain propositions

| ID | Status | Proposition | Evidence boundary |
| --- | --- | --- | --- |
| `RH-01` | established scholarly boundary | Archives and record systems are shaped by creation, appraisal, selection, description, preservation, access, and use. | This does not imply that every absence is caused by oppression or that no negative evidence is possible. |
| `RH-02` | established inference boundary | A missing record supports a claim about the historical world only through a model of the process that could have produced, selected, preserved, and exposed that record. | Selection probabilities are often only partially identified; the correct output may be an equivalence set or abstention. |
| `RH-03` | established heritage doctrine | Authenticity judgements may draw on form, material, use, function, traditions, techniques, setting, spirit, and other sources, whose relevance is culturally contextual. | The Nara document is an influential conservation doctrine, not a universal measurement law or a machine-score specification. |
| `RH-04` | established treaty definition | The 2003 UNESCO Convention treats intangible heritage as community-recognized practice transmitted and continually recreated in response to environment, history, and identity. | A state inventory or digitized recording is not the practice itself and cannot replace community participation. |
| `RH-05` | plausible, scoped empirical finding | Repeated joint rehearsal can establish shared anticipatory routines and shorten instructions within the studied group and task. | The evidence is setting-, ensemble-, task-, and timescale-qualified; it does not establish a universal learning law. |
| `RH-06` | established conservation boundary | Reversibility is graded and process-specific; future removability, risk, cost, compatibility, documentation, and re-treatability must be evaluated separately. | Version control is only a software null. It does not reverse physical, social, privacy, or institutional effects. |
| `RH-07` | established representation boundary | Preservation metadata and cultural-heritage ontologies can record objects, events, agents, rights, environments, and relations needed for future interpretation. | Complete lineage and fixity establish neither truth, authenticity, ownership, nor authorized reuse. |
| `RH-08` | established policy boundary | EU cultural-heritage digitization policy explicitly includes long-term formats, storage, migration, maintenance, staffing, rights, interoperability, and target users. | Commission Recommendation (EU) 2021/1970 is a recommendation, not a directly binding general duty on every private project. |

## Evidence synthesis

### The archive is an observation and selection process

Schwartz and Cook document how record creation, appraisal, preservation,
description, and use shape what enters and remains visible in archives
([DOI 10.1007/BF02435628](https://doi.org/10.1007/BF02435628)). The durable
engineering translation is not “archives are biased,” which is too vague. It is
an explicit observation model.

Let latent event or practice state be $X_i \in \{0,1\}$ and let

$$
R_i = C_i A_i P_i D_i U_i X_i,
$$

where $C_i$ is creation/capture, $A_i$ appraisal or acquisition, $P_i$
preservation survival, $D_i$ discoverability, and $U_i$ access to the querying
agent. Every factor is binary here only for the synthetic fixture; a real record
uses probabilities, dates, authorities, embargoes, media condition, and
uncertainty. Observing $R_i=0$ does not distinguish $X_i=0$ from failure at any
later factor. Negative evidence becomes defensible only where the relevant
capture-and-survival process has support and an auditable error model.

This is already owned by Candidate 014's operator-qualified evidence contract.
The humanities contribution is the hostile case in which selection is a social
and institutional process rather than sensor noise.

### Authenticity is a typed judgement, not a score waiting to be learned

The [Nara Document on Authenticity](https://landscapes.icomos.org/wp-content/uploads/1994-NARA-document-on-authenticity-International-Council-on-Monuments-and-Sites-1.pdf)
states that value and authenticity judgements can differ within and between
cultures and names multiple possible information sources, including form,
materials, use, traditions, techniques, setting, and spirit. A system record may
therefore contain

$$
J = (o, c, t, e, \mathbf{a}, \mathbf{w}, S, q, v),
$$

where $o$ is the object or practice identifier, $c$ cultural and institutional
context, $t$ assessment time, $e$ evaluator or authorized body, $\mathbf{a}$ a
vector of source-qualified attributes, $\mathbf{w}$ the disclosed purpose- and
context-specific weighting if aggregation is actually performed, $S$ cited
sources, $q$ uncertainty and disagreement, and $v$ the rule-set version.

The vector is not a universal ontology of culture. Its purpose is narrower: make
aggregation choices inspectable and preserve disagreement rather than laundering
one score into objective authenticity. Candidate 009 can grade evidence for
individual attributes; Candidate 020 governs who has standing to define or
challenge them.

### Living heritage can require controlled variation

Article 2 of the [2003 UNESCO Convention](https://ich.unesco.org/en/convention)
defines intangible cultural heritage through community recognition,
intergenerational transmission, and continual recreation. Germany joined the
Convention in 2013, as recorded by the
[German UNESCO Commission](https://www.unesco.de/orte/immaterielles-kulturerbe/immaterielles-kulturerbe-weltweit/unesco-uebereinkommen-zur-erhaltung-des-immateriellen-kulturerbes/).

For a versioned practice realization $p_t$, evaluate a vector

$$
\mathbf{y}_t = (f_t, r_t, h_t, a_t, d_t),
$$

where $f_t$ is task or social function under a declared test, $r_t$ recognition
by the authorized community sample, $h_t$ harm or exclusion incidents, $a_t$
accessibility under the declared purpose, and $d_t$ derivation reconstructability.
Units must be stated per fixture: success proportion, recognition proportion,
incident count, eligible-participant proportion, and dependency-recovery
proportion. No component substitutes for another.

The AI translation is a protocol whose invariant core, permitted variation,
authority, environmental support, and retirement process are separately
versioned. A frozen sequence, unconstrained mutation, and community-authorized
variation are competing arms; none wins by definition.

### Rehearsal produces shared local history, not free global compression

Schmidt and Deppermann studied 30 hours of professional German-language theatre
rehearsals and traced how repeated enactments of the same instructional task
produced shorter instructions and anticipatory responses
([DOI 10.1007/s10746-022-09655-1](https://doi.org/10.1007/s10746-022-09655-1)).
The critical boundary is membership and history: a short cue may work for agents
who jointly established it and fail for a newcomer or after task drift.

Represent ensemble state as

$$
H_{g,t+1} = F(H_{g,t}, i_t, a_t, o_t, n_t),
$$

where $H_{g,t}$ is group-specific interaction history, $i_t$ an instruction,
$a_t$ enacted action, $o_t$ observed outcome and response, and $n_t$ the
negotiated or recorded update. A cue length reduction is an efficiency gain only
if transfer failures, rehearsal cost, turnover repair, and the external record
needed for reconstruction are charged.

This sharpens Candidate 015's convention lifecycle and Candidate 019's turnover
tests. It does not justify hidden agent shorthand, because uninspectable codes can
also conceal coordination failure or exclusion.

### Reversibility and re-treatability are separate lifecycle claims

Appelbaum's conservation analysis distinguishes removal, risk, difficulty,
future compatibility, and re-treatability rather than treating reversibility as
a material label ([JAIC 26(2), 65–73](https://cool.culturalheritage.org/jaic/articles/jaic26-02-001.html)).
For intervention $k$, retain

$$
T_k = (\Delta s_k, p_{r,k}, c_{r,k}, h_{r,k}, c_{f,k}, q_k, v_k),
$$

where $\Delta s_k$ is the state change, $p_{r,k}$ removal-success probability,
$c_{r,k}$ removal time or money, $h_{r,k}$ expected collateral harm,
$c_{f,k}$ compatibility cost for future treatment, $q_k$ evidence uncertainty,
and $v_k$ the treatment and documentation version. Probabilities are unitless;
cost and harm units must be explicit and cannot be summed without declared
weights.

Candidate 010's reset boundary is therefore only a null for one digital class.
Where reset cannot undo downstream disclosure, model updates, social reliance,
physical actuation, or lost opportunity, the experiment must measure containment
and repair rather than call the action reversible.

### Digitization preserves representations under lifecycle obligations

[ISO 21127:2023](https://www.iso.org/standard/85100.html) defines a reference
ontology for exchange and integration of heterogeneous cultural-heritage
documentation. [PREMIS 3.0](https://www.loc.gov/standards/premis/) records
preservation-relevant objects, events, rights, agents, and environments.
[ISO 15489-1:2016](https://www.iso.org/standard/62542.html) covers records,
metadata, responsibilities, controls, and capture over time.

[Commission Recommendation (EU) 2021/1970](https://eur-lex.europa.eu/eli/reco/2021/1970/oj/eng)
goes beyond scan counts: it calls for purpose, target users, affordable quality,
formats, storage, migration, continuing maintenance, and long-term financial and
staffing resources. The transferable result is a lifecycle cost and
reconstructability contract. It is not permission to scrape, expose, or train on
everything that can be digitized.

## Typed preservation and practice record

For every imported cultural or practice-derived object, retain:

```text
record_id
record_type: object | event | practice | interpretation | treatment | representation
source_and_capture_operator
selection_appraisal_and_survival_history
creator_custodian_rightsholder_and_collective_authority
purpose_audience_access_and_refusal_terms
material_or_media_state_with_units
practice_core_permitted_variation_and_environment
attributed_values_authenticity_sources_and_disagreement
intervention_removal_retreatability_and_future_compatibility
representation_format_software_environment_and_significant_properties
provenance_fixity_version_and_dependency_graph
uncertainty_evidence_status_and_known_silences
challenge_remedy_retirement_and_invalidation_edges
```

This record is deliberately not a truth certificate. It preserves enough state
to ask which inference, access, reuse, or restoration claim is supported.

## CPU-only workstation falsification package

All fixtures are synthetic and seedable. Each arm receives the same latent
world, observations, number of candidate/evaluator calls, wall-time ceiling,
single-thread CPU ceiling, memory ceiling, human-review budget, and recorded
energy-provider status. A software estimate is reported in joules only if a
calibrated external provider is present; otherwise report CPU time and mark
energy unavailable.

### WS-RH-01 — selected archive and false absence

- **Generator:** create events by group, time, and type; vary capture, appraisal,
  preservation, discovery, and access probabilities with planted dependence.
- **Arms:** naive observed-frequency model; missing-at-random model; explicit
  staged-selection model; partial-identification bounds; oracle selection ceiling.
- **Split:** hold out one group, one time regime, and one selection mechanism.
- **Metrics:** false-negative event claims, interval coverage, abstention rate,
  calibration error, group-conditional error, bytes, CPU-seconds, and reviewer
  minutes.
- **Hostile cases:** structural zero versus total noncapture, censored access,
  adversarial description, duplicated records, and a changed appraisal policy.
- **Pass:** the explicit model or honest bounds reduce unsupported absence claims
  without hiding them through universal abstention, under the preregistered cost.
- **Kill:** retire the archival residue if ordinary support detection and missing-
  data baselines match every identified benefit.

### WS-RH-02 — scalar authenticity collapse

- **Generator:** create objects with six attribute sources, contextual evaluator
  profiles, documented disagreement, and purpose shifts; preserve a synthetic
  attribute-level oracle but no universal ranking.
- **Arms:** one learned scalar; unweighted vector; context-qualified vector;
  evaluator-specific model; no-aggregation decision table.
- **Split:** hold out contexts, evaluator coalitions, purposes, and one attribute.
- **Metrics:** attribute recovery, calibration, disagreement preservation,
  ranking reversals after purpose change, unsupported certainty, and decision
  regret under each declared purpose.
- **Hostile cases:** majority dominance, minority veto where authority is scoped,
  correlated evaluators, missing source dimensions, and strategic relabeling.
- **Pass:** the typed representation detects non-comparable cases and preserves
  the planted disagreement while retaining decision utility where aggregation is
  authorized.
- **Kill:** reject any claim that the system has learned authenticity if results
  depend on undisclosed weights or a synthetic oracle absent in deployment.

### WS-RH-03 — frozen canon versus authorized living variation

- **Generator:** create protocol families with an invariant functional core,
  optional forms, environmental shifts, membership turnover, and explicit
  authority rules.
- **Arms:** exact sequence lock; unconstrained mutation; ordinary versioned
  protocol; community-authorized variation with challenge and rollback; oracle.
- **Split:** hold out environments, generations, optional forms, and authority
  turnover.
- **Metrics:** functional success, authorized recognition, exclusion/harm events,
  recovery after drift, derivation reconstruction, rejected-change load, and
  lifecycle cost.
- **Hostile cases:** capture of the approval body, inaccessible canonical form,
  functional shortcut that breaks recognition, and recognized form that no
  longer provides its declared service.
- **Pass:** authorized variation must beat both rigid and unconstrained arms on a
  preregistered protected outcome vector, not just mean task reward.
- **Kill:** if version control plus ordinary governance matches it, retain only
  the source boundary and do not promote an architecture claim.

### WS-RH-04 — rehearsal compression and turnover

- **Generator:** teams repeatedly solve embodied-sequence analogues with shared
  observations, corrections, short cues, and logged interaction histories.
- **Arms:** full instruction every time; compressed cue only; cue plus external
  history; periodic explicit rehearsal; individual learner; centralized planner.
- **Split:** familiar team/task, newcomer, partial turnover, delayed return, and
  structurally similar unseen task.
- **Metrics:** success, response latency, cue bytes, rehearsal episodes, newcomer
  error, recovery time, coordination variance, hidden-state dependence, and total
  CPU/human cost.
- **Hostile cases:** cue collision, false shared assumption, silent nonmember,
  strategic shorthand, and task drift after compression.
- **Pass:** compression may count only when the rehearsal and repair costs are
  charged and newcomer/turnover failure stays within the frozen limit.
- **Kill:** if a conventional shared-state protocol or centralized planner
  matches cost and robustness, no rehearsal-inspired residue survives.

### WS-RH-05 — rollback label versus re-treatable intervention

- **Generator:** create sequential state transformations with later unknown tasks,
  removal probabilities, collateral damage, incompatibilities, and incomplete
  documentation.
- **Arms:** greedy best-current transform; snapshot rollback; append-only event
  log; typed treatment record with removal/compatibility estimates; fully
  reversible oracle.
- **Split:** hold out future tasks, aging behavior, interaction pairs, and one
  irreversible effect class.
- **Metrics:** present utility, future-task success, restoration error, removal
  time, collateral harm, compatibility failures, documentation bytes, and total
  lifecycle cost.
- **Hostile cases:** exact digital rollback with external disclosure, lossy
  migration, hidden state, shared dependency mutation, and an intervention whose
  reversal is more harmful than retreatment.
- **Pass:** the typed arm must calibrate future repair risk and reduce irreversible
  regret without assuming oracle future tasks.
- **Kill:** forbid the word `reversible` where only local bytes reset; report the
  actual effect boundary instead.

### WS-RH-06 — digitized representation and future reconstruction

- **Generator:** create compound cultural objects and practices with significant
  properties, formats, software environments, rights, representations, and
  authorized user questions.
- **Arms:** file-only archive; checksum plus metadata; PREMIS-like event record;
  ontology-linked package; emulated environment; full source/practice oracle.
- **Split:** hold out future queries, software loss, schema migration, rights
  changes, and one sensory or performative property.
- **Metrics:** bit recovery, renderability, semantic-query recall, significant-
  property recovery, rights violations, false authenticity claims, staff time,
  storage, migration CPU, and restore latency.
- **Hostile cases:** perfect fixity of an incomplete representation, undocumented
  compression, inaccessible dependency, unauthorized reuse, and community
  withdrawal.
- **Pass:** preservation claims remain property- and query-qualified and include
  the cost of migration, staffing, access control, and restore rehearsal.
- **Kill:** a digital twin, scan, or provenance graph must never be promoted as
  the original object or living practice unless that identity relation is itself
  the authorized, tested claim.

## Mandatory comparator and attack stack

Every promoted track includes:

1. ordinary version control and append-only logs;
2. database provenance and event sourcing;
3. missing-data and selection models;
4. knowledge-graph or ontology storage;
5. centralized planning and shared blackboard coordination;
6. cold archive plus tested restore;
7. full instructions without compression;
8. a no-intervention arm;
9. a fully flexible model with the same trainable capacity; and
10. an oracle ceiling that is ineligible to win.

Attacks must cover selection shift, authority capture, access withdrawal,
context change, evaluator disagreement, newcomer/turnover, hidden external
effects, irreversible disclosure, metadata loss, software obsolescence, and
shared-source error.

## European and German boundary

- Germany has been a party to the UNESCO 2003 Intangible Cultural Heritage
  Convention since 2013. The Convention requires community participation in
  identifying and defining relevant heritage; it does not make every cultural
  practice public training data.
- Commission Recommendation (EU) 2021/1970 covers tangible, intangible,
  natural, and born-digital heritage and recommends lifecycle-aware
  digitization, preservation, standards, and Europeana contribution. It remains
  a recommendation and must not be described as a direct private-sector duty.
- [ISO 21127:2023](https://www.iso.org/standard/85100.html),
  [ISO 15489-1:2016](https://www.iso.org/standard/62542.html), and PREMIS are
  technical standards or specifications. They define representation and records
  practices, not ownership, authorization, scientific truth, or cultural value.
- GDPR, copyright, database rights, cultural-property law, contractual access,
  confidentiality, and community governance are separate applicability checks.
  A technically interoperable record can still be unlawful or unauthorized to
  expose or reuse.

## Exact repository routing

| Residue | Existing owner | Decision |
| --- | --- | --- |
| staged archive selection and unsupported absence | Candidate 014 | sharpen the observation/operator hostile test; no new candidate |
| context-qualified authenticity vector | Candidates 009, 014, and 020 | grade each source, retain disagreement, and govern standing separately |
| living protocol with permitted variation | Candidate 015 | add as a protocol-lifecycle domain test, not a cultural optimization target |
| rehearsal-dependent cue compression | Candidates 015 and 019 | test membership history, newcomers, turnover, reconstruction, and repair cost |
| graded removal and re-treatability | Candidates 009, 010, and 017 | distinguish byte reset, effect containment, rollback, repair, and future compatibility |
| representation lifecycle and significant properties | Candidates 014, 017, and 018 | preserve query-qualified reconstruction and lifecycle cost |
| community authority and refusal | Candidate 020 | no extraction or universalization from this audit |

No new P-ID or Candidate ID is warranted. Six workstation protocols are proposed;
none is executable merely because this document describes it.

## Promotion and kill conditions

Promote a central claim only if it is narrower than the source doctrine, names
its operator, authority, context, uncertainty, and comparator, and changes a
candidate or fixture test. Kill or downgrade the translation when:

- a conventional database, provenance, missing-data, version-control, or shared-
  state baseline matches it at equal lifecycle cost;
- cultural recognition is replaced by model confidence or majority preference;
- provenance is used as truth, fixity as authenticity, or digitization as
  identity;
- one community's rule is generalized without authority to another;
- absent records are treated as absent events without a support model;
- rehearsal cost, newcomer failure, or turnover repair is excluded;
- local rollback is described as reversal of external effects; or
- the system improves mean utility by sacrificing a protected harm, access,
  authority, or disagreement dimension.

## Audit decision and remaining depth

This file justifies a narrow `dedicated` entry for OECD FORD 6.5 because the
catch-all itself has now been searched through several residual humanities
methods. It does not make the category complete. Direct audits are still needed
for ethnography, sociology and media studies; oral history; museum and curatorial
practice; film, theatre and dance across traditions; conservation science;
translation and interpreting practice; architecture as cultural practice;
folklore; heritage conflict; and community-specific methods.

The durable result is conservative: preserve selection processes, plural sources,
authorized variation, shared interaction history, re-treatability, and
representation limits as separate testable objects. Do not package them as a new
kind of creativity or a generalized cultural model.

## Primary and authoritative sources

- Schwartz, J. M., and Cook, T. (2002), “Archives, Records, and Power: The
  Making of Modern Memory,” *Archival Science* 2, 1–19,
  [DOI 10.1007/BF02435628](https://doi.org/10.1007/BF02435628).
- UNESCO (2003), [Convention for the Safeguarding of the Intangible Cultural
  Heritage](https://ich.unesco.org/en/convention), especially Articles 2, 11,
  12, and 13.
- ICOMOS, ICCROM, and UNESCO participants (1994),
  [The Nara Document on Authenticity](https://landscapes.icomos.org/wp-content/uploads/1994-NARA-document-on-authenticity-International-Council-on-Monuments-and-Sites-1.pdf).
- Deppermann, A., and Schmidt, A. (2023), “On the Emergence of Routines: An
  Interactional Micro-history of Rehearsing a Scene,” *Human Studies* 46,
  [DOI 10.1007/s10746-022-09655-1](https://doi.org/10.1007/s10746-022-09655-1).
- Appelbaum, B. (1987), “Criteria for Treatment: Reversibility,” *Journal of
  the American Institute for Conservation* 26(2), 65–73,
  [open article](https://cool.culturalheritage.org/jaic/articles/jaic26-02-001.html).
- European Commission (2021),
  [Commission Recommendation (EU) 2021/1970 on a common European data space
  for cultural heritage](https://eur-lex.europa.eu/eli/reco/2021/1970/oj/eng).
- ISO (2023), [ISO 21127:2023, Information and documentation — A reference
  ontology for the interchange of cultural heritage information](https://www.iso.org/standard/85100.html).
- ISO (2016), [ISO 15489-1:2016, Information and documentation — Records
  management — Part 1: Concepts and principles](https://www.iso.org/standard/62542.html).
- Library of Congress, [PREMIS Preservation Metadata, version
  3.0](https://www.loc.gov/standards/premis/).
- Deutsche UNESCO-Kommission,
  [UNESCO-Übereinkommen zur Erhaltung des Immateriellen Kulturerbes](https://www.unesco.de/orte/immaterielles-kulturerbe/immaterielles-kulturerbe-weltweit/unesco-uebereinkommen-zur-erhaltung-des-immateriellen-kulturerbes/).

# Library, archival, and information science: durable interpretation audit

<!-- markdownlint-disable MD013 MD024 -->

- **Date:** 2026-08-05
- **Scope:** records management, archival appraisal and description,
  preservation, authority control, knowledge organization, retrieval,
  bibliometrics, provenance, data curation, ontologies, and institutional memory
- **Status:** adversarial transfer audit; no principle or candidate promotion

## Executive finding

Library, archival, and information science does not contribute a new principle
to the present registry. It contributes something more immediately useful: a
set of mature contracts for deciding **what survives, under which identity and
description, for which future interpreter and query**.

The strongest residual is a refinement of
[Candidate 017](../../experiments/candidates/017-contract-preserving-semantic-compaction.md):
semantic compaction should register the future query classes, designated user
community, representation dependencies, vocabulary versions, preservation
events, and tolerated answer error it claims to preserve. That refinement is
not new unless an integrated implementation beats ordinary OAIS/PREMIS-style
preservation, versioned schemas and vocabularies, and query-regression tests at
equal total lifecycle cost.

Three further refinements remain inside existing ownership:

1. Authority and vocabulary changes strengthen the dependency and supersession
   fields in
   [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md)
   and the repair contract in
   [Candidate 015](../../experiments/candidates/015-versioned-repairable-conventions.md).
2. Appraisal adds future-query loss, legal/ethical constraint, and
   reconstructability to
   [Candidate 018](../../experiments/candidates/018-value-reconstructability-aware-tiering.md).
3. Institutional memory sharpens
   [Candidate 019](../../experiments/candidates/019-audited-cumulative-inheritance.md):
   retained records do not by themselves retain the tacit capability needed to
   interpret or act on them.

No claim below treats provenance as truth, fixity as authenticity, citation as
quality, ontology membership as verification, findability as correctness, or
retention as useful memory. Those category errors would make an AI system more
confident and less auditable, not more knowledgeable.

## Evidence and comparison discipline

The audit prioritizes standards, primary system papers, foundational
peer-reviewed work, and original empirical studies. Each transfer is tested
against a mature ordinary null: catalogues and authority files, records
schedules, OAIS/PREMIS repositories, versioned schemas, relational or graph
databases, checksums and replicated storage, conventional information
retrieval, and ordinary organizational process.

Audit-local claims use `LIS-CL-*` identifiers. They are hypotheses or scoped
summaries, not additions to the central evidence ledger. A transfer survives
only if it states:

- the object and system boundary;
- the user or agent community expected to interpret it;
- state, units, clocks, retention horizon, and failure model;
- the conventional baseline and equal budget;
- a predeclared outcome, uncertainty interval, and retirement condition; and
- negative-transfer cases in which the mechanism should be disabled.

## Terms that must not be collapsed

| Term | Native contract | Does **not** establish |
| --- | --- | --- |
| Record | Evidence of an activity captured with declared context and controls | Truth, completeness, or permanent value |
| Provenance | Lineage among entities, activities, and agents | Correctness, benign intent, or causal completeness |
| Original order | Preserved arrangement when it carries evidential relationships | Optimal retrieval order or immutable organization |
| Appraisal | Authorized selection under purpose, risk, cost, and future-use uncertainty | Objective importance or safe universal forgetting |
| Retention schedule | Time/event rule for retaining and disposing of record classes | Epistemic value or permission to destroy under a hold |
| Fixity | Expected bit sequence remains unchanged under a declared digest procedure | Authenticity, interpretability, safety, or truth |
| Authenticity | Evidence that an object is what it purports to be within a chain of controls | Accuracy of its assertions |
| Preservation | Managed ability to access and interpret information over a horizon | Keeping every bit or interface unchanged forever |
| Authority control | Controlled identity and authorized forms with cross-references | Social legitimacy, factual infallibility, or permanent identity boundaries |
| Classification | Placement under an explicit scheme and purpose | Natural, neutral, or unique partition of the world |
| Ontology | Explicit formal commitments over classes, properties, and constraints | Exhaustive reality model or verified instance data |
| Relevance | Utility of an item to a situated information need or judgment protocol | Truth, quality, novelty, or causal importance |
| Citation | Directed reference between works or records | Endorsement, intellectual contribution, or comparable impact |
| FAIR | Findability, accessibility, interoperability, and reuse-oriented stewardship | Correctness, openness, privacy safety, or reproducibility |
| Institutional memory | Retained information and retrieval/interpretation capability across turnover | Automatic transfer of tacit practice or judgment |

## State, units, timescales, and boundaries

| Quantity | Unit | Typical clock or horizon | Required boundary |
| --- | --- | --- | --- |
| Record count, authority entities, vocabulary concepts | count | ingest to migration cycles | declared collection or graph snapshot |
| Payload and metadata size | bytes | ingest, replication, storage-years | logical object plus all representation dependencies |
| Capture, description, review, and migration effort | person-hours | transaction to multi-year programme | included labour roles and overhead |
| Storage, compute, and transfer energy | joules or kWh | operation and object-year | measured hardware and allocation method |
| Latency | milliseconds or seconds | query/session | client, network, index, and rendering boundary |
| Retention and preservation horizon | days or years | event- or time-triggered | jurisdiction, hold, designated community, and format |
| Precision, recall, rank metrics, fixity pass rate | dimensionless ratio | evaluation snapshot | corpus, relevance judgments, sampling, and confidence interval |
| Citation count and centrality | count or dimensionless score | database snapshot and citation window | source coverage, field, document type, and age |
| Semantic/query error | task-defined loss | before/after transform | registered query set and answer tolerance |
| Risk and expected loss | probability and task/currency loss | decision horizon | failure classes and consequence valuation |

Unlike units must not be silently added. A lifecycle objective may be written

$$
J(\pi)=w_c C_{\mathrm{currency}}(\pi)
      +w_e E_{\mathrm{joule}}(\pi)
      +w_h H_{\mathrm{person-hour}}(\pi)
      +\mathbb{E}[L_{\mathrm{miss}}+L_{\mathrm{wrong}}+L_{\mathrm{unreadable}}],
$$

where policy $\pi$ covers capture through disposition, and every weight converts
its source unit into one declared decision unit. Reports must also expose the
unweighted vector; a scalar $J$ can conceal unacceptable trade-offs.

For future query $q$, time $t$, and designated community $g$, preservation
utility is conditional rather than intrinsic:

$$
U(q,t,g)=p_{\mathrm{bits}}p_{\mathrm{render}}p_{\mathrm{sem}}
         p_{\mathrm{auth}}p_{\mathrm{access}}\,V(q,g)-C(q,t,g).
$$

The five $p$ terms are dimensionless conditional probabilities for bit
availability, renderability, semantic interpretability, adequate authenticity
evidence, and authorized accessibility; $V$ and $C$ share the declared decision
unit. Independence is **not** assumed in estimation: the product is only a
failure-decomposition checklist unless dependencies are modeled.

For a judged retrieval set, precision and recall are

$$
P=\frac{TP}{TP+FP},\qquad R=\frac{TP}{TP+FN}.
$$

Both are dimensionless and meaningless without the corpus snapshot, query set,
pooling/judgment process, assessor population, and uncertainty. Offline gains
must not be relabeled as task utility without an end-to-end test.

## Mechanism map

| ID | Native mechanism | Transfer target | Exact owner after dedup | Verdict |
| --- | --- | --- | --- | --- |
| M01 | Contextual record capture | Action/evidence traces | P-003, P-013, C014 | refine |
| M02 | Provenance, fonds, original order | Relational evidence context | P-013, C014, C019 | refine |
| M03 | Multilevel description and MPLP | Variable metadata effort | P-001, C018 | refine |
| M04 | Functional appraisal | Future-query-aware selection | P-001, P-012, C018 | test |
| M05 | Retention, holds, disposition | Governed lifecycle control | P-009, P-012, C020 | refine |
| M06 | Fixity and custody | Corruption detection/evidence | P-009, C009, mature storage | null |
| M07 | Designated community and representation information | Interpreter dependency contract | C014, C017 | test |
| M08 | Migration, emulation, significant properties | Validated transformation | C014, C017 | test |
| M09 | Distributed preservation diversity | Corruption detection and repair | P-004, P-009, fault tolerance | null |
| M10 | Authority control and persistent identity | Merge/split-aware entity identity | C014, C015 | refine |
| M11 | Work/expression/manifestation/item | Level-correct object identity | P-008, C014 | refine |
| M12 | Controlled vocabularies and SKOS | Versioned semantic mediation | C014, C015 | refine |
| M13 | Faceted classification | Query-time compositional views | P-008, C015 | null/refine |
| M14 | Probabilistic ranking | Budgeted candidate allocation | P-001, P-007, mature IR | null |
| M15 | Relevance feedback | Query/model revision | P-003, P-007 | null/refine |
| M16 | Negotiated, evolving information need | Interactive uncertainty reduction | P-002, P-007, C007 | refine |
| M17 | Citation networks and bibliometrics | Navigation with bias controls | P-001, C009 | null/refine |
| M18 | Ontologies and knowledge graphs | Explicit machine-interpretable commitments | P-008, P-013, C014 | null/refine |
| M19 | Provenance and FAIR data curation | Reusable evidence package | C014, C019 | refine |
| M20 | Organizational memory and communities of practice | Record-plus-capability continuity | C019 | test |

## Mechanism cards

### M01 — Contextual record capture

**Native contract.** ISO 15489 treats records as evidence of business activity
managed through creation, capture, and controls, not as arbitrary stored data
[@iso15489]. A record class therefore includes context, responsible agents,
time, relationships, access, and disposition controls.

**Boundary and scale.** State is record content plus metadata and control state;
units are records, bytes, person-hours, and capture latency; horizons run from
the triggering activity to authorized disposition. External actions not
captured by the record system remain outside reconstructability.

**AI transfer.** Tool calls, observations, model/configuration versions,
approvals, and resulting external effects can be captured as linked decision
records. This makes later re-evaluation possible; it does not prove that the
decision or observation was correct.

**Dedup and null.** Exact owners are
[P-003](../principle-registry.md#p-003--temporary-trace-before-commitment),
[P-013](../principle-registry.md#p-013--externalized-shared-state), and
[Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).
The null is a versioned event/audit store with schemas, access controls, and
retention rules.

**Equal-budget falsification.** Compare task rollback and incident diagnosis
under equal capture bytes, write latency, reviewer-hours, and privacy budget.
Retire the transfer if structured AI-specific capture does not reduce missed
causal links or recovery time on held-out incidents.

**Negative transfer.** Exhaustive capture can leak sensitive data, create
surveillance incentives, flood reviewers, and fossilize erroneous context.

**LIS-CL-01 (plausible).** A decision trace is useful evidence only when the
action boundary, record schema, identity, clock, and disposition policy remain
interpretable.

### M02 — Provenance, fonds, and original order

**Native contract.** Archival provenance preserves records by creator/fonds;
original order can preserve relationships created through activity. ISAD(G)
supports hierarchical description while warning that description must express
context and relationships [@isadg2000]. W3C PROV separately models entities,
activities, and agents [@prov2013].

**Boundary and scale.** State is a directed, versioned relation graph; units
are nodes, edges, bytes, and review-hours; the boundary is the declared
collection and capture process. Missing edges are unknown, not absent causes.

**AI transfer.** Keep evidence in its generating episode, agent, tool,
transformation, and authority context, with derived summaries linking back to
sources. Preserve useful local order while allowing alternate retrieval views.

**Dedup and null.** This refines P-013, Candidate 014, and Candidate 019. A
lineage graph or event-sourced database is the ordinary null. It is not a new
memory architecture.

**Equal-budget falsification.** At equal metadata bytes and curatorial labour,
measure source attribution accuracy, contradiction diagnosis time, and answer
calibration after records are recontextualized. Retire if flat records plus
standard lineage perform equivalently.

**Negative transfer.** Original order can preserve accidental, oppressive, or
unusable arrangements; provenance can lend false authority to a bad source.

**LIS-CL-02 (established).** Provenance constrains how evidence was
produced and transformed; it does not validate the evidence's assertions.

### M03 — Multilevel description and “more product, less process”

**Native contract.** Archival description can proceed from collection to
series, file, and item. Greene and Meissner argued that costly item-level
processing can reduce overall access when backlogs dominate, motivating
adequate rather than maximal processing [@greene2005mplp].

**Boundary and scale.** State includes collection hierarchy, description
coverage, backlog, access restrictions, and demand. Units are linear feet or
bytes, items, person-hours, queue time, and retrieval success over months to
years.

**AI transfer.** Allocate annotation and semantic enrichment at variable
granularity: coarse collection-level metadata first, then deepen description
where demand, risk, ambiguity, or expected value warrants it.

**Dedup and null.** This is P-001 and Candidate 018 under a curatorial cost
model. Ordinary nulls are backlog-prioritization, active learning, tiered
metadata, and query-log-driven enrichment.

**Equal-budget falsification.** Fix curator-hours, storage, and query workload;
compare uniform item-level metadata, demand-driven enrichment, and risk-aware
multilevel description on time-to-first-access, recall, sensitive-item leakage,
and downstream task loss.

**Negative transfer.** Coarse description hides minority records and unknown
future value; demand-driven work amplifies popularity and historical power.

**LIS-CL-03 (plausible).** Metadata depth should be an explicit allocation
decision with coverage and equity constraints, not a default property of every
stored item.

### M04 — Functional appraisal under future-query uncertainty

**Native contract.** Appraisal decides which records warrant retention under
institutional functions, accountability, risk, cost, and anticipated use.
Macroappraisal emphasizes functions and governance relationships rather than
only prominent individual documents [@cook2004macro].

**Boundary and scale.** State includes record classes, functions, legal holds,
cost, reconstructability, user groups, and uncertain future query distribution.
Units are bytes-years, curator-hours, currency, and expected loss across a
declared horizon.

**AI transfer.** Select traces, checkpoints, evidence, and learned artifacts by
expected future query value and accountability need, not only recency,
frequency, loss magnitude, or salience. Preserve sampling and minority coverage
where the future distribution is uncertain.

**Dedup and null.** This is P-001/P-012 and Candidate 018. The ordinary null is
a retention schedule plus cost/risk optimization and stratified sampling.

**Equal-budget falsification.** With equal storage-years, ingest energy,
review-hours, and legal constraints, evaluate future task regret over temporal
and distribution shifts. Include adversarial rare queries and audit needs.
Retire if standard risk/value tiering matches it.

**Negative transfer.** Appraisal encodes institutional power; irreversible
deletion makes unseen future questions unanswerable and can erase evidence of
harm.

**LIS-CL-04 (speculative).** Function- and accountability-aware
appraisal may dominate access-frequency retention when future queries shift,
but only under preregistered loss and equity measures.

### M05 — Retention schedules, holds, and authorized disposition

**Native contract.** Records management assigns retention triggers and periods,
suspends disposition under holds, and requires authorized, documented disposal
[@iso15489]. Keeping and deleting are both governed state transitions.

**Boundary and scale.** State is lifecycle class, trigger date/event, hold,
authority, disposition action, and proof of execution. Units are records,
bytes-years, days/years, and review-hours; jurisdiction and system replicas
define the boundary.

**AI transfer.** Give traces and memory artifacts explicit retention class,
expiry trigger, legal/ethical holds, review authority, and deletion propagation
across indexes, caches, replicas, and derived artifacts.

**Dedup and null.** This refines P-009, P-012, and Candidate 020. Database TTL,
policy engines, legal holds, garbage collection, and deletion workflows are the
mature null.

**Equal-budget falsification.** Measure stale-evidence use, forbidden retention,
deletion completeness, task degradation, and operator-hours under equal
storage, compute, and compliance effort.

**Negative transfer.** A hold can become indefinite surveillance; automated
expiry can destroy exculpatory or safety-critical evidence; deletion promises
can be false when derived state is omitted.

**LIS-CL-05 (established).** Retention is a governed lifecycle claim
only if triggers, holds, derivations, replicas, authority, and execution
evidence are included.

### M06 — Fixity and chain of custody

**Native contract.** BagIt manifests permit checksum validation and distinguish
a complete bag from a valid bag; the payload remains opaque, and the format is
not designed as protection against an active attacker [@rfc8493]. PREMIS records
preservation events, agents, objects, and rights [@premis30].

**Boundary and scale.** State is byte sequence, algorithm, expected digest,
verification event, custody evidence, and storage copy. Units are bytes,
verification rate, seconds, joules, and probability of undetected corruption.

**AI transfer.** Hash model artifacts, datasets, prompts, evidence packages,
and metadata; sign or append custody events where threat models require it.
Validate the complete dependency closure, not only a payload file.

**Dedup and null.** Checksums, signatures, content-addressed storage, Merkle
trees, audit logs, and replicated storage are complete ordinary nulls. This is
maintenance (P-009) and graded assurance (Candidate 009), not a new learning
principle.

**Equal-budget falsification.** None is warranted until an AI-specific method
beats standard digest/signature/audit tooling under the same compute, bandwidth,
operator time, and attacker model.

**Negative transfer.** A perfectly fixed malicious model, poisoned dataset, or
false claim remains malicious, poisoned, or false. Weak or obsolete algorithms
create deceptive assurance.

**LIS-CL-06 (established).** Fixity verifies equality to a referenced bitstream;
authenticity and semantic validity require additional evidence.

### M07 — Designated community and representation information

**Native contract.** OAIS makes preservation relative to a designated
community's knowledge base and requires representation information sufficient
to interpret preserved information [@ccsds2024oais]. An object can remain
bit-perfect yet become unintelligible.

**Boundary and scale.** State includes content data object, representation
network, knowledge assumptions, access software, community definition, and
change history. Units are dependency count/depth, bytes, person-hours, and
successful interpretation rate over years.

**AI transfer.** Every long-lived model/evidence artifact should declare who or
what must interpret it, their assumed capabilities, formats, schemas,
tokenizers, code, ontologies, units, and evaluation procedures.

**Dedup and null.** This sharpens Candidate 014 and Candidate 017. The mature
null is an OAIS-style package plus dependency lockfiles, schemas, containers,
documentation, and executable tests.

**Equal-budget falsification.** Freeze artifacts, then test independent future
teams/agents after dependency and staff turnover. At equal packaging bytes and
curation-hours, measure successful reconstruction, semantic answer error, and
time-to-interpret. Retire if ordinary reproducibility packages match it.

**Negative transfer.** A narrowly defined community excludes later users; an
overbroad definition creates unbounded documentation cost; executing preserved
software can be unsafe.

**LIS-CL-07 (plausible).** Long-term AI memory is an interpreter-dependency
contract, not merely a storage-duration property.

### M08 — Migration, emulation, and significant properties

**Native contract.** Digital preservation may migrate information to new
representations or emulate an old environment. PREMIS records the resulting
events and relationships; OAIS requires preservation information and continued
understandability [@premis30; @ccsds2024oais]. The properties to preserve depend
on future use, not on format identity alone.

**Boundary and scale.** State is source object, environment, transform,
parameters, destination, validation suite, and rollback copy. Units are bytes,
person-hours, compute/joules, functional test pass rate, and semantic loss per
migration generation.

**AI transfer.** Migrate model checkpoints, embeddings, indexes, schemas, and
summaries only against registered behavioral, evidential, calibration, and
query-preservation tests. Retain source lineage and a rollback horizon.

**Dedup and null.** This is Candidate 014 plus Candidate 017, with database
schema migration, model conversion, regression testing, and emulation as the
ordinary null.

**Equal-budget falsification.** Compare bit-preserving emulation, format
migration, and semantic compaction under equal storage, compute, and engineering
hours across repeated technology changes. Measure task behavior, registered
query error, calibration, evidence-link survival, and attack surface.

**Negative transfer.** Tests encode only anticipated uses; migration can erase
unknown capabilities or biases; emulation preserves vulnerable behavior and
dependency complexity.

**LIS-CL-08 (speculative).** Registered-use validation can make
semantic migration falsifiable, but cannot prove preservation for unregistered
future uses.

### M09 — Distributed preservation diversity, polling, and repair

**Native contract.** LOCKSS uses independently administered replicas, polling,
and repair to resist storage faults and some attacks under explicit assumptions
[@maniatis2005lockss]. Its diversity is operational and administrative, not
automatic semantic independence.

**Boundary and scale.** State is replica bytes, peer membership, votes,
credentials, audit schedule, and repair events. Units are replicas, fault
domains, bytes transferred, seconds, joules, and corruption probability.

**AI transfer.** Maintain geographically and administratively separated copies
of essential artifacts, periodically audit them, and repair damaged copies from
quorum evidence. Diversify implementations only when common-mode risk justifies
the cost.

**Dedup and null.** Exact owners are P-004/P-009 and the
[fault-tolerance audit](2026-08-05-fault-tolerance-and-reconstruction.md).
Replication, erasure coding, Byzantine protocols, scrubbing, and backup restore
tests are the mature null.

**Equal-budget falsification.** No “biologically inspired” variant survives
without beating those systems at equal storage overhead, bandwidth, energy,
operator-hours, recovery point/time objectives, and correlated-failure model.

**Negative transfer.** Replicas can preserve the same poisoned artifact;
correlated software, cloud, governance, or credential failures defeat nominal
copy count; polling consumes ongoing resources.

**LIS-CL-09 (established).** Replica diversity is meaningful only
after failure-domain, administration, software, and threat correlations are
measured.

### M10 — Authority control and persistent identity

**Native contract.** Authority records maintain controlled names, identifiers,
variants, cross-references, and source evidence [@marc21authority]. ORCID
addresses researcher-name ambiguity with persistent identifiers
[@haak2012orcid]. Identity still requires merge, split, correction, and
versioning operations.

**Boundary and scale.** State is entity identifier, assertions, names,
provenance, time validity, confidence, redirects, and merge/split history. Units
are entities, assertions, error rates, curator-hours, and lookup latency.

**AI transfer.** Separate entity identity from surface name and from claims
about the entity. Keep temporal/source-qualified mappings and reversible merge/
split decisions so evidence can be reattached after correction.

**Dedup and null.** This refines Candidates 014 and 015. Entity resolution,
master-data management, authority files, and versioned graph identifiers are
the mature null.

**Equal-budget falsification.** At equal index size and review-hours, test
cross-domain/coreference accuracy, false merges, false splits, correction
latency, and downstream answer loss under name, language, and affiliation drift.

**Negative transfer.** Persistent identifiers enable tracking; central
authority embeds institutional bias; false merges contaminate all linked
evidence; immutable identifiers conflict with legitimate erasure needs.

**LIS-CL-10 (plausible).** AI factual memory should version entity resolution
separately from claims so identity corrections do not silently rewrite
evidence.

### M11 — Work, expression, manifestation, and item

**Native contract.** IFLA LRM distinguishes a work's intellectual creation, an
expression that realizes it, a manifestation embodying expressions, and an
individual item exemplifying a manifestation [@ifla2017lrm]. These are disjoint
entity levels with different identity and relationship questions.

**Boundary and scale.** State is entities, realization/embodiment/exemplar
relations, version evidence, and identifiers. Units are entity and edge counts,
cataloguer-hours, and retrieval/error rates; the boundary is the catalogue's
model and aggregation rules.

**AI transfer.** Distinguish an abstract claim or procedure from its wording,
serialized artifact, deployment, and individual execution. Revision at one
level should not silently imply identity or change at every other level.

**Dedup and null.** This is compartmentalized interaction (P-008) and versioned
observation contracts (Candidate 014). Provenance graphs, software artifact
models, content-addressed builds, and versioned databases are the ordinary
nulls.

**Equal-budget falsification.** With equal metadata and curation effort,
compare flat artifact identity to level-aware identity on duplicate detection,
incorrect evidence transfer, rollback, and query accuracy across revisions.

**Negative transfer.** Excessive entity decomposition raises metadata and join
cost, confuses users, and creates artificial boundaries when the task needs a
single operational object.

**LIS-CL-11 (plausible).** Separating conceptual, representational, packaged,
and executed identity can prevent evidence from being inherited across
non-equivalent AI artifact versions.

### M12 — Controlled vocabularies, thesauri, and SKOS

**Native contract.** Controlled vocabularies manage preferred and alternate
labels plus equivalence, hierarchical, and associative relations
[@niso2010z3919]. SKOS represents concepts, labels, schemes, mappings, and
broader/related relations with deliberately limited formal commitment
[@skos2009]. Concept schemes change and therefore require retrieval-aware
versioning [@tennis2006versioning].

**Boundary and scale.** State is scheme version, concept URI, labels,
relations, mappings, governance decision, and applicability time. Units are
concepts, edges, languages, mapping errors, review-hours, and query latency.

**AI transfer.** Keep internal labels and external terms mediated through
versioned schemes with provenance and uncertainty. Permit many-to-many mappings
and explicit unmapped cases rather than silently equating vocabulary tokens.

**Dedup and null.** Candidates 014 and 015 own observation and convention
versioning. Thesauri, schema registries, ontologies, embedding-based expansion,
and data mapping tools form the mature null.

**Equal-budget falsification.** Under equal annotation/review-hours and index
size, introduce temporal, domain, and language drift; measure retrieval,
cross-version answer consistency, mapping error, and repair latency against
static vocabulary and embedding-only baselines.

**Negative transfer.** Controlled terms encode cultural and institutional bias;
hierarchies can imply false natural order; mappings can launder contested
equivalence into machine fact.

**LIS-CL-12 (plausible).** Versioned concept mediation should expose semantic
drift and mapping uncertainty rather than overwrite old labels or pretend that
embedding proximity is equivalence.

### M13 — Faceted classification and compositional views

**Native contract.** Faceted classification analyzes subjects into separately
controlled dimensions that can be combined for description or retrieval,
rather than requiring every combination to exist as a fixed enumerated class
[@ranganathan1933colon].

**Boundary and scale.** State is facet definitions, values, combination rules,
assigned evidence, and scheme version. Units are facets, assignments, candidate
set size, cataloguer-hours, and query latency; the scheme and intended user
tasks define the boundary.

**AI transfer.** Represent evidence and capabilities along separable dimensions
such as domain, modality, time, source, authority, risk, and task, composing a
view at query time instead of forcing one global taxonomy.

**Dedup and null.** This is P-008 plus Candidate 015. Relational dimensions,
OLAP, faceted search, tagged documents, product taxonomies, and graph queries
are complete ordinary nulls unless a learned composition adds measured value.

**Equal-budget falsification.** Hold metadata count, index bytes, and query
compute constant; compare a fixed hierarchy, flat tags, and facets on unseen
combinations, retrieval quality, update cost, and user/agent decision time.

**Negative transfer.** Facets are not truly independent; forced decomposition
can destroy context, invite combinatorial search, and conceal contested or
intersectional categories.

**LIS-CL-13 (established).** Faceted composition is useful
where query dimensions are separately governed and empirically recombinable;
it is not a new modular-learning principle.

### M14 — Probabilistic ranking and relevance weighting

**Native contract.** Probabilistic information retrieval ranks documents by
estimated relevance to a query under corpus statistics and model assumptions
[@robertson1976relevance]. A common BM25 form is

$$
\operatorname{score}(D,Q)=\sum_{q\in Q}\operatorname{IDF}(q)
\frac{f(q,D)(k_1+1)}
{f(q,D)+k_1\left(1-b+b\frac{|D|}{\operatorname{avgdl}}\right)},
$$

where $f(q,D)$ is a term count; $|D|$ and $\operatorname{avgdl}$ are token
counts in the same tokenizer; and $k_1,b$, IDF, and score are dimensionless.

**Boundary and scale.** State is corpus snapshot, index, query, ranking model,
candidate budget, and judgments. Units are documents/tokens, bytes, latency,
joules, and dimensionless ranking metrics.

**AI transfer.** Use cheap evidence-ranking to allocate expensive reading,
reasoning, and verification. Calibration and source diversity must be evaluated
separately from relevance ranking.

**Dedup and null.** This is P-001/P-007. BM25, dense retrieval, learning to
rank, approximate nearest-neighbour search, reranking, and caching are the
mature IR null.

**Equal-budget falsification.** Fix corpus, index bytes, training data, query
latency, accelerator energy, and downstream model tokens; measure end-to-end
task loss, citation support, calibration, subgroup coverage, and tail latency.

**Negative transfer.** Relevance models reproduce corpus and click bias,
optimize easy head queries, over-rank duplicated sources, and can suppress
contradictory evidence.

**LIS-CL-14 (established).** Evidence routing must beat mature sparse,
dense, and hybrid retrieval at equal end-to-end budget; relevance scores are
not epistemic confidence.

### M15 — Relevance feedback and query reformulation

**Native contract.** Relevance feedback updates a query representation from
judged relevant and non-relevant documents [@salton1990feedback]. An idealized
Rocchio update is

$$
\mathbf q' = \alpha\mathbf q
+\frac{\beta}{|D_r|}\sum_{\mathbf d\in D_r}\mathbf d
-\frac{\gamma}{|D_n|}\sum_{\mathbf d\in D_n}\mathbf d,
$$

where vectors share one feature space, $D_r,D_n$ are judged sets, and the
coefficients are dimensionless. Empty sets require an explicit fallback.

**Boundary and scale.** State is query, displayed ranking, judgments, update
history, and user/task context. Units are interactions, seconds, annotation
effort, and retrieval/task metrics over a session.

**AI transfer.** Treat verifier outcomes, user corrections, and downstream task
failures as scoped feedback for evidence routing, while retaining the original
query and avoiding global updates from ambiguous signals.

**Dedup and null.** P-003 and P-007 own temporary evidence and error-directed
allocation. Rocchio, pseudo-relevance feedback, online learning, query expansion,
and bandit ranking are the ordinary nulls.

**Equal-budget falsification.** Match interactions, labels, compute, latency,
and reviewer-hours; measure held-out query/task performance, convergence,
calibration, and diversity against static, pseudo-feedback, and online-learning
baselines.

**Negative transfer.** Exposure bias makes displayed results generate their own
confirmation; user clicks are not relevance; poisoned or mistaken feedback can
narrow the evidence space.

**LIS-CL-15 (plausible).** Feedback should update a versioned query/task model
with exploration and rollback, not silently rewrite the evidence base.

### M16 — Negotiated and evolving information needs

**Native contract.** Reference interaction can negotiate an initially unclear
question [@taylor1968question]. An anomalous state of knowledge motivates
retrieval when the user cannot fully specify the needed information
[@belkin1982ask]. Berrypicking models search as a sequence in which the query
and sources change as the searcher learns [@bates1989berrypicking].

**Boundary and scale.** State is task, current question, uncertainty, search
history, evidence viewed, reformulations, and stopping decision. Units are
turns, seconds, cognitive/reviewer effort, retrieval cost, and terminal task
loss.

**AI transfer.** When requirements are underdetermined, maintain hypotheses
about the information need, ask high-value questions, search heterogeneous
sources, and make query evolution visible rather than answering the first
surface form as fixed intent.

**Dedup and null.** P-002/P-007 and Candidate 007 own escalation and
observation. Interactive search, clarification, active learning, Bayesian
experimental design, and tool-using agents are mature nulls.

**Equal-budget falsification.** Fix interaction count, wall time, search/model
tokens, and user effort; compare one-shot retrieval, scripted clarification,
and adaptive negotiation on hidden-goal task success, regret, and unwanted
interventions.

**Negative transfer.** Excessive questions impose friction, strategic users
may manipulate the process, search history leaks private intent, and an agent
can mistake its own reformulation for the user's goal.

**LIS-CL-16 (plausible).** Search should represent the information need as
versioned uncertain state when evidence acquisition predictably changes the
question.

### M17 — Citation networks and bibliometric limits

**Native contract.** Citation indexing creates navigable relations among works
[@garfield1955citation], and link structure can inform ranking
[@brin1998anatomy]. Citations are socially accumulated, field- and age-dependent
signals: cumulative advantage is documented by the Matthew effect
[@merton1968matthew], journal impact factors do not validly evaluate individual
papers [@seglen1997impact], and responsible metrics require contextual,
pluralistic judgment [@hicks2015leiden].

**Boundary and scale.** State is corpus/version, directed edges, document type,
field, publication/citation time, database coverage, and retractions. Units are
counts, years, coverage ratios, and dimensionless centrality/rank.

**AI transfer.** Use citation topology to discover antecedents, descendants,
clusters, and contradictory or corrective work. Keep it a navigation feature
alongside content, provenance, diversity, and direct methodological evaluation.

**Dedup and null.** P-001 and Candidate 009 own allocation and assurance.
Citation search, PageRank-like centrality, bibliographic coupling, co-citation,
field normalization, and systematic-review workflows are the mature null.

**Equal-budget falsification.** Fix API/corpus coverage, retrieval and review
budget, and publication cutoff; compare text-only, citation-only, and hybrid
search on primary-source recall, contradiction/retraction detection, field and
language coverage, and downstream claim error.

**Negative transfer.** Preferential attachment suppresses new or marginalized
work; citation gaming and review articles inflate visibility; negative citation
and copying are mistaken for endorsement; coverage gaps become hidden absence.

**LIS-CL-17 (established).** Citation topology is a biased discovery
signal whose value must be reported conditional on database, field, document
type, age, and task.

### M18 — Ontologies and knowledge graphs

**Native contract.** An ontology is an explicit specification of a
conceptualization [@gruber1993ontology]. OWL 2 defines machine-interpretable
classes, properties, individuals, and axioms with formal semantics
[@owl22012]; its open-world setting does not treat an unasserted fact as false.
PROV-O formalizes a reusable provenance vocabulary [@prov2013].

**Boundary and scale.** State is ontology version, imports, axioms, instance
assertions, provenance, reasoning profile, and consistency state. Units are
nodes, edges, axioms, reasoning time/memory, and task error; the formal theory
and named-graph/version boundary must be explicit.

**AI transfer.** Represent selected relations and constraints explicitly so
agents can query, validate, explain, and revise them. Keep source-qualified
assertions separate from ontology commitments and from inferred entailments.

**Dedup and null.** This is P-008/P-013 and Candidate 014. Knowledge graphs,
relational databases, rule engines, description-logic reasoners, constraint
languages, and retrieval-augmented models are the mature null.

**Equal-budget falsification.** Match corpus/annotation, graph and index bytes,
training/inference energy, engineering-hours, and latency; evaluate compositional
queries, correction propagation, contradiction handling, calibration, and task
loss against text, relational, and hybrid baselines.

**Negative transfer.** Formalized categories can reify bias; open-world and
closed-world expectations are easily confused; ontology matching introduces
false equivalence; reasoning over inconsistent or malicious assertions can
amplify errors.

**LIS-CL-18 (established).** A knowledge graph makes selected
commitments inspectable; it does not make its instance assertions complete,
current, or true.

### M19 — Provenance and FAIR data curation

**Native contract.** FAIR calls for data and metadata to be findable,
accessible under stated conditions, interoperable, and reusable
[@wilkinson2016fair]. W3C PROV supplies a general lineage model [@prov2013].
Neither contract guarantees open access, correctness, privacy safety, or exact
computational reproducibility.

**Boundary and scale.** State is data, metadata, identifier, licence/access
rule, schema/vocabulary, provenance, software/environment, and quality evidence.
Units are bytes, objects, dependencies, access success, person-hours, and
reproduction/task error over repository and study lifetimes.

**AI transfer.** Package datasets, evidence, evaluations, model artifacts, and
usage constraints with persistent identity, machine-readable metadata,
provenance, versioned dependencies, and validation tests.

**Dedup and null.** Candidate 014 and Candidate 019 own observation and
inheritance. Data repositories, datasheets, model cards, lockfiles, containers,
lineage systems, and reproducible workflows form the mature null.

**Equal-budget falsification.** At equal packaging bytes, curator-hours,
compute, and access-control overhead, test independent reuse after staff and
environment turnover: discovery rate, access success, reproduction error,
misuse, and time-to-correct interpretation.

**Negative transfer.** Rich metadata exposes people or sensitive attributes;
persistent identifiers aid linkage attacks; interoperability can scale misuse;
FAIR scores can reward form while quality remains poor.

**LIS-CL-19 (established).** Reuse readiness is a dependency,
provenance, rights, and interpretation contract, not evidence that reuse will
be valid or ethical.

### M20 — Organizational memory and communities of practice

**Native contract.** Organizational memory is distributed across retention
facilities and retrieval processes rather than residing in a single archive
[@walsh1991memory]. Practice-based knowledge is reproduced through communities
and participation [@brown1991communities]; internal transfer can remain “sticky”
because causal ambiguity, relationship difficulty, and recipient/source
conditions impede replication [@szulanski1996stickiness].

**Boundary and scale.** State includes records, routines, tools, roles,
relationships, skill, authority, and rehearsal. Units are staff/agent turnover,
training and recovery hours, task success/error, and months/years; the relevant
team, workflow, and dependency environment define the boundary.

**AI transfer.** Preserve not only outcomes and prose but executable routines,
examples, counterexamples, decision rationales, contact/authority paths,
simulations, and periodic practice. Test whether a replacement team or agent
can actually recover capability.

**Dedup and null.** This refines Candidate 019 and the
[cultural-evolution audit](2026-08-05-cultural-evolution-archaeology.md).
Documentation, training, runbooks, apprenticeship, incident exercises,
configuration-as-code, and succession planning are mature nulls.

**Equal-budget falsification.** Under equal authoring, training, and rehearsal
hours, compare document-only handoff, executable packages, guided practice, and
combined designs after delayed turnover. Measure recovery time, task quality,
novel-case transfer, unsafe improvisation, and maintenance cost.

**Negative transfer.** Communities can preserve obsolete practice and exclude
outsiders; tacit channels are unauditable; executable routines can reproduce
old vulnerabilities; constant rehearsal is expensive.

**LIS-CL-20 (plausible).** Institutional continuity requires evidence plus
tested interpretation and performance capability; document count is an invalid
proxy.

## Exact registry deduplication

No principle is promoted. The table records the closest exact owner for every
current principle, including those not central to this audit, to prevent
renaming from being mistaken for novelty.

| Principle | Library/information-science overlap | Dedup verdict |
| --- | --- | --- |
| [P-001 selective allocation](../principle-registry.md#p-001--selective-allocation) | appraisal, variable description, ranking | complete overlap; M03/M04 add objectives and harms |
| [P-002 local autonomy with exception escalation](../principle-registry.md#p-002--local-autonomy-with-exception-escalation) | reference negotiation, curatorial escalation | complete overlap |
| [P-003 temporary trace before commitment](../principle-registry.md#p-003--temporary-trace-before-commitment) | decision records, query history, feedback | complete overlap |
| [P-004 diversity, selection, and protection](../principle-registry.md#p-004--diversity-selection-and-protection) | distributed preservation copies and administration | complete overlap; not semantic diversity by default |
| [P-005 use-dependent topology](../principle-registry.md#p-005--use-dependent-topology) | evolving links, vocabulary and citation networks | metaphorical overlap only; no new structural-learning evidence |
| [P-006 homeostatic negative feedback](../principle-registry.md#p-006--homeostatic-negative-feedback) | backlog, storage, and review control | generic control null; no residual |
| [P-007 prediction-error allocation](../principle-registry.md#p-007--prediction-error-allocation) | relevance feedback, clarification, active curation | complete overlap |
| [P-008 compartmentalized interaction](../principle-registry.md#p-008--compartmentalized-interaction) | entity levels, facets, ontologies | complete overlap |
| [P-009 maintenance plane](../principle-registry.md#p-009--maintenance-plane) | fixity audit, preservation events, repair, disposition | complete overlap |
| [P-010 structural offloading and co-design](../principle-registry.md#p-010--structural-offloading-and-co-design) | catalogues, indexes, external schemes | complete overlap; conventional information infrastructure |
| [P-011 transient communication coalitions](../principle-registry.md#p-011--transient-communication-coalitions) | temporary query/result assemblages | weak analogy; no field-specific residual |
| [P-012 memory matched to information lifetime](../principle-registry.md#p-012--memory-matched-to-information-lifetime) | retention schedules, appraisal, preservation horizon | complete overlap with stronger governance boundary |
| [P-013 externalized shared state](../principle-registry.md#p-013--externalized-shared-state) | records, catalogues, authority files, provenance graphs | complete overlap |

## Exact candidate deduplication

| Candidate | Audit relation | Disposition |
| --- | --- | --- |
| [C001 adaptive topology](../../experiments/candidates/001-adaptive-topology.md) | changing relation and citation graphs | mature graph/index null; no update |
| [C002 multiscale context broadcast](../../experiments/candidates/002-multiscale-context-broadcast.md) | collection/series/item context | retrieval hierarchy, not broadcast mechanism |
| [C003 recovery dynamics and fragility](../../experiments/candidates/003-recovery-dynamics-fragility.md) | preservation recovery and missing dependencies | fault-tolerance null; no update |
| [C004 closed endogenous curriculum](../../experiments/candidates/004-closed-endogenous-curriculum.md) | query logs and collection use | feedback can close exposure loop; negative control only |
| [C005 severity-ordered containment](../../experiments/candidates/005-severity-ordered-containment.md) | access restriction and preservation triage | generic risk ordering; no residual |
| [C006 reversible physical skill](../../experiments/candidates/006-reversible-physical-skill.md) | retained procedures versus performance | M20 is evidence/capability handoff, not physical reversal |
| [C007 endogenous observation/surveillance](../../experiments/candidates/007-endogenous-observation-surveillance.md) | negotiated query and interaction telemetry | M16 refines consent, uncertainty, and stopping boundary |
| [C008 contestable modular allocation](../../experiments/candidates/008-contestable-modular-allocation.md) | appraisal and description priority | contestability needed; no separate mechanism |
| [C009 graded assurance envelopes](../../experiments/candidates/009-graded-assurance-envelopes.md) | fixity/authenticity, source and citation assurance | M06/M17 sharpen non-equivalence; no new candidate |
| [C010 reset-coupled staged verification](../../experiments/candidates/010-reset-coupled-staged-verification.md) | preservation validation after transformation | ordinary regression/rollback null |
| [C011 dual-loop operational assurance](../../experiments/candidates/011-dual-loop-operational-assurance.md) | access plus preservation monitoring | ordinary service/preservation control loops |
| [C012 latency-qualified authority](../../experiments/candidates/012-latency-qualified-authority.md) | authority records and review latency | lexical collision only; catalogue authority is identity control |
| [C013 deficit-capability routing](../../experiments/candidates/013-deficit-capability-routing.md) | route ambiguous questions to curator/expert | generic skill routing; no residual |
| [C014 versioned observation contract](../../experiments/candidates/014-versioned-observation-contract.md) | provenance, identity, scheme version, representation dependency | strongest refinement from M01/M07/M10/M12/M19 |
| [C015 versioned repairable conventions](../../experiments/candidates/015-versioned-repairable-conventions.md) | controlled vocabularies and mappings | direct ownership of M12/M13 |
| [C016 conflict-bounded unit transition](../../experiments/candidates/016-conflict-bounded-unit-transition.md) | merge/split records and scheme revisions | version-control null; no new transition mechanism |
| [C017 contract-preserving semantic compaction](../../experiments/candidates/017-contract-preserving-semantic-compaction.md) | designated community, registered queries, representation network | primary residual; experiment, no promotion |
| [C018 value/reconstructability-aware tiering](../../experiments/candidates/018-value-reconstructability-aware-tiering.md) | appraisal, retention, multilevel description | direct ownership of M03/M04/M05 |
| [C019 audited cumulative inheritance](../../experiments/candidates/019-audited-cumulative-inheritance.md) | curated packages and institutional memory | M19/M20 sharpen tacit-capability test |
| [C020 constitutional control plane](../../experiments/candidates/020-constitutional-control-plane.md) | retention authority, access rights, holds, disposition | policy/governance refinement only |

## Mature nulls and adjacent-audit boundary

| Claimed novelty | Mandatory ordinary null | Adjacent audit owning remainder |
| --- | --- | --- |
| “AI archival memory” | OAIS/PREMIS package, object store, versioned database, tested restore | [databases/storage](2026-08-05-databases-storage.md) |
| “Immutable trustworthy memory” | digests, signatures, append-only/tamper-evident logs, custody procedure | [security/cryptography](2026-08-05-security-cryptography.md) and [legal evidence](2026-08-05-legal-evidence-procedure.md) |
| “Self-healing knowledge archive” | replicas, scrubbing, erasure codes, consensus, restore drills | [fault tolerance](2026-08-05-fault-tolerance-and-reconstruction.md) |
| “Semantic consolidation” | schema migration, query regression, event/version compaction, summaries with lineage | [databases/storage](2026-08-05-databases-storage.md) |
| “Meaning-preserving representation” | versioned observation/measurement contract and declared units | [metrology](2026-08-05-metrology-measurement-science.md) |
| “Adaptive vocabulary” | versioned taxonomy/thesaurus/ontology and mapping review | [linguistics](2026-08-05-linguistics-communication.md) |
| “Verified knowledge graph” | database constraints, type/contracts, theorem/rule engine, provenance | [programming languages/verification](2026-08-05-programming-languages-verification.md) |
| “Cumulative cultural memory” | repository, training, handoff, rehearsal, institutional process | [cultural evolution/archaeology](2026-08-05-cultural-evolution-archaeology.md) |
| “Novel relevance routing” | BM25, dense/hybrid retrieval, learning-to-rank, reranking, relevance feedback | this audit; mature IR null is complete |
| “Citation intelligence” | citation index, field normalization, retraction/correction checks, systematic review | this audit; metrics remain conditional signals |

## Equal-budget experiments

### E-LIS-1 — Query-registered semantic preservation

**Question.** Does the M07/M08 refinement improve Candidate 017 beyond an
ordinary versioned repository and query-regression suite?

**Arms.** (A) retained full history; (B) ordinary schema/version compaction;
(C) OAIS-like designated-community and representation package plus registered
query/tolerance contracts; (D) proposed learned semantic compactor with the
same package and tests.

**Budget equality.** Match total stored bytes-years, ingestion and migration
joules, engineering/curator-hours, query latency envelope, and reviewer-hours.
Report the vector as well as any weighted aggregate.

**Perturbations.** Repeated schema/vocabulary changes, missing dependencies,
staff/agent turnover, new but in-family queries, out-of-contract queries,
adversarially ambiguous identities, and required deletion.

**Primary outcomes.** Registered-query error, evidence-link survival,
calibration, reconstruction time, unregistered-query regret, privacy failures,
and lifecycle cost, with bootstrap confidence intervals across query families.

**Retirement rule.** Retire into Candidate 017 plus ordinary preservation if D
does not Pareto-improve on B/C or if gains disappear under held-out migrations.

### E-LIS-2 — Authority and vocabulary drift

**Question.** Do versioned authority/scheme layers improve evidence reuse after
identity and language drift?

**Arms.** Static labels; embedding-only matching; standard authority file plus
versioned SKOS-like scheme; proposed learned mediation with the same stored
history and human-review budget.

**Budget equality.** Match source documents, annotation and review-hours, graph/
index bytes, training and inference joules, query count, and latency.

**Perturbations and outcomes.** Introduce namesakes, renames, entity
merge/splits, multilingual labels, contested mappings, and temporal concept
change; measure false merge/split, mapping calibration, retrieval/task loss,
repair latency, and subgroup error.

**Retirement rule.** Retire into Candidates 014/015 and conventional entity
resolution if the learned layer does not improve held-out drift without larger
irreversible merge or bias cost.

### E-LIS-3 — Evolving-need retrieval

**Question.** Does explicit uncertain information-need state improve outcomes
over strong interactive retrieval?

**Arms.** One-shot hybrid search; scripted clarification; conventional
relevance feedback; explicit versioned need-state agent.

**Budget equality.** Match wall time, user turns, source calls, tokens, joules,
and user-effort survey burden. Use hidden goals and assessors not involved in
system design.

**Outcomes.** Terminal task success and regret, correction count, information
gain per interaction, unwanted disclosure, abandonment, source diversity, and
misalignment between final reformulation and hidden goal.

**Retirement rule.** Retire into P-002/P-007 and mature interactive IR if gains
are explained by extra turns, compute, or feedback labels.

### E-LIS-4 — Institutional capability after turnover

**Question.** Which retained package actually transfers operational capability?

**Arms.** Prose documentation; structured records/provenance; executable tests
and simulations; guided practice; and a combined package.

**Budget equality.** Match authoring plus training person-hours, infrastructure
cost, and delayed test time. A secondary cost-effectiveness analysis may vary
the allocation without claiming causal equality.

**Perturbations and outcomes.** Replace all original operators, delay access,
change one dependency, and present both rehearsed and novel incidents. Measure
time to safe operation, task error, escalation quality, unsupported improvisation,
and maintenance effort.

**Retirement rule.** Retire M20 into ordinary documentation/training if
structured packages add no held-out capability beyond practice at equal cost.

## Cross-cutting negative-transfer register

1. **Preservation without epistemic review:** durable errors and poisoned data
   accumulate authority through age and repetition.
2. **Capture without proportionality:** telemetry becomes surveillance and
   sensitive context becomes a permanent attack surface.
3. **Appraisal without representation:** popularity and institutional power
   erase minority, future, or adversarially inconvenient evidence.
4. **Provenance worship:** prestigious origin substitutes for direct method and
   claim evaluation.
5. **Authority overreach:** identity systems centralize naming power and make
   false merges globally contagious.
6. **Classification reification:** task-specific categories are treated as
   natural kinds; historical bias becomes executable infrastructure.
7. **Feedback closure:** ranked exposure generates clicks/judgments that further
   entrench the same ranking.
8. **Metric gaming:** citation and retrieval proxies displace the outcome they
   were meant to support.
9. **Formalism laundering:** ontology consistency is reported as truth or
   completeness of instance knowledge.
10. **Interoperability scaling harm:** well-packaged data becomes easier to
    combine for discrimination, deanonymization, or unsafe reuse.
11. **Dependency embalming:** emulation preserves vulnerabilities and operating
    assumptions that should instead be retired.
12. **Documentation illusion:** record quantity masks loss of judgment,
    authority, social trust, and practiced skill.

## Audit-local claim register

| Claim | Status | Evidence basis | Central disposition |
| --- | --- | --- | --- |
| LIS-CL-01 contextual traces need interpretable capture boundaries | plausible | ISO 15489 | P-003/P-013/C014 |
| LIS-CL-02 provenance is lineage, not validation | established | ISAD(G), PROV-O | C014/C019 |
| LIS-CL-03 metadata depth is allocation | plausible | MPLP | P-001/C018 |
| LIS-CL-04 functional appraisal may improve shifted future-query value | speculative | macroappraisal plus proposed E-LIS-1 | P-001/P-012/C018 |
| LIS-CL-05 retention needs trigger, hold, derivation, and execution evidence | established | ISO 15489 | P-009/P-012/C020 |
| LIS-CL-06 fixity is not authenticity or truth | established | BagIt, PREMIS | P-009/C009 |
| LIS-CL-07 long-lived memory is interpreter-dependent | plausible | OAIS | C014/C017 |
| LIS-CL-08 registered-use migration is falsifiable but incomplete | speculative | OAIS/PREMIS plus E-LIS-1 | C014/C017 |
| LIS-CL-09 replica diversity requires measured failure domains | established | LOCKSS | P-004/P-009 |
| LIS-CL-10 entity resolution should be versioned separately from claims | plausible | MARC authority, ORCID | C014/C015 |
| LIS-CL-11 identity levels can prevent invalid evidence inheritance | plausible | IFLA LRM | P-008/C014 |
| LIS-CL-12 concept mediation should expose drift and uncertainty | plausible | SKOS, NISO, Tennis | C014/C015 |
| LIS-CL-13 facets are a mature compositional retrieval mechanism | established | Colon Classification | P-008/C015 |
| LIS-CL-14 relevance ranking is not epistemic confidence | established | probabilistic IR | P-001/P-007 |
| LIS-CL-15 feedback should update versioned query state with rollback | plausible | relevance feedback | P-003/P-007 |
| LIS-CL-16 evolving needs warrant versioned uncertainty | plausible | ASK, question negotiation, berrypicking | P-002/P-007/C007 |
| LIS-CL-17 citation topology is a conditional biased signal | established | citation/metrics literature | P-001/C009 |
| LIS-CL-18 graph form does not establish complete or true knowledge | established | ontology/OWL specifications | P-008/P-013/C014 |
| LIS-CL-19 FAIRness is not correctness or ethical reuse | established | FAIR, PROV-O | C014/C019 |
| LIS-CL-20 continuity requires tested capability, not record count | plausible | organizational learning studies | C019 |

## Conservative verdict

This field strongly supports building explicit, durable interpretation
contracts around AI evidence and artifacts. It does **not** support inventing a
new “archival intelligence” layer by renaming databases, retrieval, knowledge
graphs, checksums, or documentation.

The next defensible step is E-LIS-1. Until it demonstrates a held-out,
equal-budget advantage, the designated-community/query-registry refinement
stays inside Candidate 017. M10/M12 belong to Candidates 014/015, M03–M05 to
Candidate 018, and M19/M20 to Candidate 019. All other mechanisms are mature
engineering nulls or refinements of existing principles.

## Audit-local bibliography

The entries below are complete for every bracketed citation key in this audit. They
remain audit-local until a claim is adopted into the central ledger.

```bibtex
@techreport{iso15489,
  author       = {{International Organization for Standardization}},
  title        = {Information and documentation---Records management---Part 1: Concepts and principles},
  institution  = {International Organization for Standardization},
  number       = {ISO 15489-1:2016},
  edition      = {2},
  year         = {2016},
  url          = {https://www.iso.org/standard/62542.html}
}

@manual{isadg2000,
  author       = {{International Council on Archives}},
  title        = {{ISAD(G)}: General International Standard Archival Description},
  edition      = {2},
  year         = {2000},
  isbn         = {978-0-9696035-5-9},
  url          = {https://www.ica.org/app/uploads/2024/01/CBPS_2000_Guidelines_ISADG_Second-edition_EN.pdf}
}

@article{greene2005mplp,
  author       = {Greene, Mark A. and Meissner, Dennis},
  title        = {More Product, Less Process: Revamping Traditional Archival Processing},
  journal      = {The American Archivist},
  volume       = {68},
  number       = {2},
  pages        = {208--263},
  year         = {2005},
  doi          = {10.17723/aarc.68.2.c741823776k65863}
}

@article{cook2004macro,
  author       = {Cook, Terry},
  title        = {Macro-appraisal and functional analysis: documenting governance rather than government},
  journal      = {Journal of the Society of Archivists},
  volume       = {25},
  number       = {1},
  pages        = {5--18},
  year         = {2004},
  doi          = {10.1080/0037981042000199106}
}

@techreport{ccsds2024oais,
  author       = {{Consultative Committee for Space Data Systems}},
  title        = {Reference Model for an Open Archival Information System ({OAIS})},
  institution  = {CCSDS},
  number       = {CCSDS 650.0-M-3},
  edition      = {Issue 3},
  year         = {2024},
  url          = {https://ccsds.org/searchpubs/entry/3054/}
}

@manual{premis30,
  author       = {{PREMIS Editorial Committee}},
  title        = {{PREMIS} Data Dictionary for Preservation Metadata, Version 3.0},
  organization = {Library of Congress},
  year         = {2015},
  url          = {https://www.loc.gov/standards/premis/v3/premis-3-0-final.pdf}
}

@techreport{rfc8493,
  author       = {Kunze, John and Littman, Justin and Madden, Liz and Scancella, John and Adams, Chris},
  title        = {The {BagIt} File Packaging Format (V1.0)},
  institution  = {Internet Engineering Task Force},
  number       = {RFC 8493},
  year         = {2018},
  doi          = {10.17487/RFC8493},
  url          = {https://www.rfc-editor.org/rfc/rfc8493.html}
}

@article{maniatis2005lockss,
  author       = {Maniatis, Petros and Roussopoulos, Mema and Giuli, T. J. and Rosenthal, David S. H. and Baker, Mary},
  title        = {The {LOCKSS} Peer-to-Peer Digital Preservation System},
  journal      = {ACM Transactions on Computer Systems},
  volume       = {23},
  number       = {1},
  pages        = {2--50},
  year         = {2005},
  doi          = {10.1145/1047915.1047917}
}

@manual{marc21authority,
  author       = {{Library of Congress, Network Development and MARC Standards Office}},
  title        = {{MARC 21} Format for Authority Data},
  year         = {1999},
  note         = {Updated through Update No. 42, May 2026},
  url          = {https://www.loc.gov/marc/authority/}
}

@manual{ifla2017lrm,
  author       = {{IFLA FRBR Review Group}},
  title        = {{IFLA} Library Reference Model: A Conceptual Model for Bibliographic Information},
  organization = {International Federation of Library Associations and Institutions},
  year         = {2017},
  note         = {As amended and corrected through December 2017},
  url          = {https://repository.ifla.org/handle/20.500.14598/40}
}

@techreport{niso2010z3919,
  author       = {{National Information Standards Organization}},
  title        = {Guidelines for the Construction, Format, and Management of Monolingual Controlled Vocabularies},
  institution  = {National Information Standards Organization},
  number       = {ANSI/NISO Z39.19-2005 (R2010)},
  year         = {2010},
  doi          = {10.3789/ansi.niso.z39.19-2005R2010}
}

@techreport{skos2009,
  author       = {Miles, Alistair and Bechhofer, Sean},
  title        = {{SKOS} Simple Knowledge Organization System Reference},
  institution  = {World Wide Web Consortium},
  type         = {W3C Recommendation},
  year         = {2009},
  url          = {https://www.w3.org/TR/skos-reference/}
}

@article{tennis2006versioning,
  author       = {Tennis, Joseph T.},
  title        = {Versioning Concept Schemes for Persistent Retrieval},
  journal      = {Bulletin of the American Society for Information Science and Technology},
  volume       = {32},
  number       = {5},
  pages        = {13--16},
  year         = {2006},
  doi          = {10.1002/bult.2006.1720320506}
}

@article{haak2012orcid,
  author       = {Haak, Laurel L. and Fenner, Martin and Paglione, Laura and Pentz, Ed and Ratner, Howard},
  title        = {{ORCID}: a system to uniquely identify researchers},
  journal      = {Learned Publishing},
  volume       = {25},
  number       = {4},
  pages        = {259--264},
  year         = {2012},
  doi          = {10.1087/20120404}
}

@book{ranganathan1933colon,
  author       = {Ranganathan, S. R.},
  title        = {Colon Classification},
  publisher    = {Madras Library Association},
  address      = {Madras},
  year         = {1933}
}

@article{robertson1976relevance,
  author       = {Robertson, Stephen E. and Sparck Jones, Karen},
  title        = {Relevance weighting of search terms},
  journal      = {Journal of the American Society for Information Science},
  volume       = {27},
  number       = {3},
  pages        = {129--146},
  year         = {1976},
  doi          = {10.1002/asi.4630270302}
}

@article{salton1990feedback,
  author       = {Salton, Gerard and Buckley, Chris},
  title        = {Improving retrieval performance by relevance feedback},
  journal      = {Journal of the American Society for Information Science},
  volume       = {41},
  number       = {4},
  pages        = {288--297},
  year         = {1990},
  doi          = {10.1002/(SICI)1097-4571(199006)41:4<288::AID-ASI8>3.0.CO;2-H}
}

@article{taylor1968question,
  author       = {Taylor, Robert S.},
  title        = {Question-Negotiation and Information Seeking in Libraries},
  journal      = {College \& Research Libraries},
  volume       = {29},
  number       = {3},
  pages        = {178--194},
  year         = {1968},
  doi          = {10.5860/crl_29_03_178}
}

@article{belkin1982ask,
  author       = {Belkin, Nicholas J. and Oddy, Robert N. and Brooks, Helen M.},
  title        = {{ASK} for Information Retrieval: Part I. Background and Theory},
  journal      = {Journal of Documentation},
  volume       = {38},
  number       = {2},
  pages        = {61--71},
  year         = {1982},
  doi          = {10.1108/eb026722}
}

@article{bates1989berrypicking,
  author       = {Bates, Marcia J.},
  title        = {The design of browsing and berrypicking techniques for the online search interface},
  journal      = {Online Review},
  volume       = {13},
  number       = {5},
  pages        = {407--424},
  year         = {1989},
  doi          = {10.1108/eb024320}
}

@article{garfield1955citation,
  author       = {Garfield, Eugene},
  title        = {Citation Indexes for Science: A New Dimension in Documentation through Association of Ideas},
  journal      = {Science},
  volume       = {122},
  number       = {3159},
  pages        = {108--111},
  year         = {1955},
  doi          = {10.1126/science.122.3159.108}
}

@article{brin1998anatomy,
  author       = {Brin, Sergey and Page, Lawrence},
  title        = {The Anatomy of a Large-Scale Hypertextual Web Search Engine},
  journal      = {Computer Networks and ISDN Systems},
  volume       = {30},
  number       = {1--7},
  pages        = {107--117},
  year         = {1998},
  doi          = {10.1016/S0169-7552(98)00110-X}
}

@article{merton1968matthew,
  author       = {Merton, Robert K.},
  title        = {The Matthew Effect in Science},
  journal      = {Science},
  volume       = {159},
  number       = {3810},
  pages        = {56--63},
  year         = {1968},
  doi          = {10.1126/science.159.3810.56}
}

@article{seglen1997impact,
  author       = {Seglen, Per O.},
  title        = {Why the impact factor of journals should not be used for evaluating research},
  journal      = {BMJ},
  volume       = {314},
  number       = {7079},
  pages        = {497--502},
  year         = {1997},
  doi          = {10.1136/bmj.314.7079.497}
}

@article{hicks2015leiden,
  author       = {Hicks, Diana and Wouters, Paul and Waltman, Ludo and de Rijcke, Sarah and Rafols, Ismael},
  title        = {Bibliometrics: The Leiden Manifesto for research metrics},
  journal      = {Nature},
  volume       = {520},
  pages        = {429--431},
  year         = {2015},
  doi          = {10.1038/520429a}
}

@techreport{prov2013,
  author       = {Lebo, Timothy and Sahoo, Satya and McGuinness, Deborah},
  title        = {{PROV-O}: The {PROV} Ontology},
  institution  = {World Wide Web Consortium},
  type         = {W3C Recommendation},
  year         = {2013},
  url          = {https://www.w3.org/TR/prov-o/}
}

@techreport{owl22012,
  author       = {Motik, Boris and Patel-Schneider, Peter F. and Parsia, Bijan},
  title        = {{OWL 2} Web Ontology Language Structural Specification and Functional-Style Syntax (Second Edition)},
  institution  = {World Wide Web Consortium},
  type         = {W3C Recommendation},
  year         = {2012},
  url          = {https://www.w3.org/TR/owl2-syntax/}
}

@article{gruber1993ontology,
  author       = {Gruber, Thomas R.},
  title        = {A translation approach to portable ontology specifications},
  journal      = {Knowledge Acquisition},
  volume       = {5},
  number       = {2},
  pages        = {199--220},
  year         = {1993},
  doi          = {10.1006/knac.1993.1008}
}

@article{wilkinson2016fair,
  author       = {Wilkinson, Mark D. and others},
  title        = {The {FAIR} Guiding Principles for scientific data management and stewardship},
  journal      = {Scientific Data},
  volume       = {3},
  pages        = {160018},
  year         = {2016},
  doi          = {10.1038/sdata.2016.18}
}

@article{walsh1991memory,
  author       = {Walsh, James P. and Ungson, Gerardo Rivera},
  title        = {Organizational Memory},
  journal      = {Academy of Management Review},
  volume       = {16},
  number       = {1},
  pages        = {57--91},
  year         = {1991},
  doi          = {10.5465/amr.1991.4278992}
}

@article{brown1991communities,
  author       = {Brown, John Seely and Duguid, Paul},
  title        = {Organizational Learning and Communities-of-Practice: Toward a Unified View of Working, Learning, and Innovation},
  journal      = {Organization Science},
  volume       = {2},
  number       = {1},
  pages        = {40--57},
  year         = {1991},
  doi          = {10.1287/orsc.2.1.40}
}

@article{szulanski1996stickiness,
  author       = {Szulanski, Gabriel},
  title        = {Exploring internal stickiness: Impediments to the transfer of best practice within the firm},
  journal      = {Strategic Management Journal},
  volume       = {17},
  number       = {S2},
  pages        = {27--43},
  year         = {1996},
  doi          = {10.1002/smj.4250171105}
}
```

## Validation checklist

- [x] Twenty mechanism cards state native contract, boundary/units/timescale,
      transfer, exact owner/null, equal-budget falsification, negative transfer,
      and an audit-local claim.
- [x] All 13 principles and all 20 candidates are deduplicated explicitly.
- [x] Database/storage, fault-tolerance, version-control/schema, IR, graph, and
      preservation nulls are named before any residual.
- [x] Equations define symbols and distinguish counts, time, bytes, energy,
      labour, probabilities, and task/currency losses.
- [x] Every quantitative comparison is an experimental requirement, not an
      unsupported performance claim.
- [x] All bracketed citation keys resolve to the audit-local BibTeX block.
- [x] No Google/Gemini provenance record is treated as evidence.
- [x] No central principle, candidate, claim, or bibliography file is modified.

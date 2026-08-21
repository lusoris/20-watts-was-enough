# Textual criticism and variant traditions

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-21
- **Field coverage:** literature, philology, bibliography, scholarly editing,
  manuscript studies, genetic criticism, translation studies, and computational
  stemmatology
- **Scope:** witnesses and readings, recension and stemmata, contamination,
  critical apparatus, conjectural emendation, authorial revision, translation
  and interpretation plurality, edition provenance, uncertainty, and the
  boundary between a reconstructed text and historical ground truth
- **Evidence rule:** documentary witnesses establish only their own recorded
  states under a transcription and identification process; an edition, stemma,
  translation, or interpretation is a qualified scholarly construction. Literary
  narrative and interpretive arguments do not establish cognitive or biological
  mechanisms.
- **Promotion state:** no new principle or candidate; one hostile evaluation
  contract and one narrow refinement to Candidate 017

## Executive finding

Textual criticism contributes a mature answer to a systems problem that the
repository has only partly represented: several damaged, revised, translated,
copied, and mutually dependent records may all be evidence about a work without
any one record being the work's unique ground truth.

The field's durable contribution is a **witness–variant–edition contract**:

1. identify each physical or digital witness before comparing its readings;
2. keep observed inscription, transcription, normalized token, collated reading,
   adopted lemma, conjecture, translation, and interpretation as different types;
3. retain the versioned editorial objective and inclusion policy;
4. represent a stemma as a tested lineage hypothesis, including lost nodes,
   local ancestry, contamination, and uncertainty;
5. preserve rejected and minority readings in a reconstructible apparatus rather
   than overwriting them with the selected reading;
6. treat authorial revision, scribal intervention, printing, censorship,
   translation, and physical damage as rival change processes, not as one generic
   corruption label;
7. state what a critical text is intended to reconstruct—an earliest recoverable
   form, one documentary state, an authorial stage, a reading text, or something
   else; and
8. never score a reconstruction against unknowable historical truth in a real
   tradition. Exact recovery accuracy is available only for controlled or
   synthetic traditions with a sealed known history.

This is not a new abstract principle. The contract composes temporary proposal
state, diversity retention, modular evidence, maintenance/invalidation,
lifetime-qualified memory, and externalized shared state already represented by
[P-003](../principle-registry.md#p-003--temporary-trace-before-commitment),
[P-004](../principle-registry.md#p-004--diversity-selection-and-protection),
[P-008](../principle-registry.md#p-008--compartmentalized-interaction),
[P-009](../principle-registry.md#p-009--maintenance-plane),
[P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime),
and [P-013](../principle-registry.md#p-013--externalized-shared-state).

The strongest residue is an evaluation overlay for
[Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md),
[Candidate 017](../../experiments/candidates/017-contract-preserving-semantic-compaction.md),
and [Candidate 019](../../experiments/candidates/019-audited-cumulative-inheritance.md).
Candidate 017 receives the only codebase change because selective apparatus is a
direct, field-tested case of query-qualified semantic compaction. Candidates 014
and 019 already carry the required observation, lineage, and turnover boundaries.

## Audit propositions

The `TEXT-` identifiers are local to this audit. They are not central claim IDs.

| ID | Status | Scoped proposition | Evidence boundary |
| --- | --- | --- | --- |
| `TEXT-01` | established practice | A textual tradition can contain multiple identifiable witnesses and multiple readings at one locus; a critical apparatus records a declared selection or collection of those readings. | Witness inventory and collation do not determine which reading an editor should adopt. |
| `TEXT-02` | established technical standard | TEI distinguishes apparatus entries, lemmas, readings, witnesses, witness details, hands, responsibility, certainty, fragments, and lacunae, and supports several apparatus-linking methods. | TEI provides a representation vocabulary; valid markup does not prove transcription accuracy, lineage, or editorial judgment. |
| `TEXT-03` | established methodological boundary | A base or copy text is an editorial instrument whose authority is purpose- and feature-qualified, not an automatic historical original. | Greg's rationale is one influential editorial theory, not a universal rule for every textual tradition. |
| `TEXT-04` | plausible and testable | Genealogical structure can reduce redundant witness evidence and help explain shared innovations. | A fitted stemma remains a model conditional on collation, variant selection, change assumptions, rooting, missing witnesses, and survival. |
| `TEXT-05` | established failure mode | Contamination—copying from more than one exemplar, comparison with another witness, or memory-mediated admixture—violates a simple one-parent tree model. | Not every conflicting variant proves contamination; recurrent change, reversal, collation error, and lost intermediaries are alternatives. |
| `TEXT-06` | empirically supported but narrow | On artificial benchmark traditions, computational stemmatic methods can be compared against known genealogy, and method performance varies. | Artificial copying tasks do not calibrate reconstruction accuracy for all historical languages, genres, scribal cultures, or preservation regimes. |
| `TEXT-07` | empirically supported but narrow | In three artificial traditions, expert selection of variants for genealogical significance was often not better than random selection. | This does not show that philological expertise is useless for transcription, dating, material analysis, interpretation, or every tradition. |
| `TEXT-08` | established editorial distinction | A conjectural emendation is proposed by an editor rather than attested by a witness and must retain responsibility and uncertainty. | A plausible or widely accepted conjecture does not become witness evidence by repetition in later editions. |
| `TEXT-09` | established scholarly object distinction | Drafts, cancellations, additions, proofs, and revised editions can represent stages of authorial or collaborative revision rather than corrupt copies of one fixed final object. | Temporal order, agency, and intention may remain uncertain; physical sequence does not automatically establish motive. |
| `TEXT-10` | established bibliographic model | A translation or revision is a derived expression with its own identity and source relation; a translation may itself derive from an intermediary translation. | The work/expression model organizes identity and derivation; it does not rank fidelity or settle interpretation. |
| `TEXT-11` | plausible evaluative boundary | Translation and literary interpretation can admit several purpose-qualified outputs; evaluation must name source expression, audience, purpose, constraints, and evaluator. | Plurality does not make every output adequate, nor does agreement among readers establish historical authorial intent. |
| `TEXT-12` | established preservation boundary | A selective or normalized apparatus can answer registered comparison questions while losing spelling, layout, hand, material, sequence, or omitted-variant evidence needed by later questions. | Complete retention is not free; the correct comparison is against full witnesses, ordinary archives, and declared query contracts at matched lifecycle cost. |
| `TEXT-13` | established inference boundary | Provenance can show which witnesses, transcriptions, rules, and scholars contributed to an edition; it cannot by itself establish the truth of the adopted reading. | Missing provenance weakens auditability, while complete provenance still leaves substantive disagreement possible. |
| `TEXT-14` | established identifiability boundary | For most real historical traditions, the original copying history and lost readings are unobserved; several histories may explain the surviving witnesses. | Ground-truth recovery metrics require controlled copying, synthetic generation, or exceptional independent documentation. |

## What counts as evidence

The field is useful precisely because it does not treat every text-like object as
the same kind of evidence.

| Object | Directly records | Does not directly establish |
| --- | --- | --- |
| physical witness or image | a surviving material state under preservation and imaging conditions | its exemplar, date, hand, completeness, or relationship to every other witness |
| diplomatic transcription | an editor's encoded reading of one witness with declared conventions | a unique source text or error-free decipherment |
| normalized transcription | selected linguistic equivalences under a normalization policy | which graphical or orthographic differences were historically insignificant |
| collation | aligned similarity and difference under tokenization and alignment versions | direction of copying or whether a difference is authorial, scribal, mechanical, or accidental |
| stemma or transmission network | a hypothesis about copying or dependence among witnesses | the complete history, a unique root, or the text of lost nodes |
| lemma or adopted reading | the reading selected under an editorial objective and rule | direct attestation when it is eclectic or conjectural |
| critical apparatus | included variants, witnesses, responsibility, and notes under an apparatus policy | every omitted feature, variant, or future interpretation |
| genetic dossier | documents ordered or related as stages of writing and revision | a unique mental sequence, motive, or final intention |
| translation | a target-language expression derived from a named or inferred source expression | token identity, unique equivalence, or automatic superiority over other translations |
| interpretation | a reasoned claim by an identified interpreter under a context and evidence set | authorial intention, reader consensus, or a cognitive mechanism merely because the reading is persuasive |

Three separations are non-negotiable:

- **attestation is not adoption:** a reading can be physically attested and still
  be rejected for a declared edition; an adopted conjecture can be unattested;
- **genealogy is not truth:** ancestry can explain dependence and redundancy but
  does not mechanically select a reading at every locus; and
- **edition is not event history:** a critical text is an output of an editorial
  function over surviving evidence, not a replay of every historical state.

## Witnesses, readings, and the critical apparatus

The TEI P5 critical-apparatus module is an authoritative technical baseline. It
defines structured apparatus entries and separates a selected lemma (`lem`) from
alternative readings (`rdg`), associates readings with witnesses, supports
witness details, and records fragment and lacuna boundaries. It also distinguishes
three ways of linking apparatus entries to text: location reference, double-end-
point attachment, and parallel segmentation. Parallel segmentation does not
require one base text.

TEI explicitly asks editors to decide:

- whether to represent most or all witnesses or only a selection;
- which level of difference counts as a separate reading;
- whether an edition uses a particular witness as base or constructs an ideal or
  original text;
- how conjectures differ from witness readings; and
- which kinds of variation—orthographic, morphological, lexical, material—are
  recorded.

Those are model decisions, not serialization details. A machine-readable
apparatus must therefore version both the content and the editorial declaration.
A valid TEI document may still encode a mistaken transcription, omit a decisive
witness, flatten overlapping revisions, or embody a contested edition policy.

The following types remain distinct:

```text
WitnessReading(witness_id, locus, inscription_state)
TranscribedReading(transcription_id, witness_reading, responsibility, certainty)
NormalizedReading(normalization_id, transcribed_reading, equivalence_rule)
CollatedReading(collation_id, normalized_or_diplomatic_reading, alignment_locus)
AdoptedLemma(edition_id, locus, reading_or_conjecture, rationale)
Conjecture(editor_id, locus, proposed_form, evidence, certainty)
```

An edition that serializes all six as an untyped `text` field destroys the
central evidence boundary.

## Recension and stemmatic hypotheses

Let $W=\{w_1,\ldots,w_n\}$ be surviving witnesses and let $r_{ij}$ be the
transcribed reading for witness $i$ at collated locus $j$. A stemmatic method
receives neither the historical copying events nor the lost witnesses directly.
It receives a versioned observation matrix

$$
R_v=(r_{ij};T_v,N_v,C_v),
$$

where $T_v$ is the transcription state, $N_v$ the tokenization and normalization
policy, and $C_v$ the collation/alignment. It proposes a graph $G$ and change
model $M$:

$$
(G^*,M^*)\in
\operatorname*{arg\,max}_{G\in\mathcal G_v,M\in\mathcal M_v}
S(R_v\mid G,M),
$$

where $S$ is the named likelihood, parsimony, compatibility, distance, or other
criterion. The result is qualified by the searched graph family
$\mathcal G_v$, change-model family $\mathcal M_v$, score, rooting rule,
variant weights, and search budget.

The robust output is an equivalence set or uncertainty distribution where the
data do not identify one history. Bootstrap support, posterior probability, or
compatibility under one model is not a probability that the proposed history is
the complete historical truth unless an explicit generative and sampling model
justifies that interpretation.

Roos and Heikkilä compared computer-assisted stemmatic methods on artificial
benchmark traditions with known histories and found material performance
differences. Andrews and Macé developed graph representations that keep variant
relationships available and showed that the genealogical usefulness of variant
classes depends on the tradition. Andrews later found that human classification
of genealogically significant variants was often no better than random for most
of three artificial traditions. Together these results justify benchmarking and
human–machine challenge sets; they do not justify replacing philology with one
universal phylogenetic algorithm.

## Contamination and local ancestry

A rooted tree assumes that each copied witness has one immediate exemplar. A
contaminated witness can draw readings from several sources, compare exemplars,
or import a remembered reading. Let $z_{ij}$ name the source lineage used by
witness $i$ at locus or block $j$. Under a strict tree,

$$
z_{ij}=\operatorname{parent}(w_i)\quad\text{for all }j.
$$

Under contamination,

$$
z_{ij}\in\operatorname{Parents}(w_i),
\qquad |\operatorname{Parents}(w_i)|\ge 2
$$

for at least some loci. A single global parent can then be a misleading summary.
The appropriate candidate may be a directed acyclic graph, network, local stemma,
or mixture model with block- or locus-qualified ancestry.

Hoenen formalizes contamination as an open problem for computational
stemmatology and gives a graph-theoretic model that permits admixture while
retaining temporal order. The engineering transfer is narrow but important:
branch/merge history cannot be inferred safely by forcing every artifact into a
tree. The evaluator must test a tree against recurrent-change, reversal,
transcription-error, and network alternatives before promoting an edge.

Contamination also creates evidence dependence. Ten witnesses that copied one
contaminated intermediary are not ten independent confirmations. Witness count,
genealogical family count, local-ancestry count, and material-source count remain
separate denominators.

## Critical text as an editorial output

At locus $j$, a selected edition reading can be represented as

$$
e_j=A_{\pi,v}
\left(R_{v,j},G_v,H_v,Q_v\right),
$$

where:

- $R_{v,j}$ is the versioned set of readings and attestations;
- $G_v$ is the current stemmatic or dependence hypothesis;
- $H_v$ contains palaeographic, linguistic, bibliographic, and historical
  evidence;
- $Q_v$ is uncertainty and unresolved alternatives; and
- $A_{\pi,v}$ is the editorial rule under objective $\pi$ and version $v$.

$e_j$ is therefore an output of a declared operation. It may coincide with one
witness, combine readings from several witnesses, or be conjectured. The editor
must expose which case applies.

Greg's copy-text rationale is historically important because it rejects absolute
authority for one witness and differentiates the use of a base text across kinds
of features. Later editorial theories debate authorial intention, social
production, document-centered editing, and fluid texts. The repository does not
choose one school. It requires the edition to state its target:

```text
documentary transcription
diplomatic edition
earliest reconstructible form under a stated stemma
authorial draft or revision stage
first or later authorized publication state
eclectic critical text under a declared rule
reader-oriented normalized text
synoptic or variorum presentation
translation for a named purpose and audience
```

Changing the target can change the selected reading without changing the
underlying evidence. An edition disagreement may therefore be a policy
disagreement, an evidence disagreement, or both.

## Conjectural emendation

Conjecture is a proposal operation used when surviving readings appear corrupt,
incomplete, or otherwise inadequate under an editorial objective. TEI supports
separate responsibility and certainty for editorial correction and advises
distinguishing witness readings from modern conjectures.

The machine rule is simple:

$$
\operatorname{Attested}(x,w)\ne\operatorname{Proposed}(x,e).
$$

No number of downstream citations, editions, model completions, or training
occurrences may silently convert `Proposed` into `Attested`. A later edition can
itself become a witness to its own published state, but its repetition of an
earlier conjecture is not independent evidence that a lost historical witness
contained that reading.

Every conjecture records:

- locus and exact proposed form;
- proposer, date, and edition version;
- surviving readings and material state;
- linguistic, metrical, palaeographic, historical, or contextual rationale;
- considered alternatives;
- confidence or explicit non-probabilistic uncertainty vocabulary;
- tests that could reject or strengthen it; and
- all downstream editions, translations, interpretations, or model artifacts
  that adopted it.

## Authorial revision and genetic criticism

Repeated difference is not synonymous with copying error. Drafts, marginal
changes, fair copies, proofs, editions, and adaptations can preserve deliberate
revision by an author or collaborator. Genetic criticism treats the dossier and
the writing process as scholarly objects rather than reducing every stage to a
defective precursor of one final text.

Bryant's *Fluid Text* presents revision and adaptation as meaningful records of
the interactions among artist, collaborators, institutions, and audiences. Van
Hulle and collaborators show that computer-supported collation of modern
manuscripts must represent in-document revision layers as well as differences
among documents. Miglietti demonstrates that interpretation of multiply revised
works can depend on diachronic context.

The safe system translation is not a claim about how creativity works. It is a
typed change record:

```text
document_or_witness
material_layer_or_hand
change_locus_and_before_after_state
operation_add_delete_substitute_transpose_restore
relative_or_absolute_time_support
agent_attribution_and_certainty
declared_or_inferred_revision_relation
production_publication_and_reception_context
alternative_orderings_or_agents
source_images_and_transcription_version
```

When order or agency is uncertain, the record retains a partial order or rival
graphs. It does not manufacture a total creative sequence. A last surviving
version is not automatically a final intention, and a first printed version is
not automatically the unique work.

## Translation and interpretation plurality

The IFLA Library Reference Model provides a useful authoritative identity
boundary. A translation or revision creates a new expression of a work, and the
derivation relation may identify another expression as its source. IFLA's own
examples include a translation derived through an intermediary translation.

For translation record $x$, retain

$$
X=(W,E_s,E_t,L_s,L_t,D,P,A,C,V),
$$

where $W$ is work identity, $E_s$ and $E_t$ are source and target expressions,
$L_s$ and $L_t$ are languages, $D$ is the derivation chain, $P$ the translation
purpose or specification, $A$ the intended audience, $C$ contextual constraints,
and $V$ the version and responsible agents. These are identifiers or typed
records, not physical quantities.

Melby and colleagues' specification approach to translation-quality assessment
emphasizes parameters external to the source text, including audience and
purpose. That supports a qualified comparison rather than the rule “any
translation is valid.” Literal accuracy, terminology, meter, register,
readability, performability, cultural explanation, and documentary fidelity can
conflict. A test must declare which are required.

Literary interpretation is still less reducible to one target string. The
repository may store multiple interpretations with evidence spans, reasoning,
context, method, interpreter, counter-readings, and uncertainty. It may evaluate
citation fidelity, internal consistency, task usefulness, reception, or expert
judgment under a declared protocol. It must not infer neural mechanisms from a
narrative pattern or convert evaluator agreement into authorial intent.

## Apparatus as query-qualified compaction

A printed apparatus is a compact representation of a larger witness tradition.
Its utility depends on what it retains and what readers later need to ask. Berti
describes the apparatus as the place where significant variations justify and
make transparent a constituted text. Tarrant emphasizes that apparatuses vary
in what they include and require an edition-specific preface and conventions.
TEI likewise permits selected rather than exhaustive witness and variant
representation.

Let $H$ be full authorized witness images, transcriptions, material metadata,
and revision state, and let $Z=A_{\pi,v}(H)$ be an apparatus under policy
$A_{\pi,v}$. For registered query family $\mathcal Q$, require

$$
\Pr_{q\sim\mathcal D_Q}
\left[d_q(q(H),q(Z))>\epsilon_q\right]\le\delta_Q,
$$

while separately reporting evidence reachability, witness reconstruction,
uncertainty preservation, and source-recovery requests. The apparatus must not
claim preservation for hidden questions about features its editorial policy
discarded.

The difficult tests are cross-purpose:

- an apparatus normalized spelling as insignificant, then a later dialect or
  scribal-hand query needs the original forms;
- several subvariants were grouped under one regularized reading, then a local-
  ancestry analysis needs their distribution;
- a base-text apparatus omitted agreement with the lemma, then witness
  reconstruction encounters a fragment or lacuna;
- transpositions were flattened by tabular alignment;
- additions, deletions, and overwritten layers were forced into one linear
  sequence; and
- source images or transcription conventions changed after publication.

This is a direct refinement of Candidate 017. The correct null is not an
unindexed pile of scans. It is a full versioned repository with TEI apparatus,
facsimile links, CollateX or equivalent collation, ordinary indexes, declared
editorial policy, source control, cold archive, and query-regression tests.

## Versioned witness–variant–edition record

For a tradition, store

$$
\mathcal T_v=(O_v,W_v,D_v,R_v,C_v,G_v,A_v,E_v,X_v,U_v),
$$

where:

- $O_v$ is work/tradition scope and editorial objective;
- $W_v$ is the witness inventory;
- $D_v$ is document, image, material, hand, and transcription state;
- $R_v$ is the locus and reading graph;
- $C_v$ is collation, tokenization, normalization, and alignment state;
- $G_v$ is the versioned stemma or transmission-network hypothesis;
- $A_v$ is apparatus scope and inclusion policy;
- $E_v$ is the adopted edition with typed conjectures and rationale;
- $X_v$ contains authorial revision, translation, and expression derivations;
  and
- $U_v$ contains uncertainty, responsibility, provenance, access, and
  invalidation state.

The minimum machine-readable record is:

```text
tradition_id_and_scope
work_expression_manifestation_item_identifiers_where_applicable
edition_objective_and_intended_use
witness_id_repository_shelfmark_or_artifact_hash
material_or_digital_carrier_and_extent
date_place_hand_language_script_and_support_intervals
image_capture_and_preservation_state
transcription_version_conventions_responsibility_and_certainty
locus_id_and_alignment_anchor
diplomatic_normalized_and_collated_reading_ids
attesting_witnesses_fragments_lacunae_and_witness_details
tokenization_normalization_equivalence_and_alignment_versions
variant_type_and_inclusion_or_omission_reason
stemma_or_network_version_rooting_edges_support_and_search_family
lost_or_hypothetical_nodes_and_local_ancestry
contamination_recurrent_change_reversal_and_error_alternatives
base_or_copy_text_and_feature_qualified_authority
adopted_lemma_attested_or_conjectural_status
editorial_rationale_alternatives_responsibility_and_uncertainty
authorial_or_collaborative_revision_stage_and_partial_order
translation_source_expression_purpose_audience_and_derivation_chain
apparatus_policy_registered_queries_and_reconstruction_contract
source_access_rights_retention_and_recovery_route
dependency_provenance_supersession_and_invalidation_edges
unresolved_disagreement_and_required_abstention
```

### Invalidation semantics

1. A corrected transcription invalidates dependent collations, variant
   classifications, local stemmata, adopted readings, and derived translations
   only along recorded dependency edges.
2. A newly found witness expands the evidence set. It can invalidate uniqueness
   or lineage claims without erasing the earlier edition as a historical object.
3. A new contamination edge narrows tree-based support and any independence
   count that depended on that tree.
4. A changed normalization or tokenization requires re-collation; it does not
   rewrite the underlying images or diplomatic readings.
5. A changed editorial objective produces a new edition decision, not a new
   witness fact.
6. A discovered source for a conjecture can reclassify its history only with
   evidence that the source actually attests the reading; repetition in a later
   edition is insufficient.
7. A new source-expression attribution changes affected translation lineage and
   comparison, not the target text's existence.
8. A representation migration that cannot reconstruct registered readings,
   witness membership, responsibility, or uncertainty fails closed and requests
   source recovery.

## Hostile workstation tests

The workstation suite uses open textual tools and synthetic or controlled
traditions. Real historical editions are external-validity cases, not a source of
omniscient answer labels.

### WT1 — clean tradition with sealed genealogy

Generate multiple copied witnesses from a sealed source through a registered
error process. Include lost intermediaries, fragments, lacunae, recurrent
spelling changes, transpositions, and unequal survival. Freeze transcription,
normalization, and alignment before revealing the genealogy.

Compare distance clustering, neighbor joining, maximum parsimony, a Bayesian or
likelihood tree where applicable, Stemmaweb-style graph analysis, human review,
and the full contract. Report edge precision/recall, rooted-tree distance, lost-
node claims, local reading reconstruction, calibration or support, abstention,
bytes, seconds, human minutes, and joules. Repeat across error regimes and
languages. No method receives the generator's change model for free.

### WT2 — contamination and false-tree confidence

Generate witnesses that switch exemplars by passage and occasionally import a
remembered reading. Cross contamination with recurrent innovation, reversal,
one bad transcription, and one lost common ancestor. Include a low-contamination
condition where a tree is an adequate approximation.

Compare strict-tree methods, split networks, DAG or mixture ancestry, local
stemmata, Hoenen-style contamination modeling, and explicit abstention at equal
search and review budgets. Report contamination detection, local-source
assignment, false unique tree, edge support miscalibration, family-count error,
downstream lemma changes, wall time, memory, reviewer time, and energy.

Kill the overlay if it calls every homoplasy contamination or cannot concede the
tree in the clean condition.

### WT3 — authorial revision versus copying error

Create dossiers in which some later differences are deliberate revisions,
others are scribal or mechanical changes, and some have ambiguous agency or
order. Cross final revision, abandoned revision, collaborative edit, censorship,
and typesetter intervention. Withhold complete documents and later release
material layers or dated proofs.

Report operation detection, agent and order calibration, false corruption,
false authorial attribution, partial-order coverage, inappropriate normalization,
and recovery after new evidence. A model fails deterministically if it silently
“corrects” every later version toward an assumed original.

### WT4 — selective apparatus under hidden future queries

Create full witness images/transcriptions, then publish:

1. the complete versioned repository;
2. a full TEI parallel-segmentation apparatus;
3. a selective base-text apparatus;
4. an extractive apparatus with source spans;
5. Candidate 017 compaction with a frozen query contract; and
6. a cold archive plus ordinary indexes and query regression.

After freezing, reveal questions about adopted text, witness reconstruction,
spelling, dialect, hand, correction layer, layout, local ancestry, translation
source, omitted readings, and conjecture responsibility. Measure query-native
accuracy, correct abstention, source-recovery success, evidence-link recall,
unreported loss, byte-years, restore seconds, curator/reviewer minutes, and
joules. A compact apparatus is credited only within its registered scope.

### WT5 — conjecture laundering

Seed a shared defective reading or lacuna and allow models or editors to propose
emendations. Publish one conjecture through several dependent editions,
translations, retrieval corpora, and training snapshots. Later add one genuinely
independent witness and one edition that merely copied the conjecture.

Score attested/proposed classification, responsibility, evidence-dependence
recovery, false independent support, uncertainty, invalidation, and propagation
latency. Repetition must not change proposal status. If the independent witness
attests the form, the system may add that new attestation without rewriting the
earlier conjecture's historical status.

### WT6 — tokenization and normalization trap

Cross abbreviation expansion, spelling normalization, punctuation, word
division, hyphenation, transposition, markup overlap, and damaged characters.
Provide several valid tokenizations and one adversarial alignment whose apparent
similarity changes the stemma.

Compare CollateX algorithms and comparators, diplomatic and normalized
collations, multi-version graphs, human-corrected alignment, and the full
contract. Report alignment error by operation, stemma sensitivity, recovered
transpositions, hidden-policy dependence, review work, and energy. A result that
is stable only after one unreported normalization is not robust.

### WT7 — translation derivation and qualified plurality

Construct source expressions with two direct translations, one translation of a
translation, one revision, and one target optimized for a different audience or
performative constraint. Give evaluators conflicting requirements for semantic
detail, terminology, meter/register, accessibility, and documentary form.

Report source-expression and derivation recovery, requirement satisfaction,
calibration, evaluator disagreement, false single-reference rejection, and
performance by purpose. The test does not accept every translation: planted
omissions, reversals, unsupported additions, and source misattribution remain
errors. It rejects only the fiction that one unqualified reference string is the
historical or interpretive ground truth.

### WT8 — edition recursion and survival bias

Allow earlier editions, quotations, translations, and anthologies to enter the
later witness inventory. Some copy surviving manuscripts; others copy an earlier
edition or a now-lost witness. Vary preservation and discovery probability by
age, material, region, prestige, and use.

Report source-family count, circular support, double counting, selection-model
sensitivity, false majority inference, uncertainty under missing witnesses, and
correct abstention. Raw frequency among surviving artifacts must not be reported
as original frequency or independent support without the relevant assumptions.

## Confirmatory design and cost boundary

The independent unit is a generated or controlled tradition with one sealed
production history. Witnesses, loci, variants, editions, and queries within a
tradition are dependent observations. Pair all arms on the same source texts,
copying and revision events, preservation, imaging, transcription opportunity,
query set, human-review allocation, and perturbation seeds.

Hold out complete traditions, languages or writing systems where feasible,
change regimes, contamination patterns, editorial objectives, query families,
and future discovery events. Random loci from one tradition cannot cross train
and confirmation partitions. Group translations, editions, datasets, and
training artifacts by derivation ancestry before splitting.

Preregister one primary contrast for each of WT1–WT8 and compare first against
the strongest applicable mature null. Use tradition-level hierarchical or
cluster-resampled uncertainty. Control multiplicity across methods and tracks;
retain rare conjecture-laundering, source-loss, and false-ground-truth outcomes
as separate hard gates.

The resource vector is

$$
B=(B_{\mathrm{hot}},B_{\mathrm{cold}},t_{\mathrm{cpu}},t_{\mathrm{gpu}},
t_{\mathrm{wall}},h_{\mathrm{editor}},h_{\mathrm{review}},E_{\mathrm{elec}},
N_{\mathrm{query}},N_{\mathrm{migration}}),
$$

where storage terms are bytes or byte-years, compute and wall terms are seconds,
human work is hours, electrical energy is joules, and counts are dimensionless.
Include imaging, transcription, collation, apparatus construction, source
storage, metadata, migration, reconstruction, review, failed analyses, and
archive restore. Do not claim efficiency by omitting the facsimiles or cold
archive that make later recovery possible.

For real traditions without known history, report predictive checks, stability,
agreement and disagreement among methods, held-out-witness prediction, response
to newly discovered evidence, and expert-audited error categories. Do not report
“original recovered: 93%” unless the original is independently known under the
declared unit.

## Mature null stack

Any system derived from this audit must beat the complete relevant composition:

1. repository-preserved witness images and diplomatic transcriptions with
   identifiers, checksums, access controls, and ordinary version control;
2. TEI P5 witness lists, critical apparatus, transcription, responsibility,
   certainty, fragment, lacuna, and revision markup;
3. CollateX or equivalent tokenization, normalization, alignment, variant graph,
   and TEI/GraphML export with human review;
4. established distance, parsimony, compatibility, likelihood/Bayesian,
   network, local-stemma, and contamination-aware analyses selected for the
   tradition;
5. full synoptic, variorum, documentary, diplomatic, genetic, or critical
   editions under a published editorial policy;
6. IFLA LRM-style work/expression/manifestation/item identity and expression
   derivation;
7. content-addressed provenance, dependency invalidation, schema migration,
   cold archive, and source recovery;
8. extractive summaries and apparatuses retaining cited source spans;
9. qualified human philological, palaeographic, codicological, linguistic,
   bibliographic, translation, and editorial review; and
10. Candidates 014, 017, and 019 without literary or biological terminology.

No language model, naive majority vote, one-reference text metric, unreviewed
OCR, forced phylogenetic tree, or plain summary is an adequate null.

## Failure modes and negative transfer

- **single-text collapse:** overwrite variants with one convenient reading;
- **attestation laundering:** treat a conjecture or copied edition as independent
  witness evidence;
- **tree coercion:** force contamination or branch/merge history into one-parent
  ancestry;
- **majority fallacy:** count dependent descendants as independent support;
- **survivor truth:** infer original prevalence from surviving or digitized
  artifacts without a preservation/discovery model;
- **normalization erasure:** discard spelling, hand, layout, punctuation, or
  material differences before future queries are known;
- **collation reification:** treat one tokenization/alignment as the text rather
  than a versioned analysis;
- **final-version bias:** classify deliberate early or intermediate stages as
  defective because a later version exists;
- **intent fabrication:** infer authorial motive from sequence alone;
- **reference tyranny:** reject qualified translations or interpretations only
  because they differ from one target string;
- **plurality nihilism:** use interpretive plurality to excuse demonstrable
  omission, contradiction, source error, or requirement failure;
- **apparatus omniscience:** claim that a selective apparatus preserves every
  future question;
- **provenance truth:** promote a reading because its lineage is complete;
- **synthetic overreach:** transfer recovery accuracy from artificial copying to
  every historical tradition; and
- **cognitive overreach:** present narrative structures, revision traces, or
  interpretations as direct evidence about neural creativity or memory.

## Promotion and kill conditions

No principle or architecture candidate is promoted by this audit.

Retain the evaluation overlay only if it catches reproducible type confusion,
false independence, false tree confidence, conjecture laundering, or silent
semantic loss beyond ordinary provenance fields, and if those detections change
a downstream decision on held-out traditions.

Retire the residual if:

- TEI, full witness retention, CollateX, version control, ordinary provenance,
  established stemmatic/network methods, and qualified review match every
  outcome at equal lifecycle cost;
- the candidate wins only by receiving more witnesses, images, transcription,
  normalization variants, review, storage, or source recovery;
- gains disappear after derivation families and editorial lineages are grouped;
- exact recovery is claimed on real material with no independently known history;
- the system cannot distinguish witness fact, transcription, collation, lineage
  hypothesis, adopted lemma, conjecture, translation, and interpretation;
- it cannot abstain when histories or readings are not identifiable;
- an apparatus cannot reconstruct its registered queries or request the retained
  source;
- interpretive plurality is collapsed into consensus or used to waive explicit
  task requirements; or
- storage, migration, review, restore, and energy costs erase the claimed gain.

## Exact repository routing

| Audit residue | Existing owner | Disposition |
| --- | --- | --- |
| typed witness, reading, conjecture, edition, and uncertainty state | Candidate 014 | already covered by versioned observation, provenance, alternative, and invalidation fields; use this audit as a domain fixture, no new candidate field required |
| selective apparatus as query-qualified compaction | Candidate 017 | add the witness/apparatus preservation track, complete mature null, WT4/WT6 perturbations, and rejection gate |
| branch/merge inheritance, derived editions, and turnover | Candidate 019 | existing source identity, lineage, branch/merge, historical-observation, schema-drift, and artifact-plus-tests tracks are sufficient; no edit |
| authorial revision and genetic dossier | Candidates 014 and 019 | retain partial orders, agent uncertainty, source layers, and derivation ancestry; no cognitive-mechanism claim |
| translation and interpretation plurality | Candidates 014 and 017 | record source expression, purpose, audience, evaluator, and retained alternatives; use qualified query outcomes rather than one ground-truth string |
| workstation implementation | future fixture or test package | implement WT1–WT8 only after central claims and bibliography entries are assigned by the repository maintainer |

## Primary scholarly and authoritative sources

### Technical standards and bibliographic identity

- Text Encoding Initiative Consortium, *TEI P5 Guidelines*, “Critical
  Apparatus,” current release, [authoritative specification](https://tei-c.org/release/doc/tei-p5-doc/en/html/TC.html).
- Text Encoding Initiative Consortium, *TEI P5 Guidelines*, “Representation of
  Primary Sources,” current release,
  [authoritative specification](https://tei-c.org/release/doc/tei-p5-doc/en/html/PH.html).
- Riva, P., Le Boeuf, P., and Žumer, M. (2024), *IFLA Library Reference Model:
  A Conceptual Model for Bibliographic Information*,
  [authoritative current standard](https://repository.ifla.org/handle/123456789/40).

### Stemmatology, collation, and contamination

- Roos, T. and Heikkilä, T. (2009), “Evaluating Methods for Computer-Assisted
  Stemmatology Using Artificial Benchmark Data Sets,”
  [DOI 10.1093/llc/fqp002](https://doi.org/10.1093/llc/fqp002).
- Andrews, T. L. and Macé, C. (2013), “Beyond the Tree of Texts: Building an
  Empirical Model of Scribal Variation through Graph Analysis of Texts and
  Stemmata,” [DOI 10.1093/llc/fqt032](https://doi.org/10.1093/llc/fqt032).
- Andrews, T. L. (2016), “Analysis of Variation Significance in Artificial
  Traditions Using Stemmaweb,”
  [DOI 10.1093/llc/fqu072](https://doi.org/10.1093/llc/fqu072).
- Hoenen, A. (2019), “An Open Problem in Computational Stemmatology—A Model for
  Contamination,”
  [DOI 10.6092/issn.2532-8816/8555](https://doi.org/10.6092/issn.2532-8816/8555).
- Schmidt, D. and Colomb, R. (2009), “A Data Structure for Representing
  Multi-version Texts Online,”
  [DOI 10.1016/j.ijhcs.2009.02.001](https://doi.org/10.1016/j.ijhcs.2009.02.001).
- Haentjens Dekker, R., Van Hulle, D., Middell, G., Neyt, V., and van Zundert,
  J. (2015), “Computer-Supported Collation of Modern Manuscripts: CollateX and
  the Beckett Digital Manuscript Project,”
  [DOI 10.1093/llc/fqu007](https://doi.org/10.1093/llc/fqu007).
- Interedition, *CollateX: Software for Collating Textual Sources*,
  [official documentation](https://collatex.net/doc/).

### Editing, apparatus, and revision

- Greg, W. W. (1950–1951), “The Rationale of Copy-Text,” *Studies in
  Bibliography* 3: 19–36,
  [stable JSTOR record](https://www.jstor.org/stable/40381874).
- Berti, M. (2019), “Digital Classical Philology and the Critical Apparatus,”
  [DOI 10.1515/9783110599572-012](https://doi.org/10.1515/9783110599572-012).
- Tarrant, R. (2016), “Reading a Critical Apparatus,” in *Texts, Editors, and
  Readers*, [DOI 10.1017/CBO9780511805165.011](https://doi.org/10.1017/CBO9780511805165.011).
- Bryant, J. L. (2002), *The Fluid Text: A Theory of Revision and Editing for
  Book and Screen*, [DOI 10.3998/mpub.12024](https://doi.org/10.3998/mpub.12024).
- Miglietti, S. (2014), “Meaning in a Changing Context: Towards an
  Interdisciplinary Approach to Authorial Revision,”
  [DOI 10.1080/01916599.2013.826431](https://doi.org/10.1080/01916599.2013.826431).
- Van Hulle, D. (2016), “Modelling a Digital Scholarly Edition for Genetic
  Criticism: A Rapprochement,”
  [DOI 10.4000/variants.293](https://doi.org/10.4000/variants.293).
- McKenzie, D. F. (1999), *Bibliography and the Sociology of Texts*,
  [DOI 10.1017/CBO9780511483226](https://doi.org/10.1017/CBO9780511483226).

### Translation qualification

- Melby, A. K., Fields, P. J., Hague, D. R., Koby, G. S., and Lommel, A. (2011),
  “Surveying Translation Quality Assessment: A Specification Approach,”
  [DOI 10.1080/13556509.2011.10798820](https://doi.org/10.1080/13556509.2011.10798820).

## Source limitations

- TEI and IFLA LRM are authoritative representation standards, not empirical
  demonstrations that a particular edition or identity decision is correct.
- Artificial traditions provide rare known genealogies but simplify historical
  language competence, material damage, copying incentives, memory, and
  preservation.
- Hoenen's contamination model demonstrates a formal possibility and search
  problem; it does not make every mixed signal identifiable.
- Editorial theories disagree about copy text, authorial intention, document
  priority, social production, and the value of fluid versions. The contract
  records the objective instead of deciding that debate.
- Genetic dossiers preserve revision evidence but do not expose private mental
  states directly.
- IFLA work/expression identity is deliberately high-level and application-
  dependent. It does not replace detailed textual or translation analysis.
- Translation specifications make evaluation purpose-qualified; they do not
  imply that purpose is the only legitimate criterion or that every target text
  is adequate.
- Literary interpretation can generate hypotheses, alternatives, and
  evaluations for text tasks. It is not biological or cognitive-mechanism
  evidence without independent experiments.

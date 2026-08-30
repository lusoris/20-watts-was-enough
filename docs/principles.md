# 20 Watts Was Enough — engineering and research contract

This document is the project-wide contract for research, software, experiments,
generated artifacts, and releases. It adapts the recurring rules used across
the maintainer's other repositories to this repository's actual work. A rule is
not copied merely because another repository uses it; it is translated to the
failure it is meant to prevent here.

The words **must**, **must not**, and **required** describe project policy, not
a legal or standards-compliance claim. The European Union and Germany are the
normative default for legal and conformity work; the applicability rules in
[`research/normative-baseline.md`](../research/normative-baseline.md) remain
controlling.

## 1. Authority and enforcement

Rules have one of four enforcement classes.

| Class | Meaning |
| --- | --- |
| **CI gate** | A repository check rejects the change automatically. |
| **review gate** | The author must show the rule is satisfied; a reviewer or maintainer may reject the change. |
| **guidance** | Follow by default and record a reason when deliberately deviating. |
| **staged gate** | The rule is adopted for new or changed work, but legacy debt prevents honest repository-wide enforcement yet. |

The canonical enforcement surface is the combination of this document,
[`AGENTS.md`](../AGENTS.md), nested `AGENTS.md` files, executable validators,
and GitHub workflows. A statement in prose does not count as an automated gate.
Repository settings such as branch protection count only after they have been
verified on GitHub.

An exception must be narrow, name the rule ID, explain the risk, define a
removal condition, and be visible in the affected file, pull request, or a
decision record. Silencing a check without that record is not an exception.

## 2. Power of Ten, adapted to this project

The source is Gerard J. Holzmann's
[_The Power of 10: Rules for Developing Safety-Critical Code_](https://spinroot.com/gerard/pdf/P10.pdf).
Its C-specific wording is not portable as-is. The invariant behind each rule is
retained and translated to Go, TypeScript/JavaScript, research protocols,
document generation, and workstation execution.

| ID | Preserved invariant | Project adaptation | Enforcement |
| --- | --- | --- | --- |
| **P10-1** | Control flow remains inspectable. | Prefer straight-line composition and iteration. Recursion is allowed only for a tree, graph, or parser with an explicit depth/visited bound. Catching errors is limited to a boundary that can add context, recover safely, or terminate cleanly. | review gate |
| **P10-2** | Work cannot continue without a demonstrable bound. | Every experiment horizon, grid, queue, retry, subprocess, and artifact size has a finite bound in configuration or code. Watchers and services must accept cancellation; external operations require timeouts. | CI + review gate |
| **P10-3** | Resource growth is controlled. | Bound buffers and retained artifacts; avoid copying a full corpus or book in memory when streaming or indexing suffices. Preallocate or pool only after measurement. Record peak memory and data movement for performance claims. | guidance |
| **P10-4** | Units remain reviewable. | New or materially changed functions target at most 120 nonblank/noncomment lines, 60 statements, and cognitive complexity 30. Split by responsibility instead of suppressing a finding. Large declarative tables and schemas may be exempt with a stated reason. | CI no-regression + staged full gate |
| **P10-5** | Assumptions are executable contracts. | Validate inputs and outputs at trust boundaries. A test needs at least two independent meaningful checks when the contract has more than one dimension; assertion counts must not be padded. Scientific protocols additionally require positive, negative, and strongest-conventional-null controls where applicable. | review gate |
| **P10-6** | State has the smallest possible scope. | Prefer immutable local values. Mutable module-global state, ambient clocks, hidden random generators, and implicit process-wide configuration are prohibited in claim-eligible execution. | lint + review gate |
| **P10-7** | Every result and parameter is checked. | Await or deliberately settle promises, check subprocess exit status, validate parsed external data, and reject missing/unknown fields at authority boundaries. Errors retain operation and artifact context without leaking secrets. | CI + review gate |
| **P10-8** | Generation stays simple and auditable. | Generated documents, plots, indexes, manifests, and fixtures retain editable sources, are deterministic for fixed inputs, and provide a `--check` or equivalent freshness path. Generated output never becomes a second prose authority. | CI gate |
| **P10-9** | Indirection and unsafe escape hatches are scarce. | Prefer explicit data flow and small interfaces. Dynamic evaluation, native helpers, shell execution, and multi-process isolation require a documented trust boundary, validation, and a reason the safer in-process form is insufficient. | review gate |
| **P10-10** | The strict toolchain is the merge floor. | A mergeable state has zero lint, type, policy, documentation, source-boundary, build, test, and high-severity known-vulnerability failures. Actions and lockfiles are pinned; suppressions require a local justification. | CI gate |

### 2.1 Bounded-execution evidence

For claim-eligible or workstation execution, a bound is not merely a comment.
The run configuration or receipt must expose, where applicable:

- seeds and fixed-instance identity;
- episode, step, wall-clock, retry, concurrency, memory, output, and descendant-process limits;
- cancellation and timeout behavior;
- the finite parameter grid or search budget;
- the exact code, configuration, schema, and comparator identities; and
- the termination reason, including failure and partial-output states.

Development smoke paths may exercise only part of that contract, but must label
their missing authority explicitly.

### 2.2 Complexity adoption

P10-4 was measured before enforcement. The initial baseline audits 272 source
files and records 196 findings: 90 complexity findings in 62 files, 80
function-length findings in 60 files, and 26 statement-count findings in 21
files. The tracked [`code-shape baseline`](../scripts/code-shape-baseline.json)
aggregates those findings by file and rule so harmless line movement does not
create noise.

CI and `npm run check:code-shape` reject every new file/rule group, increased
finding count, or worse maximum. Reductions pass. Pull-request and main-push CI
also compares the current source against the previous commit's baseline, so a
baseline edit cannot legitimize a regression. Full zero-debt enforcement
remains staged; new and substantially changed functions follow the target now,
and existing functions migrate without mass suppressions.

## 3. Scientific integrity contract

### 3.1 Three layers, never collapsed

Every major mechanism keeps these layers distinguishable:

1. **Observation** — what a source system demonstrably does within a stated
   experimental or analytical scope.
2. **Translation** — the engineering mechanism proposed to preserve the useful
   causal relation.
3. **Hypothesis** — the predicted effect, failure boundary, and test that could
   reject the proposal.

Analogy alone does not cross any of these boundaries.

### 3.2 Stable identities and reciprocal links

- Major assertions use stable `C-` claim IDs.
- Cross-domain invariants use stable `P-` principle IDs.
- Audits, candidate contracts, fixtures, tests, equations, and decisions keep
  their existing namespaces.
- A promoted claim links to evidence, principle bundle, affected concept, and a
  protocol where a project hypothesis is testable.
- Renumbering an established identity for presentation convenience is
  prohibited. Deprecate or supersede it visibly.

### 3.3 Evidence and provenance

- Prefer primary papers, official datasets, enacted EU/German law, official
  standards metadata, and authoritative technical documentation.
- A paper supports only the proposition and scope it actually tested.
- Imported conversations, summaries, search snippets, and source leads are not
  evidence by themselves.
- Record source identity, date, locator, access route, and redistribution basis.
- Citation is not permission to copy. Third-party material remains outside the
  project licences unless its licence and provenance explicitly allow reuse.
- Retractions, corrections, contradictory results, and failed replications are
  first-class ledger information, not inconvenient footnotes.

### 3.4 Deduplicate by causal invariant

Search is open to every scientific field, but the registry is not a catalogue
of metaphors. Before adding a principle:

1. state the problem class and causal variables without domain-specific names;
2. map the mechanism to existing `P-` bundles;
3. identify what intervention would distinguish it from those bundles;
4. add a new principle only when that distinction changes a prediction or
   experiment; and
5. retain all contributing domains as evidence branches under the shared
   invariant.

Similar-looking outcomes with different causal mechanisms are not deduplicated.

### 3.5 Claims and results

- Evidence status is one of `established`, `plausible`, `speculative`, or
  `disputed`, with the scope stated.
- `smoke-ready`, `protocol-complete`, and `workstation-executable` are build or
  readiness states, not scientific results.
- Development diagnostics, synthetic calibration, and fixture conformance must
  not be described as confirmation.
- A quantitative statement requires a source, a derivation with assumptions,
  or an explicit **hypothesis** label.
- Comparisons bind task, quality target, sample, precision, hardware, software,
  system boundary, utilization, time basis, and uncertainty.
- The strongest conventional engineering baseline is named before a
  bio-inspired candidate can earn an advantage claim.

### 3.6 Research conduct and disclosure

The [`research integrity baseline`](../research/research-integrity-baseline.md)
deduplicates the ALLEA, EU, DFG, and institutional controls adopted by this
project. Its authority hierarchy and trigger conditions are part of this
contract.

- Claim-eligible outputs identify contributors and roles, accountable approval,
  funding and material support, competing interests, and material use of AI,
  automated tools, or external services.
- Authorship follows substantial contribution, review, approval, and
  accountability. Funding, access, execution, tool use, seniority, or status
  alone do not create authorship.
- Research objects receive an explicit custodian, access class, provenance,
  reuse basis, preservation period, deletion rule, and the metadata and
  dependencies needed to interpret them. Access is as open as possible and as
  closed as necessary.
- Joint work agrees roles, applicable rules, data and material custody,
  licensing, publication, credit, conflicts, departures, and integrity handling
  before the collaboration creates authority-bearing material.
- Accepted funds, donated compute, equipment, data access, and external services
  are disclosed and included in comparison boundaries where they affect the
  result.

### 3.7 Ethics, correction, and review

- Work involving people, personal data, animals, biological or cultural
  material, environmental or physical intervention, safety-critical use,
  surveillance, dual use, military or violent application, export controls, or
  comparable harm receives a recorded pre-start screen. Any required competent
  approval must precede collection or execution.
- Foreseeable harm, misuse, rights, safety, environmental effects, and
  less-invasive alternatives remain part of research design rather than a
  publication-only check.
- Corrections preserve history, identify every affected authority surface that
  can reasonably be found, state the consequence, and mark invalid artifacts
  as withdrawn or superseded. They are not hidden in a later prose rewrite.
- Formal reviewers disclose conflicts and expertise limits, protect non-public
  material, do not appropriate reviewed work, justify their conclusions, and
  disclose material AI or external-service use. Maintainer review is never
  labelled independent review.
- Confidential integrity allegations are not posted in public issues. Handling
  protects good-faith reporting and respondent rights, uses a conflict-free
  investigator, preserves evidence, and does not claim independence when no
  suitable person or channel exists.
- Training, supervision, responsible assessment, and financial stewardship
  controls become mandatory before the project takes on the corresponding
  people, evaluation, or funding role.

## 4. Experiment and reproducibility contract

### 4.1 Frozen authority boundary

Claim-eligible execution binds the exact candidate, comparators, task/data
partition, seeds, configuration, schemas, analysis law, stopping law, and
environment identity before the evaluated observations are opened. Changes
after that boundary create a new run identity.

### 4.2 Determinism and receipts

- Fixed inputs produce byte-identical generated artifacts where the format
  permits it; unavoidable nondeterminism is measured and disclosed.
- Randomness comes from explicit, recorded generators and seeds.
- Every durable run can be resumed or rejected from an append-only receipt
  without trusting a mutable summary.
- Derived tables and plots can be regenerated from retained source data and
  code. Manual spreadsheet edits are not an analysis pipeline.
- Cache hits never bypass identity, schema, or freshness checks.

### 4.3 Test hierarchy

Use the smallest test that can falsify the changed contract, then run the
appropriate aggregate gate.

| Change | Minimum local evidence |
| --- | --- |
| Research prose, links, claims | documentation, source-boundary, coverage, and taxonomy validators |
| Equation or quantitative model | math validator plus dimensional and boundary checks |
| Plot or generated document | deterministic generator and freshness check |
| Experiment contract | schema/manifest tests and reciprocal claim-to-protocol audit |
| Workstation runner | targeted unit/contract tests, failure paths, resume/tamper checks, then the workstation suite |
| Site or reader | lint, typecheck, focused UI tests, static build, and artifact validation |
| Workflow or policy | policy validator plus the command the workflow will execute |

Tests prefer real file, process, browser, and schema boundaries when they are
deterministic and affordable. Mocks are appropriate for destructive, remote,
expensive, or deliberately fault-injected boundaries, but must preserve the
same observable contract.

## 5. Software and supply-chain contract

- Use the exact Go toolchain and module graph declared under `tooling/`, and the
  locked Node dependency graph with the minimum supported Node version in
  `package.json`; do not hand-edit either lockfile.
- GitHub Actions use immutable full commit SHAs and minimal permissions.
- Workflows define timeouts and concurrency where overlapping work can waste
  resources or publish stale state.
- Dependency updates are isolated, reviewable, and tested. Major updates never
  auto-merge.
- Never commit credentials, private source bodies, workstation secrets, or
  licensed material outside its allowed publication boundary.
- Treat Markdown, bibliography data, imported metadata, experiment configs,
  archives, and generated manifests as untrusted input at parser boundaries.
- Security reports use GitHub's private vulnerability-reporting route; public
  issues are not the disclosure channel.
- No document claims certification, legal compliance, SLSA level, or similar
  assurance solely because a workflow or checklist exists.

## 6. Repository and release contract

### 6.1 Canonical structure

- Git `main` is the canonical content and history.
- `concept/`, `research/`, `math/`, and `decisions/` each keep their existing
  authority; no parallel document store or second ADR tree is created.
- `sources/` records provenance and publication boundaries; it is not a hidden
  evidence shortcut.
- Editable diagram and plotting sources live beside or upstream of rendered
  assets.
- Generated build directories are disposable and never edited as source.

### 6.2 Changes and history

- Make the smallest coherent change; do not regenerate the whole concept.
- Use Conventional Commits for commit and pull-request titles.
- Update `CHANGELOG.md` for notable user-, researcher-, policy-, or
  reproducibility-facing changes.
- Add an append-only decision record for durable changes to authority,
  architecture, evidence policy, licensing, publication, or release semantics.
- Accepted decisions are not silently rewritten. Supersede them with a new
  record.

### 6.3 Releases

- Use Semantic Versioning for tagged repository releases while the project is
  pre-1.0; a release is a research snapshot, not proof that hypotheses passed.
- A release is built from a committed `main` revision and renders a tag-bound
  PDF and manifest from that exact checkout before checksumming and attesting
  them. The continuously published tracked PDF remains a `main` snapshot.
- Containers are the default public execution surface. Publish the static
  tooling image and one scoped image for each released experiment; do not merge
  unrelated experiment runtimes into one image. Native Go files are secondary
  conveniences and retain their own checksum, module inventory, notice and
  provenance boundary.
- The Pages portal and book are generated views of the same canonical revision.
- A release or deployment must not run from an unvalidated local-only state.

## 7. Licensing contract

[`LICENSING.md`](../LICENSING.md) is controlling. In summary:

- project-authored technical execution material uses EUPL v1.2 with the stated
  later-version option;
- original project prose, mathematics, diagrams, plots, and presentation use
  CC BY-SA 4.0;
- source records and third-party bodies retain their own terms; and
- machine-readable licence metadata supplements but never expands the rights
  described in `LICENSING.md`.

## 8. Review checklist

Before merging, answer all applicable questions with evidence:

- Is this the smallest coherent authority change?
- Are observation, translation, and hypothesis still distinguishable?
- Are claim and principle identities stable and reciprocal?
- Are contributors, support, competing interests, and material external or AI
  tool use disclosed at the authority this output claims?
- Does each claim-eligible research object have custody, access, retention,
  reuse, and disposal rules?
- Did every triggered ethics, rights, safety, or misuse review occur before the
  affected work began?
- Is every loop, retry, subprocess, search, and artifact bounded?
- Are units, random sources, schemas, errors, and external inputs explicit?
- Does the strongest conventional null remain in scope?
- Are generated artifacts reproducible and current?
- Are corrections, withdrawals, formal review, and collaboration duties handled
  under the research-integrity baseline?
- Is third-party provenance and licensing preserved?
- Do the targeted checks and the aggregate gate pass?
- Does the changelog or a new decision record explain the durable change?

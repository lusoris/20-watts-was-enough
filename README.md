# 20 Watts Was Enough

> A biologically inspired R&D blueprint for sparse, grounded, continual,
> energy-efficient AI.

The name is a joke with a serious target: metabolic accounting places the adult
human brain's whole-organ power budget at roughly 17–20 watts, while
contemporary AI systems often buy capability by activating and moving far more
state than a task needs. The number names the constraint; comparisons with
silicon require a shared task, quality envelope, and system boundary. See
[C-001](research/claims.md#c-001) and the
[energy-model chapter](concept/80-energy-model.md).

## Central thesis

The brain is evidence that useful, adaptive intelligence can exist under a
strict power and communication budget. This project asks which *computational
constraints* behind that fact can become engineering requirements:

- separate total capacity from active capacity;
- ground representations in temporally aligned perception, action, and outcome;
- allocate computation according to uncertainty and task demand;
- separate rapid episodic learning from slow structural learning;
- consolidate before pruning and hardening;
- store mutable facts in inspectable memory instead of forcing all knowledge
  into weights; and
- measure energy, data movement, quality, and uncertainty together.

## Project status

**Stage:** concept and evidence framework with ten development-only smoke
harnesses. There is no integrated model implementation or claim-eligible
workstation result yet. The generated
[test-coverage report](experiments/test-coverage.md) keeps those states
separate.

The repository is the canonical source. The original Google Doc and Gemini
discussions are preserved under [`sources/`](sources/README.md) as historical,
non-authoritative inputs.

The default normative context is the European Union and Germany. Legal,
standards, and conformity claims remain applicability-, jurisdiction-, version-,
and date-qualified under the
[`normative baseline`](research/normative-baseline.md); foreign material is
preserved as comparative unless a concrete project hook makes it applicable.

The same files are also rendered as a private research site. The site is a
generated reading surface—not a second document store. Saving a Markdown,
equation, bibliography, or Mermaid file updates the local preview through hot
reload; publishing creates an owner-only online edition from a committed Git
state. The site also provides a downloadable A4 book containing this README,
all canonical concept chapters, the mathematical notes, and a generated field-
coverage appendix. It is generated from the same files and checked for
staleness during the build. See
[decision 0005](decisions/0005-rendered-private-edition.md).

## Concept map

| Chapter | Question |
| --- | --- |
| [Thesis and principles](concept/00-thesis-and-principles.md) | What is the project's central engineering hypothesis? |
| [Working architecture](concept/01-working-architecture.md) | How do runtime, adaptation, reconstructive generation, maintenance, and resource control form one system? |
| [Biology is a launchpad](concept/05-biology-is-a-launchpad.md) | Which biological constraints transfer, and which substrate limits should engineering escape? |
| [Cross-domain convergence](concept/07-cross-domain-convergence.md) | How do different sciences collapse into shared problem–solution principles without losing causal differences? |
| [Structural growth and routing](concept/10-neurogenesis-and-routing.md) | How does a persistent capability gap create, test, specialize, merge, protect, or retire conditional modules? |
| [Sensorimotor grounding](concept/20-sensorimotor-grounding.md) | Which event, clock, opportunity, action, intervention, history, language, uncertainty, and provenance contracts ground a world model? |
| [Representative adaptive performance](concept/22-representative-adaptive-performance.md) | How are learning, transfer, fatigue, risk, recovery, coordination, and selection compared under the conditions in which action is actually possible? |
| [Active acoustic inference](concept/23-active-acoustic-inference.md) | How do calibrated sound, timing, propagation, masking, spatial action, active emission, separation, and exposure form one operator-qualified inference loop? |
| [Operator-qualified sensing](concept/24-operator-qualified-sensing.md) | What could a physical measurement resolve, what remains prior-dependent, when is another observation worth its cost, and which substrate should execute the transform? |
| [Active chemical sensing](concept/25-active-chemical-sensing.md) | How do reaction, transport, mixtures, active sampling, plume motion, adaptation, drift, analytical confirmation, exposure, and cost qualify a chemical inference? |
| [Reliability under mission profiles](concept/26-reliability-under-mission-profiles.md) | How should variable physical components be characterized, operated, protected, repaired, repurposed, or retired across real stress histories? |
| [Physical computation boundaries](concept/28-physical-computation-boundaries.md) | Which fundamental, device, circuit, workload, facility, and lifecycle boundary supports an energy claim? |
| [Sparse predictive compute](concept/30-sparse-predictive-compute.md) | How do event, context, and resource loops price the next computation or observation? |
| [Memory and consolidation](concept/40-memory-and-consolidation.md) | How does an episode become a retained skill, external fact, weakened trace, or deletion? |
| [Maturity and structural consolidation](concept/50-grokking-and-pruning.md) | When should a structure be protected, reopened, compacted, or retired? |
| [Hardening and factual memory](concept/60-hardening-and-factual-memory.md) | Which qualified path becomes compiled, remains a reusable skill, enters versioned factual memory, or escalates? |
| [System synthesis](concept/70-system-synthesis.md) | How do runtime, task, resource, adaptation, and maintenance control planes fit together? |
| [Energy evaluation contract](concept/80-energy-model.md) | How are lifecycle boundaries, equal budgets, break-even, uncertainty, and null models enforced? |
| [Research roadmap](concept/90-research-roadmap.md) | What evidence and experiments are required before building the full system? |

Supporting material:

- [`research/claims.md`](research/claims.md) — stable claim IDs and evidence status
- [`research/references.bib`](research/references.bib) — primary-source bibliography
- [`research/adoption-matrix.md`](research/adoption-matrix.md) — what to use, test, explore, or watch
- [`research/principle-registry.md`](research/principle-registry.md) — canonical deduplicated problem–solution invariants
- [`research/field-coverage.md`](research/field-coverage.md) — generated OECD/DFG field census, taxonomy blind spots, and breadth queue
- [`research/taxonomies/field-depth.md`](research/taxonomies/field-depth.md) — searchable inventory of 1,064 EU EuroSciVoc concepts, 214 DFG subjects, 213 ANZSRC groups, and 1,967 fields without inherited coverage
- [`research/domain-inventory.md`](research/domain-inventory.md) — audited, partial, and queued scientific fields
- [`research/discovery-policy.md`](research/discovery-policy.md) — open-world search, extraction, deduplication, and promotion rules
- [`research/normative-baseline.md`](research/normative-baseline.md) — EU/Germany default, source-role hierarchy, and applicability record
- [`research/audits/`](research/audits/README.md) — dated primary-source research passes and engineering null-model audits
- [`research/audits/2026-08-25-integrative-comparative-physiology.md`](research/audits/2026-08-25-integrative-comparative-physiology.md) — distributed supply, exchange, typed material balance, delayed control, prediction, synchrony, and fast/slow adaptation boundaries
- [`research/audits/2026-08-25-tribology-contact-adaptive-interfaces.md`](research/audits/2026-08-25-tribology-contact-adaptive-interfaces.md) — contact, lubrication, wear, stick--slip, third-body, texture, adaptive-interface, and lifecycle boundaries
- [`research/audits/2026-08-25-developmental-regeneration-depth.md`](research/audits/2026-08-25-developmental-regeneration-depth.md) — positional memory, repair instruction, field scaling, receiver geometry, mechanical boundaries, redundancy, and symmetry-breaking boundaries
- [`research/audits/2026-08-25-plant-plasticity-memory-signalling.md`](research/audits/2026-08-25-plant-plasticity-memory-signalling.md) — plant memory modes, lifecycle reset, systemic routes, sense-by-growth admission, boundary sensing, and integrated context
- [`research/audits/2026-08-25-applied-multiscale-reduction.md`](research/audits/2026-08-25-applied-multiscale-reduction.md) — projection memory, slow-manifold validity, heterogeneous micro-queries, and equation-free closure
- [`research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md`](research/audits/2026-08-25-electrochemistry-interface-memory-degradation.md) — interface/transport separation, finite diffusion memory, impedance validity, timescale resolution, passivation, hysteresis, identifiability, and delayed degradation
- [`research/audits/2026-08-25-relative-sensing-scale-symmetry.md`](research/audits/2026-08-25-relative-sensing-scale-symmetry.md) — full-trajectory scale symmetry, interface-qualified biological evidence, finite support, statistic-selection counterexamples, and observation-dependent recoverability
- [`research/audits/2026-08-25-interface-qualified-retroactivity-insulation.md`](research/audits/2026-08-25-interface-qualified-retroactivity-insulation.md) — downstream connection back-action, causal load classes, bounded insulation, useful coupling, and digital null controls
- [`research/audits/2026-08-26-history-conditioned-modular-succession.md`](research/audits/2026-08-26-history-conditioned-modular-succession.md) — ecological priority effects, task order, curriculum selection, scheduling controls, and fixed-task/eligibility causal cuts
- [`research/neuroscience-opportunity-map.md`](research/neuroscience-opportunity-map.md) — underused neural mechanisms and falsifiable translations
- [`research/comparative-biology.md`](research/comparative-biology.md) — candidates from animals, plants, immune systems, and adaptive networks
- [`research/source-crosswalk.md`](research/source-crosswalk.md) — imported ideas mapped into evidence and principle bundles
- [`research/open-questions.md`](research/open-questions.md) — unresolved decisions
- [`math/`](math/README.md) — notation, boundaries, and derivations
- [`math/visual-models.md`](math/visual-models.md) — interpretable plots of the
  current efficiency equations and break-even boundaries
- [`math/multiscale-reduction-contract.md`](math/multiscale-reduction-contract.md) — exact memory, slow-manifold, micro-query, lifting, healing, and closure boundaries
- [`math/interface-qualified-scale-symmetry.md`](math/interface-qualified-scale-symmetry.md) — fold-change symmetry, equivariance, absolute counter-tasks, trajectory discrepancy, and reference-maintenance cost
- [`math/interface-qualified-retroactivity.md`](math/interface-qualified-retroactivity.md) — full/reduced binding dynamics, connection sensitivity, service-qualified attenuation, causal controls, and lifecycle resource boundaries
- [`math/history-conditioned-modular-succession.md`](math/history-conditioned-modular-succession.md) — order estimands, parity identities, mechanism interventions, lifecycle endpoints, and kill rules
- [`assets/`](assets/README.md) — editable diagram and future figure sources
- [`decisions/`](decisions/README.md) — durable project decisions
- [`experiments/candidates/`](experiments/candidates/README.md) — falsifiable, equal-budget experiment contracts
- [`experiments/fixtures/`](experiments/fixtures/README.md) — reusable cross-candidate stress benchmarks that add no architecture by themselves
- [`experiments/fixtures/020-integrative-comparative-physiology.md`](experiments/fixtures/020-integrative-comparative-physiology.md) — nine complete CPU-only physiology contracts with no execution results
- [`experiments/fixtures/021-tribology-contact-adaptive-interfaces.md`](experiments/fixtures/021-tribology-contact-adaptive-interfaces.md) — nine complete CPU-only tribology/interface contracts with no execution results
- [`experiments/fixtures/022-regenerative-positional-memory.md`](experiments/fixtures/022-regenerative-positional-memory.md) — ten complete CPU-only developmental/regeneration contracts with no execution results
- [`experiments/fixtures/023-plant-plasticity-memory-signalling.md`](experiments/fixtures/023-plant-plasticity-memory-signalling.md) — ten complete CPU-only plant plasticity and signalling contracts with no execution results
- [`experiments/fixtures/024-applied-multiscale-reduction.md`](experiments/fixtures/024-applied-multiscale-reduction.md) — four complete CPU-only multiscale-reduction contracts with no execution results
- [`experiments/fixtures/025-electrochemistry-interface-memory-degradation.md`](experiments/fixtures/025-electrochemistry-interface-memory-degradation.md) — ten complete CPU-only electrochemistry contracts with no execution results
- [`experiments/fixtures/026-interface-qualified-relative-sensing.md`](experiments/fixtures/026-interface-qualified-relative-sensing.md) — ten complete CPU-only relative-sensing and scale-symmetry contracts with no execution results
- [`experiments/fixtures/027-interface-qualified-retroactivity-insulation.md`](experiments/fixtures/027-interface-qualified-retroactivity-insulation.md) — ten detailed CPU-only back-action and bounded-insulation protocol contracts, one public smoke implementation, and no confirmation results
- [`experiments/workstation/fixture-022/`](experiments/workstation/fixture-022/README.md) — deterministic DEV-T01 corruption, abstention, and charged-fallback development smoke path
- [`experiments/workstation/fixture-023/`](experiments/workstation/fixture-023/README.md) — deterministic PLM-T01 duration-memory and PLM-T02 lifecycle-reset development smoke paths
- [`experiments/workstation/fixture-024/`](experiments/workstation/fixture-024/README.md) — deterministic AMR-T01 development smoke path with no confirmation or energy authority
- [`experiments/workstation/fixture-025/`](experiments/workstation/fixture-025/README.md) — deterministic ECM-T03 validity-gate development smoke path with no confirmation or energy authority
- [`experiments/workstation/fixture-026/`](experiments/workstation/fixture-026/README.md) — deterministic RSD-T01 trajectory-symmetry and policy-firewall development smoke path with no comparison, confirmation, or energy authority
- [`experiments/workstation/fixture-027/`](experiments/workstation/fixture-027/README.md) — deterministic RIN-T01 isolation/connection diagnostic with no confirmation, service-performance, or energy authority
- [`experiments/test-coverage.md`](experiments/test-coverage.md) — generated
  claim-to-protocol coverage and workstation execution readiness
- [`experiments/test-readiness-summary.json`](experiments/test-readiness-summary.json) — compact machine-readable readiness surface used by the site and book
- [`CHANGELOG.md`](CHANGELOG.md) — human-readable evolution

## Editing rule

Do not regenerate the project from a prompt. Make an incremental change to a
chapter, claim, equation, diagram, or decision; update links and the changelog;
then run:

```powershell
pwsh -File scripts/validate-docs.ps1
npm run validate:math
```

For the live rendered edition, install the locked dependencies once and start
the watcher:

```powershell
npm ci
npm run dev
```

The preview is served at `http://localhost:3000`. Internal Markdown links,
GitHub-style tables, LaTeX equations, the bibliography, and editable Mermaid
sources are rendered in the same searchable reader.

Regenerate the full concept book after changing the README, a concept chapter,
mathematical note, diagram renderer, plot, or book stylesheet:

```powershell
npm run generate:book-pdf
npm run validate:book-pdf
```

The tracked artifact is
`public/downloads/20-watts-was-enough-full-concept-book.pdf`; the private site
offers it directly for download, while `/book` remains a printable HTML
edition. Raw source captures, audit ledgers, and experiment fixtures remain in
the searchable private site rather than being duplicated into the reading
edition.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full workflow.

## License

No license has been selected. This private repository is not permission to
redistribute the material.

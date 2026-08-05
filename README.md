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

**Stage:** concept and evidence framework. There is no model implementation yet.

The repository is the canonical source. The original Google Doc and Gemini
discussions are preserved under [`sources/`](sources/README.md) as historical,
non-authoritative inputs.

The same files are also rendered as a private research site. The site is a
generated reading surface—not a second document store. Saving a Markdown,
equation, bibliography, or Mermaid file updates the local preview through hot
reload; publishing creates an owner-only online edition from a committed Git
state. See [decision 0005](decisions/0005-rendered-private-edition.md).

## Concept map

| Chapter | Question |
| --- | --- |
| [Thesis and principles](concept/00-thesis-and-principles.md) | What is the project's central engineering hypothesis? |
| [Working architecture](concept/01-working-architecture.md) | How do runtime, adaptation, maintenance, resource control, and generative recombination form one system? |
| [Biology is a launchpad](concept/05-biology-is-a-launchpad.md) | Which biological constraints transfer, and which substrate limits should engineering escape? |
| [Neurogenesis and routing](concept/10-neurogenesis-and-routing.md) | How can a large developmental capacity become conditionally active modules? |
| [Sensorimotor grounding](concept/20-sensorimotor-grounding.md) | What must be learned before language can describe a world model? |
| [Sparse predictive compute](concept/30-sparse-predictive-compute.md) | How do event, context, and resource loops price the next computation or observation? |
| [Memory and consolidation](concept/40-memory-and-consolidation.md) | How does an episode become a retained skill, external fact, weakened trace, or deletion? |
| [Maturity and structural consolidation](concept/50-grokking-and-pruning.md) | When should a structure be protected, reopened, compacted, or retired? |
| [Hardening and factual memory](concept/60-hardening-and-factual-memory.md) | What should become a low-cost skill, remain plastic, or move outside weights? |
| [System synthesis](concept/70-system-synthesis.md) | How do runtime, task, resource, adaptation, and maintenance control planes fit together? |
| [Energy evaluation contract](concept/80-energy-model.md) | How are lifecycle boundaries, equal budgets, break-even, uncertainty, and null models enforced? |
| [Research roadmap](concept/90-research-roadmap.md) | What evidence and experiments are required before building the full system? |

Supporting material:

- [`research/claims.md`](research/claims.md) — stable claim IDs and evidence status
- [`research/references.bib`](research/references.bib) — primary-source bibliography
- [`research/adoption-matrix.md`](research/adoption-matrix.md) — what to use, test, explore, or watch
- [`research/principle-registry.md`](research/principle-registry.md) — canonical deduplicated problem–solution invariants
- [`research/domain-inventory.md`](research/domain-inventory.md) — audited, partial, and queued scientific fields
- [`research/discovery-policy.md`](research/discovery-policy.md) — open-world search, extraction, deduplication, and promotion rules
- [`research/audits/`](research/audits/README.md) — dated primary-source research passes and engineering null-model audits
- [`research/neuroscience-opportunity-map.md`](research/neuroscience-opportunity-map.md) — underused neural mechanisms and falsifiable translations
- [`research/comparative-biology.md`](research/comparative-biology.md) — candidates from animals, plants, immune systems, and adaptive networks
- [`research/source-crosswalk.md`](research/source-crosswalk.md) — imported ideas mapped into evidence and principle bundles
- [`research/open-questions.md`](research/open-questions.md) — unresolved decisions
- [`math/`](math/README.md) — notation, boundaries, and derivations
- [`assets/`](assets/README.md) — editable diagram and future figure sources
- [`decisions/`](decisions/README.md) — durable project decisions
- [`experiments/candidates/`](experiments/candidates/README.md) — falsifiable, equal-budget experiment contracts
- [`CHANGELOG.md`](CHANGELOG.md) — human-readable evolution

## Editing rule

Do not regenerate the project from a prompt. Make an incremental change to a
chapter, claim, equation, diagram, or decision; update links and the changelog;
then run:

```powershell
pwsh -File scripts/validate-docs.ps1
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

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full workflow.

## License

No license has been selected. This private repository is not permission to
redistribute the material.

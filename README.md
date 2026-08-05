# 20 Watts Was Enough

> A biologically inspired R&D blueprint for sparse, grounded, continual,
> energy-efficient AI.

The name is a joke with a serious target: the adult brain operates on an energy
budget commonly summarized as roughly 20 watts, while contemporary AI systems
often buy capability by activating and moving far more state than a task needs.
The number is an order-of-magnitude shorthand—not a claim that neural and
silicon operations are directly comparable. See [C-001](research/claims.md#c-001)
and the [energy-model chapter](concept/80-energy-model.md).

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

This is not an attempt to simulate every detail of biology. Biological
mechanisms are sources of constraints and hypotheses, not implementation
instructions.

## Project status

**Stage:** concept and evidence framework. There is no model implementation yet.

The repository is the canonical source. The original Google Doc and Gemini
discussions are preserved under [`sources/`](sources/README.md) as historical,
non-authoritative inputs.

## Concept map

| Chapter | Question |
| --- | --- |
| [Thesis and principles](concept/00-thesis-and-principles.md) | What is the project claiming—and explicitly not claiming? |
| [Neurogenesis and routing](concept/10-neurogenesis-and-routing.md) | How can a large developmental capacity become conditionally active modules? |
| [Sensorimotor grounding](concept/20-sensorimotor-grounding.md) | What must be learned before language can describe a world model? |
| [Sparse predictive compute](concept/30-sparse-predictive-compute.md) | How should surprise, confidence, and routing control computation? |
| [Memory and consolidation](concept/40-memory-and-consolidation.md) | How can fast learning coexist with stable long-term structure? |
| [Grokking and pruning](concept/50-grokking-and-pruning.md) | When is specialization mature enough to remove capacity safely? |
| [Hardening and factual memory](concept/60-hardening-and-factual-memory.md) | What should become a low-cost skill, remain plastic, or move outside weights? |
| [System synthesis](concept/70-system-synthesis.md) | How do the developmental and runtime loops fit together? |
| [Energy model](concept/80-energy-model.md) | How will efficiency claims be made comparable and falsifiable? |
| [Research roadmap](concept/90-research-roadmap.md) | What evidence and experiments are required before building the full system? |

Supporting material:

- [`research/claims.md`](research/claims.md) — stable claim IDs and evidence status
- [`research/references.bib`](research/references.bib) — primary-source bibliography
- [`research/open-questions.md`](research/open-questions.md) — unresolved decisions
- [`math/`](math/README.md) — notation, boundaries, and derivations
- [`assets/`](assets/README.md) — editable diagram and future figure sources
- [`decisions/`](decisions/README.md) — durable project decisions
- [`CHANGELOG.md`](CHANGELOG.md) — human-readable evolution

## Editing rule

Do not regenerate the project from a prompt. Make an incremental change to a
chapter, claim, equation, diagram, or decision; update links and the changelog;
then run:

```powershell
pwsh -File scripts/validate-docs.ps1
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full workflow.

## License

No license has been selected. This private repository is not permission to
redistribute the material.

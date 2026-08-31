# Open-world scientific discovery policy

The project searches across **all empirical, formal, and engineering sciences**.
A field is not excluded because its objects look unlike brains or computers.
What matters is whether it contains a reproducible way to solve a problem that
an adaptive computational system also faces.

This is an open-world policy, not a claim that the inventory is exhaustive.
New fields and subfields remain admissible without changing the project scope.
Actual breadth is measured in the generated
[global field-coverage census](field-coverage.md), using OECD FORD as the
backbone, DFG as a finer German/European probe, and disagreements with other
classifications as discovery signals. See [decision 0009](../decisions/0009-external-taxonomy-breadth-control.md).

## Normative sources are a distinct evidence role

Law, regulation, standards, and regulator guidance can expose requirements,
failure taxonomies, test methods, or mature engineering nulls. Their authority
does not by itself establish that an empirical mechanism works, and a foreign
rule does not become locally applicable because it contains a useful idea.

Use the European Union and Germany as the default normative context and follow
[`normative-baseline.md`](normative-baseline.md). Every normative source must be
classified as an applicable binding requirement, project-specific obligation,
conformity route, technical practice, comparative source, or draft/historical
source. Foreign material remains comparative unless a named market,
deployment, contract, certification, procurement, supply-chain, or other hook
makes it applicable. Scientific promotion still requires primary empirical or
formal evidence under the ordinary gates below.

## Search by problem, not resemblance

Each research pass starts with a constrained problem and asks how different
fields solve it. Initial problem families are:

| Problem family | Questions asked across fields |
| --- | --- |
| Allocation | What receives scarce energy, bandwidth, material, attention, or time? |
| Coordination | How do local actors align without a complete central model? |
| Memory | What is retained, externalized, compressed, updated, or forgotten? |
| Search | How are alternatives generated, explored, selected, and protected? |
| Prediction | How is mismatch detected and when is another observation worth its cost? |
| Learning | How does a system change quickly without erasing useful prior structure? |
| Development | How does excess potential become specialized, stable organization? |
| Repair | How is damage detected, contained, reconstructed, and validated? |
| Robustness | How are correlated failure, regime shifts, and rare shocks handled? |
| Communication | What is transmitted, to whom, at what precision and timescale? |
| Control | Which variables are regulated locally, globally, continuously, or episodically? |
| Construction | When is repeated computation moved into topology, morphology, or material? |
| Cooperation and conflict | How are free riding, capture, deception, and incompatible goals bounded? |
| Measurement | Which latent state can be inferred from response, perturbation, or fluctuation? |

The same paper may enter through several families. The registry later
deduplicates causal invariants; the discovery pass does not discard apparent
duplicates early.

## Search in both directions

The project uses two complementary discovery passes.

1. **Problem pull:** start with a measured engineering failure, resource limit,
   or missing capability; specify its function, boundary, and strongest current
   null; then search every relevant field for mechanisms that operate under a
   comparable constraint.
2. **Phenomenon push:** start with a reproducible biological, physical, social,
   mathematical, or engineered phenomenon; quantify what it does and where it
   fails; then search for artificial problems with the same normalized
   operation.

These repository terms deliberately broaden the established biomimetics
vocabulary. `Phenomenon push` includes biology-push, solution-driven, and
biology-to-design searches but also admits non-biological sciences. `Problem
pull` includes technology-pull, problem-driven, and challenge-to-biology
searches but does not stop at biology.

Both directions end at the same extraction record, deduplication protocol, and
equal-budget rejection gate. Visual resemblance and organism-themed naming do
not survive that gate. A biological shape, behavior, or story is only a lead
until a functional mechanism has been isolated; a functional mechanism is only
an engineering candidate until it beats the strongest available alternative.

This bidirectional structure is compatible with the terminology and process
framework of [ISO 18458:2015](https://www.iso.org/standard/62500.html), the
analysis–analogy–abstraction–transfer sequence described for materials in
[ISO 18457:2016](https://www.iso.org/standard/62499.html), and the published
top-down/bottom-up product-development workflow in
[VDI 6220 Part 2](https://www.vdi.de/en/home/vdi-standards/details/vdi-6220-blatt-2-biomimetics-biomimetic-design-methodology-products-and-processes).
The later [ISO/WD 25895](https://www.iso.org/standard/91868.html) is retained as
a provisional international method lead. The project's evidence and test gates
remain stricter than any terminology label.

The canonical [bidirectional-transfer diagram and its editable Mermaid
source](../concept/07-cross-domain-convergence.md#biomimetic-transfer-is-a-search-method-not-an-evidence-grade)
live in the convergence chapter.

## Field horizon

The search includes, but is not limited to:

- neuroscience, cognition, development, endocrinology, immunology, physiology,
  microbiology, molecular and cellular biology;
- zoology, botany, mycology, ethology, collective behavior, ecology, evolution,
  paleobiology, and origin-of-life research;
- medicine, pathology, epidemiology, pharmacology, rehabilitation, and public
  health when interventions expose control or failure mechanisms;
- physics, thermodynamics, statistical mechanics, chemistry, materials science,
  geoscience, climate science, oceanography, and astronomy;
- mathematics, statistics, information theory, dynamical systems, control,
  optimization, operations research, game theory, and decision theory;
- computer architecture, distributed systems, networking, databases, security,
  programming languages, robotics, and human–computer interaction;
- economics, organizational science, social choice, linguistics, anthropology,
  archaeology, and quantitative history where claims have explicit mechanisms
  and testable evidence; and
- civil, mechanical, electrical, chemical, aerospace, and industrial
  engineering, especially real systems operating under failure and resource
  constraints.

Historical or qualitative work can generate a lead. It does not become a
scientific claim in the ledger until its evidential scope and uncertainty are
made explicit.

## Extraction record

For every retained result, record:

1. **system and task:** what system was observed and what problem it faced;
2. **source organization and scale:** whether the relevant source is a form or
   material, process or organism, ecosystem or collective, or a cross-scale
   interaction; similar functions at different levels do not imply the same
   mechanism;
3. **constraint:** the limiting resource, risk, uncertainty, or timescale;
4. **causal operation:** the intervention-supported transformation or control
   loop, not an organism-themed metaphor;
5. **information path:** what state is sensed, transmitted, stored, or hidden;
6. **physical path:** where energy, matter, bandwidth, and latency are spent;
7. **boundary conditions:** when the effect weakens, reverses, or fails;
8. **evidence status:** established, plausible, speculative, or disputed;
9. **nearest `P-` bundle:** or an explicit reason a candidate is not a
   duplicate;
10. **engineering null model:** the strongest conventional mechanism already
   solving the normalized problem; and
11. **discriminating test:** a result that would reject the proposed transfer.

## Deduplication protocol

Domain language is preserved in audits, then normalized into this tuple:

```text
<problem, source organization/scale, constrained resource, sensed state, causal transformation,
 information topology, timescale, failure boundary>
```

Two findings merge when the normalized tuples describe the same control
operation at materially comparable timescales. They stay separate when their
state transformation, information topology, reversibility, or failure mode is
different—even if both are commonly called “attention,” “memory,” “quorum,” or
“homeostasis.”

Repeated occurrence raises priority, not truth. Apparent convergence can be
caused by shared ancestry, shared mathematical descriptions, citation between
fields, or researchers choosing the same abstraction. Independence must be
argued rather than assumed.

## Promotion gates

A lead may be collected from anywhere. It enters the architecture only when:

- at least one primary or authoritative source supports the scoped
  observation;
- the proposed AI translation is separately labeled as a hypothesis;
- a standard engineering analogue or null model is named;
- lifecycle compute, data movement, maintenance, recovery, and physical costs
  can be measured at a declared boundary; and
- an experiment can make the candidate lose.

If a biological translation performs no better than Kalman filtering, a cache,
a scheduler, a bandit, a consensus protocol, a feedback controller, or another
appropriate conventional method at equal cost, the conventional method wins.
The biological origin alone creates no preference.

## Breadth and depth cadence

Research proceeds in alternating waves:

1. **breadth:** sample strong causal findings from fields not yet represented;
2. **normalize:** extract the problem–mechanism tuple;
3. **deduplicate:** merge with an existing principle or hold as a candidate;
4. **null-model audit:** locate the strongest established analogue;
5. **depth:** revisit only candidates that change an experiment, measurement,
   or architecture; and
6. **test:** run the smallest decisive comparison before scaling the idea.

This preserves the ambition to borrow from every field without turning the
repository into an unstructured encyclopedia.

The coverage census adds a binding breadth scheduler to this cadence: each
wave takes one item from the least-covered OECD broad field, one hidden DFG
subfield gap inside an apparently represented field, and one methodologically
distant field before another familiar AI-, computing-, neuroscience-, or
engineering-adjacent breadth pass. Apparent AI relevance receives no breadth
priority by itself.

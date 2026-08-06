# Biomimetics transfer-method audit

**Audit date:** 2026-08-06  
**Scope:** terminology, discovery direction, abstraction, transfer, and
validation—not the performance of any particular biomimetic system.

## Why this pass exists

The project already searches every scientific field and deduplicates recurrent
mechanisms. Biomimetics supplies established language for turning that intent
into a two-direction development process. This pass asks which parts improve
the repository's method and which parts remain inspiration, terminology, or
unsupported generalization.

## Source hierarchy

1. **VDI 6220 Part 1 (2021)** is a published fundamentals, terminology, and
   strategy framework. **VDI 6220 Part 2 (2023)** is the strongest public
   process reference in this pass: it locates biomimetic methods in product
   development and explicitly supports technically driven top-down and
   biologically driven bottom-up routes.
2. **ISO 18458:2015** is the authoritative international terminology/process
   source used here. Its public abstract describes biomimetic terminology,
   application, product development, limits, and potential. It does not report
   that biomimetic systems outperform conventional ones.
3. **ISO 18457:2016** narrows the method to materials, structures, surfaces,
   components, and manufacturing. Its useful transferable sequence is
   biological analysis → analogy → abstraction → technical transfer, with
   measurement attached to the resulting properties.
4. **Helms, Vattam, and Goel (2009)** empirically describe problem-driven and
   solution-driven starting points, recurring design practices, and recurring
   errors in an interdisciplinary course. **Fayemi et al. (2017)** review
   terminology, a problem-driven process, and tools mapped to process stages.
   These papers describe design practice; they do not establish performance
   gains for transferred systems.
5. **Vincent et al. (2006)** is a peer-reviewed theory/method paper that adapts
   TRIZ to compare biological and technological problem solving. Its reported
   similarity percentages and energy-versus-information contrast are specific
   to its corpus and coding method; they are not project-wide constants.
6. **ISO/TR 23845:2020** describes an ontology-enhanced thesaurus and keyword
   explorer; **ISO/TR 23847:2022** describes a TRIZ database connecting
   problem- and function-oriented approaches. They are search/tool leads, not
   evidence that transfer is effective.
7. **ISO/WD 25895** repeats the product-development route at international
   working-draft stage. It is provisional and is not substituted for published
   VDI 6220 Part 2.
8. **The Biomimicry Institute page** is an institutional and normative account
   emphasizing forms, processes, ecosystems, regeneration, and discovery via
   AskNature. It is useful for leads and design objectives, not evidence for a
   transferred mechanism.
9. **Wikipedia's Biomimetics article** is tertiary. It is retained only as a
   terminology/history map and route to stronger sources.

## Terminology crosswalk

- **Biomimetics / bionics:** technical transfer from biological knowledge under
  an explicit development process.
- **Biologically inspired design / bioinspiration:** a broader family of design
  activity using biological analogies; the degree of abstraction and
  validation varies.
- **Biomimicry:** commonly adds explicit regenerative or sustainability aims.
  Those aims remain measured project objectives, not consequences of the label.
- **Biomorphic imitation:** resemblance of form or appearance. It may transfer
  no causal function and is rejected at the functional-abstraction gate.
- **Phenomenon push:** the project's broader name for biology-push,
  solution-driven, or biology-to-design work plus analogous searches starting
  in non-biological fields.
- **Problem pull:** the project's broader name for technology-pull,
  problem-driven, or challenge-to-biology work plus searches that continue
  across all other sciences.

## Adopted method

### Route A — phenomenon push

1. Identify a reproducible effect in any scientific or engineering domain.
2. State the source task, function, mechanism, inputs, outputs, costs,
   organization/scale, timescale, and failure boundary.
3. Abstract only what remains necessary for the function.
4. Search the problem inventory for artificial systems with a matching
   normalized operation.

### Route B — problem pull

1. Start with a measured artificial-system failure or budget.
2. Specify required function, quality/risk envelope, system boundary, and the
   strongest current engineering null.
3. Search across all fields for mechanisms operating under comparable
   constraints.
4. Normalize each result before comparing source-domain names or appearances.

### Shared gate

Both routes must:

1. enter the same mechanism record $M$;
2. merge with, discriminate from, or remain outside the `P-` registry;
3. be redesigned around artificial-substrate affordances rather than copied
   literally;
4. expose lifecycle cost, data movement, quality, risk, latency, maintenance,
   and recovery; and
5. lose to a matched conventional method when no residual benefit remains.

## What is not adopted

- “Nature-inspired” is not an evidence status.
- Recurrence does not establish independence, optimality, or transferability.
- Formal, visual, or verbal resemblance does not establish shared function.
- Sustainability or regeneration is not automatic; it must be an explicit
  objective with a measured boundary.
- A successful source mechanism does not validate its artificial analogue.
- The 12% similarity reported by Vincent et al. is not generalized beyond that
  paper's TRIZ-coded comparison.
- Form-, process-, organism-, and ecosystem-level analogies are not merged
  merely because they serve the same high-level function.

## Repository outcome

- The discovery policy now names both search directions.
- Cross-domain convergence owns the shared abstraction, deduplication, and
  falsification gate.
- No central `C-` claim, `P-` principle, or architecture candidate was added.
- The two user-supplied pages remain traceable in
  [`../../sources/2026-08-06-biomimicry-links.md`](../../sources/2026-08-06-biomimicry-links.md).

## References

- Verein Deutscher Ingenieure. *VDI 6220 Part 1: Biomimetics — Fundamentals,
  conception, and strategy* (2021).
  <https://www.vdi.de/en/home/vdi-standards/details/vdi-6220-blatt-1-biomimetics-fundamentals-conception-and-strategy>
- Verein Deutscher Ingenieure. *VDI 6220 Part 2: Biomimetics — Biomimetic design
  methodology — Products and processes* (2023).
  <https://www.vdi.de/en/home/vdi-standards/details/vdi-6220-blatt-2-biomimetics-biomimetic-design-methodology-products-and-processes>
- International Organization for Standardization. *ISO 18458:2015 —
  Biomimetics: Terminology, concepts and methodology*.
  <https://www.iso.org/standard/62500.html>
- International Organization for Standardization. *ISO 18457:2016 —
  Biomimetics: Biomimetic materials, structures and components*.
  <https://www.iso.org/standard/62499.html>
- International Organization for Standardization. *ISO/WD 25895 — Biomimetic
  development methodology: Products and processes*.
  <https://www.iso.org/standard/91868.html>
- International Organization for Standardization. *ISO/TR 23845:2020 —
  Ontology-Enhanced Thesaurus for biomimetics*.
  <https://www.iso.org/standard/77146.html>
- International Organization for Standardization. *ISO/TR 23847:2022 —
  Integrating problem- and function-oriented approaches applying the TRIZ
  method*. <https://www.iso.org/standard/77148.html>
- Helms, M., Vattam, S. S., and Goel, A. K. (2009). “Biologically inspired
  design: process and products.” *Design Studies*, 30(5), 606–622.
  <https://doi.org/10.1016/j.destud.2009.04.003>
- Fayemi, P. E., Wanieck, K., Zollfrank, C., Maranzana, N., and Aoussat, A.
  (2017). “Biomimetics: process, tools and practice.” *Bioinspiration &
  Biomimetics*, 12(1), 011002.
  <https://doi.org/10.1088/1748-3190/12/1/011002>
- Vincent, J. F. V., Bogatyreva, O. A., Bogatyrev, N. R., Bowyer, A., and Pahl,
  A.-K. (2006). “Biomimetics: its practice and theory.” *Journal of the Royal
  Society Interface*, 3(9), 471–482.
  <https://doi.org/10.1098/rsif.2006.0127>
- The Biomimicry Institute. “What is biomimicry?”
  <https://biomimicry.org/inspiration/what-is-biomimicry/>
- Wikipedia contributors. “Biomimetics.” Discovery source only.
  <https://en.wikipedia.org/wiki/Biomimetics>

# Graphics and figure assets

Editable sources are canonical. Rendered files are optional derived artifacts.

## Layout

- `diagrams/` contains Mermaid sources used by the concept.
- `diagrams/evidence-to-principles.mmd` shows how domain findings are audited,
  bundled, translated, and tested without duplicating concepts.
- `diagrams/three-coupled-loops.mmd` shows the fast runtime, adaptation, and
  slow maintenance loops under shared resource control.
- `diagrams/generative-recombination.mmd` treats useful novelty as a maintained
  copy–compress–vary–test–retain cycle rather than creation from nothing.
- `rendered/` is reserved for committed SVG or PNG outputs generated from those
  sources.
- Future data-driven figures should store their plotting source and input-data
  provenance beside the output.

Do not add a screenshot when a Mermaid, SVG, plotting script, or other editable
source can express the same information.

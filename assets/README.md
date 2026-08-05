# Graphics and figure assets

Editable sources are canonical. Rendered files are optional derived artifacts.

## Layout

- `diagrams/` contains Mermaid sources used by the concept.
- `rendered/` is reserved for committed SVG or PNG outputs generated from those
  sources.
- Future data-driven figures should store their plotting source and input-data
  provenance beside the output.

Do not add a screenshot when a Mermaid, SVG, plotting script, or other editable
source can express the same information.

# Fine-grained research-field inventory

The repository's earlier breadth control operated at **42 OECD second-level
fields**, **49 DFG review boards**, and **23 ANZSRC divisions**. Those levels are
useful for routing, but too coarse to support a claim that the scientific search
is globally deep.

[`fine-grained-fields.json`](fine-grained-fields.json) now preserves the exact
hierarchies from the official classifications:

- **1,064 EuroSciVoc concepts** with English and German labels from the
  Publications Office of the European Union;
- 49 DFG review boards and **214 named subjects** for 2024--2028;
- 23 ANZSRC divisions, **213 groups**, and **1,967 fields** from the corrected
  2020 FoR data cube.

The generated [`field-depth.md`](field-depth.md) makes every EU concept, DFG
subject, ANZSRC group, and ANZSRC field searchable in the private reading
edition without pretending that a parent-level audit covers its children.

[`fine-grained-routing.json`](fine-grained-routing.json) is the sparse child-
level coverage ledger. Absence means `unassigned`; only explicit records can
attach a dedicated or adjacent audit to a concept, subject, group, or field.

## What this changes

This file is an **inventory**, not a coverage score. A dedicated review at the
parent-board or division level does not automatically make every child subject
reviewed. Fine-grained audit routing will be assigned subject by subject and
group by group in subsequent waves.

That separation prevents three errors:

1. one broad audit making dozens of untouched specialties appear complete;
2. name overlap being mistaken for evidence overlap; and
3. catch-all categories hiding emerging or hybrid disciplines.

## Provenance and regeneration

- Immutable official inputs and hashes:
  [`sources/taxonomies/2026-08-25`](../../sources/taxonomies/2026-08-25/README.md).
- Deterministic standard-library importer:
  [`scripts/import-science-taxonomies.py`](../../scripts/import-science-taxonomies.py).
- Structural and source-integrity validator:
  [`scripts/validate-science-taxonomies.mjs`](../../scripts/validate-science-taxonomies.mjs).
- Searchable depth-page generator:
  [`scripts/generate-taxonomy-depth.mjs`](../../scripts/generate-taxonomy-depth.mjs).

EuroSciVoc is the EU-level multilingual vocabulary. The DFG classification adds
German review granularity. ANZSRC is an independent hierarchy used to detect
disagreements and omissions; it is not a normative source for this EU/German
project.

Regenerate with `python scripts/import-science-taxonomies.py`; CI-style checks
use `python scripts/import-science-taxonomies.py --check` followed by the Node
validator and the depth-page freshness check.

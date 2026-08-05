# Working method

This repository is a research notebook with stronger provenance than an
ordinary notebook. Preserve uncertainty and history.

## Change workflow

1. Start from the smallest affected chapter or claim; never regenerate the
   entire concept.
2. Separate three layers explicitly:
   - **observation:** what a biological or engineered system demonstrably does;
   - **translation:** an engineering mechanism motivated by that observation;
   - **hypothesis:** the expected benefit, with a falsifiable prediction.
3. Add or update a stable entry in [`research/claims.md`](research/claims.md)
   before promoting a new major assertion into the concept.
4. Map the observation to an existing `P-` bundle in
   [`research/principle-registry.md`](research/principle-registry.md); create a
   new principle only when the problem or causal invariant is materially new.
5. Add primary sources to [`research/references.bib`](research/references.bib).
   Imported AI conversations are never evidence.
6. Define every symbol and system boundary used in a calculation.
7. Update [`CHANGELOG.md`](CHANGELOG.md) and, for a durable choice, add a
   decision record under [`decisions/`](decisions/README.md).
8. Run `pwsh -File scripts/validate-docs.ps1` before committing.

## Live research edition

Run `npm ci` once, then `npm run dev`. The browser reader watches the canonical
files in `concept/`, `research/`, `math/`, `decisions/`, `sources/`, and
`assets/`; it does not maintain copied prose. A normal save triggers local hot
reload.

Run `npm run build` before publishing. The private online edition must be built
from the same committed state that is pushed to the canonical Git repository.
Do not edit generated files under `dist/`, and do not publish the site with
public access.

## Evidence statuses

- **established:** directly supported within a clearly stated experimental or
  analytical scope;
- **plausible:** supported indirectly or in narrower systems, but not yet for
  the proposed architecture;
- **speculative:** a testable project hypothesis with no adequate direct
  evidence yet; and
- **disputed:** contradicted, ill-defined, or dependent on incompatible
  measurements.

Status is not a score. An established result in a toy task does not establish
that it transfers to a large multimodal system.

## Quantitative claims

A number must be accompanied by a claim ID, a derivation with assumptions, or
the word **hypothesis**. Comparisons must use the same task, quality target,
system boundary, precision, utilization definition, and time basis.

## Diagrams and generated artifacts

Keep editable Mermaid or plotting sources under `assets/`. A rendered SVG or
PNG may be committed beside its source, but never replace the source with an
opaque image.

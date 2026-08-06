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

## Discovery workflow

No scientific field is out of scope merely because it appears unrelated to AI.
Use the problem-first search, extraction tuple, and promotion gates in
[`research/discovery-policy.md`](research/discovery-policy.md). A new audit must
name the strongest conventional engineering null model before its translation
can influence an architecture or experiment.

## Normative-source workflow

The default normative context is the European Union and Germany. Before using
language such as *required*, *compliant*, *certified*, or *state of the art*,
follow [`research/normative-baseline.md`](research/normative-baseline.md):

1. identify the system, intended use, deployment, actor role, and jurisdiction;
2. record the official source, exact version and status, relevant dates, source
   role, and concrete applicability hook;
3. distinguish binding law, project obligations, conformity routes, technical
   guidance, comparative foreign material, and drafts;
4. verify EU harmonisation, Official Journal citation, transition, and German
   adoption rather than inferring them from an ISO or IEC title; and
5. recheck official sources before consequential use.

Foreign law, standards, and regulator guidance remain valid comparative or
technical research inputs. They are not German or EU compliance requirements
without an explicit applicability hook.

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

# Decision 0009 — Measure research breadth against external taxonomies

**Status:** accepted  
**Date:** 2026-08-21

## Context

An open invitation to “search every field” does not show which fields were
actually searched. The repository's first domain inventory grew outward from
neuroscience, AI, biology, and engineering problems. It became broad, but the
starting point still biased what was visible and allowed familiar disciplines
to subdivide while unrelated disciplines remained single labels or vanished.

No one classification is a complete ontology of knowledge. Broad global
classifications can hide entire disciplines, while national funding
classifications reflect local institutions and operational review structures.
Their disagreements are therefore useful evidence about blind spots.

## Decision

Maintain a machine-readable field-coverage census under
[`research/field-coverage.json`](../research/field-coverage.json):

1. use the 42 second-level OECD FORD fields as the global completeness
   backbone;
2. use the active DFG classification as the German and European granularity
   probe;
3. use independent classification disagreements, initially ANZSRC, to reveal
   fields that OECD or DFG do not separately expose;
4. distinguish a dedicated field audit, adjacent evidence, and an unreviewed
   field without treating any of those states as scientific completeness; and
5. schedule breadth work by coverage deficit and methodological distance, not
   by how obviously a field resembles AI.

The EU/Germany normative default remains unchanged. A foreign research
classification is a discovery instrument, not a source of applicable law,
standards, or governance authority.

## Consequences

- Breadth claims must cite the generated
  [`global field coverage`](../research/field-coverage.md), not the length of
  the audit list.
- A first dedicated audit changes presence, not completion; subfield depth,
  evidence quality, deduplication, and executable readiness remain separate.
- Each breadth wave includes the least-covered OECD domain, a hidden DFG
  subfield gap, and a methodologically distant field before familiar areas can
  receive more breadth work.
- Catch-all categories remain open and cannot certify exhaustiveness.
- A taxonomy disagreement enters the queue with its own source and handling
  rules. It is not forced into the canonical taxonomy or discarded.
- The generated report and plot must stay reproducible from the JSON record.

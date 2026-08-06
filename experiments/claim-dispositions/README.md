# Ledger-only claim dispositions

This directory explains why a central claim has no exact relation to a numbered
experiment artifact. It prevents the coverage percentage from being improved by
attaching every scientific observation to a vaguely related AI experiment.

Each JSON fragment uses schema version 1 and contains a non-overlapping claim
range. Every listed claim receives exactly one disposition:

1. `evidence-input` — the claim motivates or constrains an engineering
   translation but is not itself a standalone AI-system hypothesis;
2. `source-reproduction` — testing the claim would reproduce the cited
   source-domain study rather than evaluate this project's AI system;
3. `existing-artifact-gap` — an existing candidate or fixture should test the
   engineering consequence, but the exact traceability link is missing;
4. `new-artifact-needed` — the claim expresses a project hypothesis whose
   consequence needs a new experiment contract.

The generated coverage audit keeps these dispositions separate from coverage
tiers. A disposition never counts as a test. `existing-artifact-gap` entries
should be repaired with exact bidirectional links and then removed;
`new-artifact-needed` entries remain an explicit experiment backlog.

Each record has this shape:

```json
{
  "id": "C-007",
  "disposition": "new-artifact-needed",
  "rationale": "The statement predicts an AI-system transfer advantage that no current protocol isolates.",
  "targets": ["proposed:grounded-transfer"]
}
```

For `existing-artifact-gap`, every target must be an existing artifact ID such
as `candidate-004`. For a proposed artifact, use a stable `proposed:` slug.
Evidence and source-reproduction records use an empty target list.

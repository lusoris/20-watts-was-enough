# 0046 — Project the research roadmap into GitHub milestones

- **Status:** accepted
- **Date:** 2026-08-30
- **Related:** [0036](0036-use-one-source-to-publication-and-feedback-graph.md)

## Context

The research roadmap already defines dependency stages and scientific exit
gates. Contributors also need a live view of bounded issues, pull requests and
finished coordination work. Maintaining a second roadmap by hand in GitHub
would let stage names, meanings and progress drift from Git `main`; treating an
issue count as evidence would collapse operational and scientific authority.

Labels were already declared in a repository manifest and applied by a trusted
main-branch workflow. Milestones and their issue assignments need the same
reproducible ownership without discarding unrelated objects, guessing which
stage owns an issue, or inventing dates the research cannot yet justify.

## Decision

1. Keep [`concept/90-research-roadmap.md`](../concept/90-research-roadmap.md) as
   the authority for stage order, gate meaning and exit conditions.
2. Declare the operational projection in [`.github/milestones.json`](../.github/milestones.json).
   Each managed milestone has one stable `M0`–`M5` identity, exact roadmap
   anchor, title, state and short summary. The manifest contains no issue count,
   evidence status or due date.
3. Bind the current issue projection in the repository-specific
   [`.github/issue-milestones.json`](../.github/issue-milestones.json). It maps
   only stable issue numbers to `M0`–`M5`; it contains no title, progress, claim
   status or pull-request guess. A pull request can be assigned only after a
   separate stable identity is committed and reviewed.
4. Apply labels, milestones and mapped issue assignments through one
   standard-library Go command and one least-privilege workflow checked out
   from canonical `main`. Offline checking validates all three manifests. A
   live repair inventories every managed label, the complete bounded milestone
   set and every mapped issue before its first write, validates each mutation
   response, then reads all three authorities back. A transport failure may
   leave an already-verified repair in place; the next full preflight treats it
   as unchanged and resumes the remaining bounded work.
5. Mark managed GitHub milestone descriptions with a stable hidden identity.
   Synchronisation creates or repairs only marked milestones, preserves
   unmarked milestones, and fails closed on duplicates, unknown markers,
   malformed remote state or an existing due date.
6. Change only the milestone field of issues named by the committed mapping.
   Preserve every unmapped issue and pull request. Repository identity, issue
   identity and numeric target milestone must agree before an assignment is
   written and again on readback.
7. Treat GitHub progress as coordination metadata. Closing an issue or pull
   request cannot promote a claim, satisfy an experiment gate or convert a
   construction or smoke run into a scientific result.

## Consequences

- Readers can follow the six-stage plan and see live work without learning the
  repository layout first.
- Stage wording and the admitted issue queue are written once. Managed GitHub
  milestones and current issue assignments can be reconstructed from committed
  metadata instead of becoming a parallel planning database.
- Operational completion, roadmap-gate completion and evidence status remain
  separately inspectable.
- A trusted workflow needs `issues:write` to maintain labels, milestones and
  the explicitly mapped issue milestone field; all other workflow permissions
  remain read-only or absent.
- Dates stay absent until a concrete external commitment supplies both an owner
  and a defensible deadline.

## Supersession

Supersede this record if another issue tracker becomes the operational
projection, GitHub becomes the roadmap authority, milestone progress acquires a
formal scientific meaning, or managed metadata moves out of Git `main`.

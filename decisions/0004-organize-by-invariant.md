# 0004 — Organize research by recurring invariant

- **Status:** accepted
- **Date:** 2026-08-05

## Context

Different scientific disciplines often describe similar solutions to similar
constraints with domain-specific language. Organizing the project by organism
or discipline would duplicate architectures and hide convergent patterns.

## Decision

Collect observations and primary sources by domain, then map them into stable
problem–solution principles in
[`research/principle-registry.md`](../research/principle-registry.md). Deduplicate
at the level of the causal invariant, not at the level of biological mechanism
or metaphor.

## Consequences

- Domain maps retain provenance and differences.
- Concept chapters and experiments reference `P-` principle IDs and `C-` claim
  IDs instead of inventing a new organism-themed architecture for each paper.
- Repeated appearances across domains raise research priority but do not count
  as proof of an AI benefit.
- Every merged bundle records what must not be collapsed, including timescale,
  information content, reversibility, and physical cost.

# Decision 0016 — Treat order as a causal factor

- **Status:** accepted
- **Date:** 2026-08-26

## Context

Ecological priority effects, continual-learning task order, curriculum search
and ordinary scheduling can all produce different outcomes after differently
ordered events. Similar output patterns do not establish a shared mechanism.
An apparent order benefit can instead come from unequal examples, age,
capacity, optimizer state, evaluator access, search effort, compute, storage or
human tuning.

## Decision

Attribute an artificial-system effect to arrival or training order only when:

1. every arm receives the same frozen task multiset and eligible module
   identity set; realized active, consolidated, or retired module state remains
   an outcome rather than a parity constraint;
2. each identity receives the same checksummed exogenous presentations and
   task-local update ceiling; routed acceptance remains an outcome and is
   equalized only in the registered exposure-cut cells;
3. total capacity, optimizer, evaluator, tuning, stopping and lifecycle budgets
   are matched and recorded in native units;
4. order is randomized independently of task identity and seed;
5. all registered permutations remain visible, rather than selecting the best
   order after evaluation;
6. non-learning scheduling, canonical replay, mature continual-learning
   methods, random curricula and search-budget-charged optimized curricula are
   explicit nulls; and
7. age/exposure, capacity pre-emption, shared-state modification, typed
   facilitation and irreversible lock-in are crossed as separate causal cuts.

Order is therefore an experimental factor, not a default architecture rule.
No universal “early wins”, “late wins” or progress narrative is permitted.

## Consequences

- The [history-conditioned modular-succession audit](../research/audits/2026-08-26-history-conditioned-modular-succession.md)
  owns the construct firewall and source boundaries.
- The [mathematical contract](../math/history-conditioned-modular-succession.md)
  owns the parity identities, estimands, multiplicity family and kill rules.
- Existing claims C-008, C-056, C-057 and C-574, Fixture F-014, and Candidates
  004 and 019 are refined; no new claim, principle, candidate, protocol or
  fixture is created.
- A complete ordinary null that is non-inferior at lower or equal lifecycle
  cost retires the proposed transfer.

## Supersession

Supersede this record only if a later design proves that one of the parity or
causal-cut requirements is redundant across the protected order contrasts.

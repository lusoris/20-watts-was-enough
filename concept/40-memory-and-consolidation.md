# Fast memory, replay, and consolidation

## Scope

Separate rapid experience capture from slower structural learning so that the
system can adapt without rewriting stable capability after every event.

## Biological observation

Complementary Learning Systems theory describes interacting fast hippocampal
and slow cortical learning processes ([C-008](../research/claims.md#c-008)).
Offline replay and sleep are associated with consolidation, but no single
biological story directly specifies a scalable machine-learning architecture.

The deeper evidence rules out uniform storage and rehearsal. Disrupting replay
from a selected hippocampal assembly can selectively impair the associated
rodent spatial memory ([C-036](../research/claims.md#c-036)), while replay
allocation covaries with several distinct signals including reward, learning,
familiarity, and memory weakness ([C-037](../research/claims.md#c-037)). Existing
relational structure can accelerate consolidation of compatible associations
([C-038](../research/claims.md#c-038)). Retrieval can make an established memory
temporarily update-sensitive ([C-039](../research/claims.md#c-039)), although a
precise prediction-error gate in humans is disputed
([C-040](../research/claims.md#c-040)). Forgetting can also be actively regulated
by neural and glial mechanisms in specific preparations
([C-041](../research/claims.md#c-041),
[C-042](../research/claims.md#c-042)).

The useful abstraction is multiple learning timescales with controlled transfer,
not literal “day” and “night.”

## Proposed AI translation

Use four memory tiers:

| Tier | Update rate | Content | Mutation rule |
| --- | --- | --- | --- |
| Working state | per event | active context and predictions | overwritten freely |
| Episodic store | rapid | attributable trajectories and errors | append, expire, or redact |
| Slow model | controlled | reusable representations and skills | consolidation only |
| Factual store | independent | mutable, sourced propositions | explicit versioned updates |

The consolidation loop is:

1. score episodes by uncertainty, task value, novelty, estimated interference,
   redundant familiarity, and processing cost;
2. mix them with protected historical coverage;
3. open a versioned, memory-specific write window only when new evidence
   conflicts with or extends retrieved state;
4. propose slow-model updates using replay and one or more interference controls;
5. test old capability, new capability, calibration, and energy;
6. retain transiently, replay, merge into a schema, keep externally, weaken, or
   delete each candidate state; and
7. retain provenance and rollback information for every promoted or destructive
   action.

Elastic Weight Consolidation is one candidate protection mechanism
([C-009](../research/claims.md#c-009)). Replay is another
([C-010](../research/claims.md#c-010)). Neither is mandated as the final design.

## Efficiency mechanism

- Online operation avoids full-model gradient updates.
- Episodic storage permits selective reprocessing rather than immediate
  incorporation of every observation.
- A bounded replay scheduler spends maintenance bandwidth on estimated future
  value rather than age or sampling frequency alone.
- Schema-compatible information may require less integration work, provided a
  shadow test rejects false compatibility.
- Active expiry and weakening prevent obsolete state from consuming retrieval,
  storage, and replay bandwidth.
- Consolidation batches related corrections and can schedule expensive work
  when energy or hardware is available.
- Stable long-term paths become candidates for pruning and hardening only after
  regression evidence accumulates.

The total consolidation cost must be amortized:

$$
\bar{E}_{\text{event}}
= E_{\text{online}}
+ \frac{E_{\text{consolidation window}}}{N_{\text{events served}}}.
$$

Ignoring the second term would make continual learning appear artificially
cheap.

## Evidence status

- Complementary learning systems motivate the split under
  [C-008](../research/claims.md#c-008).
- EWC reduces forgetting in tested sequential tasks under
  [C-009](../research/claims.md#c-009).
- Sleep-like replay is a plausible machine mechanism under
  [C-010](../research/claims.md#c-010).
- Content-specific replay and selective allocation are supported within the
  scoped experiments under [C-036](../research/claims.md#c-036) and
  [C-037](../research/claims.md#c-037).
- Schema-sensitive consolidation is plausible under
  [C-038](../research/claims.md#c-038).
- Retrieval-induced lability is established in a narrow preparation under
  [C-039](../research/claims.md#c-039); its exact mismatch gate is disputed
  under [C-040](../research/claims.md#c-040).
- Active forgetting exists in scoped neural and glial interventions under
  [C-041](../research/claims.md#c-041) and
  [C-042](../research/claims.md#c-042), not yet as a safe AI policy.
- Open-ended consolidation across the proposed multimodal architecture remains
  speculative.

## Speculative extensions

- Generate counterfactual replay around high-surprise episodes instead of only
  replaying recorded inputs.
- Learn a consolidation scheduler from expected knowledge gain per joule.
- Estimate schema fit and interference separately instead of treating low loss
  as permission to consolidate.
- Use retrieval mismatch to create a temporary update branch that must pass
  shadow evaluation before replacing the prior memory version.
- Use module-local consolidation first and global synchronization only when a
  cross-module invariant changes.

## Failure modes

- Replay amplifies biased, adversarial, or privacy-sensitive episodes.
- Importance penalties freeze too much capacity and prevent new learning.
- Generated replay drifts away from the actual environment.
- A learned priority rule starves quiet, rare, or safety-critical memories.
- Schema matching promotes a correlated shortcut as stable structure.
- Active forgetting destroys necessary evidence or regulatory records.
- Reconsolidation-by-surprise makes adversarial retrieval a write primitive.
- Consolidation metrics miss a rare capability regression.
- The episodic store becomes an unbounded, expensive duplicate of the training
  corpus.

## Measurable predictions

- Sequential tasks show lower backward transfer loss than a matched naive
  fine-tuning baseline.
- New learning requires fewer slow-model updates without reducing retention.
- Consolidation energy amortized per served event remains below the saved
  online-training cost.
- Removing either episodic diversity or protected historical coverage produces
  a measurable regression, validating that both serve distinct roles.
- A multi-signal scheduler moves the retention–adaptation–energy frontier beyond
  uniform, recency, loss-priority, and interference-priority baselines at equal
  replay count and bytes moved.
- Explicit weakening reduces obsolete-memory intrusions without increasing
  rare-case deletion errors beyond a declared safety threshold.
- Schema-compatible items consolidate with fewer updates than violations while
  shortcut-controlled transfer remains unchanged or improves.

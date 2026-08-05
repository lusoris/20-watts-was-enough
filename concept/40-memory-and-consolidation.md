# Fast memory, replay, and consolidation

## Scope

Separate rapid experience capture from slower structural learning so that the
system can adapt without rewriting stable capability after every event.

## Biological observation

Complementary Learning Systems theory describes interacting fast hippocampal
and slow cortical learning processes ([C-008](../research/claims.md#c-008)).
Offline replay and sleep are associated with consolidation, but no single
biological story directly specifies a scalable machine-learning architecture.

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

1. select diverse, surprising, safety-relevant, and regression-relevant
   episodes;
2. mix them with protected historical coverage;
3. propose slow-model updates using replay and one or more interference controls;
4. test old capability, new capability, calibration, and energy;
5. promote, defer, or reject the candidate; and
6. retain provenance linking promoted behavior to episodes and training state.

Elastic Weight Consolidation is one candidate protection mechanism
([C-009](../research/claims.md#c-009)). Replay is another
([C-010](../research/claims.md#c-010)). Neither is mandated as the final design.

## Efficiency mechanism

- Online operation avoids full-model gradient updates.
- Episodic storage permits selective reprocessing rather than immediate
  incorporation of every observation.
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
- Open-ended consolidation across the proposed multimodal architecture remains
  speculative.

## Speculative extensions

- Generate counterfactual replay around high-surprise episodes instead of only
  replaying recorded inputs.
- Learn a consolidation scheduler from expected knowledge gain per joule.
- Use module-local consolidation first and global synchronization only when a
  cross-module invariant changes.

## Failure modes

- Replay amplifies biased, adversarial, or privacy-sensitive episodes.
- Importance penalties freeze too much capacity and prevent new learning.
- Generated replay drifts away from the actual environment.
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

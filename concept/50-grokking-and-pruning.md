# Generalization, grokking, and structural pruning

## Scope

Define when exploratory capacity may be removed and prevent “grokking” from
becoming an unmeasurable maturity story.

## Biological observation

Developing brains reorganize and remove connections while frequently used
circuits stabilize. The engineering abstraction is that capacity useful for
exploration need not remain in the mature execution graph.

The analogy breaks at any fixed pruning percentage or age-like schedule.
Synaptic strength, structural connectivity, digital weights, modules, and
hardware allocation are not interchangeable units.

## Proposed AI translation

Pruning is a gated optimization stage, not a consequence of low training loss.
A candidate module or connection becomes removable only after four independent
signals:

1. **generalization:** held-out compositional and intervention tasks remain
   stable;
2. **contribution:** causal ablation shows low unique value, not merely low
   magnitude;
3. **routing stability:** usage has remained low across environments and time;
4. **recoverability:** the removal is staged, reversible, and regression-tested.

Grokking—delayed generalization after overfitting—may be one observation in a
diagnostic suite. It is explicitly rejected as a universal certification signal
([C-011](../research/claims.md#c-011)).

The pruning loop is:

$$
M_{k+1}=\operatorname{Prune}(M_k, r_k),
\qquad
r_k=\max\{r: \Delta Q\le\epsilon_Q,\;\Delta R\le\epsilon_R\},
$$

where $r_k$ is the largest tested removal step that keeps quality loss
$\Delta Q$ and risk change $\Delta R$ inside declared bounds. No universal value
for $r_k$ is assumed.

## Efficiency mechanism

Prefer pruning that changes the execution graph:

- remove whole experts, heads, channels, or blocks when evidence allows;
- reduce routing fan-out and communication;
- compact surviving tensors and memory layouts; and
- retrain only enough to recover within the validation envelope.

Unstructured zero weights count as an efficiency gain only when hardware and
kernels skip their storage and arithmetic.

## Evidence status

- Competitive sparse subnetworks are established within lottery-ticket
  experiments under [C-012](../research/claims.md#c-012).
- Delayed generalization on small algorithmic datasets is established, but the
  universal maturity interpretation is disputed under
  [C-011](../research/claims.md#c-011).
- The proposed multi-signal pruning gate is speculative.

## Speculative extensions

- Measure causal contribution through routed counterfactuals: reroute an event
  and observe whether another module recreates the result.
- Convert repeatedly co-active micro-modules into a compact composite module
  before deleting the originals.
- Preserve dormant “seed” capacity outside the hot execution path for future
  structural growth.

## Failure modes

- In-distribution ablation misses rare or out-of-distribution functions.
- Retraining hides that pruning destroyed interpretability or modularity.
- Sparse checkpoints stay slow because kernels execute dense operations.
- Repeated prune/retrain cycles consume more energy than they save over the
  deployment lifetime.
- Routing statistics encode dataset frequency rather than functional value.

## Measurable predictions

- Structural pruning moves the quality–energy Pareto frontier after retraining
  and amortized pruning cost are included.
- Causal contribution predicts safe removal better than magnitude alone.
- Pruned systems retain performance on rare, compositional, and intervention
  tests, not only average validation loss.
- Memory footprint, bytes moved, and wall energy fall together; a parameter
  count reduction without those changes is rejected as cosmetic.

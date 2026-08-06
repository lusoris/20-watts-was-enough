# Candidate 013: bidirectional deficit–capability routing

**Stage:** 1 — distributed-allocation falsification

**Status:** held composition; not an accepted project claim

**Primary question:** under heterogeneous moving demand and resource patches,
does compressed deficit-up/context-down signaling with a local capability gate
beat delayed centralized optimization, backpressure, primal–dual allocation,
and learned routing at equal compute, messages, state, capacity, and
reconfiguration cost?

## Biological observation

In a scoped Arabidopsis nitrogen-response loop, nitrogen-starved roots emit CEP
signals, shoot receptors induce descending CEPD signals, and high-affinity
nitrate uptake is enhanced where roots also encounter nitrate
([C-207](../../research/claims.md#c-207)). The loop combines:

1. local deficit reporting;
2. integration at another scale;
3. a compact return context; and
4. local opportunity gating before expensive uptake.

This is not a new principle by itself. Backpressure and primal–dual control can
express the same causal structure. The experiment exists to decide whether the
particular separation of signals and local gate leaves any systems advantage.

## Candidate loop

```mermaid
flowchart TD
    D["Local unmet demand"] --> U["Compressed deficit upward"]
    U --> G["Intermediate/global scarcity context"]
    G --> B["Rate-limited context downward"]
    B --> Q{"Local capability or resource present?"}
    Q -->|"yes"| A["Allocate service or grow local capacity"]
    Q -->|"no"| N["Abstain and retain deficit"]
    A --> O["Outcome · cost · saturation · recovery"]
    N --> O
    O --> D
```

Editable source:
[deficit-capability-routing.mmd](../../assets/diagrams/deficit-capability-routing.mmd).

## State and units

For module $i$ at time $t$, define:

- $d_i(t)\ge0$: unmet demand in task units per second;
- $a_i(t)\in[0,1]$: dimensionless local capability availability;
- $u_i(t)\ge0$: allocated service in compute-seconds per second or watts;
- $B(t)$: total service budget in the same unit as $u_i$;
- $g(t)$: a rate-limited global or intermediate scarcity code in bits; and
- $\tau_{\uparrow,i}$ and $\tau_{\downarrow,i}$: upward and downward delays in
  seconds.

Allocation obeys

$$
\sum_{i=1}^{n}u_i(t)\le B(t),
\qquad
u_i(t)=0\ \text{when}\ a_i(t)=0,
$$

unless an arm explicitly pays to create or move capability. The second
constraint is the discriminating local gate: a global deficit signal cannot
activate a receiver that lacks the requested resource or permitted action.

### Typed inventory and opportunity lifetime

For each resource type $k$, retain separate available inventory $s_{ik}(t)$ in
task-native units, gross incoming/outgoing flow, transformation loss, expiry,
and delivered useful amount. A bidirectional gross flow is not net fulfillment,
and an average system gain cannot hide a harmed or indispensable participant
([C-571](../../research/claims.md#c-571),
[C-580](../../research/claims.md#c-580),
[C-584](../../research/claims.md#c-584)).

Extend the factorial suite with type compatibility, patch lifetime, transport
delay, intermediate toxicity, leakage, local storage, partner deletion, and
strategic withholding. Compare typed queues, backpressure, primal–dual shadow
prices, and the candidate after giving every arm the same type, lifetime, and
local-feasibility information. Reject the refinement if the local gate is only
an ordinary feasibility constraint or if the stronger nulls match element-
specific fulfillment, starvation, messages, dependency concentration, and
joules. This is the Candidate-013 side of the shared
[transported-field fixture](../../concept/07-cross-domain-convergence.md#transported-fields-are-not-messages).

## Task family

Use a modular service and embodied-sensing simulator where:

- demand and usable resource patches move independently;
- modules see local demand and local capability but not the full state;
- an intermediate controller receives compressed delayed deficits;
- links fail or change topology;
- capacity can be allocated reversibly or grown with an explicit migration and
  retirement cost;
- some modules can strategically over-report demand; and
- a second demand wave arrives before all capacity is replenished.

## Arms

1. static capacity allocation;
2. delayed centralized optimizer with full reported state;
3. tuned backpressure routing;
4. tuned primal–dual shadow-price allocation;
5. learned router with the same observations and state budget;
6. deficit-up/context-down/local-capability gating; and
7. an oracle-state ceiling that is ineligible to win.

## Equalization

Every arm receives the same:

- task arrivals, resource patches, and topology sequence;
- maximum active and reserve capacity;
- compute and wall-energy boundary;
- delivered-message and stored-state byte budget;
- reconfiguration, migration, and growth operations;
- observation delay and loss process;
- training events and simulator access; and
- permitted enforcement against dishonest demand.

## Factorial sweeps

Sweep:

- demand heterogeneity and burstiness;
- resource-patch lifetime and motion;
- upward and downward delay;
- topology churn and partition;
- context-code bit rate;
- local-capability false positive and false negative rates;
- reversible movement versus slow structural growth;
- strategic over-reporting and identity changes;
- reserve fraction; and
- second-event timing.

## Measurements

Report raw axes:

- fulfilled demand and cumulative unmet demand;
- tail starvation by module and task class;
- cumulative regret against the oracle ceiling;
- oscillation amplitude and recovery after a patch switch;
- messages, state bytes, compute, and wall energy;
- active and idle capacity;
- migration, growth, rollback, and retirement cost;
- capability-gate errors;
- concentration of allocation and monopolization; and
- second-event service after incomplete replenishment.

## Confirmatory analysis and statistical plan

The confirmatory unit is an independently generated demand/resource episode
containing the complete arrival stream, patch motion and lifetime, topology,
messages, allocations, reconfiguration, replenishment, and second event. Pair
arms on the same episode seed and initial inventory. Repeated episodes sharing a
topology, demand family, patch generator, strategic identity, or simulator world
are clustered. Hold out whole demand families, resource-motion laws, patch-
lifetime bands, topology/partition regimes, strategic behaviors, second-event
timings, and the required second application domain; random requests from one
episode do not cross development and confirmation splits.

Preregister paired contrasts against tuned backpressure, tuned primal--dual
allocation, the delayed centralized optimizer, and the learned router. Report
paired effects and simultaneous intervals for fulfilled and cumulative unmet
demand, worst-stratum starvation, oracle regret, oscillation/recovery,
second-event service, messages/state bytes, wall energy, active/idle capacity,
migration/growth/retirement cost, gate errors, and monopolization. Analyze time
series with episode-level or block-resampled uncertainty that preserves bursts
and topology dependence. Report module/task-stratified effects and tail
intervals; the oracle supplies regret only and is ineligible to win.

Freeze a gatekeeping order: no hard capacity, stability, starvation, or
strategic-monopolization failure; noninferior fulfilled demand and tail service
under task-specific margins; improved unmet demand, recovery, or second-event
service; then lower communication, state, capacity, or energy cost. Control
family-wise error over eligible comparator contrasts, primary service/cost
outcomes, factorial regimes, and the two confirmation domains with a
preregistered hierarchical procedure. Publish the complete effect/interval
matrix and adjusted decisions rather than a single routing score.

Unserved or expired requests remain unmet demand, not missing data. Jobs still
open at the horizon, patch lifetimes extending beyond observation, incomplete
growth/retirement, and unresolved second events are right-censored only for
their time-to-event analyses and retain their service/cost consequences.
Message loss, partitions, unknown topology, and unavailable local capability
are assigned experimental conditions. Instrument or log loss is a typed
missingness state with preregistered sensitivity analysis; all assigned episodes
remain in denominators.

Deficit encoding, context rate, receiver decoder, capability gate, demand-
calibration rule, strategic enforcement, reserve target, movement/growth
threshold, rollback, and retirement policy are tuned on development/validation
episodes and frozen before confirmation. Apply the frozen policy without
retuning to every held-out regime and to the second domain, including support-
qualified fallback. Promotion uses that frozen cross-domain decision, not the
best post-hoc sweep cell.

## Required ablations

- remove the upward deficit signal;
- remove the downward context;
- remove the local capability gate;
- replace receiver-specific context decoding with one shared scalar;
- make all messages instantaneous;
- forbid strategic reporting;
- keep topology fixed;
- replace structural growth with reversible capacity movement; and
- remove outcome-based demand calibration.

## Decisive predictions

The held composition predicts value only where global context is useful but a
full state map is too expensive or stale, and where local capability prevents
wasted global activation. It should lose when the centralized optimizer has
fresh state, when capability is uniform, or when backpressure already carries
the necessary deficit and feasibility information at lower cost.

## Kill criteria

Reject distinctiveness if:

- backpressure or primal–dual control ties or wins the complete frontier;
- the benefit is only extra messages, state, compute, reserve, or oracle labels;
- delay causes unstable over-allocation after a patch disappears;
- strategic modules monopolize capacity without detectable consequence;
- the local gate merely duplicates an existing feasibility constraint; or
- slow growth cannot amortize before resource patches move.

## Promotion rule

Passing the plant-derived task is insufficient. The composition must predict
its useful regime from context bandwidth, state staleness, capability
heterogeneity, and patch lifetime, then reproduce the gain in a second domain.
Otherwise it merges into backpressure, primal–dual allocation, ordinary
feasibility gating, and the existing principle bundles.

## Evidence links

- [Plant distributed-control audit](../../research/audits/2026-08-05-plant-distributed-control.md)
- [Microbial ecology and biofilms audit](../../research/audits/2026-08-05-microbial-ecology-biofilms.md)
- [Fungal networks and resource allocation audit](../../research/audits/2026-08-05-fungal-networks-resource-allocation.md)
- [C-563](../../research/claims.md#c-563)–[C-585](../../research/claims.md#c-585)
- [C-204](../../research/claims.md#c-204)–[C-217](../../research/claims.md#c-217)
- [P-001](../../research/principle-registry.md#p-001--selective-allocation)
- [P-005](../../research/principle-registry.md#p-005--use-dependent-topology)
- [P-006](../../research/principle-registry.md#p-006--homeostatic-negative-feedback)
- [P-011](../../research/principle-registry.md#p-011--transient-communication-coalitions)

## Supply-chain operations-research track

**Domain status.** Mandatory operations-research stress track. See the
[supply-chain audit](../../research/audits/2026-08-05-supply-chain-operations-research.md#exact-candidate-refinements).
Evidence: [C-627](../../research/claims.md#c-627),
[C-659](../../research/claims.md#c-659)–[C-678](../../research/claims.md#c-678).

**Typed state.** Keep forecast, request, accepted demand, backlog, lost sale,
on-hand, reserved, pipeline, inventory position, local serviceability,
qualified capacity, allocation, dispatch, and realized service separate.

**Strongest OR nulls.** Base-stock and multi-echelon inventory, Jackson and
general queueing/scheduling, max-weight/backpressure, min-cost flow and
transshipment, stochastic/robust optimization, and capacitated dynamic VRP or
receding-horizon dispatch.

**Matched-budget test.** Run paired queueing and multi-echelon/transshipment
scenarios with identical arrival, service, demand, lead-time, route, failure,
and reservation trajectories; equalize observations, messages, compute,
inventory, qualified capacity, switching, and admission authority.

**Service and recovery measurements.** Report throughput jobs/hour, mean and
$p_{95}/p_{99}$ delay, queue area job-hours, deadline service, unit/order fill,
OTIF, backlog item-hours, lost demand, transfer kilometres/items, infeasible
dispatches, source-service loss, joules/job, and recovery after failures.

**Rejection gate.** Reject if gains vanish after matching admission, capacity,
information, and switching; if movement is instantaneous; if source opportunity
cost is omitted; or if a mature queueing, flow, inventory, or dynamic-routing
null ties the tail-service frontier.

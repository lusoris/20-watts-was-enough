# Sparse prediction and adaptive compute

## Scope

This chapter specifies the online control path that decides, for each event,
whether to reuse an existing prediction, exit, invoke another module, read
memory, acquire another observation, or escalate. Its objective is not minimum
FLOPs. It is minimum measured resource use subject to explicit quality,
calibration, deadline, and safety constraints.

The runtime has three coupled but distinct jobs:

1. estimate what changed and what remains uncertain;
2. choose the next computation or observation by expected decision value; and
3. allocate physical capacity without making the fast task path unstable.

Training curricula, long-term consolidation, structural pruning, and skill
compilation are handled in other chapters. Their products may be invoked here,
but this runtime does not silently rewrite slow model state.

## Biological observation

The relevant evidence separates demand detection, distributed context, local
response, and physical supply.

### Activity is selective and regulated

Neural signaling operates under a strict metabolic budget, which constrains
the fraction of cortex that can be strongly active at once
([C-001](../research/claims.md#c-001)). In the *Drosophila* mushroom body,
feedback inhibition keeps odor codes sparse and decorrelated; disrupting that
loop impairs discrimination between similar learned odors
([C-025](../research/claims.md#c-025)). These results support selective activity
and active inhibition. They do not identify top-$k$ routing, a pruning ratio,
or a digital energy saving.

### Prediction, uncertainty, and action are different signals

Hierarchical prediction with feed-forward residuals accounts for selected
visual-cortical response properties
([C-005](../research/claims.md#c-005)). Active whisker sensing also shows why a
passive residual is incomplete: self-generated sensor mechanics affect the
observed neural code ([C-022](../research/claims.md#c-022)). A residual says
that a prediction was wrong. It does not by itself say whether the error is
irreducible noise, model ignorance, task-relevant novelty, or a reason to buy
another observation.

### Broad context is interpreted locally and temporally

Context-dependent disinhibition can change gain in a selected cortical
population ([C-020](../research/claims.md#c-020)). More direct causal work on
neuromodulation shows three constraints on a possible artificial abstraction:

- antagonistic signals can sustain different distributed behavioral modes
  ([C-046](../research/claims.md#c-046));
- the frequency and duration of one broad signal can produce different and
  non-monotonic system responses ([C-047](../research/claims.md#c-047)); and
- receptor identity and location can turn the same source into transient or
  sustained local responses ([C-048](../research/claims.md#c-048)).

The engineering candidate is therefore a rate-limited context broadcast whose
receivers own their gains, thresholds, and temporal filters. It is not a
central command containing a route for every module. Its evidence, limits, and
conventional analogues are developed in the
[neurodevelopment and global-control audit](../research/audits/2026-08-05-neurodevelopment-global-control.md).

### Demand and physical supply can be locally coupled

Presynaptic ATP production can be recruited by local activity
([C-049](../research/claims.md#c-049)); mitochondrial docking changes resource
placement and local synaptic dynamics ([C-050](../research/claims.md#c-050));
and neural activity can recruit an adjacent vascular response in the studied
rodent preparations ([C-051](../research/claims.md#c-051)). The transferable
constraint is modest: measure demand near work, account for placement, and let
an infrastructure layer adjust supply. The neurovascular paper's model-derived
percentage is not an architecture constant, and none of these cellular results
provides a conversion from ATP to accelerator joules.

Taken together, the observations motivate a layered controller: fast local
prediction and gating, a narrow context path, and a slower resource plane. The
architecture still has to beat standard estimation, decision, routing, and
control methods.

## Proposed AI translation

### Separate the quantities before making a gate

Let $y_t$ be an observation in its declared sensor units and
$\hat y_{t|t-1}$ the prediction available before observing it. Define the raw
residual

$$
r_t = y_t-\hat y_{t|t-1}.
$$

If the predictor supplies a calibrated residual covariance $S_t$, the
normalized innovation is

$$
\nu_t = r_t^{\mathsf T}S_t^{-1}r_t.
$$

$r_t$ has the units of $y_t$; $\nu_t$ is dimensionless. A large $r_t$ with a
large expected $S_t$ may be unsurprising. Conversely, a small residual in a
safety-critical variable may justify action. The runtime therefore carries
separate fields for:

| Quantity | Meaning | Unit or representation |
| --- | --- | --- |
| residual $r_t$ | observed minus predicted state | observation units |
| normalized innovation $\nu_t$ | residual relative to predicted covariance | dimensionless |
| aleatoric uncertainty | expected irreducible variability | distribution in output units |
| epistemic uncertainty | model uncertainty or support deficit | calibrated probability or ensemble statistic |
| task risk | cost of acting or exiting incorrectly | probability and consequence in task units |
| expected acquisition value $\Delta U_t(a)$ | expected decision improvement from action $a$ | declared utility units |
| estimated energy $\hat E_t(a)$ | energy for acquisition and downstream work | joules |
| estimated latency $\hat L_t(a)$ | completion time including queueing | seconds |
| traffic $\hat B_t(a)$ | memory or network movement | bytes |
| context rate $R_b$ | transmitted global operating context | bits per second |

No implementation may collapse all of these into “confidence” and retain the
same claim. Residual magnitude, likelihood, expected value, and risk answer
different questions.

### Observation is affected by action

The acquisition model must also represent how sensing and response change the
future observation channel. Operational telemetry can be delayed, incomplete,
pooled, or policy-coupled: robust residual methods remain strong nulls
([C-124](../research/claims.md#c-124)); current counts can omit events that
occurred but have not yet arrived ([C-126](../research/claims.md#c-126)); pooled
signals can trade attribution for coverage ([C-127](../research/claims.md#c-127));
and a fast behavioral proxy can drift with platform, attention, or policy
([C-128](../research/claims.md#c-128)).

More importantly, an action can alter both hidden state and telemetry. Isolation
may reduce propagation while also removing the isolated component's messages;
throttling can suppress an error count by suppressing all traffic; a warning can
change user behavior; and a new sensor policy changes which events can be
observed. The controller therefore versions coverage, delay, ascertainment,
observation-model state, and every sensing or response action. A drop in the
post-action residual is not independent recovery evidence
([C-131](../research/claims.md#c-131)).

[Candidate 007](../experiments/candidates/007-endogenous-observation-surveillance.md)
tests joint process/observation estimation against residual CUSUM/GLR,
nowcasting, maximum coverage, value-of-information sampling, and delay-aware
POMDP or model-predictive control. It must use true data vintages, preserve
subgroup coverage, estimate counterfactual observation paths, and charge
investigation and action capacity as well as compute.

### Price a menu of acquisitions

At event $t$, the system considers a finite action menu $\mathcal A_t$:

```text
exit | reuse cached state | run local refinement | invoke expert
     | read episodic/factual memory | acquire sensor action | call tool
     | escalate to a larger model or human
```

For acquisition $a$, estimate the expected improvement in decision utility
$\Delta U_t(a)$ and its full energy, latency, and traffic costs. A Lagrangian
form of the selection rule is

$$
a_t^* = \arg\max_{a\in\mathcal A_t}
\left[
\Delta U_t(a)
-\lambda_E\hat E_t(a)
-\lambda_L\hat L_t(a)
-\lambda_B\hat B_t(a)
\right],
$$

subject to hard task constraints such as

$$
\Pr(\text{unsafe outcome}\mid a,\mathcal I_t)\le\delta,
\qquad
\hat L_t(a)\le L_{\max}.
$$

$\mathcal I_t$ is the information legally available when event $t$ is
decided, $\delta\in[0,1]$ is the preregistered maximum conditional probability
of an unsafe outcome, and $L_{\max}$ is the latency ceiling in seconds.
$\lambda_E$, $\lambda_L$, and $\lambda_B$ have units utility/joule,
utility/second, and utility/byte respectively, converting the three costs into
the declared utility scale. When those conversions cannot be defended,
use constrained multi-objective selection and report a Pareto surface instead
of inventing a scalar score. An action with high information gain but no
expected decision benefit receives no credit.

### Three runtime timescales

| Loop | Typical cadence | State owned | Permitted actions |
| --- | --- | --- | --- |
| event loop | per sensor event or token | prediction, residual, uncertainty, risk, route | no-op, exit, acquire, route, escalate |
| context loop | one or more explicitly rate-limited cadences | small broadcast plus receiver-local filtered state | change local gain, threshold, mode, or compute eligibility |
| resource loop | slower than task execution and bounded by actuation delay | queues, utilization, temperature, energy, bandwidth prices | adjust local capacity, apply backpressure, reserve or release routes |

The event loop cannot raise its own power or bandwidth allocation. It requests
capacity through the resource plane. The resource plane cannot change task
semantics or fabricate confidence; it changes supply and prices. The context
loop cannot transmit a per-module command table under the name “broadcast.”

### Concrete per-event sequence

1. **Timestamp and classify the event.** Record source, modality, freshness,
   deadline, and risk class. Missing timestamps make prediction error and
   queue latency ambiguous.
2. **Run a local change test.** Compare the event with the last accepted local
   state using a sensor-noise model. Below-threshold change creates a no-op or
   cached-prediction candidate, not an automatic exit.
3. **Predict before incorporating the event.** Produce $\hat y_{t|t-1}$,
   residual covariance $S_t$, and the task outputs available at the cheapest
   depth.
4. **Decompose mismatch.** Compute $r_t$ and $\nu_t$; update a separate
   sequential change statistic for persistent drift; estimate epistemic
   uncertainty and task consequence.
5. **Test the cheapest valid exit.** Exit only if calibration for the event's
   risk stratum satisfies its error bound and no mandatory provenance,
   freshness, or tool check remains.
6. **Update the context receivers.** If a fast or slow broadcast update is due,
   each subscribed module applies its own causal filter, bounded gain, and
   local-state-dependent threshold. The received bitstream and local response
   are logged.
7. **Value the remaining acquisitions.** Estimate $\Delta U_t(a)$ and full
   costs for the available experts, memories, sensors, tools, and escalation
   paths. Reject actions whose expected value does not exceed their priced
   cost or whose completion misses the deadline.
8. **Route under capacity constraints.** Select the smallest useful set of
   modules. Include queue delay, expert load, communication, and state
   placement. Open reserve routes before tail latency collapses only if the
   measured congestion rule warrants it; the ant result in
   [C-035](../research/claims.md#c-035) is a lead, not the routing algorithm.
9. **Execute with local backpressure.** A module consumes its local compute,
   memory, and bandwidth budget. Exhaustion triggers deferral, a cheaper
   approximation, or escalation; it never silently drops a safety check.
10. **Reconcile prediction and cost.** Update output, uncertainty, and the
    measured resource ledger. If the risk bound is unmet and deadline and
    budget remain, return to acquisition valuation. The loop has a fixed
    maximum iteration count.
11. **Emit an attributable result.** Return prediction or action together with
    confidence calibration version, routes used, evidence provenance, elapsed
    time, and measured or allocated energy. Runtime telemetry enters later
    maintenance analysis; it does not directly rewrite slow weights.

### Control topology

```mermaid
flowchart TB
    subgraph fast["Event loop"]
        direction LR
        event["Timestamped event"] --> predict["Predict change · uncertainty · risk"]
        predict --> decide{"Exit or acquire?"}
        decide -->|"exit"| output["Attributed output"]
        decide -->|"acquire"| work["Expert · memory · sensor · tool"]
        work --> update["Update result + measured cost"]
        update --> decide
        decide -->|"budget exhausted"| fallback["Safe fallback / explicit failure"]
    end
    subgraph context["Rate-limited context loop"]
        direction LR
        global["Operating observations"] --> encoder["Fast + slow encoder"]
        encoder --> receivers["Receiver-local filters + gains"]
    end
    subgraph resource["Slower resource loop"]
        direction LR
        telemetry["Queues · bytes · energy · temperature"] --> controller["Resource controller"]
        controller --> prices["Capacity · prices · reserve · backpressure"]
    end
    receivers -.-> decide
    receivers -.-> work
    work --> telemetry
    prices -.-> decide
    prices -.-> work
```

Editable source:
[`../assets/diagrams/adaptive-compute-control.mmd`](../assets/diagrams/adaptive-compute-control.mmd).

### Context is a constrained interface

The context candidate sends a small quantized code at declared fast and slow
rates. Receivers expand it locally through distinct filters and bounded transfer
functions. This is useful only when receiver-local structure reconstructs
module-specific responses more cheaply than transmitting them.

[Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md)
tests that proposition against instantaneous and shared-filter FiLM, memoryless
and recurrent gates, bottleneck and standard global tokens, low-rank
hypernetworks, fixed multirate receiver banks, and gain-scheduled supervisory
control. Its primary channel is two 8-bit components at different cadences,
with an average logical rate of $825\ \mathrm{bit\,s^{-1}}$. That number is an
experiment setting, not a proposed universal bus rate.

### Engineering null models

Biological language is removed when an established method explains the result
at the same cost.

| Proposed role | Null model that must be included | Result if null matches |
| --- | --- | --- |
| detect unexpected input | calibrated Kalman innovation or likelihood residual | call it residual gating |
| distinguish a persistent change | Page/CUSUM accumulate–reset detector | call it change detection |
| decide whether to buy more information | one-step expected value of sample information | call it value-of-information control |
| skip depth on easy cases | calibrated intermediate classifier / early exit | call it adaptive depth |
| select capacity | top-$k$ mixture-of-experts with load balancing | call it conditional routing |
| stabilize utilization or queue load | tuned PI and Kelly-style primal/dual allocation | call it feedback resource control |
| distribute operating context | FiLM, recurrent gates, learned global tokens, and hypernetworks | retain the simplest winning conditioner |
| separate fast and slow control | tuned multirate or gain-scheduled supervisory controller | call it multirate control |
| place recurring state near work | static placement, LRU/cache policy, and NUMA-aware scheduling | call it caching or placement |

The equations and unit requirements for innovation, value of information,
CUSUM, allocation, and energy are recorded in the
[engineering-analogue audit](../research/audits/2026-08-05-engineering-analogues.md#shared-equations-and-units).

## Efficiency mechanism

### Sparse work has four independent levers

The runtime can save resources by:

1. suppressing unchanged events;
2. exiting at a cheaper validated depth;
3. activating fewer modules or memory paths; and
4. avoiding movement by keeping repeated work near its state.

These levers are not interchangeable. An early exit can reduce arithmetic while
leaving input and cache traffic unchanged. Sparse experts can reduce active
weights while increasing all-to-all communication. Local placement can reduce
bytes moved without reducing operations.

For module gates $g_i(x)\in[0,1]$ and declared operation costs $c_i(x)$, define
the operation-weighted active fraction

$$
\rho_{\mathrm{ops}}(x)=
\frac{\sum_i g_i(x)c_i(x)}{\sum_i c_i(x)}.
$$

Also report byte-weighted activity $\rho_{\mathrm{bytes}}$ from measured memory
and network traffic. Neither quantity is an energy estimate.

### Charge every control path

Over the same measurement interval,

$$
E_{\mathrm{adaptive}} =
E_{\mathrm{predict}}
+E_{\mathrm{gate}}
+E_{\mathrm{route}}
+E_{\mathrm{active}}
+E_{\mathrm{memory}}
+E_{\mathrm{network}}
+E_{\mathrm{context}}
+E_{\mathrm{control}}
+E_{\mathrm{idle}}.
$$

Every term is in joules. The runtime produces an efficiency gain only when

$$
E_{\mathrm{adaptive}} < E_{\mathrm{dense}}
$$

at matched quality, risk, latency class, batch opportunity, and hardware
boundary. Report board, node, and facility energy separately when measured;
do not infer one from another.

State movement and controller work must also amortize. For a placement,
compilation, or cache migration completed $N$ times, let
$E_{\mathrm{runtime}}$ be incremental runtime energy in joules per completed
use; let $E_{\mathrm{discover}}$, $E_{\mathrm{migrate}}$, and
$E_{\mathrm{validate}}$ be one-time energies in joules; and let $N$ be a
dimensionless completed-use count. Then

$$
\bar E_{\mathrm{use}} = E_{\mathrm{runtime}}
+\frac{E_{\mathrm{discover}}+E_{\mathrm{migrate}}+E_{\mathrm{validate}}}{N}.
$$

$\bar E_{\mathrm{use}}$ is joules per completed use.
If $N$ is not observed, report the break-even reuse count rather than claiming
a saving.

### Resource supply is a feedback problem

For one optimization instance, choose a single rate basis—requests per second,
tokens per second, or bits per second—and let $x_i$ be module $i$'s allocation
in that unit. Let $U_i(x_i)$ be a nondecreasing concave utility normalized to a
common dimensionless scale, let $R$ be a dimensionless resource-incidence
matrix, and let each component of $c$ be capacity in the same chosen rate unit.
A conventional allocation null is

$$
\max_{x\ge0}\sum_i U_i(x_i)
\quad\text{subject to}\quad Rx\le c.
$$

The slower resource plane observes queues, deadlines, utilization, energy, and
temperature, then adjusts capacity or prices. Any learned controller must beat
a tuned PI or primal/dual implementation on settling time, overshoot,
constraint violations, tail latency, and joules per control update. “Local
metabolism” is not a substitute for that comparison.

## Evidence status

| Component | Current support | Status for this architecture |
| --- | --- | --- |
| strict biological activity budget | [C-001](../research/claims.md#c-001) | established biological constraint; digital magnitude unassigned |
| sparse conditional capacity | [C-003](../research/claims.md#c-003) | established AI mechanism; end-to-end benefit workload-dependent |
| input-dependent early exit | [C-004](../research/claims.md#c-004) | established on evaluated BERT tasks; risk-stratified generality open |
| cortical residual hierarchy | [C-005](../research/claims.md#c-005) | plausible engineering lead, not a universal brain objective |
| event-driven on-chip learning | [C-015](../research/claims.md#c-015) | feasible on one published substrate; superiority not established |
| slower activity stabilization | [C-018](../research/claims.md#c-018) | established in cultured neurons; artificial set point open |
| context-dependent local gain | [C-020](../research/claims.md#c-020) | established for the studied mouse circuit; routing value open |
| active sensing mechanics | [C-022](../research/claims.md#c-022) | established for the whisker preparation; acquisition policy open |
| inhibitory sparse discrimination | [C-025](../research/claims.md#c-025) | established for the fly circuit and task; hardware benefit open |
| congestion-triggered reserve route | [C-035](../research/claims.md#c-035) | established in the ant experiment; conventional routing remains the null |
| multirate broadcast and local decoding | [C-046](../research/claims.md#c-046)–[C-048](../research/claims.md#c-048) | biological observations established; AI mechanism is Candidate 002 |
| local demand, placement, and supply | [C-049](../research/claims.md#c-049)–[C-051](../research/claims.md#c-051) | cellular observations established; artificial resource plane untested |
| sparse, delayed, pooled, and policy-coupled surveillance | [C-122](../research/claims.md#c-122)–[C-131](../research/claims.md#c-131) | scoped epidemiological and statistical evidence; AI-system translation is Candidate 007 |
| joint process/observation estimation with action provenance | [C-132](../research/claims.md#c-132) | speculative composition against POMDP, detection, nowcasting, and value-of-information nulls |

The integrated runtime is speculative until its gates are tested separately
and then recombined under one measurement boundary. A combined win cannot
identify which control path caused it.

## Speculative extensions

### Residual queues instead of global lockstep

Each module could own a queue of unresolved residuals and wake only when local
work, context, or a deadline changes its priority. The comparator is an
efficient batched scheduler with the same queue and dispatch overhead. The
extension is abandoned if asynchronous launches reduce utilization or increase
p95 latency enough to erase skipped work.

### Predictive placement

Frequently reused expert weights, key–value state, and memories could move
toward their expected consumers. The hypothesis is about reuse-distance and
migration amortization, not artificial mitochondria. Static placement, LRU,
and NUMA-aware policies remain required baselines; every migration is charged
in bytes, seconds, and joules.

### Controlled recovery probes

A maintenance observer could inject small bounded perturbations and measure
recovery time, overshoot, and restoring margin before ordinary quality metrics
fail. This is specified in
[Candidate 003](../experiments/candidates/003-recovery-dynamics-fragility.md).
Recovery diagnostics do not themselves stabilize the runtime, and their probe
energy and task disturbance remain part of the cost.

### Cross-modal acquisition brokerage

A common valuation layer could choose between deeper internal computation, a
memory lookup, another sensor view, a physical action, a tool call, or a human
query. Each option needs a calibrated outcome model and a common decision
contract. Entropy reduction alone is not sufficient because an observation can
be surprising yet irrelevant to the pending action.

## Failure modes

| Failure | Observable signature | Rejection or containment rule |
| --- | --- | --- |
| residual–uncertainty conflation | high-noise inputs always buy more compute without improving decisions | compare against normalized innovation and EVSI; reject residual-only gate |
| overconfident early exit | average accuracy holds while rare or shifted strata fail calibration | impose risk-stratified exit bounds and safe fallback |
| router collapse | a few experts saturate, queues and p95 latency rise, reserve capacity idles | compare load-balanced MoE and constrained allocation; reject unstable router |
| granularity below hardware break-even | active FLOPs fall but kernel count, bytes, latency, or joules rise | coarsen gates or return to dense fused execution |
| broadcast becomes a hidden router | context rate, token width, or receiver traffic scales with module count | enforce quantization, cadence, and logged bit/byte budgets |
| receiver saturation or mode lock | stronger context produces non-monotonic failure, unrecoverable hysteresis, or uniform module response | bound gains, test impulse responses, retain redundant fallback |
| positive feedback between routing and supply | busy modules receive more capacity, attract more traffic, and monopolize service | separate router and resource objectives; test step, burst, and delay stability |
| controller oscillation | periodic queue, power, or route changes with excess settling time | include anti-windup and delay-aware PI/primal-dual nulls; reject learned loop if dominated |
| resource-proxy gaming | predicted “useful work” rises while task utility per joule falls | reconcile estimates against measured outcome and energy |
| state-migration thrash | repeated placement changes exceed saved memory traffic | require hysteresis and observed break-even reuse count |
| shortcut no-op | unchanged-input gate suppresses slow but important drift | maintain persistent-change statistic and scheduled freshness checks |
| accounting boundary leak | reported savings omit host, network, idle, context, or control energy | withhold efficiency claim until the missing boundary is measured |

## Measurable predictions

These are experiment commitments. Directional improvements require paired
uncertainty intervals and a predeclared practical margin; a lower theoretical
operation count is not a pass.

| ID | Intervention and comparator | Primary measurements | Prediction and failure boundary |
| --- | --- | --- | --- |
| AC-01 | calibrated early exit versus fixed depth and uncalibrated confidence threshold | error and calibration by risk stratum; layers/item; J/item; p95 ms | lower J/item at equivalent high-risk error and calibration; reject if gains come from degraded rare-event performance |
| AC-02 | residual/uncertainty/EVSI acquisition policy versus raw residual threshold, Kalman innovation, CUSUM, and one-step EVSI | downstream utility; acquisitions/item; false escalations/item; bytes/item; J/item | candidate must move the utility–energy–latency frontier beyond the strongest composed null; otherwise use the null |
| AC-03 | sparse expert and memory routing versus dense execution and load-balanced top-$k$ MoE | active operations; memory and network bytes; queue depth; p95 ms; J/item | physical bytes and joules must fall with active operations at matched quality; a FLOP-only reduction fails |
| AC-04 | Candidate 002 multiscale receiver versus FiLM, GRU gate, global token, hypernetwork, and multirate control | task error; impulse-kernel NRMSE; bit/s; bytes/step; J/step; p95 ms | require at least 5% task and 10% kernel improvement over the best equal-interface simple baseline, then task equivalence to the higher-bandwidth method with at least 25% fewer context bytes or 5% less energy and no more than 5% p95-latency increase |
| AC-05 | local resource plane versus tuned PI, Kelly/primal-dual, and centralized fixed allocation | settling s; overshoot %; violations/s; utilization %; J/control update; J/item | learned/local control must improve a quality–tail-latency–energy frontier under burst and delay; equality means merge into conventional control |
| AC-06 | predictive placement versus static placement, LRU, and NUMA-aware scheduling | migration bytes; cache misses/item; p95 ms; J/item; break-even reuse count | placement wins only after migration and validation amortize within observed reuse; otherwise retain the conventional policy |
| AC-07 | difficulty-controlled input sets with equal length but varied ambiguity, relevance, and risk | acquired work/item; J/item; task utility; calibration | work should track expected decision value and risk, not length or irrelevant noise; extra work without utility improvement falsifies the allocator |
| AC-08 | distribution shift and rare-event stress with every adaptive gate enabled | worst-stratum error; expected calibration error; missed-hazard probability; safe-fallback rate; J/item | adaptive savings must survive the declared risk bounds; a favorable average with a worse safety tail fails |

Mechanism ablations are interpreted selectively. Removing the exit gate should
increase depth without changing routing identity; removing sparse routing
should increase active modules and traffic; removing the context fast path
should selectively damage transient response; removing the slow path should
selectively damage sustained response; freezing resource control should worsen
burst recovery rather than semantic accuracy. If every ablation merely lowers
capacity and hurts everything, the architecture has not isolated its claimed
control loops.

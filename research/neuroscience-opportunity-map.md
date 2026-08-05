# Neuroscience opportunity map

This file turns biological observations into engineering questions. It is not a
catalogue of everything brains do, and it deliberately excludes mechanisms
whose only argument is resemblance. Each candidate must identify the
computation, the possible gain, and a test that could reject it.

## 1. Dendritic subunits: local computation inside a unit

**Observation.** Inputs arriving near one another on a thin pyramidal-cell
dendrite can combine nonlinearly, while inputs on different branches combine
more nearly linearly in the experiment captured by [C-017](claims.md#c-017).
Treating a neuron as one weighted sum discards this branch-local structure.

**Engineering abstraction.** Give a unit or expert several small local
compartments. Each compartment detects a conjunction or temporal coincidence;
only the compartment summaries reach the global unit. The abstraction could be
implemented with grouped kernels, local attention, product units, or
hierarchical routing—literal dendrite simulation is not required.

**Possible gain.** More conditional expressivity near stored state, fewer
global messages, and local credit assignment.

**First rejection test.** Compare a compartmental unit with an MLP and a small
mixture of experts at matched parameters, active operations, memory traffic,
and quality. Test compositional conjunctions and continual addition of new
features. Remove branch locality in an ablation.

**Main danger.** The mechanism becomes an ordinary wider network with more
overhead and a biological name.

## 2. Homeostatic plasticity: stability is an active process

**Observation.** Cultured neocortical neurons can scale synaptic strengths in a
direction that compensates for prolonged activity changes while approximately
preserving relative differences ([C-018](claims.md#c-018)). This is distinct
from task-error minimization.

**Engineering abstraction.** Add slow control loops that maintain target ranges
for module activation, router load, update magnitude, uncertainty, or memory
occupancy. The target range may depend on context; it must not be a single fixed
firing-rate metaphor.

**Possible gain.** Prevent dead experts, runaway feedback, plasticity collapse,
and resource monopolization under a changing data stream.

**First rejection test.** Create abrupt and gradual distribution shifts in a
conditionally routed model. Compare loss-only load balancing with a slow
homeostatic controller. Measure recovery time, retained skill, calibration,
router entropy, traffic, and energy.

**Main danger.** A stable metric hides a failing representation—for example,
perfectly balanced experts that are equally useless.

## 3. Eligibility plus modulation: delayed outcomes with local responsibility

**Observation.** Dopamine can retroactively alter spike-timing-dependent
plasticity in hippocampal slices, providing a concrete instance of a local
eligibility trace gated by a later modulatory signal
([C-019](claims.md#c-019)).

**Engineering abstraction.** A responsible connection or module records a
short-lived local trace; a later reward, surprise, safety, or task signal
decides whether and how it changes:

$$
e_{ij,t} = \lambda e_{ij,t-1} + f(x_{i,t}, y_{j,t}),
\qquad
\Delta w_{ij,t} = \eta M_t e_{ij,t}.
$$

Here $e_{ij,t}$ is the eligibility trace from unit $i$ to unit $j$, $\lambda$ is
its retention factor, $f$ is a local pre/post activity rule, $M_t$ is the later
modulatory signal, and $\eta$ is the learning rate.

**Possible gain.** Online adaptation without storing a full global backward
graph for every event; delayed credit limited to the modules that participated.

**First rejection test.** Use a partially observable control task with delayed
outcomes. Compare full backpropagation through time, policy-gradient baselines,
and local eligibility updates at matched experience and wall energy. Corrupt
the delay or participating-module record as an ablation.

**Main danger.** A global modulator becomes a noisy broadcast that reinforces
spurious correlations or destabilizes old skills.

## 4. Inhibition and disinhibition: gates with opponent roles

**Observation.** VIP-expressing cortical interneurons can suppress other
inhibitory populations and selectively increase the gain of principal cells in
response to reinforcement signals ([C-020](claims.md#c-020)). The computational
motif is not merely “negative weights”; it is context-dependent release from
suppression.

**Engineering abstraction.** Separate route proposals, vetoes, and contextual
release into distinct controllers. A module may remain suppressed by default,
then be disinhibited for a task, novelty event, or protected exploration phase.

**Possible gain.** Cleaner conditional activation, explicit safety vetoes, and
less destructive competition than a single softmax router.

**First rejection test.** Compare a standard top-$k$ gate with a three-role
router on multi-context tasks. Measure specialization, collapse, recovery after
context change, unsafe activation, traffic, and energy. Test whether an ordinary
larger gate explains the result.

**Main danger.** Extra controllers add latency and merely redistribute router
failure.

## 5. Astrocytes and glia: a maintenance plane

**Observation.** Mouse studies show activity-dependent astrocytic elimination
of adult hippocampal excitatory synapses and a contribution of hippocampal
astrocytes to remote-memory formation in specific experiments
([C-021](claims.md#c-021)). These results do not establish one universal “glial
algorithm.” They do show that connectivity maintenance and memory regulation
are not performed by neurons alone.

**Engineering abstraction.** Separate the fast inference/learning plane from a
slow maintenance plane. The latter observes utilization, conflict, replay
coverage, uncertainty, and resource cost; it can propose pruning, repair,
reallocation, or consolidation, subject to tests and rollback.

**Possible gain.** Keep the main model focused on task computation while a
slower process manages lifecycle stability and physical resources.

**First rejection test.** On a sequential-learning stream, compare fixed
schedules with a maintenance controller that selects replay and reversible
pruning. Charge the controller's own compute and storage. Require every action
to be explainable through logged signals.

**Main danger.** The maintenance plane becomes an unaccounted second AI system,
or prunes rare capabilities because utilization is an incomplete value signal.

## 6. Active sensing: perception is a controlled intervention

**Observation.** Sensory signals during natural behavior depend on how an
animal moves its sensing apparatus; in active whisker exploration, mechanical
forces predict primary-neuron activity better than whisker angle in the cited
experiment ([C-022](claims.md#c-022)). Passive datasets omit part of that
sensorimotor loop.

**Engineering abstraction.** Train an agent to choose observations: move a
sensor, request another modality, manipulate an object, run a tool, or ask a
disambiguating question. Predict sensory consequences conditioned on the
chosen action.

**Possible gain.** Resolve uncertainty with targeted evidence instead of
spending more compute on ambiguous passive input.

**First rejection test.** Give matched agents the same maximum observation
budget; one receives fixed observations and the other selects them. Evaluate
held-out interventions, calibration, observation cost, latency, and energy.

**Main danger.** The active agent receives more information or causes unsafe
interventions, making the comparison or deployment invalid.

## 7. Transient temporal coupling: routing in time, not only topology

**Observation.** Human MEG measurements can be described by repeated visits to
short-lived, frequency-specific phase-coupled network states
([C-030](claims.md#c-030)). Evidence that such coupling is a causal general
routing algorithm is weaker than evidence that the transient states exist.

**Engineering abstraction.** Permit modules to exchange state only in learned
time slots or phase groups. This is a form of temporal multiplexing: topology
can remain fixed while effective connectivity changes.

**Possible gain.** Reduce contention and cross-talk, coordinate modules with
different update rates, and reuse an interconnect among sparse coalitions.

**First rejection test.** Compare phase/slot-gated communication with an
ordinary asynchronous queue and learned router under the same bandwidth and
latency. Reject the idea if the temporal code adds no benefit beyond scheduling.

**Main danger.** Oscillatory language hides an arbitrary clocking scheme or
introduces synchronization cost larger than the traffic saved.

## 8. Metaplasticity and structural maintenance: watchlist

These mechanisms are scientifically relevant but need a tighter source and
translation audit before promotion to the claim ledger:

- plasticity rules whose own learning rate changes with estimated volatility;
- controlled reopening of high-plasticity “critical” periods;
- targeted forgetting as interference management rather than failure;
- adaptive myelination as timing coordination, not a metaphor for quantization;
- neurovascular resource allocation as a local compute-budget market;
- immune-like monitoring of damaged or anomalous internal components; and
- adult structural plasticity that adds or removes connections without a full
  retraining event.

The next literature pass should ask, for each item: what causal experiment
establishes the biological function, what artificial translation already
exists, and what smallest benchmark distinguishes the mechanism from a standard
optimizer, router, cache, or scheduler?

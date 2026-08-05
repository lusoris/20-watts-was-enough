# Fast memory, replay, and consolidation

> Experience should change behavior immediately without receiving immediate
> permission to rewrite stable capability.

## Scope

Memory is a lifecycle: capture an event, preserve its origin, decide whether it
deserves more work, test an integration, then retain, transform, externalize,
weaken, or delete it. The objective is rapid adaptation without granting every
surprising event permission to rewrite stable capability.

## One memory lifecycle

```mermaid
flowchart TB
    subgraph capture["1 · Capture with provenance"]
        direction LR
        event["Event + outcome"] --> episode["Attributable episode"]
        episode --> score["Value · conflict · cost · risk"]
    end
    subgraph maintain["2 · Choose a reversible action"]
        direction LR
        action{"Maintenance action"} --> branch["Replay / merge branch"]
        action --> factual["Externalize fact"]
        action --> retire["Defer · weaken · delete"]
    end
    subgraph promote["3 · Prove before promotion"]
        direction LR
        tests["Retention · adaptation · energy tests"] --> result{"Pass?"}
        result -->|"yes"| durable["Durable skill / slow model"]
        result -->|"no"| retained["Keep episode; reject update"]
    end
    score --> action
    branch --> tests
    factual --> runtime["Future runtime"]
    durable --> runtime
    retire --> record["Provenance / tombstone"]
```

Editable source:
[`../assets/diagrams/memory-lifecycle.mmd`](../assets/diagrams/memory-lifecycle.mmd).

The lifecycle separates two decisions often collapsed into “learning”:

1. **What should be remembered now?** Capture is fast, attributable, and
   reversible.
2. **What should change the durable system?** Consolidation is selective,
   tested, and budgeted.

## Biological observation

Complementary Learning Systems theory describes interacting fast hippocampal
and slower cortical learning processes ([C-008](../research/claims.md#c-008)).
The useful pattern is not only different storage speeds. It is controlled
transfer between a rapidly changing record of experience and structure whose
value depends on remaining stable.

The evidence also makes replay a selection problem:

- disrupting replay from a selected hippocampal assembly can selectively
  impair the associated rodent spatial memory
  ([C-036](../research/claims.md#c-036));
- replay allocation varies with reward, learning, familiarity, and memory
  weakness rather than following one universal priority
  ([C-037](../research/claims.md#c-037));
- existing relational structure can accelerate integration of compatible
  associations ([C-038](../research/claims.md#c-038));
- retrieval can make an established memory temporarily update-sensitive
  ([C-039](../research/claims.md#c-039)), although the exact human
  prediction-error gate remains disputed
  ([C-040](../research/claims.md#c-040)); and
- forgetting can be actively regulated by neural and glial mechanisms in
  specific preparations ([C-041](../research/claims.md#c-041),
  [C-042](../research/claims.md#c-042)).

Together they motivate a maintenance controller that allocates limited work
across capture, replay, integration, protection, and forgetting.

## Proposed AI translation

### 1. Separate stores by write authority

| Store | Update rate | Content | Normal mutation |
| --- | --- | --- | --- |
| Working state | every event | active context, goals, predictions | overwritten freely |
| Episodic store | rapid | sourced trajectories, outcomes, errors | append, expire, redact |
| Slow model | controlled | reusable representations and skills | validated consolidation |
| Factual store | independent | mutable, attributable propositions | explicit versioned update |

The separation is about authority, not hardware. A vector store, database,
recurrent state, adapter, and model weights may share a device while obeying
different write policies. One logical store may also span devices when locality
or retention requires it.

### 2. Capture evidence before abstracting it

Each episode records enough context to explain a later update:

- observation and relevant prior state;
- action, answer, or intervention;
- outcome and uncertainty;
- data and tool provenance;
- active modules and retrieved memories;
- physical telemetry; and
- privacy, retention, and safety constraints.

The episode need not contain every hidden activation. It must preserve enough
attributable evidence to reproduce, challenge, or reverse the lesson later
derived from it.

### 3. Allocate the maintenance budget

At a maintenance window, the controller estimates what each candidate action
could improve and what it would cost. Novelty, reward, uncertainty,
familiarity, conflict, interference, and schema fit are features—not
interchangeable definitions of importance.

The first controller should earn its complexity against ordinary policies:

1. uniform reservoir replay;
2. recency;
3. loss- or TD-error priority;
4. interference priority;
5. schema-fit priority; and
6. the proposed multi-signal lifecycle policy.

Every method receives the same episode bytes, replay examples, optimizer
updates, wall time, and energy boundary. This makes scheduling policy—not extra
maintenance—the independent variable.

### 4. Branch, test, then promote

Retrieval or replay opens a versioned candidate branch. It never makes the
durable state writable by itself. The branch may modify a local adapter,
module, route, representation, or factual record and is then tested for:

- retention of protected historical capability;
- acquisition of the proposed new capability;
- calibration and rare-case behavior;
- provenance and conflict handling;
- measured energy, bytes moved, and latency; and
- reversibility after rejection.

Replay and Elastic Weight Consolidation are distinct comparison mechanisms
([C-009](../research/claims.md#c-009),
[C-010](../research/claims.md#c-010)); neither is privileged as the final
protection policy.

A passed branch can merge into the slow model, remain provisional, or enter the
[maturity and structural-consolidation lifecycle](50-grokking-and-pruning.md).
A failed branch returns the episode with its negative result attached so the
same invalid integration is not proposed indefinitely.

### 5. Forgetting is an action

Unbounded retention consumes storage, retrieval bandwidth, replay capacity,
and attention. The controller therefore distinguishes:

| Action | Effect | Required safeguard |
| --- | --- | --- |
| Defer | preserve without more work | future reconsideration rule |
| Replay | spend work to test or strengthen | equal replay budget |
| Merge | compress compatible state | provenance survives compression |
| Externalize | move mutable information out of weights | source and version retained |
| Weaken | reduce retrieval or routing influence | rare-case regression probes |
| Delete | remove active state | reconstructable source or explicit retention exception |

Weakening is separate from deletion because many obsolete or interfering
memories should first lose influence while evidence accumulates. A tombstone or
provenance record prevents deleted state from becoming an unexplained absence.

### 6. Follow one event through the lifecycle

Suppose a tool returns a surprising result. Working state can use it
immediately, while an attributable episode preserves the action, outcome,
uncertainty, source, and active path. The slow model does not change yet.
Related and conflicting outcomes accumulate until a maintenance window judges
the episode worth replaying. Replay opens a local branch and tests it against
protected history.

What happens next depends on the content. A reusable operation may become a
skill or provisional module. A mutable proposition belongs in factual memory.
Noise loses influence or expires under the retention policy. Later outcomes
measure whether that choice was correct and recalibrate the scheduler. This is
the feedback that turns a storage hierarchy into a lifecycle.

## Efficiency mechanism

Online operation avoids immediate full-model gradient updates. Maintenance
spends that work later and selectively, where expected future value justifies
the physical cost.

For $N_{\mathrm{served}}$ events between maintenance windows, amortized energy
per served event is

$$
\bar{E}_{\mathrm{event}}
= E_{\mathrm{online}}
+ \frac{E_{\mathrm{maintenance}}}{N_{\mathrm{served}}},
$$

where $E_{\mathrm{online}}$ is runtime energy per event in joules and
$E_{\mathrm{maintenance}}$ includes scheduler, replay, memory movement,
optimization, validation, and recovery energy in joules. A system saves energy
only when the second term remains below the online work avoided by delayed and
selective integration.

The full constrained action model—including joule, byte, second, and optimizer
update budgets—is defined in
[`../math/memory-lifecycle.md`](../math/memory-lifecycle.md).

## Evidence status

| Mechanism | Evidence | Current status |
| --- | --- | --- |
| Fast/slow learning split | C-008 | established theory and supporting results; system translation incomplete |
| Interference protection | C-009 | demonstrated in scoped sequential tasks |
| Replay for machine consolidation | C-010 | plausible mechanism with task-specific evidence |
| Content-specific replay | C-036 | established in the measured rodent intervention |
| Multi-signal replay allocation | C-037 | established constituent observations; unified policy experimental |
| Schema-sensitive integration | C-038 | established in scoped learning conditions |
| Retrieval-induced update window | C-039, C-040 | lability established narrowly; exact human mismatch gate disputed |
| Active forgetting | C-041, C-042 | established in scoped interventions; safe AI policy untested |
| Complete lifecycle controller | none | speculative synthesis |

## Speculative extensions

- Generate counterfactual variants around high-value episodes rather than only
  replaying recorded inputs.
- Learn expected knowledge gain per joule while retaining hard resource and
  safety bounds.
- Perform module-local consolidation first and synchronize globally only when a
  cross-module invariant changes.
- Use exact checkpoints to test several consolidation outcomes in parallel and
  retain the cheapest one that passes.
- Learn memory placement jointly with replay policy so frequently paired state
  becomes physically local.

## Failure modes

- Replay amplifies biased, adversarial, or privacy-sensitive episodes.
- The scheduler starves quiet, rare, or safety-critical memories.
- A correlated shortcut is mistaken for schema compatibility.
- Generated replay drifts away from the environment.
- Retrieval becomes an adversarial write primitive.
- Weakening or deletion removes evidence later required for recovery or audit.
- Scheduler scans and telemetry consume the saved maintenance budget.
- The episodic store becomes an unbounded duplicate of the training corpus.

## Measurable predictions

1. Fast attributable memory reduces adaptation latency without increasing
   protected slow-model regression.
2. A multi-signal scheduler improves the retention–adaptation–energy frontier
   beyond uniform, recency, loss-priority, and interference-priority baselines
   at equal replay count and bytes moved.
3. Schema-compatible episodes require fewer optimizer updates to integrate than
   violations while shortcut-controlled transfer remains unchanged or improves.
4. Explicit weakening reduces obsolete-memory intrusions without exceeding the
   declared rare-case deletion bound.
5. Separating mutable propositions from reusable skills reduces correction cost
   and unsupported factual carryover.
6. Maintenance energy amortized per served event remains below the online
   training work it replaces.

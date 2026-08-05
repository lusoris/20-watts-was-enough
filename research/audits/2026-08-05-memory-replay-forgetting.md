# Memory audit: replay selection, schema, reconsolidation, and forgetting

- **Audit date:** 2026-08-05
- **Scope:** primary causal or intervention-heavy results that can constrain the
  fast/slow-memory architecture
- **Promotion state:** candidate findings; stable `C-` IDs are assigned only
  after cross-audit deduplication

## Why this pass matters

“Replay old examples during sleep” is too vague to specify a system. A finite
maintenance window creates at least four separate decisions:

1. which experiences receive replay;
2. which existing memories become plastic enough to update;
3. which new observations can use an existing schema; and
4. which state should weaken or be removed.

Biology does not answer these engineering questions directly, but it rejects a
uniform append-and-replay story. Replay is selective, retrieval can open a
limited update window, established structure can change consolidation speed,
and forgetting can be actively regulated.

## Finding candidates

### M-01 — Replay is causally relevant, but the manipulated event matters

Closed-loop interruption of hippocampal sharp-wave ripples during
post-training rest impaired a hippocampus-dependent spatial task in rats
([Girardeau et al., 2009](https://doi.org/10.1038/nn.2384)). More selective
closed-loop disruption of replay from a particular place-cell assembly caused
a selective deficit for the associated spatial memory rather than a uniform
memory loss
([Gridchyn et al., 2020](https://doi.org/10.1016/j.neuron.2020.01.021)).

**What this supports.** Offline events carrying particular experience content
can contribute causally to later retention in these rodent spatial tasks.

**What it does not support.** Every ripple is replay; every replay consolidates;
or replay is the only scalable continual-learning mechanism.

**Existing bundles.** [P-009](../principle-registry.md#p-009--maintenance-plane)
and [P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime).

### M-02 — Replay allocation is nonuniform and sensitive to learning value

Hippocampal CA3 activity during awake sharp-wave ripples was enhanced after
rewarded paths and during learning in rats
([Singer and Frank, 2009](https://doi.org/10.1016/j.neuron.2009.11.016)). In a
separate rat study, cumulative awake replay predicted later sleep-replay rate;
more exposure increased replay while greater familiarity reduced it
([Huelin Gorriz et al., 2023](https://doi.org/10.1038/s41467-023-43939-z)). A
human fMRI study instead found that weakly remembered objects were replayed more
during rest, with object-level replay predicting later memory
([Schapiro et al., 2018](https://doi.org/10.1038/s41467-018-06213-1)).

**What this supports.** Replay bandwidth is allocated rather than distributed
uniformly. Reward, repetition, novelty/familiarity, and estimated memory
weakness are candidate signals; none is established as a universal scheduler.

**Existing bundles.** [P-001](../principle-registry.md#p-001--selective-allocation),
[P-007](../principle-registry.md#p-007--prediction-error-allocation), and
[P-009](../principle-registry.md#p-009--maintenance-plane).

**Engineering warning.** Prioritized replay is already an AI method. A proposed
“biological replay scheduler” must beat uniform reservoir sampling and standard
priority rules such as loss, temporal-difference error, recency, or estimated
interference.

### M-03 — Existing schema can change consolidation speed

In a rat paired-associate task, slowly acquired flavor-place structure enabled
new associations learned in one trial to become persistent and rapidly less
hippocampus-dependent
([Tse et al., 2007](https://doi.org/10.1126/science.1135935)).

**What this supports.** Consolidation policy can depend on compatibility with
already learned relational structure; a fixed time-to-consolidation rule is not
required.

**What it does not support.** A digital system can safely write any
schema-consistent sample directly into slow weights. Apparent compatibility may
be a shortcut or a correlated error.

**Existing bundles.** [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design)
and [P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime).

### M-04 — Retrieval can open a temporary update window

After an established auditory fear memory was retrieved in rats, blocking
protein synthesis in the amygdala disrupted later expression of that memory
([Nader et al., 2000](https://doi.org/10.1038/35021052)). In human fear
conditioning, prediction error during retrieval was reported as necessary for
pharmacologically induced amnesia
([Sevenster et al., 2013](https://doi.org/10.1126/science.1231357)). However, a
later preregistered attempt did not replicate the specific proposed boundary
conditions
([Stemerding et al., 2022](https://doi.org/10.1038/s41598-022-06119-5)).

**What this supports.** A retrieved memory need not be either permanently fixed
or fully overwritten. Retrieval can expose a bounded period of lability, and
mismatch is a plausible gate.

**Evidence caution.** General reconsolidation is established across multiple
preparations, but precise human prediction-error thresholds and behavioral
update protocols remain disputed. The repository must not promote the 2013
boundary rule without the failed replication.

**Existing bundles.** [P-003](../principle-registry.md#p-003--temporary-trace-before-commitment)
and [P-007](../principle-registry.md#p-007--prediction-error-allocation).

### M-05 — Forgetting can be an active maintenance action

Changing ongoing activity in a small set of dopaminergic neurons after
olfactory learning changed the rate of appetitive and aversive memory forgetting
in *Drosophila*
([Berry et al., 2012](https://doi.org/10.1016/j.neuron.2012.04.007)). In adult
mice, microglial depletion, inhibition of microglial phagocytosis, or
engram-targeted complement inhibition reduced forgetting in the studied fear
memory preparation
([Wang et al., 2020](https://doi.org/10.1126/science.aaz2288)).

**What this supports.** Forgetting is not exhausted by passive numerical decay;
circuits and maintenance processes can regulate weakening and structural
removal.

**What it does not support.** Deleting rarely retrieved digital records is
biologically validated, or microglia should be literally modeled. Digital
systems also need provenance, legal retention, rollback, and adversarial safety
constraints that these experiments do not address.

**Existing bundles.** [P-005](../principle-registry.md#p-005--use-dependent-topology),
[P-009](../principle-registry.md#p-009--maintenance-plane), and
[P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime).

## Deduplication result

This pass does **not** justify a new principle ID.

| Biological label | Normalized operation | Existing bundle |
| --- | --- | --- |
| prioritized replay | allocate a limited maintenance budget using estimated future value | P-001 + P-009 |
| schema-accelerated consolidation | change promotion cost when new state fits protected structure | P-010 + P-012 |
| reconsolidation | open a temporary write window on retrieval under a change signal | P-003 + P-007 |
| active forgetting | spend maintenance work to weaken or remove low-value/interfering state | P-005 + P-009 + P-012 |

The distinct research contribution is their **composition** into one governed
memory lifecycle, not four organism-themed modules.

## Candidate system primitive: budgeted memory lifecycle

For memory item $i$ at maintenance cycle $t$, define a scheduling score

$$
S_{i,t} =
\alpha U_{i,t}
+ \beta R_{i,t}
+ \gamma N_{i,t}
+ \delta I_{i,t}
- \eta F_{i,t}
- \lambda C_{i,t},
$$

where:

- $U_{i,t}$ is estimated uncertainty or retention risk (dimensionless);
- $R_{i,t}$ is task/reward relevance (dimensionless);
- $N_{i,t}$ is novelty or model mismatch (dimensionless);
- $I_{i,t}$ is estimated interference if the item is not rehearsed
  (dimensionless);
- $F_{i,t}$ is familiarity or redundant coverage (dimensionless);
- $C_{i,t}$ is predicted replay cost (joules or a calibrated energy proxy); and
- $\alpha,\beta,\gamma,\delta,\eta,\lambda$ convert each term to one declared
  scheduling utility scale.

The maintenance controller selects items subject to both replay-energy and
storage-I/O budgets. After evaluation, each item receives one auditable action:

```text
retain transiently | replay | merge into schema | keep externally | weaken | delete
```

Prediction error may open a **reconsolidation window**, but the slow model is
updated only after shadow evaluation. Schema fit lowers the expected integration
cost; it never bypasses validation.

## First discriminating experiment

### Task

Use a sequential associative-learning stream with:

- recurring latent schemas;
- one-shot compatible facts;
- schema-violating exceptions;
- obsolete associations that later become harmful; and
- delayed tests for retention, transfer, and outdated-memory intrusion.

### Equalized budget

All methods receive the same memory bytes, replay examples, optimizer updates,
wall-clock window, and measured accelerator/node energy boundary.

### Baselines

1. uniform replay from a reservoir;
2. recency replay;
3. loss- or TD-error-prioritized replay;
4. interference-estimation replay;
5. the proposed multi-signal scheduler; and
6. the proposed scheduler without active weakening/deletion.

### Required measurements

- retained accuracy and calibration by item age;
- adaptation latency after a rule change;
- obsolete-memory intrusion rate;
- schema-compatible versus schema-violating transfer;
- replay samples, bytes moved, optimizer updates, latency, and joules;
- priority concentration and starvation of low-scoring memories; and
- deletion errors recoverable from the external provenance store.

### Rejection conditions

Reject the composed biological translation if:

- a conventional single-priority baseline matches its quality–risk–energy
  frontier;
- scheduler overhead or memory scans consume the saved replay energy;
- active forgetting disproportionately deletes rare but safety-critical cases;
- schema-fit promotion amplifies correlated errors; or
- claimed gains disappear when replay count and bytes moved are equalized.

## Promotion candidates

The following scoped candidates should be reconciled with other audits before
receiving stable IDs:

- content-specific replay disruption can produce content-specific retention
  deficits in a rodent spatial task;
- replay selection reflects multiple signals rather than uniform sampling;
- pre-existing relational structure can accelerate consolidation of compatible
  associations in rats;
- prediction error as a precise human reconsolidation gate is disputed despite
  evidence for retrieval-induced lability; and
- forgetting can be actively regulated by neural and glial mechanisms in the
  studied fly and mouse preparations.

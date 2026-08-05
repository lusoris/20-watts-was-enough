# Audit: endogenous generation, imitation, and creativity

**Date:** 2026-08-05  
**Question:** Is human creativity adequately described as stochastic mixing of
learned neural state, and does all useful behavior reduce to observation,
imitation, learning, or evolution?

**Promoted evidence:** [C-061](../claims.md#c-061)–[C-066](../claims.md#c-066).

## Short answer

The broad causal ancestry is defensible but nearly tautological: evolved
developmental machinery and accumulated experience necessarily constrain human
behavior. No evidence here requires novelty *ex nihilo*. The narrower claim
that creativity is **only random recombination or imitation** is not supported.

Stochastic variation can propose alternatives, but observed intelligent
novelty also depends on structured internal dynamics, causal and relational
representations, active data collection, memory-based scene construction, and
evaluation against goals and constraints. These are not supernatural additions;
they are mechanisms inside an evolved learning system. Removing them from the
description erases the parts most useful for architecture.

## Operational decomposition

Replace the metaphysical question “is this really creative?” with a testable
loop:

```text
evolved/developed priors + acquired memory + current context
  -> structured candidate generation (possibly stochastic)
  -> internal or external simulation/intervention
  -> evaluation under novelty, value, risk, and cost
  -> selection, revision, memory update, or rejection
```

Let a candidate be

$$
z_t \sim q_\theta(z \mid c_t, m_t, \xi_t),
$$

where $c_t$ is current context, $m_t$ is accessible memory, and $\xi_t$ is a
stochastic input. Randomness is therefore one argument to a learned structured
generator, not a complete explanation. A useful proposal must also survive an
evaluation such as

$$
U(z_t)=V(z_t)-\lambda_N N(z_t)-\lambda_R R(z_t)-\lambda_E E(z_t),
$$

where $V$ is task value, $N$ is non-novel redundancy, $R$ is risk, and $E$ is
lifecycle energy or resource cost. The coefficients depend on the task and
must not be treated as biological constants.

## Primary evidence

### EG-01 — Internally generated ordered activity is behaviorally structured

Pastalkova et al. recorded hippocampal ensembles while rats ran in a wheel
during the delay of a memory task. Ordered assembly sequences occurred without
changing external location; different starting conditions produced different
sequences, and sequence activity predicted later choices including errors
([DOI](https://doi.org/10.1126/science.1159775)).

**Scope.** This establishes internally organized neural sequences related to a
learned task. It does not show ideas independent of prior experience, and it
does not identify human creativity.

**Translation.** A learner need not wait for a new external example before
generating a structured latent trajectory. Candidate rollouts can be produced
from current state and memory, then tested.

### EG-02 — “Preplay” is an informative disputed edge

Dragoi and Tonegawa reported that some hippocampal firing sequences expressed
during a novel spatial experience also occurred during rest before that
experience ([DOI](https://doi.org/10.1038/nature09633)). Silva, Feng, and Foster
later used larger ensemble recordings and found pre-experience events but not
the temporal correspondence required by that account
([DOI](https://doi.org/10.1038/nn.4151)).

**Scope.** A strong claim that the hippocampus preconfigures particular future
trajectories is disputed. The disagreement is more useful than a slogan: an AI
system must distinguish a genuinely predictive endogenous proposal from a
post-hoc match in a large candidate space.

### EG-03 — Exploration is targeted by unresolved causal structure

Schulz and Bonawitz found that preschoolers preferentially explored a toy after
observing confounded rather than matched unconfounded evidence and often acted
to disambiguate the candidate causes
([DOI](https://doi.org/10.1037/0012-1649.43.4.1045)).

**Scope.** This is a small developmental experiment, not a universal optimal
experiment-design result. It nevertheless rejects a description of behavior as
passive copying alone: the children changed their observations through action.

**Deduplication.** This fits [P-007](../principle-registry.md#p-007--prediction-error-allocation)
and active sensing rather than requiring a “curiosity” principle.

### EG-04 — Instruction can reduce independent discovery

Across two experiments, Bonawitz et al. found that preschoolers shown a
pedagogical demonstration concentrated on the demonstrated toy function, while
several non-pedagogical conditions produced broader exploration
([DOI](https://doi.org/10.1016/j.cognition.2010.10.001)).

**Scope.** Demonstration is not generally harmful. In the designed multi-use
toy, a learner's inference that a teacher would show relevant functions changed
the exploration policy. Imitation and self-generated discovery can therefore
trade off rather than forming one undifferentiated learning mechanism.

### EG-05 — Causal transparency changes imitation versus emulation

Horner and Whiten compared chimpanzees and three- to four-year-old children
observing tool use with an opaque or transparent puzzle box. Chimpanzees more
often omitted causally irrelevant demonstrated actions when the box was
transparent; children copied them at high fidelity in both conditions
([DOI](https://doi.org/10.1007/s10071-004-0239-6)).

**Scope.** The task does not rank one species' general intelligence or prove a
single human imitation strategy. It shows that copying actions, reproducing
outcomes, and using causal structure are separable operations.

### EG-06 — Stochastic variation can itself be controlled

Tervo et al. reported that rats under a competitive task shifted toward
stochastic choice when an opponent became hard to predict, and causal
manipulations implicated anterior cingulate circuitry in gating that
variability ([DOI](https://doi.org/10.1016/j.cell.2014.08.037)). Wu et al. found
that the temporal structure of human motor variability was regulated and
predicted subsequent learning in a motor task
([DOI](https://doi.org/10.1038/nn.3616)).

**Scope.** These studies support adaptive control of variability in specific
tasks. They do not establish that all creativity is stochastic search or that
more randomness is better.

**Translation.** Exploration noise should be budgeted, context-dependent, and
ablated. A fixed-temperature sampler is the null model; learned variance control
must improve adaptation at matched failures and sample cost.

### EG-07 — Imagined scenes depend on memory-related construction

Hassabis et al. found that patients with primary bilateral hippocampal damage
were markedly impaired at constructing coherent new imagined experiences from
short verbal cues relative to matched controls
([DOI](https://doi.org/10.1073/pnas.0610561104)).

**Scope.** The small lesion study concerns scene construction and has a wider
literature with boundary disputes. It supports a role for binding remembered
elements into coherent spatial contexts, not the claim that one structure is a
general-purpose creativity module.

### EG-08 — Creative performance correlates with network interaction

Beaty et al. used functional-connectivity data from a divergent-thinking task
to derive a network whose connectivity predicted held-out creative scores and
involved default, salience, and executive systems
([DOI](https://doi.org/10.1073/pnas.1713532115)).

**Scope.** Functional connectivity and prediction are correlational. The result
does not identify a causal algorithm, but it argues against locating generation
or evaluation in one isolated process.

## Deduplication result

No new `P-` principle is justified yet:

| Operation | Existing bundle |
| --- | --- |
| target uncertainty through self-generated intervention | P-007 prediction-error allocation |
| retain a temporary candidate before commitment | P-003 temporary trace |
| generate variants, select, and protect useful structure | P-004 diversity and selection |
| simulate and consolidate from memory | P-009 maintenance plane + P-012 memory lifetime |
| combine locally generated content with distributed evaluation | P-008 compartmentalization + candidate multiscale context broadcast |

The architectural opportunity is a **closed endogenous curriculum** composed
from these bundles: the system generates hypotheses, chooses interventions,
evaluates outcomes, and writes back only validated changes. Calling a language
model's temperature sampling “creativity” does not implement that loop.

## First discriminating experiment

Use a compositional environment in which some goals require combinations never
shown in demonstrations but derivable from learned causal primitives. Compare:

1. imitation or behavioral cloning;
2. stochastic sampling from the same learned policy;
3. memory recombination without intervention;
4. active hypothesis generation plus targeted interventions and a separate
   evaluator; and
5. an oracle experiment-design upper bound.

Equalize demonstrations, model capacity, candidate count, environment actions,
memory bytes, and lifecycle energy. Measure valid novelty, task value,
calibration, intervention cost, duplicate rate, catastrophic proposals, and
transfer after the environment's rules change.

Reject the composed mechanism if ordinary stochastic sampling matches it at the
same candidate and interaction budget. Promote it only if targeted endogenous
data collection explains the advantage and the evaluator prevents novelty from
becoming uncontrolled failure.

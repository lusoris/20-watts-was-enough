# Neurogenesis, modularity, and conditional routing

## Scope

Define a capacity-rich initial system that can specialize without requiring its
entire parameter set to run for each input.

## Biological observation

Developing nervous systems produce and reorganize more cells and connections
than survive into mature circuits. Activity, trophic constraints, and experience
shape which pathways stabilize. The useful abstraction is *developmental excess
followed by competitive specialization*.

The analogy breaks if “more neurons” is treated as a reason to allocate an
arbitrarily dense digital model. Biological growth, digital overparameterization,
and lottery-ticket results occur under different mechanisms.

Primary developmental interventions sharpen the abstraction. Complement and
microglia participate causally in activity-sensitive removal of developing
inputs ([C-043](../research/claims.md#c-043)). Mature extracellular and receptor
structures can then constrain plasticity, while targeted interventions reopen
it in specific adult visual-cortex preparations
([C-044](../research/claims.md#c-044),
[C-045](../research/claims.md#c-045)). This supports separate **candidate,
mature, reopened, and reconsolidating** module states—not literal microglia or
fixed developmental ages.

## Proposed AI translation

Start with a modular seed containing:

- modality-specific encoders that retain uncertainty;
- a shared predictive state with explicit time and action context;
- a pool of initially weakly specialized experts;
- hierarchical routers that can select modality paths, experts, depth, and
  memory access; and
- reserved capacity that can be activated or grown only when existing modules
  fail a novelty and interference test.

Each module also has a reversible maturity state. Maturation may lower its
update rate, restrict which context signals can alter it, and make structural
changes require shadow evaluation. Reopening requires evidence of persistent
error or regime change, a versioned checkpoint, and a reconsolidation test
before the replacement becomes canonical.

Routing must be learned with three simultaneous pressures:

1. **task loss** rewards useful selections;
2. **budget loss** prices active compute, bytes moved, and communication; and
3. **diversity/load loss** prevents one expert from absorbing every event.

A generic router objective is:

$$
\mathcal{L}_{\text{route}}
= \mathcal{L}_{\text{task}}
+ \lambda_E \widehat{E}(x)
+ \lambda_M \widehat{B}(x)
+ \lambda_{\mathrm{bal}} \mathcal{L}_{\text{balance}}
+ \lambda_{\mathrm{stab}} \mathcal{L}_{\text{stability}},
$$

where all $\mathcal{L}$ terms are dimensionless normalized losses,
$\widehat{E}(x)$ is estimated event-level energy in joules, and
$\widehat{B}(x)$ is estimated memory and network traffic in bytes across named
boundaries. Therefore $\lambda_E$ has units $\mathrm{J}^{-1}$,
$\lambda_M$ has units $\mathrm{byte}^{-1}$, and
$\lambda_{\mathrm{bal}}$ and $\lambda_{\mathrm{stab}}$ are dimensionless.
The stability term penalizes routing churn only after a module begins to
consolidate. Coefficients and normalization ranges are fixed before
confirmatory evaluation.

## Efficiency mechanism

For experts $i=1\ldots n$, let router gates $g_i(x)\in\{0,1\}$ be
dimensionless, $c_i(x)$ be the executed operation count for expert $i$, and
$C_{\text{router}}(x)$ be the router's executed operation count under the same
precision and counting convention. Active work in operations per event is

$$
C_{\text{active}}(x)=C_{\text{router}}(x)+\sum_{i=1}^{n}g_i(x)c_i(x).
$$

Capacity and active cost are decoupled only when the selected sum and routing
overhead remain substantially below dense execution. Sparse MoE work establishes
the feasibility of this separation in specific systems
([C-003](../research/claims.md#c-003)).

Operation count is not energy: $\widehat{E}(x)$ and $\widehat{B}(x)$ remain
separate measured or calibrated quantities.

## Evidence status

- Conditional expert selection is established under
  [C-003](../research/claims.md#c-003).
- Lottery-ticket experiments establish competitive sparse subnetworks in
  bounded settings under [C-012](../research/claims.md#c-012), not the full
  developmental proposal.
- Developmental pruning and reversible adult plasticity brakes are established
  in scoped biological preparations under
  [C-043](../research/claims.md#c-043)–[C-045](../research/claims.md#c-045).
- Automatic module growth, multimodal specialization, and stable hierarchical
  routing are speculative integrations.

## Speculative extensions

- Structural plasticity that allocates a new expert only after novelty persists
  across episodes and existing experts show measurable interference.
- Topology-aware routing that prices cross-device communication explicitly.
- A reversible “provisional module” state before new capacity becomes permanent.
- Capability-gap repair that admits complementary modules rather than merely
  restoring a previous count ([C-056](../research/claims.md#c-056)).

## Failure modes

- **Router collapse:** one expert receives most events.
- **Fragmentation:** experts duplicate work and lose transfer.
- **Stranded capacity:** rarely selected parameters occupy memory without value.
- **Premature localization:** a modality is isolated before cross-modal concepts
  form.
- **Maturity lock-in:** protected modules resist beneficial newcomers or
  necessary relearning ([C-057](../research/claims.md#c-057)).
- **False sparsity:** gates are sparse mathematically but implementations still
  load dense tensors or all-to-all communication dominates.

## Measurable predictions

- At matched task quality, active parameter fraction and bytes moved per event
  fall as total capacity grows.
- Expert mutual information with meaningful event factors increases without
  one-hot modality isolation.
- Adding tasks causes less regression than in a capacity-matched monolith.
- End-to-end energy improves after router, dispatch, and communication costs are
  included—not merely after counting FLOPs.

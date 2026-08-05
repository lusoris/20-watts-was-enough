# Hardening, reflex paths, and factual memory

## Scope

Decide what should remain plastic, what may become a cheap stable execution
path, and what should live outside model weights.

## Biological observation

Repeated behavior can become faster and less attention-demanding, while
myelination changes conduction properties of biological pathways. The useful
engineering abstraction is *tiered execution for stable skills*.

Myelin is not quantization, lookup, or frozen weights. Calling those mechanisms
“myelination” is mnemonic shorthand and supplies no evidence by itself.

## Proposed AI translation

Use three distinct promotion targets:

1. **compiled skill path:** a stable transformation with explicit applicability
   and fallback conditions;
2. **lower-precision module:** a calibrated module whose quantization error
   stays inside task and risk bounds; and
3. **external factual memory:** mutable propositions with source, timestamp,
   confidence, and conflict history.

The slow model remains responsible for interpretation, uncertainty, routing,
and novel composition. A hardened path must be bypassable when its preconditions
are not met.

For quantization candidate $q$, promotion requires

$$
\Delta Q_q \le \epsilon_Q,
\quad \Delta R_q \le \epsilon_R,
\quad E_q + E_{\text{dispatch}} < E_{\text{current}}.
$$

Extreme ternary weights are a candidate supported by preliminary evidence under
[C-013](../research/claims.md#c-013), not a default endpoint.

Factual retrieval is a separate path because facts change independently of
reasoning. RAG establishes benefits and limitations of parametric plus
non-parametric memory in specific tasks
([C-014](../research/claims.md#c-014)).

## Efficiency mechanism

- Use the lowest precision that passes calibration and robustness tests.
- Cache or compile stable, frequent transformations with explicit invalidation.
- Retrieve mutable facts only when needed and return provenance with the result.
- Avoid using a large generative path for deterministic operations that a
  verified smaller path can perform.

## Evidence status

- Retrieval-augmented generation is established within
  [C-014](../research/claims.md#c-014).
- Ternary-weight capability is plausible but requires replication under
  [C-013](../research/claims.md#c-013).
- Automatically discovering reflex-like compiled skills is speculative.

## Speculative extensions

- Learn a skill compiler that proposes a small deterministic graph plus a
  validity predicate and proof-carrying regression set.
- Route facts by expected update frequency: volatile data stays external;
  stable semantic structure may influence slow weights during consolidation.
- Allow “de-myelination”: automatically demote a hardened path after drift,
  uncertainty, or repeated fallback.

## Failure modes

- Quantization preserves average quality but breaks rare numerical or safety
  behavior.
- A compiled path fires outside its training envelope.
- Retrieved evidence is stale, malicious, contradictory, or irrelevant.
- Freezing foundational weights prevents correction of foundational mistakes.
- External memory latency and indexing energy exceed the neural work saved.

## Measurable predictions

- Frequent stable tasks use less energy and latency with no unacceptable risk
  shift.
- Mutable fact updates require index changes rather than model retraining.
- Provenance coverage and factual update latency improve over a parametric-only
  baseline.
- Invalid or shifted inputs trigger fallback reliably instead of receiving a
  confident reflex response.

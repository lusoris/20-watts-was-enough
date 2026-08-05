# Multimodal sensorimotor grounding

## Scope

Specify the experience from which the system should form pre-linguistic world
structure and how language later attaches to it.

## Biological observation

Human learning combines temporally aligned vision, audition, proprioception,
touch, action, and consequence before mature language. Sparse sensory codes can
capture structure in natural inputs ([C-002](../research/claims.md#c-002)). The
useful constraint is that symbols should connect to predictive state grounded in
interaction, not only to other symbols.

The analogy does not imply that a simulator reproduces childhood, or that more
modalities necessarily produce causal understanding.

## Proposed AI translation

Training examples are trajectories rather than isolated documents:

$$
\tau = \{(o_t, a_t, s_t, o_{t+1}, m_t)\}_{t=0}^{T},
$$

where $o_t$ contains available observations, $a_t$ is an action or intervention,
$s_t$ is known simulator or environment state when available, and $m_t$ records
which modalities are present.

The model learns to predict target representations from context and action:

$$
\hat{z}_{t+k}=P(z_{\le t},a_{t:t+k-1},m_{\le t}),
\qquad
\mathcal{L}_{\text{pred}}=d(\hat{z}_{t+k},\operatorname{sg}(z_{t+k})).
$$

The stop-gradient operator $\operatorname{sg}$ indicates that target encoding
and collapse prevention require an explicit training design. I-JEPA supports
latent prediction for images ([C-006](../research/claims.md#c-006)); it does not
validate this full multimodal objective.

Language enters as another observation and action channel. It should label,
query, compress, and communicate already learned regularities, while remaining
able to introduce concepts unavailable in direct experience.

## Efficiency mechanism

- Predict in latent space when pixel-perfect reconstruction spends capacity on
  irrelevant detail.
- Use temporal redundancy to update only changed or surprising state.
- Share concepts across modalities while keeping small modality-specific
  adapters and uncertainty heads.
- Train from interventions so the model can distinguish passive correlation
  from action-conditioned change.

## Evidence status

- Sparse sensory representation learning is established narrowly under
  [C-002](../research/claims.md#c-002).
- Image joint-embedding prediction is established under
  [C-006](../research/claims.md#c-006).
- General sensorimotor grounding that transfers robust physical concepts is the
  explicit speculative hypothesis [C-007](../research/claims.md#c-007).

## Speculative extensions

- Curriculum order based on controllability: persistence and object boundaries,
  then contact and motion, then tools and agents, then language-mediated
  abstractions.
- Cross-modal prediction heads that activate only when another modality can
  reduce uncertainty.
- Counterfactual rollouts that compare an observed trajectory with one changed
  action under the same initial state.

## Failure modes

- Simulator artifacts become shortcuts that fail in new environments.
- One high-bandwidth modality dominates the latent space.
- Time alignment errors teach false causal relations.
- Language labels leak evaluation answers without physical learning.
- A shared embedding erases uncertainty or modality-specific distinctions.
- More sensory data increases compute without improving transferable structure.

## Measurable predictions

Compared with text-centric and passive multimodal baselines at matched capacity:

- action-conditioned prediction improves on held-out interventions;
- learned state requires fewer examples for new control tasks;
- cross-modal concepts survive missing or corrupted modalities;
- physical-consistency errors fall on novel object, material, and dynamics
  combinations; and
- gains persist when linguistic shortcuts and simulator identifiers are removed.

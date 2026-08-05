# Energy model and comparison contract

## Scope

Define what an efficiency claim means, expose the assumptions behind every
number, and replace the inherited brain-versus-GPU ratio with a falsifiable
measurement program.

## Biological observation

Neural signaling is energy constrained ([C-001](../research/claims.md#c-001)).
That fact motivates the project name and the requirement to price activity. It
does not provide a conversion from a biological spike or synaptic event to a
floating-point operation.

## Proposed AI translation

Every experiment declares a measurement contract:

| Field | Required declaration |
| --- | --- |
| Task | dataset/environment, input distribution, and target behavior |
| Quality | primary score, calibration, rare-event and safety metrics |
| Boundary | accelerator, host, node, cluster, or facility |
| Mode | training, consolidation, or inference |
| Hardware | device, count, clocks, memory, interconnect, and software stack |
| Arithmetic | weight/activation precision and effective sparsity |
| Utilization | batch, sequence, occupancy, and idle accounting |
| Time | warm-up, measurement window, and repetitions |
| Energy | instrument, sampling rate, baseline subtraction, and uncertainty |

### Energy decomposition

For a declared system boundary,

$$
E_{\text{IT}}
=E_{\text{compute}}
+E_{\text{memory}}
+E_{\text{interconnect}}
+E_{\text{host}}
+E_{\text{idle-share}}.
$$

If a facility boundary is used,

$$
E_{\text{facility}}=\operatorname{PUE}\,E_{\text{IT}}.
$$

PUE must be measured or cited for the same facility and period; it is not a
universal constant.

Amortized lifecycle energy per served event is

$$
\bar{E}
=\frac{E_{\text{training}}+E_{\text{consolidation}}+E_{\text{deployment}}}
{N_{\text{qualified events}}}.
$$

“Qualified” means events served inside the declared quality and risk envelope.

### Efficiency and uncertainty

For task quality $Q$ and measured energy $E$,

$$
\eta_Q=\frac{Q}{E},
\qquad
\Delta\eta_Q\approx\eta_Q
\sqrt{\left(\frac{\Delta Q}{Q}\right)^2+
      \left(\frac{\Delta E}{E}\right)^2}.
$$

The approximation assumes independent small uncertainties; experiments must use
the appropriate propagation or bootstrap when that assumption fails.

## Audit of the inherited comparison

The source discussion claimed a 20-watt brain would require between 427
kilowatts and 14.1 megawatts at accelerator efficiency. Claim
[C-016](../research/claims.md#c-016) is disputed because the derivation divides:

- an assumed brain “operations per second” estimate with no task or operation
  definition; by
- peak accelerator arithmetic at different precision modes; then
- adds a facility factor unrelated to the biological boundary.

The formal counterfactual would be

$$
P_{\text{counterfactual}}
=P_{\text{brain}}
\frac{\eta_{\text{brain}}}{\eta_{\text{machine}}},
$$

but it may be evaluated only if both efficiencies use the same functional unit,
quality target, time basis, and boundary. No such equivalence is currently
established. Therefore this repository preserves the inherited range only as an
audit case, not a result.

## Efficiency mechanism

The architecture targets energy through measurable levers:

- fewer active modules and layers;
- less parameter and activation movement;
- lower communication fan-out;
- calibrated early exit;
- lower precision after validation;
- external retrieval for mutable facts; and
- amortized rather than continual full-model updates.

Each lever gets a component ablation and an end-to-end measurement. FLOPs alone
are a diagnostic, never the final energy result.

## Evidence status

- Biological signaling constraints: established under
  [C-001](../research/claims.md#c-001).
- The inherited numerical ratio: disputed under
  [C-016](../research/claims.md#c-016).
- A large end-to-end advantage from the integrated architecture: speculative
  until measured.

## Speculative extensions

- Train a differentiable energy proxy from hardware counters, then periodically
  recalibrate it against wall measurements.
- Optimize expected uncertainty reduction per joule instead of raw loss per
  token.
- Report energy–quality curves across difficulty strata instead of one average.

## Failure modes

- Peak hardware specifications substitute for measured application energy.
- Baselines use different quality, precision, batch, or latency constraints.
- Sparse dispatch lowers FLOPs but increases data movement.
- Training energy is omitted from a short deployment.
- Facility PUE is added to one system but not the other.
- A brain analogy supplies a headline number without a comparable operation.

## Measurable predictions

- Conditional mechanisms produce a lower measured energy curve at matched
  quality and risk, not just fewer nominal operations.
- Data movement becomes a smaller fraction of total energy after module
  placement and structural pruning.
- Consolidation cost amortizes over enough qualified events to beat continual
  full-model updating.
- Efficiency gains persist across at least two hardware classes; otherwise they
  are reported as substrate-specific.

# Mechanism equivalence and intervention-qualified discrimination

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-26
- **Selected gap:** the evidence and mathematical boundary required to turn
  RSD-T02 from a five-way generator-label question into an
  intervention-qualified causal-property test
- **Fields sampled:** systems biology, biochemical reaction-network theory,
  nonlinear control, structural identifiability, optimal experiment design,
  signal transduction, and numerical singular perturbation
- **Evidence base:** primary theoretical, computational and experimental
  papers; reviews and search indexes were used only for discovery
- **Promotion state:** narrows [C-1541](../claims.md#c-1541), adds bounded
  [C-1560](../claims.md#c-1560), [C-1561](../claims.md#c-1561),
  [C-1562](../claims.md#c-1562), [C-1563](../claims.md#c-1563), and
  [C-1564](../claims.md#c-1564), and adds no P-series principle or architecture
  candidate
- **Experiment state:** a deterministic bounded public-development T02-MECH
  construction/conformance runtime now covers the closed 35-projection O0/O1
  layout (nine O0 projections plus 26 O1 episodes),
  generator, response firewall, evaluator, event schema, append-only ledger,
  resume and analysis validation, plus an additive pre-evaluator whole-system
  commitment for all nine fixed policy-conformance references; these references
  are neither trained estimators nor mature nulls, zero roles remain inactive,
  and no comparison, claim-eligible partition, fixed-instance population run,
  O2 execution, T02-FLOOR runtime,
  workstation comparison, measured energy, or result exists

## Executive finding

Similar adaptive output traces do not determine one causal architecture.
Properly parameterized incoherent feed-forward loops and nonlinear feedback
systems can both realize fold-change detection. Negative feedback and
incoherent feed-forward cores can both realize adaptation in scoped model
classes. Distinct chemical-reaction graphs can even generate identical
dynamics under a declared representation.

Interventions can separate some declared rivals, but no paper establishes that
one universal list of pulses, ramps, resets or node freezes identifies every
mechanism. The defensible unit of inference is therefore a property under a
specified interface and intervention panel. A pairwise separation certificate
must show that the panel distinguishes a property for the initialized worlds in
question. When it does not, a non-singleton equivalence set or abstention is the
correct output.

This changes the RSD-T02 target in four ways:

1. generator names remain provenance rather than scientific classes;
2. structural and interventional properties receive separate truth
   certificates;
3. acquisition access and cost remain a vector, including privileged internal
   interventions; and
4. the singular fast/slow limitation uses a maximum instantaneous error on an
   epsilon-scaled sampling grid, not an integrated RMS score.

## What the biological evidence establishes

### Incoherent feed-forward sufficiency is conditional

Goentoro et al. construct a deterministic type-1 incoherent feed-forward loop
whose properly parameterized activation and repression terms make the modeled
output depend on fold change across the studied positive-input regime. The
result is a sufficiency construction. It does not license the inverse inference
that observing adaptation, a pulse, or even FCD establishes that motif in a
natural system.

Takeda et al. later combined experiment and model comparison in the
*Dictyostelium* Ras pathway. Their IFFL account fit the studied adaptation better
than the particular feedback alternative considered. This is real
model-set-specific evidence, not a universal step-to-topology lookup.

### Feedback can adapt and can also realize FCD

Yi et al. identify integral feedback in a scoped chemotaxis model, and Muzzey
et al. provide systems-level evidence for integral feedback in yeast osmotic
adaptation. Ma et al.'s search over three-node enzyme networks found two major
adaptation-capable cores inside that search space: negative feedback with a
buffer and incoherent feed-forward with a proportioner.

Adaptation is a steady-state property. It neither entails full-trajectory FCD
nor identifies one topology. Shoval et al. and the later symmetry analysis show
that suitably nonlinear feedback systems can also have the equivariance needed
for exact FCD. Ordinary linear integral feedback can adapt without satisfying
that stronger symmetry.

### Receptor memory is evidence for a location, not uniqueness

Lyashenko et al. report background-dependent cognate surface-receptor abundance
consistent with a ligand-specific reference for approximate EGF and HGF
relative sensing over finite regimes. That supports a possible interface-local
memory mechanism. It does not establish receptor abundance as necessary or
unique, and the same process may admit more than one causal description. The
claim remains owned by [C-1548](../claims.md#c-1548); RSD-T02 uses it as a
nonuniqueness boundary rather than duplicating it.

## Mechanism discrimination requires a declared rival set

Mélykúti et al. formulate three ways to separate specified rival biochemical
models that already fit available data: change initial conditions, design an
input, or apply a structural perturbation. Hamadeh, Ingalls and Sontag likewise
use transient dynamic phenotypes to discriminate declared models. These papers
support controlled experimental design, but only relative to the candidates,
constraints and observations they analyze.

For initialized worlds $a$ and $b$, intervention panel $P$, observation map
$h$, sample grid $\mathcal T$, and numerical tolerance $\delta_P$, define a
finite contract distance

$$
d_P(a,b)
=
\max_{I\in P}\max_{t\in\mathcal T}
\left\|
h\!\left(x_a^I(t)\right)-h\!\left(x_b^I(t)\right)
\right\|_{\infty}.
$$

For numerical estimate $\widehat d_P$ and error bound $\eta_P$, the evaluator
may certify the pair as separated only when
$\widehat d_P-\eta_P>\delta_P$. It may certify equivalence only when an
analytic result or a complete declared finite-grid bound proves
$\widehat d_P+\eta_P\le\delta_P$. Otherwise the pair remains unresolved.
Running an intervention is not itself a separation certificate.

Szederkényi, Banga and Alonso show a stronger boundary for mass-action reaction
networks: distinct reaction graphs can generate identical dynamics under the
paper's representation and assumptions. Adding more samples cannot separate an
exactly equivalent pair. RSD-T02 must retain the equivalence class rather than
reward a guessed graph name.

## Repeated stimulation adds one-sided signatures

Rahi et al. study adapting circuit classes under repeated or oscillatory
stimulation. Within their declared class, refractory-period stabilization or
period skipping supports negative feedback over an incoherent feed-forward
loop. A single pulse is insufficient, and not every sampled adapting feedback
model exhibits the signatures. Presence can therefore separate some pairs;
absence cannot force the opposite label.

The dedicated [RSD-T02-PULSE audit](2026-08-26-rsd-t02-pulse-signatures.md)
therefore treats pulse duration $d$ and period $T_p$ as independent factors.
Its source-shaped written protocol reports at least:

1. response count per stimulus count;
2. first-spike and later-spike latencies;
3. the largest period-skipping run;
4. refractory-period stability over pulse duration; and
5. the certified pairwise property separation, unresolved state, or abstention.

The v1 five-world construction does not instantiate this signature. Its
feedback nonlinearity vanishes at the two square-pulse levels, and no current
pair certificate uses a pulse episode. C-1561 is now routed to a separate
[mathematical contract](../../math/repeated-stimulus-topology-signatures.md)
and [fixture subtrack](../../experiments/fixtures/026-interface-qualified-relative-sensing.md#rsd-t02-pulse--one-sided-repeated-stimulus-signatures).
That subtrack completes the written test specification, not a construction
certificate, runner, confirmation or result.

## The fast boundary layer needs the right norm

Skataric, Nikolaev and Sontag analyze singularly perturbed FCD models. When the
two associated fast initial-value problems differ, their theorem gives a
positive lower bound for the maximum instantaneous scaled-versus-unscaled
output difference as the fast/slow ratio $\epsilon$ tends to zero. It is a
supremum-norm boundary-layer result.

For the registered full models, define

$$
E_{\infty}(\epsilon)
=
\sup_{t\in[0,T]}
\left|
y_p^{\epsilon}(t)-y_1^{\epsilon}(t)
\right|.
$$

An integrated score asks a different question:

$$
E_2(\epsilon)
=
\sqrt{
\frac{1}{T}
\int_0^T
\left|
y_p^{\epsilon}(t)-y_1^{\epsilon}(t)
\right|^2dt
}.
$$

An order-one peak confined to an order-$\epsilon$ initial layer can retain a
positive $E_{\infty}$ while $E_2$ vanishes. The exact physical-time toy
boundary layer $e_{\epsilon}(t)=\exp[-t/(\epsilon\tau_s)]$ makes the metric
mismatch visible:

$$
\|e_{\epsilon}\|_{\infty}=1,
\qquad
E_2(\epsilon)=
\sqrt{
\frac{\epsilon\tau_s}{2T}
\left(1-e^{-2T/(\epsilon\tau_s)}\right)
}
\longrightarrow 0.
$$

![For a shrinking exponential boundary layer, the maximum remains one while the RMS error tends to zero.](../../public/plots/fast-boundary-layer-norms.svg)

The finite RSD-T02 sweep therefore needs a composite grid: fixed physical-time
samples for the slow response plus $t=\epsilon\tau$ samples and an analytic
critical-time evaluator for the fast layer. A finite sweep can check a known
analytic generator bound. It cannot infer an asymptotic theorem from a visually
flat curve.

## Evaluator property ontology

The audit initially considered seven biological distinctions. The v1 machine
bank narrows them to four separately scored coordinates:

1. `drive_transform`: affine fold or log fold;
2. `reported_output_feedback_edge`: present or absent;
3. `channel_local_state`: present or absent; and
4. `causal_memory`: true, false or unassessed.

Nonlinear update form remains equation provenance because it perfectly
co-varies with reported-output feedback in these five worlds; claiming the two
as separately identified would manufacture resolution. Static versus dynamic
reference location also remains provenance unless an allowed intervention
separates it. The singular `limit_floor_status` belongs to `T02-FLOOR`, not the
mechanism vector. Identifiability is an evaluator state attached to each
coordinate under the current panel, not another biological property.

The coordinates can overlap. Static normalization and explicit log difference
are observation transformations; I1-FFL, feedback and receptor memory are
causal architectures. Treating all five recipe names as exclusive peer classes
would mix ontology levels and manufacture classification accuracy.

## Experiment and resource consequences

RSD-T02 must use nested panels so that the smallest sufficient evidence bundle
can be found without pretending every intervention has equal cost:

1. matched step only;
2. varied pulse width and repeated-pulse period;
3. linear and exponential ramps;
4. input hold, restimulation and declared reference reset; and
5. selective node freeze through a standardized privileged port.

Each panel retains observation duration, sample count, input transitions,
reset count, privileged internal interventions, bytes, operations, state,
wall time and later measured energy as separate dimensions. The graph oracle
is evaluator-only. All actionable arms receive the same transcript and no
hidden family, equation, state, property or future sample before response
freeze.

The checked-in runtime exercises that construction boundary over a hashed
ordered prefix of the public seed pack: one seed for smoke and two for the
bounded development-conformance profile. It does not execute the full 64-seed
pack, and the hashed profile says so explicitly. O0 means three background
episodes and 4,611 rows per conditioned time-constant instance; crossing the
three registered time constants yields nine executions and 13,833 rows per
recipe. O1 remains exactly 26 episodes at $\tau_*=1,\mathrm s$. The base episode
event keeps all nine roles abstaining. Separately, the additive whole-system
stage delivers the identical 35-projection packet to all nine fixed policies,
commits their ordered responses with zero inactive placeholders, and only then
permits `O-GRAPH` to open any episode. Their thresholds were construction-tuned
on the five enumerated public worlds; they used zero labels and zero tuning trials and return a joint compatible
property-vector set. Shared acquisition, policy construction/prior, and actual
per-inference work remain separate ledgers under identical caps without work
padding. Pair matrices and property aggregation validate the registered
construction and policy conformance, not a mature-null comparison or scientific
result.
Each packet now executes in a fresh permission-restricted Node child and one
hardened VM context containing the ordered nine-policy bank. A deterministic
builder reproduces the verified SHA-named bundle; canonical framing, capability
removal, resource limits and typed boundary abstention are tested. This is
process isolation for public-development policy computation, not secret
custody. The commitment is exclusively created and file-synchronized before
the evaluator ledger opens, and source hash plus byte count share one read.
Input JSON is parsed from those exact fingerprinted bytes. Parent generator and
evaluator modules are still statically imported before their later file
fingerprints; the run-directory lease does not prevent concurrent repository-
source mutation across that residual load-time boundary.

## Evidence limitations

1. The papers use different mathematical classes and biological preparations;
   their mechanism labels are not automatically interchangeable.
2. A pairwise separating input can fail when the candidate set, parameter
   support, observation map or noise model changes.
3. Structural identifiability is a prerequisite, not a guarantee of practical
   recovery from finite noisy data.
4. Privileged resets and node freezes may be impossible in a target system;
   simulated access must be priced and reported rather than treated as free.
5. A correct biological attribution does not establish a cheaper artificial
   implementation.
6. No cited source supplies T02's numerical margins, workstation budget or
   confirmation sample size; those are protocol design choices and must be
   labelled as such.

## Primary bibliography

1. Goentoro et al. (2009), [The incoherent feedforward loop can provide fold-change detection in gene regulation](https://doi.org/10.1016/j.molcel.2009.11.018).
2. Shoval et al. (2010), [Fold-change detection and scalar symmetry of sensory input fields](https://doi.org/10.1073/pnas.1002352107).
3. Shoval, Alon and Sontag (2011), [Symmetry invariance for adapting biological systems](https://doi.org/10.1137/100818078).
4. Yi et al. (2000), [Robust perfect adaptation in bacterial chemotaxis through integral feedback control](https://doi.org/10.1073/pnas.97.9.4649).
5. Muzzey et al. (2009), [A systems-level analysis of perfect adaptation in yeast osmoregulation](https://doi.org/10.1016/j.cell.2009.04.047).
6. Ma et al. (2009), [Defining network topologies that can achieve biochemical adaptation](https://doi.org/10.1016/j.cell.2009.06.013).
7. Takeda et al. (2012), [Incoherent feedforward control governs adaptation of activated Ras in a eukaryotic chemotaxis pathway](https://doi.org/10.1126/scisignal.2002413).
8. Lyashenko et al. (2020), [Receptor-based mechanism of relative sensing and cell memory in mammalian signaling networks](https://doi.org/10.7554/eLife.50342).
9. Mélykúti et al. (2010), [Discriminating between rival biochemical network models](https://doi.org/10.1186/1752-0509-4-38).
10. Hamadeh, Ingalls and Sontag (2013), [Transient dynamic phenotypes as criteria for model discrimination](https://doi.org/10.1098/rsif.2012.0935).
11. Rahi et al. (2017), [Oscillatory stimuli differentiate adapting circuit topologies](https://doi.org/10.1038/nmeth.4408).
12. Szederkényi, Banga and Alonso (2011), [Inference of complex biological networks](https://doi.org/10.1186/1752-0509-5-177).
13. Skataric, Nikolaev and Sontag (2015), [Fundamental limitation of the instantaneous approximation in fold-change detection models](https://doi.org/10.1049/iet-syb.2014.0006).
14. Villaverde, Barreiro and Papachristodoulou (2016), [Structural identifiability of dynamic systems biology models](https://doi.org/10.1371/journal.pcbi.1005153).

## Disposition

Amend RSD-T02 around a property vector, nested intervention panels, pairwise
separation certificates and calibrated abstention. Keep generator family as
secondary provenance. Split the singular fast/slow endpoint from mechanism
discrimination, use a source-faithful supremum norm with fast-time sampling,
and retain integrated discrepancy only as a separate diagnostic. The initial
machine contract remains public development and `NO_RESULT`.

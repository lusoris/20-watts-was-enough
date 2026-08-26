# Repeated-stimulus signatures for an adapting-circuit subtrack

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-26
- **Selected gap:** C-1561 named refractory stabilization, response latency,
  response count and period skipping, but had no bounded planted world, event
  rule, counterworld bank or direct-test disposition
- **Fields sampled:** dynamical systems biology, biochemical circuit topology,
  periodic forcing, contraction arguments and numerical experiment design
- **Evidence base:** the primary article, Online Methods and integrated
  supplementary material of Rahi et al. (2017); no review supplies a claim
- **Claim state:** narrows and operationalizes
  [C-1561](../claims.md#c-1561) without changing its evidence status
- **Experiment state:** written public-development protocol complete at
  [RSD-T02-PULSE](../../experiments/fixtures/026-interface-qualified-relative-sensing.md#rsd-t02-pulse--one-sided-repeated-stimulus-signatures);
  a bounded deterministic constructor now exists, while full-panel execution,
  estimator comparison and confirmation remain `NO_RESULT`

## Executive finding

The primary source supports a bounded one-sided test, not a universal topology
classifier. In the adapting-circuit classes and observation assumptions studied
by Rahi et al., refractory-period stabilization or a response with a period
longer than the input period can support response-dependent negative feedback
against the registered input-driven feed-forward rival. Failure to observe
either signature does not establish the rival.

The missing artifact can therefore be made testable only by freezing five
things together:

1. a response-driven inhibitor world and an input-driven counterpart;
2. an adaptation and pulse-support gate;
3. separate definitions for mean-output refractory period and discrete
   response events;
4. nulls for signature-negative feedback, mixed motifs, observation dead time
   and temporal aliasing; and
5. a fail-closed disposition in which absence and support failure remain
   unresolved.

The resulting protocol is specified mathematically in
[one-sided topology signatures under repeated stimulation](../../math/repeated-stimulus-topology-signatures.md).
It is not an experimental result and does not modify the existing five-recipe
matched-step bank.

## What the primary source establishes

### A single response trace is not a topology lookup

Rahi et al. fit both an incoherent feed-forward model and a negative-feedback
model to the same recorded *C. elegans* adaptation trace. The fit demonstrates
nonuniqueness within that comparison; it does not prove that every pair of
adapting models can match every isolated-pulse trace.

The paper defines the topological distinction at the adapting path. In its
inhibitor examples, the response $R$ drives inhibitor $I$ in the negative-
feedback loop, whereas the external stimulus $S$ drives $I$ independently of
$R$ in the incoherent feed-forward loop.

### The refractory quantity is an argmax of mean output

For repeated on/off stimuli of duration $d$ and period $T$, the paper defines

$$
T_{\max}(d)
\in
\operatorname*{arg\,max}_{T}
\langle O(t;d,T)\rangle_t.
$$

In the paper's simple threshold models, the IFFL slope is greater than one,
whereas an intermediate duration range in the NFL has zero slope. For broader
numerical models, the authors adopt $\partial T_{\max}/\partial d<1/2$ as a
practical stabilization threshold. The slope is dimensionless because both
$T_{\max}$ and $d$ are times.

The comprehensive search found small-duration IFFL false positives. The
authors reduced them by requiring stabilization only when $d$ reached at least
$1.5$ times the step-response adaptation time, defined there as time to peak.
This is a source-class diagnostic boundary, not a universal constant of all
adaptive systems.

### Period skipping is a subharmonic response under scoped assumptions

The source calls a response that ignores some periodic input pulses period
skipping. Its supplementary proof shows convergence to the input period for a
pure feed-forward system when the stated contraction, degradation and
bounded-coupling assumptions hold. It also gives scoped arguments for positive-
feedback systems. That proof does not cover arbitrary artificial recurrences,
measurement gates, delayed hybrid automata or unbounded systems.

In the computational search, the authors checked recurrence against the prior
$q$ stimulus periods for $q\in\{1,2,3,4,5\}$ at fractional error below
$10^{-12}$. A period-$qT$ state with $q>1$ is therefore the source-aligned
mathematical object. Merely losing every second recorded peak is not enough if
the plant state is $T$-periodic or the detector is refractory.

### The source has explicit support boundaries

The Online Methods first retained only step responses whose tested output fell
by more than 80% after its transient peak. Supplementary Figure 8 then excludes
two pulse regions:

1. durations too short, or periods too long, for enough inhibitor to accumulate
   and produce adaptation; and
2. durations so long that one input pulse can evoke at least two responses.

The paper's numerical search started from a fixed duration set, searched
$T>d$, expanded the upper period limit when the mean output was still rising,
and refined around a detected maximum. When several periods attained a
maximum, it retained the largest. Those details matter: a boundary maximum or
an unresolved plateau is not a certified refractory period.

### Presence is not prevalence and absence is not exclusion

The first nonlinear parameter exploration found at least one of the signatures
in 71% of sufficiently adapting sampled NFL models and none of the paired IFFL
sample. In the larger, deliberately false-positive-focused enumeration, the
combined count was 9,712 of 22,188 adapting NFL implementations and 48 of
16,502 adapting IFFL implementations after the authors' criteria. These are
counts under that enumeration and search procedure. They are not a population
prevalence, a universal likelihood ratio or an expected accuracy for this
project.

The source also constructs a parallel slow-IFFL/fast-NFL model in which the
apparent stabilization changes with the averaging window. This directly
requires a mixed and timescale-qualified output rather than a forced exclusive
label.

## Translation into the public-development DGP

The protected pair uses the source's smooth `NFL 1` and `IFFL 1` equation
forms. Both share

$$
\tau_R\dot R
=
\frac{S}{1+(I/I_0)^n}-R.
$$

The protected feedback world uses $\tau_R\dot I=R-\lambda I$; its paired
feed-forward world uses $\tau_R\dot I=S-\lambda I$. The synthetic manifest
sets $\tau_R=1\,\mathrm s$, $n=4$, $I_0=0.01\,\mathrm U$ and
$\lambda=0.3$, with dimensionless reported output
$O=(R/(1\,\mathrm U))^3$.

The equation family, Hill coefficient, inhibitor scale, rate and cubic output
all occur in the source's explored forms or grids. The exact cross-product and
finite pulse panels are project choices. Rahi et al. did not publish the result
of this exact fixture cell, so its positive and negative truth certificates
must be constructed before any scored run.

The protected refractory durations are
$\{0.30,0.50,1.00,1.50,2.00,3.00\}\,\mathrm s$. The skipping panel uses
$d=0.20\,\mathrm s$ and $T\in\{5.00,5.20,5.40\}\,\mathrm s$. These values
are frozen development hypotheses, not measurements. The math note freezes the
complete period search, refinement, maximizer interval and numerical error
propagation.

## Event, latency and response-count rules

Refractory stabilization uses the time average of the continuous reported
output and does not require peak picking. Period skipping does.

For each duration, an isolated pulse defines amplitude
$A_{\mathrm{iso}}(d)$. A response event is an upward crossing of
$0.25A_{\mathrm{iso}}(d)$ between one input onset and the next. The primary
record retains:

1. stimulus count;
2. response count;
3. every upward-crossing count per pulse interval;
4. first-crossing latency in seconds for responding intervals;
5. missing-event count rather than a fabricated zero latency;
6. response amplitude; and
7. the recurrent plant-state period and residual.

The 0.25 threshold and its sensitivity values are protocol conventions. The
paper did not establish them. A pulse with multiple response cycles is outside
the protected single-response region even if an event-word summary could hide
that fact.

## Construction evidence now available

The checked-in
[`rsd-t02-pulse.mjs`](../../experiments/workstation/fixture-026/rsd-t02-pulse.mjs)
implements the six registered worlds, adaptive integration with exact pulse
edges, step and isolated-pulse gates, event extraction, recurrence through
$q=5$, bounded refractory search, deterministic OU diagnostics and typed cost
records. Eleven focused tests exercise the positive cell, pure feed-forward
rival, signature-negative feedback, dead-time, aliasing and fail-closed paths.

The executed $d=0.20\,\mathrm s$, $T=5.00\,\mathrm s$ construction cell has
an order-two `01` event word with 10 responses from 20 stimuli in `PS-NFL-H4`.
The paired `PS-IFFL-H4` cell is order one and has no skipping signature. Both
records retain `feedback_support=unresolved`, `comparison=false`,
`claim_eligible=false` and `NO_RESULT`; the constructor exposes evaluator truth
but supplies no actionable estimator.

One $d=0.30\,\mathrm s$ feedback-world diagnostic evaluated 198 coarse and 38
refined period cells and retained an interior $T_{\max}$ interval of
$[16.72,16.72]\,\mathrm s$. It is not a stabilization result because the
registered decision needs consecutive slopes across the six durations. That
full panel, the 64-seed noise grid, mixed-window statistic, runner integration
and confirmation remain unexecuted.

## Nulls and counterworlds

### Pure feed-forward rival

The input-driven inhibitor equation is the principal false-attribution world.
It receives the same parameter manifest, pulse panel, solver and observation
rule. A feedback declaration here invalidates the claimed separator.

### Signature-negative feedback

A stable linear integral-feedback control is included because a periodic input
to a stable linear system entrains at the input period. It has response-
dependent inhibition but no protected nonlinear signature. Correct behavior is
abstention. This counterworld prevents `no signature` from becoming an IFFL
label.

### Mixed fast and slow paths

The source's supplementary mixed model is copied equation-for-equation into a
counterworld with its published parameters. Mean output is evaluated over four
declared windows. A method passes only when it retains `mixed/window-qualified`
instead of choosing one graph.

### Observation dead time

An IFFL plant is passed through a calibrated detector that suppresses output
events for $1.5T$ after a detection. It can manufacture an alternating event
word without plant feedback. Missing or incompatible recovery metadata must
therefore fail observation support.

### Temporal aliasing

An IFFL plant reported once per input period at a fixed phase cannot bound
within-cycle response count or latency. It is a valid scientific hostile and
must be out of support, not deleted and not interpreted.

## Primary decision and falsification

The protocol reports refractory and skipping signatures separately. Feedback
is supported only when at least one signature is present, all source-aligned
support gates pass, and the claimed rival has a construction certificate.
Two absent signatures remain unresolved.

The direct test is falsified if any of these outcomes occurs:

1. the input-driven IFFL is assigned response-dependent feedback;
2. the signature-negative feedback world is assigned feed-forward structure;
3. detector dead time or aliasing is assigned plant feedback;
4. a mixed path is reduced to one exclusive topology;
5. short-duration, multiple-response, boundary-maximum or nonconverged cells
   are retained as positive evidence; or
6. event or period thresholds are changed after inspection.

Response count, latency, $T_{\max}$, slope, recurrence residual and the complete
resource vector remain separate. The source says nothing about AI compute or
energy benefit, so this subtrack carries no energy conclusion.

## Evidence limitations

1. The source's no-skipping arguments require its declared feed-forward,
   monotonicity, degradation, boundedness and stimulation assumptions.
2. A response signature identifies a scoped causal outline, not biochemical
   species or a complete graph.
3. The same biological system can contain several motifs whose apparent
   dominance changes with timescale or stimulus strength.
4. Finite noisy observations can confuse small responses, missing responses
   and detector failure; direct plant recurrence is available only in the
   synthetic evaluator.
5. Only bounded development cells have checked-in construction records; the
   full protected refractory, robustness and mixed-window panels remain
   unexecuted.
6. Public source and a complete written protocol do not provide confirmation
   custody or a claim-eligible result.

## Primary bibliography

1. Rahi et al. (2017), [Oscillatory stimuli differentiate adapting circuit topologies](https://doi.org/10.1038/nmeth.4408), including Online Methods and integrated supplementary figures, notes and table. Bibliography key: [`rahi2017oscillatory`](../references.bib).

## Disposition

C-1561 now has both a complete written direct-test specification and a bounded
machine construction layer. The evidence status stays scoped and one-sided.
The experiment status remains `public-development`, `construction-only` and
`NO_RESULT`: no full-panel runner, actionable estimator, protected confirmation
split, workstation result or energy measurement exists.

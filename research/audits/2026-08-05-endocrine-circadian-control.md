# Audit: endocrine and circadian control

- **Audit date:** 2026-08-05
- **Scope:** primary intervention-heavy evidence for low-bandwidth endocrine
  waveforms, receptor-dependent decoding, autonomous local clocks,
  entrainment, delayed feedback, temporal resource organization, and
  misalignment failure
- **Promotion state:** audit candidates only; no stable `C-` or `P-` IDs are
  assigned here
- **Existing experimental target:**
  [Candidate 002: multiscale context broadcast](../../experiments/candidates/002-multiscale-context-broadcast.md)

## Selection and interpretation rules

This pass searched endocrine pulse generation and decoding, glucocorticoid and
feeding entrainment, autonomous peripheral clocks, circadian coupling,
diffusible pacemaker output, time-restricted resource intake, and controlled
circadian misalignment. Reviews were used to locate work but are not retained
as evidence. The retained set favors matched-input interventions, receptor or
coupling perturbations, isolated-tissue persistence, and controlled schedule
changes.

Each finding below separates the biological result from the engineering
translation. A hormone is not assumed to be an AI control token, a tissue is
not assumed to be a module, and biological time constants are not copied into
an artificial system. “Low bandwidth” means that the measured intervention
uses a small number of circulating or diffusible variables relative to the
number of downstream states; none of the cited papers measures Shannon channel
capacity.

The strongest interpretation common to the retained studies can be written as
two different control objects. A waveform-decoding receiver may be represented
as

$$
\tau_i \frac{d r_i(t)}{dt}=u(t)-r_i(t),
\qquad
y_i(t)=g_i\!\left(x_i(t),R_i,r_i(t),u(t)\right),
$$

where $u(t)$ is a normalized broadcast input, $r_i(t)$ is receiver $i$'s
filtered state, $\tau_i$ is its response time constant in seconds, $x_i(t)$ is
local state, $R_i$ denotes receptor or receiver configuration, and $y_i(t)$ is
the local response. An entrainable local clock is a different object:

$$
\frac{d\phi_i(t)}{dt}
=\omega_i
+Z_i\!\left(\phi_i(t)\right)u(t)
+\sum_j K_{ij}\sin\!\left(\phi_j(t)-\phi_i(t)\right),
$$

where $\phi_i$ is phase in radians, $\omega_i$ is intrinsic angular frequency
in radians per second, $Z_i$ is a phase-response function in radians per unit
input per second, and $K_{ij}$ is coupling strength in inverse seconds. The
first system forgets according to receiver dynamics; the second retains phase
and continues evolving after the input disappears. This distinction drives the
deduplication decision.

## A. Endocrine waveform generation and decoding

### ECC-01 — Delayed endocrine feedback can generate a pulse train

**Primary source.** Walker, Terry, and Lightman, 2010, “Origin of Ultradian
Pulsatility in the Hypothalamic-Pituitary-Adrenal Axis”
([DOI](https://doi.org/10.1098/rspb.2009.2148);
[PubMed](https://pubmed.ncbi.nlm.nih.gov/20129987/)).

**Scoped result.** A biologically motivated mathematical model containing
pituitary-to-adrenal feed-forward drive, adrenal-to-pituitary negative
feedback, and secretion delays generated ultradian ACTH/glucocorticoid pulses
without an ultradian hypothalamic input. Changes in constant CRH drive produced
modeled release patterns that paralleled the paper's in vivo data. This is a
sufficiency result for a model constrained by data, not a direct ablation of
every alternative pulse generator.

**Mechanism and timescale.** A delayed negative-feedback loop can cross an
oscillatory instability, while a slower circadian drive changes pulse
amplitude or operating regime. Information flows down the pituitary-adrenal
feed-forward path and back through glucocorticoid inhibition.

**Registry normalization.** This is a direct mechanistic instance of
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback), with an
explicit delay-induced failure/oscillation condition. It does not establish a
new broadcast principle. Its pulse output becomes an input to the held
multiscale-context candidate, but pulse generation and pulse decoding must not
be merged.

**Strongest conventional null.** A delayed feedback oscillator, relay
controller, or model-predictive controller. These are the mechanism, not weak
baselines.

**Decisive AI test.** On a plant with known delay and disturbance spectra,
compare the proposed delayed feedback loop against tuned PID, relay, and model-
predictive control at matched sensing, actuation, and compute cost. Sweep delay
and gain through stable and oscillatory regions. Reject any biological novelty
claim if standard control predicts and occupies the same stability/energy
frontier.

### ECC-02 — Equal-duration hormone pulses and constant exposure produce different transcriptional programs

**Primary source.** Stavreva et al., 2009, “Ultradian Hormone Stimulation
Induces Glucocorticoid Receptor-Mediated Pulses of Gene Transcription”
([DOI](https://doi.org/10.1038/ncb1922);
[publisher](https://www.nature.com/articles/ncb1922)).

**Scoped result.** In cultured cells and animal preparations, ultradian
glucocorticoid stimulation produced cyclic glucocorticoid-receptor occupancy
and pulses of nascent RNA. Receptor occupancy tracked ligand pulses, and the
transcriptional program differed from constant stimulation. Rapid receptor
exchange and chaperone-dependent receptor recycling were implicated in
coupling promoter activity to repeated ligand fluctuations.

**Mechanism and timescale.** A circulating waveform is not reduced to its
mean: receiver binding, exchange, recycling, and transcription each introduce
state and recovery dynamics. The paper tests repeated hormone pulses over
minutes-to-hours and downstream transcription, not a whole-organism energy
benefit.

**Registry normalization.** This strengthens the held **multiscale context
broadcast** candidate: temporal structure in a few-to-many signal matters at a
receiver. It overlaps [P-006](../principle-registry.md#p-006--homeostatic-negative-feedback)
only upstream, where endocrine pulses may be generated; the decoding result is
not itself negative feedback. It is not [P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime),
because the measured time constants regulate a response rather than choose a
storage medium.

**Strongest conventional null.** A scalar control bus followed by an ordinary
causal finite-impulse-response filter, state-space receiver, or recurrent gate.

**Decisive AI test.** Extend Candidate 002 with matched-integral waveforms:
constant, pulsed, phase-scrambled, and amplitude-scrambled broadcasts must have
the same transmitted bits and integrated absolute signal. Receiver-specific
filters must beat the best shared temporal filter and equal-parameter recurrent
gate on held-out waveform compositions. Reject the mechanism if performance is
explained by total exposure, added state, or an unconstrained recurrent unit.

### ECC-03 — Insulin delivery pattern changes hepatic action at matched delivery rate

**Primary source.** Matveyenko et al., 2012, “Pulsatile Portal Vein Insulin
Delivery Enhances Hepatic Insulin Action and Signaling”
([DOI](https://doi.org/10.2337/db11-1462);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC3425431/)).

**Scoped result.** Five dogs received, in randomized order, physiological
pulsatile, constant, and type-2-diabetes-like portal insulin patterns. The
constant protocol delivered the same total insulin rate as the pulsatile
protocol. In the dog assay, pulsatile delivery improved measured glycemic
control. In anesthetized rats, constant and diabetes-like delivery delayed and
reduced measured IRS-1/IRS-2, AKT, and Foxo1 signaling and reduced glucokinase
expression relative to physiological pulses. Reported reductions in several
signaling measures were approximately 50–80% in this preparation; that range
is not an AI design constant.

**Mechanism and timescale.** Pancreatic insulin bursts recur at roughly
five-minute intervals and directly expose the liver through portal
circulation. Receptor/signaling recovery makes the temporal delivery pattern
causally relevant even when mean delivery is controlled.

**Registry normalization.** This is another waveform-decoding instance of the
held multiscale-context candidate. It does not add a separate “insulin
principle,” and it does not by itself establish P-006 because the intervention
tests the receiver side of the loop.

**Strongest conventional null.** Pulse-width or pulse-frequency modulation of
a conventional actuator, including duty-cycled control designed around known
receiver recovery.

**Decisive AI test.** Give every receiver the same mean control exposure and
the same communication budget while varying only pulse interval and duty
cycle. Compare learned receiver dynamics with a tuned pulse-width controller
and identified linear/nonlinear state-space model. Reject the translation if a
standard system-identification pipeline predicts the response equally well or
if pulse peaks increase hardware energy enough to erase the claimed savings.

### ECC-04 — Receptor abundance changes how one pulse frequency is decoded

**Primary source.** Bédécarrats and Kaiser, 2003, “Differential Regulation of
Gonadotropin Subunit Gene Promoter Activity by Pulsatile Gonadotropin-Releasing
Hormone (GnRH) in Perifused LβT2 Cells: Role of GnRH Receptor Concentration”
([DOI](https://doi.org/10.1210/en.2002-221140);
[PubMed](https://pubmed.ncbi.nlm.nih.gov/12697686/)).

**Scoped result.** In perifused LβT2 gonadotrope cells, higher GnRH pulse
frequencies preferentially stimulated the LHβ promoter, whereas lower
frequencies preferentially stimulated the FSHβ promoter. Cell-surface GnRH
receptor number increased at higher pulse frequencies before the differential
promoter response. Receptor overexpression reduced FSHβ induction and removed
its frequency dependence while leaving LHβ frequency dependence intact.

**Mechanism and timescale.** One ligand/receptor channel can be decoded into
different outputs through receiver abundance and downstream dynamics.
Responses accumulate across pulse intervals of tens of minutes to hours. This
is an immortalized cell-line promoter assay, not a complete reproductive-axis
intervention.

**Registry normalization.** This is the closest endocrine duplicate of local
receiver logic in the held multiscale-context candidate and of [C-048](../claims.md#c-048).
It also fits [P-008](../principle-registry.md#p-008--compartmentalized-interaction)
only in the weak sense that local receiver configuration contains response
logic. No endocrine-specific invariant is needed.

**Strongest conventional null.** A shared scalar input with learned per-module
gain, threshold, and causal filter—equivalently temporal FiLM or a small local
recurrent gate.

**Decisive AI test.** Hold the broadcast waveform fixed and permute or ablate
receiver parameters across modules. A genuine receiver-decoding mechanism
must show selective, predictable changes in temporal response rather than a
uniform quality loss. Compare with a low-rank hypernetwork and per-module RNN
at equal parameters, control bits, and receiver-state bytes.

## B. Pacemaker output, local clocks, and selective entrainment

### ECC-05 — A diffusible pacemaker output can restore one behavioral rhythm

**Primary source.** Silver et al., 1996, “A Diffusible Coupling Signal from the
Transplanted Suprachiasmatic Nucleus Controlling Circadian Locomotor Rhythms”
([DOI](https://doi.org/10.1038/382810a0);
[PubMed](https://pubmed.ncbi.nlm.nih.gov/8752274/)).

**Scoped result.** SCN tissue enclosed in a semipermeable polymer capsule was
transplanted into SCN-lesioned hamsters. The capsule prevented neural outgrowth
while allowing diffusion, and the graft restored circadian locomotor rhythms.
The experiment establishes sufficiency of a diffusible output for this
behavioral rhythm; it neither identifies the molecule nor shows that all
circadian physiological outputs can be restored without neural connections.

**Mechanism and timescale.** A central oscillator can expose downstream
systems to a periodic diffusible signal without point-to-point synapses. The
output organizes activity across days, but its information dimension and
energetic cost were not measured.

**Registry normalization.** This supports the transport side of the held
multiscale-context candidate and temporal coordination under
[P-011](../principle-registry.md#p-011--transient-communication-coalitions).
It does not distinguish an endocrine broadcast from an ordinary shared clock
line.

**Strongest conventional null.** A single multicast clock/tick channel or
publish-subscribe timing topic.

**Decisive AI test.** Disconnect all point-to-point timing messages and test
whether one rate-limited broadcast restores coordinated periodic behavior.
The comparison must include a standard multicast clock with identical bits.
If the standard clock works as well, the study supports broadcast feasibility
but not a novel AI mechanism.

### ECC-06 — Glucocorticoid input resets peripheral clocks through local receptors while sparing the central clock

**Primary source.** Balsalobre et al., 2000, “Resetting of Circadian Time in
Peripheral Tissues by Glucocorticoid Signaling”
([DOI](https://doi.org/10.1126/science.289.5488.2344);
[PubMed](https://pubmed.ncbi.nlm.nih.gov/11009419/)).

**Scoped result.** Dexamethasone induced circadian gene expression in cultured
rat fibroblasts and transiently phase-shifted clock-gene expression in mouse
liver, kidney, and heart. It did not reset cyclic expression in the SCN.
Liver-specific glucocorticoid-receptor disruption blocked the measured hepatic
phase shift, while baseline liver rhythmicity persisted, showing both local
receptor dependence and redundant entrainment routes.

**Mechanism and timescale.** A circulating signal reaches many tissues, but
receiver expression determines which clocks reset. The clock stores the phase
change for later cycles; this is more than a transient low-pass response.

**Registry normalization.** Receptor-selective delivery strengthens the held
multiscale-context candidate and local autonomy under
[P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation).
Persistent phase resetting, however, motivates a distinct candidate operation:
**entrainable local phase state**. That operation is not yet a principle because
ordinary local clocks and phase-locked loops implement it directly.

**Strongest conventional null.** A local oscillator with a receptor/gate on an
external synchronization message; in engineering terms, a selectively enabled
phase-locked loop.

**Decisive AI test.** Give heterogeneous modules free-running local phases and
one sparse synchronization message. Compare receiver-gated phase resetting
with a global timestamp, a cyclic executive, and per-module phase-locked loops
under clock drift, packet loss, and abrupt schedule shifts. Reject the
biological framing if standard clock synchronization matches phase error,
recovery time, task quality, bytes, and joules.

### ECC-07 — Peripheral clocks remain autonomous but lose phase coherence without the SCN

**Primary source.** Yoo et al., 2004, “PERIOD2::LUCIFERASE Real-Time Reporting
of Circadian Dynamics Reveals Persistent Circadian Oscillations in Mouse
Peripheral Tissues”
([DOI](https://doi.org/10.1073/pnas.0308709101);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC397382/)).

**Scoped result.** PERIOD2::LUCIFERASE tissue recordings showed self-sustained
oscillations in isolated mouse peripheral tissues for more than 20 cycles, with
tissue-specific periods and phases. SCN lesions did not abolish peripheral
rhythms but caused phase desynchrony among tissues within animals and across
animals.

**Mechanism and timescale.** Local oscillators preserve temporal state over
many days. The central pacemaker contributes phase coherence rather than
executing every peripheral cycle. The reporter measures clock dynamics; it
does not establish the performance or energy benefit of decentralization.

**Registry normalization.** Local persistence maps to
[P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation),
while lost coherence maps to [P-011](../principle-registry.md#p-011--transient-communication-coalitions).
It supports entrainable local phase state as distinct from a memoryless context
broadcast, but not as distinct from established distributed-clock engineering.

**Strongest conventional null.** Independent local timers periodically
synchronized by a standard network-time or phase-locked-loop protocol.

**Decisive AI test.** Remove the synchronizer after initialization, then
measure local task continuity, phase drift, and inter-module failures. Restore
sparse synchronization and measure recovery. Compare with Network Time
Protocol-like correction, consensus clocks, and one global timer; charge all
timestamp reads and synchronization messages.

### ECC-08 — Feeding time can entrain peripheral clocks without moving the SCN clock

**Primary source.** Damiola et al., 2000, “Restricted Feeding Uncouples
Circadian Oscillators in Peripheral Tissues from the Central Pacemaker in the
Suprachiasmatic Nucleus”
([DOI](https://doi.org/10.1101/gad.183500);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC317100/)).

**Scoped result.** Restricting mouse feeding to the usual inactive phase under
light-dark or constant-dark conditions shifted peripheral clock-gene phases by
as much as 12 hours while leaving the measured SCN phase largely unchanged.
Resetting was gradual and tissue dependent: liver moved faster than kidney,
heart, or pancreas, with similar phases across the examined peripheral tissues
after approximately one week of daytime feeding.

**Mechanism and timescale.** Different environmental or metabolic zeitgebers
can address different oscillators. Each tissue has its own phase state and
resetting kinetics, so conflicting cues can create transient internal
desynchrony.

**Registry normalization.** This combines
[P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation)
and [P-011](../principle-registry.md#p-011--transient-communication-coalitions)
with the proposed entrainable-local-phase operation. It is not a new “feeding
principle.” The held context-broadcast candidate alone is insufficient because
the key state is an autonomous oscillator and multiple input channels can
compete for its phase.

**Strongest conventional null.** A multi-source phase-locked loop with explicit
source priority, confidence, slew-rate limits, and holdover.

**Decisive AI test.** Give local modules conflicting global schedule and local
workload zeitgebers. Compare fixed-priority, confidence-weighted, and learned
phase resetting against conventional multi-source clock discipline. Evaluate
phase error, task throughput, missed deadlines, recovery after source failure,
control bytes, and measured energy. Reject the candidate if learned
entrainment only rediscovers a worse clock-synchronization algorithm.

### ECC-09 — Receptor-specific coupling maintains synchrony and rhythmicity in the central clock network

**Primary source.** Aton et al., 2005, “Vasoactive Intestinal Polypeptide
Mediates Circadian Rhythmicity and Synchrony in Mammalian Clock Neurons”
([DOI](https://doi.org/10.1038/nn1419);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC1628303/)).

**Scoped result.** Mice lacking VIP or its VPAC2 receptor showed multiple
behavioral periods in constant darkness. Loss of either component abolished
circadian firing rhythms in about half of measured SCN neurons and
desynchronized those that remained rhythmic. Daily VPAC2 agonist application
restored rhythmicity and synchrony in VIP-deficient SCN neurons but not in
receptor-deficient neurons.

**Mechanism and timescale.** A diffusible ligand/receptor pathway couples local
oscillators. The rescue separates missing signal from missing receiver and
shows that periodic exposure can coordinate a population without making every
cell an autonomous robust oscillator.

**Registry normalization.** Synchronization is already covered by
[P-011](../principle-registry.md#p-011--transient-communication-coalitions),
and ligand/receptor selectivity supports the held multiscale-context candidate.
The finding also constrains entrainable local phase state: some receivers need
coupling to remain rhythmic, so “local autonomy” cannot be assumed uniformly.

**Strongest conventional null.** Kuramoto-style oscillator coupling,
distributed consensus, or a shared phase-correction channel with explicit
receiver membership.

**Decisive AI test.** Ablate sender, receiver, and coupling separately in a
population of local periodic controllers. Signal restoration must rescue only
sender loss, whereas receiver restoration must be required after receiver
loss. Compare with standard consensus and phase-coupled oscillators at matched
messages and operations; reject novelty if the same coupling law explains the
result.

### ECC-10 — Strong coupling trades entrainability for rigidity

**Primary source.** Abraham et al., 2010, “Coupling Governs Entrainment Range
of Circadian Clocks”
([DOI](https://doi.org/10.1038/msb.2010.92);
[author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC3010105/)).

**Scoped result.** Experimental temperature-cycle entrainment and oscillator
modeling showed that mouse lung clocks entrained over a wider range than SCN
clocks. The analysis identified zeitgeber-strength-to-oscillator-amplitude
ratio and relaxation rate as determinants of entrainment. Pharmacologically
reducing intercellular coupling in SCN slices enlarged their entrainment range,
consistent with the prediction that coupling increases amplitude and rigidity
while filtering perturbations.

**Mechanism and timescale.** Coupling improves internal coherence and noise
rejection but can slow or prevent adaptation to an external cycle. The relevant
quantity is a tradeoff surface over coupling, forcing, relaxation, and drift;
the study provides no universal optimal coupling constant.

**Registry normalization.** The restorative aspect touches
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback), and
coordination maps to [P-011](../principle-registry.md#p-011--transient-communication-coalitions).
The rigidity-versus-entrainability tradeoff is a constraint on the proposed
entrainable-phase operation, not another principle.

**Strongest conventional null.** Classical coupled-oscillator theory and
adaptive phase-locked loops. The paper itself uses generic oscillator models,
so a biological label cannot claim this mathematics as novel.

**Decisive AI test.** Sweep local coupling under stationary noise, gradual
frequency drift, and abrupt phase shifts. Report coherence, disturbance
attenuation, adaptation lag, task loss, messages, and joules separately.
Compare fixed coupling, adaptive coupling, independent clocks, and an adaptive
PLL. Reject the candidate if a standard loop dominates or if a composite score
hides the predicted opposing movements.

## C. Temporal resource organization and failure

### ECC-11 — Resource timing changes outcome at matched caloric intake in one mouse intervention

**Primary source.** Hatori et al., 2012, “Time-Restricted Feeding without
Reducing Caloric Intake Prevents Metabolic Diseases in Mice Fed a High-Fat
Diet”
([DOI](https://doi.org/10.1016/j.cmet.2012.04.019);
[PubMed](https://pubmed.ncbi.nlm.nih.gov/22608008/)).

**Scoped result.** Mice given high-fat food during an eight-hour daily window
consumed equivalent calories to mice with ad-libitum access yet showed lower
weight gain and improved measured metabolic outcomes over the intervention.
The schedule also changed circadian and nutrient-signaling oscillations. The
experiment does not isolate clock phase from fasting duration, intake
distribution, or downstream behavior, and it is not evidence for the same
effect in humans or compute systems.

**Mechanism and timescale.** Equal total input can be temporally separated into
resource-acquisition, anabolic, and catabolic intervals. The biological result
supports testing temporal interference and recovery, not copying an eight-hour
window.

**Registry normalization.** Scheduling maintenance or resource-intensive work
away from task execution maps to
[P-009](../principle-registry.md#p-009--maintenance-plane); recurring temporal
coordination maps to [P-011](../principle-registry.md#p-011--transient-communication-coalitions).
No new resource-arbitration principle is needed.

**Strongest conventional null.** Batch scheduling, cyclic executives,
rate-limited queues, and job-shop optimization with explicit contention and
recovery costs.

**Decisive AI test.** Hold total useful operations, job arrivals, data bytes,
and power budget constant. Compare interleaved work, fixed maintenance windows,
learned phase windows, earliest-deadline-first scheduling, and an offline
job-shop oracle. Measure quality, tail latency, interference, thermal throttling,
checkpoint bytes, and joules. Reject the biological translation if conventional
scheduling matches the frontier or if the benefit comes only from doing less
work.

### ECC-12 — Misalignment between behavioral and endogenous cycles causes multi-system degradation

**Primary source.** Scheer et al., 2009, “Adverse Metabolic and Cardiovascular
Consequences of Circadian Misalignment”
([DOI](https://doi.org/10.1073/pnas.0808180106);
[PubMed](https://pubmed.ncbi.nlm.nih.gov/19255424/)).

**Scoped result.** Ten adults completed a controlled ten-day forced-
desynchrony protocol with recurring 28-hour behavioral days and four isocaloric
meals per behavioral day. When behavioral cycles were approximately 12 hours
out of phase with endogenous circadian time, mean leptin fell 17%, glucose rose
6% despite a 22% insulin increase, the cortisol rhythm reversed relative to
behavior, mean arterial pressure rose 3%, and sleep efficiency fell 20% in this
sample. These values are study outcomes, not design constants or population
effect estimates.

**Mechanism and timescale.** Individually functioning subsystems can become
jointly harmful when sleep, food, endocrine, and endogenous phase relationships
conflict. This is a system-level failure signature; the experiment does not
identify one controller whose replacement would remove all effects.

**Registry normalization.** Misalignment is a failure mode spanning
[P-006](../principle-registry.md#p-006--homeostatic-negative-feedback),
[P-009](../principle-registry.md#p-009--maintenance-plane), and
[P-011](../principle-registry.md#p-011--transient-communication-coalitions).
It strengthens the need to test phase relationships but is not itself an
architectural principle.

**Strongest conventional null.** Distributed-clock skew monitoring, schedule
consistency checks, and ordinary end-to-end service-level monitoring.

**Decisive AI test.** Independently phase-shift data arrival, local compute
windows, replay/maintenance, and power availability while keeping their totals
fixed. Compare local phase control with a centralized scheduler and standard
clock-skew correction. Report each subsystem metric and end-to-end quality;
reject a special circadian mechanism if ordinary schedule alignment restores
the same performance at lower control cost.

## Deduplication decision

| Retained operation | Evidence items | Existing destination | Decision |
| --- | --- | --- | --- |
| delayed feedback generates oscillation | ECC-01 | P-006 | duplicate; retain as a delay/stability case, not a new principle |
| pulse waveform changes receiver output | ECC-02, ECC-03 | held multiscale-context candidate | cross-domain support; no endocrine-specific principle |
| local receiver configuration decodes one broadcast differently | ECC-04, ECC-06, ECC-09 | held multiscale-context candidate; adjacent to P-008 | duplicate of receiver-specific temporal decoding |
| a diffusible pacemaker output coordinates behavior | ECC-05 | held multiscale-context candidate + P-011 | broadcast feasibility; dimensionality and efficiency remain unmeasured |
| autonomous local clocks retain phase between sparse corrections | ECC-06–ECC-08 | P-002 + P-011, with a candidate gap | genuinely distinct from a transient receiver filter, but equivalent to conventional local-clock engineering until disproved |
| coupling trades noise rejection for entrainability | ECC-09, ECC-10 | P-006 + P-011 | evaluation constraint on local clocks, not a new invariant |
| temporally separate resource and maintenance activity | ECC-11 | P-009 + P-011 | duplicate of scheduling/control-plane separation |
| phase conflict degrades the composed system | ECC-08, ECC-12 | cross-cutting failure mode | test condition, not a principle |

### Candidate boundary: entrainable local phase state

The only operation not already captured cleanly by P-001–P-013 or Candidate
002 is:

> **Entrainable local phase state.** A local controller carries an autonomous
> phase that continues evolving without a continuous command. Sparse external
> or peer signals correct that phase through a receiver-specific response rule;
> competing zeitgebers may address different controllers. Coupling trades
> coherence and noise rejection against speed and range of re-entrainment.

This should remain outside the stable registry. Its strongest engineered
implementation is a local timer plus a phase-locked loop, distributed clock
discipline, or cyclic scheduler. It earns a separate experiment only if the
task requires phase-dependent local behavior that a timestamp plus those
methods cannot provide at the same state, communication, and energy budget.

### Candidate 002 refinement

The endocrine evidence does not justify adding hormone-named channels. It adds
three controls to the existing context-broadcast experiment:

1. Match integrated broadcast magnitude and transmitted bits across constant,
   pulsed, and scrambled waveforms.
2. Include identified FIR/state-space receivers and pulse-width/frequency
   modulation as baselines, not only neural conditioning methods.
3. Separate a transient receiver state from a persistent phase oscillator. If
   the task rewards only phase tracking, Candidate 002 is the wrong mechanism
   and a clock-synchronization experiment should be run instead.

## Strongest engineering nulls, in required order

1. **Waveform decoding:** memoryless scalar conditioning; shared FIR/IIR
   filter; receiver-specific state-space model; equal-parameter recurrent gate;
   pulse-width/frequency modulation; low-rank hypernetwork; high-bandwidth
   router.
2. **Entrainment:** global timestamp; cyclic executive; local timer with
   phase-locked loop; multi-source clock discipline; consensus/Kuramoto
   coupling; learned phase controller.
3. **Feedback:** tuned PID/relay controller; identified delayed state-space
   controller; model-predictive control; learned recurrent controller.
4. **Resource arbitration:** fixed windows; batch queue; earliest-deadline-
   first; job-shop optimizer; learned schedule.
5. **Failure detection:** clock-skew alarm and end-to-end service-level
   monitor before any biological early-warning mechanism.

A biological translation fails if it only renames one of these methods, if it
uses more hidden state or communication than its null, or if its controller and
monitoring energy erase task-path savings.

## Proposed claim statements for integration

The labels below are local to this audit. The root ledger should allocate
stable `C-` IDs only after checking for collisions and duplicate wording.

### Proposed-C-ECC-01

- **Statement:** A data-constrained pituitary-adrenal model showed that delayed
  feed-forward and glucocorticoid negative-feedback interactions are
  sufficient to generate ultradian pulses without an ultradian hypothalamic
  input.
- **Status:** plausible; model sufficiency supported by in vivo pattern
  comparison, not exhaustive causal exclusion.
- **Primary source:** `walker2010ultradian`.
- **Destination:** P-006; do not create a new principle.

### Proposed-C-ECC-02

- **Statement:** In the cited cell and animal preparations, pulsatile and
  constant glucocorticoid exposure produced different receptor-occupancy and
  transcription dynamics.
- **Status:** established for the measured preparations and waveforms.
- **Primary source:** `stavreva2009ultradian`.
- **Destination:** Candidate 002.

### Proposed-C-ECC-03

- **Statement:** At matched portal insulin delivery rate, physiological pulses
  produced stronger measured hepatic action and signaling than constant
  delivery in the cited dog and rat experiments.
- **Status:** established for the interventions, species, and endpoints.
- **Primary source:** `matveyenko2012pulsatile`.
- **Destination:** Candidate 002.

### Proposed-C-ECC-04

- **Statement:** In perifused LβT2 cells, GnRH pulse frequency differentially
  regulated LHβ and FSHβ promoter activity, and changing receptor abundance
  selectively altered frequency decoding.
- **Status:** established for the cell-line promoter assay.
- **Primary source:** `bedecarrats2003gnrh`.
- **Destination:** Candidate 002; cross-link C-048.

### Proposed-C-ECC-05

- **Statement:** An encapsulated SCN graft that prevented neural outgrowth but
  permitted diffusion restored circadian locomotor rhythmicity in SCN-lesioned
  hamsters.
- **Status:** established for the transplant preparation and behavioral
  endpoint.
- **Primary source:** `silver1996diffusible`.
- **Destination:** Candidate 002 and P-011.

### Proposed-C-ECC-06

- **Statement:** Dexamethasone phase-shifted peripheral but not SCN clock-gene
  rhythms, and the measured hepatic shift required local glucocorticoid
  receptors while baseline liver rhythmicity had redundant support.
- **Status:** established for the cited mouse and cell interventions.
- **Primary source:** `balsalobre2000resetting`.
- **Destination:** Candidate 002; candidate entrainable local phase state.

### Proposed-C-ECC-07

- **Statement:** Isolated mouse peripheral tissues sustained tissue-specific
  PERIOD2 rhythms for more than 20 cycles, while SCN lesions caused peripheral
  phase desynchrony rather than abolishing local oscillation.
- **Status:** established for the reporter, tissues, and lesion experiment.
- **Primary source:** `yoo2004period2`.
- **Destination:** P-002, P-011; candidate entrainable local phase state.

### Proposed-C-ECC-08

- **Statement:** Restricted daytime feeding gradually shifted mouse peripheral
  clocks by up to 12 hours with tissue-specific kinetics while leaving the SCN
  clock largely unchanged.
- **Status:** established for the feeding schedules, tissues, and gene-expression
  measurements.
- **Primary source:** `damiola2000feeding`.
- **Destination:** P-002, P-011; candidate entrainable local phase state.

### Proposed-C-ECC-09

- **Statement:** VIP or VPAC2 loss reduced rhythmicity and synchrony among
  mouse SCN neurons, and periodic VPAC2 agonist rescued VIP-deficient but not
  receptor-deficient tissue.
- **Status:** established for the genetic, pharmacological, neuronal, and
  behavioral assays.
- **Primary source:** `aton2005vip`.
- **Destination:** Candidate 002 and P-011.

### Proposed-C-ECC-10

- **Statement:** In the cited SCN/lung experiments and oscillator analysis,
  stronger inter-oscillator coupling increased rigidity and narrowed the range
  of external entrainment; pharmacological coupling reduction broadened SCN
  entrainment.
- **Status:** established for the experimental preparation and model-supported
  mechanism.
- **Primary source:** `abraham2010coupling`.
- **Destination:** P-006, P-011; constraint on entrainable local phase state.

### Proposed-C-ECC-11

- **Statement:** In high-fat-fed mice consuming equivalent calories, an
  eight-hour daily feeding window changed circadian/metabolic dynamics and
  improved the measured metabolic outcomes relative to ad-libitum access.
- **Status:** established for the mouse intervention; mechanism remains
  confounded among phase, fasting duration, and intake distribution.
- **Primary source:** `hatori2012timerestricted`.
- **Destination:** P-009 and P-011.

### Proposed-C-ECC-12

- **Statement:** In a ten-person forced-desynchrony study with controlled
  isocaloric meals, behavioral/endogenous circadian misalignment degraded
  multiple metabolic, endocrine, cardiovascular, and sleep measures.
- **Status:** established for the protocol and sample; effect sizes are not
  universal constants.
- **Primary source:** `scheer2009misalignment`.
- **Destination:** failure-mode links to P-006, P-009, and P-011.

## Proposed BibTeX entries for integration

```bibtex
@article{walker2010ultradian,
  author  = {Walker, Jamie J. and Terry, John R. and Lightman, Stafford L.},
  title   = {Origin of Ultradian Pulsatility in the Hypothalamic-Pituitary-Adrenal Axis},
  journal = {Proceedings of the Royal Society B: Biological Sciences},
  year    = {2010},
  volume  = {277},
  number  = {1688},
  pages   = {1627--1633},
  doi     = {10.1098/rspb.2009.2148},
  url     = {https://doi.org/10.1098/rspb.2009.2148}
}

@article{stavreva2009ultradian,
  author  = {Stavreva, Diana A. and Wiench, Malgorzata and John, Sam and Conway-Campbell, Becky L. and McKenna, Mervyn A. and Pooley, John R. and Johnson, Thomas A. and Voss, Ty C. and Lightman, Stafford L. and Hager, Gordon L.},
  title   = {Ultradian Hormone Stimulation Induces Glucocorticoid Receptor-Mediated Pulses of Gene Transcription},
  journal = {Nature Cell Biology},
  year    = {2009},
  volume  = {11},
  number  = {9},
  pages   = {1093--1102},
  doi     = {10.1038/ncb1922},
  url     = {https://doi.org/10.1038/ncb1922}
}

@article{matveyenko2012pulsatile,
  author  = {Matveyenko, Aleksey V. and Liuwantara, David and Gurlo, Tatyana and Kirakossian, David and Dalla Man, Chiara and Cobelli, Claudio and White, Morris F. and Copps, Kyle D. and Volpi, Elena and Fujita, Satoshi and Butler, Peter C.},
  title   = {Pulsatile Portal Vein Insulin Delivery Enhances Hepatic Insulin Action and Signaling},
  journal = {Diabetes},
  year    = {2012},
  volume  = {61},
  number  = {9},
  pages   = {2269--2279},
  doi     = {10.2337/db11-1462},
  url     = {https://doi.org/10.2337/db11-1462}
}

@article{bedecarrats2003gnrh,
  author  = {B{\'e}d{\'e}carrats, Gr{\'e}goy Y. and Kaiser, Ursula B.},
  title   = {Differential Regulation of Gonadotropin Subunit Gene Promoter Activity by Pulsatile Gonadotropin-Releasing Hormone ({GnRH}) in Perifused {LbetaT2} Cells: Role of {GnRH} Receptor Concentration},
  journal = {Endocrinology},
  year    = {2003},
  volume  = {144},
  number  = {5},
  pages   = {1802--1811},
  doi     = {10.1210/en.2002-221140},
  url     = {https://doi.org/10.1210/en.2002-221140}
}

@article{silver1996diffusible,
  author  = {Silver, Rae and LeSauter, Joseph and Tresco, Patrick A. and Lehman, Michael N.},
  title   = {A Diffusible Coupling Signal from the Transplanted Suprachiasmatic Nucleus Controlling Circadian Locomotor Rhythms},
  journal = {Nature},
  year    = {1996},
  volume  = {382},
  number  = {6594},
  pages   = {810--813},
  doi     = {10.1038/382810a0},
  url     = {https://doi.org/10.1038/382810a0}
}

@article{balsalobre2000resetting,
  author  = {Balsalobre, Aurelio and Brown, Steven A. and Marcacci, Laura and Tronche, Fran{\c{c}}ois and Kellendonk, Christoph and Reichardt, Holger M. and Sch{\"u}tz, G{\"u}nther and Schibler, Ueli},
  title   = {Resetting of Circadian Time in Peripheral Tissues by Glucocorticoid Signaling},
  journal = {Science},
  year    = {2000},
  volume  = {289},
  number  = {5488},
  pages   = {2344--2347},
  doi     = {10.1126/science.289.5488.2344},
  url     = {https://doi.org/10.1126/science.289.5488.2344}
}

@article{yoo2004period2,
  author  = {Yoo, Seung-Hee and Yamazaki, Shin and Lowrey, Phillip L. and Shimomura, Kazuhiro and Ko, Caroline H. and Buhr, Ethan D. and Siepka, Sara M. and Hong, Hee-Kyung and Oh, Won Jun and Yoo, Ohkmae K. and Menaker, Michael and Takahashi, Joseph S.},
  title   = {{PERIOD2::LUCIFERASE} Real-Time Reporting of Circadian Dynamics Reveals Persistent Circadian Oscillations in Mouse Peripheral Tissues},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2004},
  volume  = {101},
  number  = {15},
  pages   = {5339--5346},
  doi     = {10.1073/pnas.0308709101},
  url     = {https://doi.org/10.1073/pnas.0308709101}
}

@article{damiola2000feeding,
  author  = {Damiola, Francesca and Le Minh, Nguyet and Preitner, Nicolas and Kornmann, Beno{\^i}t and Fleury-Olela, Fabienne and Schibler, Ueli},
  title   = {Restricted Feeding Uncouples Circadian Oscillators in Peripheral Tissues from the Central Pacemaker in the Suprachiasmatic Nucleus},
  journal = {Genes \& Development},
  year    = {2000},
  volume  = {14},
  number  = {23},
  pages   = {2950--2961},
  doi     = {10.1101/gad.183500},
  url     = {https://doi.org/10.1101/gad.183500}
}

@article{aton2005vip,
  author  = {Aton, Sara J. and Colwell, Christopher S. and Harmar, Anthony J. and Waschek, James and Herzog, Erik D.},
  title   = {Vasoactive Intestinal Polypeptide Mediates Circadian Rhythmicity and Synchrony in Mammalian Clock Neurons},
  journal = {Nature Neuroscience},
  year    = {2005},
  volume  = {8},
  number  = {4},
  pages   = {476--483},
  doi     = {10.1038/nn1419},
  url     = {https://doi.org/10.1038/nn1419}
}

@article{abraham2010coupling,
  author  = {Abraham, Ute and Granada, Adri{\'a}n E. and Westermark, P{\aa}l O. and Heine, Markus and Kramer, Achim and Herzel, Hanspeter},
  title   = {Coupling Governs Entrainment Range of Circadian Clocks},
  journal = {Molecular Systems Biology},
  year    = {2010},
  volume  = {6},
  pages   = {438},
  doi     = {10.1038/msb.2010.92},
  url     = {https://doi.org/10.1038/msb.2010.92}
}

@article{hatori2012timerestricted,
  author  = {Hatori, Megumi and Vollmers, Christopher and Zarrinpar, Amir and DiTacchio, Luciano and Bushong, Eric A. and Gill, Shubhroz and Leblanc, Mathias and Chaix, Amandine and Joens, Matthew and Fitzpatrick, James A. J. and Ellisman, Mark H. and Panda, Satchidananda},
  title   = {Time-Restricted Feeding without Reducing Caloric Intake Prevents Metabolic Diseases in Mice Fed a High-Fat Diet},
  journal = {Cell Metabolism},
  year    = {2012},
  volume  = {15},
  number  = {6},
  pages   = {848--860},
  doi     = {10.1016/j.cmet.2012.04.019},
  url     = {https://doi.org/10.1016/j.cmet.2012.04.019}
}

@article{scheer2009misalignment,
  author  = {Scheer, Frank A. J. L. and Hilton, Michael F. and Mantzoros, Christos S. and Shea, Steven A.},
  title   = {Adverse Metabolic and Cardiovascular Consequences of Circadian Misalignment},
  journal = {Proceedings of the National Academy of Sciences},
  year    = {2009},
  volume  = {106},
  number  = {11},
  pages   = {4453--4458},
  doi     = {10.1073/pnas.0808180106},
  url     = {https://doi.org/10.1073/pnas.0808180106}
}
```

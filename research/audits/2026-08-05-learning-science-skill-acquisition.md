# Learning science, expertise, and skill acquisition: primary-source audit

- **Audit date:** 2026-08-05
- **Scope:** retrieval practice, spacing, interleaving, instructional difficulty,
  examples and fading, deliberate practice, feedback, mastery, curriculum,
  transfer, metacognition, sleep, and social instruction
- **Evidence rule:** primary experiments support scoped observations; reviews and
  meta-analyses organize search space but do not establish a mechanism here
- **Promotion state:** audit-local `LS-` claims only; no stable claim or principle
  is promoted by this file

## Executive finding

The literature does not support one context-free recipe called “better
learning.” It supports a narrower decomposition. Retrieval can improve delayed
retention relative to another exposure; the useful spacing interval depends on
the intended retention horizon; interleaving can improve discrimination and
transfer when categories are confusable but can lose when within-category
structure must first be learned; examples help novices acquire procedures while
support must eventually be withdrawn; feedback helps only through the
information and action it enables; and practice hours do not identify the cause
of expertise.

The smallest engineering residual is **retention-horizon- and
transfer-qualified adaptive instructional sequencing**:

> Choose the next learning event from an estimated, skill-local learner state;
> make help, retrieval effort, spacing, and variation conditional on successful
> processing; and evaluate delayed retention, novel transfer, fluency,
> calibration, motivation, and total effort separately.

This is not a new biological principle and does not justify a new candidate.
It refines [Candidate 004](../../experiments/candidates/004-closed-endogenous-curriculum.md)
by giving its curriculum evaluator explicit retention horizons, skill-local
scaffold state, and outcome-specific gates. It refines
[Candidate 019](../../experiments/candidates/019-audited-cumulative-inheritance.md)
by requiring a teaching or transmission channel to preserve independently
tested retention and transfer across learner turnover at equal cumulative
effort. Feedback does **not** refine
[Candidate 010](../../experiments/candidates/010-reset-coupled-staged-verification.md)
unless it supplies conditionally new evidence to a distinct commit decision;
ordinary correction remains an instructional baseline.

## Outcome firewall

Every claim must identify its outcome. A method may improve one and worsen
another.

| Outcome | Operational question | Minimum measurement | Common substitution error |
| --- | --- | --- | --- |
| acquisition | what changed by the end of instruction? | pre/post performance on trained content | treating end-of-practice success as durable learning |
| retention | what remains after a declared delay? | surprise or preregistered delayed test at $\Delta$ | reporting only immediate post-test |
| transfer | does state support a changed cue, representation, context, or problem? | preregistered near and novel-transfer strata | relabeling another trained example as “far transfer” |
| fluency | how accurately and quickly can the skill be executed? | full speed–accuracy distribution and task time | crediting speed while errors rise |
| calibration | do confidence probabilities match correctness? | item-level confidence before feedback | equating confidence with competence |
| motivation | will the learner begin, persist, or return? | choice, persistence, return, and self-report separately | inferring motivation from exposure time assigned by the experimenter |

Instruction time, number of retrieval attempts, examples viewed, corrective
messages, instructor attention, sleep opportunity, and learner selection are
causal inputs or costs—not learning outcomes.

## Promotion rule and ordinary null stack

A transferable state-transition claim requires all of the following:

1. a manipulable instructional operation rather than a retrospective label;
2. a matched alternative with exposure, time, attempts, and feedback accounted;
3. a delayed measure rather than end-of-practice performance alone;
4. a transfer measure whose distance and scoring rule were fixed in advance;
5. learner-, item-, instructor-, and cohort-level dependence handled where
   present;
6. failures, hints, retries, attrition, and unconsumed budget reported; and
7. a conventional scheduler, tutor, retrieval system, or curriculum baseline.

The strongest null stack is rereading with matched exposure, retrieval with
matched attempts and corrective information, fixed expanding intervals,
ordinary spaced repetition, blocked and random practice, mastery by fixed
criterion, worked examples with fixed fading, a standard knowledge-tracing
tutor, ordinary active learning, standard curriculum learning, centralized
continual learning, and external artifacts plus tests. A biological or
pedagogical name earns no credit by itself.

## Quantitative contract

### Acquisition and retained change

For learner $i$, item or task $j$, and treatment $m$, let $Y_{ijm}(t)$ be a
declared score in **score units** at time $t$. For binary items it is 0 or 1;
for a rubric it may be points, but different rubrics are not silently combined.
The raw acquisition change is

$$
A_{ijm}=Y_{ijm}(t_{\mathrm{post}})-Y_{ijm}(t_{\mathrm{pre}}),
$$

in score units. The retention change at delay $\Delta$ seconds or days is

$$
R_{ijm}(\Delta)=Y_{ijm}(t_{\mathrm{post}}+\Delta)
                -Y_{ijm}(t_{\mathrm{pre}}).
$$

Report the raw treatment contrast

$$
\operatorname{ATE}_{R}(\Delta)
=\mathbb{E}[R(\Delta)\mid M=m]
-\mathbb{E}[R(\Delta)\mid M=m_0]
$$

in score units with uncertainty. A normalized gain can hide ceiling effects
and is never the sole result. The retention horizon $\Delta$ is part of the
claim, not a nuisance variable.

### Transfer is a vector, not a slogan

Let $d\in\{0,1,2,3\}$ denote a preregistered transfer stratum: trained form,
near variant, changed representation/context, and novel causal composition.
Then

$$
T_m(d)=\mathbb{E}[Y^{\mathrm{transfer}}\mid M=m,D=d]
       -\mathbb{E}[Y^{\mathrm{transfer}}\mid M=m_0,D=d]
$$

is measured in score units. Report $T_m(d)$ for every $d$; do not average it
into one “generalization” number. A valid novel-transfer item must not share the
answer, superficial cue, or solution trace used in training.

### Fluency and speed–accuracy

For $n$ tasks completed in elapsed time $\tau$ seconds, with $c$ correct,

$$
F=\frac{c}{\tau}\quad [\mathrm{correct\ tasks\ s^{-1}}],
\qquad
e=1-\frac{c}{n}\quad [1].
$$

Report the Pareto frontier $(F,e)$ plus p50 and p95 task time. A faster method
does not win if its error, abstention, or unsafe-action rate moves outside the
registered envelope.

### Calibration and metacognitive discrimination

For item confidence $p_k\in[0,1]$ elicited before feedback and correctness
$y_k\in\{0,1\}$, the Brier score is

$$
\operatorname{BS}=\frac{1}{N}\sum_{k=1}^{N}(p_k-y_k)^2\quad [1].
$$

Expected calibration error is reported only with fixed bins $B_b$:

$$
\operatorname{ECE}=\sum_{b=1}^{B}\frac{|B_b|}{N}
\left|\operatorname{acc}(B_b)-\operatorname{conf}(B_b)\right|\quad [1].
$$

Also report discrimination, such as AUROC for confidence predicting
correctness. Calibration can improve while discrimination does not, and vice
versa.

### Instructional and lifecycle cost

For method $m$, define

$$
C_m=
w_t\tau_m+w_eN_{m,\mathrm{exposure}}+w_rN_{m,\mathrm{retrieval}}
+w_fN_{m,\mathrm{feedback}}+w_hN_{m,\mathrm{hint}}
+w_bB_{m,\mathrm{state}}+w_EE_m,
$$

where $\tau_m$ is seconds, the four $N$ terms are dimensionless counts,
$B_{m,\mathrm{state}}$ is stored bytes, $E_m$ is measured joules at a declared
boundary, and each $w$ converts its input to a declared cost unit. Raw
components remain visible. Variable-time mastery may be useful, but it cannot
claim efficiency without charging its extra opportunities.

### Horizon-qualified scheduling objective

For learner state $s_t$, candidate event $a$, and target horizons
$\mathcal H$, a scheduler may estimate

$$
Q(a\mid s_t)=
\sum_{\Delta\in\mathcal H}\alpha_\Delta
\widehat{R}(\Delta\mid s_t,a)
+\beta\widehat{T}(d_{\mathrm{target}}\mid s_t,a)
+\gamma\widehat{F}(s_t,a)
-\lambda\widehat{C}(s_t,a)
-\rho\widehat{P}_{\mathrm{fail}}(s_t,a),
$$

where all hatted terms are preregistered predictions,
$\alpha,\beta,\gamma,\lambda,\rho$ convert them to one scheduling utility, and
$\widehat{P}_{\mathrm{fail}}$ is the probability that the learner cannot
successfully process the event even with registered feedback. This equation is
a testable policy class, not a psychological law.

## Evidence cards

## 1. Retrieval practice and testing effects

### Human observation

Roediger and Karpicke found that repeated study produced better performance
after five minutes, whereas taking recall tests produced better retention after
two days and one week; repeated study also increased learners' confidence
([DOI](https://doi.org/10.1111/j.1467-9280.2006.01693.x)). Karpicke and
Roediger then held initial learning constant and found that continued retrieval
after correct recall improved delayed recall while additional study after
correct recall did not; predicted performance was poorly related to actual
performance ([DOI](https://doi.org/10.1126/science.1152408)). Butler reported
benefits of repeated testing on changed knowledge questions, not only verbatim
retention ([DOI](https://doi.org/10.1037/a0019902)).

Rawson and Dunlosky manipulated initial correct-recall criteria and later
relearning across three experiments. More relearning sessions produced durable
retention with comparatively few added trials, but the exact reported schedule
is a result of those materials and horizons, not a universal constant
([DOI](https://doi.org/10.1037/a0023956)). A classroom geography study found a
benefit even when unaided practice-test performance was low because hints and
feedback allowed successful retrieval attempts
([DOI](https://doi.org/10.1002/acp.3517)).

### Proposed AI translation

Replace passive re-exposure with state reconstruction: require a learner or
model to produce an answer, latent relation, plan, or executable fragment before
showing corrective evidence. Record success, latency, hint level, and error
type. Schedule future retrieval according to the target horizon and item-level
state rather than global epoch count.

### Efficiency mechanism

Retrieval can make an exposure diagnostically useful while exercising access
paths needed later. It may reduce redundant restudy when successful recall is
already stable. The gain is not free: failed attempts, scoring, hints, feedback,
and latency must be charged.

### Evidence status and boundaries

**Established for scoped verbal/conceptual tasks:** retrieval practice can
improve delayed retention relative to restudy. **Plausible but conditional:**
retrieving varied examples can improve transfer. **Not established:** every
test improves learning; unsupported failure is desirable; generation by a
model updates its parameters; or retrieval should replace explanation and
initial encoding.

### Failure modes and measurable predictions

- Test-format matching masquerades as transfer.
- Extra response time or feedback, not retrieval, explains the effect.
- Repeated errors become fluent when correction is absent or delayed too far.
- Easy items consume scheduler budget while rare weak items starve.
- A standard spaced-repetition baseline matches retention at lower cost.

Prediction: at matched exposures, time, feedback bits, and scoring, successful
retrieval should improve $R(\Delta)$; if it only raises trained-cue performance
at $d=0$, the transfer claim is rejected.

## 2. Spacing and interleaving

### Human observation

Cepeda et al. varied study gaps and final retention intervals in more than 1,300
participants. The gap producing the best test performance increased with the
retention interval, yielding a ridge rather than one optimal delay
([DOI](https://doi.org/10.1111/j.1467-9280.2008.02209.x)). Lindsey et al.
embedded personalized retrieval review in a middle-school foreign-language
course and reported better cumulative post-semester retention than time-matched
massed and one-size-fits-all spaced review
([DOI](https://doi.org/10.1177/0956797613504302)).

In mathematics, shuffled problem types improved later performance compared
with blocked practice despite worse practice performance
([DOI](https://doi.org/10.1007/s11251-007-9015-8)). Interleaving is not a
generic good, however. Carvalho and Goldstone found interleaving favored
categories with high similarity while blocking favored a lower-similarity
structure ([DOI](https://doi.org/10.3758/s13421-013-0371-0)); active versus
passive study also changed the relative schedule benefit
([DOI](https://doi.org/10.3758/s13423-014-0676-4)). Taylor and Rohrer held
spacing constant in a child mathematics task to isolate order
([DOI](https://doi.org/10.1002/acp.1598)).

### Proposed AI translation

Attach a target retention horizon and a confusability estimate to each skill or
concept. Space retrieval according to estimated forgetting, and interleave
examples when discrimination among competing operations is the target. Use
blocked runs when the learner still needs stable within-class structure.

### Efficiency mechanism

Spacing avoids spending practice on state that remains readily accessible;
interleaving turns practice into contrastive discrimination. Both can lower
immediate fluency, so efficiency is evaluated on the delayed quality–cost
frontier.

### Evidence status and boundaries

**Established:** distributed practice often changes delayed retention, and the
useful gap depends on the retention horizon. **Plausible and
structure-dependent:** interleaving helps when correct category or strategy
selection is the bottleneck. **Disputed as an absolute:** random shuffling is
always superior to blocks.

### Failure modes and measurable predictions

- More elapsed calendar time introduces uncontrolled sleep or interference.
- Interleaving also changes spacing and example similarity.
- Personalization receives more attempts or easier items.
- A learned forgetting model overfits familiar students and fails new cohorts.
- Immediate frustration lowers persistence enough to offset retention.

Prediction: a horizon-aware scheduler must beat fixed massed, fixed expanding,
and tuned one-size schedules at equal attempts and time. Interleaving should
interact with measured confusability; a uniform main effect is not required.

## 3. Desirable difficulty and the success boundary

### Human observation

Pyc and Rawson found that difficult but successful retrieval was associated
with better later recall, supporting a retrieval-effort account within the
studied paired-associate procedures
([DOI](https://doi.org/10.1016/j.jml.2009.01.004)). Their cue study also exposed
the opposing constraints: reducing support can increase effort but also reduce
retrieval success, and feedback changes the cost of failure
([DOI](https://doi.org/10.1016/j.jml.2011.01.006)).

Perceptual difficulty is not equivalent to productive processing. Across four
experiments, Sans Forgetica did not improve memory
([DOI](https://doi.org/10.1080/09658211.2020.1758726)); another study found no
benefit with a longer delay and unexpected test
([DOI](https://doi.org/10.1177/21582440211056624)).

### Proposed AI translation

Control difficulty using task-relevant state transitions: withhold a hint,
require a reconstruction, vary the cue, or change the context. Maintain a
viability band in which the target operation is effortful but usually
successful with bounded corrective support. Do not add friction merely to
increase compute or latency.

### Efficiency mechanism

Productive difficulty may allocate computation to weak access paths or
discrimination boundaries. Friction without informative processing is pure
overhead.

### Evidence status, failure modes, and prediction

**Plausible:** successful effort is one mediator of durable retrieval in
specific tasks. **Disputed as a general rule:** harder presentation creates
better learning. The principal failures are uncorrected error, dropout,
motivation loss, inaccessible prior knowledge, and confusing latency with
cognitive work. At equal success and feedback, task-relevant difficulty should
predict delayed retention; visual disfluency or random compute should not.

## 4. Worked examples, scaffolding, self-explanation, and fading

### Human observation

Across five algebra experiments, Sweller and Cooper found that worked examples
could substitute for conventional problem solving during acquisition and
improve later performance in the studied novice tasks
([DOI](https://doi.org/10.1207/s1532690xci0201_3)). Atkinson, Renkl, and Merrill
manipulated self-explanation prompts and fading of worked steps
([DOI](https://doi.org/10.1037/0022-0663.95.4.774)); Renkl, Atkinson, and Große
examined fading from a cognitive-load perspective
([DOI](https://doi.org/10.1023/B:TRUC.0000021815.74806.f6)). Moreno's electrical
engineering study crossed fading and feedback
([DOI](https://doi.org/10.1002/j.2168-9830.2009.tb01007.x)).

Chi et al.'s good-versus-poor student protocols associated spontaneous
self-explanation with successful example learning but were observational
([DOI](https://doi.org/10.1207/s15516709cog1302_1)). A later intervention
eliciting self-explanations provided causal evidence in the studied domain
([DOI](https://doi.org/10.1016/0364-0213(94)90016-7)). Prior knowledge can
moderate example benefit, but expertise reversal is not automatic: a legal-case
experiment found worked examples useful for both less and more advanced
learners in that less-structured task
([DOI](https://doi.org/10.1016/j.cedpsych.2012.12.004)).

### Proposed AI translation

Represent support at the level of a skill or knowledge component: full
execution trace, partial trace, cue, verification only, or independent action.
Fade a component only after the learner can generate and explain it under
changed examples; restore support after failures or drift. Keep explanations
separate from answer leakage.

### Efficiency mechanism

Examples avoid expensive unguided search before the learner has a usable
schema. Fading shifts work to the learner once generation becomes informative.
A state-dependent policy can avoid both permanent hand-holding and premature
removal.

### Evidence status, failure modes, and prediction

**Established for scoped novice problem solving:** examples can improve
acquisition efficiency. **Plausible:** component-level fading can improve robust
learning. **Not established:** one expertise threshold applies across tasks, or
self-explanation text proves causal understanding. Failures include copied
traces, shallow paraphrase, hidden solution leakage, wrong skill decomposition,
and support oscillation. Adaptive fading must beat fixed example–problem
alternation at equal example content, attempts, and time, particularly under
transfer and return after delay.

## 5. Deliberate practice and expertise

### Human observation

Ericsson, Krampe, and Tesch-Römer characterized deliberate practice as
structured activity designed to improve performance and reported retrospective
practice histories that differed across selected musician groups
([DOI](https://doi.org/10.1037/0033-295X.100.3.363)). This is influential
evidence about association and task structure, not randomized evidence that
practice hours alone caused group membership. Macnamara and Maitra's
double-blind violinist replication found much smaller group differences and no
practice difference between their best and good violinists
([DOI](https://doi.org/10.1098/rsos.190327)).

### Proposed AI translation

Decompose practice into target selection, attempt, immediate evidence,
diagnosis, correction, repeat, and later transfer. Allocate work to a measured
performance bottleneck at a difficulty that permits correction. Retain the
teacher, evaluator, curriculum, and opportunity structure as explicit inputs.

### Efficiency mechanism

Focused practice may spend trials on current bottlenecks rather than replaying
already fluent routines. It can also create narrow overfitting; only
quality-adjusted progress per lifecycle cost counts.

### Evidence status, failure modes, and prediction

**Established:** accumulated structured practice and expertise are associated
in several domains. **Plausible:** targeted practice causes improvement on
specific trainable skills. **Disputed:** a fixed hour total is sufficient or
explains elite performance. Selection, prior ability, age of access, coaching,
resources, injury, survivorship, and retrospective recall are major threats.
A randomized micro-skill intervention can test the practice loop; it cannot
causally identify the origins of lifetime elite expertise.

## 6. Feedback timing, content, and actionability

### Human observation

Butler, Karpicke, and Roediger varied feedback timing after multiple-choice
tests and found delayed feedback superior on final cued recall in their
conditions ([DOI](https://doi.org/10.1037/1076-898X.13.4.273)). The result does
not make delay intrinsically beneficial: delay changes spacing, opportunity to
perseverate in error, and what the learner remembers at correction time. In an
online randomized trial, self-referenced and reward-based messages changed
academic and motivational outcomes differently
([DOI](https://doi.org/10.1016/j.compedu.2021.104306)).

### Proposed AI translation

Record feedback as typed information: correctness only, correct answer,
explanation, error classification, next action, confidence-targeted correction,
or reward. Deliver it when the learner can use it, and require a subsequent
action that reveals whether the information changed state.

### Efficiency mechanism

Feedback can prevent repeated error and focus the next update. Delaying it may
add retrieval and spacing; immediate correction may prevent consolidation of a
wrong path. The correct policy depends on error cost and whether a retry is
available.

### Evidence status, failure modes, and prediction

**Established:** feedback effects depend on content, timing, task, and final
test. **Not established:** immediate or delayed feedback is universally best.
Failures include reward hacking, answer copying, stale correction, excess
messages, learned dependence, and unmeasured instructor attention. A feedback
policy must beat correctness-only and full-correction controls with identical
bits, attempts, timing opportunities, and time.

## 7. Mastery learning and curriculum sequencing

### Human observation

“Mastery learning” is a package rather than one operation: a criterion, repeated
assessment, corrective material, additional attempts, variable time, and often
enrichment. Fuchs, Fuchs, and Tindal varied implementation of mastery procedures
in first-grade mathematics; stronger implementation particularly helped the
lower-achieving subgroup in that study
([DOI](https://doi.org/10.1080/00220671.1986.10885693)). An older factorial
experiment crossed mastery status and test-item feedback
([DOI](https://doi.org/10.1037/h0034820)). A university physics study found
better near and far-transfer scores for a mastery-style online condition, but
the condition also included narrated solutions and levels, so the threshold
cannot be isolated from the bundle
([DOI](https://doi.org/10.1103/PhysRevSTPER.11.010114)).

Curriculum order is equally underspecified. A sequence can change prerequisite
availability, example contrast, difficulty, delay, and opportunity to revisit.
The spacing and interleaving evidence above rejects both one globally optimal
order and a policy based only on current accuracy.

### Proposed AI translation

Maintain a versioned prerequisite graph with uncertainty, not a fixed linear
syllabus. A mastery gate is skill-local and names the criterion, evidence
window, retention horizon, allowable help, and failure action. The scheduler
can revisit a prerequisite, interleave a contrast, request transfer, or advance;
it cannot infer mastery from one helped response.

### Efficiency mechanism

Criterion gating can reduce cascading error from missing prerequisites, while
variable time spends more work on weak skills. An adaptive sequence can avoid
uniform overtraining, but its state estimation and assessment cost may erase
the saving.

### Evidence status, failure modes, and prediction

**Plausible and bundle-dependent:** mastery procedures can improve achievement
in some courses. **Not established:** one threshold or sequence is optimal, or
advancing only after perfect performance is efficient. Failures include
teaching to the gate, repeated near-identical attempts, more time-on-task,
instructor expectancy, hidden enrichment, prerequisite-graph errors, and
students trapped by noisy estimates. A mastery scheduler must beat fixed order,
fixed criterion, and tuned knowledge tracing after attempts, exposure, and
elapsed time are matched or explicitly costed.

## 8. Transfer and preparation for future learning

### Human observation

Gick and Holyoak showed that spontaneous use of a structurally analogous source
to solve the radiation problem was low, while hints increased use
([DOI](https://doi.org/10.1016/0010-0285(80)90013-4)). With multiple analogs,
comparison could support schema induction and later analogical transfer
([DOI](https://doi.org/10.1016/0010-0285(83)90002-6)). Novick and Holyoak
separated mapping from adapting a mapped solution and found adaptation was a
substantial source of transfer difficulty
([DOI](https://doi.org/10.1037/0278-7393.17.3.398)). Butler's experiments showed
that retrieval practice can improve answering changed questions
([DOI](https://doi.org/10.1037/a0019902)), and retrieving across varied examples
has been reported to improve later application
([DOI](https://doi.org/10.1037/xap0000142)).

### Proposed AI translation

Train and score at least three separable operations: retrieving a relevant
source, mapping its relations, and adapting or executing it in the target.
Construct transfer sets by changing causal structure, representation, tools,
or action constraints—not merely nouns. Use analog comparison only when the
sources make a common relation identifiable.

### Efficiency mechanism

Explicit comparison can compress multiple examples into a reusable relation;
retrieval practice can preserve access to it. Separating stages prevents
expensive retraining when only source retrieval or adaptation fails.

### Evidence status, failure modes, and prediction

**Established:** spontaneous analogical transfer is often much lower than
prompted transfer in these laboratory tasks. **Plausible:** varied retrieval and
comparison improve some forms of transfer. **Not established:** a single far-
transfer score measures general intelligence. Leakage, shared wording, answer
recognition, subjective distance labels, and selective reporting are principal
risks. Improvements must survive preregistered $d=2$ and $d=3$ strata and a
held-out task family.

## 9. Metacognition and calibration

### Human observation

The retrieval studies provide a repeated dissociation: rereading can raise
confidence without producing the best delayed retention
([DOI](https://doi.org/10.1111/j.1467-9280.2006.01693.x)), and predictions can
correlate poorly with later performance
([DOI](https://doi.org/10.1126/science.1152408)). Rawson and Dunlosky found that
procedures intended to improve self-evaluation of textbook concepts did not
eliminate overconfidence
([DOI](https://doi.org/10.1080/09541440701326022)).

In a randomized physics-class comparison, students in an actively engaged
condition learned more but reported feeling that they learned less than
students in a fluent lecture condition
([DOI](https://doi.org/10.1073/pnas.1821936116)). Adaptive calibration training
has produced domain-general improvement in one small experiment
([DOI](https://doi.org/10.1037/xge0000505)), whereas a double-blind randomized
population trial of adaptive working-memory training in children found no
academic benefit at 12 or 24 months
([DOI](https://doi.org/10.1001/jamapediatrics.2015.4568)).

### Proposed AI translation

Elicit a probabilistic prediction before feedback for each relevant action.
Train calibration and task performance as separate targets. Use postdiction,
confidence revision after evidence, and the value of help-seeking as additional
signals, while withholding answer-revealing telemetry from the prediction.

### Efficiency mechanism

Calibrated self-assessment can allocate practice and escalation to weak or
risky state. Incorrect confidence can waste review budget or cause unsafe
autonomy. Elicitation and scoring overhead must be charged.

### Evidence status, failure modes, and prediction

**Established:** feeling of learning can dissociate from measured performance.
**Plausible:** explicit calibration feedback can improve metacognitive accuracy
in some tasks. **Not established:** better calibration automatically improves
learning or transfers domains. Failure modes include strategic confidence,
coarse scales, hindsight, base-rate shifts, selection of easy items, and
calibration attained by universal uncertainty. Report Brier, ECE,
discrimination, task score, and help-seeking together.

## 10. Sleep and offline consolidation with educational outcomes

### Human observation

Gais, Lucas, and Born taught high-school students vocabulary at different times
and found that sleep soon after learning improved later recall under the studied
schedule ([DOI](https://doi.org/10.1101/lm.132106)). Schreiner and Rasch replayed
spoken vocabulary cues during non-rapid-eye-movement sleep and found better
later recall for cued than uncued words
([DOI](https://doi.org/10.1093/cercor/bhu139)). In an adolescent randomized
sleep-opportunity study, four preceding restricted nights impaired acquisition
and retention of classroom-like factual knowledge through a surprise six-week
test; vigilance was also impaired, and the design did not isolate encoding from
consolidation ([DOI](https://doi.org/10.1016/j.jadohealth.2019.04.030)). Sleep
has also been reported to improve analogical transfer in a problem-solving task
([DOI](https://doi.org/10.1016/j.cognition.2015.06.005)), while other insight
tasks have produced null results
([DOI](https://doi.org/10.3389/fnhum.2018.00072)).

### Proposed AI translation

The reusable operation is not literal sleep. It is a bounded offline interval
that can replay selected state, re-estimate retention, test abstractions, and
consolidate only after held-out evaluation. Online encoding capacity and
offline update remain separate in the benchmark.

### Efficiency mechanism

Offline work can use slack periods and reduce interference with live behavior.
Selective cueing could prioritize weak or valuable state. Every replay,
evaluation, memory byte, latency window, and joule is part of lifecycle cost.

### Evidence status, failure modes, and prediction

**Established for scoped human memory tasks:** sleep timing and restriction can
change educationally relevant retention. **Plausible:** selective reactivation
contributes under some conditions. **Not established:** sleep generally creates
insight, or an AI maintenance phase inherits human sleep benefits. Circadian
time, extra wake interference, fatigue at encoding, cue-induced arousal, and
different elapsed intervals are major confounds. This evidence is already
covered architecturally by maintenance and memory-lifetime principles.

## 11. Social and pedagogical instruction

### Human observation

Bonawitz et al. found that preschoolers receiving an intentional pedagogical
demonstration focused more narrowly on the demonstrated function of a multi-use
toy than children in several non-pedagogical conditions
([DOI](https://doi.org/10.1016/j.cognition.2010.10.001)). Instruction therefore
changes what the learner infers is relevant; it can efficiently transmit a
target while reducing exploration.

In a large-enrollment physics comparison, a three-hour active-learning unit
produced higher test performance than the conventional condition
([DOI](https://doi.org/10.1126/science.1201783)). The intervention bundled
practice, feedback, peer interaction, and instructor behavior, so “active
learning” is an outcome-relevant package rather than an isolated mechanism.
The later randomized feeling-of-learning study again found more learning but
less perceived learning under active engagement
([DOI](https://doi.org/10.1073/pnas.1821936116)). Causally elicited
self-explanation provides a more specific instructional operation
([DOI](https://doi.org/10.1016/0364-0213(94)90016-7)).

### Proposed AI translation

Model the source as an intentional teacher with a bounded communication
channel. Compare trace demonstration, outcome-only evidence, explanations,
contrastive cases, interactive questions, peer proposals, and artifact-plus-
tests. Preserve learner exploration budget and independently verify what was
transmitted.

### Efficiency mechanism

Pedagogy can compress search by selecting relevant evidence and adapting to a
learner's state. It can also transmit correlated errors, suppress exploration,
and create dependence. Benefit is retention and transfer per total teacher plus
learner effort, not learner time alone.

### Evidence status, failure modes, and prediction

**Established in scoped developmental tasks:** pedagogical intent changes
exploration. **Plausible:** interactive instruction can outperform a fixed
artifact for some learners and domains. **Not established:** social instruction
is always superior or a population is required. Teacher expertise, attention,
expectancy, peer dependence, unequal speaking time, and hidden content are
threats. Candidate 019 advances only if a teaching channel preserves more
validated capability across true turnover than an ordinary versioned artifact
plus tests at equal cumulative effort.

## Deduplication

### Existing principles

| Learning-science label | Normalized operation | Existing home |
| --- | --- | --- |
| local skill practice and scaffold state | resolve a routine locally; escalate errors, novelty, or low confidence | [P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation) |
| response before answer, worked trace, tentative solution | preserve a cheap inspectable intermediate before commitment | [P-003](../principle-registry.md#p-003--temporary-trace-before-commitment) |
| practice weak/confusable content; request hints or tests | allocate sensing and compute to unresolved error | [P-007](../principle-registry.md#p-007--prediction-error-allocation) |
| spacing, relearning, offline maintenance, skill decay | match update medium and rate to the target information lifetime | [P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime) |

No learning result here distinguishes a new invariant from those operations.
The residual is a benchmarkable composition with a richer outcome contract.

### Existing candidates: exact disposition

| Candidate | Refinement from this audit | Disposition |
| --- | --- | --- |
| [004 — closed endogenous curriculum](../../experiments/candidates/004-closed-endogenous-curriculum.md) | add skill-local support state; target retention horizon; make acquisition, delayed retention, transfer, fluency, calibration, motivation, and cost separate evaluator outputs; require conventional spaced-repetition, knowledge-tracing, and fixed-curriculum nulls | **refine** |
| [010 — reset-coupled staged verification](../../experiments/candidates/010-reset-coupled-staged-verification.md) | ordinary corrective feedback, retries, and mastery gates are instructional nulls; only conditionally new evidence before a distinct expensive commit belongs in Candidate 010 | **no refinement; sharpen exclusion** |
| [019 — audited cumulative inheritance](../../experiments/candidates/019-audited-cumulative-inheritance.md) | type the transmission channel as trace, outcome, explanation, contrast, interaction, or artifact-plus-tests; score independent learner retention and novel transfer after turnover; charge teacher and learner effort | **refine** |

### Neighbor audits

- The [memory, replay, and forgetting audit](2026-08-05-memory-replay-forgetting.md)
  already owns selective maintenance, schema-sensitive consolidation,
  reconsolidation, and active forgetting. This audit adds human instructional
  outcome definitions, not another replay mechanism.
- The [endogenous generation and creativity audit](2026-08-05-endogenous-generation-creativity.md)
  already owns self-generated proposals, targeted intervention, independent
  evaluation, and pedagogical suppression of exploration. Curriculum here
  specifies retention and transfer gates for that loop.
- The [HCI and human-factors audit](2026-08-05-hci-human-factors.md) owns
  interruption, reliance, interface, workload, and human–automation allocation.
  Confidence, motivation, and help-seeking here are learner outcomes, not
  interface-quality substitutes.
- The [cultural-evolution and archaeology audit](2026-08-05-cultural-evolution-archaeology.md)
  owns social transmission, population turnover, network structure, and
  artifact-selection limits. Education supplies controlled transmission-channel
  manipulations, not a new inheritance principle.
- The [metrology audit](2026-08-05-metrology-measurement-science.md) owns
  measurands, uncertainty, traceability, decision rules, drift, and provenance.
  The equations above instantiate that contract for learning outcomes.

## Strongest causal and conventional nulls

1. Repeated exposure matched on content and elapsed time.
2. Retrieval with the same scoring, hints, correction, and attempt count.
3. Fixed massed, fixed expanding, and tuned one-size spacing.
4. Blocked, random, and similarity-stratified interleaving.
5. Ordinary example–problem alternation and fixed fading.
6. Knowledge tracing with a fixed exercise bank.
7. Direct error-driven curriculum learning and hard-example mining.
8. Fixed criterion mastery with all additional attempts charged.
9. Correct-answer feedback, explanatory feedback, and reward-only feedback with
   identical information budgets where possible.
10. Retrieval plus varied examples without an adaptive scheduler.
11. Centralized continual learning with replay and checkpoints.
12. A versioned artifact, search, and test suite without an interactive teacher.

The most informative negative results include the Sans Forgetica failures,
academic non-transfer after broad working-memory training, weak
spontaneous analogical transfer without retrieval cues, the absence of a
practice difference between elite violinist strata in the replication, and
null sleep effects on some insight tasks. They bound the mechanism more usefully
than a pooled slogan.

## Equal-budget falsification experiments

All experiments use held-out learners or model initializations, items, and task
families. Development and confirmatory budgets are separate. Each comparison
equalizes or explicitly charges examples, attempts, feedback bits, elapsed
learner time, teacher/evaluator time, memory bytes, optimizer updates, wall
time, and measured joules. Report allocated and consumed budgets.

### E-LS-01 — Retrieval versus re-exposure

Randomize item–learner pairs to restudy, free retrieval without correction,
retrieval plus answer, and retrieval plus explanatory correction. Match total
exposures and active time. Test immediately, after 48 hours, and after four
weeks using trained cues and changed questions. Reject a retrieval mechanism if
the gain disappears after correction information, response time, and test form
are matched.

### E-LS-02 — Retention-horizon scheduler

Compare massed review, fixed expanding intervals, a tuned population schedule,
a standard forgetting-curve scheduler, and the proposed multi-horizon policy.
Assign target horizons of one day, one week, and eight weeks after scheduling.
Hold attempts fixed and measure scheduler inference cost. Reject adaptivity if
one tuned fixed schedule matches every horizon's retention–cost frontier or if
gains vanish on new learners.

### E-LS-03 — Interleaving by confusability

Construct category and strategy families factorially varying within-category
variability and between-category similarity. Compare blocked, random,
round-robin, and confusability-aware schedules with spacing fixed. Measure
category selection, execution after a supplied label, retention, and transfer.
Reject the mechanism if schedule effects do not interact reproducibly with
confusability or reduce to spacing.

### E-LS-04 — Difficulty viability band

Factor hint level, retrieval lag, and correction availability while including a
pure visual-disfluency control. Estimate successful effort from accuracy,
latency, and hint use without treating latency alone as effort. Measure delayed
retention, dropout, and motivation. Reject “desirable difficulty” if harder
conditions improve only after excluding failures, or visual friction performs
equally.

### E-LS-05 — Skill-local fading

In a multi-step procedural domain, compare full examples, problem solving,
fixed example–problem alternation, fixed backward fading, and skill-local
adaptive fading. Cross learner prior knowledge and test copied, recombined, and
novel problems after a delay. Equalize solution information and attempts.
Reject adaptivity if fixed fading matches transfer or if its advantage comes
from giving easier steps or more examples.

### E-LS-06 — Deliberate-practice microcycle

Randomize trainable subskills to ordinary repetition, error-frequency targeting,
teacher-selected bottlenecks, and a diagnosis–correction–retest loop. Cap total
minutes and trials. Measure trained skill, whole-task fluency, untrained
components, injury/fatigue proxies where relevant, and transfer. Reject the loop
if gains are task-specific repetition or if whole-task performance does not
improve. Do not generalize the result to lifetime elite expertise.

### E-LS-07 — Feedback information and timing

Cross immediate versus delayed feedback with correctness-only, correct-answer,
error-class, explanatory, and action-guiding content. Provide identical later
retry opportunities and record information length. Test correction, retention,
transfer, calibration, and repeated-error rate. Reject a timing rule if content
or spacing fully explains it; reject richer feedback if equal-bit concise
correction matches it.

### E-LS-08 — Mastery and curriculum decomposition

Use a prerequisite-rich task. Factor fixed versus adaptive order, fixed versus
state-dependent criterion, and one versus variable attempts. Include a tuned
knowledge-tracing tutor. Match a primary trial budget and run a second
cost-equivalent comparison where extra time is priced. Test prerequisites,
whole tasks, delayed retention, novel transfer, and trapped-learner rate. Reject
mastery if variable time explains the result or noisy gates impede progress.

### E-LS-09 — Pedagogy, exploration, and turnover

Train independent replacement learners by raw traces, outcomes, explanations,
contrastive examples, interactive teaching, and versioned artifact-plus-tests.
Keep content bits and cumulative teacher-plus-learner time visible; preserve a
fixed exploration budget. Introduce irrelevant demonstrated actions and tool
changes. Measure acquisition, retention, novel transfer, exploration breadth,
correlated error, rare-skill retention, and newcomer cost. Candidate 019 fails
if a conventional artifact plus tests matches the interactive frontier.

### E-LS-10 — Offline interval and educational retention

For humans, randomize adequate versus restricted sleep opportunity before
learning under ethical limits and measure vigilance, acquisition, and delayed
retention; for computational systems, compare no maintenance, uniform replay,
standard prioritized replay, and selective offline evaluation at equal joules
and replay count. Keep these as parallel analogies, not a cross-species causal
identity. Reject the AI translation if ordinary replay matches it or if gains
come from extra compute; do not attribute human effects to consolidation when
encoding or vigilance explains them.

## Scoped temporary claims

| ID | Status | Scoped claim | Rejection or qualification |
| --- | --- | --- | --- |
| LS-001 | established | retrieval practice can improve delayed retention relative to restudy in scoped verbal-learning tasks | not every test, learner, or outcome |
| LS-002 | established | end-of-practice performance can reverse the ranking observed after a delay | retention horizon must be declared |
| LS-003 | plausible | varied retrieval can improve application to changed examples | transfer distance and cue overlap must be audited |
| LS-004 | established | additional study after successful retrieval can add less delayed benefit than additional retrieval in a studied procedure | not a universal stopping rule |
| LS-005 | established | useful spacing depends on target retention interval | no single optimal gap follows |
| LS-006 | plausible | individualized review can beat a time-matched one-size schedule | replication, scheduler overhead, and cohort transfer required |
| LS-007 | established | interleaving and blocking can have opposite benefits under different category structures | schedule is not a global scalar |
| LS-008 | plausible | interleaving is useful when discrimination among confusable operations is limiting | must isolate spacing |
| LS-009 | plausible | difficult but successful retrieval can improve later access | success, feedback, and motivation bound it |
| LS-010 | disputed | generic perceptual disfluency improves memory | multiple Sans Forgetica nulls reject the broad claim |
| LS-011 | established | worked examples can improve novice acquisition in scoped procedural tasks | content and task structure matter |
| LS-012 | plausible | skill-local fading can outperform fixed support | requires delayed transfer and matched information |
| LS-013 | plausible | elicited self-explanation can improve understanding in some domains | explanation text is not proof of causal knowledge |
| LS-014 | disputed | expertise reversal is automatic once a learner is advanced | less-structured tasks show exceptions |
| LS-015 | established | retrospective practice histories are associated with expertise strata in some domains | association is not randomized causation |
| LS-016 | disputed | a fixed practice-hour threshold is sufficient for elite expertise | selection and replication evidence reject the absolute |
| LS-017 | established | feedback effect depends on content, timing, task, and test | no universally best delay |
| LS-018 | plausible | action-guiding correction can reduce repeat errors efficiently | must charge information and retry opportunities |
| LS-019 | plausible | mastery bundles can improve course performance | threshold cannot be isolated from time and correction |
| LS-020 | disputed | one mastery threshold or curriculum order is universally optimal | learner, skill, and horizon state vary |
| LS-021 | established | spontaneous analogical transfer can be low despite source exposure | a hint can change retrieval |
| LS-022 | plausible | comparing analogs can support relational abstraction and later transfer | depends on source quality and mapping |
| LS-023 | established | retrieving, mapping, and adapting an analogy are separable failure points | one transfer score hides them |
| LS-024 | established | confidence or feeling of learning can diverge from delayed performance | confidence is not competence |
| LS-025 | plausible | calibration-specific feedback can improve metacognitive accuracy | transfer and task benefit remain uncertain |
| LS-026 | established | broad working-memory training need not transfer to academic outcomes | near-task improvement is insufficient |
| LS-027 | established | sleep timing or restriction can change educationally relevant factual retention in scoped human studies | encoding, vigilance, circadian time, and interference remain relevant |
| LS-028 | disputed | sleep generally produces insight or analogical transfer | task-specific nulls exist |
| LS-029 | established | pedagogical demonstration can narrow exploration in a scoped child task | instruction is not generally harmful |
| LS-030 | plausible | interactive teaching can transmit some skills more efficiently than unguided discovery | compare artifacts, tests, and total effort |
| LS-031 | established | active-learning packages can improve measured performance while reducing felt learning | package does not identify one mechanism |
| LS-032 | speculative | a multi-horizon, transfer-qualified scheduler will beat tuned conventional tutors | E-LS-01–09 must establish it |

## Analysis and reporting requirements

- Randomize at the level where treatment is delivered and model learners,
  items, classrooms, teachers, and cohorts as separate sampling levels.
- Use intention-to-treat for assigned human conditions; report attrition,
  noncompliance, missing delayed tests, and every exclusion.
- Keep immediate, delayed, and transfer tests distinct; control family-wise
  error for preregistered primary contrasts.
- Pair computational methods on identical seeds, task streams, base models,
  evaluator access, and disturbances.
- Freeze item generation and transfer strata before confirmatory runs; inspect
  them for answer and representation leakage.
- Report raw score-unit contrasts and intervals. Standardized effects may be
  secondary, with the standardizer identified.
- Measure motivation through choice, persistence, and return separately from
  subjective ratings. Do not hide dropout behind survivor performance.
- Publish failed runs, unconsumed budgets, scheduler overhead, teacher time,
  inference latency, storage, data movement, and joules.
- Replicate a winning policy on a new learner population or model family and a
  new task family before changing any claim status.

## Promotion and retirement gates

Promote a scheduler-level residual only if it beats tuned conventional
retrieval, spacing, fading, knowledge-tracing, and curriculum baselines on a
delayed retention–transfer–cost frontier in at least two task families and a
held-out learner/model population. Its advantage must survive removal of extra
attempts, feedback, teacher attention, answer leakage, and easy-item selection.

Retire the residual if one fixed schedule matches it; current accuracy is as
good as the full learner state; benefits disappear on delayed or novel tests;
calibration improves by universal uncertainty; mastery gains are purchased
only by more time; social teaching loses to an artifact plus tests; or
scheduler measurement and compute cost consume the saved work.

## Audit-local bibliography

These records are local working provenance. They do not update the repository
bibliography or stable evidence ledger.

```bibtex
@article{RoedigerKarpicke2006TestEnhanced,
  author = {Roediger, Henry L. and Karpicke, Jeffrey D.},
  title = {Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention},
  year = {2006}, journal = {Psychological Science},
  doi = {10.1111/j.1467-9280.2006.01693.x}
}

@article{KarpickeRoediger2008Critical,
  author = {Karpicke, Jeffrey D. and Roediger, Henry L.},
  title = {The Critical Importance of Retrieval for Learning},
  year = {2008}, journal = {Science}, doi = {10.1126/science.1152408}
}

@article{Butler2010Transfer,
  author = {Butler, Andrew C.},
  title = {Repeated Testing Produces Superior Transfer of Learning Relative to Repeated Studying},
  year = {2010}, journal = {Journal of Experimental Psychology: Learning, Memory, and Cognition},
  doi = {10.1037/a0019902}
}

@article{ButlerEtAl2017Examples,
  author = {Butler, Andrew C. and Black-Maier, Allison C. and Raley, Nathan D. and Marsh, Elizabeth J.},
  title = {Retrieving and Applying Knowledge to Different Examples Promotes Transfer of Learning},
  year = {2017}, journal = {Journal of Experimental Psychology: Applied},
  doi = {10.1037/xap0000142}
}

@article{RawsonDunlosky2011Schedules,
  author = {Rawson, Katherine A. and Dunlosky, John},
  title = {Optimizing Schedules of Retrieval Practice for Durable and Efficient Learning: How Much Is Enough?},
  year = {2011}, journal = {Journal of Experimental Psychology: General},
  doi = {10.1037/a0023956}
}

@article{LeggettEtAl2019Classroom,
  author = {Leggett, Jessica M. I. and Burt, Jennifer S. and Hubble, Timothy C. T. and Nation, Kate},
  title = {Retrieval Practice Can Improve Classroom Review despite Low Practice Test Performance},
  year = {2019}, journal = {Applied Cognitive Psychology}, doi = {10.1002/acp.3517}
}

@article{CepedaEtAl2008Ridgeline,
  author = {Cepeda, Nicholas J. and Vul, Edward and Rohrer, Doug and Wixted, John T. and Pashler, Harold},
  title = {Spacing Effects in Learning: A Temporal Ridgeline of Optimal Retention},
  year = {2008}, journal = {Psychological Science},
  doi = {10.1111/j.1467-9280.2008.02209.x}
}

@article{LindseyEtAl2014Personalized,
  author = {Lindsey, Robert V. and Shroyer, Jeffery D. and Pashler, Harold and Mozer, Michael C.},
  title = {Improving Students' Long-Term Knowledge Retention Through Personalized Review},
  year = {2014}, journal = {Psychological Science},
  doi = {10.1177/0956797613504302}
}

@article{RohrerTaylor2007Shuffling,
  author = {Rohrer, Doug and Taylor, Kelli},
  title = {The Shuffling of Mathematics Problems Improves Learning},
  year = {2007}, journal = {Instructional Science},
  doi = {10.1007/s11251-007-9015-8}
}

@article{TaylorRohrer2010Interleaved,
  author = {Taylor, Kelli and Rohrer, Doug},
  title = {The Effects of Interleaved Practice},
  year = {2010}, journal = {Applied Cognitive Psychology}, doi = {10.1002/acp.1598}
}

@article{CarvalhoGoldstone2014Order,
  author = {Carvalho, Paulo F. and Goldstone, Robert L.},
  title = {Putting Category Learning in Order: Category Structure and Temporal Arrangement Affect the Benefit of Interleaved over Blocked Study},
  year = {2014}, journal = {Memory and Cognition},
  doi = {10.3758/s13421-013-0371-0}
}

@article{CarvalhoGoldstone2015Tasks,
  author = {Carvalho, Paulo F. and Goldstone, Robert L.},
  title = {Benefits of Interleaved and Blocked Study: Different Tasks Benefit from Different Schedules},
  year = {2015}, journal = {Psychonomic Bulletin and Review},
  doi = {10.3758/s13423-014-0676-4}
}

@article{PycRawson2009Effort,
  author = {Pyc, Mary A. and Rawson, Katherine A.},
  title = {Testing the Retrieval Effort Hypothesis: Does Greater Difficulty Correctly Recalling Information Lead to Higher Levels of Memory?},
  year = {2009}, journal = {Journal of Memory and Language},
  doi = {10.1016/j.jml.2009.01.004}
}

@article{PycRawson2011Cues,
  author = {Pyc, Mary A. and Rawson, Katherine A.},
  title = {Benefits of Accumulating versus Diminishing Cues in Recall},
  year = {2011}, journal = {Journal of Memory and Language},
  doi = {10.1016/j.jml.2011.01.006}
}

@article{TaylorEtAl2020SansForgetica,
  author = {Taylor, Alan and Sanson, Matthew and Burnell, Ryan and Wade, Kimberley A. and Garry, Mary},
  title = {Disfluent Difficulties Are Not Desirable Difficulties: The Lack of Effect of Sans Forgetica on Memory},
  year = {2020}, journal = {Memory}, doi = {10.1080/09658211.2020.1758726}
}

@article{WetzlerEtAl2021Font,
  author = {Wetzler, Emily and others},
  title = {Sans Forgetica Is Not the Font of Knowledge},
  year = {2021}, journal = {SAGE Open}, doi = {10.1177/21582440211056624}
}

@article{SwellerCooper1985Examples,
  author = {Sweller, John and Cooper, Graham A.},
  title = {The Use of Worked Examples as a Substitute for Problem Solving in Learning Algebra},
  year = {1985}, journal = {Cognition and Instruction},
  doi = {10.1207/s1532690xci0201_3}
}

@article{AtkinsonRenklMerrill2003Fading,
  author = {Atkinson, Robert K. and Renkl, Alexander and Merrill, Mary Margaret},
  title = {Transitioning from Studying Examples to Solving Problems: Effects of Self-Explanation Prompts and Fading Worked-Out Steps},
  year = {2003}, journal = {Journal of Educational Psychology},
  doi = {10.1037/0022-0663.95.4.774}
}

@article{RenklAtkinsonGrosse2004Fading,
  author = {Renkl, Alexander and Atkinson, Robert K. and Grosse, Cornelia S.},
  title = {How Fading Worked Solution Steps Works---A Cognitive Load Perspective},
  year = {2004}, journal = {Instructional Science},
  doi = {10.1023/B:TRUC.0000021815.74806.f6}
}

@article{Moreno2009Examples,
  author = {Moreno, Roxana},
  title = {Optimizing Worked-Example Instruction in Electrical Engineering: Fading and Feedback},
  year = {2009}, journal = {Journal of Engineering Education},
  doi = {10.1002/j.2168-9830.2009.tb01007.x}
}

@article{ChiEtAl1989SelfExplanation,
  author = {Chi, Michelene T. H. and Bassok, Miriam and Lewis, Matthew W. and Reimann, Peter and Glaser, Robert},
  title = {Self-Explanations: How Students Study and Use Examples in Learning to Solve Problems},
  year = {1989}, journal = {Cognitive Science},
  doi = {10.1207/s15516709cog1302_1}
}

@article{ChiEtAl1994Eliciting,
  author = {Chi, Michelene T. H. and de Leeuw, Nicholas and Chiu, Mei-Hung and LaVancher, Christian},
  title = {Eliciting Self-Explanations Improves Understanding},
  year = {1994}, journal = {Cognitive Science},
  doi = {10.1016/0364-0213(94)90016-7}
}

@article{NievelsteinEtAl2013Examples,
  author = {Nievelstein, Fleur and Van Gog, Tamara and Van Dijck, Gijs and Boshuizen, Henny P. A.},
  title = {The Worked Example and Expertise Reversal Effect in Less Structured Tasks: Learning to Reason about Legal Cases},
  year = {2013}, journal = {Contemporary Educational Psychology},
  doi = {10.1016/j.cedpsych.2012.12.004}
}

@article{EricssonEtAl1993Practice,
  author = {Ericsson, K. Anders and Krampe, Ralf T. and Tesch-Romer, Clemens},
  title = {The Role of Deliberate Practice in the Acquisition of Expert Performance},
  year = {1993}, journal = {Psychological Review},
  doi = {10.1037/0033-295X.100.3.363}
}

@article{MacnamaraMaitra2019Practice,
  author = {Macnamara, Brooke N. and Maitra, Megha},
  title = {The Role of Deliberate Practice in Expert Performance: Revisiting Ericsson, Krampe and Tesch-Romer (1993)},
  year = {2019}, journal = {Royal Society Open Science},
  doi = {10.1098/rsos.190327}
}

@article{ButlerEtAl2007Feedback,
  author = {Butler, Andrew C. and Karpicke, Jeffrey D. and Roediger, Henry L.},
  title = {The Effect of Type and Timing of Feedback on Learning from Multiple-Choice Tests},
  year = {2007}, journal = {Journal of Experimental Psychology: Applied},
  doi = {10.1037/1076-898X.13.4.273}
}

@article{Maier2021Feedback,
  author = {Maier, Uwe},
  title = {Self-Referenced versus Reward-Based Feedback Messages in Online Courses with Primary School Students},
  year = {2021}, journal = {Computers and Education},
  doi = {10.1016/j.compedu.2021.104306}
}

@article{FuchsEtAl1986Mastery,
  author = {Fuchs, Lynn S. and Fuchs, Douglas and Tindal, Gerald},
  title = {Effects of Mastery Learning Procedures on Student Achievement},
  year = {1986}, journal = {Journal of Educational Research},
  doi = {10.1080/00220671.1986.10885693}
}

@article{Wentling1973MasteryFeedback,
  author = {Wentling, Tim L.},
  title = {Mastery versus Nonmastery Instruction with Varying Test Item Feedback Treatments},
  year = {1973}, journal = {Journal of Educational Psychology},
  doi = {10.1037/h0034820}
}

@article{GladdingEtAl2015Mastery,
  author = {Gladding, Gary and Gutmann, Brian and Schroeder, Noah and Stelzer, Tim},
  title = {Clinical Study of Student Learning Using Mastery Style versus Immediate Feedback Online Activities},
  year = {2015}, journal = {Physical Review Special Topics--Physics Education Research},
  doi = {10.1103/PhysRevSTPER.11.010114}
}

@article{GickHolyoak1980Analogy,
  author = {Gick, Mary L. and Holyoak, Keith J.},
  title = {Analogical Problem Solving}, year = {1980},
  journal = {Cognitive Psychology}, doi = {10.1016/0010-0285(80)90013-4}
}

@article{GickHolyoak1983Schema,
  author = {Gick, Mary L. and Holyoak, Keith J.},
  title = {Schema Induction and Analogical Transfer}, year = {1983},
  journal = {Cognitive Psychology}, doi = {10.1016/0010-0285(83)90002-6}
}

@article{NovickHolyoak1991Mathematical,
  author = {Novick, Laura R. and Holyoak, Keith J.},
  title = {Mathematical Problem Solving by Analogy}, year = {1991},
  journal = {Journal of Experimental Psychology: Learning, Memory, and Cognition},
  doi = {10.1037/0278-7393.17.3.398}
}

@article{RawsonDunlosky2007SelfEvaluation,
  author = {Rawson, Katherine A. and Dunlosky, John},
  title = {Improving Students' Self-Evaluation of Learning for Key Concepts in Textbook Materials},
  year = {2007}, journal = {European Journal of Cognitive Psychology},
  doi = {10.1080/09541440701326022}
}

@article{DeslauriersEtAl2019Feeling,
  author = {Deslauriers, Louis and McCarty, Logan S. and Miller, Kelly and Callaghan, Kristina and Kestin, Greg},
  title = {Measuring Actual Learning versus Feeling of Learning in Response to Being Actively Engaged in the Classroom},
  year = {2019}, journal = {Proceedings of the National Academy of Sciences},
  doi = {10.1073/pnas.1821936116}
}

@article{CarpenterEtAl2019Metacognitive,
  author = {Carpenter, Jason and Sherman, Max and Kievit, Rogier and Seth, Anil K. and Lau, Hakwan and Fleming, Stephen M.},
  title = {Domain-General Enhancements of Metacognitive Ability through Adaptive Training},
  year = {2019}, journal = {Journal of Experimental Psychology: General},
  doi = {10.1037/xge0000505}
}

@article{RobertsEtAl2016WorkingMemory,
  author = {Roberts, Gehan and Quach, Jon and Spencer-Smith, Megan and Anderson, Peter J. and Gathercole, Susan and Gold, Lisa and Sia, Kah-Ling and Mensah, Fiona and Rickards, Field and Ainley, John and Wake, Melissa},
  title = {Academic Outcomes 2 Years after Working Memory Training for Children with Low Working Memory: A Randomized Clinical Trial},
  year = {2016}, journal = {JAMA Pediatrics},
  doi = {10.1001/jamapediatrics.2015.4568}
}

@article{GaisEtAl2006Sleep,
  author = {Gais, Steffen and Lucas, Birgit and Born, Jan},
  title = {Sleep after Learning Aids Memory Recall}, year = {2006},
  journal = {Learning and Memory}, doi = {10.1101/lm.132106}
}

@article{SchreinerRasch2015Cueing,
  author = {Schreiner, Thomas and Rasch, Bjorn},
  title = {Boosting Vocabulary Learning by Verbal Cueing during Sleep},
  year = {2015}, journal = {Cerebral Cortex}, doi = {10.1093/cercor/bhu139}
}

@article{CousinsEtAl2019Restriction,
  author = {Cousins, James N. and Wong, Kian F. and Chee, Michael W. L.},
  title = {Multi-Night Sleep Restriction Impairs Long-Term Retention of Factual Knowledge in Adolescents},
  year = {2019}, journal = {Journal of Adolescent Health},
  doi = {10.1016/j.jadohealth.2019.04.030}
}

@article{MonaghanEtAl2015SleepTransfer,
  author = {Monaghan, Padraic and Sio, Ut Na and Lau, Sze Wing and Woo, Ho Kei and Linkenauger, Sally A. and Ormerod, Thomas C.},
  title = {Sleep Promotes Analogical Transfer in Problem Solving}, year = {2015},
  journal = {Cognition}, doi = {10.1016/j.cognition.2015.06.005}
}

@article{BrodtEtAl2018SleepNull,
  author = {Schonauer, Monika and Brodt, Svenja and Pohlchen, Dorothee and Bressmer, Anja and Danek, Amory H. and Gais, Steffen},
  title = {Sleep Does Not Promote Solving Classical Insight Problems and Magic Tricks},
  year = {2018}, journal = {Frontiers in Human Neuroscience},
  doi = {10.3389/fnhum.2018.00072}
}

@article{BonawitzEtAl2011Pedagogy,
  author = {Bonawitz, Elizabeth and Shafto, Patrick and Gweon, Hyowon and Goodman, Noah D. and Spelke, Elizabeth and Schulz, Laura},
  title = {The Double-Edged Sword of Pedagogy: Instruction Limits Spontaneous Exploration and Discovery},
  year = {2011}, journal = {Cognition}, doi = {10.1016/j.cognition.2010.10.001}
}

@article{DeslauriersEtAl2011Physics,
  author = {Deslauriers, Louis and Schelew, Ellen and Wieman, Carl},
  title = {Improved Learning in a Large-Enrollment Physics Class},
  year = {2011}, journal = {Science}, doi = {10.1126/science.1201783}
}
```

## Verdict

This audit promotes no new principle and no new experiment candidate. It
rejects “difficulty,” “mastery,” “feedback,” “practice,” and “active learning”
as indivisible mechanisms. The narrow residual is a costed scheduler that
selects a skill-local event while explicitly targeting delayed retention and
novel transfer and preserving calibration, fluency, and motivation as separate
outcomes.

The exact repository action, after cross-audit review, is to refine Candidate
004's evaluator and support state and Candidate 019's teaching-channel and
turnover measurements. Candidate 010 receives only an exclusion clarification:
instructional feedback is not staged verification unless it adds conditional
evidence to a separate commitment gate. Anything broader should remain a null
until E-LS-01 through E-LS-10 survive equal-budget tests.

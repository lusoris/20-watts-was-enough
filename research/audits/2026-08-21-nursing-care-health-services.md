# Nursing, care science, and health-services continuity

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-21
- **Scope:** necessary work under finite staffing, care left undone, shift and setting transitions, informational/management/relational continuity, deterioration detection and escalation, patient and carer participation, and European health-data boundaries
- **Evidence rule:** clinical and health-services evidence remains population-, role-, intervention-, and setting-qualified; an association with mortality is not a staffing experiment, a bundle effect does not identify its active component, and a risk score is not a diagnosis or action mandate
- **Promotion state:** no new principle; one care-continuity falsification track for Candidate 011
- **Repository effect:** refine P-002, P-008, P-009, P-012, and P-013; route observation limits to Candidate 014, protocol transfer to Candidate 015, turnover to Candidate 019, and legitimate preference/refusal authority to Candidate 020

## Executive finding

Care science exposes a failure mode that throughput-oriented system descriptions
usually hide: necessary work can remain **undone** while every completed item
looks locally correct. The missing item may have a deadline, depend on knowledge
distributed across people and records, and become observable only after a later
transition or adverse outcome. More alerts, summaries, automation, or staff are
not interchangeable repairs.

The durable residue is a typed **continuity-and-unfinished-work contract**:

1. represent required work, owner, recipient, deadline, prerequisites, evidence
   of completion, and unresolved state explicitly;
2. separate informational continuity, management continuity, relational
   continuity, and actual service completion;
3. make a transfer bilateral: the sender exposes current state and uncertainty,
   while the receiver synthesizes, questions, accepts, or rejects responsibility;
4. qualify deterioration signals by observation support, missingness, population,
   response capacity, and escalation latency;
5. count the labor, interruption, documentation, communication, privacy,
   accessibility, and emotional burden used to produce continuity; and
6. preserve the person's or authorized representative's preferences, questions,
   restrictions, and refusal as governed inputs rather than optimization noise.

These requirements do not create a new architecture principle. Typed workflow,
event sourcing, acknowledgement protocols, queueing, scheduling, state
estimation, sequential detection, case management, and human-factors practice
are mature nulls. The research question is whether connecting those pieces to
the project's dual operational/learning loop predicts hidden unfinished work and
reduces consequential transition loss at equal total cost.

## Terms that must remain distinct

| Term | Operational meaning | Must not be inferred from |
| --- | --- | --- |
| required work | a versioned obligation with recipient, applicability, prerequisites, owner, deadline, and completion evidence | an item appearing in a generic checklist |
| completed work | required output was delivered and its declared acceptance condition was met | a task was opened, documented, or marked closed |
| care left undone | required activity not completed within the relevant shift or service window | every bad outcome; every unrecorded activity |
| workload | demand imposed on a worker or team over a declared interval, including complexity, interruptions, coordination, and documentation | patient count or queue length alone |
| capacity | feasible service under current skills, time, equipment, dependencies, and protected breaks | headcount or nominal model throughput |
| informational continuity | relevant state can be recovered across time and settings | the same person remains assigned |
| management continuity | actions form a coherent, timely plan across providers and settings | records are interoperable |
| relational continuity | an ongoing relationship permits cumulative person-specific knowledge and trust | a persistent identifier or memory store |
| handover | transfer of information and responsibility between actors | one-way summary generation |
| transition of care | movement across settings or responsibility boundaries, including clinical and non-clinical dependencies | a shift handover only |
| early-warning score | a scoped risk/trigger statistic computed from named observations | diagnosis, causal mechanism, or automatic authority |
| alarm | request for review or action under a protocol | confirmed deterioration or proof that response capacity exists |
| patient participation | an invited, accessible opportunity to question, correct, choose, restrict, or refuse | unpaid responsibility for detecting system errors |

## Audit-local propositions

The IDs below are local to this audit and are not central claim-ledger IDs.

| ID | Status | Scoped proposition | Boundary |
| --- | --- | --- | --- |
| `CARE-T01` | established descriptive result | Necessary nursing activities are reported as left undone under time pressure in several hospital surveys. | Self-report and cross-sectional association do not give a complete event count or causal effect of one staffing intervention. |
| `CARE-T02` | established association | In RN4CAST analyses, higher registered-nurse workload, reported missed care, and mortality covary across hospitals and countries. | The studies do not establish a universal nurse-to-patient ratio or transport an odds ratio to an AI scheduler. |
| `CARE-T03` | plausible mechanism | Unfinished necessary work can mediate part of a capacity–outcome relationship and is more actionable than completed-work throughput alone. | Mediation under observational measurement is not identification of every omitted activity or harm pathway. |
| `CARE-T04` | established scoped intervention | A standardized handoff bundle was associated with fewer medical errors in a multicentre prospective intervention. | The bundle, implementation campaign, population, and before/after design do not isolate a mnemonic, nursing handover, or universal format effect. |
| `CARE-T05` | established human-factors requirement | A handover can include receiver synthesis, questions, and read-back rather than one-way transmission. | Consensus guidance alone does not quantify effect size or prove benefit in every workload regime. |
| `CARE-T06` | established conceptual distinction | Informational, management, and relational continuity are different properties. | Access to records cannot establish relationship quality; retaining the same actor cannot guarantee correct information or timely action. |
| `CARE-T07` | plausible, observationally supported | Higher continuity is associated with better outcomes in several primary-care cohorts. | Heterogeneous observational measures leave selection, case mix, access, and mechanism unresolved. |
| `CARE-T08` | established scoped method | Early-warning systems turn intermittent measurements into risk-triggered escalation pathways. | Discrimination or agreement does not establish calibration, clinical benefit, causal diagnosis, or available response capacity. |
| `CARE-T09` | established measurement boundary | Missing, delayed, selectively recorded, or low-quality vital signs change the meaning of an early-warning result. | Automation cannot recover an unmeasured quantity without an observation model and uncertainty. |
| `CARE-T10` | plausible systems constraint | Alarm value depends jointly on detection performance and the queue, skill, latency, and authority of the response service. | A lower threshold or higher alert count is not automatically safer. |
| `CARE-T11` | established scoped intervention | Multicomponent transition programmes can reduce readmission in some trials. | A positive bundle does not identify one transferable mechanism; several later trials have mixed or null outcomes. |
| `CARE-T12` | established legal boundary | EU health-data rules distinguish access, control, interoperability, logging, primary use, and secondary use. | Technical interoperability does not authorize every access or make records complete; most EHDS duties apply in staged future dates. |
| `CARE-T13` | plausible transfer hypothesis | Explicit unfinished-work state plus bilateral acceptance should expose failures hidden by completion and throughput metrics. | This remains a project hypothesis until it beats ordinary typed workflow and scheduling baselines. |
| `CARE-T14` | speculative transfer hypothesis | Separating continuity dimensions may identify when persistent agents help beyond full versioned records and stable plans. | Human trust and embodied familiarity cannot be assumed to transfer to software agents. |

## Evidence synthesis

### Necessary work can disappear from throughput accounts

Ball et al. surveyed 2,917 registered nurses across 401 wards in 46 English NHS
hospitals. Eighty-six percent reported at least one activity left undone because
of insufficient time on the last shift; talking with or comforting patients,
educating patients, and updating care plans were among the most frequently
reported items. Higher patient counts per registered nurse were associated with
more reported omissions. This is evidence that completed-task counts omit a
decision-relevant backlog; it is not a complete observation of work or a causal
staffing experiment
([doi:10.1136/bmjqs-2012-001767](https://doi.org/10.1136/bmjqs-2012-001767)).

The nine-country RN4CAST analysis combined 422,730 surgical records from 300
hospitals with surveys from 26,516 nurses. Staffing, reported missed care, and
30-day inpatient mortality were associated, and the authors evaluated missed
care as a potential mediator. Staffing and missed-care measures were aggregated
from survey responses, the design was cross-sectional, and hospital/patient
adjustment cannot remove every confounder. The correct transfer is a measurement
and evaluation obligation, not a fixed ratio
([doi:10.1016/j.ijnurstu.2017.08.004](https://doi.org/10.1016/j.ijnurstu.2017.08.004)).

The earlier nine-country analysis found adjusted associations between average
patient-to-nurse workload, nurse education composition, and postoperative
mortality. Its reported odds ratios belong to those hospitals, discharge data,
models, and period. They must not become constants for an artificial task queue
([doi:10.1016/S0140-6736(13)62631-8](https://doi.org/10.1016/S0140-6736(13)62631-8)).

For a synthetic episode $e$, required item $j$, applicability indicator
$a_{ej}\in\{0,1\}$, completion indicator $c_{ej}\in\{0,1\}$, non-negative
severity weight $w_{ej}$, and deadline $d_{ej}$, report at least

$$
U_e=\sum_j a_{ej}(1-c_{ej})w_{ej}
$$

and harm-weighted tardiness

$$
L_e=\sum_j a_{ej}w_{ej}\max(0,t^{\mathrm{complete}}_{ej}-d_{ej}).
$$

$U_e$ and $L_e$ are experiment-defined score units unless $w_{ej}$ is tied to a
declared physical or economic consequence. They do not convert human suffering
to one scalar. Protected outcomes and item-level omissions remain visible.

### Handover is a state-and-responsibility transition

The I-PASS multicentre study reviewed 10,740 paediatric admissions across nine
hospitals before and after implementation of a bundle containing a standardized
handoff structure, communication training, observation, faculty development,
and a sustainability campaign. Medical-error rates decreased without a reported
increase in handoff duration. Because the intervention was a bundle and not a
randomized component trial, it establishes neither one active ingredient nor a
universal schema
([doi:10.1056/NEJMsa1405556](https://doi.org/10.1056/NEJMsa1405556)).

WHO handover guidance recommends standardization, adequate question time,
repeat-back/read-back, necessary-information selection, and patient/family
involvement while explicitly noting implementation barriers, added handover
time, and limited evidence for parts of the package
([Communication during patient handovers](https://www.who.int/teams/integrated-health-services/patient-safety/research/patient-safety-solutions)).

Represent a responsibility transfer as

$$
H=(s,v,o,r,d,q,a,\tau),
$$

where $s$ is the versioned state packet, $v$ its validity/support envelope, $o$
the current owner, $r$ the proposed receiver, $d$ the pending duties and
deadlines, $q$ unresolved questions, $a$ the receiver's acceptance state, and
$\tau$ the event-time interval. A stored summary with $a=\text{unknown}$ is not
an accepted transfer. Candidate 015 owns protocol repair and semantic migration;
Candidate 014 owns the observation/support packet; Candidate 011 owns operational
closure and later learning.

### Continuity is a vector, not persistence alone

Reviews distinguish informational continuity, coherent management across
episodes, and an ongoing therapeutic relationship. A 2020 primary-care review
found protective mortality associations in most included observational studies,
but measures, adjustment, populations, and proposed mechanisms varied and no
study directly identified the mechanism
([doi:10.3399/bjgp20X712289](https://doi.org/10.3399/bjgp20X712289)).

The care-transitions randomized trial assigned 750 community-dwelling adults
aged 65 or older to usual care or a programme combining a personal health
record, transition coaching, cross-setting support, and patient/caregiver
activation. It reported lower rehospitalization at selected follow-up points and
itemized programme costs. Eligibility, one integrated system, and a
multicomponent intervention limit transfer
([doi:10.1001/archinte.166.17.1822](https://doi.org/10.1001/archinte.166.17.1822)).

The system therefore reports the vector

$$
\mathbf C_e=(C^{\mathrm{info}}_e,C^{\mathrm{plan}}_e,
C^{\mathrm{relation}}_e,C^{\mathrm{service}}_e),
$$

with every component defined by an observable contract. A persistent model with
poor records may have relational persistence but low informational continuity;
a rotating pool with a complete event-sourced record may show the reverse.
Neither may receive credit for service that was never delivered.

### Detection has value only through a response path

Early-warning scores combine named observations into a trigger for increased
monitoring or review. They are useful comparators for staged escalation, but
their threshold semantics depend on population, measurement practice, missing
data, intended outcome, and response protocol. A systematic review describes
their common contribution to escalation language and their intermittent,
user-dependent limits
([doi:10.1016/j.ijnurstu.2017.09.003](https://doi.org/10.1016/j.ijnurstu.2017.09.003)).

A prospective Swiss pilot compared wearable/EHR-derived NEWS2 calculations
with conventional observations. Only 191 matched calculations were compared;
agreement was substantial ($\kappa=0.76$), but respiratory signal quality,
matching windows, and missing measurements sharply reduced usable observations.
The investigators kept the system outside clinical decisions and concluded that
the sensors and algorithms were not yet sufficient for that role. Agreement
with another measurement path is not outcome improvement
([doi:10.1186/s13690-024-01409-y](https://doi.org/10.1186/s13690-024-01409-y)).

For alarm class $k$ during interval $\Delta t$, report the complete latency

$$
T^{(k)}_{\mathrm{effective}}
=T_{\mathrm{observe}}+T_{\mathrm{score}}+T_{\mathrm{queue}}
+T_{\mathrm{ack}}+T_{\mathrm{act}}+T_{\mathrm{verify}},
$$

in seconds. Detection latency alone cannot receive credit. The experiment also
reports false alerts per service-hour, responder minutes per alert, missed-event
rate over true eligible events, action appropriateness, queue displacement, and
consequence before verified effect. If responders are saturated, an apparently
more sensitive detector can worsen the joint frontier.

### Participation is information and authority, not free monitoring

WHO's transitions monograph treats the patient, family, and carers as the
constant across setting changes and recommends accessible involvement,
medication reconciliation, timely information transfer, follow-up, and attention
to clinical, functional, housing, transport, and support conditions. It also
states that no single intervention consistently solves all contexts
([Transitions of care](https://www.who.int/docs/default-source/patient-safety/9789241511599-eng.pdf)).

For project tests, a person or authorized representative can therefore supply:

- a correction to state or history;
- a preference or goal;
- a restriction on access or reuse;
- a refusal or request for review;
- evidence about feasibility outside the formal system; and
- a report of an unresolved or adverse transition.

These are typed inputs with provenance and authority. They are not assumed
correct merely because they are first-person reports, and the system must not
shift detection, reconciliation, or safety labor onto the person without
consent, accessibility, support, and burden accounting. Candidate 020 owns
standing, refusal, remedy, and governance; Candidate 014 owns the observation
record; neither turns participation into an unpaid sensor.

### European legal and standards boundary

The project uses EU law as the normative baseline and German implementation
where applicable. The following are legal/standards constraints, not scientific
evidence that a mechanism improves outcomes:

1. [Directive 2011/24/EU](https://eur-lex.europa.eu/eli/dir/2011/24/2025-01-12/eng)
   requires, within its scope, access to safe and high-quality cross-border
   healthcare and a written or electronic treatment record supporting continuity.
   It explicitly excludes some long-term-care services from its scope.
2. [Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
   governs personal-data processing, including health data. Availability to a
   model or workflow is not authorization to process it for every purpose.
3. [Regulation (EU) 2025/327](https://eur-lex.europa.eu/eli/reg/2025/327/oj)
   establishes the European Health Data Space, including patient access/control,
   interoperable priority data categories, and logging. It applies from 26 March
   2027 with major duties phased later; the repository must not write future
   implementation milestones as current deployment facts.
4. [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
   and medical-device law may apply depending on intended purpose and system
   classification. A research fixture must not self-declare clinical conformity.
5. The [European Commission 2026 staffing report](https://health.ec.europa.eu/publications/staffing-levels-european-healthcare_en)
   is an EU health-system policy source. It does not create one universal safe
   staffing scalar or authorize replacing professional judgment with a model.

No real patient record is needed for the workstation tests below. Synthetic
episodes are the default. Any later study using personal health data requires a
separate lawful basis, purpose, minimization, access, retention, security,
rights, governance, ethics, and incident-response record.

## Proposed AI translation

### State record

Each required work item uses

$$
W_j=(\mathrm{id},v,\rho,x,o,r,p,d,s,e,u),
$$

where:

- $\mathrm{id}$ and $v$ identify the obligation and version;
- $\rho$ is the applicability rule;
- $x$ is the dependency set;
- $o$ and $r$ are current owner and intended recipient;
- $p$ is priority as a vector, not one hidden scalar;
- $d$ is the deadline in event time;
- $s$ is `pending`, `accepted`, `in-progress`, `blocked`, `completed`,
  `declined`, `expired`, or `unknown`;
- $e$ is completion or exception evidence; and
- $u$ is unresolved uncertainty and requested follow-up.

Closing an item requires a declared evidence predicate $A_j(e)=1$. A sender
cannot set `accepted` for the receiver, and a generated summary cannot set
`completed` for an external service. Dependency or protocol changes invalidate
affected items through Candidate 009.

### Capacity record

For actor $i$ and interval $t$, separate nominal availability from feasible
capacity:

$$
K_i(t)=f\!\left(h_i(t),\mathbf s_i(t),\mathbf q_i(t),
\mathbf z_i(t),\ell_i(t),\eta_i(t)\right),
$$

where $h_i$ is available seconds, $\mathbf s_i$ is the skill/authority vector,
$\mathbf q_i$ is current work, $\mathbf z_i$ represents tool and dependency
state, $\ell_i$ is interruption/coordination load, and $\eta_i$ is a declared
uncertainty record. $f$ is an experiment model with units and calibration, not a
biological truth. Human fatigue, stress, injury risk, and protected breaks remain
separate outcomes rather than fuel to be optimized away.

### Efficiency mechanism

The candidate efficiency hypothesis is conditional:

- typed pending work may prevent repeated rediscovery after transitions;
- receiver synthesis may catch omission or ambiguity before execution;
- continuity decomposition may route scarce persistent attention only where it
  adds information beyond the record;
- queue-aware escalation may reduce alarm work without delaying consequential
  events; and
- explicit exceptions may focus the longitudinal learning loop on recurrent
  transition failures.

Every item also adds recording, communication, checking, storage, and governance
cost. If a fixed typed workflow plus ordinary scheduling achieves the same
frontier, this field contributes validation cases, not a distinct mechanism.

## Workstation falsification package

### Common generator and freeze contract

Generate synthetic longitudinal service episodes with known latent task state,
required items, deadlines, observation support, worker/agent skills, handover
times, preferences, access restrictions, adverse-event functions, and response
capacity. Freeze before confirmation:

- generator and causal graph;
- event, task, and transition families;
- observation and missingness operators;
- priority/severity labels and protected strata;
- agent/model versions and context limits;
- workload, interruption, response, and energy schedules;
- comparator tuning budget; and
- multiplicity, abstention, and kill rules.

Hold out complete episode families, organizations, transition graphs, role mixes,
missingness regimes, workload shocks, and preference conflicts. Random turns or
items from one episode cannot cross splits.

### WS-CARE-01 — bilateral handover under constrained bandwidth

**Plant:** omissions, stale state, contradictory observations, ambiguous owner,
unknown deadline, inaccessible wording, receiver overload, and version mismatch.

**Arms:** free text; fixed checklist; typed state packet; typed packet plus
acknowledgement; typed packet plus receiver synthesis/read-back; Candidate 015;
Candidate 011 care-continuity track; and an oracle packet ceiling ineligible to
win.

**Equalize:** source observations, packet bytes, sender/receiver model calls,
question count, elapsed time, human-review minutes, and joules.

**Primary outcomes:** required-item omission, erroneous inclusion, responsibility
without acceptance, deadline miss, downstream unsafe action, repair latency,
false clarification, bytes, seconds, and joules. Report errors by item class and
support, not only one packet score.

**Falsifier:** if acknowledgement/read-back adds traffic without reducing
consequential transfer error, remove it from that regime. If an ordinary typed
packet matches the candidate, reject architectural distinctiveness.

### WS-CARE-02 — unfinished necessary work under overload

**Plant:** heterogeneous tasks, skill requirements, deadlines, preemption,
interruptions, dependency failure, shift boundaries, and rare high-severity
events. Include an all-feasible control and overload levels that make some work
mathematically impossible.

**Arms:** first-come-first-served; static priority; earliest deadline first;
weighted shortest processing time; queueing/scheduling optimizer; receding-
horizon controller; ordinary workflow with explicit pending state; and the
candidate composition.

**Primary outcomes:** $U_e$, $L_e$, completed service, protected-item misses,
queue age, preemption/rework, handoff count, worker/agent utilization, reserve,
communication, human time, and energy. In infeasible episodes, score honest
decline/escalation and severity-aware damage, not impossible completion.

**Falsifier:** reject if gains come from hidden extra capacity, future labels,
greater interruption, unpaid human work, weaker protected outcomes, or a
different deadline definition.

### WS-CARE-03 — continuity decomposition

Use paired partially observed longitudinal tasks with recurring entities and
state changes.

**Arms:** same agent/no durable record; rotating agents/full event-sourced record;
rotating agents/generated summary; same agent/full record; stable plan owner with
rotating executors; ordinary case management; and the candidate.

**Outcomes:** state reconstruction error, plan contradiction, calibration,
unnecessary repeated query, pending-item recall, task outcome, preference
violation, transfer to new entities, compute, retained bytes, and deletion/
correction latency.

**Decision:** credit relational persistence only for performance not explained
by informational and plan continuity at equal access and cost. If gains vanish
when the record is complete, route the result to P-012/P-013 rather than claiming
a persistent-agent mechanism.

### WS-CARE-04 — queue-aware deterioration escalation

Generate rare state deteriorations with known onset, noisy intermittent sensors,
informative missingness, benign anomalies, drift, correlated alarms, limited
responders, and action-dependent observations.

**Arms:** fixed threshold; calibrated risk threshold; CUSUM/sequential likelihood;
capacity-blind learned score; queue-aware threshold policy; POMDP/MPC controller;
Candidate 007 surveillance; Candidate 012 authority envelope; and Candidate 011.

**Outcomes:** event-level sensitivity and specificity, calibration, time to
verified effect, consequence before action, alarms/service-hour, responder
minutes, queue displacement, false-stop harm, unsupported actions, abstention,
compute, and joules.

**Falsifier:** detector discrimination cannot win if queue delay or false-alarm
work worsens protected consequence. A response policy must not suppress an alarm
merely to improve dashboard burden.

### WS-CARE-05 — preference, access, and refusal through transitions

Plant changing preferences, accessible-communication needs, conflicting proxy
instructions, access restrictions, urgent exceptions, mistaken records, and
appeal/remedy requests.

Compare optimization-only, static policy, typed consent/access, Candidate 020,
and Candidate 020 plus the continuity contract. Score correct authority,
preference violations, inaccessible requests, correction propagation, emergency
override use, review/remedy latency, retained sensitive bytes, human burden, and
task outcome. Do not assign a scalar reward to a right and then call its tradeoff
optimized.

## Mandatory comparator stack

1. event-sourced typed workflow with owner, deadline, acknowledgement, and
   completion evidence;
2. ordinary queueing, scheduling, and receding-horizon resource allocation;
3. fixed checklists and schema-validated handover packets;
4. read-back/closed-loop communication;
5. case management and stable-plan ownership;
6. calibrated risk scoring and sequential detection;
7. POMDP or dual-control response under partial observation;
8. conventional incident, corrective-action, and quality-improvement workflow;
9. Candidate 014 observation support and Candidate 009 dependency invalidation;
10. Candidate 011 without the care-continuity refinement; and
11. topology simplification that removes an avoidable transition, reported as an
    ineligible ceiling rather than hidden loss of service.

## Confirmatory analysis

The confirmatory unit is a complete episode from first observation through all
transitions, required work, verified service, follow-up window, and any later
recurrence. Pair arms on the same latent episode, observation/missingness stream,
workload, interruption, capacity, preferences, and energy schedule. Cluster
intervals by generator family, service organization, role mix, and model/operator
lineage.

Preregister a gatekeeping order:

1. no excess protected-outcome or authority violation;
2. noninferior verified service completion and consequential-event outcome;
3. lower harm-weighted unfinished work or transition loss;
4. no worse tail latency, false escalation, or burden concentration; then
5. lower communication, human time, storage, compute, or energy.

Report paired effects and simultaneous intervals for the primary vector. Use
survival/restricted-mean analysis for deadline outcomes with censoring stated.
Missing follow-up is not successful continuity, and absence of an adverse event
without exposure is not prevention. Control multiplicity across the five tracks,
primary comparators, outcomes, strata, and adaptive searches.

## Full cost boundary

For every arm report:

- inference/training compute and wall energy;
- bytes read, moved, summarized, retained, corrected, and deleted;
- sender, receiver, reviewer, responder, and governance person-minutes;
- interruptions, context switches, rework, and training time;
- alert and clarification burden by actor and protected stratum;
- instrumentation, interoperability, security, accessibility, and maintenance;
- reserve capacity and opportunity cost;
- privacy/security incidents and remedy effort; and
- embodied or infrastructure cost when a hardware arm is compared.

Efficiency excludes any arm that improves model joules by moving work to people,
caregivers, another service, or an unmetered external tool.

## Candidate and principle routing

| Residue | Existing owner | Exact disposition |
| --- | --- | --- |
| local recognition and escalation | [P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation) | qualify by receiver capacity, acknowledgement, and verified effect |
| role/setting boundaries | [P-008](../principle-registry.md#p-008--compartmentalized-interaction) | transition interface, not evidence that silos are beneficial |
| continuous necessary service and learning | [P-009](../principle-registry.md#p-009--maintenance-plane) | unfinished work and follow-up are maintenance state |
| longitudinal record and relationship | [P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime) | separate durable record from persistent actor |
| shared care plan and event record | [P-013](../principle-registry.md#p-013--externalized-shared-state) | typed state needs owner, version, access, and acceptance |
| live response plus recurrent learning | [Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md) | add care-continuity track; primary experimental owner |
| measurement/support/missingness | [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md) | early-warning and handover evidence owner |
| changing protocol semantics | [Candidate 015](../../experiments/candidates/015-versioned-repairable-conventions.md) | schema, repair, synthesis, and migration owner |
| workforce/model turnover | [Candidate 019](../../experiments/candidates/019-audited-cumulative-inheritance.md) | continuity across real turnover, not one-session memory |
| person/community standing and refusal | [Candidate 020](../../experiments/candidates/020-constitutional-control-plane.md) | authority, access, appeal, remedy, and protected interests |

## Kill conditions

Reject the care-derived systems residue as distinct if any of the following
holds:

1. an ordinary typed workflow plus scheduling exposes the same unfinished work
   and matches outcome, burden, and cost;
2. a fixed handover schema plus acknowledgement matches all transfer outcomes;
3. continuity gains disappear with a complete versioned record and stable plan;
4. improved alert discrimination does not improve time to verified effect or
   protected consequence under finite response capacity;
5. performance depends on future information, privileged severity labels, or an
   observation path unavailable at decision time;
6. the candidate counts documentation, acknowledgement, ticket closure, or
   response dispatch as completed service;
7. average performance improves by concentrating unfinished work, false alarms,
   privacy loss, or human burden on one actor or stratum;
8. patient or representative participation is treated as free error detection or
   coerced agreement;
9. gains come from uncharged staffing, reserve, records, intervention authority,
   hardware, human review, or external services; or
10. the result fails across a second materially different transition topology.

## Audit decision

1. **Add no new principle.** The field sharpens state, transfer, workload, and
   evaluation contracts already owned by P-002/P-008/P-009/P-012/P-013.
2. **Add unfinished necessary work to the evaluation state.** Throughput and
   completed-task accuracy cannot substitute for item-level obligations and
   deadlines.
3. **Keep continuity multidimensional.** Persistent actor, durable record,
   coherent plan, and delivered service are separate experimental arms.
4. **Make handover bilateral.** Receiver synthesis and acceptance are testable
   mechanisms, not decorative communication advice.
5. **Join signal quality to response capacity.** Score, alarm, action, and
   verified effect remain distinct stages.
6. **Use synthetic fixtures first.** No patient record or clinical deployment is
   required to falsify the proposed systems mechanism.
7. **Keep EU legal status explicit.** EHDS future application dates, GDPR purpose
   limits, and intended-purpose classification must not be collapsed into a
   generic `compliant` flag.
8. **Promote only after ordinary workflow wins are excluded.** Care science is a
   demanding source of counterexamples even if no distinct architecture survives.

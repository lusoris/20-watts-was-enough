# Candidate 012: latency-qualified authority envelopes

**Stage:** 1 — hybrid-control and fault-injection falsification

**Status:** held systems composition; not an accepted project claim

**Primary question:** does continuously restricting a controller's action set
from observation age, integrity, mode, physical headroom, and coordination
state improve the service–risk frontier beyond static protection hierarchies,
supervisory control, constrained control, barrier functions, and runtime
assurance at equal sensing, reserve, authority, and lifecycle cost?

## Candidate statement

Controller $i$ receives a time-varying admissible action set

$$
\mathcal U_i(t)=\mathcal E_i\!\left(
\tau_i(t),q_i(t),m_i(t),b_i(t),c_i(t)
\right),
\qquad u_i(t)\in\mathcal U_i(t).
$$

Here:

- $\tau_i$ is observation age in seconds;
- $q_i$ is a declared integrity or trust state with component-specific units;
- $m_i$ is a discrete or probabilistic mode estimate;
- $b_i$ is a vector of physical or computational headroom with declared units;
- $c_i$ is communication and coordination availability;
- $\mathcal E_i$ is a certified set-valued map; and
- $u_i$ is the selected physical or logical action.

No scalarization is implied. Every component retains its unit, range,
timestamp, provenance, and uncertainty. Stale evidence, lost integrity,
reduced headroom, or lost coordination should shrink authority to a local safe
fallback. Wider actions require a validated handoff and checked postcondition.

## Candidate loop

```mermaid
flowchart TD
    S["Sensors · clocks · links · device limits"] --> C["Independent trust + headroom certificate"]
    C --> E["Admissible action envelope"]
    E --> A{"Act locally?"}
    A -->|"inside envelope"| U["Bounded local action"]
    A -->|"outside or stale"| X["Abstain · fallback · escalate"]
    X --> H["Validated authority handoff"]
    H --> U
    U --> P["Postcondition + outcome record"]
    P --> C
```

Editable source:
[latency-qualified-authority.mmd](../../assets/diagrams/latency-qualified-authority.mmd).

The certificate cannot be self-asserted solely by the learned policy seeking
wider authority. Simple independent limits, trip paths, and fallbacks remain
enforced.

## Compromise-bounded authority profile

Physical or logical headroom is not a security claim. Every authority decision
therefore also carries

$$
S_i(t)=
(p_i,w_i,a_i,e_i,f_i,d_i,\mathcal A_i,h_i,r_i),
$$

where $p_i$ and $w_i$ identify the principal and workload; $a_i$ is the scoped
capability; $e_i$ is the credential, key, and attestation epoch; $f_i$ is
revocation freshness in seconds; $d_i$ records independent approval domains;
$\mathcal A_i$ names the adversary model; $h_i$ is the assumed compromise
horizon in seconds; and $r_i$ identifies the clean recovery root and its
evidence. These are typed fields rather than inputs to an unexplained trust
score.

An accepted action must satisfy both the physical/computational envelope
$\mathcal U_i(t)$ and the security profile $S_i(t)$. Authentication does not
establish authorization or safe effect ([C-250](../../research/claims.md#c-250));
an alert does not contain an actor ([C-262](../../research/claims.md#c-262)); and
availability restoration does not establish compromise recovery
([C-265](../../research/claims.md#c-265)).

```mermaid
flowchart LR
    I["Principal + workload identity"] --> E["Epoch-bound scoped capability"]
    R["Named trust + clean recovery roots"] --> E
    E --> T["Independent threshold / policy decision"]
    O["Fresh observation + revocation state"] --> T
    T --> A["Bounded action envelope"]
    A --> Y["Outcome + security telemetry"]
    Y --> D{"Compromise or stale authority?"}
    D -->|"no"| O
    D -->|"yes"| C["Contain + revoke covered authority"]
    C --> B["Reimage · rotate · validate from clean root"]
    B --> N["New epoch + recurrence gate"]
    N --> I
```

Editable source:
[compromise-bounded-authority.mmd](../../assets/diagrams/compromise-bounded-authority.mmd).

## Strongest nulls

- coordinated primary and backup protection;
- static and adaptive setting groups;
- wide-area remedial-action schemes;
- gain-scheduled and hybrid supervisory control;
- constrained and robust model-predictive control;
- control-barrier-function safety filters;
- runtime-assurance architectures;
- event-triggered distributed control; and
- named restoration runbooks with prerequisites and authority transfer.
- mature IAM with short-lived workload credentials, capability confinement,
  PKI/HSM or KMS, session revocation, monitoring, and tested reimage/rotation.

## Common accounting vector

Every arm reports

$$
\mathbf J=(J_{\mathrm{service}},J_{\mathrm{damage}},J_{\mathrm{false}},
J_{\mathrm{latency}},J_{\mathrm{energy}},J_{\mathrm{communication}},
J_{\mathrm{reserve}},J_{\mathrm{human}},J_{\mathrm{recovery}}).
$$

The components use declared task units: service delivered or shed, damage
proxy, unnecessary actions, seconds, joules, bytes, held capacity and duration,
operator or expert minutes, and time to a declared recovered state. Publish a
Pareto frontier. Any scalar weights are fixed before evaluation.

## Task family

Begin with power-grid simulation because it exposes hard physical constraints,
then require transfer to a modular compute or robotic-control system. Inject:

- local faults requiring selective fast action;
- stale, missing, delayed, or spoofed telemetry;
- clock and communication degradation;
- topology and mode-estimation errors;
- actuator saturation and limited energy duration;
- correlated hidden protection failures;
- islanding or partition with later reconnection;
- second events during incomplete replenishment; and
- restoration sequences with changing authority.

## Arms

1. fixed local authority with static fallback;
2. monolithic global controller;
3. coordinated static hierarchy;
4. adaptive settings or gain scheduling;
5. constrained/robust MPC or equivalent task-domain controller;
6. barrier-function or runtime-assurance safety filter;
7. proposed latency-qualified envelope; and
8. oracle-state ceiling, reported but ineligible to win.

## Equalization

All arms receive identical:

- sensors, clocks, sample streams, and missing-data process;
- communication topology, bandwidth, jitter, loss, and security;
- maximum actuator set and physical authority;
- reserve, headroom, current or thermal limit, response energy, and duration;
- online compute, memory, deadline, and device power;
- topology and contingency knowledge available at decision time;
- training events and simulator access; and
- post-event labels and offline tuning.

## Experimental tracks

1. local fault clearing and selectivity;
2. adaptive authority under observability loss;
3. fast response under saturation and finite energy;
4. state estimation under model-consistent false data;
5. flexible demand and reserve with rebound and a second event;
6. controlled partition and constrained reconnection;
7. staged restoration with named prerequisites; and
8. an end-to-end cascade combining hidden failures, communication loss,
   limited reserve, operator delay, and recovery.
9. a compromise track with stolen active sessions, workload compromise,
   key/clock rollback, stale cache or delegation, correlated approval domains,
   compromised telemetry, dirty restore, and attacker recurrence.

## Measurements

- task service retained and correctly shed or refused;
- damage or constraint-violation exposure;
- false and missed actions;
- p50/p95/p99 detection, authorization, action, and recovery latency;
- envelope shrink/expand transition errors;
- unsafe action under stale or corrupted evidence;
- energy, communication, reserve, and human cost;
- headroom and replenishment at the second event;
- inconsistent concurrent authority; and
- recovery quality after restoration or reconnection.
- weighted capability-seconds, revocation exposure in seconds, secure recovery
  time, credential-rotation completeness, and recurrence after the declared
  clean state.

## Required ablations

- remove observation age;
- remove integrity state;
- remove physical headroom and duration;
- remove coordination state;
- let the policy self-certify;
- keep authority fixed after communication loss;
- remove postcondition checks;
- remove envelope rollback and provenance; and
- replace the learned policy with the same envelope around a conventional
  controller.
- remove identity/key/attestation epochs while retaining ordinary short-lived
  credentials; and
- collapse identity, approval, telemetry, and recovery roots into one failure
  domain while leaving their logical labels unchanged.

## Kill criteria

Reject the candidate if:

- a static hierarchy, constrained controller, barrier function, or runtime
  assurance matches the frontier;
- envelope transitions create more unsafe transients or inconsistent action;
- degraded modes ever broaden authority without an independently verified
  reason;
- certificate and controller share an unmodeled common failure;
- benefit disappears under topology error, saturation, common-mode failure,
  or communication loss;
- update, validation, reserve, communication, and recovery costs erase gains;
  or
- gains require privileged labels, wider actuators, extra sensors, or oracle
  state.
- mature IAM plus conventional rebuild/rotate/validate matches compromise
  impact and secure recovery at lower lifecycle cost.

## Promotion rule

Passing the grid simulator does not establish transfer. The candidate must
predict useful authority changes from measured latency, integrity, headroom,
and coordination, beat the strongest applicable controller in two distinct
domains, and preserve simple independent safety limits.

## Evidence links

- [Power-grid audit](../../research/audits/2026-08-05-power-grids-protection-and-recovery.md)
- [C-186](../../research/claims.md#c-186)–[C-203](../../research/claims.md#c-203)
- [C-250](../../research/claims.md#c-250)–[C-267](../../research/claims.md#c-267)
- [Security and cryptography audit](../../research/audits/2026-08-05-security-cryptography.md)
- [P-002](../../research/principle-registry.md#p-002--local-autonomy-with-exception-escalation)
- [P-006](../../research/principle-registry.md#p-006--homeostatic-negative-feedback)
- [P-008](../../research/principle-registry.md#p-008--compartmentalized-interaction)
- [P-009](../../research/principle-registry.md#p-009--maintenance-plane)

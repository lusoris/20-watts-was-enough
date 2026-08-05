# Security and cryptography: adversary-boundary audit

<!-- markdownlint-disable MD013 -->

**Date:** 2026-08-05

**Scope:** authentication, zero trust, least privilege, capability systems,
threshold and secret sharing, Byzantine and adversarial protocols, key
rotation, revocation, intrusion detection, moving-target defence,
information-flow control, and recovery after compromise

**Purpose:** state what each security mechanism actually guarantees, expose its
adversary and trusted base, identify its measurable cost and compromise window,
and prevent security terminology from being relabelled as a novel AI principle.
The audit explicitly deduplicates against the existing programming-languages,
fault-tolerance, staged-verification, graded-assurance, high-reliability, and
authority-envelope work.

## Executive finding

Security adds a necessary **adversary model** to the project, but it does not
currently add a new architectural principle.

- Authentication, authorization, information-flow control, detection,
  containment, and recovery are different claims. A valid credential does not
  prove safe intent; an authorization decision does not prove a safe outcome;
  an alert does not revoke authority; and a restored service is not necessarily
  clean.
- Cryptographic guarantees are conditional theorems. They depend on a named
  adversary, primitive assumptions, protocol transcript, randomness, key
  custody, time/epoch semantics, implementation, and trusted endpoints.
- Least privilege and capabilities reduce available authority. Zero trust
  repeatedly evaluates resource access. Neither prevents an authorized but
  harmful action or repairs a compromised policy engine.
- Threshold cryptography and Byzantine replication distribute decisions and
  secrets. They help only when administrative, software, credential, identity,
  and recovery failures are sufficiently independent. A Sybil adversary or a
  shared compromised control plane destroys the apparent multiplicity.
- Rotation, revocation, and proactive refresh bound some future or past effects
  of compromise. They do not retract already accepted actions, disclosed
  plaintext, copied secrets, or signatures legitimately produced during the
  compromise interval.
- Intrusion detection converts partial telemetry into decisions under severe
  base-rate, evasion, and distribution-shift constraints. Moving-target defence
  changes an attacker's work factor; it does not remove the vulnerable
  semantics.
- Information-flow control can prove a specified noninterference or lattice-flow
  property for a model. It does not automatically cover declassification,
  timing, resource, physical, or uninstrumented channels.
- Recovery after compromise requires a clean root, a trustworthy state horizon,
  and a means to invalidate adversary persistence. Ordinary availability
  recovery can faithfully restore the compromise.

The only residual integration hypothesis worth retaining provisionally is a
**compromise-bounded epochal authority profile**: the existing assurance and
authority envelopes should explicitly bind principal and workload identity,
capability scope, key/attestation epoch, revocation freshness, independent
approval threshold, observation age, compromise assumptions, and clean-recovery
root. This is not a new principle. It is a security-specific refinement of
[P-002](../principle-registry.md#p-002--local-autonomy-with-exception-escalation),
[P-003](../principle-registry.md#p-003--temporary-trace-before-commitment),
[P-008](../principle-registry.md#p-008--compartmentalized-interaction),
[P-009](../principle-registry.md#p-009--maintenance-plane),
[P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime),
[graded assurance](../../experiments/candidates/009-graded-assurance-envelopes.md),
and
[latency-qualified authority](../../experiments/candidates/012-latency-qualified-authority.md).
It survives only if it reduces compromise impact or recovery time at equal
budget versus mature IAM, PKI, HSM/KMS, sandboxing, service-mesh policy,
short-lived credentials, conventional monitoring, and tested restore/reimage
procedures.

## Evidence and novelty policy

The audit uses foundational peer-reviewed papers, primary system papers, and
authoritative standards. A formal paper establishes a theorem only under its
model. A system paper establishes measured behaviour only for its implementation
and workload. A standard specifies interoperable behaviour or architecture; it
is not by itself evidence of operational efficacy.

All project conclusions below are temporary audit claims, not entries in the
shared evidence ledger. The local IDs `SEC-TC-*` exist so later work can cite,
challenge, split, or retire them without silently rewriting the conclusion.

## Assurance layers that must remain separate

| Layer | Question answered | Typical evidence | What it does not answer |
| --- | --- | --- | --- |
| Identity proofing | Which real or organizational entity was enrolled? | Registration record, issuer attestation | Whether the current actor controls the authenticator or is benign |
| Authentication | Did this session demonstrate possession/control of accepted credentials under the protocol? | Protocol transcript, signature/MAC, freshness evidence | What the principal may do; endpoint integrity; intent |
| Authorization | Is this subject permitted this action on this object in this context? | Policy decision and enforcement record | Whether the policy is correct or the action's result is safe |
| Information-flow control | Is a declared transfer permitted, or are low observations independent of high inputs under a model? | Label/type/proof or reference-monitor decision | Truth, purpose, covert channels, declassification correctness |
| Detection | Did telemetry cross a signature, rule, or anomaly threshold? | Alert with sensor provenance and score | Whether compromise occurred; whether it was contained |
| Containment/revocation | Is further use of an authority blocked at covered enforcement points? | Policy/key/status update and acknowledgements | Retraction of prior effects; coverage of offline or bypassed points |
| Recovery | Can service and security invariants be re-established from a trusted horizon? | Clean image, validated backup, new keys, invariant tests | That the recovery root or historical data was never compromised |
| Attribution/accountability | Can an action be linked to a cryptographic or administrative identity? | Signed/logged event chain | Human authorship, non-coercion, or semantic responsibility |

## Adversary and trust-boundary register

| Adversary/fault | Capabilities assumed | Mechanisms that address part of it | Boundary where the claim stops |
| --- | --- | --- | --- |
| Passive observer | Reads covered communications or storage | Encryption, traffic protection | Metadata, endpoints, keys, access patterns and later disclosure may remain |
| Active network adversary | Intercepts, reorders, replays, delays, injects, and composes messages | Authenticated protocols under Dolev--Yao or computational models | Endpoint compromise, implementation flaws, traffic analysis, denial of service |
| Credential thief/phisher | Acquires or relays one or more authenticators | Phishing-resistant authenticators, channel binding, short lifetimes, step-up checks | Compromised endpoint/session, recovery flow, social engineering of approvers |
| Malicious authorized principal | Uses legitimately granted authority adversarially | Least privilege, separation of duty, audit, IFC | Harm within granted scope; colluding approvers; incorrect policy |
| Compromised endpoint/workload | Controls process memory and actions after compromise | Compartmentalization, capabilities, attestation, refresh, reimage | Secrets/plaintext already exposed; compromised attestation or base image |
| Mobile adversary | Compromises different nodes over time | Proactive sharing/recovery with secure erasure per epoch | Threshold reached within one epoch; refresh channel or recovery root compromise |
| Byzantine replica | Behaves arbitrarily and equivocates | Authenticated BFT under replica and timing bounds | More than (f) faults, common-mode bugs/keys, Sybils, privacy, bad client command |
| Sybil adversary | Presents many logical identities for one controlling entity | Certified identities, scarce-resource assumptions | Corrupt/central issuer, identity resale, resource concentration |
| Privileged insider/operator | Changes policy, keys, logs, images, or recovery state | Threshold approval, tamper evidence, separate administration, audit | Collusion threshold, shared console/IdP, coerced or compromised recovery root |
| Supply-chain/common-mode attacker | Compromises shared source, build, dependency, firmware, or operator path | Diversity, reproducible/attested builds, independent implementation | Correlated provenance, shared compiler/hardware/root of trust |
| Telemetry-aware adaptive attacker | Evades, poisons, blinds, or overloads sensors | Sensor diversity, integrity, deception, rate controls | Unknown coverage, semantic gap, adaptive probes, analyst overload |

Trusted roots must therefore be named per experiment: identity issuer and
recovery process; authenticator and random-number generation; clocks and epoch
agreement; policy engine and enforcement point; cryptographic implementation;
CA, HSM/KMS, status service, or threshold participants; telemetry capture and
time ordering; attestation verifier; clean image and backup; and the humans who
can override them. Calling a component “zero trust” does not remove these roots.

## Mechanism and deduplication map

| Mechanism | Exact contribution | Strongest conventional null | Existing project destination | Novel residual |
| --- | --- | --- | --- | --- |
| Authentication protocol | Binds a protocol peer/session to a credential claim under freshness and adversary assumptions | Mature mutual TLS/WebAuthn/OIDC-style authentication with protocol verification | Graded assurance identity evidence; staged verification only when evidence is conditionally independent | None |
| Zero trust | Removes location-based implicit trust and makes access resource/session/context specific | NIST-style IAM, device posture, policy engine/administrator/enforcement point | Latency-qualified authority and P-002/P-008 | Freshness fields, not a new principle |
| Least privilege/capabilities | Reduces and mediates authority available to a component | OS sandbox, object capabilities, scoped service account/IAM | PL capability layer; P-002/P-008 | None |
| Threshold/secret sharing | Prevents fewer than (k) shares from reconstructing/using a secret under the scheme; distributes approval | HSM-backed dual control or mature threshold scheme | Separation of privilege inside the authority/assurance envelope | Epoch and independence metadata only |
| Byzantine protocol | Maintains specified safety under bounded arbitrary replica faults; liveness has extra timing assumptions | PBFT-family or equivalent authenticated BFT | Fault-tolerance audit; P-004/P-013 | Security identity/key boundary, not a new repair family |
| Key rotation/forward security | Limits which epochs a disclosed key can forge/decrypt under erasure and scheme assumptions | KMS/HSM cryptoperiods and key-evolving/ephemeral protocols | P-012 lifetime matching; P-009 maintenance | Explicit compromise window |
| Revocation | Stops future acceptance after fresh status reaches all covered enforcement points | CRL/OCSP, short-lived credentials, policy/token invalidation | Candidate 012 observation age and authority degradation | None |
| Intrusion detection | Classifies observed traces and raises evidence-bearing alerts | EDR/NDR/SIEM with rules, signatures, anomaly models and response playbooks | P-006 sensing; P-009 maintenance; HRO operations | No new assurance plane |
| Moving-target defence | Adds uncertainty or invalidates exploit assumptions through diversity/reconfiguration | ASLR, diversified builds, address/credential rotation | P-004 diversity and P-009 maintenance | None without adaptive equal-budget advantage |
| Information-flow control | Restricts labelled flows or proves a noninterference property under a semantics | MAC, taint/IFC types, language/OS reference monitors | PL proof/effect/authority layers; P-008 | None |
| Recovery after compromise | Re-establishes service and security invariants from a clean root while replacing compromised authority | Reimage/redeploy, restore, rotate, validate, monitor | Fault-tolerance recovery + HRO incident learning + P-009 | Clean-root and trustworthy-horizon fields |

## Explicit cross-audit deduplication

### Programming languages and verification

The
[programming-languages audit](2026-08-05-programming-languages-verification.md)
already separates effects, capabilities, proofs, monitoring, provenance, and
recovery. This audit does not create another assurance envelope. It adds the
principal/workload identity, credential and attestation epoch, adversary model,
revocation freshness, and recovery-root fields that a security deployment needs.
An effect description is not authority; capability possession is not proof of
good intent; and a cryptographic identity is not factual truth.

### Fault tolerance and reconstruction

The
[fault-tolerance audit](2026-08-05-fault-tolerance-and-reconstruction.md)
already treats BFT, checkpoints, replicas, exact reconstruction, and
constraint-guided repair. This audit does not promote BFT again. It adds identity
scarcity, key custody, Byzantine clients, adaptive compromise per epoch, and the
possibility that all replicas share the same malicious software or recovery
image. Availability restoration is not compromise recovery.

### Graded assurance and staged verification

[Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md)
already binds artifact identity, proofs, effects, capabilities, tests,
monitoring, provenance, migration, and recovery. Security evidence belongs in
that envelope; it is not a parallel envelope.

[Candidate 010](../../experiments/candidates/010-reset-coupled-staged-verification.md)
already distinguishes sequential checking from genuinely informative staged
verification. Password plus a correlated recovery factor, two approvals from the
same compromised identity provider, or repeated inspection of the same poisoned
telemetry do not become independent evidence by being called multi-factor or
defence in depth. Security staging must estimate conditional dependence and must
beat ordinary step-up authentication and approval workflows.

### High-reliability operations and authority envelopes

The
[high-reliability audit](2026-08-05-high-reliability-organizations-incident-learning.md)
already covers incident command, containment, near-miss reporting, postmortems,
and organizational learning. Security contributes adversarial forensics,
credential/key containment, and persistence eradication; it does not create a
second operational-assurance plane.

[Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md)
already shrinks authority using observation age, integrity, mode, headroom, and
coordination state. Continuous authorization, short-lived credentials, and
revocation are the strongest conventional security nulls for it. A security
version is justified only if adversary-aware epoch and recovery-root information
improves outcomes beyond that existing candidate.

## 1. Authentication: a protocol claim, not a personality claim

Needham and Schroeder showed how encryption, nonces, and a key-distribution
service could support authentication in large networks
([Needham and Schroeder 1978](https://doi.org/10.1145/359657.359659)). Dolev and
Yao then made an active network adversary explicit: the adversary controls
message delivery and can compose messages from known terms, while cryptographic
operations are idealized
([Dolev and Yao 1983](https://doi.org/10.1109/TIT.1983.1056650)). The abstraction
is intentionally strong about the network and intentionally ideal about
cryptography; real side channels, parser errors, weak randomness, and primitive
breaks lie outside it.

Lowe's impersonation attack on the Needham--Schroeder public-key protocol is the
critical corrective: the presence of public-key encryption did not establish
the intended peer agreement
([Lowe 1995](https://doi.org/10.1016/0020-0190(95)00144-2)). Authentication must
name its correspondence property. For example, an injective-agreement claim is
roughly that every completed responder session for peer (A), data (d), and
session (j) corresponds to one distinct initiator event with the same values:

$$
\operatorname{Commit}_B(A,d,j)
\Rightarrow
\exists! i\;\operatorname{Running}_A(B,d,i).
$$

Here (A,B) are principals, (d) is agreed session data, and (i,j) are
protocol-session identifiers; all are dimensionless symbols. The claim does not
mean that (A)'s endpoint is uncompromised, the human intended the action, or
the data are true.

A deployment decision can be written as

$$
\operatorname{Allow}(s,o,a,t)=
\operatorname{Authn}(s,t)\land
[a\in\operatorname{Grant}(s,o,t)]\land
\operatorname{ContextOK}(s,o,a,t),
$$

where (s) is subject, (o) object, (a) action, and (t) time. Each term is a
Boolean policy input; the equation defines an authorization decision, not a
probability of safety.

Bonneau and colleagues compared 35 web-authentication proposals across 25
usability, deployability, and security benefits and found no scheme that simply
dominated passwords on every dimension
([Bonneau et al. 2012](https://doi.org/10.1109/SP.2012.44)). The strongest null
is therefore a mature, phishing-resistant, mutually authenticated protocol with
usable recovery—not a newly named cognitive “recognition” module.

**Failure modes:** credential relay; stolen session token; compromised endpoint;
weak enrollment/recovery; clock or nonce failure; parser/downgrade bug; identity
provider compromise; user confusion; and a formally verified property that is
weaker than the operational claim.

## 2. Least privilege, capabilities, and zero trust

Saltzer and Schroeder's design principles include fail-safe defaults, complete
mediation, separation of privilege, and least privilege
([Saltzer and Schroeder 1975](https://doi.org/10.1109/PROC.1975.9939)). They are
durable design guidance, not measured universal effect sizes. Dennis and Van
Horn supplied foundational protected-object and capability semantics
([Dennis and Van Horn 1966](https://doi.org/10.1145/365230.365252)); Capsicum
later demonstrated a practical UNIX capability mode and fine-grained descriptor
rights
([Watson et al. 2010](https://www.usenix.org/conference/usenixsecurity10/legacy-presentation/capsicum-practical-capabilities-unix)).

A useful exposure measure is a weighted authority-time integral:

$$
X_A = \int_{t_0}^{t_1}\sum_{r\in A(t)} w_r\,dt.
$$

(A(t)) is the set of rights available at time (t), (w_r) is a declared
severity weight for right (r), and (X_A) has units weighted-capability-seconds.
Raw right counts are misleading: read access to a public cache and authority to
rotate the recovery root are not equal. Weights must be reported separately or
justified by a loss model.

NIST SP 800-207 defines zero trust as removal of implicit trust based solely on
network location or ownership, with resource-focused authentication and
authorization through policy decision and enforcement components
([Rose et al. 2020](https://doi.org/10.6028/NIST.SP.800-207)). It is an
architecture and migration framework, not an RCT showing a fixed breach
reduction. Its policy engine, identity data, device posture, telemetry, and
enforcement points become explicit trust roots.

Capabilities and zero trust are complementary conventional mechanisms:
capabilities constrain *what authority can be exercised*; zero-trust policy
constrains *when a request is admitted*. Neither proves that an admitted action
is correct. Revocation is also harder for freely delegated object capabilities
unless indirection, leases, generation numbers, or a revocation service were
designed in.

**Failure modes:** ambient authority hidden in libraries; confused deputies;
capability leakage/delegation; policy drift; stale device posture; compromised
policy engine; enforcement bypass; fail-open outage behaviour; excessive prompts
that train bypass; and emergency “break glass” paths that become the real policy.

## 3. Thresholds, secret sharing, and separation of privilege

For Shamir's ((k,n)) secret sharing over a finite field (mathbb F_p), choose

$$
f(x)=s+a_1x+\dots+a_{k-1}x^{k-1}\pmod p
$$

and distribute shares ((i,f(i))). Any (k) distinct valid shares interpolate
(f(0)=s); fewer than (k) reveal no information about (s) in the ideal
information-theoretic model
([Shamir 1979](https://doi.org/10.1145/359168.359176)). Here (p) is a prime,
(s,a_i,x\in\mathbb F_p), (k,n) are counts, and a share occupies at least the
field-element representation plus identifier/authentication metadata.

Plain Shamir sharing is not by itself a threshold signature, verifiable secret
sharing, distributed key generation, malicious-share robustness, secure
reconstruction endpoint, or access-control policy. A production threshold
signature adds interactive protocols, authentication, nonce discipline,
robustness/abort semantics, and a proof under a corruption model. Robust
threshold DSS is an established null
([Gennaro et al. 2001](https://doi.org/10.1006/inco.2000.2881)).

Proactive sharing refreshes shares without changing the represented secret, so
an adversary must acquire the threshold within a refresh period rather than over
the full system lifetime
([Herzberg et al. 1995](https://doi.org/10.1007/3-540-44750-4_27)). The central
condition is

$$
\forall e,\quad |C_e|<k,
$$

where (C_e) is the set of independently controlled participants compromised
during epoch (e). The statement depends on secure erasure, authenticated
refresh channels, correct epoch agreement, and no compromise of the refresh or
recovery root. Epoch duration (Delta_e) is measured in seconds; refresh traffic
is bytes/epoch and cryptographic work is operations, CPU/GPU seconds, or joules.

Thresholding reduces a single-key compromise risk only if shares represent
independent failure and governance domains. Five containers, agents, or model
roles behind one cloud account, build pipeline, identity provider, or operator
are not five independent authorities. Douceur's Sybil result makes the identity
premise explicit: redundancy is undermined if one entity can cheaply present
many identities, absent a trusted certification or strong resource assumption
([Douceur 2002](https://www.microsoft.com/en-us/research/publication/the-sybil-attack/)).

**Failure modes:** malicious dealer; bad or unavailable shares; nonce reuse;
threshold denial of service; collusion; correlated operators; one reconstruction
endpoint; stale/offline participant; refresh interrupted across epochs; insecure
erasure; Sybil identities; and recovery procedures that reunify the secret.

## 4. Byzantine and adversarial protocols

Lamport, Shostak, and Pease established that unauthenticated “oral messages” need
at least (3f+1) participants to tolerate (f) Byzantine participants; their
signed-message model has different bounds
([Lamport et al. 1982](https://doi.org/10.1145/357172.357176)). For the familiar
PBFT setting,

$$
n\ge 3f+1,\qquad q=2f+1,
$$

where (n) is replica count, (f) is the tolerated Byzantine count, and (q)
is a commit quorum. Two quorums intersect in at least

$$
2q-n\ge f+1
$$

replicas, so their intersection contains at least one correct replica when at
most (f) are faulty. Counts are dimensionless. Network cost must separately
report messages/decision, bytes/decision, cryptographic operations, latency in
seconds, and energy in joules.

Castro and Liskov's PBFT implementation showed that an authenticated BFT service
could be practical on its NFS workload; its reported small overhead is not a
portable constant
([Castro and Liskov 1999](https://www.usenix.org/conference/osdi-99/presentation/practical-byzantine-fault-tolerance)).
The later proactive-recovery design tolerates unbounded lifetime faults only
under the crucial condition that fewer than one third of replicas are faulty in
each vulnerability window
([Castro and Liskov 2002](https://doi.org/10.1145/571637.571640)).

BFT supplies replicated ordering/safety under a fault model. It does not supply
identity scarcity, privacy, correct client intent, semantic truth, software
diversity, or a clean recovery image. A single malicious client command may be
faithfully replicated; a common compromised dependency can make all (n)
replicas Byzantine; and an adaptive attacker can target the recovery cadence.
This entire family remains an established fault-tolerance null, with adversarial
identity and credential assumptions added here.

**Failure modes:** (f+1) faults; Sybils; shared keys; identical software bug;
malicious administrator; nondeterministic execution; view-change/liveness
failure; network partitions or denial of service; compromised client; state
transfer from a poisoned quorum; and timing assumptions hidden behind the word
“asynchronous.”

## 5. Key lifecycle: rotation, forward security, and revocation

Key rotation changes the credential used after an epoch boundary. It limits
exposure only if old key material becomes unavailable and verifiers correctly
bind messages to epochs. Bellare and Miner's forward-secure signature formalizes
a stronger past-protection claim: compromise of the current signing key does not
enable forgery for prior periods under the scheme and proof assumptions
([Bellare and Miner 1999](https://doi.org/10.1007/3-540-48405-1_28)). It does not
stop signatures during the current compromised period or guarantee secure
erasure.

Define the observed revocation window

$$
W_{\mathrm{rev}}=t_{\mathrm{last\ accepted}}-t_{\mathrm{compromise}},
$$

in seconds. It includes detection latency, decision/approval latency,
distribution/cache latency, clock error, and enforcement lag. When compromise
time is unknown, report an interval rather than a point estimate. A credential
TTL bounds only some uses; refresh tokens, offline verifiers, cached policy,
active sessions, delegated capabilities, and already signed artifacts can extend
effective authority.

OCSP provides signed certificate-status responses with `thisUpdate`,
`nextUpdate`, and `producedAt` times
([Santesson et al. 2013](https://doi.org/10.17487/RFC6960)). “Good” means the
responder does not currently report the serial as revoked under the protocol's
semantics; it is not proof that the certificate was properly issued, that the
endpoint is clean, or that the action is authorized. Availability policy also
matters: a soft-fail client preserves availability by accepting when status is
unreachable, whereas fail-closed behaviour turns status service failure into
denial of service.

Rotation and revocation therefore instantiate P-012 and candidate 012: authority
must be coupled to information lifetime and observation freshness. They do not
justify “forgetting” metaphors or a new memory architecture.

**Failure modes:** old key not erased; copied plaintext; stale cache; clock skew;
offline verifier; fail-open status outage; compromised CA/status signer;
long-lived session after credential revocation; rollback to an old epoch; and
recovery credentials weaker than the primary credential.

## 6. Intrusion detection: telemetry under a hostile base rate

Denning's intrusion-detection model organized audit records, profiles,
anomaly/statistical models, rules, and expert-system decisions
([Denning 1987](https://doi.org/10.1109/TSE.1987.232894)). Forrest and colleagues
experimentally modelled short sequences of UNIX process system calls as a
“self” and detected several studied intrusions
([Forrest et al. 1996](https://doi.org/10.1109/SECPRI.1996.502675)). This is
historically relevant biological inspiration, but it is not evidence that immune
metaphors solve open-world detection.

Paxson's Bro architecture separated a network event engine from site policy and
explicitly considered attempts to evade or overload a passive monitor
([Paxson 1999](https://doi.org/10.1016/S1389-1286(99)00112-7)). Sommer and Paxson
later explained why closed-world machine-learning evaluations transfer poorly
to operational network intrusion detection: distribution, semantics, base
rates, false positives, and evaluation realism matter
([Sommer and Paxson 2010](https://doi.org/10.1109/SP.2010.25)).

For prevalence (pi=P(A)), true-positive rate (r=P(+\mid A)), and false-positive
rate (u=P(+\mid\neg A)), alert precision is

$$
P(A\mid +)=\frac{r\pi}{r\pi+u(1-\pi)}.
$$

All terms are dimensionless probabilities. If evaluated event rate is
(lambda) events/second, expected alert rate is

$$
\lambda_+=\lambda[r\pi+u(1-\pi)]
$$

alerts/second. Even a low (u) can dominate when (pi) is very small. Every
evaluation must report false alerts per operational time, analyst minutes per
alert, dropped-event rate, detection delay in seconds, bytes of telemetry,
compute/energy, and attacker adaptation—not accuracy alone.

Detection is evidence acquisition for P-006/P-009 and the existing assurance
envelope. Response authority, quarantine, rollback, and human escalation remain
separate. The strongest null is a well-engineered EDR/NDR/SIEM pipeline with
signatures, rules, anomaly signals, protected telemetry, and rehearsed response.

**Failure modes:** missing or encrypted telemetry; sensor compromise; mimicry;
concept drift; label leakage; unrealistically balanced datasets; poisoned
baseline; adversarial examples/probes; alert floods; policy/script bugs; analyst
fatigue; and detection after irreversible disclosure.

## 7. Moving-target defence and diversity

Moving-target mechanisms re-randomize or diversify some attacker-relevant state:
addresses, layouts, instruction encodings, builds, credentials, routes, or
service instances. Their defensible claim is a changed attack cost or success
probability, not removal of the underlying flaw.

For states (i) selected with probabilities (p_i), configuration entropy is

$$
H(S)=-\sum_i p_i\log_2p_i
$$

bits. Entropy is not automatically an attack work factor. Information leaks,
crash/retry oracles, unequal probabilities, correlated layouts, and one exploit
that works across variants can reduce effective uncertainty. Reconfiguration
rate has units changes/second; compatibility, cache, state migration, downtime,
and energy must be measured.

Shacham and colleagues showed that the limited entropy available to studied
32-bit address-space randomization could be brute-forced by repeated attacks
([Shacham et al. 2004](https://doi.org/10.1145/1030083.1030124)). Snow and
colleagues demonstrated just-in-time code reuse that used runtime disclosure to
defeat fine-grained ASLR assumptions
([Snow et al. 2013](https://doi.org/10.1109/SP.2013.39)). These are not claims
that randomization is useless; they show that the leakage/retry/adaptation model
determines its benefit.

Moving-target defence is therefore P-004 diversity plus P-009 maintenance under
an adversary, and must compete with patching, memory-safe implementation,
exploit mitigation, conventional credential rotation, and genuinely independent
replicas. Repeatedly changing an insecure interface can add availability risk
without increasing semantic diversity.

**Failure modes:** state disclosure; unlimited retry; predictable RNG;
shared/global randomization secret; variant monoculture below the randomized
layer; attacker adaptation faster than rotation; stateful-session breakage;
observability loss; rollback; and operational complexity that delays patching.

## 8. Information-flow control

Access control asks whether a principal may directly operate on an object.
Information-flow control asks where information may propagate after access.
Denning's lattice model assigns security classes in a partial order and permits
flows consistent with that order
([Denning 1976](https://doi.org/10.1145/360051.360056)). Goguen and Meseguer's
noninterference work states a relational security property rather than a list of
permitted calls
([Goguen and Meseguer 1982](https://doi.org/10.1109/SP.1982.10014)).

For low input (l), two high inputs (h_1,h_2), program (P), and low-visible
observation function (operatorname{obs}_L), a deterministic schematic form is

$$
\forall h_1,h_2,l:\quad
\operatorname{obs}_L(\operatorname{run}(P,h_1,l))
=
\operatorname{obs}_L(\operatorname{run}(P,h_2,l)).
$$

Inputs and observations use domain-specific units; equality is a Boolean
relation. Real systems need termination-sensitive or insensitive definitions,
nondeterministic/probabilistic variants, declassification policy, concurrency
semantics, and a choice of visible timing/resource events.

IFC can constrain model/tool/data pathways, but it does not make released facts
true, decide that declassification was wise, or eliminate outputs encoded in
latency, resource exhaustion, model weights, embeddings, or physical actions
unless those channels are inside the semantics. It deduplicates into the
programming-languages audit's type/effect/proof layers and P-008
compartmentalized interaction.

**Failure modes:** wrong labels; implicit/declassification flows; covert timing
or resource channels; native/foreign code; unlabelled logs and embeddings;
termination leaks; policy composition mismatch; trusted downgrader compromise;
and unusable policy that drives bypass.

## 9. Recovery after compromise

Crash recovery assumes that saved state is desirable. Compromise recovery must
instead find a **trustworthy horizon**, remove persistence, replace exposed
authority, validate data/invariants, and observe the restored system. The latest
backup may contain the attacker, and an old clean backup may lose essential
state.

Let (t_f) be discovery/containment time and (t_c) the latest state time that
is independently judged clean. A security recovery-point age is

$$
\operatorname{RPA}_{\mathrm{clean}}=t_f-t_c
$$

seconds. Let (t_r) be time when the recovered service satisfies declared
security and functional gates; then

$$
\operatorname{RTO}_{\mathrm{secure}}=t_r-t_f
$$

seconds. These are not ordinary backup vendor constants. Confidence that
(t_c) is clean, lost business events/bytes, revoked credentials, restored
capacity, residual detection coverage, and recurrence over a follow-up window
must be reported.

Proactive secret sharing and proactive BFT recovery show how epoch-bounded
assumptions can limit a mobile adversary, but both require trustworthy refresh,
erasure, and recovery components. Forward-secure signatures protect prior
signature epochs under their assumptions, not the integrity of a compromised
host's logs after exposure. OCSP can distribute certificate status, not erase
malware. HRO incident practice coordinates response and learning, but does not
provide a cryptographic clean root.

The strongest conventional null is: isolate; preserve forensic evidence;
rebuild from a separately protected and verified image; restore only validated
data from a declared horizon; rotate and revoke every reachable credential;
repair the exploited cause; re-attest and regression-test; stage return to
service; and monitor for recurrence. The proposed envelope refinement must beat
this process rather than compare against “restart the same compromised image.”

**Failure modes:** unknown initial-access time; poisoned backups/images;
attacker-held signing/recovery key; stolen offline token; incomplete dependency
inventory; restored persistence; unrotated downstream secret; destroyed
forensic evidence; business-pressure shortcut; false clean-room independence;
and recurrence through the unchanged root cause.

## Cost and dimensional-analysis ledger

Security mechanisms exchange unlike quantities. They must not be collapsed into
one “security score” without explicit weights.

| Quantity | Symbol | Unit | Minimum reporting requirement |
| --- | --- | --- | --- |
| Authority exposure | (X_A) | weighted-capability-seconds | rights, weights, grant/revoke times, delegation |
| Authentication/authorization latency | (L_{aa}) | seconds/request | median and tail; cache and outage mode |
| Cryptographic traffic | (B_c) | bytes/session or bytes/decision | protocol phase and retransmissions |
| Cryptographic work | (O_c) | operations, CPU/GPU seconds, joules | algorithm, implementation, hardware |
| Replica/threshold availability | (P_{mathrm{avail}}) | probability over declared interval | independence/correlation model and repair rate |
| Refresh cadence | (Delta_e) | seconds/epoch | compromise-time assumption and refresh duration |
| Revocation exposure | (W_{\mathrm{rev}}) | seconds | detection through last covered acceptance |
| Detection quality | (r,u,P(A\mid+)) | probabilities | prevalence and confidence intervals |
| Alert load | (lambda_+) | alerts/second or alerts/day | analyst time and queueing/dropped alerts |
| Detection delay | (L_d) | seconds | censoring and missed attacks |
| Configuration uncertainty | (H(S)) | bits | leakage, retry, correlation, attacker knowledge |
| Recovery point age | (operatorname{RPA}_{clean}) | seconds | evidence for clean horizon and data loss |
| Secure recovery time | (operatorname{RTO}_{secure}) | seconds | functional, security, and recurrence gates |

An equal-budget experiment must match at least engineer-hours, hardware,
cryptographic/telemetry compute, network bytes, storage, operational drills, and
allowed service latency. A mechanism that merely spends more replicas, sensors,
reviews, or downtime has not shown an architectural efficiency gain.

## Applicability map for this project

| Project surface | Relevant mechanisms | Required envelope fields | Excluded inference |
| --- | --- | --- | --- |
| Tool-using model/agent | Workload identity, scoped capability, step-up authorization, audit | principal/workload ID, tool/action scope, expiry, policy version, monitor state | Authenticated agent is safe or truthful |
| Modular expert routing | Capability confinement, IFC, provenance | module version, permitted data/effects, label/declassification policy | Route confidence grants authority |
| Shared factual memory | Signed provenance, IFC, revocation/tombstone semantics | source/custody, integrity signature, access label, invalidation epoch | Signature makes content true |
| Continual learning/update | Graded assurance, threshold approval, staged deployment, rollback | artifact hash, proofs/tests, approver independence, key epoch, migration/recovery | Multiple correlated approvals are independent evidence |
| Distributed inference/training | Authenticated BFT only where arbitrary faults justify cost | replica identities, fault/timing bound, quorum, implementation/key diversity | Replica count alone supplies independence or privacy |
| Sensorimotor/robotic action | Short-lived capability, local safety interlock, latency-qualified authority | physical action scope, observation age/integrity, safe state, revocation path | Network authentication proves the physical action safe |
| Maintenance/sleep/replay plane | Isolated privilege, protected logs, clean checkpoints, rekey/reimage | recovery root, clean horizon, credential inventory, validation gates | Replay or sleep metaphor is compromise recovery |
| Human governance | Separation of duty, threshold approval, HRO incident practice | human/role identity, conflict/independence, emergency override, audit | More signatures imply better judgment |

## Equal-budget falsification programme

### SEC-EXP-01 — Epoch-bound authority versus conventional zero trust

**Hypothesis.** Adding explicit identity/key/attestation epoch, observation age,
revocation freshness, and recovery-root state to candidate 012 reduces harmful
post-compromise actions.

**Null.** Mature resource-centric IAM with short-lived credentials, device
posture, scoped service accounts, conventional session revocation, and the same
policy/telemetry budget.

**Attack set.** Stolen credential, stolen active session, compromised workload,
stale posture, IdP outage, status-service outage, clock rollback, and emergency
override abuse.

**Measures.** Unauthorized successful actions/attack; (W_{rev}) seconds;
weighted authority exposure (X_A); false denials/1000 legitimate requests;
p50/p99 latency; engineer-hours; availability; bytes and joules/request.

**Falsification.** Retire the security-specific refinement if it does not reduce
harm or exposure with non-inferior availability and matched total cost, or if
ordinary token/session lifetime tuning explains the gain.

### SEC-EXP-02 — Threshold authorization versus mature single-root controls

**Hypothesis.** Independently administered (k)-of-(n) approval/threshold
signing reduces catastrophic unauthorized changes without unacceptable delay.

**Nulls.** (a) HSM-protected single signing service with dual human control;
(b) conventional replicated approval workflow with independent IdPs; (c) same
workflow without threshold cryptography.

**Attack set.** One operator compromised, one IdP compromised, collusion,
participant outage, nonce/RNG fault, Sybil operator identities, and shared build
pipeline compromise.

**Measures.** Unauthorized signatures, denial/abort rate, time-to-authorize,
messages and bytes/signature, cryptographic CPU/joules, recovery time, and
verified count of independent failure domains.

**Falsification.** Reject if benefit disappears when administrative independence
is audited, if availability loss dominates, or if dual control/HSM achieves the
same loss bound at lower cost.

### SEC-EXP-03 — Adversarial replica ensemble versus ordinary BFT and diversity

**Hypothesis.** Heterogeneous model/tool replicas plus authenticated BFT resist
malicious or faulty outputs better than standard replicas under a fixed budget.

**Nulls.** PBFT-family replication; crash-only consensus; single verified
implementation; independent N-version services with a conventional voter.

**Attack set.** (f) and (f+1) corrupted replicas, shared prompt/data poison,
shared dependency backdoor, Sybil identities, malicious client request,
nondeterministic outputs, and network partition.

**Measures.** Safety violations, liveness/downtime, semantic error rate,
messages/decision, bytes, p99 latency, joules, implementation diversity, and
common-mode failure rate.

**Falsification.** Reject any “collective immunity” claim if ordinary BFT or a
single verified/sandboxed service matches safety at lower cost, or if correlated
failures dominate the assumed (f)-bound.

### SEC-EXP-04 — Security detector with response coupling

**Hypothesis.** A project-specific detector plus scoped automatic containment
reduces attack loss at fixed false-alert and analyst budget.

**Nulls.** Strong signature/rule-based EDR/NDR/SIEM; anomaly detector without
automatic response; conventional layered detector ensemble.

**Protocol.** Pre-register temporally separated train/calibration/test windows;
preserve natural prevalence; include adaptive evasion, telemetry loss, benign
distribution shift, and delayed labels. Keep analyst-hours and response
authority equal.

**Measures.** precision, recall, false alerts/day, missed loss, detection and
containment delay, collateral containment, analyst minutes/incident, telemetry
bytes, compute and joules.

**Falsification.** Reject if performance relies on balanced datasets, attack
family leakage, extra analyst labour, broader authority, or uncharged telemetry.

### SEC-EXP-05 — Moving target versus prevention and conventional mitigation

**Hypothesis.** Adaptive reconfiguration increases attacker cost or reduces
successful compromise at equal availability/operations budget.

**Nulls.** Patching/removal of vulnerability; memory-safe rewrite; conventional
ASLR/credential rotation; static but independently diversified deployment.

**Attack set.** Information leak, repeated probing, adaptive exploit, shared
variant flaw, stateful session, rollback, RNG disclosure, and reconfiguration
storm.

**Measures.** attacker queries/time-to-compromise, success probability, entropy
actually hidden, reconfiguration cost, downtime, p99 latency, regression rate,
operator hours, and joules.

**Falsification.** Reject if entropy does not translate to measured attack work,
if patching dominates, or if availability/complexity cost offsets loss reduction.

### SEC-EXP-06 — Information-flow enforcement for model/tool pipelines

**Hypothesis.** Explicit labels plus IFC enforcement reduce unauthorized data
release without destroying task utility.

**Nulls.** Conventional RBAC/ABAC and sandboxing; schema/taint checks at tool
boundaries; manual data segmentation.

**Attack set.** direct exfiltration, implicit flow, timing/resource channel,
prompt/tool injection, malicious declassifier, embedding/log leakage, native
extension, and policy-version mismatch.

**Measures.** released secret bits or records, channel capacity bits/second,
false blocks/1000 tasks, task utility, label/annotation hours, runtime latency,
memory, and joules.

**Falsification.** Reject a general containment claim if gains cover only direct
flows already stopped by the null, or if required declassification restores the
same leakage.

### SEC-EXP-07 — Epochal compromise recovery versus conventional rebuild

**Hypothesis.** Envelope-bound key epochs, clean-horizon evidence, and proactive
refresh reduce secure recovery time and recurrence.

**Null.** Well-rehearsed isolate/reimage/restore/rotate/validate workflow using
the same backup, staff, compute, telemetry, and downtime budget.

**Attack set.** poisoned latest backup, compromised build/signing key,
downstream secret theft, dormant persistence, clock/epoch rollback, malicious
operator, and attacker re-entry through unchanged root cause.

**Measures.** (operatorname{RPA}_{clean}),
(operatorname{RTO}_{secure}), lost events/bytes, credentials fully rotated,
recurrence over a pre-registered follow-up period, forensic preservation,
service quality, operator hours, and total energy.

**Falsification.** Reject if “recovery” means only service availability, if the
clean root is assumed rather than tested, or if ordinary rebuild practice is
faster and no less secure.

## Temporary claims

| ID | Status | Audit-local claim | Evidence base | Strongest challenge / retirement condition |
| --- | --- | --- | --- | --- |
| SEC-TC-001 | established | Authentication and authorization are distinct; protocol authentication is relative to a named correspondence/freshness property and adversary model. | Needham--Schroeder; Dolev--Yao; Lowe | Retire only if terminology is redefined explicitly; do not merge operationally |
| SEC-TC-002 | established | Encryption primitives do not by themselves prove a composed authentication protocol secure. | Lowe attack; Dolev--Yao modelling | None within stated scope |
| SEC-TC-003 | established | Least privilege, complete mediation, and separation of privilege are established security design principles, not new AI principles. | Saltzer--Schroeder; capability literature | A genuinely distinct mechanism must beat capability/IAM nulls |
| SEC-TC-004 | plausible | Weighted capability-seconds is a useful exposure metric when rights and severity weights remain auditable rather than collapsed. | Dimensional analysis; least-privilege rationale | Reject if results are weight-sensitive or right cardinality lacks loss calibration |
| SEC-TC-005 | established | NIST zero trust removes location-based implicit trust but retains explicit trust roots in identity, policy, telemetry, enforcement, and recovery. | NIST SP 800-207 | None; efficacy magnitudes remain deployment-specific |
| SEC-TC-006 | established | Shamir sharing protects secrecy below threshold in its ideal field model; it does not alone provide verifiability, robust signing, availability, or secure reconstruction. | Shamir; threshold-signature work | None within model |
| SEC-TC-007 | plausible | Threshold benefit depends more on audited independence and corruption cadence than on logical participant count. | Proactive sharing; Sybil result; threshold protocols | Quantify in SEC-EXP-02; reject broad form if correlated controls are negligible in target setting |
| SEC-TC-008 | established | PBFT-style safety uses bounded Byzantine identities/replicas; liveness, privacy, client correctness, and common-mode compromise are separate. | Lamport et al.; Castro--Liskov | None within stated protocol family |
| SEC-TC-009 | established | Proactive lifetime guarantees depend on fewer than threshold compromises per vulnerability window plus trustworthy refresh/erasure/recovery. | Herzberg et al.; Castro--Liskov 2002 | None within model |
| SEC-TC-010 | established | Forward-secure signatures protect past epochs after current-key compromise under scheme assumptions; they do not protect the current/future epoch or guarantee erasure. | Bellare--Miner | None within model |
| SEC-TC-011 | plausible | End-to-end revocation exposure is better measured from compromise to last covered acceptance than by nominal credential TTL. | OCSP freshness semantics; systems reasoning | Validate against real session/cache/delegation traces |
| SEC-TC-012 | established | Operational alert precision depends on attack prevalence; accuracy on balanced data is insufficient. | Bayes' rule; Sommer--Paxson | None mathematically; prevalence estimates remain uncertain |
| SEC-TC-013 | established | IDS is a sensing/classification layer, not containment or recovery. | Denning; Paxson; operational boundary | None unless system explicitly couples and evaluates response |
| SEC-TC-014 | plausible | Moving-target defence should be evaluated as attacker work-factor change after leakage, retries, and adaptation—not nominal configuration entropy. | Shacham et al.; Snow et al. | SEC-EXP-05; reject if entropy predicts outcomes robustly without those variables |
| SEC-TC-015 | established | IFC/noninterference guarantees are relative to labels, observations, semantics, declassification, and channel coverage. | Denning; Goguen--Meseguer | None within formal scope |
| SEC-TC-016 | established | Availability recovery can restore compromised state; compromise recovery requires a trustworthy horizon, clean root, credential replacement, and recurrence checks. | Proactive recovery limits; fault-tolerance distinction | Recovery-root construction remains an open engineering question |
| SEC-TC-017 | speculative | Explicit epoch, revocation-freshness, compromise-model, and clean-root fields may improve candidates 009/012 at equal budget. | Synthesis of established mechanisms | Must pass SEC-EXP-01 and SEC-EXP-07; otherwise fold into ordinary IAM/recovery documentation |
| SEC-TC-018 | disputed | “Biological immunity” or “collective intelligence” supplies a novel security architecture merely by combining detection, diversity, thresholds, and recovery. | All mechanisms have strong conventional nulls | Reject unless a specific mechanism wins an equal-budget adversarial test |

## Research disposition

1. **Do not add a new stable principle.** Map security mechanisms to P-002,
   P-003, P-004, P-006, P-008, P-009, P-012, and P-013 as applicable.
2. **Refine, do not duplicate, candidates 009 and 012.** The possible additions
   are identity/credential/attestation epoch, adversary class, approval-domain
   independence, revocation freshness, and clean-recovery-root evidence.
3. **Treat conventional security as the baseline.** Mature IAM/PKI, HSM/KMS,
   capability sandboxing, threshold protocols, BFT, EDR/NDR/SIEM, ASLR/diversity,
   IFC, and rehearsed rebuild/restore are not straw men.
4. **Prioritize SEC-EXP-01 and SEC-EXP-07.** They directly test whether the
   envelope integration adds value beyond ordinary continuous authorization and
   compromise recovery. Run threshold/BFT/moving-target experiments only for a
   concrete deployment whose threat model warrants their cost.
5. **Keep four clocks.** Record compromise time interval, detection time,
   revocation/enforcement time, and independently validated recovery time. A
   single “incident duration” conceals the mechanism under test.

## Audit-local bibliography (BibTeX)

Every external work cited by this audit is represented below. Project-local
documents are linked inline and are intentionally not duplicated as BibTeX.

```bibtex
@article{saltzer1975protection,
  author = {Saltzer, Jerome H. and Schroeder, Michael D.},
  title = {The Protection of Information in Computer Systems},
  journal = {Proceedings of the IEEE},
  year = {1975},
  volume = {63},
  number = {9},
  pages = {1278--1308},
  doi = {10.1109/PROC.1975.9939}
}

@article{dennis1966programming,
  author = {Dennis, Jack B. and Van Horn, Earl C.},
  title = {Programming Semantics for Multiprogrammed Computations},
  journal = {Communications of the ACM},
  year = {1966},
  volume = {9},
  number = {3},
  pages = {143--155},
  doi = {10.1145/365230.365252}
}

@inproceedings{watson2010capsicum,
  author = {Watson, Robert N. M. and Anderson, Jonathan and Laurie, Ben and Kennaway, Kris},
  title = {Capsicum: Practical Capabilities for {UNIX}},
  booktitle = {19th USENIX Security Symposium},
  year = {2010},
  url = {https://www.usenix.org/conference/usenixsecurity10/legacy-presentation/capsicum-practical-capabilities-unix}
}

@techreport{rose2020zero,
  author = {Rose, Scott and Borchert, Oliver and Mitchell, Stu and Connelly, Sean},
  title = {Zero Trust Architecture},
  institution = {National Institute of Standards and Technology},
  type = {NIST Special Publication},
  number = {800-207},
  year = {2020},
  doi = {10.6028/NIST.SP.800-207}
}

@article{needham1978authentication,
  author = {Needham, Roger M. and Schroeder, Michael D.},
  title = {Using Encryption for Authentication in Large Networks of Computers},
  journal = {Communications of the ACM},
  year = {1978},
  volume = {21},
  number = {12},
  pages = {993--999},
  doi = {10.1145/359657.359659}
}

@article{dolev1983security,
  author = {Dolev, Danny and Yao, Andrew C.},
  title = {On the Security of Public Key Protocols},
  journal = {IEEE Transactions on Information Theory},
  year = {1983},
  volume = {29},
  number = {2},
  pages = {198--208},
  doi = {10.1109/TIT.1983.1056650}
}

@article{lowe1995attack,
  author = {Lowe, Gavin},
  title = {An Attack on the {Needham--Schroeder} Public-Key Authentication Protocol},
  journal = {Information Processing Letters},
  year = {1995},
  volume = {56},
  number = {3},
  pages = {131--133},
  doi = {10.1016/0020-0190(95)00144-2}
}

@inproceedings{bonneau2012quest,
  author = {Bonneau, Joseph and Herley, Cormac and van Oorschot, Paul C. and Stajano, Frank},
  title = {The Quest to Replace Passwords: A Framework for Comparative Evaluation of Web Authentication Schemes},
  booktitle = {2012 IEEE Symposium on Security and Privacy},
  year = {2012},
  pages = {553--567},
  doi = {10.1109/SP.2012.44}
}

@article{shamir1979share,
  author = {Shamir, Adi},
  title = {How to Share a Secret},
  journal = {Communications of the ACM},
  year = {1979},
  volume = {22},
  number = {11},
  pages = {612--613},
  doi = {10.1145/359168.359176}
}

@inproceedings{herzberg1995proactive,
  author = {Herzberg, Amir and Jarecki, Stanislaw and Krawczyk, Hugo and Yung, Moti},
  title = {Proactive Secret Sharing or: How to Cope with Perpetual Leakage},
  booktitle = {Advances in Cryptology---CRYPTO '95},
  series = {Lecture Notes in Computer Science},
  volume = {963},
  year = {1995},
  pages = {339--352},
  doi = {10.1007/3-540-44750-4_27}
}

@article{gennaro2001threshold,
  author = {Gennaro, Rosario and Jarecki, Stanislaw and Krawczyk, Hugo and Rabin, Tal},
  title = {Robust Threshold {DSS} Signatures},
  journal = {Information and Computation},
  year = {2001},
  volume = {164},
  number = {1},
  pages = {54--84},
  doi = {10.1006/inco.2000.2881}
}

@article{lamport1982byzantine,
  author = {Lamport, Leslie and Shostak, Robert and Pease, Marshall},
  title = {The Byzantine Generals Problem},
  journal = {ACM Transactions on Programming Languages and Systems},
  year = {1982},
  volume = {4},
  number = {3},
  pages = {382--401},
  doi = {10.1145/357172.357176}
}

@inproceedings{castro1999pbft,
  author = {Castro, Miguel and Liskov, Barbara},
  title = {Practical Byzantine Fault Tolerance},
  booktitle = {Third Symposium on Operating Systems Design and Implementation},
  year = {1999},
  pages = {173--186},
  url = {https://www.usenix.org/conference/osdi-99/presentation/practical-byzantine-fault-tolerance}
}

@article{castro2002proactive,
  author = {Castro, Miguel and Liskov, Barbara},
  title = {Practical Byzantine Fault Tolerance and Proactive Recovery},
  journal = {ACM Transactions on Computer Systems},
  year = {2002},
  volume = {20},
  number = {4},
  pages = {398--461},
  doi = {10.1145/571637.571640}
}

@inproceedings{douceur2002sybil,
  author = {Douceur, John R.},
  title = {The Sybil Attack},
  booktitle = {First International Workshop on Peer-to-Peer Systems},
  series = {Lecture Notes in Computer Science},
  volume = {2429},
  year = {2002},
  pages = {251--260},
  doi = {10.1007/3-540-45748-8_24},
  url = {https://www.microsoft.com/en-us/research/publication/the-sybil-attack/}
}

@article{denning1976lattice,
  author = {Denning, Dorothy E.},
  title = {A Lattice Model of Secure Information Flow},
  journal = {Communications of the ACM},
  year = {1976},
  volume = {19},
  number = {5},
  pages = {236--243},
  doi = {10.1145/360051.360056}
}

@inproceedings{goguen1982policies,
  author = {Goguen, Joseph A. and Meseguer, Jos{\'e}},
  title = {Security Policies and Security Models},
  booktitle = {1982 IEEE Symposium on Security and Privacy},
  year = {1982},
  pages = {11--20},
  doi = {10.1109/SP.1982.10014}
}

@article{denning1987intrusion,
  author = {Denning, Dorothy E.},
  title = {An Intrusion-Detection Model},
  journal = {IEEE Transactions on Software Engineering},
  year = {1987},
  volume = {SE-13},
  number = {2},
  pages = {222--232},
  doi = {10.1109/TSE.1987.232894}
}

@inproceedings{forrest1996self,
  author = {Forrest, Stephanie and Hofmeyr, Steven A. and Somayaji, Anil and Longstaff, Thomas A.},
  title = {A Sense of Self for {UNIX} Processes},
  booktitle = {1996 IEEE Symposium on Security and Privacy},
  year = {1996},
  pages = {120--128},
  doi = {10.1109/SECPRI.1996.502675}
}

@article{paxson1999bro,
  author = {Paxson, Vern},
  title = {Bro: A System for Detecting Network Intruders in Real-Time},
  journal = {Computer Networks},
  year = {1999},
  volume = {31},
  number = {23--24},
  pages = {2435--2463},
  doi = {10.1016/S1389-1286(99)00112-7}
}

@inproceedings{sommer2010outside,
  author = {Sommer, Robin and Paxson, Vern},
  title = {Outside the Closed World: On Using Machine Learning for Network Intrusion Detection},
  booktitle = {2010 IEEE Symposium on Security and Privacy},
  year = {2010},
  pages = {305--316},
  doi = {10.1109/SP.2010.25}
}

@inproceedings{shacham2004aslr,
  author = {Shacham, Hovav and Page, Matthew and Pfaff, Ben and Goh, Eu-Jin and Modadugu, Nagendra and Boneh, Dan},
  title = {On the Effectiveness of Address-Space Randomization},
  booktitle = {11th ACM Conference on Computer and Communications Security},
  year = {2004},
  pages = {298--307},
  doi = {10.1145/1030083.1030124}
}

@inproceedings{snow2013jit,
  author = {Snow, Kevin Z. and Monrose, Fabian and Davi, Lucas and Dmitrienko, Alexandra and Liebchen, Christopher and Sadeghi, Ahmad-Reza},
  title = {Just-In-Time Code Reuse: On the Effectiveness of Fine-Grained Address Space Layout Randomization},
  booktitle = {2013 IEEE Symposium on Security and Privacy},
  year = {2013},
  pages = {574--588},
  doi = {10.1109/SP.2013.39}
}

@inproceedings{bellare1999forward,
  author = {Bellare, Mihir and Miner, Sara K.},
  title = {A Forward-Secure Digital Signature Scheme},
  booktitle = {Advances in Cryptology---CRYPTO '99},
  series = {Lecture Notes in Computer Science},
  volume = {1666},
  year = {1999},
  pages = {431--448},
  doi = {10.1007/3-540-48405-1_28}
}

@techreport{santesson2013ocsp,
  author = {Santesson, Stefan and Myers, Michael and Ankney, Rich and Malpani, Ambarish and Galperin, Slava and Adams, Carlisle},
  title = {X.509 Internet Public Key Infrastructure Online Certificate Status Protocol---OCSP},
  institution = {Internet Engineering Task Force},
  type = {RFC},
  number = {6960},
  year = {2013},
  doi = {10.17487/RFC6960},
  url = {https://datatracker.ietf.org/doc/html/rfc6960}
}
```


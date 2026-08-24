# Medical devices and biomedical engineering: device chains, signals, use, drift, alarms, interoperability, security, and field performance

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-24
- **Scope:** diagnostic and therapeutic devices; biomedical signals and imaging;
  prosthetic and assistive control; human factors and usability; calibration,
  uncertainty, and drift; clinical alarm systems; interoperability and
  cybersecurity; clinical/performance evidence; and post-market surveillance
- **Evidence rule:** a device indication, estimate, alarm, message, command,
  delivered action, and clinical outcome are different records. Technical
  conformance is not clinical effectiveness; a successful data transfer is not
  semantic interoperability; and a one-time calibration or security test is not
  lifecycle assurance.
- **Promotion state:** no new principle and no new candidate. Exactly nine
  bounded claims are reserved as C-1413 through C-1421, and exactly nine
  CPU-only synthetic falsification protocols are specified.
- **Repository effect:** closes the field-centred gap recorded for medical
  engineering, integrates its nine records and previously absent references in
  the central claim and bibliography ledgers, and leaves principle, candidate,
  and field-coverage files unchanged. It refines existing observation,
  assurance, operational, authority, convention, inheritance, and governance
  routes.
- **Patient-data rule:** no protocol in this audit uses, requests, reconstructs,
  or emulates an identifiable patient record. Every test population, waveform,
  image feature, user trace, message, attack, exposure, and event is generated
  from declared synthetic distributions.

## Normative-source header

- **Normative context:** European Union product law is the baseline; German
  implementation and operator law is added only for a product operated or
  studied in Germany. This audit is research and engineering translation, not a
  conformity assessment, clinical investigation authorization, legal opinion,
  or authorization to use a device.
- **Jurisdiction and authority:** the European Parliament and Council for
  Regulations (EU) 2017/745, 2017/746, 2016/679, and 2024/1689 as amended by
  Regulation (EU) 2026/1744; the European Commission for Official Journal
  harmonized-standard decisions and EUDAMED notices; the Medical Device
  Coordination Group and Artificial Intelligence Board for non-binding
  guidance; the German legislature and Federal Government for MPDG and
  MPBetreibV; BfArM for German medical-device risk evaluation and published
  field safety information; BSI for authoritative German cybersecurity
  technical studies; EMA only for the companion-diagnostic consultation hook;
  and ISO, IEC, DICOM/NEMA, and HL7 for technical standards or specifications.
- **Source role:** MDR, IVDR, applicable provisions of the AI Act and GDPR,
  MPDG, and MPBetreibV are binding law when their own scope facts are met.
  Commission implementing decisions publish references that can create a
  requirement-specific presumption of conformity under MDR/IVDR; they do not
  turn a standard into legislation or prove device benefit. MDCG/AIB documents
  are guidance and expressly not legally binding. BfArM pages are authoritative
  administrative information; BSI ManiMed is an authoritative technical study.
  ISO, IEC, DICOM, and HL7 publications are technical practice unless a law,
  contract, certification scheme, or cited harmonized route gives a particular
  edition a further role.
- **Snapshot date and version:** official status was checked on 2026-08-24.
  MDR and IVDR were in force. The AI Act text checked was the consolidated
  2026-07-27 version after Regulation (EU) 2026/1744; its Chapter III Sections
  1--3 duties are staged to 2027-12-02 for Article 6(2)/Annex III systems and
  2028-08-02 for Article 6(1)/Annex I product systems. The current MDR and IVDR
  harmonized-standard lists were the consolidated Implementing Decisions
  2021/1182 and 2021/1195 of 2026-06-17. DICOM PS3 was edition 2026c. FHIR R5
  5.0.0 was the current published release; R6 6.0.0-ballot5 dated 2026-07-17
  remained a ballot, not the current stable release.
- **Applicability hook:** unresolved until intended purpose, device/IVD status,
  risk class, safety component, conformity route, manufacturer/provider and
  operator/deployer roles, market, clinical or performance study, data flows,
  personal-data status, German operating setting, network combination, and
  post-market responsibility are fixed. No rule in this audit is applied merely
  because a system processes a biomedical signal.

## Executive finding

Medical engineering contributes a hard end-to-end boundary:

$$
\text{body/specimen}
\rightarrow \text{interface}
\rightarrow \text{transducer}
\rightarrow \text{processing}
\rightarrow \text{display/message/alarm}
\rightarrow \text{authorized action}
\rightarrow \text{physical delivery}
\rightarrow \text{verified effect}.
$$

Evidence at one arrow does not silently validate the next. LungIMPACT is a
particularly useful current null: AI chest-radiograph prioritization shortened
reporting but did not shorten the trial's CT, diagnosis, or treatment outcomes
in the studied pathway. Conversely, a six-month closed-loop insulin trial
improved time in range, but only as evidence about the evaluated
sensor--controller--pump--user system and population, not a generic theorem that
closed loop is beneficial.

The same separation governs the rest of the field:

1. an estimated physiological value is conditional on body/interface,
   acquisition, processing, reference, timing, and support;
2. offline prosthesis decoding is not home function, wear, workload, or safety;
3. nominally functioning equipment can remain vulnerable to use error;
4. calibration is a dated comparison, not immunity from drift;
5. an alarm is not receipt, acknowledgement, authorized response, or resolution;
6. transport and schema conformance are not semantic or workflow
   interoperability;
7. confidentiality or a penetration-test pass is not availability-safe
   cybersecurity; and
8. pre-market evidence and spontaneous reports do not replace exposure-qualified
   post-market learning.

These are bounded engineering claims, not new cognitive architecture. Each
routes to mature metrology, control, human-factors, safety, software-lifecycle,
interoperability, security, epidemiology, and quality-system nulls before any
project-level composition is promoted.

## Normative role and applicability matrix

| Source | Role on 2026-08-24 | Activating facts | What it cannot establish |
| --- | --- | --- | --- |
| MDR 2017/745 | binding EU product law | an in-scope medical device, actor, market or investigation | clinical benefit from CE marking alone |
| IVDR 2017/746 | binding EU product law | an in-scope IVD, actor, market or performance study | clinical utility from analytical performance alone |
| AI Act 2024/1689 as amended in 2026 | binding, provision-specific and staged | an in-scope AI system and actor; Article 6(1) also requires a safety component/product and third-party conformity route | that every algorithmic medical device is high-risk AI or that future duties are current evidence |
| GDPR 2016/679 | binding data-protection law | processing personal data within material and territorial scope; health, genetic, or biometric data may activate Article 9 | device safety, effectiveness, or applicability to truly anonymous synthetic tests |
| MPDG | binding German implementing law | MDR/IVDR products, studies, actors, or enforcement in Germany | a substitute for the underlying EU scope analysis |
| MPBetreibV 2025 | binding German operator ordinance | operating/using covered products in its scope; sections 12, 15, and 17 have narrower product hooks | universal two-year calibration or cybersecurity testing for every device |
| Implementing Decisions 2021/1182 and 2021/1195 | binding publication decisions supporting MDR/IVDR | exact OJ-listed EN edition and covered requirement | that an uncited ISO/IEC edition is harmonized, or that conformance proves effectiveness |
| MDCG/AIB guidance | non-binding guidance | relevant MDR/IVDR implementation question | binding interpretation; only courts give authoritative Union-law interpretation |
| BfArM risk and FSCA pages | authoritative German administrative information | German vigilance/risk-evaluation or field-correction work | incident incidence without exposure and ascertainment |
| BSI ManiMed | authoritative technical evidence/practice | network-connected medical-device security engineering | a legal compliance certificate or exhaustive current vulnerability census |
| ISO/IEC/DICOM/HL7 publications | technical standards/specifications | declared edition, profile, implementation, contract, or conformity route | legal applicability, multivendor interoperability, clinical performance, or zero risk |
| EMA companion-diagnostic guidance | procedural guidance | IVDR companion diagnostic requiring the specified medicinal-product consultation | general authority over all medical devices |

### AI Act and GDPR: scoped rather than decorative

MDCG 2025-6/AIB 2025-1 states the Article 6(1) medical-product high-risk
conditions as a conjunction: the AI system must be a safety component or itself
the product, and the product must undergo third-party conformity assessment
under MDR/IVDR. The guidance gives non-exhaustive class examples, but it is not
binding and predates the 2026 application-date amendment. This audit therefore
uses the current consolidated AI Act for dates and the guidance only for
implementation context. A fixed threshold, ordinary signal-processing
algorithm, or Class I route is not called high-risk AI without the actual facts.

GDPR is retained only where personal data are processed. A hospital waveform
linked to a person normally raises a data-protection question; a deterministic
synthetic waveform with no linkability does not. GDPR compliance does not
replace MDR/IVDR risk, performance, usability, or vigilance evidence.

### Harmonized edition is not synonymous with newest international edition

The distinction matters in 2026:

- ISO 14971:2019 remains current internationally after confirmation in 2025,
  while EN ISO 14971:2019/A11:2021 is OJ-listed.
- ISO 14155:2026, edition 4, was published on 2026-03-23 and ISO 14155:2020 was
  withdrawn internationally. Yet the current MDR OJ list cites EN ISO
  14155:2020/A11:2024. The newer ISO edition does not automatically inherit that
  EU presumption-of-conformity role.
- EN ISO 20916:2024, based on ISO 20916:2019, is OJ-listed for IVDR.
- IEC 62366-1:2015+A1:2020, IEC 60601-1-8:2006+A1:2012+A2:2020,
  IEC 62304:2006+A1:2015, IEC 80001-1:2021, and IEC 81001-5-1:2021 are used
  here as authoritative technical metadata. This audit did not find evidence in
  the current MDR OJ list that those exact IEC publications themselves carry
  an MDR harmonized citation; their OJ status must not be inferred from
  familiarity.

## Engineering state and distinct records

Represent a device episode as

$$
D=(p,v,b,i,a,q,r,s,m,u,h,c,x,e,o,f),
$$

where $p$ is intended purpose and population, $v$ is device/software/model
version, $b$ is body/specimen and environment support, $i$ is interface and
installation state, $a$ is acquisition protocol, $q$ is signal-quality state,
$r$ is reference method and pairing, $s$ is processed estimate or decision,
$m$ is message/alarm, $u$ is user and use context, $h$ is authority/handoff,
$c$ is commanded action, $x$ is physically executed action, $e$ is verified
effect, $o$ is clinical/performance outcome, and $f$ is field history including
maintenance, update, incident, and corrective action.

The typed separations are:

$$
s\ne m,\qquad m\ne h,\qquad c\ne x,\qquad x\ne e,\qquad e\ne o.
$$

A record can be technically complete and clinically unresolved. For example,
a valid DICOM object can be delivered with the wrong person identity, unit,
time basis, laterality, scaling, or workflow state. Likewise, a controller can
issue a valid command that an actuator never delivers.

## Evidence synthesis

### 1. Diagnostic and therapeutic output must survive the pathway

LungIMPACT randomized 93,326 eligible primary-care chest radiographs between
AI-prioritization-on and -off days. Prioritization shortened reporting, but the
study did not show improvement in time to CT, lung-cancer diagnosis, or
treatment. This is direct evidence that a local information-speed gain can be
absorbed by later pathway queues.

Brown and colleagues' six-month randomized multicentre closed-loop insulin
trial found an 11-percentage-point between-group improvement in time in target
range. It is positive evidence for the tested integrated therapeutic chain,
with its specific sensors, controller, pump, participants, follow-up, and
fallbacks. It is not evidence that controller simulation alone establishes
benefit, nor that every closed-loop device has the same safety envelope.

**Boundary retained:** diagnostic accuracy, prioritization latency, authorized
action, delivered treatment, and patient-relevant endpoint must be separately
measured. For therapeutic devices, test sensor, controller, actuator,
connectivity, user, override, degraded mode, and physical delivery together.

### 2. Biomedical signals and images are operator-qualified observations

Pulse oximetry makes the measurement boundary concrete. Bickler, Feiner, and
Severinghaus found skin-pigmentation-related accuracy differences at low
saturation in a controlled study. Sjoding and colleagues later reported
different frequencies of occult hypoxaemia across racial groups in paired
clinical measurements. These studies have different designs and do not make
self-identified race a physical calibration variable; they jointly show that
the device--body--reference pairing and support cannot be erased.

For a latent state $z(t)$ and channel $k$,

$$
y_k(t)=g_k\!\left(z(t),b(t),i(t),a,v\right)+\epsilon_k(t),
\qquad
r(t+\delta)=z(t)+\eta(t),
$$

where $b$ includes relevant body state, $i$ interface/coupling, $a$ acquisition,
$v$ device and processing version, and $\delta$ reference-pair lag. Bias,
limits of agreement, calibration, missingness, subgroup support, lag, and
decision consequences remain distinct.

This section does not duplicate C-1387. That claim already covers medical-image
site/device/protocol/reconstruction transport and shortcuts. C-1414 adds the
physiological body/interface, signal-quality, reference-method, and reference-
pair timing boundary that is especially visible in bedside and wearable
sensors.

### 3. Prosthetic decoder accuracy is not closed-loop assistive function

Simon and colleagues used randomized-order home trials comparing pattern
recognition and direct control of a transradial multi-articulating hand.
Offline calibration accuracy averaged 81.5 percent, while the home results were
mixed: the Assessment of Capacity for Myoelectric Control improved, but other
outcome measures did not differ. Clemente and colleagues showed that intraneural
sensory feedback could improve grip-force control and coordination, but in a
very narrow experimental setting; it cannot supply a population-wide effect.

The relevant system is

$$
\hat{g}_t=\pi_\theta(e_t,\ell_t),\quad
\tau_t=F(\hat{g}_t,x_t,\kappa_t),\quad
e_{t+1}\sim G(e_t,\phi_t,\rho_t,w_t),
$$

where $e_t$ is an electrode/EMG observation, $\ell_t$ decoder state, $\tau_t$
joint torque, $x_t$ limb/object state, $\kappa_t$ socket and mechanical state,
$\phi_t$ fatigue, $\rho_t$ electrode rotation/impedance, and $w_t$ user
adaptation. Functional success, drops, time, effort, feedback, wear, training,
comfort, abandonment, and safety are endpoints rather than nuisance details.

### 4. Human factors is a safety property of use, not satisfaction

Garmer and colleagues compared a frequently used infusion-pump interface with
a human-factors redesign in tests with nurses. The redesign reduced time,
manual use, and handling problems, but errors remained. A favourable usability
mean or completed training therefore cannot close critical-task risk.

MDR Annex I makes use-error reduction and intended-user knowledge part of the
binding safety/performance frame where MDR applies. IEC 62366-1 provides a
technical usability-engineering process. Neither source permits a summative
test with unrepresentative users, trivial tasks, or an unrealistic environment
to stand in for safe use. Preserve user groups, training state, critical tasks,
use scenarios, interruptions, lighting/noise/PPE, modes, alarm states,
maintenance and emergency work, observed use errors, and recovery.

### 5. Calibration is dated evidence; drift is a lifecycle process

Lakhal and colleagues evaluated continuous finger-cuff blood pressure against
arterial and intermittent devices in ICU patients. The study reported
performance differences and time-dependent drift before recalibration,
especially around interventions. It illustrates why an initial comparison does
not authorize an indefinitely valid measurement.

For measurand $x_t$ in mmHg,

$$
y_t=(1+\alpha_t)x_t+b_t+\epsilon_t,\qquad
\alpha_{t+1}=\alpha_t+\nu_t,\qquad
b_{t+1}=b_t+\omega_t+j_t,
$$

where $\alpha_t$ is scale drift, $b_t$ is offset, and $j_t$ is a shock or
intervention-associated jump. A complete record declares measurand, unit,
range, reference, uncertainty, environmental support, calibration version and
date, adjustment, verification, drift monitor, trigger, and the downstream
decision sensitivity.

German MPBetreibV section 15 is deliberately not generalized. It requires
metrological controls for products listed in Annex 2, with traceable standards,
specified intervals, and immediate checks when there are signs that error
limits are not met or metrological properties may have changed. That is a
binding scoped operator rule, not a universal calibration interval for all
medical devices.

### 6. Alarm performance includes a human response queue

Drew and colleagues documented a large physiologic-monitor alarm burden over
461 consecutive ICU patients. Bonafide and colleagues observed 36 nurses for
210 hours and 5,070 alarms; 87.1 percent of PICU and 99.0 percent of ward alarms
were nonactionable, and response time rose with recent nonactionable-alarm
exposure. These observational results do not identify one universal causal
threshold, but they reject an alarm evaluation limited to annunciation or
sensitivity.

Use the chain

$$
\text{state}\to\text{measurement}\to\text{alarm}
\to\text{delivery}\to\text{receipt}\to\text{acknowledgement}
\to\text{authorized response}\to\text{resolution}.
$$

IEC 60601-1-8 specifies technical alarm-system requirements and priority
conventions. It does not by itself prove that a configured multi-device ward
has adequate responder capacity, meaningful priority, acceptable false-alarm
load, safe suppression, escalation, fallback, or response time.

### 7. Standards-based transport is not semantic interoperability

Prior's early DICOM analysis states the enduring implementation problem:
communication standards cannot ensure multivendor interoperability without
profiles and implementation-specific validation. DICOM PS3.2 edition 2026c
still says DICOM alone does not guarantee interoperability and that specific
equipment must be validated. HL7 lists FHIR R5 5.0.0 as current; the July 2026
R6 ballot is work in progress.

For message $m$ and clinical meaning function $\mu$,

$$
\mu\!\left(\operatorname{decode}_{v_r}
  (\operatorname{encode}_{v_s}(m))\right)=\mu(m)
$$

must hold over sender/receiver versions, profiles, units, codes, identity,
laterality, timestamps, device clocks, scaling, provenance, and workflow state.
Parse success tests syntax. Semantic invariance and safe workflow execution are
separate tests. IEC 80001-1 adds a technical risk-management frame for
connected health systems; it does not make a successful network connection
clinically safe.

### 8. Cybersecurity is coupled to safety and availability

Halperin and colleagues demonstrated privacy, integrity, reprogramming, and
denial-of-service attacks against an implantable cardioverter-defibrillator
using software radio. The device and attack are historical, so no present
product prevalence is inferred. The experiment remains primary evidence that
medical-device cybersecurity can alter physical therapy and energy use.

MDCG 2019-16 revision 1 is non-binding cybersecurity guidance. IEC 81001-5-1
specifies health-software security lifecycle activities, and BSI ManiMed
examined connected pacemakers/ICDs, ventilators, monitors, insulin pumps, and
syringe pumps. The engineering target includes authenticity, integrity,
availability, confidentiality, least privilege, secure update and rollback,
vulnerability handling, component inventory, logging, emergency access, local
interlocks, safe degraded mode, and shared manufacturer/operator/network
responsibility.

German MPBetreibV section 17 is narrower than a universal rule: for specified
MDR class IIb/III software and IVDR class C/D software, it governs installation
and instruction and, when operated in a health institution, appropriate
IT-security reviews at most every two years or earlier when conditions require.
It excludes the stated DiGA/DiPA cases from subsection 1. The exact class,
setting, transition rule, and exception must be checked.

### 9. Clinical/performance evidence and post-market state are distinct

MDR and IVDR separate pre-market clinical or performance evidence from
post-market surveillance, vigilance, trend reporting, corrective action, and
updates to risk and evaluation. MDCG 2025-10 supplies current non-binding PMS
guidance; MDCG 2023-3 revision 2 supplies non-binding vigilance terminology.
As of 2026-05-28, EUDAMED's actor, UDI/device, notified-body/certificate, and
market-surveillance modules were mandatory, while vigilance/PMS and clinical-
investigation/performance-study modules had separate development timelines.
The database rollout must not be assumed complete.

Resnic and colleagues prospectively monitored a device in 73,124 matched
registry cases, detected a vascular-complication signal, and confirmed alerts
in a separate 48,992-case sample. It is evidence that exposure denominators,
comparators, risk adjustment, sequential monitoring, and confirmation can add
information beyond voluntary reports. It does not validate every registry or
erase confounding.

For device version $v$, exposure $E_{v,t}$ device-months, observed events
$N_{v,t}$, and ascertainment $a_{v,t}$,

$$
N_{v,t}\sim\operatorname{Poisson}
\left(a_{v,t}E_{v,t}\lambda_{v,t}\right).
$$

Counts alone confound exposure, reporting, ascertainment, version, lot,
population, site, and time. Preserve scientific validity, analytical
performance, clinical performance, clinical utility, safety, exposure,
complaints, incidents, trend signals, FSCA/FSN, corrective action, and
verified effectiveness as separate fields.

## Reserved central claims

| Claim | Copy-ready bounded statement | Evidence status | Primary routing |
| --- | --- | --- | --- |
| C-1413 | A diagnostic or therapeutic device output is not a pathway outcome; evidence must cross authorization, execution, and verified effect for the whole deployed chain. | established boundary with positive and null RCT examples | Candidates 007/011/012/014 |
| C-1414 | Biomedical signal or image estimates are conditional on body/interface, acquisition, processing, reference pairing, support, and version; an estimate is not latent physiology. | established measurement boundary | Candidates 007/009/014 |
| C-1415 | Offline prosthetic/assistive decoder accuracy is not closed-loop home function, safety, workload, wear, or adoption. | established in scoped home and feedback studies | Candidates 006/012/014 |
| C-1416 | Technical function, training completion, or satisfaction does not establish safe use; representative users, critical tasks, realistic environments, use errors, and recovery must be tested. | established human-factors boundary | Candidates 009/011/012/020 |
| C-1417 | A calibration or verification is dated evidence, not a guarantee against time-, environment-, wear-, intervention-, or update-induced drift. | established metrology/device boundary | Candidates 007/009/014 |
| C-1418 | An alarm is not receipt, acknowledgement, response, or resolution; alarm validity, actionability, workload, queue capacity, escalation, and fallback form one safety chain. | established observational/queue boundary | Candidates 007/011/012/014 |
| C-1419 | Transport and schema conformance do not establish semantic, temporal, unit, identity, provenance, or workflow interoperability. | established standards/implementation boundary | Candidates 014/015 |
| C-1420 | Medical-device cybersecurity is a safety/effectiveness/availability lifecycle property; confidentiality or a penetration-test pass alone is insufficient. | established attack and lifecycle boundary | Candidates 009/011/012/014 |
| C-1421 | Pre-market performance and spontaneous incident counts do not establish current field risk; post-market inference requires exposure, ascertainment, version/lot/time, comparator, and verified corrective action. | established surveillance boundary | Candidates 007/011/014/019 |

## Deduplication and strongest mature nulls

| Proposed content | Existing route and mature null | Disposition |
| --- | --- | --- |
| device pathway closure | clinical-intervention pathway audit; pharmacology exposure/response; state-space control, runtime assurance, queues, workflow logs | C-1413 adds the physical device-chain delivery/effect record; no new candidate |
| biomedical observation operator | C-1387 imaging transport; measurement-heavy audit; metrology audit; calibrated forward/inverse models, state estimation, method comparison | C-1414 is limited to body/interface and reference-pair timing; it does not repeat image-site generalization |
| shared prosthetic control | biomechanics/motor-control audit; HCI audit; passive mechanics, impedance/optimal feedback control, adaptive decoders, shared control | C-1415 adds offline-to-home functional separation; no architecture claim |
| safe use | HCI/human-factors audit; Candidate 009 assurance; IEC usability engineering, task analysis, simulation, error-proofing, training | C-1416 is a device critical-task gate, not a new human-factor principle |
| drift and calibration | metrology and semiconductor-reliability audits; calibration curves, uncertainty budgets, SPC/CUSUM, Kalman filtering, preventive/condition maintenance | C-1417 adds scoped medical decision consequences and German operator hooks |
| alarm chain | nursing/care-continuity audit; Candidates 011/012; signal-quality gates, persistence, priority, queueing, escalation, staffing | C-1418 composes device alarm performance with responder capacity; no alarm novelty claim |
| interoperability | Candidate 015; database/storage and communication audits; DICOM/FHIR profiles, terminology services, conformance testing, contract tests, event sourcing | C-1419 records false common ground across units/identity/time/workflow; no new convention mechanism |
| safety cybersecurity | security/cryptography audit; Candidates 009/012; threat modeling, IAM, signed updates, SBOM, segmentation, monitoring, rollback, incident response | C-1420 adds cyber-physical therapy/fallback coupling; cryptographic mechanisms remain ordinary nulls |
| post-market learning | epidemiology/surveillance and high-reliability audits; Candidates 007/011/019; active registries, denominators, sequential tests, change detection, CAPA | C-1421 adds device version/lot/exposure and FSCA effectiveness; no new surveillance candidate |

No claimed mechanism survives as a new principle or candidate. The strongest
null for every protocol is the complete, correctly implemented mature stack at
equal end-to-end work, latency, energy, operator time, maintenance, and false-
intervention budget. A proposed composition is killed when that stack matches
it.

## Field-coverage disposition

| Requested subfield | Disposition after this audit | Deliberate boundary |
| --- | --- | --- |
| diagnostic devices | directly covered by C-1413/C-1414/C-1421 | no claim that discrimination equals utility |
| therapeutic devices | directly covered by C-1413/C-1420 | whole sensor--controller--actuator chain required |
| signals and imaging | directly covered by C-1414 and deduplicated against C-1387 | modality-specific physics remains future depth |
| prosthetics/assistive control | directly covered by C-1415 | no population-wide inference from narrow implants |
| human factors/usability | directly covered by C-1416/C-1418 | satisfaction is not the safety endpoint |
| calibration/drift | directly covered by C-1417 | no universal interval or error limit asserted |
| alarm fatigue | directly covered by C-1418 | observational associations are not a universal causal coefficient |
| interoperability/cybersecurity | directly covered by C-1419/C-1420 | standards and guidance retain their non-statutory roles |
| clinical performance/PMS | directly covered by C-1421 and C-1413 | no real device incidence estimate is generated |

The field can move from “adjacent evidence only” to “dedicated audit” at the
declared taxonomy resolution once the central field-coverage census is updated
by the coordinating agent. Residual gaps remain implant/material
biocompatibility, sterilization, EMC, radiation protection, rehabilitation
outcomes, laboratory instrumentation breadth, manufacturing validation, and
device-specific particular standards.

## CPU-only synthetic falsification package

### Common frozen contract for all nine protocols

- **Compute:** one CPU process; Python 3.12, NumPy, SciPy, pandas, and
  scikit-learn only; no GPU, cloud service, external model, or network call.
- **Data:** generated arrays and event logs only. No patient data, public
  clinical corpus, pretrained medical model, DICOM study, EHR export, or
  reconstructed individual trace.
- **Replicates:** 100 independent replicates per regime and arm unless a
  protocol states a larger deterministic enumeration. Generator, arm, and
  evaluation streams use NumPy PCG64DXSM with seeds
  $s_g=10{,}000{,}000+C$, $s_a=s_g+10{,}000$, and
  $s_e=s_g+20{,}000$, where $C$ is the numeric claim identifier. Replicate
  $j$ uses seed $s+1{,}000j$.
- **Splits:** generator-support, calibration, tuning, and sealed test regimes
  are disjoint. Test regimes include at least one unseen combination of
  nuisance variables. Thresholds below are frozen before the sealed run.
- **Uncertainty:** report replicate distributions, median, 2.5th/97.5th
  percentiles, and paired BCa bootstrap 95 percent intervals from 2,000
  resamples seeded at $s_e+900{,}000$. Familywise protocol contrasts use Holm
  adjustment at $\alpha=0.05$.
- **Budget equality:** meter CPU-seconds, peak MiB, bytes read/written,
  simulated device energy J, messages, calibration checks, alarms, user
  actions, responder-seconds, and unsafe/false interventions as applicable.
  An arm exceeding a frozen budget by more than 5 percent is ineligible for
  promotion.
- **Artifacts:** each protocol writes
  artifacts/w6-medeng/PXX/manifest.json, generator.json, arms.csv,
  replicates.csv, metrics.csv, thresholds.json, gate.json, plots.svg, and
  sha256.txt. The manifest stores software versions, units, equations, all
  seeds, row counts, regime hashes, and a boolean patient_data=false.
- **Integrity:** sha256.txt covers every other artifact in lexical path order.
  A missing unit, seed, arm, threshold, or hash is a failed run, not a negative
  scientific result.
- **Global promotion gate:** all protocol-specific gates must pass on the
  sealed test set, the lower confidence bound must clear each required
  improvement, every safety/noninferiority bound must hold, and no mature null
  may match the proposed arm at equal complete budget.
- **Global kill gate:** kill on any planted safety violation, data leakage,
  unit/reference ambiguity, patient data, irreproducible seed, missing
  artifact, >5 percent budget overrun, or mature-null tie. A local metric gain
  without its end-to-end endpoint is a kill, not partial promotion.

### Protocol 1 of 9 — P01 / C-1413: output-to-pathway closure

- **Question and claim:** can a device-output gain improve an end-to-end
  diagnostic or therapeutic endpoint after queues, authority, execution, and
  actuator failure, rather than only improving AUC or local latency?
- **Units and equations:** generate $N=50{,}000$ synthetic episodes per
  replicate. Disease/state severity $z\in[0,1]$, score $s\in[0,1]$, report delay
  $T_r$ minutes, authorization delay $T_a$ minutes, action delay $T_x$ minutes,
  delivered dose $d$ mg or zero, and utility $U$ quality-adjusted hours:

  $$
  s=\sigma(3z+\epsilon_s),\quad
  T_x=T_r+T_a+T_q,\quad
  p(o=1)=\sigma(-2+3z-1.4x+0.8x\mathbf{1}[T_x>240]),
  $$

  where $x=1$ only when an authorized command is physically delivered.
- **Generator:** factorially vary prevalence 1--20 percent, score shift
  $[-0.4,0.4]$, queue load 0.5--1.3 utilization, authorization availability
  85--100 percent, actuator delivery failure 0--5 percent, deadline 60--480
  minutes, benefit heterogeneity, and harmful false-action cost. Sealed tests
  combine unseen score shift with overload and actuator failure.
- **Arms:** A no device/usual FIFO; B accuracy-only classifier with FIFO; C
  score-priority queue; D calibrated score plus capacity-aware priority,
  typed authorization, execution receipt, delivery verification, and fallback;
  E oracle state/action upper bound. A--D receive equal scoring and responder
  work; oracle is descriptive only.
- **Frozen execution and seeds:** claim seeds 10,001,413; 10,011,413; and
  10,021,413 plus the common replicate offsets. Freeze arm hyperparameters on
  20 calibration regimes; evaluate 32 sealed regimes.
- **Metrics and thresholds:** AUROC; Brier score; report/authorization/delivery
  latency minutes; authorized-but-undelivered rate per 1,000; false actions per
  1,000; deadline completion; adverse outcomes per 1,000; and net utility
  quality-adjusted hours. D must reduce adverse outcomes by at least 15 percent
  and deadline misses by at least 20 percent versus the best eligible A--C arm,
  with false actions no more than 1.0/1,000 higher and delivery failures no more
  than 0.1/1,000.
- **Artifacts:** common artifacts plus pathway_events.csv with separate score,
  report, authority, command, delivery, fallback, and outcome timestamps; and
  queue_trace.csv in minutes.
- **Promotion gate:** the lower 95 percent bound clears both end-to-end
  improvements in every overload and shift family, safety margins hold, and
  neither AUROC nor local latency is used as a surrogate for outcome.
- **Kill gate:** kill if B or C matches D, if AUROC/report latency improves
  without outcome improvement, if D hides undelivered commands, or if any gain
  requires extra responder-seconds beyond the budget.
- **Patient-data prohibition:** all persons, scores, queues, actions, doses,
  and outcomes are synthetic categorical or numeric draws.

### Protocol 2 of 9 — P02 / C-1414: body/interface-qualified signal estimation

- **Question and claim:** does an observation contract with signal-quality and
  reference-pair support outperform a global calibration when body/interface,
  motion, perfusion, device, and timing vary?
- **Units and equations:** latent arterial saturation $z_t$ percent, sample rate
  100 Hz, reference lag $\delta$ seconds, perfusion index percent, motion
  acceleration g, and wavelength-channel intensity arbitrary units:

  $$
  I_{k,t}=G_k\exp[-(\epsilon_{k,o}c_o+\epsilon_{k,d}c_d)L]
  +m_{k,t}+\eta_{k,t},\qquad
  \hat z_t=f_v(I_{1,t},I_{2,t}),
  $$

  with channel gain $G_k$, path length $L$, attenuation proxy, device version
  $v$, motion $m$, and paired reference $r_{t+\delta}=z_t+\xi_t$.
- **Generator:** 20,000 ten-second episodes per replicate; saturation 70--100
  percent; attenuation proxy 0--1; perfusion 0.1--10 percent; motion 0--2 g;
  contact pressure 2--20 kPa; five device gains; three preprocessing versions;
  lag 0--45 seconds; missing reference 0--30 percent. Hold out high attenuation
  plus low perfusion plus motion and an unseen device/version pair.
- **Arms:** A global linear calibration; B device-specific calibration; C
  robust state-space estimator; D versioned body/interface/reference contract
  with signal-quality gate, lag-aware pairing, abstention, and reacquisition;
  E oracle latent-state support.
- **Frozen execution and seeds:** 10,001,414; 10,011,414; 10,021,414 plus
  offsets. Tune on attenuation $\le0.7$, motion $\le1$ g; sealed evaluation has
  24 regimes.
- **Metrics and thresholds:** bias and MAE in saturation percentage points;
  root-mean-square error; 95th-percentile absolute error; calibration coverage;
  abstention/reacquisition rate; and false-negative occult-hypoxaemia rate at
  true $z<88$ percent with displayed $\hat z\ge92$ percent. D requires
  worst-regime absolute bias $\le1.5$ points, 95th-percentile error $\le4$
  points, coverage 92.5--97.5 percent, and between-support-stratum false-negative
  gap $\le2$ points while returning results for at least 85 percent of episodes.
- **Artifacts:** common artifacts plus waveforms.npz, reference_pairs.csv,
  support_cells.csv, and abstentions.csv, each with explicit units and versions.
- **Promotion gate:** D clears every worst-regime threshold and beats the best
  A--C arm by at least 20 percent in false negatives at equal returned-result
  rate and acquisition work.
- **Kill gate:** kill if results depend on the protected test combination during
  tuning, if race is used as a physical ground-truth variable, if reference lag
  is erased, if abstention merely removes hard cases below the 85 percent floor,
  or if B/C matches D.
- **Patient-data prohibition:** optical channels, physiology, attenuation,
  motion, device labels, and reference values are synthetic.

### Protocol 3 of 9 — P03 / C-1415: offline decoder versus closed-loop prosthetic function

- **Question and claim:** do adaptive/shared control and feedback improve
  functional home-like tasks under socket/electrode drift, rather than only
  offline intent classification?
- **Units and equations:** eight EMG channels mV at 200 Hz, electrode rotation
  degrees, impedance kOhm, joint angle degrees, torque N m, object mass kg,
  task time seconds, energy J, and drop rate per 100 grasps:

  $$
  e_t=R(\rho_t)M_{g_t}+\epsilon_t,\quad
  \hat g_t=\pi(e_{t-w:t}),\quad
  J_t=M(q_t)\ddot q_t+C(q_t,\dot q_t)+\tau_{\rm load}-\tau_{\rm cmd}.
  $$
- **Generator:** 5,000 synthetic task episodes per replicate across six grasp
  intents; rotation 0--45 degrees; impedance 5--100 kOhm; fatigue amplitude loss
  0--40 percent; socket shift 0--15 mm; object mass 0.05--2 kg; friction
  0.1--0.9; fragile-object break threshold 2--20 N; feedback delay 0--300 ms;
  user learning/forgetting state. Sealed tests combine unseen rotation, fatigue,
  fragile objects, and delay.
- **Arms:** A direct control; B fixed offline pattern-recognition decoder; C
  scheduled recalibration; D confidence-gated adaptive decoder plus constrained
  shared control and proportional synthetic feedback; E oracle intent/plant.
  All arms receive equal training minutes and calibration actions.
- **Frozen execution and seeds:** 10,001,415; 10,011,415; 10,021,415 plus
  offsets. Train on rotation $\le20$ degrees and fatigue $\le20$ percent;
  evaluate 30 sealed task/regime cells.
- **Metrics and thresholds:** offline balanced accuracy percent; successful
  grasps percent; drops/100 grasps; breaks/100 fragile grasps; completion time
  seconds; command reversals/task; user-action entropy bits; energy J; and
  calibration minutes/week. D must improve functional success by at least 10
  percentage points versus the best eligible A--C arm, keep excess drops
  $\le0.5/100$, breaks $\le0.1/100$, median time no more than 10 percent worse,
  and calibration time no higher.
- **Artifacts:** common artifacts plus emg_features.npz, plant_trace.csv,
  task_events.csv, adaptation_trace.csv, and functional_frontier.csv.
- **Promotion gate:** lower confidence bound exceeds 10 points for functional
  success across both stable and drift families, safety/noninferiority bounds
  hold, and an offline-accuracy gain is accompanied by task benefit.
- **Kill gate:** kill if offline balanced accuracy rises without functional
  success, if adaptation causes unsafe force/drop tails, if benefits vanish
  after equal training/calibration work, or if scheduled recalibration matches D.
- **Patient-data prohibition:** EMG, intent, limb mechanics, feedback, fatigue,
  objects, user adaptation, and home-like tasks are synthetic.

### Protocol 4 of 9 — P04 / C-1416: critical-task usability under realistic use

- **Question and claim:** can representative critical-task simulation reveal
  and prevent hazardous use errors that technical function, satisfaction, or
  training-completion measures miss?
- **Units and equations:** programmed rate mL/h, concentration mg/mL, intended
  dose mg/h, delivered dose mg, interruption seconds, task time seconds, and
  error severity:

  $$
  d_{\rm intended}=r^\star c^\star,\qquad
  d_{\rm delivered}=\hat r\,\hat c,\qquad
  R_d=\max\!\left(
    \frac{d_{\rm delivered}}{d_{\rm intended}},
    \frac{d_{\rm intended}}{d_{\rm delivered}}
  \right).
  $$
- **Generator:** deterministically enumerate 1,000,000 synthetic sessions from
  novice/expert user states; rates 0.1--999 mL/h; concentrations 0.01--50 mg/mL;
  decimal, unit, library, patient-context, and mode changes; interruptions
  0--120 seconds; alarm acknowledgement; handoff; low light/noise/PPE; depleted
  battery; and emergency stop. Plant device function is identical across arms.
- **Arms:** A legacy menu interface; B legacy interface plus extra training; C
  simplified task-flow interface with unit visibility, constrained ranges,
  independent confirmation for high-severity actions, mode annunciation,
  reversible review, and recovery; D C without error prevention (ablation); E
  oracle correct entry. A--D receive equal practice time and total prompts.
- **Frozen execution and seeds:** deterministic case IDs use mixed-radix
  enumeration starting at 10,001,416; stochastic task-time and interruption
  streams use 10,011,416 and 10,021,416. Freeze the critical-task list and
  severity map before running.
- **Metrics and thresholds:** critical-task completion percent; wrong-mode,
  wrong-unit, wrong-context, and decimal errors per 10,000; $R_d>2$ and
  $R_d>10$ errors; recovery percent within 60 seconds; median and 95th-percentile
  task time; prompts; and NASA-TLX-like synthetic workload 0--100. C requires
  zero $R_d>10$ deliveries in the million sessions, $\le1$ $R_d>2$ delivery per
  100,000, critical-task completion $\ge99.5$ percent, recovery $\ge99$ percent,
  and median time/workload no more than 10 percent above the best eligible arm.
- **Artifacts:** common artifacts plus session_matrix.csv, critical_tasks.csv,
  use_errors.csv, recovery_trace.csv, and severity_map.json.
- **Promotion gate:** C clears all safety and completion thresholds in novice,
  interrupted, and degraded-mode strata and beats training-only B by at least
  50 percent on serious-error rate without extra prompts or time budget.
- **Kill gate:** kill if extra training matches C, if hazards are relabelled as
  user fault, if unrealistic perfect memory is assumed, if a catastrophic
  delivery occurs, or if prevention blocks emergency stop or recovery.
- **Patient-data prohibition:** drug names are neutral tokens and every user,
  order, device state, task, and action is synthetic.

### Protocol 5 of 9 — P05 / C-1417: calibration, drift, and triggered verification

- **Question and claim:** can residual-triggered verification preserve a
  medical measurement and downstream decision under gradual drift, temperature,
  wear, shocks, and interventions more efficiently than one-time or periodic
  calibration?
- **Units and equations:** arterial-pressure-like measurand $x_t$ mmHg, offset
  $b_t$ mmHg, scale drift $\alpha_t$ percent/day, temperature $T_t$ degrees C,
  elapsed time h, and uncertainty $u_t$ mmHg:

  $$
  y_t=(1+\alpha_t)x_t+b_t+\beta_T(T_t-22)+\epsilon_t,
  \quad
  b_{t+1}=b_t+\omega_t+J_t,
  \quad
  h_t=\mathbf{1}[\hat x_t<65].
  $$
- **Generator:** 10,000 device-hours per replicate at one-minute resolution;
  $x_t=40$--180 mmHg; drift 0--0.5 percent/day; offset random walk 0--0.05
  mmHg/$\sqrt{\rm h}$; temperature 15--40 degrees C; wear state 0--1; shock
  jumps 0--20 mmHg; intervention-associated dynamics; reference checks with
  1--3 mmHg standard uncertainty and optional common bias. Sealed tests combine
  slow scale drift and shared reference bias, or abrupt shock and high dynamics.
- **Arms:** A one-time calibration; B fixed 24-hour checks; C CUSUM residual
  trigger; D versioned uncertainty-aware trigger with redundant reference,
  common-cause check, drift quarantine, adjustment/verification separation,
  and abstention; E oracle drift state. B--D have equal maximum 500 reference
  checks/10,000 h.
- **Frozen execution and seeds:** 10,001,417; 10,011,417; 10,021,417 plus
  offsets. Tune trigger thresholds on 12 drift families; seal 20 combinations.
- **Metrics and thresholds:** bias and MAE mmHg; 95 percent interval coverage;
  dangerous threshold disagreements/1,000 h; drift detection sensitivity and
  delay h; false checks/1,000 h; unavailable minutes/1,000 h; and reference
  checks. D requires worst-regime MAE $\le5$ mmHg, absolute bias $\le3$ mmHg,
  coverage 92.5--97.5 percent, at least 95 percent detection before the first
  dangerous disagreement, and at least 20 percent fewer checks than B.
- **Artifacts:** common artifacts plus calibration_ledger.csv,
  drift_truth.csv, reference_checks.csv, decision_disagreements.csv, and
  uncertainty_budget.json.
- **Promotion gate:** D clears every metrological and decision threshold,
  improves pre-hazard detection by at least 15 percentage points over C, and
  uses no more checks or downtime than the equal-budget periodic null.
- **Kill gate:** kill if adjustment is mislabeled calibration, common reference
  bias escapes, intervals are miscalibrated, any threshold gain comes from
  excessive unavailability, or B/C matches D.
- **Patient-data prohibition:** measurements, temperature, interventions,
  references, device histories, and decisions are synthetic time series.

### Protocol 6 of 9 — P06 / C-1418: alarm validity, actionability, and queue closure

- **Question and claim:** can a signal-quality- and queue-aware alarm policy
  reduce nonactionable load and deadline misses without suppressing critical
  events?
- **Units and equations:** alarm arrivals/bed-hour, service time seconds,
  response deadline seconds, $c$ responders, queue utilization $\rho$, and
  event harm units:

  $$
  \lambda=\lambda_A+\lambda_N,\qquad
  \rho=\frac{\lambda E[S]}{c},\qquad
  L_i=T^{\rm resolve}_i-T^{\rm onset}_i.
  $$
- **Generator:** discrete-event simulation of 40 beds for 30 days/replicate;
  five waveform channels at 125 Hz summarized into synthetic quality features;
  actionable event rate 0.01--0.2/bed-hour; artifact bursts; correlated
  multi-device alarms; nonactionable rate 1--60/bed-hour; 2--10 responders;
  service 10--300 seconds; handoff, acknowledgement loss, device/network
  outage, and critical deadlines 30--300 seconds. Sealed tests include
  correlated artifact storms at $\rho>1$ and simultaneous true events.
- **Arms:** A fixed single-channel thresholds; B persistence/hysteresis; C
  multimodal signal-quality gate; D C plus severity priority, queue-aware
  escalation, acknowledgement receipt, alternate route, and resolution check;
  E oracle event/actionability. Equalize responder-seconds and maximum alarm
  displays for A--D.
- **Frozen execution and seeds:** 10,001,418; 10,011,418; 10,021,418 plus
  offsets. Tune on utilization $\le0.85$; seal 24 normal/overload/outage cells.
- **Metrics and thresholds:** critical-event sensitivity; false and
  nonactionable alarms/bed-hour; positive predictive value; median/95th response
  and resolution seconds; deadline misses/1,000 events; acknowledgement loss;
  escalations; responder utilization; and suppressed actionable events. D
  requires critical sensitivity $\ge99$ percent, at least 40 percent fewer
  nonactionable alarms and 25 percent fewer deadline misses than the best
  eligible A--C arm, with suppressed actionable events $\le0.1/1,000$ and
  unchanged responder-seconds.
- **Artifacts:** common artifacts plus alarm_events.csv, queue_trace.csv,
  acknowledgements.csv, escalations.csv, and resolutions.csv.
- **Promotion gate:** D clears sensitivity/suppression floors and both burden
  and deadline improvements in normal, storm, and outage families; improvement
  must persist after equal responder capacity.
- **Kill gate:** kill if performance comes from silencing true events,
  redefining actionability post hoc, an oracle-quality assumption, hidden extra
  staffing, or if C alone matches D.
- **Patient-data prohibition:** beds, physiology, waveform quality, alarms,
  responders, actions, and harms are synthetic events.

### Protocol 7 of 9 — P07 / C-1419: semantic and workflow interoperability

- **Question and claim:** do profile, terminology, unit, time, identity, and
  workflow invariants prevent clinically material corruption that transport or
  schema conformance accepts?
- **Units and equations:** generate $10^6$ messages per replicate containing
  glucose mg/dL or mmol/L, pressure mmHg or kPa, mass kg, timestamps seconds
  since UTC epoch plus offsets, image slope/intercept, laterality, person/device
  identifiers, and workflow state. Require

  $$
  \mu\!\left(D_{v_r}(E_{v_s}(m))\right)=\mu(m),\qquad
  |Q_{\rm canonical}(m)-Q_{\rm canonical}(m')|\le10^{-9}.
  $$
- **Generator:** valid and adversarial messages across three sender and receiver
  versions; unit omission/swaps, decimal factors, code-system collision,
  daylight-saving/local-time ambiguity, clock skew $\pm12$ h, duplicate and
  reused IDs, laterality reversal, DICOM rescale omission, reordered workflow
  events, stale updates, optional fields, and unknown extensions. Plant 10,000
  hazardous cases of each class; hold out compound identity-plus-unit-plus-time
  faults.
- **Arms:** A transport/JSON parse only; B base schema validation; C declared
  DICOM/FHIR-like profile plus terminology; D C plus canonical units, temporal
  constraints, identity/provenance binding, version negotiation, state-machine
  validation, quarantine, and human-readable repair; E semantic oracle.
- **Frozen execution and seeds:** 10,001,419; 10,011,419; 10,021,419 plus
  offsets. Freeze schemas/profiles and transformation maps before compound
  sealed cases.
- **Metrics and thresholds:** transport and parse success; profile conformance;
  exact semantic round trip; undetected unit/time/identity/laterality/scaling
  hazards per million; valid-message delivery; false quarantine; repair
  latency seconds; bytes/message; and CPU microseconds/message. D requires zero
  undetected planted 10x/unit/identity/laterality/scaling hazards in each
  million-message replicate, valid delivery $\ge99.99$ percent, false quarantine
  $\le0.5$ percent, and 95th repair latency $\le30$ seconds.
- **Artifacts:** common artifacts plus messages.jsonl, canonical_values.csv,
  violations.csv, quarantine.csv, repair_log.csv, and profiles.sha256.
- **Promotion gate:** D meets every zero-hazard and availability threshold,
  detects at least 99.99 percent of compound faults, and beats C without more
  than 10 percent CPU/byte overhead.
- **Kill gate:** kill if parse/profile success is reported as interoperability,
  if unknown fields are silently discarded, if valid delivery falls below the
  floor, if repair is unauditable, or if a conventional profile/contract-test
  null matches D.
- **Patient-data prohibition:** all identifiers, measurements, images metadata,
  senders, receivers, and workflow events are synthetic tokens.

### Protocol 8 of 9 — P08 / C-1420: safety-coupled medical-device cybersecurity

- **Question and claim:** can a security lifecycle plus local physical
  interlocks and safe degraded mode resist cyber-physical attacks without
  blocking necessary therapy?
- **Units and equations:** commanded infusion-like rate mL/h, concentration
  mg/mL, delivered dose mg, network latency ms, recovery seconds, battery J, and
  hazard indicator:

  $$
  d_t=r_t c_t\Delta t,\qquad
  H_t=\mathbf{1}[d_t>d_{\max}\ \lor\ d_t<d_{\min}
  \text{ during a critical interval}],
  $$

  with authenticated command epoch $e$, nonce $n$, and local admissible set
  $\mathcal U_{\rm safe}(x_t)$.
- **Generator:** $10^6$ attack traces/arm from spoof, tamper, replay, privilege
  escalation, credential theft, packet drop, delay, DoS, battery-drain query,
  malicious/failed update, rollback, vulnerable dependency, log deletion, and
  emergency-access misuse. Vary rate 0--100 mL/h, critical demand windows,
  offline duration 0--600 seconds, latency 1--5,000 ms, battery 100--10,000 J,
  and correlated network/power loss. Hold out compound stolen-credential plus
  signed-but-unsafe update and emergency demand.
- **Arms:** A perimeter firewall/password; B mutual authentication, least
  privilege, segmentation, and signed update; C B plus versioned component
  inventory, vulnerability/patch workflow, anti-replay/epoch, monitored update
  and rollback; D C plus independent local safety envelope, verified delivery,
  safe degraded/offline therapy, bounded emergency access, and recovery
  rehearsal; E attack oracle. Equalize cryptographic operations, patch labor,
  latency, and energy budgets across mature nulls.
- **Frozen execution and seeds:** 10,001,420; 10,011,420; 10,021,420 plus
  offsets. Freeze threat model, safe set, emergency policy, and update versions
  before sealed compound attacks.
- **Metrics and thresholds:** hazardous commands executed/1,000,000; missed
  critical therapy/100,000 intervals; attack detection; replay/update rejection;
  emergency availability; recovery seconds; lost audit events; latency ms;
  energy J; and patch/vulnerability age days. D requires zero hazardous command
  executions, emergency/critical availability $\ge99.99$ percent, zero silent
  rollback to a known-vulnerable version, 95th recovery $\le60$ seconds,
  cryptographic latency overhead $\le10$ percent, and energy overhead $\le5$
  percent.
- **Artifacts:** common artifacts plus threat_model.json, attack_traces.csv,
  command_receipts.csv, update_ledger.csv, degraded_mode.csv, and recovery.csv.
- **Promotion gate:** D clears all safety, availability, rollback, recovery,
  energy, and latency thresholds across every attack family and beats the
  complete C lifecycle null on compound cyber-physical hazards.
- **Kill gate:** kill on any executed hazardous command, blocked necessary
  therapy above 0.01 percent, silent audit loss, unbounded emergency bypass,
  unsafe fail-open/fail-closed behavior, or a mature lifecycle plus ordinary
  interlock null matching D.
- **Patient-data prohibition:** device, therapy, identities, credentials,
  components, vulnerabilities, attacks, demand, and physical state are
  synthetic.

### Protocol 9 of 9 — P09 / C-1421: denominator- and version-qualified post-market surveillance

- **Question and claim:** can active, exposure-qualified sequential
  surveillance detect planted version/lot risks without confusing market
  growth, reporting stimulation, or confounding with device hazard?
- **Units and equations:** exposure $E_{v\ell st}$ device-months, events
  $N_{v\ell st}$, event rate/1,000 device-months, risk ratio, detection delay
  days, and false alerts/100 device-years:

  $$
  N_{v\ell st}\sim\operatorname{Poisson}
  \left(E_{v\ell st}a_{v\ell st}
  \lambda_0\exp(\beta_v+\gamma_\ell+\theta^\top X_{st})\right).
  $$
- **Generator:** 100 manufacturers/sites, 12 versions, 50 lots/version, and
  36 months; monthly exposure 10--100,000 device-months; baseline event rates
  0.1--20/1,000; risk ratios 1.0--3.0; confounders; switching; channel-specific
  ascertainment 5--100 percent; reporting delays 0--180 days; stimulated-report
  spikes; recall publicity; market growth/decline; version and lot change
  points; missing UDI; and negative-control outcomes. Sealed tests combine a
  reporting spike with no risk and a quiet RR 1.5 risk in one version/subgroup.
- **Arms:** A raw complaint/incident counts; B disproportionality without
  exposure; C exposure-adjusted fixed-window rates; D risk-adjusted active
  sequential monitoring with version/lot/time, alpha spending, negative
  controls, delayed-report correction, confirmation sample, and corrective-
  action effectiveness follow-up; E full-latent oracle.
- **Frozen execution and seeds:** 10,001,421; 10,011,421; 10,021,421 plus
  offsets. Tune on half the versions and historical months; seal versions,
  subgroups, and change points. Use 100 replicates over 40 null/risk regimes.
- **Metrics and thresholds:** sensitivity for RR $\ge1.5$ within 90 days;
  median detection delay days; false alerts/100 device-years; positive
  predictive value; rate-ratio coverage; version/lot localization; alerts from
  reporting spikes; and time to verify corrective-action effect. D requires
  $\ge90$ percent detection within 90 days, $\le1$ false alert/100 device-years,
  95 percent interval coverage 92.5--97.5 percent, $\ge90$ percent correct
  version/lot localization, zero confirmed signals from pure reporting spikes,
  and effectiveness verification within 180 days when a planted correction
  works.
- **Artifacts:** common artifacts plus exposure.csv, incidents.csv,
  reporting_process.csv, sequential_statistics.csv, alerts.csv,
  confirmation.csv, and corrective_action.csv.
- **Promotion gate:** D clears sensitivity, false-alert, coverage,
  localization, reporting-spike, and correction-follow-up thresholds and beats
  C at equal observation and analyst work.
- **Kill gate:** kill if raw counts are interpreted as incidence, future
  exposure leaks into detection, stimulated reporting causes a confirmed alert,
  subgroup localization is post hoc, correction effectiveness is assumed
  rather than tested, or C matches D.
- **Patient-data prohibition:** exposures are aggregate synthetic device-months;
  all sites, versions, lots, covariates, reports, events, and corrections are
  simulated.

## Cross-protocol promotion and rejection

Promotion is conjunctive. A claim can enter the central ledger as a bounded
research statement without promoting any proposed mechanism. A mechanism or
candidate refinement would require:

1. its associated protocol to clear all safety and performance thresholds;
2. all nuisance-support and unseen-combination strata to pass;
3. the complete mature null to lose under equal total work and authority;
4. no dependency on hidden patient data, privileged test support, or oracle
   metadata; and
5. reproducible artifacts and hashes.

Any one of the following kills the proposed composition: a catastrophic
synthetic safety event; a mature-null tie; semantic/unit ambiguity; use of local
accuracy in place of pathway effect; suppression in place of alarm safety;
offline accuracy in place of function; security in place of therapy
availability; calibration in place of drift control; parse success in place of
meaning; or raw incident counts in place of rates.

## Central-ledger integration appendix

The following exactly nine records are formatted for sequential insertion into
research/claims.md. They reserve C-1413 through C-1421 and are integrated there
in this audit wave. New source keys use the W6MDE_ namespace and were checked as
absent from research/references.bib before same-wave integration on 2026-08-24.

### C-1413

- **Statement:** A diagnostic score, image prioritization, control command, or
  other device output is not a clinical pathway outcome. Evidence must
  separately preserve intended purpose, report/message, authorized action,
  physical execution or delivery, verified effect, and patient-relevant
  endpoint for the deployed sensor--processor--user--actuator--fallback chain.
- **Status:** established pathway boundary with a current randomized null for
  local diagnostic prioritization and a positive randomized example for an
  evaluated closed-loop therapeutic system; effects remain device-, pathway-,
  population-, comparator-, and endpoint-specific.
- **Primary sources:** `W6MDE_WoznitzaEtAl2026LungIMPACT`,
  `W6MDE_BrownEtAl2019ClosedLoop`.
- **Rationale:** LungIMPACT improved report timing without improving its CT,
  diagnosis, or treatment timings, while the cited closed-loop insulin trial
  improved time in range for the evaluated integrated system. Together they
  reject both automatic pathway inheritance and a universal anti-device null.
- **Open issue:** compare accuracy-only, priority, queue/capacity, typed
  authority, delivery verification, constrained closed-loop, and fallback arms
  under equal work, latency, false-action, energy, maintenance, and follow-up
  budgets.
- **Used by:** [this audit](2026-08-24-medical-devices-biomedical-engineering.md#1-diagnostic-and-therapeutic-output-must-survive-the-pathway),
  [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  [Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
  [Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1414

- **Statement:** A biomedical signal or image-derived estimate is conditional
  on the body/specimen and interface, acquisition geometry/protocol,
  signal-quality state, device and processing version, reference method and
  pairing time, environment, and population support; the estimate is not the
  latent physiological or pathological state.
- **Status:** established measurement boundary in the cited pulse-oximetry
  studies; magnitudes do not transfer automatically across device, body site,
  pigmentation measure, perfusion, motion, condition, reference, or population.
- **Primary sources:** `W6MDE_BicklerEtAl2005PulseOximetry`,
  `W6MDE_SjodingEtAl2020PulseOximetry`.
- **Rationale:** the cited controlled and paired clinical studies demonstrate
  device/body/reference-dependent disagreement and clinically material occult
  hypoxaemia patterns. They do not justify race as a biological calibration
  constant or one correction for all oximeters.
- **Open issue:** test forward/operator models, device-specific calibration,
  state estimation, signal-quality gating, lag-aware reference pairing,
  subgroup/worst-support error, abstention, and reacquisition under unseen
  nuisance combinations and decision costs.
- **Used by:** [this audit](2026-08-24-medical-devices-biomedical-engineering.md#2-biomedical-signals-and-images-are-operator-qualified-observations),
  [C-1387](../claims.md#c-1387),
  [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1415

- **Statement:** Offline prosthetic or assistive decoder accuracy does not
  establish closed-loop function, safety, effort, wear, comfort, adoption, or
  home transfer; evaluation must include user--device co-adaptation,
  socket/electrode and mechanical state, feedback, task/environment, workload,
  failure recovery, and functional endpoints.
- **Status:** established scoped home-use boundary with narrow experimental
  support for feedback; general effect sizes remain device-, impairment-,
  interface-, training-, task-, environment-, and horizon-specific.
- **Primary sources:** `W6MDE_SimonEtAl2023Prosthesis`,
  `W6MDE_ClementeEtAl2019SensoryFeedback`.
- **Rationale:** the randomized-order home study reported high offline
  calibration accuracy but mixed functional outcomes, while the intraneural
  feedback study supports a possible functional contribution in a narrow
  setting rather than universal benefit.
- **Open issue:** compare direct control, fixed and adaptive decoders, scheduled
  recalibration, feedback, shared control, and safety constraints under
  electrode rotation, impedance, socket shift, fatigue, object dynamics,
  feedback delay, equal training, and long-horizon wear.
- **Used by:** [this audit](2026-08-24-medical-devices-biomedical-engineering.md#3-prosthetic-decoder-accuracy-is-not-closed-loop-assistive-function),
  [Candidate 006](../../experiments/candidates/006-reversible-physical-skill.md),
  [Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1416

- **Statement:** Technical function, standards conformance, training completion,
  or satisfaction does not establish safe medical-device use. Representative
  intended users must perform safety-critical tasks in realistic use scenarios
  and environments, with modes, interruptions, alarms, foreseeable use errors,
  recovery, and residual risk observed separately.
- **Status:** established human-factors and use-related-risk boundary; error
  frequencies remain interface-, task-, user-, training-, environment-, and
  study-design-specific.
- **Primary sources:** `W6MDE_GarmerEtAl2002InfusionUsability`,
  `W6MDE_IEC62366_1_2015A1_2020`, `EU2017MDR`.
- **Rationale:** the cited infusion-pump study found faster and less problematic
  use with a redesigned interface while errors remained. IEC usability
  engineering supplies technical process and MDR supplies applicable legal
  safety framing; neither is itself clinical outcome evidence.
- **Open issue:** preregister critical tasks and severity; test novices and
  experts, high-risk modes, unit/decimal/context errors, interruptions,
  degraded states, handoff, emergency actions, and recovery under equal
  training, prompt, and time budgets.
- **Used by:** [this audit](2026-08-24-medical-devices-biomedical-engineering.md#4-human-factors-is-a-safety-property-of-use-not-satisfaction),
  [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
  [Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md),
  [Candidate 020](../../experiments/candidates/020-constitutional-control-plane.md).

### C-1417

- **Statement:** Calibration, adjustment, verification, and validation are
  different records, and any calibration is dated evidence rather than a
  guarantee against drift. Ongoing validity requires the measurand, unit,
  range, reference and uncertainty, environment, use/wear and intervention
  history, version, drift detection, triggered checks, and downstream decision
  sensitivity.
- **Status:** established metrology/device boundary with a scoped continuous
  blood-pressure example; drift rate and acceptable error remain device-,
  measurand-, reference-, environment-, use-, and decision-specific.
- **Primary sources:** `W6MDE_LakhalEtAl2016CNAP`,
  `W6MDE_ISO14971_2019`, `W6MDE_DE_MPBetreibV2025`.
- **Rationale:** the cited device evaluation observed time-dependent
  disagreement before recalibration. ISO risk management is technical practice,
  while German MPBetreibV section 15 creates binding metrological-control duties
  only for its listed products and conditions.
- **Open issue:** compare one-time, periodic, residual-triggered, redundant-
  reference, common-cause, uncertainty-aware, quarantine, and abstention arms
  under gradual drift, shocks, temperature, wear, intervention dynamics,
  reference bias, check cost, downtime, and clinical threshold errors.
- **Used by:** [this audit](2026-08-24-medical-devices-biomedical-engineering.md#5-calibration-is-dated-evidence-drift-is-a-lifecycle-process),
  [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1418

- **Statement:** A medical-device alarm is not equivalent to a valid event,
  actionable priority, successful delivery, receipt, acknowledgement,
  authorized response, or resolution. Alarm safety is an end-to-end property of
  signal quality, configuration, nonactionable load, responder queue/capacity,
  escalation, fallback, and verified closure.
- **Status:** established observational alarm-burden and response-time boundary;
  causal coefficients and safe configurations remain device-, unit-, patient-
  mix-, staffing-, workflow-, and endpoint-specific.
- **Primary sources:** `W6MDE_DrewEtAl2014AlarmFatigue`,
  `W6MDE_BonafideEtAl2015AlarmResponse`,
  `W6MDE_IEC60601_1_8_2006A2_2020`.
- **Rationale:** the cited ICU and children's-hospital studies document large
  alarm burdens, high nonactionable fractions, and slower response after recent
  nonactionable alarms. IEC 60601-1-8 supplies technical alarm requirements,
  not proof of configured ward response.
- **Open issue:** compare threshold, persistence, hysteresis, multimodal
  signal-quality, priority, queue-aware escalation, acknowledgement receipt,
  alternate routing, and resolution verification under equal responder time
  and planted correlated alarm storms.
- **Used by:** [this audit](2026-08-24-medical-devices-biomedical-engineering.md#6-alarm-performance-includes-a-human-response-queue),
  [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  [Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
  [Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1419

- **Statement:** Successful medical-data transport, parsing, schema validation,
  or a standards label does not establish semantic, unit, temporal, identity,
  laterality, scaling, provenance, version, or workflow interoperability;
  required meaning and safe state transitions must survive profile-specific
  multivendor validation and repair.
- **Status:** established standards/implementation boundary from original DICOM
  work through current DICOM conformance text; exact failures remain profile-,
  product-, version-, network-, terminology-, and workflow-specific.
- **Primary sources:** `W6MDE_Prior1993DICOM`, `W6MDE_DICOM2026c`,
  `W6MDE_HL7FHIR_R5`, `W6MDE_IEC80001_1_2021`.
- **Rationale:** Prior stated that a communication standard cannot ensure
  multivendor interoperability, and DICOM PS3.2 2026c retains an explicit
  non-guarantee plus specific-equipment validation responsibility. FHIR R5 is
  current while R6 ballot5 is draft.
- **Open issue:** test transport, base schemas, profiles, terminology, canonical
  units, identity/provenance binding, clocks, image scaling, state machines,
  quarantine, and auditable repair across version skew and compound faults.
- **Used by:** [this audit](2026-08-24-medical-devices-biomedical-engineering.md#7-standards-based-transport-is-not-semantic-interoperability),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md),
  [Candidate 015](../../experiments/candidates/015-versioned-repairable-conventions.md).

### C-1420

- **Statement:** Medical-device cybersecurity is a lifecycle property coupled
  to safety, effectiveness, and availability. Confidentiality, authentication,
  a vulnerability scan, or a penetration-test pass alone does not establish
  least privilege, integrity, anti-replay, secure update/rollback,
  vulnerability response, emergency access, local interlocks, safe degraded
  therapy, recovery, or manufacturer--operator--network responsibility.
- **Status:** established cyber-physical attack and lifecycle boundary; no
  current prevalence or vulnerability claim is made for an untested product.
- **Primary sources:** `W6MDE_HalperinEtAl2008ICD`,
  `W6MDE_MDCG2019_16r1`, `W6MDE_IEC81001_5_1_2021`,
  `W6MDE_BSI_ManiMed`, `W6MDE_DE_MPBetreibV2025`.
- **Rationale:** the primary experiment demonstrated privacy, integrity,
  reprogramming, and availability attacks against a historical ICD. The
  remaining sources provide non-binding guidance, technical lifecycle practice,
  authoritative German technical evidence, and a narrowly scoped German
  operator duty rather than product effectiveness proof.
- **Open issue:** compare mature authenticated/segmented/update-managed stacks
  with safety-envelope, verified-delivery, offline/degraded, emergency-access,
  rollback, component-inventory, disclosure, and rehearsed-recovery
  compositions under compound attacks and equal latency, energy, and labor.
- **Used by:** [this audit](2026-08-24-medical-devices-biomedical-engineering.md#8-cybersecurity-is-coupled-to-safety-and-availability),
  [Candidate 009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
  [Candidate 012](../../experiments/candidates/012-latency-qualified-authority.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1421

- **Statement:** Scientific validity, analytical performance, clinical
  performance, clinical utility, safety, and current post-market state are
  separate evidence axes. Complaint or incident counts cannot estimate field
  incidence without exposure and ascertainment; surveillance must preserve
  device/version/lot, population/site/time, denominator, reporting process,
  comparator, sequential error control, confirmation, corrective action, and
  verified effectiveness.
- **Status:** established regulatory/surveillance boundary with a successful
  scoped active-registry demonstration; validity remains data-source-,
  confounding-, endpoint-, device-, comparator-, and reporting-process-specific.
- **Primary sources:** `W6MDE_ResnicEtAl2017Surveillance`,
  `EU2017MDR`, `EU2017IVDR`, `W6MDE_MDCG2025_10`,
  `W6MDE_MDCG2023_3r2`, `W6MDE_BfArM_FSCA`.
- **Rationale:** the registry study detected and independently confirmed a
  device safety signal using denominators, a comparator, adjustment, and
  prospective monitoring. Binding EU PMS duties, non-binding guidance, and
  German FSCA information retain distinct normative and evidentiary roles.
- **Open issue:** compare raw counts, disproportionality, exposure-adjusted
  rates, risk-adjusted sequential monitoring, delayed-report correction,
  negative controls, version/lot localization, independent confirmation, and
  corrective-action verification under market and reporting shifts.
- **Used by:** [this audit](2026-08-24-medical-devices-biomedical-engineering.md#9-clinicalperformance-evidence-and-post-market-state-are-distinct),
  [Candidate 007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  [Candidate 011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
  [Candidate 014](../../experiments/candidates/014-versioned-observation-contract.md),
  [Candidate 019](../../experiments/candidates/019-audited-cumulative-inheritance.md).

## Source inventory

### Primary scientific and engineering evidence (13)

| Audit key | Design/type | Evidence role and retained boundary |
| --- | --- | --- |
| W6MDE_WoznitzaEtAl2026LungIMPACT | multicentre randomized trial | local imaging-priority latency versus later diagnostic/treatment outcomes |
| W6MDE_BrownEtAl2019ClosedLoop | multicentre randomized trial | evaluated whole closed-loop insulin system and time in range |
| W6MDE_BicklerEtAl2005PulseOximetry | controlled human device study | pigmentation/support and low-saturation oximeter accuracy |
| W6MDE_SjodingEtAl2020PulseOximetry | paired retrospective clinical measurement study | occult hypoxaemia disagreement across studied groups |
| W6MDE_SimonEtAl2023Prosthesis | randomized-order home-use trial | offline decoder accuracy versus functional home endpoints |
| W6MDE_ClementeEtAl2019SensoryFeedback | narrow experimental prosthesis study | possible functional contribution of intraneural feedback |
| W6MDE_GarmerEtAl2002InfusionUsability | comparative usability test | interface redesign improved use but did not erase errors |
| W6MDE_LakhalEtAl2016CNAP | prospective method/device comparison | continuous pressure disagreement and time-dependent drift |
| W6MDE_DrewEtAl2014AlarmFatigue | consecutive ICU observational study | physiologic-monitor alarm burden and validity/actionability |
| W6MDE_BonafideEtAl2015AlarmResponse | direct-observation study | nonactionable exposure and alarm-response time association |
| W6MDE_Prior1993DICOM | original interoperability engineering paper | standard/profile distinction and multivendor validation |
| W6MDE_HalperinEtAl2008ICD | experimental security paper | privacy, integrity, reprogramming, availability, and physical coupling |
| W6MDE_ResnicEtAl2017Surveillance | prospective active registry surveillance | denominator/comparator/sequential alert and independent confirmation |

### Official, guidance, and technical sources (32 roles; 26 new keys and 6 reused)

| Key | Issuer | Role retained |
| --- | --- | --- |
| EU2017MDR | EU legislature | binding MDR when scoped |
| EU2017IVDR | EU legislature | binding IVDR when scoped |
| EU2016GDPR | EU legislature | binding personal-data law when scoped |
| EU2024AIActConsolidated2026 | EU legislature | current consolidated AI Act and staged dates |
| EU2026AIActAmendment | EU legislature | binding 2026 amendment |
| EMA2024CompanionDiagnostics | EMA | companion-diagnostic procedural guidance only |
| W6MDE_EC_MDCGGuidance2026 | European Commission portal | current list and express non-binding status of MDCG guidance |
| W6MDE_MDCG2025_6 | AIB/MDCG | non-binding MDR/IVDR--AI Act interplay |
| W6MDE_MDCG2019_16r1 | MDCG | non-binding medical-device cybersecurity guidance |
| W6MDE_MDCG2025_10 | MDCG | non-binding PMS guidance |
| W6MDE_MDCG2023_3r2 | MDCG | non-binding vigilance terminology/Q&A |
| W6MDE_MDCG2020_1 | MDCG | non-binding clinical/performance evaluation of medical-device software |
| W6MDE_MDCG2019_11r1 | MDCG | non-binding software qualification/classification guidance |
| W6MDE_EC_EUDAMED2026 | European Commission | four-module mandatory-use status from 2026-05-28 |
| W6MDE_EU_HS_MDR_2021_1182_2026 | European Commission/EUR-Lex | MDR OJ harmonized list consolidated 2026-06-17 |
| W6MDE_EU_HS_IVDR_2021_1195_2026 | European Commission/EUR-Lex | IVDR OJ harmonized list consolidated 2026-06-17 |
| W5CSB_DE_MPDG_2024 | German legislature | binding German implementing law; reused repository key |
| W6MDE_DE_MPBetreibV2025 | German Federal Government | binding scoped German operator duties |
| W6MDE_BfArM_RiskTasks | BfArM | authoritative risk-evaluation task description |
| W6MDE_BfArM_FSCA | BfArM | manufacturer FSN/FSCA administrative information |
| W6MDE_BSI_ManiMed | BSI | authoritative technical security study |
| W6MDE_ISO14971_2019 | ISO | current international risk-management standard; EN/A11 OJ status checked separately |
| W6MDE_ISO13485_2016 | ISO | current international QMS standard; EN/A11 OJ status checked separately |
| W6MDE_IEC62304_2006A1_2015 | IEC | software lifecycle technical standard |
| W6MDE_IEC62366_1_2015A1_2020 | IEC | usability-engineering technical standard |
| W6MDE_IEC60601_1_8_2006A2_2020 | IEC | alarm-system technical standard |
| W6MDE_IEC80001_1_2021 | IEC | connected health-system risk technical standard |
| W6MDE_IEC81001_5_1_2021 | IEC | health-software security lifecycle technical standard |
| W6MDE_ISO14155_2026 | ISO | current international clinical-investigation edition, not automatically the OJ-listed edition |
| W6MDE_ISO20916_2019 | ISO | current IVD performance-study international standard; EN 2024 citation checked separately |
| W6MDE_DICOM2026c | DICOM/NEMA | current medical-imaging specification and non-guarantee |
| W6MDE_HL7FHIR_R5 | HL7 | current published FHIR R5; R6 ballot excluded as stable source |

## Reused bibliography keys

The following seven keys already existed in research/references.bib and are reused
without duplicate BibTeX:

- EU2017MDR
- EU2017IVDR
- EU2016GDPR
- EU2024AIActConsolidated2026
- EU2026AIActAmendment
- EMA2024CompanionDiagnostics
- W5CSB_DE_MPDG_2024

## Copy-ready BibTeX for absent keys

The 38 records below were checked by key and identifying title/DOI as absent
from research/references.bib before integration. This same audit wave appends
those records to the central bibliography.

    @article{W6MDE_WoznitzaEtAl2026LungIMPACT,
      author = {Woznitza, Nick and Smith, Lesley and Rawlinson, Janette and Au-Yong, Iain and George, Bindu and Djearaman, Madava G. and Nair, Arjun and Lee, Richard W. and Navani, Neal and Ndwandwe, Siyabonga and Clarke, Caroline S. and Creeden, Andrew and Newsome, Josh and Das, Indrajeet and Abaokporo, Sylvia and Tucker, Richard and Hathorn, James and Baldwin, David R.},
      title = {{AI}-Based Chest {X}-Ray Prioritization in the Lung Cancer Diagnostic Pathway: The {LungIMPACT} Randomized Controlled Trial},
      journal = {Nature Medicine},
      year = {2026},
      volume = {32},
      number = {5},
      pages = {1737--1744},
      doi = {10.1038/s41591-026-04253-5},
      url = {https://doi.org/10.1038/s41591-026-04253-5},
      urldate = {2026-08-24}
    }

    @article{W6MDE_BrownEtAl2019ClosedLoop,
      author = {Brown, Sue A. and Kovatchev, Boris P. and Raghinaru, Dan and Lum, John W. and Buckingham, Bruce A. and Kudva, Yogish C. and Laffel, Lori M. and Levy, Carol J. and Pinsker, Jordan E. and Wadwa, R. Paul and Dassau, Eyal and Doyle, Francis J. and Anderson, Stacey M. and Church, Mei Mei and Dadlani, Vikash and Ekhlaspour, Laya and Forlenza, Gregory P. and Isganaitis, Elvira and Lam, David W. and Kollman, Craig and Beck, Roy W.},
      title = {Six-Month Randomized, Multicenter Trial of Closed-Loop Control in Type 1 Diabetes},
      journal = {New England Journal of Medicine},
      year = {2019},
      volume = {381},
      number = {18},
      pages = {1707--1717},
      doi = {10.1056/NEJMoa1907863},
      url = {https://doi.org/10.1056/NEJMoa1907863},
      urldate = {2026-08-24}
    }

    @article{W6MDE_BicklerEtAl2005PulseOximetry,
      author = {Bickler, Philip E. and Feiner, John R. and Severinghaus, John W.},
      title = {Effects of Skin Pigmentation on Pulse Oximeter Accuracy at Low Saturation},
      journal = {Anesthesiology},
      year = {2005},
      volume = {102},
      number = {4},
      pages = {715--719},
      doi = {10.1097/00000542-200504000-00004},
      url = {https://doi.org/10.1097/00000542-200504000-00004},
      urldate = {2026-08-24}
    }

    @article{W6MDE_SjodingEtAl2020PulseOximetry,
      author = {Sjoding, Michael W. and Dickson, Robert P. and Iwashyna, Theodore J. and Gay, Steven E. and Valley, Thomas S.},
      title = {Racial Bias in Pulse Oximetry Measurement},
      journal = {New England Journal of Medicine},
      year = {2020},
      volume = {383},
      number = {25},
      pages = {2477--2478},
      doi = {10.1056/NEJMc2029240},
      url = {https://doi.org/10.1056/NEJMc2029240},
      urldate = {2026-08-24},
      note = {Letter; corrected in 2021}
    }

    @article{W6MDE_SimonEtAl2023Prosthesis,
      author = {Simon, Ann M. and Turner, Kristi L. and Miller, Laura A. and Potter, Benjamin K. and Beachler, Mark D. and Dumanian, Gregory A. and Hargrove, Levi J. and Kuiken, Todd A.},
      title = {User Performance With a Transradial Multi-Articulating Hand Prosthesis During Pattern Recognition and Direct Control Home Use},
      journal = {IEEE Transactions on Neural Systems and Rehabilitation Engineering},
      year = {2023},
      volume = {31},
      pages = {271--281},
      doi = {10.1109/TNSRE.2022.3221558},
      url = {https://doi.org/10.1109/TNSRE.2022.3221558},
      urldate = {2026-08-24}
    }

    @article{W6MDE_ClementeEtAl2019SensoryFeedback,
      author = {Clemente, Francesco and Valle, Giacomo and Controzzi, Marco and Strauss, Ivo and Iberite, Francesco and Stieglitz, Thomas and Granata, Giuseppe and Rossini, Paolo M. and Petrini, Francesco and Micera, Silvestro and Cipriani, Christian},
      title = {Intraneural Sensory Feedback Restores Grip Force Control and Motor Coordination While Using a Prosthetic Hand},
      journal = {Journal of Neural Engineering},
      year = {2019},
      volume = {16},
      number = {2},
      pages = {026034},
      doi = {10.1088/1741-2552/ab059b},
      url = {https://doi.org/10.1088/1741-2552/ab059b},
      urldate = {2026-08-24}
    }

    @article{W6MDE_GarmerEtAl2002InfusionUsability,
      author = {Garmer, Karin and Liljegren, Erik and Osvalder, Anna-Lisa and Dahlman, Sven},
      title = {Application of Usability Testing to the Development of Medical Equipment: Usability Testing of a Frequently Used Infusion Pump and a New User Interface for an Infusion Pump Developed with a Human Factors Approach},
      journal = {International Journal of Industrial Ergonomics},
      year = {2002},
      volume = {29},
      number = {3},
      pages = {145--159},
      doi = {10.1016/S0169-8141(01)00060-9},
      url = {https://doi.org/10.1016/S0169-8141(01)00060-9},
      urldate = {2026-08-24}
    }

    @article{W6MDE_LakhalEtAl2016CNAP,
      author = {Lakhal, Karim and Martin, Maelle and Faiz, Sofian and Ehrmann, Stephan and Blanloeil, Yvonnick and Asehnoune, Karim and Rozec, Bertrand and Boulain, Thierry},
      title = {The {CNAP} Finger Cuff for Noninvasive Beat-to-Beat Monitoring of Arterial Blood Pressure: An Evaluation in Intensive Care Unit Patients and a Comparison with Two Intermittent Devices},
      journal = {Anesthesia and Analgesia},
      year = {2016},
      volume = {123},
      number = {5},
      pages = {1126--1135},
      doi = {10.1213/ANE.0000000000001324},
      url = {https://doi.org/10.1213/ANE.0000000000001324},
      urldate = {2026-08-24}
    }

    @article{W6MDE_DrewEtAl2014AlarmFatigue,
      author = {Drew, Barbara J. and Harris, Patricia and Zegre-Hemsey, Jessica K. and Mammone, Tina and Schindler, Daniel and Salas-Boni, Rebeca and Bai, Yong and Tinoco, Adelita and Ding, Quan and Hu, Xiao},
      title = {Insights into the Problem of Alarm Fatigue with Physiologic Monitor Devices: A Comprehensive Observational Study of Consecutive Intensive Care Unit Patients},
      journal = {PLOS ONE},
      year = {2014},
      volume = {9},
      number = {10},
      pages = {e110274},
      doi = {10.1371/journal.pone.0110274},
      url = {https://doi.org/10.1371/journal.pone.0110274},
      urldate = {2026-08-24}
    }

    @article{W6MDE_BonafideEtAl2015AlarmResponse,
      author = {Bonafide, Christopher P. and Lin, Richard and Zander, Miriam and Graham, Christian Sarkis and Paine, Christine W. and Rock, Whitney and Rich, Andrew and Roberts, Kathryn E. and Fortino, Margaret and Nadkarni, Vinay M. and Localio, A. Russell and Keren, Ron},
      title = {Association between Exposure to Nonactionable Physiologic Monitor Alarms and Response Time in a Children's Hospital},
      journal = {Journal of Hospital Medicine},
      year = {2015},
      volume = {10},
      number = {6},
      pages = {345--351},
      doi = {10.1002/jhm.2331},
      url = {https://doi.org/10.1002/jhm.2331},
      urldate = {2026-08-24}
    }

    @article{W6MDE_Prior1993DICOM,
      author = {Prior, Fred W.},
      title = {Specifying {DICOM} Compliance for Modality Interfaces},
      journal = {RadioGraphics},
      year = {1993},
      volume = {13},
      number = {6},
      pages = {1381--1388},
      doi = {10.1148/radiographics.13.6.8290731},
      url = {https://doi.org/10.1148/radiographics.13.6.8290731},
      urldate = {2026-08-24}
    }

    @inproceedings{W6MDE_HalperinEtAl2008ICD,
      author = {Halperin, Daniel and Heydt-Benjamin, Thomas S. and Ransford, Benjamin and Clark, Shane S. and Defend, Benessa and Morgan, Will and Fu, Kevin and Kohno, Tadayoshi and Maisel, William H.},
      title = {Pacemakers and Implantable Cardiac Defibrillators: Software Radio Attacks and Zero-Power Defenses},
      booktitle = {2008 IEEE Symposium on Security and Privacy},
      year = {2008},
      pages = {129--142},
      publisher = {IEEE},
      doi = {10.1109/SP.2008.31},
      url = {https://doi.org/10.1109/SP.2008.31},
      urldate = {2026-08-24}
    }

    @article{W6MDE_ResnicEtAl2017Surveillance,
      author = {Resnic, Frederic S. and Majithia, Arjun and Marinac-Dabic, Danica and Robbins, Susan and Ssemaganda, Henry and Hewitt, Kathleen and Ponirakis, Angelo and Loyo-Berrios, Nilsa and Moussa, Issam and Drozda, Joseph and Normand, Sharon-Lise and Matheny, Michael E.},
      title = {Registry-Based Prospective, Active Surveillance of Medical-Device Safety},
      journal = {New England Journal of Medicine},
      year = {2017},
      volume = {376},
      number = {6},
      pages = {526--535},
      doi = {10.1056/NEJMoa1516333},
      url = {https://doi.org/10.1056/NEJMoa1516333},
      urldate = {2026-08-24}
    }

    @misc{W6MDE_EC_MDCGGuidance2026,
      author = {{European Commission, Directorate-General for Health and Food Safety}},
      title = {Guidance: {MDCG}-Endorsed Documents and Other Guidance},
      year = {2026},
      note = {Official current index; states that listed MDCG documents are not legally binding},
      url = {https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en},
      urldate = {2026-08-24}
    }

    @techreport{W6MDE_MDCG2025_6,
      author = {{Artificial Intelligence Board and Medical Device Coordination Group}},
      title = {{AIB} 2025-1 / {MDCG} 2025-6: Interplay between the Medical Devices Regulation, In Vitro Diagnostic Medical Devices Regulation and the Artificial Intelligence Act},
      institution = {European Commission Medical Devices Sector},
      year = {2025},
      month = jun,
      note = {Non-binding joint guidance},
      url = {https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en?filename=mdcg_2025-6_en.pdf},
      urldate = {2026-08-24}
    }

    @techreport{W6MDE_MDCG2019_16r1,
      author = {{Medical Device Coordination Group}},
      title = {{MDCG} 2019-16 Revision 1: Guidance on Cybersecurity for Medical Devices},
      institution = {European Commission Medical Devices Sector},
      year = {2020},
      month = jul,
      note = {Non-binding guidance},
      url = {https://health.ec.europa.eu/system/files/2022-01/md_cybersecurity_en.pdf},
      urldate = {2026-08-24}
    }

    @techreport{W6MDE_MDCG2025_10,
      author = {{Medical Device Coordination Group}},
      title = {{MDCG} 2025-10: Guidance on Post-Market Surveillance of Medical Devices and In Vitro Diagnostic Medical Devices},
      institution = {European Commission Medical Devices Sector},
      year = {2025},
      month = dec,
      note = {Non-binding guidance published 19 December 2025},
      url = {https://health.ec.europa.eu/latest-updates/mdcg-2025-10-guidance-post-market-surveillance-medical-devices-and-vitro-diagnostic-medical-devices-2025-12-19_en},
      urldate = {2026-08-24}
    }

    @techreport{W6MDE_MDCG2023_3r2,
      author = {{Medical Device Coordination Group}},
      title = {{MDCG} 2023-3 Revision 2: Questions and Answers on Vigilance Terms and Concepts under Regulations 2017/745 and 2017/746},
      institution = {European Commission Medical Devices Sector},
      year = {2025},
      month = jan,
      note = {Non-binding guidance, second revision},
      url = {https://health.ec.europa.eu/document/download/af1433fd-ed64-4c53-abc7-612a7f16f976_en?filename=mdcg_2023-3_en.pdf},
      urldate = {2026-08-24}
    }

    @techreport{W6MDE_MDCG2020_1,
      author = {{Medical Device Coordination Group}},
      title = {{MDCG} 2020-1: Guidance on Clinical Evaluation under the {MDR} and Performance Evaluation under the {IVDR} of Medical Device Software},
      institution = {European Commission Medical Devices Sector},
      year = {2020},
      month = mar,
      note = {Non-binding guidance},
      url = {https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en},
      urldate = {2026-08-24}
    }

    @techreport{W6MDE_MDCG2019_11r1,
      author = {{Medical Device Coordination Group}},
      title = {{MDCG} 2019-11 Revision 1: Guidance on Qualification and Classification of Software under Regulations 2017/745 and 2017/746},
      institution = {European Commission Medical Devices Sector},
      year = {2025},
      month = jun,
      note = {Non-binding guidance},
      url = {https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf},
      urldate = {2026-08-24}
    }

    @misc{W6MDE_EC_EUDAMED2026,
      author = {{European Commission, Directorate-General for Health and Food Safety}},
      title = {The {EUDAMED} Four First Modules Will Be Mandatory to Use as from 28 May 2026},
      year = {2025},
      month = nov,
      note = {Official implementation notice; actor, UDI/device, notified bodies and certificates, and market-surveillance modules},
      url = {https://health.ec.europa.eu/latest-updates/eudamed-four-first-modules-will-be-mandatory-use-28-may-2026-2025-11-27_en},
      urldate = {2026-08-24}
    }

    @misc{W6MDE_EU_HS_MDR_2021_1182_2026,
      author = {{European Commission}},
      title = {Commission Implementing Decision ({EU}) 2021/1182 on Harmonised Standards for Medical Devices, Consolidated Text of 17 June 2026},
      year = {2026},
      note = {Official Journal reference list supporting Regulation (EU) 2017/745; consolidated text is a documentation tool},
      url = {https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02021D1182-20260617},
      urldate = {2026-08-24}
    }

    @misc{W6MDE_EU_HS_IVDR_2021_1195_2026,
      author = {{European Commission}},
      title = {Commission Implementing Decision ({EU}) 2021/1195 on Harmonised Standards for In Vitro Diagnostic Medical Devices, Consolidated Text of 17 June 2026},
      year = {2026},
      note = {Official Journal reference list supporting Regulation (EU) 2017/746; consolidated text is a documentation tool},
      url = {https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02021D1195-20260617},
      urldate = {2026-08-24}
    }

    @misc{W6MDE_DE_MPBetreibV2025,
      author = {{Federal Republic of Germany}},
      title = {Medizinprodukte-Betreiberverordnung ({MPBetreibV})},
      year = {2025},
      note = {Binding German ordinance issued 14 February 2025 and last amended 31 October 2025},
      url = {https://www.gesetze-im-internet.de/mpbetreibv_2025/},
      urldate = {2026-08-24}
    }

    @misc{W6MDE_BfArM_RiskTasks,
      author = {{Bundesinstitut fuer Arzneimittel und Medizinprodukte}},
      title = {Aufgaben des {BfArM}: Medizinprodukte},
      year = {2026},
      note = {Official description of central collection, evaluation and assessment of medical-device risks and coordination of measures},
      url = {https://www.bfarm.de/DE/Das-BfArM/Aufgaben/_artikel.html?nn=774838},
      urldate = {2026-08-24}
    }

    @misc{W6MDE_BfArM_FSCA,
      author = {{Bundesinstitut fuer Arzneimittel und Medizinprodukte}},
      title = {Massnahmen von Herstellern: Sicherheitsanweisungen und Sicherheitskorrekturmassnahmen im Feld},
      year = {2026},
      note = {Official German portal publishing manufacturer field safety notices; manufacturers remain responsible for notice content},
      url = {https://www.bfarm.de/DE/Medizinprodukte/Aufgaben/Risikobewertung-und-Forschung/Massnahmen-von-Herstellern/_node.html},
      urldate = {2026-08-24}
    }

    @techreport{W6MDE_BSI_ManiMed,
      author = {{Bundesamt fuer Sicherheit in der Informationstechnik}},
      title = {Cyber Security Review of Network-Connected Medical Devices: {BSI} Project 392, Manipulation of Medical Devices ({ManiMed})},
      institution = {Federal Office for Information Security},
      year = {2020},
      month = dec,
      note = {Authoritative German technical study, not a legal compliance certificate},
      url = {https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/DigitaleGesellschaft/ManiMed_Abschlussbericht_EN.html},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_ISO14971_2019,
      organization = {International Organization for Standardization},
      title = {Medical Devices---Application of Risk Management to Medical Devices},
      number = {ISO 14971:2019},
      edition = {3},
      year = {2019},
      note = {International edition confirmed in 2025 and current on 24 August 2026; EU harmonized EN/A11 citation is edition-specific},
      url = {https://www.iso.org/standard/72704.html},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_ISO13485_2016,
      organization = {International Organization for Standardization},
      title = {Medical Devices---Quality Management Systems---Requirements for Regulatory Purposes},
      number = {ISO 13485:2016},
      edition = {3},
      year = {2016},
      note = {International edition confirmed in 2025 and current on 24 August 2026; EU harmonized EN/A11 citation is edition-specific},
      url = {https://www.iso.org/standard/59752.html},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_IEC62304_2006A1_2015,
      organization = {International Electrotechnical Commission},
      title = {Medical Device Software---Software Life Cycle Processes},
      number = {IEC 62304:2006+A1:2015},
      edition = {1.1},
      year = {2015},
      note = {Consolidated version; stability date 2028},
      url = {https://webstore.iec.ch/en/publication/22794},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_IEC62366_1_2015A1_2020,
      organization = {International Electrotechnical Commission},
      title = {Medical Devices---Part 1: Application of Usability Engineering to Medical Devices},
      number = {IEC 62366-1:2015+A1:2020},
      edition = {1.1},
      year = {2020},
      note = {Consolidated version; stability date 2028},
      url = {https://webstore.iec.ch/en/publication/67220},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_IEC60601_1_8_2006A2_2020,
      organization = {International Electrotechnical Commission},
      title = {Medical Electrical Equipment---Part 1-8: General Requirements, Tests and Guidance for Alarm Systems in Medical Electrical Equipment and Medical Electrical Systems},
      number = {IEC 60601-1-8:2006+A1:2012+A2:2020},
      edition = {2.2},
      year = {2020},
      note = {Consolidated version; stability date 2028},
      url = {https://webstore.iec.ch/en/publication/67388},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_IEC80001_1_2021,
      organization = {International Electrotechnical Commission},
      title = {Application of Risk Management for {IT}-Networks Incorporating Medical Devices---Part 1: Safety, Effectiveness and Security in the Implementation and Use of Connected Medical Devices or Connected Health Software},
      number = {IEC 80001-1:2021},
      edition = {2},
      year = {2021},
      note = {Stability date 2028},
      url = {https://webstore.iec.ch/en/publication/34263},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_IEC81001_5_1_2021,
      organization = {International Electrotechnical Commission},
      title = {Health Software and Health {IT} Systems Safety, Effectiveness and Security---Part 5-1: Security---Activities in the Product Life Cycle},
      number = {IEC 81001-5-1:2021},
      edition = {1},
      year = {2021},
      note = {Corrected version including interpretation sheet 1 in December 2025; stability date 2028},
      url = {https://webstore.iec.ch/en/publication/63293},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_ISO14155_2026,
      organization = {International Organization for Standardization},
      title = {Clinical Investigation of Medical Devices for Human Subjects---Good Clinical Practice},
      number = {ISO 14155:2026},
      edition = {4},
      year = {2026},
      note = {Published 23 March 2026; current international edition but not automatically the edition cited in the MDR Official Journal list},
      url = {https://www.iso.org/standard/83968.html},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_ISO20916_2019,
      organization = {International Organization for Standardization},
      title = {In Vitro Diagnostic Medical Devices---Clinical Performance Studies Using Specimens from Human Subjects---Good Study Practice},
      number = {ISO 20916:2019},
      edition = {1},
      year = {2019},
      note = {International edition confirmed in 2025; EN ISO 20916:2024 is cited separately in the IVDR Official Journal list},
      url = {https://www.iso.org/standard/69455.html},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_DICOM2026c,
      organization = {{DICOM Standards Committee and National Electrical Manufacturers Association}},
      title = {Digital Imaging and Communications in Medicine ({DICOM}) Standard, Edition 2026c},
      number = {DICOM PS3 2026c},
      year = {2026},
      note = {Current edition checked 24 August 2026; PS3.2 states that DICOM alone does not guarantee interoperability},
      url = {https://dicom.nema.org/medical/dicom/current/output/chtml/part02/chapter_1.html},
      urldate = {2026-08-24}
    }

    @standard{W6MDE_HL7FHIR_R5,
      organization = {Health Level Seven International},
      title = {{FHIR} Release 5, Version 5.0.0},
      number = {HL7 FHIR R5 5.0.0},
      year = {2023},
      note = {Current published version checked 24 August 2026; FHIR R6 6.0.0-ballot5 remained work in progress},
      url = {https://hl7.org/fhir/directory.html},
      urldate = {2026-08-24}
    }

## Conservative verdict

Medical engineering deserves a dedicated field route because body/interface,
device, software, user, network, organization, and market history interact in
ways that a generic model-score audit misses. The audit nevertheless promotes
no new architecture. Its nine claims are typed non-substitution boundaries,
and its nine tests are hostile synthetic gates against mature metrology,
control, human-factors, interoperability, cybersecurity, quality, and
surveillance nulls.

The practical rule is compact: preserve the whole device chain and the edition,
support, authority, delivery, and field history at every handoff; use binding
law only when its factual hook applies; use guidance as guidance; use standards
as edition-specific technical practice or conformity routes; and never let
technical conformance silently become clinical benefit.

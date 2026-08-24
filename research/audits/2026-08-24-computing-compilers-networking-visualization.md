# Computing, compilers, networking, and visualization: semantic and measurement-boundary audit

<!-- markdownlint-disable MD013 -->

- **Audit date:** 2026-08-24
- **Scope:** compiler correctness and semantic preconditions; undefined,
  unspecified, and implementation-defined behaviour; differential compiler
  testing and oracle ambiguity; profile-guided and just-in-time optimization;
  software-performance measurement and layout effects; end-to-end function
  placement; network delay, loss, queues, congestion, active measurement, and
  operator boundaries; fan-out tail latency; graphical perception and
  uncertainty displays; vector-valued software quality and lifecycle security
  obligations
- **Evidence rule:** source semantics, generated executable behaviour, test
  verdict, runtime profile, benchmark result, network metric, latent path state,
  rendered display, human judgment, quality characteristic, and legal
  conformity decision are different records
- **Promotion state:** no new principle and no new candidate. Nine scoped claims
  are reserved as [C-1404](#c-1404)--[C-1412](#c-1412) for central-ledger
  integration.
- **Execution state:** ten CPU-only synthetic falsification contracts are fully
  specified below. They are experimental designs, not implemented runners or
  empirical results.
- **Repository constraint:** this file is self-contained. It does not modify the
  central claim ledger, bibliography, coverage maps, indexes, application,
  candidate specifications, or experiment registry.

## Normative and evidence-source header

### Source types are not interchangeable

| Type | Sources used here | What the source can establish | What it cannot establish by itself |
| --- | --- | --- | --- |
| Binding EU law | Regulation (EU) 2024/2847 (CRA); Directive (EU) 2022/2555 (NIS2) | duties, scope tests, dates, actors, conformity and reporting obligations when applicable | technical optimality; that this project or every artifact is in scope |
| Binding German law | BSI-Gesetz (BSIG), especially sections 30 and 32 | German risk-management and incident-reporting duties for the entities in its scope | a universal software-quality model or automatic conformity |
| International/European standard | ISO/IEC 9899:2024; ISO/IEC 25010:2023; ISO/IEC 25040:2024; EN 301 549 V3.2.1 | declared language semantics, quality-model/evaluation structure, or accessibility requirements within scope | empirical superiority; legal applicability unless invoked by law, contract, procurement, or a conformity route |
| Technical specification or guidance | IETF RFCs; ETSI EG 202 765-3; LLVM documentation | metric, protocol, implementation, and evaluation contracts within the stated status | a general law of all networks or runtimes |
| Primary academic evidence | compiler, performance, networking, queueing, perception, and uncertainty studies below | theorem, experiment, model, or field result within its assumptions | unqualified transfer to this architecture or future workloads |

### Current-status snapshot

- ISO/IEC 9899:2024 is the current fifth edition of the C language standard. It
  specifies the form and interpretation of C programs, while explicitly not
  specifying the mechanism by which implementations transform or invoke them.
- CompCert documentation was checked at version 3.17 (released 2026-02-13). Its
  proof concerns CompCert C and the formal source/target semantics and successful
  compiler execution named by the theorem; this audit does not widen that scope
  [@CompCertManual_3_17].
- ISO/IEC 25010:2023 and ISO/IEC 25040:2024 are the current editions used here.
  The former defines nine product-quality characteristics; the latter supplies
  an evaluation framework but not specific test methods.
- EN 301 549 V3.2.1 (2021-03) remains the latest published edition at the audit
  snapshot. ETSI's V4.1.0 revision was in final voting in June 2026 and is not
  treated here as a published standard.
- The CRA entered into force in December 2024. Chapter IV has applied since
  2026-06-11; Article 14 reporting applies from 2026-09-11; general application
  begins 2027-12-11. This audit date therefore precedes the Article 14 and
  general-application dates.
- NIS2 is in force. Germany's replacement BSIG took effect on 2025-12-06 and
  was checked with amendments through 2026-07-23. Sections 30 and 32 contain,
  for entities in scope, risk-management/documentation and staged incident-
  reporting duties. Applicability must be decided from the actual entity,
  service, product, role, size/sector rule, and any lex-specialis regime.
- IETF publication status is retained: RFC 7680 is an Internet Standard; RFC
  7679 and RFC 9438 are Standards Track; RFC 2681 is Proposed Standard; RFC
  7799 is Informational; RFCs 8289, 8290, and 9331 are Experimental. An RFC's
  status is not silently promoted.
- ETSI EG 202 765-3 V1.1.1 is a guide, not an EN. It is used for IP metric and
  measurement-method terminology, not as a binding performance threshold.

**Applicability hook:** unresolved. A binding assessment needs the exact
product/service, legal actor, intended purpose, deployment country, sector,
entity size, users, accessibility context, release and support dates, network
roles, data flows, incident facts, and applicable harmonised standards. This
research audit is neither legal advice nor a conformity assessment.

## Executive finding

The fields in scope do not add a new generic intelligence primitive. They expose
nine failures that occur when an **observation or transformation operator is
mistaken for the latent state or obligation it only partially constrains**:

1. compiler correctness is semantic refinement under named source/target
   semantics and preconditions, not a certificate for an author's unstated
   intent or a program execution outside those semantics;
2. differential compiler testing produces bug candidates only after source
   validity, environmental equivalence, and oracle relations are established;
   compiler agreement or majority vote is not ground truth;
3. PGO and JIT optimization specialize to observed executions and therefore
   require workload, warm-up, compilation, deoptimization, and shift accounting;
4. a benchmark result is conditional on code/data layout, process environment,
   machine state, run hierarchy, and estimand; repeated runs of one layout do not
   sample layout variation;
5. an intermediate function can improve performance, but a function requiring
   complete end-to-end knowledge still needs endpoint verification; placement
   moves cost and trust boundaries rather than eliminating them;
6. delay, loss, queue, and throughput metrics are Type-P-, direction-, point-,
   clock-, sampling-, and timeout-qualified; active probes alter the measured
   network to some degree;
7. congestion, propagation delay, queuing delay, random loss, policing, receiver
   delay, and application limitation are coupled but non-identical mechanisms,
   controlled by different operators;
8. fan-out converts component latency distributions and dependence into a
   whole-request maximum; hedging trades tail reduction for extra load,
   cancellation work, and possible self-congestion; and
9. a chart or scalar score is an operator over uncertain, vector-valued state.
   Perceptual error, task, accessibility, protected quality dimensions, and
   lifecycle obligations remain visible and non-compensatory where required.

~~~mermaid
flowchart LR
    X["Latent state<br/>semantics · workload · path · quality vector"]
    A["Action / transformation<br/>compile · optimize · probe · aggregate"]
    H["Observation operator<br/>harness · clock · counter · renderer"]
    Y["Recorded result<br/>output · profile · RTT · pixels"]
    I["Inference<br/>bug · speedup · congestion · comparison"]
    D["Decision<br/>release · route · hedge · communicate"]
    O["Outcome<br/>correctness · service · judgment · duty"]
    V["Independent verification<br/>semantic oracle · endpoint · audit"]

    X --> A --> H --> Y --> I --> D --> O --> V
    A -. "can change state" .-> X
    D -. "changes workload / queue" .-> X
    V -. "invalidate versioned operator" .-> H

    classDef latent fill:#4c1d95,stroke:#ddd6fe,color:#faf5ff;
    classDef action fill:#9a3412,stroke:#fdba74,color:#fff7ed;
    classDef observe fill:#0e7490,stroke:#67e8f9,color:#ecfeff;
    classDef infer fill:#1d4ed8,stroke:#93c5fd,color:#eff6ff;
    classDef decide fill:#be123c,stroke:#fda4af,color:#fff1f2;
    classDef outcome fill:#3f6212,stroke:#bef264,color:#f7fee7;
    classDef verify fill:#166534,stroke:#86efac,color:#f0fdf4;
    class X latent;
    class A action;
    class H,Y observe;
    class I infer;
    class D decide;
    class O outcome;
    class V verify;
~~~

## Construct firewall

### Compiler and runtime constructs

- **Source program:** token/abstract-syntax artifact interpreted under a named
  language edition, implementation choices, preprocessing environment, inputs,
  and execution environment. It is not the author's complete intent.
- **Defined execution:** an execution for which the source semantics supplies
  one or more permitted behaviours. It is not identical to deterministic
  execution: unspecified and implementation-defined choices may remain.
- **Undefined behaviour:** absence of a requirement in the relevant standard for
  the execution that reaches it. It is not an observed target behaviour, an
  arbitrary-but-valid oracle, or evidence that surrounding intended security
  checks remain meaningful after optimization.
- **Implementation-defined behaviour:** a choice an implementation must document
  where the language says so. It is not cross-compiler equality.
- **Unspecified behaviour:** one permitted value/behaviour chosen without a
  documentation requirement. It is not automatically a compiler defect.
- **Compiler correctness theorem:** relation among a formal source semantics,
  compilation function, target semantics, and observations. It is not proof of
  preprocessor, parser, assembler, linker, loader, runtime, hardware, libraries,
  foreign code, source specification, or factual correctness unless included.
- **Compiler crash:** robustness failure candidate. It is not necessarily
  miscompilation, especially when input is invalid or resource limits are
  exceeded.
- **Differential disagreement:** outputs or behaviours differ under a registered
  equivalence relation. It is a triage event, not a verdict identifying which
  implementation is wrong.
- **PGO profile:** sampled or instrumented evidence about registered executions.
  It is not the deployment workload distribution.
- **JIT warm-up:** transition involving interpretation, profiling, compilation,
  code-cache changes, tiering, and deoptimization. It is not noise that can be
  dropped without changing the estimand.

### Performance and placement constructs

- **Wall-clock latency:** elapsed time across a named boundary. It is not CPU
  time, service time, throughput, energy, useful work, or user-perceived delay.
- **Throughput:** completed units per unit time. It is not accepted goodput,
  fairness, correctness, tail latency, or resource efficiency.
- **Benchmark iteration, process invocation, rebuilt binary, randomized layout,
  machine, and workload** are different replication levels.
- **Speedup:** ratio under a stated workload, boundary, statistic, hardware,
  compiler/runtime, and uncertainty model. It is not an intrinsic scalar of an
  optimization.
- **Code/function placement:** mapping of blocks or functions to binary/memory/
  execution locations. It is not the end-to-end argument, although placement
  can change transfer, cache, trust, and failure costs.
- **End-to-end argument:** design reasoning that some functions can be completely
  and correctly implemented only with endpoint application knowledge. It does
  not prohibit useful lower-layer partial implementations.

### Network constructs

- **Type-P:** packet/traffic class including protocol, addresses, ports, size,
  DS field and other treatment-relevant properties. A result for one Type-P is
  not automatically transferable to another.
- **Observation/measurement point:** place where a packet or timestamp is
  observed. It is not the whole path or operator domain.
- **One-way delay:** destination event time minus source event time under clock,
  wire/host timestamp, path, Type-P, and calibration conditions. It is not half
  an RTT.
- **RTT:** a round-trip metric over forward path, destination response, and
  reverse path. It does not localize delay and can combine asymmetric paths.
- **Loss:** failure to observe a qualifying packet before a declared threshold.
  It is not uniquely congestion; corruption, filtering, policing, route change,
  receiver exhaustion, timeout choice, and instrumentation can contribute.
- **Queue occupancy:** bytes, bits, packets, or jobs waiting at a named queue and
  instant. It is not queuing delay when service rate varies.
- **Sojourn time:** departure time minus arrival time for a packet at a named
  buffer. It is not end-to-end latency.
- **Congestion:** demand and control interactions that exceed or threaten
  available resources. A loss, an ECN mark, or a raised RTT can signal it but is
  not synonymous with it.
- **Goodput:** accepted application payload per unit time at a named boundary.
  It excludes headers, retransmitted bytes, rejected work, and duplicate hedge
  results.
- **Active measurement:** dedicated or measurement-modified traffic and its
  observations. It perturbs network conditions to some degree [@RFC7799].
- **Passive measurement:** observation of existing streams without modifying
  them, while export/collector work can still affect a system.
- **Fan-out latency:** time for the completion rule over multiple branches. It
  is not the mean or p99 of one branch.

### Visualization and quality constructs

- **Data value:** encoded numeric/categorical result. It is not the mark geometry
  or the viewer's decoded estimate.
- **Graphical encoding:** map from data/uncertainty to position, length, angle,
  area, colour, texture, animation, or text. Equal data can yield unequal
  perceptual error across encodings and tasks [@ClevelandMcGill1984].
- **Uncertainty interval/distribution:** inferential object with a named target,
  model, level, and interpretation. An error bar is not self-explanatory.
- **Decision quality:** consequence relative to a task and truth. It is not
  identical to visual estimate accuracy, confidence, preference, or speed.
- **Product quality:** vector of characteristics under specified conditions and
  stakeholder needs. It is not one benchmark, star rating, weighted sum, or
  absence of known defects.
- **Security property, vulnerability-handling process, conformity evidence,
  support period, incident report, and product quality** are different records.
- **Legal obligation:** scope- and date-qualified rule imposed on an actor. It
  cannot be traded away by a better aggregate quality score.

## Shared analytical boundary

### Latent state, operator, and intervention

Let the latent state at time \(t\) be \(x_t\), the measurement or transformation
action be \(a_t\), configuration/environment be \(e_t\), and recorded result be
\(y_t\):

$$
y_t = H_{v,t}(x_t,a_t,e_t)+\varepsilon_t,
\qquad
x_{t+1}=F_t(x_t,u_t,a_t,\xi_t).
$$

\(H_{v,t}\) is a versioned observation operator, \(\varepsilon_t\) is
observation error in the native result unit, \(u_t\) denotes ordinary
workload/control, and \(\xi_t\) is process disturbance. The second equation
matters: compilation changes the executable, PGO changes placement, probing adds
traffic, hedging adds work, and presentation can change a human decision.
“Observe” is not always a passive verb.

### Semantic refinement and preconditions

For source program \(p\), input/environment \(\iota\), compiler \(c\), source
behaviour set \(\mathcal B_S(p,\iota)\), and target behaviour set
\(\mathcal B_T(c(p),\iota)\), a simplified refinement obligation is

$$
V_S(p,\iota)\land c(p)=q
\Longrightarrow
\mathcal B_T(q,\iota)\preceq\mathcal B_S(p,\iota),
$$

where \(V_S\in\{0,1\}\) states the semantic preconditions and
\(\preceq\) is the theorem's allowed-behaviour refinement relation. Neither side
has a physical unit. If \(V_S=0\), equality of intended outputs is not recovered
by comparing more compilers. CompCert proves a much more precise theorem under
its formal definitions [@Leroy2009CACM; @Leroy2009JAR].

For differential testing with compilers \(c_1,\ldots,c_m\), harness \(h\), and
registered oracle equivalence \(\approx_{\mathcal O}\), define

$$
D(p,\iota)=
\mathbf 1\!\left[
\exists j,k:\ h(c_j(p),\iota)\not\approx_{\mathcal O}
h(c_k(p),\iota)
\right].
$$

\(D\) is a dimensionless disagreement flag. A bug verdict additionally needs
validity, deterministic/replayable conditions, implementation-choice controls,
and either a trusted semantic oracle or defensible reduction and adjudication.
Majority output is only a heuristic.

### Workload-qualified optimization

For compiled policy/binary \(\pi\), workload distribution \(P\), latency
\(T_\pi(w)\) in seconds/request, energy \(E_\pi(w)\) in joules/request, code
footprint \(M_\pi(w)\) in bytes, and correctness loss \(L_\pi(w)\), define

$$
J(\pi;P)=\mathbb E_{w\sim P}
\left[T_\pi(w)+\lambda_E E_\pi(w)+\lambda_M M_\pi(w)
+\lambda_L L_\pi(w)\right].
$$

Weights convert non-time quantities to the declared decision unit; the raw
vector must also be reported. For \(N\) deployment requests, the net mean
latency benefit of a specialization is

$$
\Delta \bar T_N=
\bar T_{\mathrm{base}}-
\left(\bar T_{\mathrm{spec}}
+\frac{T_{\mathrm{profile}}+T_{\mathrm{compile}}+T_{\mathrm{deopt}}}{N}
\right)
\quad[\mathrm{s/request}].
$$

The deployment distribution \(P_t\), profile distribution \(P_0\), code/config
version, profile age, coverage, JIT tier state, and change points are part of the
result. A distribution distance such as Jensen--Shannon divergence is a
dimensionless diagnostic, not a universal invalidation threshold.

### Hierarchical performance estimand

For variant \(v\in\{0,1\}\), layout \(\ell\), process invocation \(b\), and
repeat \(r\), a minimal model is

$$
Y_{v\ell br}=\mu+\tau_v+u_\ell+(\tau u)_{v\ell}+u_b+
\epsilon_{v\ell br},
\qquad Y[\mathrm{ms/request}].
$$

The target effect is not necessarily one binary's contrast. A layout-population
estimand is

$$
\Delta_{\mathrm{layout}}
=\mathbb E_{\ell\sim\mathcal L}
\left[Y_{1\ell}-Y_{0\ell}\right]
\quad[\mathrm{ms/request}].
$$

Repeating \(r\) with the same \(\ell\) does not identify
\(\Delta_{\mathrm{layout}}\). Randomized layouts, rebuilds, process restarts,
blocked run order, thermal/frequency state, warm-up, and the independent unit
must match the estimand [@MytkowiczEtAl2009; @CurtsingerBerger2013;
@KaliberaJones2013].

### End-to-end placement cost

For function \(f\) placed at node/layer \(n\), state \(s\), expected execution
cost \(C_{\mathrm{exec}}\), transferred bytes \(B\), link energy
\(e_{\mathrm{bit}}\), verification cost \(C_{\mathrm{verify}}\), and expected
failure loss \(C_{\mathrm{fail}}\),

$$
C(f,n)=\mathbb E_s\left[
C_{\mathrm{exec}}(f,n,s)+B(f,n,s)e_{\mathrm{bit}}
+C_{\mathrm{verify}}(f,n,s)+C_{\mathrm{fail}}(f,n,s)
\right].
$$

The terms can be expressed in joules, seconds, euros, or a declared vector;
mixing them requires explicit exchange weights. Lower-layer execution may reduce
cost or catch errors early, while endpoint verification remains necessary when
only endpoints possess the complete correctness context
[@SaltzerReedClark1984].

### Path, queue, delay, and probe operator

For a path with forward propagation/serialization/host delay \(d_f\), reverse
counterpart \(d_r\), queue \(q_i(t)\) in bits, service capacity \(C_i(t)\) in
bit/s, and measurement error \(\epsilon_R\), a diagnostic decomposition is

$$
R(t)=d_f(t)+d_r(t)
+\sum_{i\in f}\frac{q_i^f(t)}{C_i^f(t)}
+\sum_{j\in r}\frac{q_j^r(t)}{C_j^r(t)}
+\epsilon_R(t)
\quad[\mathrm{s}].
$$

It is not an identification theorem: packet scheduling, variable service,
serialization, destination processing, ACK policy, routing, and sampling can
alias. One-way delay additionally contains source/destination clock offset,
resolution, timestamp placement, and skew [@RFC7679]; RTT joins two paths
[@RFC2681].

At one FIFO fluid queue,

$$
\frac{dq(t)}{dt}=A(t)+r_p(t)-S(t)
\quad[\mathrm{bit/s}],
\qquad q(t)>0,
$$

where \(A\) is ordinary arrival rate, \(r_p\) active-probe rate, and \(S\)
service rate. Probe-load fraction and probe-conditioned bias are

$$
\phi_p=\frac{\bar r_p}{\bar S},
\qquad
b_p=\mathbb E[\hat\theta\mid r_p>0]
-\mathbb E[\hat\theta\mid r_p=0].
$$

\(\phi_p\) is dimensionless; \(b_p\) has the metric's unit. Active traffic can
change the quantity it measures, and Type-P treatment can make its path
nonrepresentative [@RFC7799; @ETSI_EG_202765_3].

The bandwidth--delay product at bottleneck rate \(C_b\) and baseline RTT \(R_0\)
is

$$
\mathrm{BDP}=C_bR_0\quad[\mathrm{bit}].
$$

It is not a safe universal queue target. End hosts set offered rate/congestion
window; routers schedule, buffer, drop or mark; applications set demand and
deadlines; operators set policy and capacity. CUBIC, BBR, CoDel/FQ-CoDel, ECN,
fair queueing, admission/load shedding, and ordinary queueing models are mature
nulls, not weak baselines [@CardwellEtAl2016BBR; @RFC9438; @RFC8289; @RFC8290;
@RFC9331].

### Fan-out and hedging

If a request completes after all \(n\) branches and branch latencies have joint
CDF \(F_{1:n}\), then \(T_{\max}=\max_i T_i\). Only under independence,

$$
\Pr(T_{\max}\le t)=\prod_{i=1}^{n}F_i(t),
$$

and for identical \(F\), this is \(F(t)^n\). If each branch independently has a
slow event with probability \(p\), the whole request sees at least one with
probability \(1-(1-p)^n\). Shared queues, hosts, racks, software versions, and
upstream pauses violate independence.

For arrival rate \(\lambda\) requests/s, primary service work \(S_1\) in CPU-s,
hedge indicator \(I_H\), backup work before cancellation
\(S_2^{\mathrm{used}}\), and \(m\) CPU-s/s capacity,

$$
\rho_H=
\frac{\lambda\,\mathbb E[S_1+I_HS_2^{\mathrm{used}}]}{m}.
$$

Hedging can lower a minimum-of-copies tail while raising utilization and hence
everyone's queueing tail [@DeanBarroso2013; @VulimiriEtAl2013;
@GardnerEtAl2017].

### Visualization as a decision operator

For latent target \(\theta\), data \(y\), display encoding \(d=V_e(y)\), task
\(\tau\), viewer state \(k\), decoded estimate \(\hat\theta\), and action \(a\),

$$
\hat\theta=P(d,\tau,k)+\epsilon_P,
\qquad
a=\arg\min_{a'}\mathbb E[L(a',\theta)\mid d,\tau,k].
$$

The normalized decoding error

$$
E_{\mathrm{decode}}=
\frac{|\hat\theta-\theta|}{\theta_{\max}-\theta_{\min}}
$$

is dimensionless. It is not decision loss. Position, length, angle, area,
colour, text, intervals, distributions, and animation have task- and
viewer-dependent error. Uncertainty encodings can alter both estimates and
choices [@ClevelandMcGill1984; @CorrellGleicher2014; @FernandesEtAl2018].

### Vector quality and hard obligations

Let orientation-normalized product quality be

$$
\mathbf q=(q_1,\ldots,q_9),
$$

corresponding to the nine ISO/IEC 25010:2023 characteristics under declared
conditions. For two products, \(A\) Pareto-dominates \(B\) only if

$$
q_i(A)\ge q_i(B)\ \forall i,
\qquad
q_j(A)>q_j(B)\ \text{for at least one }j.
$$

A weighted scalar \(w^Tq\) embeds stakeholder exchange rates and cannot absorb
hard constraints. Let \(g_\ell(z,t,s)\le0\) denote obligation \(\ell\) under
scope facts \(s\) and date \(t\). A release is feasible only if every applicable
hard constraint holds:

$$
\mathrm{Release}(z,t,s)=1
\Longrightarrow
g_\ell(z,t,s)\le0
\quad\forall\ell\in\mathcal A(t,s).
$$

CRA support/vulnerability handling, NIS2/BSIG risk management and incident
reporting, and applicable accessibility duties are lifecycle records, not
negative weights that performance can compensate [@EU_CRA_2024_2847;
@EU_NIS2_2022_2555; @DE_BSIG_2025; @EN301549_3_2_1].

## Deduplication against the existing architecture

No new principle survives. The audit adds typed boundaries and falsifiers to
existing homes:

| Residue | Existing owner or mature null | Deduplication decision |
| --- | --- | --- |
| compiler semantics and preconditions | [C-145](../claims.md#c-145), [P-008](../principle-registry.md#p-008--compartmentalized-interaction), programming-languages audit | C-1404 adds compilation refinement, explicit definedness, and UB/implementation-choice boundaries; it does not replace type soundness |
| compiler testing | runtime/static verification in [C-151](../claims.md#c-151) and [C-152](../claims.md#c-152); Csmith, EMI, translation validation | C-1405 records disagreement as triage and preserves oracle ambiguity; finite testing is not a new assurance class |
| PGO/JIT specialization | [P-001](../principle-registry.md#p-001--selective-allocation), [P-005](../principle-registry.md#p-005--use-dependent-topology), [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design), Candidate [001](../../experiments/candidates/001-adaptive-topology.md) | C-1406 treats ordinary runtime/compiler specialization as the hard null and adds profile/workload versioning |
| performance measurement | metrology audit; [C-535](../claims.md#c-535) and [C-536](../claims.md#c-536); randomized/blocking/hierarchical statistics | C-1407 adds executable-layout and replication-level bias, not a new measurement principle |
| end-to-end placement | Saltzer--Reed--Clark; [P-008](../principle-registry.md#p-008--compartmentalized-interaction), [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design), [P-013](../principle-registry.md#p-013--externalized-shared-state) | C-1408 keeps partial lower-layer benefit separate from complete endpoint correctness |
| active network observation | Candidate [007](../../experiments/candidates/007-endogenous-observation-surveillance.md), Candidate [014](../../experiments/candidates/014-versioned-observation-contract.md), metrology audit | C-1409 supplies IPPM Type-P, point, clock, threshold, direction, and probe-perturbation details |
| congestion and queue control | [C-659](../claims.md#c-659)--[C-661](../claims.md#c-661), engineering analogue audit, adaptive-link and loop-coordination cards in the communications audit | C-1410 does not rename queueing or link adaptation; it separates signals, mechanisms, and operator authority |
| fan-out tail and hedging | queueing theory; Candidate [003](../../experiments/candidates/003-recovery-dynamics-fragility.md), Candidate [013](../../experiments/candidates/013-deficit-capability-routing.md) | C-1411 adds maximum/dependence/load-amplification accounting; hedging is a mature null, not a novel reflex |
| visual and quality aggregation | HCI audit; metrology audit; Candidate [009](../../experiments/candidates/009-graded-assurance-envelopes.md), Candidate [014](../../experiments/candidates/014-versioned-observation-contract.md) | C-1412 treats displays and scores as operators over a vector with hard constraints; it creates no generic “explainability” mechanism |

The strongest ordinary comparator stack is therefore: formal semantics and
translation validation; validity-preserving randomized/metamorphic compiler
testing; PGO/JIT and deoptimization; blocked hierarchical performance
experiments with layout randomization; conventional endpoint checks; IPPM/ETSI
metric definitions; CUBIC/BBR/AQM/ECN/fair queueing and queueing models; ordinary
tail-tolerant load balancing/hedging; task-tested visual encodings; SQuaRE
quality evaluation; and an applicability-specific EU/German compliance matrix.

## Scoped audit cards

### COMP-01 — Compiler correctness is a conditional semantic relation

- **Reserved claim:** [C-1404](#c-1404).
- **Evidence status:** established for the cited formal models and language
  standard; general whole-toolchain correctness is not established.
- **Computing observation:** CompCert proves semantic preservation between named
  source and target semantics when compilation succeeds. ISO/IEC 9899:2024
  defines C interpretation and portability boundaries. Optimization-unstable
  code demonstrates that source-level expectations can fail when executions
  invoke undefined behaviour [@Leroy2009CACM; @Leroy2009JAR;
  @CompCertManual_3_17; @ISOIEC9899_2024; @WangEtAl2013UB].
- **Proposed AI/system translation:** every graph rewrite, kernel fusion,
  quantizer, sparse router compilation, ahead-of-time export, or accelerator
  lowering should declare source semantics, target semantics, preconditions,
  allowed nondeterminism, numerical relation, failure result, and trusted
  boundary. A successful build is not the relation.
- **Efficiency mechanism:** machine-checked compiler proofs or translation
  validation may permit aggressive transformations while reducing repeated
  downstream testing for the proven property. Proof construction, checking,
  restricted semantics, certificates, and invalidation on update remain costs.
- **Mature null and deduplication:** C-145 and its scoped type-soundness theorem
  [@wright1994syntactic], type/effect systems, proof-carrying code, translation
  validation, equivalence checking, differential testing, and ordinary
  regression/property testing.
- **Failure modes:** undefined source execution admitted; floating-point or
  concurrency relation unstated; preprocessing/linking/FFI omitted but claimed;
  “verified compiler” widened to libraries or hardware; compiler rejection
  treated as target behaviour; implementation-defined choices compared as if
  fixed; numerical tolerance chosen after seeing results.
- **Measurable prediction:** precondition- and semantics-typed validation should
  sharply reduce false miscompilation reports on invalid/choice-dependent tests
  while retaining injected defined-program miscompilations, with explicit
  abstention for executions outside the relation.
- **Protocol:** [WS-CNV-01](#ws-cnv-01--semantic-preconditions-and-compiler-refinement).
- **Stopping rule:** reject any project-specific assurance layer if ordinary
  formal semantics plus translation validation matches its detection/frontier,
  or if the layer calls undefined executions “verified.”

### COMP-02 — Differential disagreement is triage, not ground truth

- **Reserved claim:** [C-1405](#c-1405).
- **Evidence status:** established bug-finding methodology and established oracle
  limitation; yield and coverage are compiler/generator/version dependent.
- **Computing observation:** Csmith deliberately generates defined C programs to
  preserve an automatic wrong-code oracle and found many compiler defects.
  Equivalence-modulo-input variants widen testing while retaining an
  input-qualified relation [@YangEtAl2011Csmith; @LeEtAl2014EMI].
- **Proposed AI/system translation:** compare independent lowering stacks,
  runtimes, numerical kernels, and model exporters only after binding source
  validity, tolerated numerical relation, determinism, environment, reducer, and
  adjudication status. Preserve “disagreement,” “confirmed defect,” and
  “unsupported oracle” as different labels.
- **Efficiency mechanism:** differential and metamorphic tests avoid a full
  oracle for every case and concentrate review on divergences. Generator bias,
  equivalent defects, shared libraries, reduction, and adjudication consume
  resources.
- **Mature null and deduplication:** validity-preserving fuzzing, Csmith, EMI,
  metamorphic testing, property-based generation, test-case reduction, sanitizer
  runs, formal interpreters, and translation validation.
- **Failure modes:** UB or unspecified output; majority vote declared correct;
  all compilers share the same faulty backend; nondeterministic program;
  timeout classified as wrong code; reducer introduces invalidity; compiler
  flags or libraries differ; tolerance hides sign/category errors; defect count
  substitutes for sampled semantic coverage.
- **Measurable prediction:** a typed adjudication pipeline should reduce false
  confirmations and unresolved reports at matched confirmed-bug recall and
  review cost, especially under injected invalidity and implementation-choice
  strata.
- **Protocol:** [WS-CNV-02](#ws-cnv-02--differential-compiler-testing-and-oracle-ambiguity).
- **Stopping rule:** reject the additional layer if a conventional
  defined-program generator plus reduction/adjudication matches it, or if
  majority voting supplies its apparent gain.

### PERF-01 — PGO and JIT optimize an empirical workload contract

- **Reserved claim:** [C-1406](#c-1406).
- **Evidence status:** established optimization family; benefit under workload
  shift and net lifecycle cost is empirical and version-specific.
- **Computing observation:** adaptive virtual machines profile and selectively
  optimize at runtime, paying compilation and runtime-service costs. AutoFDO
  explicitly handles stale sampled profiles, and LLVM documentation advises
  representative benchmark selection [@ArnoldEtAl2005AdaptiveVM;
  @ChenEtAl2016AutoFDO; @LLVM_PGO_2026].
- **Proposed AI/system translation:** treat expert routing caches, fused kernels,
  retrieval indices, speculative decoding, quantization profiles, and compiled
  execution plans as versioned specializations of a workload distribution.
  Record profile support, age, change detection, fallback, warm-up, and
  deoptimization.
- **Efficiency mechanism:** spend profiling/compilation once to improve frequent
  paths or place hot code/data better. Gains vanish or reverse when reuse is too
  low, profiles are unrepresentative, code changes, or monitoring/deoptimization
  costs dominate.
- **Mature null and deduplication:** static robust optimization, ordinary
  instrumented/sample PGO, tiered JIT, adaptive optimization, AutoFDO, code
  positioning [@PettisHansen1990], and per-workload autotuning.
- **Failure modes:** training workload replayed as test; compilation and warm-up
  excluded; only steady-state mean reported; deoptimization/fallback omitted;
  profile/version mismatch ignored; rare protected path made slower; code size,
  cache pressure, energy, or tail latency hidden.
- **Measurable prediction:** profile-conditioned specialization should win only
  inside a measurable support/reuse region, degrade gracefully through fallback
  after change points, and expose an amortization crossover in requests.
- **Protocol:** [WS-CNV-03](#ws-cnv-03--pgojit-specialization-under-workload-shift).
- **Stopping rule:** reject an AI-specific specialization claim if conventional
  PGO/JIT/autotuning reaches the same vector frontier or if benefit appears only
  after deleting warm-up and shifted workloads.

### PERF-02 — Executable layout is a randomized experimental factor

- **Reserved claim:** [C-1407](#c-1407).
- **Evidence status:** established measurement-bias mechanism and experimental
  remedy class; magnitude is hardware, binary, toolchain, and workload specific.
- **Computing observation:** environment size and link order can change code/data
  layout and reverse apparent optimization conclusions. Stabilizer demonstrated
  repeated layout randomization; rigorous benchmarking separates variance levels
  and budgets replication [@MytkowiczEtAl2009; @CurtsingerBerger2013;
  @KaliberaJones2013].
- **Proposed AI/system translation:** benchmark kernels, runtimes, inference
  servers, sparse dispatchers, and compiled models across randomized
  executable/data layouts, rebuilds, invocations, workload blocks, and machine
  state. Name whether inference targets the tested binary or a layout population.
- **Efficiency mechanism:** randomized blocked designs prevent false
  optimization/release decisions, avoiding wasted tuning and regressions. They
  cost builds, runs, cache warm-up, storage, and analysis.
- **Mature null and deduplication:** causal setup checks, randomized link/order
  layouts, Stabilizer-style rerandomization, process/machine blocking,
  hierarchical bootstrap/mixed models, perf-counter and thermal controls.
- **Failure modes:** thousands of repeats from one binary treated as independent
  layouts; run order fixed; outliers deleted post hoc; clock frequency or thermal
  state unlogged; variant alters layout but control does not; p-value without
  effect/interval; mean hides regression tail or protected workload.
- **Measurable prediction:** layout-balanced inference should lower wrong-sign
  optimization decisions under seeded layout interactions while retaining power
  for genuine effects of practical size.
- **Protocol:** [WS-CNV-04](#ws-cnv-04--layout-randomized-performance-inference).
- **Stopping rule:** reject any specialized benchmark harness if conventional
  blocked randomized layouts and hierarchical analysis match its error/cost
  frontier.

### ARCH-01 — Function placement does not erase endpoint obligation

- **Reserved claim:** [C-1408](#c-1408).
- **Evidence status:** established design argument with canonical examples; not
  a theorem forcing every function to endpoints.
- **Computing observation:** Saltzer, Reed, and Clark show that some functions
  require application/end-point knowledge for complete implementation while
  lower layers may still supply useful performance-enhancing partial versions
  [@SaltzerReedClark1984].
- **Proposed AI/system translation:** decide where to place validation, caching,
  compression, retries, safety checks, provenance checks, and semantic
  normalization by complete-information ownership, failure consequences,
  trust/authority, data movement, latency, and duplicate work. Preserve final
  verification when intermediate checks cannot know the complete predicate.
- **Efficiency mechanism:** place cheap common-case filtering or caching near
  data/transport while reserving context-complete verification for endpoints.
  Duplicated checks, state synchronization, stale caches, communication, and
  false trust count against gains.
- **Mature null and deduplication:** end-to-end argument, capability/contract
  boundaries, content-addressed caches, service-function placement, ordinary
  client/server validation, and costed edge/cloud partitioning.
- **Failure modes:** “end-to-end” interpreted as ban on lower-layer help;
  intermediate checksum/authentication treated as application correctness;
  endpoint check removed because lower layer usually works; common-mode
  implementation shared by both checks; placement oracle sees latent failures;
  transfer/privacy/trust cost omitted.
- **Measurable prediction:** hybrid partial-near-source plus complete-endpoint
  checking should dominate either extreme only in regimes with enough cheap
  early rejection/reuse and tolerable duplicate verification.
- **Protocol:** [WS-CNV-05](#ws-cnv-05--end-to-end-function-placement).
- **Stopping rule:** reject a placement policy if ordinary costed dynamic
  programming or constrained optimization matches it, or if speed comes from
  silently weakening endpoint correctness.

### NET-01 — Network measurements are operator- and intervention-qualified

- **Reserved claim:** [C-1409](#c-1409).
- **Evidence status:** established IPPM/ETSI metric-method boundary.
- **Computing observation:** IPPM separates active, passive, and hybrid methods,
  names observation points and Type-P, and states that active traffic influences
  measured quantities to some degree. One-way delay and loss require clock,
  threshold, path, and calibration records; RTT combines two paths
  [@RFC7799; @RFC7679; @RFC7680; @RFC2681; @ETSI_EG_202765_3].
- **Proposed AI/system translation:** a network-aware controller must carry
  metric definition, direction, endpoints, observation points, clocks, packet
  treatment, sampling schedule, timeout/censoring, collection path, and probe
  load. Estimate latent path state separately and retain “not identifiable.”
- **Efficiency mechanism:** sparse probes and calibrated passive/hybrid fusion
  may reduce telemetry while preserving decisions. Bias, clock service, export
  traffic, probe bytes, packet treatment, and missed short events are costs.
- **Mature null and deduplication:** standardized IPPM metrics, passive flow/
  packet observation, active Poisson/periodic probing, hybrid marking, clock
  calibration, state-space estimation, change detection, Candidate 007, and
  Candidate 014.
- **Failure modes:** half-RTT used as one-way delay; timeout changes encoded as
  loss trend; probe class prioritized or rate-limited differently; probe burst
  creates queue; reverse path ignored; clocks drift; average hides outages;
  passive export loss omitted; unobserved path change reported as congestion.
- **Measurable prediction:** operator-aware fusion should improve calibrated
  latent-state estimates and downstream control across clock, path, and probe
  shifts, but abstain more when identification is impossible.
- **Protocol:** [WS-CNV-06](#ws-cnv-06--network-observation-and-probe-perturbation).
- **Stopping rule:** reject the project-specific observer if standard IPPM
  measurement plus a conventional state-space model matches its decision/cost
  frontier or if it uses injected truth online.

### NET-02 — Congestion signals, mechanisms, and operators are distinct

- **Reserved claim:** [C-1410](#c-1410).
- **Evidence status:** established mechanisms and standards; relative algorithm
  performance remains path/workload/deployment qualified.
- **Computing observation:** Jacobson established end-host congestion control
  mechanisms; CUBIC is a Standards Track widely deployed window controller; BBR
  estimates bottleneck bandwidth/RTprop; CoDel/FQ-CoDel act at queues; ECN/L4S
  supplies network signals under specific coexistence assumptions
  [@Jacobson1988; @CardwellEtAl2016BBR; @RFC9438; @RFC8289; @RFC8290; @RFC9331].
- **Proposed AI/system translation:** represent application demand, end-host
  offered rate, router scheduling/AQM/marking, link capacity, path changes,
  retransmission, receiver limits, and policy as separate actors and states.
  Optimize accepted service, fairness, tails, and full work rather than raw send
  rate.
- **Efficiency mechanism:** coordination across these operators can reduce
  standing queues, retransmission, idle capacity, and missed deadlines. It adds
  feedback, estimation, state, and possible loop conflict; no controller is
  presumed universally best.
- **Mature null and deduplication:** C-659--C-661; Reno/CUBIC; BBR-like
  model-based control; ECN; CoDel/FQ-CoDel; fair queueing; admission/load
  shedding; network calculus; constrained MPC; and the prior adaptive-link and
  loop-coordination audit.
- **Failure modes:** random loss called congestion; queue bytes compared across
  variable rates; sender given router queue oracle; raw throughput hides
  retransmissions; fairness omitted; one flow only; reverse ACK path absent;
  receiver/application limit misclassified; controller tested only with itself;
  unstable interaction with AQM.
- **Measurable prediction:** an operator-typed controller should avoid incorrect
  responses to random loss, capacity change, receiver limitation, and AQM change
  while remaining competitive with the best matched mature controller in each
  identifiable regime.
- **Protocol:** [WS-CNV-07](#ws-cnv-07--congestion-rtt-loss-queue-and-operator-boundaries).
- **Stopping rule:** reject the additional architecture if a selector over
  mature controllers plus ordinary change detection matches it, or if gains
  require privileged bottleneck truth.

### DIST-01 — Fan-out tails depend on scale, dependence, and added load

- **Reserved claim:** [C-1411](#c-1411).
- **Evidence status:** established order-statistic relation under independence;
  established empirical/analytical tail-tolerance mechanisms with qualified
  queueing assumptions.
- **Computing observation:** large fan-out makes rare component delays visible at
  the request level. Hedging/replication can reduce latency by spending spare
  capacity, while exact redundancy results rely on explicit service-time and
  dependence assumptions [@DeanBarroso2013; @VulimiriEtAl2013;
  @GardnerEtAl2017].
- **Proposed AI/system translation:** for expert ensembles, retrieval shards,
  agent/tool fan-out, speculative branches, and distributed inference, model
  branch count, completion rule, joint tails, shared causes, queue load,
  cancellation delay, useful result, and duplicate compute.
- **Efficiency mechanism:** delay or selectively launch redundant work when
  conditional residual latency exceeds its marginal load cost. Benefit requires
  diversity/spare capacity and fast cancellation; correlation and saturation
  destroy it.
- **Mature null and deduplication:** join-the-shortest-queue, power-of-\(d\),
  capacity reservation, static percentile hedge, adaptive hedge, timeout retry,
  redundancy-\(d\), request splitting, approximate/partial completion, and load
  shedding.
- **Failure modes:** independent copies assumed under common pause; backup work
  counted as zero after cancel; p99 estimated from too few requests; branch p99
  reported as request p99; hedge tuned on confirmation; successes counted twice;
  overload episodes removed; mean improves while protected p99.9 worsens.
- **Measurable prediction:** adaptive hedging should improve tail latency only
  below a measurable utilization/correlation/cancellation boundary and should
  disable itself before positive feedback causes self-congestion.
- **Protocol:** [WS-CNV-08](#ws-cnv-08--fan-out-tail-and-hedge-load).
- **Stopping rule:** reject an AI-specific “reflex path” if ordinary tail-aware
  load balancing/hedging matches it or if apparent savings exclude duplicate
  work.

### VISQ-01 — Displays and scalar scores are lossy quality operators

- **Reserved claim:** [C-1412](#c-1412).
- **Evidence status:** graphical-perception and uncertainty-display effects are
  established for cited tasks; the SQuaRE quality vector and cited legal duties
  are authoritative within scope; one universal display or quality aggregator
  is not established.
- **Computing observation:** elementary visual encodings differ in perceptual
  accuracy. Error bars and alternative uncertainty displays change inference and
  decisions. ISO/IEC 25010 provides a nine-characteristic product model and
  ISO/IEC 25040 an evaluation framework, while European/German duties remain
  applicability- and lifecycle-qualified [@ClevelandMcGill1984;
  @CorrellGleicher2014; @FernandesEtAl2018; @ISOIEC25010_2023;
  @ISOIEC25040_2024; @EU_CRA_2024_2847; @EU_NIS2_2022_2555;
  @DE_BSIG_2025].
- **Proposed AI/system translation:** retain raw data, uncertainty object,
  encoding version, task, accessibility alternatives, decoded decision, full
  quality vector, stakeholder thresholds, and hard obligations. Use charts and
  scalar summaries for navigation, never as irreversible replacement.
- **Efficiency mechanism:** task-matched encoding and staged quality evaluation
  can reduce reading/review effort and prioritize work. Extra displays,
  accessibility alternatives, lifecycle evidence, and review are counted.
- **Mature null and deduplication:** tables/direct labels; position/length
  encodings; distribution/quantile displays; user testing; EN 301 549;
  ISO/IEC 25010/25040; Pareto/MCDA and constraint gates; risk registers;
  compliance applicability matrices; Candidates 009 and 014.
- **Failure modes:** 3-D/area/colour encoding used for precision tasks; colour
  only; uncertainty omitted or mislabeled; viewer simulation called human
  evidence; weighted score compensates security/safety/legal failure; future CRA
  duties stated as presently general-applicable; NIS2 scope assumed; quality
  evidence frozen at release despite lifecycle change.
- **Measurable prediction:** task-typed displays should lower synthetic decoding
  and decision loss across plausible reader models, and vector-plus-hard-
  constraint release gates should reduce invalid releases without hiding
  trade-offs. Human claims still require preregistered accessible human studies.
- **Protocols:** [WS-CNV-09](#ws-cnv-09--graphical-perception-and-uncertainty-encoding)
  and [WS-CNV-10](#ws-cnv-10--vector-quality-and-lifecycle-obligations).
- **Stopping rule:** reject a project-specific display/quality layer if ordinary
  task-tested encodings plus SQuaRE/constraint evaluation match it, or if it
  achieves concision by deleting uncertainty, protected dimensions, scope, or
  lifecycle state.

## Workstation falsification contracts

### Common execution and inference contract

- **Boundary:** CPU-only, synthetic data, no production traffic, no personal
  data, and no claim of compiler, network-protocol, accessibility, or legal
  conformity. Each protocol must run on at most 12 logical CPU threads, 16 GiB
  RAM, and 20 GiB artifact storage. The preregistered confirmation run must
  finish within 12 wall-clock hours per protocol on the declared workstation.
- **Environment:** record OS/build, CPU model and microcode, core affinity,
  power/frequency policy, memory, compiler/runtime/package lock, locale,
  timezone, environment-variable byte count, and code/configuration SHA-256.
  Disable network access during confirmation. Protocols that emulate protocols
  are mechanism tests, not wire-conformance implementations.
- **Random generator:** NumPy PCG64DXSM or a bit-exact documented equivalent.
  Use namespaces 'CNV/<protocol>/<stage>/<seed>/<component>' so workload,
  topology, compiler fault, layout, reader, and observation noise streams never
  share state.
- **Stages and seeds:** smoke seeds 11 and 29; development seeds 10001--10040;
  80 sealed confirmation seeds per protocol. Before confirmation, publish
  SHA-256 commitments to the sorted seeds and frozen code/config archive; reveal
  seeds only after outputs are immutable. There are 800 protocol-seed
  confirmation units across the ten protocols.
- **Split discipline:** generators expose fit, tuning, and confirmation
  partitions. Programs from one grammar ancestry, functions from one call
  graph, layouts from one base binary, requests from one queue episode, paths
  from one topology, charts from one numeric item, and months from one product
  lifecycle never cross partitions. Confirmation contains unseen joint factor
  combinations and at least one held-out mechanism form.
- **Parity:** non-oracle arms receive identical observable inputs, fit/tuning
  calls, CPU-seconds, and failure/action authority. Extra profiles, probes,
  replicas, compiles, endpoints, charts, checks, reviews, or retained evidence
  are priced. Oracle arms are diagnostic ceilings and cannot be promoted.
- **Primary analysis:** retain every seed and failed run. Compare each evaluated
  contract with the strongest tuned mature null using paired seed-level effects.
  Report median, 5th/95th percentiles, and two-sided 95% percentile-bootstrap
  intervals from 10,000 resamples. Apply Holm correction across the ten
  protocol-level primary promotion tests. Report raw and corrected \(p\)-values
  only alongside effect sizes and intervals.
- **Tail analysis:** use a mergeable quantile sketch only for online control;
  retain exact confirmation latencies for final p50/p95/p99/p99.9. A protocol
  estimating p99.9 must generate at least 200,000 completed independent requests
  per seed or label it exploratory.
- **Coverage:** for nominal 95% intervals, acceptable empirical marginal
  coverage is 92--98%, with conditional coverage and interval width by hostile
  stratum. Passing average coverage cannot compensate for a protected-stratum
  undercoverage below 90%.
- **Protected outcomes:** correctness violations, false bug confirmations,
  wrong-sign optimization decisions, invalid endpoint acceptance, false
  network localization, overload, p99.9 regression, inaccessible information,
  false legal-scope assertion, and hard-obligation violation are
  non-compensatory. Report the full vector and Pareto set.
- **Threshold meaning:** all numeric gates below are experiment-selection
  criteria, not natural constants, legal thresholds, guaranteed effects, or
  estimates of current systems. Freeze them before confirmation.
- **Artifacts:** every protocol retains 'run-manifest.json', frozen generator
  and arm configs, seed commitment/reveal files, raw latent state, raw
  observations, operator/version record, fit state, decisions, uncertainty,
  resource telemetry, invariants, exception log, per-unit results, aggregate
  tables, SVG/PNG plots plus plotting source, and SHA-256 manifest. Store smoke,
  development, and confirmation roots separately.
- **Global rejection:** reject a transfer if a mature null reaches the same
  protected-outcome/resource frontier; a gain uses latent truth, leaked
  confirmation cases, undefined semantics, deleted failures, unpriced work, or
  post-hoc thresholds; an invariant fails; or the method produces only a more
  elaborate record without a better decision or a newly exposed invalid
  inference.

### WS-CNV-01 — Semantic preconditions and compiler refinement

- **Claim/hypothesis:** C-1404. An explicit definedness and semantic-refinement
  contract should reduce false assurance and false miscompilation claims without
  hiding seeded defects.
- **Independent unit and size:** one generated program ancestry under one
  language/environment configuration. Per seed create 12,000 ancestries: 4,000
  fit, 2,000 tune, and 6,000 held-out. Each has 1--4 equivalent variants and
  20--200 dynamic operations.
- **Generator:** a deterministic, typed imperative language with signed/unsigned
  fixed-width integers, floats, arrays, conditionals, loops, functions, shifts,
  division, casts, sequence points, and configurable implementation choices.
  Generate 40% fully defined cases, 20% unspecified but bounded cases, 15%
  implementation-defined cases, 20% executions reaching one of twelve explicit
  undefined conditions, and 5% resource-limit cases. A small reference
  interpreter enumerates permitted behaviours for non-UB executions. Inject
  18 transformation faults covering overflow assumption, algebraic rewrite,
  dead-code elimination, load/store reorder, bounds, shift, NaN/signed-zero,
  alias, and target-width mistakes; four confirmation faults are held-out forms.
- **Observations:** source/IR, language edition, configuration, input, compiler
  success/failure, executable output/trace, sanitizer flags, and transformation
  certificate. Latent UB label and fault injection are unavailable to evaluated
  arms.
- **Arms and mature nulls:** (A) output equality after successful compilation
  with no validity filter; (B) conventional sanitizer plus reference-interpreter
  test on cases the sanitizer accepts; (C) precondition proof/check plus
  per-pass translation validation and explicit unsupported verdict; (D)
  property-based testing with the same validity checker but no translation
  validation; (E) exact generator truth and interpreter relation, diagnostic
  only.
- **Perturbations:** integer width/endian/config choices, optimization level,
  loop bound, alias pattern, floating-point edge values, nondeterministic allowed
  choices, resource exhaustion, fault location, and source-to-IR preprocessing
  version.
- **Metrics:** false confirmed miscompilations and false “correct” verdicts per
  10,000 cases; seeded-defect recall/precision; unsupported/abstention rate;
  permitted-behaviour set coverage; certificate bytes; interpreter/validation
  CPU-ms/program; peak MiB; and review-proxy minutes per confirmed defect.
- **Invariants:** the interpreter reproduces all generated defined executions;
  UB cases are never assigned a singleton output oracle; equivalent variants
  preserve the enumerated behaviour set; fault-off compiler agrees with the
  interpreter on at least 99.99% of smoke defined cases before confirmation.
- **Promotion gate:** C must reduce the sum of false confirmed defects and false
  correctness verdicts by at least 80% relative to the stronger of B/D, retain
  seeded-defect recall within 2 percentage points, keep defined-case abstention
  below 5%, and consume at most 1.5 times the stronger null's CPU-plus-review
  cost; the Holm-adjusted interval for error reduction must exclude zero.
- **Rejection gate:** reject if B/D matches the frontier; C labels any UB case
  correct; more than 10% of held-out fault forms are lost; certificate checking
  uses injection labels; or a numerical tolerance is tuned on confirmation.
- **Required artifacts:** grammar/configuration schema, semantic rules, ancestry
  graph, permitted behaviour sets, IR/pass traces, fault map, validation
  certificates, reduction transcript, verdict confusion matrices, and
  cost-by-semantic-class plots.

### WS-CNV-02 — Differential compiler testing and oracle ambiguity

- **Claim/hypothesis:** C-1405. A validity- and oracle-typed differential
  pipeline should convert disagreements into confirmed defects more efficiently
  and with fewer false confirmations than raw or majority differential testing.
- **Independent unit and size:** one synthetic compiler population and generator
  family. Per seed generate 48 populations, each with five compilers and 10,000
  test ancestries; 24 populations tune adjudication and 24 are held out.
- **Generator:** reuse the language semantics from WS-CNV-01 but create compiler
  populations with independent bugs, shared-backend bugs, two-majority common
  bugs, wrong reference interpreter plug-ins, nondeterministic code, timeouts,
  crashes, and documented implementation choices. Generate ordinary random,
  Csmith-like validity-preserving, and EMI/metamorphic variants. Confirmation
  holds out one common-mode defect topology and one nondeterminism mechanism.
- **Observations:** per-compiler exit status, output/trace, runtime, flags,
  environment digest, metamorphic relation, reducer trace, and reviewer
  evidence packet. Fault ownership and semantic truth are hidden.
- **Arms and mature nulls:** (A) two-compiler mismatch; (B) five-compiler
  majority vote; (C) validity-preserving Csmith-like differential testing plus
  reduction; (D) C plus EMI/metamorphic relations, semantic-category triage, and
  independent adjudication; (E) exact semantic/fault oracle, diagnostic only.
- **Perturbations:** number and diversity of compilers, shared-code fraction,
  bug prevalence, generator coverage, UB leakage, nondeterminism, timeout,
  platform configuration, reducer invalidation, and adjudication budget.
- **Metrics:** confirmed unique defect recall; false confirmation per 1,000
  reports; unresolved rate; reports reviewed per confirmed defect; median
  reduced test size in AST nodes; time-to-confirm in CPU-s; generator semantic
  feature coverage; common-mode miss rate; and bytes/report.
- **Invariants:** test identity and flags match across compilers; reductions
  preserve semantic class and disagreement; no majority result is injected as
  truth; confirmation compiler populations are not used to tune generator
  probabilities.
- **Promotion gate:** D must reduce false confirmations by at least 50% and
  review-proxy time per confirmed defect by at least 20% versus C, retain unique
  defect recall within 3 percentage points, and detect at least 50% of held-out
  majority-common defects through metamorphic/semantic evidence.
- **Rejection gate:** reject if C matches D; D's yield comes only from more test
  executions; common-mode defect recall is below C; more than 2% of accepted
  reductions change semantic class; or unresolved cases are silently counted as
  compiler bugs.
- **Required artifacts:** compiler-population dependency graphs, tests and
  variants, semantic feature vectors, outputs/status, disagreement clusters,
  reducer steps, adjudication labels/reasons, defect lineage, and cumulative
  confirmed-defect-versus-CPU curves.

### WS-CNV-03 — PGO/JIT specialization under workload shift

- **Claim/hypothesis:** C-1406. A versioned workload contract with shift-aware
  fallback should preserve most specialization benefit in-support and reduce
  negative transfer after shift, after all profiling and compilation costs.
- **Independent unit and size:** one call graph and deployment episode. Per seed
  generate 240 graphs: 100 fit, 40 tune, 100 held out. Each episode has 300,000
  requests in six 50,000-request phases.
- **Generator:** directed call graphs of 64--512 functions with 4--32 KiB code,
  branch/call transition distributions, instruction-cache capacity, tiered
  compilation costs, and correctness-preserving alternative layouts/inlining.
  Workloads include stationary Zipf hot paths, gradual drift, abrupt phase
  change, cyclic return, rare protected paths, architecture change, and code
  version mismatch. Latency is simulated in microseconds/request from declared
  execution/cache/compile work; actual simulator CPU and energy telemetry remain
  separate.
- **Observations:** request/phase IDs, executed call edges, sampled profiles,
  profile/code/configuration versions, chosen layout/tier, cache events,
  compile/deoptimization/fallback events, simulated request latency, and actual
  simulator resource telemetry. Future phases and latent hot-path distributions
  are hidden from A--D.
- **Arms and mature nulls:** (A) static robust -O2-like policy; (B) conventional
  offline PGO using the initial profile; (C) tiered JIT with hotness thresholds
  and deoptimization; (D) recency-weighted PGO/JIT with profile-version
  compatibility, change detection, and fallback; (E) workload-oracle layout and
  tier, diagnostic only.
- **Perturbations:** profile sample rate, profile age, hot-path concentration,
  phase length, cache size, compile cost, deoptimization cost, code size,
  protected-path weight, change detector false alarms, and profile mismatch.
- **Metrics:** mean/p95/p99 simulated \(\mu\)s/request by phase; net
  \(\mu\)s/request including amortized profile/compile/deopt; code bytes;
  compile/profile CPU-s; requests to amortization crossover; negative-transfer
  rate; protected-path deadline misses per 100,000; fallback delay in requests;
  actual simulator CPU-s, MiB, and measured J.
- **Invariants:** every arm executes the same semantic work; request traces are
  paired; cache and compile accounting closes to \(10^{-9}\) relative; code
  version mismatch cannot consume an old profile without an explicit arm rule.
- **Promotion gate:** D must reduce post-shift negative-transfer episode rate by
  at least 50% versus the better of B/C, retain at least 80% of that comparator's
  in-support net latency gain, keep protected-path deadline misses no worse than
  A by 0.2 percentage points, and add at most 15% compile/profile CPU.
- **Rejection gate:** reject if C matches D; D requires oracle change points;
  gains disappear after warm-up/compile cost; fallback takes more than one phase
  in over 5% of episodes; or average gain hides a protected-path regression over
  the margin.
- **Required artifacts:** call graphs, phase/workload distributions, profile and
  code version records, layouts/tiers, cache traces, compile/deopt events,
  per-request cost, crossover curves, negative-transfer heatmaps, and resource
  ledger.

### WS-CNV-04 — Layout-randomized performance inference

- **Claim/hypothesis:** C-1407. Randomizing and modeling executable layout should
  reduce wrong-sign and false-positive optimization conclusions compared with
  repeated runs of one binary.
- **Independent unit and size:** one synthetic benchmark study. Per seed generate
  2,000 studies: 800 with zero true effect, 800 with effects uniformly from
  -3% to +3%, and 400 with protected-stratum interactions. Each study permits 32
  layouts, four process invocations/layout, and ten repeats/invocation.
- **Generator:** hierarchical latency model with code/data/stack layout random
  effects, variant-by-layout interaction, process noise, autocorrelation,
  thermal drift, frequency states, run-order carryover, and 0.2% genuine fault
  outliers. Confirmation holds out multimodal layout effects and nonlinear
  thermal carryover.
- **Observations:** variant/build/layout/process/repeat IDs, randomized run
  order, latency, registered thermal/frequency covariates, fault flags available
  only to the diagnostic arm, and full setup/runtime cost. True effect and
  generative random components are hidden from A--D.
- **Arms and mature nulls:** (A) one layout, 320 repeated iterations, unpaired
  test; (B) 32 layouts measured variant-first, ordinary bootstrap over all
  repeats; (C) 32 paired randomized layouts, blocked order, hierarchy-aware
  mixed model/bootstrap; (D) C plus preregistered thermal/frequency covariates
  and robust sensitivity; (E) true generative effect, diagnostic only. All arms
  receive equal total runs.
- **Perturbations:** layout variance, interaction sign, process variance,
  autocorrelation, thermal slope, outlier mechanism, effect size, sample
  allocation, and workload-stratum imbalance.
- **Metrics:** false-positive rate at zero effect; wrong-sign decision rate for
  \(|\Delta|\ge0.5\%\); power at 1% and 2%; 95% coverage/width; optimization
  regret in percentage points; builds/runs; CPU-s; and analyst-proxy minutes.
- **Invariants:** paired variants share latent workload and machine block but
  not the same forced address; total run count matches; fit never sees true
  effect; outliers remain in primary analysis; hierarchy labels survive export.
- **Promotion gate:** C or D must keep zero-effect false positives in 3.5--6.5%,
  achieve 92--98% coverage, reduce wrong-sign decisions by at least 60% versus
  A and 30% versus B, and retain at least 80% power for a 2% effect at equal run
  count.
- **Rejection gate:** reject the layout contract if B matches C/D; coverage is
  bought by intervals wider than twice B's median without lower regret; results
  require deleting fault outliers; or layouts are treated as independent while
  sharing one fixed address map.
- **Required artifacts:** latent study parameters, layout maps/IDs, run-order
  schedule, all latency observations, thermal/frequency series, fitted variance
  components, effect intervals, sign decisions, calibration plots, and run-cost
  accounting.

### WS-CNV-05 — End-to-end function placement

- **Claim/hypothesis:** C-1408. A hybrid placement that prices complete
  information and preserves endpoint verification should beat endpoint-only or
  misplaced-intermediate extremes only in identifiable reuse/early-rejection
  regimes.
- **Independent unit and size:** one service DAG and state distribution. Per seed
  generate 1,000 DAGs: 400 fit, 200 tune, 400 held out; each contains 20--100
  functions across endpoint, edge, and core layers and 50,000 requests.
- **Generator:** functions include compression, cache, checksum, authentication,
  schema validation, semantic validation, deduplication, retry, and final commit.
  Each has layer-specific compute in \(\mu\)s, bytes, joules, trust exposure,
  state freshness, detection coverage, false reject/accept rates, and failure
  consequence. Generate 0--80% early-reject prevalence, 0--95% cache reuse,
  correlated/common-mode defects, stale state, asymmetric bandwidth, privacy
  constraints, and endpoint-only predicates. Hold out one trust-failure and one
  cache-invalidation mechanism.
- **Arms and mature nulls:** (A) all eligible work/end validation at endpoint;
  (B) maximum early/intermediate placement with endpoint checks removed; (C)
  conventional expected-cost dynamic program with mandatory endpoint predicates;
  (D) robust/scenario constrained placement with mandatory endpoint predicates;
  (E) versioned state/authority-aware hybrid policy; (F) latent-state placement
  oracle, diagnostic only.
- **Observations:** declared function costs, sampled failure/reuse history,
  trust/authority tags, state age, request class, and endpoint outcome. Latent
  future defects/reuse are hidden.
- **Perturbations:** early-reject prevalence, cache reuse, bandwidth asymmetry,
  function cost, endpoint availability, state staleness, defect correlation,
  trust boundary, privacy constraint, proxy error, request mix, and failure
  consequence.
- **Metrics:** valid accepted requests/s; mean/p99 latency in ms; bytes/request;
  J/valid request; duplicate verification CPU-ms; invalid accepts and valid
  rejects per 100,000; privacy/trust violations; stale-cache escapes; endpoint
  verifier availability; and placement recomputations.
- **Invariants:** endpoint-only predicates cannot be evaluated by intermediate
  arms without an explicit proxy; conservation of bytes/work closes; every
  accepted request has a recorded final predicate result; oracle state is absent
  from A--E.
- **Promotion gate:** E must reduce latency-plus-transfer cost by at least 10%
  versus the better of C/D in the preregistered applicable strata, keep invalid
  accepts non-inferior by 0.1 percentage points, preserve 100% endpoint
  verification for endpoint-only predicates, and add no more than 20% placement
  computation.
- **Rejection gate:** reject if C/D matches E; benefit exists only after removing
  final checks; privacy/trust constraints are scalarized away; stale-state
  escapes exceed D by 0.2 percentage points; or no preregistered region predicts
  when hybrid placement wins.
- **Required artifacts:** DAG/layer graphs, function information/authority
  matrix, scenario costs, placement decisions, cache/state versions, endpoint
  verdicts, per-request work/bytes/energy, failure traces, Pareto fronts, and
  applicability-region plot.

### WS-CNV-06 — Network observation and probe perturbation

- **Claim/hypothesis:** C-1409. An IPPM-style operator record and
  intervention-aware passive/active fusion should improve state estimates and
  control decisions under clock, direction, Type-P, timeout, and path shifts
  without creating material self-measurement bias.
- **Independent unit and size:** one directed topology episode. Per seed generate
  600 episodes: 240 fit, 120 tune, and 240 held out. Each lasts 900 simulated
  seconds at 10 ms resolution with 3--12 hops and two directions.
- **Generator:** fluid/packet-batch hybrid queues with 10--1,000 Mbit/s links,
  2--200 ms propagation RTT, variable service, cross traffic, priority and
  policer classes, route changes, random corruption/filter loss, receiver delay,
  timestamp quantization, clock offset/drift, telemetry export loss, and active
  probes from 0.001% to 5% of bottleneck capacity. Probe Type-P may share or not
  share ordinary treatment. Hold out reactive routing and delayed post-probe
  queue effects.
- **Observations:** source/destination host timestamps, optional synchronized
  one-way timestamps, passive samples at registered points, probe sequence/
  Type-P/rate, timeouts, exported queue/mark counters, and accepted application
  outcomes. True per-hop state and cause labels are hidden.
- **Arms and mature nulls:** (A) periodic ping with RTT/2 as one-way and timeout
  as loss; (B) standards-typed active measurement with clock calibration; (C)
  passive multi-point observation; (D) hybrid state-space model carrying
  direction, Type-P, clocks, path version, censoring, and probe input; (E)
  Candidate-007-style joint state/observation model at the same data budget; (F)
  true path/queue state, diagnostic only.
- **Perturbations:** probe rate/burstiness, Type-P priority/policing, clock
  quality, asymmetric routing, reverse ACK delay, loss threshold, collector
  dropout, path-change frequency, link variability, and background load.
- **Metrics:** forward/reverse delay RMSE in ms; 95% coverage; loss-probability
  Brier score; bottleneck-capacity MAE in Mbit/s; queue-sojourn MAE in ms;
  cause-class macro-F1; false congestion actions per 1,000; deadline misses;
  probe/export bytes and capacity percent; probe-induced p99 increase in ms;
  CPU-s and MiB.
- **Invariants:** queue/link conservation closes to \(10^{-8}\) relative;
  timestamp errors equal stored clock model; timeouts remain censored rather
  than infinite delay; ordinary and probe Type-P labels are immutable; arms do
  not receive route/cause truth.
- **Promotion gate:** D/E must reduce downstream false congestion actions plus
  deadline misses by at least 15% versus the strongest of B/C, achieve 92--98%
  delay coverage, keep median probe load below 0.25% capacity and probe-induced
  p99 below 1 ms or 2% (whichever is larger), and abstain rather than localize
  when posterior cause probability is below a frozen threshold.
- **Rejection gate:** reject if B/C matches; benefit requires probes over 1%
  capacity in more than 5% of episodes; probe and ordinary traffic have
  unreported treatment differences; clock truth leaks; or cause accuracy rises
  while action loss worsens.
- **Required artifacts:** topology/path epochs, link/queue truth, clock traces,
  all packet/probe records, Type-P definitions, observation points, timeouts,
  passive/export samples, posterior state/cause, control actions, perturbation
  curves, and telemetry cost.

### WS-CNV-07 — Congestion, RTT, loss, queue, and operator boundaries

- **Claim/hypothesis:** C-1410. An operator-typed controller should avoid
  misreacting to non-congestion loss, receiver/application limits, and AQM/path
  changes while matching strong transport/AQM nulls in their native regimes.
- **Independent unit and size:** one multi-flow bottleneck episode. Per seed
  generate 480 episodes: 160 tune and 320 held out, each with 4--64 flows and
  300 simulated seconds after warm-up.
- **Generator:** deterministic fluid/discrete-event mechanism emulator with
  10--1,000 Mbit/s bottlenecks, base RTT 5--200 ms, buffers 0.25--4 BDP, FIFO or
  per-flow queues, drop-tail/CoDel-like/ECN-like signals, application-limited
  and receiver-window-limited flows, 0--2% independent random loss, capacity
  steps, route changes, ACK compression, and competing RTTs. It is explicitly
  not a CUBIC/BBR/CoDel conformance implementation.
- **Arms and mature nulls:** (A) Reno-like loss controller; (B) RFC-9438-inspired
  CUBIC mechanism; (C) BBR-inspired bottleneck-bandwidth/min-RTT mechanism; (D)
  CUBIC plus FQ-CoDel/ECN-like queue; (E) constrained selector using only typed
  observable operator state with safe fallback among B--D; (F) receding-horizon
  controller at equal telemetry/compute; (G) latent mechanism oracle, diagnostic
  only.
- **Perturbations:** congestion versus corruption loss, AQM type/version, RTT
  heterogeneity, cross traffic, buffer/rate changes, reverse-path load,
  application/receiver limitation, ECN bleaching, flow churn, and model
  mismatch.
- **Observations:** endpoint send/ack/receive times, bytes accepted/dropped/
  retransmitted, RTT samples, loss and ECN signals, declared application and
  receiver limitations, and only the queue/path telemetry allocated to each
  arm. True bottleneck capacity, per-packet loss cause, and future path/AQM
  changes are hidden from A--F.
- **Metrics:** accepted goodput Mbit/s; p50/p99/p99.9 RTT in ms; queue sojourn ms;
  deadline misses per 100,000; retransmitted/duplicate bytes percent; Jain
  fairness; link utilization percent; loss/mark rates; controller oscillation
  events/min; recovery seconds; and CPU-s/flow-s.
- **Invariants:** offered, accepted, dropped, marked, and retransmitted bytes
  reconcile to \(10^{-7}\) relative; all arms share arrivals/topology; no arm
  except G sees capacity/cause labels; each mature mechanism passes its own
  smoke-regime direction checks before confirmation.
- **Promotion gate:** E/F must reduce normalized regret versus the best eligible
  mature arm per episode by at least 20%, keep p99 RTT no worse than D by 5%,
  goodput no worse than the best arm by 3%, Jain fairness no worse by 0.02, and
  halve false rate reductions during pure random-loss/application-limited
  strata.
- **Rejection gate:** reject if a frozen selector over B--D matches E/F; one
  mature arm is deliberately mistuned; controller sees bottleneck truth; p99.9
  worsens over 5%; instability appears with an unseen AQM; or retransmission work
  is excluded from efficiency.
- **Required artifacts:** episode/topology configs, all flow and queue time
  series, offered/accepted/retransmitted byte ledgers, marks/loss causes, arm
  state/actions, fairness/tail curves, regime confusion matrix, oscillation
  events, and per-episode regret.

### WS-CNV-08 — Fan-out tail and hedge load

- **Claim/hypothesis:** C-1411. A correlation- and load-aware hedge should lower
  whole-request tails only inside a reproducible spare-capacity boundary and
  disable itself before load amplification causes self-congestion.
- **Independent unit and size:** one fork--join service episode with 200,000
  completed requests, sufficient for exploratory p99.9. Per seed generate 120
  episodes: 40 tune and 80 held out.
- **Generator:** 32--512 servers and fan-out 8--256; lognormal, Weibull, Pareto,
  and two-state service distributions; Gaussian-copula/common-shock dependence
  0--0.9; utilization 0.2--0.97; FCFS or shortest-queue dispatch; 0--50 ms
  cancellation delay; partial versus all-branch completion; correlated rack/
  runtime pauses; deadline/correctness outcomes. Hold out a slow-cancel overload
  wave and tail dependence not represented by linear correlation.
- **Observations:** request/branch/server IDs, arrivals, dispatch, completions,
  deadlines, observable queue/load summaries, hedge and cancellation events,
  accepted/partial outcomes, and charged work. Future service times, latent
  common shocks, and unused replica outcomes are hidden from A--F.
- **Arms and mature nulls:** (A) join-shortest-queue with no hedge; (B) timeout
  retry after failure; (C) static p95 delayed hedge; (D) redundancy-\(d=2\)
  with first completion and cancellation; (E) adaptive conditional-residual-
  latency hedge with token/load/correlation guard; (F) capacity reservation plus
  no hedge; (G) future-service oracle, diagnostic only.
- **Perturbations:** fan-out, utilization, service tail, dependence, branch
  placement, hedge threshold, token budget, cancellation time/work, shared
  queue, deadline, and partial-result rule.
- **Metrics:** request p50/p95/p99/p99.9 in ms; deadline misses; successful
  requests/s; total and useful CPU-s/request; duplicate CPU percent; cancellation
  lag/work; peak/mean utilization; overload time percent; queue area in
  request-s; error/partial-result rate; and J/accepted result.
- **Invariants:** one request contributes one accepted result; all primary and
  hedge work is charged until cancellation completes; fan-out completion rule is
  immutable; exact stored quantiles match sorted raw samples; paired arms share
  arrival/service potential streams without reusing realized queue state.
- **Promotion gate:** E must lower p99 by at least 15% versus the strongest of
  A/C/D/F in the preregistered applicable region, use at most 10% duplicate CPU,
  keep p99.9 and deadline misses non-inferior by 3%, and correctly suppress
  hedging in at least 90% of high-utilization/high-dependence episodes.
- **Rejection gate:** reject if C/D/F matches E; benefit appears only with
  instantaneous cancellation or independent replicas; overload time rises by
  more than 1 percentage point; p99 gain disappears when duplicate work is
  priced; or no held-out factor region predicts benefit/harm direction.
- **Required artifacts:** service/arrival/common-shock streams, dispatch and
  branch mapping, per-request branch latencies, hedge/cancel events, useful/
  duplicate work, exact latency arrays, queue/utilization traces, applicability
  surface, and overload feedback plots.

### WS-CNV-09 — Graphical perception and uncertainty encoding

- **Claim/hypothesis:** C-1412. A task-typed, uncertainty-preserving display
  should be robust across plausible decoding models and accessibility
  perturbations; synthetic success only promotes a design to human testing.
- **Independent unit and size:** one numeric item and task. Per seed generate
  60,000 items: 20,000 comparison, 20,000 probability/interval, 10,000 trend,
  and 10,000 threshold decisions. All encodings of an item remain in one split.
- **Generator:** exact values and posterior/predictive distributions with close
  ratios, unequal variance, skew, multimodality, bounded values, rare events,
  missingness, and conflicting mean/tail. Render to SVG and a deterministic
  raster at 320x200, 640x400, and 1280x800. Simulated reader families include
  exact geometry extraction; position/length/angle/area Weber noise over broad
  preregistered ranges; interval-endpoint heuristics; frequency/quantile
  interpretation; blur/low contrast; three colour-vision deficiency transforms;
  and text/table readers. These are stress models, not human participants.
- **Observations:** task/loss statement, rendered SVG or raster, exposed labels,
  alt text/table where provided, declared uncertainty annotations, and reader-
  model outputs. Reader arms receive only information encoded by that display;
  exact item/distribution truth is reserved for G and scoring.
- **Arms and mature nulls:** (A) direct table with labels; (B) common baseline
  position/length chart; (C) angle/area/colour-only chart; (D) mean plus error
  bar; (E) quantile dotplot/CDF or sampled-outcome display; (F) task-adaptive
  display with direct values, uncertainty, redundant non-colour channel, and
  machine-readable table; (G) exact-data decision oracle.
- **Perturbations:** task, effect size, uncertainty form, sample size,
  resolution, mark density, axis truncation, annotation, colour/contrast,
  missing value, reader noise family, and loss asymmetry.
- **Metrics:** normalized decoding error; comparison reversal per 1,000;
  probability/interval absolute error; threshold-decision regret in declared
  loss units; calibration/Brier score; response-information bits; inaccessible
  item rate by transform; SVG/PNG bytes; render CPU-ms; and simulated read
  operations.
- **Invariants:** every encoding derives from identical data and uncertainty;
  axes/transforms are logged; direct table values round-trip exactly; raster
  geometry matches SVG within one pixel; no arm except G receives latent truth
  beyond displayed information.
- **Promotion gate:** F must reduce worst-reader-family median decision regret by
  at least 20% versus the strongest eligible A/B/E arm, have no inaccessible
  information under the registered colour/blur transforms, keep decoding error
  non-inferior by 0.01 range units in every task, and stay below twice the
  strongest null's file/render cost.
- **Rejection gate:** reject if A/B/E matches F; benefit depends on a reader
  model tuned to F; direct labels or uncertainty are missing; any protected
  transform loses decision-critical information; or results are described as
  human evidence.
- **Required artifacts:** item/distribution truth, task/loss matrices, SVG and
  raster outputs, encoding source/spec, alt text and table, reader-model
  parameters/seeds, decoded values/actions, accessibility transforms, regret
  curves, and a mandatory “synthetic only—human validation required” report.

### WS-CNV-10 — Vector quality and lifecycle obligations

- **Claim/hypothesis:** C-1412. A quality-vector plus applicability-specific hard
  constraint and lifecycle ledger should reduce invalid releases and late
  security responses compared with scalar quality scores at similar evaluation
  burden.
- **Independent unit and size:** one synthetic product/entity lifecycle. Per
  seed generate 20,000 lifecycles: 8,000 fit, 4,000 tune, 8,000 held out. Each
  spans 1--10 simulated years in monthly product steps and hourly incident
  subepisodes.
- **Generator:** nine correlated quality characteristics with measurement error,
  stakeholder thresholds, release candidates, vulnerabilities, dependencies,
  support periods, end-of-support, maintenance capacity, security incidents,
  accessibility barriers, entity/product scope facts, law applicability/effect
  dates, and evidence expiry. Generate in-scope/out-of-scope/ambiguous CRA,
  NIS2/BSIG, and accessibility cases; no synthetic rule is asserted to be a
  complete legal encoding. Hold out a lex-specialis conflict and a supplier
  support-chain failure.
- **Observations:** measured quality vector with uncertainty, versioned product/
  entity and scope facts, applicable-rule candidates, evidence age/lineage,
  release alternatives, support/dependency events, vulnerability/incident
  observations, accessibility records, lifecycle clocks, and review-queue
  state. Exact scope resolution and future events are hidden from A--E.
- **Arms and mature nulls:** (A) one benchmark/release score; (B) weighted MCDA
  over all nine quality axes; (C) SQuaRE-style vector, fixed acceptance
  thresholds, risk register, and conventional applicability/compliance matrix;
  (D) C plus versioned evidence, hard non-compensatory constraints, support/
  vulnerability/incident lifecycle timers, and scope uncertainty escalation;
  (E) constrained/Pareto optimizer with the same ledger; (F) exact synthetic
  scope/future event oracle, diagnostic only.
- **Perturbations:** metric correlation/error, stakeholder weights, rare severe
  security/safety failures, scope ambiguity, law effect date, support duration,
  supplier end-of-support, incident discovery delay, evidence staleness,
  reporting capacity, accessibility alternative, and false positive alert load.
- **Metrics:** invalid releases and valid blocks per 1,000; hard-constraint
  trade-off violations; Pareto-dominated releases; vulnerability exposure days;
  support shortfall months; late 24 h/72 h/one-month synthetic report stages;
  accessibility-critical misses; time to detection/correction in hours; review-
  proxy minutes/release; evidence bytes/month; CPU-s; and total lifecycle loss
  by separately reported component.
- **Invariants:** rule/effect dates and scope facts are versioned; future rules
  cannot block earlier decisions unless the simulated requirement explicitly
  requires preparation; no weighted score can override a hard applicable
  constraint in C--E; every incident/report clock derives from one stored event;
  ambiguous scope is not silently coerced to in or out.
- **Promotion gate:** D/E must reduce invalid releases plus late lifecycle actions
  by at least 50% versus C, produce zero hard-constraint trade-off violations,
  keep valid-block rate no worse by 1 percentage point, and use at most 1.25
  times C's review-plus-compute cost; the adjusted interval must exclude zero.
- **Rejection gate:** reject if C matches; gain relies on oracle scope/future
  events; the system asserts legal conformity from the simulator; protected
  quality dimensions are reconstructed only from a scalar score; ambiguous
  scope escalation exceeds capacity and raises late action; or one legal clock
  is encoded as a universal product-quality threshold.
- **Required artifacts:** product/entity scope facts, rule/effect-date registry,
  nine-axis truth/measurements, uncertainty, release candidates/decisions,
  Pareto sets, vulnerability/support/incident timelines, report-stage clocks,
  accessibility records, evidence lineage/expiry, review queue, loss vector, and
  explicit non-legal-advice limitation.

## Claim-integration appendix

The following nine records are copy-ready. Their status applies only to the
exact statement, not to broader slogans.

### C-1404

- **Statement:** Compiler correctness is a conditional semantic-refinement
  relation over named source and target semantics, successful transformation,
  permitted observations, and explicit preconditions; an execution with
  undefined source behaviour, an implementation choice outside the relation, or
  an omitted preprocessing/linking/runtime boundary is not made correct by the
  compiler theorem.
- **Status:** established for the cited formal models and language standard;
  whole-toolchain transfer remains scope-qualified.
- **Primary sources:** `Leroy2009CACM`, `Leroy2009JAR`,
  `CompCertManual_3_17`, `ISOIEC9899_2024`, `WangEtAl2013UB`.
- **Rationale:** CompCert's machine-checked result names formal semantics and
  successful compilation; the C standard defines interpretation and portability
  boundaries; optimization-unstable code shows why UB-sensitive expectations
  cannot act as a general target oracle.
- **Open issue:** graph compilers, quantizers, sparse routers, kernel fusion, and
  accelerator lowering need a registered numerical/concurrency relation,
  unsupported result, complete trusted boundary, and invalidation rule before
  they inherit this assurance pattern.
- **Used by:** [this audit](#comp-01--compiler-correctness-is-a-conditional-semantic-relation),
  [P-008](../principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](../principle-registry.md#p-009--maintenance-plane),
  [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design),
  and Candidate [009](../../experiments/candidates/009-graded-assurance-envelopes.md).

### C-1405

- **Statement:** Differential and metamorphic compiler testing can efficiently
  expose divergence only under preserved source validity, equivalent
  environments, and a registered behaviour relation; disagreement and compiler
  majority are bug-triage evidence, not by themselves a ground-truth verdict.
- **Status:** established methodology and oracle limitation; bug yield is
  generator/compiler/version qualified.
- **Primary sources:** `YangEtAl2011Csmith`, `LeEtAl2014EMI`,
  `ISOIEC9899_2024`.
- **Rationale:** Csmith's avoidance of undefined/unspecified oracle destruction
  and EMI's input-qualified equivalence demonstrate that the generator and
  relation create the oracle; shared defects, nondeterminism, timeouts, and
  implementation choices can defeat raw voting.
- **Open issue:** compare validity-preserving generation, EMI/metamorphic
  relations, reduction, formal interpreters, sanitizers, translation validation,
  and independent adjudication at equal executions and review cost, including
  shared-backend defects.
- **Used by:** [this audit](#comp-02--differential-disagreement-is-triage-not-ground-truth),
  [P-004](../principle-registry.md#p-004--diversity-selection-and-protection),
  [P-009](../principle-registry.md#p-009--maintenance-plane), and Candidates
  [009](../../experiments/candidates/009-graded-assurance-envelopes.md) and
  [014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1406

- **Statement:** Profile-guided and just-in-time optimization are mature
  conditional-specialization nulls whose net benefit is qualified by profile
  support and age, code/configuration version, workload shift, warm-up,
  compilation/deoptimization/fallback cost, code footprint, protected rare
  paths, and full deployment latency/energy rather than steady-state mean alone.
- **Status:** established optimization family; workload-shift robustness and net
  benefit are empirical and implementation-specific.
- **Primary sources:** `ArnoldEtAl2005AdaptiveVM`, `ChenEtAl2016AutoFDO`,
  `LLVM_PGO_2026`, `PettisHansen1990`.
- **Rationale:** runtime monitoring and feedback-directed specialization are
  established practice; representative/stale profiles, tiering, compilation,
  and layout are explicit engineering boundaries rather than free information.
- **Open issue:** require held-out stationary, gradual, abrupt, cyclic, rare-path,
  and code-version shifts with all profile/compile/deopt work amortized, then
  compare static robust optimization, PGO, tiered JIT, AutoFDO-like sampling,
  recency adaptation, and candidate mechanisms.
- **Used by:** [this audit](#perf-01--pgo-and-jit-optimize-an-empirical-workload-contract),
  [P-001](../principle-registry.md#p-001--selective-allocation),
  [P-005](../principle-registry.md#p-005--use-dependent-topology),
  [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design),
  [P-012](../principle-registry.md#p-012--memory-matched-to-information-lifetime),
  and Candidate [001](../../experiments/candidates/001-adaptive-topology.md).

### C-1407

- **Statement:** Software-performance conclusions are conditional on the
  independent-unit hierarchy and setup distribution: code, data, stack, and
  environment layout can interact with a variant, so repeated executions of one
  binary do not estimate a layout-population effect without randomized layouts,
  blocked order, and hierarchy-aware uncertainty.
- **Status:** established measurement-bias mechanism; magnitude is
  system-specific.
- **Primary sources:** `MytkowiczEtAl2009`, `CurtsingerBerger2013`,
  `KaliberaJones2013`.
- **Rationale:** innocuous environment/link-order changes can reverse apparent
  conclusions; layout rerandomization and multilevel replication expose the
  missing variation that repeated iterations of one layout cannot supply.
- **Open issue:** benchmark compiled AI kernels and services across layouts,
  rebuilds, invocations, machines, thermal/frequency states, workload strata,
  tails, joules, and correctness, with a frozen estimand and no post-hoc outlier
  deletion.
- **Used by:** [this audit](#perf-02--executable-layout-is-a-randomized-experimental-factor),
  [P-009](../principle-registry.md#p-009--maintenance-plane),
  [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design),
  and Candidate [014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1408

- **Statement:** An intermediate implementation can improve performance or
  provide a useful partial check, but a function whose complete correctness
  depends on endpoint application knowledge still requires endpoint
  verification; placing or duplicating the function moves execution,
  communication, state, trust, and failure costs rather than erasing them.
- **Status:** established design argument with scoped examples; not a universal
  placement theorem.
- **Primary source:** `SaltzerReedClark1984`.
- **Rationale:** the end-to-end argument distinguishes complete implementation
  from lower-layer performance enhancement, preventing early checks, caches, or
  transport guarantees from being misreported as application correctness.
- **Open issue:** compare endpoint-only, intermediate-only, hybrid, expected-cost,
  robust/scenario, and authority-aware placement under reuse, early rejection,
  stale state, common-mode faults, privacy, endpoint availability, bytes,
  latency, joules, and invalid acceptance.
- **Used by:** [this audit](#arch-01--function-placement-does-not-erase-endpoint-obligation),
  [P-008](../principle-registry.md#p-008--compartmentalized-interaction),
  [P-010](../principle-registry.md#p-010--structural-offloading-and-co-design),
  [P-013](../principle-registry.md#p-013--externalized-shared-state), and
  Candidates [009](../../experiments/candidates/009-graded-assurance-envelopes.md)
  and [012](../../experiments/candidates/012-latency-qualified-authority.md).

### C-1409

- **Statement:** Network delay, loss, queue, and throughput results are
  measurement-operator outputs qualified by packet type, direction, endpoints,
  observation points, path/version, clocks, timestamp placement, sampling,
  timeout/censoring, and collection; active probes add or modify traffic and
  therefore perturb measured conditions to some degree.
- **Status:** established IPPM/ETSI metric-method boundary.
- **Primary sources:** `RFC7799`, `RFC7679`, `RFC7680`, `RFC2681`,
  `ETSI_EG_202765_3`.
- **Rationale:** authoritative metric definitions keep singleton, sample,
  statistic, Type-P, path, clock uncertainty, loss threshold, and active/passive
  method distinct; RTT also joins forward and reverse paths.
- **Open issue:** compare calibrated active, passive, hybrid, and joint
  state/observation models across path asymmetry, clock drift, Type-P treatment,
  route change, timeouts, export loss, reactive networks, and probe load, scoring
  downstream decisions rather than metric fit alone.
- **Used by:** [this audit](#net-01--network-measurements-are-operator--and-intervention-qualified),
  [P-007](../principle-registry.md#p-007--prediction-error-allocation),
  [P-009](../principle-registry.md#p-009--maintenance-plane), and Candidates
  [003](../../experiments/candidates/003-recovery-dynamics-fragility.md),
  [007](../../experiments/candidates/007-endogenous-observation-surveillance.md),
  and [014](../../experiments/candidates/014-versioned-observation-contract.md).

### C-1410

- **Statement:** Congestion, propagation and queuing delay, random or policy
  loss, receiver/application limitation, and path change are coupled but
  non-identical mechanisms, while applications, senders, routers/queues, and
  operators have different observations and actuators; gains must be measured
  on accepted service, fairness, tails, retransmission, and full work against
  mature transport/AQM nulls.
- **Status:** established mechanisms and standards; relative controller benefit
  is path/workload/deployment qualified.
- **Primary sources:** `Jacobson1988`, `CardwellEtAl2016BBR`, `RFC9438`,
  `RFC8289`, `RFC8290`, `RFC9331`, plus queueing nulls `little1961`,
  `kingman1961`, and `jackson1957`.
- **Rationale:** end-host congestion control, model-based control, queue
  scheduling/AQM, and explicit marking operate at different boundaries; one
  observed loss, RTT, or queue value does not uniquely identify mechanism or
  safe action.
- **Open issue:** cross CUBIC-, BBR-, ECN-, CoDel/FQ-CoDel-, fair-queueing-,
  admission-, selector-, and constrained-control arms under random loss, AQM
  change, heterogeneous RTT, reverse-path load, receiver limitation, capacity
  shift, competing protocols, and missing/bleached feedback.
- **Used by:** [this audit](#net-02--congestion-signals-mechanisms-and-operators-are-distinct),
  [P-001](../principle-registry.md#p-001--selective-allocation),
  [P-005](../principle-registry.md#p-005--use-dependent-topology),
  [P-006](../principle-registry.md#p-006--homeostatic-negative-feedback),
  [P-011](../principle-registry.md#p-011--transient-communication-coalitions),
  and Candidates [001](../../experiments/candidates/001-adaptive-topology.md),
  [003](../../experiments/candidates/003-recovery-dynamics-fragility.md), and
  [013](../../experiments/candidates/013-deficit-capability-routing.md).

### C-1411

- **Statement:** A fan-out request's latency is an order statistic of the joint
  branch distribution, so scale and dependence can amplify rare component
  delays; hedging/replication can reduce the tail only by spending capacity and
  cancellation work and can worsen the same tail through added queue load.
- **Status:** established under the cited mathematical assumptions and systems
  evidence; benefit boundary is workload/queue/dependence qualified.
- **Primary sources:** `DeanBarroso2013`, `VulimiriEtAl2013`,
  `GardnerEtAl2017`, plus queueing nulls `little1961`, `kingman1961`, and
  `jackson1957`.
- **Rationale:** under independence the all-branch CDF multiplies, while shared
  causes change that relation; redundancy exchanges spare capacity for a
  minimum-of-copies completion and exact benefits depend on service and cancel
  assumptions.
- **Open issue:** cross no-hedge load balancing, delayed hedge, retry,
  redundancy-\(d\), capacity reserve, load shedding, partial completion, and
  adaptive guard policies across branch count, tail dependence, utilization,
  common shocks, deadline, cancellation latency, useful work, and p99.9.
- **Used by:** [this audit](#dist-01--fan-out-tails-depend-on-scale-dependence-and-added-load),
  [P-001](../principle-registry.md#p-001--selective-allocation),
  [P-004](../principle-registry.md#p-004--diversity-selection-and-protection),
  [P-006](../principle-registry.md#p-006--homeostatic-negative-feedback), and
  Candidates [003](../../experiments/candidates/003-recovery-dynamics-fragility.md)
  and [013](../../experiments/candidates/013-deficit-capability-routing.md).

### C-1412

- **Statement:** A visualization or scalar software score is a task- and
  viewer-qualified observation operator over uncertain, vector-valued state:
  encoding-dependent perceptual/decision error, accessibility alternatives,
  the complete quality vector, applicability, hard legal constraints, evidence
  age, and support/vulnerability/incident lifecycle cannot be inferred from or
  compensated by the scalar summary alone.
- **Status:** established for the cited graphical-perception tasks, SQuaRE model,
  and applicable legal requirements; a universal display or aggregator is not
  established.
- **Primary sources:** `ClevelandMcGill1984`, `CorrellGleicher2014`,
  `FernandesEtAl2018`, `ISOIEC25010_2023`, `ISOIEC25040_2024`,
  `EN301549_3_2_1`, `EU_CRA_2024_2847`, `EU_NIS2_2022_2555`,
  `DE_BSIG_2025`.
- **Rationale:** graphical encodings produce different decoding behaviour;
  uncertainty representations alter judgment; ISO/IEC 25010 defines nine
  quality characteristics rather than one score; CRA, NIS2/BSIG, and applicable
  accessibility requirements create typed lifecycle constraints, not
  compensable performance penalties.
- **Open issue:** synthetic reader and lifecycle tests can reject fragile
  encodings/gates but cannot establish human accessibility, legal applicability,
  or conformity; successful designs need preregistered accessible human studies
  and actor/product-specific legal assessment.
- **Used by:** [this audit](#visq-01--displays-and-scalar-scores-are-lossy-quality-operators),
  [P-008](../principle-registry.md#p-008--compartmentalized-interaction),
  [P-009](../principle-registry.md#p-009--maintenance-plane),
  [P-013](../principle-registry.md#p-013--externalized-shared-state), and
  Candidates [009](../../experiments/candidates/009-graded-assurance-envelopes.md),
  [011](../../experiments/candidates/011-dual-loop-operational-assurance.md),
  and [014](../../experiments/candidates/014-versioned-observation-contract.md).

## Source inventory and copy-ready bibliography appendix

This audit uses **42 distinct sources**: **5 existing central bibliography
entries** reused without modification and **37 copy-ready new records** below.
The 37 new records comprise 20 primary academic sources, 15
standards/RFC/official technical sources, and two binding EU/German legal
sources. The five reused cross-domain records add four academic sources and the
EU Cyber Resilience Act; every source is counted once.

### Reuse these five existing keys

Do not insert duplicates for:

- wright1994syntactic;
- little1961, kingman1961, and jackson1957; and
- EU_CRA_2024_2847.

### Copy-ready new BibTeX entries (37)

~~~bibtex
@article{Leroy2009CACM,
  author  = {Leroy, Xavier},
  title   = {Formal Verification of a Realistic Compiler},
  journal = {Communications of the ACM},
  year    = {2009},
  volume  = {52},
  number  = {7},
  pages   = {107--115},
  doi     = {10.1145/1538788.1538814},
  url     = {https://doi.org/10.1145/1538788.1538814}
}

@article{Leroy2009JAR,
  author  = {Leroy, Xavier},
  title   = {A Formally Verified Compiler Back-End},
  journal = {Journal of Automated Reasoning},
  year    = {2009},
  volume  = {43},
  number  = {4},
  pages   = {363--446},
  doi     = {10.1007/s10817-009-9155-4},
  url     = {https://doi.org/10.1007/s10817-009-9155-4}
}

@manual{CompCertManual_3_17,
  author  = {Leroy, Xavier},
  title   = {The {CompCert C} Verified Compiler: Documentation and User's Manual, Version 3.17},
  year    = {2026},
  month   = feb,
  date    = {2026-02-13},
  url     = {https://compcert.org/man/manual.pdf},
  urldate = {2026-08-24},
  note    = {Official CompCert documentation and versioned manual}
}

@standard{ISOIEC9899_2024,
  author       = {{ISO/IEC}},
  title        = {{ISO/IEC 9899:2024}: Information Technology --- Programming Languages --- {C}},
  organization = {International Organization for Standardization},
  edition      = {5},
  year         = {2024},
  month        = oct,
  url          = {https://www.iso.org/standard/82075.html},
  urldate      = {2026-08-24}
}

@inproceedings{WangEtAl2013UB,
  author    = {Wang, Xi and Chen, Haogang and Cheung, Alvin and Jia, Zhihao and Zeldovich, Nickolai and Kaashoek, M. Frans},
  title     = {Undefined Behavior: What Happened to My Code?},
  booktitle = {Proceedings of the Twenty-Fourth ACM Symposium on Operating Systems Principles},
  year      = {2013},
  pages     = {260--275},
  doi       = {10.1145/2517349.2522728},
  url       = {https://doi.org/10.1145/2517349.2522728}
}

@inproceedings{YangEtAl2011Csmith,
  author    = {Yang, Xuejun and Chen, Yang and Eide, Eric and Regehr, John},
  title     = {Finding and Understanding Bugs in {C} Compilers},
  booktitle = {Proceedings of the 32nd ACM SIGPLAN Conference on Programming Language Design and Implementation},
  year      = {2011},
  pages     = {283--294},
  doi       = {10.1145/1993316.1993532},
  url       = {https://doi.org/10.1145/1993316.1993532}
}

@inproceedings{LeEtAl2014EMI,
  author    = {Le, Vu and Afshari, Mehrdad and Su, Zhendong},
  title     = {Compiler Validation via Equivalence Modulo Inputs},
  booktitle = {Proceedings of the 35th ACM SIGPLAN Conference on Programming Language Design and Implementation},
  year      = {2014},
  pages     = {216--226},
  doi       = {10.1145/2594291.2594334},
  url       = {https://doi.org/10.1145/2594291.2594334}
}

@article{ArnoldEtAl2005AdaptiveVM,
  author  = {Arnold, Matthew and Fink, Stephen and Grove, David and Hind, Michael and Sweeney, Peter F.},
  title   = {A Survey of Adaptive Optimization in Virtual Machines},
  journal = {Proceedings of the IEEE},
  year    = {2005},
  volume  = {93},
  number  = {2},
  pages   = {449--466},
  doi     = {10.1109/JPROC.2004.840305},
  url     = {https://doi.org/10.1109/JPROC.2004.840305}
}

@inproceedings{ChenEtAl2016AutoFDO,
  author    = {Chen, Dehao and Li, David Xinliang and Moseley, Tipp},
  title     = {{AutoFDO}: Automatic Feedback-Directed Optimization for Warehouse-Scale Applications},
  booktitle = {2016 IEEE/ACM International Symposium on Code Generation and Optimization},
  year      = {2016},
  pages     = {12--23},
  doi       = {10.1145/2854038.2854044},
  url       = {https://doi.org/10.1145/2854038.2854044}
}

@online{LLVM_PGO_2026,
  author  = {{LLVM Project}},
  title   = {How to Build {LLVM} with Profile-Guided Optimizations},
  year    = {2026},
  url     = {https://llvm.org/docs/HowToBuildWithPGO.html},
  urldate = {2026-08-24},
  note    = {Official LLVM documentation; the page describes instrumentation- and sample-based PGO workflows}
}

@inproceedings{MytkowiczEtAl2009,
  author    = {Mytkowicz, Todd and Diwan, Amer and Hauswirth, Matthias and Sweeney, Peter F.},
  title     = {Producing Wrong Data without Doing Anything Obviously Wrong!},
  booktitle = {Proceedings of the 14th International Conference on Architectural Support for Programming Languages and Operating Systems},
  year      = {2009},
  pages     = {265--276},
  doi       = {10.1145/1508244.1508275},
  url       = {https://doi.org/10.1145/1508244.1508275}
}

@inproceedings{CurtsingerBerger2013,
  author    = {Curtsinger, Charlie and Berger, Emery D.},
  title     = {Stabilizer: Statistically Sound Performance Evaluation},
  booktitle = {Proceedings of the Eighteenth International Conference on Architectural Support for Programming Languages and Operating Systems},
  year      = {2013},
  pages     = {219--228},
  doi       = {10.1145/2451116.2451141},
  url       = {https://doi.org/10.1145/2451116.2451141}
}

@inproceedings{KaliberaJones2013,
  author    = {Kalibera, Tomas and Jones, Richard},
  title     = {Rigorous Benchmarking in Reasonable Time},
  booktitle = {Proceedings of the 2013 International Symposium on Memory Management},
  year      = {2013},
  pages     = {63--74},
  doi       = {10.1145/2464157.2464160},
  url       = {https://doi.org/10.1145/2464157.2464160}
}

@inproceedings{PettisHansen1990,
  author    = {Pettis, Karl and Hansen, Robert C.},
  title     = {Profile Guided Code Positioning},
  booktitle = {Proceedings of the ACM SIGPLAN 1990 Conference on Programming Language Design and Implementation},
  year      = {1990},
  pages     = {16--27},
  doi       = {10.1145/93548.93550},
  url       = {https://doi.org/10.1145/93548.93550}
}

@article{SaltzerReedClark1984,
  author  = {Saltzer, Jerome H. and Reed, David P. and Clark, David D.},
  title   = {End-to-End Arguments in System Design},
  journal = {ACM Transactions on Computer Systems},
  year    = {1984},
  volume  = {2},
  number  = {4},
  pages   = {277--288},
  doi     = {10.1145/357401.357402},
  url     = {https://doi.org/10.1145/357401.357402}
}
~~~

~~~bibtex
@techreport{ETSI_EG_202765_3,
  author      = {{ETSI}},
  title       = {{ETSI EG 202 765-3 V1.1.1}: Speech and Multimedia Transmission Quality ({STQ}); QoS and Network Performance Metrics and Measurement Methods; Part 3: Network Performance Metrics and Measurement Methods in IP Networks},
  institution = {European Telecommunications Standards Institute},
  year        = {2009},
  month       = dec,
  url         = {https://www.etsi.org/deliver/etsi_eg/202700_202799/20276503/01.01.01_60/eg_20276503v010101p.pdf},
  urldate     = {2026-08-24},
  note        = {ETSI Guide, not a harmonised European Standard}
}

@techreport{RFC7799,
  author      = {Morton, Al},
  title       = {Active and Passive Metrics and Methods (with Hybrid Types In-Between)},
  institution = {Internet Engineering Task Force},
  type        = {RFC},
  number      = {7799},
  year        = {2016},
  month       = may,
  doi         = {10.17487/RFC7799},
  url         = {https://www.rfc-editor.org/rfc/rfc7799.html}
}

@techreport{RFC7679,
  author      = {Almes, Guy and Kalidindi, Sunil and Zekauskas, Matthew and Morton, Al},
  title       = {A One-Way Delay Metric for {IP} Performance Metrics ({IPPM})},
  institution = {Internet Engineering Task Force},
  type        = {RFC},
  number      = {7679},
  year        = {2016},
  month       = jan,
  doi         = {10.17487/RFC7679},
  url         = {https://www.rfc-editor.org/rfc/rfc7679.html}
}

@techreport{RFC7680,
  author      = {Almes, Guy and Kalidindi, Sunil and Zekauskas, Matthew and Morton, Al},
  title       = {A One-Way Loss Metric for {IP} Performance Metrics ({IPPM})},
  institution = {Internet Engineering Task Force},
  type        = {RFC},
  number      = {7680},
  year        = {2016},
  month       = jan,
  doi         = {10.17487/RFC7680},
  url         = {https://www.rfc-editor.org/rfc/rfc7680.html},
  note        = {Internet Standard, STD 82}
}

@techreport{RFC2681,
  author      = {Almes, Guy and Kalidindi, Sunil and Zekauskas, Matthew},
  title       = {A Round-trip Delay Metric for {IPPM}},
  institution = {Internet Engineering Task Force},
  type        = {RFC},
  number      = {2681},
  year        = {1999},
  month       = sep,
  doi         = {10.17487/RFC2681},
  url         = {https://www.rfc-editor.org/rfc/rfc2681.html}
}

@inproceedings{Jacobson1988,
  author    = {Jacobson, Van},
  title     = {Congestion Avoidance and Control},
  booktitle = {Proceedings of the ACM SIGCOMM '88 Symposium},
  year      = {1988},
  pages     = {314--329},
  doi       = {10.1145/52324.52356},
  url       = {https://doi.org/10.1145/52324.52356}
}

@article{CardwellEtAl2016BBR,
  author  = {Cardwell, Neal and Cheng, Yuchung and Gunn, C. Stephen and Hassas Yeganeh, Soheil and Jacobson, Van},
  title   = {{BBR}: Congestion-Based Congestion Control},
  journal = {ACM Queue},
  year    = {2016},
  volume  = {14},
  number  = {5},
  pages   = {20--53},
  doi     = {10.1145/3012426.3022184},
  url     = {https://doi.org/10.1145/3012426.3022184}
}

@techreport{RFC9438,
  author      = {Xu, Lisong and Ha, Sangtae and Rhee, Injong and Goel, Vidhi and Eggert, Lars},
  title       = {{CUBIC} for Fast and Long-Distance Networks},
  institution = {Internet Engineering Task Force},
  type        = {RFC},
  number      = {9438},
  year        = {2023},
  month       = aug,
  doi         = {10.17487/RFC9438},
  url         = {https://www.rfc-editor.org/rfc/rfc9438.html}
}

@techreport{RFC8289,
  author      = {Nichols, Kathleen and Jacobson, Van and McGregor, Andrew and Iyengar, Janardhan},
  title       = {Controlled Delay Active Queue Management},
  institution = {Internet Engineering Task Force},
  type        = {RFC},
  number      = {8289},
  year        = {2018},
  month       = jan,
  doi         = {10.17487/RFC8289},
  url         = {https://www.rfc-editor.org/rfc/rfc8289.html},
  note        = {Experimental RFC}
}

@techreport{RFC8290,
  author      = {Høiland-Jørgensen, Toke and McKenney, Paul and Taht, Dave and Gettys, Jim and Dumazet, Eric},
  title       = {The Flow Queue {CoDel} Packet Scheduler and Active Queue Management Algorithm},
  institution = {Internet Engineering Task Force},
  type        = {RFC},
  number      = {8290},
  year        = {2018},
  month       = jan,
  doi         = {10.17487/RFC8290},
  url         = {https://www.rfc-editor.org/rfc/rfc8290.html},
  note        = {Experimental RFC}
}

@techreport{RFC9331,
  author      = {De Schepper, Koen and Briscoe, Bob},
  title       = {The Explicit Congestion Notification ({ECN}) Protocol for Low Latency, Low Loss, and Scalable Throughput ({L4S})},
  institution = {Internet Engineering Task Force},
  type        = {RFC},
  number      = {9331},
  year        = {2023},
  month       = jan,
  doi         = {10.17487/RFC9331},
  url         = {https://www.rfc-editor.org/rfc/rfc9331.html},
  note        = {Experimental RFC}
}

@article{DeanBarroso2013,
  author  = {Dean, Jeffrey and Barroso, Luiz André},
  title   = {The Tail at Scale},
  journal = {Communications of the ACM},
  year    = {2013},
  volume  = {56},
  number  = {2},
  pages   = {74--80},
  doi     = {10.1145/2408776.2408794},
  url     = {https://doi.org/10.1145/2408776.2408794}
}

@inproceedings{VulimiriEtAl2013,
  author    = {Vulimiri, Ashish and Michel, Oliver and Godfrey, P. Brighten and Shenker, Scott},
  title     = {More Is Less: Reducing Latency via Redundancy},
  booktitle = {Proceedings of the 9th ACM Conference on Emerging Networking Experiments and Technologies},
  year      = {2013},
  pages     = {283--294},
  doi       = {10.1145/2535372.2535392},
  url       = {https://doi.org/10.1145/2535372.2535392}
}

@article{GardnerEtAl2017,
  author  = {Gardner, Kristen and Harchol-Balter, Mor and Scheller-Wolf, Alan and Van Houdt, Benny},
  title   = {Redundancy-{d}: The Power of {d} Choices for Redundancy},
  journal = {Operations Research},
  year    = {2017},
  volume  = {65},
  number  = {4},
  pages   = {1078--1094},
  doi     = {10.1287/opre.2016.1582},
  url     = {https://doi.org/10.1287/opre.2016.1582}
}
~~~

~~~bibtex
@article{ClevelandMcGill1984,
  author  = {Cleveland, William S. and McGill, Robert},
  title   = {Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods},
  journal = {Journal of the American Statistical Association},
  year    = {1984},
  volume  = {79},
  number  = {387},
  pages   = {531--554},
  doi     = {10.1080/01621459.1984.10478080},
  url     = {https://doi.org/10.1080/01621459.1984.10478080}
}

@article{CorrellGleicher2014,
  author  = {Correll, Michael and Gleicher, Michael},
  title   = {Error Bars Considered Harmful: Exploring Alternate Encodings for Mean and Error},
  journal = {IEEE Transactions on Visualization and Computer Graphics},
  year    = {2014},
  volume  = {20},
  number  = {12},
  pages   = {2142--2151},
  doi     = {10.1109/TVCG.2014.2346298},
  url     = {https://doi.org/10.1109/TVCG.2014.2346298}
}

@inproceedings{FernandesEtAl2018,
  author    = {Fernandes, Michael and Walls, Logan and Munson, Sean and Hullman, Jessica and Kay, Matthew},
  title     = {Uncertainty Displays Using Quantile Dotplots or {CDFs} Improve Transit Decision-Making},
  booktitle = {Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems},
  year      = {2018},
  articleno = {144},
  pages     = {1--12},
  doi       = {10.1145/3173574.3173718},
  url       = {https://doi.org/10.1145/3173574.3173718}
}

@standard{EN301549_3_2_1,
  author       = {{ETSI}},
  title        = {{EN 301 549 V3.2.1}: Accessibility Requirements for {ICT} Products and Services},
  organization = {European Telecommunications Standards Institute},
  year         = {2021},
  month        = mar,
  url          = {https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf},
  urldate      = {2026-08-24},
  note         = {Latest published version verified on 2026-08-24; V4.1.0 was still in final voting and is not treated here as published}
}

@standard{ISOIEC25010_2023,
  author       = {{ISO/IEC}},
  title        = {{ISO/IEC 25010:2023}: Systems and Software Engineering --- Systems and Software Quality Requirements and Evaluation ({SQuaRE}) --- Product Quality Model},
  organization = {International Organization for Standardization},
  edition      = {2},
  year         = {2023},
  url          = {https://www.iso.org/standard/78176.html},
  urldate      = {2026-08-24}
}

@standard{ISOIEC25040_2024,
  author       = {{ISO/IEC}},
  title        = {{ISO/IEC 25040:2024}: Systems and Software Engineering --- Systems and Software Quality Requirements and Evaluation ({SQuaRE}) --- Quality Evaluation Framework},
  organization = {International Organization for Standardization},
  edition      = {2},
  year         = {2024},
  url          = {https://www.iso.org/standard/83467.html},
  urldate      = {2026-08-24}
}

@legislation{EU_NIS2_2022_2555,
  author  = {{European Parliament and Council of the European Union}},
  title   = {Directive ({EU}) 2022/2555 on Measures for a High Common Level of Cybersecurity across the Union ({NIS 2 Directive})},
  year    = {2022},
  journal = {Official Journal of the European Union},
  number  = {L 333},
  pages   = {80--152},
  url     = {https://eur-lex.europa.eu/eli/dir/2022/2555/oj},
  urldate = {2026-08-24}
}

@legislation{DE_BSIG_2025,
  author  = {{Federal Republic of Germany}},
  title   = {Gesetz über das Bundesamt für Sicherheit in der Informationstechnik und über die Sicherheit in der Informationstechnik von Einrichtungen ({BSI}-Gesetz --- {BSIG})},
  year    = {2025},
  url     = {https://www.gesetze-im-internet.de/bsig_2025/BJNR12D0B0025.html},
  urldate = {2026-08-24},
  note    = {Law of 2 December 2025, in force from 6 December 2025; official consolidated text amended through Article 8(1) of the law of 23 July 2026}
}
~~~

### Source-role and normativity notes

- The academic records support mechanisms, empirical observations, formal
  models, or experiment design; they do **not** create legal or conformity
  obligations.
- ISO/IEC 9899 defines the relevant C language contract. ISO/IEC 25010 and
  25040 supply quality/evaluation vocabularies. ETSI EG 202 765-3 is guidance,
  RFC status is retained per record, and none of those documents is silently
  promoted to binding EU law.
- EN 301 549 is a published European accessibility standard. Applicability and
  any presumption of conformity depend on the concrete product, service,
  procurement/legal regime, cited version, and current Official Journal
  references; this audit makes no conformity claim.
- CRA, NIS2, and the German BSIG are typed separately as law. Applicability,
  actor classification, product scope, transition date, incident facts, and
  competent-authority interpretation remain case-specific legal questions.

## Audit verdict and integration gate

The nine copy-ready claims and ten protocols are internally coherent only under
the construct and operator boundaries stated above. They are suitable for
central-ledger integration as **qualified** claims, not as universal performance
promises. In particular, none of a differential disagreement, a benchmark
speedup, one RTT/loss trace, a tail reduction, a visual decoding score, or a
composite quality score is promoted into the latent property it only samples.

Integration is gated on all of the following:

1. claim IDs C-1404 through C-1412 remain unique and contiguous;
2. all 37 new bibliography keys resolve exactly once, while the five reused
   keys are not duplicated;
3. all ten protocols retain their mature nulls, sealed confirmation seeds,
   metrics with units, numeric gates, artifacts, and rejection conditions;
4. normative statuses and applicability qualifiers remain explicit; and
5. all local links, equations, tables, and Mermaid syntax pass repository
   validation without relying on generated-site truncation.

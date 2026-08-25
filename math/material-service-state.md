# Material commitment and realized service

## Scope

This note separates information, policy, commitment, physical state, and
realized service for resource-bearing AI systems. It instantiates the
[supply-chain/operations audit](../research/audits/2026-08-05-supply-chain-operations-research.md)
and the
[soil/crop multi-resource audit](../research/audits/2026-08-21-soil-crop-multiresource-colimitation.md)
without treating inventory, routing, buffers, or biological co-limitation as
new AI principles.
Its evidence boundaries are [C-627](../research/claims.md#c-627) and
[C-659](../research/claims.md#c-659)–[C-678](../research/claims.md#c-678).

## Conservation before optimization

For location or module $i$ over interval $t$, physical inventory obeys

$$
I_{i,t+1}=I_{i,t}+\operatorname{Rec}_{i,t}+T^{\mathrm{in}}_{i,t}
-S_{i,t}-T^{\mathrm{out}}_{i,t}-X_{i,t},
$$

where every term is a count, byte quantity, mass, or another single declared
unit: on-hand $I$, receipts $\operatorname{Rec}$, inbound/outbound transfer
$T$, issued work $S$, and expiry/damage $X$. The explicit receipt symbol avoids
reusing $R$ for both receipts and reservations. Forecasts, requests,
allocations, and record corrections do not appear as physical flow unless an
observed transition links them to it. Filtration, internal recovery,
reintroduction, final egress, and storage change likewise remain separate
ledger terms ([C-1491](../research/claims.md#c-1491)). A third-body interface
inventory also requires generation, transport, transformation,
reincorporation, and escape closure before retain/remove optimization
([C-1502](../research/claims.md#c-1502)).

With accepted but unfinished work,

$$
B_{i,t+1}=\left[B_{i,t}+D^{\mathrm{acc}}_{i,t}-S_{i,t}\right]^+,
$$

where backlog $B$, accepted demand $D^{\mathrm{acc}}$, and completion $S$ use
the same work unit. Lost requests require a separate state because they do not
remain in $B$ and may disappear from later demand records.

### Resource form and deliverability

For location $i$, resource type $k$, and interval $t$, retain a compartment
state

$$
\mathbf x_{ik,t}=
\left(
S^{\mathrm{bound}},
S^{\mathrm{lab}},
S^{\mathrm{sol}},
S^{\mathrm{pipe}},
Q^{\mathrm{internal}}
\right)^{\mathsf T}_{ik,t}.
$$

$S^{\mathrm{bound}}$ is bound or slow-release stock, $S^{\mathrm{lab}}$ is a
labile or exchangeable pool excluding the solution pool,
$S^{\mathrm{sol}}$ is material in solution or its transported analogue,
$S^{\mathrm{pipe}}$ is in-transit material inside the declared boundary, and
$Q^{\mathrm{internal}}$ is an already delivered, remobilizable internal pool.
The operational compartments are mutually exclusive and use one declared
mass, count, or task-native resource unit. Total stock and solution
concentration are derived without adding unlike or overlapping states:

Aggregate stock or inflow therefore cannot establish local arrival, uptake,
useful consumption, or deficit at the receiver's support
([C-1488](../research/claims.md#c-1488)).

$$
S^{\mathrm{tot}}_{ik,t}=\mathbf 1^{\mathsf T}\mathbf x_{ik,t},
\qquad
C^{\mathrm{sol}}_{ik,t}
=\frac{S^{\mathrm{sol}}_{ik,t}}{V^{\mathrm{sol}}_{i,t}}.
$$

$V^{\mathrm{sol}}$ is the declared carrier or solution volume. Reachable stock
$S^{\mathrm{reachable}}_{ik}(t;\Phi)$ and usable stock
$U^{\mathrm{usable}}_{ik}(t;\Phi)$ are deadline-qualified functions of this
state and the transport/release model, not extra compartments that can be
double counted. $\mathbf 1$ is the all-ones vector and $\mathsf T$ denotes
transpose.

The compartment balance is

$$
\mathbf x_{ik,t+1}
=
\mathbf T_{ik,t}(\theta_{i,t},pH_{i,t},\Theta_{i,t},\beta_{i,t})
\mathbf x_{ik,t}
+\mathbf a_{ik,t}
-\mathbf e_{ik,t}
-\boldsymbol\ell_{ik,t},
$$

where $\mathbf T_{ik,t}$ is a dimensionless transition operator for release,
sorption/desorption, dissolution, mineralization, and other form changes;
$\theta$ is volumetric water content, $pH$ is the declared logarithmic activity
measure, $\Theta$ is temperature on a declared scale, and $\beta$ is the
declared biological or process state. $\mathbf a$ is externally added material,
$\mathbf e$ is observed service consumption or withdrawal across the boundary,
and $\boldsymbol\ell$ is boundary loss. The three vector flow terms are
interval-integrated amounts in the same resource unit as $\mathbf x$. A
resource unit occupies one compartment; transition columns conserve it unless
a declared transformation or loss is represented explicitly. Uptake into
$Q^{\mathrm{internal}}$ is an internal transition; it must not also be
subtracted as a boundary flow. Internal form changes can conserve an element
while changing its deliverability. A lubricant, buffer, cache, or reserve used
as an interface mediator remains a typed, regime-qualified resource rather
than an automatically beneficial label ([C-1499](../research/claims.md#c-1499)).

Observed uptake over $\Delta t$ is bounded separately from stock:

$$
U_{ik,t}
\le
\min\!\left\{
\left(J^{\mathrm{adv}}_{ik,t}+J^{\mathrm{diff}}_{ik,t}\right)\Delta t,
V^{\mathrm{receiver}}_{ik,t}\Delta t,
D^{\mathrm{phys}}_{ik,t}\Delta t,
S^{\mathrm{reachable}}_{ik}(t;\Phi)
\right\},
$$

where $U$ is observed uptake or receiver acceptance, $J^{\mathrm{adv}}$ and
$J^{\mathrm{diff}}$ are non-overlapping advective and diffusive delivery rates,
$V^{\mathrm{receiver}}$ is receiver uptake or processing capacity, and
$D^{\mathrm{phys}}$ is physiological or task demand. $\Delta t$ is the interval
duration in seconds. All four right-hand quantities use the same resource
amount: the first three are rates in resource units per second integrated over
$\Delta t$, and the fourth is already an amount reachable inside window
$\Phi$. This equation is a service-accounting bound, not a universal soil,
crop, or receiver model.

## State contract

For service commitment $c$, retain

$$
\mathcal K_c=
(F_v,D,A,O,K^{\mathrm{res}},\mathbf I,P,C,Q,L,\Phi,\mathcal F,Y,M),
$$

where $F_v$ is forecast plus vintage, $D$ observed request, $A$ admission
decision, $O$ order/release, $K^{\mathrm{res}}$ reservation/frozen commitment,
$\mathbf I$ typed on-hand and pipeline inventory by form, age, and condition,
$P$ policy version, $C$ qualified capacity and common-cause groups, $Q$
route/queue/qualification state, $L$ lead-time distribution, $\Phi$ service
stage or deadline window, $\mathcal F$ jointly feasible service set, $Y$
delivered outcome, and $M$ service-measurement definition. Every field carries
event, availability, and decision times when they differ.

The tuple is deliberately not a scalar “available resource.” A valid record
does not create physical stock; a route plan does not complete transport; a
shipment does not prove correct or timely service. The renal accounting
boundary supplies an independent instance of why intermediate throughput is
not final service ([C-1491](../research/claims.md#c-1491)).

### Jointly executable service

Let service class $j$ require $\nu_{jk}\ge0$ units of resource $k$ per service
unit. At location $i$, the currently feasible service set is

$$
\mathcal F_i(t)=
\left\{
\mathbf q\ge0:
\sum_j \nu_{jk}q_j
\le U^{\mathrm{usable}}_{ik}(t)
\quad\text{for every required }k,
\quad q_j=0\text{ outside }\Phi_j
\right\}.
$$

$q_j$ is service units executable within window $\Phi_j$, and
$U^{\mathrm{usable}}_{ik}$ is the resource amount deliverable within that same
window. This bound detects stranded single-resource reservations. It is not a
claim that all production functions are fixed-proportion: an experiment must
declare partial substitution, internal storage, transformation, and toxicity
when they are possible.

For a two-resource factorial experiment, keep the interaction contrast in the
same units as the outcome:

$$
\Delta_{k\ell}=Y_{11}+Y_{00}-Y_{10}-Y_{01}.
$$

A positive $\Delta_{k\ell}$ is super-additivity in that experimental context.
It does not by itself distinguish simultaneous, independent, or serial
co-limitation, nor identify a transport or allocation mechanism.

## Service and recovery vectors

Report service as a vector

$$
\mathbf s=
(f_{\mathrm{unit}},f_{\mathrm{order}},f_{\mathrm{OTIF}},
f_{\mathrm{bundle}},W_{50},W_{95},B,L_s,Z,E,C_m,H,W_m),
$$

where fill/service fractions $f$ are dimensionless, delays $W_{50},W_{95}$ are
seconds, $f_{\mathrm{bundle}}$ is the fraction of commitments whose complete
typed resource bundle was executable in its window, backlog $B$ and lost
demand $L_s$ use work units, $Z$ is stranded reserved resource in a declared
resource unit, lifecycle energy $E$ is joules, monetary cost $C_m$ is currency,
human work $H$ is person-seconds, and material waste $W_m$ is mass or count.
Resource-specific $Z$ and $W_m$ coordinates remain separate when units differ.
Coordinates remain visible even when a declared policy uses weights.

Recovery ends at horizon $T_R$ only after backlog, reserve, and next-event
service are measured:

$$
\mathcal R(T_R)=
(t_{\mathrm{nominal}},t_{\mathrm{backlog}=0},
t_{\mathrm{reserve}},\mathbf s_{\mathrm{second}},E,C_m,H,W_m).
$$

Nominal throughput is one timestamp, not the whole recovery state.

For multi-resource systems, the second-event vector also reports residual
stock by form, missed service windows, and losses. Late abundance does not
retroactively repair a commitment that failed inside its declared window.

## Falsification boundary

The held contract loses if typed event sourcing plus inventory reconciliation,
queueing/flow models, base-stock or multi-echelon control, stochastic/robust
optimization, receding-horizon planning with frozen commitments, and explicit
service metrics match its decisions and cost. For soil/crop-derived claims the
null stack also includes factorial response surfaces, mechanistic
transport-plus-uptake models, balanced-nutrient models, and calibrated crop
system simulators. Pooling, supplier count, information sharing, just-in-time
operation, co-limitation, structural proliferation, and closed loops receive no
default efficiency or resilience credit.

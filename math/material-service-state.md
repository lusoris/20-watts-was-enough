# Material commitment and realized service

## Scope

This note separates information, policy, commitment, physical state, and
realized service for resource-bearing AI systems. It instantiates the
[supply-chain/operations audit](../research/audits/2026-08-05-supply-chain-operations-research.md)
without treating inventory, routing, or buffers as new AI principles.
Its evidence boundaries are [C-627](../research/claims.md#c-627) and
[C-659](../research/claims.md#c-659)–[C-678](../research/claims.md#c-678).

## Conservation before optimization

For location or module $i$ over interval $t$, physical inventory obeys

$$
I_{i,t+1}=I_{i,t}+R_{i,t}+T^{\mathrm{in}}_{i,t}
-S_{i,t}-T^{\mathrm{out}}_{i,t}-X_{i,t},
$$

where every term is a count, byte quantity, mass, or another single declared
unit: on-hand $I$, receipts $R$, inbound/outbound transfer $T$, issued work
$S$, and expiry/damage $X$. Forecasts, requests, allocations, and record
corrections do not appear as physical flow unless an observed transition links
them to it.

With accepted but unfinished work,

$$
B_{i,t+1}=\left[B_{i,t}+D^{\mathrm{acc}}_{i,t}-S_{i,t}\right]^+,
$$

where backlog $B$, accepted demand $D^{\mathrm{acc}}$, and completion $S$ use
the same work unit. Lost requests require a separate state because they do not
remain in $B$ and may disappear from later demand records.

## State contract

For a service commitment $k$, retain

$$
\mathcal K_k=(F_v,D,A,O,R,I,P,C,Q,L,Y,M),
$$

where $F_v$ is forecast plus vintage, $D$ observed request, $A$ admission
decision, $O$ order/release, $R$ reservation/frozen commitment, $I$ on-hand
and pipeline inventory by age/condition, $P$ policy version, $C$ qualified
capacity and common-cause groups, $Q$ route/queue/qualification state, $L$
lead-time distribution, $Y$ delivered outcome, and $M$ service-measurement
definition. Every field carries event, availability, and decision times when
they differ.

The tuple is deliberately not a scalar “available resource.” A valid record
does not create physical stock; a route plan does not complete transport; a
shipment does not prove correct or timely service.

## Service and recovery vectors

Report service as a vector

$$
\mathbf s=
(f_{\mathrm{unit}},f_{\mathrm{order}},f_{\mathrm{OTIF}},
W_{50},W_{95},B,L_s,E,C_m,H,W_m),
$$

where fill/service fractions $f$ are dimensionless, delays $W_{50},W_{95}$ are
seconds, backlog $B$ and lost demand $L_s$ use work units, lifecycle energy
$E$ is joules, monetary cost $C_m$ is currency, human work $H$ is
person-seconds, and material waste $W_m$ is mass or count. Coordinates remain
visible even when a declared policy uses weights.

Recovery ends at horizon $T_R$ only after backlog, reserve, and next-event
service are measured:

$$
\mathcal R(T_R)=
(t_{\mathrm{nominal}},t_{\mathrm{backlog}=0},
t_{\mathrm{reserve}},\mathbf s_{\mathrm{second}},E,C_m,H,W_m).
$$

Nominal throughput is one timestamp, not the whole recovery state.

## Falsification boundary

The held contract loses if typed event sourcing plus inventory reconciliation,
queueing/flow models, base-stock or multi-echelon control, stochastic/robust
optimization, receding-horizon planning with frozen commitments, and explicit
service metrics match its decisions and cost. Pooling, supplier count,
information sharing, just-in-time operation, and closed loops receive no
default efficiency or resilience credit.

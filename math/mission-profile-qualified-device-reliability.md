# Mission-profile-qualified device reliability contract

This note defines the quantitative boundary for
[Fixture F-008](../experiments/fixtures/008-mission-profile-qualified-device-reliability.md).
It operationalizes the durable result of the
[semiconductor device and circuit reliability audit](../research/audits/2026-08-05-semiconductor-device-reliability.md):
accepted service must be evaluated against the **actual mission profile** of a
variable and aging physical population, with mechanism-qualified extrapolation,
explicit correction and retirement, and complete lifecycle ledgers.

- **Status:** fixture mathematics; no new principle or candidate
- **Comparison unit:** one preregistered service interval and its physical cohort
- **Primary rule:** never infer recovery, reliability, or efficiency from task
  score, monitor output, accelerated stress, or component energy alone

## Physical identity and time base

For service episode $e$ at sample time $t$, seal the identity envelope

$$
I_{e,t}=(l,w,d,b,p,h,s,e,t),
$$

where $l$ identifies a fabrication lot, $w$ a wafer, $d$ a die, $b$ a physical
block or array, $p$ a package and board path, $h$ a hardware and firmware
version, $s$ a site or facility, $e$ an episode, and $t$ elapsed time [s] from a
declared clock origin. All identifiers are immutable byte strings. Replacement,
repair, reprogramming, remapping, firmware change, or calibration creates a new
versioned identity link; it does not overwrite history.

Let $\Delta t_n=t_{n+1}-t_n$ [s] be sample interval $n$. The actual mission
profile over interval $[0,T_e]$ is

$$
M_e=\left\{
u_n,V_n,f_n,T_n,J_n,a_n,\phi_n,\dot D^{\mathrm{ion}}_n,c_n,r_n,\Delta t_n
\right\}_{n=0}^{N_e-1},
$$

where $u_n$ is workload class [class], $V_n$ supply or terminal voltage [V],
$f_n$ clock or operation rate [Hz], $T_n$ measured absolute temperature [K],
$J_n$ current density [A m$^{-2}$], $a_n$ switching or access activity
[dimensionless], $\phi_n$ particle flux [particle m$^{-2}$ s$^{-1}$],
$\dot D^{\mathrm{ion}}_n$ ionizing dose rate [Gy s$^{-1}$], $c_n$ cooling state
[state], $r_n$ route and
protection state [state], and $N_e$ is the number of intervals [interval].
$T_e=\sum_n\Delta t_n$ is episode duration [s]. Commanded voltage, nominal
temperature, or benchmark label cannot substitute for the measured histories.

The workload record is further resolved as

$$
u_n=(q_n,N_n^{\mathrm{op}},B_n^{\mathrm{move}},N_n^{\mathrm{write}},y_n),
$$

where $q_n$ is requested service type [type], $N_n^{\mathrm{op}}$ is operation
count [operation], $B_n^{\mathrm{move}}$ is bytes moved [byte],
$N_n^{\mathrm{write}}$ is write or program count [write], and $y_n$ is the
required quality and safety envelope [contract].

## Latent physical state and observable evidence

Let the latent device state be

$$
z_n=(\theta,D_n^{\mathrm{perm}},R_n^{\mathrm{rev}},W_n,
\mathcal F_n,Q_n^{\mathrm{res}}),
$$

where $\theta$ is the time-zero physical parameter vector in declared native
units, $D_n^{\mathrm{perm}}$ is cumulative irreversible damage [damage unit],
$R_n^{\mathrm{rev}}$ is reversible degradation [damage unit], $W_n$ is consumed
write, cycle, or stress endurance [cycle or declared wear unit], $\mathcal F_n$
is latent fault state [state], and $Q_n^{\mathrm{res}}$ is remaining repair, spare, timing,
thermal, and correction reserve [declared reserve unit]. A dimensionless
normalized representation is allowed only after every component scale is fixed.

The physical transition law is

$$
z_{n+1}=g_k(z_n,M_{e,n},\alpha_k,\Gamma_k,\xi_n),
$$

where $g_k$ is a mechanism-qualified transition model, $k$ indexes a physical
mechanism, $M_{e,n}$ is the mission-profile slice, $\alpha_k$ is a vector of
mechanism parameters in declared native units, $\Gamma_k$ contains interaction
coefficients, and $\xi_n$ is process noise in the units of $z$. A model that
mixes mechanisms must identify $k$ or explicitly carry a mixture state.

Observed telemetry is

$$
o_n=h(z_n,M_{e,n},\beta_{v_n})+\epsilon_n,
\qquad
\epsilon_n\sim p_{\epsilon,v_n},
$$

where $o_n$ is the observation vector in sensor-native units, $h$ is the
measurement function, $\beta_{v_n}$ is calibration state under calibration
version $v_n$, and $p_{\epsilon,v_n}$ is the version-qualified noise law.
Calibration state has covariance $\Sigma^{\beta}_n$ in squared native units.

Define observation availability $m_{n,j}\in\{0,1\}$ for channel $j$ and
censoring bounds $L_{n,j}$ and $U_{n,j}$ in the channel's native unit. The
observation record is

$$
O_n=(o_n,m_n,L_n,U_n,v_n,\Sigma^{\beta}_n,a^{\mathrm{ev}}_n),
$$

where $a^{\mathrm{ev}}_n=t_n-t_n^{\mathrm{last\,qualified}}$ is evidence age [s].
For a right-censored lifetime $t_i^{\mathrm f}>C_i$, unit $i$ contributes

$$
\mathcal L_i=S(C_i\mid M_i),
$$

where $C_i$ is censor time [s], $S$ is survival probability [dimensionless], and
$M_i$ is the unit's observed mission profile. A failed unit with failure time
$t_i^{\mathrm f}$ [s] and classified mechanism $k_i$ contributes

$$
\mathcal L_i=\lambda_{k_i}(t_i^{\mathrm f}\mid M_i)
S(t_i^{\mathrm f}\mid M_i),
$$

where $\lambda_{k_i}$ is mechanism-specific hazard [s$^{-1}$]. Missing and
censored records are represented in the likelihood; they are not imputed as
healthy observations.

## Hierarchical variation, yield, and leakage control

For parameter $q$ measured at lot $l$, wafer $w$, die $d$, and block $b$, use
the hierarchical decomposition

$$
\theta_{l,w,d,b,q}=\mu_q+L_{l,q}+W_{l,w,q}+D_{l,w,d,q}
+B_{l,w,d,b,q}+\eta_{l,w,d,b,q},
$$

where $\mu_q$ is the population mean, $L_{l,q}$ the lot effect, $W_{l,w,q}$ the
wafer effect, $D_{l,w,d,q}$ the die effect, $B_{l,w,d,b,q}$ the local block
effect, and $\eta_{l,w,d,b,q}$ measurement residual, all in the native unit of
$q$. Spatial covariance and gradients are modeled explicitly when present.

Let $A_{i,q}=1$ when physical unit $i$ satisfies acceptance criterion $q$ and
$A_{i,q}=0$ otherwise. Joint accepted yield is

$$
\widehat Y_{\mathrm{joint}}=
\frac{1}{N_{\mathrm{fab}}}
\sum_{i=1}^{N_{\mathrm{fab}}}
\prod_{q=1}^{Q} A_{i,q},
$$

where $N_{\mathrm{fab}}$ is the number of fabricated units [unit], $Q$ is the
number of jointly required criteria [criterion], and
$\widehat Y_{\mathrm{joint}}$ is dimensionless. Failed, untestable, unpackageable,
and discarded dies remain in $N_{\mathrm{fab}}$.

For a die area $A_{\mathrm{die}}$ [m$^2$] and random killer-defect density
$D_0$ [defect m$^{-2}$], the Poisson yield null is

$$
Y_{\mathrm P}=\exp(-A_{\mathrm{die}}D_0),
$$

where $Y_{\mathrm P}$ is dimensionless. More flexible clustering models may
replace this null only with held-out wafer and lot evidence.

## Competing mechanisms and mission-profile damage

For $K$ competing mechanisms, total hazard is

$$
\lambda(t\mid M)=\sum_{k=1}^{K}\lambda_k(t\mid M),
$$

and survival through time $t$ is

$$
S(t\mid M)=
\exp\!\left[-\int_0^t\lambda(\tau\mid M)\,\mathrm d\tau\right],
$$

where $\lambda$ and every $\lambda_k$ have unit s$^{-1}$, $t$ and $\tau$ have
unit s, and $S$ is dimensionless. Cause-specific cumulative incidence is

$$
F_k(t\mid M)=
\int_0^t S(\tau^-\mid M)\lambda_k(\tau\mid M)\,\mathrm d\tau,
$$

where $F_k$ is dimensionless and $\tau^-$ denotes the instant before $\tau$.

For a monotone damage proxy, define

$$
D_k(t)=\int_0^t
r_k\!\left(V(\tau),T(\tau),J(\tau),a(\tau),\phi(\tau),u(\tau)\right)
\,\mathrm d\tau,
$$

where $r_k$ is mechanism-$k$ damage rate [damage unit s$^{-1}$] and $D_k$ is
accumulated damage [damage unit]. This integral is evaluated on actual telemetry,
not on mean voltage or mean temperature.

The [equal-mean mission-history illustration](visual-models.md#contextual-analytical-figures)
uses hypothetical Arrhenius parameters to visualize this nonlinearity; it is
not calibrated device damage.

An Arrhenius acceleration factor between use temperature $T_u$ [K] and stress
temperature $T_s$ [K] is

$$
AF_T=\exp\!\left[
\frac{E_a}{k_{\mathrm B}}
\left(\frac{1}{T_u}-\frac{1}{T_s}\right)
\right],
$$

where $E_a$ is activation energy [eV], $k_{\mathrm B}$ is Boltzmann's constant
[eV K$^{-1}$], and $AF_T$ is dimensionless. The electromigration lifetime null
is

$$
t_{50}=A_{\mathrm{EM}}J^{-n_{\mathrm{EM}}}
\exp\!\left(\frac{E_{a,\mathrm{EM}}}{k_{\mathrm B}T}\right),
$$

where $t_{50}$ is median failure time [s], $A_{\mathrm{EM}}$ has the compound
unit required to yield seconds, $J$ is current density [A m$^{-2}$],
$n_{\mathrm{EM}}$ is dimensionless, and $E_{a,\mathrm{EM}}$ is activation
energy [eV]. The fitted range, waveform, geometry, and failure criterion travel
with every estimate.

Radiation-induced upset rate for sensitive regions $j$ is

$$
R_{\mathrm{SEU}}=
\sum_j\int_0^\infty
\phi_j(E)\sigma_j(E)\,\mathrm dE,
$$

where $E$ is particle energy [J or eV, declared consistently], $\phi_j(E)$ is
differential flux [particle m$^{-2}$ s$^{-1}$ energy$^{-1}$], $\sigma_j(E)$ is
upset cross-section [m$^2$/bit or m$^2$/device], and $R_{\mathrm{SEU}}$ is
upset rate [bit$^{-1}$ s$^{-1}$ or device$^{-1}$ s$^{-1}$].

For mechanisms $k$ and $r$, interaction departure is

$$
\Delta_{k,r}(M)=
L_{k+r}(M)-L_k(M)-L_r(M)+L_0(M),
$$

where $L_{k+r}$ is loss under combined stress, $L_k$ and $L_r$ are losses under
each stress alone, and $L_0$ is unstressed loss, all in the same task or physical
unit. $\Delta_{k,r}=0$ is the additive null; the sign and uncertainty of
$\Delta_{k,r}$ must be reported rather than absorbed into an unspecified
"aging" variable.

## Accelerated-test support and extrapolation

Let $x^{\mathrm{stress}}$ be the vector of stress covariates in their normalized,
preregistered coordinates and let $\mathcal S_{\mathrm{train}}$ be the support
of the accelerated-test design. Define support distance

$$
d_{\mathrm{sup}}(x)=
\inf_{x'\in\mathcal S_{\mathrm{train}}}
\left\|x-x'\right\|_{\Sigma^{-1}},
$$

where $\Sigma$ is a fixed covariance or scale matrix,
$\|v\|_{\Sigma^{-1}}=\sqrt{v^{\top}\Sigma^{-1}v}$ is dimensionless Mahalanobis distance, and
$d_{\mathrm{sup}}$ is dimensionless. A prediction is out of support when
$d_{\mathrm{sup}}(x)>d_{\max}$ for preregistered dimensionless threshold
$d_{\max}$.

For a nominal $(1-\alpha)$ survival interval
$[\widehat S_i^L(t),\widehat S_i^U(t)]$, empirical interval coverage is

$$
\widehat C_S(t)=
\frac{1}{N_{\mathrm{hold}}}
\sum_{i=1}^{N_{\mathrm{hold}}}
\mathbb 1\!\left[
S_i(t)\in[\widehat S_i^L(t),\widehat S_i^U(t)]
\right],
$$

where $\alpha$, $S_i$, and $\widehat C_S$ are dimensionless,
$N_{\mathrm{hold}}$ is held-out unit count [unit], and $\mathbb 1$ is the
indicator function. Mechanism transitions, failure-analysis disagreement,
or false-safe predictions invalidate extrapolation even when aggregate error
is small.

## Thermal, electrical, and wear coupling

For thermal node vector $T(t)$ [K], the lumped electrothermal null is

$$
C_{\mathrm{th}}\frac{\mathrm dT}{\mathrm dt}
+G_{\mathrm{th}}(T-T_{\mathrm{amb}})=P(t),
$$

where $C_{\mathrm{th}}$ is thermal-capacitance matrix [J K$^{-1}$],
$G_{\mathrm{th}}$ is thermal-conductance matrix [W K$^{-1}$],
$T_{\mathrm{amb}}$ is ambient-temperature vector [K], and $P(t)$ is dissipated
power vector [W]. Routing comparisons use measured spatial $T(t)$ and $P(t)$.

Dynamic switching energy for operation class $q$ is

$$
E_{\mathrm{dyn},q}=N_q\alpha_q C_q V_q^2,
$$

where $N_q$ is operation count [operation], $\alpha_q$ is activity factor
[dimensionless], $C_q$ is effective switched capacitance [F/operation], $V_q$
is voltage [V], and $E_{\mathrm{dyn},q}$ is energy [J]. Leakage, regulation,
clocking, memory, transfer, monitoring, correction, thermal control, and idle
energy are separate terms.

For physical element $j$, normalized wear evolves as

$$
w_j(t+\Delta t)=w_j(t)+
\frac{\Delta x_j(t)}{X^{\mathrm{end}}_j},
$$

where $w_j$ is dimensionless consumed endurance, $\Delta x_j$ is stress, write,
or cycle increment [wear unit], and $X^{\mathrm{end}}_j$ is measured endurance
capacity [same wear unit]. Element $j$ is exhausted when $w_j\ge 1$, unless a
stricter registered threshold applies.

Separate native margin, reversible recovery, and compensation as

$$
m^{\mathrm{obs}}_j(t)=m^{0}_j
-d^{\mathrm{perm}}_j(t)-d^{\mathrm{rev}}_j(t)
+c^{\mathrm{comp}}_j(t),
$$

where $m^{\mathrm{obs}}_j$, $m^0_j$, permanent loss
$d^{\mathrm{perm}}_j$, reversible loss $d^{\mathrm{rev}}_j$, and compensation
$c^{\mathrm{comp}}_j$ share the same physical margin unit, such as volts or
seconds. A reduction in $d^{\mathrm{rev}}_j$ is recovery; an increase in
$c^{\mathrm{comp}}_j$ is adaptation. They are never scored as the same event.

## Fault geometry and the soft/hard firewall

Let every fault event carry type

$$
f_i=(g_i,\ell_i,\tau_i,p_i,c_i,x_i),
$$

where $g_i$ is spatial geometry [bit, word, bank, chip, route, or domain],
$\ell_i$ is persistence [s], $\tau_i$ is occurrence time [s], $p_i$ is physical
or injected provenance [class], $c_i$ is common-cause identifier [class], and
$x_i$ is external-side-effect state [state].

The firewall outcome is one of

$$
Y_i^{\mathrm{fw}}\in
\{\mathrm{CE},\mathrm{DUE},\mathrm{SDC},\mathrm{MC},\mathrm{ESC}\},
$$

where CE is corrected error, DUE is detected uncorrectable error, SDC is silent
data corruption, MC is miscorrection, and ESC is escaped unsafe side effect.
Each is counted in events [event]. For $N_{\mathrm{tx}}$ protected transactions,

$$
R_y=\frac{N_y}{N_{\mathrm{tx}}},
$$

where $N_y$ is count [event] of firewall outcome $y$, and $R_y$ is rate
[event/transaction]. SDC and ESC are never merged into average task loss.

For independent per-bit upset probability $p_b$ during scrub interval
$\Delta t_s$ [s] and codeword length $n_c$ [bit], the probability of more than
one upset is

$$
P_{>1}=1-(1-p_b)^{n_c}
-n_c p_b(1-p_b)^{n_c-1},
$$

where $P_{>1}$ and $p_b$ are dimensionless. This is only a null: burst,
adjacent, chip, decoder, timing, permanent, and common-cause faults require
their measured geometry.

## Evidence-age-qualified control authority

Let $m_n^{\mathrm{lb}}$ be a conservative lower bound on timing, voltage, memory,
or analog margin in its native unit. Let the proposed operating point consume
margin $c_n^{\mathrm{op}}$ in the same unit and let reserve requirement
$r_n^{\min}$ share that unit. Authority is admissible only when

$$
m_n^{\mathrm{lb}}-c_n^{\mathrm{op}}\ge r_n^{\min},
\qquad
a_n^{\mathrm{ev}}\le a_{\max},
\qquad
x_n\in\mathcal V_n,
$$

where $a_n^{\mathrm{ev}}$ and maximum evidence age $a_{\max}$ are seconds,
$x_n$ is current operating covariate vector, and $\mathcal V_n$ is the validated
operating envelope. Failure of any condition invokes a preregistered safe
operating point or stops acceptance.

Let $P_{\mathrm{esc}}(a)$ be probability [dimensionless] that action $a$ causes
an escaped protected failure during one transaction. A controller action is
permitted only if

$$
P_{\mathrm{esc}}(a\mid O_{0:n},M_{0:n})
\le \epsilon_{\mathrm{esc}},
$$

where $\epsilon_{\mathrm{esc}}$ is the preregistered per-transaction risk limit
[dimensionless]. The bound includes monitor, regulator, clock, policy, and
fallback faults rather than conditioning them away.

## Analog and in-memory computation state

For programmed conductance matrix $G^0$ [S], the effective matrix at time $t$
is

$$
G(t)=G^0+\Delta G^{\mathrm{prog}}+
\Delta G^{\mathrm{drift}}(t,T)+
\Delta G^{\mathrm{cycle}}+
\Delta G^{\mathrm{stuck}},
$$

where every $\Delta G$ term is in siemens [S] and separately denotes programming
error, time- and temperature-dependent drift, cycling variation, and stuck-cell
error. For input-voltage vector $v$ [V], ideal current is $i=Gv$ [A]. Measured
output is

$$
\widetilde i=Q_{\mathrm{ADC}}\!\left(
\Psi_{\mathrm{wire}}(G,v,T)+n_{\mathrm{ana}}
\right),
$$

where $\Psi_{\mathrm{wire}}$ maps conductance and voltage to current while
including wire and peripheral effects, $n_{\mathrm{ana}}$ is analog noise [A],
and $Q_{\mathrm{ADC}}$ is the converter map from amperes to digital code [code].

Hardware-aware training distribution $P_{\mathrm{train}}(\delta)$ over
nonideality vector $\delta$ is compared with held-out physical distribution
$P_{\mathrm{test}}(\delta)$. The support test uses the previously defined
$d_{\mathrm{sup}}$; confident acceptance outside support is scored separately
as silent failure.

## Repair, spares, yield, and retirement state

For unit $i$, lifecycle state is

$$
s_i(t)=(a_i,b_i,r_i,q_i,w_i,v_i),
$$

where $a_i$ is availability [dimensionless], $b_i$ remaining spare capacity
[block or byte], $r_i$ cumulative repair count [repair], $q_i$ current service
qualification [class], $w_i$ wear vector [dimensionless], and $v_i$ version
record [version]. A repair updates $s_i$ and its provenance; it never resets
fabrication yield or prior embodied cost.

Let $C_i^{\mathrm{repair}}$ be repair cost in a declared vector of joules,
kilograms, person-hours, currency, and downtime seconds. Let
$V_i^{\mathrm{future}}$ be expected accepted future service [accepted-service
unit]. Repair is economically or environmentally admissible only under the
registered componentwise budget and risk constraints; a scalar ratio may be
reported as

$$
\rho_i^{\mathrm{repair}}=
\frac{V_i^{\mathrm{future}}}{E_i^{\mathrm{repair}}+E_i^{\mathrm{future}}}
\quad
[\mathrm{accepted\ service/J}],
$$

where $E_i^{\mathrm{repair}}$ and $E_i^{\mathrm{future}}$ are repair and future
operational energy [J]. Material, labor, risk, and time remain separate ledgers.

Hard retirement indicator is

$$
R_i^{\mathrm{hard}}=
\mathbb 1\!\left[
U_i=1\ \lor\
P_{\mathrm{esc},i}^{U}>\epsilon_{\mathrm{esc}}\ \lor\
m_i^{\mathrm{lb}}<m_i^{\min}\ \lor\
q_i\notin\mathcal Q_{\mathrm{safe}}\ \lor\
b_i<b_i^{\min}\ \lor\
v_i\notin\mathcal V_i
\right],
$$

where $U_i$ is an uncontained or unclassifiable fault indicator
[dimensionless], $P_{\mathrm{esc},i}^{U}$ is the upper confidence bound on
escape probability [dimensionless], $m_i^{\min}$ is minimum physical margin in
the same unit as $m_i^{\mathrm{lb}}$, $\mathcal Q_{\mathrm{safe}}$ is the set of
qualified service classes, $b_i^{\min}$ is minimum reserve in the same unit as
$b_i$, and $\mathcal V_i$ is the set of accepted versions and validity states.
When $R_i^{\mathrm{hard}}=1$, the unit cannot accept protected work. Economic
or average-quality gains cannot override this rule.

## Accepted service and complete lifecycle ledgers

For transaction $j$, define acceptance

$$
A_j=\mathbb 1\!\left[
q_j\in\mathcal Q_j\land
\ell_j\le\ell_j^{\max}\land
c_j\in\mathcal C_j\land
y_j^{\mathrm{fw}}\notin\{\mathrm{SDC},\mathrm{MC},\mathrm{ESC}\}
\right],
$$

where $q_j$ is measured quality in its native unit, $\mathcal Q_j$ is the
accepted quality set, $\ell_j$ is latency [s], $\ell_j^{\max}$ is latency limit
[s], $c_j$ is calibration and constraint state [state], $\mathcal C_j$ is its
accepted set, and $y_j^{\mathrm{fw}}$ is firewall outcome. Accepted service is

$$
S_{\mathrm{acc}}=\sum_{j=1}^{N_{\mathrm{tx}}}A_j\omega_j
\quad [\mathrm{accepted\ service}],
$$

where $\omega_j$ is registered service value [service unit/transaction]. Report also
the unweighted accepted transaction count $\sum_j A_j$ [transaction].

Operational energy is

$$
E_{\mathrm{op}}=
E_{\mathrm{compute}}+E_{\mathrm{memory}}+E_{\mathrm{move}}+
E_{\mathrm{convert}}+E_{\mathrm{monitor}}+E_{\mathrm{correct}}+
E_{\mathrm{cal}}+E_{\mathrm{cool}}+E_{\mathrm{idle}}+E_{\mathrm{recover}},
$$

where every term is measured in joules [J] at the declared boundary. Lifecycle
energy is

$$
E_{\mathrm{life}}=E_{\mathrm{fab}}+E_{\mathrm{package}}+
E_{\mathrm{test}}+E_{\mathrm{op}}+E_{\mathrm{repair}}+
E_{\mathrm{replace}}+E_{\mathrm{eol}},
$$

where fabrication, packaging, test, operation, repair, replacement, and
end-of-life terms are joules [J] allocated by a published rule. Failed dies,
spares, calibration, replacement inventory, and facility overhead remain in
scope.

Material and work ledgers are vectors

$$
\mathbf M_{\mathrm{life}}=(m_1,\ldots,m_R),
\qquad
\mathbf H_{\mathrm{life}}=(h_1,\ldots,h_P),
$$

where $m_r$ is mass [kg] of material category $r$, $R$ is category count,
$h_p$ is labor [person-hour] for role $p$, and $P$ is role count. Carbon dioxide
equivalent $C_{\mathrm{life}}$ [kg CO$_2$e] is reported separately with inventory
version, geography, time, allocation, and uncertainty.

Energy intensity of accepted service is

$$
\eta_E=\frac{E_{\mathrm{life}}}{S_{\mathrm{acc}}}
\quad [\mathrm{J/accepted\ service}],
$$

and is undefined when $S_{\mathrm{acc}}=0$. Energy intensity never replaces the
firewall, material, work, availability, latency, or tail-risk outcomes.

## Matched budget and Pareto comparison

Every arm $a$ receives componentwise budget vector

$$
\mathbf B_a=(N_{\mathrm{fab}},A_{\mathrm{silicon}},N_{\mathrm{sens}},
N_{\mathrm{spare}},N_{\mathrm{cal}},N_{\mathrm{label}},N_{\mathrm{sim}},
N_{\mathrm{train}},P_{\mathrm{peak}},E_{\mathrm{life}},T_{\mathrm{wall}},
B_{\mathrm{store}},H_{\mathrm{human}},M_{\mathrm{material}},R_{\mathrm{risk}}),
$$

where the components are fabricated units [unit], silicon area [m$^2$], sensors
[sensor], spares [block], calibration observations [observation], labels [label],
simulation calls [call], training operations [operation], peak power [W],
lifecycle energy [J], wall time [s], stored bytes [byte], human work
[person-hour], material mass [kg], and risk allowance [declared risk unit]. Arm
$a$ is feasible only if

$$
\mathbf B_a\preceq\mathbf B^{\max},
$$

where $\preceq$ means every component is within its preregistered ceiling in the
same unit. Removed ablation components do not donate their budgets elsewhere.

The protected outcome vector is

$$
\mathbf Y_a=(S_{\mathrm{acc}},R_{\mathrm{SDC}},R_{\mathrm{ESC}},
Q_{0.99}^{\mathrm{lat}},A_{\mathrm{avail}},\widehat Y_{\mathrm{joint}},
E_{\mathrm{life}},\mathbf M_{\mathrm{life}},\mathbf H_{\mathrm{life}},
C_{\mathrm{life}},N_{\mathrm{repair}},N_{\mathrm{replace}}),
$$

where $Q_{0.99}^{\mathrm{lat}}$ is 99th-percentile latency [s],
$A_{\mathrm{avail}}$ is availability [dimensionless], $N_{\mathrm{repair}}$ is
repair count [repair], and $N_{\mathrm{replace}}$ is replacement count
[replacement]; the other components were defined above. Pareto dominance is
assessed componentwise after preregistering beneficial directions and hard
constraints.

For paired held-out mission $e$, candidate-minus-null effect on scalar outcome
$y$ is

$$
\Delta_{e,y}=y_{e,\mathrm{cand}}-y_{e,\mathrm{null}},
$$

where $\Delta_{e,y}$ has the unit of outcome $y$. Report hierarchical intervals
grouped by lot, wafer, die, site, workload family, and future time; random-record
splits are diagnostic only.

## Ten-track measurement map

| Audit track | Required quantitative construct | Decisive held-out unit |
| --- | --- | --- |
| E-SEMI-01 | $\widehat Y_{\mathrm{joint}}$, hierarchy, false accept/reject, post-aging yield | lot, wafer, die, block, future time |
| E-SEMI-02 | $S(t\mid M)$, $F_k$, $AF_T$, $d_{\mathrm{sup}}$, coverage, censoring | use-like low stress and mechanism transition |
| E-SEMI-03 | $T(t)$, $P(t)$, $D_k(t)$, $w_j$, accepted-service lifecycle frontier | unseen spatial workload and cooling regime |
| E-SEMI-04 | $f_i$, $Y_i^{\mathrm{fw}}$, scrub age, common-cause identity | withheld geometry and persistence class |
| E-SEMI-05 | $m^{\mathrm{lb}}$, $a^{\mathrm{ev}}$, $P_{\mathrm{esc}}$, fallback | monitor, controller, regulator, and compound fault |
| E-SEMI-06 | exact-state boundary, SDC/ESC, verification and fallback cost | distribution, objective, and structured-error shift |
| E-SEMI-07 | $G(t)$, $\widetilde i$, all peripheral energy, yield, endurance | operator family, device, time, reuse, temperature |
| E-SEMI-08 | $P_{\mathrm{train}}(\delta)$, $d_{\mathrm{sup}}$, calibration, abstention | lot, nonideality, correlation, drift-age combination |
| E-SEMI-09 | $w_j$, value, reconstruction cost, movement and metadata | skewed, shifting, burst, and adversarial writes |
| E-SEMI-10 | $S_{\mathrm{acc}}$, $E_{\mathrm{life}}$, $\mathbf M_{\mathrm{life}}$, $\mathbf H_{\mathrm{life}}$, retirement | inventory, electricity, workload, repair, replacement sensitivity |

## Statistical and retirement contract

The confirmatory analysis preregisters cohort sizes from power or precision
targets, all exclusion rules, multiplicity control, censoring model, calibration
method, hierarchical grouping, uncertainty propagation, and the direction and
minimum relevant magnitude of each effect. Report medians, tails, intervals,
per-device traces, failure maps, and unfavorable regimes; do not pool mechanisms
or populations merely to obtain significance.

The cross-candidate composition is retained only if, on sealed held-out mission
profiles and within $\mathbf B^{\max}$:

1. it improves at least one preregistered accepted-service or lifecycle outcome
   beyond the complete mature null by the minimum relevant magnitude;
2. no hard firewall, coverage, calibration, availability, or retirement limit is
   violated;
3. the effect survives hierarchy-aware analysis, mechanism and inventory
   sensitivity cases, and removal of any unnecessary candidate mechanism; and
4. every claimed gain remains after calibration, correction, recovery, failed
   units, spare consumption, repair, replacement, material, and human work are
   charged.

Failure invokes the narrowest applicable response: remove the unsupported
component, reduce authority, derate or repurpose a qualified unit, or set
$R_i^{\mathrm{hard}}=1$. No result in this contract allocates a new principle or
candidate identifier.

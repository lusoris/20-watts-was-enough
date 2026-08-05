# Operator-qualified active acoustic inference

This note formalizes [Fixture F-009](../experiments/fixtures/009-operator-qualified-active-acoustic-inference.md)
from the [acoustics, hearing, and auditory-scene analysis
audit](../research/audits/2026-08-05-acoustics-auditory-scene-analysis.md).
It supplies a hostile comparison boundary for
[Candidate 002](../experiments/candidates/002-multiscale-context-broadcast.md),
[Candidate 006](../experiments/candidates/006-reversible-physical-skill.md),
[Candidate 007](../experiments/candidates/007-endogenous-observation-surveillance.md),
[Candidate 009](../experiments/candidates/009-graded-assurance-envelopes.md),
[Candidate 012](../experiments/candidates/012-latency-qualified-authority.md),
and [Candidate 014](../experiments/candidates/014-versioned-observation-contract.md).

## Episode, operator, and action identity

For receiver $r$, source $s$, microphone or ear channel $m$, and episode $e$,
preserve

$$
\mathcal A_e=(X_e,S_e,E_e,R_e,H_e,O_e,C_e,T_e,U_e,B_e),
$$

where:

- $X_e$ is geometry, medium, boundaries, temperature in kelvins, relative
  humidity as a dimensionless fraction, flow in metres per second, occupancy,
  and time-varying room/material state;
- $S_e$ is every target and interfering source identity, waveform, position in
  metres, velocity in metres per second, directivity, emission time in seconds,
  and source-level record;
- $E_e$ is commanded and realized active emission: waveform, spectrum, duration
  in seconds, acoustic energy in joules, aim in degrees, repetition, and dose;
- $R_e$ is receiver/body/array position and orientation, aperture in metres,
  morphology, feasible motion, transducer response, gain, health, and saturation;
- $H_e$ is prior acoustic exposure, room/source history, adaptation, training,
  previous emissions and motions, and feedback with timestamps;
- $O_e$ is the observation operator: impulse responses, transfer functions,
  spatial/time support, sample rate in samples per second, quantization in bits,
  clock, latency in seconds, preprocessing, missingness, and selection;
- $C_e$ is calibration identity, uncertainty, reference pressure and distance,
  instrument class, traceability, and data vintage;
- $T_e$ is the target construct, literal outcome, deadline in seconds, and loss
  or utility in declared units;
- $U_e$ is the independent unit: waveform, frame, event, source, room, receiver,
  body, array, device, site, or population; and
- $B_e$ is the complete ceiling in samples, events, bytes, seconds,
  person-hours, joules, emissions, exposure, unsafe events, sensors, actuators,
  replacements, and opportunity.

For method $q$ and literal outcome $k$, the estimand is

$$
Q_{q,k}(\mathcal A)=
\mathbb E\!\left[Y_k\mid do(q),\mathcal A\right],
$$

where $Y_k$ uses the registered unit for outcome $k$. A contrast against
baseline $b$ does not isolate $q$ if aperture, calibration, room response,
source distribution, observation receipt time, emission or motion authority,
training scenes, or any binding resource differs without intervention.

## Pressure, level, exposure, and clock contract

For acoustic pressure $p(t)$ in pascals over interval $T$ in seconds,

$$
p_{\mathrm{rms}}=
\sqrt{\frac{1}{T}\int_0^T p^2(t)\,dt},
\qquad
L_p=20\log_{10}\!\left(\frac{p_{\mathrm{rms}}}{p_0}\right),
$$

where $p_{\mathrm{rms}}$ is RMS pressure in pascals,
$p_0=20\,\mu\mathrm{Pa}$ is the reference pressure in air, and $L_p$ is in
decibels relative to $20\,\mu\mathrm{Pa}$. Frequency weighting, time weighting,
band, location, orientation, and calibration are fields, not implied defaults.

Sound exposure and its level are

$$
E_p=\int_0^T p^2(t)\,dt,
\qquad
L_E=10\log_{10}\!\left(\frac{E_p}{E_0}\right),
\qquad
E_0=p_0^2t_0,
$$

where $E_p$ is in pascal-squared seconds, $L_E$ is in decibels relative to
$E_0$, and reference duration $t_0=1\,\mathrm{s}$. Exposure is not acoustic
emission energy, electrical energy, or a universal risk model.

For channel clock $c$, correct a device timestamp by

$$
\bar t_{c,n}=t^{\mathrm{dev}}_{c,n}-\delta_{c,v},
$$

where device time $t^{\mathrm{dev}}_{c,n}$, corrected time $\bar t_{c,n}$, and
version-$v$ offset $\delta_{c,v}$ are in seconds; $c$ is the channel-clock
index, $n$ is the dimensionless sample index, and $v$ is the dimensionless
calibration version. Retain residual clock
uncertainty $\sigma_{c,v}$ in seconds, drift in seconds per second, capture time,
receipt time, synchronization method, and calibration interval. At decision
time $t$, only observations with receipt time no later than $t$ are available.

## Propagation, rooms, and time-varying mixing

At channel $m$, use the time-varying mixture

$$
y_m(t)=\sum_{s=1}^{S}
\int h_{m,s}(t,\tau)x_s(t-\tau)\,d\tau+n_m(t),
$$

where received waveform $y_m(t)$, source pressure $x_s(t)$, and noise $n_m(t)$
are in pascals; $S$ is dimensionless source count; $t$ and delay $\tau$ are in
seconds; and transfer kernel $h_{m,s}(t,\tau)$ is in reciprocal seconds. A
time-invariant room convolution is a special case. Source/receiver motion,
changing boundaries, temperature, flow, occupancy, and adaptive emitters make
the operator time-dependent.

For an ideal free-field point source with unchanged directivity and negligible
absorption,

$$
\Delta L_p=20\log_{10}\!\left(\frac{r_1}{r_2}\right),
$$

where distances $r_1,r_2$ are in metres and $\Delta L_p$ is in decibels. The
comparison must expose directionality, near-field terms, boundaries,
atmospheric absorption, scattering, and receiver orientation when present.

For a diffuse-field Sabine approximation,

$$
T_{60}\approx0.161\frac{V}{A},
$$

where $T_{60}$ is decay time in seconds, room volume $V$ is in cubic metres,
equivalent absorption area $A$ is in square metres, and $0.161$ has units
seconds per metre. Report measured impulse responses and uncertainty by band,
source, receiver, and support; this approximation is not an operator identity.

## Masking, filterbank, compression, and events

A real gammatone-like channel is

$$
g_j(t)=a_jt^{n_j-1}e^{-2\pi b_jt}
\cos(2\pi f_jt+\phi_j),\qquad t\ge0,
$$

where centre frequency $f_j$ and bandwidth $b_j$ are in hertz, filter order
$n_j$ is dimensionless, phase $\phi_j$ is in radians, time $t$ is in seconds,
and $a_j$ has units $\mathrm{s}^{-n_j}$ so $g_j$ is in reciprocal seconds.
Fixed FFT, wavelet, mel, ERB, gammatone/gammachirp, modulation, and learned
filterbanks remain competing representations.

A local normalized compression fit is

$$
\frac{z}{z_0}=\left(\frac{x}{x_0}\right)^\gamma,
\qquad 0<\gamma\le1,
$$

where magnitudes $x,x_0$ share one input unit, $z,z_0$ share one output unit,
and exponent $\gamma$ is dimensionless. Register frequency, level, state,
attack/release time in seconds, saturation, and distortion; one exponent does
not describe an adaptive cochlea or compressor globally.

For yes/no target detection,

$$
d'=\Phi^{-1}(P_{\mathrm{hit}})-
\Phi^{-1}(P_{\mathrm{false\ alarm}}),
$$

where both $P$ terms are dimensionless probabilities, $\Phi^{-1}$ is the
inverse standard-normal cumulative distribution, and sensitivity $d'$ is
dimensionless. Keep decision criterion, energetic overlap, informational
uncertainty, spatial release, source grouping, and task history separate.

For event encoder threshold $\theta_j$ in the unit of channel response $u_j(t)$,

$$
e_{j,n}=\left(j,t_{j,n},u_j(t_{j,n}),v_{\theta},v_c\right)
\quad\text{when}\quad
|u_j(t_{j,n})-u_j(t_{j,n-1})|\ge\theta_j,
$$

where $j$ is channel identity, event time $t_{j,n}$ is in seconds,
$n$ is the dimensionless event index, $e_{j,n}$ is the retained event record,
$t_{j,n-1}$ is the previous retained-event time in seconds, and
$v_{\theta},v_c$ are dimensionless threshold and clock versions. Event rate is
in events per second. Report missed sustained signals, false events, timestamp
error, decoder cost, bytes, task information, and measured joules; event
sparsity is not an energy unit.

## ITD, ILD, aperture, correlation, and beamforming

For sound speed $c_{\mathrm{snd}}$ in metres per second and path-length
difference $\Delta r$ in metres,

$$
\Delta t=\frac{\Delta r}{c_{\mathrm{snd}}},
$$

where interaural or interchannel time difference $\Delta t$ is in seconds.
Clock offset, phase ambiguity, multipath, source extent, and head/array transfer
functions are part of its uncertainty.

For left/right RMS pressures $p_L,p_R$ in pascals,

$$
\mathrm{ILD}=20\log_{10}\!\left(\frac{p_L}{p_R}\right),
$$

where interaural level difference is in decibels and is band-, time-, source-,
and orientation-qualified. ITD, ILD, spectral cues, and head motion remain
separate intervention axes.

For far-field array aperture $D$ in metres, frequency $f$ in hertz, and
wavelength $\lambda=c_{\mathrm{snd}}/f$ in metres,

$$
\Delta\theta\sim\frac{\lambda}{D},
$$

where angular resolution $\Delta\theta$ is in radians. Geometry, beampattern,
SNR, estimator, bandwidth, and resolution definition determine the coefficient;
no learned estimator restores spatial frequencies excluded by the physical
support without additional prior information.

For signals $y_1(t),y_2(t)$ in pascals, define generalized cross-correlation

$$
R_{12}^{(\Psi)}(\tau)=
\int_{-\infty}^{\infty}
\Psi(f)Y_1(f)Y_2^*(f)e^{i2\pi f\tau}\,df,
\qquad
\widehat{\tau}=\arg\max_{\tau\in\mathcal T}R_{12}^{(\Psi)}(\tau),
$$

where $Y_1,Y_2$ are Fourier transforms in pascal-seconds, frequency $f$ is in
hertz, delay $\tau$ and estimate $\widehat\tau$ are in seconds,
$\mathcal T$ is the feasible delay set in seconds, superscript $*$ is complex
conjugation, and weighting $\Psi(f)$ has reciprocal pascal-squared-second-squared
units so $R_{12}^{(\Psi)}$ is in hertz after integration. The peak must carry a
calibrated multimodal delay distribution under reverberation, not only an
argmax.

For array snapshot $\mathbf y\in\mathbb C^M$ in pascals, dimensionless steering
vector $\mathbf a$, and noise covariance
$\mathbf R_n=\mathbb E[\mathbf n\mathbf n^H]$ in pascal-squared units,

$$
\mathbf w_{\mathrm{MVDR}}=
\frac{\mathbf R_n^{-1}\mathbf a}
{\mathbf a^H\mathbf R_n^{-1}\mathbf a},
\qquad
z=\mathbf w_{\mathrm{MVDR}}^H\mathbf y,
$$

where $M$ is microphone count, superscript $H$ is conjugate transpose,
$\mathbf w_{\mathrm{MVDR}}$ is dimensionless, and output $z$ is in pascals.
Steering mismatch, covariance error, short sample support, correlated sources,
motion, and room change receive sealed interventions.

## Reverberation, separation, and source identity

For direct component $d_m(t)$, early-reflection component $r_m^{\mathrm{early}}(t)$,
late component $r_m^{\mathrm{late}}(t)$, and noise $n_m(t)$, all in pascals,

$$
y_m(t)=d_m(t)+r_m^{\mathrm{early}}(t)+
r_m^{\mathrm{late}}(t)+n_m(t).
$$

The early/late boundary is a registered time in seconds relative to the direct
arrival. Waveform dereverberation, speech compensation, perceived distance,
localization, and downstream intelligibility are distinct outcomes.

For estimated source $\widehat{\mathbf s}$ and reference source
$\mathbf s\in\mathbb R^N$ with the same amplitude unit and sample count $N$,

$$
\mathbf s_{\mathrm{target}}=
\frac{\langle\widehat{\mathbf s},\mathbf s\rangle}
{\lVert\mathbf s\rVert_2^2}\mathbf s,
\qquad
\mathrm{SI\!\!-\!SDR}=10\log_{10}
\frac{\lVert\mathbf s_{\mathrm{target}}\rVert_2^2}
{\lVert\widehat{\mathbf s}-\mathbf s_{\mathrm{target}}\rVert_2^2},
$$

where $\langle\cdot,\cdot\rangle$ is the waveform inner product and SI-SDR is
in decibels. Report unknown source count, permutation, causal identity,
localization, intelligibility, calibration, perceptual/task quality, and
residual mixture separately.

For predicted scene outcome $z_n$ and causally available acoustic observation
$o_n$, proper log loss is

$$
L_q=-\frac{1}{N_e}\sum_{n=1}^{N_e}
\log_2p_q(z_n\mid o_n),
$$

where $N_e$ is independent event count and $L_q$ is in bits per event. Use it
for detection, source count, assignment, localization bins, range bins, and
abstention under held-out operators; do not pool incompatible outcomes.

## Active emission, dose, and closed-loop action

For monostatic emission at $t_{\mathrm{emit}}$ and echo receipt at
$t_{\mathrm{recv}}$, both in seconds,

$$
\widehat r=\frac{c_{\mathrm{snd}}}{2}
\left(t_{\mathrm{recv}}-t_{\mathrm{emit}}\right),
$$

where estimated range $\widehat r$ is in metres and sound speed
$c_{\mathrm{snd}}$ is in
metres per second. Clock uncertainty, target motion, refraction, multipath,
transducer ringing, waveform ambiguity, association, and detector threshold
must propagate to range uncertainty.

For acoustic output power $P_{\mathrm{ac}}(t)$ in watts over emission duration
$T_e$ in seconds,

$$
E_{\mathrm{emit}}=\int_0^{T_e}P_{\mathrm{ac}}(t)\,dt,
$$

where $E_{\mathrm{emit}}$ is acoustic joules. Electrical input, transduction
loss, body/sensor motion, sensing, compute, cooling, detectability, interference,
and exposure remain separate axes.

At decision time $t$, a complete acoustic policy is

$$
(a_t^{\mathrm{emit}},a_t^{\mathrm{body}},a_t^{\mathrm{sensor}},
a_t^{\mathrm{gain}},a_t^{\mathrm{task}})=
\pi_q\!\left(\mathcal H_t,\widehat X_t,\widehat O_t,
\widehat U_t,\mathcal A_t^{\mathrm{safe}},B_t\right),
$$

where $a_t^{\mathrm{emit}}$ contains waveform, level, spectrum, aim, and timing;
$a_t^{\mathrm{body}}$ contains pose or head/body motion in metres, radians, and
seconds; $a_t^{\mathrm{sensor}}$ contains aperture, sample rate, and channel
selection; $a_t^{\mathrm{gain}}$ is dimensionless or in declared decibels;
$a_t^{\mathrm{task}}$ is the downstream command in its native unit;
$\mathcal H_t$ is causally received history; $\widehat X_t$ is scene state;
$\widehat O_t$ is operator/calibration state; $\widehat U_t$ is uncertainty;
$\mathcal A_t^{\mathrm{safe}}$ is the feasible action envelope; and $B_t$ is
remaining budget in matched units. Attention- or efferent-like gain receives
causal credit only when intervening on it changes its registered endpoint.

## Hardware, lifecycle energy, and equal budgets

Lifecycle energy is

$$
E_q^{\mathrm{life}}=
E_q^{\mathrm{data}}+E_q^{\mathrm{train}}+E_q^{\mathrm{emit}}+
E_q^{\mathrm{sense}}+E_q^{\mathrm{infer}}+E_q^{\mathrm{move}}+
E_q^{\mathrm{comm}}+E_q^{\mathrm{store}}+E_q^{\mathrm{cal}}+
E_q^{\mathrm{maint}}+E_q^{\mathrm{emb}},
$$

where every term is in joules over one service interval and denotes data
acquisition, training, acoustic emission, sensing, inference, physical motion,
communication, storage, calibration, maintenance, and amortized embodied
energy. DSP, FPGA, ASIC, neuromorphic, CPU, GPU, and analog front ends are
measured at identical physical boundaries and workload deadlines.

Human effort is

$$
H_q^{\mathrm{human}}=
H_q^{\mathrm{design}}+H_q^{\mathrm{record}}+H_q^{\mathrm{label}}+
H_q^{\mathrm{listen}}+H_q^{\mathrm{cal}}+H_q^{\mathrm{tune}}+
H_q^{\mathrm{monitor}}+H_q^{\mathrm{repair}},
$$

where every $H$ term is in person-hours and roles are reported separately.

The complete cost vector is

$$
\mathbf C_q=(N_{\mathrm{sample}},N_{\mathrm{event}},N_{\mathrm{step}},
N_{\mathrm{query}},N_{\mathrm{byte}},T_{\mathrm{wall}},
H_q^{\mathrm{human}},E_q^{\mathrm{life}},E_p,
N_{\mathrm{unsafe}},D_{\mathrm{harm}},C_{\mathrm{opp}}),
$$

where the five $N$ terms count samples, emitted/received events, optimization or
environment steps, queries, and bytes; $T_{\mathrm{wall}}$ is seconds;
$H_q^{\mathrm{human}}$ is person-hours; $E_q^{\mathrm{life}}$ is joules;
$E_p$ is pascal-squared-second exposure; $N_{\mathrm{unsafe}}$ counts unsafe
events; $D_{\mathrm{harm}}$ uses a registered physical or severity unit; and
$C_{\mathrm{opp}}$ is opportunity cost in task exposures or person-hours.

Method $q$ is feasible only when

$$
\mathbf C_q\preceq\mathbf B,
$$

where $\mathbf B$ is the preregistered componentwise ceiling with identical
units. Over-budget runs are infeasible; removed ablation resources stay unused.

## Confirmatory contrast and retirement

Let $b^*(j)$ be the strongest mature baseline for track $j$, frozen on
development data. Orient every protected endpoint as a preregistered benefit,
so larger $Q$ is better and a non-inferiority margin may be negative. For
protected outcomes $k\in\mathcal P_j$, retain a residual only when

$$
\Pr\!\left(
Q_{q,k}-Q_{b^*(j),k}>\delta_{j,k}
\text{ for every }k\in\mathcal P_j
\right)\ge1-\alpha_j,
$$

where $\delta_{j,k}$ is an improvement or non-inferiority margin in the unit of
outcome $k$, and $\alpha_j$ is the dimensionless error budget. The result must
survive held-out rooms, sources, arrays, bodies, operators, scenes, source
counts, interference policies, model families, sites, and hardware classes at
equal complete cost. Otherwise retire the architectural residual while keeping
the operator/action/measurement contract.

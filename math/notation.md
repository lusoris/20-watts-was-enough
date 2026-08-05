# Notation and units

## System variables

| Symbol | Meaning | Unit |
| --- | --- | --- |
| $x$ | one input event or task instance | declared by task |
| $Q$ | task-quality measure | task-specific |
| $R$ | risk, error, or miscalibration measure | task-specific |
| $L_{p95}$ | 95th-percentile end-to-end latency | seconds |
| $E$ | energy over a declared interval | joules |
| $P$ | average power over a declared interval | watts = joules/second |
| $T$ | measurement duration | seconds |
| $N$ | qualified events completed | count |
| $B$ | bytes transferred across a named boundary | bytes |
| $C$ | counted arithmetic or module work | declared operation |
| $g_i(x)$ | gate for module $i$ on event $x$ | dimensionless |
| $c_i(x)$ | cost proxy for module $i$ | operations, bytes, or joules |
| $z_t$ | latent state at time $t$ | dimensionless vector |
| $\sigma_t$ | predicted uncertainty for $z_t$ | same scale as distance |
| $s_t$ | normalized surprise | dimensionless |

## Required qualifiers

`FLOP`, `operation`, `token`, `event`, and `sample` are not interchangeable.
Every use must define:

- arithmetic precision;
- dense, effective-sparse, or executed count;
- training or inference;
- batch and sequence shape; and
- whether memory and communication are included.

## Boundary labels

- $E_{\text{device}}$: accelerator package only.
- $E_{\text{node}}$: accelerator, CPU, memory, local storage, and node cooling.
- $E_{\text{cluster}}$: nodes plus network and shared infrastructure.
- $E_{\text{facility}}$: cluster energy multiplied by a contemporaneous,
  attributable facility overhead.

Results must not move between boundaries by implication.

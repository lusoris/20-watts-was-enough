# Visual models

These plots turn four recurring equations into inspectable boundaries. They are
not result figures: no curve contains workstation measurements. The equations
come from the canonical math and energy notes; normalized sweeps make their
consequences visible before an implementation exists.

## Finite-error erasure boundary

![The normalized generalized erasure lower bound falls from ln 2 at zero error to zero at one-half allowed error.](../public/plots/finite-error-erasure.svg)

For a uniform binary reset with tolerated error $\epsilon$,

$$
\frac{E_{\mathrm{fund,reset}}}{k_B T}
=\ln 2-h(\epsilon),
\qquad
h(\epsilon)=-\epsilon\ln\epsilon-(1-\epsilon)\ln(1-\epsilon).
$$

The plot shows why $k_B T\ln 2$ is not a universal energy-per-operation
constant. Relaxing the logical error changes the lower bound, while correction,
retry, retained side information, duration, and downstream harm remain outside
this curve. See the
[full derivation](boundary-qualified-physical-computation.md#logical-loss-and-generalized-erasure).

## Finite-time adiabatic crossover

![Four normalized adiabatic energy curves form different U-shaped crossovers as leakage changes.](../public/plots/adiabatic-crossover.svg)

The normalized diagnostic model is

$$
\frac{E_{\mathrm{ad}}}{CV^2}
=\frac{\gamma}{x}+\ell x+e_{\mathrm{overhead}},
\qquad x=\frac{\tau}{RC}.
$$

Slowing a transition reduces the first term but increases leakage exposure.
The minimum therefore occurs at a finite duration, and a real advantage exists
only where the complete curve beats a matched ordinary reference. The plotted
$\ell$ and overhead values are illustrative, not device coefficients. See the
[device-boundary model](boundary-qualified-physical-computation.md#measured-device-transition).

## Sparse/locality break-even plane

![A two-color break-even plane separates net energy gain from net loss at the line where overhead equals avoided work.](../public/plots/sparse-locality-break-even.svg)

Normalize all candidate-minus-baseline energy changes by baseline energy. Let
$g$ be avoided arithmetic plus avoided movement and $o$ be added routing,
synchronization, metadata, conversion, and idle burden. Then

$$
\frac{\Delta E}{E_B}=o-g.
$$

Sparse activation is beneficial only below the diagonal. A lower active
parameter count on its own says nothing about which side of the boundary an
implementation occupies. The underlying event ledger is defined in the
[energy model](../concept/80-energy-model.md#data-movement-ledger).

## Lifecycle break-even horizon

![A logarithmic heatmap shows the event count needed to repay one-time candidate burden at different per-event savings.](../public/plots/lifecycle-break-even.svg)

For candidate one-time burden $\Delta E_0$ and accepted-service saving
$\delta e=e_B^{\mathrm{serve}}-e_C^{\mathrm{serve}}$,

$$
N^*=\frac{\Delta E_0}{\delta e},
\qquad
T^*=\frac{N^*}{\lambda_q}.
$$

The contour map makes a common failure explicit: a component can save energy
per event but never repay compilation, search, fabrication, migration, or
qualification within its useful service horizon. If $\delta e\leq0$, no
positive break-even exists. See the
[lifecycle accounting rule](../concept/80-energy-model.md#break-even-horizon).

## Reproduction and editing

The editable parameter source is
[core-models.json](../assets/plots/core-models.json). The deterministic
generator is `scripts/generate-plots.mjs`; generated SVG files live under
`public/plots/`. Change the specification or generator, regenerate, and commit
source and output together.

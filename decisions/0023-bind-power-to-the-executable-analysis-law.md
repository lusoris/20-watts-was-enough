# 0023 — Bind power to the executable analysis law

- **Status:** accepted
- **Date:** 2026-08-27

## Context

The first RSD-T02 planning calculator used a normal approximation for an
equal-family mean contrast. That calculation is useful for dimensional checks
and sensitivity plots, but the registered analyzer uses a centered stratified
bootstrap-$t$ followed by Holm's four-hypothesis step-down procedure.

Those are not interchangeable power models. With small within-family samples,
some bootstrap resamples have zero estimated standard error. The analyzer
conservatively counts them as extreme. If $B$ resamples are drawn and $B_0$ of
them are degenerate, the smallest attainable one-sided value for that observed
dataset is

$$
p_{\min,\mathrm{data}}=\frac{B_0+1}{B+1}.
$$

A variance-only normal calculation cannot predict $B_0$. It can therefore
report high nominal power for a count at which the executable bootstrap test
cannot reach even the first Holm threshold.

## Decision

1. Treat variance-only normal calculations as sensitivity diagnostics, not as
   calibrated power for a bootstrap or randomization analyzer.
2. Bind every frozen power claim to the exact released endpoint code,
   resampling law, test direction, multiplicity family, failure penalties,
   abstention rule, and deterministic resampling-key policy.
3. Make the executable analyzer expose $B_0$, the resulting data-dependent
   $p$-value floor, and whether that floor can reach the first Holm threshold.
4. Require prospective pilot transcripts to pass through the exact analyzer in
   a reviewed simulation or resampling study before the sample-size artifact
   can freeze.
5. Keep pre-response attrition and post-response runtime failure separate.
   Attrition may inflate recruitment through a registered retention bound;
   runtime failures stay in the analysis denominator at frozen penalties.
6. Keep support coverage as a separate design gate rather than converting it
   into an unregistered sample-size multiplier.
7. Forbid private-response sample-size or power recalculation.

## Consequences

- The checked-in RSD-T02 normal/binomial calculator remains useful for units,
  inverse-square sensitivity, Holm-threshold, and retention checks, but cannot
  pass the prospective-power gate by itself.
- The illustrative count plot is explicitly a variance-only diagnostic and
  labels its no-attrition series.
- A large Monte Carlo resample count alone does not prove attainable
  resolution; the observed degeneracy floor must also pass.
- Final planning needs a byte-bound pilot artifact and an exact analyzer release
  rather than hash-shaped caller assertions.
- Any future change to endpoints, penalties, resampling, multiplicity, or
  abstention invalidates the corresponding power artifact and requires a new
  version.

## Supersession

Supersede this record only with a reviewed finite-sample argument or exact test
whose power and attainable resolution are proven under the released analysis
law. A different asymptotic approximation alone is not sufficient.

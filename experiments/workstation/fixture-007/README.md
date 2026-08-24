# Fixture 007 workstation harness

This is the first executable track of
[Fixture F-007](../../fixtures/007-operator-qualified-optical-inference.md):
null-space honesty under a rank-deficient measurement operator. It is
**smoke-ready**, not a workstation result.

The generator creates paired latent states whose task label is absent from the
base operator. Four arms receive the same frozen episodes:

1. `unqualified-point` emits a point answer from irrelevant base variation and
   acts as a required negative control;
2. `mature-selective` represents calibrated abstention when the state is not
   identified;
3. `mature-active` buys the missing measurement under the declared photon and
   modeled-energy budget; and
4. `operator-qualified-active` receives exactly the same active observation
   and must match, not outperform, the complete mature active null.

The diagnostic passes only when false specificity is exposed, justified
abstention is accepted, the active observation is informative, resource
accounting is equal, and the proposed composition has **zero artificial
advantage** over the mature active arm. Raw events form an exact SHA-256 chain;
analysis is rebuilt from that ledger and refuses altered records.

![Analytical likelihood overlap under the base operator and separation after an active measurement](../../../public/plots/fixture-007-identifiability.svg)

Editable assumptions:
[`core-models.json`](../../../assets/plots/core-models.json). The curves are
analytical consequences of the smoke configuration, not measured performance.

Run from the repository root:

```powershell
npm run workstation:fixture-007 -- prepare --profile smoke
npm run workstation:fixture-007 -- smoke --profile smoke --output experiments/workstation/runs/fixture-007-smoke
npm run workstation:fixture-007 -- run --profile development --output experiments/workstation/runs/fixture-007-development
npm run workstation:fixture-007 -- analyze --output experiments/workstation/runs/fixture-007-development
npm run workstation:fixture-007 -- validate --output experiments/workstation/runs/fixture-007-development
```

Current limits are explicit: observations and energy are simulated, the
development seeds are visible, the active operator is deliberately simple,
there is no physical optical instrument or calibration chain, no confirmation
or held-out reveal exists, and no execution output can promote C-970 or C-972.
The next stage is to add operator-family shift, calibrated likelihood tests,
photon-counting regimes, a sealed seed ceremony, and a physical-instrument
adapter with external energy and calibration evidence.

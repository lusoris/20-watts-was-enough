# 0020 — Separate information cuts from scientific replication

- **Status:** accepted
- **Date:** 2026-08-26

## Context

RSD-T02 already has 64 public seeds. In the current matched-step constructor,
however, a seed selects one of only two hidden permutations of two opaque state
handles. That can swap which internal coordinate a reset or freeze command
targets, but it does not create a new equation, parameter draw, input history,
noise realization, physical specimen or independently generated system.
Splitting those labels into training and evaluation subsets can prevent one
kind of software leakage, but it cannot turn repeated deterministic worlds
into independent scientific evidence.

The distinction matters because a clean information cut and valid replication
answer different questions:

1. an information cut determines what an algorithm may inspect before its
   parameters, thresholds and outputs are frozen; and
2. a replication unit determines what variation supports uncertainty,
   generalization and a comparison claim.

Calling every seed a replicate would produce narrow intervals from repeated
copies of essentially the same construction and would hide failure to
generalize beyond the five enumerated public worlds.

This follows the experimental-unit boundary behind
[Hurlbert's pseudoreplication critique](https://doi.org/10.2307/1942661),
bibliography key [`hurlbert1984pseudoreplication`](../research/references.bib):
repeated measurements or samples do not supply treatment replication when the
units relevant to the tested hypothesis are not independently replicated.

## Decision

Seed partitions and scientific units must be declared separately. A seed may
serve as a procedural partition key without receiving inferential authority.

For the prospective RSD-T02 Stage-3 development design, the ordered public
seed pack is split once into:

1. 32 fit seeds for parameter fitting and fit-only model selection;
2. 16 calibration seeds for probability calibration and frozen support and
   abstention thresholds; and
3. 16 evaluation seeds for one-pass frozen inference and scoring.

The three roles are disjoint and exhaustive. Calibration cannot refit model
parameters or change the model family. Evaluation cannot fit, recalibrate,
change a threshold, remove a scored supported unit or authorize a comparison.

This `32/16/16` split is a public-development information barrier only. The
current seeds are not independent scientific units, the split is not powered,
and no seed-level significance calculation is permitted. A later comparison
requires independently generated held-out system instances, an outer
system-family holdout, frozen resource caps, implemented generic state-space
and recurrent nulls, and a prospectively powered private confirmation design.

## Consequences

- Code and documentation must not equate seed count with effective sample
  size.
- The unit of analysis must describe the mechanism that actually varies, such
  as a held-out system instance, parameter draw, physical specimen or run.
- Repeated solver tolerances, opaque-label permutations and repeated scoring of
  one trajectory are diagnostics or repeated measurements, not independent
  replications by default.
- Fit artifacts freeze before calibration artifacts; both freeze before any
  evaluation response is opened.
- Power and multiplicity are specified for the later confirmation design, not
  retrofitted to the public split after outputs are seen.
- A generic null becomes mature through implemented training, prospective
  calibration, held-out evaluation, resource accounting and hostile tests—not
  through naming a fixed construction rule after a model family.

## Supersession

Supersede this record only with a prospective design that identifies the new
source of independent variation, its assignment mechanism, the effective unit
of analysis, the information cut and the uncertainty procedure before any
affected evaluation output is inspected.

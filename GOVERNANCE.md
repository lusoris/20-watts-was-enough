# Governance

## Purpose

This document defines how repository changes, scientific records, experiment
authority, and public snapshots are governed. It does not decide scientific
truth by vote or by maintainer preference. Evidence, scope, registered tests,
and the repository's promotion contracts remain controlling.

## Roles and authority

### Maintainer

[`@lusoris`](https://github.com/lusoris) is the current project maintainer and
has final authority over repository scope, merges, releases, access, and
administrative settings. The maintainer is responsible for preserving the
research and execution contracts, applying the licences, reviewing security
reports, and recording durable decisions.

Repository authority is narrower than scientific authority. The maintainer may
decide whether and how material belongs in this project, but cannot promote a
claim, principle, experiment, or result by assertion when its registered
evidence and promotion requirements are not satisfied.

### Contributors and reviewers

Anyone may propose corrections, sources, mechanisms, protocols, code, or
presentation changes through the routes in [`SUPPORT.md`](SUPPORT.md) and
[`CONTRIBUTING.md`](CONTRIBUTING.md). A contribution does not gain authority by
being merged: its claim status and experimental meaning remain limited by the
records and evidence attached to it.

## Claims, principles, and evidence status

The following changes require explicit traceability:

- a major empirical assertion receives or updates a stable `C-` record in
  [`research/claims.md`](research/claims.md);
- a proposed transferable mechanism is checked against the existing `P-`
  bundles in [`research/principle-registry.md`](research/principle-registry.md)
  before a new principle is created;
- an evidence-status change states the old and new status, exact scope,
  supporting or contrary primary sources, rationale, uncertainty, and affected
  chapters or tests; and
- a translation from another field remains distinct from the source
  observation and from the project's testable hypothesis.

Status promotion is not a reward for consensus, code completion, publication,
or a favorable demonstration. It requires the evidence appropriate to the
stated scope. Unresolved, incompatible, or contrary evidence may remain
recorded as `disputed` rather than being forced into agreement.

## Experiment and result authority

Experiment prose, executable plumbing, and scientific evidence are separate
levels of authority. The contracts in
[`experiments/`](experiments/README.md) and
[`experiments/workstation/`](experiments/workstation/README.md) control their
respective artifacts.

- A written protocol, generated fixture, construction check, smoke run, or
  development run remains `NO_RESULT` unless a more specific registered
  contract grants additional authority.
- A frozen protocol identifies its hypotheses, mature nulls, data and seed
  boundaries, resource parity, analysis law, rejection rules, runtime identity,
  and output schema before confirmation.
- Development diagnostics may block an ineligible protocol. They may not be
  hidden by relabeling the artifact or releasing private seeds.
- Confirmation, held-out, performance, and measured-energy conclusions require
  their own eligible evidence. Authority in one category does not imply another.
- Changing a frozen protocol, comparator, evaluator, or authority-bearing
  boundary creates a new version and requires renewed review.

Machine-readable validators and append-only raw records outrank summaries and
presentation prose when deciding what an execution established.

## Decisions

Non-trivial architectural, policy, licensing, authority, or scope choices are
recorded under [`decisions/`](decisions/README.md). Accepted decisions are
append-only. A later choice creates a new record that names the decision it
supersedes; history is not silently rewritten.

Routine implementation and editorial choices do not each need a decision
record. A decision is warranted when future work needs a stable answer, when
reasonable alternatives materially change the project, or when a trust or
authority boundary changes.

## Direct changes and pull requests

The project currently has one maintainer. `@lusoris` may make direct changes for
routine maintenance, bounded editorial work, generated-artifact refreshes, and
urgent security remediation. Direct changes must meet the same provenance,
validation, licensing, changelog, decision, and authority requirements as a
pull request; direct access is not an evidence or test bypass.

External contributions use pull requests. Pull requests are also preferred for
substantial changes to public interfaces, research status, experiment
authority, licensing, governance, or security because they preserve a visible
proposal and review record. Review may request narrower scope, stronger nulls,
additional evidence, migration guidance, or a superseding decision.

## Releases and publication snapshots

A tag or release is an immutable historical snapshot, not a declaration that
all research is established, all experiments are confirmed, or the software is
certified. A release snapshot should identify the source commit, summarize
changes, retain the applicable licences and third-party notices, and keep any
downloadable book PDF paired with its generated manifest and digest.

GitHub Pages and the downloadable book are publication surfaces derived from
canonical Git content. Deployment success does not promote scientific claims.
No release schedule or long-term support window is promised.

## Licensing

The split allocation in [`LICENSING.md`](LICENSING.md) governs contributions
and releases:

- project-authored software and technical execution material use EUPL v1.2 or
  later as stated there;
- original project prose, mathematical exposition, diagrams, plots, and
  presentation use CC BY-SA 4.0; and
- imported, quoted, official, and other third-party material retains its own
  rights, notices, and recorded use basis.

Merge, citation, public availability, or inclusion in a generated edition does
not relicense third-party material.

## Repository settings and verification

Repository visibility, branch rules, required reviews, Pages configuration,
private vulnerability reporting, and other host controls live outside Git.
Policy files and workflow files do not prove that those settings are active.
Whenever a consequential change relies on a host setting, the maintainer must
verify the setting in GitHub and record that verification in the relevant
change, release, or security record.

[`CODEOWNERS`](.github/CODEOWNERS) documents intended ownership and review
routing. It does not claim that branch protection or required review is enabled.
Nothing in this repository claims certification or legal compliance merely
because a checklist, validator, policy, or host control exists.

## Disagreements and amendments

Scientific disagreements should identify the disputed claim, evidence, scope,
and a test or observation that could resolve it. The maintainer decides the
repository disposition and records the rationale; dissenting evidence may
remain visible.

Material amendments to this governance model require an append-only decision
record. Updating names, links, or administrative facts may use the ordinary
change path.

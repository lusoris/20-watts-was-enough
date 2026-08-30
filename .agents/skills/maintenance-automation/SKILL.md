---
name: maintenance-automation
description: Design or review recurring maintenance automation for 20 Watts Was Enough, including dependencies, CI, releases, generated artifacts, GitHub metadata, security drift, and translation freshness. Use when upkeep repeats or repository state drifts; do not use to automate scientific judgement or claim promotion.
---

# Maintenance automation

Remove recurring repository work without creating an opaque maintenance system.
The automation should expose drift early, propose or apply only bounded repairs,
and leave research decisions with their named authority.

Before changing maintenance machinery, read the affected authority, its nearest
`AGENTS.md`, and [`docs/principles.md`](../../../docs/principles.md). Consult
[`references/automation-map.md`](references/automation-map.md) to find the
existing owner before adding another command, manifest, workflow, or scheduled
job. Read [`references/prior-art.md`](references/prior-art.md) when revising
this skill or adopting an external automation pattern.

## Admit the task

Automate a task only when all of these are true:

1. The task has happened at least twice, or a deterministic freshness or drift
   invariant proves it will recur.
2. One committed source can own the desired state.
3. Success and failure are machine-checkable without interpreting scientific
   meaning.
4. The repair can be bounded, made idempotent, and stopped without leaving an
   ambiguous partial state.
5. The expected saved time or avoided failure is greater than the new owner,
   tests, permissions, and upgrade burden.

A painful one-off is not automatically a maintenance system. Record it in the
relevant issue when recurrence, authority, or a safe repair contract is still
unclear.

Admit one maintenance class per change and set finite proposal, finding,
inventory, retry, and output caps. A request to “automate everything” is a
request to classify the backlog, not approval for one cross-authority patch or
remote write.

## Reuse the authority

Inventory the current source, checker, repair path, workflow, issue route, and
failure evidence. Extend the existing Go package or validator when it already
owns the contract. Prefer, in order:

1. delete duplicate state and derive it from the authority;
2. add a read-only freshness or drift check;
3. emit a deterministic repair plan or diff;
4. add an explicit write mode for reversible Git-owned state; and
5. automate a remote mutation only when the repository contract already grants
   that authority and the operation has a preflight, postcondition, and bounded
   rollback or retry path.

Classify an alert before assigning its owner. A Dependabot advisory, Renovate
version proposal, GitHub Action update, CodeQL result, and Scorecard governance
signal can concern the same dependency or repository while requiring different
evidence and repair paths.

Portable repository automation belongs in the `20w` Go command where practical.
Use the standard library first, accept the repository root explicitly, and keep
network access behind an explicit subcommand. A committed manifest owns desired
state; a workflow schedules or authenticates the command but does not become a
second implementation.

Do not add PowerShell, batch files, host-specific wrappers, or a general task
runner around commands the repository already exposes. Do not fetch mutable
skill text or operational policy at runtime.

## Specify the maintenance contract

Before implementation, state:

- the repeated symptom and retained evidence;
- the single authority and the state derived from it;
- the trigger: event, changed path, release boundary, or justified schedule;
- inputs, outputs, limits, timeout, permissions, and secret boundary;
- read-only check and explicit repair behaviour;
- idempotence and partial-failure behaviour;
- fixed inventory, proposal, retry, time, and output caps;
- focused tests and the impacted CI lanes;
- the operator-visible failure route; and
- the durable evidence location and retention period; and
- the condition under which the automation should be removed or superseded.

Choose an event or changed-path trigger when it represents the real cause. A
scheduled job needs a documented cadence based on staleness cost, not habit.
Prefer an off-minute schedule with a manual dry-run or check entry point when a
schedule is justified. Serialize overlapping runs and do not cancel an
in-progress remote repair. Never respond to a slow gate by running it more
often.

## Keep repair authority narrow

An automatic repair may update deterministic, reversible, Git-owned derived
state. It may not:

- promote, demote, or merge a `C-` claim, evidence status, result, or experiment
  readiness state;
- decide whether a source supports a scientific or normative assertion;
- publish machine translation as reviewed translation;
- suppress a security, type, lint, freshness, or integrity finding;
- merge a dependency or major toolchain upgrade without the existing review
  gate;
- delete unmanaged GitHub objects or rewrite issue history; or
- change branch protection, repository security settings, credentials, cluster
  state, releases, or other consequential remote state without the explicit
  authority and verification required for that operation.

GitHub metadata automation runs from trusted `main`, uses the committed
manifest, preserves unmanaged objects, and treats issue or milestone progress
as operational state only. A privileged workflow never executes pull-request
code. External actions stay pinned to full commit SHAs and each job receives
only the permissions it needs.

A remote coordination object needs a stable hidden marker or fingerprint.
Search before creation, update exactly one managed match, preflight exact labels
and numeric milestones, then read the object back. Do not infer issue-to-
milestone assignments without a committed mapping and explicit maintainer
approval. A broad maintenance request is not permission for consequential
remote mutation; reconfirm that boundary immediately before the write.

## Verify before hand-off

Test the check path, repair path, idempotent second run, malformed or stale
input, boundary exhaustion, and the most dangerous plausible partial failure.
Use temporary repositories or fixtures for mutation tests. Confirm that a
check run does not write and that repair produces a reviewable diff or exact
remote postcondition.

Run the focused package and policy checks while developing. Use the committed
CI impact map to select every affected lane; run the aggregate gate once at the
required integration or release boundary instead of repeating it between
micro-edits. A green unrelated workflow is not verification of this change.

Hand off the symptom removed, authority reused, trigger, repair boundary,
permissions, focused evidence, measured or expected maintenance cost saved,
and removal condition. Report an unexercised remote or failure lane as
unverified. Do not spend the task watching an unchanged workflow when another
bounded maintenance item can be completed.

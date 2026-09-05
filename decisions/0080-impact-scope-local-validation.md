# 0080 — Impact-scope local validation

- **Status:** accepted
- **Date:** 2026-09-05
- **Authority:** maintainer approval of impact-scoped local checks; complete
  integration, merge and release gates remain required

## Context

The root agent contract required `npm run check` before every commit, while
the maintenance skill already distinguished focused development checks from
the complete integration gate. Repeating unrelated checks during a bounded
change adds work without testing a different input. A leaf test alone is also
insufficient when another package, command or generated artifact consumes the
changed contract.

## Decision

Scope local pre-commit validation to the changed contracts and their affected
consumers. This changes when local checks run, not their assertions or the
complete integration and release obligations. The root
[`AGENTS.md`](../AGENTS.md) owns this sequence; nested contracts may require
additional checks.

### Select the working-tree scope

Before committing, inspect the staged diff, unstaged diff and relevant
untracked files, including additions, deletions, renames and type changes.
Record which changes will be committed and which bytes the checks actually
read. Preserve unrelated work. If it affects validation, include it in the
scope or use an isolated worktree; do not silently discard it or report a
mixed working-tree pass as evidence for the staged subset.

Use the current [impact map](../.github/ci-impact.json), command definitions
and actual consumers to select checks. Follow imports, callers, fixtures,
shared helpers, CLI adapters, generators and artifact readers. For Go, include
affected reverse dependencies and integration tests: testing a package does
not automatically run its consumers' tests. Combine the checks for every
changed owner in a mixed change, rather than choosing one dominant lane.

Changed Markdown requires `npm run check:prose`, `npm run validate:docs` and
`npm run validate:math`, including edits to command examples outside research
chapters. Add the other checks selected by its owners and consumers. A prose
or link-validation pass alone does not cover notation validation.

Unknown ownership, unavailable comparisons, unsafe transitions and shared
authority require the full local `npm run check` fallback. This includes
selector, global policy, module/lockfile and shared runtime boundaries marked
full by the existing map. A narrow file extension is not evidence of narrow
impact. If the consumer set cannot be established safely, use the full gate.
Keep any additional renderer or publication checks selected by those changes.

### Keep the committed classifier distinct

The existing `20w ci plan` accepts full lowercase 40-character commit hashes
through `--base` and `--head`. It compares `base...head` using Git's merge-base
semantics and loads the impact map from the current checkout. It does not
inspect staged, unstaged or untracked changes and selects lanes, not individual
Go packages. No working-tree planner mode is introduced by this decision.

After commit, run the existing classifier against the intended branch base
and head to check the committed lane selection. Resolve both revisions to
exact hashes first; do not substitute symbolic revisions or treat a missing
comparison as evidence for a narrow scope. Pending edits still need the
manual selection above, even when the committed plan is narrow.

### Retain evidence without relabelling it

For each check, retain its command and arguments, result, tested scope,
source and dependency identities, toolchain/runtime identity, relevant output
artifacts and omissions under a declared ignored evidence root. An exit code
without those inputs cannot establish that a later change is covered.

Earlier evidence may cover an unchanged scope across a pure rebase only after
checking the new base, changed files and consumer dependencies. Run fresh
checks for the affected scope. Changed commands, lockfiles, fixtures, shared
configuration, dependency inputs or conflict resolution invalidate the
corresponding evidence; recompute its scope. Source-revision-bound binaries,
manifests and images may need rebuilding or rebinding even when their
algorithm source is unchanged.

Keep the original logs and receipts with their original identity. Report
reused and fresh checks separately, including what remains pending. Never
describe a prior full pass as a full pass of a different exact tree. Reuse
does not replace a complete gate required at the next integration boundary.

### Preserve the complete gates

Run `npm run check` before marking a pull request ready, integrating into
`main`, merging or releasing. The complete Go gate retains
`go test -race ./...` and `go vet ./...` from `tooling/`. These requirements
also apply when the local scope falls back to full. Focused pre-commit checks
are permission to make a validated incremental commit, not to skip those gates.

Hosted CI remains unchanged: impact plans run common checks and the selected
lanes, while full plans run the full composition. A green impact run does not
mean the full aggregate ran. Required CI checks and rulesets are not relaxed;
release checks remain bound to the exact tag and source identity.

Changes to book source bytes or membership still require
`npm run generate:book-pdf` and `npm run validate:book-pdf`. A docs-only change
outside that closure may omit regeneration only after proving the book source
digest unchanged. Renderer proof selection and admitted release inputs retain
their existing rules.

## Verification and limits

For this policy change, run prose, documentation, policy and skill validation;
compare the book source digest before and after. The changed agent and skill
authorities select full integration, so focused checks alone do not complete
its integration gate. No CI workflow, selector, ruleset, test assertion or
publication baseline changes are part of this decision.

Codex drafted this governance change and used a bounded coding-agent review
of the existing classifier and downstream consumers. The maintainer approved
the local-check boundary. This is an engineering policy, not evidence of a
measured speed or energy gain, and it changes no scientific claim or experiment
admission.

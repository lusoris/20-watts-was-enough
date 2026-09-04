# GitHub automation rules

These instructions extend the repository-level [`AGENTS.md`](../AGENTS.md) for
files under `.github/`.

- Pin every external GitHub Action to a full immutable commit SHA and retain a
  human-readable version comment. Floating tags and branches are not accepted.
- Keep workflow-level permissions read-only. Grant write or OIDC permissions
  only to the individual job that requires them.
- Set explicit job timeouts and bounded concurrency. Pull-request validation
  may cancel stale runs; an in-progress Pages deployment must not be cancelled.
- Run every workflow job in this public repository on GitHub-hosted
  `ubuntu-latest`. Do not request a self-hosted label or select a runner through
  a dynamic expression. Local compute requires a separately reviewed,
  infrastructure-enforced trust and isolation boundary under decision 0056.
- Use `actions/checkout` with `persist-credentials: false` unless a reviewed
  step must push to the repository.
- Run JavaScript workflows on the exact Node 26 pin. Install npm 12 only from
  the repository's URL-, size- and SHA-256-bound archive before checking its
  version, then use `npm ci --no-audit` with `package-lock.json` as authority.
  Run one explicit, enforcing lockfile audit in each full CI or release gate;
  matrix and publication jobs must not multiply registry audit traffic. Run Go
  tooling with the exact version declared by `tooling/go.mod`.
- Required CI and security gates fail closed. Do not add `continue-on-error` to
  a required check or weaken an existing validator to make a workflow green.
- Never execute or check out pull-request code from a `pull_request_target`
  workflow. Automation using that event may operate only on trusted metadata
  and tools checked out from `refs/heads/main`.
- Preserve the Pages build/deploy separation: the build job stays read-only;
  only the deploy job receives `pages: write` and `id-token: write`.
- Release workflows validate and package an existing exact tag in a read-only
  job. Only the final publication job receives `contents: write`,
  `id-token: write`, and `attestations: write`; checkout never persists those
  credentials.
- A research release renders its tag-bound book from the exact committed
  source, then publishes that PDF with committed licence material, a locked-
  graph SPDX SBOM, sorted checksums, exact changelog notes, and provenance
  attestations. It never publishes to npm or claims a SLSA level.
- Automatic tag runs never overwrite an existing release. A manual rebuild may
  update only the exact existing tag after repeating all validation gates.
- Treat repository settings as external state. Verify branch rules, Actions
  permissions, environments, and security features before documenting them as
  active.
- `.github/labels.json`, `.github/milestones.json`, and
  `.github/issue-milestones.json` are the canonical operational metadata
  manifests. The trusted main-branch workflow may create or repair their
  marked objects and mapped issue assignments, but it does not delete unmanaged
  labels or milestones. Pull-request metadata may project only from one
  explicit managed issue reference under decision 0057; missing or ambiguous
  references remain unchanged. Milestone progress reflects associated issues
  and pull requests; it never promotes scientific evidence.
- A mapped open issue carries exactly one active managed status. Closing it
  removes `status:needs-triage`, `status:blocked`, `status:in-progress`, and
  `status:waiting-on-author`; an existing `status:wontfix` remains as an
  explicit maintainer decision. Reopening replaces every managed status with
  `status:needs-triage`. Ordinary drift repair also restores
  `status:needs-triage` when an open mapped issue has no active status, and
  removes stale `status:wontfix` while retaining one existing active status.
  Multiple active statuses remain an ambiguity and fail closed. Preserve all
  non-status labels and never infer `status:wontfix` from the close event
  itself.
- Pull-request merge removes every managed status. An unmerged close removes
  active statuses but preserves an existing `status:wontfix`; neither path
  invents it or changes another label or the milestone. Reopen reruns the one
  linked issue's full projection. Closed-event cleanup verifies GitHub's merge
  state directly, skips path labeling and refuses ambiguous issue references or
  unknown and duplicate `status:*` identities.
- Full metadata repair uses separately bounded queries for the five managed
  status labels and for open pull requests. The open scan admits only one
  explicit mapped-issue reference, so it can recover a missed reopen with no
  managed status while reusing the same projection. A closed pull request with
  only an unknown status or an open pull request without one mapped reference
  still needs its trusted event or explicit command.

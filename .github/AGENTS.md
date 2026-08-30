# GitHub automation rules

These instructions extend the repository-level [`AGENTS.md`](../AGENTS.md) for
files under `.github/`.

- Pin every external GitHub Action to a full immutable commit SHA and retain a
  human-readable version comment. Floating tags and branches are not accepted.
- Keep workflow-level permissions read-only. Grant write or OIDC permissions
  only to the individual job that requires them.
- Set explicit job timeouts and bounded concurrency. Pull-request validation
  may cancel stale runs; an in-progress Pages deployment must not be cancelled.
- Use `actions/checkout` with `persist-credentials: false` unless a reviewed
  step must push to the repository.
- Run JavaScript workflows on the exact Node 26 and npm 12 pins, install with
  `npm ci`, and keep `package-lock.json` authoritative. Run Go tooling with the
  exact version declared by `tooling/go.mod`.
- Required CI and security gates fail closed. Do not add `continue-on-error` to
  a required check or weaken an existing validator to make a workflow green.
- Never execute or check out pull-request code from a `pull_request_target`
  workflow. Automation using that event may operate only on trusted metadata.
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
- `.github/labels.json` is the canonical managed-label manifest. The trusted
  main-branch workflow may create or repair those labels, but it does not
  delete labels outside the manifest.

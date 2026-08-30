# 0040 — Bind publications to reproducible and public artifacts

- **Status:** accepted
- **Date:** 2026-08-30

## Context

The release workflow already bound source tags, checksums and OCI digests, but
two distribution boundaries remained open.

First, the full-book generator selected an ambient Chrome-family executable and
host fonts. A repeated render on a changed runner could therefore produce
different bytes from the same tag. The manual release path then used
`gh release upload --clobber`, which could replace those different bytes under
an existing release identity.

Second, GitHub Container Registry creates personal-account packages as private
by default. Repository access inheritance does not itself prove that an
unauthenticated reader can pull an image. Authenticated inspection in the
publishing workflow therefore did not test the access path documented for
external experiment users.

Chrome for Testing exists for version-pinned automation, and the official
Puppeteer image supplies a versioned browser-library and font environment. Their
moving names are still insufficient publication identities; the renderer must
bind exact archive and OCI digests.

## Decision

1. Generate the release PDF only through `20w publication render-pdf`. The Go
   command validates one renderer lock, verifies the exact Buildx client,
   creates an isolated builder from the lock's digest-pinned BuildKit image,
   obtains and verifies the exact Chrome for Testing archive, builds the locked
   Linux `amd64` renderer, reads its immutable image ID and executes that ID
   directly.
2. Keep the existing Node/CDP generator as the sole layout implementation. The
   container fixes its Node runtime, browser binary, browser dependencies and
   fonts; the Go command owns acquisition, validation, containment, timeouts
   and process cleanup. It deterministically generates the closed build
   Dockerfile with literal digest-pinned base images from the validated lock;
   there is no separately maintained Dockerfile or base-image argument. The
   [renderer lock](../tooling/pdf-renderer/lock.json) is the maintained
   container, browser and resource contract. The root `package-lock.json`
   separately binds JavaScript package identities; tagged release CI realizes
   it with the exact locked Node and npm versions.
3. Run the renderer without network access, with a read-only repository mount,
   separately writable generated-output mounts, no added capabilities,
   `no-new-privileges`, finite memory and PID limits, an init process and a
   temporary browser filesystem. Execute two fresh containers with disjoint
   output, work and browser-cache directories. They share the same read-only
   dependency tree produced before rendering. Publish neither pair unless the
   PDF and manifest bytes match exactly; install the verified pair behind one
   exclusive publication lock with rollback on partial replacement.
4. Record the validated renderer identity in schema 3 of the book manifest and
   include the renderer implementation and lock in the book source digest.
   A manifest that omits or changes that identity fails closed.
5. Enable GitHub immutable releases for future publications. Assemble a new
   release as a draft, attach and verify the complete checksum-derived asset
   set, then publish it once. Publication locks its tag and assets at the
   service boundary.
6. Treat a same-tag workflow rerun according to release state. A draft may fill
   a missing expected asset only after every present asset matches the newly
   prepared bytes; it is then verified and published. A published release must
   already be immutable, non-prerelease, complete and byte-identical, and the
   rerun is read-only. Unexpected names or different bytes stop the workflow.
7. Require an unauthenticated pull of each exact final OCI digest before the
   GitHub Release is created or edited. The first publication may stop after
   pushing packages so the maintainer can make the three package identities
   public. The rerun must then pass the same anonymous check.
8. Changing a package from private to public is an explicit, irreversible
   service operation. It is authorised only for the three documented public
   release packages; it does not authorise broader package or repository
   changes.

## Alternatives considered

- **Pin only the browser binary on the hosted runner.** Rejected because host
  libraries and fallback fonts still affect layout and PDF bytes.
- **Commit a generated renderer image tag.** Rejected because a tag is mutable
  and would create a second renderer authority. The workflow builds from the
  reviewed lock and executes the resulting image ID.
- **Bundle PDF bytes in Git and trust them on a rerun.** Rejected because the
  tagged release must independently prove that its source can reproduce its
  publication artifact.
- **Keep private images and document registry login.** Rejected because the
  stated experiment-help path is public and anonymous pull is the actual reader
  boundary.
- **Publish first and repair assets afterwards.** Rejected because immutable
  releases lock assets at publication. Draft assembly gives the workflow a
  recoverable pre-publication state without weakening the released identity.

## Consequences

- PDF generation now needs the exact locked Docker Buildx client plus initial
  downloads of the locked BuildKit image and browser archive. Offline
  validation of the lock and command remains available without Docker or
  network access.
- Renderer reproducibility is claimed only for the locked Linux `amd64`
  boundary and one clean dependency realization, and is tested by two fresh
  containers. The comparison does not independently realize the dependency
  tree twice or claim that every host platform produces the same file.
- Immutable releases apply only to publications created after the setting was
  enabled. The existing `v0.2.0` release remains outside this guarantee.
- A new package's first release run is expected to pause before GitHub Release
  publication until its visibility is changed. This is a fail-closed bootstrap
  state, not a failed scientific experiment.
- Exact source, renderer, PDF, release-asset and OCI identities remain separate;
  none of them promotes a construction or smoke run to scientific evidence.

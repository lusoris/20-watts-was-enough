# CLRS generator image foundation

No generator image is admitted yet. This directory records candidate inputs
and blocked admission rules for a future Linux `amd64` image. Registry absence
has not been checked; the repository state remains `blocked` and `NO_RESULT`.
This is not yet a closed acceptance implementation: the exact dependency
graph, build context and retained receipts still require bounded construction
and review.

The Python image is a narrow exception to the Go-first tooling rule. The pinned
official CLRS-Text generator imports TensorFlow and JAX; rewriting that path
before the controller shakedown would test a different generator. Go remains
the controller, validator and fixture-import boundary.

## What this foundation fixes

- [`upstream.json`](upstream.json) binds the official CLRS commit, tree,
  licence, generator and requirement bytes.
- [`contract.json`](contract.json) fixes the six task families, seeds, sizes,
  output counts and byte limits from [Decision 0055](../../decisions/0055-freeze-clrs-text-as-a-controller-shakedown.md).
- [`lock-input.json`](lock-input.json) binds the checksum-closed source archive,
  CPython 3.13.15 base, uv 0.12.7 and the reviewed Linux `amd64` TensorFlow,
  JAX, JAXlib, NumPy and tqdm wheel candidates. These are resolver inputs, not
  an admitted transitive lock or proof that the pinned source runs with them.
- [`image-contract.json`](image-contract.json) reuses the repository's pinned
  Buildx, BuildKit and timestamp-rewrite authority; fixes resource and runtime
  containment; binds the upstream licence's final image path; caps retained
  SBOM bytes and packages; and records every absent acceptance identity as
  `missing`.

Python 3.13 is the newest candidate interpreter because TensorFlow 2.21.0 has no
CPython 3.14 wheel, while current JAX and JAXlib require Python 3.12 or newer.
The official generator imports `tqdm` directly although the upstream
requirements file does not name it. The lock input therefore makes tqdm an
explicit candidate instead of relying on accidental transitive installation.

## Offline validation

Run the standard-library Go boundary without Python, network access, dependency
resolution or a container runtime:

```bash
go -C tooling test -race ./internal/clrsfixture
go -C tooling vet ./internal/clrsfixture
```

`CheckGeneratorImageFoundation` rejects ambiguous JSON throughout and
non-canonical encoding in `lock-input.json` and `image-contract.json`. It also
rejects symlinked authority files, changed source or generation identities,
drift in the reviewed high-impact wheel candidates, stale shared-builder
metadata and a lock, Dockerfile or wheelhouse manifest that appears while the
contract still says it is missing. The upstream lower bounds and remaining
transitive Python graph are still unresolved candidate inputs.

## Admission sequence

The image stays blocked until one later, bounded change provides all of the
following:

1. an exact uv lock and hash-complete wheelhouse for Linux `amd64`;
2. a checksum-closed Dockerfile and complete build context whose dependency
   install runs without network access;
3. the 11,358-byte Apache-2.0 `LICENSE`, with its pinned source digest, at
   `/usr/share/licenses/clrs/LICENSE`, bound to the final image and receipt;
4. a successful import smoke for the pinned CLRS source;
5. identical manifest, config and layer identities from two isolated,
   no-cache builds;
6. a retained, image-bound SPDX JSON SBOM from the pinned scanner;
7. a non-root, no-network, read-only-root runtime smoke; and
8. two clean generations whose six files and 48 examples compare byte for byte
   and pass the existing Go import contract.

The exact dependency lock and wheelhouse manifest are each capped at 16 MiB;
the graph may contain at most 1,024 packages and 2,048 artifacts. The retained
SBOM is capped at 64 MiB and 10,000 packages, well above the expected inventory
for this one Python image while still making retention finite. Its SPDX JSON
and receipt have fixed `build/evidence/clrs-generator/` paths, and each
licence or SBOM receipt named here is capped at 4 MiB. Exceeding a cap fails
admission; no authority artifact is truncated.

The runtime contract allows one CPU, 4 GiB of memory, 256 processes, 512 MiB of
temporary storage, 24 MiB of fixture output, 1 MiB of captured logs and 300
seconds of wall time. The external runner must stop and remove the complete
container after a five-second grace period. These are construction limits, not
performance results.

There is deliberately no `Dockerfile`, `uv.lock`, wheelhouse, generated fixture,
admitted image digest or publication step in this foundation. [Issue 12](https://github.com/lusoris/20-watts-was-enough/issues/12)
tracks the remaining acceptance work.

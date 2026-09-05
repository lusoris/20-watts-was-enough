# CLRS generator image foundation

No generator image is admitted yet. This directory records the exact Linux
`amd64` dependency graph and the selected 61-file wheelhouse manifest. The
committed foundation contains no wheel payload, Dockerfile, complete build
context or admitted acceptance receipt. Ignored local candidate inputs and
receipts do not change that status. Registry absence has not been checked;
the state remains `blocked` and `NO_RESULT`.

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
  CPython 3.13.15 base, uv 0.12.9, resolution cutoff and reviewed Linux `amd64`
  TensorFlow, JAX, JAXlib, NumPy and tqdm wheel candidates.
- [`pyproject.toml`](pyproject.toml) is derived from those inputs. Its
  [`uv.lock`](uv.lock) resolves 62 packages and records 135 checksum-closed
  artifacts. Two isolated runs of the pinned resolver produced identical lock
  bytes. This closes dependency resolution only; it does not prove that the
  source imports or runs.
- [`wheelhouse.json`](wheelhouse.json) selects one exact Python 3.13 Linux
  `amd64` wheel for each of the 61 runtime packages and binds the pinned
  Bookworm image's glibc 2.36 boundary. Sixty wheels map directly to compatible
  artifacts in `uv.lock`; the Go validator rejects musl, WebAssembly,
  free-threaded CPython, other architectures and glibc versions newer than the
  base. `promise==2.3` has no upstream wheel, so the manifest fixes its
  19,534-byte sdist, the three locked build-tool wheels, candidate step
  arguments and the output identity seen in two local reconnaissance builds.
  The reviewed executable procedure and admitted reproduction receipt remain
  explicitly missing; the candidate command below does not change those
  authority fields. The Promise MIT text is retained at
  [`LICENSES/promise-MIT.txt`](../../LICENSES/promise-MIT.txt); the manifest
  binds its source and built-wheel paths, hash and size. The complete selected
  set is 823,932,066 bytes; those bytes remain ignored build inputs rather than
  Git content.
- [`image-contract.json`](image-contract.json) reuses the repository's pinned
  Buildx, BuildKit and timestamp-rewrite authority; fixes resource and runtime
  containment; binds the upstream licence's final image path; caps retained
  SBOM bytes and packages; binds the exact dependency files and selected
  wheelhouse manifest; and keeps the Dockerfile and every execution-derived
  acceptance identity missing.

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

`CheckGeneratorImageFoundation` rejects ambiguous JSON, non-canonical authority
files, symlinks and unstable reads. It derives the project requirements from
the reviewed inputs, binds the complete lock and wheelhouse-manifest digests,
checks the resolver header and cutoff, and requires exactly one selected wheel
per runtime package. Every downloaded wheel must be an exact, platform-
compatible `uv.lock` artifact. The sole source-built wheel must match its
frozen source, build tools, candidate arguments, environment subset and output
identity. This does not turn those partial fields into a build procedure.
Directory enumeration and expected sizes bound verification before hashing; a
final name-and-file-identity pass rejects files added or replaced during the
read.

Once the ignored wheel bytes have been materialised, verify their exact names,
sizes, hashes and complete set without Python, a resolver or network access:

```bash
go -C tooling run ./cmd/20w experiment verify-clrs-wheelhouse \
  --root .. \
  --wheelhouse /path/to/wheelhouse
```

To reproduce the reviewed manifest into a new file for comparison, use
`experiment render-clrs-wheelhouse-manifest`; it refuses to overwrite an
existing output. Rendering a candidate does not change repository authority.

## Candidate Promise wheel reproduction

The Go command below tests the sole source-built dependency from
[Decision 0071](../../decisions/0071-lock-the-clrs-generator-wheel-selection.md).
It needs a Unix host with the default local Docker socket and the pinned Python
image already present. It never pulls an image or resolves dependencies.
Place the locked sdist in `source-build-inputs/` and the three locked build
wheels in `build-tools/` beneath the supplied input directory. The output
parent must already exist; the command creates a new evidence directory.

```bash
go -C tooling run ./cmd/20w experiment reproduce-clrs-promise-wheel \
  --root .. --inputs /path/to/retained-inputs --output /path/to/new-evidence

go -C tooling run ./cmd/20w experiment reproduce-clrs-promise-wheel \
  --root .. --check --output /path/to/new-evidence
```

Before writing or invoking Docker, Go verifies all four input hashes and
sizes, checks the source MIT text, and prepares a bounded canonical source
archive. Each of two sequential runs gets a fresh container and private
staging directory. Only the three read-only build wheels are host-mounted;
Go streams the source archive to a fixed Python materializer through direct
`docker exec -i`. The materializer checks its exact size and SHA-256 before
extraction into `/work`, then checks the fixed modes, timestamps and ownership.
A fixed Python reader runs inside the same container, inspects at most two
output directory entries, opens only the named regular wheel without following
symlinks, and returns one bounded USTAR member. This accesses the running
container's tmpfs; Docker's archive-copy API uses a
[separate filesystem view](https://github.com/moby/moby/blob/6a43e3d5af/daemon/containerfs_linux.go#L26).
The requested container
configuration fixes UID/GID 65532, no network, a read-only root, one CPU,
1 GiB memory without extra swap, 64 processes, and temporary filesystems of
16 MiB at `/work`, 128 MiB at `/opt/build`, 1 MiB at `/output` and 16 MiB at
`/tmp`. A cleared environment precedes each frozen build step.

One 120-second deadline covers the whole run, not each command. The container
also has a finite 120-second lease. Cleanup gets a separate 30-second
deadline, checks the unique ownership label, forcibly removes the container
and verifies its absence. Host command cancellation kills its process group.
The wheel returns through a tar stream capped at 128 KiB; regular-file and
archive checks reject unexpected names, links, duplicates and extra data.
Each run retains at most 768 KiB of command output plus 64 KiB for cleanup;
the encoded log is capped at 2 MiB. Private staged inputs are removed after
the run. Failure leaves bounded diagnostics and no success receipt.

A schema-1 `NO_RESULT` receipt for procedure version 2 requires two exact wheel
hashes, independent embedded MIT checks and complete cleanup evidence. The
read-only `--check` path verifies both retained wheel files and command logs,
reconstructs the fixed requested arguments, and rejects changed repository
authority or procedure source files. It does not need Docker. The receipt
records the executable hash and build identity separately from workspace
source hashes: those observations alone do not prove that the executable was
compiled from the recorded source. Retain the clean commit and build command
for a reviewed run. Requested flags are not an independent inspection of
Docker's runtime state. No receipt from this command admits the CLRS image or
establishes a scientific result; the existing image blockers remain unchanged.

## Candidate offline build context

`materialize-clrs-context` packages the complete pinned upstream source, all
61 selected wheels, an offline-install Dockerfile and the original Promise
receipt and command logs into one deterministic tar. It derives requirements
and file identities from the existing authority; it does not create another
dependency lock or admit the generated Dockerfile.

```bash
go -C tooling run ./cmd/20w experiment materialize-clrs-context \
  --root .. --wheelhouse /path/to/verified-wheelhouse \
  --source-archive /path/to/pinned-clrs.tar.gz \
  --promise-source-root /path/to/frozen-promise-source \
  --promise-evidence /path/to/two-run-promise-evidence \
  --output /path/to/new-context.tar
```

Repeat the same command with `--check` to verify an existing context without
writes or Docker. The checker needs the same retained inputs: it regenerates
the expected tar stream and compares its exact hash and size with the output.
The Promise source root is the independently retained checkout used for that
execution, not a modified current checkout. The existing Promise verifier
checks its complete procedure-source binding, while the context command also
requires its foundation and wheelhouse identities to match current authority.
The original receipt, including its producer and procedure-source identities,
is retained verbatim and hash-bound in `context-manifest.json`.

The command verifies the upstream archive's pinned compressed hash before
decoding. It accepts one gzip stream, at most 64 MiB of decoded source and
2,048 archive entries, regular files and directories only, and the exact Git
commit comment in the initial global PAX header. Links, alternate extended
headers, duplicate or unsafe paths, unexpected metadata and changed inputs
fail closed. The complete source includes upstream's 50,178,045-byte accuracy
CSV; no data or notebook subtree is silently omitted. Tar member ownership,
modes and timestamps are normalised. Wheels stream through size, hash and
stable-file checks rather than being loaded together into memory.
The generated context uses USTAR headers where possible and deterministic PAX
path records for wheel filenames that exceed USTAR's 100-byte basename limit.

The final context is capped at 2 GiB and 4,096 regular files. Streaming work
uses a five-minute cooperative deadline. A private staging directory holds
partial bytes; publication uses a no-replace hard link only after verification.
An existing output is never overwritten, and cleanup removes only owned
staging entries. A readback checks the published bytes. These local checks do
not authenticate unsigned execution history or prevent later modification by
another process with the same filesystem authority.

The generated Dockerfile uses the pinned Python base and the pinned BuildKit's
bundled frontend. Its dependency install uses `RUN --network=none`, read-only
wheel mounts and pip's `--no-index`, `--no-deps`, `--require-hashes` and
`--only-binary=:all:` restrictions. It declares the existing runtime entrypoint,
environment and non-root identity, and copies the upstream licence to the
contracted path. Context verification does not prove that an image builds,
imports, contains installed licence material or obeys external runtime limits.
Those remain the separate admission gates below.

## Admission sequence

The image stays blocked until one later, bounded change provides all of the
following:

1. materialisation of the 60 locked upstream wheels plus one complete,
   retained container procedure and receipt for two clean, byte-identical
   builds of the locked `promise` wheel;
2. a checksum-closed Dockerfile and complete build context whose dependency
   install runs without network access;
3. the 11,358-byte Apache-2.0 `LICENSE`, with its pinned source digest, at
   `/usr/share/licenses/clrs/LICENSE`, plus verification that Promise's pinned
   1,079-byte MIT text survives installation in its wheel metadata; both must
   be represented in final-image evidence;
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

There is deliberately no `Dockerfile`, committed wheel payload, generated
fixture, admitted image digest or publication step in this foundation.
[Issue 12](https://github.com/lusoris/20-watts-was-enough/issues/12) tracks the
remaining acceptance work.

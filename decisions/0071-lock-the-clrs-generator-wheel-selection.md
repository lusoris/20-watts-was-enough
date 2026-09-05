# 0071 — Lock the CLRS generator wheel selection

- **Status:** accepted
- **Date:** 2026-09-05
- **Extends:** [0055](0055-freeze-clrs-text-as-a-controller-shakedown.md)
- **Related:** [issue #12](https://github.com/lusoris/20-watts-was-enough/issues/12)

## Context

The CLRS generator dependency lock records 62 packages and 135 source or wheel
artifacts across its one Linux `amd64` environment. A reproducible offline
image needs one exact install artifact for each of the 61 runtime packages; the
local project is the remaining lock entry. Selecting files during each image
build would leave platform compatibility and source-versus-wheel choices to a
mutable package index.

Sixty runtime packages have compatible Python 3.13 wheels in the frozen lock.
Compatibility here means CPython 3.13 on Linux `amd64`, against glibc 2.36 in
the pinned Bookworm image. It excludes exact lock entries built for musl,
WebAssembly, free-threaded CPython, another architecture, or a newer glibc.
`promise==2.3` has only a 19,534-byte source distribution. Local reconnaissance
with the pinned Python image, three locked build tools, a fixed epoch and a
fixed environment produced the same 21,582-byte wheel twice. This slice does
not retain a complete executable build procedure or reproduction receipt, so
that identity is only a construction candidate. It is not generator-image
admission or a scientific result.

## Decision

1. Track one canonical manifest selecting exactly 61 Linux `amd64`, Python
   3.13 wheel files against the pinned base image and its glibc 2.36 boundary.
   Each of the 60 downloaded wheels must match one exact URL, hash and size in
   `uv.lock` and carry compatible Python, ABI and platform tags.
2. Bind the sole missing `promise==2.3` wheel candidate to its locked source
   distribution, pinned Python image, three locked build-tool wheels, candidate
   step arguments and locally observed output identity. Record the complete
   procedure and reproduction receipt as missing. Admission still requires two
   clean byte-identical reproductions under one independently executable,
   bounded container contract.
3. Keep the 823,932,066 selected artifact bytes outside Git. A Go command must
   verify the complete materialised directory without Python, a resolver or
   network access. Candidate-manifest generation may only write a new file;
   review and commit remain separate actions.
4. Keep the generator image `blocked` and every construction artifact
   `NO_RESULT` until the Dockerfile, complete offline context, licence, two
   image builds, SBOM, hardened runtime smoke and two fixture generations pass
   their existing gates.

## Consequences

- Package-index choice no longer occurs inside the future image build.
- The exceptional source-build inputs and candidate output are visible instead
  of being hidden inside an installer cache; the complete reproducible build
  procedure remains an admission gate.
- Materialising the wheelhouse still requires network access to fetch the
  locked bytes, but verification and installation do not.
- The manifest does not publish an image, fixture, model output, energy result
  or claim-eligible comparison.

## Supersession

Supersede this record if the pinned dependency graph changes, upstream ships a
reviewed compatible `promise` wheel, the target Python/platform changes, or a
different source-build method is independently locked and reproduced.

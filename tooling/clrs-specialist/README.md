# CLRS shakedown specialist image

This Linux `amd64` image exposes the six frozen exact-program specialists from
issue 12 through one JSON request and one JSON response. It is an unreleased
development runtime. Every response remains `NO_RESULT`.

The process is only the candidate effect seam. It does not prove that a prompt
belongs to the frozen 48-example dataset, record the controller's route
decision, or run the separately held exact verifier. Those checks remain owned
by `clrsfixture.ImportDataset`, each task's `BindDataset`, and
`specialistcontrol.Runner` after the generator image and dataset exist.
The container-only entry point is a narrow exception to the repository's
single-`20w` command preference: it keeps this unprivileged scratch experiment
process, its six solvers, and its CLRS provenance closure out of the general
tooling image. Reusable behaviour remains in one internal Go package.

## Build and smoke

From the repository root, build the checksum-pinned Go 1.27.1 builder and
scratch runtime:

```bash
docker buildx build --load --platform linux/amd64 --network none \
  --file tooling/clrs-specialist/Dockerfile \
  --tag 20w-clrs-shakedown:development \
  --build-arg IMAGE_VERSION=development \
  --build-arg SOURCE_REVISION=unknown \
  --build-arg SOURCE_TIMESTAMP=unknown \
  .
```

`--network none` closes network access for Dockerfile `RUN` instructions.
BuildKit may still need a local cache or registry access to resolve the pinned
builder layers, so this command is not air-gapped or two-build image-identity
evidence. Those remain release-admission work below.

Run one request without a network, writable root, mount, shell, compiler, or
package manager:

```bash
timeout --signal=TERM --kill-after=2s 15s \
  docker run --rm --interactive --pull never \
  --network none \
  --read-only \
  --user 65532:65532 \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  --cpus 1 \
  --memory 64m \
  --memory-swap 64m \
  --pids-limit 32 \
  --stop-timeout 5 \
  20w-clrs-shakedown:development \
  < tooling/clrs-specialist/smoke-request.json
```

The 1 CPU, hard 64 MiB memory ceiling with no swap, 32-PID ceiling, and
five-second stop grace period are containment controls for this development
smoke, not scientific resource or comparison bounds. The 15-second caller
guard bounds the complete container call, including output backpressure. The
request adds a 1–5,000 ms execution timeout, a 1 MiB prompt ceiling, and a
caller-selected result ceiling no larger than 1 MiB. The process
reads one strict JSON value, rejects duplicate, aliased, or unknown fields and
trailing data, and writes one JSON line. Input parsing has a five-second budget;
input plus invocation share an eleven-second context budget; SIGINT or SIGTERM
cancels both. The application takes no request authority or configuration from
environment variables, network services, or mounted host data.

`SOURCE_REVISION=unknown` is deliberate for a potentially dirty local checkout.
CI supplies its exact checked-out commit; any future release must build from an
exact admitted tag rather than relabel a local image.

## Closed routes

| Task | Required specialist identity |
| --- | --- |
| `insertion_sort` | `clrs-exact-insertion-sort-v1` |
| `binary_search` | `clrs-exact-binary-search-v1` |
| `matrix_chain_order` | `clrs-exact-matrix-chain-v1` |
| `bellman_ford` | `clrs-exact-bellman-ford-v1` |
| `kmp_matcher` | `clrs-exact-kmp-matcher-v1` |
| `segments_intersect` | `clrs-exact-segments-intersect-v1` |

The request must carry the frozen source and generation-contract identities.
The controller-created binding is echoed unchanged so the outer policy can
reject substitution and independently verify a completed payload. A typed
specialist refusal is a valid process response; malformed envelopes,
cancellation, timeouts, and internal failures return a non-zero exit status.

Do not promote this request schema or image by only adding it to the release
manifest. Release admission first needs a CLRS experiment identity; an exact
resolved-image-digest request field and refusal when it is absent; a receipt
binding mode, image digest, source revision, runtime, and platform; exact-digest
execution; licence review; an SBOM; source-bound provenance; and the repository's
image-admission checks. Until that separate change revises the fixed release
image manifest, report this local image tag plus its `docker image inspect` ID,
source revision, request, response, engine version, and host platform on
[issue 12](https://github.com/lusoris/20-watts-was-enough/issues/12).

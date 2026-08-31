# 0055 — Freeze CLRS-Text as a controller shakedown

- **Status:** accepted
- **Date:** 2026-08-31
- **Related:** [issue #12](https://github.com/lusoris/20-watts-was-enough/issues/12)
- **Source lock:** [`tooling/clrs-generator/upstream.json`](../tooling/clrs-generator/upstream.json)
- **Generation contract:** [`tooling/clrs-generator/contract.json`](../tooling/clrs-generator/contract.json)

## Context

The typed-specialist controller needs a procedural workload before learned
model comparisons are worth running. CLRS-Text provides textual inputs and
exact references for classical algorithms, but those properties do not make it
evidence that specialists beat a general model. Exact conventional programs
remain the strongest task-specific null.

The official generator and paper use thirty tasks and vary requested input
length. Their published Gemma 2B training grid includes size 10 for each task
selected below. Size 8 lies between published training sizes but is absent from
each selected training list; the first integer above the published maximum is
32 for four tasks and 11 for matrix-chain order. These labels describe the
published grid only. They do not describe the distribution of a future project
model.

Segment intersection is different. The official sampler deletes its `length`
argument and always samples four endpoints; the paper likewise states that its
size parameter does not affect the prompt. Repeating several requested lengths
would create different labels for the same size semantics.

## Decision

1. Use CLRS-Text only as a development shakedown for request typing, routing,
   deadlines, cancellation, arbitration, exact verification, abstention and
   whole-task accounting. Every contract, fixture and smoke output remains
   `NO_RESULT`.
2. Freeze these six task-family bindings and construction cells:

   | Task | Interface family | Requested lengths and limited roles |
   | --- | --- | --- |
   | `insertion_sort` | sequence | 10 published-training, 8 published-interpolation, 32 published-extrapolation |
   | `binary_search` | search | 10 published-training, 8 published-interpolation, 32 published-extrapolation |
   | `matrix_chain_order` | dynamic programming | 10 published-training, 8 published-interpolation, 11 published-extrapolation |
   | `bellman_ford` | graph | 10 published-training, 8 published-interpolation, 32 published-extrapolation |
   | `kmp_matcher` | string | 10 published-training, 8 published-interpolation, 32 published-extrapolation |
   | `segments_intersect` | geometry | one fixed-four-endpoint control requested at length 4; no length-generalisation label |

3. Use the first three official validation seeds, `[3, 14, 35]`, one sample per
   task/length/seed cell, no hints, six-decimal float truncation and the split
   name `shakedown`. The closed plan therefore expects six JSON files and 48
   examples. These choices minimise the controller construction set; they are
   not a sampling or statistical-power claim.
4. Treat [`contract.json`](../tooling/clrs-generator/contract.json) and its
   source-bound Go identity
   `sha256:cc14fce405e8fa7d4719f1fc906e28d5e4b73235085c8f0722795efded2891a8`
   as the fixture-selection authority. The Go validator rejects reordered,
   missing, renamed or expanded tasks, changed size roles, seeds, semantics,
   output counts or byte bounds. Its machine state remains
   `blocked_on_generator_image`.
5. Keep generation separate from the controller. A later decision or bounded
   implementation must pin and exercise a dataset-generator OCI image before
   it may emit fixture bytes. That image may contain the upstream Python
   generator; the controller and released `20w` binary remain Go and consume
   only the neutral, strictly validated JSON boundary. Generation runs without
   network access and within the contract's file, example and byte caps. The
   future image boundary must also enforce cancellation, a wall-clock timeout
   and descendant-process cleanup because the upstream segment sampler uses
   rejection sampling without an internal attempt cap.
6. Do not download or generate the dataset in this foundation change. A
   generator image, generated-byte digests, exact Go programs, learned
   candidates, comparators, run identity, resource receipt, energy boundary
   and confirmation protocol remain absent. The later import bridge must bind
   every file and candidate record to the complete generation-contract identity
   before it may expose fixture bytes.
7. Defer the numerical meaning of *small* until named model candidates,
   hardware opportunity, a quality floor and the whole-task energy boundary
   can be frozen together.

## Source, licence and disclosure

The source lock was rechecked against the official
[`google-deepmind/clrs`](https://github.com/google-deepmind/clrs/tree/d33c3cfc765a18950194205a1ddb92a0981a355e)
commit. It binds the commit, tree, Apache-2.0 `LICENSE`, generator and
requirements bytes by digest. No upstream dataset or source body is copied
into this repository. The task and size rationale was checked against the
official generator and the
[CLRS-Text paper, version 1](https://arxiv.org/abs/2406.04229v1).

OpenAI Codex was materially used on 2026-08-31 for official-source inspection,
drafting, implementation and automated checks under maintainer direction. It
is not an author or accountable approver. No independent scientific, legal or
security review is claimed, and no model or dataset execution occurred.

## Consequences

- The controller policy and fixture-planning package now share one six-task Go
  registry instead of maintaining parallel task lists.
- A contract identity can be reproduced without Python, network access or
  generated fixtures. It establishes construction provenance only.
- Segment intersection can test the fixed geometry route and verifier, but it
  cannot support a length-generalisation statement.
- Any change to task membership or the frozen generation cells requires a
  superseding decision and a new contract identity.

## Supersession

Supersede this record if CLRS-Text is replaced, a selected family changes, the
generation grid or fixed-segment treatment changes, or this development suite
is admitted into a separately frozen claim-eligible protocol.

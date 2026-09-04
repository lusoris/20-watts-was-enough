# 0056 — Keep public workflows off self-hosted runners

- **Status:** accepted
- **Date:** 2026-09-04
- **Related:** [0043](0043-impact-scope-pull-request-ci.md), [0048](0048-gate-ready-pull-requests-with-the-full-ci-matrix.md), [0052](0052-impact-scope-every-pull-request.md)

## Context

This public repository accepts pull requests from forks. A proposed workflow can
request any runner label available to the repository, and contributor-controlled
code can inspect the runner network and any mounted container runtime.

The office ARC scale set exposes a privileged sibling Docker daemon to its job
containers and has no verified network-isolation or trusted-workflow-reference
boundary for this repository. GitHub's
[secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use)
therefore advises against self-hosted runners for public repositories. Requiring
maintainer approval for an external contributor's workflow run reduces accidental
execution, but it does not make an approved workflow or pull-request branch
trusted.

## Decision

1. Every workflow in this public repository runs on GitHub-hosted
   `ubuntu-latest`. Repository workflows do not request the office ARC label,
   a dynamic runner expression or another self-hosted label.
2. External-fork workflows require approval for every outside contributor, not
   only first-time contributors. This setting is defence in depth and does not
   replace runner isolation.
3. Trusted post-merge work may move to private operations automation. Returning
   public-repository work to local compute first requires an infrastructure-side
   workflow-reference restriction plus a dedicated unprivileged, ephemeral and
   egress-isolated runner boundary.
4. Repository validation rejects non-hosted runner declarations. That check is a
   review tripwire; infrastructure access control remains the security boundary
   because a pull request can propose changes to both workflow and validator.

## Consequences

- Fork code cannot execute on the current office runner through a merged
  repository workflow.
- Impact selection still limits hosted compute to the changed authority lanes.
- CI consumes hosted-runner capacity until a separately reviewed isolation
  boundary exists.
- The office scale set must stop registering this public repository before the
  project can describe the boundary as fully retired.

## Supersession

Supersede this record only after a threat-modelled runner design enforces trusted
workflow identity outside this repository and proves runtime, credential and
network isolation.

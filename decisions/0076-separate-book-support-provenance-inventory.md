# 0076 — Separate book support provenance from executable authority

- **Status:** accepted
- **Date:** 2026-09-05
- **Extends:** [0075](0075-isolate-ci-driver-dependency-closures.md), [0054](0054-classify-script-impact-by-executable-consumer.md)
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7)

## Context

Decision 0075 isolated the private CI drivers from experiment packages.
Adding a book-bound experiment source still required editing the executable
`scripts/book-source.mjs`, so the change correctly selected the full gate
and fresh renderer builds even when the new source was only provenance input.

The source list serves two different purposes: it records bytes used by the
research project, and it binds the code that builds and checks the publication.
The first can have a constrained data inventory without relaxing the second.

## Decision

1. Keep selected experiment provenance paths in one
   `scripts/book-support-sources.json`. Admit only production Go files directly
   inside `tooling/internal/clrscontext/`, `tooling/internal/clrsfixture/`
   and `tooling/internal/experimentcli/`. Keep renderer, selector, parser,
   runtime, lock and other existing fixed support paths in
   `scripts/book-source.mjs`. The JSON is not an inventory of all project code.
2. Validate exactly `schema_version` and `paths` under schema 1. Bound the raw
   UTF-8 document to 32 KiB, its sorted unique list to 1–256 paths, each path
   to 512 bytes, JSON depth to 3 and each container to 256 entries. Require
   lowercase ASCII production basenames. Reject unknown or duplicate keys,
   test files, traversal, wildcard syntax, other packages and collisions.
   The existing stable reader owns regular-file, containment and byte checks.
3. Bind the inventory file itself. Capture the bytes that select the paths
   and hash those exact bytes, not a separate mid-loop reread. Before returning
   a digest, re-read the inventory and require equal raw bytes and an unchanged
   complete source list. Preserve the existing source ordering, NUL-delimited
   path/byte framing and public return shapes. This is not an atomic snapshot
   of all files against arbitrary concurrent modification.
4. Preserve every pre-migration source binding and historical required-closure
   assertion. Add the inventory as the only extra source. A future admitted
   source belongs in this inventory once; generic binding and freshness tests
   consume it rather than requiring another growing hand-maintained list.
   An intentional removal from the protected baseline requires explicit review.
5. Map this exact JSON filename to the existing release and site lanes:
   release checks book-PDF freshness, while site runs the inventory regressions.
   Combine these with every other changed path's owners. An owned experiment
   source plus inventory therefore retains container, Go, release and site
   checks. No directory-wide script exemption, new lane or workflow is added.
6. Keep executable source and selector changes protected. The parser stays in
   `scripts/book-source.mjs`; its newly executed
   `scripts/lib/strict-json.mjs` dependency also selects the renderer proof.
   Retain the private-command dependency-closure tests, unknown-path full and
   renderer fallback, invalid-map failure and existing rename, deletion and
   nonregular-mode rules. A missing or malformed inventory fails its consumer;
   it is never an empty source set.
7. A provenance-only change still invalidates the PDF manifest's source digest
   and requires ordinary regeneration, validation and current semantic source
   bindings. The initial parser and ownership change requires the full
   integration gate and existing two-fresh-builder renderer proof. Tagged
   releases retain their unconditional aggregate and renderer gates.

## Verification and limits

Focused tests cover the original source set, byte and path bounds, malformed
or unsafe input, collisions, missing or linked files, new entries, captured
inventory bytes and final byte/path drift. CI tests cover exact ownership,
combined changes, near-name unknown files and the protected strict JSON import.
Integration must also preserve sources added by the prerequisite experiment
work before freezing the final publication snapshot.

This change removes an avoidable executable-authority edit; it does not claim
a measured duration or energy saving. Issue #7's wall-time target remains open
until an applicable live run measures it. Reconsider the narrow owner if these
packages enter the protected execution dependency graph or the inventory begins
controlling code rather than selecting provenance bytes.

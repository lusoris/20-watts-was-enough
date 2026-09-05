# 0073 — Publish each PDF-tools candidate as one atomic bundle

- **Status:** accepted
- **Date:** 2026-09-05
- **Extends:** [0053](0053-lock-the-poppler-pdf-tools-image-foundation.md)
- **Related:** [issue #20](https://github.com/lusoris/20-watts-was-enough/issues/20)

## Context

The PDF-tools reproducer originally prepared three candidate files and then a
separate `NO_RESULT` receipt. Descriptor-pinned `O_TMPFILE` staging removed
pathname-cleanup races, but four independent links could not publish one
coherent set. A writer could change a candidate after its final check and
before the receipt link. The command could then report success even though no
instant contained the named receipt and all three receipt-matching files.

Directory descriptors prevent a replacement symlink from redirecting an open
operation. They cannot prevent another process with the same user identity
from renaming a pinned directory itself. A link through that descriptor can
therefore land in the moved directory before the subsequent named-path check
reports the change.

## Decision

1. Traverse every output-directory component relative to a checked repository
   descriptor. Open components without following symlinks, create a missing
   component with `mkdirat`, and rewalk the public name before accepting the
   pinned parent.
2. Build one deterministic USTAR publication bundle from the three completed
   unnamed candidate streams. It contains the final OCI archive, canonical
   apko SPDX document, checksum-closed corresponding-source archive and the
   canonical `NO_RESULT` receipt. Fixed member names and the receipt bind every
   member's size and SHA-256 digest.
3. Write that bundle twice from the staged descriptors and require matching
   size and SHA-256 identities. Stage the accepted copy in one unnamed
   `O_TMPFILE`, then make the complete publication unit visible with one
   no-replace `linkat`. The three
   separately named files remain non-authoritative convenience copies. A
   successful candidate run does not publish a standalone success receipt.
4. Require consumers to know the bundle SHA-256 from an independent channel.
   The Go verifier checks that outer digest, compares the bounded tar with its
   canonical encoding, and rehashes all three streams against the embedded
   receipt before use.
5. Cleanup closes descriptors only. It never unlinks staging or published
   paths. A failure retains any exact convenience copy or bundle already
   linked for inspection; retained state remains `NO_RESULT`.
6. The producer's concurrency guarantee covers cooperating invocations and
   competition for absent output names. Arbitrary same-UID mutation or rename
   during or after the command is outside its threat boundary. Detected drift
   still fails closed. A rename can retain an exact linked file in the moved
   pinned directory, but a replacement symlink is never followed. Consumers
   must verify the independently hash-bound bundle immediately before use.
7. Candidate publication and standalone `NO_RESULT` receipt output require
   Linux `amd64`, `O_TMPFILE`, `linkat` and `/proc/self/fd`. Other platforms and
   unsupported filesystems refuse this local output route while retaining
   offline authority checks and compile coverage.

## Consequences

- The single bundle name is the only candidate publication and consumer
  authority. No receipt can describe a mixed set of independently mutable
  candidate names.
- Existing candidate-file flags remain available for operator inspection, but
  release or admission tooling must not consume those standalone files.
- The `--receipt` path remains the mismatch-evidence destination. On a
  successful candidate run, the receipt exists only inside the bundle.
- The code uses one small `unsafe` bridge because Go 1.27 exposes the Linux
  `SYS_LINKAT` number but no `linkat` wrapper. Inputs are bounded base names and
  NUL-terminated pointers; descriptors remain live across the call.
- Unprivileged Linux may reject `AT_EMPTY_PATH`; the documented
  `/proc/self/fd` plus `AT_SYMLINK_FOLLOW` form remains the bounded fallback.

## Supersession

Supersede this record if Go exposes an equivalent descriptor-native atomic
publication API, if the candidate platform changes, or if a reviewed
cross-platform primitive can preserve the same no-follow, no-replace,
single-publication-unit contract.

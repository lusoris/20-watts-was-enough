# 0073 — Publish PDF-tools evidence from unnamed pinned files

- **Status:** accepted
- **Date:** 2026-09-05
- **Extends:** [0053](0053-lock-the-poppler-pdf-tools-image-foundation.md)
- **Related:** [issue #20](https://github.com/lusoris/20-watts-was-enough/issues/20)

## Context

The PDF-tools reproducer prepares three candidate files and one `NO_RESULT`
receipt beneath repository-local evidence directories. Its previous hard-link
publication first created a named staging file. Cleanup checked that name's
inode and then removed it in a separate operation. A concurrent writer could
replace the name between those operations, causing cleanup to remove a file the
reproducer did not create. Directory preparation also inspected and created
ancestors by absolute path, so replacing an inspected ancestor with a symlink
could redirect a later creation outside the repository.

Removing every linked output after a later failure created a second problem.
Even with an inode check, rollback needed a pathname deletion and discarded an
exact earlier candidate that could explain the failure. Receipt rollback had
the same failure mode after its final name became visible.

## Decision

1. On Linux `amd64`, traverse every output-directory component relative to a
   checked repository descriptor. Open components with `O_NOFOLLOW`, create a
   missing component with `mkdirat`, and rewalk the named path before accepting
   the pinned parent. A repository-root or ancestor replacement must fail
   without redirecting a write.
2. Stage candidate files and receipts as unnamed `O_TMPFILE` inodes. Publish
   each complete, synced inode once with `linkat` relative to the pinned parent.
   The destination must not exist; publication never replaces a path.
3. Cleanup closes descriptors only. It never checks and then unlinks a staging
   or published pathname. If a later candidate, authority check, receipt check,
   directory sync, or confirmation fails, retain any name already linked and
   return failure. An incomplete candidate set has no receipt.
4. Keep Linux `amd64`, `O_TMPFILE`, `linkat`, and `/proc/self/fd` as explicit
   local-publication prerequisites. Other platforms and filesystems fail closed
   before creating a candidate or receipt name; they may still run the offline
   authority validator.
5. Keep every retained file and receipt at `NO_RESULT`. Descriptor confinement
   and atomic placement are engineering properties, not image admission,
   release publication, PDF conformance, or a scientific result.

## Consequences

- Candidate and receipt staging has no directory entry for another process to
  replace or for cleanup to remove.
- A partial candidate remains available for inspection after a later failure.
  Operators must choose whether to keep or remove it before rerunning because
  the reproducer continues to reject existing destinations.
- The code uses one small `unsafe` bridge because Go 1.27 exposes the Linux
  `SYS_LINKAT` number but no `linkat` wrapper. Inputs are bounded base names and
  NUL-terminated byte pointers; directory and file descriptors remain pinned
  across the call.
- Unprivileged Linux may reject `AT_EMPTY_PATH`; the documented
  `/proc/self/fd` plus `AT_SYMLINK_FOLLOW` form is the bounded fallback.

## Supersession

Supersede this record if Go exposes an equivalent descriptor-native atomic
publication API, if the candidate platform changes, or if a reviewed
cross-platform primitive can preserve the same no-follow, no-replace and
no-path-cleanup contract.

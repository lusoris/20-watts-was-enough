# 0072 — Run browser contracts in isolated processes

- **Status:** accepted
- **Date:** 2026-09-05
- **Related:** [issue #7](https://github.com/lusoris/20-watts-was-enough/issues/7), [serial full-plan run 33950189857](https://github.com/lusoris/20-watts-was-enough/actions/runs/33950189857), [three-worker run 33954330013](https://github.com/lusoris/20-watts-was-enough/actions/runs/33954330013)

## Context

The full-plan run spent 301 seconds running three independent browser test
files serially inside the site gate: approximately 73 seconds for book
fragments, 158 seconds for Mermaid and overflow behaviour, and 69 seconds for
research-object identity. Each file already owns a separate browser process,
debugging port, profile, web server and cleanup boundary. Serialising those
file-level contracts does not add evidence or strengthen an assertion.

Two in-process Vite servers still shared `node_modules/.vite`. Running their
files concurrently without separating that cache would introduce an avoidable
write collision. The third test already gives its Vite subprocess a private
temporary cache; this change brings that server into its isolated test process.

## Decision

1. Run the three exact browser files with Node's process-isolation mode and an
   explicit concurrency ceiling of two. Keep the non-browser site tests in
   their existing no-isolation process. The first live three-worker run
   overloaded the shared runner long enough for the book fragment probe to
   miss its unchanged stability deadline, even though its final snapshot was
   visible. Two workers retain overlap while bounding that contention.
2. Give the book-fragment and Mermaid Vite servers caches beneath their
   already unique temporary browser profiles. Retain the research-object
   test's existing temporary root and cache. Load all three TypeScript configs
   in memory so Vite does not emit shared temporary config modules.
3. Let each Vite server and Chromium choose an ephemeral port while holding
   its listener. Read Chromium's bounded `DevToolsActivePort` file from its
   unique profile instead of closing a reservation before the browser starts.
4. Propagate the test cancellation signal through local HTTP readiness,
   DevTools connection and pending commands. Run cleanup steps in order and
   settle every step even when an earlier stop fails.
5. Keep every assertion, viewport, route, source identity, phase deadline and
   outer deadline unchanged. Retain each file's responsibility for closing its
   browser, server and private profile. Each browser file still runs exactly
   once.
6. Treat local and CI timing as maintenance evidence only. Keep issue 7 open
   until a complete live full gate meets its three-to-five-minute acceptance.

## Consequences

- The browser group can approach the duration of its longest file instead of
  the sum of all three when runner capacity permits.
- Two browser/Vite process trees may contend for runner CPU and memory. Their
  existing deadlines remain fail-closed, so a live run must prove that the
  bounded concurrency is stable enough to retain.
- Chrome-assigned debugging ports remove the close-before-bind race, and a
  timed-out test now interrupts pending readiness and DevTools operations so
  ordered browser, server and profile cleanup can complete.
- Node's existing file-process boundary is the smallest owner of these
  JavaScript browser contracts. Adding a second Go task catalogue here would
  duplicate three fixed paths without changing process isolation or cleanup.
- No scientific or browser-conformance result follows from this scheduling
  change.

## Supersession

Supersede this record if live runs show harmful contention, the files begin to
share mutable state, or a unified repository test scheduler replaces Node's
file-process boundary.

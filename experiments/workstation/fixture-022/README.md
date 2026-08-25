# Fixture 022 development smoke harness

This directory implements a deterministic, development-only slice of
[`DEV-T01`](../../fixtures/022-regenerative-positional-memory.md#dev-t01-hysteretic-positional-memory).
It checks whether the public generator, three declared arm paths, corruption
gates, protected denominators, append-only ledger, and resume path can execute
without silently acquiring scientific authority.

## Implemented slice

Each public seed produces balanced synthetic grid worlds in four families:

1. valid positional memory;
2. independently corrupted positional memory;
3. one connected local corruption patch; and
4. a global common-mode role shift.

All arms receive the same visible graph, wound mask, surviving pre-injury role
outputs, memory labels, caps, and action vocabulary. Hidden target roles are
used only by the evaluator. The development arms are deliberately small:

1. `open-write-majority` is the tempting memory-trusting diagnostic;
2. `robust-propagation-null` is a deterministic anchored label-propagation
   null; and
3. `gated-memory-with-null-fallback` rejects inconsistent memory and charges
   the null path when common-mode corruption is detected.

The common-mode family must exercise abstention and fallback. The valid family
must not trigger a false fallback. Message and memory-write caps are identical
for all arms, every attempted wounded node remains in the denominator, and
actual null fallback work is charged to C.

## Authority boundary

This is **not** the complete F-022 implementation. In particular, it does not
implement the registered Potts/total-variation alpha-expansion null, noisy
four-vector memory, service-demand timeline, private confirmation or transfer
packs, paired bootstrap inference, metered workstation energy, or promotion
evidence. Development uses only the 64 public `DEV-T01` seeds already specified
by F-022; smoke selects the first two without inventing another partition.

Every generated summary therefore says `NO_RESULT`. A diagnostic pass means
only that deterministic development plumbing, gate paths, accounting, schema,
hash chain, and resume behavior worked. It cannot support C-1506, compare
quality or resources, estimate energy, or promote fixture readiness beyond
`smoke-ready`.

Cap exhaustion, solver nonconvergence, non-finite or structurally invalid
output, and thrown policy or evaluator exceptions are retained as causally
typed failure events. They keep
the attempted-world denominator, receive finite charged loss 100, and receive
the maximum registered message, memory-write, memory-read, and solver-round
charges. Complete outcome paths retain an independently derived observed loss;
an exception or invalid evaluator path instead retains a typed null for the
unavailable observation. These punitive records remain authoritative
denominators when a later clean replay does not reproduce a transient fault.
Actual attempted messages, solver rounds, accepted
service, wrong roles, unsafe writes, detection, fallback, rollback, and
resource use remain separate from charged fields, so punitive charge never
overwrites an observation. The event budget is also compared directly with the
frozen run configuration, not merely with the other two arms. Failures are
never converted to safe abstention or silently dropped.

## CLI

From the repository root:

```text
node experiments/workstation/fixture-022/runner.mjs prepare --profile smoke
node experiments/workstation/fixture-022/runner.mjs smoke --profile smoke --output tmp/fixture-022-smoke --resume false
node experiments/workstation/fixture-022/runner.mjs run --profile development --output tmp/fixture-022-development --resume false
node experiments/workstation/fixture-022/runner.mjs analyze --output tmp/fixture-022-smoke
node experiments/workstation/fixture-022/runner.mjs validate --output tmp/fixture-022-smoke
```

`confirmation` and `transfer` are intentionally not CLI actions. Re-running an
existing directory requires `--resume true`; resume reconstructs authority from
the raw append-only hash chain and never trusts a checkpoint over raw events.
Completion is derived from the exact seed/config-generated work-key and world
set rather than counters in `run.json`. Resume and analysis freshly regenerate
every complete scientific payload in canonical order, so a correctly rehashed
record substitution or permutation is rejected. The checkpoint wrapper is
closed and bound to the complete run identity. A missing or stale checkpoint is
reconciled from the raw ledger even when the final raw event was already
durable before interruption. `run.json` is replaced atomically; explicit resume
may rebuild a torn derivable copy, but never overwrites a complete non-identical
document.

Generation is a preflight step: every seed must yield the exact registered
family count, index and family order, grid dimensions, node topology, role
domain, wound closure, and observation digest. A thrown, truncated, or
malformed generator result marks the pack `INVALID` before the output directory
or ledger is created.

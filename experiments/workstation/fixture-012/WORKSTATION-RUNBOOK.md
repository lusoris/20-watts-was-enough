# Fixture 012 workstation-development runbook

This lane records bounded development evidence from freshly rebuilt executable
layouts. It does not reveal confirmation seeds or grant scientific authority.
Every run and record keeps `claim_eligible`, `scientific_result`, and
`energy_claim_eligible` false.

> **Windows boundary:** physical execution on Windows is deliberately disabled.
> Node cannot guarantee kill-and-wait semantics for an arbitrary descendant
> process tree. `prepare` and `acquire` fail with
> `WINDOWS_JOB_OBJECT_REQUIRED` until a reviewed Job Object supervisor is part
> of the adapter. The internal fixture-only bypass is test injection, is not a
> CLI option, and cannot produce claim-eligible output. POSIX uses a detached
> process group, TERM/KILL escalation, and waits for the close event.

## 1. Freeze the campaign inputs

1. Copy `configs/workstation-development.template.json` to
   `configs/workstation-development.local.json`.
2. Copy `configs/process-adapter.template.json` to
   `configs/process-adapter.local.json`.
3. Copy `configs/workload-manifest.template.json` to
   `configs/workload-manifest.local.json`.
4. List the exact workload, input, reference, and every support file used by a
   wrapper. File hashes are SHA-256 over raw bytes. Set
   `trusted_inputs.manifest_sha256` to SHA-256 over the repository's canonical
   JSON representation of the complete manifest.
5. Set `correctness.expected_stdout_sha256` to SHA-256 over the exact expected
   stdout bytes. Both variants must produce those bytes.
6. Keep the visible development schedule seed and assign a unique campaign ID.

Local `*.local.json` files are ignored by Git. The manifest and all paths it
names must remain below the repository, with no symbolic-link, junction, or
reparse-point ancestor.

## 2. Pin commands and environment

The adapter never invokes a shell and never inherits `process.env`. Each
command is an absolute regular-file path with:

- a SHA-256 content identity;
- an argument-array version probe and exact stdout digest;
- a bounded runtime and output size; and
- an explicit allowlisted environment with frozen values.

Preload and runtime-injection variables such as `NODE_OPTIONS`, `NODE_PATH`,
`LD_PRELOAD`, and `DYLD_*` are rejected. On Windows, explicitly supply the
required `SYSTEMROOT`, `TEMP`, and `TMP` values. If a tool needs another
variable, add its exact value to both `allowlist` and `values`; do not rely on
ambient state.

The working directory must be a real repository directory. Campaign output,
build work, artifacts, and layout manifests must remain below
`experiments/workstation/runs/<campaign>/` without redirected ancestors.

## 3. Produce structural layout evidence

The build command must consume `{variant}`, `{layout_seed}`,
`{executable_path}`, and `{layout_manifest_path}`. It must perform a fresh
rebuild and write both the executable and a normalized JSON layout manifest:

```json
{
  "schema": 1,
  "contract_version": "fixture-012.normalized-layout-manifest.v1",
  "artifact": "fixture-012",
  "variant": "baseline",
  "layout_seed": 123,
  "sections": [
    { "name": ".text", "ordinal": 0, "size_bytes": 4096, "content_sha256": "<64 hex>" }
  ],
  "symbols": [
    { "name_sha256": "<64 hex>", "section": ".text", "ordinal": 0, "size_bytes": 48 }
  ]
}
```

Section and symbol ordinals are contiguous from zero, names/identities are
unique, and symbols name existing sections. Structural randomization is proven
from ordered section names/sizes and symbol placement—not merely from changed
section bytes. The raw manifest and executable are retained and rehashed by
validation. Repeating a structural proof for the same variant rejects the
campaign.

The built artifact is launched directly. Its content and version identities
are checked before every launch. Run arguments can use only declared tokens;
exit status must be zero and stdout must match the frozen correctness digest.

## 4. Supply thermal and frequency telemetry

The telemetry command emits exactly one closed-schema JSON object:

```json
{
  "thermal_c": { "cpu-package": 52.4 },
  "frequency_hz": { "cpu-effective": 4380000000 }
}
```

Keys must exactly match the adapter configuration. A sample is taken before
and after every warmup and measured invocation. Missing sensors,
out-of-bound temperature or frequency, or excessive pair drift creates a
retained `rejected` record and stops the campaign. The rejected record includes
the closed-schema process attempt whenever a process was launched.

## 5. Keep energy fail-closed

The default is `latency-only`: no joules are stored and an energy reader is
refused. To record development energy, the experiment selects
`external-calibrated-cumulative-joules` with a positive absolute interval
uncertainty floor, and the adapter replaces `energy: null` with a fully pinned
command:

```json
{
  "mode": "external-calibrated-cumulative-joules",
  "provider_id": "meter-model-and-channel",
  "provider_serial": "device-serial",
  "calibration_certificate_path": "C:/absolute/calibration-certificate.pdf",
  "calibration_certificate_sha256": "<64 hex>",
  "calibration_valid_until": "2027-08-24T00:00:00.000Z",
  "uncertainty_fraction": 0.02,
  "executable": "C:/absolute/meter-reader.exe",
  "executable_sha256": "<64 hex>",
  "version_args": ["--version"],
  "version_stdout_sha256": "<64 hex>",
  "args": [],
  "timeout_ms": 5000,
  "max_output_bytes": 65536
}
```

The provider emits exactly
`{"cumulative_j":123.456,"raw_uncertainty_j":0.01}`. Samples must enclose
the measured process interval. Stored uncertainty is recomputed as the maximum
of raw endpoint uncertainty, the configured positive absolute floor, and the
certificate-relative floor. The certificate path, bytes, serial, validity,
and uncertainty identity are revalidated. Development energy remains
non-claim-eligible.

## 6. Prepare, acquire, and validate

Run from the repository root (on a supported POSIX workstation; Windows fails
closed as described above):

```powershell
npm run workstation:fixture-012:physical -- prepare --config experiments/workstation/fixture-012/configs/workstation-development.local.json --adapter-config experiments/workstation/fixture-012/configs/process-adapter.local.json
npm run workstation:fixture-012:physical -- acquire --config experiments/workstation/fixture-012/configs/workstation-development.local.json --adapter-config experiments/workstation/fixture-012/configs/process-adapter.local.json --output experiments/workstation/runs/fixture-012-physical-development
npm run workstation:fixture-012:physical -- validate --config experiments/workstation/fixture-012/configs/workstation-development.local.json --output experiments/workstation/runs/fixture-012-physical-development
```

The timer starts immediately before process launch and ends as the first action
in the launcher's exit callback. The launcher still waits for the close event
before returning. File hashing, output parsing, correctness
checking, and telemetry are outside `latency_ns`. This is launch-to-exit
latency, including process startup, not an in-process kernel timer.

The exact seeded sequence fixes layout order, rebuild order, warmups, measured
pairs, and variant order. Warmups are retained but excluded from analysis.
Validation reconstructs this sequence and rejects reordered, duplicated, or
extra observations.

## 7. Resume and preserve evidence

`raw-layouts.jsonl` is the authoritative, durably appended SHA-256 chain. The
checkpoint is only a cache: a valid stale ledger-prefix checkpoint is repaired
from the ledger without replaying completed layouts. A rejected record,
corrupt/torn ledger, checkpoint ahead of the ledger, or identity mismatch is
terminal.

Each campaign has an exclusive `campaign.lock.json`. Locks are never broken
automatically. After a process crash, preserve the directory and start a new
campaign output rather than deleting the lock or partial artifacts. An
interruption inside a layout never turns partial work into a complete record.

## Remaining promotion gates

The manifest remains `smoke-ready`; this lane remains development-only. At a
minimum, promotion still requires a reviewed Windows Job Object supervisor for
Windows acquisition, a frozen compiler/linker/workload release, committed
disjoint confirmation and held-out seed reveals, a frozen physical analysis
and rejection contract, calibrated interval-owned energy evidence wherever
joules are claimed, independent replication, a complete promotion bundle, and
a successful promotion-validator receipt.

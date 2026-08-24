# Fixture 012 workstation-development runbook

This lane records bounded development evidence from freshly rebuilt executable
layouts. It does not reveal confirmation seeds or grant scientific authority.
Every run and record keeps `claim_eligible`, `scientific_result`, and
`energy_claim_eligible` false.

> **Windows boundary:** physical execution uses the checked-in C# Job Object
> supervisor. A target is created suspended, assigned to a Job Object with
> `KILL_ON_JOB_CLOSE`, and only then resumed. On every handled timeout,
> output-limit, exceptional exit, or normal leader exit, the supervisor
> terminates the job and waits until its active-process count reaches zero. If
> the supervisor host itself crashes, Windows closes its last Job handle and
> `KILL_ON_JOB_CLOSE` provides eventual containment; a crashed process cannot
> perform the wait itself. The exact C# source, PowerShell harness snapshot,
> compiled assembly bytes, and PowerShell host binary are frozen in the
> adapter binding. A missing or changed component fails closed. The internal
> fixture-only direct-child path is test injection, is not a CLI option, and
> cannot produce claim-eligible output. POSIX uses a detached process group,
> TERM/KILL escalation, and waits for the close event.

A leader that exits while another process remains active in its job is rejected
as `PROCESS_TREE_LEAK` after the remaining tree is terminated. This prevents a
wrapper from moving measured work beyond the recorded leader interval.

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
`LD_PRELOAD`, `DYLD_*`, `.NET` startup/profiler variables, `PSModulePath`, and
language startup hooks are rejected at both adapter and supervisor protocol
boundaries. On Windows, explicitly supply the
required `SYSTEMROOT`, `TEMP`, and `TMP` values. If a tool needs another
variable, add its exact value to both `allowlist` and `values`; do not rely on
ambient state. The PowerShell supervisor starts with a separate environment
containing only those three bootstrap values and its internal assembly
identity fields; target-only values never reach the host.

On Windows, compile the supervisor once into an ignored local location and
copy the emitted identities into `windows_job_supervisor` in the local adapter
configuration:

```powershell
pwsh -NoProfile -File experiments/workstation/fixture-012/build-windows-job-supervisor.ps1 -OutputAssembly tmp/fixture-012-supervisor/windows-job-supervisor.dll
```

The build command refuses to overwrite an assembly. It reads the C# source
once, hashes that byte snapshot, and compiles the same in-memory text rather
than reopening its pathname. The JSON receipt contains the source, harness,
host, assembly, and exact protocol-output hashes. The
two receipt source paths are absolute for operator inspection; store
`source_path` and `harness_path` as repository-relative paths in the adapter
configuration, as shown by the template. The
adapter verifies all four files before preflight and again before every target
launch. It hashes the harness bytes and supplies that exact snapshot through
PowerShell's encoded-command channel, so PowerShell never parses a mutable
harness pathname. The operating-system-installed PowerShell installation and
its .NET runtime are an operator-qualified bootstrap trust root: the operator
must verify that their paths are ACL-protected from the campaign user. The
adapter records hashes but does not prove that ACL prerequisite;
local-administrator or kernel compromise is outside this lane's threat model.
This supervisor is an evidence-integrity and process-containment mechanism,
not a security sandbox or a security guarantee. “Fail closed” means that the
listed, handled contract violations produce refusal or a retained failed
attempt; it does not establish security against a compromised trust root or an
actor outside the stated threat model.
The adapter transports target arguments as a NUL-free JSON string array, and no
shell parses or interpolates them. Because Win32 `CreateProcessW` nevertheless
accepts one command-line string rather than an operating-system `argv` array,
the supervisor applies the standard Microsoft C-runtime/`CommandLineToArgvW`
quoting convention. A configured target must use compatible Windows argument
parsing; an incompatible parser is outside this adapter contract.

The working directory must be a real repository directory. Campaign output,
build work, artifacts, and layout manifests must remain below
`experiments/workstation/runs/<campaign>/` without redirected ancestors.
This first physical lane is deliberately restricted to the protected Windows
system-volume drive. Other fixed volumes, `SUBST` roots, mapped drives, UNC
paths, and alternate data streams are rejected inside the helper; this avoids
mutable per-user DOS-device aliases. Every directory component (including the
working directory) is opened parent-before-child, rejected if it is a reparse
point, and protected by a pending directory R oplock. All earlier guards are
rechecked after each component is acquired, immediately before target creation,
and again while the atomically assigned target is still suspended. The helper
polls oplock-break events throughout execution and rechecks them after the job
becomes empty and after final output drain. Any directory namespace or metadata
mutation that breaks a guard terminates the complete Job Object and is retained
as `PATH_IDENTITY_BREAK`; no break acknowledgement can stall the mutating
process because the helper requests R, not RH, oplocks. Each identified file
must have exactly one hard-link name and expose a readable NTFS per-file USN.
The helper retains its file ID, attributes, reparse tag, link count, and USN,
then rechecks them on every 10-ms supervisory wait iteration and at every
pre-create, suspended, post-job, and post-drain gate. The USN is a persistent
change sequence: a metadata change that is restored before the next poll still
invalidates the attempt. Identified files are also opened with only read sharing
for the full target interval. Under the Windows
[CreateFile sharing contract](https://learn.microsoft.com/windows/win32/api/fileapi/nf-fileapi-createfilew),
that open fails if a writable file mapping already exists and blocks later
write mappings as well as ordinary writes. The share mode is not treated as a
metadata lock; leaf metadata integrity comes from the retained identity and USN
checks. The image path of the atomically assigned suspended process is checked
against the guarded executable before its first instruction is resumed.
Mid-launch junction, symlink, DOS-device, directory-metadata, leaf-metadata,
hard-link, rename, content-write, writable-mapping, and image swaps therefore
fail closed instead of relying only on the post-run validator. A volume that
cannot supply the per-file USN fails preflight; this lane has no
reduced-integrity fallback.

### Canonical Windows behavior inventory

The 21 rows below are scoped behaviors, **not 21 separate Windows-gated
`test()` blocks**. Several rows are assertions or subcases in one combined
test. “Direct” means the named behavior is exercised by a scoped test on
Windows; “fixture-direct” means the adapter/CLI behavior is exercised through
the internal fixture injection rather than the production supervisor; and
“shared invariant” means the implementation checks the same guard but no
dedicated dynamic test injects that exact mutation class. A direct test or a
shared invariant is evidence about this harness only, not a security guarantee
or an empirical performance result.

| # | Scoped behavior | Evidence class | Test or implementation invariant |
|---:|---|---|---|
| 1 | Real Windows `prepare` refuses execution without the configured Job Object supervisor. | Direct | `real Windows CLI remains fail-closed without a Job Object supervisor`; adapter error `WINDOWS_JOB_OBJECT_REQUIRED`. |
| 2 | The PowerShell host, encoded harness snapshot, C# source, compiled assembly, protocol output, and binding identity are content-checked before use. | Direct + shared invariant | `Windows Job Object supervisor runs the physical adapter with bound QPC timing`; `verifyWindowsSupervisorFiles` applies the four file identities before each host invocation. |
| 3 | Windows records use a QueryPerformanceCounter launch-to-leader-exit interval, and stored `latency_ns` equals the two bound timestamps. | Direct | `Windows Job Object supervisor runs the physical adapter with bound QPC timing`. |
| 4 | The target is created suspended and assigned to the Job Object through `PROC_THREAD_ATTRIBUTE_JOB_LIST` before resume. | Direct | `Windows supervisor assignment-before-resume contains immediate descendants`, repeated over eight launches. |
| 5 | A zero-exit leader with a still-active descendant becomes `PROCESS_TREE_LEAK`, not a natural successful attempt. | Direct | `Windows supervisor assignment-before-resume contains immediate descendants`; supervisor status `descendant-survived`. |
| 6 | Remaining job descendants are terminated and the active-process count is waited to zero after a handled leader exit. | Direct | The assignment-before-resume test verifies that none of its descendant markers is later written; `WaitForEmptyJob` is the shared cleanup path. |
| 7 | Timeout terminates the complete Job Object rather than only the leader. | Direct | Timeout subcase of `Windows supervisor timeout and output cap terminate the whole Job Object`. |
| 8 | Crossing the combined output cap terminates the Job Object and retained output stays within the configured bound. | Direct | Output-limit subcase of the same combined timeout/output-cap test. |
| 9 | The supervisor request rejects undeclared protocol fields. | Direct | Exact-field-set subcase of the combined timeout/output-cap test; `ValidateRequestShape` is the parser invariant. |
| 10 | Target arguments must be NUL-free and are transported as a JSON string array. | Direct | NUL-argument subcase of the combined timeout/output-cap test; the adapter configuration validator also rejects NUL arguments. |
| 11 | Runtime-injection environment variables, including `.NET` startup hooks, are rejected at both adapter and supervisor boundaries. | Direct | `DOTNET_STARTUP_HOOKS` subcase of the combined timeout/output-cap test plus the shared forbidden-environment expression. |
| 12 | Repository/config paths containing spaces and adapter/ledger command bindings are handled and revalidated. | Fixture-direct | `real process-adapter and CLI fixture integration supports spaces and revalidates bindings`; this is not a production-supervisor quoting test, so compatible target argument parsing remains an operator prerequisite. |
| 13 | A guarded directory namespace mutation breaks its R oplock, terminates the Job Object, and yields `PATH_IDENTITY_BREAK`. | Direct dynamic mutation | `Windows supervisor terminates the Job Object when a guarded directory identity changes`. |
| 14 | A guarded leaf metadata change that is restored is still detected through its changed per-file USN and terminates the Job Object. | Direct dynamic mutation | `Windows supervisor terminates the Job Object when guarded leaf metadata changes and is restored`. |
| 15 | An identified file with more than one hard-link name is rejected before launch. | Direct preflight | `Windows supervisor rejects an identified file with another hard-link name`; `NumberOfLinks == 1` is rechecked during execution. |
| 16 | Reparse-point input traversal is rejected inside the helper; redirected output ancestors are rejected by the CLI boundary. | Direct preflight | `Windows supervisor rejects reparse-point input paths inside the helper` and `CLI refuses outputs outside runs and link or junction ancestors`. |
| 17 | A `SUBST` root is rejected directly; mapped, UNC, alternate-stream, non-fixed, and non-system-volume roots use the same `LocalPath`/`RequireDirectFixedVolume` refusal path. | Direct preflight + shared invariant | `Windows supervisor rejects mutable SUBST drive roots inside the helper`; the other root classes are implementation checks, not one dynamic test each. |
| 18 | A changed compiled supervisor assembly is refused before physical acquisition. | Direct preflight | `Windows physical adapter refuses a changed supervisor assembly`. |
| 19 | While the supervisor is alive, the retained `FILE_SHARE_READ` input handle blocks an ordinary content write. | Direct dynamic write | Write-refusal assertion inside `KILL_ON_JOB_CLOSE contains descendants when the supervisor host crashes`. |
| 20 | If the PowerShell supervisor host is killed, closing the final Job handle invokes `KILL_ON_JOB_CLOSE` and prevents the descendant from escaping. | Direct host-crash injection | `KILL_ON_JOB_CLOSE contains descendants when the supervisor host crashes`; this proves eventual containment, not a host-side wait after the crash. |
| 21 | Other mid-launch or in-flight junction, symlink, DOS-device-alias, rename, hard-link, writable-mapping, and executable-image substitutions map to the shared directory R-oplock, retained-file-handle, link-count/USN, or suspended-image checks. | Shared invariant only | `GuardDirectoryComponents`, `OpenPathOplockGuard`, `OpenGuardedFile`, `ValidatePathGuards`, and `VerifySuspendedProcessImage`; there is no dedicated dynamic injection test for every mutation class in this row, so the inventory does not claim separate direct evidence for each one. |

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

Run from the repository root after completing the platform boundary described
above:

```powershell
npm run workstation:fixture-012:physical -- prepare --config experiments/workstation/fixture-012/configs/workstation-development.local.json --adapter-config experiments/workstation/fixture-012/configs/process-adapter.local.json
npm run workstation:fixture-012:physical -- acquire --config experiments/workstation/fixture-012/configs/workstation-development.local.json --adapter-config experiments/workstation/fixture-012/configs/process-adapter.local.json --output experiments/workstation/runs/fixture-012-physical-development
npm run workstation:fixture-012:physical -- validate --config experiments/workstation/fixture-012/configs/workstation-development.local.json --output experiments/workstation/runs/fixture-012-physical-development
```

On Windows, the timer uses QueryPerformanceCounter immediately before
`CreateProcessW` and immediately after the measured leader becomes signalled;
suspended creation, Job Object assignment, and resume are inside the interval.
The supervisor subsequently kills and waits for any descendants before
returning. POSIX starts immediately before process launch and ends as the first
action in the launcher's exit callback. File hashing, output parsing, correctness
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
minimum, promotion still requires independent review of the checked-in Windows
supervisor and characterization of its PowerShell-host plus 10-ms identity/USN
polling overhead for both timing and energy, a
frozen compiler/linker/workload release, committed
disjoint confirmation and held-out seed reveals, a frozen physical analysis
and rejection contract, calibrated interval-owned energy evidence wherever
joules are claimed, independent replication, a complete promotion bundle, and
a successful promotion-validator receipt.

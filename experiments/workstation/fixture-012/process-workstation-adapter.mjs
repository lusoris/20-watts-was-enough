import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import {
  mkdir,
  readFile,
  realpath,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { canonical, sha256 } from "./contract.mjs";
import {
  FIXTURE_012_PROCESS_ATTEMPT_VERSION,
  fixture012LayoutStructureSha256,
  validateNormalizedLayoutManifest,
  validateTrustedInputManifest,
} from "./workstation-acquisition.mjs";
import {
  assertAbsoluteRegularFile,
  assertSafePathBelow,
  isPathInside,
} from "./workstation-path-safety.mjs";

export const FIXTURE_012_PROCESS_ADAPTER_CONFIG_VERSION = "fixture-012.process-adapter-config.v3";
export const FIXTURE_012_PROCESS_ADAPTER_VERSION = "fixture-012.process-workstation-adapter.v3";
export const FIXTURE_012_WINDOWS_JOB_SUPERVISOR_VERSION = "fixture-012.windows-job-supervisor.v1";

const tokenPattern = /\{([a-z_]+)\}/gu;
const allowedTokens = new Set([
  "variant", "layout_seed", "layout_id", "layout_slot", "study",
  "artifact_dir", "executable_path", "layout_manifest_path", "phase",
  "pair", "order_position",
]);
const forbiddenEnvironment = /^(NODE_OPTIONS|NODE_PATH|LD_PRELOAD|LD_LIBRARY_PATH|DYLD_.+|BASH_ENV|ENV|PROMPT_COMMAND|DOTNET_.+|CORECLR_.+|COMPLUS_.+|COR_.+|PSMODULEPATH|POWERSHELL_.+|PYTHONPATH|PYTHONSTARTUP|RUBYOPT|PERL5OPT|JAVA_TOOL_OPTIONS|_JAVA_OPTIONS|JDK_JAVA_OPTIONS|GCONV_PATH)$/i;

export class Fixture012ProcessAttemptError extends Error {
  constructor(code, message, attempt = null, cause = undefined) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "Fixture012ProcessAttemptError";
    this.code = code;
    this.attempt = attempt;
  }
}

function exactObject(value, keys, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  if (canonical(Object.keys(value).sort()) !== canonical([...keys].sort())) throw new Error(`${label} has an inexact field set.`);
  return value;
}

function nonEmpty(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be non-empty.`);
  return value;
}

function digest(value, label) {
  if (typeof value !== "string" || !/^[0-9a-f]{64}$/.test(value)) throw new Error(`${label} must be a lowercase SHA-256 digest.`);
  return value;
}

function boundedSupervisorDiagnostic(bytes) {
  const limit = 4_096;
  const retained = bytes.subarray(0, limit);
  const suffix = bytes.length > retained.length ? ` (truncated from ${bytes.length} bytes)` : "";
  return `${JSON.stringify(retained.toString("utf8"))}${suffix}`;
}

function positive(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`${label} must be a positive integer.`);
  return value;
}

function args(value, label) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.includes("\0"))) throw new Error(`${label} must be a NUL-free string array.`);
  return value;
}

function command(value, label, extras = []) {
  exactObject(value, [
    "executable", "executable_sha256", "version_args", "version_stdout_sha256",
    "args", "timeout_ms", "max_output_bytes", ...extras,
  ], label);
  if (!path.isAbsolute(value.executable)) throw new Error(`${label}.executable must be absolute.`);
  digest(value.executable_sha256, `${label}.executable_sha256`);
  args(value.version_args, `${label}.version_args`);
  digest(value.version_stdout_sha256, `${label}.version_stdout_sha256`);
  args(value.args, `${label}.args`);
  positive(value.timeout_ms, `${label}.timeout_ms`);
  if (value.timeout_ms > 86_400_000) throw new Error(`${label} timeout exceeds 24 hours.`);
  positive(value.max_output_bytes, `${label}.max_output_bytes`);
  if (value.max_output_bytes > 16 * 1024 * 1024) throw new Error(`${label} output cap exceeds 16 MiB.`);
  for (const [index, argument] of value.args.entries()) {
    for (const match of argument.matchAll(tokenPattern)) if (!allowedTokens.has(match[1])) throw new Error(`${label}.args[${index}] uses an unknown token.`);
    if (argument.replace(tokenPattern, "").includes("{") || argument.replace(tokenPattern, "").includes("}")) throw new Error(`${label}.args[${index}] has malformed token syntax.`);
  }
  return value;
}

export function validateFixture012ProcessAdapterConfig(config) {
  exactObject(config, [
    "schema", "artifact", "contract_version", "adapter_id", "adapter_version",
    "working_directory", "effective_environment", "thermal_sensor_ids",
    "frequency_sensor_ids", "windows_job_supervisor", "build", "run", "telemetry", "energy",
  ], "process adapter config");
  if (config.schema !== 1 || config.artifact !== "fixture-012" || config.contract_version !== FIXTURE_012_PROCESS_ADAPTER_CONFIG_VERSION) throw new Error("Process adapter config identity is invalid.");
  for (const key of ["adapter_id", "adapter_version", "working_directory"]) {
    nonEmpty(config[key], key);
    if (/replace|placeholder|todo|tbd/i.test(config[key])) throw new Error(`${key} contains a template marker.`);
  }
  exactObject(config.effective_environment, ["allowlist", "values"], "effective_environment");
  if (!Array.isArray(config.effective_environment.allowlist) || new Set(config.effective_environment.allowlist).size !== config.effective_environment.allowlist.length) throw new Error("Environment allowlist is invalid.");
  exactObject(config.effective_environment.values, config.effective_environment.allowlist, "effective environment values");
  for (const [key, value] of Object.entries(config.effective_environment.values)) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || forbiddenEnvironment.test(key) || typeof value !== "string" || value.includes("\0")) throw new Error(`Effective environment entry is unsafe: ${key}.`);
  }
  for (const [label, values] of [["thermal_sensor_ids", config.thermal_sensor_ids], ["frequency_sensor_ids", config.frequency_sensor_ids]]) {
    if (!Array.isArray(values) || values.length === 0 || new Set(values).size !== values.length || values.some((value) => !/^[a-z0-9][a-z0-9._-]+$/i.test(value))) throw new Error(`${label} is invalid.`);
  }
  if (config.windows_job_supervisor !== null) {
    exactObject(config.windows_job_supervisor, [
      "protocol_version", "host_executable", "host_executable_sha256",
      "version_stdout_sha256", "harness_path",
      "harness_sha256", "source_path", "source_sha256", "assembly_path",
      "assembly_sha256", "outer_timeout_margin_ms",
    ], "windows_job_supervisor");
    if (config.windows_job_supervisor.protocol_version !== FIXTURE_012_WINDOWS_JOB_SUPERVISOR_VERSION) throw new Error("Windows supervisor protocol identity is invalid.");
    for (const field of ["host_executable", "assembly_path"]) {
      if (!path.isAbsolute(config.windows_job_supervisor[field])) throw new Error(`windows_job_supervisor.${field} must be absolute.`);
    }
    for (const field of ["harness_path", "source_path"]) {
      nonEmpty(config.windows_job_supervisor[field], `windows_job_supervisor.${field}`);
      if (path.isAbsolute(config.windows_job_supervisor[field])) throw new Error(`windows_job_supervisor.${field} must be repository-relative.`);
    }
    for (const field of [
      "host_executable_sha256", "version_stdout_sha256", "harness_sha256",
      "source_sha256", "assembly_sha256",
    ]) digest(config.windows_job_supervisor[field], `windows_job_supervisor.${field}`);
    positive(config.windows_job_supervisor.outer_timeout_margin_ms, "windows_job_supervisor.outer_timeout_margin_ms");
    if (config.windows_job_supervisor.outer_timeout_margin_ms < 15_000 || config.windows_job_supervisor.outer_timeout_margin_ms > 60_000) throw new Error("Windows supervisor outer timeout margin must be 15--60 seconds so exceptional Job cleanup can finish.");
    const environmentKeys = config.effective_environment.allowlist.map((key) => key.toUpperCase());
    if (new Set(environmentKeys).size !== environmentKeys.length) throw new Error("Windows supervisor environment names must be case-insensitively unique.");
    for (const required of ["SYSTEMROOT", "TEMP", "TMP"]) {
      const actual = Object.keys(config.effective_environment.values).find((key) => key.toUpperCase() === required);
      if (actual === undefined || !path.isAbsolute(config.effective_environment.values[actual])) throw new Error(`Windows supervisor requires an absolute ${required} environment value.`);
    }
  }
  command(config.build, "build", ["output_executable", "output_layout_manifest"]);
  for (const field of ["output_executable", "output_layout_manifest"]) {
    nonEmpty(config.build[field], `build.${field}`);
    if (path.basename(config.build[field]) !== config.build[field] || config.build[field].includes("..")) throw new Error(`build.${field} must be one filename.`);
  }
  const buildArgs = config.build.args.join("\0");
  for (const required of ["{variant}", "{layout_seed}", "{executable_path}", "{layout_manifest_path}"]) if (!buildArgs.includes(required)) throw new Error(`build.args must include ${required}.`);
  exactObject(config.run, ["version_args", "version_stdout_sha256", "args", "timeout_ms", "max_output_bytes"] , "run");
  args(config.run.version_args, "run.version_args");
  digest(config.run.version_stdout_sha256, "run.version_stdout_sha256");
  args(config.run.args, "run.args");
  positive(config.run.timeout_ms, "run.timeout_ms");
  if (config.run.timeout_ms > 86_400_000) throw new Error("run timeout exceeds 24 hours.");
  positive(config.run.max_output_bytes, "run.max_output_bytes");
  if (config.run.max_output_bytes > 16 * 1024 * 1024) throw new Error("run output cap exceeds 16 MiB.");
  command(config.telemetry, "telemetry");
  if (config.energy !== null) {
    command(config.energy, "energy", [
      "mode", "provider_id", "provider_serial", "calibration_certificate_path",
      "calibration_certificate_sha256", "calibration_valid_until", "uncertainty_fraction",
    ]);
    if (config.energy.mode !== "external-calibrated-cumulative-joules") throw new Error("Energy mode is invalid.");
    nonEmpty(config.energy.provider_id, "energy.provider_id");
    nonEmpty(config.energy.provider_serial, "energy.provider_serial");
    if (!path.isAbsolute(config.energy.calibration_certificate_path)) throw new Error("Calibration certificate path must be absolute.");
    digest(config.energy.calibration_certificate_sha256, "energy.calibration_certificate_sha256");
    const expiry = Date.parse(config.energy.calibration_valid_until);
    if (typeof config.energy.calibration_valid_until !== "string" || !config.energy.calibration_valid_until.endsWith("Z") || !Number.isFinite(expiry) || new Date(expiry).toISOString() !== config.energy.calibration_valid_until) throw new Error("Calibration expiry is invalid.");
    if (typeof config.energy.uncertainty_fraction !== "number" || !Number.isFinite(config.energy.uncertainty_fraction) || config.energy.uncertainty_fraction <= 0 || config.energy.uncertainty_fraction >= 1) throw new Error("Calibration uncertainty fraction is invalid.");
  }
  return config;
}

function shaBuffer(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function shaFile(file) {
  return shaBuffer(await readFile(file));
}

function expand(values, variables) {
  return values.map((value) => value.replace(tokenPattern, (whole, name) => {
    if (!(name in variables)) throw new Error(`No value for ${whole}.`);
    return String(variables[name]);
  }));
}

function variables(context, artifactDirectory = "", executablePath = "", layoutManifestPath = "") {
  return {
    variant: context.variant ?? "baseline",
    layout_seed: context.work_unit?.layout_seed ?? 0,
    layout_id: context.work_unit?.layout_id ?? 0,
    layout_slot: context.work_unit?.layout_slot ?? 0,
    study: context.work_unit?.study ?? 0,
    artifact_dir: artifactDirectory,
    executable_path: executablePath,
    layout_manifest_path: layoutManifestPath,
    phase: context.phase ?? "preflight",
    pair: context.pair ?? 0,
    order_position: context.order_position ?? 0,
  };
}

function attemptDocument({ role, commandSha256, executableSha256, started, ended, exitCode, signal, timedOut, termination, stdout, stderr }) {
  return {
    schema: 1,
    contract_version: FIXTURE_012_PROCESS_ATTEMPT_VERSION,
    command_role: role,
    command_sha256: commandSha256,
    executable_sha256: executableSha256,
    monotonic_started_ns: started.toString(),
    monotonic_ended_ns: ended.toString(),
    exit_code: exitCode,
    signal,
    timed_out: timedOut,
    termination,
    stdout_sha256: shaBuffer(stdout),
    stderr_sha256: shaBuffer(stderr),
    stdout_bytes: stdout.length,
    stderr_bytes: stderr.length,
  };
}

function waitMilliseconds(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function posixGroupExists(processGroupId) {
  try {
    process.kill(-processGroupId, 0);
    return true;
  } catch (error) {
    if (error.code === "ESRCH") return false;
    throw error;
  }
}

async function terminatePosixGroup(processGroupId, { graceMilliseconds = 1000 } = {}) {
  try {
    process.kill(-processGroupId, "SIGTERM");
  } catch (error) {
    if (error.code === "ESRCH") return;
    throw error;
  }
  await waitMilliseconds(graceMilliseconds);
  if (!posixGroupExists(processGroupId)) return;
  try {
    process.kill(-processGroupId, "SIGKILL");
  } catch (error) {
    if (error.code !== "ESRCH") throw error;
  }
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (!posixGroupExists(processGroupId)) return;
    await waitMilliseconds(50);
  }
  throw new Error("POSIX process group still exists after SIGKILL.");
}

/**
 * The performance interval begins immediately before spawn and ends as the
 * first operation in the exit callback. The launcher still waits for close so
 * termination and pipe drainage are complete, but hashing and JSON parsing
 * occur only after the end timestamp. This direct launcher is used for POSIX
 * process groups and the explicitly injected Windows fixture adapter only.
 */
async function launchDirectProcess({
  role,
  executable,
  executableSha256,
  args: commandArgs,
  cwd,
  environment,
  timeoutMs,
  maxOutputBytes,
}) {
  const commandSha256 = sha256(canonical({
    role,
    executable,
    executable_sha256: executableSha256,
    args: commandArgs,
    cwd,
    effective_environment_sha256: sha256(canonical(environment)),
  }));
  return new Promise((resolve, reject) => {
    const stdout = [];
    const stderr = [];
    let bytes = 0;
    let child;
    let timedOut = false;
    let outputExceeded = false;
    let terminating = false;
    let termination = "natural-exit";
    let spawnError = null;
    let treeTermination = null;
    let exited = null;
    const started = process.hrtime.bigint();
    try {
      child = spawn(executable, commandArgs, {
        cwd,
        env: environment,
        shell: false,
        windowsHide: true,
        detached: process.platform !== "win32",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (error) {
      const ended = process.hrtime.bigint();
      reject(new Fixture012ProcessAttemptError("SPAWN_FAILURE", error.message, attemptDocument({
        role, commandSha256, executableSha256, started, ended, exitCode: null,
        signal: null, timedOut: false, termination: "natural-exit",
        stdout: Buffer.alloc(0), stderr: Buffer.alloc(0),
      }), error));
      return;
    }

    function terminateTree(reason) {
      if (terminating || child.exitCode !== null) return;
      terminating = true;
      if (process.platform === "win32") {
        termination = "fixture-direct-child-terminated";
        if (!child.kill("SIGKILL")) spawnError = new Error("Fixture direct-child termination was not accepted.");
      } else {
        termination = "posix-process-group-terminated";
        treeTermination = terminatePosixGroup(child.pid);
      }
      if (reason === "timeout") timedOut = true;
      if (reason === "output") outputExceeded = true;
    }

    const timeout = setTimeout(() => terminateTree("timeout"), timeoutMs);
    timeout.unref();
    const collect = (target) => (chunk) => {
      bytes += chunk.length;
      if (bytes > maxOutputBytes) {
        terminateTree("output");
        return;
      }
      target.push(chunk);
    };
    child.stdout.on("data", collect(stdout));
    child.stderr.on("data", collect(stderr));
    child.once("error", (error) => { spawnError = error; });
    child.once("exit", (exitCode, signal) => {
      exited = {
        monotonicEnded: process.hrtime.bigint(),
        exitCode,
        signal,
      };
    });
    child.once("close", async (exitCode, signal) => {
      const closeEnded = process.hrtime.bigint();
      const ended = exited?.monotonicEnded ?? closeEnded;
      clearTimeout(timeout);
      let treeError = null;
      try {
        if (treeTermination !== null) {
          await treeTermination;
        } else if (process.platform !== "win32" && posixGroupExists(child.pid)) {
          termination = "posix-process-group-terminated";
          await terminatePosixGroup(child.pid, { graceMilliseconds: 0 });
          treeError = new Error("Command left a descendant process in its process group after the leader exited.");
        }
      } catch (error) {
        treeError = error;
      }
      const stdoutBuffer = Buffer.concat(stdout);
      const stderrBuffer = Buffer.concat(stderr);
      const attempt = attemptDocument({
        role, commandSha256, executableSha256, started, ended,
        exitCode: exited?.exitCode ?? exitCode,
        signal: exited?.signal ?? signal,
        timedOut, termination, stdout: stdoutBuffer, stderr: stderrBuffer,
      });
      if (spawnError) {
        reject(new Fixture012ProcessAttemptError("SPAWN_FAILURE", spawnError.message, attempt, spawnError));
      } else if (treeError) {
        reject(new Fixture012ProcessAttemptError("PROCESS_TREE_TERMINATION_FAILURE", treeError.message, attempt, treeError));
      } else if (timedOut) {
        reject(new Fixture012ProcessAttemptError("PROCESS_TIMEOUT", `${role} timed out`, attempt));
      } else if (outputExceeded) {
        reject(new Fixture012ProcessAttemptError("OUTPUT_LIMIT", `${role} exceeded output limit`, attempt));
      } else {
        resolve({ attempt, stdout: stdoutBuffer, stderr: stderrBuffer });
      }
    });
  });
}

async function collectBoundedProcess(child, { input, timeoutMs, stdoutLimit, stderrLimit }) {
  return new Promise((resolve, reject) => {
    const stdout = [];
    const stderr = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let failure = null;
    let exited = null;
    const timeout = setTimeout(() => {
      failure = new Error("Supervisor host exceeded its outer timeout.");
      child.kill("SIGKILL");
    }, timeoutMs);
    timeout.unref();
    const collect = (target, which, limit) => (chunk) => {
      if (which === "stdout") stdoutBytes += chunk.length;
      else stderrBytes += chunk.length;
      const total = which === "stdout" ? stdoutBytes : stderrBytes;
      if (total > limit && failure === null) {
        failure = new Error(`Supervisor host ${which} exceeded its protocol bound.`);
        child.kill("SIGKILL");
        return;
      }
      if (failure === null) target.push(chunk);
    };
    child.stdout.on("data", collect(stdout, "stdout", stdoutLimit));
    child.stderr.on("data", collect(stderr, "stderr", stderrLimit));
    child.once("error", (error) => { failure = error; });
    child.once("exit", (exitCode, signal) => { exited = { exitCode, signal }; });
    child.once("close", (exitCode, signal) => {
      clearTimeout(timeout);
      if (failure !== null) reject(failure);
      else resolve({
        exitCode: exited?.exitCode ?? exitCode,
        signal: exited?.signal ?? signal,
        stdout: Buffer.concat(stdout),
        stderr: Buffer.concat(stderr),
      });
    });
    child.stdin.once("error", (error) => {
      if (error.code !== "EPIPE" && failure === null) failure = error;
    });
    child.stdin.end(input);
  });
}

async function verifyWindowsSupervisorFiles(supervisor) {
  let harnessBytes = null;
  for (const [label, file, expected] of [
    ["Windows supervisor host", supervisor.host_executable, supervisor.host_executable_sha256],
    ["Windows supervisor harness", supervisor.harness_path, supervisor.harness_sha256],
    ["Windows supervisor source", supervisor.source_path, supervisor.source_sha256],
    ["Windows supervisor assembly", supervisor.assembly_path, supervisor.assembly_sha256],
  ]) {
    const actual = await assertAbsoluteRegularFile(file, label);
    const bytes = await readFile(actual);
    if (shaBuffer(bytes) !== expected) throw new Error(`${label} content identity mismatch.`);
    if (file === supervisor.harness_path) harnessBytes = bytes;
  }
  if (harnessBytes === null) throw new Error("Windows supervisor harness snapshot is missing.");
  const harnessText = new TextDecoder("utf-8", { fatal: true }).decode(harnessBytes);
  if (!Buffer.from(harnessText, "utf8").equals(harnessBytes) || harnessText.startsWith("\ufeff")) {
    throw new Error("Windows supervisor harness must be canonical BOM-free UTF-8.");
  }
  // PowerShell executes this already-hashed snapshot directly. It never opens
  // the mutable harness pathname while interpreting the command.
  return Buffer.from(harnessText, "utf16le").toString("base64");
}

async function invokeWindowsSupervisorHost(supervisor, { request = null, version = false, timeoutMs, maxOutputBytes }) {
  const encodedHarness = await verifyWindowsSupervisorFiles(supervisor);
  const hostArgs = [
    "-NoLogo", "-NoProfile", "-NonInteractive", "-EncodedCommand", encodedHarness,
  ];
  const hostEnvironment = {
    ...supervisor.host_environment,
    FIXTURE012_ASSEMBLY_PATH: supervisor.assembly_path,
    FIXTURE012_ASSEMBLY_SHA256: supervisor.assembly_sha256,
    FIXTURE012_VERSION: version ? "1" : "0",
  };
  let child;
  try {
    child = spawn(supervisor.host_executable, hostArgs, {
      cwd: supervisor.repository_root,
      env: hostEnvironment,
      shell: false,
      windowsHide: true,
      detached: false,
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (error) {
    throw new Fixture012ProcessAttemptError("WINDOWS_SUPERVISOR_FAILURE", error.message, null, error);
  }
  try {
    return await collectBoundedProcess(child, {
      input: request === null ? Buffer.alloc(0) : Buffer.from(JSON.stringify(request), "utf8"),
      timeoutMs,
      stdoutLimit: version ? 1_048_576 : Math.ceil(maxOutputBytes * 4 / 3) + 65_536,
      stderrLimit: 1_048_576,
    });
  } catch (error) {
    throw new Fixture012ProcessAttemptError("WINDOWS_SUPERVISOR_FAILURE", error.message, null, error);
  }
}

async function verifyWindowsSupervisor(supervisor) {
  const result = await invokeWindowsSupervisorHost(supervisor, {
    version: true,
    timeoutMs: 15_000,
    maxOutputBytes: 1_048_576,
  });
  if (result.exitCode !== 0 || result.signal !== null || shaBuffer(result.stdout) !== supervisor.version_stdout_sha256) {
    throw new Fixture012ProcessAttemptError(
      "WINDOWS_SUPERVISOR_IDENTITY_MISMATCH",
      "Windows supervisor version identity mismatch.",
    );
  }
}

async function launchWindowsSupervisedProcess({
  role,
  executable,
  executableSha256,
  args: commandArgs,
  cwd,
  environment,
  timeoutMs,
  maxOutputBytes,
  windowsSupervisor,
  lockedInputs,
}) {
  const commandSha256 = sha256(canonical({
    role,
    executable,
    executable_sha256: executableSha256,
    args: commandArgs,
    cwd,
    effective_environment_sha256: sha256(canonical(environment)),
  }));
  const request = {
    schema: 1,
    protocol_version: FIXTURE_012_WINDOWS_JOB_SUPERVISOR_VERSION,
    executable,
    executable_sha256: executableSha256,
    args: commandArgs,
    cwd,
    environment,
    locked_inputs: lockedInputs,
    timeout_ms: timeoutMs,
    max_output_bytes: maxOutputBytes,
  };
  const outer = await invokeWindowsSupervisorHost(windowsSupervisor, {
    request,
    timeoutMs: timeoutMs + windowsSupervisor.outer_timeout_margin_ms,
    maxOutputBytes,
  });
  if (outer.exitCode !== 0 || outer.signal !== null || outer.stderr.length !== 0) {
    throw new Fixture012ProcessAttemptError(
      "WINDOWS_SUPERVISOR_FAILURE",
      `Windows supervisor failed with exit ${outer.exitCode ?? "null"}, signal ${outer.signal ?? "null"}, ` +
        `stderr SHA-256 ${shaBuffer(outer.stderr)}, and bounded stderr ${boundedSupervisorDiagnostic(outer.stderr)}.`,
    );
  }
  let response;
  try {
    response = JSON.parse(outer.stdout.toString("utf8"));
    exactObject(response, [
      "schema", "protocol_version", "status", "monotonic_started_ns",
      "monotonic_ended_ns", "exit_code", "termination", "stdout_base64",
      "stderr_base64", "kill_on_job_close", "assigned_before_resume",
    ], "Windows supervisor response");
    if (response.schema !== 1 || response.protocol_version !== FIXTURE_012_WINDOWS_JOB_SUPERVISOR_VERSION) throw new Error("response identity is invalid");
    if (!new Set(["completed", "timeout", "output-limit", "descendant-survived", "path-identity-break"]).has(response.status)) throw new Error("response status is invalid");
    if (response.kill_on_job_close !== true || response.assigned_before_resume !== true) throw new Error("Job Object invariants were not established before execution");
    if (!/^[0-9]+$/.test(response.monotonic_started_ns) || !/^[0-9]+$/.test(response.monotonic_ended_ns) || BigInt(response.monotonic_ended_ns) <= BigInt(response.monotonic_started_ns)) throw new Error("monotonic interval is invalid");
    if (!Number.isInteger(response.exit_code) || response.exit_code < 0 || response.exit_code > 0xffff_ffff) throw new Error("exit code is invalid");
    if (!new Set(["natural-exit", "windows-job-terminated"]).has(response.termination)) throw new Error("termination identity is invalid");
    if (typeof response.stdout_base64 !== "string" || typeof response.stderr_base64 !== "string") throw new Error("encoded output is invalid");
    const expectedTermination = response.status === "completed" ? "natural-exit" : "windows-job-terminated";
    if (response.termination !== expectedTermination) throw new Error("status and termination are inconsistent");
  } catch (error) {
    throw new Fixture012ProcessAttemptError("WINDOWS_SUPERVISOR_PROTOCOL_FAILURE", error.message, null, error);
  }
  const stdout = Buffer.from(response.stdout_base64, "base64");
  const stderr = Buffer.from(response.stderr_base64, "base64");
  if (stdout.toString("base64") !== response.stdout_base64 || stderr.toString("base64") !== response.stderr_base64) {
    throw new Fixture012ProcessAttemptError("WINDOWS_SUPERVISOR_PROTOCOL_FAILURE", "Supervisor output is not canonical base64.");
  }
  if (stdout.length + stderr.length > maxOutputBytes) {
    throw new Fixture012ProcessAttemptError("WINDOWS_SUPERVISOR_PROTOCOL_FAILURE", "Supervisor retained output above the command bound.");
  }
  const attempt = attemptDocument({
    role,
    commandSha256,
    executableSha256,
    started: BigInt(response.monotonic_started_ns),
    ended: BigInt(response.monotonic_ended_ns),
    exitCode: response.exit_code,
    signal: null,
    timedOut: response.status === "timeout",
    termination: response.termination,
    stdout,
    stderr,
  });
  if (response.status === "timeout") throw new Fixture012ProcessAttemptError("PROCESS_TIMEOUT", `${role} timed out`, attempt);
  if (response.status === "output-limit") throw new Fixture012ProcessAttemptError("OUTPUT_LIMIT", `${role} exceeded output limit`, attempt);
  if (response.status === "descendant-survived") throw new Fixture012ProcessAttemptError("PROCESS_TREE_LEAK", `${role} left a live descendant after leader exit`, attempt);
  if (response.status === "path-identity-break") throw new Fixture012ProcessAttemptError("PATH_IDENTITY_BREAK", `${role} lost a guarded path identity during execution`, attempt);
  return { attempt, stdout, stderr };
}

async function launchProcess(options) {
  if (process.platform === "win32" && !options.fixtureProcessExecution) {
    if (options.windowsSupervisor === null) {
      throw new Fixture012ProcessAttemptError(
        "WINDOWS_JOB_OBJECT_REQUIRED",
        "Real Windows execution requires a content-identified Job Object supervisor.",
      );
    }
    return launchWindowsSupervisedProcess(options);
  }
  return launchDirectProcess(options);
}

function commandBinding(role, value) {
  const body = {
    role,
    executable_path: value.executable,
    executable_sha256: value.executable_sha256,
    version_args: value.version_args,
    version_stdout_sha256: value.version_stdout_sha256,
  };
  return { ...body, command_identity_sha256: sha256(canonical(body)) };
}

async function parseJson(buffer, keys, label, attempt) {
  try {
    const value = JSON.parse(buffer.toString("utf8"));
    exactObject(value, keys, label);
    return value;
  } catch (error) {
    throw new Fixture012ProcessAttemptError(
      "INVALID_PROCESS_OUTPUT",
      `${label} did not emit the required closed-schema JSON object: ${error.message}`,
      attempt,
      error,
    );
  }
}

async function verifyVersion({ binding, cwd, environment, fixtureProcessExecution, windowsSupervisor, lockedInputs }) {
  const result = await launchProcess({
    role: `${binding.role}-version`,
    executable: binding.executable_path,
    executableSha256: binding.executable_sha256,
    args: binding.version_args,
    cwd,
    environment,
    timeoutMs: 10_000,
    maxOutputBytes: 1_048_576,
    fixtureProcessExecution,
    windowsSupervisor,
    lockedInputs,
  });
  if (result.attempt.exit_code !== 0 || result.attempt.termination !== "natural-exit" || result.attempt.stdout_sha256 !== binding.version_stdout_sha256) {
    throw new Fixture012ProcessAttemptError("VERSION_IDENTITY_MISMATCH", `${binding.role} version identity mismatch`, result.attempt);
  }
  return result.attempt;
}

export async function createFixture012ProcessWorkstationAdapter({
  adapterConfig,
  experimentConfig,
  repositoryRoot,
  adapterConfigPath = null,
  fixtureProcessExecution = false,
}) {
  validateFixture012ProcessAdapterConfig(adapterConfig);
  if (!experimentConfig?.energy || (experimentConfig.energy.mode === "latency-only") !== (adapterConfig.energy === null)) throw new Error("Experiment and adapter energy modes disagree.");
  const root = await realpath(repositoryRoot);
  const workingDirectory = await assertSafePathBelow({
    root,
    target: path.resolve(root, adapterConfig.working_directory),
    label: "adapter working directory",
    finalType: "directory",
  });
  if (process.platform === "win32" && !fixtureProcessExecution && adapterConfig.windows_job_supervisor === null) {
    throw new Fixture012ProcessAttemptError(
      "WINDOWS_JOB_OBJECT_REQUIRED",
      "Real Windows execution requires a content-identified Job Object supervisor configuration.",
    );
  }
  let windowsSupervisor = null;
  if (adapterConfig.windows_job_supervisor !== null) {
    const configured = adapterConfig.windows_job_supervisor;
    const hostExecutable = await assertAbsoluteRegularFile(configured.host_executable, "Windows supervisor host");
    const assemblyPath = await assertAbsoluteRegularFile(configured.assembly_path, "Windows supervisor assembly");
    const harnessPath = await assertSafePathBelow({
      root,
      target: path.join(root, configured.harness_path),
      label: "Windows supervisor harness",
      finalType: "file",
    });
    const sourcePath = await assertSafePathBelow({
      root,
      target: path.join(root, configured.source_path),
      label: "Windows supervisor source",
      finalType: "file",
    });
    windowsSupervisor = Object.freeze({
      protocol_version: configured.protocol_version,
      host_executable: hostExecutable,
      host_executable_sha256: configured.host_executable_sha256,
      version_stdout_sha256: configured.version_stdout_sha256,
      harness_path: harnessPath,
      harness_sha256: configured.harness_sha256,
      source_path: sourcePath,
      source_sha256: configured.source_sha256,
      assembly_path: assemblyPath,
      assembly_sha256: configured.assembly_sha256,
      outer_timeout_margin_ms: configured.outer_timeout_margin_ms,
      repository_root: root,
      host_environment: Object.freeze({
        SYSTEMROOT: adapterConfig.effective_environment.values[
          Object.keys(adapterConfig.effective_environment.values).find((key) => key.toUpperCase() === "SYSTEMROOT")
        ],
        TEMP: adapterConfig.effective_environment.values[
          Object.keys(adapterConfig.effective_environment.values).find((key) => key.toUpperCase() === "TEMP")
        ],
        TMP: adapterConfig.effective_environment.values[
          Object.keys(adapterConfig.effective_environment.values).find((key) => key.toUpperCase() === "TMP")
        ],
      }),
    });
    await verifyWindowsSupervisorFiles(windowsSupervisor);
  }
  const commandEntries = [
    ["build", adapterConfig.build],
    ["telemetry", adapterConfig.telemetry],
    ...(adapterConfig.energy ? [["energy", adapterConfig.energy]] : []),
  ];
  for (const [role, value] of commandEntries) {
    const executable = await assertAbsoluteRegularFile(value.executable, `${role} executable`);
    if (await shaFile(executable) !== value.executable_sha256) throw new Error(`${role} executable content identity mismatch.`);
  }
  if (adapterConfig.energy) {
    const certificate = await assertAbsoluteRegularFile(adapterConfig.energy.calibration_certificate_path, "calibration certificate");
    if (await shaFile(certificate) !== adapterConfig.energy.calibration_certificate_sha256) throw new Error("Calibration certificate identity mismatch.");
  }
  const manifestPath = await assertSafePathBelow({
    root,
    target: path.join(root, experimentConfig.trusted_inputs.manifest_path),
    label: "trusted input manifest",
    finalType: "file",
  });
  const trustedManifest = JSON.parse(await readFile(manifestPath, "utf8"));
  validateTrustedInputManifest(trustedManifest);
  if (sha256(canonical(trustedManifest)) !== experimentConfig.trusted_inputs.manifest_sha256) throw new Error("Trusted input manifest digest mismatch.");
  const trustedFiles = [];
  for (const file of trustedManifest.files) {
    const absolute = await assertSafePathBelow({ root, target: path.join(root, file.path), label: `trusted ${file.role}`, finalType: "file" });
    if (await shaFile(absolute) !== file.sha256) throw new Error(`Trusted ${file.role} identity mismatch.`);
    trustedFiles.push(Object.freeze({ role: file.role, path: absolute, sha256: file.sha256 }));
  }
  const sourcePath = fileURLToPath(import.meta.url);
  const sourceSha256 = await shaFile(sourcePath);
  const configFilePath = adapterConfigPath === null
    ? null
    : await assertSafePathBelow({
      root,
      target: adapterConfigPath,
      label: "adapter config file",
      finalType: "file",
    });
  const configLocator = configFilePath === null
    ? null
    : path.relative(root, configFilePath).replaceAll("\\", "/");
  if (!fixtureProcessExecution && configLocator === null) {
    throw new Error("Real process adapter requires its repository config-file identity.");
  }
  const environment = Object.freeze({ ...adapterConfig.effective_environment.values });
  const lockedInputs = Object.freeze(trustedFiles.map((file) => Object.freeze({ path: file.path, sha256: file.sha256 })));
  const bindings = commandEntries.map(([role, value]) => commandBinding(role, value));
  const binding = Object.freeze({
    schema: 1,
    adapter_id: adapterConfig.adapter_id,
    adapter_version: adapterConfig.adapter_version,
    fixture_only: fixtureProcessExecution,
    source_locator: path.relative(root, sourcePath).replaceAll("\\", "/"),
    source_sha256: sourceSha256,
    config_locator: configLocator,
    config_sha256: sha256(canonical(adapterConfig)),
    effective_environment: environment,
    environment_sha256: sha256(canonical(environment)),
    commands: bindings,
    process_supervisor: windowsSupervisor === null ? null : {
      protocol_version: windowsSupervisor.protocol_version,
      host_executable_path: windowsSupervisor.host_executable,
      host_executable_sha256: windowsSupervisor.host_executable_sha256,
      version_stdout_sha256: windowsSupervisor.version_stdout_sha256,
      harness_locator: path.relative(root, windowsSupervisor.harness_path).replaceAll("\\", "/"),
      harness_sha256: windowsSupervisor.harness_sha256,
      source_locator: path.relative(root, windowsSupervisor.source_path).replaceAll("\\", "/"),
      source_sha256: windowsSupervisor.source_sha256,
      assembly_path: windowsSupervisor.assembly_path,
      assembly_sha256: windowsSupervisor.assembly_sha256,
      identity_sha256: sha256(canonical({
        protocol_version: windowsSupervisor.protocol_version,
        host_executable_path: windowsSupervisor.host_executable,
        host_executable_sha256: windowsSupervisor.host_executable_sha256,
        version_stdout_sha256: windowsSupervisor.version_stdout_sha256,
        harness_locator: path.relative(root, windowsSupervisor.harness_path).replaceAll("\\", "/"),
        harness_sha256: windowsSupervisor.harness_sha256,
        source_locator: path.relative(root, windowsSupervisor.source_path).replaceAll("\\", "/"),
        source_sha256: windowsSupervisor.source_sha256,
        assembly_path: windowsSupervisor.assembly_path,
        assembly_sha256: windowsSupervisor.assembly_sha256,
      })),
    },
    trusted_inputs: {
      manifest_path: experimentConfig.trusted_inputs.manifest_path,
      manifest_sha256: experimentConfig.trusted_inputs.manifest_sha256,
      manifest: trustedManifest,
    },
  });

  async function revalidateFrozenInputs() {
    if (await shaFile(sourcePath) !== sourceSha256) throw new Error("Process adapter source changed before launch.");
    if (configFilePath !== null) {
      const currentConfig = JSON.parse(await readFile(configFilePath, "utf8"));
      if (sha256(canonical(currentConfig)) !== binding.config_sha256) throw new Error("Process adapter config changed before launch.");
    }
    const currentManifest = JSON.parse(await readFile(manifestPath, "utf8"));
    if (canonical(currentManifest) !== canonical(trustedManifest)) throw new Error("Trusted input manifest changed before launch.");
    for (const file of trustedFiles) {
      if (await shaFile(file.path) !== file.sha256) throw new Error(`Trusted ${file.role} changed before launch.`);
    }
  }

  async function checkedLaunch({ role, executable, expectedSha256, commandArgs, timeoutMs, maxOutputBytes }) {
    await revalidateFrozenInputs();
    const actualPath = await assertAbsoluteRegularFile(executable, `${role} executable`);
    if (await shaFile(actualPath) !== expectedSha256) throw new Error(`${role} executable changed before launch.`);
    return launchProcess({
      role,
      executable: actualPath,
      executableSha256: expectedSha256,
      args: commandArgs,
      cwd: workingDirectory,
      environment,
      timeoutMs,
      maxOutputBytes,
      fixtureProcessExecution,
      windowsSupervisor,
      lockedInputs,
    });
  }

  async function telemetry(context = {}) {
    const commandArgs = expand(adapterConfig.telemetry.args, variables(context));
    const result = await checkedLaunch({
      role: "telemetry",
      executable: adapterConfig.telemetry.executable,
      expectedSha256: adapterConfig.telemetry.executable_sha256,
      commandArgs,
      timeoutMs: adapterConfig.telemetry.timeout_ms,
      maxOutputBytes: adapterConfig.telemetry.max_output_bytes,
    });
    if (result.attempt.exit_code !== 0) throw new Fixture012ProcessAttemptError("TELEMETRY_FAILURE", "Telemetry command failed", result.attempt);
    const value = await parseJson(result.stdout, ["thermal_c", "frequency_hz"], "telemetry output", result.attempt);
    try {
      exactObject(value.thermal_c, adapterConfig.thermal_sensor_ids, "thermal telemetry");
      exactObject(value.frequency_hz, adapterConfig.frequency_sensor_ids, "frequency telemetry");
    } catch (error) {
      throw new Fixture012ProcessAttemptError("INVALID_PROCESS_OUTPUT", error.message, result.attempt, error);
    }
    return {
      schema: 1,
      captured_at_utc: new Date().toISOString(),
      monotonic_ns: result.attempt.monotonic_ended_ns,
      thermal_c: value.thermal_c,
      frequency_hz: value.frequency_hz,
      raw_sha256: result.attempt.stdout_sha256,
      attempt: result.attempt,
    };
  }

  async function energy(context = {}) {
    const commandArgs = expand(adapterConfig.energy.args, variables(context));
    const result = await checkedLaunch({
      role: "energy",
      executable: adapterConfig.energy.executable,
      expectedSha256: adapterConfig.energy.executable_sha256,
      commandArgs,
      timeoutMs: adapterConfig.energy.timeout_ms,
      maxOutputBytes: adapterConfig.energy.max_output_bytes,
    });
    if (result.attempt.exit_code !== 0) throw new Fixture012ProcessAttemptError("ENERGY_PROVIDER_FAILURE", "Energy provider failed", result.attempt);
    const value = await parseJson(result.stdout, ["cumulative_j", "raw_uncertainty_j"], "energy output", result.attempt);
    return {
      schema: 1,
      captured_at_utc: new Date().toISOString(),
      monotonic_ns: result.attempt.monotonic_ended_ns,
      cumulative_j: value.cumulative_j,
      raw_uncertainty_j: value.raw_uncertainty_j,
      raw_sha256: result.attempt.stdout_sha256,
      attempt: result.attempt,
    };
  }

  return Object.freeze({
    binding,
    async prepare() {
      await revalidateFrozenInputs();
      if (process.platform === "win32" && !fixtureProcessExecution) await verifyWindowsSupervisor(windowsSupervisor);
      for (const commandBindingValue of bindings) {
        await verifyVersion({ binding: commandBindingValue, cwd: workingDirectory, environment, fixtureProcessExecution, windowsSupervisor, lockedInputs });
      }
      await telemetry();
      if (adapterConfig.energy) await energy();
      const cpu = os.cpus()[0]?.model?.trim();
      if (!cpu) throw new Error("CPU identity unavailable.");
      return {
        schema: 1,
        machine: {
          host_fingerprint_sha256: sha256(canonical({
            hostname: os.hostname(), platform: os.platform(), release: os.release(),
            arch: os.arch(), cpu, cpus: os.cpus().length, memory: os.totalmem(),
            adapter_binding_sha256: sha256(canonical(binding)),
          })),
          platform: os.platform(),
          platform_release: os.release(),
          architecture: os.arch(),
          cpu_model: cpu,
          logical_cpus: os.cpus().length,
          memory_bytes: os.totalmem(),
          runtime: `Node.js ${process.version}`,
        },
        clock: {
          source: process.platform === "win32" && !fixtureProcessExecution
            ? "windows:QueryPerformanceCounter"
            : "node:process.hrtime.bigint",
          monotonic: true,
          measurement_boundary: experimentConfig.measurement_boundary,
        },
        telemetry: {
          thermal_sensor_ids: adapterConfig.thermal_sensor_ids,
          frequency_sensor_ids: adapterConfig.frequency_sensor_ids,
        },
        energy: adapterConfig.energy === null ? { mode: "none" } : {
          mode: adapterConfig.energy.mode,
          provider_id: adapterConfig.energy.provider_id,
          provider_serial: adapterConfig.energy.provider_serial,
          calibration_certificate_path: adapterConfig.energy.calibration_certificate_path,
          calibration_certificate_sha256: adapterConfig.energy.calibration_certificate_sha256,
          calibration_valid_until: adapterConfig.energy.calibration_valid_until,
          uncertainty_fraction: adapterConfig.energy.uncertainty_fraction,
        },
        binding_sha256: sha256(canonical(binding)),
      };
    },
    async build(context) {
      const runsRoot = path.join(root, "experiments", "workstation", "runs");
      const artifactDirectory = path.resolve(context.artifact_directory);
      if (!isPathInside(runsRoot, artifactDirectory)) throw new Error("Artifact directory escapes workstation runs root.");
      await assertSafePathBelow({ root: runsRoot, target: artifactDirectory, label: "artifact directory", allowMissing: true });
      await mkdir(path.dirname(artifactDirectory), { recursive: true });
      await mkdir(artifactDirectory);
      await assertSafePathBelow({ root: runsRoot, target: artifactDirectory, label: "artifact directory", finalType: "directory" });
      const executablePath = path.join(artifactDirectory, adapterConfig.build.output_executable);
      const layoutManifestPath = path.join(artifactDirectory, adapterConfig.build.output_layout_manifest);
      const commandArgs = expand(adapterConfig.build.args, variables(context, artifactDirectory, executablePath, layoutManifestPath));
      const result = await checkedLaunch({
        role: "build",
        executable: adapterConfig.build.executable,
        expectedSha256: adapterConfig.build.executable_sha256,
        commandArgs,
        timeoutMs: Math.min(context.timeout_ms, adapterConfig.build.timeout_ms),
        maxOutputBytes: adapterConfig.build.max_output_bytes,
      });
      const buildLog = Buffer.concat([result.stdout, Buffer.from("\n--- stderr ---\n"), result.stderr]);
      if (result.attempt.exit_code !== 0) throw new Fixture012ProcessAttemptError("BUILD_FAILURE", `Build exited ${result.attempt.exit_code}`, result.attempt);
      let executable;
      let layoutFile;
      let executableSha256;
      let layoutManifest;
      try {
        executable = await assertSafePathBelow({ root: artifactDirectory, target: executablePath, label: "built executable", finalType: "file" });
        layoutFile = await assertSafePathBelow({ root: artifactDirectory, target: layoutManifestPath, label: "layout manifest", finalType: "file" });
        executableSha256 = await shaFile(executable);
        layoutManifest = JSON.parse(await readFile(layoutFile, "utf8"));
        validateNormalizedLayoutManifest(layoutManifest, { variant: context.variant, layout_seed: context.layout_seed });
      } catch (error) {
        throw new Fixture012ProcessAttemptError("INVALID_LAYOUT_PROOF", error.message, result.attempt, error);
      }
      const versionResult = await checkedLaunch({
        role: "measured-artifact-version",
        executable,
        expectedSha256: executableSha256,
        commandArgs: adapterConfig.run.version_args,
        timeoutMs: 10_000,
        maxOutputBytes: 1_048_576,
      });
      if (versionResult.attempt.exit_code !== 0 || versionResult.attempt.stdout_sha256 !== adapterConfig.run.version_stdout_sha256) {
        throw new Fixture012ProcessAttemptError("ARTIFACT_VERSION_MISMATCH", "Built artifact version identity mismatch", versionResult.attempt);
      }
      const artifactLocator = path.relative(root, executable).replaceAll("\\", "/");
      const layoutLocator = path.relative(root, layoutFile).replaceAll("\\", "/");
      const body = {
        schema: 1,
        variant: context.variant,
        layout_seed: context.layout_seed,
        artifact_locator: artifactLocator,
        executable_sha256: executableSha256,
        executable_version_stdout_sha256: versionResult.attempt.stdout_sha256,
        executable_version_attempt: versionResult.attempt,
        artifact_command_identity_sha256: sha256(canonical({
          artifact_locator: artifactLocator,
          executable_sha256: executableSha256,
          executable_version_stdout_sha256: versionResult.attempt.stdout_sha256,
        })),
        layout_manifest_locator: layoutLocator,
        layout_manifest_sha256: sha256(canonical(layoutManifest)),
        layout_manifest: layoutManifest,
        layout_structure_sha256: fixture012LayoutStructureSha256(layoutManifest),
        build_log_sha256: shaBuffer(buildLog),
        attempt: result.attempt,
      };
      return body;
    },
    captureTelemetry: telemetry,
    async execute(context) {
      const runsRoot = path.join(root, "experiments", "workstation", "runs");
      const executable = await assertSafePathBelow({
        root: runsRoot,
        target: path.join(root, context.artifact.artifact_locator),
        label: "measured artifact",
        finalType: "file",
      });
      if (await shaFile(executable) !== context.artifact.executable_sha256) throw new Error("Measured artifact changed before execution.");
      const commandArgs = expand(adapterConfig.run.args, variables(context));
      const result = await checkedLaunch({
        role: "measure",
        executable,
        expectedSha256: context.artifact.executable_sha256,
        commandArgs,
        timeoutMs: Math.min(context.timeout_ms, adapterConfig.run.timeout_ms),
        maxOutputBytes: adapterConfig.run.max_output_bytes,
      });
      return {
        schema: 1,
        status: result.attempt.exit_code === 0 && !result.attempt.timed_out ? "ok" : "failed",
        stdout_sha256: result.attempt.stdout_sha256,
        stderr_sha256: result.attempt.stderr_sha256,
        correctness_sha256: result.attempt.stdout_sha256,
        attempt: result.attempt,
      };
    },
    readEnergy: adapterConfig.energy === null ? null : energy,
  });
}

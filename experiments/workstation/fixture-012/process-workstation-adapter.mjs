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

export const FIXTURE_012_PROCESS_ADAPTER_CONFIG_VERSION = "fixture-012.process-adapter-config.v2";
export const FIXTURE_012_PROCESS_ADAPTER_VERSION = "fixture-012.process-workstation-adapter.v2";

const tokenPattern = /\{([a-z_]+)\}/gu;
const allowedTokens = new Set([
  "variant", "layout_seed", "layout_id", "layout_slot", "study",
  "artifact_dir", "executable_path", "layout_manifest_path", "phase",
  "pair", "order_position",
]);
const forbiddenEnvironment = /^(NODE_OPTIONS|NODE_PATH|LD_PRELOAD|LD_LIBRARY_PATH|DYLD_.+|BASH_ENV|ENV|PROMPT_COMMAND)$/i;

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

function positive(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`${label} must be a positive integer.`);
  return value;
}

function args(value, label) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) throw new Error(`${label} must be a string array.`);
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
    "frequency_sensor_ids", "build", "run", "telemetry", "energy",
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
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || forbiddenEnvironment.test(key) || typeof value !== "string") throw new Error(`Effective environment entry is unsafe: ${key}.`);
  }
  for (const [label, values] of [["thermal_sensor_ids", config.thermal_sensor_ids], ["frequency_sensor_ids", config.frequency_sensor_ids]]) {
    if (!Array.isArray(values) || values.length === 0 || new Set(values).size !== values.length || values.some((value) => !/^[a-z0-9][a-z0-9._-]+$/i.test(value))) throw new Error(`${label} is invalid.`);
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
 * occur only after the end timestamp. On Windows this function is callable only for a
 * fixture-marked test adapter; production acquisition is disabled until a
 * reviewed Job Object supervisor exists.
 */
async function launchProcess({
  role,
  executable,
  executableSha256,
  args: commandArgs,
  cwd,
  environment,
  timeoutMs,
  maxOutputBytes,
  fixtureProcessExecution,
}) {
  if (process.platform === "win32" && !fixtureProcessExecution) {
    throw new Fixture012ProcessAttemptError(
      "WINDOWS_JOB_OBJECT_REQUIRED",
      "Real Windows execution is disabled until a reviewed Job Object process-tree supervisor is configured.",
    );
  }
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

async function verifyVersion({ binding, cwd, environment, fixtureProcessExecution }) {
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
  for (const file of trustedManifest.files) {
    const absolute = await assertSafePathBelow({ root, target: path.join(root, file.path), label: `trusted ${file.role}`, finalType: "file" });
    if (await shaFile(absolute) !== file.sha256) throw new Error(`Trusted ${file.role} identity mismatch.`);
  }
  const sourcePath = fileURLToPath(import.meta.url);
  const sourceSha256 = await shaFile(sourcePath);
  const configLocator = adapterConfigPath === null
    ? null
    : path.relative(root, await assertSafePathBelow({
      root,
      target: adapterConfigPath,
      label: "adapter config file",
      finalType: "file",
    })).replaceAll("\\", "/");
  if (!fixtureProcessExecution && configLocator === null) {
    throw new Error("Real process adapter requires its repository config-file identity.");
  }
  const environment = Object.freeze({ ...adapterConfig.effective_environment.values });
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
    trusted_inputs: {
      manifest_path: experimentConfig.trusted_inputs.manifest_path,
      manifest_sha256: experimentConfig.trusted_inputs.manifest_sha256,
      manifest: trustedManifest,
    },
  });

  async function checkedLaunch({ role, executable, expectedSha256, commandArgs, timeoutMs, maxOutputBytes }) {
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
      if (process.platform === "win32" && !fixtureProcessExecution) {
        throw new Fixture012ProcessAttemptError(
          "WINDOWS_JOB_OBJECT_REQUIRED",
          "Real Windows acquisition remains disabled until a reviewed Job Object supervisor is implemented.",
        );
      }
      for (const commandBindingValue of bindings) {
        await verifyVersion({ binding: commandBindingValue, cwd: workingDirectory, environment, fixtureProcessExecution });
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
          source: "node:process.hrtime.bigint",
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

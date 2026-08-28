import { createHash, randomBytes } from "node:crypto";
import {
  open,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { canonical, sha256 } from "./contract.mjs";
import {
  assertAbsoluteRegularFile,
  assertSafePathBelow,
  ensureSafeDirectory,
  isPathInside,
} from "./workstation-path-safety.mjs";

export const FIXTURE_012_WORKSTATION_CONFIG_VERSION = "fixture-012.workstation-config.v2";
export const FIXTURE_012_WORKSTATION_LEDGER_VERSION = "fixture-012.workstation-layout-record.v2";
export const FIXTURE_012_WORKSTATION_RUNNER_VERSION = "fixture-012.workstation-acquisition.v2";
export const FIXTURE_012_LAYOUT_MANIFEST_VERSION = "fixture-012.normalized-layout-manifest.v1";
export const FIXTURE_012_PROCESS_ATTEMPT_VERSION = "fixture-012.process-attempt.v2";

const VARIANTS = Object.freeze(["baseline", "candidate"]);
const ZERO_HASH = "0".repeat(64);
const ADAPTER_KEYS = Object.freeze([
  "binding",
  "prepare",
  "build",
  "captureTelemetry",
  "execute",
  "readEnergy",
]);

export class Fixture012WorkstationError extends Error {
  constructor(code, message, cause = undefined, attempt = null) {
    super(`${code}: ${message}`, cause === undefined ? undefined : { cause });
    this.name = "Fixture012WorkstationError";
    this.code = code;
    this.attempt = attempt;
  }
}

function fail(code, message, cause = undefined, attempt = null) {
  throw new Fixture012WorkstationError(code, message, cause, attempt);
}

function exactObject(value, keys, label, code = "INVALID_SHAPE") {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(code, `${label} must be an object`);
  }
  if (canonical(Object.keys(value).sort()) !== canonical([...keys].sort())) {
    fail(code, `${label} has an inexact field set`);
  }
  return value;
}

function nonEmpty(value, label, code = "INVALID_VALUE") {
  if (typeof value !== "string" || value.trim().length === 0) fail(code, `${label} must be non-empty`);
  return value;
}

function digest(value, label, code = "INVALID_DIGEST") {
  if (typeof value !== "string" || !/^[0-9a-f]{64}$/.test(value)) {
    fail(code, `${label} must be a lowercase SHA-256 digest`);
  }
  return value;
}

function positiveInteger(value, label, code = "INVALID_COUNT") {
  if (!Number.isSafeInteger(value) || value < 1) fail(code, `${label} must be a positive integer`);
  return value;
}

function nonNegativeInteger(value, label, code = "INVALID_COUNT") {
  if (!Number.isSafeInteger(value) || value < 0) fail(code, `${label} must be a non-negative integer`);
  return value;
}

function finite(value, label, code = "INVALID_VALUE") {
  if (typeof value !== "number" || !Number.isFinite(value)) fail(code, `${label} must be finite`);
  return value;
}

function exactUtc(value, label, code = "INVALID_CLOCK") {
  const parsed = Date.parse(value);
  if (
    typeof value !== "string"
    || !value.endsWith("Z")
    || !Number.isFinite(parsed)
    || new Date(parsed).toISOString() !== value
  ) fail(code, `${label} must be an exact UTC instant`);
  return value;
}

function ns(value, label, code = "INVALID_CLOCK") {
  if (typeof value !== "string" || !/^(0|[1-9][0-9]*)$/.test(value)) {
    fail(code, `${label} must be a canonical non-negative nanosecond string`);
  }
  return BigInt(value);
}

function uniqueStrings(value, label, { empty = false } = {}) {
  if (
    !Array.isArray(value)
    || (!empty && value.length === 0)
    || value.some((item) => typeof item !== "string" || item.length === 0)
    || new Set(value).size !== value.length
  ) fail("INVALID_VALUE", `${label} must be a unique string array`);
  return value;
}

function safeFailure(error) {
  let attempt = error?.attempt ?? null;
  if (attempt !== null) {
    try {
      assertProcessAttempt(attempt, "failure.attempt");
    } catch {
      attempt = null;
    }
  }
  return {
    code: typeof error?.code === "string" ? error.code : "ADAPTER_FAILURE",
    message: String(error?.message ?? error).slice(0, 4096),
    attempt,
  };
}

export function validateFixture012WorkstationConfig(config) {
  exactObject(config, [
    "schema", "artifact", "contract_version", "campaign_id", "profile",
    "schedule_seed", "studies", "layouts_per_study", "warmup_pairs_per_layout",
    "measurement_pairs_per_layout", "timeout_ms", "variants", "measurement_boundary",
    "correctness", "trusted_inputs", "thermal", "frequency", "energy", "authority",
  ], "workstation config", "INVALID_CONFIG");
  if (
    config.schema !== 1
    || config.artifact !== "fixture-012"
    || config.contract_version !== FIXTURE_012_WORKSTATION_CONFIG_VERSION
    || config.profile !== "workstation-development"
    || canonical(config.variants) !== canonical(VARIANTS)
    || config.measurement_boundary !== "process-launch-to-exit-event"
  ) fail("INVALID_CONFIG", "config identity or fixed measurement semantics disagree");
  if (
    !/^[a-z0-9][a-z0-9._-]{7,79}$/.test(config.campaign_id ?? "")
    || /replace|placeholder|example|todo|tbd/i.test(config.campaign_id)
  ) fail("INVALID_CONFIG", "campaign_id is not concrete");
  if (!Number.isInteger(config.schedule_seed) || config.schedule_seed < 0 || config.schedule_seed > 0xffff_ffff) {
    fail("INVALID_CONFIG", "schedule_seed must be uint32");
  }
  for (const field of ["studies", "layouts_per_study", "warmup_pairs_per_layout", "measurement_pairs_per_layout", "timeout_ms"]) {
    positiveInteger(config[field], field, "INVALID_CONFIG");
  }
  if (
    config.layouts_per_study < 4
    || config.layouts_per_study % 2 !== 0
    || config.warmup_pairs_per_layout % 2 !== 0
    || config.measurement_pairs_per_layout % 2 !== 0
  ) fail("INVALID_CONFIG", "layout and pair counts must be even, with at least four layouts");
  exactObject(config.correctness, ["mode", "expected_stdout_sha256"], "correctness", "INVALID_CONFIG");
  if (config.correctness.mode !== "stdout-sha256") fail("INVALID_CONFIG", "unsupported correctness mode");
  digest(config.correctness.expected_stdout_sha256, "expected correctness", "INVALID_CONFIG");
  exactObject(config.trusted_inputs, ["manifest_path", "manifest_sha256"], "trusted_inputs", "INVALID_CONFIG");
  nonEmpty(config.trusted_inputs.manifest_path, "trusted manifest path", "INVALID_CONFIG");
  if (path.isAbsolute(config.trusted_inputs.manifest_path) || config.trusted_inputs.manifest_path.includes("..")) {
    fail("INVALID_CONFIG", "trusted manifest path must be repository-relative");
  }
  digest(config.trusted_inputs.manifest_sha256, "trusted manifest SHA-256", "INVALID_CONFIG");
  exactObject(config.thermal, ["required_sensor_ids", "minimum_c", "maximum_c", "maximum_pair_drift_c"], "thermal", "INVALID_CONFIG");
  uniqueStrings(config.thermal.required_sensor_ids, "thermal sensors");
  for (const field of ["minimum_c", "maximum_c", "maximum_pair_drift_c"]) finite(config.thermal[field], field, "INVALID_CONFIG");
  if (config.thermal.maximum_c <= config.thermal.minimum_c || config.thermal.maximum_pair_drift_c <= 0) {
    fail("INVALID_CONFIG", "thermal limits are invalid");
  }
  exactObject(config.frequency, ["required_sensor_ids", "minimum_hz", "maximum_pair_relative_drift"], "frequency", "INVALID_CONFIG");
  uniqueStrings(config.frequency.required_sensor_ids, "frequency sensors");
  positiveInteger(config.frequency.minimum_hz, "minimum frequency", "INVALID_CONFIG");
  finite(config.frequency.maximum_pair_relative_drift, "frequency drift", "INVALID_CONFIG");
  if (config.frequency.maximum_pair_relative_drift <= 0 || config.frequency.maximum_pair_relative_drift >= 1) {
    fail("INVALID_CONFIG", "frequency drift must be between zero and one");
  }
  exactObject(config.energy, [
    "mode", "require_calibrated_provider_for_energy_claim", "minimum_interval_uncertainty_j",
  ], "energy", "INVALID_CONFIG");
  if (
    !["latency-only", "external-calibrated-cumulative-joules"].includes(config.energy.mode)
    || config.energy.require_calibrated_provider_for_energy_claim !== true
  ) fail("INVALID_CONFIG", "energy mode is invalid");
  finite(config.energy.minimum_interval_uncertainty_j, "minimum energy uncertainty", "INVALID_CONFIG");
  if (config.energy.minimum_interval_uncertainty_j < 0) fail("INVALID_CONFIG", "energy uncertainty floor is negative");
  if (
    config.energy.mode === "external-calibrated-cumulative-joules"
    && config.energy.minimum_interval_uncertainty_j <= 0
  ) fail("INVALID_CONFIG", "measured energy requires a positive absolute uncertainty floor");
  exactObject(config.authority, ["development_only", "claim_eligible", "scientific_result"], "authority", "INVALID_CONFIG");
  if (
    config.authority.development_only !== true
    || config.authority.claim_eligible !== false
    || config.authority.scientific_result !== false
  ) fail("INVALID_CONFIG", "development config cannot grant authority");
  return config;
}

function u32(label) {
  return Number.parseInt(sha256(label).slice(0, 8), 16) >>> 0;
}

function shuffled(count, label) {
  const result = Array.from({ length: count }, (_, index) => index);
  let state = u32(label) || 0x9e37_79b9;
  const random = () => {
    state += 0x6d2b_79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x1_0000_0000;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function orders(count, label) {
  const candidateFirst = u32(label) % 2 === 0;
  return Array.from({ length: count }, (_, index) => {
    const lead = index % 2 === 0 ? candidateFirst : !candidateFirst;
    return lead ? ["candidate", "baseline"] : ["baseline", "candidate"];
  });
}

export function buildFixture012WorkstationSchedule(config) {
  validateFixture012WorkstationConfig(config);
  const schedule = [];
  for (let study = 0; study < config.studies; study += 1) {
    const layoutIds = shuffled(config.layouts_per_study, `${config.schedule_seed}\0${study}\0layouts`);
    for (let layoutSlot = 0; layoutSlot < layoutIds.length; layoutSlot += 1) {
      const layoutId = layoutIds[layoutSlot];
      const layoutSeed = u32(`${config.schedule_seed}\0${study}\0${layoutId}\0seed`);
      const baselineFirst = (study + layoutSlot) % 2 === 0;
      const body = {
        work_unit_id: `study-${String(study).padStart(4, "0")}-layout-${String(layoutId).padStart(4, "0")}`,
        study,
        layout_slot: layoutSlot,
        layout_id: layoutId,
        layout_seed: layoutSeed,
        build_order: baselineFirst ? [...VARIANTS] : [...VARIANTS].reverse(),
        warmup_orders: orders(config.warmup_pairs_per_layout, `${layoutSeed}\0warmup`),
        measurement_orders: orders(config.measurement_pairs_per_layout, `${layoutSeed}\0measure`),
      };
      schedule.push({ ...body, schedule_sha256: sha256(canonical(body)) });
    }
  }
  return Object.freeze(schedule.map(Object.freeze));
}

export function validateTrustedInputManifest(manifest) {
  exactObject(manifest, [
    "schema", "artifact", "contract_version", "workload_id", "files",
  ], "trusted input manifest", "INVALID_INPUT_MANIFEST");
  if (
    manifest.schema !== 1
    || manifest.artifact !== "fixture-012"
    || manifest.contract_version !== "fixture-012.trusted-input-manifest.v1"
    || !/^[a-z0-9][a-z0-9._-]+$/.test(manifest.workload_id ?? "")
  ) fail("INVALID_INPUT_MANIFEST", "trusted input manifest identity is invalid");
  if (!Array.isArray(manifest.files) || manifest.files.length < 3) {
    fail("INVALID_INPUT_MANIFEST", "trusted input manifest requires workload, input, and reference files");
  }
  const roles = new Set();
  const paths = new Set();
  for (const [index, file] of manifest.files.entries()) {
    exactObject(file, ["role", "path", "sha256"], `trusted file[${index}]`, "INVALID_INPUT_MANIFEST");
    if (!new Set(["workload", "input", "reference", "support"]).has(file.role)) {
      fail("INVALID_INPUT_MANIFEST", "trusted file role is invalid");
    }
    if (path.isAbsolute(file.path) || file.path.includes("..") || file.path.includes("\0")) {
      fail("INVALID_INPUT_MANIFEST", "trusted file path must be repository-relative");
    }
    digest(file.sha256, "trusted file SHA-256", "INVALID_INPUT_MANIFEST");
    if (paths.has(file.path)) fail("INVALID_INPUT_MANIFEST", "trusted manifest repeats a path");
    paths.add(file.path);
    roles.add(file.role);
  }
  for (const role of ["workload", "input", "reference"]) {
    if (!roles.has(role)) fail("INVALID_INPUT_MANIFEST", `trusted manifest lacks ${role}`);
  }
  return manifest;
}

export function validateNormalizedLayoutManifest(manifest, expected = {}) {
  exactObject(manifest, [
    "schema", "contract_version", "artifact", "variant", "layout_seed", "sections", "symbols",
  ], "normalized layout manifest", "INVALID_LAYOUT_MANIFEST");
  if (
    manifest.schema !== 1
    || manifest.contract_version !== FIXTURE_012_LAYOUT_MANIFEST_VERSION
    || manifest.artifact !== "fixture-012"
    || !VARIANTS.includes(manifest.variant)
    || !Number.isInteger(manifest.layout_seed)
    || manifest.layout_seed < 0
    || manifest.layout_seed > 0xffff_ffff
    || (expected.variant !== undefined && manifest.variant !== expected.variant)
    || (expected.layout_seed !== undefined && manifest.layout_seed !== expected.layout_seed)
  ) fail("INVALID_LAYOUT_MANIFEST", "layout manifest identity is invalid");
  if (!Array.isArray(manifest.sections) || manifest.sections.length === 0) {
    fail("INVALID_LAYOUT_MANIFEST", "layout manifest requires sections");
  }
  if (!Array.isArray(manifest.symbols) || manifest.symbols.length === 0) {
    fail("INVALID_LAYOUT_MANIFEST", "layout manifest requires symbols");
  }
  const sectionNames = new Set();
  const symbolNames = new Set();
  for (const [kind, values, keys] of [
    ["section", manifest.sections, ["name", "ordinal", "size_bytes", "content_sha256"]],
    ["symbol", manifest.symbols, ["name_sha256", "section", "ordinal", "size_bytes"]],
  ]) {
    for (const [index, value] of values.entries()) {
      exactObject(value, keys, `${kind}[${index}]`, "INVALID_LAYOUT_MANIFEST");
      positiveInteger(value.size_bytes, `${kind} size`, "INVALID_LAYOUT_MANIFEST");
      nonNegativeInteger(value.ordinal, `${kind} ordinal`, "INVALID_LAYOUT_MANIFEST");
      if (value.ordinal !== index) fail("INVALID_LAYOUT_MANIFEST", `${kind} ordinals must be contiguous and normalized`);
      if (kind === "section") {
        nonEmpty(value.name, "section name", "INVALID_LAYOUT_MANIFEST");
        digest(value.content_sha256, "section content digest", "INVALID_LAYOUT_MANIFEST");
        if (sectionNames.has(value.name)) fail("INVALID_LAYOUT_MANIFEST", "section names must be unique");
        sectionNames.add(value.name);
      } else {
        digest(value.name_sha256, "symbol name digest", "INVALID_LAYOUT_MANIFEST");
        nonEmpty(value.section, "symbol section", "INVALID_LAYOUT_MANIFEST");
        if (symbolNames.has(value.name_sha256)) fail("INVALID_LAYOUT_MANIFEST", "symbol identities must be unique");
        symbolNames.add(value.name_sha256);
        if (!manifest.sections.some((section) => section.name === value.section)) {
          fail("INVALID_LAYOUT_MANIFEST", "symbol names an unknown section");
        }
      }
    }
  }
  return manifest;
}

export function fixture012LayoutStructureSha256(manifest) {
  validateNormalizedLayoutManifest(manifest);
  return sha256(canonical({
    sections: manifest.sections.map(({ name, ordinal, size_bytes: sizeBytes }) => ({
      name,
      ordinal,
      size_bytes: sizeBytes,
    })),
    symbols: manifest.symbols,
  }));
}

function assertProcessAttempt(value, label) {
  exactObject(value, [
    "schema", "contract_version", "command_role", "command_sha256", "executable_sha256",
    "monotonic_started_ns", "monotonic_ended_ns", "exit_code", "signal", "timed_out",
    "termination", "stdout_sha256", "stderr_sha256", "stdout_bytes", "stderr_bytes",
  ], label, "INVALID_ATTEMPT");
  if (value.schema !== 1 || value.contract_version !== FIXTURE_012_PROCESS_ATTEMPT_VERSION) {
    fail("INVALID_ATTEMPT", `${label} contract identity is invalid`);
  }
  nonEmpty(value.command_role, `${label}.command_role`, "INVALID_ATTEMPT");
  digest(value.command_sha256, `${label}.command_sha256`, "INVALID_ATTEMPT");
  digest(value.executable_sha256, `${label}.executable_sha256`, "INVALID_ATTEMPT");
  const start = ns(value.monotonic_started_ns, `${label}.start`, "INVALID_ATTEMPT");
  const end = ns(value.monotonic_ended_ns, `${label}.end`, "INVALID_ATTEMPT");
  if (end <= start) fail("INVALID_ATTEMPT", `${label} interval did not advance`);
  if (!(value.exit_code === null || Number.isInteger(value.exit_code))) fail("INVALID_ATTEMPT", `${label} exit code is invalid`);
  if (!(value.signal === null || typeof value.signal === "string")) fail("INVALID_ATTEMPT", `${label} signal is invalid`);
  if (typeof value.timed_out !== "boolean") fail("INVALID_ATTEMPT", `${label} timeout flag is invalid`);
  if (!new Set(["natural-exit", "posix-process-group-terminated", "fixture-direct-child-terminated", "windows-job-terminated"]).has(value.termination)) {
    fail("INVALID_ATTEMPT", `${label} termination contract is invalid`);
  }
  digest(value.stdout_sha256, `${label}.stdout_sha256`, "INVALID_ATTEMPT");
  digest(value.stderr_sha256, `${label}.stderr_sha256`, "INVALID_ATTEMPT");
  nonNegativeInteger(value.stdout_bytes, `${label}.stdout_bytes`, "INVALID_ATTEMPT");
  nonNegativeInteger(value.stderr_bytes, `${label}.stderr_bytes`, "INVALID_ATTEMPT");
  return value;
}

function assertAdapterBinding(binding) {
  exactObject(binding, [
    "schema", "adapter_id", "adapter_version", "fixture_only", "source_locator",
    "source_sha256", "config_locator", "config_sha256", "effective_environment", "environment_sha256",
    "commands", "process_supervisor", "trusted_inputs",
  ], "adapter binding", "INVALID_ADAPTER");
  if (binding.schema !== 1 || typeof binding.fixture_only !== "boolean") fail("INVALID_ADAPTER", "adapter binding identity is invalid");
  nonEmpty(binding.adapter_id, "adapter ID", "INVALID_ADAPTER");
  nonEmpty(binding.adapter_version, "adapter version", "INVALID_ADAPTER");
  digest(binding.source_sha256, "adapter source digest", "INVALID_ADAPTER");
  digest(binding.config_sha256, "adapter config digest", "INVALID_ADAPTER");
  if (!(binding.source_locator === null || typeof binding.source_locator === "string")) fail("INVALID_ADAPTER", "adapter source locator is invalid");
  if (!(binding.config_locator === null || typeof binding.config_locator === "string")) fail("INVALID_ADAPTER", "adapter config locator is invalid");
  exactObject(binding.effective_environment, Object.keys(binding.effective_environment), "effective environment", "INVALID_ADAPTER");
  if (Object.entries(binding.effective_environment).some(([key, value]) => !/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || typeof value !== "string")) {
    fail("INVALID_ADAPTER", "effective environment is invalid");
  }
  if (binding.environment_sha256 !== sha256(canonical(binding.effective_environment))) {
    fail("INVALID_ADAPTER", "effective environment digest is invalid");
  }
  if (!Array.isArray(binding.commands)) fail("INVALID_ADAPTER", "command bindings must be an array");
  const commandRoles = new Set();
  for (const [index, command] of binding.commands.entries()) {
    exactObject(command, [
      "role", "executable_path", "executable_sha256", "version_args",
      "version_stdout_sha256", "command_identity_sha256",
    ], `command binding[${index}]`, "INVALID_ADAPTER");
    nonEmpty(command.role, "command role", "INVALID_ADAPTER");
    if (commandRoles.has(command.role)) fail("INVALID_ADAPTER", "command roles must be unique");
    commandRoles.add(command.role);
    nonEmpty(command.executable_path, "command path", "INVALID_ADAPTER");
    digest(command.executable_sha256, "command executable digest", "INVALID_ADAPTER");
    if (!Array.isArray(command.version_args) || command.version_args.some((arg) => typeof arg !== "string")) {
      fail("INVALID_ADAPTER", "command version args are invalid");
    }
    digest(command.version_stdout_sha256, "command version digest", "INVALID_ADAPTER");
    const identity = sha256(canonical({
      role: command.role,
      executable_path: command.executable_path,
      executable_sha256: command.executable_sha256,
      version_args: command.version_args,
      version_stdout_sha256: command.version_stdout_sha256,
    }));
    if (command.command_identity_sha256 !== identity) fail("INVALID_ADAPTER", "command identity digest is invalid");
  }
  if (binding.process_supervisor !== null) {
    exactObject(binding.process_supervisor, [
      "protocol_version", "host_executable_path", "host_executable_sha256",
      "version_stdout_sha256", "harness_locator", "harness_sha256",
      "source_locator", "source_sha256", "assembly_path", "assembly_sha256",
      "identity_sha256",
    ], "process supervisor binding", "INVALID_ADAPTER");
    for (const key of ["protocol_version", "host_executable_path", "harness_locator", "source_locator", "assembly_path"]) {
      nonEmpty(binding.process_supervisor[key], `process supervisor ${key}`, "INVALID_ADAPTER");
    }
    for (const key of [
      "host_executable_sha256", "version_stdout_sha256", "harness_sha256",
      "source_sha256", "assembly_sha256", "identity_sha256",
    ]) digest(binding.process_supervisor[key], `process supervisor ${key}`, "INVALID_ADAPTER");
    const supervisorBody = { ...binding.process_supervisor };
    delete supervisorBody.identity_sha256;
    if (binding.process_supervisor.identity_sha256 !== sha256(canonical(supervisorBody))) {
      fail("INVALID_ADAPTER", "process supervisor identity digest is invalid");
    }
  }
  exactObject(binding.trusted_inputs, ["manifest_path", "manifest_sha256", "manifest"], "adapter trusted inputs", "INVALID_ADAPTER");
  validateTrustedInputManifest(binding.trusted_inputs.manifest);
  if (binding.trusted_inputs.manifest_sha256 !== sha256(canonical(binding.trusted_inputs.manifest))) {
    fail("INVALID_ADAPTER", "trusted manifest binding digest is invalid");
  }
  return binding;
}

function assertAdapter(adapter, config, allowFixtureAdapter) {
  exactObject(adapter, ADAPTER_KEYS, "adapter", "INVALID_ADAPTER");
  assertAdapterBinding(adapter.binding);
  if (adapter.binding.fixture_only && !allowFixtureAdapter) fail("FIXTURE_ADAPTER_REFUSED", "physical CLI refuses fixture adapter");
  for (const method of ["prepare", "build", "captureTelemetry", "execute"]) {
    if (typeof adapter[method] !== "function") fail("INVALID_ADAPTER", `adapter.${method} is not callable`);
  }
  if (config.energy.mode === "latency-only") {
    if (adapter.readEnergy !== null) fail("ENERGY_BOUNDARY", "latency-only adapter exposes energy reader");
  } else if (typeof adapter.readEnergy !== "function") {
    fail("ENERGY_BOUNDARY", "external energy mode lacks provider reader");
  }
  return adapter;
}

function assertPreparation(value, config, binding) {
  exactObject(value, ["schema", "machine", "clock", "telemetry", "energy", "binding_sha256"], "preparation", "INVALID_PREFLIGHT");
  if (value.schema !== 1 || value.binding_sha256 !== sha256(canonical(binding))) fail("INVALID_PREFLIGHT", "preflight binding is invalid");
  exactObject(value.machine, ["host_fingerprint_sha256", "platform", "platform_release", "architecture", "cpu_model", "logical_cpus", "memory_bytes", "runtime"], "machine", "INVALID_PREFLIGHT");
  digest(value.machine.host_fingerprint_sha256, "host fingerprint", "INVALID_PREFLIGHT");
  for (const key of ["platform", "platform_release", "architecture", "cpu_model", "runtime"]) nonEmpty(value.machine[key], key, "INVALID_PREFLIGHT");
  positiveInteger(value.machine.logical_cpus, "logical CPUs", "INVALID_PREFLIGHT");
  positiveInteger(value.machine.memory_bytes, "memory", "INVALID_PREFLIGHT");
  exactObject(value.clock, ["source", "monotonic", "measurement_boundary"], "clock", "INVALID_PREFLIGHT");
  const expectedClockSource = binding.fixture_only === false && binding.process_supervisor !== null
    ? "windows:QueryPerformanceCounter"
    : "node:process.hrtime.bigint";
  if (value.clock.source !== expectedClockSource || value.clock.monotonic !== true || value.clock.measurement_boundary !== config.measurement_boundary) {
    fail("INVALID_PREFLIGHT", "clock boundary is invalid");
  }
  exactObject(value.telemetry, ["thermal_sensor_ids", "frequency_sensor_ids"], "telemetry inventory", "INVALID_PREFLIGHT");
  uniqueStrings(value.telemetry.thermal_sensor_ids, "thermal inventory");
  uniqueStrings(value.telemetry.frequency_sensor_ids, "frequency inventory");
  for (const id of config.thermal.required_sensor_ids) if (!value.telemetry.thermal_sensor_ids.includes(id)) fail("INVALID_PREFLIGHT", `thermal sensor unavailable: ${id}`);
  for (const id of config.frequency.required_sensor_ids) if (!value.telemetry.frequency_sensor_ids.includes(id)) fail("INVALID_PREFLIGHT", `frequency sensor unavailable: ${id}`);
  if (config.energy.mode === "latency-only") {
    exactObject(value.energy, ["mode"], "energy preflight", "INVALID_PREFLIGHT");
    if (value.energy.mode !== "none") fail("INVALID_PREFLIGHT", "latency-only preflight names provider");
  } else {
    exactObject(value.energy, [
      "mode", "provider_id", "provider_serial", "calibration_certificate_path",
      "calibration_certificate_sha256", "calibration_valid_until", "uncertainty_fraction",
    ], "energy preflight", "INVALID_PREFLIGHT");
    if (value.energy.mode !== config.energy.mode) fail("INVALID_PREFLIGHT", "energy mode mismatch");
    nonEmpty(value.energy.provider_id, "provider ID", "INVALID_PREFLIGHT");
    nonEmpty(value.energy.provider_serial, "provider serial", "INVALID_PREFLIGHT");
    nonEmpty(value.energy.calibration_certificate_path, "calibration certificate path", "INVALID_PREFLIGHT");
    digest(value.energy.calibration_certificate_sha256, "calibration certificate digest", "INVALID_PREFLIGHT");
    exactUtc(value.energy.calibration_valid_until, "calibration expiry", "INVALID_PREFLIGHT");
    if (Date.parse(value.energy.calibration_valid_until) <= Date.now()) fail("INVALID_PREFLIGHT", "calibration expired");
    finite(value.energy.uncertainty_fraction, "calibration uncertainty", "INVALID_PREFLIGHT");
    if (value.energy.uncertainty_fraction <= 0 || value.energy.uncertainty_fraction >= 1) fail("INVALID_PREFLIGHT", "calibration uncertainty fraction is invalid");
  }
  return value;
}

function assertTelemetry(value, preparation, config, label) {
  exactObject(value, ["schema", "captured_at_utc", "monotonic_ns", "thermal_c", "frequency_hz", "raw_sha256", "attempt"], label, "INVALID_TELEMETRY");
  if (value.schema !== 1) fail("INVALID_TELEMETRY", `${label}.schema is invalid`);
  exactUtc(value.captured_at_utc, `${label}.captured_at_utc`, "INVALID_TELEMETRY");
  ns(value.monotonic_ns, `${label}.monotonic_ns`, "INVALID_TELEMETRY");
  digest(value.raw_sha256, `${label}.raw_sha256`, "INVALID_TELEMETRY");
  assertProcessAttempt(value.attempt, `${label}.attempt`);
  exactObject(value.thermal_c, preparation.telemetry.thermal_sensor_ids, `${label}.thermal_c`, "INVALID_TELEMETRY");
  exactObject(value.frequency_hz, preparation.telemetry.frequency_sensor_ids, `${label}.frequency_hz`, "INVALID_TELEMETRY");
  for (const id of preparation.telemetry.thermal_sensor_ids) finite(value.thermal_c[id], `${label}.${id}`, "INVALID_TELEMETRY");
  for (const id of preparation.telemetry.frequency_sensor_ids) positiveInteger(value.frequency_hz[id], `${label}.${id}`, "INVALID_TELEMETRY");
  for (const id of config.thermal.required_sensor_ids) if (value.thermal_c[id] < config.thermal.minimum_c || value.thermal_c[id] > config.thermal.maximum_c) fail("THERMAL_BOUNDARY", `${id} outside admitted interval`);
  for (const id of config.frequency.required_sensor_ids) if (value.frequency_hz[id] < config.frequency.minimum_hz) fail("FREQUENCY_BOUNDARY", `${id} below minimum`);
  return value;
}

function assertTelemetryPair(before, after, config) {
  if (ns(after.monotonic_ns, "telemetry after") <= ns(before.monotonic_ns, "telemetry before")) fail("INVALID_CLOCK", "telemetry time did not advance");
  for (const id of config.thermal.required_sensor_ids) if (Math.abs(after.thermal_c[id] - before.thermal_c[id]) > config.thermal.maximum_pair_drift_c) fail("THERMAL_BOUNDARY", `${id} drift too large`);
  for (const id of config.frequency.required_sensor_ids) {
    const drift = Math.abs(after.frequency_hz[id] - before.frequency_hz[id]) / Math.max(after.frequency_hz[id], before.frequency_hz[id]);
    if (drift > config.frequency.maximum_pair_relative_drift) fail("FREQUENCY_BOUNDARY", `${id} drift too large`);
  }
}

function assertEnergySnapshot(value, label) {
  exactObject(value, ["schema", "captured_at_utc", "monotonic_ns", "cumulative_j", "raw_uncertainty_j", "raw_sha256", "attempt"], label, "INVALID_ENERGY");
  if (value.schema !== 1) fail("INVALID_ENERGY", `${label}.schema is invalid`);
  exactUtc(value.captured_at_utc, `${label}.captured_at_utc`, "INVALID_ENERGY");
  ns(value.monotonic_ns, `${label}.monotonic_ns`, "INVALID_ENERGY");
  finite(value.cumulative_j, `${label}.cumulative_j`, "INVALID_ENERGY");
  finite(value.raw_uncertainty_j, `${label}.raw_uncertainty_j`, "INVALID_ENERGY");
  if (value.cumulative_j < 0 || value.raw_uncertainty_j < 0) fail("INVALID_ENERGY", `${label} contains negative values`);
  digest(value.raw_sha256, `${label}.raw_sha256`, "INVALID_ENERGY");
  assertProcessAttempt(value.attempt, `${label}.attempt`);
  return value;
}

function assertExecution(value, config, label) {
  exactObject(value, ["schema", "status", "stdout_sha256", "stderr_sha256", "correctness_sha256", "attempt"], label, "INVALID_EXECUTION");
  if (value.schema !== 1 || value.status !== "ok") fail("EXECUTION_FAILURE", `${label} failed`, undefined, value.attempt ?? null);
  for (const key of ["stdout_sha256", "stderr_sha256", "correctness_sha256"]) digest(value[key], `${label}.${key}`, "INVALID_EXECUTION");
  assertProcessAttempt(value.attempt, `${label}.attempt`);
  if (value.attempt.exit_code !== 0 || value.attempt.timed_out || value.attempt.termination !== "natural-exit") fail("EXECUTION_FAILURE", `${label} did not exit naturally`, undefined, value.attempt);
  if (value.stdout_sha256 !== config.correctness.expected_stdout_sha256 || value.correctness_sha256 !== config.correctness.expected_stdout_sha256) fail("CORRECTNESS_FAILURE", `${label} output digest is wrong`, undefined, value.attempt);
  return value;
}

function assertBuild(value, expected, label) {
  exactObject(value, [
    "schema", "variant", "layout_seed", "artifact_locator", "executable_sha256",
    "executable_version_stdout_sha256", "executable_version_attempt", "artifact_command_identity_sha256",
    "layout_manifest_locator", "layout_manifest_sha256", "layout_manifest",
    "layout_structure_sha256", "build_log_sha256", "attempt",
  ], label, "INVALID_BUILD");
  if (value.schema !== 1 || value.variant !== expected.variant || value.layout_seed !== expected.layout_seed) fail("INVALID_BUILD", `${label} identity mismatch`);
  nonEmpty(value.artifact_locator, `${label}.artifact_locator`, "INVALID_BUILD");
  nonEmpty(value.layout_manifest_locator, `${label}.layout_manifest_locator`, "INVALID_BUILD");
  for (const key of ["executable_sha256", "layout_manifest_sha256", "layout_structure_sha256", "build_log_sha256"]) digest(value[key], `${label}.${key}`, "INVALID_BUILD");
  digest(value.executable_version_stdout_sha256, `${label}.executable_version_stdout_sha256`, "INVALID_BUILD");
  digest(value.artifact_command_identity_sha256, `${label}.artifact_command_identity_sha256`, "INVALID_BUILD");
  assertProcessAttempt(value.executable_version_attempt, `${label}.executable_version_attempt`);
  if (
    value.executable_version_attempt.exit_code !== 0
    || value.executable_version_attempt.timed_out
    || value.executable_version_attempt.termination !== "natural-exit"
    || value.executable_version_attempt.stdout_sha256 !== value.executable_version_stdout_sha256
  ) fail("INVALID_BUILD", `${label} artifact version probe failed`);
  const artifactIdentity = sha256(canonical({
    artifact_locator: value.artifact_locator,
    executable_sha256: value.executable_sha256,
    executable_version_stdout_sha256: value.executable_version_stdout_sha256,
  }));
  if (value.artifact_command_identity_sha256 !== artifactIdentity) fail("INVALID_BUILD", `${label} artifact command identity mismatch`);
  validateNormalizedLayoutManifest(value.layout_manifest, expected);
  if (value.layout_manifest_sha256 !== sha256(canonical(value.layout_manifest))) fail("INVALID_BUILD", `${label} manifest digest mismatch`);
  const structure = fixture012LayoutStructureSha256(value.layout_manifest);
  if (value.layout_structure_sha256 !== structure) fail("INVALID_BUILD", `${label} structural proof mismatch`);
  assertProcessAttempt(value.attempt, `${label}.attempt`);
  if (value.attempt.exit_code !== 0 || value.attempt.timed_out || value.attempt.termination !== "natural-exit") fail("INVALID_BUILD", `${label} build did not exit naturally`, undefined, value.attempt);
  return value;
}

function validateWithRetainedAttempt(value, validation) {
  try {
    return validation(value);
  } catch (error) {
    if (error && error.attempt == null && value?.attempt) error.attempt = value.attempt;
    throw error;
  }
}

async function observation({ adapter, config, preparation, workUnit, artifacts, phase, pair, variant, orderPosition }) {
  const context = { work_unit: workUnit, artifact: artifacts[variant], phase, pair, variant, order_position: orderPosition, timeout_ms: config.timeout_ms };
  const beforeValue = await adapter.captureTelemetry(context);
  const before = validateWithRetainedAttempt(beforeValue, (value) => assertTelemetry(value, preparation, config, "telemetry before"));
  const energyBeforeValue = config.energy.mode === "latency-only" ? null : await adapter.readEnergy(context);
  const energyBefore = energyBeforeValue === null ? null : validateWithRetainedAttempt(energyBeforeValue, (value) => assertEnergySnapshot(value, "energy before"));
  const executionValue = await adapter.execute(context);
  const execution = validateWithRetainedAttempt(executionValue, (value) => assertExecution(value, config, "execution"));
  const energyAfterValue = config.energy.mode === "latency-only" ? null : await adapter.readEnergy(context);
  const energyAfter = energyAfterValue === null ? null : validateWithRetainedAttempt(energyAfterValue, (value) => assertEnergySnapshot(value, "energy after"));
  const afterValue = await adapter.captureTelemetry(context);
  const after = validateWithRetainedAttempt(afterValue, (value) => assertTelemetry(value, preparation, config, "telemetry after"));
  try {
    assertTelemetryPair(before, after, config);
  } catch (error) {
    if (error && error.attempt == null) error.attempt = after.attempt;
    throw error;
  }
  const start = ns(execution.attempt.monotonic_started_ns, "execution start");
  const end = ns(execution.attempt.monotonic_ended_ns, "execution end");
  if (ns(before.monotonic_ns, "telemetry before") > start || ns(after.monotonic_ns, "telemetry after") < end) fail("INVALID_CLOCK", "telemetry samples do not enclose process launch-to-exit", undefined, after.attempt);
  let energy;
  if (config.energy.mode === "latency-only") {
    energy = { mode: "latency-only", measured_j: null, raw_uncertainty_j: null, uncertainty_floor_j: null, uncertainty_j: null, before: null, after: null };
  } else {
    const energyStart = ns(energyBefore.monotonic_ns, "energy before");
    const energyEnd = ns(energyAfter.monotonic_ns, "energy after");
    if (energyStart > start || energyEnd < end || energyEnd <= energyStart) fail("ENERGY_BOUNDARY", "meter samples do not enclose launch-to-exit", undefined, energyAfter.attempt);
    const measured = energyAfter.cumulative_j - energyBefore.cumulative_j;
    if (measured < 0) fail("ENERGY_BOUNDARY", "cumulative energy decreased", undefined, energyAfter.attempt);
    const rawUncertainty = energyBefore.raw_uncertainty_j + energyAfter.raw_uncertainty_j;
    const floor = Math.max(config.energy.minimum_interval_uncertainty_j, Math.abs(measured) * preparation.energy.uncertainty_fraction);
    energy = {
      mode: config.energy.mode,
      measured_j: measured,
      raw_uncertainty_j: rawUncertainty,
      uncertainty_floor_j: floor,
      uncertainty_j: Math.max(rawUncertainty, floor),
      before: energyBefore,
      after: energyAfter,
    };
  }
  const latency = end - start;
  if (latency > BigInt(Number.MAX_SAFE_INTEGER)) fail("INVALID_CLOCK", "latency exceeds safe integer range");
  return {
    schema: 1,
    phase,
    analysis_role: phase === "warmup" ? "excluded-warmup" : "latency-observation",
    pair,
    variant,
    order_position: orderPosition,
    monotonic_started_ns: start.toString(),
    monotonic_ended_ns: end.toString(),
    latency_ns: Number(latency),
    telemetry_before: before,
    telemetry_after: after,
    execution,
    energy,
  };
}

function recordBody(record) {
  const { record_sha256: ignored, ...body } = record;
  void ignored;
  return body;
}

function validateWorkUnit(workUnit) {
  exactObject(workUnit, ["work_unit_id", "study", "layout_slot", "layout_id", "layout_seed", "build_order", "warmup_orders", "measurement_orders", "schedule_sha256"], "work unit", "INVALID_LEDGER");
  const { schedule_sha256: actual, ...body } = workUnit;
  if (actual !== sha256(canonical(body))) fail("INVALID_LEDGER", "work-unit schedule digest mismatch");
  return workUnit;
}

function validateEnergyRecord(value, config, preparation, label) {
  exactObject(value, ["mode", "measured_j", "raw_uncertainty_j", "uncertainty_floor_j", "uncertainty_j", "before", "after"], label, "INVALID_ENERGY");
  if (config.energy.mode === "latency-only") {
    if (value.mode !== "latency-only" || [value.measured_j, value.raw_uncertainty_j, value.uncertainty_floor_j, value.uncertainty_j, value.before, value.after].some((item) => item !== null)) fail("ENERGY_BOUNDARY", `${label} asserts latency-only joules`);
    return;
  }
  if (value.mode !== config.energy.mode) fail("ENERGY_BOUNDARY", `${label} mode mismatch`);
  assertEnergySnapshot(value.before, `${label}.before`);
  assertEnergySnapshot(value.after, `${label}.after`);
  const measured = value.after.cumulative_j - value.before.cumulative_j;
  const raw = value.before.raw_uncertainty_j + value.after.raw_uncertainty_j;
  const floor = Math.max(config.energy.minimum_interval_uncertainty_j, Math.abs(measured) * preparation.energy.uncertainty_fraction);
  if (value.measured_j !== measured || value.raw_uncertainty_j !== raw || value.uncertainty_floor_j !== floor || value.uncertainty_j !== Math.max(raw, floor)) fail("ENERGY_BOUNDARY", `${label} uncertainty or delta binding is invalid`);
}

function validateObservation(value, config, preparation, label) {
  exactObject(value, ["schema", "phase", "analysis_role", "pair", "variant", "order_position", "monotonic_started_ns", "monotonic_ended_ns", "latency_ns", "telemetry_before", "telemetry_after", "execution", "energy"], label, "INVALID_LEDGER");
  if (value.schema !== 1 || !["warmup", "measure"].includes(value.phase) || value.analysis_role !== (value.phase === "warmup" ? "excluded-warmup" : "latency-observation") || !VARIANTS.includes(value.variant) || ![0, 1].includes(value.order_position)) fail("INVALID_LEDGER", `${label} identity invalid`);
  nonNegativeInteger(value.pair, `${label}.pair`, "INVALID_LEDGER");
  const start = ns(value.monotonic_started_ns, `${label}.start`, "INVALID_LEDGER");
  const end = ns(value.monotonic_ended_ns, `${label}.end`, "INVALID_LEDGER");
  positiveInteger(value.latency_ns, `${label}.latency`, "INVALID_LEDGER");
  if (end - start !== BigInt(value.latency_ns)) fail("INVALID_LEDGER", `${label} latency mismatch`);
  assertExecution(value.execution, config, `${label}.execution`);
  if (value.execution.attempt.monotonic_started_ns !== value.monotonic_started_ns || value.execution.attempt.monotonic_ended_ns !== value.monotonic_ended_ns) fail("INVALID_LEDGER", `${label} launcher timestamp mismatch`);
  assertTelemetry(value.telemetry_before, preparation, config, `${label}.telemetry_before`);
  assertTelemetry(value.telemetry_after, preparation, config, `${label}.telemetry_after`);
  assertTelemetryPair(value.telemetry_before, value.telemetry_after, config);
  if (
    ns(value.telemetry_before.monotonic_ns, `${label}.telemetry_before.monotonic_ns`) > start
    || ns(value.telemetry_after.monotonic_ns, `${label}.telemetry_after.monotonic_ns`) < end
  ) fail("INVALID_CLOCK", `${label} telemetry does not enclose process launch-to-exit`);
  validateEnergyRecord(value.energy, config, preparation, `${label}.energy`);
  if (config.energy.mode !== "latency-only") {
    const energyStart = ns(value.energy.before.monotonic_ns, `${label}.energy.before.monotonic_ns`);
    const energyEnd = ns(value.energy.after.monotonic_ns, `${label}.energy.after.monotonic_ns`);
    if (energyStart > start || energyEnd < end || energyEnd <= energyStart) {
      fail("ENERGY_BOUNDARY", `${label} energy samples do not enclose process launch-to-exit`);
    }
  }
  return value;
}

function observationPlan(orders, phase) {
  return orders.flatMap((order, pair) => order.map((variant, orderPosition) => ({
    phase,
    pair,
    variant,
    order_position: orderPosition,
  })));
}

function validateObservationPrefix(values, plan, config, preparation, label) {
  if (values.length > plan.length) fail("SCHEDULE_SEQUENCE_MISMATCH", `${label} exceeds its frozen schedule`);
  for (const [index, value] of values.entries()) {
    validateObservation(value, config, preparation, `${label}[${index}]`);
    const expected = plan[index];
    if (
      value.phase !== expected.phase
      || value.pair !== expected.pair
      || value.variant !== expected.variant
      || value.order_position !== expected.order_position
    ) fail("SCHEDULE_SEQUENCE_MISMATCH", `${label}[${index}] differs from the frozen schedule`);
  }
}

export function assertFixture012WorkstationRecord(record, context = {}) {
  exactObject(record, ["schema", "contract_version", "runner_version", "artifact", "lane", "run_id", "sequence", "previous_sha256", "work_unit", "status", "adapter_binding_sha256", "builds", "warmups", "measurements", "checks", "failure", "claim_eligible", "scientific_result", "energy_claim_eligible", "record_sha256"], "ledger record", "INVALID_LEDGER");
  if (record.schema !== 1 || record.contract_version !== FIXTURE_012_WORKSTATION_LEDGER_VERSION || record.runner_version !== FIXTURE_012_WORKSTATION_RUNNER_VERSION || record.artifact !== "fixture-012" || record.lane !== "workstation-development" || !["complete", "rejected"].includes(record.status) || record.claim_eligible !== false || record.scientific_result !== false || record.energy_claim_eligible !== false) fail("INVALID_LEDGER", "record identity or authority invalid");
  digest(record.run_id, "record run ID", "INVALID_LEDGER");
  digest(record.previous_sha256, "previous hash", "INVALID_LEDGER");
  digest(record.adapter_binding_sha256, "adapter binding hash", "INVALID_LEDGER");
  digest(record.record_sha256, "record hash", "INVALID_LEDGER");
  nonNegativeInteger(record.sequence, "record sequence", "INVALID_LEDGER");
  if (context.runId && record.run_id !== context.runId) fail("INVALID_LEDGER", "run ID mismatch");
  if (context.sequence !== undefined && record.sequence !== context.sequence) fail("INVALID_LEDGER", "sequence is not contiguous");
  if (context.previousHash && record.previous_sha256 !== context.previousHash) fail("INVALID_LEDGER", "hash chain is broken");
  if (record.record_sha256 !== sha256(canonical(recordBody(record)))) fail("INVALID_LEDGER", "record digest mismatch");
  validateWorkUnit(record.work_unit);
  if (!Array.isArray(record.builds) || !Array.isArray(record.warmups) || !Array.isArray(record.measurements)) fail("INVALID_LEDGER", "record arrays missing");
  if (context.config && context.preparation) {
    if (record.builds.length > record.work_unit.build_order.length) fail("SCHEDULE_SEQUENCE_MISMATCH", "builds exceed the frozen schedule");
    for (const [index, build] of record.builds.entries()) {
      assertBuild(build, {
        variant: record.work_unit.build_order[index],
        layout_seed: record.work_unit.layout_seed,
      }, `build[${index}]`);
    }
    validateObservationPrefix(
      record.warmups,
      observationPlan(record.work_unit.warmup_orders, "warmup"),
      context.config,
      context.preparation,
      "warmup",
    );
    validateObservationPrefix(
      record.measurements,
      observationPlan(record.work_unit.measurement_orders, "measure"),
      context.config,
      context.preparation,
      "measurement",
    );
  }
  exactObject(record.checks, ["builds_complete", "layout_proofs_distinct", "warmups_complete", "measurements_complete", "order_counterbalanced", "correctness_complete", "telemetry_complete", "energy_boundary_preserved"], "checks", "INVALID_LEDGER");
  if (Object.values(record.checks).some((value) => typeof value !== "boolean")) fail("INVALID_LEDGER", "checks must be booleans");
  if (record.failure !== null) {
    exactObject(record.failure, ["code", "message", "attempt"], "failure", "INVALID_LEDGER");
    nonEmpty(record.failure.code, "failure code", "INVALID_LEDGER");
    nonEmpty(record.failure.message, "failure message", "INVALID_LEDGER");
    if (record.failure.attempt !== null) assertProcessAttempt(record.failure.attempt, "failure attempt");
  }
  const all = Object.values(record.checks).every(Boolean);
  if ((record.status === "complete") !== (record.failure === null && all)) fail("INVALID_LEDGER", "record status/check/failure mismatch");
  return record;
}

function balanced(values, count) {
  if (values.length !== count * 2) return false;
  const first = values.filter((value) => value.order_position === 0);
  return first.filter((value) => value.variant === "baseline").length === count / 2
    && first.filter((value) => value.variant === "candidate").length === count / 2;
}

async function durableAppend(file, record) {
  const handle = await open(file, "a", 0o600);
  try {
    await handle.writeFile(`${JSON.stringify(record)}\n`, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function stableCreate(file, value) {
  const body = `${JSON.stringify(value, null, 2)}\n`;
  try {
    await writeFile(file, body, { flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    const stored = JSON.parse(await readFile(file, "utf8"));
    if (canonical(stored) !== canonical(value)) fail("RESUME_IDENTITY_MISMATCH", `${path.basename(file)} identity mismatch`);
  }
}

async function replaceDurable(file, value) {
  const temporary = `${file}.tmp-${process.pid}-${Date.now()}`;
  let renamed = false;
  try {
    const handle = await open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(`${JSON.stringify(value, null, 2)}\n`, "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
    await rename(temporary, file);
    renamed = true;
    const finalHandle = await open(file, "r+");
    try { await finalHandle.sync(); } finally { await finalHandle.close(); }
  } finally {
    if (!renamed) await rm(temporary, { force: true });
  }
}

async function readLedger(file, run, config) {
  let raw;
  try { raw = await readFile(file, "utf8"); } catch (error) {
    if (error.code === "ENOENT") return { raw: "", records: [], terminal: ZERO_HASH };
    throw error;
  }
  if (raw.length > 0 && !raw.endsWith("\n")) fail("TORN_LEDGER", "ledger has incomplete trailing record");
  const records = [];
  let previous = ZERO_HASH;
  for (const [sequence, line] of raw.split(/\r?\n/u).filter(Boolean).entries()) {
    const record = JSON.parse(line);
    assertFixture012WorkstationRecord(record, { runId: run.run_id, sequence, previousHash: previous, config, preparation: run.preparation });
    if (record.adapter_binding_sha256 !== sha256(canonical(run.adapter_binding))) fail("INVALID_LEDGER", "record adapter binding mismatch");
    previous = record.record_sha256;
    records.push(record);
  }
  return { raw, records, terminal: previous };
}

function checkpointFor(run, records) {
  const body = {
    schema: 1,
    artifact: "fixture-012",
    contract_version: "fixture-012.checkpoint.v2",
    run_id: run.run_id,
    schedule_sha256: run.schedule_sha256,
    records: records.length,
    completed_layouts: records.filter((record) => record.status === "complete").length,
    terminal_record_sha256: records.at(-1)?.record_sha256 ?? ZERO_HASH,
    completed_work_units_sha256: sha256(canonical(records.filter((record) => record.status === "complete").map((record) => record.work_unit.work_unit_id))),
  };
  return { ...body, checkpoint_sha256: sha256(canonical(body)) };
}

async function checkpointState(file, run, records) {
  let stored;
  try { stored = JSON.parse(await readFile(file, "utf8")); } catch (error) {
    if (error.code === "ENOENT") return { state: "missing", expected: checkpointFor(run, records) };
    throw error;
  }
  exactObject(stored, ["schema", "artifact", "contract_version", "run_id", "schedule_sha256", "records", "completed_layouts", "terminal_record_sha256", "completed_work_units_sha256", "checkpoint_sha256"], "checkpoint", "INVALID_CHECKPOINT");
  const { checkpoint_sha256: actual, ...body } = stored;
  if (actual !== sha256(canonical(body)) || stored.run_id !== run.run_id || stored.schedule_sha256 !== run.schedule_sha256) fail("INVALID_CHECKPOINT", "checkpoint identity or digest invalid");
  if (!Number.isInteger(stored.records) || stored.records < 0 || stored.records > records.length) fail("INVALID_CHECKPOINT", "checkpoint is ahead of ledger");
  const prefixExpected = checkpointFor(run, records.slice(0, stored.records));
  if (canonical(prefixExpected) !== canonical(stored)) fail("INVALID_CHECKPOINT", "checkpoint disagrees with authoritative ledger prefix");
  return { state: stored.records === records.length ? "current" : "stale", expected: checkpointFor(run, records) };
}

async function acquireLock(directory, campaignSha256) {
  const file = path.join(directory, "campaign.lock.json");
  const body = {
    schema: 1,
    artifact: "fixture-012",
    campaign_sha256: campaignSha256,
    owner_nonce: randomBytes(24).toString("hex"),
    pid: process.pid,
    created_at_utc: new Date().toISOString(),
  };
  const document = { ...body, lock_sha256: sha256(canonical(body)) };
  let handle;
  try { handle = await open(file, "wx", 0o600); } catch (error) {
    if (error.code === "EEXIST") fail("CAMPAIGN_LOCKED", "campaign has an existing writer lock; stale locks are never auto-broken");
    throw error;
  }
  try { await handle.writeFile(`${JSON.stringify(document, null, 2)}\n`); await handle.sync(); } finally { await handle.close(); }
  return {
    async release() {
      const current = JSON.parse(await readFile(file, "utf8"));
      if (canonical(current) !== canonical(document)) fail("LOCK_OWNERSHIP_LOST", "campaign lock changed while held");
      await rm(file);
    },
  };
}

async function acquireLayout({ adapter, config, preparation, workUnit, artifactRoot, proofSets }) {
  const builds = [];
  const warmups = [];
  const measurements = [];
  const checks = Object.fromEntries(["builds_complete", "layout_proofs_distinct", "warmups_complete", "measurements_complete", "order_counterbalanced", "correctness_complete", "telemetry_complete", "energy_boundary_preserved"].map((key) => [key, false]));
  let failure = null;
  try {
    for (const variant of workUnit.build_order) {
      const artifactDirectory = path.join(artifactRoot, variant);
      const buildValue = await adapter.build({ work_unit: workUnit, variant, layout_seed: workUnit.layout_seed, artifact_directory: artifactDirectory, timeout_ms: config.timeout_ms });
      const build = validateWithRetainedAttempt(buildValue, (value) => assertBuild(value, { variant, layout_seed: workUnit.layout_seed }, `build ${variant}`));
      const seen = proofSets.get(variant);
      if (seen.has(build.layout_structure_sha256)) fail("LAYOUT_RANDOMIZATION_FAILURE", `${variant} structural layout proof repeats`);
      seen.add(build.layout_structure_sha256);
      builds.push(build);
    }
    checks.builds_complete = builds.length === 2;
    checks.layout_proofs_distinct = true;
    const artifacts = Object.fromEntries(builds.map((build) => [build.variant, build]));
    for (const [pair, order] of workUnit.warmup_orders.entries()) for (const [orderPosition, variant] of order.entries()) warmups.push(await observation({ adapter, config, preparation, workUnit, artifacts, phase: "warmup", pair, variant, orderPosition }));
    checks.warmups_complete = warmups.length === config.warmup_pairs_per_layout * 2;
    for (const [pair, order] of workUnit.measurement_orders.entries()) for (const [orderPosition, variant] of order.entries()) measurements.push(await observation({ adapter, config, preparation, workUnit, artifacts, phase: "measure", pair, variant, orderPosition }));
    checks.measurements_complete = measurements.length === config.measurement_pairs_per_layout * 2;
    checks.order_counterbalanced = balanced(warmups, config.warmup_pairs_per_layout) && balanced(measurements, config.measurement_pairs_per_layout);
    checks.correctness_complete = [...warmups, ...measurements].every((value) => value.execution.correctness_sha256 === config.correctness.expected_stdout_sha256);
    checks.telemetry_complete = [...warmups, ...measurements].every((value) => value.telemetry_before && value.telemetry_after);
    checks.energy_boundary_preserved = config.energy.mode === "latency-only"
      ? [...warmups, ...measurements].every((value) => value.energy.measured_j === null)
      : [...warmups, ...measurements].every((value) => value.energy.uncertainty_j >= value.energy.uncertainty_floor_j);
    if (!Object.values(checks).every(Boolean)) fail("LAYOUT_REJECTION", "registered layout checks failed");
  } catch (error) {
    failure = safeFailure(error);
  }
  return { status: failure === null ? "complete" : "rejected", builds, warmups, measurements, checks, failure };
}

async function safeRunDirectory(repositoryRoot, output, { create = true } = {}) {
  const runsRoot = path.join(repositoryRoot, "experiments", "workstation", "runs");
  await ensureSafeDirectory({ root: repositoryRoot, target: runsRoot, label: "workstation runs root" });
  if (!isPathInside(runsRoot, output) || path.resolve(output) === path.resolve(runsRoot)) fail("OUTPUT_CONTAINMENT", "output must be a child of experiments/workstation/runs");
  if (create) await ensureSafeDirectory({ root: runsRoot, target: output, label: "campaign output" });
  return assertSafePathBelow({ root: runsRoot, target: output, label: "campaign output", finalType: "directory" });
}

export async function prepareFixture012WorkstationAcquisition({ config, adapter, allowFixtureAdapter = false }) {
  validateFixture012WorkstationConfig(config);
  assertAdapter(adapter, config, allowFixtureAdapter);
  const preparation = assertPreparation(await adapter.prepare({ config }), config, adapter.binding);
  const schedule = buildFixture012WorkstationSchedule(config);
  return {
    valid: true,
    artifact: "fixture-012",
    lane: "workstation-development",
    campaign_id: config.campaign_id,
    layouts: schedule.length,
    warmup_observations: schedule.length * config.warmup_pairs_per_layout * 2,
    latency_observations: schedule.length * config.measurement_pairs_per_layout * 2,
    schedule_sha256: sha256(canonical(schedule)),
    adapter_binding: adapter.binding,
    preparation,
    resume_boundary: "completed-layout-record",
    measured_energy_present: config.energy.mode !== "latency-only",
    claim_eligible: false,
    scientific_result: false,
  };
}

export async function runFixture012WorkstationAcquisition({
  config,
  adapter,
  output,
  repositoryRoot,
  allowFixtureAdapter = false,
  stopAfterLayouts = null,
}) {
  validateFixture012WorkstationConfig(config);
  assertAdapter(adapter, config, allowFixtureAdapter);
  const directory = await safeRunDirectory(path.resolve(repositoryRoot), path.resolve(output));
  const campaignSha256 = sha256(canonical({ config, adapter_binding: adapter.binding }));
  const lock = await acquireLock(directory, campaignSha256);
  try {
    const prepared = await prepareFixture012WorkstationAcquisition({ config, adapter, allowFixtureAdapter });
    const schedule = buildFixture012WorkstationSchedule(config);
    const identity = {
      schema: 1,
      artifact: "fixture-012",
      lane: "workstation-development",
      runner_version: FIXTURE_012_WORKSTATION_RUNNER_VERSION,
      config_sha256: sha256(canonical(config)),
      config,
      schedule_sha256: prepared.schedule_sha256,
      adapter_binding: adapter.binding,
      preparation: prepared.preparation,
      resume_boundary: "completed-layout-record",
      measured_energy_present: prepared.measured_energy_present,
      energy_claim_boundary: config.energy.mode === "latency-only" ? "latency-only-no-joules" : "calibrated-development-measurement-no-claim-authority",
      claim_eligible: false,
      scientific_result: false,
      energy_claim_eligible: false,
    };
    const run = { ...identity, run_id: sha256(canonical(identity)), total_layouts: schedule.length };
    await stableCreate(path.join(directory, "run.json"), run);
    const rawPath = path.join(directory, "raw-layouts.jsonl");
    let ledger = await readLedger(rawPath, run, config);
    const checkpointPath = path.join(directory, "checkpoint.json");
    const checkpoint = await checkpointState(checkpointPath, run, ledger.records);
    if (checkpoint.state !== "current") await replaceDurable(checkpointPath, checkpoint.expected);
    if (ledger.records.some((record) => record.status === "rejected")) fail("REJECTED_RUN", "ledger contains a retained rejected attempt");
    if (ledger.records.length > schedule.length) fail("INVALID_LEDGER", "ledger exceeds schedule");
    for (const [index, record] of ledger.records.entries()) {
      if (canonical(record.work_unit) !== canonical(schedule[index])) fail("SCHEDULE_SEQUENCE_MISMATCH", `record ${index} is not the exact schedule prefix`);
    }
    const proofs = new Map(VARIANTS.map((variant) => [variant, new Set()]));
    for (const record of ledger.records) for (const build of record.builds) proofs.get(build.variant).add(build.layout_structure_sha256);
    let added = 0;
    for (let index = ledger.records.length; index < schedule.length; index += 1) {
      if (stopAfterLayouts !== null && added >= stopAfterLayouts) break;
      const workUnit = schedule[index];
      const artifactRoot = path.join(directory, "artifacts", workUnit.work_unit_id);
      await assertSafePathBelow({ root: directory, target: artifactRoot, label: "layout artifact root", allowMissing: true });
      const acquired = await acquireLayout({ adapter, config, preparation: run.preparation, workUnit, artifactRoot, proofSets: proofs });
      const body = {
        schema: 1,
        contract_version: FIXTURE_012_WORKSTATION_LEDGER_VERSION,
        runner_version: FIXTURE_012_WORKSTATION_RUNNER_VERSION,
        artifact: "fixture-012",
        lane: "workstation-development",
        run_id: run.run_id,
        sequence: index,
        previous_sha256: ledger.terminal,
        work_unit: workUnit,
        status: acquired.status,
        adapter_binding_sha256: sha256(canonical(run.adapter_binding)),
        builds: acquired.builds,
        warmups: acquired.warmups,
        measurements: acquired.measurements,
        checks: acquired.checks,
        failure: acquired.failure,
        claim_eligible: false,
        scientific_result: false,
        energy_claim_eligible: false,
      };
      const record = { ...body, record_sha256: sha256(canonical(body)) };
      assertFixture012WorkstationRecord(record, { runId: run.run_id, sequence: index, previousHash: ledger.terminal, config, preparation: run.preparation });
      await durableAppend(rawPath, record);
      ledger = { records: [...ledger.records, record], terminal: record.record_sha256, raw: "" };
      await replaceDurable(checkpointPath, checkpointFor(run, ledger.records));
      if (record.status === "rejected") {
        fail(
          "LAYOUT_REJECTED",
          `${workUnit.work_unit_id} retained rejection: ${record.failure.code}: ${record.failure.message}`,
        );
      }
      added += 1;
    }
    return {
      valid: true,
      status: ledger.records.length === schedule.length ? "complete" : "incomplete-at-clean-layout-boundary",
      run_id: run.run_id,
      layouts_completed: ledger.records.length,
      layouts_total: schedule.length,
      terminal_record_sha256: ledger.terminal,
      measured_energy_present: run.measured_energy_present,
      claim_eligible: false,
      scientific_result: false,
      energy_claim_eligible: false,
    };
  } finally {
    await lock.release();
  }
}

async function sha256File(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function validateAdapterAndInputs(repositoryRoot, binding, config) {
  assertAdapterBinding(binding);
  let adapterRuntime = null;
  if ((binding.source_locator === null) !== (binding.config_locator === null)) {
    fail("ADAPTER_BINDING_MISMATCH", "adapter source/config locators must be present together");
  }
  if (!binding.fixture_only && binding.source_locator === null) {
    fail("ADAPTER_BINDING_MISMATCH", "real adapter lacks source/config locators");
  }
  if (binding.source_locator !== null) {
    const source = await assertSafePathBelow({ root: repositoryRoot, target: path.join(repositoryRoot, binding.source_locator), label: "adapter source", finalType: "file" });
    if (await sha256File(source) !== binding.source_sha256) fail("ADAPTER_BINDING_MISMATCH", "adapter source changed");
    const adapterConfigFile = await assertSafePathBelow({ root: repositoryRoot, target: path.join(repositoryRoot, binding.config_locator), label: "adapter config", finalType: "file" });
    const adapterConfig = JSON.parse(await readFile(adapterConfigFile, "utf8"));
    if (sha256(canonical(adapterConfig)) !== binding.config_sha256) fail("ADAPTER_BINDING_MISMATCH", "adapter config changed");
    if (
      adapterConfig.adapter_id !== binding.adapter_id
      || adapterConfig.adapter_version !== binding.adapter_version
      || canonical(adapterConfig.effective_environment?.values) !== canonical(binding.effective_environment)
    ) fail("ADAPTER_BINDING_MISMATCH", "adapter identity or effective environment differs from its frozen config");
    const configuredCommands = [
      ["build", adapterConfig.build],
      ["telemetry", adapterConfig.telemetry],
      ...(adapterConfig.energy === null ? [] : [["energy", adapterConfig.energy]]),
    ].map(([role, command]) => {
      const body = {
        role,
        executable_path: command.executable,
        executable_sha256: command.executable_sha256,
        version_args: command.version_args,
        version_stdout_sha256: command.version_stdout_sha256,
      };
      return { ...body, command_identity_sha256: sha256(canonical(body)) };
    });
    if (canonical(configuredCommands) !== canonical(binding.commands)) fail("ADAPTER_BINDING_MISMATCH", "adapter command identities differ from frozen config");
    if ((adapterConfig.windows_job_supervisor === null) !== (binding.process_supervisor === null)) {
      fail("ADAPTER_BINDING_MISMATCH", "adapter supervisor presence differs from frozen config");
    }
    if (binding.process_supervisor !== null) {
      const configured = adapterConfig.windows_job_supervisor;
      const expectedSupervisor = {
        protocol_version: configured.protocol_version,
        host_executable_path: path.resolve(configured.host_executable),
        host_executable_sha256: configured.host_executable_sha256,
        version_stdout_sha256: configured.version_stdout_sha256,
        harness_locator: path.relative(repositoryRoot, path.resolve(repositoryRoot, configured.harness_path)).replaceAll("\\", "/"),
        harness_sha256: configured.harness_sha256,
        source_locator: path.relative(repositoryRoot, path.resolve(repositoryRoot, configured.source_path)).replaceAll("\\", "/"),
        source_sha256: configured.source_sha256,
        assembly_path: path.resolve(configured.assembly_path),
        assembly_sha256: configured.assembly_sha256,
      };
      expectedSupervisor.identity_sha256 = sha256(canonical(expectedSupervisor));
      if (canonical(expectedSupervisor) !== canonical(binding.process_supervisor)) fail("ADAPTER_BINDING_MISMATCH", "adapter supervisor identity differs from frozen config");
      const host = await assertAbsoluteRegularFile(binding.process_supervisor.host_executable_path, "supervisor host");
      const assembly = await assertAbsoluteRegularFile(binding.process_supervisor.assembly_path, "supervisor assembly");
      const harness = await assertSafePathBelow({ root: repositoryRoot, target: path.join(repositoryRoot, binding.process_supervisor.harness_locator), label: "supervisor harness", finalType: "file" });
      const sourceFile = await assertSafePathBelow({ root: repositoryRoot, target: path.join(repositoryRoot, binding.process_supervisor.source_locator), label: "supervisor source", finalType: "file" });
      for (const [file, expected, label] of [
        [host, binding.process_supervisor.host_executable_sha256, "host"],
        [assembly, binding.process_supervisor.assembly_sha256, "assembly"],
        [harness, binding.process_supervisor.harness_sha256, "harness"],
        [sourceFile, binding.process_supervisor.source_sha256, "source"],
      ]) if (await sha256File(file) !== expected) fail("ADAPTER_BINDING_MISMATCH", `supervisor ${label} changed`);
    }
    const workingDirectory = await assertSafePathBelow({
      root: repositoryRoot,
      target: path.resolve(repositoryRoot, adapterConfig.working_directory),
      label: "adapter working directory",
      finalType: "directory",
    });
    adapterRuntime = { adapterConfig, workingDirectory };
  }
  for (const command of binding.commands) {
    const executable = await assertAbsoluteRegularFile(command.executable_path, `command ${command.role}`);
    if (await sha256File(executable) !== command.executable_sha256) fail("COMMAND_BINDING_MISMATCH", `${command.role} executable changed`);
  }
  if (binding.trusted_inputs.manifest_path !== config.trusted_inputs.manifest_path || binding.trusted_inputs.manifest_sha256 !== config.trusted_inputs.manifest_sha256) fail("INPUT_BINDING_MISMATCH", "adapter trusted-input binding differs from config");
  const manifestPath = await assertSafePathBelow({ root: repositoryRoot, target: path.join(repositoryRoot, config.trusted_inputs.manifest_path), label: "trusted input manifest", finalType: "file" });
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  validateTrustedInputManifest(manifest);
  if (sha256(canonical(manifest)) !== config.trusted_inputs.manifest_sha256 || canonical(manifest) !== canonical(binding.trusted_inputs.manifest)) fail("INPUT_BINDING_MISMATCH", "trusted manifest changed");
  for (const file of manifest.files) {
    const absolute = await assertSafePathBelow({ root: repositoryRoot, target: path.join(repositoryRoot, file.path), label: `trusted ${file.role}`, finalType: "file" });
    if (await sha256File(absolute) !== file.sha256) fail("INPUT_BINDING_MISMATCH", `trusted ${file.role} changed`);
  }
  return adapterRuntime;
}

async function validateRetainedBuild(repositoryRoot, output, build, workUnit) {
  assertBuild(build, { variant: build.variant, layout_seed: workUnit.layout_seed }, "retained build");
  const artifact = await assertSafePathBelow({ root: output, target: path.join(repositoryRoot, build.artifact_locator), label: "retained executable", finalType: "file" });
  const layoutFile = await assertSafePathBelow({ root: output, target: path.join(repositoryRoot, build.layout_manifest_locator), label: "retained layout manifest", finalType: "file" });
  if (await sha256File(artifact) !== build.executable_sha256) fail("ARTIFACT_BINDING_MISMATCH", "retained executable changed");
  const layout = JSON.parse(await readFile(layoutFile, "utf8"));
  validateNormalizedLayoutManifest(layout, { variant: build.variant, layout_seed: workUnit.layout_seed });
  if (sha256(canonical(layout)) !== build.layout_manifest_sha256 || canonical(layout) !== canonical(build.layout_manifest)) fail("ARTIFACT_BINDING_MISMATCH", "retained layout manifest changed");
}

function expandFrozenArguments(values, variables) {
  return values.map((value) => value.replace(/\{([a-z_]+)\}/gu, (whole, name) => {
    if (!Object.hasOwn(variables, name)) fail("COMMAND_BINDING_MISMATCH", `no frozen value exists for ${whole}`);
    return String(variables[name]);
  }));
}

function attemptCommandSha256({ role, executable, executableSha256, args, cwd, environmentSha256 }) {
  return sha256(canonical({
    role,
    executable: path.resolve(executable),
    executable_sha256: executableSha256,
    args,
    cwd,
    effective_environment_sha256: environmentSha256,
  }));
}

function frozenVariables(workUnit, {
  variant = "baseline",
  artifactDirectory = "",
  executablePath = "",
  layoutManifestPath = "",
  phase = "preflight",
  pair = 0,
  orderPosition = 0,
} = {}) {
  return {
    variant,
    layout_seed: workUnit.layout_seed,
    layout_id: workUnit.layout_id,
    layout_slot: workUnit.layout_slot,
    study: workUnit.study,
    artifact_dir: artifactDirectory,
    executable_path: executablePath,
    layout_manifest_path: layoutManifestPath,
    phase,
    pair,
    order_position: orderPosition,
  };
}

function requireAttemptCommand(attempt, expected, label) {
  if (attempt.command_role !== expected.role) fail("COMMAND_BINDING_MISMATCH", `${label} role is invalid`);
  if (attempt.executable_sha256 !== expected.executableSha256) fail("COMMAND_BINDING_MISMATCH", `${label} executable is unbound`);
  if (attempt.command_sha256 !== attemptCommandSha256(expected)) fail("COMMAND_BINDING_MISMATCH", `${label} command identity is invalid`);
}

function validateRecordRuntimeBindings(record, binding, config, adapterRuntime, repositoryRoot) {
  const commandBindings = new Map(binding.commands.map((command) => [command.role, command]));
  const requireProvider = (role) => {
    const provider = commandBindings.get(role);
    if (!provider && !binding.fixture_only) fail("COMMAND_BINDING_MISMATCH", `real adapter lacks ${role} command identity`);
    return provider;
  };
  const buildProvider = requireProvider("build");
  const telemetryProvider = requireProvider("telemetry");
  const energyProvider = config.energy.mode === "latency-only" ? null : requireProvider("energy");
  const builds = new Map(record.builds.map((build) => [build.variant, build]));
  for (const build of record.builds) {
    if (build.attempt.command_role !== "build") fail("COMMAND_BINDING_MISMATCH", "build attempt role is invalid");
    if (buildProvider && build.attempt.executable_sha256 !== buildProvider.executable_sha256) fail("COMMAND_BINDING_MISMATCH", "build attempt executable is unbound");
    if (
      build.executable_version_attempt.command_role !== "measured-artifact-version"
      || build.executable_version_attempt.executable_sha256 !== build.executable_sha256
    ) fail("ARTIFACT_BINDING_MISMATCH", "artifact version attempt is not bound to the retained executable");
    if (adapterRuntime) {
      const executablePath = path.join(repositoryRoot, build.artifact_locator);
      const layoutManifestPath = path.join(repositoryRoot, build.layout_manifest_locator);
      const artifactDirectory = path.dirname(executablePath);
      const variables = frozenVariables(record.work_unit, {
        variant: build.variant,
        artifactDirectory,
        executablePath,
        layoutManifestPath,
      });
      requireAttemptCommand(build.attempt, {
        role: "build",
        executable: adapterRuntime.adapterConfig.build.executable,
        executableSha256: adapterRuntime.adapterConfig.build.executable_sha256,
        args: expandFrozenArguments(adapterRuntime.adapterConfig.build.args, variables),
        cwd: adapterRuntime.workingDirectory,
        environmentSha256: binding.environment_sha256,
      }, "build attempt");
      requireAttemptCommand(build.executable_version_attempt, {
        role: "measured-artifact-version",
        executable: executablePath,
        executableSha256: build.executable_sha256,
        args: adapterRuntime.adapterConfig.run.version_args,
        cwd: adapterRuntime.workingDirectory,
        environmentSha256: binding.environment_sha256,
      }, "artifact version attempt");
      if (build.executable_version_stdout_sha256 !== adapterRuntime.adapterConfig.run.version_stdout_sha256) {
        fail("ARTIFACT_BINDING_MISMATCH", "artifact version output differs from frozen config");
      }
    }
  }
  for (const observationValue of [...record.warmups, ...record.measurements]) {
    const build = builds.get(observationValue.variant);
    if (!build) fail("ARTIFACT_BINDING_MISMATCH", `observation lacks its ${observationValue.variant} build`);
    if (
      observationValue.execution.attempt.command_role !== "measure"
      || observationValue.execution.attempt.executable_sha256 !== build.executable_sha256
    ) fail("ARTIFACT_BINDING_MISMATCH", "measurement attempt is not bound to its retained executable");
    const variables = frozenVariables(record.work_unit, {
      variant: observationValue.variant,
      phase: observationValue.phase,
      pair: observationValue.pair,
      orderPosition: observationValue.order_position,
    });
    if (adapterRuntime) {
      requireAttemptCommand(observationValue.execution.attempt, {
        role: "measure",
        executable: path.join(repositoryRoot, build.artifact_locator),
        executableSha256: build.executable_sha256,
        args: expandFrozenArguments(adapterRuntime.adapterConfig.run.args, variables),
        cwd: adapterRuntime.workingDirectory,
        environmentSha256: binding.environment_sha256,
      }, "measurement attempt");
    }
    for (const telemetry of [observationValue.telemetry_before, observationValue.telemetry_after]) {
      if (telemetry.attempt.command_role !== "telemetry") fail("COMMAND_BINDING_MISMATCH", "telemetry attempt role is invalid");
      if (telemetryProvider && telemetry.attempt.executable_sha256 !== telemetryProvider.executable_sha256) fail("COMMAND_BINDING_MISMATCH", "telemetry attempt executable is unbound");
      if (adapterRuntime) requireAttemptCommand(telemetry.attempt, {
        role: "telemetry",
        executable: adapterRuntime.adapterConfig.telemetry.executable,
        executableSha256: adapterRuntime.adapterConfig.telemetry.executable_sha256,
        args: expandFrozenArguments(adapterRuntime.adapterConfig.telemetry.args, variables),
        cwd: adapterRuntime.workingDirectory,
        environmentSha256: binding.environment_sha256,
      }, "telemetry attempt");
    }
    if (config.energy.mode !== "latency-only") {
      for (const energy of [observationValue.energy.before, observationValue.energy.after]) {
        if (energy.attempt.command_role !== "energy") fail("COMMAND_BINDING_MISMATCH", "energy attempt role is invalid");
        if (energyProvider && energy.attempt.executable_sha256 !== energyProvider.executable_sha256) fail("COMMAND_BINDING_MISMATCH", "energy attempt executable is unbound");
        if (adapterRuntime) requireAttemptCommand(energy.attempt, {
          role: "energy",
          executable: adapterRuntime.adapterConfig.energy.executable,
          executableSha256: adapterRuntime.adapterConfig.energy.executable_sha256,
          args: expandFrozenArguments(adapterRuntime.adapterConfig.energy.args, variables),
          cwd: adapterRuntime.workingDirectory,
          environmentSha256: binding.environment_sha256,
        }, "energy attempt");
      }
    }
  }
}

export async function validateFixture012WorkstationOutput({ config, output, repositoryRoot }) {
  validateFixture012WorkstationConfig(config);
  const directory = await safeRunDirectory(path.resolve(repositoryRoot), path.resolve(output), { create: false });
  const run = JSON.parse(await readFile(path.join(directory, "run.json"), "utf8"));
  const { run_id: actualRunId, total_layouts: totalLayouts, ...identity } = run;
  if (actualRunId !== sha256(canonical(identity)) || identity.config_sha256 !== sha256(canonical(config)) || canonical(identity.config) !== canonical(config) || identity.claim_eligible !== false || identity.scientific_result !== false || identity.energy_claim_eligible !== false) fail("INVALID_RUN", "run identity or authority binding is invalid");
  const schedule = buildFixture012WorkstationSchedule(config);
  if (totalLayouts !== schedule.length || run.schedule_sha256 !== sha256(canonical(schedule))) fail("INVALID_RUN", "run schedule binding is invalid");
  assertPreparation(run.preparation, config, run.adapter_binding);
  const adapterRuntime = await validateAdapterAndInputs(path.resolve(repositoryRoot), run.adapter_binding, config);
  if (adapterRuntime) {
    if (config.energy.mode === "latency-only") {
      if (adapterRuntime.adapterConfig.energy !== null || canonical(run.preparation.energy) !== canonical({ mode: "none" })) {
        fail("ENERGY_BOUNDARY", "latency-only preparation is not bound to a null energy adapter");
      }
    } else {
      const adapterEnergy = adapterRuntime.adapterConfig.energy;
      const expectedEnergyPreparation = {
        mode: adapterEnergy.mode,
        provider_id: adapterEnergy.provider_id,
        provider_serial: adapterEnergy.provider_serial,
        calibration_certificate_path: adapterEnergy.calibration_certificate_path,
        calibration_certificate_sha256: adapterEnergy.calibration_certificate_sha256,
        calibration_valid_until: adapterEnergy.calibration_valid_until,
        uncertainty_fraction: adapterEnergy.uncertainty_fraction,
      };
      if (canonical(run.preparation.energy) !== canonical(expectedEnergyPreparation)) {
        fail("CALIBRATION_BINDING_MISMATCH", "energy preparation differs from frozen adapter calibration identity");
      }
    }
  }
  if (config.energy.mode !== "latency-only") {
    const certificate = await assertAbsoluteRegularFile(run.preparation.energy.calibration_certificate_path, "calibration certificate");
    if (await sha256File(certificate) !== run.preparation.energy.calibration_certificate_sha256) fail("CALIBRATION_BINDING_MISMATCH", "calibration certificate changed");
  }
  const ledger = await readLedger(path.join(directory, "raw-layouts.jsonl"), run, config);
  const checkpoint = await checkpointState(path.join(directory, "checkpoint.json"), run, ledger.records);
  if (ledger.records.length > schedule.length) fail("INVALID_LEDGER", "ledger exceeds schedule");
  const proofs = new Map(VARIANTS.map((variant) => [variant, new Set()]));
  for (const [index, record] of ledger.records.entries()) {
    if (canonical(record.work_unit) !== canonical(schedule[index])) fail("SCHEDULE_SEQUENCE_MISMATCH", `record ${index} is not the exact schedule sequence`);
    if (record.status !== "complete") fail("REJECTED_RUN", "ledger contains a rejected attempt");
    if (!balanced(record.warmups, config.warmup_pairs_per_layout) || !balanced(record.measurements, config.measurement_pairs_per_layout)) fail("INVALID_LEDGER", "stored order is not counterbalanced");
    validateRecordRuntimeBindings(record, run.adapter_binding, config, adapterRuntime, path.resolve(repositoryRoot));
    for (const build of record.builds) {
      await validateRetainedBuild(path.resolve(repositoryRoot), directory, build, record.work_unit);
      if (proofs.get(build.variant).has(build.layout_structure_sha256)) fail("LAYOUT_RANDOMIZATION_FAILURE", "structural proof repeats across schedule");
      proofs.get(build.variant).add(build.layout_structure_sha256);
    }
  }
  return {
    valid: true,
    status: ledger.records.length === schedule.length ? "complete" : "incomplete-at-clean-layout-boundary",
    checkpoint_state: checkpoint.state,
    run_id: run.run_id,
    layouts_completed: ledger.records.length,
    layouts_total: schedule.length,
    raw_layouts_sha256: createHash("sha256").update(ledger.raw).digest("hex"),
    terminal_record_sha256: ledger.terminal,
    measured_energy_present: run.measured_energy_present,
    claim_eligible: false,
    scientific_result: false,
    energy_claim_eligible: false,
  };
}

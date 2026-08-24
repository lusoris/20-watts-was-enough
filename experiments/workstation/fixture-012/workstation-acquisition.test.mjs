import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { canonical, sha256 } from "./contract.mjs";
import { main as workstationCli } from "./workstation-cli.mjs";
import {
  FIXTURE_012_PROCESS_ADAPTER_CONFIG_VERSION,
  validateFixture012ProcessAdapterConfig,
} from "./process-workstation-adapter.mjs";
import {
  FIXTURE_012_LAYOUT_MANIFEST_VERSION,
  FIXTURE_012_PROCESS_ATTEMPT_VERSION,
  FIXTURE_012_WORKSTATION_CONFIG_VERSION,
  buildFixture012WorkstationSchedule,
  fixture012LayoutStructureSha256,
  prepareFixture012WorkstationAcquisition,
  runFixture012WorkstationAcquisition,
  validateFixture012WorkstationConfig,
  validateFixture012WorkstationOutput,
} from "./workstation-acquisition.mjs";

const root = process.cwd();
const temporaryRoot = path.join(root, "tmp");
const runsRoot = path.join(root, "experiments", "workstation", "runs");
const fixtureDirectory = path.join(
  root,
  "experiments",
  "workstation",
  "fixture-012",
  "test-fixtures",
  "space dir",
);
const buildScript = path.join(fixtureDirectory, "build fixture.mjs");
const telemetryScript = path.join(fixtureDirectory, "telemetry fixture.mjs");
const workloadScript = path.join(fixtureDirectory, "workload fixture.mjs");
const inputFile = path.join(fixtureDirectory, "input fixture.json");
const referenceFile = path.join(fixtureDirectory, "reference fixture.txt");
const correctnessSha256 = sha256("fixture-012-correct-output\n");
const emptySha256 = sha256("");
const zeroSha256 = "0".repeat(64);

async function shaFile(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

function checkpointDocument(run, records) {
  const body = {
    schema: 1,
    artifact: "fixture-012",
    contract_version: "fixture-012.checkpoint.v2",
    run_id: run.run_id,
    schedule_sha256: run.schedule_sha256,
    records: records.length,
    completed_layouts: records.filter((record) => record.status === "complete").length,
    terminal_record_sha256: records.at(-1)?.record_sha256 ?? zeroSha256,
    completed_work_units_sha256: sha256(canonical(
      records.filter((record) => record.status === "complete")
        .map((record) => record.work_unit.work_unit_id),
    )),
  };
  return { ...body, checkpoint_sha256: sha256(canonical(body)) };
}

function rehashLedger(records) {
  let previousSha256 = zeroSha256;
  return records.map((original, sequence) => {
    const body = structuredClone(original);
    delete body.record_sha256;
    body.sequence = sequence;
    body.previous_sha256 = previousSha256;
    const record = { ...body, record_sha256: sha256(canonical(body)) };
    previousSha256 = record.record_sha256;
    return record;
  });
}

function relative(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

async function makeContext(name, configOverrides = {}) {
  await mkdir(temporaryRoot, { recursive: true });
  await mkdir(runsRoot, { recursive: true });
  const parent = await mkdtemp(path.join(temporaryRoot, `f012-v2-${name}-`));
  const output = path.join(runsRoot, `${path.basename(parent)} output with spaces`);
  const manifest = {
    schema: 1,
    artifact: "fixture-012",
    contract_version: "fixture-012.trusted-input-manifest.v1",
    workload_id: `fixture-${name.replaceAll(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
    files: await Promise.all([
      ["workload", workloadScript],
      ["input", inputFile],
      ["reference", referenceFile],
      ["support", buildScript],
      ["support", telemetryScript],
    ].map(async ([role, file]) => ({ role, path: relative(file), sha256: await shaFile(file) }))),
  };
  const manifestPath = path.join(parent, "trusted manifest.json");
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const config = {
    schema: 1,
    artifact: "fixture-012",
    contract_version: FIXTURE_012_WORKSTATION_CONFIG_VERSION,
    campaign_id: `f012-${name.replaceAll(/[^a-z0-9]+/gi, "-").toLowerCase()}-20260824`,
    profile: "workstation-development",
    schedule_seed: 0x1207_2026,
    studies: 1,
    layouts_per_study: 4,
    warmup_pairs_per_layout: 2,
    measurement_pairs_per_layout: 2,
    timeout_ms: 30_000,
    variants: ["baseline", "candidate"],
    measurement_boundary: "process-launch-to-exit-event",
    correctness: { mode: "stdout-sha256", expected_stdout_sha256: correctnessSha256 },
    trusted_inputs: {
      manifest_path: relative(manifestPath),
      manifest_sha256: sha256(canonical(manifest)),
    },
    thermal: {
      required_sensor_ids: ["cpu-package"],
      minimum_c: 5,
      maximum_c: 80,
      maximum_pair_drift_c: 5,
    },
    frequency: {
      required_sensor_ids: ["cpu-effective"],
      minimum_hz: 1_000_000_000,
      maximum_pair_relative_drift: 0.2,
    },
    energy: {
      mode: "latency-only",
      require_calibrated_provider_for_energy_claim: true,
      minimum_interval_uncertainty_j: 0,
    },
    authority: { development_only: true, claim_eligible: false, scientific_result: false },
    ...configOverrides,
  };
  return { parent, output, manifest, manifestPath, config };
}

async function cleanup(...contexts) {
  for (const context of contexts) {
    if (context.output) {
      assert.ok(context.output.startsWith(`${runsRoot}${path.sep}`));
      await rm(context.output, { recursive: true, force: true });
    }
    if (context.parent) {
      assert.ok(context.parent.startsWith(`${temporaryRoot}${path.sep}`));
      await rm(context.parent, { recursive: true, force: true });
    }
  }
}

function layoutManifest(variant, layoutSeed) {
  return {
    schema: 1,
    contract_version: FIXTURE_012_LAYOUT_MANIFEST_VERSION,
    artifact: "fixture-012",
    variant,
    layout_seed: layoutSeed,
    sections: [{
      name: ".text",
      ordinal: 0,
      size_bytes: 100 + (layoutSeed % 17),
      content_sha256: sha256(`section:${variant}:${layoutSeed}`),
    }],
    symbols: [{
      name_sha256: sha256(`symbol:${variant}:${layoutSeed}`),
      section: ".text",
      ordinal: 0,
      size_bytes: 10 + (layoutSeed % 7),
    }],
  };
}

function controlledAdapter(context, {
  energy = false,
  wrongCorrectness = false,
  hot = false,
  repeatedLayout = false,
  holdBuild = null,
  calls = [],
} = {}) {
  let monotonic = 1_000_000n;
  let cumulativeJ = 100;
  function attempt(role, {
    stdoutSha = emptySha256,
    duration = 10_000n,
    executableSha = sha256(`executable:${role}`),
  } = {}) {
    const start = monotonic;
    monotonic += duration;
    const end = monotonic;
    monotonic += 100n;
    return {
      schema: 1,
      contract_version: FIXTURE_012_PROCESS_ATTEMPT_VERSION,
      command_role: role,
      command_sha256: sha256(`command:${role}`),
      executable_sha256: executableSha,
      monotonic_started_ns: start.toString(),
      monotonic_ended_ns: end.toString(),
      exit_code: 0,
      signal: null,
      timed_out: false,
      termination: "natural-exit",
      stdout_sha256: stdoutSha,
      stderr_sha256: emptySha256,
      stdout_bytes: 0,
      stderr_bytes: 0,
    };
  }
  const binding = {
    schema: 1,
    adapter_id: "controlled-fixture-adapter",
    adapter_version: "2.0.0",
    fixture_only: true,
    source_locator: null,
    source_sha256: sha256("controlled adapter source"),
    config_locator: null,
    config_sha256: sha256("controlled adapter config"),
    effective_environment: {},
    environment_sha256: sha256(canonical({})),
    commands: [],
    trusted_inputs: {
      manifest_path: context.config.trusted_inputs.manifest_path,
      manifest_sha256: context.config.trusted_inputs.manifest_sha256,
      manifest: context.manifest,
    },
  };
  const adapter = {
    binding,
    async prepare() {
      return {
        schema: 1,
        machine: {
          host_fingerprint_sha256: sha256("controlled host"),
          platform: "fixture-os",
          platform_release: "1",
          architecture: "x64",
          cpu_model: "fixture-cpu",
          logical_cpus: 8,
          memory_bytes: 16 * 1024 ** 3,
          runtime: "fixture-runtime",
        },
        clock: {
          source: "node:process.hrtime.bigint",
          monotonic: true,
          measurement_boundary: "process-launch-to-exit-event",
        },
        telemetry: {
          thermal_sensor_ids: ["cpu-package"],
          frequency_sensor_ids: ["cpu-effective"],
        },
        energy: energy ? {
          mode: "external-calibrated-cumulative-joules",
          provider_id: "fixture-meter",
          provider_serial: "fixture-serial",
          calibration_certificate_path: context.certificatePath,
          calibration_certificate_sha256: context.certificateSha256,
          calibration_valid_until: "2099-01-01T00:00:00.000Z",
          uncertainty_fraction: 0.05,
        } : { mode: "none" },
        binding_sha256: sha256(canonical(binding)),
      };
    },
    async build(input) {
      calls.push(`build:${input.work_unit.work_unit_id}:${input.variant}`);
      if (holdBuild) await holdBuild();
      await mkdir(input.artifact_directory, { recursive: true });
      const artifactPath = path.join(input.artifact_directory, "fixture.bin");
      const manifestPath = path.join(input.artifact_directory, "layout.json");
      const artifactBytes = `fixture artifact ${input.variant} ${input.layout_seed}\n`;
      await writeFile(artifactPath, artifactBytes, { flag: "wx" });
      const manifest = layoutManifest(
        input.variant,
        repeatedLayout ? 1 : input.layout_seed,
      );
      if (repeatedLayout) {
        manifest.layout_seed = input.layout_seed;
        manifest.sections[0].size_bytes = 101;
        manifest.sections[0].content_sha256 = sha256(`repeat:${input.variant}`);
        manifest.symbols[0].name_sha256 = sha256(`repeat-symbol:${input.variant}`);
      }
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
      const executableSha256 = sha256(artifactBytes);
      const versionAttempt = attempt("measured-artifact-version", {
        stdoutSha: sha256("fixture-artifact-v1\n"),
        executableSha: executableSha256,
      });
      const artifactLocator = relative(artifactPath);
      return {
        schema: 1,
        variant: input.variant,
        layout_seed: input.layout_seed,
        artifact_locator: artifactLocator,
        executable_sha256: executableSha256,
        executable_version_stdout_sha256: versionAttempt.stdout_sha256,
        executable_version_attempt: versionAttempt,
        artifact_command_identity_sha256: sha256(canonical({
          artifact_locator: artifactLocator,
          executable_sha256: executableSha256,
          executable_version_stdout_sha256: versionAttempt.stdout_sha256,
        })),
        layout_manifest_locator: relative(manifestPath),
        layout_manifest_sha256: sha256(canonical(manifest)),
        layout_manifest: manifest,
        layout_structure_sha256: fixture012LayoutStructureSha256(manifest),
        build_log_sha256: sha256(`build:${input.variant}:${input.layout_seed}`),
        attempt: attempt("build"),
      };
    },
    async captureTelemetry() {
      const commandAttempt = attempt("telemetry");
      return {
        schema: 1,
        captured_at_utc: "2026-08-24T10:00:00.000Z",
        monotonic_ns: commandAttempt.monotonic_ended_ns,
        thermal_c: { "cpu-package": hot ? 90 : 50 },
        frequency_hz: { "cpu-effective": 3_500_000_000 },
        raw_sha256: sha256(`telemetry:${hot}`),
        attempt: commandAttempt,
      };
    },
    async execute(input) {
      calls.push(`execute:${input.work_unit.work_unit_id}:${input.phase}:${input.pair}:${input.variant}`);
      const output = wrongCorrectness ? sha256("wrong") : correctnessSha256;
      const commandAttempt = attempt("measure", {
        stdoutSha: output,
        duration: 25_000n,
        executableSha: input.artifact.executable_sha256,
      });
      return {
        schema: 1,
        status: "ok",
        stdout_sha256: output,
        stderr_sha256: emptySha256,
        correctness_sha256: output,
        attempt: commandAttempt,
      };
    },
    readEnergy: null,
  };
  if (energy) {
    adapter.readEnergy = async () => {
      cumulativeJ += 0.25;
      const commandAttempt = attempt("energy");
      return {
        schema: 1,
        captured_at_utc: "2026-08-24T10:00:00.000Z",
        monotonic_ns: commandAttempt.monotonic_ended_ns,
        cumulative_j: cumulativeJ,
        raw_uncertainty_j: 0,
        raw_sha256: sha256(`energy:${cumulativeJ}`),
        attempt: commandAttempt,
      };
    };
  }
  return adapter;
}

async function processAdapterConfig(context) {
  const nodeSha256 = await shaFile(process.execPath);
  const environmentValues = process.platform === "win32"
    ? {
      SYSTEMROOT: process.env.SYSTEMROOT,
      TEMP: process.env.TEMP,
      TMP: process.env.TMP,
    }
    : {};
  const config = {
    schema: 1,
    artifact: "fixture-012",
    contract_version: FIXTURE_012_PROCESS_ADAPTER_CONFIG_VERSION,
    adapter_id: "fixture-process-adapter",
    adapter_version: "2.0.0",
    working_directory: relative(fixtureDirectory),
    effective_environment: {
      allowlist: Object.keys(environmentValues),
      values: environmentValues,
    },
    thermal_sensor_ids: ["cpu-package"],
    frequency_sensor_ids: ["cpu-effective"],
    build: {
      executable: process.execPath,
      executable_sha256: nodeSha256,
      version_args: [buildScript, "--version"],
      version_stdout_sha256: sha256("fixture-build-wrapper-v1\n"),
      args: [
        buildScript,
        "--variant", "{variant}",
        "--layout-seed", "{layout_seed}",
        "--output", "{executable_path}",
        "--layout-manifest", "{layout_manifest_path}",
      ],
      output_executable: process.platform === "win32" ? "benchmark fixture.exe" : "benchmark fixture",
      output_layout_manifest: "layout manifest.json",
      timeout_ms: 30_000,
      max_output_bytes: 1_048_576,
    },
    run: {
      version_args: ["--version"],
      version_stdout_sha256: sha256(`${process.version}${process.platform === "win32" ? "\r\n" : "\n"}`),
      args: [workloadScript, inputFile],
      timeout_ms: 30_000,
      max_output_bytes: 1_048_576,
    },
    telemetry: {
      executable: process.execPath,
      executable_sha256: nodeSha256,
      version_args: [telemetryScript, "--version"],
      version_stdout_sha256: sha256("fixture-telemetry-v1\n"),
      args: [telemetryScript],
      timeout_ms: 10_000,
      max_output_bytes: 65_536,
    },
    energy: null,
  };
  const configPath = path.join(context.parent, "process adapter with spaces.json");
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
  return { config, configPath };
}

test("v2 config freezes trusted inputs and an exact counterbalanced schedule", async () => {
  const context = await makeContext("schedule");
  try {
    assert.equal(validateFixture012WorkstationConfig(context.config), context.config);
    const schedule = buildFixture012WorkstationSchedule(context.config);
    assert.equal(schedule.length, 4);
    assert.equal(new Set(schedule.map((unit) => unit.layout_id)).size, 4);
    for (const unit of schedule) {
      assert.notEqual(unit.warmup_orders[0][0], unit.warmup_orders[1][0]);
      assert.notEqual(unit.measurement_orders[0][0], unit.measurement_orders[1][0]);
    }
    assert.throws(
      () => validateFixture012WorkstationConfig({
        ...context.config,
        measurement_boundary: "wrapper-plus-hashing",
      }),
      /measurement semantics/,
    );
  } finally {
    await cleanup(context);
  }
});

test("controlled acquisition retains exact launcher timestamps, artifacts, and no energy assertion", async () => {
  const context = await makeContext("controlled");
  try {
    const adapter = controlledAdapter(context);
    const prepared = await prepareFixture012WorkstationAcquisition({
      config: context.config,
      adapter,
      allowFixtureAdapter: true,
    });
    assert.equal(prepared.layouts, 4);
    const result = await runFixture012WorkstationAcquisition({
      config: context.config,
      adapter,
      output: context.output,
      repositoryRoot: root,
      allowFixtureAdapter: true,
    });
    assert.equal(result.status, "complete");
    const validation = await validateFixture012WorkstationOutput({
      config: context.config,
      output: context.output,
      repositoryRoot: root,
    });
    assert.equal(validation.status, "complete");
    const records = (await readFile(path.join(context.output, "raw-layouts.jsonl"), "utf8"))
      .trimEnd().split("\n").map(JSON.parse);
    for (const observation of records.flatMap((record) => record.measurements)) {
      assert.equal(observation.monotonic_started_ns, observation.execution.attempt.monotonic_started_ns);
      assert.equal(observation.monotonic_ended_ns, observation.execution.attempt.monotonic_ended_ns);
      assert.equal(observation.latency_ns, 25_000);
      assert.equal(observation.energy.mode, "latency-only");
      assert.equal(observation.energy.measured_j, null);
    }
  } finally {
    await cleanup(context);
  }
});

test("authoritative ledger repairs a stale checkpoint without replaying completed layouts", async () => {
  const context = await makeContext("stale-checkpoint");
  const calls = [];
  try {
    const adapter = controlledAdapter(context, { calls });
    await runFixture012WorkstationAcquisition({
      config: context.config,
      adapter,
      output: context.output,
      repositoryRoot: root,
      allowFixtureAdapter: true,
      stopAfterLayouts: 1,
    });
    const stale = await readFile(path.join(context.output, "checkpoint.json"), "utf8");
    await runFixture012WorkstationAcquisition({
      config: context.config,
      adapter,
      output: context.output,
      repositoryRoot: root,
      allowFixtureAdapter: true,
    });
    const buildCount = calls.filter((value) => value.startsWith("build:")).length;
    await writeFile(path.join(context.output, "checkpoint.json"), stale);
    const resumed = await runFixture012WorkstationAcquisition({
      config: context.config,
      adapter,
      output: context.output,
      repositoryRoot: root,
      allowFixtureAdapter: true,
    });
    assert.equal(resumed.status, "complete");
    assert.equal(calls.filter((value) => value.startsWith("build:")).length, buildCount);
    assert.equal((await validateFixture012WorkstationOutput({
      config: context.config,
      output: context.output,
      repositoryRoot: root,
    })).checkpoint_state, "current");
  } finally {
    await cleanup(context);
  }
});

test("exclusive campaign lock rejects a concurrent writer", async () => {
  const context = await makeContext("writer-lock");
  let enteredResolve;
  let releaseResolve;
  let first = true;
  const entered = new Promise((resolve) => { enteredResolve = resolve; });
  const release = new Promise((resolve) => { releaseResolve = resolve; });
  try {
    const adapter = controlledAdapter(context, {
      holdBuild: async () => {
        if (!first) return;
        first = false;
        enteredResolve();
        await release;
      },
    });
    const active = runFixture012WorkstationAcquisition({
      config: context.config,
      adapter,
      output: context.output,
      repositoryRoot: root,
      allowFixtureAdapter: true,
      stopAfterLayouts: 1,
    });
    await entered;
    await assert.rejects(
      () => runFixture012WorkstationAcquisition({
        config: context.config,
        adapter,
        output: context.output,
        repositoryRoot: root,
        allowFixtureAdapter: true,
      }),
      /CAMPAIGN_LOCKED/,
    );
    releaseResolve();
    await active;
  } finally {
    releaseResolve?.();
    await cleanup(context);
  }
});

test("wrong correctness is retained as a closed-schema rejected attempt and blocks resume", async () => {
  const context = await makeContext("rejected-attempt");
  try {
    const adapter = controlledAdapter(context, { wrongCorrectness: true });
    await assert.rejects(
      () => runFixture012WorkstationAcquisition({
        config: context.config,
        adapter,
        output: context.output,
        repositoryRoot: root,
        allowFixtureAdapter: true,
      }),
      /LAYOUT_REJECTED/,
    );
    const record = JSON.parse((await readFile(path.join(context.output, "raw-layouts.jsonl"), "utf8")).trim());
    assert.equal(record.status, "rejected");
    assert.equal(record.failure.code, "CORRECTNESS_FAILURE");
    assert.equal(record.failure.attempt.contract_version, FIXTURE_012_PROCESS_ATTEMPT_VERSION);
    assert.equal(record.failure.attempt.command_role, "measure");
    await assert.rejects(
      () => runFixture012WorkstationAcquisition({
        config: context.config,
        adapter,
        output: context.output,
        repositoryRoot: root,
        allowFixtureAdapter: true,
      }),
      /REJECTED_RUN/,
    );
  } finally {
    await cleanup(context);
  }
});

test("energy uncertainty floor and calibration certificate identity are enforced", async () => {
  const certificateContext = await makeContext("energy-floor", {
    energy: {
      mode: "external-calibrated-cumulative-joules",
      require_calibrated_provider_for_energy_claim: true,
      minimum_interval_uncertainty_j: 0.2,
    },
  });
  try {
    assert.throws(
      () => validateFixture012WorkstationConfig({
        ...certificateContext.config,
        energy: {
          ...certificateContext.config.energy,
          minimum_interval_uncertainty_j: 0,
        },
      }),
      /positive absolute uncertainty floor/,
    );
    certificateContext.certificatePath = path.join(certificateContext.parent, "calibration certificate.txt");
    await writeFile(certificateContext.certificatePath, "fixture calibration v1\n");
    certificateContext.certificateSha256 = await shaFile(certificateContext.certificatePath);
    const adapter = controlledAdapter(certificateContext, { energy: true });
    await runFixture012WorkstationAcquisition({
      config: certificateContext.config,
      adapter,
      output: certificateContext.output,
      repositoryRoot: root,
      allowFixtureAdapter: true,
    });
    const record = JSON.parse((await readFile(path.join(certificateContext.output, "raw-layouts.jsonl"), "utf8")).split("\n")[0]);
    const energy = record.measurements[0].energy;
    assert.equal(energy.raw_uncertainty_j, 0);
    assert.equal(energy.uncertainty_floor_j, 0.2);
    assert.equal(energy.uncertainty_j, 0.2);
    await writeFile(certificateContext.certificatePath, "changed calibration\n");
    await assert.rejects(
      () => validateFixture012WorkstationOutput({
        config: certificateContext.config,
        output: certificateContext.output,
        repositoryRoot: root,
      }),
      /CALIBRATION_BINDING_MISMATCH/,
    );
  } finally {
    await cleanup(certificateContext);
  }
});

test("validation detects retained artifact and trusted-input corruption", async () => {
  const artifactContext = await makeContext("artifact-corruption");
  const inputContext = await makeContext("input-corruption");
  try {
    await runFixture012WorkstationAcquisition({
      config: artifactContext.config,
      adapter: controlledAdapter(artifactContext),
      output: artifactContext.output,
      repositoryRoot: root,
      allowFixtureAdapter: true,
    });
    const record = JSON.parse((await readFile(path.join(artifactContext.output, "raw-layouts.jsonl"), "utf8")).split("\n")[0]);
    await writeFile(path.join(root, record.builds[0].artifact_locator), "corrupt artifact\n");
    await assert.rejects(
      () => validateFixture012WorkstationOutput({ config: artifactContext.config, output: artifactContext.output, repositoryRoot: root }),
      /ARTIFACT_BINDING_MISMATCH/,
    );

    await runFixture012WorkstationAcquisition({
      config: inputContext.config,
      adapter: controlledAdapter(inputContext),
      output: inputContext.output,
      repositoryRoot: root,
      allowFixtureAdapter: true,
    });
    const alteredManifest = { ...inputContext.manifest, workload_id: "changed-workload" };
    await writeFile(inputContext.manifestPath, `${JSON.stringify(alteredManifest, null, 2)}\n`);
    await assert.rejects(
      () => validateFixture012WorkstationOutput({ config: inputContext.config, output: inputContext.output, repositoryRoot: root }),
      /INPUT_BINDING_MISMATCH/,
    );
  } finally {
    await cleanup(artifactContext, inputContext);
  }
});

test("process config requires absolute content-identified commands and a frozen safe environment", async () => {
  const context = await makeContext("adapter-config");
  try {
    const { config } = await processAdapterConfig(context);
    assert.equal(validateFixture012ProcessAdapterConfig(config), config);
    assert.throws(
      () => validateFixture012ProcessAdapterConfig({
        ...config,
        build: { ...config.build, executable: "node" },
      }),
      /must be absolute/,
    );
    assert.throws(
      () => validateFixture012ProcessAdapterConfig({
        ...config,
        effective_environment: {
          allowlist: ["NODE_OPTIONS"],
          values: { NODE_OPTIONS: "--require injected.js" },
        },
      }),
      /unsafe/,
    );
  } finally {
    await cleanup(context);
  }
});

test("real process-adapter and CLI fixture integration supports spaces and revalidates bindings", async () => {
  const context = await makeContext("cli-spaces");
  try {
    const adapter = await processAdapterConfig(context);
    const experimentPath = path.join(context.parent, "experiment config with spaces.json");
    await writeFile(experimentPath, `${JSON.stringify(context.config, null, 2)}\n`);
    const argvBase = [
      "node", "workstation-cli.mjs",
      "prepare",
      "--config", relative(experimentPath),
      "--adapter-config", relative(adapter.configPath),
    ];
    const prepared = await workstationCli(argvBase, { fixtureProcessExecution: true });
    assert.equal(prepared.layouts, 4);
    const acquired = await workstationCli([
      "node", "workstation-cli.mjs", "acquire",
      "--config", relative(experimentPath),
      "--adapter-config", relative(adapter.configPath),
      "--output", relative(context.output),
    ], { fixtureProcessExecution: true });
    assert.equal(acquired.status, "complete");
    const validated = await workstationCli([
      "node", "workstation-cli.mjs", "validate",
      "--config", relative(experimentPath),
      "--output", relative(context.output),
    ]);
    assert.equal(validated.status, "complete");
    const ledgerPath = path.join(context.output, "raw-layouts.jsonl");
    const ledgerBody = await readFile(ledgerPath, "utf8");
    const records = ledgerBody.trimEnd().split("\n").map(JSON.parse);
    const first = records[0];
    assert.equal(first.measurements[0].latency_ns > 0, true);
    assert.equal(
      first.measurements[0].latency_ns,
      Number(BigInt(first.measurements[0].execution.attempt.monotonic_ended_ns)
        - BigInt(first.measurements[0].execution.attempt.monotonic_started_ns)),
    );

    await writeFile(path.join(context.output, "campaign.lock.json"), "{}\n", { flag: "wx" });
    await assert.rejects(
      () => workstationCli([
        "node", "workstation-cli.mjs", "acquire",
        "--config", relative(experimentPath),
        "--adapter-config", relative(adapter.configPath),
        "--output", relative(context.output),
      ], { fixtureProcessExecution: true }),
      /CAMPAIGN_LOCKED/,
    );
    await rm(path.join(context.output, "campaign.lock.json"));

    const run = JSON.parse(await readFile(path.join(context.output, "run.json"), "utf8"));
    await writeFile(
      path.join(context.output, "checkpoint.json"),
      `${JSON.stringify(checkpointDocument(run, records.slice(0, 1)), null, 2)}\n`,
    );
    const resumed = await workstationCli([
      "node", "workstation-cli.mjs", "acquire",
      "--config", relative(experimentPath),
      "--adapter-config", relative(adapter.configPath),
      "--output", relative(context.output),
    ], { fixtureProcessExecution: true });
    assert.equal(resumed.status, "complete");
    const repairedCheckpoint = JSON.parse(await readFile(path.join(context.output, "checkpoint.json"), "utf8"));
    assert.equal(repairedCheckpoint.records, records.length);

    const adapterConfigBody = await readFile(adapter.configPath, "utf8");
    const changedAdapterConfig = JSON.parse(adapterConfigBody);
    changedAdapterConfig.adapter_version = "2.0.1-corrupted";
    await writeFile(adapter.configPath, `${JSON.stringify(changedAdapterConfig, null, 2)}\n`);
    await assert.rejects(
      () => workstationCli([
        "node", "workstation-cli.mjs", "validate",
        "--config", relative(experimentPath),
        "--output", relative(context.output),
      ]),
      /ADAPTER_BINDING_MISMATCH/,
    );
    await writeFile(adapter.configPath, adapterConfigBody);

    const corrupted = structuredClone(records);
    corrupted[0].measurements[0].latency_ns += 1;
    await writeFile(ledgerPath, `${corrupted.map(JSON.stringify).join("\n")}\n`);
    await assert.rejects(
      () => workstationCli([
        "node", "workstation-cli.mjs", "validate",
        "--config", relative(experimentPath),
        "--output", relative(context.output),
      ]),
      /latency mismatch|record digest mismatch/,
    );

    const semanticallyCorrupted = structuredClone(records);
    semanticallyCorrupted[0].measurements[0].execution.attempt.command_sha256 = sha256("unbound-command");
    const rehashedCorruption = rehashLedger(semanticallyCorrupted);
    await writeFile(ledgerPath, `${rehashedCorruption.map(JSON.stringify).join("\n")}\n`);
    await writeFile(
      path.join(context.output, "checkpoint.json"),
      `${JSON.stringify(checkpointDocument(run, rehashedCorruption), null, 2)}\n`,
    );
    await assert.rejects(
      () => workstationCli([
        "node", "workstation-cli.mjs", "validate",
        "--config", relative(experimentPath),
        "--output", relative(context.output),
      ]),
      /COMMAND_BINDING_MISMATCH/,
    );
  } finally {
    await cleanup(context);
  }
});

test("CLI refuses outputs outside runs and link or junction ancestors", async () => {
  const context = await makeContext("containment");
  try {
    const experimentPath = path.join(context.parent, "experiment.json");
    await writeFile(experimentPath, `${JSON.stringify(context.config, null, 2)}\n`);
    await assert.rejects(
      () => workstationCli([
        "node", "workstation-cli.mjs", "validate",
        "--config", relative(experimentPath),
        "--output", relative(context.parent),
      ]),
      /must be a child/,
    );
    const target = path.join(context.parent, "junction target");
    await mkdir(target);
    const junction = path.join(runsRoot, `${path.basename(context.parent)} junction`);
    await symlink(target, junction, process.platform === "win32" ? "junction" : "dir");
    context.junction = junction;
    await assert.rejects(
      () => workstationCli([
        "node", "workstation-cli.mjs", "validate",
        "--config", relative(experimentPath),
        "--output", relative(path.join(junction, "run")),
      ]),
      /symbolic link|junction|reparse/,
    );
  } finally {
    if (context.junction) await rm(context.junction, { force: true });
    await cleanup(context);
  }
});

test("real Windows CLI remains fail-closed without a Job Object supervisor", async () => {
  if (process.platform !== "win32") return;
  const context = await makeContext("windows-job-object");
  try {
    const adapter = await processAdapterConfig(context);
    const experimentPath = path.join(context.parent, "experiment.json");
    await writeFile(experimentPath, `${JSON.stringify(context.config, null, 2)}\n`);
    await assert.rejects(
      () => workstationCli([
        "node", "workstation-cli.mjs", "prepare",
        "--config", relative(experimentPath),
        "--adapter-config", relative(adapter.configPath),
      ]),
      /WINDOWS_JOB_OBJECT_REQUIRED|Job Object/,
    );
  } finally {
    await cleanup(context);
  }
});

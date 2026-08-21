import { createHash } from "node:crypto";
import { access, mkdir, readFile, statfs, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { performance } from "node:perf_hooks";
import {
  deterministicWorkUnits,
  openCheckpointLedger,
  remainingWorkUnits,
} from "./checkpoint.mjs";
import { evaluateExternalEnergyReading } from "./energy-provider.mjs";
import { buildFactorialDesign } from "./factorial-design.mjs";
import {
  analyzeFactorialRun,
  runFactorialExperiment,
  validateFactorialRun,
} from "./factorial-runner.mjs";
import { generateOpportunities } from "./generator.mjs";
import { executeFilesystemTrial } from "./filesystem-track.mjs";
import { armNames, decide, scoreDecision, shouldRevealTrace } from "./policies.mjs";

const root = process.cwd();
const benchmarkRoot = path.join(root, "experiments", "workstation", "candidate-010");

function parseArgs(argv) {
  const action = argv[2];
  const options = {};
  for (let index = 3; index < argv.length; index += 2) {
    const key = argv[index]?.replace(/^--/, "");
    options[key] = argv[index + 1];
  }
  return { action, options };
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function loadJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function assertNewDirectory(directory) {
  try {
    await access(directory);
    throw new Error(`Output directory already exists; append-only runs cannot overwrite it: ${directory}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await mkdir(directory, { recursive: true });
}

export function scientificPayload(event) {
  return {
    opportunity_id: event.opportunity_id,
    seed: event.seed,
    arm: event.arm,
    truth_unsafe: event.truth_unsafe,
    evidence: event.evidence,
    trace: event.trace,
    decision: event.decision,
    outcome: event.outcome,
    resources: {
      observations: event.resources.observations,
      verifier_calls: event.resources.verifier_calls,
      modeled_energy_j: event.resources.modeled_energy_j,
      durable_bytes_written: event.resources.durable_bytes_written,
      staged_bytes_written: event.resources.staged_bytes_written,
    },
    filesystem: {
      boundary: event.filesystem.boundary,
      trace_revealed: event.filesystem.trace_revealed,
      trace_output_sha256: event.filesystem.trace_output_sha256,
      staged_bytes_written: event.filesystem.staged_bytes_written,
      durable_bytes_written: event.filesystem.durable_bytes_written,
      stageExists: event.filesystem.stageExists,
      durableExists: event.filesystem.durableExists,
      rollbackComplete: event.filesystem.rollbackComplete,
      commitComplete: event.filesystem.commitComplete,
    },
  };
}

function workKey(event) {
  return `${event.opportunity_id}\u0000${event.arm}`;
}

async function loadOptionalJson(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

export async function runExperiment({
  config,
  seeds,
  outputDirectory,
  resume = false,
  stopAfterRecords = null,
}) {
  if (stopAfterRecords !== null && (!Number.isInteger(stopAfterRecords) || stopAfterRecords < 1)) {
    throw new Error("stopAfterRecords must be a positive integer when supplied.");
  }
  if (resume) await access(outputDirectory);
  else await assertNewDirectory(outputDirectory);
  const rawDirectory = path.join(outputDirectory, "raw");
  const provenanceDirectory = path.join(outputDirectory, "provenance");
  const filesystemDirectory = path.join(outputDirectory, "filesystem");
  await mkdir(rawDirectory, { recursive: true });
  await mkdir(provenanceDirectory, { recursive: true });
  const rawPath = path.join(rawDirectory, "events.ndjson");
  const checkpointPath = path.join(provenanceDirectory, "checkpoint.json");
  const runPath = path.join(provenanceDirectory, "run.json");
  const configPath = path.join(provenanceDirectory, "config.json");
  const seedsPath = path.join(provenanceDirectory, "seeds.json");
  const environmentPath = path.join(provenanceDirectory, "environment.json");
  const requestedIdentity = {
    profile: config.profile,
    config_sha256: sha256(canonical(config)),
    ordered_seed_pack_sha256: sha256(canonical(seeds)),
    schedule: "seed-opportunity-arm-v1",
  };
  let environment;

  if (resume) {
    const existingConfig = await loadJson(configPath);
    const existingSeeds = await loadJson(seedsPath);
    environment = await loadJson(environmentPath);
    if (canonical(existingConfig) !== canonical(config)) {
      throw new Error("Resume config differs from the frozen run config.");
    }
    if (canonical(existingSeeds) !== canonical({ seeds })) {
      throw new Error("Resume seed order differs from the frozen run seed pack.");
    }
  } else {
    environment = {
      node: process.version,
      versions: process.versions,
      platform: process.platform,
      arch: process.arch,
      os_release: os.release(),
      cpus: os.cpus().length,
      run_started_utc: new Date().toISOString(),
      energy_measurement: null,
      energy_unavailable_reason: "Smoke/development runner has no calibrated joule meter; modeled and measured energy remain separate.",
    };
    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, { flag: "wx" });
    await writeFile(seedsPath, `${JSON.stringify({ seeds }, null, 2)}\n`, { flag: "wx" });
    await writeFile(environmentPath, `${JSON.stringify(environment, null, 2)}\n`, { flag: "wx" });
  }

  const ledger = await openCheckpointLedger({
    rawPath,
    checkpointPath,
    scientificPayload,
    workKey,
    runIdentity: requestedIdentity,
  });
  const completedRun = await loadOptionalJson(runPath);
  if (completedRun) {
    if (!resume) throw new Error("Completed run provenance already exists.");
    const state = ledger.summary();
    if (
      completedRun.records !== state.records
      || completedRun.scientific_payload_sha256 !== state.scientific_payload_sha256
      || completedRun.hash_chain_sha256 !== state.hash_chain_sha256
    ) {
      throw new Error("Completed run provenance disagrees with the append-only ledger.");
    }
    return { run: completedRun, rawPath, complete: true, resumed: true };
  }

  const schedule = deterministicWorkUnits({ seeds, config, arms: armNames, generateOpportunities });
  const remaining = remainingWorkUnits(schedule, ledger.completedWorkKeys());
  const checkpointInterval = config.checkpoint_interval_records ?? 64;
  let processedThisInvocation = 0;

  for (const { seed, opportunity, arm, key } of remaining) {
        const start = performance.now();
        const policyOpportunity = {
          id: opportunity.id,
          evidence: opportunity.evidence,
          ...(arm === "oracle-ceiling" ? { unsafe: opportunity.unsafe } : {}),
        };
        const revealTrace = shouldRevealTrace(arm, policyOpportunity, config);
        const trial = await executeFilesystemTrial({
          root: filesystemDirectory,
          opportunity,
          arm,
          config,
          revealTrace,
          decideWithTrace: (revealedVerifier) => decide(arm, policyOpportunity, config, revealedVerifier),
        });
        const { decision, filesystem, revealedVerifier } = trial;
        const scored = scoreDecision(opportunity, decision, config);
        const event = {
          schema: 1,
          artifact: "candidate-010",
          profile: config.profile,
          opportunity_id: opportunity.id,
          seed,
          arm,
          truth_unsafe: opportunity.unsafe,
          evidence: opportunity.evidence,
          trace: {
            revealed: revealTrace,
            verifier: revealedVerifier,
            output_sha256: filesystem.trace_output_sha256,
          },
          decision: {
            commit: decision.commit,
            abstain: decision.abstain,
            stage: decision.stage,
            reset: decision.reset,
            reason: decision.reason,
            score: decision.score,
          },
          outcome: {
            false_commit: scored.falseCommit,
            false_reject: scored.falseReject,
            consequence_weighted_loss: scored.loss,
            rollback_violation: decision.reset && !filesystem.rollbackComplete,
          },
          resources: {
            observations: decision.observations,
            verifier_calls: decision.verifier_calls,
            modeled_energy_j: scored.modeledEnergy,
            measured_energy_j: null,
            cpu_elapsed_ms: performance.now() - start,
            durable_bytes_written: filesystem.durable_bytes_written,
            staged_bytes_written: filesystem.staged_bytes_written,
            filesystem_stage_ms: filesystem.stage_elapsed_ms,
            temporary_execution_ms: filesystem.temporary_execution_elapsed_ms,
            filesystem_finalize_ms: filesystem.finalize_elapsed_ms,
            filesystem_boundary_ms: filesystem.boundary_elapsed_ms,
          },
          filesystem,
        };
        await ledger.append(event);
        processedThisInvocation += 1;
        const state = ledger.summary();
        if (state.records % checkpointInterval === 0) {
          await ledger.saveCheckpoint({ last_completed_work_key: key, complete: false });
        }
        if (stopAfterRecords !== null && state.records >= stopAfterRecords) {
          await ledger.saveCheckpoint({ last_completed_work_key: key, complete: false });
          return {
            run: {
              schema: 1,
              artifact: "candidate-010",
              profile: config.profile,
              status: "interrupted-at-declared-test-boundary",
              records: state.records,
              expected_records: seeds.length * config.opportunities_per_seed * armNames.length,
              scientific_payload_sha256: state.scientific_payload_sha256,
              hash_chain_sha256: state.hash_chain_sha256,
            },
            rawPath,
            complete: false,
            resumed: resume,
            processed_this_invocation: processedThisInvocation,
          };
        }
  }

  const ledgerState = ledger.summary();
  const expectedRecords = seeds.length * config.opportunities_per_seed * armNames.length;
  if (ledgerState.records !== expectedRecords) {
    throw new Error(`Completed schedule produced ${ledgerState.records} records; expected ${expectedRecords}.`);
  }
  await ledger.saveCheckpoint({ complete: true });
  const run = {
    schema: 1,
    artifact: "candidate-010",
    readiness: "smoke-ready",
    profile: config.profile,
    started_utc: environment.run_started_utc,
    completed_utc: new Date().toISOString(),
    seed_count: seeds.length,
    opportunities: seeds.length * config.opportunities_per_seed,
    arms: armNames.length,
    records: ledgerState.records,
    config_sha256: sha256(canonical(config)),
    ordered_seed_pack_sha256: requestedIdentity.ordered_seed_pack_sha256,
    scientific_payload_sha256: ledgerState.scientific_payload_sha256,
    hash_chain_sha256: ledgerState.hash_chain_sha256,
    measured_energy_j: null,
    resume_supported: true,
  };
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, { flag: "wx" });
  return { run, rawPath, complete: true, resumed: resume, processed_this_invocation: processedThisInvocation };
}

function evaluateEnergyForRun(reading, run) {
  const energy = evaluateExternalEnergyReading(reading);
  const measurementStart = Date.parse(energy.measured.interval_started_at);
  const measurementEnd = Date.parse(energy.measured.interval_ended_at);
  const runStart = Date.parse(run.started_utc);
  const runEnd = Date.parse(run.completed_utc);
  if (![measurementStart, measurementEnd, runStart, runEnd].every(Number.isFinite)) {
    throw new Error("Run and energy intervals must have valid explicit timestamps.");
  }
  if (measurementStart > runStart || measurementEnd < runEnd) {
    throw new Error("External energy interval does not contain the complete run interval.");
  }
  return {
    ...energy,
    raw_reading_sha256: sha256(canonical(reading)),
    run_interval_contained: true,
    allocation: "whole-run-only",
    arm_level_energy_claim_eligible: false,
  };
}

export async function attachEnergyReading(outputDirectory, readingPath) {
  const provenanceDirectory = path.join(outputDirectory, "provenance");
  const run = await loadJson(path.join(provenanceDirectory, "run.json"));
  const reading = await loadJson(readingPath);
  const normalized = evaluateEnergyForRun(reading, run);
  const rawDestination = path.join(provenanceDirectory, "external-energy-reading.json");
  const normalizedDestination = path.join(provenanceDirectory, "energy.json");
  const existingRaw = await loadOptionalJson(rawDestination);
  const existingNormalized = await loadOptionalJson(normalizedDestination);
  if (existingRaw || existingNormalized) {
    if (canonical(existingRaw) !== canonical(reading) || canonical(existingNormalized) !== canonical(normalized)) {
      throw new Error("A different external energy reading is already bound to this run.");
    }
    return normalized;
  }
  await writeFile(rawDestination, `${JSON.stringify(reading, null, 2)}\n`, { flag: "wx" });
  await writeFile(normalizedDestination, `${JSON.stringify(normalized, null, 2)}\n`, { flag: "wx" });
  return normalized;
}

export async function analyzeRun(outputDirectory) {
  const rawPath = path.join(outputDirectory, "raw", "events.ndjson");
  const lines = (await readFile(rawPath, "utf8")).trim().split(/\r?\n/).filter(Boolean);
  const byArm = new Map();
  for (const line of lines) {
    const event = JSON.parse(line);
    const row = byArm.get(event.arm) ?? { opportunities: 0, false_commits: 0, false_rejects: 0, abstentions: 0, rollback_violations: 0, loss: 0, verifier_calls: 0, modeled_energy_j: 0, staged_bytes_written: 0, durable_bytes_written: 0, filesystem_boundary_ms: 0 };
    row.opportunities += 1;
    row.false_commits += Number(event.outcome.false_commit);
    row.false_rejects += Number(event.outcome.false_reject);
    row.abstentions += Number(event.decision.abstain);
    row.rollback_violations += Number(event.outcome.rollback_violation);
    row.loss += event.outcome.consequence_weighted_loss;
    row.verifier_calls += event.resources.verifier_calls;
    row.modeled_energy_j += event.resources.modeled_energy_j;
    row.staged_bytes_written += event.resources.staged_bytes_written;
    row.durable_bytes_written += event.resources.durable_bytes_written;
    row.filesystem_boundary_ms += event.resources.filesystem_boundary_ms;
    byArm.set(event.arm, row);
  }
  const energy = await loadOptionalJson(path.join(outputDirectory, "provenance", "energy.json"));
  const summary = {
    schema: 1,
    artifact: "candidate-010",
    interpretation: energy
      ? "Smoke/development diagnostic only; the external reading covers the whole run and cannot support arm-level superiority or energy claims."
      : "Smoke/development diagnostic only; no superiority or energy claim.",
    measured_energy_j: energy?.measured?.value_j ?? null,
    external_energy: energy,
    arms: Object.fromEntries([...byArm.entries()].map(([arm, row]) => [arm, {
      ...row,
      mean_loss: row.loss / row.opportunities,
      mean_staged_bytes_written: row.staged_bytes_written / row.opportunities,
      mean_filesystem_boundary_ms: row.filesystem_boundary_ms / row.opportunities,
      false_commit_rate: row.false_commits / row.opportunities,
      false_reject_rate: row.false_rejects / row.opportunities,
    }])),
  };
  const analysisDirectory = path.join(outputDirectory, "analysis");
  await mkdir(analysisDirectory, { recursive: true });
  await writeFile(path.join(analysisDirectory, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  return summary;
}

export async function validateRun(outputDirectory) {
  const rawPath = path.join(outputDirectory, "raw", "events.ndjson");
  const runPath = path.join(outputDirectory, "provenance", "run.json");
  const lines = (await readFile(rawPath, "utf8")).trim().split(/\r?\n/).filter(Boolean);
  const run = await loadJson(runPath);
  const digest = createHash("sha256");
  const keys = new Set();
  const errors = [];
  const stagedBytesByOpportunity = new Map();
  const traceHashesByOpportunity = new Map();
  let previousRecordHash = "0".repeat(64);
  const externalEnergyReading = await loadOptionalJson(path.join(outputDirectory, "provenance", "external-energy-reading.json"));
  const normalizedEnergy = await loadOptionalJson(path.join(outputDirectory, "provenance", "energy.json"));

  if (Boolean(externalEnergyReading) !== Boolean(normalizedEnergy)) {
    errors.push("external energy provenance is incomplete");
  } else if (externalEnergyReading && normalizedEnergy) {
    try {
      const expectedEnergy = evaluateEnergyForRun(externalEnergyReading, run);
      if (canonical(expectedEnergy) !== canonical(normalizedEnergy)) {
        errors.push("normalized external energy provenance does not match its raw reading");
      }
    } catch (error) {
      errors.push(`external energy provenance is invalid: ${error.message}`);
    }
  }

  for (const [index, line] of lines.entries()) {
    let event;
    try {
      event = JSON.parse(line);
    } catch (error) {
      errors.push(`raw line ${index + 1} is invalid JSON: ${error.message}`);
      continue;
    }
    const key = `${event.opportunity_id}\u0000${event.arm}`;
    if (keys.has(key)) errors.push(`duplicate work unit: ${event.opportunity_id}/${event.arm}`);
    keys.add(key);
    if (event.schema !== 1 || event.artifact !== "candidate-010") {
      errors.push(`raw line ${index + 1} has the wrong schema or artifact`);
    }
    if (!armNames.includes(event.arm)) errors.push(`raw line ${index + 1} has unknown arm ${event.arm}`);
    if (!event.filesystem || event.filesystem.boundary !== "filesystem-stage-execute-finalize-v1") {
      errors.push(`work unit did not cross the declared filesystem boundary: ${event.opportunity_id}/${event.arm}`);
    }
    if (event.decision?.stage !== true || event.decision?.reset === event.decision?.commit) {
      errors.push(`work unit did not stage then choose exactly one finalization: ${event.opportunity_id}/${event.arm}`);
    }
    if (event.decision?.reset && event.filesystem?.rollbackComplete !== true) {
      errors.push(`reset did not restore pre-state: ${event.opportunity_id}/${event.arm}`);
    }
    if (event.decision?.commit && event.filesystem?.commitComplete !== true) {
      errors.push(`commit did not cross the filesystem boundary: ${event.opportunity_id}/${event.arm}`);
    }
    if (event.trace?.revealed !== event.filesystem?.trace_revealed) {
      errors.push(`trace revelation record disagrees with filesystem record: ${event.opportunity_id}/${event.arm}`);
    }
    if (event.trace?.output_sha256 !== event.filesystem?.trace_output_sha256) {
      errors.push(`trace digest disagrees with filesystem record: ${event.opportunity_id}/${event.arm}`);
    }
    if (
      !Number.isFinite(event.resources?.filesystem_boundary_ms)
      || event.resources.filesystem_boundary_ms < 0
      || event.resources?.staged_bytes_written !== event.filesystem?.staged_bytes_written
      || event.resources?.durable_bytes_written !== event.filesystem?.durable_bytes_written
    ) {
      errors.push(`filesystem cost report is invalid: ${event.opportunity_id}/${event.arm}`);
    }
    if (event.trace?.revealed ? !Number.isFinite(event.trace.verifier) : event.trace?.verifier !== null) {
      errors.push(`trace verifier visibility is invalid: ${event.opportunity_id}/${event.arm}`);
    }
    const byteSet = stagedBytesByOpportunity.get(event.opportunity_id) ?? new Set();
    byteSet.add(event.resources?.staged_bytes_written);
    stagedBytesByOpportunity.set(event.opportunity_id, byteSet);
    const traceHashes = traceHashesByOpportunity.get(event.opportunity_id) ?? new Set();
    traceHashes.add(event.filesystem?.trace_output_sha256);
    traceHashesByOpportunity.set(event.opportunity_id, traceHashes);
    let payload;
    try {
      payload = canonical(scientificPayload(event));
    } catch (error) {
      errors.push(`raw line ${index + 1} is structurally incomplete: ${error.message}`);
      continue;
    }
    const expectedRecordHash = sha256(`${previousRecordHash}\n${payload}`);
    if (
      event.integrity?.sequence !== index
      || event.integrity?.previous_sha256 !== previousRecordHash
      || event.integrity?.record_sha256 !== expectedRecordHash
    ) {
      errors.push(`hash-chain mismatch at raw line ${index + 1}`);
    }
    previousRecordHash = expectedRecordHash;
    digest.update(payload);
  }

  for (const [opportunityId, byteSet] of stagedBytesByOpportunity) {
    if (byteSet.size !== 1) errors.push(`filesystem staging cost is not byte-comparable across arms: ${opportunityId}`);
  }
  for (const [opportunityId, traceHashes] of traceHashesByOpportunity) {
    if (traceHashes.size !== 1) errors.push(`temporary execution differs across arms: ${opportunityId}`);
  }

  const expectedRecords = run.opportunities * run.arms;
  if (lines.length !== run.records || lines.length !== expectedRecords) {
    errors.push(`record count ${lines.length} does not match provenance ${run.records} and matrix ${expectedRecords}`);
  }
  const scientificDigest = digest.digest("hex");
  if (scientificDigest !== run.scientific_payload_sha256) {
    errors.push("scientific payload digest does not match provenance");
  }
  if (previousRecordHash !== run.hash_chain_sha256) {
    errors.push("final hash-chain digest does not match provenance");
  }

  const validation = {
    schema: 1,
    artifact: "candidate-010",
    valid: errors.length === 0,
    errors,
    records: lines.length,
    unique_work_units: keys.size,
    scientific_payload_sha256: scientificDigest,
    hash_chain_sha256: previousRecordHash,
    external_energy_bound: Boolean(externalEnergyReading && normalizedEnergy),
    arm_level_energy_claim_eligible: false,
  };
  const analysisDirectory = path.join(outputDirectory, "analysis");
  await mkdir(analysisDirectory, { recursive: true });
  await writeFile(path.join(analysisDirectory, "validation.json"), `${JSON.stringify(validation, null, 2)}\n`);
  if (errors.length) throw new Error(`Run validation failed:\n- ${errors.join("\n- ")}`);
  return validation;
}

async function prepare(profile) {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 22) throw new Error(`Node >=22 is required; found ${process.version}`);
  const disk = await statfs(root);
  const freeBytes = Number(disk.bavail) * Number(disk.bsize);
  if (freeBytes < 100 * 1024 * 1024) throw new Error("At least 100 MiB free disk is required for the smoke profile.");
  const config = await loadJson(path.join(benchmarkRoot, "configs", `${profile}.json`));
  if (config.artifact !== "candidate-010" || config.profile !== profile) throw new Error("Config identity mismatch.");
  return { node: process.version, free_bytes: freeBytes, profile, energy_measurement: "unavailable" };
}

async function main() {
  const { action, options } = parseArgs(process.argv);
  const profile = options.profile ?? (action === "smoke" ? "smoke" : "development");
  if (action === "prepare") {
    console.log(JSON.stringify(await prepare(profile), null, 2));
    return;
  }
  if (action === "analyze") {
    if (!options.output) throw new Error("analyze requires --output <run-directory>");
    const output = path.resolve(options.output);
    const runDocument = await loadJson(path.join(output, "provenance", "run.json"));
    if (runDocument.run_kind === "factorial-diagnostic-v1") {
      if (options["energy-reading"]) {
        throw new Error("Factorial energy must be bound per assigned interval; whole-run allocation is not supported.");
      }
      console.log(JSON.stringify(await analyzeFactorialRun(output), null, 2));
      return;
    }
    if (options["energy-reading"]) {
      await attachEnergyReading(output, path.resolve(options["energy-reading"]));
    }
    console.log(JSON.stringify(await analyzeRun(output), null, 2));
    return;
  }
  if (action === "validate") {
    if (!options.output) throw new Error("validate requires --output <run-directory>");
    const output = path.resolve(options.output);
    const runDocument = await loadJson(path.join(output, "provenance", "run.json"));
    if (runDocument.run_kind === "factorial-diagnostic-v1") {
      if (options["energy-reading"]) {
        throw new Error("Factorial energy must be bound per assigned interval; whole-run allocation is not supported.");
      }
      console.log(JSON.stringify(await validateFactorialRun(output), null, 2));
      return;
    }
    if (options["energy-reading"]) {
      await attachEnergyReading(output, path.resolve(options["energy-reading"]));
    }
    console.log(JSON.stringify(await validateRun(output), null, 2));
    return;
  }
  if (action !== "smoke" && action !== "run" && action !== "factorial") {
    throw new Error("Action must be prepare, smoke, run, factorial, analyze, or validate.");
  }
  await prepare(profile);
  const config = await loadJson(path.join(benchmarkRoot, "configs", `${profile}.json`));
  const seedFile = profile === "smoke" ? "smoke.json" : "development.json";
  const seeds = (await loadJson(path.join(benchmarkRoot, "seeds", seedFile))).seeds;
  const resume = options.resume === "true";
  const stopAfterRecords = options["stop-after-records"] === undefined
    ? null
    : Number(options["stop-after-records"]);
  if (resume && !options.output) throw new Error("--resume true requires --output <existing-run-directory>.");
  const output = options.output
    ? path.resolve(options.output)
    : path.join(root, "experiments", "workstation", "runs", `candidate-010-${profile}-${Date.now()}`);
  if (action === "factorial") {
    const splits = (options.splits ?? "development").split(",").map((value) => value.trim()).filter(Boolean);
    const scenarios = buildFactorialDesign({ splits });
    const executionMode = options["execution-mode"] ?? "development";
    const result = await runFactorialExperiment({
      config,
      seeds,
      scenarios,
      outputDirectory: output,
      executionMode,
      resume,
      stopAfterRecords,
    });
    if (!result.complete) {
      console.log(JSON.stringify({
        output,
        run: result.run,
        resume_command: `node experiments/workstation/candidate-010/runner.mjs factorial --profile ${profile} --splits ${splits.join(",")} --output ${output} --execution-mode ${executionMode} --resume true`,
      }, null, 2));
      return;
    }
    const summary = await analyzeFactorialRun(output);
    const validation = await validateFactorialRun(output);
    console.log(JSON.stringify({ output, run: result.run, summary, validation }, null, 2));
    return;
  }
  const result = await runExperiment({
    config,
    seeds,
    outputDirectory: output,
    resume,
    stopAfterRecords,
  });
  if (!result.complete) {
    console.log(JSON.stringify({ output, run: result.run, resume_command: `node experiments/workstation/candidate-010/runner.mjs ${action} --profile ${profile} --output ${output} --resume true` }, null, 2));
    return;
  }
  const summary = await analyzeRun(output);
  const validation = await validateRun(output);
  console.log(JSON.stringify({ output, run: result.run, summary, validation }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"))) {
  main().catch((error) => {
    console.error(error.stack ?? error.message);
    process.exitCode = 1;
  });
}

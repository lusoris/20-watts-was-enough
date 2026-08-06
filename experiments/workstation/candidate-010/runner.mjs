import { createHash } from "node:crypto";
import { access, appendFile, mkdir, readFile, statfs, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { performance } from "node:perf_hooks";
import { generateOpportunities } from "./generator.mjs";
import { executeFilesystemDecision } from "./filesystem-track.mjs";
import { armNames, decide, scoreDecision } from "./policies.mjs";

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

function scientificPayload(event) {
  return {
    opportunity_id: event.opportunity_id,
    seed: event.seed,
    arm: event.arm,
    truth_unsafe: event.truth_unsafe,
    evidence: event.evidence,
    verifier: event.verifier,
    decision: event.decision,
    outcome: event.outcome,
    resources: {
      observations: event.resources.observations,
      verifier_calls: event.resources.verifier_calls,
      modeled_energy_j: event.resources.modeled_energy_j,
      durable_bytes_written: event.resources.durable_bytes_written,
      staged_bytes_written: event.resources.staged_bytes_written,
    },
    filesystem: event.filesystem,
  };
}

export async function runExperiment({ config, seeds, outputDirectory }) {
  await assertNewDirectory(outputDirectory);
  const rawDirectory = path.join(outputDirectory, "raw");
  const provenanceDirectory = path.join(outputDirectory, "provenance");
  const filesystemDirectory = path.join(outputDirectory, "filesystem");
  await mkdir(rawDirectory, { recursive: true });
  await mkdir(provenanceDirectory, { recursive: true });
  const rawPath = path.join(rawDirectory, "events.ndjson");
  const started = new Date().toISOString();
  const digest = createHash("sha256");
  let records = 0;

  await writeFile(path.join(provenanceDirectory, "config.json"), `${JSON.stringify(config, null, 2)}\n`, { flag: "wx" });
  await writeFile(path.join(provenanceDirectory, "seeds.json"), `${JSON.stringify({ seeds }, null, 2)}\n`, { flag: "wx" });
  await writeFile(
    path.join(provenanceDirectory, "environment.json"),
    `${JSON.stringify({ node: process.version, versions: process.versions, platform: process.platform, arch: process.arch, os_release: os.release(), cpus: os.cpus().length, energy_measurement: null, energy_unavailable_reason: "Smoke/development runner has no calibrated joule meter; modeled and measured energy remain separate." }, null, 2)}\n`,
    { flag: "wx" },
  );

  for (const seed of seeds) {
    const opportunities = generateOpportunities(config, seed);
    for (const opportunity of opportunities) {
      for (const arm of armNames) {
        const start = performance.now();
        const decision = decide(arm, opportunity, config);
        const filesystem = arm === "reset-coupled"
          ? await executeFilesystemDecision(filesystemDirectory, opportunity, decision)
          : null;
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
          verifier: opportunity.verifier,
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
            rollback_violation: filesystem ? !filesystem.rollbackComplete : false,
          },
          resources: {
            observations: decision.observations,
            verifier_calls: decision.verifier_calls,
            modeled_energy_j: scored.modeledEnergy,
            measured_energy_j: null,
            cpu_elapsed_ms: performance.now() - start,
            durable_bytes_written: filesystem?.durableExists ? filesystem.bytesWritten : 0,
            staged_bytes_written: filesystem?.bytesWritten ?? 0,
          },
          filesystem,
        };
        const line = `${JSON.stringify(event)}\n`;
        await appendFile(rawPath, line, { encoding: "utf8" });
        digest.update(canonical(scientificPayload(event)));
        records += 1;
      }
    }
  }

  const run = {
    schema: 1,
    artifact: "candidate-010",
    readiness: "smoke-ready",
    profile: config.profile,
    started_utc: started,
    completed_utc: new Date().toISOString(),
    seed_count: seeds.length,
    opportunities: seeds.length * config.opportunities_per_seed,
    arms: armNames.length,
    records,
    config_sha256: sha256(canonical(config)),
    scientific_payload_sha256: digest.digest("hex"),
    measured_energy_j: null,
  };
  await writeFile(path.join(provenanceDirectory, "run.json"), `${JSON.stringify(run, null, 2)}\n`, { flag: "wx" });
  return { run, rawPath };
}

export async function analyzeRun(outputDirectory) {
  const rawPath = path.join(outputDirectory, "raw", "events.ndjson");
  const lines = (await readFile(rawPath, "utf8")).trim().split(/\r?\n/).filter(Boolean);
  const byArm = new Map();
  for (const line of lines) {
    const event = JSON.parse(line);
    const row = byArm.get(event.arm) ?? { opportunities: 0, false_commits: 0, false_rejects: 0, abstentions: 0, rollback_violations: 0, loss: 0, verifier_calls: 0, modeled_energy_j: 0 };
    row.opportunities += 1;
    row.false_commits += Number(event.outcome.false_commit);
    row.false_rejects += Number(event.outcome.false_reject);
    row.abstentions += Number(event.decision.abstain);
    row.rollback_violations += Number(event.outcome.rollback_violation);
    row.loss += event.outcome.consequence_weighted_loss;
    row.verifier_calls += event.resources.verifier_calls;
    row.modeled_energy_j += event.resources.modeled_energy_j;
    byArm.set(event.arm, row);
  }
  const summary = {
    schema: 1,
    artifact: "candidate-010",
    interpretation: "Smoke/development diagnostic only; no superiority or energy claim.",
    measured_energy_j: null,
    arms: Object.fromEntries([...byArm.entries()].map(([arm, row]) => [arm, {
      ...row,
      mean_loss: row.loss / row.opportunities,
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
    if (event.decision?.reset && event.filesystem && event.filesystem.rollbackComplete !== true) {
      errors.push(`reset did not restore pre-state: ${event.opportunity_id}/${event.arm}`);
    }
    if (event.decision?.commit && event.arm === "reset-coupled" && event.filesystem?.commitComplete !== true) {
      errors.push(`commit did not cross the filesystem boundary: ${event.opportunity_id}/${event.arm}`);
    }
    digest.update(canonical(scientificPayload(event)));
  }

  const expectedRecords = run.opportunities * run.arms;
  if (lines.length !== run.records || lines.length !== expectedRecords) {
    errors.push(`record count ${lines.length} does not match provenance ${run.records} and matrix ${expectedRecords}`);
  }
  const scientificDigest = digest.digest("hex");
  if (scientificDigest !== run.scientific_payload_sha256) {
    errors.push("scientific payload digest does not match provenance");
  }

  const validation = {
    schema: 1,
    artifact: "candidate-010",
    valid: errors.length === 0,
    errors,
    records: lines.length,
    unique_work_units: keys.size,
    scientific_payload_sha256: scientificDigest,
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
    console.log(JSON.stringify(await analyzeRun(path.resolve(options.output)), null, 2));
    return;
  }
  if (action === "validate") {
    if (!options.output) throw new Error("validate requires --output <run-directory>");
    console.log(JSON.stringify(await validateRun(path.resolve(options.output)), null, 2));
    return;
  }
  if (action !== "smoke" && action !== "run") throw new Error("Action must be prepare, smoke, run, analyze, or validate.");
  await prepare(profile);
  const config = await loadJson(path.join(benchmarkRoot, "configs", `${profile}.json`));
  const seedFile = profile === "smoke" ? "smoke.json" : "development.json";
  const seeds = (await loadJson(path.join(benchmarkRoot, "seeds", seedFile))).seeds;
  const output = options.output
    ? path.resolve(options.output)
    : path.join(root, "experiments", "workstation", "runs", `candidate-010-${profile}-${Date.now()}`);
  const result = await runExperiment({ config, seeds, outputDirectory: output });
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

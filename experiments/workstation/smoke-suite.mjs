import { spawn } from "node:child_process";
import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateAllExecutionManifests } from "../../scripts/lib/workstation-manifests.mjs";

const modulePath = fileURLToPath(import.meta.url);
const defaultRepositoryRoot = path.resolve(path.dirname(modulePath), "..", "..");
const artifactPattern = /^(?:candidate|fixture)-\d{3}$/u;
const runDirectoryToken = "<run-directory>";

function usage() {
  return [
    "Development smoke-suite orchestrator (NO_RESULT)",
    "",
    "List validated smoke harnesses:",
    "  node experiments/workstation/smoke-suite.mjs --list",
    "",
    "Run all or selected harnesses:",
    "  node experiments/workstation/smoke-suite.mjs --all --output-root <directory>",
    "  node experiments/workstation/smoke-suite.mjs --artifact fixture-027 --output-root <directory>",
    "",
    "Options: --dry-run, --fail-fast, --help",
  ].join("\n");
}

export function parseSmokeSuiteArguments(argv) {
  const options = {
    all: false,
    artifacts: [],
    dryRun: false,
    failFast: false,
    help: false,
    list: false,
    outputRoot: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--all") options.all = true;
    else if (argument === "--dry-run") options.dryRun = true;
    else if (argument === "--fail-fast") options.failFast = true;
    else if (argument === "--help" || argument === "-h") options.help = true;
    else if (argument === "--list") options.list = true;
    else if (argument === "--artifact") {
      const artifact = argv[index + 1];
      if (!artifact || artifact.startsWith("--")) throw new Error("--artifact requires an artifact ID");
      if (!artifactPattern.test(artifact)) throw new Error(`Invalid artifact ID: ${artifact}`);
      options.artifacts.push(artifact);
      index += 1;
    } else if (argument === "--output-root") {
      const outputRoot = argv[index + 1];
      if (!outputRoot || outputRoot.startsWith("--")) throw new Error("--output-root requires a directory");
      options.outputRoot = outputRoot;
      index += 1;
    } else throw new Error(`Unknown smoke-suite option: ${argument}`);
  }

  if (options.all && options.artifacts.length > 0) {
    throw new Error("Use either --all or one or more --artifact options, not both");
  }
  if (!options.all && options.artifacts.length === 0 && !options.help && !options.list) {
    throw new Error("Choose --all, --artifact <id>, --list, or --help");
  }
  if ((options.all || options.artifacts.length > 0) && !options.dryRun && !options.outputRoot) {
    throw new Error("A real run requires --output-root <directory>");
  }
  options.artifacts = [...new Set(options.artifacts)];
  return Object.freeze(options);
}

function commandTokens(command, entrypoint, runDirectory) {
  if (typeof command !== "string" || !command.trim()) throw new Error("Manifest command is empty");
  const commandForSyntaxCheck = command.split(runDirectoryToken).join("RUN_DIRECTORY");
  if (/[\r\n`]|\$\(|[|;&<>]/u.test(commandForSyntaxCheck)) {
    throw new Error(`Manifest command contains forbidden shell syntax: ${command}`);
  }
  const tokens = command.trim().split(/\s+/u).map((token) => (
    token === runDirectoryToken ? runDirectory : token
  ));
  if (tokens[0] !== "node") throw new Error(`Manifest command must start with node: ${command}`);
  if (tokens[1] !== entrypoint) {
    throw new Error(`Manifest command entrypoint ${tokens[1] ?? "<missing>"} does not match ${entrypoint}`);
  }
  if (tokens.some((token) => token.includes("<") || token.includes(">"))) {
    throw new Error(`Manifest command contains an unresolved placeholder: ${command}`);
  }
  return Object.freeze({ executable: process.execPath, args: Object.freeze(tokens.slice(1)) });
}

function planForManifest(repositoryRoot, manifest, outputRoot) {
  const outputDirectory = path.resolve(outputRoot, manifest.artifact);
  const smokeOwnsDirectory = manifest.command.smoke.includes(runDirectoryToken);
  const actionNames = smokeOwnsDirectory
    ? ["prepare", "smoke", "analyze", "validate"]
    : ["prepare", "smoke"];
  const actions = actionNames.map((action) => Object.freeze({
    action,
    ...commandTokens(manifest.command[action], manifest.implementation.entrypoint, outputDirectory),
  }));
  return Object.freeze({
    artifact: manifest.artifact,
    outputDirectory: smokeOwnsDirectory ? outputDirectory : null,
    readiness: manifest.readiness,
    actions: Object.freeze(actions),
    repositoryRoot,
  });
}

export async function loadSmokeSuitePlans({
  repositoryRoot = defaultRepositoryRoot,
  all = false,
  artifacts = [],
  outputRoot = path.join(repositoryRoot, "tmp", "workstation-smoke-suite-dry-run"),
} = {}) {
  const results = await validateAllExecutionManifests(repositoryRoot);
  const invalid = results.filter((result) => result.readiness === "invalid");
  if (invalid.length > 0) {
    throw new Error(`Execution manifest validation failed: ${invalid.map((item) => item.expectedArtifact).join(", ")}`);
  }
  const available = results
    .filter((result) => result.readiness === "smoke-ready")
    .map((result) => result.manifest)
    .sort((left, right) => left.artifact.localeCompare(right.artifact));
  const byArtifact = new Map(available.map((manifest) => [manifest.artifact, manifest]));
  const selectedIds = all ? [...byArtifact.keys()] : artifacts;
  const missing = selectedIds.filter((artifact) => !byArtifact.has(artifact));
  if (missing.length > 0) throw new Error(`Unknown or non-smoke-ready artifact: ${missing.join(", ")}`);
  return Object.freeze(selectedIds.map((artifact) => (
    planForManifest(repositoryRoot, byArtifact.get(artifact), outputRoot)
  )));
}

export async function runNodeAction(action, repositoryRoot) {
  return new Promise((resolve, reject) => {
    const child = spawn(action.executable, action.args, {
      cwd: repositoryRoot,
      shell: false,
      stdio: "inherit",
      windowsHide: true,
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({
      exitCode: Number.isInteger(code) ? code : 1,
      signal: signal ?? null,
    }));
  });
}

async function writeReceipt(outputRoot, receipt) {
  await mkdir(outputRoot, { recursive: true });
  const receiptPath = path.join(outputRoot, "smoke-suite.receipt.json");
  const temporaryPath = `${receiptPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "w" });
  await rename(temporaryPath, receiptPath);
  return receiptPath;
}

export async function executeSmokeSuite({
  plans,
  outputRoot,
  failFast = false,
  runAction = runNodeAction,
  now = () => new Date(),
}) {
  const receipt = {
    schema: 1,
    authority: "NO_RESULT: development smoke plumbing only; no claim, confirmation, comparison, or energy authority",
    started_at: now().toISOString(),
    completed_at: null,
    status: "running",
    runtime: { node: process.version, platform: process.platform, architecture: process.arch },
    results: [],
  };
  await writeReceipt(outputRoot, receipt);

  let failed = false;
  for (const plan of plans) {
    const artifactResult = {
      artifact: plan.artifact,
      readiness: plan.readiness,
      output_directory: plan.outputDirectory,
      status: "running",
      actions: [],
    };
    receipt.results.push(artifactResult);
    for (const action of plan.actions) {
      const actionResult = {
        action: action.action,
        argv: [process.execPath, ...action.args],
        started_at: now().toISOString(),
        completed_at: null,
        exit_code: null,
        signal: null,
      };
      artifactResult.actions.push(actionResult);
      let outcome;
      try {
        outcome = await runAction(action, plan.repositoryRoot);
      } catch (error) {
        outcome = { exitCode: 1, signal: null, error: error.message };
      }
      actionResult.completed_at = now().toISOString();
      actionResult.exit_code = outcome.exitCode;
      actionResult.signal = outcome.signal;
      if (outcome.error) actionResult.error = outcome.error;
      if (outcome.exitCode !== 0) {
        artifactResult.status = "failed";
        failed = true;
        break;
      }
      await writeReceipt(outputRoot, receipt);
    }
    if (artifactResult.status !== "failed") artifactResult.status = "passed";
    await writeReceipt(outputRoot, receipt);
    if (failed && failFast) break;
  }

  receipt.completed_at = now().toISOString();
  receipt.status = failed ? "failed" : "passed";
  const receiptPath = await writeReceipt(outputRoot, receipt);
  return Object.freeze({ receipt, receiptPath, exitCode: failed ? 1 : 0 });
}

async function main(argv = process.argv.slice(2)) {
  const options = parseSmokeSuiteArguments(argv);
  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return 0;
  }
  const plans = await loadSmokeSuitePlans({
    all: options.list ? true : options.all,
    artifacts: options.artifacts,
    outputRoot: options.outputRoot
      ? path.resolve(options.outputRoot)
      : path.join(defaultRepositoryRoot, "tmp", "workstation-smoke-suite-dry-run"),
  });
  if (options.list) {
    process.stdout.write(`${plans.map((plan) => plan.artifact).join("\n")}\n`);
    return 0;
  }
  if (options.dryRun) {
    process.stdout.write(`${JSON.stringify({ authority: "NO_RESULT", plans }, null, 2)}\n`);
    return 0;
  }
  const outcome = await executeSmokeSuite({
    plans,
    outputRoot: path.resolve(options.outputRoot),
    failFast: options.failFast,
  });
  process.stdout.write(`Smoke suite ${outcome.receipt.status}; receipt: ${outcome.receiptPath}\n`);
  return outcome.exitCode;
}

if (process.argv[1] && path.resolve(process.argv[1]) === modulePath) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createFixture012ProcessWorkstationAdapter } from "./process-workstation-adapter.mjs";
import {
  prepareFixture012WorkstationAcquisition,
  runFixture012WorkstationAcquisition,
  validateFixture012WorkstationConfig,
  validateFixture012WorkstationOutput,
} from "./workstation-acquisition.mjs";
import {
  assertSafePathBelow,
  ensureSafeDirectory,
  isPathInside,
} from "./workstation-path-safety.mjs";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(fixtureRoot, "../../..");
const runsRoot = path.join(repositoryRoot, "experiments", "workstation", "runs");

function parse(argv) {
  const action = argv[2];
  if (!["prepare", "acquire", "validate"].includes(action)) throw new Error("Action must be prepare, acquire, or validate.");
  if ((argv.length - 3) % 2 !== 0) throw new Error("Options require --name value pairs.");
  const options = {};
  for (let index = 3; index < argv.length; index += 2) {
    const token = argv[index];
    const value = argv[index + 1];
    if (!/^--[a-z][a-z-]*$/.test(token ?? "") || !value || value.startsWith("--")) throw new Error("Options require --name value pairs.");
    const key = token.slice(2);
    if (!new Set(["config", "adapter-config", "output"]).has(key) || Object.hasOwn(options, key)) throw new Error(`Unknown or duplicate option --${key}.`);
    options[key] = value;
  }
  if (!options.config) throw new Error(`${action} requires --config.`);
  if (action !== "validate" && !options["adapter-config"]) throw new Error(`${action} requires --adapter-config.`);
  if (action === "validate" && options["adapter-config"] !== undefined) throw new Error("validate does not accept --adapter-config.");
  if (action === "prepare" && options.output !== undefined) throw new Error("prepare does not accept --output.");
  if (action !== "prepare" && !options.output) throw new Error(`${action} requires --output.`);
  return { action, options };
}

async function repositoryJson(value, label) {
  const absolute = path.resolve(repositoryRoot, value);
  const file = await assertSafePathBelow({ root: repositoryRoot, target: absolute, label, finalType: "file" });
  return { value: JSON.parse(await readFile(file, "utf8")), file };
}

async function outputDirectory(value, { create }) {
  await ensureSafeDirectory({ root: repositoryRoot, target: runsRoot, label: "workstation runs root" });
  const absolute = path.resolve(repositoryRoot, value);
  if (!isPathInside(runsRoot, absolute) || absolute === runsRoot) {
    throw new Error("Output must be a child of experiments/workstation/runs.");
  }
  if (create) {
    return assertSafePathBelow({ root: runsRoot, target: absolute, label: "campaign output", allowMissing: true });
  }
  return assertSafePathBelow({ root: runsRoot, target: absolute, label: "campaign output", finalType: "directory" });
}

export async function main(argv = process.argv, { fixtureProcessExecution = false } = {}) {
  const { action, options } = parse(argv);
  const configFile = await repositoryJson(options.config, "--config");
  const config = configFile.value;
  validateFixture012WorkstationConfig(config);
  if (action === "validate") {
    return validateFixture012WorkstationOutput({
      config,
      output: await outputDirectory(options.output, { create: false }),
      repositoryRoot,
    });
  }
  const adapterConfigFile = await repositoryJson(options["adapter-config"], "--adapter-config");
  const adapterConfig = adapterConfigFile.value;
  const adapter = await createFixture012ProcessWorkstationAdapter({
    adapterConfig,
    experimentConfig: config,
    repositoryRoot,
    adapterConfigPath: adapterConfigFile.file,
    fixtureProcessExecution,
  });
  if (action === "prepare") {
    return prepareFixture012WorkstationAcquisition({
      config,
      adapter,
      allowFixtureAdapter: fixtureProcessExecution,
    });
  }
  return runFixture012WorkstationAcquisition({
    config,
    adapter,
    output: await outputDirectory(options.output, { create: true }),
    repositoryRoot,
    allowFixtureAdapter: fixtureProcessExecution,
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then(
    (result) => process.stdout.write(`${JSON.stringify(result)}\n`),
    (error) => {
      process.stderr.write(`${error.stack ?? error.message}\n`);
      process.exitCode = 1;
    },
  );
}

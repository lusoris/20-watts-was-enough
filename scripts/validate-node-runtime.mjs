import { pathToFileURL } from "node:url";

import {
  NODE_NUMERIC_SENTINEL,
  assertNodeRuntimePolicy,
} from "../experiments/workstation/lib/node-runtime-policy.mjs";

export function validateCurrentNodeRuntime() {
  return assertNodeRuntimePolicy();
}

function main() {
  try {
    const observation = validateCurrentNodeRuntime();
    console.log(
      `Node runtime validation passed: ${observation.node_version}; numeric sentinel ${NODE_NUMERIC_SENTINEL.id}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (invokedPath === import.meta.url) main();

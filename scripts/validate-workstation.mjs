import path from "node:path";
import { validateAllExecutionManifests } from "./lib/workstation-manifests.mjs";

const root = process.cwd();
const results = await validateAllExecutionManifests(root);
let failed = false;

for (const result of results) {
  if (result.errors.length) {
    failed = true;
    const relative = path.relative(root, result.path).replaceAll("\\", "/");
    for (const error of result.errors) console.error(`${relative}: ${error}`);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  const ready = results.filter((result) => result.ready).length;
  const smokeReady = results.filter((result) => result.readiness === "smoke-ready").length;
  console.log(
    `Workstation manifest validation passed: ${results.length} manifest(s), ${smokeReady} smoke-ready, ${ready} workstation-ready.`,
  );
}

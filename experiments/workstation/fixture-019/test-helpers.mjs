import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));

export function workerRequest(request) {
  const output = execFileSync("python", ["-B", path.join(fixtureRoot, "worker.py")], {
    cwd: fixtureRoot,
    input: `${JSON.stringify(request)}\n`,
    encoding: "utf8",
    windowsHide: true,
  });
  const response = JSON.parse(output.trim());
  if (response.ok !== true) throw new Error(response.error);
  return response.result;
}

export const firstDevelopmentSeed = "6050310934014137086";

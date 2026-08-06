import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const readinessLevels = new Set(["scaffold", "smoke-ready", "workstation-ready"]);
const commandActions = ["prepare", "smoke", "run", "analyze", "validate"];

async function exists(absolutePath) {
  try {
    await access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

function localPath(root, value) {
  if (typeof value !== "string" || value.trim() === "") return null;
  const absolute = path.resolve(root, value);
  const relative = path.relative(root, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return absolute;
}

function collectReferencedPaths(manifest) {
  return [
    ...(Array.isArray(manifest.environment?.lockfiles)
      ? manifest.environment.lockfiles.map((value) => ["environment.lockfiles", value])
      : []),
    ["seeds.development", manifest.seeds?.development],
    ["seeds.confirmation", manifest.seeds?.confirmation],
    ["seeds.held_out", manifest.seeds?.held_out],
    ["data.generator", manifest.data?.generator],
    ["outputs.schema", manifest.outputs?.schema],
    ["implementation.entrypoint", manifest.implementation?.entrypoint],
    ...(Array.isArray(manifest.implementation?.tests)
      ? manifest.implementation.tests.map((value) => ["implementation.tests", value])
      : []),
  ];
}

export async function validateExecutionManifest(root, manifestPath, expectedArtifact = null) {
  const errors = [];
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return { ready: false, readiness: "absent", errors: ["manifest"] };
    }
    return { ready: false, readiness: "invalid", errors: [`invalid JSON: ${error.message}`] };
  }

  if (manifest.schema !== 1) errors.push("schema must equal 1");
  if (!/^candidate-\d{3}$|^fixture-\d{3}$/.test(manifest.artifact ?? "")) {
    errors.push("artifact must be candidate-NNN or fixture-NNN");
  }
  if (expectedArtifact && manifest.artifact !== expectedArtifact) {
    errors.push(`artifact must equal ${expectedArtifact}`);
  }
  if (!readinessLevels.has(manifest.readiness)) {
    errors.push("readiness must be scaffold, smoke-ready, or workstation-ready");
  }

  for (const action of commandActions) {
    if (typeof manifest.command?.[action] !== "string" || !manifest.command[action].trim()) {
      errors.push(`command.${action} is required`);
    }
  }
  if (!Array.isArray(manifest.environment?.lockfiles) || !manifest.environment.lockfiles.length) {
    errors.push("environment.lockfiles must name at least one lockfile");
  }
  if (!manifest.hardware?.smoke || !manifest.hardware?.workstation) {
    errors.push("hardware.smoke and hardware.workstation are required");
  }
  if (!manifest.data || !manifest.outputs || !manifest.implementation) {
    errors.push("data, outputs, and implementation objects are required");
  }
  if (manifest.outputs?.append_only !== true) {
    errors.push("outputs.append_only must be true");
  }
  if (!Array.isArray(manifest.implementation?.tests) || !manifest.implementation.tests.length) {
    errors.push("implementation.tests must name at least one test file");
  }

  for (const [field, value] of collectReferencedPaths(manifest)) {
    const absolute = localPath(root, value);
    if (!absolute) {
      errors.push(`${field} must be a repository-relative path`);
    } else if (!(await exists(absolute))) {
      errors.push(`${field} does not exist: ${value}`);
    }
  }

  if (manifest.readiness === "workstation-ready") {
    if (manifest.outputs?.hash_chain !== true) errors.push("workstation-ready outputs.hash_chain must be true");
    if (manifest.resume?.supported !== true) errors.push("workstation-ready resume.supported must be true");
    if (manifest.energy?.required !== true) errors.push("workstation-ready energy.required must be true");
    const fullReferences = [
      ["data.full_profile", manifest.data?.full_profile],
      ["energy.provider_config", manifest.energy?.provider_config],
      ...(Array.isArray(manifest.implementation?.full_tests)
        ? manifest.implementation.full_tests.map((value) => ["implementation.full_tests", value])
        : []),
    ];
    if (!manifest.implementation?.full_tests?.length) {
      errors.push("workstation-ready implementation.full_tests must name at least one test");
    }
    for (const [field, value] of fullReferences) {
      const absolute = localPath(root, value);
      if (!absolute || !(await exists(absolute))) errors.push(`${field} must reference an existing repository file`);
    }
    for (const field of ["confirmation", "held_out"]) {
      const seedPath = localPath(root, manifest.seeds?.[field]);
      if (!seedPath || !(await exists(seedPath))) continue;
      try {
        const seedDocument = JSON.parse(await readFile(seedPath, "utf8"));
        if (!Array.isArray(seedDocument.seeds) || !seedDocument.seeds.length) {
          errors.push(`workstation-ready seeds.${field} must disclose a non-empty seed list`);
          continue;
        }
        const commitment = createHash("sha256")
          .update(JSON.stringify(seedDocument.seeds))
          .digest("hex");
        if (seedDocument.commitment !== commitment) {
          errors.push(`workstation-ready seeds.${field} commitment does not match its seed list`);
        }
      } catch (error) {
        errors.push(`workstation-ready seeds.${field} is invalid: ${error.message}`);
      }
    }
  }

  return {
    ready: errors.length === 0 && manifest.readiness === "workstation-ready",
    readiness: errors.length ? "invalid" : manifest.readiness,
    errors,
    manifest,
  };
}

export async function validateAllExecutionManifests(root) {
  const directory = path.join(root, "experiments", "workstation", "manifests");
  let entries = [];
  try {
    entries = (await readdir(directory)).filter((entry) => entry.endsWith(".json")).sort();
  } catch {
    return [];
  }
  const results = [];
  for (const entry of entries) {
    const manifestPath = path.join(directory, entry);
    const expectedArtifact = path.basename(entry, ".json");
    results.push({
      path: manifestPath,
      expectedArtifact,
      ...(await validateExecutionManifest(root, manifestPath, expectedArtifact)),
    });
  }
  return results;
}

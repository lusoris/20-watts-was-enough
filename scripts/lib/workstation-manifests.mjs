import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { validatePromotionEvidence } from "../../experiments/workstation/candidate-010/promotion-evidence.mjs";

const readinessLevels = new Set(["scaffold", "smoke-ready", "workstation-ready"]);
const commandActions = ["prepare", "smoke", "run", "analyze", "validate"];
const claimIdPattern = /^C-\d{3,4}$/;

function executionClaimScope(manifest) {
  return Array.isArray(manifest.implementation?.execution_claims)
    ? manifest.implementation.execution_claims
    : [];
}

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

async function fileSha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function validateExecutionClaimScope(root, manifest, executionClaims) {
  if (
    executionClaims.length === 0
    || executionClaims.some((claim) => !claimIdPattern.test(claim))
    || new Set(executionClaims).size !== executionClaims.length
  ) return false;
  const claims = (await readFile(path.join(root, "research", "claims.md"), "utf8")).replaceAll("\r\n", "\n");
  const artifactNumber = manifest.artifact?.split("-")[1];
  const artifactLabel = manifest.artifact?.startsWith("candidate-")
    ? `Candidate ${artifactNumber}`
    : `Fixture ${artifactNumber}`;
  for (const claim of executionClaims) {
    const start = claims.indexOf(`### ${claim}\n`);
    if (start < 0) return false;
    const next = claims.indexOf("\n### C-", start + 1);
    const block = claims.slice(start, next < 0 ? claims.length : next);
    if (!block.includes(`[${artifactLabel}]`)) return false;
  }
  return true;
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

async function committedSeedCheck(root, manifest, field, label) {
  const seedPath = localPath(root, manifest.seeds?.[field]);
  if (!seedPath || !(await exists(seedPath))) {
    return {
      id: `${field}-seeds`,
      label,
      passed: false,
      detail: `seeds.${field} must reference an existing committed seed manifest`,
    };
  }

  try {
    const seedDocument = JSON.parse(await readFile(seedPath, "utf8"));
    const expectedPartition = field === "held_out" ? "held-out" : field;
    if (!Array.isArray(seedDocument.seeds) || !seedDocument.seeds.length) {
      return {
        id: `${field}-seeds`,
        label,
        passed: false,
        detail: `seeds.${field} does not disclose a frozen non-empty seed list`,
      };
    }
    if (
      seedDocument.schema !== 1
      || seedDocument.state !== "frozen-reveal"
      || seedDocument.partition !== expectedPartition
      || seedDocument.algorithm !== "sha256-json-array-v1"
      || new Set(seedDocument.seeds).size !== seedDocument.seeds.length
      || seedDocument.seeds.some((seed) => !Number.isInteger(seed) || seed < 0 || seed > 0xffff_ffff)
    ) {
      return {
        id: `${field}-seeds`,
        label,
        passed: false,
        detail: `seeds.${field} is not a valid frozen reveal for ${expectedPartition}`,
      };
    }
    const commitment = createHash("sha256")
      .update(JSON.stringify(seedDocument.seeds))
      .digest("hex");
    if (seedDocument.commitment !== commitment) {
      return {
        id: `${field}-seeds`,
        label,
        passed: false,
        detail: `seeds.${field} commitment does not match its seed list`,
      };
    }
    if (!seedPath.endsWith(".reveal.json")) {
      return {
        id: `${field}-seeds`,
        label,
        passed: false,
        detail: `seeds.${field} must reference a versioned .reveal.json file`,
      };
    }
    const sealedPath = seedPath.replace(/\.reveal\.json$/, ".commit.json");
    const sealedDocument = JSON.parse(await readFile(sealedPath, "utf8"));
    if (
      sealedDocument.schema !== 1
      || sealedDocument.state !== "sealed"
      || sealedDocument.partition !== expectedPartition
      || sealedDocument.algorithm !== seedDocument.algorithm
      || sealedDocument.seed_count !== seedDocument.seeds.length
      || sealedDocument.commitment !== commitment
      || "seeds" in sealedDocument
    ) {
      return {
        id: `${field}-seeds`,
        label,
        passed: false,
        detail: `seeds.${field} reveal does not satisfy its sealed commitment`,
      };
    }
    return {
      id: `${field}-seeds`,
      label,
      passed: true,
      detail: `seeds.${field} is frozen and its commitment matches`,
    };
  } catch (error) {
    return {
      id: `${field}-seeds`,
      label,
      passed: false,
      detail: `seeds.${field} is invalid: ${error.message}`,
    };
  }
}

export async function workstationPromotionChecks(root, manifest) {
  const fullProfile = localPath(root, manifest.data?.full_profile);
  const fullProfileExists = Boolean(fullProfile && (await exists(fullProfile)));
  let fullProfileFrozen = false;
  if (fullProfileExists && /^[0-9a-f]{64}$/.test(manifest.data?.full_profile_sha256 ?? "")) {
    try {
      const profile = JSON.parse(await readFile(fullProfile, "utf8"));
      fullProfileFrozen = profile.schema === 1
        && profile.artifact === manifest.artifact
        && Number.isInteger(profile.opportunities_per_seed)
        && profile.opportunities_per_seed > 0
        && await fileSha256(fullProfile) === manifest.data.full_profile_sha256;
    } catch {
      fullProfileFrozen = false;
    }
  }
  const fullTests = Array.isArray(manifest.implementation?.full_tests)
    ? manifest.implementation.full_tests
    : [];
  const fullTestPaths = fullTests.map((value) => localPath(root, value));
  let workstationTestPipeline = false;
  try {
    const packageDocument = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
    workstationTestPipeline = packageDocument.scripts?.test?.includes("npm run test:workstation") === true
      && packageDocument.scripts?.["test:workstation"]?.includes("node --test") === true
      && packageDocument.scripts["test:workstation"].includes("experiments/workstation/**/*.test.mjs");
  } catch {
    workstationTestPipeline = false;
  }
  const fullTestsExist = fullTests.length > 0 && fullTestPaths.every(Boolean)
    && fullTests.every((value) => manifest.implementation?.tests?.includes(value))
    && fullTests.every((value) => value.endsWith(".test.mjs"))
    && (await Promise.all(fullTestPaths.map((value) => exists(value)))).every(Boolean)
    && workstationTestPipeline;
  const energyProvider = localPath(root, manifest.energy?.provider_config);
  let energyProviderValid = false;
  if (
    manifest.energy?.required === true
    && energyProvider
    && await exists(energyProvider)
    && /^[0-9a-f]{64}$/.test(manifest.energy?.provider_config_sha256 ?? "")
  ) {
    try {
      const provider = JSON.parse(await readFile(energyProvider, "utf8"));
      const providerModule = localPath(root, provider.provider_module);
      energyProviderValid = provider.schema === 1
        && provider.artifact === manifest.artifact
        && provider.confirmation_record_kind === "hardware-observation"
        && provider.software_telemetry_is_measured_energy === false
        && provider.test_fixtures_are_claim_eligible === false
        && provider.modeled_energy_is_claim_eligible === false
        && provider.missing_or_invalid_reading_policy === "fail-confirmation-closed"
        && Boolean(providerModule && await exists(providerModule))
        && await fileSha256(energyProvider) === manifest.energy.provider_config_sha256
        && manifest.implementation?.tests?.some((value) => value.endsWith("energy-provider.test.mjs"));
    } catch {
      energyProviderValid = false;
    }
  }
  const resumeModule = localPath(root, manifest.resume?.module);
  const resumeTest = localPath(root, manifest.resume?.test);
  let resumeIntegrated = false;
  if (
    manifest.resume?.supported === true
    && resumeModule
    && resumeTest
    && await exists(resumeModule)
    && await exists(resumeTest)
    && manifest.implementation?.tests?.includes(manifest.resume.test)
  ) {
    const entrypoint = localPath(root, manifest.implementation?.entrypoint);
    const source = entrypoint && await exists(entrypoint) ? await readFile(entrypoint, "utf8") : "";
    resumeIntegrated = source.includes("openCheckpointLedger") && source.includes("remainingWorkUnits");
  }
  const executionClaims = executionClaimScope(manifest);
  const validExecutionClaimScope = await validateExecutionClaimScope(root, manifest, executionClaims);
  const confirmationSeeds = await committedSeedCheck(root, manifest, "confirmation", "Frozen confirmation seeds");
  const heldOutSeeds = await committedSeedCheck(root, manifest, "held_out", "Frozen held-out seeds");
  if (confirmationSeeds.passed && heldOutSeeds.passed) {
    try {
      const developmentPath = localPath(root, manifest.seeds?.development);
      const confirmationPath = localPath(root, manifest.seeds?.confirmation);
      const heldOutPath = localPath(root, manifest.seeds?.held_out);
      const packs = await Promise.all([developmentPath, confirmationPath, heldOutPath].map(async (file) => (
        JSON.parse(await readFile(file, "utf8")).seeds
      )));
      const allSeeds = packs.flat();
      if (allSeeds.length !== new Set(allSeeds).size) {
        confirmationSeeds.passed = false;
        heldOutSeeds.passed = false;
        confirmationSeeds.detail = "development, confirmation, and held-out seed packs must be disjoint";
        heldOutSeeds.detail = confirmationSeeds.detail;
      }
    } catch {
      confirmationSeeds.passed = false;
      heldOutSeeds.passed = false;
      confirmationSeeds.detail = "seed-pack disjointness could not be verified";
      heldOutSeeds.detail = confirmationSeeds.detail;
    }
  }
  const hashChainIntegrated = manifest.outputs?.hash_chain === true
    && resumeIntegrated
    && manifest.implementation?.tests?.some((value) => /checkpoint|runner/.test(value));
  const promotion = manifest.promotion_evidence;
  const promotionEvidencePath = localPath(root, promotion?.evidence_path);
  const promotionRunDirectory = localPath(root, promotion?.run_directory);
  const promotionReleaseRoot = localPath(root, promotion?.release_root);
  const promotionReleasePath = localPath(root, promotion?.release_path);
  const promotionEnergyPath = localPath(root, promotion?.energy_assignments_path);
  const promotionDisjointPaths = Array.isArray(promotion?.disjoint_seed_pack_paths)
    ? promotion.disjoint_seed_pack_paths.map((value) => localPath(root, value))
    : [];
  let promotionEvidenceValid = false;
  let promotionEvidenceDetail = "strict promotion evidence is pending and no claim-eligible bundle exists";
  if (
    manifest.readiness === "workstation-ready"
    && promotion?.status === "present"
    && promotionEvidencePath
    && promotionRunDirectory
    && promotionReleaseRoot
    && promotionReleasePath
    && promotionEnergyPath
    && promotionDisjointPaths.length > 0
    && promotionDisjointPaths.every(Boolean)
    && await exists(promotionEvidencePath)
    && await exists(promotionRunDirectory)
    && await exists(promotionReleaseRoot)
    && await exists(promotionReleasePath)
    && await exists(promotionEnergyPath)
    && (await Promise.all(promotionDisjointPaths.map((value) => exists(value)))).every(Boolean)
    && manifest.implementation?.tests?.includes("experiments/workstation/candidate-010/promotion-evidence.test.mjs")
  ) {
    try {
      const evidence = JSON.parse(await readFile(promotionEvidencePath, "utf8"));
      const validation = await validatePromotionEvidence(evidence, {
        repositoryRoot: root,
        runDirectory: promotionRunDirectory,
        releaseRoot: promotionReleaseRoot,
        releasePath: promotionReleasePath,
        energyAssignmentsPath: promotionEnergyPath,
        disjointSeedPackPaths: promotionDisjointPaths,
      });
      promotionEvidenceValid = validation.valid === true;
      if (promotionEvidenceValid) promotionEvidenceDetail = "strict promotion evidence was recomputed from every bound input";
    } catch (error) {
      promotionEvidenceValid = false;
      promotionEvidenceDetail = `strict promotion evidence validation failed: ${error.message}`;
    }
  } else if (promotion?.status === "present") {
    promotionEvidenceDetail = "present promotion evidence is missing required repository paths, files, or its registered hostile test";
  }

  return [
    {
      id: "execution-claim-scope",
      label: "Explicit execution-track claim scope",
      passed: validExecutionClaimScope,
      detail: validExecutionClaimScope
        ? `execution track is limited to ${executionClaims.join(", ")}`
        : "implementation.execution_claims must name at least one exact claim ID",
    },
    {
      id: "full-profile",
      label: "Frozen full profile",
      passed: fullProfileFrozen,
      detail: fullProfileFrozen
        ? "data.full_profile identity and SHA-256 match the frozen repository file"
        : "data.full_profile must be a valid profile with a matching full_profile_sha256",
    },
    {
      id: "full-tests",
      label: "Full experiment-path tests",
      passed: fullTestsExist,
      detail: fullTestsExist
        ? "implementation.full_tests is part of the workstation suite executed by npm test"
        : "implementation.full_tests must name an existing test in the workstation suite executed by npm test",
    },
    {
      id: "hash-chain",
      label: "Corruption-evident output ledger",
      passed: hashChainIntegrated,
      detail: hashChainIntegrated
        ? "hash-chain output is wired through the tested checkpoint ledger"
        : "outputs.hash_chain must be wired through a tested ledger implementation",
    },
    {
      id: "resume",
      label: "Deterministic resume",
      passed: resumeIntegrated,
      detail: resumeIntegrated
        ? "runner imports the declared, tested checkpoint/resume implementation"
        : "resume must declare an existing module/test and be integrated by the runner",
    },
    {
      id: "energy-provider",
      label: "Measured-energy provider",
      passed: energyProviderValid,
      detail: energyProviderValid
        ? "external-meter provider capability, exclusions, test, and frozen config hash match"
        : "energy provider config/module/test and frozen hash must enforce external measured-energy boundaries",
    },
    confirmationSeeds,
    heldOutSeeds,
    {
      id: "promotion-evidence",
      label: "Strict recomputed promotion evidence",
      passed: promotionEvidenceValid,
      detail: promotionEvidenceDetail,
    },
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
  const promotion = manifest.promotion_evidence;
  if (!promotion || !new Set(["pending", "present"]).has(promotion.status)) {
    errors.push("promotion_evidence.status must be pending or present");
  } else {
    const promotionPaths = [
      ["promotion_evidence.evidence_path", promotion.evidence_path],
      ["promotion_evidence.run_directory", promotion.run_directory],
      ["promotion_evidence.release_root", promotion.release_root],
      ["promotion_evidence.release_path", promotion.release_path],
      ["promotion_evidence.energy_assignments_path", promotion.energy_assignments_path],
      ...(Array.isArray(promotion.disjoint_seed_pack_paths)
        ? promotion.disjoint_seed_pack_paths.map((value) => ["promotion_evidence.disjoint_seed_pack_paths", value])
        : []),
    ];
    if (!Array.isArray(promotion.disjoint_seed_pack_paths) || promotion.disjoint_seed_pack_paths.length === 0) {
      errors.push("promotion_evidence.disjoint_seed_pack_paths must name at least one repository-relative artifact");
    }
    for (const [field, value] of promotionPaths) {
      if (!localPath(root, value)) errors.push(`${field} must be a repository-relative path`);
    }
  }
  const executionClaims = executionClaimScope(manifest);
  if (!executionClaims.length) {
    errors.push("implementation.execution_claims must name at least one claim");
  } else {
    if (executionClaims.some((claim) => !claimIdPattern.test(claim))) {
      errors.push("implementation.execution_claims must contain exact C-NNN or C-NNNN identifiers");
    }
    if (new Set(executionClaims).size !== executionClaims.length) {
      errors.push("implementation.execution_claims must not contain duplicates");
    }
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

  const promotionChecks = await workstationPromotionChecks(root, manifest);
  if (manifest.readiness === "workstation-ready") {
    for (const check of promotionChecks.filter((entry) => !entry.passed)) {
      errors.push(`workstation-ready promotion check failed: ${check.id} — ${check.detail}`);
    }
  }

  return {
    ready: errors.length === 0
      && manifest.readiness === "workstation-ready"
      && promotionChecks.every((check) => check.passed),
    readiness: errors.length ? "invalid" : manifest.readiness,
    errors,
    manifest,
    executionClaims,
    promotionChecks,
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

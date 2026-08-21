import { createHash } from "node:crypto";
import { lstat, readFile, readdir, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { init, parse } from "es-module-lexer";

export const CANDIDATE_010_SOURCE_FILES = Object.freeze([
  "package-lock.json",
  "package.json",
  "research/claims.md",
  "scripts/lib/workstation-manifests.mjs",
  "scripts/validate-workstation.mjs",
  "experiments/workstation/manifest.schema.json",
  "experiments/workstation/candidate-010/actuator-command-track.mjs",
  "experiments/workstation/candidate-010/backend-registry.mjs",
  "experiments/workstation/candidate-010/checkpoint.mjs",
  "experiments/workstation/candidate-010/configs/development.json",
  "experiments/workstation/candidate-010/configs/smoke.json",
  "experiments/workstation/candidate-010/confirmatory-analysis.mjs",
  "experiments/workstation/candidate-010/energy-provider.config.json",
  "experiments/workstation/candidate-010/energy-provider.mjs",
  "experiments/workstation/candidate-010/event-contract.mjs",
  "experiments/workstation/candidate-010/factorial-design.mjs",
  "experiments/workstation/candidate-010/factorial-runner.mjs",
  "experiments/workstation/candidate-010/fault-injection.mjs",
  "experiments/workstation/candidate-010/filesystem-track.mjs",
  "experiments/workstation/candidate-010/generator.mjs",
  "experiments/workstation/candidate-010/independent-verifier.mjs",
  "experiments/workstation/candidate-010/output.schema.json",
  "experiments/workstation/candidate-010/persistent-service-runner.mjs",
  "experiments/workstation/candidate-010/policies.mjs",
  "experiments/workstation/candidate-010/promotion-evidence.mjs",
  "experiments/workstation/candidate-010/release-contract.mjs",
  "experiments/workstation/candidate-010/retry-rollback-comparator.mjs",
  "experiments/workstation/candidate-010/run-lock.mjs",
  "experiments/workstation/candidate-010/runner.mjs",
  "experiments/workstation/candidate-010/seeds/seed-pack.mjs",
  "experiments/workstation/candidate-010/signed-publication-track.mjs",
  "experiments/workstation/candidate-010/source-bundle.mjs",
  "experiments/workstation/candidate-010/trace-job.mjs",
  "experiments/workstation/candidate-010/transactional-kv-track.mjs",
]);

export const CANDIDATE_010_MANIFEST_FILE = "experiments/workstation/manifests/candidate-010.json";

export const CANDIDATE_010_TEST_SUPPORT_FILES = Object.freeze([
  // Loaded by runner.test.mjs as the deterministic expected-output fixture.
  "experiments/workstation/candidate-010/golden-smoke.json",
]);

export const CANDIDATE_010_DISCOVERY_EXCLUSIONS = Object.freeze([
  Object.freeze({ path: "README.md", reason: "human documentation; not executable or test support" }),
  Object.freeze({ path: "energy-reading.template.json", reason: "operator input template; never consumed automatically" }),
  Object.freeze({ path: "seeds/smoke.json", reason: "experimental seed input; bound as run input rather than source" }),
  Object.freeze({ path: "seeds/development.json", reason: "experimental seed input; bound as run input rather than source" }),
  Object.freeze({ path: "seeds/confirmation.commit.json", reason: "sealed seed commitment; bound by the release contract" }),
  Object.freeze({ path: "seeds/held-out.commit.json", reason: "sealed seed commitment; bound by the release contract" }),
  Object.freeze({ path: "seeds/confirmation.reveal.json", reason: "future reveal data; bound by the release contract and never source" }),
  Object.freeze({ path: "seeds/held-out.reveal.json", reason: "future reveal data; bound by the release contract and never source" }),
]);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizedRelativePath(value) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("Source-bundle paths must be non-empty strings.");
  }
  const normalized = value.replaceAll("\\", "/");
  if (path.isAbsolute(value) || normalized.startsWith("../") || normalized.includes("/../")) {
    throw new Error(`Source-bundle path must stay relative to the repository: ${value}`);
  }
  return normalized;
}

function sortedUnique(values, label) {
  const normalized = values.map(normalizedRelativePath);
  const unique = [...new Set(normalized)].sort();
  if (unique.length !== normalized.length) throw new Error(`${label} paths must be unique.`);
  return unique;
}

function pathIsInside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function assertNoSymbolicPathComponents(root, absolute, label) {
  const rootAbsolute = path.resolve(root);
  const relative = path.relative(rootAbsolute, absolute);
  if (!pathIsInside(rootAbsolute, absolute)) {
    throw new Error(`${label} escapes the repository.`);
  }
  let current = rootAbsolute;
  for (const component of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, component);
    const information = await lstat(current);
    if (information.isSymbolicLink()) {
      throw new Error(`${label} refuses symbolic-link or reparse-point traversal: ${relative}`);
    }
  }
}

async function repositoryEntry(root, relative, { directory = false, label = "Source-bundle path" } = {}) {
  const normalized = normalizedRelativePath(relative);
  const rootAbsolute = path.resolve(root);
  const rootReal = await realpath(rootAbsolute);
  const absolute = path.resolve(rootAbsolute, ...normalized.split("/"));
  await assertNoSymbolicPathComponents(rootAbsolute, absolute, label);
  const [information, resolved] = await Promise.all([lstat(absolute), realpath(absolute)]);
  if (information.isSymbolicLink()) {
    throw new Error(`${label} refuses a symbolic link or reparse point: ${normalized}`);
  }
  if (directory ? !information.isDirectory() : !information.isFile()) {
    throw new Error(`${label} must be a regular ${directory ? "directory" : "file"}: ${normalized}`);
  }
  if (!pathIsInside(rootReal, resolved)) {
    throw new Error(`${label} resolves outside the repository: ${normalized}`);
  }
  return { absolute, normalized, resolved };
}

async function walkCandidateFiles(root, candidateDirectory) {
  const { absolute: absoluteCandidateDirectory } = await repositoryEntry(root, candidateDirectory, {
    directory: true,
    label: "Candidate 010 source directory",
  });
  const files = [];
  async function visit(directory, relativeDirectory = "") {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const relative = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Candidate 010 source discovery refuses symbolic links: ${relative}`);
      if (entry.isDirectory()) await visit(absolute, relative);
      else if (entry.isFile()) files.push(relative);
      else throw new Error(`Candidate 010 source discovery found an unsupported entry: ${relative}`);
    }
  }
  await visit(absoluteCandidateDirectory);
  return files.sort();
}

async function relativeModuleSpecifiers(body) {
  await init;
  const [imports] = parse(body);
  return [...new Set(imports
    .map((entry) => entry.n)
    .filter((specifier) => typeof specifier === "string" && specifier.startsWith(".")))]
    .sort();
}

async function validateFrozenImportClosure({ root, importers, sourceFiles }) {
  const included = new Set(sourceFiles);
  const edges = [];
  for (const importer of importers) {
    const { absolute } = await repositoryEntry(root, importer, {
      label: "Candidate 010 import-closure source",
    });
    const body = await readFile(absolute, "utf8");
    for (const specifier of await relativeModuleSpecifiers(body)) {
      const resolved = normalizedRelativePath(path.relative(
        root,
        path.resolve(root, path.dirname(importer), specifier),
      ));
      if (!included.has(resolved)) {
        throw new Error(`Candidate 010 import is outside the frozen source closure: ${importer} -> ${resolved}`);
      }
      edges.push(Object.freeze({ importer, imported: resolved }));
    }
  }
  return Object.freeze(edges.sort((left, right) => (
    left.importer.localeCompare(right.importer) || left.imported.localeCompare(right.imported)
  )));
}

export async function discoverCandidate010SourceFiles({
  root = process.cwd(),
  candidateDirectory = "experiments/workstation/candidate-010",
  manifestFile = CANDIDATE_010_MANIFEST_FILE,
  productionFiles = CANDIDATE_010_SOURCE_FILES,
  testSupportFiles = CANDIDATE_010_TEST_SUPPORT_FILES,
  exclusions = CANDIDATE_010_DISCOVERY_EXCLUSIONS,
} = {}) {
  const normalizedProduction = sortedUnique([...productionFiles], "Candidate 010 production source");
  const normalizedSupport = sortedUnique([...testSupportFiles], "Candidate 010 test-support source");
  const normalizedManifest = normalizedRelativePath(manifestFile);
  const normalizedCandidateDirectory = normalizedRelativePath(candidateDirectory).replace(/\/$/, "");
  const prefix = `${normalizedCandidateDirectory}/`;
  const discoveredRelative = await walkCandidateFiles(root, normalizedCandidateDirectory);
  const discoveredProductionModules = discoveredRelative
    .filter((file) => file.endsWith(".mjs") && !file.endsWith(".test.mjs"))
    .map((file) => `${prefix}${file}`)
    .sort();
  const listedProductionModules = normalizedProduction.filter((file) => (
    file.startsWith(prefix) && file.endsWith(".mjs") && !file.endsWith(".test.mjs")
  ));
  if (JSON.stringify(discoveredProductionModules) !== JSON.stringify(listedProductionModules)) {
    const listed = new Set(listedProductionModules);
    const discovered = new Set(discoveredProductionModules);
    const unlisted = discoveredProductionModules.filter((file) => !listed.has(file));
    const missing = listedProductionModules.filter((file) => !discovered.has(file));
    throw new Error(`Candidate 010 production module coverage mismatch; unlisted=[${unlisted.join(",")}], missing=[${missing.join(",")}]`);
  }

  const { absolute: manifestPath } = await repositoryEntry(root, normalizedManifest, {
    label: "Candidate 010 execution manifest",
  });
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const registeredTests = manifest?.implementation?.tests;
  if (!Array.isArray(registeredTests) || registeredTests.length === 0) {
    throw new Error("Candidate 010 manifest must register a non-empty implementation.tests list.");
  }
  const normalizedRegisteredTests = sortedUnique(registeredTests, "Candidate 010 manifest test");
  if (normalizedRegisteredTests.some((file) => !file.startsWith(prefix) || !file.endsWith(".test.mjs"))) {
    throw new Error("Candidate 010 manifest tests must be Candidate 010 .test.mjs files.");
  }
  const discoveredTests = discoveredRelative
    .filter((file) => file.endsWith(".test.mjs"))
    .map((file) => `${prefix}${file}`)
    .sort();
  if (JSON.stringify(discoveredTests) !== JSON.stringify(normalizedRegisteredTests)) {
    const registered = new Set(normalizedRegisteredTests);
    const discovered = new Set(discoveredTests);
    const unregistered = discoveredTests.filter((file) => !registered.has(file));
    const missing = normalizedRegisteredTests.filter((file) => !discovered.has(file));
    throw new Error(`Candidate 010 test coverage mismatch; unregistered=[${unregistered.join(",")}], missing=[${missing.join(",")}]`);
  }

  const exclusionMap = new Map();
  for (const exclusion of exclusions) {
    const relative = normalizedRelativePath(exclusion?.path);
    if (typeof exclusion?.reason !== "string" || exclusion.reason.trim().length === 0) {
      throw new Error(`Candidate 010 discovery exclusion requires a reason: ${relative}`);
    }
    if (exclusionMap.has(relative)) throw new Error(`Duplicate Candidate 010 discovery exclusion: ${relative}`);
    exclusionMap.set(relative, exclusion.reason);
  }
  const sourceFiles = sortedUnique([
    ...normalizedProduction,
    ...normalizedRegisteredTests,
    ...normalizedSupport,
    normalizedManifest,
  ], "Candidate 010 complete source");
  const includedCandidateFiles = new Set(sourceFiles
    .filter((file) => file.startsWith(prefix))
    .map((file) => file.slice(prefix.length)));
  const unclassified = discoveredRelative.filter((file) => (
    !includedCandidateFiles.has(file) && !exclusionMap.has(file)
  ));
  if (unclassified.length > 0) {
    throw new Error(`Candidate 010 discovery found unclassified files: ${unclassified.join(",")}`);
  }
  const productionModules = normalizedProduction.filter((file) => file.endsWith(".mjs"));
  const importClosure = await validateFrozenImportClosure({
    root,
    importers: [...productionModules, ...normalizedRegisteredTests],
    sourceFiles,
  });
  return Object.freeze({
    source_files: Object.freeze(sourceFiles),
    production_modules: Object.freeze(productionModules),
    registered_tests: Object.freeze(normalizedRegisteredTests),
    test_support_files: Object.freeze(normalizedSupport),
    manifest_file: normalizedManifest,
    import_closure: importClosure,
    exclusions: Object.freeze([...exclusionMap].map(([excludedPath, reason]) => Object.freeze({ path: excludedPath, reason }))),
  });
}

export async function computeSourceBundle({ root, sourceFiles, vcs = null }) {
  if (!root || !Array.isArray(sourceFiles) || sourceFiles.length === 0) {
    throw new Error("Source-bundle root and a non-empty source-file list are required.");
  }
  const normalized = [...new Set(sourceFiles.map(normalizedRelativePath))].sort();
  if (normalized.length !== sourceFiles.length) throw new Error("Source-bundle paths must be unique.");
  const aggregate = createHash("sha256");
  const files = [];
  for (const relative of normalized) {
    const { absolute } = await repositoryEntry(root, relative, {
      label: "Candidate 010 frozen source",
    });
    const body = await readFile(absolute);
    const fileSha256 = sha256(body);
    files.push({ path: relative, bytes: body.length, sha256: fileSha256 });
    aggregate.update(`${Buffer.byteLength(relative)}:${relative}:${body.length}:`);
    aggregate.update(body);
  }
  return Object.freeze({
    schema: 1,
    bundle_id: "candidate-010-executable-source-v1",
    source_sha256: aggregate.digest("hex"),
    files: Object.freeze(files.map(Object.freeze)),
    vcs: vcs === null ? null : Object.freeze({ ...vcs }),
  });
}

async function readOptional(file) {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function resolveGitDirectory(root) {
  const dotGit = path.join(root, ".git");
  const information = await stat(dotGit);
  if (information.isDirectory()) return dotGit;
  const pointer = (await readFile(dotGit, "utf8")).trim();
  const match = /^gitdir:\s*(.+)$/i.exec(pointer);
  if (!match) throw new Error("Cannot resolve the repository Git directory.");
  return path.resolve(root, match[1]);
}

async function readSourceCommit(root) {
  const gitDirectory = await resolveGitDirectory(root);
  const head = (await readFile(path.join(gitDirectory, "HEAD"), "utf8")).trim();
  if (/^[0-9a-f]{40}$/.test(head)) return head;
  const match = /^ref:\s*(.+)$/.exec(head);
  if (!match) throw new Error("Repository HEAD is neither a commit nor a symbolic reference.");
  const ref = match[1];
  const loose = await readOptional(path.join(gitDirectory, ...ref.split("/")));
  if (loose && /^[0-9a-f]{40}$/.test(loose.trim())) return loose.trim();
  const packed = await readOptional(path.join(gitDirectory, "packed-refs"));
  const packedMatch = packed?.split(/\r?\n/).find((line) => line.endsWith(` ${ref}`));
  const commit = packedMatch?.split(" ")[0];
  if (!/^[0-9a-f]{40}$/.test(commit ?? "")) throw new Error(`Cannot resolve Git reference ${ref}.`);
  return commit;
}

export async function captureCandidate010SourceBundle(root = process.cwd()) {
  const sourceCommit = await readSourceCommit(root);
  if (!/^[0-9a-f]{40}$/.test(sourceCommit)) throw new Error("Candidate 010 source commit is not a full Git SHA-1.");
  const vcs = {
    source_commit: sourceCommit,
    worktree_state: "source-files-hashed-directly; Git index cleanliness not inferred",
  };
  const coverage = await discoverCandidate010SourceFiles({ root });
  return computeSourceBundle({ root, sourceFiles: coverage.source_files, vcs });
}

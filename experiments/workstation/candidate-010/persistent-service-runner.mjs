import { createHash } from "node:crypto";
import {
  access,
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
} from "node:fs/promises";
import path from "node:path";
import { backendForTaskFamily, executeBackendTrial } from "./backend-registry.mjs";
import {
  LEDGER_DURABILITY_CONTRACT,
  appendDurableRecord,
  canonicalize,
  openCheckpointLedger,
  replaceDurableCheckpoint,
  sha256Hex,
} from "./checkpoint.mjs";
import { generateOpportunities } from "./generator.mjs";
import { acquireRunLock } from "./run-lock.mjs";
import { captureCandidate010SourceBundle } from "./source-bundle.mjs";

export const PERSISTENT_SERVICE_RUNNER_VERSION = "candidate-010-persistent-service-v1";
export const PERSISTENT_SERVICE_RECOVERY_SCOPE = Object.freeze({
  protocol: "hash-bound-pending-receipt-v1",
  interruption_boundary: "after-pending-receipt-destination-file-fsync-before-ledger-append",
  metadata_replace: LEDGER_DURABILITY_CONTRACT.checkpoint_replace,
  file_fsync_requested: true,
  directory_fsync_guarantee: false,
  arbitrary_power_loss_guarantee: false,
  toctou_guarantee: false,
});

const SUPPORTED_FAMILIES = Object.freeze(["transactional-kv", "actuator-command"]);
const repositoryRoot = path.resolve(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1")),
  "..",
  "..",
  "..",
);
const ACTIONS = Object.freeze([
  Object.freeze({ requested_action: "commit", expected_version: 0 }),
  Object.freeze({ requested_action: "reset", expected_version: 1 }),
  Object.freeze({ requested_action: "commit", expected_version: 1 }),
  Object.freeze({ requested_action: "commit-stale", expected_version: 0 }),
]);

function hashCanonical(value) {
  return sha256Hex(canonicalize(value));
}

function refuse(reason) {
  throw new Error(`Refusing persistent-service run: ${reason}`);
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function normalizedAbsolute(value) {
  const absolute = path.resolve(value);
  return process.platform === "win32" ? absolute.toLowerCase() : absolute;
}

function isContained(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function assertContainedUnlinkedPath(
  containmentRoot,
  target,
  label,
  { allowMissing = false, kind = null } = {},
) {
  const root = path.resolve(containmentRoot);
  const absolute = path.resolve(target);
  if (!isContained(root, absolute)) refuse(`${label} escapes its declared containment root`);

  let rootInformation;
  try {
    rootInformation = await lstat(root);
  } catch (error) {
    if (allowMissing && error?.code === "ENOENT" && absolute === root) return { exists: false };
    throw error;
  }
  if (rootInformation.isSymbolicLink() || !rootInformation.isDirectory()) {
    refuse(`${label} containment root is a symlink, reparse point, or non-directory`);
  }
  const rootReal = await realpath(root);
  const relative = path.relative(root, absolute);
  let cursor = root;
  let information = rootInformation;
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, segment);
    try {
      information = await lstat(cursor);
    } catch (error) {
      if (allowMissing && error?.code === "ENOENT") return { exists: false };
      throw error;
    }
    if (information.isSymbolicLink()) {
      refuse(`${label} contains a symlink or reparse point`);
    }
  }
  const targetReal = await realpath(absolute);
  if (!isContained(rootReal, targetReal)) refuse(`${label} resolves outside its declared containment root`);
  const expectedReal = path.resolve(rootReal, relative);
  if (normalizedAbsolute(targetReal) !== normalizedAbsolute(expectedReal)) {
    refuse(`${label} resolves through a symlink or reparse point`);
  }
  if (kind === "file" && !information.isFile()) refuse(`${label} is not a regular file`);
  if (kind === "directory" && !information.isDirectory()) refuse(`${label} is not a directory`);
  return { exists: true, information, realpath: targetReal };
}

async function containedPathExists(root, target, label, kind = null) {
  return (await assertContainedUnlinkedPath(root, target, label, {
    allowMissing: true,
    kind,
  })).exists;
}

async function readContainedFile(root, file, label) {
  await assertContainedUnlinkedPath(root, file, label, { kind: "file" });
  return readFile(file);
}

async function readContainedJson(root, file, label) {
  return JSON.parse((await readContainedFile(root, file, label)).toString("utf8"));
}

function validateConfig(config) {
  if (!config || typeof config !== "object" || config.artifact !== "candidate-010") {
    refuse("a Candidate 010 config is required");
  }
  if (!Number.isSafeInteger(config.opportunities_per_seed) || config.opportunities_per_seed < 4) {
    refuse("config must generate at least four opportunities per seed");
  }
  canonicalize(config);
}

function operationOpportunity(opportunity, taskFamily, expectedVersion) {
  const base = { ...opportunity, task_family: taskFamily };
  if (taskFamily === "transactional-kv") {
    return { ...base, transactional_kv: { expected_version: expectedVersion } };
  }
  if (taskFamily === "actuator-command") {
    return {
      ...base,
      actuator_command: {
        expected_version: expectedVersion,
        value: `persistent-service:${opportunity.payload}`,
      },
    };
  }
  refuse(`unsupported persistent task family ${taskFamily}`);
}

export function createPersistentServicePlan({
  config,
  seed,
  taskFamilies = SUPPORTED_FAMILIES,
}) {
  validateConfig(config);
  if (!Number.isSafeInteger(seed) || seed < 0) refuse(`invalid seed ${seed}`);
  if (
    !Array.isArray(taskFamilies)
    || taskFamilies.length === 0
    || new Set(taskFamilies).size !== taskFamilies.length
    || taskFamilies.some((family) => !SUPPORTED_FAMILIES.includes(family))
  ) {
    refuse("taskFamilies must be a unique non-empty subset of transactional-kv and actuator-command");
  }

  const opportunities = generateOpportunities(config, seed).slice(0, ACTIONS.length);
  const plan = [];
  let sequence = 0;
  for (const taskFamily of taskFamilies) {
    const backend = backendForTaskFamily(taskFamily);
    for (const [instanceSequence, action] of ACTIONS.entries()) {
      plan.push({
        schema: 1,
        sequence,
        instance_sequence: instanceSequence,
        task_family: taskFamily,
        backend_id: backend.backend_id,
        requested_action: action.requested_action,
        expected_version: action.expected_version,
        opportunity: operationOpportunity(
          opportunities[instanceSequence],
          taskFamily,
          action.expected_version,
        ),
      });
      sequence += 1;
    }
  }
  return plan;
}

function validatePlan(plan) {
  if (!Array.isArray(plan) || plan.length === 0) refuse("operation plan is empty");
  const supported = new Set(SUPPORTED_FAMILIES);
  const instanceCounts = new Map();
  for (const [sequence, operation] of plan.entries()) {
    const backend = supported.has(operation?.task_family)
      ? backendForTaskFamily(operation.task_family)
      : null;
    const instanceSequence = instanceCounts.get(operation?.task_family) ?? 0;
    if (
      operation?.schema !== 1
      || operation.sequence !== sequence
      || operation.instance_sequence !== instanceSequence
      || !backend
      || operation.backend_id !== backend.backend_id
      || !["commit", "reset", "commit-stale"].includes(operation.requested_action)
      || !Number.isSafeInteger(operation.expected_version)
      || operation.expected_version < 0
      || operation.opportunity?.task_family !== operation.task_family
      || typeof operation.opportunity?.id !== "string"
    ) {
      refuse(`invalid or non-canonical operation at sequence ${sequence}`);
    }
    const declaredExpected = operation.task_family === "transactional-kv"
      ? operation.opportunity.transactional_kv?.expected_version
      : operation.opportunity.actuator_command?.expected_version;
    if (declaredExpected !== operation.expected_version) {
      refuse(`opportunity expected-version binding mismatch at sequence ${sequence}`);
    }
    instanceCounts.set(operation.task_family, instanceSequence + 1);
  }
  if (new Set(plan.map((operation) => (
    `${operation.task_family}\u0000${operation.opportunity.id}`
  ))).size !== plan.length) {
    refuse("operation opportunities are not unique within their service instance");
  }
  canonicalize(plan);
}

export function derivePersistentServiceRunIdentity({ config, plan, sourceBundle }) {
  validateConfig(config);
  validatePlan(plan);
  if (
    sourceBundle?.schema !== 1
    || sourceBundle.bundle_id !== "candidate-010-executable-source-v1"
    || !/^[0-9a-f]{64}$/.test(sourceBundle.source_sha256 ?? "")
    || !/^[0-9a-f]{40}$/.test(sourceBundle.vcs?.source_commit ?? "")
    || !Array.isArray(sourceBundle.files)
    || sourceBundle.files.length === 0
  ) {
    refuse("a complete current Candidate 010 source bundle and VCS commit are required");
  }
  canonicalize(sourceBundle);
  const configSha256 = hashCanonical(config);
  const planSha256 = hashCanonical(plan);
  const runId = `c010-persistent-run-${hashCanonical({
    schema: 1,
    runner_version: PERSISTENT_SERVICE_RUNNER_VERSION,
    config_sha256: configSha256,
    plan_sha256: planSha256,
    source_sha256: sourceBundle.source_sha256,
    source_commit: sourceBundle.vcs.source_commit,
  })}`;
  const instances = Object.fromEntries([...new Set(plan.map((entry) => entry.task_family))]
    .map((taskFamily) => {
      const backend = backendForTaskFamily(taskFamily);
      const instanceId = `c010-instance-${hashCanonical({
        schema: 1,
        run_id: runId,
        task_family: taskFamily,
        backend_id: backend.backend_id,
      })}`;
      return [taskFamily, {
        instance_id: instanceId,
        task_family: taskFamily,
        backend_id: backend.backend_id,
        physical_actuation: false,
      }];
    }));
  const operations = plan.map((entry) => {
    const instance = instances[entry.task_family];
    const opportunitySha256 = hashCanonical(entry.opportunity);
    const operationId = `c010-operation-${hashCanonical({
      schema: 1,
      run_id: runId,
      instance_id: instance.instance_id,
      sequence: entry.sequence,
      instance_sequence: entry.instance_sequence,
      opportunity_sha256: opportunitySha256,
      requested_action: entry.requested_action,
      expected_version: entry.expected_version,
    })}`;
    return {
      ...entry,
      ...instance,
      opportunity_sha256: opportunitySha256,
      operation_id: operationId,
    };
  });
  return {
    schema: 1,
    artifact: "candidate-010",
    runner_version: PERSISTENT_SERVICE_RUNNER_VERSION,
    run_id: runId,
    config_sha256: configSha256,
    plan_sha256: planSha256,
    source_sha256: sourceBundle.source_sha256,
    source_commit: sourceBundle.vcs.source_commit,
    source_bundle: sourceBundle,
    recovery_scope: PERSISTENT_SERVICE_RECOVERY_SCOPE,
    instances,
    operations,
  };
}

export function persistentServiceScientificPayload(event) {
  return {
    schema: event.schema,
    artifact: event.artifact,
    run_kind: event.run_kind,
    runner_version: event.runner_version,
    run_id: event.run_id,
    plan_sha256: event.plan_sha256,
    instance_id: event.instance_id,
    operation_id: event.operation_id,
    version_transition_id: event.version_transition_id,
    sequence: event.sequence,
    instance_sequence: event.instance_sequence,
    task_family: event.task_family,
    backend_id: event.backend_id,
    opportunity_id: event.opportunity_id,
    opportunity_sha256: event.opportunity_sha256,
    requested_action: event.requested_action,
    expected_version: event.expected_version,
    pre_version: event.pre_version,
    post_version: event.post_version,
    decision: event.decision,
    durable_state: event.durable_state,
    // Keep the complete per-work-unit diagnostic boundary, including timings,
    // in the hash chain. Cross-run equivalence is assessed on state and
    // decisions; it must not make diagnostic telemetry unauthenticated.
    boundary: event.boundary,
    recovery_scope: event.recovery_scope,
    physical_actuation: event.physical_actuation,
  };
}

function verifyEventIdentity(event, expected) {
  const bindings = {
    run_id: expected.run_id,
    plan_sha256: expected.plan_sha256,
    instance_id: expected.instance_id,
    operation_id: expected.operation_id,
    sequence: expected.sequence,
    instance_sequence: expected.instance_sequence,
    task_family: expected.task_family,
    backend_id: expected.backend_id,
    opportunity_id: expected.opportunity.id,
    opportunity_sha256: expected.opportunity_sha256,
    expected_version: expected.expected_version,
    requested_action: expected.requested_action,
    physical_actuation: false,
  };
  for (const [field, expectedValue] of Object.entries(bindings)) {
    if (event?.[field] !== expectedValue) {
      refuse(`ledger ${field} mismatch for operation ${expected.operation_id}`);
    }
  }
}

async function readRawEvents(outputDirectory, rawPath) {
  if (!(await containedPathExists(outputDirectory, rawPath, "persistent raw ledger", "file"))) return [];
  const raw = (await readContainedFile(outputDirectory, rawPath, "persistent raw ledger")).toString("utf8");
  if (raw.length > 0 && !raw.endsWith("\n")) refuse("raw ledger has an incomplete record");
  return raw.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

async function writeIdentity(outputDirectory, file, identity) {
  const body = {
    schema: 1,
    identity,
    identity_sha256: hashCanonical(identity),
  };
  await assertContainedUnlinkedPath(outputDirectory, file, "run identity", { allowMissing: true });
  await replaceDurableCheckpoint(file, `${JSON.stringify(body, null, 2)}\n`);
  await assertContainedUnlinkedPath(outputDirectory, file, "run identity", { kind: "file" });
}

async function verifyIdentity(outputDirectory, file, identity) {
  const document = await readContainedJson(outputDirectory, file, "run identity");
  if (
    document?.schema !== 1
    || document.identity_sha256 !== hashCanonical(document.identity)
    || canonicalize(document.identity) !== canonicalize(identity)
  ) {
    refuse("stored run identity does not match the requested config and operation plan");
  }
}

function pendingReceiptBody(event) {
  const body = {
    schema: 1,
    artifact: "candidate-010",
    receipt_format: PERSISTENT_SERVICE_RECOVERY_SCOPE.protocol,
    run_id: event.run_id,
    operation_id: event.operation_id,
    scientific_payload_sha256: hashCanonical(persistentServiceScientificPayload(event)),
    event,
  };
  return { ...body, receipt_sha256: hashCanonical(body) };
}

function verifyPendingReceipt(receipt, expected) {
  const { receipt_sha256: actual, ...body } = receipt ?? {};
  if (
    body.schema !== 1
    || body.artifact !== "candidate-010"
    || body.receipt_format !== PERSISTENT_SERVICE_RECOVERY_SCOPE.protocol
    || actual !== hashCanonical(body)
    || body.run_id !== expected.run_id
    || body.operation_id !== expected.operation_id
    || body.scientific_payload_sha256
      !== hashCanonical(persistentServiceScientificPayload(body.event))
  ) {
    refuse(`invalid pending receipt for ${expected.operation_id}`);
  }
  verifyEventIdentity(body.event, expected);
  return body.event;
}

async function writePendingReceipt(outputDirectory, file, event) {
  await assertContainedUnlinkedPath(outputDirectory, file, "pending receipt", { allowMissing: true });
  await replaceDurableCheckpoint(
    file,
    `${JSON.stringify(pendingReceiptBody(event), null, 2)}\n`,
  );
  await assertContainedUnlinkedPath(outputDirectory, file, "pending receipt", { kind: "file" });
}

function durableTemporaryTarget(name) {
  const match = /^(.*\.json)\.tmp-\d+-\d+$/.exec(name);
  return match?.[1] ?? null;
}

async function cleanupMetadataTemporaries(outputDirectory) {
  await assertContainedUnlinkedPath(outputDirectory, outputDirectory, "persistent output root", {
    kind: "directory",
  });
  const locations = [
    { directory: outputDirectory, pending: false },
    { directory: path.join(outputDirectory, "pending"), pending: true },
  ];
  for (const location of locations) {
    if (!(await containedPathExists(
      outputDirectory,
      location.directory,
      location.pending ? "pending receipt directory" : "persistent output root",
      "directory",
    ))) continue;
    for (const name of await readdir(location.directory)) {
      const targetName = durableTemporaryTarget(name);
      if (!targetName) continue;
      const recognizedTopLevel = ["run-identity.json", "checkpoint.json", "run.json"]
        .includes(targetName);
      const recognizedPending = /^c010-operation-[0-9a-f]{64}\.json$/.test(targetName);
      if ((!location.pending && !recognizedTopLevel) || (location.pending && !recognizedPending)) {
        refuse(`unrecognized durable metadata temporary ${name}`);
      }
      const temporaryPath = path.join(location.directory, name);
      const destinationPath = path.join(location.directory, targetName);
      await assertContainedUnlinkedPath(outputDirectory, temporaryPath, "durable metadata temporary", {
        kind: "file",
      });
      if (await containedPathExists(outputDirectory, destinationPath, "durable metadata destination", "file")) {
        await rm(temporaryPath, { force: false });
        continue;
      }
      if (!location.pending && ["checkpoint.json", "run.json"].includes(targetName)) {
        // Both are derived from the authoritative raw ledger and durable state.
        // A pre-rename temporary can be discarded and deterministically rebuilt.
        await rm(temporaryPath, { force: false });
        continue;
      }
      refuse(`durable metadata temporary has no authoritative destination: ${name}`);
    }
  }
}

function bodySha256(body) {
  return createHash("sha256").update(body).digest("hex");
}

function parseDurableJson(body, label) {
  try {
    return JSON.parse(body.toString("utf8"));
  } catch {
    refuse(`${label} contains invalid JSON`);
  }
}

async function recursiveFiles(root) {
  await assertContainedUnlinkedPath(root, root, "persistent instance root", { kind: "directory" });
  const names = (await readdir(root, { recursive: true }))
    .map((name) => name.split(path.sep).join("/"))
    .sort();
  const files = [];
  for (const relative of names) {
    const absolute = path.join(root, ...relative.split("/"));
    const { information } = await assertContainedUnlinkedPath(
      root,
      absolute,
      `persistent history entry ${relative}`,
    );
    if (information.isFile()) files.push(relative);
    else if (!information.isDirectory()) refuse(`persistent history entry ${relative} has an unsupported file type`);
  }
  return files;
}

async function inspectTransactionalKvHistory(instanceRoot) {
  const files = await recursiveFiles(instanceRoot);
  const versionFiles = files.filter((name) => name.includes("/versions/"));
  if (versionFiles.some((name) => !/\/versions\/\d{12}\/(state|integrity)\.json$/.test(`/${name}`))) {
    refuse("transactional-kv durable history contains an unexpected file");
  }
  const stateFiles = versionFiles.filter((name) => name.endsWith("/state.json"));
  const integrityFiles = new Set(versionFiles.filter((name) => name.endsWith("/integrity.json")));
  if (stateFiles.length === 0 || integrityFiles.size !== stateFiles.length) {
    refuse("transactional-kv durable history is missing state or integrity records");
  }
  stateFiles.sort();
  const backendId = backendForTaskFamily("transactional-kv").backend_id;
  const history = [];
  let parentStateSha256 = null;
  let current;
  for (const [version, stateRelative] of stateFiles.entries()) {
    const expectedSuffix = `/versions/${String(version).padStart(12, "0")}/state.json`;
    if (!`/${stateRelative}`.endsWith(expectedSuffix)) {
      refuse(`transactional-kv durable version sequence is not contiguous at ${version}`);
    }
    const integrityRelative = stateRelative.replace(/state\.json$/, "integrity.json");
    if (!integrityFiles.delete(integrityRelative)) {
      refuse(`transactional-kv version ${version} is missing its integrity record`);
    }
    const [stateBody, integrityBody] = await Promise.all([
      readContainedFile(
        instanceRoot,
        path.join(instanceRoot, ...stateRelative.split("/")),
        `transactional-kv state ${version}`,
      ),
      readContainedFile(
        instanceRoot,
        path.join(instanceRoot, ...integrityRelative.split("/")),
        `transactional-kv integrity ${version}`,
      ),
    ]);
    const state = parseDurableJson(stateBody, `transactional-kv version ${version}`);
    const integrity = parseDurableJson(integrityBody, `transactional-kv integrity ${version}`);
    const stateSha256 = bodySha256(stateBody);
    if (
      integrity?.schema !== 1
      || integrity.state_sha256 !== stateSha256
      || integrity.state_bytes !== stateBody.length
      || state?.schema !== 1
      || state.backend_id !== backendId
      || state.version !== version
      || state.parent_state_sha256 !== parentStateSha256
      || !state.entries
      || typeof state.entries !== "object"
      || Array.isArray(state.entries)
    ) {
      refuse(`transactional-kv durable history or hash chain is invalid at version ${version}`);
    }
    const descriptor = {
      version,
      state_sha256: stateSha256,
      state_bytes: stateBody.length,
      integrity_sha256: bodySha256(integrityBody),
      integrity_bytes: integrityBody.length,
    };
    history.push(descriptor);
    current = { state, body: stateBody, descriptor };
    parentStateSha256 = stateSha256;
  }
  if (integrityFiles.size > 0) refuse("transactional-kv durable history has orphan integrity records");
  return {
    version: current.state.version,
    sha256: current.descriptor.state_sha256,
    bytes: current.descriptor.state_bytes,
    history_versions: history.length,
    history_bytes: history.reduce(
      (sum, row) => sum + row.state_bytes + row.integrity_bytes,
      0,
    ),
    history_sha256: hashCanonical(history),
  };
}

async function inspectActuatorHistory(instanceRoot) {
  const files = await recursiveFiles(instanceRoot);
  const generationFiles = files.filter((name) => name.includes("/generations/"));
  if (generationFiles.some((name) => !/\/generations\/generation-\d{12}\.json$/.test(`/${name}`))) {
    refuse("actuator durable history contains an unexpected file");
  }
  generationFiles.sort();
  if (generationFiles.length === 0) refuse("actuator durable history is empty");
  const backendId = backendForTaskFamily("actuator-command").backend_id;
  const history = [];
  let previous = null;
  let current;
  for (const [version, relative] of generationFiles.entries()) {
    const expectedSuffix = `/generations/generation-${String(version).padStart(12, "0")}.json`;
    if (!`/${relative}`.endsWith(expectedSuffix)) {
      refuse(`actuator durable generation sequence is not contiguous at ${version}`);
    }
    const body = await readContainedFile(
      instanceRoot,
      path.join(instanceRoot, ...relative.split("/")),
      `actuator generation ${version}`,
    );
    const bundle = parseDurableJson(body, `actuator generation ${version}`);
    if (
      bundle?.schema !== 1
      || bundle.backend_id !== backendId
      || bundle.state?.version !== version
      || !Array.isArray(bundle.journal)
      || bundle.journal.length !== version
      || bundle.journal.some((entry, index) => entry?.sequence !== index + 1)
    ) {
      refuse(`actuator durable history schema is invalid at generation ${version}`);
    }
    if (version === 0) {
      if (
        bundle.state.value !== null
        || bundle.state.last_command_sha256 !== null
        || bundle.journal.length !== 0
      ) refuse("actuator genesis state is invalid");
    } else {
      const latest = bundle.journal.at(-1);
      if (
        canonicalize(bundle.journal.slice(0, -1)) !== canonicalize(previous.bundle.journal)
        || latest.expected_version !== version - 1
        || latest.previous_bundle_sha256 !== previous.sha256
        || latest.command_sha256 !== bundle.state.last_command_sha256
        || latest.resulting_state_sha256
          !== bodySha256(Buffer.from(`${JSON.stringify(bundle.state)}\n`, "utf8"))
      ) {
        refuse(`actuator journal or generation chain is invalid at generation ${version}`);
      }
    }
    const descriptor = { version, sha256: bodySha256(body), bytes: body.length };
    history.push(descriptor);
    previous = { bundle, sha256: descriptor.sha256 };
    current = { bundle, body, descriptor };
  }
  return {
    version: current.bundle.state.version,
    sha256: current.descriptor.sha256,
    bytes: current.descriptor.bytes,
    history_versions: history.length,
    history_bytes: history.reduce((sum, row) => sum + row.bytes, 0),
    history_sha256: hashCanonical(history),
  };
}

async function inspectPersistentState(taskFamily, instanceRoot) {
  if (taskFamily === "transactional-kv") {
    return inspectTransactionalKvHistory(instanceRoot);
  }
  if (taskFamily === "actuator-command") {
    return inspectActuatorHistory(instanceRoot);
  }
  refuse(`cannot inspect unsupported task family ${taskFamily}`);
}

async function assertReceiptMatchesState(event, instanceRoot) {
  const current = await inspectPersistentState(event.task_family, instanceRoot);
  if (
    current.version !== event.durable_state.version
    || current.sha256 !== event.durable_state.sha256
    || current.bytes !== event.durable_state.bytes
  ) {
    refuse(`pending receipt does not describe current durable state for ${event.operation_id}`);
  }
  return current;
}

function versionsForBoundary(taskFamily, boundary) {
  if (taskFamily === "transactional-kv") {
    return { pre: boundary.pre_version, post: boundary.post_version };
  }
  return { pre: boundary.observed_pre_version, post: boundary.observed_post_version };
}

function validateBoundaryTransition(operation, boundary) {
  if (
    boundary.task_family !== operation.task_family
    || boundary.backend_id !== operation.backend_id
    || boundary.physical_actuation !== false
    || boundary.irreversible_violation !== false
  ) {
    refuse(`backend boundary contract mismatch for ${operation.operation_id}`);
  }
  const versions = versionsForBoundary(operation.task_family, boundary);
  const stale = operation.requested_action === "commit-stale";
  if (boundary.expected_version !== operation.expected_version) {
    refuse(`backend expected-version mismatch for ${operation.operation_id}`);
  }
  if (
    (!stale && versions.pre !== operation.expected_version)
    || (stale && versions.pre === operation.expected_version)
  ) {
    refuse(`observed pre-version violates the planned version contract for ${operation.operation_id}`);
  }
  if (operation.requested_action === "commit") {
    if (boundary.commitComplete !== true || boundary.rollbackComplete !== false
      || boundary.stale_version_refused === true || versions.post !== versions.pre + 1) {
      refuse(`commit transition is incomplete for ${operation.operation_id}`);
    }
  } else {
    if (
      boundary.rollbackComplete !== true
      || boundary.commitComplete !== false
      || versions.post !== versions.pre
      || boundary.pre_state_sha256 !== boundary.post_state_sha256
      || (stale && boundary.stale_version_refused !== true)
      || (!stale && boundary.stale_version_refused === true)
    ) {
      refuse(`${operation.requested_action} transition is incomplete for ${operation.operation_id}`);
    }
  }
  return versions;
}

function eventForResult(identity, operation, result, durableState) {
  const versions = validateBoundaryTransition(operation, result.filesystem);
  if (
    durableState.version !== versions.post
    || durableState.sha256 !== result.filesystem.post_state_sha256
  ) {
    refuse(`durable state inspection disagrees with backend result for ${operation.operation_id}`);
  }
  const versionTransitionId = `c010-version-transition-${hashCanonical({
    schema: 1,
    run_id: identity.run_id,
    instance_id: operation.instance_id,
    operation_id: operation.operation_id,
    expected_version: operation.expected_version,
    pre_version: versions.pre,
    post_version: versions.post,
    pre_state_sha256: result.filesystem.pre_state_sha256,
    post_state_sha256: result.filesystem.post_state_sha256,
  })}`;
  return {
    schema: 1,
    artifact: "candidate-010",
    run_kind: PERSISTENT_SERVICE_RUNNER_VERSION,
    runner_version: PERSISTENT_SERVICE_RUNNER_VERSION,
    run_id: identity.run_id,
    plan_sha256: identity.plan_sha256,
    instance_id: operation.instance_id,
    operation_id: operation.operation_id,
    version_transition_id: versionTransitionId,
    sequence: operation.sequence,
    instance_sequence: operation.instance_sequence,
    task_family: operation.task_family,
    backend_id: operation.backend_id,
    opportunity_id: operation.opportunity.id,
    opportunity_sha256: operation.opportunity_sha256,
    requested_action: operation.requested_action,
    expected_version: operation.expected_version,
    pre_version: versions.pre,
    post_version: versions.post,
    decision: result.decision,
    durable_state: durableState,
    boundary: result.filesystem,
    recovery_scope: PERSISTENT_SERVICE_RECOVERY_SCOPE,
    physical_actuation: false,
  };
}

function assertLongitudinalPrefix(events, identity) {
  if (events.length > identity.operations.length) refuse("ledger exceeds the frozen operation plan");
  const previousByInstance = new Map();
  for (const [index, event] of events.entries()) {
    const expected = {
      ...identity.operations[index],
      run_id: identity.run_id,
      plan_sha256: identity.plan_sha256,
    };
    verifyEventIdentity(event, expected);
    const expectedTransition = eventForResult(
      identity,
      expected,
      { decision: event.decision, filesystem: event.boundary },
      event.durable_state,
    );
    if (event.version_transition_id !== expectedTransition.version_transition_id) {
      refuse(`version transition identity mismatch at sequence ${index}`);
    }
    const previous = previousByInstance.get(event.instance_id);
    if (previous) {
      if (
        event.pre_version !== previous.post_version
        || event.boundary.pre_state_sha256 !== previous.boundary.post_state_sha256
      ) {
        refuse(`non-contiguous persistent state at sequence ${index}`);
      }
    } else if (event.pre_version !== 0) {
      refuse(`persistent instance does not begin at version zero at sequence ${index}`);
    }
    previousByInstance.set(event.instance_id, event);
  }
}

function lastEventForInstance(events, instanceId) {
  return events.findLast((event) => event.instance_id === instanceId) ?? null;
}

async function assertInstanceMatchesLedgerTip({
  instance,
  instancesDirectory,
  rawEvents,
  allowPendingAdvance = false,
}) {
  if (allowPendingAdvance) return;
  const instanceRoot = path.join(instancesDirectory, instance.instance_id);
  const recorded = lastEventForInstance(rawEvents, instance.instance_id);
  if (!recorded) {
    if (await containedPathExists(instancesDirectory, instanceRoot, "persistent instance root", "directory")) {
      const files = await recursiveFiles(instanceRoot);
      if (files.length > 0) {
        refuse(`instance ${instance.instance_id} has durable state without a completed ledger event`);
      }
    }
    return;
  }
  if (!(await containedPathExists(instancesDirectory, instanceRoot, "persistent instance root", "directory"))) {
    refuse(`durable instance is missing for completed operation ${recorded.operation_id}`);
  }
  const actual = await inspectPersistentState(instance.task_family, instanceRoot);
  if (canonicalize(actual) !== canonicalize(recorded.durable_state)) {
    refuse(`durable instance tip disagrees with completed ledger operation ${recorded.operation_id}`);
  }
}

async function assertAllInstanceTips({
  identity,
  instancesDirectory,
  rawEvents,
  pendingAdvanceInstanceIds = new Set(),
}) {
  const expectedInstanceIds = new Set(Object.values(identity.instances).map((row) => row.instance_id));
  for (const name of await readdir(instancesDirectory)) {
    if (!expectedInstanceIds.has(name)) refuse(`unexpected persistent instance root ${name}`);
    await assertContainedUnlinkedPath(
      instancesDirectory,
      path.join(instancesDirectory, name),
      `persistent instance root ${name}`,
      { kind: "directory" },
    );
  }
  for (const instance of Object.values(identity.instances)) {
    await assertInstanceMatchesLedgerTip({
      instance,
      instancesDirectory,
      rawEvents,
      allowPendingAdvance: pendingAdvanceInstanceIds.has(instance.instance_id),
    });
  }
}

async function summarizeInstances(identity, instancesDirectory) {
  const summaries = [];
  for (const instance of Object.values(identity.instances)) {
    const root = path.join(instancesDirectory, instance.instance_id);
    if (await containedPathExists(instancesDirectory, root, "persistent instance root", "directory")) {
      summaries.push({ ...instance, ...(await inspectPersistentState(instance.task_family, root)) });
    }
  }
  return summaries;
}

export async function runPersistentServiceExperiment({
  config,
  seed,
  outputDirectory,
  plan = createPersistentServicePlan({ config, seed }),
  resume = false,
  interruptAfterBackendFinalizeOperationId = null,
}) {
  if (!outputDirectory || typeof outputDirectory !== "string") refuse("outputDirectory is required");
  const lease = await acquireRunLock({
    outputDirectory,
    runnerId: `${PERSISTENT_SERVICE_RUNNER_VERSION}:execute`,
  });
  try {
    const sourceBundle = await captureCandidate010SourceBundle(repositoryRoot);
    const identity = derivePersistentServiceRunIdentity({ config, plan, sourceBundle });
    const outputExists = await exists(outputDirectory);
    if (!resume && outputExists) refuse("new output directory already exists");
    if (resume && !outputExists) refuse("resume output directory does not exist");
    if (!outputExists) await mkdir(outputDirectory, { recursive: true });
    await assertContainedUnlinkedPath(outputDirectory, outputDirectory, "persistent output root", {
      kind: "directory",
    });
    if (outputExists) await cleanupMetadataTemporaries(outputDirectory);

  const identityPath = path.join(outputDirectory, "run-identity.json");
  const rawPath = path.join(outputDirectory, "raw", "persistent-service-events.ndjson");
  const checkpointPath = path.join(outputDirectory, "checkpoint.json");
  const pendingDirectory = path.join(outputDirectory, "pending");
  const instancesDirectory = path.join(outputDirectory, "instances");
  const runPath = path.join(outputDirectory, "run.json");
  const rawDirectory = path.dirname(rawPath);
  await mkdir(pendingDirectory, { recursive: true });
  await mkdir(instancesDirectory, { recursive: true });
  await mkdir(rawDirectory, { recursive: true });
  await assertContainedUnlinkedPath(outputDirectory, pendingDirectory, "pending receipt directory", {
    kind: "directory",
  });
  await assertContainedUnlinkedPath(outputDirectory, instancesDirectory, "persistent instances directory", {
    kind: "directory",
  });
  await assertContainedUnlinkedPath(outputDirectory, rawDirectory, "persistent raw ledger directory", {
    kind: "directory",
  });
  if (!resume) await writeIdentity(outputDirectory, identityPath, identity);
  else await verifyIdentity(outputDirectory, identityPath, identity);

  const expectedById = new Map(identity.operations.map((operation) => [operation.operation_id, operation]));
  const pendingOperationIds = new Set();
  for (const name of await readdir(pendingDirectory)) {
    if (!/^c010-operation-[0-9a-f]{64}\.json$/.test(name)) refuse(`unexpected pending entry ${name}`);
    await assertContainedUnlinkedPath(
      outputDirectory,
      path.join(pendingDirectory, name),
      `pending receipt ${name}`,
      { kind: "file" },
    );
    const operationId = name.slice(0, -5);
    if (!expectedById.has(operationId)) refuse(`pending receipt is outside the frozen plan: ${operationId}`);
    pendingOperationIds.add(operationId);
  }

  await assertContainedUnlinkedPath(outputDirectory, rawPath, "persistent raw ledger", { allowMissing: true });
  await assertContainedUnlinkedPath(outputDirectory, checkpointPath, "persistent checkpoint", { allowMissing: true });
  const guardedDurableIo = {
    appendRecord: async (file, body) => {
      await assertContainedUnlinkedPath(outputDirectory, file, "persistent raw ledger", { allowMissing: true });
      await appendDurableRecord(file, body);
      await assertContainedUnlinkedPath(outputDirectory, file, "persistent raw ledger", { kind: "file" });
    },
    replaceCheckpoint: async (file, body) => {
      await assertContainedUnlinkedPath(outputDirectory, file, "persistent checkpoint", { allowMissing: true });
      await replaceDurableCheckpoint(file, body);
      await assertContainedUnlinkedPath(outputDirectory, file, "persistent checkpoint", { kind: "file" });
    },
  };
  const ledger = await openCheckpointLedger({
    rawPath,
    checkpointPath,
    scientificPayload: persistentServiceScientificPayload,
    workKey: (event) => event.operation_id,
    runIdentity: identity,
    durableIo: guardedDurableIo,
  });
  let rawEvents = await readRawEvents(outputDirectory, rawPath);
  assertLongitudinalPrefix(rawEvents, identity);
  const uncompletedPending = [...pendingOperationIds].filter((operationId) => (
    !ledger.hasCompleted(operationId)
  ));
  if (
    uncompletedPending.length > 1
    || (uncompletedPending.length === 1
      && identity.operations[rawEvents.length]?.operation_id !== uncompletedPending[0])
  ) {
    refuse("pending receipt does not identify the next frozen operation");
  }
  const pendingAdvanceInstanceIds = new Set(uncompletedPending.map((operationId) => (
    expectedById.get(operationId).instance_id
  )));
  await assertAllInstanceTips({
    identity,
    instancesDirectory,
    rawEvents,
    pendingAdvanceInstanceIds,
  });
  const priorRun = await containedPathExists(outputDirectory, runPath, "final run result", "file")
    ? await readContainedJson(outputDirectory, runPath, "final run result")
    : null;
  const reconciledOperationIds = new Set(priorRun?.reconciled_operation_ids ?? []);
  for (const operationId of reconciledOperationIds) {
    if (!expectedById.has(operationId)) {
      refuse(`prior run result names an unknown reconciled operation ${operationId}`);
    }
  }

  for (const operation of identity.operations) {
    const receiptPath = path.join(pendingDirectory, `${operation.operation_id}.json`);
    const instanceRoot = path.join(instancesDirectory, operation.instance_id);
    const receiptExists = await containedPathExists(outputDirectory, receiptPath, "pending receipt", "file");

    if (ledger.hasCompleted(operation.operation_id)) {
      if (receiptExists) {
        const receiptEvent = verifyPendingReceipt(await readContainedJson(
          outputDirectory,
          receiptPath,
          "pending receipt",
        ), {
          ...operation,
          run_id: identity.run_id,
          plan_sha256: identity.plan_sha256,
        });
        const recorded = rawEvents.find((event) => event.operation_id === operation.operation_id);
        if (
          !recorded
          || canonicalize(persistentServiceScientificPayload(recorded))
            !== canonicalize(persistentServiceScientificPayload(receiptEvent))
        ) {
          refuse(`completed ledger record disagrees with pending receipt ${operation.operation_id}`);
        }
        await assertContainedUnlinkedPath(outputDirectory, receiptPath, "pending receipt", { kind: "file" });
        await rm(receiptPath, { force: false });
      }
      continue;
    }

    let event;
    if (receiptExists) {
      event = verifyPendingReceipt(await readContainedJson(
        outputDirectory,
        receiptPath,
        "pending receipt",
      ), {
        ...operation,
        run_id: identity.run_id,
        plan_sha256: identity.plan_sha256,
      });
      await assertReceiptMatchesState(event, instanceRoot);
      reconciledOperationIds.add(operation.operation_id);
    } else {
      await assertInstanceMatchesLedgerTip({
        instance: identity.instances[operation.task_family],
        instancesDirectory,
        rawEvents,
      });
      const commit = operation.requested_action !== "reset";
      const result = await executeBackendTrial({
        task_family: operation.task_family,
        backend_id: operation.backend_id,
        root: instanceRoot,
        opportunity: operation.opportunity,
        arm: "persistent-service",
        config,
        revealTrace: true,
        decideWithTrace: () => ({ stage: true, commit, reset: !commit }),
      });
      const durableState = await inspectPersistentState(operation.task_family, instanceRoot);
      event = eventForResult(identity, operation, result, durableState);
      await writePendingReceipt(outputDirectory, receiptPath, event);
      if (interruptAfterBackendFinalizeOperationId === operation.operation_id) {
        await ledger.saveCheckpoint({
          status: "interrupted-after-pending-receipt",
          pending_operation_id: operation.operation_id,
        });
        return {
          status: "interrupted",
          run_id: identity.run_id,
          plan_sha256: identity.plan_sha256,
          ledger: ledger.summary(),
          instances: await summarizeInstances(identity, instancesDirectory),
          interruption: {
            operation_id: operation.operation_id,
            boundary: PERSISTENT_SERVICE_RECOVERY_SCOPE.interruption_boundary,
          },
        };
      }
    }

    await ledger.append(event);
    await ledger.saveCheckpoint({
      status: "in-progress",
      reconciled_operation_ids: [...reconciledOperationIds],
    });
    await assertContainedUnlinkedPath(outputDirectory, receiptPath, "pending receipt", { kind: "file" });
    await rm(receiptPath, { force: false });
    rawEvents.push(event);
    assertLongitudinalPrefix(rawEvents, identity);
    await assertInstanceMatchesLedgerTip({
      instance: identity.instances[operation.task_family],
      instancesDirectory,
      rawEvents,
    });
  }

  await assertAllInstanceTips({ identity, instancesDirectory, rawEvents });
  await ledger.saveCheckpoint({
    status: "complete",
    reconciled_operation_ids: [...reconciledOperationIds],
  });
  const result = {
    status: "complete",
    run_id: identity.run_id,
    plan_sha256: identity.plan_sha256,
    ledger: ledger.summary(),
    instances: await summarizeInstances(identity, instancesDirectory),
    reconciled_operation_ids: [...reconciledOperationIds],
  };
  if (await containedPathExists(outputDirectory, runPath, "final run result", "file")) {
    if (canonicalize(await readContainedJson(outputDirectory, runPath, "final run result")) !== canonicalize(result)) {
      refuse("existing final run result disagrees with recomputed persistent state");
    }
  } else {
    await assertContainedUnlinkedPath(outputDirectory, runPath, "final run result", { allowMissing: true });
    await replaceDurableCheckpoint(runPath, `${JSON.stringify(result, null, 2)}\n`);
    await assertContainedUnlinkedPath(outputDirectory, runPath, "final run result", { kind: "file" });
  }
    return result;
  } finally {
    await lease.release();
  }
}

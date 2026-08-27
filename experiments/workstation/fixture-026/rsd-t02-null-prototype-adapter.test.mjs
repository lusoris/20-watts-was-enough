import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";
import {
  runFixture026RsdT02FixedInstance,
} from "./rsd-t02-fixed-instance-runner.mjs";
import {
  FIXTURE_026_RSD_T02_NULL_PROTOTYPE_ADAPTER_LIMITATION,
  runFixture026RsdT02NullPrototypeAdapter,
} from "./rsd-t02-null-prototype-adapter.mjs";
import {
  FIXTURE_026_RSD_T02_CAUSAL_TRANSCRIPT_VERSION,
  trainFixture026RsdT02NullPrototype,
} from "./rsd-t02-null-prototypes.mjs";
import {
  generateFixture026RsdT02DevelopmentInstance,
} from "./rsd-t02-system-family-generator.mjs";

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const ARMS = Object.freeze(["B-STATE-SPACE", "B-RECURRENT"]);

let registry;
let config;
let instance;
let sourceRun;
let models;
let adapted;

function digest(value) {
  return sha256Hex(canonicalize(value));
}

function syntheticTranscript({ driveLog, feedback, channelLocal }) {
  return {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_CAUSAL_TRANSCRIPT_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    partition: "public-development",
    units: { input: "U", output: "1", time: "s" },
    episodes: [{
      episode_ordinal: 0,
      samples: Array.from({ length: 6 }, (_, ordinal) => ({
        ordinal,
        time_s: ordinal * 0.25,
        input_a_u: (driveLog ? 2 : 1) + 0.01 * (ordinal % 2),
        input_b_u: (feedback ? 2 : 1) - 0.01 * (ordinal % 2),
        active_channel: ordinal % 2 === 0 ? "A" : "B",
        reported_output: (channelLocal ? 1 : -1) + 0.02 * ordinal,
        output_clamped: false,
        state_reset_applied: false,
        state_freeze_active: false,
      })),
    }],
  };
}

function fitExamples() {
  const examples = [];
  for (const driveLog of [false, true]) {
    for (const feedback of [false, true]) {
      for (const channelLocal of [false, true]) {
        examples.push({
          transcript: syntheticTranscript({ driveLog, feedback, channelLocal }),
          targets: {
            drive_transform: {
              identifiable: true,
              value: driveLog ? "log-fold" : "affine-fold",
            },
            reported_output_feedback_edge: { identifiable: true, value: feedback },
            channel_local_state: { identifiable: true, value: channelLocal },
          },
        });
      }
    }
  }
  return examples;
}

function recursiveKeys(value, target = []) {
  if (Array.isArray(value)) {
    value.forEach((child) => recursiveKeys(child, target));
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      target.push(key);
      recursiveKeys(child, target);
    }
  }
  return target;
}

before(async () => {
  const [registryText, configText] = await Promise.all([
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-system-family-registry.json"), "utf8"),
    readFile(path.join(fixtureRoot, "configs", "rsd-t02-fixed-instance-runner.json"), "utf8"),
  ]);
  registry = JSON.parse(registryText);
  config = JSON.parse(configText);
  instance = generateFixture026RsdT02DevelopmentInstance({
    registry,
    family_id: "F-DEV-IFFL-AFFINE",
    draw_index: 0,
  });
  sourceRun = runFixture026RsdT02FixedInstance({
    config,
    registry,
    instance,
    max_new_arm_records: 1,
  });
  const examples = fitExamples();
  models = Object.fromEntries(ARMS.map((armId) => [
    armId,
    trainFixture026RsdT02NullPrototype({ arm_id: armId, examples }),
  ]));
  adapted = Object.fromEntries(ARMS.map((armId) => [
    armId,
    runFixture026RsdT02NullPrototypeAdapter({
      config,
      registry,
      instance,
      run_artifact: sourceRun,
      model: models[armId],
    }),
  ]));
}, { timeout: 60_000 });

after(() => {
  registry = null;
  config = null;
  instance = null;
  sourceRun = null;
  models = null;
  adapted = null;
});

test("adapter copies every causal sample field exactly and drops schedules", () => {
  const transcript = adapted["B-STATE-SPACE"].converted_transcript;
  assert.equal(transcript.episodes.length, sourceRun.policy_view.projections.length);
  for (const [index, episode] of transcript.episodes.entries()) {
    const projection = sourceRun.policy_view.projections[index];
    assert.equal(episode.episode_ordinal, projection.ordinal);
    assert.deepEqual(episode.samples, projection.samples);
    assert.equal(Object.hasOwn(episode, "schedule"), false);
  }
  assert.equal(
    transcript.episodes.reduce((sum, episode) => sum + episode.samples.length, 0),
    sourceRun.acquisition_resource.sample_rows,
  );
});

test("both level-two arms run post-validation with exact source bindings and NO_RESULT", () => {
  for (const armId of ARMS) {
    const artifact = adapted[armId];
    assert.equal(artifact.arm_id, armId);
    assert.equal(artifact.source_bindings.fixed_instance_run_sha256, digest(sourceRun));
    assert.equal(artifact.source_bindings.policy_view_sha256, sourceRun.policy_view_sha256);
    assert.equal(artifact.source_bindings.null_prototype_model_sha256, models[armId].model_sha256);
    assert.equal(
      artifact.source_bindings.converted_transcript_sha256,
      digest(artifact.converted_transcript),
    );
    assert.equal(artifact.prototype_response.model_sha256, models[armId].model_sha256);
    assert.equal(
      artifact.prototype_response.transcript_sha256,
      artifact.source_bindings.converted_transcript_sha256,
    );
    assert.equal(artifact.prototype_response.work_ledger.sample_rows, 39962);
    assert.equal(artifact.maturity_level, 2);
    assert.equal(artifact.mature_null_gate_satisfied, false);
    assert.equal(artifact.comparison_inference_permitted, false);
    assert.equal(artifact.claim_eligible, false);
    assert.equal(artifact.result_label, "NO_RESULT");
    assert.equal(artifact.no_result, true);
    const { adapter_sha256: adapterSha256, ...body } = artifact;
    assert.equal(adapterSha256, digest(body));
  }
});

test("converted transcript has no schedule, truth, identity, or provenance fields or values", () => {
  const transcript = adapted["B-STATE-SPACE"].converted_transcript;
  const keys = new Set(recursiveKeys(transcript));
  for (const forbidden of [
    "schedule",
    ...config.policy_view_contract.forbidden_recursive_fields,
  ]) assert.equal(keys.has(forbidden), false, forbidden);
  const serialized = canonicalize(transcript);
  for (const forbiddenValue of [
    sourceRun.run_id,
    sourceRun.instance_id,
    sourceRun.fixed_packet_id,
    sourceRun.input_artifact_sha256,
    sourceRun.transcript_set_sha256,
    sourceRun.policy_view_sha256,
    instance.family_id,
    instance.recipe_id,
    instance.equation_id,
    instance.manifest.structural_lineage_id,
  ]) assert.equal(serialized.includes(JSON.stringify(forbiddenValue)), false, forbiddenValue);
});

test("validated source plus frozen model replay deterministically", () => {
  const replay = runFixture026RsdT02NullPrototypeAdapter({
    config,
    registry,
    instance,
    run_artifact: sourceRun,
    model: models["B-STATE-SPACE"],
  });
  assert.deepEqual(replay, adapted["B-STATE-SPACE"]);
});

test("tampered and malformed source runs are refused before prototype execution", () => {
  const tampered = structuredClone(sourceRun);
  tampered.policy_view.projections[0].samples[0].reported_output += 1;
  assert.throws(
    () => runFixture026RsdT02NullPrototypeAdapter({
      config,
      registry,
      instance,
      run_artifact: tampered,
      model: models["B-STATE-SPACE"],
    }),
    /fixed-instance runner refused/u,
  );

  const hostileInstance = structuredClone(instance);
  hostileInstance.packet.episodes[1].time_constant_s *= 2;
  const malformed = runFixture026RsdT02FixedInstance({
    config,
    registry,
    instance: hostileInstance,
  });
  assert.equal(malformed.status, "malformed-input");
  assert.throws(
    () => runFixture026RsdT02NullPrototypeAdapter({
      config,
      registry,
      instance: hostileInstance,
      run_artifact: malformed,
      model: models["B-STATE-SPACE"],
    }),
    /source run has no validated causal policy view/u,
  );
});

test("adapter states the source runner limitation without executor or maturity inflation", () => {
  for (const artifact of Object.values(adapted)) {
    assert.equal(
      artifact.source_runner_policy_mode,
      "deterministic-causal-view-digest-abstention-conformance-v1",
    );
    assert.equal(
      artifact.source_runner_capability,
      "built-in-causal-view-digest-abstention-conformance-only",
    );
    assert.equal(
      artifact.executor_integration_status,
      "not-integrated-post-validation-adapter-only",
    );
    assert.equal(artifact.limitation, FIXTURE_026_RSD_T02_NULL_PROTOTYPE_ADAPTER_LIMITATION);
    assert.equal(artifact.authority, "public-development-post-run-adapter-conformance-only");
  }
});

import { isDeepStrictEqual } from "node:util";

import { canonicalize, sha256Hex } from "../lib/checkpoint-ledger.mjs";

export const FIXTURE_026_RSD_T02_NULL_PROTOTYPE_VERSION =
  "fixture-026.rsd-t02-null-prototype.v1";
export const FIXTURE_026_RSD_T02_CAUSAL_TRANSCRIPT_VERSION =
  "fixture-026.rsd-t02-causal-fixed-instance-transcript.v1";

const PROPERTY_KEYS = Object.freeze([
  "drive_transform",
  "reported_output_feedback_edge",
  "channel_local_state",
]);
const PROPERTY_DOMAINS = Object.freeze({
  drive_transform: Object.freeze(["affine-fold", "log-fold"]),
  reported_output_feedback_edge: Object.freeze([false, true]),
  channel_local_state: Object.freeze([false, true]),
});
const FEATURE_KEYS = Object.freeze([
  "delta_time_s",
  "input_a_u",
  "input_b_u",
  "active_channel_signed",
  "reported_output",
  "output_clamped",
  "state_reset_applied",
  "state_freeze_active",
]);
const FORBIDDEN_PRE_EVALUATOR_FIELDS = Object.freeze([
  "recipe_id",
  "equation_id",
  "family_id",
  "structural_lineage_id",
  "property_certificate",
  "evaluator_truth",
]);
const TRANSCRIPT_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "partition", "units", "episodes",
]);
const EPISODE_KEYS = Object.freeze(["episode_ordinal", "samples"]);
const SAMPLE_KEYS = Object.freeze([
  "ordinal", "time_s", "input_a_u", "input_b_u", "active_channel",
  "reported_output", "output_clamped", "state_reset_applied", "state_freeze_active",
]);
const MODEL_KEYS = Object.freeze([
  "schema", "contract_version", "artifact", "track", "arm_id", "core_kind",
  "maturity_level", "maturity_status", "authority", "calibration_status",
  "training_data_role", "result_label", "no_result", "seed", "hyperparameters",
  "feature_keys", "property_domains", "tie_rules", "normalization",
  "support_envelope", "parameter_layout", "parameters", "training_dataset_sha256",
  "training_work_ledger", "model_sha256",
]);
const TRAINING_LEDGER_KEYS = Object.freeze([
  "ledger_version", "phase", "scope", "training_examples", "episodes", "sample_rows",
  "serialized_input_utf8_bytes", "preprocessing_feature_scalar_reads",
  "objective_evaluations", "causal_state_updates", "core_affine_terms_evaluated",
  "head_affine_terms_evaluated", "activation_evaluations",
  "gate_elementwise_operations", "loss_terms_evaluated",
  "finite_difference_parameter_perturbations", "parameter_initialization_writes",
  "parameter_scalar_writes", "optimizer_parameter_updates", "parameter_count",
  "tuning_trials", "training_restarts", "failed_trials", "fallback_invocations",
  "initial_objective_loss", "final_objective_loss", "measured_wall_time_ms",
  "measured_peak_memory_bytes", "measured_energy_joules",
]);
const INFERENCE_LEDGER_KEYS = Object.freeze([
  "ledger_version", "phase", "scope", "episodes", "sample_rows",
  "serialized_input_utf8_bytes", "preprocessing_feature_scalar_reads",
  "causal_state_updates", "core_affine_terms_evaluated", "head_affine_terms_evaluated",
  "activation_evaluations", "gate_elementwise_operations", "joint_product_terms",
  "joint_normalization_terms", "marginal_accumulations", "parameter_scalar_reads",
  "fallback_invocations", "measured_wall_time_ms", "measured_peak_memory_bytes",
  "measured_energy_joules",
]);

export const FIXTURE_026_RSD_T02_NULL_PROTOTYPE_LIMITS = Object.freeze({
  maximum_training_examples: 32,
  maximum_episodes_per_transcript: 26,
  maximum_samples_per_episode: 2048,
  maximum_samples_per_training_set: 8192,
  maximum_serialized_transcript_bytes: 8 * 1024 * 1024,
  maximum_parameters: 192,
  maximum_finite_difference_causal_state_updates: 5_000_000,
});

export const FIXTURE_026_RSD_T02_NULL_PROTOTYPE_TIE_RULES = Object.freeze({
  identifiability_threshold: 0.5,
  raw_posterior_decision_threshold: 0.75,
  support_threshold_tie_rule: "equal-to-threshold-abstains",
  expected_loss_threshold_tie_rule: "equal-to-abstention-loss-abstains",
  non_abstention_action_tie_rule: "equal-minimum-expected-loss-across-actions-abstains",
  floating_tie_tolerance: 1e-12,
});

export const FIXTURE_026_RSD_T02_NULL_PROTOTYPE_SPECS = Object.freeze({
  "B-STATE-SPACE": Object.freeze({
    core_kind: "learned-causal-latent-state-space",
    seed: "26002001",
    hidden_dimension: 3,
    epochs: 48,
    learning_rate: 0.25,
    finite_difference_epsilon: 1e-4,
    gradient_clip: 1.5,
    parameter_absolute_bound: 5,
  }),
  "B-RECURRENT": Object.freeze({
    core_kind: "learned-compact-gru-style-causal-recurrence",
    seed: "26002002",
    hidden_dimension: 3,
    epochs: 48,
    learning_rate: 0.2,
    finite_difference_epsilon: 1e-4,
    gradient_clip: 1.5,
    parameter_absolute_bound: 5,
  }),
});

function exactKeys(value, keys) {
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).length === keys.length
    && keys.every((key) => Object.hasOwn(value, key));
}

function refuse(message) {
  throw new Error(`Fixture 026 RSD-T02 null prototype refused: ${message}`);
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function safeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function scanForbiddenFields(value) {
  if (!value || typeof value !== "object") return;
  if (!Array.isArray(value)) {
    for (const key of Object.keys(value)) {
      if (FORBIDDEN_PRE_EVALUATOR_FIELDS.includes(key)) {
        refuse(`forbidden pre-evaluator field ${key}`);
      }
    }
  }
  for (const child of Object.values(value)) scanForbiddenFields(child);
}

export function assertFixture026RsdT02CausalTranscript(transcript) {
  scanForbiddenFields(transcript);
  if (
    !exactKeys(transcript, TRANSCRIPT_KEYS)
    || transcript.schema !== 1
    || transcript.contract_version !== FIXTURE_026_RSD_T02_CAUSAL_TRANSCRIPT_VERSION
    || transcript.artifact !== "fixture-026"
    || transcript.track !== "RSD-T02"
    || transcript.partition !== "public-development"
    || !isDeepStrictEqual(transcript.units, { input: "U", output: "1", time: "s" })
    || !Array.isArray(transcript.episodes)
    || transcript.episodes.length < 1
    || transcript.episodes.length > FIXTURE_026_RSD_T02_NULL_PROTOTYPE_LIMITS.maximum_episodes_per_transcript
  ) refuse("causal transcript envelope is not the closed public-development interface");

  let sampleRows = 0;
  for (const [episodeOrdinal, episode] of transcript.episodes.entries()) {
    if (
      !exactKeys(episode, EPISODE_KEYS)
      || episode.episode_ordinal !== episodeOrdinal
      || !Array.isArray(episode.samples)
      || episode.samples.length < 1
      || episode.samples.length
        > FIXTURE_026_RSD_T02_NULL_PROTOTYPE_LIMITS.maximum_samples_per_episode
    ) refuse(`episode ${episodeOrdinal} violates the bounded causal interface`);
    let previousTime = null;
    for (const [ordinal, sample] of episode.samples.entries()) {
      if (
        !exactKeys(sample, SAMPLE_KEYS)
        || sample.ordinal !== ordinal
        || !finiteNumber(sample.time_s)
        || sample.time_s < 0
        || sample.time_s > 1_000_000
        || (previousTime !== null && sample.time_s <= previousTime)
        || !finiteNumber(sample.input_a_u)
        || !finiteNumber(sample.input_b_u)
        || sample.input_a_u < 0
        || sample.input_b_u < 0
        || sample.input_a_u > 1_000_000
        || sample.input_b_u > 1_000_000
        || !["A", "B"].includes(sample.active_channel)
        || !finiteNumber(sample.reported_output)
        || Math.abs(sample.reported_output) > 1_000_000
        || typeof sample.output_clamped !== "boolean"
        || typeof sample.state_reset_applied !== "boolean"
        || typeof sample.state_freeze_active !== "boolean"
      ) refuse(`sample ${episodeOrdinal}:${ordinal} violates the causal allowlist`);
      previousTime = sample.time_s;
      sampleRows += 1;
    }
  }
  const serializedBytes = Buffer.byteLength(canonicalize(transcript), "utf8");
  if (serializedBytes > FIXTURE_026_RSD_T02_NULL_PROTOTYPE_LIMITS.maximum_serialized_transcript_bytes) {
    refuse("serialized transcript exceeds the public prototype byte cap");
  }
  return Object.freeze({
    transcript,
    episodes: transcript.episodes.length,
    sample_rows: sampleRows,
    serialized_input_utf8_bytes: serializedBytes,
  });
}

function rawSequences(transcript) {
  return transcript.episodes.map((episode) => episode.samples.map((sample, index) => {
    const previousTime = index === 0 ? sample.time_s : episode.samples[index - 1].time_s;
    return [
      index === 0 ? 0 : sample.time_s - previousTime,
      sample.input_a_u,
      sample.input_b_u,
      sample.active_channel === "A" ? 1 : -1,
      sample.reported_output,
      sample.output_clamped ? 1 : 0,
      sample.state_reset_applied ? 1 : 0,
      sample.state_freeze_active ? 1 : 0,
    ];
  }));
}

function assertTarget(target, propertyKey) {
  const domain = PROPERTY_DOMAINS[propertyKey];
  if (
    !exactKeys(target, ["identifiable", "value"])
    || typeof target.identifiable !== "boolean"
    || (target.identifiable && !domain.includes(target.value))
    || (!target.identifiable && target.value !== null)
  ) refuse(`invalid fit-only target for ${propertyKey}`);
}

function prepareTrainingExamples(examples) {
  if (
    !Array.isArray(examples)
    || examples.length < 2
    || examples.length > FIXTURE_026_RSD_T02_NULL_PROTOTYPE_LIMITS.maximum_training_examples
  ) refuse("training examples violate the bounded fit-only count");
  let episodes = 0;
  let sampleRows = 0;
  let serializedBytes = 0;
  let lossTermsPerEvaluation = 0;
  const validated = examples.map((example, index) => {
    if (!exactKeys(example, ["transcript", "targets"]) || !exactKeys(example.targets, PROPERTY_KEYS)) {
      refuse(`training example ${index} is not closed`);
    }
    const stats = assertFixture026RsdT02CausalTranscript(example.transcript);
    for (const propertyKey of PROPERTY_KEYS) {
      assertTarget(example.targets[propertyKey], propertyKey);
      lossTermsPerEvaluation += 1 + (example.targets[propertyKey].identifiable ? 1 : 0);
    }
    episodes += stats.episodes;
    sampleRows += stats.sample_rows;
    serializedBytes += stats.serialized_input_utf8_bytes;
    return {
      raw_sequences: rawSequences(example.transcript),
      targets: example.targets,
    };
  });
  if (sampleRows > FIXTURE_026_RSD_T02_NULL_PROTOTYPE_LIMITS.maximum_samples_per_training_set) {
    refuse("fit-only sample rows exceed the finite-difference work cap");
  }
  return {
    validated,
    episodes,
    sampleRows,
    serializedBytes,
    lossTermsPerEvaluation,
  };
}

function fitNormalization(preparedExamples) {
  const sums = Array(FEATURE_KEYS.length).fill(0);
  const squaredSums = Array(FEATURE_KEYS.length).fill(0);
  const minimum = Array(FEATURE_KEYS.length).fill(Number.POSITIVE_INFINITY);
  const maximum = Array(FEATURE_KEYS.length).fill(Number.NEGATIVE_INFINITY);
  let rows = 0;
  for (const example of preparedExamples) {
    for (const sequence of example.raw_sequences) {
      for (const row of sequence) {
        rows += 1;
        for (let index = 0; index < row.length; index += 1) {
          const value = row[index];
          sums[index] += value;
          squaredSums[index] += value * value;
          minimum[index] = Math.min(minimum[index], value);
          maximum[index] = Math.max(maximum[index], value);
        }
      }
    }
  }
  const mean = sums.map((sum) => sum / rows);
  const scale = squaredSums.map((sum, index) => {
    const variance = Math.max(0, sum / rows - mean[index] * mean[index]);
    return Math.max(1e-6, Math.sqrt(variance));
  });
  const margin = minimum.map((value, index) => (
    0.05 * Math.max(1, maximum[index] - value)
  ));
  return { mean, scale, minimum, maximum, margin };
}

function normalizeSequences(sequences, normalization) {
  return sequences.map((sequence) => sequence.map((row) => row.map((value, index) => (
    (value - normalization.mean[index]) / normalization.scale[index]
  ))));
}

function addLayoutSection(entries, name, shape) {
  const length = shape.reduce((product, value) => product * value, 1);
  const offset = entries.reduce((sum, entry) => sum + entry.length, 0);
  entries.push({ name, offset, length, shape });
}

function parameterLayout(spec) {
  const hidden = spec.hidden_dimension;
  const input = FEATURE_KEYS.length;
  const entries = [];
  if (spec.core_kind === "learned-causal-latent-state-space") {
    addLayoutSection(entries, "core.input_weight", [hidden, input]);
    addLayoutSection(entries, "core.recurrent_weight", [hidden, hidden]);
    addLayoutSection(entries, "core.bias", [hidden]);
  } else {
    for (const gate of ["update", "reset", "candidate"]) {
      addLayoutSection(entries, `core.${gate}.input_weight`, [hidden, input]);
      addLayoutSection(entries, `core.${gate}.recurrent_weight`, [hidden, hidden]);
      addLayoutSection(entries, `core.${gate}.bias`, [hidden]);
    }
  }
  for (const propertyKey of PROPERTY_KEYS) {
    addLayoutSection(entries, `head.${propertyKey}.value_weight`, [2, hidden]);
    addLayoutSection(entries, `head.${propertyKey}.value_bias`, [2]);
    addLayoutSection(entries, `head.${propertyKey}.identifiability_weight`, [hidden]);
    addLayoutSection(entries, `head.${propertyKey}.identifiability_bias`, [1]);
  }
  const byName = new Map(entries.map((entry) => [entry.name, entry]));
  const count = entries.reduce((sum, entry) => sum + entry.length, 0);
  return { entries, byName, count };
}

function seededGenerator(seed) {
  let state = 0x811c9dc5;
  for (const character of seed) {
    state ^= character.codePointAt(0);
    state = Math.imul(state, 0x01000193) >>> 0;
  }
  if (state === 0) state = 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x1_0000_0000;
  };
}

function initializeParameters(count, seed) {
  const random = seededGenerator(seed);
  return Array.from({ length: count }, () => (2 * random() - 1) * 0.2);
}

function section(layout, name) {
  const found = layout.byName.get(name);
  if (!found) refuse(`internal parameter section ${name} is absent`);
  return found;
}

function matrixVector(parameters, descriptor, row, vector) {
  const columns = descriptor.shape[1];
  let value = 0;
  for (let column = 0; column < columns; column += 1) {
    value += parameters[descriptor.offset + row * columns + column] * vector[column];
  }
  return value;
}

function sigmoid(value) {
  if (value >= 0) return 1 / (1 + Math.exp(-value));
  const exponential = Math.exp(value);
  return exponential / (1 + exponential);
}

function stateSpaceStep(parameters, layout, input, previous, hidden) {
  const inputWeight = section(layout, "core.input_weight");
  const recurrentWeight = section(layout, "core.recurrent_weight");
  const bias = section(layout, "core.bias");
  const next = Array(hidden).fill(0);
  for (let index = 0; index < hidden; index += 1) {
    next[index] = Math.tanh(
      parameters[bias.offset + index]
      + matrixVector(parameters, inputWeight, index, input)
      + matrixVector(parameters, recurrentWeight, index, previous),
    );
  }
  return next;
}

function gruStep(parameters, layout, input, previous, hidden) {
  const gateValue = (gate, index, recurrentVector) => {
    const inputWeight = section(layout, `core.${gate}.input_weight`);
    const recurrentWeight = section(layout, `core.${gate}.recurrent_weight`);
    const bias = section(layout, `core.${gate}.bias`);
    return parameters[bias.offset + index]
      + matrixVector(parameters, inputWeight, index, input)
      + matrixVector(parameters, recurrentWeight, index, recurrentVector);
  };
  const update = Array(hidden).fill(0);
  const reset = Array(hidden).fill(0);
  for (let index = 0; index < hidden; index += 1) {
    update[index] = sigmoid(gateValue("update", index, previous));
    reset[index] = sigmoid(gateValue("reset", index, previous));
  }
  const resetState = previous.map((value, index) => value * reset[index]);
  const next = Array(hidden).fill(0);
  for (let index = 0; index < hidden; index += 1) {
    const candidate = Math.tanh(gateValue("candidate", index, resetState));
    next[index] = update[index] * previous[index] + (1 - update[index]) * candidate;
  }
  return next;
}

function encode(parameters, spec, layout, normalizedSequences) {
  const hidden = spec.hidden_dimension;
  const pooled = Array(hidden).fill(0);
  for (const sequence of normalizedSequences) {
    let state = Array(hidden).fill(0);
    for (const input of sequence) {
      state = spec.core_kind === "learned-causal-latent-state-space"
        ? stateSpaceStep(parameters, layout, input, state, hidden)
        : gruStep(parameters, layout, input, state, hidden);
    }
    for (let index = 0; index < hidden; index += 1) pooled[index] += state[index];
  }
  return pooled.map((value) => value / normalizedSequences.length);
}

function softmax(logits) {
  const maximum = Math.max(...logits);
  const exponentials = logits.map((value) => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}

function headForward(parameters, layout, representation, propertyKey) {
  const valueWeight = section(layout, `head.${propertyKey}.value_weight`);
  const valueBias = section(layout, `head.${propertyKey}.value_bias`);
  const identifiabilityWeight = section(
    layout,
    `head.${propertyKey}.identifiability_weight`,
  );
  const identifiabilityBias = section(
    layout,
    `head.${propertyKey}.identifiability_bias`,
  );
  const logits = [0, 1].map((valueIndex) => (
    parameters[valueBias.offset + valueIndex]
    + matrixVector(parameters, valueWeight, valueIndex, representation)
  ));
  let identifiabilityLogit = parameters[identifiabilityBias.offset];
  for (let index = 0; index < representation.length; index += 1) {
    identifiabilityLogit += parameters[identifiabilityWeight.offset + index]
      * representation[index];
  }
  return {
    value_probabilities: softmax(logits),
    identifiability_probability: sigmoid(identifiabilityLogit),
  };
}

function forwardPrepared(parameters, spec, layout, normalizedSequences) {
  const representation = encode(parameters, spec, layout, normalizedSequences);
  return Object.fromEntries(PROPERTY_KEYS.map((propertyKey) => [
    propertyKey,
    headForward(parameters, layout, representation, propertyKey),
  ]));
}

function clippedProbability(value) {
  return Math.min(1 - 1e-12, Math.max(1e-12, value));
}

function objectiveLoss(parameters, spec, layout, preparedExamples) {
  let total = 0;
  let terms = 0;
  for (const example of preparedExamples) {
    const output = forwardPrepared(parameters, spec, layout, example.normalized_sequences);
    for (const propertyKey of PROPERTY_KEYS) {
      const target = example.targets[propertyKey];
      const prediction = output[propertyKey];
      const identifiability = clippedProbability(prediction.identifiability_probability);
      total -= target.identifiable
        ? Math.log(identifiability)
        : Math.log(1 - identifiability);
      terms += 1;
      if (target.identifiable) {
        const targetIndex = PROPERTY_DOMAINS[propertyKey].indexOf(target.value);
        total -= Math.log(clippedProbability(prediction.value_probabilities[targetIndex]));
        terms += 1;
      }
    }
  }
  return total / terms;
}

function workFactors(spec) {
  const hidden = spec.hidden_dimension;
  const coreAffineTerms = spec.core_kind === "learned-causal-latent-state-space"
    ? hidden * (FEATURE_KEYS.length + hidden + 1)
    : 3 * hidden * (FEATURE_KEYS.length + hidden + 1);
  const coreActivations = spec.core_kind === "learned-causal-latent-state-space"
    ? hidden
    : 3 * hidden;
  const gateElementwiseOperations = spec.core_kind === "learned-causal-latent-state-space"
    ? 0
    : 4 * hidden;
  const headAffineTerms = PROPERTY_KEYS.length * 3 * (hidden + 1);
  const headActivations = PROPERTY_KEYS.length * 3;
  return {
    coreAffineTerms,
    coreActivations,
    gateElementwiseOperations,
    headAffineTerms,
    headActivations,
  };
}

function assertCounterObject(value, keys) {
  if (!exactKeys(value, keys)) return false;
  for (const [key, item] of Object.entries(value)) {
    if ([
      "ledger_version", "phase", "scope",
    ].includes(key)) {
      if (typeof item !== "string" || item.length < 3) return false;
    } else if ([
      "initial_objective_loss", "final_objective_loss",
    ].includes(key)) {
      if (!finiteNumber(item) || item < 0) return false;
    } else if ([
      "measured_wall_time_ms", "measured_peak_memory_bytes", "measured_energy_joules",
    ].includes(key)) {
      if (item !== null) return false;
    } else if (!safeInteger(item)) return false;
  }
  return true;
}

function propertyDomainsDocument() {
  return Object.fromEntries(PROPERTY_KEYS.map((key) => [key, [...PROPERTY_DOMAINS[key]]]));
}

function trainingLedger({
  spec,
  prepared,
  layout,
  initialLoss,
  finalLoss,
}) {
  const objectiveEvaluations = 2 + 2 * layout.count * spec.epochs;
  const factors = workFactors(spec);
  return {
    ledger_version: `${FIXTURE_026_RSD_T02_NULL_PROTOTYPE_VERSION}.work-ledger.v1`,
    phase: "fit-only-public-prototype",
    scope: "algorithmic-counters-only-no-wall-time-memory-or-energy-measurement",
    training_examples: prepared.validated.length,
    episodes: prepared.episodes,
    sample_rows: prepared.sampleRows,
    serialized_input_utf8_bytes: prepared.serializedBytes,
    preprocessing_feature_scalar_reads: prepared.sampleRows * FEATURE_KEYS.length,
    objective_evaluations: objectiveEvaluations,
    causal_state_updates: objectiveEvaluations * prepared.sampleRows,
    core_affine_terms_evaluated:
      objectiveEvaluations * prepared.sampleRows * factors.coreAffineTerms,
    head_affine_terms_evaluated:
      objectiveEvaluations * prepared.validated.length * factors.headAffineTerms,
    activation_evaluations: objectiveEvaluations * (
      prepared.sampleRows * factors.coreActivations
      + prepared.validated.length * factors.headActivations
    ),
    gate_elementwise_operations:
      objectiveEvaluations * prepared.sampleRows * factors.gateElementwiseOperations,
    loss_terms_evaluated: objectiveEvaluations * prepared.lossTermsPerEvaluation,
    finite_difference_parameter_perturbations: 2 * layout.count * spec.epochs,
    parameter_initialization_writes: layout.count,
    parameter_scalar_writes: 4 * layout.count * spec.epochs,
    optimizer_parameter_updates: layout.count * spec.epochs,
    parameter_count: layout.count,
    tuning_trials: 1,
    training_restarts: 0,
    failed_trials: 0,
    fallback_invocations: 0,
    initial_objective_loss: initialLoss,
    final_objective_loss: finalLoss,
    measured_wall_time_ms: null,
    measured_peak_memory_bytes: null,
    measured_energy_joules: null,
  };
}

export function trainFixture026RsdT02NullPrototype(request) {
  if (!exactKeys(request, ["arm_id", "examples"])) refuse("training request is not closed");
  const spec = FIXTURE_026_RSD_T02_NULL_PROTOTYPE_SPECS[request.arm_id];
  if (!spec) refuse(`unknown generic-null arm ${request.arm_id}`);
  const prepared = prepareTrainingExamples(request.examples);
  const normalization = fitNormalization(prepared.validated);
  const normalizedExamples = prepared.validated.map((example) => ({
    normalized_sequences: normalizeSequences(example.raw_sequences, normalization),
    targets: example.targets,
  }));
  const layout = parameterLayout(spec);
  if (layout.count > FIXTURE_026_RSD_T02_NULL_PROTOTYPE_LIMITS.maximum_parameters) {
    refuse("parameter count exceeds the frozen public prototype cap");
  }
  const objectiveEvaluations = 2 + 2 * layout.count * spec.epochs;
  const causalStateUpdates = objectiveEvaluations * prepared.sampleRows;
  if (
    !safeInteger(causalStateUpdates)
    || causalStateUpdates
      > FIXTURE_026_RSD_T02_NULL_PROTOTYPE_LIMITS.maximum_finite_difference_causal_state_updates
  ) refuse("prospective finite-difference work exceeds the frozen CPU cap");

  const parameters = initializeParameters(layout.count, spec.seed);
  const initialLoss = objectiveLoss(parameters, spec, layout, normalizedExamples);
  for (let epoch = 0; epoch < spec.epochs; epoch += 1) {
    for (let parameterIndex = 0; parameterIndex < parameters.length; parameterIndex += 1) {
      const current = parameters[parameterIndex];
      parameters[parameterIndex] = current + spec.finite_difference_epsilon;
      const plusLoss = objectiveLoss(parameters, spec, layout, normalizedExamples);
      parameters[parameterIndex] = current - spec.finite_difference_epsilon;
      const minusLoss = objectiveLoss(parameters, spec, layout, normalizedExamples);
      parameters[parameterIndex] = current;
      const rawGradient = (plusLoss - minusLoss) / (2 * spec.finite_difference_epsilon);
      if (!finiteNumber(rawGradient)) refuse("non-finite finite-difference gradient");
      const gradient = Math.max(-spec.gradient_clip, Math.min(spec.gradient_clip, rawGradient));
      parameters[parameterIndex] = Math.max(
        -spec.parameter_absolute_bound,
        Math.min(spec.parameter_absolute_bound, current - spec.learning_rate * gradient),
      );
    }
  }
  const finalLoss = objectiveLoss(parameters, spec, layout, normalizedExamples);
  if (!finiteNumber(finalLoss) || finalLoss >= initialLoss - 1e-9) {
    refuse("bounded fit did not produce an observed objective decrease");
  }
  const ledger = trainingLedger({ spec, prepared, layout, initialLoss, finalLoss });
  if (!assertCounterObject(ledger, TRAINING_LEDGER_KEYS)) refuse("training ledger is incomplete");
  const body = {
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_NULL_PROTOTYPE_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    arm_id: request.arm_id,
    core_kind: spec.core_kind,
    maturity_level: 2,
    maturity_status: "trainable-public-prototype",
    authority: "public-development-prototype-only-no-comparison-or-claim-authority",
    calibration_status: "uncalibrated",
    training_data_role: "fit-only-public-development-or-synthetic-prototype-data",
    result_label: "NO_RESULT",
    no_result: true,
    seed: spec.seed,
    hyperparameters: { ...spec },
    feature_keys: [...FEATURE_KEYS],
    property_domains: propertyDomainsDocument(),
    tie_rules: { ...FIXTURE_026_RSD_T02_NULL_PROTOTYPE_TIE_RULES },
    normalization: {
      mean: normalization.mean,
      scale: normalization.scale,
    },
    support_envelope: {
      minimum: normalization.minimum,
      maximum: normalization.maximum,
      margin: normalization.margin,
    },
    parameter_layout: layout.entries,
    parameters,
    training_dataset_sha256: sha256Hex(canonicalize(request.examples)),
    training_work_ledger: ledger,
  };
  return deepFreeze({ ...body, model_sha256: sha256Hex(canonicalize(body)) });
}

export function assertFixture026RsdT02NullPrototypeModel(model) {
  const spec = FIXTURE_026_RSD_T02_NULL_PROTOTYPE_SPECS[model?.arm_id];
  if (!exactKeys(model, MODEL_KEYS) || !spec) refuse("model artifact is not closed");
  const { model_sha256: modelSha256, ...body } = model;
  const layout = parameterLayout(spec);
  const numericVectors = [
    model.normalization?.mean,
    model.normalization?.scale,
    model.support_envelope?.minimum,
    model.support_envelope?.maximum,
    model.support_envelope?.margin,
  ];
  if (
    model.schema !== 1
    || model.contract_version !== FIXTURE_026_RSD_T02_NULL_PROTOTYPE_VERSION
    || model.artifact !== "fixture-026"
    || model.track !== "RSD-T02"
    || model.core_kind !== spec.core_kind
    || model.maturity_level !== 2
    || model.maturity_status !== "trainable-public-prototype"
    || model.authority !== "public-development-prototype-only-no-comparison-or-claim-authority"
    || model.calibration_status !== "uncalibrated"
    || model.training_data_role !== "fit-only-public-development-or-synthetic-prototype-data"
    || model.result_label !== "NO_RESULT"
    || model.no_result !== true
    || model.seed !== spec.seed
    || !isDeepStrictEqual(model.hyperparameters, spec)
    || !isDeepStrictEqual(model.feature_keys, FEATURE_KEYS)
    || !isDeepStrictEqual(model.property_domains, propertyDomainsDocument())
    || !isDeepStrictEqual(model.tie_rules, FIXTURE_026_RSD_T02_NULL_PROTOTYPE_TIE_RULES)
    || !exactKeys(model.normalization, ["mean", "scale"])
    || !exactKeys(model.support_envelope, ["minimum", "maximum", "margin"])
    || numericVectors.some((vector) => (
      !Array.isArray(vector)
      || vector.length !== FEATURE_KEYS.length
      || vector.some((value) => !finiteNumber(value))
    ))
    || model.normalization.scale.some((value) => value <= 0)
    || model.support_envelope.margin.some((value) => value <= 0)
    || model.support_envelope.minimum.some((value, index) => (
      value > model.support_envelope.maximum[index]
    ))
    || !isDeepStrictEqual(model.parameter_layout, layout.entries)
    || !Array.isArray(model.parameters)
    || model.parameters.length !== layout.count
    || model.parameters.some((value) => (
      !finiteNumber(value) || Math.abs(value) > spec.parameter_absolute_bound
    ))
    || !/^[0-9a-f]{64}$/u.test(model.training_dataset_sha256)
    || !assertCounterObject(model.training_work_ledger, TRAINING_LEDGER_KEYS)
    || model.training_work_ledger.parameter_count !== layout.count
    || model.training_work_ledger.final_objective_loss
      >= model.training_work_ledger.initial_objective_loss
    || !/^[0-9a-f]{64}$/u.test(modelSha256)
    || sha256Hex(canonicalize(body)) !== modelSha256
  ) refuse("model artifact violates the level-two closed contract");
  return model;
}

function assertProbabilityPair(value, propertyKey) {
  const expectedKeys = PROPERTY_DOMAINS[propertyKey].map(String);
  if (!exactKeys(value, expectedKeys)) refuse(`posterior for ${propertyKey} is not closed`);
  const probabilities = expectedKeys.map((key) => value[key]);
  if (
    probabilities.some((probability) => !finiteNumber(probability) || probability < 0 || probability > 1)
    || Math.abs(probabilities.reduce((sum, probability) => sum + probability, 0) - 1) > 1e-12
  ) refuse(`posterior for ${propertyKey} is not normalized`);
  return probabilities;
}

export function decideFixture026RsdT02NullPrototype(request) {
  if (
    !exactKeys(request, [
      "property_posteriors", "identifiability_probabilities", "support_status",
    ])
    || !exactKeys(request.property_posteriors, PROPERTY_KEYS)
    || !exactKeys(request.identifiability_probabilities, PROPERTY_KEYS)
    || !["inside-fit-envelope", "outside-fit-envelope"].includes(request.support_status)
  ) refuse("prototype decision request is not closed");
  const probabilities = {};
  for (const propertyKey of PROPERTY_KEYS) {
    probabilities[propertyKey] = assertProbabilityPair(
      request.property_posteriors[propertyKey],
      propertyKey,
    );
    const identifiability = request.identifiability_probabilities[propertyKey];
    if (!finiteNumber(identifiability) || identifiability < 0 || identifiability > 1) {
      refuse(`identifiability probability for ${propertyKey} is invalid`);
    }
  }
  if (request.support_status !== "inside-fit-envelope") {
    return deepFreeze({
      kind: "abstain",
      property_values: null,
      reason_codes: ["OUTSIDE_FIT_ENVELOPE", "LEVEL_2_UNCALIBRATED_NO_AUTHORITY"],
    });
  }
  if (PROPERTY_KEYS.some((key) => (
    request.identifiability_probabilities[key]
      <= FIXTURE_026_RSD_T02_NULL_PROTOTYPE_TIE_RULES.identifiability_threshold
  ))) {
    return deepFreeze({
      kind: "abstain",
      property_values: null,
      reason_codes: ["IDENTIFIABILITY_AT_OR_BELOW_THRESHOLD", "LEVEL_2_UNCALIBRATED_NO_AUTHORITY"],
    });
  }
  if (PROPERTY_KEYS.some((key) => (
    Math.abs(probabilities[key][0] - probabilities[key][1])
      <= FIXTURE_026_RSD_T02_NULL_PROTOTYPE_TIE_RULES.floating_tie_tolerance
  ))) {
    return deepFreeze({
      kind: "abstain",
      property_values: null,
      reason_codes: ["NON_ABSTENTION_ACTION_TIE", "LEVEL_2_UNCALIBRATED_NO_AUTHORITY"],
    });
  }
  if (PROPERTY_KEYS.some((key) => (
    Math.max(...probabilities[key])
      <= FIXTURE_026_RSD_T02_NULL_PROTOTYPE_TIE_RULES.raw_posterior_decision_threshold
  ))) {
    return deepFreeze({
      kind: "abstain",
      property_values: null,
      reason_codes: ["RAW_POSTERIOR_AT_OR_BELOW_THRESHOLD", "LEVEL_2_UNCALIBRATED_NO_AUTHORITY"],
    });
  }
  const propertyValues = Object.fromEntries(PROPERTY_KEYS.map((key) => {
    const index = probabilities[key][0] > probabilities[key][1] ? 0 : 1;
    return [key, PROPERTY_DOMAINS[key][index]];
  }));
  return deepFreeze({
    kind: "decide",
    property_values: propertyValues,
    reason_codes: ["RAW_POSTERIOR_PROTOTYPE_DECISION", "LEVEL_2_UNCALIBRATED_NO_AUTHORITY"],
  });
}

function jointPosterior(heads) {
  const entries = [];
  for (const driveTransform of PROPERTY_DOMAINS.drive_transform) {
    for (const feedback of PROPERTY_DOMAINS.reported_output_feedback_edge) {
      for (const channelLocal of PROPERTY_DOMAINS.channel_local_state) {
        const values = {
          drive_transform: driveTransform,
          reported_output_feedback_edge: feedback,
          channel_local_state: channelLocal,
        };
        let probability = 1;
        for (const propertyKey of PROPERTY_KEYS) {
          const valueIndex = PROPERTY_DOMAINS[propertyKey].indexOf(values[propertyKey]);
          probability *= heads[propertyKey].value_probabilities[valueIndex];
        }
        entries.push({ values, probability });
      }
    }
  }
  const total = entries.reduce((sum, entry) => sum + entry.probability, 0);
  for (const entry of entries) entry.probability /= total;
  const marginals = Object.fromEntries(PROPERTY_KEYS.map((propertyKey) => [
    propertyKey,
    Object.fromEntries(PROPERTY_DOMAINS[propertyKey].map((value) => [String(value), 0])),
  ]));
  for (const entry of entries) {
    for (const propertyKey of PROPERTY_KEYS) {
      marginals[propertyKey][String(entry.values[propertyKey])] += entry.probability;
    }
  }
  return { entries, marginals };
}

function supportStatus(raw, model) {
  const violatingFeatureIndices = new Set();
  for (const sequence of raw) {
    for (const row of sequence) {
      for (let index = 0; index < row.length; index += 1) {
        const lower = model.support_envelope.minimum[index] - model.support_envelope.margin[index];
        const upper = model.support_envelope.maximum[index] + model.support_envelope.margin[index];
        if (row[index] <= lower || row[index] >= upper) violatingFeatureIndices.add(index);
      }
    }
  }
  return {
    status: violatingFeatureIndices.size === 0 ? "inside-fit-envelope" : "outside-fit-envelope",
    violating_feature_indices: [...violatingFeatureIndices].sort((left, right) => left - right),
    reason_codes: violatingFeatureIndices.size === 0
      ? ["WITHIN_FIT_FEATURE_ENVELOPE"]
      : ["FEATURE_OUTSIDE_FIT_ENVELOPE"],
  };
}

function inferenceLedger(spec, layout, stats) {
  const factors = workFactors(spec);
  return {
    ledger_version: `${FIXTURE_026_RSD_T02_NULL_PROTOTYPE_VERSION}.work-ledger.v1`,
    phase: "public-prototype-inference",
    scope: "algorithmic-counters-only-no-wall-time-memory-or-energy-measurement",
    episodes: stats.episodes,
    sample_rows: stats.sample_rows,
    serialized_input_utf8_bytes: stats.serialized_input_utf8_bytes,
    preprocessing_feature_scalar_reads: stats.sample_rows * FEATURE_KEYS.length,
    causal_state_updates: stats.sample_rows,
    core_affine_terms_evaluated: stats.sample_rows * factors.coreAffineTerms,
    head_affine_terms_evaluated: factors.headAffineTerms,
    activation_evaluations:
      stats.sample_rows * factors.coreActivations + factors.headActivations,
    gate_elementwise_operations: stats.sample_rows * factors.gateElementwiseOperations,
    joint_product_terms: 8 * PROPERTY_KEYS.length,
    joint_normalization_terms: 8,
    marginal_accumulations: 8 * PROPERTY_KEYS.length,
    parameter_scalar_reads: stats.sample_rows * factors.coreAffineTerms + factors.headAffineTerms,
    fallback_invocations: 0,
    measured_wall_time_ms: null,
    measured_peak_memory_bytes: null,
    measured_energy_joules: null,
  };
}

export function runFixture026RsdT02NullPrototype(request) {
  if (!exactKeys(request, ["model", "transcript"])) refuse("inference request is not closed");
  const model = assertFixture026RsdT02NullPrototypeModel(request.model);
  const stats = assertFixture026RsdT02CausalTranscript(request.transcript);
  const spec = FIXTURE_026_RSD_T02_NULL_PROTOTYPE_SPECS[model.arm_id];
  const layout = parameterLayout(spec);
  const raw = rawSequences(request.transcript);
  const normalized = normalizeSequences(raw, model.normalization);
  const heads = forwardPrepared(model.parameters, spec, layout, normalized);
  const joint = jointPosterior(heads);
  const properties = Object.fromEntries(PROPERTY_KEYS.map((propertyKey) => [
    propertyKey,
    {
      identifiability_probability: heads[propertyKey].identifiability_probability,
      value_posterior: joint.marginals[propertyKey],
    },
  ]));
  const support = supportStatus(raw, model);
  const action = decideFixture026RsdT02NullPrototype({
    property_posteriors: Object.fromEntries(PROPERTY_KEYS.map((key) => [
      key,
      properties[key].value_posterior,
    ])),
    identifiability_probabilities: Object.fromEntries(PROPERTY_KEYS.map((key) => [
      key,
      properties[key].identifiability_probability,
    ])),
    support_status: support.status,
  });
  const workLedger = inferenceLedger(spec, layout, stats);
  if (!assertCounterObject(workLedger, INFERENCE_LEDGER_KEYS)) {
    refuse("inference ledger is incomplete");
  }
  return deepFreeze({
    schema: 1,
    contract_version: FIXTURE_026_RSD_T02_NULL_PROTOTYPE_VERSION,
    artifact: "fixture-026",
    track: "RSD-T02",
    arm_id: model.arm_id,
    core_kind: model.core_kind,
    maturity_level: 2,
    maturity_status: "trainable-public-prototype",
    authority: "public-development-prototype-only-no-comparison-or-claim-authority",
    calibration_status: "uncalibrated",
    model_sha256: model.model_sha256,
    transcript_sha256: sha256Hex(canonicalize(request.transcript)),
    properties,
    joint_property_posterior: joint.entries,
    joint_marginals: joint.marginals,
    support,
    action,
    work_ledger: workLedger,
    result_label: "NO_RESULT",
    no_result: true,
  });
}

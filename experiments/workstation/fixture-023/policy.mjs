import { createHash } from "node:crypto";

import { assertT01PolicyInput, assertT02PolicyInput } from "./policy-input.mjs";

function logistic(value) {
  if (value >= 0) return 1 / (1 + Math.exp(-value));
  const exponential = Math.exp(value);
  return exponential / (1 + exponential);
}

function clipProbability(value) {
  return Math.max(1e-9, Math.min(1 - 1e-9, value));
}

function deterministicUniform(worldId, step, latch) {
  const digest = createHash("sha256")
    .update(`fixture-023-policy-v3|${worldId}|${step}|${latch}`, "utf8")
    .digest();
  const high = digest.readUInt32BE(0) & 0x001f_ffff;
  const low = digest.readUInt32BE(4);
  return (high * 0x1_0000_0000 + low) / 0x20_0000_0000_0000;
}

export function runT01Policy(visible, arm, config) {
  assertT01PolicyInput(visible);
  let prediction;
  let writes = 0;
  let operations = 0;
  let rngUpdates = 0;
  if (arm === "quantized-accumulator") {
    let accumulator = 0;
    for (const observation of visible.observations) {
      const before = accumulator;
      accumulator *= 0.995;
      if (observation !== null) accumulator += observation;
      accumulator = Math.round(Math.max(0, accumulator) * 4) / 4;
      if (accumulator !== before) writes += 1;
      operations += 6;
    }
    prediction = logistic((accumulator - config.t01_decision_center_s) / config.t01_decision_scale_s);
  } else if (arm === "duration-filter-null") {
    let posterior = 0.5;
    let duration = 0;
    const sensorError = config.t01_flip_probability;
    for (const observation of visible.observations) {
      const prior = 0.97 * posterior + 0.03 * (1 - posterior);
      if (observation !== null) {
        const likelihoodOne = observation === 1 ? 1 - sensorError : sensorError;
        const likelihoodZero = observation === 1 ? sensorError : 1 - sensorError;
        posterior = (likelihoodOne * prior) / (
          likelihoodOne * prior + likelihoodZero * (1 - prior)
        );
      } else {
        posterior = prior;
      }
      duration = 0.995 * duration + posterior;
      writes += 2;
      operations += 18;
    }
    prediction = logistic((duration - config.t01_decision_center_s) / config.t01_decision_scale_s);
  } else {
    const latches = Array(config.t01_latches).fill(0);
    let consecutive = 0;
    for (const [step, observation] of visible.observations.entries()) {
      consecutive = observation === 1 ? consecutive + 1 : 0;
      if (consecutive >= 2) {
        for (let index = 0; index < latches.length; index += 1) {
          if (latches[index] === 0) {
            rngUpdates += 1;
            if (deterministicUniform(visible.world_id, step, index) < config.t01_latch_hazard) {
              latches[index] = 1;
              writes += 1;
            }
          }
          operations += 4;
        }
      }
      operations += 2;
    }
    const fraction = latches.reduce((sum, value) => sum + value, 0) / latches.length;
    const estimatedDuration = -Math.log(Math.max(1e-9, 1 - fraction)) / config.t01_latch_hazard;
    prediction = logistic(
      (estimatedDuration - config.t01_decision_center_s) / config.t01_decision_scale_s,
    );
  }
  return {
    prediction: clipProbability(prediction),
    writes,
    operations,
    rngUpdates,
  };
}

function dot(left, right) {
  let sum = 0;
  for (let index = 0; index < left.length; index += 1) sum += left[index] * right[index];
  return sum;
}

function fitLogistic(tasks, dimensions) {
  const weights = Array(dimensions).fill(0);
  let operations = 0;
  let writes = 0;
  for (let epoch = 0; epoch < 4; epoch += 1) {
    const rate = 0.08 / (epoch + 1);
    for (const task of tasks) {
      const prediction = logistic(dot(weights, task.features));
      const error = task.label - prediction;
      for (let index = 0; index < dimensions; index += 1) {
        weights[index] += rate * error * task.features[index];
        writes += 1;
        operations += 5;
      }
      operations += dimensions * 2 + 8;
    }
  }
  return { weights, operations, writes };
}

function predictFeatures(featureRows, weights) {
  return {
    probabilities: featureRows.map((features) => (
      clipProbability(logistic(dot(weights, features)))
    )),
    operations: featureRows.length * (weights.length * 2 + 8),
  };
}

function observedLogLoss(tasks, weights) {
  const predictions = predictFeatures(tasks.map((task) => task.features), weights);
  let total = 0;
  for (let index = 0; index < tasks.length; index += 1) {
    const prediction = predictions.probabilities[index];
    const label = tasks[index].label;
    total -= label * Math.log(prediction) + (1 - label) * Math.log(1 - prediction);
  }
  return {
    loss: total / tasks.length,
    operations: predictions.operations + 4 * tasks.length,
  };
}

export function runT02Policy(visible, arm, config) {
  assertT02PolicyInput(visible);
  const previous = fitLogistic(visible.previous_tasks, config.t02_feature_dimensions);
  const current = fitLogistic(visible.adaptation_tasks, config.t02_feature_dimensions);
  const priorEvidence = observedLogLoss(visible.adaptation_tasks, previous.weights);
  const currentEvidence = observedLogLoss(visible.adaptation_tasks, current.weights);
  const evidence = priorEvidence.loss - currentEvidence.loss;
  let resetFraction = 0;
  let abstained = false;
  if (arm !== "carry-prior") {
    if (!visible.boundary_event.authenticated) {
      abstained = true;
    } else if (arm === "change-point-null") {
      resetFraction = evidence > 0.08 ? 1 : 0;
    } else if (evidence > 0.25) {
      resetFraction = 1;
    } else if (evidence > 0.15) {
      resetFraction = 0.75;
    } else if (evidence > 0.08) {
      resetFraction = 0.5;
    } else if (evidence > 0.03) {
      resetFraction = 0.25;
    }
  }
  const weights = previous.weights.map(
    (value, index) => (1 - resetFraction) * value + resetFraction * current.weights[index],
  );
  const evaluated = predictFeatures(visible.evaluation_features, weights);
  return {
    evaluationPredictions: evaluated.probabilities,
    resetFraction,
    resetPerformed: resetFraction > 0,
    abstained,
    operations: previous.operations + current.operations + priorEvidence.operations
      + currentEvidence.operations + evaluated.operations + 4 * config.t02_feature_dimensions,
    writes: previous.writes + current.writes + config.t02_feature_dimensions,
    rngUpdates: 0,
  };
}

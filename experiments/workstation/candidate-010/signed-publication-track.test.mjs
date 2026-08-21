import assert from "node:assert/strict";
import { createPublicKey, verify } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { generateOpportunities } from "./generator.mjs";
import { executeSignedPublicationTrial } from "./signed-publication-track.mjs";

const benchmarkRoot = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
const config = JSON.parse(await readFile(path.join(benchmarkRoot, "configs", "smoke.json"), "utf8"));

async function fixture() {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "20w-c010-publication-"));
  return { temporary, opportunity: generateOpportunities(config, 303)[0] };
}

function args(root, opportunity, arm, revealTrace, commit) {
  return {
    root,
    opportunity,
    arm,
    config,
    revealTrace,
    decideWithTrace: (trace) => {
      if (!revealTrace) assert.equal(trace, null);
      return { stage: true, commit, reset: !commit };
    },
  };
}

test("commit crosses the signed publication boundary while reset removes all staged material", async () => {
  const { temporary, opportunity } = await fixture();
  try {
    const committed = await executeSignedPublicationTrial(args(temporary, opportunity, "commit", true, true));
    const reset = await executeSignedPublicationTrial(args(temporary, opportunity, "reset", true, false));
    assert.equal(committed.filesystem.commitComplete, true);
    assert.equal(committed.filesystem.rollbackComplete, false);
    assert.equal(committed.filesystem.irreversible_violation, false);
    assert.equal(committed.filesystem.physical_actuation, false);
    assert.equal(committed.filesystem.stageExists, false);
    assert.equal(committed.filesystem.durableExists, true);
    assert.equal(reset.filesystem.rollbackComplete, true);
    assert.equal(reset.filesystem.commitComplete, false);
    assert.equal(reset.filesystem.irreversible_violation, false);
    assert.equal(reset.filesystem.physical_actuation, false);
    assert.equal(reset.filesystem.stageExists, false);
    assert.equal(reset.filesystem.durableExists, false);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("withheld traces remain hidden without changing staged work", async () => {
  const { temporary, opportunity } = await fixture();
  try {
    const revealed = await executeSignedPublicationTrial(args(temporary, opportunity, "revealed", true, false));
    const withheld = await executeSignedPublicationTrial(args(temporary, opportunity, "withheld", false, false));
    assert.equal(Number.isFinite(revealed.revealedVerifier), true);
    assert.equal(withheld.revealedVerifier, null);
    assert.equal(revealed.filesystem.payload_sha256, withheld.filesystem.payload_sha256);
    assert.equal(revealed.filesystem.envelope_sha256, withheld.filesystem.envelope_sha256);
    assert.equal(revealed.filesystem.trace_output_sha256, withheld.filesystem.trace_output_sha256);
    assert.equal(revealed.filesystem.staged_bytes_written, withheld.filesystem.staged_bytes_written);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("published payload and envelope retain their hash and Ed25519 signature integrity", async () => {
  const { temporary, opportunity } = await fixture();
  try {
    const result = await executeSignedPublicationTrial(args(temporary, opportunity, "integrity", true, true));
    const publicationPath = path.join(temporary, "publication-log", "integrity", `${opportunity.id}.json`);
    const publicationBody = await readFile(publicationPath, "utf8");
    const publication = JSON.parse(publicationBody);
    const payloadBody = `${JSON.stringify(publication.payload)}\n`;
    const publicKey = createPublicKey({
      key: Buffer.from(publication.envelope.public_key_spki_der_base64, "base64"),
      format: "der",
      type: "spki",
    });
    assert.equal(verify(
      null,
      Buffer.from(payloadBody),
      publicKey,
      Buffer.from(publication.envelope.signature_base64, "base64"),
    ), true);
    assert.equal(result.filesystem.durableIntegrityValid, true);
    assert.equal(result.filesystem.durable_bytes_written, Buffer.byteLength(publicationBody));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("the append-only publication record refuses replacement", async () => {
  const { temporary, opportunity } = await fixture();
  try {
    const result = await executeSignedPublicationTrial(args(temporary, opportunity, "append-only", true, true));
    assert.equal(result.filesystem.appendOnlyRefusalVerified, true);
    const publicationPath = path.join(temporary, "publication-log", "append-only", `${opportunity.id}.json`);
    await assert.rejects(
      writeFile(publicationPath, "replacement\n", { encoding: "utf8", flag: "wx" }),
      (error) => error?.code === "EEXIST",
    );
    const retained = JSON.parse(await readFile(publicationPath, "utf8"));
    assert.equal(retained.envelope.payload_sha256, result.filesystem.payload_sha256);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("every arm performs byte-identical pre-reveal publication work", async () => {
  const { temporary, opportunity } = await fixture();
  try {
    const results = [];
    for (const [arm, revealTrace, commit] of [
      ["commit-revealed", true, true],
      ["reset-revealed", true, false],
      ["reset-withheld", false, false],
    ]) {
      results.push(await executeSignedPublicationTrial(args(temporary, opportunity, arm, revealTrace, commit)));
    }
    assert.equal(new Set(results.map((row) => row.filesystem.staged_bytes_written)).size, 1);
    assert.equal(new Set(results.map((row) => row.filesystem.payload_sha256)).size, 1);
    assert.equal(new Set(results.map((row) => row.filesystem.envelope_sha256)).size, 1);
    assert.equal(new Set(results.map((row) => row.filesystem.trace_output_sha256)).size, 1);
    assert.ok(results.every((row) => row.task_family === "signed-publication"));
    assert.ok(results.every((row) => row.backend_id === "synthetic-signed-publication-v1"));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

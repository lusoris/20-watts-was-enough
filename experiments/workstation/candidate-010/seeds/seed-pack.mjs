import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export function validateSeedList(seeds, label = "seed pack") {
  if (!Array.isArray(seeds) || seeds.length === 0) throw new Error(`${label} must contain a non-empty seed list.`);
  const seen = new Set();
  for (const seed of seeds) {
    if (!Number.isInteger(seed) || seed < 0 || seed > 0xffff_ffff) {
      throw new Error(`${label} seed ${seed} is not an unsigned 32-bit integer.`);
    }
    if (seen.has(seed)) throw new Error(`${label} contains duplicate seed ${seed}.`);
    seen.add(seed);
  }
  return [...seeds];
}

// This deliberately matches scripts/lib/workstation-manifests.mjs.
export function seedListCommitment(seeds) {
  return createHash("sha256").update(JSON.stringify(validateSeedList(seeds))).digest("hex");
}

export async function inspectSeedCommitment(commitmentPath) {
  const document = JSON.parse(await readFile(commitmentPath, "utf8"));
  if (
    document?.schema !== 1
    || !["confirmation", "held-out"].includes(document.partition)
    || document.state !== "sealed"
    || document.algorithm !== "sha256-json-array-v1"
    || !Number.isInteger(document.seed_count)
    || document.seed_count < 1
    || !/^[0-9a-f]{64}$/.test(document.commitment ?? "")
  ) {
    throw new Error(`Invalid sealed seed commitment: ${commitmentPath}`);
  }
  if ("seeds" in document) throw new Error("A sealed commitment must not disclose seeds.");
  return Object.freeze({ ...document });
}

/**
 * Reveal is an explicit execution-phase operation. Versioning the reveal file
 * makes an actual local run reproducible; the commitment remains the only file
 * that preregistration/tuning code needs to inspect.
 */
export async function revealSeedPack({ commitmentPath, revealPath, phase }) {
  const commitment = await inspectSeedCommitment(commitmentPath);
  if (phase !== commitment.partition) {
    throw new Error(`Seed pack ${commitment.partition} may only be opened in the ${commitment.partition} execution phase.`);
  }
  const reveal = JSON.parse(await readFile(revealPath, "utf8"));
  if (
    reveal?.schema !== 1
    || reveal.state !== "frozen-reveal"
    || reveal.partition !== commitment.partition
    || reveal.algorithm !== commitment.algorithm
  ) {
    throw new Error(`Seed reveal identity mismatch: ${revealPath}`);
  }
  const seeds = validateSeedList(reveal.seeds, `${reveal.partition} reveal`);
  const computed = seedListCommitment(seeds);
  if (seeds.length !== commitment.seed_count || reveal.commitment !== computed || commitment.commitment !== computed) {
    throw new Error(`Seed reveal does not satisfy its sealed commitment: ${revealPath}`);
  }
  return Object.freeze({ ...reveal, seeds: Object.freeze(seeds) });
}

export function assertDisjointSeedPacks(seedPacks) {
  const ownership = new Map();
  for (const pack of seedPacks) {
    const partition = pack.partition ?? "unnamed";
    for (const seed of validateSeedList(pack.seeds, partition)) {
      if (ownership.has(seed)) {
        throw new Error(`Seed ${seed} occurs in both ${ownership.get(seed)} and ${partition}.`);
      }
      ownership.set(seed, partition);
    }
  }
  return true;
}

export const FIXTURE_019_PROMOTION_VALIDATOR_VERSION = "fixture-019.fm-t02-promotion-validator.v2";

export const FIXTURE_019_PROMOTION_BLOCKERS = Object.freeze([
  "FM-v1/FM-T02 has no reviewed successor protocol registered for confirmation",
  "the frozen aggregate primary endpoint is effectively seed-invariant under the declared symmetric shocks and proportional sales",
  "fresh private CSPRNG confirmation and held-out escrow packs are unavailable",
]);

export async function validateFixture019SeedEscrowState({ manifest }) {
  if (manifest?.artifact !== "fixture-019") {
    return { valid: false, reason: "wrong-artifact" };
  }
  return {
    valid: false,
    reason: "FM-v1/FM-T02 rejects every confirmation or held-out seed claim until a reviewed successor protocol replaces this binding",
  };
}

/**
 * FM-v1/FM-T02 is structurally ineligible for promotion. File hashes, status
 * flags, receipts, and self-consistent fabricated bundles cannot change this
 * protocol-level decision. A reviewed successor must replace this validator's
 * binding before any confirmation implementation can exist.
 */
export async function validateFixture019PromotionEvidence({
  manifest,
}) {
  const seedEscrow = await validateFixture019SeedEscrowState({ manifest });
  return {
    valid: false,
    fresh_recomputation: true,
    eligibility_binding: {
      artifact: "fixture-019",
      protocol_version: "FM-v1/FM-T02",
      claim_scope: ["C-1481"],
      status: "structurally-blocked",
    },
    blockers: [
      ...FIXTURE_019_PROMOTION_BLOCKERS,
      ...(seedEscrow.valid ? [] : [`seed escrow state: ${seedEscrow.reason}`]),
    ],
  };
}

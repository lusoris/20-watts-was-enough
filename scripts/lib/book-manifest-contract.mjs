import { assertBookSourceRefForVersion } from "../../app/lib/book-release-identity.mjs";
import { normalizePublicationSourceRevision } from "../../app/lib/publication-revision.mjs";
import { bookRendererLockPath } from "./book-renderer-identity.mjs";

const expectedSchemaVersion = 3;
const sha256Pattern = /^[0-9a-f]{64}$/u;
const imageIdPattern = /^sha256:[0-9a-f]{64}$/u;

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

export function assertBookManifestContract({
  manifest,
  expectedVersion,
  expectedPdf,
  expectedSourceRef,
  expectedSourceRevision,
  expectedRendererLockSHA256,
}) {
  invariant(
    manifest && typeof manifest === "object" && !Array.isArray(manifest),
    "Full-book manifest must be a JSON object.",
  );
  invariant(
    manifest.schema_version === expectedSchemaVersion,
    `Full-book manifest schema must be ${expectedSchemaVersion}.`,
  );
  invariant(
    manifest.pdf === expectedPdf,
    `Full-book manifest PDF path must be ${expectedPdf}.`,
  );
  invariant(
    manifest.version === expectedVersion,
    `Full-book manifest version ${JSON.stringify(manifest.version)} does not match package version ${JSON.stringify(expectedVersion)}.`,
  );
  const sourceRef = assertBookSourceRefForVersion(manifest.source_ref, expectedVersion);
  invariant(
    sourceRef === assertBookSourceRefForVersion(expectedSourceRef, expectedVersion),
    `Full-book manifest source ref ${JSON.stringify(sourceRef)} does not match expected ref ${JSON.stringify(expectedSourceRef)}.`,
  );
  invariant(
    Object.hasOwn(manifest, "source_revision"),
    "Full-book manifest must carry its source revision, using null only when no exact continuous-main commit is available.",
  );
  const sourceRevision = normalizePublicationSourceRevision(manifest.source_revision);
  invariant(
    sourceRef === "main" || sourceRevision !== null,
    "Full-book release manifest requires the exact source commit.",
  );
  if (expectedSourceRevision !== undefined) {
    invariant(
      sourceRevision === normalizePublicationSourceRevision(expectedSourceRevision),
      "Full-book manifest source revision does not match the expected commit.",
    );
  }
  invariant(
    sha256Pattern.test(expectedRendererLockSHA256 ?? ""),
    "Expected PDF renderer lock SHA-256 is invalid.",
  );
  const renderer = manifest.renderer;
  invariant(
    renderer && typeof renderer === "object" && !Array.isArray(renderer),
    "Full-book manifest renderer identity must be an object.",
  );
  invariant(
    JSON.stringify(Object.keys(renderer).sort()) === JSON.stringify([
      "image_id",
      "lock",
      "lock_sha256",
      "platform",
    ]),
    "Full-book manifest renderer identity has unknown or missing fields.",
  );
  invariant(renderer.lock === bookRendererLockPath, `Full-book manifest renderer lock must be ${bookRendererLockPath}.`);
  invariant(
    renderer.lock_sha256 === expectedRendererLockSHA256,
    "Full-book manifest renderer lock SHA-256 does not match the checked-in lock.",
  );
  invariant(imageIdPattern.test(renderer.image_id ?? ""), "Full-book manifest renderer image ID is invalid.");
  invariant(renderer.platform === "linux/amd64", "Full-book manifest renderer platform must be linux/amd64.");
  return manifest;
}

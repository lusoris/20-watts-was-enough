import { assertBookSourceRefForVersion } from "../../app/lib/book-release-identity.mjs";

const expectedSchemaVersion = 2;

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

export function assertBookManifestContract({
  manifest,
  expectedVersion,
  expectedPdf,
  expectedSourceRef,
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
  return manifest;
}

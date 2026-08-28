import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  appendFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildSpdxDocument,
  extractChangelogSection,
  parseReleaseTag,
  prepareReleaseAssets,
  validateVersionAgreement,
  verifyReleaseChecksums,
} from "./prepare-release-assets.mjs";

const version = "0.1.0";
const tag = `v${version}`;
const pdfRelativePath = "public/downloads/20-watts-was-enough-full-concept-book.pdf";

function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function directorySnapshot(root, relative = "") {
  const directory = path.join(root, relative);
  const entries = await readdir(directory, { withFileTypes: true });
  const snapshot = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryRelative = path.posix.join(relative.replaceAll("\\", "/"), entry.name);
    if (entry.isDirectory()) {
      snapshot.push(...await directorySnapshot(root, entryRelative));
    } else {
      snapshot.push([entryRelative, (await readFile(path.join(root, entryRelative))).toString("base64")]);
    }
  }
  return snapshot;
}

async function createFixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "release-assets-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "public", "downloads"), { recursive: true });
  await mkdir(path.join(root, "LICENSES"));

  const packageManifest = {
    name: "20-watts-was-enough",
    version,
  };
  const dependencyIntegrity = `sha512-${Buffer.alloc(64, 7).toString("base64")}`;
  const packageLock = {
    name: packageManifest.name,
    version,
    lockfileVersion: 3,
    packages: {
      "": {
        name: packageManifest.name,
        version,
        dependencies: { example: "1.2.3" },
      },
      "node_modules/example": {
        version: "1.2.3",
        resolved: "https://registry.npmjs.org/example/-/example-1.2.3.tgz",
        integrity: dependencyIntegrity,
      },
    },
  };
  const packageLockBytes = Buffer.from(`${JSON.stringify(packageLock, null, 2)}\n`);
  const pdf = Buffer.alloc(100_128, 0x20);
  pdf.write("%PDF-1.7\n", 0, "ascii");
  const manifest = {
    schema_version: 2,
    version,
    source_ref: tag,
    pdf: pdfRelativePath,
    size_bytes: pdf.length,
    pdf_sha256: digest(pdf),
  };
  const changelog = [
    "# Changelog",
    "",
    "## [Unreleased]",
    "",
    "### Changed",
    "",
    "- Later work.",
    "",
    "## [0.1.0] - 2026-08-05",
    "",
    "### Added",
    "",
    "- Initial research concept.",
    "",
    "## [0.0.9] - 2026-08-01",
    "",
    "### Added",
    "",
    "- Earlier work.",
    "",
  ].join("\n");

  await Promise.all([
    writeFile(path.join(root, "package.json"), `${JSON.stringify(packageManifest, null, 2)}\n`),
    writeFile(path.join(root, "package-lock.json"), packageLockBytes),
    writeFile(path.join(root, "CITATION.cff"), `cff-version: 1.2.0\ntitle: Test\nversion: ${version}\n`),
    writeFile(path.join(root, "CHANGELOG.md"), changelog),
    writeFile(path.join(root, pdfRelativePath), pdf),
    writeFile(path.join(root, "public", "downloads", "book-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`),
    writeFile(path.join(root, "LICENSE"), "EUPL fixture\n"),
    writeFile(path.join(root, "LICENSING.md"), "# Licensing fixture\n"),
    writeFile(path.join(root, "THIRD_PARTY_NOTICES.txt"), "Notices fixture\n"),
    writeFile(path.join(root, "LICENSES", "CC-BY-SA-4.0.txt"), "CC fixture\n"),
    writeFile(path.join(root, "LICENSES", "OFL-1.1.txt"), "OFL fixture\n"),
  ]);

  return {
    root,
    packageManifest,
    packageLock,
    packageLockSha256: digest(packageLockBytes),
    changelog,
  };
}

test("release preparation binds versions, the locked graph, licence material, notes, and sorted checksums", async (t) => {
  const fixture = await createFixture(t);
  const outputRoot = path.join(fixture.root, "build", "release");
  const result = await prepareReleaseAssets({
    root: fixture.root,
    outputRoot,
    tag,
  });

  assert.equal(result.version, version);
  assert.deepEqual(result.assetNames, [...result.assetNames].sort());
  assert.match(await readFile(path.join(outputRoot, "release-notes.md"), "utf8"), /^## \[0\.1\.0\] - 2026-08-05/mu);
  assert.doesNotMatch(await readFile(path.join(outputRoot, "release-notes.md"), "utf8"), /0\.0\.9/u);

  const assetsRoot = path.join(outputRoot, "assets");
  const checksums = await verifyReleaseChecksums(assetsRoot);
  assert.deepEqual(checksums.map(({ name }) => name), [...checksums.map(({ name }) => name)].sort());
  for (const expected of [
    "20-watts-was-enough-full-concept-book.pdf",
    "book-manifest.json",
    "CITATION.cff",
    "LICENSE",
    "LICENSING.md",
    "CC-BY-SA-4.0.txt",
    "OFL-1.1.txt",
    "THIRD_PARTY_NOTICES.txt",
    "sbom.spdx.json",
  ]) {
    assert(checksums.some(({ name }) => name === expected), `${expected} is not checksummed`);
  }

  const sbom = JSON.parse(await readFile(path.join(assetsRoot, "sbom.spdx.json"), "utf8"));
  assert.equal(sbom.spdxVersion, "SPDX-2.3");
  assert.equal(sbom.creationInfo.created, "2026-08-05T00:00:00Z");
  assert.match(sbom.documentNamespace, new RegExp(fixture.packageLockSha256, "u"));
  assert.deepEqual(sbom.packages.map(({ name }) => name), ["20-watts-was-enough", "example"]);
  assert(sbom.relationships.some(({ relationshipType }) => relationshipType === "DEPENDS_ON"));

  const secondOutputRoot = path.join(fixture.root, "build", "release-again");
  await prepareReleaseAssets({ root: fixture.root, outputRoot: secondOutputRoot, tag });
  assert.deepEqual(
    await directorySnapshot(outputRoot),
    await directorySnapshot(secondOutputRoot),
    "fixed release inputs must produce byte-identical workspaces",
  );
});

test("version validation rejects disagreement and extracts only the exact release section", async (t) => {
  const fixture = await createFixture(t);
  assert.equal(parseReleaseTag(tag), version);
  assert.throws(() => parseReleaseTag("v0.1"), /vMAJOR\.MINOR\.PATCH/u);
  const agreement = validateVersionAgreement({
    tag,
    packageManifest: fixture.packageManifest,
    packageLock: fixture.packageLock,
    citation: { version },
    changelog: fixture.changelog,
  });
  assert.equal(agreement.releaseNotes, extractChangelogSection(fixture.changelog, version));
  assert.throws(() => validateVersionAgreement({
    tag,
    packageManifest: fixture.packageManifest,
    packageLock: { ...fixture.packageLock, version: "0.1.1" },
    citation: { version },
    changelog: fixture.changelog,
  }), /package-lock\.json="0\.1\.1"/u);
  assert.throws(() => extractChangelogSection(fixture.changelog, "9.9.9"), /exactly one dated/u);
});

test("release preparation rejects a PDF generated from main", async (t) => {
  const fixture = await createFixture(t);
  const manifestPath = path.join(fixture.root, "public", "downloads", "book-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  await writeFile(manifestPath, `${JSON.stringify({ ...manifest, source_ref: "main" }, null, 2)}\n`);

  await assert.rejects(
    prepareReleaseAssets({ root: fixture.root, tag }),
    /does not match expected ref "v0\.1\.0"/u,
  );
});

test("release preparation rejects a same-size PDF substitution before writing output", async (t) => {
  const fixture = await createFixture(t);
  const pdfPath = path.join(fixture.root, pdfRelativePath);
  const pdf = await readFile(pdfPath);
  pdf[pdf.length - 1] ^= 0xff;
  await writeFile(pdfPath, pdf);
  const outputRoot = path.join(fixture.root, "build", "release");

  await assert.rejects(
    prepareReleaseAssets({ root: fixture.root, outputRoot, tag }),
    /PDF SHA-256 does not match/u,
  );
  await assert.rejects(readFile(path.join(outputRoot, "release-notes.md")), /ENOENT/u);
});

test("checksum verification detects post-packaging asset tampering", async (t) => {
  const fixture = await createFixture(t);
  const outputRoot = path.join(fixture.root, "build", "release");
  await prepareReleaseAssets({ root: fixture.root, outputRoot, tag });
  const assetsRoot = path.join(outputRoot, "assets");
  await appendFile(path.join(assetsRoot, "LICENSING.md"), "tampered\n");
  await assert.rejects(verifyReleaseChecksums(assetsRoot), /checksum mismatch: LICENSING\.md/u);
});

test("SPDX generation rejects an unlocked graph or invalid timestamp", () => {
  assert.throws(() => buildSpdxDocument({
    tag,
    version,
    packageLock: { lockfileVersion: 2, packages: {} },
    packageLockSha256: "0".repeat(64),
    releaseDate: "2026-08-05",
  }), /lockfileVersion 3/u);
  assert.throws(() => buildSpdxDocument({
    tag,
    version,
    packageLock: {
      name: "fixture",
      lockfileVersion: 3,
      packages: { "": { name: "fixture", version } },
    },
    packageLockSha256: "0".repeat(64),
    releaseDate: "not-a-date",
  }), /releaseDate/u);
});

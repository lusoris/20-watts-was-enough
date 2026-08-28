import { createHash } from "node:crypto";
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parseDocument } from "yaml";

import { assertBookManifestContract } from "./lib/book-manifest-contract.mjs";
import { assertBookPdfIntegrity } from "./lib/book-pdf-integrity.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(scriptDirectory, "..");
const tagPattern = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;
const releaseDatePattern = /^\d{4}-\d{2}-\d{2}$/u;
const sha256Pattern = /^[0-9a-f]{64}$/u;
const checksumLinePattern = /^([0-9a-f]{64}) {2}([^/\\]+)$/u;
const bookPdfRelativePath = "public/downloads/20-watts-was-enough-full-concept-book.pdf";
const bookManifestRelativePath = "public/downloads/book-manifest.json";

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseJson(bytes, relativePath) {
  try {
    return JSON.parse(bytes.toString("utf8"));
  } catch (error) {
    throw new Error(`${relativePath} is not valid JSON: ${error.message}`);
  }
}

function parseYaml(bytes, relativePath) {
  const document = parseDocument(bytes.toString("utf8"), {
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
  });
  if (document.errors.length > 0) {
    throw new Error(`${relativePath} is not valid YAML: ${document.errors[0].message}`);
  }
  return document.toJS();
}

async function readRegularFile(root, relativePath) {
  const absolutePath = path.join(root, relativePath);
  const information = await lstat(absolutePath);
  invariant(information.isFile() && !information.isSymbolicLink(), `${relativePath} must be a regular file`);
  return readFile(absolutePath);
}

export function parseReleaseTag(tag) {
  invariant(typeof tag === "string" && tagPattern.test(tag), "Release tag must have the exact form vMAJOR.MINOR.PATCH");
  return tag.slice(1);
}

function escapedRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

export function extractChangelogSection(changelog, version) {
  invariant(typeof changelog === "string", "CHANGELOG.md must be text");
  const normalized = changelog.replaceAll("\r\n", "\n");
  const releaseHeading = new RegExp(
    `^## \\[${escapedRegex(version)}\\] - \\d{4}-\\d{2}-\\d{2}\\s*$`,
    "gmu",
  );
  const matches = [...normalized.matchAll(releaseHeading)];
  invariant(matches.length === 1, `CHANGELOG.md must contain exactly one dated [${version}] release section`);

  const start = matches[0].index;
  const followingHeading = /^## \[/gmu;
  followingHeading.lastIndex = start + matches[0][0].length;
  const next = followingHeading.exec(normalized);
  const section = normalized.slice(start, next?.index ?? normalized.length).trimEnd();
  invariant(/^### /mu.test(section), `CHANGELOG.md [${version}] release section has no content heading`);
  return `${section}\n`;
}

function changelogReleaseDate(changelog, version) {
  const normalized = changelog.replaceAll("\r\n", "\n");
  const releaseHeading = new RegExp(
    `^## \\[${escapedRegex(version)}\\] - (\\d{4}-\\d{2}-\\d{2})\\s*$`,
    "gmu",
  );
  const matches = [...normalized.matchAll(releaseHeading)];
  invariant(matches.length === 1, `CHANGELOG.md must contain exactly one dated [${version}] release section`);
  const releaseDate = matches[0][1];
  invariant(
    new Date(`${releaseDate}T00:00:00Z`).toISOString().slice(0, 10) === releaseDate,
    `CHANGELOG.md [${version}] has an invalid release date`,
  );
  return releaseDate;
}

export function validateVersionAgreement({ tag, packageManifest, packageLock, citation, changelog }) {
  const version = parseReleaseTag(tag);
  const observed = [
    ["package.json", packageManifest?.version],
    ["package-lock.json", packageLock?.version],
    ["package-lock.json packages['']", packageLock?.packages?.[""]?.version],
    ["CITATION.cff", citation?.version],
  ];
  const disagreements = observed
    .filter(([, candidate]) => String(candidate ?? "") !== version)
    .map(([source, candidate]) => `${source}=${JSON.stringify(candidate)}`);
  invariant(
    disagreements.length === 0,
    `Release version ${version} disagrees with ${disagreements.join(", ")}`,
  );
  invariant(
    packageManifest?.name === packageLock?.name && packageManifest?.name === packageLock?.packages?.[""]?.name,
    "package.json and package-lock.json package names disagree",
  );
  return Object.freeze({
    version,
    releaseDate: changelogReleaseDate(changelog, version),
    releaseNotes: extractChangelogSection(changelog, version),
  });
}

function packageNameFromLockPath(lockPath, rootName) {
  if (lockPath === "") return rootName;
  const marker = "node_modules/";
  const position = lockPath.lastIndexOf(marker);
  invariant(position >= 0, `Unsupported package-lock path: ${lockPath}`);
  const remainder = lockPath.slice(position + marker.length);
  const components = remainder.split("/");
  return components[0].startsWith("@") ? components.slice(0, 2).join("/") : components[0];
}

function parentLockPath(lockPath) {
  if (lockPath === "") return null;
  const match = /(?:^|\/)node_modules\/(?:@[^/]+\/)?[^/]+$/u.exec(lockPath);
  invariant(match, `Unsupported package-lock path: ${lockPath}`);
  return lockPath.slice(0, match.index);
}

function resolveLockedDependency(packages, ownerPath, dependencyName) {
  let cursor = ownerPath;
  while (cursor !== null) {
    const candidate = cursor === ""
      ? `node_modules/${dependencyName}`
      : `${cursor}/node_modules/${dependencyName}`;
    if (packages[candidate]) return candidate;
    cursor = parentLockPath(cursor);
  }
  return null;
}

function integrityChecksum(integrity) {
  if (typeof integrity !== "string") return undefined;
  const token = integrity.split(/\s+/u).find((entry) => entry.startsWith("sha512-"));
  if (!token) return undefined;
  const bytes = Buffer.from(token.slice("sha512-".length), "base64");
  return bytes.length === 64 ? [{ algorithm: "SHA512", checksumValue: bytes.toString("hex") }] : undefined;
}

function spdxTimestamp(releaseDate) {
  invariant(releaseDatePattern.test(releaseDate), "releaseDate must use YYYY-MM-DD");
  const timestamp = `${releaseDate}T00:00:00Z`;
  invariant(new Date(timestamp).toISOString() === `${releaseDate}T00:00:00.000Z`, "releaseDate is not a real calendar date");
  return timestamp;
}

export function buildSpdxDocument({ tag, version, packageLock, packageLockSha256, releaseDate }) {
  invariant(packageLock?.lockfileVersion === 3, "package-lock.json must use lockfileVersion 3");
  invariant(packageLock?.packages && typeof packageLock.packages === "object", "package-lock.json has no locked package graph");
  invariant(sha256Pattern.test(packageLockSha256), "packageLockSha256 must be a lowercase SHA-256 digest");
  const entries = Object.entries(packageLock.packages)
    .filter(([, metadata]) => metadata && typeof metadata === "object" && typeof metadata.version === "string")
    .sort(([left], [right]) => compareText(left, right));
  invariant(entries.some(([lockPath]) => lockPath === ""), "package-lock.json has no root package entry");

  const identifiers = new Map(entries.map(([lockPath], index) => [
    lockPath,
    lockPath === "" ? "SPDXRef-Package-root" : `SPDXRef-Package-${String(index).padStart(5, "0")}`,
  ]));
  const packages = entries.map(([lockPath, metadata]) => {
    const record = {
      name: packageNameFromLockPath(lockPath, packageLock.name),
      SPDXID: identifiers.get(lockPath),
      versionInfo: metadata.version,
      downloadLocation: metadata.resolved ?? "NOASSERTION",
      filesAnalyzed: false,
      licenseConcluded: "NOASSERTION",
      licenseDeclared: "NOASSERTION",
      copyrightText: "NOASSERTION",
    };
    const checksums = integrityChecksum(metadata.integrity);
    if (checksums) record.checksums = checksums;
    return record;
  });

  const relationships = [{
    spdxElementId: "SPDXRef-DOCUMENT",
    relationshipType: "DESCRIBES",
    relatedSpdxElement: identifiers.get(""),
  }];
  for (const [lockPath, metadata] of entries) {
    const dependencyNames = new Set([
      ...Object.keys(metadata.dependencies ?? {}),
      ...Object.keys(metadata.devDependencies ?? {}),
      ...Object.keys(metadata.optionalDependencies ?? {}),
    ]);
    for (const dependencyName of [...dependencyNames].sort(compareText)) {
      const dependencyPath = resolveLockedDependency(packageLock.packages, lockPath, dependencyName);
      if (!dependencyPath || !identifiers.has(dependencyPath)) continue;
      relationships.push({
        spdxElementId: identifiers.get(lockPath),
        relationshipType: "DEPENDS_ON",
        relatedSpdxElement: identifiers.get(dependencyPath),
      });
    }
  }
  relationships.sort((left, right) => compareText(
    `${left.spdxElementId}\0${left.relationshipType}\0${left.relatedSpdxElement}`,
    `${right.spdxElementId}\0${right.relationshipType}\0${right.relatedSpdxElement}`,
  ));

  return {
    spdxVersion: "SPDX-2.3",
    dataLicense: "CC0-1.0",
    SPDXID: "SPDXRef-DOCUMENT",
    name: `${packageLock.name}-${version}`,
    documentNamespace: `https://github.com/lusoris/20-watts-was-enough/releases/download/${tag}/sbom.${packageLockSha256}.spdx.json`,
    creationInfo: {
      created: spdxTimestamp(releaseDate),
      creators: [
        "Tool: 20-watts-was-enough/prepare-release-assets",
        "Organization: lusoris contributors",
      ],
    },
    packages,
    relationships,
  };
}

function checksumManifest(records) {
  return `${records
    .map(({ name, bytes }) => ({ name, digest: sha256(bytes) }))
    .sort((left, right) => compareText(left.name, right.name))
    .map(({ name, digest }) => `${digest}  ${name}`)
    .join("\n")}\n`;
}

export async function verifyReleaseChecksums(assetsRoot) {
  const entries = await readdir(assetsRoot, { withFileTypes: true });
  invariant(entries.every((entry) => entry.isFile() && !entry.isSymbolicLink()), "Release asset directory may contain only regular files");
  const assetNames = entries.map((entry) => entry.name).filter((name) => name !== "SHA256SUMS").sort(compareText);
  const checksumBytes = await readFile(path.join(assetsRoot, "SHA256SUMS"));
  const lines = checksumBytes.toString("utf8").trimEnd().split("\n");
  const records = lines.map((line) => {
    const match = checksumLinePattern.exec(line);
    invariant(match, `Malformed SHA256SUMS line: ${line}`);
    return { digest: match[1], name: match[2] };
  });
  const names = records.map(({ name }) => name);
  invariant(JSON.stringify(names) === JSON.stringify([...names].sort(compareText)), "SHA256SUMS entries are not sorted");
  invariant(new Set(names).size === names.length, "SHA256SUMS contains duplicate asset names");
  invariant(JSON.stringify(names) === JSON.stringify(assetNames), "SHA256SUMS does not cover the exact release asset set");
  for (const { digest, name } of records) {
    invariant(sha256(await readFile(path.join(assetsRoot, name))) === digest, `Release asset checksum mismatch: ${name}`);
  }
  return records;
}

async function loadReleaseInputs(root) {
  const paths = [
    "package.json",
    "package-lock.json",
    "CITATION.cff",
    "CHANGELOG.md",
    bookPdfRelativePath,
    bookManifestRelativePath,
    "LICENSE",
    "LICENSING.md",
    "THIRD_PARTY_NOTICES.txt",
  ];
  const bytesByPath = new Map(await Promise.all(paths.map(async (relativePath) => [
    relativePath,
    await readRegularFile(root, relativePath),
  ])));
  const licenseEntries = await readdir(path.join(root, "LICENSES"), { withFileTypes: true });
  invariant(licenseEntries.length > 0, "LICENSES must contain at least one licence text");
  invariant(
    licenseEntries.every((entry) => entry.isFile() && !entry.isSymbolicLink()),
    "LICENSES may contain only regular files for release packaging",
  );
  for (const entry of licenseEntries.sort((left, right) => compareText(left.name, right.name))) {
    const relativePath = `LICENSES/${entry.name}`;
    bytesByPath.set(relativePath, await readRegularFile(root, relativePath));
  }
  return bytesByPath;
}

export async function prepareReleaseAssets({
  root = defaultRoot,
  outputRoot = path.join(root, "build", "release"),
  tag,
} = {}) {
  const bytesByPath = await loadReleaseInputs(root);
  const packageManifest = parseJson(bytesByPath.get("package.json"), "package.json");
  const packageLock = parseJson(bytesByPath.get("package-lock.json"), "package-lock.json");
  const citation = parseYaml(bytesByPath.get("CITATION.cff"), "CITATION.cff");
  const changelog = bytesByPath.get("CHANGELOG.md").toString("utf8");
  const { version, releaseDate, releaseNotes } = validateVersionAgreement({
    tag,
    packageManifest,
    packageLock,
    citation,
    changelog,
  });
  const bookManifest = parseJson(bytesByPath.get(bookManifestRelativePath), bookManifestRelativePath);
  assertBookManifestContract({
    manifest: bookManifest,
    expectedVersion: version,
    expectedPdf: bookPdfRelativePath,
    expectedSourceRef: tag,
  });
  await assertBookPdfIntegrity(path.join(root, bookPdfRelativePath), bookManifest);

  const assetRecords = [
    { name: path.basename(bookPdfRelativePath), bytes: bytesByPath.get(bookPdfRelativePath) },
    { name: "book-manifest.json", bytes: bytesByPath.get(bookManifestRelativePath) },
    { name: "CITATION.cff", bytes: bytesByPath.get("CITATION.cff") },
    { name: "LICENSE", bytes: bytesByPath.get("LICENSE") },
    { name: "LICENSING.md", bytes: bytesByPath.get("LICENSING.md") },
    { name: "THIRD_PARTY_NOTICES.txt", bytes: bytesByPath.get("THIRD_PARTY_NOTICES.txt") },
    ...[...bytesByPath.entries()]
      .filter(([relativePath]) => relativePath.startsWith("LICENSES/"))
      .map(([relativePath, bytes]) => ({ name: path.basename(relativePath), bytes })),
  ];
  const names = assetRecords.map(({ name }) => name);
  invariant(new Set(names).size === names.length, "Release asset basenames must be unique");
  invariant(!names.includes("SHA256SUMS") && !names.includes("sbom.spdx.json"), "Canonical files collide with generated release assets");

  const sbom = buildSpdxDocument({
    tag,
    version,
    packageLock,
    packageLockSha256: sha256(bytesByPath.get("package-lock.json")),
    releaseDate,
  });
  assetRecords.push({ name: "sbom.spdx.json", bytes: Buffer.from(`${JSON.stringify(sbom, null, 2)}\n`) });
  assetRecords.sort((left, right) => compareText(left.name, right.name));
  const checksums = Buffer.from(checksumManifest(assetRecords));

  const outputParent = path.dirname(outputRoot);
  await mkdir(outputParent, { recursive: true });
  const stagingRoot = await mkdtemp(path.join(outputParent, ".release-stage-"));
  try {
    const assetsRoot = path.join(stagingRoot, "assets");
    await mkdir(assetsRoot);
    for (const { name, bytes } of assetRecords) {
      await writeFile(path.join(assetsRoot, name), bytes, { flag: "wx" });
    }
    await writeFile(path.join(assetsRoot, "SHA256SUMS"), checksums, { flag: "wx" });
    await writeFile(path.join(stagingRoot, "release-notes.md"), releaseNotes, { flag: "wx" });
    await verifyReleaseChecksums(assetsRoot);
    await rm(outputRoot, { recursive: true, force: true });
    await rename(stagingRoot, outputRoot);
  } catch (error) {
    await rm(stagingRoot, { recursive: true, force: true });
    throw error;
  }

  return Object.freeze({
    tag,
    version,
    outputRoot,
    assetNames: Object.freeze([...assetRecords.map(({ name }) => name), "SHA256SUMS"].sort(compareText)),
  });
}

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    invariant(argument === "--tag", `Unknown argument: ${argument}`);
    invariant(index + 1 < argv.length, `${argument} requires a value`);
    values[argument.slice(2).replaceAll("-", "_")] = argv[index + 1];
    index += 1;
  }
  invariant(values.tag, "--tag is required");
  return values;
}

async function main() {
  const arguments_ = parseArguments(process.argv.slice(2));
  const result = await prepareReleaseAssets({
    tag: arguments_.tag,
  });
  console.log(`Prepared ${result.assetNames.length} release assets for ${result.tag} under ${path.relative(defaultRoot, result.outputRoot)}.`);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

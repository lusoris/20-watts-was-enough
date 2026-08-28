import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bookPdfName, bookSourceDigest } from "./book-source.mjs";
import { assertBookPdfIntegrity } from "./lib/book-pdf-integrity.mjs";
import { assertBookManifestContract } from "./lib/book-manifest-contract.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPdf = path.join(projectRoot, "public", "downloads", bookPdfName);
const manifestPath = path.join(projectRoot, "public", "downloads", "book-manifest.json");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const packageManifest = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
assertBookManifestContract({
  manifest,
  expectedVersion: packageManifest.version,
  expectedPdf: `public/downloads/${bookPdfName}`,
  expectedSourceRef: "main",
});
const current = await bookSourceDigest(projectRoot);
if (manifest.source_digest !== current.digest) {
  throw new Error("Full-book PDF is stale. Run npm run generate:book-pdf.");
}

await assertBookPdfIntegrity(outputPdf, manifest);

console.log(`Full-book PDF validation passed: ${current.files.length} source files.`);

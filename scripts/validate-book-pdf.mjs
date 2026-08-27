import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bookPdfName, bookSourceDigest } from "./book-source.mjs";
import { assertBookPdfIntegrity } from "./lib/book-pdf-integrity.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPdf = path.join(projectRoot, "public", "downloads", bookPdfName);
const manifestPath = path.join(projectRoot, "public", "downloads", "book-manifest.json");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
if (
  manifest.schema_version !== 2
  || manifest.pdf !== `public/downloads/${bookPdfName}`
) {
  throw new Error("Full-book manifest contract is unsupported.");
}
const current = await bookSourceDigest(projectRoot);
if (manifest.source_digest !== current.digest) {
  throw new Error("Full-book PDF is stale. Run npm run generate:book-pdf.");
}

await assertBookPdfIntegrity(outputPdf, manifest);

console.log(`Full-book PDF validation passed: ${current.files.length} source files.`);

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bookPdfName, bookSourceDigest } from "./book-source.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPdf = path.join(projectRoot, "public", "downloads", bookPdfName);
const manifestPath = path.join(projectRoot, "public", "downloads", "book-manifest.json");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const current = await bookSourceDigest(projectRoot);
if (manifest.source_digest !== current.digest) {
  throw new Error("Full-book PDF is stale. Run npm run generate:book-pdf.");
}

const pdfStats = await stat(outputPdf);
if (pdfStats.size !== manifest.size_bytes || pdfStats.size < 100_000) {
  throw new Error("Full-book PDF size does not match its manifest.");
}
const header = await readFile(outputPdf);
if (header.subarray(0, 5).toString("ascii") !== "%PDF-") {
  throw new Error("Full-book artifact is not a PDF.");
}

console.log(`Full-book PDF validation passed: ${current.files.length} source files.`);

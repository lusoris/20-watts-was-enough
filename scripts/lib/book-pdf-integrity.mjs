import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const SHA256_PATTERN = /^[0-9a-f]{64}$/u;

export async function inspectBookPdf(file) {
  const bytes = await readFile(file);
  if (bytes.length < 100_000) {
    throw new Error(`Full-book PDF is unexpectedly small: ${bytes.length} bytes.`);
  }
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new Error("Full-book artifact is not a PDF.");
  }
  return Object.freeze({
    size_bytes: bytes.length,
    pdf_sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}

export async function assertBookPdfIntegrity(file, manifest) {
  if (!SHA256_PATTERN.test(manifest?.pdf_sha256 ?? "")) {
    throw new Error("Full-book manifest has no valid PDF SHA-256 digest.");
  }
  const inspected = await inspectBookPdf(file);
  if (inspected.size_bytes !== manifest.size_bytes) {
    throw new Error("Full-book PDF size does not match its manifest.");
  }
  if (inspected.pdf_sha256 !== manifest.pdf_sha256) {
    throw new Error("Full-book PDF SHA-256 does not match its manifest.");
  }
  return inspected;
}

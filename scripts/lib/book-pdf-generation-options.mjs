import { assertBookSourceRef } from "../../app/lib/book-release-identity.mjs";

export function parseBookPdfGenerationOptions(arguments_) {
  if (arguments_.length === 0) return Object.freeze({ sourceRef: "main" });
  if (arguments_.length !== 2 || arguments_[0] !== "--ref") {
    throw new Error("Usage: generate-book-pdf.mjs [--ref main|vMAJOR.MINOR.PATCH]");
  }
  return Object.freeze({ sourceRef: assertBookSourceRef(arguments_[1]) });
}

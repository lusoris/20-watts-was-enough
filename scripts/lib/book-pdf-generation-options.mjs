import { assertBookSourceRef } from "../../app/lib/book-release-identity.mjs";
import { normalizePublicationSourceRevision } from "../../app/lib/publication-revision.mjs";

const usage = "Usage: generate-book-pdf.mjs [--ref main|vMAJOR.MINOR.PATCH] [--revision COMMIT_SHA]";

export function parseBookPdfGenerationOptions(arguments_) {
  if (arguments_.length > 4 || arguments_.length % 2 !== 0) throw new Error(usage);
  let sourceRef = "main";
  let sourceRevision = null;
  const seen = new Set();
  for (let index = 0; index < arguments_.length; index += 2) {
    const flag = arguments_[index];
    const value = arguments_[index + 1];
    if ((flag !== "--ref" && flag !== "--revision") || seen.has(flag)) {
      throw new Error(usage);
    }
    seen.add(flag);
    if (flag === "--ref") sourceRef = assertBookSourceRef(value);
    else sourceRevision = normalizePublicationSourceRevision(value);
  }
  if (sourceRef !== "main" && !sourceRevision) {
    throw new Error("A release PDF requires --revision with the exact source commit.");
  }
  return Object.freeze({ sourceRef, sourceRevision });
}

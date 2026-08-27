import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateSourceBoundary } from "./lib/source-boundary.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const result = await validateSourceBoundary({ repositoryRoot });

console.log(
  `Source boundary valid: ${result.pinnedFiles} byte-pinned files; `
  + `${result.records.length} link/provenance records, `
  + `${result.taxonomyFiles.length} reviewed taxonomy files, `
  + `${result.maximumRecordBytes}-byte record cap.`,
);

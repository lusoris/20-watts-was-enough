import path from "node:path";

import { validateSourceBoundary } from "./source-boundary.mjs";
import { readStableOpenedFile } from "./opened-file.mjs";

const maximumPrincipleRegistryBytes = 4 * 1024 * 1024;
const principleDefinitionPattern = /^## (P-[0-9]{3})\b/gmu;

export async function portalSourceMetrics(repositoryRoot) {
  const root = path.resolve(repositoryRoot);
  const principleRegistryPath = path.join(root, "research", "principle-registry.md");
  const [sourceBoundary, principleRegistry] = await Promise.all([
    validateSourceBoundary({ repositoryRoot: root }),
    readStableOpenedFile(principleRegistryPath, {
      label: "principle registry",
      containedBy: root,
      maximumBytes: maximumPrincipleRegistryBytes,
    }),
  ]);
  const principleIds = [...principleRegistry.toString("utf8").matchAll(
    principleDefinitionPattern,
  )].map((match) => match[1]);
  if (principleIds.length === 0) {
    throw new Error("The portal cannot derive a principle count from the canonical registry.");
  }
  if (new Set(principleIds).size !== principleIds.length) {
    throw new Error("The canonical principle registry contains a duplicate P-series definition.");
  }

  return Object.freeze({
    schema: 1,
    principles: principleIds.length,
    provenanceFiles: sourceBoundary.pinnedFiles,
  });
}

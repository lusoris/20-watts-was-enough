import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { renderThirdPartyNotices } from "./scripts/lib/third-party-notices.mjs";

const repositoryRoot = path.dirname(fileURLToPath(import.meta.url));
const trackedNoticesPath = path.join(repositoryRoot, "THIRD_PARTY_NOTICES.txt");

function legalReleaseAssets() {
  return {
    name: "legal-release-assets",
    generateBundle(_options: unknown, bundle: Record<string, { type: string; modules?: Record<string, unknown> }>) {
      const moduleIds = new Set<string>();
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") continue;
        for (const moduleId of Object.keys(output.modules ?? {})) moduleIds.add(moduleId);
      }
      const notices = renderThirdPartyNotices({ moduleIds, repositoryRoot });
      if (process.env.UPDATE_THIRD_PARTY_NOTICES === "1") {
        writeFileSync(trackedNoticesPath, notices, "utf8");
      } else if (readFileSync(trackedNoticesPath, "utf8") !== notices) {
        throw new Error(
          "THIRD_PARTY_NOTICES.txt is stale; run npm run generate:third-party-notices",
        );
      }
      for (const [fileName, sourcePath] of [
        ["LICENSE", path.join(repositoryRoot, "LICENSE")],
        ["LICENSING.md", path.join(repositoryRoot, "LICENSING.md")],
        ["LICENSES/CC-BY-SA-4.0.txt", path.join(repositoryRoot, "LICENSES", "CC-BY-SA-4.0.txt")],
        ["LICENSES/OFL-1.1.txt", path.join(repositoryRoot, "LICENSES", "OFL-1.1.txt")],
      ]) {
        this.emitFile({ type: "asset", fileName, source: readFileSync(sourcePath) });
      }
      this.emitFile({ type: "asset", fileName: "THIRD_PARTY_NOTICES.txt", source: notices });
    },
  };
}

export default defineConfig({
  root: path.join(repositoryRoot, "github-pages"),
  base: "/20-watts-was-enough/",
  publicDir: path.join(repositoryRoot, "public"),
  assetsInclude: ["**/*.md", "**/*.mmd", "**/*.bib"],
  plugins: [react(), legalReleaseAssets()],
  build: {
    outDir: path.join(repositoryRoot, "dist-github-pages"),
    emptyOutDir: true,
  },
});

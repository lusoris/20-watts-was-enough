import vinext from "vinext";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";
const ignoredWatchPaths = [
  "**/tmp/**",
  "**/experiments/workstation/runs/**",
  "**/.wrangler/**",
  "**/.next/**",
  "**/dist/**",
];

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
};

const portalIndexModuleId = "virtual:portal-document-index";
const resolvedPortalIndexModuleId = `\0${portalIndexModuleId}`;

function portalIndexFallback() {
  return {
    name: "portal-index-fallback",
    enforce: "pre" as const,
    resolveId(id: string) {
      return id === portalIndexModuleId ? resolvedPortalIndexModuleId : null;
    },
    load(id: string) {
      return id === resolvedPortalIndexModuleId ? "export default [];" : null;
    },
  };
}

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    assetsInclude: ["**/*.md", "**/*.mmd", "**/*.bib"],
    server: {
      watch: {
        ignored: ignoredWatchPaths,
        ...(isCodexSeatbeltSandbox
          ? { useFsEvents: false, usePolling: true }
          : {}),
      },
    },
    plugins: [
      // The real searchable index is emitted only by vite.pages.config.ts.
      // Vinext still scans all app modules while rendering /book, so give that
      // unused Pages-only import a closed empty module instead of a warning.
      portalIndexFallback(),
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      }),
    ],
  };
});

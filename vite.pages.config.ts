import react from "@vitejs/plugin-react";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { renderThirdPartyNotices } from "./scripts/lib/third-party-notices.mjs";

const repositoryRoot = path.dirname(fileURLToPath(import.meta.url));
const trackedNoticesPath = path.join(repositoryRoot, "THIRD_PARTY_NOTICES.txt");
const portalIndexModuleId = "virtual:portal-document-index";
const resolvedPortalIndexModuleId = `\0${portalIndexModuleId}`;

type PortalSourceDocument = {
  path: string;
  title: string;
  group: "Concept" | "Mathematics";
  kind: "markdown";
  words: number;
  searchText: string;
  body: string;
};

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function plainHeading(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function portalSourceDocuments(): PortalSourceDocument[] {
  const inputs = [
    ...markdownFiles(path.join(repositoryRoot, "concept"))
      .filter((file) => path.basename(file).toLowerCase() !== "readme.md"),
    ...markdownFiles(path.join(repositoryRoot, "math"))
      .filter((file) => path.basename(file).toLowerCase() !== "readme.md"),
  ];
  return inputs.map((file) => {
    const body = readFileSync(file, "utf8");
    const relativePath = path.relative(repositoryRoot, file).replaceAll("\\", "/");
    const headings = [...body.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)]
      .map((match) => plainHeading(match[1]))
      .filter(Boolean);
    const fallbackTitle = path.basename(file, ".md")
      .replace(/^\d+-/, "")
      .replaceAll("-", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
    const title = headings[0] || fallbackTitle;
    const group = relativePath.startsWith("concept/") ? "Concept" : "Mathematics";
    return {
      path: relativePath,
      title,
      group,
      kind: "markdown",
      words: body.trim().split(/\s+/).filter(Boolean).length,
      searchText: [relativePath, title, ...headings].join("\n").toLowerCase(),
      body,
    };
  }).sort((left, right) => {
    const groupDelta = (left.group === "Concept" ? 0 : 1)
      - (right.group === "Concept" ? 0 : 1);
    return groupDelta || left.path.localeCompare(right.path, undefined, { numeric: true });
  });
}

function portalDocumentAssets(): Plugin {
  let documents = portalSourceDocuments();
  const refreshDocuments = () => {
    documents = portalSourceDocuments();
    return documents;
  };
  return {
    name: "portal-document-assets",
    resolveId(id: string) {
      return id === portalIndexModuleId ? resolvedPortalIndexModuleId : null;
    },
    load(id: string) {
      if (id !== resolvedPortalIndexModuleId) return null;
      const index = refreshDocuments().map((document) => ({
        path: document.path,
        title: document.title,
        group: document.group,
        kind: document.kind,
        words: document.words,
        searchText: document.searchText,
      }));
      return `export default ${JSON.stringify(index)};`;
    },
    configureServer(server: ViteDevServer) {
      const sourceRoots = [
        path.join(repositoryRoot, "concept"),
        path.join(repositoryRoot, "math"),
      ];
      const reloadPortal = (file: string) => {
        const relative = path.relative(repositoryRoot, file).replaceAll("\\", "/");
        if (!/^(?:concept|math)\/.+\.md$/i.test(relative)) return;
        refreshDocuments();
        const indexModule = server.moduleGraph.getModuleById(resolvedPortalIndexModuleId);
        if (indexModule) server.moduleGraph.invalidateModule(indexModule);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.add(sourceRoots);
      server.watcher.on("add", reloadPortal);
      server.watcher.on("change", reloadPortal);
      server.watcher.on("unlink", reloadPortal);

      server.middlewares.use((request, response, next) => {
        if (request.method !== "GET" && request.method !== "HEAD") {
          next();
          return;
        }
        let requestPath = "";
        try {
          requestPath = decodeURIComponent(
            new URL(request.url ?? "/", "http://localhost").pathname,
          );
        } catch {
          next();
          return;
        }
        const prefix = [
          "/documents/",
          "/20-watts-was-enough/documents/",
        ].find((candidate) => requestPath.startsWith(candidate));
        if (!prefix) {
          next();
          return;
        }
        const documentPath = requestPath.slice(prefix.length);
        const document = refreshDocuments().find(
          (candidate) => candidate.path === documentPath,
        );
        if (!document) {
          next();
          return;
        }
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/markdown; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(request.method === "HEAD" ? undefined : document.body);
      });
    },
    generateBundle() {
      for (const document of refreshDocuments()) {
        this.emitFile({
          type: "asset",
          fileName: `documents/${document.path}`,
          source: document.body,
        });
      }
    },
  };
}

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
  plugins: [react(), portalDocumentAssets(), legalReleaseAssets()],
  build: {
    outDir: path.join(repositoryRoot, "dist-github-pages"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        portal: path.join(repositoryRoot, "github-pages", "index.html"),
        book: path.join(repositoryRoot, "github-pages", "book", "index.html"),
      },
    },
  },
});

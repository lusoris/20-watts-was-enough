import react from "@vitejs/plugin-react";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { portalSourceDocuments } from "./scripts/lib/portal-documents.mjs";
import {
  populateSeoTemplate,
  renderBookFallback,
  renderDocumentFallback,
  renderPortalFallback,
  renderSeoHead,
  renderSitemap,
} from "./scripts/lib/pages-seo.mjs";
import { resolvePagesBase } from "./scripts/lib/pages-base.mjs";
import { renderThirdPartyNotices } from "./scripts/lib/third-party-notices.mjs";

const repositoryRoot = path.dirname(fileURLToPath(import.meta.url));
const pagesOutputRoot = path.join(repositoryRoot, "dist-github-pages");
const pagesBase = resolvePagesBase(process.env.PAGES_BASE_PATH);
const portalDocumentPrefixes = [...new Set([
  "/documents/",
  `${pagesBase}documents/`,
])];
const trackedNoticesPath = path.join(repositoryRoot, "THIRD_PARTY_NOTICES.txt");
const portalIndexModuleId = "virtual:portal-document-index";
const resolvedPortalIndexModuleId = `\0${portalIndexModuleId}`;

type PortalSourceDocument = {
  path: string;
  route: string;
  title: string;
  description: string;
  group: "Concept" | "Mathematics";
  kind: "markdown";
  words: number;
  searchText: string;
  body: string;
};

function portalDocumentAssets(): Plugin {
  let documents = portalSourceDocuments(repositoryRoot) as PortalSourceDocument[];
  const refreshDocuments = () => {
    documents = portalSourceDocuments(repositoryRoot) as PortalSourceDocument[];
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
        route: document.route,
        title: document.title,
        description: document.description,
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
        const prefix = portalDocumentPrefixes.find(
          (candidate) => requestPath.startsWith(candidate),
        );
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

function seoStaticPages(): Plugin {
  return {
    name: "seo-static-pages",
    closeBundle() {
      const documents = portalSourceDocuments(repositoryRoot) as PortalSourceDocument[];
      const portalPath = path.join(pagesOutputRoot, "index.html");
      const bookPath = path.join(pagesOutputRoot, "book", "index.html");
      const portalTemplate = readFileSync(portalPath, "utf8");
      writeFileSync(portalPath, populateSeoTemplate(
        portalTemplate,
        renderSeoHead("portal", null, pagesBase),
        renderPortalFallback(documents, pagesBase),
      ), "utf8");
      writeFileSync(bookPath, populateSeoTemplate(
        readFileSync(bookPath, "utf8"),
        renderSeoHead("book", null, pagesBase),
        renderBookFallback(documents, pagesBase),
      ), "utf8");
      for (const document of documents) {
        const output = path.join(pagesOutputRoot, ...document.route.split("/"), "index.html");
        mkdirSync(path.dirname(output), { recursive: true });
        writeFileSync(output, populateSeoTemplate(
          portalTemplate,
          renderSeoHead("document", document, pagesBase),
          renderDocumentFallback(document, documents, pagesBase),
        ), "utf8");
      }
      writeFileSync(
        path.join(pagesOutputRoot, "sitemap.xml"),
        renderSitemap(documents),
        "utf8",
      );
    },
  };
}

function legalReleaseAssets(): Plugin {
  return {
    name: "legal-release-assets",
    generateBundle(_options, bundle) {
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
  base: pagesBase,
  publicDir: path.join(repositoryRoot, "public"),
  assetsInclude: ["**/*.md", "**/*.mmd", "**/*.bib"],
  plugins: [react(), portalDocumentAssets(), legalReleaseAssets(), seoStaticPages()],
  build: {
    outDir: pagesOutputRoot,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        portal: path.join(repositoryRoot, "github-pages", "index.html"),
        book: path.join(repositoryRoot, "github-pages", "book", "index.html"),
      },
    },
  },
});

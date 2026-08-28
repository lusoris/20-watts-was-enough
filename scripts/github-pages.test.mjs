import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { renderThirdPartyNotices } from "./lib/third-party-notices.mjs";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function source(relative) {
  return readFile(path.join(repositoryRoot, relative), "utf8");
}

test("Pages builds a portal root and dedicated book route with a project-relative base", async () => {
  const [config, portalEntry, portalHtml, bookEntry, bookHtml] = await Promise.all([
    source("vite.pages.config.ts"),
    source("github-pages/main.tsx"),
    source("github-pages/index.html"),
    source("github-pages/book.tsx"),
    source("github-pages/book/index.html"),
  ]);

  assert.match(config, /base:\s*["']\/20-watts-was-enough\/["']/);
  assert.match(config, /root:\s*path\.join\(repositoryRoot,\s*["']github-pages["']\)/);
  assert.match(config, /publicDir:\s*path\.join\(repositoryRoot,\s*["']public["']\)/);
  assert.match(config, /input:\s*\{/);
  assert.match(config, /portal:\s*path\.join\(repositoryRoot,\s*["']github-pages["'],\s*["']index\.html["']\)/);
  assert.match(config, /book:\s*path\.join\(repositoryRoot,\s*["']github-pages["'],\s*["']book["'],\s*["']index\.html["']\)/);

  assert.match(portalHtml, /<div id=["']root["']><\/div>/);
  assert.match(portalHtml, /src=["']\/main\.tsx["']/);
  assert.doesNotMatch(portalEntry, /vinext|next\/headers|next\/server/);

  assert.match(bookEntry, /<BookEdition/);
  assert.match(bookEntry, /surface=["']github-pages["']/);
  assert.match(bookEntry, /assetBasePath=\{import\.meta\.env\.BASE_URL\}/);
  assert.match(bookHtml, /<div id=["']root["']><\/div>/);
  assert.match(bookHtml, /src=["']\.\.\/book\.tsx["']/);
  assert.match(bookHtml, /https:\/\/lusoris\.github\.io\/20-watts-was-enough\/book\//);
  assert.doesNotMatch(bookEntry, /vinext|next\/headers|next\/server/);
});

test("the workflow uses GitHub's Pages artifact and deployment actions", async () => {
  const workflow = await source(".github/workflows/github-pages.yml");

  for (const required of [
    "actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6",
    "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7",
    "actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6",
    "actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5",
    "actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128 # v5",
    "npm ci",
    "npm run validate:sources",
    "node --test scripts/source-boundary.test.mjs",
    "npm run prepare:reader-artifacts",
    "npm run validate:book-pdf",
    "node --test scripts/github-pages.test.mjs scripts/book-edition-surface.test.mjs",
    "npm run build:github-pages",
    "npm run validate:github-pages",
    "path: dist-github-pages",
    "include-hidden-files: true",
  ]) {
    assert.match(workflow, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /build:\s*\n\s+permissions:\s*\n\s+contents:\s*read/);
  assert.match(workflow, /deploy:\s*\n\s+permissions:\s*\n\s+pages:\s*write\s*\n\s+id-token:\s*write/);
  const topLevelPermissions = workflow.match(/^permissions:\r?\n((?: {2}[^\r\n]+\r?\n)*)/m)?.[1] ?? "";
  assert.match(topLevelPermissions, /contents:\s*read/);
  assert.doesNotMatch(topLevelPermissions, /(?:pages|id-token):/);
  assert.match(workflow, /cancel-in-progress:\s*false/);
  assert.doesNotMatch(workflow, /\.openai\/hosting|lusoris\.chatgpt\.site/);
  assert.match(workflow, /actions\/(?:checkout|setup-node|configure-pages|upload-pages-artifact|deploy-pages)@[0-9a-f]{40}/);
  assert.ok(
    workflow.indexOf("node --test scripts/github-pages.test.mjs scripts/book-edition-surface.test.mjs")
      < workflow.indexOf("npm run build:github-pages"),
    "focused Pages tests must run before the public build",
  );
});

test("the portal keeps history and native Markdown links honest on the Pages base", async () => {
  const [portal, markdown] = await Promise.all([
    source("app/components/public-research-portal.tsx"),
    source("app/components/markdown-document.tsx"),
  ]);

  assert.match(
    portal,
    /requested\s*&&\s*documentsByPath\.has\(requested\)\s*\?\s*requested\s*:\s*defaultDocumentPath/,
  );
  assert.match(portal, /nonNavigableHref=\{repositoryDocumentHref\}/);
  assert.match(portal, /window\.open\(\s*repositoryDocumentHref\(path, hash\)/);

  assert.match(markdown, /nonNavigableHref\?:\s*\(path: string, hash: string\) => string/);
  assert.match(
    markdown,
    /href=\{joinAssetBase\(assetBasePath, repositoryArtifactHref\(internal\.path\)\)\}/,
  );
  assert.match(
    markdown,
    /href=\{nonNavigableHref\(internal\.path, internal\.hash\)\}/,
  );
  assert.doesNotMatch(markdown, /href=\{repositoryArtifactHref\(internal\.path\)\}/);
});

test("only genuinely overflowing Markdown tables become labelled keyboard regions", async () => {
  const markdown = await source("app/components/markdown-document.tsx");

  assert.match(markdown, /role=\{overflows \? "region" : undefined\}/);
  assert.match(
    markdown,
    /aria-label=\{overflows \? "Scrollable data table" : undefined\}/,
  );
  assert.match(markdown, /tabIndex=\{overflows \? 0 : undefined\}/);
  assert.doesNotMatch(markdown, /tabIndex=\{0\}/);
  assert.match(markdown, /typeof ResizeObserver === "undefined"/);
});

test("the portal loads canonical documents on demand and keeps book code off its initial path", async () => {
  const [portal, content, config, validator] = await Promise.all([
    source("app/components/public-research-portal.tsx"),
    source("app/portal-content.ts"),
    source("vite.pages.config.ts"),
    source("scripts/validate-github-pages-build.mjs"),
  ]);

  assert.doesNotMatch(portal, /from ["']\.\.\/book-content["']/);
  assert.match(portal, /from ["']\.\.\/portal-content["']/);
  assert.match(portal, /lazy\(\(\) => import\(["']\.\/markdown-document["']\)/);
  assert.match(content, /fetch\(withBase\(assetBasePath, `documents\/\$\{path\}`\)\)/);
  assert.match(config, /virtual:portal-document-index/);
  assert.match(config, /fileName: `documents\/\$\{document\.path\}`/);
  assert.match(validator, /maximumPortalInitialJavaScriptBytes = 400_000/);
  assert.match(validator, /portal document assets do not exactly match the canonical concept\/math corpus/);
});

test("the public-source wording does not weaken the primary site's access badge", async () => {
  const [reader, book] = await Promise.all([
    source("app/components/research-reader.tsx"),
    source("app/components/book-edition.tsx"),
  ]);

  assert.match(reader, /Owner-only/);
  assert.match(reader, /public Git source/);
  assert.doesNotMatch(reader, /private Git source/);
  assert.match(book, /Generated from the public Git repository/);
});

test("third-party notices include bundler runtimes and accept the project portal index", () => {
  const notices = renderThirdPartyNotices({
    moduleIds: new Set([
      "\0rolldown/runtime.js",
      "\0vite/modulepreload-polyfill.js",
      "\0vite/preload-helper.js",
      "\0virtual:portal-document-index",
    ]),
    repositoryRoot,
  });

  assert.match(notices, /- rolldown@1\.0\.3 — MIT/);
  assert.match(notices, /- vite@8\.0\.16 — MIT/);
  assert.match(notices, /Copyright \(c\) 2024-present VoidZero Inc\. & Contributors/);
  assert.match(notices, /Copyright \(c\) 2019-present, VoidZero Inc\. and Vite contributors/);
});

test("third-party notices fail closed on an unknown virtual bundle module", () => {
  assert.throws(
    () => renderThirdPartyNotices({
      moduleIds: new Set(["\0vite/future-runtime.js"]),
      repositoryRoot,
    }),
    /Unmapped virtual bundle module:.*vite\/future-runtime\.js/,
  );
});

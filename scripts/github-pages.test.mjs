import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  decodePortalFragment,
  encodePortalFragment,
} from "../app/lib/portal-fragment.mjs";
import {
  decodeBasicHtmlEntitiesOnce,
  stripHtmlTagSyntax,
} from "./lib/plain-text.mjs";
import { renderThirdPartyNotices } from "./lib/third-party-notices.mjs";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function source(relative) {
  return readFile(path.join(repositoryRoot, relative), "utf8");
}

function assertNoLegacyDeploymentHost(html, label) {
  const references = [...html.matchAll(/\b(?:href|src|content)=["']([^"']+)["']/gu)]
    .map((match) => match[1]);
  for (const reference of references) {
    if (!/^https?:\/\//u.test(reference)) continue;
    assert.notEqual(new URL(reference).hostname, "lusoris.github.io", label);
  }
}

test("reader labels strip complete and unterminated tags and decode entities once", () => {
  assert.equal(stripHtmlTagSyntax("alpha <em>beta</em> gamma"), "alpha  beta  gamma");
  assert.equal(stripHtmlTagSyntax("safe comparison 4 < 5"), "safe comparison 4 < 5");
  assert.equal(stripHtmlTagSyntax("safe <script"), "safe ");
  assert.equal(decodeBasicHtmlEntitiesOnce("&lt;safe&gt; &amp;lt;"), "<safe> &lt;");
});

test("portal fragments preserve existing escapes without double encoding", () => {
  assert.equal(encodePortalFragment("section details"), "#section%20details");
  assert.equal(encodePortalFragment("section%20details"), "#section%20details");
  assert.equal(encodePortalFragment("literal%2520escape"), "#literal%2520escape");
  assert.equal(decodePortalFragment("malformed%fragment"), "malformed%fragment");
});

test("Pages builds a portal root and dedicated book route with a configurable safe base", async () => {
  const [config, portalEntry, portalHtml, bookEntry, bookHtml] = await Promise.all([
    source("vite.pages.config.ts"),
    source("github-pages/main.tsx"),
    source("github-pages/index.html"),
    source("github-pages/book.tsx"),
    source("github-pages/book/index.html"),
  ]);

  assert.match(config, /import \{ resolvePagesBase \} from ["']\.\/scripts\/lib\/pages-base\.mjs["']/);
  assert.match(config, /const pagesBase = resolvePagesBase\(process\.env\.PAGES_BASE_PATH\)/);
  assert.match(config, /base:\s*pagesBase/);
  assert.doesNotMatch(config, /base:\s*["']\/20-watts-was-enough\/["']/);
  assert.match(config, /root:\s*path\.join\(repositoryRoot,\s*["']github-pages["']\)/);
  assert.match(config, /publicDir:\s*path\.join\(repositoryRoot,\s*["']public["']\)/);
  assert.match(config, /input:\s*\{/);
  assert.match(config, /portal:\s*path\.join\(repositoryRoot,\s*["']github-pages["'],\s*["']index\.html["']\)/);
  assert.match(config, /book:\s*path\.join\(repositoryRoot,\s*["']github-pages["'],\s*["']book["'],\s*["']index\.html["']\)/);

  assert.match(portalHtml, /<div id=["']root["']><!-- pages-seo:fallback -->/);
  assert.match(portalHtml, /src=["']\/main\.tsx["']/);
  assert.match(portalHtml, /https:\/\/www\.cordana\.dev\//);
  assert.match(portalHtml, /pages-seo:head/);
  assert.match(portalHtml, /rel=["']canonical["'] href=["']https:\/\/www\.cordana\.dev\/["']/);
  assertNoLegacyDeploymentHost(portalHtml, "portal HTML must not reference the legacy Pages host");
  assert.doesNotMatch(portalEntry, /vinext|next\/headers|next\/server/);

  assert.match(bookEntry, /<BookEdition/);
  assert.match(bookEntry, /surface=["']github-pages["']/);
  assert.match(bookEntry, /assetBasePath=\{import\.meta\.env\.BASE_URL\}/);
  assert.match(bookEntry, /sourceRef=["']main["']/);
  assert.match(bookHtml, /<div id=["']root["']><!-- pages-seo:fallback -->/);
  assert.match(bookHtml, /src=["']\.\.\/book\.tsx["']/);
  assert.match(bookHtml, /https:\/\/www\.cordana\.dev\/book\//);
  assert.match(bookHtml, /pages-seo:head/);
  assert.match(bookHtml, /rel=["']canonical["'] href=["']https:\/\/www\.cordana\.dev\/book\/["']/);
  assertNoLegacyDeploymentHost(bookHtml, "book HTML must not reference the legacy Pages host");
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
  assert.match(workflow, /env:\s*\n\s+PAGES_BASE_PATH:\s*["']?\/["']?/);
  assert.doesNotMatch(workflow, /\.openai\/hosting|lusoris\.chatgpt\.site/);
  assert.match(workflow, /actions\/(?:checkout|setup-node|configure-pages|upload-pages-artifact|deploy-pages)@[0-9a-f]{40}/);
  assert.ok(
    workflow.indexOf("node --test scripts/github-pages.test.mjs scripts/book-edition-surface.test.mjs")
      < workflow.indexOf("npm run build:github-pages"),
    "focused Pages tests must run before the public build",
  );
});

test("the portal keeps clean-route history and native Markdown links honest on the Pages base", async () => {
  const [portal, markdown, content, entry, portalSeo] = await Promise.all([
    source("app/components/public-research-portal.tsx"),
    source("app/components/markdown-document.tsx"),
    source("app/portal-content.ts"),
    source("github-pages/main.tsx"),
    source("app/lib/portal-seo.ts"),
  ]);

  assert.match(portal, /function initialDocumentPath\(basePath: string\): string \| null/);
  assert.match(portal, /portalDocumentPathFromLocation\(window\.location, basePath\)/);
  assert.match(portal, /if \(!selectedPath\) return;[\s\S]*loadPortalDocument\(selectedPath, assetBasePath\)/);
  assert.match(portal, /\{selectedPath && selectedMetadata \? \(/);
  assert.match(portal, /className="portal-dashboard"/);
  assert.match(portal, /NO_RESULT/);
  assert.match(portal, /const selectGroup = \(candidate: LibraryGroup\)/);
  assert.match(portal, /selectedMetadata\?\.group !== candidate/);
  assert.match(portal, /className="portal-mobile-menu"/);
  assert.match(portal, /className="portal-mobile-outline"/);
  assert.match(portal, /mobileMenuRef\.current\?\.removeAttribute\("open"\)/);
  assert.match(portal, /mobileOutlineRef\.current\?\.removeAttribute\("open"\)/);
  assert.match(portal, /selectHeading\(heading\.id\)/);
  assert.match(portal, /--portal-reader-stack-top/);
  assert.match(portal, /new ResizeObserver\(syncStickyStack\)/);
  assert.match(portal, /readerLibraryRef/);
  assert.match(portal, /list\.scrollTop \+= activeRect\.top/);
  assert.match(portal, /section heading match/);
  assert.match(portal, /Open \{step\.label\}/);
  assert.match(portal, /document\.getElementById\(targetId\)\?\.focus\(\)/);
  assert.match(portal, /nonNavigableHref=\{repositoryDocumentHref\}/);
  assert.match(portal, /window\.open\(\s*repositoryDocumentHref\(path, hash\)/);
  assert.match(portal, /portalDocumentLocation\(path, assetBasePath, hash\)/);
  assert.match(portal, /internalHref=\{\(path, hash\) => portalDocumentLocation\(path, assetBasePath, hash\)\}/);
  assert.match(portal, /usePortalSeo\(selectedMetadata\)/);
  assert.doesNotMatch(portal, /`\?doc=\$\{encodeURIComponent\(path\)\}`/);
  assert.match(content, /document\.route === route/);
  assert.match(content, /encodePortalFragment\(hash\)/);
  assert.match(content, /fetch\(portalDocumentAssetLocation\(metadata\.path, assetBasePath\)\)/);
  assert.match(content, /\^\(\?:concept\|math\).*\\\.md\$/);
  assert.match(entry, /new URLSearchParams\(window\.location\.search\)\.get\("doc"\)/);
  assert.match(entry, /window\.location\.replace\(portalDocumentLocation\(/);
  assert.match(entry, /window\.location\.hash\.slice\(1\)/);

  assert.match(markdown, /nonNavigableHref\?:\s*\(path: string, hash: string\) => string/);
  assert.match(
    markdown,
    /href=\{joinAssetBase\(assetBasePath, repositoryArtifactHref\(internal\.path\)\)\}/,
  );
  assert.match(
    markdown,
    /href=\{nonNavigableHref\(internal\.path, internal\.hash\)\}/,
  );
  assert.match(markdown, /const resolvedHref = internalHref && isNavigable/);
  assert.match(markdown, /navigateInternalLink\(event, internal, onNavigate\)/);
  assert.doesNotMatch(markdown, /href=\{repositoryArtifactHref\(internal\.path\)\}/);

  for (const requiredMetadata of [
    'window.document.title = descriptor.title',
    '["name", "description", descriptor.description]',
    '["name", "robots", "index,follow,max-image-preview:large"]',
    '["property", "og:title", descriptor.title]',
    '["property", "og:url", descriptor.canonical]',
    '["name", "twitter:title", descriptor.title]',
    "upsertCanonical(descriptor.canonical)",
    "upsertStructuredData(descriptor.structuredData)",
  ]) {
    assert.ok(portalSeo.includes(requiredMetadata), `portal SEO sync lacks ${requiredMetadata}`);
  }
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

test("focused portal documents have a coherent heading hierarchy", async () => {
  const [portal, markdown] = await Promise.all([
    source("app/components/public-research-portal.tsx"),
    source("app/components/markdown-document.tsx"),
  ]);

  assert.match(portal, /<h1 id="portal-reader-title">/);
  assert.match(portal, /headingOffset=\{1\}/);
  assert.match(markdown, /headingOffset\?: number/);
  assert.match(markdown, /h1: shiftedHeading\(1, headingOffset\)/);
  assert.match(markdown, /h2: shiftedHeading\(2, headingOffset\)/);
});

test("wide diagrams expose a keyboard region only when they really overflow", async () => {
  const diagram = await source("app/components/mermaid-diagram.tsx");

  assert.match(diagram, /canvas\.scrollWidth > region\.clientWidth \+ 1/);
  assert.match(diagram, /role=\{overflows \? "region" : undefined\}/);
  assert.match(diagram, /aria-label=\{overflows \? "Scrollable diagram" : undefined\}/);
  assert.match(diagram, /tabIndex=\{overflows \? 0 : undefined\}/);
  assert.match(diagram, /\{overflows \? \(\s*<p className="diagram-layout-note">/);
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
  assert.match(content, /fetch\(portalDocumentAssetLocation\(metadata\.path, assetBasePath\)\)/);
  assert.match(content, /contentType\.includes\("text\/html"\)/);
  assert.match(content, /Document request returned HTML instead of Markdown/);
  assert.match(config, /virtual:portal-document-index/);
  assert.match(config, /fileName: `documents\/\$\{document\.path\}`/);
  assert.match(validator, /maximumPortalInitialJavaScriptBytes = 400_000/);
  assert.match(validator, /portal document assets do not exactly match the canonical concept\/math corpus/);
  assert.match(validator, /legacyDeploymentReference/);
  assert.match(validator, /if \(pagesBase === ["']\/["']\)/);
  assert.match(validator, /legacy repository-subpath deployment reference/);
});

test("the Pages development server live-reloads canonical Markdown without an HTML fallback", async () => {
  const [config, packageJson] = await Promise.all([
    source("vite.pages.config.ts"),
    source("package.json"),
  ]);

  assert.match(packageJson, /"dev:github-pages":\s*"npm run prepare:reader-artifacts && vite --config vite\.pages\.config\.ts"/);
  assert.match(packageJson, /"build:github-pages":\s*"npm run prepare:reader-artifacts && npm run validate:book-pdf && vite build --config vite\.pages\.config\.ts"/);
  assert.match(config, /configureServer\(server: ViteDevServer\)/);
  assert.match(config, /server\.watcher\.on\("change", reloadPortal\)/);
  assert.match(config, /server\.ws\.send\(\{ type: "full-reload" \}\)/);
  assert.match(config, /"Content-Type", "text\/markdown; charset=utf-8"/);
  assert.match(config, /const portalDocumentPrefixes = \[\.\.\.new Set\(/);
  assert.match(config, /`\$\{pagesBase\}documents\/`/);
  assert.doesNotMatch(config, /["']\/20-watts-was-enough\/documents\/["']/);
});

test("generated Pages Markdown cannot inflate canonical math validation", async () => {
  const validator = await source("scripts/validate-math.mjs");
  assert.match(validator, /["']dist-github-pages["']/);
});

test("the public-source wording does not weaken the primary site's access badge", async () => {
  const [reader, book] = await Promise.all([
    source("app/components/research-reader.tsx"),
    source("app/components/book-edition.tsx"),
  ]);

  assert.match(reader, /Owner-only/);
  assert.match(reader, /public Git source/);
  assert.doesNotMatch(reader, /private Git source/);
  assert.match(book, /Git main snapshot/);
  assert.match(book, /Immutable release tag \$\{repositoryRef\}/);
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

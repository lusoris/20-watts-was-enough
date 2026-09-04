import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  decodePortalFragment,
  encodePortalFragment,
} from "../app/lib/portal-fragment.mjs";
import { publication } from "../app/lib/publication.mjs";
import {
  decodeBasicHtmlEntitiesOnce,
  stripHtmlTagSyntax,
} from "./lib/plain-text.mjs";
import { assertExactPublicationCopy } from "./lib/publication-copy-integrity.mjs";
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

test("Pages publication copies reject stale PDF and manifest bytes", async () => {
  const sourceBytes = Buffer.from("current publication bytes");
  for (const label of [
    "downloads/20-watts-was-enough-full-concept-book.pdf",
    "downloads/book-manifest.json",
  ]) {
    assert.doesNotThrow(() => assertExactPublicationCopy(
      sourceBytes,
      Buffer.from(sourceBytes),
      label,
    ));
    assert.throws(
      () => assertExactPublicationCopy(
        sourceBytes,
        Buffer.from("stale publication bytes"),
        label,
      ),
      new RegExp(`${label.replaceAll(".", "\\.")} differs from its current public source`),
    );
  }

  const validator = await source("scripts/validate-github-pages-build.mjs");
  assert.match(validator, /assertExactPublicationCopy\(publicPdf, pdfHeader, pdfPath\)/u);
  assert.match(
    validator,
    /assertExactPublicationCopy\(publicBookManifest, builtBookManifest, bookManifestPath\)/u,
  );
});

test("Pages builds portal, book, and source-bound help routes with a configurable safe base", async () => {
  const [config, portalEntry, portalHtml, bookEntry, bookHtml, helpCss, helpHtml] = await Promise.all([
    source("vite.pages.config.ts"),
    source("github-pages/main.tsx"),
    source("github-pages/index.html"),
    source("github-pages/book.tsx"),
    source("github-pages/book/index.html"),
    source("github-pages/help.css"),
    source("github-pages/help/index.html"),
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
  assert.match(config, /help:\s*path\.join\(repositoryRoot,\s*["']github-pages["'],\s*["']help["'],\s*["']index\.html["']\)/);

  assert.match(portalHtml, /<div id=["']root["']><!-- pages-seo:fallback -->/);
  assert.match(portalHtml, /src=["']\/main\.tsx["']/);
  assert.match(portalHtml, /https:\/\/www\.cordana\.dev\//);
  assert.match(portalHtml, /pages-seo:head/);
  assert.match(portalHtml, /rel=["']canonical["'] href=["']https:\/\/www\.cordana\.dev\/["']/);
  assert.match(portalHtml, /source-linked library below remains available/);
  assertNoLegacyDeploymentHost(portalHtml, "portal HTML must not reference the legacy Pages host");
  assert.doesNotMatch(portalEntry, /vinext|next\/headers|next\/server/);

  assert.match(bookEntry, /<BookEdition/);
  assert.match(bookEntry, /parameters\.get\(["']pdf["']\) === ["']1["']/);
  assert.match(bookEntry, /surface=\{surface\}/);
  assert.match(bookEntry, /assetBasePath=\{import\.meta\.env\.BASE_URL\}/);
  assert.match(bookEntry, /sourceRef=\{sourceRef\}/);
  assert.match(bookHtml, /<div id=["']root["']><!-- pages-seo:fallback -->/);
  assert.match(bookHtml, /src=["']\.\.\/book\.tsx["']/);
  assert.match(bookHtml, /https:\/\/www\.cordana\.dev\/book\//);
  assert.match(bookHtml, /pages-seo:head/);
  assert.match(bookHtml, /rel=["']canonical["'] href=["']https:\/\/www\.cordana\.dev\/book\/["']/);
  assert.match(bookHtml, /source-linked contents below remain available/);
  assertNoLegacyDeploymentHost(bookHtml, "book HTML must not reference the legacy Pages host");
  assert.doesNotMatch(bookEntry, /vinext|next\/headers|next\/server/);

  assert.match(helpCss, /@import ["']\.\.\/app\/globals\.css["']/);
  assert.match(helpHtml, /<div id=["']root["']><!-- pages-seo:fallback -->/);
  assert.match(helpHtml, /href=["']\.\.\/help\.css["']/);
  assert.doesNotMatch(helpHtml, /<script\b/);
  assert.match(helpHtml, /https:\/\/www\.cordana\.dev\/help\//);
  assertNoLegacyDeploymentHost(helpHtml, "help HTML must not reference the legacy Pages host");
});

test("the workflow uses GitHub's Pages artifact and deployment actions", async () => {
  const workflow = await source(".github/workflows/github-pages.yml");
  const packageManifest = JSON.parse(await source("package.json"));

  for (const required of [
    "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1",
    "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7",
    "actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6",
    "actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5",
    "actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128 # v5",
    "npm ci --no-audit",
    "npm run validate:sources",
    "node --test scripts/source-boundary.test.mjs",
    "npm run test:github-pages",
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
    packageManifest.scripts["test:github-pages"].indexOf("node --test")
      < packageManifest.scripts["test:github-pages"].indexOf("npm run build:github-pages"),
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
  assert.match(portal, /smokeReady\} development smoke harnesses/);
  assert.doesNotMatch(portal, /smokeReady\} artifacts ready/);
  assert.match(portal, /className="portal-system-figure"/);
  assert.match(portal, /Repository logic, not an experimental result/);
  assert.match(portal, /const catalogPageSize = 8/);
  assert.match(portal, /readerPageRef\.current\?\.scrollIntoView\(\{ block: "start" \}\)/);
  assert.doesNotMatch(portal, /readerRef\.current\?\.scrollIntoView/);
  assert.match(portal, />Read<\/a>/);
  assert.match(portal, />Evidence<\/a>/);
  assert.match(portal, />Experiments /);
  assert.match(portal, />Contribute<\/a>/);
  assert.match(portal, /const selectGroup = \(candidate: LibraryGroup\)/);
  assert.match(portal, /selectedMetadata\?\.group !== candidate/);
  assert.match(portal, /className="portal-mobile-menu"/);
  assert.match(portal, /className="portal-mobile-outline"/);
  assert.match(portal, /mobileMenuRef\.current\?\.removeAttribute\("open"\)/);
  assert.match(portal, /mobileOutlineRef\.current\?\.removeAttribute\("open"\)/);
  assert.match(portal, /selectHeading\(heading\.id\)/);
  assert.doesNotMatch(portal, /--portal-reader-stack-top/);
  assert.doesNotMatch(portal, /ResizeObserver/);
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

test("the sole public reader names its Git source and release identity", async () => {
  const [portal, book] = await Promise.all([
    source("app/components/public-research-portal.tsx"),
    source("app/components/book-edition.tsx"),
  ]);

  assert.equal(publication.repository, "https://github.com/lusoris/20-watts-was-enough");
  assert.match(portal, /const repositoryUrl = publication\.repository/);
  assert.doesNotMatch(portal, /Owner-only|private Git source/);
  assert.match(book, /Git main snapshot/);
  assert.match(book, /Immutable release tag \$\{repositoryRef\}/);
  assert.doesNotMatch(book, /Owner-only|chatgpt\.site/);
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

  assert.match(notices, /- rolldown@1\.2\.6 — MIT/);
  assert.match(notices, /- vite@8\.2\.2 — MIT/);
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

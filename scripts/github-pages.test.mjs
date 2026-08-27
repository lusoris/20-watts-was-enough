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

test("the Pages entry is a dedicated static book with a project-relative base", async () => {
  const [config, entry, html] = await Promise.all([
    source("vite.pages.config.ts"),
    source("github-pages/main.tsx"),
    source("github-pages/index.html"),
  ]);

  assert.match(config, /base:\s*["']\/20-watts-was-enough\/["']/);
  assert.match(config, /root:\s*path\.join\(repositoryRoot,\s*["']github-pages["']\)/);
  assert.match(config, /publicDir:\s*path\.join\(repositoryRoot,\s*["']public["']\)/);
  assert.match(entry, /<BookEdition/);
  assert.match(entry, /surface=["']github-pages["']/);
  assert.match(entry, /assetBasePath=\{import\.meta\.env\.BASE_URL\}/);
  assert.match(html, /<div id=["']root["']><\/div>/);
  assert.doesNotMatch(entry, /vinext|next\/headers|next\/server/);
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
    "npm run prepare:reader-artifacts",
    "npm run validate:book-pdf",
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

test("third-party notices include every current virtual bundler runtime", () => {
  const notices = renderThirdPartyNotices({
    moduleIds: new Set([
      "\0rolldown/runtime.js",
      "\0vite/modulepreload-polyfill.js",
      "\0vite/preload-helper.js",
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

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { build } from "vite";

import pagesConfig, { createSeoStaticPages } from "../vite.pages.config.ts";
import { resolvePagesBase } from "./lib/pages-base.mjs";
import { translatedSourceDocuments } from "./lib/translation-pages.mjs";

async function nonemptyManifestFixture(root) {
  const source = Buffer.from("# Canonical source\n\nExact source text for the build fixture.\n");
  const target = Buffer.from("# Geprüfte Übersetzung\n\nGeprüfter Text für den Build-Test.\n");
  const sourcePath = "concept/build-fixture.md";
  const targetPath = "translations/de/concept/build-fixture.md";
  await mkdir(path.join(root, "concept"), { recursive: true });
  await mkdir(path.join(root, "translations", "de", "concept"), { recursive: true });
  await writeFile(path.join(root, sourcePath), source);
  await writeFile(path.join(root, targetPath), target);
  await writeFile(path.join(root, "translations", "manifest.json"), `${JSON.stringify({
    schema: 2,
    sourceLanguage: "en-GB",
    documents: [{
      language: "de",
      source: sourcePath,
      target: targetPath,
      sourceRoute: "/concept/build-fixture/",
      route: "/de/concept/build-fixture/",
      sourceSha256: createHash("sha256").update(source).digest("hex"),
      targetSha256: createHash("sha256").update(target).digest("hex"),
      reviewers: ["build-fixture-reviewer"],
    }],
  }, null, 2)}\n`);
}

test("a Vite Pages build publishes routes from a nonempty reviewed manifest", async (t) => {
  const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), "20w-vite-translation-source-"));
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "20w-vite-translation-output-"));
  t.after(() => Promise.all([
    rm(fixtureRoot, { recursive: true, force: true }),
    rm(outputRoot, { recursive: true, force: true }),
  ]));
  await nonemptyManifestFixture(fixtureRoot);
  const translations = translatedSourceDocuments(fixtureRoot);
  assert.equal(translations.length, 1);

  const plugins = (pagesConfig.plugins ?? []).filter(
    (plugin) => !plugin || Array.isArray(plugin) || plugin.name !== "seo-static-pages",
  );
  plugins.push(createSeoStaticPages({
    outputRoot,
    translationDocuments: translations,
  }));
  await build({
    ...pagesConfig,
    configFile: false,
    logLevel: "error",
    plugins,
    build: {
      ...pagesConfig.build,
      outDir: outputRoot,
      emptyOutDir: true,
    },
  });

  const [html, sitemap] = await Promise.all([
    readFile(path.join(outputRoot, "de", "concept", "build-fixture", "index.html"), "utf8"),
    readFile(path.join(outputRoot, "sitemap.xml"), "utf8"),
  ]);
  const pagesBase = resolvePagesBase(process.env.PAGES_BASE_PATH);
  assert.match(html, /<html lang="de">/u);
  assert.match(html, /property="og:locale" content="de_DE"/u);
  assert.match(html, /<h1>Geprüfte Übersetzung<\/h1>/u);
  assert.match(html, /<span aria-current="page"><span lang="de">Deutsch<\/span> · current<\/span>/u);
  assert.ok(html.includes(`href="${pagesBase}concept/build-fixture/">English</a>`));
  assert.match(html, /rel="alternate" hreflang="en" href="https:\/\/www\.cordana\.dev\/concept\/build-fixture\/"/u);
  assert.match(html, /rel="alternate" hreflang="de" href="https:\/\/www\.cordana\.dev\/de\/concept\/build-fixture\/"/u);
  assert.doesNotMatch(html, />Français<\/a>/u);
  assert.match(html, /template=translation-problem\.yml/u);
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc=/u);
  assert.match(
    sitemap,
    /<loc>https:\/\/www\.cordana\.dev\/de\/concept\/build-fixture\/<\/loc>/u,
  );
});

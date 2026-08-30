import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdtemp,
  mkdir,
  rename,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  translationManifestLimits,
  validateTranslationManifest,
} from "./lib/translation-manifest.mjs";

async function writeManifest(root, manifest) {
  await writeFile(
    path.join(root, "translations", "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-translations-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = Buffer.from("# Source\n\nCanonical text.\n");
  await mkdir(path.join(root, "concept"), { recursive: true });
  await mkdir(path.join(root, "translations", "de", "concept"), { recursive: true });
  await writeFile(path.join(root, "concept", "00-source.md"), source);
  const target = Buffer.from("# Quelle\n");
  await writeFile(path.join(root, "translations", "de", "concept", "00-source.md"), target);
  const entry = {
    language: "de",
    source: "concept/00-source.md",
    target: "translations/de/concept/00-source.md",
    sourceRoute: "/concept/00-source/",
    route: "/de/concept/00-source/",
    sourceSha256: createHash("sha256").update(source).digest("hex"),
    targetSha256: createHash("sha256").update(target).digest("hex"),
    reviewers: ["reviewer-handle"],
  };
  const manifest = { schema: 2, sourceLanguage: "en-GB", documents: [entry] };
  await writeManifest(root, manifest);
  return { root, entry, manifest };
}

async function replaceWithSymlink(file) {
  const regular = `${file}.regular`;
  await rename(file, regular);
  await symlink(regular, file);
}

test("reviewed translations are tied to an exact mirrored source", async (t) => {
  const { root } = await fixture(t);
  const result = validateTranslationManifest(root);
  assert.equal(result.documents.length, 1);
  assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(result.documents[0].reviewers));
});

test("the pre-target-digest manifest schema is rejected", async (t) => {
  const { root, manifest } = await fixture(t);
  manifest.schema = 1;
  await writeManifest(root, manifest);
  assert.throws(
    () => validateTranslationManifest(root),
    /unsupported schema or source language/,
  );
});

test("a canonical source change makes its translation stale", async (t) => {
  const { root } = await fixture(t);
  await writeFile(path.join(root, "concept", "00-source.md"), "# Changed\n");
  assert.throws(
    () => validateTranslationManifest(root),
    /Translation is stale for canonical source/,
  );
});

test("a translated target change invalidates its recorded review", async (t) => {
  const { root } = await fixture(t);
  await writeFile(
    path.join(root, "translations", "de", "concept", "00-source.md"),
    "# Unreviewed replacement\n",
  );
  assert.throws(
    () => validateTranslationManifest(root),
    /Translation changed after review/,
  );
});

test("filesystem-aliasing source paths are rejected", async (t) => {
  const { root, entry, manifest } = await fixture(t);
  entry.source = "concept//00-source.md";
  entry.target = "translations/de/concept//00-source.md";
  entry.sourceRoute = "/concept//00-source/";
  entry.route = "/de/concept//00-source/";
  await writeManifest(root, manifest);
  assert.throws(
    () => validateTranslationManifest(root),
    /Unsafe translation source path/,
  );
});

test("manifest, source, and target symbolic links are rejected", async (t) => {
  for (const relative of [
    "translations/manifest.json",
    "concept/00-source.md",
    "translations/de/concept/00-source.md",
  ]) {
    const { root } = await fixture(t);
    await replaceWithSymlink(path.join(root, ...relative.split("/")));
    assert.throws(
      () => validateTranslationManifest(root),
      /named path is linked, invalid, or no longer identifies the opened file/,
      relative,
    );
  }
});

test("symbolic-link ancestors of translation inputs are rejected", async (t) => {
  for (const relativeDirectory of ["concept", "translations/de/concept"]) {
    const { root } = await fixture(t);
    const directory = path.join(root, ...relativeDirectory.split("/"));
    const regular = `${directory}.regular`;
    await rename(directory, regular);
    await symlink(regular, directory);
    assert.throws(
      () => validateTranslationManifest(root),
      /containment root is linked or not a directory/,
      relativeDirectory,
    );
  }
});

test("unknown manifest and document fields are rejected", async (t) => {
  for (const level of ["manifest", "document"]) {
    const { root, entry, manifest } = await fixture(t);
    if (level === "manifest") manifest.unreviewed = true;
    else entry.unreviewed = true;
    await writeManifest(root, manifest);
    assert.throws(
      () => validateTranslationManifest(root),
      /fields are not closed: unknown=\[unreviewed\]/,
      level,
    );
  }
});

test("duplicate JSON names are rejected before schema projection", async (t) => {
  for (const level of ["manifest", "document"]) {
    const { root, manifest } = await fixture(t);
    const valid = JSON.stringify(manifest);
    const ambiguous = level === "manifest"
      ? valid.replace('"schema":2', '"schema":2,"schema":2')
      : valid.replace('"language":"de"', '"language":"de","\\u006canguage":"de"');
    await writeFile(path.join(root, "translations", "manifest.json"), ambiguous);
    assert.throws(
      () => validateTranslationManifest(root),
      /object repeats name/,
      level,
    );
  }
});

test("only declared non-English official EU language codes are accepted", async (t) => {
  for (const language of ["en", "no", "de-DE"]) {
    const { root, entry, manifest } = await fixture(t);
    entry.language = language;
    await writeManifest(root, manifest);
    assert.throws(
      () => validateTranslationManifest(root),
      /non-English official EU language code/,
      language,
    );
  }
});

test("manifest collections and reviewer lists are bounded", async (t) => {
  {
    const { root, entry, manifest } = await fixture(t);
    entry.reviewers = Array.from(
      { length: translationManifestLimits.reviewersPerDocument + 1 },
      (_, index) => `reviewer-${index}`,
    );
    await writeManifest(root, manifest);
    assert.throws(() => validateTranslationManifest(root), /named reviewers/);
  }
  {
    const { root, manifest } = await fixture(t);
    manifest.documents = Array.from(
      { length: translationManifestLimits.documents + 1 },
      () => null,
    );
    await writeManifest(root, manifest);
    assert.throws(() => validateTranslationManifest(root), /array exceeds its item limit/);
  }
});

test("manifest, source, and target byte limits fail closed", async (t) => {
  {
    const { root } = await fixture(t);
    await writeFile(
      path.join(root, "translations", "manifest.json"),
      Buffer.alloc(translationManifestLimits.manifestBytes + 1, 0x20),
    );
    assert.throws(() => validateTranslationManifest(root), /file exceeds the .*byte limit/);
  }
  for (const relative of [
    "concept/00-source.md",
    "translations/de/concept/00-source.md",
  ]) {
    const { root } = await fixture(t);
    await writeFile(
      path.join(root, ...relative.split("/")),
      Buffer.alloc(translationManifestLimits.documentBytes + 1, 0x61),
    );
    assert.throws(
      () => validateTranslationManifest(root),
      /file exceeds the .*byte limit/,
      relative,
    );
  }
});

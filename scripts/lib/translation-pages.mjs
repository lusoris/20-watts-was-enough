import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { withStableOpenedFileSync } from "./opened-file.mjs";
import { markdownDocumentFromBody } from "./portal-documents.mjs";
import {
  populateSeoTemplate,
  renderDocumentFallback,
  renderSeoHead,
} from "./pages-seo.mjs";
import {
  translationManifestLimits,
  validateTranslationManifest,
} from "./translation-manifest.mjs";

const translationRoutePattern = /^[a-z]{2}\/(?:concept|math)\/(?:[a-z0-9][a-z0-9-]*\/)*[a-z0-9][a-z0-9-]*\/$/u;
const englishHtmlLanguagePattern = /<html\s+lang="en">/gu;

function withoutLeadingSlash(value) {
  return value.replace(/^\/+/, "");
}

function translatedGroup(source) {
  return source.startsWith("concept/") ? "Concept" : "Mathematics";
}

function reviewedTargetBody(root, entry, afterTargetRead) {
  const targetPath = path.resolve(root, entry.target);
  const bytes = withStableOpenedFileSync(
    targetPath,
    {
      label: `reviewed translation target ${entry.target}`,
      containedBy: path.dirname(targetPath),
      maximumBytes: translationManifestLimits.documentBytes,
    },
    (descriptor) => {
      const target = readFileSync(descriptor);
      afterTargetRead?.({ entry, targetPath });
      return target;
    },
  );
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== entry.targetSha256) {
    throw new Error(`Translation changed after review: ${entry.target}`);
  }
  return bytes.toString("utf8");
}

export function translatedSourceDocuments(repositoryRoot, { afterTargetRead } = {}) {
  const root = path.resolve(repositoryRoot);
  const manifest = validateTranslationManifest(root);
  return manifest.documents.map((entry) => Object.freeze({
    ...markdownDocumentFromBody(
      entry.target,
      translatedGroup(entry.source),
      reviewedTargetBody(root, entry, afterTargetRead),
    ),
    route: withoutLeadingSlash(entry.route),
    language: entry.language,
    canonicalSourcePath: entry.source,
    canonicalSourceRoute: withoutLeadingSlash(entry.sourceRoute),
    sourceSha256: entry.sourceSha256,
    targetSha256: entry.targetSha256,
    reviewers: entry.reviewers,
  })).sort((left, right) => (
    left.language.localeCompare(right.language)
    || left.canonicalSourcePath.localeCompare(right.canonicalSourcePath, undefined, {
      numeric: true,
    })
  ));
}

export function translationAvailabilityRecords(documents) {
  return Object.freeze(documents.map((document) => Object.freeze({
    language: document.language,
    sourceRoute: `/${withoutLeadingSlash(document.canonicalSourceRoute)}`,
    route: `/${withoutLeadingSlash(document.route)}`,
  })));
}

function withHtmlLanguage(template, language) {
  const matches = [...template.matchAll(englishHtmlLanguagePattern)];
  if (matches.length !== 1) {
    throw new Error("Translation template must contain exactly one English HTML language marker.");
  }
  return template.replace(englishHtmlLanguagePattern, `<html lang="${language}">`);
}

export function renderTranslationPage({
  template,
  document,
  documents,
  availabilityDocuments = documents,
  basePath,
}) {
  const availability = translationAvailabilityRecords(availabilityDocuments);
  return populateSeoTemplate(
    withHtmlLanguage(template, document.language),
    renderSeoHead("document", document, basePath, availability),
    renderDocumentFallback(
      document,
      documents,
      basePath,
      availability,
    ),
  );
}

export function writeTranslationPages({
  outputRoot,
  template,
  documents,
  basePath,
}) {
  const root = path.resolve(outputRoot);
  const written = [];
  const outputPaths = new Set();
  for (const document of documents) {
    if (!translationRoutePattern.test(document.route)) {
      throw new Error(`Unsafe translated publication route: ${document.route}`);
    }
    const cohort = documents.filter((candidate) => candidate.language === document.language);
    const output = path.resolve(root, ...document.route.split("/"), "index.html");
    const relative = path.relative(root, output);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error(`Translated publication route escapes the output root: ${document.route}`);
    }
    if (outputPaths.has(relative)) {
      throw new Error(`Translated publication routes alias one output: ${document.route}`);
    }
    outputPaths.add(relative);
    mkdirSync(path.dirname(output), { recursive: true });
    writeFileSync(output, renderTranslationPage({
      template,
      document,
      documents: cohort,
      availabilityDocuments: documents,
      basePath,
    }), "utf8");
    written.push(relative.replaceAll("\\", "/"));
  }
  return Object.freeze(written);
}

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  officialEuLanguages,
  reviewedTranslationUrl,
  translationContributionUrl,
} from "../app/lib/language-access.mjs";
import {
  openGraphLocaleForEuLanguage,
  validateEuLanguageRegistry,
} from "../app/lib/eu-languages.mjs";
import languageRegistry from "../translations/eu-languages.json" with { type: "json" };
import { parseStrictJson } from "./lib/strict-json.mjs";

test("language access enumerates the 24 official EU languages once", () => {
  const codes = officialEuLanguages.map(([code]) => code);
  assert.equal(codes.length, 24);
  assert.equal(new Set(codes).size, 24);
  assert.deepEqual(codes.toSorted(), [
    "bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fr", "ga", "hr",
    "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv",
  ]);
  assert.equal(openGraphLocaleForEuLanguage("de"), "de_DE");
  assert.equal(openGraphLocaleForEuLanguage("ga"), "ga_IE");
  assert.equal(openGraphLocaleForEuLanguage("invalid"), null);
});

test("the shared EU language registry fails closed on identity, order, bounds, and schema drift", async () => {
  const raw = await readFile("translations/eu-languages.json");
  const parsed = parseStrictJson(raw, {
    label: "EU language registry JSON",
    maximumDepth: 4,
    maximumContainerEntries: 64,
  });
  assert.equal(validateEuLanguageRegistry(parsed).length, 24);
  const duplicate = raw.toString("utf8").replace('"schema": 1', '"schema": 1, "schema": 1');
  assert.throws(
    () => parseStrictJson(duplicate, {
      label: "EU language registry JSON",
      maximumDepth: 4,
      maximumContainerEntries: 64,
    }),
    /repeats name "schema"/u,
  );

  const wrongCode = structuredClone(languageRegistry);
  wrongCode.languages[9].code = "zz";
  assert.throws(() => validateEuLanguageRegistry(wrongCode), /exact ordered 24-code records/u);

  const wrongOrder = structuredClone(languageRegistry);
  [wrongOrder.languages[8], wrongOrder.languages[9]] = [wrongOrder.languages[9], wrongOrder.languages[8]];
  assert.throws(() => validateEuLanguageRegistry(wrongOrder), /exact ordered 24-code records/u);

  const openRecord = structuredClone(languageRegistry);
  openRecord.languages[0].provider = "none";
  assert.throws(() => validateEuLanguageRegistry(openRecord), /exact ordered 24-code records/u);

  const missingRecord = structuredClone(languageRegistry);
  missingRecord.languages.pop();
  assert.throws(() => validateEuLanguageRegistry(missingRecord), /exact ordered 24-code set/u);

  const oversizedLabel = structuredClone(languageRegistry);
  oversizedLabel.languages[0].label = "ä".repeat(65);
  assert.throws(() => validateEuLanguageRegistry(oversizedLabel), /exact ordered 24-code records/u);
});

test("unreviewed languages route to a contribution issue, never machine output", () => {
  const location = {
    pathname: "/concept/00-thesis-and-principles/",
    search: "?view=reader",
    hash: "#efficiency",
  };
  assert.equal(reviewedTranslationUrl("de", location), null);
  const contribution = new URL(translationContributionUrl("de", location));
  assert.equal(contribution.origin, "https://github.com");
  assert.equal(contribution.searchParams.get("template"), "translation-problem.yml");
  assert.match(contribution.searchParams.get("title"), /de: \/concept\/00-thesis-and-principles\//);
  assert.equal(translationContributionUrl("en", location), null);
  assert.equal(translationContributionUrl("invalid", location), null);
});

test("portal and web book share one labelled language control", async () => {
  const [control, portal, book] = await Promise.all([
    readFile("app/components/language-access.tsx", "utf8"),
    readFile("app/components/public-research-portal.tsx", "utf8"),
    readFile("app/components/book-edition.tsx", "utf8"),
  ]);
  assert.match(portal, /<LanguageAccess\s*\/>/);
  assert.match(book, /!isPublicPdf && <LanguageAccess\s*\/>/);
  assert.match(control, /Open reviewed translation/);
  assert.match(control, /Help translate or review this page/);
  assert.match(control, /No automatic translation is presented as project text/);
  assert.doesNotMatch(control, /Google|translate\.google/);
  assert.doesNotMatch(control, /<script|dangerouslySetInnerHTML|window\.location\.(?:assign|replace)/);
});

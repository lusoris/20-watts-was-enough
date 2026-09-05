import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  languageAvailability,
  languageAvailabilityForRoute,
  languageAlternateLinksForRoute,
  languageDestinationUrl,
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

const reviewedGermanThesis = Object.freeze({
  language: "de",
  sourceRoute: "/concept/00-thesis-and-principles/",
  route: "/de/concept/00-thesis-and-principles/",
});

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

test("reading destinations contain only English and route-matched reviewed translations", () => {
  const location = {
    pathname: "/concept/00-thesis-and-principles/",
    search: "?view=reader",
    hash: "#efficiency",
  };
  const availability = languageAvailability(location, {
    documents: [reviewedGermanThesis],
  });
  assert.deepEqual(
    availability.available.map(({ code }) => code),
    ["en", "de"],
  );
  assert.equal(availability.unavailable.length, 22);
  assert.equal(availability.unavailable.some(({ code }) => code === "de"), false);
  assert.equal(availability.available.find(({ code }) => code === "en")?.current, true);
  assert.equal(
    reviewedTranslationUrl("de", location, { documents: [reviewedGermanThesis] }),
    "/de/concept/00-thesis-and-principles/#efficiency",
  );
  assert.equal(
    reviewedTranslationUrl("fr", location, { documents: [reviewedGermanThesis] }),
    null,
  );
});

test("availability follows the current source route and strips the configured Pages base", () => {
  const otherRoute = languageAvailabilityForRoute(
    "/concept/10-learning-memory-and-plasticity/",
    [reviewedGermanThesis],
  );
  assert.deepEqual(otherRoute.available.map(({ code }) => code), ["en"]);
  assert.equal(otherRoute.unavailable.some(({ code }) => code === "de"), true);

  const translated = {
    pathname: "/research/de/concept/00-thesis-and-principles/",
    hash: "#scope",
  };
  const translatedAvailability = languageAvailability(translated, {
    basePath: "/research/",
    documents: [reviewedGermanThesis],
  });
  assert.equal(translatedAvailability.currentLanguage, "de");
  assert.equal(
    languageDestinationUrl("en", translated, {
      basePath: "/research/",
      documents: [reviewedGermanThesis],
    }),
    "/research/concept/00-thesis-and-principles/#scope",
  );
});

test("hydrated language destinations preserve root and explicit Pages bases", () => {
  const canonical = {
    pathname: "/concept/00-thesis-and-principles/",
    hash: "#scope",
  };
  assert.equal(
    languageDestinationUrl("de", canonical, {
      basePath: "/",
      documents: [reviewedGermanThesis],
    }),
    "/de/concept/00-thesis-and-principles/#scope",
  );

  const preview = {
    pathname: "/preview/concept/00-thesis-and-principles/",
    hash: "#scope",
  };
  assert.equal(
    languageDestinationUrl("de", preview, {
      basePath: "/preview/",
      documents: [reviewedGermanThesis],
    }),
    "/preview/de/concept/00-thesis-and-principles/#scope",
  );
});

test("language alternates are reciprocal self-and-peer links from one route projection", () => {
  const expected = [
    {
      language: "en",
      href: "https://www.cordana.dev/concept/00-thesis-and-principles/",
    },
    {
      language: "de",
      href: "https://www.cordana.dev/de/concept/00-thesis-and-principles/",
    },
  ];
  assert.deepEqual(
    languageAlternateLinksForRoute(
      "/concept/00-thesis-and-principles/",
      [reviewedGermanThesis],
    ),
    expected,
  );
  assert.deepEqual(
    languageAlternateLinksForRoute(
      "/de/concept/00-thesis-and-principles/",
      [reviewedGermanThesis],
    ),
    expected,
  );
  assert.deepEqual(
    languageAlternateLinksForRoute("/concept/untranslated/", [reviewedGermanThesis]),
    [],
  );
});

test("unavailable languages use a separate source-bound contribution route", () => {
  const location = {
    pathname: "/concept/00-thesis-and-principles/",
    hash: "#efficiency",
  };
  assert.equal(reviewedTranslationUrl("de", location), null);
  const contribution = new URL(translationContributionUrl(location));
  assert.equal(contribution.origin, "https://github.com");
  assert.equal(contribution.searchParams.get("template"), "translation-problem.yml");
  assert.equal(
    contribution.searchParams.get("title"),
    "[Translation] /concept/00-thesis-and-principles/",
  );
  assert.match(
    contribution.searchParams.get("source"),
    /^https:\/\/www\.cordana\.dev\/concept\/00-thesis-and-principles\/ at commit or release:/u,
  );
});

test("availability rejects malformed and duplicate route projections", () => {
  assert.throws(
    () => languageAvailabilityForRoute("/concept/source/", [{
      language: "de",
      sourceRoute: "/concept/source/",
      route: "/fr/concept/source/",
    }]),
    /unsafe routes/u,
  );
  assert.throws(
    () => languageAvailabilityForRoute(
      "/concept/00-thesis-and-principles/",
      [reviewedGermanThesis, reviewedGermanThesis],
    ),
    /repeats de:/u,
  );
  assert.throws(
    () => languageAlternateLinksForRoute("/concept/source/", [{
      language: "de",
      sourceRoute: "/concept/source/",
      route: "/fr/concept/source/",
    }]),
    /unsafe routes/u,
  );
  assert.throws(
    () => languageAlternateLinksForRoute(
      "/concept/00-thesis-and-principles/",
      [reviewedGermanThesis, reviewedGermanThesis],
    ),
    /repeats de:/u,
  );
});

test("portal and web book share one labelled language control", async () => {
  const [control, portal, book] = await Promise.all([
    readFile("app/components/language-access.tsx", "utf8"),
    readFile("app/components/public-research-portal.tsx", "utf8"),
    readFile("app/components/book-edition.tsx", "utf8"),
  ]);
  assert.match(portal, /<LanguageAccess basePath=\{assetBasePath\}\s*\/>/);
  assert.match(book, /!isPublicPdf && <LanguageAccess basePath=\{assetBasePath\}\s*\/>/);
  assert.match(control, /availability\.available\.map/);
  assert.doesNotMatch(control, /officialEuLanguages\.map/);
  assert.match(control, /Open reviewed translation/);
  assert.match(control, /Help add or review a language/);
  assert.match(control, /translations tied to this source version/);
  assert.doesNotMatch(control, /Google|translate\.google/);
  assert.doesNotMatch(control, /<script|dangerouslySetInnerHTML|window\.location\.(?:assign|replace)/);
});

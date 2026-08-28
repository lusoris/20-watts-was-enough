import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  canonicalRouteUrl,
  googleTranslationHandoffUrl,
  officialEuLanguages,
} from "../app/lib/machine-translation.mjs";

test("language access enumerates the 24 official EU languages once", () => {
  const codes = officialEuLanguages.map(([code]) => code);
  assert.equal(codes.length, 24);
  assert.equal(new Set(codes).size, 24);
  assert.deepEqual(codes.toSorted(), [
    "bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fr", "ga", "hr",
    "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv",
  ]);
});

test("translation is an explicit handoff for the same canonical HTTPS route", () => {
  const location = {
    pathname: "/concept/00-thesis-and-principles/",
    search: "?view=reader",
    hash: "#efficiency",
  };
  const canonical = canonicalRouteUrl(location);
  assert.equal(
    canonical,
    "https://www.cordana.dev/concept/00-thesis-and-principles/?view=reader#efficiency",
  );
  const handoff = new URL(googleTranslationHandoffUrl("de", location));
  assert.equal(handoff.origin, "https://translate.google.com");
  assert.equal(handoff.searchParams.get("sl"), "en");
  assert.equal(handoff.searchParams.get("tl"), "de");
  assert.equal(handoff.searchParams.get("u"), canonical);
  assert.equal(googleTranslationHandoffUrl("en", location), null);
  assert.equal(googleTranslationHandoffUrl("invalid", location), null);
});

test("portal and web book share one labelled language control", async () => {
  const [control, portal, book] = await Promise.all([
    readFile("app/components/language-access.tsx", "utf8"),
    readFile("app/components/public-research-portal.tsx", "utf8"),
    readFile("app/components/book-edition.tsx", "utf8"),
  ]);
  assert.match(portal, /<LanguageAccess\s*\/>/);
  assert.match(book, /!isPublicPdf && <LanguageAccess\s*\/>/);
  assert.match(control, /Open automatic translation/);
  assert.match(control, /Google(?:&apos;|')s terms and privacy policy/);
  assert.doesNotMatch(control, /<script|dangerouslySetInnerHTML|window\.location\.(?:assign|replace)/);
});

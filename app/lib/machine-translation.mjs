export const canonicalPublicOrigin = "https://www.cordana.dev";

export const officialEuLanguages = Object.freeze([
  ["en", "English"],
  ["bg", "Български"],
  ["hr", "Hrvatski"],
  ["cs", "Čeština"],
  ["da", "Dansk"],
  ["nl", "Nederlands"],
  ["et", "Eesti"],
  ["fi", "Suomi"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["el", "Ελληνικά"],
  ["hu", "Magyar"],
  ["ga", "Gaeilge"],
  ["it", "Italiano"],
  ["lv", "Latviešu"],
  ["lt", "Lietuvių"],
  ["mt", "Malti"],
  ["pl", "Polski"],
  ["pt", "Português"],
  ["ro", "Română"],
  ["sk", "Slovenčina"],
  ["sl", "Slovenščina"],
  ["es", "Español"],
  ["sv", "Svenska"],
]);

const languageCodes = new Set(officialEuLanguages.map(([code]) => code));

export function canonicalRouteUrl(location) {
  const path = `${location.pathname || "/"}${location.search || ""}${location.hash || ""}`;
  return new URL(path, canonicalPublicOrigin).toString();
}

export function googleTranslationHandoffUrl(language, location) {
  if (language === "en" || !languageCodes.has(language)) return null;
  const handoff = new URL("https://translate.google.com/translate");
  handoff.searchParams.set("sl", "en");
  handoff.searchParams.set("tl", language);
  handoff.searchParams.set("u", canonicalRouteUrl(location));
  return handoff.toString();
}

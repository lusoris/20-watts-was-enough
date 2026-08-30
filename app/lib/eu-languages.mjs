import languageRegistry from "../../translations/eu-languages.json" with { type: "json" };

const expectedCodes = Object.freeze([
  "en", "bg", "hr", "cs", "da", "nl", "et", "fi", "fr", "de", "el", "hu",
  "ga", "it", "lv", "lt", "mt", "pl", "pt", "ro", "sk", "sl", "es", "sv",
]);
const recordFields = Object.freeze(["code", "label", "openGraphLocale"]);
const utf8Encoder = new TextEncoder();

function hasExactFields(value, expected) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).toSorted().join("\0") === expected.toSorted().join("\0");
}

export function validateEuLanguageRegistry(registry) {
  if (
    !hasExactFields(registry, ["schema", "languages"])
    || registry.schema !== 1
    || !Array.isArray(registry.languages)
    || registry.languages.length !== expectedCodes.length
  ) {
    throw new Error("EU language registry must contain the exact ordered 24-code set.");
  }
  return Object.freeze(registry.languages.map((record, index) => {
    if (
      !hasExactFields(record, recordFields)
      || record.code !== expectedCodes[index]
      || typeof record.label !== "string"
      || record.label.length === 0
      || record.label !== record.label.trim()
      || utf8Encoder.encode(record.label).length > 128
      || typeof record.openGraphLocale !== "string"
      || !/^[a-z]{2}_[A-Z]{2}$/u.test(record.openGraphLocale)
      || !record.openGraphLocale.startsWith(`${record.code}_`)
    ) {
      throw new Error("EU language registry does not match the exact ordered 24-code records.");
    }
    return Object.freeze({ ...record });
  }));
}

const officialEuLanguageRecords = validateEuLanguageRegistry(languageRegistry);

export const officialEuLanguages = Object.freeze(
  officialEuLanguageRecords.map(({ code, label }) => Object.freeze([code, label])),
);

const officialEuLanguageCodes = new Set(
  officialEuLanguages.map(([code]) => code),
);
const openGraphLocales = new Map(
  officialEuLanguageRecords.map(({ code, openGraphLocale }) => [code, openGraphLocale]),
);

export function isOfficialEuLanguageCode(value) {
  return officialEuLanguageCodes.has(value);
}

export function openGraphLocaleForEuLanguage(value) {
  return openGraphLocales.get(value) ?? null;
}

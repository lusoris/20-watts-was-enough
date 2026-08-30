const officialEuLanguageRecords = Object.freeze([
  Object.freeze({ code: "en", label: "English", openGraphLocale: "en_GB" }),
  Object.freeze({ code: "bg", label: "Български", openGraphLocale: "bg_BG" }),
  Object.freeze({ code: "hr", label: "Hrvatski", openGraphLocale: "hr_HR" }),
  Object.freeze({ code: "cs", label: "Čeština", openGraphLocale: "cs_CZ" }),
  Object.freeze({ code: "da", label: "Dansk", openGraphLocale: "da_DK" }),
  Object.freeze({ code: "nl", label: "Nederlands", openGraphLocale: "nl_NL" }),
  Object.freeze({ code: "et", label: "Eesti", openGraphLocale: "et_EE" }),
  Object.freeze({ code: "fi", label: "Suomi", openGraphLocale: "fi_FI" }),
  Object.freeze({ code: "fr", label: "Français", openGraphLocale: "fr_FR" }),
  Object.freeze({ code: "de", label: "Deutsch", openGraphLocale: "de_DE" }),
  Object.freeze({ code: "el", label: "Ελληνικά", openGraphLocale: "el_GR" }),
  Object.freeze({ code: "hu", label: "Magyar", openGraphLocale: "hu_HU" }),
  Object.freeze({ code: "ga", label: "Gaeilge", openGraphLocale: "ga_IE" }),
  Object.freeze({ code: "it", label: "Italiano", openGraphLocale: "it_IT" }),
  Object.freeze({ code: "lv", label: "Latviešu", openGraphLocale: "lv_LV" }),
  Object.freeze({ code: "lt", label: "Lietuvių", openGraphLocale: "lt_LT" }),
  Object.freeze({ code: "mt", label: "Malti", openGraphLocale: "mt_MT" }),
  Object.freeze({ code: "pl", label: "Polski", openGraphLocale: "pl_PL" }),
  Object.freeze({ code: "pt", label: "Português", openGraphLocale: "pt_PT" }),
  Object.freeze({ code: "ro", label: "Română", openGraphLocale: "ro_RO" }),
  Object.freeze({ code: "sk", label: "Slovenčina", openGraphLocale: "sk_SK" }),
  Object.freeze({ code: "sl", label: "Slovenščina", openGraphLocale: "sl_SI" }),
  Object.freeze({ code: "es", label: "Español", openGraphLocale: "es_ES" }),
  Object.freeze({ code: "sv", label: "Svenska", openGraphLocale: "sv_SE" }),
]);

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

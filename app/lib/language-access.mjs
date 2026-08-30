import translationManifest from "../../translations/manifest.json" with { type: "json" };
import {
  isOfficialEuLanguageCode,
  officialEuLanguages,
} from "./eu-languages.mjs";
import { publication, repositoryIssueUrl } from "./publication.mjs";

export const canonicalPublicOrigin = publication.canonicalSite;
export { officialEuLanguages };

function canonicalPath(location) {
  const pathname = location.pathname || "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function reviewedTranslationUrl(language, location) {
  if (language === "en" || !isOfficialEuLanguageCode(language)) return null;
  const sourceRoute = canonicalPath(location);
  const translation = translationManifest.documents.find(
    (entry) => entry.language === language && entry.sourceRoute === sourceRoute,
  );
  if (!translation) return null;
  const translated = new URL(translation.route, canonicalPublicOrigin);
  translated.hash = location.hash || "";
  return translated.toString();
}

export function translationContributionUrl(language, location) {
  if (language === "en" || !isOfficialEuLanguageCode(language)) return null;
  return repositoryIssueUrl(
    "translation-problem.yml",
    `[Translation] ${language}: ${canonicalPath(location)}`,
  );
}

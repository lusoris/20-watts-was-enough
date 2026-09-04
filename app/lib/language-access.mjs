import translationManifest from "../../translations/manifest.json" with { type: "json" };
import {
  isOfficialEuLanguageCode,
  officialEuLanguages,
} from "./eu-languages.mjs";
import { publication, repositoryIssueUrl } from "./publication.mjs";

export const canonicalPublicOrigin = publication.canonicalSite;
export { officialEuLanguages };

const maximumTranslationDocuments = 4096;
const publicationRoutePattern = /^\/(?:concept|math)\/(?:[a-z0-9][a-z0-9-]*\/)*[a-z0-9][a-z0-9-]*\/$/u;

function withLeadingSlash(value) {
  return value.startsWith("/") ? value : `/${value}`;
}

function normalizedBasePath(value) {
  const base = withLeadingSlash(value || "/");
  return base.endsWith("/") ? base : `${base}/`;
}

function canonicalPath(location, basePath = "/") {
  const pathname = withLeadingSlash(location.pathname || "/");
  const base = normalizedBasePath(basePath);
  if (base === "/") return pathname;
  if (pathname === base.slice(0, -1)) return "/";
  return pathname.startsWith(base)
    ? withLeadingSlash(pathname.slice(base.length))
    : pathname;
}

function availabilityRecord(entry, index) {
  if (
    entry === null
    || typeof entry !== "object"
    || Array.isArray(entry)
    || typeof entry.language !== "string"
    || entry.language === "en"
    || !isOfficialEuLanguageCode(entry.language)
    || typeof entry.sourceRoute !== "string"
    || typeof entry.route !== "string"
  ) {
    throw new Error(`Translation availability record ${index} is malformed.`);
  }
  const sourceRoute = withLeadingSlash(entry.sourceRoute);
  const route = withLeadingSlash(entry.route);
  if (
    !publicationRoutePattern.test(sourceRoute)
    || route !== `/${entry.language}${sourceRoute}`
  ) {
    throw new Error(`Translation availability record ${index} has unsafe routes.`);
  }
  return Object.freeze({ language: entry.language, sourceRoute, route });
}

function availabilityRecords(documents) {
  if (!Array.isArray(documents) || documents.length > maximumTranslationDocuments) {
    throw new Error(
      `Translation availability requires at most ${maximumTranslationDocuments} records.`,
    );
  }
  const identities = new Set();
  const routes = new Set();
  return documents.map((entry, index) => {
    const record = availabilityRecord(entry, index);
    const identity = `${record.language}:${record.sourceRoute}`;
    if (identities.has(identity) || routes.has(record.route)) {
      throw new Error(`Translation availability repeats ${identity}.`);
    }
    identities.add(identity);
    routes.add(record.route);
    return record;
  });
}

export function languageAvailabilityForRoute(route, documents = translationManifest.documents) {
  const currentRoute = withLeadingSlash(route || "/");
  const records = availabilityRecords(documents);
  const currentTranslation = records.find((entry) => entry.route === currentRoute) ?? null;
  const sourceRoute = currentTranslation?.sourceRoute ?? currentRoute;
  const translations = new Map(
    records
      .filter((entry) => entry.sourceRoute === sourceRoute)
      .map((entry) => [entry.language, entry]),
  );
  const currentLanguage = currentTranslation?.language ?? "en";
  const available = officialEuLanguages
    .filter(([code]) => code === "en" || translations.has(code))
    .map(([code, label]) => Object.freeze({
      code,
      label,
      route: code === "en" ? sourceRoute : translations.get(code).route,
      current: code === currentLanguage,
    }));
  const unavailable = officialEuLanguages
    .filter(([code]) => code !== "en" && !translations.has(code))
    .map(([code, label]) => Object.freeze({ code, label }));
  return Object.freeze({
    currentLanguage,
    sourceRoute,
    available: Object.freeze(available),
    unavailable: Object.freeze(unavailable),
  });
}

export function languageAvailability(location, { documents, basePath = "/" } = {}) {
  return languageAvailabilityForRoute(
    canonicalPath(location, basePath),
    documents ?? translationManifest.documents,
  );
}

export function languageAlternateLinksForRoute(
  route,
  documents = translationManifest.documents,
) {
  const availability = languageAvailabilityForRoute(route, documents);
  if (availability.available.length < 2) return Object.freeze([]);
  return Object.freeze(availability.available.map((destination) => Object.freeze({
    language: destination.code,
    href: new URL(destination.route, canonicalPublicOrigin).toString(),
  })));
}

export function languageDestinationUrl(language, location, options = {}) {
  const availability = languageAvailability(location, options);
  const destination = availability.available.find((entry) => entry.code === language);
  if (!destination || destination.current) return null;
  const base = normalizedBasePath(options.basePath ?? "/");
  const route = `${base}${destination.route.replace(/^\/+/, "")}`;
  const url = new URL(route, canonicalPublicOrigin);
  url.hash = location.hash || "";
  return `${url.pathname}${url.search}${url.hash}`;
}

export function reviewedTranslationUrl(language, location, options = {}) {
  if (language === "en") return null;
  return languageDestinationUrl(language, location, options);
}

export function translationContributionUrl(location, options = {}) {
  const availability = languageAvailability(location, options);
  return repositoryIssueUrl(
    "translation-problem.yml",
    `[Translation] ${availability.sourceRoute}`,
    {
      source: `${new URL(availability.sourceRoute, canonicalPublicOrigin)} at commit or release:`,
    },
  );
}

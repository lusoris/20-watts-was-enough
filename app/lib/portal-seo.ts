import { languageAlternateLinksForRoute } from "./language-access.mjs";
import { publication } from "./publication.mjs";

const canonicalSite = publication.canonicalSite;
const projectImage = `${canonicalSite}${publication.imagePath}`;
const proseLicense = publication.proseLicense;
const siteName = publication.siteName;
const portalDescription = publication.portalDescription;

type PortalSeoDocument = {
  title: string;
  description: string;
  route: string;
  words: number;
};

export function portalSeoDescriptor(
  metadata: PortalSeoDocument | null,
  translationDocuments?: Parameters<typeof languageAlternateLinksForRoute>[1],
) {
  if (metadata) {
    const canonical = `${canonicalSite}${metadata.route}`;
    return {
      canonical,
      languageAlternates: languageAlternateLinksForRoute(
        metadata.route,
        translationDocuments,
      ),
      title: `${metadata.title} — ${siteName}`,
      description: metadata.description,
      ogType: "article",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "@id": `${canonical}#article`,
        headline: metadata.title,
        description: metadata.description,
        url: canonical,
        mainEntityOfPage: canonical,
        isPartOf: { "@id": `${canonicalSite}#website` },
        inLanguage: "en",
        wordCount: metadata.words,
        license: proseLicense,
        isAccessibleForFree: true,
      },
    };
  }
  return {
    canonical: canonicalSite,
    languageAlternates: [],
    title: `${siteName} — Research Portal`,
    description: portalDescription,
    ogType: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${canonicalSite}#website`,
          name: siteName,
          url: canonicalSite,
          description: portalDescription,
          inLanguage: "en",
        },
        {
          "@type": "CollectionPage",
          "@id": `${canonicalSite}#webpage`,
          name: `${siteName} — Research Portal`,
          description: portalDescription,
          url: canonicalSite,
          isPartOf: { "@id": `${canonicalSite}#website` },
          inLanguage: "en",
        },
      ],
    },
  };
}

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  const head = window.document.head;
  const existing = [...head.querySelectorAll<HTMLMetaElement>("meta")]
    .find((element) => element.getAttribute(attribute) === key);
  const element = existing ?? window.document.createElement("meta");
  element.setAttribute(attribute, key);
  element.content = content;
  if (!existing) head.append(element);
}

function upsertCanonical(href: string) {
  const head = window.document.head;
  const existing = [...head.querySelectorAll<HTMLLinkElement>("link")]
    .find((element) => element.rel === "canonical");
  const element = existing ?? window.document.createElement("link");
  element.rel = "canonical";
  element.href = href;
  if (!existing) head.append(element);
}

function replaceLanguageAlternates(
  alternatives: readonly { language: string; href: string }[],
) {
  const head = window.document.head;
  for (const existing of head.querySelectorAll<HTMLLinkElement>(
    'link[rel="alternate"][hreflang][data-language-alternate]',
  )) {
    existing.remove();
  }
  for (const alternative of alternatives) {
    const element = window.document.createElement("link");
    element.rel = "alternate";
    element.hreflang = alternative.language;
    element.href = alternative.href;
    element.dataset.languageAlternate = "";
    head.append(element);
  }
}

function upsertStructuredData(value: object) {
  const head = window.document.head;
  const scripts = [...head.querySelectorAll<HTMLScriptElement>(
    'script[type="application/ld+json"]',
  )];
  const existing = scripts.find((element) => element.dataset.portalSeo !== undefined)
    ?? (scripts.length === 1 ? scripts[0] : undefined);
  const element = existing ?? window.document.createElement("script");
  element.type = "application/ld+json";
  element.dataset.portalSeo = "";
  element.textContent = JSON.stringify(value).replaceAll("<", "\\u003c");
  if (!existing) head.append(element);
}

export function synchronizePortalSeo(metadata: PortalSeoDocument | null) {
  if (typeof window === "undefined") return;
  const descriptor = portalSeoDescriptor(metadata);
  window.document.title = descriptor.title;
  for (const [attribute, key, content] of [
    ["name", "description", descriptor.description],
    ["name", "robots", "index,follow,max-image-preview:large"],
    ["property", "og:title", descriptor.title],
    ["property", "og:description", descriptor.description],
    ["property", "og:type", descriptor.ogType],
    ["property", "og:url", descriptor.canonical],
    ["property", "og:image", projectImage],
    ["property", "og:image:alt", publication.imageAlt],
    ["property", "og:site_name", siteName],
    ["property", "og:locale", "en_GB"],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", descriptor.title],
    ["name", "twitter:description", descriptor.description],
    ["name", "twitter:image", projectImage],
    ["name", "twitter:image:alt", publication.imageAlt],
  ] as const) {
    upsertMeta(attribute, key, content);
  }
  upsertCanonical(descriptor.canonical);
  replaceLanguageAlternates(descriptor.languageAlternates);
  upsertStructuredData(descriptor.structuredData);
}

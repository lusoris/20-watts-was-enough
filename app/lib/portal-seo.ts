const canonicalSite = "https://www.cordana.dev/";
const projectImage = `${canonicalSite}og-v2.jpg`;
const proseLicense = "https://creativecommons.org/licenses/by-sa/4.0/";
const siteName = "20 Watts Was Enough";
const portalDescription =
  "Explore the living concept, evidence, experiments and mathematics behind 20 Watts Was Enough: a biologically inspired R&D blueprint for sparse, grounded, continual, energy-efficient AI.";

type PortalSeoDocument = {
  title: string;
  description: string;
  route: string;
  words: number;
};

function pageDescriptor(metadata: PortalSeoDocument | null) {
  if (metadata) {
    const canonical = `${canonicalSite}${metadata.route}`;
    return {
      canonical,
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
  const descriptor = pageDescriptor(metadata);
  window.document.title = descriptor.title;
  for (const [attribute, key, content] of [
    ["name", "description", descriptor.description],
    ["name", "robots", "index,follow,max-image-preview:large"],
    ["property", "og:title", descriptor.title],
    ["property", "og:description", descriptor.description],
    ["property", "og:type", descriptor.ogType],
    ["property", "og:url", descriptor.canonical],
    ["property", "og:image", projectImage],
    ["property", "og:image:alt", "Biological branching, neural connectivity and computational structures joined in one system diagram."],
    ["property", "og:site_name", siteName],
    ["property", "og:locale", "en_GB"],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", descriptor.title],
    ["name", "twitter:description", descriptor.description],
    ["name", "twitter:image", projectImage],
    ["name", "twitter:image:alt", "Biological branching, neural connectivity and computational structures joined in one system diagram."],
  ] as const) {
    upsertMeta(attribute, key, content);
  }
  upsertCanonical(descriptor.canonical);
  upsertStructuredData(descriptor.structuredData);
}

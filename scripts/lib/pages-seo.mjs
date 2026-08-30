import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { openGraphLocaleForEuLanguage } from "../../app/lib/eu-languages.mjs";
import {
  publication,
  repositoryIssueUrl,
} from "../../app/lib/publication.mjs";

export const canonicalSite = publication.canonicalSite;
const siteName = publication.siteName;
const projectImage = `${canonicalSite}${publication.imagePath}`;
const proseLicense = publication.proseLicense;

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeXml(value) {
  return escapeAttribute(value).replaceAll("'", "&apos;");
}

function withBase(basePath, relative = "") {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${base}${relative.replace(/^\/+/, "")}`;
}

function canonicalFor(kind, document) {
  if (kind === "book") return `${canonicalSite}book/`;
  if (kind === "help") return `${canonicalSite}help/`;
  if (kind === "document") return `${canonicalSite}${document.route}`;
  return canonicalSite;
}

function pageMetadata(kind, document) {
  if (kind === "book") return {
    title: `${siteName} — Full Concept Book`,
    description: "The complete public reading edition of 20 Watts Was Enough: a biologically inspired R&D blueprint for sparse, grounded, continual, energy-efficient AI.",
    ogType: "book",
  };
  if (kind === "document") return {
    title: `${document.title} — ${siteName}`,
    description: document.description,
    ogType: "article",
  };
  if (kind === "help") return {
    title: `How to help — ${siteName}`,
    description: "Choose a bounded research, review, translation, experiment, documentation, or tooling contribution and see the evidence needed for review.",
    ogType: "website",
  };
  return {
    title: `${siteName} — Research Portal`,
    description: publication.portalDescription,
    ogType: "website",
  };
}

function pageLanguage(kind, document) {
  return kind === "document" && document?.language
    ? document.language
    : publication.htmlLanguage;
}

function structuredData(kind, document) {
  const canonical = canonicalFor(kind, document);
  const language = pageLanguage(kind, document);
  const metadata = pageMetadata(kind, document);
  if (kind === "document") return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${canonical}#article`,
    headline: document.title,
    description: document.description,
    url: canonical,
    mainEntityOfPage: canonical,
    isPartOf: { "@id": `${canonicalSite}#website` },
    inLanguage: language,
    wordCount: document.words,
    license: proseLicense,
    isAccessibleForFree: true,
  };
  if (kind === "book") return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${canonical}#book`,
    name: "20 Watts Was Enough",
    description: metadata.description,
    url: canonical,
    isPartOf: { "@id": `${canonicalSite}#website` },
    inLanguage: language,
    license: proseLicense,
    isAccessibleForFree: true,
  };
  if (kind === "help") return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    name: metadata.title,
    description: metadata.description,
    url: canonical,
    isPartOf: { "@id": `${canonicalSite}#website` },
    inLanguage: language,
    license: proseLicense,
    isAccessibleForFree: true,
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${canonicalSite}#website`,
        name: siteName,
        url: canonicalSite,
        description: metadata.description,
        inLanguage: language,
      },
      {
        "@type": "CollectionPage",
        "@id": `${canonicalSite}#webpage`,
        name: metadata.title,
        description: metadata.description,
        url: canonicalSite,
        isPartOf: { "@id": `${canonicalSite}#website` },
        inLanguage: language,
      },
    ],
  };
}

export function renderSeoHead(kind, document, basePath) {
  const canonical = canonicalFor(kind, document);
  const language = pageLanguage(kind, document);
  const openGraphLocale = openGraphLocaleForEuLanguage(language);
  if (openGraphLocale === null) {
    throw new Error(`No Open Graph locale is registered for page language: ${language}`);
  }
  const metadata = pageMetadata(kind, document);
  const jsonLd = JSON.stringify(structuredData(kind, document)).replaceAll("<", "\\u003c");
  return [
    `<meta name="description" content="${escapeAttribute(metadata.description)}" />`,
    '<meta name="robots" content="index,follow,max-image-preview:large" />',
    `<meta property="og:title" content="${escapeAttribute(metadata.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(metadata.description)}" />`,
    `<meta property="og:type" content="${metadata.ogType}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${projectImage}" />`,
    `<meta property="og:image:alt" content="${escapeAttribute(publication.imageAlt)}" />`,
    `<meta property="og:site_name" content="${siteName}" />`,
    `<meta property="og:locale" content="${openGraphLocale}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttribute(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(metadata.description)}" />`,
    `<meta name="twitter:image" content="${projectImage}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttribute(publication.imageAlt)}" />`,
    `<meta name="citation_title" content="${escapeAttribute(metadata.title)}" />`,
    '<meta name="citation_author" content="lusoris contributors" />',
    `<meta name="citation_public_url" content="${canonical}" />`,
    `<meta name="citation_language" content="${escapeAttribute(language)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="icon" href="${withBase(basePath, "favicon.svg")}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
    `<title>${escapeAttribute(metadata.title)}</title>`,
  ].join("\n    ");
}

function normalizePath(value) {
  const normalized = [];
  for (const part of value.replaceAll("\\", "/").split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") normalized.pop();
    else normalized.push(part);
  }
  return normalized.join("/");
}

function resolveInternal(href, currentPath) {
  if (/^(?:https?:|mailto:)/i.test(href)) return null;
  if (href.startsWith("#")) return { path: currentPath, hash: href.slice(1) };
  const [relativePath, hash = ""] = href.split("#", 2);
  const base = currentPath.slice(0, currentPath.lastIndexOf("/") + 1);
  return { path: normalizePath(`${base}${relativePath}`), hash };
}

function repositoryHref(path, hash) {
  return `${publication.repository}/blob/main/${path}${hash ? `#${encodeURIComponent(hash)}` : ""}`;
}

function markdownSourcePath(document) {
  return document.canonicalSourcePath ?? document.path;
}

function staticMarkdownComponents(document, documents, basePath) {
  const currentSourcePath = markdownSourcePath(document);
  const documentByPath = new Map(documents.map((entry) => [
    markdownSourcePath(entry),
    entry,
  ]));
  return {
    h1() { return null; },
    a({ node, href = "", children, ...props }) {
      void node;
      const internal = resolveInternal(href, currentSourcePath);
      if (!internal) return createElement("a", { href, ...props }, children);
      const target = documentByPath.get(internal.path);
      const fragment = internal.hash ? `#${encodeURIComponent(internal.hash)}` : "";
      const resolved = internal.path === currentSourcePath
        ? fragment || withBase(basePath, document.route)
        : target
        ? `${withBase(basePath, target.route)}${fragment}`
        : repositoryHref(internal.path, internal.hash);
      return createElement("a", { href: resolved, ...props }, children);
    },
    img({ node, src = "", alt = "", ...props }) {
      void node;
      const base = currentSourcePath.slice(0, currentSourcePath.lastIndexOf("/") + 1);
      const resolved = /^(?:https?:|data:)/i.test(src)
        ? src
        : normalizePath(`${base}${src}`).replace(/^public\//u, "");
      return createElement("img", {
        src: /^(?:https?:|data:)/i.test(resolved) ? resolved : withBase(basePath, resolved),
        alt,
        loading: "lazy",
        ...props,
      });
    },
    table({ node, ...props }) {
      void node;
      const projectTable = document.group === "Project"
        ? {
            role: "region",
            "aria-label": "Scrollable contribution table",
            tabIndex: 0,
          }
        : {};
      return createElement(
        "div",
        { className: "table-region", ...projectTable },
        createElement("table", props),
      );
    },
  };
}

function renderMarkdown(document, documents, basePath) {
  return renderToStaticMarkup(createElement(ReactMarkdown, {
    skipHtml: true,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, rehypeKatex],
    components: staticMarkdownComponents(document, documents, basePath),
  }, document.body));
}

function documentLink(document, basePath) {
  return `<a href="${withBase(basePath, document.route)}">${escapeAttribute(document.title)}</a>`;
}

function renderReaderSupport(basePath, identity, reportLabel, options = {}) {
  const issueUrl = options.issueUrl ?? repositoryIssueUrl(
    "site-documentation-problem.yml",
    `[Site/Docs] ${identity} @ main`,
  );
  const language = options.language ? ` lang="${escapeAttribute(options.language)}"` : "";
  return `<nav${language} aria-label="Reader support"><a href="${withBase(basePath, "help/")}">How to help</a><a href="${escapeAttribute(issueUrl)}">${escapeAttribute(reportLabel)}</a></nav>`;
}

function renderPrimaryNavigation(basePath, label) {
  const repository = publication.repository;
  return `<nav aria-label="${label}"><a href="${withBase(basePath)}">Overview</a><a href="${withBase(basePath, "#research-system")}">Research system</a><a href="${withBase(basePath, "#library")}">Library</a><a href="${withBase(basePath, "book/")}">Book</a><a href="${repository}">GitHub <span aria-hidden="true">↗</span></a></nav>`;
}

export function renderPortalFallback(documents, basePath) {
  const groups = ["Concept", "Mathematics"].map((group) => {
    const links = documents.filter((document) => document.group === group)
      .map((document) => `<li>${documentLink(document, basePath)}</li>`)
      .join("");
    return `<section><h2>${group}</h2><ol>${links}</ol></section>`;
  }).join("");
  return `<main class="seo-static-page"><p class="portal-eyebrow">Open research programme</p><h1>20 Watts Was Enough</h1><p>Evidence-led research into sparse, grounded, continual and energy-accountable artificial intelligence.</p>${renderReaderSupport(basePath, "research portal", "Report a portal problem")}<nav aria-label="Research library">${groups}</nav><p><a href="${withBase(basePath, "book/")}">Read the full concept book</a></p></main>`;
}

export function renderBookFallback(documents, basePath) {
  const links = documents.map((document) => `<li>${documentLink(document, basePath)}</li>`).join("");
  return `<main class="seo-static-page"><p><a href="${withBase(basePath)}">Research portal</a></p><h1>20 Watts Was Enough — Full Concept Book</h1><p>The complete public reading edition generated from canonical Git source.</p>${renderReaderSupport(basePath, "book/", "Report a book problem")}<nav aria-label="Book contents"><ol>${links}</ol></nav></main>`;
}

export function renderDocumentFallback(document, documents, basePath) {
  const index = documents.findIndex((candidate) => candidate.path === document.path);
  const previous = index > 0 ? documents[index - 1] : null;
  const next = index < documents.length - 1 ? documents[index + 1] : null;
  const translated = Boolean(
    document.language && document.language !== publication.htmlLanguage,
  );
  const shellLanguage = translated ? ` lang="${publication.htmlLanguage}"` : "";
  const titleLanguage = translated ? ` lang="${escapeAttribute(document.language)}"` : "";
  const sequence = [
    previous ? `<a rel="prev" href="${withBase(basePath, previous.route)}">← <span${titleLanguage}>${escapeAttribute(previous.title)}</span></a>` : "<span></span>",
    next ? `<a rel="next" href="${withBase(basePath, next.route)}"><span${titleLanguage}>${escapeAttribute(next.title)}</span> →</a>` : "<span></span>",
  ].join("");
  const report = translated
    ? repositoryIssueUrl(
        "translation-problem.yml",
        `[Translation] ${document.language}: ${document.canonicalSourcePath}`,
        {
          language: document.language,
          source: `${document.canonicalSourcePath} at source SHA-256 ${document.sourceSha256}`,
          detail: `Published route: ${canonicalSite}${document.route}\nReviewed target SHA-256: ${document.targetSha256}`,
          competence: `Recorded reviewer(s): ${document.reviewers.join(", ")}`,
        },
      )
    : null;
  const support = renderReaderSupport(
    basePath,
    document.path,
    translated ? "Report this translation" : "Report this document",
    translated ? { issueUrl: report, language: publication.htmlLanguage } : {},
  );
  return `<main class="seo-static-page"><p${shellLanguage}><a href="${withBase(basePath)}">Research portal</a></p><header><p${shellLanguage}>${document.group} · ${document.words.toLocaleString(publication.locale)} words</p><h1>${escapeAttribute(document.title)}</h1><p>${escapeAttribute(document.description)}</p></header>${support}<article class="prose markdown-body">${renderMarkdown(document, documents, basePath)}</article><nav${shellLanguage} aria-label="Document sequence">${sequence}</nav></main>`;
}

export function renderHelpFallback(document, documents, basePath) {
  const repository = publication.repository;
  const mobileNavigation = `<details class="portal-mobile-menu"><summary>Menu</summary>${renderPrimaryNavigation(basePath, "Mobile navigation")}</details>`;
  return `<div class="portal-shell help-page"><a class="portal-skip-link" href="#help-content">Skip to contribution map</a><header class="portal-header"><a class="portal-wordmark" href="${withBase(basePath)}"><span aria-hidden="true">20W</span><strong>${siteName}</strong></a>${renderPrimaryNavigation(basePath, "Primary navigation")}${mobileNavigation}</header><main id="help-content" class="help-main"><header class="help-intro"><p class="portal-eyebrow">Contribution map · generated from canonical Git source</p><h1>Help one bounded part move forward</h1><p>Pick a workstream, preserve its authority boundary, and attach the evidence another contributor needs to review or rerun the work.</p><nav aria-label="Contribution actions"><a class="portal-action portal-action-primary" href="#current-workstreams">Choose a workstream</a><a class="portal-action portal-action-secondary" href="${repository}/blob/main/${document.path}">View source <span aria-hidden="true">↗</span></a></nav></header><article class="prose portal-prose help-prose">${renderMarkdown(document, documents, basePath)}</article></main><footer class="portal-footer"><div><strong>${siteName}</strong><p>Canonical public research source. European Union and German normative context by default.</p></div><nav aria-label="Project links"><a href="${repository}">Repository</a><a href="${repository}/blob/main/research/references.bib">Bibliography</a><a href="${withBase(basePath, "LICENSING.md")}">Licensing</a><a href="${withBase(basePath, "book/")}">Full book</a><a href="${repository}/issues/new/choose">Report or propose</a></nav></footer></div>`;
}

export function renderSitemap(documents) {
  const locations = [canonicalSite, `${canonicalSite}book/`, `${canonicalSite}help/`, ...documents.map(
    (document) => `${canonicalSite}${document.route}`,
  )];
  const urls = locations.map((location) => `  <url><loc>${escapeXml(location)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${canonicalSite}sitemap.xml\n`;
}

export function populateSeoTemplate(source, head, fallback) {
  const headPattern = /<!-- pages-seo:head -->[\s\S]*?<!-- \/pages-seo:head -->/u;
  const fallbackPattern = /<!-- pages-seo:fallback -->[\s\S]*?<!-- \/pages-seo:fallback -->/u;
  if (!headPattern.test(source) || !fallbackPattern.test(source)) {
    throw new Error("Pages HTML template is missing an SEO generation marker.");
  }
  return source
    .replace(headPattern, `<!-- pages-seo:head -->\n    ${head}\n    <!-- /pages-seo:head -->`)
    .replace(fallbackPattern, `<!-- pages-seo:fallback -->${fallback}<!-- /pages-seo:fallback -->`);
}

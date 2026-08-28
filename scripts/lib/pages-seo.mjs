import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export const canonicalSite = "https://www.cordana.dev/";
const siteName = "20 Watts Was Enough";
const projectImage = `${canonicalSite}og-v2.jpg`;
const proseLicense = "https://creativecommons.org/licenses/by-sa/4.0/";

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
  return {
    title: `${siteName} — Research Portal`,
    description: "Explore the living concept, evidence, experiments and mathematics behind 20 Watts Was Enough: a biologically inspired R&D blueprint for sparse, grounded, continual, energy-efficient AI.",
    ogType: "website",
  };
}

function structuredData(kind, document) {
  const canonical = canonicalFor(kind, document);
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
    inLanguage: "en",
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
    inLanguage: "en",
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
        inLanguage: "en",
      },
      {
        "@type": "CollectionPage",
        "@id": `${canonicalSite}#webpage`,
        name: metadata.title,
        description: metadata.description,
        url: canonicalSite,
        isPartOf: { "@id": `${canonicalSite}#website` },
        inLanguage: "en",
      },
    ],
  };
}

export function renderSeoHead(kind, document, basePath) {
  const canonical = canonicalFor(kind, document);
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
    '<meta property="og:image:alt" content="Biological branching, neural connectivity and computational structures joined in one system diagram." />',
    `<meta property="og:site_name" content="${siteName}" />`,
    '<meta property="og:locale" content="en_GB" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttribute(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(metadata.description)}" />`,
    `<meta name="twitter:image" content="${projectImage}" />`,
    '<meta name="twitter:image:alt" content="Biological branching, neural connectivity and computational structures joined in one system diagram." />',
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
  return `https://github.com/lusoris/20-watts-was-enough/blob/main/${path}${hash ? `#${encodeURIComponent(hash)}` : ""}`;
}

function staticMarkdownComponents(document, documents, basePath) {
  const documentByPath = new Map(documents.map((entry) => [entry.path, entry]));
  return {
    h1() { return null; },
    a({ node, href = "", children, ...props }) {
      void node;
      const internal = resolveInternal(href, document.path);
      if (!internal) return createElement("a", { href, ...props }, children);
      const target = documentByPath.get(internal.path);
      const fragment = internal.hash ? `#${encodeURIComponent(internal.hash)}` : "";
      const resolved = target
        ? `${withBase(basePath, target.route)}${fragment}`
        : repositoryHref(internal.path, internal.hash);
      return createElement("a", { href: resolved, ...props }, children);
    },
    img({ node, src = "", alt = "", ...props }) {
      void node;
      const base = document.path.slice(0, document.path.lastIndexOf("/") + 1);
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
      return createElement("div", { className: "table-region" }, createElement("table", props));
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

export function renderPortalFallback(documents, basePath) {
  const groups = ["Concept", "Mathematics"].map((group) => {
    const links = documents.filter((document) => document.group === group)
      .map((document) => `<li>${documentLink(document, basePath)}</li>`)
      .join("");
    return `<section><h2>${group}</h2><ol>${links}</ol></section>`;
  }).join("");
  return `<main class="seo-static-page"><p class="portal-eyebrow">Open research programme</p><h1>20 Watts Was Enough</h1><p>Evidence-led research into sparse, grounded, continual and energy-accountable artificial intelligence.</p><nav aria-label="Research library">${groups}</nav><p><a href="${withBase(basePath, "book/")}">Read the full concept book</a></p></main>`;
}

export function renderBookFallback(documents, basePath) {
  const links = documents.map((document) => `<li>${documentLink(document, basePath)}</li>`).join("");
  return `<main class="seo-static-page"><p><a href="${withBase(basePath)}">Research portal</a></p><h1>20 Watts Was Enough — Full Concept Book</h1><p>The complete public reading edition generated from canonical Git source.</p><nav aria-label="Book contents"><ol>${links}</ol></nav></main>`;
}

export function renderDocumentFallback(document, documents, basePath) {
  const index = documents.findIndex((candidate) => candidate.path === document.path);
  const previous = index > 0 ? documents[index - 1] : null;
  const next = index < documents.length - 1 ? documents[index + 1] : null;
  const sequence = [
    previous ? `<a rel="prev" href="${withBase(basePath, previous.route)}">← ${escapeAttribute(previous.title)}</a>` : "<span></span>",
    next ? `<a rel="next" href="${withBase(basePath, next.route)}">${escapeAttribute(next.title)} →</a>` : "<span></span>",
  ].join("");
  return `<main class="seo-static-page"><p><a href="${withBase(basePath)}">Research portal</a></p><header><p>${document.group} · ${document.words.toLocaleString("en-GB")} words</p><h1>${escapeAttribute(document.title)}</h1><p>${escapeAttribute(document.description)}</p></header><article class="prose markdown-body">${renderMarkdown(document, documents, basePath)}</article><nav aria-label="Document sequence">${sequence}</nav></main>`;
}

export function renderSitemap(documents) {
  const locations = [canonicalSite, `${canonicalSite}book/`, ...documents.map(
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

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  bookDocumentHeadingId,
  bookDocumentId,
} from "../../app/lib/book-document-id.mjs";
import {
  bookEditionIdentity,
  repositoryDocumentHref,
  repositoryTreeHref,
} from "../../app/lib/book-release-identity.mjs";
import { openGraphLocaleForEuLanguage } from "../../app/lib/eu-languages.mjs";
import {
  languageAlternateLinksForRoute,
  languageAvailabilityForRoute,
  translationContributionUrl,
} from "../../app/lib/language-access.mjs";
import {
  issueFormLocator,
  publication,
  repositoryIssueUrl,
} from "../../app/lib/publication.mjs";
import { researchObjectIdentity } from "../../app/lib/research-object.mjs";
import { validateTranslationReviewMetadata } from "./translation-manifest.mjs";

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

export function renderSeoHead(kind, document, basePath, translationDocuments = []) {
  const canonical = canonicalFor(kind, document);
  const language = pageLanguage(kind, document);
  const openGraphLocale = openGraphLocaleForEuLanguage(language);
  if (openGraphLocale === null) {
    throw new Error(`No Open Graph locale is registered for page language: ${language}`);
  }
  const metadata = pageMetadata(kind, document);
  const jsonLd = JSON.stringify(structuredData(kind, document)).replaceAll("<", "\\u003c");
  const languageAlternates = kind === "document"
    ? languageAlternateLinksForRoute(document.route, translationDocuments).map(
        (alternative) => (
          `<link rel="alternate" hreflang="${escapeAttribute(alternative.language)}" href="${escapeAttribute(alternative.href)}" data-language-alternate="" />`
        ),
      )
    : [];
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
    ...languageAlternates,
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

function shiftedStaticHeading(level, offset, documentPath = null) {
  const shiftedLevel = Math.min(6, Math.max(1, level + offset));
  const tag = `h${shiftedLevel}`;
  // ReactMarkdown owns this server-only component contract; it is not a public React prop surface.
  // eslint-disable-next-line react/prop-types
  return function ShiftedStaticHeading({ node, id, ...props }) {
    void node;
    return createElement(tag, {
      ...props,
      id: documentPath && id ? bookDocumentHeadingId(documentPath, id) : id,
    });
  };
}

function staticMarkdownComponents(
  document,
  documents,
  basePath,
  { bookFragments = false, headingOffset = 0 } = {},
) {
  const currentSourcePath = markdownSourcePath(document);
  const documentByPath = new Map(documents.map((entry) => [
    markdownSourcePath(entry),
    entry,
  ]));
  const headingComponents = headingOffset === 0
    ? {}
    : {
        h2: shiftedStaticHeading(2, headingOffset, bookFragments ? currentSourcePath : null),
        h3: shiftedStaticHeading(3, headingOffset, bookFragments ? currentSourcePath : null),
        h4: shiftedStaticHeading(4, headingOffset, bookFragments ? currentSourcePath : null),
        h5: shiftedStaticHeading(5, headingOffset, bookFragments ? currentSourcePath : null),
        h6: shiftedStaticHeading(6, headingOffset, bookFragments ? currentSourcePath : null),
      };
  return {
    ...headingComponents,
    h1() { return null; },
    a({ node, href = "", children, ...props }) {
      void node;
      const internal = resolveInternal(href, currentSourcePath);
      if (!internal) return createElement("a", { href, ...props }, children);
      const target = documentByPath.get(internal.path);
      if (bookFragments && target) {
        const resolved = internal.hash
          ? `#${bookDocumentHeadingId(internal.path, internal.hash)}`
          : `#${bookDocumentId(internal.path)}`;
        return createElement("a", { href: resolved, ...props }, children);
      }
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
      const keyboardTable = bookFragments
        ? {
            role: "region",
            "aria-label": `Data table in ${document.title}; use arrow keys to scroll when needed`,
            tabIndex: 0,
          }
        : document.group === "Project"
          ? {
              role: "region",
              "aria-label": "Scrollable contribution table",
              tabIndex: 0,
            }
          : {};
      return createElement(
        "div",
        { className: "table-region", ...keyboardTable },
        createElement("table", props),
      );
    },
  };
}

function renderMarkdown(document, documents, basePath, options = {}) {
  const katexPlugin = options.mathOutput
    ? [rehypeKatex, { output: options.mathOutput }]
    : rehypeKatex;
  return renderToStaticMarkup(createElement(ReactMarkdown, {
    skipHtml: true,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, katexPlugin],
    components: staticMarkdownComponents(document, documents, basePath, options),
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

export function renderTranslationReviewContext(document) {
  const review = validateTranslationReviewMetadata(
    document,
    document.path ?? document.route ?? "translated document",
  );
  const source = repositoryDocumentHref(
    review.sourceRevision,
    document.canonicalSourcePath,
  );
  const revision = review.sourceRevision.match(/.{1,8}/gu)?.join("<wbr>")
    ?? review.sourceRevision;
  return `<section class="translation-review-context" lang="en" aria-labelledby="translation-review-context-heading"><h2 id="translation-review-context-heading">Translation review</h2><dl><div><dt>Canonical source</dt><dd><a href="${escapeAttribute(source)}">Open the bound source</a></dd></div><div><dt>Source revision</dt><dd><code>${revision}</code></dd></div><div><dt>Reviewed at</dt><dd><time datetime="${escapeAttribute(review.reviewedAt)}">${escapeAttribute(review.reviewedAt)}</time></dd></div></dl></section>`;
}

export function renderLanguageAvailability(route, translationDocuments, basePath) {
  const availability = languageAvailabilityForRoute(route, translationDocuments);
  const destinations = availability.available.map((destination) => {
    const language = escapeAttribute(destination.code);
    const label = escapeAttribute(destination.label);
    if (destination.current) {
      return `<li><span aria-current="page"><span lang="${language}">${label}</span> · current</span></li>`;
    }
    return `<li><a lang="${language}" hreflang="${language}" href="${withBase(basePath, destination.route)}">${label}</a></li>`;
  }).join("");
  const contribution = translationContributionUrl(
    { pathname: route, hash: "" },
    { documents: translationDocuments },
  );
  return `<nav class="seo-language-access" lang="en" aria-label="Language availability"><strong>Read this page</strong><ul>${destinations}</ul><a href="${escapeAttribute(contribution)}">Help add or review a language</a></nav>`;
}

export function renderPortalFallback(documents, basePath, translationDocuments = []) {
  const groups = ["Concept", "Mathematics"].map((group) => {
    const links = documents.filter((document) => document.group === group)
      .map((document) => `<li>${documentLink(document, basePath)}</li>`)
      .join("");
    return `<section><h2>${group}</h2><ol>${links}</ol></section>`;
  }).join("");
  const languages = renderLanguageAvailability("/", translationDocuments, basePath);
  return `<main class="seo-static-page"><p class="portal-eyebrow">Open research programme</p><h1>20 Watts Was Enough</h1><p>Can an artificial system learn and adapt while activating less computation and moving less data? This programme turns mechanisms from living and engineered systems into scoped claims, explicit principles and equal-budget tests.</p>${languages}${renderReaderSupport(basePath, "research portal", "Report a portal problem")}<nav aria-label="Research library">${groups}</nav><p><a href="${withBase(basePath, "book/")}">Read the full concept book</a></p></main>`;
}

export function renderBookFallback(documents, basePath, options = {}) {
  if (!Array.isArray(documents) || documents.length === 0) {
    throw new Error("The static book fallback requires at least one canonical document.");
  }
  const normalizedOptions = Array.isArray(options)
    ? { translationDocuments: options }
    : options;
  const translationDocuments = normalizedOptions.translationDocuments ?? [];
  const identity = bookEditionIdentity({
    surface: "github-pages",
    sourceRef: "main",
    editionVersion: normalizedOptions.editionVersion,
    sourceRevision: normalizedOptions.sourceRevision,
  });
  const locator = issueFormLocator([
    `Public route: ${new URL(publication.bookPath, canonicalSite).toString()}`,
    `Edition: ${identity.edition}`,
    ...(identity.sourceRevision ? [`Source revision: ${identity.sourceRevision}`] : []),
  ]);
  const issueUrl = repositoryIssueUrl(
    "site-documentation-problem.yml",
    `[Site/Docs] book/ @ ${identity.sourceRevision?.slice(0, 12) ?? identity.repositoryRef}`,
    { location: locator },
  );
  const revision = identity.sourceRevision
    ? `<div><dt>Source revision</dt><dd><code>${identity.sourceRevision}</code></dd></div>`
    : "";
  const links = documents.map((document) => (
    `<li><a href="#${bookDocumentId(document.path)}">${escapeAttribute(document.title)}</a></li>`
  )).join("");
  const manuscript = documents.map((document) => (
    `<section id="${bookDocumentId(document.path)}"><header><p>${escapeAttribute(document.group)} · ${document.words.toLocaleString(publication.locale)} words</p><h2>${escapeAttribute(document.title)}</h2></header><article class="prose markdown-body">${renderMarkdown(document, documents, basePath, { bookFragments: true, headingOffset: 1, mathOutput: "mathml" })}</article></section>`
  )).join("");
  const languages = renderLanguageAvailability("/book/", translationDocuments, basePath);
  return `<main class="seo-static-page"><a class="portal-skip-link" href="#${bookDocumentId(documents[0].path)}">Skip to first chapter</a><p><a href="${withBase(basePath)}">Research portal</a></p><h1>20 Watts Was Enough — Full Concept Book</h1><p>The complete public reading edition generated from canonical Git source.</p>${languages}<dl aria-label="Book edition identity"><div><dt>Edition</dt><dd>${escapeAttribute(identity.edition)}</dd></div>${revision}<div><dt>Source</dt><dd><a href="${escapeAttribute(repositoryTreeHref(identity.repositoryLinkRef))}">${escapeAttribute(identity.sourceLabel)}</a></dd></div></dl><nav aria-label="Book publication routes"><a href="${withBase(basePath, publication.bookPath)}">Book</a><a href="${withBase(basePath, publication.bookPdfPath)}">PDF</a></nav>${renderReaderSupport(basePath, "book/", "Report a book problem", { issueUrl })}<nav aria-label="Book contents"><ol>${links}</ol></nav>${manuscript}</main>`;
}

function renderResearchObjectHeader(identity, words) {
  const revision = identity.sourceRevision
    ? `<div><dt>Source revision</dt><dd><code>${escapeAttribute(identity.sourceRevision)}</code></dd></div>`
    : "";
  const evidence = identity.evidenceRoutes.length
    ? [
        '<details class="research-object-evidence">',
        `<summary><span>Mapped records</span><b>${escapeAttribute(identity.evidenceSummary)}</b></summary>`,
        `<p>${escapeAttribute(identity.evidenceCaveat)}</p>`,
        "<div>",
        ...[
          ["claim", "Claims"],
          ["principle", "Principles"],
          ["audit", "Audits"],
          ["experiment", "Experiments"],
        ].flatMap(([kind, label]) => {
          const routes = identity.evidenceRoutes.filter((route) => route.kind === kind);
          if (!routes.length) return [];
          const links = routes.map((route) => {
            const locator = `${route.sourcePath}${route.fragment ? `#${route.fragment}` : ""}`;
            return `<a href="${escapeAttribute(route.href)}" aria-label="Mapped ${route.kind}: ${escapeAttribute(locator)}" title="${escapeAttribute(locator)}">${escapeAttribute(route.label)}</a>`;
          }).join("");
          return `<nav aria-label="Mapped ${label.toLowerCase()}"><strong>${label}</strong><span>${links}</span></nav>`;
        }),
        "</div>",
        "</details>",
      ].join("")
    : "";
  const disclosure = identity.disclosureHref
    ? `<a href="${escapeAttribute(identity.disclosureHref)}">Disclosure</a>`
    : "";
  return [
    '<header class="research-object-header" data-research-object="focused-document">',
    `<p class="research-object-kicker">${escapeAttribute(identity.type)}</p>`,
    `<h1>${escapeAttribute(identity.title)}</h1>`,
    `<p class="research-object-path"><code>${escapeAttribute(identity.sourcePath)}</code></p>`,
    '<dl aria-label="Research object identity">',
    `<div><dt>Edition</dt><dd>${escapeAttribute(identity.edition)}</dd></div>`,
    revision,
    `<div><dt>Extent</dt><dd>${words.toLocaleString(publication.locale)} words</dd></div>`,
    `<div><dt>Public route</dt><dd><a href="${escapeAttribute(identity.publicUrl)}">${escapeAttribute(identity.publicUrl)}</a></dd></div>`,
    "</dl>",
    evidence,
    '<div class="research-object-routes">',
    '<nav aria-label="Research object records">',
    `<a href="${escapeAttribute(identity.sourceHref)}">Source</a>`,
    `<a href="${escapeAttribute(identity.historyHref)}">History</a>`,
    `<a href="${escapeAttribute(identity.bookHref)}">Book</a>`,
    `<a href="${escapeAttribute(identity.pdfHref)}">PDF</a>`,
    `<a href="${escapeAttribute(identity.citationHref)}">Cite</a>`,
    `<a href="${escapeAttribute(identity.licenceHref)}">Licence</a>`,
    disclosure,
    "</nav>",
    '<nav aria-label="Research object feedback">',
    `<a href="${escapeAttribute(identity.clarityReportHref)}">Report clarity</a>`,
    `<a href="${escapeAttribute(identity.evidenceCorrectionHref)}">Correct evidence</a>`,
    "</nav>",
    "</div>",
    "</header>",
  ].join("");
}

export function renderDocumentFallback(document, documents, basePath, options = {}) {
  const normalizedOptions = Array.isArray(options)
    ? { translationDocuments: options }
    : options;
  const translationDocuments = normalizedOptions.translationDocuments ?? [];
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
          source: `${document.canonicalSourcePath} at commit ${document.sourceRevision} (source SHA-256 ${document.sourceSha256})`,
          detail: `Published route: ${canonicalSite}${document.route}\nReviewed at: ${document.reviewedAt}\nReviewed target SHA-256: ${document.targetSha256}`,
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
  const languages = renderLanguageAvailability(
    document.route.startsWith("/") ? document.route : `/${document.route}`,
    translationDocuments,
    basePath,
  );
  const reviewContext = translated ? renderTranslationReviewContext(document) : "";
  const researchObject = !translated && normalizedOptions.editionVersion
    ? researchObjectIdentity({
        title: document.title,
        path: document.path,
        route: document.route,
        group: document.group,
        editionVersion: normalizedOptions.editionVersion,
        sourceRevision: normalizedOptions.sourceRevision,
        evidenceRecords: document.evidenceRecords,
        basePath,
      })
    : null;
  const header = researchObject
    ? renderResearchObjectHeader(researchObject, document.words)
    : `<header><p${shellLanguage}>${document.group} · ${document.words.toLocaleString(publication.locale)} words</p><h1>${escapeAttribute(document.title)}</h1><p>${escapeAttribute(document.description)}</p></header>`;
  const readerSupport = researchObject ? "" : support;
  return `<main class="seo-static-page"><p${shellLanguage}><a href="${withBase(basePath)}">Research portal</a></p>${header}${reviewContext}${languages}${readerSupport}<article class="prose markdown-body">${renderMarkdown(document, documents, basePath)}</article><nav${shellLanguage} aria-label="Document sequence">${sequence}</nav></main>`;
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

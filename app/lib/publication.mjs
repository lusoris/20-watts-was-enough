export const publication = Object.freeze({
  canonicalSite: "https://www.cordana.dev/",
  repository: "https://github.com/lusoris/20-watts-was-enough",
  siteName: "20 Watts Was Enough",
  locale: "en-GB",
  htmlLanguage: "en",
  proseLicense: "https://creativecommons.org/licenses/by-sa/4.0/",
  imagePath: "og-v2.jpg",
  imageAlt: "Biological branching, neural connectivity and computational structures joined in one system diagram.",
  portalDescription: "Explore the living concept, evidence, experiments and mathematics behind 20 Watts Was Enough: a biologically inspired R&D blueprint for sparse, grounded, continual, energy-efficient AI.",
});

export function repositoryIssueUrl(template, title, fields = {}) {
  const issue = new URL(`${publication.repository}/issues/new`);
  issue.searchParams.set("template", template);
  issue.searchParams.set("title", title);
  for (const [field, value] of Object.entries(fields)) {
    issue.searchParams.set(field, value);
  }
  return issue.toString();
}

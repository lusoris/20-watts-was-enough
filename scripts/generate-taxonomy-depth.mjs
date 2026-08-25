import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const inventoryPath = path.join(root, "research", "taxonomies", "fine-grained-fields.json");
const coveragePath = path.join(root, "research", "field-coverage.json");
const routingPath = path.join(root, "research", "taxonomies", "fine-grained-routing.json");
const outputPath = path.join(root, "research", "taxonomies", "field-depth.md");
const checkOnly = process.argv.includes("--check");

const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const coverage = JSON.parse(await readFile(coveragePath, "utf8"));
const routing = JSON.parse(await readFile(routingPath, "utf8"));

const dfgCoverage = new Map(coverage.dfgReviewBoards.map((board) => [board.code, board]));
const anzsrcCoverage = new Map(coverage.anzsrcDivisions.map((division) => [division.code, division]));
const childRoutes = new Map(
  routing.assignments.map((assignment) => [`${assignment.level}:${assignment.code}`, assignment]),
);
const stateLabel = {
  dedicated: "dedicated parent-level audit",
  adjacent: "adjacent parent-level evidence",
  unreviewed: "unreviewed at parent level",
};

function auditLink(audit) {
  const label = path.basename(audit, ".md").replace(/^\d{4}-\d{2}-\d{2}-/, "").replaceAll("-", " ");
  return `[${label}](../audits/${path.basename(audit)})`;
}

function parentRoute(parent) {
  const links = parent.audits.map(auditLink);
  if (links.length === 0) return `**Parent route:** ${stateLabel[parent.state]}.`;
  return `**Parent route:** ${stateLabel[parent.state]} via ${links.join(", ")}.`;
}

function childRoute(level, code) {
  return childRoutes.get(`${level}:${code}`);
}

function childRouteText(route) {
  if (!route) return "Routing: unassigned.";
  const audits = route.audits.map(auditLink).join(", ");
  const claims = route.claims.length > 0
    ? ` Claims: ${route.claims.map((claim) => `[${claim}](../claims.md#${claim.toLowerCase()})`).join(", ")}.`
    : "";
  return `Routing: ${route.state} child-level evidence via ${audits}.${claims}`;
}

const lines = [
  "# Fine-grained field-depth inventory",
  "",
  `**Inventory date:** ${inventory.asOf}`,
  "",
  "This page turns the repository's whole-science taxonomies into a searchable",
  "routing surface. It records **1,064 EU EuroSciVoc concepts**, **214 DFG subjects**,",
  "**213 ANZSRC groups**, and",
  `**${inventory.anzsrc.fields.length.toLocaleString("en-US")} ANZSRC fields**. The machine-readable source is`,
  "[`fine-grained-fields.json`](fine-grained-fields.json).",
  "",
  "> A parent label does not propagate to its children. Every child below remains",
  "> **unassigned at fine-grained resolution** until a dedicated mapping records",
  "> the audit, evidence boundary, deduplication result, and next falsification test.",
  "",
  "EuroSciVoc is the EU-level multilingual science vocabulary. The DFG hierarchy",
  "adds German review granularity. ANZSRC is an independent omission detector,",
  "not the normative framework for the project.",
  "",
  `**Explicit child routes recorded:** ${routing.assignments.length}. All other children are unassigned.`,
  "",
];

lines.push(
  "## EuroSciVoc 1.6: European science vocabulary",
  "",
  "EuroSciVoc is maintained by the Publications Office of the European Union and",
  "extends the OECD Fields of Research and Development hierarchy with established",
  "and emerging fields found in CORDIS research content. English and German labels",
  "are retained below; neither a label nor a parent route counts as evidence review.",
  "",
);

const euroConcepts = inventory.euroscivoc.concepts;
const euroByParent = new Map();
for (const concept of euroConcepts) {
  const parent = concept.broader ?? "__root__";
  const siblings = euroByParent.get(parent) ?? [];
  siblings.push(concept);
  euroByParent.set(parent, siblings);
}
for (const siblings of euroByParent.values()) {
  siblings.sort((left, right) => left.name.localeCompare(right.name, "en"));
}

function euroDescendants(concept, result = []) {
  for (const child of euroByParent.get(concept.id) ?? []) {
    result.push(child);
    euroDescendants(child, result);
  }
  return result;
}

for (const top of euroByParent.get("__root__") ?? []) {
  const descendants = euroDescendants(top);
  const routed = [top, ...descendants].filter((concept) =>
    childRoute("euroscivoc-concept", concept.id),
  );
  lines.push(
    `### ${top.name}`,
    "",
    `**Deutsch:** ${top.nameDe}. **Fine-grained status:** ${routed.length} of ${descendants.length + 1} concepts in this branch have an explicit routing assignment.`,
    "",
    `- **${top.name}.** ${childRouteText(childRoute("euroscivoc-concept", top.id))}`,
  );
  for (const concept of descendants) {
    const indent = "  ".repeat(Math.max(1, concept.depth));
    const german = concept.nameDe.toLocaleLowerCase("de") === concept.name.toLocaleLowerCase("en")
      ? ""
      : ` Deutsch: ${concept.nameDe}.`;
    lines.push(
      `${indent}- **${concept.name}.**${german} ${childRouteText(childRoute("euroscivoc-concept", concept.id))}`,
    );
  }
  lines.push("");
}

lines.push(
  "## DFG 2024--2028: review boards and subjects",
  "",
);

for (const board of inventory.dfg.reviewBoards) {
  const parent = dfgCoverage.get(board.code);
  if (!parent) throw new Error(`Missing DFG parent coverage for ${board.code}`);
  const subjects = inventory.dfg.subjects.filter((subject) => subject.reviewBoard === board.code);
  const assignedSubjects = subjects.filter((subject) => childRoute("dfg-subject", subject.code));
  lines.push(
    `### ${board.code} ${board.name}`,
    "",
    parentRoute(parent),
    "",
    `**Fine-grained status:** ${assignedSubjects.length} of ${subjects.length} subjects have an explicit child-level routing assignment.`,
    "",
  );
  for (const subject of subjects) {
    lines.push(`- **${subject.code} — ${subject.name}.** ${childRouteText(childRoute("dfg-subject", subject.code))}`);
  }
  lines.push("");
}

lines.push(
  "## ANZSRC 2020: divisions, groups, and fields",
  "",
  "The complete field list is retained here so names hidden by broad labels remain",
  "searchable. A group is not marked reviewed merely because its division has a",
  "route.",
  "",
);

for (const division of inventory.anzsrc.divisions) {
  const parent = anzsrcCoverage.get(division.code);
  if (!parent) throw new Error(`Missing ANZSRC parent coverage for ${division.code}`);
  const groups = inventory.anzsrc.groups.filter((group) => group.division === division.code);
  const divisionFields = inventory.anzsrc.fields.filter((field) => field.group.startsWith(division.code));
  const assignedGroups = groups.filter((group) => childRoute("anzsrc-group", group.code));
  const assignedFields = divisionFields.filter((field) => childRoute("anzsrc-field", field.code));
  lines.push(
    `### ${division.code} ${division.name}`,
    "",
    parentRoute(parent),
    "",
    `**Fine-grained status:** ${assignedGroups.length} of ${groups.length} groups and ${assignedFields.length} of ${divisionFields.length} fields have an explicit child-level routing assignment.`,
    "",
  );

  for (const group of groups) {
    const fields = inventory.anzsrc.fields.filter((field) => field.group === group.code);
    lines.push(
      `#### ${group.code} ${group.name}`,
      "",
      `**${childRouteText(childRoute("anzsrc-group", group.code))}** **Named fields:** ${fields.length}.`,
      "",
    );
    for (const field of fields) {
      lines.push(`- **${field.code} — ${field.name}.** ${childRouteText(childRoute("anzsrc-field", field.code))}`);
    }
    lines.push("");
  }
}

lines.push(
  "## Promotion rule",
  "",
  "A child may move out of `unassigned` only when `fine-grained-routing.json` records:",
  "",
  "1. a field-centered source search using primary or authoritative evidence;",
  "2. the transferable problem--solution principle and its causal boundary;",
  "3. its relation to an existing canonical principle or a justified new bundle;",
  "4. at least one measurable prediction or explicit reason no test is yet possible; and",
  "5. the affected claims, chapters, and experiment contracts.",
  "",
  "This inventory therefore expands the search space without inflating the project's",
  "coverage claims.",
  "",
);

const rendered = `${lines.join("\n")}\n`;

if (checkOnly) {
  const current = await readFile(outputPath, "utf8");
  if (current !== rendered) {
    throw new Error("research/taxonomies/field-depth.md is stale; run node scripts/generate-taxonomy-depth.mjs");
  }
  console.log(`Fine-grained field-depth page is current (${inventory.euroscivoc.concepts.length} EuroSciVoc concepts, ${inventory.dfg.subjects.length} DFG subjects, ${inventory.anzsrc.groups.length} ANZSRC groups, ${inventory.anzsrc.fields.length} ANZSRC fields).`);
} else {
  await writeFile(outputPath, rendered, "utf8");
  console.log(`Wrote ${path.relative(root, outputPath)} with ${lines.length.toLocaleString("en-US")} source lines.`);
}

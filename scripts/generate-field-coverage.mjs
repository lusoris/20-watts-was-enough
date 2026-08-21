import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "research", "field-coverage.json");
const markdownPath = path.join(root, "research", "field-coverage.md");
const plotPath = path.join(root, "public", "plots", "global-field-coverage.svg");
const checkOnly = process.argv.includes("--check");
const data = JSON.parse(await readFile(sourcePath, "utf8"));

const allowedStates = new Set(["dedicated", "adjacent", "unreviewed"]);
const stateLabels = {
  dedicated: "dedicated audit",
  adjacent: "adjacent evidence only",
  unreviewed: "unreviewed",
};
const colors = {
  dedicated: "#24b47e",
  adjacent: "#ffb547",
  unreviewed: "#f45b69",
  background: "#0b1d18",
  panel: "#122a22",
  text: "#fffaf0",
  muted: "#b9c9c1",
  grid: "#35584b",
};
const statePanels = {
  dedicated: "#102c24",
  adjacent: "#322919",
  unreviewed: "#321c26",
};

function fail(message) {
  throw new Error(`Field coverage validation failed: ${message}`);
}

function countStates(items) {
  return items.reduce(
    (counts, item) => {
      counts[item.state] += 1;
      return counts;
    },
    { dedicated: 0, adjacent: 0, unreviewed: 0 },
  );
}

function validateUnique(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item.code || !item.name) fail(`${label} contains a field without code or name`);
    if (seen.has(item.code)) fail(`${label} contains duplicate code ${item.code}`);
    if (!allowedStates.has(item.state)) fail(`${label} ${item.code} has invalid state ${item.state}`);
    seen.add(item.code);
  }
}

if (data.oecdBroadFields.length !== data.taxonomies.oecdFord.expectedBroadFields) {
  fail(`expected ${data.taxonomies.oecdFord.expectedBroadFields} OECD broad fields, found ${data.oecdBroadFields.length}`);
}
if (data.oecdFields.length !== data.taxonomies.oecdFord.expectedFields) {
  fail(`expected ${data.taxonomies.oecdFord.expectedFields} OECD fields, found ${data.oecdFields.length}`);
}
if (data.dfgAreas.length !== data.taxonomies.dfg.expectedAreas) {
  fail(`expected ${data.taxonomies.dfg.expectedAreas} DFG areas, found ${data.dfgAreas.length}`);
}
if (data.dfgReviewBoards.length !== data.taxonomies.dfg.expectedReviewBoards) {
  fail(`expected ${data.taxonomies.dfg.expectedReviewBoards} DFG review boards, found ${data.dfgReviewBoards.length}`);
}
if (data.anzsrcDivisions.length !== data.taxonomies.anzsrc.declaredDivisions) {
  fail(`expected ${data.taxonomies.anzsrc.declaredDivisions} ANZSRC divisions, found ${data.anzsrcDivisions.length}`);
}

validateUnique(data.oecdFields, "OECD fields");
validateUnique(data.dfgReviewBoards, "DFG review boards");
validateUnique(data.anzsrcDivisions, "ANZSRC divisions");
validateUnique(data.taxonomyDivergences, "taxonomy divergences");

for (const field of data.oecdFields) {
  const broadCode = field.code.split(".")[0];
  if (!data.oecdBroadFields.some((broad) => broad.code === broadCode)) {
    fail(`OECD field ${field.code} has no broad-field owner`);
  }
  if (!Array.isArray(field.audits)) fail(`OECD field ${field.code} has no audits array`);
  if (field.state === "unreviewed" && field.audits.length !== 0) {
    fail(`unreviewed OECD field ${field.code} must not claim an audit`);
  }
  if (field.state !== "unreviewed" && field.audits.length === 0) {
    fail(`${field.state} OECD field ${field.code} must name at least one adjacent or dedicated audit`);
  }
  for (const audit of field.audits) {
    await access(path.join(root, audit));
  }
}

for (const board of data.dfgReviewBoards) {
  const areaCode = board.code.split(".")[0];
  if (!data.dfgAreas.some((area) => area.code === areaCode)) {
    fail(`DFG review board ${board.code} has no research-area owner`);
  }
  if (!Array.isArray(board.audits)) {
    fail(`DFG review board ${board.code} has no audits array`);
  }
  if (board.state === "unreviewed" && board.audits.length !== 0) {
    fail(`unreviewed DFG review board ${board.code} must not claim an audit`);
  }
  if (board.state !== "unreviewed" && board.audits.length === 0) {
    fail(`${board.state} DFG review board ${board.code} must name at least one adjacent or dedicated audit`);
  }
  for (const audit of board.audits) {
    await access(path.join(root, audit));
  }
}

for (const divergence of data.taxonomyDivergences) {
  if (!Array.isArray(divergence.audits)) {
    fail(`taxonomy divergence ${divergence.code} has no audits array`);
  }
  if (divergence.state === "unreviewed" && divergence.audits.length !== 0) {
    fail(`unreviewed taxonomy divergence ${divergence.code} must not claim an audit`);
  }
  if (divergence.state !== "unreviewed" && divergence.audits.length === 0) {
    fail(`${divergence.state} taxonomy divergence ${divergence.code} must name an audit`);
  }
  for (const audit of divergence.audits) {
    await access(path.join(root, audit));
  }
}

for (const division of data.anzsrcDivisions) {
  if (!Array.isArray(division.audits)) {
    fail(`ANZSRC division ${division.code} has no audits array`);
  }
  if (division.state === "unreviewed" && division.audits.length !== 0) {
    fail(`unreviewed ANZSRC division ${division.code} must not claim an audit`);
  }
  if (division.state !== "unreviewed" && division.audits.length === 0) {
    fail(`${division.state} ANZSRC division ${division.code} must name an audit`);
  }
  for (const audit of division.audits) {
    await access(path.join(root, audit));
  }
}

function relativeAuditLink(audit) {
  return audit.replace(/^research\//, "");
}

function auditLabel(audit) {
  return path
    .basename(audit, ".md")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replaceAll("-", " ");
}

function percent(value, total) {
  return `${((value / total) * 100).toFixed(1)}%`;
}

const oecdCounts = countStates(data.oecdFields);
const dfgCounts = countStates(data.dfgReviewBoards);
const anzsrcCounts = countStates(data.anzsrcDivisions);
const oecdUnreviewed = data.oecdFields.filter((field) => field.state === "unreviewed");
const oecdEntrySummary = oecdUnreviewed.length > 0
  ? `At entry-audit resolution, the wholly unreviewed OECD cells are ${oecdUnreviewed.map((field) => `${field.code} ${field.name}`).join(", ")}. This is not near-complete science coverage: a dedicated label means one field-centered audit exists, not that its constituent disciplines have been exhausted.`
  : "No OECD second-level cell is wholly unreviewed at entry-audit resolution. That is an entry-census result, not near-complete science coverage: a dedicated label means one field-centered audit exists, while catch-all categories and most constituent subfields remain open.";
const markdown = [];

markdown.push(
  "# Global field coverage",
  "",
  `**Census date:** ${data.asOf}`,
  "",
  "This is the repository's breadth control, not a claim that any discipline has been exhausted. It answers a narrower and mechanically checkable question: **does a durable field-centered audit exist, is the field present only through neighboring work, or has it not been reviewed at all?**",
  "",
  "![Coverage of global and German research-field taxonomies](../public/plots/global-field-coverage.svg)",
  "",
  "Editable data: [`field-coverage.json`](field-coverage.json). The plot and this page are generated by [`generate-field-coverage.mjs`](../scripts/generate-field-coverage.mjs).",
  "",
  "## Result",
  "",
  `The OECD baseline contains **${data.oecdFields.length} second-level fields**. The repository has a dedicated audit for **${oecdCounts.dedicated} (${percent(oecdCounts.dedicated, data.oecdFields.length)})**, adjacent evidence without a field-centered audit for **${oecdCounts.adjacent} (${percent(oecdCounts.adjacent, data.oecdFields.length)})**, and no durable review for **${oecdCounts.unreviewed} (${percent(oecdCounts.unreviewed, data.oecdFields.length)})**.`,
  "",
  `The finer DFG probe contains **${data.dfgReviewBoards.length} review boards and ${data.taxonomies.dfg.declaredSubjects} subjects**. At review-board resolution, the repository has ${dfgCounts.dedicated} dedicated, ${dfgCounts.adjacent} adjacent, and ${dfgCounts.unreviewed} unreviewed areas. That higher apparent coverage is not greater depth: one audit can touch a large review board while leaving most of its constituent subjects untouched.`,
  "",
  `The independent ANZSRC census contains **${data.anzsrcDivisions.length} divisions, ${data.taxonomies.anzsrc.declaredGroups} groups, and ${data.taxonomies.anzsrc.declaredFields.toLocaleString("en-US")} fields**. At the deliberately coarse division level, ${anzsrcCounts.dedicated} have a dedicated entry audit, ${anzsrcCounts.adjacent} have adjacent evidence only, and ${anzsrcCounts.unreviewed} are wholly unreviewed. This is a disagreement detector, not evidence that the ${data.taxonomies.anzsrc.declaredGroups} groups or ${data.taxonomies.anzsrc.declaredFields.toLocaleString("en-US")} fields have been audited.`,
  "",
  `${oecdEntrySummary} Large depth gaps remain in political science, public administration, stratification and broader communication studies; clinical medicine and medical biotechnology; agricultural biotechnology; analytical and food chemistry; inorganic and total-synthesis chemistry; water and ocean research; nanotechnology; production engineering; finance and management; comparative theology; and many named subfields inside every broad cell.`,
  "",
  "## What the states mean",
  "",
  ...Object.entries(data.states).map(([state, definition]) => `- **${stateLabels[state]}:** ${definition}`),
  "",
  "A dedicated audit is an entry ticket, not completion. Audit depth, evidence quality, principle deduplication, and executable-test readiness are separate axes.",
  "",
  "## Taxonomy contract",
  "",
  `- The global backbone is [${data.taxonomies.oecdFord.title}](${data.taxonomies.oecdFord.url}), ${data.taxonomies.oecdFord.edition}. OECD notes that the classification evolves and does not map perfectly to education or department structures.`,
  `- The granularity check is the [${data.taxonomies.dfg.title}](${data.taxonomies.dfg.url}) for ${data.taxonomies.dfg.edition}: ${data.taxonomies.dfg.expectedReviewBoards} review boards, ${data.taxonomies.dfg.declaredSubjects} subjects, and ${data.taxonomies.dfg.expectedAreas} research areas.`,
  `- The independent census and disagreement check is [${data.taxonomies.anzsrc.title}](${data.taxonomies.anzsrc.url}), ${data.taxonomies.anzsrc.edition}: ${data.taxonomies.anzsrc.declaredDivisions} divisions, ${data.taxonomies.anzsrc.declaredGroups} groups, and ${data.taxonomies.anzsrc.declaredFields.toLocaleString("en-US")} fields. All divisions are recorded; group- and field-level depth remains open. It is not a normative source for this EU/German project.`,
  "- The ERC whole-science panel structure is a routing sanity check only. The ERC explicitly says its panels are not a complete scientific classification and do not express research priorities.",
  "- Catch-all categories remain open. Their presence cannot prove that unnamed or emerging disciplines have been sampled.",
  "",
  "## OECD FORD field-by-field record",
  "",
);

for (const broad of data.oecdBroadFields) {
  const fields = data.oecdFields.filter((field) => field.code.startsWith(`${broad.code}.`));
  const counts = countStates(fields);
  markdown.push(
    `### ${broad.code}. ${broad.name}`,
    "",
    `**${counts.dedicated} dedicated · ${counts.adjacent} adjacent · ${counts.unreviewed} unreviewed**`,
    "",
  );
  for (const field of fields) {
    markdown.push(`- **${field.code} ${field.name} — ${stateLabels[field.state]}.**`);
    if (field.audits.length > 0) {
      const links = field.audits
        .map((audit) => `[${auditLabel(audit)}](${relativeAuditLink(audit)})`)
        .join(", ");
      markdown.push(`  - Current route: ${links}.`);
    }
    markdown.push(`  - Missing depth: ${field.scopeGap}`);
    markdown.push(`  - Next discriminating question: ${field.nextQuestion}`);
  }
  markdown.push("");
}

markdown.push(
  "## DFG granularity probe",
  "",
  "The DFG layer catches gaps hidden by the broader OECD cells. It is shown at review-board level; its 214 individual subjects remain the next resolution step.",
  "",
);

for (const area of data.dfgAreas) {
  const boards = data.dfgReviewBoards.filter((board) => board.code.startsWith(`${area.code}.`));
  const counts = countStates(boards);
  markdown.push(
    `### ${area.code}. ${area.name}`,
    "",
    `**${counts.dedicated} dedicated · ${counts.adjacent} adjacent · ${counts.unreviewed} unreviewed**`,
    "",
  );
  for (const board of boards) {
    markdown.push(`- **${board.code} ${board.name} — ${stateLabels[board.state]}.**`);
    if (board.audits.length > 0) {
      const links = board.audits
        .map((audit) => `[${auditLabel(audit)}](${relativeAuditLink(audit)})`)
        .join(", ");
      markdown.push(`  - Current route: ${links}.`);
    }
    markdown.push(`  - Missing depth: ${board.gap}`);
  }
  markdown.push("");
}

markdown.push(
  "## ANZSRC independent division census",
  "",
  `This third lens records all ${data.anzsrcDivisions.length} official divisions. Its much finer ${data.taxonomies.anzsrc.declaredGroups} groups and ${data.taxonomies.anzsrc.declaredFields.toLocaleString("en-US")} fields remain an explicit resolution debt; a green division means one entry audit, not comprehensive coverage.`,
  "",
);
for (const division of data.anzsrcDivisions) {
  markdown.push(`- **${division.code} ${division.name} — ${stateLabels[division.state]}.**`);
  if (division.audits.length > 0) {
    const links = division.audits
      .map((audit) => `[${auditLabel(audit)}](${relativeAuditLink(audit)})`)
      .join(", ");
    markdown.push(`  - Current route: ${links}.`);
  }
  markdown.push(`  - Missing depth: ${division.gap}`);
}
markdown.push("");

markdown.push(
  "## Taxonomy disagreement is a discovery signal",
  "",
  "A field missing from one classification must not disappear from the research program. The first recorded disagreement is:",
  "",
);
for (const divergence of data.taxonomyDivergences) {
  markdown.push(`- **${divergence.taxonomy} ${divergence.code} ${divergence.name} — ${stateLabels[divergence.state]}.**`);
  if (divergence.audits.length > 0) {
    const links = divergence.audits
      .map((audit) => `[${auditLabel(audit)}](${relativeAuditLink(audit)})`)
      .join(", ");
    markdown.push(`  - Current route: ${links}.`);
  }
  markdown.push(
    `  - Gap: ${divergence.gap}`,
    `  - Next discriminating question: ${divergence.nextQuestion}`,
    `  - Handling rule: ${divergence.handlingRule}`,
  );
}
markdown.push("");

markdown.push(
  "## Breadth scheduler",
  "",
  "Each breadth wave must contain four different selections:",
  "",
  "1. one field from the least-covered OECD broad field;",
  "2. one DFG subject hidden inside an OECD field already marked dedicated;",
  "3. one field chosen for methodological distance from the current corpus, without requiring an obvious AI analogy; and",
  "4. one depth item that can alter an existing claim, experiment, equation, or system boundary.",
  "",
  "The first three selections collect leads. Only the fourth slot is allowed to consume substantial depth work before deduplication. This prevents familiar fields from monopolizing the research budget while still requiring useful residue to change a testable object.",
  "",
  "## Completed breadth waves",
  "",
  "### Wave 1 — taxonomy and method boundaries",
  "",
  "1. **Soil, crop, and multi-resource co-limitation:** changed resource state from scalar availability to typed, transport- and service-window-qualified vectors; no new principle.",
  "2. **Philosophy of science and theory choice:** changed discovery admission from model fit to an alternative-, auxiliary-, observation-, access-, and failure-root-qualified contract; no new principle.",
  "3. **Indigenous data and knowledge governance:** added collective authority, purpose, benefit, refusal, and derivative-remedy obligations while prohibiting extraction of community knowledge; no new principle.",
  "4. **Textual criticism and variant traditions:** separated attestation, transcription, collation, lineage, conjecture, edition, translation, and interpretation and made apparatus compaction query-qualified; no new principle.",
  "",
  "### Wave 2 — deliberate disciplinary distance",
  "",
  "1. **Nursing, care science, and health services:** made unfinished necessary work, continuity type, receiver acceptance, response capacity, and verified service explicit; five synthetic protocols, no new principle.",
  "2. **Animal production and veterinary population health:** protected multidimensional welfare from productivity proxies and added cohort, lineage, interference, consortium-flux, breeding-diversity, and changing-opponent tests; no new principle.",
  "3. **Environmental and industrial biotechnology:** added dilution/selection, evolutionary escape, scale-gradient, transport, remediation-rebound, measurement, and lifecycle falsifiers while leaving chemistry boards conservatively open; no new principle.",
  "4. **Accounting, audit, actuarial science, and insurance:** separated balance from truth, materiality from detection, reserves from headroom, dependence from pooling, and governance from model validity; nine protocols, no new principle.",
  "5. **Theology, religious practice, and ritual:** separated instrumental effect, conventional form, protected commitment, authority, interpretation, and belief data; five synthetic protocols, no new principle.",
  "6. **Forestry, fisheries, aquaculture, and aquatic food systems:** added stock–flow–cohort–space–rights, carbon-pool, management-loop, externality, nutrient-recovery, and edible-endpoint tests; six protocols, no new principle.",
  "7. **Particle, nuclear, and high-energy experimentation:** added trigger support, detector response, unfolding, nuisance, blinding, search-family, simulation, preservation, covariance, and effective-model breakdown tests; eight protocols, no new principle.",
  "",
  "### Wave 3 — independent taxonomy and remaining empty cells",
  "",
  "1. **Residual humanities and living heritage:** separated archival selection from event absence, contextual authenticity from a universal score, living practice from frozen tokens, rehearsal history from free compression, re-treatability from byte rollback, and representation from identity; six protocols, no new principle.",
  "2. **Molecular chemistry and synthesis systems:** bounded dynamic covalent assembly, self-sorting, context-qualified recognition, temporal pathway control, structure elucidation, and automated discovery against mature chemical nulls; eight protocols, no new principle.",
  "3. **Polymer research:** made distributions, mechanism, topology, relaxation spectra, phase path, gel criteria, healing, ageing, sequence storage, circularity, and measurement operators explicit; twelve protocols, no new principle.",
  "4. **Mineralogy, petrology, and geochemistry:** separated equilibrium, kinetic trapping, material replacement, P–T–t records, tracer inverses, weathering, redox, upscaling, provenance, dates, and preservation-filtered deep time; eight protocols, no new principle.",
  "5. **Direct social research, ethnography, and media:** separated instrumented response, nonresponse, category construction, measurement invariance, situated observation, reflexivity, talk/action, network interference, formal routine, media selection/exposure, mixed-method failure roots, and distinct authority bases; eight protocols, no new principle.",
  "6. **Taxonomy control itself:** added all 23 ANZSRC divisions, 213 groups, and 1,967 fields as an independent disagreement probe beside OECD and DFG; division coverage never substitutes for group- or field-level review.",
  "",
  "## Next gap wave",
  "",
  "1. **Measurement-heavy adjacent fields:** audit analytical and food chemistry, water research, ocean/atmospheric science, geophysics/geodesy, and chemical speciation with explicit operator, calibration, transport, and interlaboratory boundaries.",
  "2. **Clinical and intervention depth:** sample clinical specialties, multimorbidity, diagnosis/treatment pathways, medical and agricultural biotechnology, antimicrobial stewardship, gene editing, biological control, and authorization separately from basic biology.",
  "3. **Engineering depth:** audit production engineering, nanotechnology, manufacturing, maintenance, communications hardware, and material qualification rather than inheriting coverage from neighboring systems work.",
  "4. **Social-science depth:** sample political science, public administration, stratification, family/work/migration, collective action, criminology, digital ethnography, media systems, and community-specific methods beyond one direct-social entry audit.",
  "5. **Subfield resolution plus execution:** sample the 214 DFG subjects and 213 ANZSRC groups explicitly, then convert the most discriminating protocols into versioned workstation artifacts instead of accumulating prose-only readiness.",
  "",
  "No item is promoted because it sounds novel. Every retained mechanism still passes the open-world extraction record, mature-null comparison, deduplication, and equal-budget rejection gate in the [discovery policy](discovery-policy.md).",
  "",
  "## Maintenance rule",
  "",
  "After each audit, update the machine record first, regenerate this page and plot, and record whether the new material produced: a duplicate, a sharper boundary, a new claim, a changed experiment, or no durable residue. A field remains incomplete even after its first dedicated audit.",
  "",
);

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function taxonomyGroups(items, groups) {
  return groups.map((group) => ({
    ...group,
    counts: countStates(items.filter((item) => item.code.startsWith(`${group.code}.`))),
    total: items.filter((item) => item.code.startsWith(`${group.code}.`)).length,
  }));
}

function renderRows(groups, { x, y, width, rowHeight, maxTotal }) {
  return groups
    .map((group, index) => {
      const rowY = y + index * rowHeight;
      const barX = x + 230;
      const barWidth = width - 250;
      let offset = 0;
      const segments = ["dedicated", "adjacent", "unreviewed"]
        .map((state) => {
          const count = group.counts[state];
          const segmentWidth = (count / maxTotal) * barWidth;
          const segment = `<rect x="${barX + offset}" y="${rowY + 7}" width="${segmentWidth}" height="24" rx="${segmentWidth > 10 ? 4 : 0}" fill="${colors[state]}"><title>${esc(group.name)}: ${count} ${state}</title></rect>`;
          offset += segmentWidth;
          return segment;
        })
        .join("");
      return `<text x="${x}" y="${rowY + 25}" fill="${colors.text}" font-family="Segoe UI, sans-serif" font-size="14">${esc(group.code)} · ${esc(group.name)}</text>${segments}<text x="${barX + barWidth + 10}" y="${rowY + 25}" fill="${colors.muted}" font-family="Cascadia Mono, monospace" font-size="12">${group.total}</text>`;
    })
    .join("");
}

function renderOverallBar(counts, total, { x, y, width, height = 24 }) {
  let offset = 0;
  return ["dedicated", "adjacent", "unreviewed"]
    .map((state) => {
      const count = counts[state];
      const segmentWidth = (count / total) * width;
      const segment = `<rect x="${x + offset}" y="${y}" width="${segmentWidth}" height="${height}" rx="${segmentWidth > 10 ? 4 : 0}" fill="${colors[state]}"><title>${count} ${state}</title></rect>`;
      offset += segmentWidth;
      return segment;
    })
    .join("");
}

const oecdGroups = taxonomyGroups(data.oecdFields, data.oecdBroadFields);
const dfgGroups = taxonomyGroups(data.dfgReviewBoards, data.dfgAreas);
const leadDivergence = data.taxonomyDivergences[0];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1040" viewBox="0 0 1200 1040" role="img" aria-labelledby="title description">
  <title id="title">Repository field coverage against OECD, DFG and ANZSRC classifications</title>
  <desc id="description">Stacked bars show dedicated audits, adjacent evidence, and unreviewed fields as of ${esc(data.asOf)}.</desc>
  <rect width="1200" height="1040" rx="24" fill="${colors.background}"/>
  <text x="56" y="72" fill="${colors.text}" font-family="Georgia, serif" font-size="34" font-weight="700">How global is the research search?</text>
  <text x="56" y="104" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="16">Audit presence, not scientific completeness · ${esc(data.asOf)}</text>
  <g transform="translate(724 61)">
    <circle cx="0" cy="0" r="7" fill="${colors.dedicated}"/><text x="14" y="5" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="13">dedicated</text>
    <circle cx="112" cy="0" r="7" fill="${colors.adjacent}"/><text x="126" y="5" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="13">adjacent</text>
    <circle cx="222" cy="0" r="7" fill="${colors.unreviewed}"/><text x="236" y="5" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="13">unreviewed</text>
  </g>
  <rect x="36" y="132" width="1128" height="378" rx="16" fill="${colors.panel}" stroke="${colors.grid}"/>
  <text x="62" y="178" fill="${colors.text}" font-family="Georgia, serif" font-size="23" font-weight="700">OECD FORD · 42 global second-level fields</text>
  <text x="62" y="207" fill="${colors.muted}" font-family="Cascadia Mono, monospace" font-size="13">${oecdCounts.dedicated} dedicated · ${oecdCounts.adjacent} adjacent · ${oecdCounts.unreviewed} unreviewed</text>
  ${renderRows(oecdGroups, { x: 62, y: 230, width: 1015, rowHeight: 43, maxTotal: 11 })}
  <rect x="36" y="532" width="1128" height="244" rx="16" fill="${colors.panel}" stroke="${colors.grid}"/>
  <text x="62" y="578" fill="${colors.text}" font-family="Georgia, serif" font-size="23" font-weight="700">DFG 2024–2028 · 49 review boards / 214 subjects</text>
  <text x="62" y="607" fill="${colors.muted}" font-family="Cascadia Mono, monospace" font-size="13">${dfgCounts.dedicated} dedicated · ${dfgCounts.adjacent} adjacent · ${dfgCounts.unreviewed} unreviewed</text>
  ${renderRows(dfgGroups, { x: 62, y: 630, width: 1015, rowHeight: 36, maxTotal: 19 })}
  <rect x="36" y="794" width="1128" height="82" rx="16" fill="${colors.panel}" stroke="${colors.grid}"/>
  <text x="62" y="828" fill="${colors.text}" font-family="Georgia, serif" font-size="21" font-weight="700">ANZSRC 2020 · 23 divisions / 213 groups / 1,967 fields</text>
  <text x="62" y="856" fill="${colors.muted}" font-family="Cascadia Mono, monospace" font-size="13">${anzsrcCounts.dedicated} dedicated · ${anzsrcCounts.adjacent} adjacent · ${anzsrcCounts.unreviewed} unreviewed at division resolution</text>
  ${renderOverallBar(anzsrcCounts, data.anzsrcDivisions.length, { x: 730, y: 826, width: 385 })}
  <rect x="36" y="894" width="1128" height="82" rx="16" fill="${statePanels[leadDivergence.state]}" stroke="${colors[leadDivergence.state]}"/>
  <text x="62" y="928" fill="${colors[leadDivergence.state]}" font-family="Cascadia Mono, monospace" font-size="13" font-weight="700">CROSS-TAXONOMY SIGNAL · ${esc(leadDivergence.taxonomy)} ${esc(leadDivergence.code)}</text>
  <text x="62" y="956" fill="${colors.text}" font-family="Georgia, serif" font-size="20" font-weight="700">${esc(leadDivergence.name)} — ${esc(stateLabels[leadDivergence.state])}; not separately visible in OECD / DFG</text>
  <text x="56" y="1016" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="12">A dedicated audit may cover only one subfield. The 213 ANZSRC groups and 1,967 fields remain open. Source: research/field-coverage.json</text>
</svg>\n`;

const markdownText = `${markdown.join("\n")}\n`;

async function checkGenerated(filePath, expected) {
  let actual;
  try {
    actual = await readFile(filePath, "utf8");
  } catch {
    fail(`missing generated file ${path.relative(root, filePath)}`);
  }
  if (actual !== expected) fail(`generated file is stale: ${path.relative(root, filePath)}`);
}

if (checkOnly) {
  await checkGenerated(markdownPath, markdownText);
  await checkGenerated(plotPath, svg);
  console.log(`Field coverage validated: ${data.oecdFields.length} OECD fields, ${data.dfgReviewBoards.length} DFG review boards, and ${data.anzsrcDivisions.length} ANZSRC divisions.`);
} else {
  await mkdir(path.dirname(plotPath), { recursive: true });
  await writeFile(markdownPath, markdownText, "utf8");
  await writeFile(plotPath, svg, "utf8");
  console.log(`Generated ${path.relative(root, markdownPath)} and ${path.relative(root, plotPath)} from three taxonomy lenses.`);
}

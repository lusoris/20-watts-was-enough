import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const taxonomyPath = path.join(root, "research", "taxonomies", "fine-grained-fields.json");
const routingPath = path.join(root, "research", "taxonomies", "fine-grained-routing.json");
const coveragePath = path.join(root, "research", "field-coverage.json");
const claimsPath = path.join(root, "research", "claims.md");

function fail(message) {
  throw new Error(`Science taxonomy validation failed: ${message}`);
}

function unique(items, label) {
  const codes = new Set();
  for (const item of items) {
    if (!item.code || !item.name || item.name !== item.name.trim()) {
      fail(`${label} contains an empty or untrimmed code/name`);
    }
    if (codes.has(item.code)) fail(`${label} repeats code ${item.code}`);
    codes.add(item.code);
  }
  return codes;
}

async function hash(relativePath) {
  const body = await readFile(path.join(root, relativePath));
  return createHash("sha256").update(body).digest("hex");
}

const data = JSON.parse(await readFile(taxonomyPath, "utf8"));
const routing = JSON.parse(await readFile(routingPath, "utf8"));
const coverage = JSON.parse(await readFile(coveragePath, "utf8"));
const claimsText = await readFile(claimsPath, "utf8");

if (data.schemaVersion !== 1) fail("unsupported schemaVersion");
if (data.asOf !== "2026-08-25") fail("unexpected census date");

for (const source of Object.values(data.sources ?? {})) {
  if (!source.path || !/^[a-f0-9]{64}$/.test(source.sha256 ?? "")) {
    fail("source record lacks path or lowercase SHA-256");
  }
  if ((await hash(source.path)) !== source.sha256) {
    fail(`source hash mismatch: ${source.path}`);
  }
}

const dfgBoards = data.dfg?.reviewBoards ?? [];
const dfgSubjects = data.dfg?.subjects ?? [];
const anzsrcDivisions = data.anzsrc?.divisions ?? [];
const anzsrcGroups = data.anzsrc?.groups ?? [];
const anzsrcFields = data.anzsrc?.fields ?? [];
const euroscivocConcepts = data.euroscivoc?.concepts ?? [];

if (dfgBoards.length !== 49 || dfgSubjects.length !== 214) {
  fail(`expected 49 DFG boards/214 subjects, found ${dfgBoards.length}/${dfgSubjects.length}`);
}
if (anzsrcDivisions.length !== 23 || anzsrcGroups.length !== 213 || anzsrcFields.length !== 1967) {
  fail(
    `expected 23/213/1967 ANZSRC divisions/groups/fields, found ` +
      `${anzsrcDivisions.length}/${anzsrcGroups.length}/${anzsrcFields.length}`,
  );
}
if (euroscivocConcepts.length !== 1064) {
  fail(`expected 1064 EuroSciVoc concepts, found ${euroscivocConcepts.length}`);
}

const dfgBoardCodes = unique(dfgBoards, "DFG review boards");
const dfgSubjectCodes = unique(dfgSubjects, "DFG subjects");
const divisionCodes = unique(anzsrcDivisions, "ANZSRC divisions");
const groupCodes = unique(anzsrcGroups, "ANZSRC groups");
unique(anzsrcFields, "ANZSRC fields");
const euroscivocIds = new Set();
for (const concept of euroscivocConcepts) {
  if (!concept.id || !concept.name || !concept.nameDe || !concept.uri) {
    fail("EuroSciVoc contains a concept without an ID, URI, or bilingual label");
  }
  if (euroscivocIds.has(concept.id)) fail(`EuroSciVoc repeats ID ${concept.id}`);
  euroscivocIds.add(concept.id);
  if (concept.uri !== `http://data.europa.eu/8mn/euroscivoc/${concept.id}`) {
    fail(`EuroSciVoc concept ${concept.id} has an inconsistent URI`);
  }
  if (!Number.isInteger(concept.depth) || concept.depth < 0) {
    fail(`EuroSciVoc concept ${concept.id} has invalid depth ${concept.depth}`);
  }
}

for (const subject of dfgSubjects) {
  if (!/^\d\.\d{2}-\d{2}$/.test(subject.code)) fail(`invalid DFG subject code ${subject.code}`);
  if (subject.reviewBoard !== subject.code.slice(0, 4) || !dfgBoardCodes.has(subject.reviewBoard)) {
    fail(`DFG subject ${subject.code} has invalid review-board parent`);
  }
}
for (const group of anzsrcGroups) {
  if (!/^\d{4}$/.test(group.code)) fail(`invalid ANZSRC group code ${group.code}`);
  if (group.division !== group.code.slice(0, 2) || !divisionCodes.has(group.division)) {
    fail(`ANZSRC group ${group.code} has invalid division parent`);
  }
}
for (const field of anzsrcFields) {
  if (!/^\d{6}$/.test(field.code)) fail(`invalid ANZSRC field code ${field.code}`);
  if (field.group !== field.code.slice(0, 4) || !groupCodes.has(field.group)) {
    fail(`ANZSRC field ${field.code} has invalid group parent`);
  }
}
let euroscivocTopConcepts = 0;
for (const concept of euroscivocConcepts) {
  if (concept.broader === null) {
    if (concept.depth !== 0) fail(`EuroSciVoc top concept ${concept.id} is not depth 0`);
    euroscivocTopConcepts += 1;
    continue;
  }
  if (!euroscivocIds.has(concept.broader)) {
    fail(`EuroSciVoc concept ${concept.id} has missing parent ${concept.broader}`);
  }
  const parent = euroscivocConcepts.find((candidate) => candidate.id === concept.broader);
  if (concept.depth !== parent.depth + 1) {
    fail(`EuroSciVoc concept ${concept.id} has inconsistent parent depth`);
  }
}
if (euroscivocTopConcepts !== 6) {
  fail(`expected 6 EuroSciVoc top concepts, found ${euroscivocTopConcepts}`);
}

const coarseDfg = new Set((coverage.dfgReviewBoards ?? []).map((item) => item.code));
const coarseAnzsrc = new Set((coverage.anzsrcDivisions ?? []).map((item) => item.code));
if (
  coverage.taxonomies?.euroscivoc?.declaredConcepts !== euroscivocConcepts.length ||
  coverage.taxonomies?.euroscivoc?.declaredTopConcepts !== euroscivocTopConcepts
) {
  fail("EuroSciVoc declarations disagree with field-coverage.json");
}
if (coarseDfg.size !== dfgBoardCodes.size || [...dfgBoardCodes].some((code) => !coarseDfg.has(code))) {
  fail("fine-grained DFG parents disagree with field-coverage.json");
}
if (
  coarseAnzsrc.size !== divisionCodes.size ||
  [...divisionCodes].some((code) => !coarseAnzsrc.has(code))
) {
  fail("fine-grained ANZSRC parents disagree with field-coverage.json");
}

if (dfgSubjectCodes.size !== 214) fail("DFG subject uniqueness failed");

if (routing.schemaVersion !== 1 || !Array.isArray(routing.assignments)) {
  fail("fine-grained routing ledger has an unsupported schema");
}
const routingTargets = {
  "dfg-subject": dfgSubjectCodes,
  "anzsrc-group": groupCodes,
  "anzsrc-field": new Set(anzsrcFields.map((item) => item.code)),
  "euroscivoc-concept": euroscivocIds,
};
const routingKeys = new Set();
for (const assignment of routing.assignments) {
  const targetCodes = routingTargets[assignment.level];
  const key = `${assignment.level}:${assignment.code}`;
  if (!targetCodes?.has(assignment.code)) fail(`routing target does not exist: ${key}`);
  if (routingKeys.has(key)) fail(`duplicate fine-grained routing target: ${key}`);
  routingKeys.add(key);
  if (!new Set(["dedicated", "adjacent"]).has(assignment.state)) {
    fail(`${key} has invalid state ${assignment.state}`);
  }
  if (!Array.isArray(assignment.audits) || assignment.audits.length === 0) {
    fail(`${key} must name at least one audit`);
  }
  if (!assignment.rationale || !assignment.scopeGap || !assignment.nextQuestion) {
    fail(`${key} lacks rationale, scopeGap, or nextQuestion`);
  }
  if (!Array.isArray(assignment.claims)) fail(`${key} has no claims array`);
  for (const claim of assignment.claims) {
    if (!/^C-\d{3,}$/.test(claim)) fail(`${key} has invalid claim ID ${claim}`);
    if (!new RegExp(`^### ${claim}$`, "m").test(claimsText)) {
      fail(`${key} references undefined central claim ${claim}`);
    }
  }
  for (const audit of assignment.audits) {
    if (!/^research\/audits\/.+\.md$/.test(audit)) fail(`${key} has invalid audit path ${audit}`);
    await access(path.join(root, audit));
  }
}
console.log(
  `Science taxonomies validated: ${dfgSubjects.length} DFG subjects, ` +
    `${anzsrcGroups.length} ANZSRC groups, ${anzsrcFields.length} ANZSRC fields, ` +
    `${euroscivocConcepts.length} EuroSciVoc concepts; ` +
    `${routing.assignments.length} explicit child-level routes.`,
);

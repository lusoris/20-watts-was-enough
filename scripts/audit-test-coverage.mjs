import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");

const facetRules = [
  {
    id: "question",
    label: "question or hypothesis",
    pattern: /question|hypothes(is|es)|why|candidate (statement|boundary)|applicability gate|biological observation|scope and scientific boundary/i,
  },
  {
    id: "system",
    label: "system, scenario, or task family",
    pattern: /tasks?|scenarios?|controlled system|experiments?|tracks?|benchmark|stage-1 system model/i,
  },
  {
    id: "comparators",
    label: "arms, baselines, or strongest nulls",
    pattern: /baselines?|nulls?|arms|compared systems|strongest null(s| stack)?|required null stack/i,
  },
  {
    id: "budget",
    label: "matched budget and cost boundary",
    pattern: /equal[- ]budgets?|matched[- ]budgets?|equal information|equalization/i,
  },
  {
    id: "measurements",
    label: "measurements and units",
    pattern: /measurements?|metrics?|outcomes?|comparison vector/i,
  },
  {
    id: "ablations",
    label: "ablations",
    pattern: /ablations?|interventions?/i,
  },
  {
    id: "analysis",
    label: "analysis or statistical plan",
    pattern: /analysis|statistical plan/i,
  },
  {
    id: "failure",
    label: "rejection, kill, or retirement rule",
    pattern: /promotion|rejection|retirement|kill|pass condition/i,
  },
];

function headingsFrom(body) {
  return [...body.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => ({
    depth: match[1].length,
    title: match[2].trim(),
  }));
}

function missingProtocolFacets(body) {
  const headings = headingsFrom(body);
  return facetRules
    .filter((rule) => {
      if (rule.id === "analysis") {
        return !headings.some(
          (heading) =>
            (heading.depth === 2 && rule.pattern.test(heading.title)) ||
            (heading.depth === 3 && /statistical comparison/i.test(heading.title)),
        );
      }
      return !headings.some((heading) => rule.pattern.test(heading.title));
    })
    .map(({ id }) => id);
}

function toPosix(value) {
  return value.replaceAll("\\", "/");
}

async function markdownFiles(directory) {
  const entries = await readdir(directory);
  return entries
    .filter((entry) => entry.endsWith(".md") && entry !== "README.md")
    .map((entry) => path.join(directory, entry))
    .sort();
}

function artifactId(relativePath) {
  const name = path.basename(relativePath, ".md");
  const number = name.match(/^(\d{3})-/)?.[1] ?? "unknown";
  return relativePath.startsWith("experiments/candidates/")
    ? `candidate-${number}`
    : `fixture-${number}`;
}

async function isExecutionReady(id) {
  const manifestPath = path.join(root, "experiments", "workstation", "manifests", `${id}.json`);
  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    const required = ["command", "environment", "hardware", "seeds", "data", "outputs"];
    return {
      ready: required.every((field) => manifest[field]),
      manifest: toPosix(path.relative(root, manifestPath)),
      missing: required.filter((field) => !manifest[field]),
    };
  } catch {
    return { ready: false, manifest: null, missing: ["manifest"] };
  }
}

const artifactPaths = [
  ...(await markdownFiles(path.join(root, "experiments", "candidates"))),
  ...(await markdownFiles(path.join(root, "experiments", "fixtures"))),
];

const artifacts = [];
for (const absolutePath of artifactPaths) {
  const relativePath = toPosix(path.relative(root, absolutePath));
  const body = await readFile(absolutePath, "utf8");
  const missingFacets = missingProtocolFacets(body);
  const execution = await isExecutionReady(artifactId(relativePath));
  artifacts.push({
    id: artifactId(relativePath),
    path: relativePath,
    title: body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? path.basename(relativePath),
    protocolComplete: missingFacets.length === 0,
    missingFacets,
    executionReady: execution.ready,
    executionManifest: execution.manifest,
    executionMissing: execution.missing,
    claimSideClaims: new Set(),
    documentSideClaims: new Set(),
  });
}

const artifactByPath = new Map(artifacts.map((artifact) => [artifact.path, artifact]));

function normalizeClaim(number) {
  return `C-${String(Number(number)).padStart(3, "0")}`;
}

const exactClaimLink = /\[C-(\d{1,4})\]\(\.\.\/\.\.\/research\/claims\.md#c-(\d{1,4})\)/g;
const exactClaimRange = /\[C-(\d{1,4})\]\(\.\.\/\.\.\/research\/claims\.md#c-(\d{1,4})\)\s*[–-]\s*\[C-(\d{1,4})\]\(\.\.\/\.\.\/research\/claims\.md#c-(\d{1,4})\)/g;

for (const artifact of artifacts) {
  const body = await readFile(path.join(root, artifact.path), "utf8");
  for (const match of body.matchAll(exactClaimLink)) {
    if (Number(match[1]) === Number(match[2])) {
      artifact.documentSideClaims.add(normalizeClaim(match[1]));
    }
  }
  for (const match of body.matchAll(exactClaimRange)) {
    const start = Number(match[1]);
    const startAnchor = Number(match[2]);
    const end = Number(match[3]);
    const endAnchor = Number(match[4]);
    if (start !== startAnchor || end !== endAnchor || end < start) continue;
    for (let number = start; number <= end; number += 1) {
      artifact.documentSideClaims.add(normalizeClaim(number));
    }
  }
}

const claimsBody = await readFile(path.join(root, "research", "claims.md"), "utf8");
const claimMatches = [
  ...claimsBody.matchAll(/^### (C-\d{3,4})\s*\r?\n([\s\S]*?)(?=^### C-|(?![\s\S]))/gm),
];
const claimRecords = claimMatches.map((match) => {
  const id = match[1];
  const links = [...match[2].matchAll(/\.\.\/(experiments\/(?:candidates|fixtures)\/[^)\s]+\.md)/g)]
    .map((link) => link[1])
    .filter((link, index, all) => all.indexOf(link) === index);
  const claimSideArtifacts = links.map((link) => artifactByPath.get(link)).filter(Boolean);
  for (const artifact of claimSideArtifacts) artifact.claimSideClaims.add(id);
  const status = match[2].match(/^- \*\*Status:\*\*\s*([^\s,.;]+)/m)?.[1]?.toLowerCase() ?? "unknown";
  return { id, status, claimSideArtifacts };
});

const claims = claimRecords.map(({ id, status, claimSideArtifacts }) => {
  const linkedArtifacts = artifacts.filter(
    (artifact) =>
      artifact.documentSideClaims.has(id) || claimSideArtifacts.includes(artifact),
  );
  const executionReady = linkedArtifacts.some((artifact) => artifact.executionReady);
  const protocolCovered = linkedArtifacts.some((artifact) => artifact.protocolComplete);
  const tier = executionReady
    ? "workstation-executable"
    : protocolCovered
      ? "protocol-complete"
      : linkedArtifacts.length
        ? "linked-description"
        : "ledger-only";
  return {
    id,
    status,
    tier,
    testRouted: linkedArtifacts.length > 0,
    protocolCovered,
    executionReady,
    artifacts: linkedArtifacts.map((artifact) => artifact.id),
  };
});

const tierCounts = Object.fromEntries(
  ["ledger-only", "linked-description", "protocol-complete", "workstation-executable"].map(
    (tier) => [tier, claims.filter((claim) => claim.tier === tier).length],
  ),
);
const claimSideLinked = claims.filter((claim) =>
  artifacts.some((artifact) => artifact.claimSideClaims.has(claim.id)),
).length;
const documentSideLinked = claims.filter((claim) =>
  artifacts.some((artifact) => artifact.documentSideClaims.has(claim.id)),
).length;
const reciprocalClaims = claims.filter((claim) =>
  artifacts.some(
    (artifact) => artifact.claimSideClaims.has(claim.id) && artifact.documentSideClaims.has(claim.id),
  ),
).length;

const counts = {
  claims: claims.length,
  testRouted: claims.filter((claim) => claim.testRouted).length,
  protocolCovered: claims.filter((claim) => claim.protocolCovered).length,
  executionReady: claims.filter((claim) => claim.executionReady).length,
  tierCounts,
  artifacts: artifacts.length,
  protocolCompleteArtifacts: artifacts.filter((artifact) => artifact.protocolComplete).length,
  executionReadyArtifacts: artifacts.filter((artifact) => artifact.executionReady).length,
  claimSideLinked,
  documentSideLinked,
  reciprocalClaims,
};

const unrouted = claims.filter((claim) => !claim.testRouted);
const jsonReport = {
  schema: 1,
  criteria: {
    protocolComplete: facetRules.map(({ id, label }) => ({ id, label })),
    executionReady: ["command", "environment", "hardware", "seeds", "data", "outputs"],
  },
  counts,
  artifacts: artifacts.map((artifact) => ({
    id: artifact.id,
    path: artifact.path,
    title: artifact.title,
    protocolComplete: artifact.protocolComplete,
    missingFacets: artifact.missingFacets,
    executionReady: artifact.executionReady,
    executionManifest: artifact.executionManifest,
    executionMissing: artifact.executionMissing,
    claimSideClaims: [...artifact.claimSideClaims].sort(),
    documentSideClaims: [...artifact.documentSideClaims].sort(),
    linkedClaims: [...new Set([...artifact.claimSideClaims, ...artifact.documentSideClaims])].sort(),
  })),
  claims,
};

function percent(value, total) {
  return `${((value / total) * 100).toFixed(1)}%`;
}

function artifactLink(artifact) {
  return `[${artifact.id}](${artifact.path.replace(/^experiments\//, "")})`;
}

const artifactRows = artifacts
  .map((artifact) => {
    const status = artifact.protocolComplete
      ? "complete description"
      : `incomplete: ${artifact.missingFacets.join(", ")}`;
    const linkedClaims = new Set([
      ...artifact.claimSideClaims,
      ...artifact.documentSideClaims,
    ]).size;
    return `| ${artifactLink(artifact)} | ${linkedClaims} | ${status} | ${artifact.executionReady ? "ready" : "not executable"} |`;
  })
  .join("\n");

const markdownReport = `# Test coverage\n\nThis report is generated from the central claim ledger and the experiment\ndocuments. It distinguishes a written protocol from runnable software. Re-run\n\`npm run audit:tests\` after changing claim links or experiment contracts.\n\n## Current answer\n\nThe four rows below are mutually exclusive highest-reached tiers.\n\n| Highest coverage tier | Claims | Share of ${counts.claims} | Meaning |\n| --- | ---: | ---: | --- |\n| ledger-only | ${tierCounts["ledger-only"]} | ${percent(tierCounts["ledger-only"], counts.claims)} | no exact direct relation to a numbered experiment artifact |\n| linked test description | ${tierCounts["linked-description"]} | ${percent(tierCounts["linked-description"], counts.claims)} | related experiment prose exists, but at least one required protocol facet is absent |\n| protocol-complete test contract | ${tierCounts["protocol-complete"]} | ${percent(tierCounts["protocol-complete"], counts.claims)} | at least one linked artifact contains all eight required facets |\n| workstation-executable | ${tierCounts["workstation-executable"]} | ${percent(tierCounts["workstation-executable"], counts.claims)} | checked execution manifest and runnable scientific harness exist |\n\nThe short answer is therefore **${counts.protocolCovered} claims have a complete\ntest description, but ${counts.executionReady} are executable on the workstation**.\nAcross both description tiers, ${counts.testRouted} claims have an exact direct\nrelation to at least one experiment artifact. These are aggregate candidate\ntests: they evaluate engineering translations supported by several claims; they\ndo not independently reproduce every source paper.\n\n## What “complete test description” means\n\nA protocol passes only when the document contains all of the following:\n\n${facetRules.map(({ label }) => `- ${label};`).join("\n")}\n\nThe gate scans explicit H2/H3 sections. Cost reporting alone does not satisfy\nresource parity, and a statistical null is not a confirmatory analysis plan.\nThis is a structural completeness gate, not proof that the design is correct.\nA workstation-ready test additionally needs a machine-readable manifest naming\nthe command, environment, hardware assumptions, seeds, data, and outputs.\n\n## Traceability method\n\nA relation exists when either side states it exactly:\n\n1. a claim block links a numbered candidate or fixture; or\n2. an artifact links an exact claim label to the matching claim anchor.\n\nInclusive ranges are expanded only when both endpoints have exact matching\nlinks. Prose numbers and indirect adoption-matrix associations do not count.\nThe union yields ${counts.testRouted} linked claims: ${counts.claimSideLinked}\nappear on the claim side, ${counts.documentSideLinked} on the document side, and\n${counts.reciprocalClaims} have at least one reciprocal same-artifact relation.\n\n## Artifact coverage\n\nThere are ${counts.artifacts} experiment artifacts: ${counts.protocolCompleteArtifacts}\npass the written-protocol gate, and ${counts.executionReadyArtifacts} pass the\nexecution gate.\n\n| Artifact | Directly related claims | Protocol status | Execution status |\n| --- | ---: | --- | --- |\n${artifactRows}\n\n## Immediate gaps\n\n- ${unrouted.length} claims remain ledger-only. The machine report retains their\n  exact IDs and evidence status.\n- ${tierCounts["linked-description"]} claims reach only a partial description.\n  The missing facets are concentrated in ${artifacts.filter((artifact) => !artifact.protocolComplete).map((artifact) => `\`${artifact.id}\` (${artifact.missingFacets.join(", ")})`).join(", ") || "no artifact"}.\n- No execution manifests, runners, frozen environments, seed packs, or raw-output\n  schemas exist yet. The [workstation contract](workstation/README.md) defines\n  the next layer without pretending that prose is runnable.\n\n## Machine-readable report\n\n[\`test-coverage.json\`](test-coverage.json) contains every claim-to-artifact\nmapping, the per-artifact facet result, and execution readiness.\n`;

const outputs = [
  [path.join(root, "experiments", "test-coverage.json"), `${JSON.stringify(jsonReport, null, 2)}\n`],
  [path.join(root, "experiments", "test-coverage.md"), markdownReport],
];

let stale = false;
for (const [outputPath, expected] of outputs) {
  if (checkOnly) {
    let current = "";
    try {
      current = await readFile(outputPath, "utf8");
    } catch {
      stale = true;
      console.error(`Missing generated report: ${toPosix(path.relative(root, outputPath))}`);
      continue;
    }
    if (current !== expected) {
      stale = true;
      console.error(`Stale generated report: ${toPosix(path.relative(root, outputPath))}`);
    }
  } else {
    await writeFile(outputPath, expected, "utf8");
  }
}

if (stale) process.exitCode = 1;
else console.log(`${counts.protocolCovered}/${counts.claims} claims are protocol-covered; ${counts.executionReady} are workstation-executable.`);

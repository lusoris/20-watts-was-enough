export const FIXTURE_027_TRACK_IDS = Object.freeze(Array.from(
  { length: 10 },
  (_, index) => `RIN-T${String(index + 1).padStart(2, "0")}`,
));

export const FIXTURE_027_EVIDENCE_IDS = Object.freeze(Array.from(
  { length: 10 },
  (_, index) => `RIN-E${String(index + 1).padStart(2, "0")}`,
));

export const FIXTURE_027_IMPLEMENTED_TRACKS = Object.freeze(["RIN-T01"]);

export const FIXTURE_027_TRACK_CLAIMS = Object.freeze(Object.fromEntries(
  FIXTURE_027_TRACK_IDS.map((track, index) => [track, `C-${1550 + index}`]),
));

export function extractFixture027Registry(markdown) {
  if (typeof markdown !== "string") throw new TypeError("Fixture 027 registry source must be Markdown.");
  const rows = [];
  for (const line of markdown.split(/\r?\n/u)) {
    const match = /^\| (RIN-T\d{2}) \| (RIN-E\d{2}) \| (C-\d{4}) \| .+ \| (NO_RESULT) \|$/u.exec(line);
    if (match) rows.push(Object.freeze({
      track: match[1],
      evidence: match[2],
      claim: match[3],
      result: match[4],
    }));
  }
  return Object.freeze({
    fixture: "F-027",
    declared_range_present: markdown.includes("- **Protocol IDs:** RIN-T01--RIN-T10"),
    rows: Object.freeze(rows),
  });
}

export function assertFixture027Registry(registry) {
  if (
    registry?.fixture !== "F-027"
    || registry.declared_range_present !== true
    || !Array.isArray(registry.rows)
    || registry.rows.length !== 10
  ) throw new Error("Fixture 027 protocol registry is incomplete.");
  for (const [index, row] of registry.rows.entries()) {
    if (
      row.track !== FIXTURE_027_TRACK_IDS[index]
      || row.evidence !== FIXTURE_027_EVIDENCE_IDS[index]
      || row.claim !== FIXTURE_027_TRACK_CLAIMS[row.track]
      || row.result !== "NO_RESULT"
    ) throw new Error("Fixture 027 protocol registry ordering or authority differs from the closed RIN registry.");
  }
  return registry;
}

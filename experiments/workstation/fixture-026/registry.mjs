export const FIXTURE_026_TRACK_IDS = Object.freeze(Array.from(
  { length: 10 },
  (_, index) => `RSD-T${String(index + 1).padStart(2, "0")}`,
));

export const FIXTURE_026_TRACK_CLAIMS = Object.freeze(Object.fromEntries(
  FIXTURE_026_TRACK_IDS.map((track, index) => [track, `C-${1540 + index}`]),
));

export const FIXTURE_026_IMPLEMENTED_TRACKS = Object.freeze(["RSD-T01"]);

export function extractFixture026Registry(markdown) {
  if (typeof markdown !== "string") throw new TypeError("Fixture 026 registry source must be Markdown.");
  const rows = [];
  for (const line of markdown.split(/\r?\n/u)) {
    const match = /^\| (RSD-T\d{2}) \| (C-\d{4}) \| .+ \|$/u.exec(line);
    if (match) rows.push(Object.freeze({
      track: match[1],
      claim: match[2],
      result: "NO_RESULT",
    }));
  }
  return Object.freeze({
    fixture: "F-026",
    declared_range_present: markdown.includes("- **Protocol IDs:** `RSD-T01`--`RSD-T10`"),
    rows: Object.freeze(rows),
  });
}

export function assertFixture026Registry(registry) {
  if (
    registry?.fixture !== "F-026"
    || registry.declared_range_present !== true
    || !Array.isArray(registry.rows)
    || registry.rows.length !== 10
  ) throw new Error("Fixture 026 protocol registry is incomplete.");
  for (const [index, row] of registry.rows.entries()) {
    if (
      row.track !== FIXTURE_026_TRACK_IDS[index]
      || row.claim !== FIXTURE_026_TRACK_CLAIMS[row.track]
      || row.result !== "NO_RESULT"
    ) throw new Error("Fixture 026 protocol registry differs from the closed RSD registry.");
  }
  return registry;
}

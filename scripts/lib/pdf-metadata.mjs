const chromiumTimestampPattern = /\/(CreationDate|ModDate) \(D:\d{14}\+00'00'\)/gu;
const chromiumStructureIdPattern = /\(node\d{8}\)/gu;

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function pdfTimestamp(releaseDate) {
  invariant(
    typeof releaseDate === "string" && /^\d{4}-\d{2}-\d{2}$/u.test(releaseDate),
    "PDF release date must use YYYY-MM-DD.",
  );
  const parsed = new Date(`${releaseDate}T00:00:00Z`);
  invariant(
    !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === releaseDate,
    "PDF release date must be a real calendar date.",
  );
  return `D:${releaseDate.replaceAll("-", "")}000000+00'00'`;
}

export function normalizeChromiumPdfMetadata(bytes, releaseDate) {
  const input = Buffer.from(bytes);
  const timestamp = pdfTimestamp(releaseDate);
  const names = [];
  const source = input.toString("latin1");
  const normalized = source.replace(
    chromiumTimestampPattern,
    (entry, name) => {
      names.push(name);
      const replacement = `/${name} (${timestamp})`;
      invariant(
        Buffer.byteLength(replacement, "latin1") === Buffer.byteLength(entry, "latin1"),
        `Normalized PDF ${name} metadata changed byte length.`,
      );
      return replacement;
    },
  );
  invariant(
    names.length === 2 && names.includes("CreationDate") && names.includes("ModDate"),
    "Chromium PDF must contain exactly one CreationDate and one ModDate UTC metadata field.",
  );
  const structureIds = new Map();
  const canonical = normalized.replace(chromiumStructureIdPattern, (identifier) => {
    if (!structureIds.has(identifier)) {
      structureIds.set(
        identifier,
        `(node${String(structureIds.size).padStart(8, "0")})`,
      );
    }
    return structureIds.get(identifier);
  });
  const output = Buffer.from(canonical, "latin1");
  invariant(output.length === input.length, "Normalized PDF byte length changed.");
  return output;
}

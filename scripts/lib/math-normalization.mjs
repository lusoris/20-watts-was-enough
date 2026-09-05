import { randomUUID } from "node:crypto";
import { lstat, open, rename, rm } from "node:fs/promises";
import { assertMathInventoryUnchanged, loadMathDocuments, maskMarkdownCode, readMathSnapshot, unchangedMathSnapshot } from "./math-markdown.mjs";

export function normalizeMathText(source, limits = {}) {
  const masked = maskMarkdownCode(source, limits);
  const edits = [];
  for (const match of masked.matchAll(/^([ \t]*)\\(\[|])[ \t]*(?=\r?$)/gm)) {
    if (source.slice(match.index, match.index + match[0].length) !== match[0]) continue;
    edits.push({ start: match.index, end: match.index + match[0].length, value: `${match[1]}$$` });
  }
  for (const match of masked.matchAll(/\\\(([^\r\n]*?)\\\)/g)) {
    edits.push({ start: match.index, end: match.index + match[0].length,
      value: `$${source.slice(match.index + 2, match.index + match[0].length - 2)}$` });
  }
  edits.sort((left, right) => left.start - right.start);
  const chunks = [];
  let offset = 0;
  for (const edit of edits) {
    if (edit.start < offset) throw new Error("Overlapping math delimiter edits");
    chunks.push(source.slice(offset, edit.start), edit.value);
    offset = edit.end;
  }
  return chunks.join("") + source.slice(offset);
}

async function removeOwnedStage(stage, identity, operations) {
  let named;
  try {
    named = await operations.lstat(stage, { bigint: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  if (!identity || !named.isFile() || named.isSymbolicLink()
      || named.dev !== identity.dev || named.ino !== identity.ino) {
    throw new Error(`Math normalizer stage changed identity; retained ${stage}`);
  }
  await operations.rm(stage);
}

// Replacement is atomic per file on a cooperative filesystem, not a repository transaction.
export async function replaceNormalizedMath(document, after, overrides = {}) {
  const operations = { lstat, open, rename, rm, ...overrides };
  const stage = `${document.file}.math-${randomUUID()}.tmp`;
  let handle;
  let owned = false;
  let identity;
  let failure;
  try {
    const beforeStage = await readMathSnapshot(document.file);
    if (!unchangedMathSnapshot(document, beforeStage)) throw new Error(`Math Markdown changed before staging: ${document.relative}`);
    handle = await operations.open(stage, "wx", 0o600);
    owned = true;
    identity = await handle.stat({ bigint: true });
    await handle.writeFile(after, "utf8");
    await handle.chmod(Number(document.identity.mode & 0o777n));
    await handle.close();
    handle = undefined;
    const staged = await readMathSnapshot(stage);
    if (staged.identity.dev !== identity.dev || staged.identity.ino !== identity.ino || staged.body !== after) {
      throw new Error(`Math normalizer stage changed before replacement: ${stage}`);
    }
    const current = await readMathSnapshot(document.file);
    if (!unchangedMathSnapshot(document, current)) throw new Error(`Math Markdown changed before replacement: ${document.relative}`);
    await operations.rename(stage, document.file);
    owned = false;
  } catch (error) {
    failure = error;
  } finally {
    const cleanup = [];
    try { await handle?.close(); } catch (error) { cleanup.push(error); }
    try { if (owned) await removeOwnedStage(stage, identity, operations); } catch (error) { cleanup.push(error); }
    if (cleanup.length > 0) failure = new AggregateError(
      [...(failure ? [failure] : []), ...cleanup],
      `${failure?.message ?? "Math normalization"}; stage cleanup failed: ${cleanup.map((error) => error.message).join("; ")}`,
    );
  }
  if (failure) throw failure;
}

export async function normalizeMathRepository(root, {
  write = false, limits = {}, replace = replaceNormalizedMath, load = loadMathDocuments,
} = {}) {
  const inventory = await load(root, limits);
  const changes = [];
  let pathBytes = 0;
  for (const document of inventory.documents) {
    const after = normalizeMathText(document.body, inventory.limits);
    if (after === document.body) continue;
    pathBytes += Buffer.byteLength(document.relative) + 3;
    if (pathBytes > inventory.limits.maximumDiagnosticBytes) throw new Error("Math normalizer changed-path output limit exceeded");
    changes.push({ document, after });
  }
  let completed = 0;
  await assertMathInventoryUnchanged(inventory);
  if (write) {
    try {
      for (const { document, after } of changes) {
        await replace(document, after);
        completed += 1;
      }
    } catch (error) {
      const earlier = changes.slice(0, completed).map(({ document }) => document.relative).join(", ");
      throw new Error(`Math normalization failed after ${completed} file replacements${earlier ? ` (${earlier})` : ""}: ${error.message}`, { cause: error });
    }
  }
  return changes.map(({ document }) => document.relative);
}

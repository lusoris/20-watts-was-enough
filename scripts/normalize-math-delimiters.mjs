import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const write = process.argv.includes("--write");
const ignoredDirectories = new Set([
  ".git",
  ".next",
  "dist",
  "node_modules",
  "sources",
]);

async function collectMarkdown(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectMarkdown(absolute)));
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(absolute);
  }
  return files;
}

function normalizeOutsideCodeFences(markdown) {
  const chunks = markdown.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g);
  return chunks
    .map((chunk, index) => {
      if (index % 2 === 1) return chunk;
      return chunk
        .replace(/(^[ \t]*)\\\[[ \t]*$/gm, (_match, indent) => `${indent}$$`)
        .replace(/(^[ \t]*)\\\][ \t]*$/gm, (_match, indent) => `${indent}$$`)
        .replace(/\\\(([^\r\n]*?)\\\)/g, (_match, source) => `$${source}$`);
    })
    .join("");
}

const changed = [];
for (const file of await collectMarkdown(root)) {
  const before = await readFile(file, "utf8");
  const after = normalizeOutsideCodeFences(before);
  if (after === before) continue;
  changed.push(path.relative(root, file));
  if (write) await writeFile(file, after, "utf8");
}

if (!write && changed.length > 0) {
  console.error(
    `${changed.length} Markdown file(s) still use site-incompatible math delimiters:\n${changed.map((file) => `- ${file}`).join("\n")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `${write ? "Normalized" : "Checked"} math delimiters in ${changed.length} Markdown file(s).`,
  );
}

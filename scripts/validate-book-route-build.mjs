import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serverRoot = path.join(projectRoot, "dist", "server");
const clientRoot = path.join(projectRoot, "dist", "client");
const serverManifest = JSON.parse(
  await readFile(path.join(serverRoot, ".vite", "manifest.json"), "utf8"),
);
const clientManifest = JSON.parse(
  await readFile(path.join(clientRoot, ".vite", "manifest.json"), "utf8"),
);

const page = serverManifest["app/book/page.tsx"];
const loader = clientManifest["app/components/book-loader.tsx"];
const edition = clientManifest["app/components/book-edition.tsx"];
assert.ok(page, "The compiled /book server entry is missing.");
assert.ok(loader, "The compiled book loader is missing.");
assert.ok(edition, "The compiled browser book edition is missing.");

const reachable = new Set();
const pending = ["app/book/page.tsx"];
while (pending.length) {
  const key = pending.pop();
  if (!key || reachable.has(key)) continue;
  reachable.add(key);
  for (const dependency of serverManifest[key]?.imports ?? []) {
    pending.push(dependency);
  }
}

assert.equal(
  [...reachable].some((entry) => /book-edition|book-content|app\/content/.test(entry)),
  false,
  "The /book Worker graph must not statically reach the full book corpus.",
);
assert.deepEqual(
  loader.dynamicImports,
  ["app/components/book-edition.tsx"],
  "The full browser edition must remain one explicit dynamic import.",
);
assert.equal(
  (loader.imports ?? []).includes("app/components/book-edition.tsx"),
  false,
  "The full browser edition leaked into the loader's static imports.",
);
assert.equal(edition.isDynamicEntry, true);

const pageBytes = (await stat(path.join(serverRoot, page.file))).size;
const loaderBytes = (await stat(path.join(clientRoot, loader.file))).size;
const editionBytes = (await stat(path.join(clientRoot, edition.file))).size;
assert.ok(pageBytes < 100_000, `The /book server entry grew to ${pageBytes} bytes.`);
assert.ok(loaderBytes < 100_000, `The book loader grew to ${loaderBytes} bytes.`);
assert.ok(
  editionBytes < 3_000_000,
  `The browser book corpus grew to ${editionBytes} bytes; only book sources belong here.`,
);

const rscAssets = await readFile(
  path.join(serverRoot, "__vite_rsc_assets_manifest.js"),
  "utf8",
);
assert.match(rscAssets, new RegExp(path.basename(loader.file).replaceAll(".", "\\.")));
assert.doesNotMatch(
  rscAssets,
  new RegExp(path.basename(edition.file).replaceAll(".", "\\.")),
  "The complete edition must not be an eager RSC dependency.",
);

console.log(
  `Book route build: ${pageBytes} B server entry, ${loaderBytes} B loader, ${editionBytes} B lazy corpus.`,
);

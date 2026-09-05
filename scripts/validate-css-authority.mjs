import { readFile } from "node:fs/promises";

import {
  validateCssAuthority,
  validateCssEntryImports,
} from "./lib/css-authority.mjs";

const [globalSource, portalSource, pagesEntry, helpEntry] = await Promise.all([
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../app/portal.css", import.meta.url), "utf8"),
  readFile(new URL("../github-pages/main.tsx", import.meta.url), "utf8"),
  readFile(new URL("../github-pages/help.css", import.meta.url), "utf8"),
]);
const result = validateCssAuthority({ globalSource, portalSource });
result.errors.push(...validateCssEntryImports({ helpEntry, pagesEntry }));

for (const [name, inventory] of [["globals", result.global], ["portal", result.portal]]) {
  console.log(
    `${name}: ${inventory.lineCount} lines, ${inventory.ruleCount} rules, `
      + `${inventory.selectorCount} selectors, ${inventory.uniqueScopedSelectorCount} unique scoped selectors`,
  );
  console.log(`${name} media scopes: ${JSON.stringify(inventory.mediaScopes)}`);
}

if (result.errors.length > 0) {
  throw new Error(`CSS authority validation failed:\n- ${result.errors.join("\n- ")}`);
}

console.log("CSS authority validation passed.");

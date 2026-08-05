import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import katex from "katex";

const root = process.cwd();
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

function maskCodeFences(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, (block) =>
    block.replace(/[^\n]/g, " "),
  );
}

function lineAt(text, offset) {
  return text.slice(0, offset).split("\n").length;
}

const suspiciousCommands = [
  {
    pattern: /(^|[^\\A-Za-z])(?:quad|qquad|land|lor|mid)(?=\s|$)/,
    message: "likely missing backslash before a spacing or relation command",
  },
  {
    pattern:
      /(^|[^\\])\b(?:frac|mathrm|mathbf|operatorname|text|mathcal|mathbb)\s*\{/,
    message: "likely missing backslash before a LaTeX command",
  },
  {
    pattern: /(^|[^\\])\b(?:sum|prod|inf|argmin|argmax)\s*_/,
    message: "likely missing backslash before an operator",
  },
  {
    pattern:
      /(^|[^\\A-Za-z])(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|rho|sigma|tau|upsilon|phi|chi|psi|omega)(?=\s|[_^,;=+\-*/)]|$)/,
    message: "likely missing backslash before a Greek symbol",
  },
];

const files = await collectMarkdown(root);
const failures = [];
let equationCount = 0;
let inlineEquationCount = 0;
let fileCount = 0;

for (const file of files) {
  const markdown = await readFile(file, "utf8");
  const masked = maskCodeFences(markdown);
  const delimiters = masked.match(/\$\$/g)?.length ?? 0;

  if (delimiters % 2 !== 0) {
    failures.push(`${path.relative(root, file)}: unbalanced $$ delimiters`);
    continue;
  }

  let matchedInFile = 0;
  for (const match of masked.matchAll(/\$\$([\s\S]*?)\$\$/g)) {
    const source = match[1].trim();
    const line = lineAt(masked, match.index ?? 0);
    matchedInFile += 1;
    equationCount += 1;

    for (const check of suspiciousCommands) {
      if (check.pattern.test(source)) {
        failures.push(
          `${path.relative(root, file)}:${line}: ${check.message}`,
        );
      }
    }

    try {
      katex.renderToString(source, {
        displayMode: true,
        output: "html",
        strict: "error",
        throwOnError: true,
        trust: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${path.relative(root, file)}:${line}: ${message}`);
    }
  }

  const inlineMasked = masked.replace(/\$\$[\s\S]*?\$\$/g, (block) =>
    block.replace(/[^\n]/g, " "),
  );
  for (const match of inlineMasked.matchAll(
    /(?<!\\)\$(?!\$)([^$\n]*?)(?<!\\)\$(?!\$)/g,
  )) {
    const source = match[1].trim();
    const line = lineAt(inlineMasked, match.index ?? 0);
    inlineEquationCount += 1;

    for (const check of suspiciousCommands) {
      if (check.pattern.test(source)) {
        failures.push(
          `${path.relative(root, file)}:${line}: ${check.message}`,
        );
      }
    }

    try {
      katex.renderToString(source, {
        displayMode: false,
        output: "html",
        strict: "error",
        throwOnError: true,
        trust: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${path.relative(root, file)}:${line}: ${message}`);
    }
  }

  if (matchedInFile > 0) fileCount += 1;
}

if (failures.length > 0) {
  console.error("Mathematical notation validation failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Mathematical notation validation passed: ${equationCount} display and ${inlineEquationCount} inline equations in ${fileCount} display-math Markdown files.`,
  );
}

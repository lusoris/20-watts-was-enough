import katex from "katex";
import { checkedMathLimits, loadMathDocuments, maskMarkdownCode } from "./math-markdown.mjs";

const suspiciousCommands = [
  {
    pattern: /(^|[^\\A-Za-z])(?:quad|qquad|land|lor|mid)(?=\s|$)/,
    message: "likely missing backslash before a spacing or relation command",
  },
  {
    pattern: /(^|[^\\])\b(?:frac|mathrm|mathbf|operatorname|text|mathcal|mathbb)\s*\{/,
    message: "likely missing backslash before a LaTeX command",
  },
  {
    pattern: /(^|[^\\])\b(?:sum|prod|inf|argmin|argmax)\s*_/,
    message: "likely missing backslash before an operator",
  },
  {
    pattern: /(^|[^\\A-Za-z])(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|rho|sigma|tau|upsilon|phi|chi|psi|omega)(?=\s|[_^,;=+\-*/)]|$)/,
    message: "likely missing backslash before a Greek symbol",
  },
];

function lineAt(source, offset) {
  return source.slice(0, offset).split("\n").length;
}

function maskBlock(block) {
  return block.replace(/[^\r\n]/g, " ");
}

function failureCollector(limits, failures) {
  let bytes = 0;
  return (message) => {
    bytes += Buffer.byteLength(message);
    if (failures.length >= limits.maximumDiagnostics || bytes > limits.maximumDiagnosticBytes) {
      throw new Error("Mathematical notation diagnostic limit exceeded");
    }
    failures.push(message);
  };
}

function checkEquation(source, displayMode, location, fail) {
  for (const check of suspiciousCommands) {
    if (check.pattern.test(source)) fail(`${location}: ${check.message}`);
  }
  try {
    katex.renderToString(source, { displayMode, output: "html", strict: "error", throwOnError: true, trust: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`${location}: ${message}`);
  }
}

export function validateMathText(markdown, relative = "document.md", overrides = {}) {
  const limits = checkedMathLimits(overrides);
  const masked = maskMarkdownCode(markdown, limits);
  const result = { failures: [], display: 0, inline: 0 };
  const fail = failureCollector(limits, result.failures);
  for (const match of masked.matchAll(/\\\(|\\\)|^\s*\\\[\s*$|^\s*\\\]\s*$/gm)) {
    fail(`${relative}:${lineAt(masked, match.index)}: unsupported ${match[0].trim()} math delimiter; use $ for inline or $$ for display math so GitHub and the private site render the same source`);
  }
  const delimiters = masked.match(/\$\$/g)?.length ?? 0;
  if (delimiters % 2 !== 0) {
    fail(`${relative}: unbalanced $$ delimiters`);
    return result;
  }
  for (const match of masked.matchAll(/\$\$([\s\S]*?)\$\$/g)) {
    result.display += 1;
    checkEquation(match[1].trim(), true, `${relative}:${lineAt(masked, match.index)}`, fail);
  }
  const inlineMasked = masked.replace(/\$\$[\s\S]*?\$\$/g, maskBlock);
  for (const [index, line] of inlineMasked.split("\n").entries()) {
    const count = line.match(/(?<!\\)\$(?!\$)/g)?.length ?? 0;
    if (count % 2 !== 0) {
      fail(`${relative}:${index + 1}: unbalanced inline $ delimiters; inline math must open and close on the same source line`);
    }
  }
  for (const match of inlineMasked.matchAll(/(?<!\\)\$(?!\$)([^$\n]*?)(?<!\\)\$(?!\$)/g)) {
    result.inline += 1;
    checkEquation(match[1].trim(), false, `${relative}:${lineAt(inlineMasked, match.index)}`, fail);
  }
  return result;
}

export async function validateMathRepository(root, overrides = {}) {
  const inventory = await loadMathDocuments(root, overrides);
  const report = { failures: [], display: 0, inline: 0, displayFiles: 0 };
  const fail = failureCollector(inventory.limits, report.failures);
  for (const document of inventory.documents) {
    const checked = validateMathText(document.body, document.relative, inventory.limits);
    report.display += checked.display;
    report.inline += checked.inline;
    if (checked.display > 0) report.displayFiles += 1;
    for (const failure of checked.failures) fail(failure);
  }
  return report;
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(scriptDirectory, "..");

const proseRoots = [
  "concept",
  "decisions",
  "docs",
  "experiments",
  "math",
  "research",
];

const rootProseFiles = [
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "GOVERNANCE.md",
  "LICENSING.md",
  "MAINTAINERS.md",
  "README.md",
  "SECURITY.md",
  "SUPPORT.md",
];

const suppressionPattern = /<!--\s*prose-audit:\s*ignore-line:\s*([^>\r\n]*?)\s*-->/u;

const phraseRules = [
  ["empty note", /\bit is (?:important|worth) to note\b/giu],
  ["ceremonial opening", /\bin today['’]s (?:rapidly|ever)[^.!?\n]{0,80}\b/giu],
  ["delve", /\bdelv(?:e|es|ed|ing) into\b/giu],
  ["decorative tapestry", /\b(?:rich |complex )?tapestry\b/giu],
  ["marketing role", /\bplays? a (?:crucial|pivotal|vital) role\b/giu],
  ["marketing pathway", /\bpav(?:e|es|ed|ing) the way\b/giu],
  ["canned core", /\bat its core\b/giu],
  ["ceremonial conclusion", /\bin conclusion\b/giu],
  ["importance assertion", /\bthis (?:clearly )?highlights the importance\b/giu],
  ["importance assertion", /\bunderscores? the (?:critical )?(?:importance|need)\b/giu],
  ["marketing unlock", /\bunlock(?:s|ed|ing)? the (?:potential|power)\b/giu],
  ["generic complexity", /\bnavigat(?:e|es|ed|ing) the complexities\b/giu],
  ["decorative realm", /\bin the realm of\b/giu],
  ["decorative testament", /\ba testament to\b/giu],
  [
    "invented project disclaimer",
    /\b(?:we (?:do not|don't) (?:aim|intend|try)|not (?:aimed|intended|trying)) to (?:build|recreate|replicate) (?:a |the )?(?:brain|human brain)\b/giu,
  ],
];

function markdownFiles(directory) {
  const output = [];
  const pending = [directory];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) pending.push(absolute);
      else if (entry.isFile() && entry.name.endsWith(".md")) output.push(absolute);
    }
  }
  return output;
}

function lineAt(source, offset) {
  return 1 + source.slice(0, offset).split("\n").length - 1;
}

function maskRange(characters, start, end) {
  for (let index = start; index < end; index += 1) {
    if (characters[index] !== "\n" && characters[index] !== "\r") characters[index] = " ";
  }
}

function lineRanges(source) {
  const ranges = [];
  const pattern = /.*(?:\r\n|\n|\r|$)/gu;
  for (const match of source.matchAll(pattern)) {
    if (match[0].length > 0) ranges.push([match.index, match.index + match[0].length]);
  }
  return ranges;
}

function fenceOpening(line) {
  return line.match(/^ {0,3}(`{3,}|~{3,})/u)?.[1] ?? null;
}

function isFenceClosing(line, fence) {
  const marker = fence[0] === "`" ? "`" : "~";
  const pattern = new RegExp(`^ {0,3}${marker}{${fence.length},}[ \\t]*$`, "u");
  return pattern.test(line);
}

function hasReasonedSuppression(line) {
  const reason = line.match(suppressionPattern)?.[1].trim() ?? "";
  return reason.length >= 3 && reason.length <= 160;
}

function maskBlockMarkdown(source, characters) {
  let fence = null;
  for (const [start, end] of lineRanges(source)) {
    const line = source.slice(start, end).replace(/[\r\n]+$/u, "");
    if (fence) {
      maskRange(characters, start, end);
      if (isFenceClosing(line, fence)) fence = null;
      continue;
    }
    const opening = fenceOpening(line);
    const protectedLine = opening
      || /^(?: {4}|\t)/u.test(line)
      || /^ {0,3}>/u.test(line)
      || hasReasonedSuppression(line);
    if (!protectedLine) continue;
    maskRange(characters, start, end);
    if (opening) fence = opening;
  }
}

function isEscaped(source, offset) {
  let backslashes = 0;
  for (let index = offset - 1; index >= 0 && source[index] === "\\"; index -= 1) backslashes += 1;
  return backslashes % 2 === 1;
}

function closingDelimiterOffset(source, characters, delimiter, start) {
  let candidate = source.indexOf(delimiter, start);
  while (candidate >= 0) {
    const available = characters.slice(candidate, candidate + delimiter.length).join("") === delimiter;
    const exactRun = source[candidate - 1] !== "`"
      && source[candidate + delimiter.length] !== "`";
    if (available && exactRun) return candidate;
    candidate = source.indexOf(delimiter, candidate + delimiter.length);
  }
  return -1;
}

function maskInlineCode(source, characters) {
  let offset = 0;
  while (offset < source.length) {
    if (characters[offset] !== "`" || isEscaped(source, offset)) {
      offset += 1;
      continue;
    }
    let delimiterEnd = offset;
    while (characters[delimiterEnd] === "`") delimiterEnd += 1;
    const delimiter = "`".repeat(delimiterEnd - offset);
    const closing = closingDelimiterOffset(source, characters, delimiter, delimiterEnd);
    if (closing < 0) {
      offset = delimiterEnd;
      continue;
    }
    maskRange(characters, offset, closing + delimiter.length);
    offset = closing + delimiter.length;
  }
}

function searchableMarkdown(source) {
  const characters = source.split("");
  maskBlockMarkdown(source, characters);
  maskInlineCode(source, characters);
  return characters.join("");
}

export function auditText(source, relativePath = "prose.md") {
  const findings = [];
  const searchable = searchableMarkdown(source);
  for (const [rule, pattern] of phraseRules) {
    pattern.lastIndex = 0;
    for (const match of searchable.matchAll(pattern)) {
      findings.push({
        file: relativePath,
        line: lineAt(source, match.index),
        phrase: source.slice(match.index, match.index + match[0].length),
        rule,
      });
    }
  }
  return findings;
}

export function auditRepository(root = defaultRoot) {
  const files = rootProseFiles.map((name) => path.join(root, name));
  for (const directory of proseRoots) files.push(...markdownFiles(path.join(root, directory)));
  return files.flatMap((absolute) => {
    const relative = path.relative(root, absolute).replaceAll("\\", "/");
    return auditText(fs.readFileSync(absolute, "utf8"), relative);
  });
}

function main() {
  const findings = auditRepository();
  if (findings.length === 0) {
    console.log("Prose-style check passed.");
    return;
  }
  console.error(`Prose-style check failed with ${findings.length} finding(s):`);
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} [${finding.rule}] ${JSON.stringify(finding.phrase)}`);
  }
  process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

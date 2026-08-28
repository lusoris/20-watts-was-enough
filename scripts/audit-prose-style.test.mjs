import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { auditRepository, auditText } from "./audit-prose-style.mjs";

const proseRoots = ["concept", "decisions", "docs", "experiments", "math", "research"];
const rootProseFiles = [
  "CODE_OF_CONDUCT.md", "CONTRIBUTING.md", "GOVERNANCE.md", "LICENSING.md",
  "MAINTAINERS.md", "README.md", "SECURITY.md", "SUPPORT.md",
];

function fixtureRoot() {
  const root = mkdtempSync(path.join(tmpdir(), "prose-audit-"));
  for (const directory of [...proseRoots, "sources", "scripts"]) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  for (const file of rootProseFiles) writeFileSync(path.join(root, file), "Direct prose.\n", "utf8");
  return root;
}

test("prose audit accepts direct technical writing", () => {
  assert.deepEqual(auditText(
    "Routing cost rises when the controller opens more experts. Measure that cost at the wall outlet.",
    "concept/example.md",
  ), []);
});

test("prose audit reports high-confidence filler with locations", () => {
  const findings = auditText([
    "The controller allocates experts.",
    "It is important to note that this plays a crucial role.",
  ].join("\n"), "concept/example.md");
  assert.deepEqual(findings, [
    {
      file: "concept/example.md",
      line: 2,
      phrase: "It is important to note",
      rule: "empty note",
    },
    {
      file: "concept/example.md",
      line: 2,
      phrase: "plays a crucial role",
      rule: "marketing role",
    },
  ]);
});

test("prose audit rejects the recurring invented project disclaimer", () => {
  const findings = auditText(
    "We do not aim to recreate a human brain.",
    "README.md",
  );
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "invented project disclaimer");
});

test("prose audit protects Markdown code and attributed blockquotes", () => {
  const source = [
    "Direct prose remains visible.",
    "`It is important to note` is a literal fixture.",
    "    In conclusion, this is indented code.",
    "```text",
    "This plays a crucial role in a captured response.",
    "```",
    "> Smith (2020): ‘At its core, the mechanism is conditional.’",
    "~~~",
    "Paving the way",
    "~~~",
  ].join("\n");
  assert.deepEqual(auditText(source), []);
});

test("one-line suppression requires a concrete reason and stays local", () => {
  const source = [
    "We do not aim to recreate a human brain. <!-- prose-audit: ignore-line: necessary contrast with the cited baseline -->",
    "In conclusion, the second line remains auditable.",
    "At its core. <!-- prose-audit: ignore-line: x -->",
  ].join("\n");
  const findings = auditText(source);
  assert.deepEqual(findings.map(({ line, rule }) => ({ line, rule }))
    .toSorted((left, right) => left.line - right.line), [
    { line: 2, rule: "ceremonial conclusion" },
    { line: 3, rule: "canned core" },
  ]);
});

test("line reporting remains tied to the original Markdown", () => {
  const source = "```text\nIn conclusion\n```\n\nRouting is bounded.\nThis highlights the importance of measurement.\n";
  assert.deepEqual(auditText(source, "concept/example.md").map(({ line, phrase }) => ({ line, phrase })), [
    { line: 6, phrase: "This highlights the importance" },
  ]);
});

test("repository traversal includes canonical Markdown and excludes sources", () => {
  const root = fixtureRoot();
  writeFileSync(path.join(root, "concept", "nested.md"), "In conclusion.\n", "utf8");
  writeFileSync(path.join(root, "LICENSING.md"), "At its core.\n", "utf8");
  writeFileSync(path.join(root, "sources", "import.md"), "It is important to note.\n", "utf8");
  assert.deepEqual(auditRepository(root).map(({ file, rule }) => ({ file, rule })), [
    { file: "LICENSING.md", rule: "canned core" },
    { file: "concept/nested.md", rule: "ceremonial conclusion" },
  ]);
});

test("CLI exits zero for direct prose and non-zero with actionable findings", (t) => {
  const root = fixtureRoot();
  const copiedScript = path.join(root, "scripts", "audit-prose-style.mjs");
  cpSync("scripts/audit-prose-style.mjs", copiedScript);
  const clean = spawnSync(process.execPath, [copiedScript], { cwd: root, encoding: "utf8" });
  if (clean.error?.code === "EPERM") {
    t.skip("the managed local sandbox blocks nested process creation; CI runs this boundary");
    return;
  }
  assert.ifError(clean.error);
  assert.equal(clean.status, 0, clean.stderr);
  assert.match(clean.stdout, /Prose-style check passed/u);

  writeFileSync(path.join(root, "math", "failure.md"), "In conclusion.\n", "utf8");
  const failed = spawnSync(process.execPath, [copiedScript], { cwd: root, encoding: "utf8" });
  assert.ifError(failed.error);
  assert.equal(failed.status, 1, failed.stdout);
  assert.match(failed.stderr, /math\/failure\.md:1 \[ceremonial conclusion\]/u);
});

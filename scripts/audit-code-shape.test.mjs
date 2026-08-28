import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import {
  aggregateFindings,
  BASELINE_SCHEMA_VERSION,
  CODE_SHAPE_POLICY,
  compareSnapshots,
  runCodeShapeAudit,
  validateBaseline,
} from "./audit-code-shape.mjs";

function snapshot(findings, auditedFileCount = 10) {
  return {
    schemaVersion: BASELINE_SCHEMA_VERSION,
    policy: { ...CODE_SHAPE_POLICY },
    auditedFileCount,
    findings,
  };
}

function finding(rule, count, maxActual, file = "scripts/example.mjs") {
  return { path: file, rule, count, maxActual };
}

test("a new finding count fails the no-regression comparison", () => {
  const baseline = snapshot([finding("complexity", 1, 31)]);
  const current = snapshot([finding("complexity", 2, 31)]);
  assert.deepEqual(compareSnapshots(baseline, current), [
    "scripts/example.mjs · complexity: finding count 1 -> 2",
  ]);
});

test("a worsened maximum fails even when the count is unchanged", () => {
  const baseline = snapshot([finding("max-statements", 2, 70)]);
  const current = snapshot([finding("max-statements", 2, 71)]);
  assert.deepEqual(compareSnapshots(baseline, current), [
    "scripts/example.mjs · max-statements: worst actual 70 -> 71",
  ]);
});

test("new file-rule groups fail", () => {
  const baseline = snapshot([]);
  const current = snapshot([finding("max-lines-per-function", 1, 121)]);
  assert.match(compareSnapshots(baseline, current)[0], /new group/);
});

test("finding and maximum reductions pass, including removed groups", () => {
  const baseline = snapshot([
    finding("complexity", 3, 44),
    finding("max-statements", 1, 80, "worker/example.ts"),
  ]);
  const current = snapshot([finding("complexity", 2, 40)]);
  assert.deepEqual(compareSnapshots(baseline, current), []);
});

test("aggregation ignores source line shifts and canonicalizes file paths", () => {
  const root = path.resolve("code-shape-test-root");
  const result = (line) => [{
    filePath: path.join(root, "src", "example.js"),
    messages: [{
      fatal: false,
      line,
      column: 1,
      ruleId: "complexity",
      message: "Function 'example' has a complexity of 31. Maximum allowed is 30.",
    }],
  }];
  assert.deepEqual(
    aggregateFindings(root, result(3)),
    aggregateFindings(root, result(300)),
  );
  assert.equal(aggregateFindings(root, result(3)).findings[0].path, "src/example.js");
});

test("an unexpectedly empty audited source set fails closed", () => {
  assert.throws(() => aggregateFindings(process.cwd(), []), /unexpectedly vanished/);
});

test("malformed and stale baseline schemas fail closed", () => {
  assert.throws(
    () => validateBaseline({ schemaVersion: 999 }),
    /unsupported baseline schemaVersion/,
  );
  assert.throws(
    () => validateBaseline(snapshot([
      finding("complexity", 1, CODE_SHAPE_POLICY.complexity),
    ])),
    /does not exceed its policy threshold/,
  );
  assert.throws(
    () => validateBaseline({
      ...snapshot([]),
      policy: { ...CODE_SHAPE_POLICY, complexity: 31 },
    }),
    /policy is stale or malformed/,
  );
});

test("the tracked repository baseline passes the live ESLint audit", async () => {
  const snapshot = await runCodeShapeAudit();
  assert.ok(snapshot.auditedFileCount > 0);
});

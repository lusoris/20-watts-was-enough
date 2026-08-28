import assert from "node:assert/strict";
import test from "node:test";

import { normalizeChromiumPdfMetadata } from "./pdf-metadata.mjs";

function fixture(timestamp, firstNode = "node00000384", secondNode = "node00000392") {
  return Buffer.concat([
    Buffer.from("%PDF-1.4\n<< /CreationDate ("),
    Buffer.from(timestamp),
    Buffer.from(") /ModDate ("),
    Buffer.from(timestamp),
    Buffer.from(`) /ID (${firstNode}) /Headers [(${secondNode}) (${firstNode})] >>\n`),
    Buffer.from([0x00, 0x7f, 0x80, 0xff]),
  ]);
}

test("Chromium PDF wall-clock metadata normalizes to the release date", () => {
  const first = normalizeChromiumPdfMetadata(
    fixture("D:20260828111111+00'00'"),
    "2026-08-28",
  );
  const second = normalizeChromiumPdfMetadata(
    fixture("D:20260828222222+00'00'", "node00000376", "node00000384"),
    "2026-08-28",
  );

  assert.deepEqual(first, second);
  assert.match(first.toString("latin1"), /CreationDate \(D:20260828000000\+00'00'\)/u);
  assert.match(first.toString("latin1"), /ModDate \(D:20260828000000\+00'00'\)/u);
  assert.match(first.toString("latin1"), /\/ID \(node00000000\)/u);
  assert.match(first.toString("latin1"), /\/Headers \[\(node00000001\) \(node00000000\)\]/u);
  assert.deepEqual(first.subarray(-4), Buffer.from([0x00, 0x7f, 0x80, 0xff]));
});

test("PDF metadata normalization fails closed on invalid dates or renderer drift", () => {
  assert.throws(
    () => normalizeChromiumPdfMetadata(fixture("D:20260828111111+00'00'"), "2026-02-30"),
    /real calendar date/u,
  );
  assert.throws(
    () => normalizeChromiumPdfMetadata(Buffer.from("%PDF-1.4\n"), "2026-08-28"),
    /exactly one CreationDate and one ModDate/u,
  );
});

import assert from "node:assert/strict";
import test from "node:test";

import { resolvePagesBase } from "./lib/pages-base.mjs";

test("Pages base defaults to the custom-domain root", () => {
  assert.equal(resolvePagesBase(undefined), "/");
  assert.equal(resolvePagesBase(""), "/");
  assert.equal(resolvePagesBase("/"), "/");
});

test("Pages base normalizes an explicit repository subpath", () => {
  assert.equal(resolvePagesBase("20-watts-was-enough"), "/20-watts-was-enough/");
  assert.equal(resolvePagesBase("/20-watts-was-enough"), "/20-watts-was-enough/");
  assert.equal(resolvePagesBase("/nested/preview/"), "/nested/preview/");
});

test("Pages base rejects URLs, traversal, ambiguous separators, and suffixes", () => {
  for (const candidate of [
    " ",
    "https://example.test/site/",
    "//example.test/site/",
    "/../site/",
    "/site/../other/",
    "/site//preview/",
    "\\site",
    "/site?preview=1",
    "/site#preview",
    "/site/%2e%2e/",
  ]) {
    assert.throws(
      () => resolvePagesBase(candidate),
      /Invalid PAGES_BASE_PATH/,
      candidate,
    );
  }
});

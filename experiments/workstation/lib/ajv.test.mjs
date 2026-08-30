import assert from "node:assert/strict";
import test from "node:test";

import { createAjv } from "./ajv.mjs";

test("project JSON Schema vocabulary is explicit and other unknown keywords fail closed", () => {
  assert.doesNotThrow(() => createAjv().compile({
    type: "object",
    "x-runtime-validator": "contract.mjs#assertRecord",
  }));
  assert.throws(() => createAjv().compile({
    type: "object",
    "x-unregistered-keyword": true,
  }), /unknown keyword/u);
});

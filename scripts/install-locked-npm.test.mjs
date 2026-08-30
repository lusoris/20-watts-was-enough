import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  EXPECTED_NPM_RUNTIME_LOCK,
  downloadLockedNpmArchive,
  parseInstallerArguments,
  parseNpmRuntimeLock,
} from "./install-locked-npm.mjs";

const expectedLockText = `${JSON.stringify(EXPECTED_NPM_RUNTIME_LOCK, null, 2)}\n`;

async function temporaryRoot(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "20w-locked-npm-test-"));
  t.after(() => rm(root, { force: true, recursive: true }));
  return root;
}

function testLock(bytes) {
  return Object.freeze({
    ...EXPECTED_NPM_RUNTIME_LOCK,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    size: bytes.byteLength,
  });
}

function registryResponse(lock, bytes, overrides = {}) {
  return {
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    }),
    headers: new Headers({ "content-length": String(lock.size) }),
    status: 200,
    url: lock.url,
    ...overrides,
  };
}

test("the tracked npm runtime lock is exact and strict", async () => {
  const tracked = await readFile(new URL("./npm-runtime-lock.json", import.meta.url));
  assert.equal(tracked.toString("utf8"), expectedLockText);
  assert.equal(parseNpmRuntimeLock(tracked), EXPECTED_NPM_RUNTIME_LOCK);
  assert.throws(
    () => parseNpmRuntimeLock(expectedLockText.replace('"schema": 1', '"schema": 1,\n  "schema": 1')),
    /repeats name "schema"/u,
  );
});

test("every locked npm field and the closed schema reject tampering", () => {
  for (const field of Object.keys(EXPECTED_NPM_RUNTIME_LOCK)) {
    const tampered = { ...EXPECTED_NPM_RUNTIME_LOCK };
    tampered[field] = field === "size" || field === "schema" ? tampered[field] + 1 : `${tampered[field]}-tampered`;
    assert.throws(() => parseNpmRuntimeLock(JSON.stringify(tampered)), new RegExp(`unexpected ${field}`, "u"));
  }
  assert.throws(
    () => parseNpmRuntimeLock(JSON.stringify({ ...EXPECTED_NPM_RUNTIME_LOCK, package: "npm" })),
    /must contain exactly/u,
  );
  assert.throws(() => parseInstallerArguments(["--force"]), /accepts no arguments/u);
});

test("the npm tarball download binds request, response, size, and digest", async (t) => {
  const root = await temporaryRoot(t);
  const bytes = Buffer.from("locked npm fixture\n", "utf8");
  const lock = testLock(bytes);
  const archivePath = path.join(root, "npm.tgz");
  let request;
  const fetchImplementation = async (url, options) => {
    request = { options, url };
    return registryResponse(lock, bytes);
  };
  const result = await downloadLockedNpmArchive(lock, archivePath, { fetchImplementation });
  assert.deepEqual(await readFile(archivePath), bytes);
  assert.equal(result.sha256, lock.sha256);
  assert.equal(result.size, bytes.byteLength);
  assert.equal(request.url, lock.url);
  assert.equal(request.options.redirect, "error");
  assert.equal(request.options.headers["accept-encoding"], "identity");
  assert.ok(request.options.signal instanceof AbortSignal);
});

test("the npm tarball download removes same-size tampering and partial bodies", async (t) => {
  const root = await temporaryRoot(t);
  const expected = Buffer.from("expected", "utf8");
  const tampered = Buffer.from("tampered", "utf8");
  const lock = testLock(expected);
  const tamperedPath = path.join(root, "tampered.tgz");
  await assert.rejects(
    downloadLockedNpmArchive(lock, tamperedPath, {
      fetchImplementation: async () => registryResponse(lock, tampered),
    }),
    /SHA-256 differs/u,
  );
  await assert.rejects(readFile(tamperedPath), /ENOENT/u);

  const partialPath = path.join(root, "partial.tgz");
  await assert.rejects(
    downloadLockedNpmArchive(lock, partialPath, {
      fetchImplementation: async () => registryResponse(lock, expected.subarray(0, 3)),
    }),
    /shorter than the locked size/u,
  );
  await assert.rejects(readFile(partialPath), /ENOENT/u);
});

test("the npm tarball download rejects metadata drift before writing", async (t) => {
  const root = await temporaryRoot(t);
  const bytes = Buffer.from("metadata", "utf8");
  const lock = testLock(bytes);
  const cases = [
    { overrides: { status: 206 }, pattern: /HTTP 206/u },
    { overrides: { url: `${lock.url}?mirror=1` }, pattern: /response URL differs/u },
    {
      overrides: { headers: new Headers({ "content-length": String(lock.size + 1) }) },
      pattern: /Content-Length differs/u,
    },
    {
      overrides: { headers: new Headers({ "content-encoding": "gzip", "content-length": String(lock.size) }) },
      pattern: /unexpected Content-Encoding/u,
    },
  ];
  for (const [index, entry] of cases.entries()) {
    const archivePath = path.join(root, `metadata-${index}.tgz`);
    await assert.rejects(
      downloadLockedNpmArchive(lock, archivePath, {
        fetchImplementation: async () => registryResponse(lock, bytes, entry.overrides),
      }),
      entry.pattern,
    );
    await assert.rejects(readFile(archivePath), /ENOENT/u);
  }
});

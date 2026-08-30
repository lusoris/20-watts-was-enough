import { createHash } from "node:crypto";

export const bookRendererLockPath = "tooling/pdf-renderer/lock.json";

const sha256Pattern = /^[0-9a-f]{64}$/u;
const imageIdPattern = /^sha256:[0-9a-f]{64}$/u;

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

export function bookRendererLockSHA256(bytes) {
  invariant(Buffer.isBuffer(bytes), "PDF renderer lock input must be a Buffer.");
  return createHash("sha256").update(bytes).digest("hex");
}

export function bookRendererIdentityFromEnvironment(environment = process.env) {
  const lockSHA256 = environment.BOOK_RENDERER_LOCK_SHA256 ?? "";
  const imageId = environment.BOOK_RENDERER_IMAGE_ID ?? "";
  const platform = environment.BOOK_RENDERER_PLATFORM ?? "";
  invariant(sha256Pattern.test(lockSHA256), "PDF renderer lock SHA-256 is missing or invalid.");
  invariant(imageIdPattern.test(imageId), "PDF renderer image ID is missing or invalid.");
  invariant(platform === "linux/amd64", "PDF renderer platform must be linux/amd64.");
  return Object.freeze({
    lock: bookRendererLockPath,
    lock_sha256: lockSHA256,
    image_id: imageId,
    platform,
  });
}

export function assertBookRendererLockIdentity(identity, lockBytes) {
  invariant(
    identity?.lock === bookRendererLockPath && sha256Pattern.test(identity?.lock_sha256 ?? ""),
    "PDF renderer identity is missing its checked-in lock.",
  );
  invariant(
    identity.lock_sha256 === bookRendererLockSHA256(lockBytes),
    "PDF renderer identity does not match the checked-in lock bytes.",
  );
  return identity;
}

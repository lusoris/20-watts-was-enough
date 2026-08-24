import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const [mode, marker, ready, childDelayText] = process.argv.slice(2);

if (mode === "--child") {
  const delayMs = ready === undefined ? 1200 : Number(ready);
  if (!Number.isInteger(delayMs) || delayMs < 1) throw new Error("Invalid child delay.");
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  await writeFile(marker, "escaped descendant\n", { flag: "wx" });
  process.exit(0);
}

if (mode === "--parent" || mode === "--parent-wait") {
  const childDelayMs = childDelayText === undefined ? 1200 : Number(childDelayText);
  if (!Number.isInteger(childDelayMs) || childDelayMs < 1) throw new Error("Invalid requested child delay.");
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url), "--child", marker, String(childDelayMs)], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  child.unref();
  if (ready) await writeFile(ready, "parent and descendant started\n", { flag: "wx" });
  if (mode === "--parent-wait") await new Promise((resolve) => setTimeout(resolve, 30_000));
  process.exit(0);
}

if (mode === "--output-flood" || mode === "--output-flood-fast") {
  process.stdout.write(Buffer.alloc(2 * 1024 * 1024, 0x61));
  if (mode === "--output-flood") await new Promise((resolve) => setTimeout(resolve, 30_000));
  process.exit(0);
}

throw new Error("Unknown descendant-fixture mode.");

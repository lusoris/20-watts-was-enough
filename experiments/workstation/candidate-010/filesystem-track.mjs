import { mkdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

async function fileExists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

export async function executeFilesystemDecision(root, opportunity, decision) {
  const staging = path.join(root, "staging");
  const durable = path.join(root, "durable");
  await mkdir(staging, { recursive: true });
  await mkdir(durable, { recursive: true });
  const stagedFile = path.join(staging, `${opportunity.id}.txt`);
  const durableFile = path.join(durable, `${opportunity.id}.txt`);
  let bytesWritten = 0;

  if (decision.stage) {
    await writeFile(stagedFile, opportunity.payload, { encoding: "utf8", flag: "wx" });
    bytesWritten += Buffer.byteLength(opportunity.payload);
  }
  if (decision.stage && decision.commit) {
    await rename(stagedFile, durableFile);
  } else if (decision.stage && decision.reset) {
    await rm(stagedFile, { force: true });
  } else if (!decision.stage && decision.commit) {
    await writeFile(durableFile, opportunity.payload, { encoding: "utf8", flag: "wx" });
    bytesWritten += Buffer.byteLength(opportunity.payload);
  }

  const stageExists = await fileExists(stagedFile);
  const durableExists = await fileExists(durableFile);
  const rollbackComplete = !decision.reset || (!stageExists && !durableExists);
  const commitComplete = !decision.commit || durableExists;
  return { bytesWritten, stageExists, durableExists, rollbackComplete, commitComplete };
}

import path from "node:path";
import { fileURLToPath } from "node:url";

process.env.UPDATE_THIRD_PARTY_NOTICES = "1";
const { build } = await import("vite");
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await build({ configFile: path.join(repositoryRoot, "vite.pages.config.ts") });

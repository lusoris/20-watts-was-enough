import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateTranslationManifest } from "./lib/translation-manifest.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = validateTranslationManifest(repositoryRoot);
process.stdout.write(`Validated ${manifest.documents.length} reviewed translations.\n`);

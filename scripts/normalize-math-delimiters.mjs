import { normalizeMathRepository } from "./lib/math-normalization.mjs";

const write = process.argv.includes("--write");
try {
  if (process.argv.slice(2).some((value) => value !== "--write") || process.argv.slice(2).length > 1) {
    throw new Error("Use normalize-math-delimiters.mjs with no arguments or --write");
  }
  const changed = await normalizeMathRepository(process.cwd(), { write });
  if (!write && changed.length > 0) {
    console.error(`${changed.length} Markdown file(s) still use site-incompatible math delimiters:\n${changed.map((file) => `- ${file}`).join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log(`${write ? "Normalized" : "Checked"} math delimiters in ${changed.length} Markdown file(s).`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

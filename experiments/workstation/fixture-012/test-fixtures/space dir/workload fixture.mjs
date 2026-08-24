import { readFile } from "node:fs/promises";

const input = JSON.parse(await readFile(process.argv[2], "utf8"));
if (input.value !== 12) throw new Error("Unexpected frozen input.");
process.stdout.write("fixture-012-correct-output\n");

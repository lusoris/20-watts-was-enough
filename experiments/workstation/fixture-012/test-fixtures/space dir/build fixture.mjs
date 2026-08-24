import { copyFile, chmod, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

if (process.argv[2] === "--version") {
  process.stdout.write("fixture-build-wrapper-v1\n");
  process.exit(0);
}

const options = {};
for (let index = 2; index < process.argv.length; index += 2) {
  options[process.argv[index]] = process.argv[index + 1];
}
for (const key of ["--variant", "--layout-seed", "--output", "--layout-manifest"]) {
  if (!options[key]) throw new Error(`Missing ${key}`);
}
const variant = options["--variant"];
const layoutSeed = Number(options["--layout-seed"]);
const hash = (value) => createHash("sha256").update(value).digest("hex");
await copyFile(process.execPath, options["--output"]);
if (process.platform !== "win32") await chmod(options["--output"], 0o700);
const manifest = {
  schema: 1,
  contract_version: "fixture-012.normalized-layout-manifest.v1",
  artifact: "fixture-012",
  variant,
  layout_seed: layoutSeed,
  sections: [
    {
      name: ".text",
      ordinal: 0,
      size_bytes: 1000 + (layoutSeed % 97),
      content_sha256: hash(`text\0${variant}\0${layoutSeed}`),
    },
    {
      name: ".data",
      ordinal: 1,
      size_bytes: 200 + (layoutSeed % 31),
      content_sha256: hash(`data\0${variant}\0${layoutSeed}`),
    },
  ],
  symbols: [
    {
      name_sha256: hash(`entry\0${variant}\0${layoutSeed}`),
      section: ".text",
      ordinal: 0,
      size_bytes: 64 + (layoutSeed % 7),
    },
    {
      name_sha256: hash(`state\0${variant}\0${layoutSeed}`),
      section: ".data",
      ordinal: 1,
      size_bytes: 16 + (layoutSeed % 5),
    },
  ],
};
await writeFile(options["--layout-manifest"], `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
process.stdout.write(`built ${variant} ${layoutSeed}\n`);

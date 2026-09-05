import { validateMathRepository } from "./lib/math-validation.mjs";

try {
  const report = await validateMathRepository(process.cwd());
  if (report.failures.length > 0) {
    console.error("Mathematical notation validation failed:\n");
    for (const failure of report.failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`Mathematical notation validation passed: ${report.display} display and ${report.inline} inline equations in ${report.displayFiles} display-math Markdown files.`);
  }
} catch (error) {
  console.error(`Mathematical notation validation failed: ${error.message}`);
  process.exitCode = 1;
}

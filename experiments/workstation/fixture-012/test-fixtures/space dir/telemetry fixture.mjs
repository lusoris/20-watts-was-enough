if (process.argv[2] === "--version") {
  process.stdout.write("fixture-telemetry-v1\n");
} else {
  process.stdout.write(`${JSON.stringify({
    thermal_c: { "cpu-package": 50 },
    frequency_hz: { "cpu-effective": 3_500_000_000 },
  })}\n`);
}

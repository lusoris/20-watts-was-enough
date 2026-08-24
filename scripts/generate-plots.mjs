import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { generateLayoutStudy } from "../experiments/workstation/fixture-012/generator.mjs";

const root = process.cwd();
const specs = JSON.parse(
  await readFile(path.join(root, "assets", "plots", "core-models.json"), "utf8"),
);
const outputDirectory = path.join(root, "public", "plots");
await mkdir(outputDirectory, { recursive: true });

const W = 1100;
const H = 660;
const plot = { left: 112, right: 1040, top: 150, bottom: 556 };
const colors = {
  background: "#101c18",
  panel: "#14251f",
  grid: "#315047",
  text: "#fffaf0",
  muted: "#aabbb4",
  green: "#36d399",
  cyan: "#45b7d1",
  amber: "#ffb04a",
  coral: "#ff6b6b",
  violet: "#a78bfa",
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sx(value, min, max) {
  return plot.left + ((value - min) / (max - min)) * (plot.right - plot.left);
}

function sy(value, min, max) {
  return plot.bottom - ((value - min) / (max - min)) * (plot.bottom - plot.top);
}

function logScale(value, min, max) {
  return sx(Math.log10(value), Math.log10(min), Math.log10(max));
}

function linePath(points) {
  return points
    .map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
}

function frame(spec, content, {
  xLabel,
  yLabel,
  legend = "",
  badge = "MATHEMATICAL MODEL · ILLUSTRATIVE",
  footer = "No measurements · assumptions in assets/plots/core-models.json",
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
  <title id="title">${esc(spec.title)}</title>
  <desc id="desc">${esc(spec.status)}</desc>
  <rect width="${W}" height="${H}" rx="24" fill="${colors.background}"/>
  <rect x="36" y="30" width="272" height="30" rx="15" fill="#203b31" stroke="#3f6b5b"/>
  <text x="52" y="50" fill="${colors.green}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" letter-spacing="1.2">${esc(badge)}</text>
  <text x="54" y="94" fill="${colors.text}" font-family="Georgia, serif" font-size="32" font-weight="700">${esc(spec.title)}</text>
  <text x="54" y="123" fill="${colors.muted}" font-family="Cascadia Mono, monospace" font-size="14">${esc(spec.equation)}</text>
  <rect x="${plot.left}" y="${plot.top}" width="${plot.right - plot.left}" height="${plot.bottom - plot.top}" rx="8" fill="${colors.panel}" stroke="#315047"/>
  ${content}
  <text x="${(plot.left + plot.right) / 2}" y="617" fill="${colors.text}" font-family="Segoe UI, sans-serif" font-size="15" text-anchor="middle">${esc(xLabel)}</text>
  <text x="28" y="${(plot.top + plot.bottom) / 2}" fill="${colors.text}" font-family="Segoe UI, sans-serif" font-size="15" text-anchor="middle" transform="rotate(-90 28 ${(plot.top + plot.bottom) / 2})">${esc(yLabel)}</text>
${legend ? `  ${legend}\n` : ""}  <text x="1040" y="638" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="11" text-anchor="end">${esc(footer)}</text>
</svg>`;
}

function grid(xTicks, yTicks, xMap, yMap, xFormat = String, yFormat = String) {
  const vertical = xTicks
    .map((tick) => {
      const x = xMap(tick);
      return `<line x1="${x}" y1="${plot.top}" x2="${x}" y2="${plot.bottom}" stroke="${colors.grid}" stroke-width="1" opacity=".7"/><text x="${x}" y="580" fill="${colors.muted}" font-family="Cascadia Mono, monospace" font-size="12" text-anchor="middle">${esc(xFormat(tick))}</text>`;
    })
    .join("");
  const horizontal = yTicks
    .map((tick) => {
      const y = yMap(tick);
      return `<line x1="${plot.left}" y1="${y}" x2="${plot.right}" y2="${y}" stroke="${colors.grid}" stroke-width="1" opacity=".7"/><text x="96" y="${y + 4}" fill="${colors.muted}" font-family="Cascadia Mono, monospace" font-size="12" text-anchor="end">${esc(yFormat(tick))}</text>`;
    })
    .join("");
  return vertical + horizontal;
}

function finiteError(spec) {
  const { epsilon_min: min, epsilon_max: max, samples } = spec.parameters;
  const h = (epsilon) =>
    epsilon === 0 || epsilon === 1
      ? 0
      : -epsilon * Math.log(epsilon) - (1 - epsilon) * Math.log(1 - epsilon);
  const values = Array.from({ length: samples }, (_, index) => {
    const epsilon = min + (index / (samples - 1)) * (max - min);
    return [sx(epsilon, min, max), sy(Math.log(2) - h(epsilon), 0, Math.log(2))];
  });
  const area = `${linePath(values)} L${plot.right},${plot.bottom} L${plot.left},${plot.bottom} Z`;
  const content = `${grid(
    [0, 0.1, 0.2, 0.3, 0.4, 0.5],
    [0, 0.2, 0.4, 0.6],
    (value) => sx(value, min, max),
    (value) => sy(value, 0, Math.log(2)),
    (value) => value.toFixed(1),
    (value) => value.toFixed(1),
  )}<path d="${area}" fill="url(#finiteFill)" opacity=".7"/><path d="${linePath(values)}" fill="none" stroke="${colors.amber}" stroke-width="5" stroke-linecap="round"/>
  <defs><linearGradient id="finiteFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${colors.amber}" stop-opacity=".8"/><stop offset="1" stop-color="${colors.amber}" stop-opacity=".05"/></linearGradient></defs>
  <circle cx="${plot.left}" cy="${sy(Math.log(2), 0, Math.log(2))}" r="7" fill="${colors.coral}"/><text x="${plot.left + 16}" y="${plot.top + 22}" fill="${colors.text}" font-family="Segoe UI, sans-serif" font-size="14">zero-error binary reset: ln 2</text>
  <circle cx="${plot.right}" cy="${plot.bottom}" r="7" fill="${colors.cyan}"/><text x="${plot.right - 16}" y="${plot.bottom - 18}" fill="${colors.text}" font-family="Segoe UI, sans-serif" font-size="14" text-anchor="end">maximal tolerated error: bound tends to zero</text>`;
  return frame(spec, content, {
    xLabel: "allowed error epsilon (probability)",
    yLabel: "normalized lower bound E / (k_B T)",
  });
}

function adiabatic(spec) {
  const { x_min: min, x_max: max, gamma, leakage, overhead, samples } = spec.parameters;
  const palette = [colors.cyan, colors.green, colors.amber, colors.coral];
  const curves = leakage.map((ell, curveIndex) => {
    const raw = Array.from({ length: samples }, (_, index) => {
      const logX = Math.log10(min) + (index / (samples - 1)) * (Math.log10(max) - Math.log10(min));
      const x = 10 ** logX;
      const energy = gamma / x + ell * x + overhead;
      return [logScale(x, min, max), sy(Math.min(1.2, energy), 0, 1.2)];
    });
    return `<path d="${linePath(raw)}" fill="none" stroke="${palette[curveIndex]}" stroke-width="4"/>`;
  });
  const referenceY = sy(1, 0, 1.2);
  const legend = leakage
    .map((ell, index) => `<circle cx="${748 + index * 75}" cy="48" r="5" fill="${palette[index]}"/><text x="${758 + index * 75}" y="52" fill="${colors.muted}" font-family="Cascadia Mono, monospace" font-size="11">ell=${ell.toExponential(0)}</text>`)
    .join("");
  const content = `${grid(
    [1, 10, 100, 1000, 10000],
    [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2],
    (value) => logScale(value, min, max),
    (value) => sy(value, 0, 1.2),
    (value) => `10^${Math.log10(value)}`,
    (value) => value.toFixed(1),
  )}<line x1="${plot.left}" y1="${referenceY}" x2="${plot.right}" y2="${referenceY}" stroke="${colors.violet}" stroke-width="2" stroke-dasharray="10 8"/><text x="${plot.right - 10}" y="${referenceY - 10}" fill="${colors.violet}" font-family="Segoe UI, sans-serif" font-size="13" text-anchor="end">normalized ordinary reference</text>${curves.join("")}`;
  return frame(spec, content, {
    xLabel: "transition time x = tau / (RC), logarithmic",
    yLabel: "normalized transition energy E / (CV^2)",
    legend,
  });
}

function heatColor(value) {
  const clamped = Math.max(-1, Math.min(1, value));
  if (clamped < 0) {
    const t = clamped + 1;
    return `rgb(${Math.round(31 + 27 * t)},${Math.round(112 + 99 * t)},${Math.round(86 + 55 * t)})`;
  }
  return `rgb(${Math.round(255 - 28 * value)},${Math.round(176 - 112 * value)},${Math.round(74 - 26 * value)})`;
}

function sparseBreakEven(spec) {
  const { gain_min: xMin, gain_max: xMax, overhead_min: yMin, overhead_max: yMax, cells } = spec.parameters;
  const cellWidth = (plot.right - plot.left) / cells;
  const cellHeight = (plot.bottom - plot.top) / cells;
  const rectangles = [];
  for (let row = 0; row < cells; row += 1) {
    for (let column = 0; column < cells; column += 1) {
      const gain = xMin + ((column + 0.5) / cells) * (xMax - xMin);
      const overhead = yMax - ((row + 0.5) / cells) * (yMax - yMin);
      const net = (overhead - gain) / (xMax - xMin);
      rectangles.push(`<rect x="${plot.left + column * cellWidth}" y="${plot.top + row * cellHeight}" width="${cellWidth + 0.5}" height="${cellHeight + 0.5}" fill="${heatColor(net)}"/>`);
    }
  }
  const content = `${rectangles.join("")}${grid(
    [0, 0.2, 0.4, 0.6, 0.8],
    [0, 0.2, 0.4, 0.6, 0.8],
    (value) => sx(value, xMin, xMax),
    (value) => sy(value, yMin, yMax),
    (value) => value.toFixed(1),
    (value) => value.toFixed(1),
  )}<line x1="${plot.left}" y1="${plot.bottom}" x2="${plot.right}" y2="${plot.top}" stroke="${colors.text}" stroke-width="4" stroke-dasharray="12 8"/><text x="${plot.left + 28}" y="${plot.top + 38}" fill="${colors.coral}" font-family="Segoe UI, sans-serif" font-size="20" font-weight="700">NET ENERGY LOSS</text><text x="${plot.right - 28}" y="${plot.bottom - 28}" fill="${colors.green}" font-family="Segoe UI, sans-serif" font-size="20" font-weight="700" text-anchor="end">NET ENERGY GAIN</text><text x="${plot.right - 20}" y="${plot.top + 28}" fill="${colors.text}" font-family="Cascadia Mono, monospace" font-size="12" text-anchor="end">break-even: overhead = avoided work</text>`;
  return frame(spec, content, {
    xLabel: "avoided compute + movement energy / baseline energy",
    yLabel: "routing + synchronization + idle overhead / baseline energy",
  });
}

function lifecycle(spec) {
  const { initial_cost_min: xMin, initial_cost_max: xMax, saving_min: yMin, saving_max: yMax, cells, horizon_contours: contours } = spec.parameters;
  const cellWidth = (plot.right - plot.left) / cells;
  const cellHeight = (plot.bottom - plot.top) / cells;
  const rectangles = [];
  const minLogN = -4;
  const maxLogN = 6;
  for (let row = 0; row < cells; row += 1) {
    for (let column = 0; column < cells; column += 1) {
      const logX = Math.log10(xMin) + ((column + 0.5) / cells) * (Math.log10(xMax) - Math.log10(xMin));
      const logY = Math.log10(yMax) - ((row + 0.5) / cells) * (Math.log10(yMax) - Math.log10(yMin));
      const logN = logX - logY;
      const normalized = (logN - minLogN) / (maxLogN - minLogN);
      const hue = 164 - Math.max(0, Math.min(1, normalized)) * 124;
      rectangles.push(`<rect x="${plot.left + column * cellWidth}" y="${plot.top + row * cellHeight}" width="${cellWidth + 0.5}" height="${cellHeight + 0.5}" fill="hsl(${hue} 62% 35%)"/>`);
    }
  }
  const contourLines = contours
    .map((n, index) => {
      const logN = Math.log10(n);
      const candidates = [];
      for (let step = 0; step <= 100; step += 1) {
        const logX = Math.log10(xMin) + (step / 100) * (Math.log10(xMax) - Math.log10(xMin));
        const logY = logX - logN;
        if (logY >= Math.log10(yMin) && logY <= Math.log10(yMax)) {
          candidates.push([
            sx(logX, Math.log10(xMin), Math.log10(xMax)),
            sy(logY, Math.log10(yMin), Math.log10(yMax)),
          ]);
        }
      }
      if (candidates.length < 2) return "";
      const labelPoint = candidates[Math.floor(candidates.length * 0.7)];
      return `<path d="${linePath(candidates)}" fill="none" stroke="${colors.text}" stroke-width="${index === 1 ? 4 : 2}" stroke-dasharray="${index === 1 ? "" : "8 6"}" opacity=".9"/><text x="${labelPoint[0] + 8}" y="${labelPoint[1] - 8}" fill="${colors.text}" font-family="Cascadia Mono, monospace" font-size="12">N*=${n.toExponential(0)}</text>`;
    })
    .join("");
  const content = `${rectangles.join("")}${grid(
    [0.01, 0.1, 1, 10, 100, 1000],
    [0.001, 0.01, 0.1, 1, 10, 100],
    (value) => logScale(value, xMin, xMax),
    (value) => sy(Math.log10(value), Math.log10(yMin), Math.log10(yMax)),
    (value) => `10^${Math.log10(value)}`,
    (value) => `10^${Math.log10(value)}`,
  )}${contourLines}<text x="${plot.left + 22}" y="${plot.top + 34}" fill="${colors.text}" font-family="Segoe UI, sans-serif" font-size="15" font-weight="700">longer payback</text><text x="${plot.right - 22}" y="${plot.bottom - 24}" fill="${colors.text}" font-family="Segoe UI, sans-serif" font-size="15" font-weight="700" text-anchor="end">faster payback</text>`;
  return frame(spec, content, {
    xLabel: "one-time candidate burden Delta E_0 / reference energy (log)",
    yLabel: "per-event saving delta e / reference energy (log)",
  });
}

function meteringScale(spec) {
  const {
    scenarios,
    arms,
    seeds,
    opportunities_per_seed: opportunities,
    measurement_repetitions: repetitions,
    idle_observations_per_repetition: idleObservations,
    artifacts_per_observation: artifactsPerObservation,
  } = spec.parameters;
  const perEvent = artifactsPerObservation * scenarios * arms * seeds * opportunities;
  const perBlock = artifactsPerObservation * scenarios * seeds * repetitions * (arms + idleObservations);
  const reduction = perEvent / perBlock;
  const minimum = 1_000;
  const maximum = 10_000_000;
  const yMap = (value) => sy(Math.log10(value), Math.log10(minimum), Math.log10(maximum));
  const bars = [
    { x: 256, width: 260, value: perEvent, color: colors.coral, label: "per work unit", detail: "reading + review for every arm event", labelInside: true },
    { x: 648, width: 260, value: perBlock, color: colors.green, label: "paired meter blocks", detail: "arm + idle blocks, reading + review", labelInside: false },
  ];
  const content = `${grid(
    [],
    [1_000, 10_000, 100_000, 1_000_000, 10_000_000],
    (value) => value,
    yMap,
    String,
    (value) => `10^${Math.log10(value)}`,
  )}${bars.map((bar) => {
    const top = yMap(bar.value);
    const labelY = bar.labelInside ? plot.bottom - 48 : top - 62;
    const detailY = bar.labelInside ? plot.bottom - 24 : top - 40;
    const labelColor = bar.labelInside ? colors.background : colors.text;
    const detailColor = bar.labelInside ? colors.background : colors.muted;
    return `<rect x="${bar.x}" y="${top}" width="${bar.width}" height="${plot.bottom - top}" rx="10" fill="${bar.color}" opacity=".9"/>
      <text x="${bar.x + bar.width / 2}" y="${top - 18}" fill="${colors.text}" font-family="Cascadia Mono, monospace" font-size="22" font-weight="700" text-anchor="middle">${bar.value.toLocaleString("en-US")}</text>
      <text x="${bar.x + bar.width / 2}" y="${labelY}" fill="${labelColor}" font-family="Segoe UI, sans-serif" font-size="18" font-weight="700" text-anchor="middle">${esc(bar.label)}</text>
      <text x="${bar.x + bar.width / 2}" y="${detailY}" fill="${detailColor}" font-family="Segoe UI, sans-serif" font-size="11" text-anchor="middle">${esc(bar.detail)}</text>`;
  }).join("")}
  <path d="M520,250 C570,215 600,215 644,250" fill="none" stroke="${colors.amber}" stroke-width="4" marker-end="url(#scaleArrow)"/>
  <defs><marker id="scaleArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${colors.amber}"/></marker></defs>
  <text x="582" y="196" fill="${colors.amber}" font-family="Segoe UI, sans-serif" font-size="26" font-weight="700" text-anchor="middle">${Math.round(reduction).toLocaleString("en-US")}× fewer</text>
  <text x="582" y="222" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="13" text-anchor="middle">at the same nominal 24 × 7 × 2 design</text>`;
  return frame(spec, content, {
    xLabel: "external-energy acquisition design",
    yLabel: "reading + review artifacts (logarithmic)",
    badge: "EXPERIMENT SCALE · CALCULATED",
    footer: "Configuration calculation · no runtime or energy result",
  });
}

function fixtureIdentifiability(spec) {
  const {
    observation_min: min,
    observation_max: max,
    base_noise_std: baseNoise,
    active_noise_std: activeNoise,
    samples,
  } = spec.parameters;
  const density = (value, mean, standardDeviation) => (
    Math.exp(-0.5 * ((value - mean) / standardDeviation) ** 2)
    / (standardDeviation * Math.sqrt(2 * Math.PI))
  );
  const baseSigma = Math.sqrt(1 + baseNoise ** 2);
  const yMax = 1.75;
  const series = Array.from({ length: samples }, (_, index) => (
    min + (index / (samples - 1)) * (max - min)
  ));
  const base = series.map((value) => [
    sx(value, min, max),
    sy(density(value, 0, baseSigma), 0, yMax),
  ]);
  const negative = series.map((value) => [
    sx(value, min, max),
    sy(density(value, -1, activeNoise), 0, yMax),
  ]);
  const positive = series.map((value) => [
    sx(value, min, max),
    sy(density(value, 1, activeNoise), 0, yMax),
  ]);
  const content = `${grid(
    [-2, -1, 0, 1, 2],
    [0, 0.4, 0.8, 1.2, 1.6],
    (value) => sx(value, min, max),
    (value) => sy(value, 0, yMax),
    (value) => value.toFixed(0),
    (value) => value.toFixed(1),
  )}<path d="${linePath(base)}" fill="none" stroke="${colors.amber}" stroke-width="7" opacity=".95"/>
  <path d="${linePath(base)}" fill="none" stroke="${colors.text}" stroke-width="2" stroke-dasharray="8 7" opacity=".9"/>
  <path d="${linePath(negative)}" fill="none" stroke="${colors.cyan}" stroke-width="5"/>
  <path d="${linePath(positive)}" fill="none" stroke="${colors.green}" stroke-width="5"/>
  <line x1="${sx(0, min, max)}" y1="${plot.top}" x2="${sx(0, min, max)}" y2="${plot.bottom}" stroke="${colors.muted}" stroke-width="2" stroke-dasharray="5 7"/>
  <text x="${sx(0, min, max)}" y="${plot.top + 28}" fill="${colors.amber}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700" text-anchor="middle">base likelihoods coincide</text>
  <text x="${sx(-1, min, max)}" y="${plot.top + 30}" fill="${colors.cyan}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700" text-anchor="middle">active z = −1</text>
  <text x="${sx(1, min, max)}" y="${plot.top + 30}" fill="${colors.green}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700" text-anchor="middle">active z = +1</text>
  <rect x="702" y="500" width="316" height="38" rx="19" fill="#203b31" stroke="#3f6b5b"/>
  <text x="860" y="525" fill="${colors.text}" font-family="Segoe UI, sans-serif" font-size="14" font-weight="700" text-anchor="middle">information comes from the added operator</text>`;
  return frame(spec, content, {
    xLabel: "observation value y (normalized)",
    yLabel: "conditional likelihood density",
    badge: "IDENTIFIABILITY MODEL · ANALYTICAL",
    footer: "Fixture configuration · no empirical or superiority result",
  });
}

async function fixtureLayoutSelection(spec) {
  const { config_path: configPath, seed, study } = spec.parameters;
  const absoluteConfigPath = path.resolve(root, configPath);
  const relativeConfigPath = path.relative(root, absoluteConfigPath);
  if (relativeConfigPath.startsWith("..") || path.isAbsolute(relativeConfigPath)) {
    throw new Error(`Fixture 012 plot config escapes the repository: ${configPath}`);
  }
  const sourceConfig = JSON.parse(await readFile(absoluteConfigPath, "utf8"));
  const analyticConfig = {
    ...sourceConfig,
    process_noise_fraction: 0,
    repeat_noise_fraction: 0,
  };
  const generated = generateLayoutStudy({ seed, study, config: analyticConfig });
  const meanLatency = (rows, variant) => {
    const selected = rows.filter((row) => row.variant === variant);
    return selected.reduce((sum, row) => sum + row.latency_ns, 0) / selected.length;
  };
  const speedup = (rows) => {
    const baseline = meanLatency(rows, "baseline");
    const candidate = meanLatency(rows, "candidate");
    return {
      baseline,
      candidate,
      percent: 100 * (baseline - candidate) / baseline,
    };
  };
  const fixed = speedup(generated.fixed);
  const complete = speedup(generated.randomized);
  const rows = [
    {
      name: "Fixed favorable layout",
      detail: `layout 0 repeated · ${sourceConfig.layouts_per_study} equal-budget slots`,
      result: fixed,
      color: colors.coral,
      interpretation: "false speedup",
    },
    {
      name: "Complete layout population",
      detail: `${sourceConfig.layouts_per_study} layouts · counterbalanced order`,
      result: complete,
      color: colors.green,
      interpretation: "population null",
    },
    {
      name: "Operator-qualified parity",
      detail: "identical mature payload and budget",
      result: complete,
      color: colors.cyan,
      interpretation: "exact parity",
    },
  ];
  const axisLeft = 474;
  const axisRight = 1008;
  const xMin = 0;
  const xMax = 8;
  const xMap = (value) => axisLeft + ((value - xMin) / (xMax - xMin)) * (axisRight - axisLeft);
  const rowY = [252, 362, 472];
  const ticks = [0, 2, 4, 6, 8];
  const tickMarkup = ticks.map((tick) => {
    const x = xMap(tick);
    return `<line x1="${x}" y1="${plot.top + 44}" x2="${x}" y2="${plot.bottom - 30}" stroke="${colors.grid}" stroke-width="1" opacity=".8"/><text x="${x}" y="${plot.bottom - 6}" fill="${colors.muted}" font-family="Cascadia Mono, monospace" font-size="12" text-anchor="middle">${tick}%</text>`;
  }).join("");
  const rowMarkup = rows.map((row, index) => {
    const y = rowY[index];
    const valueX = xMap(Math.max(xMin, Math.min(xMax, row.result.percent)));
    const percent = Math.abs(row.result.percent) < 0.0005 ? "0.00%" : `${row.result.percent.toFixed(2)}%`;
    const means = `${(row.result.baseline / 1e6).toFixed(3)} → ${(row.result.candidate / 1e6).toFixed(3)} ms`;
    return `<text x="138" y="${y - 8}" fill="${colors.text}" font-family="Segoe UI, sans-serif" font-size="17" font-weight="700">${esc(row.name)}</text>
      <text x="138" y="${y + 16}" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="12">${esc(row.detail)}</text>
      <line x1="${axisLeft}" y1="${y}" x2="${valueX}" y2="${y}" stroke="${row.color}" stroke-width="8" stroke-linecap="round" opacity=".65"/>
      <circle cx="${valueX}" cy="${y}" r="10" fill="${row.color}" stroke="${colors.text}" stroke-width="2"/>
      <text x="${Math.min(axisRight - 4, valueX + 18)}" y="${y - 12}" fill="${row.color}" font-family="Cascadia Mono, monospace" font-size="17" font-weight="700" text-anchor="${valueX > axisRight - 80 ? "end" : "start"}">${percent}</text>
      <text x="${Math.min(axisRight - 4, valueX + 18)}" y="${y + 18}" fill="${colors.muted}" font-family="Cascadia Mono, monospace" font-size="11" text-anchor="${valueX > axisRight - 80 ? "end" : "start"}">${esc(means)} · ${esc(row.interpretation)}</text>`;
  }).join("");
  const content = `${tickMarkup}
  <line x1="${axisLeft}" y1="${plot.top + 36}" x2="${axisLeft}" y2="${plot.bottom - 30}" stroke="${colors.text}" stroke-width="3"/>
  <text x="${axisLeft}" y="${plot.top + 24}" fill="${colors.text}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" text-anchor="middle">no speedup</text>
  ${rowMarkup}
  <rect x="138" y="${plot.bottom - 50}" width="302" height="30" rx="15" fill="#203b31" stroke="#3f6b5b"/>
  <text x="289" y="${plot.bottom - 30}" fill="${colors.amber}" font-family="Segoe UI, sans-serif" font-size="12" font-weight="700" text-anchor="middle">synthetic mean latency: baseline → candidate</text>`;
  return frame(spec, content, {
    xLabel: "apparent candidate mean-latency reduction (%)",
    yLabel: "evaluation design",
    badge: "SYNTHETIC FIXTURE · ANALYTICAL",
    footer: `${configPath} · noise disabled · no measured runtime`,
  });
}

function crossPlatformReach(spec) {
  const {
    platform_a_people: platformA,
    platform_b_people: platformB,
    samples,
  } = spec.parameters;
  const smaller = Math.min(platformA, platformB);
  const summed = platformA + platformB;
  const xMap = (value) => sx(value, 0, 1);
  const yMap = (value) => sy(value, 0, summed * 1.1);
  const values = Array.from({ length: samples }, (_, index) => {
    const fraction = index / (samples - 1);
    const overlap = fraction * smaller;
    return {
      fraction,
      union: summed - overlap,
      naive: summed,
    };
  });
  const unionPath = linePath(values.map((point) => [xMap(point.fraction), yMap(point.union)]));
  const naivePath = linePath(values.map((point) => [xMap(point.fraction), yMap(point.naive)]));
  const gapArea = `${unionPath} L${xMap(1)},${yMap(summed)} L${xMap(0)},${yMap(summed)} Z`;
  const endUnion = summed - smaller;
  const endOvercount = summed / endUnion - 1;
  const content = `${grid(
    [0, 0.25, 0.5, 0.75, 1],
    [0, 500, 1000, 1500, 2000],
    xMap,
    yMap,
    (value) => `${Math.round(value * 100)}%`,
    (value) => value.toLocaleString("en-US"),
  )}<path d="${gapArea}" fill="${colors.coral}" opacity=".18"/>
  <path d="${naivePath}" fill="none" stroke="${colors.coral}" stroke-width="6" stroke-dasharray="12 8"/>
  <path d="${unionPath}" fill="none" stroke="${colors.green}" stroke-width="7" stroke-linecap="round"/>
  <circle cx="${xMap(1)}" cy="${yMap(endUnion)}" r="9" fill="${colors.green}" stroke="${colors.text}" stroke-width="2"/>
  <text x="${xMap(0.04)}" y="${yMap(summed) - 16}" fill="${colors.coral}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700">naive sum: ${summed.toLocaleString("en-US")} accounts</text>
  <text x="${xMap(0.58)}" y="${yMap(summed - 0.58 * smaller) + 30}" fill="${colors.green}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700">set union: resolved people</text>
  <rect x="${xMap(0.60)}" y="${yMap(720)}" width="350" height="72" rx="12" fill="#203b31" stroke="#3f6b5b"/>
  <text x="${xMap(0.60) + 175}" y="${yMap(720) + 28}" fill="${colors.text}" font-family="Cascadia Mono, monospace" font-size="14" font-weight="700" text-anchor="middle">100% overlap → ${endUnion.toLocaleString("en-US")} people</text>
  <text x="${xMap(0.60) + 175}" y="${yMap(720) + 52}" fill="${colors.coral}" font-family="Cascadia Mono, monospace" font-size="13" text-anchor="middle">naive overcount: ${(endOvercount * 100).toFixed(0)}%</text>`;
  return frame(spec, content, {
    xLabel: "overlap as share of the smaller platform audience",
    yLabel: "reported unique reach (people)",
    badge: "SET IDENTITY · ILLUSTRATIVE",
    footer: `${platformA.toLocaleString("en-US")} + ${platformB.toLocaleString("en-US")} platform accounts · no observed audience data`,
  });
}

function spatialSupportTransfer(spec) {
  const { ratio_min: min, ratio_max: max, samples } = spec.parameters;
  const yMin = -0.3;
  const yMax = 1.05;
  const response = (ratio) => (
    ratio === 0 ? 1 : Math.sin(Math.PI * ratio) / (Math.PI * ratio)
  );
  const values = Array.from({ length: samples }, (_, index) => {
    const ratio = min + (index / (samples - 1)) * (max - min);
    const value = response(ratio);
    return { ratio, value };
  });
  const signedPath = linePath(values.map(({ ratio, value }) => [
    sx(ratio, min, max),
    sy(value, yMin, yMax),
  ]));
  const magnitudePath = linePath(values.map(({ ratio, value }) => [
    sx(ratio, min, max),
    sy(Math.abs(value), yMin, yMax),
  ]));
  const zeroY = sy(0, yMin, yMax);
  const unityX = sx(1, min, max);
  const negativeRatio = 1.43;
  const negativeX = sx(negativeRatio, min, max);
  const negativeY = sy(response(negativeRatio), yMin, yMax);
  const content = `${grid(
    [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    [-0.2, 0, 0.2, 0.4, 0.6, 0.8, 1],
    (value) => sx(value, min, max),
    (value) => sy(value, yMin, yMax),
    (value) => value.toFixed(value % 1 === 0 ? 0 : 2),
    (value) => value.toFixed(1),
  )}<line x1="${plot.left}" y1="${zeroY}" x2="${plot.right}" y2="${zeroY}" stroke="${colors.text}" stroke-width="2" opacity=".85"/>
  <path d="${magnitudePath}" fill="none" stroke="${colors.violet}" stroke-width="3" stroke-dasharray="10 8" opacity=".95"/>
  <path d="${signedPath}" fill="none" stroke="${colors.amber}" stroke-width="7" stroke-linecap="round"/>
  <line x1="${unityX}" y1="${plot.top}" x2="${unityX}" y2="${plot.bottom}" stroke="${colors.cyan}" stroke-width="3" stroke-dasharray="7 7"/>
  <circle cx="${unityX}" cy="${zeroY}" r="9" fill="${colors.cyan}" stroke="${colors.text}" stroke-width="2"/>
  <text x="${unityX + 16}" y="${zeroY - 18}" fill="${colors.cyan}" font-family="Segoe UI, sans-serif" font-size="15" font-weight="700">support width = wavelength → zero response</text>
  <circle cx="${negativeX}" cy="${negativeY}" r="8" fill="${colors.coral}" stroke="${colors.text}" stroke-width="2"/>
  <text x="${negativeX + 16}" y="${negativeY + 32}" fill="${colors.coral}" font-family="Segoe UI, sans-serif" font-size="14" font-weight="700">signed lobe: apparent phase reversal</text>
  <line x1="760" y1="82" x2="804" y2="82" stroke="${colors.amber}" stroke-width="6"/><text x="816" y="87" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="13">signed retained amplitude H</text>
  <line x1="760" y1="110" x2="804" y2="110" stroke="${colors.violet}" stroke-width="3" stroke-dasharray="9 7"/><text x="816" y="115" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="13">retained magnitude |H|</text>`;
  return frame(spec, content, {
    xLabel: "support width r / field wavelength lambda",
    yLabel: "retained sinusoidal amplitude (dimensionless)",
    badge: "CHANGE OF SUPPORT · ANALYTICAL",
    footer: "Centered box average of a sinusoid · no observed geographic data",
  });
}

function stressPathMemory(spec) {
  const {
    threshold_kpa: threshold,
    elastic_modulus_kpa: elasticModulus,
    history_modulus_kpa: historyModulus,
    high_path_kpa: highPath,
    low_path_kpa: lowPath,
  } = spec.parameters;
  const evolve = (history) => {
    let state = Math.max(history[0] - threshold, Math.min(0, history[0] + threshold));
    return history.map((stress, index) => {
      if (index > 0) {
        state = Math.min(Math.max(state, stress - threshold), stress + threshold);
      }
      return {
        stress,
        state,
        strain: (stress - state) / elasticModulus + state / historyModulus,
      };
    });
  };
  const high = evolve(highPath);
  const low = evolve(lowPath);
  const xMin = Math.min(...highPath, ...lowPath) - 0.5;
  const xMax = Math.max(...highPath, ...lowPath) + 0.5;
  const allStrains = [...high, ...low].map(({ strain }) => strain);
  const yPadding = 0.008;
  const yMin = Math.min(...allStrains) - yPadding;
  const yMax = Math.max(...allStrains) + yPadding;
  const map = ({ stress, strain }) => [sx(stress, xMin, xMax), sy(strain, yMin, yMax)];
  const highPoints = high.map(map);
  const lowPoints = low.map(map);
  const highEnd = high.at(-1);
  const lowEnd = low.at(-1);
  const highEndPoint = map(highEnd);
  const lowEndPoint = map(lowEnd);
  const endpointX = highEndPoint[0];
  const midpointY = (highEndPoint[1] + lowEndPoint[1]) / 2;
  const markers = (points, color) => points.map(([x, y], index) => (
    `<circle cx="${x}" cy="${y}" r="${index === points.length - 1 ? 8 : 3.5}" fill="${color}" stroke="${colors.text}" stroke-width="${index === points.length - 1 ? 2 : 0}"/>`
  )).join("");
  const content = `${grid(
    [-5, -3, -1, 1, 3, 5],
    [-0.06, -0.03, 0, 0.03, 0.06],
    (value) => sx(value, xMin, xMax),
    (value) => sy(value, yMin, yMax),
    (value) => value.toFixed(0),
    (value) => value.toFixed(2),
  )}<line x1="${plot.left}" y1="${sy(0, yMin, yMax)}" x2="${plot.right}" y2="${sy(0, yMin, yMax)}" stroke="${colors.text}" stroke-width="2" opacity=".75"/>
  <path d="${linePath(highPoints)}" fill="none" stroke="${colors.coral}" stroke-width="6" stroke-linejoin="round"/>
  <path d="${linePath(lowPoints)}" fill="none" stroke="${colors.cyan}" stroke-width="6" stroke-linejoin="round"/>
  ${markers(highPoints, colors.coral)}${markers(lowPoints, colors.cyan)}
  <line x1="${endpointX + 22}" y1="${highEndPoint[1]}" x2="${endpointX + 22}" y2="${lowEndPoint[1]}" stroke="${colors.amber}" stroke-width="4"/>
  <line x1="${endpointX + 14}" y1="${highEndPoint[1]}" x2="${endpointX + 30}" y2="${highEndPoint[1]}" stroke="${colors.amber}" stroke-width="4"/>
  <line x1="${endpointX + 14}" y1="${lowEndPoint[1]}" x2="${endpointX + 30}" y2="${lowEndPoint[1]}" stroke="${colors.amber}" stroke-width="4"/>
  <text x="${endpointX + 42}" y="${midpointY - 8}" fill="${colors.amber}" font-family="Segoe UI, sans-serif" font-size="15" font-weight="700">same final stress: ${highEnd.stress} kPa</text>
  <text x="${endpointX + 42}" y="${midpointY + 14}" fill="${colors.amber}" font-family="Cascadia Mono, monospace" font-size="12">z = ${highEnd.state.toFixed(0)} vs ${lowEnd.state.toFixed(0)} kPa</text>
  <line x1="720" y1="82" x2="764" y2="82" stroke="${colors.coral}" stroke-width="6"/><text x="778" y="87" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="13">positive excursion first</text>
  <line x1="720" y1="110" x2="764" y2="110" stroke="${colors.cyan}" stroke-width="6"/><text x="778" y="115" fill="${colors.muted}" font-family="Segoe UI, sans-serif" font-size="13">negative excursion first</text>`;
  return frame(spec, content, {
    xLabel: "input stress sigma_t (kPa)",
    yLabel: "toy response strain epsilon_t (dimensionless)",
    badge: "PATH-DEPENDENCE ORACLE · ANALYTICAL",
    footer: `r=${threshold} kPa · E=${elasticModulus} kPa · H=${historyModulus} kPa · not a soil law`,
  });
}

const renderers = {
  "finite-error-erasure": finiteError,
  "adiabatic-crossover": adiabatic,
  "sparse-locality-break-even": sparseBreakEven,
  "lifecycle-break-even": lifecycle,
  "candidate-010-metering-scale": meteringScale,
  "fixture-007-identifiability": fixtureIdentifiability,
  "fixture-012-layout-selection": fixtureLayoutSelection,
  "cross-platform-reach-overlap": crossPlatformReach,
  "spatial-support-transfer": spatialSupportTransfer,
  "stress-path-memory": stressPathMemory,
};

for (const spec of specs) {
  const renderer = renderers[spec.id];
  if (!renderer) throw new Error(`No plot renderer for ${spec.id}`);
  const svg = await renderer(spec);
  await writeFile(path.join(outputDirectory, `${spec.id}.svg`), `${svg}\n`, "utf8");
}

console.log(`Generated ${specs.length} plots in ${path.relative(root, outputDirectory)}.`);

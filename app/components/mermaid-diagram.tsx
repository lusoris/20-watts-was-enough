"use client";

import { type CSSProperties, useEffect, useId, useState } from "react";

type RenderedDiagram = {
  svg: string;
  shape: "wide" | "standard" | "tall";
  width?: number;
};

function classifyDiagram(renderedSvg: string): Omit<RenderedDiagram, "svg"> {
  const viewBox = renderedSvg.match(
    /viewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i,
  );

  if (!viewBox) return { shape: "standard" };

  const intrinsicWidth = Number(viewBox[1]);
  const intrinsicHeight = Number(viewBox[2]);
  const aspectRatio = intrinsicWidth / intrinsicHeight;

  if (aspectRatio > 1.8) {
    return {
      shape: "wide",
      width: Math.round(
        Math.min(1800, Math.max(1120, intrinsicWidth * 0.75)),
      ),
    };
  }

  if (aspectRatio < 0.7) return { shape: "tall" };
  return { shape: "standard" };
}

const roleKeywords = {
  decision: ["gate", "decide", "reject", "retire", "accept", "compare", "qualify", "pass?", "hold?"],
  evidence: ["evidence", "measure", "observation", "telemetry", "sensor", "outcome", "source", "claim", "audit"],
  resource: ["energy", "power", "cost", "resource", "budget", "thermal", "capacity", "material"],
  memory: ["memory", "replay", "store", "archive", "trace", "provenance", "ledger", "checkpoint", "record"],
  action: ["action", "route", "control", "adapt", "learn", "train", "repair", "restore", "recover", "select", "specialize", "update"],
} as const;

function cleanDiagramLabel(value: string): string {
  const cleaned = value
    .replace(/<br\s*\/?>/gi, " · ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/["'`*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length <= 72) return cleaned;
  return `${cleaned.slice(0, 69).trimEnd()}...`;
}

function diagramKind(chart: string): string {
  if (/^\s*stateDiagram/im.test(chart)) return "State-transition diagram";
  if (/^\s*sequenceDiagram/im.test(chart)) return "Sequence diagram";
  if (/^\s*(?:classDiagram|erDiagram)/im.test(chart)) return "Relationship diagram";
  if (/^\s*gantt/im.test(chart)) return "Timeline diagram";
  return "Process diagram";
}

function semanticDiagramCaption(chart: string, contextHeading?: string): string {
  const declaredCaption = chart.match(/^\s*%%\s*caption:\s*(.+)$/im)?.[1]?.trim();
  if (declaredCaption) return declaredCaption;

  const kind = diagramKind(chart);
  const quoted = [...chart.matchAll(/["']([^"'\n]{3,160})["']/g)].map((match) => match[1]);
  const bracketed = [...chart.matchAll(/[[({]([^\])}\n]{3,160})[\])}]/g)].map((match) => match[1]);
  const edgeLabels = [...chart.matchAll(/\|([^|\n]{3,160})\|/g)].map((match) => match[1]);
  const identifiers = [...chart.matchAll(/^\s*([A-Za-z][\w-]{2,})\s*(?:-->|---|==>)/gm)]
    .map((match) => match[1]);
  const labels = [...quoted, ...bracketed, ...edgeLabels, ...identifiers]
    .map(cleanDiagramLabel)
    .filter(
      (label) =>
        label.length >= 3 &&
        !/^(yes|no|pass|fail|true|false|state|graph|flowchart)$/i.test(label) &&
        !/^(?:classDef|style)\b/i.test(label),
    );
  const uniqueLabels = [...new Set(labels)].slice(0, 2);
  const context = contextHeading ? ` for ${cleanDiagramLabel(contextHeading)}` : "";
  const flow = uniqueLabels.length > 0 ? ` Key elements: ${uniqueLabels.join("; ")}.` : "";
  return `${kind}${context}.${flow}`;
}

function decorateDiagram(renderedSvg: string): string {
  const template = document.createElement("template");
  template.innerHTML = renderedSvg;
  const svg = template.content.querySelector("svg");
  if (!svg) return renderedSvg;

  for (const node of svg.querySelectorAll("g.node")) {
    const label = (node.textContent ?? "").toLowerCase();
    const role = Object.entries(roleKeywords).find(([, keywords]) =>
      keywords.some((keyword) => label.includes(keyword)),
    )?.[0] ?? "system";
    node.classList.add(`diagram-role-${role}`);
  }
  return svg.outerHTML;
}

export function MermaidDiagram({
  chart,
  contextHeading,
}: {
  chart: string;
  contextHeading?: string;
}) {
  const reactId = useId();
  const [rendered, setRendered] = useState<RenderedDiagram | null>(null);
  const [error, setError] = useState("");
  const caption = semanticDiagramCaption(chart, contextHeading);
  const captionId = `caption-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    let active = true;
    const diagramId = `diagram-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

    import("mermaid")
      .then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            darkMode: true,
            background: "#0f1712",
            mainBkg: "#334155",
            primaryColor: "#334155",
            primaryTextColor: "#f8fafc",
            primaryBorderColor: "#94a3b8",
            nodeBorder: "#94a3b8",
            nodeTextColor: "#f8fafc",
            lineColor: "#b8c4bc",
            defaultLinkColor: "#b8c4bc",
            secondaryColor: "#173b5f",
            tertiaryColor: "#3c2764",
            clusterBkg: "#16231b",
            clusterBorder: "#6a8f76",
            edgeLabelBackground: "#0f1712",
            stateBkg: "#3c2764",
            stateBorder: "#c4b5fd",
            stateLabelColor: "#fbf8ff",
            transitionColor: "#b8c4bc",
            transitionLabelColor: "#f8fafc",
            fontFamily: "var(--font-sans)",
          },
        });
        return mermaid.render(diagramId, chart.trim());
      })
      .then(({ svg: renderedSvg }) => {
        if (!active) return;
        const decoratedSvg = decorateDiagram(renderedSvg);
        setRendered({ svg: decoratedSvg, ...classifyDiagram(decoratedSvg) });
        setError("");
      })
      .catch((renderError: unknown) => {
        if (!active) return;
        setRendered(null);
        setError(
          renderError instanceof Error
            ? renderError.message
            : "The Mermaid source could not be rendered.",
        );
      });

    return () => {
      active = false;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <figure className="diagram diagram-error">
        <figcaption>Diagram render error</figcaption>
        <pre>{chart}</pre>
        <p>{error}</p>
      </figure>
    );
  }

  if (!rendered) {
    return <div className="diagram diagram-loading">Rendering diagram…</div>;
  }

  const canvasStyle = rendered.width
    ? ({ "--diagram-width": `${rendered.width}px` } as CSSProperties)
    : undefined;

  return (
    <figure
      className={`semantic-figure diagram diagram-${rendered.shape}`}
      aria-labelledby={captionId}
    >
      {rendered.shape === "wide" ? (
        <p className="diagram-layout-note">
          Wide diagram · scroll horizontally on narrow screens
        </p>
      ) : null}
      <div
        className="diagram-canvas"
        aria-hidden="true"
        style={canvasStyle}
        dangerouslySetInnerHTML={{ __html: rendered.svg }}
      />
      <figcaption id={captionId}>{caption}</figcaption>
    </figure>
  );
}

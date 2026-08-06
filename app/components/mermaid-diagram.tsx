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

function decorateDiagram(renderedSvg: string): string {
  const document = new DOMParser().parseFromString(renderedSvg, "image/svg+xml");
  for (const node of document.querySelectorAll("g.node")) {
    const label = (node.textContent ?? "").toLowerCase();
    const role = Object.entries(roleKeywords).find(([, keywords]) =>
      keywords.some((keyword) => label.includes(keyword)),
    )?.[0] ?? "system";
    node.classList.add(`diagram-role-${role}`);
  }
  return new XMLSerializer().serializeToString(document.documentElement);
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const reactId = useId();
  const [rendered, setRendered] = useState<RenderedDiagram | null>(null);
  const [error, setError] = useState("");

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
      className={`diagram diagram-${rendered.shape}`}
      aria-label="Rendered Mermaid diagram"
    >
      {rendered.shape === "wide" ? (
        <figcaption className="diagram-caption">
          Wide diagram · fit to page
        </figcaption>
      ) : null}
      <div
        className="diagram-canvas"
        style={canvasStyle}
        dangerouslySetInnerHTML={{ __html: rendered.svg }}
      />
    </figure>
  );
}

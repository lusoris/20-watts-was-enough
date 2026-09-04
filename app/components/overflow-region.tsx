"use client";

import { useEffect, useRef, useState } from "react";

type OverflowRegionAttributes = {
  role?: "group" | "region";
  "aria-label"?: string;
  "aria-describedby"?: string;
  tabIndex?: 0;
};

type HorizontalOverflowRegionOptions = {
  descriptionId?: string;
  refreshKey?: unknown;
  role?: "group" | "region";
};

export function useHorizontalOverflowRegion<T extends HTMLElement>(
  label: string,
  {
    descriptionId,
    refreshKey,
    role = "group",
  }: HorizontalOverflowRegionOptions = {},
) {
  const regionRef = useRef<T>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) {
      setOverflows(false);
      return;
    }

    let active = true;
    let animationFrame = 0;
    const printMedia = window.matchMedia("print");
    let printing = printMedia.matches;
    const retireAttributes = () => {
      region.removeAttribute("role");
      region.removeAttribute("aria-label");
      region.removeAttribute("aria-describedby");
      region.removeAttribute("tabindex");
    };
    const measure = () => {
      if (!active) return;
      const next = !printing && region.scrollWidth > region.clientWidth + 1;
      setOverflows((current) => current === next ? current : next);
    };
    const scheduleMeasure = () => {
      if (!active) return;
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(measure);
    };
    const retireForPrint = () => {
      printing = true;
      retireAttributes();
      setOverflows(false);
    };
    const restoreAfterPrint = () => {
      printing = false;
      scheduleMeasure();
    };
    const handlePrintMediaChange = () => {
      if (printMedia.matches) retireForPrint();
      else restoreAfterPrint();
    };

    measure();
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", scheduleMeasure);
    } else {
      observer = new ResizeObserver(scheduleMeasure);
      observer.observe(region);
      for (const child of region.children) observer.observe(child);
    }
    void document.fonts?.ready.then(scheduleMeasure);
    printMedia.addEventListener("change", handlePrintMediaChange);
    window.addEventListener("beforeprint", retireForPrint);
    window.addEventListener("afterprint", restoreAfterPrint);

    return () => {
      active = false;
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      printMedia.removeEventListener("change", handlePrintMediaChange);
      window.removeEventListener("beforeprint", retireForPrint);
      window.removeEventListener("afterprint", restoreAfterPrint);
    };
  }, [descriptionId, label, refreshKey, role]);

  const regionProps: OverflowRegionAttributes = overflows
    ? {
        role,
        "aria-label": label,
        ...(descriptionId ? { "aria-describedby": descriptionId } : {}),
        tabIndex: 0,
      }
    : {};
  return { overflows, regionProps, regionRef };
}

export function OverflowRegionCue({ subject }: { subject: string }) {
  return (
    <span className="overflow-region-cue" aria-hidden="true">
      <span>Wide {subject}</span>
      <span>Scroll horizontally ↔</span>
    </span>
  );
}

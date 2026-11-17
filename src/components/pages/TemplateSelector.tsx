"use client";

import { Check } from "lucide-react";
import { useDragDrop } from "../DraggableContext";
import { TEMPLATES, deserializeZones, type TemplateDef, type Thumb } from "./templates";

/** Small schematic of a layout, drawn from the template's colours. */
function TemplateThumb({ thumb }: { thumb: Thumb }) {
  const { layout, fill, accent } = thumb;
  const line = (x: number, y: number, w: number, c = "#d8dfde", h = 3) => (
    <rect x={x} y={y} width={w} height={h} rx={1.5} fill={c} />
  );
  const lines = (x: number, y: number, w: number, n: number, c?: string) =>
    Array.from({ length: n }, (_, i) => line(x, y + i * 8, i % 3 === 2 ? w * 0.7 : w, c)).map((el, i) => (
      <g key={`${x}-${y}-${i}`}>{el}</g>
    ));
  const onFill = "rgba(255,255,255,0.55)";

  return (
    <svg viewBox="0 0 100 141" className="block h-auto w-full" aria-hidden="true">
      <rect width="100" height="141" fill="#fff" />
      {layout === "sidebar-left" && (
        <>
          <rect width="32" height="141" fill={fill} />
          <circle cx="16" cy="18" r="8" fill={fill === "#333333" ? "#666" : "#c9d3d2"} />
          {lines(6, 34, 20, 4, fill === "#333333" ? onFill : undefined)}
          {line(6, 72, 14, accent)}
          {lines(6, 80, 20, 3, fill === "#333333" ? onFill : undefined)}
          {line(40, 12, 40, "#2b3536", 5)}
          {line(40, 21, 28, accent)}
          {line(40, 38, 22, accent)}
          {lines(40, 46, 52, 5)}
          {line(40, 92, 22, accent)}
          {lines(40, 100, 52, 4)}
        </>
      )}
      {layout === "sidebar-right" && (
        <>
          <rect x="66" width="34" height="141" fill={fill} />
          <circle cx="83" cy="18" r="8" fill="rgba(255,255,255,0.35)" />
          {lines(72, 34, 22, 4, onFill)}
          {lines(72, 72, 22, 5, onFill)}
          {line(8, 12, 40, "#2b3536", 5)}
          {line(8, 21, 28, accent)}
          {line(8, 38, 22, accent)}
          {lines(8, 46, 50, 5)}
          {line(8, 92, 22, accent)}
          {lines(8, 100, 50, 4)}
        </>
      )}
      {layout === "band-split" && (
        <>
          <rect width="100" height="34" fill={fill} />
          {line(8, 10, 44, "#fff", 5)}
          {line(8, 19, 26, accent)}
          {lines(8, 25, 60, 1, onFill)}
          <rect x="64" y="34" width="36" height="107" fill="#f2f6f5" />
          <rect x="64" y="34" width="36" height="2" fill={accent} />
          {line(8, 44, 22, accent)}
          {lines(8, 52, 48, 5)}
          {line(8, 96, 22, accent)}
          {lines(8, 104, 48, 4)}
          {line(70, 44, 16, accent)}
          {lines(70, 52, 24, 6)}
        </>
      )}
      {layout === "single" && (
        <>
          {line(28, 12, 44, fill, 5)}
          {line(34, 21, 32, accent)}
          {line(20, 28, 60, "#e3e8e7")}
          <rect x="10" y="35" width="80" height="0.8" fill={accent} />
          {line(10, 44, 22, accent)}
          {lines(10, 52, 80, 4)}
          {line(10, 88, 22, accent)}
          {lines(10, 96, 80, 4)}
        </>
      )}
      {layout === "banner" && (
        <>
          <rect width="100" height="30" fill={fill} />
          <circle cx="18" cy="15" r="9" fill="rgba(255,255,255,0.4)" />
          {line(32, 10, 40, "#fff", 5)}
          {line(32, 19, 26, onFill)}
          {lines(8, 36, 84, 2)}
          {line(8, 54, 20, accent)}
          {lines(8, 62, 48, 6)}
          {line(64, 54, 18, accent)}
          {lines(64, 62, 28, 6)}
        </>
      )}
    </svg>
  );
}

export default function TemplateSelector() {
  const { templateKey, setTemplateKey, setSelectedTemplate, setFontOptions, setDroppedItems } = useDragDrop();

  const choose = (t: TemplateDef) => {
    setTemplateKey(t.key);
    setSelectedTemplate(() => t.template);
    setFontOptions(() => ({ ...t.style }));
    setDroppedItems(() => deserializeZones(t.zones));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Switching keeps everything you wrote. Colors, fonts and section order reset to the template’s defaults.
      </p>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5">
        {TEMPLATES.map((t) => {
          const active = t.key === templateKey;
          return (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => choose(t)}
                aria-pressed={active}
                className="group w-full text-left"
              >
                <span
                  className={`relative block overflow-hidden rounded-md border-2 transition-colors ${
                    active ? "border-mint" : "border-line group-hover:border-ink/40"
                  }`}
                >
                  <TemplateThumb thumb={t.thumb} />
                  {active && (
                    <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-mint text-ink">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                </span>
                <span className="mt-2 block text-sm font-medium">{t.label}</span>
                <span className="block text-xs leading-snug text-muted-foreground">{t.description}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

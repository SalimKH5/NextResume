"use client";

import { useDragDrop } from "./DraggableContext";
import { Switch } from "./ui/switch";
import { RESUME_FONTS } from "@/fonts/resumeFonts";
import { useI18n } from "@/i18n/I18nProvider";


const SWATCHES = [
  { hex: "#06191b", name: "Ink" },
  { hex: "#333333", name: "Graphite" },
  { hex: "#1e3a5f", name: "Navy" },
  { hex: "#0f766e", name: "Teal" },
  { hex: "#077a59", name: "Green" },
  { hex: "#2f7480", name: "Sea" },
  { hex: "#8a6a2f", name: "Bronze" },
  { hex: "#9f1239", name: "Wine" },
];

type NumKey = "textSize" | "titleSize" | "paddingHorizontal" | "paddingVertical" | "SpaceContent" | "SpaceInside";
type ColorKey = "BackgroundColor" | "primaryColor" | "secondColor";
type ToggleKey = "displayOneLine" | "diplayDateLine" | "diplayLanguageLine";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 border-t border-line pt-4">
      <legend className="float-left mb-1 w-full text-sm font-medium">{title}</legend>
      {children}
    </fieldset>
  );
}

export default function Options() {
  const { fontOptions, setFontOptions } = useDragDrop();
  const { t } = useI18n();
  const o = t.editor.style;
  const set = <K extends keyof OptionsStyle>(key: K, value: OptionsStyle[K]) =>
    setFontOptions((prev) => ({ ...prev, [key]: value }));

  const color = (key: ColorKey, label: string, hint: string) => {
    const value = (fontOptions[key] as string) || "#000000";
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={`opt-${key}`} className="text-sm">
            {label}
            <span className="block text-xs text-muted-foreground">{hint}</span>
          </label>
          <input
            id={`opt-${key}`}
            type="color"
            value={value}
            onChange={(e) => set(key, e.target.value)}
            className="h-9 w-12 cursor-pointer rounded border border-line bg-transparent p-0.5"
          />
        </div>
        <div className="flex gap-1.5" role="group" aria-label={`${label} presets`}>
          {SWATCHES.map(({ hex, name }) => (
            <button
              key={hex}
              type="button"
              aria-label={`${label}: ${name}`}
              title={name}
              aria-pressed={value.toLowerCase() === hex}
              onClick={() => set(key, hex)}
              className={`size-6 rounded-full border ${value.toLowerCase() === hex ? "ring-2 ring-ink ring-offset-2" : "border-line"}`}
              style={{ background: hex }}
            />
          ))}
        </div>
      </div>
    );
  };

  const range = (key: NumKey, label: string, min: number, max: number, unit = "") => {
    const value = Number(fontOptions[key] ?? min);
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-sm">
          <label htmlFor={`opt-${key}`}>{label}</label>
          <span className="tabular-nums text-muted-foreground">
            {value}
            {unit}
          </span>
        </div>
        <input
          id={`opt-${key}`}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => set(key, parseInt(e.target.value, 10))}
          className="w-full accent-[var(--ink)]"
        />
      </div>
    );
  };

  const toggle = (key: ToggleKey, label: string) => (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
      {label}
      <Switch checked={!!fontOptions[key]} onCheckedChange={(checked) => set(key, checked)} />
    </label>
  );

  return (
    <div className="flex flex-col gap-6">
      <Group title={o.colors}>
        {color("BackgroundColor", o.fill, o.fillHint)}
        {color("primaryColor", o.onFill, o.onFillHint)}
        {color("secondColor", o.accent, o.accentHint)}
      </Group>

      <Group title={o.typography}>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label={o.font}>
          <span className="text-sm">{o.font}</span>
          {(["sans", "serif"] as const).map((kind) => (
            <div key={kind} className="grid grid-cols-2 gap-1.5">
              {RESUME_FONTS.filter((f) => f.kind === kind).map((f) => {
                const active = fontOptions.font === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => set("font", f.value)}
                    className={`flex flex-col items-start rounded-md border px-2.5 py-2 text-left transition-colors ${
                      active ? "border-mint bg-mint-wash" : "border-line hover:border-ink/30"
                    }`}
                  >
                    <span className="text-lg leading-none" style={{ fontFamily: f.value }} aria-hidden="true">
                      Aa
                    </span>
                    <span className="mt-1 text-xs" style={{ fontFamily: f.value }}>
                      {f.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        {range("textSize", o.textSize, 11, 20, "px")}
        {range("titleSize", o.titleSize, 13, 28, "px")}
      </Group>

      <Group title={o.spacing}>
        {range("paddingHorizontal", o.sideMargins, 0, 12)}
        {range("paddingVertical", o.topMargin, 0, 20)}
        {range("SpaceContent", o.between, 5, 40, "px")}
        {range("SpaceInside", o.inside, 0, 30, "px")}
      </Group>

      <Group title={o.layout}>
        {toggle("displayOneLine", o.oneLine)}
        {toggle("diplayDateLine", o.dateLine)}
        {toggle("diplayLanguageLine", o.langLine)}
      </Group>
    </div>
  );
}

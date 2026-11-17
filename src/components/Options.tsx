"use client";

import { useDragDrop } from "./DraggableContext";
import { Switch } from "./ui/switch";
import { useI18n } from "@/i18n/I18nProvider";

const FONTS = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Trebuchet", value: "Trebuchet MS, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Garamond", value: "Garamond, Georgia, serif" },
  { label: "Courier New", value: "Courier New, monospace" },
];

const SWATCHES = ["#06191b", "#333333", "#1e3a5f", "#0f766e", "#0a9e73", "#479099", "#8a6a2f", "#9f1239"];

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
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              onClick={() => set(key, c)}
              className={`size-5 rounded-full border ${value.toLowerCase() === c ? "ring-2 ring-mint ring-offset-1" : "border-line"}`}
              style={{ background: c }}
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="opt-font" className="text-sm">
            {o.font}
          </label>
          <select
            id="opt-font"
            value={fontOptions.font}
            onChange={(e) => set("font", e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            style={{ fontFamily: fontOptions.font }}
          >
            {FONTS.map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </select>
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

"use client";

import { useId, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { PhoneInput } from "./phone-input";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import ProfilePhoto, { PHOTO_DEFAULTS, fileToPhoto, isPhoto } from "./ProfilePhoto";

/** Photo block of the Details panel: upload, show/hide, shape, size, ring. */
function PhotoSettings() {
  const { information, setInformations, fontOptions, setFontOptions } = useDragDrop();
  const { t } = useI18n();
  const p = t.editor.photo;
  const fileId = useId();
  const [error, setError] = useState(false);
  const has = isPhoto(information?.picture?.label);
  const shown = !!information?.picture?.display;
  const shape = fontOptions.photoShape ?? PHOTO_DEFAULTS.shape;
  const size = fontOptions.photoSize ?? PHOTO_DEFAULTS.size;

  const setPicture = (patch: Partial<DisplayComponent>) =>
    setInformations((prev) => ({ ...prev, picture: { label: prev.picture?.label ?? "", display: prev.picture?.display ?? true, ...patch } }));

  return (
    <fieldset className="flex flex-col gap-4 rounded-lg border border-line p-4">
      <legend className="px-1 text-sm font-medium">{p.title}</legend>
      <div className="flex items-center gap-4">
        <div className="pointer-events-none origin-left scale-75">
          <ProfilePhoto />
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor={fileId}
            className="inline-flex cursor-pointer items-center justify-center rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-mint-wash focus-within:outline-2"
          >
            {has ? p.change : p.upload}
            <input
              id={fileId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                try {
                  setPicture({ label: await fileToPhoto(file), display: true });
                  setError(false);
                } catch {
                  setError(true);
                }
              }}
            />
          </label>
          {has && (
            <button type="button" onClick={() => setPicture({ label: "" })} className="self-start text-xs text-muted-foreground underline-offset-2 hover:text-destructive hover:underline">
              {p.remove}
            </button>
          )}
        </div>
      </div>
      <p className={`text-xs ${error ? "text-destructive" : "text-muted-foreground"}`} role={error ? "alert" : undefined}>
        {error ? p.error : p.hint}
      </p>

      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
        {p.show}
        <Switch checked={shown} onCheckedChange={(checked) => setPicture({ display: checked })} />
      </label>

      {shown && (
        <>
          <div className="flex flex-col gap-1.5" role="radiogroup" aria-label={p.shape}>
            <span className="text-sm">{p.shape}</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(["circle", "rounded", "square"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={shape === s}
                  onClick={() => setFontOptions((prev) => ({ ...prev, photoShape: s }))}
                  className={`flex flex-col items-center gap-1 rounded-md border py-2 text-xs ${shape === s ? "border-mint bg-mint-wash" : "border-line hover:border-ink/30"}`}
                >
                  <span aria-hidden="true" className="size-5 bg-ink/70" style={{ borderRadius: s === "circle" ? "50%" : s === "rounded" ? "22%" : "6%" }} />
                  {p[s]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor={`${fileId}-size`}>{p.size}</label>
              <span className="tabular-nums text-muted-foreground">{size}px</span>
            </div>
            <input
              id={`${fileId}-size`}
              type="range"
              min={64}
              max={160}
              step={4}
              value={size}
              onChange={(e) => setFontOptions((prev) => ({ ...prev, photoSize: parseInt(e.target.value, 10) }))}
              className="w-full accent-[var(--ink)]"
            />
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
            {p.ring}
            <Switch
              checked={fontOptions.photoRing ?? PHOTO_DEFAULTS.ring}
              onCheckedChange={(checked) => setFontOptions((prev) => ({ ...prev, photoRing: checked }))}
            />
          </label>
        </>
      )}
    </fieldset>
  );
}

type Toggleable = "email" | "phonenumber" | "locations";

/** "Details" panel: the header of the resume. Every field has a real label. */
export default function PersonalInformation() {
  const { information, setInformations } = useDragDrop();
  const { t } = useI18n();
  const d = t.editor.details;
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const setToggle = (key: Toggleable, patch: Partial<DisplayComponent>) =>
    setInformations((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  /** A text-like field that can be hidden from the resume with a switch. */
  const row = (key: Toggleable, label: string, control: React.ReactNode) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id(key)} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">{control}</div>
        <Switch
          checked={!!information[key]?.display}
          onCheckedChange={(checked) => setToggle(key, { display: checked })}
          aria-label={`${d.show}: ${label}`}
          title={d.show}
        />
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id("title")} className="text-sm font-medium">
          {d.jobTitle}
        </label>
        <Input
          id={id("title")}
          value={information.title}
          onChange={(e) => setInformations((prev) => ({ ...prev, title: e.target.value }))}
          className="h-10"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={id("summary")} className="text-sm font-medium">
          {d.summary}
        </label>
        <Textarea
          id={id("summary")}
          rows={5}
          value={information.CatchPhrase}
          onChange={(e) => setInformations((prev) => ({ ...prev, CatchPhrase: e.target.value }))}
          aria-describedby={id("summary-hint")}
        />
        <p id={id("summary-hint")} className="text-xs text-muted-foreground">
          {d.summaryHint}
        </p>
      </div>

      <p className="text-xs text-muted-foreground">{d.switchHint}</p>

      {row(
        "email",
        d.email,
        <Input
          id={id("email")}
          type="email"
          autoComplete="email"
          value={information.email?.label ?? ""}
          onChange={(e) => setToggle("email", { label: e.target.value })}
          className="h-10"
        />
      )}
      {row(
        "phonenumber",
        d.phone,
        <PhoneInput
          id={id("phonenumber")}
          value={information.phonenumber?.label}
          onChange={(value) => setToggle("phonenumber", { label: value ?? "" })}
          defaultCountry="FR"
        />
      )}
      {row(
        "locations",
        d.location,
        <Input
          id={id("locations")}
          autoComplete="address-level2"
          value={information.locations?.label ?? ""}
          onChange={(e) => setToggle("locations", { label: e.target.value })}
          className="h-10"
        />
      )}

      <PhotoSettings />
    </div>
  );
}

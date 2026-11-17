"use client";

import { useId } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { PhoneInput } from "./phone-input";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";

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

      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
        {d.showPicture}
        <Switch
          checked={!!information?.picture?.display}
          onCheckedChange={(checked) =>
            setInformations((prev) => ({
              ...prev,
              picture: { display: checked, label: prev?.picture?.label ?? "" },
            }))
          }
        />
      </label>
    </div>
  );
}

"use client";

import { Sparkles } from "lucide-react";
import { useDragDrop } from "../DraggableContext";
import { DateRange } from "../DateRange";
import { nextId } from "./EntryDialog";
import { useI18n } from "@/i18n/I18nProvider";

type Kind = "experience" | "education";

/**
 * Shown in an empty Experience / Education section, in the editor only (never
 * printed): a faded example entry in the resume language, with a button that
 * turns it into a real entry the user can then edit.
 */
export function SectionExample({ kind }: { kind: Kind }) {
  const { information, setInformations, fontOptions } = useDragDrop();
  const { t } = useI18n();
  const ex = t.editor.example[kind];
  const field = kind === "experience" ? "Expriences" : "Educations";
  const subtitle = kind === "experience" ? (ex as typeof t.editor.example.experience).company : (ex as typeof t.editor.example.education).school;

  const use = () =>
    setInformations((prev) => {
      const list = (prev[field] as (Experience | Educations)[] | undefined) ?? [];
      const entry =
        kind === "experience"
          ? ({ id: nextId(list), title: ex.title, entrepriseName: subtitle, location: ex.location, date_started: ex.start, date_ending: ex.end, subItems: ex.body } as Experience)
          : ({ id: nextId(list), title: ex.title, school: subtitle, location: ex.location, date_started: ex.start, date_ending: ex.end, subItems: ex.body } as Educations);
      return { ...prev, [field]: [...list, entry] };
    });

  return (
    <div data-editor-only className="no-print relative rounded-md border border-dashed border-mint/70 bg-mint/5 p-3">
      <span
        className="absolute -top-2.5 left-3 rounded-full bg-mint px-2 py-px text-[10px] font-semibold uppercase tracking-wide text-ink"
        style={{ fontFamily: "'DM Sans Variable', system-ui, sans-serif" }}
      >
        {t.editor.example.badge}
      </span>
      <div className="pointer-events-none select-none opacity-60" aria-hidden="true">
        <div className={`flex ${fontOptions.diplayDateLine ? "items-center justify-between" : "flex-col"}`}>
          <p className="font-bold" style={{ fontSize: fontOptions.textSize }}>
            {ex.title}
          </p>
          <DateRange start={ex.start} end={ex.end} />
        </div>
        <p className="text-xs">
          {subtitle} | {ex.location}
        </p>
        <div className="ProseMirror px-4" dangerouslySetInnerHTML={{ __html: ex.body }} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3" style={{ fontFamily: "'DM Sans Variable', system-ui, sans-serif", fontSize: 13 }}>
        <button
          type="button"
          onClick={use}
          className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 font-medium text-white hover:bg-ink/85"
        >
          <Sparkles className="size-3.5" />
          {t.editor.example.use}
        </button>
        <span className="text-muted-foreground">{t.editor.example.hint}</span>
      </div>
    </div>
  );
}

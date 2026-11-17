"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import TipTapEditor from "../TipTapEditor";
import { EntryDialog, Field, triggerFor, useEntryForm } from "./EntryDialog";
import { useI18n } from "@/i18n/I18nProvider";
import { Briefcase, GraduationCap } from "lucide-react";

type Kind = "experience" | "education";

export type TimelineFormProps = {
  children: ReactNode;
  /** Accessible name of the icon button that opens the form. */
  label?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: number;
};

const PRESENT = "currently";

/** Shared add/edit popup for Experience and Education entries. */
export function TimelineForm({ kind, children, label, open, setOpen, id }: TimelineFormProps & { kind: Kind }) {
  const { t } = useI18n();
  const f = t.editor.forms;
  const copy = f[kind];

  // Both entry types share dates, location and description; the "name" fields differ.
  const field = kind === "experience" ? "Expriences" : "Educations";
  const { item, setItem, save, isEdit } = useEntryForm<Experience & Educations>(field, id, open, () => ({
    title: "",
    date_started: "",
    date_ending: "",
    location: "",
    subItems: "",
    entrepriseName: "",
    school: "",
  }));
  const set = <K extends keyof (Experience & Educations)>(k: K, v: (Experience & Educations)[K]) =>
    setItem((prev) => ({ ...prev, [k]: v }));

  const current = item.date_ending === PRESENT;
  const endBeforeStart = !current && !!item.date_started && !!item.date_ending && item.date_ending < item.date_started;
  const canSave = item.title.trim().length > 0 && !endBeforeStart;

  return (
    <EntryDialog
      open={open}
      setOpen={setOpen}
      trigger={triggerFor(children, label)}
      title={isEdit ? copy.edit : copy.add}
      description={copy.desc}
      canSave={canSave}
      onSave={save}
      icon={kind === "experience" ? Briefcase : GraduationCap}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={kind === "experience" ? f.experience.role : f.education.degree} className="sm:col-span-2">
          {(fid) => (
            <Input id={fid} required autoFocus value={item.title} onChange={(e) => set("title", e.target.value)} className="h-11" />
          )}
        </Field>
        <Field label={kind === "experience" ? f.experience.company : f.education.school} optional>
          {(fid) =>
            kind === "experience" ? (
              <Input id={fid} value={item.entrepriseName ?? ""} onChange={(e) => set("entrepriseName", e.target.value)} className="h-11" />
            ) : (
              <Input id={fid} value={item.school ?? ""} onChange={(e) => set("school", e.target.value)} className="h-11" />
            )
          }
        </Field>
        <Field label={copy.location} optional>
          {(fid) => <Input id={fid} value={item.location} onChange={(e) => set("location", e.target.value)} className="h-11" />}
        </Field>

        <Field label={f.start} optional>
          {(fid) => <Input id={fid} type="month" value={item.date_started} onChange={(e) => set("date_started", e.target.value)} className="h-11" />}
        </Field>
        <Field label={f.end} optional>
          {(fid) => (
            <Input
              id={fid}
              type="month"
              disabled={current}
              value={current ? "" : item.date_ending}
              min={item.date_started || undefined}
              onChange={(e) => set("date_ending", e.target.value)}
              aria-invalid={endBeforeStart || undefined}
              className="h-11"
            />
          )}
        </Field>
        <label className="flex cursor-pointer items-center gap-3 text-sm sm:col-span-2">
          <Switch checked={current} onCheckedChange={(on) => set("date_ending", on ? PRESENT : "")} />
          {f.present}
        </label>
        {endBeforeStart && (
          <p role="alert" className="-mt-2 text-sm text-destructive sm:col-span-2">
            {f.endBeforeStart}
          </p>
        )}

        <Field label={f.description} optional className="sm:col-span-2">
          {(fid) => <TipTapEditor labelledBy={`${fid}-label`} value={item.subItems} onChange={(e) => set("subItems", e.target.value)} />}
        </Field>
      </div>
    </EntryDialog>
  );
}

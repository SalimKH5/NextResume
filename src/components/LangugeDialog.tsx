"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import TipTapEditor from "./TipTapEditor";
import { EntryDialog, Field, triggerFor, useEntryForm } from "./editor/EntryDialog";
import { useI18n } from "@/i18n/I18nProvider";
import { Languages } from "lucide-react";

type Props = {
  children: ReactNode;
  label?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: number;
};

/** Add / edit a language, with an optional level bar. */
export default function LangugeDialog({ children, label, open, setOpen, id }: Props) {
  const { t } = useI18n();
  const copy = t.editor.forms.language;
  const { item, setItem, save, isEdit } = useEntryForm<Languge>("Languages", id, open, () => ({
    label: "",
    value: "",
    valuebar: undefined,
  }));
  const showBar = item.valuebar !== undefined && item.valuebar !== null;

  return (
    <EntryDialog
      open={open}
      setOpen={setOpen}
      trigger={triggerFor(children, label)}
      title={isEdit ? copy.edit : copy.add}
      description={copy.desc}
      canSave={item.label.trim().length > 0}
      onSave={save}
      icon={Languages}
    >
      <Field label={copy.name}>
        {(fid) => (
          <Input id={fid} required autoFocus value={item.label} onChange={(e) => setItem((p) => ({ ...p, label: e.target.value }))} className="h-11" />
        )}
      </Field>

      <div className="flex flex-col gap-3 rounded-md border border-line p-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          {/* turning the bar on starts at 50% (it used to show 50% but save nothing) */}
          <Switch checked={showBar} onCheckedChange={(on) => setItem((p) => ({ ...p, valuebar: on ? p.valuebar ?? 50 : undefined }))} />
          {copy.showBar}
        </label>
        {showBar && (
          <Field label={copy.level}>
            {(fid) => (
              <div className="flex items-center gap-3">
                <input
                  id={fid}
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={item.valuebar ?? 50}
                  onChange={(e) => setItem((p) => ({ ...p, valuebar: parseInt(e.target.value, 10) }))}
                  className="flex-1 accent-[var(--ink)]"
                />
                <output htmlFor={fid} className="w-12 text-right text-sm tabular-nums">
                  {item.valuebar ?? 50}%
                </output>
              </div>
            )}
          </Field>
        )}
      </div>

      <Field label={copy.details} optional>
        {(fid) => (
          <TipTapEditor labelledBy={`${fid}-label`} value={item.value} onChange={(e) => setItem((p) => ({ ...p, value: e.target.value }))} />
        )}
      </Field>
    </EntryDialog>
  );
}

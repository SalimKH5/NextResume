"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import TipTapEditor from "./TipTapEditor";
import { EntryDialog, Field, triggerFor, useEntryForm } from "./editor/EntryDialog";
import { useI18n } from "@/i18n/I18nProvider";
import { Lightbulb } from "lucide-react";

type Props = {
  children: ReactNode;
  label?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: number;
};

/** Add / edit a skill group ("Frontend: React, TypeScript"). */
export default function SkillsForm({ children, label, open, setOpen, id }: Props) {
  const { t } = useI18n();
  const copy = t.editor.forms.skill;
  const { item, setItem, save, isEdit } = useEntryForm<Skills>("skills", id, open, () => ({ skill: "", subItems: "" }));

  return (
    <EntryDialog
      open={open}
      setOpen={setOpen}
      trigger={triggerFor(children, label)}
      title={isEdit ? copy.edit : copy.add}
      description={copy.desc}
      canSave={item.skill.trim().length > 0}
      onSave={save}
      icon={Lightbulb}
    >
      <Field label={copy.name}>
        {(fid) => (
          <Input id={fid} required autoFocus value={item.skill} onChange={(e) => setItem((p) => ({ ...p, skill: e.target.value }))} className="h-11" />
        )}
      </Field>
      <Field label={copy.details} optional>
        {(fid) => (
          <TipTapEditor labelledBy={`${fid}-label`} value={item.subItems} onChange={(e) => setItem((p) => ({ ...p, subItems: e.target.value }))} />
        )}
      </Field>
    </EntryDialog>
  );
}
